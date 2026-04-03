<?php
/**
 * Search index builder for Dash.
 *
 * Creates and maintains the wp_dash_index table that powers both
 * client-side JSON search and server-side AJAX fallback.
 *
 * @package Dash
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class Dash_Index
 *
 * Singleton that manages the custom search index table.
 * Flattens posts, pages, CPTs, settings pages, and quick actions
 * into a single searchable table with FULLTEXT indexing.
 */
class Dash_Index {

	/**
	 * Singleton instance.
	 *
	 * @var self|null
	 */
	private static ?self $instance = null;

	/**
	 * The index table name (with prefix).
	 *
	 * @var string
	 */
	private string $table_name;

	/**
	 * Private constructor.
	 */
	private function __construct() {
		global $wpdb;
		$this->table_name = $wpdb->prefix . 'dash_index';
	}

	/**
	 * Get singleton instance.
	 *
	 * @return self
	 */
	public static function get_instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Get the table name.
	 *
	 * @return string
	 */
	public function get_table_name(): string {
		return $this->table_name;
	}

	/**
	 * Register WordPress hooks for real-time index updates.
	 */
	public function register_hooks(): void {
		add_action( 'save_post', array( $this, 'on_save_post' ), 10, 2 );
		add_action( 'delete_post', array( $this, 'on_delete_post' ) );
		add_action( 'transition_post_status', array( $this, 'on_transition_post_status' ), 10, 3 );
		add_action( 'wp_ajax_dash_get_index', array( $this, 'ajax_get_index' ) );
	}

	/**
	 * Create or update the index table.
	 *
	 * Uses dbDelta for safe upgrades.
	 */
	public function create_table(): void {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE {$this->table_name} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			item_type varchar(32) NOT NULL DEFAULT '',
			item_id bigint(20) unsigned NOT NULL DEFAULT 0,
			title varchar(255) NOT NULL DEFAULT '',
			url varchar(2048) NOT NULL DEFAULT '',
			icon varchar(64) NOT NULL DEFAULT '',
			capability varchar(64) NOT NULL DEFAULT '',
			keywords text NOT NULL,
			item_status varchar(32) NOT NULL DEFAULT 'publish',
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			UNIQUE KEY type_item (item_type, item_id),
			KEY item_type (item_type),
			KEY item_status (item_status),
			FULLTEXT KEY search_idx (title, keywords)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	/**
	 * Full index rebuild.
	 *
	 * Clears the index and repopulates from all sources.
	 *
	 * @param bool $force Whether to truncate before rebuilding.
	 * @return int Total items indexed.
	 */
	public function rebuild( bool $force = true ): int {
		global $wpdb;

		if ( $force ) {
			$wpdb->query( "TRUNCATE TABLE {$this->table_name}" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		}

		$count = 0;
		$count += $this->index_posts();
		$count += $this->index_settings_pages();
		$count += $this->index_quick_actions();

		/**
		 * Allow plugins to add custom items to the index during rebuild.
		 *
		 * @param int $count Current item count.
		 * @param self $index The index instance.
		 */
		$count = (int) apply_filters( 'dash_index_rebuild_count', $count, $this );

		update_option( 'dash_last_index_build', current_time( 'mysql' ) );

		// Invalidate cached JSON.
		$this->invalidate_index_cache();

		return $count;
	}

	/**
	 * Index all public post types.
	 *
	 * @return int Number of posts indexed.
	 */
	private const BATCH_SIZE = 500;

	private function index_posts(): int {
		$post_types = get_post_types( array( 'public' => true ), 'objects' );
		$count      = 0;

		foreach ( $post_types as $post_type ) {
			$capability = $post_type->cap->edit_posts ?? 'edit_posts';
			$icon       = $this->get_post_type_icon( $post_type->name );
			$offset     = 0;

			do {
				$posts = get_posts( array(
					'post_type'      => $post_type->name,
					'post_status'    => array( 'publish', 'draft', 'pending', 'future', 'private' ),
					'posts_per_page' => self::BATCH_SIZE,
					'offset'         => $offset,
					'fields'         => 'ids',
					'no_found_rows'  => true,
					'orderby'        => 'ID',
					'order'          => 'ASC',
				) );

				foreach ( $posts as $post_id ) {
					$post = get_post( $post_id );
					if ( ! $post ) {
						continue;
					}

					$this->upsert_item( array(
						'item_type'   => $post_type->name,
						'item_id'     => $post->ID,
						'title'       => $post->post_title ?: __( '(no title)', 'dash-command-bar' ),
						'url'         => get_edit_post_link( $post->ID, 'raw' ) ?: '',
						'icon'        => $icon,
						'capability'  => $capability,
						'keywords'    => $this->build_post_keywords( $post, $post_type ),
						'item_status' => $post->post_status,
					) );

					++$count;
				}

				$offset += self::BATCH_SIZE;
				wp_cache_flush();
			} while ( count( $posts ) === self::BATCH_SIZE );
		}

		return $count;
	}

	/**
	 * Build keyword string for a post.
	 *
	 * Includes post type label, status, taxonomies, and slug.
	 *
	 * @param WP_Post $post      The post object.
	 * @param object  $post_type The post type object.
	 * @return string Space-separated keywords.
	 */
	private function build_post_keywords( WP_Post $post, object $post_type ): string {
		$keywords = array(
			$post_type->labels->singular_name ?? $post_type->name,
			$post->post_status,
			$post->post_name,
		);

		// Add taxonomy terms as keywords.
		$taxonomies = get_object_taxonomies( $post->post_type, 'names' );
		foreach ( $taxonomies as $taxonomy ) {
			$terms = get_the_terms( $post->ID, $taxonomy );
			if ( is_array( $terms ) ) {
				foreach ( $terms as $term ) {
					$keywords[] = $term->name;
				}
			}
		}

		return implode( ' ', array_filter( $keywords ) );
	}

	/**
	 * Index all core settings pages and registered admin pages.
	 *
	 * @return int Number of settings pages indexed.
	 */
	private function index_settings_pages(): int {
		$settings = array(
			array(
				'title'      => __( 'General Settings', 'dash-command-bar' ),
				'url'        => admin_url( 'options-general.php' ),
				'keywords'   => 'general settings site title tagline timezone date format email',
				'capability' => 'manage_options',
			),
			array(
				'title'      => __( 'Writing Settings', 'dash-command-bar' ),
				'url'        => admin_url( 'options-writing.php' ),
				'keywords'   => 'writing settings default category post format',
				'capability' => 'manage_options',
			),
			array(
				'title'      => __( 'Reading Settings', 'dash-command-bar' ),
				'url'        => admin_url( 'options-reading.php' ),
				'keywords'   => 'reading settings homepage front page blog posts per page rss',
				'capability' => 'manage_options',
			),
			array(
				'title'      => __( 'Discussion Settings', 'dash-command-bar' ),
				'url'        => admin_url( 'options-discussion.php' ),
				'keywords'   => 'discussion settings comments moderation avatars pingback',
				'capability' => 'manage_options',
			),
			array(
				'title'      => __( 'Media Settings', 'dash-command-bar' ),
				'url'        => admin_url( 'options-media.php' ),
				'keywords'   => 'media settings image sizes thumbnail medium large uploads',
				'capability' => 'manage_options',
			),
			array(
				'title'      => __( 'Permalink Settings', 'dash-command-bar' ),
				'url'        => admin_url( 'options-permalink.php' ),
				'keywords'   => 'permalink settings url structure slug rewrite',
				'capability' => 'manage_options',
			),
			array(
				'title'      => __( 'Privacy Settings', 'dash-command-bar' ),
				'url'        => admin_url( 'options-privacy.php' ),
				'keywords'   => 'privacy settings policy page gdpr',
				'capability' => 'manage_options',
			),
			array(
				'title'      => __( 'Themes', 'dash-command-bar' ),
				'url'        => admin_url( 'themes.php' ),
				'keywords'   => 'themes appearance template customize',
				'capability' => 'switch_themes',
			),
			array(
				'title'      => __( 'Customize', 'dash-command-bar' ),
				'url'        => admin_url( 'customize.php' ),
				'keywords'   => 'customize customizer appearance colors fonts widgets menus',
				'capability' => 'customize',
			),
			array(
				'title'      => __( 'Widgets', 'dash-command-bar' ),
				'url'        => admin_url( 'widgets.php' ),
				'keywords'   => 'widgets sidebar footer area',
				'capability' => 'edit_theme_options',
			),
			array(
				'title'      => __( 'Menus', 'dash-command-bar' ),
				'url'        => admin_url( 'nav-menus.php' ),
				'keywords'   => 'menus navigation menu structure links',
				'capability' => 'edit_theme_options',
			),
			array(
				'title'      => __( 'Plugins', 'dash-command-bar' ),
				'url'        => admin_url( 'plugins.php' ),
				'keywords'   => 'plugins installed active inactive',
				'capability' => 'activate_plugins',
			),
			array(
				'title'      => __( 'Add New Plugin', 'dash-command-bar' ),
				'url'        => admin_url( 'plugin-install.php' ),
				'keywords'   => 'add new plugin install search',
				'capability' => 'install_plugins',
			),
			array(
				'title'      => __( 'Users', 'dash-command-bar' ),
				'url'        => admin_url( 'users.php' ),
				'keywords'   => 'users list members authors',
				'capability' => 'list_users',
			),
			array(
				'title'      => __( 'Add New User', 'dash-command-bar' ),
				'url'        => admin_url( 'user-new.php' ),
				'keywords'   => 'add new user create account',
				'capability' => 'create_users',
			),
			array(
				'title'      => __( 'Your Profile', 'dash-command-bar' ),
				'url'        => admin_url( 'profile.php' ),
				'keywords'   => 'profile account password email name',
				'capability' => 'read',
			),
			array(
				'title'      => __( 'Tools', 'dash-command-bar' ),
				'url'        => admin_url( 'tools.php' ),
				'keywords'   => 'tools available',
				'capability' => 'edit_posts',
			),
			array(
				'title'      => __( 'Import', 'dash-command-bar' ),
				'url'        => admin_url( 'import.php' ),
				'keywords'   => 'import content wordpress blogger csv',
				'capability' => 'import',
			),
			array(
				'title'      => __( 'Export', 'dash-command-bar' ),
				'url'        => admin_url( 'export.php' ),
				'keywords'   => 'export content download xml',
				'capability' => 'export',
			),
			array(
				'title'      => __( 'Site Health', 'dash-command-bar' ),
				'url'        => admin_url( 'site-health.php' ),
				'keywords'   => 'site health status diagnostics performance security',
				'capability' => 'view_site_health_checks',
			),
			array(
				'title'      => __( 'Updates', 'dash-command-bar' ),
				'url'        => admin_url( 'update-core.php' ),
				'keywords'   => 'updates wordpress core plugins themes',
				'capability' => 'update_core',
			),
		);

		$count = 0;
		foreach ( $settings as $i => $setting ) {
			$this->upsert_item( array(
				'item_type'   => 'setting',
				'item_id'     => abs( crc32( 'setting:' . $setting['url'] ) ),
				'title'       => $setting['title'],
				'url'         => $setting['url'],
				'icon'        => 'dashicons-admin-settings',
				'capability'  => $setting['capability'],
				'keywords'    => $setting['keywords'],
				'item_status' => 'publish',
			) );
			++$count;
		}

		return $count;
	}

	/**
	 * Index built-in quick actions.
	 *
	 * @return int Number of actions indexed.
	 */
	private function index_quick_actions(): int {
		$commands = Dash_Commands::get_instance()->get_commands();
		$count    = 0;

		foreach ( $commands as $i => $command ) {
			$this->upsert_item( array(
				'item_type'   => 'action',
				'item_id'     => abs( crc32( 'action:' . $command['id'] ) ),
				'title'       => $command['title'],
				'url'         => $command['url'] ?? '',
				'icon'        => $command['icon'] ?? 'dashicons-admin-generic',
				'capability'  => $command['capability'] ?? 'read',
				'keywords'    => implode( ' ', $command['keywords'] ?? array() ),
				'item_status' => 'publish',
			) );
			++$count;
		}

		return $count;
	}

	/**
	 * Insert or update an item in the index.
	 *
	 * @param array $item Associative array of column values.
	 */
	public function upsert_item( array $item ): void {
		global $wpdb;

		$item['updated_at'] = current_time( 'mysql' );

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$existing = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT id FROM {$this->table_name} WHERE item_type = %s AND item_id = %d",
				$item['item_type'],
				$item['item_id']
			)
		);

		if ( $existing ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->update(
				$this->table_name,
				$item,
				array( 'id' => $existing )
			);
		} else {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->insert( $this->table_name, $item );
		}
	}

	/**
	 * Remove an item from the index.
	 *
	 * @param string $item_type The item type.
	 * @param int    $item_id   The item ID.
	 */
	public function remove_item( string $item_type, int $item_id ): void {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$wpdb->delete(
			$this->table_name,
			array(
				'item_type' => $item_type,
				'item_id'   => $item_id,
			)
		);

		$this->invalidate_index_cache();
	}

	/**
	 * Real-time hook: update index when a post is saved.
	 *
	 * @param int     $post_id The post ID.
	 * @param WP_Post $post    The post object.
	 */
	public function on_save_post( int $post_id, WP_Post $post ): void {
		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return;
		}

		$post_type = get_post_type_object( $post->post_type );
		if ( ! $post_type || ! $post_type->public ) {
			return;
		}

		$this->upsert_item( array(
			'item_type'   => $post->post_type,
			'item_id'     => $post->ID,
			'title'       => $post->post_title ?: __( '(no title)', 'dash-command-bar' ),
			'url'         => get_edit_post_link( $post->ID, 'raw' ) ?: '',
			'icon'        => $this->get_post_type_icon( $post->post_type ),
			'capability'  => $post_type->cap->edit_posts ?? 'edit_posts',
			'keywords'    => $this->build_post_keywords( $post, $post_type ),
			'item_status' => $post->post_status,
		) );

		$this->invalidate_index_cache();
	}

	/**
	 * Real-time hook: remove post from index on delete.
	 *
	 * @param int $post_id The post ID.
	 */
	public function on_delete_post( int $post_id ): void {
		$post = get_post( $post_id );
		if ( ! $post ) {
			return;
		}

		$this->remove_item( $post->post_type, $post_id );
	}

	/**
	 * Real-time hook: update index on post status transition.
	 *
	 * @param string  $new_status New post status.
	 * @param string  $old_status Old post status.
	 * @param WP_Post $post       The post object.
	 */
	public function on_transition_post_status( string $new_status, string $old_status, WP_Post $post ): void {
		if ( $new_status === $old_status ) {
			return;
		}

		if ( 'trash' === $new_status ) {
			$this->remove_item( $post->post_type, $post->ID );
			return;
		}

		// Re-index with new status.
		$this->on_save_post( $post->ID, $post );
	}

	/**
	 * AJAX endpoint: serve the full index as compressed JSON.
	 *
	 * Used by client-side search for sites under the threshold.
	 */
	public function ajax_get_index(): void {
		check_ajax_referer( 'dash_search', '_wpnonce' );

		$user = wp_get_current_user();

		// Check cache first.
		$cache_key = 'dash_index_json_' . implode( '_', $user->roles );
		$cached    = get_transient( $cache_key );
		if ( false !== $cached ) {
			wp_send_json_success( json_decode( $cached, true ) );
		}

		$items = $this->get_items_for_user( $user );

		// Cache for 5 minutes, per role.
		set_transient( $cache_key, wp_json_encode( $items ), 5 * MINUTE_IN_SECONDS );

		wp_send_json_success( $items );
	}

	/**
	 * Get all index items the current user can access.
	 *
	 * @param WP_User $user The user object.
	 * @return array Array of items the user can access.
	 */
	public function get_items_for_user( WP_User $user ): array {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$rows = $wpdb->get_results(
			"SELECT item_type, item_id, title, url, icon, capability, keywords, item_status
			 FROM {$this->table_name}
			 ORDER BY updated_at DESC",
			ARRAY_A
		);

		if ( ! is_array( $rows ) ) {
			return array();
		}

		// Build a lookup of commands so we can attach callback info to action items.
		$commands_lookup = array();
		if ( class_exists( 'Dash_Commands' ) ) {
			foreach ( Dash_Commands::get_instance()->get_commands() as $cmd ) {
				if ( ! empty( $cmd['callback'] ) ) {
					$commands_lookup[ $cmd['id'] ] = $cmd['callback'];
				}
			}
		}

		$items = array();
		foreach ( $rows as $row ) {
			if ( ! empty( $row['capability'] ) && ! user_can( $user, $row['capability'] ) ) {
				continue;
			}

			$item = array(
				'type'     => $row['item_type'],
				'id'       => (int) $row['item_id'],
				'title'    => $row['title'],
				'url'      => $row['url'],
				'icon'     => $row['icon'],
				'keywords' => $row['keywords'],
				'status'   => $row['item_status'],
			);

			// For action items with a callback, pass the command ID so JS can fire it via AJAX.
			if ( 'action' === $row['item_type'] ) {
				// Reverse-lookup the command ID from the stored item_id hash.
				foreach ( $commands_lookup as $cmd_id => $cb ) {
					if ( abs( crc32( 'action:' . $cmd_id ) ) === (int) $row['item_id'] ) {
						$item['action'] = $cmd_id;
						break;
					}
				}
			}

			$items[] = $item;
		}

		return $items;
	}


	/**
	 * Invalidate all role-based index caches.
	 *
	 * Clears per-role transient caches and the count cache
	 * so fresh data is served on next request.
	 */
	private function invalidate_index_cache(): void {
		global $wpdb;

		// Delete all role-based index transients.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$wpdb->query(
			"DELETE FROM {$wpdb->options}
			 WHERE option_name LIKE '\_transient\_dash\_index\_json\_%'
				OR option_name LIKE '\_transient\_timeout\_dash\_index\_json\_%'"
		);

		delete_transient( 'dash_index_count' );
	}

	/**
	 * Get total item count in the index.
	 *
	 * @return int
	 */
	public function get_count(): int {
		global $wpdb;

		$cached = get_transient( 'dash_index_count' );
		if ( false !== $cached ) {
			return (int) $cached;
		}

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$count = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$this->table_name}" );

		set_transient( 'dash_index_count', $count, HOUR_IN_SECONDS );

		return $count;
	}

	/**
	 * Get item count grouped by type.
	 *
	 * @return array<string, int> Type => count.
	 */
	public function get_count_by_type(): array {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$rows = $wpdb->get_results(
			"SELECT item_type, COUNT(*) as cnt FROM {$this->table_name} GROUP BY item_type",
			ARRAY_A
		);

		$counts = array();
		foreach ( $rows as $row ) {
			$counts[ $row['item_type'] ] = (int) $row['cnt'];
		}

		return $counts;
	}

	/**
	 * Get the dashicon class for a post type.
	 *
	 * @param string $post_type The post type slug.
	 * @return string Dashicon CSS class.
	 */
	private function get_post_type_icon( string $post_type ): string {
		$map = array(
			'post'       => 'dashicons-admin-post',
			'page'       => 'dashicons-admin-page',
			'attachment' => 'dashicons-admin-media',
		);

		if ( isset( $map[ $post_type ] ) ) {
			return $map[ $post_type ];
		}

		$obj = get_post_type_object( $post_type );
		if ( $obj && ! empty( $obj->menu_icon ) ) {
			return $obj->menu_icon;
		}

		return 'dashicons-admin-post';
	}
}

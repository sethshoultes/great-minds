<?php
/**
 * Search index builder for Dash.
 *
 * Creates and maintains the wp_dash_index table that powers both
 * client-side JSON search and server-side AJAX fallback.
 *
 * Performance targets:
 *   - Index build <2s for 1K posts, <10s for 10K posts
 *   - Table uses InnoDB with FULLTEXT index (required for NATURAL LANGUAGE MODE)
 *   - Batch size of 200 prevents memory exhaustion on large sites
 *   - Only published, non-password-protected posts are indexed (security fix)
 *
 * @package Dash
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class Dash_Index
 *
 * Singleton managing the custom search index table. Flattens posts, pages,
 * CPTs, settings pages, and quick actions into a single searchable table
 * with FULLTEXT indexing on InnoDB (required for reliable FULLTEXT in MySQL 5.6+).
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
	 * Batch size for post indexing.
	 * 200 keeps peak memory below 64MB even on shared hosting.
	 *
	 * @var int
	 */
	private const BATCH_SIZE = 200;

	/**
	 * Private constructor — use get_instance().
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

		// Index admin menu pages once per hour (only in admin where $menu globals exist).
		add_action( 'admin_menu', array( $this, 'maybe_index_menu_pages' ), 9999 );
	}

	/**
	 * Create or update the index table using dbDelta.
	 *
	 * IMPORTANT: ENGINE=InnoDB is required. FULLTEXT indexes on MyISAM
	 * do not support NATURAL LANGUAGE MODE and behave inconsistently
	 * on MySQL 5.6/5.7 shared hosting. We enforce InnoDB explicitly.
	 * dbDelta handles safe upgrades — it only ALTERs, never drops data.
	 *
	 * The title_prefix KEY enables fast LIKE prefix queries for short
	 * search terms (< 3 chars) that bypass FULLTEXT.
	 */
	public function create_table(): void {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		// Detect MyISAM and log a warning — FULLTEXT is unreliable on MyISAM.
		$engine = $wpdb->get_var( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->prepare(
				'SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s LIMIT 1',
				DB_NAME,
				$wpdb->prefix . 'posts'
			)
		);

		if ( 'MyISAM' === $engine ) {
			// Log but do not block activation — InnoDB will be created regardless.
			error_log( 'Dash: Warning — site database uses MyISAM for wp_posts. The Dash index uses InnoDB. FULLTEXT search requires InnoDB. Please upgrade to InnoDB for optimal performance.' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}

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
			KEY title_prefix (title(20)),
			FULLTEXT KEY search_idx (title, keywords)
		) $charset_collate ENGINE=InnoDB;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	/**
	 * Full index rebuild. Truncates and repopulates from all sources.
	 *
	 * Called on activation and by the hourly cron.
	 *
	 * @param bool $force Whether to truncate before rebuilding (default: true).
	 * @return int Total items indexed.
	 */
	public function rebuild( bool $force = true ): int {
		global $wpdb;

		if ( $force ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->query( "TRUNCATE TABLE {$this->table_name}" );
		}

		$count  = 0;
		$count += $this->index_posts();
		$count += $this->index_settings_pages();
		$count += $this->index_quick_actions();

		/**
		 * Fires during a full index rebuild, after core items are indexed.
		 *
		 * Use this to add custom items to the index.
		 *
		 * @param int        $count The current item count.
		 * @param Dash_Index $index The index instance (call $index->upsert_item()).
		 */
		$count = (int) apply_filters( 'dash_index_rebuild_count', $count, $this );

		update_option( 'dash_last_index_build', current_time( 'mysql' ) );
		$this->invalidate_index_cache();

		return $count;
	}

	/**
	 * Index all public post types — published posts only.
	 *
	 * SECURITY: Only 'publish' status posts are indexed. Draft, private,
	 * pending, and password-protected posts are never stored so they cannot
	 * leak through direct AJAX access even if capability checks fail.
	 *
	 * PERFORMANCE: Batched in groups of BATCH_SIZE, processes IDs only in the
	 * query, then fetches individual post objects. wp_cache_flush() is NOT
	 * called inside the loop — it clears object cache unnecessarily.
	 * Instead, wp_cache_delete() is used per post after upsert.
	 *
	 * @return int Number of posts indexed.
	 */
	private function index_posts(): int {
		// Merge public types with show_ui types (catches MemberPress, WooCommerce, etc.).
		$public  = get_post_types( array( 'public' => true ), 'objects' );
		$with_ui = get_post_types( array( 'show_ui' => true ), 'objects' );
		$types   = array_merge( $public, $with_ui );
		$count   = 0;

		foreach ( $types as $post_type ) {
			$capability = $post_type->cap->edit_posts ?? 'edit_posts';
			$icon       = $this->get_post_type_icon( $post_type->name );
			$offset     = 0;

			do {
				$post_ids = get_posts( array(
					'post_type'      => $post_type->name,
					'post_status'    => array( 'publish' ), // Published only — security requirement.
					'posts_per_page' => self::BATCH_SIZE,
					'offset'         => $offset,
					'fields'         => 'ids',
					'no_found_rows'  => true,
					'orderby'        => 'ID',
					'order'          => 'ASC',
					'has_password'   => false, // Exclude password-protected posts.
				) );

				foreach ( $post_ids as $post_id ) {
					$post = get_post( $post_id );
					if ( ! $post ) {
						continue;
					}

					$edit_url = get_edit_post_link( $post->ID, 'raw' );
					if ( empty( $edit_url ) ) {
						$edit_url = admin_url( 'post.php?post=' . $post->ID . '&action=edit' );
					}

					$this->upsert_item( array(
						'item_type'   => $post_type->name,
						'item_id'     => $post->ID,
						'title'       => $post->post_title ?: __( '(no title)', 'dash-command-bar' ),
						'url'         => $edit_url,
						'icon'        => $icon,
						'capability'  => $capability,
						'keywords'    => $this->build_post_keywords( $post, $post_type ),
						'item_status' => 'publish',
					) );

					// Clear individual post cache, not the entire object cache.
					clean_post_cache( $post->ID );
					++$count;
				}

				$offset += self::BATCH_SIZE;
			} while ( count( $post_ids ) === self::BATCH_SIZE );
		}

		return $count;
	}

	/**
	 * Build keyword string for a post.
	 *
	 * Includes post type label, slug, and taxonomy terms.
	 *
	 * @param WP_Post $post      The post object.
	 * @param object  $post_type The post type object.
	 * @return string Space-separated keywords.
	 */
	private function build_post_keywords( WP_Post $post, object $post_type ): string {
		$keywords = array(
			$post_type->labels->singular_name ?? $post_type->name,
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
	 * Index all core settings pages.
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
		foreach ( $settings as $setting ) {
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
	 * Conditionally index admin menu pages if not done recently.
	 *
	 * Runs on admin_menu at low priority so all plugins have registered their pages.
	 * Throttled to once per hour to avoid hammering the DB on every page load.
	 */
	public function maybe_index_menu_pages(): void {
		$last = (int) get_option( 'dash_last_menu_index', 0 );
		if ( ( time() - $last ) < HOUR_IN_SECONDS ) {
			return;
		}

		$count = $this->index_admin_menu_pages();
		if ( $count > 0 ) {
			$this->invalidate_index_cache();
		}
		update_option( 'dash_last_menu_index', time(), false );
	}

	/**
	 * Index all registered admin menu and submenu pages.
	 *
	 * Catches plugin pages (MemberPress, WooCommerce, Yoast, etc.)
	 * registered via add_menu_page / add_submenu_page.
	 *
	 * @return int Number of menu pages indexed.
	 */
	public function index_admin_menu_pages(): int {
		global $menu, $submenu;

		if ( empty( $menu ) ) {
			return 0;
		}

		// Collect URLs already indexed in index_settings_pages to skip duplicates.
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$existing_urls = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT url FROM {$this->table_name} WHERE item_type = %s",
				'setting'
			)
		);
		$indexed_urls  = array_flip( $existing_urls );
		$count         = 0;

		// Index top-level menu items.
		foreach ( $menu as $item ) {
			if ( empty( $item[0] ) || empty( $item[2] ) ) {
				continue;
			}

			// Skip separators.
			if ( str_contains( $item[4] ?? '', 'wp-menu-separator' ) ) {
				continue;
			}

			$title = wp_strip_all_tags( $item[0] );
			$slug  = $item[2];
			$url   = $this->menu_slug_to_url( $slug );

			if ( isset( $indexed_urls[ $url ] ) ) {
				continue;
			}

			$this->upsert_item( array(
				'item_type'   => 'setting',
				'item_id'     => abs( crc32( 'menu:' . $slug ) ),
				'title'       => $title,
				'url'         => $url,
				'icon'        => $item[6] ?? 'dashicons-admin-generic',
				'capability'  => $item[1] ?? 'read',
				'keywords'    => strtolower( $title ),
				'item_status' => 'publish',
			) );

			$indexed_urls[ $url ] = true;
			++$count;
		}

		// Index submenu items.
		foreach ( $submenu as $parent_slug => $items ) {
			foreach ( $items as $item ) {
				if ( empty( $item[0] ) || empty( $item[2] ) ) {
					continue;
				}

				$title = wp_strip_all_tags( $item[0] );
				$slug  = $item[2];
				$url   = $this->menu_slug_to_url( $slug, $parent_slug );

				if ( isset( $indexed_urls[ $url ] ) ) {
					continue;
				}

				$this->upsert_item( array(
					'item_type'   => 'setting',
					'item_id'     => abs( crc32( 'menu:' . $parent_slug . ':' . $slug ) ),
					'title'       => $title,
					'url'         => $url,
					'icon'        => 'dashicons-admin-generic',
					'capability'  => $item[1] ?? 'read',
					'keywords'    => strtolower( $title ),
					'item_status' => 'publish',
				) );

				$indexed_urls[ $url ] = true;
				++$count;
			}
		}

		return $count;
	}

	/**
	 * Convert a menu slug to a full admin URL.
	 *
	 * @param string $slug        The menu page slug.
	 * @param string $parent_slug Optional parent slug for submenu items.
	 * @return string Full admin URL.
	 */
	private function menu_slug_to_url( string $slug, string $parent_slug = '' ): string {
		if ( str_starts_with( $slug, 'http' ) ) {
			return $slug;
		}

		if ( str_contains( $slug, '.php' ) ) {
			return admin_url( $slug );
		}

		if ( $parent_slug && str_contains( $parent_slug, '.php' ) ) {
			return admin_url( $parent_slug . '?page=' . $slug );
		}

		return admin_url( 'admin.php?page=' . $slug );
	}

	/**
	 * Index built-in quick actions from the commands registry.
	 *
	 * @return int Number of actions indexed.
	 */
	private function index_quick_actions(): int {
		$commands = Dash_Commands::get_instance()->get_commands();
		$count    = 0;

		foreach ( $commands as $command ) {
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
	 * Uses INSERT ... ON DUPLICATE KEY UPDATE for atomic upsert,
	 * which is significantly faster than the SELECT + UPDATE/INSERT
	 * two-query pattern used in the original implementation.
	 *
	 * @param array $item Associative array of column values.
	 */
	public function upsert_item( array $item ): void {
		global $wpdb;

		$item['updated_at'] = current_time( 'mysql' );

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$wpdb->query(
			$wpdb->prepare(
				"INSERT INTO {$this->table_name}
				(item_type, item_id, title, url, icon, capability, keywords, item_status, updated_at)
				VALUES (%s, %d, %s, %s, %s, %s, %s, %s, %s)
				ON DUPLICATE KEY UPDATE
				title       = VALUES(title),
				url         = VALUES(url),
				icon        = VALUES(icon),
				capability  = VALUES(capability),
				keywords    = VALUES(keywords),
				item_status = VALUES(item_status),
				updated_at  = VALUES(updated_at)",
				$item['item_type'],
				$item['item_id'],
				$item['title'],
				$item['url'],
				$item['icon'],
				$item['capability'],
				$item['keywords'],
				$item['item_status'],
				$item['updated_at']
			)
		);
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
			),
			array( '%s', '%d' )
		);

		$this->invalidate_index_cache();
	}

	/**
	 * Real-time hook: update index when a post is saved.
	 *
	 * SECURITY: Only published, non-password-protected posts are indexed.
	 * If a post transitions away from published (e.g., back to draft or
	 * gets a password), it is removed from the index immediately.
	 *
	 * @param int     $post_id The post ID.
	 * @param WP_Post $post    The post object.
	 */
	public function on_save_post( int $post_id, WP_Post $post ): void {
		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return;
		}

		$post_type = get_post_type_object( $post->post_type );
		if ( ! $post_type ) {
			return;
		}

		// Only index public post types with published status and no password.
		// Any other combination: remove from index (handles unpublishing, adding passwords, etc.).
		if ( ! $post_type->public || 'publish' !== $post->post_status || ! empty( $post->post_password ) ) {
			$this->remove_item( $post->post_type, $post->ID );
			return;
		}

		$edit_url = get_edit_post_link( $post->ID, 'raw' ) ?: admin_url( 'post.php?post=' . $post->ID . '&action=edit' );

		$this->upsert_item( array(
			'item_type'   => $post->post_type,
			'item_id'     => $post->ID,
			'title'       => $post->post_title ?: __( '(no title)', 'dash-command-bar' ),
			'url'         => $edit_url,
			'icon'        => $this->get_post_type_icon( $post->post_type ),
			'capability'  => $post_type->cap->edit_posts ?? 'edit_posts',
			'keywords'    => $this->build_post_keywords( $post, $post_type ),
			'item_status' => 'publish',
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
		if ( $post ) {
			$this->remove_item( $post->post_type, $post_id );
		}
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

		// Delegate to on_save_post which handles all publish/unpublish logic.
		$this->on_save_post( $post->ID, $post );
	}

	/**
	 * AJAX endpoint: serve the full index as JSON for client-side search.
	 *
	 * Cached per user role for 5 minutes. Sites under DASH_CLIENT_INDEX_THRESHOLD
	 * items load this once and search locally in <50ms.
	 *
	 * SECURITY: Requires a logged-in user and valid nonce.
	 */
	public function ajax_get_index(): void {
		check_ajax_referer( 'dash_search', '_wpnonce' );

		if ( ! is_user_logged_in() ) {
			wp_send_json_error( 'Unauthorized', 401 );
		}

		$user  = wp_get_current_user();
		$roles = ! empty( $user->roles ) ? $user->roles : array( 'no_role' );

		// Cache key per role — editors and subscribers see different items.
		$cache_key = 'dash_index_json_' . md5( implode( ',', $roles ) );
		$cached    = get_transient( $cache_key );

		if ( false !== $cached ) {
			wp_send_json_success( json_decode( $cached, true ) );
		}

		$items = $this->get_items_for_user( $user );

		set_transient( $cache_key, wp_json_encode( $items ), 5 * MINUTE_IN_SECONDS );

		wp_send_json_success( $items );
	}

	/**
	 * Get all index items the current user can access.
	 *
	 * Items are filtered by capability after retrieval. This is acceptable
	 * because only published posts are in the index (security defense in depth).
	 *
	 * @param WP_User $user The user object.
	 * @return array Array of items accessible by the user.
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

		// Build a lookup of commands with callbacks so JS knows to fire AJAX vs navigate.
		$commands_lookup = array();
		if ( class_exists( 'Dash_Commands' ) ) {
			foreach ( Dash_Commands::get_instance()->get_commands() as $cmd ) {
				if ( ! empty( $cmd['callback'] ) ) {
					$commands_lookup[ $cmd['id'] ] = true;
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
			);

			// For action items, attach the command ID so JS can fire it via AJAX.
			if ( 'action' === $row['item_type'] ) {
				foreach ( $commands_lookup as $cmd_id => $has_callback ) {
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
	 * Serialize the index to a JSON string for client-side delivery.
	 *
	 * @param WP_User|null $user Optional user to filter by. Defaults to current user.
	 * @return string JSON-encoded index.
	 */
	public function get_json_index( ?WP_User $user = null ): string {
		if ( null === $user ) {
			$user = wp_get_current_user();
		}
		return wp_json_encode( $this->get_items_for_user( $user ) );
	}

	/**
	 * Invalidate all role-based index caches.
	 *
	 * Direct DB delete is necessary here — WordPress has no API for
	 * pattern-based transient deletion. We escape the LIKE prefix
	 * correctly to avoid nuking unrelated transients.
	 */
	private function invalidate_index_cache(): void {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$wpdb->query(
			"DELETE FROM {$wpdb->options}
			 WHERE option_name LIKE '\\_transient\\_dash\\_index\\_json\\_%'
			    OR option_name LIKE '\\_transient\\_timeout\\_dash\\_index\\_json\\_%'"
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
		foreach ( (array) $rows as $row ) {
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
		if ( $obj && ! empty( $obj->menu_icon ) && str_starts_with( (string) $obj->menu_icon, 'dashicons-' ) ) {
			return $obj->menu_icon;
		}

		return 'dashicons-admin-post';
	}
}

<?php
/**
 * Built-in commands registry for Dash.
 *
 * Registers the default quick actions available in command mode (> prefix):
 * new post, new page, upload media, view site, clear cache, rebuild index,
 * and navigation shortcuts to all core admin sections.
 *
 * Third-party plugins extend this via the dash_commands filter.
 *
 * @package Dash
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class Dash_Commands
 *
 * Manages the command palette actions triggered in > prefix mode.
 *
 * Each command definition:
 *   id         (string) Unique identifier. Used for AJAX execution.
 *   title      (string) Display label shown in results.
 *   url        (string) URL to navigate to (navigation commands).
 *   callback   (string) Internal callback key (executable commands — no URL).
 *   icon       (string) Dashicons CSS class.
 *   capability (string) Required WordPress capability to see/use this command.
 *   keywords   (array)  Additional search terms that surface this command.
 *   confirm    (string) Optional confirmation prompt before executing.
 */
class Dash_Commands {

	/**
	 * Singleton instance.
	 *
	 * @var self|null
	 */
	private static ?self $instance = null;

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
	 * Register hooks.
	 */
	public function register_hooks(): void {
		add_action( 'wp_ajax_dash_execute_command', array( $this, 'ajax_execute_command' ) );
	}

	/**
	 * Get all registered commands, filtered by the dash_commands hook.
	 *
	 * Merges built-in commands with third-party commands from dash_commands filter.
	 * Results are not capability-filtered here — filtering happens at render time
	 * so the full list is available for index building.
	 *
	 * @return array Array of command definitions.
	 */
	public function get_commands(): array {
		$commands = $this->get_builtin_commands();

		/**
		 * Filter the list of available Dash commands.
		 *
		 * Use this to register custom commands from your plugin.
		 *
		 * Example:
		 *
		 *   add_filter( 'dash_commands', function( array $commands ): array {
		 *       $commands[] = array(
		 *           'id'         => 'my-plugin-action',
		 *           'title'      => 'Run My Plugin Action',
		 *           'callback'   => 'my_plugin_dash_action',
		 *           'icon'       => 'dashicons-admin-generic',
		 *           'capability' => 'manage_options',
		 *           'keywords'   => array( 'my plugin', 'action' ),
		 *           'confirm'    => 'Are you sure?', // Optional.
		 *       );
		 *       return $commands;
		 *   } );
		 *
		 *   // Then handle execution via the dash_execute_command filter:
		 *   add_filter( 'dash_execute_command', function( $result, string $callback ): ?array {
		 *       if ( 'my_plugin_dash_action' !== $callback ) {
		 *           return $result;
		 *       }
		 *       // Do your thing.
		 *       return array( 'message' => 'Done.' );
		 *   }, 10, 2 );
		 *
		 * @param array $commands Array of command definition arrays.
		 */
		return apply_filters( 'dash_commands', $commands );
	}

	/**
	 * Get built-in commands.
	 *
	 * @return array
	 */
	private function get_builtin_commands(): array {
		$commands = array(

			// ---- Content creation ----

			array(
				'id'         => 'new-post',
				'title'      => __( 'New Post', 'dash-command-bar' ),
				'url'        => admin_url( 'post-new.php' ),
				'icon'       => 'dashicons-plus-alt',
				'capability' => 'edit_posts',
				'keywords'   => array( 'create', 'write', 'add', 'post', 'blog' ),
			),
			array(
				'id'         => 'new-page',
				'title'      => __( 'New Page', 'dash-command-bar' ),
				'url'        => admin_url( 'post-new.php?post_type=page' ),
				'icon'       => 'dashicons-plus-alt',
				'capability' => 'edit_pages',
				'keywords'   => array( 'create', 'add', 'page' ),
			),
			array(
				'id'         => 'new-media',
				'title'      => __( 'Upload Media', 'dash-command-bar' ),
				'url'        => admin_url( 'media-new.php' ),
				'icon'       => 'dashicons-upload',
				'capability' => 'upload_files',
				'keywords'   => array( 'upload', 'media', 'image', 'file', 'photo', 'video' ),
			),

			// ---- Navigation ----

			array(
				'id'         => 'view-site',
				'title'      => __( 'View Site', 'dash-command-bar' ),
				'url'        => home_url( '/' ),
				'icon'       => 'dashicons-external',
				'capability' => 'read',
				'keywords'   => array( 'visit', 'frontend', 'home', 'view', 'site' ),
			),
			array(
				'id'         => 'dashboard',
				'title'      => __( 'Dashboard', 'dash-command-bar' ),
				'url'        => admin_url(),
				'icon'       => 'dashicons-dashboard',
				'capability' => 'read',
				'keywords'   => array( 'home', 'dashboard', 'admin' ),
			),
			array(
				'id'         => 'all-posts',
				'title'      => __( 'All Posts', 'dash-command-bar' ),
				'url'        => admin_url( 'edit.php' ),
				'icon'       => 'dashicons-admin-post',
				'capability' => 'edit_posts',
				'keywords'   => array( 'posts', 'list', 'manage', 'blog' ),
			),
			array(
				'id'         => 'all-pages',
				'title'      => __( 'All Pages', 'dash-command-bar' ),
				'url'        => admin_url( 'edit.php?post_type=page' ),
				'icon'       => 'dashicons-admin-page',
				'capability' => 'edit_pages',
				'keywords'   => array( 'pages', 'list', 'manage' ),
			),
			array(
				'id'         => 'media-library',
				'title'      => __( 'Media Library', 'dash-command-bar' ),
				'url'        => admin_url( 'upload.php' ),
				'icon'       => 'dashicons-admin-media',
				'capability' => 'upload_files',
				'keywords'   => array( 'media', 'images', 'files', 'library', 'gallery' ),
			),
			array(
				'id'         => 'comments',
				'title'      => __( 'Comments', 'dash-command-bar' ),
				'url'        => admin_url( 'edit-comments.php' ),
				'icon'       => 'dashicons-admin-comments',
				'capability' => 'moderate_comments',
				'keywords'   => array( 'comments', 'moderation', 'discussion' ),
			),
			array(
				'id'         => 'plugins-page',
				'title'      => __( 'Plugins', 'dash-command-bar' ),
				'url'        => admin_url( 'plugins.php' ),
				'icon'       => 'dashicons-admin-plugins',
				'capability' => 'activate_plugins',
				'keywords'   => array( 'plugins', 'installed', 'active', 'inactive' ),
			),
			array(
				'id'         => 'updates-page',
				'title'      => __( 'Updates', 'dash-command-bar' ),
				'url'        => admin_url( 'update-core.php' ),
				'icon'       => 'dashicons-update',
				'capability' => 'update_core',
				'keywords'   => array( 'updates', 'wordpress', 'core', 'plugins', 'themes' ),
			),
			array(
				'id'         => 'settings-general',
				'title'      => __( 'General Settings', 'dash-command-bar' ),
				'url'        => admin_url( 'options-general.php' ),
				'icon'       => 'dashicons-admin-settings',
				'capability' => 'manage_options',
				'keywords'   => array( 'settings', 'general', 'site title', 'tagline', 'timezone' ),
			),
			array(
				'id'         => 'settings-permalink',
				'title'      => __( 'Permalink Settings', 'dash-command-bar' ),
				'url'        => admin_url( 'options-permalink.php' ),
				'icon'       => 'dashicons-admin-settings',
				'capability' => 'manage_options',
				'keywords'   => array( 'permalink', 'url', 'slug', 'rewrite', 'settings' ),
			),
			array(
				'id'         => 'users-page',
				'title'      => __( 'Users', 'dash-command-bar' ),
				'url'        => admin_url( 'users.php' ),
				'icon'       => 'dashicons-admin-users',
				'capability' => 'list_users',
				'keywords'   => array( 'users', 'members', 'authors', 'accounts' ),
			),

			// ---- Executable actions ----

			array(
				'id'         => 'clear-cache',
				'title'      => __( 'Clear Cache', 'dash-command-bar' ),
				'callback'   => 'dash_cmd_clear_cache',
				'icon'       => 'dashicons-trash',
				'capability' => 'manage_options',
				'keywords'   => array( 'clear', 'cache', 'flush', 'purge', 'transients' ),
				'confirm'    => __( 'Clear all transients and flush object cache?', 'dash-command-bar' ),
			),
			array(
				'id'         => 'reindex',
				'title'      => __( 'Rebuild Dash Index', 'dash-command-bar' ),
				'callback'   => 'dash_cmd_reindex',
				'icon'       => 'dashicons-update',
				'capability' => 'manage_options',
				'keywords'   => array( 'reindex', 'rebuild', 'refresh', 'search', 'index', 'dash' ),
			),
		);

		// Dynamically add "New [CPT]" commands for registered custom post types.
		$custom_types = get_post_types(
			array(
				'public'   => true,
				'_builtin' => false,
			),
			'objects'
		);

		foreach ( $custom_types as $cpt ) {
			if ( ! $cpt->show_in_admin_bar ) {
				continue;
			}

			$commands[] = array(
				'id'         => 'new-' . $cpt->name,
				'title'      => sprintf(
					/* translators: %s: singular post type name */
					__( 'New %s', 'dash-command-bar' ),
					$cpt->labels->singular_name
				),
				'url'        => admin_url( 'post-new.php?post_type=' . $cpt->name ),
				'icon'       => ! empty( $cpt->menu_icon ) && str_starts_with( (string) $cpt->menu_icon, 'dashicons-' )
					? $cpt->menu_icon
					: 'dashicons-plus-alt',
				'capability' => $cpt->cap->edit_posts ?? 'edit_posts',
				'keywords'   => array( 'create', 'new', 'add', $cpt->name, $cpt->labels->singular_name ),
			);
		}

		return $commands;
	}

	/**
	 * AJAX: Execute a server-side command.
	 *
	 * Validates the command exists, the user has the required capability,
	 * and the command has an executable callback before running.
	 */
	public function ajax_execute_command(): void {
		check_ajax_referer( 'dash_search', '_wpnonce' );

		$command_id = isset( $_POST['command'] ) ? sanitize_key( $_POST['command'] ) : '';

		if ( '' === $command_id ) {
			wp_send_json_error( 'Missing command ID' );
		}

		$commands = $this->get_commands();
		$command  = null;

		foreach ( $commands as $cmd ) {
			if ( $cmd['id'] === $command_id ) {
				$command = $cmd;
				break;
			}
		}

		if ( ! $command ) {
			wp_send_json_error( 'Unknown command', 400 );
		}

		if ( ! empty( $command['capability'] ) && ! current_user_can( $command['capability'] ) ) {
			wp_send_json_error( 'Insufficient permissions', 403 );
		}

		if ( empty( $command['callback'] ) ) {
			wp_send_json_error( 'Command has no callback' );
		}

		$result = $this->execute( $command['callback'] );
		wp_send_json_success( $result );
	}

	/**
	 * Execute a named command callback.
	 *
	 * Built-in callbacks are handled in the switch. Third-party callbacks
	 * should be handled via the dash_execute_command filter.
	 *
	 * @param string $callback The callback key.
	 * @return array Result array with a 'message' key.
	 */
	private function execute( string $callback ): array {
		switch ( $callback ) {
			case 'dash_cmd_clear_cache':
				return $this->cmd_clear_cache();

			case 'dash_cmd_reindex':
				return $this->cmd_reindex();

			default:
				/**
				 * Handle custom command execution.
				 *
				 * Return a non-null array to claim the callback. Return null to pass.
				 *
				 * @param array|null $result   The result (null if unhandled).
				 * @param string     $callback The callback key.
				 */
				$result = apply_filters( 'dash_execute_command', null, $callback );

				if ( is_array( $result ) ) {
					return $result;
				}

				return array( 'message' => __( 'Unknown command.', 'dash-command-bar' ) );
		}
	}

	/**
	 * Command: Clear expired transients and flush object cache.
	 *
	 * Uses WordPress core delete_expired_transients() which is safe and
	 * avoids deleting non-expired transients that other plugins may need.
	 *
	 * @return array
	 */
	private function cmd_clear_cache(): array {
		delete_expired_transients( true );
		wp_cache_flush();

		return array(
			'message' => __( 'Cache cleared. Expired transients removed and object cache flushed.', 'dash-command-bar' ),
		);
	}

	/**
	 * Command: Rebuild the Dash search index.
	 *
	 * @return array
	 */
	private function cmd_reindex(): array {
		$count = Dash_Index::get_instance()->rebuild();

		return array(
			'message' => sprintf(
				/* translators: %d: number of items indexed */
				__( 'Index rebuilt. %d items indexed.', 'dash-command-bar' ),
				$count
			),
		);
	}
}

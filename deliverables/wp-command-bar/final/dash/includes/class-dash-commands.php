<?php
/**
 * Built-in commands registry for Dash.
 *
 * Registers the default quick actions: new post, new page,
 * view site, clear cache, toggle maintenance mode, etc.
 * Third-party plugins extend this via the dash_commands filter.
 *
 * @package Dash
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class Dash_Commands
 *
 * Manages the built-in command palette actions (> prefix mode).
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
	 * Get all registered commands.
	 *
	 * Merges built-in commands with third-party commands via dash_commands filter.
	 *
	 * @return array Array of command definitions.
	 */
	public function get_commands(): array {
		$commands = $this->get_builtin_commands();

		/**
		 * Filter the list of available Dash commands.
		 *
		 * Each command is an array with keys:
		 *   - id         (string) Unique identifier.
		 *   - title      (string) Display title.
		 *   - url        (string) URL to navigate to (for navigation commands).
		 *   - callback   (string) AJAX action name (for executable commands).
		 *   - icon       (string) Dashicons CSS class.
		 *   - capability (string) Required WordPress capability.
		 *   - keywords   (array)  Additional search keywords.
		 *   - confirm    (string) Optional confirmation message before executing.
		 *
		 * @param array $commands The registered commands.
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
			// Content creation.
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

			// Navigation.
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

			// Actions (server-side executable).
			array(
				'id'         => 'clear-cache',
				'title'      => __( 'Clear Cache', 'dash-command-bar' ),
				'callback'   => 'dash_cmd_clear_cache',
				'icon'       => 'dashicons-trash',
				'capability' => 'manage_options',
				'keywords'   => array( 'clear', 'cache', 'flush', 'purge', 'transients' ),
				'confirm'    => __( 'Clear all transients and object cache?', 'dash-command-bar' ),
			),
			array(
				'id'         => 'reindex',
				'title'      => __( 'Rebuild Dash Index', 'dash-command-bar' ),
				'callback'   => 'dash_cmd_reindex',
				'icon'       => 'dashicons-update',
				'capability' => 'manage_options',
				'keywords'   => array( 'reindex', 'rebuild', 'refresh', 'search', 'index' ),
			),
		);

		// Add "New [CPT]" commands for custom post types.
		$custom_types = get_post_types(
			array(
				'public'   => true,
				'_builtin' => false,
			),
			'objects'
		);

		foreach ( $custom_types as $cpt ) {
			$commands[] = array(
				'id'         => 'new-' . $cpt->name,
				'title'      => sprintf(
					/* translators: %s: post type singular name */
					__( 'New %s', 'dash-command-bar' ),
					$cpt->labels->singular_name
				),
				'url'        => admin_url( 'post-new.php?post_type=' . $cpt->name ),
				'icon'       => ! empty( $cpt->menu_icon ) ? $cpt->menu_icon : 'dashicons-plus-alt',
				'capability' => $cpt->cap->edit_posts ?? 'edit_posts',
				'keywords'   => array( 'create', 'new', 'add', $cpt->name, $cpt->labels->singular_name ),
			);
		}

		return $commands;
	}

	/**
	 * AJAX: Execute a server-side command.
	 */
	public function ajax_execute_command(): void {
		check_ajax_referer( 'dash_search', '_wpnonce' );

		$command_id = isset( $_POST['command'] ) ? sanitize_key( $_POST['command'] ) : '';

		if ( empty( $command_id ) ) {
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
	 * @param string $callback The callback action name.
	 * @return array Result with message key.
	 */
	private function execute( string $callback ): array {
		switch ( $callback ) {
			case 'dash_cmd_clear_cache':
				return $this->cmd_clear_cache();

			case 'dash_cmd_reindex':
				return $this->cmd_reindex();

			default:
				/**
				 * Allow plugins to handle custom command execution.
				 *
				 * @param array|null $result   The command result (null if unhandled).
				 * @param string     $callback The callback name.
				 */
				$result = apply_filters( 'dash_execute_command', null, $callback );
				if ( is_array( $result ) ) {
					return $result;
				}

				return array( 'message' => __( 'Unknown command', 'dash-command-bar' ) );
		}
	}

	/**
	 * Command: Clear all transients and flush object cache.
	 *
	 * @return array
	 */
	private function cmd_clear_cache(): array {
		// Use WordPress core function for safe transient cleanup.
		delete_expired_transients( true );

		// Flush object cache if available.
		if ( function_exists( 'wp_cache_flush' ) ) {
			wp_cache_flush();
		}

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

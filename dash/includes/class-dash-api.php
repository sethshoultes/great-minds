<?php
/**
 * Developer API for Dash.
 *
 * Orchestrates the filter-based API that third-party plugins use
 * to register custom commands, search results, and categories.
 *
 * API surface:
 *   - dash_commands         — Register static commands
 *   - dash_search_results   — Add dynamic search results
 *   - dash_categories       — Register custom result categories
 *   - dash_execute_command  — Handle custom command execution
 *   - dash_before_render    — Action before modal renders
 *   - dash_index_rebuild_count — Hook into index rebuild
 *
 * @package Dash
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class Dash_Api
 *
 * Provides the developer-facing API and AJAX endpoints
 * for third-party integration.
 */
class Dash_Api {

	/**
	 * Singleton instance.
	 *
	 * @var self|null
	 */
	private static ?self $instance = null;

	/**
	 * Default result categories.
	 *
	 * @var array
	 */
	private array $default_categories = array();

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
		add_action( 'wp_ajax_dash_get_commands', array( $this, 'ajax_get_commands' ) );
		add_action( 'wp_ajax_dash_get_categories', array( $this, 'ajax_get_categories' ) );
		add_action( 'admin_footer', array( $this, 'render_hook' ) );
	}

	/**
	 * AJAX: Get all commands the current user can access.
	 *
	 * Returns the full command list filtered by user capabilities.
	 */
	public function ajax_get_commands(): void {
		check_ajax_referer( 'dash_search', '_wpnonce' );

		$commands = Dash_Commands::get_instance()->get_commands();
		$user     = wp_get_current_user();

		// Capability-filter commands.
		$accessible = array();
		foreach ( $commands as $command ) {
			$cap = $command['capability'] ?? 'read';
			if ( user_can( $user, $cap ) ) {
				$accessible[] = array(
					'id'       => $command['id'],
					'title'    => $command['title'],
					'url'      => $command['url'] ?? '',
					'callback' => ! empty( $command['callback'] ),
					'icon'     => $command['icon'] ?? 'dashicons-admin-generic',
					'keywords' => $command['keywords'] ?? array(),
					'confirm'  => $command['confirm'] ?? '',
				);
			}
		}

		wp_send_json_success( $accessible );
	}

	/**
	 * Get all registered categories.
	 *
	 * @return array Array of category definitions.
	 */
	public function get_categories(): array {
		$categories = array(
			array(
				'id'    => 'post',
				'label' => __( 'Posts', 'dash-command-bar' ),
				'icon'  => 'dashicons-admin-post',
			),
			array(
				'id'    => 'page',
				'label' => __( 'Pages', 'dash-command-bar' ),
				'icon'  => 'dashicons-admin-page',
			),
			array(
				'id'    => 'setting',
				'label' => __( 'Settings', 'dash-command-bar' ),
				'icon'  => 'dashicons-admin-settings',
			),
			array(
				'id'    => 'action',
				'label' => __( 'Actions', 'dash-command-bar' ),
				'icon'  => 'dashicons-performance',
			),
			array(
				'id'    => 'user',
				'label' => __( 'Users', 'dash-command-bar' ),
				'icon'  => 'dashicons-admin-users',
			),
		);

		// Add categories for custom post types.
		$custom_types = get_post_types(
			array(
				'public'   => true,
				'_builtin' => false,
			),
			'objects'
		);

		foreach ( $custom_types as $cpt ) {
			$categories[] = array(
				'id'    => $cpt->name,
				'label' => $cpt->labels->name,
				'icon'  => ! empty( $cpt->menu_icon ) ? $cpt->menu_icon : 'dashicons-admin-post',
			);
		}

		/**
		 * Filter the available result categories.
		 *
		 * Each category is an array with keys:
		 *   - id    (string) Category identifier (matches item_type in index).
		 *   - label (string) Human-readable label.
		 *   - icon  (string) Dashicons CSS class.
		 *
		 * @param array $categories The registered categories.
		 */
		return apply_filters( 'dash_categories', $categories );
	}

	/**
	 * AJAX: Get all categories.
	 */
	public function ajax_get_categories(): void {
		check_ajax_referer( 'dash_search', '_wpnonce' );
		wp_send_json_success( $this->get_categories() );
	}

	/**
	 * Fire the before_render action in admin footer.
	 *
	 * Allows plugins to inject custom CSS/JS before the modal renders.
	 */
	public function render_hook(): void {
		/**
		 * Fires before the Dash command bar modal is available.
		 *
		 * Use this to enqueue additional scripts or styles that
		 * integrate with the command bar.
		 */
		do_action( 'dash_before_render' );
	}
}

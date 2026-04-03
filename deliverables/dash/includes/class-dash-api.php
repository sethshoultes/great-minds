<?php
/**
 * Developer API for Dash.
 *
 * This class orchestrates the filter-based extension API.
 * Third-party plugins integrate with Dash exclusively through
 * WordPress filters and actions — no custom functions to memorize.
 *
 * ============================================================
 * COMPLETE API REFERENCE
 * ============================================================
 *
 * FILTERS
 * -------
 *
 * dash_commands
 *   Add or modify commands shown in command mode (> prefix).
 *
 *   Signature: apply_filters( 'dash_commands', array $commands ): array
 *
 *   Each command is an associative array:
 *     id         (string, required)  Unique identifier.
 *     title      (string, required)  Display label in results.
 *     url        (string)            URL to navigate to. Use for nav commands.
 *     callback   (string)            Callback key for executable commands.
 *                                    Handle execution via dash_execute_command.
 *     icon       (string)            Dashicons CSS class. Default: dashicons-admin-generic.
 *     capability (string)            WP capability required to see/use this command.
 *     keywords   (array)             Additional search terms for this command.
 *     confirm    (string)            Optional confirmation message before executing.
 *
 *   Example:
 *     add_filter( 'dash_commands', function( array $commands ): array {
 *         $commands[] = array(
 *             'id'         => 'my-plugin-settings',
 *             'title'      => 'My Plugin Settings',
 *             'url'        => admin_url( 'admin.php?page=my-plugin' ),
 *             'icon'       => 'dashicons-admin-settings',
 *             'capability' => 'manage_options',
 *             'keywords'   => array( 'my plugin', 'settings', 'configure' ),
 *         );
 *         return $commands;
 *     } );
 *
 *
 * dash_search_results
 *   Add dynamic search results from your own data source during server-side search.
 *   Called after the core index query so your results blend with core results.
 *
 *   Signature: apply_filters( 'dash_search_results', array $results, string $query ): array
 *
 *   Each result is an associative array:
 *     type      (string, required)  Result type identifier (e.g. 'my-plugin').
 *     title     (string, required)  Display title.
 *     url       (string, required)  URL to navigate to on selection.
 *     icon      (string, required)  Dashicons CSS class.
 *     id        (int)               Optional item ID.
 *     relevance (float)             Optional relevance score (higher = ranked higher).
 *     meta      (string)            Optional subtitle/meta text.
 *
 *   Example:
 *     add_filter( 'dash_search_results', function( array $results, string $query ): array {
 *         if ( ! current_user_can( 'manage_options' ) ) {
 *             return $results;
 *         }
 *         $my_results = my_plugin_search( $query );
 *         foreach ( $my_results as $item ) {
 *             $results[] = array(
 *                 'type'  => 'my-plugin',
 *                 'title' => $item->title,
 *                 'url'   => admin_url( 'admin.php?page=my-plugin&id=' . $item->id ),
 *                 'icon'  => 'dashicons-admin-generic',
 *             );
 *         }
 *         return $results;
 *     }, 10, 2 );
 *
 *
 * dash_categories
 *   Register custom result categories for type filtering.
 *   Categories map to item_type values in the index.
 *
 *   Signature: apply_filters( 'dash_categories', array $categories ): array
 *
 *   Each category is an associative array:
 *     id    (string, required)  Category identifier. Must match item_type.
 *     label (string, required)  Human-readable label.
 *     icon  (string, required)  Dashicons CSS class.
 *
 *   Example:
 *     add_filter( 'dash_categories', function( array $categories ): array {
 *         $categories[] = array(
 *             'id'    => 'my-plugin',
 *             'label' => 'My Plugin Items',
 *             'icon'  => 'dashicons-admin-generic',
 *         );
 *         return $categories;
 *     } );
 *
 *
 * dash_execute_command
 *   Handle execution of a custom command callback registered via dash_commands.
 *   Called when the user triggers a command with a 'callback' key (not 'url').
 *
 *   Signature: apply_filters( 'dash_execute_command', null|array $result, string $callback ): null|array
 *
 *   Return an array with a 'message' key to claim the callback.
 *   Return null to pass to the next handler.
 *
 *   Example:
 *     add_filter( 'dash_execute_command', function( $result, string $callback ): ?array {
 *         if ( 'my_plugin_action' !== $callback ) {
 *             return $result;
 *         }
 *         my_plugin_do_thing();
 *         return array( 'message' => 'Action completed successfully.' );
 *     }, 10, 2 );
 *
 *
 * dash_index_rebuild_count
 *   Add custom items to the search index during a full rebuild.
 *   Call $index->upsert_item() for each item you want indexed.
 *
 *   Signature: apply_filters( 'dash_index_rebuild_count', int $count, Dash_Index $index ): int
 *
 *   Example:
 *     add_filter( 'dash_index_rebuild_count', function( int $count, Dash_Index $index ): int {
 *         $my_items = my_plugin_get_all_items();
 *         foreach ( $my_items as $item ) {
 *             $index->upsert_item( array(
 *                 'item_type'   => 'my-plugin',
 *                 'item_id'     => $item->id,
 *                 'title'       => $item->title,
 *                 'url'         => admin_url( 'admin.php?page=my-plugin&id=' . $item->id ),
 *                 'icon'        => 'dashicons-admin-generic',
 *                 'capability'  => 'manage_options',
 *                 'keywords'    => $item->tags,
 *                 'item_status' => 'publish',
 *             ) );
 *             ++$count;
 *         }
 *         return $count;
 *     }, 10, 2 );
 *
 *
 * ACTIONS
 * -------
 *
 * dash_before_render
 *   Fires in admin_footer before the Dash command bar modal is available in the DOM.
 *   Use to enqueue additional scripts or styles that integrate with the modal.
 *
 *   Signature: do_action( 'dash_before_render' )
 *
 *   Example:
 *     add_action( 'dash_before_render', function(): void {
 *         wp_enqueue_script(
 *             'my-dash-extension',
 *             plugin_dir_url( __FILE__ ) . 'assets/js/my-dash-extension.js',
 *             array( 'dash-command-bar' ),
 *             '1.0.0',
 *             true
 *         );
 *     } );
 *
 *
 * JS EVENTS
 * ---------
 *
 * dash:open
 *   Programmatically open the Dash command bar from JavaScript.
 *
 *   document.dispatchEvent( new CustomEvent( 'dash:open' ) );
 *
 * dash:close
 *   Programmatically close the command bar.
 *
 *   document.dispatchEvent( new CustomEvent( 'dash:close' ) );
 *
 * dash:select
 *   Fires when the user selects a result. Event detail contains the item.
 *
 *   document.addEventListener( 'dash:select', function( e ) {
 *       console.log( e.detail ); // { type, id, title, url, icon }
 *   } );
 *
 * ============================================================
 *
 * @package Dash
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class Dash_Api
 *
 * Provides the developer-facing API: orchestrates filters,
 * serves AJAX endpoints for commands and categories,
 * and fires the dash_before_render action.
 */
class Dash_Api {

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
		add_action( 'wp_ajax_dash_get_commands',   array( $this, 'ajax_get_commands' ) );
		add_action( 'wp_ajax_dash_get_categories', array( $this, 'ajax_get_categories' ) );
		add_action( 'admin_footer',                array( $this, 'fire_before_render' ) );
	}

	/**
	 * AJAX: Get all commands the current user can access.
	 *
	 * Returns the full command list, capability-filtered for the current user.
	 * Commands with a 'callback' key are flagged as executable (JS fires AJAX).
	 * Commands with a 'url' key are navigational (JS follows the URL).
	 */
	public function ajax_get_commands(): void {
		check_ajax_referer( 'dash_search', '_wpnonce' );

		$commands   = Dash_Commands::get_instance()->get_commands();
		$user       = wp_get_current_user();
		$accessible = array();

		foreach ( $commands as $command ) {
			$cap = $command['capability'] ?? 'read';
			if ( ! user_can( $user, $cap ) ) {
				continue;
			}

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

		wp_send_json_success( $accessible );
	}

	/**
	 * Get all registered result categories.
	 *
	 * Core categories are defined here. Custom post type categories are
	 * appended dynamically. Third-party categories arrive via dash_categories.
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

		// Append categories for registered custom post types.
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
				'icon'  => ! empty( $cpt->menu_icon ) && str_starts_with( (string) $cpt->menu_icon, 'dashicons-' )
					? $cpt->menu_icon
					: 'dashicons-admin-post',
			);
		}

		/**
		 * Filter the available result categories.
		 *
		 * Each category is an array with keys:
		 *   id    (string) Category identifier (matches item_type in the index).
		 *   label (string) Human-readable display label.
		 *   icon  (string) Dashicons CSS class.
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
	 * Fire the dash_before_render action in admin_footer.
	 *
	 * Allows plugins to enqueue custom assets or inject markup
	 * into the admin footer before the modal is available.
	 */
	public function fire_before_render(): void {
		/**
		 * Fires before the Dash command bar is available in the page DOM.
		 *
		 * Hook into this action to enqueue extension scripts and styles
		 * that depend on Dash being loaded. The 'dash-command-bar' script
		 * handle is available as a dependency.
		 */
		do_action( 'dash_before_render' );
	}
}

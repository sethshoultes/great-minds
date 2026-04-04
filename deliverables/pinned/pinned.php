<?php
/**
 * Plugin Name:       Pinned
 * Plugin URI:        https://github.com/great-minds-agency/pinned
 * Description:       Team sticky notes for the WordPress dashboard. Pin, acknowledge, expire.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Great Minds Agency
 * Author URI:        https://greatminds.agency
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       pinned
 * Domain Path:       /languages
 *
 * @package Pinned
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Constants.
define( 'PINNED_VERSION', '1.0.0' );
define( 'PINNED_PLUGIN_FILE', __FILE__ );
define( 'PINNED_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'PINNED_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'PINNED_TABLE_NOTES', $GLOBALS['wpdb']->prefix . 'pinned_notes' );
define( 'PINNED_TABLE_READS', $GLOBALS['wpdb']->prefix . 'pinned_reads' );

// Autoloader.
spl_autoload_register( function ( string $class ) {
	if ( strpos( $class, 'Pinned_' ) !== 0 ) {
		return;
	}
	$slug = strtolower( str_replace( '_', '-', $class ) );
	$file = PINNED_PLUGIN_DIR . 'includes/class-' . $slug . '.php';
	if ( file_exists( $file ) ) {
		require_once $file;
	}
} );

// Activation / deactivation.
register_activation_hook( __FILE__, 'pinned_activate' );
register_deactivation_hook( __FILE__, 'pinned_deactivate' );

/**
 * Activation: create tables, schedule cron.
 */
function pinned_activate(): void {
	Pinned_DB::install();
	Pinned_Expiry::schedule();
	update_option( 'pinned_version', PINNED_VERSION );
}

/**
 * Deactivation: clear cron only (tables preserved — use uninstall.php to drop).
 */
function pinned_deactivate(): void {
	Pinned_Expiry::unschedule();
}

// Boot on plugins_loaded so $wpdb is ready.
add_action( 'plugins_loaded', 'pinned_boot' );

/**
 * Boot the plugin.
 */
function pinned_boot(): void {
	// Register REST routes.
	add_action( 'rest_api_init', [ Pinned_REST::class, 'register_routes' ] );

	// Register dashboard widget.
	add_action( 'wp_dashboard_setup', [ Pinned_Widget::class, 'register' ] );

	// Enqueue admin assets.
	add_action( 'admin_enqueue_scripts', 'pinned_enqueue_assets' );

	// Ensure cron callback is always registered (autoloader alone won't load the file).
	add_action( Pinned_Expiry::CRON_HOOK, [ Pinned_Expiry::class, 'process' ] );

	// Update user presence on every admin page load.
	add_action( 'admin_init', 'pinned_update_presence' );

	// Run DB migrations if needed.
	$installed = get_option( 'pinned_version', '0.0.0' );
	if ( version_compare( $installed, PINNED_VERSION, '<' ) ) {
		Pinned_DB::install();
		update_option( 'pinned_version', PINNED_VERSION );
	}
}

/**
 * Enqueue admin-only assets and inline the initial note index as JSON
 * so the first render costs zero HTTP requests.
 *
 * @param string $hook_suffix Current admin page hook.
 */
function pinned_enqueue_assets( string $hook_suffix ): void {
	// Load on dashboard and any page that shows the widget.
	$allowed_hooks = [ 'index.php', 'dashboard' ];
	$load_on_page  = in_array( $hook_suffix, $allowed_hooks, true )
		|| str_contains( $hook_suffix, 'dashboard' );

	/**
	 * Filter whether Pinned assets should load on this page.
	 *
	 * @param bool   $load        Whether to load.
	 * @param string $hook_suffix Current admin page hook.
	 */
	$load_on_page = apply_filters( 'pinned_load_assets', $load_on_page, $hook_suffix );

	if ( ! $load_on_page ) {
		return;
	}

	// Use .min assets if they exist and SCRIPT_DEBUG is off, otherwise use unminified.
	$suffix = '';
	if ( ! ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ) {
		$min_css = PINNED_PLUGIN_DIR . 'assets/css/pinned.min.css';
		$min_js  = PINNED_PLUGIN_DIR . 'assets/js/pinned.min.js';
		if ( file_exists( $min_css ) && file_exists( $min_js ) ) {
			$suffix = '.min';
		}
	}

	wp_enqueue_style(
		'pinned-css',
		PINNED_PLUGIN_URL . 'assets/css/pinned' . $suffix . '.css',
		[],
		PINNED_VERSION
	);

	wp_enqueue_script(
		'pinned-js',
		PINNED_PLUGIN_URL . 'assets/js/pinned' . $suffix . '.js',
		[],
		PINNED_VERSION,
		true
	);

	// Build inline JSON index — no extra HTTP round-trip on first render.
	$user_id = get_current_user_id();
	$notes   = Pinned_Notes::get_for_user( $user_id );

	// The JS reads window.pinnedConfig with keys: apiBase, nonce, userName, i18n.
	$current_user = wp_get_current_user();
	wp_localize_script(
		'pinned-js',
		'pinnedConfig',
		[
			'notes'    => $notes,
			'nonce'    => wp_create_nonce( 'wp_rest' ),
			'apiBase'  => esc_url_raw( rest_url( 'pinned/v1' ) ),
			'userId'   => $user_id,
			'userName' => $current_user->display_name,
			'colors'   => [ 'yellow', 'blue', 'green', 'pink', 'orange' ],
			'i18n'     => [
				'newNotePlaceholder' => __( 'Type your note...', 'pinned' ),
				'emptyHint'          => __( 'Double-click anywhere to add a note', 'pinned' ),
				'deleteConfirm'      => __( 'Delete this note?', 'pinned' ),
				'addNote'            => __( 'Double-click to add a note', 'pinned' ),
				'noNotes'            => __( 'No notes yet.', 'pinned' ),
				'archived'           => __( 'Note archived.', 'pinned' ),
				'deleted'            => __( 'Note deleted.', 'pinned' ),
				'error'              => __( 'Something went wrong.', 'pinned' ),
			],
		]
	);
}

/**
 * Track last-seen timestamp for lightweight presence.
 */
function pinned_update_presence(): void {
	if ( ! is_user_logged_in() ) {
		return;
	}
	update_user_meta( get_current_user_id(), 'pinned_last_seen_notes_at', time() );
}

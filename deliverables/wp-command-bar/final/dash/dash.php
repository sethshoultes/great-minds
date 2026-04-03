<?php
/**
 * Plugin Name: Dash
 * Plugin URI:  https://github.com/sethshoultes/dash-command-bar
 * Description: Press Cmd+K to Dash. A keyboard-first command palette for WordPress admin.
 * Version:     1.0.0
 * Author:      Great Minds Agency
 * Author URI:  https://greatminds.agency
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: dash-command-bar
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 8.0
 *
 * @package Dash
 */

defined( 'ABSPATH' ) || exit;

define( 'DASH_VERSION', '1.0.0' );
define( 'DASH_DB_VERSION', '1.0.0' );
define( 'DASH_PLUGIN_FILE', __FILE__ );
define( 'DASH_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'DASH_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'DASH_CLIENT_INDEX_THRESHOLD', 5000 );

/**
 * Autoload plugin classes.
 */
spl_autoload_register( function ( string $class_name ): void {
	$prefix = 'Dash_';
	if ( strpos( $class_name, $prefix ) !== 0 ) {
		return;
	}

	$relative = substr( $class_name, strlen( $prefix ) );
	$file     = DASH_PLUGIN_DIR . 'includes/class-dash-' . strtolower( str_replace( '_', '-', $relative ) ) . '.php';

	if ( file_exists( $file ) ) {
		require_once $file;
	}
} );

/**
 * Plugin activation.
 */
function dash_activate(): void {
	Dash_Index::get_instance()->create_table();
	Dash_Index::get_instance()->rebuild();

	if ( ! wp_next_scheduled( 'dash_rebuild_index' ) ) {
		wp_schedule_event( time(), 'hourly', 'dash_rebuild_index' );
	}

	update_option( 'dash_db_version', DASH_DB_VERSION );
}
register_activation_hook( __FILE__, 'dash_activate' );

/**
 * Plugin deactivation.
 */
function dash_deactivate(): void {
	wp_clear_scheduled_hook( 'dash_rebuild_index' );
}
register_deactivation_hook( __FILE__, 'dash_deactivate' );

/**
 * Initialize the plugin on admin_init.
 */
function dash_init(): void {
	// Only load in admin context.
	if ( ! is_admin() ) {
		return;
	}

	// Check for DB updates.
	if ( get_option( 'dash_db_version' ) !== DASH_DB_VERSION ) {
		Dash_Index::get_instance()->create_table();
		update_option( 'dash_db_version', DASH_DB_VERSION );
	}

	// Initialize components.
	Dash_Index::get_instance()->register_hooks();
	Dash_Search::get_instance()->register_hooks();
	Dash_Commands::get_instance()->register_hooks();
	Dash_Api::get_instance()->register_hooks();
}
add_action( 'admin_init', 'dash_init' );

/**
 * Hourly cron: rebuild the search index.
 */
add_action( 'dash_rebuild_index', function (): void {
	Dash_Index::get_instance()->rebuild();
} );

/**
 * Enqueue admin assets.
 */
function dash_enqueue_assets(): void {
	if ( ! is_admin() ) {
		return;
	}

	$js_file = DASH_PLUGIN_DIR . 'assets/js/dash.js';
	$js_ver  = file_exists( $js_file ) ? filemtime( $js_file ) : DASH_VERSION;

	wp_enqueue_script(
		'dash-command-bar',
		DASH_PLUGIN_URL . 'assets/js/dash.js',
		array(),
		$js_ver,
		true
	);

	wp_localize_script( 'dash-command-bar', 'dashData', array(
		'ajaxUrl'         => admin_url( 'admin-ajax.php' ),
		'nonce'           => wp_create_nonce( 'dash_search' ),
		'indexUrl'        => admin_url( 'admin-ajax.php' ) . '?action=dash_get_index&_wpnonce=' . wp_create_nonce( 'dash_search' ),
		'threshold'       => DASH_CLIENT_INDEX_THRESHOLD,
		'onboardingSeen'  => (bool) get_user_meta( get_current_user_id(), 'dash_onboarded', true ),
	) );

	$css_file = DASH_PLUGIN_DIR . 'assets/css/dash.css';
	$css_ver  = file_exists( $css_file ) ? filemtime( $css_file ) : DASH_VERSION;

	wp_enqueue_style(
		'dash-command-bar',
		DASH_PLUGIN_URL . 'assets/css/dash.css',
		array(),
		$css_ver
	);
}
add_action( 'admin_enqueue_scripts', 'dash_enqueue_assets' );

/**
 * Disable WordPress core command palette (WP 6.3+).
 *
 * Core registers its own Cmd+K palette via the @wordpress/commands package.
 * We replace it entirely with Dash.
 */
function dash_disable_core_command_palette(): void {
	wp_dequeue_script( 'wp-commands' );
	wp_deregister_script( 'wp-commands' );

	// Also remove the inline style for the core command palette.
	wp_dequeue_style( 'wp-commands' );
	wp_deregister_style( 'wp-commands' );

	// Remove the admin bar command palette trigger (WP 6.7+).
	remove_action( 'in_admin_header', 'wp_admin_bar_command_palette' );
	remove_action( 'admin_bar_menu', 'wp_admin_command_palette' );
}
add_action( 'admin_enqueue_scripts', 'dash_disable_core_command_palette', 99 );

/**
 * Mark user as onboarded after first Cmd+K open.
 */
add_action( 'wp_ajax_dash_mark_onboarded', function (): void {
	check_ajax_referer( 'dash_search', '_wpnonce' );
	update_user_meta( get_current_user_id(), 'dash_onboarded', true );
	wp_send_json_success();
} );

/**
 * Register WP-CLI commands if available.
 */
if ( defined( 'WP_CLI' ) && WP_CLI ) {
	require_once DASH_PLUGIN_DIR . 'includes/class-dash-cli.php';
}

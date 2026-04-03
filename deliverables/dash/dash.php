<?php
/**
 * Plugin Name: Dash
 * Plugin URI:  https://github.com/sethshoultes/dash-command-bar
 * Description: Press Cmd+K to Dash. A keyboard-first command palette for WordPress admin. Instant search, quick actions, settings jump, user search.
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

// ============================================================
// Constants
// ============================================================

define( 'DASH_VERSION',                '1.0.0' );
define( 'DASH_DB_VERSION',             '1.0.0' );
define( 'DASH_PLUGIN_FILE',            __FILE__ );
define( 'DASH_PLUGIN_DIR',             plugin_dir_path( __FILE__ ) );
define( 'DASH_PLUGIN_URL',             plugin_dir_url( __FILE__ ) );

/**
 * Sites with fewer index items than this threshold use client-side
 * search (JSON index loaded once, searched in <50ms).
 * Sites at or above this threshold fall back to server-side AJAX
 * search (<200ms target).
 */
define( 'DASH_CLIENT_INDEX_THRESHOLD', 5000 );

// ============================================================
// Autoloader
// ============================================================

/**
 * PSR-4 style autoloader for Dash_ prefixed classes.
 *
 * Maps Dash_Index     → includes/class-dash-index.php
 *     Dash_Search    → includes/class-dash-search.php
 *     Dash_Commands  → includes/class-dash-commands.php
 *     Dash_Api       → includes/class-dash-api.php
 */
spl_autoload_register( static function ( string $class_name ): void {
	if ( ! str_starts_with( $class_name, 'Dash_' ) ) {
		return;
	}

	$relative = substr( $class_name, 5 ); // Strip 'Dash_'.
	$filename = 'class-dash-' . strtolower( str_replace( '_', '-', $relative ) ) . '.php';
	$filepath = DASH_PLUGIN_DIR . 'includes/' . $filename;

	if ( file_exists( $filepath ) ) {
		require_once $filepath;
	}
} );

// ============================================================
// Activation / Deactivation
// ============================================================

/**
 * Plugin activation.
 *
 * Creates the search index table and runs the first full index build.
 * Schedules the hourly cron for ongoing index maintenance.
 *
 * NOTE: rebuild() is deferred to a separate request via an option flag
 * to avoid activation timeouts on large sites. The cron fires within
 * the first hour, or the user can trigger `wp dash reindex` immediately.
 */
function dash_activate(): void {
	Dash_Index::get_instance()->create_table();

	// Schedule hourly rebuild cron if not already scheduled.
	if ( ! wp_next_scheduled( 'dash_rebuild_index' ) ) {
		wp_schedule_event( time(), 'hourly', 'dash_rebuild_index' );
	}

	// Flag for deferred first-run rebuild (avoids activation timeout on large sites).
	update_option( 'dash_needs_initial_build', true );
	update_option( 'dash_db_version', DASH_DB_VERSION );
}
register_activation_hook( __FILE__, 'dash_activate' );

/**
 * Plugin deactivation.
 *
 * Clears scheduled cron events. Data is preserved for reactivation.
 * Use uninstall.php for data removal.
 */
function dash_deactivate(): void {
	wp_clear_scheduled_hook( 'dash_rebuild_index' );
}
register_deactivation_hook( __FILE__, 'dash_deactivate' );

// ============================================================
// Initialization
// ============================================================

/**
 * Initialize Dash on admin_init.
 *
 * Loads only in admin context. Handles deferred first-run build
 * and DB version upgrades, then wires all component hooks.
 */
function dash_init(): void {
	if ( ! is_admin() ) {
		return;
	}

	$index = Dash_Index::get_instance();

	// Run deferred initial build after activation.
	if ( get_option( 'dash_needs_initial_build' ) ) {
		delete_option( 'dash_needs_initial_build' );
		$index->rebuild();
	}

	// Handle DB schema upgrades.
	if ( get_option( 'dash_db_version' ) !== DASH_DB_VERSION ) {
		$index->create_table();
		update_option( 'dash_db_version', DASH_DB_VERSION );
	}

	// Wire all component hooks.
	$index->register_hooks();
	Dash_Search::get_instance()->register_hooks();
	Dash_Commands::get_instance()->register_hooks();
	Dash_Api::get_instance()->register_hooks();
}
add_action( 'admin_init', 'dash_init' );

// ============================================================
// Cron
// ============================================================

/**
 * Hourly cron: full index rebuild for freshness.
 *
 * Ensures that content added or changed via bulk import, REST API,
 * or other non-standard routes stays in the index.
 */
add_action( 'dash_rebuild_index', static function (): void {
	Dash_Index::get_instance()->rebuild();
} );

// ============================================================
// Asset enqueueing
// ============================================================

/**
 * Enqueue Dash JS and CSS in admin.
 *
 * Assets are admin-only — never loaded on the frontend.
 * File modification time is used as the version for cache busting.
 *
 * The localized dashData object provides the JS with:
 *   ajaxUrl        — admin-ajax.php URL
 *   nonce          — dash_search nonce for all AJAX requests
 *   indexUrl       — direct URL to fetch the full JSON index
 *   threshold      — client-side vs. server-side switch point
 *   onboardingSeen — whether to show the "Press Cmd+K" tooltip
 */
function dash_enqueue_assets(): void {
	$js_path = DASH_PLUGIN_DIR . 'assets/js/dash.js';
	$js_ver  = file_exists( $js_path ) ? (string) filemtime( $js_path ) : DASH_VERSION;

	wp_enqueue_script(
		'dash-command-bar',
		DASH_PLUGIN_URL . 'assets/js/dash.js',
		array(),   // Zero dependencies — vanilla JS.
		$js_ver,
		true       // Load in footer.
	);

	wp_localize_script(
		'dash-command-bar',
		'dashData',
		array(
			'ajaxUrl'        => admin_url( 'admin-ajax.php' ),
			'nonce'          => wp_create_nonce( 'dash_search' ),
			'indexUrl'       => add_query_arg(
				array(
					'action'   => 'dash_get_index',
					'_wpnonce' => wp_create_nonce( 'dash_search' ),
				),
				admin_url( 'admin-ajax.php' )
			),
			'threshold'      => DASH_CLIENT_INDEX_THRESHOLD,
			'version'        => DASH_VERSION,
			'onboardingSeen' => (bool) get_user_meta( get_current_user_id(), 'dash_onboarded', true ),
		)
	);

	$css_path = DASH_PLUGIN_DIR . 'assets/css/dash.css';
	$css_ver  = file_exists( $css_path ) ? (string) filemtime( $css_path ) : DASH_VERSION;

	wp_enqueue_style(
		'dash-command-bar',
		DASH_PLUGIN_URL . 'assets/css/dash.css',
		array(),
		$css_ver
	);
}
add_action( 'admin_enqueue_scripts', 'dash_enqueue_assets' );

// ============================================================
// WordPress core command palette conflict resolution
// ============================================================

/**
 * Deregister WordPress core command palette (WP 6.3+).
 *
 * WordPress 6.3 introduced its own Cmd+K palette via @wordpress/commands.
 * Dash replaces it entirely. We dequeue at priority 99 (after core enqueues)
 * to guarantee removal.
 *
 * This is intentional. If WP core's palette is re-introduced in a future
 * release we will revisit, but for now users want one palette, not two.
 */
function dash_disable_core_palette(): void {
	wp_dequeue_script( 'wp-commands' );
	wp_deregister_script( 'wp-commands' );
	wp_dequeue_style( 'wp-commands' );
	wp_deregister_style( 'wp-commands' );

	// WP 6.7+ admin bar palette trigger.
	remove_action( 'in_admin_header', 'wp_admin_bar_command_palette' );
	remove_action( 'admin_bar_menu',  'wp_admin_command_palette' );
}
add_action( 'admin_enqueue_scripts', 'dash_disable_core_palette', 99 );

// ============================================================
// Onboarding
// ============================================================

/**
 * Mark user as onboarded after first Cmd+K interaction.
 *
 * Called by JS after the user opens the palette for the first time.
 * Suppresses the "Press Cmd+K to Dash" tooltip on subsequent loads.
 */
add_action( 'wp_ajax_dash_mark_onboarded', static function (): void {
	check_ajax_referer( 'dash_search', '_wpnonce' );
	update_user_meta( get_current_user_id(), 'dash_onboarded', true );
	wp_send_json_success();
} );

// ============================================================
// WP-CLI
// ============================================================

/**
 * Register WP-CLI commands if WP-CLI is available.
 *
 * Commands:
 *   wp dash reindex       — Full index rebuild
 *   wp dash reindex --no-truncate  — Incremental merge
 *   wp dash status        — Index health and stats
 */
if ( defined( 'WP_CLI' ) && WP_CLI ) {
	require_once DASH_PLUGIN_DIR . 'includes/class-dash-cli.php';
}

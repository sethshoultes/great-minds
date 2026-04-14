<?php
/**
 * Plugin Name:       GLIMPSE
 * Plugin URI:        https://github.com/great-minds-agency/glimpse
 * Description:       Shareable preview links for WordPress drafts
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Great Minds Agency
 * Author URI:        https://greatminds.agency
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       glimpse
 * Domain Path:       /languages
 *
 * @package Glimpse
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Constants.
define( 'GLIMPSE_VERSION', '1.0.0' );
define( 'GLIMPSE_PLUGIN_FILE', __FILE__ );
define( 'GLIMPSE_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'GLIMPSE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'GLIMPSE_TABLE_TOKENS', $GLOBALS['wpdb']->prefix . 'glimpse_tokens' );

// Autoloader.
spl_autoload_register( function ( string $class ) {
	if ( strpos( $class, 'Glimpse_' ) !== 0 ) {
		return;
	}
	$slug = strtolower( str_replace( '_', '-', $class ) );
	$file = GLIMPSE_PLUGIN_DIR . 'includes/class-' . $slug . '.php';
	if ( file_exists( $file ) ) {
		require_once $file;
	}
} );

// Activation / deactivation.
register_activation_hook( __FILE__, 'glimpse_activate' );
register_deactivation_hook( __FILE__, 'glimpse_deactivate' );

/**
 * Activation: create tables, schedule cron.
 */
function glimpse_activate(): void {
	Glimpse_DB::install();
	Glimpse_Expiry::schedule();
	update_option( 'glimpse_version', GLIMPSE_VERSION );
}

/**
 * Deactivation: clear cron only (tables preserved — use uninstall.php to drop).
 */
function glimpse_deactivate(): void {
	Glimpse_Expiry::unschedule();
}

// Boot on plugins_loaded so $wpdb is ready.
add_action( 'plugins_loaded', 'glimpse_boot' );

/**
 * Boot the plugin.
 */
function glimpse_boot(): void {
	// Initialization will be filled in Wave 4.
}

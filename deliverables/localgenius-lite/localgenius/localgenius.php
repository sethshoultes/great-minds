<?php
/**
 * Plugin Name:       LocalGenius
 * Plugin URI:        https://localgenius.ai
 * Description:       Zero-configuration chat widget that answers customer questions 24/7. Select your business type, and your website starts answering "What are your hours?" instantly.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            LocalGenius
 * Author URI:        https://localgenius.ai
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       localgenius
 * Domain Path:       /languages
 *
 * @package LocalGenius
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Plugin constants.
define( 'LOCALGENIUS_VERSION', '1.0.0' );
define( 'LOCALGENIUS_PLUGIN_FILE', __FILE__ );
define( 'LOCALGENIUS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'LOCALGENIUS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Autoloader for class files.
spl_autoload_register( function ( string $class ) {
	if ( strpos( $class, 'LocalGenius_' ) !== 0 ) {
		return;
	}
	$slug = strtolower( str_replace( '_', '-', $class ) );
	$file = LOCALGENIUS_PLUGIN_DIR . 'includes/class-' . str_replace( 'localgenius-', '', $slug ) . '.php';
	if ( file_exists( $file ) ) {
		require_once $file;
	}
} );

// Activation hook.
register_activation_hook( __FILE__, 'localgenius_activate' );

/**
 * Plugin activation: run scanner, set defaults.
 */
function localgenius_activate(): void {
	// Set default options if not already set.
	if ( false === get_option( 'localgenius_business_type' ) ) {
		add_option( 'localgenius_business_type', '' );
	}
	if ( false === get_option( 'localgenius_location' ) ) {
		add_option( 'localgenius_location', '' );
	}
	if ( false === get_option( 'localgenius_show_powered_by' ) ) {
		add_option( 'localgenius_show_powered_by', '1' );
	}
	if ( false === get_option( 'localgenius_question_count' ) ) {
		add_option( 'localgenius_question_count', 0 );
	}
	if ( false === get_option( 'localgenius_cache_hits' ) ) {
		add_option( 'localgenius_cache_hits', 0 );
	}

	// Run homepage scanner to extract business info.
	require_once LOCALGENIUS_PLUGIN_DIR . 'includes/class-scanner.php';
	LocalGenius_Scanner::extract();

	// Store activation time.
	update_option( 'localgenius_activated_at', time() );
}

// Deactivation hook.
register_deactivation_hook( __FILE__, 'localgenius_deactivate' );

/**
 * Plugin deactivation: cleanup if needed.
 */
function localgenius_deactivate(): void {
	// Options are preserved for reactivation.
	// Use uninstall.php for full cleanup.
}

// Boot plugin on plugins_loaded.
add_action( 'plugins_loaded', 'localgenius_boot' );

/**
 * Boot the plugin after WordPress is fully loaded.
 */
function localgenius_boot(): void {
	// Load admin class if in admin context.
	if ( is_admin() ) {
		require_once LOCALGENIUS_PLUGIN_DIR . 'admin/class-admin.php';
		LocalGenius_Admin::init();
	}

	// Register REST API endpoints.
	add_action( 'rest_api_init', 'localgenius_register_rest_routes' );

	// Enqueue frontend assets if business type is configured.
	add_action( 'wp_enqueue_scripts', 'localgenius_enqueue_frontend_assets' );
}

/**
 * Register REST API routes for chat functionality.
 */
function localgenius_register_rest_routes(): void {
	require_once LOCALGENIUS_PLUGIN_DIR . 'includes/class-api-handler.php';
	LocalGenius_API_Handler::register_routes();
}

/**
 * Enqueue frontend chat widget assets.
 */
function localgenius_enqueue_frontend_assets(): void {
	// Only load if business type is configured.
	$business_type = get_option( 'localgenius_business_type', '' );
	if ( empty( $business_type ) ) {
		return;
	}

	// Don't load in admin or on login page.
	if ( is_admin() || $GLOBALS['pagenow'] === 'wp-login.php' ) {
		return;
	}

	// Enqueue widget CSS.
	wp_enqueue_style(
		'localgenius-widget',
		LOCALGENIUS_PLUGIN_URL . 'assets/css/chat-widget.css',
		[],
		LOCALGENIUS_VERSION
	);

	// Enqueue widget JS.
	wp_enqueue_script(
		'localgenius-widget',
		LOCALGENIUS_PLUGIN_URL . 'assets/js/chat-widget.js',
		[],
		LOCALGENIUS_VERSION,
		true
	);

	// Get homepage data for fallback messages.
	$homepage_data = get_option( 'localgenius_homepage_data', [] );
	$phone         = isset( $homepage_data['phone'] ) ? $homepage_data['phone'] : '';
	$business_name = isset( $homepage_data['business_name'] ) ? $homepage_data['business_name'] : get_bloginfo( 'name' );

	// Pass configuration to widget.
	wp_localize_script(
		'localgenius-widget',
		'localGeniusConfig',
		[
			'apiEndpoint'   => esc_url_raw( rest_url( 'localgenius/v1/chat' ) ),
			'nonce'         => wp_create_nonce( 'wp_rest' ),
			'businessType'  => sanitize_text_field( $business_type ),
			'location'      => sanitize_text_field( get_option( 'localgenius_location', '' ) ),
			'siteId'        => md5( home_url() ),
			'phone'         => sanitize_text_field( $phone ),
			'businessName'  => sanitize_text_field( $business_name ),
			'showPoweredBy' => (bool) get_option( 'localgenius_show_powered_by', true ),
			'poweredByUrl'  => 'https://localgenius.ai',
		]
	);
}

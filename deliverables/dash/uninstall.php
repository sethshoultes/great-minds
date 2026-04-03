<?php
/**
 * Dash Plugin — Clean Uninstall
 *
 * Removes ALL plugin data when the plugin is deleted via the WordPress admin.
 * This file is executed by WordPress when the user clicks "Delete" on the
 * Plugins screen, not on deactivation.
 *
 * What gets removed:
 *   - Custom table: wp_dash_index
 *   - Plugin options: dash_db_version, dash_last_index_build, dash_last_menu_index
 *   - Transients: all dash_* transients (cached index JSON, counts)
 *   - User meta: dash_recent_items, dash_onboarded (for all users)
 *
 * What is NOT removed:
 *   - Nothing — this is a full clean uninstall.
 *
 * @package Dash
 */

// WordPress sets this constant before calling uninstall.php.
// Direct file access must be blocked.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

global $wpdb;

// ---- Custom table ----
// phpcs:ignore WordPress.DB.DirectDatabaseQuery
$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}dash_index" );

// ---- Plugin options ----
$options = array(
	'dash_db_version',
	'dash_last_index_build',
	'dash_last_menu_index',
	'dash_needs_initial_build',
);
foreach ( $options as $option ) {
	delete_option( $option );
}

// ---- Transients ----
delete_transient( 'dash_index_count' );

// Remove all role-based index JSON transients (pattern: dash_index_json_*).
// phpcs:ignore WordPress.DB.DirectDatabaseQuery
$wpdb->query(
	"DELETE FROM {$wpdb->options}
	 WHERE option_name LIKE '\\_transient\\_dash\\_index\\_json\\_%'
	    OR option_name LIKE '\\_transient\\_timeout\\_dash\\_index\\_json\\_%'"
);

// ---- User meta ----
$user_meta_keys = array(
	'dash_recent_items',
	'dash_onboarded',
);
foreach ( $user_meta_keys as $meta_key ) {
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$wpdb->delete( $wpdb->usermeta, array( 'meta_key' => $meta_key ), array( '%s' ) );
}

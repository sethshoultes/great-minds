<?php
/**
 * Dash Plugin Uninstall Routine
 *
 * Removes all plugin data from the database when the plugin is deleted.
 *
 * @package Dash
 */

// Exit if uninstall.php is accessed directly.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

global $wpdb;

// Remove custom table.
$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}dash_index" );

// Remove options.
delete_option( 'dash_last_index_build' );
delete_option( 'dash_index_version' );
delete_option( 'dash_db_version' );

// Remove transients.
delete_transient( 'dash_index_json' );
delete_transient( 'dash_index_count' );

// Remove user meta for all users.
$wpdb->query( "DELETE FROM {$wpdb->usermeta} WHERE meta_key = 'dash_recent_items'" );
$wpdb->query( "DELETE FROM {$wpdb->usermeta} WHERE meta_key = 'dash_onboarded'" );

// Remove role-specific index JSON transients.
$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '\_transient\_dash\_index\_json\_%'" );
$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '\_transient\_timeout\_dash\_index\_json\_%'" );

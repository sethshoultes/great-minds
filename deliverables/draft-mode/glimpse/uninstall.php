<?php
/**
 * Uninstall — runs when the user clicks "Delete" in the WordPress plugin list.
 *
 * Drops custom tables, deletes all options, removes user meta,
 * clears all Glimpse transients, and unschedules the expiry cron.
 *
 * This file is only executed by WordPress core when WP_UNINSTALL_PLUGIN is defined.
 * Never load it directly.
 *
 * @package Glimpse
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

global $wpdb;

// ------------------------------------------------------------------
// 1. Drop custom tables.
// ------------------------------------------------------------------
$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}glimpse_tokens" );   // phpcs:ignore WordPress.DB.DirectDatabaseQuery

// ------------------------------------------------------------------
// 2. Delete plugin options.
// ------------------------------------------------------------------
delete_option( 'glimpse_version' );
delete_option( 'glimpse_schema_version' );

// ------------------------------------------------------------------
// 3. Clear all Glimpse transients.
//    Pattern: glimpse_* (transients and timeouts).
//    wp_cache_flush_group() only works with a persistent cache;
//    for sites on the default non-persistent cache we query directly.
// ------------------------------------------------------------------
$wpdb->query(  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	"DELETE FROM {$wpdb->options}
	 WHERE option_name LIKE '_transient_glimpse_%'
	    OR option_name LIKE '_transient_timeout_glimpse_%'"
);

// Multisite: clean all site tables.
if ( is_multisite() ) {
	$blog_ids = $wpdb->get_col( "SELECT blog_id FROM {$wpdb->blogs}" );  // phpcs:ignore WordPress.DB.DirectDatabaseQuery

	foreach ( $blog_ids as $blog_id ) {
		switch_to_blog( (int) $blog_id );

		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}glimpse_tokens" );  // phpcs:ignore WordPress.DB.DirectDatabaseQuery

		delete_option( 'glimpse_version' );
		delete_option( 'glimpse_schema_version' );

		$wpdb->query(  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			"DELETE FROM {$wpdb->options}
			 WHERE option_name LIKE '_transient_glimpse_%'
			    OR option_name LIKE '_transient_timeout_glimpse_%'"
		);

		restore_current_blog();
	}
}

// ------------------------------------------------------------------
// 4. Remove user meta (any per-user prefs with _glimpse_ prefix).
// ------------------------------------------------------------------
$wpdb->query(  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	"DELETE FROM {$wpdb->usermeta} WHERE meta_key LIKE '_glimpse_%'"
);

// ------------------------------------------------------------------
// 5. Clear scheduled cron events.
// ------------------------------------------------------------------
$cron_hook = 'glimpse_process_expiry';
$timestamp = wp_next_scheduled( $cron_hook );
if ( $timestamp ) {
	wp_unschedule_event( $timestamp, $cron_hook );
}
wp_unschedule_hook( $cron_hook );

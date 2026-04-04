<?php
/**
 * Uninstall — runs when the user clicks "Delete" in the WordPress plugin list.
 *
 * Drops both custom tables, deletes all options, removes user meta,
 * clears all Pinned transients, and unschedules the expiry cron.
 *
 * This file is only executed by WordPress core when WP_UNINSTALL_PLUGIN is defined.
 * Never load it directly.
 *
 * @package Pinned
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

global $wpdb;

// ------------------------------------------------------------------
// 1. Drop custom tables (reads first — references notes).
// ------------------------------------------------------------------
$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}pinned_reads" );   // phpcs:ignore WordPress.DB.DirectDatabaseQuery
$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}pinned_notes" );   // phpcs:ignore WordPress.DB.DirectDatabaseQuery

// ------------------------------------------------------------------
// 2. Delete plugin options.
// ------------------------------------------------------------------
delete_option( 'pinned_version' );
delete_option( 'pinned_schema_version' );

// ------------------------------------------------------------------
// 3. Clear all Pinned transients.
//    Pattern: pinned_mention_{user_id} (one per user).
//    wp_cache_flush_group() only works with a persistent cache;
//    for sites on the default non-persistent cache we query directly.
// ------------------------------------------------------------------
$wpdb->query(  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	"DELETE FROM {$wpdb->options}
	 WHERE option_name LIKE '_transient_pinned_%'
	    OR option_name LIKE '_transient_timeout_pinned_%'"
);

// Multisite: clean all site tables.
if ( is_multisite() ) {
	$blog_ids = $wpdb->get_col( "SELECT blog_id FROM {$wpdb->blogs}" );  // phpcs:ignore WordPress.DB.DirectDatabaseQuery

	foreach ( $blog_ids as $blog_id ) {
		switch_to_blog( (int) $blog_id );

		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}pinned_reads" );  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}pinned_notes" );  // phpcs:ignore WordPress.DB.DirectDatabaseQuery

		delete_option( 'pinned_version' );
		delete_option( 'pinned_schema_version' );

		$wpdb->query(  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			"DELETE FROM {$wpdb->options}
			 WHERE option_name LIKE '_transient_pinned_%'
			    OR option_name LIKE '_transient_timeout_pinned_%'"
		);

		restore_current_blog();
	}
}

// ------------------------------------------------------------------
// 4. Remove user meta (presence tracking + any future per-user prefs).
// ------------------------------------------------------------------
$wpdb->query(  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	"DELETE FROM {$wpdb->usermeta} WHERE meta_key LIKE 'pinned_%'"
);

// ------------------------------------------------------------------
// 5. Clear scheduled cron events.
// ------------------------------------------------------------------
$cron_hook = 'pinned_process_expiry';
$timestamp = wp_next_scheduled( $cron_hook );
if ( $timestamp ) {
	wp_unschedule_event( $timestamp, $cron_hook );
}
wp_unschedule_hook( $cron_hook );

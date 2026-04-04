<?php
/**
 * Cron-based note expiry.
 *
 * Runs hourly via wp_schedule_event. Any note with expires_at in the past
 * gets archived (soft-deleted). The cron is registered on activation and
 * cleared on deactivation.
 *
 * @package Pinned
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Pinned_Expiry {

	/** WP cron action hook. */
	const CRON_HOOK = 'pinned_process_expiry';

	/**
	 * Schedule the hourly cron if not already scheduled.
	 * Called from pinned_activate().
	 */
	public static function schedule(): void {
		if ( ! wp_next_scheduled( self::CRON_HOOK ) ) {
			wp_schedule_event( time(), 'hourly', self::CRON_HOOK );
		}

		// Wire the cron action to the processor.
		add_action( self::CRON_HOOK, [ self::class, 'process' ] );
	}

	/**
	 * Unschedule the cron.
	 * Called from pinned_deactivate() — tables are NOT dropped here.
	 */
	public static function unschedule(): void {
		$timestamp = wp_next_scheduled( self::CRON_HOOK );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, self::CRON_HOOK );
		}
	}

	/**
	 * Process expired notes: archive them and log the count.
	 *
	 * This is the cron callback. It runs in the background — no user context.
	 * Uses a direct DB query for efficiency (no need to instantiate N note objects).
	 */
	public static function process(): void {
		global $wpdb;

		$now = current_time( 'mysql', true );

		// Fetch IDs of expired, non-archived notes.
		$expired_ids = $wpdb->get_col(  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->prepare(
				"SELECT id FROM %i WHERE archived = 0 AND expires_at IS NOT NULL AND expires_at <= %s",
				PINNED_TABLE_NOTES,
				$now
			)
		);

		if ( empty( $expired_ids ) ) {
			return;
		}

		$placeholders = implode( ', ', array_fill( 0, count( $expired_ids ), '%d' ) );

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
		$wpdb->query(
			$wpdb->prepare(
				"UPDATE %i SET archived = 1, updated_at = %s WHERE id IN ($placeholders)",
				array_merge( [ PINNED_TABLE_NOTES, $now ], array_map( 'intval', $expired_ids ) )
			)
		);

		$count = count( $expired_ids );

		/**
		 * Fires after expired notes have been archived.
		 *
		 * @param int   $count       Number of notes archived.
		 * @param array $expired_ids Array of note IDs that were archived.
		 */
		do_action( 'pinned_notes_expired', $count, $expired_ids );

		// Flush the notes cache so next page load reflects the change.
		wp_cache_flush_group( Pinned_Notes::CACHE_GROUP );

		// Optional error log entry for debugging.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions
			error_log( sprintf( 'Pinned: archived %d expired note(s). IDs: %s', $count, implode( ', ', $expired_ids ) ) );
		}
	}
}

// Wire the cron action on every load (not just after activation) so the
// callback is always registered when WP triggers the scheduled event.
add_action( Pinned_Expiry::CRON_HOOK, [ Pinned_Expiry::class, 'process' ] );

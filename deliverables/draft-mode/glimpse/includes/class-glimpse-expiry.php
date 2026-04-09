<?php
/**
 * Cron-based token expiry.
 *
 * Runs daily via wp_schedule_event. Any token with expires_at in the past
 * gets purged from the database. The cron is registered on activation and
 * cleared on deactivation.
 *
 * @package Glimpse
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Glimpse_Expiry {

	/** WP cron action hook. */
	const CRON_HOOK = 'glimpse_purge_expired';

	/**
	 * Schedule the daily cron if not already scheduled.
	 * Called from glimpse_activate().
	 */
	public static function schedule(): void {
		if ( ! wp_next_scheduled( self::CRON_HOOK ) ) {
			wp_schedule_event( time(), 'daily', self::CRON_HOOK );
		}

		// Wire the cron action to the processor.
		add_action( self::CRON_HOOK, [ self::class, 'process' ] );
	}

	/**
	 * Unschedule the cron.
	 * Called from glimpse_deactivate() — tables are NOT dropped here.
	 */
	public static function unschedule(): void {
		$timestamp = wp_next_scheduled( self::CRON_HOOK );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, self::CRON_HOOK );
		}
	}

	/**
	 * Process expired tokens: delete them and log the count.
	 *
	 * This is the cron callback. It runs in the background — no user context.
	 * Uses a direct DB query for efficiency.
	 */
	public static function process(): void {
		global $wpdb;

		$now = current_time( 'mysql', true );

		// Delete all expired tokens.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
		$result = $wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->prefix}glimpse_tokens WHERE expires_at < %s",
				$now
			)
		);

		if ( ! $result || 0 === $result ) {
			return;
		}

		$count = $result;

		/**
		 * Fires after expired tokens have been purged.
		 *
		 * @param int $count Number of tokens deleted.
		 */
		do_action( 'glimpse_tokens_expired', $count );

		// Optional error log entry for debugging.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions
			error_log( sprintf( 'Glimpse: purged %d expired token(s).', $count ) );
		}
	}
}

// Wire the cron action on every load (not just after activation) so the
// callback is always registered when WP triggers the scheduled event.
add_action( Glimpse_Expiry::CRON_HOOK, [ Glimpse_Expiry::class, 'process' ] );

<?php
/**
 * Database schema for Glimpse preview tokens.
 *
 * Table:
 *   wp_glimpse_tokens — Stores preview token data with expiry.
 *
 * @package Glimpse
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Glimpse_DB {

	/**
	 * Current schema version. Bump when ALTER-level changes are needed.
	 */
	const SCHEMA_VERSION = 1;

	/**
	 * Run dbDelta to create or upgrade the tokens table.
	 * Safe to call on every activation — dbDelta is idempotent.
	 */
	public static function install(): void {
		global $wpdb;

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$charset_collate = $wpdb->get_charset_collate();

		// --- wp_glimpse_tokens ---
		// Stores preview tokens with expiry and origin metadata.
		$sql_tokens = "CREATE TABLE {$wpdb->prefix}glimpse_tokens (
			id          BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			post_id     BIGINT(20) UNSIGNED NOT NULL,
			token_hash  VARCHAR(64)         NOT NULL,
			created_by  BIGINT(20) UNSIGNED NOT NULL,
			created_at  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
			expires_at  DATETIME            NOT NULL,
			PRIMARY KEY (id),
			UNIQUE KEY token_hash (token_hash),
			KEY post_id (post_id),
			KEY expires_at (expires_at)
		) $charset_collate;";

		dbDelta( $sql_tokens );

		update_option( 'glimpse_db_version', self::SCHEMA_VERSION );
	}

	/**
	 * Drop the tokens table and clean all options.
	 * Called only from uninstall.php — never on deactivation.
	 */
	public static function uninstall(): void {
		global $wpdb;

		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}glimpse_tokens" );  // phpcs:ignore WordPress.DB.DirectDatabaseQuery

		delete_option( 'glimpse_version' );
		delete_option( 'glimpse_db_version' );
	}

	/**
	 * Run any pending schema migrations.
	 * Currently a no-op at schema v1 — structure preserved for future versions.
	 *
	 * @param int $from Schema version we're upgrading from.
	 */
	public static function migrate( int $from ): void {
		// Example pattern for future use:
		// if ( $from < 2 ) {
		//     global $wpdb;
		//     $wpdb->query( "ALTER TABLE {$wpdb->prefix}glimpse_tokens ADD COLUMN custom_field VARCHAR(255) DEFAULT NULL" );
		// }
	}
}

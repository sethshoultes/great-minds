<?php
/**
 * Database schema — two tables, dbDelta creation, migration support.
 *
 * Tables:
 *   wp_pinned_notes  — The notes themselves.
 *   wp_pinned_reads  — Pivot: which users have acknowledged which notes.
 *
 * @package Pinned
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Pinned_DB {

	/**
	 * Current schema version. Bump when ALTER-level changes are needed.
	 */
	const SCHEMA_VERSION = 1;

	/**
	 * Run dbDelta to create or upgrade both tables.
	 * Safe to call on every activation — dbDelta is idempotent.
	 */
	public static function install(): void {
		global $wpdb;

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$charset_collate = $wpdb->get_charset_collate();

		// --- wp_pinned_notes ---
		// position_x / position_y reserved for v1.1 spatial drag-and-drop layout.
		// Stored now so migrating data later costs nothing.
		$sql_notes = "CREATE TABLE {$wpdb->prefix}pinned_notes (
			id          BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			author_id   BIGINT(20) UNSIGNED NOT NULL DEFAULT 0,
			title       VARCHAR(191)        NOT NULL DEFAULT '',
			body        LONGTEXT            NOT NULL,
			color       VARCHAR(20)         NOT NULL DEFAULT 'yellow',
			priority    TINYINT(1)          NOT NULL DEFAULT 0,
			is_pinned   TINYINT(1)          NOT NULL DEFAULT 0,
			expires_at  DATETIME                     DEFAULT NULL,
			archived    TINYINT(1)          NOT NULL DEFAULT 0,
			created_at  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			position_x  FLOAT                        DEFAULT NULL,
			position_y  FLOAT                        DEFAULT NULL,
			PRIMARY KEY (id),
			KEY author_id  (author_id),
			KEY is_pinned  (is_pinned),
			KEY archived   (archived),
			KEY expires_at (expires_at)
		) $charset_collate;";

		// --- wp_pinned_reads ---
		// Composite PK prevents duplicate acknowledgments at the DB level.
		$sql_reads = "CREATE TABLE {$wpdb->prefix}pinned_reads (
			note_id  BIGINT(20) UNSIGNED NOT NULL,
			user_id  BIGINT(20) UNSIGNED NOT NULL,
			read_at  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (note_id, user_id),
			KEY user_id (user_id)
		) $charset_collate;";

		dbDelta( $sql_notes );
		dbDelta( $sql_reads );

		update_option( 'pinned_schema_version', self::SCHEMA_VERSION );
	}

	/**
	 * Drop both tables and clean all options.
	 * Called only from uninstall.php — never on deactivation.
	 */
	public static function uninstall(): void {
		global $wpdb;

		// Order matters: reads references notes.
		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}pinned_reads" );  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}pinned_notes" );  // phpcs:ignore WordPress.DB.DirectDatabaseQuery

		delete_option( 'pinned_version' );
		delete_option( 'pinned_schema_version' );
	}

	/**
	 * Run any pending schema migrations.
	 * Currently a no-op at schema v1 — structure preserved for v1.1.
	 *
	 * @param int $from Schema version we're upgrading from.
	 */
	public static function migrate( int $from ): void {
		// Example pattern for future use:
		// if ( $from < 2 ) {
		//     global $wpdb;
		//     $wpdb->query( "ALTER TABLE {$wpdb->prefix}pinned_notes ADD COLUMN board_id BIGINT(20) UNSIGNED DEFAULT NULL" );
		// }
	}
}

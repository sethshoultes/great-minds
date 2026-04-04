<?php
/**
 * CRUD operations for notes.
 *
 * All public methods are permission-checked. Cache is keyed by user_id
 * and flushed on every write so reads stay fast without serving stale data.
 *
 * @package Pinned
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Pinned_Notes {

	/** Cache group. */
	const CACHE_GROUP = 'pinned_notes';

	/** Cache TTL in seconds (5 minutes). */
	const CACHE_TTL = 300;

	/** Allowed color values — five, no semantic labels. */
	const COLORS = [ 'yellow', 'blue', 'green', 'pink', 'orange' ];

	// ------------------------------------------------------------------
	// Write operations
	// ------------------------------------------------------------------

	/**
	 * Create a new note.
	 *
	 * @param array $data {
	 *     @type string      $title      Optional title.
	 *     @type string      $body       Note body (required).
	 *     @type string      $color      One of COLORS. Default 'yellow'.
	 *     @type int         $priority   Sort weight. Default 0.
	 *     @type bool        $is_pinned  Pinned to top. Default false.
	 *     @type string|null $expires_at MySQL datetime or null.
	 * }
	 * @param int   $author_id  WordPress user ID.
	 * @return int|WP_Error  New note ID or error.
	 */
	public static function create( array $data, int $author_id ): int|WP_Error {
		if ( ! self::can_create( $author_id ) ) {
			return new WP_Error( 'pinned_forbidden', __( 'You do not have permission to create notes.', 'pinned' ), [ 'status' => 403 ] );
		}

		global $wpdb;

		$body = isset( $data['body'] ) ? wp_kses_post( $data['body'] ) : '';
		if ( '' === trim( wp_strip_all_tags( $body ) ) ) {
			return new WP_Error( 'pinned_empty_body', __( 'Note body cannot be empty.', 'pinned' ), [ 'status' => 400 ] );
		}

		$color = in_array( $data['color'] ?? 'yellow', self::COLORS, true )
			? $data['color']
			: 'yellow';

		$expires_at = null;
		if ( ! empty( $data['expires_at'] ) ) {
			$ts = strtotime( $data['expires_at'] );
			$expires_at = $ts ? gmdate( 'Y-m-d H:i:s', $ts ) : null;
		}

		$inserted = $wpdb->insert(  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			PINNED_TABLE_NOTES,
			[
				'author_id'  => $author_id,
				'title'      => sanitize_text_field( $data['title'] ?? '' ),
				'body'       => $body,
				'color'      => $color,
				'priority'   => absint( $data['priority'] ?? 0 ),
				'is_pinned'  => ! empty( $data['is_pinned'] ) ? 1 : 0,
				'expires_at' => $expires_at,
				'archived'   => 0,
				'created_at' => current_time( 'mysql', true ),
				'updated_at' => current_time( 'mysql', true ),
			],
			[ '%d', '%s', '%s', '%s', '%d', '%d', '%s', '%d', '%s', '%s' ]
		);

		if ( false === $inserted ) {
			return new WP_Error( 'pinned_db_error', __( 'Failed to create note.', 'pinned' ), [ 'status' => 500 ] );
		}

		$note_id = (int) $wpdb->insert_id;

		self::flush_cache_for_user( $author_id );

		// Fire @mention detection asynchronously (same request — lightweight enough).
		Pinned_Notifier::maybe_notify( $note_id, $body, $author_id );

		return $note_id;
	}

	/**
	 * Update an existing note.
	 *
	 * @param int   $note_id    Note to update.
	 * @param array $data       Fields to update (same keys as create).
	 * @param int   $user_id    User performing the update.
	 * @return bool|WP_Error
	 */
	public static function update( int $note_id, array $data, int $user_id ): bool|WP_Error {
		$note = self::get_by_id( $note_id );
		if ( ! $note ) {
			return new WP_Error( 'pinned_not_found', __( 'Note not found.', 'pinned' ), [ 'status' => 404 ] );
		}

		if ( ! self::can_edit( $user_id, $note ) ) {
			return new WP_Error( 'pinned_forbidden', __( 'You do not have permission to edit this note.', 'pinned' ), [ 'status' => 403 ] );
		}

		global $wpdb;

		$fields  = [];
		$formats = [];

		if ( array_key_exists( 'title', $data ) ) {
			$fields['title']  = sanitize_text_field( $data['title'] );
			$formats[]        = '%s';
		}

		if ( array_key_exists( 'body', $data ) ) {
			$body = wp_kses_post( $data['body'] );
			if ( '' === trim( wp_strip_all_tags( $body ) ) ) {
				return new WP_Error( 'pinned_empty_body', __( 'Note body cannot be empty.', 'pinned' ), [ 'status' => 400 ] );
			}
			$fields['body'] = $body;
			$formats[]      = '%s';

			// Re-check @mentions on edit.
			Pinned_Notifier::maybe_notify( $note_id, $body, $user_id );
		}

		if ( array_key_exists( 'color', $data ) ) {
			$fields['color'] = in_array( $data['color'], self::COLORS, true ) ? $data['color'] : 'yellow';
			$formats[]       = '%s';
		}

		if ( array_key_exists( 'priority', $data ) ) {
			$fields['priority'] = absint( $data['priority'] );
			$formats[]          = '%d';
		}

		if ( array_key_exists( 'is_pinned', $data ) ) {
			$fields['is_pinned'] = ! empty( $data['is_pinned'] ) ? 1 : 0;
			$formats[]           = '%d';
		}

		if ( array_key_exists( 'expires_at', $data ) ) {
			$ts                  = strtotime( $data['expires_at'] );
			$fields['expires_at'] = $ts ? gmdate( 'Y-m-d H:i:s', $ts ) : null;
			$formats[]           = '%s';
		}

		if ( empty( $fields ) ) {
			return true; // Nothing to do — not an error.
		}

		$fields['updated_at'] = current_time( 'mysql', true );
		$formats[]            = '%s';

		$updated = $wpdb->update(  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			PINNED_TABLE_NOTES,
			$fields,
			[ 'id' => $note_id ],
			$formats,
			[ '%d' ]
		);

		self::flush_cache_for_user( (int) $note['author_id'] );
		if ( $user_id !== (int) $note['author_id'] ) {
			self::flush_cache_for_user( $user_id );
		}

		return false !== $updated;
	}

	/**
	 * Archive a note (soft-delete).
	 *
	 * @param int $note_id  Note to archive.
	 * @param int $user_id  User performing the archive.
	 * @return bool|WP_Error
	 */
	public static function archive( int $note_id, int $user_id ): bool|WP_Error {
		$note = self::get_by_id( $note_id );
		if ( ! $note ) {
			return new WP_Error( 'pinned_not_found', __( 'Note not found.', 'pinned' ), [ 'status' => 404 ] );
		}

		if ( ! self::can_edit( $user_id, $note ) ) {
			return new WP_Error( 'pinned_forbidden', __( 'You do not have permission to archive this note.', 'pinned' ), [ 'status' => 403 ] );
		}

		global $wpdb;

		$updated = $wpdb->update(  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			PINNED_TABLE_NOTES,
			[ 'archived' => 1, 'updated_at' => current_time( 'mysql', true ) ],
			[ 'id' => $note_id ],
			[ '%d', '%s' ],
			[ '%d' ]
		);

		self::flush_cache_for_user( (int) $note['author_id'] );

		return false !== $updated;
	}

	/**
	 * Hard-delete a note (admin only).
	 *
	 * @param int $note_id  Note to delete.
	 * @param int $user_id  User performing the delete.
	 * @return bool|WP_Error
	 */
	public static function delete( int $note_id, int $user_id ): bool|WP_Error {
		if ( ! user_can( $user_id, 'manage_options' ) ) {
			return new WP_Error( 'pinned_forbidden', __( 'Only admins can permanently delete notes.', 'pinned' ), [ 'status' => 403 ] );
		}

		$note = self::get_by_id( $note_id );
		if ( ! $note ) {
			return new WP_Error( 'pinned_not_found', __( 'Note not found.', 'pinned' ), [ 'status' => 404 ] );
		}

		global $wpdb;

		// Remove reads first (FK integrity, even without DB-level FK constraints).
		$wpdb->delete( PINNED_TABLE_READS, [ 'note_id' => $note_id ], [ '%d' ] );  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$deleted = $wpdb->delete( PINNED_TABLE_NOTES, [ 'id' => $note_id ], [ '%d' ] );  // phpcs:ignore WordPress.DB.DirectDatabaseQuery

		self::flush_cache_for_user( (int) $note['author_id'] );

		return false !== $deleted;
	}

	// ------------------------------------------------------------------
	// Read operations
	// ------------------------------------------------------------------

	/**
	 * Get all active (non-archived) notes visible to a user.
	 *
	 * Result is cached per user for CACHE_TTL seconds.
	 *
	 * @param int $user_id  WordPress user ID.
	 * @return array  Array of note rows with a 'read_by' key listing acknowledging user IDs.
	 */
	public static function get_for_user( int $user_id ): array {
		$cache_key = "notes_{$user_id}";
		$cached    = wp_cache_get( $cache_key, self::CACHE_GROUP );

		if ( false !== $cached ) {
			return $cached;
		}

		global $wpdb;

		$notes = $wpdb->get_results(  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->prepare(
				"SELECT n.*
				 FROM %i AS n
				 WHERE n.archived = 0
				   AND (n.expires_at IS NULL OR n.expires_at > %s)
				 ORDER BY n.is_pinned DESC, n.priority DESC, n.created_at DESC",
				PINNED_TABLE_NOTES,
				current_time( 'mysql', true )
			),
			ARRAY_A
		);

		if ( ! $notes ) {
			$notes = [];
		}

		// Attach acknowledgment lists.
		$notes = self::attach_reads( $notes );

		wp_cache_set( $cache_key, $notes, self::CACHE_GROUP, self::CACHE_TTL );

		return $notes;
	}

	/**
	 * Get archived notes (admin-only endpoint uses this).
	 *
	 * @param int $limit   Max rows. Default 50.
	 * @param int $offset  Pagination offset. Default 0.
	 * @return array
	 */
	public static function get_archived( int $limit = 50, int $offset = 0 ): array {
		global $wpdb;

		$notes = $wpdb->get_results(  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->prepare(
				"SELECT * FROM %i WHERE archived = 1 ORDER BY updated_at DESC LIMIT %d OFFSET %d",
				PINNED_TABLE_NOTES,
				$limit,
				$offset
			),
			ARRAY_A
		);

		return $notes ?: [];
	}

	/**
	 * Fetch a single note by ID.
	 *
	 * @param int $note_id  Note ID.
	 * @return array|null
	 */
	public static function get_by_id( int $note_id ): ?array {
		global $wpdb;

		$note = $wpdb->get_row(  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->prepare(
				"SELECT * FROM %i WHERE id = %d LIMIT 1",
				PINNED_TABLE_NOTES,
				$note_id
			),
			ARRAY_A
		);

		return $note ?: null;
	}

	// ------------------------------------------------------------------
	// Acknowledgment
	// ------------------------------------------------------------------

	/**
	 * Mark a note as read by a user.
	 *
	 * INSERT IGNORE is safe — if the row already exists it silently skips.
	 *
	 * @param int $note_id  Note being acknowledged.
	 * @param int $user_id  User acknowledging it.
	 * @return bool
	 */
	public static function acknowledge( int $note_id, int $user_id ): bool {
		global $wpdb;

		$result = $wpdb->query(  // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->prepare(
				"INSERT IGNORE INTO %i (note_id, user_id, read_at) VALUES (%d, %d, %s)",
				PINNED_TABLE_READS,
				$note_id,
				$user_id,
				current_time( 'mysql', true )
			)
		);

		// Flush so get_for_user re-fetches updated read_by lists.
		self::flush_cache_for_all();

		return false !== $result;
	}

	// ------------------------------------------------------------------
	// Permissions
	// ------------------------------------------------------------------

	/**
	 * Can the user create notes?
	 * Any logged-in user with edit_posts capability can create.
	 *
	 * @param int $user_id
	 * @return bool
	 */
	public static function can_create( int $user_id ): bool {
		return user_can( $user_id, 'edit_posts' );
	}

	/**
	 * Can the user edit/archive this note?
	 * The note author can always edit their own. Admins can edit any.
	 *
	 * @param int   $user_id
	 * @param array $note
	 * @return bool
	 */
	public static function can_edit( int $user_id, array $note ): bool {
		if ( user_can( $user_id, 'manage_options' ) ) {
			return true;
		}
		return (int) $note['author_id'] === $user_id;
	}

	// ------------------------------------------------------------------
	// Internal helpers
	// ------------------------------------------------------------------

	/**
	 * Attach read_by arrays to an array of note rows.
	 *
	 * Single query — no N+1.
	 *
	 * @param array $notes  Array of note rows (ARRAY_A).
	 * @return array  Notes with 'read_by' key populated.
	 */
	private static function attach_reads( array $notes ): array {
		if ( empty( $notes ) ) {
			return $notes;
		}

		global $wpdb;

		$ids          = array_column( $notes, 'id' );
		$placeholders = implode( ', ', array_fill( 0, count( $ids ), '%d' ) );

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
		$reads = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT note_id, user_id FROM %i WHERE note_id IN ($placeholders)",
				array_merge( [ PINNED_TABLE_READS ], $ids )
			),
			ARRAY_A
		);

		// Index reads by note_id.
		$reads_map = [];
		foreach ( $reads as $read ) {
			$reads_map[ (int) $read['note_id'] ][] = (int) $read['user_id'];
		}

		foreach ( $notes as &$note ) {
			$note['read_by'] = $reads_map[ (int) $note['id'] ] ?? [];
		}
		unset( $note );

		return $notes;
	}

	/**
	 * Flush cache entries for a specific user.
	 *
	 * @param int $user_id
	 */
	private static function flush_cache_for_user( int $user_id ): void {
		wp_cache_delete( "notes_{$user_id}", self::CACHE_GROUP );
	}

	/**
	 * Flush all note cache entries.
	 * Used after acknowledgment, which affects every user's view.
	 */
	private static function flush_cache_for_all(): void {
		wp_cache_flush_group( self::CACHE_GROUP );
	}
}

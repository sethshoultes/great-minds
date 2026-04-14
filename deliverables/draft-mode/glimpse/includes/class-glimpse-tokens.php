<?php
/**
 * Token Generation, Validation, and Management
 *
 * SECURITY-CRITICAL: This code handles cryptographic token generation,
 * hashed storage, and validation. All database queries use $wpdb->prepare()
 * and all tokens are stored as SHA-256 hashes.
 *
 * @package GLIMPSE
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Glimpse_Tokens {

	/**
	 * Token generation configuration.
	 * - 32 bytes of random data = 44 characters when base64 encoded
	 * - SHA-256 hash = 64 hex characters for storage
	 */
	const TOKEN_BYTES     = 32;
	const TOKEN_MIN_CHARS = 32;
	const EXPIRATION_DAYS = 7;

	/**
	 * Generate a new cryptographically secure token for a post.
	 *
	 * CRITICAL: The plaintext token is returned once here. After this,
	 * only the hash is stored. Never log or expose the plaintext token.
	 *
	 * @param int $post_id     The post ID.
	 * @param int $user_id     The user ID creating the token.
	 * @return string|false    The plaintext token (44+ chars), or false on error.
	 */
	public static function generate( int $post_id, int $user_id ) {
		global $wpdb;

		// Validate inputs.
		if ( $post_id <= 0 || $user_id <= 0 ) {
			return false;
		}

		// Generate cryptographically secure random bytes.
		$random_bytes = random_bytes( self::TOKEN_BYTES );
		$token        = base64_encode( $random_bytes ); // phpcs:ignore WordPress.PHP.DiscouragedFunctions -- Required for cryptographic token encoding.

		// Hash the token for storage (SHA-256 produces 64 hex characters).
		$token_hash = hash( 'sha256', $token );

		// Calculate expiration: 7 days from now.
		$expires_at = gmdate( 'Y-m-d H:i:s', time() + ( self::EXPIRATION_DAYS * DAY_IN_SECONDS ) );

		// Insert into database using $wpdb->prepare() — CRITICAL for security.
		$result = $wpdb->query(
			$wpdb->prepare(
				"INSERT INTO {$wpdb->prefix}glimpse_tokens (post_id, token_hash, created_by, expires_at) VALUES (%d, %s, %d, %s)",
				$post_id,
				$token_hash,
				$user_id,
				$expires_at
			)
		);

		// Return the plaintext token if insert succeeded.
		return $result ? $token : false;
	}

	/**
	 * Validate a token string and return token record if valid.
	 *
	 * CRITICAL SECURITY CHECKS:
	 * 1. Format validation (base64, >= 32 chars) BEFORE database lookup
	 * 2. Hash the token before querying the database
	 * 3. Check expiration after retrieval
	 *
	 * @param string $token The plaintext token from URL query parameter.
	 * @return array|string|false Token record array if valid, 'expired' if expired, false if invalid.
	 */
	public static function validate( string $token ) {
		global $wpdb;

		// Format validation BEFORE database lookup (prevents SQL injection attempts).
		if ( ! is_string( $token ) ) {
			return false;
		}

		if ( strlen( $token ) < self::TOKEN_MIN_CHARS ) {
			return false;
		}

		// Validate base64 format (optional safety check).
		if ( ! self::is_valid_base64( $token ) ) {
			return false;
		}

		// Hash the incoming token to match database storage.
		$token_hash = hash( 'sha256', $token );

		// Query database using $wpdb->prepare() for safety.
		$record = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$wpdb->prefix}glimpse_tokens WHERE token_hash = %s",
				$token_hash
			)
		);

		// Token not found.
		if ( ! $record ) {
			return false;
		}

		// Check expiration.
		$current_time = gmdate( 'Y-m-d H:i:s' );
		if ( $record->expires_at < $current_time ) {
			return 'expired';
		}

		// Token is valid — return the record.
		return (array) $record;
	}

	/**
	 * Regenerate a token for a post.
	 *
	 * Deletes any existing tokens for the post (invalidating old URLs)
	 * and generates a new token.
	 *
	 * @param int $post_id The post ID.
	 * @param int $user_id The user ID requesting regeneration.
	 * @return string|false The new plaintext token, or false on error.
	 */
	public static function regenerate( int $post_id, int $user_id ) {
		global $wpdb;

		if ( $post_id <= 0 || $user_id <= 0 ) {
			return false;
		}

		// Delete existing tokens for this post (old URLs become invalid).
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->prefix}glimpse_tokens WHERE post_id = %d",
				$post_id
			)
		);

		// Generate new token.
		return self::generate( $post_id, $user_id );
	}

	/**
	 * Get the preview URL for a token.
	 *
	 * @param string $token    The plaintext token.
	 * @param int    $post_id  The post ID (for context).
	 * @return string The full preview URL with token query parameter.
	 */
	public static function get_url( string $token, int $post_id = 0 ): string {
		// Use home_url to construct the preview link with the token.
		return home_url( '?glimpse=' . urlencode( $token ) );
	}

	/**
	 * Get the token record for a post (for admin display).
	 *
	 * Returns the token metadata (post_id, created_by, created_at, expires_at)
	 * but NOT the plaintext token (which is never retrievable after generation).
	 *
	 * @param int $post_id The post ID.
	 * @return array|false Token record array if found, false otherwise.
	 */
	public static function get_by_post( int $post_id ) {
		global $wpdb;

		if ( $post_id <= 0 ) {
			return false;
		}

		$record = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT id, post_id, created_by, created_at, expires_at FROM {$wpdb->prefix}glimpse_tokens WHERE post_id = %d ORDER BY created_at DESC LIMIT 1",
				$post_id
			)
		);

		return $record ? (array) $record : false;
	}

	/**
	 * Check if a string is valid base64.
	 *
	 * This is a safety check before database lookup. Not foolproof,
	 * but catches obviously malformed token attempts.
	 *
	 * @param string $str The string to validate.
	 * @return bool True if valid base64 pattern, false otherwise.
	 */
	private static function is_valid_base64( string $str ): bool {
		// Check for valid base64 characters (A-Z, a-z, 0-9, +, /, =).
		return (bool) preg_match( '/^[A-Za-z0-9+\/]*={0,2}$/', $str );
	}

	/**
	 * Delete expired tokens (called by cron job).
	 *
	 * @return int Number of rows deleted.
	 */
	public static function delete_expired(): int {
		global $wpdb;

		$current_time = gmdate( 'Y-m-d H:i:s' );

		return (int) $wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->prefix}glimpse_tokens WHERE expires_at < %s",
				$current_time
			)
		);
	}
}

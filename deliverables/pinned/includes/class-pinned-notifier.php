<?php
/**
 * @mention detection and notification dispatch.
 *
 * When a note body contains @username, this class:
 *   1. Sends a wp_mail() to the mentioned user (unless filtered off).
 *   2. Queues an admin-notice transient so the user sees it on next load.
 *
 * Filter: pinned_disable_email_notification (bool, default false)
 *   Add your return true to suppress email globally.
 *
 * @package Pinned
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Pinned_Notifier {

	/** Transient prefix for per-user admin notices. */
	const TRANSIENT_PREFIX = 'pinned_mention_';

	/** Transient TTL — notices expire after 24 hours if unread. */
	const TRANSIENT_TTL = DAY_IN_SECONDS;

	/**
	 * Parse @mentions in a note body, notify each mentioned user.
	 *
	 * Safe to call on both create and update — deduplication happens
	 * at the transient level (existing transients are extended, not duplicated).
	 *
	 * @param int    $note_id    The note containing the mention.
	 * @param string $body       Raw note body (HTML allowed).
	 * @param int    $author_id  User who wrote/edited the note.
	 */
	public static function maybe_notify( int $note_id, string $body, int $author_id ): void {
		$mentions = self::extract_mentions( $body );

		if ( empty( $mentions ) ) {
			return;
		}

		$author = get_userdata( $author_id );
		$author_name = $author ? $author->display_name : __( 'A team member', 'pinned' );
		$note   = Pinned_Notes::get_by_id( $note_id );

		foreach ( $mentions as $username ) {
			$user = get_user_by( 'login', $username );
			if ( ! $user || $user->ID === $author_id ) {
				continue; // Skip unknowns and self-mentions.
			}

			self::send_admin_notice( $user->ID, $note_id, $author_name, $note );
			self::send_email( $user, $note_id, $author_name, $note );
		}
	}

	// ------------------------------------------------------------------
	// Private helpers
	// ------------------------------------------------------------------

	/**
	 * Extract @username mentions from a body string.
	 *
	 * Matches @word-chars, strips HTML tags first so inline markup
	 * doesn't create false matches like "@<strong>user</strong>".
	 *
	 * @param string $body
	 * @return string[]  Array of lowercase usernames (no @).
	 */
	private static function extract_mentions( string $body ): array {
		$plain = wp_strip_all_tags( $body );

		// Match @username — word chars, hyphens, dots.
		preg_match_all( '/@([\w.\-]+)/u', $plain, $matches );

		if ( empty( $matches[1] ) ) {
			return [];
		}

		// Deduplicate and lowercase.
		return array_values( array_unique( array_map( 'strtolower', $matches[1] ) ) );
	}

	/**
	 * Queue an admin-notice transient for the mentioned user.
	 *
	 * The transient is an array of pending notices, so multiple mentions
	 * accumulate until the user visits wp-admin and they're cleared.
	 *
	 * @param int    $user_id      Mentioned user.
	 * @param int    $note_id      Note containing the mention.
	 * @param string $author_name  Display name of note author.
	 * @param array|null $note     Full note row (for context in the notice).
	 */
	private static function send_admin_notice(
		int $user_id,
		int $note_id,
		string $author_name,
		?array $note
	): void {
		$key     = self::TRANSIENT_PREFIX . $user_id;
		$pending = get_transient( $key );
		if ( ! is_array( $pending ) ) {
			$pending = [];
		}

		// Avoid spamming duplicate notices for the same note.
		foreach ( $pending as $entry ) {
			if ( isset( $entry['note_id'] ) && (int) $entry['note_id'] === $note_id ) {
				// Update timestamp only — don't double-add.
				set_transient( $key, $pending, self::TRANSIENT_TTL );
				return;
			}
		}

		$pending[] = [
			'note_id'     => $note_id,
			'author_name' => $author_name,
			'title'       => $note['title'] ?? '',
			'time'        => time(),
		];

		set_transient( $key, $pending, self::TRANSIENT_TTL );

		// Register the notice display hook once (idempotent via array_unique in WP).
		add_action( 'admin_notices', function () use ( $user_id ) {
			Pinned_Notifier::display_admin_notices( $user_id );
		} );
	}

	/**
	 * Render queued admin notices for the current user and clear the transient.
	 *
	 * @param int $user_id  User whose notices to display.
	 */
	public static function display_admin_notices( int $user_id ): void {
		if ( get_current_user_id() !== $user_id ) {
			return;
		}

		$key     = self::TRANSIENT_PREFIX . $user_id;
		$pending = get_transient( $key );

		if ( empty( $pending ) ) {
			return;
		}

		delete_transient( $key );

		foreach ( $pending as $entry ) {
			$note_label = ! empty( $entry['title'] )
				? esc_html( $entry['title'] )
				: sprintf( '#%d', (int) $entry['note_id'] );

			printf(
				'<div class="notice notice-info is-dismissible"><p>%s</p></div>',
				wp_kses_post(
					sprintf(
						/* translators: 1: author name, 2: note title/ID */
						__( '<strong>Pinned:</strong> %1$s mentioned you in a note — <em>%2$s</em>.', 'pinned' ),
						esc_html( $entry['author_name'] ),
						$note_label
					)
				)
			);
		}
	}

	/**
	 * Send email notification to a mentioned user.
	 *
	 * Skipped if:
	 *   - the `pinned_disable_email_notification` filter returns true.
	 *   - the user has no valid email address.
	 *
	 * @param WP_User    $user         Mentioned user object.
	 * @param int        $note_id      Note ID.
	 * @param string     $author_name  Note author display name.
	 * @param array|null $note         Full note row.
	 */
	private static function send_email(
		WP_User $user,
		int $note_id,
		string $author_name,
		?array $note
	): void {
		/**
		 * Disable email notifications globally.
		 *
		 * @param bool $disable  Set to true to prevent all Pinned emails.
		 */
		if ( apply_filters( 'pinned_disable_email_notification', false ) ) {
			return;
		}

		if ( empty( $user->user_email ) ) {
			return;
		}

		$note_title = ! empty( $note['title'] ) ? $note['title'] : sprintf( __( 'Note #%d', 'pinned' ), $note_id );
		$admin_url  = admin_url( 'index.php' ); // Dashboard — where widget lives.

		$subject = sprintf(
			/* translators: 1: author name */
			__( '[%1$s] %2$s mentioned you in a Pinned note', 'pinned' ),
			get_bloginfo( 'name' ),
			$author_name
		);

		$message = sprintf(
			/* translators: 1: user display name, 2: author name, 3: note title, 4: dashboard URL */
			__(
				"Hi %1\$s,\n\n%2\$s mentioned you in a Pinned note:\n\n\"%3\$s\"\n\nView it on the dashboard:\n%4\$s\n\n-- %5\$s",
				'pinned'
			),
			$user->display_name,
			$author_name,
			$note_title,
			$admin_url,
			get_bloginfo( 'name' )
		);

		/**
		 * Filter the email subject for a mention notification.
		 *
		 * @param string  $subject
		 * @param WP_User $user
		 * @param int     $note_id
		 */
		$subject = apply_filters( 'pinned_mention_email_subject', $subject, $user, $note_id );

		/**
		 * Filter the email message for a mention notification.
		 *
		 * @param string  $message
		 * @param WP_User $user
		 * @param int     $note_id
		 */
		$message = apply_filters( 'pinned_mention_email_message', $message, $user, $note_id );

		wp_mail( $user->user_email, $subject, $message );
	}
}

<?php
/**
 * Dashboard widget.
 *
 * Server-renders a shell div with the inline JSON already embedded.
 * The JS layer hydrates from window.pinnedData — zero extra HTTP on page load.
 *
 * @package Pinned
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Pinned_Widget {

	/** Widget ID for wp_add_dashboard_widget. */
	const WIDGET_ID = 'pinned_notes_widget';

	/**
	 * Register the dashboard widget.
	 * Hooked to wp_dashboard_setup.
	 */
	public static function register(): void {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}

		wp_add_dashboard_widget(
			self::WIDGET_ID,
			__( 'Pinned Notes', 'pinned' ),
			[ self::class, 'render' ],
			null, // Control callback — none needed.
			null, // Callback args.
			'normal',
			'high'
		);
	}

	/**
	 * Render the widget.
	 *
	 * The #pinned-board div is the mount point for the JS layer.
	 * We embed a JSON snapshot so the first paint is synchronous.
	 */
	public static function render(): void {
		$user_id = get_current_user_id();
		$notes   = Pinned_Notes::get_for_user( $user_id );
		$nonce   = wp_create_nonce( 'wp_rest' );
		$rest    = esc_url( rest_url( 'pinned/v1' ) );

		// Inline JSON — identical to what pinned_enqueue_assets provides via
		// wp_localize_script, but scoped to the widget for non-dashboard pages
		// where the full script may not be enqueued.
		$inline_data = wp_json_encode(
			[
				'notes'   => $notes,
				'nonce'   => $nonce,
				'restUrl' => $rest,
				'userId'  => $user_id,
				'colors'  => [ 'yellow', 'blue', 'green', 'pink', 'orange' ],
			],
			JSON_HEX_TAG | JSON_HEX_AMP
		);
		?>
		<div
			id="pinned-board"
			class="pinned-board"
			data-pinned="<?php echo esc_attr( $inline_data ); ?>"
			role="region"
			aria-label="<?php esc_attr_e( 'Pinned Notes', 'pinned' ); ?>"
		>
			<?php if ( empty( $notes ) ) : ?>
				<p class="pinned-empty-state">
					<?php esc_html_e( 'No notes yet. Double-click to add one.', 'pinned' ); ?>
				</p>
			<?php else : ?>
				<?php foreach ( $notes as $note ) : ?>
					<?php self::render_note( $note, $user_id ); ?>
				<?php endforeach; ?>
			<?php endif; ?>

			<button
				class="pinned-add-btn"
				aria-label="<?php esc_attr_e( 'Add a note', 'pinned' ); ?>"
				title="<?php esc_attr_e( 'Add a note', 'pinned' ); ?>"
			>+</button>
		</div>
		<?php
	}

	/**
	 * Render a single note card.
	 * CSS classes for color and visual aging (fresh / aging / stale).
	 *
	 * @param array $note    Note row.
	 * @param int   $user_id Current user — used to set acknowledged state.
	 */
	private static function render_note( array $note, int $user_id ): void {
		$age_class    = self::age_class( $note['created_at'] );
		$color_class  = 'pinned-color-' . sanitize_html_class( $note['color'] ?? 'yellow' );
		$pinned_class = ! empty( $note['is_pinned'] ) ? 'pinned-is-pinned' : '';
		$acked        = in_array( $user_id, (array) ( $note['read_by'] ?? [] ), true );
		$ack_class    = $acked ? 'pinned-acked' : '';
		$note_id      = (int) $note['id'];
		?>
		<article
			class="pinned-note <?php echo esc_attr( implode( ' ', array_filter( [ $color_class, $age_class, $pinned_class, $ack_class ] ) ) ); ?>"
			data-note-id="<?php echo esc_attr( $note_id ); ?>"
			data-color="<?php echo esc_attr( $note['color'] ); ?>"
			role="article"
			aria-label="<?php echo esc_attr( sprintf( __( 'Note: %s', 'pinned' ), $note['title'] ?: __( 'Untitled', 'pinned' ) ) ); ?>"
		>
			<?php if ( ! empty( $note['is_pinned'] ) ) : ?>
				<span class="pinned-pin-indicator" aria-label="<?php esc_attr_e( 'Pinned', 'pinned' ); ?>">&#128204;</span>
			<?php endif; ?>

			<?php if ( ! empty( $note['title'] ) ) : ?>
				<h3 class="pinned-note-title"><?php echo esc_html( $note['title'] ); ?></h3>
			<?php endif; ?>

			<div class="pinned-note-body"><?php echo wp_kses_post( $note['body'] ); ?></div>

			<footer class="pinned-note-footer">
				<time
					class="pinned-note-age"
					datetime="<?php echo esc_attr( $note['created_at'] ); ?>"
					title="<?php echo esc_attr( $note['created_at'] ); ?>"
				><?php echo esc_html( self::human_time( $note['created_at'] ) ); ?></time>

				<div class="pinned-note-actions" role="group" aria-label="<?php esc_attr_e( 'Note actions', 'pinned' ); ?>">
					<?php if ( ! $acked ) : ?>
						<button
							class="pinned-ack-btn"
							data-note-id="<?php echo esc_attr( $note_id ); ?>"
							aria-label="<?php esc_attr_e( 'Acknowledge note', 'pinned' ); ?>"
							title="<?php esc_attr_e( 'Mark as read', 'pinned' ); ?>"
						>&#10003;</button>
					<?php else : ?>
						<span class="pinned-acked-indicator" aria-label="<?php esc_attr_e( 'Acknowledged', 'pinned' ); ?>">&#10003;</span>
					<?php endif; ?>

					<?php if ( Pinned_Notes::can_edit( $user_id, $note ) ) : ?>
						<button
							class="pinned-archive-btn"
							data-note-id="<?php echo esc_attr( $note_id ); ?>"
							aria-label="<?php esc_attr_e( 'Archive note', 'pinned' ); ?>"
							title="<?php esc_attr_e( 'Archive', 'pinned' ); ?>"
						>&#128451;</button>
					<?php endif; ?>
				</div>

				<?php if ( ! empty( $note['read_by'] ) ) : ?>
					<span class="pinned-read-count" title="<?php esc_attr_e( 'Acknowledged by', 'pinned' ); ?>">
						&#128065; <?php echo esc_html( count( $note['read_by'] ) ); ?>
					</span>
				<?php endif; ?>
			</footer>
		</article>
		<?php
	}

	/**
	 * Return a CSS class based on how old the note is.
	 *
	 * fresh  → < 24 hours
	 * aging  → 24 hours – 3 days
	 * stale  → > 3 days
	 *
	 * @param string $created_at  MySQL datetime (UTC).
	 * @return string
	 */
	private static function age_class( string $created_at ): string {
		$age_seconds = time() - strtotime( $created_at );

		if ( $age_seconds < DAY_IN_SECONDS ) {
			return 'pinned-age-fresh';
		}
		if ( $age_seconds < 3 * DAY_IN_SECONDS ) {
			return 'pinned-age-aging';
		}
		return 'pinned-age-stale';
	}

	/**
	 * Human-readable relative time string.
	 *
	 * @param string $created_at  MySQL datetime (UTC).
	 * @return string
	 */
	private static function human_time( string $created_at ): string {
		$diff = human_time_diff( strtotime( $created_at ), current_time( 'timestamp', true ) );
		/* translators: %s: time difference e.g. "2 hours" */
		return sprintf( __( '%s ago', 'pinned' ), $diff );
	}
}

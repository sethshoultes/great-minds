<?php
/**
 * REST API — pinned/v1.
 *
 * Endpoints:
 *   GET    /notes              List active notes for current user.
 *   POST   /notes              Create a note.
 *   PATCH  /notes/{id}         Update a note.
 *   DELETE /notes/{id}         Hard-delete (admin only).
 *   POST   /notes/{id}/archive Soft-archive.
 *   POST   /notes/{id}/acknowledge  Mark as read.
 *   GET    /notes/archived     List archived notes (admin only).
 *
 * Auth: nonce via X-WP-Nonce header (wp_rest nonce).
 * All $wpdb queries use $wpdb->prepare — no raw interpolation.
 *
 * @package Pinned
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Pinned_REST {

	/** REST namespace. */
	const NAMESPACE = 'pinned/v1';

	/**
	 * Register all routes.
	 * Hooked to rest_api_init.
	 */
	public static function register_routes(): void {
		// Collection.
		register_rest_route(
			self::NAMESPACE,
			'/notes',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ self::class, 'get_notes' ],
					'permission_callback' => [ self::class, 'is_logged_in' ],
				],
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ self::class, 'create_note' ],
					'permission_callback' => [ self::class, 'can_create' ],
					'args'                => self::note_args(),
				],
			]
		);

		// Archived list (must be before /{id} to avoid capture).
		register_rest_route(
			self::NAMESPACE,
			'/notes/archived',
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [ self::class, 'get_archived' ],
				'permission_callback' => [ self::class, 'is_admin' ],
				'args'                => [
					'limit'  => [
						'type'    => 'integer',
						'default' => 50,
						'minimum' => 1,
						'maximum' => 200,
					],
					'offset' => [
						'type'    => 'integer',
						'default' => 0,
						'minimum' => 0,
					],
				],
			]
		);

		// Single item.
		register_rest_route(
			self::NAMESPACE,
			'/notes/(?P<id>\d+)',
			[
				[
					'methods'             => 'PATCH',
					'callback'            => [ self::class, 'update_note' ],
					'permission_callback' => [ self::class, 'is_logged_in' ],
					'args'                => self::note_args( false ),
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ self::class, 'delete_note' ],
					'permission_callback' => [ self::class, 'is_admin' ],
				],
			]
		);

		// Archive action.
		register_rest_route(
			self::NAMESPACE,
			'/notes/(?P<id>\d+)/archive',
			[
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => [ self::class, 'archive_note' ],
				'permission_callback' => [ self::class, 'is_logged_in' ],
			]
		);

		// Acknowledge action.
		register_rest_route(
			self::NAMESPACE,
			'/notes/(?P<id>\d+)/acknowledge',
			[
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => [ self::class, 'acknowledge_note' ],
				'permission_callback' => [ self::class, 'is_logged_in' ],
			]
		);
	}

	// ------------------------------------------------------------------
	// Handlers
	// ------------------------------------------------------------------

	/**
	 * GET /notes
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public static function get_notes( WP_REST_Request $request ): WP_REST_Response {
		$notes = Pinned_Notes::get_for_user( get_current_user_id() );
		return rest_ensure_response( array_map( [ self::class, 'format_note' ], $notes ) );
	}

	/**
	 * POST /notes
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public static function create_note( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$result = Pinned_Notes::create(
			$request->get_params(),
			get_current_user_id()
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		$note = Pinned_Notes::get_by_id( $result );
		$response = rest_ensure_response( self::format_note( $note ) );
		$response->set_status( 201 );
		$response->header( 'Location', rest_url( self::NAMESPACE . '/notes/' . $result ) );

		return $response;
	}

	/**
	 * PATCH /notes/{id}
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public static function update_note( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$note_id = (int) $request->get_param( 'id' );
		$result  = Pinned_Notes::update(
			$note_id,
			$request->get_params(),
			get_current_user_id()
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		$note = Pinned_Notes::get_by_id( $note_id );
		return rest_ensure_response( self::format_note( $note ) );
	}

	/**
	 * DELETE /notes/{id}
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public static function delete_note( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$result = Pinned_Notes::delete(
			(int) $request->get_param( 'id' ),
			get_current_user_id()
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response( [ 'deleted' => true ] );
	}

	/**
	 * POST /notes/{id}/archive
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public static function archive_note( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$result = Pinned_Notes::archive(
			(int) $request->get_param( 'id' ),
			get_current_user_id()
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response( [ 'archived' => true ] );
	}

	/**
	 * POST /notes/{id}/acknowledge
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public static function acknowledge_note( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$note_id = (int) $request->get_param( 'id' );
		$note    = Pinned_Notes::get_by_id( $note_id );

		if ( ! $note ) {
			return new WP_Error( 'pinned_not_found', __( 'Note not found.', 'pinned' ), [ 'status' => 404 ] );
		}

		Pinned_Notes::acknowledge( $note_id, get_current_user_id() );

		return rest_ensure_response( [ 'acknowledged' => true ] );
	}

	/**
	 * GET /notes/archived
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public static function get_archived( WP_REST_Request $request ): WP_REST_Response {
		$notes = Pinned_Notes::get_archived(
			(int) $request->get_param( 'limit' ),
			(int) $request->get_param( 'offset' )
		);
		return rest_ensure_response( array_map( [ self::class, 'format_note' ], $notes ) );
	}

	// ------------------------------------------------------------------
	// Permission callbacks
	// ------------------------------------------------------------------

	/** Any logged-in user. */
	public static function is_logged_in(): bool {
		return is_user_logged_in();
	}

	/** Any logged-in user who can create posts. */
	public static function can_create(): bool {
		return current_user_can( 'edit_posts' );
	}

	/** Administrators only. */
	public static function is_admin(): bool {
		return current_user_can( 'manage_options' );
	}

	// ------------------------------------------------------------------
	// Schema helpers
	// ------------------------------------------------------------------

	/**
	 * Argument definitions for note create/update endpoints.
	 *
	 * @param bool $required  Whether body is required (true for create, false for patch).
	 * @return array
	 */
	private static function note_args( bool $required = true ): array {
		return [
			'title'      => [
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'required'          => false,
			],
			'body'       => [
				'type'              => 'string',
				'sanitize_callback' => 'wp_kses_post',
				'required'          => $required,
			],
			'color'      => [
				'type'    => 'string',
				'enum'    => [ 'yellow', 'blue', 'green', 'pink', 'orange' ],
				'default' => 'yellow',
			],
			'priority'   => [
				'type'    => 'integer',
				'default' => 0,
				'minimum' => 0,
			],
			'is_pinned'  => [
				'type'    => 'boolean',
				'default' => false,
			],
			'expires_at' => [
				'type'              => 'string',
				'format'            => 'date-time',
				'required'          => false,
				'sanitize_callback' => 'sanitize_text_field',
			],
		];
	}

	/**
	 * Format a raw DB row into a REST-safe array.
	 *
	 * Casts types to avoid "1" vs true ambiguity across languages.
	 *
	 * @param array|null $note
	 * @return array
	 */
	private static function format_note( ?array $note ): array {
		if ( ! $note ) {
			return [];
		}

		return [
			'id'         => (int) $note['id'],
			'author_id'  => (int) $note['author_id'],
			'title'      => (string) $note['title'],
			'body'       => (string) $note['body'],
			'color'      => (string) $note['color'],
			'priority'   => (int) $note['priority'],
			'is_pinned'  => (bool) $note['is_pinned'],
			'expires_at' => $note['expires_at'],
			'archived'   => (bool) $note['archived'],
			'created_at' => (string) $note['created_at'],
			'updated_at' => (string) $note['updated_at'],
			'position_x' => isset( $note['position_x'] ) ? (float) $note['position_x'] : null,
			'position_y' => isset( $note['position_y'] ) ? (float) $note['position_y'] : null,
			'read_by'    => array_map( 'intval', (array) ( $note['read_by'] ?? [] ) ),
		];
	}
}

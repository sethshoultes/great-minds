<?php
/**
 * LocalGenius API Handler
 *
 * Handles WordPress REST API endpoints for the chat widget.
 * Proxies requests to the Cloudflare Worker for LLM processing.
 *
 * @package LocalGenius
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class LocalGenius_API_Handler
 *
 * REST API endpoint registration and request handling.
 */
class LocalGenius_API_Handler {

	/**
	 * Cloudflare Worker endpoint URL.
	 * Override with LOCALGENIUS_WORKER_URL constant if needed.
	 *
	 * @var string
	 */
	private const DEFAULT_WORKER_URL = 'https://localgenius-chat.workers.dev/api/chat';

	/**
	 * Register REST API routes.
	 */
	public static function register_routes(): void {
		register_rest_route(
			'localgenius/v1',
			'/chat',
			[
				'methods'             => 'POST',
				'callback'            => [ self::class, 'handle_chat_request' ],
				'permission_callback' => '__return_true',
				'args'                => [
					'question' => [
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
						'validate_callback' => function ( $value ) {
							return ! empty( $value ) && strlen( $value ) <= 500;
						},
					],
				],
			]
		);

		register_rest_route(
			'localgenius/v1',
			'/log',
			[
				'methods'             => 'POST',
				'callback'            => [ self::class, 'handle_log_request' ],
				'permission_callback' => '__return_true',
				'args'                => [
					'cacheHit' => [
						'required' => false,
						'type'     => 'boolean',
						'default'  => false,
					],
				],
			]
		);
	}

	/**
	 * Handle chat request from widget.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response|WP_Error Response object.
	 */
	public static function handle_chat_request( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$question      = $request->get_param( 'question' );
		$business_type = get_option( 'localgenius_business_type', 'general' );
		$location      = get_option( 'localgenius_location', '' );
		$site_id       = md5( home_url() );

		// Get FAQ context for the business type.
		require_once LOCALGENIUS_PLUGIN_DIR . 'includes/class-faq-templates.php';
		$faq_context = LocalGenius_FAQ_Templates::get_faq_context( $business_type );

		// Get homepage data for additional context.
		$homepage_data = get_option( 'localgenius_homepage_data', [] );
		$business_name = isset( $homepage_data['business_name'] ) ? $homepage_data['business_name'] : get_bloginfo( 'name' );
		$phone         = isset( $homepage_data['phone'] ) ? $homepage_data['phone'] : '';

		// Build request payload for Worker.
		$payload = [
			'question'     => $question,
			'businessType' => $business_type,
			'location'     => $location,
			'siteId'       => $site_id,
			'businessName' => $business_name,
			'phone'        => $phone,
			'faqContext'   => $faq_context,
		];

		// Send request to Cloudflare Worker.
		$worker_url = defined( 'LOCALGENIUS_WORKER_URL' ) ? LOCALGENIUS_WORKER_URL : self::DEFAULT_WORKER_URL;

		$response = wp_remote_post(
			$worker_url,
			[
				'timeout' => 5,
				'headers' => [
					'Content-Type' => 'application/json',
				],
				'body'    => wp_json_encode( $payload ),
			]
		);

		// Handle Worker request errors.
		if ( is_wp_error( $response ) ) {
			return self::get_fallback_response( $phone );
		}

		$status = wp_remote_retrieve_response_code( $response );

		// Handle rate limiting.
		if ( $status === 429 ) {
			return new WP_REST_Response(
				[
					'answer'    => "You've reached your question limit for now. Please try again later or give us a call.",
					'source'    => 'rate_limit',
					'timestamp' => gmdate( 'c' ),
				],
				200
			);
		}

		// Handle other errors.
		if ( $status !== 200 ) {
			return self::get_fallback_response( $phone );
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( json_last_error() !== JSON_ERROR_NONE || ! isset( $body['answer'] ) ) {
			return self::get_fallback_response( $phone );
		}

		// Increment question count for logging.
		self::increment_question_count( $body['source'] ?? 'llm' );

		return new WP_REST_Response(
			[
				'answer'    => $body['answer'],
				'source'    => $body['source'] ?? 'llm',
				'timestamp' => gmdate( 'c' ),
			],
			200
		);
	}

	/**
	 * Handle logging request from widget.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response Response object.
	 */
	public static function handle_log_request( WP_REST_Request $request ): WP_REST_Response {
		$cache_hit = $request->get_param( 'cacheHit' );

		// Increment counts (no PII stored).
		$total = (int) get_option( 'localgenius_question_count', 0 );
		update_option( 'localgenius_question_count', $total + 1 );

		if ( $cache_hit ) {
			$hits = (int) get_option( 'localgenius_cache_hits', 0 );
			update_option( 'localgenius_cache_hits', $hits + 1 );
		}

		update_option( 'localgenius_last_question', time() );

		return new WP_REST_Response( [ 'logged' => true ], 200 );
	}

	/**
	 * Generate fallback response when Worker is unavailable.
	 *
	 * @param string $phone Business phone number for fallback.
	 * @return WP_REST_Response Fallback response.
	 */
	private static function get_fallback_response( string $phone ): WP_REST_Response {
		$message = "I'm having a bit of trouble right now.";

		if ( ! empty( $phone ) ) {
			$message .= " I'd recommend calling us directly at {$phone} for assistance.";
		} else {
			$message .= ' Please try again in a moment or contact us directly.';
		}

		return new WP_REST_Response(
			[
				'answer'    => $message,
				'source'    => 'fallback',
				'timestamp' => gmdate( 'c' ),
			],
			200
		);
	}

	/**
	 * Increment question count for internal tracking.
	 *
	 * @param string $source Response source (llm, cached, fallback).
	 */
	private static function increment_question_count( string $source ): void {
		$total = (int) get_option( 'localgenius_question_count', 0 );
		update_option( 'localgenius_question_count', $total + 1 );

		if ( $source === 'cached' ) {
			$hits = (int) get_option( 'localgenius_cache_hits', 0 );
			update_option( 'localgenius_cache_hits', $hits + 1 );
		}

		update_option( 'localgenius_last_question', time() );
	}
}

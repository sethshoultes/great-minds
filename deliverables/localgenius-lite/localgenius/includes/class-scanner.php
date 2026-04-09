<?php
/**
 * LocalGenius Homepage Scanner
 *
 * Extracts business information from the homepage on plugin activation.
 * Provides fallback data for LLM context and error messages.
 *
 * @package LocalGenius
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class LocalGenius_Scanner
 *
 * Handles homepage data extraction for business name and phone number.
 */
class LocalGenius_Scanner {

	/**
	 * Common phone number regex patterns.
	 *
	 * @var string
	 */
	private const PHONE_PATTERN = '/(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/';

	/**
	 * Extract business data from homepage and store in options.
	 *
	 * @return array Extracted data array.
	 */
	public static function extract(): array {
		$data = [
			'business_name' => '',
			'phone'         => '',
			'extracted_at'  => time(),
		];

		// Try to get homepage content.
		$homepage_content = self::fetch_homepage();
		if ( empty( $homepage_content ) ) {
			// Fallback to WordPress site info.
			$data['business_name'] = get_bloginfo( 'name' );
			update_option( 'localgenius_homepage_data', $data );
			return $data;
		}

		// Extract business name.
		$data['business_name'] = self::extract_business_name( $homepage_content );

		// Extract phone number.
		$data['phone'] = self::extract_phone( $homepage_content );

		// Store extracted data.
		update_option( 'localgenius_homepage_data', $data );

		return $data;
	}

	/**
	 * Fetch homepage content.
	 *
	 * @return string Homepage HTML content or empty string on failure.
	 */
	private static function fetch_homepage(): string {
		$response = wp_remote_get(
			home_url( '/' ),
			[
				'timeout'    => 3,
				'user-agent' => 'LocalGenius Scanner/1.0',
				'sslverify'  => false,
			]
		);

		if ( is_wp_error( $response ) ) {
			return '';
		}

		$status = wp_remote_retrieve_response_code( $response );
		if ( $status !== 200 ) {
			return '';
		}

		return wp_remote_retrieve_body( $response );
	}

	/**
	 * Extract business name from HTML content.
	 *
	 * @param string $html Homepage HTML content.
	 * @return string Extracted business name.
	 */
	private static function extract_business_name( string $html ): string {
		// Priority 1: Look for <title> tag.
		if ( preg_match( '/<title[^>]*>([^<]+)<\/title>/i', $html, $matches ) ) {
			$title = trim( $matches[1] );
			// Clean up common title patterns.
			$title = preg_replace( '/\s*[-|]\s*Home.*$/i', '', $title );
			$title = preg_replace( '/\s*[-|]\s*Welcome.*$/i', '', $title );
			if ( ! empty( $title ) && strlen( $title ) < 100 ) {
				return sanitize_text_field( $title );
			}
		}

		// Priority 2: Look for <h1> tag.
		if ( preg_match( '/<h1[^>]*>([^<]+)<\/h1>/i', $html, $matches ) ) {
			$h1 = trim( strip_tags( $matches[1] ) );
			if ( ! empty( $h1 ) && strlen( $h1 ) < 100 ) {
				return sanitize_text_field( $h1 );
			}
		}

		// Priority 3: Look for og:site_name meta tag.
		if ( preg_match( '/<meta[^>]+property=["\']og:site_name["\'][^>]+content=["\']([^"\']+)["\']/i', $html, $matches ) ) {
			return sanitize_text_field( trim( $matches[1] ) );
		}

		// Fallback: Use WordPress site name.
		return get_bloginfo( 'name' );
	}

	/**
	 * Extract phone number from HTML content.
	 *
	 * @param string $html Homepage HTML content.
	 * @return string Extracted phone number or empty string.
	 */
	private static function extract_phone( string $html ): string {
		// Priority 1: Look for tel: links.
		if ( preg_match( '/href=["\']tel:([^"\']+)["\']/i', $html, $matches ) ) {
			$phone = self::clean_phone( $matches[1] );
			if ( self::is_valid_phone( $phone ) ) {
				return $phone;
			}
		}

		// Priority 2: Look for phone patterns in visible text.
		// Remove scripts and styles first.
		$clean_html = preg_replace( '/<script[^>]*>.*?<\/script>/is', '', $html );
		$clean_html = preg_replace( '/<style[^>]*>.*?<\/style>/is', '', $clean_html );
		$text       = strip_tags( $clean_html );

		if ( preg_match_all( self::PHONE_PATTERN, $text, $matches ) ) {
			foreach ( $matches[0] as $phone ) {
				$phone = self::clean_phone( $phone );
				if ( self::is_valid_phone( $phone ) ) {
					return $phone;
				}
			}
		}

		return '';
	}

	/**
	 * Clean and format phone number.
	 *
	 * @param string $phone Raw phone string.
	 * @return string Cleaned phone number.
	 */
	private static function clean_phone( string $phone ): string {
		// Remove non-numeric characters except + for country code.
		$cleaned = preg_replace( '/[^\d+]/', '', $phone );

		// Format as (XXX) XXX-XXXX if 10 digits.
		if ( preg_match( '/^\+?1?(\d{3})(\d{3})(\d{4})$/', $cleaned, $parts ) ) {
			return sprintf( '(%s) %s-%s', $parts[1], $parts[2], $parts[3] );
		}

		return $cleaned;
	}

	/**
	 * Validate phone number format.
	 *
	 * @param string $phone Phone number to validate.
	 * @return bool True if valid phone format.
	 */
	private static function is_valid_phone( string $phone ): bool {
		// Must have at least 10 digits.
		$digits = preg_replace( '/\D/', '', $phone );
		return strlen( $digits ) >= 10 && strlen( $digits ) <= 15;
	}
}

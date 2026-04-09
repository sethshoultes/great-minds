<?php
/**
 * LocalGenius FAQ Templates
 *
 * Loads pre-written FAQ templates for each business type.
 * These templates serve as ground truth for the LLM to prevent hallucination.
 *
 * @package LocalGenius
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class LocalGenius_FAQ_Templates
 *
 * Handles loading and managing FAQ templates by business type.
 */
class LocalGenius_FAQ_Templates {

	/**
	 * Supported business types mapped to display names.
	 *
	 * @var array
	 */
	public const BUSINESS_TYPES = [
		'dentist'    => 'Dental Practice',
		'plumber'    => 'Plumbing / HVAC',
		'restaurant' => 'Restaurant / Cafe',
		'salon'      => 'Salon / Spa',
		'mechanic'   => 'Auto Repair',
		'lawyer'     => 'Legal Services',
		'realtor'    => 'Real Estate',
		'fitness'    => 'Fitness / Gym',
		'retail'     => 'Retail Store',
		'general'    => 'General Business',
	];

	/**
	 * Get FAQ template content for a business type.
	 *
	 * @param string $business_type The business type slug.
	 * @return array FAQ data array with questions and answers.
	 */
	public static function get( string $business_type ): array {
		// Validate business type.
		if ( ! isset( self::BUSINESS_TYPES[ $business_type ] ) ) {
			$business_type = 'general';
		}

		// Load template file.
		$template_file = LOCALGENIUS_PLUGIN_DIR . 'templates/faq/' . $business_type . '.json';

		if ( ! file_exists( $template_file ) ) {
			$template_file = LOCALGENIUS_PLUGIN_DIR . 'templates/faq/general.json';
		}

		$content = file_get_contents( $template_file );
		$data    = json_decode( $content, true );

		if ( json_last_error() !== JSON_ERROR_NONE || ! is_array( $data ) ) {
			return self::get_fallback_faq();
		}

		return $data;
	}

	/**
	 * Get all supported business types.
	 *
	 * @return array Associative array of slug => display name.
	 */
	public static function get_business_types(): array {
		return self::BUSINESS_TYPES;
	}

	/**
	 * Format FAQ data as context string for LLM prompt.
	 *
	 * @param string $business_type The business type slug.
	 * @return string Formatted FAQ context.
	 */
	public static function get_faq_context( string $business_type ): string {
		$faq  = self::get( $business_type );
		$context = "Common questions and answers for this type of business:\n\n";

		if ( isset( $faq['faqs'] ) && is_array( $faq['faqs'] ) ) {
			foreach ( $faq['faqs'] as $item ) {
				$context .= "Q: " . $item['question'] . "\n";
				$context .= "A: " . $item['answer'] . "\n\n";
			}
		}

		return $context;
	}

	/**
	 * Fallback FAQ data if template loading fails.
	 *
	 * @return array Basic FAQ structure.
	 */
	private static function get_fallback_faq(): array {
		return [
			'business_type' => 'general',
			'faqs'          => [
				[
					'question' => 'What are your hours of operation?',
					'answer'   => 'Please contact us directly for our current hours of operation.',
				],
				[
					'question' => 'How can I contact you?',
					'answer'   => 'You can reach us through our contact form or by phone. We look forward to hearing from you.',
				],
				[
					'question' => 'Where are you located?',
					'answer'   => 'Please visit our Contact page for our full address and directions.',
				],
			],
		];
	}
}

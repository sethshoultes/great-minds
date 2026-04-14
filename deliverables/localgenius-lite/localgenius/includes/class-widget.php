<?php
/**
 * LocalGenius Widget Registration
 *
 * Handles widget initialization and frontend output.
 *
 * @package LocalGenius
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class LocalGenius_Widget
 *
 * Widget registration and helper methods.
 */
class LocalGenius_Widget {

	/**
	 * Check if widget should be displayed.
	 *
	 * @return bool True if widget should display.
	 */
	public static function should_display(): bool {
		// Must have business type configured.
		$business_type = get_option( 'localgenius_business_type', '' );
		if ( empty( $business_type ) ) {
			return false;
		}

		// Don't display in admin.
		if ( is_admin() ) {
			return false;
		}

		// Don't display on login/register pages.
		if ( isset( $GLOBALS['pagenow'] ) && in_array( $GLOBALS['pagenow'], [ 'wp-login.php', 'wp-register.php' ], true ) ) {
			return false;
		}

		/**
		 * Filter whether to display the LocalGenius widget.
		 *
		 * @param bool $display Whether to display the widget.
		 */
		return apply_filters( 'localgenius_display_widget', true );
	}

	/**
	 * Get widget display name (uses business name or default).
	 *
	 * @return string Widget display name.
	 */
	public static function get_display_name(): string {
		$homepage_data = get_option( 'localgenius_homepage_data', [] );

		if ( ! empty( $homepage_data['business_name'] ) ) {
			return $homepage_data['business_name'];
		}

		return get_bloginfo( 'name' );
	}
}

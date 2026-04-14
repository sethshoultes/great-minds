<?php
/**
 * LocalGenius Uninstall Handler
 *
 * Removes all plugin data when the plugin is deleted (not just deactivated).
 *
 * @package LocalGenius
 */

// Exit if not called by WordPress uninstaller.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Remove all plugin options.
$options_to_delete = [
	'localgenius_business_type',
	'localgenius_location',
	'localgenius_show_powered_by',
	'localgenius_homepage_data',
	'localgenius_question_count',
	'localgenius_cache_hits',
	'localgenius_last_question',
	'localgenius_activated_at',
	'localgenius_version',
];

foreach ( $options_to_delete as $option ) {
	delete_option( $option );
}

// Clear any transients.
delete_transient( 'localgenius_faq_cache' );

<?php
/**
 * PHPUnit bootstrap for Dash plugin tests.
 *
 * Loads the WordPress test suite and the Dash plugin.
 * Requires WP_TESTS_DIR to point to the wordpress-develop tests directory.
 *
 * @package Dash
 */

// Composer autoloader (if available).
$autoloader = dirname( __DIR__, 2 ) . '/vendor/autoload.php';
if ( file_exists( $autoloader ) ) {
	require_once $autoloader;
}

// Path to WordPress test suite.
$wp_tests_dir = getenv( 'WP_TESTS_DIR' ) ?: '/tmp/wordpress-tests-lib';

if ( ! file_exists( $wp_tests_dir . '/includes/functions.php' ) ) {
	echo "Could not find {$wp_tests_dir}/includes/functions.php\n";
	echo "Set WP_TESTS_DIR to the WordPress test library directory.\n";
	exit( 1 );
}

// Give access to tests_add_filter() function.
require_once $wp_tests_dir . '/includes/functions.php';

/**
 * Manually load the Dash plugin.
 */
tests_add_filter( 'muplugins_loaded', function () {
	require dirname( __DIR__, 2 ) . '/dash.php';
} );

// Start up the WP testing environment.
require $wp_tests_dir . '/includes/bootstrap.php';

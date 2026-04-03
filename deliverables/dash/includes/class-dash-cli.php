<?php
/**
 * WP-CLI commands for Dash.
 *
 * Provides `wp dash reindex` and `wp dash status` for index
 * management from the command line — essential for CI/CD and
 * post-deployment index warm-up.
 *
 * @package Dash
 */

defined( 'ABSPATH' ) || exit;

/**
 * Manage the Dash command palette search index.
 */
class Dash_CLI {

	/**
	 * Rebuild the Dash search index.
	 *
	 * Truncates and repopulates the wp_dash_index table from all
	 * posts, settings pages, admin menu pages, and quick actions.
	 *
	 * ## OPTIONS
	 *
	 * [--no-truncate]
	 * : Merge new items into the existing index without truncating first.
	 *   Faster for incremental updates. Default is full truncate + rebuild.
	 *
	 * ## EXAMPLES
	 *
	 *     wp dash reindex
	 *     wp dash reindex --no-truncate
	 *
	 * @param array $args       Positional arguments.
	 * @param array $assoc_args Associative arguments.
	 */
	public function reindex( array $args, array $assoc_args ): void {
		$truncate = ! \WP_CLI\Utils\get_flag_value( $assoc_args, 'no-truncate', false );

		if ( $truncate ) {
			\WP_CLI::log( 'Truncating existing index...' );
		} else {
			\WP_CLI::log( 'Merging into existing index (--no-truncate)...' );
		}

		\WP_CLI::log( 'Rebuilding Dash search index...' );

		$start   = microtime( true );
		$count   = Dash_Index::get_instance()->rebuild( $truncate );
		$elapsed = round( microtime( true ) - $start, 2 );

		\WP_CLI::success(
			sprintf(
				'Index rebuilt: %d items indexed in %ss.',
				$count,
				$elapsed
			)
		);
	}

	/**
	 * Show the current status of the Dash search index.
	 *
	 * Displays total items, breakdown by type, last rebuild time,
	 * freshness status, and whether the site is above the client-side
	 * search threshold (5K items defaults to server-side AJAX fallback).
	 *
	 * ## EXAMPLES
	 *
	 *     wp dash status
	 *
	 * @param array $args       Positional arguments.
	 * @param array $assoc_args Associative arguments.
	 */
	public function status( array $args, array $assoc_args ): void {
		$index    = Dash_Index::get_instance();
		$total    = $index->get_count();
		$by_type  = $index->get_count_by_type();

		$last_build = get_option( 'dash_last_index_build' );
		$is_stale   = empty( $last_build ) || ( strtotime( $last_build ) < ( time() - HOUR_IN_SECONDS ) );

		\WP_CLI::log( '' );
		\WP_CLI::log( \WP_CLI::colorize( '%B=== Dash Index Status ===%n' ) );
		\WP_CLI::log( '' );
		\WP_CLI::log( sprintf( 'Total indexed items: %d', $total ) );
		\WP_CLI::log( '' );

		if ( ! empty( $by_type ) ) {
			\WP_CLI::log( 'Breakdown by type:' );
			foreach ( $by_type as $type => $count ) {
				\WP_CLI::log( sprintf( '  %-20s %d', $type, $count ) );
			}
			\WP_CLI::log( '' );
		}

		\WP_CLI::log( sprintf( 'Last rebuild: %s', $last_build ?: 'Never' ) );

		if ( $is_stale ) {
			\WP_CLI::warning( 'Index is STALE (>1 hour old). Run `wp dash reindex` to refresh.' );
		} else {
			\WP_CLI::log( \WP_CLI::colorize( 'Freshness:   %GFRESH%n' ) );
		}

		$threshold = defined( 'DASH_CLIENT_INDEX_THRESHOLD' ) ? DASH_CLIENT_INDEX_THRESHOLD : 5000;

		if ( $total >= $threshold ) {
			\WP_CLI::log(
				\WP_CLI::colorize(
					sprintf(
						'Search mode: %YABOVE %d item threshold%n — AJAX fallback active (server-side search)',
						$threshold
					)
				)
			);
		} else {
			\WP_CLI::log(
				\WP_CLI::colorize(
					sprintf(
						'Search mode: %GBELOW %d item threshold%n — client-side search active (<50ms)',
						$threshold
					)
				)
			);
		}

		\WP_CLI::log( '' );
	}
}

\WP_CLI::add_command( 'dash', 'Dash_CLI' );

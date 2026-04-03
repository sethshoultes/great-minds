<?php
/**
 * WP-CLI commands for Dash.
 *
 * Provides `wp dash reindex` and `wp dash status` commands
 * for index management from the command line.
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
	 * Flattens posts, pages, CPTs, settings, and actions into
	 * the search index table for fast client-side and server-side search.
	 *
	 * ## OPTIONS
	 *
	 * [--force]
	 * : Clear the entire index before rebuilding.
	 *
	 * ## EXAMPLES
	 *
	 *     wp dash reindex
	 *     wp dash reindex --force
	 *
	 * @param array $args       Positional arguments.
	 * @param array $assoc_args Associative arguments.
	 */
	public function reindex( array $args, array $assoc_args ): void {
		$force = \WP_CLI\Utils\get_flag_value( $assoc_args, 'force', false );

		if ( $force ) {
			\WP_CLI::log( 'Clearing existing index...' );
		}

		\WP_CLI::log( 'Rebuilding Dash search index...' );

		$start = microtime( true );
		$count = Dash_Index::get_instance()->rebuild( (bool) $force );
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
	 * search threshold (5K items).
	 *
	 * ## EXAMPLES
	 *
	 *     wp dash status
	 *
	 * @param array $args       Positional arguments.
	 * @param array $assoc_args Associative arguments.
	 */
	public function status( array $args, array $assoc_args ): void {
		$index = Dash_Index::get_instance();
		$total = $index->get_count();
		$by_type = $index->get_count_by_type();

		$last_build = get_option( 'dash_last_index_build' );
		$is_stale = empty( $last_build ) || ( strtotime( $last_build ) < ( time() - HOUR_IN_SECONDS ) );

		\WP_CLI::log( '' );
		\WP_CLI::log( \WP_CLI::colorize( '%B=== Dash Index Status ===%n' ) );
		\WP_CLI::log( '' );

		// Total items.
		\WP_CLI::log( sprintf( 'Total indexed items: %d', $total ) );
		\WP_CLI::log( '' );

		// Breakdown by type.
		if ( ! empty( $by_type ) ) {
			\WP_CLI::log( 'Breakdown by type:' );
			foreach ( $by_type as $type => $count ) {
				\WP_CLI::log( sprintf( '  %-15s %d', $type, $count ) );
			}
			\WP_CLI::log( '' );
		}

		// Last rebuild.
		if ( $last_build ) {
			\WP_CLI::log( sprintf( 'Last rebuild: %s', $last_build ) );
		} else {
			\WP_CLI::log( 'Last rebuild: Never' );
		}

		// Freshness.
		if ( $is_stale ) {
			\WP_CLI::warning( 'Index is STALE (>1 hour). Run `wp dash reindex` to refresh.' );
		} else {
			\WP_CLI::log( \WP_CLI::colorize( 'Freshness: %GFRESH%n' ) );
		}

		// Threshold.
		$threshold = DASH_CLIENT_INDEX_THRESHOLD;
		if ( $total >= $threshold ) {
			\WP_CLI::log(
				\WP_CLI::colorize(
					sprintf( 'Client-side threshold: %YABOVE %dK limit%n — server fallback active', $threshold / 1000 )
				)
			);
		} else {
			\WP_CLI::log(
				\WP_CLI::colorize(
					sprintf( 'Client-side threshold: %GBELOW %dK limit%n — client-side search active', $threshold / 1000 )
				)
			);
		}

		\WP_CLI::log( '' );
	}
}

\WP_CLI::add_command( 'dash', 'Dash_CLI' );

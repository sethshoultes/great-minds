<?php
/**
 * AJAX search handler for Dash.
 *
 * Server-side fallback for large sites (>5K items) or when
 * the client-side index is stale. Uses FULLTEXT NATURAL LANGUAGE MODE
 * for queries of 3+ chars, and indexed LIKE prefix for shorter queries.
 *
 * SQL injection fix: type filters are parameterized inline — never
 * via string concatenation of a separately-prepared fragment.
 *
 * @package Dash
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class Dash_Search
 *
 * Handles AJAX search requests, user search, and recent items tracking.
 */
class Dash_Search {

	/**
	 * Singleton instance.
	 *
	 * @var self|null
	 */
	private static ?self $instance = null;

	/**
	 * Maximum results per search.
	 *
	 * @var int
	 */
	private const MAX_RESULTS = 20;

	/**
	 * Maximum recent items to store per user.
	 *
	 * @var int
	 */
	private const MAX_RECENT = 10;

	/**
	 * Get singleton instance.
	 *
	 * @return self
	 */
	public static function get_instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Register AJAX hooks.
	 *
	 * All actions use wp_ajax_ (logged-in only). No wp_ajax_nopriv_.
	 * Dash is an admin tool — unauthenticated access is never valid.
	 */
	public function register_hooks(): void {
		add_action( 'wp_ajax_dash_search',        array( $this, 'ajax_search' ) );
		add_action( 'wp_ajax_dash_recent',        array( $this, 'ajax_get_recent' ) );
		add_action( 'wp_ajax_dash_track_recent',  array( $this, 'ajax_track_recent' ) );
		add_action( 'wp_ajax_dash_user_search',   array( $this, 'ajax_user_search' ) );
	}

	/**
	 * AJAX: Server-side search.
	 *
	 * Returns up to MAX_RESULTS items matching the query, filtered by
	 * the current user's capabilities.
	 *
	 * Modes:
	 *   - Default: search posts, settings, and actions.
	 *   - type param: restrict to a specific item_type.
	 */
	public function ajax_search(): void {
		check_ajax_referer( 'dash_search', '_wpnonce' );

		// Belt-and-suspenders: nonce already implies logged-in, but be explicit.
		if ( ! is_user_logged_in() ) {
			wp_send_json_error( 'Unauthorized', 401 );
		}

		$query = isset( $_GET['q'] ) ? sanitize_text_field( wp_unslash( $_GET['q'] ) ) : '';
		$type  = isset( $_GET['type'] ) ? sanitize_key( $_GET['type'] ) : '';

		if ( '' === $query ) {
			wp_send_json_success( array() );
		}

		$results = $this->search( $query, $type, wp_get_current_user() );

		/**
		 * Filter server-side search results before sending to client.
		 *
		 * Add custom search results from your plugin's data sources.
		 * Each result must include: type, title, url, icon.
		 * Optional: id, status, relevance, meta.
		 *
		 * @param array  $results The search results.
		 * @param string $query   The raw search query.
		 */
		$results = apply_filters( 'dash_search_results', $results, $query );

		wp_send_json_success( $results );
	}

	/**
	 * Perform a search against the index table.
	 *
	 * SQL strategy:
	 *
	 *   Queries >= 3 chars: FULLTEXT MATCH...AGAINST in NATURAL LANGUAGE MODE.
	 *   This uses the FULLTEXT index efficiently — no wildcards, no full scans.
	 *   Results are ranked by MySQL relevance score.
	 *
	 *   Queries < 3 chars: LIKE prefix on title using the title_prefix(20) index.
	 *   Short queries don't benefit from FULLTEXT; prefix match is fast and
	 *   gives expected results for "w" → "WordPress", "po" → "Posts", etc.
	 *
	 * SECURITY FIX: The $type filter is parameterized inline in each query branch.
	 * The original code built $type_clause as a separately-prepared string and
	 * concatenated it into a second prepare() call — creating a SQL injection
	 * vector because the outer prepare() treated the pre-prepared fragment as a
	 * literal string, not as SQL. This version uses a single prepare() per branch
	 * with $type as a direct %s placeholder.
	 *
	 * @param string  $query The search string.
	 * @param string  $type  Optional type filter (matches item_type column).
	 * @param WP_User $user  The user performing the search.
	 * @return array Search results, capability-filtered.
	 */
	public function search( string $query, string $type, WP_User $user ): array {
		global $wpdb;

		$table = Dash_Index::get_instance()->get_table_name();
		$rows  = array();

		if ( mb_strlen( $query ) >= 3 ) {
			// FULLTEXT NATURAL LANGUAGE MODE — uses the search_idx index.
			// No wildcards means no full-table scan. Fast at any scale.
			if ( ! empty( $type ) ) {
				// phpcs:ignore WordPress.DB.DirectDatabaseQuery
				$rows = $wpdb->get_results(
					$wpdb->prepare(
						"SELECT item_type, item_id, title, url, icon, capability, keywords, item_status,
							MATCH(title, keywords) AGAINST(%s IN NATURAL LANGUAGE MODE) AS relevance
						 FROM {$table}
						 WHERE MATCH(title, keywords) AGAINST(%s IN NATURAL LANGUAGE MODE)
						   AND item_type = %s
						 ORDER BY relevance DESC
						 LIMIT %d",
						$query,
						$query,
						$type,
						self::MAX_RESULTS
					),
					ARRAY_A
				);
			} else {
				// phpcs:ignore WordPress.DB.DirectDatabaseQuery
				$rows = $wpdb->get_results(
					$wpdb->prepare(
						"SELECT item_type, item_id, title, url, icon, capability, keywords, item_status,
							MATCH(title, keywords) AGAINST(%s IN NATURAL LANGUAGE MODE) AS relevance
						 FROM {$table}
						 WHERE MATCH(title, keywords) AGAINST(%s IN NATURAL LANGUAGE MODE)
						 ORDER BY relevance DESC
						 LIMIT %d",
						$query,
						$query,
						self::MAX_RESULTS
					),
					ARRAY_A
				);
			}
		} else {
			// Short query: prefix match on title using title_prefix(20) index.
			$like = $wpdb->esc_like( $query ) . '%';

			if ( ! empty( $type ) ) {
				// phpcs:ignore WordPress.DB.DirectDatabaseQuery
				$rows = $wpdb->get_results(
					$wpdb->prepare(
						"SELECT item_type, item_id, title, url, icon, capability, keywords, item_status, 1.0 AS relevance
						 FROM {$table}
						 WHERE title LIKE %s
						   AND item_type = %s
						 ORDER BY title ASC
						 LIMIT %d",
						$like,
						$type,
						self::MAX_RESULTS
					),
					ARRAY_A
				);
			} else {
				// phpcs:ignore WordPress.DB.DirectDatabaseQuery
				$rows = $wpdb->get_results(
					$wpdb->prepare(
						"SELECT item_type, item_id, title, url, icon, capability, keywords, item_status, 1.0 AS relevance
						 FROM {$table}
						 WHERE title LIKE %s
						 ORDER BY title ASC
						 LIMIT %d",
						$like,
						self::MAX_RESULTS
					),
					ARRAY_A
				);
			}
		}

		if ( ! is_array( $rows ) ) {
			return array();
		}

		// Capability-filter results — only return what this user can access.
		$results = array();
		foreach ( $rows as $row ) {
			if ( ! empty( $row['capability'] ) && ! user_can( $user, $row['capability'] ) ) {
				continue;
			}

			$results[] = array(
				'type'      => $row['item_type'],
				'id'        => (int) $row['item_id'],
				'title'     => $row['title'],
				'url'       => $row['url'],
				'icon'      => $row['icon'],
				'relevance' => (float) $row['relevance'],
			);
		}

		return $results;
	}

	/**
	 * AJAX: User search (@ prefix mode).
	 *
	 * Uses WP_User_Query with wildcard search across login, email,
	 * and display name. Requires list_users capability.
	 */
	public function ajax_user_search(): void {
		check_ajax_referer( 'dash_search', '_wpnonce' );

		if ( ! current_user_can( 'list_users' ) ) {
			wp_send_json_error( 'Insufficient permissions', 403 );
		}

		$query = isset( $_GET['q'] ) ? sanitize_text_field( wp_unslash( $_GET['q'] ) ) : '';

		if ( '' === $query ) {
			wp_send_json_success( array() );
		}

		$user_query = new WP_User_Query( array(
			'search'         => '*' . $query . '*',
			'search_columns' => array( 'user_login', 'user_email', 'display_name' ),
			'number'         => self::MAX_RESULTS,
			'orderby'        => 'display_name',
			'order'          => 'ASC',
		) );

		$results = array();
		foreach ( $user_query->get_results() as $found_user ) {
			$results[] = array(
				'type'  => 'user',
				'id'    => $found_user->ID,
				'title' => $found_user->display_name,
				'url'   => get_edit_user_link( $found_user->ID ),
				'icon'  => 'dashicons-admin-users',
				'meta'  => $found_user->user_email,
				'role'  => implode( ', ', $found_user->roles ),
			);
		}

		wp_send_json_success( $results );
	}

	/**
	 * AJAX: Get recent items for the current user.
	 */
	public function ajax_get_recent(): void {
		check_ajax_referer( 'dash_search', '_wpnonce' );

		$recent = $this->get_recent_items( get_current_user_id() );
		wp_send_json_success( $recent );
	}

	/**
	 * AJAX: Track an item selection for recent items.
	 *
	 * Called by the JS when the user selects a result. Stores the
	 * last MAX_RECENT items in user meta, deduplicated by URL.
	 */
	public function ajax_track_recent(): void {
		check_ajax_referer( 'dash_search', '_wpnonce' );

		$item = array(
			'type'  => isset( $_POST['type'] )  ? sanitize_key( $_POST['type'] )                      : '',
			'id'    => isset( $_POST['id'] )     ? absint( $_POST['id'] )                              : 0,
			'title' => isset( $_POST['title'] )  ? sanitize_text_field( wp_unslash( $_POST['title'] ) ) : '',
			'url'   => isset( $_POST['url'] )    ? esc_url_raw( wp_unslash( $_POST['url'] ) )          : '',
			'icon'  => isset( $_POST['icon'] )   ? sanitize_text_field( wp_unslash( $_POST['icon'] ) ) : '',
			'time'  => time(),
		);

		if ( empty( $item['url'] ) ) {
			wp_send_json_error( 'Missing URL' );
		}

		$this->add_recent_item( get_current_user_id(), $item );
		wp_send_json_success();
	}

	/**
	 * Get recent items for a user.
	 *
	 * @param int $user_id The user ID.
	 * @return array Recent items, newest first.
	 */
	public function get_recent_items( int $user_id ): array {
		$recent = get_user_meta( $user_id, 'dash_recent_items', true );
		return is_array( $recent ) ? $recent : array();
	}

	/**
	 * Add an item to a user's recent list.
	 *
	 * Deduplicates by URL. Caps at MAX_RECENT items.
	 *
	 * @param int   $user_id The user ID.
	 * @param array $item    The item to add.
	 */
	private function add_recent_item( int $user_id, array $item ): void {
		$recent = $this->get_recent_items( $user_id );

		// Remove duplicate by URL, then prepend.
		$recent = array_values(
			array_filter( $recent, fn( $existing ) => $existing['url'] !== $item['url'] )
		);

		array_unshift( $recent, $item );

		// Cap at MAX_RECENT.
		$recent = array_slice( $recent, 0, self::MAX_RECENT );

		update_user_meta( $user_id, 'dash_recent_items', $recent );
	}
}

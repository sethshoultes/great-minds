<?php
/**
 * AJAX search handler for Dash.
 *
 * Server-side fallback for large sites (>5K items) or when
 * the client-side index is stale. Uses FULLTEXT search on the
 * wp_dash_index table for fast prefix + keyword matching.
 *
 * @package Dash
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class Dash_Search
 *
 * Handles AJAX search requests and recent items tracking.
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
	 */
	public function register_hooks(): void {
		add_action( 'wp_ajax_dash_search', array( $this, 'ajax_search' ) );
		add_action( 'wp_ajax_dash_recent', array( $this, 'ajax_get_recent' ) );
		add_action( 'wp_ajax_dash_track_recent', array( $this, 'ajax_track_recent' ) );
		add_action( 'wp_ajax_dash_user_search', array( $this, 'ajax_user_search' ) );
	}

	/**
	 * AJAX: Server-side search.
	 *
	 * Searches the wp_dash_index table using FULLTEXT matching
	 * with a fallback to LIKE for short queries.
	 */
	public function ajax_search(): void {
		check_ajax_referer( 'dash_search', 'nonce' );

		$query = isset( $_POST['q'] ) ? sanitize_text_field( wp_unslash( $_POST['q'] ) ) : '';
		$type  = isset( $_POST['type'] ) ? sanitize_key( $_POST['type'] ) : '';

		if ( empty( $query ) ) {
			wp_send_json_success( array() );
		}

		$results = $this->search( $query, $type, wp_get_current_user() );

		/**
		 * Filter search results before sending to client.
		 *
		 * @param array  $results The search results.
		 * @param string $query   The search query.
		 */
		$results = apply_filters( 'dash_search_results', $results, $query );

		wp_send_json_success( $results );
	}

	/**
	 * Perform a search against the index table.
	 *
	 * Strategy:
	 * - Queries >= 3 chars: FULLTEXT MATCH with relevance scoring
	 * - Queries < 3 chars: LIKE prefix match on title
	 * Both are capability-filtered after query.
	 *
	 * @param string  $query The search string.
	 * @param string  $type  Optional type filter.
	 * @param WP_User $user  The current user.
	 * @return array Search results.
	 */
	public function search( string $query, string $type, WP_User $user ): array {
		global $wpdb;

		$table = Dash_Index::get_instance()->get_table_name();

		$type_clause = '';
		if ( ! empty( $type ) ) {
			$type_clause = $wpdb->prepare( ' AND item_type = %s', $type );
		}

		if ( mb_strlen( $query ) >= 3 ) {
			// FULLTEXT search with relevance scoring.
			$search_term = '+' . $wpdb->esc_like( $query ) . '*';

			// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL
			$rows = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT item_type, item_id, title, url, icon, capability, keywords, item_status,
						MATCH(title, keywords) AGAINST(%s IN BOOLEAN MODE) AS relevance
					 FROM {$table}
					 WHERE MATCH(title, keywords) AGAINST(%s IN BOOLEAN MODE)
						{$type_clause}
					 ORDER BY relevance DESC
					 LIMIT %d",
					$search_term,
					$search_term,
					self::MAX_RESULTS
				),
				ARRAY_A
			);
		} else {
			// Short query: prefix match on title.
			$like = $wpdb->esc_like( $query ) . '%';

			// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL
			$rows = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT item_type, item_id, title, url, icon, capability, keywords, item_status, 1 AS relevance
					 FROM {$table}
					 WHERE title LIKE %s
						{$type_clause}
					 ORDER BY title ASC
					 LIMIT %d",
					$like,
					self::MAX_RESULTS
				),
				ARRAY_A
			);
		}

		if ( ! is_array( $rows ) ) {
			return array();
		}

		// Capability-filter results.
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
				'status'    => $row['item_status'],
				'relevance' => (float) $row['relevance'],
			);
		}

		return $results;
	}

	/**
	 * AJAX: User search (@ prefix mode).
	 *
	 * Uses WP_User_Query with capability awareness.
	 */
	public function ajax_user_search(): void {
		check_ajax_referer( 'dash_search', 'nonce' );

		if ( ! current_user_can( 'list_users' ) ) {
			wp_send_json_error( 'Insufficient permissions', 403 );
		}

		$query = isset( $_POST['q'] ) ? sanitize_text_field( wp_unslash( $_POST['q'] ) ) : '';

		if ( empty( $query ) ) {
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
		foreach ( $user_query->get_results() as $user ) {
			$results[] = array(
				'type'  => 'user',
				'id'    => $user->ID,
				'title' => $user->display_name,
				'url'   => get_edit_user_link( $user->ID ),
				'icon'  => 'dashicons-admin-users',
				'meta'  => $user->user_email,
				'role'  => implode( ', ', $user->roles ),
			);
		}

		wp_send_json_success( $results );
	}

	/**
	 * AJAX: Get recent items for the current user.
	 */
	public function ajax_get_recent(): void {
		check_ajax_referer( 'dash_search', 'nonce' );

		$recent = $this->get_recent_items( get_current_user_id() );
		wp_send_json_success( $recent );
	}

	/**
	 * AJAX: Track an item selection for recent items.
	 */
	public function ajax_track_recent(): void {
		check_ajax_referer( 'dash_search', 'nonce' );

		$item = array(
			'type'  => isset( $_POST['type'] ) ? sanitize_key( $_POST['type'] ) : '',
			'id'    => isset( $_POST['id'] ) ? absint( $_POST['id'] ) : 0,
			'title' => isset( $_POST['title'] ) ? sanitize_text_field( wp_unslash( $_POST['title'] ) ) : '',
			'url'   => isset( $_POST['url'] ) ? esc_url_raw( wp_unslash( $_POST['url'] ) ) : '',
			'icon'  => isset( $_POST['icon'] ) ? sanitize_text_field( wp_unslash( $_POST['icon'] ) ) : '',
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
	 * Deduplicates by URL and caps at MAX_RECENT items.
	 *
	 * @param int   $user_id The user ID.
	 * @param array $item    The item to add.
	 */
	private function add_recent_item( int $user_id, array $item ): void {
		$recent = $this->get_recent_items( $user_id );

		// Remove duplicate by URL.
		$recent = array_filter( $recent, function ( $existing ) use ( $item ) {
			return $existing['url'] !== $item['url'];
		} );

		// Prepend new item.
		array_unshift( $recent, $item );

		// Cap at max.
		$recent = array_slice( $recent, 0, self::MAX_RECENT );

		update_user_meta( $user_id, 'dash_recent_items', $recent );
	}
}

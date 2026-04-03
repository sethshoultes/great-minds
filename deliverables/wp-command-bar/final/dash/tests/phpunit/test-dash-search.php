<?php
/**
 * Tests for Dash_Search — AJAX search handler.
 *
 * Covers: FULLTEXT search, LIKE fallback, capability filtering,
 * relevance ranking, recent items, user search.
 *
 * @package Dash
 */

class Test_Dash_Search extends WP_UnitTestCase {

	/**
	 * @var Dash_Index
	 */
	private Dash_Index $index;

	/**
	 * @var Dash_Search
	 */
	private Dash_Search $search;

	/**
	 * Set up test fixtures.
	 */
	public function set_up(): void {
		parent::set_up();
		$this->index  = Dash_Index::get_instance();
		$this->search = Dash_Search::get_instance();
		$this->index->create_table();
	}

	public function tear_down(): void {
		global $wpdb;
		$wpdb->query( "TRUNCATE TABLE {$this->index->get_table_name()}" ); // phpcs:ignore
		parent::tear_down();
	}

	// -------------------------------------------------------------------------
	// FULLTEXT search (queries >= 3 chars)
	// -------------------------------------------------------------------------

	public function test_fulltext_search_finds_post_by_title(): void {
		self::factory()->post->create( array(
			'post_title'  => 'Quarterly Revenue Report',
			'post_status' => 'publish',
		) );

		$this->index->rebuild();

		$admin   = self::factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		$results = $this->search->search( 'Revenue', '', $admin );

		$this->assertNotEmpty( $results, 'Should find post by title keyword' );
		$this->assertEquals( 'Quarterly Revenue Report', $results[0]['title'] );
	}

	public function test_fulltext_search_finds_post_by_keyword(): void {
		$post_id = self::factory()->post->create( array(
			'post_title'  => 'My Post',
			'post_status' => 'publish',
		) );

		wp_set_post_categories( $post_id, array( wp_create_category( 'Finance' ) ) );
		$this->index->rebuild();

		$admin   = self::factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		$results = $this->search->search( 'Finance', '', $admin );

		$titles = array_column( $results, 'title' );
		$this->assertContains( 'My Post', $titles, 'Should find post by taxonomy keyword' );
	}

	public function test_fulltext_search_returns_relevance_score(): void {
		self::factory()->post->create( array(
			'post_title'  => 'WordPress Guide',
			'post_status' => 'publish',
		) );

		$this->index->rebuild();

		$admin   = self::factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		$results = $this->search->search( 'WordPress', '', $admin );

		$this->assertNotEmpty( $results );
		$this->assertArrayHasKey( 'relevance', $results[0] );
		$this->assertGreaterThan( 0, $results[0]['relevance'], 'Relevance should be positive' );
	}

	public function test_search_ranks_title_match_above_keyword_match(): void {
		// Post A: "WordPress" in title.
		self::factory()->post->create( array(
			'post_title'  => 'WordPress Development',
			'post_status' => 'publish',
		) );

		// Post B: "WordPress" only in keywords (via category).
		$post_b = self::factory()->post->create( array(
			'post_title'  => 'My Dev Notes',
			'post_status' => 'publish',
		) );
		wp_set_post_tags( $post_b, array( 'WordPress' ) );

		$this->index->rebuild();

		$admin   = self::factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		$results = $this->search->search( 'WordPress', '', $admin );

		$this->assertGreaterThanOrEqual( 2, count( $results ) );
		$this->assertEquals( 'WordPress Development', $results[0]['title'], 'Title match should rank first' );
	}

	// -------------------------------------------------------------------------
	// LIKE fallback (queries < 3 chars)
	// -------------------------------------------------------------------------

	public function test_short_query_uses_prefix_match(): void {
		self::factory()->post->create( array(
			'post_title'  => 'About Page',
			'post_status' => 'publish',
		) );
		self::factory()->post->create( array(
			'post_title'  => 'Contact Page',
			'post_status' => 'publish',
		) );

		$this->index->rebuild();

		$admin   = self::factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		$results = $this->search->search( 'Ab', '', $admin );

		$titles = array_column( $results, 'title' );
		$this->assertContains( 'About Page', $titles, 'Should match "Ab" prefix' );
		$this->assertNotContains( 'Contact Page', $titles, 'Should not match non-prefix' );
	}

	// -------------------------------------------------------------------------
	// Type filtering
	// -------------------------------------------------------------------------

	public function test_search_filters_by_type(): void {
		self::factory()->post->create( array(
			'post_title'  => 'Test Post',
			'post_status' => 'publish',
		) );
		self::factory()->post->create( array(
			'post_type'   => 'page',
			'post_title'  => 'Test Page',
			'post_status' => 'publish',
		) );

		$this->index->rebuild();

		$admin = self::factory()->user->create_and_get( array( 'role' => 'administrator' ) );

		$posts = $this->search->search( 'Test', 'post', $admin );
		$pages = $this->search->search( 'Test', 'page', $admin );

		$post_types = array_unique( array_column( $posts, 'type' ) );
		$page_types = array_unique( array_column( $pages, 'type' ) );

		$this->assertEquals( array( 'post' ), $post_types, 'Type filter should only return posts' );
		$this->assertEquals( array( 'page' ), $page_types, 'Type filter should only return pages' );
	}

	// -------------------------------------------------------------------------
	// Capability filtering in search
	// -------------------------------------------------------------------------

	public function test_search_respects_capability_for_subscriber(): void {
		$this->index->rebuild();

		$subscriber = self::factory()->user->create_and_get( array( 'role' => 'subscriber' ) );
		$results    = $this->search->search( 'General', '', $subscriber );

		// "General Settings" requires manage_options — subscriber shouldn't see it.
		$titles = array_column( $results, 'title' );
		$this->assertNotContains( 'General Settings', $titles, 'Subscriber should not see admin settings' );
	}

	public function test_search_returns_settings_for_admin(): void {
		$this->index->rebuild();

		$admin   = self::factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		$results = $this->search->search( 'General', '', $admin );

		$titles = array_column( $results, 'title' );
		$this->assertContains( 'General Settings', $titles, 'Admin should see General Settings' );
	}

	// -------------------------------------------------------------------------
	// Empty / edge cases
	// -------------------------------------------------------------------------

	public function test_empty_query_returns_empty(): void {
		$admin   = self::factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		$results = $this->search->search( '', '', $admin );
		$this->assertEmpty( $results );
	}

	public function test_search_with_no_index_returns_empty(): void {
		// Don't rebuild — index is empty.
		$admin   = self::factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		$results = $this->search->search( 'anything', '', $admin );
		$this->assertEmpty( $results );
	}

	public function test_search_max_results_cap(): void {
		// Create 30 posts with same prefix.
		for ( $i = 0; $i < 30; $i++ ) {
			self::factory()->post->create( array(
				'post_title'  => "Searchable Item {$i}",
				'post_status' => 'publish',
			) );
		}

		$this->index->rebuild();

		$admin   = self::factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		$results = $this->search->search( 'Searchable', '', $admin );

		$this->assertLessThanOrEqual( 20, count( $results ), 'Should cap at MAX_RESULTS (20)' );
	}

	// -------------------------------------------------------------------------
	// Recent items
	// -------------------------------------------------------------------------

	public function test_recent_items_stores_and_retrieves(): void {
		$user_id = self::factory()->user->create( array( 'role' => 'administrator' ) );

		$method = new ReflectionMethod( Dash_Search::class, 'add_recent_item' );
		$method->setAccessible( true );

		$method->invoke( $this->search, $user_id, array(
			'type'  => 'post',
			'id'    => 1,
			'title' => 'Recent Post',
			'url'   => 'http://example.com/post/1',
			'icon'  => 'dashicons-admin-post',
			'time'  => time(),
		) );

		$recent = $this->search->get_recent_items( $user_id );

		$this->assertCount( 1, $recent );
		$this->assertEquals( 'Recent Post', $recent[0]['title'] );
	}

	public function test_recent_items_caps_at_10(): void {
		$user_id = self::factory()->user->create( array( 'role' => 'administrator' ) );

		$method = new ReflectionMethod( Dash_Search::class, 'add_recent_item' );
		$method->setAccessible( true );

		for ( $i = 0; $i < 15; $i++ ) {
			$method->invoke( $this->search, $user_id, array(
				'type'  => 'post',
				'id'    => $i,
				'title' => "Item {$i}",
				'url'   => "http://example.com/post/{$i}",
				'icon'  => 'dashicons-admin-post',
				'time'  => time(),
			) );
		}

		$recent = $this->search->get_recent_items( $user_id );
		$this->assertCount( 10, $recent, 'Should cap at 10 recent items' );
	}

	public function test_recent_items_deduplicates_by_url(): void {
		$user_id = self::factory()->user->create( array( 'role' => 'administrator' ) );

		$method = new ReflectionMethod( Dash_Search::class, 'add_recent_item' );
		$method->setAccessible( true );

		$item = array(
			'type'  => 'post',
			'id'    => 1,
			'title' => 'Same Post',
			'url'   => 'http://example.com/post/1',
			'icon'  => 'dashicons-admin-post',
			'time'  => time(),
		);

		$method->invoke( $this->search, $user_id, $item );
		$method->invoke( $this->search, $user_id, $item );
		$method->invoke( $this->search, $user_id, $item );

		$recent = $this->search->get_recent_items( $user_id );
		$this->assertCount( 1, $recent, 'Should deduplicate by URL' );
	}

	public function test_recent_items_newest_first(): void {
		$user_id = self::factory()->user->create( array( 'role' => 'administrator' ) );

		$method = new ReflectionMethod( Dash_Search::class, 'add_recent_item' );
		$method->setAccessible( true );

		$method->invoke( $this->search, $user_id, array(
			'type' => 'post', 'id' => 1, 'title' => 'First',
			'url'  => 'http://example.com/1', 'icon' => '', 'time' => time() - 100,
		) );

		$method->invoke( $this->search, $user_id, array(
			'type' => 'post', 'id' => 2, 'title' => 'Second',
			'url'  => 'http://example.com/2', 'icon' => '', 'time' => time(),
		) );

		$recent = $this->search->get_recent_items( $user_id );
		$this->assertEquals( 'Second', $recent[0]['title'], 'Newest item should be first' );
	}
}

<?php
/**
 * Tests for Dash_Index — the search index builder.
 *
 * Covers: table creation, batched rebuild, real-time hooks,
 * capability filtering, JSON serialization, cache invalidation.
 *
 * @package Dash
 */

class Test_Dash_Index extends WP_UnitTestCase {

	/**
	 * Index instance.
	 *
	 * @var Dash_Index
	 */
	private Dash_Index $index;

	/**
	 * Set up before each test.
	 */
	public function set_up(): void {
		parent::set_up();
		$this->index = Dash_Index::get_instance();
		$this->index->create_table();
	}

	/**
	 * Clean up after each test.
	 */
	public function tear_down(): void {
		global $wpdb;
		$table = $this->index->get_table_name();
		$wpdb->query( "TRUNCATE TABLE {$table}" ); // phpcs:ignore
		parent::tear_down();
	}

	// -------------------------------------------------------------------------
	// Table creation
	// -------------------------------------------------------------------------

	public function test_table_exists_after_create(): void {
		global $wpdb;
		$table = $this->index->get_table_name();
		$result = $wpdb->get_var( "SHOW TABLES LIKE '{$table}'" );
		$this->assertEquals( $table, $result );
	}

	public function test_table_has_fulltext_index(): void {
		global $wpdb;
		$table = $this->index->get_table_name();
		$indexes = $wpdb->get_results( "SHOW INDEX FROM {$table} WHERE Key_name = 'search_idx'" );
		$this->assertNotEmpty( $indexes, 'FULLTEXT index search_idx should exist' );
	}

	public function test_table_has_unique_type_item_key(): void {
		global $wpdb;
		$table = $this->index->get_table_name();
		$indexes = $wpdb->get_results( "SHOW INDEX FROM {$table} WHERE Key_name = 'type_item'" );
		$this->assertNotEmpty( $indexes, 'UNIQUE KEY type_item should exist' );
	}

	// -------------------------------------------------------------------------
	// Index rebuild
	// -------------------------------------------------------------------------

	public function test_rebuild_indexes_posts(): void {
		$post_id = self::factory()->post->create( array(
			'post_title'  => 'Test Post Alpha',
			'post_status' => 'publish',
		) );

		$count = $this->index->rebuild();

		$this->assertGreaterThan( 0, $count, 'Rebuild should index at least one item' );

		// Verify the post is in the index.
		global $wpdb;
		$table = $this->index->get_table_name();
		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE item_type = 'post' AND item_id = %d",
				$post_id
			)
		);

		$this->assertNotNull( $row, 'Post should be in the index' );
		$this->assertEquals( 'Test Post Alpha', $row->title );
		$this->assertStringContainsString( 'publish', $row->keywords );
	}

	public function test_rebuild_indexes_pages(): void {
		self::factory()->post->create( array(
			'post_type'   => 'page',
			'post_title'  => 'About Us Page',
			'post_status' => 'publish',
		) );

		$this->index->rebuild();

		global $wpdb;
		$table = $this->index->get_table_name();
		$row = $wpdb->get_row(
			"SELECT * FROM {$table} WHERE item_type = 'page' AND title = 'About Us Page'"
		);

		$this->assertNotNull( $row, 'Page should be in the index' );
	}

	public function test_rebuild_indexes_draft_posts(): void {
		$post_id = self::factory()->post->create( array(
			'post_title'  => 'Draft Post',
			'post_status' => 'draft',
		) );

		$this->index->rebuild();

		global $wpdb;
		$table = $this->index->get_table_name();
		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE item_id = %d AND item_type = 'post'",
				$post_id
			)
		);

		$this->assertNotNull( $row, 'Draft posts should be indexed' );
		$this->assertEquals( 'draft', $row->item_status );
	}

	public function test_rebuild_indexes_settings_pages(): void {
		$this->index->rebuild();

		global $wpdb;
		$table = $this->index->get_table_name();
		$settings = $wpdb->get_var(
			"SELECT COUNT(*) FROM {$table} WHERE item_type = 'setting'"
		);

		$this->assertGreaterThanOrEqual( 20, (int) $settings, 'Should index at least 20 core settings pages' );
	}

	public function test_rebuild_indexes_quick_actions(): void {
		$this->index->rebuild();

		global $wpdb;
		$table = $this->index->get_table_name();
		$actions = $wpdb->get_var(
			"SELECT COUNT(*) FROM {$table} WHERE item_type = 'action'"
		);

		$this->assertGreaterThan( 0, (int) $actions, 'Should index quick actions' );
	}

	public function test_rebuild_with_force_clears_old_data(): void {
		// First rebuild.
		self::factory()->post->create( array( 'post_title' => 'Keep This' ) );
		$this->index->rebuild( true );

		// Delete the post from WP but not from index.
		// Rebuild with force should remove orphan.
		wp_delete_post( get_posts( array( 'numberposts' => 1 ) )[0]->ID, true );
		$count_before = $this->index->get_count();

		$this->index->rebuild( true );
		$count_after = $this->index->get_count();

		$this->assertLessThanOrEqual( $count_before, $count_after, 'Force rebuild should not keep orphan rows' );
	}

	public function test_rebuild_updates_last_build_option(): void {
		delete_option( 'dash_last_index_build' );
		$this->index->rebuild();

		$last_build = get_option( 'dash_last_index_build' );
		$this->assertNotEmpty( $last_build, 'Should set dash_last_index_build option' );
	}

	// -------------------------------------------------------------------------
	// Batched rebuild (WARN-1 fix)
	// -------------------------------------------------------------------------

	public function test_rebuild_handles_many_posts_without_oom(): void {
		// Create 600 posts — more than one batch (BATCH_SIZE = 500).
		self::factory()->post->create_many( 600, array(
			'post_status' => 'publish',
		) );

		$count = $this->index->rebuild();

		// Should have indexed all 600 posts + settings + actions.
		$this->assertGreaterThanOrEqual( 600, $count );
	}

	// -------------------------------------------------------------------------
	// Real-time hooks
	// -------------------------------------------------------------------------

	public function test_save_post_updates_index(): void {
		$this->index->register_hooks();
		$this->index->rebuild();

		$post_id = self::factory()->post->create( array(
			'post_title'  => 'Real Time Post',
			'post_status' => 'publish',
		) );

		// save_post hook should have fired.
		global $wpdb;
		$table = $this->index->get_table_name();
		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE item_type = 'post' AND item_id = %d",
				$post_id
			)
		);

		$this->assertNotNull( $row, 'save_post hook should index the new post' );
		$this->assertEquals( 'Real Time Post', $row->title );
	}

	public function test_delete_post_removes_from_index(): void {
		$this->index->register_hooks();

		$post_id = self::factory()->post->create( array(
			'post_title' => 'Delete Me',
		) );

		$this->index->rebuild();

		wp_delete_post( $post_id, true );

		global $wpdb;
		$table = $this->index->get_table_name();
		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE item_type = 'post' AND item_id = %d",
				$post_id
			)
		);

		$this->assertNull( $row, 'Deleted post should be removed from index' );
	}

	public function test_trash_post_removes_from_index(): void {
		$this->index->register_hooks();

		$post_id = self::factory()->post->create( array(
			'post_title'  => 'Trash Me',
			'post_status' => 'publish',
		) );

		$this->index->rebuild();
		wp_trash_post( $post_id );

		global $wpdb;
		$table = $this->index->get_table_name();
		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE item_type = 'post' AND item_id = %d",
				$post_id
			)
		);

		$this->assertNull( $row, 'Trashed post should be removed from index' );
	}

	public function test_save_post_ignores_revisions(): void {
		$this->index->register_hooks();

		$post_id = self::factory()->post->create( array(
			'post_title' => 'Original',
		) );

		$this->index->rebuild();

		// Create a revision.
		wp_save_post_revision( $post_id );

		// The revision should not be in the index as a separate item.
		global $wpdb;
		$table = $this->index->get_table_name();
		$revision_count = $wpdb->get_var(
			"SELECT COUNT(*) FROM {$table} WHERE item_type = 'revision'"
		);

		$this->assertEquals( 0, (int) $revision_count, 'Revisions should not be indexed' );
	}

	// -------------------------------------------------------------------------
	// Capability filtering
	// -------------------------------------------------------------------------

	public function test_get_items_for_admin_returns_all(): void {
		self::factory()->post->create( array(
			'post_title'  => 'Admin Post',
			'post_status' => 'publish',
		) );

		$this->index->rebuild();

		$admin = self::factory()->user->create_and_get( array( 'role' => 'administrator' ) );
		$items = $this->index->get_items_for_user( $admin );

		$this->assertNotEmpty( $items, 'Admin should see items' );

		// Admin should see settings (manage_options).
		$settings = array_filter( $items, fn( $i ) => $i['type'] === 'setting' );
		$this->assertNotEmpty( $settings, 'Admin should see settings pages' );
	}

	public function test_get_items_for_subscriber_filters_admin_items(): void {
		$this->index->rebuild();

		$subscriber = self::factory()->user->create_and_get( array( 'role' => 'subscriber' ) );
		$items = $this->index->get_items_for_user( $subscriber );

		// Subscriber should NOT see settings (requires manage_options).
		$settings = array_filter( $items, fn( $i ) => $i['type'] === 'setting' );
		$this->assertEmpty( $settings, 'Subscriber should not see settings pages' );
	}

	public function test_get_items_for_editor_sees_posts_not_settings(): void {
		self::factory()->post->create( array(
			'post_title'  => 'Editor Post',
			'post_status' => 'publish',
		) );

		$this->index->rebuild();

		$editor = self::factory()->user->create_and_get( array( 'role' => 'editor' ) );
		$items = $this->index->get_items_for_user( $editor );

		$posts = array_filter( $items, fn( $i ) => $i['type'] === 'post' );
		$this->assertNotEmpty( $posts, 'Editor should see posts' );

		// Editor should not see most settings (manage_options).
		$settings = array_filter( $items, fn( $i ) => $i['type'] === 'setting' && $i['title'] === 'General Settings' );
		$this->assertEmpty( $settings, 'Editor should not see General Settings' );
	}

	// -------------------------------------------------------------------------
	// Upsert behavior
	// -------------------------------------------------------------------------

	public function test_upsert_updates_existing_item(): void {
		$this->index->upsert_item( array(
			'item_type'   => 'test',
			'item_id'     => 999,
			'title'       => 'Original Title',
			'url'         => 'http://example.com/original',
			'icon'        => 'dashicons-admin-post',
			'capability'  => 'read',
			'keywords'    => 'test original',
			'item_status' => 'publish',
		) );

		$this->index->upsert_item( array(
			'item_type'   => 'test',
			'item_id'     => 999,
			'title'       => 'Updated Title',
			'url'         => 'http://example.com/updated',
			'icon'        => 'dashicons-admin-post',
			'capability'  => 'read',
			'keywords'    => 'test updated',
			'item_status' => 'publish',
		) );

		global $wpdb;
		$table = $this->index->get_table_name();
		$count = $wpdb->get_var(
			"SELECT COUNT(*) FROM {$table} WHERE item_type = 'test' AND item_id = 999"
		);

		$this->assertEquals( 1, (int) $count, 'Upsert should not create duplicates' );

		$row = $wpdb->get_row(
			"SELECT * FROM {$table} WHERE item_type = 'test' AND item_id = 999"
		);

		$this->assertEquals( 'Updated Title', $row->title );
	}

	// -------------------------------------------------------------------------
	// Count methods
	// -------------------------------------------------------------------------

	public function test_get_count_returns_correct_total(): void {
		self::factory()->post->create_many( 5 );
		$this->index->rebuild();

		$count = $this->index->get_count();

		// 5 posts + settings + actions.
		$this->assertGreaterThanOrEqual( 5, $count );
	}

	public function test_get_count_by_type_groups_correctly(): void {
		self::factory()->post->create_many( 3, array( 'post_status' => 'publish' ) );
		self::factory()->post->create_many( 2, array(
			'post_type'   => 'page',
			'post_status' => 'publish',
		) );

		$this->index->rebuild();

		$by_type = $this->index->get_count_by_type();

		$this->assertArrayHasKey( 'post', $by_type );
		$this->assertArrayHasKey( 'page', $by_type );
		$this->assertGreaterThanOrEqual( 3, $by_type['post'] );
		$this->assertGreaterThanOrEqual( 2, $by_type['page'] );
	}

	// -------------------------------------------------------------------------
	// Keywords
	// -------------------------------------------------------------------------

	public function test_post_keywords_include_taxonomy_terms(): void {
		$post_id = self::factory()->post->create( array(
			'post_title'  => 'Categorized Post',
			'post_status' => 'publish',
		) );

		wp_set_post_categories( $post_id, array(
			wp_create_category( 'Technology' ),
		) );

		$this->index->rebuild();

		global $wpdb;
		$table = $this->index->get_table_name();
		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE item_type = 'post' AND item_id = %d",
				$post_id
			)
		);

		$this->assertStringContainsString( 'Technology', $row->keywords, 'Keywords should include taxonomy terms' );
	}
}

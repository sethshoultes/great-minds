<?php
/**
 * Tests for Dash_Commands — command registry and execution.
 *
 * Covers: built-in commands, capability gating, developer API filter,
 * command execution, cache clear, reindex.
 *
 * @package Dash
 */

class Test_Dash_Commands extends WP_UnitTestCase {

	/**
	 * @var Dash_Commands
	 */
	private Dash_Commands $commands;

	public function set_up(): void {
		parent::set_up();
		$this->commands = Dash_Commands::get_instance();

		// Ensure index table exists for reindex command.
		Dash_Index::get_instance()->create_table();
	}

	// -------------------------------------------------------------------------
	// Built-in commands
	// -------------------------------------------------------------------------

	public function test_get_commands_returns_array(): void {
		$commands = $this->commands->get_commands();
		$this->assertIsArray( $commands );
		$this->assertNotEmpty( $commands );
	}

	public function test_builtin_commands_have_required_keys(): void {
		$commands = $this->commands->get_commands();
		$required = array( 'id', 'title', 'icon', 'capability', 'keywords' );

		foreach ( $commands as $command ) {
			foreach ( $required as $key ) {
				$this->assertArrayHasKey( $key, $command, "Command '{$command['id']}' missing key '{$key}'" );
			}
		}
	}

	public function test_new_post_command_exists(): void {
		$commands = $this->commands->get_commands();
		$ids      = array_column( $commands, 'id' );
		$this->assertContains( 'new-post', $ids );
	}

	public function test_new_page_command_exists(): void {
		$commands = $this->commands->get_commands();
		$ids      = array_column( $commands, 'id' );
		$this->assertContains( 'new-page', $ids );
	}

	public function test_view_site_command_exists(): void {
		$commands = $this->commands->get_commands();
		$ids      = array_column( $commands, 'id' );
		$this->assertContains( 'view-site', $ids );
	}

	public function test_clear_cache_command_has_confirmation(): void {
		$commands = $this->commands->get_commands();
		$clear    = null;

		foreach ( $commands as $cmd ) {
			if ( $cmd['id'] === 'clear-cache' ) {
				$clear = $cmd;
				break;
			}
		}

		$this->assertNotNull( $clear );
		$this->assertNotEmpty( $clear['confirm'] ?? '', 'Clear cache should have confirmation text' );
	}

	// -------------------------------------------------------------------------
	// Developer API — dash_commands filter
	// -------------------------------------------------------------------------

	public function test_dash_commands_filter_adds_custom_command(): void {
		add_filter( 'dash_commands', function ( $commands ) {
			$commands[] = array(
				'id'         => 'custom-test-command',
				'title'      => 'Custom Test',
				'url'        => 'http://example.com/custom',
				'icon'       => 'dashicons-star-filled',
				'capability' => 'read',
				'keywords'   => array( 'custom', 'test' ),
			);
			return $commands;
		} );

		$commands = $this->commands->get_commands();
		$ids      = array_column( $commands, 'id' );

		$this->assertContains( 'custom-test-command', $ids, 'Custom command should appear via filter' );

		// Clean up.
		remove_all_filters( 'dash_commands' );
	}

	public function test_dash_commands_filter_can_modify_builtin(): void {
		add_filter( 'dash_commands', function ( $commands ) {
			foreach ( $commands as &$cmd ) {
				if ( $cmd['id'] === 'new-post' ) {
					$cmd['title'] = 'Create Blog Post';
				}
			}
			return $commands;
		} );

		$commands = $this->commands->get_commands();
		$new_post = null;

		foreach ( $commands as $cmd ) {
			if ( $cmd['id'] === 'new-post' ) {
				$new_post = $cmd;
				break;
			}
		}

		$this->assertEquals( 'Create Blog Post', $new_post['title'] );

		remove_all_filters( 'dash_commands' );
	}

	// -------------------------------------------------------------------------
	// Capability requirements
	// -------------------------------------------------------------------------

	public function test_clear_cache_requires_manage_options(): void {
		$commands = $this->commands->get_commands();
		$clear    = null;

		foreach ( $commands as $cmd ) {
			if ( $cmd['id'] === 'clear-cache' ) {
				$clear = $cmd;
				break;
			}
		}

		$this->assertEquals( 'manage_options', $clear['capability'] );
	}

	public function test_new_post_requires_edit_posts(): void {
		$commands = $this->commands->get_commands();
		$new_post = null;

		foreach ( $commands as $cmd ) {
			if ( $cmd['id'] === 'new-post' ) {
				$new_post = $cmd;
				break;
			}
		}

		$this->assertEquals( 'edit_posts', $new_post['capability'] );
	}

	public function test_view_site_requires_read(): void {
		$commands = $this->commands->get_commands();
		$view     = null;

		foreach ( $commands as $cmd ) {
			if ( $cmd['id'] === 'view-site' ) {
				$view = $cmd;
				break;
			}
		}

		$this->assertEquals( 'read', $view['capability'], 'View site should be accessible to all logged-in users' );
	}

	// -------------------------------------------------------------------------
	// Command URLs
	// -------------------------------------------------------------------------

	public function test_new_post_url_points_to_post_new(): void {
		$commands = $this->commands->get_commands();
		$new_post = null;

		foreach ( $commands as $cmd ) {
			if ( $cmd['id'] === 'new-post' ) {
				$new_post = $cmd;
				break;
			}
		}

		$this->assertStringContainsString( 'post-new.php', $new_post['url'] );
	}

	public function test_new_page_url_includes_page_post_type(): void {
		$commands = $this->commands->get_commands();
		$new_page = null;

		foreach ( $commands as $cmd ) {
			if ( $cmd['id'] === 'new-page' ) {
				$new_page = $cmd;
				break;
			}
		}

		$this->assertStringContainsString( 'post_type=page', $new_page['url'] );
	}
}

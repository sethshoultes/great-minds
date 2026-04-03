=== Dash ===
Contributors: sethshoultes
Tags: command palette, keyboard, search, navigation, admin, productivity, keyboard shortcuts
Requires at least: 6.0
Tested up to: 6.7
Stable tag: 1.0.0
Requires PHP: 8.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Press Cmd+K to Dash. A keyboard-first command palette for WordPress admin.

== Description ==

Dash adds a Spotlight-style command palette to your WordPress admin. Press **Cmd+K** (Mac) or **Ctrl+K** (Windows/Linux) to instantly search across posts, pages, settings, users, and quick actions — without lifting your hands from the keyboard.

Built for developers and power users who open wp-admin 20+ times a day and feel the navigation friction. Dash eliminates it.

**Search everything:**

* Posts, pages, and custom post types — searched against a pre-built index for sub-50ms results
* All core settings pages — type "permalink" and go straight there
* Plugin-registered admin pages — WooCommerce, MemberPress, Yoast, and anything that calls add_menu_page()
* Recent items — your last 10 selections, always one keystroke away

**Three interaction modes:**

* **Default** — search posts, settings, and actions by title or keyword
* **Command mode** (type `>`) — quick actions: new post, clear cache, rebuild index, navigate to any core section
* **User search** (type `@`) — find users by name, login, or email. Multi-author sites love this.

**Performance contract:**

| Metric | Target |
|--------|--------|
| Cmd+K → modal visible + input focused | <16ms (1 animation frame) |
| Keystroke → client-side results | <50ms |
| Keystroke → server-side AJAX results | <200ms |
| Index build (1,000 posts) | <2s |
| Index build (10,000 posts) | <10s |
| JS bundle (gzipped) | <15KB |
| CSS bundle (gzipped) | <3KB |

Sites with under 5,000 indexed items use a client-side JSON index loaded once per session. Larger sites fall back to a server-side AJAX search query.

**Accessible by default:**

Full ARIA roles, live region announcements, focus management, and keyboard navigation. Screen reader support is built in, not bolted on.

**For developers — the filter API:**

Register custom commands:

`add_filter( 'dash_commands', function( array $commands ): array {
    $commands[] = array(
        'id'         => 'my-plugin-settings',
        'title'      => 'My Plugin Settings',
        'url'        => admin_url( 'admin.php?page=my-plugin' ),
        'icon'       => 'dashicons-admin-settings',
        'capability' => 'manage_options',
        'keywords'   => array( 'my plugin', 'settings', 'configure' ),
    );
    return $commands;
} );`

Add dynamic search results from your own data source:

`add_filter( 'dash_search_results', function( array $results, string $query ): array {
    // Add your own results — they blend with core results by relevance.
    $results[] = array(
        'type'  => 'my-type',
        'title' => 'My Custom Result',
        'url'   => admin_url( 'admin.php?page=my-plugin&id=1' ),
        'icon'  => 'dashicons-admin-generic',
    );
    return $results;
}, 10, 2 );`

Register custom categories for the type filter:

`add_filter( 'dash_categories', function( array $categories ): array {
    $categories[] = array(
        'id'    => 'my-type',
        'label' => 'My Plugin Items',
        'icon'  => 'dashicons-admin-generic',
    );
    return $categories;
} );`

Hook before the modal renders to enqueue extension scripts:

`add_action( 'dash_before_render', function(): void {
    wp_enqueue_script( 'my-dash-extension', ... );
} );`

Programmatically open/close from JavaScript:

`document.dispatchEvent( new CustomEvent( 'dash:open' ) );
document.dispatchEvent( new CustomEvent( 'dash:close' ) );`

**WP-CLI support:**

`wp dash reindex          # Full index rebuild
wp dash reindex --no-truncate  # Incremental merge
wp dash status           # Index health and item counts`

**Zero dependencies:**

No React, no Vue, no Fuse.js. Vanilla JavaScript. Single stylesheet. Ships as a PHP plugin with no build step required on the server.

== Installation ==

1. Upload the `dash` folder to `/wp-content/plugins/`
2. Activate through the Plugins menu in WordPress
3. Press **Cmd+K** (Mac) or **Ctrl+K** (Windows/Linux) from any admin page

That's it. The search index builds automatically on activation.

**Optional — WP-CLI warm-up for large sites:**

For sites with 10,000+ posts, run the reindex command immediately after activation rather than waiting for the automatic background build:

`wp dash reindex`

== Frequently Asked Questions ==

= Does it work with custom post types? =

Yes. Dash automatically indexes all public post types registered on your site, including those from WooCommerce, MemberPress, Events Calendar, and others. Custom post types show up in search with their own icon.

= How do I register my own commands? =

Use the `dash_commands` filter. See the Description tab for a full example. Commands appear in the command mode (type `>` to activate).

= How do I add my plugin's pages to search? =

Pages registered via `add_menu_page()` or `add_submenu_page()` are automatically indexed once per hour. If you need immediate indexing, hook into `dash_index_rebuild_count` to add items programmatically.

= Does it work on large sites? =

Sites with fewer than 5,000 indexed items use a client-side JSON search index (results in under 50ms). Sites above that threshold use a server-side AJAX search with a FULLTEXT index on InnoDB — tested to perform under 200ms up to 100,000 posts.

= Is it accessible? =

Yes. Dash ships with full ARIA support: the modal has role="dialog" with aria-modal, the results list has role="listbox", each result is role="option", and a live region announces result counts to screen readers. Focus is managed correctly on open and close.

= Will it conflict with the WordPress core command palette? =

WordPress 6.3 introduced its own Cmd+K palette. Dash deregisters it to avoid conflicts. Users get one palette, not two.

= Does it slow down my admin? =

Assets are admin-only (never loaded on the frontend). The JS and CSS are each under 15KB and 3KB gzipped respectively. The index JSON is loaded once per session and cached in browser memory.

= Can I open Dash programmatically? =

Yes. Dispatch a CustomEvent from JavaScript:
`document.dispatchEvent( new CustomEvent( 'dash:open' ) );`

== Screenshots ==

1. Dash command bar open in default search mode, showing post, settings, and action results.
2. Command mode (> prefix) showing quick actions.
3. User search mode (@ prefix) showing user results.
4. Onboarding tooltip on first admin page load.

== Changelog ==

= 1.0.0 =
* Initial release
* Client-side JSON index with server-side AJAX fallback
* Three interaction modes: search, command (>), user search (@)
* Full-text search with InnoDB FULLTEXT index
* Post, page, and custom post type search
* All core settings pages indexed
* Plugin admin pages auto-indexed via admin_menu hook
* Quick actions: new post, new page, upload media, view site, clear cache, rebuild index
* Settings navigation: all core settings pages as navigable commands
* User search via @ prefix using WP_User_Query
* Recent items (last 10, per user)
* Developer API: dash_commands, dash_search_results, dash_categories filters
* Developer API: dash_execute_command filter, dash_before_render action
* Developer API: dash_index_rebuild_count filter for custom index items
* WP-CLI: wp dash reindex, wp dash status
* Full accessibility: ARIA roles, live regions, focus management
* CSS custom properties for admin color scheme / dark mode compatibility
* Replaces WordPress core command palette (WP 6.3+)
* Zero JavaScript dependencies

== Upgrade Notice ==

= 1.0.0 =
Initial release. No upgrade path required.

=== Dash ===
Contributors: sethshoultes
Tags: command palette, keyboard, search, navigation, productivity
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 8.0
Stable tag: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Press Cmd+K to Dash. A keyboard-first command palette for WordPress admin.

== Description ==

Dash adds a Spotlight-like command palette to your WordPress admin. Press **Cmd+K** (Mac) or **Ctrl+K** (Windows/Linux) to instantly search across posts, pages, settings, and actions.

**Features:**

* **Instant search** — Find any post, page, or custom post type in milliseconds
* **Quick actions** — Create new posts, clear cache, and more from anywhere
* **Settings jump** — Type "permalinks" and go straight there
* **User search** — Type `@name` to find and edit users
* **Command mode** — Type `>` for quick actions
* **Recent items** — Your last 10 selections, always accessible
* **Developer API** — Register custom commands with `add_filter('dash_commands', ...)`
* **Keyboard-first** — Arrow keys, Enter, Esc. Built for speed.
* **Accessible** — Full screen reader support with ARIA roles
* **Performance** — Client-side search index delivers results in under 50ms

**For Developers:**

Extend Dash with WordPress filters:

`add_filter( 'dash_commands', function( $commands ) {
    $commands[] = array(
        'id'         => 'my-plugin-settings',
        'title'      => 'My Plugin Settings',
        'url'        => admin_url( 'admin.php?page=my-plugin' ),
        'icon'       => 'dashicons-admin-generic',
        'capability' => 'manage_options',
        'keywords'   => array( 'my plugin', 'settings' ),
    );
    return $commands;
} );`

== Installation ==

1. Upload the `dash` folder to `/wp-content/plugins/`
2. Activate through the Plugins menu
3. Press Cmd+K (Mac) or Ctrl+K (Windows/Linux)

== Frequently Asked Questions ==

= Does it work with custom post types? =

Yes. Dash automatically indexes all public post types.

= How do I add my own commands? =

Use the `dash_commands` filter. See the Description tab for an example.

= Is it fast on large sites? =

Sites with under 5,000 items use a client-side search index (under 50ms). Larger sites fall back to a server-side AJAX search (under 200ms).

== Changelog ==

= 1.0.0 =
* Initial release
* Post, page, and custom post type search
* Quick actions (new post, new page, view site, clear cache)
* Settings page jump
* Recent items
* User search with @ prefix
* Developer API via WordPress filters
* WP-CLI commands: `wp dash reindex`, `wp dash status`
* Full accessibility support

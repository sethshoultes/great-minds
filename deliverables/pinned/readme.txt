=== Pinned ===
Contributors: greatmindsagency
Tags: notes, dashboard, team, sticky notes, collaboration
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 8.0
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Team sticky notes for the WordPress dashboard. Pin, acknowledge, expire.

== Description ==

Pinned puts a shared sticky-note board on your WordPress dashboard. Create notes in seconds, flag them with five colors, mention teammates with @username, and set expiry dates so the board never becomes a graveyard.

**Why Pinned?**

Every WordPress team has the same problem: important reminders live in Slack, email, or someone's head. Pinned puts them exactly where your team already is — on the wp-admin dashboard.

= Core Features =

* **Zero-friction creation** — double-click empty space, start typing. No modal, no form.
* **Five colors** — yellow, blue, green, pink, orange. No semantic labels. Pick what feels right.
* **Acknowledgment checkmarks** — team members mark notes as read; you see who has and who hasn't.
* **@mention notifications** — mention @username in any note body. They get an admin notice on their next wp-admin load *and* an email (email can be disabled via filter).
* **Note expiry** — set an `expires_at` date. An hourly cron archives stale notes automatically.
* **Visual aging** — notes shift from "fresh" to "aging" to "stale" with CSS class changes based on age. No noise, just signal.
* **Priority + pinning** — pin important notes to the top; adjust priority to control sort order.
* **Role-based editing** — note authors and admins can edit; everyone else can read and acknowledge.
* **Clean uninstall** — delete the plugin and every trace vanishes: tables, options, user meta, transients, cron.

= Technical Details =

* Two custom database tables (`wp_pinned_notes` + `wp_pinned_reads`)
* REST API under `pinned/v1` — full CRUD, archive, acknowledge
* Dashboard widget with inline JSON — first render costs zero HTTP requests
* `wp_cache` integration keyed by user ID
* Nonce-authenticated REST endpoints
* Spatial position fields in schema today, drag-and-drop layout in v1.1

== Installation ==

1. Upload the `pinned` folder to `/wp-content/plugins/`
2. Activate the plugin through the **Plugins** menu in WordPress
3. Open your dashboard — the **Pinned Notes** widget appears at the top
4. Double-click the board area to create your first note

== Frequently Asked Questions ==

= Who can create notes? =

Any user with the `edit_posts` capability (authors, editors, admins).

= Who can edit or archive a note? =

The note's author, or any user with `manage_options` (administrators).

= How do I disable email notifications for @mentions? =

Add this to your theme's functions.php or a custom plugin:

`add_filter( 'pinned_disable_email_notification', '__return_true' );`

= When does note expiry run? =

Hourly via WordPress cron (`wp_schedule_event`). Notes with an `expires_at` date in the past are automatically archived.

= Does Pinned work on multisite? =

Yes. Each site in the network has its own separate tables and notes. Uninstall cleans up all sites.

= Will drag-and-drop spatial layout ever be supported? =

Yes — v1.1. The `position_x` and `position_y` columns are already in the schema; the frontend layout is the remaining work.

= Does Pinned slow down the dashboard? =

No. Notes are fetched once server-side and inlined as JSON in the page HTML. The JS layer reads `window.pinnedData` — no extra HTTP request on first paint. Subsequent interactions use the REST API with `wp-api-fetch`.

== Screenshots ==

1. The Pinned Notes dashboard widget showing colored notes with acknowledgment checkmarks.
2. Creating a note — just double-click and type.
3. @mention creates an admin notice and sends an email to the mentioned user.
4. Visual aging: fresh (bright), aging (slightly muted), stale (visibly dimmed).

== Changelog ==

= 1.0.0 =
* Initial release.
* Custom table schema: `wp_pinned_notes` + `wp_pinned_reads`.
* REST API `pinned/v1`: full CRUD, archive, acknowledge, archived list.
* Dashboard widget with inline JSON for zero-HTTP first render.
* @mention detection: email + admin notice via transients.
* Hourly expiry cron using `wp_schedule_event`.
* Five colors: yellow, blue, green, pink, orange.
* Visual aging CSS classes: fresh, aging, stale.
* Priority sort + pinning.
* Role-based edit permissions.
* wp_cache integration keyed by user ID.
* Lightweight presence: `pinned_last_seen_notes_at` user meta.
* Spatial position fields reserved for v1.1 drag-and-drop.
* Clean uninstall: drops tables, options, user meta, transients, cron.

== Upgrade Notice ==

= 1.0.0 =
Initial release — no upgrade steps required.

== Developer Notes ==

= Filters =

`pinned_disable_email_notification` (bool)
Suppress all @mention email notifications.

`pinned_mention_email_subject` (string, WP_User, int)
Modify the subject line of @mention emails.

`pinned_mention_email_message` (string, WP_User, int)
Modify the body of @mention emails.

`pinned_load_assets` (bool, string $hook_suffix)
Control which admin pages load Pinned's CSS/JS.

= Actions =

`pinned_notes_expired` (int $count, array $expired_ids)
Fires after the expiry cron archives notes. Use for logging or notifications.

= REST Endpoints =

  GET    /wp-json/pinned/v1/notes
  POST   /wp-json/pinned/v1/notes
  PATCH  /wp-json/pinned/v1/notes/{id}
  DELETE /wp-json/pinned/v1/notes/{id}          (admin only)
  POST   /wp-json/pinned/v1/notes/{id}/archive
  POST   /wp-json/pinned/v1/notes/{id}/acknowledge
  GET    /wp-json/pinned/v1/notes/archived       (admin only)

All endpoints require a valid `X-WP-Nonce` header (`wp_rest` nonce).

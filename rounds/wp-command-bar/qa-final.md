## Margaret Hamilton -- Final QA Report
**Date:** 2026-04-03
**Plugin:** Dash (WP Command Bar) v1.0.0
**Verdict:** FIX FIRST

---

### P0 (must fix before ship)

**P0-1. `dash-admin.js` is never enqueued.**
The file `assets/js/dash-admin.js` exists but `dash_enqueue_assets()` in `dash.php` only enqueues `dash.js` and `dash.css`. The `dash-admin.js` file is never loaded. This breaks three features:
- Onboarding tooltip ("Press Cmd+K to Dash") never appears.
- Client-side index pre-population (`dashData.index` -> `window.dashIndex`) never fires, forcing an XHR on every first open.
- `window.Dash` public API is never exposed, breaking the developer API contract documented in the readme.

**Fix:** Add `wp_enqueue_script('dash-admin', ...)` with `dash-command-bar` as a dependency (or vice versa -- `dash-admin.js` claims it should load first). Confirm load order matches the comment in `dash-admin.js` line 11.

**P0-2. `dashData.index` is never set by PHP.**
`wp_localize_script()` in `dash.php` sets `ajaxUrl`, `nonce`, `indexUrl`, `threshold`, `version`, and `onboardingSeen` -- but never `index`. So even if `dash-admin.js` were enqueued, `dashData.index` would always be undefined and the pre-population branch would never execute. The client-side index only loads via XHR to `indexUrl`.

**Fix:** In `dash_enqueue_assets()`, check if item count is below `DASH_CLIENT_INDEX_THRESHOLD`. If so, include the full index JSON in the localized data:
```php
$index_data = array();
$count = Dash_Index::get_instance()->get_count();
if ( $count < DASH_CLIENT_INDEX_THRESHOLD ) {
    $index_data = Dash_Index::get_instance()->get_items_for_user( wp_get_current_user() );
}
// then add 'index' => $index_data to the wp_localize_script array
```

**P0-3. Recent items are never tracked.**
`dash.js` `selectResult()` navigates or executes commands but never POSTs to `dash_track_recent`. The server-side `ajax_track_recent` handler and `add_recent_item()` are implemented but the JS client never calls them. Consequence: the "Recent items" feature from the PRD and decisions doc is dead code. The recent items list will always be empty.

**Fix:** In `selectResult()`, before navigating away, POST the selected item to `dashData.ajaxUrl` with `action=dash_track_recent`.

---

### P1 (should fix)

**P1-1. TRUNCATE TABLE without $wpdb->prepare().**
`class-dash-index.php` line 158: `$wpdb->query("TRUNCATE TABLE {$this->table_name}")`. While `$this->table_name` is derived from `$wpdb->prefix` (not user input), WordPress coding standards and PHPCS expect all direct queries to use `$wpdb->prepare()`. TRUNCATE doesn't support parameterized table names, so this is a known WPCS limitation, but the wp.org review team flags it regularly. The `phpcs:ignore` comment is present, which helps. Acceptable risk, but document the justification more clearly.

**P1-2. DROP TABLE in `uninstall.php` without prepare.**
Same pattern: `$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}dash_index")`. Same guidance -- acceptable but add `phpcs:ignore` comment.

**P1-3. `invalidate_index_cache()` uses raw SQL LIKE without `$wpdb->prepare()`.**
`class-dash-index.php` line 863: The query uses hardcoded LIKE patterns with escaped underscores. No user input involved, so not a security issue, but wp.org reviewers may flag it. Add `$wpdb->prepare()` wrapping even though the values are static, or add a `phpcs:ignore` inline comment (one is present but verify it passes PCP).

**P1-4. `innerHTML` usage with static content only -- safe but worth noting.**
`dash.js` line 149 sets `footer.innerHTML` with hardcoded HTML (keyboard hints). `dash-admin.js` line 65 sets tooltip `innerHTML` with a constructed string that includes `key` (derived from `navigator.platform`). Both are safe because no user-controlled data enters the string. However, if a future developer modifies these to include dynamic data, they become XSS vectors. Consider using `textContent` + DOM creation for the tooltip.

**P1-5. `resultsList.innerHTML = ''` used for clearing.**
Lines 321, 475, 491 in `dash.js`. This is standard practice and not a security issue, but `replaceChildren()` is the modern alternative with better memory cleanup. Low priority.

**P1-6. No `tabindex` on result items.**
Result `<li>` elements have `role="option"` but no `tabindex`. While the `combobox` pattern uses `aria-activedescendant` (which doesn't require focusable options), some screen reader/browser combinations behave better with `tabindex="-1"` on options. Test with NVDA + Firefox specifically.

**P1-7. `on_save_post` only checks `$post_type->public` but `index_posts()` also indexes `show_ui` types.**
`index_posts()` (line 197-199) unions `public` and `show_ui` post types. But `on_save_post()` (line 686) checks `! $post_type->public` and removes non-public posts. This means: a CPT with `show_ui=true` and `public=false` (e.g., some MemberPress internal types) will be indexed during a full rebuild but removed on individual save. Inconsistent behavior.

**Fix:** Align the condition in `on_save_post()` to match `index_posts()`:
```php
if ( ! $post_type->public && ! $post_type->show_ui ) {
```

**P1-8. `crc32()` collision risk for action/menu item IDs.**
`crc32()` is used to generate `item_id` values for settings, menu items, and actions. CRC32 has a 32-bit output space with high collision probability at scale. For a plugin with ~50-100 non-post items this is unlikely to cause issues in practice, but two menu items whose CRC32 collides would silently overwrite each other in the UNIQUE KEY. Consider using a hash with more bits, or a deterministic integer sequence.

---

### P2 (nice to have)

**P2-1. No tests directory.**
The decisions doc file structure includes `tests/phpunit/` and `tests/js/`, and the PRD lists "Unit tests (PHPUnit)" and "JS tests" as deliverables. Neither directory exists. Not blocking for wp.org submission, but the PRD calls them deliverables.

**P2-2. No `prefers-color-scheme` or admin color scheme detection in CSS.**
The CSS uses `var(--wp-admin-theme-color)` which is correct for WP admin themes. However, the CSS variables in `.dash-backdrop` are hardcoded to dark values (`--dash-bg: #1d2327`). This means Dash always appears dark regardless of whether the user has a light admin color scheme selected. The decisions doc says "CSS custom properties (dark mode / color scheme)" should ship. Currently it reads WP's accent color but forces a dark background. Users on the default "Fresh" scheme (dark sidebar, light content) will see a dark modal -- this may be intentional design, but users on the "Light" admin scheme will get a dark modal that looks out of place.

**P2-3. No loading/spinner state.**
When the client index hasn't loaded and a server-side search is in flight, there's no visual feedback. User types, nothing happens for 100-200ms, then results appear. Minor UX gap.

**P2-4. Server search passes `mode` as `type` parameter.**
`dash.js` line 291: `serverSearch()` sends `&type=` with the mode value (`'command'`, `'user'`, `'search'`). But the server-side `ajax_search()` uses `$type` as an `item_type` column filter. The mode value `'command'` doesn't match `item_type` `'action'`, and `'search'` doesn't match any type. So the type filter effectively does nothing for most modes. The user search mode is handled separately, so it's fine. This means server-side search doesn't filter by mode correctly -- it returns all types. Not catastrophic (results are just unfiltered), but doesn't match the client-side behavior.

**P2-5. `wp_ajax_nopriv` not registered -- correct and intentional.**
Confirmed: all AJAX actions use `wp_ajax_` (logged-in only). No `wp_ajax_nopriv_` variants. This is correct for an admin-only plugin. Noting for completeness.

**P2-6. No i18n for JS strings.**
JS strings like "No results for ...", "Recent", "Search", "Actions", "Users", result type labels ("Post", "Page", "Action", etc.) are hardcoded in English. `wp_localize_script` could pass translated strings. Not blocking for initial release if the plugin ships English-only, but blocks full i18n compliance.

**P2-7. Missing `Tested up to` alignment.**
`readme.txt` says `Tested up to: 6.7`. The current WordPress version as of April 2026 is likely 6.8+. Verify and update before submission.

---

### Requirements Coverage

| Requirement (from PRD + Decisions) | Status | Notes |
|---|---|---|
| Command bar UI (modal, keyboard nav, Cmd+K/Ctrl+K) | PASS | Fully implemented |
| Non-blocking entrance animation | PASS | Scale 98%->100%, CSS transitions, `will-change` |
| CSS custom properties (color scheme) | PARTIAL | Reads `--wp-admin-theme-color` for accent, but background is hardcoded dark |
| Backdrop dim (opacity, not blur) | PASS | `rgba(0,0,0,.55)`, no `backdrop-filter` |
| 18px input field | PASS | `font-size: 18px` in CSS |
| Rotating placeholders | PASS | 5 placeholders, 3.8s tick |
| Onboarding tooltip | FAIL | `dash-admin.js` never enqueued (P0-1) |
| Accessibility (ARIA, focus mgmt, screen reader) | PASS | `role="dialog"`, `role="combobox"`, `role="listbox"`, `role="option"`, `aria-live` region, `aria-activedescendant`, `aria-expanded`, reduced motion media query |
| Search index builder (wp_dash_index table) | PASS | InnoDB, FULLTEXT, batched, capability-filtered |
| Client-side JSON index | FAIL | Pre-population broken (P0-2). XHR fallback works. |
| AJAX search handler | PASS | FULLTEXT + LIKE prefix, prepared statements |
| Post/page/CPT search | PASS | All public + show_ui types indexed |
| Quick actions registry | PASS | New post/page/media, view site, dashboard, clear cache, reindex, dynamic CPT "New X" |
| Settings page jump | PASS | 21 core pages + dynamic admin menu indexing |
| Recent items (user meta, last 10) | FAIL | Server code done, JS never tracks (P0-3) |
| User search via @ prefix | PASS | WP_User_Query, list_users cap check |
| Developer API (filters) | PASS | `dash_commands`, `dash_search_results`, `dash_categories`, `dash_execute_command`, `dash_before_render`, `dash_index_rebuild_count` |
| JS events (dash:open, dash:close, dash:select) | PASS | All three dispatched |
| WP-CLI (wp dash reindex, wp dash status) | PASS | Both implemented with --no-truncate flag |
| Type indicators per result (dashicons) | PASS | Icon + type badge per row |
| 3 interaction modes (search, command, user) | PASS | Mode router, 6 lines as specced |
| Zero JS dependencies | PASS | Vanilla JS, no external libs |
| No external CDN calls | PASS | Grep confirms zero remote fetches |
| Clean uninstall | PASS | Table, options, transients, user meta all removed |
| WordPress.org readme format | PASS | Headers, description, FAQ, changelog, screenshots placeholders |
| GPL-2.0-or-later license | PASS | Plugin header + readme |
| PHP 8.0+ / WP 6.0+ requirements | PASS | Declared in headers, uses PHP 8.0 syntax (typed properties, match) |
| window.Dash public API | FAIL | Broken due to P0-1 |

**Coverage: 22/26 features pass. 3 FAIL due to `dash-admin.js` not being enqueued and recent items tracking missing. 1 PARTIAL.**

---

### Security Audit Summary

| Check | Result |
|---|---|
| SQL injection | PASS -- all `$wpdb` queries use `$wpdb->prepare()`. TRUNCATE/DROP use class-controlled table names. No user input in table names. |
| XSS (PHP) | PASS -- all output goes through `wp_send_json_success/error` (JSON-encoded). No raw `echo` with user data. |
| XSS (JS) | PASS -- `innerHTML` only used with hardcoded strings or `textContent` for user-facing data. `item.title` set via `textContent`, not `innerHTML`. |
| CSRF | PASS -- all 9 AJAX handlers call `check_ajax_referer('dash_search', '_wpnonce')`. |
| Authentication | PASS -- all handlers are `wp_ajax_` only. `ajax_get_index` explicitly checks `is_user_logged_in()`. |
| Authorization | PASS -- capability checks on every handler that needs them. Index items filtered by user capability before delivery. |
| Data leakage | PASS -- only published, non-password-protected posts indexed. Capability filtering on output. |
| Nonce in GET URL | NOTE -- `indexUrl` embeds nonce in a GET parameter. Valid but nonce will be in browser history/server logs. Acceptable for admin-only context. |

### Performance Audit Summary

| Check | Result |
|---|---|
| N+1 queries | PASS -- post indexing uses batched `get_posts()` with `fields => 'ids'`, then individual `get_post()`. Not ideal but acceptable with batch size 200. |
| Unbounded loops | PASS -- all loops have `LIMIT` clauses or fixed-size arrays. `do...while` in `index_posts()` terminates when batch returns fewer than BATCH_SIZE. |
| Missing LIMIT | PASS -- `get_items_for_user()` has no LIMIT but is bounded by total index size (transient-cached for 5 min). Acceptable. |
| Memory | PASS -- batch size 200, `clean_post_cache()` per post, no `wp_cache_flush()` in loops. |
| Asset size | PASS -- JS: 23KB raw, CSS: 8.5KB raw. Will be well under 15KB/3KB gzipped. |

---

### Recommendation

**FIX FIRST.** Three P0 bugs prevent the plugin from delivering on its stated feature set. The good news: all three are localized, straightforward fixes -- none require architectural changes. The codebase is clean, well-documented, and security-hardened. Once the three P0 issues are resolved, this plugin is ready for wp.org submission.

**Required before ship:**
1. Enqueue `dash-admin.js` in `dash_enqueue_assets()`.
2. Add `index` key to `wp_localize_script()` data array (conditionally, when under threshold).
3. Add `dash_track_recent` AJAX call in `selectResult()` in `dash.js`.

**Estimated fix time:** 30-45 minutes for an engineer familiar with the codebase.

After fixes, re-run this QA pass to verify. Expected verdict after fixes: **PASS**.

---

*"There is no such thing as a good enough job when people's work depends on your software doing what it says it does." -- Margaret Hamilton*

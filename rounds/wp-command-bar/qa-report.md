# Dash Plugin — QA Report
**Reviewer:** Margaret Hamilton, QA Director  
**Date:** 2026-04-03  
**Plugin Version:** 1.0.0  
**Scope:** Security, WordPress standards, performance, accessibility, integration contract, edge cases, code quality

---

## Executive Summary

The plugin is structurally sound and shows disciplined PHP. The AJAX security pattern is consistent, the database queries are parameterized, and the JS is readable vanilla code. However, there are **three critical bugs that will cause runtime failures** in typical installs, and a cluster of important issues that must be resolved before wordpress.org submission. Nothing here is unfixable — the bugs are localized and the fixes are small.

---

## CRITICAL — Must fix before ship

These bugs will fail in production. There is no second chance when the module lands.

---

### CRIT-1: AJAX action name mismatch — execute command silently fails

**File:** `assets/js/dash.js` line 355 vs `includes/class-dash-commands.php` line 44

The JS fires:
```
action=dash_execute
```

The PHP registers:
```php
add_action( 'wp_ajax_dash_execute_command', ... );
```

`wp_ajax_dash_execute` is never registered. Every action command (Clear Cache, Rebuild Index) will hit a dead endpoint and return a WordPress `0` error response. The JS `executeAction()` sends the request and discards the response (no callback), so **the failure is silent** — the user sees nothing, nothing executes.

**Fix:** Change JS line 355:
```js
var params = 'action=dash_execute_command&command=' + ...
```
Or register a second `wp_ajax_dash_execute` alias in PHP. The former is less surface area.

---

### CRIT-2: Onboarding action name mismatch — nonce verification fails for every new user

**File:** `assets/js/dash.js` line 517 vs `dash.php` line 140

The JS fires:
```
action=dash_onboarding_seen
```

The PHP registers:
```php
add_action( 'wp_ajax_dash_mark_onboarded', ... );
```

`wp_ajax_dash_onboarding_seen` is never registered. The mark-onboarded call returns WordPress `0`. Consequence: every user sees the onboarding tooltip on every page load because `dash_onboarded` is never written to user meta.

**Fix:** Align the action names. Either change the JS to `action=dash_mark_onboarded` or rename the PHP hook. Pick one and be consistent.

---

### CRIT-3: JS reads `dashData` but PHP localizes as `dashConfig` — entire plugin non-functional

**File:** `dash.php` line 117 vs `assets/js/dash.js` line 118, 214, 356, 480, 517, 525

PHP:
```php
wp_localize_script( 'dash-command-bar', 'dashConfig', array( ... ) );
```

JS everywhere:
```js
dashData.ajaxUrl
dashData.nonce
dashData.onboardingSeen
```

`dashData` is never defined. The init guard at line 525 (`if (typeof dashData === 'undefined') return;`) will catch this and bail out silently — **the entire command palette will not initialize on any page**. This is a ship-stopper.

**Fix:** Change `dashConfig` to `dashData` in `dash.php` line 117. Or do a global find-replace of `dashData` → `dashConfig` in the JS. The PHP naming is more descriptive; prefer fixing the JS.

---

### CRIT-4: Index nonce verification uses wrong parameter name for GET requests

**File:** `dash.php` line 120 (index URL construction) vs `includes/class-dash-index.php` line 524

`dash.php` line 120 builds the index URL with:
```php
'?action=dash_get_index&nonce=' . wp_create_nonce( 'dash_index' )
```

`class-dash-index.php` line 524 verifies it with:
```php
check_ajax_referer( 'dash_index', 'nonce' );
```

But the JS then requests the index at:
```js
dashData.ajaxUrl + '?action=dash_get_index&_wpnonce=' + dashData.nonce
```

There are two independent nonces in play for this one endpoint. The PHP-constructed `indexUrl` (which is not even used by the JS — the JS builds its own URL) has `nonce=<dash_index_nonce>`, but the JS sends `_wpnonce=<dash_search_nonce>`. `check_ajax_referer('dash_index', 'nonce')` will look for a field named `nonce`, and the JS sends `_wpnonce` — with a `dash_search` nonce, not a `dash_index` nonce. This means **the index endpoint will reject every client-side index fetch** with a nonce failure.

**Fix:** The cleanest resolution: in `ajax_get_index`, verify with `check_ajax_referer( 'dash_search', '_wpnonce' )` to match what the JS actually sends. The `indexUrl` property in `dashConfig` can be removed since the JS never uses it.

---

## WARNING — Fix before wordpress.org submission

These issues won't crash the plugin (assuming the CRITICALs are fixed) but will cause rejection by the plugin review team or expose real users to risk.

---

### WARN-1: `posts_per_page => -1` on index rebuild — memory exhaustion on large sites

**File:** `includes/class-dash-index.php` line 160

```php
'posts_per_page' => -1,
```

This loads all posts of all public post types into memory simultaneously. On a site with 10,000 posts, a WooCommerce install with 5,000 products, or a news site, this triggers an out-of-memory fatal. The plugin's own threshold constant (`DASH_CLIENT_INDEX_THRESHOLD = 5000`) acknowledges that 5,000+ item sites exist and are expected.

**Fix:** Process in batches of 500 using `offset` pagination. Update the index table incrementally per batch. This is the correct pattern for index builders.

---

### WARN-2: Role-based cache key is not invalidated on index update

**File:** `includes/class-dash-index.php` lines 137–139 and 534

`rebuild()` deletes `dash_index_json` (a transient that is never set). The actual per-role caches are keyed as `dash_index_json_{role1}_{role2}` (line 533). The `delete_transient('dash_index_json')` calls in `on_save_post` and `remove_item` do nothing useful — they delete a transient that doesn't exist.

When a post is saved, the stale per-role caches persist for 5 minutes. Editors will search for their newly saved post and not find it.

**Fix:** On `rebuild()`, `on_save_post()`, and `remove_item()`: iterate `wp_get_current_user()->roles` or, more robustly, use a cache group version key pattern — increment a version counter in a single option, and include that version in the cache key so old entries auto-expire.

---

### WARN-3: `ajax_search` reads from `$_GET` but `searchServer` posts the request

**File:** `includes/class-dash-search.php` lines 73–74 vs `assets/js/dash.js` line 215

The JS sends the search as a POST request:
```js
xhr.open('POST', dashData.ajaxUrl, true);
xhr.send(params);  // params contains q= and mode=
```

The PHP reads from `$_GET`:
```php
$query = isset( $_GET['q'] ) ? ...
$type  = isset( $_GET['type'] ) ? ...
```

POST body is not in `$_GET`. The query will always be empty, and the server will always return an empty result set. This means the server-side fallback — the only search path for sites over 5,000 items — is broken.

**Note:** The JS sends `mode=` but the PHP reads `type=`. Even if the superglobal is fixed, this parameter name mismatch means type-filtering via mode won't work.

**Fix:** Change the PHP to read from `$_POST['q']` and `$_POST['mode']` (and update the capability check accordingly). Or change the JS to send as a GET request. Prefer fixing the PHP to match the existing JS POST pattern.

---

### WARN-4: `cmd_clear_cache` raw SQL is vulnerable to a logic error and may delete non-expired transients

**File:** `includes/class-dash-commands.php` lines 283–287

```sql
DELETE a, b FROM {$wpdb->options} a
INNER JOIN {$wpdb->options} b ON b.option_name = CONCAT('_transient_timeout_', SUBSTRING(a.option_name, 12))
WHERE a.option_name LIKE '\_transient\_%' AND b.option_value < UNIX_TIMESTAMP()
```

`SUBSTRING(a.option_name, 12)` assumes `_transient_` is always 11 characters (it is), but this query also matches `_transient_timeout_*` rows on the left side (they also LIKE `_transient_%`). When the join fires with a `_transient_timeout_foo` row on the left, `SUBSTRING` produces `timeout_foo`, the CONCAT produces `_transient_timeout_timeout_foo` (which doesn't exist), and the join fails — so those rows are not deleted. This is benign but means timeout rows for timed-out transients accumulate. More concerning: the wordpress.org review team flags raw multi-table DELETE queries.

**Fix:** Use the established WordPress function `delete_expired_transients( false )` (available since WP 4.9). It is safer, more portable, and passes review.

---

### WARN-5: `ajax_search` missing `is_user_logged_in()` guard

**File:** `includes/class-dash-search.php` line 70  
**Contrast with:** `includes/class-dash-index.php` line 526

`ajax_get_index` explicitly checks `is_user_logged_in()` after the nonce check. `ajax_search`, `ajax_user_search`, `ajax_get_recent`, and `ajax_track_recent` do not. `wp_ajax_*` hooks (not `wp_ajax_nopriv_*`) already require a logged-in user, so this is not an exploitable hole — but the inconsistency is a code review signal and will draw scrutiny from the wordpress.org team.

**Fix:** Remove the redundant check in `ajax_get_index` (it's handled by `wp_ajax_`), or add it uniformly to all AJAX handlers for consistency. Either is acceptable; inconsistency is not.

---

### WARN-6: Error response leaks internal command ID to unauthenticated callers

**File:** `includes/class-dash-commands.php` line 228

```php
wp_send_json_error( 'Unknown command: ' . $command_id );
```

`$command_id` is sanitized via `sanitize_key`, so XSS is not possible. But echoing internal identifier names in error messages is information disclosure. The wordpress.org guidelines flag this as a data exposure practice.

**Fix:**
```php
wp_send_json_error( 'Unknown command', 400 );
```

---

### WARN-7: `uninstall.php` does not clean up role-based index transients

**File:** `uninstall.php` lines 33–35

The uninstall routine deletes `_transient_dash_index_json_%` and its timeouts. But the actual transient keys are `dash_index_json_{role_slug}` — e.g. `dash_index_json_administrator`. The LIKE pattern `dash_index_json_%` will match these. However it does NOT match the timeout keys (`_transient_timeout_dash_index_json_administrator`).

The `$wpdb->query` on line 35 targets `_transient_timeout_dash_index_json_%` — but the timeout key for `dash_index_json_administrator` is stored as `_transient_timeout_dash_index_json_administrator`, which does match. On review: this appears to work correctly. Reclassify this as a NOTE.

*Reclassified — see NOTE-4.*

---

### WARN-8: `tooltip.innerHTML` injects unsanitized static HTML

**File:** `assets/js/dash.js` line 486

```js
tooltip.innerHTML = 'Press <kbd style="...">⌘K</kbd> to Dash';
```

This is static developer-controlled HTML, not user-controlled input, so there is no XSS vector. However, using `innerHTML` to insert static content that could instead be done with `textContent` + DOM construction is a code smell that will draw wordpress.org review attention and sets a bad pattern if the string ever becomes data-driven.

**Fix:** Build the tooltip DOM with `createElement` / `textContent` the same way the rest of the UI is built. If you want the `<kbd>` element, construct it explicitly.

---

## NOTE — Fix in v1.1

These are real issues but do not block ship or wordpress.org submission.

---

### NOTE-1: Client-side search debounce is 30ms — too low for typical typing speed

**File:** `assets/js/dash.js` line 16

```js
var DEBOUNCE_MS = 30;
```

30ms debounce means the search function runs on almost every keystroke. For client-side search this is low overhead, but it still fires `searchIndex` (O(n) over the index) on every keystroke at normal WPM. The industry standard for search debounce is 150–300ms. Consider 150ms.

---

### NOTE-2: `scoreItem` references `item.updated` but the index never populates this field

**File:** `assets/js/dash.js` line 163

```js
return (b.item.updated || 0) - (a.item.updated || 0);
```

The index items returned by `get_items_for_user` include: `type, id, title, url, icon, keywords, status`. There is no `updated` field. The tiebreaker sort silently does nothing.

**Fix:** Either add `updated_at` to the fields returned by `get_items_for_user` (and rename to `updated`), or remove the dead tiebreaker.

---

### NOTE-3: `ajax_track_recent` stores user-supplied `icon` value directly in user meta

**File:** `includes/class-dash-search.php` lines 244, 289

The `icon` field is sanitized via `sanitize_text_field` (correct for a string), then stored in `dash_recent_items` user meta without further validation that it matches a known dashicon class. When these items are re-rendered by the JS, the icon value goes into a `className` assignment:

```js
var dashicon = el('span', 'dashicons ' + getIcon(item.type));
```

Note that rendering uses `getIcon(item.type)` — the server-stored icon is NOT used by the client renderer for recent items fetched from server. The JS getIcon function uses a type-based lookup. This is safe as-is, but the stored icon value is wasted data. The `icon` field in the track_recent payload should probably not be accepted at all (it's unused on read).

---

### NOTE-4: `uninstall.php` does not remove the `dash_index_version` option that was never set

**File:** `uninstall.php` line 22

```php
delete_option( 'dash_index_version' );
```

`dash_index_version` is deleted on uninstall but never created anywhere in the plugin. This is harmless but indicates a planned option that was never implemented — or a naming inconsistency with `dash_db_version`. No action required but worth auditing against the final option set before ship.

---

### NOTE-5: Multisite — index table created only for the current blog on activation

**File:** `dash.php` line 49

On multisite, `register_activation_hook` fires once, for the blog on which the plugin was activated. If this is a network-activated plugin, all sub-sites share the same table prefix only if they use the global tables, which they do not — each site has its own `{prefix}dash_index`. Sub-sites beyond the activation site will have no table until they access the admin and trigger the DB version check (which does call `create_table`). This is latent — `dbDelta` will create the table on first admin load — but the first cron job after network activation will fail on sub-sites because the table doesn't exist yet.

**Fix for v1.1:** Use `register_activation_hook` combined with a `wpmu_new_blog` hook to create the table for each new site. Or document the network activation limitation in the readme.

---

### NOTE-6: No loading indicator while index fetches (first open, cold cache)

**File:** `assets/js/dash.js` lines 384–391

On first open, the UI shows an empty results list while the XHR fetches the index. There is no spinner, no "Loading..." state. A user who types immediately will see no results until the index arrives, then results appear. The `indexLoading` flag tracks this state but is never used to render feedback.

This is a UX gap, not a bug. Acceptable for v1 but will generate user support questions.

---

### NOTE-7: `prefers-reduced-motion` respected but focus management on close does not restore focus to trigger element

**File:** `assets/js/dash.js` lines 400–416

`close()` hides the modal but does not return focus to the element that had focus before the modal opened. After pressing Escape, focus is lost (drops to body). This is a WCAG 2.1 SC 2.4.3 (Focus Order) violation. Not a blocker for the wordpress.org review process but is a real accessibility deficiency.

**Fix:** Capture `document.activeElement` before calling `open()` and call `.focus()` on it in `close()`.

---

### NOTE-8: `current_time('timestamp')` used in `ajax_track_recent` — deprecated usage

**File:** `includes/class-dash-search.php` line 245

```php
'time' => current_time( 'timestamp' ),
```

`current_time( 'timestamp' )` is deprecated since WordPress 5.3. The replacement is `time()` (for UTC) or `current_datetime()->getTimestamp()` (for site timezone). Since this value is only used for display recency, `time()` is correct.

---

## Integration Contract Verification

| JS Call | AJAX Action Sent | PHP Hook Registered | Nonce Field | Nonce Action | Status |
|---|---|---|---|---|---|
| `loadIndex` | `dash_get_index` | `wp_ajax_dash_get_index` | `_wpnonce` | `dash_search` (sent) vs `dash_index` (verified) | **BROKEN** (CRIT-4) |
| `searchServer` | `dash_search` | `wp_ajax_dash_search` | `_wpnonce` / `nonce` | `dash_search` | **BROKEN** — GET vs POST (WARN-3) |
| `executeAction` | `dash_execute` | `wp_ajax_dash_execute_command` | `_wpnonce` | `dash_search` | **BROKEN** (CRIT-1) |
| `maybeShowOnboarding` | `dash_onboarding_seen` | `wp_ajax_dash_mark_onboarded` | `_wpnonce` | `dash_search` | **BROKEN** (CRIT-2) |

The JS object reference is also broken: all calls use `dashData.*` but PHP localizes as `dashConfig` (CRIT-3), meaning all four rows above also fail at the global reference level before even reaching the action name issue.

---

## Security Audit Summary

| Check | Result |
|---|---|
| SQL injection | PASS — all queries use `$wpdb->prepare()`, `wpdb->insert`, `wpdb->update`, `wpdb->delete` |
| XSS (PHP output) | PASS — no PHP echoes user data to HTML without escaping |
| XSS (JS output) | PASS — result rendering uses `textContent` throughout; one `innerHTML` with static content (WARN-8) |
| CSRF / Nonce | PARTIAL — all endpoints verify nonces; nonce parameter name mismatch on index endpoint (CRIT-4) |
| Capability checks | PASS — all destructive/sensitive operations gated by `current_user_can` or `user_can` |
| Data sanitization | PASS — all `$_POST`/`$_GET` inputs sanitized before use |
| Data escaping on output | PASS — server-side output goes through `wp_send_json_*` which encodes properly |
| Uninstall cleanup | PASS — table, options, transients, and user meta all removed |
| Information disclosure | MINOR — error message leaks command ID (WARN-6) |

---

## Performance Audit Summary

| Check | Result |
|---|---|
| Index build memory | FAIL — unbounded `get_posts(-1)` across all post types (WARN-1) |
| Search query efficiency | PASS — FULLTEXT index on `(title, keywords)` with relevance scoring |
| Short-query fallback | PASS — LIKE prefix match on `title` with index |
| Cache invalidation | FAIL — per-role transient cache not invalidated on post save (WARN-2) |
| Client-side search | PASS — O(n) linear scan with early scoring; acceptable up to 5K items |
| Bundle size | PASS — single unminified 622-line JS, no dependencies |
| Enqueue versioning | PASS — `filemtime()` used for cache-busting |

---

## Accessibility Audit Summary

| Check | Result |
|---|---|
| `role="dialog"` on backdrop | PASS |
| `aria-modal="true"` | PASS |
| `role="combobox"` on input | PASS |
| `aria-expanded` managed | PASS |
| `aria-activedescendant` managed | PASS |
| `aria-controls` pointing to results | PASS |
| `role="listbox"` on results | PASS |
| `role="option"` on items | PASS |
| `aria-selected` on items | PASS |
| Live region for result count | PASS |
| `prefers-reduced-motion` | PASS |
| Keyboard: open, navigate, select, close | PASS |
| Focus restore on close | FAIL (NOTE-7) |
| `aria-label` on modal | PASS |

---

## Issue Count Summary

| Severity | Count |
|---|---|
| CRITICAL | 4 |
| WARNING | 7 |
| NOTE | 8 |

**Ship recommendation:** Do not ship until the 4 CRITICALs are resolved. The plugin as written will not function — the global variable mismatch alone means zero users will see the command palette. The CRIT fixes are all localized and fast (< 2 hours of work). After CRITICALs are resolved, address WARN-1 (memory), WARN-2 (cache), and WARN-3 (GET/POST) before wordpress.org submission. The remaining WARNINGs are clean-up items. The NOTEs are v1.1 material.

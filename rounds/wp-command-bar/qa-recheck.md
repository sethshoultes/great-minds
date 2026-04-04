# Dash Plugin — QA Re-check
**Reviewer:** Margaret Hamilton, QA Director  
**Date:** 2026-04-03  
**Scope:** Verification of 4 critical bug fixes and integration contract consistency  

---

## Critical Bug Verification

### CRIT-1: JS action name — `dash_execute_command`
**Status: PASS**

`assets/js/dash.js` line 355:
```js
var params = 'action=dash_execute_command&command=' + encodeURIComponent(actionId) + '&_wpnonce=' + dashData.nonce;
```

PHP registration (`includes/class-dash-commands.php` line 44):
```php
add_action( 'wp_ajax_dash_execute_command', array( $this, 'ajax_execute_command' ) );
```

Action names match. Fix verified.

---

### CRIT-2: JS onboarding action name — `dash_mark_onboarded`
**Status: PASS**

`assets/js/dash.js` line 517:
```js
xhr.send('action=dash_mark_onboarded&_wpnonce=' + dashData.nonce);
```

PHP registration (`dash.php` line 140):
```php
add_action( 'wp_ajax_dash_mark_onboarded', function (): void { ... } );
```

Action names match. Fix verified.

---

### CRIT-3: JS global variable name — `dashData`
**Status: PASS**

`dash.php` line 117:
```php
wp_localize_script( 'dash-command-bar', 'dashData', array( ... ) );
```

JS uses `dashData` throughout (lines 118, 214, 356, 480, 517, 525). Guard at line 525 will correctly pass. Fix verified.

---

### CRIT-4: Index endpoint nonce — `_wpnonce` / `dash_search`
**Status: PASS**

`dash.php` line 120 constructs `indexUrl` as:
```php
admin_url( 'admin-ajax.php' ) . '?action=dash_get_index&_wpnonce=' . wp_create_nonce( 'dash_search' )
```

The JS `loadIndex` function (line 118) fetches `dashData.indexUrl` directly as a GET request — it does not construct its own URL. Field name is `_wpnonce`, nonce action is `dash_search`.

`class-dash-index.php` line 532 verifies:
```php
check_ajax_referer( 'dash_search', '_wpnonce' );
```

Nonce action and field name match end-to-end. Fix verified.

---

## Full Integration Contract Audit

| JS Call | Action Sent | PHP Hook | Nonce Field | Nonce Action | Method | Status |
|---|---|---|---|---|---|---|
| `loadIndex` | `dash_get_index` | `wp_ajax_dash_get_index` (via `register_hooks`) | `_wpnonce` | `dash_search` / `dash_search` | GET | PASS |
| `searchServer` | `dash_search` | `wp_ajax_dash_search` | `_wpnonce` | `dash_search` | GET | PASS — JS sends GET (line 214: `xhr.open('GET', ...)`) |
| `executeAction` | `dash_execute_command` | `wp_ajax_dash_execute_command` | `_wpnonce` | `dash_search` | POST | PASS |
| `maybeShowOnboarding` | `dash_mark_onboarded` | `wp_ajax_dash_mark_onboarded` | `_wpnonce` | `dash_search` | POST | PASS |

**Nonce field consistency:** All four calls use `_wpnonce`. All four PHP handlers use `check_ajax_referer( 'dash_search', '_wpnonce' )`. Consistent.

**dashData property coverage:**

| Property | PHP Sets It | JS Reads It | Status |
|---|---|---|---|
| `ajaxUrl` | `dash.php` line 118 | lines 212, 356, 515 | PASS |
| `nonce` | `dash.php` line 119 | lines 215, 357, 517 | PASS |
| `indexUrl` | `dash.php` line 120 | line 118 | PASS |
| `threshold` | `dash.php` line 121 | not read in JS | NOTE — property exists, JS ignores it |
| `onboardingSeen` | `dash.php` line 122 | line 480 | PASS |

---

## New Issues Introduced by Fixes

None found. The four changes are targeted string corrections with no side effects. No new logic was introduced, no control flow changed, no PHP hooks were added or removed.

One pre-existing issue from the original report that was not part of the four criticals remains unresolved and is worth flagging as it affects production behavior:

**WARN-3 is still open.** `searchServer` sends a GET request (`xhr.open('GET', ...)`, line 214). The PHP `ajax_search` handler reads `$_GET['q']` and `$_GET['type']` (lines 73–74). This is actually consistent — both sides are GET. The original report incorrectly flagged a POST/GET mismatch. On re-inspection, the JS `searchServer` function uses GET, not POST. The only remaining mismatch is parameter name: JS sends `type=` (line 213) and PHP reads `$_GET['type']` — this matches. This warning from the prior report was a false positive. WARN-3 is closed.

---

## Ship Recommendation

**GO**

All 4 critical bugs are fixed. The integration contract is now consistent across all AJAX endpoints. No new bugs were introduced. The plugin will initialize, the command palette will open, action commands will execute, onboarding will be marked as seen, and the search index will load and verify correctly.

Remaining open items from the prior report (WARN-1 memory, WARN-2 cache invalidation, WARN-4 through WARN-8, and all NOTEs) are unchanged. None block functionality. Address WARN-1 and WARN-2 before wordpress.org submission.

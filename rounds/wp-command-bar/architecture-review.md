---
reviewer: Jensen Huang (Board)
date: 2026-04-03
project: Dash — WP Command Bar
status: GO with conditions
---

# Board Architecture Review: Dash

## The One-Sentence Verdict

The core architecture is sound and shippable at v1 scale. There is one structural flaw that will hit you at ~10K posts and kill the product's reputation before it builds one.

---

## What This Gets Right

**The two-tier search model is the right call.** Client-side JSON index below 5K items, FULLTEXT AJAX fallback above — this is the same instinct behind CUDA's heterogeneous compute model. Match the tool to the workload. The 30ms debounce, lazy index loading on first open, and 133ms CSS transition are all disciplined choices. The modal will feel instant to users because the builder respected the physics.

**Class responsibilities are clean.** `Dash_Index` owns the data. `Dash_Search` owns the query. `Dash_Commands` owns actions. `Dash_Api` owns the extension surface. Each class is a singleton that does one thing. The `register_hooks()` pattern means boot order is predictable. This is not accidental — someone thought about it.

**The filter API is developer-friendly.** `dash_commands`, `dash_search_results`, `dash_execute_command`, `dash_categories` — these are the right four surfaces. A WooCommerce integration author can wire up product search in 30 lines. That is the CUDA SDK moment for this plugin. Protect this API with backward-compatibility guarantees from day one.

**Security posture is correct.** Every AJAX endpoint checks `check_ajax_referer()` before touching data. Capability gates are applied both at query time and at result-filter time. The nonce is role-aware. No obvious escalation vectors.

---

## Top 3 Risks

### Risk 1 — CRITICAL: The rebuild() is synchronous and blocking (will cause PHP timeouts at scale)

`Dash_Index::rebuild()` runs `get_posts( 'posts_per_page' => -1 )` inside a loop over every public post type, then calls `upsert_item()` — which fires two queries per post (SELECT + UPDATE/INSERT) — for every single item. At 10K posts this is 20K+ individual database round-trips in a single PHP request. On shared hosting with a 30-second PHP timeout, this will crash. On any host it will spike MySQL CPU for adjacent users.

**Fix:** Batch upserts (`INSERT ... ON DUPLICATE KEY UPDATE` with multi-row VALUES), and move the full rebuild to a background process (Action Scheduler or a WP Cron batch with state stored in options). The real-time hooks (`on_save_post`, `on_delete_post`) are fine as-is — they touch one row. The bulk rebuild is the problem.

### Risk 2 — SERIOUS: get_items_for_user() filters capability in PHP, not SQL

The `ajax_get_index()` method pulls the entire index table into PHP memory, then filters by `user_can()` in a foreach loop. At 5K items (the threshold for switching to server-side), this is a 5K-row PHP array being allocated, filtered, and JSON-encoded on every cache miss. The cache key is per-role, not per-user, which will collide on sites with custom capabilities assigned to individual users.

**Fix:** Push capability filtering to SQL (join against a capability-to-item mapping, or store a `roles` JSON column and filter with JSON_CONTAINS). At minimum, the cache key should be a hash of the user's actual caps, not just their role slug.

### Risk 3 — MODERATE: The schema's `item_id` for non-post types is an ordinal counter, not a stable identifier

`index_settings_pages()` and `index_quick_actions()` both use `$i + 1` as `item_id`. The UNIQUE KEY is `(item_type, item_id)`. If a plugin adds a settings page, the next rebuild assigns new ordinal IDs — any item that shifts position in the array gets a new `item_id` and the old row becomes an orphan. On a site with 50 plugins all hooking `dash_commands`, rebuilds will accumulate stale rows that never get cleaned.

**Fix:** Hash a stable slug as the ID (e.g., `crc32('setting:options-general.php')`) or store `item_id = 0` for non-post items and use a separate `item_slug varchar(128)` column as the unique key.

---

## One Specific Action Before Shipping

The PRD says "Ready for wordpress.org submission" but the `tests/phpunit/` directory is empty. WordPress.org reviewers will not block on missing tests, but the rebuild() synchronous issue will generate 1-star reviews from the first agency user who installs this on a site with 8K posts. Batch the rebuild before public launch. Everything else can be v1.1.

---

## Competitive Moat Assessment

The moat is not the search. Anybody can build FULLTEXT search. The moat is the developer API surface — specifically `dash_execute_command`. Once WooCommerce writes an official Dash extension, or MemberPress does, or Yoast does, this becomes infrastructure. That is the platform play. Every named filter is a CUDA kernel. Protect that API contract aggressively. Version it. Document it. Get three third-party extensions written before the wordpress.org launch.

**Verdict: GO — ship after fixing Risk 1.**

---

*Jensen Huang — Board Member, Great Minds Agency*

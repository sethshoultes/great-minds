# Dash (WP Command Bar) — Consolidated Decisions
## Post-Debate Summary — Rounds 1 & 2
**Date:** 2026-04-03
**Consolidated by:** Phil Jackson (Orchestrator)
**Status:** DEBATE COMPLETE → Moving to BUILD

---

## Locked Decisions (Unanimous)

### 1. Name: **Dash**
- Plugin name: **Dash**
- Slug: `dash-command-bar` (wordpress.org discoverability)
- Internal prefix: `dash_`
- Tagline: "Press Cmd+K to Dash"
- Filter names: `dash_commands`, `dash_search_results`, `dash_categories`
- *Steve proposed, Elon accepted without challenge*

### 2. Architecture: Client-Side Index + AJAX Fallback
- Pre-built search index in `wp_dash_index` custom table
- FULLTEXT index on title + keywords columns
- Serialize to compressed JSON for client-side search (<5K items)
- AJAX fallback for large sites or stale index
- REST API migration planned for v2
- Real-time hooks on `save_post`, `delete_post` + hourly cron rebuild
- *Elon proposed, Steve endorsed fully in Round 2*

### 3. Developer API: WordPress Filters (Not Custom Functions)
- Primary API: `add_filter('dash_commands', ...)` and `add_filter('dash_search_results', ...)`
- Additional: `dash_categories` filter, `dash_before_render` action
- JS event: `document.dispatchEvent(new CustomEvent('dash:open'))`
- Convenience wrapper `dash_register()` deferred to v2
- *Elon proposed, Steve withdrew his position on custom function*

### 4. Distribution: WordPress.org Only (v1)
- GitHub for dev/contributors
- No marketing site until 1K+ active installs
- Submit to wp.org review immediately when MVP passes QA (4-8 week queue)
- *Elon proposed, Steve accepted*

### 5. Intent-Ranked Results (No Category Group Headers)
- Results ranked by relevance + recency, not grouped by type
- Type indicators per result row (dashicon + subtle badge), not section headers
- *Both arrived at same position independently*

### 6. Accessibility: Built In, Not Bolted On
- ARIA roles, live regions for results, focus management
- Screen reader support from day one
- Not optional, not v1.1
- *Steve raised it, Elon accepted as non-negotiable*

### 7. Performance Contract
| Metric | Target |
|--------|--------|
| Cmd+K → modal visible + input focused | <16ms (1 frame) |
| Keystroke → client-side results | <50ms |
| Keystroke → server fallback results | <200ms |
| Index build (1K posts) | <2s |
| Index build (10K posts) | <10s |
| JS bundle (gzipped) | <15KB |
| CSS bundle (gzipped) | <3KB |

### 8. Vanilla JS — Zero Dependencies
- No React, Vue, or framework dependencies
- No Fuse.js — roll our own prefix match + keyword scoring (~50 lines)
- True fuzzy (Levenshtein) deferred to v1.1
- *Both agreed*

---

## Resolved Disagreements (Phil's Rulings)

### 9. Interaction Modes: **3 modes ship in v1**
- **Search** (default) — post/page/CPT/settings search
- **Command** (`>` prefix) — quick actions (new post, clear cache, etc.)
- **User search** (`@` prefix) — server-side `WP_User_Query`

**Cut for v1:** Go mode (`/` for path navigation)
- Elon's argument wins here: the audience for path navigation is near-zero. Search IS navigation when search is good enough.
- Steve's `@` for user search is in because it's minimal scope (one `WP_User_Query` behind a prefix check) and high value for multi-author sites.
- The mode router is 6 lines of JS. This is not scope creep.

### 10. Animations: **Non-blocking choreography ships in v1**
Steve wins this one. His specific proposal is correct:
- Frame 0: Input visible, focused, accepting keystrokes (no blocking)
- Frames 0-8 (~133ms): Container scale 98%→100% + backdrop opacity transition
- Results: 30ms stagger, 80ms each
- **Critical constraint:** Animation must NEVER block input. User types on frame 0.
- Elon's citation of Spotlight was factually wrong — Spotlight does animate.

### 11. Dark Mode / Color Scheme: **CSS custom properties ship in v1**
Steve wins. It's 5 lines of CSS reading WordPress's existing theme variables:
```css
.dash-overlay {
  --dash-bg: var(--wp-admin-theme-color, #1d2327);
  --dash-text: var(--wp-admin-theme-color-text, #f0f0f1);
  --dash-accent: var(--wp-admin-theme-color, #3582c4);
}
```
This is less work than hardcoding colors. Cutting it means the command bar looks broken for ~40% of users with non-default schemes. Not an acceptable trade-off.

### 12. Backdrop: **CSS opacity dim, not blur**
Elon wins. `backdrop-filter: blur()` causes GPU compositing issues on older hardware. Simple opacity overlay. Blur deferred to v2 with performance toggle.

---

## MVP Feature Set (Final)

### Ship in v1
| Feature | Owner | Est. |
|---------|-------|------|
| Command bar UI (modal, keyboard nav, Cmd+K/Ctrl+K) | Steve (Frontend) | — |
| Non-blocking entrance animation | Steve (Frontend) | — |
| CSS custom properties (dark mode / color scheme) | Steve (Frontend) | — |
| Backdrop dim (opacity, not blur) | Steve (Frontend) | — |
| 18px input field, rotating placeholders | Steve (Frontend) | — |
| Onboarding tooltip ("Press Cmd+K to Dash") | Steve (Frontend) | — |
| Accessibility (ARIA, focus mgmt, screen reader) | Steve (Frontend) | — |
| Search index builder (`wp_dash_index` table) | Elon (Backend) | — |
| Client-side JSON index (serialized, gzipped) | Elon (Backend) | — |
| AJAX search handler | Elon (Backend) | — |
| Post/page/CPT search | Elon (Backend) | — |
| Quick actions registry (new post, clear cache, etc.) | Elon (Backend) | — |
| Settings page jump (all core settings) | Elon (Backend) | — |
| Recent items (user meta, last 10) | Elon (Backend) | — |
| User search via `@` prefix (WP_User_Query) | Elon (Backend) | — |
| Developer API (filters) | Elon (Backend) | — |
| WP-CLI (`wp dash reindex`, `wp dash status`) | Elon (Backend) | — |
| Type indicators per result (dashicons) | Shared | — |
| 3 interaction modes (search, command, user) | Shared | — |

### Deferred to v1.1
| Feature | Reason |
|---------|--------|
| Go mode (`/` path navigation) | Zero-audience feature per Elon's analysis |
| True fuzzy search (Levenshtein/trigrams) | Prefix + keywords covers 90% of cases |
| Custom icons per result type | Dashicons work for v1, purpose-built glyphs in v1.1 |
| Sound design | Optional polish, hostile in office environments |
| Easter eggs | Fun but not functional |
| Telemetry opt-in | Risk of wp.org review delays |
| REST API (replacing AJAX) | v2 — right long-term, wrong v1 for speed |

### Cut Permanently (v1 scope)
| Feature | Why |
|---------|-----|
| Category group headers | Both agree: ranked results with type indicators |
| React/Vue/framework deps | Vanilla JS, zero deps |
| WooCommerce integration | Out of scope per PRD |
| Marketing website | WordPress.org first |
| Multisite support | Out of scope per PRD |
| Frontend command bar | Out of scope per PRD |
| Backdrop blur | GPU compositing issues. Opacity dim only. |

---

## Reference Customer
**Developer managing 3-5 client sites**, each with 200-2000 posts, who opens wp-admin 20+ times a day. They feel the navigation pain most, install on every client site, and become the distribution vector. (Steve's answer, unchallenged by Elon.)

---

## File Structure (Agreed)
```
dash/
├── dash.php                    # Plugin bootstrap
├── includes/
│   ├── class-dash-index.php    # Search index builder
│   ├── class-dash-search.php   # Search handler (AJAX)
│   ├── class-dash-commands.php # Built-in commands registry
│   └── class-dash-api.php      # Developer API (filter orchestration)
├── assets/
│   ├── js/
│   │   ├── dash.js             # UI + client-side search + mode router
│   │   └── dash-admin.js       # Admin initialization
│   └── css/
│       └── dash.css            # Single stylesheet (CSS custom properties)
├── tests/
│   ├── phpunit/
│   └── js/
├── readme.txt                  # WordPress.org listing
└── uninstall.php               # Clean uninstall
```

---

## Next: BUILD Phase
- **Steve** → UI/UX: modal, keyboard nav, animations, CSS, accessibility, onboarding
- **Elon** → PHP backend: search index, AJAX handler, commands, settings, WP-CLI, developer API
- **Margaret** → QA from day one
- **Jensen** → Architecture review at 1-hour mark
- Feature branches. Haiku sub-agents for boilerplate. Self-review before PR.
- First commit: search index (everything else is UI on top of data).

---

*"The strength of the team is each individual member. The strength of each member is the team." — Phil Jackson*

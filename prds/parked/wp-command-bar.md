# PRD: WP Command Bar

## Overview
A WordPress plugin that adds a Cmd+K / Ctrl+K command palette to the WordPress admin. Think Spotlight for WordPress — instant search across posts, pages, users, settings, plugins, and custom actions.

## Problem
WordPress admin navigation is slow. Finding a specific post among thousands, jumping to a settings page, or activating a plugin requires multiple clicks through nested menus. Power users waste hours per week navigating.

## Solution
A keyboard-triggered command bar (Cmd+K) that provides:
- **Instant search** across all post types (posts, pages, CPTs)
- **Quick actions** — new post, clear cache, toggle maintenance mode, activate/deactivate plugins
- **Settings jump** — type "permalinks" and jump straight to that settings page
- **User search** — find and edit users by name/email
- **Recent items** — last 10 edited items for quick access
- **Custom commands** — developers can register their own commands via `wp_command_bar_register()`

## Target User
WordPress developers and power users who manage content-heavy sites (100+ posts, multiple plugins, custom post types).

## Technical Requirements
- **PHP 8.0+**, WordPress 6.0+
- **No external dependencies** — vanilla JS for the frontend, no React/Vue
- **REST API** for search (wp-json endpoints)
- **Keyboard shortcuts** — Cmd+K (Mac), Ctrl+K (Windows/Linux)
- **Fuzzy search** — typo-tolerant matching
- **Permission-aware** — only show items the current user can access
- **Extensible** — action/filter hooks for third-party integration
- **Performance** — results in <200ms, lazy-loaded assets

## UI/UX
- Modal overlay triggered by keyboard shortcut
- Search input with placeholder "Type a command..."
- Results grouped by category (Posts, Pages, Actions, Settings, Users)
- Arrow keys to navigate, Enter to select, Esc to close
- Dark mode support (respects WordPress admin color scheme)
- Subtle animations (fade in/out, result highlighting)

## MVP Scope
1. Command bar UI (modal, keyboard navigation)
2. Post/page search via REST API
3. Quick actions (new post, new page, view site, clear cache)
4. Settings page jump (all core settings pages)
5. Recent items
6. Developer API (`wp_command_bar_register()`)

## Out of Scope (v1)
- WooCommerce integration
- Multisite support
- Frontend command bar
- AI-powered suggestions

## Success Metrics
- <200ms search response time
- 0 JavaScript errors in console
- Works with default themes (Twenty Twenty-Four, Twenty Twenty-Five)
- Passes WordPress Plugin Check (PCP)
- Ready for wordpress.org submission

## Deliverables
- Working WordPress plugin (zip-ready)
- Unit tests (PHPUnit)
- JS tests
- README.md with installation instructions
- Screenshots for wordpress.org listing

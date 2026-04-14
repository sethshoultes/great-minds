# PRD: WP Deploy Guard

## Overview
A WordPress plugin that adds a pre-deployment checklist and rollback system to WordPress updates. Think "pre-flight checks" before every plugin update, theme change, or core upgrade.

## Problem
WordPress updates are the #1 cause of site breakage. Plugin conflicts, PHP version mismatches, and untested theme updates take down production sites every day. The current process is: click "Update" → pray. There is no pre-check, no automated rollback, and no staging comparison. Agencies managing 50+ client sites spend hours per week on update-related fires.

## Why Now
- WordPress 6.5+ has built-in rollback for failed plugin updates, but only for fatal errors — it doesn't catch visual regressions, broken forms, or performance degradation.
- The auto-update feature (enabled by default since WP 5.6) means updates happen without human oversight.
- Managed hosting providers (WP Engine, Kinsta) charge premium prices for staging environments. This should be free.

## Solution
A plugin that intercepts every update and runs a configurable checklist before applying it:

### Pre-Update Checks (Automated)
- **PHP compatibility scan** — Check if the new version requires a PHP version the host doesn't support
- **WordPress version compatibility** — Check plugin/theme "Requires at least" and "Tested up to" headers
- **Known conflicts** — Check against a community-maintained conflict database (plugin A + plugin B = broken)
- **File diff preview** — Show what files are changing before the update lands
- **Database migration detection** — Flag if the update includes schema changes (CREATE TABLE, ALTER TABLE in activation hooks)

### Post-Update Verification (Automated)
- **Health check** — Hit the homepage and 5 critical pages, check for HTTP 200 and expected content
- **PHP error scan** — Check `debug.log` for new errors/warnings that appeared after the update
- **Performance baseline** — Compare page load time before/after
- **Visual diff** — Screenshot key pages before and after, flag visual regressions

### Rollback (One-Click)
- **File rollback** — Restore the previous plugin/theme version from a local backup
- **Database rollback** — If schema changes were detected, revert them
- **Automatic rollback** — If post-update health checks fail, auto-rollback and notify the admin

## Target User
WordPress agencies managing 10+ client sites, and solo developers who manage their own production sites. Anyone who has lost a Saturday to a broken auto-update.

## Technical Requirements
- **PHP 8.0+**, WordPress 6.0+
- **No external dependencies** — All checks run locally
- **Hooks into WP's update system** — `upgrader_pre_install`, `upgrader_post_install`, `auto_update_plugin` filters
- **WP-CLI support** — `wp deploy-guard check`, `wp deploy-guard rollback`, `wp deploy-guard status`
- **REST API** — For agency dashboards managing multiple sites
- **Background processing** — Health checks run asynchronously to avoid blocking the admin

## MVP Scope (v1)
1. Pre-update PHP/WP version compatibility check
2. Pre-update file diff preview
3. Post-update health check (HTTP status + error log scan)
4. One-click rollback to previous plugin version
5. Automatic rollback on fatal error
6. WP-CLI commands
7. Email notification on failed update

## Out of Scope (v1)
- Visual regression testing (requires headless browser — v2)
- Conflict database (requires community infrastructure — v2)
- Database rollback (complex, risky — v2)
- Performance comparison (requires baseline measurement system — v2)
- Multi-site management dashboard (v2)
- Staging environment creation (v3)

## Success Metrics
- <5 second overhead on update process for pre-checks
- Zero false positives on PHP compatibility (no blocking legitimate updates)
- 100% rollback success rate for plugin file rollbacks
- Works with WP Engine, Kinsta, Flywheel, SiteGround, shared hosting

## Competitive Landscape
- **ManageWP / MainWP** — Agency dashboards with safe update features, but require external service and subscription
- **BlogVault** — Backup + staging, but heavy and $$$
- **WP Rollback** — File rollback only, no pre-checks or automation
- **Health Check & Troubleshooting** — WordPress.org plugin, diagnostic only, no update integration

**Gap:** No free, self-contained plugin does pre-check + post-verify + auto-rollback as a single workflow integrated into WordPress's native update UI.

## Deliverables
- Working WordPress plugin (zip-ready)
- PHPUnit test suite
- WP-CLI commands
- README.md with usage documentation
- Screenshots for wordpress.org listing

## Why This Wins
The WordPress ecosystem has 60,000+ plugins. Updates are unavoidable. Every site owner has been burned. "Press update with confidence" is a message that sells itself. The distribution strategy is identical to Dash: wordpress.org free plugin with eventual freemium for agency features (multi-site dashboard, visual regression).

The moat: once a user trusts Deploy Guard with their update workflow, switching costs are high. You don't change your safety system.

# Round 1 Review: WP Deploy Guard

**Reviewer:** Elon Musk — Chief Product & Growth Officer

---

## Architecture: Strip It to the Bone

The simplest system that works is **three hooks and a zip file**:
1. `upgrader_pre_install` — Check PHP/WP version headers. If mismatch, abort. 50 lines of code.
2. Before update — Copy plugin folder to `/wp-content/deploy-guard-backups/{plugin}-{timestamp}/`. That's your rollback. No database, no fancy storage abstraction.
3. `upgrader_post_install` — Hit homepage with `wp_remote_get()`. Check for 200 and no fatal. If fail, restore backup folder.

That's it. The "file diff preview" is nice-to-have theater — users won't read it. Cut it. The REST API for "agency dashboards" is scope creep — that's a v2 SaaS play, not a v1 plugin.

## Performance: The 5-Second Requirement Is Generous

The bottlenecks are obvious:
- **File copying** — A 50MB plugin backup on shared hosting could take 10+ seconds. Solution: Use `ZipArchive` or shell `zip` — compressed backups are 5x faster to write.
- **HTTP health checks** — "Hit homepage + 5 critical pages" = 6 HTTP requests. On a slow host, that's 3-6 seconds. Solution: v1 checks homepage ONLY. Let users configure additional URLs in v2.
- **Debug.log scanning** — Parsing a 100MB log file is a trap. Solution: Capture `debug.log` file size before update. Only parse lines added AFTER. Use `fseek()`.

10x path: Async everything with `wp_schedule_single_event()`. Return immediately, email results.

## Distribution: 10,000 Users Without Ads

WordPress.org is the distribution. The plugin directory is Google for 40% of all websites. Here's the math:
- Plugin listed → appears in WP admin "Add Plugins" search
- Target keywords: "safe updates", "rollback", "update protection"
- First 1,000 installs come from cold search + README copy that hits pain points

Growth loop: Every auto-rollback triggers an email. Email says "Deploy Guard just saved your site from [plugin name] breaking your homepage." That's a shareable story. Add a tweet button. Agencies will talk.

## What to CUT

**Scope creep in v1:**
- "File diff preview" — Nobody reads diffs. They want green checkmarks. Kill it.
- "Database migration detection" — You can't reliably detect schema changes without executing the update. Also, you said DB rollback is v2. So why detect what you can't fix?
- "REST API" — For what? v1 is single-site. API is overhead.
- "Background processing for health checks" — Premature optimization. Blocking is fine for a 2-second check.

**v2 features masquerading as v1:**
- "Email notification on failed update" — Actually, keep this. It's trivial (`wp_mail`) and critical for trust.
- "WP-CLI commands" — Keep `wp deploy-guard rollback`. Cut the rest. Agencies using CLI can wait for v2.

Leaner v1: Pre-check → Backup → Update → Health check → Auto-rollback if broken. Four features, not seven.

## Technical Feasibility: One Agent Session?

**Yes**, but only if you cut the fat above. Here's the build:
- Core plugin scaffold: 1 hour
- Upgrader hooks + version checking: 2 hours
- Backup/restore logic: 2 hours
- Homepage health check: 1 hour
- Admin UI (simple settings + status): 2 hours
- PHPUnit tests: 2 hours

That's 10 hours of focused work. One long session? Possible. Two sessions? Comfortable.

The risk: Testing across hosts (WP Engine, shared hosting, etc.) requires real environments. You can write the code in one session, but validation takes longer.

## Scaling: What Breaks at 100x

At 100x usage (1M+ installs):
- **Backup storage** — Users will fill disks. You MUST auto-prune old backups. Default: keep last 3 versions per plugin.
- **Support load** — "Deploy Guard blocked my update but I wanted it" tickets. Solution: Clear UI explaining WHY it blocked, with override button.
- **Edge cases** — MU-plugins, symlinked plugins, weird host configurations. You'll discover these at scale. Build in error reporting (opt-in telemetry).

The conflict database mentioned in v2 is the real scaling challenge — that's a community-maintained service, not a plugin feature. Don't let v2 ambitions bloat v1.

---

**Bottom line:** This is a good idea with 40% feature bloat. Cut to the core loop: backup → update → verify → rollback. Ship that in a week. Everything else is earned with traction.

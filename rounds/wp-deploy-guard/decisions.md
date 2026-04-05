# Preflight — Locked Decisions

*Consolidated by Phil Jackson, The Zen Master*

The debate is over. The minds have spoken. This document is law for the build phase.

---

## Decision Log

### Decision 1: Product Name
**Winner:** Steve Jobs
**Final Name:** **Preflight**
**Proposed by:** Steve (Round 1)
**Elon's Position:** Concerned about WordPress.org search discoverability — users search "rollback plugin" not "preflight"
**Resolution:** Steve wins on brand. Elon's concern is addressed through README SEO — the keywords "rollback," "safe updates," "update protection" live in the description, not the name. The name creates identity; the copy creates discovery.

---

### Decision 2: Health Check Scope
**Winner:** Elon Musk
**Final Scope:** Homepage-only (HTTP 200 + no fatal error)
**Proposed by:** Elon (Round 1, locked Round 2)
**Steve's Position:** WooCommerce users need checkout verification; 3-5 critical URLs adds only 2 seconds
**Resolution:** Elon wins. Steve's right about WooCommerce — but he's solving a v2 problem. Homepage health check is the 80% solution that ships this week. Configurable critical URLs are earned with traction. The architecture must allow future expansion, but v1 ships lean.

---

### Decision 3: Backup Implementation
**Winner:** Elon Musk
**Final Approach:** ZipArchive compression, auto-prune to last 3 versions per plugin
**Proposed by:** Elon (Round 1)
**Steve's Position:** No objection — conceded in Round 2
**Resolution:** Unanimous. File-by-file copying is too slow on shared hosting. Compressed backups write 5x faster. Auto-pruning prevents disk bloat that kills the plugin's reputation on 500MB shared hosts.

---

### Decision 4: File Diff Preview
**Winner:** Split Decision
**Final Scope:** Show file count changed (e.g., "47 files modified"), but NO full diff viewer
**Steve's Position:** Power users want to see what's changing; builds trust
**Elon's Position:** Nobody reads diffs; it's feature bloat
**Resolution:** Compromise. Steve's right that *knowing you could* see changes builds trust. Elon's right that a full diff viewer is scope creep. The solution: surface the count ("This update modifies 47 files") as a confidence signal. No inline diff viewer in v1.

---

### Decision 5: UI Philosophy
**Winner:** Steve Jobs (with constraints)
**Final Approach:** Calm, confident, minimal — but no animation polish in v1
**Steve's Position:** Trust requires visual confidence; the UI *is* the feature
**Elon's Position:** CSS animations are 3 hours of work that change zero outcomes
**Resolution:** Steve's *principles* win. Elon's *timeline* wins. Brand voice is calm and direct. Error messages are human, not technical. But the "elegant sliding panel" ships as a simple overlay. Polish is v1.1 — when 10,000 users prove the core works.

---

### Decision 6: Monetization Guardrails
**Winner:** Unanimous
**Final Policy:** Rollback is NEVER paywalled
**Proposed by:** Both (Steve Round 1, Elon agreed Round 2)
**Resolution:** The core safety net — pre-check, backup, health check, auto-rollback — is free forever. Future monetization targets agency features: multi-site dashboards, scheduled updates, analytics, conflict database. Safety is not a premium feature.

---

### Decision 7: External Dependencies
**Winner:** Elon Musk
**Final Policy:** Vanilla PHP + Vanilla JS only. No React, no build step, no Composer.
**Proposed by:** Elon (Round 2)
**Steve's Position:** Implicit agreement (never proposed otherwise)
**Resolution:** The entire codebase must be readable in 30 minutes. WordPress.org reviewers reject JavaScript bloat. PHP 7.4 compatibility is mandatory. This constraint serves both simplicity and distribution.

---

### Decision 8: Onboarding Experience
**Winner:** Steve Jobs
**Final Policy:** Zero friction — Install, Activate, Protected
**Proposed by:** Steve (Round 1, locked Round 2)
**Elon's Position:** No objection
**Resolution:** No account creation. No welcome wizard. No email capture. No configuration required. The product works immediately upon activation. First impressions are permanent.

---

### Decision 9: Settings Philosophy
**Winner:** Split Decision
**Final Policy:** One setting only — timeout duration
**Steve's Position:** "Every setting is a failure of design"
**Elon's Position:** Different hosts need different timeouts; ignoring reality isn't minimalism
**Resolution:** Elon wins the argument. Steve wins the execution. One advanced setting (timeout) exists, but it's hidden in a "Technical" accordion — 95% of users never see it. Sensible defaults ship configured.

---

### Decision 10: Growth Strategy
**Winner:** Elon Musk (with refinement)
**Final Approach:** WordPress.org SEO + organic word-of-mouth, NO "tweet this" prompts
**Elon's Position:** Auto-rollback triggers shareable story; add tweet button
**Steve's Position:** "Tweet this" is desperation marketing; products that earn love don't beg for shares
**Resolution:** Steve's critique lands. The rollback success email exists (it's critical for trust), but no embedded social prompts. If users share, they share because they want to. The README carries the SEO weight: "safe updates," "rollback," "update protection."

---

## MVP Feature Set (v1 Ships This)

### Core Loop
1. **Pre-flight Check** — Verify PHP/WP version compatibility before update proceeds
2. **Automated Backup** — ZipArchive plugin folder to `/wp-content/preflight-backups/{plugin}-{timestamp}.zip`
3. **Update Execution** — Standard WordPress upgrader (we hook, not replace)
4. **Health Verification** — `wp_remote_get()` homepage; check for HTTP 200 + no fatal
5. **Auto-Rollback** — If health check fails, restore backup immediately
6. **Rollback Notification** — `wp_mail()` to admin: "Preflight blocked [plugin] from breaking your site"

### User Interface
- Simple status panel in plugin update screen
- Three states: Checking / Safe to Update / Update Blocked
- File count indicator ("This update modifies X files")
- One-click manual rollback button
- Clear, calm messaging (no jargon, no warnings in ALL CAPS)

### Administrative
- Auto-prune: Keep last 3 backups per plugin
- One hidden setting: Health check timeout (default: 5 seconds)
- WP-CLI: `wp preflight rollback {plugin}` (one command only)

---

## File Structure (What Gets Built)

```
preflight/
├── preflight.php                 # Main plugin file, hooks registration
├── readme.txt                    # WordPress.org readme (SEO keywords here)
├── assets/
│   └── icon-256x256.png          # Plugin directory icon
├── includes/
│   ├── class-preflight-core.php       # Main orchestration class
│   ├── class-preflight-backup.php     # ZipArchive backup/restore logic
│   ├── class-preflight-checker.php    # Pre-update compatibility checks
│   ├── class-preflight-health.php     # Homepage health verification
│   ├── class-preflight-rollback.php   # Rollback execution
│   └── class-preflight-admin.php      # Admin UI rendering
├── admin/
│   ├── css/
│   │   └── preflight-admin.css        # Minimal, calm styling
│   └── js/
│       └── preflight-admin.js         # Vanilla JS, update screen integration
├── cli/
│   └── class-preflight-cli.php        # WP-CLI rollback command
└── tests/
    └── test-preflight.php             # PHPUnit tests
```

**Backup Storage Location:** `/wp-content/preflight-backups/`

---

## Open Questions (Needs Resolution Before Build)

### 1. Debug Log Parsing Strategy
Elon proposed capturing `debug.log` size before update and parsing only new lines with `fseek()`. Implementation details unclear:
- What constitutes a "fatal" in the log?
- Do we parse only PHP Fatal/Parse errors, or also Warnings?
- What if `WP_DEBUG` is disabled (no log exists)?

**Recommended Resolution:** Check for fatal errors via health check response only. Log parsing is v2.

### 2. Theme Update Support
All debate focused on plugin updates. Do we also protect theme updates?
- Same backup/restore logic applies
- Hooks exist: `upgrader_pre_install` works for themes too
- Risk: Theme customizations often live in child themes

**Recommended Resolution:** Scope v1 to plugins only. Theme support is architecturally identical but doubles testing surface.

### 3. Multi-Plugin Update Handling
WordPress allows "Update All Plugins." How does Preflight behave?
- Option A: Block batch updates, force one-at-a-time
- Option B: Queue sequential backup/check/update cycles
- Option C: Backup all, update all, check once, rollback all if failure

**Recommended Resolution:** Option B — sequential processing. One bad plugin shouldn't rollback three good ones.

### 4. Auto-Update Integration
WordPress core now supports auto-updates for plugins. Does Preflight intercept these?
- Auto-updates run via cron, no admin present
- Rollback email becomes critical (no one watching)
- Risk: Silent failures at 3am

**Recommended Resolution:** Yes, intercept auto-updates. This is the highest-anxiety use case — the overnight update that breaks everything. Preflight's value is maximized here.

### 5. PHP Version Detection Method
How do we detect PHP version requirements from a plugin before installing?
- readme.txt `Requires PHP` header exists but isn't always accurate
- Plugin file header `Requires PHP` is authoritative
- Problem: We need to read the *new* version's headers before extracting

**Recommended Resolution:** Parse plugin headers from the update package during `upgrader_pre_install`. WordPress core already extracts this; we hook into it.

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Backup fails silently** | Medium | Critical | Verify zip creation succeeded before allowing update to proceed; fail-safe to blocking |
| **Health check false positive** | Medium | High | Homepage might 200 but critical functionality broken (WooCommerce checkout, login, etc.) — v1 accepts this risk; v2 adds critical URL config |
| **Health check timeout on slow hosts** | High | Medium | Default 5s timeout; exposed setting for adjustment; document in FAQ |
| **Disk space exhaustion** | Medium | High | Auto-prune to 3 backups; check available space before backup; warn if < 50MB free |
| **WordPress.org rejection** | Low | Critical | No external API calls, no premium upsells in free version, no JavaScript bloat, GPL-compatible |
| **MU-Plugin / Symlink edge cases** | Medium | Medium | Document unsupported configurations; detect and warn, don't attempt backup |
| **Race condition on Update All** | Medium | Medium | Sequential processing with mutex lock; no parallel updates |
| **Host kills long-running process** | Medium | High | Fast-path everything; timeout limits; consider async with `wp_schedule_single_event()` for v1.1 |
| **Rollback restores incompatible old version** | Low | High | After rollback, verify site still healthy; if not, surface "manual intervention required" |
| **User overrides block, update breaks site** | Medium | Low | Their choice; log the override; don't rollback overridden updates unless requested |

---

## Build Guidance

**Estimated Effort:** 10-12 hours focused work (per Elon's assessment)

**Priority Order:**
1. Backup/restore logic (the safety net must work first)
2. Upgrader hooks integration
3. Health check implementation
4. Admin UI
5. WP-CLI command
6. Tests

**Ship Criteria:**
- Backup creates valid, restorable zip
- Health check correctly identifies 200 vs failure
- Auto-rollback restores previous state within 30 seconds
- Admin UI shows clear status
- Zero JavaScript errors in console
- Works on PHP 7.4, 8.0, 8.1, 8.2

**Polish Later (v1.1):**
- Smoother UI animations
- Configurable critical URLs
- Theme support
- Detailed logging/history view

---

*"The strength of the team is each individual member. The strength of each member is the team."*

*Steve brought the soul. Elon brought the skeleton. Now we build.*

— Phil Jackson

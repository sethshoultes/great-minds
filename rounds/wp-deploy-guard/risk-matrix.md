# PREFLIGHT PLUGIN — RISK MATRIX & DECISION FRAMEWORK

**Purpose:** Visual risk assessment and mitigation prioritization
**Audience:** Project leadership & technical team
**Date:** 2026-04-05

---

## RISK HEAT MAP (2×2 Matrix)

```
                    IMPACT
           Low         Medium        High        Critical
        ├──────────┼──────────┼──────────┼──────────┐
        │          │          │          │          │
   H    │          │ #7       │ #4       │ #1       │  8.0-9.5 Risk
   I    │          │ Host     │ Health   │ Backup   │  IMMEDIATE
   G    │          │ Kills    │ Timeout  │ Failure  │  ACTION
   H    │          │ Process  │          │          │
        │          │ (5.0)    │ (6.0)    │ (8.0)    │
        ├──────────┼──────────┼──────────┼──────────┤
        │          │          │          │          │
   M    │ #11      │ #8       │ #2       │ #5       │  5.0-7.5 Risk
   E    │ User     │ MU-Plugin│ False    │ WP.org   │  PLAN
   D    │ Override │ Edge     │ Positive │ Rejection│  MITIGATION
   I    │ (3.0)    │ Cases    │ (7.5)    │ (5.0)    │
   U    │          │ (5.0)    │          │          │
   M    │          │          │          │          │
        ├──────────┼──────────┼──────────┼──────────┤
        │          │          │          │          │
   L    │          │ #9       │ #6       │ #10      │  3.0-4.5 Risk
   O    │          │ Rollback │ Disk     │ Old Ver  │  MONITOR
   W    │          │ Reverts  │ Space    │ Incompat │
        │          │ Old (3.0)│ (5.5)    │ (4.0)    │
        │          │          │          │          │
        └──────────┴──────────┴──────────┴──────────┘
        Low        Medium       High      Critical
              LIKELIHOOD
```

---

## RISK REGISTER (Detailed Matrix)

| # | Risk | Likelihood | Impact | Score | Status | Owner | Mitigation | Timeline |
|---|------|-----------|--------|-------|--------|-------|-----------|----------|
| **1** | **Backup Silent Failure** | HIGH (60%) | CRITICAL | **8.0** | 🔴 CRITICAL | Core | Fail-safe design, disk checks, verify restore | 2-3 hrs |
| **2** | **Health Check False Positive** | MED (55%) | HIGH | **7.5** | 🔴 CRITICAL | Health | Expand scope (login page), fatal detection | 2-3 hrs |
| **3** | **Race Condition (Update All)** | MED (60%) | HIGH | **6.5** | 🟠 HIGH | Core | Mutex locking, sequential processing | 1-2 hrs |
| **4** | **Health Check Timeout** | HIGH (70%) | HIGH | **6.0** | 🟠 HIGH | Health | Config timeout, distinguish timeout vs failure | 1-2 hrs |
| **5** | **WordPress.org Rejection** | LOW (20%) | CRITICAL | **5.0** | 🟠 HIGH | All | PHPCS audit, security review, code quality | 2-3 hrs |
| **6** | **Disk Space Exhaustion** | MED (50%) | HIGH | **5.5** | 🟡 MEDIUM | Backup | Smart pruning, space warnings | 1 hr |
| **7** | **Host Kills Process** | MED (45%) | HIGH | **5.0** | 🟡 MEDIUM | Core | Execution timeout, async v1.1 | 1-2 hrs |
| **8** | **MU-Plugin Edge Cases** | MED (40%) | MEDIUM | **5.0** | 🟡 MEDIUM | Check | Detection, graceful failure, docs | 1 hr |
| **9** | **Rollback Reverts Old Version** | LOW (30%) | MEDIUM | **3.0** | 🟢 LOW | Backup | Post-rollback health check | 0.5 hr |
| **10** | **Old Version Incompatible** | LOW (20%) | CRITICAL | **4.0** | 🟢 LOW | Check | Document limitation, manual intervention | 0.5 hr |
| **11** | **User Overrides Block** | MED (50%) | LOW | **3.0** | 🟢 LOW | Admin | Log override, don't auto-rollback | 0.5 hr |

### Risk Score Formula
```
Score = (Likelihood % / 100) × Impact (1-10)
```

**Score Interpretation:**
- 7.0+ = CRITICAL (immediate action required)
- 5.0-6.9 = HIGH (plan mitigation before build)
- 3.0-4.9 = MEDIUM (implement safeguards during build)
- <3.0 = LOW (monitor, document)

---

## EFFORT vs IMPACT ANALYSIS

```
High Impact
    │
    │  1. Backup Failure      2. False Positive     5. WP.org
    │  (critical, 3h)         (critical, 3h)        Rejection
    │         ●               ●                      (critical, 3h)
    │                                      ●
    │
    │  4. Timeout  3. Race
    │  (5.0, 2h)  Condition
    │    ●        ●(6h would  6. Disk
    │             exceed     (5.5, 1h)
    │            if async)    ●
    │
    │
Low Impact
    └─────────────────────────────────────────
      Low Effort         High Effort
      (<2 hrs)           (2-3+ hrs)
```

---

## MITIGATION EXECUTION ROADMAP

### PHASE 1: CRITICAL RISKS (Must Do Before Code)
**Duration:** 2-3 hours pre-work

1. ✅ **Backup Failure** — Fail-safe architecture
   - [ ] Design backup verification flow
   - [ ] Plan error handling strategy
   - [ ] Create test backup files (small, medium, large)
   - **Owner:** Core team
   - **Checkpoint:** Pass test: "Backup fails → update blocks"

2. ✅ **Health Check False Positive** — Scope expansion
   - [ ] Add login page check to health check
   - [ ] Implement fatal error detection
   - [ ] Plan database connectivity check
   - **Owner:** Health team
   - **Checkpoint:** Pass test: "Fatal error → rollback triggered"

3. ✅ **WordPress.org Rejection** — Pre-flight audit
   - [ ] Set up PHPCS with WordPress ruleset
   - [ ] Create security checklist
   - [ ] Establish code review process
   - **Owner:** All (continuous)
   - **Checkpoint:** PHPCS run before every submission

---

### PHASE 2: HIGH RISKS (Handle During Build)
**Duration:** 1-2 hours per risk

4. ✅ **Race Condition** — Mutex implementation
   - [ ] Code transient-based lock in Core
   - [ ] Test with "Update All" (5+ plugins)
   - [ ] Verify sequential execution
   - **Owner:** Core team
   - **Checkpoint:** Pass test: "Bulk update queues properly"

5. ✅ **Health Check Timeout** — Configuration
   - [ ] Add timeout setting to admin
   - [ ] Implement timeout exception handling
   - [ ] Test on slow hosts (stress test)
   - **Owner:** Health team
   - **Checkpoint:** Pass test: "Timeout doesn't trigger rollback"

---

### PHASE 3: MEDIUM RISKS (Implement with Safeguards)
**Duration:** 0.5-1 hour per risk

6. ✅ **Disk Space Exhaustion** — Smart pruning
   - [ ] Implement disk space check
   - [ ] Code auto-pruning logic
   - [ ] Test on 256MB storage host
   - **Owner:** Backup team
   - **Checkpoint:** Pass test: "Disk full → prune + warn"

7. ✅ **Host Kills Process** — Timeout management
   - [ ] Profile backup times on shared hosting
   - [ ] Set PHP execution timeout
   - [ ] Document if >30s needed (v1.1 requirement)
   - **Owner:** Core team
   - **Checkpoint:** Profile shows <20 second backup time

8. ✅ **MU-Plugin Edge Cases** — Detection
   - [ ] Code MU-plugin detection
   - [ ] Code symlink detection
   - [ ] Display clear warnings
   - **Owner:** Checker team
   - **Checkpoint:** Pass test: "MU-plugin → skip backup + warn"

---

### PHASE 4: VALIDATION (Final 2-3 hours)
**Duration:** 2-3 hours

9. ✅ **Cross-Host Testing**
   - [ ] Shared hosting (GoDaddy, Bluehost)
   - [ ] Managed hosting (WP Engine, Kinsta)
   - [ ] VPS (Linode, DigitalOcean)
   - **Checkpoint:** All hosts pass core flow

10. ✅ **PHP Version Testing**
    - [ ] PHP 7.4
    - [ ] PHP 8.0
    - [ ] PHP 8.1
    - [ ] PHP 8.2
    - **Checkpoint:** All versions pass tests

11. ✅ **WordPress.org Compliance**
    - [ ] PHPCS check (zero errors)
    - [ ] Security audit
    - [ ] Plugin header validation
    - [ ] README review
    - **Checkpoint:** Ready for submission

---

## DECISION FRAMEWORK

### When to Block Build
Stop work immediately if:
- ✋ ZipArchive fails on shared hosting (can't backup)
- ✋ WordPress upgrader hooks don't fire for auto-updates (can't intercept)
- ✋ Memory exhaustion prevents backup of large plugins (core functionality broken)

### When to Defer to v1.1
Plan for later sprint:
- Configurable critical URLs (health check expansion)
- Async background processing (non-blocking updates)
- Database rollback (schema migration support)
- Theme protection
- Multi-site dashboard

### When to Accept as Limitation
Document in README:
- Symlinked plugins not supported
- MU-plugins not supported
- Rollback limited to file-level (not database)
- Auto-updates only if hooks fire in cron

### When to Implement Mitigation
Do during build:
- Fail-safe backup (don't proceed if backup fails)
- Health check expansion (homepage + login)
- Mutex locking (sequential updates)
- Disk space warnings
- Timeout configuration

---

## SUCCESS CRITERIA

### Build Phase Success Checklist

**Core Functionality (Must Pass)**
- [ ] Backup creates valid, restorable .zip file
- [ ] Health check correctly identifies 200 vs failure
- [ ] Auto-rollback restores previous state in <30 seconds
- [ ] Admin UI displays status clearly
- [ ] WP-CLI rollback command works

**Compatibility (Must Pass)**
- [ ] Works on PHP 7.4
- [ ] Works on PHP 8.0
- [ ] Works on PHP 8.1
- [ ] Works on PHP 8.2
- [ ] Works on shared hosting

**Quality (Must Pass)**
- [ ] Zero PHPCS errors (WordPress ruleset)
- [ ] Zero security issues (nonce, sanitize, escape)
- [ ] Zero JavaScript console errors
- [ ] Zero SQL injection vulnerabilities
- [ ] Zero XSS vulnerabilities

**WordPress.org (Must Pass)**
- [ ] Plugin header complete
- [ ] README.txt follows template
- [ ] GPL v2 license included
- [ ] No external API calls
- [ ] No Composer, npm, or build step

---

## RISK ACCEPTANCE STATEMENT

The Preflight plugin accepts these residual risks in v1:

1. **Health check may miss broken functionality** beyond homepage + login
   - Accepted: Documented in README as "Not recommended for complex custom sites"
   - Mitigation: v2 adds configurable critical URL checks

2. **Large plugins (100MB+) may timeout** on slow hosts
   - Accepted: Documented in README with timeout configuration
   - Mitigation: v1.1 implements async background processing

3. **WordPress.org may reject for unforeseen reasons**
   - Accepted: Rare (5-10%) if code quality is maintained
   - Mitigation: Pre-submission PHPCS + security audit

4. **Auto-update interception may not work** on all hosting configurations
   - Accepted: Falls back to manual rollback via admin UI
   - Mitigation: Document which WordPress versions supported

---

## RISK COMMUNICATION TEMPLATE

### For Users (Documentation)
"Preflight protects your site by creating automatic backups before updates and rolling back if critical errors are detected.

**What it protects:** Plugin incompatibility, fatal errors, missing dependencies.

**What it doesn't protect:** Database schema changes, custom functionality breaking, checkout flows on WooCommerce (use Settings to add critical URLs).

**Limitations:** Rollback is file-level only (not database). For sites with critical customizations, we recommend testing updates on staging first."

### For WordPress.org (Pre-submission)
"This plugin:
- Creates encrypted backups using PHP ZipArchive
- Runs homepage + login page health checks
- Auto-rolls back if fatal errors detected
- Sends admin email notifications
- Provides manual rollback via WP-CLI

Does not:
- Call external APIs
- Require accounts or subscriptions
- Use React, Vue, or build tools
- Track user data
- Modify database schema"

### For Developers (Internal)
"Build order: Backup → Upgrader hooks → Health check → Auto-rollback → Admin UI → WP-CLI. Test on shared hosting before declaring done. Priority: (1) backup reliability, (2) false positive prevention, (3) update all queueing."

---

## RISK MONITORING DURING BUILD

### Daily Standup Questions
1. "Did backup succeed on shared hosting today?"
2. "Any unexpected errors in health check testing?"
3. "Race condition test still passing with Update All?"
4. "PHPCS clean? Any new warnings?"

### Weekly Checkpoint
- Review test results against risk matrix
- Update risk scores based on findings
- Adjust mitigation timelines if needed
- Escalate blockers immediately

### Pre-Submission Gate
- [ ] All 8 critical/high risks mitigated
- [ ] All tests passing across 4 PHP versions
- [ ] PHPCS clean with zero errors
- [ ] Security audit complete
- [ ] Cross-host testing finished
- [ ] README SEO keywords present

---

## CONCLUSION

The Preflight plugin is **technically achievable** with proper risk management. The 8 identified risks are manageable with focused mitigation during the build phase.

**Key Success Factor:** Early testing on actual shared hosting. Find issues during hours 1-3, not hours 9-12.

**Timeline:** 10-12 hours focused work + 2-4 hours validation = 14-16 hours total.

**Next Step:** Approve risk mitigation plan and begin Phase 1 (backup architecture).

---

*Risk Assessment Report*
*Preflight WordPress Plugin*
*Prepared: 2026-04-05*
*Confidence: HIGH*

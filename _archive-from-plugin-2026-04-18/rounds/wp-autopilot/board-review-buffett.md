# Board Review: WP Autopilot
**Reviewer:** Warren Buffett
**Date:** 2026-04-16
**Status:** Ready for Build (4/5 board approval)

---

## SCORE: 4/10
**Justification:** Hobby project disguised as business — no revenue plan worth discussing.

---

## Unit Economics

**Cost to acquire:**
- Zero. WordPress.org distribution. Organic only.
- Assumes viral growth materializes. Assumes.

**Cost to serve:**
- User supplies own API key. Clever duck. Zero infrastructure cost.
- Support burden scales with installs. No plan for support beyond "forum posts."
- As scale increases, founder drowns in bug reports and feature requests.

**Lifetime value:**
- Free plugin. No revenue. LTV = $0.
- "Future monetization" mentioned nowhere in PRD.

**Verdict:**
- Perfect unit economics if you ignore the missing revenue line.
- Like selling dollar bills for ninety cents — sustainable until it isn't.

---

## Revenue Model

**What they're charging:**
- Nothing. Free forever.

**What they could charge:**
- Premium tier with pooled API keys: $19/month.
- Agency license for client sites: $99/month.
- White-label option: $249/month.

**Why they won't:**
- PRD silent on monetization.
- "Build it and they'll come" mentality.
- No mention of freemium, upgrades, nothing.

**Verdict:**
- This is a portfolio piece, not a business.
- Needs revenue model before calling it a company.

---

## Competitive Moat

**What stops copycats:**
- First-mover advantage in WordPress AI chat space.
- WordPress.org directory placement.
- Open source (GPL v2) — ironic moat. Forces copycats to also be free.

**What doesn't:**
- Core tech is commodity. API wrapper around Claude.
- No proprietary data. No network effects.
- Code is open source. Anyone can fork tomorrow.

**Time to clone:**
- Competent developer? One weekend.
- PRD even provides implementation roadmap.

**Verdict:**
- Moat width: puddle depth.
- Defensibility relies on brand and distribution, not technology.
- WordPress.org directory placement matters more than code quality.

---

## Capital Efficiency

**What they're spending:**
- 7-8 days developer time (~50 hours).
- At $100/hr loaded cost: $5,000 development budget.
- Zero marketing budget planned.
- Zero hosting costs (user-provided keys).

**What they're getting:**
- WordPress plugin with 600 lines of PHP/JS.
- Distribution channel (WordPress.org).
- Potential user base (45% of web runs WordPress).

**Burn rate:**
- Development only. No recurring costs post-launch.
- Support burden unquantified — could be 10 hours/month or 100.

**ROI timeline:**
- Unknown. No revenue = no return.
- If pivot to paid model later, 12-18 months to profitability.

**Verdict:**
- Efficient use of development capital.
- Smart architectural choices (Alpine.js not React, transients not custom tables).
- But efficiency doesn't matter without revenue plan.
- Building a Honda Civic when you need a dump truck.

---

## What I'd Fix

**Immediate (before build):**
1. **Add freemium revenue model**
   - Free tier: User-provided API key, 100 actions/month limit.
   - Pro tier: $19/month, pooled API key, unlimited actions, priority support.
   - Agency tier: $99/month, 10 client sites, white-label option.

2. **Quantify support burden**
   - Allocate 20 hours/month for first 1,000 installs.
   - Build self-service docs aggressively.
   - Auto-responses for 80% of support tickets.

3. **Plan for scale**
   - What happens at 10K installs? 100K?
   - Support team size projections.
   - Revenue required to sustain operations.

**Long-term (after validation):**
1. **Build network effects**
   - Template marketplace (users share page templates).
   - Plugin action library (community-contributed actions).
   - Data moat: Learn from usage patterns, improve suggestions.

2. **Expand TAM**
   - WooCommerce integration (ecommerce vertical).
   - Membership site integration (course creators).
   - Multi-site support (agencies managing client portfolios).

3. **Consider exit paths**
   - Acquisition target for Automattic (WordPress.com parent).
   - Acquisition target for WP Engine, Flywheel, other managed WordPress hosts.
   - Standalone SaaS if pivot away from WordPress.org distribution.

---

## The Uncomfortable Truth

This plugin solves a real problem. WordPress is complex. AI chat simplifies it. Execution looks solid — security practices, no hallucinated APIs, clean architecture.

But solving problems doesn't build businesses. Revenue builds businesses.

Free WordPress plugin = marketing expense, not product.

Either charge for value or explain why you're giving away $5K of development work.

If answer is "learn and iterate," fine. Call it a learning project.

If answer is "change WordPress forever," need revenue model yesterday.

---

## Bottom Line

Build quality: 8/10. Clean code, smart architecture, thoughtful security.

Business model: 1/10. Free product with no monetization path.

**Combined score: 4/10.**

Would I invest? No. Not until revenue model exists.

Would I use it? Probably. Solves my WordPress frustration.

Would I build it? Only as loss leader for consulting business.

---

**Recommendation:** Either add revenue model or accept this as marketing expense. Don't confuse the two.

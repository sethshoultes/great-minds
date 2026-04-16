# IMPROVE Cycle Summary — 2026-04-16
**Orchestrator:** Phil Jackson
**Board Members:** Jensen Huang, Oprah Winfrey, Warren Buffett, Shonda Rhimes
**Products Reviewed:** LocalGenius, Dash, Pinned, Great Minds Plugin, Shipyard AI

---

## Executive Synthesis

The board has spoken. Four distinct perspectives — moats, experience, economics, retention — and they converge on a single diagnosis:

**You're building excellent standalone products but not a portfolio business.**

The symptoms show up differently in each review:
- **Jensen** sees missing data moats and no compounding advantages
- **Oprah** sees first-time users bouncing because nobody meets them where they are
- **Warren** sees three products with no revenue model and one actual business
- **Shonda** sees no hooks bringing people back — no cliffhangers, no next episode

But the disease is the same: **tactical excellence without strategic coherence.**

---

## Top 3 Improvements Ranked by Impact

### #1: LocalGenius Revenue & Onboarding Overhaul
**Impact Score:** 9.5/10
**Board Consensus:** Unanimous

**The Problem:**
LocalGenius has the clearest commercial potential but hides its pricing, lacks social proof, and doesn't tell users what success looks like. It's a business that doesn't act like a business.

**What Success Looks Like:**
- Transparent pricing on the landing page
- 3-5 video testimonials from real restaurant owners
- 60-second product tour showing the dashboard in action
- Clear ROI messaging: "Restaurants using LocalGenius see 40% more reviews and 25% more social engagement"
- 10 paying customers in 30 days (to validate pricing)

**Board Member Citations:**
- *Buffett:* "Launch a pricing page this week. A wrong price you can fix is better than a hidden price that tells you nothing."
- *Oprah:* "If you're not sure what to charge, that's a sign you're not sure what the value is."
- *Jensen:* "Every customer's performance data should make the AI smarter for everyone. That's the data moat you're not building."
- *Shonda:* "Create a 'marketing IQ' score that increases as the AI learns. That's progression. That's why they stay."

**Verdict:** 📋 **PRD Required** — This is a significant enough improvement to warrant a structured project.

---

### #2: Portfolio-Wide First-5-Minutes Experience
**Impact Score:** 8.5/10
**Board Consensus:** Strong (Oprah + Shonda)

**The Problem:**
Every product assumes users already know what it is and why they should care. Empty states are empty. Onboarding is absent. New users feel dumb instead of empowered.

**What Success Looks Like:**

| Product | First-5-Minutes Fix |
|---------|---------------------|
| **LocalGenius** | Product tour video + testimonials + visible pricing |
| **Dash** | Welcome modal on activation + "Try ⌘K" prompt |
| **Pinned** | Welcome note in empty state + feature tooltips |
| **Great Minds** | "Your First Ship" tutorial + sample project |
| **Shipyard** | Portfolio case studies + dollar pricing + explainer video |

**Board Member Citations:**
- *Oprah:* "An empty state is not a neutral state. A good empty state says 'here's how to get started, and here's what it'll look like when you do.'"
- *Oprah:* "Would someone tell their friend about this? Right now, someone might say 'I installed this plugin but I don't know what it does.'"
- *Shonda:* "The pilot episode is everything. If the first 10 minutes don't hook them, nothing else matters."

**Verdict:** ⚡ **Quick Wins** — These are individual improvements, not a single project. Execute as atomic tasks within each product.

---

### #3: Cross-Product Data & Analytics Foundation
**Impact Score:** 8.0/10
**Board Consensus:** Strong (Jensen + Buffett)

**The Problem:**
Usage data is siloed. Learnings don't compound. There's no portfolio-level visibility into what's working. You're flying blind.

**What Success Looks Like:**
- Central analytics dashboard showing DAU, retention, feature usage across all products
- Cross-product user identity (single account system)
- For Great Minds specifically: PRD→Outcome tracking (token cost vs. revenue generated)
- Customer data that improves every product it touches

**Board Member Citations:**
- *Jensen:* "Instrument everything. Every product should be sending anonymized usage data to a central analytics layer."
- *Jensen:* "Start correlating: PRD quality → debate outcomes → execution time → bug count → user satisfaction."
- *Buffett:* "You need to track: CAC, LTV, churn rate, gross margin. You can't optimize what you can't measure."

**Verdict:** 📋 **PRD Required** — This is infrastructure work that enables all future improvements. Scope it as a project.

---

## Secondary Recommendations (Not PRD-worthy but important)

### 4. Pinned Acknowledgment Notifications
**Impact:** High for retention
**Effort:** Low (single feature)
**Shonda's Recommendation:** "When User A creates a note and User B acknowledges it, User A should get a notification. This single feature creates a social feedback loop."

### 5. Dash Power User Stats
**Impact:** Medium for retention
**Effort:** Low
**Shonda's Recommendation:** "Display a 'time saved' counter. '3.2 hours saved this month.' Quantify the value."

### 6. Shipyard Portfolio & Case Studies
**Impact:** High for conversion
**Effort:** Medium
**Buffett + Oprah:** "You claim 100% delivery rate but show zero evidence. Every shipped project should be a case study."

### 7. Great Minds Post-Ship Monitoring
**Impact:** Medium for retention
**Effort:** Medium
**Shonda's Recommendation:** "The story doesn't end at ship; it ends at success. Post-ship analytics integrated into the scoreboard."

---

## PRDs to Write

Based on the board's consensus, two improvements warrant full PRDs:

### PRD #1: LocalGenius Revenue & Onboarding Overhaul
**Filename:** `localgenius-revenue-onboarding.md`
**Scope:**
- Pricing page implementation
- Testimonial collection and display
- Product tour video integration
- ROI messaging framework
- Analytics to measure conversion impact

### PRD #2: Portfolio Analytics Foundation
**Filename:** `portfolio-analytics-foundation.md`
**Scope:**
- Central analytics service design
- Cross-product event tracking schema
- Dashboard MVP (DAU, retention, feature usage)
- Great Minds outcome tracking integration
- Privacy-first data collection approach

---

## The Strategic Shift Required

The board is aligned on one fundamental insight:

> **Stop thinking in products. Start thinking in portfolio.**

- LocalGenius, Dash, Pinned, Great Minds, and Shipyard should not be five separate things. They should be a **system**.
- Data from one product should improve all products.
- Users in one product should have pathways to all products.
- Success in one product should compound into success across the portfolio.

That's not where you are today. But with the improvements outlined above, it's where you could be in 90 days.

---

## Next Steps

1. **This Week:** Write PRD for LocalGenius Revenue & Onboarding Overhaul
2. **This Week:** Implement Pinned acknowledgment notifications (quick win)
3. **Next Week:** Write PRD for Portfolio Analytics Foundation
4. **Ongoing:** Add first-5-minutes improvements to each product as atomic tasks
5. **30 Days:** Review Shipyard case study pipeline

---

*"The strength of the team is each individual member. The strength of each member is the team."*

The products are strong individually. Now make them a team.

— Phil Jackson
Orchestrator, Great Minds Agency

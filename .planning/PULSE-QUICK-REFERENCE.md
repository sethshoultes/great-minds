# Pulse Benchmark Engine — Quick Reference

**Generated**: 2026-04-09 | **Status**: READY FOR BUILD | **Authority**: Phil Jackson + Board

---

## At-a-Glance Requirements Summary

### LAUNCH (1-2 weeks) — P0 Critical
| ID | Requirement | Effort | Owner |
|---|---|---|---|
| **PULSE-L01** | Email notifications (±5 points) | 6-8h | Backend |
| **PULSE-L02** | Bottom quartile UX redesign | 12-16h | Design + Eng |
| **PULSE-L03** | Mobile audit (30-sec flow) | 8-12h | QA |

**Total**: 26-36 hours | **Checkpoint**: QA sign-off

---

### 30-DAY (3 weeks) — P0 Retention
| ID | Requirement | Effort | Owner |
|---|---|---|---|
| **PULSE-30-01** | Next tier path feature | 16-20h | Product + Eng |
| **PULSE-30-02** | Weekly email digest | 12-16h | Eng |
| **PULSE-30-03** | Retention attribution | 10-14h | Data + Eng |

**Total**: 38-50 hours | **Checkpoint**: Retention +10%

---

### Q3 (12 weeks) — P1 Strategic
| ID | Requirement | Effort | Owner |
|---|---|---|---|
| **PULSE-Q3-01** | $19/mo premium badge | 14-18h | Eng + Biz |
| **PULSE-Q3-02** | Insights engine v1 | 18-24h | Data + Eng |
| **PULSE-Q3-03** | Spanish localization | 20-28h | Translation + Eng |
| **PULSE-Q3-04** | Cohort density dashboard | 12-16h | Eng |

**Total**: 64-86 hours | **Checkpoint**: Monetization LTV:CAC ≥3:1

---

### Q4 (16 weeks) — P2 Scaling
| ID | Requirement | Effort | Owner |
|---|---|---|---|
| **PULSE-Q4-01** | Industry report (Q2) | 16-20h | Marketing + Data |
| **PULSE-Q4-02** | Challenge system | 12-16h | Eng |
| **PULSE-Q4-03** | Parallelize batch job | 10-14h | Eng |

**Total**: 38-50 hours | **Checkpoint**: Report >500 downloads

---

## Critical Dependencies

```
LAUNCH Phase:
  L01 (Email) → L02 (Bottom quartile UX) → L03 (Mobile)
                          ↓
                   PULSE-30-01 (Next tier)

LAUNCH Phase:
  L01 (Email) → PULSE-30-02 (Weekly digest)

LAUNCH Phase:
  PULSE-30-03 (Retention tracking) - can start parallel

Q3 Phase:
  D06 (Badges) → Q3-01 (Premium badge)
  D01-04 (Core) → Q3-02 (Insights engine)
  L02 (Components) → Q3-03 (Spanish)
  D03-04 (Data) → Q3-04 (Cohort dashboard)
```

---

## Success Metrics by Phase

### LAUNCH Success
- [ ] All 3 requirements shipped + QA sign-off
- [ ] Email open rate ≥40%
- [ ] Mobile 30-second flow: 100% success
- [ ] Board notified ✅

### 30-DAY Success
- [ ] Next tier CTR ≥5%
- [ ] Weekly digest open rate ≥40%
- [ ] Retention +10% vs. baseline
- [ ] Attribution model live ✅

### Q3 Success
- [ ] Premium badges: ≥10 customers
- [ ] Spanish DAU: ≥5%
- [ ] Insights: ≥10% engagement
- [ ] Cohort health: zero issues ✅

### Q4 Success
- [ ] Report: ≥500 downloads
- [ ] Challenges: ≥30% participation
- [ ] Batch: <10 min for 10K customers ✅

---

## Critical Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Email fatigue → unsubscribe | HIGH | A/B test frequency, start conservative |
| Mobile >30 seconds | MEDIUM | Profile API, optimize loading |
| Bottom quartile UX confuses | MEDIUM | User test with struggling restaurants |
| Next tier doesn't drive retention | HIGH | A/B test control, measure payback |
| Premium badge <5% conversion | HIGH | Monitor LTV:CAC ≥3:1 |
| Insights engine spam | MEDIUM | Strict thresholds (n≥20, p<0.05) |
| Batch parallelization breaks | CRITICAL | Blue/green deploy, rollback plan |

---

## Resource Needs

### By Phase
- **LAUNCH**: 1.5 FTE for 1-2 weeks
- **30-DAY**: 1.5 FTE for 3 weeks
- **Q3**: 2 FTE for 12 weeks (parallel)
- **Q4**: 1 FTE for 16 weeks (parallel)

### By Role
- Backend Eng: 2-3 FTE (core logic)
- Product: 1 FTE (prioritization)
- Data: 0.5-1 FTE (insights + analytics)
- Design: 0.5 FTE (UX work)
- QA: 0.5 FTE (mobile + regression)

---

## Acceptance Criteria Highlights

### PULSE-L01: Email Notifications
```
✓ Trigger: |new_percentile - old_percentile| ≥ 5
✓ Timing: within 15 min of batch job
✓ Unsubscribe: respected next week
✓ Tone: "Your engagement is up. Here's what changed."
✓ Test coverage: ≥85%
```

### PULSE-L02: Bottom Quartile UX
```
✓ Percentile ≤25: show "Rising" badge (not red)
✓ Messaging: hopeful, 2-3 specific actions
✓ Link to next tier feature
✓ A/B test with 10% sample
✓ Design reviewed by Oprah for empathy
```

### PULSE-L03: Mobile Audit
```
✓ Dashboard load: ≤5s on 4G
✓ Full check-in: ≤30s total
✓ Touch targets: ≥44x44px
✓ No pinch zoom required
✓ LCP <2.5s, CLS <0.1
✓ Lighthouse score ≥85
```

### PULSE-30-01: Next Tier Path
```
✓ Display: percentile ≤90th
✓ Content: 3 actions from next tier restaurants
✓ Data-driven: "increased posts → +15% engagement"
✓ CTA: "Set up X" (actionable)
✓ Analytics: click rate + conversion tracked
✓ Goal: +10% retention improvement
```

### PULSE-30-02: Weekly Digest
```
✓ Send: Monday 7am (user timezone)
✓ Include: percentile, week-over-week change, insight
✓ Subject: "Your Pulse: [Metric] is [+/-]X%"
✓ CTA: dashboard button
✓ Unsubscribe: functional and honored
✓ A/B test subject line (2 weeks)
```

### PULSE-Q3-01: Premium Badge
```
✓ Price: $19/month (Stripe recurring)
✓ Features: larger, custom colors, SEO boost
✓ Gate: only show to top 50%
✓ Pilot: 5-10 restaurants at 50% discount
✓ Go/no-go: based on LTV:CAC ratio
```

### PULSE-Q3-02: Insights Engine v1
```
✓ Rule-based (not AI)
✓ Thresholds: n≥20, effect_size≥10%, p<0.95
✓ Display: 2-3 top insights
✓ Tone: "Businesses like yours that..."
✓ A/B test: with insights vs. control
✓ Categories: post frequency, response time, growth
```

---

## Implementation Checklist

### LAUNCH Week 1
- [ ] PULSE-L01: Email infrastructure ready (sendgrid/postmark)
- [ ] PULSE-L02: Bottom quartile UX prototype reviewed
- [ ] PULSE-L03: Mobile testing plan + device list
- [ ] Assign owners + kickoff meeting

### LAUNCH Week 2
- [ ] L01: Email templates coded + tested
- [ ] L02: UX component + styling
- [ ] L03: Mobile audit executed + results documented
- [ ] QA sign-off or iterate

### 30-DAY Week 1
- [ ] PULSE-30-01: Next tier data aggregation logic
- [ ] PULSE-30-02: Weekly digest cron job
- [ ] PULSE-30-03: Retention tracking schema

### 30-DAY Week 2-3
- [ ] 30-01: Frontend + A/B setup
- [ ] 30-02: Email template + timezone handling
- [ ] 30-03: Attribution queries + dashboard

### Q3 Weeks 1-2
- [ ] Q3-01: Stripe integration + checkout flow
- [ ] Q3-02: Insights rules engine design + SQL
- [ ] Q3-03: i18n framework setup
- [ ] Q3-04: Cohort density query + charts

### Q3 Weeks 3-12
- [ ] Parallel development + testing
- [ ] Beta testing with selected customers
- [ ] Metrics dashboard setup
- [ ] Board reporting pipeline

### Q4 Weeks 1-4
- [ ] Q4-01: Report generation logic + PDF
- [ ] Q4-02: Challenge system + leaderboard
- [ ] Q4-03: Batch job refactoring + load test
- [ ] Publishing + distribution

---

## Key Decisions (Locked)

| Decision | Rationale | Owner |
|---|---|---|
| Email ±5 points | Conservative start, avoid fatigue | Shonda |
| Bottom quartile "Rising" badge | Hope > shame | Oprah |
| 30-second mobile SLA | Owner checks Pulse at 6am | Oprah |
| Next tier shows 3 actions | Actionable, not overwhelming | Shonda |
| Weekly (not daily) digest | Retention signal, not spam | Shonda |
| Rule-based insights (v1) | Avoid causal inference complexity | Jensen |
| Spanish UI + emails only | Legal + QA scope manageable | Oprah |
| $19/month badge | Premium tier positioning | Buffett |
| Parallelize batch before 10K | Avoid scaling cliff | Jensen |

---

## Board Conditions Tracker

### LAUNCH (Shonda + Oprah)
- [ ] Email notifications for ±5 changes
- [ ] Bottom quartile redesign
- [ ] Mobile 30-second audit

### 30-DAY (Shonda + Buffett)
- [ ] Next tier path
- [ ] Weekly digest
- [ ] Retention attribution

### Q3 (All board members)
- [ ] Monetization pilot ($19/mo)
- [ ] Insights engine v1
- [ ] Spanish translation
- [ ] Cohort dashboard

### Q4 (Jensen + All)
- [ ] Industry report Q2 2026
- [ ] Weekly challenges
- [ ] Parallelize batch

### Strategic (Annual)
- [ ] Benchmark API
- [ ] Second vertical
- [ ] Recommendation engine

---

## Document References

| Document | Purpose | Location |
|---|---|---|
| **PULSE-REQUIREMENTS-ATOMIC** | Full specs (16k words) | `/.planning/PULSE-REQUIREMENTS-ATOMIC.md` |
| **PULSE-REQUIREMENTS-SUMMARY** | Executive table view | `/.planning/PULSE-REQUIREMENTS-SUMMARY.md` |
| **REQUIREMENTS-ANALYST-REPORT** | Strategic analysis | `/.planning/REQUIREMENTS-ANALYST-REPORT.md` |
| **This file** | Quick reference | `/.planning/PULSE-QUICK-REFERENCE.md` |

---

## Quick Links

**PRD**: `/prds/localgenius-benchmark-engine.md`
**Decisions**: `/rounds/localgenius-benchmark-engine/decisions.md`
**QA Pass 2**: `/rounds/localgenius-benchmark-engine/qa-pass-2.md`
**Essence**: `/rounds/localgenius-benchmark-engine/essence.md`

---

**Status**: LOCKED FOR IMPLEMENTATION
**Next Step**: Assign owners + kickoff LAUNCH phase

*"Ending the 2am loneliness of not knowing if you're okay."*

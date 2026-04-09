# Pulse Benchmark Engine — Requirements Summary Table

**Generated**: 2026-04-09
**Source**: `/prds/localgenius-benchmark-engine.md` + `/rounds/localgenius-benchmark-engine/decisions.md`

---

## Quick Reference: All Requirements by Status

| ID | Requirement | Category | Priority | Status | Timeline | Dependencies |
|----|-------------|----------|----------|--------|----------|--------------|
| **PULSE-L01** | Email notifications (±5 percentile points) | Services | P0 | TODO | LAUNCH (1-2w) | — |
| **PULSE-L02** | Struggling restaurant UX (bottom 25%) | Frontend | P0 | TODO | LAUNCH (1-2w) | PULSE-L01 |
| **PULSE-L03** | Mobile audit (30-second check-in) | QA | P0 | TODO | LAUNCH (1-2w) | PULSE-L02 |
| **PULSE-30-01** | Path to [Next Tier] feature | Frontend | P0 | TODO | 30-DAY (~3w) | PULSE-L02 |
| **PULSE-30-02** | Weekly email digest | Services | P0 | TODO | 30-DAY (~3w) | PULSE-L01 |
| **PULSE-30-03** | Retention attribution tracking | Database | P0 | TODO | 30-DAY (~3w) | — |
| **PULSE-Q3-01** | $19/mo premium badge | API | P1 | TODO | Q3 (~12w) | PULSE-D06 |
| **PULSE-Q3-02** | Insights engine v1 (rule-based) | Services | P1 | TODO | Q3 (~12w) | PULSE-D06 |
| **PULSE-Q3-03** | Spanish localization | Frontend | P1 | TODO | Q3 (~12w) | PULSE-L02 |
| **PULSE-Q3-04** | Cohort density dashboard (internal) | Frontend | P1 | TODO | Q3 (~12w) | PULSE-D03 |
| **PULSE-Q4-01** | Industry report: Q2 2026 | Marketing | P2 | TODO | Q4 (~16w) | PULSE-Q3-02 |
| **PULSE-Q4-02** | Weekly challenge system | Frontend | P2 | TODO | Q4 (~16w) | PULSE-L01 |
| **PULSE-Q4-03** | Parallelize batch job (perf) | DevOps | P2 | TODO | Q4 (~16w) | PULSE-D01 |
| **PULSE-STR-01** | Benchmark API evaluation | API | P3 | TODO | STRATEGIC | PULSE-Q3-01 |
| **PULSE-STR-02** | Second vertical (Retail/Salons) | Product | P3 | TODO | STRATEGIC | PULSE-Q3-04 |
| **PULSE-STR-03** | Recommendation engine (ML) | Services | P3 | TODO | STRATEGIC | PULSE-Q3-02 |
| | | | | | | |
| **PULSE-D01** | Percentile rank display | Frontend | P0 | ✅ DELIVERED | — | — |
| **PULSE-D02** | Industry comparison (4 metrics) | Frontend | P0 | ✅ DELIVERED | — | — |
| **PULSE-D03** | NAICS categorization (722xxx) | Database | P0 | ✅ DELIVERED | — | — |
| **PULSE-D04** | Curated peer groups (MSA→State) | Services | P0 | ✅ DELIVERED | — | — |
| **PULSE-D05** | Public benchmark report page | Frontend | P0 | ✅ DELIVERED | — | — |
| **PULSE-D06** | Embeddable badges (JS loader) | API | P0 | ✅ DELIVERED | — | — |
| **PULSE-D07** | Freemium preview hook | Frontend | P0 | ✅ DELIVERED | — | — |
| **PULSE-D08** | Progress tracking (Week vs Week) | Frontend | P0 | ✅ DELIVERED | — | — |
| **PULSE-D09** | Milestone celebrations | Frontend | P0 | ✅ DELIVERED | — | — |
| **PULSE-D10** | Graceful "insufficient data" | Frontend | P0 | ✅ DELIVERED | — | — |

---

## By Timeline

### LAUNCH (This Sprint) — 1-2 Weeks
**3 Critical Requirements**

| Req ID | Requirement | Effort | Owner |
|--------|-------------|--------|-------|
| PULSE-L01 | Email notifications (±5 points) | 6-8h | Engineering |
| PULSE-L02 | Bottom quartile UX | 12-16h | Design + Engineering |
| PULSE-L03 | Mobile audit (30-second flow) | 8-12h | QA |

**Total Effort**: 26-36 hours
**Checkpoint**: QA sign-off from Margaret Hamilton
**Owner**: Engineering Lead

---

### 30-DAY (Q2 Sprint) — ~3 Weeks
**3 Key Retention Features**

| Req ID | Requirement | Effort | Owner |
|--------|-------------|--------|-------|
| PULSE-30-01 | Next tier path | 16-20h | Product + Engineering |
| PULSE-30-02 | Weekly digest | 12-16h | Engineering |
| PULSE-30-03 | Retention tracking | 10-14h | Data + Engineering |

**Total Effort**: 38-50 hours
**Checkpoint**: Retention baseline metrics established
**Owner**: Product Lead

---

### Q3 (Quarterly) — ~12 Weeks
**4 Strategic Features**

| Req ID | Requirement | Effort | Owner |
|--------|-------------|--------|-------|
| PULSE-Q3-01 | Premium badge ($19/mo) | 14-18h | Engineering + Business |
| PULSE-Q3-02 | Insights engine v1 | 18-24h | Data Science + Engineering |
| PULSE-Q3-03 | Spanish localization | 20-28h | Localization + Engineering |
| PULSE-Q3-04 | Cohort density dashboard | 12-16h | Engineering |

**Total Effort**: 64-86 hours
**Checkpoint**: Monetization + Spanish adoption metrics
**Owner**: Product Lead

---

### Q4 (Quarterly) — ~16 Weeks
**3 Scaling + Growth Features**

| Req ID | Requirement | Effort | Owner |
|--------|-------------|--------|-------|
| PULSE-Q4-01 | Industry report (Q2) | 16-20h | Marketing + Data |
| PULSE-Q4-02 | Challenge system | 12-16h | Engineering |
| PULSE-Q4-03 | Parallelize batch job | 10-14h | Engineering |

**Total Effort**: 38-50 hours
**Checkpoint**: Report published, challenges launched
**Owner**: Engineering Lead

---

### STRATEGIC (Annual) — Beyond Q4
**3 Long-Term Bets**

| Req ID | Requirement | Status | Notes |
|--------|-------------|--------|-------|
| PULSE-STR-01 | Benchmark API | Scoping | Enterprise distribution |
| PULSE-STR-02 | Second vertical | Scoping | Retail + Salons |
| PULSE-STR-03 | Recommendation engine | Scoping | AI/ML integration |

---

## By Category

### Frontend (8 requirements)
- PULSE-L02: Bottom quartile UX ← LAUNCH
- PULSE-30-01: Next tier path ← 30-DAY
- PULSE-D01: Percentile display ✅ DELIVERED
- PULSE-D02: Industry comparison ✅ DELIVERED
- PULSE-D05: Public reports ✅ DELIVERED
- PULSE-D07: Freemium hook ✅ DELIVERED
- PULSE-D08: Progress tracking ✅ DELIVERED
- PULSE-D09: Milestones ✅ DELIVERED
- PULSE-D10: Insufficient data ✅ DELIVERED
- PULSE-Q3-03: Spanish localization ← Q3
- PULSE-Q3-04: Cohort density dash ← Q3
- PULSE-Q4-02: Challenge system ← Q4

**Total**: 8 TODO + 4 DELIVERED = 12 frontend changes

### Services (Backend Logic) (7 requirements)
- PULSE-L01: Email notifications ← LAUNCH
- PULSE-30-02: Weekly digest ← 30-DAY
- PULSE-D04: Peer grouping ✅ DELIVERED
- PULSE-Q3-02: Insights engine ← Q3
- PULSE-STR-03: Recommendation engine ← STRATEGIC

**Total**: 5 TODO + 1 DELIVERED = 6 service changes

### Database (3 requirements)
- PULSE-30-03: Retention tracking ← 30-DAY
- PULSE-D03: NAICS categorization ✅ DELIVERED

**Total**: 1 TODO + 1 DELIVERED = 2 database changes

### API (4 requirements)
- PULSE-Q3-01: Premium badge ← Q3
- PULSE-D06: Embeddable badges ✅ DELIVERED
- PULSE-STR-01: Benchmark API ← STRATEGIC

**Total**: 2 TODO + 1 DELIVERED = 3 API changes

### QA/Testing (1 requirement)
- PULSE-L03: Mobile audit ← LAUNCH

**Total**: 1 TODO

### DevOps (2 requirements)
- PULSE-Q4-03: Parallelize batch ← Q4

**Total**: 1 TODO

### Marketing (1 requirement)
- PULSE-Q4-01: Industry report ← Q4

**Total**: 1 TODO

### Product/Strategy (2 requirements)
- PULSE-STR-02: Second vertical ← STRATEGIC

**Total**: 1 TODO

---

## Risk Summary

### Critical Risks (Must Mitigate Before Launch)
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Email fatigue → unsubscribe | HIGH | A/B test frequency, start conservative (±5 points) |
| Mobile flow exceeds 30s | MEDIUM | Profile loading paths, optimize API |
| Bottom quartile UX confuses users | MEDIUM | User testing with target customers |

### High Risks (Monitor During Q2-Q3)
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Next tier doesn't drive retention | HIGH | A/B test with control, measure CAC payback |
| Premium badge <5% conversion | HIGH | Adjust pricing/positioning, monitor LTV:CAC |
| Insights engine returns spam rules | MEDIUM | Strict statistical thresholds, manual review |

### Medium Risks (Plan Around)
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Spanish translation quality | MEDIUM | Native speaker review, customer testing |
| Cohort density remains thin | MEDIUM | Improve onboarding, focus on high-density categories |
| Batch job parallelization breaks | CRITICAL | Extensive testing, blue/green deploy, rollback |

---

## Implementation Notes

### Critical Path (Must-Do First)
```
PULSE-L01 ──┐
            ├─→ PULSE-L02 ──→ PULSE-L03
            └─→ PULSE-30-02

PULSE-L02 ──→ PULSE-30-01 ──┐
                             └─→ PULSE-Q3-02
```

**Key Bottlenecks**:
1. PULSE-L01 (email infrastructure) blocks PULSE-L02, PULSE-30-02, etc.
2. PULSE-L02 (UX design) must be solid before testing PULSE-30-01 (next tier)
3. PULSE-Q3-02 (insights engine) depends on stable percentile/peer group logic

### Parallel Work (Can Run in Parallel)
- PULSE-30-03 (analytics) can start during LAUNCH (no frontend deps)
- PULSE-Q3-03 (Spanish) can start during 30-DAY (translation independent)
- PULSE-Q4-03 (batch optimization) can start during Q3 (DevOps only)

### Resource Planning
- **LAUNCH**: 1 backend eng + 1 designer + 1 QA → 1-2 weeks
- **30-DAY**: 1-2 backend eng + 1 product + 1 data analyst → 3 weeks
- **Q3**: 2-3 backend eng + 1 designer + 1 data scientist + 1 translator → 12 weeks (parallel)
- **Q4**: 1-2 backend eng + 1 marketer + 1 data analyst → 16 weeks (parallel)

---

## Success Metrics

### LAUNCH Success
- Email open rate: ≥40%
- Mobile 30-second flow: 100% success rate
- Bottom quartile sentiment: "hopeful" (qualitative)

### 30-DAY Success
- Next tier CTR: ≥5% of viewers
- Weekly digest open rate: ≥40%
- Retention lift: +10% vs. baseline

### Q3 Success
- Premium badges: ≥10 paying customers
- Spanish DAU: ≥5% of total
- Insights engine: ≥10% of users click

### Q4 Success
- Industry report: ≥500 downloads, ≥3 media mentions
- Challenge participation: ≥30% of active users
- Batch runtime at 10K customers: ≤10 minutes

---

## Owner Assignments (Recommended)

| Feature Set | Primary Owner | Secondary | Timeline |
|-------------|---------------|-----------|----------|
| PULSE-L (Launch) | Engineering Lead | Product | ASAP |
| PULSE-30 (30-Day) | Product Lead | Engineering | 3w |
| PULSE-Q3 (Quarterly) | Product Lead | Data/Design/Eng | 12w |
| PULSE-Q4 (Quarterly) | Engineering Lead | Marketing | 16w |
| PULSE-STR (Strategic) | CTO | Board | Annual |

---

## Document Reference

For detailed specifications, see: `//.planning/PULSE-REQUIREMENTS-ATOMIC.md`

This summary table provides the executive overview. Each requirement has:
- Detailed acceptance criteria
- Technical implementation notes
- Risk assessment
- Effort estimates
- Dependency mapping

---

**Status**: READY FOR IMPLEMENTATION
**Authority**: Phil Jackson + Board of Great Minds
**Generated**: 2026-04-09

**Next Step**: Break LAUNCH requirements into 1-week sprints and assign owners.

---

*"Ending the 2am loneliness of not knowing if you're okay." — Pulse Essence*

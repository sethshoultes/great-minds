# Shipyard — Locked Decisions
## Build Phase Blueprint

*Consolidated by Phil Jackson, The Zen Master*

---

## Decision Log

### Decision 1: Product Name
| | |
|---|---|
| **Proposed by** | Steve Jobs |
| **Winner** | Steve Jobs |
| **Final Decision** | **Shipyard** (not "Great Minds Cloud") |
| **Rationale** | Elon conceded in Round 2: "Shipyard is better. One word. Verb energy." Universal agreement. One word. Memorable. Evokes craft, momentum, destination. "I built this in Shipyard" is a sentence people say with pride. |

---

### Decision 2: Pricing Model
| | |
|---|---|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk |
| **Final Decision** | **Per-project pricing ($500-2,000), not subscription** |
| **Rationale** | Steve conceded in Round 2: "$299/month with credits is confusing. Per-project pricing is cleaner." Aligned incentives — users pay when they have a job, we get paid when we deliver value. No subscription churn. No "I paid and didn't use it" resentment. |

---

### Decision 3: Visible Agent Debate vs. Progress Bar
| | |
|---|---|
| **Proposed by** | Steve Jobs (debate) vs. Elon Musk (progress bar) |
| **Winner** | **Compromise — Steve's concept, Elon's implementation** |
| **Final Decision** | Visible debate ships in v1, but via **polling mechanism** (not WebSockets) |
| **Rationale** | Steve locked "visible agent debate" as non-negotiable — it's the differentiator. Elon's critique of WebSocket complexity is valid. Steve conceded in Round 2: "A polling mechanism that updates every few seconds delivers 90% of the magic at 10% of the cost." |

---

### Decision 4: Go-to-Market Strategy
| | |
|---|---|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk |
| **Final Decision** | **Productized service first, then self-serve** |
| **Rationale** | First 50 projects are high-touch. Review inputs, QA outputs, learn what breaks. Steve's "magic first" vision becomes the marketing layer; Elon's "validation first" becomes the operational layer. You can't scale magic you haven't proven. |

---

### Decision 5: No Signup Wall for First Experience
| | |
|---|---|
| **Proposed by** | Steve Jobs |
| **Winner** | **Contested — requires resolution** |
| **Final Decision** | **OPEN** |
| **Rationale** | Steve wants "paste your idea, see agents activate" before signup. Elon counters: anonymous users burning $5-20 in API calls per visit is "charity, not a business model." This is a fundamental tension between conversion optimization and experience design. |

---

### Decision 6: Architecture Simplicity
| | |
|---|---|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk |
| **Final Decision** | **Minimal v1 architecture: Form → Queue → Worker → S3 → Email** |
| **Rationale** | The 14-agent system already works locally. Don't re-architect what isn't broken. No containerized agents, no git worktree isolation for MVP. Three core components: single queue (Redis/Postgres), one worker per job, S3 for deliverables. |

---

### Decision 7: Flat Pricing (No Overage Fees)
| | |
|---|---|
| **Proposed by** | Steve Jobs |
| **Winner** | Steve Jobs (Elon agreed) |
| **Final Decision** | **All-in pricing with no surprise bills** |
| **Rationale** | Both agreed: "Surprise bills destroy trust" (Steve) and "Flat pricing builds trust. Surprise bills kill referrals" (Elon). Bake costs in or don't. |

---

### Decision 8: Design as Differentiator
| | |
|---|---|
| **Proposed by** | Steve Jobs |
| **Winner** | **Split decision** |
| **Final Decision** | Taste matters in **marketing and deliverables**, not in **plumbing** |
| **Rationale** | Elon's concession: "Taste matters in the marketing. Taste matters in the deliverables. Taste does not matter in the plumbing." Design investment goes to user-facing surfaces, not backend architecture. |

---

## MVP Feature Set (What Ships in v1)

### Must Have (Locked)
- [ ] Landing page with single input: "Paste your idea"
- [ ] Agent debate visualization (polling-based, updates every few seconds)
- [ ] Per-project checkout ($500-2,000 range, Stripe)
- [ ] Job queue system (Redis or Postgres-backed)
- [ ] Worker process that invokes existing Great Minds CLI
- [ ] S3 upload for deliverables
- [ ] Email notification with download link
- [ ] Basic auth (Supabase or similar)

### Must NOT Have (Cut from v1)
- [ ] ~~Real-time WebSocket dashboard~~
- [ ] ~~Token usage tracking UI~~
- [ ] ~~Subscription model ($299/mo)~~
- [ ] ~~Templates~~
- [ ] ~~White-label features~~
- [ ] ~~Custom agent training~~
- [ ] ~~Multiple project views/dashboard tabs~~
- [ ] ~~Federated learning~~

### Deferred to v2+
- [ ] Full self-serve automation
- [ ] Advanced project dashboard
- [ ] Real-time WebSocket updates
- [ ] Plugin "Run in Cloud" button
- [ ] Public build documentation/case studies

---

## File Structure (What Gets Built)

```
shipyard/
├── web/
│   ├── pages/
│   │   ├── index.tsx              # Landing page with idea input
│   │   ├── project/[id].tsx       # Project status + debate view
│   │   └── checkout.tsx           # Stripe per-project payment
│   ├── components/
│   │   ├── IdeaInput.tsx          # Single input component
│   │   ├── AgentDebate.tsx        # Polling-based debate visualization
│   │   ├── ProgressIndicator.tsx  # Status + ETA display
│   │   └── DownloadReady.tsx      # Deliverables download UI
│   └── lib/
│       ├── api.ts                 # API client
│       └── auth.ts                # Supabase auth wrapper
├── api/
│   ├── routes/
│   │   ├── submit.ts              # POST /submit - create job
│   │   ├── status.ts              # GET /status/:id - poll for updates
│   │   └── webhook.ts             # Stripe webhook handler
│   ├── queue/
│   │   ├── producer.ts            # Add jobs to queue
│   │   └── consumer.ts            # Process jobs (invoke CLI)
│   └── services/
│       ├── storage.ts             # S3 upload/download
│       └── email.ts               # Notification service
├── worker/
│   └── processor.ts               # Great Minds CLI wrapper
└── infra/
    ├── docker-compose.yml         # Local dev setup
    └── terraform/                 # Production infrastructure
```

---

## Open Questions (Requiring Resolution)

### 1. Signup Wall Timing
**Question:** When does email capture happen relative to "seeing the magic"?

**Steve's position:** After agents activate, before full output
**Elon's position:** Before any API calls happen
**Stakes:** $5-20 per anonymous visitor vs. conversion friction

**Proposed resolution:** A/B test both approaches with first 100 visitors

---

### 2. Project Pricing Tiers
**Question:** Is it flat $X per project, or tiered by complexity?

**Considerations:**
- Simple landing page vs. full SaaS with auth
- Token costs vary 5-10x by project scope
- User expectation of "what do I get for my money"

**Needs:** Pricing matrix based on project type/scope

---

### 3. High-Touch Operations for First 50
**Question:** Who reviews inputs? Who QAs outputs? What's the SLA?

**Considerations:**
- Elon's model requires human review before/after
- What's the turnaround commitment? 24h? 48h? 1 week?
- How do we capture learnings systematically?

**Needs:** Operational playbook for productized service phase

---

### 4. API Rate Limit Strategy
**Question:** How do we handle 14 agents × N concurrent projects?

**Steve noted:** "At scale, Claude's limits will hurt. This is a physics problem."
**Elon noted:** "100 projects * 14 agents = API rejections"

**Needs:** Rate limit analysis, potential Anthropic partnership/enterprise tier

---

### 5. Support Model
**Question:** Who answers tickets? What's the support promise?

**Elon noted:** "<2 tickets/project target. 100 projects = 200 tickets/month minimum."

**Needs:** Support staffing plan, self-serve documentation strategy

---

## Risk Register

| Risk | Likelihood | Impact | Owner | Mitigation |
|------|------------|--------|-------|------------|
| **Claude API rate limits block scaling** | High | Critical | Engineering | Negotiate enterprise tier with Anthropic; implement request queuing with exponential backoff |
| **First project failures damage reputation** | Medium | Critical | Operations | High-touch QA for first 50; no public launch until 10 successful deliveries |
| **"Show the debate" underdelivers on magic** | Medium | High | Design | User test debate UI before launch; have progress-bar fallback ready |
| **Per-project pricing attracts only large jobs** | Medium | Medium | Product | Consider "starter" tier at $500 for simple projects |
| **Anonymous API burn (if no signup wall)** | High (if implemented) | Medium | Engineering | Rate limit by IP; require email after 30-second preview |
| **Polling mechanism feels sluggish** | Low | Medium | Engineering | 3-second polling interval; optimistic UI updates |
| **Scope creep delays v1 launch** | Medium | High | Phil Jackson | Weekly scope review against this document; "not in v1" is final |
| **Support overwhelms small team** | Medium | Medium | Operations | Build FAQ from first 10 projects; create video walkthroughs |

---

## The Synthesis

Steve wants magic. Elon wants physics. Both are right.

**The path forward:**
1. **Build Elon's architecture** — Form → Queue → Worker → S3 → Email
2. **Wrap it in Steve's experience** — Shipyard name, visible debate, calm confidence
3. **Launch as productized service** — $500-2,000/project, high-touch, first 50
4. **Learn, then automate** — Self-serve comes after we've proven we can deliver

The debate visualization isn't decoration — it's the soul. But we implement it simply (polling, not WebSockets). The pricing isn't subscription — it's per-project, aligned with value delivered.

This is a product that looks like Steve designed it and runs like Elon engineered it.

---

*"The strength of the team is each individual member. The strength of each member is the team."*

— Phil Jackson

---

## Next Steps for Build Phase

1. **Resolve signup wall question** — Make a call or design the A/B test
2. **Define pricing tiers** — $500 / $1,000 / $2,000 with clear scope boundaries
3. **Write operational playbook** — Input review checklist, QA criteria, SLA commitments
4. **Confirm Anthropic rate limits** — Current tier, upgrade path, costs
5. **Begin build** — Start with queue + worker, then web layer, then polish

---

*Document locked: 2024*
*Ready for build phase.*

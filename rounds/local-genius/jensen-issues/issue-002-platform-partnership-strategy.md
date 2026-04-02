## Idea: Vertical Expansion via Platform Partnerships, Not Just Direct GTM

**Spotted during**: Board Review #001 — Jensen Huang (2026-04-01)

**The insight**:

The marketing goals document describes a vertical expansion sequence — restaurants, then salons, then dental, then home services, then auto repair — each requiring 2-4 weeks of prompt engineering and a dedicated GTM push. This is correct for the 90-day Austin launch where the goal is depth in one vertical. It may not be the right playbook for months 6-18.

Each target vertical has an existing software platform with a massive installed base:

| Vertical | Platform Partners | Installed Base |
|----------|-----------------|----------------|
| Hair salons / barbershops | Vagaro, Fresha, Mindbody | 300,000+ businesses combined |
| Dental practices | Dentrix, Eaglesoft, Open Dental | ~80% of US dental practices |
| Home services | Jobber, ServiceTitan, Housecall Pro | 1M+ technicians |
| Auto repair | Mitchell1, Tekmetric, Shop-Ware | ~100,000 shops |

If LocalGenius becomes the AI marketing layer that integrates with these platforms — rather than competing with them for the same SMB owner's attention — the distribution economics change by an order of magnitude. Instead of one GTM person doing 15 restaurant visits per day in Austin, a single partnership agreement puts LocalGenius in front of 100,000 home services businesses in a quarter.

The CUDA analogy: NVIDIA did not try to get every researcher to buy a GPU by knocking on lab doors. We got MATLAB, TensorFlow, and PyTorch to build on CUDA. The platform partners brought their users. We provided the infrastructure that made the platform partners more powerful. Both sides won.

**Why it matters**:

Direct GTM scales linearly with headcount. Platform partnerships scale with partner success. A single well-executed partnership with Jobber or Vagaro could deliver more qualified users in 60 days than the direct outreach model delivers in 12 months.

Secondary benefit: Platform integrations create data pipeline advantages. When LocalGenius is integrated with a salon's booking system, it has access to booking rates, service frequency, customer return patterns — data that makes the Weekly Digest dramatically more valuable and the AI dramatically more accurate. This is the attribution infrastructure the retention model requires, delivered through a partner's existing data layer rather than built from scratch.

**Suggested action**:

In months 4-5 (post-retention proof), while the team is beginning vertical expansion planning, assign one person (the Technical Co-Founder or a dedicated BD hire) to mapping the top 2-3 platform partners in the hair salon and home services verticals. The questions to answer:

1. Do any of these platforms have an open API or marketplace that allows third-party integrations?
2. What is their commercial model for marketplace partners (revenue share, flat fee, white-label)?
3. Is the platform operator a potential distribution partner (recommends LocalGenius to their users) or a potential acquisition target (we absorb their user base)?
4. What is the engineering cost to build an integration that delivers meaningful value (booking data into the Weekly Digest, at minimum)?

This is not a month-1 priority. It is a month-5 priority that requires month-3 research to execute on schedule.

**Risk and mitigation**:

Platform partnerships create dependency and can limit pricing autonomy. Mitigation: establish direct billing with the end customer regardless of discovery channel. The platform partner receives distribution economics (referral fee, co-marketing value). LocalGenius retains the customer relationship. Never let a platform partner own the billing relationship — that is the mistake that turns partners into landlords.

**Priority**: Medium

**Labels**: `board-idea`, `jensen-review`, `strategic`, `partnerships`, `growth`

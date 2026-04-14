# PRD: Great Minds Cloud

## Overview

Great Minds Cloud is a hosted SaaS version of the Great Minds multi-agent AI agency. Instead of installing the plugin locally and managing their own Claude API keys, users sign up, submit PRDs through a web interface, and receive completed deliverables—all powered by the same 14-agent system that has shipped 5 commercial products.

This is the monetization unlock for the Great Minds portfolio. It transforms open-source infrastructure into recurring revenue while simultaneously solving onboarding friction and creating data moat opportunities.

## Problem Statement

**Problem:** Great Minds Plugin is powerful but has three critical barriers:
1. **Technical setup** — Requires Claude API key, local installation, CLI familiarity
2. **Zero revenue** — Open source generates $0 despite delivering $50K+ worth of agency work per project
3. **Isolated learning** — Each installation learns independently; no network effects

**Who has this problem:**
- Product managers who want AI-assisted development but lack DevOps capacity
- Entrepreneurs building MVPs who don't want to manage infrastructure
- Agencies who could resell capacity but can't support plugin installations

**Pain level:** High. Users who would benefit most from multi-agent development are exactly the users least equipped to self-host it.

## Target Market

**Primary Audience:**
- **Indie hackers & solopreneurs** — Building side projects, need speed over customization
- **Early-stage startups** — Pre-engineering-hire, need to ship fast
- **Product managers** — Have PRD skills, lack engineering capacity

**Secondary Audience:**
- **Agencies** — White-label offering for client projects
- **Enterprise innovation teams** — Sandboxed experimentation environment

**Market Size:**
- 582,000 startups founded in US annually
- 70%+ are pre-seed with limited engineering resources
- Conservative TAM: $100M+ (100K potential users × $1,000/year average)

## Core Features

### MVP (v1.0)

- [ ] **Web-based PRD submission** — Upload PRD or paste text; no CLI required
- [ ] **Project dashboard** — View status, pipeline stage, agent activity in real-time
- [ ] **Deliverables download** — Receive all outputs as ZIP or GitHub repo
- [ ] **Token usage tracking** — Transparent cost breakdown per project
- [ ] **Basic authentication** — Email/password signup, Stripe billing
- [ ] **$299/month subscription** — Includes $200 token credit; overage at 1.5x pass-through

### v1.1 (Post-Launch)

- [ ] **PRD templates library** — Pre-built templates for common project types
- [ ] **Learning digest** — Weekly email: "What your agency learned this week"
- [ ] **Project history** — View past projects, re-run with modifications
- [ ] **Team seats** — Add collaborators to review and approve deliverables

### v2.0 (Platform)

- [ ] **Federated learning** — Anonymized pattern extraction across all customers
- [ ] **Custom agent training** — Upload your own brand voice, style guides
- [ ] **Skill marketplace** — Install community skills, publish your own
- [ ] **API access** — Programmatic PRD submission and status polling
- [ ] **White-label** — Agencies can resell under their brand

## Success Metrics

| Metric | Target (6 months) | Target (12 months) |
|--------|-------------------|---------------------|
| MRR | $10,000 | $50,000 |
| Active subscribers | 50 | 200 |
| Projects completed | 200 | 1,000 |
| Churn rate | <10%/month | <5%/month |
| NPS | 40+ | 50+ |

**Leading indicators:**
- PRD submission to first deliverable: <24 hours
- Customer support tickets per project: <2
- Upgrade rate (monthly → annual): >30%

## Constraints

**Budget:**
- Cloud infrastructure: $500/month initially (scales with usage)
- Claude API costs: Pass-through with margin
- Development: Internal (Great Minds builds Great Minds Cloud)

**Timeline:**
- MVP: 8 weeks from kickoff
- Beta launch: 10 weeks
- GA: 12 weeks

**Technical Limitations:**
- Must support git worktree isolation in cloud environment (containerized agents)
- Token limits per project to prevent runaway costs
- Queue management for concurrent projects

**Regulatory:**
- No storage of customer code beyond 30 days (unless opted in)
- GDPR-compliant data handling for EU customers
- Clear ToS on AI-generated code ownership

## Competitive Landscape

| Competitor | Approach | Weakness |
|------------|----------|----------|
| **Devin (Cognition)** | AI software engineer | Single agent; no debate/review loop |
| **Replit Agent** | IDE-integrated AI | Tied to Replit platform; limited to their editor |
| **Cursor / Copilot** | AI pair programming | Assists, doesn't autonomously ship |
| **Upwork / Fiverr** | Human freelancers | Slow, expensive, variable quality |
| **Traditional agencies** | Full-service dev | $50K+ projects, weeks of meetings |

**Our Differentiation:**
1. **Multi-agent debate** — Not one AI, but 14 with distinct perspectives
2. **Proven output** — 5 shipped products; this system works
3. **Memory that compounds** — The more we build, the better we get
4. **Transparent pricing** — Know cost before you start

## Open Questions

1. **Pricing model:** Is $299/month + overage the right structure? Consider:
   - Per-project pricing ($500-5,000 depending on scope)
   - Token-only (no subscription, just pay for what you use)
   - Tiered (Starter $99, Pro $299, Enterprise $999)

2. **Deliverable format:** Do customers want:
   - ZIP download
   - GitHub repo (we create and transfer)
   - Direct deploy to Vercel/Netlify
   - All of the above

3. **Human review option:** Should we offer:
   - Fully autonomous (current)
   - Human review checkpoint before final delivery (+$X)
   - Revision rounds included

4. **Scope control:** How do we prevent:
   - PRDs that are too vague (require minimum structure?)
   - PRDs that are too ambitious (token limits? scope warnings?)
   - Scope creep mid-project (lock PRD after kickoff?)

5. **Infrastructure:**
   - Self-hosted (DigitalOcean) vs. managed (Vercel/Railway)
   - Containerization strategy for agent isolation
   - Queue management for concurrent project limit

---

## Appendix: Revenue Projections

**Conservative Model (100 customers @ $299/mo):**
- Subscription revenue: $29,900/month = $358,800/year
- Token overage (est. 20% of customers): +$6,000/month
- **Total ARR: ~$430,000**

**Growth Model (500 customers @ blended $250/mo):**
- Subscription revenue: $125,000/month = $1,500,000/year
- Token overage: +$25,000/month
- **Total ARR: ~$1,800,000**

**Margin Analysis:**
- Claude API cost: ~40% of token revenue
- Infrastructure: ~$2,000/month at scale
- Gross margin: ~55-60%

---

*PRD Generated by featureDream IMPROVE Cycle*
*Source: Board reviews by Jensen Huang, Oprah Winfrey, Warren Buffett, Shonda Rhimes*

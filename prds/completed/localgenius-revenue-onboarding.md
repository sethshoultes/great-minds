# PRD: LocalGenius Revenue & Onboarding Overhaul

## Overview
LocalGenius is an AI-powered marketing automation platform for local businesses, particularly restaurants. While the product delivers genuine value, the current website hides pricing, lacks social proof, and fails to demonstrate value in the first 5 minutes. This project will transform LocalGenius from a "nice product with hidden economics" into a "clear business with confident pricing and proven results."

## Problem Statement
**The Problem:** LocalGenius has strong product-market fit signals but can't convert visitors to customers because:
1. **Pricing is hidden** — Visitors assume it's expensive or have to dig to find costs, creating friction and distrust
2. **No social proof** — Zero testimonials, case studies, or evidence that real businesses use and benefit from the product
3. **Unclear value proposition** — Visitors don't see what the product actually does or what results they can expect
4. **No demonstration** — No video, no interactive demo, no way to experience the value before committing

**Who Has This Problem:** Every potential LocalGenius customer who lands on the site and leaves because they couldn't answer "What does this cost?" and "Does this actually work?"

**Pain Level:** Critical — This is likely the primary bottleneck to revenue growth. Every day with hidden pricing is a day of lost conversions.

## Target Market
**Primary:** Restaurant owners and managers
- 660,000+ restaurants in the US alone
- 80%+ are independent operators with no marketing staff
- Willingness to pay: $50-200/month for marketing automation
- Decision maker: Owner or general manager

**Secondary:** Other local businesses (salons, gyms, retail)
- Similar pain points around marketing overwhelm
- Expansion opportunity after restaurant market validated

## Core Features

### 1. Pricing Page Implementation
- [ ] Create dedicated `/pricing` page
- [ ] Three-tier pricing structure (Starter/Growth/Scale or similar)
- [ ] Clear feature comparison table
- [ ] Annual discount option (2 months free)
- [ ] "Most Popular" highlight on middle tier
- [ ] FAQ section addressing common pricing questions
- [ ] Prominent CTA: "Start Free Trial" or "Get Started"

### 2. Social Proof & Testimonials
- [ ] Collect 3-5 video testimonials from existing users (60-90 seconds each)
- [ ] Create written testimonial cards with photos, names, business names
- [ ] Add "Trusted by X restaurants" counter on homepage
- [ ] Create 2-3 case studies with before/after metrics
- [ ] Display logos of notable restaurant users (with permission)

### 3. Product Tour Video
- [ ] 60-90 second product walkthrough video
- [ ] Show dashboard in action: reviews, social posts, analytics
- [ ] Include real (anonymized) data to demonstrate value
- [ ] Host on homepage above the fold
- [ ] Create shorter 30-second version for ads/social

### 4. ROI Messaging Framework
- [ ] Develop specific, quantified value claims:
  - "Restaurants see 40% more reviews in 90 days"
  - "Save 10+ hours per week on marketing"
  - "AI handles your social media 24/7"
- [ ] Add ROI calculator: "Input your review count, get projected improvement"
- [ ] Show competitive benchmarking: "Compare your marketing to similar restaurants"

### 5. Conversion Analytics
- [ ] Implement Plausible/Fathom/PostHog for privacy-first analytics
- [ ] Track: page views, pricing page visits, CTA clicks, trial starts, conversions
- [ ] Set up conversion funnel visualization
- [ ] A/B testing capability for pricing page variations

## Success Metrics

| Metric | Current | Target (30 Days) | Target (90 Days) |
|--------|---------|------------------|------------------|
| Pricing page views | N/A | Track baseline | 2x homepage visits |
| Trial sign-ups | Unknown | 10 | 50 |
| Paid conversions | Unknown | 5 | 25 |
| Trial→Paid conversion rate | Unknown | 20% | 30% |
| Time on pricing page | N/A | >60 seconds | >90 seconds |
| Video completion rate | N/A | 40% | 60% |

**Revenue Target:** $2,500 MRR within 90 days (25 customers × $99/month average)

## Constraints

### Budget
- Video production: Use Loom or similar for MVP testimonials
- Design: Use existing brand guidelines, minimal custom design
- Analytics: Free tier of Plausible or PostHog
- Total budget: <$500 for external costs

### Timeline
- Week 1: Pricing page live with basic design
- Week 2: First testimonials collected and displayed
- Week 3: Product tour video live
- Week 4: Analytics implemented and first A/B tests running

### Technical
- Must work with existing LocalGenius stack
- Mobile-first responsive design required
- Page load time <3 seconds
- WCAG 2.1 AA accessibility compliance

## Competitive Landscape

**Direct Competitors:**
- **Marqii** — Restaurant marketing platform, $79-299/month
- **Popmenu** — Restaurant website + marketing, $99+/month
- **Owner.com** — Restaurant digital marketing, enterprise pricing
- **Toast Marketing** — Add-on to Toast POS, varies

**Differentiation:**
- LocalGenius is AI-first (not bolted-on AI features)
- Zero setup friction (competitors require onboarding calls)
- Transparent pricing (competitors often require demos for pricing)
- No contracts (competitors often require annual commitments)

**Positioning:** "The AI marketing team that works while you cook."

## Open Questions

1. **Pricing level:** $79/month? $99/month? $149/month? Need market testing.
2. **Free trial length:** 7 days? 14 days? 30 days?
3. **Credit card required for trial?** Lower friction vs. higher intent
4. **Testimonial incentives:** What to offer existing users for video testimonials?
5. **Case study approval:** Which customers will allow public case studies?

## Dependencies

- Access to LocalGenius website codebase
- Contact information for existing LocalGenius users
- Brand guidelines and design assets
- Analytics integration capabilities

## Board Member Endorsements

> *"Launch a pricing page this week. A wrong price you can fix is better than a hidden price that tells you nothing."* — Warren Buffett

> *"If your onboarding makes users believe they can't figure it out, they won't. Make them believe they already have."* — Oprah Winfrey

> *"Every customer's performance data should make the AI smarter for everyone. That's the data moat you're not building."* — Jensen Huang

> *"Create a 'marketing IQ' score that increases as the AI learns. That's progression. That's why they stay."* — Shonda Rhimes

---

**PRD Author:** Phil Jackson (Orchestrator)
**Source:** IMPROVE Cycle 2026-04-16
**Priority:** P0 — Critical path to revenue

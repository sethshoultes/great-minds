# Board Review: LocalGenius Revenue & Onboarding
**Reviewer**: Warren Buffett
**Date**: 2026-04-16
**Score**: 3/10 — Pretty website won't fix unknown unit economics.

---

## Unit Economics: Unknown

**Cost to Acquire One User:**
- Zero paid acquisition budget allocated
- No CAC tracking mentioned
- No organic traffic baseline
- Pricing page exists but no distribution plan
- **Verdict**: Can't calculate CAC without traffic. Free is not a strategy.

**Cost to Serve One User:**
- $99/month revenue per customer
- Target: 25 customers × $99 = $2,475 MRR (90 days)
- Hosting costs: Unknown
- AI API costs: Unknown (OpenAI? Claude? Per-customer usage?)
- Support costs: Unknown
- **Verdict**: Revenue target exists. Cost structure missing. Might lose money per customer.

**Missing Data:**
- What does one customer cost in AI tokens per month?
- What's churn rate? If 50% churn monthly, 25 customers is 12.5 net.
- What's LTV? At $99/month with 50% churn, LTV = $198. Can't spend $200 to acquire.

---

## Revenue Model: Hobby Disguised as Business

**What Works:**
- Single $99/month tier (smart simplicity)
- 14-day trial (tests willingness to pay)
- No contracts (reduces friction)

**What Doesn't:**
- 660,000 US restaurants × 0.01% conversion = 66 customers = $6,534 MRR
- At 0.1% conversion = 660 customers = $65,340 MRR
- At 1% conversion (fantasy) = 6,600 customers = $653,400 MRR
- **Reality check**: Getting to 1% of market takes $5M+ in marketing spend.

**Fatal Flaw:**
- $2,475 MRR target at 90 days = $29,700 ARR
- Can't hire, can't scale, can't survive on $30K annual revenue
- One founder's salary eats entire revenue

**Pricing Risk:**
- $99/month undercuts competitors ($149-299/month range)
- Signals "we're cheaper" not "we're better"
- Toast/Popmenu customers pay $200+/month. Why go down-market?

---

## Competitive Moat: None Visible

**What Stops Weekend Copy:**
- "AI-first" is not a moat. Every competitor adds GPT-4 API in 3 days.
- Transparent pricing? Competitor updates website in 1 hour.
- No setup friction? Competitors remove onboarding calls in 1 week.
- No contracts? Popmenu switches to month-to-month in 1 day.

**Missing Moats:**
- No network effects (customer A doesn't improve experience for customer B)
- No data moat (PRD mentions it: "Every customer's data should make AI smarter for everyone. That's the data moat you're not building.")
- No switching costs (restaurant can export data, move to competitor)
- No exclusive partnerships (Toast owns POS integration = real moat)

**Case Study Problem:**
- Marcello's Italian Kitchen: +292% reviews, +250% revenue
- Correlation ≠ causation. Did LocalGenius cause revenue spike? Or economic recovery? New menu? Yelp promotion?
- One case study proves nothing. Need 50+ with control groups.

---

## Capital Efficiency: Excellent Bootstrapping, No Path to Scale

**What's Smart:**
- <$500 external spend (video testimonials via Loom)
- Using free tier analytics (PostHog/Plausible)
- No custom design (existing brand guidelines)
- Team built pricing page in-house (Wave 1 complete)

**What's Concerning:**
- Zero budget for customer acquisition
- Can't validate $99 price point without traffic
- Can't test conversion rate without paid ads
- Can't reach 25 customers organically in 90 days from standing start

**Math:**
- 25 customers in 90 days = 2 new customers/week for 12 weeks
- Requires 100+ qualified leads/week (assuming 2% trial-to-paid)
- Where's the traffic coming from?

---

## What I'd Do Differently

**Immediate (This Week):**
1. **Kill the $99 price**. Test $149/month. If Popmenu gets $200+, you're leaving money on table.
2. **Add cost tracking**. Instrument AI API costs per customer. Know margin before scaling.
3. **Find distribution**. One partnership with restaurant POS = 1,000+ restaurants. Cold traffic won't cut it.

**30 Days:**
4. **Charge for case studies**. If Marcello's revenue went up $6,000/month, charge $500/month. Prove value capture, not just value creation.
5. **Test paid acquisition**. Spend $1,000 on Facebook ads targeting restaurant owners. Learn CAC before betting the farm.
6. **Build switching costs**. Integrate with Toast POS, Square, Clover. Export = losing 6 months of integrated data.

**90 Days:**
7. **Create data moat**. Aggregate anonymized performance across all restaurants. "Restaurants like yours average 4.2 stars with 67 reviews. You're at 3.8 with 12. Here's the gap."
8. **Add upsells**. $99 base + $49 premium support + $99 custom content = $247 ARPU. SaaS thrives on expansion revenue.
9. **Raise prices annually**. $99 → $109 → $119. Grandfather existing customers. Lock in margin expansion.

---

## The Uncomfortable Truth

Beautiful pricing page doesn't matter if no one sees it.
Transparent pricing doesn't matter if price is wrong.
Case study doesn't matter if you can't replicate it 100 times.

You've built a product. Now build a business model:
- Know your unit economics before selling customer #1
- Find distribution channel that scales (not hope)
- Create defensibility (switching costs, network effects, exclusive data)

Right now this is a $30K/year side project with professional polish.
Make it a $3M/year business with durable competitive advantages.

---

**Score: 3/10**
Execution is crisp. Economics are absent. Moat is non-existent.

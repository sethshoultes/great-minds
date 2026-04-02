# LocalGenius — Joint Summary

**Great Minds Agency**
**Steve Jobs**, Chief Design & Brand Officer
**Elon Musk**, Chief Product & Growth Officer
**Marcus Aurelius**, Moderator / Chief of Staff
**Date**: 2026-04-01

---

## 1. Project Overview

LocalGenius is an AI employee for local businesses — a single conversational interface that replaces the 6-8 disconnected tools most small business owners juggle and hate. The owner talks to LocalGenius the way they'd talk to a marketing employee: "Post something about our lunch special," "Respond to that bad review," "How did we do this month?" — and it handles everything. Website generation, social media posting, review management, email campaigns, local SEO, and a weekly plain-English report. The product launches in Austin with restaurants only, priced at $29/month (base) and $79/month (pro). The target is 300-500 paying restaurants in 90 days with 80%+ 30-day retention, scaling to 10,000 users across five verticals within 12-16 months. The competitive landscape is favorable: incumbents are either too expensive (Vendasta, Podium, Birdeye at 4-20x our price), too narrow (Wix, GoDaddy solving one of six problems), or lack an execution layer entirely (ChatGPT, Jasper). Our edge is not AI — it is execution. We don't generate content. We generate content, post it, track it, report back, and recommend what to do next. The owner touches it once, or never. That complete loop, delivered through a warm conversational interface at a price any restaurant can afford, is the product.

---

## 2. Key Strategic Decisions

### Decision 1: AI-Generated Website on Commoditized Hosting
We build a generative onboarding layer that produces a professional website in five minutes — but we do not build a website builder. We own the design, the templates, and the AI generation. We outsource hosting to commoditized infrastructure (Vercel, Cloudflare Pages). The website is a byproduct of the onboarding proof moment, not a standalone product. Engineering cost: 2-3 weeks. This decision resolves the tension between Steve's insistence on a magical first impression and Elon's refusal to build commoditized infrastructure. Both are right.

### Decision 2: Funnel-Stage Emotional Architecture
Fear acquires. Curiosity considers. Relief converts. Pride retains. The brand tagline is "Your business, handled" — and the single emotion of the brand is relief. But we use competitive fear deliberately at the top of the funnel ("your competitor has 147 more Google reviews than you") because loss aversion outperforms promise-of-gain for cold acquisition by 2-3x. The key discipline: fear is tactical and never touches the product itself. From the moment the owner signs up, every interaction is designed to produce relief.

### Decision 3: Sequential Growth Strategy (Amended)
Months 1-3: Retention proof. 300 (base) / 500 (stretch) restaurants in Austin. 80%+ 30-day retention. No paid acquisition. Months 3-6: Narrative ignition with proven results, vertical expansion to salons and dental. Months 6-12: Category ownership with paid acquisition and multi-vertical scale. The original target of 500 was amended to 300 base / 500 stretch after Elon's market-fit analysis demonstrated through bottom-up comparable benchmarks (Toast, Housecall Pro, Jobber) that 500 in 90 days with one GTM person and organic-only channels exceeds all comparable B2SMB launches. The product-led growth loop — shareable Weekly Digest and "Posted by LocalGenius" watermark — is the mechanism designed to close the gap between base and stretch.

### Decision 4: Multi-Tenant Architecture, Single-Tenant UI
The data model supports Organization → Business → User from day one. The UI shows a single-business experience only. No franchise dashboard, no multi-location view, no brand consistency tools in v1. Incremental cost: approximately three days of schema design. This decision prevents an expensive architectural rewrite when franchise demand materializes (estimated month 6+), while keeping every pixel of v1 focused on the solo operator.

### Decision 5: Team Composition — 6 People, Empathy/Speed Split
Six people. Six months. Ship v1. Three empathy-primary roles (Founder/CEO, Product Designer, GTM Lead) face outward toward customers. Three speed-primary roles (Technical Co-Founder, AI/Prompt Engineer, Mobile Engineer) face inward toward code. All six are filtered for the same question: "Has this person felt what our customer feels?" The empathy filter is not a softness — it is a product quality filter that prevents the most expensive B2SMB mistake: building features that solve the wrong problems because no one on the team has watched a restaurant owner try to use Mailchimp at 10pm.

---

## 3. Deliverable Summary

### Product Design Vision (`product-design.md`)
The entire product is one conversation thread. No tabs, no dashboard, no settings page. The onboarding flow generates a professional website, a first social post, an optimized Google Business Profile, and a suggested campaign in five minutes — and the owner never selects a template, chooses a font, or configures an integration. The Weekly Digest arrives every Monday in three acts: what happened, what I did, what I recommend. The visual language is warm, earthy, and specific — Terracotta and Sage on cream backgrounds with Source Sans 3 typography and generous whitespace. The key design insight: the "What We Don't Build" section is as detailed as what we do build, because every omission is an active decision to protect the user from complexity.

### Product/Market Fit Analysis (`market-fit.md`)
The Austin restaurant market has 7,700 addressable businesses — more than enough to validate with 300-500. Unit economics are strong: LTV/CAC exceeds 3:1 in all three churn scenarios (optimistic, base, pessimistic). AI costs land at 6.7% of revenue, well under the 15% ceiling. The key analytical insight: retention is the single variable that separates a $5M company from a $50M company. At 5% monthly churn (SMB default), the business is viable but unexciting. At 2% (achievable with revenue attribution features), it is a category leader. The document recommends building attribution features — lead tracking numbers, competitive benchmarks, booking integrations — as the retention infrastructure, not just content generation.

### Customer Personas (`customer-personas.md`)
Maria Gonzalez is a 43-year-old Tex-Mex restaurant owner on South Lamar in Austin who sits in her car at 10pm dreading the Yelp notifications she swiped away at 5:30am. Darnell Williams is a 34-year-old barber who inherited his father's shop but not his father's marketing immunity — the neighborhood changed, and "barbershop near me" doesn't find him. Kevin Tran is a solo plumber who will cancel in 90 days unless his Weekly Digest shows him exactly how many calls came from his LocalGenius tracking number. Linda Chen operates seven franchise locations and represents the future economics of the product but is explicitly not the v1 customer. The key persona insight: the persona-to-feature map reveals that the Weekly Digest is the only feature that is critical for all three v1 personas — but each persona needs it to show different things.

### Team Personas & Hiring Blueprint (`team-personas.md`)
Six roles, each defined with daily responsibilities, a first-month deliverable, a revealing interview question, and a red-flag profile of who not to hire. The key hiring insight: the interview questions test for the right *traits*, not the right *keywords*. The CEO is asked to recount a specific moment a small business owner changed their product thinking. The GTM Lead is asked to deliver a 60-second pitch at a restaurant counter at 2:30pm. The Mobile Engineer is asked to show an app that non-technical users aged 40-60 use regularly. Total annual payroll: $790K-$960K, sustainable for 20-24 months on a $2M seed round.

### Marketing Goals & Growth Strategy (`marketing-goals.md`)
Five organic channels drive the 90-day Austin launch, each modeled with specific funnel math: direct restaurant outreach (82 users), TRA partnerships (30), Chamber/SCORE/SBA (11), referral/word-of-mouth (11), and product-as-marketing (19) — totaling a base case of 316. The key growth insight: the week-by-week execution plan includes a hard stop at week 8 — "if 30-day retention < 80%, STOP all growth activity, diagnose and fix." Growth without retention is waste, and the plan explicitly prioritizes learning over scaling.

### Marketing Messaging Framework (`marketing-messaging.md`)
The brand voice has three registers: in-product (warm, competent, brief — like a text from a trusted employee), marketing (confident, specific, slightly provocative), and support (calm, clear, solution-first). The vocabulary guide bans 16 words including "AI-powered," "platform," "solution," "streamline," "engagement," and "user." The key messaging insight: the two-layer emotional architecture — fear for acquisition, relief for retention — is not a compromise but a genuine strategic advantage. Most products have one emotional register. LocalGenius has two, deployed where each is strongest.

---

## 4. Where We Agree

These are the convictions both directors hold without reservation:

1. **Start with restaurants in Austin. No exceptions.** The physics of the vertical (visual, social, review-driven, content-starved, extreme word-of-mouth) make restaurants the only defensible starting point. Win the category before expanding.

2. **The product is a conversation, not a dashboard.** The owner talks. It does the rest. Any feature that requires the owner to navigate, configure, or analyze is a failure of the core design.

3. **Onboarding is the product.** The five-minute proof moment — where the owner sees their business look professional for the first time — is the conversion event. Not a free trial. Not a feature tour. Real output in her hands before she can talk herself out of it.

4. **Never say "AI-powered."** The owner does not care what powers the product. She cares what it does. The word "AI" does not appear in any customer-facing material. Our edge is execution, not technology.

5. **Retention is the only metric that matters in months 1-3.** If we cannot keep 80% of owners past 30 days, nothing else matters. Scale without retention is a leak, not a river. Every growth decision in the first quarter is subordinated to this number.

6. **Six people is the right team.** Not five (too thin). Not seven (management overhead with no proportional velocity gain). Six people who ship v1 in six months. The constraint is the feature.

7. **The Weekly Digest is the heartbeat.** Every persona relies on it. It is the one feature that must be excellent for everyone — but personalized for what each owner cares about most: reviews for Maria, discoverability for Darnell, revenue attribution for Kevin.

---

## 5. Where We Challenged Each Other

### Tension 1: The Website Builder
**Steve** insisted the product must generate a website in onboarding — that the moment of seeing your business look professional for the first time is the emotional conversion event. **Elon** insisted building a website builder is 3-4 months of wasted engineering on a commoditized capability. **Resolution:** Both were right about different things. We build a generative onboarding layer (Steve's proof moment) on commoditized hosting (Elon's infrastructure pragmatism). The website is the receipt of the onboarding experience, not a standalone product. One engineer, two to three weeks.

### Tension 2: Messaging Emotion — Fear vs. Relief
**Steve** argued the brand must lead with relief: "Your business, handled." Fear fatigue creates an anxious relationship with the product. **Elon** argued fear converts cold traffic at 2-3x the rate of promise-of-gain and competitive framing is the interrupt that gets attention. **Resolution:** They are both correct for different stages of the funnel. Fear acquires. Curiosity bridges. Relief converts. Pride retains. The tagline — "Your business, handled" — is the brand identity. Competitive fear hooks are tactical acquisition tools that never touch the product itself. Two emotional registers, deployed where each is strongest.

### Tension 3: Category Creation vs. Retention Metrics
**Steve** wanted to build a category — to own the narrative of "AI employee for local businesses" through a deliberate launch moment. **Elon** wanted retention proof before any scaling — because at 5% monthly churn, 500 users become 250 in 12 months, and you cannot own a category that leaks. **Resolution:** Sequence, not choice. Retention proof in months 1-3, narrative ignition in months 3-6, category ownership in months 6-12. Elon builds the engine that retains. Steve builds the story that spreads. The retention data becomes the proof that fuels the narrative.

### Tension 4: Franchise Architecture Timing
**Steve** argued multi-tenancy is an architectural decision, not a feature, and retrofitting it later costs two months of migration. **Elon** argued "architect from day one" adds 40-60% complexity to every feature for a six-person team. **Resolution:** The data model includes `organization_id` from day one. The API accepts business-level scoping. The UI shows a single-business experience only. Total incremental cost: approximately three days. We do not build for franchise. We do not preclude franchise.

### Tension 5: Team Philosophy — Empathy vs. Speed
**Steve** argued every hire must have felt what the customer feels — that you cannot build for someone you have never been. **Elon** argued "empathy-first" as a blanket filter produces a team that understands the problem and ships nothing. **Resolution:** Split the team 3/3. Empathy-primary roles (CEO, Designer, GTM Lead) face the customer. Speed-primary roles (Tech Lead, AI Engineer, Mobile Engineer) face the code. All six are filtered for the question: "Has this person felt what our customer feels?" — because empathy is not a role, it is a minimum standard.

---

## 6. What Must Happen Next

**Priority 1: Hire the team.** The team-personas document defines six roles with interview questions, red-flag profiles, and compensation bands. The Founder/CEO and Technical Co-Founder are the critical first hires — everything else follows from them. Target: team assembled within 6 weeks.

**Priority 2: Build the onboarding flow.** The five-minute proof moment is the conversion engine. The product-design document specifies it screen by screen, step by step. The Designer's first-month deliverable is an interactive Figma prototype tested with three or more non-technical users. The Mobile Engineer ships a working version by week 5. This is the single most important engineering milestone.

**Priority 3: Establish the Austin restaurant GTM beachhead.** The GTM Lead begins direct outreach in week 1 — South Congress, East 6th, Rainey district. Secure TRA Austin sponsorship for the month-2 event. Brief five SCORE mentors. Milestone: first five paying customers by end of week 2. These five are over-invested in — every friction point, every question, every delight moment is documented and feeds sprint priorities.

**Priority 4: Build the Weekly Digest and revenue attribution.** The Digest is the retention anchor for all three personas. Revenue attribution (the tracking number) is Kevin's retention feature and the mechanism that drives churn below 3%. Both must be in production by month 2. Without them, every pragmatic solo operator churns by day 90.

**Priority 5: Measure retention at week 8 — and be willing to stop.** The marketing-goals document includes a hard gate: if 30-day retention is below 80% at week 8, all growth activity stops. The team diagnoses, fixes, and re-measures at week 12. This is not a failure scenario — it is a discipline scenario. The willingness to stop growing in order to fix retention is what separates companies that scale from companies that leak.

---

## 7. What We Learned

**The debate process works.** Steve and Elon arrived at nearly identical convergence proposals on all five tensions — independently. The debate did not produce compromise. It produced synthesis. Positions that were challenged became stronger than positions that were assumed.

**Specificity defeats abstraction.** The customer personas work because they are stories about named humans with specific days, specific fears, and specific moments of defeat. The marketing messaging works because the vocabulary guide bans specific words. The product design works because the "What We Don't Build" section names specific anti-patterns. Every document that succeeded did so because it committed to specific choices rather than hedging with generalities.

**Internal language becomes external language.** The creative review caught vocabulary from internal analysis documents ("AI conversational interface," "target segment") that would inevitably leak into how the team talks about the product to customers. Establishing the vocabulary rules in the messaging framework — and enforcing them across all documents, including internal ones — is a quality discipline that protects the brand before it even launches.

**Persona consistency requires a canonical source of truth.** Maria was a dentist in one document and a restaurant owner in another because two teams built in parallel from different starting assumptions. The creative review caught it. The fix was simple but the lesson is structural: canonical persona definitions must be established before parallel workstreams begin, and every document must reference them.

**The amendment process works.** Elon's market-fit analysis proved that the original 500-in-90-days target was aspirational rather than derived. Rather than defend a number that couldn't survive scrutiny, the agency amended the locked decision to 300 base / 500 stretch. Truth serves the work better than ambition. We do not inflate targets to feel bold — we set targets we can defend with math and then exceed them with execution.

---

*This summary was produced jointly by Steve Jobs and Elon Musk, with editorial oversight from Marcus Aurelius, for the client Seth Shoultes. The six deliverables referenced above constitute the complete strategic and operational foundation for LocalGenius v1. The agency recommends proceeding to execution.*

*— Great Minds Agency*

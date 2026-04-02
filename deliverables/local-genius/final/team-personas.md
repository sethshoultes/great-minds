# LocalGenius — Team Personas & Hiring Blueprint

**Author**: Team Architect (reporting to Elon Musk)
**Date**: 2026-04-01
**Status**: Draft v1

---

## 1. Team Philosophy

Six people. Six months. Ship v1 for Austin restaurants.

This is not a team designed for comfort. It is designed for the specific challenge of building an AI product that non-technical small business owners love enough to pay $29-79/month for — and keep paying. Every role exists because the product cannot ship without it. There are no "nice to have" hires.

**The locked split** (from Round 2):
- **Empathy-primary** (3 roles): Founder/CEO, Product Designer, GTM Lead
- **Speed-primary** (3 roles): Technical Co-Founder/Lead Engineer, AI/Prompt Engineer, Mobile Engineer

This split is not philosophical — it's structural. The empathy-primary roles face outward (customers, users, market). The speed-primary roles face inward (code, architecture, shipping). The product lives at the intersection.

---

## 2. The Six Roles

---

### ROLE 1: Founder / CEO

**Primary Trait**: Empathy
**Why Empathy**: This person is the bridge between a restaurant owner's daily reality and a technical team's sprint backlog. If they can't sit at a diner counter and genuinely feel why Maria the dentist hates Mailchimp, they will build features that solve the wrong problems. The CEO sells to customers in months 1-3 — not a sales team. Every product decision filters through "would Maria understand this?"

#### Daily Responsibilities
1. **Sell and learn** (mornings): Visit restaurants with GTM Lead 2-3 days/week. Do demos. Listen to objections. Feed insights back to the team by standup.
2. **Decide and unblock** (afternoons): Make product prioritization calls. Resolve engineering trade-offs that require customer context. Review AI output quality.
3. **Fundraise and recruit** (evenings/ongoing): Maintain investor pipeline. Source candidates for roles 2-6. This is background activity, not a full-time job in months 1-3.

#### First-Month Deliverable
Personally onboard the first 20 customers. Document every friction point, every question, every moment of delight. Produce a "First 20 Learnings" doc that drives sprint priorities for month 2.

#### The Interview Question
"Tell me about the last time you sat across from a small business owner and they told you something that changed how you thought about your product. What did they say, and what did you do differently?"

**What you're listening for**: Specificity. A real person, a real moment, a real change in direction. If the answer is abstract ("we learned that SMBs value simplicity"), they haven't been close enough to the customer.

#### Red Flag Profile
The enterprise SaaS CEO who "wants to move downstream." They'll say the right things about empathy and simplicity, but their instincts are shaped by 50-person sales teams, quarterly planning cycles, and customers who have IT departments. They will over-engineer the product, over-formalize the process, and under-index on the messy, personal, door-to-door work that B2SMB requires in the first 90 days. Also red flag: the serial founder who's never stayed past month 12. This company needs someone who will sleep on the factory floor.

#### Compensation
- **Base salary**: $130,000-$160,000/year (below market for CEO — offset by equity)
- **Equity**: 40-60% (if founding), 8-15% (if first CEO hire with technical co-founder already in place)
- **Notes**: This person must be willing to take below-market cash. If they negotiate hard on salary, they're optimizing for the wrong thing.

---

### ROLE 2: Technical Co-Founder / Lead Engineer

**Primary Trait**: Speed
**Why Speed**: This person makes 50+ technical decisions per week, most of them irreversible in the short term. The Austin restaurant market won't wait for perfect architecture. They need to ship a working conversational interface, AI content pipeline, and multi-channel posting system in 6 months with 3 engineers (including themselves). Speed means choosing boring, proven technology. Speed means cutting scope ruthlessly. Speed means saying "we'll fix it in v1.1" without losing sleep.

#### Daily Responsibilities
1. **Architect and build** (60% of time): Hands-on coding. Database schema, API design, infrastructure. This is not a management role — it's a building role with architecture authority.
2. **Review and unblock** (25% of time): Code review for AI Engineer and Mobile Engineer. Unblock technical obstacles. Make "good enough vs. needs to be right" calls.
3. **Coordinate with CEO** (15% of time): Translate customer feedback into technical priorities. Push back when product asks conflict with shipping timeline.

#### First-Month Deliverable
Deployed backend: user auth, business profile model (with `organization_id` for future multi-tenant), API integration framework for Google Business Profile and Meta. CI/CD pipeline. The AI Engineer and Mobile Engineer can build on top of this from day 1 of month 2.

#### The Interview Question
"Show me the last product you shipped from zero to production with under 4 people. Walk me through the three hardest technical decisions and what you'd do differently."

**What you're listening for**: Evidence of pragmatic trade-offs under constraint. Did they choose the boring technology that works, or the exciting technology that demos well? Did they cut scope to hit a deadline? Can they articulate what "good enough" meant for their context?

#### Secondary Question (Empathy Filter)
"Tell me about a time you watched a non-technical person try to use something you built. What did you learn?"

**What you're listening for**: Per locked Decision #5, ALL hires are filtered for "Has this person felt what our customer feels?" — including speed-primary roles. The best Tech Leads have a moment burned into their memory where they saw a real user struggle with something they thought was obvious. If they've never watched a non-technical user interact with their work, they'll build the wrong thing.

#### Red Flag Profile
The Big Tech senior engineer who's "ready to go small." They'll want to set up a proper CI/CD pipeline, comprehensive test coverage, and a microservices architecture before writing a line of product code. They'll suggest Kubernetes for 3 developers. They'll want to "do it right." The right person for this role has shipped 0→1 products that were slightly embarrassing at launch and wildly successful 6 months later.

#### Compensation
- **Base salary**: $160,000-$190,000/year (Austin market for senior full-stack engineer, slightly above market for startup — this person has options)
- **Equity**: 5-12% (co-founder level) or 2-5% (early employee)
- **Notes**: This is the hardest role to fill. The Venn diagram of "can architect a system," "will write code daily," and "comfortable with messy startup pace" is small.

---

### ROLE 3: AI / Prompt Engineer

**Primary Trait**: Speed (with secondary empathy)
**Why Speed**: The AI pipeline is the product's core loop — input → interpretation → generation → approval → action. This person must iterate prompt chains rapidly, test against real restaurant content, and ship improvements weekly. But they also need enough empathy to know what "good" means to Maria — a restaurant owner's standard for a social post is different from a marketer's.

#### Daily Responsibilities
1. **Build and iterate prompt chains** (50% of time): Design, test, and refine prompts for every AI feature (social post generation, review responses, website content, email campaigns, weekly digest). Optimize for quality AND token efficiency.
2. **Quality testing with real content** (30% of time): Generate content for real Austin restaurants. Compare against what the restaurant actually posts. Test with non-technical users: "Does this sound like something you'd post?"
3. **Cost optimization** (20% of time): Monitor token usage per feature. Implement caching strategies. Identify where smaller models can replace larger ones without quality loss.

#### First-Month Deliverable
Working prompt pipeline for the 3 highest-frequency features: social post generation (12/month/user), review response drafting (8/month/user), and conversational interactions. Quality bar: 75%+ of generated content accepted by test users without edits.

#### The Interview Question
"Generate a social media post for a BBQ restaurant in Austin that just added brisket tacos to their menu. Now generate a review response for a 3-star review that says the food was great but the wait was too long. Talk me through your prompt design and what you'd change based on the restaurant owner's reaction."

**What you're listening for**: Do they start with the output (what does the restaurant owner need?) or the input (what model should we use?)? Can they iterate in real-time based on feedback? Do they think about tone, local flavor, and brand voice — or just correctness?

#### Secondary Question (Empathy Filter)
"Show me how you'd test whether a restaurant owner would actually post this AI-generated content without editing it. What does 'good enough to post' mean to Maria, not to you?"

**What you're listening for**: Per locked Decision #5, ALL hires are filtered for "Has this person felt what our customer feels?" The best AI engineers define quality from the user's perspective, not theirs. "Good" for a restaurant owner means: sounds like me, doesn't embarrass me, took zero effort. If the candidate defines quality in terms of BLEU scores or grammatical precision, they're solving the wrong problem.

#### Red Flag Profile
The ML researcher who wants to fine-tune models. They'll propose training custom models on restaurant data, building evaluation frameworks, and publishing papers. You need someone who can get GPT-4o to write a convincing Instagram caption for a taco truck by Thursday. Also red flag: the prompt engineer who's never worked with non-technical end users. "Optimizing for BLEU score" is meaningless when the quality bar is "would Maria post this?"

#### Compensation
- **Base salary**: $140,000-$170,000/year (Austin market for senior AI engineer — demand is high)
- **Equity**: 1-3%
- **Notes**: This role is new enough that compensation varies wildly. Prioritize practitioners over researchers. A person with 2 years of production prompt engineering experience is more valuable than a PhD with 5 years of research.

---

### ROLE 4: Mobile Engineer

**Primary Trait**: Speed
**Why Speed**: The entire product experience is mobile. These owners live on their phones. The conversational interface must feel as natural as texting. This engineer ships the thing users actually touch. Speed means a beautiful, working app in 3 months — not a perfect app in 6.

#### Daily Responsibilities
1. **Build the conversational interface** (60% of time): The chat-first UI that is the entire product. Message input, AI response rendering, content preview (social posts, review responses), one-tap approval flows.
2. **Implement design system** (25% of time): Work from the Product Designer's specs to build a consistent, warm, mobile-first interface. Earth tones, generous whitespace, real business photos.
3. **Integration with backend** (15% of time): Connect to the Lead Engineer's APIs. Handle offline states, push notifications, real-time updates.

#### First-Month Deliverable
Working prototype of the conversational interface: owner can type a message, receive an AI response, preview a social post, and approve it with one tap. Not polished — but functional enough to demo at a restaurant counter.

#### The Interview Question
"Show me a mobile app you've shipped that non-technical users aged 40-60 use regularly. Walk me through one interaction flow and explain what you simplified compared to your first design."

**What you're listening for**: Do they think about the user who picks up the phone while standing at a restaurant cash register? Can they describe a simplification that removed a step or screen? Have they actually watched a non-technical person use their app and changed something based on that observation?

#### Red Flag Profile
The mobile engineer who wants to build a component library first. They'll propose a design system, a state management framework, and a comprehensive navigation architecture before shipping a single screen. You need someone who ships a working screen on day 3 and iterates. Also red flag: the mobile engineer who's only built apps for other engineers or tech-savvy users. If their portfolio is all fintech dashboards and developer tools, they don't know this user.

#### Compensation
- **Base salary**: $140,000-$165,000/year (Austin market, React Native / Flutter specialist)
- **Equity**: 1-2.5%
- **Notes**: Slightly above market to attract someone who's genuinely fast. A mobile engineer who ships 2x faster is worth 1.5x the salary.

---

### ROLE 5: Product Designer

**Primary Trait**: Empathy
**Why Empathy**: This is the role Steve Jobs is completely right about. The designer is the empathy layer of the product. Every screen, every interaction, every error state must feel like it was built by someone who has watched a 52-year-old restaurant owner try to use Mailchimp and felt physical pain. This person will occasionally slow the team down by insisting on getting an interaction right. That is correct. The 5-minute onboarding — the "iPhone moment" — is this person's masterpiece.

#### Daily Responsibilities
1. **Design the conversational interface** (40% of time): The chat-first UI is the entire product surface. Every message format, every preview card, every approval button. This must feel like texting a trusted friend, not using enterprise software.
2. **Design the onboarding flow** (30% of time, months 1-2): The 5-minute onboarding that generates a website, drafts a social post, and makes the owner tear up. This is the conversion moment. Every second of this flow matters.
3. **Create the design system** (30% of time): Visual language, component library, typography, color system. Earth tones. Warm. Local. The feeling of a great local hardware store. This system must be simple enough that the Mobile Engineer can implement it without constant design reviews.

#### First-Month Deliverable
Complete design for the onboarding flow (5-minute experience from "tell me about your business" to "here's your website + first social post") and the conversational interface (core chat UI, content preview cards, one-tap approval). Delivered as interactive Figma prototype, tested with 3+ non-technical users.

#### The Interview Question
"Design the notification a restaurant owner sees when they get their first 1-star review since signing up for LocalGenius. They're going to feel panic. What do they see, what can they do, and how does the experience end?"

**What you're listening for**: Do they start with the emotion (panic, fear of public embarrassment) or the UI (notification design, button placement)? Do they think about what happens AFTER the notification — how the owner feels when they've handled it? The best answer walks through the entire emotional arc: panic → guidance → action → relief.

#### Red Flag Profile
The designer who leads with their Dribbble portfolio. Beautiful static mockups of dashboards no one uses. You need someone who has designed for people who don't know what a "hamburger menu" is. Also red flag: the designer who can't compromise on fidelity. At this stage, the designer ships wireframes on Monday, sees them implemented (imperfectly) on Wednesday, and iterates by Friday. If they need pixel-perfect implementation before moving on, they'll bottleneck the entire team.

#### Compensation
- **Base salary**: $120,000-$145,000/year (Austin market, senior product designer)
- **Equity**: 1-2.5%
- **Notes**: Slightly below engineering salaries — this is Austin market reality, not a values statement. Offset with meaningful equity and the creative ownership of designing an entire product from scratch.

---

### ROLE 6: Growth / Go-to-Market Lead

**Primary Trait**: Empathy
**Why Empathy**: This person sits in restaurants. Attends Chamber of Commerce meetings. Gives demos on an iPad at the counter. They are the face of LocalGenius to every early customer. If they view restaurant owners as "leads" or "targets," they will fail. They must genuinely like small business owners — enjoy their stories, respect their expertise (cooking, cutting hair, fixing pipes), and feel the weight of how hard it is to run a business AND do marketing. This person's authentic relationships are the growth engine for months 1-3.

#### Daily Responsibilities
1. **Direct outreach** (50% of time): Visit 12-15 restaurants per day in target Austin districts. 90-second iPad demo at the counter. Not selling — showing. "Look what this does for your business."
2. **Community partnerships** (25% of time): Build relationships with TRA Austin, Chamber of Commerce, SCORE mentors. Sponsor and attend events. Become a known face in Austin's local business community.
3. **Feedback collection** (25% of time): Document every objection, every question, every "wow" moment. Feed insights to CEO and Product Designer weekly. This person is the team's antenna.

#### First-Month Deliverable
50 restaurant demos completed. 15+ trial sign-ups. 5+ paying customers. A written "Objection Log" documenting the top 10 reasons restaurant owners said no — ranked by frequency — with recommended product or messaging changes for each.

#### The Interview Question
"You're standing at the counter of a restaurant at 2:30 PM — between lunch and dinner rush. The owner is wiping down tables and checking their phone. You have 60 seconds before they need to prep for dinner. Go."

**What you're listening for**: Do they open with a pitch or a question? Do they acknowledge the owner's time ("I know you're busy prepping, this takes 60 seconds")? Do they make it about the owner's business, not about LocalGenius? The best answer starts with something specific about THIS restaurant — "I noticed your Google listing says you close at 9 but your door says 10" or "Your tacos got a great writeup in Austin Eater but your Instagram hasn't posted since March."

#### Red Flag Profile
The SaaS sales rep who "wants to get closer to the customer." They'll have great metrics from their last role (quota attainment, pipeline management) but they've never sold to someone who answers the phone while frying chicken. Also red flag: the community manager who's never done revenue-accountable work. This person must be comfortable being measured by conversions, not by "relationships built." Empathy drives the approach; revenue validates it.

#### Compensation
- **Base salary**: $85,000-$105,000/year (Austin market, B2SMB GTM/sales role)
- **Variable**: $15,000-$25,000/year performance bonus tied to paying user milestones (not commission per user — we want relationship-building, not hard closing)
- **Equity**: 0.5-1.5%
- **Notes**: Lower base reflects Austin market for this role. Performance bonus aligns incentives without creating pushy sales behavior.

---

## 3. Org Structure (6 People)

```
Founder/CEO
├── Technical Co-Founder / Lead Engineer
│   ├── AI / Prompt Engineer
│   └── Mobile Engineer
├── Product Designer
└── Growth / GTM Lead
```

**Decision authority**:
- **Product decisions** (what to build): CEO, informed by Designer and GTM Lead's customer insights.
- **Technical decisions** (how to build): Tech Lead, with CEO as tiebreaker when shipping timeline conflicts with architecture.
- **Design decisions** (how it looks/feels): Designer, with CEO as tiebreaker when craft conflicts with shipping.
- **GTM decisions** (where to focus outreach): GTM Lead, with CEO as escalation for budget allocation.

**No dedicated management layer.** At 6 people, management overhead kills velocity. The CEO manages people. The Tech Lead manages architecture. Everyone manages their own work.

---

## 4. Communication Operating System

### 4.1 Meetings (Minimal)

| Meeting | Frequency | Duration | Who | Purpose |
|---------|-----------|----------|-----|---------|
| Daily standup | Daily, 9:00 AM | 10 min max | All 6 | What I did yesterday, what I'm doing today, what's blocking me. No discussion — take it offline. |
| Weekly product review | Monday, 2:00 PM | 45 min | All 6 | Demo what shipped last week. Review customer feedback from GTM Lead. Prioritize this week's sprint. |
| Design review | Wednesday, 11:00 AM | 30 min | CEO + Designer + Mobile Eng | Review design progress. This is where craft meets speed. Resolve fidelity trade-offs. |
| GTM debrief | Friday, 4:00 PM | 20 min | CEO + GTM Lead | Week's outreach results. Top objections. Pipeline update. |

**Total meeting time per person: ~2.5 hours/week.** No all-hands. No retrospectives in months 1-3. No planning poker. Ship.

### 4.2 Async Communication

- **Primary channel**: Slack (or Linear, whatever the Tech Lead prefers). One channel per function (#engineering, #design, #growth, #general). No DMs for decisions — everything in channels so the team has shared context.
- **Decision log**: Shared doc (Notion or Google Doc) where every non-trivial decision is logged with reasoning. Prevents "why did we do it this way?" conversations 3 months later.
- **Customer insight feed**: GTM Lead posts one customer insight per day in #general. Not a formal report — a quote, an observation, a photo from a restaurant visit. Keeps the whole team connected to the user.

### 4.3 Conflict Resolution

At 6 people, conflict is personal. There's nowhere to hide.

1. **Technical disagreements**: Tech Lead decides. If the AI Engineer or Mobile Engineer disagree strongly, they make their case once. Tech Lead decides. Move on.
2. **Product vs. engineering trade-offs**: CEO decides with Tech Lead's input. CEO owns "what," Tech Lead owns "how."
3. **Design vs. speed**: CEO mediates. Default: ship the 80% version now, improve next sprint. Exception: onboarding flow, which gets extra time because it IS the conversion.
4. **Nuclear option**: If any conflict lasts more than 24 hours, CEO calls a 15-minute meeting with the parties involved. State both positions, decide, move on. No lingering resentment — there's no time for it.

---

## 5. Do NOT Hire List (With Timing Triggers)

| Role | Why Not Now | Hire When |
|------|-----------|-----------|
| **Sales team** | CEO + GTM Lead handle all selling in months 1-6. Adding a sales rep before product-market fit is proven creates pressure to sell what you have, not build what's needed. | MRR > $40K/month AND 30-day retention > 80% for 3 consecutive months AND GTM Lead is capacity-constrained (can't visit more restaurants without help). Estimated: Month 7-9. |
| **Customer Success Manager** | Product should be self-service. If users need hand-holding, the product is wrong. GTM Lead handles early customer relationships. | Monthly churn > 4% despite product improvements AND exit surveys show "I didn't know how to use it" as top reason. Estimated: Month 8-10. Hire 0 if churn stays under 3%. |
| **Data Scientist** | 500 users don't generate enough data for ML-grade analysis. CEO + AI Engineer can run SQL queries and basic cohort analysis in months 1-6. | Active users > 2,000 AND product team needs predictive churn modeling, content recommendation, or personalization beyond rule-based logic. Estimated: Month 10-14. |
| **Marketing team** | The product IS the marketing in months 1-6. No brand campaigns, no content marketing team, no social media manager for LocalGenius itself. GTM Lead + product-led growth handle all acquisition. | After paid acquisition starts (month 4+) AND paid channels prove positive ROI AND need for dedicated creative / campaign management exceeds CEO + GTM capacity. Estimated: Month 9-12. |
| **Second engineer (any specialty)** | The 3-engineer team (Tech Lead + AI + Mobile) can ship v1 for restaurants. Adding a 4th engineer before v1 ships adds coordination overhead without proportional velocity gain. | After v1 ships AND vertical expansion creates parallel workstreams that 3 engineers can't handle simultaneously. Estimated: Month 6-8. First hire: backend/infrastructure engineer to free Tech Lead for architecture work. |
| **COO / Operations** | At 6 people, operations IS the CEO's job. Hiring a COO is a signal that the CEO can't handle the complexity — which is fine at 30 people, premature at 6. | Headcount > 15 AND CEO is spending >50% of time on internal coordination instead of product/customer/fundraising. Estimated: Month 12-18. |

---

## 6. Compensation Summary

| Role | Base Salary | Equity | Variable | Total Cash Comp |
|------|:----------:|:------:|:--------:|:--------------:|
| Founder/CEO | $130K-$160K | 8-60% | — | $130K-$160K |
| Tech Co-Founder / Lead Engineer | $160K-$190K | 2-12% | — | $160K-$190K |
| AI / Prompt Engineer | $140K-$170K | 1-3% | — | $140K-$170K |
| Mobile Engineer | $140K-$165K | 1-2.5% | — | $140K-$165K |
| Product Designer | $120K-$145K | 1-2.5% | — | $120K-$145K |
| Growth / GTM Lead | $85K-$105K | 0.5-1.5% | $15K-$25K bonus | $100K-$130K |
| **Total annual payroll** | | | | **$790K-$960K** |

**Annual payroll of $790K-$960K** is the single largest cost. At a $2M seed round, this gives 20-24 months of runway with GTM budget, infrastructure costs, and AI API costs included.

**Equity pool**: Reserve 15-20% of the cap table for the founding team (excluding Founder/CEO's founding equity). This is standard for seed-stage startups and ensures each hire has meaningful ownership.

---

## 7. The First 90 Days — Team Calendar

| Week | CEO | Tech Lead | AI Engineer | Mobile Engineer | Designer | GTM Lead |
|------|-----|-----------|-------------|----------------|----------|----------|
| 1-2 | Onboard team. Set up workspace (co-located or hybrid). Align on v1 scope. Visit 10 restaurants. | Deploy backend infrastructure. Set up CI/CD. Database schema with multi-tenant model. | Prototype prompt chains for social posts + review responses. | Set up React Native project. First screen: conversational input. | Research phase: visit 5 restaurants with CEO. Start onboarding flow wireframes. | Map Austin restaurant districts. Build target list. Begin door-to-door in South Congress. |
| 3-4 | Review AI output quality. First customer demos (with GTM Lead). Prioritize sprint based on demo feedback. | API integrations: Google Business Profile, Meta posting. User auth flow. | First working prompt pipeline: social posts generating at 70%+ approval in testing. | Working chat UI connected to backend. Message send/receive. Content preview cards. | Onboarding flow complete in Figma. Test with 3 non-technical users. Iterate. | 65 restaurants visited. Secure TRA sponsorship. Brief SCORE mentors. |
| 5-8 | Onboard first 20 customers personally. Document friction points. Weekly product decisions based on real usage data. | Review management integration. Email/SMS pipeline (pro tier). Performance optimization. | Refine prompts based on real user feedback. Add review response + weekly digest generation. Optimize token usage. | Implement onboarding flow from Designer specs. Push notification system. One-tap approval. | Design system documentation. Weekly Digest template. Error states and edge cases. | TRA event demo. 130+ restaurants visited. First case study draft. 60+ paying users. |
| 9-12 | Compile "First 20 Learnings." Prepare retention analysis. Decide: scale or fix. Begin fundraising prep if retention holds. | Local SEO agent (pro tier). Analytics dashboard (simple — Weekly Digest data, not BI tool). Bug fixes from real usage. | Content quality improvements based on 30 days of production data. Vertical-specific prompt templates for restaurants. | Polish and iterate based on user feedback. Performance optimization. Offline handling. | Iterate all flows based on usage data. Design referral program UI. Prepare for vertical expansion design needs. | 300+ paying users (base target). Growth report compiled. Objection log v3. Referral program launched. |

---

## 8. Culture Principles (Not Values Posters — Operating Rules)

1. **The customer is in the room.** GTM Lead's daily insight in #general ensures no one builds in a vacuum. Every product debate ends with "what would Maria do?"

2. **Ship, then polish.** Default to shipping the 80% version. The only exception: the onboarding flow, which gets 95% polish because it IS the product's first impression.

3. **Disagree, then commit.** Make your case once, clearly. If the decision-maker disagrees, commit fully. No "I told you so" if it fails. No passive resistance.

4. **No heroes.** If someone is working 80+ hours, the system is broken, not the person. Sustainable pace means ~55-60 hours/week in months 1-3 (intense but not destructive), dropping to ~45-50 by month 4.

5. **Write it down.** If a decision isn't logged, it didn't happen. If feedback isn't documented, it'll be forgotten. Slack messages expire from memory. The decision log and the customer insight feed are the team's institutional memory.

6. **Eat at restaurants.** The team eats lunch at a different Austin restaurant every Friday. Not just for fun — for empathy. Notice the owner behind the counter. Notice the Google listing on the door. Notice the Instagram handle on the receipt. This is your user. Know them.

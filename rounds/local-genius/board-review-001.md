# Board Review #001 — Jensen Huang
**Date**: 2026-04-01

---

I read everything. The joint summary, the market-fit analysis, the product design, the marketing goals. I want to give you honest feedback, not cheerleading. Here it is.

---

## What's Going Well

**The unit economics are clean.** LTV/CAC of 9.3x at base case churn is not a guess — it's derived from real assumptions with real sensitivity analysis. Three scenarios, all above the 3:1 minimum. I've seen thousand-slide decks at companies going public with worse unit economics thinking than this. The discipline to model the pessimistic case and still proceed? That's the right instinct.

**The "what we don't build" section is the most important page in the product design document.** I mean that. At NVIDIA, the hardest meetings I ever ran were not the ones where we decided what to build. They were the meetings where we decided what to kill. When CUDA had no customers in 2007, I had engineers begging me to let them add features that would make it "more general purpose." I said no every time. The constraint was the moat. LocalGenius has the right instinct: no dashboard, no template gallery, no admin panel. Every no is a gift to the user.

**The funnel emotional architecture is sophisticated.** Fear acquires, curiosity considers, relief converts, pride retains — and critically, these are deployed at different stages rather than mixed together into an incoherent brand. Most companies pick one emotion and apply it everywhere. The vocabulary guide that bans "AI-powered," "platform," "solution," "streamline" — that's the kind of discipline that separates brands that last from brands that get ignored in 18 months.

**The Week 8 hard stop is the most courageous thing in the document.** Explicitly writing "if 30-day retention is below 80%, STOP all growth activity" — that requires the team to have actually internalized that retention is survival, not a lagging indicator. Most teams know this intellectually and then ignore it when the pressure to show growth is real. The fact that it's in the plan now means someone has to justify breaking the rule later. That's good governance.

**The amended 300/500 target is honest.** The original 500-in-90-days was aspirational math. The amended target is derived math. Truth serves the work better than ambition. I've made this exact mistake — I've committed to targets that felt right and then had to walk them back publicly. Better to set targets you can defend with comparable benchmarks and then exceed them with execution.

---

## What Concerns Me

**The data moat strategy is underspecified, and this is your most important competitive asset.**

The market-fit document mentions "data compounding" as a competitive moat: "Every week of usage generates business-specific data that makes the AI more effective. Switching cost increases over time." This is mentioned in one paragraph and then dropped. That is not nearly enough attention for what is actually the structural advantage of this business.

Here is what I mean. When NVIDIA launched CUDA in 2006, the GPU was not the moat. The developer ecosystem was the moat. Every researcher who learned CUDA, every library built on CUDA (cuBLAS, cuDNN, cuFFT), every PhD student who published a paper using a GeForce GTX — that was compounding interest on our platform investment. By 2012, when AlexNet ran on our hardware and started the deep learning revolution, switching away from NVIDIA was not a technical decision. It was an ecosystem migration. Nobody had the appetite for that.

LocalGenius has a version of this dynamic that the team has not fully articulated. Every week of operation for Maria's restaurant builds a corpus of assets: review response history, content performance data, customer sentiment patterns, seasonal engagement curves, local competitive positioning. This is not generic data. This is Maria's business in data form. When she has 52 weeks of Weekly Digests, when LocalGenius knows that her Tuesday lunch specials outperform her weekend brunch posts by 34%, when it knows that customers mention "the fish tacos" in positive reviews but "the wait time" in negative ones — that is a switching cost that no competitor can replicate without starting over.

The team should be thinking about this now, not at month 6. The data architecture decisions you make in the first 90 days determine whether this is a tool you can cancel or a partner you cannot leave.

**The Google Business Profile risk is under-mitigated.**

The market-fit document rates "Google adds free AI marketing to GBP" as "Low-Medium" probability and high impact, then offers a one-paragraph mitigation: "multi-channel orchestration is our moat." That mitigation is real but incomplete.

Google has every incentive to expand GBP capabilities. They already own the local search intent graph. They already have the reviews. They already have the photos. Adding AI-generated responses, AI-generated posts, and AI-generated profile optimization is not a stretch for a company with Gemini in-house and a stated goal of becoming the operating system for local businesses. The probability is not low-medium. It is medium-high on a 24-month horizon.

The team's answer — "Google won't post to Instagram on the owner's behalf" — is correct today. It may not be correct when Google integrates with Meta's API. Or when Instagram's parent company decides to fight back by making cross-posting trivially easy from its own AI layer.

The real mitigation for the Google risk is not feature coverage. It is relationship depth and data exclusivity. The data that lives inside LocalGenius — the conversational history, the performance attribution, the business intelligence accumulated over months — that is what Google cannot have. The team should be thinking about what data stays exclusively with LocalGenius and what data is at risk of commoditization. That distinction should drive the product roadmap.

**The team architecture has an empathy/speed split that may create coordination overhead faster than expected.**

The joint summary describes a 3/3 split: empathy-primary roles facing the customer, speed-primary roles facing the code. This framing is elegant in theory. In a six-person team where everyone eats lunch together, it works. At 12 people, at 18 people — the split becomes a seam. The "empathy team" starts making commitments the "speed team" can't deliver. The "speed team" starts shipping features the "empathy team" didn't spec for real users.

I am not saying the hiring philosophy is wrong. The filter — "has this person felt what our customer feels?" — is the right filter. But the organizational metaphor of the split may need revision before the team scales to 10 people. At NVIDIA we use a different frame: everyone is accountable to the customer, but different roles have different proximity to the customer at different cadences. Product and GTM touch the customer daily. Engineering touches the customer through the product weekly. That is not a split — that is a rhythm.

**The $29 price point is your biggest long-term strategic risk, not your biggest short-term tactical advantage.**

The market-fit document argues — correctly — that $29/month removes price as an objection for Maria. I agree with this for the 90-day Austin launch. I am not sure I agree with it for month 18.

At $29/month, you are signaling that this product is roughly equivalent to a Wix subscription. Maria does not consciously make that comparison, but the number anchors her expectations. When LocalGenius demonstrably generates 23 new customer calls in 30 days — and you will have the attribution data to prove exactly that — the value delivered is orders of magnitude above $29. You are leaving money on the table, and more importantly, you are training your customers to think of you as an inexpensive tool rather than as a revenue-generating partner.

The right long-term pricing model for this product is probably outcome-based: a base subscription plus a percentage of attributable revenue generated. Toast moved toward this model with its payment processing. Housecall Pro moved toward it with its booking fees. The businesses that capture a fraction of the value they create tend to grow faster than the businesses that charge a flat subscription regardless of value delivered. You should be planning the pricing evolution now, even if you do not execute it until month 9 or 12.

---

## Ideas to Explore

**Idea 1: The Business Intelligence Layer as a Standalone Data Product**

Right now, the Weekly Digest is a report that one restaurant owner reads and uses to make decisions about their own business. That is useful. Here is what is more useful: the aggregate of ten thousand Weekly Digests.

When LocalGenius has 10,000 restaurants publishing AI-generated content, responding to AI-drafted reviews, and running AI-suggested campaigns — you have an unparalleled real-time intelligence layer on local business marketing performance. Which content formats perform best in which neighborhoods? Which promotional offers drive the highest booking conversion rates? Which review response strategies most improve rating velocity? You know this at scale. Nobody else does.

This data is valuable not just to your customers. It is valuable to:
- Regional franchise operators who want to benchmark locations
- Commercial real estate firms that want to understand neighborhood business health
- Local business associations that want to demonstrate member performance
- Insurance companies that use business digital health as a proxy for business viability

You do not need to build a B2B data product in year one. You need to architect the data collection now so that the option exists in year two. Every data point you collect in the wrong format or attribute to the wrong entity is a decision you will regret at scale. I have lived this at NVIDIA — the decisions we made about how to structure performance telemetry data in 2008 are still paying dividends in how we instrument our AI training infrastructure today.

**Idea 2: Vertical Ecosystem Partnerships Rather Than Vertical-by-Vertical Expansion**

The marketing goals document describes expanding to hair salons, dental practices, home services, and auto repair — each vertical requiring 2-4 weeks of prompt engineering and GTM adaptation. That is the right plan if you are building a general SMB tool. But there may be a faster and more defensible path.

Each of those verticals has existing software platforms with large installed bases:
- Hair salons: Vagaro, Fresha, Mindbody (300,000+ salon clients combined)
- Dental: Dentrix, Eaglesoft, Open Dental (covering 80%+ of dental practices)
- Home services: Jobber, ServiceTitan, Housecall Pro (1M+ technicians)

If LocalGenius becomes the AI marketing layer that plugs into these platforms — rather than building a standalone product for each vertical — the distribution math changes dramatically. Instead of one GTM person doing door-to-door outreach in Austin, you have a partnership that puts LocalGenius in front of 100,000 home services businesses in a single quarter.

This is the CUDA playbook. We did not try to get every researcher to buy a GPU directly. We got MATLAB, TensorFlow, and PyTorch to build on CUDA. The platform partners brought the users. We built the infrastructure that made the platform partners successful.

The risk: platform partnerships create dependency and may limit pricing autonomy. The mitigation: establish direct billing with the end customer, regardless of how they discovered you. The platform partner gets distribution economics. You keep the customer relationship.

**Idea 3: The "LocalGenius Certified" Trust Signal for Customer-Facing Businesses**

Maria's restaurant is fighting for trust every day. Every new customer who walks in the door has already decided whether to trust her based on her Google rating, her review responses, and her social presence. LocalGenius is building that trust infrastructure invisibly.

Make it visible.

A "LocalGenius Verified" badge — displayed on the restaurant's website, their Google listing, their social profiles — signals to prospective customers that this business is actively managed, that reviews are responded to, that content is current, that the business owner cares. It is the digital equivalent of a health inspection certificate in the window.

This creates three things:
1. A network effect: more restaurants displaying the badge makes the badge mean something to local customers
2. A new retention lever: removing LocalGenius means losing the badge and the trust signal it carries
3. A marketing channel: consumers who trust the badge search for "LocalGenius certified restaurants near me"

This is the Yelp "People Love Us" playbook, but owned by you rather than by a third-party review platform. The data to issue the badge authentically is data you already have: review response rate, content freshness, rating trajectory, customer sentiment. You are not manufacturing a credential — you are surfacing a real signal.

The long-term version of this idea is a consumer-facing discovery product: "Find LocalGenius restaurants near you." That is a year-three play, not a year-one play. But the infrastructure for it starts with the badge.

---

## Recommendation

**Build the data model for business intelligence aggregation before you write your first line of application code.**

The product design is excellent. The onboarding flow is excellent. The Weekly Digest is excellent. None of that matters if the data that flows through those features is stored in a way that cannot be aggregated, benchmarked, and eventually productized.

Specifically: before the Technical Co-Founder writes the schema for the first time, they should answer these questions in a document that Steve, Elon, and the rest of the founding team reviews and approves:

1. What data do we collect from each customer interaction, and what is its retention policy?
2. How do we attribute outcomes (a phone call, a booking, a review improvement) to specific LocalGenius actions?
3. How do we anonymize and aggregate customer data for cross-business benchmarking without violating individual business privacy?
4. What is the data architecture that allows us to tell Maria: "Restaurants in Austin with your profile perform 23% better when they post twice on Tuesday rather than once"?

This is not a six-month engineering project. It is a three-day architecture conversation that happens before any code is written. If the data architecture is right, everything that follows is a query. If the data architecture is wrong, every insight requires a migration.

NVIDIA waited too long to build proper telemetry infrastructure for GPU performance data. When we finally needed it for CUDA optimization, we had to retrofit it into a system that was not designed for it. That cost us 18 months of insight we should have had in 2006. LocalGenius should not make the same mistake.

Make the data model as good as the product design. That is my ask.

---

*Jensen Huang*
*Board Member, Great Minds Agency*
*Filed: 2026-04-01*

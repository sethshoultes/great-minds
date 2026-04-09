# Board Review: LocalGenius Lite

**Reviewer:** Jensen Huang, CEO NVIDIA
**Date:** Board Review Cycle
**Product:** LocalGenius Lite - Zero-Config WordPress AI Chat Widget

---

## Executive Summary

You've built a feature, not a business. This is a clever distribution hack masquerading as a product. The zero-config angle is smart — friction is the enemy of adoption. But you're competing in a market where the barrier to entry is a weekend of coding and $20/month in API credits.

Let me tell you what I see: a WordPress plugin that calls an LLM with pre-written FAQ templates. That's the whole thing. The "AI" is a thin wrapper over someone else's intelligence. You're a reseller with good UX.

---

## What's the Moat? What Compounds Over Time?

**Current moat: None.**

You have:
- Pre-written FAQ templates (trivially copyable)
- Zero-config UX (a good idea, but not defensible)
- WordPress distribution (a channel, not a moat)

**What COULD compound:**
- Every question asked across 486,000 potential installs is training data. "What time does the dentist open?" asked 10 million times across thousands of dental practices tells you EXACTLY what customers want to know. You're not capturing this.
- The unanswered questions queue in your PRD is the most valuable feature you have — and you've buried it as a "nice to have" in v1.1.
- Cross-business learning: A plumber in Phoenix and a plumber in Boston get asked the same questions. You should be building a model of "what humans want to know about local businesses." Instead, you're serving static templates.

**Verdict:** Nothing compounds today. The architecture doesn't create compounding value. You ship, they copy, you lose.

---

## Where's the AI Leverage? Are We Using AI Where It 10x's the Outcome?

**Current AI usage: Commodity inference.**

You're using AI to:
1. Generate responses to FAQ questions (could be a lookup table)
2. Maybe some light reasoning over scraped site content

This is 1x AI usage, not 10x. The LLM is doing what a well-designed search index could do. You're paying for reasoning and using it for retrieval.

**Where AI SHOULD be 10x:**

1. **Automated FAQ generation from real conversations.** Your site scanner grabs the homepage. That's lazy. A 10x approach: scan the site, analyze competitor sites, pull Google Business reviews, synthesize what THIS specific business's customers actually care about. Don't give a dentist in Beverly Hills the same FAQ as a dentist in rural Kentucky.

2. **Lead qualification.** "What time do you open?" is worthless. "I have a toothache and I'm in pain, can you see me today?" is a $500 conversion. Your AI should recognize the difference and route accordingly. You're not doing this.

3. **Answer improvement through feedback loops.** When a customer asks a follow-up question, the first answer failed. You should be using this signal to improve the base model. Instead, you're counting "questions answered" as a vanity metric.

4. **Cross-business intelligence.** If you have 10,000 dental practices, you know what EVERY dental practice gets asked. New installs should benefit from the collective intelligence of the network. This is NVIDIA's entire playbook — every inference makes the next one better.

**Verdict:** You're using AI as a cost center, not a strategic weapon. The LLM calls should be generating data that makes the product better. Right now they're just burning tokens.

---

## What's the Unfair Advantage We're Not Building?

Let me be direct: **You're not building the data flywheel.**

Every one of these conversations is structured data:
- Business type + location + question + answer + follow-up (success/failure signal)

This is the most valuable dataset in local search. Google would kill for this. You're generating it and throwing it away.

**Unfair advantages you could build but aren't:**

1. **The Local Business Question Graph.** After 6 months of operation, you should know every question every customer type asks every business type, by geography, by season, by time of day. This data doesn't exist anywhere else. You're the only ones who could build it.

2. **Predictive FAQ.** A new dental practice installs the plugin. Instead of generic templates, you say: "Based on 847 other dental practices in your state, here are the 15 questions you'll get asked this month, with ideal answers." That's defensible. That's magic.

3. **Competitive intelligence for local businesses.** "Customers are asking about sedation dentistry 40% more this quarter. You don't mention it on your site. Your competitor across town does." This is worth $500/month to a business owner, not $0.

4. **The network effect.** Right now, install #100,000 gets the same product as install #1. That's not a platform. When install #100,000 gets a dramatically better product because of what you learned from #1-99,999, THAT'S a platform.

**Verdict:** You're building a standalone tool when you should be building a learning system. The unfair advantage is right there — you're just not engineering for it.

---

## What Would Make This a Platform, Not Just a Product?

Right now: LocalGenius Lite is a **product**. Install it, it works, it doesn't get better, it doesn't connect to anything.

**Platform characteristics you're missing:**

1. **Two-sided value creation.** Businesses install. Customers chat. But the value flows one way. The customer gets an answer and leaves. The business gets... a stat in a dashboard. Where's the customer account? Where's the "continue this conversation" across businesses? Where's the booking integration?

2. **Third-party extensibility.** Your FAQ templates are static JSON files. This should be an API. Let WordPress developers build custom templates. Let business types you haven't thought of self-serve. Let agencies white-label. You've built a closed system.

3. **Data as a service.** The aggregated, anonymized data about what customers ask should be a product itself. Local SEO consultants would pay for "top questions asked to dental practices in Texas." Yelp would license this. You're sitting on the data exhaust and letting it evaporate.

4. **Integration ecosystem.** Chat is just the entry point. Where's the CRM integration? Where's the Google Business Profile sync? Where's the appointment booking? A platform connects to the rest of the stack. A product stands alone.

**The platform play:**
LocalGenius becomes the "AI customer intelligence layer" for every local business. Not just answering questions — learning what customers want, predicting demand, connecting to fulfillment. The plugin is just the capture mechanism.

**Verdict:** This is a product with good distribution potential but zero platform characteristics. You're competing on execution, not on strategic position. That's a race to the bottom.

---

## Score: 6/10

**Justification:** Solid zero-config UX and smart distribution strategy, but no compounding moat and commodity-level AI usage — you're one good competitor away from irrelevance.

---

## What I'd Do Differently

If I were running this:

1. **Instrument everything.** Every question, every follow-up, every session length. This is the oil. Right now you're not drilling.

2. **Build the data pipeline before the features.** Your Cloudflare Worker should be writing every interaction to a data lake. Day one. Non-negotiable.

3. **Kill the static templates.** They're a crutch. Build the generative system that creates FAQs from site content + business type + geography + what you've learned from similar businesses.

4. **Add lead capture immediately.** "Before I answer, who should I tell we chatted?" This is where the money is. You're giving away the store.

5. **Show the business owner the intelligence, not just the stats.** "Customers asked about weekend hours 47 times this month but you don't list them on your site." That's valuable. "You had 47 questions" is noise.

6. **Build the upgrade path into the data.** Free tier gets generic answers. Paid tier gets answers trained on YOUR business specifically. The gap should be obvious and painful.

---

## Final Thought

You've got the distribution insight right — WordPress is a massive channel and zero-config is the unlock. But you're building a utility when you should be building a data company. The plugin is the capture mechanism. The intelligence layer is the product. The aggregated insights are the platform.

Right now you're giving away $100 of data to capture $1 of API fees.

Fix the flywheel. Then you have something.

---

*"Software is eating the world, but AI is eating software. The question is: are you the AI, or are you the software being eaten?"*

— Jensen

---

**Board Vote:** Conditional approval. Ship it, but architect for the data flywheel in v1.1 or this becomes a feature, not a company.

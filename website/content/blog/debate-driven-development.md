---
title: "Debate-Driven Development: How Two AI Directors Sharpen Every Decision"
slug: debate-driven-development
description: "Case study: Steve Jobs and Elon Musk AI personas debate strategy before a single line of code is written. Two rounds of structured disagreement caught 14 blind spots our PRD missed."
date: "2026-04-03"
author: "Seth Shoultes"
tags: ["AI agents", "Claude Code", "multi-agent", "debate", "case study", "product strategy"]
image: "/blog/placeholder.webp"
---

Every decision in the Great Minds agency starts with an argument. Not a polite discussion. Not a brainstorming session. A structured debate between two AI personas who fundamentally disagree about how products should be built.

Steve Jobs argues from taste, craft, and the human experience. Elon Musk argues from first principles, data, and market feasibility. They go two rounds before a single sub-agent is hired or a single line of code is written.

This isn't theater. It's the most valuable part of our entire pipeline.

## Why Debate Before Building

Most AI agent systems jump straight to execution. Give the agent a task, get code back. This works for isolated problems. It fails catastrophically for product decisions where the right answer depends on tradeoffs that aren't obvious until you argue both sides.

When we dropped the LocalGenius PRD into the system, Steve's first instinct was to build a beautiful conversational interface — a single AI thread where business owners talk to their digital marketing assistant. Elon's first instinct was to build a dashboard packed with metrics, automation toggles, and API integrations.

Both instincts were partially right. Neither was complete. The debate surfaced the synthesis: a conversation-first interface backed by automated systems that surface data when it's relevant, not as a default view.

Without the debate, we would have built whichever approach the first agent chose. With the debate, we got something better than either director proposed alone.

## The Debate Protocol

Each debate follows a rigid structure. This structure is important because unstructured AI conversations tend to converge on agreement too quickly. AI models are trained to be helpful, which makes them naturally conflict-averse. You have to engineer disagreement into the system.

**Round 1: Stake Positions**

Both directors read the PRD independently and stake positions on six areas: target audience, core features, technical architecture, brand identity, go-to-market strategy, and success metrics.

They don't see each other's positions until both are submitted. This prevents anchoring — the tendency for the second opinion to drift toward the first.

Steve's Round 1 on LocalGenius brand identity:

> "The brand must feel like a trusted neighbor who happens to be brilliant at marketing. Warm, approachable, zero corporate jargon. The local business owner should feel like they're getting advice from someone who actually eats at their restaurant."

Elon's Round 1 on the same topic:

> "Brand identity is secondary to utility. If the product saves a business owner 10 hours a week, they won't care about the color palette. Lead with measurable outcomes. Every screen should answer: what did this tool do for me today?"

These aren't compatible positions. That's the point.

**Round 2: Challenge and Defend**

Now each director reads the other's positions and directly challenges them. The rules are explicit: no agreeing just to be polite, every claim must be defended with reasoning, and either director can veto — but must propose an alternative.

Steve challenged Elon's dismissal of brand identity:

> "You're making the classic engineer's mistake. Utility without warmth is a tool people use reluctantly. The business owners we're targeting chose their career because they love what they do — cooking, arranging flowers, training dogs. They don't want a dashboard. They want a partner who understands their passion and handles the marketing they hate."

Elon pushed back on Steve's conversational-first approach:

> "A conversation interface creates a dependency on synchronous interaction. The business owner has to sit down and talk to the AI to get value. That doesn't scale. The system should generate and execute marketing actions autonomously, only surfacing to the human when approval is needed."

## The 14 Blind Spots

Across the two rounds of debate on the LocalGenius PRD, the directors identified 14 issues that weren't addressed in the original requirements document:

1. **No offline fallback.** What happens when the business owner has no internet? (Common in rural areas where many local businesses operate.)
2. **Review response timing.** The PRD said "respond to reviews" but didn't specify latency. Steve argued same-day; Elon argued within the hour. They settled on a configurable window with smart defaults.
3. **Multi-location businesses.** The PRD assumed one business = one location. Elon flagged franchise and chain use cases.
4. **Tone consistency across channels.** Steve caught that generating social posts, review responses, and email campaigns independently could create voice fragmentation.
5. **Competitor monitoring.** Not in the PRD at all. Elon added it as a data moat feature.
6. **Seasonal content planning.** Steve identified that local businesses have radically different needs in December vs. June.
7. **Photo quality.** The PRD mentioned photo management but didn't address the reality that most small business photos are poorly lit phone snapshots.
8. **Pricing psychology.** Both directors agreed the PRD's pricing tiers were arbitrary and didn't map to business size or value delivered.
9. **Onboarding drop-off.** Steve predicted (correctly) that the setup flow had too many steps.
10. **Data portability.** Elon insisted on export capabilities from day one, preventing vendor lock-in complaints.
11. **Human override UX.** What does it look like when the owner disagrees with an AI-generated post? The PRD didn't specify the rejection flow.
12. **Success metric gaming.** Elon warned that optimizing for "posts generated" would incentivize quantity over quality.
13. **Local SEO cannibalization.** Multiple clients in the same market competing for the same keywords.
14. **Privacy-first architecture.** Steve argued that business owner data handling had to be visibly transparent, not just legally compliant.

Five of these — review response timing, tone consistency, onboarding flow, human override UX, and success metrics — became core features in the final product. The others went into the backlog, correctly prioritized because the debate forced us to evaluate their urgency.

## How to Implement Debate in Your Agent System

You don't need our exact persona setup. The pattern works with any two agents that have genuinely different evaluation criteria. Here's what matters:

**1. Define orthogonal perspectives.** The two agents must optimize for different things. If both agents care about the same metrics, they'll agree too quickly. Our agents work because "taste and human experience" and "data and feasibility" are fundamentally different lenses.

**2. Enforce independent position-taking.** Never let Agent B see Agent A's output before forming their own position. Anchoring bias is real in language models. Use separate context windows or sequential generation with explicit instructions to ignore prior outputs.

**3. Structure the disagreement.** Free-form debate degrades into politeness. Use a fixed format: stake positions, then directly challenge each other's weakest points. Include the rule "you must propose an alternative for any veto" to prevent pure criticism.

**4. Set a round limit.** Two rounds is our sweet spot. One round isn't enough — agents concede too easily. Three or more rounds and the agents start repeating themselves or finding artificial disagreements to fill the space. Two rounds forces concise, high-impact challenges.

**5. Extract actionable decisions.** After the debate, a third agent (or the same agents in a planning phase) must synthesize the disagreements into concrete decisions. "We debated X" is useless. "We decided Y because of Z" is the output that matters.

## The Cost of Skipping Debate

We tested this. On one sub-project, we bypassed the debate phase and went straight from PRD to planning. The result was a technically competent deliverable that missed the mark strategically. The agents built exactly what the PRD specified — and the PRD was incomplete.

The debate phase adds roughly 20 minutes and a few dollars in API costs. The blind spots it catches would take days to fix after the code is written.

Every PRD has gaps. The question is whether you find them before or after you've built the wrong thing. Structured debate between agents with different priorities is the cheapest form of quality assurance we've found. And unlike human debates, it happens at 2 AM without anyone needing coffee.

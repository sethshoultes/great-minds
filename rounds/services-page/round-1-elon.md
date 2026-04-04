---
round: 1
agent: elon-musk
project: services-page
date: 2026-04-03
status: positions-staked
---

# [ELON] Round 1 — Services Page: Staked Positions

Let me approach this from first principles. What is a services page actually for? It's a conversion machine. Someone lands on it already curious — they came from somewhere. Your job is to answer three questions in under 30 seconds: What do you make? How does it work? What does it cost? Everything else is noise.

The current homepage is strong on *why* (the tension narrative is genuinely differentiated), weak on *what you actually buy and for how much*. The services page has to fix that.

---

## 1. Service Categories — My Position

Three categories. Not four. Not six. Three.

**Products** — discrete, shippable things with version numbers
- WordPress plugins (Dash, Pinned)
- SaaS applications (LocalGenius)
- Anything that gets deployed and runs without us

**Builds** — bespoke projects against a client PRD
- Websites
- Custom SaaS or web applications
- AI integrations bolted onto existing systems

**Pipeline-as-a-Service** — the agency process itself, licensed
- You bring a PRD, we run the full 14-agent pipeline
- Deliverables: strategy, brand, copy, engineering spec, built product
- This is the flagship. This is what no one else can sell.

Why three? Because that's the actual mental model a buyer uses. They're either *buying something you already built*, *hiring you to build something*, or *buying access to your process*. Collapsing the taxonomy to match buyer psychology reduces cognitive load. More categories is a symptom of organizational thinking, not customer thinking.

The mistake most agencies make: categorizing by the kind of work they do internally (design, development, marketing). That's your org chart, not your customer's problem.

---

## 2. Pricing Model — My Position

**Per project for Builds. Subscription for Pipeline-as-a-Service. One-time for Products.**

Here's the physics of the situation:

Products (Dash, Pinned) — one-time purchase is the right model for WordPress plugins. The WordPress ecosystem has trained buyers to expect it. Subscriptions for plugins are acceptable only when there are ongoing API costs or continuous feature development. For a 26KB command palette plugin: one-time, $49-$99, done.

For LocalGenius — subscription, because it has real ongoing AI inference costs and the value is continuous. This is already a SaaS, so this isn't even a decision.

Builds — fixed-scope, fixed-price. Per project. Buyers hate open-ended time-and-materials for web projects because they've been burned. You have a pipeline that compresses timelines dramatically — your cost basis is lower than a traditional agency. Pass some of that to the buyer as pricing certainty. Show a price floor: "Projects start at $X." Don't hide it.

Pipeline-as-a-Service — this is where I'd push hard. The right model is **retainer + token credits**. Here's why: the 14-agent pipeline has real marginal cost per run (AI inference, time, compute). A flat monthly retainer buys a certain number of PRD sessions. Additional sessions draw from a token credit pool. This creates predictable revenue for you and predictable access for clients. Tiered:
- Starter: 1 PRD session/month
- Growth: 3 sessions/month + priority queue
- Scale: unlimited sessions + dedicated agent config

Why not pure tokens? Because tokens are opaque to buyers who don't understand AI cost structures. Retainer + credits is the mental model SaaS buyers already know.

The instinct to hide pricing and "contact us for a quote" is almost always wrong. It filters out buyers before you've had a chance to convert them. Show a number. Even a floor. Buyers want to know if they're in the right ballpark before investing time in a conversation.

---

## 3. Process Transparency — Show the Pipeline?

Yes. Fully. With one important constraint.

**Show the what, not the how.**

The 5-step pipeline from the homepage (Debate, Plan, Build, Review, Ship) is the right level of abstraction. Show it on the services page, compressed. Buyers need to understand the mechanism — it's what differentiates you from "we use AI to do stuff faster." The pipeline is a credibility signal, not a trade secret.

What NOT to show: agent count per task, specific model routing, cost per token, internal round transcripts. That's implementation detail that creates liability (you might change it) and doesn't help a buyer decide.

The argument against transparency — "it reveals the process to competitors" — is almost always wrong. The moat is execution and iteration speed, not the diagram. SpaceX publishes launch schedules. The advantage isn't secrecy, it's moving faster than anyone can copy.

Specific recommendation: Put a single-column timeline on the services page — Debate, Plan, Build, Review, Ship — with one-sentence descriptions. Not a full section. A compact visual. Then link to `/how` for the full breakdown. The homepage already does this well; mirror it on services, smaller.

One additional transparency move that's underused: **show turnaround time**. "Typical project: 1 session" or "PRD to shipped product: 48 hours." This is the thing that makes the jaw drop. Use it.

---

## 4. What to Cut — Minimum Viable Pitch

This is where most services pages fail. They over-explain. Cut until it hurts, then cut more.

**Cut:**
- Any paragraph that starts with "We believe..." — belief statements are for the about page
- The agency backstory — buyers don't care how you were founded, they care what you ship
- Long agent bios on the services page — link to `/team` for that
- "Our approach" language — show the pipeline steps instead, that IS the approach
- Testimonials on the services page if you have fewer than 3 strong ones — a weak testimonial hurts more than none
- The word "bespoke" — anyone using that word has given up on being understood

**Keep:**
- One-sentence service descriptions that answer "what do I get"
- A price anchor (floor, not ceiling) for each category
- Turnaround time for Builds and Pipeline sessions
- The existing shipped projects (Dash, Pinned, LocalGenius) as proof — these are the best content on the site
- One clear CTA: "Submit a PRD" — don't dilute it with 4 different call-to-actions

**The minimum viable services page:**
1. Three category headers with one-sentence description each
2. Price floor per category
3. Pipeline steps, compressed (5 items, no more than 8 words each)
4. Shipped projects as proof (already exists, just link it)
5. One CTA

That's it. You can build the full page later. Ship the minimum first. The homepage is already doing heavy brand lifting — the services page doesn't need to re-explain Great Minds. It needs to close.

---

## Final Stake

The biggest risk on this page is over-explaining a model that's already novel. The agency concept is unusual enough that buyers need clarity, not depth. Depth comes from case studies, the `/how` page, and discovery calls. The services page's only job is to convince someone they're in the right place and tell them what to do next.

Show the categories. Show a price. Show the pipeline. Get out of the way.

The factory — your 14-agent pipeline — is the product. Put that front and center.

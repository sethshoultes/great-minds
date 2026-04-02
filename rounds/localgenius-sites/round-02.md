# LocalGenius Sites — Round 2: Challenges & Decisions

**Phase**: Challenge & Lock
**Date**: 2026-04-02

---

## [STEVE] CHALLENGES TO ELON

### Challenge 1: The Emdash Audit Is Not a "Hard Gate" — It's a Parallel Track

Elon says: "The 2-week Emdash audit is a hard gate. If it fails, we fall back to enhanced static generation."

**My challenge:** You're framing this as binary — Emdash works or we fall back. That's a false dichotomy. The right approach is to build both paths simultaneously for two weeks, then choose.

Here's why "hard gate" is wrong: if we block the provisioning pipeline on the audit, we lose two weeks. If the audit passes (which you predict at >95%), we've wasted two weeks of pipeline work that could have been running in parallel.

**What I propose:** The Edge Infrastructure Engineer starts the provisioning pipeline on Day 1 using a simple Astro static site as the initial target — no Emdash, no D1, just R2-served HTML on a Worker. Meanwhile, the MCP Lead runs the Emdash audit. On Day 14, we either swap in Emdash (if audit passes) or keep the static path (if it doesn't). The pipeline is identical either way — the only difference is what it deploys.

This is not "building two things." It's building one pipeline with a pluggable deployment target. The provisioning state machine, DNS, R2, Worker routing — all identical. Only the content layer changes.

**Where Elon is right:** The audit must be rigorous. I'm not saying skip it. I'm saying don't let it block the pipeline.

### Challenge 2: Content Verification UX — "Fix Something" Is Not Enough

Elon says: "Two buttons: 'Looks good, publish' and 'Fix something' (opens chat with the AI about what to change)."

**My challenge:** "Fix something" is too vague at the most critical moment in the user journey. Maria just saw her website for the first time. She's excited. She notices her hours are wrong. She taps "Fix something." Now she's staring at a chat input trying to articulate what's wrong.

This is the moment we lose her. Not because the product failed — because the interaction design failed. She needs to *point* at what's wrong, not *describe* it.

**What I propose:** The verification screen shows a simplified visual summary — not the full site, but 4-5 key facts rendered as editable cards:

```
Business name:    Maria's Kitchen          [Edit]
Description:      Authentic Tex-Mex...     [Edit]
Hours:            Mon-Sat 11am-9pm...      [Edit]
Phone:            (512) 555-0142           [Edit]
Address:          1401 S Lamar Blvd...     [Edit]
```

Maria scans these in 10 seconds. If something's wrong, she taps Edit on that specific field. Inline editing — no chat, no prompt, no AI round-trip. Just type the correct value.

Below the cards: **"Looks right — make it live."**

This is faster than chat, more precise than "fix something," and preserves the zero-CMS principle because she's editing *facts*, not *design*. The AI takes the corrected facts and rebuilds the site.

**Where Elon is right:** The iframe preview is still valuable. Show it above the fact cards. But the editing happens on the facts, not through conversation at this step.

### Challenge 3: "Ship a Benchmark, Not a Prediction" — Fine, But Set the Bar

Elon says: "I won't ship a prediction. I'll ship a benchmark" on Emdash SSR time.

**My challenge:** Agreeing to benchmark without defining the pass/fail bar is just deferring a decision. What number kills the project? What number is acceptable?

**My bar:**
- **Pass:** < 20ms SSR on a 5-page site (leaves 10ms headroom under 30ms ceiling)
- **Acceptable:** 20-28ms (ships, but needs caching strategy)
- **Fail:** > 28ms (too close to ceiling, no headroom for growth)

If we don't define this now, we'll have the benchmark in two weeks and then spend another week arguing about what it means.

### Challenge 4: The Provisioning Pipeline Is Over-Specified

Elon defines a 6-step atomic operation with rollback. This is correct engineering. But he's missing the user experience of provisioning.

**The user should never see "provisioning."** From Maria's perspective:
1. She finishes onboarding (answers questions, uploads photos)
2. She sees the loading screen ("Building something beautiful...")
3. She sees her live site

Steps 2-3 should take under 60 seconds. If the pipeline takes 5 minutes (the PRD's target), we need to restructure the flow:

**Proposal: Deferred provisioning with instant preview.**

- On onboarding complete, generate a static HTML preview immediately (< 5 seconds) using the AI-generated content. Show this in the device frame. This is the Reveal moment.
- In the background, the full Emdash provisioning pipeline runs (D1 + R2 + Worker + DNS).
- The preview URL shows the static version instantly.
- When provisioning completes (30-300 seconds later), the static preview is hot-swapped for the real Emdash site. Same URL. Maria never knows.
- If provisioning fails, the static site stays live. We retry in the background. Maria's site is never down.

This gives us the best of both worlds: instant emotional payoff AND a real CMS underneath.

**Where Elon is right:** The state machine, rollback, and idempotency are all correct. I'm not changing the pipeline — I'm changing what happens while it runs.

### Challenge 5: Fork Emdash — Don't Just Mitigate

Elon lists "Emdash goes unmaintained" as a risk and says "fork it." I agree, but let's go further.

**We should fork Emdash from Day 1.** Not because we expect it to break — because we need to own the output quality. Our templates, our Portable Text schemas, our SSR optimizations, our Worker bindings. If we're building on top of Emdash, we are Emdash's most demanding user. We should own the fork and contribute upstream when it makes sense, not depend on an external project's release cycle for our core product.

---

## [ELON] CHALLENGES TO STEVE (anticipated responses)

### On 4 Inputs vs 7 Questions:

Steve wants 4 inputs. The PRD says 7. Here's the reality: the AI needs enough signal to generate a *good* website, not just a website. The difference between 4 inputs and 7 is the difference between "generic Tex-Mex place" and "family-owned Tex-Mex known for their mole, on South Lamar since 2019, open for brunch on weekends."

**Resolution:** Steve is right that 7 questions feel like a form. I'm right that 4 inputs may produce generic output. The answer: **4 inputs + Google/Yelp enrichment.** The AI pulls the extra context automatically. If the enrichment fails (business not found), the AI asks 1-2 follow-up questions in the conversation thread *after* the initial site is live. The site goes live with what we have, then improves.

### On Template Count:

Steve wants 2, I could live with 1 if it's versatile. The question is whether a restaurant menu layout and a dental services layout can share a template.

**Resolution:** They can't. A menu is a list of items with prices and photos. A service list is descriptions with booking CTAs. The information architecture is fundamentally different. **2 templates. Steve is right.**

### On Subdomain Length:

Steve wants `mariaskitchen.lg.site` instead of `mariaskitchen.localgenius.site`. Shorter is better for sharing. But it requires purchasing a separate domain and managing DNS for it.

**Resolution:** Buy `lg.site` or `lgsites.com`. The domain costs $12/year. The brand benefit of a shorter, more shareable URL is worth the $12 and 30 minutes of DNS setup. **Steve is right.**

---

## LOCKED DECISIONS

| # | Decision | Owner | Rationale |
|---|---|---|---|
| 1 | **Parallel build: pipeline + audit simultaneously** | Joint | Pipeline uses static HTML initially, swaps to Emdash on Day 14 if audit passes. No blocking dependency. |
| 2 | **2 templates at launch** | Steve | Restaurant and services verticals require different IA. Both must be genuinely beautiful. |
| 3 | **4 inputs + auto-enrichment** | Joint | Steve's 4 inputs for onboarding speed. Elon's enrichment for output quality. Follow-up questions in thread if needed. |
| 4 | **Editable fact cards for verification** | Steve | Not "fix something" chat, not a CMS form. 5 key facts with inline edit. Faster, more precise. |
| 5 | **Instant preview → deferred provisioning** | Joint | Static HTML preview in < 5 seconds for the Reveal. Emdash provisioning runs in background, hot-swaps when ready. |
| 6 | **Fork Emdash from Day 1** | Elon | We own the fork. Contribute upstream. Don't depend on external release cycles. |
| 7 | **Short subdomain** | Steve | Purchase `lg.site` or equivalent. `{slug}.lg.site` is more shareable than full brand domain. |
| 8 | **SSR benchmark bar: < 20ms pass, > 28ms fail** | Joint | Defined now, measured in audit. No post-hoc negotiation. |
| 9 | **Custom domain = Pro tier, 1-tap UX** | Joint | Elon owns the Cloudflare for SaaS plumbing. Steve owns the 1-tap interaction design. $2/month cost absorbed into $79 Pro margin. |
| 10 | **"Made with LocalGenius" footer** | Steve | Craft language, not "powered by" commodity language. The growth whisper. |
| 11 | **Film MCP update story at Day 30** | Joint | Steve directs the story (no narration, reaction-first). Elon ensures the MCP bridge works flawlessly for the filming. |
| 12 | **Reveal: live site in device frame, "Your site is live."** | Steve | No confetti. Restraint is the design. Elon preloads iframe during provisioning for perceived speed. |
| 13 | **95+ PageSpeed or don't ship** | Joint | Design requirement, not just engineering target. Both templates must pass before entering the pool. |
| 14 | **MCP transport: HTTP (stateless POST)** | Elon | Workers handle this natively. No WebSocket needed. Settled. |
| 15 | **D1 federation: parameterize account ID now, build later** | Elon | 30 minutes of architecture investment. No premature optimization. |

---

## OPEN ITEMS (Require Data, Not Debate)

| # | Question | Owner | Deadline |
|---|---|---|---|
| 1 | Emdash SSR benchmark (target < 20ms) | Elon | Day 14 |
| 2 | Emdash MCP audit — provisioning success rate > 95% | Elon | Day 14 |
| 3 | Template design — 2 templates for restaurant + services | Steve | Day 21 |
| 4 | Portable Text schema per vertical | Steve + Elon | Day 14 |
| 5 | `lg.site` or equivalent domain — availability + purchase | Elon | Day 3 |

---

## TIMELINE (6 Weeks to Ship)

| Week | Steve (Design) | Elon (Engineering) |
|---|---|---|
| 1-2 | Template wireframes + mobile-first design system | Provisioning pipeline (static HTML target) + Emdash audit |
| 2-3 | Template buildout in Astro, photo treatment system | MCP bridge (`emdash-mcp.ts`), Portable Text validation |
| 3-4 | Reveal flow UX, verification card design | Swap pipeline to Emdash (if audit passes), DNS automation |
| 4-5 | Integration testing, 10-user design review | Load testing, error recovery, monitoring |
| 5-6 | Polish pass, PageSpeed optimization, footer | Production deploy, custom domain flow, Day 30 MCP film prep |

**Ship date: 6 weeks from today.**

---

## CONSENSUS STATEMENT

We agree on the thesis: the website is not the product. The feeling is the product. The AI managing the website after creation is the category differentiator.

We agree on the architecture: Cloudflare (D1 + R2 + Workers) for sites, Vercel/Neon for the app, MCP as the bridge.

We agree on the constraints: 2 templates, 4 inputs, zero CMS exposure, 95+ PageSpeed, fork Emdash, < 20ms SSR.

We disagree on nothing that matters. The remaining items are data questions, not philosophy questions.

Build it. Ship it in 6 weeks. Film the MCP story at Day 30.

---

*Steve Jobs, Chief Design & Brand Officer*
*Elon Musk, Chief Product & Growth Officer*
*Great Minds Agency*

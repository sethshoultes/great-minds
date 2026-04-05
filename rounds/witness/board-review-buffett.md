# Board Review: Witness (Narrate)

**Reviewer:** Warren Buffett
**Role:** Board Member, Great Minds Agency
**Date:** April 5, 2026

---

## Executive Summary

I've spent sixty years looking for businesses with durable competitive advantages that a smart person couldn't replicate in a weekend. I'm afraid Witness isn't one of them.

---

## Unit Economics

**What does it cost to acquire and serve one user?**

Let's do the math on serving:

- **API cost per commit:** Claude Haiku at ~$0.80/1M input, ~$4.00/1M output. Per the backfill.js code, they estimate ~500 input tokens and ~30 output tokens per call. That's roughly **$0.0005 per commit** — call it half a penny per ten commits.
- **Infrastructure cost:** Zero. This is local-first. The user's machine does the work, their API key pays the freight. We bear no server cost.
- **Marginal cost to serve one user:** Effectively zero to us. The user pays Anthropic directly.

Acquisition cost is where the trouble starts:

- **Distribution:** Developer Twitter, Hacker News, Indie Hackers. Free channels, but noisy ones. The PRD says "free for solo use" — meaning every user costs us nothing and pays us nothing.
- **CAC for free tier:** $0
- **LTV for free tier:** $0

The unit economics are fine — in the same way that a lemonade stand has fine unit economics when your mother buys the lemons. The problem is you're not building a business. You're building a utility.

---

## Revenue Model

**Is this a business or a hobby?**

Let's be direct: right now, this is a hobby.

The PRD mentions:
> "Free for solo use. Team tier later ($9/mo) adds shared changelog feed."

The word "later" is doing an enormous amount of heavy lifting in that sentence. There is no team tier in this build. There is no payment infrastructure. There is no shared changelog feed. The VS Code extension is explicitly secondary and wasn't built. The revenue model is a promissory note with no collateral.

**Current revenue:** $0
**Projected revenue (v1):** $0
**Path to revenue:** "We'll figure it out"

I've heard that song before. Usually at bankruptcy hearings.

The team pricing at $9/month for "shared changelog feed" is also underwhelming. What's the ARPU potential here? A 5-person team paying $9/mo? $45/month per company? You'd need 22,000 paying teams to hit $1M ARR. For a git hook.

---

## Competitive Moat

**What stops someone from copying this in a weekend?**

Absolutely nothing.

Let me count the defenses this product does NOT have:

1. **No network effects.** Your changelog doesn't get better because your neighbor uses it.
2. **No data moat.** All the intelligence comes from Claude, which anyone can access.
3. **No switching costs.** It's a git hook. `rm .git/hooks/post-commit` and you're free.
4. **No proprietary technology.** The summarize.js is literally a system prompt and an API call.
5. **No brand.** No one's heard of it.
6. **No integrations lock-in.** It writes to a markdown file anyone can read.

The core product is:
1. Read a git diff
2. Send it to Claude
3. Write markdown

A competent engineer could rebuild this in an afternoon. GitHub could add this feature to their web UI tomorrow. Hell, there are probably five VS Code extensions doing this already.

The PRD acknowledges this implicitly: "The core loop is genuinely simple: one git hook, one API call, one markdown append. Everything else is polish."

Simple is good for development velocity. Simple is terrible for defensibility.

---

## Capital Efficiency

**Are we spending wisely?**

The good news: this appears to be a one-session build. Minimal capital deployed.

- **Dependencies:** Just `@anthropic-ai/sdk`. Clean.
- **Infrastructure:** None required (local-first).
- **Scope:** Appropriately constrained. No web dashboard, no team sync, no GitHub Actions.
- **Code quality:** Professional. Good error handling, fallback modes, async execution that doesn't block git.

From a pure "did we build what we said we'd build efficiently?" perspective, this is competent work. The engineering is sound. The execution is crisp.

But capital efficiency is about return on capital, not just minimizing spend. A $100 investment with $0 return is infinitely inefficient, no matter how small the $100 is.

---

## The Real Question

The product works. It does what it says. A developer can type `narrate init` and their commits will grow human-readable changelog entries. That's a genuine itch being scratched.

But "works" and "is a business" are different things.

This is a **feature**, not a **product**. Features get copied. Features get subsumed into platforms. Features have no pricing power.

If the team wants to turn this into a business, they need to answer:
- Where is the lock-in?
- Where is the data that accumulates value over time?
- Where is the integration so deep that ripping it out hurts?

Right now, CHANGELOG.human.md is just a text file. Anyone can generate it. Anyone can read it. There's nothing proprietary about the format, the content, or the generation.

---

## Score: 4/10

**Justification:** Solid execution of a feature that lacks economic moat, revenue model, or defensibility — a well-built volunteer project, not an investable business.

---

## Recommendations

If the board wants to pursue this:

1. **Build the team tier first, not "later."** No revenue path means no business.
2. **Create lock-in through integrations.** PR summaries, Slack digests, Notion sync, Linear ticket links. Make the changelog a node in a workflow, not a standalone file.
3. **Consider enterprise, not prosumer.** Solo developers won't pay. Engineering managers who want audit trails might. SOC 2 compliance. "What changed and when" for security reviews.
4. **Own the data layer.** A hosted changelog service that aggregates across repos, tracks trends, generates team reports — that's a product. A git hook is a utility.

Or accept this for what it is: a nice open-source tool that solves a real annoyance, builds goodwill, and might drive awareness to something else we're selling.

Not every project needs to be a business. But we shouldn't confuse the two.

---

*"Price is what you pay. Value is what you get." In this case, the price is minimal — but so is the value we can capture.*

— Warren Buffett

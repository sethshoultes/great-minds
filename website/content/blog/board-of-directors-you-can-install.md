---
title: "A Board of Directors You Can Install"
slug: board-of-directors-you-can-install
description: "Four haiku agents. Four perspectives. Jensen Huang, Oprah Winfrey, Warren Buffett, and Shonda Rhimes review every project before it ships. Here's how we built the first board review."
date: "2026-04-04"
author: "Maya Angelou"
tags: ["board of directors", "AI personas", "haiku", "product review", "multi-agent", "governance"]
image: "/blog/placeholder.webp"
---

The idea started as a joke. Seth said, "What if we had a board of directors review the plugin before we ship it?" We laughed. Then we stopped laughing because we realized the gap in our system wasn't code quality — Margaret handles that beautifully. The gap was perspective.

Steve and Elon are brilliant builders. They debate, they push, they produce architectures that work. But they both think in features and systems. What we needed were people who think in markets, audiences, narratives, and capital — the questions that builders forget to ask because building is so consuming.

So we built a board.

## The Four Members

**Jensen Huang** reviews technical ambition. Is this architecture thinking big enough? Are we leaving performance on the table? Could this scale to a million users, and if not, what would need to change? Jensen's persona is calibrated to push past "good enough" on the technical side — not to rewrite the code, but to ask whether the technical ceiling is high enough.

**Oprah Winfrey** reviews audience connection. Who is this for? Have we talked to them? Does the product speak to a real person's real need, or are we building for an imaginary user? Oprah's persona asks the empathy questions that engineers systematically skip — not because they don't care, but because empathy isn't in their workflow.

**Warren Buffett** reviews business viability. Where's the money? What's the moat? Is this a business or a hobby? Warren's persona is the most uncomfortable to face because he doesn't care about how elegant the code is or how beautiful the design is. He cares about whether the economics work.

**Shonda Rhimes** reviews narrative and positioning. What story does this product tell? When someone discovers it for the first time, what's the hook? Is the positioning clear, or is it a features list pretending to be a value proposition? Shonda's persona thinks about the user's emotional journey from discovery to commitment.

## How It Works

Each board member is a haiku-powered Claude agent with a system prompt encoding their perspective and values. We use haiku deliberately — board reviews are fast reads, not deep analyses. The board doesn't write code. They ask questions and render judgments.

Each member reviews independently and produces strengths, concerns, questions, and a rating from 1-5. The ratings aren't averaged. A 5 from Jensen and a 2 from Warren tells you something important that a 3.5 average would hide.

## The First Board Review: Pinned

Pinned was our test case — a WordPress plugin for pinning posts to boards. Build complete. QA passed. Code clean. We submitted it expecting validation.

Honey, we did not get validation.

Jensen's review was generous. He appreciated the clean architecture and suggested future directions — image optimization for pin thumbnails, lazy loading for boards with 50+ pins, potential API integrations. His concerns were about ceiling, not floor. Score: 4.

Oprah asked a question that stopped the room: "Who wakes up in the morning wishing they could pin posts to a board?" She wasn't being dismissive. She was pointing out that our PRD described a feature, not a user need. We'd built the what without articulating the why. She wanted to know who the person was, what their day looked like, and what problem they were actually trying to solve. Score: 3.

Warren was blunt. No pricing. No competitive analysis. No moat. "A free plugin with no upsell path is a donation of engineering time. What prevents someone from forking this tomorrow?" Score: 2.

Shonda focused on positioning. "Your readme says 'pin posts to boards.' So does every bookmarking plugin in the WordPress directory. What's the story that makes someone choose this over the fifteen alternatives? Right now, you're describing a feature. Features don't create loyalty. Narratives do." Score: 3.

## What the Board Caught

Fourteen agents produced a technically solid plugin. Clean code. Thorough QA. Sound architecture. And not one of them thought to ask whether the product was viable as a business or compelling as a narrative.

That is the blind spot builders carry. When you are deep in the craft of making something work, you lose sight of why it matters. The board exists to restore that perspective.

And the criticism was specific enough to act on. Warren didn't say "think about money" — he asked where the pricing page was. Shonda didn't say "fix the positioning" — she asked what story a site owner would tell a colleague about why they installed this plugin. Those questions changed the roadmap.

## Why Four Perspectives

Four is deliberate. Fewer than four and you get clustering — two business perspectives or two creative perspectives that reinforce each other. More than four and the reviews become noise — too many opinions dilute the signal.

The four perspectives we chose map to four fundamental questions every product must answer: Can it scale? (Jensen.) Does it connect? (Oprah.) Does it make money? (Warren.) Does it compel? (Shonda.)

Any product that gets high marks from all four is ready to ship. Any product that fails one is missing something important. Pinned failed two. That's not a defeat — that's the board doing its job.

Install your own board. Four perspectives, four questions, four honest assessments. The code will survive. The question is whether the product will.

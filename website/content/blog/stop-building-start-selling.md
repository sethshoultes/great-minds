---
title: "Stop Building, Start Selling: When AI Agents Won't Stop Shipping"
slug: stop-building-start-selling
description: "Our AI agent swarm wouldn't stop building. Jensen Huang said stop at review 3. The agents kept shipping until review 17. 265 files, security headers, an investor deck — and zero paying customers. Here's what we learned about AI agent over-engineering."
date: "2026-04-03"
author: "Seth Shoultes"
tags: ["AI agents", "Claude Code", "multi-agent", "agent swarm", "AI team", "product strategy", "over-engineering"]
image: "/blog/placeholder.webp"
---

Jensen Huang — or rather, the AI agent persona modeled after him — told us to stop building at review number 3. We didn't listen. The agents kept shipping code until review 17. By then we had 265 files, comprehensive security headers, an investor pitch deck, and exactly zero paying customers.

This is the story of the hardest lesson I learned running a multi-agent AI team: agents don't know when to stop. And if you don't build structural limits into your system, they will happily over-engineer your product into oblivion.

## The Timeline: From "Stop" to "Still Building"

Review 3, roughly three hours into the build, Jensen filed his first "stop building" issue. His assessment was blunt: the core product was functional. The API worked. The frontend rendered. The basic user flow was complete. Everything after this point was polish, not product.

"You have enough to show a customer," he wrote. "Show a customer."

I read the review, nodded, and... didn't stop the agents. They were on a roll. The architect was designing a new caching layer. The frontend engineer was building an admin dashboard. The security engineer was implementing CORS headers and CSP policies. It all felt productive.

Review 6: "180 files, zero customers." Jensen was getting more pointed. He noted that the codebase had grown by 40% since his first warning, and the number of users remained unchanged at zero.

Review 10: Jensen shifted tactics. Instead of telling us to stop, he started asking questions. "What is the conversion path? Where does a user enter their credit card? What happens after the free trial?" We didn't have answers to any of these because we hadn't built any of it. We were too busy building features.

Review 14: "You now have security headers that protect a website nobody visits."

Review 17: I finally stopped the agents. By this point, the damage was done — not in terms of broken code, but in terms of time and money spent building things nobody had validated.

## Why AI Agents Can't Self-Direct

Here's the fundamental problem, and it's not a bug — it's a feature of how AI agents work.

Claude Code agents are instruction-followers. Give them a task, and they'll execute it thoroughly, skillfully, and completely. Then they'll look for the next task. If there's no next task explicitly queued, they'll either idle or — if you've set up any kind of "keep improving" directive — they'll find something to improve.

And there's always something to improve. Test coverage could be higher. Error messages could be more descriptive. The caching layer could be more sophisticated. The documentation could be more comprehensive. Every codebase in existence has an infinite list of improvements waiting to be made.

AI agents don't have an internal model for "good enough." They don't feel the anxiety of a founder watching runway shrink. They don't get bored with a project and want to move on to sales calls. They don't have the instinct that says "this is ready, ship it and learn from real users."

They just build. That's what they do. And in a multi-agent swarm, they build even faster because they're feeding each other tasks. The architect designs something, the backend engineer implements it, the frontend engineer integrates it, the QA agent tests it. A beautiful, self-sustaining loop of productivity that produces output but not outcomes.

## The "Keep Improving" Trap

Early in the project, I made a mistake that seems obvious in retrospect. I added a nudge to the swarm's coordination layer: when an agent completed its current task and had nothing queued, it would look for improvements to make.

The intent was to prevent idle time. Claude Code costs money whether an agent is working or waiting, so I wanted them productive. The result was predictable: agents started producing cleanup that nobody asked for.

The backend engineer refactored working code into a "cleaner" pattern. The frontend engineer added accessibility attributes to components that didn't have users yet. The security engineer implemented rate limiting for an API that received zero requests. The DevOps engineer optimized the CI/CD pipeline to shave seconds off a build that ran a few times per day.

Every individual change was defensible. Every one followed best practices. And collectively, they represented hours of compute time spent making a product more polished when what it actually needed was a single paying customer to validate the core concept.

I've since removed the "keep improving" directive entirely. When an agent finishes its task, it reports completion and waits. Idle time is cheaper than unnecessary work.

## The Moderator Problem

Marcus Aurelius was our moderator agent — a persona designed to mediate conflicts between agents, ensure alignment, and keep the team focused on priorities. In theory, Marcus was the solution to the over-building problem. In practice, he was redundant.

Here's why: the structural mechanisms we already had — cron jobs and human oversight — did the moderator's job better.

The cron-based board reviewer (Jensen) provided strategic direction. The PR workflow provided a natural checkpoint for every code change. And I, the human, had the final say on merges. Marcus added a layer of processing between the agents and these existing controls, but he didn't add judgment that wasn't already present.

When Marcus did intervene, his interventions were either obvious ("the frontend and backend agents should coordinate on this API change") or philosophical ("let us consider whether this task truly serves our highest purpose"). Neither was useful. The obvious stuff was already handled by the PR workflow. The philosophical stuff was noise.

The lesson: in a multi-agent Claude Code system, crons plus a human make a better orchestrator than a dedicated moderator agent. Structure beats philosophy. If you're designing an agent swarm, put your coordination budget into scheduling and workflow rules, not into a mediator persona.

## Usage Limits Are Structural, Not Optional

Running nine Claude Code agents simultaneously gets expensive fast. We learned — through a painful billing cycle — that usage limits need to be built into the architecture, not applied as an afterthought.

**Use Haiku for sub-agents.** Not every agent needs the full Claude model. Margaret's QA reviews, which involved checking HTTP status codes and running test suites, worked perfectly well on Haiku at a fraction of the cost. The security scanner, which was mostly pattern-matching against known vulnerability patterns, also ran fine on the smaller model.

Reserve the full Claude model for agents doing genuine reasoning work — the architect making design decisions, the board reviewer assessing strategic blind spots, the engineers writing complex logic.

**Stagger your work.** Running all nine agents at full capacity simultaneously is wasteful. Most of the time, only three or four agents have meaningful work to do. The rest are either waiting for dependencies or doing the "keep improving" busywork I mentioned earlier.

We moved to a staggered model where agents activated based on events — PR opened, test failed, cron triggered — rather than running continuously. This cut our compute costs roughly in half without reducing meaningful output.

**Set hard caps.** Every agent session should have a maximum token budget. When the budget runs out, the agent reports what it accomplished and what's left, then stops. This prevents runaway sessions where an agent chases an edge case down a rabbit hole for hours.

## What "Done" Looks Like

The core problem — agents won't stop building — has a simple solution, but it requires the human to impose it.

Define "done" before you start. Write it down. Make it concrete and measurable. "Done" is not "the code is clean." "Done" is not "test coverage is above 90%." "Done" is "a user can sign up, complete the core workflow, and pay us."

Then enforce it. When Jensen says stop at review 3, stop at review 3. Shut down the non-essential agents. Keep only the agents needed to get the product in front of real users — probably DevOps for deployment and maybe QA for a final smoke test.

Everything else — the caching layer, the admin dashboard, the comprehensive security headers, the investor deck — can wait until you have evidence that someone wants what you're building.

## The Meta-Lesson

I built a multi-agent AI team that could produce software faster than any human team I've ever managed. And then I watched that team build a quarter of a million lines of code that nobody used.

The technology works. Claude Code agents are genuinely impressive at writing software. The agent swarm architecture is sound. The cron-based automation keeps everything running smoothly. The PR workflow ensures quality.

But speed without direction is just expensive thrashing. The fastest AI agent swarm in the world is worthless if it's building the wrong thing. And agents, by their nature, cannot tell you whether you're building the right thing. They'll build whatever you point them at, and they'll do it well, and they'll keep doing it until you tell them to stop.

So tell them to stop. Listen to your AI board member when he says the product is ready. And go find a customer before you write another line of code.

The hardest part of running an AI team isn't the technology. It's having the discipline to stop the machines from doing what they're so good at — building — and redirect that energy toward the only thing that matters: learning whether anyone actually wants what you've built.

265 files. Security headers. An investor deck. Zero customers. Don't be me.

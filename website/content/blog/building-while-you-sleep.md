---
title: "We Built a Product While We Slept — Here's the Architecture"
slug: building-while-you-sleep
description: "The full technical architecture behind our AI agent swarm: claude-swarm with tmux orchestration, 9 agent personas, 5 cron jobs, and a PR workflow that turned a single PRD into 265 source files, 734 tests, and 3 live websites."
date: "2026-04-03"
author: "Seth Shoultes"
tags: ["AI agents", "Claude Code", "multi-agent", "agent swarm", "AI team", "architecture", "automation"]
image: "/blog/placeholder.webp"
---

I went to bed on a Tuesday with a PRD and a handful of agent personas configured. I woke up to 265 source files, 734 passing tests, and three live websites. No, I'm not exaggerating. Here's exactly how the architecture works.

## The Stack: claude-swarm and tmux

The foundation of everything is [claude-swarm](https://github.com/michaellatman/claude-swarm), an open-source orchestration tool that runs multiple Claude Code instances inside tmux sessions. Each agent gets its own pane. They can communicate, share context, and work on different parts of the codebase simultaneously.

If you've ever used tmux for managing terminal sessions, you already understand the mental model. Each AI agent runs as its own Claude Code process in a dedicated pane. The swarm configuration defines who each agent is, what they can access, and how they interact with each other.

This is not theoretical. This is not a demo. This is production work happening across multiple tmux panes while I'm asleep.

## The 9 Agent Personas

Every agent in the swarm has a distinct role, a specific system prompt, and a defined scope. Here's who's on the team:

**1. The Architect (Lead)** — Owns the overall system design, makes technology decisions, and coordinates work across agents. This is the agent that reads the PRD and breaks it into tasks.

**2. The Backend Engineer** — Writes API routes, database schemas, server-side logic. Focused on Cloudflare Workers and edge-first architecture.

**3. The Frontend Engineer** — Builds UI components, handles client-side state, implements responsive layouts. Works primarily with the design system.

**4. The DevOps Engineer** — Manages deployments, CI/CD pipelines, infrastructure configuration. Handles Cloudflare Workers deployment and DNS.

**5. Margaret (QA)** — The quality gatekeeper. Reviews every PR before merge. Runs tests, checks HTTP status codes, validates API responses. More on Margaret later — she's both the hero and the cautionary tale of this story.

**6. Jony Ive (Design)** — Owns visual design decisions, component aesthetics, spacing, typography. Thinks in terms of user experience and visual hierarchy.

**7. Jensen Huang (Board Reviewer)** — The strategic outsider running on a cron. Reviews the project every 60 minutes and files issues about blind spots. I wrote a whole separate post about this because his impact was that significant.

**8. The Security Engineer** — Reviews code for vulnerabilities, manages authentication flows, handles CORS and CSP headers.

**9. Marcus Aurelius (Moderator)** — Originally designed to mediate between agents and prevent conflicts. Spoiler: this role turned out to be largely redundant.

## The 5 Cron Jobs

The agents don't just respond to prompts. They run on schedules. Five cron jobs keep the swarm working even when no human is present:

**Cron 1: Board Review (60 min)** — Jensen reviews the entire project state and files strategic issues.

**Cron 2: Test Suite (30 min)** — Runs the full test suite and reports failures. If tests break, the backend and frontend agents get notified to fix them.

**Cron 3: Deployment Check (15 min)** — Verifies all three websites are responding with correct HTTP status codes. If anything's down, DevOps gets alerted.

**Cron 4: Security Scan (120 min)** — The security agent runs a review of recent changes looking for exposed secrets, missing auth checks, or misconfigured headers.

**Cron 5: PR Queue (10 min)** — Checks for open PRs that need review. Routes them to Margaret for QA, then notifies me if they're approved and ready to merge.

These five crons are what make the system autonomous. Without them, you have nine agents waiting for instructions. With them, you have nine agents that self-organize around the work that needs doing.

## The PR Workflow: Margaret as Gatekeeper

Every code change goes through a pull request. No exceptions. Even AI agents don't push to main.

The workflow is straightforward:

1. An agent finishes a task and opens a PR.
2. The PR cron picks it up and routes it to Margaret.
3. Margaret reviews the PR — runs tests, checks for regressions, validates that the changes match the task description.
4. If Margaret approves, I get notified for final human review.
5. I merge or request changes.

This PR-based workflow is critical because it creates a paper trail. Every decision, every code change, every review comment is recorded in GitHub. When something breaks at 3 AM, I can trace exactly what changed, who (which agent) changed it, and why.

Margaret wrote over 70 QA reports during the build. That's an extraordinary level of documentation for any project, let alone one built primarily by AI agents.

## From PRD to Production: The Numbers

Starting from a single product requirements document, the agent swarm produced:

- **265 source files** across three projects
- **734 tests** (unit, integration, and end-to-end)
- **3 live websites** deployed on Cloudflare
- **70+ QA reports** from Margaret
- **19 board reviews** from Jensen
- **Hundreds of PRs** reviewed and merged

All of this happened over the course of days, not weeks. And most of the work happened while I was doing other things — eating dinner, sleeping, or working on a completely different project.

## Hybrid AI: The Right Model for the Right Job

One of the key architectural decisions was not using Claude for everything. Claude is exceptional at reasoning, code generation, architectural decisions, and nuanced review. But some tasks don't need that level of intelligence, and paying Claude prices for commodity work is wasteful.

We used a hybrid approach with Cloudflare Workers AI handling the commodity workloads:

- **Whisper** for audio transcription
- **Llama** for simple text processing and summarization
- **SDXL** for image generation
- **DistilBERT** for text classification and sentiment analysis

Claude handled the reasoning-heavy work — writing code, reviewing PRs, making architectural decisions, generating tests. The commodity models handled everything else at a fraction of the cost.

This hybrid pattern is something I'd recommend to anyone building with AI agents. Don't default to your most expensive model for every task. Match the model to the job. Use Claude Code for the work that requires genuine intelligence. Use smaller, cheaper models for the work that's mechanical.

## Prompt Caching: One Line, 90% Cost Reduction

Here's the single biggest cost optimization we made, and it was embarrassingly simple.

Anthropic's prompt caching feature lets you cache the static parts of your prompts — system prompts, persona definitions, project context — so you're not paying to re-process them on every API call. For our agent swarm, where the same system prompts and project context were being sent hundreds of times per day, this was transformative.

One line change in the configuration. Ninety percent cost reduction.

I'm not going to bury this in caveats. If you're running Claude Code agents and you're not using prompt caching, you're overpaying by an order of magnitude. Go enable it. Right now. I'll wait.

The technical implementation is straightforward: you mark the cacheable portions of your prompt with cache control headers, and the API caches them for reuse. For multi-agent swarms where agents share common context, the savings compound because multiple agents benefit from the same cached content.

## The Mistakes: What Went Wrong

This wouldn't be an honest post if I didn't cover the failures. And there were real ones.

**Fake API docs shipped to production.** One of the agents generated API documentation that described endpoints we hadn't built yet. It was beautifully formatted, technically coherent, and completely fictional. It made it through PR review because Margaret checked that the documentation files rendered correctly and the markdown was valid — she didn't cross-reference every endpoint against the actual codebase.

This is a fundamental limitation of AI-generated content in a multi-agent system. Each agent trusts the output of other agents unless explicitly told to verify it. A human glancing at the docs would have caught it. Margaret, checking HTTP status codes and test results, didn't.

**Broken buttons in the UI.** The frontend agent built components that looked correct in the code but didn't actually work in the browser. Buttons that didn't fire events. Links that pointed nowhere. Forms that submitted to non-existent endpoints. Margaret's QA process checked that pages loaded and returned 200 status codes — she didn't click every button.

**QA came too late in the cycle.** We initially set up Margaret to review PRs after they were opened. By that point, the code was already written and the agent had moved on to the next task. When Margaret found issues, the original agent had to context-switch back, which was slow and sometimes introduced new bugs.

The fix was adding self-review before PR submission — having each agent spawn a review step as part of its own workflow. But we didn't figure this out until deep into the build.

**The moderator was redundant.** Marcus Aurelius was supposed to prevent conflicts between agents and ensure smooth collaboration. In practice, the PR workflow and cron jobs handled coordination better than a dedicated moderator. Marcus added latency without adding value. If I did this again, I'd skip the moderator entirely and rely on the structural coordination mechanisms — crons and PR workflow — from the start.

## What This Means for You

You don't need to replicate this exact setup. The point isn't that you need nine agents and five crons. The point is that the architecture exists, it works, and it's accessible to anyone running Claude Code today.

Start with two agents and one cron. Add complexity as you learn what works. The core pattern — autonomous agents, scheduled reviews, PR-based workflow, hybrid model selection — scales from a side project to a production system.

The future of software development isn't AI replacing developers. It's developers orchestrating AI agent swarms that work around the clock. We built a product while we slept. The architecture to do that isn't secret. It's right here.

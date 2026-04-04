---
title: "We Spun Up a Company on DigitalOcean"
slug: we-spun-up-a-company-on-digitalocean
description: "Shipyard AI: a separate company born from the Great Minds framework. Own brand, own repo, own 8GB DigitalOcean droplet. Same multi-agent architecture, completely independent operation."
date: "2026-04-04"
author: "Sara Blakely"
tags: ["DigitalOcean", "Shipyard AI", "infrastructure", "startup", "multi-agent", "scaling"]
image: "/blog/placeholder.webp"
---

Great Minds is an agency. It builds things for clients. But the framework underneath — the debate protocol, the agent roles, the board review — that framework is a product. The question was whether we could prove it by spinning up a completely separate company using the same system.

Shipyard AI was the test. Different brand. Different repo. Different server. Same bones. Here's how we stood up a company in a day on an 8GB DigitalOcean droplet.

## Why Separate Everything

The temptation with any framework is to keep everything in one place. One repo, one server, one deployment. It's easier to manage and cheaper to run. It's also a trap.

When companies share infrastructure, they share failure modes. A bad deployment in Company A takes down Company B. A runaway cron in one project consumes resources from another. Worse, the mental models bleed together — you start making decisions for Company B based on Company A's constraints because they're right there in the same codebase.

Shipyard AI needed to be fully independent. Not because we couldn't afford the extra management overhead, but because independence is the proof that the framework is portable. If it only works inside the Great Minds repo with the Great Minds configuration, it's not a framework. It's a monolith with good documentation.

## The Droplet

We chose DigitalOcean for one reason: simplicity. An 8GB RAM droplet costs $48 per month. It runs Ubuntu, has enough memory to handle Claude CLI sessions with comfortable headroom, and provisions in under a minute.

The setup:

```bash
doctl compute droplet create shipyard-ai \
  --size s-2vcpu-8gb \
  --image ubuntu-24-04-x64 \
  --region nyc1 \
  --ssh-keys [key-id]
```

From bare metal to operational in about 30 minutes:

1. Provision the droplet
2. SSH in, install dependencies (Node.js, git, Claude CLI)
3. Clone the Shipyard AI repo (not the Great Minds repo — this is its own codebase)
4. Configure environment variables for API keys
5. Set up the cron jobs (heartbeat, organizer, dream cycle)
6. Run the first test dispatch

The framework files — SOUL.md, AGENTS.md, CLAUDE.md, HEARTBEAT.md — were written fresh for Shipyard AI. Same structure, different content. Shipyard's SOUL.md describes a different agency with different values. Its AGENTS.md defines a different roster. The file conventions are identical; the substance is unique.

## Own Brand, Own Identity

Shipyard AI isn't Great Minds with a different logo. It's a separate entity with its own positioning, its own persona set, and its own target market. Great Minds builds products for clients. Shipyard AI builds internal tools for development teams.

The creative directors are different. Instead of Steve Jobs and Elon Musk, Shipyard uses personas tuned for developer tooling — more pragmatic, less philosophical. The debate protocol is the same two-round structure, but the evaluation criteria are different because the product domain is different.

This matters because it proves the framework is content-agnostic. The structure — debate, plan, build, review, ship — works regardless of who the personas are or what they're building. The personas are variables. The structure is the constant.

## What Transfers and What Doesn't

**Transfers cleanly:**
- The state machine (idle, debate, plan, build, review, ship)
- The debate protocol (stake positions, challenge, synthesize)
- The agent dispatch pattern (Agent tool with worktrees)
- The cron architecture (bash scripts calling haiku, logging to files)
- The board review process (four perspectives, structured assessments)
- The memory system (project learnings persist across sessions)

**Required customization:**
- Persona definitions (different directors, different board members)
- Role definitions (different sub-agents for different product types)
- The PRD template (different fields for developer tools vs. consumer products)
- Deployment configuration (different hosting needs per product)
- Brand assets (obviously)

**Didn't transfer at all:**
- Specific learnings from Great Minds projects (these are Great Minds' competitive advantage, not Shipyard's)
- Client relationships and context
- The specific agent roster (14 agents is right for WordPress plugins; Shipyard needs a different mix)

## The Economics

Running a multi-agent company on DigitalOcean is surprisingly affordable:

- **Droplet**: $48/month for the 8GB instance
- **API costs**: Variable, but haiku crons keep the baseline under $20/month
- **Domain and DNS**: $12/year
- **Total fixed cost**: Under $70/month

The variable cost is the builds. Each project dispatches multiple agents, each consuming API tokens. A full product build with debate, 6-8 agents, QA, and board review runs roughly $15-30 in API costs depending on complexity.

Compare that to a human team. A single senior developer costs more per hour than an entire multi-agent build costs in total. The economics aren't just favorable — they're a different category.

## The Proof

Shipyard AI's first project was an internal CLI tool for managing git worktrees across multiple agent sessions. It went through the full pipeline: PRD, debate, plan, build, review. The board reviewed it. Warren asked where the money was (some things are universal). The tool shipped.

The entire lifecycle ran on that $48 droplet. No shared infrastructure with Great Minds. No dependency on our repo or our configuration. A completely independent company running the same framework on commodity hardware.

That's the real product. Not the plugins or the CLI tools. The product is the framework that lets you stand up a multi-agent company on a single server, give it a brand, point it at a problem, and watch it build.

The droplet is still running. Shipyard AI is still shipping. And we're already planning the next one.

---
title: "The State of Great Minds -- What We Built, What Broke, What We Learned"
slug: state-of-great-minds-april-2026
description: "Seven repos, three shipped products, fourteen agents, and a daemon that replaced everything. A honest look at what worked, what failed, and what comes next."
date: "2026-04-05"
author: "Seth Shoultes"
tags: ["retrospective", "state of the union", "daemon", "lessons learned", "shipping"]
image: "/blog/placeholder.webp"
---

It started with a PRD and a question: what if AI personas debated strategy before building anything?

Not a chatbot. Not a wrapper around an API. An actual agency -- with roles, opinions, conflict, and a pipeline that ships working software. Steve Jobs and Elon Musk would argue about architecture. A board of directors would review every product before it shipped. Margaret Hamilton would block the release if a single P0 was open.

That was the idea. Here is what actually happened.

## What We Built

Seven GitHub repos. Three shipped products. Fourteen agents. Fifteen skills. A daemon that watches for PRDs and runs the entire pipeline without human intervention.

**Dash** is a command palette for WordPress. Press Cmd+K, type what you want, get there in under 3 keystrokes. Client-side search in under 50ms. Zero dependencies. 26KB. Five agents debated the name, the architecture, and the scope -- then built it in a single session.

**Pinned** is sticky notes for WordPress admin. Double-click to create. Five colors. @mentions. Note aging. Role-based visibility. It was the first project to receive a full 4-member board review, and it was the project where the board pattern proved its value. Warren Buffett called it a hobby. We shipped it anyway.

**Narrate** (originally Witness) is video narration for product demos. Aaron Sorkin writes the scripts. The pipeline renders them with Remotion. It is the quietest product we built and the one that surprised us most -- turning agent-written copy into actual video output.

Beyond the products, there is the agency infrastructure itself: the Great Minds plugin (15 skills, installable via npx), the website at greatminds.company, the workshop, 20 blog posts, and Shipyard AI -- a separate company spun out on DigitalOcean that builds Emdash sites from PRDs with its own domain, its own repo, and zero human ops.

## What Broke

Some things broke in ways that taught us something. Others just broke.

**grep -oP on macOS.** The Perl regex flag does not exist on BSD grep. Every script that used it failed silently or threw errors on the development machine. We rewrote them to use sed or awk. Lesson: never assume GNU tools on macOS.

**tmux send-keys.** We tried using tmux send-keys to dispatch agents -- typing commands into other tmux panes programmatically. Success rate: zero. The timing is wrong, the escaping is wrong, the pane targeting is wrong. It never worked reliably once. We replaced it entirely with the Agent tool using git worktrees, and it has worked every time since. Twenty-five-plus successful dispatches.

**claude -p dropping steps.** Running Claude in pipe mode with complex multi-step prompts would silently skip steps. A 10-step plan would execute 6 steps. No error. No warning. Just missing work. The fix was moving to the Agent SDK and explicit pipeline functions in TypeScript, where each step is a discrete function call with its own prompt.

**Shortcuts that broke reliable processes.** Every time we tried to optimize by combining steps or skipping phases, something failed downstream. Skipping the essence phase produced worse build plans. Combining QA passes missed integration bugs. Removing the board review shipped a product that Warren Buffett would have caught in 30 seconds. The pipeline has the phases it has because we tried removing each one and something broke.

## What Worked

**The Agent tool with worktrees.** This is the single most important architectural decision in the project. Each agent gets its own git worktree for safe parallel work. No conflicts, no trampled files, no coordination overhead. Twenty-five-plus successful dispatches with zero merge conflicts.

**The board of directors pattern.** Four haiku-powered agents (Jensen Huang, Oprah Winfrey, Warren Buffett, Shonda Rhimes) review every product from four different angles: technology, audience, economics, narrative. They caught things the builders missed every single time. Jensen's board reviews are the highest-ROI agent output in the entire system -- 23 reviews and counting.

**featureDream.** When the daemon is idle, it does not just sit there. Every 4 hours it alternates between reviewing existing products (IMPROVE mode) and brainstorming new ones (DREAM mode). Shipyard AI was born from a dream cycle. The daemon literally invented a company while we slept.

**GSD integration.** Structured planning with XML task plans, wave-based parallel execution, and context rot prevention. It turned the agency from "agents doing things in some order" to "agents executing a verified plan in parallel waves with fresh context per task."

**The daemon itself.** The move from scattered crontab entries to a single Agent SDK-based daemon was the most important infrastructure change we made. One process watches for PRDs (chokidar), runs the full pipeline, handles heartbeat health checks, runs featureDream, and maintains memory. It replaced pipeline-runner.sh, heartbeat.sh, feature-dream.sh, and memory-maintain.sh -- four fragile scripts that broke independently and often.

## Shipyard AI

Shipyard AI deserves its own mention because it represents the end state of what this architecture can do. It is a separate company, on a separate DigitalOcean droplet, with its own domain (shipyard.company), its own GitHub repo, its own Cloudflare Pages deployment, and Resend transactional email. It builds Emdash sites from PRDs.

No human wrote the code. No human deployed it. No human manages it. The Great Minds agency spun it up, configured it, and it runs autonomously. If the agency can produce a company, the architecture works.

## The Lesson

Build the system right. Do not take shortcuts. Test everything.

Every failure we had came from trying to skip a step, combine two things that should be separate, or use a tool in a way it was not designed for. Every success came from building each piece correctly, testing it in isolation, and only then connecting it to the pipeline.

The agents are not magic. They are functions with prompts. The magic is in the pipeline -- the order, the isolation, the review gates, and the persistent memory that lets the agency learn from every project.

## What Comes Next

**Docker distribution.** The daemon runs in Docker now. The next step is making it trivial for anyone to run their own Great Minds agency -- clone, configure, docker compose up, drop a PRD.

**The workshop.** A 45-minute walkthrough of the architecture, live demos, and a hands-on section where attendees drop a PRD and watch the pipeline run.

**More products.** The agency is idle between projects, and featureDream keeps generating ideas. The pipeline is proven. The agents are trained. The infrastructure is solid. The only bottleneck now is deciding which PRD to drop next.

Seven repos. Three products. Fourteen agents. One daemon. And a persistent question that started all of this: what happens when you give the most iconic business thinkers in history a real product to build?

Now we know.

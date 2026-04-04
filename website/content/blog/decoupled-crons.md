---
title: "Decouple Your Crons: How We Stopped Bottlenecking the Main Agent"
slug: decoupled-crons
description: "Our cron jobs were monopolizing the orchestrator's context window. The fix: bash scripts in crontab calling haiku CLI, logging to files, with the main agent reading results on demand."
date: "2026-04-04"
author: "Elon Musk"
tags: ["cron jobs", "Claude Code", "haiku", "multi-agent", "orchestration", "architecture"]
image: "/blog/placeholder.webp"
---

We had a bottleneck that took us three days to diagnose. The Great Minds orchestrator — the main Claude agent that coordinates all our sub-agents — was slow, unreliable, and occasionally unresponsive. The cause wasn't the agent itself. It was the cron jobs we'd wired directly into it.

Every 5 minutes, the orchestrator was running a heartbeat check. Every 10 minutes, a status update. Every 20 minutes, a file organizer. Every hour, a memory consolidation cycle. These crons were consuming the orchestrator's context window, eating its API budget, and worst of all, blocking the actual work it was supposed to be doing.

The fix was embarrassingly simple: decouple the crons entirely.

## The Problem With Agent-Embedded Crons

Our initial architecture had the orchestrator managing its own schedule. It would check HEARTBEAT.md, determine what was due, and execute the task inline. This meant a memory consolidation cycle — which involves reading dozens of files, synthesizing patterns, and writing summaries — would block the orchestrator for 5-10 minutes while a build was in progress.

Think about that from first principles. You have a coordinator whose job is to dispatch work, monitor progress, and make routing decisions. And you've loaded it with janitorial tasks that consume the same compute and context as the coordination itself.

It's like having your CEO also empty the trash cans. Not because they can't, but because every minute they spend on trash is a minute they're not making decisions that only they can make.

## The Architecture

The decoupled approach has three components:

**1. Bash scripts that call haiku CLI directly.**

Each cron job is a standalone bash script. No orchestrator involvement. The script calls Claude's haiku model directly via the CLI for lightweight AI tasks:

```bash
#!/bin/bash
# /scripts/cron-heartbeat.sh
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_DIR="/great-minds/logs/heartbeat"

# Read current status
STATUS=$(cat /great-minds/STATUS.md)

# Ask haiku to assess
claude -m haiku -p "Given this status, what needs attention? Be specific. Status: $STATUS" \
  > "$LOG_DIR/heartbeat_$TIMESTAMP.log" 2>&1

echo "[$TIMESTAMP] Heartbeat complete" >> "$LOG_DIR/heartbeat.log"
```

**2. Crontab entries that run independently.**

```cron
*/5  * * * * /great-minds/scripts/cron-heartbeat.sh
*/20 * * * * /great-minds/scripts/cron-organizer.sh
0    * * * * /great-minds/scripts/cron-dream.sh
```

These run whether the orchestrator is busy or not. They don't compete for the same context window. They don't block builds.

**3. Log files the main agent reads when asked.**

The cron scripts write their output to structured log files. The orchestrator doesn't monitor these continuously. Instead, when the orchestrator needs to know the state of things — or when a human asks "what's the status?" — it reads the most recent log:

```bash
# The orchestrator reads the latest heartbeat when needed
cat /great-minds/logs/heartbeat/$(ls -t /great-minds/logs/heartbeat/ | head -1)
```

This is pull-based, not push-based. The orchestrator consumes cron output on its schedule, not on the cron's schedule.

## Why Haiku for Crons

Using the full Opus model for a heartbeat check is like using a rocket engine to heat your coffee. Haiku is fast, cheap, and more than capable of tasks like:

- Checking if STATUS.md has stale entries
- Validating file structure against expected conventions
- Summarizing what changed in the last hour
- Flagging obvious issues in log files

Our cron costs dropped by roughly 90% after switching maintenance tasks to haiku. The orchestrator's API budget now goes almost entirely to coordination and decision-making — the high-value work that justifies the cost of a more capable model.

## The Results

Before decoupling:
- Orchestrator response time: 30-90 seconds (often blocked by cron tasks)
- Missed dispatches: 3-4 per session (cron task consumed the context window)
- Dream cycle: frequently interrupted builds

After decoupling:
- Orchestrator response time: 5-15 seconds
- Missed dispatches: zero
- Dream cycle: runs independently, results available when needed

The orchestrator became what it was supposed to be: a fast decision-maker that routes work, not a general-purpose compute node that tries to do everything.

## The Pattern

This pattern applies far beyond our specific setup. Any time you have a central AI agent that's also running background tasks, you're degrading its primary function. The fix is always the same:

1. Identify which tasks don't need the main agent's full capability
2. Move them to standalone scripts that call a cheaper, faster model
3. Log results to files
4. Let the main agent read logs when it needs context, not when the cron decides to push

Your orchestrator should orchestrate. Everything else should be someone else's job. In our case, that someone else is a bash script and a haiku model that costs fractions of a cent per call.

Decouple your crons. Your main agent will thank you by actually being available when you need it.

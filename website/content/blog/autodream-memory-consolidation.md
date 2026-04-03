---
title: "AutoDream: How Our AI Agents Clean Up Their Own Memory While You Sleep"
slug: autodream-memory-consolidation
description: "We built a dream cycle for AI agents — a background process that consolidates memory, prunes stale data, and keeps the system files current. Here's how it works and why your agents need one."
date: "2026-04-03"
author: "Seth Shoultes"
tags: ["autodream", "memory", "ai-agents", "claude-code", "consolidation"]
image: "/blog/placeholder.webp"
---

I woke up one morning, checked our Great Minds agency status, and discovered that AGENTS.md said we had five agents. We had nine. STATUS.md said "SHIPPED" — we were still building. SCOREBOARD.md was three rounds behind. Every system file the agency depended on for coordination had gone stale overnight.

Nobody was maintaining the agency's own documentation while the agents were busy building the product.

That's the moment I realized AI agent memory doesn't just need architecture. It needs a janitor. A really good one, running on a schedule, cleaning up while everyone else sleeps.

So we built one. We call it the dream cycle.

---

## The Drift Problem Nobody Warns You About

When you're running a multi-agent system — nine AI personas in our case, spanning creative directors, sub-agents, QA, and a board reviewer — the system files that coordinate everything start decaying the moment you stop manually updating them.

AGENTS.md listed five agents because that's how many we started with. We added Rick Rubin, Jony Ive, Maya Angelou, and Sara Blakely as sub-agents over the course of several rounds. Each addition was documented in the team definitions, in the round transcripts, in the relevant agent specs. But nobody updated the roster file. Why would they? Each agent was focused on their own deliverable.

STATUS.md was worse. It had been set to "SHIPPED" during a phase transition that got rolled back. Two subsequent agent sessions read that status and made decisions based on a project state that was wrong. The QA agent skipped regression checks because the project was "shipped." The moderator didn't dispatch new tasks because the state machine said we were done.

SCOREBOARD.md drifted silently. Debate positions from rounds one and two were still marked as "open" when they'd been resolved in round four. Strategic decisions that had been validated or invalidated during the build phase were never reflected back in the scoreboard.

The pattern is clear: system files drift within hours without automated consolidation. Not days. Hours. In an active multi-agent session, the half-life of accurate documentation is measured in single-digit hours.

---

## What Auto Dream Actually Is

Claude Code has an unreleased feature called Auto Dream. It's a background memory consolidation process — essentially a dream cycle that runs between sessions to clean up, compress, and organize what the agent has learned.

It was discovered in v2.1.83 when users noticed a toggle in the `/memory` UI. The feature appeared functional in the interface but returned "Unknown skill" when invoked through `/dream`. For most users, it still does.

The concept, though, is well-documented in the leaked Claude Code source. It's part of an internal project called KAIROS — Anthropic's roadmap for autonomous agent capabilities. KAIROS includes `/dream` as "nightly memory distillation," a process that runs automatically after 24 hours and 5+ sessions, consolidating what the agent has learned into clean, compressed memory files.

The dream process is sandboxed. It can only write to memory files, never source code. It follows a strict four-phase cycle that mirrors how human memory consolidation works during sleep — orient to what you know, identify what's changed, merge and clean, then prune what's no longer needed.

The community didn't wait for the official release. The `grandamenium/dream-skill` project on GitHub replicates the four-phase process and can be installed as a Claude Code skill today. The system prompts behind it have been extracted at `Piebald-AI/claude-code-system-prompts` for anyone who wants to understand the mechanics before running it.

We didn't use either of those. We built our own.

---

## Our Implementation: The 60-Minute Dream Cron

We implemented the dream cycle as a cron job running every 60 minutes during active sessions. It's assigned to our organizer-haiku agent — a lightweight, haiku-class model that costs roughly a fifth of what a Sonnet-class agent costs per invocation. Its only job is memory hygiene.

The cron runs four phases in sequence:

### Phase 1: Orient

The agent scans every memory file in the system — MEMORY.md, all topic files in `memory/`, and the system files (AGENTS.md, STATUS.md, SCOREBOARD.md, HEARTBEAT.md). It builds a knowledge map: what exists, what each file claims, when it was last modified, and what the current entry count looks like.

This phase is read-only. The agent is building situational awareness before it touches anything.

### Phase 2: Gather Signal

The agent identifies what has actually changed since the last dream cycle. It scans round transcripts, QA reports, board reviews, and recent commits for signals: new agents added, status changes, decisions made, positions validated or invalidated, contradictions between what memory says and what the codebase shows.

This is where it caught the five-to-nine agent drift. The round transcripts mentioned Rick Rubin, Jony Ive, Maya Angelou, and Sara Blakely. AGENTS.md didn't list them. Signal gathered.

### Phase 3: Consolidate

The agent merges related entries, removes redundancies, and resolves contradictions. If two memory entries say different things about the same topic, the more recent one wins — but only after verification against the current codebase. If a memory entry references a file that no longer exists, it gets removed. If three entries say variations of the same lesson, they get compressed into one.

This phase also updates the system files. AGENTS.md gets the current roster. STATUS.md gets the actual project state. SCOREBOARD.md gets the latest debate position statuses.

### Phase 4: Prune and Index

The agent updates MEMORY.md — the always-loaded index that every other agent reads at the start of every session. The constraint is strict: 50 lines maximum, one line per entry, roughly 150 characters each. If the index is approaching the limit, entries get compressed or removed.

After pruning, the agent commits and pushes the changes automatically. The next agent session starts with clean, current system files.

```
Dream Cycle (every 60 minutes)
================================

  [Orient]          Scan all memory + system files
      |              Build knowledge map
      v
  [Gather Signal]   Scan rounds, QA reports, commits
      |              Identify drift, new facts, contradictions
      v
  [Consolidate]     Merge related entries
      |              Remove redundancies
      |              Update AGENTS.md, STATUS.md, SCOREBOARD.md
      v
  [Prune & Index]   Compress MEMORY.md to <50 lines
      |              Commit and push changes
      v
  [Sleep 60 min]    Wait for next cycle
```

---

## The Three-Layer Memory Architecture It Maintains

The dream cycle doesn't just clean up files randomly. It maintains a deliberate three-layer architecture that controls how memory flows into agent context.

**Layer 1: MEMORY.md index (37 lines, always loaded).** This is the only memory file that every agent reads at the start of every session. It's a flat index of one-line pointers to topic files. No prose, no detail — just enough for an agent to know whether a deeper file is relevant to the current task. In our 18-hour LocalGenius build, this file never exceeded 37 lines. The dream cycle enforces the 50-line ceiling.

**Layer 2: Topic files in `memory/` (loaded on demand).** These cover discrete subjects — agency identity, architecture decisions, dream research, project learnings, operational patterns. An agent working on frontend design loads the design-related memory file. An agent doing QA loads the testing patterns file. Nothing else. Context is surgical.

**Layer 3: Round files, QA reports, board reviews (searched, never loaded).** Jensen Huang's 19 board reviews, Margaret Hamilton's QA reports, the full debate transcripts from every round — these are archived but never dumped into context wholesale. When a specific fact is needed, the agent searches the archive and retrieves only the relevant passage. This is where most developers go wrong: they either load everything (burning context on noise) or archive nothing (losing the ability to reference it). The right answer is keep it all, but search it surgically.

---

## The Rules We Learned the Hard Way

After running this system through multiple projects and hundreds of agent hours, these are the rules that survived contact with reality.

**Don't store what's derivable from the codebase.** File paths, function signatures, database schemas, recent git history — none of this belongs in memory. It changes constantly, and stale references are worse than no references. If an agent needs to know about a file, it should read the file, not remember what the file used to contain.

**Memory is a hint to verify, not a source of truth.** Even correct memories should trigger a verification step before the agent acts on them. We learned this when Jensen Huang's board review cited an onboarding feature that existed in memory but not in code. The feature had been planned, the plan was accurately recorded, but the feature was never built. The memory was technically correct and practically dangerous.

**Categorize, don't chronologize.** Memory organized by date is almost useless. A correction about testing strategy belongs next to prior feedback about testing, not next to whatever else happened that Tuesday. Chronological memory hides patterns and makes it easy to miss contradictions between entries about the same topic.

**Stale memory is worse than no memory.** An agent with no memory about a topic will investigate. An agent with stale memory about a topic will act confidently on wrong information. The dream cycle exists specifically to prevent this — to catch staleness before it causes decisions.

**System files drift within hours without automated consolidation.** This is the one that motivated the entire dream cycle. Not days, not weeks. Hours. If you're running active multi-agent sessions and nobody is maintaining the coordination files, they'll be wrong by lunchtime.

---

## The KAIROS Connection

The leaked Claude Code source references an internal Anthropic project called KAIROS — an autonomous agent mode that represents the next evolution of Claude Code's capabilities. KAIROS includes `/dream` as a core feature: "nightly memory distillation" that runs automatically, consolidating what the agent learned across sessions into clean, actionable memory.

Our dream cycle is the same concept, built externally. We didn't wait for Anthropic to ship it. The four-phase process — orient, gather, consolidate, prune — maps directly to what KAIROS describes internally. The difference is that we run it on a 60-minute cron during active sessions rather than waiting for a nightly batch.

When Auto Dream does ship officially, it'll likely replace our custom implementation. Until then, the cron works. It's been running for weeks, and the system files haven't drifted once since we turned it on.

---

## Add It To Your Own Agent Setup

You don't need our full agency infrastructure to run a dream cycle. Here's the prompt template for a dream consolidation cron that you can adapt to any Claude Code setup:

```
## Dream Consolidation (run every 60 minutes)

You are a memory consolidation agent. Your only job is memory hygiene.

### Phase 1: Orient
Scan all files in memory/ and MEMORY.md. List what exists and what each file covers.

### Phase 2: Gather Signal
Read recent session activity — round files, QA reports, commit history.
Identify: new facts, corrections, contradictions with existing memory,
entries referencing files/features that no longer exist.

### Phase 3: Consolidate
- Merge related entries across memory files
- Remove redundant entries (keep the most specific version)
- Resolve contradictions (recent + verified wins)
- Update system files (AGENTS.md, STATUS.md) with current state

### Phase 4: Prune & Index
- Update MEMORY.md index: one line per entry, 150 chars max, 50 lines max
- Remove entries that are derivable from the codebase
- Remove entries about files/features that no longer exist
- Commit and push changes

### Constraints
- Write ONLY to memory/ files and system .md files
- NEVER modify source code, deliverables, or configuration
- If uncertain whether to keep or prune, keep it
- Verify against current codebase before removing any entry
```

If you're using the Great Minds plugin, you don't need to set this up manually. The `/agency-crons` command configures the dream cycle automatically alongside the orchestrator, heartbeat, and board reviewer crons. It's one command to get the full operational infrastructure running.

---

## Your Agents Are Forgetting Things Right Now

If you're running any kind of multi-agent AI system — Claude Code, a custom swarm, anything with persistent state across sessions — your system files are drifting right now. Your agent roster is probably wrong. Your status file probably says something that was true yesterday. Your memory index probably has entries pointing to things that no longer exist.

The fix is a dream cycle. Orient, gather, consolidate, prune. Every 60 minutes. Assign it to your cheapest agent. Let it run while you sleep.

Your agents will wake up smarter.

Install the Great Minds plugin at [great-minds.agency/install](/install) to get the dream cycle, the three-layer memory architecture, and the full multi-agent coordination system running on your next project. The dream cron is included and configured automatically.

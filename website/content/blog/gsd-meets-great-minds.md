---
title: "GSD Meets Great Minds: How We Integrated Wave Execution"
slug: gsd-meets-great-minds
description: "GSD brings wave execution, XML plans, context rot prevention, and scope creep detection. Combined with Great Minds, it gives every agent fresh context per task and keeps projects on the rails."
date: "2026-04-04"
author: "Margaret Hamilton"
tags: ["GSD", "wave execution", "context management", "multi-agent", "project management", "integration"]
image: "/blog/placeholder.webp"
---

Great Minds is good at building. The debate protocol produces better architecture. The agent roster covers every role. The board review catches strategic blind spots. But Great Minds had a project management problem: context rot.

Context rot is what happens when an agent accumulates so much conversational history that its recent decisions are polluted by stale information from earlier in the session. By round 6 of a build, the orchestrator's context window contains the PRD, two rounds of debate, a planning phase, and the outputs of multiple sub-agents. The signal-to-noise ratio degrades with every round.

GSD — Get Stuff Done — is a task execution framework built around a principle that directly addresses this: fresh context per task. When we integrated GSD into Great Minds, the combination solved problems neither system handled alone.

## What GSD Brings

GSD operates on a concept called wave execution. Instead of running tasks sequentially in a single session, GSD organizes work into waves — groups of tasks that can execute in parallel, each in a fresh context with only the information that task needs.

A GSD plan is expressed in XML:

```xml
<plan>
  <wave id="1" name="Foundation">
    <task id="1.1" agent="architect" context="prd,debate-decisions">
      Define plugin skeleton and file structure
    </task>
    <task id="1.2" agent="designer" context="prd,debate-decisions">
      Create admin UI mockups
    </task>
  </wave>
  <wave id="2" name="Core Build" depends="1">
    <task id="2.1" agent="cpt-developer" context="skeleton,prd">
      Build custom post type and meta boxes
    </task>
    <task id="2.2" agent="css-developer" context="mockups,color-system">
      Implement grid, list, and masonry layouts
    </task>
  </wave>
</plan>
```

Each task specifies exactly which context it needs. Task 2.1 gets the skeleton and the PRD. It doesn't get the debate transcript, the designer's mockups, or the CSS agent's color decisions. Not because those are secret — because they're irrelevant to building the custom post type, and including them would dilute the agent's focus.

This is fresh context per task. Every agent starts with a clean window loaded with only what it needs to do its job.

## Context Rot Prevention

In the original Great Minds system, the orchestrator managed all context. It read the PRD, conducted the debate, planned the build, dispatched agents, and reviewed results. By the time it dispatched the seventh agent, its context window held thousands of tokens of accumulated history, and its attention was split across everything that had happened so far.

The symptoms were subtle: agents receiving instructions that referenced decisions from three rounds ago without restating them. Sub-agents inheriting context about other sub-agents' tasks that confused their scope. The orchestrator occasionally contradicting its own earlier decisions because the relevant context had scrolled far enough up the window to lose salience.

GSD prevents this by making context explicit and bounded. The orchestrator generates the wave plan at the start, then each wave executes independently. The orchestrator doesn't carry the build context — the plan does. Each task's `context` attribute is a manifest of exactly which files and decisions the agent receives.

When task 2.1 runs, the CPT developer doesn't know or care what the CSS agent is doing in task 2.2. It has the skeleton, the PRD, and nothing else. Its context window is fresh, focused, and free of rot.

## Scope Creep Detection

GSD's wave structure also acts as a scope detector. Every task in the plan has a defined output. If an agent produces output that doesn't match its task description, the system flags it.

In our Pinned build, the JavaScript Agent was tasked with "build drag-and-drop reordering for the admin board editor." During execution, it also added frontend sorting functionality — a feature that wasn't in its task and wasn't in the plan. Without GSD, this scope creep would have gone unnoticed until QA found it (which is exactly what happened — bug number 5).

With GSD, the task output is diffed against the task description. An agent producing files or modifying code outside its declared scope triggers a review before the output is accepted. This doesn't prevent all scope creep, but it catches the most common kind: agents being helpful by doing more than they were asked.

## Wave Execution in Practice

The Pinned build under GSD looked like this:

**Wave 1 (Foundation):** Architect defines skeleton. Designer creates mockups. Two agents, parallel, fresh context each.

**Wave 2 (Core Build):** CPT, CSS, Shortcode, Copywriter agents. Four agents in parallel. Each gets only the artifacts from Wave 1 that they need.

**Wave 3 (Integration Build):** Block Developer, JavaScript Agent, Settings Agent, Cron Agent. These depend on Wave 2 outputs. Fresh context loaded with their specific dependencies.

**Wave 4 (Quality):** QA, Security, Performance agents. All three run in parallel against the merged codebase. Fresh context with the complete build.

**Wave 5 (Polish):** Documentation Agent writes the readme after QA passes. Board review runs against the final package.

Five waves instead of one long session. Each wave is a clean execution boundary. Agents in Wave 3 don't carry the conversation history from Wave 1 — they carry the artifacts.

## The Integration Points

Connecting GSD to Great Minds required three changes:

**1. The debate phase generates the wave plan.** After Steve and Elon finalize their strategic decisions, the plan phase now produces an XML wave plan instead of a flat task list. The wave structure encodes dependencies that the flat list left implicit.

**2. The orchestrator dispatches waves, not individual agents.** Instead of tracking 14 individual agent states, the orchestrator tracks 5 wave states. A wave is either pending, in progress, or complete. This reduces orchestrator complexity dramatically.

**3. Each task declares its context manifest.** The `context` attribute on each task is a list of file paths and artifact names. The dispatch system assembles the context for each agent from this manifest, ensuring fresh and focused input.

## What Changed

Build reliability improved measurably. The class name mismatch (bug 3) would have been caught by GSD's scope detection — the CSS agent and shortcode agent declaring different class names against the shared interface contract would flag a conflict before the code was written.

Context rot disappeared. Agents in later waves perform at the same quality as agents in early waves because they're not degraded by accumulated history.

The orchestrator became simpler. Instead of managing the full state of 14 agents and their interdependencies, it manages 5 waves with explicit dependency declarations.

Fresh context per task isn't just an optimization. It's the difference between agents that degrade over the course of a project and agents that perform consistently from start to finish. GSD gave Great Minds the execution framework it was missing. The debates are still the soul of the system. But the waves are the spine.

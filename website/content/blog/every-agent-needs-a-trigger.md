---
title: "Every Agent Needs a Trigger"
slug: every-agent-needs-a-trigger
description: "We built 14 agents for Pinned. Half sat idle because nothing in the system activated them. AGENT-TRIGGERS.md maps each agent to a phase. A job title without a trigger is just a name on a page."
date: "2026-04-04"
author: "Sara Blakely"
tags: ["agent triggers", "multi-agent", "orchestration", "workflow", "productivity", "system design"]
image: "/blog/placeholder.webp"
---

We defined 14 agents for the Pinned plugin build. Plugin Architect, Custom Post Type Agent, Block Developer, Shortcode Agent, CSS Agent, JavaScript Agent, Settings Agent, Cron Agent, QA Agent, Documentation Agent, Security Agent, Performance Agent, Designer, Copywriter.

Fourteen roles with detailed descriptions, clear responsibilities, and specific outputs. Seven of them did meaningful work. The other seven sat there like employees with job descriptions and no manager. They existed. They just never got called.

The problem wasn't the agents. The problem was that nothing in the system told the orchestrator when to activate them.

## The Invisible Gap

When you define an agent, you write what it does. The Plugin Architect "defines file structure, class hierarchy, and hook registration." The Security Agent "audits nonces, capabilities, and data sanitization." These descriptions are clear and correct. They're also useless without a trigger.

A trigger answers the question: when does this agent run? Not what it does — when it activates. In what phase? After which dependency? In response to what condition?

The Plugin Architect's trigger is obvious — it runs first, during the plan phase, because everything else depends on its output. The Block Developer's trigger is also clear — it runs after the architect produces the skeleton, during the build phase.

But what about the Security Agent? When does a security audit happen? After every component is built? After the first integration? Before the board review? If you don't specify, the answer is "never" because the orchestrator doesn't know when to dispatch it.

The Performance Agent had the same problem. Its job was to check query efficiency and asset loading. Excellent task. But nothing in the build pipeline said "now run the performance agent." So it didn't run until someone manually asked for it at the end.

## AGENT-TRIGGERS.md

The fix was a single file that maps every agent to its activation condition:

```markdown
# Agent Triggers

## Phase: PLAN
- Plugin Architect → Activates when debate phase completes
- Designer → Activates when debate phase completes (parallel with Architect)

## Phase: BUILD (Wave 1 - after Architect skeleton exists)
- Custom Post Type Agent → Activates when skeleton is committed
- CSS Agent → Activates when skeleton is committed
- Copywriter → Activates when debate decisions are finalized

## Phase: BUILD (Wave 2 - after Wave 1 components exist)
- Block Developer → Activates when CPT and CSS agents complete
- Shortcode Agent → Activates when CPT agent completes
- JavaScript Agent → Activates when Block Developer completes
- Settings Agent → Activates when CSS Agent completes (needs color system)
- Cron Agent → Activates when CPT agent completes

## Phase: REVIEW (after all BUILD agents complete)
- QA Agent → Activates when all build branches are merged
- Security Agent → Activates when all build branches are merged
- Performance Agent → Activates when all build branches are merged
- Documentation Agent → Activates when QA passes
```

This file does something no individual agent definition can do: it shows the whole pipeline. You can see the dependency graph. You can identify which agents run in parallel and which must wait. And crucially, you can see where the gaps were — Security, Performance, and Documentation had no triggers in the original system because they weren't part of any wave.

## The Pattern

Every agent in a multi-agent system needs three things:

**1. A role definition.** What it does, what it produces, what quality bar it meets. This is what most people write and stop.

**2. A trigger condition.** The specific event, phase completion, or dependency that causes the orchestrator to dispatch this agent. Without this, the agent exists in theory but never in practice.

**3. An output destination.** Where the agent puts its work so that downstream agents and the orchestrator can find it. A trigger without an output destination means the agent runs but its work disappears.

Most multi-agent tutorials focus exclusively on role definitions. They describe what each agent does in loving detail. Then they hand-wave the orchestration: "the agents coordinate to produce the final output." That's like writing job descriptions for a company and hoping the employees figure out on their own when to show up.

## Job Title vs. Job

There's a difference between having an agent and having an agent that does something. An agent without a trigger is a job title. It looks impressive in the roster. It adds to the count when you say "we have 14 agents." But if the orchestrator doesn't know when to activate it, the agent is decoration.

After implementing AGENT-TRIGGERS.md, our effective agent count went from 7 to 14. Not because we added agents — we didn't change a single role definition. We just told the system when to use the agents we already had.

The Security Agent now runs automatically after all build branches merge. It found two nonce validation issues that would have shipped to production. The Performance Agent identified an unindexed meta query that would have degraded at scale. The Documentation Agent produced a readme that shipped with the plugin instead of being hastily written after the fact.

These agents existed the whole time. They just needed someone to tell them when it was their turn.

## The Audit

If you're running a multi-agent system, do this right now: list every agent you've defined. Next to each one, write the trigger condition — the specific event that causes it to activate. If you can't write a trigger for an agent, that agent isn't real. It's a name on a page.

Then check if those triggers are actually wired into your orchestrator. A trigger written in documentation but not implemented in the dispatch logic is the same as no trigger at all.

Every agent needs a job title, a trigger, and an output destination. Skip any one of those three and you don't have an agent. You have an idea about an agent. Ideas don't find security vulnerabilities. Triggered agents do.

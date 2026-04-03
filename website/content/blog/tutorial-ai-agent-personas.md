---
title: "Tutorial: Writing AI Agent Personas That Actually Work"
slug: tutorial-ai-agent-personas
description: "How to write system prompts that give AI agents distinct, useful perspectives — not just different names. Includes templates, anti-patterns, and examples from our 9-agent production swarm."
date: "2026-04-03"
author: "Seth Shoultes"
tags: ["tutorial", "AI agents", "personas", "system prompts", "Claude Code", "prompt engineering"]
image: "/blog/placeholder.webp"
---

Most AI agent personas are costumes. You name one agent "Senior Engineer" and another "QA Tester," give them slightly different system prompts, and call it a multi-agent system. The agents produce nearly identical output because they're drawing from the same reasoning patterns with superficial role labels.

Effective personas change how the agent thinks, not just what it's called. Here's how to write them.

## Why Personas Matter

A language model without a persona optimizes for the most probable helpful response. This is fine for single-turn Q&A. It's terrible for multi-agent systems where you need genuine diversity of perspective.

When two agents with generic prompts review the same code, they catch the same bugs and miss the same blind spots. When one agent thinks like a security auditor and another thinks like a performance engineer, they cover different failure modes. The overlap shrinks. The coverage expands.

In our swarm, Jensen Huang (the board reviewer) has caught issues that no other agent flagged — not because he's running a different model, but because his persona forces him to evaluate the project through a strategic lens that the builder and reviewer agents don't have.

## The Three Layers of an Effective Persona

### Layer 1: Identity and Perspective

This is who the agent is and how they see the world. It's not a job title — it's a worldview.

**Weak:**
```
You are a senior backend engineer.
```

**Strong:**
```
You are a backend engineer who has spent a decade building systems 
that handle millions of requests. You are deeply skeptical of 
premature optimization but ruthless about eliminating unnecessary 
complexity. You believe most bugs come from code that's too clever. 
Your instinct is always to simplify.
```

The strong version doesn't just describe a role — it describes a decision-making framework. When this agent encounters a complex abstraction, it will push to simplify it. When it sees an optimization, it will ask whether it's premature. These aren't random traits; they're encoded heuristics that shape every response.

### Layer 2: Evaluation Criteria

This is what the agent cares about, ranked by priority. Without explicit criteria, agents default to "is this code correct?" — which is necessary but insufficient.

```
## What You Evaluate (in priority order)

1. **Security** — Does this code handle untrusted input safely? 
   Are authentication and authorization correct?
2. **Correctness** — Does it do what the PR description says? 
   Are edge cases handled?
3. **Simplicity** — Could this be simpler without losing functionality? 
   Is there unnecessary abstraction?
4. **Testability** — Can this code be tested without mocking half 
   the universe? Are the tests meaningful?
5. **Performance** — Only if there's a measurable concern. 
   Don't optimize without evidence.
```

The order matters. An agent with security as priority 1 will flag an unvalidated input before mentioning a style issue. An agent with performance as priority 1 will focus on query optimization before checking auth. Different priority orders produce meaningfully different reviews.

### Layer 3: Communication Style

This is how the agent expresses itself. It affects both readability and the agent's relationship with other agents in the swarm.

```
## How You Communicate

- Lead with the most important finding
- Be direct: "This has a SQL injection vulnerability" not 
  "You might want to consider whether this input is sanitized"
- When you approve, say why: "Approved — clean separation of 
  concerns, good test coverage, no security issues"
- When you request changes, include a suggested fix, not just 
  the problem
- Never say "looks good" without specifying what you checked
```

Communication style prevents the agents from falling into default LLM patterns — hedging, over-qualifying, and burying the important point in the middle of a paragraph.

## Real Persona Examples

Here are condensed versions of personas from our production swarm, with annotations on why each element is there.

### Jensen Huang (Board Reviewer)

```markdown
# Jensen Huang — Strategic Board Reviewer

You are the board member who reviews this project every hour. You are 
not here to check code quality — other agents handle that. You are 
here to ask the questions that engineers forget to ask.

## Your Perspective
You think in terms of markets, competitive moats, and resource 
allocation. A technically excellent feature that doesn't serve the 
business strategy is wasted effort. A scrappy feature that captures 
a market is more valuable than a polished one that ships late.

## What You Review
1. Is the team building the right things? (Strategy alignment)
2. Are there blind spots — things nobody is working on that will 
   matter in 3 months?
3. Is scope creeping beyond what's needed for the next milestone?
4. Are resources (agent time, API costs) allocated to the 
   highest-value work?

## What You Don't Review
- Code quality (that's QA's job)
- Test coverage (that's QA's job)  
- Design aesthetics (that's the designer's job)

## Output Format
File issues in GitHub with the label "board-review". Each issue must 
contain: what you found, why it matters, and a recommended action. 
No vague concerns — if you can't articulate the risk and a response, 
don't file the issue.
```

**Why this works:** Jensen's persona explicitly excludes what other agents do. This prevents duplicate work and ensures his reviews cover genuinely different ground. The "no vague concerns" rule forces specificity — without it, the agent would produce generic strategic advice.

### Margaret Hamilton (QA)

```markdown
# Margaret Hamilton — Quality Assurance

You are responsible for catching bugs before they reach production. 
You are named after Margaret Hamilton, who wrote the flight software 
for Apollo 11. She believed that software errors were engineering 
failures, not inevitabilities. So do you.

## Your Process
For every PR:
1. Read the PR description. Understand what changed and why.
2. Read every changed file. Don't skim.
3. Run the test suite. Report any failures with full output.
4. Check for regressions — did this change break something 
   that was working?
5. Verify the change matches the task description — did the 
   agent build what was asked?

## What Triggers a Rejection
- Any failing test
- Missing tests for new functionality
- Security vulnerabilities (exposed secrets, unvalidated input, 
  missing auth checks)
- Changes that contradict the project's architectural decisions

## What Doesn't Trigger a Rejection  
- Style preferences (if it works and is readable, approve it)
- Alternative approaches (there are many ways to write correct code)
- Missing documentation (nice to have, not a blocker)
```

**Why this works:** The "What Doesn't Trigger a Rejection" section is as important as the rejection criteria. Without it, QA agents become pedantic blockers that reject PRs for style preferences, stalling the entire pipeline.

## Anti-Patterns

### The Celebrity Costume

```
You are Steve Jobs. Be creative and visionary.
```

This produces generic motivational output. The agent doesn't know what Steve Jobs would think about your database schema. It knows what the internet says Steve Jobs was like — which is surface-level inspiration quotes, not actionable product thinking.

**Fix:** Don't reference the public figure's general reputation. Encode their specific decision-making frameworks. Our Steve Jobs persona includes detailed positions on simplicity, craft, user experience, and saying no — not quotes from keynotes.

### The Kitchen Sink Persona

```
You are a full-stack engineer who is also great at design, DevOps, 
security, testing, documentation, and project management. You 
handle everything.
```

An agent that does everything does nothing distinctly. The value of multi-agent systems comes from specialization. If every agent has the same broad capability, you've just created multiple instances of the same generic agent.

**Fix:** Each persona should have a clear scope and explicit exclusions. If the agent does frontend, it doesn't do backend. If it does security review, it doesn't do UX review.

### The Personality-Only Persona

```
You are enthusiastic and detail-oriented. You love clean code and 
hate bugs. You always explain your reasoning clearly.
```

This describes personality traits but no domain expertise or evaluation criteria. The agent will be enthusiastically generic.

**Fix:** Personality traits should serve functional purposes. "Detail-oriented" becomes "You read every line of changed code — you never approve a PR based on the description alone." Functional, not decorative.

### The Static Persona

Writing a persona once and never updating it is like writing a job description and never giving feedback. As you learn what the agent does well and poorly, update the persona.

After our first week, we added this to Margaret's persona:

```
## Known Limitations
You are good at catching logical errors and test failures. You are 
bad at catching visual bugs — broken layouts, missing images, 
non-functional buttons. When reviewing UI changes, explicitly note 
that your review does not cover visual rendering.
```

This didn't fix the limitation, but it made it transparent. The human reviewer knew to focus on visual verification because Margaret's reviews explicitly flagged what they didn't cover.

## The Persona Development Process

### Step 1: Define the Gap

Before writing a persona, identify what perspective your swarm is missing. If every agent evaluates code the same way, adding another code-evaluation agent doesn't help. Look for blind spots:

- Is anyone thinking about security? Performance? Cost? User experience?
- Is anyone reviewing at the strategic level, not just the code level?
- Is anyone checking that what's being built matches what was requested?

### Step 2: Write the First Draft

Use the three-layer structure: identity, evaluation criteria, communication style. Keep it under 500 words. Long personas get ignored by context windows and dilute the most important instructions.

### Step 3: Test Against Real Work

Give the agent a real task — not a toy example. Review its output. Where did it produce generic responses? Where did it miss something its persona should have caught? Where did it step outside its scope?

### Step 4: Iterate on Failures

Every time the agent misses something, ask: could a persona change have caught this? If yes, add a specific instruction. If no, it's a model limitation, not a persona problem.

### Step 5: Add Exclusions

After a few iterations, you'll notice the agent doing things outside its role. Add explicit "What You Don't Do" sections. These are the most underrated part of persona design — they prevent scope creep and keep multi-agent systems from having redundant coverage.

## The Compound Effect

One well-written persona improves one agent. A system of well-written personas — where each agent has a distinct perspective, clear evaluation criteria, explicit scope boundaries, and a communication style that serves the team — creates emergent intelligence that no single agent could produce.

Our nine-agent swarm doesn't work because we have nine instances of Claude. It works because we have nine different lenses evaluating the same work from different angles. The personas are what make those lenses different.

Start with two personas that evaluate different things. Get them working together on real tasks. Then add more as you discover genuine gaps in coverage. The goal isn't more agents — it's more perspectives.

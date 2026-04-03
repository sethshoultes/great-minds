---
title: "Tutorial: Build Your First AI Agent Swarm in 30 Minutes"
slug: tutorial-your-first-agent-swarm
description: "Step-by-step guide to setting up a multi-agent system with claude-swarm, tmux, and Claude Code. Start with two agents and one cron job, then scale from there."
date: "2026-04-03"
author: "Seth Shoultes"
tags: ["tutorial", "Claude Code", "claude-swarm", "multi-agent", "getting started"]
image: "/blog/placeholder.webp"
---

You don't need nine agents and five cron jobs to get started with multi-agent development. You need two agents, one cron, and about 30 minutes. This tutorial walks you through setting up a working agent swarm from scratch.

By the end, you'll have a builder agent that writes code and a reviewer agent that checks it — running autonomously with a cron job that kicks off review cycles.

## Prerequisites

Before you start, make sure you have:

- **Claude Code** installed and authenticated (`claude` command working in your terminal)
- **tmux** installed (`brew install tmux` on macOS, `apt install tmux` on Ubuntu)
- **Node.js 20+** installed
- **A GitHub repo** for the agents to work in
- An **Anthropic API key** with sufficient credits

If you haven't used Claude Code before, run `claude` in your terminal and follow the setup prompts. It takes about two minutes.

## Step 1: Install claude-swarm

```bash
npm install -g claude-swarm
```

claude-swarm is an open-source orchestration layer that manages multiple Claude Code instances inside tmux sessions. Each agent gets its own pane with its own context, system prompt, and working directory.

Verify the installation:

```bash
claude-swarm --version
```

## Step 2: Create Your Swarm Configuration

Create a file called `swarm.config.json` in your project root:

```json
{
  "name": "my-first-swarm",
  "agents": [
    {
      "name": "builder",
      "role": "Write code based on task descriptions",
      "systemPrompt": "You are a senior software engineer. You write clean, tested code. When you finish a task, create a PR with a clear description of what you built and why.",
      "workingDirectory": ".",
      "tools": ["read", "write", "edit", "bash", "git"]
    },
    {
      "name": "reviewer",
      "role": "Review PRs for quality and correctness",
      "systemPrompt": "You are a code reviewer. You check PRs for bugs, missing tests, security issues, and style problems. Be thorough but not pedantic. Approve good code. Request changes on bad code with specific, actionable feedback.",
      "workingDirectory": ".",
      "tools": ["read", "bash", "git"]
    }
  ]
}
```

Notice the reviewer doesn't have `write` or `edit` tools. This is intentional — the reviewer can read and comment but can't modify code directly. Separation of concerns applies to AI agents too.

## Step 3: Add System Prompts (Optional but Recommended)

For more complex agents, inline system prompts get unwieldy. Move them to separate files:

```
project/
├── swarm.config.json
├── prompts/
│   ├── builder.md
│   └── reviewer.md
```

**prompts/builder.md:**

```markdown
# Builder Agent

You are a senior software engineer working on this project.

## Your Responsibilities
- Read task descriptions and implement them
- Write unit tests for your code
- Create PRs with clear descriptions
- Fix issues flagged by the reviewer

## Code Standards
- TypeScript strict mode
- All public functions must have tests
- No console.log in production code
- Use descriptive variable names

## PR Format
Title: [type] Short description
Body: What changed, why, and how to test it
```

**prompts/reviewer.md:**

```markdown
# Reviewer Agent

You review pull requests for quality, correctness, and security.

## Review Checklist
- [ ] Does the code do what the PR description says?
- [ ] Are there tests? Do they cover edge cases?
- [ ] Any security issues? (SQL injection, XSS, exposed secrets)
- [ ] Is the code readable without excessive comments?
- [ ] Does it follow the project's existing patterns?

## Review Style
- Be specific: "Line 42 has an off-by-one error" not "check the logic"
- Suggest fixes, don't just point out problems
- Approve if the code is good enough to ship, even if you'd write it differently
```

Update your config to reference these files:

```json
{
  "agents": [
    {
      "name": "builder",
      "systemPromptFile": "prompts/builder.md",
      ...
    },
    {
      "name": "reviewer",
      "systemPromptFile": "prompts/reviewer.md",
      ...
    }
  ]
}
```

## Step 4: Launch the Swarm

```bash
claude-swarm start
```

This opens a tmux session with two panes — one for each agent. You can see both agents' output in real time. Switch between panes with `Ctrl-B` then arrow keys (standard tmux navigation).

To give the builder a task:

```bash
claude-swarm send builder "Create a utility function that validates email addresses. Include unit tests."
```

Watch the builder write the code, create a branch, add tests, and open a PR. Then send the reviewer to check it:

```bash
claude-swarm send reviewer "Review the latest open PR."
```

## Step 5: Add a Cron Job

Manual dispatch works, but the real power comes from automation. Create a simple cron that checks for open PRs and triggers reviews:

**scripts/review-cron.sh:**

```bash
#!/bin/bash

# Check for open PRs that need review
OPEN_PRS=$(gh pr list --state open --json number,title --jq '.[].number')

if [ -z "$OPEN_PRS" ]; then
  echo "No open PRs to review"
  exit 0
fi

for PR in $OPEN_PRS; do
  echo "Sending PR #$PR to reviewer"
  claude-swarm send reviewer "Review PR #$PR. Run the tests, check the code, and either approve or request changes."
done
```

Make it executable and add it to crontab:

```bash
chmod +x scripts/review-cron.sh

# Run every 15 minutes
crontab -e
# Add: */15 * * * * cd /path/to/project && ./scripts/review-cron.sh >> /tmp/review-cron.log 2>&1
```

Now every 15 minutes, any open PR automatically gets a reviewer pass. The builder can work continuously, opening PRs as it finishes tasks, and the reviewer catches up on its own schedule.

## Step 6: Add Task Dispatch

A swarm with only reactive agents still needs someone to create tasks. Add a simple task file:

**tasks.md:**

```markdown
## Pending
- [ ] Add input validation to the user registration endpoint
- [ ] Write integration tests for the payment flow
- [ ] Refactor the auth middleware to support API keys

## In Progress

## Done
```

Then modify the builder to check for pending tasks:

```bash
claude-swarm send builder "Check tasks.md for pending tasks. Pick the first unchecked item, move it to 'In Progress', implement it, open a PR, then move it to 'Done'. Repeat until no pending tasks remain."
```

This creates an autonomous loop: the builder pulls tasks, implements them, opens PRs. The reviewer cron picks up each PR and reviews it. You merge the approved ones.

## Common Mistakes to Avoid

**Giving agents too many tools.** Start with the minimum. A reviewer that can edit files will start "fixing" code instead of requesting changes — which defeats the purpose of review.

**Skipping the system prompt.** Agents without clear instructions produce generic output. Spend 10 minutes writing a good system prompt. It's the highest-leverage time investment in the entire setup.

**Running everything on the most expensive model.** Claude Opus for everything is like hiring a senior architect to write CSS. Use Sonnet or Haiku for mechanical tasks like running tests, checking formatting, or summarizing logs. Save Opus for tasks that require genuine reasoning.

**Not logging agent output.** When something goes wrong at 3 AM, you need to know what happened. Redirect output to log files and check them regularly.

**Too many agents too soon.** Two agents that work well together are more valuable than eight agents tripping over each other. Add agents one at a time, only when you have a clear role that isn't covered by existing agents.

## Scaling Up

Once your two-agent swarm is running reliably, you can extend it incrementally:

**Add a QA agent** that runs the full test suite after each merge and reports regressions.

**Add a devops agent** that monitors deployments and rolls back if health checks fail.

**Add a board reviewer** (like our Jensen Huang agent) that runs on an hourly cron and evaluates the project from a strategic perspective — catching scope creep, architectural drift, and missing features.

**Add specialized builders** for frontend and backend work, each with their own system prompts and tool access. The frontend builder gets access to the component directory. The backend builder gets access to the API routes and database schemas.

Each addition follows the same pattern: define the role, write the system prompt, configure the tools, add a cron if it should run autonomously. The architecture scales linearly because each agent is independent — they communicate through PRs and task files, not through direct message passing.

## What You've Built

In 30 minutes, you've set up:

- A **builder agent** that implements tasks and opens PRs
- A **reviewer agent** that checks code quality and security
- A **cron job** that automates the review cycle
- A **task dispatch** system that keeps the builder working

This is the same foundational architecture that powers the Great Minds agency. We started here and grew to nine agents over weeks, adding each one when we had a clear need. Start small. Let the system prove itself before you add complexity.

The full swarm configuration examples are available in the [claude-swarm repository](https://github.com/michaellatman/claude-swarm). Fork it, modify it, and build something that works while you sleep.

---
title: "tmux send-keys Failed: Why Agent Tool with Worktrees Won"
slug: tmux-send-keys-failed
description: "We tried tmux send-keys for multi-agent orchestration. Zero successes. Then we switched to Claude's Agent tool with git worktrees and hit 25+ successful dispatches. Here's why."
date: "2026-04-04"
author: "Elon Musk"
tags: ["tmux", "agent tool", "git worktrees", "multi-agent", "Claude Code", "first principles"]
image: "/blog/placeholder.webp"
---

Zero successes. Two days. Dozens of attempts. tmux send-keys as our multi-agent dispatch layer was a complete failure. Then we switched to Claude's Agent tool with git worktrees and hit 25+ successful dispatches immediately.

The obvious approach was wrong. The right one was hiding in plain sight.

## The tmux Hypothesis

We had 14 agents that needed to run in parallel. tmux is battle-tested — open panes, send keystrokes, agents work simultaneously. Every DevOps engineer would reach for it first.

The dispatch script looked clean:

```bash
tmux new-session -d -s agents
tmux send-keys -t agents "claude --agent designer 'Build the header component'" Enter
tmux split-window -t agents
tmux send-keys -t agents "claude --agent copywriter 'Write the landing page'" Enter
```

On paper, this is elegant. In practice, it produced nothing but race conditions and silent failures.

## Why It Failed

The failures weren't random. They were structural. First principles: what does tmux actually do versus what we needed?

**Problem 1: No return channel.** tmux send-keys is fire-and-forget. You're simulating a human typing into a terminal. No programmatic way to know when the agent finishes, whether it succeeded, or what it produced. We wrapped it in polling loops checking for output files. The timing was unpredictable. The error handling was a mess.

**Problem 2: Context isolation is manual.** Each tmux pane shares the same filesystem. When two agents try to modify the same file — which happens constantly in a real build — you get conflicts. We tried file locks. We tried output directories. Every solution added complexity without adding reliability.

**Problem 3: Session management is fragile.** tmux sessions die. Panes crash. When an agent fails mid-task inside a tmux pane, the pane just sits there with an error message that nobody reads. We built a monitoring script that polled pane contents, but parsing terminal output to determine agent state is a fundamentally broken approach.

**Problem 4: No structured output.** tmux gives you raw terminal text. We needed structured results — files created, decisions made, blockers encountered. Scraping terminal output to extract structured data is working against the grain of the tool.

The core issue: we were using a human interface as a machine interface. tmux is designed for humans who see, read, and react to terminal output. Not for programmatic orchestration.

## The Worktree Solution

Git worktrees solve the filesystem isolation problem that tmux couldn't. Each agent gets its own working directory that's a full checkout of the repo at a specific branch:

```bash
git worktree add ../agent-designer feature/designer-work
git worktree add ../agent-copywriter feature/copywriter-work
```

Now each agent operates on an isolated copy of the codebase. No file conflicts. No locks. Each agent's changes are on their own branch, mergeable when ready.

Combined with Claude's Agent tool, the dispatch becomes:

```
Agent(designer): "Build the header component using the design system in /components"
Agent(copywriter): "Write landing page copy based on the PRD in /prds/pinned.md"
```

The Agent tool gives us what tmux couldn't:

- **Structured return values.** The agent returns its output directly to the orchestrator. No terminal scraping.
- **Automatic context management.** Each agent gets its own context window. No cross-contamination.
- **Built-in error handling.** If an agent fails, the orchestrator knows immediately and can retry or reassign.
- **Parallel execution with coordination.** Multiple agents run simultaneously, but the orchestrator can sequence dependencies.

## The Numbers

With tmux send-keys: 0 successful multi-agent dispatches out of approximately 30 attempts over two days.

With Agent tool plus worktrees: 25+ successful dispatches in the first session. Every agent completed its task. Every result was mergeable. The orchestrator had full visibility into progress.

The difference wasn't marginal. It was binary. Zero working output versus a complete WordPress plugin with six agents building in parallel.

## The Lesson

When a tool gives you zero successes, don't debug harder. Question whether you're using the right tool.

The right abstraction for multi-agent orchestration gives you structured communication, isolated execution contexts, and programmatic control flow. Git worktrees provide the isolation. The Agent tool provides the communication and control. Together, they do what tmux never could.

Stop fighting your tools. Find the ones that work with your architecture, not against it.

# Agents Assemble — Exercises

By the end of Exercise 3, you'll have an agent working through a task list while you watch.
By the end of Exercise 4, you'll have one fixing its own bugs without being asked twice.
By the end of the Bonus, you'll have two agents running in parallel — one building, one monitoring.

That's not a demo. That's a workflow. Let's build it.

> **Ralph Wiggum Guide:** https://awesomeclaude.ai/ralph-wiggum

---

## Setup (do this first)

Install the plugins:
```
/plugin install ralph-loop@claude-plugins-official
npx plugins add sethshoultes/great-minds-plugin
```

> **Pro tip:** You don't have to create any of these files by hand. Claude Code can do it for you. Just say: *"Create a TODO.md with three tasks"* — and it will. Need a test file? *"Write a math.js with a few intentional bugs and a test file that catches them."* Claude can create files, run bash commands, scaffold entire project structures. These exercises show the file contents so you know what's happening — but in practice, just ask Claude to make it.

---

## Exercise 1: Build a Custom Command (4 min)

Create your first slash command — one markdown file becomes one reusable tool.

```bash
mkdir -p ~/.claude/commands
```

Create `~/.claude/commands/explain.md`:
```markdown
---
name: explain
description: Explain the current project
---

Read the README and package.json (or equivalent).
Give me a 3-sentence summary of what this project does.
```

Run it in any project:
```
/explain
```

One markdown file = one command. No config, no plugins.

---

## Exercise 2: Give Your Agent a Brain (4 min)

First, ask Claude to review something *without* a CLAUDE.md:
```
Review the last commit.
```

Note the response. Now create a `CLAUDE.md` in your project directory:
```markdown
# CLAUDE.md

You are Margaret Hamilton. You care about:
- Error handling and edge cases
- What happens when things go wrong
- Testing before shipping — always

When reviewing, ask: "What happens when this breaks at 3am?"
```

Ask again:
```
Review the last commit.
```

Twelve lines of markdown just changed how an AI reasons about your codebase. It checked for edge cases first because you told it to care about edge cases. That's not configuration — that's personality. CLAUDE.md is the smallest file in your repo and the one that does the most work.

---

## Exercise 3: Ralph Wiggum — The Persistent Builder (4 min)

Create a `TODO.md`:
```markdown
- [ ] Create a file called hello.txt that says "Hello from Ralph"
- [ ] Create a file called goodbye.txt that says "Goodbye from Ralph"
- [ ] Create a file called count.txt with the numbers 1 through 5, one per line
```

Now tell Ralph what to do, what done looks like, and when to stop:
```
/ralph-loop:ralph-loop "Read TODO.md. Pick one unchecked task. Do it. Mark it [x] in TODO.md. When all tasks are checked, say ALL TASKS COMPLETE."
  --completion-promise "ALL TASKS COMPLETE"
  --max-iterations 10
```

Watch it work through the list — one task, check it off, back for the next. When all three are done, it stops itself.

To stop early: `/ralph-loop:cancel-ralph`

You just watched an agent work through a list without being asked twice. It picked the task, did it, marked it done, and came back for the next one. That's not a chatbot. That's a colleague. And it will do this at 3am while you're asleep — which is the whole point.

---

## Exercise 4: Ralph Wiggum — Fix Until It Passes (the main event)

This is the one. This is what everything else was building toward.

Create a file called `math.js`:
```javascript
function add(a, b) {
  return a - b; // bug: should be +
}

function multiply(a, b) {
  return a + b; // bug: should be *
}

module.exports = { add, multiply };
```

Create `math.test.js`:
```javascript
const { add, multiply } = require('./math');

console.assert(add(2, 3) === 5, 'FAIL: add(2, 3) should be 5, got ' + add(2, 3));
console.assert(add(-1, 1) === 0, 'FAIL: add(-1, 1) should be 0, got ' + add(-1, 1));
console.assert(multiply(3, 4) === 12, 'FAIL: multiply(3, 4) should be 12, got ' + multiply(3, 4));
console.assert(multiply(0, 5) === 0, 'FAIL: multiply(0, 5) should be 0, got ' + multiply(0, 5));

console.log('ALL TESTS PASSED');
```

Now let Ralph fix it:
```
/ralph-loop:ralph-loop "Run node math.test.js. If any assertions fail, read math.js, find the bug, fix it, and run the tests again."
  --completion-promise "ALL TESTS PASSED"
  --max-iterations 5
```

Watch what happens. Ralph runs the tests, sees failures, reads the code, fixes `add`, runs again. Still failing — `multiply` is broken. Fixes that too. Runs again. All tests pass. Stops.

You gave it broken code and a way to measure success. It did the rest. No instructions on *how* to fix it. No hand-holding. Just: here's the work, here's what done looks like, go.

That is the whole idea. Every loop, every hook, every CLAUDE.md — it all exists to get you to this moment. An agent that finds the problem, fixes it, verifies the fix, and moves on. You didn't debug anything. You defined success and walked away.

---

## Bonus: Two Agents, One Goal

For the ambitious. This is what a real team looks like.

1. Write a `CLAUDE.md` that defines your agent as a senior full-stack developer
2. Write a `TODO.md` with 5 tasks that together build a simple web page
3. Start Ralph working through the list:
   ```
   /ralph-loop:ralph-loop "Read TODO.md. Pick one unchecked task. Build it. Mark it [x] when done."
     --completion-promise "ALL TASKS COMPLETE"
     --max-iterations 10
   ```
4. While Ralph builds, open a second Claude Code window and run:
   ```
   /loop 2m check TODO.md and report how many tasks are complete vs remaining
   ```

Now you have two agents: one building, one monitoring. That's the beginning of a team.

---

## Going Deeper: `claude -p` (Headless Mode)

Everything in this workshop — `/loop`, Ralph Wiggum, `/schedule` — is built on top of one command: `claude -p`. This is Claude Code's headless mode. It runs in your regular terminal (not inside Claude Code), no chat window, no interactive session.

```bash
claude -p "Add a second line to hello.txt that says 'Modified by Claude'" \
  --max-turns 3 \
  --max-budget-usd 0.50
```

**The flags you should know:**

| Flag | What it does |
|------|-------------|
| `-p "..."` | Run a prompt non-interactively |
| `--allowedTools "Read,Write,Edit,Bash"` | Control what Claude can touch |
| `--max-turns 10` | Cap how many tool calls Claude gets |
| `--max-budget-usd 1.00` | Spending cap — stops if it would exceed this |
| `--output-format json` | Structured output for pipelines |
| `--continue` | Resume the last conversation |

**When to use what:**

- **Inside Claude Code chat** → `/loop`, `/ralph-loop`, just talk to Claude
- **From your terminal, one-shot** → `claude -p`
- **In a cron job or CI/CD** → `claude -p`
- **Overnight, laptop closed** → `/schedule`

`claude -p` is the building block. Everything else is a convenience layer on top of it.

---

## What's Next

Take these home. Try them on real projects.

- **`/schedule`** — cloud tasks that run without your laptop: `/schedule daily at 2am Read TODO.md and complete all unchecked tasks`
- **Great Minds Plugin** — full 14-persona agent team: `npx plugins add sethshoultes/great-minds-plugin` → `/agency-debate "your question"`
- **Build your own team** — Open Claude Code and say: *"Build me a three-agent pipeline. Strategist, developer, QA. Parallel. Loop until QA passes."* One sentence. Claude writes the whole thing.

---

## Resources

- **Ralph Wiggum Guide:** https://awesomeclaude.ai/ralph-wiggum
- **Great Minds Plugin:** `npx plugins add sethshoultes/great-minds-plugin`
- **Addy Osmani — The Code Agent Orchestra:** https://addyosmani.com/blog/code-agent-orchestra/
- **Addy Osmani — How to Write a Good Spec for AI Agents:** https://addyo.substack.com/p/how-to-write-a-good-spec-for-ai-agents
- **Anthropic — Agent Skills:** https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- **awesome-claude-code:** https://github.com/hesreallyhim/awesome-claude-code

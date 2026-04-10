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

> **What's actually happening under the hood:** Each Ralph iteration is a completely fresh agent instance — no memory of the previous run. The TODO.md *is* the memory. Ralph reads it, sees what's checked, picks the next unchecked item, does it, marks it done, and exits. The loop calls it again. The file is the state. This is the same principle behind the full PRD-driven Ralph pattern — see Exercise 5 for that.

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

## Exercise 5: Ralph With a Real PRD — The Full Pattern (take-home)

This is the original Ralph technique as described by Jeffrey Huntley. Instead of a TODO list, Ralph works from a structured requirements file — and writes its own memory between iterations.

> **Watch these first:**
> - https://www.youtube.com/watch?v=A6vYr0dmQAY — Gary Sims builds a complete MQTT server from spec to working code
> - https://www.youtube.com/watch?v=_IK18goX4X8 — Deep dive into prd.json + progress.txt, feedback loops, human-in-the-loop Ralph, and why small tasks matter

**The two-file memory system:**
- `prd.json` — what needs to be built, structured as user stories with `pass`/`fail` status
- `progress.txt` — notes the AI writes to itself about what it's done so far

Every Ralph iteration starts fresh — no memory of previous runs. But it reads these files first. That's how it knows where it is.

**Step 1: Write your requirements as a PRD**

Ask Claude to create one:
```
Create a prd.json for a simple command-line calculator that supports add,
subtract, multiply, and divide. Format it as a JSON array of user stories,
each with: id, description, acceptance_criteria, and status (set to "fail").
```

It will create something like:
```json
[
  {
    "id": 1,
    "description": "Add two numbers",
    "acceptance_criteria": "add(2, 3) returns 5",
    "status": "fail"
  },
  {
    "id": 2,
    "description": "Subtract two numbers",
    "acceptance_criteria": "subtract(5, 3) returns 2",
    "status": "fail"
  }
]
```

**Step 2: Create an empty progress file**
```bash
echo "No progress yet. Starting fresh." > progress.txt
```

**Step 3: Run Ralph once — human in the loop**

Run it once first. Watch what it does. Make sure it picks the right task and the feedback loop works before you let it run unattended.
```
/ralph-loop:ralph-loop "Read prd.json and progress.txt. Pick the highest priority user story where status is fail — not necessarily the first one, but the one that unblocks the most others. Implement it. Write tests that verify the acceptance criteria. Run the tests. If they pass, update prd.json to mark it pass. Append your progress and a note for next iteration to progress.txt. Make a git commit. If all stories pass, say ALL STORIES PASSING."
  --completion-promise "ALL STORIES PASSING"
  --max-iterations 1
```

Check: Did it update `prd.json`? Did it write to `progress.txt`? Did it commit? Does the code actually work?

**Step 4: Let it run**
```
/ralph-loop:ralph-loop "Read prd.json and progress.txt. Pick the highest priority user story where status is fail. Implement it. Write tests. Run them. If they pass, mark it pass in prd.json. Append progress notes to progress.txt. Only work on ONE story per iteration. Make a git commit. If all stories pass, say ALL STORIES PASSING."
  --completion-promise "ALL STORIES PASSING"
  --max-iterations 20
```

Walk away. When you come back: every story marked `pass`, a git commit per feature, and `progress.txt` as a full log written by Ralph, for Ralph.

**Why small tasks matter:** One giant task and a bunch of small ones means Ralph gets swallowed by the big one. Keep every user story small enough for a single focused context window. One feature. One commit. One loop. That's what produces clean code.

**The feedback loop is everything:** Type checking, unit tests, CI — whatever you can run automatically. Ralph needs to *know* it worked, not just believe it did. The better your feedback loop, the better Ralph performs.

This is what the 262 files morning looked like. This is what the $50K contract looked like. A spec, two files, and a loop.

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
- **Gary Sims — Ralph Wiggum Demo:** https://www.youtube.com/watch?v=A6vYr0dmQAY
- **Matt Pocock — Ralph Deep Dive (prd.json, feedback loops, human-in-loop):** https://www.youtube.com/watch?v=_IK18goX4X8
- **Great Minds Plugin:** `npx plugins add sethshoultes/great-minds-plugin`
- **Addy Osmani — The Code Agent Orchestra:** https://addyosmani.com/blog/code-agent-orchestra/
- **Addy Osmani — How to Write a Good Spec for AI Agents:** https://addyo.substack.com/p/how-to-write-a-good-spec-for-ai-agents
- **Anthropic — Agent Skills:** https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- **awesome-claude-code:** https://github.com/hesreallyhim/awesome-claude-code

# Agents Assemble — Exercises

Hands-on exercises for workshop attendees. Work through these at your own pace.
Each builds on the last — by the end you'll have an autonomous agent running.

---

## Setup (do this first)

Install the plugins:
```
/plugin install ralph-loop@claude-plugins-official
npx plugins add sethshoultes/great-minds-plugin
```

> **Pro tip:** You don't have to create any of these files by hand. Claude Code can do it for you. Instead of opening an editor and typing out `TODO.md`, just tell Claude: *"Create a TODO.md with three tasks"* — and it will. Need a test file? *"Write a math.js with a few intentional bugs and a test file that catches them."* Claude can create files, run bash commands, install packages, and set up entire project structures. These exercises show the file contents so you know what's happening — but in practice, just ask Claude to make it.

---

## Exercise 1: Your First Loop (2 min)

Start a simple loop to see how `/loop` works:
```
/loop 1m tell me a fun fact about the current time
```

Watch it run once. Then tell Claude "end the loop" to stop it.

**What you learned:** `/loop` repeats any task on a timer. You control when it stops.

---

## Exercise 2: Build a Custom Command (4 min)

Create your first slash command:
```bash
mkdir -p ~/.claude/commands
```

Create the file `~/.claude/commands/explain.md`:
```markdown
---
name: explain
description: Explain the current project
---

Read the README and package.json (or equivalent).
Give me a 3-sentence summary of what this project does.
```

Now run it:
```
/explain
```

**What you learned:** One markdown file = one custom command. No config, no plugins.

---

## Exercise 3: Give Your Agent a Brain (3 min)

Create a `CLAUDE.md` in any project directory:
```markdown
# CLAUDE.md

You are a senior code reviewer. You care about:
- Security vulnerabilities
- Test coverage
- Clear variable names

When asked to review, check these three things first.
```

Now ask Claude:
```
Review the last commit.
```

Watch how the CLAUDE.md shapes its behavior. It checks security first, then coverage, then naming — exactly what you told it to care about.

**What you learned:** CLAUDE.md defines your agent's identity and priorities. It's the most important file in any autonomous setup.

---

## Exercise 4: Ralph Wiggum — The Persistent Builder (5 min)

This is the main event. Create a `TODO.md`:
```markdown
- [ ] Create a file called hello.txt that says "Hello from Ralph"
- [ ] Create a file called goodbye.txt that says "Goodbye from Ralph"
- [ ] Create a file called count.txt with the numbers 1 through 10, one per line
```

Start the Ralph loop:
```
/ralph-loop:ralph-loop "Read TODO.md. Pick one unchecked task. Do it. Mark it [x] in TODO.md. When all tasks are checked, say ALL TASKS COMPLETE." --completion-promise "ALL TASKS COMPLETE" --max-iterations 10
```

Watch it work through the list. Each iteration it picks one task, does it, checks it off, and loops back. When all three are done, it says "ALL TASKS COMPLETE" and stops.

**To stop early:** `/ralph-loop:cancel-ralph`

**What you learned:** The Ralph Wiggum loop is persistent iteration. It doesn't stop until the work is done or you tell it to. This is the building block for overnight autonomous builds.

---

## Exercise 5: Ralph Wiggum — Fix Until It Passes (5 min)

This one shows Ralph's real power — iterating on failures until they're fixed.

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

Create a test file `math.test.js`:
```javascript
const { add, multiply } = require('./math');

console.assert(add(2, 3) === 5, 'add(2, 3) should be 5, got ' + add(2, 3));
console.assert(add(-1, 1) === 0, 'add(-1, 1) should be 0, got ' + add(-1, 1));
console.assert(multiply(3, 4) === 12, 'multiply(3, 4) should be 12, got ' + multiply(3, 4));
console.assert(multiply(0, 5) === 0, 'multiply(0, 5) should be 0, got ' + multiply(0, 5));

console.log('ALL TESTS PASSED');
```

Now let Ralph fix it:
```
/ralph-loop:ralph-loop "Run node math.test.js. If any assertions fail, read math.js, find the bug, fix it, and run the tests again. When all tests pass, say ALL TESTS PASSED." --completion-promise "ALL TESTS PASSED" --max-iterations 5
```

Ralph will run the tests, see the failures, fix `add`, run again, see `multiply` still fails, fix it, run again — all tests pass. Done.

**What you learned:** Ralph is perfect for tasks with built-in verification. Tests, linters, type checkers — anything where "done" is measurable.

---

## Exercise 6: Schedule It (2 min)

Set up a cloud-hosted task that runs without your laptop:
```
/schedule daily at 9am Read the git log from the last 24 hours and write a summary to STANDUP.md
```

This runs on Anthropic's cloud. Your machine can be off. It clones your repo, does the work, and commits.

**What you learned:** `/schedule` is the night shift. Ralph works while you're at your desk. `/schedule` works while you sleep.

---

## Exercise 7: Great Minds Debate (3 min)

Install the Great Minds plugin (if you haven't already):
```
npx plugins add sethshoultes/great-minds-plugin
```

Run a debate:
```
/agency-debate "Should we build a mobile app or web app first?"
```

Watch Steve Jobs and Elon Musk argue about it. Steve will push for user experience and design. Elon will push for speed and first principles. Rick Rubin distills it to the essence.

**What you learned:** Multi-agent debate produces better decisions than a single agent thinking alone. Different perspectives, different priorities, better output.

---

## Bonus: Combine Everything

For the ambitious — combine what you've learned:

1. Write a `CLAUDE.md` that defines your agent as a full-stack developer
2. Write a `TODO.md` with 5 tasks that build a simple web page
3. Start a Ralph loop to work through the list
4. While Ralph builds, run `/loop 2m check if TODO.md has any unchecked tasks and tell me the status`

Now you have two agents: one building, one monitoring. That's the beginning of a team.

---

## Going Deeper: `claude -p` (Headless Mode)

Everything in this workshop — `/loop`, Ralph Wiggum, `/schedule` — is built on top of one command: `claude -p`. This is Claude Code's **headless mode**. It runs in your regular terminal, not inside the Claude Code chat UI.

Open Terminal (or iTerm, whatever you use), `cd` into your project, and run:
```bash
claude -p "Add a second line to hello.txt that says 'Modified by Claude'" \
  --max-turns 3 \
  --max-budget-usd 0.50
```

That's it. No chat window. No interactive session. Claude reads the prompt, does the work, and exits.

**The flags you should know:**

| Flag | What it does | Example |
|------|-------------|---------|
| `-p "..."` | Run a prompt non-interactively (headless) | `claude -p "fix all lint errors"` |
| `--allowedTools "Read,Write,Edit,Bash"` | Control what Claude can touch | Leave out `Bash` if you don't want it running commands |
| `--max-turns 10` | Cap how many tool calls Claude gets | Prevents runaway sessions |
| `--max-budget-usd 1.00` | Spending cap — stops if it would exceed this | Good safety net for overnight runs |
| `--output-format json` | Structured output for scripts and pipelines | Pipe into `jq` for automation |
| `--continue` | Resume the last conversation | Pick up where you left off |

**When to use `claude -p` vs the other tools:**

- **Inside Claude Code chat?** Use `/loop`, `/ralph-loop`, or just talk to Claude
- **From your terminal, one-shot?** Use `claude -p`
- **In a cron job or CI/CD pipeline?** Use `claude -p`
- **In a bash script?** Use `claude -p`
- **Overnight, laptop closed?** Use `/schedule`

`claude -p` is the building block. Everything else is a convenience layer on top of it.

---

## Quick Reference

| Command | What it does | How to stop |
|---------|-------------|-------------|
| `/loop 5m <task>` | Repeat a task on a timer | "end the loop" or Ctrl+C |
| `/ralph-loop:ralph-loop "<task>" --completion-promise "DONE" --max-iterations 10` | Persistent iteration until done | `/ralph-loop:cancel-ralph` |
| `/schedule daily at 9am <task>` | Cloud task, runs without your laptop | Manage at claude.ai/code/scheduled |
| `/explain` (custom) | Run your custom command | N/A (one-shot) |

---

## Resources

- **Ralph Wiggum Guide:** https://awesomeclaude.ai/ralph-wiggum
- **Great Minds Plugin:** `npx plugins add sethshoultes/great-minds-plugin`
- **Addy Osmani — The Code Agent Orchestra:** https://addyosmani.com/blog/code-agent-orchestra/
- **Addy Osmani — How to Write a Good Spec for AI Agents:** https://addyo.substack.com/p/how-to-write-a-good-spec-for-ai-agents
- **Anthropic — Agent Skills:** https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- **awesome-claude-code:** https://github.com/hesreallyhim/awesome-claude-code

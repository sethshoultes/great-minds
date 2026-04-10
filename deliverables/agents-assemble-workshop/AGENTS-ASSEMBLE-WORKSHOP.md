# Agents Assemble: Building Teams That Work While You Sleep

## Workshop Format
- 20 min talk (10 slides, you demo live)
- 15 min hands-on (attendees try 4-5 things)
- **Audience:** Claude Code users who want to level up — they know the basics, we're showing them the power features
- **Prerequisites:** Claude Code installed
- **First thing attendees do:** Install the plugins:
  ```
  npx plugins add sethshoultes/great-minds-plugin
  npx plugins add sethshoultes/ralph-wiggum
  ```

---

## SLIDES

### Slide 1
```
Agents Assemble
Building Teams That Work While You Sleep
```

**Say:** "You all use Claude Code. You know how to ask it to write code, fix bugs, explain things. But how many of you close your laptop and it keeps working?"

*(pause)*

"There's a version of this where you close your laptop and the work keeps going. That's what we're fixing today."

---

### Slide 2: The Basics — Talk to Claude Code Like a Person
```
"Review my last 5 commits and tell me if I missed anything"

"Find all the TODOs in this project and prioritize them"

"Write tests for the checkout function"
```

**Say:** "Claude Code isn't just autocomplete. It reads your files, runs your tests, commits your code. The real shift is when you stop watching over its shoulder."

---

### Slide 3: /loop — Set It and Forget It
```
/loop 5m check if the build passed and tell me the result

/loop 10m look for new GitHub issues and summarize them

/loop 2m run the tests and fix anything that fails
```

**Say:** "This is /loop. Give it a task and a timer. It runs on repeat until you stop it. I use this to monitor deploys, watch for new issues, even run QA in the background while I work on something else. One command. Walk away."

**Say:** "Stopping it is just as simple — **Ctrl+C** kills the loop. Or you can build in a natural exit: tell Claude 'stop when all tasks are done' and it'll finish on its own. You're always in control."

---

### Slide 4: Custom Commands — Build Your Own Tools
```
Create a file: ~/.claude/commands/standup.md

Then just type: /standup
```

**Say:** "You can build your own slash commands. One markdown file, done. I have /standup that reads my git log and writes my standup. I have /brain that saves notes to my knowledge base. You can build /deploy, /review, /whatever. Each one is just a markdown file that tells Claude what to do."

**Show the file:**
```markdown
---
name: standup
description: Generate standup from git activity
---

Look at my git log from the last 24 hours.
Write a standup update: what I did, what's next, blockers.
```

---

### Slide 5: The Ralph Wiggum Loop — Build While You Sleep

**Say:** "I want to tell you about a Tuesday morning. I woke up, opened my laptop, and found 262 files committed. Tests passing. Everything working. I had gone to bed with a TODO list. Here's the loop that did it."

```bash
while true; do
  claude -p "Read TODO.md. Pick one task. Build it. Test it. 
             Commit if tests pass. Mark it done." \
    --allowedTools "Read,Write,Edit,Bash" \
    --max-turns 30
  sleep 10
done
```

**Say:** "Ten lines of bash. You write a TODO list, start the loop, go to bed. Each iteration Claude picks a task, builds it, tests it, and commits. The key flags: `-p` runs it headless — no human needed. `--allowedTools` controls what it can touch. `--max-turns` caps how long each iteration runs so it doesn't go off the rails."

**Say:** "To stop it: **Ctrl+C** if you're at the terminal. Or just close the terminal. The current iteration finishes its commit and that's it — clean stop. You can also add a condition: `while [ -f TODO.md ]; do` — when the TODO list is gone, the loop ends itself."

---

### Slide 6: Hooks — Automate the Boring Stuff

**Say:** "I kept shipping without running tests. I'd push, realize it, feel stupid, revert. So I wrote a hook. Now every time I commit, Claude reminds me. I haven't made that mistake since. That's what hooks are for — catching the habits you keep forgetting you have."

```json
"hooks": {
  "PostToolUse": [{
    "matcher": "Bash",
    "hooks": [{
      "command": "if echo $INPUT | grep -q 'git commit'; 
                  then echo 'Run your tests!'; fi"
    }]
  }]
}
```

**Say:** "Hooks fire on events. After a commit? Remind me to test. After a file edit? Auto-format. Before a push? Run lint. You put this in `settings.json` and it just works. No plugins, no extensions."

---

### Slide 7: CLAUDE.md — Your Agent's Brain
```markdown
# CLAUDE.md

You are a code reviewer. When reviewing PRs:
- Check for security vulnerabilities first
- Run the test suite before approving
- Never approve if tests fail
- Write your review as bullet points
```

**Say:** "This is the most underrated file in your project. CLAUDE.md is where you define who your agent IS. Its personality. Its rules. Its quality bar. Think of it as a job description for your AI colleague. The best autonomous agents aren't the ones with the fanciest loops — they're the ones with the clearest instructions."

**Say:** "The community is calling this 'spec-first prompting.' You write the spec before you write the code. Acceptance criteria. Constraints. Non-goals. The agent confirms the plan before it touches a single file. Rakuten used this pattern to have Claude autonomously implement a feature across a 12.5 million line codebase. Seven hours. 99.9% accuracy."

---

### Slide 8: Building Your Own Agent Team
```
Level 1:  /loop + a prompt              → one agent, one task
Level 2:  CLAUDE.md + claude -p          → one agent, clear identity
Level 3:  Agent tool + worktrees         → parallel agents, isolated
Level 4:  Role files + custom skills     → organized team with contracts
Level 5:  Pipeline + daemon              → autonomous company
```

**Say:** "Here's the progression. You don't jump to Level 5 on day one. You start with a loop. Then you give your agent a brain with CLAUDE.md. Then you spawn multiple agents in parallel using worktrees — each one gets its own copy of the code so they don't step on each other."

**Say:** "The research backs this up. Three focused agents consistently outperform one generalist working three times as long. Specialization multiplies. But here's the thing — you don't need a framework. Claude Code itself IS the agent runtime. The simplest autonomous agent is a well-written CLAUDE.md file and `claude -p`. That's it."

**Show the building blocks:**
```bash
# Level 1: Loop
/loop 5m "check for new issues and triage them"

# Level 2: Headless with identity
claude -p "You are a QA engineer. Read the last 3 commits. 
           Find bugs. File GitHub issues for each one." \
  --allowedTools "Read,Bash"

# Level 3: Parallel agents (in Claude Code)
# Claude spawns these with isolated git worktrees:
Agent(description: "Designer", isolation: "worktree", 
      prompt: "Read the PRD. Create the component library.")
Agent(description: "Engineer", isolation: "worktree", 
      prompt: "Read the PRD. Build the API endpoints.")

# Level 4: Role files
# Create team/designer.md and team/engineer.md
# Each defines: inputs, outputs, quality bar
# Your skill reads the role file and spawns the agent
```

---

### Slide 9: Great Minds — The Full Agent Team
```
PRD --> Steve vs Elon Debate --> Plan --> Build --> QA --> Board Review --> Ship

npx plugins add sethshoultes/great-minds-plugin
/agency-launch
```

**Say:** "We took all of this — loops, commands, hooks, CLAUDE.md, parallel agents, role files — and built a plugin with 14 AI personas. Steve Jobs and Elon Musk debate your product strategy. Margaret Hamilton runs QA — she wrote the code that landed on the moon, she can review yours. A board of directors votes on whether to ship."

**Say:** "We didn't just build a plugin. We built a company. And we went to sleep. When we woke up — 7 plugins, 4 websites, a marketplace. That's what this room is capable of building."

---

### Slide 10: The Cautionary Slide
```
"With great autonomy comes great responsibility"

    Google DORA Report 2025:
    - 90% AI adoption increase
    - 9% bug rate climb  
    - 91% increase in code review time

    The human stays in the loop for verification.
```

**Say:** "One more thing. This is powerful. It's also dangerous if you're not careful. Google's DORA report found that as AI adoption climbs, so do bugs and review time. Amazon had outages tied to AI-generated code. The agents build. You verify. That's the deal. Never ship what you haven't reviewed. The agents work for you — not the other way around."

---

## HANDS-ON (15 min)

"In the next 15 minutes, you're going to do something you won't forget. Open Claude Code."

### Try 1: /loop — and learn to stop it (2 min)
```
/loop 1m tell me a fun fact about the current time
```
Watch it run once. Then **press Ctrl+C** to stop it. Now you know the on/off switch.

### Try 2: Custom Command (4 min)
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
Then run `/explain` in any project.

### Try 3: Write a CLAUDE.md (3 min)
Create a `CLAUDE.md` in any project directory:
```markdown
# CLAUDE.md

You are a senior code reviewer. You care about:
- Security vulnerabilities
- Test coverage
- Clear variable names

When asked to review, check these three things first.
```
Now ask Claude: "Review the last commit." Watch how the CLAUDE.md shapes its behavior.

### Try 4: Ralph Loop (4 min)
Create a `TODO.md`:
```markdown
- [ ] Create a file called hello.txt that says "Hello from Ralph"
- [ ] Create a file called goodbye.txt that says "Goodbye from Ralph"
```
Run:
```bash
claude -p "Read TODO.md. Pick one unchecked task. Do it. Mark it [x] in TODO.md." \
  --allowedTools "Read,Write,Edit,Bash"
```
Check: `cat TODO.md` — one task should be checked off. Run it again — the second task gets done.

### Try 5: Install Great Minds (2 min)
```bash
npx plugins add sethshoultes/great-minds-plugin
/agency-debate "Should we build a mobile app or web app first?"
```
Watch Steve Jobs and Elon Musk argue about it.

---

## WHAT THEY WALK AWAY WITH

You came in today knowing how to use Claude Code. You leave knowing how to make it work without you.

1. **`/loop`** — recurring tasks, one command, Ctrl+C to stop
2. **Custom commands** — `~/.claude/commands/name.md`, one file = one tool
3. **`CLAUDE.md`** — your agent's brain, the most important file in any project
4. **`claude -p`** — headless mode, the building block for all automation
5. **Ralph loop** — `while true; do claude -p "..."; done` — build while you sleep
6. **Hooks** — event-driven automation in `settings.json`
7. **The progression** — loop --> identity --> parallel --> teams --> pipeline
8. **Great Minds plugin** — full agent team, install and go

---

## RESOURCES TO SHARE

Drop these in the chat or on a closing slide:

- **Great Minds Plugin**: `npx plugins add sethshoultes/great-minds-plugin`
- **Addy Osmani — The Code Agent Orchestra**: https://addyosmani.com/blog/code-agent-orchestra/
- **Addy Osmani — How to Write a Good Spec for AI Agents**: https://addyo.substack.com/p/how-to-write-a-good-spec-for-ai-agents
- **Anthropic — Agent Skills**: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- **awesome-claude-code**: https://github.com/hesreallyhim/awesome-claude-code
- **OpenClaw (overnight worker)**: https://github.com/fullstackcrew-alpha/skill-overnight-worker

---

## TIMING

| Section | Time |
|---------|------|
| Slide 1 (intro) | 2 min |
| Slide 2 (basics) | 1 min |
| Slide 3 (/loop + stopping) | 2 min |
| Slide 4 (custom commands) | 2 min |
| Slide 5 (Ralph loop) | 3 min |
| Slide 6 (hooks) | 2 min |
| Slide 7 (CLAUDE.md) | 2 min |
| Slide 8 (building agents) | 3 min |
| Slide 9 (Great Minds) | 2 min |
| Slide 10 (caution) | 1 min |
| Hands-on | 15 min |
| **Total** | **~35 min** |

Thirty-five minutes. They came in using a tool. They leave with a team.

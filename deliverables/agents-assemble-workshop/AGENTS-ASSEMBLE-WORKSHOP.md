# Agents Assemble: Building Teams That Work While You Sleep

## Workshop Format
- 25 min talk (10 slides, you demo live)
- 15 min hands-on (attendees try 4-5 things)
- **Audience:** Claude Code users who want to level up — they know the basics, we're showing them the power features
- **Prerequisites:** Claude Code installed
- **First thing attendees do:** Install the plugins:
  ```
  /plugin install ralph-loop@claude-plugins-official
  npx plugins add sethshoultes/great-minds-plugin
  ```

---

## SLIDES

### Slide 1
```
You close your laptop.
Your agents don't.
```

**Say:** "How many of you close your laptop and it keeps working?"

*(pause — let it land)*

"There's a version of this where you close your laptop and the work keeps going. That's what we're fixing today."

---

### Slide 2: /loop — The On Switch
```
/loop 5m check if the build passed and tell me the result

/loop 10m look for new GitHub issues and summarize them

/loop 2m run the tests and fix anything that fails
```

**Say:** "This is /loop. Give it a task and a timer. It runs on repeat until you stop it. I use this to monitor deploys, watch for new issues, even run QA in the background while I work on something else. One command. Walk away."

**Say:** "To stop it: tell Claude 'end the loop.' Two seconds. Or write the exit condition right into the prompt — 'stop when all tasks are done' — and it ends itself. You set the rules. It follows them."

---

### Slide 3: /schedule — The Night Shift
```
/schedule daily at 2am Read TODO.md and complete all unchecked tasks

/schedule every weekday at 9am summarize open PRs and write to STANDUP.md
```

**Say:** "/schedule is different. This runs on Anthropic's cloud. Your machine can be off. It clones your repo, does the work, commits, and you wake up to the results. /loop is your desk assistant. /schedule is your night shift."

---

### Slide 4: Custom Commands — Build Your Own Tools
```
Create: ~/.claude/commands/standup.md

Run: /standup
```

**Say:** "You can build your own slash commands. One markdown file, done. I have /standup that reads my git log and writes my standup. I have /brain that saves notes to my knowledge base. Each one is just a markdown file that tells Claude what to do."

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

**Say:** "I want to tell you about a Tuesday morning. I woke up, opened my laptop, and found 262 files committed. Tests passing. Everything working. I had gone to bed with a TODO list."

*(pause)*

**Say:** "Here's how it actually works — and this is the part most people miss."

```
prd.json          ← what needs to be built (requirements with pass/fail per story)
progress.txt      ← notes the AI writes to itself about what it's done so far
```

**Say:** "Two files. That's the whole memory system. Every iteration, Ralph wakes up fresh — no memory of the previous run. But it reads these two files first. It knows what the requirements are, it knows what's already done, it picks the next failing requirement and builds it. Marks it pass. Exits. Loop starts again. This keeps going until every requirement in the PRD is marked pass."

**Say:** "The technique is called eventual consistency. Ralph doesn't have to get it right the first time. He just has to keep trying. Each iteration is a fresh mind with a clear brief. That's not a bug — that's the design."

```
/ralph-loop:ralph-loop "Read prd.json and progress.txt. Pick the next
  requirement where status is fail. Implement it. Update prd.json to
  mark it pass. Update progress.txt with what you did."
  --completion-promise "ALL REQUIREMENTS PASSING"
  --max-iterations 50
```

**Say:** "Someone used this to build 6 repos at a Y Combinator hackathon. Another completed a $50K contract for $297 in API costs. The original technique was described by Jeffrey Huntley and later demonstrated by Gary Sims building a full MQTT server — from spec to working server — while the loop ran unattended."

**Say:** "To stop it: `/ralph-loop:cancel-ralph`. One command. Always review before you ship. The tool is the labor. You are still the engineer."

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

**Say:** "Hooks fire on events. After a commit? Remind me to test. After a file edit? Auto-format. Before a push? Run lint. You put this in `settings.json` and it just works. No plugins, no extensions. Ralph is the brain. Hooks are the guardrails."

---

### Slide 7: CLAUDE.md + Personas — Brain and Identity
```markdown
# team/steve-jobs.md
You are Steve Jobs. You care about simplicity above everything.
When you review work, ask: "Would I be proud to ship this?"

# team/margaret-hamilton.md
You are Margaret Hamilton. You care about what happens when things break.
When you review work, ask: "What happens when this fails at 3am?"
```

**Say:** "Rakuten gave Claude a spec and walked away. 12.5 million lines of code. Seven hours. 99.9% accuracy. You know what they had that most teams skip? A CLAUDE.md that told the agent what it was, what it wasn't allowed to do, and what done looked like. Write the definition before you write the code. The agent doesn't need to be smart. It needs to know its job."

**Say:** "But here's the piece almost nobody is doing yet — personas. You can give your agents identities. Not just instructions — *characters*. Watch what happens when the same PR goes to two different personas."

```
Same PR. Two agents.

Steve:    "This is cluttered. Strip it to one message, one button,
           one emotion. What do you want them to feel?"

Margaret: "Line 47 has no error handling. What happens when the
           API times out at 3am? Who gets paged?"
```

**Say:** "Steve asks 'is this beautiful?' Margaret asks 'will this break at 3am?' You need both. A generic agent gives you one perspective. Personas give you a team with genuine tension — and tension is where the best work comes from. This is the piece most people skip. They build loops. They build pipelines. But they don't build *characters*. That's the difference between an automation and a team."

---

### Slide 8: The Five Levels
```
Level 1:  /loop + a prompt              → one agent, one task
Level 2:  CLAUDE.md + /schedule         → one agent, clear identity, overnight
Level 3:  Agent tool + worktrees        → parallel agents, isolated
Level 4:  Role files + custom skills    → organized team with contracts
Level 5:  Pipeline + personas           → autonomous company
```

**Say:** "Most people see 'autonomous agent team' and assume they need a framework. Some orchestration layer. A PhD. You don't. You start at Level 1 tonight. You'll hit Level 3 by next week if you keep going. The tools are already there. The only thing between you and Level 5 is patience and a CLAUDE.md file."

**Say:** "And the research backs the direction. Three focused agents consistently outperform one generalist working three times as long. Specialization multiplies. Give your agents a lane."

---

### Slide 9: Great Minds — What Becomes Possible
```
PRD → Steve vs Elon Debate → Plan → Build → QA → Board Review → Ship

7 plugins. 4 websites. A theme marketplace.
All built while we slept.
```

**Say:** "We used everything on that last slide to build a company. Loops. Schedules. Hooks. CLAUDE.md. Parallel agents. Role files. Personas. We gave Claude a product spec. Steve Jobs and Elon Musk debated the strategy. Margaret Hamilton ran QA — she wrote the code that landed on the moon, she can review yours. A board of directors voted on whether to ship. We went to sleep. That's what we woke up to."

**Say:** "And you can build your own version right now. Open Claude Code and say: *'Build me a three-agent pipeline. Strategist, developer, QA. Parallel. Loop until QA passes.'* One sentence. Claude writes the CLAUDE.md files, the role definitions, the skill that orchestrates them. Your agents. Your rules. Your team."

---

### Slide 10
```
You close your laptop.
Your agents don't.
```

**Say:** "You came in today knowing how to use Claude Code. You leave knowing how to make it work without you."

*(pause)*

"You are still the engineer. The agents work through the night. You are the one who ships it. That difference matters every single time."

*(pause)*

"Go build something tonight."

---

## HANDS-ON (15 min)

"In the next 15 minutes, you're going to do something you won't forget. Open Claude Code."

> **Pro tip:** You don't have to create any of these files by hand. Just ask Claude: *"Create a TODO.md with three tasks"* and it will. Claude can create files, run bash commands, scaffold entire project structures. Ask it to do the setup for you.

### Try 1: /loop — Learn the On/Off Switch (2 min)
```
/loop 1m tell me a fun fact about the current time
```
Watch it run. Then tell Claude "end the loop." Now you know the switch.

### Try 2: Custom Command (3 min)
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
Run `/explain` in any project.

### Try 3: Write a CLAUDE.md + See the Difference (4 min)

First, ask Claude to review something *without* a CLAUDE.md:
```
Review the last commit.
```
Note the response. Now create a `CLAUDE.md`:
```markdown
# CLAUDE.md

You are Margaret Hamilton. You care about:
- Error handling and edge cases
- What happens when things go wrong
- Testing before shipping — always

When reviewing, ask: "What happens when this breaks at 3am?"
```
Ask again: `Review the last commit.`

Watch how the persona reshapes the output. That's identity, not just instructions.

### Try 4: Ralph Wiggum — The Persistent Builder (4 min)
Create a `TODO.md`:
```markdown
- [ ] Create a file called hello.txt that says "Hello from Ralph"
- [ ] Create a file called goodbye.txt that says "Goodbye from Ralph"
- [ ] Create a file called count.txt with the numbers 1 through 5, one per line
```
Run:
```
/ralph-loop:ralph-loop "Read TODO.md. Pick one unchecked task. Do it. Mark it [x] in TODO.md. When all tasks are checked, say ALL TASKS COMPLETE." --completion-promise "ALL TASKS COMPLETE" --max-iterations 10
```
Watch it work through the list. When done, it stops itself. `/ralph-loop:cancel-ralph` to stop early.

### Try 5: Great Minds Debate (2 min)
```bash
npx plugins add sethshoultes/great-minds-plugin
/agency-debate "Should we build a mobile app or web app first?"
```
Watch Steve Jobs and Elon Musk argue about it.

---

## WHAT THEY WALK AWAY WITH

You came in knowing how to use Claude Code. You leave knowing how to make it work without you.

1. **`/loop`** — recurring tasks, one command, "end the loop" to stop
2. **`/schedule`** — cloud tasks that run while your laptop sleeps
3. **Custom commands** — `~/.claude/commands/name.md`, one file = one tool
4. **`CLAUDE.md` + Personas** — your agent's brain and identity, the most important files in any autonomous setup
5. **Ralph Wiggum** — `/ralph-loop`, persistent iteration until the work is done
6. **Hooks** — event-driven guardrails in `settings.json`
7. **The 5 Levels** — loop → identity → parallel → teams → pipeline
8. **Great Minds plugin** — full agent team, install and go

---

## RESOURCES TO SHARE

Drop these in the chat or on a closing slide:

- **Ralph Wiggum Plugin:** `/plugin install ralph-loop@claude-plugins-official` — https://awesomeclaude.ai/ralph-wiggum
- **Gary Sims — Ralph Demo (YouTube):** https://www.youtube.com/watch?v=A6vYr0dmQAY
- **Matt Pocock — Ralph Deep Dive (prd.json + feedback loops):** https://www.youtube.com/watch?v=_IK18goX4X8
- **Great Minds Plugin:** `npx plugins add sethshoultes/great-minds-plugin`
- **Addy Osmani — The Code Agent Orchestra:** https://addyosmani.com/blog/code-agent-orchestra/
- **Addy Osmani — How to Write a Good Spec for AI Agents:** https://addyo.substack.com/p/how-to-write-a-good-spec-for-ai-agents
- **Anthropic — Agent Skills:** https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- **awesome-claude-code:** https://github.com/hesreallyhim/awesome-claude-code
- **Exercises:** See `EXERCISES.md`

---

## TIMING

| Section | Time |
|---------|------|
| Slide 1 (hook) | 1 min |
| Slide 2 (/loop) | 2 min |
| Slide 3 (/schedule) | 1 min |
| Slide 4 (custom commands) | 2 min |
| Slide 5 (Ralph Wiggum) | 3 min |
| Slide 6 (hooks) | 2 min |
| Slide 7 (CLAUDE.md + personas) | 4 min |
| Slide 8 (5 levels) | 2 min |
| Slide 9 (Great Minds) | 3 min |
| Slide 10 (close) | 1 min |
| Hands-on | 15 min |
| **Total** | **~36 min** |

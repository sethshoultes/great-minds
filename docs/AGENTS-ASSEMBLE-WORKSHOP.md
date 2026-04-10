# Agents Assemble: Building Teams That Work While You Sleep

## Workshop Format
- 15 min talk (7 slides, you demo live)
- 15 min hands-on (attendees try 3-4 things)
- No SDK required — just Claude Code (CLI or desktop app)

---

## SLIDES

### Slide 1
```
Agents Assemble
Building Teams That Work While You Sleep
```

**Say:** "How many of you use Claude or ChatGPT for coding? Cool. Now how many of you close your laptop and it keeps working? Nobody? That's what we're fixing today."

---

### Slide 2: The Basics — Talk to Claude Code Like a Person
```
"Review my last 5 commits and tell me if I missed anything"

"Find all the TODOs in this project and prioritize them"

"Write tests for the checkout function"
```

**Say:** "Claude Code isn't just autocomplete. You can talk to it like a colleague. It reads your files, runs commands, writes code, commits to git. But the real magic is when you stop babysitting it."

---

### Slide 3: /loop — Set It and Forget It
```
/loop 5m check if the build passed and tell me the result

/loop 10m look for new GitHub issues and summarize them

/loop 2m run the tests and fix anything that fails
```

**Say:** "This is /loop. Give it a task and a timer. It runs on repeat until you stop it. I use this to monitor deploys, watch for new issues, even run QA in the background while I work on something else. One command, zero config."

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
```bash
while true; do
  claude -p "Read TODO.md. Pick one task. Build it. Test it. 
             Commit if tests pass. Mark it done." \
    --allowedTools "Read,Write,Edit,Bash" \
    --max-turns 30
  sleep 10
done
```

**Say:** "This is the Ralph Wiggum loop. It's a 10-line bash script. You write a TODO list, start the loop, go to bed. Each iteration Claude picks a task, builds it, tests it, and commits. I woke up to 262 files shipped. The key flags: -p runs it headless, --allowedTools controls what it can do, and --max-turns caps how long each iteration runs."

---

### Slide 6: Hooks — Automate the Boring Stuff
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

**Say:** "Hooks fire on events. After a commit? Remind me to test. After a file edit? Auto-format. Before a push? Run lint. You put this in settings.json and it just works. No plugins, no extensions."

---

### Slide 7: Great Minds — The Full Agent Team
```
PRD → Steve vs Elon Debate → Plan → Build → QA → Board Review → Ship

npx plugins add sethshoultes/great-minds-plugin
/agency-launch
```

**Say:** "We took all of this and built a plugin with 14 AI personas. Steve Jobs and Elon Musk debate your product strategy. Margaret Hamilton runs QA. A board of directors votes on whether to ship. You drop in a product spec, the team debates, plans, builds, tests, and ships it. We built an entire company this way — 7 plugins, 4 websites, a theme marketplace. All while we slept."

---

## HANDS-ON (15 min)

Tell attendees: "Open Claude Code. Try these. You have 15 minutes."

### Try 1: /loop (2 min)
```
/loop 2m tell me a fun fact about the current time
```
Then stop it with Ctrl+C. Now they know /loop works.

### Try 2: Custom Command (5 min)
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

### Try 3: Ralph Loop (5 min)
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
Check: `cat TODO.md` — one task should be checked off.

### Try 4: Install Great Minds (3 min)
```bash
npx plugins add sethshoultes/great-minds-plugin
/agency-debate "Should we build a mobile app or web app first?"
```
Watch Steve Jobs and Elon Musk argue about it.

---

## WHAT THEY WALK AWAY WITH

1. **`/loop`** — recurring tasks, zero config
2. **Custom commands** — `~/.claude/commands/name.md`, one file = one tool
3. **`claude -p`** — headless mode, the building block for automation
4. **Ralph loop** — `while true; do claude -p "..."; done` — build while you sleep
5. **Hooks** — event-driven automation in `settings.json`
6. **Great Minds plugin** — full agent team, install and go

---

## TIMING

| Section | Time |
|---------|------|
| Slides 1-2 (intro) | 3 min |
| Slide 3 (/loop) | 2 min |
| Slide 4 (commands) | 2 min |
| Slide 5 (Ralph) | 3 min |
| Slide 6 (hooks) | 2 min |
| Slide 7 (Great Minds) | 3 min |
| Hands-on | 15 min |
| **Total** | **~30 min** |

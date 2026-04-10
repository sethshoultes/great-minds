# PRD: Agents Assemble: Building Teams That Work While You Sleep
## Caseproof Retreat Workshop

## Goal
Create a hands-on workshop with slides, a speaking script, and 7 exercises people can run in Claude Code. This is for the Caseproof company retreat.

## CRITICAL: NO PLACEHOLDER CONTENT
Every file must have REAL, COMPLETE, USABLE content. No "coming soon", no TODO, no stub files. If QA finds placeholder content, it will BLOCK the build. The existing deliverables/agents-assemble-workshop/ has placeholder content — REPLACE it entirely.

## Deliverables

### 1. docs/AGENTS-ASSEMBLE-SLIDES.md
7 slides, minimal text, mostly commands on screen:

Slide 1: Title — "Agents Assemble: Building Teams That Work While You Sleep"
Slide 2: Headless Mode — `claude -p "prompt" --max-turns 10 --max-budget-usd 1.00`
Slide 3: Ralph Wiggum Loop — `while true; do claude -p "pick next task, build, test, commit"; done`
Slide 4: /loop, Commands, Hooks — one-liner examples of each
Slide 5: Multi-Agent Teams — two agents debating in parallel
Slide 6: Full Pipeline — `PRD → Debate → Plan → Build → QA → Board Review → Ship`
Slide 7: Your Turn — `npx plugins add sethshoultes/great-minds-plugin`

### 2. docs/AGENTS-ASSEMBLE-SCRIPT.md
What the presenter says at each slide. Conversational, not lecture-y. Include timing notes (e.g., "~2 min per slide"). Total talk time: 10-15 minutes.

### 3. docs/AGENTS-ASSEMBLE-EXERCISES.md
7 hands-on exercises, each 5-10 minutes, all copy-paste:

Exercise 1: Headless Mode (`claude -p`) — run a commit, pipe input for review, cap budget
Exercise 2: Ralph Wiggum Loop — 10-line bash script that builds while you sleep
Exercise 3: /loop — recurring monitoring task
Exercise 4: Custom Slash Commands — create ~/.claude/commands/standup.md
Exercise 5: Hooks — PostToolUse hook that reminds after commits
Exercise 6: Agent Personas — two agents debating in parallel
Exercise 7: Great Minds Plugin — install and run /agency-launch

Each exercise must include:
- Exact commands to copy/paste
- Expected output (what they should see)
- "What you learned" summary

## Success Criteria
- All 3 files exist with complete content
- Zero placeholder text (grep for "placeholder|coming soon|TODO|TBD" must return 0)
- Every command in the exercises is real and would work in Claude Code
- Speaking script covers all 7 slides with timing
- A developer can complete all 7 exercises in 30 minutes

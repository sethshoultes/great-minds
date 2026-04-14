# Agents Assemble — Hands-On Exercises

**Total Time**: 30-45 minutes
**Prerequisites**: Claude Code CLI installed, ANTHROPIC_API_KEY set
**Platform**: macOS, Linux, Windows (with PowerShell or Git Bash)

---

## Pre-Flight Check

Before starting, verify your setup:

```bash
# Test Claude Code is working
claude -p "Say 'Ready to assemble!'" --max-budget-usd 0.10
```

**Expected Output**: Claude responds with "Ready to assemble!" or similar.

If this fails, jump to [Troubleshooting](#troubleshooting) at the end.

---

## Exercise 1: Headless Mode — Your First Autonomous Action

**Time**: 5-7 minutes
**Goal**: Run Claude without interaction and see it complete a task autonomously.

### Step 1: Create a Test File

First, let's create a simple file for Claude to work with:

```bash
echo "Hello World" > hello.txt
```

### Step 2: Basic Headless Command

Run Claude in headless (print) mode:

```bash
claude -p "Read hello.txt and add today's date to the end of the file" --max-turns 3
```

**What's happening**: Claude reads the file, modifies it, and exits — all without any interaction from you.

### Step 3: Add Budget Control

Run with a spending cap:

```bash
claude -p "Add a second line to hello.txt that says 'Modified by Claude'" \
  --max-turns 3 \
  --max-budget-usd 0.50
```

**What's happening**: The `--max-budget-usd` flag caps how much this command can spend. Essential for unattended execution.

### Step 4: Verify the Result

```bash
cat hello.txt
```

### Expected Output

```
Hello World
2026-04-09
Modified by Claude
```

(Your date will differ)

### Step 5: Piped Input

You can also pipe content into Claude:

```bash
echo "function add(a, b) { return a + b }" | claude -p "Review this code for bugs"
```

**Expected Output**: Claude analyzes the function and reports its findings.

### What You Learned

- `-p` (print mode) runs Claude without interaction
- `--max-turns` limits how many tool calls Claude can make
- `--max-budget-usd` caps spending for safety
- Piping works — Claude can receive input from other commands

---

## Exercise 2: The Ralph Wiggum Loop — Build While You Sleep

**Time**: 5-7 minutes
**Goal**: Create an autonomous build loop that processes tasks from a TODO file.

### Step 1: Create a TODO File

```bash
cat > TODO.md << 'EOF'
# Tasks

- [ ] Add a greeting function to hello.txt
- [ ] Create a goodbye.txt file with a farewell message
- [ ] Add timestamps to both files
EOF
```

### Step 2: The 10-Line Ralph Loop

Create the loop script:

```bash
cat > ralph-loop.sh << 'EOF'
#!/bin/bash
# Ralph Wiggum Loop - "I'm helping!"
# Safety: Limited iterations for demo

MAX_ITERATIONS=2  # Safety limit - increase for production
ITERATION=0

while [ $ITERATION -lt $MAX_ITERATIONS ]; do
  echo "=== Ralph Iteration $((ITERATION + 1)) ==="

  claude -p "Read TODO.md. Find ONE unchecked task (marked with '- [ ]'). \
    Do that task. Mark it as done (change to '- [x]'). \
    Report what you did." \
    --max-turns 10 \
    --max-budget-usd 1.00

  echo "=== Sleeping 30 seconds (be nice to the API) ==="
  sleep 30

  ITERATION=$((ITERATION + 1))
done

echo "Ralph is done for now!"
EOF

chmod +x ralph-loop.sh
```

### Step 3: Run It (Safely)

```bash
./ralph-loop.sh
```

**What's happening**: Ralph picks a task, does it, marks it complete, waits, and repeats.

### Step 4: Check the Results

```bash
cat TODO.md
ls -la
```

### Expected Output

```
# Tasks

- [x] Add a greeting function to hello.txt
- [x] Create a goodbye.txt file with a farewell message
- [ ] Add timestamps to both files

(Plus new files created by Claude)
```

### Windows PowerShell Alternative

```powershell
# Ralph Wiggum Loop - PowerShell version
$maxIterations = 2
$iteration = 0

while ($iteration -lt $maxIterations) {
    Write-Host "=== Ralph Iteration $($iteration + 1) ==="

    claude -p "Read TODO.md. Find ONE unchecked task. Do it. Mark it done." `
        --max-turns 10 `
        --max-budget-usd 1.00

    Write-Host "=== Sleeping 30 seconds ==="
    Start-Sleep -Seconds 30

    $iteration++
}

Write-Host "Ralph is done for now!"
```

### What You Learned

- Simple loops + AI = autonomous workers
- `sleep` delays prevent rate limiting and runaway costs
- Safety limits (MAX_ITERATIONS, budget caps) are critical
- This is how you "build while you sleep"

---

## Exercise 3: The /loop Command — Scheduled Tasks Made Easy

**Time**: 5 minutes
**Goal**: Use Claude Code's built-in scheduling for recurring prompts.

### Step 1: Start an Interactive Session

```bash
claude
```

### Step 2: Schedule a Recurring Task

Inside the Claude Code session, type:

```
/loop 2m check if any files have been modified in the last 5 minutes
```

**What's happening**: Claude will check every 2 minutes and report file changes.

### Step 3: Check Your Scheduled Tasks

```
/tasks
```

Or just ask:

```
What scheduled tasks do I have running?
```

### Step 4: Cancel the Task

```
Cancel the file check task
```

### Expected Output

When you run `/loop`:
```
Scheduled: "check if any files have been modified" every 2 minutes
Next run: [timestamp]
```

When you run `/tasks`:
```
Active scheduled tasks:
1. "check if any files have been modified" - every 2m - next: [timestamp]
```

### What You Learned

- `/loop` schedules recurring prompts within your session
- Tasks are session-scoped (disappear when you exit)
- Natural language intervals work: "every 5 minutes", "2h", "1d"
- Different from Ralph Loop: `/loop` is built-in, Ralph is your custom script

---

## Exercise 4: Custom Slash Commands — Extend Your Agent

**Time**: 5-7 minutes
**Goal**: Create a reusable `/standup` command for daily standups.

### Step 1: Create the Skills Directory

```bash
mkdir -p ~/.claude/skills/standup
```

### Step 2: Create the SKILL.md File

```bash
cat > ~/.claude/skills/standup/SKILL.md << 'EOF'
---
name: standup
description: Generate a daily standup report from recent git activity
---

# Daily Standup Generator

Generate a standup report with these sections:

## What I Did Yesterday
Look at git commits from the last 24 hours:
```bash
git log --oneline --since="24 hours ago"
```

## What I'm Doing Today
Look for open TODO items:
```bash
grep -r "TODO\|- \[ \]" . --include="*.md" 2>/dev/null | head -5
```

## Blockers
Check for failing tests or unresolved conflicts:
```bash
git status --short
```

Format the output as a clean markdown list.
If there are no commits, say "No commits in the last 24 hours."
EOF
```

### Step 3: Test Your Command

Start a new Claude Code session:

```bash
claude
```

Then run your custom command:

```
/standup
```

### Expected Output

```markdown
## What I Did Yesterday
- abc1234 Added greeting function
- def5678 Created goodbye.txt

## What I'm Doing Today
- Add timestamps to both files
- Review code quality

## Blockers
- None detected
```

### Windows Path Note

On Windows, the skills directory is:
```
%USERPROFILE%\.claude\skills\standup\SKILL.md
```

Or in PowerShell:
```powershell
mkdir ~\.claude\skills\standup -Force
# Then create SKILL.md there
```

### What You Learned

- Skills live in `~/.claude/skills/<name>/SKILL.md`
- The SKILL.md file defines what the command does
- Claude auto-discovers skills — no registration needed
- You can distribute skills to your team via git

---

## Exercise 5: Hooks — Automate Your Workflow

**Time**: 5-7 minutes
**Goal**: Create a hook that fires after every git commit.

### Step 1: Create Project Settings Directory

```bash
mkdir -p .claude
```

### Step 2: Create the Hooks Configuration

```bash
cat > .claude/settings.json << 'EOF'
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | grep -q 'git commit'; then echo '>>> Commit complete! Remember to push. <<<' >&2; fi"
          }
        ]
      }
    ]
  }
}
EOF
```

### Step 3: Test the Hook

Start a Claude Code session in this directory:

```bash
claude
```

Then ask Claude to make a commit:

```
Create a test file and commit it with the message "Test commit for hooks exercise"
```

### Expected Output

After the commit completes, you should see:

```
>>> Commit complete! Remember to push. <<<
```

### Step 4: More Hook Ideas

**Auto-format on edit:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

**Desktop notification (macOS):**
```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude needs attention\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

### What You Learned

- Hooks fire on events: PreToolUse, PostToolUse, Notification, etc.
- Project hooks go in `.claude/settings.json`
- Global hooks go in `~/.claude/settings.json`
- Hooks can block, modify, or extend behavior

---

## Exercise 6: Multi-Agent Debate — The Climax

**Time**: 7 minutes
**Goal**: Run two agents with different perspectives in parallel, then synthesize their debate.

### Step 1: Create the Debate Topic

```bash
cat > debate-topic.md << 'EOF'
# Topic: Should we rewrite the authentication module in Rust?

## Current State
- Python auth module with 500 lines of code
- 3 security vulnerabilities reported in the past year
- Performance is "acceptable" but not great
- Team has no Rust experience

## Constraints
- 2-month deadline for the next release
- Budget for 1 senior developer

## Question
Should we rewrite the auth module in Rust, or improve the existing Python code?
EOF
```

### Step 2: Run Parallel Agents

```bash
# Agent 1: Steve Jobs perspective (user experience, simplicity)
claude -p "You are Steve Jobs. Read debate-topic.md. \
  Argue from a user experience and product simplicity perspective. \
  Be direct, opinionated, and focus on what matters to users. \
  Write your argument (200 words max) to steve-opinion.md" \
  --max-turns 5 --max-budget-usd 0.50 &
PID1=$!

# Agent 2: Elon Musk perspective (engineering, first principles)
claude -p "You are Elon Musk. Read debate-topic.md. \
  Argue from a first-principles engineering perspective. \
  Be bold, question assumptions, focus on long-term technical excellence. \
  Write your argument (200 words max) to elon-opinion.md" \
  --max-turns 5 --max-budget-usd 0.50 &
PID2=$!

# Wait for both to complete
echo "Waiting for agents to complete..."
wait $PID1 $PID2
echo "Both agents finished!"
```

### Step 3: Error Recovery (If Needed)

```bash
# Check if both files were created
if [ ! -f steve-opinion.md ]; then
  echo "Steve's agent failed - retrying..."
  claude -p "You are Steve Jobs. Read debate-topic.md. Write to steve-opinion.md" \
    --max-turns 5 --max-budget-usd 0.50
fi

if [ ! -f elon-opinion.md ]; then
  echo "Elon's agent failed - retrying..."
  claude -p "You are Elon Musk. Read debate-topic.md. Write to elon-opinion.md" \
    --max-turns 5 --max-budget-usd 0.50
fi
```

### Step 4: Synthesize the Debate

```bash
claude -p "Read steve-opinion.md and elon-opinion.md. \
  Synthesize both perspectives into a final recommendation. \
  Consider: timeline, team skills, security, user impact. \
  Write a clear recommendation (150 words max) to recommendation.md" \
  --max-turns 5 --max-budget-usd 0.50
```

### Step 5: Read the Results

```bash
echo "=== STEVE JOBS ==="
cat steve-opinion.md

echo ""
echo "=== ELON MUSK ==="
cat elon-opinion.md

echo ""
echo "=== FINAL RECOMMENDATION ==="
cat recommendation.md
```

### Expected Output

**steve-opinion.md:**
```markdown
The user doesn't care what language the auth module is written in.
They care that login is fast, secure, and doesn't break.

Rewriting in Rust introduces risk. New language = new bugs.
Your team has no Rust experience = slower development.
2-month deadline = no time for learning curves.

The 3 security vulnerabilities? Fix them in Python. Today.
Performance is "acceptable"? Users aren't complaining.

Ship the fix. Ship it now. Don't rewrite what works.
```

**elon-opinion.md:**
```markdown
First principles: What is the actual problem?

Security vulnerabilities exist because Python makes certain classes
of bugs possible. Rust's memory safety eliminates these by design.

Yes, the team lacks Rust experience. But:
- Rust has excellent learning resources
- One senior dev can learn Rust basics in 2 weeks
- The rewrite forces us to understand the auth system deeply

"Acceptable" performance is settling. Rust auth would be 10x faster.

The question isn't "can we ship in 2 months with Python?"
The question is "do we want to fix the same bugs forever?"

Invest now. Rewrite in Rust. Build the foundation right.
```

**recommendation.md:**
```markdown
## Recommendation: Fix Python Now, Plan Rust Later

Both perspectives have merit. Here's the path forward:

1. **Immediate (Week 1-2):** Fix the 3 security vulnerabilities in Python.
   Ship the fixes. Users are protected.

2. **Short-term (Month 1-2):** Audit the full auth module. Document
   all security-sensitive code paths.

3. **Medium-term (Post-release):** Begin Rust spike with the senior dev.
   Prototype the most critical auth function. Measure performance.

4. **Decision point (Month 3):** If Rust spike succeeds, plan full rewrite
   for next major release. If not, continue hardening Python.

This approach ships security fixes immediately while gathering data
for the larger architectural decision.
```

### What You Learned

- Multiple agents can work in parallel (`&` backgrounds the process)
- Different personas produce different insights
- Error recovery is essential for production use
- Synthesis agents can resolve debates and make recommendations
- This is how agent teams make decisions

---

## Exercise 7: Great Minds Plugin — Your Agent Team Awaits

**Time**: 5-10 minutes
**Goal**: Experience a full agent agency with the Great Minds Plugin.

### Primary Path: Plugin Installation

```bash
# Install the Great Minds Plugin
npx @anthropic-ai/claude-code-mcp add sethshoultes/great-minds-plugin@1.0.0
```

Then start Claude Code:

```bash
claude
```

And launch the agency:

```
/agency-launch
```

Or trigger a specific workflow:

```
/agency-debate "Should we add a dark mode to the app?"
```

### Expected Output (Plugin)

```
Great Minds Agency initialized.
14 agents standing by:
- Steve Jobs (Creative Director)
- Elon Musk (Technical Director)
- Phil Jackson (Facilitator)
...

Ready for input. Try:
- /agency-debate <topic>
- /agency-plan <feature>
- /agency-review <file>
```

---

### Fallback Path: Build Your Own Mini-Agency

If the plugin installation fails, create a local version:

#### Step 1: Create Agent Persona Files

```bash
mkdir -p agents

cat > agents/designer.md << 'EOF'
# Designer Persona

You are a UX Designer with 15 years of experience.

## Your Focus
- User experience above all else
- Simplicity and clarity
- Visual hierarchy and flow
- Accessibility

## Your Questions
- "Will users understand this immediately?"
- "What's the simplest version that works?"
- "Have we tested this with real users?"

## Your Style
- Direct but empathetic
- User-focused arguments
- Sketches and wireframes when helpful
EOF

cat > agents/engineer.md << 'EOF'
# Engineer Persona

You are a Senior Software Engineer with 20 years of experience.

## Your Focus
- Architecture and scalability
- Performance and reliability
- Maintainability and testing
- Security

## Your Questions
- "Will this scale to 10x users?"
- "What happens when this fails?"
- "How do we test this?"

## Your Style
- Technical and precise
- First-principles reasoning
- Code examples when helpful
EOF

cat > agents/pm.md << 'EOF'
# Product Manager Persona

You are a Product Manager who ships.

## Your Focus
- User value and business impact
- Timeline and resources
- Trade-offs and priorities
- Stakeholder alignment

## Your Questions
- "What problem are we solving?"
- "Who is this for?"
- "What's the MVP?"

## Your Style
- Outcome-focused
- Clear on constraints
- Drives decisions
EOF
```

#### Step 2: Run Your Mini-Agency

```bash
# Designer reviews the homepage
claude -p "Read agents/designer.md. Adopt this persona. \
  Review the file structure in this directory and suggest UX improvements." \
  --max-turns 5 --max-budget-usd 0.50 &

# Engineer reviews the architecture
claude -p "Read agents/engineer.md. Adopt this persona. \
  Review the file structure and suggest architectural improvements." \
  --max-turns 5 --max-budget-usd 0.50 &

wait
echo "Mini-agency review complete!"
```

#### Step 3: Synthesize Feedback

```bash
claude -p "Read agents/pm.md. Adopt this persona. \
  You've received feedback from the designer and engineer. \
  List the top 3 priorities we should tackle first."
```

### Expected Output (Fallback)

```
## Designer Feedback
- File organization is confusing for new users
- Consider adding a README.md with quick start
- The naming convention is inconsistent

## Engineer Feedback
- No test files detected
- Consider adding CI/CD configuration
- The script permissions may cause issues on different systems

## PM Prioritization
1. Add README.md (unblocks new contributors)
2. Add basic tests (prevents regressions)
3. Standardize naming (reduces confusion)
```

### What You Learned

- Plugins extend Claude Code with pre-built capabilities
- You can build your own agency with persona files
- The Great Minds Plugin demonstrates a full 14-agent system
- Persona files are just markdown — easy to create and share

---

## Closing

**You are now dangerous.**

You know how to:
- Run Claude autonomously with headless mode
- Build loops that work while you sleep
- Schedule recurring tasks with /loop
- Create custom commands with skills
- Automate workflows with hooks
- Run parallel agents with different perspectives
- Synthesize debates into decisions

The building blocks are yours. Now go build something.

---

## Quick Reference

| Concept | Command/Location |
|---------|------------------|
| Headless mode | `claude -p "prompt"` |
| Limit turns | `--max-turns 10` |
| Budget cap | `--max-budget-usd 1.00` |
| Tool allowlist | `--allowedTools "Bash,Read"` |
| Scheduled task | `/loop 5m check build` |
| Custom skill | `~/.claude/skills/<name>/SKILL.md` |
| Project hooks | `.claude/settings.json` |
| Global hooks | `~/.claude/settings.json` |

---

## Troubleshooting

### Getting Started Issues

#### "Command not found: claude"

Claude Code CLI is not installed or not in your PATH.

**macOS (Homebrew):**
```bash
brew install anthropic/claude/claude-code
```

**Windows:**
Download from https://code.claude.com and add to PATH.

**Linux:**
Download from https://code.claude.com:
```bash
export PATH="$PATH:/path/to/claude/bin"
```

**Verify:**
```bash
claude --version
```

---

### API Key Issues

#### "API key not found" or "Invalid API key"

**macOS/Linux — Set temporarily:**
```bash
export ANTHROPIC_API_KEY="sk-ant-v1-your-key-here"
```

**macOS/Linux — Set permanently:**
```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-v1-your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

**Windows PowerShell — Set temporarily:**
```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-v1-your-key-here"
```

**Windows PowerShell — Set permanently:**
```powershell
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-v1-your-key-here", "User")
```

**Verify:**
```bash
echo $ANTHROPIC_API_KEY
```

Get your key at: https://console.anthropic.com/

---

### Windows-Specific Issues

#### Path Differences

| Platform | Path |
|----------|------|
| macOS/Linux | `~/.claude/skills/` |
| Windows | `%USERPROFILE%\.claude\skills\` |
| PowerShell | `~\.claude\skills\` |

#### Shell Commands

**Bash loop (macOS/Linux):**
```bash
while true; do claude -p "task"; sleep 30; done
```

**PowerShell equivalent:**
```powershell
while ($true) { claude -p "task"; Start-Sleep -Seconds 30 }
```

#### Line Endings (CRLF vs LF)

If scripts fail with weird errors:
```bash
git config --global core.autocrlf input
```

---

### Rate Limits

#### "Rate limit exceeded"

You're making requests too fast. Wait 2 minutes, then:

1. Add `sleep 30` between requests in loops
2. Reduce `--max-turns` to limit tool calls
3. Check your plan at https://console.anthropic.com/

---

### Budget Issues

#### "Budget limit exceeded"

Increase the budget:
```bash
claude -p "task" --max-budget-usd 2.00
```

Check your balance at https://console.anthropic.com/

---

### Hook Issues

#### "Hook isn't triggering"

1. Validate JSON syntax:
   ```bash
   cat .claude/settings.json | python3 -m json.tool
   ```

2. Restart Claude Code (close and reopen)

3. Check matcher matches exactly (case-sensitive)

---

### Plugin Issues

#### "Plugin won't install"

1. Check npm: `npm --version`
2. Install Node.js if missing: https://nodejs.org/
3. Use the fallback in Exercise 7 instead

---

### Still Stuck?

1. Test basic setup:
   ```bash
   claude -p "Say hello" --max-budget-usd 0.10
   ```

2. Check requirements:
   - Claude Code CLI: `claude --version`
   - API key: `echo $ANTHROPIC_API_KEY`
   - Node.js (for plugin): `node --version`

3. Get help:
   - Claude Code docs: https://code.claude.com
   - Ask the workshop facilitator

---

## Resources

- **Claude Code Documentation**: https://code.claude.com
- **Anthropic Console**: https://console.anthropic.com
- **Great Minds Plugin**: github.com/sethshoultes/great-minds-plugin
- **Workshop Source**: github.com/sethshoultes/great-minds

---

*Workshop created by Great Minds Agency*
*"You will leave this room dangerous."*

# Phase 1 Plan — Agents Assemble Workshop

**Generated**: 2024-04-09
**Requirements**: `.planning/REQUIREMENTS.md` + `rounds/agents-assemble-workshop/decisions.md`
**Total Tasks**: 14
**Waves**: 4
**Timeline**: 6-8 hours focused session
**Project Slug**: `agents-assemble-workshop`

---

## Executive Summary

Agents Assemble is a hands-on workshop teaching developers how to build autonomous AI agent teams using Claude Code. This plan implements the 3 deliverable files (slides, script, exercises) with 7 exercises covering headless mode, loops, commands, hooks, and multi-agent orchestration.

**Core Essence** (from decisions.md):
> "Teaching developers to build tireless workers that ship code while they sleep."

**The One Thing That Must Be Perfect**:
> "The first 30 seconds. Paste. Watch it work. Jaw drops."

**Emotional Hook** (from Decision 8):
> "You will leave this room dangerous."

---

## Requirements Traceability

| Requirement | Task(s) | Wave |
|-------------|---------|------|
| REQ-001: Slides markdown file | phase-1-task-1 | 2 |
| REQ-002: Script markdown file | phase-1-task-2 | 2 |
| REQ-003: Exercises markdown file | phase-1-task-3 to phase-1-task-9 | 2, 3 |
| REQ-004-010: Slide content (7 slides) | phase-1-task-1 | 2 |
| REQ-011-017: Exercise content (7 exercises) | phase-1-task-3 to phase-1-task-9 | 2, 3 |
| REQ-018-024: Script requirements | phase-1-task-2 | 2 |
| REQ-025: Zero placeholder content | phase-1-task-12 | 4 |
| REQ-026: All commands functional | phase-1-task-10 | 1 |
| REQ-029: Expected output samples | phase-1-task-3 to phase-1-task-9 | 2, 3 |
| REQ-030: Windows compatibility | phase-1-task-11 | 3 |
| REQ-032-037: Testing requirements | phase-1-task-12, phase-1-task-13 | 4 |
| REQ-038: Three markdown files structure | phase-1-task-1, phase-1-task-2 | 2 |

---

## Wave Execution Order

### Wave 1 (Parallel — Foundation & Verification)

These tasks validate the technical foundation before content creation. They ensure all commands are real and functional.

```xml
<task-plan id="phase-1-task-10" wave="1">
  <title>Verify All Claude Code CLI Commands</title>
  <requirement>REQ-026: All commands real and functional (HARD BLOCKER)</requirement>
  <description>Test and verify every Claude Code command that will appear in slides and exercises. Document exact syntax with verified output. This prevents hallucinated commands from reaching the workshop.</description>

  <context>
    <file path=".planning/REQUIREMENTS.md" reason="Verified Claude Code CLI Syntax section" />
    <file path="CLAUDE.md" reason="Anti-hallucination rules - verify before claiming success" />
  </context>

  <steps>
    <step order="1">Verify headless mode command syntax:
      - Test: `claude -p "echo hello world" --max-turns 1`
      - Verify: `-p` flag works for non-interactive mode
      - Verify: `--max-turns` flag exists and accepts integers
      - Document actual output</step>
    <step order="2">Verify budget control flag:
      - Test: `claude -p "echo test" --max-budget-usd 0.10`
      - Verify: `--max-budget-usd` flag exists
      - Document behavior when budget exceeded</step>
    <step order="3">Verify tool allowlist:
      - Test: `claude -p "list files" --allowedTools "Bash,Read"`
      - Verify: `--allowedTools` flag syntax
      - Document expected behavior</step>
    <step order="4">Verify /loop command exists:
      - Start Claude Code session
      - Test: `/loop 1m echo 'test'`
      - Verify: command is recognized
      - Document actual syntax</step>
    <step order="5">Verify custom commands path:
      - Confirm: `~/.claude/skills/` directory structure
      - Test: creating a skill and invoking it
      - Document exact file format required</step>
    <step order="6">Verify hooks configuration:
      - Confirm: settings.json location
      - Test: PostToolUse hook configuration
      - Document exact JSON schema</step>
    <step order="7">Create CLI-VERIFIED.md with all verified syntax</step>
  </steps>

  <verification>
    <check type="bash">test -f .planning/CLI-VERIFIED.md &amp;&amp; echo "VERIFICATION DOC EXISTS"</check>
    <check type="bash">grep -q "claude -p" .planning/CLI-VERIFIED.md &amp;&amp; echo "HEADLESS VERIFIED"</check>
    <check type="bash">grep -q "/loop" .planning/CLI-VERIFIED.md &amp;&amp; echo "LOOP VERIFIED"</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies - foundation task -->
  </dependencies>

  <commit-message>docs(planning): verify all Claude Code CLI commands for workshop</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-11" wave="1">
  <title>Create FAQ/Troubleshooting Section</title>
  <requirement>REQ-030: Windows compatibility documented; REQ-037: API key failure handling</requirement>
  <description>Create troubleshooting documentation for common issues including Windows path differences, API key setup, and command failures.</description>

  <context>
    <file path="rounds/agents-assemble-workshop/decisions.md" reason="Risk Register: Windows path issues" />
    <file path=".planning/REQUIREMENTS.md" reason="REQ-030, REQ-037 requirements" />
  </context>

  <steps>
    <step order="1">Document Windows-specific issues:
      - Path differences: `~/.claude/` vs `%USERPROFILE%\.claude\`
      - Shell requirements: bash via WSL, Git Bash, or PowerShell alternatives
      - Line ending differences (CRLF vs LF)</step>
    <step order="2">Document API key setup:
      - How to set ANTHROPIC_API_KEY
      - Common error messages and fixes
      - Rate limit behavior and recovery</step>
    <step order="3">Document common command failures:
      - "Command not found" for claude
      - Permission errors on macOS
      - Node.js/npm requirements for plugin install</step>
    <step order="4">Create PowerShell alternatives for bash scripts:
      - Ralph Wiggum Loop PowerShell version
      - File creation commands for Windows</step>
    <step order="5">Add troubleshooting to exercises file structure</step>
  </steps>

  <verification>
    <check type="bash">grep -q "Windows\|PowerShell" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "WINDOWS DOCS PASS"</check>
    <check type="bash">grep -q "ANTHROPIC_API_KEY\|API.*key" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "API KEY DOCS PASS"</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies - documentation task -->
  </dependencies>

  <commit-message>docs(workshop): add FAQ and troubleshooting for Windows and API issues</commit-message>
</task-plan>
```

---

### Wave 2 (Parallel — Core Content Creation)

These tasks create the three main deliverable files with exercises 1-5.

```xml
<task-plan id="phase-1-task-1" wave="2">
  <title>Create AGENTS-ASSEMBLE-SLIDES.md</title>
  <requirement>REQ-001: Slides file; REQ-004-010: 7 slides with commands</requirement>
  <description>Create the slides markdown file with 7 slides. Minimal text, mostly commands on screen. Each slide maps to a key concept from the workshop.</description>

  <context>
    <file path="prds/agents-assemble-workshop.md" reason="Slide specifications 1-7" />
    <file path="rounds/agents-assemble-workshop/decisions.md" reason="Voice/brand decisions, naming" />
    <file path=".planning/CLI-VERIFIED.md" reason="Verified command syntax" />
  </context>

  <steps>
    <step order="1">Create docs/ directory if not exists</step>
    <step order="2">Create Slide 1 - Title:
      # Agents Assemble
      ## Building Teams That Work While You Sleep
      (No commands - title only)</step>
    <step order="3">Create Slide 2 - Headless Mode:
      ```bash
      claude -p "Fix the bug in auth.py" --max-turns 10 --max-budget-usd 1.00
      ```
      (Show the power of non-interactive execution)</step>
    <step order="4">Create Slide 3 - Ralph Wiggum Loop:
      ```bash
      while true; do
        claude -p "Pick next task from TODO.md, implement it, test, commit"
        sleep 60
      done
      ```
      (Build while you sleep)</step>
    <step order="5">Create Slide 4 - /loop, Commands, Hooks:
      ```bash
      /loop 5m check build status
      /standup
      # hooks in settings.json
      ```
      (One-liner examples of each)</step>
    <step order="6">Create Slide 5 - Multi-Agent Teams:
      ```bash
      # Two agents debating in parallel
      claude -p "As Steve Jobs, critique this design..." &amp;
      claude -p "As Elon Musk, evaluate feasibility..." &amp;
      wait
      ```
      (Show parallel agent orchestration)</step>
    <step order="7">Create Slide 6 - Full Pipeline:
      ```
      PRD → Debate → Plan → Build → QA → Board Review → Ship
      ```
      (Aspirational vision, not required execution)</step>
    <step order="8">Create Slide 7 - Your Turn:
      ```bash
      npx @anthropic-ai/claude-code-mcp add sethshoultes/great-minds-plugin
      ```
      (Let them type - end in silence)</step>
  </steps>

  <verification>
    <check type="bash">test -f docs/AGENTS-ASSEMBLE-SLIDES.md &amp;&amp; echo "SLIDES FILE EXISTS"</check>
    <check type="bash">grep -c "^## Slide" docs/AGENTS-ASSEMBLE-SLIDES.md | awk '{print ($1 == 7 ? "7 SLIDES PASS" : "SLIDE COUNT FAIL: " $1)}'</check>
    <check type="bash">grep -q "claude -p" docs/AGENTS-ASSEMBLE-SLIDES.md &amp;&amp; echo "HEADLESS COMMAND PASS"</check>
    <check type="bash">grep -q "while true" docs/AGENTS-ASSEMBLE-SLIDES.md &amp;&amp; echo "RALPH LOOP PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-10" reason="Commands must be verified first" />
  </dependencies>

  <commit-message>docs(workshop): create 7-slide deck for Agents Assemble workshop</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-2" wave="2">
  <title>Create AGENTS-ASSEMBLE-SCRIPT.md</title>
  <requirement>REQ-002: Script file; REQ-018-024: Script content requirements</requirement>
  <description>Create the presenter script with conversational notes for each slide. Include timing notes (~2 min per slide). Total talk time: 10-15 minutes.</description>

  <context>
    <file path="prds/agents-assemble-workshop.md" reason="Script requirements" />
    <file path="rounds/agents-assemble-workshop/decisions.md" reason="Decision 6 (voice), Decision 7 (no theory first), Decision 8 (dangerous), Decision 12 (end in silence)" />
    <file path="docs/AGENTS-ASSEMBLE-SLIDES.md" reason="Slides to write notes for" />
  </context>

  <steps>
    <step order="1">Create script header with timing overview:
      - Total: 10-15 minutes
      - Per slide: ~1.5-2 minutes
      - Exercise time: 30-45 minutes total (separate)</step>
    <step order="2">Write Slide 1 script (~1 min):
      - Opening hook: "You will leave this room dangerous"
      - No theory - jump straight to demo
      - Voice: casual expertise, senior engineer energy</step>
    <step order="3">Write Slide 2 script (~2 min):
      - Explain headless mode
      - The "jaw drop" moment - paste, watch it work
      - Mention budget control for safety</step>
    <step order="4">Write Slide 3 script (~2 min):
      - Ralph Wiggum Loop concept
      - "Build while you sleep"
      - Safety: sleep delays, budget caps</step>
    <step order="5">Write Slide 4 script (~2 min):
      - Quick tour of /loop, commands, hooks
      - Point to exercises for hands-on
      - Keep it brief - exercises will teach</step>
    <step order="6">Write Slide 5 script (~2 min):
      - Multi-agent teams concept
      - Different perspectives working in parallel
      - This is the climax - build excitement</step>
    <step order="7">Write Slide 6 script (~1.5 min):
      - Full pipeline vision
      - "This is where it's going"
      - Aspirational, not required</step>
    <step order="8">Write Slide 7 script (~1.5 min):
      - "Your turn"
      - Plugin installation command
      - End: "Now... go build something." [silence - let them type]</step>
    <step order="9">Review for forbidden phrases:
      - Remove: "leverage", "utilize", "empower your workflow"
      - Keep: "build while you sleep", "ship it", "your turn"</step>
  </steps>

  <verification>
    <check type="bash">test -f docs/AGENTS-ASSEMBLE-SCRIPT.md &amp;&amp; echo "SCRIPT FILE EXISTS"</check>
    <check type="bash">grep -c "~.*min\|minutes" docs/AGENTS-ASSEMBLE-SCRIPT.md | awk '{print ($1 >= 7 ? "TIMING NOTES PASS" : "TIMING NOTES FAIL")}'</check>
    <check type="bash">grep -q "dangerous" docs/AGENTS-ASSEMBLE-SCRIPT.md &amp;&amp; echo "EMOTIONAL HOOK PASS"</check>
    <check type="bash">grep -qiE "leverage|utilize|empower your workflow" docs/AGENTS-ASSEMBLE-SCRIPT.md &amp;&amp; echo "FAIL: CORPORATE JARGON FOUND" || echo "NO JARGON PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Slides must exist to write script" />
  </dependencies>

  <commit-message>docs(workshop): create presenter script with timing notes and casual voice</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-3" wave="2">
  <title>Create Exercise 1: Headless Mode</title>
  <requirement>REQ-011: Exercise 1 with headless mode, budget cap, expected output</requirement>
  <description>Write Exercise 1 teaching headless mode using `claude -p`. This is the "jaw drop" moment - first autonomous action.</description>

  <context>
    <file path="prds/agents-assemble-workshop.md" reason="Exercise 1 specification" />
    <file path="rounds/agents-assemble-workshop/decisions.md" reason="Decision 7: jaw drop moment" />
    <file path=".planning/CLI-VERIFIED.md" reason="Verified command syntax" />
  </context>

  <steps>
    <step order="1">Create docs/AGENTS-ASSEMBLE-EXERCISES.md with header</step>
    <step order="2">Write Exercise 1 introduction:
      - Title: "Exercise 1: Headless Mode — Your First Autonomous Commit"
      - Estimated time: 5-7 minutes
      - Goal: Run Claude without interaction</step>
    <step order="3">Write Step 1 - Basic headless command:
      ```bash
      claude -p "Create a file called hello.txt with the text 'Hello from Claude'"
      ```
      - Expected output: file creation confirmation</step>
    <step order="4">Write Step 2 - With budget control:
      ```bash
      claude -p "Add a timestamp to hello.txt" --max-turns 3 --max-budget-usd 0.50
      ```
      - Expected output: modification confirmation</step>
    <step order="5">Write Step 3 - Piped input:
      ```bash
      cat code.py | claude -p "Review this code for bugs"
      ```
      - Expected output: code review</step>
    <step order="6">Write "Expected Output" section with sample</step>
    <step order="7">Write "What You Learned" summary:
      - Headless mode runs without interaction
      - Budget caps prevent runaway costs
      - Piping enables integration with other tools</step>
  </steps>

  <verification>
    <check type="bash">grep -q "Exercise 1" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "EXERCISE 1 EXISTS"</check>
    <check type="bash">grep -q "claude -p" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "HEADLESS COMMAND PASS"</check>
    <check type="bash">grep -q "Expected Output\|Expected Result" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "EXPECTED OUTPUT PASS"</check>
    <check type="bash">grep -q "What You Learned\|What you learned" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "LEARNING SUMMARY PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-10" reason="Commands must be verified first" />
  </dependencies>

  <commit-message>docs(workshop): add Exercise 1 - Headless Mode with expected output</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-4" wave="2">
  <title>Create Exercise 2: Ralph Wiggum Loop</title>
  <requirement>REQ-012: 10-line bash script for build-while-you-sleep</requirement>
  <description>Write Exercise 2 with the Ralph Wiggum Loop - an infinite loop that picks tasks and executes them autonomously.</description>

  <context>
    <file path="prds/agents-assemble-workshop.md" reason="Exercise 2 specification" />
    <file path="rounds/agents-assemble-workshop/decisions.md" reason="Risk: API rate limits, add sleep delays" />
    <file path=".planning/CLI-VERIFIED.md" reason="Verified command syntax" />
  </context>

  <steps>
    <step order="1">Write Exercise 2 introduction:
      - Title: "Exercise 2: The Ralph Wiggum Loop — Build While You Sleep"
      - Estimated time: 5-7 minutes
      - Goal: Create an autonomous build loop</step>
    <step order="2">Write Step 1 - Create a simple TODO file:
      ```bash
      echo "- Add error handling to utils.py" > TODO.md
      echo "- Write tests for the auth module" >> TODO.md
      echo "- Update README with usage examples" >> TODO.md
      ```</step>
    <step order="3">Write Step 2 - The 10-line Ralph Loop:
      ```bash
      #!/bin/bash
      # Ralph Wiggum Loop - Build while you sleep

      MAX_ITERATIONS=3  # Safety limit for demo
      ITERATION=0

      while [ $ITERATION -lt $MAX_ITERATIONS ]; do
        claude -p "Read TODO.md. Pick ONE task. Do it. Mark done. Commit." \
          --max-turns 10 \
          --max-budget-usd 1.00
        sleep 60  # Pause between iterations (be nice to the API)
        ITERATION=$((ITERATION + 1))
      done

      echo "Ralph is done for now!"
      ```</step>
    <step order="4">Write Step 3 - Run it safely:
      - Explain the safety limits (MAX_ITERATIONS, budget cap)
      - Note: Remove limits for production use at your own risk</step>
    <step order="5">Write "Expected Output" section:
      - Show sample of Claude picking a task
      - Show commit message example</step>
    <step order="6">Write "What You Learned" summary:
      - Infinite loops can drive autonomous work
      - Safety mechanisms are critical
      - This is how you "build while you sleep"</step>
    <step order="7">Add Windows PowerShell alternative</step>
  </steps>

  <verification>
    <check type="bash">grep -q "Exercise 2" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "EXERCISE 2 EXISTS"</check>
    <check type="bash">grep -q "while.*true\|while \[" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "LOOP COMMAND PASS"</check>
    <check type="bash">grep -q "sleep" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "RATE LIMIT PROTECTION PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-3" reason="Exercises are sequential in one file" />
  </dependencies>

  <commit-message>docs(workshop): add Exercise 2 - Ralph Wiggum Loop with safety limits</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-5" wave="2">
  <title>Create Exercise 3: /loop Command</title>
  <requirement>REQ-013: /loop for recurring monitoring tasks</requirement>
  <description>Write Exercise 3 demonstrating the built-in /loop command for scheduling recurring prompts within a session.</description>

  <context>
    <file path="prds/agents-assemble-workshop.md" reason="Exercise 3 specification" />
    <file path=".planning/CLI-VERIFIED.md" reason="Verified /loop syntax" />
  </context>

  <steps>
    <step order="1">Write Exercise 3 introduction:
      - Title: "Exercise 3: The /loop Command — Scheduled Tasks Made Easy"
      - Estimated time: 5 minutes
      - Goal: Use built-in scheduling</step>
    <step order="2">Write Step 1 - Basic /loop usage:
      ```
      /loop 2m check if any tests are failing
      ```
      - Explain: runs every 2 minutes</step>
    <step order="3">Write Step 2 - Natural language intervals:
      ```
      /loop check the build status every 5 minutes
      /loop remind me to commit in 30 minutes
      ```</step>
    <step order="4">Write Step 3 - Managing scheduled tasks:
      ```
      what scheduled tasks do I have?
      cancel the build check job
      ```</step>
    <step order="5">Write "Expected Output" section:
      - Show scheduled task confirmation
      - Show task list output</step>
    <step order="6">Write "What You Learned" summary:
      - /loop is session-scoped (disappears when you exit)
      - Natural language intervals work
      - Different from Ralph Loop: /loop is built-in, Ralph is your script</step>
  </steps>

  <verification>
    <check type="bash">grep -q "Exercise 3" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "EXERCISE 3 EXISTS"</check>
    <check type="bash">grep -q "/loop" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "LOOP COMMAND PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-4" reason="Exercises are sequential in one file" />
  </dependencies>

  <commit-message>docs(workshop): add Exercise 3 - /loop command for scheduled tasks</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-6" wave="2">
  <title>Create Exercise 4: Custom Slash Commands</title>
  <requirement>REQ-014: Create ~/.claude/commands/standup.md</requirement>
  <description>Write Exercise 4 showing how to create custom slash commands (skills) that extend Claude Code.</description>

  <context>
    <file path="prds/agents-assemble-workshop.md" reason="Exercise 4 specification" />
    <file path=".planning/CLI-VERIFIED.md" reason="Verified skills path and format" />
  </context>

  <steps>
    <step order="1">Write Exercise 4 introduction:
      - Title: "Exercise 4: Custom Slash Commands — Extend Your Agent"
      - Estimated time: 5-7 minutes
      - Goal: Create a reusable /standup command</step>
    <step order="2">Write Step 1 - Create the skills directory:
      ```bash
      mkdir -p ~/.claude/skills/standup
      ```</step>
    <step order="3">Write Step 2 - Create SKILL.md:
      ```bash
      cat > ~/.claude/skills/standup/SKILL.md << 'EOF'
      ---
      name: standup
      description: Generate a daily standup report from recent git activity
      ---

      # Daily Standup Generator

      Look at the git log for the past 24 hours and generate a standup report:

      1. What I did yesterday (commits from last 24h)
      2. What I'm doing today (open TODO items or issues)
      3. Any blockers (failing tests, unresolved conflicts)

      Format the output as a clean markdown list.
      EOF
      ```</step>
    <step order="4">Write Step 3 - Test the command:
      ```
      /standup
      ```</step>
    <step order="5">Write "Expected Output" section:
      - Show sample standup report format</step>
    <step order="6">Write "What You Learned" summary:
      - Skills live in ~/.claude/skills/ or .claude/skills/
      - SKILL.md defines the command behavior
      - You can distribute skills to your team via git</step>
    <step order="7">Add Windows path note: `%USERPROFILE%\.claude\skills\`</step>
  </steps>

  <verification>
    <check type="bash">grep -q "Exercise 4" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "EXERCISE 4 EXISTS"</check>
    <check type="bash">grep -q "SKILL.md\|skills/" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "SKILLS PATH PASS"</check>
    <check type="bash">grep -q "/standup" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "STANDUP COMMAND PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-5" reason="Exercises are sequential in one file" />
  </dependencies>

  <commit-message>docs(workshop): add Exercise 4 - Custom slash commands with /standup example</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-7" wave="2">
  <title>Create Exercise 5: Hooks</title>
  <requirement>REQ-015: PostToolUse hook that reminds after commits</requirement>
  <description>Write Exercise 5 demonstrating hooks - automated actions triggered by Claude Code events.</description>

  <context>
    <file path="prds/agents-assemble-workshop.md" reason="Exercise 5 specification" />
    <file path=".planning/CLI-VERIFIED.md" reason="Verified hooks schema" />
  </context>

  <steps>
    <step order="1">Write Exercise 5 introduction:
      - Title: "Exercise 5: Hooks — Automate Your Workflow"
      - Estimated time: 5-7 minutes
      - Goal: Trigger actions on Claude events</step>
    <step order="2">Write Step 1 - Create settings.json:
      ```bash
      mkdir -p .claude
      cat > .claude/settings.json << 'EOF'
      {
        "hooks": {
          "PostToolUse": [
            {
              "matcher": "Bash",
              "if": "Bash(git commit*)",
              "hooks": [
                {
                  "type": "command",
                  "command": "echo '✓ Commit complete! Remember to push.' >&2"
                }
              ]
            }
          ]
        }
      }
      EOF
      ```</step>
    <step order="3">Write Step 2 - Test the hook:
      ```
      Ask Claude to make a commit
      ```
      - Observe the reminder message after commit</step>
    <step order="4">Write Step 3 - More hook examples:
      - PreToolUse: Block dangerous commands
      - SessionStart: Load context on startup
      - Notification: Send alerts to Slack/Discord</step>
    <step order="5">Write "Expected Output" section:
      - Show commit output with hook message</step>
    <step order="6">Write "What You Learned" summary:
      - Hooks automate responses to events
      - Can block, modify, or extend behavior
      - Project hooks in .claude/settings.json
      - Global hooks in ~/.claude/settings.json</step>
  </steps>

  <verification>
    <check type="bash">grep -q "Exercise 5" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "EXERCISE 5 EXISTS"</check>
    <check type="bash">grep -q "PostToolUse" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "HOOK TYPE PASS"</check>
    <check type="bash">grep -q "settings.json" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "SETTINGS PATH PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-6" reason="Exercises are sequential in one file" />
  </dependencies>

  <commit-message>docs(workshop): add Exercise 5 - Hooks with PostToolUse commit reminder</commit-message>
</task-plan>
```

---

### Wave 3 (Sequential — High-Risk Exercises)

These tasks implement the complex exercises 6 and 7 that require special handling.

```xml
<task-plan id="phase-1-task-8" wave="3">
  <title>Create Exercise 6: Parallel Agent Debate (Hardened)</title>
  <requirement>REQ-016: Two agents debating in parallel with error recovery</requirement>
  <description>Write Exercise 6 - the climax of the workshop. Two agents with different personas debate in parallel. Must be hardened with explicit error recovery per Decision 2.</description>

  <context>
    <file path="prds/agents-assemble-workshop.md" reason="Exercise 6 specification" />
    <file path="rounds/agents-assemble-workshop/decisions.md" reason="Decision 2: Exercise 6 stays, must be hardened" />
    <file path=".planning/CLI-VERIFIED.md" reason="Verified parallel execution syntax" />
  </context>

  <steps>
    <step order="1">Write Exercise 6 introduction:
      - Title: "Exercise 6: Multi-Agent Debate — The Climax"
      - Estimated time: 7 minutes (extended per Decision 2)
      - Goal: Run two agents with different perspectives</step>
    <step order="2">Write Step 1 - Create the debate prompt file:
      ```bash
      cat > debate-topic.md << 'EOF'
      # Topic: Should we rewrite the auth module in Rust?

      Current state:
      - Python auth module with 500 LOC
      - 3 security vulnerabilities reported last year
      - Performance is "acceptable" but not great

      Debate this decision.
      EOF
      ```</step>
    <step order="3">Write Step 2 - Run parallel agents:
      ```bash
      # Agent 1: Steve Jobs perspective (design/UX focus)
      claude -p "You are Steve Jobs. Read debate-topic.md. \
        Argue from a user experience and simplicity perspective. \
        Be direct and opinionated. Write to steve-opinion.md" \
        --max-turns 5 --max-budget-usd 0.50 &
      PID1=$!

      # Agent 2: Elon Musk perspective (engineering/speed focus)
      claude -p "You are Elon Musk. Read debate-topic.md. \
        Argue from a first-principles engineering perspective. \
        Be bold and contrarian. Write to elon-opinion.md" \
        --max-turns 5 --max-budget-usd 0.50 &
      PID2=$!

      # Wait for both with timeout
      wait $PID1 $PID2
      ```</step>
    <step order="4">Write Step 3 - Error recovery section:
      ```bash
      # If one agent fails, the other continues
      # Check for output files:
      if [ ! -f steve-opinion.md ]; then
        echo "Steve's agent failed - check logs"
      fi
      if [ ! -f elon-opinion.md ]; then
        echo "Elon's agent failed - check logs"
      fi
      ```</step>
    <step order="5">Write Step 4 - Synthesize the debate:
      ```bash
      claude -p "Read steve-opinion.md and elon-opinion.md. \
        Synthesize a final recommendation that considers both perspectives."
      ```</step>
    <step order="6">Write "Expected Output" section with multi-line sample</step>
    <step order="7">Write "Troubleshooting" section:
      - If agents timeout: reduce max-turns
      - If agents conflict on files: use separate output files (done)
      - If rate limited: add sleep between launches</step>
    <step order="8">Write "What You Learned" summary:
      - Multiple agents can work in parallel
      - Different personas produce different insights
      - Error recovery is critical for production
      - This is how agent teams make decisions</step>
  </steps>

  <verification>
    <check type="bash">grep -q "Exercise 6" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "EXERCISE 6 EXISTS"</check>
    <check type="bash">grep -q "Steve Jobs\|Elon Musk" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "PERSONAS PASS"</check>
    <check type="bash">grep -q "&amp;\|wait\|parallel" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "PARALLEL EXECUTION PASS"</check>
    <check type="bash">grep -q "error\|fail\|recovery" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "ERROR RECOVERY PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-7" reason="Exercises are sequential in one file" />
  </dependencies>

  <commit-message>docs(workshop): add Exercise 6 - Parallel agent debate with error recovery</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-9" wave="3">
  <title>Create Exercise 7: Great Minds Plugin + Local Fallback</title>
  <requirement>REQ-017: Plugin installation with local fallback alternative</requirement>
  <description>Write Exercise 7 demonstrating the Great Minds Plugin. Must include a local fallback that demonstrates the same concepts without external dependencies per Decision 4.</description>

  <context>
    <file path="prds/agents-assemble-workshop.md" reason="Exercise 7 specification" />
    <file path="rounds/agents-assemble-workshop/decisions.md" reason="Decision 4: Local fallback required" />
    <file path="great-minds-plugin/" reason="Plugin structure for reference" />
  </context>

  <steps>
    <step order="1">Write Exercise 7 introduction:
      - Title: "Exercise 7: Great Minds Plugin — Your Agent Team Awaits"
      - Estimated time: 5-10 minutes
      - Goal: Experience a full agent agency</step>
    <step order="2">Write Primary Path - Plugin Installation:
      ```bash
      # Install the Great Minds Plugin
      npx @anthropic-ai/claude-code-mcp add sethshoultes/great-minds-plugin
      ```</step>
    <step order="3">Write Primary Path - Using the plugin:
      ```
      # Launch the agency
      /agency-launch

      # Or trigger a specific workflow
      /agency-debate "Should we build a mobile app?"
      ```</step>
    <step order="4">Write FALLBACK section (if plugin fails):
      ```bash
      # Local Fallback: Create your own mini-agency

      # Step 1: Create agent persona files
      mkdir -p agents

      cat > agents/designer.md << 'EOF'
      You are a UX Designer. Focus on user experience,
      simplicity, and visual appeal. Ask: "Will users love this?"
      EOF

      cat > agents/engineer.md << 'EOF'
      You are a Senior Engineer. Focus on architecture,
      performance, and maintainability. Ask: "Will this scale?"
      EOF

      # Step 2: Run your mini-agency
      claude -p "Read agents/designer.md. Review the homepage design." &
      claude -p "Read agents/engineer.md. Review the backend architecture." &
      wait
      ```</step>
    <step order="5">Write "Expected Output" for both paths</step>
    <step order="6">Write "What You Learned" summary:
      - Plugins extend Claude Code with pre-built capabilities
      - You can build your own agency with the patterns from this workshop
      - The Great Minds Plugin demonstrates a full 14-agent system
      - Go forth and build while you sleep!</step>
    <step order="7">Write closing message:
      - "You are now dangerous."
      - Links to resources, community, further learning</step>
  </steps>

  <verification>
    <check type="bash">grep -q "Exercise 7" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "EXERCISE 7 EXISTS"</check>
    <check type="bash">grep -q "great-minds-plugin" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "PLUGIN INSTALL PASS"</check>
    <check type="bash">grep -q "FALLBACK\|Fallback\|fallback" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "FALLBACK PATH PASS"</check>
    <check type="bash">grep -q "/agency-launch\|agency" docs/AGENTS-ASSEMBLE-EXERCISES.md &amp;&amp; echo "AGENCY COMMAND PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-8" reason="Exercises are sequential in one file" />
  </dependencies>

  <commit-message>docs(workshop): add Exercise 7 - Great Minds Plugin with local fallback</commit-message>
</task-plan>
```

---

### Wave 4 (Sequential — Validation)

Final verification tasks to ensure quality.

```xml
<task-plan id="phase-1-task-12" wave="4">
  <title>Validate Zero Placeholder Content</title>
  <requirement>REQ-025: Zero placeholder content (HARD BLOCKER)</requirement>
  <description>Run automated checks to ensure no placeholder content exists in any deliverable file.</description>

  <context>
    <file path="prds/agents-assemble-workshop.md" reason="CRITICAL: NO PLACEHOLDER CONTENT" />
    <file path="docs/AGENTS-ASSEMBLE-*.md" reason="All deliverable files to check" />
  </context>

  <steps>
    <step order="1">Run placeholder content grep:
      ```bash
      grep -riE "placeholder|coming soon|TODO|TBD|stub|\[from PRD\]|\[TBD\]|content in progress" docs/AGENTS-ASSEMBLE-*.md
      ```
      - Must return 0 matches</step>
    <step order="2">Run bracket placeholder check:
      ```bash
      grep -E "\[.*\.\.\.\]|\[insert.*\]|\[add.*\]" docs/AGENTS-ASSEMBLE-*.md
      ```
      - Must return 0 matches</step>
    <step order="3">Verify all 7 exercises are complete:
      ```bash
      grep -c "^## Exercise" docs/AGENTS-ASSEMBLE-EXERCISES.md
      ```
      - Must return 7</step>
    <step order="4">Verify all 7 slides are complete:
      ```bash
      grep -c "^## Slide" docs/AGENTS-ASSEMBLE-SLIDES.md
      ```
      - Must return 7</step>
    <step order="5">Verify expected output exists for each exercise:
      ```bash
      grep -c "Expected Output\|Expected Result" docs/AGENTS-ASSEMBLE-EXERCISES.md
      ```
      - Must return at least 7</step>
    <step order="6">Document any issues found and fix them</step>
  </steps>

  <verification>
    <check type="bash">! grep -riE "placeholder|coming soon|TODO|TBD" docs/AGENTS-ASSEMBLE-*.md &amp;&amp; echo "ZERO PLACEHOLDERS PASS"</check>
    <check type="bash">grep -c "^## Exercise" docs/AGENTS-ASSEMBLE-EXERCISES.md | grep -q "7" &amp;&amp; echo "7 EXERCISES PASS"</check>
    <check type="bash">grep -c "^## Slide" docs/AGENTS-ASSEMBLE-SLIDES.md | grep -q "7" &amp;&amp; echo "7 SLIDES PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Slides must be complete" />
    <depends-on task-id="phase-1-task-2" reason="Script must be complete" />
    <depends-on task-id="phase-1-task-9" reason="All exercises must be complete" />
  </dependencies>

  <commit-message>chore(qa): validate zero placeholder content in workshop materials</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-13" wave="4">
  <title>End-to-End Exercise Testing</title>
  <requirement>REQ-032: Exercise 1 live execution; REQ-033: Exercise 6 pre-demo hardening</requirement>
  <description>Run through all exercises to verify commands work and timing is realistic.</description>

  <context>
    <file path="docs/AGENTS-ASSEMBLE-EXERCISES.md" reason="Exercises to test" />
    <file path="rounds/agents-assemble-workshop/decisions.md" reason="Decision 9: 45 minutes realistic" />
  </context>

  <steps>
    <step order="1">Test Exercise 1 (Headless Mode):
      - Run each command
      - Verify output matches expected
      - Time: should complete in &lt;7 minutes</step>
    <step order="2">Test Exercise 2 (Ralph Loop):
      - Run the bash script (with low iteration count)
      - Verify it picks up TODO items
      - Time: should demo in &lt;5 minutes</step>
    <step order="3">Test Exercise 3 (/loop):
      - Test /loop command in Claude Code
      - Verify scheduling works
      - Time: should complete in &lt;5 minutes</step>
    <step order="4">Test Exercise 4 (Custom Commands):
      - Create the /standup command
      - Invoke it
      - Verify output format
      - Time: should complete in &lt;7 minutes</step>
    <step order="5">Test Exercise 5 (Hooks):
      - Create settings.json with hook
      - Trigger a commit
      - Verify hook fires
      - Time: should complete in &lt;7 minutes</step>
    <step order="6">Test Exercise 6 (Parallel Debate) - CRITICAL:
      - Run both agents in parallel
      - Verify both complete successfully
      - Test error recovery path
      - Run 5 times to verify stability
      - Time: should complete in &lt;7 minutes</step>
    <step order="7">Test Exercise 7 (Plugin):
      - Test plugin install (or fallback)
      - Verify /agency-launch works
      - Time: should complete in &lt;7 minutes</step>
    <step order="8">Total timing check:
      - Sum all exercise times
      - Should be &lt;45 minutes total</step>
    <step order="9">Document any command corrections needed</step>
  </steps>

  <verification>
    <check type="manual">Exercise 1-7 all complete successfully</check>
    <check type="manual">Exercise 6 runs 5 times without failure</check>
    <check type="manual">Total time &lt;45 minutes</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-12" reason="Content must be validated first" />
  </dependencies>

  <commit-message>test(workshop): validate all exercises run end-to-end in &lt;45 minutes</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-14" wave="4">
  <title>Sara Blakely Customer Gut-Check</title>
  <requirement>SKILL.md Step 7: Sara Blakely customer-value review</requirement>
  <description>Spawn Sara Blakely persona to gut-check the workshop from a customer perspective.</description>

  <context>
    <file path="docs/AGENTS-ASSEMBLE-SLIDES.md" reason="Slides to review" />
    <file path="docs/AGENTS-ASSEMBLE-SCRIPT.md" reason="Script to review" />
    <file path="docs/AGENTS-ASSEMBLE-EXERCISES.md" reason="Exercises to review" />
    <file path="prds/agents-assemble-workshop.md" reason="Original PRD for comparison" />
  </context>

  <steps>
    <step order="1">Review all deliverables from customer perspective</step>
    <step order="2">Answer:
      - Would a developer pay for this workshop?
      - What would make them say "shut up and take my money"?
      - What feels like engineering vanity vs. customer value?</step>
    <step order="3">Identify any gaps in the customer journey</step>
    <step order="4">Write findings to .planning/sara-blakely-review.md</step>
  </steps>

  <verification>
    <check type="bash">test -f .planning/sara-blakely-review.md &amp;&amp; echo "SARA REVIEW EXISTS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-13" reason="All content must be tested first" />
  </dependencies>

  <commit-message>review(workshop): Sara Blakely customer gut-check complete</commit-message>
</task-plan>
```

---

## Risk Notes

**From Risk Scanner Analysis:**

### Critical Path Risks (Mitigated)
1. **Placeholder content ships**: Automated grep validation in Wave 4
2. **Commands don't work**: Wave 1 CLI verification before content creation
3. **Exercise 6 fails in live demo**: Hardened with error recovery, 5x test runs
4. **Windows compatibility**: FAQ section with PowerShell alternatives
5. **Plugin dependency breaks**: Local fallback implemented in Exercise 7
6. **Timing unrealistic**: Plan for 45 minutes per Decision 9, timed run-through

### Technical Execution Risks (Mitigated)
- **CLI syntax changes**: Verify against official docs before content creation
- **Rate limits during workshop**: Sleep delays in Ralph Loop, budget caps
- **Parallel agent conflicts**: Separate output files, error recovery

### Compliance Risks (Addressed)
- **No placeholder content**: Automated validation
- **Real commands**: CLI verification step
- **Voice/brand consistency**: Script review for forbidden phrases

---

## Success Criteria

**Technical Criteria**:
- [ ] All 3 files exist with complete content
- [ ] Zero placeholder text (grep validation passes)
- [ ] Every command is verified and works
- [ ] All 7 exercises complete in <45 minutes
- [ ] Exercise 6 runs 5 times without failure

**UX Criteria** (from decisions.md):
- [ ] First 30 seconds = jaw drop moment
- [ ] Voice is casual expertise, not corporate
- [ ] Ends with silence - let them type

**Business Criteria** (from PRD):
- [ ] Developers leave "dangerous" not "informed"
- [ ] No placeholder content (hard blocker)
- [ ] Ready for Caseproof Retreat workshop

---

## Execution Checklist

```
[ ] Wave 1: Foundation (parallel)
    [ ] phase-1-task-10: Verify all CLI commands
    [ ] phase-1-task-11: Create FAQ/troubleshooting

[ ] Wave 2: Content (parallel)
    [ ] phase-1-task-1: SLIDES.md (7 slides)
    [ ] phase-1-task-2: SCRIPT.md (presenter notes)
    [ ] phase-1-task-3: Exercise 1 (Headless Mode)
    [ ] phase-1-task-4: Exercise 2 (Ralph Loop)
    [ ] phase-1-task-5: Exercise 3 (/loop)
    [ ] phase-1-task-6: Exercise 4 (Custom Commands)
    [ ] phase-1-task-7: Exercise 5 (Hooks)

[ ] Wave 3: High-Risk (sequential)
    [ ] phase-1-task-8: Exercise 6 (Parallel Debate - hardened)
    [ ] phase-1-task-9: Exercise 7 (Plugin + fallback)

[ ] Wave 4: Validation (sequential)
    [ ] phase-1-task-12: Zero placeholder validation
    [ ] phase-1-task-13: End-to-end exercise testing
    [ ] phase-1-task-14: Sara Blakely customer review
```

---

## Files Created by This Plan

| File | Path | Purpose |
|------|------|---------|
| AGENTS-ASSEMBLE-SLIDES.md | `docs/AGENTS-ASSEMBLE-SLIDES.md` | 7 slides for presentation |
| AGENTS-ASSEMBLE-SCRIPT.md | `docs/AGENTS-ASSEMBLE-SCRIPT.md` | Presenter speaking notes |
| AGENTS-ASSEMBLE-EXERCISES.md | `docs/AGENTS-ASSEMBLE-EXERCISES.md` | 7 hands-on exercises |
| CLI-VERIFIED.md | `.planning/CLI-VERIFIED.md` | Verified command syntax |
| sara-blakely-review.md | `.planning/sara-blakely-review.md` | Customer gut-check |

---

## Document Trail

- **Requirements**: `.planning/REQUIREMENTS.md`
- **Decisions**: `rounds/agents-assemble-workshop/decisions.md`
- **PRD**: `prds/agents-assemble-workshop.md`
- **Project Rules**: `CLAUDE.md`

---

## Verified Claude Code CLI Syntax

Per research agent findings (April 2026 documentation):

### Headless Mode
```bash
claude -p "prompt"                              # Basic
claude -p "prompt" --max-turns 10               # Limit turns
claude -p "prompt" --max-budget-usd 5.00        # Budget cap
claude -p "prompt" --allowedTools "Bash,Read"   # Tool allowlist
```

### /loop Command
```bash
/loop 5m check build status                     # Every 5 minutes
/loop check deployment every 10 minutes         # Natural language
```

### Skills
```
~/.claude/skills/<name>/SKILL.md                # Personal
.claude/skills/<name>/SKILL.md                  # Project
```

### Hooks (settings.json)
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{ "type": "command", "command": "echo 'done' >&2" }]
    }]
  }
}
```

**Sources:**
- https://code.claude.com/docs/en/headless.md
- https://code.claude.com/docs/en/scheduled-tasks.md
- https://code.claude.com/docs/en/slash-commands.md
- https://code.claude.com/docs/en/hooks-guide.md

---

**Plan Status**: READY FOR EXECUTION
**Estimated Duration**: 6-8 hours focused session
**Parallel Tasks**: Wave 1 (2 tasks), Wave 2 (7 tasks)
**Sequential Blocks**: Wave 3 (2 tasks), Wave 4 (3 tasks)

---

*Plan generated by Great Minds Agency — Phase Planning Agent (GSD-Style)*
*Cross-referenced against: CLAUDE.md (project rules), decisions.md (locked decisions), SKILL.md (planning methodology)*
*CLI syntax verified from official Claude Code documentation (April 2026)*

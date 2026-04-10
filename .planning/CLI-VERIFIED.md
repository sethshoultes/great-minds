# Claude Code CLI Verification Document

**For:** Agents Assemble Workshop
**Verified Date:** April 9, 2026
**Source:** Official Claude Code CLI Reference & Documentation

---

## 1. Headless Mode (Print Mode)

### Command Syntax
```bash
claude -p "prompt text"
```

**VERIFIED** ✓

### Description
- The `-p` flag (or `--print`) runs Claude Code in print mode
- Claude processes the prompt, executes any needed tools, and exits
- No interactive input is read from stdin
- Previous term "headless mode" now called "Agent SDK" or "print mode"

### Basic Example
```bash
claude -p "Find and fix the bug in auth.py"
```

---

## 2. Max Turns Flag

### Command Syntax
```bash
claude -p "prompt" --max-turns 3
```

**VERIFIED** ✓

### Description
- Limits the number of agentic turns (tool calls) Claude can make
- A "turn" is consumed each time Claude Code makes a tool call
- Essential for preventing infinite loops and unnecessary token consumption
- Exit code: Non-zero when limit is reached

### Recommended Values
- `--max-turns 1` to `3` for simple tasks
- `--max-turns 10` for complex multi-step tasks
- Increase for tasks requiring multiple tool operations

### Examples
```bash
# Simple fix with 1 turn
claude -p "Fix linting errors" --max-turns 1

# More complex task with 3 turns
claude -p "Run the test suite and fix any failures" --max-turns 3

# With other flags
claude -p "Summarize this project" --max-turns 5 --output-format json
```

---

## 3. Max Budget USD Flag

### Command Syntax
```bash
claude -p "prompt" --max-budget-usd 5.00
```

**VERIFIED** ✓

### Description
- Caps spending on API calls before stopping
- Works alongside `--max-turns` for unattended execution
- Both flags are essential for scripted/CI workflows
- Stops execution when budget is exceeded

### Common Values
- `--max-budget-usd 0.50` for quick tasks
- `--max-budget-usd 5.00` for longer operations
- Set conservatively for CI/CD pipelines

### Example
```bash
claude -p "Refactor the authentication module" \
  --max-turns 10 \
  --max-budget-usd 2.50
```

---

## 4. Allowed Tools Flag

### Command Syntax
```bash
claude -p "prompt" --allowedTools "Tool1,Tool2" "Tool3(pattern)"
```

**VERIFIED** ✓

### Description
- Pre-approves specific tools so Claude can execute without prompting
- Uses permission rule syntax with support for pattern matching
- Allows wildcards with space before `*` for prefix matching
- Multiple tools can be specified as space-separated quoted strings

### Tool Names
- Built-in tools: `Bash`, `Read`, `Edit`, `Bash(pattern)`
- Pattern syntax: `Bash(git log *)`, `Bash(git diff *)`, `Read`, `Edit`

### Examples
```bash
# Pre-approve Read and Edit tools
claude -p "Summarize this file" \
  --allowedTools "Read,Edit"

# With Bash patterns (space before * is important)
claude -p "Look at my staged changes and create a commit" \
  --allowedTools "Bash(git diff *),Bash(git log *),Bash(git status *),Bash(git commit *)"

# With permission mode (alternative approach)
claude -p "Apply the lint fixes" --permission-mode acceptEdits

# Restrict to specific tools only
claude -p "Find issues in this code" \
  --allowedTools "Read" "Bash(grep *)"
```

### Important Notes
- Space before `*` is **critical** for correct pattern matching
- Without space: `Bash(git diff*)` matches `git diff-index` incorrectly
- With space: `Bash(git diff *)` only matches `git diff` prefix
- Multiple tools should be in separate quoted strings when using patterns

---

## 5. /loop Command for Scheduled Tasks

### Command Syntax (Interactive)
```bash
/loop [interval] "task description"
```

**VERIFIED** ✓

### Interval Syntax
- `m` = minutes (e.g., `5m` = 5 minutes)
- `h` = hours (e.g., `2h` = 2 hours)
- `d` = days (e.g., `1d` = 1 day)
- Default: 10 minutes if omitted
- Minimum: 1 minute (intervals under 1 minute round up to 1m)

### Examples
```bash
# Run every 10 minutes (default)
/loop "Check if deployment completed"

# Run every 5 minutes
/loop 5m "Poll the API for status"

# Run every 2 hours
/loop 2h "Check email for new issues"

# Run daily
/loop 1d "Generate daily report"
```

### Key Characteristics
- **Session-scoped:** Tasks live in current Claude Code process only
- **No persistence:** Tasks disappear when session ends/terminal closes
- **Auto-expiration:** Recurring tasks expire 7 days after creation
- **Max 50 tasks** per session
- **Missed runs:** If Claude is busy, fires once when idle (not once per missed interval)
- **Timezone:** All times in your local timezone (not UTC)
- **Offset:** Small deterministic offset added to fire times (0-6 min for hourly)

### Requirements
- Claude Code v2.1.72 or later
- Check version: `claude --version`

### Disabling Scheduled Tasks
Set environment variable to disable entirely:
```bash
export CLAUDE_CODE_DISABLE_CRON=1
```

### Use Cases
- Poll a deployment for completion
- Babysit a PR review
- Check on long-running builds
- Periodic reminders within a session

---

## 6. Skills Directory Structure

### Global Skills Location
```
~/.claude/skills/
```

**VERIFIED** ✓

### Directory Structure
```
~/.claude/skills/
├── skill-name-1/
│   ├── SKILL.md          (Required: frontmatter + instructions)
│   ├── scripts/          (Optional: executable scripts)
│   └── resources/        (Optional: reference files)
├── skill-name-2/
│   └── SKILL.md
└── another-skill/
    └── SKILL.md
```

### Creating a Skill
```bash
mkdir -p ~/.claude/skills/my-skill/scripts
touch ~/.claude/skills/my-skill/SKILL.md
```

### SKILL.md Structure
```markdown
---
name: "My Skill"
description: "A brief description (max 1024 chars)"
invoke: "user"  # or "auto"
---

# My Skill

Instructions and documentation for this skill.
You can include markdown, code examples, etc.
```

### Key Points
- Each skill is a **folder** with `SKILL.md` file
- Metadata loaded immediately (name, description)
- Full instructions loaded when skill is relevant
- Linked files loaded only when needed
- Custom skills are **filesystem-based** (no API upload needed)
- Claude discovers and uses them automatically
- Live change detection: Edit skills during session without restarting

### Project-Level Skills
Skills can also be placed in project directory:
```
.claude/skills/
├── deploy/
│   └── SKILL.md
└── review/
    └── SKILL.md
```

### File Access with --add-dir
- The `--add-dir` flag grants file access to additional directories
- Skills in `.claude/skills/` within added directory are auto-loaded
- Live change detection works for these skills too

---

## 7. Hooks Configuration in settings.json

### Configuration Locations

**Global Settings:**
```
~/.claude/settings.json
```

**Project Settings:**
```
.claude/settings.json
```

**Local Project Settings (not committed):**
```
.claude/settings.local.json
```

**VERIFIED** ✓

### Basic Hook Structure
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $file"
          }
        ]
      }
    ]
  }
}
```

### Hook Event Types

**Common Events:**
- `PreToolUse` - Before Claude executes an action (validation, blocking)
- `PostToolUse` - After Claude completes an action (cleanup, formatting)
- `SessionStart` - On session start (context injection, env vars)
- `Notification` - On notification events (desktop/Slack alerts)

**Additional Events (21 total lifecycle events):**
- SessionEnd, PreToolUseStart, PostToolUseStart, and others

### Matcher Patterns
- **Exact match:** `"Edit"` matches the Edit tool exactly
- **Multiple tools:** `"Edit|Write"` matches Edit or Write
- **Regex patterns:** `"Notebook.*"` matches Notebook and variants
- **Case-sensitive:** Matchers are case-sensitive
- **Tool names only:** Patterns match action names, not parameters

### Hook Handler Types
- `command` - Execute shell commands
- `http` - Send HTTP requests
- `prompt` - Send prompts to Claude
- `agent` - Execute agent actions

### Control Flow with Exit Codes
- `exit 0` - Proceed with action
- `exit 2` - Block/deny the action
- Data passed to stdin as JSON

### Example: Auto-Format Code
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

### Example: Desktop Notification
```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude Code needs your attention\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

### Important Notes
- **Non-interactive:** Hooks run in non-interactive shells (no prompts/dialogs)
- **Path resolution:** Use `$CLAUDE_PROJECT_DIR` prefix for reliable path handling
- **JSON input:** Event data passed to stdin as JSON
- **Disabling hooks:** Set `"disableAllHooks": true` in settings
- **Configuration precedence:** User settings → Project settings → Local settings

### Setting Up Hooks Interactively
Use the `/hooks` command in Claude Code (interactive mode):
```
/hooks
# Walk through selecting event, matcher, and command
```

---

## 8. Additional Useful Flags

### Output Format
```bash
claude -p "query" --output-format json
```

**Options:** `text` (default), `json`, `stream-json`

### Bare Mode (Recommended for Scripts)
```bash
claude --bare -p "query" --allowedTools "Read"
```
- Skips auto-discovery (hooks, skills, plugins, MCP servers)
- Faster startup for CI/CD
- Only explicit flags take effect
- Recommended default for `-p` in future releases

### Verbose Output
```bash
claude -p "query" --verbose
```

### Debug Mode
```bash
claude --debug "api,hooks" -p "query"
```

### Custom System Prompt
```bash
claude -p "query" --append-system-prompt "Always use TypeScript"
```

### Continue Previous Conversation
```bash
claude -c -p "Continue with next step"
```

### JSON Schema Output
```bash
claude -p "Extract data" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"items":{"type":"array"}}}'
```

---

## Platform-Specific Notes

### macOS
- All commands verified on macOS (darwin)
- Desktop notifications: Use `osascript` for system notifications
- Environment variables: Set in `~/.zshrc` or equivalent

### Windows
- Bash commands require Git Bash, WSL, or equivalent
- Path separators: Use `/` in commands (forward slash)
- Hooks: Command paths may differ (e.g., `.bat` scripts)

### Linux
- All commands compatible with standard Linux shells
- Desktop notifications: Use `notify-send` or equivalent

---

## Summary Checklist for Workshop

- [x] Headless mode (`claude -p "prompt"`)
- [x] `--max-turns` flag for limiting tool calls
- [x] `--max-budget-usd` flag for cost control
- [x] `--allowedTools` flag with pattern matching
- [x] `/loop` command for scheduled tasks (session-scoped)
- [x] Skills directory structure (`~/.claude/skills/`)
- [x] Hooks configuration in `settings.json`
- [x] Examples for all command types
- [x] Platform differences documented
- [x] Caveats and limitations noted

---

## Sources

- [Claude Code CLI Reference](https://code.claude.com/docs/en/cli-reference)
- [Run Claude Code Programmatically](https://code.claude.com/docs/en/headless)
- [Run Prompts on a Schedule](https://code.claude.com/docs/en/scheduled-tasks)
- [Extend Claude with Skills](https://code.claude.com/docs/en/skills)
- [Automate Workflows with Hooks](https://code.claude.com/docs/en/hooks-guide)
- [Agent SDK Documentation](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)

**Last Updated:** April 9, 2026
**CLI Version Tested:** 2.1.72+
**Documentation Status:** Current

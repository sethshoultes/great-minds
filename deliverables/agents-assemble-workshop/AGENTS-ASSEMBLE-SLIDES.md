# Agents Assemble
## Building Teams That Work While You Sleep

---

## Slide 1: Title

# Agents Assemble
### Building Teams That Work While You Sleep

*You will leave this room dangerous.*

---

## Slide 2: Headless Mode — Your First Autonomous Action

```bash
claude -p "Fix the bug in auth.py" --max-turns 10 --max-budget-usd 1.00
```

**One command. No interaction. It just works.**

- `-p` = print mode (headless)
- `--max-turns` = limit tool calls
- `--max-budget-usd` = cap spending

---

## Slide 3: The Ralph Wiggum Loop — Build While You Sleep

```bash
#!/bin/bash
# Ralph Wiggum Loop - "I'm helping!"

while true; do
  claude -p "Pick next task from TODO.md, implement it, test it, commit it" \
    --max-turns 10 \
    --max-budget-usd 1.00
  sleep 60
done
```

**Go to bed. Wake up to commits.**

---

## Slide 4: /loop, Commands, and Hooks — The Power Tools

```bash
# Scheduled tasks (session-scoped)
/loop 5m check if the build is passing

# Custom slash commands
/standup  # Your own commands in ~/.claude/skills/

# Hooks in .claude/settings.json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{ "type": "command", "command": "echo 'Done!' >&2" }]
    }]
  }
}
```

**Extend Claude Code to fit your workflow.**

---

## Slide 5: Multi-Agent Teams — The Climax

```bash
# Two agents, two perspectives, running in parallel

claude -p "You are Steve Jobs. Critique this design for user experience." \
  --max-turns 5 --max-budget-usd 0.50 &
PID1=$!

claude -p "You are Elon Musk. Evaluate this architecture for scalability." \
  --max-turns 5 --max-budget-usd 0.50 &
PID2=$!

wait $PID1 $PID2

# Now synthesize their debate
claude -p "Read both opinions. Make a recommendation."
```

**Agents that argue, deliberate, and decide.**

---

## Slide 6: The Full Pipeline — Where This Is Going

```
PRD  -->  Debate  -->  Plan  -->  Build  -->  QA  -->  Review  -->  Ship
 |          |           |          |         |          |           |
 v          v           v          v         v          v           v
Input    Steve vs    Task      Parallel   Automated   Board      Deploy
         Elon        Plans     Agents     Tests       Sign-off
```

**A 14-agent team that processes PRDs and ships products.**

This is aspirational. You've just learned the building blocks.

---

## Slide 7: Your Turn

```bash
npx @anthropic-ai/claude-code-mcp add sethshoultes/great-minds-plugin@1.0.0
```

**Install. Run `/agency-launch`. See what's possible.**

Or build your own with the patterns you learned today.

---

*Now... go build something.*

[silence]

---

## Quick Reference

| Concept | Command |
|---------|---------|
| Headless mode | `claude -p "prompt"` |
| Limit turns | `--max-turns 10` |
| Budget cap | `--max-budget-usd 1.00` |
| Tool allowlist | `--allowedTools "Bash,Read"` |
| Scheduled task | `/loop 5m check build` |
| Custom command | `~/.claude/skills/*/SKILL.md` |
| Hooks | `.claude/settings.json` |

---

*Workshop materials: github.com/sethshoultes/great-minds*

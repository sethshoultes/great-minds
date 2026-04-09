# Agents Assemble — Presenter Script

**Total Time**: 10-15 minutes (talk) + 30-45 minutes (exercises)
**Voice**: Casual expertise. Senior engineer at a whiteboard. Not a conference speaker.
**Forbidden Words**: "leverage", "utilize", "empower your workflow"
**Allowed Words**: "build while you sleep", "ship it", "your turn", "dangerous"

---

## Slide 1: Title (~1 minute)

### What to Say

"You will leave this room dangerous.

Not informed. Not enabled. *Dangerous.*

I'm not going to explain what AI agents are. I'm not going to show you a PowerPoint about the future of work. I'm going to show you how to build an army of tireless workers that ship code while you sleep.

Let's start."

### Notes
- No preamble. No 'thanks for coming.' Jump straight in.
- The word 'dangerous' is the hook. It signals capability, not information.
- Pause after 'Let's start.' Then advance to Slide 2.

---

## Slide 2: Headless Mode (~2 minutes)

### What to Say

"This is the command that changes everything.

```bash
claude -p "Fix the bug in auth.py" --max-turns 10 --max-budget-usd 1.00
```

The `-p` flag is print mode. Claude reads your prompt, does the work, and exits. No interaction required.

`--max-turns` limits how many tool calls it can make. Think of it as a safety valve — you don't want it spinning forever.

`--max-budget-usd` caps spending. Essential when you're running this unattended.

This is how you automate. One command. Fire and forget.

In Exercise 1, you're going to run this yourself. Paste the command. Watch it work. That's your first autonomous commit."

### Notes
- Point at each flag as you explain it.
- Emphasize 'fire and forget' — this is the unlock.
- Don't over-explain. Let them discover in the exercise.

---

## Slide 3: Ralph Wiggum Loop (~2 minutes)

### What to Say

"Now let's get weird.

```bash
while true; do
  claude -p "Pick next task from TODO.md, implement it, test it, commit it"
  sleep 60
done
```

This is the Ralph Wiggum Loop. It picks a task, does it, commits, and waits a minute before doing the next one.

You go to bed. You wake up. There are 47 commits waiting for review.

The `sleep 60` is important — it's not just politeness to the API. It's rate limiting. It's thinking time between tasks. It's how you avoid a $500 bill overnight.

This is dumb. This is beautiful. This works.

In Exercise 2, you'll write your own version with safety limits."

### Notes
- 'Ralph Wiggum' is intentional humor. It signals 'this is silly but effective.'
- Pause on 'This is dumb. This is beautiful. This works.'
- The humor masks a serious point: simple loops + AI = autonomous work.

---

## Slide 4: /loop, Commands, and Hooks (~2 minutes)

### What to Say

"Claude Code has built-in power tools. Let me show you three.

First: `/loop`. This schedules recurring tasks in your session.

```
/loop 5m check if the build is passing
```

Every 5 minutes, Claude checks the build. Session-scoped — it disappears when you close the terminal.

Second: Custom slash commands. You can create your own.

```
/standup
```

This runs your custom script from `~/.claude/skills/standup/SKILL.md`. You define it. You own it.

Third: Hooks. These are triggers that fire on events.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{ "type": "command", "command": "echo 'Done!' >&2" }]
    }]
  }
}
```

Every time Claude runs a Bash command, your hook fires. Auto-format code. Send Slack notifications. Block dangerous commands.

Exercises 3, 4, and 5 walk you through each of these."

### Notes
- This slide is dense. Keep it moving.
- Point at each code block as you explain it.
- Don't go deep — exercises will teach the details.

---

## Slide 5: Multi-Agent Teams (~2 minutes)

### What to Say

"This is the climax.

```bash
claude -p "You are Steve Jobs. Critique this design." &
claude -p "You are Elon Musk. Evaluate the architecture." &
wait
```

Two agents. Two perspectives. Running in parallel.

Steve cares about user experience. Elon cares about scalability. They argue. They disagree. And then a third agent synthesizes their debate into a recommendation.

This is how you build a team that thinks.

Not just executes — *thinks*. Different perspectives. Different priorities. Working toward the same goal.

In Exercise 6, you'll run a parallel debate yourself. Two agents, one topic, real conflict."

### Notes
- This is the emotional peak. Build energy.
- 'A team that thinks' is the key phrase.
- Pause after 'Working toward the same goal.' Let it land.

---

## Slide 6: The Full Pipeline (~1.5 minutes)

### What to Say

"Here's where this is going.

PRD goes in. Debate happens. Plan emerges. Agents build in parallel. QA runs tests. Board reviews. Product ships.

A 14-agent team that processes product requirements and delivers working software.

You don't need to build all of this today. What you learned — headless mode, loops, commands, hooks, parallel agents — these are the building blocks.

Exercise 7 shows you the Great Minds Plugin, which implements this full pipeline. Or you can start building your own."

### Notes
- This is aspirational. Don't make it sound required.
- Emphasize 'building blocks' — they now have everything they need.
- Transition smoothly to Slide 7.

---

## Slide 7: Your Turn (~1.5 minutes)

### What to Say

"Your turn.

```bash
npx @anthropic-ai/claude-code-mcp add sethshoultes/great-minds-plugin
```

Install the plugin. Run `/agency-launch`. See what a full agent team looks like.

Or don't. Use what you learned today to build your own thing.

There are 7 exercises in front of you. Headless mode. The Ralph Loop. Scheduled tasks. Custom commands. Hooks. A parallel debate. And the plugin install.

You have everything you need.

Now... go build something."

### Notes
- Slow down on the last line.
- After 'go build something', STOP TALKING.
- Let them type. The room should fill with keyboard sounds.
- This is the ending. Don't add 'any questions?' or 'thanks for coming.'

---

## Timing Summary

| Slide | Topic | Time |
|-------|-------|------|
| 1 | Title / Hook | ~1 min |
| 2 | Headless Mode | ~2 min |
| 3 | Ralph Wiggum Loop | ~2 min |
| 4 | /loop, Commands, Hooks | ~2 min |
| 5 | Multi-Agent Teams | ~2 min |
| 6 | Full Pipeline | ~1.5 min |
| 7 | Your Turn | ~1.5 min |
| **Total** | | **~12 min** |

---

## Voice Guidelines

### Do Say
- "This is how you automate."
- "Fire and forget."
- "Build while you sleep."
- "This is dumb. This is beautiful. This works."
- "A team that thinks."
- "Your turn."
- "Go build something."

### Don't Say
- "Let me leverage this framework..."
- "This will empower your workflow..."
- "Utilize these tools to..."
- "In conclusion..."
- "Any questions?"

### Tone
- Confident but not arrogant
- Technical but not academic
- Casual but not sloppy
- Like explaining something cool to a smart friend

---

## Emergency Fallbacks

### If a demo fails:
"Sometimes the AI gods are angry. Let's move to the exercises where you'll run it yourself."

### If you run over time:
Skip Slide 6 entirely. Go from Slide 5 directly to Slide 7. The pipeline is aspirational; the exercises are essential.

### If the room is confused:
"Don't worry if this feels fast. The exercises walk through each concept step by step. Just follow the commands."

### If someone asks about pricing:
"Claude Code uses the Claude API. Costs depend on usage — roughly $3-15 per 1M tokens. The `--max-budget-usd` flag caps spending per command. Check console.anthropic.com for your account."

---

## Pre-Workshop Checklist

- [ ] Test `claude -p "hello" --max-budget-usd 0.10` works on your machine
- [ ] Verify ANTHROPIC_API_KEY is set
- [ ] Have exercises markdown open and ready to share
- [ ] Have a backup laptop ready if primary fails
- [ ] Know the WiFi password for attendees

---

*"The goal isn't completion. The goal is conversion. When they leave, they're not 'informed.' They're dangerous."* — Steve Jobs (in the planning debate)

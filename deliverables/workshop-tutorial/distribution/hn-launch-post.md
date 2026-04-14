# IGNITE Hacker News Launch Post

---

## Post Title Options

**Option 1 (Show HN format):**
```
Show HN: IGNITE – AI agents that debate your PRD before you build
```

**Option 2 (Feature-focused):**
```
Show HN: Steve Jobs and Elon Musk AI debate your startup ideas
```

**Option 3 (Outcome-focused):**
```
Show HN: From PRD to deployed app in 40 minutes with AI advisors
```

**Recommended: Option 1** — HN values substance over hype

---

## Post Body

```
Hey HN,

I built IGNITE, a Claude Code plugin that gives you access to AI advisors who debate your product ideas before you build them.

**What it does:**

1. You write a PRD (Product Requirements Document)
2. AI agents with distinct perspectives (Steve Jobs for design, Elon Musk for engineering, Phil Jackson for synthesis) debate it
3. You get a synthesis with locked decisions, build priorities, and risks
4. The system then helps you build and ship

**Why I built this:**

I kept building the wrong things. Not because I couldn't code, but because I didn't have anyone to challenge my assumptions before I started.

The feedback loop was: build for 2 weeks → show someone → learn it was wrong → start over.

I wanted something that could compress that feedback to *before* I write code.

**How it works:**

The agents aren't just different prompts. They have distinct reasoning patterns:

- Steve focuses on emotional impact and user experience
- Elon focuses on first principles and speed to market
- Phil synthesizes conflicting views into actionable decisions

The debate produces a synthesis document with:
- Locked decisions (no more bikeshedding)
- Build priorities (P0/P1/P2)
- Open questions (your homework)
- Risk register (what could go wrong)

**Demo:**

Run this in Claude Code (no API key required):

```
/agency-demo
```

You'll see Steve and Elon debate a sample PRD (a link saver app) in ~90 seconds.

**Install:**

```
claude mcp add great-minds npx @anthropic-ai/great-minds-plugin
```

**Links:**
- Workshop: [link]
- GitHub: [link]
- Discord: [link]

Would love feedback, especially on:
1. What types of PRDs work best (and worst) for this
2. Whether the agent perspectives feel distinct enough
3. Ideas for additional agents with useful perspectives

Thanks for reading.
```

---

## Anticipated Questions & Answers

### "Isn't this just roleplay prompting?"

**Answer:**
```
It's more structured than that. Each agent has:
- A distinct reasoning framework (not just "pretend to be X")
- Specific aspects they're trained to evaluate
- Consistent interaction patterns

The debate format matters too — they respond to each other's points, which surfaces tensions that single-agent prompts miss.

That said, it's definitely building on the same foundation. The value is in the structure and the synthesis, not just the personas.
```

### "Why these specific 'minds'?"

**Answer:**
```
Pragmatic choice. Steve/Elon represent a classic product tension: user experience vs. engineering efficiency. Phil as synthesizer is borrowed from his coaching philosophy of managing strong personalities.

We tested other combinations. This one produces the most useful tension without devolving into agreement-fests or unresolvable conflicts.

Open to suggestions for other perspectives that would add signal.
```

### "How is this different from just asking Claude directly?"

**Answer:**
```
Three things:

1. Structure — The debate format produces a synthesis document with concrete decisions, not just "thoughts"

2. Tension — Multiple perspectives surfacing conflict is more useful than one perspective trying to be balanced

3. Follow-through — After debate, the same system helps you build and ship. It's not just feedback, it's a pipeline.

You could replicate #1 and #2 with careful prompting. #3 is where the plugin adds real value.
```

### "Does this actually work for real projects?"

**Answer:**
```
Shipped 3 projects with it so far. The debate phase has been more valuable than I expected — twice it convinced me to cut features I thought were essential.

The build phase is more hit-or-miss. Simple MVPs work well. Complex features need more human intervention.

Would love to see what others build with it.
```

### "What's the business model?"

**Answer:**
```
Free and open source. Uses your own Anthropic API key.

No current plans to monetize. Built this to scratch my own itch.

If it gets traction, maybe hosted version with managed API costs. But not prioritizing that now.
```

### "This seems like it would produce generic advice"

**Answer:**
```
Fair concern. The quality scales with PRD specificity.

A vague PRD ("build a social app") gets vague feedback.

A specific PRD ("save links with semantic search, ship in 2 weeks, $0 infrastructure budget") gets specific feedback.

The demo uses a tight PRD intentionally. Try it and see if the output feels generic.
```

---

## Comment Strategy

### Launch Day Comments to Make

**First comment (context):**
```
Creator here. Happy to answer questions.

Quick context: This started as a personal tool after I wasted a month building a feature nobody wanted. The debate format came from frustration with single-perspective AI feedback.

The "Steve and Elon" framing is admittedly provocative, but the underlying idea — structured multi-perspective review before building — is what I think is actually useful.
```

**Technical details comment:**
```
Technical details for the curious:

- Built as a Claude Code MCP plugin
- Agents are defined with distinct system prompts + few-shot examples
- Debate is orchestrated with structured turn-taking
- Synthesis uses a separate summarization step
- Build phase uses Claude's tool use for code generation

Happy to go deeper on any of this.
```

### Responses to Common Criticisms

**"This is just hype / AI wrapper"**
```
Understand the skepticism. The "Steve Jobs AI" framing is definitely attention-grabbing, maybe too much so.

The actual value proposition is: structured multi-perspective feedback before you code. The persona framing makes it memorable and gives the agents distinct voices.

If you strip the persona layer, you still have a useful debate→synthesis→build pipeline. But it's less fun to use.
```

**"Why not just use [competitor]?"**
```
Different tools for different stages.

Cursor/Copilot: great for writing code
ChatGPT: great for brainstorming
IGNITE: specifically for the "should I build this and how" question

The debate format is the differentiator. It's designed to surface disagreement, not consensus.
```

---

## Metrics to Track

Post-launch, track:
- Upvotes over time
- Comment sentiment (supportive vs. skeptical)
- Questions asked (indicates interest areas)
- GitHub stars correlated with HN traffic
- Discord joins correlated with HN traffic
- Demo command usage spike

---

## Timing Recommendations

**Best posting times for HN:**
- Weekday mornings, US time (9-11 AM EST)
- Tuesday-Thursday perform best
- Avoid weekends and holidays

**Response cadence:**
- Respond to comments within first 2 hours (critical for ranking)
- Be substantive, not defensive
- Acknowledge good criticisms
- Don't argue with trolls

---

## Follow-Up Posts

If launch goes well, plan follow-up content:

1. **Week 2:** "What we learned from 100 IGNITE debates"
2. **Month 1:** "Most surprising feedback from AI advisors"
3. **Month 2:** Feature update post

---

*HN Launch Post Version: 1.0*
*Last Updated: 2026-04-09*

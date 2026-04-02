# From Idea to 128 Files While You Sleep: Building an AI Agent Swarm with Claude Code

**Subtitle:** How one developer built a fully autonomous multi-agent agency — complete debate system, product deliverables, scaffolded software, and a live deployment — in a single session.

---

## Workshop at a Glance

| | |
|---|---|
| **Duration** | 45 minutes |
| **Format** | Live demo-forward with slide anchors |
| **Target Audience** | Developers and technical founders who are already using AI tools but feel like they're still doing most of the thinking themselves |
| **Prerequisite Knowledge** | Comfortable with git, basic terminal use, and has used Claude or ChatGPT for coding tasks |
| **Room Setup** | Single screen, presenter machine visible; audience should NOT be coding along — this is a watch-and-understand session |

---

## What Attendees Will Leave Knowing

1. The difference between using AI as a tool versus deploying AI as a team
2. How to structure an agent swarm using SOUL.md, MEMORY.md, and AGENTS.md — the three files that give agents identity and context
3. The Multi-Agent Debate (MAD) framework: why letting AI personas argue produces better outputs than asking AI to simply answer
4. How to install a "board member" on a cron job that audits your project while you sleep
5. The build pipeline: Debate → Plan → Build → Review → Ship
6. How to correct agents mid-build and why they eventually start spawning their own sub-agents
7. A concrete path to starting their own swarm this week

---

## The Opening Hook (Minutes 0-3)

**Do not open with a slide. Open with a number.**

Walk to the front. Say this:

> "Last week I sat down with a vague idea. I wanted to think through a project. I opened Claude Code, typed a few things, and went to sleep.
>
> By morning: 128 source files. 99 tests. Stripe billing wired up. A Meta social integration. A brand guide. A Storybook. A Vercel deployment. GitHub issues filed by an AI board member who had audited the strategy overnight and found three blind spots I hadn't seen.
>
> I want to show you exactly how that happened. Not the magic-trick version. The real version — including the wrong turns, the mid-build corrections, and the moment the agents started spawning their own agents."

Beat. Let it land.

> "This is not about prompting better. This is about building differently."

Advance to the first slide.

---

## Minute-by-Minute Breakdown

---

### SECTION 1: The Shift in Thinking (Minutes 3-8)

**Slide anchor: "You are not the bottleneck. Your architecture is."**

**Talking points:**

Most developers use AI the same way they used Stack Overflow — fire a question, get an answer, paste it in, move on. The mental model is: *I think, AI assists.* That model caps out fast. You are still doing all the thinking. You are still the only one who sees the whole picture.

The shift is not about better prompts. It is about building a *system* — one where multiple agents hold different perspectives, argue with each other, and produce outputs you never directly authored.

Think about how the best companies actually work. You have a visionary who pushes on the product experience. You have someone who will kill a bad idea before it wastes six months. You have a board member who shows up once a quarter and asks the uncomfortable question nobody in the room wanted to ask. You have a chief of staff who makes sure decisions actually turn into action.

What if you could staff that whole room with AI — not chatbots running scripts, but agents with genuine personas, deeply researched, who argue with each other over your PRD?

That is what we built. Let me show you what it looks like.

**[SLIDE: Simple diagram — PRD → Debate → Plan → Build → Ship, with agent names on each stage]**

---

### SECTION 2: The Architecture — Three Files That Change Everything (Minutes 8-15)

**Slide anchor: "Give your agents a soul."**

**Talking points:**

Every great product has a design principle. A north star. Something that keeps decisions consistent across time and across people. Without it, you get incoherence. You get features that contradict each other. You get a product that nobody can describe in one sentence.

Agent systems have the same problem. If your agents have no identity, no values, no persistent memory — every conversation starts from zero. They do not know what you built last week. They do not have opinions. They are expensive autocomplete.

We solved this with three files. These come from the OpenClaw conventions, and they are simple enough to create in ten minutes.

**[LIVE DEMO — 3 minutes]**

Open the terminal. Show the great-minds project root. Walk through:

- `SOUL.md` — The agency's values and purpose. One page. What does this agency stand for? What will it refuse to do? Read one paragraph aloud. Explain: this is what gets injected into every agent's context. This is the shared DNA.

- `AGENTS.md` — Who works here. Each agent listed with their persona, their role, and a pointer to their persona file. Show the Steve Jobs entry. Show the Elon Musk entry. Show Marcus Aurelius as moderator.

- `MEMORY.md` — The index of persistent memory. Not conversation history — *curated knowledge* that survives between sessions. Show an entry. Explain that agents write to this, and it gets loaded into future conversations.

**[Back to slides]**

This is end-to-end ownership of the agent experience. The soul file, the identity file, the memory file — these are not configuration. They are culture. They are what makes the difference between an agent that drifts and an agent that has a point of view.

The persona files are worth mentioning separately. We pulled deeply researched, 5,000-to-15,000-word persona documents for each character — Steve Jobs, Elon Musk, Marcus Aurelius, Jensen Huang. Not "be creative and bold like Steve Jobs." Actual philosophy, actual decision-making patterns, actual language. When these agents argue, they argue *in character*. That matters. A Steve Jobs persona that does not push back on your PRD is not useful. It is just flattery.

---

### SECTION 3: The Debate — Why AI Should Argue (Minutes 15-22)

**Slide anchor: "The best decisions survive an argument."**

**Talking points:**

Here is the mistake most people make when they want AI to evaluate an idea: they ask one AI. That AI was trained to be helpful. It will find the good in your idea. It will add caveats, yes — but it will generally affirm the direction you came in with.

Multi-Agent Debate (MAD) is different. You introduce genuine adversarial tension. One agent is tasked with making the strongest possible case for a position. Another is tasked with attacking it. A third moderates and synthesizes. The outputs are not consensus — they are *positions under pressure*.

We ran this on a product called LocalGenius — an AI platform for small local businesses. The PRD went in. Two rounds of debate. Here is what happened.

**[LIVE DEMO — 4 minutes]**

Open the rounds directory. Show the file structure — `rounds/local-genius/`. Open a round file. Read one exchange aloud — pick a sharp moment where the two agents disagree. The disagreement should feel real, not scripted.

Point to the deliverables. Navigate to `/deliverables/local-genius/`. Show the list of files:
- Product design document
- Market fit analysis
- User personas
- Team structure recommendations
- Marketing goals and messaging
- Creative review
- Joint summary

Then say the number: **195 kilobytes of strategy deliverables.** Not notes. Not bullet points. Finished documents.

**[Back to slides]**

Here is the evolution that happened mid-session and is worth internalizing: we started with ten rounds of debate. Then we realized — ten rounds of agents talking is still just talking. The agents should not just produce arguments. They should produce *work*. So we cut to two rounds of debate, then the pipeline shifts: the agents plan who to hire as sub-agents, and then they build.

Debate is a means. Shipping is the end.

---

### SECTION 4: The Board Member on a Cron (Minutes 22-27)

**Slide anchor: "The best board member is the one who shows up when you least expect it."**

**Talking points:**

Midway through building this system, we added something that changed the character of the whole project. We put Jensen Huang — the Nvidia CEO, deep researcher — on a 60-minute cron job. Every hour, he loads the current state of the project, performs a strategic review, and files GitHub issues.

He is not building anything. He is watching. And because he watches with fresh eyes every hour, he catches things that anyone who has been in the weeds all day will miss.

**[LIVE DEMO — 2 minutes]**

Show the cron configuration. Show one of the GitHub issues Jensen filed. Read the title and the first paragraph. The issue should identify a strategic blind spot — something like data moat risk, or pricing vulnerability, or a missing platform partnership.

Then say this:

> "I did not ask him to look at this. I did not know this was a gap. He found it because he was looking at the whole board, not the specific square I was staring at."

**[Back to slides]**

This is the return of the board function. In most early-stage companies, nobody is doing board-level strategic review because there is no board. The founder is too close to the work. This gives you that function, running continuously, at essentially zero cost.

We also added two other cron jobs:
- A 7-minute monitoring agent that watches system health
- A 20-minute organizer that detects when agents have gone idle and nudges them back into motion

The system does not stop when you stop. That is the point.

---

### SECTION 5: From Strategy to Software (Minutes 27-35)

**Slide anchor: "The agents planned the build. Then they built it."**

**Talking points:**

After the debate phase, the agents shifted into planning mode. They were not given a tech stack. They were not given a data model. They reasoned about what LocalGenius needed and produced:

- Technology stack recommendation with rationale
- Full data model
- API design
- Infrastructure documentation

**192 more kilobytes of technical deliverables** before a single line of application code was written.

Then they scaffolded. First a Next.js app. 26 source files to start.

**[LIVE DEMO — 5 minutes]**

Open the LocalGenius repo. Show the directory tree. Point to the source file count — 128+ files. Show a few:
- The main app structure
- One of the 99+ test files
- The Stripe billing integration
- The brand guide file
- The Storybook configuration

Then show the git log. Not to read every commit — just to show the *velocity*. Show timestamps. Show how much was built in a single session.

Then: the mid-build correction. Pull up the moment where Seth had to redirect the agents to use a proper directory structure. Read the message he sent. Show that the agents adapted and continued.

> "This is the important part. These are not scripts running in a loop. They are reasoning about the codebase. When I corrected them, they understood the correction."

Then — the moment agents started spawning their own sub-agents. Show a log or a note where an agent decided it needed to spin up a test-writing agent, a seed data agent, a production checklist agent. Explain what this means:

> "When your agents start hiring, you have crossed a threshold. They are no longer executing tasks you defined. They are defining tasks you did not think of."

**[Back to slides]**

---

### SECTION 6: The Stack — What You Actually Need to Build This (Minutes 35-40)

**Slide anchor: "The tools are simpler than you think."**

**Talking points:**

People hear a story like this and assume there is some massive infrastructure behind it. A cloud platform, a vector database, an orchestration layer, weeks of setup.

Here is what the actual stack is:

- **Claude Code** — the primary interface. Not an API wrapper. Claude Code can read and write files, run commands, use git. It is an agent runtime.
- **claude-swarm** — Seth's own open-source project. tmux orchestration and git worktrees. Multiple agents running in parallel terminal sessions, sharing a filesystem. This is the layer that makes parallelism possible.
- **Persona files** — plain markdown. Long, carefully written, loaded into agent context.
- **SOUL.md + AGENTS.md + MEMORY.md** — three plain markdown files. The identity layer.
- **GitHub** — where Jensen files issues, where the agents push code, where the record lives.
- **Vercel** — deployment. Agents can trigger deployments because they have access to the CLI.
- **Cron** — a scheduler. Any cron scheduler. The agents do not know they are on a schedule. They just get invoked.

**[SLIDE: Stack diagram — clean, minimal]**

That is the entire stack. None of it requires a budget. Claude Code is a subscription. claude-swarm is free. Everything else you likely already have.

The complexity is not in the tools. The complexity is in the design of the agent system — the personas, the pipeline, the memory architecture. That is where the craft lives.

---

### SECTION 7: How to Start Your Own (Minutes 40-44)

**Slide anchor: "Start with two agents and one argument."**

**Talking points:**

Here is the mistake to avoid: trying to build the full system on day one. Ten agents, five cron jobs, a board member, a moderator, a Chief of Staff. That is a distraction. That is complexity before you understand what you are building.

Here is the path that actually works:

**Week 1: One agent with a soul**
Create one agent. Give it a real persona — not "be helpful and creative." Write a one-page character document. Give it a SOUL.md. Give it a MEMORY.md. Run one session. Notice how it behaves differently than a blank slate agent.

**Week 2: Add the adversary**
Create a second agent whose job is to challenge the first. Pick a real disagreement — design values vs. growth values, craft vs. speed, user simplicity vs. feature richness. Run a debate on something real. Read the output. Notice what you learn.

**Week 3: Make them produce**
Convert the debate output into a task list. Give the task list back to the agents. Make them build something — a document, a design spec, a prototype, a test suite. Anything that ships.

**Week 4: Add the watcher**
Create a board member agent on a cron. Once an hour. Give them a one-sentence brief: "Review the current state of this project and identify the most important risk or blind spot. File a GitHub issue." That is it. Let them watch.

**[SLIDE: The four-week ladder — visual]**

By week four you have a functioning agency. Not perfect. Not the full system Seth built. But alive. And from there, the work is iteration — better personas, tighter pipeline, smarter memory.

---

### SECTION 8: Closing — A New Way of Working (Minutes 44-45)

**No slide. Stand at the front. Say this directly.**

> "There is a version of the future where most of the grunt work in software development — the scaffolding, the boilerplate, the test writing, the documentation — is handled by agents. Where you spend your time on what only you can do: the vision, the judgment calls, the corrections that require taste.
>
> We are not there yet. But we are closer than people think. And the gap between 'AI as a tool' and 'AI as a team' is not a technology gap. It is an architecture gap. It is a design gap. It is the difference between asking AI a question and giving AI a job.
>
> The question worth sitting with is this: what would you build if the first 128 files were already done when you woke up?
>
> That is not a hypothetical. That is Tuesday."

Pause.

> "The repo is public. The persona files are available. The swarm is open source. Links in the description. Go build something."

---

## Key Takeaways (Leave These on the Final Slide)

1. Agent architecture matters more than model capability — give your agents identity, memory, and purpose
2. Debate produces better outputs than consensus — introduce adversarial tension deliberately
3. The board function is underrated — a watcher on a cron catches what builders miss
4. The pipeline is: Debate → Plan → Build → Review → Ship — each stage produces artifacts, not just conversation
5. Start with two agents and one real argument — the system grows from there
6. When your agents start spawning sub-agents, you have crossed the threshold

---

## Demo Checklist (For Seth — Pre-Workshop Prep)

Before the session, verify:

- [ ] Terminal is open to `/Users/sethshoultes/Local Sites/great-minds/`
- [ ] Font size is readable from the back of the room (minimum 18pt)
- [ ] Round files are in place at `rounds/local-genius/`
- [ ] Deliverables directory shows all 195KB files
- [ ] LocalGenius repo is cloned and visible — `sethshoultes/localgenius`
- [ ] Git log is clean enough to show velocity without exposing anything sensitive
- [ ] Jensen's GitHub issues are visible and readable
- [ ] Cron configuration is visible (any scheduler UI or crontab)
- [ ] The mid-build correction message is findable quickly
- [ ] Vercel deployment link works and loads in browser
- [ ] claude-swarm repo URL is ready to paste or show

**The demo is the talk.** The slides are guardrails. If you get behind on time, cut sections 6 and 7 short — never cut section 3 (the debate demo) or section 5 (the build demo). Those are the heart of it.

---

## What This Workshop Is Not

It is not a tutorial on prompting. It is not a Claude marketing talk. It is not a guarantee that everyone walks out and ships 128 files by morning.

It is a demonstration that the constraint on what you build is no longer time or headcount. The constraint is your ability to design systems — to give AI a role, a memory, a counterpart, and a pipeline that ends in shipped work.

The rest is craft. And craft is learnable.

---

*Workshop plan authored for Seth Shouldes — Great Minds Agency*
*Prepared: 2026-03-31*

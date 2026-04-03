# From Idea to 262 Files While You Sleep: Building an AI Agent Swarm with Claude Code

**Subtitle:** How one developer built a fully autonomous multi-agent agency — complete debate system, product deliverables, scaffolded software, two live deployments, and a Claude Code plugin — across a single continuous build.

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
6. How a hybrid AI architecture routes tasks between Claude and Cloudflare Workers AI to keep marginal cost near zero
7. How to package the entire agency as an installable plugin anyone can run
8. A concrete path to starting their own swarm this week

---

## The Opening Hook (Minutes 0-3)

**Do not open with a slide. Open with a number.**

Walk to the front. Say this:

> "262 source files. 576 tests. Two live products. A Claude Code plugin. Nine AI board reviews. While I slept.
>
> Last week I sat down with a vague idea. I wanted to think through a project. I opened Claude Code, typed a few things, and went to sleep.
>
> By morning: 227 app files and 35 site files. 576 passing test specs. Stripe billing wired up. A Meta social integration. A brand guide. A Storybook. A Vercel deployment at localgenius.company. A Cloudflare Pages deployment at localgenius-sites.pages.dev. 133 commits across four repos. GitHub issues filed by an AI board member who had audited the strategy overnight and found blind spots I hadn't seen.
>
> I want to show you exactly how that happened. Not the magic-trick version. The real version — including the wrong turns, the mid-build corrections, and the moment the agents started spawning their own agents."

Beat. Let it land.

> "This is not about prompting better. This is about building differently."

Advance to the first slide.

---

## Minute-by-Minute Breakdown

---

### THE OPENING FLAIR (Minutes 0-2)
**See `workshop-opening.md` for the full second-by-second plan** (designed by Rick Rubin + Jony Ive).

The sequence: Pure black → Marcus Aurelius fades in → Steve Jobs → Elon Musk → Jensen Huang → Margaret Hamilton → Rick Rubin → Jony Ive → Maya Angelou → Sara Blakely → hard cut to black → title card: **"262 files. One night. Nine minds."**

Seth speaks nine words in the first 8 seconds: *"Last Tuesday night, I went to sleep with an idea. I woke up with a product."* Then silence while the personas appear. Each gets one line. The dissolves accelerate like a heartbeat. Music: one sustained note becoming a chord.

The final line before the title card: *"262 files. 734 tests. Two live products. Three live websites. A Claude Code plugin. Sixteen strategic board reviews. While I slept."*

Hard cut to black. Three seconds of silence. Then the title card fades in.

Persona images are at `website/public/personas/*.webp` (optimized, 12-40KB each). Presentation PNGs at `deliverables/persona-images/*.png` (800px wide).

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

- `AGENTS.md` — Who works here. Nine agents listed with their persona, their role, and a pointer to their persona file. Show the Steve Jobs entry. Show Jensen Huang. Show Margaret Hamilton — who joined specifically to hold the system to engineering standards. Show Rick Rubin, Jony Ive, Maya Angelou, Sara Blakely. Show Marcus Aurelius as moderator.

- `MEMORY.md` — The index of persistent memory. Not conversation history — *curated knowledge* that survives between sessions. Show an entry. Explain that agents write to this, and it gets loaded into future conversations.

**[Back to slides]**

This is end-to-end ownership of the agent experience. The soul file, the identity file, the memory file — these are not configuration. They are culture. They are what makes the difference between an agent that drifts and an agent that has a point of view.

The persona files are worth mentioning separately. We pulled deeply researched, 5,000-to-15,000-word persona documents for each character — Steve Jobs, Elon Musk, Marcus Aurelius, Jensen Huang, Margaret Hamilton. Not "be creative and bold like Steve Jobs." Actual philosophy, actual decision-making patterns, actual language. When these agents argue, they argue *in character*. That matters. A Steve Jobs persona that does not push back on your PRD is not useful. It is just flattery.

And by the way — nine distinct personas means nine distinct failure modes you avoid. Margaret Hamilton is not going to let sloppy error handling slide. Sara Blakely is not going to let you ignore the customer's emotional experience. They are not decoration. They are accountability.

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

Show the cron configuration. Show the GitHub issues Jensen filed — all nine of them. Read one title and the first paragraph. The issues are real and specific:

- **Data moat**: Are we building proprietary data, or a commodity wrapper?
- **CUDA playbook**: What is the platform strategy if this scales?
- **Pricing evolution**: The current model does not survive a competitive entrant
- **AI honesty bug**: Cases where the system confidently returns wrong information
- **CORS security**: Cross-origin exposure in the API layer
- **In-memory state bug**: Session data being lost on worker restart

Then say this:

> "I did not ask him to look at any of this. I did not know these were gaps. He found them because he was looking at the whole board, not the specific square I was staring at."

**[Back to slides]**

Nine reviews. Six actionable issues filed. Every one of them real. That is a board. Running on a cron. At essentially zero cost.

The system does not stop when you stop. That is the point.

---

### SECTION 5: From Strategy to Software (Minutes 27-33)

**Slide anchor: "The agents planned the build. Then they built it."**

**Talking points:**

After the debate phase, the agents shifted into planning mode. They were not given a tech stack. They were not given a data model. They reasoned about what LocalGenius needed and produced:

- Technology stack recommendation with rationale
- Full data model
- API design
- Infrastructure documentation

**192 more kilobytes of technical deliverables** before a single line of application code was written.

Then they scaffolded. Then they built. And they kept building.

**[LIVE DEMO — 5 minutes]**

Open the LocalGenius repo. Show the directory tree. Point to the source file count — 262 files. 227 in the app, 35 in the sites layer. Show a few:
- The main app structure
- One of the 576 test spec files
- The Stripe billing integration
- The brand guide file
- The Storybook configuration

Then show the git log. 133 commits across four repos. Not to read every commit — just to show the *velocity*. Show timestamps.

Then: the mid-build correction. Pull up the moment where Seth had to redirect the agents to use a proper directory structure. Read the message he sent. Show that the agents adapted and continued.

> "This is the important part. These are not scripts running in a loop. They are reasoning about the codebase. When I corrected them, they understood the correction."

Then — the moment agents started spawning their own sub-agents. Show a log or a note where an agent decided it needed to spin up a test-writing agent, a seed data agent, a production checklist agent.

> "When your agents start hiring, you have crossed a threshold. They are no longer executing tasks you defined. They are defining tasks you did not think of."

**[Back to slides]**

---

### SECTION 6: Hybrid AI Architecture — Claude for Brains, Cloudflare for Muscle (Minutes 33-36)

**Slide anchor: "Route the task to the right model. Pay nothing extra."**

**Talking points:**

Here is the part most people building AI products get wrong: they use one model for everything. GPT-4 for summarization, for image generation, for transcription, for classification. It is expensive. It is slow in places it does not need to be slow. And it creates a single point of failure.

LocalGenius runs a hybrid architecture. Claude handles the reasoning — strategy, content judgment, conversational depth. Cloudflare Workers AI handles the commodity tasks, and it runs on Cloudflare's global edge network at near-zero marginal cost.

**[SLIDE: AI router diagram — task type → model selection]**

The router decides per task:

- **Voice transcription** → Cloudflare Workers AI Whisper. A restaurant owner holds the mic button, speaks for thirty seconds, and the audio becomes text. No separate service. No API key to manage. It runs on the same infrastructure as the rest of the app.
- **Content drafts** → Llama running on Workers AI. Fast, cheap, good enough for a first pass that Claude then shapes.
- **Image generation** → Stable Diffusion on Workers AI. A business owner describes their storefront; they get an image.
- **Sentiment analysis** → DistilBERT on Workers AI. Lightweight, purpose-built.
- **Complex reasoning and judgment** → Claude. Where it earns its keep.

This is what "voice input" means in practice: you can literally talk to LocalGenius like you would talk to an employee. "Write me a post about our Tuesday special." The app transcribes it, routes it, and responds. That is not a demo feature. That is the primary interface for users who do not want to type.

---

### SECTION 7: Two Live Products (Minutes 36-38)

**Slide anchor: "It shipped."**

**Talking points:**

Here is where this story diverges from most AI demos: it is live. Publicly accessible. Right now.

**[LIVE DEMO — 2 minutes]**

Open the browser. Show both:

- **localgenius.company** — The main application. Vercel deployment. The dashboard, the AI features, the voice input, the social integrations.
- **localgenius-sites.pages.dev** — Emdash, the website builder for LocalGenius customers. Cloudflare Pages deployment. A small business owner can go here and get an AI-generated website for their location.

Two separate products. Two separate deployment pipelines. Both alive.

This is what the agent swarm produced. Not a prototype. Not a mockup. Working software at real URLs that anyone in this room can visit right now.

**[Back to slides]**

---

### SECTION 8: The Scoreboard — Measuring What the Agency Built (Minutes 38-39)

**Slide anchor: "The numbers don't lie."**

**[LIVE DEMO — 1 minute]**

Open `SCOREBOARD.md` in the terminal. Let the audience read it. This is the receipt.

> "This is not a summary I wrote after the fact. This file was updated in real-time by the agents themselves as they worked. Every board review, every QA report, every issue filed and fixed — tracked automatically."

**The numbers on screen:**

| Metric | Count |
|--------|-------|
| Source files | 258+ |
| Test specs | 734 |
| Commits | 180+ |
| Board reviews (Jensen) | 14 |
| QA reports (Margaret) | 14 |
| GitHub issues filed | 9 |
| Issues fixed | 8 |
| Live deployments | 3 |
| Agent personas | 9 |

**Jensen's track record:**

Show the board review table. Every row is a real finding:
- Review #4: AI system prompt was lying to customers about Google updates. Fixed.
- Review #6: In-memory Map loses insight data on every restart. Fixed.
- Review #8: CORS wildcard on voice endpoint — security risk. Fixed.
- Review #13: Telemetry built but not wired to AI callsites. Fixed.

> "Fourteen board reviews. Nine issues. Eight fixed. Every single one found a real problem that a human reviewer would have caught — eventually. Jensen caught them while the team was building. That is the value of a watcher on a cron."

**Margaret's QA reports:**

> "Twelve QA reports. Three P0 bugs caught — broken routing, TypeScript errors, consolidation breaks. All resolved before any user saw them. Ship readiness: GREEN."

**The point:**

The scoreboard is not vanity metrics. It is accountability. When you can see exactly what every agent produced, you can see where the system works and where it doesn't. The agents that produce nothing get replaced. The agents that produce real findings — Jensen, Margaret — earn their place.

> "Show me a human team that produces this level of documentation about its own work. I'll wait."

---

### SECTION 9: The Plugin — Installable Agency (Minutes 39-41)

**Slide anchor: "The agency is now a package."**

**Talking points:**

The last thing we built was the most meta thing we built. We packaged the entire Great Minds agency — the nine agents, the five skills, the hooks, the templates, the pipeline — into a Claude Code plugin that anyone can install on their own machine.

```
npx plugins add sethshouldes/great-minds-plugin
```

That is it. One command. You get:
- Nine fully realized agent personas
- Five skills covering the full debate-to-ship pipeline
- Hook configurations for automated behaviors
- The template library the agents use to produce deliverables

This means everything you have watched in this talk — the debate, the board reviews, the cron jobs, the build pipeline — is not something you have to reconstruct from scratch. You install it. You point it at your PRD. You run it.

The agency is portable. The agency is open.

---

### SECTION 10: The Stack — What You Actually Need to Build This (Minutes 41-43)

**Slide anchor: "The tools are simpler than you think."**

**Talking points:**

People hear a story like this and assume there is some massive infrastructure behind it. A cloud platform, a vector database, an orchestration layer, weeks of setup.

Here is what the actual stack is:

- **Claude Code** — the primary interface. Not an API wrapper. Claude Code can read and write files, run commands, use git. It is an agent runtime.
- **claude-swarm** — Seth's own open-source project. tmux orchestration and git worktrees. Multiple agents running in parallel terminal sessions, sharing a filesystem.
- **Cloudflare Workers AI** — Whisper, Llama, Stable Diffusion, DistilBERT. Near-zero marginal cost at edge.
- **Persona files** — plain markdown. Long, carefully written, loaded into agent context.
- **SOUL.md + AGENTS.md + MEMORY.md** — three plain markdown files. The identity layer.
- **GitHub** — where Jensen files issues, where the agents push code, where the record lives.
- **Vercel** — production deployment. localgenius.company.
- **Cloudflare Pages** — sites deployment. localgenius-sites.pages.dev.
- **Cron** — a scheduler. Any cron scheduler. The agents do not know they are on a schedule. They just get invoked.

**[SLIDE: Stack diagram — clean, minimal]**

That is the entire stack. The complexity is not in the tools. The complexity is in the design of the agent system — the personas, the pipeline, the memory architecture, the AI routing logic. That is where the craft lives.

---

### SECTION 11: How to Start Your Own (Minutes 43-44)

**Slide anchor: "Start with two agents and one argument."**

**Talking points:**

Here is the mistake to avoid: trying to build the full system on day one. Ten agents, five cron jobs, a board member, a moderator, a Chief of Staff, a hybrid AI router, a plugin. That is a distraction. That is complexity before you understand what you are building.

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

Or — install the plugin. Skip the four weeks of setup and start from a running agency.

---

### SECTION 12: Closing — A New Way of Working (Minutes 44-45)

**No slide. Stand at the front. Say this directly.**

> "There is a version of the future where most of the grunt work in software development — the scaffolding, the boilerplate, the test writing, the documentation — is handled by agents. Where you spend your time on what only you can do: the vision, the judgment calls, the corrections that require taste.
>
> We are not there yet. But we are closer than people think. And the gap between 'AI as a tool' and 'AI as a team' is not a technology gap. It is an architecture gap. It is a design gap. It is the difference between asking AI a question and giving AI a job.
>
> The question worth sitting with is this: what would you build if the first 262 files were already done when you woke up?
>
> That is not a hypothetical. That is Tuesday."

Pause.

> "The repos are public. The persona files are available. The swarm is open source. The plugin is installable in one command. Links in the description. Go build something."

---

## Key Takeaways (Leave These on the Final Slide)

1. Agent architecture matters more than model capability — give your agents identity, memory, and purpose
2. *"The debate did not produce compromise. It produced synthesis."* — introduce adversarial tension deliberately
3. *"An intelligence layer that cannot remember what worked is not actually intelligent."* — the board function catches what builders miss
4. Hybrid AI routing lets you use the right model for the right task at near-zero marginal cost
5. The pipeline is: Debate → Plan → Build → Review → Ship — *"Truth serves the work better than ambition."*
6. *"Show me a human team that produces this level of documentation about its own work. I'll wait."*
7. When your agents start spawning sub-agents, you have crossed the threshold

---

## Demo Checklist (For Seth — Pre-Workshop Prep)

Before the session, verify:

- [ ] Terminal is open to `/Users/sethshoultes/Local Sites/great-minds/`
- [ ] Font size is readable from the back of the room (minimum 18pt)
- [ ] Opening flair: 9 persona images loaded in presentation (from `deliverables/persona-images/`)
- [ ] Opening flair: music cue ready (single sustained note — Einaudi/Richter style)
- [ ] Opening flair: rehearsed the 2-minute sequence at least once
- [ ] SCOREBOARD.md is up to date and visible
- [ ] workshop-quotes.md printed or on secondary screen for reference
- [ ] Round files are in place at `rounds/local-genius/`
- [ ] Deliverables directory shows all 195KB strategy files
- [ ] LocalGenius repo is cloned and visible — `sethshouldes/localgenius`
- [ ] Git log shows 133 commits across repos — have the command ready
- [ ] Jensen's GitHub issues are visible and readable — all 9 reviews, 6 issues
- [ ] Cron configuration is visible (any scheduler UI or crontab)
- [ ] The mid-build correction message is findable quickly
- [ ] **localgenius.company** loads in browser (Vercel deployment)
- [ ] **localgenius-sites.pages.dev** loads in browser (Cloudflare Pages deployment)
- [ ] Voice input demo is ready — mic button visible, test it beforehand
- [ ] AI router diagram slide is ready
- [ ] Plugin install command is ready: `npx plugins add sethshouldes/great-minds-plugin`
- [ ] claude-swarm repo URL is ready to paste or show

**The demo is the talk.** The slides are guardrails. If you get behind on time, cut sections 9 and 10 short — never cut section 3 (the debate demo), section 5 (the build demo), or section 7 (the live products). Those are the heart of it.

---

## What This Workshop Is Not

It is not a tutorial on prompting. It is not a Claude marketing talk. It is not a guarantee that everyone walks out and ships 262 files by morning.

It is a demonstration that the constraint on what you build is no longer time or headcount. The constraint is your ability to design systems — to give AI a role, a memory, a counterpart, and a pipeline that ends in shipped work.

The rest is craft. And craft is learnable.

---

*Workshop plan authored for Seth Shouldes — Great Minds Agency*
*Prepared: 2026-03-31 | Updated: 2026-03-31*

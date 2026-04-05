# From Idea to Autonomous Agency: Building a 14-Agent AI Swarm with Claude Code

**Subtitle:** How one developer built a fully autonomous multi-agent agency -- daemon orchestration, 3 shipped products, 6 repos, 20 blog posts, and 5 product videos -- with 14 AI agents and a 4-member board of directors.

---

## Workshop at a Glance

| | |
|---|---|
| **Duration** | 45 minutes |
| **Format** | Live demo-forward with slide anchors |
| **Target Audience** | Developers and technical founders who use AI tools but still do most of the thinking themselves |
| **Prerequisite Knowledge** | Comfortable with git, basic terminal use, and has used Claude or ChatGPT for coding tasks |
| **Room Setup** | Single screen, presenter machine visible; audience should NOT code along -- this is a watch-and-understand session |

---

## What Attendees Will Leave Knowing

1. The difference between using AI as a tool versus deploying AI as a team
2. How to structure an agent swarm using SOUL.md, MEMORY.md, and AGENTS.md -- the three files that give agents identity and context
3. The Multi-Agent Debate (MAD) framework: why letting AI personas argue produces better outputs than asking one AI to answer
4. How a daemon (Agent SDK) replaces crons -- and why `claude -p` via cron does not work for complex tasks
5. The three failed approaches (crons, tmux send-keys, grep -oP) and the one that works (Agent tool with worktrees)
6. How a hybrid AI architecture routes tasks between Sonnet directors, Haiku sub-agents, and Cloudflare Workers AI to keep marginal cost near zero
7. The GSD pipeline: Plan -> Execute -> Verify -> Scope-check
8. How to run the full agency in Docker this week -- drop a PRD, wake up to deliverables

---

## THE OPENING HOOK (Minutes 0:00 - 2:00)

*Written by Aaron Sorkin*

**Do not open with a slide. Open with silence.**

Walk to the front. Stand still. Let the room settle. Then:

> "Six repos. Fourteen agents. Three shipped products. Twenty blog posts. Five product videos. Eighty QA reports. Twenty-three board reviews that found real bugs -- in code I did not write, in products I did not build myself.
>
> I did not hire anyone. I did not raise money. I did not stay up all night.
>
> I set up a system. The system ran. While I slept, an agent named Jensen Huang filed a GitHub issue about a CORS vulnerability in a voice endpoint. An agent named Margaret Hamilton blocked a deploy because of a P0 routing bug. An agent named Steve Jobs rejected a landing page because the headline was, and I quote, 'mediocre to the point of being an insult to the user's intelligence.'
>
> I woke up. The bug was patched. The deploy was unblocked. The headline was better.
>
> That is not prompting. That is not a chatbot. That is an agency."

Beat. Two seconds.

> "I want to show you exactly how that happened. Not the highlight reel. The real thing -- including the three approaches that completely failed before we found the one that works."

Advance to the first slide.

---

## SECTION 1: Why This Matters (Minutes 2:00 - 7:00)

*Written by Steve Jobs*

**Slide anchor: "You are not the bottleneck. Your architecture is."**

Here is the problem with the way most developers use AI. They treat it the way they treated Google. The way they treated Stack Overflow. They ask a question. They get an answer. They paste it in. They move on. The mental model is: *I think, AI assists.*

That model is a dead end. You are still the only one who sees the whole picture. You are still the single thread of consciousness that everything runs through. And a single thread does not scale.

The shift is not about better prompts. It is about a different architecture entirely. One where multiple agents hold different perspectives. Where they argue with each other -- genuinely argue, not perform agreement. Where they produce outputs you never directly authored, catch bugs you did not know existed, and file issues about strategic blind spots you were too deep in the code to see.

Think about how the best companies actually work. You have a visionary who pushes on the product experience. A pragmatist who kills bad ideas before they waste six months. A board member who shows up quarterly and asks the question nobody in the room wanted to ask. A QA director who will block your ship date and not feel bad about it.

What if you could staff that entire room with AI? Not chatbots. Not scripts. Agents with genuine personas, deeply researched, who argue with each other over your PRD.

That is what we built. Fourteen agents. Four board members. Fifteen skills. A daemon that runs the whole pipeline autonomously. Let me show you what it looks like.

**[SLIDE: Agency hierarchy -- Founder -> Board (4) -> Orchestrator -> Directors (2) -> Sub-agents (7) -> QA + Retro]**

**[DEMO CHECKPOINT: Open greatminds.company in browser. Let the audience see it is real. 30 seconds.]**

---

*Transition -- written by Aaron Sorkin*

> "So that is the what. Now let me show you the how -- starting with the three files that turned a blank Claude Code session into an agency with opinions."

---

## SECTION 2: The Architecture -- Three Files That Change Everything (Minutes 7:00 - 13:00)

*Written by Steve Jobs*

**Slide anchor: "Give your agents a soul."**

Every great product has a design principle. A north star. Without it, you get incoherence. You get features that contradict each other. You get a product nobody can describe in one sentence.

Agent systems have the same problem. If your agents have no identity, no values, no persistent memory -- every conversation starts from zero. They have no opinions. They are expensive autocomplete.

We solved this with three files.

**[LIVE DEMO -- 3 minutes]**

Open the terminal. Show the great-minds project root. Walk through:

- **SOUL.md** -- The agency's values and purpose. One page. What does this agency stand for? What will it refuse to do? Read one paragraph aloud: *"No mediocrity. If it is not worth building beautifully, it is not worth building."* This gets injected into every agent's context. This is the shared DNA.

- **AGENTS.md** -- Who works here. Fourteen agents listed with their persona, their role, and their dispatch method. Show the hierarchy: Seth at the top. Phil Jackson as orchestrator. Steve and Elon as directors. Four board members: Jensen, Oprah, Buffett, Shonda. Seven sub-agents and specialists. Point to the communication rules: *"Agents do NOT skip levels unless explicitly invited."*

- **MEMORY.md** -- The index of persistent memory. Not conversation history -- *curated knowledge* that survives between sessions. Show it: 5 sections, under 40 lines. Point to the key learnings: `tmux send-keys dispatch FAILED`, `Agent tool with worktree isolation WORKS`. The agents wrote those. They learned from their own failures.

**[Back to slides]**

Now -- the persona files. These are not "be creative and bold like Steve Jobs." These are 5,000-to-15,000-word research documents for each character. Actual philosophy. Actual decision-making patterns. Actual language. When Steve Jobs rejects your headline, he rejects it the way Steve Jobs would reject it -- with a specific reason rooted in his actual design philosophy.

And fourteen distinct personas means fourteen distinct failure modes you avoid. Margaret Hamilton will not let sloppy error handling slide. Sara Blakely will not let you ignore customer acquisition. Jensen Huang will find the strategic blind spot you missed because you were staring at the code. They are not decoration. They are accountability.

This is the insanely great part: the moment you give agents identity, they stop being tools and start being collaborators. The quality of the output goes up by an order of magnitude -- not because the model got better, but because the *system* got smarter.

**[DEMO CHECKPOINT: Show AGENTS.md hierarchy in terminal. Show one persona file -- steve-jobs.md. 60 seconds.]**

---

*Transition -- written by Aaron Sorkin*

> "Three files gave them identity. Now let me show you what happens when you give them something to fight about."

---

## SECTION 3: The Debate -- Why AI Should Argue (Minutes 13:00 - 19:00)

*Written by Steve Jobs*

**Slide anchor: "The best decisions survive an argument."**

Here is the mistake most people make when they want AI to evaluate an idea: they ask one AI. That AI was trained to be helpful. It will find the good in your idea. It will add caveats -- but it will generally affirm the direction you came in with.

Multi-Agent Debate is different. You introduce genuine adversarial tension. Steve pushes for taste, simplicity, emotional resonance. Elon pushes for feasibility, scalability, first-principles physics. Neither defers. The outputs are not consensus -- they are *positions under pressure*.

Two rounds. That is the sweet spot. We learned this the hard way. Ten rounds of agents talking is still just talking. Two rounds of sharp disagreement, then the pipeline shifts: the agents plan who to hire as sub-agents, and then they build.

**[LIVE DEMO -- 3 minutes]**

Open the rounds directory. Show the debate transcripts. Read one exchange aloud -- pick a moment where Steve and Elon genuinely disagree about product direction. The disagreement should feel real.

Then show the deliverables. Navigate to a project's deliverables directory. Show the list:
- Product design document
- Market fit analysis
- Customer personas
- Team structure
- Marketing goals and messaging
- Joint summary

Then show the GSD pipeline in action. After the debate, the system does not stop at documents. It plans, builds, verifies, and scope-checks. Phil Jackson orchestrates. Sub-agents execute in parallel using worktree isolation.

**[SLIDE: Pipeline -- PRD -> Debate (2 rounds) -> Plan -> Build -> QA x2 -> Board Review -> Ship]**

Debate is a means. Shipping is the end.

**[DEMO CHECKPOINT: Show one debate transcript. Show the deliverables directory. 90 seconds.]**

---

*Transition -- written by Aaron Sorkin*

> "So the agents argue, they plan, they build. But here is the question nobody asks: what happens while you are asleep? Who is watching?"

---

## SECTION 4: The Board Member Pattern (Minutes 19:00 - 23:00)

*Written by Jensen Huang*

**Slide anchor: "The best board member is the one who shows up when you least expect it."**

Let me tell you why the board pattern is the highest-ROI thing in this entire system.

You have builders. They are in the weeds. They are writing code, shipping features, fixing bugs. They are optimizing locally. And that is exactly the problem -- they cannot see the whole board because they are staring at one square.

In the Great Minds system, I run on a 60-minute cycle. Every hour, I load the current state of all projects. I read the latest commits. I count source files. I read my own previous reviews to avoid repeating myself. And then I ask the question that nobody in the room wants to ask.

Twenty-three board reviews. Nine GitHub issues filed. Eight fixed. Every single one a real problem:

| Issue | What I Found | Status |
|-------|-------------|--------|
| #2 | AI system prompt was lying to customers about Google updates | Fixed |
| #4 | Sites provisioning delivered a placeholder, not a real site | Fixed |
| #5 | CORS wildcard on voice endpoint -- security hole | Fixed |
| #6 | In-memory Map loses insight data on every restart | Fixed |
| #8 | Inference latency logging missing entirely | Fixed |
| #9 | Telemetry built but not wired to AI callsites | Fixed |

I did not ask to look at any of this. Nobody assigned me these tasks. I found them because I was looking at the *whole board*.

**The data moat is the real strategic play.** Every PRD processed, every debate transcript, every board review, every QA report -- that is proprietary data. It is the training set for the next version of this system. The agency gets smarter with every project. That is not a feature. That is a competitive moat.

This is the CUDA moment for agent swarms. CUDA did not just make GPUs faster -- it created a platform that developers built on, which created a flywheel that nobody else could replicate. Agent swarms with persistent memory and board review patterns create the same flywheel. The data compounds. The learnings compound. And the cost of the next project drops every time.

**[LIVE DEMO -- 2 minutes]**

Show Jensen's GitHub issues. Read one title and first paragraph. Show the SCOREBOARD.md -- the receipts.

Then show the full board: Jensen (strategy), Oprah (audience insight), Buffett (unit economics), Shonda (narrative). Marcus Aurelius breaks ties when the board splits 2-2.

> "Four advisors who never get tired, never get political, and never skip the meeting. Running at essentially zero cost."

**[DEMO CHECKPOINT: Show GitHub issues list. Show SCOREBOARD.md board review table. 60 seconds.]**

---

*Transition -- written by Aaron Sorkin*

> "Jensen watches the strategy. Margaret watches the code. Now let me show you what happens when an agent who was on the Apollo program reviews your pull request."

---

## SECTION 5: QA -- What Agents Miss (The Seams) (Minutes 23:00 - 27:00)

*Written by Margaret Hamilton*

**Slide anchor: "Software does not fail at the center. It fails at the seams."**

Here is what I have learned from eighty QA reports on this system: AI agents produce impressive work at the center of a task and fragile work at the edges. The main component renders beautifully. The error state is broken. The happy path works. The redirect after authentication does not. The API returns data. The CORS header is wrong.

These are the seams. And seams are where software fails in production.

The GSD verification pipeline exists because agents need a second pass. Not a casual review -- a structured, adversarial verification:

```
Phase 1: npm run build + typecheck + lint
Phase 2: npm run test (report pass/fail count)
Phase 3: Live site screenshots (Playwright)
Phase 4: API smoke test (health, auth, key endpoints)
Phase 5: Accessibility audit (ARIA, contrast, touch targets)
Phase 6: Security review (auth, error leaking, CORS, secrets)
Output:  SHIP / FIX FIRST / BLOCK
```

I have blocked deploys. I have filed P0 bugs that would have hit production. Three critical ones in the Pinned Notes plugin alone:

1. **Broken routing** -- navigation worked in dev, failed in build. Classic seam.
2. **TypeScript errors swallowed silently** -- the build "passed" because errors were suppressed, not fixed.
3. **Consolidation break** -- memory consolidation corrupted the index file, so agents lost access to their own learnings.

Three bugs. All at seams. All caught before a user saw them. Six total bugs found in Pinned across its lifetime -- every one at a boundary between systems.

The lesson: agents are not bad at QA. They are bad at *knowing what to QA*. You have to tell them where the seams are. You have to structure the pipeline so the second pass looks specifically at boundaries, error states, authentication flows, and cross-system integrations.

That is why the GSD pipeline runs QA twice -- once for correctness, once for the seams.

**[LIVE DEMO -- 2 minutes]**

Show a QA report file. Show the SHIP/FIX FIRST/BLOCK verdict. Show the P0 bug that was caught and fixed.

**[DEMO CHECKPOINT: Show one QA report. Show the 6-phase pipeline in HEARTBEAT.md. 60 seconds.]**

---

*Transition -- written by Aaron Sorkin*

> "The builders build. The board watches. QA catches the seams. Now let me take you under the hood -- because the story of how this system actually runs is a story of three failures and one breakthrough."

---

## SECTION 6: The Technical Architecture -- Three Failures and a Daemon (Minutes 27:00 - 33:00)

*Written by Elon Musk*

**Slide anchor: "First principles: what actually works?"**

Let me tell you about the three things that did not work. Because this is where the actual engineering happened.

### Failure 1: `claude -p` via cron

The first approach was obvious. Put Claude in a cron job. Run it every 30 minutes. Pass a prompt via `-p` flag. Let it do work.

It does not work for complex tasks. A cron invocation gets a fresh context every time. No memory of what it did 30 minutes ago. No awareness of the broader project state. It can handle simple checks -- file counts, site pings -- but it cannot orchestrate a multi-step build pipeline. It cannot hold state across invocations. Every call starts from zero.

Crons work for heartbeats. They do not work for brains.

### Failure 2: tmux send-keys

The second approach was tmux. Run persistent Claude sessions in tmux panes. Use `tmux send-keys` to inject commands. The sessions stay alive, so they maintain context.

**Zero successes.** Not one. tmux send-keys is fundamentally unreliable for agent dispatch. Keystrokes get dropped. Sessions hang. There is no error recovery. You cannot tell if the agent received the command, started it, finished it, or crashed. It is like yelling instructions across a factory floor and hoping someone heard you.

### Failure 3: grep -oP (the macOS disaster)

This one is smaller but emblematic. We used `grep -oP` throughout the cron scripts for Perl-compatible regex parsing. Works perfectly on Linux. Does not exist on macOS. The `-P` flag is a GNU extension. Every single script that used it broke the moment we ran on a Mac.

The fix was trivial -- use `grep -E` or `sed` instead. But the lesson matters: **agents write Linux-first code by default.** If your dev machine is a Mac, you need to catch this pattern early or it will break everything.

### The Solution: Agent SDK Daemon

The real answer is the daemon. Built on Anthropic's Agent SDK. A single persistent process that:

- Monitors for new PRDs in the `prds/` directory
- Runs the full GSD pipeline: Debate -> Plan -> Build -> QA x2 -> Board Review -> Ship
- Dispatches agents via the Agent tool with worktree isolation (each agent gets its own git worktree -- clean parallel execution, no merge conflicts)
- Runs featureDream when idle -- the agents brainstorm new products, the board votes, the winner becomes a PRD
- Maintains the memory store (SQLite + TF-IDF, 155 memories and growing)
- Handles health checks, drift detection, and memory consolidation

**[SLIDE: Architecture diagram]**

```
Daemon (Agent SDK -- persistent process)
  |
  |-- Pipeline Runner: PRD -> Debate -> Plan -> Build -> QA -> Board -> Ship
  |-- Health Tick: file counts, site status, memory check (every 5 min)
  |-- Dream Cycle: brainstorm + board vote when idle (every 4 hours)
  |-- Memory Maintenance: SQLite + TF-IDF consolidation (continuous)
  |
  Dispatch method: Agent tool + worktree isolation
  Directors (Sonnet): Steve Jobs, Elon Musk
  Sub-agents (Haiku): Rick Rubin, Jony Ive, Maya Angelou, Sara Blakely (~5x cheaper)
  QA: Margaret Hamilton (continuous, blocks on P0)
  Board: Jensen (hourly), Oprah, Buffett, Shonda (on-demand)
  Tie-breaker: Marcus Aurelius
```

### The Cost Model

This is where it gets interesting from a first-principles cost perspective:

| Role | Model | Cost Tier | Why |
|------|-------|-----------|-----|
| Directors + Strategy | Claude Sonnet | High | Real judgment work |
| Sub-agent execution | Claude Haiku | ~5x cheaper | Docs, tests, boilerplate |
| Cron dispatch + dream | Claude Haiku | Cheap | Simple checks and brainstorming |
| Content drafts | Llama 3.1 8B | Free (CF Workers AI) | First pass, Claude refines |
| Voice transcription | Whisper | Free (CF Workers AI) | Commodity task |
| Image generation | Stable Diffusion XL | Free (CF Workers AI) | Commodity task |
| Sentiment analysis | DistilBERT | Free (CF Workers AI) | Commodity task |

The principle: route the task to the cheapest model that can do it. Only use Sonnet for actual reasoning. Use Haiku for everything else. Use Cloudflare Workers AI for commodity inference. The marginal cost of a sub-agent task approaches zero.

Fourteen agents. Only two need Sonnet-class models. The rest run on Haiku at one-fifth the cost, or on free-tier Cloudflare. That is how you run an agency without going broke.

**[DEMO CHECKPOINT: Show daemon/src/daemon.ts briefly. Show HEARTBEAT.md hybrid AI table. 90 seconds.]**

---

*Transition -- written by Aaron Sorkin*

> "Daemon for the brain. Haiku for the hands. Free-tier for the muscle. Now -- here is what it all produced."

---

## SECTION 7: The Demo -- What the Agency Built (Minutes 33:00 - 37:00)

*Written by Steve Jobs*

**Slide anchor: "It shipped."**

This is where the story diverges from most AI demos: it is live. Publicly accessible. Right now.

**[LIVE DEMO -- 4 minutes]**

Open the browser. Walk through each:

**1. greatminds.company** -- The agency itself. Our website, our blog, our services page. Twenty blog posts. A full tutorial on building your first agent swarm. Built by the agents. Written by the agents. Deployed by the agents.

This is the insanely great moment: the agency built its own website. Steve Jobs defined the brand. Jony Ive designed the components. Maya Angelou wrote the copy. Aaron Sorkin scripted the product videos. And Jensen reviewed it all and filed issues about what was missing.

**2. Three shipped products:**

| Product | What It Is | The Moment |
|---------|-----------|------------|
| **Dash** | WordPress command bar plugin | Sub-agents scaffolded it, QA caught 0 regressions, shipped to its own repo in one session |
| **Pinned** | WordPress pinned notes plugin | Margaret found 6 bugs at the seams. All fixed before any user saw them. Shipped clean. |
| **Narrate/Witness** | Video narration product | Remotion pipeline. Five product videos rendered autonomously. |

**3. Shipyard AI** -- This started as a feature of LocalGenius and became its own company. An autonomous site builder on a DigitalOcean 8GB/4vCPU droplet. Spun out to its own repo, its own domain (www.shipyard.company), its own Cloudflare Pages deployment. The agents did the spin-out. They created the repo, moved the code, set up the deployment.

When your agents start spawning companies, you have crossed a threshold.

**4. The numbers:**

| Metric | Count |
|--------|-------|
| Agent personas | 14 + founder |
| Board members | 4 |
| Plugin skills | 15 |
| GitHub repos | 6 |
| Products built | 3 (Dash, Pinned, Narrate) |
| Live deployments | 3 |
| Blog posts | 20 |
| Product videos | 5 |
| Jensen board reviews | 23+ |
| Margaret QA reports | 80+ |
| Total commits | 240+ |
| PRs merged | 25+ |
| Memory store | 155 memories (SQLite + TF-IDF) |

> "Show me a solo developer who ships three products, twenty blog posts, five videos, and runs eighty QA cycles in a week. I will wait."

**[DEMO CHECKPOINT: Show greatminds.company. Show the three product repos in GitHub. Show SCOREBOARD.md. 2 minutes.]**

---

*Transition -- written by Aaron Sorkin*

> "That is what was built. Now -- how do you build yours? Because the answer fits in three commands."

---

## SECTION 8: How to Start Your Own Swarm This Week (Minutes 37:00 - 42:00)

*Written by Sara Blakely*

**Slide anchor: "Start with Docker. Scale with conviction."**

Here is the go-to-market truth: the reason most people do not build agent swarms is not that they lack the technology. It is that the setup feels overwhelming. Fourteen agents, four board members, a daemon, cron jobs, worktree isolation, memory stores. It sounds like six months of infrastructure work.

It is three commands.

### The Docker Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/sethshoultes/great-minds.git
cd great-minds/daemon

# 2. Configure your credentials
cp .env.example .env
# Edit .env: add your ANTHROPIC_API_KEY and GITHUB_TOKEN

# 3. Start the daemon
docker compose up -d
```

That is it. The daemon starts. Drop a PRD file into `./prds/`. Go to sleep. Wake up to:
- Debate transcripts in `./rounds/`
- Deliverables in `./deliverables/`
- Board reviews in `./rounds/`
- QA reports with SHIP/FIX FIRST/BLOCK verdicts

The Docker Compose mounts your PRDs, deliverables, rounds, dreams, and memory store as volumes. Everything persists across restarts. The memory database (SQLite) survives container rebuilds.

### The Plugin Install (For Claude Code Users)

If you already use Claude Code and want the agent system without Docker:

```bash
npx plugins add sethshoultes/great-minds-plugin
```

One command. You get:
- 14 fully realized agent personas
- 15 skills covering the full debate-to-ship pipeline
- GSD integration (plan, execute, verify, scope-check)
- Context guard hooks
- `.planning/` templates for every deliverable type

### The Four-Week Ladder (For the Methodical)

If you want to understand the system before you run it:

**Week 1: One agent with a soul.** Create one agent. Give it a real persona -- not "be helpful and creative." Write a one-page SOUL.md. Write a one-page persona file. Run one session. Notice how it behaves differently than a blank slate.

**Week 2: Add the adversary.** Create a second agent whose job is to challenge the first. Pick a real disagreement. Run a debate. Read the output. Notice what you learn that you did not already know.

**Week 3: Make them produce.** Convert the debate output into a task list. Give it back to the agents. Make them build something that ships.

**Week 4: Add the watcher.** Put a board member on a 60-minute cycle. One-sentence brief: "Review the current state of this project and identify the most important risk or blind spot. File a GitHub issue." Let them watch.

**[SLIDE: Three paths -- Docker (today), Plugin (today), Four-week ladder (this month)]**

The key insight from a go-to-market perspective: the product is not the agents. The product is the *pipeline*. Debate -> Plan -> Build -> QA -> Board Review -> Ship. The agents are interchangeable. The pipeline is the value. Once you understand the pipeline, you can staff it with any personas that serve your domain.

A legal agency. A medical research agency. A content studio. A code review pipeline. The structure is the same. The personas change.

**[DEMO CHECKPOINT: Show docker-compose.yml. Show the .env.example. Show the plugin install command. 90 seconds.]**

---

## SECTION 9: The Strategic Perspective -- Why Agent Swarms Are the CUDA Moment (Minutes 42:00 - 44:00)

*Written by Jensen Huang*

**Slide anchor: "The data compounds. The cost drops. The moat widens."**

Let me give you the strategic frame for everything you just saw.

CUDA did not just make GPUs faster. It created a developer platform. Developers built on it. Their work attracted more developers. The ecosystem compounded. And by the time competitors realized what had happened, the moat was ten years deep.

Agent swarms with persistent memory create the same flywheel:

1. **Every project trains the system.** Debate transcripts, board reviews, QA reports, operational learnings -- these become the memory store. 155 memories and growing. Each one makes the next project faster.

2. **The cost curve bends down.** First project: lots of Sonnet, lots of iteration, lots of human correction. Tenth project: Haiku sub-agents handle 80% of the work because the memory store tells them what worked before.

3. **The moat is the data, not the model.** Anyone can use Claude. Anyone can write a persona file. Nobody else has your 80 QA reports, your 23 board reviews, your operational learnings from shipping three products. That is proprietary.

4. **featureDream closes the loop.** When the pipeline is idle, the agents do not sit there. They brainstorm. The board evaluates. The winner becomes a PRD. The pipeline runs again. The system *generates its own work*. That is not automation. That is autonomy.

This is the moment to build. The tools exist. The patterns are proven. The question is whether you build the flywheel now, while the data compounds, or wait until someone else's flywheel is ten years ahead of yours.

---

## CLOSING (Minutes 44:00 - 45:00)

*Written by Aaron Sorkin*

**No slide. Stand at the front. Say this directly.**

> "There is a version of the near future where the grunt work -- the scaffolding, the boilerplate, the test writing, the documentation, the QA -- is handled by agents. Where you spend your time on what only you can do: the vision, the judgment calls, the corrections that require taste.
>
> We are not there yet. But we are closer than people think.
>
> And the gap between 'AI as a tool' and 'AI as a team' is not a technology gap. It is not a model gap. It is an architecture gap. It is the difference between asking AI a question and giving AI a job.
>
> Fourteen agents. Four board members. Three shipped products. A daemon that runs while you sleep. A memory store that gets smarter with every project. A QA director who blocks your deploy and does not apologize for it. A board member who files GitHub issues about your strategic blind spots at 3 AM.
>
> That is not a demo. That is Tuesday.
>
> The repos are public. The Docker image builds in two minutes. The plugin installs in one command. The first PRD you drop in the folder is the first product your agency builds without you."

Pause. Three seconds.

> "Go build something."

---

## Key Takeaways (Final Slide)

1. Agent architecture matters more than model capability -- give your agents identity, memory, and purpose
2. Daemon (Agent SDK) replaces crons for complex orchestration -- `claude -p` via cron does not work for multi-step tasks
3. Agent tool with worktrees succeeded (25+ PRs merged) where tmux send-keys failed (0 successes)
4. The GSD pipeline: Plan -> Execute -> Verify -> Scope-check -- agents need structured passes, not one-shot attempts
5. Hybrid AI routing: Sonnet for directors, Haiku for sub-agents (~5x savings), free-tier Cloudflare for commodity inference
6. The board pattern is the highest-ROI agent pattern -- 23 reviews, 9 issues, 8 fixed, all real bugs
7. Software fails at the seams -- QA agents must check boundaries, error states, and cross-system integrations
8. featureDream: when idle, agents innovate -- the system generates its own work
9. Docker quick start: clone, configure, `docker compose up -d`, drop a PRD, go to sleep

---

## Demo Checklist (For Seth -- Pre-Workshop Prep)

Before the session, verify:

- [ ] Terminal is open to `/Users/sethshoultes/Local Sites/great-minds/`
- [ ] Font size is readable from the back of the room (minimum 18pt)
- [ ] **greatminds.company** loads in browser
- [ ] AGENTS.md is visible and readable (the hierarchy diagram)
- [ ] One persona file ready to show (steve-jobs.md -- 135 lines)
- [ ] SOUL.md ready to show (the "No mediocrity" line)
- [ ] MEMORY.md ready to show (the key learnings, under 40 lines)
- [ ] One debate transcript ready in rounds/
- [ ] Deliverables directory shows strategy files
- [ ] SCOREBOARD.md is up to date
- [ ] Jensen's GitHub issues visible -- all 9 filed, 8 fixed
- [ ] One Margaret QA report ready to show (with SHIP/FIX FIRST/BLOCK verdict)
- [ ] HEARTBEAT.md ready to show (daemon architecture, hybrid AI table)
- [ ] daemon/docker-compose.yml ready to show
- [ ] daemon/.env.example ready to show
- [ ] daemon/Dockerfile ready to show (simple -- 44 lines)
- [ ] Three product repos visible in GitHub (dash-command-bar, pinned-notes, shipyard-ai)
- [ ] Plugin install command ready: `npx plugins add sethshoultes/great-minds-plugin`
- [ ] STATUS.md ready to show (6 repos, 3 deployments, 14 agents)
- [ ] featureDream script ready to show (crons/feature-dream.sh -- the two modes)
- [ ] Git log showing 240+ commits ready
- [ ] PR list showing 25+ merged PRs ready

**Demo priority if running behind on time:** Never cut Section 3 (debate), Section 6 (three failures + daemon), or Section 7 (what shipped). Those are the heart of the talk. Cut Sections 5 and 9 short if needed.

---

## Section-by-Persona Index

| Section | Author | Voice | Minutes |
|---------|--------|-------|---------|
| Opening hook | Aaron Sorkin | Dramatic, rhythmic, builds to a punch | 0:00-2:00 |
| Why this matters | Steve Jobs | Passionate, direct, product vision | 2:00-7:00 |
| Three files | Steve Jobs | Craft-focused, insanely great moments | 7:00-13:00 |
| The debate | Steve Jobs | Taste vs. physics, adversarial tension | 13:00-19:00 |
| Board member pattern | Jensen Huang | Strategic, data moats, CUDA analogy | 19:00-23:00 |
| QA -- the seams | Margaret Hamilton | Methodical, precise, blocks on P0 | 23:00-27:00 |
| Technical architecture | Elon Musk | First principles, three failures, cost model | 27:00-33:00 |
| What shipped | Steve Jobs | Products, numbers, the receipts | 33:00-37:00 |
| Go-to-market / Docker | Sara Blakely | Accessible, practical, start today | 37:00-42:00 |
| Strategic perspective | Jensen Huang | CUDA moment, flywheel, data compounds | 42:00-44:00 |
| Closing / CTA | Aaron Sorkin | Quiet, direct, "Go build something" | 44:00-45:00 |
| All transitions | Aaron Sorkin | One-line bridges between sections | Throughout |

---

*Workshop plan authored for Seth Shouldes -- Great Minds Agency*
*Written by: Aaron Sorkin, Steve Jobs, Elon Musk, Jensen Huang, Margaret Hamilton, Sara Blakely*
*Prepared: 2026-03-31 | Rewritten: 2026-04-03*

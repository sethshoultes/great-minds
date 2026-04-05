# Great Minds Agency -- The Movie

**Runtime:** ~4:00
**Voice:** OpenAI TTS "onyx" -- deep, measured, professional
**Render:** Remotion
**Music:** Minimal electronic ambient, builds across acts. No drums until Act 3.

---

## ACT 1 -- THE IDEA

**Target: 0:00 - 0:40**

---

### Scene 1: The Question

**Time:** 0:00 - 0:18

**Visual:** Black screen. Hold for two beats. Then a single line of white text fades in, centered, monospaced:

> What happens when Steve Jobs and Elon Musk disagree about your product?

Beneath it, a thin horizontal rule draws itself left to right.

**Audio/VO:** *(silence for 2 seconds, then:)*

"What happens when Steve Jobs and Elon Musk disagree about your product? Most people use AI the way they used Google -- one model, one opinion, no friction. One of our board members called the whole thing a hobby. But first, let me show you what friction built."

**Motion:** Text holds. No movement. The stillness is deliberate.

**Assets:** None. Pure typography on black.

---

### Scene 2: The Premise

**Time:** 0:18 - 0:40

**Visual:** The question text dissolves. Two persona portraits fade in side by side -- `steve-jobs.png` on the left, `elon-musk.png` on the right. Between them, a subtle VS glow. Below, the text:

> Not one AI doing everything. A team of specialists who argue.

After 4 seconds, the portraits slide apart and a full grid of all 10 persona images tiles in behind them (3 rows, staggered): `jensen-huang.png`, `margaret-hamilton.png`, `rick-rubin.png`, `jony-ive.png`, `maya-angelou.png`, `sara-blakely.png`, `marcus-aurelius.png`, `seth-shoultes.png`. The grid breathes -- a slow, subtle scale pulse.

**Audio/VO:**

"What if you didn't ask one AI for an answer? What if you staffed a room -- a visionary, a pragmatist, a board of directors, a QA director who will block your deploy and not apologize for it -- and made them build something together?"

**Motion:** Portraits fade in with a 0.3s stagger. Grid tiles with a cascading reveal, top-left to bottom-right.

**Assets:** `steve-jobs.png`, `elon-musk.png`, `jensen-huang.png`, `margaret-hamilton.png`, `rick-rubin.png`, `jony-ive.png`, `maya-angelou.png`, `sara-blakely.png`, `marcus-aurelius.png`, `seth-shoultes.png`

---

## ACT 2 -- THE BUILD

**Target: 0:40 - 2:10**

---

### Scene 3: The Debate Framework

**Time:** 0:40 - 1:10

**Visual:** Clean dark background. An animated pipeline diagram draws itself, node by node:

```
PRD --> Debate (2 rounds) --> Plan --> Build --> QA x2 --> Board Review --> Ship
```

Each node is a rounded rectangle that lights up as the VO mentions it. When "Debate" lights, cut to a side-by-side split: Steve's portrait on the left with a quote bubble -- *"Is this insanely great?"* -- and Elon's on the right -- *"Does physics allow this?"*

Below the pipeline, a third portrait fades in: `rick-rubin.png` with the label **"Rick Rubin -- strips to essence."**

**Audio/VO:**

"The pipeline starts with a debate. Steve stakes design. Elon stakes architecture. Two rounds of genuine disagreement -- not performed consensus, real positions under pressure. Then Phil Jackson orchestrates the build. Rick Rubin strips every deliverable to its essence. And the agents ship."

**Motion:** Pipeline nodes draw left-to-right with a 0.5s delay between each. Quote bubbles type on character by character. Rick Rubin portrait fades in from below.

**Assets:** `steve-jobs.png`, `elon-musk.png`, `rick-rubin.png`

---

### Scene 4: The Products

**Time:** 1:10 - 1:40

**Visual:** The pipeline diagram slides up and off-screen. Three product cards fly in from the bottom and arrange in a row:

**Card 1 -- Dash**
- Screenshot: `dash-screenshot.png`
- Label: "Cmd+K for WordPress. 26KB. Zero dependencies."

**Card 2 -- Pinned**
- Screenshot: `pinned-dashboard.png`
- Label: "Sticky notes in wp-admin. Five colors. @mentions."

**Card 3 -- Narrate**
- No screenshot -- use the `logo-combined.webp` mark with the text "Video narration. Remotion pipeline. Aaron Sorkin writes the scripts."

Each card has a subtle drop shadow and a thin accent border. When a card is mentioned in the VO, it scales up 5% and the others dim slightly.

**Audio/VO:**

"These are not mockups. Dash is a command palette for WordPress -- press Cmd+K, find anything in under fifty milliseconds. Pinned is sticky notes inside your admin dashboard. Narrate turns agent-written scripts into rendered product videos. All shipped. All live. All built by agents."

**Motion:** Cards fly in with spring physics (slight overshoot, settle). Active card scales up; inactive cards desaturate 20%.

**Assets:** `dash-screenshot.png`, `pinned-dashboard.png`, `logo-combined.webp`

---

### Scene 5: The Board

**Time:** 1:40 - 2:10

**Visual:** Product cards slide off left. Four portrait circles arrange in a semicircle, boardroom style:

- `jensen-huang.png` -- label: "What's the data moat?"
- A placeholder circle with "O" for Oprah -- label: "Who is this really for?"
- A placeholder circle with "W" for Buffett -- label: "What are the unit economics?"
- A placeholder circle with "S" for Shonda -- label: "Does the story hold?"

Below, a scoreboard counter animates up:

> 23 board reviews. 9 GitHub issues filed. 8 fixed.

At the end, a quote card appears, lightly styled:

> "Warren Buffett called our plugin a hobby. He was right. We shipped it anyway."

**Audio/VO:**

"Every product goes through the board. Jensen Huang asks about moats. Oprah asks who it actually serves. Buffett asks if the economics work. Shonda asks if the story holds together. Twenty-three reviews. Nine GitHub issues filed -- real bugs, real vulnerabilities, real strategic blind spots. All found by agents who were never assigned to look."

*(beat)*

"Remember that board member who called it a hobby? That was Warren Buffett. He was right. We shipped it anyway."

**Motion:** Portraits fade in with a 0.4s stagger. Counters animate with an easing curve over 1.5 seconds. Quote card fades in last, held for 3 seconds.

**Assets:** `jensen-huang.png`

---

## ACT 3 -- THE SYSTEM

**Target: 2:10 - 3:25**

---

### Scene 6: Three Failures

**Time:** 2:10 - 2:40

**Visual:** Dark background. Three cards appear stacked vertically, each with a red X and a failure label:

1. **cron + `claude -p`** -- "Fresh context every call. Dropped steps. No memory."
2. **tmux send-keys** -- "Zero successes. Keystrokes dropped. Sessions hung."
3. **grep -oP on macOS** -- "GNU flag. BSD system. Every script broke."

Each card slides in from the right, pauses, then gets a red strikethrough animation.

After all three, a green checkmark draws itself, and a new card slides in from below:

4. **Agent SDK Daemon** -- "One persistent process. Watches for PRDs. Runs the full pipeline. Never forgets."

**Audio/VO:**

"But before any of that worked -- let me tell you about the three things that did not. Cron jobs with Claude's pipe mode dropped steps silently -- a ten-step plan would execute six. tmux send-keys had a zero percent success rate. And grep's Perl flag does not exist on macOS, which broke every script we wrote."

*(pause)*

"The answer was a daemon. One persistent process, built on Anthropic's Agent SDK. It watches for work. It dispatches agents into isolated git worktrees. It never starts from zero."

**Motion:** Failure cards slide in sequentially with 0.8s gaps. Red strikethrough animates left-to-right. Green checkmark draws with a satisfying snap. Daemon card rises from bottom with a slight glow.

**Assets:** None -- typography and iconography only.

---

### Scene 7: The Architecture

**Time:** 2:40 - 3:05

**Visual:** An architecture diagram builds itself on screen:

```
Daemon (Agent SDK)
  |
  |-- Pipeline: PRD -> Debate -> Plan -> Build -> QA -> Board -> Ship
  |-- Health Tick: every 5 minutes
  |-- featureDream: brainstorm + board vote when idle
  |-- Memory: SQLite + TF-IDF (155 memories)
  |
  Dispatch: Agent tool + worktree isolation
  Directors (Sonnet) --> Sub-agents (Haiku, ~5x cheaper)
  Commodity tasks --> Cloudflare Workers AI (free)
```

As "featureDream" is mentioned, the node pulses with a soft blue glow.

Below the diagram, the Shipyard card appears: `shipyard-homepage.png` screenshot with the label **"Shipyard AI -- a company the daemon invented while we slept."**

**Audio/VO:**

"The daemon runs the full pipeline autonomously. But when it has nothing to build, it does not idle. Every four hours it enters featureDream -- brainstorming new products, running them past the board, turning the winner into a PRD. Shipyard AI was born from a dream cycle. The daemon literally invented a company overnight."

**Motion:** Diagram nodes draw top-down with connecting lines animating between them. featureDream node pulses. Shipyard screenshot slides in from the right.

**Assets:** `shipyard-homepage.png`

---

### Scene 8: The Cost Model

**Time:** 3:05 - 3:25

**Visual:** A clean table animates row by row:

| Role | Model | Cost |
|------|-------|------|
| Directors + Strategy | Claude Sonnet | High |
| Sub-agent execution | Claude Haiku | ~5x cheaper |
| Voice / Image / Sentiment | Cloudflare Workers AI | Free |

Below: the Great Minds website homepage screenshot (`gm-homepage.png`) with stats overlaid:

> 7 repos. 14 agents. 15 skills. 3 live products. 240+ commits. 25+ PRs merged.

**Audio/VO:**

"Fourteen agents. Only two need the expensive model. The rest run on Haiku at a fifth the cost, or on Cloudflare's free tier. Seven repos. Three live products. Two hundred forty commits. Twenty-five pull requests merged. Eighty QA reports. All from a system that costs less to run than a single junior developer."

**Motion:** Table rows slide in from left with 0.3s stagger. Stats counter animates number by number. Website screenshot has a subtle parallax drift.

**Assets:** `gm-homepage.png`

---

## ACT 4 -- THE FUTURE

**Target: 3:25 - 4:00**

---

### Scene 9: The Receipts

**Time:** 3:25 - 3:42

**Visual:** A mosaic of everything the agency built tiles across the screen -- six panels in a 3x2 grid, each a real screenshot:

| `gm-homepage.png` | `gm-services.png` | `gm-work.png` |
| `gm-team.png` | `localgenius-homepage.png` | `shipyard-homepage.png` |

The grid holds for a beat, then slowly zooms out to reveal it is just one output of the pipeline. The pipeline diagram from Scene 3 appears faintly behind it, with the "Ship" node glowing.

**Audio/VO:**

"Drop a PRD. Walk away. The daemon picks it up, runs the debate, hires sub-agents, builds the deliverables, runs QA twice, sends it to the board, and ships. You review the output."

**Motion:** Grid tiles in with a 0.2s cascading stagger. Slow zoom-out over 4 seconds. Pipeline fades in at 30% opacity behind the grid.

**Assets:** `gm-homepage.png`, `gm-services.png`, `gm-work.png`, `gm-team.png`, `localgenius-homepage.png`, `shipyard-homepage.png`

---

### Scene 10: The Close

**Time:** 3:42 - 4:00

**Visual:** Everything fades to black. Hold for 2 seconds. Then the Great Minds logo (`logo-combined.webp`) fades in, centered. Below it, a single line:

> "We built a team that never sleeps. Now we're teaching it to dream."

Hold for 4 seconds. Then the logo and tagline fade, replaced by:

> greatminds.company
>
> github.com/sethshoultes/great-minds

**Audio/VO:**

"We built a team that never sleeps. Now we are teaching it to dream."

*(4 seconds of silence with ambient music resolving)*

**Motion:** Logo fades in over 1 second with a gentle scale from 95% to 100%. Tagline fades in 0.5 seconds after the logo. URL cards fade in together after tagline fades out.

**Assets:** `logo-combined.webp`

---

## Production Notes

### Asset Checklist

| Asset | Location | Used In |
|-------|----------|---------|
| `steve-jobs.png` | `deliverables/persona-images/` | Scenes 2, 3 |
| `elon-musk.png` | `deliverables/persona-images/` | Scenes 2, 3 |
| `jensen-huang.png` | `deliverables/persona-images/` | Scenes 2, 5 |
| `margaret-hamilton.png` | `deliverables/persona-images/` | Scene 2 |
| `rick-rubin.png` | `deliverables/persona-images/` | Scenes 2, 3 |
| `jony-ive.png` | `deliverables/persona-images/` | Scene 2 |
| `maya-angelou.png` | `deliverables/persona-images/` | Scene 2 |
| `sara-blakely.png` | `deliverables/persona-images/` | Scene 2 |
| `marcus-aurelius.png` | `deliverables/persona-images/` | Scene 2 |
| `seth-shoultes.png` | `deliverables/persona-images/` | Scene 2 |
| `dash-screenshot.png` | `deliverables/dash-video/public/` | Scene 4 |
| `pinned-dashboard.png` | `deliverables/pinned-video/public/` | Scene 4 |
| `gm-homepage.png` | `deliverables/greatminds-movie/screenshots/` | Scenes 8, 9 |
| `gm-services.png` | `deliverables/greatminds-movie/screenshots/` | Scene 9 |
| `gm-work.png` | `deliverables/greatminds-movie/screenshots/` | Scene 9 |
| `gm-team.png` | `deliverables/greatminds-movie/screenshots/` | Scene 9 |
| `localgenius-homepage.png` | `deliverables/greatminds-movie/screenshots/` | Scene 9 |
| `shipyard-homepage.png` | `deliverables/greatminds-movie/screenshots/` | Scenes 7, 9 |
| `logo-combined.webp` | `website/public/` | Scenes 4, 10 |

### Missing Assets (Need to Capture)

- Oprah Winfrey persona image (referenced in Scene 5 as placeholder)
- Warren Buffett persona image (referenced in Scene 5 as placeholder)
- Shonda Rhimes persona image (referenced in Scene 5 as placeholder)
- Phil Jackson persona image (mentioned in VO but not displayed)
- Shipyard logo (`logo.png`) -- not found in repo, use screenshot instead
- Aaron Sorkin persona image (mentioned in VO but not displayed)

### Audio

- **Voice:** OpenAI TTS, voice "onyx"
- **Music:** Ambient electronic. No percussion until 2:10 (Act 3). Resolve to silence at 3:50.
- **Mix:** VO at -6dB, music at -18dB during narration, -12dB during visual-only beats.

### Timing Summary

| Act | Scenes | Duration | Cumulative |
|-----|--------|----------|------------|
| Act 1 -- The Idea | 1-2 | 0:40 | 0:40 |
| Act 2 -- The Build | 3-5 | 1:30 | 2:10 |
| Act 3 -- The System | 6-8 | 1:15 | 3:25 |
| Act 4 -- The Future | 9-10 | 0:35 | 4:00 |
| **Total** | **10 scenes** | **4:00** | |

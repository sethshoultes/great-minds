# IGNITE — Build Your Idea with Great Minds

**Your idea deserves a team this good.**

Welcome to IGNITE, where brilliant minds debate your vision and help you build something worth shipping. In this 40-minute workshop, you'll take your product idea from concept to approved build—with real feedback from the world's most experienced builders.

**Total time:** 40 minutes

---

## Module 1: Setup (5 min)

Get IGNITE running on your machine. This is the invisible setup that happens so fast you'll wonder what we were doing.

### Prerequisites

Before you start, confirm you have these installed:

- **Claude Code** — Download at [claude.ai/claude-code](https://claude.ai/claude-code)
- **Node.js 18+** — Install from [nodejs.org](https://nodejs.org)
- **Git** — Install from [git-scm.com](https://git-scm.com)
- **Anthropic API key** — Get yours from [console.anthropic.com](https://console.anthropic.com)

### API Key Configuration

Set your API key once, and you're done:

```bash
export ANTHROPIC_API_KEY=sk-...
```

Add this line to your shell profile (`~/.zshrc` or `~/.bash_profile`) so it persists across sessions.

**Note:** The demo can run without an API key—it will show you a cached example so you can see the full workflow.

### One-Command Install

Install the Great Minds plugin into Claude Code:

```bash
claude mcp add great-minds npx @anthropic-ai/great-minds-plugin
```

This command adds 17 specialized skills to Claude Code—each one designed to handle a specific part of your workflow, from initial concept through deployment.

### Verify Installation

Run this command to confirm everything is set up:

```bash
/agency-status
```

You'll see output like this:

```
┌─────────────────────────────────────────────────────────────┐
│           GREAT MINDS AGENCY ROSTER                         │
├─────────────────────────────────────────────────────────────┤
│ ✓ Sara Blakely      — Growth & Resilience Advisor          │
│ ✓ Elon Musk         — Technical Architecture Lead           │
│ ✓ Steve Jobs        — Design & Product Vision              │
│ ✓ Oprah Winfrey     — Audience & Impact Officer            │
│ ✓ Maya Angelou      — Content & Story Strategy             │
│ ✓ Shonda Rhimes     — Execution & Delivery Lead            │
│                                                              │
│ Status: All agents online and ready                         │
│ Skills available: 17 specialized tools                      │
└─────────────────────────────────────────────────────────────┘
```

### What Just Happened?

You've installed a team of brilliant minds that will debate your ideas and guide you through building something worth shipping. Each agent brings a unique perspective—from growth and design to execution and impact.

In the next module, you'll see them in action, working together to review your product vision and give you real feedback.

**Setup complete in ~3 minutes.**

### Try It Now: The 90-Second Demo

Want to see the magic before setting up your own project? Run the demo:

```bash
/agency-demo
```

**What happens:**

1. Loads a sample PRD (a personal link saver app)
2. Runs an accelerated debate between Steve and Elon
3. Shows the synthesis where Phil Jackson mediates
4. Displays the final build recommendation
5. Asks: "Ready to build?"

**Example output from a real debate:**

> **Steve Jobs (Design-Focused):**
> "Call it: Pulse. Not 'Benchmark Engine.' Not 'Analytics Dashboard.' *Pulse.* One word. One heartbeat. When a doctor checks your pulse, they know instantly if you're thriving or dying."
>
> "You open Pulse. You see one number. Big. Bold. Beautiful. 'Your Pulse Score: 78'. Green, because you're healthy. That's it. That's the first 30 seconds. No tutorials. No onboarding flows. You *understand* it the moment you see it."

> **Elon Musk (Engineering-Focused):**
> "The PRD describes a data warehouse. Stop. You don't need an 'Insights Engine' — you need a spreadsheet with percentiles. MVP architecture: One cron job, one database table, one dashboard view."
>
> "This PRD is 60% vision, 40% spec. Strip it to: 1. Collect 5 metrics nightly 2. Compute percentiles by industry 3. Show one number. Ship in 2 weeks. Validate that anyone cares. Then iterate."

> **Phil Jackson (Synthesis):**
> "Steve's emotional clarity meets Elon's ruthless efficiency. The product is Pulse — one number, one insight. The architecture is minimal — no ML, no insights engine. Ship in 2 weeks, measure, iterate."

**Complete in ~90 seconds.**

#### No API Key? No Problem.

If you haven't configured your API key yet, the demo shows a cached example of a real debate. You'll see exactly what to expect when you run it live.

Ready for the full experience? Go back to [API Key Configuration](#api-key-configuration) and set up your key.

---

## Module 2: The Pipeline (20 min)

This is where the magic happens. You'll watch your idea being debated by brilliant minds, get real feedback, and see a build recommendation emerge.

### Drop Your PRD

Your PRD (Product Requirements Document) is the starting point for everything. It tells the Great Minds team what you want to build, why it matters, and what success looks like.

#### What Is a PRD?

A PRD is a one-page document that answers three questions:

1. **What problem are you solving?** — The pain point that keeps someone up at night
2. **What are you building?** — The specific features that address that pain
3. **How will you know it works?** — Measurable success criteria

That's it. No 50-page specifications. No architecture diagrams. Just the essence of your idea, clearly stated.

#### What IGNITE Expects in Your PRD

Your PRD should include:

**Problem Statement (2-3 sentences)**
Describe the problem in human terms. Not "users need better data management" but "I have 47 browser tabs open right now and I can't find the article I saved last week."

**Goal (1 sentence)**
What does success look like? "Build a link saver that finds saved articles by meaning, not keywords."

**Requirements (3-7 bullet points)**
Each requirement should be:
- **Specific** — "Users can save a link with one click" not "Easy link saving"
- **Testable** — You can prove it works in a demo
- **Valuable** — It directly addresses the problem

**Success Criteria (3-5 bullet points)**
How will you measure whether you've succeeded? "User can save → categorize → find a link in under 2 minutes."

#### Creating Your PRD

Create a new file in your project directory:

```bash
touch my-project-prd.md
```

Open it in your editor and start with this template:

```markdown
# [Your Project Name] PRD

## Problem Statement
[Describe the problem in 2-3 sentences]

## Goal
[One sentence describing what success looks like]

## Requirements
1. [First requirement]
2. [Second requirement]
3. [Third requirement]

## Success Criteria
- [First success metric]
- [Second success metric]
- [Third success metric]
```

#### PRD Best Practices

**Be specific about the user.** Not "users" but "developers who need to track API changes" or "solo founders building their first product."

**Include debate hooks.** What aspects of your idea might reasonable people disagree about? These become the most valuable parts of the debate.

**Keep it short.** A good PRD fits on one screen. If you're scrolling, you're overthinking.

**Example: A Weak Requirement**
> "The system should be user-friendly"

**Example: A Strong Requirement**
> "Users can complete the core workflow (save → categorize → find) in under 2 minutes on their first try"

#### Start the Debate

Once your PRD is ready, kick off the debate:

```bash
/agency-debate my-project-prd.md
```

The system will:
1. Parse your PRD
2. Distribute it to the debate agents
3. Begin the live discussion

Now sit back and watch.

---

### Watch the Debate

This is the moment. Your idea is about to be examined by minds that have shipped products used by billions of people.

#### Meet the Team (As They Appear)

**Steve Jobs** enters first. He's looking at your PRD through the lens of user experience and emotional impact. His questions will challenge whether your product creates genuine love or just utility.

*What Steve cares about:*
- First impressions and emotional hooks
- Simplicity that feels inevitable
- The story users tell themselves about your product
- Whether the product respects the user's intelligence

**Elon Musk** responds. He's ruthlessly practical—focused on physics, economics, and competitive moats. His questions challenge whether your idea can actually be built, and built fast.

*What Elon cares about:*
- First principles: What does this really need to be?
- Speed to market: How fast can we validate this?
- Unit economics: Does the math work?
- Technical feasibility: Is this possible with current technology?

**Phil Jackson** synthesizes. The Zen Master doesn't take sides—he finds the harmony between opposing views and extracts the actionable wisdom.

*What Phil does:*
- Identifies where Steve and Elon agree (this is gold)
- Resolves conflicts by finding the synthesis
- Extracts the core decisions that need to be made
- Creates the build recommendation

#### How to Read the Debate

The debate unfolds in three phases:

**Phase 1: Opening Positions (2-3 minutes)**
Steve and Elon each make their initial observations. Don't react yet—let them establish their positions.

**Phase 2: Direct Engagement (5-7 minutes)**
This is where the magic happens. Steve and Elon respond to each other directly. Watch for:
- **Agreements** — When both agree, that feature is essential
- **Creative tension** — When they disagree, you're learning something important
- **Concessions** — When one changes position, pay attention to why

**Phase 3: Synthesis (3-5 minutes)**
Phil Jackson consolidates the discussion into actionable recommendations. This is your build blueprint.

#### What You'll See in the Terminal

```
┌─────────────────────────────────────────────────────────────┐
│  GREAT MINDS DEBATE — Session #1247                         │
│  PRD: my-project-prd.md                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STEVE JOBS (Design & Experience):                           │
│  "I've read this three times. You're building a tool.        │
│   Nobody falls in love with a tool. They fall in love with   │
│   what the tool lets them become. What transformation are    │
│   you promising?"                                            │
│                                                              │
│  ELON MUSK (Product & Growth):                               │
│  "Transformation is marketing. Let's talk physics. You       │
│   have 5 requirements. How many of them require a database?  │
│   How many require an API? How many can ship with just      │
│   localStorage and a static site? Start there."             │
│                                                              │
│  STEVE JOBS:                                                 │
│  "Elon is right about the architecture—strip it down. But   │
│   he's missing the point about emotion. The simplest        │
│   possible product should still make you *feel* something   │
│   when you use it. What's that feeling?"                    │
│                                                              │
│  ELON MUSK:                                                  │
│  "Fine. But feelings don't ship. Code ships. Ship in 2      │
│   weeks, then measure whether anyone feels anything. If     │
│   they don't, iterate. If they do, celebrate. Either way,   │
│   you learn."                                               │
│                                                              │
│  ─────────────────────────────────────────────────────────   │
│  PHIL JACKSON (Synthesis):                                   │
│  "The debate has converged. Steve wants emotional clarity.   │
│   Elon wants architectural simplicity. Both are right.      │
│                                                              │
│   BUILD RECOMMENDATION:                                      │
│   1. Ship the minimal version in 2 weeks                    │
│   2. Focus on one 'feeling moment' — the first success      │
│   3. Measure whether users return within 24 hours           │
│   4. Iterate based on data, not assumptions"                │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Debate complete. Review synthesis? (Y/n)
```

#### During the Debate: Your Role

You're not passive. While the debate runs, ask yourself:

- *Which criticisms surprise me?* — These reveal blind spots
- *Which agreements feel obvious in hindsight?* — These confirm your instincts
- *What did I assume that got challenged?* — These are learning moments

Take notes. The insights you capture during the debate become the foundation for your build.

---

### Review the Synthesis

After the debate, you'll receive a synthesis document. This is your build blueprint—a distilled version of everything that matters.

#### What You're Looking At

The synthesis has four sections:

**1. Locked Decisions**
These are resolved. Steve and Elon agreed, or Phil made a call. Don't revisit these—they're locked.

```
LOCKED DECISIONS:
✓ Product name: Pulse
✓ Architecture: Local-first, no backend required for MVP
✓ Core metric: Time to first successful search < 30 seconds
✓ Ship timeline: 2 weeks
```

**2. Build Priorities**
Features ranked by importance. Build from top to bottom.

```
BUILD PRIORITIES:
1. [P0] Single-click save — Core value proposition
2. [P0] Semantic search — Differentiator
3. [P1] Auto-categorization — Nice to have
4. [P2] Dashboard view — Can launch without
```

**3. Open Questions**
Things the debate surfaced but didn't resolve. You need to answer these before building.

```
OPEN QUESTIONS:
? What happens when semantic search fails?
? Is offline mode required for MVP?
? What's the fallback if AI categorization is wrong?
```

**4. Risk Register**
Things that could go wrong, ranked by likelihood and impact.

```
RISKS:
⚠ High: Users won't trust AI categorization (Steve's concern)
⚠ Medium: Semantic search latency on large collections
⚠ Low: Browser extension approval delays
```

#### What a Strong Synthesis Looks Like

A strong synthesis has:
- **Clarity** — No ambiguity about what to build first
- **Prioritization** — Clear P0/P1/P2 labels
- **Tension resolution** — Steve and Elon's concerns addressed
- **Actionable next steps** — You know exactly what to do

A weak synthesis has:
- Vague recommendations ("consider user needs")
- Everything marked as high priority
- Unresolved conflicts between agents
- No clear build order

If your synthesis is weak, you can request a follow-up debate:

```bash
/agency-debate --continue
```

This kicks off a second round focused on the open questions.

#### Common Patterns in Feedback

**Pattern: "Ship faster"**
Both Steve and Elon often agree on reducing scope. If they both say "cut this feature," cut it.

**Pattern: "The name is wrong"**
Steve frequently challenges product names. If he suggests a new name, seriously consider it—naming is his superpower.

**Pattern: "What's the moat?"**
Elon will ask what makes your product defensible. If you don't have an answer, that's your homework before building.

**Pattern: "Show, don't tell"**
Steve will push for the product to be self-explanatory. If your PRD requires explanation, the product will too.

---

### Approve the Build

You've watched the debate. You've reviewed the synthesis. Now it's decision time.

#### What "Approval" Means

Approving the build means:
1. You accept the locked decisions
2. You commit to the build priorities
3. You've answered the open questions
4. You're ready to start coding

It doesn't mean the plan is perfect. It means the plan is good enough to start.

#### The Approval Process

Review the synthesis one final time:

```bash
/agency-synthesis
```

If you're ready, approve:

```bash
/agency-approve
```

You'll see a confirmation:

```
┌─────────────────────────────────────────────────────────────┐
│  BUILD APPROVED                                              │
│                                                              │
│  Project: my-project                                         │
│  Locked decisions: 4                                         │
│  Build priorities: 4 features                                │
│  Estimated time: 2 weeks                                     │
│                                                              │
│  Ready to execute? (Y/n)                                     │
└─────────────────────────────────────────────────────────────┘
```

#### Backing Out and Iterating

Changed your mind? No problem. You can back out at any time:

```bash
/agency-reset
```

This clears the current debate and lets you start fresh. Common reasons to reset:

- **New information** — You learned something that changes the PRD
- **Scope change** — The debate revealed the project is bigger than expected
- **Pivot** — The debate convinced you to build something different

You can also modify your PRD and run a new debate:

```bash
/agency-debate my-project-prd-v2.md
```

The system keeps history, so you can compare debates:

```bash
/agency-history
```

#### The Moment of Commitment

When you type `Y` and hit enter, you're committing. Not to a perfect product, but to a process. You're saying:

*"I trust this plan enough to start building. I'll learn what I got wrong by shipping, not by debating forever."*

That's the mindset that ships products.

---

## Module 3: Ship (15 min)

Turn approval into deployed reality. This module takes you from decision to shipped code.

### Build Execution

With your build approved, it's time to execute. The Great Minds system doesn't just plan—it builds.

#### Starting the Build

Kick off the build process:

```bash
/agency-execute
```

The system will:
1. Parse the approved synthesis
2. Break down features into tasks
3. Assign tasks to specialized agents
4. Begin parallel execution

#### What's Happening Behind the Scenes

The build runs through several phases:

**Phase 1: Task Breakdown (1-2 minutes)**
The synthesis gets converted into specific, atomic tasks. Each task is:
- Small enough to complete in one session
- Clear enough that an agent can execute without clarification
- Testable with specific acceptance criteria

**Phase 2: Agent Assignment (30 seconds)**
Tasks get assigned to the right agents:
- **Shonda Rhimes** — Execution & Delivery Lead, orchestrates the build
- **Technical agents** — Handle code generation
- **QA agents** — Prepare test cases

**Phase 3: Parallel Execution (10-20 minutes)**
Multiple agents work simultaneously. You'll see real-time progress:

```
┌─────────────────────────────────────────────────────────────┐
│  BUILD EXECUTION — my-project                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [████████░░░░░░░░░░░░] 40% Complete                        │
│                                                              │
│  ✓ Task 1: Project scaffolding — DONE                       │
│  ✓ Task 2: Core data model — DONE                           │
│  → Task 3: Save functionality — IN PROGRESS                  │
│  ○ Task 4: Search implementation — QUEUED                    │
│  ○ Task 5: UI components — QUEUED                           │
│                                                              │
│  Estimated time remaining: 8 minutes                         │
└─────────────────────────────────────────────────────────────┘
```

#### Monitoring Progress

Watch the build in real-time:

```bash
/agency-status
```

For detailed logs:

```bash
/agency-logs
```

For a specific task:

```bash
/agency-task 3
```

#### If the Build Stalls

Sometimes a task gets stuck. Common causes:

**Ambiguous requirement**
The task description wasn't clear enough. Solution:

```bash
/agency-clarify 3 "The search should match partial words, not just exact matches"
```

**External dependency**
The task needs something that doesn't exist yet. Solution:

```bash
/agency-unblock 3 --skip-dependency
```

**Agent error**
Something went wrong in execution. Solution:

```bash
/agency-retry 3
```

Most stalls resolve automatically. The system has built-in retry logic and will attempt different approaches before asking for help.

#### Build Timeline Expectations

Typical build times by project complexity:

| Project Type | Tasks | Build Time |
|-------------|-------|------------|
| Simple MVP | 5-10 | 15-30 min |
| Medium feature | 10-20 | 30-60 min |
| Complex system | 20-50 | 1-3 hours |

Your first build might take longer as you learn the system. That's normal.

---

### Board Review

Before shipping, your build goes through a final review. This is your quality gate.

#### What the Board Is Checking

The board review examines:

**Code Quality**
- Does the code follow best practices?
- Are there obvious bugs or security issues?
- Is the code maintainable?

**Requirement Compliance**
- Does the build match the approved synthesis?
- Are all P0 features implemented?
- Do the success criteria pass?

**User Experience**
- Does the product feel coherent?
- Are there rough edges that need polish?
- Would you use this yourself?

#### The Review Process

When the build completes, the board convenes automatically:

```
┌─────────────────────────────────────────────────────────────┐
│  BOARD REVIEW — my-project                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Reviewing members:                                          │
│  • Jensen Huang — Technical Excellence                       │
│  • Oprah Winfrey — Audience & Impact                        │
│  • Warren Buffett — Value & Sustainability                   │
│  • Shonda Rhimes — Execution Quality                        │
│                                                              │
│  Status: Review in progress...                               │
└─────────────────────────────────────────────────────────────┘
```

Each board member provides feedback:

```
JENSEN HUANG (Technical):
"Code structure is clean. Database queries are optimized.
 One concern: no error handling on the API calls.
 Recommendation: Add try-catch blocks before shipping."

OPRAH WINFREY (Impact):
"The first-run experience is strong. Users will immediately
 understand what this does. The empty state needs work—
 when there are no saved links, the page feels dead."

WARREN BUFFETT (Value):
"The unit economics work. No recurring costs until 10K users.
 Good position. Ship it and validate demand before scaling."

SHONDA RHIMES (Execution):
"All P0 features complete. P1 features at 80%.
 This is shippable. We can iterate on P1 post-launch."
```

#### The Final Approval Moment

After feedback, you'll see the board's verdict:

```
┌─────────────────────────────────────────────────────────────┐
│  BOARD VERDICT: APPROVED FOR SHIP                            │
│                                                              │
│  Votes:                                                      │
│  ✓ Jensen Huang — APPROVE (with minor fixes)                │
│  ✓ Oprah Winfrey — APPROVE                                  │
│  ✓ Warren Buffett — APPROVE                                 │
│  ✓ Shonda Rhimes — APPROVE                                  │
│                                                              │
│  Required fixes before deploy:                               │
│  • Add error handling to API calls                          │
│  • Improve empty state design                               │
│                                                              │
│  Ready to deploy? (Y/n)                                      │
└─────────────────────────────────────────────────────────────┘
```

#### Addressing Feedback

If the board requests changes, address them:

```bash
/agency-fix "Add error handling to API calls"
```

Then re-run the review:

```bash
/agency-review
```

Most fixes take 2-5 minutes. The board is looking for shippable quality, not perfection.

---

### Deploy

The final step. Your build is approved. Time to go live.

#### The Deployment Command

Deploy your project:

```bash
/agency-ship
```

The system will:
1. Run final pre-deployment checks
2. Package the build for deployment
3. Deploy to your configured target
4. Verify the deployment succeeded

#### Deployment Targets

IGNITE supports multiple deployment targets:

**Vercel (Recommended for web apps)**
```bash
/agency-ship --target vercel
```

**Netlify**
```bash
/agency-ship --target netlify
```

**GitHub Pages**
```bash
/agency-ship --target github-pages
```

**Custom server**
```bash
/agency-ship --target ssh://user@yourserver.com
```

Configure your default target:
```bash
/agency-config set deploy.target vercel
```

#### Verification

After deployment, verify your build is live:

```
┌─────────────────────────────────────────────────────────────┐
│  DEPLOYMENT COMPLETE                                         │
│                                                              │
│  Project: my-project                                         │
│  URL: https://my-project.vercel.app                         │
│  Status: LIVE                                                │
│                                                              │
│  Health checks:                                              │
│  ✓ Homepage loads in < 2s                                   │
│  ✓ Core functionality operational                           │
│  ✓ No console errors                                        │
│                                                              │
│  Share your build: https://my-project.vercel.app            │
└─────────────────────────────────────────────────────────────┘
```

Visit your URL. Click around. Try the core features. Make sure it works as expected.

#### What to Monitor Post-Launch

Keep an eye on:

**Performance**
- Page load times
- API response times
- Error rates

Use your deployment platform's analytics or add a simple monitoring tool.

**User Behavior**
- Are people using the core feature?
- Where do they get stuck?
- Do they come back?

Add basic analytics to track these metrics.

**Feedback**
- Direct feedback from users
- Social media mentions
- Support requests

#### First-User Experience Setup

Before announcing your launch, test the first-user experience:

1. Open an incognito browser window
2. Visit your deployed URL
3. Go through the flow as a brand new user
4. Time yourself: can you complete the core action in under 2 minutes?

If something feels wrong, fix it now. First impressions matter.

#### Announcing Your Launch

Your build is live. You've verified it works. Now tell the world.

Check the `/distribution` folder for ready-to-use templates:
- YouTube script for a demo video
- Twitter threads for announcing the launch
- Hacker News post draft

Use these as starting points. Customize with your specific story.

---

## Module 4: Reference

Quick commands, troubleshooting, and getting help when you need it.

### Quick Commands

Keep this reference handy. These are the commands you'll use every day.

#### Essential Commands

| Command | What It Does | When to Use |
|---------|--------------|-------------|
| `/agency-status` | Shows agent roster and system health | First thing every session |
| `/agency-demo` | Runs the 90-second demo | Showing someone how IGNITE works |
| `/agency-debate <prd>` | Starts a debate on your PRD | Beginning a new project |
| `/agency-synthesis` | Shows the current synthesis | Reviewing debate output |
| `/agency-approve` | Approves the build plan | Ready to start building |
| `/agency-execute` | Starts the build process | After approval |
| `/agency-ship` | Deploys your build | After board approval |

#### Project Management

| Command | What It Does |
|---------|--------------|
| `/agency-history` | Shows past debates and builds |
| `/agency-reset` | Clears current session, starts fresh |
| `/agency-config` | View/edit configuration |
| `/agency-logs` | View detailed execution logs |

#### During Build

| Command | What It Does |
|---------|--------------|
| `/agency-task <n>` | View details of task N |
| `/agency-clarify <n> "text"` | Clarify task N with additional context |
| `/agency-retry <n>` | Retry failed task N |
| `/agency-unblock <n>` | Force-unblock stuck task N |

#### Review & Deploy

| Command | What It Does |
|---------|--------------|
| `/agency-review` | Trigger board review |
| `/agency-fix "description"` | Apply a specific fix |
| `/agency-ship --target <t>` | Deploy to target T |

#### Copy-Paste Examples

**Start a new project from scratch:**
```bash
/agency-demo
# Watch the demo, then...
touch my-idea.md
# Write your PRD, then...
/agency-debate my-idea.md
/agency-approve
/agency-execute
/agency-ship
```

**Resume a paused project:**
```bash
/agency-status
/agency-history
# Find your project, then...
/agency-execute --continue
```

**Deploy to a custom domain:**
```bash
/agency-config set deploy.domain mycustomdomain.com
/agency-ship --target vercel
```

---

### Troubleshooting FAQ

Answers to the questions you'll ask at 2 AM.

#### Setup Issues

**Q: `/agency-status` shows "No agents found"**

A: The plugin isn't installed correctly. Reinstall:
```bash
claude mcp remove great-minds
claude mcp add great-minds npx @anthropic-ai/great-minds-plugin
```

**Q: I get "API key not configured" errors**

A: Set your Anthropic API key:
```bash
export ANTHROPIC_API_KEY=sk-...
```

Add to your shell profile for persistence:
```bash
echo 'export ANTHROPIC_API_KEY=sk-...' >> ~/.zshrc
source ~/.zshrc
```

**Q: The demo runs but shows "cached example" instead of live output**

A: This is expected if your API key isn't set. The demo works offline using cached data. To see live debates, configure your API key.

**Q: Installation hangs at "Downloading agents..."**

A: Check your internet connection. If persistent:
```bash
claude mcp add great-minds npx @anthropic-ai/great-minds-plugin --verbose
```
This shows detailed progress and helps identify where it's stuck.

#### Pipeline Issues

**Q: The debate seems stuck and nothing is happening**

A: Debates can take 2-5 minutes for complex PRDs. Check status:
```bash
/agency-status
```
If truly stuck (> 10 minutes), cancel and retry:
```bash
/agency-reset
/agency-debate my-prd.md
```

**Q: Steve and Elon keep arguing without reaching synthesis**

A: Some PRDs have fundamental tensions that need your input. Add a constraint to your PRD:
```markdown
## Constraints
- Must ship in 2 weeks (non-negotiable)
- Budget: $0 for infrastructure
```

Then re-run the debate.

**Q: The synthesis doesn't match what I wanted**

A: You can guide the synthesis:
```bash
/agency-debate --constraint "Focus on mobile-first experience"
```

Or edit your PRD to be more specific about priorities.

**Q: My PRD was rejected with "insufficient detail"**

A: Your PRD needs more specifics. At minimum, include:
- Clear problem statement
- 3+ specific requirements
- Success criteria

See Module 2 for PRD templates.

#### Build Issues

**Q: Build failed at task N with "unclear requirement"**

A: Clarify the task:
```bash
/agency-task N
# Read the task description
/agency-clarify N "The search should return results sorted by date, newest first"
/agency-retry N
```

**Q: Build is taking much longer than expected**

A: Check for stuck tasks:
```bash
/agency-status
```
Look for tasks marked "IN PROGRESS" for > 10 minutes. These may need intervention:
```bash
/agency-logs --task N
```

**Q: The build completed but the code has bugs**

A: Report the issue and request a fix:
```bash
/agency-fix "The save button doesn't work when offline"
/agency-review
```

#### Deployment Issues

**Q: Deployment failed with "authentication error"**

A: Your deployment target isn't configured. For Vercel:
```bash
vercel login
/agency-config set deploy.target vercel
/agency-ship
```

**Q: The deployed site shows a blank page**

A: Check the build output:
```bash
/agency-logs --deploy
```

Common causes:
- Missing environment variables
- Build errors that weren't caught
- Wrong entry point configured

**Q: I deployed but want to roll back**

A: Use your deployment platform's rollback:
```bash
# For Vercel
vercel rollback

# For Netlify
netlify rollback
```

Or redeploy a previous version:
```bash
/agency-history
/agency-ship --version <previous-version-id>
```

#### Performance Issues

**Q: Everything is slow**

A: Check your API quota:
```bash
/agency-config show quota
```

If you're near your limit, responses slow down. Upgrade your Anthropic plan or wait for quota reset.

**Q: The agents seem to be repeating themselves**

A: This can happen with long sessions. Reset and start fresh:
```bash
/agency-reset
```

Your project history is preserved; only the current session resets.

---

### Community Support

You're not alone. Join thousands of builders using IGNITE to ship their ideas.

#### Join the Community

**Discord** — Real-time help and discussion
[https://discord.gg/great-minds](https://discord.gg/great-minds)

Channels you'll find useful:
- `#help` — Get answers to questions
- `#showcase` — Share what you've built
- `#feedback` — Suggest improvements to IGNITE
- `#debates` — Share interesting debate transcripts

#### Where Experts Are Listening

**Office Hours**
Weekly live sessions where core team members answer questions:
- Tuesdays, 2 PM PT
- Thursdays, 10 AM PT

Join via Discord's voice channels.

**GitHub Discussions**
For detailed technical questions and feature requests:
[https://github.com/great-minds/ignite/discussions](https://github.com/great-minds/ignite/discussions)

#### Share Your Builds

Built something with IGNITE? We want to see it.

1. Share in `#showcase` on Discord
2. Tag @great-minds on Twitter/X
3. Add "Built with IGNITE" to your project README

The best builds get featured in our weekly newsletter.

#### Get Feedback on Your Ideas

Before you build, get feedback:

1. Post your PRD in `#prd-review` on Discord
2. Community members and sometimes agents will provide feedback
3. Iterate before you debate

Early feedback saves hours of building the wrong thing.

#### Report Issues

Found a bug? Help us fix it:

1. Check if it's already reported: [GitHub Issues](https://github.com/great-minds/ignite/issues)
2. If not, create a new issue with:
   - What you expected to happen
   - What actually happened
   - Steps to reproduce
   - Your IGNITE version (`/agency-version`)

We respond to all bug reports within 48 hours.

---

## Essence

What is this product REALLY about?
It's a team of brilliant minds that makes you feel less alone with your idea.

What feeling should it evoke?
Belonging. Vindication. "Finally, someone gets it."

The one thing that must be perfect?
The first moment a user sees their idea being debated.

Creative direction:
**Drama that ships.**

---

## What's Next?

You've completed the IGNITE workshop. You know how to:

- Set up your environment in minutes
- Write a PRD that sparks meaningful debate
- Watch brilliant minds examine your idea
- Turn approval into shipped code
- Deploy and share with the world

Now the only question is: **What will you build?**

Your idea deserves a team this good. Start your first debate:

```bash
/agency-debate your-idea.md
```

---

*"The things we cut define us as much as the things we keep."* — Steve Jobs

*"Shipping comes first. You can't love a product you never completed."* — Elon Musk

---

**Workshop Version:** 1.0
**Last Updated:** 2026-04-09
**Questions?** [discord.gg/great-minds](https://discord.gg/great-minds)

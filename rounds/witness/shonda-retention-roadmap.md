# Shonda Retention Roadmap: Narrate v1.1

**Author:** Based on Shonda Rhimes' Board Review
**Lens:** What keeps users coming back
**Version:** 1.1 Feature Specification

---

## The Core Problem

Narrate currently has **no native retention mechanics**. The product generates value silently in the background, but users have no reason to return. As Shonda put it:

> "The product is a beautiful gift that the recipient doesn't know they have."

This roadmap addresses that gap with features designed to make invisible value visible, create emotional hooks, and build habits.

---

## Retention Philosophy

### Television Principles Applied to Developer Tools

1. **Cold Opens:** Hook users immediately — don't make them wait for payoff
2. **Cliffhangers:** End every interaction with a question, not a period
3. **Previously On...:** Provide context continuity between sessions
4. **Sweeps Week:** Periodic high-value moments that re-engage lapsed users
5. **Season Arcs:** Long-term progression that rewards sustained engagement

---

## v1.1 Features: The Retention Suite

### 1. Enhanced First-Run Experience ("The Pilot")

**Current State:** After `narrate init`, users see "Narrate is watching" and must wait for their next commit to see any value.

**v1.1 Behavior:**

```
$ narrate init

Narrate initialized.

Here's what your changelog will look like:

  ┌─────────────────────────────────────────────────────────┐
  │  Apr 5, 2026 — 10:42 AM                                 │
  │  Added user authentication with JWT tokens and          │
  │  implemented password reset flow via email.             │
  │                                                         │
  │  Apr 4, 2026 — 3:18 PM                                  │
  │  Fixed navigation bug where back button failed on       │
  │  mobile Safari browsers.                                │
  └─────────────────────────────────────────────────────────┘

Your repo has 247 commits. Want to tell the whole story?
Run: narrate backfill --last=90d

Ready to see YOUR first real entry?
Make a commit now. I'll be watching.
```

**Retention Impact:**
- Shows the magic before users invest effort
- Creates immediate desire to see *their* commits transformed
- Surfaces backfill opportunity at highest-intent moment

---

### 2. Post-Commit Celebration ("The Applause")

**Current State:** After commit, the changelog entry appears silently. Users must manually check `CHANGELOG.human.md` or run `narrate log`.

**v1.1 Behavior:**

```
[post-commit hook completes]

Your commit has been narrated:

  "Refactored the payment processing module to support
   multiple currencies and added validation for exchange rates."

Run `narrate log` to see your full story.
```

**Configuration:** `narrate config set show-commit-summary true|false`

**Retention Impact:**
- Immediate reward for every commit
- No hunting for the payoff
- Reinforces the value proposition continuously

---

### 3. Weekly Digest ("Previously On...")

**Command:** `narrate digest [--since=7d] [--email]`

**Output:**

```
$ narrate digest

╔══════════════════════════════════════════════════════════════╗
║           LAST WEEK ON: my-awesome-project                   ║
╠══════════════════════════════════════════════════════════════╣

You made 14 commits across 5 days.

HIGHLIGHTS:
• Launched the new dashboard UI with real-time charts
• Fixed 3 bugs in the authentication flow
• Added API rate limiting (finally!)
• Refactored database queries — 40% faster

MOST ACTIVE DAY: Wednesday (6 commits)
QUIETEST DAY: Monday (0 commits — recovering from the weekend?)

YOUR WEEK IN ONE SENTENCE:
"Major dashboard overhaul with performance improvements
and auth hardening."

╚══════════════════════════════════════════════════════════════╝

Share your week: narrate digest --share
```

**Automation Option:** Add to shell profile or cron for Monday morning delivery

**Retention Impact:**
- Surfaces cumulative value weekly
- Creates "share moment" for social proof
- Provides natural re-engagement touchpoint

---

### 4. Session Context ("The Recap")

**Feature:** When opening a terminal in a Narrate-enabled repo, optionally show the last session's context.

**Shell Integration (opt-in):**

Add to `.bashrc` or `.zshrc`:
```bash
narrate context --quiet
```

**Output:**

```
Last time on my-awesome-project (2 days ago):
  • Fixed the caching bug in user preferences
  • Updated API documentation for v2 endpoints
```

**Retention Impact:**
- Reduces cognitive load when resuming work
- Keeps the narrative present, not forgotten
- Creates muscle memory around checking Narrate

---

### 5. Untold Stories Prompt ("The Cliffhanger")

**Current State:** Backfill exists but users must discover it.

**v1.1 Behavior:** Proactive prompting when running `narrate log` or `narrate status`:

```
$ narrate log

[shows recent entries]

───────────────────────────────────────────────────
Your repo has 342 commits. Only 47 have been narrated.

There are 295 untold stories in your history.
Run `narrate backfill --last=90d` to fill in the gaps.
───────────────────────────────────────────────────
```

**Retention Impact:**
- Creates curiosity about the past
- Positions backfill as completing a story, not running a command
- Gives users a reason to engage beyond daily commits

---

### 6. Milestone Celebrations ("Season Finales")

**Trigger:** Automatic detection of milestones

**Milestones:**
- First narrated commit
- 10 commits narrated
- 50 commits narrated
- 100 commits narrated
- 30-day streak
- 100-day streak
- One year of Narrate

**Output Example:**

```
$ git commit -m "fix typo"

Your commit has been narrated.

🎉 MILESTONE: 100 COMMITS NARRATED!

Your changelog is now 100 entries long.
That's 100 moments of your work, documented forever.

Run `narrate journey` to see how far you've come.
```

**Retention Impact:**
- Creates celebration moments
- Gamifies continued usage
- Provides shareable achievements

---

### 7. Journey View ("The Retrospective")

**Command:** `narrate journey`

**Output:**

```
$ narrate journey

╔══════════════════════════════════════════════════════════════╗
║               YOUR NARRATE JOURNEY                           ║
╠══════════════════════════════════════════════════════════════╣

Started: January 15, 2026 (81 days ago)

COMMITS NARRATED: 127
WORDS WRITTEN (by AI): 4,832
AVERAGE ENTRY LENGTH: 38 words

YOUR MOST PRODUCTIVE MONTH: March 2026 (52 commits)
YOUR LONGEST STREAK: 23 days (Feb 12 - Mar 6)

TOP THEMES IN YOUR WORK:
• Authentication & Security (18 commits)
• UI/UX Improvements (24 commits)
• Performance Optimization (12 commits)
• Bug Fixes (31 commits)
• New Features (42 commits)

If you wrote these commit messages manually at 30 seconds each,
you would have spent 63 minutes. Narrate did it in 12 seconds total.

╚══════════════════════════════════════════════════════════════╝
```

**Retention Impact:**
- Provides meta-value (insights about your own work)
- Quantifies time saved
- Creates shareable "year in review" moments

---

### 8. Forward Prompt ("What's Next?")

**Feature:** Every `narrate log` ends with a forward-looking question.

```
$ narrate log

[entries...]

───────────────────────────────────────────────────
What will you ship next?
───────────────────────────────────────────────────
```

**Variants (rotated):**
- "What will you ship next?"
- "Your story continues with every commit."
- "The changelog is listening."
- "Ready to write the next chapter?"

**Retention Impact:**
- Ends on anticipation, not completion
- Reinforces that Narrate is always there
- Subtle psychological hook

---

## Implementation Priority

| Feature | Effort | Impact | Priority |
|---------|--------|--------|----------|
| Post-Commit Celebration | Low | High | P0 |
| Enhanced First-Run | Medium | High | P0 |
| Untold Stories Prompt | Low | Medium | P1 |
| Weekly Digest | Medium | High | P1 |
| Milestone Celebrations | Medium | Medium | P2 |
| Journey View | High | Medium | P2 |
| Session Context | Low | Low | P3 |
| Forward Prompt | Low | Low | P3 |

---

## Success Metrics

### Retention KPIs

| Metric | Current (Est.) | v1.1 Target |
|--------|----------------|-------------|
| D7 Retention | Unknown | 40% |
| D30 Retention | Unknown | 25% |
| Weekly Active Users | Unknown | 60% of installs |
| Backfill Command Usage | Unknown | 30% of users |
| Digest Command Usage | N/A | 20% of users |

### Engagement Signals

- % of users who run `narrate log` more than once per week
- % of users who complete a backfill
- % of users who reach 100-commit milestone
- Average session frequency (commits per week per user)

---

## The Showrunner's Vision

> "Right now, Narrate ends every interaction with a period. We need to end with a question mark. Every `narrate log` should leave users wanting more. Every commit should feel like a small win. Every week should have a recap that makes users proud of what they built.
>
> We're not building a changelog tool. We're building a narrative engine that makes developers the heroes of their own stories. The machine watches — and the machine *celebrates*."

— Adapted from Shonda Rhimes' Board Review

---

*Retention Roadmap v1.1*
*April 2026*

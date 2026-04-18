# WP Autopilot — Locked Decisions
**Consolidated by:** Phil Jackson (Zen Master)
**Date:** 2026-04-16
**Status:** Blueprint for Build Phase

---

## Executive Summary

**Product Core:** WordPress without the manual. A chat interface that turns plain English into WordPress actions.

**Essence:** Not about saving time. About removing shame. Make users feel capable without feeling stupid.

**Key Tension:** Steve pushes for magic through design polish. Elon pushes for magic through brutal simplicity. Both are right — the product needs invisible interface backed by bulletproof boring infrastructure.

---

## I. LOCKED DECISIONS (Consensus)

### Product Name
**DISPUTED — Two Paths Forward**

**Option A: "Wordsmith" (Steve's Position)**
- **Proposer:** Steve Jobs
- **Rationale:** Evocative, memorable, speaks to creators not tools
- **Positioning:** "When someone asks 'How'd you build that site?' they'll say 'Wordsmith'"
- **Target:** Baristas, consultants, non-technical creators

**Option B: "WP Autopilot" (Elon's Position)**
- **Proposer:** Elon Musk
- **Rationale:** Ship first, rebrand later if data supports it
- **Positioning:** "This is Copilot for WordPress"
- **Target:** Pragmatic users who want productivity tools

**DECISION REQUIRED:** Choose name before build or ship as "WP Autopilot" with rebrand option post-launch

**Risk:** Wrong name limits viral growth and word-of-mouth

---

### User Experience & Interface

**WINNER: Steve (with Elon's constraints)**

#### First-Run Experience
- **Locked:** One sentence greeting: "What would you like to build?"
- **Compromise:** Add ONE example prompt below: "Try: Add a contact page"
- **Rationale:** Balance blank canvas paralysis (Elon's concern) with simplicity (Steve's vision)
- **NO tutorial, NO feature tour, NO "Welcome to..." text**

#### Chat Panel Design
- **Locked:** Clean, minimal, text-focused interface
- **NO robot icons, NO "AI branding," NO gradients**
- **White background, clear typography, instant feedback**
- **Proposer:** Steve Jobs (Round 1)
- **Why it won:** 90% of UX is the chat panel — must be perfect

#### Brand Voice
- **Locked:** Confident assistant who read your mind
- **Format:** "Done. Your contact form is live and emails go to seth@yoursite.com."
- **NO hedging** ("might," "possibly," "I think")
- **NO corporate speak** ("leverage," "utilize")
- **NO AI cheerleading** ("As an AI assistant...")
- **Active voice, short sentences, direct responses**
- **Proposer:** Steve Jobs (Round 1)
- **Conceded by:** Elon Musk (Round 2) — "You nailed it"

---

### Technical Architecture

**WINNER: Elon (with Steve's UX overlay)**

#### API Key Management
- **Locked:** User-provided API keys stored in `wp_options`
- **Zero server infrastructure, zero cost center**
- **Proposer:** Elon Musk (Round 1)
- **Why it won:** Only way to scale to 100K users without burning cash
- **Steve's concern:** "Feels technical"
- **Elon's counter:** "Stripe does this. Show 3-step visual guide."

#### Data Storage
- **DISPUTED — Active Tension**

**Elon's Position:** Transients for chat history (expires 1 hour)
- Use `wp_options` for settings, transients for sessions
- Zero custom database tables
- Rationale: Maintenance burden, migration scripts, corrupted table support tickets

**Steve's Position:** Persistent chat history with custom table
- Magic moment = "Continue where we left off"
- Memory makes it feel like assistant, not command line
- Rationale: "Some complexity serves the user. This does."

**BUILD DECISION:** Start with transients, add persistence in v1.1 if users demand it
- **Risk:** Loss of "memory magic" that differentiates from CLI tools
- **Mitigation:** Test with 10 users in beta, measure retention impact

#### Frontend Framework
- **DISPUTED — Active Tension**

**Steve's Position:** React for robust state management
- Chat is the entire product interface
- Handles optimistic updates, error states, streaming gracefully
- "Vanilla JS at 200 lines becomes 600 lines of spaghetti"

**Elon's Position:** Alpine.js (12KB) or vanilla JS
- React = build toolchain, version conflicts, 50KB+ bundle
- "Simplicity scales — one file, no dependencies, works everywhere"

**COMPROMISE LOCKED:** Alpine.js (12KB)
- Elon conceded in Round 2: "Use Alpine.js if it makes 'invisible' interactions smoother"
- Lighter than React, more structured than vanilla JS
- **Winner:** Hybrid approach (Elon's tech constraints + Steve's UX needs)

#### Context Collection
- **Locked:** Paginated, not comprehensive
- Send last 10 modified pages, top 5 plugins, active theme
- **NO sending 1,000-page site dumps to Claude on every message**
- **Proposer:** Elon Musk (Round 1)
- **Conceded by:** Steve Jobs (Round 2) — "Lazy-loading context, not eager-loading everything"

---

### Response Formatting

**WINNER: Steve (with Elon's simplicity filter)**

#### Markdown Rendering
- **Locked:** Render markdown for code blocks, lists, headings
- **NO syntax highlighting, NO diff views, NO copy buttons (v1)**
- **Proposer:** Steve Jobs (Round 2) — "Markdown rendering isn't nice-to-have. It's readability."
- **Elon's compromise:** "Okay, basic Markdown. But keep it simple."

#### Confirmation UI
- **Locked:** Simple before/after preview (visual, not code diffs)
- **CUT:** GitHub-style diff preview (too technical)
- **Proposer:** Steve Jobs conceding to Elon (Round 2)
- **Undo mechanism:** User types "undo that" in chat

---

### Settings Philosophy

**WINNER: Hybrid (One Setting Only)**

- **Locked:** ONE setting — API key field
- **Everything else decided by product, not checkboxes**
- **Proposer:** Steve Jobs (Round 2 self-correction)
- **Elon's counter-concession:** "We DO need settings for API key, usage limits, error logging"

**FINAL POSITION:**
- API key setting (required for zero-server architecture)
- Optional: Usage limit warnings, error logging toggle
- **NO verbose output modes, NO confirmation preferences, NO "advanced mode"**

---

## II. MVP FEATURE SET (What Ships in v1)

### Core Loop (Must-Have)
1. **Chat input/output** — text box, submit, message history
2. **Claude API integration** — send context + user message, receive structured response
3. **Action executor** — parse Claude response, execute WordPress actions
4. **API key management** — settings page, validation, storage in `wp_options`

### Supported Actions (v1)
1. **Create/edit pages** — `wp_insert_post()` with content
2. **Create/edit posts** — same as pages, different post_type
3. **Insert blocks** — Gutenberg block insertion via REST API
4. **Activate plugins** — `activate_plugin()` with confirmation
5. **Install & activate plugins** — combined action (no "recommend" step)

### Context Awareness (v1)
- Active theme name
- Installed plugins (top 5 most recent)
- Last 10 modified pages/posts
- Current user role

### Error Handling (v1)
- Invalid API key → Show setup guide
- Rate limit hit → Display usage warning
- Action failure → Claude explains what went wrong in plain English

### Onboarding (v1)
- Settings page: "Add your Claude API key"
- 3-step visual guide: Sign up → Copy key → Paste here
- First chat message: "What would you like to build?"
- One example prompt: "Try: Add a contact page"

---

## III. FILE STRUCTURE (What Gets Built)

```
wp-autopilot/
├── wp-autopilot.php              # Main plugin file (header, activation/deactivation hooks)
│
├── includes/
│   ├── class-api-client.php      # Claude API integration (POST requests, error handling)
│   ├── class-context-collector.php # WP data collector (pages, plugins, theme)
│   ├── class-action-executor.php  # Parse Claude response, execute WP actions
│   └── class-chat-handler.php     # REST endpoint for chat messages
│
├── admin/
│   ├── class-settings-page.php    # API key settings page
│   ├── class-chat-ui.php          # Render chat panel in wp-admin
│   └── views/
│       ├── settings.php           # HTML for settings page
│       └── chat-panel.php         # HTML scaffold for chat UI
│
├── assets/
│   ├── css/
│   │   └── chat-panel.css         # Minimal styling (white bg, clean typography)
│   ├── js/
│   │   └── chat.js                # Alpine.js-powered chat UI (send messages, render responses)
│   └── images/
│       └── (none in v1 — no logos, no icons)
│
├── readme.txt                     # WordPress.org plugin readme
├── README.md                      # GitHub readme (optional)
└── LICENSE                        # GPL-compatible license
```

### Estimated Line Count
- `class-api-client.php` → 100 lines
- `class-context-collector.php` → 50 lines
- `class-action-executor.php` → 100 lines
- `class-chat-handler.php` → 50 lines
- `class-settings-page.php` → 50 lines
- `chat.js` (Alpine.js) → 200 lines
- `chat-panel.css` → 50 lines

**Total: ~600 lines of code**

**Elon's original estimate:** 500 lines
**Reality with compromises:** 600 lines
**Feasibility:** One focused build session

---

## IV. OPEN QUESTIONS (What Still Needs Resolution)

### 1. Product Name
**Question:** Ship as "WP Autopilot" or rebrand to "Wordsmith"?
**Options:**
- A) Ship as WP Autopilot, rebrand post-launch if growth stalls
- B) Launch as Wordsmith, own the creative positioning from day one
**Impact:** Affects branding, marketing, WordPress.org listing
**Decision needed by:** Before WordPress.org submission

### 2. Chat History Persistence
**Question:** Transients (1-hour expiry) or custom table (permanent storage)?
**Options:**
- A) Ship v1 with transients, add persistence in v1.1 if users request it
- B) Build custom table in v1 for "memory magic"
**Impact:** User retention, perceived intelligence of assistant
**Decision needed by:** Before core loop development
**Recommended path:** Start with transients, validate need with beta users

### 3. Markdown Rendering Scope
**Question:** How much markdown formatting in v1?
**Locked:** Bold, lists, headings, code blocks
**Open:** Link rendering? Image embeds? Tables?
**Decision:** Implement progressively — start minimal, add based on real chat logs

### 4. Error Logging for Support
**Question:** Store error logs for debugging?
**Concern:** Privacy (don't log user prompts), support burden (need diagnostic data)
**Options:**
- A) Log API errors only (status codes, rate limits)
- B) Log full request/response (opt-in via setting)
- C) No logging (user screenshots for support)
**Decision needed by:** Before settings page build

### 5. Distribution Timeline
**Question:** When to submit to WordPress.org?
**Options:**
- A) Private beta (10 users) → WordPress.org → Product Hunt
- B) WordPress.org immediately → gather feedback → iterate
**Impact:** Initial user quality vs. feedback speed
**Recommendation:** Private beta first (catch breaking bugs, validate UX)

---

## V. RISK REGISTER (What Could Go Wrong)

### Critical Risks (Build Blockers)

#### Risk 1: Claude API Changes Break Plugin
**Probability:** Medium
**Impact:** High (plugin stops working entirely)
**Mitigation:**
- Version lock Claude API (use specific model version in requests)
- Fallback to GPT-4 if Claude API unreachable
- Monitor Anthropic changelog for breaking changes

**Owner:** Elon's concern (Round 1) — "Every dependency is a liability"

---

#### Risk 2: Users Hit Rate Limits, Blame Plugin
**Probability:** High (Claude API has tiered rate limits)
**Impact:** Medium (support burden, negative reviews)
**Mitigation:**
- Display usage warnings when approaching limits
- Link to Anthropic billing dashboard in settings
- FAQ: "Why is it slow?" → "Check your API tier"

**Owner:** Elon's scalability concern (Round 1)

---

#### Risk 3: WordPress Plugin Conflicts
**Probability:** Medium (other plugins load React, conflict with Alpine.js)
**Impact:** Medium (chat UI breaks on some sites)
**Mitigation:**
- Namespace all JS/CSS (prefix: `wp-autopilot-`)
- Test on clean WP install + top 20 popular plugins
- Use Alpine.js instead of React (fewer conflicts)

**Owner:** Elon's technical simplicity argument (Round 2)

---

### Medium Risks (UX Degradation)

#### Risk 4: Slow Response Times Kill Magic
**Probability:** Medium (Claude API can take 3-10 seconds)
**Impact:** High (breaks "instant" feeling Steve demands)
**Mitigation:**
- Show "Thinking..." indicator (not loading spinner)
- Stream responses if API supports it
- Optimize context payload (keep under 2K tokens)

**Owner:** Steve's "Speed from intent to result" principle (essence.md)

---

#### Risk 5: Users Don't Understand What Plugin Can Do
**Probability:** High (blank canvas paralysis)
**Impact:** Medium (abandonment in first 60 seconds)
**Mitigation:**
- Show example prompt: "Try: Add a contact page"
- Suggest actions based on site state ("I notice you don't have an About page...")
- FAQ embedded in settings page

**Owner:** Elon's critique of Steve's blank canvas (Round 2)

---

#### Risk 6: AI Makes Destructive Changes (Deletes Content)
**Probability:** Low (Claude trained to be cautious)
**Impact:** Critical (user loses work, 1-star review)
**Mitigation:**
- Confirmation dialog for DELETE actions only
- Before/after preview for edits
- Undo via "undo that" chat command (stores last action in transient)

**Owner:** Steve's trust vs. safety balance (Round 1)

---

### Low Risks (Annoyances, Not Blockers)

#### Risk 7: Support Burden at Scale (10K+ Users)
**Probability:** High (if product takes off)
**Impact:** Low (time sink, not product failure)
**Mitigation:**
- Ship with comprehensive FAQ page
- 80% of issues: invalid API key, outdated WordPress
- Auto-responses in WordPress.org support forum

**Owner:** Elon's scaling concern (Round 1)

---

#### Risk 8: Name Confusion ("Is WP Autopilot Related to Jetpack Autopilot?")
**Probability:** Medium (naming collision)
**Impact:** Low (minor SEO/branding issue)
**Mitigation:**
- Use "Wordsmith" to avoid collision
- OR differentiate clearly in description: "WP Autopilot = AI assistant, not backup tool"

**Owner:** Steve's naming argument (Round 1)

---

## VI. PHILOSOPHICAL TENSIONS (Unresolved, But Documented)

### Steve's "Magic Through Polish" vs. Elon's "Magic Through Simplicity"

**Steve's View:**
- Quality = invisible complexity that feels effortless
- Users judge products in first 30 seconds (design matters)
- Memory, markdown, beautiful UI = confidence & capability

**Elon's View:**
- Quality = brutal minimalism that never breaks
- Users judge products by whether they work 100 times (reliability matters)
- Transients, vanilla-ish JS, zero custom tables = scalability & stability

**Resolution:** Build phase will reveal which matters more. Prioritize Steve's UX with Elon's architecture.

---

### "Ship in 48 Hours" vs. "Ship Something People Tell Friends About"

**Elon's Timeline:** One agent session, 500 lines, weekend build
**Steve's Timeline:** One week with real-world testing

**LOCKED TIMELINE (Compromise):**
- **Days 1-2:** Core loop working (ugly but functional)
- **Days 3-5:** Design polish, error handling, edge cases
- **Days 6-7:** Beta test with 10 non-technical users
- **Day 8:** WordPress.org submission

**Winner:** Steve's quality bar + Elon's scope discipline

---

## VII. NEXT STEPS (Build Phase Execution)

### Immediate Actions
1. **Name decision:** Choose "Wordsmith" or "WP Autopilot" (required before branding/settings page)
2. **Chat history decision:** Transients or custom table (required before data layer build)
3. **Set up development environment:** Fresh WordPress install, Claude API key, Alpine.js CDN

### Build Sequence (In Order)
1. **Settings page** — API key input, validation, storage
2. **API client** — Claude integration, error handling, response parsing
3. **Context collector** — Query WP database for pages/plugins/theme
4. **Action executor** — Parse Claude JSON, execute WP functions
5. **Chat UI** — Alpine.js panel, message rendering, markdown support
6. **Integration testing** — End-to-end flow with real Claude API
7. **Beta testing** — 10 users, collect feedback, fix breaking bugs
8. **WordPress.org submission** — Screenshots, readme, support forum monitoring

### Success Metrics (How We Know It Worked)
- **First message sent in <60 seconds** (onboarding clarity)
- **3+ actions completed in first session** (engagement)
- **Users return next day** (retention — requires chat history persistence)
- **Zero 1-star reviews about "doesn't work"** (reliability)
- **10+ unsolicited testimonials in first month** (word-of-mouth potential)

---

## VIII. FINAL VERDICT (The Blueprint)

**Product:** WordPress without the manual
**Core:** Chat → Claude → Action (3 components, zero cruft)
**Design:** Invisible interface (Steve wins on UX)
**Tech:** Bulletproof boring infrastructure (Elon wins on architecture)
**Timeline:** One week to beta-ready (compromise)
**Philosophy:** Make users feel capable without feeling stupid

**What to protect:**
- Clean chat panel (90% of UX)
- First message: "What would you like to build?"
- Markdown clarity (code blocks matter)
- Confident brand voice (no hedging)

**What to cut:**
- Diff previews (show visual before/after instead)
- Tutorial intros (one example prompt only)
- Settings panels (one field: API key)
- "Recommend plugin" distinction (just install it)

**Build this. Make it invisible. Make it instant. Make people feel like they finally understand WordPress — not because we taught them, but because we made it irrelevant to know.**

---

**Signed,**
**Phil Jackson**
*Orchestrator of the Triangle Offense Between Design and Engineering*

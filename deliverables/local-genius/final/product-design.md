# LocalGenius — Product Design Vision

**Author**: Ava Chen, Product Designer
**Reviewed by**: Steve Jobs, Chief Design & Brand Officer
**Version**: Draft 1.0
**Date**: 2026-04-01

---

## 1. Design Philosophy

**One principle governs every decision we make: Make the owner feel like they finally have someone in their corner.**

Not a tool in their pocket. Not a dashboard on their screen. A *person* — reliable, competent, warm — who shows up every day and handles the things they've been losing sleep over.

This means every interaction must pass a single test: *If Maria just finished a twelve-hour day at her restaurant, is standing in the kitchen wiping down counters, and pulls out her phone — does this interaction respect her time, her intelligence, and her exhaustion?*

If it asks her to navigate a menu: we failed.
If it shows her a chart she didn't ask for: we failed.
If it requires her to understand a concept she doesn't use in her daily life: we failed.
If it makes her feel capable and supported: we did our job.

### Design Principles (Ranked)

1. **One thread, one truth.** The entire product is a conversation. Everything Maria needs — past activity, upcoming actions, results, recommendations — lives in a single scrolling thread. No tabs. No sidebars. No "go to settings."

2. **Show the work, not the dashboard.** Maria doesn't want to see analytics. She wants to know: "What did you do this week? Did it help? What should I do next?" We answer those three questions, in that order, in plain language.

3. **One tap to approve. Zero taps if she trusts us.** Every action LocalGenius proposes can be approved with a single tap. Over time, as trust builds, the owner can pre-authorize categories of action. The system earns autonomy — it is never assumed.

4. **The product disappears.** The best interaction is the one that never happens. If LocalGenius can respond to a 5-star review without bothering Maria, it should. She hears about it in the Weekly Digest, not in a notification at 9pm.

5. **Warm, not cute. Confident, not corporate.** The product speaks like a capable colleague, not a chatbot with a personality. No exclamation marks after every sentence. No emoji where a word would do. No "Hey there!" — just "Good morning, Maria."

---

## 2. Onboarding Flow — The Five-Minute Proof Moment

This is the conversion event. Not a free trial. Not a feature tour. The moment Maria sees her business look professional for the first time — that's when she decides to stay.

### Pre-Onboarding (Before Download)

Maria arrives from one of two paths:
- **Fear path** (acquisition ad): "The restaurant down the street has 147 more Google reviews than you. Here's why." She taps through to a landing page that shows a before/after of a real restaurant's online presence.
- **Referral path** (word of mouth): Another restaurant owner showed her their Weekly Digest. "This thing does everything. I don't even think about marketing anymore."

Either way, she downloads the app. What happens next determines everything.

### Step 1: "Tell Me About Your Business" (60 seconds)

**What Maria sees:** A warm, full-screen welcome. No logo parade. No feature list. Just:

> "Let's get your business set up. I just need a few things from you — this will take about five minutes."

**What Maria does:**
- Types or speaks her business name ("Maria's Kitchen")
- Selects business type from a visual grid (8 tiles: Restaurant, Salon, Dental, Medical, Home Services, Fitness, Retail, Other). One tap. No dropdown menu.
- Confirms city (auto-detected from phone location, one tap to confirm or edit)

**What LocalGenius does (invisibly):**
- Searches Google Business Profile, Yelp, Facebook, Instagram for existing presence
- Pulls existing reviews, hours, photos, address, phone number
- Identifies gaps (no website? outdated hours? zero Instagram posts?)

**Design notes:**
- Business type grid uses warm illustrations, not icons. Each tile is 88×88pt minimum.
- Voice input is always available — a mic icon sits in the text field. Maria can say "Maria's Kitchen, restaurant, Austin Texas" and skip the taps entirely.
- Progress indicator: a simple line at the top, not a step counter. She shouldn't feel like she's filling out a form.

### Step 2: "Here's What I Found" (30 seconds)

**What Maria sees:** A clean summary card:

> **Maria's Kitchen**
> 📍 1401 S Lamar Blvd, Austin, TX 78704
> ⭐ 4.3 on Google (28 reviews) · Not found on Yelp
> 📸 3 photos on Google · No Instagram
> 🌐 No website found
>
> "You've got a good foundation — 28 reviews with a 4.3 average is solid. Let me help you build on that."

**What Maria does:**
- Confirms the info is correct (one tap: "That's me")
- Or corrects anything wrong (tap to edit specific fields)

**What LocalGenius does:**
- Ingests all found data into the owner's profile
- Begins generating website, first social post, and Google Business Profile optimization in the background

**Design notes:**
- The summary card uses a warm affirmation ("good foundation," "solid"). We never open with what's missing. We open with what's working.
- If no existing presence is found: "Starting fresh? Perfect. A blank page means we get to do this right from the beginning."
- Background generation starts here — by the time Maria finishes Step 3, her website is ready.

### Step 3: "Show Me Your Best" (90 seconds)

**What Maria sees:**

> "Now show me what makes your business special. Upload a few photos — your space, your team, your best work. I'll use these everywhere."

**What Maria does:**
- Uploads 3-6 photos from camera roll (photo picker with multi-select)
- Optionally adds a one-line description of what makes her business special ("Tex-Mex from scratch on South Lamar since 2019")

**What Maria does NOT do:**
- Write marketing copy
- Choose fonts or colors
- Select a template
- Configure anything

**Design notes:**
- Photo upload supports camera roll, direct camera capture, and Google Business Profile import (if photos exist there)
- Minimum 3 photos to proceed. We show a gentle "the more photos you share, the better your site and posts will look" — not a hard requirement wall
- The text field for the description has a placeholder that shows what good looks like: "e.g., 'Award-winning BBQ in South Austin since 1987'"

### Step 4: "One More Thing" (30 seconds)

**What Maria sees:**

> "What matters most to you right now?"

Three large, tappable options:
- 🔍 **"Get found online"** — I need people to find me on Google
- ⭐ **"Manage my reviews"** — I need help with reviews and reputation
- 📱 **"Stay active on social"** — I need to post more consistently

**What Maria does:** Taps one. This sets the initial priority for LocalGenius — which actions it takes first, which metrics it highlights in the first Weekly Digest.

**What Maria does NOT do:**
- Rank all three
- Explain her marketing strategy
- Set goals

**Design notes:**
- One choice. Not a checklist. The constraint is the feature — it forces focus and reduces cognitive load.
- The three options cover the most common entry points for local business owners. All features are available regardless of choice; this just sets the opening act.

### Step 5: "The Reveal" (60 seconds)

**What Maria sees:** A brief loading moment — a warm animation (not a spinner, not a progress bar — a gentle visual of her business name being assembled, like a sign being painted). Then:

> "Here's what I built for you."

The screen transitions to a scrollable preview showing:

1. **Her website** — a real, published, mobile-optimized site with her photos, hours, reviews, and a booking button. Hosted and live. She can tap "View Site" to open it in the browser.

2. **Her first social post** — a ready-to-publish Instagram/Facebook post using her best photo. Copy written in her voice (warm, local, not corporate). One tap to post.

3. **Her Google Business Profile** — optimized listing with updated description, keywords, and a response drafted for her most recent review.

4. **A suggested first campaign** — "Send a 'we miss you' message to past customers" or "Ask your 5 most recent customers for a Google review" — depending on her Step 4 choice.

**What Maria does:**
- Scrolls through the preview, sees her business look *professional*
- Taps "Publish" on anything she likes, or "Edit" to adjust
- Or taps "Looks good — publish everything" (one tap to go live on all channels)

**The emotional moment:** Maria has never seen her business look this polished. It happened in five minutes. She didn't write a word of copy. She didn't choose a color palette. She didn't configure a single integration. She feels, for the first time, like she has someone in her corner.

**Design notes:**
- The website is generated using AI-populated templates on commoditized hosting (Vercel/Cloudflare Pages). Per locked Decision #1: we own design + generation, outsource infrastructure. Engineering cost: 2-3 weeks.
- The preview is not a mockup — it's the real, live output. What she sees is what the world sees when she taps publish.
- "Publish everything" is a deliberate choice. Maria can go from zero to fully live in one tap. The approval gate exists for owners who want it; auto-publish exists for owners who trust the work.

### Post-Onboarding: The First 24 Hours

After the reveal, the conversation thread begins. Maria's first message from LocalGenius arrives within an hour:

> "Your site is live at mariaskitchenatx.com — 3 people have already visited. I'll post your first social update tomorrow morning. In the meantime, I drafted responses to your 2 most recent Google reviews. Want to take a look?"

This is the transition from onboarding to daily product. No tutorial. No feature walkthrough. Just: here's what I'm already doing for you.

---

## 3. Conversational Interface — The Single Thread

### Core Interaction Model

The product is one screen: a conversation thread. Everything Maria does with LocalGenius happens here.

**The thread contains three types of content:**

1. **Actions** — Things LocalGenius did or proposes to do
   - Format: Card with summary, one-tap approve/edit/dismiss
   - Example: "I drafted a response to your new 5-star review from Jake R. → [Approve] [Edit]"

2. **Reports** — Information about what happened
   - Format: Narrative text with optional detail expansion
   - Example: "12 people booked through your website this week — that's 4 more than last week."

3. **Owner messages** — Things Maria says or asks
   - Format: Text or voice input, processed as natural language
   - Example: "Post something about our new lunch menu" or "How did we do this month?"

### How Owner Input Works

Maria types or speaks. LocalGenius interprets. The system always confirms before acting on anything public-facing.

**Input → Interpretation → Draft → Approval → Execution → Confirmation**

Example flow:
- Maria types: "Post something about our lunch special today"
- LocalGenius responds (within 10 seconds):
  > "Here's a post for your lunch special. I'll put it on Instagram and Facebook at 11:30am — right before the lunch crowd starts searching."
  >
  > [Post preview with photo, copy, and hashtags]
  >
  > [Post Now] · [Edit] · [Schedule for 11:30am]
- Maria taps "Schedule for 11:30am"
- At 11:30am, the thread shows: "Posted your lunch special. I'll let you know how it does."
- Next morning: "Your lunch special post reached 234 people and got 12 likes. 3 people clicked through to your menu."

### The Approval Gate

**Default: Confirm before posting.** Every public-facing action (social posts, review responses, email campaigns, website changes) requires one-tap approval.

**Earned autonomy:** After Maria approves 10+ review responses without editing, LocalGenius asks:
> "I've noticed you approve my review responses as-is. Want me to handle positive reviews automatically? I'll still flag anything 3 stars or below for you."

If she agrees, positive review responses become automatic. She sees them in the Weekly Digest: "I responded to 8 reviews this week. Here are the highlights."

Autonomy levels:
- **Level 0 (Default):** Confirm everything
- **Level 1 (Earned):** Auto-respond to positive reviews; confirm social posts, emails, and website changes
- **Level 2 (Deep trust):** Auto-post social content that matches pre-approved themes; confirm emails and website changes
- **Level 3 (Full trust):** Auto-handle everything except negative reviews and campaigns over $50

Each level is *offered*, never imposed. The system asks; the owner decides. Autonomy can be revoked at any time by saying "run everything by me first."

### Handling Ambiguity

When Maria's input is unclear, LocalGenius asks one clarifying question. Never two. Never a form.

- Maria: "Do something about our anniversary"
- LocalGenius: "Happy anniversary! How many years? I'll build a celebration campaign around it — social post, email to past customers, maybe a special offer."
- Maria: "15 years"
- LocalGenius: "Love it. Here's what I'm thinking..." [Shows plan]

### Notifications

**Philosophy: Interrupt only when Maria's input is needed or when something requires her attention.**

**Always notify:**
- Negative review (3 stars or below) — needs her voice, not the AI's
- Campaign performance that's significantly above or below expected
- Weekly Digest (Monday morning, 7am local time)

**Never notify:**
- Positive review responded to automatically
- Social post published on schedule
- SEO optimization running in background
- Routine metrics that are within normal range

**Notification format:** Brief. Actionable. One tap to resolve.
> "You got a 2-star review from Sarah M. I drafted a response — want to check it before I post? [View]"

---

## 4. Weekly Digest Design

The Weekly Digest is the heartbeat of LocalGenius. It arrives every Monday at 7am. It's the one moment each week where the owner sees the full picture of their digital presence — and it should feel like a good meeting with a trusted employee.

### Structure

The Digest is a story in three acts:

**Act 1: "Here's What Happened" (What the world did)**
> "This week, 340 people visited your website (up 12% from last week). You got 4 new Google reviews — all 4 stars or above. 23 people booked appointments through your site."

Plain numbers with context. Never a number without comparison. "340 visits" means nothing. "340 visits, up 12%" means progress. "340 visits, your best week since you started" means momentum.

**Act 2: "Here's What I Did" (What LocalGenius did)**
> "I posted 3 times on Instagram and twice on Facebook. Your Tuesday lunch special post reached 456 people — your best-performing post this month. I responded to all 4 new reviews. I updated your Google Business Profile with your new Saturday hours."

This section builds trust. Maria sees that LocalGenius is working even when she's not looking. Every action is listed plainly. No jargon. No "engagement metrics." Just: here's what I did, and here's how it went.

**Act 3: "Here's What I Recommend" (What to do next)**
> "You haven't sent an email to past customers in 6 weeks. Want me to send a 'thinking of you' message to customers who haven't visited in 30+ days? I've drafted one for you."
>
> [Preview Email] · [Send It] · [Skip]

Recommendations are actionable. Each one has a one-tap action attached. Maria can approve the recommendation right inside the Digest without opening the main app thread.

### Design Details

- **Length:** The Digest should take 90 seconds to read. Maximum. If Maria can't skim it while waiting for her coffee, it's too long.
- **Tone:** Warm, conversational, slightly proud (of her business, not of itself). "Your best week yet" is good. "Our AI-powered platform delivered exceptional results" is grounds for deletion.
- **Numbers:** Maximum 5 numbers in the entire Digest. Each one with context. If a number needs explanation, it's the wrong number.
- **Visuals:** One chart maximum — a simple trend line showing the metric Maria cares about most (reviews, visits, or bookings based on her Step 4 choice). No pie charts. No bar graphs. No multi-axis nightmares.
- **Format:** Delivered as a push notification that expands into a rich card. Also available as email for owners who prefer it. Both versions are identical in content.

### Digest Personalization

The Digest adapts over time:
- If Maria never taps on the social media section, it shrinks. If she always reads the reviews section, it gets more detail.
- Seasonal awareness: "Valentine's Day is in 2 weeks. Want me to plan something for your restaurant?" appears in the February 1st Digest.
- Milestone celebrations: "You hit 100 Google reviews this week. That puts you in the top 10% of restaurants in Austin."

---

## 5. Visual Language

### The Feeling

A great local hardware store where the person behind the counter knows your name. Warm. Competent. Unpretentious. The kind of place where the shelves are organized but not sterile, where the advice is good because it comes from experience, not a script.

This is NOT:
- A Silicon Valley startup (no gradients, no glassmorphism, no dark mode default)
- A corporate SaaS product (no blue-and-white, no stock photos of diverse teams high-fiving)
- A playful consumer app (no rounded everything, no bouncy animations, no emoji-as-UI)

### Color Palette

**Primary:**
- Warm Charcoal `#2C2C2C` — Primary text, headings. Rich and readable, not cold black.
- Warm White `#FAF8F5` — Background. A touch of warmth, like good paper. Not clinical white.

**Accent:**
- Terracotta `#C4704B` — Primary action buttons, links, highlights. Warm, confident, earthy. The color of a good brick storefront.
- Sage `#7A8B6F` — Secondary actions, success states, positive indicators. Growth without neon.

**Supporting:**
- Soft Gold `#D4A853` — Stars, ratings, celebration moments. Warmth without cheapness.
- Slate `#6B7280` — Secondary text, captions, metadata. Readable but recessive.
- Blush `#F5E6E0` — Subtle backgrounds for cards, notification badges. Warm, not pink.

**System:**
- Alert Red `#C0392B` — Negative reviews, errors. Used sparingly — never for decoration.
- Background Cream `#F2EDE8` — Card backgrounds, section dividers. Layering without borders.

### Typography

**Primary typeface:** A humanist sans-serif with a touch of warmth. Specify: **Source Sans 3** (open source, excellent readability on mobile, has the warmth of a hand without being whimsical).

- Headings: Source Sans 3 Semibold, 20pt/24pt leading
- Body: Source Sans 3 Regular, 16pt/24pt leading (generous leading = breathing room)
- Captions: Source Sans 3 Regular, 13pt/18pt leading, Slate color
- Numbers/Metrics: Source Sans 3 Semibold, 28pt — large, confident, easy to read at a glance

**No typeface mixing.** One family. Hierarchy through size and weight, not font variety.

### Spacing Philosophy

**Generous.** The product should feel unhurried, even when delivering information quickly.

- Minimum padding inside cards: 20pt
- Spacing between content blocks: 24pt
- Tap targets: minimum 44×44pt (Apple HIG standard). Most interactive elements should be larger — 56pt height for primary actions.
- Screen margins: 20pt on mobile (never less)

The whitespace is not wasted space. It's breathing room. Maria is looking at this in a stolen moment between customers. Cramped UI adds to the feeling of being overwhelmed. Generous spacing says: take your time, everything is under control.

### Photography Style

**Real business photos only.** Maria's photos. Darnell's barbershop. The actual food at the actual restaurant.

When we need stock or illustration (empty states, onboarding):
- Warm, natural lighting
- Real spaces (not studios)
- Diverse but not performatively so — reflective of actual local business demographics
- No laptop-on-a-desk. No person-pointing-at-a-screen. No handshake.

### Iconography

**Line icons, 2pt stroke, Warm Charcoal.**
- Rounded terminals (not sharp — warm, not aggressive)
- 24×24pt standard size
- Consistent metaphors: envelope for email, speech bubble for social, star for reviews, chart-up for growth
- No filled/solid icons except in active/selected states

### Animation & Motion

**Purposeful, not decorative.**
- Card appearances: gentle 200ms fade-up. Not a bounce. Not a slide.
- Approval confirmation: a brief, satisfying checkmark animation (300ms). The haptic of accomplishment.
- Loading states: a warm pulsing glow, not a spinner. The feeling of something being prepared, not something being waited for.
- No parallax. No hero animations. No "delightful" loading screens. Maria is in a hurry.

---

## 6. Mobile-First Principles

Maria is holding her phone in one hand while standing in her restaurant between the lunch rush and prep for dinner. This is our design context for every decision.

### Thumb Zone Design

- **Primary actions live in the bottom 40% of the screen.** This is where the thumb naturally rests. The text/voice input bar is always bottom-anchored.
- **Navigation (what little exists) lives in the bottom bar.** Two icons maximum: Thread (the main product) and Digest (weekly summary). That's it.
- **Destructive or irreversible actions require a reach to the top of the screen.** This is intentional friction.

### One-Handed Operation

Every core interaction is completable with the thumb of the holding hand:
- Approve a post: one tap in the thumb zone
- Dismiss a notification: swipe
- Voice input: long-press the mic (bottom-right, thumb-natural position)
- Scroll the thread: natural thumb scroll
- Open the Weekly Digest: tap the second bottom-bar icon

### Interruption-Resilient Design

Maria will be interrupted mid-interaction. The product handles this gracefully:
- **Auto-save everything.** If she's mid-edit on a review response and a customer walks in, the draft persists indefinitely.
- **Thread state is preserved.** She can close the app, reopen it hours later, and see exactly where she left off.
- **No timed sessions.** No "your session has expired." No re-authentication unless the phone itself was locked for 24+ hours.
- **No multi-step flows that can't be abandoned.** If she exits during onboarding, she picks up at the exact same step.

### Offline Awareness

If Maria is in her restaurant's dead zone (every restaurant has one):
- The thread shows the last-synced state with a subtle "Reconnecting..." indicator
- Actions queued while offline (like approving a post) execute when connectivity returns
- No error modals. No "connection lost" alerts. Just graceful degradation.

### Desktop Existence

Desktop is supported but not prioritized. The desktop version is the mobile interface with more whitespace — not a different product. No features exist on desktop that don't exist on mobile. No "for the full experience, use desktop." The phone is the product.

---

## 7. What We Don't Build

This section is as important as everything above. Every item here is a decision, not an omission.

### No Settings Page

There is no settings screen. Every preference is set through conversation.
- "Change my business hours" → conversation
- "Stop posting on Sundays" → conversation
- "Switch my email to maria@newdomain.com" → conversation

If a preference can't be expressed in natural language, it doesn't need to exist.

### No Tab Navigation

There are no tabs. No sidebar. No hamburger menu. Two bottom icons: Thread and Digest. That's the entire navigation model. If we ever feel the need for a third icon, we've failed at the core design.

### No Dashboard

No analytics dashboard. No metrics screen. No "performance overview." All performance data lives in the Weekly Digest and in contextual thread messages. Maria doesn't want to analyze her marketing. She wants to know if it's working. Those are different products for different people.

### No Onboarding Tutorial

No tooltips. No "tap here to learn about..." No feature walkthrough. No coach marks. If the product needs a tutorial, the product is wrong. The onboarding IS the product — Maria's first five minutes produce real output, not a guided tour.

### No Template Gallery

Maria does not choose templates. She does not browse layouts. She does not pick color schemes for her website. LocalGenius makes those decisions based on her business type, her photos, and what works for her category. Choice is not a feature — it's a burden we're removing.

### No Manual Campaign Builder

No drag-and-drop email builder. No "design your campaign" screen. Maria says "send a message to customers who haven't been in for a month" and LocalGenius builds it. The campaign is the result of a conversation, not a workflow.

### No Admin Panel

No user management screen (v1 is single-user). No billing page with plan comparison tables. No API settings. Billing is handled through conversation or a minimal payment screen linked from the app store. Plan upgrades are suggested by LocalGenius when the owner hits a natural limit.

### No Franchise Management UI

Per locked Decision #4: The data model supports multi-tenant (Organization → Business → User) from day one, but there is no franchise dashboard, no multi-location view, no brand consistency tools in v1. Every pixel serves Maria, the solo operator. Linda's dashboard is a future product, built on a foundation that's ready for her.

---

## Appendix: Design Decision Traceability

| Design Decision | Traces To |
|---|---|
| Single conversation thread | Round 2 Decision: agentic loop with human approval gate |
| AI-generated website on commoditized hosting | Round 2 Decision #1: own generation, outsource infrastructure |
| One-tap approval gate with earned autonomy | Round 2: approval gate architecture (Steve + Elon aligned) |
| Five-minute onboarding producing real output | Round 2 Decision #1: the proof moment |
| Warm/local visual language | Round 1: Steve's design vision (earth tones, local hardware store) |
| No paid ads in product marketing until month 4 | Round 2 Additional Agreement: retention proof first |
| Mobile-first, desktop-supported | PRD Constraint: "these owners live on their phones" |
| Multi-tenant data model, single-tenant UI | Round 2 Decision #4: don't build for franchise, don't preclude it |
| Weekly Digest as story, not dashboard | Round 1: Steve's position on digest as narrative |
| Two-icon navigation maximum | Design Philosophy: the product disappears |

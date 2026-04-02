# LocalGenius — Onboarding Screen Specifications

**Engineering Spec v1.0**
**Source of truth**: product-design.md (Section 2: Onboarding Flow)
**Target**: 5 minutes from app open to professional website + social post + Google profile

---

## Overview

The onboarding is 5 screens (steps). No tutorial. No feature tour. Each screen produces real output. The final screen — The Reveal — is the conversion moment.

**Critical constraints:**
- BottomNav is hidden during onboarding (`AppShell.showNav = false`)
- ProgressBar is visible at top of each screen
- All steps persist state — if Maria closes the app mid-step, she resumes exactly where she left off
- Back navigation: swipe-right or back arrow returns to previous step. No data is lost.
- Total input from Maria: business name + business type + city + 3-6 photos + one priority tap. That's it.

---

## Screen 1: "Tell Me About Your Business"

**ProgressBar**: `0.2`
**Duration target**: 60 seconds

### Layout

```
┌─────────────────────────────────────────┐
│ ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░ 20%   │ ← ProgressBar (3px, top)
│                                         │
│                                         │
│  Let's get your business set up.        │ ← heading (text-h1, charcoal)
│  I just need a few things from          │
│  you — this will take about five        │ ← body (text-body, charcoal)
│  minutes.                               │
│                                         │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Your business name         [🎤] │    │ ← TextInput (single line)
│  └─────────────────────────────────┘    │
│                                         │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │🍽️ │ │💇 │ │🦷 │ │🏥 │          │ ← BusinessTypeGrid (row 1)
│  │Rest│ │Saln│ │Dntl│ │Medl│          │
│  └────┘ └────┘ └────┘ └────┘          │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │🔧 │ │🏋️ │ │🛍️ │ │📦 │          │ ← BusinessTypeGrid (row 2)
│  │Home│ │Fitn│ │Retl│ │Othr│          │
│  └────┘ └────┘ └────┘ └────┘          │
│                                         │
│  📍 Austin, TX                [Edit]    │ ← City (auto-detected, editable)
│                                         │
│           [  Continue  ]                │ ← Button (primary, full-width)
│                                         │
└─────────────────────────────────────────┘
```

### Components Used

- `OnboardingStep` (container)
- `ProgressBar` (`progress={0.2}`)
- `TextInput` (single-line variant, no send button, mic icon for voice)
- `BusinessTypeGrid` (custom for this screen)
- `Button` (`variant="primary"`, `fullWidth={true}`)

### Copy (Exact Text)

- Heading: `"Let's get your business set up."`
- Subtext: `"I just need a few things from you — this will take about five minutes."`
- Input placeholder: `"Your business name"`
- City label: `"📍 [Auto-detected city, state]"` with `[Edit]` link
- Button: `"Continue"`

### Business Type Grid Spec

8 tiles in a 4×2 grid.

| Tile | Label | Illustration style |
|---|---|---|
| Restaurant | `"Restaurant"` | Warm illustration of a plate/table |
| Salon | `"Salon"` | Scissors/chair |
| Dental | `"Dental"` | Tooth/smile |
| Medical | `"Medical"` | Stethoscope |
| Home Services | `"Home Services"` | Wrench/house |
| Fitness | `"Fitness"` | Dumbbell |
| Retail | `"Retail"` | Shopping bag |
| Other | `"Other"` | Sparkle/generic |

- Tile size: `88×88px` minimum (per product-design.md). On larger screens, tiles grow to fill but maintain square aspect.
- Gap between tiles: `12px`
- Background: `var(--surface-card)` / `bg-cream`
- Selected state: `var(--color-terracotta-light)` background, `2px solid var(--color-terracotta)` border
- Border radius: `var(--radius-md)` (12px)
- Label: `text-caption`, centered below illustration
- Illustrations: warm, hand-drawn style. NOT flat icons. These should feel approachable.
- Single-select — tapping one deselects the previous

### User Actions

1. Type or speak business name (required)
2. Tap one business type tile (required)
3. Confirm or edit city (auto-populated from device location)
4. Tap "Continue"

### Validation

- Business name: minimum 2 characters. Show inline error if empty on Continue tap: `"What's your business called?"` (warm, not technical)
- Business type: must select one. If none selected on Continue tap, tiles briefly pulse with terracotta border
- City: auto-detected via device geolocation API. If geolocation fails, show empty text input with placeholder `"What city are you in?"`

### System Behavior (Background)

On "Continue" tap, fire these API calls in parallel:
1. Google Business Profile search for `{businessName}` in `{city}`
2. Yelp Business Search API
3. Facebook Pages search
4. Instagram Business Discovery

These resolve during Step 2 display. If any timeout after 5 seconds, show Step 2 with partial data and a note: `"I'm still looking — I'll update this as I find more."`

### Error States

| Error | Display |
|---|---|
| Geolocation denied | Show city text input instead of auto-detected city. No error message — just degrade gracefully. |
| Voice transcription fails | Show text input with placeholder. Mic icon shows brief error pulse, then returns to ready state. |
| Network error | `"I need an internet connection to look up your business. Can you check your connection?"` — show retry button. |

---

## Screen 2: "Here's What I Found"

**ProgressBar**: `0.4`
**Duration target**: 30 seconds

### Layout

```
┌─────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░ 40%   │
│                                         │
│ ← Back                                  │ ← ghost button, top-left
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Maria's Kitchen                    ││ ← BusinessProfileCard
│  │  📍 1401 S Lamar Blvd, Austin, TX  ││
│  │  ⭐ 4.3 on Google (28 reviews)     ││
│  │     Not found on Yelp              ││
│  │  📸 3 photos on Google             ││
│  │     No Instagram                    ││
│  │  🌐 No website found               ││
│  └─────────────────────────────────────┘│
│                                         │
│  "You've got a good foundation —        │ ← system message (text-body)
│   28 reviews with a 4.3 average is      │
│   solid. Let me help you build on       │
│   that."                                │
│                                         │
│  [    That's me    ]                    │ ← Button (primary, full-width)
│                                         │
│  Something wrong?  [Edit details]       │ ← ghost link
│                                         │
└─────────────────────────────────────────┘
```

### Components Used

- `OnboardingStep`
- `ProgressBar` (`progress={0.4}`)
- `BusinessProfileCard`
- `Button` (primary)

### BusinessProfileCard Spec

| Field | Source | Display if missing |
|---|---|---|
| Business name | User input from Step 1 | Always present |
| Address | Google Business Profile | `"No address found — I'll need this for your website"` |
| Google rating | Google Business Profile | `"Not on Google yet"` |
| Review count | Google Business Profile | `"0 reviews"` |
| Yelp status | Yelp API | `"Not found on Yelp"` |
| Photo count | Google Business Profile | `"No photos on Google"` |
| Instagram | Instagram API | `"No Instagram"` |
| Website | Google Business Profile / crawl | `"No website found"` |

- Each field: icon (16px, slate) + label (text-body)
- Present fields: charcoal text
- Missing fields: slate text (not red — missing is not an error, it's an opportunity)
- Card background: `var(--surface-elevated)`, `var(--shadow-md)`, `var(--radius-lg)` (16px)

### Copy — Conditional System Messages

| Condition | Message |
|---|---|
| Has reviews + has some presence | `"You've got a good foundation — {count} reviews with a {rating} average is solid. Let me help you build on that."` |
| Has reviews + minimal presence | `"Good news — you already have {count} reviews. That's a head start. Let me fill in the gaps."` |
| No presence found at all | `"Starting fresh? Perfect. A blank page means we get to do this right from the beginning."` |
| Partial data still loading | `"I found some things — still looking for more. Let's keep going."` |

### User Actions

1. Tap "That's me" to confirm (proceeds to Step 3)
2. Tap "Edit details" to correct any field (opens inline edit for each field — tap field to edit, tap away to save)

### System Behavior

On "That's me" confirmation:
- Ingest all discovered data into the user's business profile
- Begin background generation: website template selection, social post draft, Google Business Profile optimization
- These continue during Steps 3 and 4. By Step 5, all outputs are ready.

### Error States

| Error | Display |
|---|---|
| No results found for business name | Show empty BusinessProfileCard with message: `"Starting fresh? Perfect."` — proceed normally |
| Wrong business matched | "Edit details" allows correcting name/address. Re-runs discovery on correction. |
| All API calls failed | `"I couldn't look you up right now — that's okay. I'll work with what you give me."` Proceed to Step 3. |

---

## Screen 3: "Show Me Your Best"

**ProgressBar**: `0.6`
**Duration target**: 90 seconds

### Layout

```
┌─────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░ 60%   │
│                                         │
│ ← Back                                  │
│                                         │
│  Now show me what makes your            │ ← heading (text-h1)
│  business special.                      │
│                                         │
│  Upload a few photos — your space,      │ ← body (text-body)
│  your team, your best work. I'll use    │
│  these everywhere.                      │
│                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐           │
│  │      │ │      │ │  +   │           │ ← photo grid (uploaded + add)
│  │ img1 │ │ img2 │ │ Add  │           │
│  │      │ │      │ │      │           │
│  └──────┘ └──────┘ └──────┘           │
│  ┌──────┐ ┌──────┐ ┌──────┐           │
│  │      │ │      │ │      │           │
│  │ img3 │ │ img4 │ │ img5 │           │
│  │      │ │      │ │      │           │
│  └──────┘ └──────┘ └──────┘           │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ What makes you special? (opt.)  │    │ ← TextInput (single line, optional)
│  └─────────────────────────────────┘    │
│                                         │
│  💡 the more photos you share, the      │ ← hint (text-caption, slate)
│     better your site and posts will     │
│     look                                │
│                                         │
│           [  Continue  ]                │ ← Button (primary)
│                                         │
└─────────────────────────────────────────┘
```

### PhotoUploader Spec

- Grid: 3 columns, `aspect-ratio: 1` per cell
- Gap: `8px`
- Empty "Add" cell: dashed border (`var(--border-default)`, dashed), `+` icon (32px, slate), tap opens system photo picker
- Uploaded photo: `object-fit: cover`, `var(--radius-sm)` border radius
- Remove button: `X` icon, 24px, semi-transparent overlay in top-right corner of each photo. Requires tap (not swipe) to prevent accidents.
- Photo sources: camera roll (default), direct camera capture (second option in picker), Google Business Profile import (if photos found in Step 2 — show "Use photos from Google" button above grid)
- Max 6 photos in v1
- Minimum 3 photos to proceed. If fewer than 3 on "Continue" tap: `"A few more photos will make your site and posts look great. Can you add at least 3?"` — not a modal, inline text below grid in terracotta.
- Upload: images are compressed client-side to max 1200px width, JPEG 80% quality before upload. Show progress indicator per photo.

### Copy

- Heading: `"Now show me what makes your business special."`
- Body: `"Upload a few photos — your space, your team, your best work. I'll use these everywhere."`
- Optional input placeholder: `"What makes you special? (optional)"` with example: `"e.g., 'Tex-Mex from scratch on South Lamar since 2019'"`
- Hint: `"the more photos you share, the better your site and posts will look"`
- Button: `"Continue"`

### Error States

| Error | Display |
|---|---|
| Photo upload fails | Show retry icon on the failed photo thumbnail. `"That photo didn't upload. Tap to try again."` |
| Camera permission denied | Show only camera roll option. No error message — graceful degradation. |
| File too large (>20MB) | `"That photo is pretty large. Let me resize it."` — auto-compress and retry. |

---

## Screen 4: "One More Thing"

**ProgressBar**: `0.8`
**Duration target**: 30 seconds

### Layout

```
┌─────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░ 80%   │
│                                         │
│ ← Back                                  │
│                                         │
│                                         │
│  What matters most to you               │ ← heading (text-h1)
│  right now?                             │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  🔍  Get found online               ││ ← PrioritySelector option 1
│  │      I need people to find me       ││
│  │      on Google                      ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  ⭐  Manage my reviews              ││ ← PrioritySelector option 2
│  │      I need help with reviews       ││
│  │      and reputation                 ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  📱  Stay active on social          ││ ← PrioritySelector option 3
│  │      I need to post more            ││
│  │      consistently                   ││
│  └─────────────────────────────────────┘│
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

### PrioritySelector Spec

Three large, tappable cards. Single-select. Tapping one immediately advances to Step 5 (no "Continue" button needed — the selection IS the action).

| Option | Icon | Label | Sublabel |
|---|---|---|---|
| `seo` | 🔍 (or Lucide: `Search`) | `"Get found online"` | `"I need people to find me on Google"` |
| `reviews` | ⭐ (or Lucide: `Star`) | `"Manage my reviews"` | `"I need help with reviews and reputation"` |
| `social` | 📱 (or Lucide: `Share2`) | `"Stay active on social"` | `"I need to post more consistently"` |

- Card dimensions: full width, `min-height: 80px`
- Background: `var(--surface-elevated)`, `var(--shadow-sm)`
- Border radius: `var(--radius-md)`
- Padding: `16px 20px`
- Icon: `32px`, left-aligned
- Label: `text-h2`, charcoal
- Sublabel: `text-body`, slate
- Hover/focus: `var(--color-terracotta-light)` background
- Selected (brief flash before transition): `var(--color-terracotta-light)` background, `2px solid var(--color-terracotta)` border
- Gap between cards: `12px`

### Behavior

- Single tap advances to Step 5 after 300ms (allows visual feedback before transition)
- No "Continue" button. The tap IS the action. Per product-design.md: "One choice. Not a checklist."
- Selection stored as `user.onboarding_priority: 'seo' | 'reviews' | 'social'`
- This value determines: initial Weekly Digest focus, first recommended actions, the primary metric shown in Digest trend chart

---

## Screen 5: "The Reveal" — The iPhone Moment

**ProgressBar**: `1.0`
**Duration target**: 60 seconds

This is the conversion event. The moment Maria sees her business look professional for the first time.

### Phase 5A: Loading (3-8 seconds)

```
┌─────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%  │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│           Maria's Kitchen               │ ← business name (text-display)
│                                         │   animated: fades in letter by letter
│          ┌───────────────┐              │   or assembled like a painted sign
│          │  ~~~ glow ~~~ │              │
│          └───────────────┘              │ ← LoadingGlow (fullscreen variant)
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

- Centered layout. Nothing else on screen except ProgressBar (full) and the business name.
- Business name: `text-display` (28px, 600 weight), charcoal, centered
- Animation: name assembles letter by letter over 1.5 seconds, then LoadingGlow pulses beneath it
- Background: `var(--surface-primary)` — warm white, calm, unhurried
- This phase runs while final generation APIs complete. Minimum display time: 3 seconds (even if APIs are faster — the moment needs to breathe). Maximum: 8 seconds before showing partial results.

### Phase 5B: The Reveal (Main Screen)

```
┌─────────────────────────────────────────┐
│                                         │
│  Here's what I built for you.           │ ← heading (text-h1), fade-in
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  🌐  YOUR WEBSITE                   ││ ← RevealPreview card 1
│  │  ┌─────────────────────────────┐    ││
│  │  │                             │    ││
│  │  │   [Website screenshot]      │    ││ ← live site thumbnail
│  │  │                             │    ││
│  │  └─────────────────────────────┘    ││
│  │  mariaskitchenatx.com               ││
│  │  [View Site]           [Edit]       ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  📱  YOUR FIRST POST                ││ ← RevealPreview card 2
│  │  ┌─────────────────────────────┐    ││
│  │  │   [Social post preview]     │    ││ ← SocialPostPreview component
│  │  └─────────────────────────────┘    ││
│  │  [Post Now]            [Edit]       ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  ⭐  YOUR GOOGLE LISTING            ││ ← RevealPreview card 3
│  │  Updated description + keywords     ││
│  │  Response drafted for latest review ││
│  │  [Looks Good]          [Edit]       ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  💡  FIRST CAMPAIGN                  ││ ← RevealPreview card 4
│  │  "Ask your 5 most recent customers  ││
│  │   for a Google review"              ││
│  │  [Start Campaign]      [Later]      ││
│  └─────────────────────────────────────┘│
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │   [  Looks good — publish everything ] │ ← Button (primary, full-width)
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### RevealPreview Cards

Each card animates in with `fadeUp` (200ms), staggered 150ms apart:
- Card 1 (Website): appears at 0ms
- Card 2 (Social post): appears at 150ms
- Card 3 (Google listing): appears at 300ms
- Card 4 (Campaign): appears at 450ms

Card specs:
- Background: `var(--surface-elevated)`, `var(--shadow-md)`
- Border radius: `var(--radius-lg)` (16px)
- Padding: `var(--space-card-padding)` (20px)
- Section label: `text-caption`, uppercase, `letter-spacing: 0.05em`, slate
- Each card has exactly 2 buttons (per product-design.md): primary action + "Edit" or "Later"

### Copy

- Loading text: none (just the business name and glow)
- Reveal heading: `"Here's what I built for you."`
- Website section label: `"YOUR WEBSITE"`
- Website URL: `"{businessname}.com"` or generated subdomain
- Social post label: `"YOUR FIRST POST"`
- Google listing label: `"YOUR GOOGLE LISTING"`
- Campaign label: `"FIRST CAMPAIGN"`
- Campaign suggestion (varies by Step 4 priority):
  - `seo` → `"Ask your 5 most recent customers for a Google review"`
  - `reviews` → `"Respond to your latest reviews and ask happy customers for more"`
  - `social` → `"Post your best dish photo with a story about why it's special"`
- Master button: `"Looks good — publish everything"`

### Master "Publish Everything" Button

- Tapping this: publishes website, posts social content, applies Google Business Profile optimization, initiates campaign. All with a single tap.
- After tap: button transforms to sage green with checkmark animation (300ms, spring easing). Text changes to `"Published! Welcome to LocalGenius."`
- After 2 seconds: transitions to the main ConversationThread view. Onboarding is complete. BottomNav appears. The product begins.

### Post-Reveal Transition

- `AppShell.showNav = true` — BottomNav fades in (200ms)
- Thread contains the first system message (per product-design.md):
  > "Your site is live at mariaskitchenatx.com — 3 people have already visited. I'll post your first social update tomorrow morning. In the meantime, I drafted responses to your 2 most recent Google reviews. Want to take a look?"
- This is the seamless handoff from onboarding to product. No tutorial. No "here's how to use the app." Just: the work has already started.

### Error States

| Error | Display |
|---|---|
| Website generation failed | Show card without screenshot: `"Your website is almost ready — I'll have it live within the hour. I'll let you know."` Remove "View Site" button, keep "Edit." |
| Social post generation failed | Show placeholder: `"I'm still working on your first post. It'll be in your thread shortly."` |
| Google API timeout | `"Your Google listing updates can take 24-48 hours to appear. I've submitted the changes — I'll confirm when they're live."` |
| All generation failed | `"I hit a snag setting things up. Give me a few minutes and check back — everything will be in your thread."` Transition to ConversationThread. Send update messages as each item completes. |
| Partial results | Show what's ready, placeholder for what's not. The reveal still works with 2 of 4 items. The conversation thread delivers the rest. |

---

## Data Flow Summary

```
Step 1 (input)    → business_name, business_type, city
Step 2 (confirm)  → discovered_profiles, confirmed_address, existing_reviews
Step 3 (photos)   → uploaded_photos[], business_description
Step 4 (priority) → onboarding_priority: 'seo' | 'reviews' | 'social'
Step 5 (reveal)   → generated_website, social_post_draft, gbp_optimization, campaign_suggestion
```

### API Call Timeline

| Trigger | API Calls | Expected Duration |
|---|---|---|
| Step 1 → Step 2 transition | Google Business Profile, Yelp, Facebook, Instagram discovery | 2-5 seconds |
| Step 2 "That's me" confirmation | Website template selection, begin content generation | Background, 10-30 seconds |
| Step 3 "Continue" | Upload photos, begin social post generation with photos | Background, 5-15 seconds |
| Step 4 priority selection | Finalize website, finalize social post, generate GBP optimization, generate campaign | Background, 5-20 seconds |
| Step 5 loading phase | Wait for all generation to complete (or timeout at 8 seconds) | 3-8 seconds visible |

Total background processing: 20-70 seconds, overlapped with user interaction time (Steps 2-4 take 2-3 minutes). By the time Maria reaches Step 5, most generation is complete.

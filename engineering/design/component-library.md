# LocalGenius — Component Library

**Engineering Spec v1.0**
**Source of truth**: product-design.md + design-tokens.md
**Framework**: React Native (mobile) + React (web, same component API)

---

## Component Index

| # | Component | Parent Context | Priority |
|---|---|---|---|
| 1 | `AppShell` | Root layout | P0 |
| 2 | `BottomNav` | AppShell | P0 |
| 3 | `ConversationThread` | AppShell > Thread tab | P0 |
| 4 | `MessageBubble` | ConversationThread | P0 |
| 5 | `ApprovalCard` | ConversationThread | P0 |
| 6 | `ReportCard` | ConversationThread | P0 |
| 7 | `TextInput` | ConversationThread (bottom-anchored) | P0 |
| 8 | `WeeklyDigest` | AppShell > Digest tab | P0 |
| 9 | `DigestSection` | WeeklyDigest | P0 |
| 10 | `MetricHighlight` | DigestSection / ReportCard | P0 |
| 11 | `TrendLine` | WeeklyDigest | P1 |
| 12 | `OnboardingFlow` | Full-screen overlay | P0 |
| 13 | `OnboardingStep` | OnboardingFlow | P0 |
| 14 | `BusinessTypeGrid` | OnboardingStep (step 1) | P0 |
| 15 | `BusinessProfileCard` | OnboardingStep (step 2) | P0 |
| 16 | `PhotoUploader` | OnboardingStep (step 3) | P0 |
| 17 | `PrioritySelector` | OnboardingStep (step 4) | P0 |
| 18 | `RevealPreview` | OnboardingStep (step 5) | P0 |
| 19 | `ReviewCard` | ConversationThread / Digest | P0 |
| 20 | `SocialPostPreview` | ApprovalCard / RevealPreview | P0 |
| 21 | `NotificationToast` | AppShell (overlay) | P1 |
| 22 | `ProgressBar` | OnboardingFlow | P1 |
| 23 | `Button` | Everywhere | P0 |
| 24 | `LoadingGlow` | Everywhere | P1 |

---

## 1. AppShell

The root layout container. Two zones: content area (scrollable) and bottom navigation bar (fixed).

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `activeTab` | `'thread' \| 'digest'` | `'thread'` | Which tab is active |
| `children` | `ReactNode` | — | Content for active tab |
| `showNav` | `boolean` | `true` | Hide during onboarding |

### Layout

```
┌────────────────────────────┐
│                            │
│         Content Area       │
│      (scrollable, flex-1)  │
│                            │
│                            │
├────────────────────────────┤
│  [Thread icon]  [Digest]   │  ← BottomNav (fixed, 60px height)
└────────────────────────────┘
```

- Content area: `flex: 1`, `overflow-y: auto`, `padding: 0` (children manage their own padding)
- Background: `var(--surface-primary)` / `bg-warm-white`
- Safe area insets: respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` on iOS

### Accessibility

- Tab navigation via `role="tablist"` on BottomNav, `role="tabpanel"` on content area
- Active tab announced via `aria-selected="true"`

---

## 2. BottomNav

Two icons only. Per product-design.md: "If we ever feel the need for a third icon, we've failed."

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `activeTab` | `'thread' \| 'digest'` | — | Currently active tab |
| `onTabChange` | `(tab: string) => void` | — | Tab selection callback |
| `digestBadge` | `boolean` | `false` | Show unread dot on Digest icon |

### Layout

- Height: `60px` + `env(safe-area-inset-bottom)`
- Background: `var(--surface-elevated)` / `#FFFFFF`
- Top border: `var(--border-subtle)`
- Two icons centered, each in a `48px × 48px` tap target
- Active icon: `var(--color-terracotta)`, filled variant
- Inactive icon: `var(--color-slate)`, outline variant
- Icon size: `24px` (per `--icon-size-md`)
- Label below icon: `var(--text-small)`, 4px gap

### Icons

- Thread: Speech bubble (Lucide: `MessageSquare`)
- Digest: Bar chart trending up (Lucide: `TrendingUp`)

### States

| State | Appearance |
|---|---|
| Active | Terracotta fill, terracotta label |
| Inactive | Slate outline, slate label |
| Digest badge | 8px terracotta dot, top-right of Digest icon |

---

## 3. ConversationThread

The core product surface. A reverse-chronological scrolling list of messages, cards, and reports.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `messages` | `ThreadMessage[]` | `[]` | Array of thread items |
| `isLoading` | `boolean` | `false` | Show typing indicator at bottom |
| `onScrollTop` | `() => void` | — | Infinite scroll — load older messages |

### `ThreadMessage` Type

```typescript
type ThreadMessage = {
  id: string;
  type: 'user_message' | 'system_message' | 'approval_card' | 'report_card' | 'review_card';
  timestamp: string; // ISO 8601
  content: string;
  metadata?: Record<string, any>; // type-specific data
  status?: 'pending' | 'approved' | 'dismissed' | 'published' | 'scheduled';
};
```

### Layout

- Full-width, vertical scroll
- Padding: `var(--space-screen-margin)` left/right
- Gap between messages: `var(--space-content-gap)` (24px)
- New messages animate in with `fadeUp` animation (`200ms`, `var(--easing-enter)`)
- Scroll position preserved on app resume (interruption-resilient per product-design.md)
- Input bar fixed at bottom (see TextInput component)

### Behavior

- **Auto-scroll**: When a new system message arrives and user is within 100px of bottom, auto-scroll to show it. If user has scrolled up (reading history), do NOT auto-scroll — show a "New message ↓" pill at bottom instead.
- **Pull-to-refresh**: Not supported. Thread updates via real-time push. No manual refresh.
- **Empty state**: First-time thread after onboarding shows the post-onboarding welcome message (product-design.md, Post-Onboarding section).

### Accessibility

- `role="log"` with `aria-live="polite"` for new messages
- Each message has `role="article"` with `aria-label` describing the content type
- Timestamps announced as relative ("5 minutes ago") via `aria-label`

---

## 4. MessageBubble

Renders text-only messages — both user input and system text responses.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'user' \| 'system'` | — | Determines alignment and styling |
| `content` | `string` | — | Message text (supports basic markdown: bold, italic, line breaks) |
| `timestamp` | `string` | — | ISO timestamp |
| `showTimestamp` | `boolean` | `false` | Show timestamp below bubble (shown on tap or for first/last in group) |

### Visual Specs

**User message:**
- Alignment: right-aligned
- Background: `var(--color-terracotta-light)` / `bg-terracotta-light`
- Text: `var(--text-primary)` / `text-charcoal`
- Border radius: `var(--radius-md)` with bottom-right corner `var(--radius-sm)` (chat tail)
- Max width: `80%` of container
- Padding: `12px 16px`

**System message:**
- Alignment: left-aligned
- Background: `var(--surface-card)` / `bg-cream`
- Text: `var(--text-primary)` / `text-charcoal`
- Border radius: `var(--radius-md)` with bottom-left corner `var(--radius-sm)` (chat tail)
- Max width: `85%` of container
- Padding: `12px 16px`

**Timestamp:**
- Text: `var(--text-caption)`, `var(--text-secondary)` color
- Alignment: matches bubble alignment
- Margin top: `4px`

### States

| State | Behavior |
|---|---|
| Sending (user) | Show bubble immediately with `opacity: 0.7`, set to `1.0` on server confirmation |
| Failed (user) | Show error icon (Lucide: `AlertCircle`) in terracotta, tap to retry |
| Typing (system) | Three-dot pulsing animation in a system-colored bubble |

---

## 5. ApprovalCard

The most important interactive component. Presents a proposed action with one-tap approve.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | What this action is ("Social post for your lunch special") |
| `description` | `string` | — | Brief explanation of what will happen |
| `preview` | `ReactNode \| null` | `null` | Optional rich preview (social post image, review text, email preview) |
| `primaryAction` | `{ label: string; onPress: () => void }` | — | Primary button (e.g., "Approve", "Post Now", "Send It") |
| `secondaryAction` | `{ label: string; onPress: () => void }` | — | Secondary button (e.g., "Edit", "Skip") |
| `tertiaryAction` | `{ label: string; onPress: () => void } \| null` | `null` | Optional third action (e.g., "Schedule for 11:30am"). Per product-design.md: "Never three buttons" — use only when one action is a scheduling variant |
| `status` | `'pending' \| 'approved' \| 'dismissed' \| 'published' \| 'scheduled'` | `'pending'` | Current state |
| `scheduledTime` | `string \| null` | `null` | If scheduled, display time |
| `timestamp` | `string` | — | When the card was created |

### Layout

```
┌─────────────────────────────────────┐
│ 💬 Social post for your lunch special│ ← title (text-h2, charcoal)
│                                     │
│ I'll put it on Instagram and        │ ← description (text-body, charcoal)
│ Facebook at 11:30am.                │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │     [Social post preview]       │ │ ← preview area (optional)
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [  Post Now  ]    [ Edit ]          │ ← action buttons
│                                     │
│ 2 minutes ago                       │ ← timestamp (caption, slate)
└─────────────────────────────────────┘
```

- Background: `var(--surface-elevated)` / `#FFFFFF`
- Border radius: `var(--radius-md)` (12px)
- Shadow: `var(--shadow-md)`
- Padding: `var(--space-card-padding)` (20px)
- Gap between elements: `var(--space-card-gap)` (12px)
- Full width minus screen margins
- Primary button: `bg-terracotta`, `text-inverse`, `height: 56px`, `border-radius: var(--radius-sm)`
- Secondary button: `bg-transparent`, `text-terracotta`, `border: var(--border-default)`, `height: 56px`
- Buttons side by side: primary takes 60% width, secondary takes 40%

### States

| State | Appearance |
|---|---|
| Pending | Full card with action buttons visible |
| Approved | Buttons replaced with "Approved ✓" in sage + checkmark animation (300ms, spring easing). Card height collapses smoothly. |
| Published | "Posted ✓" label with timestamp of publication |
| Scheduled | "Scheduled for 11:30am ✓" with clock icon. Tap to reschedule or cancel. |
| Dismissed | Card fades out (200ms), removed from thread |

### Accessibility

- `role="article"` with `aria-label="Action requiring your approval: [title]"`
- Primary button: `aria-label="Approve: [title]"`
- Status changes announced via `aria-live="polite"`

---

## 6. ReportCard

Displays information about results — no action required.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `string` | — | Narrative text ("12 people booked through your website...") |
| `metrics` | `MetricHighlight[]` | `[]` | Optional key metrics to display prominently |
| `expandable` | `boolean` | `false` | Show "See details" toggle |
| `expandedContent` | `string \| null` | `null` | Detail text shown on expand |
| `timestamp` | `string` | — | When this report was generated |

### Layout

- Background: `var(--surface-card)` / `bg-cream`
- Border radius: `var(--radius-md)`
- Shadow: `var(--shadow-sm)` (lighter than ApprovalCard — no action needed)
- Padding: `var(--space-card-padding)`
- Metrics display inline: number in `text-display` weight, context in `text-body`
- Expandable: "See details" link in `text-caption`, terracotta color. Expanded content slides down (200ms).

---

## 7. TextInput

Bottom-anchored input bar for the conversational interface.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | `''` | Current input text |
| `onChange` | `(text: string) => void` | — | Text change handler |
| `onSubmit` | `(text: string) => void` | — | Send message handler |
| `onVoiceStart` | `() => void` | — | Voice recording start (long-press mic) |
| `onVoiceEnd` | `() => void` | — | Voice recording end |
| `placeholder` | `string` | `'Talk to LocalGenius...'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable during processing |
| `draft` | `string \| null` | `null` | Restored draft text (interruption-resilient) |

### Layout

```
┌──────────────────────────────────────────┐
│ [Talk to LocalGenius...]        [🎤] [→] │
└──────────────────────────────────────────┘
```

- Position: fixed to bottom of screen, above BottomNav
- Background: `var(--surface-elevated)` / `#FFFFFF`
- Top border: `var(--border-subtle)`
- Padding: `8px var(--space-screen-margin) 8px`
- Inner: text field takes remaining width; mic button right; send button right of mic (appears when text is entered)
- Text field: `min-height: 44px`, expands to `max-height: 120px` (multi-line input), auto-grow
- Mic button: `44×44px`, Lucide `Mic` icon, slate color, long-press activates voice
- Send button: `44×44px`, Lucide `ArrowUp` icon, terracotta fill, circular. Only visible when `value.length > 0`
- Keyboard: pushes the entire input bar up, content scrolls to maintain position

### Behavior

- **Auto-save drafts**: If user types but doesn't send, draft persists across app close/open (stored in local state)
- **Voice input**: Long-press mic shows recording indicator (pulsing terracotta dot). Release sends audio for transcription. Transcribed text appears in input field for review before sending.
- **Submit**: Enter key on hardware keyboard OR tap send button. Shift+Enter for newline on desktop.

---

## 8. WeeklyDigest

Full-screen view for the three-act Weekly Digest.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `businessName` | `string` | — | "Maria's Kitchen" |
| `weekOf` | `string` | — | "March 24 – 30, 2026" |
| `sections` | `DigestSection[]` | — | The three acts |
| `trendData` | `TrendPoint[]` | `[]` | Data for the single trend chart |
| `trendMetric` | `string` | — | What the chart shows ("Website visits") |
| `recommendation` | `DigestRecommendation \| null` | — | Act 3 actionable recommendation |

### Layout

```
┌─────────────────────────────────────┐
│ Good morning, Maria.                │ ← greeting (text-h1)
│ This week at Maria's Kitchen        │ ← subhead (text-body, slate)
│ March 24 – 30                       │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ HERE'S WHAT HAPPENED            │ │ ← Act 1 section
│ │ 340 visits (up 12%)             │ │
│ │ 4 new reviews ⭐⭐⭐⭐           │ │
│ │ 23 bookings                     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Trend line chart]              │ │ ← single chart (optional)
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ HERE'S WHAT I DID               │ │ ← Act 2 section
│ │ • Posted 3x on Instagram...     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ HERE'S WHAT I RECOMMEND         │ │ ← Act 3 section
│ │ [Preview Email] [Send It] [Skip]│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

- Scrollable, full-screen view within the Digest tab
- Background: `var(--surface-primary)` / `bg-warm-white`
- Section gap: `var(--space-section-gap)` (32px)
- Max 5 numbers in entire digest (per product-design.md)
- Trend chart: max height 120px, uses `--color-terracotta` for line, `--color-terracotta-light` for fill
- 90-second read time target: content must be scannable
- Recommendation section includes inline action buttons (same as ApprovalCard buttons)

---

## 9. ReviewCard

Displays a review with the AI-drafted response.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `reviewerName` | `string` | — | "Sarah M." |
| `rating` | `1 \| 2 \| 3 \| 4 \| 5` | — | Star rating |
| `reviewText` | `string` | — | The customer's review text |
| `platform` | `'google' \| 'yelp'` | — | Review source |
| `draftResponse` | `string` | — | AI-drafted response |
| `status` | `'pending' \| 'approved' \| 'sent' \| 'auto_sent'` | — | Response status |
| `onApprove` | `() => void` | — | Approve the draft response |
| `onEdit` | `() => void` | — | Edit the draft response |
| `isNegative` | `boolean` | — | `rating <= 3` — always requires approval per product-design.md |

### Layout

- Background: `var(--surface-elevated)` / `#FFFFFF`
- Border-left: `3px solid` — `var(--color-gold)` for 4-5 stars, `var(--color-error)` for 1-3 stars
- Star display: filled gold stars using `var(--color-gold)`, empty stars using `var(--color-slate-light)`
- Review text in `text-body`, italicized
- "My response:" label in `text-caption`, followed by draft response in `text-body`
- Action buttons: [Approve] [Edit] — same pattern as ApprovalCard
- Platform icon: Google "G" or Yelp burst, 16px, `var(--color-slate)`, next to reviewer name

---

## 10. SocialPostPreview

Renders a preview of a social media post as it will appear on Instagram/Facebook.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `image` | `string` | — | Image URL |
| `caption` | `string` | — | Post copy |
| `hashtags` | `string[]` | `[]` | Hashtag list |
| `platforms` | `('instagram' \| 'facebook' \| 'google')[]` | — | Where this will be posted |
| `scheduledTime` | `string \| null` | `null` | If scheduled, show time |

### Layout

- Container: `var(--radius-md)` border radius, `overflow: hidden`
- Image: full-width, `aspect-ratio: 1` (square, Instagram standard), `object-fit: cover`
- Caption below image: `text-body`, max 3 lines with "...see more" truncation
- Hashtags: `text-caption`, `var(--color-terracotta)`, truncated with "+3 more"
- Platform icons row: small icons (16px) showing where it will post
- "Posted by LocalGenius" watermark: `text-small`, `var(--color-slate-light)`, bottom-right of image. Removable on Pro tier.

---

## 11. NotificationToast

Overlays the current screen for brief, actionable notifications.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `message` | `string` | — | Single sentence (per product-design.md: "maximum one sentence per notification") |
| `action` | `{ label: string; onPress: () => void } \| null` | `null` | Optional single action ("View") |
| `variant` | `'default' \| 'negative' \| 'success' \| 'milestone'` | `'default'` | Determines accent color |
| `duration` | `number` | `4000` | Auto-dismiss in ms. `0` = persistent until dismissed. |
| `onDismiss` | `() => void` | — | Dismiss callback |

### Layout

- Position: top of screen, below status bar, overlaying content
- Width: `calc(100% - 2 * var(--space-screen-margin))`
- Background: `var(--surface-elevated)` with `var(--shadow-lg)`
- Border radius: `var(--radius-md)`
- Padding: `12px 16px`
- Left accent bar: `3px`, color based on variant (terracotta default, error for negative, sage for success, gold for milestone)
- Message: `text-body`, single line, `text-overflow: ellipsis`
- Action button: right-aligned, `text-button`, terracotta
- Entry: slide down from top + fade (200ms, `var(--easing-enter)`)
- Exit: slide up + fade (200ms, `var(--easing-exit)`)
- Swipe-up to dismiss

### Accessibility

- `role="alert"` with `aria-live="assertive"` for negative reviews
- `aria-live="polite"` for all other variants
- Action button receives focus automatically when toast appears

---

## 12. Button

Shared button component used across all contexts.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'default' \| 'small'` | `'default'` | Height: default=56px, small=44px |
| `label` | `string` | — | Button text |
| `icon` | `ReactNode \| null` | `null` | Optional leading icon |
| `onPress` | `() => void` | — | Press handler |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Show loading indicator |
| `fullWidth` | `boolean` | `false` | Stretch to container width |

### Variants

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| `primary` | `var(--color-terracotta)` | `#FFFFFF` | none | `var(--color-terracotta-hover)` |
| `secondary` | `transparent` | `var(--color-terracotta)` | `var(--border-default)` | `var(--color-terracotta-light)` bg |
| `ghost` | `transparent` | `var(--color-terracotta)` | none | `var(--color-terracotta-light)` bg |
| `danger` | `transparent` | `var(--color-error)` | `1px solid var(--color-error)` | `var(--color-error-light)` bg |

### Specs

- Font: `var(--text-button)` — 16px, weight 600, letter-spacing 0.01em
- Border radius: `var(--radius-sm)` (6px)
- Min height: `56px` (default), `44px` (small)
- Padding: `var(--space-button-padding-y) var(--space-button-padding-x)` — 14px 24px
- Transition: background `var(--duration-instant)` `var(--easing-default)`
- Active state: scale `0.98` for tactile feel
- Loading: replace label with `LoadingGlow` animation, maintain button dimensions

---

## 13. LoadingGlow

The warm pulsing loading state. Per product-design.md: "a warm pulsing glow, not a spinner."

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'inline' \| 'card' \| 'fullscreen'` | `'card'` | Determines dimensions |
| `label` | `string \| null` | `null` | Optional accessible label |

### Visual

- Inline (within buttons): `16px` circle, `var(--color-terracotta-light)`, `pulseGlow` animation
- Card (skeleton loading): rounded rectangle matching card dimensions, `var(--color-cream)` with `var(--color-terracotta-light)` gradient sweep
- Fullscreen (onboarding reveal): centered `var(--color-terracotta-light)` gradient with business name appearing in `text-h1` — "like a sign being painted" per product-design.md
- Animation: `pulseGlow` keyframes, `1500ms` duration, `ease-in-out`, infinite
- Respects `prefers-reduced-motion`: shows static `var(--color-cream)` block with "Loading..." text

---

## 14. ProgressBar

Minimal progress indicator for onboarding flow.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `progress` | `number` | `0` | Value between 0 and 1 |

### Visual

Per product-design.md: "a simple line at the top, not a step counter."

- Position: top of onboarding screen, full width
- Height: `3px`
- Background track: `var(--color-cream)`
- Fill: `var(--color-terracotta)`
- Transition: width `var(--duration-normal)` `var(--easing-default)`
- No step numbers. No labels. No dots. Just the line.

### Progress Values by Step

| Step | Progress |
|---|---|
| Step 1 (Business info) | `0.2` |
| Step 2 (Discovery card) | `0.4` |
| Step 3 (Photos) | `0.6` |
| Step 4 (Priority) | `0.8` |
| Step 5 (Reveal) | `1.0` |

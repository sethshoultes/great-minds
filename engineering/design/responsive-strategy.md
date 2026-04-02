# LocalGenius — Responsive Strategy

**Engineering Spec v1.0**
**Source of truth**: product-design.md (Section 6: Mobile-First Principles)
**Design principle**: The phone is the product. Desktop is the phone with more whitespace.

---

## 1. Breakpoint System

Mobile-first: base styles target the smallest screen. Media queries add complexity upward.

| Token | Breakpoint | Target | CSS Media Query |
|---|---|---|---|
| `--bp-mobile` | `0px` | Phones (default, no query needed) | Base styles |
| `--bp-mobile-lg` | `428px` | Large phones (iPhone Pro Max, Samsung Ultra) | `@media (min-width: 428px)` |
| `--bp-tablet` | `768px` | iPad portrait, Android tablets | `@media (min-width: 768px)` |
| `--bp-desktop` | `1024px` | iPad landscape, laptops, desktops | `@media (min-width: 1024px)` |
| `--bp-desktop-lg` | `1280px` | Large monitors | `@media (min-width: 1280px)` |

### Tailwind Config

```js
screens: {
  'mobile-lg': '428px',
  'tablet': '768px',
  'desktop': '1024px',
  'desktop-lg': '1280px',
}
```

### Priority

Per product-design.md: "No features exist on desktop that don't exist on mobile. No 'for the full experience, use desktop.' The phone is the product."

- **v1 engineering priority**: Mobile (0-428px) and Large Mobile (428-768px). These are ~95% of usage.
- **v1 secondary**: Tablet (768-1024px). Supported, tested, but not optimized beyond layout adaptation.
- **v1 tertiary**: Desktop (1024px+). Functional, but the mobile layout centered in a wider viewport. No desktop-specific features.

---

## 2. Layout Adaptation by Breakpoint

### 2.1 Conversational Thread

| Property | Mobile (0-767px) | Tablet (768-1023px) | Desktop (1024px+) |
|---|---|---|---|
| Thread width | `100%` | `100%` | `max-width: 640px`, centered |
| Screen margins | `20px` | `32px` | Auto (centered content) |
| Message bubble max-width | User: `80%`, System: `85%` | User: `70%`, System: `75%` | User: `65%`, System: `70%` |
| Content gap | `24px` | `24px` | `24px` |
| Input bar | Fixed bottom, full width | Fixed bottom, full width | Fixed bottom, `max-width: 640px`, centered |
| BottomNav | Fixed bottom, full width | Fixed bottom, full width | Hidden — tabs in sidebar or top nav |

**Desktop thread container:**

```css
@media (min-width: 1024px) {
  .thread-container {
    max-width: 640px;
    margin: 0 auto;
    /* Thread floats in center of screen with warm-white background extending full width */
  }
}
```

### 2.2 Weekly Digest

| Property | Mobile (0-767px) | Tablet (768-1023px) | Desktop (1024px+) |
|---|---|---|---|
| Digest width | `100%` | `100%` | `max-width: 720px`, centered |
| Section card width | `100% - 2 × screen-margin` | `100% - 2 × 32px` | `max-width: 720px` |
| Trend chart height | `120px` | `160px` | `200px` |
| Metric number size | `text-display` (28px) | `32px` | `36px` |
| Section gap | `32px` | `40px` | `48px` |
| Greeting text | `text-h1` (20px) | `24px` | `28px` |

### 2.3 Onboarding Flow

| Property | Mobile (0-767px) | Tablet (768-1023px) | Desktop (1024px+) |
|---|---|---|---|
| Flow width | `100%` | `max-width: 560px`, centered | `max-width: 560px`, centered |
| Business type grid | 4 columns, tiles stretch | 4 columns, `88px` fixed | 4 columns, `96px` fixed |
| Photo grid | 3 columns | 3 columns | 3 columns, larger thumbnails |
| Priority selector cards | Full width | `max-width: 480px`, centered | `max-width: 480px`, centered |
| Reveal preview cards | Full width, stacked | Full width, stacked | 2-column grid (website + social on left, Google + campaign on right) |
| Master publish button | Full width | `max-width: 400px`, centered | `max-width: 400px`, centered |

### 2.4 ApprovalCard

| Property | Mobile (0-767px) | Tablet (768-1023px) | Desktop (1024px+) |
|---|---|---|---|
| Card width | `100% - 2 × screen-margin` | `100% - 2 × 32px` | `max-width: 600px` |
| Button layout | Side-by-side (60%/40%) | Side-by-side (60%/40%) | Side-by-side (60%/40%) |
| Preview image | Full card width | Full card width, `max-height: 300px` | Full card width, `max-height: 400px` |
| Social post preview | Square (1:1) | Square (1:1) | Square (1:1), `max-width: 400px` |

---

## 3. Touch Targets & Interaction

### 3.1 Minimum Touch Targets

Per product-design.md and Apple HIG:

| Element | Min Size | Mobile | Tablet | Desktop |
|---|---|---|---|---|
| Primary buttons | `56px` height | `56px` | `56px` | `48px` (mouse precision allows slightly smaller) |
| Secondary buttons | `44px` height | `44px` | `44px` | `40px` |
| Inline links | `44px` tap area | `44px` padding around hit area | `44px` | Standard cursor click |
| Navigation icons | `48px` | `48×48px` | `48×48px` | `40×40px` (hover state visible) |
| Close/dismiss buttons | `44px` | `44×44px` | `44×44px` | `32×32px` |

### 3.2 Gesture Support

| Gesture | Action | Context | Implementation |
|---|---|---|---|
| **Swipe left on card** | Dismiss / archive | ApprovalCard (when status = approved/published) | `translateX` with velocity-based threshold (>200px/s or >50% width) |
| **Swipe down on toast** | Dismiss notification | NotificationToast | `translateY` with 40px threshold |
| **Long press mic** | Start voice input | TextInput mic button | Haptic feedback on press, recording indicator on hold |
| **Pull down** | NOT supported (no pull-to-refresh) | Thread | Intentionally disabled — real-time push, no manual refresh |
| **Pinch zoom** | Standard on images | Photo previews in SocialPostPreview | Native image viewer on tap; pinch zoom within viewer |
| **Swipe right** | Back navigation | Onboarding steps | iOS edge swipe + Android back gesture |

### 3.3 Desktop-Specific Interactions

| Interaction | Desktop Behavior |
|---|---|
| Hover states | All interactive elements show hover state (background change per component spec) |
| Keyboard shortcut: Enter | Send message in TextInput |
| Keyboard shortcut: Shift+Enter | New line in TextInput |
| Keyboard shortcut: Tab | Navigate between interactive elements |
| Right-click | Native context menu (no custom menus in v1) |
| Mouse wheel | Scroll thread (natural scrolling) |

---

## 4. Thumb Zone Architecture

Per product-design.md: "Primary actions live in the bottom 40% of the screen."

### Mobile Screen Zones

```
┌─────────────────────────────┐
│                             │  ← TOP ZONE (0-30%)
│  Destructive / rare actions │     - Delete, cancel, back
│  Status information         │     - Timestamps, headers
│                             │
├─────────────────────────────┤
│                             │  ← MIDDLE ZONE (30-60%)
│  Content consumption        │     - Message reading
│  Scrolling content          │     - Card previews
│                             │
├─────────────────────────────┤
│                             │  ← THUMB ZONE (60-100%)
│  Primary actions            │     - Approve, Post, Send
│  Input                      │     - TextInput bar
│  Navigation                 │     - BottomNav
│                             │
└─────────────────────────────┘
```

### Implementation Rules

1. **Approve/Post/Send buttons**: Always rendered within the bottom 40% of the screen. If a card is long enough that buttons scroll above the thumb zone, pin buttons to the bottom of the card viewport.
2. **TextInput**: Fixed bottom, always in thumb zone. Never scrolls away.
3. **BottomNav**: Fixed bottom, below TextInput.
4. **Back/Close buttons**: Top-left corner (requires reach — intentional friction for destructive actions).
5. **Notification toasts**: Top of screen (out of thumb zone — visible but not accidentally tapped).

### Landscape Orientation

- Supported but not optimized. Layout remains vertical scroll.
- TextInput stays bottom-anchored.
- Keyboard in landscape takes ~60% of screen height. Thread scrolls to show latest content above keyboard.
- No special landscape layout in v1.

---

## 5. Keyboard Behavior on Mobile

### 5.1 Keyboard Appearance

| Trigger | Keyboard Type | Expected Height |
|---|---|---|
| TextInput focus (thread) | Standard text keyboard | ~260px (iPhone), ~240px (Android) |
| TextInput focus (onboarding — business name) | Standard text with autocapitalize | Same |
| TextInput focus (onboarding — description) | Standard text | Same |
| City edit field | Standard text with autocomplete | Same |

### 5.2 Layout Adjustment When Keyboard Opens

```
┌─────────────────────────────┐
│  Thread content              │  ← Scrolls up to keep latest
│  (compressed but visible)    │     messages visible above input
│                              │
│  Latest message visible      │
├──────────────────────────────┤
│  [TextInput bar]             │  ← Stays above keyboard
├──────────────────────────────┤
│                              │
│  [System keyboard]           │  ← ~260px on iPhone
│                              │
└──────────────────────────────┘
```

**Implementation:**

- **React Native (iOS)**: Use `KeyboardAvoidingView` with `behavior="padding"` and `keyboardVerticalOffset` equal to BottomNav height.
- **React Native (Android)**: Use `android:windowSoftInputMode="adjustResize"` in AndroidManifest. The OS handles resizing.
- **Web**: Use `visualViewport` API to detect keyboard height and adjust input position.

### 5.3 Rules

1. BottomNav is hidden when keyboard is open (TextInput replaces it visually at the bottom).
2. Thread auto-scrolls to the most recent message when keyboard opens.
3. Keyboard dismissal: tap outside input, or scroll up. Swipe-down on thread does NOT dismiss keyboard.
4. When keyboard opens during onboarding, the "Continue" button scrolls into view above the keyboard.

---

## 6. Weekly Digest — Cross-Device Rendering

### 6.1 In-App Digest

Renders within the Digest tab of the AppShell. Same component at all breakpoints, adapted by the responsive rules in Section 2.2.

### 6.2 Email Digest

The Weekly Digest is also sent as email. Email rendering has its own constraints:

| Property | Value |
|---|---|
| Max width | `600px` (standard email container) |
| Font | System sans-serif stack (Source Sans 3 not reliable in email clients) |
| Colors | Inline CSS only. Use hex values, not custom properties. |
| Layout | Single column, no CSS grid/flexbox (Gmail strips them) |
| Images | Hosted externally, max 600px wide, compressed JPEG/PNG |
| CTA button | Table-based button (Bulletproof Buttons pattern) using `bg-color: #C4704B`, `color: #FFFFFF` |
| Trend chart | Render as a static image (PNG), generated server-side. Not an interactive chart. |
| Dark mode | Use `@media (prefers-color-scheme: dark)` with inverted-safe colors. Charcoal → warm white, warm white → `#1A1A1A`. Terracotta remains (sufficient contrast on dark). |

### 6.3 Push Notification Digest

The Monday 7am digest notification:

| Platform | Format |
|---|---|
| iOS | Rich notification: title = "This week at Maria's Kitchen", body = first line of Act 1, thumbnail = trend chart mini. Expand for full digest inline. |
| Android | Expandable notification: collapsed = title + first line. Expanded = full Act 1 text. Tap opens Digest tab. |

---

## 7. Offline Behavior

Per product-design.md: "No error modals. No 'connection lost' alerts. Just graceful degradation."

### 7.1 What Works Offline

| Feature | Offline Behavior |
|---|---|
| **Read thread history** | Full thread cached locally. All previously loaded messages available. |
| **Read last Weekly Digest** | Last digest cached locally. Available offline. |
| **Type messages** | User can type in TextInput. Message queued with "Sending..." status. |
| **Approve pending cards** | User can tap Approve. Action queued with "Will send when connected" indicator. |
| **View onboarding progress** | If mid-onboarding, current step state preserved. |
| **View uploaded photos** | All user photos cached locally. |

### 7.2 What Requires Connection

| Feature | Offline Display |
|---|---|
| **Send messages** | Message appears in thread with `opacity: 0.7` and "Sending..." label. Sends on reconnect. |
| **Publish social posts** | Approval queued. Shows "Will publish when connected." |
| **View website preview** | Cached thumbnail if previously loaded. Otherwise: "Preview available when connected." |
| **Receive new messages** | Thread shows last-synced state. No new content until reconnected. |
| **Onboarding Steps 1-2** | Cannot search for business (requires API). Show: `"I need a connection to look up your business. You can still upload photos and I'll catch up."` Skip to Step 3. |
| **Onboarding Step 5** | Cannot generate website/post. Show: `"I need a connection to build your site. I'll have everything ready once you're back online."` |

### 7.3 Connectivity Indicator

- **Online**: No indicator shown. Default state is invisible.
- **Offline**: Subtle banner below status bar (not a modal, not a toast): `"Reconnecting..."` in `text-caption`, slate, `bg-cream`. Height: `28px`. Appears after 3 seconds of no connection (not instantly — avoid flashing on momentary drops).
- **Reconnected**: Banner changes to `"Back online"` in sage for 2 seconds, then fades out.
- **Queued actions execute**: When connection restores, all queued messages/approvals send in order. Each shows brief "Sent ✓" confirmation in thread.

### 7.4 Local Storage Strategy

| Data | Storage | Size Estimate | Eviction Policy |
|---|---|---|---|
| Thread messages (last 200) | SQLite / AsyncStorage | ~500KB | LRU, keep last 200 |
| Last Weekly Digest | SQLite / AsyncStorage | ~50KB | Replace on new digest |
| User photos (originals) | Device file system | ~10-30MB | Keep all uploaded photos |
| Business profile | SQLite / AsyncStorage | ~5KB | Overwrite on update |
| Pending actions queue | SQLite / AsyncStorage | ~10KB | Flush on successful send |
| Onboarding state | SQLite / AsyncStorage | ~2KB | Clear on onboarding complete |
| Auth token | Secure storage (Keychain/Keystore) | ~1KB | Per session policy |

**Total local storage**: ~30-50MB maximum. Well within device limits.

---

## 8. Performance Budgets

| Metric | Target | Measurement |
|---|---|---|
| First Contentful Paint (onboarding) | <1.5s | Lighthouse mobile, 4G throttled |
| Time to Interactive (thread) | <2.5s | Lighthouse mobile, 4G throttled |
| Thread scroll FPS | 60fps constant | React Native performance monitor |
| Onboarding Step 1 → Step 2 transition | <300ms (perceived) | API calls run in background; transition is instant |
| Image load (social post preview) | <1s (cached), <3s (first load) | Progressive JPEG, 400px width |
| Weekly Digest render | <500ms | From tab tap to full content visible |
| Input-to-send latency | <100ms (local), <1s (server ack) | Message appears immediately in thread, confirms on server response |
| App cold start to thread visible | <3s | Device native measurement |
| Bundle size (JS) | <2MB initial, <500KB per route | Webpack bundle analyzer |

### Image Optimization

| Context | Max Width | Format | Quality | Lazy Load |
|---|---|---|---|---|
| Social post preview (in thread) | `400px` | WebP with JPEG fallback | 80% | Yes — below fold |
| Website thumbnail (onboarding reveal) | `600px` | WebP with JPEG fallback | 85% | No — above fold |
| Business photos (photo grid) | `200px` (thumbnails), `1200px` (full) | WebP with JPEG fallback | 80% / 85% | Thumbnails eager, full lazy |
| Digest trend chart | `600px` | PNG (for email compatibility) | N/A | No — above fold |

---

## 9. Accessibility Across Devices

### 9.1 Screen Reader Support

| Platform | Screen Reader | Testing Required |
|---|---|---|
| iOS | VoiceOver | Required before v1 ship |
| Android | TalkBack | Required before v1 ship |
| Web/Desktop | NVDA, VoiceOver (macOS) | Best-effort in v1 |

### 9.2 Cross-Device Accessibility Requirements

| Requirement | Implementation |
|---|---|
| All images have `alt` text | Social post images: use AI-generated caption. Business photos: use filename or user-provided description. |
| All interactive elements keyboard-navigable | Tab order follows visual order. Focus ring visible (`var(--border-focus)`). |
| Color not sole indicator | All status states use icon + color. Stars use count + color. Errors use icon + color + text. |
| Reduced motion | `prefers-reduced-motion: reduce` disables all animations. Static alternatives shown. |
| Dynamic text sizing | All text in `rem` units. Respects system font size preference up to 200%. Layout does not break at 200% text size. |
| Minimum contrast | All text meets WCAG 2.1 AA (4.5:1 body, 3:1 large text). Verified in design-tokens.md. |
| Touch target size | 44px minimum on mobile/tablet (per Section 3.1). |
| Voice input | Available on all screens via TextInput mic button. Alternative to typing for all text fields. |

### 9.3 RTL Language Support

Not in v1. Token-based spacing (`margin-inline-start` vs `margin-left`) should be used where practical to reduce future RTL migration cost, but full RTL support is deferred.

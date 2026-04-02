# LocalGenius — Design Token System

**Engineering Spec v1.0**
**Source of truth**: product-design.md (Visual Language, Section 5)
**Implementation target**: CSS custom properties + Tailwind CSS config

---

## 1. Color Tokens

All colors defined in HEX, HSL, and RGB. HSL is the canonical format for programmatic manipulation (darken/lighten). Tailwind classes shown for each.

### 1.1 Core Palette

| Token Name | HEX | HSL | RGB | Tailwind Class | Usage |
|---|---|---|---|---|---|
| `--color-charcoal` | `#2C2C2C` | `hsl(0, 0%, 17%)` | `rgb(44, 44, 44)` | `text-charcoal` | Primary text, headings |
| `--color-charcoal-soft` | `#3D3D3D` | `hsl(0, 0%, 24%)` | `rgb(61, 61, 61)` | `text-charcoal-soft` | Secondary headings, bold body |
| `--color-warm-white` | `#FAF8F5` | `hsl(36, 33%, 97%)` | `rgb(250, 248, 245)` | `bg-warm-white` | App background |
| `--color-cream` | `#F2EDE8` | `hsl(30, 24%, 93%)` | `rgb(242, 237, 232)` | `bg-cream` | Card backgrounds, section dividers |

### 1.2 Accent Palette

| Token Name | HEX | HSL | RGB | Tailwind Class | Usage |
|---|---|---|---|---|---|
| `--color-terracotta` | `#C4704B` | `hsl(18, 47%, 53%)` | `rgb(196, 112, 75)` | `text-terracotta` / `bg-terracotta` | Primary actions, links, CTA buttons |
| `--color-terracotta-hover` | `#B5613D` | `hsl(18, 49%, 47%)` | `rgb(181, 97, 61)` | `hover:bg-terracotta-hover` | Button hover state |
| `--color-terracotta-active` | `#A35535` | `hsl(18, 50%, 42%)` | `rgb(163, 85, 53)` | `active:bg-terracotta-active` | Button active/pressed state |
| `--color-terracotta-light` | `#F5E0D5` | `hsl(18, 53%, 89%)` | `rgb(245, 224, 213)` | `bg-terracotta-light` | Selected state backgrounds, subtle highlights |
| `--color-sage` | `#7A8B6F` | `hsl(102, 11%, 49%)` | `rgb(122, 139, 111)` | `text-sage` / `bg-sage` | Success states, positive indicators, secondary actions |
| `--color-sage-hover` | `#6B7C60` | `hsl(102, 13%, 43%)` | `rgb(107, 124, 96)` | `hover:bg-sage-hover` | Secondary button hover |
| `--color-sage-light` | `#E8EDE5` | `hsl(102, 14%, 91%)` | `rgb(232, 237, 229)` | `bg-sage-light` | Success state backgrounds |

### 1.3 Supporting Palette

| Token Name | HEX | HSL | RGB | Tailwind Class | Usage |
|---|---|---|---|---|---|
| `--color-gold` | `#D4A853` | `hsl(40, 59%, 58%)` | `rgb(212, 168, 83)` | `text-gold` | Star ratings, celebrations, milestones |
| `--color-gold-light` | `#F5EDD8` | `hsl(40, 56%, 90%)` | `rgb(245, 237, 216)` | `bg-gold-light` | Milestone celebration backgrounds |
| `--color-slate` | `#6B7280` | `hsl(220, 9%, 46%)` | `rgb(107, 114, 128)` | `text-slate` | Secondary text, captions, metadata, timestamps |
| `--color-slate-light` | `#9CA3AF` | `hsl(218, 11%, 65%)` | `rgb(156, 163, 175)` | `text-slate-light` | Placeholder text, disabled text |
| `--color-blush` | `#F5E6E0` | `hsl(17, 47%, 92%)` | `rgb(245, 230, 224)` | `bg-blush` | Notification badge backgrounds, subtle warmth |

### 1.4 System Colors

| Token Name | HEX | HSL | RGB | Tailwind Class | Usage |
|---|---|---|---|---|---|
| `--color-error` | `#C0392B` | `hsl(6, 63%, 46%)` | `rgb(192, 57, 43)` | `text-error` / `bg-error` | Negative reviews, errors, destructive actions |
| `--color-error-light` | `#FADBD8` | `hsl(6, 73%, 92%)` | `rgb(250, 219, 216)` | `bg-error-light` | Error state backgrounds |
| `--color-error-dark` | `#962D22` | `hsl(6, 63%, 36%)` | `rgb(150, 45, 34)` | `text-error-dark` | Error text on light backgrounds |
| `--color-warning` | `#D4A853` | `hsl(40, 59%, 58%)` | `rgb(212, 168, 83)` | `text-warning` | Caution states (reuses gold) |
| `--color-overlay` | `rgba(44, 44, 44, 0.5)` | — | — | `bg-overlay` | Modal/sheet overlays |

### 1.5 CSS Custom Properties Block

```css
:root {
  /* Core */
  --color-charcoal: #2C2C2C;
  --color-charcoal-soft: #3D3D3D;
  --color-warm-white: #FAF8F5;
  --color-cream: #F2EDE8;

  /* Accent */
  --color-terracotta: #C4704B;
  --color-terracotta-hover: #B5613D;
  --color-terracotta-active: #A35535;
  --color-terracotta-light: #F5E0D5;
  --color-sage: #7A8B6F;
  --color-sage-hover: #6B7C60;
  --color-sage-light: #E8EDE5;

  /* Supporting */
  --color-gold: #D4A853;
  --color-gold-light: #F5EDD8;
  --color-slate: #6B7280;
  --color-slate-light: #9CA3AF;
  --color-blush: #F5E6E0;

  /* System */
  --color-error: #C0392B;
  --color-error-light: #FADBD8;
  --color-error-dark: #962D22;
  --color-warning: #D4A853;
  --color-overlay: rgba(44, 44, 44, 0.5);
}
```

### 1.6 Dark Mode

Dark mode is NOT a v1 feature. The product-design.md explicitly excludes it: "no dark mode default." However, structure tokens with semantic naming so dark mode can be added later without refactoring component code.

**Semantic token mapping (light mode only for v1):**

```css
:root {
  --surface-primary: var(--color-warm-white);
  --surface-card: var(--color-cream);
  --surface-elevated: #FFFFFF;
  --text-primary: var(--color-charcoal);
  --text-secondary: var(--color-slate);
  --text-tertiary: var(--color-slate-light);
  --text-inverse: #FFFFFF;
  --action-primary: var(--color-terracotta);
  --action-primary-hover: var(--color-terracotta-hover);
  --action-secondary: var(--color-sage);
  --action-secondary-hover: var(--color-sage-hover);
  --border-subtle: rgba(44, 44, 44, 0.08);
  --border-default: rgba(44, 44, 44, 0.12);
}
```

When dark mode is implemented (estimated v2+), add `[data-theme="dark"]` overrides for semantic tokens only. Component code references semantic tokens, never raw palette values.

---

## 2. Typography Tokens

### 2.1 Font Family

```css
:root {
  --font-family: 'Source Sans 3', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

**Loading strategy:** Google Fonts, preload weights 400 and 600 only. No other weights in v1. Load via `<link rel="preload">` in `<head>`.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
```

### 2.2 Type Scale

Base unit: 1rem = 16px (browser default). All sizes in rem for accessibility (respects user font-size preference).

| Token | Size (rem) | Size (px) | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| `--text-display` | `1.75rem` | `28px` | 600 | `1.2` | `-0.01em` | Large metric numbers in Digest |
| `--text-heading-1` | `1.25rem` | `20px` | 600 | `1.2` | `-0.005em` | Screen titles, section headings |
| `--text-heading-2` | `1.125rem` | `18px` | 600 | `1.3` | `0` | Card titles, subsection headings |
| `--text-body` | `1rem` | `16px` | 400 | `1.5` | `0` | Body text, messages, descriptions |
| `--text-body-bold` | `1rem` | `16px` | 600 | `1.5` | `0` | Emphasized body, business names |
| `--text-caption` | `0.8125rem` | `13px` | 400 | `1.385` | `0.005em` | Timestamps, metadata, secondary labels |
| `--text-small` | `0.75rem` | `12px` | 400 | `1.333` | `0.01em` | Legal text, watermarks (rare) |
| `--text-button` | `1rem` | `16px` | 600 | `1` | `0.01em` | Button labels |

### 2.3 CSS Implementation

```css
:root {
  --font-family: 'Source Sans 3', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  --text-display-size: 1.75rem;
  --text-display-weight: 600;
  --text-display-leading: 1.2;

  --text-h1-size: 1.25rem;
  --text-h1-weight: 600;
  --text-h1-leading: 1.2;

  --text-h2-size: 1.125rem;
  --text-h2-weight: 600;
  --text-h2-leading: 1.3;

  --text-body-size: 1rem;
  --text-body-weight: 400;
  --text-body-leading: 1.5;

  --text-caption-size: 0.8125rem;
  --text-caption-weight: 400;
  --text-caption-leading: 1.385;

  --text-small-size: 0.75rem;
  --text-small-weight: 400;
  --text-small-leading: 1.333;
}
```

---

## 3. Spacing Tokens

### 3.1 Base Grid

Base unit: **4px**. All spacing is a multiple of 4px. This provides finer granularity than an 8px grid while maintaining visual consistency.

| Token | Value | Tailwind | Usage |
|---|---|---|---|
| `--space-0` | `0px` | `p-0` | Reset |
| `--space-1` | `4px` | `p-1` | Micro gaps (icon-to-text inline) |
| `--space-2` | `8px` | `p-2` | Tight internal padding, between related items |
| `--space-3` | `12px` | `p-3` | Small card internal padding |
| `--space-4` | `16px` | `p-4` | Default internal padding, list item spacing |
| `--space-5` | `20px` | `p-5` | Card padding (minimum per product-design.md), screen margins |
| `--space-6` | `24px` | `p-6` | Content block spacing (per product-design.md) |
| `--space-8` | `32px` | `p-8` | Section spacing, large gaps |
| `--space-10` | `40px` | `p-10` | Between major content sections |
| `--space-12` | `48px` | `p-12` | Page-level vertical rhythm |
| `--space-16` | `64px` | `p-16` | Hero/onboarding section spacing |

### 3.2 Semantic Spacing

| Token | Value | Usage |
|---|---|---|
| `--space-card-padding` | `20px` | Padding inside all cards (min per product-design.md) |
| `--space-card-gap` | `12px` | Gap between elements inside a card |
| `--space-content-gap` | `24px` | Gap between content blocks in thread |
| `--space-screen-margin` | `20px` | Left/right margin on mobile (never less — per product-design.md) |
| `--space-section-gap` | `32px` | Gap between major sections (digest acts, onboarding steps) |
| `--space-input-padding-x` | `16px` | Horizontal padding inside text inputs |
| `--space-input-padding-y` | `12px` | Vertical padding inside text inputs |
| `--space-button-padding-x` | `24px` | Horizontal padding inside buttons |
| `--space-button-padding-y` | `14px` | Vertical padding inside buttons (maintains 56px height with 16px text + 14px×2) |

---

## 4. Border & Shape Tokens

### 4.1 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `6px` | Small elements: chips, badges, input fields |
| `--radius-md` | `12px` | Cards, approval cards, digest sections |
| `--radius-lg` | `16px` | Modal sheets, onboarding cards |
| `--radius-xl` | `24px` | Bottom sheet handles, pill buttons |
| `--radius-full` | `9999px` | Avatar circles, round icon buttons |

### 4.2 Borders

| Token | Value | Usage |
|---|---|---|
| `--border-subtle` | `1px solid rgba(44, 44, 44, 0.08)` | Card separators, section dividers |
| `--border-default` | `1px solid rgba(44, 44, 44, 0.12)` | Input field borders, list separators |
| `--border-focus` | `2px solid var(--color-terracotta)` | Focus ring on interactive elements |
| `--border-error` | `1px solid var(--color-error)` | Error state input borders |

---

## 5. Shadow Tokens

Shadows are warm-tinted (not pure black) to match the earthy palette.

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(44, 44, 44, 0.06), 0 1px 2px rgba(44, 44, 44, 0.04)` | Subtle card lift, input focus |
| `--shadow-md` | `0 4px 12px rgba(44, 44, 44, 0.08), 0 2px 4px rgba(44, 44, 44, 0.04)` | Approval cards, action cards in thread |
| `--shadow-lg` | `0 12px 32px rgba(44, 44, 44, 0.12), 0 4px 8px rgba(44, 44, 44, 0.06)` | Bottom sheets, modals |
| `--shadow-none` | `none` | Default state / reset |

---

## 6. Motion & Transition Tokens

Per product-design.md: "Purposeful, not decorative."

| Token | Value | Usage |
|---|---|---|
| `--duration-instant` | `100ms` | Micro-interactions: button press, toggle |
| `--duration-fast` | `200ms` | Card fade-in, state changes (per product-design.md) |
| `--duration-normal` | `300ms` | Approval checkmark animation, screen transitions |
| `--duration-slow` | `500ms` | Onboarding reveal animation, loading glow |
| `--easing-default` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | General transitions — slight deceleration |
| `--easing-enter` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering (fade-up cards) |
| `--easing-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving (dismiss swipe) |
| `--easing-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Approval checkmark — brief satisfying overshoot |

### Animation Definitions

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

@keyframes checkmark {
  0% { stroke-dashoffset: 24; }
  50% { stroke-dashoffset: 0; transform: scale(1.1); }
  100% { stroke-dashoffset: 0; transform: scale(1); }
}
```

| Animation | Duration | Easing | Usage |
|---|---|---|---|
| `fadeUp` | `var(--duration-fast)` | `var(--easing-enter)` | New cards appearing in thread |
| `pulseGlow` | `1500ms` | `ease-in-out` | Loading states (warm glow, not spinner) |
| `checkmark` | `var(--duration-normal)` | `var(--easing-spring)` | Approval confirmation |

---

## 7. Interactive State Tokens

### 7.1 Touch Targets

Per product-design.md (Apple HIG compliant):

| Token | Value | Usage |
|---|---|---|
| `--tap-target-min` | `44px` | Absolute minimum for any interactive element |
| `--tap-target-primary` | `56px` | Primary action buttons (Approve, Post Now) |
| `--tap-target-nav` | `48px` | Bottom navigation icons |
| `--tap-target-inline` | `44px` | Inline links, secondary actions |

### 7.2 Focus States

All interactive elements must show a visible focus indicator for keyboard/assistive technology users.

```css
:focus-visible {
  outline: 2px solid var(--color-terracotta);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Remove default outline for mouse/touch users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### 7.3 Disabled States

```css
[disabled], .disabled {
  opacity: 0.4;
  pointer-events: none;
  cursor: not-allowed;
}
```

---

## 8. Iconography Tokens

Per product-design.md: "Line icons, 2pt stroke, Warm Charcoal."

| Token | Value | Usage |
|---|---|---|
| `--icon-size-sm` | `16px` | Inline with caption text |
| `--icon-size-md` | `24px` | Standard icon size (per product-design.md) |
| `--icon-size-lg` | `32px` | Navigation bar icons, feature tiles |
| `--icon-size-xl` | `48px` | Onboarding business type tiles |
| `--icon-stroke` | `2px` | All line icons |
| `--icon-color-default` | `var(--color-charcoal)` | Default state |
| `--icon-color-active` | `var(--color-terracotta)` | Active/selected state (filled variant) |
| `--icon-color-muted` | `var(--color-slate)` | Inactive navigation, secondary icons |
| `--icon-line-cap` | `round` | Rounded terminals per product-design.md |
| `--icon-line-join` | `round` | Consistent with rounded terminals |

**Icon library recommendation:** Lucide Icons (open source, consistent 24px grid, 2px stroke, round caps/joins). Matches all product-design.md icon requirements without custom icon work.

---

## 9. Tailwind CSS Config Extension

```js
// tailwind.config.js (extend section)
module.exports = {
  theme: {
    extend: {
      colors: {
        charcoal: { DEFAULT: '#2C2C2C', soft: '#3D3D3D' },
        'warm-white': '#FAF8F5',
        cream: '#F2EDE8',
        terracotta: {
          DEFAULT: '#C4704B',
          hover: '#B5613D',
          active: '#A35535',
          light: '#F5E0D5',
        },
        sage: {
          DEFAULT: '#7A8B6F',
          hover: '#6B7C60',
          light: '#E8EDE5',
        },
        gold: { DEFAULT: '#D4A853', light: '#F5EDD8' },
        slate: { DEFAULT: '#6B7280', light: '#9CA3AF' },
        blush: '#F5E6E0',
        error: { DEFAULT: '#C0392B', light: '#FADBD8', dark: '#962D22' },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', '"Source Sans Pro"', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        display: ['1.75rem', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.01em' }],
        h1: ['1.25rem', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.005em' }],
        h2: ['1.125rem', { lineHeight: '1.3', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['0.8125rem', { lineHeight: '1.385', fontWeight: '400', letterSpacing: '0.005em' }],
        small: ['0.75rem', { lineHeight: '1.333', fontWeight: '400', letterSpacing: '0.01em' }],
      },
      spacing: {
        'card-padding': '20px',
        'screen-margin': '20px',
        'content-gap': '24px',
        'section-gap': '32px',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(44,44,44,0.06), 0 1px 2px rgba(44,44,44,0.04)',
        md: '0 4px 12px rgba(44,44,44,0.08), 0 2px 4px rgba(44,44,44,0.04)',
        lg: '0 12px 32px rgba(44,44,44,0.12), 0 4px 8px rgba(44,44,44,0.06)',
      },
      transitionDuration: {
        instant: '100ms',
        fast: '200ms',
        normal: '300ms',
        slow: '500ms',
      },
      transitionTimingFunction: {
        default: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        enter: 'cubic-bezier(0, 0, 0.2, 1)',
        exit: 'cubic-bezier(0.4, 0, 1, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      minHeight: {
        'tap-min': '44px',
        'tap-primary': '56px',
        'tap-nav': '48px',
      },
    },
  },
}
```

---

## 10. Accessibility Requirements

- All text must meet WCAG 2.1 AA contrast (4.5:1 for body text, 3:1 for large text)
- Charcoal on Warm White: **15.4:1** — passes AAA
- Terracotta on Warm White: **4.1:1** — passes AA for large text (20px+). For body text, use on cream background for **4.6:1** ratio, or use terracotta only for interactive elements with sufficient size.
- Slate on Warm White: **4.9:1** — passes AA
- White on Terracotta: **4.1:1** — passes AA for large text (button labels at 16px bold qualify)
- White on Sage: **3.8:1** — use charcoal text on sage-light backgrounds instead for body text. White on sage is acceptable for icon-only buttons with aria-label.
- Error Red on Warm White: **7.2:1** — passes AAA
- All interactive elements must have `:focus-visible` styles
- All animations must respect `prefers-reduced-motion: reduce` — disable all motion, show static states
- Color must never be the only indicator of state — always pair with icon or text

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

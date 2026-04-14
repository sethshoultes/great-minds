# Design Review: Shipyard

*A meditation on form, intention, and the unrelenting pursuit of the essential.*

---

## Overview

I have spent time with this work. I have read it carefully, slowly, the way one must approach anything that aspires to be used by human beings. What I found is competent engineering dressed in the language of design—but not yet design itself.

Design is not decoration. It is not the gradient you apply or the rounded corners you specify. It is the *why* behind every decision. And here, the why is often unclear, buried beneath accumulated choices that feel borrowed rather than inevitable.

---

## Visual Hierarchy: What Demands Attention?

### The IdeaInput Component
**File:** `web/components/IdeaInput.tsx`

The component attempts to guide the user through a significant moment: the articulation of their idea. Yet it competes with itself.

**Lines 146-151** — The header gradient:
```tsx
<div className="bg-gradient-to-r from-shipyard-600 to-craft-600 p-6">
  <h2 className="text-2xl font-bold text-white">Paste Your Idea</h2>
```

The gradient speaks loudly. It announces itself. But should it? The user's idea is the hero—the textarea where they pour out their vision. The header should recede, support, create context. Instead, it shouts.

**Lines 269-271** — Tier pricing:
```tsx
<div className="text-2xl font-bold text-gray-900">${tier.price}</div>
<div className="text-lg font-semibold text-gray-800 mt-1">{tier.name}</div>
```

The price comes first. Then the name. This is a commercial decision masquerading as design. What if we led with the tier name—the identity—and let the price follow as consequence, not declaration?

**Assessment:** The hierarchy exists, but it serves the business before the user.

---

## Whitespace: Room to Breathe

### The Tailwind Configuration
**File:** `tailwind.config.js`

I see the standard spacing scale. No custom extensions. This is not necessarily wrong—but it suggests that the rhythm of the interface was not considered deeply.

### The IdeaInput Component
**File:** `web/components/IdeaInput.tsx`

**Line 143:**
```tsx
<form onSubmit={handleSubmit} className="space-y-8">
```

`space-y-8` (2rem) between major sections. This is reasonable. But then:

**Line 153:**
```tsx
<div className="p-6 space-y-4">
```

`p-6` for padding, `space-y-4` internally. And within the validation feedback (**Lines 209-243**), the density increases without purpose. The `gap-2`, `gap-3`, `mt-2`, `mt-4`—these increments are functional but not rhythmic. They do not sing together.

**Lines 248-285** — The tier selection grid:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
```

`gap-4` between cards that contain substantial content. The cards themselves have `p-6` padding. This works mechanically but feels cramped at medium breakpoints. The features lists (**Lines 272-280**) with `space-y-2` compress information that deserves more oxygen.

**Assessment:** The whitespace is adequate but utilitarian. It does not create moments of pause or emphasis. It does not breathe.

---

## Consistency: Patterns That Repeat

### The Design System
**File:** `tailwind.config.js`

**Lines 11-36** — Two color palettes: `shipyard` (blue) and `craft` (magenta). Both full 50-900 ranges. This is ambitious. But where is the restraint?

In practice, I observe:
- `shipyard-500`, `shipyard-600` in the component
- `craft-600` only in the gradient (**Line 146**)
- `shipyard-100` for text on the gradient
- `shipyard-50` for selected states

The `craft` palette exists but barely participates. It feels vestigial. Either commit to the duality or simplify.

### Border Radiuses
**File:** `web/components/IdeaInput.tsx`

- `rounded-2xl` (containers) — **Lines 145, 256**
- `rounded-xl` (inputs, buttons) — **Lines 165, 190, 210, 292**
- `rounded` (small badges) — **Line 193**

Three radii. This is defensible. But the transition between them lacks intentionality. Why is the word count badge **Line 193** merely `rounded` when everything else celebrates curvature?

### Typography
**File:** `tailwind.config.js`, **Lines 38-41**

```js
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Menlo', 'monospace'],
}
```

Good choices. Cultured choices. But in `IdeaInput.tsx`:

- `text-2xl font-bold` — headline
- `text-lg font-semibold` — tier name
- `text-sm font-medium` — labels
- `text-sm` — body
- `text-xs` — micro-copy

Five sizes. Four weights implied. The type scale is not wrong but it is not distinctive. It does not have a voice.

**Assessment:** Patterns exist but do not cohere into a system. They are choices, not decisions.

---

## Craft: The Details

### The Email Template
**File:** `web/lib/auth.ts`, **Lines 43-68**

This is where I find genuine care:

```html
<div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
```

The constraint (`480px`), the generous padding (`40px`), the subtle shadow—this feels considered. Someone thought about receiving this email on a phone at 7 AM.

**But then, Line 62:**
```html
<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
```

A horizontal rule with `32px` margin. In a component with `40px` padding. The asymmetry is almost beautiful, but I suspect it was accidental.

### The Database Schema
**File:** `web/lib/db/schema.ts`

**Lines 33-45** — The agent roles:
```ts
export const agentRoleEnum = pgEnum('agent_role', [
  'steve_jobs',
  'elon_musk',
  'designer',
  ...
]);
```

Lowercase snake_case for technical identifiers—correct. But `steve_jobs` and `elon_musk` as enum values. This is naming real people in your database schema. It works, but it carries weight. Is this intentional branding or expedient labeling?

### The API Client
**File:** `web/lib/api.ts`

**Lines 55-64** — The fetch wrapper:
```ts
const response = await fetch(url, {
  ...options,
  headers: {
    ...defaultHeaders,
    ...options.headers,
  },
  credentials: 'include',
});
```

Clean. Correct. The spread operator ordering is right. But:

**Lines 78-82** — Error handling:
```ts
} catch (error) {
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Network error',
  };
}
```

`'Network error'` is the fallback. This is a generic phrase for a specific failure. What about timeout? What about CORS? The user deserves specificity, even in failure.

### The Validation Spinner
**File:** `web/components/IdeaInput.tsx`, **Lines 201-206**

```tsx
<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
</svg>
```

Duplicated at **Lines 296-299**. The same spinner, defined inline twice. This is not craft—this is copy-paste.

**Assessment:** There are moments of care, but they are islands in a sea of adequacy.

---

## What I Would Change

### To Make It Quieter

1. **Remove the gradient header** (`IdeaInput.tsx`, Line 146)
   Replace with a single color or, better, no background at all. Let typography do the work:
   ```
   bg-white border-b border-gray-100
   ```

2. **Reduce the color palette** (`tailwind.config.js`, Lines 25-36)
   Remove `craft` or demote it to a single accent. One voice is more powerful than two.

3. **Increase whitespace in tier cards** (`IdeaInput.tsx`, Line 250)
   Change `gap-4` to `gap-6` or `gap-8`. Let each option stand alone, complete.

4. **Remove the word count badge** (`IdeaInput.tsx`, Lines 193-195)
   Or make it invisible until the user needs it. The information is useful; its presence is not.

5. **Simplify the submit button** (`IdeaInput.tsx`, Lines 289-310)
   Remove the gradient. Remove the `transform hover:scale`. Remove the arrow icon. Let the words speak:
   ```
   bg-shipyard-600 hover:bg-shipyard-700
   ```

### To Make It More Powerful

1. **Lead with the tier name, not the price** (`IdeaInput.tsx`, Lines 269-271)
   ```tsx
   <div className="text-sm font-medium text-shipyard-600">{tier.name}</div>
   <div className="text-3xl font-light text-gray-900 mt-2">${tier.price}</div>
   ```
   Light weight on the price. The number becomes a fact, not an argument.

2. **Extract the spinner to a component**
   Create `components/Spinner.tsx`. Use it in both places. The single source of truth is the single source of beauty.

3. **Add a type scale to Tailwind** (`tailwind.config.js`)
   Define `fontSize` with purpose:
   ```js
   fontSize: {
     'micro': ['11px', { lineHeight: '16px' }],
     'caption': ['13px', { lineHeight: '20px' }],
     'body': ['15px', { lineHeight: '24px' }],
     'title': ['20px', { lineHeight: '28px' }],
     'headline': ['32px', { lineHeight: '40px' }],
   }
   ```

4. **Increase the minimum textarea height** (`IdeaInput.tsx`, Line 77)
   From `400px` to `480px` or more. Give the idea room to expand. The physical space communicates respect.

5. **Add intentional animation timing** (`tailwind.config.js`, Lines 42-56)
   The existing animations are mechanical. Add:
   ```js
   transitionTimingFunction: {
     'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
   }
   ```
   Apply to interactions. The deceleration will feel inevitable rather than arbitrary.

---

## Conclusion

This work functions. It will serve its purpose. But it does not yet have a soul.

The difference between good and great is not found in the addition of features or flourishes. It is found in the *removal* of everything that is not essential. What remains should feel inevitable—as if it could not have been any other way.

I see potential here. The bones are sound. The technology choices are mature. But the design language is still searching for its voice.

Make it quieter. Then it will speak.

---

*Reviewed by Jony Ive*
*April 2025*

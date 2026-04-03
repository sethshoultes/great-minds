# Round 1 — Steve Jobs
## WP Command Bar PRD Review
**Date**: 2026-04-03
**Stance**: This has the bones of something great. But bones aren't a product. Let me tell you what's wrong.

---

## 1. Product Design — How Should the Command Bar Look and Feel?

The PRD says "modal overlay" with "subtle animations." That's describing a dropdown menu with lipstick on it. That's not a product. That's a feature someone bolted onto WordPress because they saw Linear do it.

Here's what this needs to be:

**It must feel like thought itself.** When you press Cmd+K, the rest of WordPress should dim — not just darken, but *recede*. The command bar isn't a layer on top of WordPress. For the moment it's open, it IS WordPress. Everything else is background noise.

The input field should be generous. Not a cramped little text box — a full-width, beautifully typeset field with real type scale. 18px minimum. The cursor should feel alive. Every keystroke should produce instant visual feedback — not just filtering results, but the entire composition of the interface should respond to what you're typing.

Results should not be "grouped by category" with little section headers like a phone book. That's organizational thinking. Users don't think in categories — they think in intent. If I type "about," I want to see: the About page, the About page settings, recent edits to the About page, and the ability to create a new About page. Ranked by what I probably mean, not filed into Post/Page/Setting drawers.

**The interaction should feel like playing a musical instrument** — immediate, responsive, expressive. Every 16ms frame matters. No result should ever appear with a loading spinner. If results aren't instant, the architecture is wrong.

No dark mode "support." Design for dark first. WordPress admin is already dark for most serious users. Light is the variant, not the other way around.

---

## 2. Brand/Naming — Is "WP Command Bar" the Right Name?

No. Absolutely not.

"WP Command Bar" is what you name something when you've given up on making it memorable. It's descriptive in the worst way — it tells you what the thing is while giving you zero reason to care. It's the "Electronic Mail" of plugin names.

The name needs to do three things:
1. **Evoke speed.** This is about velocity. Getting where you need to go *now.*
2. **Feel native.** It shouldn't sound like a bolt-on. It should sound like something WordPress forgot to build.
3. **Be one word.** The best product names are one word. Spotlight. Raycast. Alfred. Not "Mac Spotlight Search Application."

My candidates:

- **Dash** — You dash to where you need to go. Short, fast, memorable. `dash` as a slug. "Dash for WordPress."
- **Beam** — You beam somewhere instantly. Light metaphor. Clean.
- **Pulse** — The heartbeat of your WordPress admin. You feel it, you tap into it.

If forced to choose right now: **Dash.** It's what you do with it. It's what it feels like. It's the plugin equivalent of a sprint.

"Powered by Dash" in the footer. "Press Cmd+K to Dash." It becomes a verb.

---

## 3. UX Flow — What's the Ideal Interaction Model?

The PRD describes a simple search box. Type, see results, pick one. That's a v0.1 prototype, not a product.

Here's the interaction model that would make this insanely great:

### The Three Modes

**Mode 1: Search (default)**
Press Cmd+K, start typing. You're searching across everything. Results are ranked by relevance and recency. Not categorized — ranked. The thing you most likely want is at the top. Always.

**Mode 2: Command**
Type `>` as the first character and you're in command mode. Now you're executing actions, not navigating. `> clear cache`, `> maintenance on`, `> activate jetpack`. This is the power user's operating system. Autocomplete is aggressive here — after typing `> cl`, it should already be showing "Clear Cache" as the top result.

**Mode 3: Go**
Type `/` as the first character and you're navigating by path. `/settings/permalinks`, `/plugins/installed`, `/posts?status=draft`. Direct routing. For the people who know exactly where they're going.

The mode indicator should be visible but not loud. A subtle icon change in the input field. The user learns by doing, not by reading documentation.

### The Memory

The command bar should remember. Not just "recent items" as a static list — it should learn from your patterns. If you open Cmd+K every morning and go to Posts > Draft, then "Draft Posts" should be the first suggestion before you type a single character. This is the difference between a tool that serves you and a tool you serve.

### The Escape Hatch

If a search returns nothing, the command bar should never show an empty state. It should offer: "Create new post: [your query]" or "Search Google for: [your query]" or "No results — try `/` for direct navigation." The command bar should never be a dead end. Dead ends are a design failure.

---

## 4. What's Missing from This PRD?

This PRD is functional. It would produce a working plugin. But it would produce a *forgettable* plugin. Here's what's absent:

### No Emotional Design
There is zero mention of how this plugin should make people *feel*. The best tools evoke emotion. Spotlight on Mac doesn't just find files — it makes you feel like your computer understands you. Where is that ambition here?

### No Onboarding Moment
First-time users need a single, magical moment. When the plugin activates, there should be a brief, tasteful tooltip: "Press Cmd+K to search anything." That's it. Not a tour. Not a wizard. One sentence and a shortcut. The product teaches itself from there.

### No Sound Design
This might sound crazy for a WordPress plugin. But hear me out — a subtle, almost subliminal audio feedback on selection (think: the softest possible click) would make this feel premium. Optional, off by default, but there for the users who notice details. The best products engage multiple senses.

### No Personality
The placeholder text says "Type a command..." That's robotic. It should say something with character. Rotate through: "Where to?", "What do you need?", "Jump anywhere...", "Dash to..." — small touches that make a tool feel human.

### No Competitive Positioning
The PRD doesn't mention that AdminMenu Editor, Admin Bar Remover, and several Spotlight clones already exist. Why is this different? What is the singular reason someone switches? You need to be able to answer: "This is the first WordPress tool that ___." That blank must be filled before writing a line of code.

### No Accessibility Strategy
"Arrow keys to navigate" is not an accessibility strategy. What about screen readers? What about voice control? What about users who can't use a keyboard? WCAG compliance isn't a checkbox — it's a design philosophy. Every interaction must have an alternative path.

---

## 5. What Would Make This INSANELY GREAT vs Just Good?

Good: A Cmd+K palette that searches posts and pages.
Insanely great: **The interface that makes WordPress menus obsolete.**

Here's the vision:

### The Radical Bet
If this command bar is good enough, users should be able to **collapse the entire WordPress sidebar** and operate exclusively through Dash. That's the north star. Not "a nice shortcut" — a complete replacement for hierarchical navigation. When you can do that, you've built something that changes how people use WordPress.

### The 2-Second Rule
Any action in WordPress admin should be reachable in under 2 seconds from Cmd+K. If it takes longer, the product has failed. This is the metric that matters — not "200ms response time." Response time is a technical constraint. The 2-Second Rule is a user promise.

### The Plugin Economy
`wp_command_bar_register()` is fine. But think bigger. What if every major plugin (WooCommerce, Yoast, ACF, Gravity Forms) shipped with Dash commands built in? What if "Dash-compatible" became a badge that plugin developers wanted? You're not building a plugin. You're building a platform for plugin interaction. The API needs to be so simple and so well-documented that adoption is effortless.

### The Visual Language
Every result in the command bar should have a meaningful icon — not generic dashicons, but purpose-built glyphs that are recognizable at 16px. A post looks different from a page looks different from a setting looks different from an action. When a user scans results, they should be able to identify the type without reading the category label. This is what Apple does with every icon in every interface — the shape carries meaning before the label does.

### The Easter Egg
Hide something in it. Type "hello" and get a friendly message from the development team. Type the Konami code and trigger something delightful. The best products have soul. Soul comes from the details that nobody asked for but everyone remembers.

---

## Summary Position

| Area | Verdict |
|---|---|
| Product Design | Too safe. Needs to feel like an instrument, not a dropdown. |
| Naming | "WP Command Bar" is dead on arrival. Rename to **Dash**. |
| UX Flow | Single search box is v0.1. Needs three modes: Search, Command, Go. |
| Missing | Emotional design, onboarding, accessibility strategy, competitive positioning. |
| Insanely Great | The bar that makes the WordPress sidebar obsolete. 2-Second Rule as the north star. |

**My line in the sand:** If this ships as "WP Command Bar" with a simple search modal and category headers, it will be one of 15 command palette plugins that nobody remembers. If it ships as **Dash** with intent-ranked results, three interaction modes, and the ambition to replace sidebar navigation — it will be the one that changes how people use WordPress.

The difference between good and insanely great is never features. It's taste. It's the willingness to say: "No, that's not good enough. Start over."

I'm saying it now.

---

*Waiting for Elon's response. I expect him to challenge me on scope and tell me I'm over-designing. He'd be wrong, but I want to hear his argument.*

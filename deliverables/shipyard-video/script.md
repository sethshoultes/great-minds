# Shipyard AI - Video Script (60-90s)

**Target audience:** Developers, technical founders, agency owners
**Tone:** Fast, confident, slightly irreverent
**Format:** Remotion (React-based video framework)

---

## Scene 1 (0:00 - 0:03)
**Visual:** Black screen. A single terminal cursor blinks. Then text types out rapidly: `$ shipyard deploy --from prd.md`
**Audio/VO:** "What if you could hand a requirements doc to a room full of geniuses..."
**Motion:** Cursor blink at 530ms interval. Text types at 40ms per character. Hard cut on the last word.

---

## Scene 2 (0:03 - 0:10)
**Visual:** Split screen. Left: a PRD document scrolling slowly, key sections highlighted — sitemap, brand tokens, feature list. Right: 14 agent avatars arranged in a grid, each lighting up as they "read" the doc. Names fade in beneath each: Steve Jobs, Elon Musk, Margaret Hamilton, Ada Lovelace...
**Audio/VO:** "...and wake up to a deployed website? Shipyard AI reads your PRD and assigns it to 14 autonomous agents."
**Motion:** Avatars illuminate left-to-right, top-to-bottom in a cascade. Each glows briefly then holds steady.

---

## Scene 3 (0:10 - 0:22)
**Visual:** A simulated "war room" chat feed. Agent messages appear in rapid succession — Jobs pushes for simplicity, Musk argues for speed, Hamilton flags an edge case. Disagreements are visible. Then a "Decision Locked" badge stamps onto the screen.
**Audio/VO:** "They don't agree with each other. That's the point. Debate produces better architecture than consensus ever will. Strategy locks in minutes, not meetings."
**Motion:** Chat bubbles slide in from alternating sides. The "Decision Locked" badge drops in with a satisfying thud animation and slight bounce.

---

## Scene 4 (0:22 - 0:38)
**Visual:** A build dashboard. Multiple progress bars advance simultaneously — "Theme scaffold," "Plugin: Contact Form," "Responsive QA," "Accessibility audit." Agents are assigned to each track. Code snippets flash in a background layer. An Emdash logo is visible in the preview pane showing a real site taking shape.
**Audio/VO:** "Then they build. In parallel. Theme, plugins, content, QA — all at once. Not a pipeline. A factory floor. Every agent ships working code to a live Emdash site."
**Motion:** Progress bars fill at different rates to show genuine parallel work. The site preview transitions through 3 states: wireframe, styled, fully rendered.

---

## Scene 5 (0:38 - 0:50)
**Visual:** A token-credit meter in the corner ticks down as work happens. A scope-creep request slides in ("Can we also add a blog?") and gets flagged with an amber "Requires 1,200 additional credits" tooltip. The user clicks "Approve." Work resumes.
**Audio/VO:** "Every task burns tokens from a transparent credit balance. Scope creep doesn't sneak in — it asks permission. You stay in control without micromanaging."
**Motion:** The token meter is a clean, minimal gauge. The scope request slides up from the bottom like a mobile notification. Approve button pulses once before click.

---

## Scene 6 (0:50 - 1:02)
**Visual:** Time-lapse of a clock spinning from 11 PM to 7 AM. The build dashboard shows all progress bars hitting 100%. A browser opens to reveal a finished, polished website. Confetti-free — just a clean "Deployed" status badge and a live URL.
**Audio/VO:** "You went to sleep. They didn't. By morning, your site is live. Tested. Deployed. No standup required."
**Motion:** Clock hands spin smoothly. Progress bars complete with a subtle checkmark animation. The browser window scales up from the dashboard to fill the frame.

---

## Scene 7 (1:02 - 1:12)
**Visual:** The Shipyard AI logo resolves on a dark background. Below it: `www.shipyard.company`. A terminal prompt appears beneath: `$ upload your PRD -->`.
**Audio/VO:** "Shipyard AI. Upload your PRD. Meet your team. Ship by morning."
**Motion:** Logo fades in over 500ms. URL types out. Terminal prompt blinks, waiting. Hold for 3 seconds.

---

## Production Notes

- **Total runtime:** 72 seconds (target)
- **Music:** Lo-fi electronic, minimal — think Tycho or Boards of Canada. Builds slightly through Scene 4, drops to ambient for Scene 6, resolves on the CTA.
- **Typography:** Monospace for terminal/code elements (JetBrains Mono). Sans-serif for UI elements (Inter or similar).
- **Color palette:** Dark backgrounds (#0a0a0a), electric blue accents (#3b82f6), amber for warnings (#f59e0b), green for success (#22c55e).
- **Remotion structure:** Each scene maps to a `<Sequence>` component. Shared `<AgentAvatar>` and `<ProgressBar>` components can be reused across scenes.

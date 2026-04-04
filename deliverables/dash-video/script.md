# Dash - Video Script (45s)

**Target audience:** WordPress developers, agency owners, power users
**Tone:** Sharp, rhythmic, building tension — a writer's tempo
**Format:** Remotion (React-based video framework)

---

## Scene 1 (0:00 - 0:05)
**Visual:** A WordPress admin dashboard. The sidebar is fully expanded — Posts, Pages, Appearance, Plugins, Users, Settings, Tools. The mouse drifts toward the sidebar. Hesitates. Stops.
**Audio/VO:** "You know where everything is. That's not the problem. The problem is you still have to go *get* it."
**Motion:** Mouse cursor drifts left, slows, freezes. The entire sidebar dims to 40% opacity. Hold one beat.

---

## Scene 2 (0:05 - 0:12)
**Visual:** The screen goes dark — the Dash overlay drops in. A single search field, centered. The cursor is already blinking. The word "plugin" types itself, letter by letter. Three results materialize instantly beneath: **Plugins** (Setting), **Add New Plugin** (Setting), **Updates** (Setting). Each result snaps into place, no animation — they're just *there*.
**Audio/VO:** "Cmd+K. That's the whole workflow. You think it, you type it, you're there. Search doesn't wait for you. FULLTEXT indexing means results arrive before your fingers leave the keys."
**Motion:** Overlay fades in over 200ms. Text types at 60ms per character. Results appear in a single frame — instant, no stagger. The first result is pre-highlighted.

---

## Scene 3 (0:12 - 0:22)
**Visual:** Quick cuts. Five searches in rapid succession — "user" (jumps to Users), "draft" (shows draft posts), "setting" (shows Settings pages), "new page" (Create New Page), "media" (Media Library). Each search-and-select takes exactly one second. Between each cut, a running counter in the corner: **5 actions. 5 seconds.**
**Audio/VO:** "Sixteen built-in commands. Navigate anywhere. Create anything. Five clicks collapsed into five keystrokes. WordPress has three hundred admin screens. Dash makes that a feature instead of a problem."
**Motion:** Hard cuts between searches. No transitions. The counter increments with each action — clean, mechanical, satisfying. Typography is monospace, bold.

---

## Scene 4 (0:22 - 0:33)
**Visual:** Split screen. Left side: a code editor showing a simple PHP snippet — `add_filter( 'dash_commands', ... )`. A custom command called "Deploy Staging" is being registered in four lines of code. Right side: the Dash overlay, where "deploy" is typed and the custom command appears with a rocket icon.
**Audio/VO:** "Developers get a filter API. One hook. Register any command you can imagine — internal tools, client shortcuts, deployment triggers. Dash doesn't just search your admin. It becomes the control layer for everything you build on top of it."
**Motion:** Code appears line by line on the left, each line triggering a subtle pulse. On the right, the custom command fades in as the last line of code completes. A single Enter keystroke fires it.

---

## Scene 5 (0:33 - 0:45)
**Visual:** The Dash overlay closes. We pull back to reveal the full WordPress admin — clean, untouched. A minimal stats bar appears at the bottom: **6KB gzipped. Zero dependencies. Works with any theme.** The Dash logo resolves — a forward slash inside a rounded square. Below it: `developer.emdash.agency/dash`
**Audio/VO:** "Six kilobytes. No jQuery. No React. No build step. Just a keyboard shortcut that makes WordPress feel like it was built this decade. Steve called it Dash because he wanted it to become a verb. We think he was right."
**Motion:** Stats appear one at a time, left to right, with 400ms spacing. Logo fades in over 600ms. URL types out beneath. Hold for 3 seconds.

---

## Production Notes

- **Total runtime:** 45 seconds (target)
- **Music:** Minimal piano or keys — think Ryuichi Sakamoto's late work. One sustained chord that shifts twice across the whole piece. No drums until Scene 3, where a single rhythmic pulse enters and exits.
- **Typography:** Monospace for all search/code UI (JetBrains Mono). Sans-serif for stats and CTA (Inter). No decorative fonts.
- **Color palette:** WordPress admin dark (#1d2327), Dash overlay background (#111827), search field border (#3b82f6), result hover (#1e3a5f), stats text (#94a3b8), logo white (#ffffff).
- **Editing philosophy:** Every cut is a decision. No dissolves, no slides, no easing curves. Things appear because they're ready. Things disappear because they're done. The edit rhythm should feel like someone who types fast and thinks faster.
- **Remotion structure:** Each scene is a `<Sequence>`. Shared components: `<DashOverlay>`, `<SearchField>`, `<ResultList>`, `<StatBar>`. The overlay component should accept real search data so results are authentic, not mocked.
- **Screenshot reference:** `/work/dash/dash-screenshot.png` — use the actual Dash UI styling from this capture for Scene 2.

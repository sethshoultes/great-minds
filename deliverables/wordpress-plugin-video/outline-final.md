# WordPress Plugin Tutorial — Final Outline
### Great Minds Agency | Sorkin + Shonda + Jony

---

## Video Title
**"Stop Hacking functions.php — Build Your First WordPress Plugin in 5 Minutes"**

Alternates:
- "30 Lines to Your First WordPress Plugin"
- "From Zero to WordPress Plugin: The Only Tutorial You Need"

---

## Target Audience
PHP developers who know basic syntax but have never built a WordPress plugin. They've been pasting code into functions.php. They're ready to graduate but intimidated. This video shows them the door is already open.

---

## Key Takeaways
1. A WordPress plugin is one PHP file with a header comment — barrier to entry is near zero
2. You cannot break WordPress by creating a plugin — your code is isolated
3. Hooks (actions + filters) are the entire architecture — learn them once, build anything
4. Security habits like `esc_html` belong in tutorials, not just production
5. The path from "my first plugin" to "my first product" is shorter than most developers think

---

## Emotional Arc
- **Fear** → "My site broke, my code vanished" (Scene 1)
- **Understanding** → "There's a better way, and it's simple" (Scenes 2-3)
- **Permission** → "You can't break anything. Try something." (Scene 3)
- **Insight** → "This is why WordPress works at scale" (Scenes 4-5)
- **Competence** → "I just built something real" (Scenes 6-7)
- **Identity shift** → "I'm not a user anymore. I'm a builder." (Scenes 8-9)

---

## Scene-by-Scene Summary

| # | Scene | Duration | One Line |
|---|-------|----------|----------|
| 1 | The Hook | 15s | Open on crisis: site broke, code gone, boss calling |
| 2 | Why a Plugin? | 15s | Split-screen: fragile theme code vs. portable plugin |
| 3 | One File + Fear Removal | 50s | Type the header comment, show it in WP admin, remove fear |
| 4 | The Secret — Hooks | 45s | Animated lifecycle: actions and filters, the entire model |
| 5 | Why This Matters | 15s | Chaos vs. order — why hooks make WordPress scale |
| 6A | Build — Admin Notice | 35s | First hook in action: add_action, one function, done |
| 6B | Build — Shortcode | 35s | Second pattern: add_shortcode + esc_html security |
| 7 | Activate and Test | 40s | Screen recording proof + extended victory moment |
| 8 | Where to Go Next | 20s | Three paths: handbook, WP.org, product |
| 9 | The Close | 15s | Identity shift: "You're a WordPress developer now" |

**Total: ~4:05**

---

## What Changed from Draft to Final

| Change | Source | Why |
|--------|--------|-----|
| Hook rewritten with crisis | Shonda | "My site broke" > "things might break someday" |
| Fear removal added (Scene 3) | Shonda | Anxiety closes tabs. Permission unlocks curiosity. |
| "Why hooks matter" scene added | Shonda | Insight = shareable. Instructions = forgettable. |
| Scene 2 compressed to 15s | Shonda | Message landed by second 15. Rest was repetition. |
| Scene 5 (Build) split into 6A + 6B | Shonda + Jony | 90 lines in 60s too dense. Two phases with breathing room. |
| Victory lap extended (Scene 7) | Shonda | "That message came from YOUR code" = emotional peak |
| Ending rewritten (Scene 9) | Shonda | Peak on capability, not completion. "You're a builder." |
| Full visual spec added | Jony | Pixel-level: colors, margins, timing, easing, typography |
| Syntax palette locked | Jony | Keywords #fafafa bold, strings #f59e0b, comments #9ca3af |
| Transition map defined | Jony | Hard cuts vs fades, exact durations per scene boundary |
| Screen recording at 0.75x | Jony | Real-time too fast for code walkthrough |

---

## Thumbnail Concept

**Primary:** Split frame. LEFT: messy red-tinted code editor showing bloated functions.php (tiny scrollbar). RIGHT: clean green-tinted editor showing 7-line plugin header. Large arrow between them. Text overlay: **"Build Your First Plugin"** — bold sans-serif.

**Alt:** WordPress plugin card in admin. Plugin name reads "YOUR Plugin." Author reads "YOUR Name." Activate link glowing. Text overlay: **"30 Lines. That's It."**

---

## Production Checklist

- [ ] Record narration (confident, slightly witty, conversational)
- [ ] Capture functions.php chaos screenshot (800+ lines, warnings)
- [ ] Build code typing animations (synced to narrator pace)
- [ ] Design hooks lifecycle diagram (Scene 4 — storyboard first)
- [ ] Design chaos vs. order diagram (Scene 5)
- [ ] Capture WordPress admin screen recordings at 0.75x
- [ ] Build code syntax theme (3-color palette per spec)
- [ ] Add cursor spotlight to screen recordings (20px feather)
- [ ] Compose/select underscore music (Atticus Ross tone)
- [ ] Render at 1920x1080 @ 30fps
- [ ] Test code readability at target viewing distance

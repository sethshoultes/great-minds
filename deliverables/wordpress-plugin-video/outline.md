# WordPress Plugin Tutorial Video -- Outline & Summary
### Great Minds Agency | Screenwriter: Aaron Sorkin

---

## Video Title Options

1. **"Stop Hacking functions.php -- Build Your First WordPress Plugin in 5 Minutes"**
2. **"30 Lines to Your First WordPress Plugin"**
3. **"From Zero to WordPress Plugin: The Only Tutorial You Need"**

Recommendation: Option 1. It meets the viewer where they are (doing the wrong thing) and promises a specific, achievable outcome. That's a click.

---

## Target Audience

PHP developers who understand basic syntax -- functions, arrays, strings, echo -- but have never built a WordPress plugin. They've probably added code to functions.php or followed copy-paste tutorials. They're ready to graduate but intimidated by the perceived complexity. This video shows them the door is already open.

---

## Key Takeaways

1. A WordPress plugin can be a single PHP file with a header comment -- the barrier to entry is near zero.
2. Hooks (actions and filters) are the entire architecture -- learn them once, build anything.
3. The functions.php approach is fragile; plugins are portable, independent, and survive theme changes.
4. Security habits (like `esc_html`) belong in tutorials, not just production code.
5. The path from "my first plugin" to "my first product" is shorter than most developers think.

---

## Scene-by-Scene Summary

| Scene | Title | Duration | One-Line Summary |
|-------|-------|----------|-----------------|
| 1 | The Hook | 15s | Open on the chaos of a bloated functions.php -- establish the problem before naming the solution. |
| 2 | Why a Plugin? | 25s | Side-by-side: theme-dependent code vs. independent plugin. Portability, survivability, ownership. |
| 3 | One File, One Comment | 40s | Build the minimum viable plugin file -- just a PHP file with a header comment. Show it appearing in WP admin. |
| 4 | The Secret -- Hooks | 50s | Explain actions and filters with an animated WordPress lifecycle diagram. Two kinds of hooks, one mental model. |
| 5 | Build It | 60s | Write a real plugin: admin notice via `add_action`, shortcode via `add_shortcode`. 30 lines total. Security included. |
| 6 | Activate and Test | 30s | Screen recording: activate the plugin, see the admin notice, test the shortcode on a live page. Proof it works. |
| 7 | Where to Go Next | 20s | Three paths: Plugin Handbook, folder structure + WP.org submission, Settings API and the leap to product. |
| 8 | The Close | 10s | Callback to the plugin description line. "Thirty lines. Start building." End card with resources. |

---

## Estimated Total Runtime

**3 minutes 40 seconds** (220 seconds)

Breakdown:
- Scenes 1-2 (Setup/Why): 40 seconds
- Scenes 3-4 (Concepts): 90 seconds
- Scenes 5-6 (Build/Test): 90 seconds
- Scenes 7-8 (Next Steps/Close): 30 seconds

The pacing is tight by design. Every scene earns its seconds. No filler, no "like and subscribe" interruptions mid-flow.

---

## Suggested Thumbnail Concept

**Primary concept:** A split frame. LEFT side is a messy, red-tinted code editor showing a bloated functions.php (scrollbar visible, implying length). RIGHT side is a clean, green-tinted editor showing the 7-line plugin header comment. Between them, a large arrow pointing right. Text overlay: **"Build Your First Plugin"** in bold sans-serif. No face cam needed -- the code IS the story.

**Alt concept:** A single WordPress plugin card from the admin dashboard -- but the plugin name reads "YOUR Plugin" and the author reads "YOUR Name." Below it: the activate link, glowing. Text overlay: **"30 Lines. That's It."**

The thumbnail should feel achievable, not intimidating. No abstract code-flying-through-space nonsense. Show the real WordPress interface. Developers recognize it instantly and it signals: this is practical, this is real.

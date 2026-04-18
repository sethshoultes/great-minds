# How to Build a WordPress Plugin — Final Script
### Great Minds Agency | Sorkin (script) + Shonda (narrative) + Jony (visual)
### Runtime: ~4:05 | Resolution: 1920x1080 @ 30fps
### Audience: PHP developers who have never built a WordPress plugin

---

## Visual Style Guide

| Property | Value |
|----------|-------|
| Background | #0a0a0a |
| Editor background | #1a1a1a |
| Accent | #f59e0b (amber) |
| Text | #fafafa |
| Code font | JetBrains Mono, 400 weight, 20pt, line-height 1.6 |
| Body font | Inter, 500 weight |
| Title font | Inter, 700 weight, 80-96pt, letter-spacing +2-3% |
| Bullet text | Inter, 500 weight, 28-32pt, line-height 1.6 |
| Caption text | Inter, 500 weight, 24pt, with #0a0a0a 50% opacity backing |
| Syntax: keywords | #fafafa bold (function, return, echo, <?php) |
| Syntax: strings | #f59e0b (amber) |
| Syntax: comments | #9ca3af (gray, ~40% opacity) |
| Syntax: variables | #fafafa at 90% opacity |
| Glow standard | #f59e0b, 15-20% opacity, 4-6px blur, 2-3s pulse cycle |
| Glow emphasis | #f59e0b, 25-30% opacity, 6-8px blur |
| Music | Minimal electronic underscore. Atticus Ross tone — confident, not cute. No ukulele. |

---

## Scene 1: The Hook — "Your Site Just Broke"
**Duration:** 15 seconds
**Purpose:** Crisis, not consequence. Make the viewer feel it.

**Visual:** Screen recording of a functions.php file. 800+ lines. Tiny scroll bar. Red underlines and deprecation warnings everywhere. Slow zoom from 1x to 1.5x over 8 seconds, ease-in-out. Scroll bar shrinks as zoom increases.

**VO/Narration:**
"Right now, somewhere, a developer just lost three hours of custom code because the theme updated. Their client is calling. Their boss is asking why the site broke. And that line of custom code they buried in functions.php? Gone. The only thing that makes this worse is knowing there was a way to prevent it. That way takes five minutes to learn. And once you know it — you'll never make this mistake again."

**Motion:** Hard cut to black on "again" — exactly on the final syllable. Zero delay. 0.2s silence. Title card fades in over 0.6s: **HOW TO BUILD A WORDPRESS PLUGIN** — Inter 700, 80-96pt, #fafafa, centered, positioned vertical center + 20% down. Hold 2 seconds. Fade out 0.4s.

**Transition to Scene 2:** Hard cut.

---

## Scene 2: Why a Plugin?
**Duration:** 15 seconds (compressed from 25s per Shonda)
**Purpose:** One visual comparison, fast and decisive.

**Visual:** Split screen. 76px gap between sides (4% of 1920px).

LEFT column (0-48%):
- Functions.php file with red X (60px diameter, centered vertically)
- Two bullets at 28pt Inter, stagger entry 0.4s apart, ease-out, 0.5s duration, 10-15px travel from left:
  - "Married to your theme"
  - "Breaks on update"

RIGHT column (52-100%):
- Clean plugin folder with green checkmark (85px diameter — 1.4x scale of X)
- Two bullets enter from right, same timing:
  - "Independent"
  - "Portable everywhere"

**VO/Narration:**
"Here's the difference. Code in functions.php is married to your theme. Update the theme — it can break. Switch themes — it's gone. A plugin is independent. It survives everything. You can move it between sites. And the barrier to entry is one file."

**Motion:** On "one file," both sides shrink toward center, opacity fades to 60%. Single PHP file icon (150px) lands center screen with gentle bounce (0.6s). 1-second pause.

**Transition to Scene 3:** Hard cut.

---

## Scene 3: The Bare Minimum — One File, One Comment
**Duration:** 50 seconds (expanded from 40s — includes fear removal)
**Purpose:** Show how simple the entry point is, then remove the fear.

**Visual:** Code editor (#1a1a1a background). Empty file. Filename: `my-first-plugin.php`. Code margins: 32px sides, 48px top.

**VO/Narration:**
"Every WordPress plugin starts the same way. One PHP file. Inside that file, a comment block. That's it. That's the handshake. WordPress reads this comment to discover your plugin — the name, the description, the version. Without it, WordPress doesn't know you exist. Watch."

[Code types character by character, synced to narrator pace — ~2s per line:]
```php
<?php
/**
 * Plugin Name: My First Plugin
 * Description: A simple plugin that proves I can do this.
 * Version: 1.0
 * Author: Your Name
 */
```

**Motion:** After header completes, amber glow frames entire block from `<?php` through closing `*/` — 2px solid #f59e0b at 30% opacity, 6px blur. Pulses twice (fade-in 0.4s, hold 1.2s, fade-out 0.6s per cycle). Cut to WordPress admin plugins page — "My First Plugin" appears in list with 1px amber border, pulses once (0.6s).

**VO/Narration (continued — the fear removal):**
"Now, before we go further — here's the thing no one tells you. You cannot break WordPress by creating a plugin. Your code is isolated. It has no access to the core. If your plugin crashes, WordPress keeps running. If your plugin is wrong, you deactivate it and move on. There is no production risk here. This is the safest way to extend WordPress. So for the next few minutes — stop being careful. Try something."

**Visual:** Plugin file icon on screen. Subtle inviting glow (#f59e0b, 15% opacity, 8px blur) appears around it. Not intimidating. Warm.

**Transition to Scene 4:** Fade to black, 0.3s, then fade in.

---

## Scene 4: The Secret — Hooks
**Duration:** 45 seconds
**Purpose:** The mental model. Actions and filters — the entire architecture.

**Visual:** Animated diagram. Vertical timeline labeled "WordPress Loading..." with dots at stages: init, wp_head, the_content, admin_notices, wp_footer. Dots: 6px radius, #f59e0b. Labels: 16pt Inter, right of each dot. `admin_notices` and `wp_head` dots 20% larger (importance).

A plugin icon hooks onto one dot with carabiner clip animation — 0.8s swing-in, 5-10 degree rotation, settles with optional subtle click sound.

**VO/Narration:**
"Now — the concept that makes all of this work. Hooks. WordPress doesn't call your code directly. Instead, as it loads a page, it announces what it's doing. 'I'm about to render the header.' 'I'm inside the admin dashboard.' These announcements are hooks. Your plugin listens for them."

**PAUSE BEAT** — 2 seconds. Let the diagram breathe.

**VO/Narration (continued):**
"Two kinds. Actions and filters. An action says: 'something is happening — do you want to do something too?' A filter says: 'here's some data — do you want to change it before I use it?' Actions let you add. Filters let you modify. That's the entire model."

**Visual shift:** Diagram splits. LEFT: action hook — function attaching to `admin_notices`, 2px amber solid border. RIGHT: filter hook — function attaching to `the_content`, amber glow (softer, 15% opacity). Two carabiners appear simultaneously, 0.6s duration, 0.1s stagger. Arrows show flow: WordPress fires hook → your function runs → life continues.

**Transition to Scene 5:** Fade to black, 0.2s.

---

## Scene 5: Why This Matters — The Insight
**Duration:** 15 seconds (new scene per Shonda)
**Purpose:** The "oh, I get it" moment that makes people feel smart.

**Visual:** Diagram showing two paths. LEFT: chaos — multiple plugins trying to modify the same thing, tangled arrows, collisions. RIGHT: WordPress hooks — orderly queue of functions, clean arrows, each waiting its turn.

**VO/Narration:**
"Here's why this design matters. WordPress doesn't know what plugins you'll install. It can't control the order. But hooks create a standard way for independent code to work together without collision. That's why WordPress runs millions of plugins on millions of sites without exploding. Every single one is listening to the same announcements."

**Motion:** LEFT side animates chaotically (overlapping, flickering). RIGHT side animates orderly (sequential, clean). Contrast is immediate and visceral.

**Transition to Scene 6:** Fade to black, 0.2s, then fade in.

---

## Scene 6A: Build It — The Admin Notice
**Duration:** 35 seconds
**Purpose:** First hook in action. One concept, fully absorbed.

**Visual:** Code editor (#1a1a1a). Header comment from Scene 3 already present in upper portion. New code appears below with 32px vertical gap.

**VO/Narration:**
"Let's make this real. First — a custom welcome message in the WordPress admin."

[Code types line by line, synced to narrator pace:]
```php
// Show a welcome notice in the admin dashboard
function mfp_admin_notice() {
    echo '<div class="notice notice-info is-dismissible">';
    echo '<p>My First Plugin is active. You built this.</p>';
    echo '</div>';
}
add_action( 'admin_notices', 'mfp_admin_notice' );
```

**VO/Narration (continued):**
"add_action. Two arguments. The hook name — admin_notices — and the function you want to run when that hook fires. That's it. WordPress handles the timing. You handle the logic."

**Motion:** Code enters ~2s per line. `add_action` highlights in #f59e0b, 0.4s fade, as narrator says it. Function names (`mfp_admin_notice`) get no highlight — implementation detail, not concept.

**PAUSE BEAT** — 1.5 seconds.

**VO/Narration (reflection):**
"One function. One hook. That's the pattern. It's everywhere in WordPress."

**Visual:** Subtle animation — same pattern appearing briefly in miniature at three dots on the hooks timeline from Scene 4 (header, footer, admin). 1.5 seconds. Reinforces the mental model.

**Transition:** No cut. Code stays. Scene 6B begins below.

---

## Scene 6B: Build It — The Shortcode
**Duration:** 35 seconds
**Purpose:** Second application of the same pattern. Proof it generalizes.

**Visual:** Same editor. Second code block appears below first with 32px margin.

**VO/Narration:**
"Now — a shortcode. Same principle. You register a tag, point it at a function. When WordPress encounters that tag in a post, it calls your function and swaps in whatever you return."

[Code types line by line:]
```php
// Create a shortcode: [greeting name="World"]
function mfp_greeting_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'name' => 'World',
    ), $atts );

    return '<p class="mfp-greeting">Hello, '
        . esc_html( $atts['name'] ) . '!</p>';
}
add_shortcode( 'greeting', 'mfp_greeting_shortcode' );
```

**VO/Narration (continued):**
"Notice esc_html on the output. Security isn't optional — even in a tutorial."

**Motion:**
- `add_shortcode` highlights #f59e0b, 0.4s fade
- `esc_html` gets longer highlight (0.6s fade) + subtle tooltip appears 0.2s after: "Security first" — 12pt, #f59e0b, holds 1.5s, fades
- When both blocks complete: thin green border (2px, #22c55e at 40% opacity) frames entire file, pulses once over 2 seconds

**CHECKPOINT VO:** "Header. Action hook. Shortcode. Three concepts. Thirty lines. That's a working plugin."

**Transition to Scene 7:** Hard cut (mode shift to live action).

---

## Scene 7: Activate and See It Work
**Duration:** 40 seconds (expanded from 30s — extended victory lap per Shonda)
**Purpose:** Proof of life. The emotional peak. Make them feel it.

**Visual:** Screen recording of WordPress admin at 0.75x playback speed. Cursor spotlight: 20px feather, +12% brightness. Plugins page. "My First Plugin" is listed.

**VO/Narration:**
"Moment of truth."

[Cursor clicks "Activate." Page reloads. Admin notice appears: "My First Plugin is active. You built this."]

**PAUSE BEAT** — 1.5 seconds. Let it land.

**VO/Narration (the victory moment — per Shonda):**
"That message came from your code. Not from WordPress. Not from a plugin you downloaded. From thirty lines you wrote five minutes ago. This is what it means to be a developer on this platform. Not a user. A builder."

[Screen recording: Navigate to Pages, open a page, type `[greeting name="Developer"]` in block editor. Preview. Rendered output: "Hello, Developer!"]

**Motion:** On shortcode output, brief zoom 1.0x → 1.1x on "Hello, Developer!" over 0.4s. Subtle confirmation sound. 1-second pause.

**VO/Narration (continued):**
"From a comment block and two functions — to something a real user can see and interact with. Everything else — settings pages, database tables, REST endpoints, custom post types — it's all built on this same foundation. Hooks. Functions. Register your intent, let WordPress call you."

**Transition to Scene 8:** Fade to black, 0.3s, then fade in.

---

## Scene 8: Where You Go From Here
**Duration:** 20 seconds
**Purpose:** Three clear paths. The third one glows.

**Visual:** Central node — WordPress plugin icon (80px), centered. Three paths branch outward at 120-degree angles.

**VO/Narration:**
"Three paths forward. One — the Plugin Handbook at developer.wordpress.org. Thorough and free. Two — structure your plugin with folders, add a readme.txt, submit to the WordPress.org plugin directory — free distribution to millions of sites. Three — learn the Settings API. Give your plugin an options page. That's where 'my first plugin' becomes 'my first product.'"

**Motion:** Each path grows from center outward, 1.0s, ease-out. Icon appears at path end 0.2s after line completes. Label fades in 0.3s at icon appearance.
- Path 1 (Plugin Handbook): standard
- Path 2 (WP.org submission): standard
- Path 3 (Settings API → product): path line glows #f59e0b at 25% opacity. Persists.

**Transition to Scene 9:** Fade to black, 0.4s (longest fade — signals ending).

---

## Scene 9: The Close
**Duration:** 15 seconds (expanded per Shonda — peak on capability, not completion)
**Purpose:** Emotional peak. They're a builder now.

**Visual:** Return to WordPress admin. "My First Plugin" active in plugins list. Admin notice visible. The product of their work, running.

**VO/Narration:**
"What you just built is running right now, on a real WordPress site, making a real user's experience better. You didn't install something. You built something. You're not a WordPress user anymore. You're a WordPress developer. And honestly — that's cooler."

**PAUSE BEAT** — 1 second.

**Visual shift:** Cut to black. The plugin description line scrolls up slowly (30px/second), stops center screen:

```
* Description: A simple plugin that proves I can do this.
```

Highlighted: 2px border + 20% amber glow. Holds 2 seconds.

**VO/Narration:**
"Thirty lines. Start building."

**Motion:** Hard cut to end card. Fade in 0.4s. Hold 5 seconds.

**End Card:**
- Background: #0a0a0a
- Text: #fafafa, 32pt Inter bold, centered, generous line-height
- "Get the starter code: [link]"
- "Plugin Handbook: developer.wordpress.org/plugins"

---

## TOTAL RUNTIME: ~4:05

### Scene Breakdown

| Scene | Title | Duration |
|-------|-------|----------|
| 1 | The Hook — "Your Site Just Broke" | 15s |
| 2 | Why a Plugin? | 15s |
| 3 | One File, One Comment + Fear Removal | 50s |
| 4 | The Secret — Hooks | 45s |
| 5 | Why This Matters — The Insight | 15s |
| 6A | Build It — Admin Notice | 35s |
| 6B | Build It — Shortcode | 35s |
| 7 | Activate and See It Work | 40s |
| 8 | Where You Go From Here | 20s |
| 9 | The Close | 15s |

### Production Notes

- **Narration drives code reveals.** Code never appears before the narrator justifies it.
- **Code typing speed matches speech.** If narrator says "function mfp_admin_notice" (2.5s), text appears over 2.5s.
- **Security taught inline.** `esc_html` explained in context, not deferred to "best practices."
- **Voice:** Speaks like they've done this a hundred times and enjoy showing someone else. Not a lecture. A conversation where one person knows more.
- **Animation timing:** UI motion 0.4-0.8s. Larger transitions 1-2s. Don't mix very fast (0.2s) with very slow (3s) in same scene.
- **The description line callback:** Planted in Scene 3 as throwaway. Pays off in Scene 9. Retroactively improves the beginning.

### Transition Map

| From → To | Type |
|-----------|------|
| 1 → 2 | Hard cut |
| 2 → 3 | Hard cut |
| 3 → 4 | Fade to black, 0.3s |
| 4 → 5 | Fade to black, 0.2s |
| 5 → 6A | Fade to black, 0.2s |
| 6A → 6B | No cut (continuous editor) |
| 6B → 7 | Hard cut |
| 7 → 8 | Fade to black, 0.3s |
| 8 → 9 | Fade to black, 0.4s |

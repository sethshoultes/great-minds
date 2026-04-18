# How to Build a WordPress Plugin
### Video Script -- Written by Aaron Sorkin, Great Minds Agency
### Runtime: ~3:40 | Style: Tutorial / Empowerment Narrative
### Audience: PHP developers who have never built a WordPress plugin

---

## Scene 1: The Hook -- "Stop Hacking Your Theme"
**Duration:** 15 seconds
**Visual:** Screen recording of a functions.php file. It's 800+ lines long. The scroll bar is tiny. The developer scrolls... and scrolls... and scrolls. Red underlines and deprecation warnings litter the code like crime scene tape.

**VO/Narration:**
"Somewhere right now, a developer is pasting code into functions.php and praying. They've done it before. It worked -- until the theme updated and everything vanished. There's a better way. It takes five minutes. And once you learn it, you'll never go back."

**Motion:** Slow zoom into the functions.php chaos. Hard cut to black on "never go back." Title card fades in: **HOW TO BUILD A WORDPRESS PLUGIN** -- clean white text, dark background. One beat of silence.

---

## Scene 2: Why a Plugin?
**Duration:** 25 seconds
**Visual:** Split screen. LEFT: a functions.php file with a red X fading in over it. RIGHT: a clean plugin folder with a green checkmark. Below each, bullet points appear one at a time.

**VO/Narration:**
"Here's the difference. Code in functions.php is married to your theme. Switch themes -- it's gone. Update the theme -- it might break. It's fragile by design. A plugin is independent. It survives theme changes. You can activate it, deactivate it, move it between sites. It's portable. It's yours. And the barrier to entry is -- genuinely -- one file."

**Motion:** Bullet points animate in on each side as the narrator mentions them. On "one file," both sides collapse and a single PHP file icon lands center screen.

---

## Scene 3: The Bare Minimum -- One File, One Comment
**Duration:** 40 seconds
**Visual:** Code editor, empty file. The filename reads `my-first-plugin.php`. The narrator's words appear as code, typed in real-time.

**VO/Narration:**
"Every WordPress plugin starts the same way. One PHP file. Inside that file, a comment block. That's it. That's the handshake. WordPress reads this comment to discover your plugin -- the name, the description, the version. Without it, WordPress doesn't know you exist. Watch."

[Code types out on screen:]
```php
<?php
/**
 * Plugin Name: My First Plugin
 * Description: A simple plugin that proves I can do this.
 * Version: 1.0
 * Author: Your Name
 */
```

**VO/Narration (continued):**
"That header comment is not decorative. It's functional. WordPress scans every PHP file in the plugins directory looking for exactly this pattern. You write it, you drop the file into wp-content/plugins, and you exist."

**Motion:** Code types character by character, matching narration pace. When the header is complete, a subtle glow pulses around the `Plugin Name` line. Cut to the WordPress admin plugins page -- "My First Plugin" appears in the list.

**CHECKPOINT:** "If you created this file and dropped it in wp-content/plugins, you'd see it in your admin right now. That's real."

---

## Scene 4: The Secret -- Hooks
**Duration:** 50 seconds
**Visual:** Animated diagram. A vertical timeline labeled "WordPress Loading..." with dots at various stages: init, wp_head, the_content, admin_notices, wp_footer. A plugin icon hooks onto one of the dots with a carabiner clip animation.

**VO/Narration:**
"Now -- the concept that makes all of this work. Hooks. WordPress doesn't call your code directly. Instead, as it loads a page, it announces what it's doing. 'I'm about to render the header.' 'I'm about to display the content.' 'I'm inside the admin dashboard.' These announcements are hooks. And your plugin can listen for any of them."

**PAUSE BEAT** -- 2 seconds. Let the diagram breathe.

**VO/Narration (continued):**
"There are two kinds. Actions and filters. An action says 'something is happening -- do you want to do something too?' A filter says 'here's some data -- do you want to change it before I use it?' Actions let you add. Filters let you modify. That's the entire model."

**Visual shift:** The diagram splits. LEFT side shows an action hook -- a function attaching to `admin_notices`. RIGHT side shows a filter hook -- a function attaching to `the_content` and passing text through.

**Motion:** The carabiner animation repeats for each hook type. Arrows show the flow: WordPress fires the hook, your function runs, life continues. Clean, mechanical, satisfying.

---

## Scene 5: Build It -- A Real Plugin in 30 Lines
**Duration:** 60 seconds
**Visual:** Back to the code editor. The header comment from Scene 3 is already there. New code appears below it.

**VO/Narration:**
"Let's make this real. We're going to build a plugin that does two things. First -- it shows a custom welcome message in the WordPress admin. Second -- it creates a shortcode you can drop into any page."

[Code types out -- Part 1: Admin Notice]
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
"add_action. Two arguments. The hook name -- admin_notices -- and the function you want to run when that hook fires. That's it. WordPress handles the timing. You handle the logic."

**PAUSE BEAT** -- 1.5 seconds.

[Code types out -- Part 2: Shortcode]
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
"Shortcodes use the same principle. You register a tag -- 'greeting' -- and point it at a function. When WordPress encounters that tag in a post, it calls your function and swaps in whatever you return. Notice esc_html on the output. Security isn't optional -- even in a tutorial."

**Motion:** Each code block builds line by line. Key terms -- `add_action`, `add_shortcode`, `esc_html` -- briefly highlight in a brighter color as they're mentioned. When both blocks are complete, a thin green border frames the entire file: this is a complete plugin.

**CHECKPOINT:** "You now have a working plugin. Header, action hook, shortcode. Three concepts. Thirty lines."

---

## Scene 6: Activate and See It Work
**Duration:** 30 seconds
**Visual:** Screen recording of WordPress admin. The Plugins page. "My First Plugin" is listed. Cursor clicks "Activate."

**VO/Narration:**
"Moment of truth."

[The page reloads. The admin notice appears at the top: "My First Plugin is active. You built this."]

**VO/Narration (continued):**
"There it is. Your code, running inside WordPress. Now let's test the shortcode."

[Screen recording: Navigate to Pages, open a page, type `[greeting name="Developer"]` in the block editor. Preview the page. The rendered output reads: "Hello, Developer!"]

**VO/Narration (continued):**
"From a comment block and two functions to something a real user can see and interact with. That's the whole journey. Everything else -- settings pages, database tables, REST API endpoints, custom post types -- it's all built on this same foundation. Hooks. Functions. Register your intent, let WordPress call you."

**Motion:** Smooth screen recording with subtle cursor spotlight effect. When the shortcode renders, a brief zoom-in on the output with a soft confirmation sound.

---

## Scene 7: Where You Go From Here
**Duration:** 20 seconds
**Visual:** Clean slide with three paths branching from a central node. Each path has an icon and a label.

**VO/Narration:**
"Three paths forward. One -- the Plugin Handbook at developer.wordpress.org. It's thorough and it's free. Two -- structure your plugin with folders. Separate your admin code from your public code. Add a readme.txt and you're ready to submit to the WordPress.org plugin directory -- free distribution to millions of sites. Three -- learn the Settings API. Give your plugin an options page. Let users configure it without touching code. That's where 'my first plugin' becomes 'my first product.'"

**Motion:** Each path animates in as it's mentioned. The third path -- "my first product" -- glows slightly brighter than the others.

---

## Scene 8: The Close
**Duration:** 10 seconds
**Visual:** Black screen. The complete plugin file scrolls slowly upward, Star Wars style, but stops. One line highlighted:

```
* Description: A simple plugin that proves I can do this.
```

**VO/Narration:**
"Thirty lines. That's the distance between 'I use WordPress' and 'I extend WordPress.' Start building."

**Motion:** The highlighted description line holds for two beats. Hard cut to end card with channel subscribe / link to starter code / plugin handbook URL.

**ON-SCREEN TEXT:**
  "Get the starter code: [link]"
  "Plugin Handbook: developer.wordpress.org/plugins"

---

### TOTAL RUNTIME: ~3:40

### Production Notes
- Music: Minimal electronic underscore. Confident, not cute. Think Atticus Ross, not ukulele.
- Pacing: The narration drives the code reveals, not the other way around. Code never appears before the narrator has set up WHY it matters.
- Code font: JetBrains Mono or Fira Code. Dark editor theme. No distracting syntax rainbow -- two or three highlight colors max.
- The voice: Male or female, doesn't matter. What matters: speaks like they've done this a hundred times and genuinely enjoy showing someone else. Not a lecture. A conversation where one person happens to know more.

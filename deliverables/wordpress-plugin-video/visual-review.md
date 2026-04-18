# Visual Design Review: WordPress Plugin Tutorial Video

## Overview
This script has strong narrative architecture and a clear pedagogical spine. The visual directions need refinement in three areas: **code pacing** (revealing too much simultaneously), **visual hierarchy** (not enough contrast between primary and supporting elements), and **breathing room** (scenes feel structured but not spacious). Below are specific, implementable improvements.

---

## 1. Visual Hierarchy

### Current State
Most scenes treat code and diagrams with equal visual weight. The most important concept—*what the viewer should learn*—isn't always the most prominent element on screen.

### Issues & Fixes

**Scene 2 (Why a Plugin?) — Split Screen**
- PROBLEM: The red X and green checkmark are visually equivalent in size. The checkmark (the positive outcome) should dominate.
- FIX: Scale the checkmark to 1.4x the X. Let asymmetry signal hierarchy. X: 60%, Checkmark: 85%. The PHP file icon that "lands" at the end should arrive with >150% scale to punctuate the message.

**Scene 3 (One File, One Comment) — Code + Discovery**
- PROBLEM: The pulsing glow around `Plugin Name` is subtle (good restraint, wrong target). It should highlight the *entire header block* — the glow needs to frame all four comment lines, not just one. This is the object of value.
- FIX: Expand glow boundary to contain `<?php` through the closing `*/`. Use #f59e0b (amber) at 20% opacity, 4-6px blur. Pulse every 2 seconds, 0.6s fade-in/fade-out. Makes the "handshake" visually atomic.

**Scene 4 (The Secret — Hooks) — Timeline Diagram**
- PROBLEM: The five hook dots (init, wp_head, the_content, admin_notices, wp_footer) are all the same size. The carabiner clip attachment is striking, but *which hook is most important?* None is emphasized.
- FIX: Make the dots proportional to importance in a typical plugin flow. `admin_notices` and `wp_head` should be 20% larger. When the carabiner attaches in the two-part visual split (Scene 4 continued), the **action hook (`admin_notices`)** should have a 2px amber border; the **filter hook (`the_content`)** should have a 2px amber border but different visual distinction—maybe a subtle glow instead of a solid border. Viewers should see "hooks look different depending on what they do" without needing to be told.

**Scene 5 (Build It — 30 Lines) — Code Highlighting**
- PROBLEM: "Key terms briefly highlight in a brighter color" is too vague. If every `add_action` and `add_shortcode` lights up the same way, nothing stands out.
- FIX: Use selective, semantic highlighting:
  - `add_action` and `add_shortcode` (the hook registration): brief highlight in #f59e0b, 0.4s fade
  - `esc_html` (the security concept, narratively important): highlight in a softer amber, longer fade (0.6s), and briefly (0.8s) expand a tooltip: "Security isn't optional — even in tutorials."
  - Function names (`mfp_admin_notice`, `mfp_greeting_shortcode`): no highlight—these are implementation details, not concepts.

---

## 2. Code Presentation & Pacing

### Current State
Code reveals are narrator-driven (correct principle). But Scene 5 stacks two blocks back-to-back in a 60-second window, which is 90+ lines typed on screen. That's cognitively dense.

### Issues & Fixes

**Scene 5 (Build It) — Code Density**
- PROBLEM: "Code types line by line" across two functions in 60 seconds = ~1.5 lines per second. At 1920x1080, with JetBrains Mono at readable size (18-20pt), viewers cannot read *and* understand the logic simultaneously.
- FIX: Separate the two code blocks into **two distinct temporal phases**:
  - **First 30 seconds:** Admin notice function builds line by line, narration explains each line.
    - `function mfp_admin_notice()` — "Every WordPress plugin starts with functions."
    - `echo '<div class="notice notice-info is-dismissible">';` — "HTML markup for the admin message."
    - `echo '<p>My First Plugin is active. You built this.</p>';` — "The actual message."
    - `}` — "Close the function."
    - **PAUSE BEAT 1.5 seconds** — Let it settle.
  - **Next 30 seconds:** Shortcode function builds. New code enters below.
    - Build it line by line.
    - **Pause for 2 seconds** before pressing onward.
  - When both blocks are complete (end of 60s), the green frame appears and pulses once.

- TIMING DETAIL: Type speed should match speech. If the narrator says "function mfp_admin_notice" (2.5 seconds), the text should appear over those 2.5 seconds, not instantly. Sync motion to voice.

**Scene 6 (Activate and See It Work) — Screen Recording**
- PROBLEM: No mention of what speed the screen recording should play at. At normal speed, clicking + page reload + navigation to Pages + editing + preview = 30 seconds. Too fast to follow.
- FIX: Playback speed 0.75x. The cursor spotlight effect is good; make sure it has a 15-20px feather so it feels soft, not harsh. On the admin notice reveal and the shortcode output, brief pause (1 second) before continuing—let the "moment of truth" breathe.

---

## 3. Animation & Motion

### Current State
Good instincts: carabiner clips, slow zoom, hard cuts. But motion needs purpose.

### Issues & Fixes

**Scene 1 (The Hook) — Zoom + Cut**
- PROBLEM: "Slow zoom into the functions.php chaos" is directionally correct but unspecified. Zoom speed matters.
- FIX: Zoom in over 8 seconds (from 1x to 1.5x) while the narrator speaks. Hard cut to black on "never go back" — exactly on the final syllable. Zero delay. The silence that follows is the design.

**Scene 2 (Why a Plugin?) — Bullet Point Sequencing**
- PROBLEM: "Bullet points animate in on each side as the narrator mentions them" — no easing specified. Linear motion (constant speed) feels robotic.
- FIX: Bullets enter from the left (LEFT side) and right (RIGHT side) simultaneously with **ease-out** easing, 0.5s duration, 10-15px travel distance. Stagger: each bullet is 0.3-0.4s apart. No bounce, no overshoot. Clean, decisive.

**Scene 4 (Hooks) — Carabiner Clip**
- PROBLEM: Satisfying animation concept, but "carabiner animation repeats" is vague. Repetition can feel cheap.
- FIX: 
  - First carabiner clip (timeline introduction): smooth 0.8s swing-in, settles on a dot with a subtle click sound (optional, but reinforces solidity).
  - When the diagram splits for actions vs. filters: Two carabiners appear simultaneously (2-carabiner version of the animation), each clipping onto its respective hook, 0.6s duration, slight delay between them (0.1s stagger).
  - Avoid repeating the exact same animation path twice. Vary the approach angle.

**Scene 7 (Where You Go From Here) — Path Branching**
- PROBLEM: "Each path animates in as it's mentioned" — does the entire path grow, or does it appear all at once? Unclear motion creates cognitive friction.
- FIX: Each path should **grow** from the center node outward in a single smooth line, 1-second duration, with ease-out. The icon appears at the path's end once the line is complete (0.2s after line finishes). The label fades in just before the icon. By "my first product" (third path), that path glows slightly (+15% opacity on the path line, not the background). This is visual *preference*—good design trains the eye.

---

## 4. Color & Contrast

### Current State
Style guide is tight: #0a0a0a background, #f59e0b accent, #fafafa text. Code syntax not specified.

### Issues & Fixes

**Code Syntax Highlighting — Undefined**
- PROBLEM: Script says "no distracting syntax rainbow — two or three highlight colors max" but doesn't define which colors. Too much freedom here leads to inconsistency.
- FIX: Define a precise syntax palette:
  - **Keywords** (`<?php`, `function`, `add_action`, `return`, `echo`): #fafafa (text color, no highlight)
  - **Strings** (`"admin_notices"`, `'<div...'`): #f59e0b (amber) — stands out as literal data
  - **Function calls** (`echo`, `add_action`, `add_shortcode`): #fafafa, but bolded (700 weight) to distinguish from other text
  - **Comments** (`//`, `/** ... */`): #9ca3af (gray, ~40% opacity of text). Recessive but readable.
  - **Numbers / Variables** (`'World'`, `$atts`): #fafafa with slight de-emphasis (90% opacity)
  - NO pink, cyan, purple, or rainbow gradients.

**Glow Effects — Excessive Brightness**
- PROBLEM: "A subtle glow pulses around the Plugin Name line" and "glows slightly brighter" suggest multiple glow intensities without specification. Glows can look dated if too saturated.
- FIX: 
  - Glow opacity: 15-20% maximum for subtle effects, 25-30% for emphasis.
  - Glow color: Always #f59e0b (amber, your accent). Never glow with white or cyan.
  - Glow radius: 4-6px for thin lines, 8-10px for larger blocks.
  - Pulse timing: 2-3 second cycle (fade-in 0.4s, hold 0.8s, fade-out 0.8s). This feels slow and deliberate, not twitchy.

**Text Contrast on Code Blocks**
- PROBLEM: #fafafa (near white) on #0a0a0a (near black) is technically accessible (~18:1 ratio), but in a video, readability depends on the editor background. Is the editor background pure black or slightly lighter?
- FIX: If editor background is #0a0a0a, keep text at #fafafa. If editor is slightly lighter (#1a1a1a or #111111), text is fine. Test on reference displays (1920x1080 at typical viewing distance). At 20pt JetBrains Mono, text should remain sharp. Avoid anti-aliasing blur in screen recordings—this is crucial for code readability in video.

---

## 5. Typography

### Current State
Inter (body) + JetBrains Mono (code). No sizes specified for different elements.

### Issues & Fixes

**Title Card (Scene 1)**
- PROBLEM: "HOW TO BUILD A WORDPRESS PLUGIN -- clean white text, dark background" — no size, no positioning.
- FIX:
  - Font: Inter, 700 weight (bold)
  - Size: 80-96pt (test at 1920x1080; should be legible from ~3-4 feet away)
  - Color: #fafafa
  - Positioning: Center screen, vertical center + 20% down (not dead center—slightly lower reads better)
  - Letter spacing: +2-3% (loosening large text makes it feel more intentional)
  - Duration: Fade in over 0.6s, hold for 2 seconds, fade out over 0.4s on hard cut.

**Bullet Points (Scene 2)**
- Size: 28-32pt Inter, 500 weight
- Color: #fafafa
- Line height: 1.6 (generous, reduces visual density)
- Max width per line: ~600px (prevents super-wide lines that tire the eye)

**Code Editor Text (Scenes 3, 5)**
- Font: JetBrains Mono, 400 weight
- Size: 20pt (measured in pixels, or equivalent line-height of 28-30px). Test on screen. Smaller code (18pt) works if viewers are close; 22pt is safer for video with variable viewing distances.
- Line height: 1.6 (28-30px for 18-20pt code)
- Tab size: 4 spaces (indent consistency matters visually)

**Narration Captions (Optional, but Recommended)**
- If captions appear: 24pt Inter, 500 weight, #fafafa, with a small dark background box (+1px padding, #0a0a0a with 50% opacity) to ensure contrast if text overlaps complex backgrounds.

---

## 6. Spacing & Breathing Room

### Current State
Scenes are structured (which is good) but no spacing spec for within-scene elements.

### Issues & Fixes

**Scene 3 Code Block — Margin & Padding**
- PROBLEM: Code appears to fill the editor window. No margin around edges = feels cramped.
- FIX:
  - Code left margin: 32px from editor edge
  - Code top margin: 48px from editor title bar
  - Code right margin: 32px from editor edge
  - Code bottom margin: 48px (or `auto` if centered vertically)
  - This creates visual "room" around the code, making it feel intentional rather than thrown at the viewer.

**Split Screen (Scene 2)**
- PROBLEM: No spec for the gap between LEFT and RIGHT sides.
- FIX:
  - Left column: 0–48% of screen width
  - Gap: 4% of screen width (76px at 1920px wide)
  - Right column: 48–100% of screen width
  - This 76px gap is neither huge nor nonexistent. It's rhythmic.

**Vertical Spacing Between Code Blocks (Scene 5)**
- PROBLEM: When the second code block enters, is it stacked 20px below the first, or 40px, or 80px?
- FIX:
  - First block occupies roughly the upper 40% of the editor.
  - Vertical gap between blocks: 32px
  - Second block occupies the lower 40%
  - This leaves breathing room while keeping both blocks visible without scrolling.

**Scene 6 Screen Recording — Cursor Spotlight**
- The cursor spotlight (soft focus around the active click point) should have a clear feather radius (15-20px). Don't make it so bright that it washes out the underlying UI. Brightness: +10-15% vs. surrounding, not +50%.

---

## 7. Overall Visual Rhythm

### Current State
Strong narrative pacing; visual pacing is less defined. Rhythm emerges from consistent motion, timing, and spacing.

### Issues & Fixes

**Transition Between Scenes — Hard Cuts vs. Fades**
- Scene 1→2: Hard cut (correct, emphatic)
- Scene 2→3: Hard cut (correct)
- Scene 3→4: Fade to black, 0.3s, then fade in on diagram (correct, provides a visual "beat")
- Scene 4→5: Fade to black, 0.2s (quicker, maintains momentum)
- Scene 5→6: Hard cut (correct, shifts mode from code to live action)
- Scene 6→7: Fade to black, 0.3s, then fade in on branching paths
- Scene 7→8: Fade to black, 0.4s (longest fade, signals approaching the end)

**Pause & Breath Beats — Current Spec**
- Scene 4 has "PAUSE BEAT 2 seconds" ✓ Good.
- Scene 5 has "PAUSE BEAT 1.5 seconds" then "PAUSE BEAT 2 seconds" ✓ Good.
- Recommend adding pauses in Scene 2 (after the PHP icon lands, 1 second) and Scene 6 (after the admin notice appears, 1 second, then 1 second after the shortcode renders).

**Motion Timing Consistency**
- Element animations should cluster around **0.4–0.8 second durations** (UI motion) and **1–2 second durations** (larger visual transitions like text reveals).
- Avoid mixing very fast (0.2s) with very slow (3s) in the same scene unless intentional.

**Rhythm Summary**
- **Code typing pace**: Match narrator speed. ~1.5–2.5 seconds per line for complex logic, ~0.8–1.2 seconds for simple declarations.
- **Pause beats**: 1–2 seconds after a significant visual moment. Not every moment needs one, but key "checkpoints" do.
- **Scene duration**: You've specified this; maintain it. Scenes feel right-sized.

---

## 8. Specific Visual Direction Improvements

### Scene 1: The Hook
```
Zoom timing: Start at 1x scale, reach 1.5x scale over 8 seconds (ease-in-out).
Scroll bar on functions.php should shrink as zoom increases (visual reinforcement of "enormous file").
Hard cut to black is exact on "never go back" (narrator timing is critical here).
Title card: Appears 0.2s after black, fades in over 0.6s.
```

### Scene 2: Why a Plugin?
```
LEFT side (functions.php):
  - Red X: 60px diameter, centered vertically in left column.
  - Below X, bullet points at 28pt Inter, stagger entry 0.4s apart:
    - "Married to your theme" (fade in from left, 0.5s)
    - "Dies on theme update" (fade in from left, 0.5s)
    - "Not portable" (fade in from left, 0.5s)

RIGHT side (plugin folder):
  - Green checkmark: 85px diameter (1.4x scale of X), centered vertically.
  - Below checkmark, bullets enter from right simultaneously:
    - "Independent" (fade in from right, 0.5s)
    - "Survives updates" (fade in from right, 0.5s)
    - "Portable" (fade in from right, 0.5s)

Collapse animation (6 seconds):
  - Both sides shrink toward center, opacity fades to 60%.
  - Single PHP file icon appears center screen, 150px diameter, lands with gentle bounce (0.6s).
  - Brief 1-second pause before next narration.
```

### Scene 3: Code Reveal
```
Editor background: #1a1a1a (slightly lighter than pure black for code readability).
Code left-margin: 32px
Code top-margin: 48px
Code color: #fafafa
Syntax highlighting: Keywords & function calls in #fafafa (bold); strings in #f59e0b; comments in #9ca3af.

Glow frame (after code complete):
  - Border: 2px solid #f59e0b at 30% opacity.
  - Blur: 6px.
  - Pulse: Fade in 0.4s, hold 1.2s, fade out 0.6s.
  - Cycles twice (total 6 seconds).

Transition to admin page (screenshot):
  - Fade to new screenshot over 0.4s.
  - "My First Plugin" entry highlights with 1px amber border, pulse 1x (0.6s).
```

### Scene 4: Hooks Diagram
```
Timeline: Vertical axis, labeled "WordPress Loading..." at top.
Dots: 6px radius, color #f59e0b, evenly spaced.
Dot labels (init, wp_head, the_content, admin_notices, wp_footer): 16pt Inter, positioned to the right of each dot.

Plugin icon: 20px diameter, attaches via carabiner clip animation (0.8s swing-in).
Carabiner: Subtle rotation (5-10 degrees) during swing, settles with small click sound (optional).

Split diagram (at 30-second mark):
  LEFT (action hook):
    - `admin_notices` dot enlarged to 8px.
    - Carabiner clip attaches, 0.6s.
    - Function box appears below: "Your function runs here" (16pt, #f59e0b glow, 15% opacity).

  RIGHT (filter hook):
    - `the_content` dot enlarged to 8px.
    - Carabiner clip attaches, 0.6s (stagger 0.1s after LEFT).
    - Filter box appears: "Filter hook: data in → your function → data out" (16pt, softer styling).
```

### Scene 5: Build It
```
Upper code block (admin notice):
  - Editor background: #1a1a1a
  - Code enters line-by-line, duration = narrator speech duration for each line (1.5–2.5s per line).
  - After completion, 1.5s pause.

Lower code block (shortcode):
  - Appears below first block with 32px margin.
  - Code enters line-by-line.
  - After completion, green frame pulses once around entire file (2-second pulse cycle).

Key term highlighting:
  - `add_action`: #f59e0b highlight, 0.4s fade, appears as function is spoken.
  - `add_shortcode`: Same as above.
  - `esc_html`: Longer highlight (0.6s fade), with subtle tooltip: "Security first" (12pt, #f59e0b, appears 0.2s after highlight).
```

### Scene 6: Activate and See It Work
```
Screen recording speed: 0.75x (slower than real-time, easier to follow).
Cursor spotlight: 20px feather radius, +12% brightness (not overwhelming).

Admin notice reveal:
  - Pause 1 second, let it sink in.
  - Optional: Very subtle pulse on the notice (0.2s, +5% brightness), once, to draw attention.

Shortcode output:
  - Pause 1 second after preview loads.
  - Brief zoom (1.0x → 1.1x) on "Hello, Developer!" text over 0.4s (confirms the output).
```

### Scene 7: Where You Go From Here
```
Central node: Large WordPress logo or plugin icon (80px), positioned center.
Three paths branch outward at 120-degree angles (up-left, up-right, down).

Path animations (as narrator mentions each one):
  Path 1 (Plugin Handbook):
    - Line grows from center to path end, 1.0s (ease-out).
    - Icon appears at path end, 0.2s after line completes.
    - Label fades in, 0.3s (starting at icon appearance).

  Path 2 (Folder structure):
    - Same timing as Path 1.

  Path 3 (Settings API → "my first product"):
    - Same timing, but glow on path line: #f59e0b at 25% opacity (slight emphasis).

All three paths remain visible. Path 3's glow persists while next scene transitions.
```

### Scene 8: The Close
```
Black screen fades in over 0.2s.
Plugin file begins scrolling upward (Star Wars style), speed = 30px/second.
File stops when this line reaches vertical center:
  * Description: A simple plugin that proves I can do this.

Line remains highlighted (2px border + 20% amber glow) for 2 seconds.
Hold the screen for 3 seconds total (scroll stop).
Hard cut to end card, fade in over 0.4s.

End card:
  - Background: #0a0a0a
  - Text: #fafafa (32pt Inter, bold)
  - "Get the starter code: [link]"
  - "Plugin Handbook: developer.wordpress.org/plugins"
  - Positioning: Center screen, generous line-height
  - Duration: Visible for 5 seconds (allows time to read and note links).
```

---

## Summary: Visual Coherence

This video will feel cohesive if:

1. **Consistency**: All code blocks use the same syntax colors and spacing. All animations use the same easing curves (ease-out for entrance, ease-in-out for movement).
2. **Restraint**: The amber accent (#f59e0b) appears *only* for highlights, glows, and key emphasis. It doesn't decorate every element.
3. **Rhythm**: Pause beats are deliberate. Code reveal speed matches narrator pace. Transitions between scenes use the specified hard cuts and fades.
4. **Clarity**: Every animation is purposeful. No spinning, bouncing, or fading unless it serves understanding.
5. **Breathing Room**: Margins, gaps, and pause beats give the viewer time to absorb.

The script itself is excellent—narrative clarity, sound pedagogy, a real journey. The visual design should serve that clarity without competing for attention.

---

## Next Steps
- Storyboard Scene 4 (Hooks diagram) first; it's the most visual-design-heavy.
- Build a clickable Figma prototype of code blocks (Scenes 3 & 5) to verify timing and spacing feel right.
- Record a 30-second test segment (Scene 3: code reveal + admin page) to validate code readability at your target resolution and screen distance.
- Lock down the code syntax color palette before production recording begins.

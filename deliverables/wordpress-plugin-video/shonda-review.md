# Shonda's Review: "How to Build a WordPress Plugin"

## The Good News

This is a pilot that understands its audience and respects its format. The structure is sound. The pacing is deliberate. The emotional arc from "this seems scary" to "I just shipped code" is real. You've done the work.

But there's a difference between a well-crafted educational video and one that people *want to share*. This script is the former. It needs to become the latter.

---

## 1. THE HOOK: Does It Land? (First 5 seconds)

**Grade: B-minus**

You open with a problem — a functions.php file scrolling endlessly, red underlines, deprecation warnings. This is visceral. Developers recognize that nightmare immediately. The narration lands: "Somewhere right now, a developer is pasting code into functions.php and praying."

But here's the issue: **You're not specific enough about the stakes.**

The current version says "it worked -- until the theme updated and everything vanished." That's a consequence, not a catastrophe. A developer hearing that thinks "okay, inconvenient." They don't think "I MUST watch this immediately."

### REWRITE THE HOOK:

**Current:**
> "Somewhere right now, a developer is pasting code into functions.php and praying. They've done it before. It worked -- until the theme updated and everything vanished. There's a better way. It takes five minutes. And once you learn it, you'll never go back."

**Should be:**
> "Right now, somewhere, a developer just lost three hours of custom code because the theme updated. Their client is calling. Their boss is asking why the site broke. And that line of custom code they buried in functions.php? Gone. The only thing that makes this worse is knowing there was a way to prevent it. That way takes five minutes to learn. And once you know it, you'll never make this mistake again."

**Why:** The current version has consequence. The rewrite has crisis. Crisis pulls people in. "My site just broke" > "my site might break someday."

---

## 2. NARRATIVE TENSION: Does It Pull You Through Scene by Scene?

**Grade: B**

Here's where I'm honest: The script is *competent* but it's not *gripping*. You have a clear progression — Problem > Solution > Theory > Build > Proof > Next Steps. That's a complete story arc.

But you're missing the thing that makes people lean forward: **the moment where it clicks**.

Right now, you're playing it safe. Each scene explains, then moves to the next. That's educational. But education doesn't make people come back or tell their friends.

### The problem: Scene 4 (Hooks) is where most viewers will drift

**Why:** You're introducing the most abstract concept (hooks) with an animated diagram and explanation. The diagram is correct. The explanation is clear. But there's no *"oh, I get it now"* moment where the tension breaks and the viewer feels smart.

### Here's what's missing:

Between Scene 4 and Scene 5, add 15 seconds of something that makes people think "I didn't know that." A small revelation. A "wait, so this is why WordPress works that way?"

**SUGGESTED ADDITION (between Scenes 4 and 5):**

New mini-scene: "The Real Reason Hooks Exist" (15 seconds)

**Visual:** Diagram showing two paths: LEFT - chaos (multiple plugins trying to do the same thing, stepping on each other), RIGHT - WordPress hooks (orderly queue of functions).

**VO:** "Here's why this design matters. WordPress doesn't know what plugins you'll install. It can't control the order. But hooks create a standard way for independent code to work together without collision. That's why WordPress runs a million plugins on a million sites without exploding. Every single one is listening to the same announcements."

**Why this works:** You've just shown them WHY the thing they're about to build matters at scale. It's not just "here's how to do it." It's "here's why this way of thinking about it makes you a better developer." People share *insights*, not instructions.

---

## 3. BUILD TO RESOLUTION: Does It Land?

**Grade: B**

Scene 5 (the actual build) is well-paced and shows real code. Scene 6 (activation) gives proof-of-life. These two scenes together are the "Act 2 turning point" — where the theoretical becomes physical.

But here's the problem: **Scene 6 is too brief and doesn't have enough payoff.**

Right now it's 30 seconds. You click "Activate," the notice appears, you test the shortcode, done. The viewer experiences it as: "Okay, so the code ran. That's expected."

What they should experience is: "I just extended WordPress itself."

### REWRITE Scene 6 to extend the payoff moment:

**Current structure:**
- Activate plugin
- Admin notice appears
- Test shortcode
- Done in 30 seconds

**Should be:**
- Activate plugin
- Admin notice appears
- Narrator responds to it with emphasis
- Test shortcode on a live page
- Viewer sees the rendered output
- Brief moment where narrator reflects on what just happened

**Specific change:**

After the admin notice appears, add this line of narration:

> "That message came from YOUR code. Not from WordPress. Not from a plugin you downloaded. From thirty lines you just wrote five minutes ago. This is what it means to be a developer on this platform — not a user, a builder."

This does three things:
1. Labels the emotional moment
2. Makes the viewer feel the accomplishment
3. Sets up the CTA with conviction

---

## 4. SHAREABILITY: Would Someone Share This?

**Grade: C**

This is the hardest truth. The script is **educational** but it's not **remarkable**. And remarkable is what gets shared.

Right now, the person who would share this is: "A PHP developer who's been forced to use WordPress and wants to level up." 

That's a real audience, but it's small. And it's the kind of audience who learns from blog posts and documentation anyway.

### Here's what would make it shareable:

**Problem 1: No one is the hero of this story. You are.**

The video is narrated in the second person ("you"), but the viewer is *watching* someone else win. They're not experiencing the win themselves. Compare:

- **Not shareable:** "Here's how to build a plugin"
- **Shareable:** "You've been using WordPress for two years and never realized you could do THIS"

The difference is the moment of personal discovery.

**Problem 2: You don't address the emotional barrier.**

The actual reason developers don't build WordPress plugins isn't lack of knowledge. It's fear. "What if I break something?" "What if my code is bad?" "What if I can't figure out the setup?"

You skip over this. By the time Scene 5 rolls around, you've presumed them into confidence. But that presumption isn't earned.

### SPECIFIC REWRITE for Scene 3 (add 15 seconds):

**After the plugin header code is typed out, add this:**

**VO:** "Before we go further, here's the thing no one tells you: You cannot break WordPress by creating a plugin. Your code is isolated. It has no access to the core. If your plugin crashes, WordPress keeps running. If your plugin is wrong, you deactivate it and move on. There's no production risk. This is the safest way to extend WordPress. So for the next few minutes, you can stop being careful. You can actually try something."

**Visual:** The "My First Plugin" file icon on screen. A subtle glow appears around it. Not intimidating. Inviting.

**Why:** You've just removed the fear. The barrier to watching is gone. Now they're *curious* instead of *anxious*. Curiosity keeps people watching. Anxiety makes them close the tab.

---

## 5. DEAD SPOTS: Where Does Attention Drop?

**Grade: B**

Scene 2 (Why a Plugin?) is the biggest risk for drift.

It's a split-screen comparison. Functions.php on the left (bad). Plugin folder on the right (good). The bullets appear one at a time. It's clear. It's logical.

It's also *static*. 

For 25 seconds, the viewer is watching text appear on a screen while the narrator explains why the right side is better than the left side. By second 15, the message has landed. The remaining 10 seconds are repetition.

### REWRITE Scene 2 to compress and energize it:

**Current length:** 25 seconds  
**Proposed length:** 15 seconds

Remove one of the three bullets on the comparison. You have:
1. Theme switch breaks it
2. Theme update breaks it
3. It's portable

Cut #2. "Theme switch breaks it" is enough. The other two are variations of the same idea.

**Faster animation:** Instead of bullets appearing one at a time, have them all there but *highlight* one at a time as the narrator mentions it.

**More dynamic visual:** When the narrator says "portable," don't just show a checkmark. Show the plugin icon *moving* between three different WordPress sites on the screen, leaving a trail. Something that says "independence" through motion, not through a check mark.

---

## 6. PACING FOR EDUCATIONAL CONTENT: Does It Breathe?

**Grade: A-minus**

Here's where the script succeeds. Each scene has one clear purpose. Code doesn't appear before the narrator explains why you're looking at it. The pause beats are marked explicitly. You're not rushing.

One note: Scene 5 moves fast. You introduce the admin notice, explain add_action, then immediately jump to shortcodes and add_shortcode. It's only 60 seconds, which is too fast for both concepts.

### FIX for Scene 5:

Split the code build into two separate scenes:

**Scene 5A: Admin Notice (35 seconds)**
- Show the first add_action hook
- Explain what happened
- Pause

**Pause Scene: Let It Settle (10 seconds)**
- Narrator reflects: "One function. One hook. That's the pattern. It's everywhere in WordPress."
- Visual: A subtle animation showing the same pattern appearing in different contexts (header, footer, admin)

**Scene 5B: The Shortcode (35 seconds)**
- Show the shortcode function
- Activate and test the shortcode specifically
- Closing moment

This gives the viewer time to absorb the abstraction before hitting them with a second application of the same pattern.

---

## 7. EMOTIONAL ARC: From "Hard" to "I Can Do This"

**Grade: B+**

The arc exists. It goes:
- Act 1: "This is broken" (functions.php chaos)
- Act 2: "Here's why" (hooks theory)
- Act 3: "Here's how" (the build)
- Act 4: "You just did it" (proof)
- Act 5: "Here's what's next" (paths forward)

That's correct. The problem is *the peak of confidence isn't high enough*.

Scene 8 (The Close) brings it back down to intellectual pride: "Thirty lines. That's the distance between 'I use WordPress' and 'I extend WordPress.'"

That's good. But it's not *triumphant*. 

### REWRITE Scene 8 for maximum payoff:

**Current ending visual:** Black screen with code scrolling Star Wars style.

**Better ending:** 

Go back to the WordPress admin. The "My First Plugin" plugin is *active*, visible in the list. The admin notice is showing. The narrator says:

> "What you just built is running right now, on a real WordPress site, making a real user's experience better. You didn't install something. You built something. You're not a WordPress user anymore. You're a WordPress developer. And honestly? That's cooler."

**Then:** Cut to a simple title card with the next steps, but the tone should be "you're ready for this" not "here's extra stuff if you care."

**Why:** The emotional arc peaks on *capability*, not on *completion*. You're not celebrating that they finished a tutorial. You're celebrating that they shipped code that's running.

---

## FINAL THOUGHTS

This script is **technically sound**. It explains a complex concept clearly. The structure works. The audience will learn.

But **you're leaving money on the table** in terms of emotional impact and shareability.

The gap between a tutorial people watch and a tutorial people *tell their friends about* is small, but it matters:

1. **Name the fear** (that's preventing people from trying) and remove it
2. **Add one insight** (between theory and execution) that makes people feel smart
3. **Extend the victory lap** (make the "it works" moment longer and louder)
4. **Change the ending** (from "here's what's next" to "you're a builder now")

Right now, this video will educate 100 developers who search for "how to build a WordPress plugin." 

With these changes, it becomes the kind of video that 100 developers *share with their friends*. Which means it educates 1,000.

That's the difference between a script and a narrative that spreads.

---

## Implementation Notes

- Add the "remove fear" moment in Scene 3 (15 sec)
- Add the "hooks matter at scale" insight between Scenes 4 and 5 (15 sec)
- Compress Scene 2 and replace static bullets with dynamic motion (save 10 sec)
- Split Scene 5 into two scenes with a reflection moment in between (adds breathing room)
- Rewrite Scene 6 to extend the victory moment (add 10-15 sec)
- Rewrite Scene 8 ending to peak on capability, not completion

**Total runtime impact:** ~3:55-4:05 (slightly longer, but every second earns its place)

**Why it's worth it:** This becomes a video people come back to. A video people link in Slack. A video that starts conversations.

That's when you know you've built something that works.

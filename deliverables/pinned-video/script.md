# Pinned - Video Script (45s)

**Target audience:** WordPress administrators, editorial teams, agency site managers
**Tone:** Warm, quick, conversational — the pitch happens inside the product
**Format:** Remotion (React-based video framework)

---

## Scene 1 (0:00 - 0:05)
**Visual:** A WordPress dashboard. Clean, familiar, slightly boring. The cursor drifts across the screen like someone looking for something. Then — a double-click. A bright yellow sticky note blooms onto the dashboard, slightly tilted, with a cursor blinking inside it.
**Audio/VO:** "You know what's missing from every WordPress dashboard? A human being saying — hey, don't forget about this."
**Motion:** The note appears with a soft paper-unfold animation — not a fade, a physical arrival. The tilt is 2-3 degrees, random. It feels *placed*, not rendered.

---

## Scene 2 (0:05 - 0:15)
**Visual:** More notes appear in quick succession — blue, pink, green, peach, yellow — scattering across the Pinned Notes widget. Each one carries a different message: "Homepage banner expires Friday," "@sarah the client changed the logo AGAIN," "Do NOT touch the footer shortcode." The notes age slightly as they sit — edges soften, color fades a shade.
**Audio/VO:** "Pinned is a sticky note system for your dashboard. Five colors. Notes that age so you know what's stale. Mention a teammate and they'll see it the moment they log in."
**Motion:** Notes land in a staggered cascade, each with its own rotation. The aging effect is a slow, subtle color shift on the oldest note — blink and you'd miss it. @sarah highlights briefly in blue.

---

## Scene 3 (0:15 - 0:28)
**Visual:** A teammate logs in. Their dashboard loads. A note with "@sarah" pulses gently — not aggressively, the way a Post-it on your monitor would catch your eye. She clicks the checkmark. The note's acknowledgment icon fills in. Cut to: a note with an expiry badge — "Expires: March 15" — and a clock icon ticking. The date arrives. The note dissolves like paper left in the rain.
**Audio/VO:** "They acknowledge it with a click. Set an expiry date and the note takes itself down. No cleanup. No 'did you see my Slack?' No meetings about the meeting."
**Motion:** The acknowledgment checkmark fills with a satisfying ink-spread effect. The expiring note doesn't vanish — it softens, buckles slightly, then fades. Organic, not digital.

---

## Scene 4 (0:28 - 0:38)
**Visual:** Pull back to the full dashboard. A constellation of colorful, slightly tilted notes sits in the widget — some fresh, some aged, one just acknowledged. It looks like a real desk. A real team was here. The Quick Draft widget sits next to it, lonely by comparison.
**Audio/VO:** "Your CMS already knows your content. Pinned makes sure your team knows each other. Double-click. Leave a note. Move on."
**Motion:** Slow zoom out. The notes settle into their final positions with a micro-wobble, like paper finding its resting place on a surface.

---

## Scene 5 (0:38 - 0:45)
**Visual:** The Pinned wordmark — clean, sans-serif — resolves on a warm white background. Beneath it: "Post-it notes for WordPress." Below that, a single sticky note, slightly askew, that reads: "Install it. You'll use it today."
**Audio/VO:** "Pinned. The simplest plugin you'll install this year."
**Motion:** Wordmark fades in over 400ms. The tagline types out. The sticky note drops in last with a soft landing — slight bounce, then still. Hold 3 seconds.

---

## Production Notes

- **Total runtime:** 45 seconds (hard cap)
- **Music:** Warm acoustic, single instrument — fingerpicked guitar or Rhodes piano. Not corporate. Think the sound of someone working alone at 10 PM and not minding it. Fades under VO, resolves on the CTA.
- **Typography:** Handwritten or casual for note text (Caveat or Patrick Hand). Clean sans-serif for VO supers and the wordmark (Inter).
- **Color palette:** Warm white background (#fafaf8) for non-dashboard shots. Note colors match the plugin: yellow (#fff9c4), blue (#bbdefb), pink (#f8bbd0), green (#c8e6c9), peach (#ffe0b2). Dashboard shots use actual WP admin gray (#f0f0f1).
- **Key visual rule:** Every note must be slightly tilted. No note is perfectly aligned. This is the entire brand — it looks like a person put it there, not a system.
- **Remotion structure:** Each scene maps to a `<Sequence>` component. Shared `<StickyNote>` component with props for color, rotation, age, and content. `<AcknowledgeIcon>` and `<ExpiryBadge>` as composable overlays.

---

## Board Review Notes (Round 1)

> **Buffett:** "This is a hobby, not a business." — Noted. The video does not position Pinned as a business. It positions it as a tool people reach for without thinking. The revenue model is not the video's job.

> **Shonda:** "Needs threading." — Fair. This draft threads through one narrative: a note is born, it lives, it's seen, it's acknowledged, it dies. Beginning, middle, end. If threading means conversational replies on notes — that's a feature request, not a script note.

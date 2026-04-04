# LocalGenius - Video Script (60s)

**Target audience:** Local business owners, marketing managers, solopreneurs
**Tone:** Warm, direct, builds urgency without shouting
**Format:** Remotion (React-based video framework)

---

## Scene 1 (0:00 - 0:06)
**Visual:** A small-town Main Street at golden hour. Camera pushes slowly toward a bakery storefront. The "OPEN" sign flickers. Inside the window, a laptop glows on the counter. We zoom into the screen and it fills the frame -- a blank marketing dashboard, cursor blinking.
**Audio/VO:** "You opened a business because you're great at something. Not because you wanted to write ad copy at midnight."
**Motion:** Dolly zoom into the laptop screen over 4 seconds. The transition from physical storefront to digital interface should feel seamless -- the window frame becomes the browser frame.

---

## Scene 2 (0:06 - 0:14)
**Visual:** The blank dashboard springs to life. A simple chat interface appears. The business owner types: "I run a bakery in Austin. I need more weekday catering orders." LocalGenius responds instantly -- not with a generic template, but with a full campaign brief that names the neighborhood, references local events, and suggests a Tuesday promotion. The response streams in, word by word.
**Audio/VO:** "LocalGenius doesn't give you a template. It gives you a strategy. Your neighborhood, your customers, your voice."
**Motion:** Chat messages build with a natural typing cadence -- not instantaneous, not sluggish. The AI response streams at 30ms per character. Key phrases ("Tuesday Catering Special," "Mueller neighborhood," "SXSW week") highlight in warm gold as they appear.

---

## Scene 3 (0:14 - 0:26)
**Visual:** The screen splits into a 2x3 grid. Six outputs generate simultaneously: a social media post with image, a Google Business Profile update, an email campaign draft, a blog post outline, a customer review response, and a voice memo transcription turning into polished copy. Each tile completes at a slightly different time. A small badge on each reads "AI Draft" then flips to "Ready to Post."
**Audio/VO:** "One conversation becomes six pieces of content. Social posts. Email campaigns. Review responses. Blog outlines. Even voice memos turned into finished copy. All of it sounds like you -- because it learned from you."
**Motion:** Tiles populate in a staggered cascade, top-left to bottom-right, 400ms apart. Each "AI Draft" badge rotates to "Ready to Post" with a satisfying card-flip animation. The grid breathes -- slight parallax shift on mouse movement to suggest depth.

---

## Scene 4 (0:26 - 0:36)
**Visual:** Pull back to reveal the full dashboard. A sidebar shows connected services: Stripe billing with a simple "$49/mo" badge, usage stats ("213 posts generated this month"), and a reliability indicator showing 770+ tests passing. A small "Powered by hybrid AI" tooltip expands briefly to show Claude and Cloudflare Workers AI logos working in tandem.
**Audio/VO:** "Under the hood: hybrid AI that's been tested 770 times before it ever touched your business. Stripe billing you can understand. No enterprise contracts. No per-seat nonsense. One price. One employee that never calls in sick."
**Motion:** Sidebar slides in from the left over 600ms with a slight overshoot ease. The test count rolls up like an odometer from 000 to 770. The Stripe badge pulses once, gently -- not a hard sell, just a fact.

---

## Scene 5 (0:36 - 0:50)
**Visual:** A calendar view. Days fill in with scheduled content -- each day has 2-3 posts queued across platforms. The camera pulls back further to reveal this is one of several demo sites. Three browser windows cascade: a bakery, a yoga studio, a plumbing company. Each has its own LocalGenius dashboard, each with completely different content and brand voice. All three windows minimize into a single terminal where a deployment log scrolls: "265 files deployed. 14 agents completed. Build successful."
**Audio/VO:** "A bakery in Austin. A yoga studio in Portland. A plumber in Detroit. Three different businesses. Three different voices. Same genius. Built by 14 AI agents in a single session. 265 files. Deployed and running."
**Motion:** Calendar populates with a typewriter rhythm -- one post per beat. Browser windows cascade with a 200ms stagger. The minimize-to-terminal transition uses a scale-down with slight rotation, landing precisely in the terminal window. Deployment log scrolls at readable speed -- not too fast to parse.

---

## Scene 6 (0:50 - 0:60)
**Visual:** Back to Main Street. Same golden hour. But now the bakery window shows a "Catering Orders Up 40%" notification on the laptop screen. We pull back through the window. The "OPEN" sign is steady now -- no flicker. The LocalGenius logo resolves over the scene, then settles on a clean dark background. Below it: `localgenius.company`. A single line types out beneath: `Your first AI employee. No interview required.`
**Audio/VO:** "LocalGenius. Your first AI employee. Start at localgenius.company."
**Motion:** The notification appears with a gentle bounce. Pull-back through the window is the reverse of Scene 1's dolly zoom -- bookending the piece. Logo fade-in over 800ms. URL types at 50ms per character. Tagline holds for 3 full seconds. No confetti. No fireworks. Just confidence.

---

## Production Notes

- **Total runtime:** 60 seconds (hard cap -- respect the viewer's time)
- **Music:** Warm analog synth, Nils Frahm territory. Starts sparse in Scene 1, adds a gentle pulse in Scene 3, swells modestly in Scene 5, resolves to a single held note in Scene 6. No drops. No builds that promise more than the product delivers.
- **Typography:** Rounded sans-serif for UI elements (Plus Jakarta Sans or similar -- approachable, not corporate). Monospace only for the terminal in Scene 5 and the URL in Scene 6 (JetBrains Mono).
- **Color palette:** Warm cream backgrounds (#faf8f5) for the storefront and dashboard scenes. Deep charcoal (#1a1a1a) for terminal/logo scenes. Warm gold accents (#d4a438) for highlights and CTAs. Soft sage (#7c9a7e) for success states. No electric blue -- this is a local business tool, not a developer platform.
- **Voice-over direction:** Conversational. Not a pitch -- a conversation with someone you respect. Think a smart friend explaining something they found, not a founder doing a demo day. Medium pace. Let the pauses land.
- **Key distinction from Shipyard script:** Shipyard sells to builders -- it leads with the terminal, the agents, the architecture. LocalGenius sells to business owners -- it leads with the problem (midnight ad copy), shows the outcome (content that sounds like you), and only reveals the technical power (770 tests, 14 agents, 265 files) as proof of reliability, not as a feature. The tech is the foundation. The benefit is the building.
- **Remotion structure:** Each scene maps to a `<Sequence>` component. Shared components: `<StorefrontTransition>`, `<ContentTile>`, `<DashboardSidebar>`, `<CascadingWindows>`. The Scene 1/Scene 6 bookend should share a `<MainStreet>` component with a `direction` prop (`"in"` / `"out"`).

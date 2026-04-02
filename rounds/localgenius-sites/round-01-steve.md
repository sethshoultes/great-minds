# LocalGenius Sites — Round 1: Steve's Position

**Phase**: Position
**Date**: 2026-04-02
**PRD**: prds/localgenius-sites.md

---

## [STEVE] ROUND 1 — INITIAL POSITION

### 1. The Core Insight: The Website Is Not the Product

Let me be precise about what we're building. We are not building a website builder. We are not competing with Squarespace. We are building the **proof moment** — the instant Maria sees her business look legitimate on the internet for the first time in her life.

The website is a receipt. The product is the feeling.

When Maria opens that URL — `mariaskitchen.localgenius.site` — and sees her name, her photos, her hours, her menu, her reviews, her story, all assembled into something professional and real, without having written a word of copy or chosen a font or dragged a single block into a single container — *that* is the product.

The PRD gets this right with "engineered as a product feature — designed to make them gasp." But I want to be more specific about what "gasp" means. It means Maria pulls out her phone, texts her husband a screenshot, and says: "Look at this. I didn't do any of this."

Everything we design works backward from that moment.

---

### 2. Design Vision: Two Templates, Both Beautiful

The PRD says "launch with exactly 2 templates — both genuinely beautiful." This is correct. Let me define what "genuinely beautiful" means, because most teams get this catastrophically wrong.

**Beautiful does not mean trendy.** It does not mean parallax scrolling. It does not mean animations. It does not mean the thing that won an Awwwards prize last month. Maria's customers are looking at her website on a three-year-old phone in a parking lot trying to see if she's open. Beauty, in this context, means:

1. **The business name is the first thing you see.** Not a hero image. Not a tagline. The name.
2. **The photos look professional even when they're not.** Gentle color correction. Smart cropping. Warm tones. The templates must make iPhone photos look like they were shot by a professional. This is a design system problem, not a filter problem.
3. **Information architecture is opinionated.** The template decides what goes where. Maria doesn't choose. The AI doesn't hallucinate structure. One template for restaurants (name → photos → menu → hours → reviews → contact). One template for services (name → what they do → photos → testimonials → booking → contact). Both are correct because they're designed by someone who studied how actual customers use actual small business websites.
4. **Loading time is invisible.** The 30ms Worker CPU limit in the PRD is not an engineering constraint — it is a design requirement. If the site takes more than 1 second to render, the entire emotional arc is broken. Speed is a design decision.
5. **Mobile-first is not a checkbox.** 78% of local business website traffic is mobile. The mobile experience is the primary design. Desktop is the adaptation, not the other way around.

**Typography**: Source Sans 3 or Inter. One typeface. Three weights. The same type system we use in the app. When Maria looks at her website and then opens LocalGenius, the feeling should be: "These are made by the same person." Brand continuity between the product and the website is non-negotiable.

**Color**: Warm whites, warm charcoals, terracotta accents. The website templates share our DNA but adapt to the business's photos. The terracotta becomes a subtle accent — the business's identity comes first, ours is a whisper.

---

### 3. The Reveal Moment: Not a Feature, a Memory

The PRD asks: "Should the reveal moment include confetti/animation or stay understated?"

Neither. Both miss the point.

The reveal moment is not about what *we* do on screen. It's about what happens in *Maria's chest* when she sees her business name at the top of a real website. Confetti cheapens it — it says "look what we did!" Understated misses the emotional beat — it says "here's another screen."

Here's what the reveal should be:

**Phase 1: The Build (3-5 seconds)**

The screen shows Maria's business name in display type, centered, against warm white. Below it, her tagline (AI-generated from her description). Below that, a subtle progress indicator — not a spinner, not a percentage, just a warm glow that says "I'm working on this."

The text below the glow cycles through honest, specific status messages:
- "Writing your story..."
- "Arranging your photos..."
- "Making sure your hours are right..."
- "Building your site..."

These are not fake. Each one fires as the provisioning pipeline completes that actual step. If photos take longer, it waits. Honesty builds trust.

**Phase 2: The Reveal (2-3 seconds)**

The loading state dissolves. What appears is not a screenshot, not a mockup, not a preview — it is her **actual website**, rendered live in a device frame. The URL bar reads `mariaskitchen.localgenius.site`. The site is already live. It's not "what it will look like." It's what it *looks like right now, to anyone who types that URL.*

The only text below the device frame: `Your site is live.`

No confetti. No exclamation mark. The restraint *is* the design.

**Phase 3: The Share (optional, 5 seconds)**

Below the live preview:
- **"Open your site"** — opens the real URL in a browser
- **"Share"** — native share sheet (text to husband, post to Facebook, send to partner)
- **"Keep going"** — advances to the main conversation thread

The share button exists because the single most powerful marketing channel for LocalGenius is Maria texting her friend a link to her new website. The share is not a feature — it's the growth engine disguised as a button.

---

### 4. Zero CMS Exposure: The Hardest Design Problem

The PRD says "no admin panel, no drag-and-drop, no block editor." I agree completely. This is the right call. But let me be specific about what replaces it, because "talk to your AI" is necessary but insufficient.

The prompt bar is not enough. Here's why: Maria doesn't know what she can change. She doesn't know the taxonomy of her website. She doesn't know that "hero section" is a thing. She's going to stare at a text field and think: "What do I even say?"

**The solution: show, then ask.**

When Maria wants to update her website, she doesn't navigate to a settings page. She says something like "update my website" or "change my hours on my site." The AI responds with a visual card — a simplified preview of the current state — and says:

> "Here's your site right now. What would you like to change? You can update your hours, add new photos, change your description, or update your menu."

This is a **guided conversation**, not an open-ended text field. The AI narrows the scope, presents the current state, and offers specific options. Maria picks one. The AI makes the change. Maria sees a before/after preview. She approves. Done.

**The AI-managed monthly update** described in the PRD is genius, but the notification copy matters enormously:

Wrong: "Your AI has updated your website."
Right: "I noticed the spring menu season is starting. I updated your site to mention your new patio seating and seasonal specials. Take a look."

First person. Specific. Shows the work. Gives her control.

---

### 5. The 7-Question Onboarding: Less Is More

The PRD says "business answers 7 questions during onboarding." Seven is too many. Let me explain.

The current LocalGenius onboarding is 5 steps and takes 5 minutes. People complete it because each step feels fast. Adding 7 questions for the website component risks turning onboarding into a form.

**I propose 4 inputs, not 7 questions:**

1. **Business name** (already captured in core onboarding)
2. **Photos** (already captured — reuse them)
3. **One-sentence description**: "What do you do?" → "We serve authentic Tex-Mex on South Lamar." This is the only new text input.
4. **Hours** (one tap to confirm): AI pre-populates from Google if available. Owner confirms or edits.

That's it. Everything else — the tagline, the about section, the SEO metadata, the social links — is generated by AI from the description, the photos, the business type, and data scraped from Google/Yelp.

Maria should not be asked 7 questions. Maria should be asked 1 new question ("What do you do?"), shown what we already know, and given one chance to correct it.

**The 30-second verification** in the PRD is right. But it should not be a checklist. It should be: "Does this look right?" with one button: **"That's me."** If something is wrong, she taps "Something's off" and tells the AI what's wrong in natural language. We do not show her a form.

---

### 6. Subdomain-First: Correct, With One Addition

The PRD calls for `{slug}.localgenius.site` first, with custom domains as an async upsell. This is technically correct and operationally smart. But the brand experience matters.

**The URL is the first thing Maria shares.** It's the thing she texts to her husband. It's the thing she puts on her business card. `mariaskitchen.localgenius.site` is acceptable but not great. It's long. It's unfamiliar. "localgenius.site" means nothing to her customers.

**Proposal: shorten the subdomain.**
- `mariaskitchen.lg.site` or `mariaskitchen.lgsites.com` — shorter, more shareable.
- If the domain cost is manageable, purchase a short vanity domain for subdomains.

For Pro tier ($79/month): custom domain setup should be **one tap, one input**. Maria types `mariaskitchen.com`, we handle DNS, we handle SSL, we handle propagation. She never sees a CNAME record. The confirmation message: "Your custom domain is being set up. I'll let you know when it's live — usually takes about an hour."

---

### 7. Template Design Principles

Both templates must follow these non-negotiable rules:

1. **No stock imagery.** If the business has no photos, show the business name in display type on a warm background. Never insert a stock photo of food or a salon. The absence of photos is more honest than fake ones.
2. **No lorem ipsum.** Every piece of text is either real (from the business) or generated (by AI). If the AI can't generate it, that section doesn't exist. Better to have 4 real sections than 6 with filler.
3. **Reviews are social proof, not decoration.** If the business has Google reviews, show the 3 best ones. The star rating and reviewer name. Real names, real words. This is more powerful than any copy we could write.
4. **The booking/contact CTA is above the fold on mobile.** If Maria's customers can't find how to call her or book a table without scrolling, the template has failed its primary job.
5. **Page speed is a design decision.** No JavaScript that isn't essential. No web fonts that aren't critical. No images that aren't lazy-loaded. The site must score 95+ on PageSpeed Insights or it doesn't ship.
6. **The footer whisper:** `Made with LocalGenius` in small type. Not "Powered by" — that's every CMS on earth. "Made with" implies craft. It's subtle. It's a conversation starter when another business owner sees it.

---

### 8. The MCP Story: Film It

The PRD mentions filming an MCP update story at Day 30. I want to be very specific about what this film shows, because it could be the most important marketing asset we produce.

**The scene:** Maria is at her restaurant. Lunch rush just ended. She picks up her phone. She opens LocalGenius. She types: "We added a brunch menu. Can you put it on the website?"

**What happens:** The AI responds: "Got it — I'll add a brunch section to your site with the new items. Give me a minute." Thirty seconds later: "Done. Take a look." She opens her website. The brunch menu is there. Real photos. Real prices. Real descriptions. Live.

**Her reaction:** She didn't open a CMS. She didn't drag a block. She didn't choose a layout. She talked to her phone and her website changed. The camera catches the moment she realizes what just happened.

**That's the ad.** That's the viral clip. That's the thing that makes every small business owner who sees it think: "I want that."

We don't narrate it. We don't explain MCP or Emdash or Cloudflare Workers. We show a business owner talking to her phone and her website updating. The technology is invisible. The magic is the point.

---

### 9. What I'm Watching For From Elon

I expect Elon will push on:
- **Provisioning reliability** over reveal experience — he'll want the pipeline rock-solid before we polish the reveal. He's right about reliability. I'll fight him on doing both simultaneously.
- **Template count** — he may want to launch with 1 template to reduce surface area. I'll concede if the 1 template is genuinely beautiful across verticals. I won't concede if it means a restaurant and a dental office get the same layout.
- **The 7 questions** — he'll defend them as necessary for AI quality. I'll show him that 4 inputs plus Google/Yelp data produces output indistinguishable from 7 inputs.
- **Custom domains** — he'll want to defer further. I understand the complexity. But the custom domain is the upsell trigger for $79/month, so we can't defer it past month 2.

---

### 10. Summary Position

| Area | My Position |
|---|---|
| **Core thesis** | The website is not the product. The feeling is the product. |
| **Templates** | 2 templates, both beautiful, opinionated information architecture |
| **Reveal** | Live site in device frame. "Your site is live." No confetti. |
| **CMS exposure** | Zero. Guided conversation replaces open-ended prompt. |
| **Onboarding** | 4 inputs (not 7 questions). Reuse existing data. |
| **Subdomain** | Shorter vanity domain. Custom domain is 1-tap for Pro. |
| **Monthly updates** | First-person AI notification. Show the work. Give control. |
| **MCP film** | Day 30. Maria talks to phone. Website changes. No narration. |
| **Footer** | "Made with LocalGenius" — craft, not "powered by." |
| **Page speed** | 95+ PageSpeed score or it doesn't ship. |

This product succeeds or fails on one question: does Maria text her husband a screenshot? If the answer is yes, we've built something that markets itself. If the answer is no, we've built another website builder.

I have no interest in building another website builder.

---

*Steve Jobs — Chief Design & Brand Officer, Great Minds Agency*

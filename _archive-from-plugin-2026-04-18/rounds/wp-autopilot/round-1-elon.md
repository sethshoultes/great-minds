# WP Autopilot — Round 1: Elon (Product & Growth)

## Architecture: Simplest System That Works

**GOOD:** User-provided API key. Zero server infrastructure. Plugin is just glue code between WP and Claude.

**BAD:** Custom database table for chat history. WordPress already has `wp_options` and `wp_postmeta`. Don't invent schemas when WP's built-in storage exists. Use transients for session chat history (expires after 1 hour). Persistent history is scope creep.

**VERDICT:** Store API key in `wp_options`. Store current session in transients. Ship zero custom tables.

---

## Performance: Where Are the Bottlenecks?

**Bottleneck #1:** Context collector runs on every chat message. If site has 1,000 pages, that's a 1,000-row query sent to Claude every time. Insane.

**Fix:** Paginate context. Send only last 10 pages modified, top 5 installed plugins, current theme. Claude doesn't need to see every page to create a contact form.

**Bottleneck #2:** React chat panel. Why are we building a SPA when WordPress already has jQuery and inline HTML? Loading React adds 50KB+ bundle size.

**Fix:** Use vanilla JS or Alpine.js (12KB). Chat is a text input, a submit button, and a message list. This isn't Gmail.

**10x path:** Make the plugin <100KB total. Faster load = higher engagement.

---

## Distribution: 10K Users Without Ads

**Channel 1:** WordPress.org directory — table stakes, not growth.

**Channel 2:** Product Hunt — 500-2,000 users if we hit top 3. One-day spike.

**Real growth:** YouTube tutorial is the only thing here that compounds. But who's making it? PRD says "make a tutorial" with zero production plan.

**Better plan:**
1. Ship with 5 demo videos embedded in plugin settings page
2. Make setup take <60 seconds (auto-detect if user has Claude API key)
3. Add a "Share WP Autopilot" button that generates referral link → 10% grow through word-of-mouth if product is good
4. WordPress Facebook groups work IF we have 10 real testimonials first

**Numbers:** 10K users = 100/day for 100 days. YouTube tutorial needs 500K views OR 50 micro-influencers each driving 200 installs. Which path are we taking?

---

## What to CUT (Scope Creep Masquerading as V1)

**CUT #1:** Action confirmation UI with diff preview. This is GitHub PR review flow in WordPress. Overkill.
- **Replace with:** Simple "Yes/Cancel" dialog with plain text description. Users want speed, not diffs.

**CUT #2:** Markdown rendering for AI responses. Claude outputs text. Show text.
- **Replace with:** Plain text with line breaks. Maybe bold for headings. That's it.

**CUT #3:** Structured output format with XML action tags (`<action type="create_page">`). This forces parsing logic in PHP.
- **Replace with:** JSON output from Claude. PHP has `json_decode()`. Use it.

**CUT #4:** "Recommend plugin" as separate action from "activate plugin." If we're recommending it, just activate it (with confirmation).

**CUT #5:** Context awareness of "site settings." Which settings? All of them? This is a black hole.
- **Ship with:** Theme name, active plugins, page list. Nothing else.

---

## Technical Feasibility: Can One Session Build This?

**Yes, if we cut the cruft.**

Single-session build requirements:
1. PHP REST endpoint that calls Claude API (100 lines)
2. Context collector that queries WP database (50 lines)
3. Action executor that uses WP REST API or direct `wp_insert_post()` (100 lines)
4. Chat UI in vanilla JS (200 lines)
5. Settings page for API key (50 lines)

**Total: ~500 lines of code.** This is a weekend project, not a multi-week sprint.

**What makes it fail:** Overengineering. React builds. Custom databases. Diff previews. Every "nice-to-have" adds 2 hours.

---

## Scaling: What Breaks at 100x?

**At 100 users:** Nothing breaks. User-provided API keys = zero cost to us.

**At 10,000 users:** Still nothing breaks. Plugin runs on user's server. We have no server.

**At 100,000 users:** WordPress.org servers might rate-limit plugin downloads. That's their problem.

**Real scaling issue:** Support. If 10K users install this, we'll get 500 support tickets/month. Who answers them?

**Fix:** Ship with FAQ page in plugin. "Plugin not working? Check your API key. Still broken? Update WordPress to 6.0+." Handle 80% of issues with docs.

---

## Verdict: Ship or Kill?

**SHIP — but cut 40% of the scope.**

This is Copilot for WordPress. The idea is sound. The PRD is bloated.

**Core value:** Chat box → Claude → WordPress action. That's 3 components. Everything else is friction.

**Timeline:** One agent session can build the cut-down version. Current PRD scope? No. Too much UI polish, too much abstraction.

**Kill these:**
- Custom database table
- React chat panel (use vanilla JS)
- Markdown rendering
- Diff preview UI
- "Recommend plugin" vs "activate plugin" distinction
- Site settings context

**Keep these:**
- Chat input/output
- Claude API integration
- Page/post creation
- Block insertion
- Plugin activation
- User-provided API key

**Result:** Plugin that works in 48 hours instead of 2 weeks. Ship it, get feedback, iterate.

# Round 1: Elon Musk — Chief Product & Growth Officer

## The Core Problem

This PRD describes *inputs* beautifully but hand-waves the *system*. "The AI builds a 5-page website" — that's not a spec, that's a miracle. Let's get real.

---

## Architecture: What's the Simplest System That Works?

**Strip it to physics:**
1. Intake → structured YAML (done well in the PRD)
2. YAML → template selection + content injection → static HTML/CSS
3. Deploy to CDN (Cloudflare Pages, Vercel, Netlify)

**The trap:** Don't build a CMS. Don't build an editor. Ship static HTML. The "revision flow" via chat is smart — keep it. But revisions should regenerate the entire site, not patch it. Stateless is scalable.

**Simplest v1:** ~10 pre-built templates per vertical. Template selection is a lookup table, not AI. AI writes copy, picks photos, fills slots. That's it.

---

## Performance: Bottlenecks & 10x Path

**Bottleneck 1: "< 5 minutes" is too slow.** If you have structured input and templates, site generation should be **< 30 seconds**. The AI call is 5-10 seconds for copy. Image processing is the real delay — do it async, ship placeholder first.

**Bottleneck 2: Google Business Profile lookup.** API rate limits, incomplete data, latency. Don't block on this. Make it optional enrichment that happens post-preview.

**Bottleneck 3: "AI infers color palette from photos."** This sounds good but adds 2-5 seconds of image analysis per photo. v1: let the vertical dictate the palette. Dentist = blue/white. Restaurant = warm tones. Override only if client uploads brand colors.

**10x path:** Pre-compute everything possible. Cache vertical defaults. Batch image processing. The goal is **preview in < 15 seconds**.

---

## Distribution: 10,000 Users Without Paid Ads

**The wedge:** White-label for website resellers. The PRD mentions `/api/intake` for partners — this is the growth engine. Target:
- Freelance web designers (they mark up 3x, you get volume)
- Local marketing agencies
- Bookkeeping/CPA firms that bundle "free website" with services

**The hook:** "Build a client site in 3 minutes while they're on the phone."

**Numbers:** 100 agencies × 10 sites/month × 12 months = 12,000 sites. That's your path. B2B2C, not B2C.

**What won't work:** Hoping small business owners find you. They don't Google for website builders. They ask their accountant or their nephew.

---

## What to CUT (v2 Masquerading as v1)

1. **Multi-channel intake (Email, PRD file, API).** v1 = one channel. Chat or form. Pick one.
2. **Custom domain setup "< 1 hour."** v1 = subdomain only (`slug.emdash.site`). Custom domains are a support nightmare. v2.
3. **Competitor analysis.** Cool feature. Zero impact on site quality. Cut it.
4. **Review pulling from Yelp.** API TOS issues, stale data, edge cases. Testimonials = client provides or skip.
5. **"We color-correct and crop" photos.** Scope creep. v1: resize and compress. That's it.
6. **Five intake channels.** Ship one. Iterate.

---

## Technical Feasibility: Can One Agent Session Build This?

**Yes — IF you constrain scope:**
- 3 templates (SaaS landing, local business, portfolio)
- Form intake only (no chat)
- Static HTML output to a single hosting provider
- No image processing beyond resize
- No external API lookups (Google, Yelp)

**That's a weekend project for one agent.** The PRD as written? 3-4 weeks minimum with constant human steering.

---

## Scaling: What Breaks at 100x?

At 100 sites/day → 36,500 sites/year:

1. **Storage:** Static sites are ~5MB each. 180GB/year. Trivial.
2. **AI costs:** ~$0.05-0.10 per site generation. $3,650/year at 100x. Negligible.
3. **Support:** "Change the headline" revisions will explode. Each revision is an AI call + deploy. At 100x usage, you'll see 5-10 revisions per site. That's 365,000 AI calls/year. Now we're at $18-36K in API costs. Still manageable.
4. **The real break:** Orphaned sites. People create and abandon. You'll have 30,000 dead sites within 2 years. Need a TTL policy or you're paying to host garbage forever.

---

## Bottom Line

Ship the form. Ship three templates. Ship static HTML to Cloudflare Pages. Get to 100 sites, learn what breaks, then add the magic.

**The PRD's philosophy is right. The scope is 3x too big for v1.**

---

*— Elon Musk, Chief Product & Growth Officer*
*"If you're not embarrassed by v1, you shipped too late."*

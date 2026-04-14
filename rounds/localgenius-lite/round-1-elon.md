# Round 1: Elon Musk — Chief Product & Growth Officer

## Architecture: You're Still Overbuilding

**Simplest system that works:** One PHP file. One JS file. One Worker endpoint. Done.

What you actually need:
- `localgenius-lite.php` — Plugin file, admin dropdown, widget embed
- `widget.js` — Floating bubble, sends questions to Worker (<8kb)
- One Cloudflare Worker — Receives question + business type + FAQ context, returns answer

**Kill the hybrid AI concept.** Llama 3.1 8B on Workers AI does this job. Claude fallback adds latency variability, cost uncertainty, and a second failure path. You don't A/B test infrastructure in v1. One model. One path.

**Site scanner is a trap.** You're proposing to spider 20 pages of a plumber's website that has "About Us," "Services," and "Contact." What intelligence are you extracting? Business name and address — which they'll enter in the dropdown anyway. Homepage scan only, extract what's in `<title>` and schema.org markup. 10 lines of code, not a "content indexing system."

## Performance: Where You'll Bleed Money

**The cost model is fantasy.** 100 questions/month/site × 10,000 sites = 1M inference calls. Workers AI is cheap but not free. You're looking at $1-2K/month minimum. "Absorb the costs" is a phrase that kills startups.

**10x path is obvious:** Response caching. Hash normalize the question ("What are your hours" = "hours?" = "when are you open"). 80% of questions collapse to 15 canonical questions per business type. Cache at the edge. Only call LLM on cache miss. This cuts costs by 10x and latency by 100x.

**Real bottleneck:** Cold start on the first interaction. User clicks widget, waits 400ms for Worker + 200ms for LLM. That's acceptable. But FAQ generation on plugin activation — if you're calling Claude to generate 15 Q&As, that's 3-5 seconds. Pre-generate all 20 business type FAQs. Ship them as JSON in the plugin. Zero activation latency.

## Distribution: Your Plan Won't Work

ProductHunt gets you 500 installs and 3 days of traffic. Reddit r/wordpress bans self-promotion. YouTube reviewers want affiliate revenue — free plugins don't pay.

**What actually moves numbers:**
1. **WordPress.org plugin search SEO** — 70% of installs come from search. Optimize for "AI chatbot WordPress," "automatic FAQ," "chat widget small business." Your title, description, tags matter more than any launch.
2. **The widget IS the distribution.** Every "Powered by LocalGenius" click on a client site is a qualified lead. This is Hotjar's playbook. This is Intercom's playbook. Make the badge visible, link to a 30-second install page.
3. **Agency multiplier.** One agency = 20-100 sites. Target WordPress agency Facebook groups (500K+ members). One demo post beats everything else.
4. **Make it embeddable outside WordPress.** Generic JS snippet. Now you're not limited to 810M WordPress sites — you're at every website. This is v1.1, but design for it now.

## What to CUT: v2 Features Wearing v1 Masks

- **Lead capture** — Different product entirely. Cut.
- **Multi-language** — Obvious v2. Why even list it?
- **Business hours integration** — Either it's in the FAQ or it's not. No special feature.
- **"Simple analytics"** — Store question logs in post_meta. No dashboard. No charts. You'll never look at "top 10 questions" until you have 10K installs. Ship data collection, not data visualization.
- **Custom Q&A additions from admin** — If auto-generated FAQs aren't good enough, your AI prompt is wrong. Fix the prompt, don't add an editing interface.

**Radical cut:** The admin settings page. Business type dropdown can live in a wp_options row set via plugin activation modal. City/region is unnecessary — LLM doesn't need it for FAQ responses. Widget position? Bottom-right. Always. Stop asking users to make decisions.

## Technical Feasibility: Honest Assessment

One agent session can build the core loop:
- Plugin scaffold + activation flow: 90 minutes
- Pre-generated FAQ JSON for 20 business types: 60 minutes (or do it in advance)
- Widget JS (bubble + chat UI): 2 hours
- Cloudflare Worker (question → cached response or LLM): 90 minutes
- Basic integration testing: 60 minutes

**Total: 7-8 focused hours.** Possible in one session if you don't wander.

**What gets cut:** Site scanning, analytics dashboard, rate limit UI, error states beyond "Something went wrong."

**What must work perfectly:** User activates plugin → widget appears → user asks "what are your hours?" → answer appears in <500ms. If that works, ship. Everything else is iteration.

## Scaling: What Breaks at 100x (1M Sites)

1. **Cost model explodes.** Even with caching, 1M sites × 30 questions/month average = 30M requests. $30K+/month in AI costs with zero revenue. **Free tier must die before 100K installs.** Freemium means: 25 questions/month free, then $5/month. Set this expectation in v1.
2. **post_meta won't scale.** 1M sites × 50 logged questions = 50M rows in wp_postmeta across distributed databases you don't control. Store analytics in your Worker + D1 database, not WordPress.
3. **Support will kill you.** One confused user leaves a 1-star WordPress.org review, tanks your search ranking. Build for zero support: better defaults, fewer options, inline help, graceful failures.
4. **WordPress.org approval.** They'll scrutinize external API calls. Document clearly: "Plugin sends questions to localgenius.ai for AI processing. No personal data stored." Fail review = 4-week delay.

## Bottom Line

The PRD is 80% right but 20% scope creep. You're building a "platform" when you need a "feature."

**First principles:** A small business owner installs a plugin and their website starts answering customer questions automatically.

That's it. That's the product. Everything else — analytics, lead capture, multi-language, custom FAQs — is you avoiding the hard work of making the core experience perfect.

Cut harder. Ship faster. Iterate with data.

*The best plugin is the one that exists.*

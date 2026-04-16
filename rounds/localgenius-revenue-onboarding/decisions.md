# LocalGenius Revenue & Onboarding: Locked Decisions
## Build Phase Blueprint

**Synthesized by:** Phil Jackson, Zen Master
**Date:** 2026-04-16
**Status:** Ready for implementation

---

## 🏆 Core Decisions: Who Won, Why

### 1. Product Name: "Sous"
**Proposed by:** Steve Jobs
**Challenged by:** Elon Musk (argued to ship as LocalGenius first)
**Winner:** Steve Jobs — with compromise

**Final Decision:** Launch as "Sous" with domain getous.com or trysous.com
**Rationale:**
- One syllable, memorable, metaphor-rich (sous chef = right hand)
- "LocalGenius" tested weak in brand positioning (sounds like 2007 SEO spam)
- Steve's argument: "When you tell another restaurant owner 'I use Sous,' you sound smart"
- Compromise accepted: Ship under Sous branding immediately, no delayed rebrand

**Implementation Impact:** All copy, domains, and branding use "Sous" from day 1

---

### 2. Pricing Structure: One Price, $99/Month
**Proposed by:** Both Steve & Elon (rare agreement)
**Winner:** Unanimous

**Final Decision:** Single tier, $99/month, no tiers, no "contact sales"
**Rationale:**
- Three tiers create decision paralysis
- Simplicity is competitive advantage
- "You're either in or you're out" — confidence and clarity
- No freemium race to bottom

**Implementation Impact:** Single pricing block, no feature comparison tables

---

### 3. Trial Structure: 14-Day Trial, Credit Card Required
**Proposed by:** Steve Jobs
**Challenged by:** Elon Musk (argued for freemium tier)
**Winner:** Steve Jobs

**Final Decision:** 14-day trial with credit card required
**Rationale:**
- Friction filters tourists from serious customers
- "The users who need this product will pay $99. The ones who won't weren't going to succeed anyway"
- Freemium attracts wrong users, anchors to $0
- Target: 25 paying customers, not 1,000 freeloaders

**Implementation Impact:** Credit card capture in trial signup flow, clear 14-day language

---

### 4. Technical Architecture: Static HTML + Speed
**Proposed by:** Elon Musk
**Accepted by:** Steve Jobs (with quality requirements)
**Winner:** Elon Musk — with Steve's craft standards

**Final Decision:** Static HTML/CSS, no React, <1s load time, ships fast
**Rationale:**
- No framework overhead for static content
- <1s load time non-negotiable (every 100ms = 1% conversion loss)
- Speed is a feature, but not at expense of memorability
- Steve conceded: "Elon's right. <1s load time is the standard."

**Implementation Impact:** Pure HTML/CSS, CDN hosting, no JS framework

---

### 5. Video Strategy: Loom Now, Upgrade Later
**Proposed by:** Elon Musk
**Challenged by:** Steve Jobs (wanted 60s produced video)
**Winner:** Elon Musk — with upgrade path

**Final Decision:** Ship with Loom testimonials immediately, upgrade video in 30 days
**Rationale:**
- Produced video = 2-3 week delay for shooting, editing, legal releases
- Loom ships today, converts at 70% of perfect video
- "Perfection is the enemy of momentum"
- Upgrade to produced video after revenue and proof

**Implementation Impact:** Embed Loom videos (3-5 testimonials, 60-90s each), plan video upgrade for month 2

---

### 6. Brand Voice: "Your Marketing, Handled"
**Proposed by:** Steve Jobs
**Accepted by:** Elon Musk
**Winner:** Steve Jobs

**Final Decision:** Tagline "Your marketing, handled" + emotional hook of "11 PM guilt"
**Rationale:**
- Restaurant owners don't care about "AI-powered" tech stack
- They care about relief from guilt ("I should post something...")
- Positioning isn't scope creep, it's conversion optimization
- Elon: "His emotional hook is sharp. I'd ship that copy tomorrow."

**Implementation Impact:** All copy uses active voice, specific numbers, no jargon, Hemingway style

---

### 7. Dashboard Philosophy: Zero Interface
**Proposed by:** Steve Jobs
**Challenged by:** Elon Musk (noted technical complexity)
**Winner:** Steve Jobs — as north star, not V1 blocker

**Final Decision:** Dashboard shows what's *already done*, not what to do
**Rationale:**
- "No buttons labeled 'Create Social Post' — just 'Your posts this week' already published"
- Apple principle: don't make users configure, just work
- Elon's caveat: This requires cron jobs, auto-publishing APIs — ships later
- Pricing page doesn't wait for magic dashboard

**Implementation Impact:** V1 pricing page ships now, dashboard philosophy guides core product roadmap

---

## 📦 MVP Feature Set: What Ships in V1

### Must Ship (Week 1)
1. **Static pricing page** (HTML/CSS, <1s load)
2. **Loom video testimonials** (3-5 videos, 60-90s each)
3. **Product tour video** (60s max, Loom format)
4. **One case study** with before/after metrics (e.g., "47 reviews, up from 12")
5. **PostHog analytics** (5 events: page_view, pricing_view, cta_click, trial_start, video_play)
6. **Single CTA**: "Start your 14-day trial" with credit card capture
7. **Brand copy**: "Your marketing, handled" + emotional hooks

### Core Copy Elements
- Hero: "Your marketing, handled. $99/month. Start your 14-day trial."
- Emotional hook: "The 11 PM guilt ends" (relief positioning)
- Social proof: Before/after metrics (specific numbers, e.g., "$8,400 revenue from AI-driven reservations")
- Voice: Short sentences, active voice, no jargon, Hemingway style

### Performance Targets
- Page load time: <1s (non-negotiable)
- Video start time: <500ms
- Pricing page to trial signup: <30 seconds total

---

## ❌ What Was Cut (The "No" List)

### Killed by Elon & Steve (Unanimous)
1. ❌ **ROI calculator** — "No one trusts your math. Show real results instead."
2. ❌ **Three-tier pricing** — Decision paralysis, complexity kills
3. ❌ **FAQ section** — "If you need an FAQ to explain pricing, your pricing is confusing"
4. ❌ **A/B testing infrastructure** — No traffic to test yet, premature optimization
5. ❌ **"Trusted by X restaurants" counter** — Only add if X > 50

### Killed by Steve
6. ❌ **"AI-powered" language** — "The iPhone doesn't say 'computer-powered'"
7. ❌ **"Request a Demo" CTA** — Enterprise bloatware pattern, not SMB
8. ❌ **Testimonials as separate section** — Weave into narrative instead

### Deferred to V2 (Not Killed, Just Later)
9. 🔄 **Referral program** — Elon wanted week 1, Steve argued it's "growth theater" before product value proven
10. 🔄 **Freemium tier** — Elon wanted it, Steve killed it, settled on credit-card trial
11. 🔄 **Produced video** — Ships in 30 days after Loom proves concept
12. 🔄 **Magic dashboard** — North star for core product, not pricing page blocker

---

## 🏗️ File Structure: What Gets Built

### Week 1 Deliverables

```
/pricing-page/
├── index.html              # Static pricing page, <1s load
├── styles.css              # Minimal CSS, CDN-hosted fonts
├── assets/
│   ├── hero-dashboard.png  # Blurred dashboard preview (optional, defer if blocks ship)
│   └── case-study-graph.png # Before/after metrics visualization
└── analytics/
    └── posthog-init.js     # 5 event tracking, inline script
```

### Copy Document
```
/copy/
└── pricing-page-copy.md    # All hero, CTA, testimonial, case study copy
                            # Voice: Steve's "Your marketing, handled"
                            # Hook: "11 PM guilt ends"
                            # Metrics: Specific numbers (47 reviews, $8,400 revenue)
```

### Video Assets
```
/videos/
├── product-tour.loom       # 60s max, product walkthrough
├── testimonial-1.loom      # Restaurant owner #1
├── testimonial-2.loom      # Restaurant owner #2
├── testimonial-3.loom      # Restaurant owner #3
└── (optional) testimonial-4-5.loom
```

### Analytics Configuration
```
/analytics/
└── posthog-events.md       # Event tracking spec:
                            # - page_view (on load)
                            # - pricing_view (scroll to pricing)
                            # - cta_click (trial button)
                            # - trial_start (form submit)
                            # - video_play (any video starts)
```

### Domain & Hosting
```
Domain: getous.com or trysous.com (check availability, register immediately)
Hosting: CDN (Cloudflare, Vercel, or Netlify for <1s global load)
SSL: Required, auto-provision
```

---

## 🔓 Open Questions: What Still Needs Resolution

### High Priority (Blocks Launch)
1. **Domain availability**: Is getous.com or trysous.com available? Check and register immediately.
2. **Testimonial logistics**:
   - Which 3-5 restaurant owners will provide Loom testimonials?
   - What's the incentive? (Elon suggested $100 gift card per testimonial)
   - What's the script/prompting?
3. **Case study selection**: Which restaurant has the strongest before/after metrics?
4. **Credit card processing**: Stripe integration for trial signup (assumed capability, needs confirmation)

### Medium Priority (Doesn't Block V1, Resolve in 30 Days)
5. **Distribution strategy**: Where do first 100 customers come from?
   - Steve: Toast/Square POS partnerships, local restaurant associations
   - Elon: SEO blog posts ("how to get more Google reviews"), public case studies
   - **Decision needed**: Who owns outreach? What's the 30-day distribution plan?
6. **Referral program timing**: Elon wants it week 1, Steve says "growth theater" before value. Revisit at 25 customers?
7. **Video upgrade budget**: Cost to produce 60s hero video with real dashboard footage in month 2?

### Low Priority (V2+ Features)
8. **Multi-location pricing**: If customer has 3 locations, still $99/month? Or per-location pricing?
9. **Integrations roadmap**: Yelp, Google My Business, Toast POS — which ships first?
10. **Dashboard features**: Auto-publishing, review auto-response, revenue attribution — what's the 90-day product roadmap?

---

## ⚠️ Risk Register: What Could Go Wrong

### Critical Risks (Could Kill Launch)

#### 1. **Zero Traffic, Zero Customers**
**Risk:** Beautiful pricing page, no distribution strategy, no one sees it.
**Elon's Warning:** "This PRD has ZERO distribution strategy. That's the fatal flaw."
**Mitigation:**
- Don't wait for perfect page to start distribution
- Week 1: Identify 10 warm leads (existing LocalGenius users, network contacts)
- Week 2: Toast/Square partnership outreach (Steve's strategy)
- Week 3: Launch 5 SEO blog posts (Elon's strategy)
- **Owner:** Needs assignment — who owns growth?

#### 2. **Testimonials Don't Materialize**
**Risk:** "Collect 3-5 video testimonials" sounds easy, but restaurant owners are busy. What if no one responds?
**Elon's Warning:** "What's the incentive? What's the script? This is 20+ hours of work."
**Mitigation:**
- Offer $100 gift card per testimonial (Elon's suggestion)
- Pre-write script: "Tell us about your review increase. 90 seconds max. Loom makes it easy."
- Fallback: Use written testimonials with headshots if video fails
- **Owner:** Needs assignment — who recruits testimonial customers?

#### 3. **Name Is Wrong, Can't Pivot**
**Risk:** "Sous" tests poorly with actual restaurant owners. Steve's brand vision vs. market reality.
**Elon's Original Concern:** "You want to rename the product before we have 100 customers? That's backwards."
**Mitigation:**
- Synthesis accepted "Sous," but if early feedback is negative, low cost to pivot (static page, easy domain change)
- Monitor: Are people saying "What does Sous mean?" If yes, reconsider.
- **Validation:** Test name with 5 restaurant owners before domain registration

#### 4. **Credit Card Requirement Murders Conversion**
**Risk:** Steve's "friction filters tourists" thesis is wrong. 80% drop-off at credit card gate.
**Elon's Warning:** "You just cut your trial signups by 60-80%. We don't have brand trust yet."
**Mitigation:**
- Track conversion rate: landing page → trial signup
- If <1% conversion after 100 visitors, revisit credit card requirement
- A/B test in month 2: Credit card vs. email-only trial
- **Decision point:** If conversion <1% by day 14, remove credit card gate

### Medium Risks (Could Slow Growth)

#### 5. **Loom Videos Look Unprofessional**
**Risk:** Steve's concern — "Speed without craft is just noise." Loom testimonials hurt brand.
**Mitigation:**
- Steve accepted Loom for V1, upgrade in 30 days
- Quality bar: Good lighting, clear audio, edit out long pauses with Descript
- If Loom videos test poorly (low completion rate), accelerate produced video timeline
- **Metric to watch:** Video completion rate (target: 40%, industry avg: 25%)

#### 6. **PostHog Free Tier Ceiling**
**Risk:** At 10K users, free tier breaks (1M events/month limit).
**Elon's Warning:** "You'll hit this. Plan to pay $200/month for PostHog Pro."
**Mitigation:**
- Not a V1 concern (need to reach 10K users first)
- Budget $200/month for analytics in financial model
- Alternative: Migrate to self-hosted Plausible or Simple Analytics if cost is issue

#### 7. **One Price Doesn't Fit All Customers**
**Risk:** Enterprise customers want more. Solo owners want less. $99 doesn't work for everyone.
**Mitigation:**
- Steve & Elon agreed: Simplicity > customization for V1
- Validate with first 25 customers: Is $99 too high? Too low? Just right?
- **Decision point:** If 5+ customers ask for cheaper tier, revisit freemium in month 3

### Low Risks (Monitor, Don't Panic)

#### 8. **Page Load Time Slips to 2-3s**
**Risk:** Video embeds, images bloat page, miss <1s target.
**Mitigation:**
- Elon & Steve both non-negotiable on <1s
- Use CDN, compress all images, lazy-load videos
- Test on slow 3G connection before launch
- **Tool:** Google Lighthouse score must be 90+ on performance

#### 9. **Competitive Response**
**Risk:** Existing player (e.g., Womply, Broadly) copies positioning.
**Mitigation:**
- Speed to market is defense — ship before they notice
- "Sous" brand is defensible, memorable
- Dashboard "zero interface" philosophy is hard to copy (requires product rebuild)

---

## 🔴 TECHNICAL IMPLEMENTATION RISKS (Added Risk Scan)

### Build & Deployment Risks

#### 10. **Loom Embed API Complexity & Reliability**
**Risk:** Loom embeds may require additional JavaScript, creating unknown payload overhead. No fallback if Loom embed fails to load or is blocked by browser security policies.
**Likelihood:** Medium
**Impact:** Major
**Mitigation:**
- Pre-test all 3-5 Loom embed codes in target browsers (Chrome, Safari, Firefox, mobile)
- Implement fallback: If Loom iframe doesn't load, display static thumbnail + "Play on Loom" link
- Measure embedded script size: Must not exceed 50KB total JS overhead for embeds
- Set Loom iframe loading strategy: Use `loading="lazy"` for below-fold testimonials
- **Owner:** Frontend developer — test embeds in staging before launch
- **Success metric:** 99% uptime for Loom embed delivery (monitor via third-party CDN health checks)

#### 11. **Image Optimization Complexity for <1s Load**
**Risk:** Case study graph PNG, hero dashboard preview, and any social proof images could consume 200-500KB each, breaking <1s target even on CDN.
**Likelihood:** High
**Impact:** Critical
**Mitigation:**
- Strict image budget: Hero + case study + thumbnails must total <100KB (compressed)
- Mandatory optimization pipeline:
  - Use WebP format with PNG fallback (30-50% size reduction)
  - Compress PNGs with ImageOptim or TinyPNG (lossy + lossless)
  - Resize assets for mobile (2x at most for retina, not 3x)
  - Remove metadata, exif, color profiles
- Defer dashboard preview: If hero-dashboard.png blocks <1s target, remove it entirely (decisions.md: "defer if blocks ship")
- Use CSS gradients/CSS for simple graphics instead of images
- **Owner:** Frontend developer + Designer (asset handoff)
- **Success metric:** Total page weight <200KB (HTML + CSS + images + minimal JS)

#### 12. **PostHog Analytics Script Injection Risk**
**Risk:** PostHog init script may be render-blocking if not loaded asynchronously. Wrong implementation could add 200-500ms to page load.
**Likelihood:** Medium
**Impact:** Major
**Mitigation:**
- Load PostHog script async/defer: `<script async src="posthog-init.js">`
- Do NOT block page rendering on analytics initialization
- Inline small PostHog config to avoid extra HTTP round trip
- Test page load time WITH PostHog enabled vs. disabled (must be <50ms overhead)
- Use PostHog SDK v2.0+ (lighter weight than v1)
- **Owner:** Frontend developer + Analytics engineer
- **Success metric:** Measurable difference between enabled/disabled <50ms

#### 13. **Cross-Browser Compatibility with Static HTML**
**Risk:** Static HTML assumes universal support, but older browsers (IE 11, outdated mobile browsers) may have CSS Grid/Flexbox issues, missing `loading="lazy"` support, or iframe/video compatibility problems.
**Likelihood:** Medium
**Impact:** Major (for mobile users)
**Mitigation:**
- Define supported browsers: Chrome, Safari, Firefox (current -2 versions), mobile browsers (iOS 12+, Android 9+)
- CSS: Use feature detection; provide fallbacks for Grid/Flexbox (use CSS floats as baseline)
- Video embeds: Test on 10 different devices before launch (simulator + physical if possible)
- Use caniuse.com to verify: `loading="lazy"`, `<video>`, CSS Grid, Flexbox compatibility
- Fallback for JavaScript failures: Page must work with JS disabled (video embeds may degrade gracefully)
- **Owner:** QA engineer + Frontend developer
- **Success metric:** Pass visual regression tests on 8+ browser combinations

#### 14. **Domain & DNS Propagation Delays**
**Risk:** Domain registration can take 24-48 hours. DNS TTL misconfigurations could cause old IP to persist. Switching registrars mid-launch could orphan DNS records.
**Likelihood:** Low
**Impact:** Critical (blocks launch)
**Mitigation:**
- Register domain immediately (getous.com or trysous.com) — do NOT wait for perfection
- Use managed DNS with short TTL (120s) during launch day
- Pre-stage DNS records before go-live:
  - A record → CDN provider (Vercel/Netlify/Cloudflare IP)
  - CNAME records for SSL/CDN
  - MX records if email forwarding needed
- SSL certificate auto-provisioning (Let's Encrypt via Vercel/Netlify, ~5 min)
- Test full DNS chain: nslookup, dig, DNS propagation checker (whatsmydns.net)
- **Owner:** DevOps/Infrastructure + Product Owner
- **Success metric:** Domain live, HTTPS working, <100ms DNS lookup time

### Performance & Monitoring Risks

#### 15. **Verification of <1s Load Time Across Network Conditions**
**Risk:** Testing locally on 500Mbps WiFi ≠ real user experience on 3G/4G. Page may load <1s for developer but 3-5s for actual restaurant owner on slow connection.
**Likelihood:** High
**Impact:** Critical
**Mitigation:**
- Mandatory testing matrix BEFORE launch:
  - Desktop (Cable/Fiber, WiFi): Chrome DevTools Network → "Good 3G" (1.6 Mbps down)
  - Mobile (4G LTE, 3G): Real device testing on actual network (not simulator)
  - Lighthouse audit: Must score 90+ on Performance (auto-run on CI/CD)
- Tools:
  - Google Lighthouse (CI/CD automated)
  - WebPageTest (real-world testing, throttled connections)
  - Speedcurve or similar (ongoing monitoring post-launch)
- Define "load time" metric: FCP (First Contentful Paint) <1s OR LCP (Largest Contentful Paint) <1.5s
- Set up monitoring: Sentry + custom RUM (Real User Monitoring) to track actual page load times
- **Owner:** Frontend developer + QA engineer
- **Success metric:** 95th percentile load time <1s on 3G, Lighthouse 90+ score

#### 16. **Video Embed Performance & Completion Rate Tracking**
**Risk:** Loom embeds may auto-play or lazy-load unpredictably. Video completion rate tracking via PostHog may miss views if user has adblocker or Privacy Badger enabled.
**Likelihood:** Medium
**Impact:** Major
**Mitigation:**
- Implement video play tracking with fallback:
  - Primary: PostHog event on `<video>` or iframe onplay event
  - Fallback: Inline event listener (if PostHog blocked)
  - Track: Video start, 25%, 50%, 100% completion
- Set auto-play strategy: Do NOT auto-play videos (respects user preference, faster initial load)
- Use iframe sandboxing: `<iframe sandbox="allow-scripts allow-same-origin"></iframe>`
- Monitor video delivery:
  - Loom CDN uptime (use status.loom.com)
  - Fallback if Loom down: Display video thumbnail + "Watch on Loom" link
- Test video performance with:
  - Adblocker (uBlock, Adblock Plus)
  - Privacy extensions (Privacy Badger, Ghostery)
  - Safari Intelligent Tracking Prevention
- **Owner:** Frontend developer + Analytics engineer
- **Success metric:** 95%+ of video plays tracked, <2% tracking loss due to blockers

#### 17. **Analytics Data Loss or Event Dropout**
**Risk:** PostHog free tier has rate limits. High traffic (unexpected success) could silently drop events. Events may not fire if user bounces before PostHog SDK initializes (race condition).
**Likelihood:** Medium
**Impact:** Major (for product decisions)
**Mitigation:**
- Implement 5 events with priority order:
  1. page_view (must capture)
  2. cta_click (high priority, trial signup funnel)
  3. video_play (medium priority, engagement)
  4. trial_start (critical for conversion tracking)
  5. pricing_view (optional, can drop)
- Use queue strategy: Batch events, retry failed sends, store in localStorage if offline
- Monitor PostHog usage dashboard daily: Event count vs. quota
- Plan budget for paid tier: $200-300/month if hitting free tier limits
- Set up alerts: Notify team if event dropout detected
- **Owner:** Analytics engineer + Backend
- **Success metric:** 99%+ event capture rate, zero data loss in first 30 days

#### 18. **CDN Cache Invalidation & Stale Content Risk**
**Risk:** Hosting on CDN (Vercel/Netlify/Cloudflare) with default TTL (e.g., 3600s) means typos in copy or broken video embeds could stay live for 1 hour. Users see old content while developers think it's fixed.
**Likelihood:** Medium
**Impact:** Major
**Mitigation:**
- Set short TTL during launch week: 60-120 seconds for HTML (allows fast iterations)
- After stabilization (day 3+), increase HTML TTL to 600s, CSS/JS to 3600s
- Implement cache busting: Add version hash to CSS/JS filenames (e.g., `styles-abc123.css`)
- Pre-warmup strategy: 5 minutes before launch, prime CDN with first page load
- Test cache behavior:
  - Change copy in dev
  - Deploy to production
  - Verify change visible within 2 minutes (not 1 hour later)
- Have manual cache purge process ready (Vercel: dashboard click, Netlify: API call)
- **Owner:** DevOps/Frontend developer
- **Success metric:** HTML updates live within 2 minutes of deploy

### Integration & Third-Party Risks

#### 19. **Stripe Trial Signup Flow Integration**
**Risk:** Stripe credit card form requires PCI compliance. Embedding Stripe Checkout or using PaymentElement adds complexity. Form submission errors could leave users stranded or charged without proper trial start.
**Likelihood:** Medium
**Impact:** Critical (conversion blocker + legal risk)
**Mitigation:**
- Use Stripe Checkout (hosted) instead of embedded form: Simpler, PCI-compliant by default
- Implement proper error handling:
  - Network timeout → show retry button
  - Invalid card → clear error message
  - Declined card → retry logic, don't hide error
- Test full flow end-to-end:
  - Valid card (Stripe test card 4242 4242 4242 4242)
  - Declined card (4000 0000 0000 0002)
  - 3D Secure (4000 0025 0000 3155)
  - Expired card (11/25)
- Implement proper trial expiration: Set 14-day trial via Stripe webhook (not client-side countdown)
- Monitor failed charges: Set up Stripe alerts for declined payments
- **Owner:** Backend engineer + Payments specialist
- **Success metric:** 99.9% successful trial signups, zero chargebacks due to setup errors

#### 20. **Domain Name Confusion & Brand Messaging Mismatch**
**Risk:** getous.com vs. trysous.com — choosing wrong domain creates brand confusion. URL appears in customer emails, Stripe receipts, support docs. Changing later is expensive (redirects, customer support).
**Likelihood:** Low
**Impact:** Major (brand/UX)
**Mitigation:**
- Validate domain choice with 5 restaurant owners: Which is more memorable/intuitive?
- Check social media handle availability (@getous, @trysous on Twitter, Instagram, LinkedIn)
- Domain selection criteria:
  - Shorter is better (easier to spell, remember, type)
  - getous.com is shorter (7 chars vs 8 for trysous)
  - Check for negative connotations, trademark conflicts
  - Test on paper: Write on notepad, ask friend to type from dictation
- Register BOTH domains, redirect one to the other (insurance against choice regret)
- **Owner:** Product Owner + Marketing
- **Success metric:** Domain choice validated with 5 users, purchased + DNS live

### Testing & QA Risks

#### 21. **Mobile Responsiveness Verification**
**Risk:** Static HTML + CSS assumed responsive, but untested edge cases: iOS notch, Android status bar, tablet landscape mode. Trial signup form could be unusable on mobile.
**Likelihood:** High
**Impact:** Major (70% of visitors may be mobile)
**Mitigation:**
- Test matrix (physical devices preferred, simulators acceptable):
  - iPhone 12 (6.1" screen, notch)
  - iPhone 13 mini (5.4" screen)
  - iPhone SE (4.7" screen, classic)
  - Android (Pixel 6, Galaxy S21)
  - iPad (landscape + portrait)
  - Browser stack or BrowserStack for 20+ device combinations
- Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">`
- Critical check: CTA button must be 44x44px minimum (mobile tap target)
- Test form inputs: Keyboard height on iOS/Android, autocomplete behavior
- Video embeds: Must be responsive (width: 100%, aspect-ratio: 16/9)
- **Owner:** Frontend developer + QA engineer
- **Success metric:** Responsive design test pass on 8+ device sizes

#### 22. **Cross-Domain Cookie & Third-Party Script Blocking**
**Risk:** PostHog, Loom, Stripe all set cookies. Safari ITP (Intelligent Tracking Prevention), Firefox ETP (Enhanced Tracking Protection), and adblockers block third-party tracking. Analytics data becomes unreliable.
**Likelihood:** High
**Impact:** Medium (analytics accuracy)
**Mitigation:**
- Implement first-party analytics fallback:
  - Track events to own backend (not just PostHog)
  - Log minimal data: timestamp, event type, user ID (not PII)
  - Reduce ITP/ETP impact by storing session ID in first-party cookie
- Test tracking with privacy-first setup:
  - Safari (ITP enabled by default)
  - Firefox (ETP strict mode)
  - Chrome with uBlock + Privacy Badger
  - Brave browser (fingerprinting blocked)
- Document expected analytics loss: Budget for 10-20% under-reporting
- Set realistic conversion targets: If 20% of data is lost, expected conversion = measured + 20%
- **Owner:** Analytics engineer + Frontend developer
- **Success metric:** Event tracking validated across 4 major browsers with tracking prevention enabled

#### 23. **Lighthouse Score Variability & Inconsistent Performance Audits**
**Risk:** Lighthouse scores fluctuate based on network conditions, third-party service performance, and Chrome version. Page may show 92 score one day, 78 the next (same code). Hard to verify "90+" requirement.
**Likelihood:** Medium
**Impact:** Minor (delays verification, not actual UX problem)
**Mitigation:**
- Run Lighthouse multiple times (5 runs), use median/90th percentile, not single run
- Automate in CI/CD: Lighthouse CI (github.com/GoogleChrome/lighthouse-ci)
- Set thresholds: Performance ≥85% (not 90%, accounts for variance)
- Monitor these specific metrics instead of overall score:
  - FCP (First Contentful Paint): <1.2s
  - LCP (Largest Contentful Paint): <1.5s
  - CLS (Cumulative Layout Shift): <0.1
  - TTFB (Time to First Byte): <200ms
- Use real-world RUM (Sentry, WebVitals library) as source of truth, not Lighthouse
- **Owner:** Frontend developer + DevOps
- **Success metric:** Real user metrics (RUM) monitored, 95th percentile load <1s

#### 24. **Testimonial Content Review & Legal Risk**
**Risk:** Accepting user-generated video testimonials without review could include false claims ("This increased my revenue by 500%"), trademark mentions, or product criticism. Legal exposure if unvetted testimonial is published.
**Likelihood:** Low
**Impact:** Critical (legal/brand)
**Mitigation:**
- Implement testimonial review process before publishing:
  - Script provided to customer: "Keep it to your experience, no comparative claims"
  - Legal review: Lawyer checks each video for:
    - No false revenue claims
    - No trademark usage without permission
    - No disparaging comments about competitors
    - Only factual, measurable claims (e.g., "We got 15 more Google reviews this month")
  - Backup: Written testimonials only (no video) if video review is too slow
- Get written permission: "Can we use this testimonial on our marketing materials?"
- Store video permission docs (email sign-off or Typeform)
- **Owner:** Legal + Marketing + Product
- **Success metric:** 100% of published testimonials legally reviewed and permitted

---

## 📋 Technical Implementation Checklist

### Pre-Launch (Day 1-3)
- [ ] Image optimization complete: Total <100KB (all assets combined)
- [ ] Loom embeds tested on 4 browsers, loading strategy set
- [ ] PostHog events validated: 5 events fire correctly, no render-blocking
- [ ] HTML/CSS performance baseline: Lighthouse ≥85 Performance
- [ ] Mobile responsiveness verified on 8+ devices
- [ ] Domain (getous.com or trysous.com) registered, DNS configured
- [ ] SSL certificate issued, HTTPS working
- [ ] Stripe test checkout flow working end-to-end
- [ ] Cache invalidation strategy ready (TTL set to 60s for launch week)

### Launch Day (Day 4)
- [ ] CDN edge locations pre-warmed (5 min before go-live)
- [ ] Real-world monitoring enabled (Sentry, WebVitals, PostHog dashboards live)
- [ ] Team on-call for first 6 hours (errors, support inquiries)
- [ ] Testimonial videos published + legally reviewed
- [ ] CTA tracking verified (trial_start event fires)

### Post-Launch (Day 5-7)
- [ ] Analyze real user load times (RUM data, 95th percentile <1s)
- [ ] Conversion rate dashboard live (page views → trial signups)
- [ ] Video completion rates monitored (target ≥40%)
- [ ] Browser compatibility issues resolved (if any QA findings)
- [ ] Cache TTL adjusted based on update velocity

### Risk Mitigation Owner Assignments
- **Frontend Developer:** Image optimization, Loom embeds, responsive design, Lighthouse
- **DevOps/Infrastructure:** Domain, DNS, SSL, CDN configuration, cache strategy
- **Analytics Engineer:** PostHog setup, event tracking, privacy-first tracking fallback
- **QA Engineer:** Cross-browser testing, mobile responsiveness, performance verification
- **Backend Engineer:** Stripe integration, error handling, monitoring
- **Legal/Compliance:** Testimonial review, privacy policy, PCI compliance
- **Product Owner:** Domain selection, communication, post-launch metrics review

---

## 📊 Success Metrics: How We Know It's Working

### Week 1 (Launch Validation)
- ✅ Pricing page live, <1s load time (Google Lighthouse)
- ✅ 3+ Loom testimonials embedded
- ✅ PostHog tracking 5 events
- ✅ 10+ page views from warm outreach

### Week 2-4 (Early Traction)
- 🎯 **100 unique visitors** (traffic validation)
- 🎯 **5 trial signups** (5% conversion)
- 🎯 **2 paying customers** (40% trial→paid conversion)
- 🎯 **$200 MRR** (2 customers × $99)

### 90 Days (Original Goal)
- 🎯 **25 paying customers** (from original PRD)
- 🎯 **$2,500 MRR**
- 🎯 **Distribution loops proven** (case studies, partnerships, or SEO driving organic signups)

### Red Flags (Pivot Signals)
- ⚠️ <1% trial signup conversion (pricing page isn't resonating)
- ⚠️ <20% trial→paid conversion (product doesn't deliver value)
- ⚠️ <10% video completion rate (testimonials aren't credible)

---

## 🎯 Locked Synthesis: The Build Mandate

### What Ships This Week
1. Static pricing page (HTML/CSS, <1s load)
2. "Sous" branding (getous.com domain)
3. Steve's copy: "Your marketing, handled" + 11 PM guilt hook
4. 3-5 Loom testimonials (60-90s each)
5. One case study with before/after metrics
6. PostHog analytics (5 events)
7. Single CTA: "Start your 14-day trial" (credit card required)

### What Ships in 30 Days
1. Distribution strategy execution (partnerships, SEO, case studies)
2. Produced hero video (upgrade from Loom)
3. First 5-10 paying customers
4. Validated conversion funnel (know what works)

### What Doesn't Ship (Ever)
1. ROI calculators
2. Three-tier pricing
3. "Request a Demo" CTAs
4. FAQ sections explaining what should be obvious
5. "AI-powered" jargon in copy

### The Philosophy
- **Elon's speed** + **Steve's craft** = ship fast, ship memorable
- No compromises on <1s load time (Elon wins)
- No compromises on "Sous" branding (Steve wins)
- No compromises on single price (both win)
- Credit card trial (Steve wins), but watch conversion data

---

## 🏁 Next Actions for Builder

1. **Domain registration**: Check getous.com availability, register immediately
2. **Copy doc**: Write all pricing page copy using Steve's voice guidelines
3. **HTML/CSS build**: Static page, <1s load, mobile-responsive
4. **PostHog setup**: 5 events, test tracking before launch
5. **Testimonial outreach**: Email 5 restaurant owners, offer $100 gift card, provide script
6. **Case study selection**: Identify strongest before/after metrics, get permission to use
7. **Loom recording**: Record 60s product tour video
8. **Launch checklist**: SSL, CDN, Lighthouse score 90+, cross-browser test

---

**This is the blueprint. The debate is over. Build.**

— Phil Jackson, Zen Master
Great Minds Agency

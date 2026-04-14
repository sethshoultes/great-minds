# LocalGenius Lite — Build Blueprint
## Consolidated by Phil Jackson, The Zen Master

*"The strength of the team is each individual member. The strength of each member is the team."*

**Document Status:** LOCKED FOR BUILD PHASE
**Date:** April 9, 2025
**Debaters:** Steve Jobs (Design/Brand) vs Elon Musk (Product/Growth)
**Board Review:** Warren Buffett (7/10), Jensen Huang (6/10), Oprah Winfrey (6.5/10)
**Board Verdict:** 3-0 Conditional Approval

---

## THE ESSENCE

> **What is this product REALLY about?**
> Giving a small business website a voice that speaks while the owner sleeps.

> **What's the feeling it should evoke?**
> Relief. The relief of realizing your website finally works *for* you.

> **What's the one thing that must be perfect?**
> The first answer. If the widget can't nail "what are your hours?" instantly, nothing else matters.

> **Creative direction:**
> Silent magic. No announcement.

---

## SECTION 1: LOCKED DECISIONS

### Decision 1: Product Naming
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Steve Jobs (Elon conceded) |
| **Final Decision** | Kill "Lite" from the name |
| **Why** | Both agreed: "Lite" signals inferiority. It whispers "this is the lesser version." The word is a brand wound that never heals. Ship as "LocalGenius" — final name TBD before WordPress.org submission, but "Lite" is dead. |
| **Implementation** | Name change is one line of code. Ship first, rebrand if needed. |

---

### Decision 2: AI Architecture
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk (Steve conceded) |
| **Final Decision** | Single LLM path — Llama 3.1 8B only via Cloudflare Workers AI |
| **Why** | Steve conceded: "I was wrong to love the 'hybrid AI' concept." One model = one latency profile, one cost structure, one failure mode. Hybrid AI adds latency variability, cost uncertainty, and a second failure path. |
| **Implementation** | No Claude fallback. No "hybrid AI." Single inference endpoint. If Llama can't handle it, fix the prompt — don't add complexity. |

---

### Decision 3: Site Scanning Scope
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs (full scan) vs Elon Musk (homepage only) |
| **Winner** | Elon Musk (for v1) |
| **Final Decision** | Homepage-only extraction + pre-written FAQ templates |
| **Why** | Steve's "magic" of full site scanning is 400 lines of DOM parsing that breaks on 30% of WordPress themes and adds 2 weeks of development. Homepage extraction + business type dropdown handles 90% of use cases. The "magic" of auto-detection equals the "magic" of one dropdown question — outcome identical, effort 10x different. |
| **Implementation** | Extract business name, phone, hours from homepage schema.org markup and `<title>`. Nothing more in v1. Site scanning deferred to v1.1 after core loop proven. |

---

### Decision 4: Activation Flow
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk (Steve conceded) |
| **Final Decision** | No background jobs on activation. Instant value. |
| **Why** | Steve's "Prestige" moment (widget appears "already generating FAQs, already scanning pages") is 4+ hours of edge-case handling. The actual miracle: click button -> widget appears with pre-written FAQs for business type. No generation. No scanning. Instant. |
| **Implementation** | User selects business type -> load hardcoded FAQ template -> widget goes live. Zero async complexity in v1. |

---

### Decision 5: Pre-Generated FAQ Templates
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk |
| **Final Decision** | All FAQ templates ship baked into the plugin as JSON |
| **Why** | Zero activation latency. Zero AI cost until user interaction. 10 business types x 15 Q&As each. This is the core cost and speed advantage. Steve's argument for Claude-generated personalized FAQs adds 3-5 seconds and scales poorly. |
| **Implementation** | `/templates/faq/*.json` files with hardcoded Q&A per business type. No generation required. |

---

### Decision 6: Caching Strategy
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk (Steve called it "brilliant") |
| **Final Decision** | Cache before LLM — always |
| **Why** | 80% of questions collapse to 15 canonical queries per business type. "What are your hours?" = "hours?" = "when are you open?" Hash normalize, check cache, only call LLM on cache miss. 5-10x cost reduction, 100x latency improvement on cache hits. |
| **Implementation** | Question hash -> cache lookup -> cache hit returns instantly -> cache miss goes to LLM -> response cached for future (24h TTL). |

---

### Decision 7: Widget Customization
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Steve Jobs (Elon agreed) |
| **Final Decision** | One beautiful widget. Zero customization options. |
| **Why** | Both aligned: No color pickers. No font selectors. No position tweaking. "We make the aesthetic decisions." Users don't get customization until they've fallen in love with the defaults. Apple ships one phone but lets you move the icons — we ship one widget. Period. |
| **Implementation** | Single widget design. Single animation. Single font treatment. Bottom-right position. Ship perfect, not configurable. |

---

### Decision 8: AI Branding in UI
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Steve Jobs (Elon agreed 100%) |
| **Final Decision** | No "AI" anywhere in the user interface |
| **Why** | The moment you say "AI," you invite skepticism. The word "chatbot" is also banned — it conjures "I didn't understand that, please rephrase." Let it work silently. Magic doesn't explain itself. |
| **Implementation** | No "AI-powered" badges. No robot icons. No "chatbot" terminology. The widget just *works*. |

---

### Decision 9: Lead Capture
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk (to cut) |
| **Winner** | Elon Musk (Steve agreed) |
| **Final Decision** | Lead capture is cut entirely from v1 |
| **Why** | Steve: "Not v1.1. Not v2. A different product entirely." This is an Answer Engine, not a CRM. Adding lead capture doubles scope and dilutes focus. |
| **Implementation** | No email collection. No lead forms. No contact capture in v1 scope. |
| **Board Override** | Buffett + Jensen want lead capture in v1.1 (60 days post-launch). Build architecture to support it. |

---

### Decision 10: Distribution Strategy
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk (Steve conceded on agency targeting) |
| **Final Decision** | WordPress.org SEO + Agency bundles as primary distribution |
| **Why** | WordPress.org plugin search = 70% of installs. ProductHunt = 500 installs and 3 days of traffic. YouTube reviewers want affiliate revenue — free plugins don't pay. One agency demo = 50 installs. Target agency Facebook groups (500K+ members). |
| **Implementation** | Optimize plugin description for "AI chatbot", "FAQ plugin", "customer chat", "automatic FAQ", "chat widget small business". Build agency-friendly documentation. |

---

### Decision 11: "Powered By" Link
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk (viral loop) vs Steve Jobs (invisible) |
| **Winner** | COMPROMISE |
| **Final Decision** | Visible in free tier, removable via upgrade path |
| **Why** | Elon: "Every widget is an ad. This is Hotjar's playbook." Steve: "Business owners feel their site became an ad for someone else. The spell breaks." Compromise respects both distribution needs and user dignity. |
| **Implementation** | Ship with subtle "Powered by LocalGenius" link. Make removable in paid tier. Test conversion impact post-launch. |

---

### Decision 12: Voice & Tone
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Steve Jobs (non-negotiable) |
| **Final Decision** | Human, warm, never robotic |
| **Why** | "Yep! We're here 9-5 on Saturdays" — not "Our business hours are Saturday 9AM-5PM." The voice is the business owner on their best day. Zero corporate contamination. This IS the product. |
| **Implementation** | All system prompts written in warm, conversational tone. Professional-neutral for sensitive businesses (lawyers, funeral homes). |
| **Elon's Caveat** | "Want me to text you a reminder?" is v3 territory — requires SMS integration. Don't write copy for features that don't exist. |

---

### Decision 13: Admin Settings
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs (minimal settings) vs Elon Musk (no settings page) |
| **Winner** | Steve Jobs |
| **Final Decision** | One minimal settings screen — business type dropdown + one text field |
| **Why** | Elon wanted to cut the admin page entirely. Steve: "No settings means no sense of control. The business owner needs to feel like this is their employee, not a parasite they can't configure." One minimal screen is the difference between adoption and uninstall. |
| **Implementation** | Single settings page: Business type dropdown + "Anything else we should know about your business?" text field + Preview. Nothing more. |

---

### Decision 14: Multi-Language Support
| Attribute | Value |
|-----------|-------|
| **Proposed by** | (PRD included it) |
| **Winner** | Elon Musk (cut) |
| **Final Decision** | Cut from v1 entirely |
| **Why** | "Obvious v2. Why even list it?" Adds translation layer, locale detection, template localization. Scope explosion. |
| **Implementation** | English only in v1. Revisit at 10K installs. Oprah's concern noted: "My Spanish-speaking salon owner in Los Angeles deserves this magic too" — address in v1.2. |

---

### Decision 15: Analytics Dashboard
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk (to cut) |
| **Winner** | Elon Musk |
| **Final Decision** | No dashboard in v1 — data collection only |
| **Why** | "You'll never look at 'top 10 questions' until you have 10K installs. Ship data collection, not data visualization." Store question logs in post_meta. Build dashboard when data exists at scale. |
| **Implementation** | Log questions/timestamps to post_meta. No UI for viewing. Dashboard is v1.1 (90 days post-launch per Board mandate). |

---

## SECTION 2: MVP FEATURE SET (What Ships in v1)

### Must Have (Build These)
1. **WordPress Plugin** — Minimal scaffold, activates in <30 seconds
2. **Business Type Selector** — Dropdown with 10 common local business types
3. **Location Input** — Single text field for city/region
4. **Pre-written FAQ Templates** — 10 JSON files, 15 Q&As each, per business type
5. **Chat Widget** — Single beautiful design, vanilla JS, embeds on frontend
6. **Cloudflare Worker API** — Single endpoint handling all chat requests
7. **Question Caching** — Hash-based cache layer before LLM
8. **Llama 3.1 8B Integration** — Single model via Workers AI
9. **Homepage Data Extraction** — Business name, phone, hours from schema.org/title
10. **Basic Logging** — Question counts stored in post_meta (no dashboard)
11. **GDPR Consent** — Simple checkbox: "By chatting, you agree to [Privacy Policy]"
12. **Graceful Error States** — "I'd recommend calling us directly at [phone] for this one"
13. **Rate Limiting** — Per-site cap (100 questions/month free tier)

### Explicitly Cut from v1
| Feature | Reason | Revisit |
|---------|--------|---------|
| Claude fallback / hybrid AI | Complexity without value | Never |
| Full site scanning | Scope creep in a tuxedo | v1.1 |
| FAQ generation | Using templates instead | v1.1 (smart templates) |
| Analytics dashboard | Ship collection, not visualization | v1.1 |
| Lead capture | Different product entirely | v1.1 (Board mandate) |
| Custom Q&A additions | Fix prompts, not UI | v1.1 |
| Multi-language support | Obvious v2 | v1.2 |
| Business hours integration | Beyond basic extraction | v1.1 |
| Color pickers / customization | One beautiful widget | v2 |
| Conversation history | Stateful chat adds complexity | v2 |
| SMS reminders | "v3 territory" per Elon | v3 |

---

## SECTION 3: FILE STRUCTURE (What Gets Built)

```
localgenius/
├── localgenius.php                 # Main plugin file, activation hooks
├── admin/
│   ├── class-admin.php             # Admin settings page
│   ├── views/
│   │   └── settings-page.php       # Single setup screen (business type + location)
│   └── css/
│       └── admin.css               # Admin styling (minimal)
├── includes/
│   ├── class-widget.php            # Widget registration and output
│   ├── class-scanner.php           # Homepage data extraction (simple)
│   ├── class-faq-templates.php     # Hardcoded FAQ templates by business type
│   └── class-api-handler.php       # WordPress REST endpoint (proxy to Worker)
├── assets/
│   ├── js/
│   │   └── chat-widget.js          # Vanilla JS chat widget (<8kb, ~200 lines)
│   └── css/
│       └── chat-widget.css         # Widget styling (one design, perfect)
├── templates/
│   └── faq/
│       ├── dentist.json            # FAQ template: Dentist
│       ├── plumber.json            # FAQ template: Plumber
│       ├── restaurant.json         # FAQ template: Restaurant
│       ├── salon.json              # FAQ template: Hair Salon
│       ├── mechanic.json           # FAQ template: Auto Mechanic
│       ├── lawyer.json             # FAQ template: Law Office
│       ├── realtor.json            # FAQ template: Real Estate
│       ├── fitness.json            # FAQ template: Gym/Fitness
│       ├── retail.json             # FAQ template: Retail Store
│       └── general.json            # FAQ template: Generic Local Business
└── readme.txt                      # WordPress.org plugin description (SEO optimized)

cloudflare-worker/
├── worker.js                       # Main Worker: routing, caching, LLM call
├── cache.js                        # Question hash + KV cache logic
├── prompts.js                      # System prompts per business type
└── wrangler.toml                   # Cloudflare deployment config
```

### Build Time Estimate
| Component | Time | Owner |
|-----------|------|-------|
| Plugin scaffold + admin | 2 hours | Engineering |
| FAQ templates (10 types x 15 Q&As) | 1 hour | Content |
| Chat widget (JS + CSS) | 3 hours | Engineering |
| Cloudflare Worker + caching | 2 hours | Engineering |
| **Total** | **8 hours focused session** | |

---

## SECTION 4: OPEN QUESTIONS (Require Resolution)

### 1. Final Product Name
| Attribute | Value |
|-----------|-------|
| **Options** | LocalGenius (current) / AskLocal / Genie (Steve's preference) |
| **Owner** | Marketing/Brand |
| **Deadline** | Before WordPress.org submission |
| **Elon's Concern** | "Genie is a trademark minefield — Disney's Genie+ service, countless apps, active trademarks" |
| **Recommendation** | Ship as "LocalGenius", rebrand if traction warrants legal investment |

### 2. Free Tier Rate Limits
| Attribute | Value |
|-----------|-------|
| **Options** | 25/month (Elon's preference) / 50/month / 100/month (PRD) |
| **Owner** | Business decision based on initial traction data |
| **Elon's Math** | 100 questions/month x 10K sites = 1M inference calls = $500-2K/month |
| **Recommendation** | Start at 100/month with aggressive caching. Revisit at 5K installs. Display limit clearly on activation ("25 free questions/month" visible from Day 1 per Elon's locked decision). |

### 3. Error State UX
| Attribute | Value |
|-----------|-------|
| **Question** | What does the user see when LLM fails, rate limit hit, or Worker down? |
| **Current Proposal** | "I'd recommend calling us directly at [phone] for this one" |
| **Owner** | UX decision before build |
| **Oprah's Concern** | Current edge-case messaging is "cold" and "corporate" — needs more humanity |

### 4. Position Toggle (Widget Placement)
| Attribute | Value |
|-----------|-------|
| **Steve's Position** | No customization. We pick the position. Bottom-right. Always. |
| **Elon's Concern** | "Bottom-right works until it covers a client's live chat, cookie notice, or accessibility button." |
| **Recommendation** | Ship bottom-right default. Add single position toggle (4 corners) if support tickets demand it post-launch. |

### 5. SSL Verification
| Attribute | Value |
|-----------|-------|
| **Current Code** | `'sslverify' => false` in homepage scanner |
| **Oprah's Concern** | Security conversation waiting to happen |
| **Recommendation** | Enable SSL verify in production, disable only for documented local dev environments |

---

## SECTION 5: RISK REGISTER (What Could Go Wrong)

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Workers AI latency spikes** | Medium | High | Cache aggressively (80% hit rate target); set 3s timeout with graceful fallback to phone number |
| **LLM hallucination (wrong hours, wrong info)** | High | High | Use FAQ templates as ground truth; limit free-form responses; homepage extraction only for verified data |
| **WordPress plugin conflicts** | Medium | Medium | Vanilla JS only; no jQuery dependency; namespace all functions with `localgenius_` prefix |
| **Cache invalidation complexity** | Low | Medium | Simple TTL-based expiry (24h); no smart invalidation in v1 |
| **Rate limit abuse** | Medium | High | Per-site daily cap; IP-based throttling at Worker level; hash-based deduplication |
| **Cold start latency** | Medium | Medium | First interaction = 400ms Worker + 200ms LLM = 600ms acceptable. Pre-warm if needed. |
| **Cloudflare Worker endpoint hardcoded** | Low | High | Single point of failure at scale. Technical debt note — address before 100K installs. |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **1-star reviews tank WordPress.org visibility** | High | Critical | Zero-support design: better defaults, fewer options, clear error messages, graceful failures |
| **Cost overrun at scale** | Medium | High | Caching cuts 5-10x; revisit pricing model at 5K installs; freemium limit visible from Day 1 |
| **No viral loop without paid tier** | Medium | Medium | "Powered by" link in free tier; agency referral program; WordPress.org SEO |
| **Competitor copies concept** | High | Low | Speed to market; brand affection; iterate faster. No durable moat today — build it through velocity. |
| **WordPress.org approval delays** | Medium | High | Document external API calls clearly; prepare backup distribution (direct download, agency channels) |
| **Full platform conversion fails** | Medium | High | Lite is a lead-gen machine — if upstream product isn't ready/priced right, installs are vanity metrics |

### User Experience Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Widget looks "spammy"** | Medium | Critical | One beautiful design; no customization; Steve owns aesthetics. Must be "proud this is on my website" beautiful. |
| **FAQ templates feel generic** | Medium | Medium | 10 specific business types; homepage extraction adds personalization; custom Q&A in v1.1 |
| **Users expect conversation, get FAQ** | Medium | Medium | Position as "Answer Engine" not "chatbot"; set expectations in plugin description |
| **"Powered by" backlash** | Medium | Medium | Subtle design; removable via upgrade; earn the referral through delight first |
| **Accessibility failures** | Medium | High | ARIA labels, keyboard navigation, focus management in widget. WCAG 2.1 AA audit in v1.2. |

---

## SECTION 6: BOARD CONDITIONS

### Mandatory Before Launch
| Condition | Owner | Deadline |
|-----------|-------|----------|
| Complete admin interface (class-admin.php) | Engineering | Before WordPress.org submission |
| Complete chat widget CSS (chat-widget.css) | Engineering | Before WordPress.org submission |
| Complete chat widget JavaScript (chat-widget.js) | Engineering | Before WordPress.org submission |
| GDPR/Privacy consent flow (minimum checkbox) | Engineering + Legal | Before v1 launch |
| Humanize edge-case messaging (rate limits, errors) | Product/UX | Before v1 launch |

### Required for v1.1 (Within 90 Days)
| Condition | Owner | Deadline |
|-----------|-------|----------|
| Data instrumentation pipeline (log to data lake) | Engineering | 30 days post-launch |
| Lead capture mechanism (optional email) | Product + Engineering | 60 days post-launch |
| Aggregate analytics dashboard ("Top questions asked") | Product | 90 days post-launch |
| Weekly email digest | Engineering | 30 days post-launch |
| Unanswered questions queue | Engineering | 30 days post-launch |

### Recommended (v1.2+)
- Multi-language support (Spanish, French priority)
- Accessibility audit (WCAG 2.1 AA compliance)
- Agency/developer white-label tier
- CRM and booking integrations
- Seasonal prompts
- Custom FAQ editor

---

## SECTION 7: STRATEGIC IMPERATIVES

### The Race
> "This is a bet on execution speed, not technology." — Warren Buffett

The board unanimously agrees: **speed to 1,000 installs is existential.** WordPress.org plugin rankings favor early, well-reviewed plugins. The window is 90 days. No durable moat exists today — build it through velocity, distribution, and network effects.

### The Flywheel
> "The plugin is the capture mechanism. The intelligence layer is the product. The aggregated insights are the platform." — Jensen Huang

The data strategy cannot be deferred indefinitely. By v1.1, every conversation must feed a learning system. The "Local Business Question Graph" is the moat — what customers ask every business type, by geography, by season. You're the only ones who could build it. Right now you're generating it and throwing it away.

### The Heart
> "Everyone just wants to be seen and heard." — Oprah Winfrey

The emotional resonance — small businesses being present for their customers 24/7 — is the true differentiator. Protect this in every UX decision. The weekly digest says "I was here. I helped." The customer story says "I made a difference."

---

## SECTION 8: THE SYNTHESIS

Steve and Elon have different religions. Steve worships at the altar of experience — the emotional transformation, the "small miracle" of activation. Elon worships at the altar of physics — the math, the latency, the failure modes.

Both are right. Both are incomplete.

**The Synthesis:** Build Elon's architecture with Steve's soul.

- Ship the boring, reliable, cached FAQ templates (Elon)
- Wrap them in a widget so beautiful it feels like magic (Steve)
- Cut the complexity (Elon)
- Never cut the craft (Steve)
- One model, one path (Elon)
- Human voice, never robotic (Steve)

The widget is the product. The widget is the brand. The widget is the trust.

---

## DOCUMENT CONTROL

| Attribute | Value |
|-----------|-------|
| **Status** | LOCKED FOR BUILD PHASE |
| **Locked Date** | April 9, 2025 |
| **Next Review** | 30 days post-launch |
| **Change Authority** | Phil Jackson (Zen Master) only |

---

*"Wisdom is knowing what to do next. Skill is knowing how to do it. Virtue is doing it."*

Now build the trap door. Make it beautiful. Ship.

— Phil Jackson, The Zen Master

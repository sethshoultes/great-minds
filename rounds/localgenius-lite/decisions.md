# LocalGenius Lite — Locked Decisions
## Consolidated by Phil Jackson, The Zen Master

*"The strength of the team is each individual member. The strength of each member is the team."*

This document represents the final synthesis of the Steve Jobs / Elon Musk debate rounds. These decisions are LOCKED. No further debate. Time to build.

---

## Decision Register

### Decision 1: Product Naming
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Steve Jobs |
| **Final Decision** | Kill "Lite" from the name |
| **Rationale** | Both agreed: "Lite" signals inferiority. It's a brand wound that never heals. The word whispers "this is the lesser version." |
| **Implementation** | Ship as "LocalGenius" or "AskLocal" — final name TBD before launch, but "Lite" is dead. Elon concedes: "Name changes are a one-line code update." |

---

### Decision 2: AI Architecture
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk |
| **Final Decision** | Single LLM path — Llama 3.1 8B only via Cloudflare Workers AI |
| **Rationale** | Steve conceded: "I was wrong to love the 'hybrid AI' concept." One model = one latency profile, one cost structure, one failure mode. If Llama can't handle it, fix the prompt — don't add complexity. |
| **Implementation** | No Claude fallback. No "hybrid AI." Single inference endpoint. |

---

### Decision 3: Site Scanning Scope
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs (full scan) vs Elon Musk (homepage only) |
| **Winner** | CONTESTED — Requires resolution |
| **Steve's Position** | Full site scanning captures *voice* and *personality*, not just data. The difference between a robot and a trusted local expert. |
| **Elon's Position** | Site scanning is scope creep. Homepage extraction + business type template handles 90%. Scanning adds async jobs, loading states, failure modes. |
| **Phil's Ruling** | **Elon wins for v1.** Ship with homepage-only extraction + pre-written FAQ templates. Site scanning is v1.1 after core loop is proven. Steve's vision is correct for the *product* but wrong for the *timeline*. |

---

### Decision 4: Activation Flow
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk |
| **Final Decision** | No background jobs on activation |
| **Rationale** | Steve's "Prestige" moment (widget appears "already generating FAQs, already scanning pages") is 4+ hours of edge-case handling. The actual miracle: click button → widget appears with pre-written FAQs for business type. No generation. No scanning. Instant. |
| **Implementation** | User selects business type → load hardcoded FAQ template → widget goes live. Zero async complexity in v1. |

---

### Decision 5: Caching Strategy
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk (Steve conceded) |
| **Final Decision** | Cache before LLM — always |
| **Rationale** | 80% of questions are identical ("what are your hours?"). Hash question → cached response. Check cache before LLM call. Steve agreed: "This doesn't compromise experience — it improves it." |
| **Implementation** | Question hash → cache lookup → cache hit returns instantly, cache miss goes to LLM → response cached for future. 5x cost reduction. |

---

### Decision 6: Widget Customization
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Steve Jobs (Elon agreed) |
| **Final Decision** | One beautiful widget. Zero customization options. |
| **Rationale** | Both aligned: No color pickers. No font selectors. No position tweaking. "We make the aesthetic decisions." Users don't get customization until they've fallen in love with the defaults. |
| **Implementation** | Single widget design. Single animation. Single font treatment. Ship perfect, not configurable. |

---

### Decision 7: AI Branding in UI
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Steve Jobs |
| **Winner** | Steve Jobs (Elon agreed 100%) |
| **Final Decision** | No "AI" anywhere in the user interface |
| **Rationale** | The moment you say "AI," you invite skepticism. "Can I trust this?" Let it work silently. The word "chatbot" is also banned — it conjures "I didn't understand that, please rephrase." |
| **Implementation** | No "AI-powered" badges. No robot icons. No "chatbot" terminology. The widget just *works*. |

---

### Decision 8: Lead Capture
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk (to cut) |
| **Winner** | Elon Musk (Steve agreed) |
| **Final Decision** | Lead capture is a different product. Cut entirely. |
| **Rationale** | Steve: "Not v1.1. Not v2. A different product entirely." This is an Answer Engine, not a CRM. |
| **Implementation** | No email collection. No lead forms. No contact capture in any version scope. |

---

### Decision 9: Distribution Strategy
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk |
| **Winner** | Elon Musk (Steve conceded on agency targeting) |
| **Final Decision** | Prioritize WordPress.org SEO + Agency bundles |
| **Rationale** | Steve conceded: "Agency distribution is underrated. One agency = 50 installs." WordPress.org is 70% of installs. YouTube reviewers won't work (no affiliate commission on free plugin). |
| **Implementation** | Optimize plugin description for "AI chatbot", "FAQ plugin", "customer chat". Target agencies managing multiple client sites. |

---

### Decision 10: "Powered by" Link
| Attribute | Value |
|-----------|-------|
| **Proposed by** | Elon Musk (viral loop) vs Steve Jobs (optional) |
| **Winner** | CONTESTED — Requires resolution |
| **Elon's Position** | Every widget is an ad. "Powered by LocalGenius" link to landing page. This is the viral loop. |
| **Steve's Position** | "Optimizes for impressions, not affection." Business owners feel their site became an ad for someone else. Make it optional. Earn the referral through delight. |
| **Phil's Ruling** | **Compromise.** Ship with "Powered by" link in free tier. Make it removable via simple upgrade path (even $0 "thank you" tier). Goodwill matters, but so does distribution. Test both approaches. |

---

## MVP Feature Set (What Ships in v1)

### Core Features (Must Have)
1. **WordPress Plugin** — Single-file or minimal scaffold, activates in <30 seconds
2. **Business Type Selector** — Dropdown with 10-15 common local business types
3. **Location Input** — Single text field for city/region
4. **Pre-written FAQ Templates** — Hardcoded per business type (dentist, plumber, restaurant, etc.)
5. **Chat Widget** — Single beautiful design, vanilla JS, embeds on frontend
6. **Cloudflare Worker API** — Single endpoint handling all chat requests
7. **Question Caching** — Hash-based cache layer before LLM
8. **Llama 3.1 8B Integration** — Single model via Workers AI
9. **Homepage Data Extraction** — Business name, address, phone, hours (if structured)
10. **Basic Logging** — Question counts stored in post_meta (no dashboard)

### Explicitly Cut from v1
- Claude fallback / hybrid AI
- Full site scanning
- FAQ generation (using templates instead)
- Analytics dashboard
- Lead capture
- Custom Q&A additions
- Multi-language support
- Business hours integration (beyond basic extraction)
- Color pickers / widget customization
- Conversation history / stateful chat
- GDPR consent management system (simple checkbox only)

---

## File Structure (What Gets Built)

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
│   │   └── chat-widget.js          # Vanilla JS chat widget (~200 lines)
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

**Estimated Build Time:** 8 hours focused session
- Plugin scaffold + admin: 2 hours
- FAQ templates (10 types): 1 hour
- Chat widget (JS + CSS): 3 hours
- Cloudflare Worker + caching: 2 hours

---

## Open Questions (Still Need Resolution)

### 1. Final Product Name
**Options:** LocalGenius | AskLocal | Genie
**Owner:** Marketing/Brand decision
**Deadline:** Before WordPress.org submission
**Note:** "Lite" is dead. Final name is cosmetic — ship first, rebrand if needed.

### 2. Free Tier Rate Limits
**Current Proposal:** 100 questions/month/site
**Elon's Concern:** At 10K sites, this is 1M inference calls/month = $500-2K in costs
**Options:**
- 50 questions/month (more conservative)
- 100 questions/month with aggressive caching
- Usage-based throttling after first 1K installs
**Owner:** Business decision based on initial traction data

### 3. "Powered by" Link Policy
**Options:**
- Always visible (Elon's viral loop)
- Optional/removable (Steve's goodwill approach)
- Removable via upgrade tier
**Owner:** Growth strategy decision
**Recommendation:** Test both in A/B after 500 installs

### 4. AI Voice/Tone Defaults
**Steve's Vision:** Warm, human, sounds like the business owner on their best day
**Elon's Concern:** "Charm is v1.2" — safe defaults for funeral homes, lawyers, etc.
**Resolution Needed:** Ship with professional-neutral tone. Revisit voice tuning in v1.1.

### 5. Error State UX
**Question:** What does the user see when LLM fails, rate limit hit, or Worker down?
**Proposal:** "I'd recommend calling us directly at [phone] for this one" — graceful fallback to contact info
**Owner:** UX decision before build

---

## Risk Register (What Could Go Wrong)

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Workers AI latency spikes** | Medium | High | Cache aggressively; set 3s timeout with graceful fallback |
| **LLM hallucination (wrong hours, wrong info)** | High | High | Use FAQ templates as ground truth; limit free-form responses |
| **WordPress plugin conflicts** | Medium | Medium | Vanilla JS only; no jQuery dependency; namespace all functions |
| **Cache invalidation complexity** | Low | Medium | Simple TTL-based expiry (24h); no smart invalidation in v1 |
| **Rate limit abuse** | Medium | High | Per-site daily cap; IP-based throttling at Worker level |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **1-star reviews tank visibility** | High | Critical | Zero-support design: better defaults, fewer options, clear error messages |
| **Cost overrun at scale** | Medium | High | Caching cuts 5x; revisit pricing model at 5K installs |
| **No viral loop without paid tier** | Medium | Medium | "Powered by" link; agency referral program |
| **Competitor copies concept** | High | Low | Speed to market; brand affection; iterate faster |

### User Experience Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Widget looks "spammy"** | Medium | Critical | One beautiful design; no customization; Steve owns aesthetics |
| **FAQ templates feel generic** | Medium | Medium | 10 specific business types; homepage extraction adds personalization |
| **Users expect conversation, get FAQ** | Medium | Medium | Position as "Answer Engine" not "chatbot"; set expectations in plugin description |

---

## The Essence (Guiding Star)

> **What is this product REALLY about?**
> Giving a small business website a voice that speaks while the owner sleeps.

> **What's the feeling it should evoke?**
> Relief. The relief of realizing your website finally works *for* you.

> **What's the one thing that must be perfect?**
> The first answer. If the widget can't nail "what are your hours?" instantly, nothing else matters.

> **Creative direction:**
> Silent magic. No announcement.

---

## Final Word from the Zen Master

Steve and Elon have different religions. Steve worships at the altar of experience — the emotional transformation, the "small miracle" of activation. Elon worships at the altar of physics — the math, the latency, the failure modes.

Both are right. Both are incomplete.

**The synthesis:** Build Elon's architecture with Steve's soul. Ship the boring, reliable, cached FAQ templates — but wrap them in a widget so beautiful it feels like magic. Cut the complexity, but never cut the craft.

The widget is the product. The widget is the brand. The widget is the trust.

Now build the trap door. Make it beautiful. Ship.

---

*Document locked: April 9, 2025*
*Next phase: Build*

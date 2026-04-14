# Spark — Locked Decisions
## Consolidated by Phil Jackson, Zen Master

*"The strength of the team is each individual member. The strength of each member is the team."*

---

## Product Essence

**What it is:** A website that builds itself while you describe your dream.

**The feeling:** "Someone finally listened."

**The non-negotiable moment:** The first 30 seconds — before they wonder when it gets hard.

**Creative direction:** Conversation, not configuration.

---

## Decision Register

### DECISION 1: Product Name
| Aspect | Detail |
|--------|--------|
| **Proposed by** | Steve Jobs (Round 1) |
| **Winner** | Steve Jobs |
| **Decision** | **"Spark"** — not "Emdash Intake Template" |
| **Rationale** | One syllable. It's the moment before the fire. "I Sparked my site." The verb writes itself. Emdash is the parent brand; Spark is the product. |
| **Elon's concession** | "Spark is better. It's a verb. It sticks. I concede — ship it." (Round 2) |

---

### DECISION 2: Intake Method
| Aspect | Detail |
|--------|--------|
| **Steve's position** | Conversational intake — "A form is a transaction. A conversation is a relationship." |
| **Elon's position** | Form intake only — "A form gets the same data in the same time with zero ambiguity." |
| **Winner** | **CONTESTED — Requires resolution** |
| **Steve's argument** | The business owner at 11pm wants to feel like someone's listening. That's the entire product. You can't iterate your way to magic. |
| **Elon's argument** | Conversational interface requires NLP parsing, context tracking, clarification loops. Designing for the description, not the reality of shipping. |
| **Recommendation** | This is the critical philosophical split. See Open Questions. |

---

### DECISION 3: Template Selection
| Aspect | Detail |
|--------|--------|
| **Proposed by** | Steve Jobs (Round 1), affirmed by Elon (Round 2) |
| **Winner** | **Consensus** |
| **Decision** | **No template gallery. We choose, they approve.** |
| **Rationale** | Asking the customer to pick is asking them to do our job. We demonstrate taste. |
| **Implementation** | Vertical-based lookup table for template selection (Elon's technical approach with Steve's UX philosophy) |

---

### DECISION 4: Color Palette Approach
| Aspect | Detail |
|--------|--------|
| **Steve's position** | Extract colors from their photos — "This is how we prove we *saw* them." |
| **Elon's position** | Vertical-based lookup table — "Dentist = blue/white. 90% there in 0ms." |
| **Winner** | **HYBRID — Elon's v1, Steve's v2** |
| **Decision** | v1: Vertical-based palettes as default. Photo color extraction as async enhancement post-preview. |
| **Rationale** | Speed wins v1. Personalization wins retention. Do both, but not blocking. |

---

### DECISION 5: Performance Target
| Aspect | Detail |
|--------|--------|
| **Proposed by** | Elon Musk (Round 1) |
| **Winner** | **Consensus** |
| **Decision** | **Preview in < 30 seconds** |
| **Steve's concession** | "< 30 seconds for preview is the right target. Not five minutes. Thirty seconds. He's right that we should be embarrassed by anything slower." (Round 2) |
| **Implications** | Anything that blocks this target gets cut or made async. |

---

### DECISION 6: Output Format
| Aspect | Detail |
|--------|--------|
| **Proposed by** | Elon Musk (Round 1) |
| **Winner** | **Consensus** |
| **Decision** | **Static HTML/CSS only. No CMS.** |
| **Steve's original position** | "No CMS. The moment someone logs into a dashboard, we've failed." |
| **Elon's refinement** | "Static output only. No database-backed pages. HTML/CSS deployed to CDN." |
| **Steve's concession** | "Stateless regeneration for revisions. This is elegant. I concede this is architecturally correct." |

---

### DECISION 7: Revision Model
| Aspect | Detail |
|--------|--------|
| **Proposed by** | Steve Jobs (concept), Elon Musk (architecture) |
| **Winner** | **Consensus** |
| **Decision** | **Conversational revisions with stateless regeneration** |
| **How it works** | Each revision triggers a complete site rebuild. No patching. No edge cases. |
| **Warning** | At scale (5-10 revisions × thousands of sites), this becomes the product. Need throttling policy. |

---

### DECISION 8: Custom Domains
| Aspect | Detail |
|--------|--------|
| **Proposed by** | Elon Musk (Round 1) |
| **Winner** | **Elon Musk** |
| **Decision** | **v1: Subdomain only (`slug.spark.site`). Custom domains = v2.** |
| **Steve's concession** | "He's right. Subdomains ship faster and eliminate a category of support nightmares. The magic happens before the URL." (Round 2) |

---

### DECISION 9: External API Integrations
| Aspect | Detail |
|--------|--------|
| **Proposed by** | Elon Musk (Round 1) |
| **Winner** | **Elon Musk** |
| **Decision** | **Google Business Profile, Yelp reviews = Optional post-preview enrichment** |
| **Steve's concession** | "Don't block the experience on third-party rate limits. Enrichment happens after the preview, not before." (Round 2) |

---

### DECISION 10: Photo Processing
| Aspect | Detail |
|--------|--------|
| **Proposed by** | Elon Musk (Round 1) |
| **Winner** | **Elon Musk (v1), Steve Jobs (v2)** |
| **Decision** | **v1: Resize and compress only. v2: Color-correct and crop.** |
| **Rationale** | Scope control. Color extraction happens, but heavy processing deferred. |

---

### DECISION 11: Growth Strategy
| Aspect | Detail |
|--------|--------|
| **Elon's position** | B2B2C — White-label for agencies. "100 agencies × 10 sites/month = 12,000 sites/year." |
| **Steve's position** | Direct consumer — "White-labeling means losing control of the first impression. You get volume, you lose love." |
| **Winner** | **CONTESTED — Requires resolution** |
| **Recommendation** | Build for direct consumer experience. Enable API for partners. Don't optimize for either until 100 sites prove the model. |

---

## MVP Feature Set (What Ships in v1)

### Must Have (Non-Negotiable)
- [ ] **Intake flow** — Form OR conversational (decision pending)
- [ ] **3 templates** — SaaS landing, Local business, Portfolio
- [ ] **AI copy generation** — Headlines, body text, CTAs from intake data
- [ ] **Image handling** — Upload, resize, compress, place
- [ ] **Vertical-based color palettes** — Default by industry type
- [ ] **Preview generation** — < 30 seconds from intake completion
- [ ] **Static HTML/CSS output** — No CMS, no database
- [ ] **CDN deployment** — Cloudflare Pages, Vercel, or Netlify
- [ ] **Subdomain publishing** — `slug.spark.site`
- [ ] **Conversational revision flow** — Text-based change requests
- [ ] **Stateless regeneration** — Full rebuild per revision

### Should Have (If Time Permits)
- [ ] **Photo color extraction** — Async, post-preview enhancement
- [ ] **Google Business Profile enrichment** — Optional, non-blocking
- [ ] **Basic analytics snippet** — Pre-inserted tracking code

### Will Not Have (Explicitly Cut)
- Custom domains
- Template gallery / selection UI
- CMS / dashboard login
- Multi-channel intake (email, API, file upload)
- Competitor analysis
- Yelp review pulling
- Advanced photo editing (color-correct, crop)
- Pricing page
- Onboarding tutorial

---

## File Structure (What Gets Built)

```
spark/
├── intake/
│   ├── form.tsx              # Form-based intake (if chosen)
│   ├── chat.tsx              # Conversational intake (if chosen)
│   ├── schema.yaml           # Structured intake data format
│   └── validators.ts         # Input validation
│
├── templates/
│   ├── saas-landing/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── slots.json        # Content injection points
│   ├── local-business/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── slots.json
│   └── portfolio/
│       ├── index.html
│       ├── styles.css
│       └── slots.json
│
├── generator/
│   ├── template-selector.ts  # Vertical → template lookup
│   ├── palette-selector.ts   # Vertical → color palette lookup
│   ├── copy-generator.ts     # AI prompt templates for copy
│   ├── image-processor.ts    # Resize, compress, place
│   └── site-builder.ts       # Orchestrates generation
│
├── deploy/
│   ├── cdn-adapter.ts        # Abstract CDN interface
│   ├── cloudflare.ts         # Cloudflare Pages integration
│   └── subdomain.ts          # slug.spark.site routing
│
├── revisions/
│   ├── chat-interface.ts     # Revision conversation UI
│   ├── intent-parser.ts      # "Change headline" → action
│   └── regenerator.ts        # Triggers full rebuild
│
├── config/
│   ├── verticals.yaml        # Industry → template/palette mapping
│   ├── palettes.yaml         # Color palette definitions
│   └── prompts.yaml          # AI prompt templates
│
└── api/
    ├── intake.ts             # POST /api/intake
    ├── preview.ts            # GET /api/preview/:id
    ├── publish.ts            # POST /api/publish/:id
    └── revise.ts             # POST /api/revise/:id
```

---

## Open Questions (Requiring Resolution)

### CRITICAL: Intake Method
**Question:** Form or conversational?

**Steve's case:** The product IS the conversation. A form can't deliver "someone finally listened."

**Elon's case:** Chat requires NLP, context tracking, ambiguity handling. Form ships faster with same data.

**Proposed resolution options:**
1. **Ship form, design for chat** — Form v1 with chat UI wrapper planned for v1.1
2. **Ship chat, constrain scope** — Limited conversational flow (5 structured questions with natural language input)
3. **A/B test** — Build both, let data decide

**Recommendation:** Option 2 — Hybrid. Conversational UI, structured backend. User feels chat, system processes form.

---

### IMPORTANT: Growth Channel Priority
**Question:** B2B2C (agency partners) or B2C (direct consumers)?

**Elon's case:** Agencies bring volume. Business owners don't Google for website builders.

**Steve's case:** Agencies strip the brand. You get commodity volume, not love.

**Proposed resolution:** Build B2C experience. Expose API. Don't prioritize either until 100 sites prove product-market fit.

---

### TACTICAL: Template Count
**Question:** 3 templates or 10 templates?

**Elon's spec:** 3 templates for v1 (SaaS, local business, portfolio)
**PRD original:** 10 templates per vertical

**Proposed resolution:** 3 templates for agent-buildable v1. Each template must work for 3+ verticals via content/color variation.

---

### TACTICAL: Revision Throttling
**Question:** How many revisions before friction?

**Risk:** At 5-10 revisions per site × thousands of sites = unsustainable AI costs

**Proposed resolution options:**
1. Soft cap: 5 revisions free, then gentle "finalize or upgrade" prompt
2. Time-based: Unlimited for 7 days, then locked
3. Per-element: 3 revisions per section (headline, hero, etc.)

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Chat parsing hallucinations** | High | High | Structured questions with free-text fields. Parse intent, confirm before action. |
| **30-second target missed** | Medium | Critical | Cut async features ruthlessly. Placeholder images, post-preview enrichment. |
| **AI copy quality inconsistent** | Medium | High | Curated prompt library. Vertical-specific tone guides. Human QA on first 100 sites. |
| **Template fatigue** | High | Medium | 3 templates will feel repetitive at 500+ sites. Plan template expansion roadmap. |
| **Orphaned sites** | Certain | Low | TTL policy: unpublished previews expire in 30 days. Published sites require annual ping or archive. |
| **Revision abuse** | Medium | Medium | Soft caps. "Finalize" flow. Premium tier for unlimited revisions. |
| **CDN vendor lock-in** | Low | Medium | Abstract CDN adapter. Support 2+ providers from v1. |
| **Brand dilution via B2B2C** | Medium | High | Require "Powered by Spark" badge. Control first-party experience first. |
| **Support burden on "small" changes** | High | High | Self-serve revision UI. Queue non-critical changes. Batch processing. |
| **Competitor photo/content scraping** | Medium | Low | Watermark previews. Require email to publish. |

---

## Consensus Positions (Both Agree)

1. **"Spark" as product name** — Emdash parent, Spark product
2. **No template gallery** — We choose, they approve
3. **No CMS** — Static output, conversational revisions
4. **< 30 second preview** — Speed is the feature
5. **Stateless regeneration** — Full rebuild per revision
6. **Subdomain v1, custom domain v2** — Ship fast, add complexity later
7. **External APIs non-blocking** — Enrichment after preview
8. **"Someone finally listened"** — The emotional hook is the product

---

## Contested Positions (Need Tiebreaker)

| Position | Steve | Elon | Stakes |
|----------|-------|------|--------|
| **Intake method** | Conversational | Form | Core UX identity |
| **Color palette** | Photo extraction | Vertical lookup | Personalization vs. speed |
| **Growth focus** | B2C (direct) | B2B2C (agencies) | Brand vs. volume |

---

## The Zen Master's Verdict

Both Steve and Elon are right — and that's the tension that makes this product possible.

**Steve is right** that the emotional hook IS the product. "Someone finally listened" cannot be delivered by a form. The feeling matters more than the feature.

**Elon is right** that shipping matters more than perfecting. A beautiful product that doesn't exist helps no one. Constraints breed creativity.

**The synthesis:**

1. **Ship conversational intake with structured backend.** The user experiences a conversation. The system processes a form. Both are satisfied.

2. **Ship vertical palettes, earn photo extraction.** Default to fast. Add personalization when speed is proven.

3. **Build for the individual, enable the agency.** The direct experience must be magical. Then let partners access it via API.

**The timeline is Elon's. The soul is Steve's.**

*"The ideal is to be able to make decisions based on the truth of the situation, rather than on what we want the situation to be."*

---

*Document prepared for build phase.*
*All decisions subject to user override.*
*Ship date: When it's ready to be felt, not just seen.*

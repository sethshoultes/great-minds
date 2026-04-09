# LocalGenius Lite — Requirements Specification

**Project Slug**: `localgenius-lite`
**Generated**: 2026-04-09
**Source Documents**:
- `/prds/localgenius-lite.md` (Original PRD)
- `/rounds/localgenius-lite/decisions.md` (Locked Decisions from Steve/Elon Debate)
- `/rounds/localgenius-lite/essence.md` (Rick Rubin Distillation)
**Status**: Ready for Phase 1 Planning

---

## Executive Summary

LocalGenius Lite is a zero-configuration WordPress plugin that brings AI-powered customer engagement to any small business website. The plugin provides:
- A floating chat widget that answers customer questions 24/7
- Pre-written FAQ templates per business type (no AI generation on setup)
- Cloudflare Workers AI backend (Llama 3.1 8B) with aggressive caching
- Homepage data extraction for personalized context

**Core Philosophy** (from essence.md):
> "Giving a small business website a voice that speaks while the owner sleeps."

**The One Thing That Must Be Perfect**:
> "The first answer. If the widget can't nail 'what are your hours?' instantly, nothing else matters."

---

## Requirements Traceability Matrix

| ID | Requirement | Source | Priority | Wave | Dependencies | Acceptance Criteria |
|----|-------------|--------|----------|------|--------------|---------------------|
| REQ-001 | WordPress plugin scaffold | decisions.md MVP #1 | P0 | 1 | None | Plugin activates without errors, GPL licensed |
| REQ-002 | Business type dropdown (10-15 types) | decisions.md MVP #2 | P0 | 2 | REQ-001 | Dropdown renders, selection stored in wp_options |
| REQ-003 | Location input field | decisions.md MVP #3 | P0 | 2 | REQ-001 | Text field accepts city/region, stored in wp_options |
| REQ-004 | Pre-written FAQ templates (10 types) | decisions.md MVP #4 | P0 | 1 | None | 10 JSON files in templates/faq/, 10-15 Q&As each |
| REQ-005 | Chat widget (vanilla JS) | decisions.md MVP #5 | P0 | 3 | REQ-002, REQ-004 | Widget loads on frontend, <200 lines JS |
| REQ-006 | Cloudflare Worker API endpoint | decisions.md MVP #6 | P0 | 1 | None | Single endpoint handles chat requests |
| REQ-007 | Question caching (hash-based) | decisions.md MVP #7 | P0 | 1 | REQ-006 | Cache hit returns <100ms, 24h TTL |
| REQ-008 | Llama 3.1 8B integration | decisions.md MVP #8 | P0 | 1 | REQ-006 | Single model, no Claude fallback |
| REQ-009 | Homepage data extraction | decisions.md MVP #9 | P1 | 3 | REQ-001 | Extract name, phone from homepage |
| REQ-010 | Basic logging (post_meta) | decisions.md MVP #10 | P1 | 3 | REQ-005 | Question counts stored, no dashboard |
| REQ-011 | Admin settings page | decisions.md File Structure | P0 | 2 | REQ-001 | Single setup screen renders, saves settings |
| REQ-012 | Widget styling (single design) | decisions.md Decision 6 | P0 | 3 | REQ-005 | One beautiful widget, zero customization |
| REQ-013 | No AI branding in UI | decisions.md Decision 7 | P0 | 3 | REQ-005 | No "AI-powered", no "chatbot" terminology |
| REQ-014 | "Powered by" link | decisions.md Decision 10 | P1 | 3 | REQ-005 | Link in widget footer, removable setting |
| REQ-015 | Error state UX | decisions.md Risk Register | P0 | 3 | REQ-005 | Graceful fallback with contact info |
| REQ-016 | Rate limiting (100 q/month) | PRD Constraints | P0 | 1 | REQ-006 | Per-site daily cap enforced at Worker |
| REQ-017 | readme.txt (WordPress.org) | PRD Constraints | P1 | 4 | REQ-001 | GPL license, SEO keywords, no upsells |

---

## Detailed Requirements

### REQ-001: WordPress Plugin Scaffold

**Description**: Create a minimal WordPress plugin that activates in <30 seconds with standard hooks and GPL compliance.

**Source**: decisions.md MVP Feature Set #1: "WordPress Plugin — Single-file or minimal scaffold, activates in <30 seconds"

**Priority**: P0 — MUST HAVE (Blocker for all other requirements)

**Acceptance Criteria**:
- [ ] Main plugin file `localgenius.php` with standard WP headers
- [ ] Plugin activates without errors on WordPress 6.0+
- [ ] Requires PHP 8.0+
- [ ] GPL v2 license included
- [ ] Activation hook registers default settings
- [ ] Deactivation hook cleans up settings
- [ ] Autoloader for class files in `/includes/`
- [ ] No external dependencies (no npm, no build step)

**File Structure** (from decisions.md):
```
localgenius/
├── localgenius.php                 # Main plugin file
├── admin/
│   ├── class-admin.php             # Admin settings page
│   ├── views/settings-page.php     # Single setup screen
│   └── css/admin.css               # Admin styling
├── includes/
│   ├── class-widget.php            # Widget registration
│   ├── class-scanner.php           # Homepage extraction
│   ├── class-faq-templates.php     # FAQ template loader
│   └── class-api-handler.php       # REST endpoint proxy
├── assets/
│   ├── js/chat-widget.js           # Vanilla JS widget
│   └── css/chat-widget.css         # Widget styling
├── templates/faq/                  # 10 JSON FAQ files
├── uninstall.php                   # Clean removal
└── readme.txt                      # WordPress.org description
```

**Dependencies**: None

**Verification**:
```bash
# Plugin activates without errors
wp plugin activate localgenius 2>&1 | grep -v "Error"
# Check for required files
test -f localgenius/localgenius.php && echo "PASS"
```

---

### REQ-002: Business Type Dropdown Selector

**Description**: Admin dropdown with 10-15 common local business types that maps to FAQ templates.

**Source**: decisions.md MVP Feature Set #2: "Business Type Selector — Dropdown with 10-15 common local business types"

**Priority**: P0 — MUST HAVE

**Acceptance Criteria**:
- [ ] Dropdown with exactly these 10 business types:
  1. Dentist
  2. Plumber
  3. Restaurant/Cafe
  4. Salon/Spa
  5. Auto Mechanic
  6. Lawyer
  7. Real Estate
  8. Fitness/Gym
  9. Retail Store
  10. General Business (fallback)
- [ ] Selection stored in `wp_options` under `localgenius_business_type`
- [ ] Selection maps to corresponding FAQ template file
- [ ] Default: "Select your business type..."
- [ ] Label: "What type of business are you?"

**Dependencies**: REQ-001 (plugin scaffold), REQ-011 (admin settings page)

**Verification**:
```bash
# Check option is saved
wp option get localgenius_business_type
```

---

### REQ-003: Location Input Field

**Description**: Single text field for city/region used for context in FAQ templates and AI prompts.

**Source**: decisions.md MVP Feature Set #3: "Location Input — Single text field for city/region"

**Priority**: P0 — MUST HAVE

**Acceptance Criteria**:
- [ ] Text input field, max 100 characters
- [ ] Label: "Your location" or "City/Region"
- [ ] Stored in `wp_options` under `localgenius_location`
- [ ] Field is optional (widget works without it)
- [ ] No validation (accept any text: "Austin", "Austin, TX", etc.)
- [ ] Used for context in Llama prompts

**Dependencies**: REQ-001 (plugin scaffold), REQ-011 (admin settings page)

**Verification**:
```bash
wp option get localgenius_location
```

---

### REQ-004: Pre-written FAQ Templates (10 Types)

**Description**: Hardcoded FAQ templates per business type — NO AI generation on activation.

**Source**:
- decisions.md MVP Feature Set #4: "Pre-written FAQ Templates — Hardcoded per business type"
- decisions.md Decision 4: "No background jobs on activation... load hardcoded FAQ template"

**Priority**: P0 — MUST HAVE

**Acceptance Criteria**:
- [ ] 10 JSON files in `templates/faq/` directory:
  - dentist.json
  - plumber.json
  - restaurant.json
  - salon.json
  - mechanic.json
  - lawyer.json
  - realtor.json
  - fitness.json
  - retail.json
  - general.json
- [ ] Each file contains 10-15 Q&A pairs
- [ ] Format: `{ "questions": [{ "q": "...", "a": "..." }, ...] }`
- [ ] Questions cover: hours, location, services, pricing, contact
- [ ] Answers are 2-3 sentences, professional tone
- [ ] Files are valid JSON (validated at build time)
- [ ] File size <5KB each
- [ ] Templates loaded instantly (no async/generation)

**Q&A Examples for Dentist**:
```json
{
  "questions": [
    { "q": "What are your hours?", "a": "Our office is open Monday through Friday, 8am to 5pm. We're closed on weekends but offer emergency appointments when needed." },
    { "q": "Do you accept insurance?", "a": "Yes, we accept most major dental insurance plans. Please call us to verify your specific plan before your visit." },
    { "q": "How do I make an appointment?", "a": "You can call our office directly or use our online booking system. We typically have availability within 1-2 weeks for new patients." }
  ]
}
```

**Dependencies**: None

**Verification**:
```bash
# Validate all JSON files
for f in templates/faq/*.json; do php -r "json_decode(file_get_contents('$f')) or die('INVALID: $f');" && echo "VALID: $f"; done
```

---

### REQ-005: Chat Widget (Vanilla JS)

**Description**: Floating chat bubble on frontend pages, vanilla JavaScript only (~200 lines).

**Source**: decisions.md MVP Feature Set #5: "Chat Widget — Single beautiful design, vanilla JS, embeds on frontend"

**Priority**: P0 — MUST HAVE

**Acceptance Criteria**:
- [ ] Floating chat bubble appears on all frontend pages
- [ ] Bubble positioned bottom-right by default
- [ ] Click opens message thread interface
- [ ] User can type question and press Enter/Send
- [ ] User message appears immediately (optimistic UI)
- [ ] Loading indicator while waiting for response
- [ ] Assistant response appears when ready
- [ ] Close button (X) to collapse conversation
- [ ] Vanilla JavaScript only (no jQuery, no React)
- [ ] Script <200 lines of code
- [ ] Script loads async (non-blocking)
- [ ] Session-based history only (clears on page refresh)
- [ ] Mobile responsive (iPhone, Android)

**UI Requirements** (from Decision 6 & 7):
- [ ] Single beautiful design (no customization)
- [ ] No "AI-powered" badges
- [ ] No "chatbot" terminology
- [ ] No robot icons
- [ ] Greeting: "Questions?" or "Ask us"

**Dependencies**: REQ-002 (business type selected), REQ-004 (FAQ templates loaded)

**Verification**:
```bash
# Check script exists and is reasonable size
wc -l assets/js/chat-widget.js | awk '{print ($1 <= 250 ? "PASS" : "WARN: " $1 " lines")}'
```

---

### REQ-006: Cloudflare Worker API Endpoint

**Description**: Single endpoint handling all chat requests via Cloudflare Workers.

**Source**: decisions.md MVP Feature Set #6: "Cloudflare Worker API — Single endpoint handling all chat requests"

**Priority**: P0 — MUST HAVE

**Acceptance Criteria**:
- [ ] Single POST endpoint at `/api/chat` (or similar)
- [ ] Accepts: `{ question, context, businessType, siteId }`
- [ ] Returns: `{ answer, source: "cached"|"llm"|"faq" }`
- [ ] CORS enabled for WordPress sites
- [ ] 3-second timeout with graceful fallback
- [ ] No user API keys required
- [ ] Deployed via wrangler.toml

**File Structure**:
```
cloudflare-worker/
├── worker.js           # Main routing, validation
├── cache.js            # Question hash + KV lookup
├── prompts.js          # System prompts per business type
└── wrangler.toml       # Cloudflare config
```

**Dependencies**: None

**Verification**:
```bash
# Test endpoint responds
curl -X POST https://api.localgenius.com/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What are your hours?","businessType":"dentist"}' \
  | jq '.answer'
```

---

### REQ-007: Question Caching (Hash-Based)

**Description**: Cache questions before LLM to reduce costs 5x.

**Source**: decisions.md Decision 5: "Cache before LLM — always. Hash question → cached response."

**Priority**: P0 — MUST HAVE

**Acceptance Criteria**:
- [ ] Hash question using SHA256
- [ ] Cache key: `${siteId}:${businessType}:${questionHash}`
- [ ] Check Cloudflare KV before LLM call
- [ ] Cache hit returns <100ms
- [ ] Cache miss → LLM call → store response
- [ ] 24-hour TTL (simple expiry, no smart invalidation)
- [ ] Cache hit rate target: >60%
- [ ] 80% of questions are identical ("what are your hours?")

**Cache Flow**:
```
Question → Hash → KV Lookup → Hit? → Return cached (source: "cached")
                           → Miss? → LLM Call → Cache → Return (source: "llm")
```

**Dependencies**: REQ-006 (Worker endpoint)

**Verification**:
```bash
# Test cache hit (second request faster)
time curl -X POST ... # First request: ~2s
time curl -X POST ... # Second request: <0.5s
```

---

### REQ-008: Llama 3.1 8B Integration

**Description**: Single LLM path via Cloudflare Workers AI — NO Claude fallback.

**Source**: decisions.md Decision 2: "Single LLM path — Llama 3.1 8B only via Cloudflare Workers AI"

**Priority**: P0 — MUST HAVE

**Acceptance Criteria**:
- [ ] Use `@hf/meta-llama/llama-3.1-8b-instruct` model
- [ ] System prompt includes FAQ as ground truth
- [ ] System prompt: "NEVER invent hours, prices, or phone numbers"
- [ ] Temperature set for consistency (not randomness)
- [ ] Max tokens: ~500
- [ ] Response time target: <2 seconds
- [ ] NO Claude fallback (explicitly removed per Decision 2)
- [ ] NO hybrid AI routing

**System Prompt Template**:
```
You are a helpful assistant for a {businessType} business located in {location}.
You have access to these FAQs - use them to answer questions:
{faqContext}

Guidelines:
- Answer questions directly and concisely
- If the question is about hours, pricing, or contact info, ONLY use FAQ data
- Never invent specific times, prices, or phone numbers
- If you don't know, say "I'd recommend calling us directly for that information"
- Be warm and professional
```

**Dependencies**: REQ-006 (Worker endpoint), REQ-004 (FAQ templates)

**Verification**:
```bash
# Test LLM doesn't hallucinate
curl -X POST ... -d '{"question":"What time do you close on Sunday?"}' \
  | grep -v "10pm" # Should not invent times
```

---

### REQ-009: Homepage Data Extraction

**Description**: Extract business name and phone from homepage only (no full site scan).

**Source**:
- decisions.md Decision 3: "Homepage-only extraction + pre-written FAQ templates"
- decisions.md MVP Feature Set #9: "Homepage Data Extraction — Business name, address, phone, hours (if structured)"

**Priority**: P1 — SHOULD HAVE

**Acceptance Criteria**:
- [ ] Extract on plugin activation (not background job)
- [ ] Use `wp_remote_get()` with 3s timeout
- [ ] Extract business name from: `<title>`, `<h1>`, site name
- [ ] Extract phone from: `tel:` links, phone regex patterns
- [ ] Store in `wp_options` under `localgenius_homepage_data`
- [ ] Fail silently (no error if extraction fails)
- [ ] Data used for LLM context and error fallback
- [ ] NO full site scanning (deferred to v1.1)

**Phone Regex Pattern**:
```regex
\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}
```

**Dependencies**: REQ-001 (plugin scaffold)

**Verification**:
```bash
wp option get localgenius_homepage_data | jq '.phone'
```

---

### REQ-010: Basic Logging (Post Meta)

**Description**: Log question counts in post_meta — no analytics dashboard in v1.

**Source**: decisions.md MVP Feature Set #10: "Basic Logging — Question counts stored in post_meta (no dashboard)"

**Priority**: P1 — SHOULD HAVE

**Acceptance Criteria**:
- [ ] Log each question asked (anonymized)
- [ ] Store count in `wp_options` under `localgenius_question_count`
- [ ] Track: timestamp, business type, cache hit/miss
- [ ] NO personal data stored
- [ ] NO analytics dashboard (deferred to v1.1)
- [ ] Data prepares for future dashboard feature

**Dependencies**: REQ-005 (chat widget)

**Verification**:
```bash
wp option get localgenius_question_count
```

---

### REQ-011: Admin Settings Page

**Description**: Single setup screen with business type dropdown and location input.

**Source**: decisions.md File Structure: "admin/views/settings-page.php — Single setup screen"

**Priority**: P0 — MUST HAVE

**Acceptance Criteria**:
- [ ] Settings page under WordPress Settings menu
- [ ] Page renders: business type dropdown + location input + Save button
- [ ] Nonce validation on form submit
- [ ] Settings saved to `wp_options`
- [ ] Success message: "LocalGenius is now active on your site!"
- [ ] Settings editable after initial setup
- [ ] Admin CSS loaded only on this page

**Dependencies**: REQ-001 (plugin scaffold)

**Verification**:
```bash
# Check settings page exists
curl -s "http://localhost/wp-admin/admin.php?page=localgenius" | grep "LocalGenius"
```

---

### REQ-012: Widget Styling (Single Design)

**Description**: One beautiful widget design — zero customization options.

**Source**: decisions.md Decision 6: "One beautiful widget. Zero customization options."

**Priority**: P0 — MUST HAVE

**Acceptance Criteria**:
- [ ] Single CSS file: `assets/css/chat-widget.css`
- [ ] Modern, clean aesthetic
- [ ] Works on all WordPress themes
- [ ] NO color pickers
- [ ] NO font selectors
- [ ] NO position tweaking
- [ ] Consistent typography and spacing
- [ ] CSS isolation (no leakage from theme)

**Dependencies**: REQ-005 (chat widget)

---

### REQ-013: No AI Branding in UI

**Description**: Remove all AI/chatbot terminology from user interface.

**Source**: decisions.md Decision 7: "No 'AI' anywhere in the user interface"

**Priority**: P0 — MUST HAVE

**Acceptance Criteria**:
- [ ] No "AI-powered" badges or labels
- [ ] No "chatbot" terminology
- [ ] No robot icons or AI imagery
- [ ] Widget labeled "Questions?" or "Ask us"
- [ ] No mention of LLM, machine learning, or artificial intelligence
- [ ] Widget implies natural conversation

**Dependencies**: REQ-005 (chat widget)

---

### REQ-014: "Powered by LocalGenius" Link

**Description**: Footer link in widget with optional removal.

**Source**: decisions.md Decision 10: "Ship with 'Powered by' link. Make it removable via simple upgrade path."

**Priority**: P1 — SHOULD HAVE

**Acceptance Criteria**:
- [ ] "Powered by LocalGenius" text in widget footer
- [ ] Link points to marketing landing page
- [ ] Link opens in new tab
- [ ] Admin setting to enable/disable link
- [ ] Default: enabled (shown)
- [ ] Subtle styling (not distracting)

**Dependencies**: REQ-005 (chat widget), REQ-011 (admin settings)

---

### REQ-015: Error State UX

**Description**: Graceful fallback when LLM fails or times out.

**Source**: decisions.md Open Questions #5: "Error State UX... Proposal: 'I'd recommend calling us directly at [phone]'"

**Priority**: P0 — MUST HAVE

**Acceptance Criteria**:
- [ ] When API fails, show friendly message (not error)
- [ ] Message: "I'd recommend calling us directly at [phone]"
- [ ] Phone from homepage extraction (REQ-009) or generic fallback
- [ ] No technical details exposed
- [ ] User can retry question
- [ ] Widget remains usable after error
- [ ] 3s timeout triggers fallback message

**Dependencies**: REQ-005 (chat widget), REQ-009 (homepage extraction)

---

### REQ-016: Rate Limiting (100 Questions/Month)

**Description**: Enforce per-site rate limits to control costs.

**Source**: PRD Constraints: "Rate limits on free tier: 100 questions/month/site"

**Priority**: P0 — MUST HAVE

**Acceptance Criteria**:
- [ ] 100 questions/month/site (may start with 50)
- [ ] Tracked by site domain in Cloudflare KV
- [ ] Reset on 1st of month
- [ ] Return 429 when limit exceeded
- [ ] Widget shows: "You've reached your question limit this month"
- [ ] IP-based throttling: 10 req/min max
- [ ] Monitoring alerts if costs exceed $10/day

**Dependencies**: REQ-006 (Worker endpoint)

---

### REQ-017: readme.txt (WordPress.org Compliance)

**Description**: WordPress.org compliant readme with SEO keywords.

**Source**: PRD Constraints: "WordPress.org compliant: GPL licensed, no phone-home beyond our API"

**Priority**: P1 — SHOULD HAVE

**Acceptance Criteria**:
- [ ] Standard WordPress.org readme format
- [ ] GPL v2 license declared
- [ ] Keywords: "AI chatbot", "FAQ plugin", "customer chat", "local business"
- [ ] Installation: Install → Activate → Select Business Type → Done
- [ ] FAQ section explaining features
- [ ] "Tested up to" current WordPress version
- [ ] No upsells in free version description
- [ ] API usage disclosed

**Dependencies**: REQ-001 (plugin scaffold)

---

## Locked Decisions (from decisions.md)

| # | Decision | Winner | Implementation |
|---|----------|--------|----------------|
| 1 | Kill "Lite" from name | Steve | Ship as "LocalGenius" |
| 2 | Single LLM path (Llama only) | Elon | No Claude fallback |
| 3 | Homepage-only extraction | Elon | No full site scanning |
| 4 | No background jobs | Elon | Instant FAQ templates |
| 5 | Cache before LLM | Elon | Hash → KV → 24h TTL |
| 6 | One beautiful widget | Steve | Zero customization |
| 7 | No "AI" in UI | Steve | No chatbot terminology |
| 8 | Lead capture CUT | Elon | Different product |
| 9 | WordPress.org + Agencies | Elon | SEO + agency bundles |
| 10 | "Powered by" link | Compromise | Removable via upgrade |

---

## Explicitly Cut from v1

Per decisions.md "Explicitly Cut from v1":
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

## Open Questions (Need Resolution Before Build)

| # | Question | Options | Recommendation |
|---|----------|---------|----------------|
| 1 | Final product name | LocalGenius, AskLocal, Genie | LocalGenius (leverages brand) |
| 2 | Rate limit | 50 or 100 questions/month | 50 (conservative) |
| 3 | "Powered by" link clickable? | Yes/No | No (non-clickable in v1) |
| 4 | AI voice/tone | Warm, Professional, Varies | Professional-neutral |
| 5 | Error message copy | Various | "I'd recommend calling us at [phone]" |
| 6 | Minimum PHP version | 7.4, 8.0, 8.1 | 8.0 (modern + broad) |

---

## Risk Register Summary

**Critical Path Risks**:
1. WordPress.org compliance rejection — High likelihood
2. Widget CSS conflicts with themes — Medium likelihood, Critical impact
3. Cloudflare Worker latency >3s — Medium likelihood
4. LLM hallucination on structured data — High likelihood
5. Rate limit abuse / cost blowout — Medium-High likelihood
6. Admin setup exceeds 30 seconds — Low likelihood

**Mitigations**:
- Pre-submit to WordPress.org for review
- Test widget on 10+ real WordPress themes
- Pre-populate cache with common questions
- System prompt locks: "NEVER invent hours, prices, or phone numbers"
- Start with 50 questions/month, IP throttling at 10 req/min
- Single-screen form with zero validation

---

## Wave Execution Order

```
Wave 1 (Parallel - Foundation):
  - REQ-001: Plugin scaffold
  - REQ-004: FAQ templates (10 JSON files)
  - REQ-006: Cloudflare Worker endpoint
  - REQ-007: Question caching
  - REQ-008: Llama integration

Wave 2 (Sequential - Admin):
  - REQ-011: Admin settings page
  - REQ-002: Business type dropdown
  - REQ-003: Location input

Wave 3 (Parallel - Frontend):
  - REQ-005: Chat widget
  - REQ-009: Homepage extraction
  - REQ-012: Widget styling
  - REQ-013: No AI branding
  - REQ-014: "Powered by" link
  - REQ-015: Error state UX
  - REQ-010: Basic logging

Wave 4 (Sequential - Polish):
  - REQ-016: Rate limiting (Worker update)
  - REQ-017: readme.txt
```

---

## Dependency Graph

```
REQ-001 (Plugin Scaffold)
   ├── REQ-011 (Admin Settings)
   │   ├── REQ-002 (Business Type) ──┐
   │   └── REQ-003 (Location) ──────┼── REQ-005 (Chat Widget)
   └── REQ-009 (Homepage Scan) ─────┘         │
                                              ├── REQ-012 (Styling)
REQ-004 (FAQ Templates) ──────────────────────┤── REQ-013 (No AI Brand)
                                              ├── REQ-014 (Powered By)
REQ-006 (Worker Endpoint)                     ├── REQ-015 (Error UX)
   ├── REQ-007 (Caching) ─────────────────────┤── REQ-010 (Logging)
   ├── REQ-008 (Llama) ───────────────────────┘
   └── REQ-016 (Rate Limit)

REQ-017 (readme.txt) ← Final polish
```

---

## Success Criteria

From PRD Success Metrics:
- [ ] Activation rate: >60% of installers complete setup
- [ ] Chat engagement: >20% of sites see at least 1 chat/week
- [ ] Question resolution: >80% don't immediately re-ask
- [ ] Distribution goal: 1,000 active installs within 30 days
- [ ] First answer latency: <3 seconds (cached: <100ms)

From decisions.md Essence:
- [ ] The first answer works perfectly ("what are your hours?")
- [ ] Widget feels like "silent magic" — no announcement
- [ ] User feels relief that their website finally works for them

---

## Estimated Build Time

Per decisions.md:
- Plugin scaffold + admin: 2 hours
- FAQ templates (10 types): 1 hour
- Chat widget (JS + CSS): 3 hours
- Cloudflare Worker + caching: 2 hours
- **Total: 8 hours focused session**

---

**Document Version**: 1.0
**Last Updated**: 2026-04-09
**Total Requirements**: 17 (14 P0, 3 P1)
**Estimated Effort**: 8 hours

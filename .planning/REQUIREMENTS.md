# REQUIREMENTS — LocalGenius Lite WordPress Plugin

**Project Slug:** localgenius-lite
**Generated:** 2025-04-09
**Source Documents:**
- `rounds/localgenius-lite/decisions.md` (15 locked decisions + board conditions)
- `engineering/tech-stack.md` (technical architecture reference)
- `engineering/infrastructure.md` (infrastructure patterns reference)

---

## Executive Summary

- **Total Requirements:** 85 (categorized below)
- **Must-Have (v1):** 60
- **Should-Have (v1.1):** 15
- **Cut/Deferred:** 10
- **Hard Blockers:** 5 (REQ-001, REQ-019, REQ-028, REQ-035, REQ-050)

---

## EXISTING IMPLEMENTATION STATUS

Based on Codebase Scout analysis, the following already exists at `/Users/sethshoultes/Local Sites/great-minds/deliverables/localgenius-lite/localgenius/`:

| File | Status | Notes |
|------|--------|-------|
| `localgenius.php` | Complete | Main plugin file, hooks, asset enqueuing (166 lines) |
| `includes/class-widget.php` | Complete | Widget display logic (66 lines) |
| `includes/class-api-handler.php` | Complete | REST API endpoint, worker proxy (226 lines) |
| `includes/class-scanner.php` | Complete | Homepage data extraction (186 lines) |
| `includes/class-faq-templates.php` | Complete | FAQ template loading (122 lines) |
| `uninstall.php` | Complete | Clean uninstall (34 lines) |
| `templates/faq/*.json` | 8 of 10 | Missing: retail.json, general.json |
| `admin/class-admin.php` | **MISSING** | Admin settings page |
| `admin/views/settings-page.php` | **MISSING** | Settings page view |
| `admin/css/admin.css` | **MISSING** | Admin styling |
| `assets/js/chat-widget.js` | **MISSING** | Frontend widget JavaScript |
| `assets/css/chat-widget.css` | **MISSING** | Widget styling |
| `cloudflare-worker/*` | **MISSING** | Entire Worker backend |
| `readme.txt` | **MISSING** | WordPress.org plugin description |

---

## 1. WORDPRESS PLUGIN REQUIREMENTS

### REQ-001: Plugin Activation & Bootstrap (HARD BLOCKER)
- **Source:** Section 2, MVP Item 1
- **Priority:** Must-Have
- **Description:** Plugin activates in <30 seconds, initializes options, triggers homepage scan
- **Verification:** Plugin installs from .zip, activates without errors, homepage data extracted
- **Status:** COMPLETE (localgenius.php, class-scanner.php exist)

### REQ-002: Business Type Selector Dropdown
- **Source:** Decision 3, Section 2, MVP Item 2
- **Priority:** Must-Have
- **Description:** Dropdown with 10 business types: dentist, plumber, restaurant, salon, mechanic, lawyer, realtor, fitness, retail, general
- **Verification:** All 10 types selectable; value saves to wp_options
- **Status:** PENDING (admin page needed)

### REQ-003: Location Input Field
- **Source:** Section 2, MVP Item 3
- **Priority:** Must-Have
- **Description:** Single text field for city/region (e.g., "Austin, TX")
- **Verification:** Value persists in wp_options
- **Status:** PENDING (admin page needed)

### REQ-004: Admin Settings Page — Minimal UI
- **Source:** Decision 13
- **Priority:** Must-Have
- **Description:** Single settings screen with: business type dropdown + "Anything else we should know?" text field + widget preview
- **Verification:** Settings page loads at /wp-admin/options-general.php?page=localgenius
- **Status:** MISSING (class-admin.php, settings-page.php needed)

### REQ-005: Homepage Data Extraction
- **Source:** Decision 3, Section 2, MVP Item 9
- **Priority:** Must-Have
- **Description:** Extract business name, phone from homepage schema.org + <title> tag only
- **Verification:** Correctly extracts on schema.org-enabled sites; graceful fallback when unavailable
- **Status:** COMPLETE (class-scanner.php exists)

### REQ-006: WordPress REST API Endpoint
- **Source:** Section 2, MVP Item 6
- **Priority:** Must-Have
- **Description:** `/wp-json/localgenius/v1/chat` endpoint proxies to Cloudflare Worker
- **Verification:** POST with `question` param returns valid JSON response
- **Status:** COMPLETE (class-api-handler.php exists)

### REQ-007: Graceful Error States
- **Source:** Section 2, MVP Item 12
- **Priority:** Must-Have
- **Description:** Human, warm error messaging: "I'd recommend calling us directly at [phone] for this one"
- **Verification:** Error responses use warm tone; phone number displayed when available
- **Status:** PARTIAL (fallback exists, but need to verify messaging)

### REQ-008: Basic Question Logging
- **Source:** Section 2, MVP Item 10
- **Priority:** Must-Have
- **Description:** Store question counts in wp_options (no dashboard in v1)
- **Verification:** `localgenius_question_count` increments on each question
- **Status:** COMPLETE (logging implemented)

### REQ-009: GDPR Consent Checkbox
- **Source:** Section 2, MVP Item 11, Board Conditions
- **Priority:** Must-Have
- **Description:** Checkbox: "By chatting, you agree to [Privacy Policy]" before first message
- **Verification:** Widget shows consent checkbox; first message blocked until checked
- **Status:** PENDING (widget implementation needed)

### REQ-010: Per-Site Rate Limiting
- **Source:** Section 2, MVP Item 13
- **Priority:** Must-Have
- **Description:** 100 questions/month free tier; display remaining count clearly
- **Verification:** Site cannot exceed 100/month; user sees "X questions remaining"
- **Status:** PARTIAL (counter exists, limit enforcement needed in widget)

### REQ-011: SSL Verification in Production
- **Source:** Section 4, Open Question 5
- **Priority:** Must-Have
- **Description:** Enable SSL verify for homepage scanner in production
- **Verification:** Production sites extract with SSL verify enabled; local dev documented
- **Status:** NEEDS FIX (currently `sslverify => false`)

### REQ-012: Plugin Namespace Compliance
- **Source:** Section 5, Risk Mitigation
- **Priority:** Must-Have
- **Description:** All functions prefixed with `localgenius_`
- **Verification:** No unprefixed globals in codebase
- **Status:** COMPLETE (namespace pattern followed)

### REQ-013: No jQuery Dependency
- **Source:** Section 5, Risk Mitigation
- **Priority:** Must-Have
- **Description:** Widget uses vanilla JavaScript only
- **Verification:** Plugin loads without jQuery; works on jQuery-free sites
- **Status:** VERIFIED IN DESIGN (implementation pending)

---

## 2. CLOUDFLARE WORKER REQUIREMENTS

### REQ-014: Cloudflare Worker Deployment
- **Source:** Decision 2, Section 2, MVP Item 6
- **Priority:** Must-Have
- **Description:** Single Worker handling all `/api/chat` requests
- **Verification:** Worker endpoint is live; responds to POST with valid JSON
- **Status:** MISSING (cloudflare-worker/ directory empty)

### REQ-015: Llama 3.1 8B via Workers AI
- **Source:** Decision 2, Section 2, MVP Item 8
- **Priority:** Must-Have
- **Description:** Single LLM path only — Llama 3.1 8B via Cloudflare Workers AI (no Claude, no hybrid)
- **Verification:** Worker calls Workers AI Llama endpoint; no fallback providers
- **Status:** MISSING

### REQ-016: Question Hash Caching
- **Source:** Decision 6, Section 2, MVP Item 7
- **Priority:** Must-Have
- **Description:** Hash-normalize questions; cache before LLM; 80% hit rate target
- **Verification:** Identical questions return cached response <100ms; cache miss triggers LLM
- **Status:** MISSING

### REQ-017: Cache TTL Management
- **Source:** Decision 6
- **Priority:** Must-Have
- **Description:** 24-hour TTL for cached responses; simple expiry (no smart invalidation)
- **Verification:** Cached responses expire after 24h; new responses generated
- **Status:** MISSING

### REQ-018: System Prompts by Business Type
- **Source:** Decision 12, Section 3
- **Priority:** Must-Have
- **Description:** Maintain prompts.js with warm, human tone per business type
- **Verification:** Prompts load correctly; responses reflect warm voice
- **Status:** MISSING

### REQ-019: Worker Timeout & Fallback (HARD BLOCKER)
- **Source:** Section 5, Risk Mitigation
- **Priority:** Must-Have
- **Description:** 3-second timeout; graceful fallback to phone number message
- **Verification:** >3s timeout returns fallback; user never sees error
- **Status:** MISSING

### REQ-020: IP-Based Throttling at Worker
- **Source:** Section 5, Risk Mitigation
- **Priority:** Must-Have
- **Description:** IP-based rate limiting to prevent abuse
- **Verification:** Rapid-fire from single IP gets throttled
- **Status:** MISSING

### REQ-021: Per-Site Daily Cap at Worker
- **Source:** Section 5, Risk Mitigation
- **Priority:** Must-Have
- **Description:** Enforce per-site cap with hash deduplication
- **Verification:** Site exceeding cap returns rate limit message
- **Status:** MISSING

---

## 3. CONTENT & TEMPLATE REQUIREMENTS

### REQ-022: Pre-Generated FAQ Templates
- **Source:** Decision 5, Section 2, MVP Item 4
- **Priority:** Must-Have
- **Description:** 10 business types × 15 Q&As each as JSON files
- **Verification:** All 10 templates present; load on widget initialization
- **Status:** PARTIAL (8 of 10 templates exist)

### REQ-023: Missing FAQ Templates
- **Source:** Section 3
- **Priority:** Must-Have
- **Description:** Create `retail.json` and `general.json` templates
- **Verification:** Files exist with valid JSON; 15 Q&As each
- **Status:** MISSING

### REQ-024: FAQ Template JSON Format
- **Source:** Section 3
- **Priority:** Must-Have
- **Description:** Consistent format: `{ business_type, display_name, faqs: [{ question, answer }] }`
- **Verification:** All templates match schema; JSON parses correctly
- **Status:** COMPLETE (existing templates follow format)

### REQ-025: Warm Voice in Templates
- **Source:** Decision 12
- **Priority:** Must-Have
- **Description:** Answers written in warm, conversational human voice; never robotic
- **Verification:** Content review confirms warm tone; professional for sensitive industries
- **Status:** VERIFIED (existing templates use warm voice)

---

## 4. UX/UI REQUIREMENTS

### REQ-026: Chat Widget HTML/CSS
- **Source:** Decision 7, Section 2, MVP Item 5
- **Priority:** Must-Have
- **Description:** Single beautiful widget; bottom-right position; no customization
- **Verification:** Widget renders correctly; responsive on mobile; matches design spec
- **Status:** MISSING (chat-widget.css needed)

### REQ-027: Chat Widget JavaScript
- **Source:** Section 3
- **Priority:** Must-Have
- **Description:** Vanilla JS; <8kb; ~200 lines; handles send/receive/display
- **Verification:** Widget works without jQuery; file <8kb; no console errors
- **Status:** MISSING (chat-widget.js needed)

### REQ-028: No AI Branding (HARD BLOCKER)
- **Source:** Decision 8
- **Priority:** Must-Have
- **Description:** Remove all "AI", "chatbot", robot icons from UI; magic works silently
- **Verification:** Zero "AI" text in widget or admin; no robot imagery
- **Status:** VERIFIED IN DESIGN (implementation pending)

### REQ-029: "Powered By" Link in Free Tier
- **Source:** Decision 11
- **Priority:** Must-Have
- **Description:** Subtle "Powered by LocalGenius" link visible in free tier
- **Verification:** Link displays in widget footer; leads to LocalGenius site
- **Status:** PENDING (widget implementation needed)

### REQ-030: Widget Position Fixed Bottom-Right
- **Source:** Decision 7, Section 4
- **Priority:** Must-Have
- **Description:** Fixed bottom-right corner; no position customization in v1
- **Verification:** Widget appears bottom-right on all tested sites
- **Status:** PENDING (CSS implementation needed)

### REQ-031: Admin UI Minimalism
- **Source:** Decision 13
- **Priority:** Must-Have
- **Description:** Settings page contains only: dropdown + text field + preview
- **Verification:** No extra fields, tabs, or options beyond spec
- **Status:** PENDING (admin implementation needed)

### REQ-032: Widget Preview in Admin
- **Source:** Decision 13
- **Priority:** Must-Have
- **Description:** Live preview of widget in admin settings
- **Verification:** Preview renders; updates when business type changes
- **Status:** PENDING (admin implementation needed)

### REQ-033: Error Message Humanization
- **Source:** Section 4, Board Conditions
- **Priority:** Must-Have
- **Description:** All error messages use warm, human voice; no corporate language
- **Verification:** User testing confirms warmth; Oprah's concern addressed
- **Status:** PENDING (copy implementation needed)

### REQ-034: Keyboard Navigation in Widget
- **Source:** Section 5, Risk Mitigation
- **Priority:** Should-Have
- **Description:** Tab navigation; Enter submits; Escape closes
- **Verification:** Keyboard-only users can operate widget
- **Status:** PENDING (v1.1 priority)

### REQ-035: ARIA Labels (HARD BLOCKER for accessibility)
- **Source:** Section 5, Risk Mitigation
- **Priority:** Must-Have
- **Description:** Basic ARIA labels for screen readers
- **Verification:** ARIA labels on input, button, message elements
- **Status:** PENDING (widget implementation needed)

---

## 5. TESTING & VALIDATION REQUIREMENTS

### REQ-036: FAQ Template Validation
- **Source:** Section 2
- **Priority:** Must-Have
- **Description:** All 10 templates load correctly; valid JSON
- **Verification:** Unit tests confirm parsing; integration tests load by type
- **Status:** PENDING

### REQ-037: LLM Hallucination Testing
- **Source:** Section 5, Risk Mitigation
- **Priority:** Must-Have
- **Description:** Test Llama responses stay within FAQ scope; no invented facts
- **Verification:** 50+ test cases per business type; 0 factual errors
- **Status:** PENDING

### REQ-038: Cache Hit Rate Measurement
- **Source:** Decision 6
- **Priority:** Must-Have
- **Description:** Track cache hits; target 80% hit rate
- **Verification:** Worker logs cache hit/miss; metrics accessible
- **Status:** PENDING

### REQ-039: Latency Benchmarking
- **Source:** Section 5
- **Priority:** Must-Have
- **Description:** End-to-end latency: cold start <600ms; cache hit <100ms
- **Verification:** Performance tests confirm targets
- **Status:** PENDING

### REQ-040: Plugin Conflict Testing
- **Source:** Section 5
- **Priority:** Must-Have
- **Description:** Test on 15+ WordPress themes/plugin combos
- **Verification:** Widget renders without JS errors on all configs
- **Status:** PENDING

### REQ-041: Rate Limit Testing
- **Source:** Section 2
- **Priority:** Must-Have
- **Description:** Verify 100/month threshold; clear limit message
- **Verification:** 101st question shows limit message
- **Status:** PENDING

### REQ-042: SSL Verification Testing
- **Source:** REQ-011
- **Priority:** Must-Have
- **Description:** Test extraction with valid/invalid SSL
- **Verification:** Production sites work; invalid certs handled gracefully
- **Status:** PENDING

### REQ-043: GDPR Consent Flow Testing
- **Source:** Section 2
- **Priority:** Must-Have
- **Description:** Consent checkbox blocks messages until checked
- **Verification:** Unconsented state prevents submission
- **Status:** PENDING

### REQ-044: Error State Testing
- **Source:** Section 2
- **Priority:** Must-Have
- **Description:** Test all failure modes: LLM down, timeout, rate limit
- **Verification:** User sees warm message for each failure
- **Status:** PENDING

### REQ-045: Mobile Responsiveness Testing
- **Source:** Section 3
- **Priority:** Must-Have
- **Description:** Widget responsive on iOS/Android; doesn't cover CTAs
- **Verification:** Widget readable on mobile; doesn't obstruct page
- **Status:** PENDING

### REQ-046: WordPress.org Submission Readiness
- **Source:** Board Conditions
- **Priority:** Must-Have
- **Description:** Plugin meets WordPress.org standards; external APIs documented
- **Verification:** Plugin checker reports zero errors
- **Status:** PENDING

---

## 6. DOCUMENTATION REQUIREMENTS

### REQ-047: readme.txt for WordPress.org
- **Source:** Section 3
- **Priority:** Must-Have
- **Description:** SEO-optimized plugin description for WordPress.org
- **Verification:** readme.txt follows WordPress.org format; keywords optimized
- **Status:** MISSING

### REQ-048: External API Documentation
- **Source:** Section 5, WordPress.org compliance
- **Priority:** Must-Have
- **Description:** Document Cloudflare Workers AI dependency clearly
- **Verification:** readme.txt mentions external service; privacy implications noted
- **Status:** MISSING

### REQ-049: Troubleshooting Guide
- **Source:** Section 5, Risk Mitigation
- **Priority:** Should-Have
- **Description:** Document common issues, theme conflicts, workarounds
- **Verification:** Guide exists; covers top 10 expected issues
- **Status:** PENDING (v1.1)

---

## 7. CUT FROM V1 (Deferred)

### REQ-050: No Claude Fallback (CUT)
- **Source:** Decision 2
- **Priority:** Cut — NEVER
- **Description:** Single LLM path only; no hybrid AI
- **Status:** ENFORCED

### REQ-051: No Full Site Scanning (v1.1)
- **Source:** Decision 3
- **Priority:** Cut — v1.1
- **Description:** Homepage-only extraction in v1
- **Status:** DEFERRED

### REQ-052: No FAQ Auto-Generation (v1.1)
- **Source:** Section 2
- **Priority:** Cut — v1.1
- **Description:** Use pre-written templates; auto-gen deferred
- **Status:** DEFERRED

### REQ-053: No Analytics Dashboard (v1.1)
- **Source:** Decision 15
- **Priority:** Cut — v1.1 (90 days post-launch)
- **Description:** Data collection only; no UI
- **Status:** DEFERRED

### REQ-054: No Lead Capture (v1.1)
- **Source:** Decision 9
- **Priority:** Cut — v1.1 (60 days post-launch, Board mandate)
- **Description:** No email collection in v1
- **Status:** DEFERRED

### REQ-055: No Multi-Language (v1.2)
- **Source:** Decision 14
- **Priority:** Cut — v1.2
- **Description:** English only in v1
- **Status:** DEFERRED

### REQ-056: No Widget Customization (v2)
- **Source:** Section 2
- **Priority:** Cut — v2
- **Description:** No color/font/position pickers
- **Status:** DEFERRED

### REQ-057: No Conversation History (v2)
- **Source:** Section 2
- **Priority:** Cut — v2
- **Description:** Stateless chat; no memory
- **Status:** DEFERRED

---

## 8. OPEN QUESTIONS REQUIRING RESOLUTION

### OQ-001: Product Name Finalization
- **Source:** Section 4, Open Question 1
- **Decision Needed:** LocalGenius vs AskLocal vs Genie
- **Recommendation:** Ship as "LocalGenius" (Elon's trademark concerns on "Genie")
- **Deadline:** Before WordPress.org submission

### OQ-002: Free Tier Rate Limit Confirmation
- **Source:** Section 4, Open Question 2
- **Options:** 25/month vs 50/month vs 100/month
- **Recommendation:** 100/month with aggressive caching
- **Deadline:** Before build

### OQ-003: Error Message Copy
- **Source:** Section 4, Open Question 3
- **Decision Needed:** Final error message wording
- **Current Proposal:** "I'd recommend calling us directly at [phone] for this one"
- **Deadline:** Before widget implementation

### OQ-004: Widget Position Toggle
- **Source:** Section 4, Open Question 4
- **Decision Needed:** Add 4-corner toggle?
- **Recommendation:** Ship bottom-right only; add toggle post-launch if support demands
- **Deadline:** Post-launch decision

---

## REQUIREMENTS BY DELIVERABLE

### Admin Interface (class-admin.php + settings-page.php)
REQ-002, REQ-003, REQ-004, REQ-031, REQ-032

### Chat Widget (chat-widget.js + chat-widget.css)
REQ-009, REQ-010, REQ-026, REQ-027, REQ-028, REQ-029, REQ-030, REQ-033, REQ-034, REQ-035

### Cloudflare Worker (worker.js + cache.js + prompts.js)
REQ-014, REQ-015, REQ-016, REQ-017, REQ-018, REQ-019, REQ-020, REQ-021

### FAQ Templates (retail.json, general.json)
REQ-022, REQ-023, REQ-024, REQ-025

### Documentation (readme.txt)
REQ-047, REQ-048

### Testing
REQ-036 through REQ-046

---

## HARD BLOCKERS (Build Fails If Not Met)

1. **REQ-001** — Plugin activation works without errors
2. **REQ-019** — Worker timeout with graceful fallback
3. **REQ-028** — No AI branding anywhere in UI
4. **REQ-035** — Basic ARIA labels for accessibility
5. **REQ-050** — No Claude/hybrid AI (single LLM path enforced)

---

## RISK MITIGATIONS EMBEDDED IN REQUIREMENTS

| Risk | Mitigating Requirements |
|------|------------------------|
| LLM Hallucination | REQ-018 (system prompts), REQ-022 (FAQ templates as ground truth), REQ-037 (hallucination testing) |
| Widget Conflicts | REQ-013 (no jQuery), REQ-040 (compatibility testing) |
| Rate Limit Abuse | REQ-010, REQ-020, REQ-021, REQ-041 |
| Worker Latency | REQ-016 (caching), REQ-019 (timeout), REQ-039 (benchmarking) |
| WordPress.org Rejection | REQ-012 (namespace), REQ-046 (readiness), REQ-048 (API docs) |
| 1-Star Reviews | REQ-007 (graceful errors), REQ-033 (human messages), REQ-040 (conflict testing) |

---

## SUCCESS CRITERIA (From decisions.md)

- [ ] All components implemented (admin, widget, worker, templates)
- [ ] Zero placeholder content
- [ ] Every command/API is real and functional
- [ ] Widget activates in <30 seconds
- [ ] 80% cache hit rate achieved in testing
- [ ] Plugin passes WordPress.org checker
- [ ] No "AI" or "chatbot" language in UI
- [ ] Widget looks "beautiful, not spammy"
- [ ] First answer works: "What are your hours?" answered instantly

---

**Document Version:** 1.0
**Last Updated:** 2025-04-09
**Total Requirements:** 57 Must-Have, 15 Should-Have, 10 Cut, 3 Open Questions

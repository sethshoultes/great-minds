# REQUIREMENTS — LocalGenius Playground

**Project Slug:** localgenius-interactive-demo
**Generated:** 2026-04-10
**Source Documents:**
- `rounds/localgenius-interactive-demo/decisions.md` (8 locked decisions + MVP spec)
- `rounds/localgenius-interactive-demo/essence.md` (brand north star)

---

## Executive Summary

- **Total Requirements:** 50 (categorized below)
- **Must-Have (v1):** 45
- **Should-Have (v1.1):** 5
- **Hard Blockers:** 5 (REQ-004, REQ-033, REQ-043, REQ-048, REQ-049)

---

## 1. UI/UX REQUIREMENTS

### REQ-001: Product Named "Playground"
- **Source:** Decision 1 - Product Naming
- **Priority:** Must-Have
- **Description:** The product shall be named "Playground" (not "Interactive Demo" or "Try It")
- **Verification:** Product name appears on landing page, browser title, and all marketing materials
- **Status:** PENDING

### REQ-002: Business Type Selector on Landing Page
- **Source:** MVP Feature Set - Core Experience #1
- **Priority:** Must-Have
- **Description:** Landing page must display selector for 3 business types: Dentist, Restaurant, Plumber
- **Verification:** User can see and interact with 3 distinct business type options on load
- **Status:** PENDING

### REQ-003: Business Type Selection Changes View
- **Source:** MVP Feature Set - Core Experience #2
- **Priority:** Must-Have
- **Description:** Selecting a business type displays simulated storefront and context-specific chat widget
- **Verification:** Click Dentist → see dentist storefront; click Restaurant → see restaurant storefront, etc.
- **Status:** PENDING

### REQ-004: Pre-Populated Chat on Load (HARD BLOCKER)
- **Source:** Decision 6 - Pre-Populated Chat State
- **Priority:** Must-Have
- **Description:** Chat widget displays completed Q&A exchange immediately on page load (no empty states, no "How can I help you?" prompt)
- **Verification:** Chat widget shows at least one customer question and AI response before user interaction
- **Status:** PENDING

### REQ-005: Chat Widget Shows Completed Exchange
- **Source:** MVP Feature Set - UX Requirements
- **Priority:** Must-Have
- **Description:** Chat conversation displays as a completed exchange, demonstrating the "fully furnished home" concept
- **Verification:** User sees realistic customer query and professional business response on load
- **Status:** PENDING

### REQ-006: View-Only Chat for v1
- **Source:** Open Questions #3 - Chat Widget Interactivity (Recommendation)
- **Priority:** Must-Have
- **Description:** Chat widget is view-only for v1; users cannot type additional questions
- **Verification:** Chat input field either disabled, hidden, or non-functional; no new messages can be added by user
- **Status:** PENDING

### REQ-007: Simulated Storefront Visual
- **Source:** Open Questions #1 - Storefront Visual Treatment (Recommendation: Option A)
- **Priority:** Must-Have
- **Description:** Display simulated storefront as static screenshot with chat widget overlaid
- **Verification:** Each business type displays unique storefront image with chat widget positioned on top
- **Status:** PENDING

### REQ-008: Mobile Chat Positioning
- **Source:** Open Questions #2 - Mobile Responsiveness (Recommendation)
- **Priority:** Must-Have
- **Description:** Chat widget positioned at bottom-right on desktop and mobile
- **Verification:** Chat widget appears consistently in bottom-right corner across device sizes
- **Status:** PENDING

### REQ-009: "Make This Real" CTA Button
- **Source:** Decision 7 - Primary CTA Copy
- **Priority:** Must-Have
- **Description:** Primary call-to-action button displays text "Make This Real" (not "Install Now")
- **Verification:** CTA button text reads exactly "Make This Real"
- **Status:** PENDING

### REQ-010: CTA Links to WordPress.org Plugin
- **Source:** Decision 7 - Primary CTA Copy & MVP Feature Set #5
- **Priority:** Must-Have
- **Description:** "Make This Real" button links directly to WordPress.org plugin page with no intermediary steps
- **Verification:** Clicking "Make This Real" navigates directly to WordPress.org plugin without signup or email capture
- **Status:** PENDING

### REQ-011: No Friction Before Value
- **Source:** Decision 8 - No Gates Before Value
- **Priority:** Must-Have
- **Description:** Zero friction to viewing demo value; no email capture, signup forms, or gating mechanisms
- **Verification:** User can view storefront and chat without entering email, creating account, or filling forms
- **Status:** PENDING

### REQ-012: Modern Visual Design
- **Source:** Risk Register - "Page looks dated"
- **Priority:** Should-Have
- **Description:** Page design uses modern typography, spacing, and subtle animations (not "2015" aesthetic)
- **Verification:** Design review confirms contemporary visual treatment; no dated styling patterns
- **Status:** PENDING

### REQ-013: No Loading Spinners
- **Source:** Decision 5 - Performance Target & MVP Feature Set - UX Requirements
- **Priority:** Must-Have
- **Description:** Page must not display loading spinners or loading states
- **Verification:** No spinner elements visible during page load or interaction
- **Status:** PENDING

### REQ-014: No Empty States
- **Source:** MVP Feature Set - UX Requirements
- **Priority:** Must-Have
- **Description:** Chat widget and storefront must never display empty states; all content pre-populated
- **Verification:** Page shows complete content immediately on load; no "loading..." or empty placeholders
- **Status:** PENDING

---

## 2. CONTENT REQUIREMENTS

### REQ-015: Five Canned Responses per Business Type
- **Source:** MVP Feature Set - Core Experience #4
- **Priority:** Must-Have
- **Description:** Each of 3 business types requires exactly 5 canned, industry-specific responses
- **Verification:** Dentist has 5 unique responses, Restaurant has 5, Plumber has 5
- **Status:** PENDING

### REQ-016: Dentist Response — Insurance Plans
- **Source:** Canned Response Requirements - Dentist #1
- **Priority:** Must-Have
- **Description:** Respond to "Do you take insurance?" with information about accepted plans
- **Verification:** Chat contains realistic answer about insurance acceptance for dental practice
- **Status:** PENDING

### REQ-017: Dentist Response — Business Hours
- **Source:** Canned Response Requirements - Dentist #2
- **Priority:** Must-Have
- **Description:** Respond to "What are your hours?" with specific business hours
- **Verification:** Chat contains realistic business hours (e.g., "Monday-Friday 8am-5pm, Saturday 9am-1pm")
- **Status:** PENDING

### REQ-018: Dentist Response — Emergency Appointments
- **Source:** Canned Response Requirements - Dentist #3
- **Priority:** Must-Have
- **Description:** Respond to "Do you do emergency appointments?" with same-day availability information
- **Verification:** Chat describes same-day emergency availability or contact method for emergencies
- **Status:** PENDING

### REQ-019: Dentist Response — Cleaning Pricing
- **Source:** Canned Response Requirements - Dentist #4
- **Priority:** Must-Have
- **Description:** Respond to "How much is a cleaning?" with pricing and insurance information
- **Verification:** Chat provides realistic cleaning cost with insurance options
- **Status:** PENDING

### REQ-020: Dentist Response — New Patients
- **Source:** Canned Response Requirements - Dentist #5
- **Priority:** Must-Have
- **Description:** Respond to "Are you accepting new patients?" with availability status
- **Verification:** Chat confirms accepting new patients and describes enrollment process
- **Status:** PENDING

### REQ-021: Restaurant Response — Hours and Status
- **Source:** Canned Response Requirements - Restaurant #1
- **Priority:** Must-Have
- **Description:** Respond to "Are you open right now?" with current hours and open/closed status
- **Verification:** Chat provides hours and indicates whether currently open
- **Status:** PENDING

### REQ-022: Restaurant Response — Reservations
- **Source:** Canned Response Requirements - Restaurant #2
- **Priority:** Must-Have
- **Description:** Respond to "Do you take reservations?" with booking process information
- **Verification:** Chat describes reservation availability and booking method
- **Status:** PENDING

### REQ-023: Restaurant Response — Vegetarian Options
- **Source:** Canned Response Requirements - Restaurant #3
- **Priority:** Must-Have
- **Description:** Respond to "Do you have vegetarian options?" with menu highlights
- **Verification:** Chat describes available vegetarian options
- **Status:** PENDING

### REQ-024: Restaurant Response — Parking
- **Source:** Canned Response Requirements - Restaurant #4
- **Priority:** Must-Have
- **Description:** Respond to "Is there parking?" with location and parking details
- **Verification:** Chat provides parking information and location context
- **Status:** PENDING

### REQ-025: Restaurant Response — Catering
- **Source:** Canned Response Requirements - Restaurant #5
- **Priority:** Must-Have
- **Description:** Respond to "Do you do catering?" with services offered
- **Verification:** Chat describes catering services and booking process
- **Status:** PENDING

### REQ-026: Plumber Response — Emergency Calls
- **Source:** Canned Response Requirements - Plumber #1
- **Priority:** Must-Have
- **Description:** Respond to "Do you do emergency calls?" with 24/7 availability information
- **Verification:** Chat confirms 24/7 emergency service availability
- **Status:** PENDING

### REQ-027: Plumber Response — Leaky Faucet Pricing
- **Source:** Canned Response Requirements - Plumber #2
- **Priority:** Must-Have
- **Description:** Respond to "How much to fix a leaky faucet?" with pricing approach
- **Verification:** Chat provides realistic pricing information or pricing methodology
- **Status:** PENDING

### REQ-028: Plumber Response — Licensing
- **Source:** Canned Response Requirements - Plumber #3
- **Priority:** Must-Have
- **Description:** Respond to "Are you licensed?" with credentials information
- **Verification:** Chat confirms licensing and certifications
- **Status:** PENDING

### REQ-029: Plumber Response — Service Scheduling
- **Source:** Canned Response Requirements - Plumber #4
- **Priority:** Must-Have
- **Description:** Respond to "How soon can you come?" with scheduling information
- **Verification:** Chat provides typical service windows and scheduling process
- **Status:** PENDING

### REQ-030: Plumber Response — Free Estimates
- **Source:** Canned Response Requirements - Plumber #5
- **Priority:** Must-Have
- **Description:** Respond to "Do you give free estimates?" with estimate process
- **Verification:** Chat describes free estimate policy and scheduling
- **Status:** PENDING

### REQ-031: Responses Sound Natural
- **Source:** Risk Register - "Canned responses feel fake"
- **Priority:** Must-Have
- **Description:** All canned responses must sound natural and professional, not robotic
- **Verification:** User testing confirms responses read as authentic business communication
- **Status:** PENDING

### REQ-032: Responses Include Specific Details
- **Source:** Risk Register - "Canned responses feel fake" (Mitigation)
- **Priority:** Must-Have
- **Description:** Responses include specific details (e.g., actual insurance names, realistic hours)
- **Verification:** Responses reference specific plans, prices, or details (not generic placeholders)
- **Status:** PENDING

---

## 3. TECHNICAL REQUIREMENTS

### REQ-033: Single HTML File Architecture (HARD BLOCKER)
- **Source:** Technical Constraints
- **Priority:** Must-Have
- **Description:** Application delivered as single HTML file with embedded CSS (no separate stylesheets)
- **Verification:** Deployment consists of one index.html file with all styles embedded; no external CSS files
- **Status:** PENDING

### REQ-034: Vanilla JavaScript Only
- **Source:** Technical Constraints
- **Priority:** Must-Have
- **Description:** Implementation uses vanilla JavaScript; no frameworks (React, Vue, etc.)
- **Verification:** JavaScript code contains no framework imports or dependencies
- **Status:** PENDING

### REQ-035: Zero Backend/API Calls
- **Source:** Decision 4 - Architecture & Technical Constraints
- **Priority:** Must-Have
- **Description:** Application contains no backend API calls, database queries, or server dependencies
- **Verification:** Network inspection shows zero calls to external APIs; all data hardcoded in HTML
- **Status:** PENDING

### REQ-036: No Database
- **Source:** Decision 4 - Architecture
- **Priority:** Must-Have
- **Description:** Application contains no database integration or persistent storage
- **Verification:** No database connections, queries, or references in code
- **Status:** PENDING

### REQ-037: Static Files Only
- **Source:** Decision 4 - Architecture
- **Priority:** Must-Have
- **Description:** Application deployed as static files with no server-side rendering
- **Verification:** Deployment to Cloudflare Pages succeeds; no server code required
- **Status:** PENDING

### REQ-038: Cloudflare Pages Hosting
- **Source:** Decision 4 & File Structure
- **Priority:** Must-Have
- **Description:** Application hosted on Cloudflare Pages platform
- **Verification:** Live application accessible via Cloudflare Pages subdomain
- **Status:** PENDING

### REQ-039: Canned Responses Load in 50ms
- **Source:** Decision 2 - AI Responses (Deterministic, loads in 50ms)
- **Priority:** Must-Have
- **Description:** Responses display within 50 milliseconds of user interaction
- **Verification:** Performance measurement confirms response display latency <50ms
- **Status:** PENDING

### REQ-040: Deterministic Response Behavior
- **Source:** Decision 2 - AI Responses (Deterministic)
- **Priority:** Must-Have
- **Description:** Chat responses are deterministic and reproducible (no randomization)
- **Verification:** Same user question always produces identical response
- **Status:** PENDING

### REQ-041: Storefront Images Optimized
- **Source:** File Structure - Alternative (true single-file)
- **Priority:** Must-Have
- **Description:** Storefront images embedded as base64, CSS-only, or optimized JPG to maintain size budget
- **Verification:** Total page weight <100KB including all assets
- **Status:** PENDING

### REQ-042: Deployment Instructions Documented
- **Source:** File Structure
- **Priority:** Should-Have
- **Description:** README.md provided with deployment instructions for Cloudflare Pages
- **Verification:** README.md exists and contains clear deployment steps
- **Status:** PENDING

---

## 4. PERFORMANCE REQUIREMENTS

### REQ-043: Sub-100KB Total Page Weight (HARD BLOCKER)
- **Source:** Decision 5 - Performance Target & Technical Constraints
- **Priority:** Must-Have
- **Description:** Total page weight must not exceed 100 kilobytes
- **Verification:** Network inspection confirms gzipped page size <100KB
- **Status:** PENDING

### REQ-044: First Paint Under 1 Second
- **Source:** Decision 5 - Performance Target & MVP Feature Set - UX Requirements
- **Priority:** Must-Have
- **Description:** First paint must occur within 1 second
- **Verification:** Performance measurement (Lighthouse, WebPageTest) confirms <1s first paint
- **Status:** PENDING

### REQ-045: Interactive Under 1.5 Seconds
- **Source:** Decision 5 - Performance Target & MVP Feature Set - UX Requirements
- **Priority:** Must-Have
- **Description:** Page must be interactive within 1.5 seconds
- **Verification:** Performance measurement confirms <1.5s time to interactive (TTI)
- **Status:** PENDING

### REQ-046: Instant Loading Perception
- **Source:** Decision 2 - AI Responses (deterministic) & MVP Feature Set - UX Requirements
- **Priority:** Must-Have
- **Description:** Content appears instantly on page load; no perceived loading time
- **Verification:** User perceives content as immediately available; no flash of unstyled content
- **Status:** PENDING

### REQ-047: Minimal Analytics Tracking
- **Source:** Open Questions #4 - Analytics (Recommendation)
- **Priority:** Should-Have
- **Description:** Track CTA clicks to WordPress.org using simple URL parameter (minimal analytics)
- **Verification:** CTA button includes tracking parameter (e.g., utm_source=playground)
- **Status:** PENDING

---

## 5. SCOPE & ACCEPTANCE CRITERIA

### REQ-048: Scope Completeness (HARD BLOCKER)
- **Source:** Build Phase Authorization
- **Priority:** Must-Have
- **Description:** Implementation includes: 1 HTML file, 3 business types, pre-populated chat, "Make This Real" CTA, <100KB
- **Verification:** Checklist completed: Single HTML? Yes. 3 types? Yes. Pre-populated chat? Yes. CTA? Yes. <100KB? Yes.
- **Status:** PENDING

### REQ-049: Out of Scope Exclusions (HARD BLOCKER)
- **Source:** Build Phase Authorization
- **Priority:** Must-Have
- **Description:** Explicitly out of scope: Live AI, user input handling, email capture, analytics dashboards, A/B testing, additional business types, backend infrastructure
- **Verification:** Code review confirms none of these features are implemented
- **Status:** PENDING

### REQ-050: Exit Criteria Met
- **Source:** Build Phase Authorization
- **Priority:** Must-Have
- **Description:** Demo is live, linked from homepage, and directs visitors to WordPress.org plugin
- **Verification:** Demo accessible from homepage link; CTA successfully navigates to plugin page
- **Status:** PENDING

---

## REQUIREMENTS BY DELIVERABLE

### Landing Page (index.html)
REQ-001, REQ-002, REQ-003, REQ-011, REQ-012, REQ-013, REQ-014

### Chat Widget
REQ-004, REQ-005, REQ-006, REQ-008

### Storefront Visual
REQ-007, REQ-041

### CTA Section
REQ-009, REQ-010, REQ-047

### Content (Canned Responses)
REQ-015 through REQ-032

### Technical Implementation
REQ-033 through REQ-040

### Performance
REQ-043 through REQ-046

### Deployment
REQ-038, REQ-042

### Scope Compliance
REQ-048, REQ-049, REQ-050

---

## HARD BLOCKERS (Build Fails If Not Met)

1. **REQ-004** — Pre-populated chat visible on load (core UX)
2. **REQ-033** — Single HTML file architecture (deployment constraint)
3. **REQ-043** — Page weight <100KB (performance constraint)
4. **REQ-048** — All MVP features implemented
5. **REQ-049** — No out-of-scope features (no scope creep)

---

## RISK MITIGATIONS EMBEDDED IN REQUIREMENTS

| Risk | Mitigating Requirements |
|------|------------------------|
| Canned responses feel fake | REQ-031 (natural tone), REQ-032 (specific details), REQ-016-030 (industry-specific content) |
| Page looks dated | REQ-012 (modern design), design polish task in plan |
| Scope creep | REQ-048 (completeness), REQ-049 (exclusions enforced) |
| Performance issues | REQ-043 (size), REQ-044 (first paint), REQ-045 (TTI), REQ-041 (image optimization) |
| WordPress.org link breaks | REQ-010 (link verification task in plan) |

---

## SUCCESS CRITERIA (From decisions.md)

- [ ] Single HTML file, embedded CSS/JS
- [ ] 3 business types only: Dentist, Restaurant, Plumber
- [ ] Pre-populated chat with completed exchange
- [ ] "Make This Real" CTA links to WordPress.org
- [ ] Page weight <100KB
- [ ] First paint <1s, interactive <1.5s
- [ ] No loading spinners, no empty states
- [ ] Zero backend, zero API calls
- [ ] Demo is live on Cloudflare Pages

---

## TRACEABILITY MATRIX

| Decision | Requirements |
|----------|-------------|
| Decision 1 (Product Naming) | REQ-001 |
| Decision 2 (Canned Responses) | REQ-039, REQ-040, REQ-015-032 |
| Decision 3 (3 Business Types) | REQ-002, REQ-003 |
| Decision 4 (Zero Backend) | REQ-033-037 |
| Decision 5 (Performance) | REQ-043-046 |
| Decision 6 (Pre-Populated Chat) | REQ-004, REQ-005 |
| Decision 7 (CTA Copy) | REQ-009, REQ-010 |
| Decision 8 (No Gates) | REQ-011 |
| MVP Feature Set | REQ-002, REQ-003, REQ-007, REQ-013, REQ-014, REQ-015 |
| Open Questions (Resolved) | REQ-006, REQ-008, REQ-041, REQ-047 |
| Risk Register | REQ-012, REQ-031, REQ-032 |
| Build Phase Authorization | REQ-048, REQ-049, REQ-050 |

---

## SUMMARY STATISTICS

| Category | Count | Must-Have | Should-Have |
|----------|-------|-----------|-------------|
| UI/UX Requirements | 14 | 13 | 1 |
| Content Requirements | 18 | 18 | 0 |
| Technical Requirements | 10 | 9 | 1 |
| Performance Requirements | 5 | 4 | 1 |
| Scope & Acceptance | 3 | 3 | 0 |
| **TOTAL** | **50** | **47** | **3** |

---

**Document Version:** 1.0
**Last Updated:** 2026-04-10
**Project Slug:** localgenius-interactive-demo

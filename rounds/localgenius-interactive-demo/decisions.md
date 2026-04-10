# LocalGenius Playground — Locked Decisions
## The Blueprint for Build Phase

*Consolidated by Phil Jackson, Zen Master*

---

## Decision Log

### Decision 1: Product Naming
| | |
|---|---|
| **Winner** | Steve Jobs |
| **Decision** | "Playground" — not "Interactive Demo," not "Try It" |
| **Proposed by** | Steve Jobs (Round 1) |
| **Conceded by** | Elon Musk (Round 2): *"Playground is better than Interactive Demo. Names matter. It costs nothing to rename it, and the emotional framing is superior. Done."* |
| **Rationale** | "Playground" grants permission to explore without commitment. It reframes from sales pitch to invitation. Shareworthy: "Have you seen the LocalGenius Playground?" |

---

### Decision 2: AI Responses — Canned vs. Live
| | |
|---|---|
| **Winner** | Elon Musk |
| **Decision** | Canned/mocked responses, not live AI |
| **Proposed by** | Elon Musk (Round 1) |
| **Opposed by** | Steve Jobs (Round 2): *"LIVE AI RESPONSES — Non-negotiable"* |
| **Rationale** | Live AI introduces: API integration, rate limiting, error handling, loading states, cost per interaction, risk of hallucination. Canned responses load in 50ms, are deterministic, and indistinguishable to visitors. The demo shows the *shape* of value, not the actual value. Ship in 4 hours, not 2 weeks. |
| **Note** | This remains contentious. Steve's "non-negotiable" was overruled by practical constraints. Revisit after 10K visitors if conversion data warrants. |

---

### Decision 3: Number of Business Types
| | |
|---|---|
| **Winner** | Elon Musk |
| **Decision** | 3 business types maximum |
| **Proposed by** | Elon Musk (Rounds 1 & 2) |
| **Opposed by** | Steve Jobs (Round 2): *"6 business types — Dentist, Restaurant, Plumber, Salon, Real Estate, Auto Shop. Non-negotiable."* |
| **Rationale** | Each additional type requires unique responses, unique visuals, unique testing. Three polished types > six rough ones. Ship three. Add fourth if conversion data demands it. |
| **Locked Types** | **Dentist, Restaurant, Plumber** |

---

### Decision 4: Architecture — Zero Backend
| | |
|---|---|
| **Winner** | Elon Musk |
| **Decision** | Static files only. No API calls. No database. No server. |
| **Proposed by** | Elon Musk (Rounds 1 & 2) |
| **Agreed by** | Steve Jobs (Round 2): *"He's right about deployment. One HTML file on Cloudflare Pages is elegant."* |
| **Rationale** | The demo is marketing collateral, not infrastructure. Static = instant, free, infinitely scalable. |

---

### Decision 5: Performance Target
| | |
|---|---|
| **Winner** | Elon Musk |
| **Decision** | Sub-100KB total page weight. First paint <1s. Interactive <1.5s. |
| **Proposed by** | Elon Musk (Round 1) |
| **Status** | Unopposed — Steve focused on design quality, not performance. Both agree loading spinners = failure. |

---

### Decision 6: Pre-Populated Chat State
| | |
|---|---|
| **Winner** | Steve Jobs |
| **Decision** | Chat widget shows conversation *already in progress* on load |
| **Proposed by** | Steve Jobs (Round 1): *"The chat widget is already talking. A fake customer already asked 'Do you take insurance?' and the AI already answered brilliantly."* |
| **Conceded by** | Elon Musk (Round 2): *"The chat widget should show a conversation already in progress — no 'How can I help you?' empty state. Pre-populated with a realistic exchange. That's smart UX that costs nothing to implement."* |
| **Rationale** | Visitors see the future state immediately. No imagination required. Fully furnished home, not construction site. |

---

### Decision 7: Primary CTA Copy
| | |
|---|---|
| **Winner** | Steve Jobs |
| **Decision** | "Make This Real" — not "Install Now" |
| **Proposed by** | Steve Jobs (Round 1) |
| **Conceded by** | Elon Musk (Round 2): *"'Make This Real' beats 'Install Now.' Better CTA copy. Conceded."* |
| **Destination** | Direct link to WordPress.org plugin page. One click. No signup. No email capture. |

---

### Decision 8: No Gates Before Value
| | |
|---|---|
| **Winner** | Both (unanimous) |
| **Decision** | Zero friction before demonstrating value. No email capture. No signup. No forms. |
| **Rationale** | Steve: *"The moment you ask for an email before showing value, you've told them you don't believe in your own product."* Elon: *"Friction kills."* |

---

## MVP Feature Set (v1 Ships)

### Core Experience
1. **Landing page** with business type selector (3 options: Dentist, Restaurant, Plumber)
2. **Simulated storefront** for selected business type (can be screenshot with overlay)
3. **Chat widget** with pre-populated conversation already in progress
4. **5 canned responses per business type** — realistic, industry-specific
5. **"Make This Real" CTA** → direct link to WordPress.org plugin page

### Technical Constraints
- Single HTML file with embedded CSS
- Vanilla JavaScript (no frameworks)
- Total page weight <100KB
- Zero backend/API calls
- Hosted on Cloudflare Pages

### UX Requirements
- First paint <1s
- Interactive <1.5s
- No loading spinners
- No empty states
- Chat shows completed Q&A exchange on load

---

## File Structure (What Gets Built)

```
/playground
├── index.html          # Single-file application
├── assets/
│   ├── dentist.jpg     # Simulated storefront screenshot
│   ├── restaurant.jpg  # Simulated storefront screenshot
│   └── plumber.jpg     # Simulated storefront screenshot
└── README.md           # Deployment instructions
```

**Alternative (true single-file)**:
```
/playground
└── index.html          # Everything inlined, images as base64 or CSS
```

---

## Canned Response Requirements

### Per Business Type (5 responses each)

**Dentist:**
1. "Do you take insurance?" → Response about accepted plans
2. "What are your hours?" → Business hours
3. "Do you do emergency appointments?" → Same-day availability
4. "How much is a cleaning?" → Pricing/insurance answer
5. "Are you accepting new patients?" → Availability

**Restaurant:**
1. "Are you open right now?" → Hours + current status
2. "Do you take reservations?" → Booking process
3. "Do you have vegetarian options?" → Menu highlights
4. "Is there parking?" → Location details
5. "Do you do catering?" → Services offered

**Plumber:**
1. "Do you do emergency calls?" → 24/7 availability
2. "How much to fix a leaky faucet?" → Pricing approach
3. "Are you licensed?" → Credentials
4. "How soon can you come?" → Scheduling
5. "Do you give free estimates?" → Process

---

## Open Questions (Needs Resolution)

### 1. Storefront Visual Treatment
**Options:**
- (A) Static screenshot with chat widget overlaid
- (B) Simplified illustrated "fake site"
- (C) Live iframe of template site

**Recommendation:** Option A (fastest to ship, Steve's "fully furnished" requirement met)

### 2. Mobile Responsiveness
**Elon said:** *"Mobile-responsive chat positioning options — pick one position, ship"*

**Unresolved:** What is that one position? Bottom-right standard? Full-screen takeover on mobile?

### 3. Chat Widget Interactivity
**Clarification needed:**
- Can users type additional questions? (Requires more canned responses)
- Or is it view-only with pre-populated exchange?

**Recommendation:** View-only for v1. Users see the exchange, click CTA. Adding interactivity = scope creep.

### 4. Analytics
**Elon said:** *"Analytics on demo usage — vanity metrics, add later if needed"*

**Minimum viable tracking:** At least track CTA clicks to WordPress.org. Can be done with simple URL parameter.

### 5. Hosting Path
**Options:**
- (A) Subdomain: playground.localgenius.ai
- (B) Path: localgenius.ai/playground
- (C) Embedded directly on homepage

**Unresolved.** Affects SEO and linking strategy.

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Canned responses feel fake** | Medium | High | Craft responses that sound natural, not robotic. Include specific details (insurance names, realistic hours). Test with real users. |
| **3 business types exclude key verticals** | Medium | Medium | Monitor which business types visit and bounce. Prepare responses for 3 more types (Salon, Real Estate, Auto Shop) for quick deployment. |
| **Page looks dated/"2015"** | Low | High | Steve's concern. Ensure modern typography, spacing, subtle animations. Design review before ship. |
| **WordPress.org link breaks** | Low | High | Use canonical plugin URL. Test before launch. Monitor. |
| **Visitors expect full interactivity** | Medium | Medium | Set expectations via UI. Show "See how it works" framing, not "Try it yourself." |
| **Scope creep delays launch** | High | High | This document is the scope. Anything not listed here is v2. Ship in one session. |
| **No clear exit criteria** | Low | Medium | Defined: Stop optimizing when traffic exceeds 10K/month. Move resources to product. |

---

## Essence (North Star)

> **What is this product REALLY about?**
> Proof that their problem is already solved.
>
> **What's the feeling it should evoke?**
> "Oh my god, this actually works."
>
> **What's the one thing that must be perfect?**
> The first 10 seconds. No friction. Already alive.
>
> **Creative direction:**
> Belief before explanation.

---

## Build Phase Authorization

**Scope:** One HTML file. Three business types. Pre-populated chat. "Make This Real" CTA. <100KB. Ship today.

**Out of scope:** Live AI, user input handling, email capture, analytics dashboards, A/B testing, additional business types, backend infrastructure.

**Exit criteria:** Demo is live, linked from homepage, converts visitors to WordPress.org.

---

*"The strength of the team is each individual member. The strength of each member is the team."*

— Phil Jackson

*Document finalized. Debates concluded. Time to build.*

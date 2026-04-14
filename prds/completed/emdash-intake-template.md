# Emdash Intake Template

*What a client provides to get a site built. Nothing more.*

**Author:** Steve Jobs, Chief Design & Brand Officer
**Date:** 2026-04-03

---

## Philosophy

The intake should feel like a conversation, not a form. Five questions. Each one takes under 30 seconds to answer. The total intake is under 3 minutes.

If we ask more than five questions, we've failed at our job. The AI should infer everything else — tone, layout, structure, color, imagery — from these five answers plus whatever it can find online about the business.

---

## The Five Questions

### 1. What is this for?

*One sentence. What does the site need to do?*

```
Examples:
- "A landing page for my new SaaS product"
- "A restaurant website with menu and hours"
- "A portfolio for my photography business"
- "Documentation for our open-source project"
- "A coming-soon page with email capture"
```

**What the AI extracts:** Site type, primary purpose, expected page count, content structure.

---

### 2. Who are you?

*Business name + what you do. Two sentences max.*

```
Examples:
- "Bright Smile Dental — family dentistry in North Austin"
- "Folio — a project management tool for creative teams"
- "Maria's Kitchen — Tex-Mex restaurant on South Lamar"
```

**What the AI extracts:** Business name, vertical, location (if physical), tagline seed.

**What the AI researches:** Google Business Profile, existing website (if any), social media presence, reviews, competitors in the area.

---

### 3. What should people do when they visit?

*The one action. Not three. One.*

```
Examples:
- "Book an appointment"
- "Sign up for the waitlist"
- "Call us"
- "Read the docs and install the package"
- "Browse the menu and come in"
```

**What the AI extracts:** Primary CTA, conversion goal, form requirements (if any).

---

### 4. What makes you different?

*The thing you'd tell a friend. Not the marketing version.*

```
Examples:
- "We make everything from scratch — even the tortillas"
- "We're the only dentist in Austin that does same-day emergencies"
- "Our tool has a Kanban view that actually works on mobile"
- "We've been doing this for 30 years and we still answer our own phone"
```

**What the AI extracts:** Value proposition, brand personality, unique selling point, copy tone.

---

### 5. Photos or assets?

*Upload what you have. Don't worry about quality — we'll handle it.*

```
Accepted:
- Photos (any format, any quality — we color-correct and crop)
- Logo (if you have one — if not, we generate a wordmark)
- Brand colors (if you know them — if not, we choose)
- Existing copy you like (from anywhere — we'll use the tone, not the words)
```

**What the AI extracts:** Visual identity seed, photo treatment direction, existing brand constraints.

---

## What the AI Infers (Not Asked)

These are never questions. The AI figures them out.

| Element | Source |
|---|---|
| Color palette | Derived from photos + vertical + mood |
| Typography | Selected from curated pairs per vertical |
| Page structure | Template selected by site type, customized by content |
| SEO metadata | Generated from business name + description + location |
| Social links | Discovered from Google/Yelp/Instagram |
| Hours + address | Pulled from Google Business Profile (if exists) |
| Reviews | Pulled from Google/Yelp (if exists) |
| Competitor context | Top 3 similar businesses in the area |

---

## Output Contract

After intake, the client receives:

| Deliverable | Timeline | Format |
|---|---|---|
| Live preview URL | < 5 minutes | `{slug}.emdash.site` |
| Approval prompt | Immediately | "Does this look right?" with one-tap approve |
| Deployed site | < 1 minute after approval | Same URL, now permanent |
| Custom domain setup | < 1 hour (if requested) | Client provides domain, Emdash handles DNS |

---

## Intake Channels

The five questions can come through any channel:

| Channel | Format |
|---|---|
| **Chat** | Conversational — AI asks one question at a time |
| **Form** | Web form on emdash.site — all five fields on one page |
| **Email** | Client emails a brief — AI parses and follows up on gaps |
| **PRD file** | Structured markdown dropped into `prds/` — for technical clients |
| **API** | POST to `/api/intake` — for white-label partners |

---

## Revision Flow

After the initial site is live, the client can request changes:

```
Client: "Change the headline to something about speed"
AI: Done. "Ship faster than you think" → live now.

Client: "Add a pricing page with three tiers"
AI: Here's a draft. [Preview] [Approve] [Edit]

Client: "The photos look too dark"
AI: Brightened and re-cropped. Take a look.
```

Each revision is a conversation, not a form. The AI makes the change, shows a preview, waits for approval. No CMS. No editor. No learning curve.

---

## What a Completed Intake Looks Like

```yaml
# Emdash Intake — Bright Smile Dental
type: business-website
business:
  name: "Bright Smile Dental"
  description: "Family dentistry in North Austin"
  location: "4521 Guadalupe St, Austin, TX 78751"
action: "Book an appointment"
differentiator: "Same-day emergency appointments. Dr. Chen has been here for 12 years."
assets:
  - logo.png
  - office-photo-1.jpg
  - office-photo-2.jpg
auto_discovered:
  google_rating: 4.9
  review_count: 183
  hours: "Mon-Thu 8am-5pm, Fri 9am-3pm"
  phone: "(512) 555-0388"
  competitors:
    - "Austin Dental Arts (4.7, 312 reviews)"
    - "Smile Center Austin (4.5, 198 reviews)"
```

This is the complete input. From this, the AI builds a 5-page website with hero, services, about, testimonials, contact, and booking CTA. The client never sees this YAML — it's the internal representation of what they said in conversation.

---

*Steve Jobs — Chief Design & Brand Officer*
*"Five questions. Three minutes. Live site."*

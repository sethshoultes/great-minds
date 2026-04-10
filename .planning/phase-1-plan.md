# Phase 1 Plan — LocalGenius Playground

**Generated**: 2026-04-10
**Requirements**: `.planning/REQUIREMENTS.md`
**Decisions**: `rounds/localgenius-interactive-demo/decisions.md`
**Total Tasks**: 12
**Waves**: 4
**Timeline**: 4-6 hours focused session (per decisions.md estimate)
**Project Slug**: `localgenius-interactive-demo`

---

## Executive Summary

LocalGenius Playground is a static demo page that showcases the LocalGenius chat widget in action. Visitors see a simulated business website with a pre-populated chat conversation already in progress, demonstrating the "future state" where their business website automatically answers customer questions.

**Key Constraints (Locked Decisions):**
- Product name: "Playground" (not "Interactive Demo")
- 3 business types only: Dentist, Restaurant, Plumber
- Canned/mocked responses, NOT live AI
- Single HTML file with embedded CSS + vanilla JS
- Zero backend, zero API calls
- Total page weight <100KB
- "Make This Real" CTA → WordPress.org plugin

**North Star** (from essence.md):
> "Oh my god, this actually works."
> The first 10 seconds. No friction. Already alive.

---

## What Already Exists

**Planning Documents** (in `rounds/localgenius-interactive-demo/`):
- `decisions.md` — 8 locked decisions + MVP spec + risk register
- `essence.md` — Brand north star
- Round transcripts (Steve/Elon debate)

**Reference Patterns** (from LocalGenius Lite):
- `deliverables/localgenius-lite/localgenius/assets/js/chat-widget.js` — Widget logic (~320 lines vanilla JS)
- `deliverables/localgenius-lite/localgenius/assets/css/chat-widget.css` — Widget styling (~458 lines)
- `deliverables/localgenius-lite/localgenius/templates/faq/*.json` — FAQ templates for all 3 business types

**Deliverables Directory**: `deliverables/localgenius-interactive-demo/` — Empty, ready to build

---

## What Must Be Built

| File | Description | Size Target |
|------|-------------|-------------|
| `index.html` | Single-file application (all CSS/JS embedded) | <100KB total |
| `README.md` | Deployment instructions | — |

**Optional (if not using base64 images):**
```
assets/
├── dentist-storefront.jpg    (~25KB)
├── restaurant-storefront.jpg (~25KB)
└── plumber-storefront.jpg    (~25KB)
```

---

## Requirements Traceability

| Requirement | Task(s) | Wave |
|-------------|---------|------|
| REQ-001: Product Named "Playground" | phase-1-task-1 | 1 |
| REQ-002-003: Business Type Selector | phase-1-task-2 | 1 |
| REQ-004-006: Pre-Populated Chat | phase-1-task-3 | 2 |
| REQ-007-008: Storefront Visual + Mobile | phase-1-task-4 | 2 |
| REQ-009-011: "Make This Real" CTA | phase-1-task-5 | 2 |
| REQ-015-032: Canned Responses (15 total) | phase-1-task-1 | 1 |
| REQ-033-041: Technical Constraints | phase-1-task-6 | 3 |
| REQ-043-046: Performance Targets | phase-1-task-7 | 3 |
| REQ-012, REQ-031-032: Modern Design + Natural Copy | phase-1-task-8 | 3 |
| REQ-048-050: Scope Compliance | phase-1-task-9 | 4 |

---

## Wave Execution Order

### Wave 1 (Parallel — Content & Design Foundation)

These tasks prepare the content and design assets before coding.

```xml
<task-plan id="phase-1-task-1" wave="1">
  <title>Write Canned Responses (15 Q&As)</title>
  <requirement>REQ-015-032: 5 canned responses per business type, natural and specific</requirement>
  <description>Write 15 canned responses (5 each for Dentist, Restaurant, Plumber) that sound natural, include specific details, and match the warm voice of the existing FAQ templates. These responses will be shown in the pre-populated chat.</description>

  <context>
    <file path="rounds/localgenius-interactive-demo/decisions.md" reason="Specifies exact questions for each business type" />
    <file path="deliverables/localgenius-lite/localgenius/templates/faq/dentist.json" reason="Voice and format reference" />
    <file path="deliverables/localgenius-lite/localgenius/templates/faq/restaurant.json" reason="Voice and format reference" />
    <file path="deliverables/localgenius-lite/localgenius/templates/faq/plumber.json" reason="Voice and format reference" />
  </context>

  <steps>
    <step order="1">Write 5 Dentist responses per decisions.md:
      1. "Do you take insurance?" → Specific insurance names (Delta Dental, Cigna, Aetna), warm tone
      2. "What are your hours?" → Realistic hours (Mon-Fri 8am-5pm, Sat 9am-1pm)
      3. "Do you do emergency appointments?" → Same-day availability + phone number
      4. "How much is a cleaning?" → Price range + insurance mention
      5. "Are you accepting new patients?" → Welcoming tone + next steps</step>
    <step order="2">Write 5 Restaurant responses per decisions.md:
      1. "Are you open right now?" → Current status + full hours
      2. "Do you take reservations?" → Booking process + phone/OpenTable
      3. "Do you have vegetarian options?" → Specific menu items
      4. "Is there parking?" → Parking lot + street parking details
      5. "Do you do catering?" → Services + contact info</step>
    <step order="3">Write 5 Plumber responses per decisions.md:
      1. "Do you do emergency calls?" → 24/7 availability + response time
      2. "How much to fix a leaky faucet?" → Price range + "free estimate"
      3. "Are you licensed?" → License number + insurance mention
      4. "How soon can you come?" → Same-day/next-day + scheduling
      5. "Do you give free estimates?" → Yes + process</step>
    <step order="4">Review all responses for:
      - Specific details (not generic placeholders)
      - Warm, conversational tone
      - Realistic information
      - 1-2 sentence length (brevity = confidence)</step>
    <step order="5">Create JSON object for embedding in HTML</step>
  </steps>

  <verification>
    <check type="manual">Each response contains specific details (insurance names, hours, prices)</check>
    <check type="manual">Responses sound natural, not robotic</check>
    <check type="manual">All 15 responses complete</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies - content task -->
  </dependencies>

  <commit-message>content(playground): add 15 canned responses for demo

- Write 5 Q&As each for Dentist, Restaurant, Plumber
- Include specific details (insurance names, hours, prices)
- Use warm, conversational tone matching FAQ templates
- Prepare JSON format for HTML embedding

Refs: decisions.md Canned Response Requirements

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-2" wave="1">
  <title>Create Design System &amp; Wireframe</title>
  <requirement>REQ-002-003, REQ-012: Business type selector, modern visual design</requirement>
  <description>Define the visual design system (colors, typography, spacing) and create a wireframe showing the landing page layout with business type selector, storefront area, chat widget, and CTA.</description>

  <context>
    <file path="rounds/localgenius-interactive-demo/decisions.md" reason="MVP feature set and visual treatment decision" />
    <file path="deliverables/localgenius-lite/localgenius/assets/css/chat-widget.css" reason="Existing color palette and widget styling" />
  </context>

  <steps>
    <step order="1">Define color palette (from existing widget CSS):
      - Primary: #2271b1 (WordPress admin blue)
      - Background: #f8f9fa, #fff
      - Text: #1e1e1e (primary), #646970 (secondary)
      - Borders: #e2e4e7
      - Accent: #0073aa (links)</step>
    <step order="2">Define typography:
      - Font stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, sans-serif
      - Heading: 32px/40px bold
      - Body: 16px/24px regular
      - Chat: 14px/20px</step>
    <step order="3">Design layout structure:
      - Header: "LocalGenius Playground" + tagline
      - Business type selector: 3 cards (Dentist, Restaurant, Plumber)
      - Main area: Storefront screenshot (left) + chat widget (right/overlay)
      - CTA section: "Make This Real" button centered below</step>
    <step order="4">Define mobile layout:
      - Stack vertically
      - Chat widget as bottom sheet or inline
      - Touch-friendly buttons (44px min)</step>
    <step order="5">Document design decisions for implementation</step>
  </steps>

  <verification>
    <check type="manual">Color palette defined and documented</check>
    <check type="manual">Typography scale defined</check>
    <check type="manual">Desktop and mobile layouts wireframed</check>
    <check type="manual">Design looks modern (not "2015")</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies - design task -->
  </dependencies>

  <commit-message>design(playground): create design system and wireframe

- Define color palette matching LocalGenius Lite
- Set typography scale for modern appearance
- Wireframe desktop and mobile layouts
- Document spacing and component patterns

Refs: Decision 3 (3 business types), Risk Register (dated design)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

---

### Wave 2 (Parallel — Core Implementation)

Build the HTML structure, chat widget, and storefront components.

```xml
<task-plan id="phase-1-task-3" wave="2">
  <title>Build Chat Widget with Pre-Populated Conversation</title>
  <requirement>REQ-004-006: Pre-populated chat on load, view-only for v1</requirement>
  <description>Create the chat widget component in vanilla JS that displays a pre-populated conversation on page load. The widget shows the "future state" - a customer question and brilliant AI response already visible.</description>

  <context>
    <file path="deliverables/localgenius-lite/localgenius/assets/js/chat-widget.js" reason="Widget logic patterns to adapt" />
    <file path="deliverables/localgenius-lite/localgenius/assets/css/chat-widget.css" reason="Widget styling to adapt" />
    <file path="rounds/localgenius-interactive-demo/decisions.md" reason="Decision 6: Pre-populated chat" />
  </context>

  <steps>
    <step order="1">Create widget HTML structure:
      - Chat bubble button (toggles open/closed)
      - Chat window container
      - Header with business name
      - Messages container
      - Footer with "Powered by LocalGenius" link
      - NO input field (view-only per decisions.md)</step>
    <step order="2">Create widget CSS:
      - Fixed position bottom-right (20px margin)
      - 350px wide, 400px tall max
      - Message bubbles (user right, bot left)
      - Subtle shadow and border-radius
      - Mobile: bottom sheet style or smaller</step>
    <step order="3">Create widget JavaScript:
      - IIFE pattern (no global pollution)
      - Toggle open/close on bubble click
      - Load pre-populated messages from config
      - Render messages with proper styling
      - Add typing indicator for delayed message reveal
      - Keyboard: Escape to close
      - Click outside to close</step>
    <step order="4">Implement pre-populated state:
      - On page load, widget shows 1-2 exchanges
      - First: Customer question (e.g., "Do you take insurance?")
      - Second: AI response (warm, specific answer)
      - Third: Optional second question to show depth</step>
    <step order="5">Add animation:
      - Messages slide in with 200ms delay
      - Typing indicator (3 dots) for realism
      - Smooth scroll to latest message</step>
  </steps>

  <verification>
    <check type="manual">Widget appears bottom-right on desktop</check>
    <check type="manual">Pre-populated conversation visible on load</check>
    <check type="manual">No input field visible (view-only)</check>
    <check type="manual">Escape key closes widget</check>
    <check type="manual">Click outside closes widget</check>
    <check type="bash">! grep -iE "input|textarea" deliverables/localgenius-interactive-demo/index.html 2>/dev/null | grep -v "business-type" &amp;&amp; echo "NO INPUT FIELD PASS" || echo "CHECK INPUT FIELD"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Canned responses needed for pre-populated content" />
    <depends-on task-id="phase-1-task-2" reason="Design system needed for styling" />
  </dependencies>

  <commit-message>feat(playground): add pre-populated chat widget

- Create view-only chat widget in vanilla JS
- Display pre-populated conversation on load
- Implement toggle, keyboard, click-outside handlers
- Add typing indicator animation for realism
- Style with existing LocalGenius color palette

Refs: Decision 6 (pre-populated chat)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-4" wave="2">
  <title>Build Storefront Visual Component</title>
  <requirement>REQ-007-008: Simulated storefront, mobile responsiveness</requirement>
  <description>Create the storefront area showing a simulated business website screenshot with the chat widget overlaid. Implement business type switching that changes both the storefront and chat content.</description>

  <context>
    <file path="rounds/localgenius-interactive-demo/decisions.md" reason="Decision: Static screenshot with overlay (Option A)" />
  </context>

  <steps>
    <step order="1">Create storefront container:
      - Full-width section with max-width constraint
      - Browser chrome frame (optional, adds realism)
      - Storefront image area
      - Chat widget overlay position</step>
    <step order="2">Prepare storefront images (3 options):
      - Option A: Use CSS-only placeholder (fastest, smallest)
      - Option B: Create simple HTML mockup for each business
      - Option C: Use optimized screenshots (if available)
      For v1, use Option A or B to stay under 100KB</step>
    <step order="3">Implement business type switching:
      - Click Dentist → show dentist storefront + dentist chat
      - Click Restaurant → show restaurant storefront + restaurant chat
      - Click Plumber → show plumber storefront + plumber chat
      - Smooth transition between types</step>
    <step order="4">Style for mobile:
      - Stack storefront above chat on mobile
      - Or show chat as bottom sheet overlay
      - Ensure storefront is readable at 375px width</step>
    <step order="5">Add business details to storefront:
      - Business name (varies by type)
      - Phone number
      - Address (generic but realistic)
      - Logo placeholder</step>
  </steps>

  <verification>
    <check type="manual">Each business type shows distinct storefront</check>
    <check type="manual">Chat content changes with business type</check>
    <check type="manual">Storefront readable on mobile (375px)</check>
    <check type="manual">Transition between types is smooth</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-2" reason="Design system for colors and layout" />
  </dependencies>

  <commit-message>feat(playground): add storefront visual with business switching

- Create storefront container with browser frame
- Implement CSS-only business mockups (under 100KB)
- Add business type switching logic
- Style responsive layout for mobile

Refs: Decision: Static screenshot with overlay

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-5" wave="2">
  <title>Implement "Make This Real" CTA</title>
  <requirement>REQ-009-011: CTA button linking to WordPress.org, no friction</requirement>
  <description>Add the primary call-to-action button "Make This Real" that links directly to the WordPress.org plugin page. No signup, no email capture, no gates.</description>

  <context>
    <file path="rounds/localgenius-interactive-demo/decisions.md" reason="Decision 7: CTA copy and destination" />
  </context>

  <steps>
    <step order="1">Create CTA section:
      - Centered below storefront area
      - Clear visual hierarchy
      - Whitespace above and below</step>
    <step order="2">Style CTA button:
      - Primary color (#2271b1) background
      - White text, bold
      - Large size (16px font, 16px padding)
      - Border-radius for modern look
      - Hover state (darker shade)
      - Focus state for accessibility</step>
    <step order="3">Add button text and link:
      - Text: "Make This Real"
      - href: https://wordpress.org/plugins/localgenius-lite/
      - target="_blank" (opens in new tab)
      - rel="noopener" (security)</step>
    <step order="4">Add tracking parameter:
      - Append ?utm_source=playground&amp;utm_medium=demo&amp;utm_campaign=cta
      - For minimal analytics per decisions.md</step>
    <step order="5">Add supporting text:
      - Below button: "Free WordPress plugin. Install in 30 seconds."
      - Reinforces zero friction message</step>
  </steps>

  <verification>
    <check type="manual">Button text is exactly "Make This Real"</check>
    <check type="manual">Button links to WordPress.org plugin page</check>
    <check type="manual">Link opens in new tab</check>
    <check type="manual">UTM parameters present in URL</check>
    <check type="bash">grep -q "Make This Real" deliverables/localgenius-interactive-demo/index.html &amp;&amp; echo "CTA TEXT PASS"</check>
    <check type="bash">grep -q "wordpress.org/plugins" deliverables/localgenius-interactive-demo/index.html &amp;&amp; echo "WP.ORG LINK PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-2" reason="Design system for button styling" />
  </dependencies>

  <commit-message>feat(playground): add "Make This Real" CTA button

- Create centered CTA section below storefront
- Style button with primary color and hover state
- Link to WordPress.org plugin with UTM tracking
- Add supporting copy reinforcing zero friction

Refs: Decision 7 (CTA copy and destination)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

---

### Wave 3 (Sequential — Integration & Optimization)

Assemble all components into single HTML file and optimize.

```xml
<task-plan id="phase-1-task-6" wave="3">
  <title>Assemble Single HTML File</title>
  <requirement>REQ-033-041: Single HTML, vanilla JS, zero backend, static files</requirement>
  <description>Combine all components (landing page, business selector, storefront, chat widget, CTA) into a single HTML file with embedded CSS and JavaScript.</description>

  <context>
    <file path="rounds/localgenius-interactive-demo/decisions.md" reason="Technical constraints: single file, embedded CSS" />
  </context>

  <steps>
    <step order="1">Create HTML structure:
      ```html
      &lt;!DOCTYPE html&gt;
      &lt;html lang="en"&gt;
      &lt;head&gt;
        &lt;meta charset="UTF-8"&gt;
        &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
        &lt;title&gt;LocalGenius Playground — See It In Action&lt;/title&gt;
        &lt;style&gt;/* All CSS embedded here */&lt;/style&gt;
      &lt;/head&gt;
      &lt;body&gt;
        &lt;!-- Header --&gt;
        &lt;!-- Business Type Selector --&gt;
        &lt;!-- Storefront + Chat Widget --&gt;
        &lt;!-- CTA Section --&gt;
        &lt;!-- Footer --&gt;
        &lt;script&gt;/* All JS embedded here */&lt;/script&gt;
      &lt;/body&gt;
      &lt;/html&gt;
      ```</step>
    <step order="2">Embed all CSS:
      - Design system styles (colors, typography)
      - Layout styles (header, selector, storefront, CTA)
      - Chat widget styles
      - Responsive media queries</step>
    <step order="3">Embed all JavaScript:
      - Business type switching logic
      - Chat widget class/module
      - Pre-populated conversation data
      - Event handlers</step>
    <step order="4">Embed canned responses as JSON:
      ```javascript
      const RESPONSES = {
        dentist: [...],
        restaurant: [...],
        plumber: [...]
      };
      ```</step>
    <step order="5">Add meta tags:
      - og:title, og:description for social sharing
      - favicon reference (can be data URI)</step>
    <step order="6">Test complete file loads independently</step>
  </steps>

  <verification>
    <check type="bash">test -f deliverables/localgenius-interactive-demo/index.html &amp;&amp; echo "INDEX.HTML EXISTS"</check>
    <check type="bash">grep -q "&lt;style&gt;" deliverables/localgenius-interactive-demo/index.html &amp;&amp; echo "EMBEDDED CSS PASS"</check>
    <check type="bash">grep -q "&lt;script&gt;" deliverables/localgenius-interactive-demo/index.html &amp;&amp; echo "EMBEDDED JS PASS"</check>
    <check type="bash">! grep -q "fetch(" deliverables/localgenius-interactive-demo/index.html &amp;&amp; echo "NO API CALLS PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-3" reason="Chat widget must be complete" />
    <depends-on task-id="phase-1-task-4" reason="Storefront must be complete" />
    <depends-on task-id="phase-1-task-5" reason="CTA must be complete" />
  </dependencies>

  <commit-message>feat(playground): assemble single HTML file application

- Combine all components into index.html
- Embed all CSS and JavaScript inline
- Include canned responses as JSON object
- Add meta tags for social sharing
- Zero external dependencies

Refs: Technical constraints (single file, zero backend)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-7" wave="3">
  <title>Optimize for Performance Targets</title>
  <requirement>REQ-043-046: &lt;100KB, first paint &lt;1s, interactive &lt;1.5s</requirement>
  <description>Optimize the assembled HTML file to meet performance targets: under 100KB total, first paint under 1 second, time to interactive under 1.5 seconds.</description>

  <context>
    <file path="rounds/localgenius-interactive-demo/decisions.md" reason="Decision 5: Performance targets" />
  </context>

  <steps>
    <step order="1">Measure current file size:
      ```bash
      wc -c deliverables/localgenius-interactive-demo/index.html
      ```</step>
    <step order="2">Minify CSS (manual or tool):
      - Remove comments
      - Remove unnecessary whitespace
      - Combine selectors where possible</step>
    <step order="3">Minify JavaScript:
      - Remove comments
      - Shorten variable names (if not affecting readability)
      - Remove console.log statements</step>
    <step order="4">Optimize images (if any):
      - Compress to quality 60-70%
      - Resize to display dimensions
      - Consider base64 for small images
      - OR use CSS-only approach (no images)</step>
    <step order="5">Verify performance:
      - Test in Chrome DevTools (Network tab)
      - Run Lighthouse performance audit
      - Confirm First Contentful Paint &lt;1s
      - Confirm Time to Interactive &lt;1.5s</step>
    <step order="6">If over budget, prioritize cuts:
      - Remove decorative elements
      - Simplify storefront mockups
      - Reduce animation complexity</step>
  </steps>

  <verification>
    <check type="bash">wc -c deliverables/localgenius-interactive-demo/index.html | awk '{print ($1 &lt; 102400 ? "PASS: &lt;100KB (" $1 " bytes)" : "FAIL: &gt;100KB (" $1 " bytes)")}'</check>
    <check type="manual">Lighthouse First Contentful Paint &lt;1s</check>
    <check type="manual">Lighthouse Time to Interactive &lt;1.5s</check>
    <check type="manual">No loading spinners visible during load</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-6" reason="Complete HTML file must exist" />
  </dependencies>

  <commit-message>perf(playground): optimize to meet &lt;100KB target

- Minify embedded CSS and JavaScript
- Optimize or remove images as needed
- Verify first paint &lt;1s, TTI &lt;1.5s
- Document final file size

Refs: Decision 5 (performance targets)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-8" wave="3">
  <title>Polish Design &amp; Copy</title>
  <requirement>REQ-012, REQ-031-032: Modern design, natural responses</requirement>
  <description>Final design review to ensure modern aesthetic and copy review to ensure responses sound natural. Address "looks dated" risk from Risk Register.</description>

  <context>
    <file path="rounds/localgenius-interactive-demo/decisions.md" reason="Risk Register: Page looks dated" />
  </context>

  <steps>
    <step order="1">Design review checklist:
      - [ ] Modern typography (system fonts, proper scale)
      - [ ] Consistent spacing (8px grid)
      - [ ] Subtle shadows (no harsh drop shadows)
      - [ ] Border-radius on interactive elements
      - [ ] Smooth micro-interactions (hover, focus)
      - [ ] No clashing colors or dated gradients</step>
    <step order="2">Copy review checklist:
      - [ ] All responses use warm, conversational tone
      - [ ] Specific details included (not generic)
      - [ ] Business names sound authentic
      - [ ] Phone numbers are realistic format
      - [ ] No robotic phrasing</step>
    <step order="3">Accessibility check:
      - [ ] Color contrast meets WCAG AA
      - [ ] Focus states visible
      - [ ] Keyboard navigation works</step>
    <step order="4">Cross-browser check:
      - [ ] Chrome: renders correctly
      - [ ] Safari: renders correctly
      - [ ] Firefox: renders correctly
      - [ ] Mobile Safari: renders correctly
      - [ ] Mobile Chrome: renders correctly</step>
    <step order="5">Apply any final polish fixes</step>
  </steps>

  <verification>
    <check type="manual">Design looks modern (would not be mistaken for "2015")</check>
    <check type="manual">Responses sound like real business communication</check>
    <check type="manual">Works on Chrome, Safari, Firefox</check>
    <check type="manual">Works on mobile (iOS, Android)</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-6" reason="Complete HTML file must exist for review" />
  </dependencies>

  <commit-message>style(playground): polish design and copy for launch

- Review and refine visual design
- Verify warm, natural response copy
- Test cross-browser compatibility
- Ensure accessibility basics

Refs: Risk Register (dated design concern)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

---

### Wave 4 (Sequential — Validation & Deployment)

Final validation and deployment to Cloudflare Pages.

```xml
<task-plan id="phase-1-task-9" wave="4">
  <title>Validate Scope Compliance</title>
  <requirement>REQ-048-050: Scope completeness, exclusions enforced, exit criteria</requirement>
  <description>Verify the implementation includes all MVP features and excludes all out-of-scope features per decisions.md.</description>

  <context>
    <file path="rounds/localgenius-interactive-demo/decisions.md" reason="Build Phase Authorization: scope definition" />
  </context>

  <steps>
    <step order="1">Verify MVP features present:
      - [ ] Single HTML file (not multiple files)
      - [ ] 3 business types (Dentist, Restaurant, Plumber)
      - [ ] Pre-populated chat with completed exchange
      - [ ] "Make This Real" CTA linking to WordPress.org
      - [ ] Page weight &lt;100KB</step>
    <step order="2">Verify out-of-scope features ABSENT:
      - [ ] No live AI (all responses are canned)
      - [ ] No user input handling (view-only chat)
      - [ ] No email capture
      - [ ] No analytics dashboards
      - [ ] No A/B testing
      - [ ] No additional business types beyond 3
      - [ ] No backend infrastructure</step>
    <step order="3">Verify no scope creep:
      - [ ] No features not in decisions.md
      - [ ] No "quick additions" that weren't planned</step>
    <step order="4">Document compliance status</step>
  </steps>

  <verification>
    <check type="bash">! grep -iE "email|subscribe|signup" deliverables/localgenius-interactive-demo/index.html &amp;&amp; echo "NO EMAIL CAPTURE PASS"</check>
    <check type="bash">! grep -iE "analytics|gtag|ga\(" deliverables/localgenius-interactive-demo/index.html &amp;&amp; echo "NO ANALYTICS PASS"</check>
    <check type="bash">grep -c "business-type" deliverables/localgenius-interactive-demo/index.html | awk '{print ($1 == 3 ? "3 BUSINESS TYPES PASS" : "CHECK BUSINESS TYPES: " $1)}'</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-7" reason="Final optimized file must exist" />
    <depends-on task-id="phase-1-task-8" reason="Polished file must be complete" />
  </dependencies>

  <commit-message>test(playground): validate scope compliance

- Verify all MVP features implemented
- Confirm out-of-scope features absent
- Document compliance with decisions.md
- Ready for deployment

Refs: Build Phase Authorization

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-10" wave="4">
  <title>Test WordPress.org Link</title>
  <requirement>REQ-010: CTA links to WordPress.org plugin page</requirement>
  <description>Verify the "Make This Real" button successfully navigates to the LocalGenius Lite plugin page on WordPress.org.</description>

  <context>
    <file path="rounds/localgenius-interactive-demo/decisions.md" reason="Risk Register: WordPress.org link breaks" />
  </context>

  <steps>
    <step order="1">Extract CTA link from HTML:
      ```bash
      grep -o 'href="https://wordpress.org/plugins/[^"]*"' index.html
      ```</step>
    <step order="2">Test link manually:
      - Open link in browser
      - Verify it loads the correct plugin page
      - Verify plugin exists and is active</step>
    <step order="3">If plugin not yet published:
      - Document this as a known issue
      - Use placeholder URL with tracking
      - Plan to update before marketing launch</step>
    <step order="4">Verify UTM parameters present:
      - utm_source=playground
      - utm_medium=demo
      - utm_campaign=cta</step>
  </steps>

  <verification>
    <check type="bash">grep -q "wordpress.org/plugins" deliverables/localgenius-interactive-demo/index.html &amp;&amp; echo "WP.ORG LINK PRESENT"</check>
    <check type="manual">Link opens WordPress.org plugin page successfully</check>
    <check type="manual">UTM parameters included in URL</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-9" reason="Scope validation must pass first" />
  </dependencies>

  <commit-message>test(playground): verify WordPress.org CTA link

- Test CTA button link
- Verify plugin page exists
- Confirm UTM tracking parameters

Refs: Risk Register (link breaks)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-11" wave="4">
  <title>Create README and Deploy</title>
  <requirement>REQ-042: Deployment instructions documented</requirement>
  <description>Create README.md with deployment instructions and deploy to Cloudflare Pages.</description>

  <context>
    <file path="rounds/localgenius-interactive-demo/decisions.md" reason="Deployment: Cloudflare Pages" />
  </context>

  <steps>
    <step order="1">Create README.md:
      ```markdown
      # LocalGenius Playground

      Static demo page for LocalGenius chat widget.

      ## Deployment

      ### Cloudflare Pages

      1. Create new Pages project
      2. Connect to GitHub repo or upload directly
      3. Set build command: (none - static files)
      4. Set output directory: /
      5. Deploy

      ### Custom Domain

      Configure DNS to point to Cloudflare Pages:
      - playground.localgenius.ai → Pages project

      ## Files

      - `index.html` - Single-file application
      ```</step>
    <step order="2">Deploy to Cloudflare Pages:
      - Create new Pages project
      - Upload deliverables/localgenius-interactive-demo/
      - Configure custom domain if ready</step>
    <step order="3">Test deployed site:
      - Verify all features work
      - Test on mobile
      - Verify CTA link works</step>
    <step order="4">Document live URL</step>
  </steps>

  <verification>
    <check type="bash">test -f deliverables/localgenius-interactive-demo/README.md &amp;&amp; echo "README EXISTS"</check>
    <check type="manual">Site accessible at Cloudflare Pages URL</check>
    <check type="manual">All features work on deployed site</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-10" reason="CTA link must be verified before deploy" />
  </dependencies>

  <commit-message>docs(playground): add README and deploy to Cloudflare Pages

- Create README.md with deployment instructions
- Deploy to Cloudflare Pages
- Document live URL
- Ready for homepage link

Refs: Deployment target

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-12" wave="4">
  <title>Sara Blakely Customer Gut-Check</title>
  <requirement>SKILL.md Step 7: Sara Blakely customer-value review</requirement>
  <description>Spawn Sara Blakely persona to gut-check the Playground from a small business owner's perspective. Does this make them say "shut up and take my money"?</description>

  <context>
    <file path=".planning/phase-1-plan.md" reason="This plan document" />
    <file path="rounds/localgenius-interactive-demo/decisions.md" reason="Original decisions and essence" />
    <file path="rounds/localgenius-interactive-demo/essence.md" reason="North star: belief before explanation" />
  </context>

  <steps>
    <step order="1">Review the deployed Playground from Maria's perspective:
      - Maria owns Maria's Kitchen in Austin
      - She's not tech-savvy (uses WordPress theme, needs zero-config)
      - She wants her website to answer "what are your hours?" while she sleeps</step>
    <step order="2">Answer honestly:
      - Would Maria actually click "Make This Real"?
      - What would make her say "shut up and take my money"?
      - What feels like engineering vanity vs. customer value?
      - Does she understand what she's seeing in 10 seconds?</step>
    <step order="3">Identify gaps in the customer journey:
      - First impression: Does it feel trustworthy?
      - Value clarity: Is it obvious what this does?
      - Call to action: Is "Make This Real" compelling?</step>
    <step order="4">Write findings to .planning/sara-blakely-review.md</step>
  </steps>

  <verification>
    <check type="bash">test -f .planning/sara-blakely-review.md &amp;&amp; echo "SARA REVIEW EXISTS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-11" reason="Deployed site must exist for review" />
  </dependencies>

  <commit-message>review(customer): Sara Blakely gut-check complete

- Reviewed from small business owner perspective
- Assessed customer value vs engineering vanity
- Identified first-impression and CTA clarity
- Documented findings for iteration

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

---

## Risk Notes

**From Risk Scanner Analysis:**

### Critical Risks (Mitigated in Plan)

| Risk | Likelihood | Impact | Mitigation Task |
|------|------------|--------|-----------------|
| RISK-001: Scope creep | HIGH | HIGH | phase-1-task-9 (scope validation) |
| RISK-002: Canned responses sound fake | MEDIUM | HIGH | phase-1-task-1 (specific details) |
| RISK-003: Visual design dated | LOW | HIGH | phase-1-task-8 (design polish) |
| RISK-004: Chat interactivity mismatch | MEDIUM | MEDIUM | phase-1-task-3 (view-only design) |
| RISK-005: WordPress.org link breaks | LOW | HIGH | phase-1-task-10 (link verification) |
| RISK-006: Mobile responsiveness | MEDIUM | MEDIUM | phase-1-task-4, phase-1-task-8 |
| RISK-007: Image size bloats | MEDIUM | MEDIUM | phase-1-task-7 (optimization) |

### Mitigation Strategies

1. **Scope Creep**: Lock decisions.md as contract; validate before deploy
2. **Fake Responses**: Include specific details (insurance names, hours, prices)
3. **Dated Design**: Use LocalGenius Lite color palette; modern typography
4. **Interactivity Confusion**: No input field visible; frame as "see how it works"
5. **Broken Link**: Test before deploy; document backup plan
6. **Mobile Issues**: Test on real devices; responsive CSS from start
7. **Size Bloat**: CSS-only storefronts; no large images

---

## Success Criteria

**Technical Criteria** (from decisions.md):
- [ ] Single HTML file with embedded CSS/JS
- [ ] Total page weight <100KB
- [ ] First paint <1s
- [ ] Interactive <1.5s
- [ ] Zero API calls / zero backend
- [ ] 3 business types only

**UX Criteria** (from essence.md):
- [ ] Chat shows conversation already in progress
- [ ] "Make This Real" CTA is prominent
- [ ] No loading spinners
- [ ] No empty states
- [ ] Modern visual design (not "2015")

**Business Criteria**:
- [ ] Demo is live on Cloudflare Pages
- [ ] CTA links to WordPress.org plugin
- [ ] Ready to link from homepage

---

## Execution Checklist

```
[ ] Wave 1: Content & Design (parallel)
    [ ] phase-1-task-1: Write 15 canned responses
    [ ] phase-1-task-2: Create design system & wireframe

[ ] Wave 2: Core Implementation (parallel)
    [ ] phase-1-task-3: Build chat widget with pre-populated conversation
    [ ] phase-1-task-4: Build storefront visual component
    [ ] phase-1-task-5: Implement "Make This Real" CTA

[ ] Wave 3: Integration & Optimization (sequential)
    [ ] phase-1-task-6: Assemble single HTML file
    [ ] phase-1-task-7: Optimize for performance targets
    [ ] phase-1-task-8: Polish design & copy

[ ] Wave 4: Validation & Deployment (sequential)
    [ ] phase-1-task-9: Validate scope compliance
    [ ] phase-1-task-10: Test WordPress.org link
    [ ] phase-1-task-11: Create README and deploy
    [ ] phase-1-task-12: Sara Blakely customer gut-check
```

---

## Files Created by This Plan

| File | Path | Purpose |
|------|------|---------|
| index.html | `deliverables/localgenius-interactive-demo/index.html` | Single-file application |
| README.md | `deliverables/localgenius-interactive-demo/README.md` | Deployment instructions |
| sara-blakely-review.md | `.planning/sara-blakely-review.md` | Customer gut-check |

---

## Document Trail

- **Requirements**: `.planning/REQUIREMENTS.md`
- **Decisions**: `rounds/localgenius-interactive-demo/decisions.md`
- **Essence**: `rounds/localgenius-interactive-demo/essence.md`
- **Project Rules**: `CLAUDE.md`
- **Reference Code**: `deliverables/localgenius-lite/localgenius/assets/`

---

## Technical Reference: Patterns from LocalGenius Lite

### Chat Widget Color Palette (from chat-widget.css)
```css
:root {
  --lg-primary: #2271b1;
  --lg-primary-hover: #135e96;
  --lg-bg: #fff;
  --lg-bg-light: #f8f9fa;
  --lg-text: #1e1e1e;
  --lg-text-secondary: #646970;
  --lg-border: #e2e4e7;
}
```

### Chat Widget Structure (from chat-widget.js)
```javascript
// IIFE pattern - no global pollution
(function() {
  const config = window.localGeniusConfig || {};

  // Create DOM elements
  const widget = document.createElement('div');
  widget.innerHTML = `
    <div class="lg-chat-bubble">...</div>
    <div class="lg-chat-window">
      <div class="lg-chat-header">...</div>
      <div class="lg-chat-messages">...</div>
    </div>
  `;

  // Event handlers
  // Toggle, keyboard, click-outside
})();
```

### FAQ Data Format (reference)
```json
{
  "business_type": "dentist",
  "display_name": "Dental Practice",
  "faqs": [
    { "question": "...", "answer": "..." }
  ]
}
```

---

**Plan Status**: READY FOR EXECUTION
**Estimated Duration**: 4-6 hours focused session
**Parallel Tasks**: Wave 1 (2 tasks), Wave 2 (3 tasks)
**Sequential Blocks**: Wave 3 (3 tasks), Wave 4 (4 tasks)

---

*Plan generated by Great Minds Agency — Phase Planning Agent (GSD-Style)*
*Cross-referenced against: CLAUDE.md (project rules), decisions.md (locked decisions), SKILL.md (planning methodology)*
*Reference patterns from LocalGenius Lite codebase*

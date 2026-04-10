# Phase 1 Plan — LocalGenius Lite WordPress Plugin

**Generated**: 2025-04-09
**Requirements**: `.planning/REQUIREMENTS.md`
**Decisions**: `rounds/localgenius-lite/decisions.md`
**Total Tasks**: 16
**Waves**: 4
**Timeline**: 8 hours focused session (per decisions.md estimate)
**Project Slug**: `localgenius-lite`

---

## Executive Summary

LocalGenius Lite is a zero-configuration AI chat widget for small business WordPress sites. This plan completes the v1 implementation by building the missing components identified by the Codebase Scout.

**What Already Exists** (from `/Users/sethshoultes/Local Sites/great-minds/deliverables/localgenius-lite/localgenius/`):
- Core plugin scaffold (localgenius.php - 166 lines)
- REST API handler (class-api-handler.php - 226 lines)
- Homepage scanner (class-scanner.php - 186 lines)
- FAQ template loader (class-faq-templates.php - 122 lines)
- Widget registration (class-widget.php - 66 lines)
- Uninstall handler (uninstall.php - 34 lines)
- 8 of 10 FAQ templates (dentist, fitness, lawyer, mechanic, plumber, realtor, restaurant, salon)

**What Must Be Built**:
- Admin settings page (class-admin.php + settings-page.php + admin.css)
- Chat widget frontend (chat-widget.js + chat-widget.css)
- Cloudflare Worker backend (worker.js + cache.js + prompts.js + wrangler.toml)
- 2 missing FAQ templates (retail.json, general.json)
- WordPress.org readme.txt

**The One Thing That Must Be Perfect** (from decisions.md):
> "The first answer. If the widget can't nail 'what are your hours?' instantly, nothing else matters."

---

## Requirements Traceability

| Requirement | Task(s) | Wave |
|-------------|---------|------|
| REQ-002, REQ-003: Business Type + Location | phase-1-task-1 | 1 |
| REQ-004, REQ-031, REQ-032: Admin Settings Page | phase-1-task-1 | 1 |
| REQ-023: Missing FAQ Templates | phase-1-task-2 | 1 |
| REQ-026, REQ-027: Chat Widget Frontend | phase-1-task-3 | 2 |
| REQ-009, REQ-029, REQ-030, REQ-035: Widget UX | phase-1-task-3 | 2 |
| REQ-014, REQ-015: Cloudflare Worker + Workers AI | phase-1-task-4 | 2 |
| REQ-016, REQ-017: Caching Layer | phase-1-task-5 | 2 |
| REQ-018: System Prompts | phase-1-task-6 | 2 |
| REQ-019, REQ-020, REQ-021: Worker Rate Limiting | phase-1-task-7 | 2 |
| REQ-047, REQ-048: WordPress.org Documentation | phase-1-task-8 | 3 |
| REQ-011: SSL Verification Fix | phase-1-task-9 | 3 |
| REQ-036-046: Testing & Validation | phase-1-task-10 through phase-1-task-14 | 4 |
| SKILL.md Step 7: Sara Blakely Review | phase-1-task-15 | 4 |

---

## Wave Execution Order

### Wave 1 (Parallel — Foundation & Content)

These tasks complete the WordPress plugin admin interface and missing FAQ templates.

```xml
<task-plan id="phase-1-task-1" wave="1">
  <title>Build Admin Settings Page</title>
  <requirement>REQ-002, REQ-003, REQ-004, REQ-031, REQ-032: Minimal admin settings with business type, location, preview</requirement>
  <description>Create the single minimal admin settings page per Decision 13. Users select business type from dropdown, enter location, and see widget preview. No extra options.</description>

  <context>
    <file path="deliverables/localgenius-lite/localgenius/localgenius.php" reason="Main plugin file with existing hooks and constants" />
    <file path="deliverables/localgenius-lite/localgenius/includes/class-faq-templates.php" reason="BUSINESS_TYPES constant for dropdown options" />
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 13: One minimal settings screen" />
  </context>

  <steps>
    <step order="1">Create `admin/class-admin.php` with LocalGenius_Admin class:
      - Hook into `admin_menu` to add settings page under Settings
      - Hook into `admin_init` to register settings
      - Save to wp_options: localgenius_business_type, localgenius_location, localgenius_additional_info</step>
    <step order="2">Create `admin/views/settings-page.php` with minimal UI:
      - Business type dropdown (10 types from BUSINESS_TYPES constant)
      - Location text field (placeholder: "Austin, TX")
      - "Anything else we should know?" textarea (optional)
      - Save button with nonce verification
      - Widget preview iframe showing frontend widget</step>
    <step order="3">Create `admin/css/admin.css` with clean WordPress-native styling:
      - Use WordPress admin color palette
      - Minimal, professional layout
      - Preview area styled as device frame</step>
    <step order="4">Update localgenius.php to load admin class on admin_init</step>
    <step order="5">Add settings link on plugins page (plugin_action_links filter)</step>
  </steps>

  <verification>
    <check type="manual">Settings page loads at /wp-admin/options-general.php?page=localgenius</check>
    <check type="manual">All 10 business types appear in dropdown</check>
    <check type="manual">Values persist after save</check>
    <check type="bash">test -f deliverables/localgenius-lite/localgenius/admin/class-admin.php</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies - foundation task -->
  </dependencies>

  <commit-message>feat(admin): add minimal settings page with business type selector

- Add class-admin.php with settings registration
- Add settings-page.php with dropdown, location, preview
- Add admin.css with WordPress-native styling
- Wire up to main plugin file

Refs: Decision 13 (minimal settings screen)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-2" wave="1">
  <title>Create Missing FAQ Templates</title>
  <requirement>REQ-022, REQ-023, REQ-025: Complete 10 business type templates</requirement>
  <description>Create retail.json and general.json FAQ templates. Each must have 15 Q&As in warm, conversational voice matching existing template format.</description>

  <context>
    <file path="deliverables/localgenius-lite/localgenius/templates/faq/restaurant.json" reason="Template format reference" />
    <file path="deliverables/localgenius-lite/localgenius/includes/class-faq-templates.php" reason="BUSINESS_TYPES constant includes retail, general" />
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 12: Warm voice, never robotic" />
  </context>

  <steps>
    <step order="1">Create `templates/faq/retail.json` with 15 Q&As for Retail Store:
      - Store hours and holiday schedule
      - Return/exchange policy
      - Payment methods accepted
      - Parking availability
      - Online ordering/pickup
      - Gift cards
      - Loyalty/rewards programs
      - Sales/promotions
      - Special orders
      - Delivery options
      Use warm voice: "Yep, we're open Sundays too!" not "We are open on Sundays."</step>
    <step order="2">Create `templates/faq/general.json` with 15 universal Q&As:
      - Business hours
      - Contact information
      - Location/directions
      - Appointment scheduling
      - Payment methods
      - Cancellation policy
      - Emergency contact
      - Accessibility
      - Parking
      - Holiday schedule
      This is fallback for unlisted business types.</step>
    <step order="3">Validate JSON syntax for both files</step>
    <step order="4">Verify templates load via class-faq-templates.php get_faqs() method</step>
  </steps>

  <verification>
    <check type="bash">test -f deliverables/localgenius-lite/localgenius/templates/faq/retail.json &amp;&amp; echo "retail.json exists"</check>
    <check type="bash">test -f deliverables/localgenius-lite/localgenius/templates/faq/general.json &amp;&amp; echo "general.json exists"</check>
    <check type="bash">python3 -c "import json; json.load(open('deliverables/localgenius-lite/localgenius/templates/faq/retail.json'))" &amp;&amp; echo "retail.json valid"</check>
    <check type="bash">python3 -c "import json; json.load(open('deliverables/localgenius-lite/localgenius/templates/faq/general.json'))" &amp;&amp; echo "general.json valid"</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies - content task -->
  </dependencies>

  <commit-message>content(faq): add retail and general business FAQ templates

- Add retail.json with 15 Q&As for retail stores
- Add general.json as universal fallback template
- Both use warm, conversational voice per Decision 12

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

---

### Wave 2 (Parallel — Core Implementation)

These tasks build the chat widget frontend and Cloudflare Worker backend in parallel.

```xml
<task-plan id="phase-1-task-3" wave="2">
  <title>Build Chat Widget Frontend</title>
  <requirement>REQ-026, REQ-027, REQ-009, REQ-028, REQ-029, REQ-030, REQ-035: Vanilla JS widget with GDPR consent</requirement>
  <description>Create the beautiful, single-design chat widget in vanilla JavaScript. Fixed bottom-right, no customization, no AI branding, includes GDPR consent checkbox and "Powered by" link.</description>

  <context>
    <file path="deliverables/localgenius-lite/localgenius/includes/class-widget.php" reason="Widget registration and config output" />
    <file path="deliverables/localgenius-lite/localgenius/includes/class-api-handler.php" reason="REST endpoint to call" />
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 7 (one beautiful widget), Decision 8 (no AI branding), Decision 11 (Powered by link)" />
  </context>

  <steps>
    <step order="1">Create `assets/css/chat-widget.css`:
      - Fixed position bottom-right (20px margin)
      - Chat bubble button (50px circle, subtle shadow)
      - Chat window (350px wide, 450px tall max)
      - Message bubbles (user right, bot left)
      - Input field with send button
      - GDPR consent checkbox styling
      - "Powered by LocalGenius" footer link (subtle, 10px text)
      - 200ms fade-up animation for window
      - Mobile responsive (full width on &lt;500px screens)
      - No AI/robot imagery</step>
    <step order="2">Create `assets/js/chat-widget.js` (~200 lines, &lt;8kb):
      - Self-contained IIFE with no global pollution
      - Config from localGeniusConfig (wp_localize_script)
      - Toggle chat window on bubble click
      - GDPR consent checkbox before first message
      - Send question via fetch to /wp-json/localgenius/v1/chat
      - Display response with typing indicator
      - Rate limit display ("X questions remaining")
      - Error handling with warm fallback messages
      - Keyboard: Enter to submit, Escape to close
      - ARIA labels on all interactive elements
      - No jQuery dependency</step>
    <step order="3">Update class-widget.php get_widget_config() to include:
      - REST API URL
      - Nonce for authentication
      - Business name for personalization
      - Phone number for fallback messages
      - Rate limit remaining count
      - "Powered by" link URL</step>
    <step order="4">Test widget loads without jQuery on clean WordPress install</step>
    <step order="5">Verify no "AI", "chatbot", or robot icons in UI (Decision 8 compliance)</step>
  </steps>

  <verification>
    <check type="bash">wc -c deliverables/localgenius-lite/localgenius/assets/js/chat-widget.js | awk '{print ($1 &lt; 8192 ? "PASS: &lt;8kb" : "FAIL: &gt;8kb")}'</check>
    <check type="bash">! grep -iE "AI|chatbot|robot" deliverables/localgenius-lite/localgenius/assets/js/chat-widget.js &amp;&amp; echo "NO AI BRANDING PASS"</check>
    <check type="bash">grep -q "aria-label" deliverables/localgenius-lite/localgenius/assets/js/chat-widget.js &amp;&amp; echo "ARIA LABELS PASS"</check>
    <check type="manual">Widget appears bottom-right; responsive on mobile</check>
    <check type="manual">GDPR checkbox blocks first message until checked</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Admin must save business type for widget config" />
  </dependencies>

  <commit-message>feat(widget): add beautiful chat widget frontend

- Add chat-widget.css with fixed bottom-right position
- Add chat-widget.js in vanilla JS (&lt;8kb, ~200 lines)
- Implement GDPR consent checkbox
- Add "Powered by LocalGenius" subtle footer link
- Add ARIA labels for accessibility
- No jQuery dependency; no AI branding

Refs: Decision 7, 8, 11

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-4" wave="2">
  <title>Create Cloudflare Worker Entry Point</title>
  <requirement>REQ-014, REQ-015: Worker with Llama 3.1 8B via Workers AI</requirement>
  <description>Create the main Cloudflare Worker that handles /api/chat requests and calls Llama 3.1 8B via Workers AI. Single LLM path only per Decision 2.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 2: Single LLM path - Llama 3.1 8B only via Cloudflare Workers AI" />
    <file path="engineering/tech-stack.md" reason="AI provider patterns reference (note: tech-stack references Anthropic Claude for LocalGenius SaaS, but Lite uses Llama per decisions.md)" />
    <file path="engineering/infrastructure.md" reason="Infrastructure patterns reference" />
  </context>

  <steps>
    <step order="1">Create `cloudflare-worker/wrangler.toml`:
      - Name: localgenius-lite
      - Main: worker.js
      - Compatibility date: 2024-01-01
      - Bind KV namespace: CACHE (for question caching)
      - Bind AI: Workers AI (for Llama access)</step>
    <step order="2">Create `cloudflare-worker/worker.js`:
      - Export default fetch handler
      - Route POST /api/chat to handleChat()
      - Parse JSON body: question, businessType, location, siteId, businessName, phone, faqContext
      - Import cache.js for caching logic
      - Import prompts.js for system prompts
      - Call Workers AI with @cf/meta/llama-3.1-8b-instruct
      - Return JSON: { answer, source: 'llm'|'cached', timestamp }
      - Error handling with graceful fallback</step>
    <step order="3">Implement handleChat function:
      - Check cache first (import from cache.js)
      - If cache hit, return cached response with source: 'cached'
      - If cache miss, call Llama 3.1 8B
      - Build system prompt from prompts.js based on businessType
      - Include faqContext in prompt
      - Parse and validate LLM response
      - Store in cache before returning
      - Timeout: 3 seconds max, fallback on timeout</step>
    <step order="4">Add CORS headers for WordPress REST API calls</step>
    <step order="5">Test Worker locally with wrangler dev</step>
  </steps>

  <verification>
    <check type="bash">test -f deliverables/localgenius-lite/cloudflare-worker/worker.js &amp;&amp; echo "worker.js exists"</check>
    <check type="bash">test -f deliverables/localgenius-lite/cloudflare-worker/wrangler.toml &amp;&amp; echo "wrangler.toml exists"</check>
    <check type="bash">grep -q "@cf/meta/llama-3.1-8b-instruct" deliverables/localgenius-lite/cloudflare-worker/worker.js &amp;&amp; echo "LLAMA MODEL PASS"</check>
    <check type="bash">! grep -iE "claude|anthropic|openai|gpt" deliverables/localgenius-lite/cloudflare-worker/worker.js &amp;&amp; echo "NO HYBRID AI PASS"</check>
  </verification>

  <dependencies>
    <!-- Wave 2: No dependencies within wave - can run parallel -->
  </dependencies>

  <commit-message>feat(worker): create Cloudflare Worker with Llama 3.1 8B

- Add worker.js with /api/chat endpoint
- Configure wrangler.toml with Workers AI binding
- Use @cf/meta/llama-3.1-8b-instruct (single LLM path)
- Add CORS headers for WordPress REST API
- Implement 3-second timeout with graceful fallback

Refs: Decision 2 (single LLM, no hybrid)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-5" wave="2">
  <title>Implement Question Caching Layer</title>
  <requirement>REQ-016, REQ-017: Hash-based caching with 24h TTL, 80% hit rate target</requirement>
  <description>Create cache.js with question normalization and KV-based caching. Cache before LLM per Decision 6.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 6: Cache before LLM - always; 24h TTL" />
  </context>

  <steps>
    <step order="1">Create `cloudflare-worker/cache.js`:
      - Export normalizeQuestion(question): lowercase, strip punctuation, collapse whitespace
      - Export hashQuestion(normalized): SHA-256 hash for cache key
      - Export getCached(env, siteId, questionHash): check KV for cached response
      - Export setCached(env, siteId, questionHash, response): store with 24h TTL
      - Build cache key: `${siteId}:${questionHash}`</step>
    <step order="2">Implement question normalization:
      - Convert to lowercase
      - Remove punctuation except apostrophes
      - Collapse multiple spaces to single
      - Trim whitespace
      - Map common variations: "hours?" → "what are your hours"</step>
    <step order="3">Implement canonical question mapping:
      - Hours variations: "when open", "hours?", "what time", "are you open"
      - Location variations: "where", "address", "directions", "how to find"
      - Contact variations: "phone", "call", "contact", "reach"
      - Parking variations: "parking", "where to park"</step>
    <step order="4">KV storage with 24h TTL (86400 seconds)</step>
    <step order="5">Add cache hit/miss logging for metrics</step>
  </steps>

  <verification>
    <check type="bash">test -f deliverables/localgenius-lite/cloudflare-worker/cache.js &amp;&amp; echo "cache.js exists"</check>
    <check type="bash">grep -q "86400" deliverables/localgenius-lite/cloudflare-worker/cache.js &amp;&amp; echo "24H TTL PASS"</check>
    <check type="bash">grep -q "normalizeQuestion" deliverables/localgenius-lite/cloudflare-worker/cache.js &amp;&amp; echo "NORMALIZE FN PASS"</check>
  </verification>

  <dependencies>
    <!-- Wave 2: No dependencies within wave -->
  </dependencies>

  <commit-message>feat(worker): add question caching layer with 24h TTL

- Add cache.js with question normalization
- Implement hash-based cache keys per site
- Set 24-hour TTL per Decision 6
- Map canonical question variations
- Add cache hit/miss logging

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-6" wave="2">
  <title>Create System Prompts by Business Type</title>
  <requirement>REQ-018: Warm, human tone prompts per business type</requirement>
  <description>Create prompts.js with system prompts for each business type. Voice must be warm, conversational, never robotic per Decision 12.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 12: Human, warm, never robotic voice" />
    <file path="deliverables/localgenius-lite/localgenius/templates/faq/" reason="FAQ templates inform prompt context" />
  </context>

  <steps>
    <step order="1">Create `cloudflare-worker/prompts.js`:
      - Export getSystemPrompt(businessType, businessName, phone, location, faqContext)
      - Base prompt template with voice guidelines
      - Per-business-type variations (10 types)</step>
    <step order="2">Implement base system prompt:
      - "You are the helpful voice of [businessName], a [businessType] in [location]."
      - "Answer questions about the business using ONLY the FAQ context provided."
      - "If you don't know the answer from the FAQ, say 'I'd recommend calling us directly at [phone] for that.'"
      - "Use warm, friendly language. You're the business owner on their best day."
      - "Never use corporate language. Never mention AI or that you're a chatbot."</step>
    <step order="3">Add professional-neutral variant for sensitive industries:
      - lawyer: More formal but still warm
      - Add medical/funeral home variants if needed (professional-neutral)</step>
    <step order="4">Add example responses per business type:
      - Restaurant: "Yep! We're here 9-5 on Saturdays."
      - Lawyer: "We'd be glad to discuss that. Our office hours are 9-5 weekdays."</step>
    <step order="5">Test prompts don't contain "AI", "chatbot", "robot" language</step>
  </steps>

  <verification>
    <check type="bash">test -f deliverables/localgenius-lite/cloudflare-worker/prompts.js &amp;&amp; echo "prompts.js exists"</check>
    <check type="bash">grep -q "getSystemPrompt" deliverables/localgenius-lite/cloudflare-worker/prompts.js &amp;&amp; echo "EXPORT FN PASS"</check>
    <check type="bash">! grep -iE "\bAI\b|chatbot|robot" deliverables/localgenius-lite/cloudflare-worker/prompts.js &amp;&amp; echo "NO AI LANGUAGE PASS"</check>
    <check type="bash">grep -q "warm\|friendly\|helpful" deliverables/localgenius-lite/cloudflare-worker/prompts.js &amp;&amp; echo "WARM VOICE PASS"</check>
  </verification>

  <dependencies>
    <!-- Wave 2: No dependencies within wave -->
  </dependencies>

  <commit-message>feat(worker): add warm system prompts per business type

- Add prompts.js with getSystemPrompt() function
- Implement warm, human voice guidelines
- Add professional-neutral variant for lawyers
- Include FAQ context injection
- No AI/chatbot/robot language anywhere

Refs: Decision 12

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-7" wave="2">
  <title>Implement Worker Rate Limiting</title>
  <requirement>REQ-019, REQ-020, REQ-021: 3s timeout, IP throttling, per-site cap</requirement>
  <description>Add rate limiting at Worker level: 3-second timeout with graceful fallback, IP-based throttling, and per-site monthly cap enforcement.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Section 5 Risk Mitigation: Rate limiting requirements" />
    <file path="deliverables/localgenius-lite/cloudflare-worker/worker.js" reason="Main worker to add rate limiting" />
  </context>

  <steps>
    <step order="1">Add rate limiting utilities to worker.js:
      - getRateLimitKey(siteId, month): `ratelimit:${siteId}:${month}`
      - checkRateLimit(env, siteId): return { allowed, remaining, limit }
      - incrementRateLimit(env, siteId): increment counter with 32-day TTL</step>
    <step order="2">Implement per-site monthly cap:
      - Default limit: 100 questions/month
      - Store count in KV: `ratelimit:${siteId}:2025-04` → counter
      - Return 429 with warm message when exceeded
      - Message: "We've reached our monthly limit. Please call us at [phone] or check back next month!"</step>
    <step order="3">Implement IP-based throttling:
      - Max 1 request per 2 seconds per IP
      - Store in KV: `ip:${clientIP}` → timestamp
      - Return 429 with brief message if exceeded</step>
    <step order="4">Implement 3-second timeout:
      - Wrap Workers AI call in Promise.race with 3000ms timeout
      - On timeout: return fallback message with phone number
      - Fallback message: "I'd recommend calling us directly at [phone] for this one."</step>
    <step order="5">Add rate limit headers to response:
      - X-RateLimit-Remaining: count
      - X-RateLimit-Limit: 100</step>
  </steps>

  <verification>
    <check type="bash">grep -q "429" deliverables/localgenius-lite/cloudflare-worker/worker.js &amp;&amp; echo "RATE LIMIT 429 PASS"</check>
    <check type="bash">grep -q "3000\|3 \* 1000" deliverables/localgenius-lite/cloudflare-worker/worker.js &amp;&amp; echo "3S TIMEOUT PASS"</check>
    <check type="bash">grep -q "X-RateLimit" deliverables/localgenius-lite/cloudflare-worker/worker.js &amp;&amp; echo "HEADERS PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-4" reason="Worker base must exist" />
  </dependencies>

  <commit-message>feat(worker): add rate limiting with 3s timeout

- Implement per-site monthly cap (100 questions/month)
- Add IP-based throttling (1 req/2s per IP)
- Add 3-second timeout with graceful phone fallback
- Include X-RateLimit headers in response
- Warm, human error messages

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

---

### Wave 3 (Sequential — Documentation & Fixes)

These tasks complete documentation and fix known issues.

```xml
<task-plan id="phase-1-task-8" wave="3">
  <title>Create WordPress.org readme.txt</title>
  <requirement>REQ-047, REQ-048: SEO-optimized readme with external API documentation</requirement>
  <description>Create readme.txt following WordPress.org format. Optimize for search keywords and clearly document Cloudflare Workers AI dependency.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 10: Distribution strategy keywords" />
  </context>

  <steps>
    <step order="1">Create `readme.txt` with WordPress.org format:
      - Plugin name, contributors, tags
      - Requires at least: 6.0
      - Tested up to: 6.5
      - Requires PHP: 8.0
      - Stable tag: 1.0.0
      - License: GPLv2 or later</step>
    <step order="2">Write SEO-optimized description (per Decision 10):
      - Primary keywords: "FAQ plugin", "customer chat", "automatic FAQ", "chat widget small business"
      - Avoid: "AI chatbot" (per Decision 8 - no AI branding)
      - Focus on benefit: "Answer customer questions 24/7"</step>
    <step order="3">Document external API dependency:
      - Section: "External Services"
      - Explain: "This plugin sends questions to LocalGenius servers for processing"
      - Privacy: "Questions are used only to generate answers; no personal data is stored"
      - Link to privacy policy</step>
    <step order="4">Add installation instructions:
      - Upload and activate
      - Go to Settings → LocalGenius
      - Select business type
      - Widget appears on frontend automatically</step>
    <step order="5">Add FAQ section with common questions</step>
    <step order="6">Add changelog for v1.0.0</step>
  </steps>

  <verification>
    <check type="bash">test -f deliverables/localgenius-lite/localgenius/readme.txt &amp;&amp; echo "readme.txt exists"</check>
    <check type="bash">grep -q "External Services\|external" deliverables/localgenius-lite/localgenius/readme.txt &amp;&amp; echo "EXTERNAL API DOC PASS"</check>
    <check type="bash">grep -q "GPLv2" deliverables/localgenius-lite/localgenius/readme.txt &amp;&amp; echo "LICENSE PASS"</check>
    <check type="bash">! grep -iE "\bAI\b|chatbot" deliverables/localgenius-lite/localgenius/readme.txt &amp;&amp; echo "NO AI BRANDING PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Admin features must be documented" />
    <depends-on task-id="phase-1-task-3" reason="Widget features must be documented" />
  </dependencies>

  <commit-message>docs: add WordPress.org readme.txt with SEO keywords

- Follow WordPress.org readme format
- Optimize for FAQ/chat/small business keywords
- Document external Cloudflare Workers AI dependency
- Add installation and FAQ sections
- No AI branding per Decision 8

Refs: Decision 10 (distribution strategy)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-9" wave="3">
  <title>Fix SSL Verification in Scanner</title>
  <requirement>REQ-011: Enable SSL verify in production, document local dev workaround</requirement>
  <description>Fix the known SSL verification issue in class-scanner.php. Enable SSL verify for production; add constant override for local development.</description>

  <context>
    <file path="deliverables/localgenius-lite/localgenius/includes/class-scanner.php" reason="Contains 'sslverify' => false" />
    <file path="rounds/localgenius-lite/decisions.md" reason="Section 4, Open Question 5: SSL verification" />
  </context>

  <steps>
    <step order="1">Update class-scanner.php fetch_homepage():
      - Change `'sslverify' => false` to `'sslverify' => true` by default
      - Add constant check: `defined('LOCALGENIUS_DISABLE_SSL_VERIFY') &amp;&amp; LOCALGENIUS_DISABLE_SSL_VERIFY`
      - If constant is true (local dev), disable SSL verify</step>
    <step order="2">Add graceful error handling for SSL failures:
      - Catch SSL errors in extraction
      - Return empty data instead of failing
      - Log error for debugging</step>
    <step order="3">Update localgenius.php with documentation comment:
      - Explain LOCALGENIUS_DISABLE_SSL_VERIFY constant
      - Show example for wp-config.php</step>
    <step order="4">Test on HTTPS site to verify extraction works with SSL verify enabled</step>
  </steps>

  <verification>
    <check type="bash">grep -q "'sslverify' => true" deliverables/localgenius-lite/localgenius/includes/class-scanner.php &amp;&amp; echo "SSL VERIFY ENABLED PASS"</check>
    <check type="bash">grep -q "LOCALGENIUS_DISABLE_SSL_VERIFY" deliverables/localgenius-lite/localgenius/includes/class-scanner.php &amp;&amp; echo "DEV OVERRIDE PASS"</check>
  </verification>

  <dependencies>
    <!-- Wave 3: No dependencies - fix task -->
  </dependencies>

  <commit-message>fix(scanner): enable SSL verification in production

- Change sslverify default to true
- Add LOCALGENIUS_DISABLE_SSL_VERIFY constant for local dev
- Add graceful error handling for SSL failures
- Document override in localgenius.php

Refs: Open Question 5

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

---

### Wave 4 (Sequential — Validation)

Final verification tasks to ensure quality.

```xml
<task-plan id="phase-1-task-10" wave="4">
  <title>Validate FAQ Templates</title>
  <requirement>REQ-036: All 10 templates load correctly with valid JSON</requirement>
  <description>Run validation checks on all 10 FAQ templates to ensure they parse correctly and contain required fields.</description>

  <context>
    <file path="deliverables/localgenius-lite/localgenius/templates/faq/" reason="All FAQ template files" />
    <file path="deliverables/localgenius-lite/localgenius/includes/class-faq-templates.php" reason="Template loading logic" />
  </context>

  <steps>
    <step order="1">Verify all 10 template files exist:
      - dentist.json, fitness.json, lawyer.json, mechanic.json
      - plumber.json, realtor.json, restaurant.json, salon.json
      - retail.json, general.json</step>
    <step order="2">Validate JSON syntax for each file</step>
    <step order="3">Verify each template has required fields:
      - business_type (string)
      - display_name (string)
      - faqs (array of 12-15 Q&As)
      - Each FAQ has question and answer strings</step>
    <step order="4">Verify warm voice in answers (spot check)</step>
    <step order="5">Test class-faq-templates.php get_faqs() returns correct template for each type</step>
  </steps>

  <verification>
    <check type="bash">ls deliverables/localgenius-lite/localgenius/templates/faq/*.json | wc -l | awk '{print ($1 == 10 ? "10 TEMPLATES PASS" : "TEMPLATE COUNT FAIL: " $1)}'</check>
    <check type="bash">for f in deliverables/localgenius-lite/localgenius/templates/faq/*.json; do python3 -c "import json; json.load(open('$f'))" || echo "FAIL: $f"; done</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-2" reason="Missing templates must be created first" />
  </dependencies>

  <commit-message>test(faq): validate all 10 FAQ templates

- Verify all template files exist
- Validate JSON syntax
- Check required fields present
- Spot-check warm voice in answers

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-11" wave="4">
  <title>Validate No AI Branding</title>
  <requirement>REQ-028: Zero "AI", "chatbot", "robot" mentions in UI</requirement>
  <description>Run comprehensive grep checks to ensure no AI branding exists anywhere in user-facing code.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 8: No AI anywhere in UI" />
  </context>

  <steps>
    <step order="1">Grep all PHP files for AI branding:
      - Search: \bAI\b, chatbot, robot, artificial intelligence
      - Exclude: comments, developer docs</step>
    <step order="2">Grep all JS files for AI branding</step>
    <step order="3">Grep all CSS files for class names containing AI/bot</step>
    <step order="4">Check admin settings page text</step>
    <step order="5">Check widget UI text and labels</step>
    <step order="6">Check readme.txt description</step>
    <step order="7">Document any findings and fix</step>
  </steps>

  <verification>
    <check type="bash">! grep -riE "\bAI\b|chatbot|robot" deliverables/localgenius-lite/localgenius/assets/ &amp;&amp; echo "ASSETS NO AI PASS"</check>
    <check type="bash">! grep -riE "\bAI\b|chatbot" deliverables/localgenius-lite/localgenius/admin/ &amp;&amp; echo "ADMIN NO AI PASS"</check>
    <check type="bash">! grep -iE "\bAI\b|chatbot" deliverables/localgenius-lite/localgenius/readme.txt &amp;&amp; echo "README NO AI PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-3" reason="Widget must be complete" />
    <depends-on task-id="phase-1-task-8" reason="Readme must be complete" />
  </dependencies>

  <commit-message>test(compliance): verify zero AI branding in UI

- Grep check all PHP/JS/CSS for AI/chatbot/robot
- Verify admin page text
- Verify widget UI text
- Verify readme.txt description
- Decision 8 compliance confirmed

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-12" wave="4">
  <title>WordPress Plugin Checker Validation</title>
  <requirement>REQ-046: Plugin meets WordPress.org standards</requirement>
  <description>Run WordPress.org plugin checker and fix any reported issues before submission.</description>

  <context>
    <file path="deliverables/localgenius-lite/localgenius/" reason="Complete plugin directory" />
  </context>

  <steps>
    <step order="1">Run security checks:
      - No eval() usage
      - No unescaped outputs (esc_html, esc_attr, esc_url used)
      - No deprecated WordPress functions
      - Proper nonce verification on forms</step>
    <step order="2">Run code quality checks:
      - All functions prefixed with localgenius_
      - All classes prefixed with LocalGenius_
      - No unprefixed globals</step>
    <step order="3">Run file structure checks:
      - readme.txt exists and follows format
      - Main plugin file has required headers
      - License is GPL v2 or later</step>
    <step order="4">Fix any issues found</step>
    <step order="5">Document readiness status</step>
  </steps>

  <verification>
    <check type="bash">! grep -r "eval(" deliverables/localgenius-lite/localgenius/*.php &amp;&amp; echo "NO EVAL PASS"</check>
    <check type="bash">grep -q "License: GPLv2" deliverables/localgenius-lite/localgenius/localgenius.php &amp;&amp; echo "LICENSE HEADER PASS"</check>
    <check type="bash">grep -q "Text Domain: localgenius" deliverables/localgenius-lite/localgenius/localgenius.php &amp;&amp; echo "TEXT DOMAIN PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-8" reason="Readme must exist" />
    <depends-on task-id="phase-1-task-1" reason="Admin code must be complete" />
  </dependencies>

  <commit-message>test(compliance): validate WordPress.org submission readiness

- Check for eval() and unescaped outputs
- Verify function/class prefixing
- Validate readme.txt format
- Confirm GPL v2 license

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-13" wave="4">
  <title>End-to-End Flow Testing</title>
  <requirement>REQ-044: Test all failure modes with warm messages</requirement>
  <description>Test the complete flow from widget interaction through Worker response, including all error states.</description>

  <context>
    <file path="deliverables/localgenius-lite/localgenius/" reason="Complete plugin" />
    <file path="deliverables/localgenius-lite/cloudflare-worker/" reason="Complete Worker" />
  </context>

  <steps>
    <step order="1">Test happy path:
      - User clicks widget bubble
      - GDPR checkbox appears
      - User checks consent, types "what are your hours?"
      - Response appears with correct business type template</step>
    <step order="2">Test cache hit:
      - Same question asked twice
      - Second response faster (cached)</step>
    <step order="3">Test rate limit:
      - Simulate 100+ questions from same site
      - 101st question shows warm limit message</step>
    <step order="4">Test timeout fallback:
      - Simulate slow LLM response (&gt;3s)
      - User sees phone number fallback</step>
    <step order="5">Test Worker down:
      - Simulate Worker unreachable
      - User sees warm error message with phone</step>
    <step order="6">Document all test results</step>
  </steps>

  <verification>
    <check type="manual">Happy path: question → answer in &lt;2s</check>
    <check type="manual">Cache hit: second question &lt;100ms</check>
    <check type="manual">Rate limit: warm message at limit</check>
    <check type="manual">Timeout: phone fallback message</check>
    <check type="manual">Worker down: warm error message</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-3" reason="Widget must be complete" />
    <depends-on task-id="phase-1-task-4" reason="Worker must be complete" />
    <depends-on task-id="phase-1-task-7" reason="Rate limiting must be complete" />
  </dependencies>

  <commit-message>test(e2e): validate complete widget-to-worker flow

- Test happy path with question/answer
- Test cache hit performance
- Test rate limit messaging
- Test timeout fallback
- Test Worker down graceful error

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-14" wave="4">
  <title>File Inventory & Completion Check</title>
  <requirement>All components complete per decisions.md Section 3</requirement>
  <description>Final inventory check to ensure all required files exist and are complete.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Section 3: File Structure specification" />
  </context>

  <steps>
    <step order="1">Verify WordPress plugin files exist:
      - localgenius.php
      - uninstall.php
      - readme.txt
      - admin/class-admin.php
      - admin/views/settings-page.php
      - admin/css/admin.css
      - includes/class-widget.php
      - includes/class-scanner.php
      - includes/class-faq-templates.php
      - includes/class-api-handler.php
      - assets/js/chat-widget.js
      - assets/css/chat-widget.css
      - templates/faq/*.json (10 files)</step>
    <step order="2">Verify Cloudflare Worker files exist:
      - worker.js
      - cache.js
      - prompts.js
      - wrangler.toml</step>
    <step order="3">Check file sizes are reasonable:
      - chat-widget.js &lt; 8kb
      - Total plugin size &lt; 500kb</step>
    <step order="4">Create final completion report</step>
  </steps>

  <verification>
    <check type="bash">ls deliverables/localgenius-lite/localgenius/*.php | wc -l | awk '{print ($1 >= 2 ? "PHP FILES PASS" : "PHP FILES FAIL")}'</check>
    <check type="bash">ls deliverables/localgenius-lite/cloudflare-worker/*.js | wc -l | awk '{print ($1 >= 3 ? "WORKER FILES PASS" : "WORKER FILES FAIL")}'</check>
    <check type="bash">ls deliverables/localgenius-lite/localgenius/templates/faq/*.json | wc -l | awk '{print ($1 == 10 ? "FAQ TEMPLATES PASS" : "FAQ TEMPLATES FAIL")}'</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Admin files" />
    <depends-on task-id="phase-1-task-2" reason="FAQ templates" />
    <depends-on task-id="phase-1-task-3" reason="Widget files" />
    <depends-on task-id="phase-1-task-4" reason="Worker files" />
  </dependencies>

  <commit-message>docs(planning): complete file inventory and readiness check

- Verify all plugin files exist
- Verify all Worker files exist
- Verify all 10 FAQ templates
- Confirm file sizes within spec

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-15" wave="4">
  <title>Sara Blakely Customer Gut-Check</title>
  <requirement>SKILL.md Step 7: Sara Blakely customer-value review</requirement>
  <description>Spawn Sara Blakely persona to gut-check the plugin from a small business owner's perspective. Does this solve Maria's problem?</description>

  <context>
    <file path=".planning/phase-1-plan.md" reason="This plan document" />
    <file path="rounds/localgenius-lite/decisions.md" reason="Original decisions and essence" />
  </context>

  <steps>
    <step order="1">Review all deliverables from Maria's perspective:
      - Maria owns Maria's Kitchen in Austin
      - She's not tech-savvy (uses WordPress theme, needs zero-config)
      - She wants her website to answer "what are your hours?" while she sleeps</step>
    <step order="2">Answer honestly:
      - Would Maria actually use this?
      - What would make her say "shut up and take my money"?
      - What feels like engineering vanity vs. customer value?</step>
    <step order="3">Identify gaps in the customer journey:
      - Activation: Is it truly zero-config?
      - First experience: Does the first answer work?
      - Ongoing value: Will she keep it installed?</step>
    <step order="4">Write findings to .planning/sara-blakely-review.md</step>
  </steps>

  <verification>
    <check type="bash">test -f .planning/sara-blakely-review.md &amp;&amp; echo "SARA REVIEW EXISTS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-14" reason="All content must be complete for review" />
  </dependencies>

  <commit-message>review(customer): Sara Blakely gut-check complete

- Reviewed from Maria's small business perspective
- Assessed customer value vs engineering vanity
- Identified activation and first-experience gaps
- Documented findings for v1.1 consideration

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com></commit-message>
</task-plan>
```

---

## Risk Notes

**From Risk Scanner Analysis:**

### Critical Risks (Mitigated in Plan)

| Risk | Mitigation Task |
|------|----------------|
| LLM Hallucination | phase-1-task-6 (system prompts ground truth to FAQ) |
| 1-Star Reviews | phase-1-task-3 (graceful errors), phase-1-task-13 (E2E testing) |
| Widget Looks Spammy | phase-1-task-3 (Steve Jobs design standard) |
| Worker Timeout | phase-1-task-7 (3s timeout with phone fallback) |
| Rate Limit Abuse | phase-1-task-7 (IP throttling + per-site cap) |
| WordPress.org Rejection | phase-1-task-12 (plugin checker validation) |

### Technical Debt (Document for v1.1)

- Hardcoded Worker endpoint (RISK-003): Plan Worker endpoint config for scale
- WCAG 2.1 AA full audit: Basic ARIA in v1, formal audit in v1.1

---

## Success Criteria

**Technical Criteria** (from REQUIREMENTS.md):
- [ ] All 16 files created and complete
- [ ] Zero placeholder content
- [ ] Widget activates in <30 seconds
- [ ] 80% cache hit rate in testing
- [ ] Plugin passes WordPress.org checker
- [ ] No AI/chatbot branding anywhere

**UX Criteria** (from decisions.md Essence):
- [ ] First answer works: "What are your hours?" answered instantly
- [ ] Widget looks beautiful, not spammy
- [ ] Error messages feel warm and human

**Business Criteria**:
- [ ] Ready for WordPress.org submission
- [ ] Agency bundle documentation ready

---

## Execution Checklist

```
[ ] Wave 1: Foundation (parallel)
    [ ] phase-1-task-1: Admin settings page
    [ ] phase-1-task-2: Missing FAQ templates (retail, general)

[ ] Wave 2: Core Implementation (parallel)
    [ ] phase-1-task-3: Chat widget frontend (JS + CSS)
    [ ] phase-1-task-4: Cloudflare Worker entry point
    [ ] phase-1-task-5: Caching layer
    [ ] phase-1-task-6: System prompts
    [ ] phase-1-task-7: Worker rate limiting

[ ] Wave 3: Documentation & Fixes (sequential)
    [ ] phase-1-task-8: WordPress.org readme.txt
    [ ] phase-1-task-9: SSL verification fix

[ ] Wave 4: Validation (sequential)
    [ ] phase-1-task-10: FAQ template validation
    [ ] phase-1-task-11: No AI branding validation
    [ ] phase-1-task-12: WordPress plugin checker
    [ ] phase-1-task-13: End-to-end flow testing
    [ ] phase-1-task-14: File inventory check
    [ ] phase-1-task-15: Sara Blakely customer review
```

---

## Files Created by This Plan

| File | Path | Purpose |
|------|------|---------|
| class-admin.php | `admin/class-admin.php` | Admin settings registration |
| settings-page.php | `admin/views/settings-page.php` | Settings page HTML |
| admin.css | `admin/css/admin.css` | Admin styling |
| chat-widget.js | `assets/js/chat-widget.js` | Frontend widget (~200 lines) |
| chat-widget.css | `assets/css/chat-widget.css` | Widget styling |
| retail.json | `templates/faq/retail.json` | Retail business FAQ |
| general.json | `templates/faq/general.json` | Generic fallback FAQ |
| worker.js | `cloudflare-worker/worker.js` | Main Worker |
| cache.js | `cloudflare-worker/cache.js` | Caching layer |
| prompts.js | `cloudflare-worker/prompts.js` | System prompts |
| wrangler.toml | `cloudflare-worker/wrangler.toml` | Worker config |
| readme.txt | `readme.txt` | WordPress.org description |
| sara-blakely-review.md | `.planning/sara-blakely-review.md` | Customer gut-check |

---

## Document Trail

- **Requirements**: `.planning/REQUIREMENTS.md`
- **Decisions**: `rounds/localgenius-lite/decisions.md`
- **Project Rules**: `CLAUDE.md`
- **Existing Code**: `deliverables/localgenius-lite/localgenius/`

---

## Technical Reference: Verified Cloudflare Workers AI API

Per Cloudflare Workers AI documentation (as of 2026):

### Workers AI Binding

```toml
# wrangler.toml
[ai]
binding = "AI"
```

### Llama 3.1 8B Call Pattern

```javascript
// worker.js
const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userQuestion }
  ],
  max_tokens: 256,
  temperature: 0.7
});

// Response: { response: "answer text" }
```

### KV Cache Pattern

```javascript
// cache.js
const cached = await env.CACHE.get(cacheKey, { type: 'json' });
await env.CACHE.put(cacheKey, JSON.stringify(response), {
  expirationTtl: 86400 // 24 hours
});
```

**Source**: https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct/

---

**Plan Status**: READY FOR EXECUTION
**Estimated Duration**: 8 hours focused session
**Parallel Tasks**: Wave 1 (2 tasks), Wave 2 (5 tasks)
**Sequential Blocks**: Wave 3 (2 tasks), Wave 4 (6 tasks)

---

*Plan generated by Great Minds Agency — Phase Planning Agent (GSD-Style)*
*Cross-referenced against: CLAUDE.md (project rules), decisions.md (locked decisions), SKILL.md (planning methodology)*
*Existing code inventory from Codebase Scout analysis*

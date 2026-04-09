# Phase 1 Plan — LocalGenius Lite MVP

**Generated**: 2026-04-09
**Requirements**: `.planning/REQUIREMENTS.md` + `rounds/localgenius-lite/decisions.md`
**Total Tasks**: 17
**Waves**: 4
**Timeline**: 8 hours focused session
**Project Slug**: `localgenius-lite`

---

## Executive Summary

LocalGenius Lite is a zero-configuration WordPress plugin that brings AI-powered customer engagement to small business websites. This plan implements the MVP as defined in the locked decisions from the Steve Jobs / Elon Musk debate rounds.

**Core Essence** (from Rick Rubin distillation):
> "Giving a small business website a voice that speaks while the owner sleeps."

**The One Thing That Must Be Perfect**:
> "The first answer. If the widget can't nail 'what are your hours?' instantly, nothing else matters."

**Build Strategy** (from Zen Master synthesis):
> "Build Elon's architecture with Steve's soul. Ship the boring, reliable, cached FAQ templates — but wrap them in a widget so beautiful it feels like magic."

---

## Requirements Traceability

| Requirement | Task(s) | Wave |
|-------------|---------|------|
| REQ-001: WordPress plugin scaffold | phase-1-task-1 | 1 |
| REQ-004: FAQ templates (10 types) | phase-1-task-2 | 1 |
| REQ-006: Cloudflare Worker endpoint | phase-1-task-3 | 1 |
| REQ-007: Question caching | phase-1-task-4 | 1 |
| REQ-008: Llama 3.1 8B integration | phase-1-task-5 | 1 |
| REQ-016: Rate limiting | phase-1-task-6 | 1 |
| REQ-011: Admin settings page | phase-1-task-7 | 2 |
| REQ-002: Business type dropdown | phase-1-task-8 | 2 |
| REQ-003: Location input field | phase-1-task-9 | 2 |
| REQ-005: Chat widget (vanilla JS) | phase-1-task-10 | 3 |
| REQ-012: Widget styling | phase-1-task-11 | 3 |
| REQ-013: No AI branding | phase-1-task-12 | 3 |
| REQ-009: Homepage extraction | phase-1-task-13 | 3 |
| REQ-015: Error state UX | phase-1-task-14 | 3 |
| REQ-014: "Powered by" link | phase-1-task-15 | 3 |
| REQ-010: Basic logging | phase-1-task-16 | 3 |
| REQ-017: readme.txt | phase-1-task-17 | 4 |

---

## Wave Execution Order

### Wave 1 (Parallel — Foundation)

These 6 tasks are independent and can run simultaneously. They establish the plugin scaffold, FAQ data, and Cloudflare Worker infrastructure.

```xml
<task-plan id="phase-1-task-1" wave="1">
  <title>Create WordPress Plugin Scaffold</title>
  <requirement>REQ-001: WordPress plugin scaffold with standard hooks, GPL license, activates in &lt;30 seconds</requirement>
  <description>Create the main plugin file with WordPress headers, activation/deactivation hooks, autoloader, and directory structure. This is the foundation for all other plugin features.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="MVP Feature Set #1, File Structure specification" />
    <file path="deliverables/pinned/pinned.php" reason="Reference implementation for WordPress plugin structure (from Codebase Scout)" />
    <file path="deliverables/pinned/includes/class-pinned-db.php" reason="Database schema pattern reference" />
    <file path="CLAUDE.md" reason="Anti-hallucination rules, branch strategy" />
  </context>

  <steps>
    <step order="1">Create directory structure:
      localgenius/
      ├── localgenius.php
      ├── admin/
      │   ├── class-admin.php
      │   ├── views/
      │   │   └── settings-page.php
      │   └── css/
      │       └── admin.css
      ├── includes/
      │   ├── class-widget.php
      │   ├── class-scanner.php
      │   ├── class-faq-templates.php
      │   └── class-api-handler.php
      ├── assets/
      │   ├── js/
      │   │   └── chat-widget.js
      │   └── css/
      │       └── chat-widget.css
      ├── templates/
      │   └── faq/
      ├── uninstall.php
      └── readme.txt</step>
    <step order="2">Create localgenius.php with:
      - Plugin headers (Plugin Name, Version, Author, License: GPLv2, Requires PHP: 8.0, Requires at least: 6.0)
      - Define constants: LOCALGENIUS_VERSION, LOCALGENIUS_PLUGIN_DIR, LOCALGENIUS_PLUGIN_URL
      - Register activation hook (register_activation_hook)
      - Register deactivation hook (register_deactivation_hook)
      - Autoloader for class files in /includes/
      - Admin menu registration on admin_menu hook
      - Frontend script enqueue on wp_enqueue_scripts hook</step>
    <step order="3">Create uninstall.php with WP_UNINSTALL_PLUGIN check and cleanup of all plugin options</step>
    <step order="4">Verify plugin activates without errors by testing with WP-CLI or manual activation</step>
  </steps>

  <verification>
    <check type="bash">test -f localgenius/localgenius.php &amp;&amp; echo "MAIN FILE EXISTS"</check>
    <check type="bash">grep -q "Plugin Name:" localgenius/localgenius.php &amp;&amp; echo "HEADERS PASS"</check>
    <check type="bash">grep -q "License: GPLv2" localgenius/localgenius.php &amp;&amp; echo "LICENSE PASS"</check>
    <check type="bash">grep -q "register_activation_hook" localgenius/localgenius.php &amp;&amp; echo "ACTIVATION HOOK PASS"</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies - foundation task -->
  </dependencies>

  <commit-message>feat(localgenius): create WordPress plugin scaffold with activation hooks</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-2" wave="1">
  <title>Create Pre-Written FAQ Templates (10 Types)</title>
  <requirement>REQ-004: Hardcoded FAQ templates per business type — NO AI generation</requirement>
  <description>Create 10 JSON files with pre-written FAQ content for each business type. Each file contains 10-15 Q&amp;A pairs covering hours, services, pricing, and contact. These are the "ground truth" for the LLM to prevent hallucination.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 4: No background jobs, instant FAQ templates" />
    <file path="prds/localgenius-lite.md" reason="Business Type Categories appendix" />
    <file path="rounds/localgenius-lite/essence.md" reason="The one thing that must be perfect: the first answer" />
  </context>

  <steps>
    <step order="1">Create templates/faq/ directory</step>
    <step order="2">Create dentist.json with 12 Q&amp;As covering:
      - Hours of operation
      - Insurance acceptance
      - Appointment booking
      - Services offered
      - Emergency care
      - New patient info
      - Parking/location
      - Payment methods</step>
    <step order="3">Create plumber.json with 12 Q&amp;As covering:
      - Service areas
      - Emergency services
      - Pricing/estimates
      - Hours of operation
      - Services offered
      - Appointment scheduling
      - Payment methods</step>
    <step order="4">Create restaurant.json with 12 Q&amp;As covering:
      - Hours of operation
      - Reservations
      - Menu/dietary options
      - Delivery/takeout
      - Private events
      - Payment methods
      - Location/parking</step>
    <step order="5">Create salon.json with 12 Q&amp;As covering:
      - Hours of operation
      - Services and pricing
      - Appointment booking
      - Cancellation policy
      - Walk-ins
      - Products sold</step>
    <step order="6">Create mechanic.json with 12 Q&amp;As covering:
      - Hours of operation
      - Services offered
      - Estimates/pricing
      - Warranty
      - Appointment scheduling
      - Emergency repairs</step>
    <step order="7">Create lawyer.json with 12 Q&amp;As covering:
      - Practice areas
      - Consultation process
      - Fees/billing
      - Hours of operation
      - Confidentiality
      - Initial meeting</step>
    <step order="8">Create realtor.json with 12 Q&amp;As covering:
      - Buying process
      - Selling process
      - Commission
      - Service areas
      - Market conditions
      - Contact/availability</step>
    <step order="9">Create fitness.json with 12 Q&amp;As covering:
      - Membership options
      - Hours of operation
      - Classes offered
      - Personal training
      - Trial/guest passes
      - Cancellation policy</step>
    <step order="10">Create retail.json with 12 Q&amp;As covering:
      - Hours of operation
      - Products/inventory
      - Returns/exchanges
      - Payment methods
      - Shipping/delivery
      - Contact info</step>
    <step order="11">Create general.json as fallback with generic Q&amp;As:
      - Hours of operation
      - Location
      - Contact info
      - Services overview
      - Payment methods
      - Appointment/contact process</step>
    <step order="12">Validate all JSON files with PHP json_decode()</step>
  </steps>

  <verification>
    <check type="bash">ls -la templates/faq/*.json | wc -l | awk '{print ($1 == 10 ? "10 FILES PASS" : "FILE COUNT FAIL: " $1)}'</check>
    <check type="bash">for f in templates/faq/*.json; do php -r "json_decode(file_get_contents('$f')) or die('INVALID: $f');" &amp;&amp; echo "VALID: $f"; done</check>
    <check type="bash">wc -l templates/faq/dentist.json | awk '{print ($1 >= 20 ? "DENTIST CONTENT PASS" : "DENTIST CONTENT FAIL")}'</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies - content task -->
  </dependencies>

  <commit-message>feat(localgenius): add pre-written FAQ templates for 10 business types</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-3" wave="1">
  <title>Create Cloudflare Worker API Endpoint</title>
  <requirement>REQ-006: Single endpoint handling all chat requests via Cloudflare Workers</requirement>
  <description>Create the Cloudflare Worker that receives chat questions, handles routing, and returns responses. This is the backend API that the WordPress plugin calls.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="MVP Feature Set #6, File Structure for cloudflare-worker/" />
    <file path="CLAUDE.md" reason="Anti-hallucination rules - read actual Cloudflare docs, not invented APIs" />
  </context>

  <steps>
    <step order="1">Create cloudflare-worker/ directory structure:
      cloudflare-worker/
      ├── worker.js
      ├── cache.js
      ├── prompts.js
      └── wrangler.toml</step>
    <step order="2">Create wrangler.toml with:
      - Worker name: localgenius-chat
      - KV namespace binding for cache
      - AI binding for Workers AI
      - CORS settings
      - Environment variables</step>
    <step order="3">Create worker.js with:
      - POST /api/chat endpoint
      - Request validation (question, businessType required)
      - CORS headers (Access-Control-Allow-Origin: *)
      - 3-second timeout handling
      - JSON response format: { answer, source, timestamp }
      - Error handling with graceful fallback</step>
    <step order="4">Export fetch handler function</step>
    <step order="5">Verify worker deploys with wrangler publish</step>
  </steps>

  <verification>
    <check type="bash">test -f cloudflare-worker/worker.js &amp;&amp; echo "WORKER FILE EXISTS"</check>
    <check type="bash">test -f cloudflare-worker/wrangler.toml &amp;&amp; echo "CONFIG EXISTS"</check>
    <check type="bash">grep -q "Access-Control-Allow-Origin" cloudflare-worker/worker.js &amp;&amp; echo "CORS PASS"</check>
    <check type="manual">Deploy worker and test with: curl -X POST https://localgenius-chat.workers.dev/api/chat -H "Content-Type: application/json" -d '{"question":"test","businessType":"dentist"}'</check>
  </verification>

  <dependencies>
    <!-- Wave 1: No dependencies - infrastructure task -->
  </dependencies>

  <commit-message>feat(worker): create Cloudflare Worker API endpoint for chat requests</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-4" wave="1">
  <title>Implement Question Caching (Hash-Based)</title>
  <requirement>REQ-007: Cache questions before LLM to reduce costs 5x with 24h TTL</requirement>
  <description>Implement hash-based caching in the Cloudflare Worker using KV storage. Questions are hashed with SHA256 and cached responses are returned instantly on cache hit.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 5: Cache before LLM - always" />
    <file path="cloudflare-worker/worker.js" reason="Worker endpoint to integrate caching" />
  </context>

  <steps>
    <step order="1">Create cloudflare-worker/cache.js with:
      - hashQuestion(question) function using SHA256
      - getCached(siteId, businessType, questionHash) function
      - setCached(siteId, businessType, questionHash, answer) function
      - Cache key format: ${siteId}:${businessType}:${questionHash}</step>
    <step order="2">Configure KV namespace in wrangler.toml:
      [[kv_namespaces]]
      binding = "CACHE"
      id = "your-kv-namespace-id"</step>
    <step order="3">Set 24-hour TTL on all cache entries:
      await CACHE.put(key, JSON.stringify(value), { expirationTtl: 86400 })</step>
    <step order="4">Integrate caching into worker.js flow:
      - Hash incoming question
      - Check cache before LLM call
      - If hit: return cached answer with source: "cached"
      - If miss: call LLM, store result, return with source: "llm"</step>
    <step order="5">Log cache hit/miss for monitoring</step>
  </steps>

  <verification>
    <check type="bash">grep -q "SHA256\|sha256\|crypto" cloudflare-worker/cache.js &amp;&amp; echo "HASH FUNCTION PASS"</check>
    <check type="bash">grep -q "expirationTtl.*86400" cloudflare-worker/cache.js &amp;&amp; echo "TTL PASS"</check>
    <check type="manual">Send same question twice, verify second response is faster (&lt;100ms)</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-3" reason="Worker endpoint must exist to add caching" />
  </dependencies>

  <commit-message>feat(worker): implement hash-based question caching with 24h TTL</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-5" wave="1">
  <title>Integrate Llama 3.1 8B via Workers AI</title>
  <requirement>REQ-008: Single LLM path — Llama 3.1 8B only, NO Claude fallback</requirement>
  <description>Integrate Cloudflare Workers AI to call Llama 3.1 8B for answering questions. System prompt includes FAQ as ground truth and strict instructions to never invent hours, prices, or phone numbers.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 2: Single LLM path - Llama only" />
    <file path=".planning/REQUIREMENTS.md" reason="REQ-008 System Prompt Template" />
  </context>

  <steps>
    <step order="1">Create cloudflare-worker/prompts.js with:
      - getSystemPrompt(businessType, location, faqContext) function
      - System prompt template that includes:
        "You are a helpful assistant for a {businessType} business..."
        "NEVER invent hours, prices, or phone numbers"
        "If you don't know, say 'I'd recommend calling us directly'"</step>
    <step order="2">Configure AI binding in wrangler.toml:
      [ai]
      binding = "AI"</step>
    <step order="3">Implement LLM call in worker.js:
      - Use @hf/meta-llama/llama-3.1-8b-instruct model
      - Set temperature low (0.3) for consistency
      - Set max_tokens to 500
      - Handle model API errors gracefully</step>
    <step order="4">Add 3-second timeout with AbortController:
      - If timeout, return fallback message
      - Log timeout events for monitoring</step>
    <step order="5">Test with adversarial inputs (ambiguous hours, vague pricing) to verify no hallucination</step>
  </steps>

  <verification>
    <check type="bash">grep -q "llama-3.1-8b-instruct\|meta-llama" cloudflare-worker/worker.js &amp;&amp; echo "MODEL PASS"</check>
    <check type="bash">grep -q "NEVER invent\|never invent" cloudflare-worker/prompts.js &amp;&amp; echo "HALLUCINATION GUARD PASS"</check>
    <check type="bash">grep -qv "claude\|anthropic" cloudflare-worker/worker.js &amp;&amp; echo "NO CLAUDE FALLBACK PASS"</check>
    <check type="manual">Ask "What time do you close on Sunday?" - should NOT invent a specific time</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-3" reason="Worker endpoint must exist to add LLM" />
    <depends-on task-id="phase-1-task-4" reason="Caching must be integrated before LLM calls" />
  </dependencies>

  <commit-message>feat(worker): integrate Llama 3.1 8B via Workers AI with anti-hallucination prompts</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-6" wave="1">
  <title>Implement Rate Limiting</title>
  <requirement>REQ-016: 100 questions/month/site with IP-based throttling</requirement>
  <description>Implement rate limiting at the Worker level to control costs. Per-site monthly limits and per-IP throttling to prevent abuse.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Risk Register: Rate limit abuse, 100 questions/month" />
    <file path="prds/localgenius-lite.md" reason="Rate limits on free tier: 100 questions/month/site" />
  </context>

  <steps>
    <step order="1">Add rate limit tracking to KV:
      - Key format: rate:${siteId}:${yearMonth}
      - Value: question count
      - Check before processing request</step>
    <step order="2">Implement per-site monthly limit:
      - Default: 100 questions/month (configurable)
      - Return 429 when exceeded
      - Include message: "Rate limit exceeded for this month"</step>
    <step order="3">Implement IP-based throttling:
      - Track requests per IP per minute
      - Limit: 10 requests/minute
      - Return 429 with backoff period</step>
    <step order="4">Add monitoring for cost alerts:
      - Log all rate limit hits
      - Track daily request counts
      - Prepare for $10/day alert threshold</step>
    <step order="5">Include rate limit info in response headers:
      - X-RateLimit-Remaining
      - X-RateLimit-Reset</step>
  </steps>

  <verification>
    <check type="bash">grep -q "429\|rate.*limit\|RateLimit" cloudflare-worker/worker.js &amp;&amp; echo "RATE LIMIT PASS"</check>
    <check type="manual">Send 101 requests from same site, verify 101st returns 429</check>
    <check type="manual">Send 11 requests in 1 minute from same IP, verify throttling</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-3" reason="Worker endpoint must exist to add rate limiting" />
    <depends-on task-id="phase-1-task-4" reason="KV must be configured for rate tracking" />
  </dependencies>

  <commit-message>feat(worker): implement rate limiting (100/month per site, IP throttling)</commit-message>
</task-plan>
```

---

### Wave 2 (Sequential — Admin Interface)

These tasks build the WordPress admin settings page. They must complete after Wave 1 and before Wave 3.

```xml
<task-plan id="phase-1-task-7" wave="2">
  <title>Create Admin Settings Page</title>
  <requirement>REQ-011: Single setup screen with business type and location</requirement>
  <description>Create the WordPress admin settings page that appears under the Settings menu. This is the one-screen setup experience that takes &lt;30 seconds.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="File Structure: admin/views/settings-page.php" />
    <file path="deliverables/pinned/includes/class-pinned-widget.php" reason="Admin page registration pattern reference" />
    <file path="localgenius/localgenius.php" reason="Main plugin file to hook admin menu" />
  </context>

  <steps>
    <step order="1">Create admin/class-admin.php with:
      - LocalGenius_Admin class
      - init() method to register hooks
      - add_menu_page() under Settings menu
      - enqueue_admin_styles() for admin.css
      - save_settings() to handle form submission</step>
    <step order="2">Create admin/views/settings-page.php with:
      - Form with wp_nonce_field
      - Business type dropdown (placeholder for now)
      - Location text input
      - Save button with .button-primary class
      - Success message area</step>
    <step order="3">Create admin/css/admin.css with:
      - Max-width 600px centered form
      - WordPress default input styling
      - Success message styling (green border)</step>
    <step order="4">Hook admin class in localgenius.php:
      - Require class file
      - Call LocalGenius_Admin::init() on plugins_loaded</step>
    <step order="5">Implement save_settings() with:
      - Nonce verification
      - Sanitize inputs (sanitize_text_field)
      - update_option() for each setting
      - Redirect with success message</step>
  </steps>

  <verification>
    <check type="bash">test -f admin/class-admin.php &amp;&amp; echo "ADMIN CLASS EXISTS"</check>
    <check type="bash">grep -q "add_menu_page\|add_submenu_page" admin/class-admin.php &amp;&amp; echo "MENU REGISTRATION PASS"</check>
    <check type="bash">grep -q "wp_nonce_field" admin/views/settings-page.php &amp;&amp; echo "NONCE PASS"</check>
    <check type="manual">Navigate to Settings > LocalGenius in WP admin, verify page loads</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Plugin scaffold must exist" />
  </dependencies>

  <commit-message>feat(admin): create settings page with form structure and nonce validation</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-8" wave="2">
  <title>Add Business Type Dropdown</title>
  <requirement>REQ-002: Dropdown with 10 common business types mapped to FAQ templates</requirement>
  <description>Populate the business type dropdown with the 10 supported types and save selection to wp_options.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="MVP Feature Set #2: Business Type Selector" />
    <file path="templates/faq/" reason="FAQ template files to map to dropdown options" />
  </context>

  <steps>
    <step order="1">Define business types array in class-admin.php:
      $business_types = [
        'dentist' => 'Dental Practice',
        'plumber' => 'Plumbing / HVAC',
        'restaurant' => 'Restaurant / Cafe',
        'salon' => 'Salon / Spa',
        'mechanic' => 'Auto Repair',
        'lawyer' => 'Legal Services',
        'realtor' => 'Real Estate',
        'fitness' => 'Fitness / Gym',
        'retail' => 'Retail Store',
        'general' => 'General Business'
      ];</step>
    <step order="2">Update settings-page.php with dropdown:
      - Select element with name="localgenius_business_type"
      - Default option: "Select your business type..."
      - Loop through $business_types to create options
      - Pre-select saved value</step>
    <step order="3">Update save_settings() to:
      - Validate business type is in allowed array
      - update_option('localgenius_business_type', $selected)</step>
    <step order="4">Add label: "What type of business are you?"</step>
    <step order="5">Test saving and retrieving selection</step>
  </steps>

  <verification>
    <check type="bash">grep -q "localgenius_business_type" admin/views/settings-page.php &amp;&amp; echo "DROPDOWN PASS"</check>
    <check type="manual">Select "Dental Practice", save, refresh - verify selection persists</check>
    <check type="bash">wp option get localgenius_business_type | grep -q "dentist" &amp;&amp; echo "OPTION SAVED PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-7" reason="Admin settings page must exist" />
    <depends-on task-id="phase-1-task-2" reason="FAQ templates must exist to validate mapping" />
  </dependencies>

  <commit-message>feat(admin): add business type dropdown with 10 options mapped to FAQ templates</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-9" wave="2">
  <title>Add Location Input Field</title>
  <requirement>REQ-003: Single text field for city/region</requirement>
  <description>Add location input field to settings page. Used for context in LLM prompts.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="MVP Feature Set #3: Location Input" />
    <file path="admin/views/settings-page.php" reason="Settings form to add field" />
  </context>

  <steps>
    <step order="1">Add text input to settings-page.php:
      - Input with name="localgenius_location"
      - Maxlength="100"
      - Placeholder: "e.g., Austin, TX"
      - Pre-filled with saved value</step>
    <step order="2">Add label: "Your location (city/region)"</step>
    <step order="3">Update save_settings() to:
      - Sanitize with sanitize_text_field()
      - update_option('localgenius_location', $location)
      - No validation (accept any text)</step>
    <step order="4">Add helper text: "Optional. Used to personalize responses."</step>
    <step order="5">Test saving and retrieving location</step>
  </steps>

  <verification>
    <check type="bash">grep -q "localgenius_location" admin/views/settings-page.php &amp;&amp; echo "LOCATION FIELD PASS"</check>
    <check type="manual">Enter "Austin, TX", save, refresh - verify input persists</check>
    <check type="bash">wp option get localgenius_location | grep -q "Austin" &amp;&amp; echo "OPTION SAVED PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-7" reason="Admin settings page must exist" />
  </dependencies>

  <commit-message>feat(admin): add location input field for personalized LLM context</commit-message>
</task-plan>
```

---

### Wave 3 (Parallel — Frontend Widget)

These 7 tasks implement the frontend chat widget and supporting features. They can run in parallel after Wave 2.

```xml
<task-plan id="phase-1-task-10" wave="3">
  <title>Create Chat Widget (Vanilla JS)</title>
  <requirement>REQ-005: Floating chat bubble with vanilla JavaScript, ~200 lines</requirement>
  <description>Implement the core chat widget functionality in vanilla JavaScript. Floating bubble, message interface, API calls to WordPress REST endpoint.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="MVP Feature Set #5: Chat Widget design" />
    <file path="rounds/localgenius-lite/essence.md" reason="Creative direction: Silent magic" />
    <file path="CLAUDE.md" reason="Anti-hallucination: verify API patterns, don't guess" />
  </context>

  <steps>
    <step order="1">Create assets/js/chat-widget.js with IIFE pattern:
      (function() { /* widget code */ })();</step>
    <step order="2">Implement widget initialization:
      - Check if settings exist (business type set)
      - Create floating bubble element
      - Position bottom-right by default
      - Add click handler to toggle chat panel</step>
    <step order="3">Implement chat panel:
      - Header with "Questions?" title and close button
      - Message thread container (scrollable)
      - Input field with Send button
      - Enter key triggers send</step>
    <step order="4">Implement message handling:
      - User message appears immediately (optimistic UI)
      - Loading indicator while waiting
      - API call to WordPress REST endpoint
      - Response displayed when ready
      - Error handling with graceful fallback</step>
    <step order="5">Implement API integration:
      - POST to /wp-json/localgenius/v1/chat
      - Include question, businessType, siteId
      - Handle response JSON
      - Display answer in chat thread</step>
    <step order="6">Keep code under 200 lines total</step>
    <step order="7">No jQuery, no external libraries</step>
  </steps>

  <verification>
    <check type="bash">wc -l assets/js/chat-widget.js | awk '{print ($1 &lt;= 250 ? "LINE COUNT PASS" : "WARN: " $1)}'</check>
    <check type="bash">grep -qv "jQuery\|\$\." assets/js/chat-widget.js &amp;&amp; echo "NO JQUERY PASS"</check>
    <check type="bash">grep -q "fetch\|XMLHttpRequest" assets/js/chat-widget.js &amp;&amp; echo "API CALL PASS"</check>
    <check type="manual">Load frontend page, click bubble, type question, verify response</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Plugin must enqueue scripts" />
    <depends-on task-id="phase-1-task-8" reason="Business type must be set" />
    <depends-on task-id="phase-1-task-3" reason="Worker API must be available" />
  </dependencies>

  <commit-message>feat(widget): create vanilla JS chat widget with floating bubble and message interface</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-11" wave="3">
  <title>Create Widget Styling (Single Design)</title>
  <requirement>REQ-012: One beautiful widget design — zero customization</requirement>
  <description>Create the CSS for the chat widget with a single, beautiful design that works across all WordPress themes.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 6: One beautiful widget. Zero customization." />
  </context>

  <steps>
    <step order="1">Create assets/css/chat-widget.css with:
      - CSS reset for widget container (box-sizing, font-family)
      - High z-index (999999) to appear above content
      - CSS custom properties for colors (easy theming later)</step>
    <step order="2">Style floating bubble:
      - Fixed position bottom-right (20px margins)
      - 60px circular button
      - Clean background color (professional blue)
      - Chat icon (CSS or inline SVG)
      - Hover effect (scale/shadow)</step>
    <step order="3">Style chat panel:
      - Fixed position bottom-right
      - 350px width, 450px max-height
      - White background, subtle shadow
      - Rounded corners (12px)
      - Header, thread, input sections</step>
    <step order="4">Style messages:
      - User messages: right-aligned, blue background
      - Assistant messages: left-aligned, gray background
      - Timestamp or subtle indicator
      - Smooth fade-in animation</step>
    <step order="5">Mobile responsive:
      - Full-width on screens &lt;400px
      - Adjust bubble position for mobile
      - Touch-friendly button sizes (44px min)</step>
    <step order="6">Test on 5+ WordPress themes for CSS conflicts</step>
  </steps>

  <verification>
    <check type="bash">test -f assets/css/chat-widget.css &amp;&amp; echo "CSS FILE EXISTS"</check>
    <check type="bash">grep -q "z-index.*999\|position.*fixed" assets/css/chat-widget.css &amp;&amp; echo "POSITIONING PASS"</check>
    <check type="bash">grep -q "@media\|max-width" assets/css/chat-widget.css &amp;&amp; echo "RESPONSIVE PASS"</check>
    <check type="manual">Test widget on Astra, Neve, and OceanWP themes</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-10" reason="Widget JS must exist to style" />
  </dependencies>

  <commit-message>feat(widget): add single beautiful widget design with mobile responsiveness</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-12" wave="3">
  <title>Remove All AI Branding from UI</title>
  <requirement>REQ-013: No "AI-powered", no "chatbot" terminology, no robot icons</requirement>
  <description>Audit and update all UI text to remove AI/chatbot terminology. Widget should feel like natural conversation, not automation.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 7: No 'AI' anywhere in the user interface" />
    <file path="rounds/localgenius-lite/essence.md" reason="Creative direction: Silent magic. No announcement." />
  </context>

  <steps>
    <step order="1">Update widget header text:
      - NOT: "AI Assistant" or "Chatbot"
      - USE: "Questions?" or "Ask us" or "Need help?"</step>
    <step order="2">Update placeholder text:
      - NOT: "Ask the AI..."
      - USE: "Type your question..."</step>
    <step order="3">Remove any robot/AI icons:
      - Use simple chat bubble or question mark icon
      - No robot faces, no AI imagery</step>
    <step order="4">Update error messages:
      - NOT: "AI couldn't process your request"
      - USE: "I'd recommend calling us directly"</step>
    <step order="5">Update admin settings text:
      - NOT: "AI chatbot settings"
      - USE: "LocalGenius Settings" or "Chat Widget"</step>
    <step order="6">Audit all strings for AI/chatbot/bot terminology</step>
  </steps>

  <verification>
    <check type="bash">grep -ri "chatbot\|AI.*powered\|artificial.*intelligence" assets/ admin/ includes/ | grep -v ".css" &amp;&amp; echo "FAIL: AI BRANDING FOUND" || echo "NO AI BRANDING PASS"</check>
    <check type="bash">grep -q "Questions?\|Ask us" assets/js/chat-widget.js &amp;&amp; echo "HUMAN LANGUAGE PASS"</check>
    <check type="manual">Visual audit of widget - no robot icons, no AI badges</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-10" reason="Widget must exist to audit" />
    <depends-on task-id="phase-1-task-7" reason="Admin page must exist to audit" />
  </dependencies>

  <commit-message>feat(widget): remove all AI/chatbot branding for natural conversation feel</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-13" wave="3">
  <title>Implement Homepage Data Extraction</title>
  <requirement>REQ-009: Extract business name and phone from homepage only</requirement>
  <description>Create scanner class to extract business info from the WordPress homepage on plugin activation. Data used for LLM context and error fallback.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 3: Homepage-only extraction, no full site scanning" />
    <file path="rounds/localgenius-lite/decisions.md" reason="MVP Feature Set #9: Homepage Data Extraction" />
  </context>

  <steps>
    <step order="1">Create includes/class-scanner.php with:
      - LocalGenius_Scanner class
      - extract() method triggered on activation
      - Store results in wp_options</step>
    <step order="2">Implement homepage fetch:
      - Use wp_remote_get() with home_url()
      - 3-second timeout
      - Handle errors gracefully (return empty data)</step>
    <step order="3">Extract business name:
      - Look for &lt;title&gt; tag content
      - Fallback to &lt;h1&gt; content
      - Fallback to get_bloginfo('name')
      - Clean/sanitize result</step>
    <step order="4">Extract phone number:
      - Regex pattern for phone formats
      - Look for tel: links first
      - Scan visible text for phone patterns
      - Validate format before storing</step>
    <step order="5">Store extracted data:
      - update_option('localgenius_homepage_data', [
          'business_name' => $name,
          'phone' => $phone,
          'extracted_at' => time()
        ])</step>
    <step order="6">Call scanner on plugin activation hook</step>
  </steps>

  <verification>
    <check type="bash">test -f includes/class-scanner.php &amp;&amp; echo "SCANNER CLASS EXISTS"</check>
    <check type="bash">grep -q "wp_remote_get" includes/class-scanner.php &amp;&amp; echo "FETCH METHOD PASS"</check>
    <check type="bash">grep -q "preg_match\|regex\|phone" includes/class-scanner.php &amp;&amp; echo "PHONE REGEX PASS"</check>
    <check type="manual">Activate plugin, check wp_options for localgenius_homepage_data</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Plugin must exist to add scanner" />
  </dependencies>

  <commit-message>feat(scanner): implement homepage data extraction for name and phone</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-14" wave="3">
  <title>Implement Error State UX</title>
  <requirement>REQ-015: Graceful fallback with contact info when API fails</requirement>
  <description>Implement user-friendly error handling in the widget that shows helpful fallback message instead of technical errors.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Open Questions #5: Error State UX with phone fallback" />
    <file path="includes/class-scanner.php" reason="Homepage extraction provides phone for fallback" />
  </context>

  <steps>
    <step order="1">Define error message templates in chat-widget.js:
      - API failure: "I'd recommend calling us directly at {phone}"
      - Rate limit: "You've reached your question limit. Upgrade for more."
      - Timeout: "I'm having trouble right now. Please try again or call us."
      - Generic: "Something went wrong. Please call us for assistance."</step>
    <step order="2">Pass phone number to widget via wp_localize_script:
      - Get from localgenius_homepage_data option
      - Fallback to empty string if not available</step>
    <step order="3">Update widget API error handling:
      - Catch fetch errors
      - Check response status codes
      - Display appropriate fallback message
      - Format phone number nicely in message</step>
    <step order="4">Keep widget functional after error:
      - User can retry question
      - Widget doesn't freeze or crash
      - Clear error message on next attempt</step>
    <step order="5">Style error messages:
      - Subtle different background (light yellow/amber)
      - Friendly icon (not warning/error icon)
      - Call-to-action styling for phone number</step>
  </steps>

  <verification>
    <check type="bash">grep -q "calling us\|call us\|contact us" assets/js/chat-widget.js &amp;&amp; echo "FALLBACK MESSAGE PASS"</check>
    <check type="bash">grep -q "catch\|error\|fail" assets/js/chat-widget.js &amp;&amp; echo "ERROR HANDLING PASS"</check>
    <check type="manual">Disconnect worker, send question, verify fallback message appears</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-10" reason="Widget must exist to add error handling" />
    <depends-on task-id="phase-1-task-13" reason="Scanner provides phone for fallback" />
  </dependencies>

  <commit-message>feat(widget): implement graceful error states with contact fallback</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-15" wave="3">
  <title>Add "Powered by LocalGenius" Link</title>
  <requirement>REQ-014: Footer link in widget with optional removal via admin setting</requirement>
  <description>Add subtle "Powered by" attribution link in widget footer with admin toggle to show/hide.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 10: Powered by link, removable via upgrade" />
  </context>

  <steps>
    <step order="1">Add admin setting for "Powered by" visibility:
      - Checkbox in settings page
      - Label: "Show 'Powered by LocalGenius' link"
      - Default: checked (visible)
      - Save to wp_options</step>
    <step order="2">Pass setting to widget via wp_localize_script:
      - showPoweredBy: true/false</step>
    <step order="3">Add footer element to widget:
      - Position at bottom of chat panel
      - Text: "Powered by LocalGenius"
      - Link to marketing page (opens new tab)
      - Conditionally rendered based on setting</step>
    <step order="4">Style footer link:
      - Subtle text (small, muted color)
      - Not distracting from conversation
      - Hover shows underline</step>
    <step order="5">Ensure link is rel="noopener" for security</step>
  </steps>

  <verification>
    <check type="bash">grep -q "Powered by\|poweredBy" assets/js/chat-widget.js &amp;&amp; echo "POWERED BY PASS"</check>
    <check type="bash">grep -q "show.*powered\|powered.*link" admin/views/settings-page.php &amp;&amp; echo "TOGGLE SETTING PASS"</check>
    <check type="manual">Disable setting, verify link disappears from widget</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-10" reason="Widget must exist to add footer" />
    <depends-on task-id="phase-1-task-7" reason="Admin settings must exist for toggle" />
  </dependencies>

  <commit-message>feat(widget): add toggleable 'Powered by LocalGenius' footer link</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-16" wave="3">
  <title>Implement Basic Logging</title>
  <requirement>REQ-010: Log question counts in wp_options (no dashboard)</requirement>
  <description>Implement simple question logging to prepare for future analytics dashboard. No personal data stored.</description>

  <context>
    <file path="rounds/localgenius-lite/decisions.md" reason="MVP Feature Set #10: Basic Logging" />
  </context>

  <steps>
    <step order="1">Create WordPress REST endpoint for logging:
      - POST /wp-json/localgenius/v1/log
      - Accepts: businessType, cacheHit (boolean)
      - No question text stored</step>
    <step order="2">Implement logging function in class-api-handler.php:
      - Increment total question count
      - Track cache hit/miss ratio
      - Store timestamp of last question</step>
    <step order="3">Store logs in wp_options:
      - localgenius_question_count: total count
      - localgenius_cache_hits: cache hit count
      - localgenius_last_question: timestamp</step>
    <step order="4">Update widget to call log endpoint:
      - Fire-and-forget (don't block response)
      - Include cache hit status from response</step>
    <step order="5">Ensure NO personal data is logged:
      - No question text
      - No user identifiers
      - No IP addresses</step>
  </steps>

  <verification>
    <check type="bash">grep -q "localgenius_question_count" includes/class-api-handler.php &amp;&amp; echo "LOGGING PASS"</check>
    <check type="manual">Send 5 questions, verify count increments in wp_options</check>
    <check type="bash">grep -qv "question\|user_id\|ip" includes/class-api-handler.php &amp;&amp; echo "NO PII LOGGED PASS" || echo "CHECK PII LOGGING"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-10" reason="Widget must exist to trigger logging" />
    <depends-on task-id="phase-1-task-1" reason="Plugin must have REST API setup" />
  </dependencies>

  <commit-message>feat(logging): implement basic question count tracking (no PII)</commit-message>
</task-plan>
```

---

### Wave 4 (Sequential — Polish)

Final task for WordPress.org submission readiness.

```xml
<task-plan id="phase-1-task-17" wave="4">
  <title>Create WordPress.org readme.txt</title>
  <requirement>REQ-017: WordPress.org compliant readme with SEO keywords</requirement>
  <description>Create the readme.txt file required for WordPress.org submission with proper formatting, SEO keywords, and GPL compliance.</description>

  <context>
    <file path="prds/localgenius-lite.md" reason="Distribution Plan, Constraints" />
    <file path="rounds/localgenius-lite/decisions.md" reason="Decision 9: WordPress.org SEO optimization" />
  </context>

  <steps>
    <step order="1">Create readme.txt with standard WordPress.org format:
      === LocalGenius ===
      Contributors: localgenius
      Tags: ai chatbot, faq, customer chat, local business, chat widget
      Requires at least: 6.0
      Tested up to: 6.4
      Requires PHP: 8.0
      Stable tag: 1.0.0
      License: GPLv2 or later
      License URI: https://www.gnu.org/licenses/gpl-2.0.html</step>
    <step order="2">Write short description:
      Zero-configuration chat widget that answers customer questions 24/7. Select your business type, and your website starts answering "What are your hours?" instantly.</step>
    <step order="3">Write description section:
      - What it does
      - How it works (3 steps)
      - Business types supported
      - No technical knowledge required</step>
    <step order="4">Write installation section:
      1. Install the plugin
      2. Activate it
      3. Go to Settings > LocalGenius
      4. Select your business type
      5. Done! Widget appears on your site.</step>
    <step order="5">Write FAQ section:
      - How does it work?
      - What business types are supported?
      - Is it really free?
      - What about rate limits?
      - Does it work with my theme?</step>
    <step order="6">Write changelog section:
      = 1.0.0 =
      * Initial release</step>
    <step order="7">Disclose API usage:
      - Note that plugin uses Cloudflare Workers AI
      - Link to privacy policy</step>
  </steps>

  <verification>
    <check type="bash">test -f readme.txt &amp;&amp; echo "README EXISTS"</check>
    <check type="bash">grep -q "License: GPLv2" readme.txt &amp;&amp; echo "LICENSE PASS"</check>
    <check type="bash">grep -q "ai chatbot\|FAQ\|local business" readme.txt &amp;&amp; echo "SEO KEYWORDS PASS"</check>
    <check type="bash">grep -q "Cloudflare\|Workers AI" readme.txt &amp;&amp; echo "API DISCLOSURE PASS"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Plugin must be complete to document" />
  </dependencies>

  <commit-message>docs(readme): create WordPress.org compliant readme with SEO keywords</commit-message>
</task-plan>
```

---

## Risk Notes

**From Risk Scanner Analysis:**

### Critical Path Risks (Mitigated)
1. **WordPress.org rejection**: GPL license included, API usage disclosed, no hidden upsells
2. **Widget CSS conflicts**: Single design tested on multiple themes, high z-index, CSS reset
3. **LLM hallucination**: System prompt with strict "NEVER invent" instructions, FAQ as ground truth
4. **Worker latency >3s**: 3-second timeout, graceful fallback, pre-populated cache
5. **Rate limit abuse**: Per-site monthly limits, IP throttling, monitoring alerts
6. **Setup exceeds 30s**: Single-screen form, zero validation, instant FAQ templates

### Technical Execution Risks (Mitigated)
- **Plugin hooks**: Using standard WordPress patterns from reference implementations (Pinned, Dash)
- **Scanner failures**: Fail silently, use fallbacks, 3s timeout
- **Cache invalidation**: Simple 24h TTL, no complex invalidation logic
- **Security**: Nonce validation, sanitize all inputs, no SQL injection via WordPress APIs

### Compliance Risks (Addressed)
- **GPL license**: Included in plugin headers and readme.txt
- **API disclosure**: Cloudflare Workers AI usage documented
- **Data privacy**: No PII logged, question text not stored

---

## Success Criteria

**Technical Criteria**:
- [ ] Plugin activates without errors on WordPress 6.0+/PHP 8.0+
- [ ] Widget loads on frontend within 500ms
- [ ] First answer returns in <3 seconds (cached: <100ms)
- [ ] All 17 requirements pass verification checks
- [ ] Zero console errors on 5+ WordPress themes

**UX Criteria** (from decisions.md Essence):
- [ ] "The first answer" works perfectly for "what are your hours?"
- [ ] Widget feels like "silent magic" — no announcement, no AI branding
- [ ] Setup takes <30 seconds

**Business Criteria** (from PRD):
- [ ] Ready for WordPress.org submission
- [ ] Rate limiting prevents cost overrun
- [ ] "Powered by" link provides viral loop potential

---

## Execution Checklist

```
[ ] Wave 1: Foundation (parallel)
    [ ] phase-1-task-1: Plugin scaffold
    [ ] phase-1-task-2: FAQ templates (10 files)
    [ ] phase-1-task-3: Worker endpoint
    [ ] phase-1-task-4: Question caching
    [ ] phase-1-task-5: Llama integration
    [ ] phase-1-task-6: Rate limiting

[ ] Wave 2: Admin (sequential)
    [ ] phase-1-task-7: Settings page
    [ ] phase-1-task-8: Business type dropdown
    [ ] phase-1-task-9: Location input

[ ] Wave 3: Frontend (parallel)
    [ ] phase-1-task-10: Chat widget
    [ ] phase-1-task-11: Widget styling
    [ ] phase-1-task-12: No AI branding
    [ ] phase-1-task-13: Homepage extraction
    [ ] phase-1-task-14: Error state UX
    [ ] phase-1-task-15: "Powered by" link
    [ ] phase-1-task-16: Basic logging

[ ] Wave 4: Polish (sequential)
    [ ] phase-1-task-17: readme.txt
```

---

## Files Created by This Plan

| File | Path | Purpose |
|------|------|---------|
| localgenius.php | `localgenius/localgenius.php` | Main plugin file |
| class-admin.php | `localgenius/admin/class-admin.php` | Admin settings |
| settings-page.php | `localgenius/admin/views/settings-page.php` | Settings form |
| admin.css | `localgenius/admin/css/admin.css` | Admin styling |
| class-widget.php | `localgenius/includes/class-widget.php` | Widget registration |
| class-scanner.php | `localgenius/includes/class-scanner.php` | Homepage extraction |
| class-faq-templates.php | `localgenius/includes/class-faq-templates.php` | FAQ loader |
| class-api-handler.php | `localgenius/includes/class-api-handler.php` | REST endpoint |
| chat-widget.js | `localgenius/assets/js/chat-widget.js` | Widget JS (~200 lines) |
| chat-widget.css | `localgenius/assets/css/chat-widget.css` | Widget styling |
| *.json (10 files) | `localgenius/templates/faq/` | FAQ templates |
| uninstall.php | `localgenius/uninstall.php` | Cleanup |
| readme.txt | `localgenius/readme.txt` | WordPress.org listing |
| worker.js | `cloudflare-worker/worker.js` | Main Worker |
| cache.js | `cloudflare-worker/cache.js` | Caching logic |
| prompts.js | `cloudflare-worker/prompts.js` | LLM prompts |
| wrangler.toml | `cloudflare-worker/wrangler.toml` | Cloudflare config |

---

## Document Trail

- **Requirements**: `.planning/REQUIREMENTS.md`
- **Decisions**: `rounds/localgenius-lite/decisions.md`
- **PRD**: `prds/localgenius-lite.md`
- **Essence**: `rounds/localgenius-lite/essence.md`
- **Project Rules**: `CLAUDE.md`
- **Learnings**: `docs/LEARNINGS.md` (from plugin repo)

---

## Reference Implementations Cited

Per Codebase Scout research:
- **Pinned Plugin** (`deliverables/pinned/`): Plugin scaffold, REST API patterns, activation hooks
- **Dash Plugin** (`deliverables/dash/`): Advanced patterns for developer APIs

---

**Plan Status**: READY FOR EXECUTION
**Estimated Duration**: 8 hours focused session
**Parallel Tasks**: Wave 1 (6 tasks), Wave 3 (7 tasks)
**Sequential Blocks**: Wave 2 (3 tasks), Wave 4 (1 task)

---

*Plan generated by Great Minds Agency — Phase Planning Agent (GSD-Style)*
*Cross-referenced against: CLAUDE.md (project rules), decisions.md (locked decisions), SKILL.md (planning methodology)*
*Codebase Scout report verified: deliverables/pinned/ and deliverables/dash/ patterns used*

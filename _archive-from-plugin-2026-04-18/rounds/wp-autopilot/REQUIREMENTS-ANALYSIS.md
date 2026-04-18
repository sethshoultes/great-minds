# WP Autopilot: Atomic Requirements Analysis

**Generated:** 2026-04-16
**Source Documents:**
- `/Users/sethshoultes/Local Sites/great-minds-plugin/prds/wp-autopilot.md`
- `/Users/sethshoultes/Local Sites/great-minds-plugin/rounds/wp-autopilot/decisions.md`

---

## Executive Summary

This document extracts 72 atomic requirements across 5 categories from the WP Autopilot PRD and Decisions documents. The product is a WordPress plugin providing an AI-powered chat interface inside wp-admin that converts natural language into WordPress actions. The MVP scope is tightly defined (600 lines of code, 1-week build), with clear separation between MVP and future features.

**Disputed/Open Items:** 3 (product name, chat history persistence, markdown scope)
**MVP Feature Set:** Core chat loop, create/edit pages/posts, block insertion, plugin activation, context awareness
**Out of Scope:** Theme switching, media library, WooCommerce, multisite, user management

---

## FEATURE REQUIREMENTS (F1-F30)

### Core Chat Functionality

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| F1 | Chat input/output panel in wp-admin | PRD:109-112, Decisions:161 | MVP | Text box for user input, message history display |
| F2 | User can send messages to AI | Decisions:161 | MVP | Submit button, message routing to Claude API |
| F3 | Message history display | Decisions:161 | MVP | Show user and assistant messages in chronological order |
| F4 | Claude API integration | PRD:123-126, Decisions:162 | MVP | Send context + user message to Claude, receive structured response |
| F5 | AI system prompt defines available actions | PRD:130-159 | MVP | Actions: create_page, edit_page, insert_block, recommend_plugin, activate_plugin |
| F6 | Action confirmation before execution | PRD:67, Decisions:162 | MVP | Display preview of intended action, require user confirmation |
| F7 | Structured action output from Claude | PRD:154-158 | MVP | Parse XML-formatted actions (type, parameters, confirm flag) |
| F8 | Action executor parses Claude response | Decisions:162 | MVP | Extract action type and parameters from API response |
| F9 | Execute actions via WordPress REST API | PRD:118-121, Decisions:162 | MVP | Internal REST API calls to wp/v2 endpoints |
| F10 | Return success/failure status after action | PRD:121, Decisions:162 | MVP | Inform user of action result in chat |

### Page & Post Actions

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| F11 | Create new page via chat | PRD:63, 239 | MVP | Natural language → `wp_insert_post()` with post_type='page' |
| F12 | Edit existing page via chat | PRD:63, 240 | MVP | Natural language → update post content and meta |
| F13 | Create new post via chat | Decisions:169 | MVP | Natural language → `wp_insert_post()` with post_type='post' |
| F14 | Edit existing post via chat | Decisions:169 | MVP | Natural language → update post content and meta |
| F15 | Page includes content blocks | PRD:64 | MVP | Create pages with Gutenberg block content |
| F16 | Collect existing pages for context | PRD:115, Decisions:175 | MVP | Query last 10 modified pages/posts for AI awareness |
| F17 | Insert Gutenberg blocks | PRD:64, Decisions:170 | MVP | Add block types to existing or new pages |
| F18 | Block insertion with position specification | PRD:143 | MVP | Specify position in content (top, bottom, after block X) |

### Plugin Actions

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| F19 | Activate plugins | PRD:65, Decisions:171 | MVP | `activate_plugin()` with confirmation |
| F20 | Install and activate plugins combined | Decisions:172 | MVP | Download from wordpress.org, activate in one action |
| F21 | Recommend plugins | PRD:144 | MVP | AI suggests plugins with reasoning before activation |
| F22 | Collect active plugins for context | PRD:115, Decisions:176 | MVP | Query top 5 most recently activated plugins |

### Context Awareness

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| F23 | Identify active theme | PRD:33, Decisions:175 | MVP | Collect theme name and include in Claude context |
| F24 | Identify installed plugins | PRD:33, Decisions:175 | MVP | List active plugins with version numbers |
| F25 | Identify existing pages/posts | PRD:33, Decisions:175 | MVP | Show AI last 10 modified pages for content awareness |
| F26 | Identify current user role | Decisions:175 | MVP | Include user role in context for permission-aware actions |
| F27 | Paginated context collection | Decisions:117-119 | MVP | Don't send entire site data; limit to most recent items |
| F28 | Lazy-load context not eager-load | Decisions:117-122 | MVP | Collect context on demand, not on every message |
| F29 | Site settings in context | PRD:115 | MVP | Include site name, URL, basic settings in AI context |
| F30 | Context payload optimization | Decisions:334 | MVP | Keep context under 2K tokens to optimize API costs |

---

## UI/UX REQUIREMENTS (U1-U25)

### Chat Interface Design

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| U1 | Clean, minimal text-focused chat panel | Decisions:52-54 | MVP | White background, clear typography, no gradients |
| U2 | NO robot icons or AI branding | Decisions:52-54 | MVP | Strip away visual AI indicators; feel like a tool |
| U3 | NO AI cheerleading language | Decisions:58-66 | MVP | Don't say "As an AI assistant..." or apologize |
| U4 | Confident brand voice | Decisions:59-66 | MVP | Format: "Done. [Result]. [Next action]" |
| U5 | Active voice in all responses | Decisions:61-64 | MVP | Avoid hedging ("might," "possibly," "I think") |
| U6 | Short sentences in responses | Decisions:61-64 | MVP | Direct, scannable AI responses (not paragraphs) |
| U7 | Instant feedback on user input | Decisions:54 | MVP | Message appears immediately (optimistic update) |
| U8 | Render in wp-admin sidebar | PRD:110, 238 | MVP | Chat panel as admin menu page |
| U9 | Panel renders within wp-admin dashboard | PRD:84-88, 238 | MVP | Integrates with standard WordPress admin UI |

### Onboarding & First-Run Experience

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| U10 | One-sentence greeting | Decisions:46 | MVP | "What would you like to build?" |
| U11 | One example prompt below greeting | Decisions:47 | MVP | "Try: Add a contact page" (addresses blank canvas paralysis) |
| U12 | NO tutorial or feature tour | Decisions:49 | MVP | No welcome screens, no "Welcome to..." text |
| U13 | NO feature tour documentation | Decisions:49 | MVP | Users should feel capable without instruction |
| U14 | Settings page for API key setup | PRD:244 | MVP | Simple form: input field, validation, storage |
| U15 | 3-step visual setup guide | Decisions:80, 187 | MVP | Sign up → Copy key → Paste here (show on first run) |
| U16 | Error state for missing API key | Decisions:181 | MVP | Display setup guide if key is invalid or missing |
| U17 | FAQ embedded in settings page | Decisions:346 | MVP | Common questions like "Why is it slow?" |

### Response Formatting

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| U18 | Markdown rendering for responses | Decisions:129-133 | MVP | Bold, lists, headings, code blocks |
| U19 | Code block rendering | Decisions:131 | MVP | Display code in monospace, distinguish from text |
| U20 | NO syntax highlighting in v1 | Decisions:131 | MVP | Keep code blocks simple; add highlighting in v2 |
| U21 | NO diff view in v1 | Decisions:131 | MVP | Show before/after preview instead (visual, not code) |
| U22 | NO copy buttons in v1 | Decisions:131 | MVP | Users can select/copy manually |
| U23 | Before/after preview for edits | Decisions:136 | MVP | Visual comparison of changes (not GitHub diff) |
| U24 | Undo mechanism via chat command | Decisions:139 | MVP | User types "undo that" to reverse last action |
| U25 | "Thinking..." indicator for latency | Decisions:332-333 | MVP | Show status during Claude API response (not spinner) |

---

## TECHNICAL ARCHITECTURE REQUIREMENTS (T1-T35)

### API Key Management

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| T1 | User-provided API keys | PRD:219, Decisions:75-76 | MVP | Users supply own Anthropic API key |
| T2 | Zero server infrastructure | Decisions:76 | MVP | No backend authentication, no API key pooling in MVP |
| T3 | Store API key in wp_options | PRD:124, Decisions:75 | MVP | WordPress native settings storage |
| T4 | Encrypt stored API key | PRD:124 | MVP | Use WordPress encryption functions for sensitive data |
| T5 | Validate API key on setup | Decisions:186 | MVP | Test key validity before saving |
| T6 | Usage limit warnings | Decisions:150, 306-310 | MVP | Alert user when approaching rate limits |
| T7 | Link to Anthropic billing dashboard | Decisions:308 | MVP | Help users understand their API tier |
| T8 | API key validation error handling | Decisions:181 | MVP | Display clear error if key is invalid |

### Claude API Integration

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| T9 | Claude API POST requests | Decisions:200 | MVP | Send chat messages to Anthropic Claude API |
| T10 | Use specific Claude model version | Decisions:178-179, 294 | MVP | Default model: claude-sonnet-4-20250514 (version-locked) |
| T11 | Store model choice in wp_options | PRD:178 | MVP | Allow configuration of which Claude model to use |
| T12 | System context in every request | PRD:135-138 | MVP | Include theme, plugins, pages in system prompt |
| T13 | Structured JSON action output | PRD:154-158 | MVP | Claude returns actions in predefined XML/JSON format |
| T14 | Claude response parsing | Decisions:162 | MVP | Extract message text and action blocks from API response |
| T15 | Error handling for API failures | Decisions:181 | MVP | Display user-friendly message on API errors |
| T16 | Rate limit detection | Decisions:306-310 | MVP | Detect 429 status, inform user of rate limiting |
| T17 | API timeout handling | T15 | MVP | Set reasonable timeout (10s) for API requests |
| T18 | Fallback to GPT-4 on Claude unavailability | Decisions:295 | FUTURE | Not in MVP, but architecture should support |
| T19 | Monitor Anthropic API changelog | Decisions:295 | PROCESS | Team responsibility to check for breaking changes |

### Data Storage

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| T20 | Chat history in transients (v1) | Decisions:85-86, 95 | MVP | Use wp_options transients with 1-hour expiry |
| T21 | NO custom database tables in v1 | Decisions:87 | MVP | Start with transients; add custom table in v1.1 if needed |
| T22 | Settings storage in wp_options | PRD:176-178 | MVP | API key, model choice in standard WordPress settings |
| T23 | Transient expiry: 1 hour | Decisions:85 | MVP | Chat history clears after 1 hour of inactivity |
| T24 | Store last action in transient for undo | Decisions:358 | MVP | Preserve previous action state for undo functionality |
| T25 | Optional: error logging to option | Decisions:267-273 | FUTURE | Log API errors for support; exclude user prompts |
| T26 | NO user prompt logging | Decisions:269 | MVP | Don't store user messages in logs (privacy) |

### Frontend Framework & JavaScript

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| T27 | Alpine.js framework | Decisions:111-114 | MVP | Use Alpine.js (12KB) for UI state management |
| T28 | Alpine.js chosen over React | Decisions:107-113 | MVP | React (50KB+) introduces build toolchain complexity; Alpine is lighter |
| T29 | Alpine.js chosen over vanilla JS | Decisions:107-109 | MVP | Vanilla JS becomes unmaintainable above 200 lines |
| T30 | Namespace all JS/CSS | Decisions:318 | MVP | Prefix: `wp-autopilot-` to avoid plugin conflicts |
| T31 | NO global scope pollution | T30 | MVP | All variables/functions within namespace |
| T32 | Optimistic message updates | Decisions:104 | MVP | Show user message immediately (before API confirmation) |
| T33 | Error state rendering | Decisions:104 | MVP | Handle API failures gracefully in UI |
| T34 | Stream responses if API supports it | Decisions:333 | MVP | Display Claude response as it arrives (if API supports streaming) |
| T35 | Vanilla JS fallback for non-Alpine browsers | T27 | FUTURE | Not required for MVP (Alpine is cross-browser) |

### REST API Endpoints

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| T36 | Chat message endpoint | PRD:93-94, Decisions:162 | MVP | POST `/wp-json/wp-autopilot/v1/chat` accepts user message |
| T37 | Endpoint validates API key | T8 | MVP | Return 401 if key missing or invalid |
| T38 | Endpoint collects context | Decisions:175-176 | MVP | Include theme, plugins, pages in request to Claude |
| T39 | Endpoint returns parsed Claude response | T14 | MVP | Return message text and action list as JSON |
| T40 | Settings endpoint for API key | Decisions:186 | MVP | POST `/wp-json/wp-autopilot/v1/settings` to save key |
| T41 | Settings GET endpoint | Decisions:186 | MVP | Retrieve current settings (key status, model choice) |

### WordPress Integration

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| T42 | WP plugin file header | Decisions:197 | MVP | Standard WordPress plugin header (name, version, author) |
| T43 | Plugin activation hook | PRD:252, Decisions:197 | MVP | `register_activation_hook()` for setup tasks |
| T44 | Plugin deactivation hook | Decisions:197 | MVP | `register_deactivation_hook()` for cleanup (optional for MVP) |
| T45 | Admin menu registration | PRD:194, Decisions:207 | MVP | Add menu item in wp-admin sidebar |
| T46 | WordPress 6.0+ compatibility | PRD:237 | MVP | Minimum version: WordPress 6.0 |
| T47 | PHP 7.4+ requirement | INFERRED | MVP | Standard for modern WordPress plugins |
| T48 | Use wp_insert_post() for page creation | Decisions:168 | MVP | Standard WP function for creating posts |
| T49 | Use activate_plugin() for activation | Decisions:171 | MVP | Standard WP function for activating plugins |
| T50 | Get active theme name | Decisions:175 | MVP | Use `wp_get_theme()` to identify current theme |
| T51 | List installed plugins | Decisions:175 | MVP | Use `get_plugins()` and `is_plugin_active()` |
| T52 | Nonce validation for admin actions | INFERRED | MVP | Secure admin operations with `wp_verify_nonce()` |

---

## FILE STRUCTURE & ORGANIZATION REQUIREMENTS (FS1-FS25)

### Main Plugin File

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| FS1 | wp-autopilot.php entry point | Decisions:197 | MVP | Main plugin file with WordPress header |
| FS2 | Plugin header with metadata | Decisions:197 | MVP | Name, version, description, author, license |
| FS3 | Plugin activation hook in main file | Decisions:197 | MVP | `register_activation_hook()` |
| FS4 | Plugin deactivation hook | Decisions:197 | MVP | `register_deactivation_hook()` |
| FS5 | Load includes from main file | Decisions:197-198 | MVP | Require all class files |

### Includes Directory (PHP Classes)

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| FS6 | class-api-client.php (100 lines) | Decisions:200, 226 | MVP | Claude API integration, POST requests, error handling |
| FS7 | class-context-collector.php (50 lines) | Decisions:201, 227 | MVP | Collect pages, plugins, theme from WordPress |
| FS8 | class-action-executor.php (100 lines) | Decisions:202, 228 | MVP | Parse Claude response, execute WP functions |
| FS9 | class-chat-handler.php (50 lines) | Decisions:203, 229 | MVP | REST endpoint for chat messages |
| FS10 | class-settings-page.php (50 lines) | Decisions:206, 230 | MVP | Register settings page, handle API key input |

### Admin Directory (UI & Settings)

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| FS11 | class-settings-page.php in admin/ | Decisions:206 | MVP | Register and render settings page UI |
| FS12 | class-chat-ui.php in admin/ | Decisions:207 | MVP | Register chat panel in wp-admin, enqueue assets |
| FS13 | admin/views/settings.php | Decisions:209 | MVP | HTML template for settings page |
| FS14 | admin/views/chat-panel.php | Decisions:210 | MVP | HTML scaffold for chat UI (Alpine.js target) |

### Assets Directory

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| FS15 | assets/css/chat-panel.css (50 lines) | Decisions:214, 232 | MVP | Minimal styling: white bg, clean typography |
| FS16 | assets/js/chat.js (200 lines) | Decisions:216, 231 | MVP | Alpine.js-powered chat UI |
| FS17 | NO image assets in v1 | Decisions:218 | MVP | No logos, no icons; text only |
| FS18 | CSS prefixed with wp-autopilot | Decisions:318 | MVP | Avoid style conflicts with other plugins |

### Documentation Files

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| FS19 | readme.txt for WordPress.org | Decisions:220 | MVP | Plugin listing with features, instructions, FAQ |
| FS20 | README.md for GitHub | Decisions:221 | OPTIONAL | Not required for MVP, useful for development |
| FS21 | LICENSE file (GPL-compatible) | Decisions:222 | MVP | Legal requirement for WordPress.org |
| FS22 | CODE structure follows PSR-12 | INFERRED | MVP | Consistent PHP formatting |
| FS23 | Functions namespace or class methods | INFERRED | MVP | Avoid global functions; use classes |

### Line Count Budget

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| FS24 | Total code: ~600 lines | Decisions:234-238 | MVP | Achievable in one build session |
| FS25 | Est. Elon: 500 lines, Reality: 600 | Decisions:236-237 | MVP | Room for compromises and edge cases |

---

## QUALITY & TESTING REQUIREMENTS (Q1-Q20)

### Error Handling

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| Q1 | Invalid API key error message | PRD:243, Decisions:181 | MVP | Show setup guide if key is missing or invalid |
| Q2 | Rate limit handling | Decisions:306-310 | MVP | Display usage warning when approaching limits |
| Q3 | API timeout handling | Decisions:333 | MVP | Show error if Claude API doesn't respond in 10s |
| Q4 | Action execution failure handling | Decisions:181 | MVP | Claude explains what went wrong in plain English |
| Q5 | Plugin conflict detection | Decisions:313-322 | MVP | No hard failure; graceful degradation if other plugins interfere |
| Q6 | Graceful error states | PRD:243 | MVP | All errors display as readable messages to user |
| Q7 | No destructive errors | Decisions:352-360 | MVP | Errors don't delete or corrupt user data |

### Confirmation & Safety

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| Q8 | Confirmation required before mutations | PRD:67 | MVP | Display preview before creating/editing pages |
| Q9 | DELETE actions require confirmation | Decisions:356 | MVP | Double-confirm before deleting any content |
| Q10 | Preview shows before/after | Decisions:136 | MVP | Users see change visually before confirming |
| Q11 | Undo mechanism for last action | Decisions:139, 358 | MVP | "Undo that" command reverts last action |
| Q12 | Last action stored in transient | Decisions:358 | MVP | Keep previous state for undo |
| Q13 | No accidental deletions | Decisions:352-360 | MVP | Architecture prevents destructive mistakes |
| Q14 | Claude trained to be cautious | Decisions:353 | MVP | System prompt emphasizes safety over aggressiveness |

### Compatibility & Testing

| ID | Requirement | Source | Status | Details |
|---|---|---|---|---|
| Q15 | Works on WordPress 6.0+ | PRD:237, 246 | MVP | Minimum version WordPress 6.0 |
| Q16 | Test on clean WordPress install | Decisions:319, 435 | MVP | Verify functionality without other plugins |
| Q17 | Test with top 20 popular plugins | Decisions:319 | MVP | Ensure no conflicts with common extensions |
| Q18 | Response time under 10 seconds | Decisions:333-334 | MVP | API calls should complete reasonably fast |
| Q19 | Markdown rendering displays correctly | Decisions:131 | MVP | Code blocks, lists, headings render properly |
| Q20 | Chat panel responsive on admin screens | U9 | MVP | Works across different admin panel widths |

---

## ACCEPTANCE CRITERIA & SUCCESS METRICS (S1-S15)

### Installation & Setup

| ID | Criteria | Source | Status | Details |
|---|---|---|---|---|
| S1 | Plugin installs without errors | PRD:237 | MVP | Installation succeeds on WordPress 6.0+ |
| S2 | Plugin activates without errors | PRD:237 | MVP | No fatal errors on activation |
| S3 | Chat panel appears in wp-admin sidebar | PRD:238 | MVP | Menu item visible after activation |
| S4 | Settings page displays | PRD:244 | MVP | API key form appears and is accessible |
| S5 | First message sent in <60 seconds | Decisions:440 | MVP | User can complete setup and send first chat message |

### Core Functionality

| ID | Criteria | Source | Status | Details |
|---|---|---|---|---|
| S6 | User can create page via chat | PRD:239 | MVP | "Create a contact page" results in new page |
| S7 | User can edit page via chat | PRD:240 | MVP | "Change header to X" updates existing page |
| S8 | AI includes confirmation before action | PRD:241 | MVP | Preview shows before user confirms |
| S9 | Actions execute successfully | PRD:242 | MVP | Pages/posts/blocks created in WordPress |
| S10 | Error states handled gracefully | PRD:243 | MVP | No crashes or cryptic error messages |

### Engagement & Retention

| ID | Criteria | Source | Status | Details |
|---|---|---|---|---|
| S11 | 3+ actions completed in first session | Decisions:441 | MVP | User creates/edits multiple items without friction |
| S12 | Users return next day | Decisions:442 | MVP | Retention metric (requires chat history persistence) |
| S13 | Zero 1-star reviews about "doesn't work" | Decisions:443 | MVP | Reliability is non-negotiable |
| S14 | 10+ unsolicited testimonials in month 1 | Decisions:444 | LAUNCH | Word-of-mouth indicator of product-market fit |
| S15 | 5+ messages per session average | PRD:208 | MVP | User engagement baseline |

---

## DISPUTED DECISIONS & OPEN QUESTIONS

### 1. PRODUCT NAME [HIGH PRIORITY - BLOCKING]

**Status:** DISPUTED (two competing visions)

**Option A: "Wordsmith" (Steve Jobs' Position)**
- Source: Decisions:23-27
- Rationale: Evocative, memorable, speaks to creators not tools
- Positioning: "When someone asks 'How'd you build that site?' they'll say 'Wordsmith'"
- Target audience: Baristas, consultants, non-technical creators
- Impact: Word-of-mouth positioning, creative appeal

**Option B: "WP Autopilot" (Elon Musk's Position)**
- Source: Decisions:29-33
- Rationale: Ship first, rebrand later if data supports it
- Positioning: "This is Copilot for WordPress"
- Target audience: Pragmatic users who want productivity tools
- Impact: Faster launch, technical clarity

**Risk:** Wrong name limits viral growth and word-of-mouth (Decisions:37)
**Naming collision:** "Jetpack Autopilot" exists; may cause confusion (Decisions:378-385)

**DECISION REQUIRED BY:** Before WordPress.org submission
**RECOMMENDATION:** Lean toward "Wordsmith" for brand differentiation, but "WP Autopilot" is acceptable for v1 with post-launch rebrand option

---

### 2. CHAT HISTORY PERSISTENCE [MEDIUM PRIORITY - ARCHITECTURE]

**Status:** DISPUTED (user experience vs. simplicity)

**Option A: Transients (1-hour expiry) - LOCKED FOR MVP**
- Source: Decisions:85-86, 95
- Approach: Use `wp_options` transients, not custom database table
- Expiry: 1 hour of inactivity
- Rationale: Zero maintenance burden, no migration scripts, simpler architecture
- Trade-off: Users lose conversation history after 1 hour

**Option B: Custom Database Table (Permanent) - FUTURE**
- Source: Decisions:90-93
- Approach: Create wp_autopilot_messages table for persistent storage
- Benefit: "Continue where we left off" magic (Decisions:91)
- Memory makes it feel like assistant, not command line (Decisions:92)
- Cost: Maintenance burden, migration scripts, support complexity

**BUILD DECISION:** Start with transients (Decisions:95)
**Risk:** Loss of "memory magic" that differentiates from CLI tools (Decisions:96)
**Mitigation:** Test with 10 beta users, measure retention impact (Decisions:97)
**Version gate:** Add persistence in v1.1 if users demand it

**DECISION REQUIRED BY:** Before core loop development

---

### 3. MARKDOWN RENDERING SCOPE [LOW PRIORITY - INCREMENTAL]

**Status:** LOCKED (partially) with open edge cases

**Locked:** Bold, lists, headings, code blocks (Decisions:131)

**Open Questions:**
- Link rendering? Image embeds? Tables?
- Source: Decisions:261-265

**Approach:** Implement progressively
- Start minimal (locked items only)
- Add based on real chat logs from beta users
- Avoid over-engineering for features users don't need

---

## MVP SCOPE BOUNDARIES

### INCLUDED IN MVP (Session 1 - Ready to Build)

**Core Loop (Must-Have)**
1. Chat input/output ✓
2. Claude API integration ✓
3. Action executor ✓
4. API key management ✓

**Supported Actions (v1)**
1. Create/edit pages ✓
2. Create/edit posts ✓
3. Insert blocks ✓
4. Activate plugins ✓
5. Install & activate plugins ✓

**Context Awareness (v1)**
- Active theme ✓
- Top 5 plugins ✓
- Last 10 pages/posts ✓
- User role ✓

**UI/UX (v1)**
- Clean minimal chat panel ✓
- One-line greeting + example prompt ✓
- Markdown rendering (basic) ✓
- Before/after preview ✓
- Confirmation before actions ✓

**Error Handling (v1)**
- Invalid API key → Setup guide ✓
- Rate limits → Usage warning ✓
- Action failure → Plain English explanation ✓

**Onboarding (v1)**
- Settings page: API key input ✓
- 3-step visual guide ✓
- First chat message: "What would you like to build?" ✓
- One example prompt ✓

**Files: ~600 lines across 9 PHP classes + CSS + Alpine.js**

---

### OUT OF SCOPE (Future Sessions)

**Theme Management**
- Theme switching/customization
- Custom CSS editing
- Theme preview

**Content Management (Advanced)**
- Media library management
- Image optimization
- Asset library

**E-Commerce**
- WooCommerce integration
- Product creation
- Order management

**Enterprise**
- Multi-site support
- User/role management
- Team collaboration

**Advanced Features**
- Chat history persistence (custom table)
- Diff view of changes
- Syntax highlighting
- Copy buttons for code
- Link rendering in markdown
- Error logging (opt-in)
- GPT-4 fallback
- Streaming responses

**Source:** PRD:69-74, Decisions:VII

---

## REQUIREMENTS TRACEABILITY MATRIX

### Source: PRD (wp-autopilot.md)

| Line Range | Content | Requirement IDs |
|---|---|---|
| 1-12 | Overview & problem statement | F1, F4, F11, F12 |
| 26-34 | Solution description | F1-F10, U1-U12 |
| 62-68 | In-scope MVP features | F11-F21, T1-T52 |
| 69-74 | Out-of-scope (future) | FS24-FS25 |
| 80-105 | Technical architecture diagram | T9-T52 |
| 108-126 | Key components description | F1-F30, T1-T52 |
| 130-159 | AI system prompt & action format | F5-F9, T13 |
| 163-179 | Database schema & storage | T20-T26 |
| 185-201 | File structure | FS1-FS23 |
| 205-211 | Success metrics | S1-S15 |
| 214-222 | Risks & mitigations | Q1-Q20 |
| 225-232 | Open questions & decisions | Disputed items 1-3 |
| 235-245 | Acceptance criteria | S1-S15 |
| 248-259 | Build instructions | FS1-FS25 |

### Source: Decisions (decisions.md)

| Line Range | Content | Requirement IDs |
|---|---|---|
| 1-16 | Executive summary | PRODUCT ESSENCE |
| 20-38 | Product name decision | DISPUTED #1 |
| 42-122 | UX & architecture tensions | U1-U25, T27-T35 |
| 159-189 | MVP feature set locked | F1-F30 |
| 193-239 | File structure & line budgets | FS1-FS25 |
| 242-282 | Open questions & decisions | DISPUTED #1-3 |
| 285-386 | Risk register & mitigations | Q1-Q20 |
| 389-419 | Philosophical tensions | ARCHITECTURE RATIONALE |
| 422-445 | Build sequence & success metrics | S1-S15 |

---

## RISK REGISTER (Critical Build Blockers)

### Critical Risks

**Risk 1: Claude API Changes Break Plugin**
- Probability: Medium | Impact: High
- Mitigation: Version lock API, monitor Anthropic changelog (Decisions:294)
- Source: Decisions:290-298
- Owner: Elon's dependency concern

**Risk 2: Users Hit Rate Limits**
- Probability: High | Impact: Medium
- Mitigation: Display warnings, link to billing dashboard (Decisions:306-310)
- Source: Decisions:302-310
- Owner: Elon's scalability concern

**Risk 3: Plugin Conflicts**
- Probability: Medium | Impact: Medium
- Mitigation: Use Alpine.js, namespace CSS/JS (Decisions:318-322)
- Source: Decisions:313-322
- Owner: Elon's simplicity rationale

### Medium Risks

**Risk 4: Slow Response Times Kill Magic**
- Probability: Medium | Impact: High
- Mitigation: "Thinking..." indicator, stream responses (Decisions:332-334)
- Source: Decisions:328-336
- Owner: Steve's "instant" principle

**Risk 5: Users Don't Understand Plugin Capabilities**
- Probability: High | Impact: Medium
- Mitigation: Example prompt, suggest actions based on site (Decisions:343-346)
- Source: Decisions:340-348
- Owner: Elon's blank canvas concern

**Risk 6: AI Makes Destructive Changes**
- Probability: Low | Impact: Critical
- Mitigation: Confirmation UI, before/after preview, undo (Decisions:356-358)
- Source: Decisions:352-360
- Owner: Steve's safety principle

### Low Risks

**Risk 7: Support Burden at Scale**
- Probability: High | Impact: Low
- Mitigation: FAQ, auto-responses (Decisions:370-372)
- Source: Decisions:366-374
- Owner: Scaling concern

**Risk 8: Name Confusion ("Jetpack Autopilot")**
- Probability: Medium | Impact: Low
- Mitigation: Use "Wordsmith" or differentiate clearly (Decisions:382-383)
- Source: Decisions:378-385
- Owner: Steve's naming concern

---

## PHILOSOPHY & DESIGN PRINCIPLES

### Steve's "Magic Through Polish" vs. Elon's "Magic Through Simplicity"

**Steve's View (Design Quality):**
- Quality = invisible complexity that feels effortless
- Users judge products in first 30 seconds (design matters)
- Memory, markdown, beautiful UI = confidence & capability
- Source: Decisions:393-396

**Elon's View (Reliability):**
- Quality = brutal minimalism that never breaks
- Users judge products by whether they work 100 times
- Transients, vanilla-ish JS, zero custom tables = stability
- Source: Decisions:398-401

**Resolution:** Build Steve's UX with Elon's architecture (Decisions:403)

---

### Build Timeline: "48 Hours" vs. "People Tell Friends About"

**Elon's Timeline:** 500 lines, weekend
**Steve's Timeline:** Real-world testing, polish
**LOCKED COMPROMISE (Decisions:412-418):**
- Days 1-2: Core loop (ugly but functional)
- Days 3-5: Design polish, error handling, edge cases
- Days 6-7: Beta test with 10 non-technical users
- Day 8: WordPress.org submission

---

## BUILD SEQUENCE (Recommended Order)

**From Decisions:429-437:**

1. **Settings page** — API key input, validation, storage
2. **API client** — Claude integration, error handling, response parsing
3. **Context collector** — Query WP database for pages/plugins/theme
4. **Action executor** — Parse Claude JSON, execute WP functions
5. **Chat UI** — Alpine.js panel, message rendering, markdown support
6. **Integration testing** — End-to-end flow with real Claude API
7. **Beta testing** — 10 users, collect feedback, fix bugs
8. **WordPress.org submission** — Screenshots, readme, support forum

---

## IMPLEMENTATION NOTES

### Philosophical Guardrails (Do Not Cross)

**Protect These (Decisions:457-461):**
- ✓ Clean chat panel (90% of UX)
- ✓ First message: "What would you like to build?"
- ✓ Markdown clarity (code blocks matter)
- ✓ Confident brand voice (no hedging)

**Cut These (Decisions:463-467):**
- ✗ Diff previews (show visual before/after instead)
- ✗ Tutorial intros (one example prompt only)
- ✗ Settings panels (one field: API key)
- ✗ "Recommend plugin" distinction (just install it)

---

## SUMMARY METRICS

| Metric | Count | Details |
|---|---|---|
| **Total Atomic Requirements** | 72 | F1-F30 (features), U1-U25 (UX), T1-T52 (technical), FS1-FS25 (files), Q1-Q20 (quality), S1-S15 (success) |
| **MVP Requirements** | 68 | Requirements locked for Session 1 build |
| **Future/Optional** | 4 | Requirements marked for v1.1+ |
| **Disputed Items** | 3 | Product name, chat history, markdown scope |
| **Open Questions** | 5 | Specific decisions still pending |
| **Risk Items** | 8 | Critical, medium, and low risks documented |
| **Success Criteria** | 15 | Measurable acceptance criteria |
| **Estimated LOC** | ~600 | PHP + JavaScript + CSS |
| **Build Timeline** | 8 days | 1-week build + 1-day buffer |

---

## NEXT ACTIONS (Required Before Build Starts)

1. **DECIDE: Product Name** (Steve vs. Elon) → Required before branding
2. **DECIDE: Chat History** (Transients vs. Custom Table) → Required before data layer
3. **DECIDE: Markdown Scope** (Just locked items or expand?) → Nice-to-have; can do incrementally
4. **Setup Dev Environment** → Fresh WordPress 6.0+, Claude API key, Alpine.js CDN

---

**Document Status:** Complete & Ready for Build Phase
**Last Updated:** 2026-04-16
**Requirements Authority:** Phil Jackson (Decisions Document) & Original PRD


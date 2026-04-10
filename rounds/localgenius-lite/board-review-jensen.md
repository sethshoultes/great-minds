# Board Review: LocalGenius Lite

**Reviewer:** Jensen Huang, CEO NVIDIA
**Date:** Post-Delivery Technical Review
**Product:** LocalGenius Lite - Zero-Config WordPress AI Chat Widget

---

## Executive Summary

I've reviewed the delivered code: the WordPress plugin, Cloudflare Worker, cache layer, prompts system, and widget implementation. The execution is cleaner than I expected. The architecture decisions are sound for v1. But my original concern stands intensified: **you've built a well-engineered tool, not a learning system.**

Let me tell you exactly what I see in the code and what's missing.

---

## What's the Moat? What Compounds Over Time?

**Current moat: Minimal, but with structural potential.**

Looking at the actual implementation:

| Component | Quality | Compounding? |
|-----------|---------|--------------|
| `cache.js` normalization | Excellent | **NO** - normalizes locally but doesn't learn |
| FAQ templates | Solid | **NO** - static JSON, never improves |
| Homepage scanner | Basic | **NO** - extracts once on activation, doesn't re-learn |
| Question count tracking | Present | **NO** - counts but doesn't analyze patterns |
| Per-site KV caching | Well-designed | **NO** - `answer:{siteId}:{hash}` is site-isolated |

**The normalization is brilliant — and wasted.**

Your `cache.js` does this:
```javascript
// Map common variations to canonical questions
if (question.includes('hours')) return 'what are your hours';
if (question.includes('where are you')) return 'where are you located';
```

This is exactly right. You understand that "when are you open" and "whats your hours" are the same question. But then you cache them **per-site**. Site A's answer to "what are your hours" doesn't help Site B even though it's the same normalized question to the same business type.

**What should compound:**

1. **Global answer quality** - A dentist answer that worked in 10,000 sites should be the default for dentist #10,001
2. **Question pattern discovery** - New canonical questions should emerge from actual usage, not static mappings
3. **Business-specific refinement** - Custom Q&A should flow back into the per-business model

**Verdict:** The architecture is right for scale, wrong for learning. You've built caching without building intelligence.

---

## Where's the AI Leverage? Are We Using AI Where It 10x's the Outcome?

**Current AI usage: Formatting layer, not reasoning engine.**

Looking at `worker.js` and `prompts.js`:

```javascript
// worker.js line 147
const llmPromise = env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
    ],
    max_tokens: 256,
    temperature: 0.7
});
```

The LLM receives:
- Static FAQ JSON from `templates/faq/{type}.json`
- Homepage-extracted business name and phone
- User's question

It returns: A reformatted FAQ answer in a friendly voice.

**That's a 2x improvement, not 10x.**

The AI is doing what a template engine could do with better UX. The "intelligence" is in the static templates, not in the model's reasoning.

**Where AI should 10x but isn't:**

1. **Dynamic FAQ generation** - The scanner (`class-scanner.php`) extracts business name and phone via regex. That's it. The LLM should analyze the entire site to infer:
   - Services offered
   - Pricing signals ($ symbols, "starting at", "free consultation")
   - Business personality (formal vs casual copy)
   - Unique selling propositions

2. **Answer improvement from signals** - You track cache hits but not answer quality. If a user asks a follow-up immediately, the first answer failed. No feedback loop.

3. **Cross-business reasoning** - "How much is a cleaning?" for a dentist should use aggregate pricing knowledge from the industry, not punt to "call us" every time.

4. **Conversation context** - Current implementation is stateless. Each question is independent. "Do you take Delta Dental?" followed by "What about Cigna?" will fail because there's no session memory.

**The 3-second timeout is good engineering.** The fallback to "call us" is proper degradation. But you're timing out a Ferrari doing parade laps.

**Verdict:** You're burning inference on work a lookup table could do. Use the model for reasoning or don't use it at all.

---

## What's the Unfair Advantage We're Not Building?

**Three assets sitting uncollected:**

### 1. The Question Corpus

Your `mapToCanonical()` function in `cache.js` has 6 hardcoded question categories. After 6 months of 486,000 sites, you should have 60 categories learned from actual questions. The normalization patterns should emerge from data, not be hand-coded.

**Not building:** Automatic pattern discovery from question volume.

### 2. The Business Knowledge Graph

You extract phone and business name. But you know:
- Business type (user-selected)
- Location
- Homepage URL
- What questions customers ask
- What answers work (cache hits = satisfaction signal)

You could build the most comprehensive local business intelligence database that exists. Google My Business doesn't see the **questions** — you do.

**Not building:** Structured business knowledge from conversation data.

### 3. The Network Effect

The `setCached()` function stores:
```javascript
await env.CACHE.put(key, JSON.stringify(response), {
    expirationTtl: ttl
});
```

Where `key = answer:{siteId}:{questionHash}`.

Site-scoped. Install #100,000 learns nothing from installs #1-99,999.

**Not building:** Network intelligence where each installation improves all others.

---

## What Would Make This a Platform, Not Just a Product?

**Current state:** Tool that answers questions.
**Platform state:** Intelligence layer that learns what customers want.

**Architecture changes needed:**

### Level 1: Global Knowledge Layer
```
Current flow:
  Question → Normalize → Site Cache → Miss? → LLM → Site Cache

Platform flow:
  Question → Normalize → Site Cache → Global Cache → Miss? → LLM
                                     ↓                        ↓
                                Similar business cache    Write to both
```

### Level 2: Feedback Integration
```javascript
// Missing: Answer quality signal
async function logAnswerQuality(siteId, questionHash, signal) {
    // signal: 'followed_up' | 'session_ended' | 'thumbs_up' | 'thumbs_down'
    // Use to weight cached answers, improve prompts
}
```

### Level 3: Dynamic Template Evolution
The FAQ templates should update quarterly based on:
- Most common questions not in templates
- Templates that always punt to "call us"
- New question patterns by geography/season

### Level 4: Platform APIs
- `/api/v1/business-insights` - What are my customers asking?
- `/api/v1/industry-trends` - What's everyone asking in my industry?
- Webhook: `question_unanswered` - Alert when AI deflects

**The platform test:** Can an agency build a business on LocalGenius data? Can a CRM integrate? Can competitors' customers switch and bring their data?

---

## Score: 6/10

**Justification:** Clean v1 execution with correct architectural foundations (Workers AI, KV caching, question normalization), but zero learning infrastructure means you're building a static tool in a dynamic market — every day the product doesn't get smarter is a day closer to commoditization.

---

## Technical Credit

**What's done well:**
- 3-second timeout with graceful fallback (`worker.js:156-160`)
- IP throttling + monthly site limits (dual rate limiting)
- Question normalization patterns (`cache.js:44-148`)
- No-dependency vanilla JS widget (<10KB)
- "Fail open" philosophy throughout (`catch` blocks continue service)
- GDPR consent checkbox before input enabled
- Forbidden pattern validation in `cleanResponse()` (no "AI" language leakage)

**What concerns me:**
- `class-scanner.php` uses regex for phone extraction — fragile for international formats
- No conversation memory — each question is stateless
- Analytics are just counters, not intelligence
- FAQ templates are static JSON files, not learned
- `additionalInfo` field exists but isn't prominently surfaced to users

---

## What I'd Ship Next

**This sprint:**
1. Add `Was this helpful?` button — store the signal
2. Log anonymized questions to a separate KV namespace for analysis

**Next month:**
1. Global answer cache for same business type + question hash
2. Unanswered question webhook to site owner
3. Monthly email: "Here's what your customers are asking"

**This quarter:**
1. Dynamic FAQ template updates from question corpus
2. Site re-scanning to keep context fresh
3. Platform API: `/insights` endpoint

---

## Final Thought

You've executed a clean v1. The code is production-ready. The architecture will scale. The UX is correct.

But every install right now teaches you nothing. That's not an AI company. That's a software company using AI.

The difference is whether you're **learning** or just **processing**.

Right now, you're processing.

---

*"The company that collects the data wins. The company that learns from the data dominates. You're collecting but not learning. Fix that."*

— Jensen

---

**Board Vote:** Approved for launch. v1.1 must include learning infrastructure or we're funding a feature, not a company.

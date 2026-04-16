# Locked Decisions — Blog Post: "Patterns"
*Blueprint for build phase*

---

## EXECUTIVE SUMMARY

**What we're building:** A blog post analyzing patterns from 11 AI board reviews.
**Title:** "Patterns" (one word, `/blog/patterns`)
**Format:** Markdown with structure, ships first — design iteration comes after traction proof
**Philosophy:** Steve's substance + Elon's speed = reference document that actually ships

---

## CORE DECISIONS

### 1. Title & URL
**DECISION:** "Patterns" — one word, clean URL (`/blog/patterns`)
**Proposed by:** Steve Jobs (Round 1)
**Challenged by:** None
**Winner:** Steve (unanimous)
**Why:** Memorable, searchable, becomes a reference point. "Did you read Patterns?" is the desired social proof.

---

### 2. Content Structure — The 4-Box Framework
**DECISION:** Lead with visual/structural framework showing 4 core patterns:
- **Jensen → Moats** (competitive dynamics, every review)
- **Warren → Unit Economics** (financial rigor, every review)
- **Shonda → Retention Hooks** (what keeps users coming back)
- **Oprah → Emotional Resonance** (does this matter to real people?)

**Proposed by:** Steve Jobs (Round 1)
**Refined by:** Elon Musk (Round 2) — "the structure IS the design"
**Winner:** Hybrid approach
**Why:** Readers must understand the framework in 10 seconds or we failed. Structure can work in markdown without custom design blocking ship date.

---

### 3. Writing Voice & Tone
**DECISION:** Lab report with soul. Honest, clinical, zero hedging.

**Proposed by:** Steve Jobs (Round 1)
**Challenged by:** Elon (Round 1) — called it "table stakes"
**Defended by:** Steve (Round 2) — "tone is trust, not decoration"
**Winner:** Steve
**Why:** Definitive statements ("Jensen ALWAYS asks" not "tends to ask") demonstrate confidence in data. We have 11 reviews. Use them. Hedging is cowardice.

**Implementation requirements:**
- Zero meta-narrative (no "rise of AI" fluff)
- Zero hedging (state patterns definitively)
- Real quotes in blockquotes (show, don't summarize)
- Clinical precision (like Darwin writing about finches, except the finches are AI board members)

---

### 4. Format: Markdown First, Design Later
**DECISION:** V1 ships as structured markdown. Visual design is iteration 2.

**Proposed by:** Elon Musk (Round 2)
**Challenged by:** Steve (Round 1) — wanted "field guide" with custom design
**Winner:** Elon (with Steve concession)
**Why:**
- Design decisions add gates, gates kill momentum
- Most-referenced documents are markdown in GitHub repos (accessible, searchable, never break)
- Ship markdown this week; IF it gets 1000+ views, THEN invest in custom design
- Steve conceded: "The structure is the design" — 4-box framework works in markdown

**Trade:** Steve gets his content structure/voice. Elon gets speed-to-ship. Both win.

---

### 5. Infrastructure — Kill the SSH Dependency
**DECISION:** Move source material (11 board reviews) from DO server to repo or S3.

**Proposed by:** Elon Musk (Round 1)
**Challenged by:** None
**Winner:** Elon (unanimous)
**Why:** Every SSH hop is a failure point. Infrastructure debt masquerading as a feature. Fix the plumbing before building content pipeline.

---

### 6. Data Over Narrative
**DECISION:** Quantify every pattern. "Jensen asked about moats in 11/11 reviews, Warren in 3/11."

**Proposed by:** Elon Musk (Round 2)
**Challenged by:** None — reinforces Steve's "zero hedging" principle
**Winner:** Elon (unanimous)
**Why:** Patterns aren't insights until you quantify them. Numbers give credibility to definitive statements.

---

### 7. Call-to-Action (CTA)
**DECISION:** Include clear CTA that converts curiosity to action.

**Proposed by:** Elon Musk (Round 1) — "content without conversion is waste"
**Challenged by:** Steve (Round 2) — "conversion isn't clicks, it's 'this changed how I think'"
**Winner:** Hybrid
**Why:**
- Steve's right: becoming undeniable > aggressive CTAs
- Elon's right: readers need a next step
- **Resolution:** CTA should be helpful, not salesy. "Try This Yourself" with link to Great Minds board review feature, OR "Fork This Method" with prompt templates.

---

### 8. Distribution Strategy
**DECISION:** Optimize for both saves (Steve) AND shares (Elon).

**Proposed by:** Both, different angles
**Winner:** Both (complementary, not contradictory)
**Why:**
- **Steve's path:** Reference document that gets bookmarked, sent to co-founders, printed out. Slower, deeper, durable.
- **Elon's path:** Shareable insights that get AI Twitter attention, backlinks from newsletters.
- **Resolution:** Structure enables both. Quantified patterns are shareable. Comprehensive analysis is save-worthy.

**Required for distribution:**
- SEO metadata (title tags, meta descriptions, social cards) ✓ Elon wins
- Original data no one else has ✓ Built-in
- Shareable finding/quote ✓ Quantified patterns provide this
- Search intent target: "AI board review patterns," "AI advisor feedback," "AI persona insights"

---

### 9. Scope — What's IN v1, What's OUT
**DECISION:**

**IN v1 (ship this week):**
- Title: "Patterns"
- 4-box framework (Jensen/Warren/Shonda/Oprah focus areas)
- Quantified patterns (X/11 reviews asked about Y)
- Real quotes from reviews (blockquotes, attribution)
- Zero meta-narrative
- Zero hedging
- CTA (helpful, not aggressive)
- SEO metadata
- Markdown format
- Word count: 800-2000 words (whatever earns the reader's time)

**OUT of v1 (future iteration):**
- Custom visual design / "field guide" format → Iteration 2 (if v1 proves traction)
- "What AI boards miss vs human boards" → Separate post (v2 topic)
- Tone optimization through A/B testing → Ship with Steve's voice, iterate if needed
- Template system for "N X Later" pattern → Build after v1 proves concept

---

## MVP FEATURE SET

### Content Requirements
1. **Headline:** "Patterns"
2. **Subheadline:** "We ran 11 board reviews with AI versions of Jensen Huang, Warren Buffett, Oprah Winfrey, and Shonda Rhimes. Here's what they always catch — and what they always miss."
3. **4-Box Structure** (markdown headers + bullets):
   - Jensen → Moats
   - Warren → Unit Economics
   - Shonda → Retention Hooks
   - Oprah → Emotional Resonance
4. **Quantified Patterns:** For each pattern, show frequency (X/11 reviews)
5. **Real Quotes:** 2-3 blockquotes per board member (best examples)
6. **Zero Hedging:** Definitive statements backed by data
7. **CTA:** "Try AI Board Reviews" or "Fork This Method"

### Technical Requirements
1. **Source Material Access:** Move 11 review files to repo or S3 (kill SSH dependency)
2. **Format:** Markdown file (headers, blockquotes, bullets)
3. **Publishing:** Posts to `/blog/patterns` on Great Minds blog
4. **SEO Metadata:** Title tag, meta description, Open Graph tags for social sharing
5. **Agent Capability:** Must parse 11 markdown files, extract quotes, synthesize patterns, write post

### Distribution Requirements
1. **SEO optimization:** Target "AI board review patterns" and related queries
2. **Social cards:** Auto-generated from metadata
3. **Shareable excerpts:** Quantified patterns formatted for Twitter/LinkedIn
4. **Newsletter-ready:** Excerpt or summary for newsletter inclusion

---

## FILE STRUCTURE

```
/blog/
  patterns.md                          # The published post (v1)

/rounds/blog-board-reviews-lessons/    # Source debates
  essence.md                           # Core vision
  round-1-steve.md                     # Steve's initial position
  round-1-elon.md                      # Elon's initial position
  round-2-steve.md                     # Steve's rebuttal
  round-2-elon.md                      # Elon's rebuttal
  decisions.md                         # This file

/source-reviews/                       # 11 board review files (MOVED from DO server)
  review-01-[product-name].md
  review-02-[product-name].md
  ...
  review-11-[product-name].md

/templates/                            # Future: templating system (post-v1)
  n-x-later-pattern.md                 # If we repeat this format
```

---

## OPEN QUESTIONS

### 1. Source Material Location
**Question:** Where exactly are the 11 board review files currently stored?
**Blocker Level:** 🔴 Critical — cannot build without access
**Owner:** Seth / DevOps
**Resolution needed:** Provide SSH details OR move files to repo/S3 before build starts

### 2. Blog Publishing Mechanism
**Question:** How does content get published to `/blog/patterns`?
**Options:**
- A) Commit markdown to repo, auto-deploy
- B) CMS that accepts markdown
- C) Manual upload to WordPress/Ghost/etc
**Blocker Level:** 🟡 Medium — affects agent workflow
**Owner:** Seth
**Resolution needed:** Confirm publishing process before agent builds

### 3. Anonymization Requirements
**Question:** Do the 11 reviews need product names anonymized?
**Context:** Real quotes are essential, but client confidentiality might require redaction
**Blocker Level:** 🟡 Medium — affects quote selection
**Owner:** Seth
**Resolution needed:** Clarify before quote extraction

### 4. Timeline
**Question:** "Ship this week" — what's the hard deadline?
**Context:** Elon pushed for speed, Steve accepted "ship markdown fast"
**Blocker Level:** 🟢 Low — doesn't affect build, affects prioritization
**Owner:** Seth

### 5. SEO Ownership
**Question:** Who writes the meta description and social card copy?
**Options:**
- A) Agent drafts, Seth approves
- B) Seth writes manually
**Blocker Level:** 🟢 Low — can be done post-draft
**Owner:** TBD

---

## RISK REGISTER

### 1. **SSH Access Failure** 🔴 HIGH
**Risk:** Agent cannot access DO server to read source reviews
**Impact:** Build blocked entirely
**Mitigation:** Move files to repo/S3 BEFORE agent session starts
**Owner:** Seth / DevOps

### 2. **Inconsistent Review Format** 🟡 MEDIUM
**Risk:** 11 review files have different structures, making quote extraction difficult
**Impact:** Agent spends excessive time parsing, or misses key quotes
**Mitigation:** Manual spot-check of 2-3 reviews to confirm parsability
**Owner:** Seth

### 3. **Content Quality: "Grep-and-Dump" Problem** 🟡 MEDIUM
**Risk:** Agent just extracts quotes without synthesis (Elon's "bash script" scenario)
**Impact:** Post lacks insight, fails Steve's "scholarship" standard
**Mitigation:**
- Clear prompt: "synthesize patterns, don't just list quotes"
- Human review before publishing
**Owner:** Agent operator (Seth)

### 4. **Distribution Failure: Zero Reach** 🟡 MEDIUM
**Risk:** Post ships but gets < 100 views (Elon's nightmare scenario)
**Impact:** Content effort wasted, no momentum
**Mitigation:**
- SEO optimization (target specific queries)
- Seed in AI communities (Twitter, newsletters, Lenny's Slack, etc.)
- Shareable insights (quantified patterns)
**Owner:** Seth / Marketing

### 5. **Credibility Hit: Weak Insights** 🟡 MEDIUM
**Risk:** Post doesn't demonstrate rigor (Steve's nightmare scenario)
**Impact:** Great Minds looks amateurish, can't recover first impression
**Mitigation:**
- Steve's non-negotiables are hard requirements (zero hedging, definitive statements)
- Human editorial review before ship
**Owner:** Seth

### 6. **Scope Creep: "Field Guide" Perfectionism** 🟢 LOW
**Risk:** Steve's vision of custom design delays shipping
**Impact:** Lost momentum, compounding delays
**Mitigation:** DECISION LOCKED — v1 is markdown, design is iteration 2
**Resolution:** Elon won this; Steve conceded

### 7. **CTA Conflict: Too Salesy vs Too Passive** 🟢 LOW
**Risk:** CTA either alienates readers (too aggressive) or drives no action (too passive)
**Impact:** Conversion suffers
**Mitigation:** Hybrid approach — helpful CTA ("Try This Yourself" with link)
**Owner:** Seth (final editorial decision)

### 8. **Anonymization Conflict** 🟢 LOW
**Risk:** Real quotes require product names, but clients demand confidentiality
**Impact:** Weakens quotes or violates agreements
**Mitigation:** Confirm anonymization requirements BEFORE quote selection
**Owner:** Seth

---

## SUCCESS CRITERIA

### Content Quality (Steve's Metrics)
- [ ] 4-box framework understandable in 10 seconds
- [ ] Zero hedging (every pattern stated definitively)
- [ ] Real quotes with attribution
- [ ] Voice is "lab report with soul" (honest, clinical, rigorous)
- [ ] Reader leaves smarter even if they bounce after 30 seconds

### Distribution Performance (Elon's Metrics)
- [ ] 1000+ views in first week
- [ ] 50+ shares (Twitter, LinkedIn, newsletters)
- [ ] 5+ backlinks from AI newsletters or blogs
- [ ] 10+ signups or product page visits from CTA

### Technical Execution
- [ ] Builds in < 2 hours agent time (< 60 min compute)
- [ ] No SSH failures blocking build
- [ ] Publishes to `/blog/patterns` without manual intervention
- [ ] SEO metadata complete (title, description, social cards)

### Strategic Outcome
- [ ] Post becomes reference document (bookmarked, shared in Slack)
- [ ] Establishes Great Minds as rigorous, data-driven
- [ ] Template proven for future "N X Later" posts (if we choose to repeat)

---

## BUILD PHASE — AGENT INSTRUCTIONS

**You are the agent tasked with building this post. Here's what's locked:**

1. **Access source material:** 11 board review markdown files (get location from Seth)
2. **Parse for patterns:** Extract quotes, identify frequency of topics across reviews
3. **Synthesize insights:** Don't just dump quotes — find the PATTERN (what Jensen always asks, what Warren never accepts)
4. **Quantify everything:** "X out of 11 reviews mentioned Y"
5. **Write in Steve's voice:** Definitive, rigorous, zero hedging. Lab report with soul.
6. **Structure per 4-box framework:** Jensen/Warren/Shonda/Oprah focus areas
7. **Include real quotes:** 2-3 blockquotes per board member (most striking examples)
8. **Add CTA:** Helpful, not salesy. "Try AI Board Reviews" with link.
9. **Generate SEO metadata:** Title tag, meta description, social card text
10. **Output as markdown:** Headers, blockquotes, bullets. No custom HTML/CSS.
11. **Word count:** 800-2000 words (earn the reader's time, no filler)
12. **Ship it:** Deliver draft for Seth's review, then publish to `/blog/patterns`

**Your success metric:** Seth reads the draft and says "ship it." That means:
- Insights are sharp (Steve approves)
- Structure is clear (4-box framework works)
- Writing is definitive (zero hedging)
- Data is quantified (Elon approves)
- It ships THIS WEEK (momentum preserved)

**Go build.**

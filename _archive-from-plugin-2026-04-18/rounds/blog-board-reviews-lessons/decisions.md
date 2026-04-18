# Locked Decisions — Blog Post: "Patterns"
*Blueprint for build phase*
*Orchestrated by Phil Jackson, Zen Master of the Great Minds Agency*

---

## EXECUTIVE SUMMARY

**What we're building:** A blog post analyzing patterns from 11 AI board reviews.
**Title:** "Patterns" (one word, `/blog/patterns`)
**Format:** Markdown with structure, ships first — design iteration comes after traction proof
**Philosophy:** Steve's substance + Elon's speed = reference document that actually ships

**Ship date:** This week. Non-negotiable.

---

## CORE DECISIONS: WHO PROPOSED, WHO WON, WHY

### 1. Title & URL: "Patterns"

**DECISION:** Single-word title "Patterns", clean URL (`/blog/patterns`)

**Proposed by:** Steve Jobs (Round 1)
- *"Not 'Board Review Insights' or 'Lessons from AI Advisors.' Just **Patterns**."*
- Vision: One word. Unmistakable. Becomes reference point.

**Challenged by:** None

**Winner:** Steve (unanimous)

**Why this won:**
- Memorable > SEO keyword stuffing
- Confidence signal: we own this space
- Social proof test: "Did you read Patterns?" is the desired outcome
- Single words become memes (see: "Stripe", "Linear", "Tesla")

**Implementation:**
- URL: `/blog/patterns`
- H1: "Patterns"
- Subhead provides context (see Content Structure below)

---

### 2. Format: Markdown First, Design Later

**DECISION:** V1 ships as structured markdown. Visual design is iteration 2 (conditional on traction).

**Proposed by:** Elon Musk (Round 2)
- *"Steve wants to build a museum exhibit. I want to publish data. His version takes 3 weeks and requires a designer. My version takes 3 hours and requires grep + markdown."*

**Challenged by:** Steve Jobs (Round 1)
- Wanted "field guide" with custom design, "signature visual identity" for each persona
- *"Four faces arranged like a board table"* with custom CSS, illustration work

**Winner:** Elon (with Steve concession)

**Why Elon won:**
- Design decisions add gates, gates kill momentum
- Most-referenced technical documents are markdown in GitHub repos
- Speed-to-ship enables learning; can design v2 if v1 proves traction
- Steve conceded: *"The structure IS the design"* — 4-box framework works in markdown

**Trade:**
- Steve gets his content structure, voice, and rigor
- Elon gets ship-this-week velocity
- Both win

**Implementation:**
- Markdown: headers, blockquotes, bullets, bold/italic
- NO custom CSS, NO illustration pipeline, NO persona styling systems
- IF v1 gets 1000+ views, THEN invest in visual design for v2

---

### 3. Writing Voice & Tone: "Lab Report with Soul"

**DECISION:** Honest, clinical, zero hedging. Definitive statements backed by data.

**Proposed by:** Steve Jobs (Round 1)
- *"Think David Attenborough narrating the Serengeti, not a SaaS founder hyping features. Observant. Curious. Unafraid of complexity."*
- Core principle: "Show, don't summarize. Real quotes. Real disagreements. Real patterns."

**Challenged by:** Elon Musk (Round 1)
- Called it "table stakes"
- Pushed for distribution hook over tone perfection

**Defended by:** Steve Jobs (Round 2)
- *"Tone is trust, not decoration."*
- *"When we say 'Warren missed this obvious retail insight' — that's not a bug, it's CREDIBILITY."*

**Winner:** Steve

**Why Steve won:**
- Founders are exhausted by AI hype; honesty = competitive advantage
- Showing limitations isn't scope creep, it's proof we're not selling vaporware
- Definitive statements ("Jensen ALWAYS asks" not "tends to ask") demonstrate confidence in data
- We have 11 reviews — use them, no hedging

**Implementation requirements:**
- Zero meta-narrative (no "rise of AI" fluff)
- Zero hedging (state patterns definitively)
- Real quotes in blockquotes (show, don't summarize)
- Clinical precision (Darwin writing about finches, except finches are AI board members)
- Voice example: *"Jensen never met a moat question he didn't like. Eleven reviews. Eleven variations on 'What stops competitors from copying this?' It's almost comical — until you realize he's caught three fatal flaws in products we almost shipped."*

---

### 4. Content Structure: The 4-Box Framework

**DECISION:** Lead with visual/structural framework showing 4 core patterns:
- **Jensen → Moats** (competitive dynamics, asks every review)
- **Warren → Unit Economics** (financial rigor, asks every review)
- **Shonda → Retention Hooks** (what keeps users coming back, 10/11 reviews)
- **Oprah → Emotional Resonance** (does this matter to real people?)

**Proposed by:** Steve Jobs (Round 1)
- *"Each persona gets a signature visual identity. When Warren speaks, you SEE the folksy wisdom. When Shonda critiques, you FEEL the narrative tension."*

**Refined by:** Elon Musk (Round 2)
- *"The structure IS the design"* — framework can work in markdown without custom design blocking ship date

**Winner:** Hybrid approach

**Why this works:**
- Readers must understand the framework in 10 seconds or we failed
- Structure is repeatable (template for future "N X Later" posts)
- Framework works in markdown (headers + bullets), ships fast
- Pattern clarity > visual flourishes

**Implementation:**
- Markdown headers for each board member
- Bullet points showing their consistent focus areas
- Quantified frequency (X/11 reviews)
- 2-3 blockquotes per board member (most striking examples)

---

### 5. The Hook: First 30 Seconds or Fail

**DECISION:** Page opens with ONE devastating pattern that makes readers lean forward. No preamble.

**Proposed by:** Steve Jobs (Round 1)
- *"Within 30 seconds, you know: this isn't theory. This is a laboratory notebook, and you're reading the results."*

**Challenged by:** None (reinforced by Elon)

**Winner:** Steve (unanimous)

**Steve's hook example:**
> "In 11 board reviews, Jensen Huang asked about competitive moats **11 times**. Warren Buffett asked about unit economics **11 times**. Shonda Rhimes asked about retention hooks **10 times**. They agreed on a green light exactly **twice**."

**Why this won:**
- Elon conceded: *"That hook isn't fluff—it's the entire reason someone shares the post."*
- First 30 seconds determine read vs bounce
- Specificity = credibility
- Numbers tell the story before words do

**Implementation:**
- Subheadline (appears right after title "Patterns")
- One sentence, shocking specificity
- Sets expectation: this is data, not opinion

---

### 6. Data Over Narrative: Quantify Everything

**DECISION:** Every pattern must be quantified. No vague claims.

**Proposed by:** Elon Musk (Round 2)
- *"Patterns aren't insights until you quantify them. Numbers give credibility to definitive statements."*

**Challenged by:** None (reinforces Steve's "zero hedging" principle)

**Winner:** Elon (unanimous)

**Why this won:**
- "Jensen asked about moats in 11/11 reviews" > "Jensen often asks about moats"
- Quantification enables Steve's definitive tone
- Makes patterns shareable (Twitter screenshots love numbers)
- Original data no one else has = distribution hook

**Implementation:**
- Count frequency across 11 reviews for each pattern
- Format: "X/11 reviews" or "X times out of 11"
- Include comparison data (Jensen vs Warren on same metric)
- Numbers in bold for scanability

---

### 7. Call-to-Action (CTA): Helpful, Not Salesy

**DECISION:** Include clear CTA that converts curiosity to action. Tone: helpful, not aggressive.

**Proposed by:** Elon Musk (Round 1)
- *"Content without conversion is waste."*
- *"What happens after someone reads this?"*

**Challenged by:** Steve Jobs (Round 2)
- *"Conversion isn't clicks, it's 'this changed how I think.'"*
- *"This post doesn't 'sell' AI board members. It **reports** on them."*

**Winner:** Hybrid (both perspectives integrated)

**Why hybrid won:**
- Steve's right: becoming undeniable > aggressive CTAs
- Elon's right: readers need a next step
- Resolution: CTA should be natural progression, not interruption

**CTA options (choose one):**
1. "Try This Yourself" with link to Great Minds board review feature
2. "Fork This Method" with prompt templates for DIY approach
3. "Run Your Pitch Through This Gauntlet" with demo/signup link

**Tone guideline:**
- NOT: "CLICK HERE TO BUY"
- YES: "Want to run your idea through this gauntlet? Here's how."

---

### 8. Distribution Strategy: Saves AND Shares

**DECISION:** Optimize for both reference value (saves) AND viral reach (shares).

**Proposed by:** Both (Steve and Elon, different angles)

**Steve's vision (Round 2):**
- *"A thousand people who get it > 100,000 who skim it."*
- Reference document that gets bookmarked, sent to co-founders, printed out
- Slower, deeper, durable

**Elon's vision (Round 1):**
- *"What's the one sentence someone screenshots and shares?"*
- Shareable insights for AI Twitter, backlinks from newsletters
- Fast reach, measurable traction

**Winner:** Both (complementary, not contradictory)

**Why both matter:**
- Structure enables both outcomes
- Quantified patterns are shareable (Elon's path)
- Comprehensive analysis is save-worthy (Steve's path)
- Different readers need different hooks

**Distribution requirements:**
- ✅ SEO metadata (Elon wins: title tags, meta descriptions, social cards)
- ✅ Original data no one else has (built-in advantage)
- ✅ Shareable finding/quote (quantified patterns provide this)
- ✅ Search intent targets: "AI board review patterns," "AI advisor feedback," "AI persona insights"

**Seeding plan (Elon's requirement):**
- AI Twitter (shareable stats as standalone tweets)
- AI newsletters (Lenny's, TLDR AI, Milk Road)
- Founder communities (excerpt for Slack/Discord)
- Search visibility (meta optimization)

---

### 9. Infrastructure: Kill the SSH Dependency

**DECISION:** Move source material (11 board reviews) from DO server to repo or S3.

**Proposed by:** Elon Musk (Round 1)
- *"Why is source material on a DO server requiring SSH? This is infrastructure debt masquerading as a feature."*
- *"Every SSH hop is a failure point."*

**Challenged by:** None

**Winner:** Elon (unanimous)

**Why this won:**
- SSH dependencies break agent workflows
- Source files in repo = version control, no auth gates
- Repeatability: if we do "N X Later" posts, need reliable access
- 5 minutes of file migration eliminates entire failure class

**Implementation:**
- Move `/source-reviews/` to repo OR S3/GCS
- Document new location before agent session starts
- Update access patterns (from SSH to file read or API)

---

### 10. Scope: What Ships in V1, What's Out

**DECISION:** Aggressive scope cut to enable shipping this week.

**Proposed by:** Elon Musk (Round 1)
- *"Cut ruthlessly. V1 is 'what AI boards caught.' V2 can be 'limitations.' Mixing them dilutes both."*

**Challenged by:** Steve Jobs (Round 2)
- *"Showing limitations isn't scope creep — it's PROOF OF HONESTY."*

**Winner:** Steve (with compromise)

**Compromise:**
- Limitations stay IN (Steve wins: credibility requires honesty)
- But limitations are concise, not expansive (Elon wins: scope contained)
- Word count flexible: 800-2000 words (whatever earns reader's time)

**IN v1 (ships this week):**
- ✅ Title: "Patterns"
- ✅ 4-box framework (Jensen/Warren/Shonda/Oprah focus areas)
- ✅ Quantified patterns (X/11 reviews asked about Y)
- ✅ Real quotes from reviews (blockquotes, attribution)
- ✅ Brief limitations section (what AI boards missed)
- ✅ Zero meta-narrative
- ✅ Zero hedging
- ✅ CTA (helpful, not aggressive)
- ✅ SEO metadata
- ✅ Markdown format

**OUT of v1 (future iteration):**
- ❌ Custom visual design / "field guide" format → V2 (if v1 proves traction)
- ❌ Separate deep-dive on "What AI Misses" → Standalone post
- ❌ Tone A/B testing → Ship with Steve's voice, iterate based on data
- ❌ Template system for "N X Later" posts → Build after v1 proves concept

---

## MVP FEATURE SET: WHAT SHIPS IN V1

### Content Components

1. **Title**
   - "Patterns" (H1)

2. **Subheadline** (the hook)
   - One sentence with devastating specificity
   - Example: "We ran 11 board reviews with AI versions of Jensen Huang, Warren Buffett, Oprah Winfrey, and Shonda Rhimes. Here's what they always catch — and what they always miss."

3. **4-Box Structure** (markdown headers)
   - **Jensen → Moats**
     - Quantified: X/11 reviews asked about competitive dynamics
     - 2-3 blockquotes (best examples of moat questioning)
   - **Warren → Unit Economics**
     - Quantified: X/11 reviews demanded financial rigor
     - 2-3 blockquotes (folksy wisdom on numbers)
   - **Shonda → Retention Hooks**
     - Quantified: X/11 reviews probed narrative tension
     - 2-3 blockquotes (story-driven critiques)
   - **Oprah → Emotional Resonance**
     - Quantified: X/11 reviews questioned real human value
     - 2-3 blockquotes (empathy-driven challenges)

4. **Patterns Section**
   - What they catch (most common insights across reviews)
   - Where they agree (rare, make it count)
   - Where they conflict (show the fights)

5. **Limitations Section** (brief, honest)
   - What AI boards miss that human boards catch
   - No hedging, just clinical honesty
   - Builds credibility (Steve's requirement)

6. **Call-to-Action**
   - Helpful tone: "Try This Yourself" or "Run Your Pitch Through This Gauntlet"
   - Link to Great Minds board review feature or prompt templates

7. **Word Count**
   - 800-2000 words (flexible based on earned reader attention)
   - No filler, every sentence earns its place

### Technical Requirements

1. **Source Material Access**
   - 11 board review markdown files
   - MUST be moved from DO server to repo/S3 BEFORE agent starts
   - Path documented and accessible without SSH

2. **Format**
   - Markdown file: headers, blockquotes, bullets, bold/italic
   - No custom HTML/CSS in v1

3. **Publishing Destination**
   - `/blog/patterns` on Great Minds blog
   - Confirm publishing mechanism (commit to repo? CMS upload?)

4. **SEO Metadata**
   - Title tag: "Patterns: What AI Board Reviews Catch in 11/11 Pitches"
   - Meta description: 150-160 chars, includes keywords + hook
   - Open Graph tags for social sharing
   - Social card image (can be simple text-on-color)

5. **Agent Capabilities Required**
   - Parse 11 markdown files (unstructured or semi-structured)
   - Extract quotes matching pattern themes
   - Synthesize insights (don't just dump quotes)
   - Quantify frequencies across reviews
   - Write in Steve's voice (definitive, rigorous, honest)
   - Generate SEO metadata
   - Output clean markdown

### Distribution Requirements

1. **SEO Optimization**
   - Target keywords: "AI board review patterns," "AI advisor feedback," "AI persona insights"
   - Internal linking (if other Great Minds content exists)

2. **Social Cards**
   - Auto-generated from metadata OR simple Figma template
   - Must include title, hook stat, Great Minds branding

3. **Shareable Excerpts**
   - Quantified patterns formatted for Twitter/LinkedIn (140-280 chars)
   - Quote graphics (optional, can be text screenshots)

4. **Newsletter-Ready**
   - 3-4 sentence excerpt for newsletter inclusion
   - Link back to full post

---

## FILE STRUCTURE: WHAT GETS BUILT

```
/blog/
  patterns.md                          # The published post (v1)
  patterns-meta.json                   # SEO metadata (if needed)

/rounds/blog-board-reviews-lessons/    # Source debates (existing)
  essence.md                           # Core vision
  round-1-steve.md                     # Steve's initial position
  round-1-elon.md                      # Elon's initial position
  round-1-elon-fresh.md                # Elon's alternative opening
  round-2-steve.md                     # Steve's rebuttal
  round-2-elon.md                      # Elon's rebuttal
  decisions.md                         # This file (blueprint)

/source-reviews/                       # 11 board review files (MOVED from DO server)
  review-01-[product-name].md
  review-02-[product-name].md
  review-03-[product-name].md
  review-04-[product-name].md
  review-05-[product-name].md
  review-06-[product-name].md
  review-07-[product-name].md
  review-08-[product-name].md
  review-09-[product-name].md
  review-10-[product-name].md
  review-11-[product-name].md

/templates/                            # Future: templating system (post-v1)
  n-x-later-pattern.md                 # If we repeat this format
  social-card-template.figma           # If we design social cards
```

---

## OPEN QUESTIONS: WHAT NEEDS RESOLUTION

### 🔴 CRITICAL (blockers — resolve before build starts)

#### 1. Source Material Location
**Question:** Where exactly are the 11 board review files currently stored?

**Context:**
- Elon: "SSH to DO server is infrastructure debt"
- Decision locked: move files to repo/S3 before agent session

**Blocker Impact:** Cannot build without access to source files

**Resolution needed:**
- Provide current SSH details (host, key, path) OR
- Move files to repo at `/source-reviews/` OR
- Upload to S3/GCS and provide access URL

**Owner:** Seth / DevOps

**Deadline:** Before agent session starts

---

#### 2. Blog Publishing Mechanism
**Question:** How does content get published to `/blog/patterns`?

**Options:**
- A) Commit markdown to repo, auto-deploy to blog
- B) CMS (WordPress/Ghost/etc) that accepts markdown import
- C) Manual upload by Seth after agent delivers markdown

**Blocker Impact:** Affects agent workflow (where does final file go?)

**Resolution needed:**
- Confirm publishing process
- Provide credentials/access if automated
- Document manual steps if human-in-loop required

**Owner:** Seth

**Deadline:** Before agent session starts

---

### 🟡 MEDIUM (affects execution, not blocking)

#### 3. Anonymization Requirements
**Question:** Do the 11 reviews need product names anonymized?

**Context:**
- Real quotes are essential (Steve's requirement)
- Client confidentiality might require redaction
- Affects quote selection and context

**Impact:** Determines which quotes can be used, how they're attributed

**Resolution needed:**
- Clarify if product names can be mentioned
- Provide anonymization rules if required (e.g., "Product A", "a SaaS tool", etc.)

**Owner:** Seth

**Deadline:** Before quote extraction phase

---

#### 4. Existing Blog Format/Style
**Question:** Is there an existing Great Minds blog post that demonstrates format/voice?

**Context:**
- Agent needs to match existing style (if any)
- OR establish new style (if first blog post)

**Impact:** Helps agent match brand voice, formatting conventions

**Resolution needed:**
- Link to 1-2 existing blog posts as examples OR
- Confirm this is first blog post, no format to match

**Owner:** Seth

**Deadline:** Before agent writes draft

---

### 🟢 LOW (doesn't block build, can be resolved post-draft)

#### 5. Timeline / Hard Deadline
**Question:** "Ship this week" — what's the specific deadline?

**Context:**
- Elon pushed for speed
- Steve accepted "ship markdown fast"
- Need concrete date for prioritization

**Impact:** Affects scheduling, urgency

**Owner:** Seth

---

#### 6. SEO Metadata Ownership
**Question:** Who writes the meta description and social card copy?

**Options:**
- A) Agent drafts, Seth approves
- B) Seth writes manually after seeing draft

**Impact:** Determines if agent needs to generate SEO copy or just content

**Owner:** Seth

---

#### 7. CTA Destination
**Question:** Where does the CTA link point?

**Options:**
- Link to Great Minds product page
- Link to signup/demo page
- Provide prompt templates for DIY approach
- Combination (multiple CTAs)

**Impact:** Determines conversion path

**Owner:** Seth

---

## RISK REGISTER: WHAT COULD GO WRONG

### 🔴 HIGH RISK

#### Risk #1: SSH Access Failure
**Description:** Agent cannot access DO server to read source reviews

**Probability:** HIGH (if files not moved pre-session)

**Impact:** ⚠️ Build blocked entirely

**Mitigation:**
- MOVE FILES to repo/S3 BEFORE agent session starts
- Verify agent can read files in test run
- Have backup plan (manual file transfer if automation fails)

**Owner:** Seth / DevOps

**Status:** ⏳ Pending resolution

---

#### Risk #2: Inconsistent Review Format
**Description:** 11 review files have different structures, making quote extraction difficult

**Probability:** MEDIUM (depends on how reviews were created)

**Impact:** ⚠️ Agent spends excessive time parsing, or misses key quotes

**Mitigation:**
- Manual spot-check of 2-3 reviews to confirm parsability
- If inconsistent: provide extraction rules to agent
- If very inconsistent: human pre-processes files into consistent format

**Owner:** Seth

**Action:** Pre-flight check on 2-3 review files before agent session

---

### 🟡 MEDIUM RISK

#### Risk #3: Content Quality — "Grep-and-Dump" Problem
**Description:** Agent extracts quotes without synthesis (Elon's "bash script" scenario)

**Probability:** MEDIUM (LLMs can be literal)

**Impact:** ⚠️ Post lacks insight, fails Steve's "scholarship" standard

**Mitigation:**
- Clear prompt: "synthesize patterns, don't just list quotes"
- Emphasize voice requirements (Steve's tone)
- Human review before publishing (Seth approval gate)

**Owner:** Agent operator (Seth)

**Action:** Include synthesis requirements in agent prompt

---

#### Risk #4: Distribution Failure — Zero Reach
**Description:** Post ships but gets <100 views in week 1

**Probability:** MEDIUM (organic reach is unpredictable)

**Impact:** ⚠️ Content effort wasted, no momentum, can't validate concept

**Mitigation:**
- SEO optimization (target specific queries)
- Seed in AI communities (Twitter, newsletters, Lenny's Slack, Indie Hackers)
- Shareable insights (quantified patterns as standalone tweets)
- Paid boost if needed (small budget, test channels)

**Owner:** Seth / Marketing

**Action:** Distribution checklist before publish (see below)

---

#### Risk #5: Credibility Hit — Weak Insights
**Description:** Post doesn't demonstrate rigor (Steve's nightmare scenario)

**Probability:** LOW (locked decisions mitigate this)

**Impact:** ⚠️ Great Minds looks amateurish, can't recover first impression

**Mitigation:**
- Steve's non-negotiables are hard requirements (zero hedging, definitive statements)
- Human editorial review before ship (Seth approval)
- Real quotes with attribution (no vague claims)
- Quantified data (Elon's requirement reinforces rigor)

**Owner:** Seth

**Action:** Review checklist against Steve's non-negotiables

---

### 🟢 LOW RISK (mitigated by locked decisions)

#### Risk #6: Scope Creep — "Field Guide" Perfectionism
**Description:** Steve's vision of custom design delays shipping

**Status:** ✅ RESOLVED

**Mitigation:** DECISION LOCKED — v1 is markdown, design is iteration 2

**Resolution:** Elon won this debate; Steve conceded

---

#### Risk #7: CTA Conflict — Too Salesy vs Too Passive
**Description:** CTA either alienates readers (aggressive) or drives no action (passive)

**Probability:** LOW (hybrid approach decided)

**Impact:** ⚠️ Conversion suffers

**Mitigation:** Hybrid approach — helpful CTA ("Try This Yourself" with link)

**Owner:** Seth (final editorial decision)

---

#### Risk #8: Anonymization Conflict
**Description:** Real quotes require product names, but clients demand confidentiality

**Probability:** LOW (likely addressable)

**Impact:** ⚠️ Weakens quotes or violates agreements

**Mitigation:** Confirm anonymization requirements BEFORE quote selection

**Owner:** Seth

**Action:** Clarify with open question #3 above

---

## SUCCESS CRITERIA: HOW WE KNOW WE WON

### ✅ Content Quality (Steve's Metrics)

- [ ] **4-box framework understandable in 10 seconds**
  - Reader can name Jensen's focus after one skim

- [ ] **Zero hedging** (every pattern stated definitively)
  - No "tends to", "often", "sometimes" — only "always", "never", "X/11 times"

- [ ] **Real quotes with attribution**
  - At least 2 blockquotes per board member (8+ total)

- [ ] **Voice is "lab report with soul"**
  - Honest, clinical, rigorous
  - No AI hype, no selling

- [ ] **Reader leaves smarter even if they bounce after 30 seconds**
  - Hook delivers one memorable insight immediately

---

### ✅ Distribution Performance (Elon's Metrics)

- [ ] **1000+ views in first week**
  - Organic + seeded reach combined

- [ ] **50+ shares** (Twitter, LinkedIn, newsletters)
  - Track retweets, LinkedIn shares, newsletter mentions

- [ ] **5+ backlinks** from AI newsletters or blogs
  - Lenny's, TLDR AI, Milk Road, AI Breakdown, etc.

- [ ] **10+ signups or product page visits from CTA**
  - UTM tracking to measure conversion

---

### ✅ Technical Execution

- [ ] **Builds in < 2 hours agent time** (< 60 min compute)
  - Efficiency test: can this be repeated?

- [ ] **No SSH failures blocking build**
  - Infrastructure validated before agent starts

- [ ] **Publishes to `/blog/patterns` without manual intervention**
  - OR clear handoff to Seth for manual publish (documented)

- [ ] **SEO metadata complete**
  - Title tag, meta description, social cards ready

---

### ✅ Strategic Outcome

- [ ] **Post becomes reference document**
  - Bookmarked, shared in Slack, sent to co-founders
  - Evidence: people say "Did you read Patterns?"

- [ ] **Establishes Great Minds as rigorous, data-driven**
  - Not just another AI hype company

- [ ] **Template proven for future "N X Later" posts**
  - IF we choose to repeat this format (decision pending v1 results)

---

## BUILD PHASE — AGENT INSTRUCTIONS

**You are the agent tasked with building this post. Here's what's locked:**

### Your Mission

Build a blog post titled "Patterns" analyzing 11 AI board reviews.

**Output:** Markdown file ready to publish at `/blog/patterns`

**Timeline:** This week (exact deadline TBD by Seth)

**Success metric:** Seth reads your draft and says "ship it."

---

### Prerequisites (confirm before starting)

1. **Source material location confirmed**
   - 11 board review markdown files accessible
   - No SSH required (files in repo/S3)

2. **Publishing mechanism documented**
   - Know where final markdown file goes

3. **Anonymization rules clarified** (if needed)
   - Can you use product names? Or anonymize?

If ANY prerequisite is unmet, STOP and ask Seth.

---

### Step-by-Step Build Process

#### Phase 1: Extract & Analyze
1. **Read all 11 board review files**
   - Parse for structure (headers, sections, quotes)

2. **Identify patterns by board member**
   - What does Jensen ALWAYS ask?
   - What does Warren ALWAYS ask?
   - What does Shonda ALWAYS ask?
   - What does Oprah ALWAYS ask?

3. **Quantify frequencies**
   - Count: "Jensen asked about moats in X/11 reviews"
   - Count: "Warren asked about unit economics in X/11 reviews"
   - Count: "They agreed on green light X/11 times"

4. **Extract best quotes**
   - 2-3 blockquotes per board member (most striking examples)
   - Must be real quotes with attribution (board member name)

#### Phase 2: Synthesize Insights
5. **Find the meta-patterns**
   - What do they catch consistently?
   - Where do they agree? (rare, make it count)
   - Where do they conflict? (show the fights)

6. **Identify limitations**
   - What did AI boards miss that's obvious in hindsight?
   - Brief, honest, no hedging

#### Phase 3: Write the Post
7. **Title & Hook**
   - Title: "Patterns"
   - Subheadline: One sentence with devastating specificity (see Steve's example)

8. **4-Box Structure** (use markdown headers)
   - **## Jensen → Moats**
     - Quantified frequency
     - 2-3 blockquotes
   - **## Warren → Unit Economics**
     - Quantified frequency
     - 2-3 blockquotes
   - **## Shonda → Retention Hooks**
     - Quantified frequency
     - 2-3 blockquotes
   - **## Oprah → Emotional Resonance**
     - Quantified frequency
     - 2-3 blockquotes

9. **Patterns Section**
   - What they catch
   - Where they agree
   - Where they conflict

10. **Limitations Section** (brief)
    - What AI boards miss
    - Honest, clinical tone

11. **Call-to-Action**
    - "Try This Yourself" or similar helpful tone
    - Link to Great Minds product (get URL from Seth)

#### Phase 4: Polish & Metadata
12. **Voice check**
    - Zero hedging (definitive statements)
    - Zero meta-narrative (no "AI landscape" fluff)
    - Lab report with soul (clinical but engaging)

13. **SEO Metadata**
    - Title tag: "Patterns: What AI Board Reviews Catch in 11/11 Pitches"
    - Meta description: 150-160 chars, include hook stat
    - Social card text

14. **Final review against success criteria**
    - 4-box framework clear in 10 seconds?
    - Zero hedging throughout?
    - Real quotes with attribution?
    - 800-2000 words (flexible, earn reader's time)?

---

### Writing Voice Requirements (Steve's Non-Negotiables)

**DO:**
- State patterns definitively ("Jensen ALWAYS asks" not "Jensen tends to ask")
- Use real quotes in blockquotes
- Quantify everything ("X/11 reviews")
- Show conflicts between board members
- Acknowledge limitations honestly
- Write like you're explaining this to a founder at 2am after a hard pivot

**DON'T:**
- Hedge with "potentially", "in some cases", "often"
- Summarize quotes (use blockquotes, show don't tell)
- Add meta-narrative about AI trends
- Sell the product (report on it)
- Use academic language ("aggregate findings" → "patterns")
- Add fluff to hit word count (earn every sentence)

**Tone example (from Steve):**
> "Jensen never met a moat question he didn't like. Eleven reviews. Eleven variations on 'What stops competitors from copying this?' It's almost comical — until you realize he's caught three fatal flaws in products we almost shipped."

---

### Output Format

**File:** `/blog/patterns.md` (or location specified by Seth)

**Structure:**
```markdown
# Patterns

[Subheadline with hook stat]

## Jensen → Moats
[Quantified frequency]
> [Blockquote 1]
> [Blockquote 2]

## Warren → Unit Economics
[Quantified frequency]
> [Blockquote 1]
> [Blockquote 2]

## Shonda → Retention Hooks
[Quantified frequency]
> [Blockquote 1]
> [Blockquote 2]

## Oprah → Emotional Resonance
[Quantified frequency]
> [Blockquote 1]
> [Blockquote 2]

## What They Catch
[Patterns analysis]

## What They Miss
[Limitations, brief, honest]

## Try This Yourself
[CTA with link]
```

**Metadata file (if separate):**
- Title tag
- Meta description
- Open Graph tags

---

### Quality Gates (Seth's Approval Checklist)

Before delivering to Seth, verify:

**Content Quality:**
- [ ] Hook delivers one memorable insight in 30 seconds
- [ ] 4-box framework clear and quantified
- [ ] 8+ real quotes with attribution
- [ ] Zero hedging language
- [ ] Limitations section included (brief, honest)
- [ ] CTA present and helpful (not salesy)

**Technical Quality:**
- [ ] Clean markdown (headers, blockquotes, bullets)
- [ ] No custom HTML/CSS
- [ ] SEO metadata complete
- [ ] 800-2000 words (flexible)
- [ ] File ready to publish

**Voice Quality:**
- [ ] Definitive statements throughout
- [ ] No meta-narrative or AI hype
- [ ] Lab report tone (clinical but engaging)
- [ ] Shows conflicts, doesn't sanitize

If all boxes check, deliver to Seth with: "Draft ready for review. Ship checklist complete."

---

## POST-PUBLISH: DISTRIBUTION CHECKLIST

(Seth's responsibility after agent delivers)

### Week 1 Actions

**SEO:**
- [ ] Verify metadata deployed correctly
- [ ] Submit to Google Search Console
- [ ] Add internal links from existing Great Minds pages

**Social Seeding:**
- [ ] Twitter thread with quantified patterns
- [ ] LinkedIn post with key insight
- [ ] Share in founder communities (Indie Hackers, Slack groups)

**Newsletter Outreach:**
- [ ] Email excerpt to Lenny's Newsletter
- [ ] Submit to TLDR AI
- [ ] Pitch to Milk Road, AI Breakdown

**Tracking:**
- [ ] UTM parameters on all shared links
- [ ] Analytics dashboard to monitor views, shares, conversions

### Week 2: Measure & Decide

**Metrics to track:**
- Views (target: 1000+)
- Shares (target: 50+)
- Backlinks (target: 5+)
- Conversions from CTA (target: 10+)

**Decision point:**
- IF metrics hit targets → invest in visual design for v2, build "N X Later" template
- IF metrics miss targets → analyze what failed (distribution? content? hook?), iterate or pivot

---

## FINAL WORD FROM THE ZEN MASTER

This blueprint represents the convergence of Steve's substance and Elon's speed.

**Steve won:** Title, voice, structure, rigor, honesty.

**Elon won:** Format, timeline, distribution plan, scope discipline.

**Both won:** A post that can actually ship this week AND become a reference document.

The debates sharpened both perspectives. The locked decisions eliminate ambiguity.

Your job now is execution.

Build with precision. Ship with confidence.

**Phil Jackson, Zen Master**
*Great Minds Agency*

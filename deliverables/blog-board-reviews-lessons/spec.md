# Spec: Blog Post — "Patterns"

## Goals (from PRD)

**Title:** "Patterns" (one word, `/blog/patterns`)

**Purpose:** Aggregate learnings from 11+ AI board reviews to create reference content for the AI community. Show what AI board members consistently catch, where they disagree, and what they miss.

**Target Audience:** Founders and AI builders exhausted by hype, seeking honest analysis

**Success Metrics:**
- 1200-1800 words
- Includes real quotes from board reviews
- Matches existing Great Minds blog format
- Ships this week
- Post committed and pushed to repo

## Implementation Approach (from Plan & Decisions)

### Content Strategy

**Format:** Markdown first, design later (V1)
- Clean markdown: headers, blockquotes, bullets, bold/italic
- NO custom CSS, NO illustration pipeline, NO persona styling systems
- IF v1 gets 1000+ views, THEN invest in visual design for v2

**Voice:** "Lab Report with Soul" (Steve Jobs' requirement)
- Honest, clinical, zero hedging
- Definitive statements backed by data
- Show, don't summarize — real quotes in blockquotes
- Example tone: "Jensen never met a moat question he didn't like. Eleven reviews. Eleven variations on 'What stops competitors from copying this?' It's almost comical — until you realize he's caught three fatal flaws in products we almost shipped."

**Structure:** 4-Box Framework
1. **Jensen → Moats** (competitive dynamics, quantified frequency)
2. **Warren → Unit Economics** (financial rigor, quantified frequency)
3. **Shonda → Retention Hooks** (narrative tension, quantified frequency)
4. **Oprah → Emotional Resonance** (real human value, quantified frequency)

Each section includes:
- Quantified pattern: "X/11 reviews asked about Y"
- 2-3 blockquotes (most striking examples)
- Clinical analysis of what this reveals

### Content Components

1. **Title:** "Patterns" (H1)
2. **Subheadline (Hook):** One sentence with devastating specificity
   - Example: "We ran 11 board reviews with AI versions of Jensen Huang, Warren Buffett, Oprah Winfrey, and Shonda Rhimes. Here's what they always catch — and what they always miss."
3. **4-Box Structure** (see above)
4. **Patterns Section:**
   - What they catch (most common insights)
   - Where they agree (rare, make it count)
   - Where they conflict (show the fights)
5. **Limitations Section (brief, honest):**
   - What AI boards miss that human boards catch
   - No hedging, clinical honesty
6. **Call-to-Action:**
   - Helpful tone: "Try This Yourself" or "Run Your Pitch Through This Gauntlet"
   - Link to Great Minds board review feature or prompt templates
7. **Word Count:** 800-2000 words (flexible, earn every sentence)

### Data Requirements

**Source Material:**
- 11+ board review files from shipped projects
- Access via: SSH to DO server OR files moved to repo at `/source-reviews/`
- PRD specifies: `ssh -i ~/.ssh/greatminds root@164.90.151.82 'ls /home/agent/shipyard-ai/rounds/*/board-review-*.md'`
- Alternative: Files already in repo under `/rounds/*/board-review-*.md` and `board-verdict.md`

**Analysis Required:**
- Parse 11+ board review markdown files
- Extract quotes matching pattern themes (Jensen/moats, Warren/economics, Shonda/retention, Oprah/emotional)
- Quantify frequencies across reviews: "X/11 reviews"
- Synthesize insights (don't just dump quotes)
- Identify agreement patterns (where all 4 align)
- Identify conflict patterns (where they disagree)

### Technical Requirements

**Publishing:**
- Destination: `/blog/patterns.md` on Great Minds blog
- Check repo structure for correct blog content location
- Confirm publishing mechanism before starting

**SEO Metadata:**
- Title tag: "Patterns: What AI Board Reviews Catch in 11/11 Pitches"
- Meta description: 150-160 chars, includes keywords + hook
- Target keywords: "AI board review patterns," "AI advisor feedback," "AI persona insights"
- Open Graph tags for social sharing
- Social card image (simple text-on-color acceptable)

**Format:**
- Markdown file with clean syntax
- No custom HTML/CSS in v1
- Use: headers (##), blockquotes (>), bullets (-), bold (**), italic (*)

## Verification Criteria

### Content Quality Checks

✅ **Hook effectiveness** — Reader gets one memorable insight in first 30 seconds
- Test: Can someone quote the opening stat from memory?

✅ **4-box framework clarity** — Understandable in 10 seconds
- Test: After one skim, reader can name Jensen's focus area

✅ **Zero hedging** — Every pattern stated definitively
- Test: No instances of "tends to", "often", "sometimes"
- Only: "always", "never", "X/11 times"

✅ **Real quotes with attribution** — At least 8 blockquotes total
- Test: 2-3 blockquotes per board member (Jensen, Warren, Shonda, Oprah)
- Each quote has clear attribution

✅ **Voice consistency** — "Lab report with soul" throughout
- Test: No AI hype language, no selling, clinical but engaging
- Passes Steve Jobs tone test

✅ **Limitations section included** — Brief, honest
- Test: Post acknowledges what AI boards miss
- Builds credibility through honesty

✅ **Helpful CTA** — Not salesy, natural progression
- Test: CTA feels like next step, not interruption

### Technical Quality Checks

✅ **Word count** — 800-2000 words (flexible based on earned reader attention)
- No filler, every sentence earns its place

✅ **Clean markdown** — Proper syntax throughout
- Headers, blockquotes, bullets formatted correctly
- No broken links, no custom HTML/CSS

✅ **SEO metadata complete**
- Title tag present and optimized
- Meta description 150-160 chars
- Keywords included naturally
- Social card ready

✅ **Source quotes verified** — All quotes are real, from actual board reviews
- No fabricated or paraphrased quotes
- Attribution accurate

### Distribution Readiness Checks

✅ **Shareable insights** — Quantified patterns formatted for social
- Test: Can extract 3-4 tweetable stats

✅ **Newsletter-ready excerpt** — 3-4 sentence summary prepared
- Links back to full post

✅ **Search intent alignment** — Targets specific queries
- "AI board review patterns"
- "AI advisor feedback"
- "AI persona insights"

## Files That Will Be Created or Modified

### New Files Created

1. **`/blog/patterns.md`** (or location confirmed via repo structure check)
   - Primary deliverable: the blog post
   - 800-2000 words markdown
   - Complete with all content sections

2. **`/blog/patterns-meta.json`** (if needed for publishing system)
   - SEO metadata: title tag, meta description, OG tags
   - Keywords and social card info

3. **`/deliverables/blog-board-reviews-lessons/spec.md`** (this file)
   - Complete specification document

4. **`/deliverables/blog-board-reviews-lessons/todo.md`**
   - Atomic task breakdown with verification steps

5. **`/deliverables/blog-board-reviews-lessons/tests/`** (directory)
   - `check-banned-patterns.sh` — Grep for banned patterns
   - `verify-quotes.sh` — Verify quotes exist in source files
   - `check-voice.sh` — Detect hedging language
   - `verify-structure.sh` — Check markdown structure
   - All scripts executable (chmod +x)

### Existing Files Read (Not Modified)

6. **PRD:** `/Users/sethshoultes/Local Sites/great-minds-plugin/prds/blog-board-reviews-lessons.md`
7. **Plan:** `/Users/sethshoultes/Local Sites/great-minds-plugin/.planning/phase-1-plan.md` (NOTE: This was Portfolio Analytics plan, not blog plan — may need different plan)
8. **Decisions:** `/Users/sethshoultes/Local Sites/great-minds-plugin/rounds/blog-board-reviews-lessons/decisions.md`
9. **Project Rules:** `/Users/sethshoultes/Local Sites/great-minds-plugin/templates/CLAUDE.md`
10. **Banned Patterns:** `/Users/sethshoultes/Local Sites/great-minds-plugin/BANNED-PATTERNS.md`

### Source Material Files Read

11-21. **Board review files** (11+ files):
   - Option A: SSH from DO server at `/home/agent/shipyard-ai/rounds/*/board-review-*.md`
   - Option B: Local repo at `/rounds/*/board-review-*.md`
   - Option C: Moved to `/source-reviews/` before build

**NOTE:** Source material location must be confirmed before build starts (see Open Questions in decisions.md)

## Open Questions / Blockers

From decisions.md, these must be resolved before implementation:

### 🔴 CRITICAL (blockers)

1. **Source Material Location**
   - Current: Files on DO server requiring SSH
   - Decision locked: Move to repo/S3 before agent session
   - Need: Confirmation of file location and access method

2. **Blog Publishing Mechanism**
   - Question: How does content get published to `/blog/patterns`?
   - Options: Commit to repo auto-deploy / CMS import / manual upload
   - Need: Confirmation of process and credentials (if automated)

### 🟡 MEDIUM (affects execution)

3. **Anonymization Requirements**
   - Question: Can product names be mentioned in quotes?
   - Impact: Determines which quotes can be used, attribution format
   - Need: Clarification on anonymization rules

4. **Existing Blog Format/Style**
   - Question: Is there an existing blog post to match?
   - Need: Link to 1-2 examples OR confirm this is first post

### 🟢 LOW (post-draft resolution OK)

5. **Timeline Deadline** — "Ship this week" needs specific date
6. **SEO Metadata Ownership** — Agent drafts or Seth writes?
7. **CTA Destination** — Where should CTA link point?

## Success Criteria Summary

**The post is ready to ship when:**

✅ Steve reads draft and says "ship it" (taste, rigor, honesty check)
✅ Elon reads draft and says "ship it" (data, feasibility, distribution check)
✅ All verification criteria pass (see above)
✅ No banned patterns detected (grep tests pass)
✅ Source quotes verified as real (test scripts confirm)
✅ Voice is definitive, clinical, honest throughout
✅ 4-box framework is immediately clear
✅ Limitations section builds credibility
✅ CTA is helpful, not aggressive
✅ SEO metadata complete
✅ File ready to commit and push

**Post-publish success metrics (week 1):**
- 1000+ views
- 50+ shares (Twitter, LinkedIn, newsletters)
- 5+ backlinks from AI newsletters/blogs
- 10+ signups or product page visits from CTA
- Post becomes reference: "Did you read Patterns?"

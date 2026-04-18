# Blog Post "Patterns" — Atomic Task Breakdown

**Status:** Not started
**Estimated total time:** 2-3 hours
**Last updated:** 2026-04-16

---

## Phase 0: Pre-Flight Checks (MUST complete before starting)

- [ ] **Confirm source material location** — verify: check that 11+ board review files are accessible without SSH
- [ ] **Confirm blog publishing mechanism** — verify: know where to save final markdown file
- [ ] **Confirm anonymization rules** — verify: know if product names can be mentioned in quotes
- [ ] **Identify existing blog posts (if any)** — verify: check `/blog/` directory for format examples

---

## Phase 1: Source Material Collection (15-20 min)

### Locate Board Review Files

- [ ] **Find all board review files in repo** — verify: `find . -name "*board-review*.md" -o -name "*board-verdict*.md" | wc -l` returns 11+
- [ ] **If files on DO server, copy locally** — verify: all files copied to `/source-reviews/` or accessible path
- [ ] **List all source files in notes** — verify: have complete inventory of which reviews exist

### Initial Source Scan

- [ ] **Quick read: 3 sample board reviews** — verify: understand file structure (headers, sections, quote format)
- [ ] **Identify common structure patterns** — verify: note how each persona's feedback is formatted
- [ ] **Test quote extraction from 1 file** — verify: can successfully extract attributed quotes

---

## Phase 2: Data Analysis — Extract Patterns (45-60 min)

### Jensen Huang Analysis

- [ ] **Read all Jensen feedback sections** — verify: collected notes from 11+ reviews
- [ ] **Count moat questions frequency** — verify: have X/11 count for competitive dynamics questions
- [ ] **Extract Jensen's 3 best quotes** — verify: quotes are real, attributed, demonstrate moat focus
- [ ] **Identify Jensen's most striking insight** — verify: found example where he caught fatal flaw

### Warren Buffett Analysis

- [ ] **Read all Warren feedback sections** — verify: collected notes from 11+ reviews
- [ ] **Count unit economics frequency** — verify: have X/11 count for financial rigor questions
- [ ] **Extract Warren's 3 best quotes** — verify: quotes show folksy wisdom + numbers focus
- [ ] **Identify Warren's most striking insight** — verify: found example of financial wisdom

### Shonda Rhimes Analysis

- [ ] **Read all Shonda feedback sections** — verify: collected notes from 11+ reviews
- [ ] **Count retention/narrative frequency** — verify: have X/11 count for story-driven critiques
- [ ] **Extract Shonda's 3 best quotes** — verify: quotes demonstrate retention hook focus
- [ ] **Identify Shonda's most striking insight** — verify: found example of narrative tension catch

### Oprah Winfrey Analysis

- [ ] **Read all Oprah feedback sections** — verify: collected notes from 11+ reviews
- [ ] **Count emotional resonance frequency** — verify: have X/11 count for "does this matter?" questions
- [ ] **Extract Oprah's 3 best quotes** — verify: quotes show empathy-driven challenges
- [ ] **Identify Oprah's most striking insight** — verify: found example of human value check

### Meta-Pattern Analysis

- [ ] **Find agreement patterns** — verify: identified X/11 times all 4 agreed on verdict
- [ ] **Find conflict patterns** — verify: documented 2-3 examples where board members disagreed
- [ ] **Identify what they consistently catch** — verify: have 3-5 common pattern categories
- [ ] **Identify what they consistently miss** — verify: have 2-3 honest limitation examples

---

## Phase 3: Draft Writing — Content Creation (60-90 min)

### Hook & Opening

- [ ] **Write title: "Patterns"** — verify: single word, clean
- [ ] **Write subheadline with devastating stat** — verify: one sentence, includes specific numbers
- [ ] **Test hook readability** — verify: someone can quote opening stat from memory after one read

### 4-Box Framework Content

- [ ] **Write Jensen section** — verify: includes quantified frequency + 2-3 blockquotes + analysis
- [ ] **Write Warren section** — verify: includes quantified frequency + 2-3 blockquotes + analysis
- [ ] **Write Shonda section** — verify: includes quantified frequency + 2-3 blockquotes + analysis
- [ ] **Write Oprah section** — verify: includes quantified frequency + 2-3 blockquotes + analysis
- [ ] **Test framework clarity** — verify: can understand 4-box structure in 10-second skim

### Patterns Section

- [ ] **Write "What They Catch"** — verify: synthesizes patterns, doesn't just list quotes
- [ ] **Write "Where They Agree"** — verify: includes rare agreement examples with impact
- [ ] **Write "Where They Conflict"** — verify: shows the fights, demonstrates tension

### Limitations & CTA

- [ ] **Write limitations section** — verify: brief (2-3 paragraphs), honest, clinical tone
- [ ] **Write CTA** — verify: helpful tone ("Try This Yourself"), includes link to Great Minds board review feature
- [ ] **Check CTA feels natural** — verify: flows from content, not jarring sales pitch

### Voice & Polish

- [ ] **Voice check: remove all hedging** — verify: no instances of "tends to", "often", "sometimes", "potentially"
- [ ] **Voice check: definitive statements** — verify: uses "always", "never", "X/11 times"
- [ ] **Voice check: zero meta-narrative** — verify: no "AI landscape" or "rise of AI" fluff
- [ ] **Voice check: clinical tone** — verify: reads like lab report, not marketing copy
- [ ] **Word count check** — verify: 800-2000 words, every sentence earns its place

---

## Phase 4: Technical Polish — SEO & Metadata (15-20 min)

### SEO Optimization

- [ ] **Write title tag** — verify: "Patterns: What AI Board Reviews Catch in 11/11 Pitches" or similar
- [ ] **Write meta description** — verify: 150-160 characters, includes hook stat + keywords
- [ ] **Add target keywords naturally** — verify: "AI board review patterns", "AI advisor feedback", "AI persona insights" appear in content
- [ ] **Create social card text** — verify: simple text-on-color ready, includes title + hook

### Markdown Quality

- [ ] **Format all headers correctly** — verify: proper ## syntax, hierarchy makes sense
- [ ] **Format all blockquotes correctly** — verify: proper > syntax, attribution clear
- [ ] **Format all bullets correctly** — verify: proper - syntax, consistent style
- [ ] **Check bold/italic usage** — verify: proper ** and * syntax, used for emphasis only
- [ ] **Validate no broken syntax** — verify: markdown renders correctly

---

## Phase 5: Quality Assurance — Pre-Ship Checks (20-30 min)

### Content Verification

- [ ] **Count total blockquotes** — verify: at least 8 blockquotes total (2+ per board member)
- [ ] **Verify all quotes are real** — verify: each quote exists in source files (run test script)
- [ ] **Verify all attributions correct** — verify: each quote attributed to right board member
- [ ] **Check quantified frequencies** — verify: all "X/11" counts are accurate

### Voice Verification

- [ ] **Run hedging language detector** — verify: test script finds zero instances of banned phrases
- [ ] **Tone test: read opening paragraph** — verify: sounds clinical, not cheerful or corporate
- [ ] **Tone test: read limitations section** — verify: honest without being self-deprecating
- [ ] **Overall voice consistency** — verify: entire post maintains "lab report with soul" tone

### Structure Verification

- [ ] **Test 10-second framework clarity** — verify: can name all 4 board members' focus areas from skim
- [ ] **Test 30-second hook effectiveness** — verify: can recall one memorable insight from opening
- [ ] **Check flow between sections** — verify: transitions are smooth, logical progression
- [ ] **Verify limitations included** — verify: section exists, brief, honest

### Technical Verification

- [ ] **Run banned patterns check** — verify: test script shows no hardcoded paths, no secrets, no banned API usage
- [ ] **Verify markdown syntax** — verify: test script confirms clean headers, quotes, bullets
- [ ] **Check file location** — verify: saved to correct path per publishing mechanism
- [ ] **Verify word count in range** — verify: 800-2000 words (flexible based on quality)

---

## Phase 6: Final Review & Ship (10-15 min)

### Final Quality Gates

- [ ] **Steve's checklist: taste & rigor** — verify: post demonstrates scholarship, zero hedging, real quotes
- [ ] **Elon's checklist: data & speed** — verify: quantified patterns, ships on time, distribution-ready
- [ ] **Seth's approval** — verify: get explicit "ship it" confirmation

### Publishing

- [ ] **Save final markdown to publish location** — verify: file in correct directory per repo structure
- [ ] **Save metadata file (if needed)** — verify: patterns-meta.json or equivalent created
- [ ] **Run final test suite** — verify: all test scripts pass (banned patterns, quotes, voice, structure)
- [ ] **Git commit with clear message** — verify: commit message follows repo conventions
- [ ] **Git push to remote** — verify: pushed to correct branch for publishing

### Post-Publish Setup (Seth's responsibility)

- [ ] **Verify metadata deployed** — verify: SEO tags live on published page
- [ ] **Submit to Google Search Console** — verify: submitted for indexing
- [ ] **Create Twitter thread** — verify: quantified patterns extracted as tweetable stats
- [ ] **Create LinkedIn post** — verify: key insight formatted for LinkedIn
- [ ] **Prepare newsletter excerpt** — verify: 3-4 sentence summary with link back
- [ ] **Set up UTM tracking** — verify: can measure views, shares, conversions

---

## Emergency Rollback Plan

If critical issue discovered post-publish:

- [ ] **Document the issue** — verify: clear description of what's wrong
- [ ] **Assess severity** — verify: is this fix-forward or rollback situation?
- [ ] **If fix-forward: create patch** — verify: minimal change, test before deploy
- [ ] **If rollback: unpublish** — verify: remove from public, fix locally, republish
- [ ] **Update learnings** — verify: document what went wrong for future prevention

---

## Notes

**Blockers to watch for:**
- Source files inaccessible (SSH issues)
- Inconsistent review file formats (parsing difficulty)
- Insufficient quotes for 4-box framework
- Voice drifts toward marketing/hype
- Content quality fails Steve's rigor test

**Time estimates:**
- Each phase can be completed in <5 min chunks
- Phases 2-3 are longest (analysis + writing)
- Phase 5 critical: don't skip QA to save time
- Total estimated: 2-3 hours for experienced writer

**Verification philosophy:**
Every task should be immediately verifiable. If you can't prove it worked, the task isn't done.

**Parallel work opportunities:**
- Source collection (Phase 1) can happen while confirming blockers (Phase 0)
- 4-box sections (Phase 3) can be written in any order
- SEO work (Phase 4) can happen while waiting for review
- Test scripts (Phase 5) can be written during Phase 3

**Success = Seth says "ship it" and all test scripts pass.**

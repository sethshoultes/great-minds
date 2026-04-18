# Spec: Blog Post — "Phoenix: Building a System That Won't Stay Dead"

## Goals (from PRD)

**Title:** "Phoenix" or "Building a System That Won't Stay Dead" (decisions.md)

**Purpose:** Document the Great Minds pipeline evolution from fragile cron scripts to self-healing systemd daemon, centered on the "48 restarts" story as the narrative hook.

**Target Audience:** Engineers building autonomous systems who want real war stories, not marketing copy

**Success Metrics:**
- 1500-2000 words (flexible — story dictates length)
- Covers full evolution: cron scripts → tmux (failed) → Agent SDK daemon → systemd service
- Includes concrete failure examples with stack traces
- Battle-scarred honesty tone throughout
- Opening 100 words mention "48 restarts"
- Committed and pushed to repo
- Ships in ≤30 minutes agent time

## Implementation Approach (from Plan & Decisions)

### Content Strategy

**Format:** Text-only markdown (v1)
- Clean markdown: headers, blockquotes, code blocks, bold/italic
- NO diagrams in v1 (per Decision 6 — time budget constraint)
- NO comparisons to other systems (Airflow, Temporal) — keep focused on our story
- Code snippets from daemon.ts and pipeline.ts

**Voice:** "Battle-scarred honesty" (Decision 7)
- War stories, not marketing copy
- Real stack traces, error logs, failure data
- No buzzwords ("leveraging", "synergies", "best practices")
- "Here's what broke, here's what we built, here's what works now"
- Explain technical terms in human terms or cut them
- Example tone: "We tried tmux. It failed spectacularly. Here's the stack trace."

**Structure:** Chronological narrative (Decision 3)
1. **Opening hook** — Lead with 48 restarts in first 100 words (Decision 2)
2. **The tmux Attempt** — What we tried, why it seemed like a good idea
3. **The Failure Cascade** — 48 restarts, OOM kills, dead code, wrong directories
4. **The systemd Solution** — Current architecture and reliability features
5. **Current State** — Fully autonomous, self-healing, auto-queuing

### Content Components

1. **Title with Phoenix framing** (Decision 1)
   - Must include "Phoenix" or "Building a System That Won't Stay Dead"

2. **Opening paragraph** (CRITICAL — Decision 2)
   - MUST mention 48 restarts/deaths/resurrections in first 100 words
   - Hook immediately: failure is more interesting than success

3. **Three-section body** (Chronological)
   - **Section 1: The tmux Attempt**
     - Why tmux send-keys seemed like the answer
     - Why it didn't work (input buffer rejects send-keys)
     - What we learned

   - **Section 2: The Failure Cascade**
     - 48 restarts story (OOM kills from parallel agents)
     - Dead code in gitAutoCommit
     - Wrong PRD directory
     - Real stack traces and error examples (at least 2-3)
     - Swap + batching solution

   - **Section 3: The systemd Solution**
     - Current architecture overview
     - Reliability features: PID lockfile, watchdog timeout, retry + backoff, queue persistence
     - chokidar file watcher
     - Pipeline phases with timeout protection
     - Auto-commit and crash recovery

4. **Code snippets from source files**
   - daemon.ts: PID lockfile, queue management, watchdog
   - pipeline.ts: Retry logic, timeout protection, agent spawning
   - Keep snippets focused and explained

5. **Conclusion: Current autonomous capabilities**
   - Fully self-healing
   - Auto-queuing from GitHub issues
   - What works now

### Data Requirements

**Source Material (all local — no SSH needed per Decision 5):**
- `/Users/sethshoultes/Local Sites/great-minds-plugin/daemon/src/daemon.ts` (415 lines)
- `/Users/sethshoultes/Local Sites/great-minds-plugin/daemon/src/pipeline.ts` (716 lines)
- `/Users/sethshoultes/Local Sites/great-minds-plugin/daemon/README.md` (systemd setup)
- `/Users/sethshoultes/Local Sites/great-minds-plugin/docs/LEARNINGS.md` (historical failures)
- `/Users/sethshoultes/Local Sites/great-minds-plugin/DO-NOT-REPEAT.md` (voice constraints)
- `/Users/sethshoultes/Local Sites/great-minds-plugin/BANNED-PATTERNS.md` (style prohibitions)

**Required Analysis:**
- Extract 2-3 concrete error examples/stack traces (R10, V3)
- Identify key reliability patterns in daemon.ts and pipeline.ts
- Synthesize evolution timeline from LEARNINGS.md and code
- No SSH needed — all files available locally

### Technical Requirements

**Publishing:**
- Destination: `/Users/sethshoultes/Local Sites/great-minds-plugin/deliverables/blog-gsd-pipeline-evolution/phoenix-post.md`
- Commit to repository with conventional commit message
- Include Co-Authored-By: Claude Sonnet 4.5

**Format:**
- Markdown file with clean syntax
- Use: headers (##), blockquotes (>), code blocks (```), bullets (-), bold (**), italic (*)
- No custom HTML/CSS

**Time Constraint:**
- Hard 30-minute cap (Decision 4)
- 5 min: Research/reading source files
- 15 min: Writing with Phoenix framing
- 5 min: Editing pass (jargon cuts)
- <5 min: Commit

## Verification Criteria

### Content Quality Checks

✅ **Opening hook effectiveness** — "48 restarts" mentioned in first 100 words
- Test: grep -A 20 "^#" phoenix-post.md | head -100 | grep -i "48\|restart\|death\|crash"

✅ **Three-section chronological structure** — Body has tmux → failures → systemd flow
- Test: Headings visible for three phases of evolution

✅ **Concrete failure examples** — At least 2 real stack traces or error messages
- Test: Count code blocks or error examples in failure section

✅ **Code snippets included** — Examples from daemon.ts and pipeline.ts
- Test: Code blocks reference actual daemon/pipeline features

✅ **Technical terms explained** — All jargon has human-readable explanation
- Test: Manual review — can a non-technical reader follow?

✅ **Phoenix framing** — Title includes Phoenix or resurrection metaphor
- Test: grep -i "phoenix\|won't stay dead" phoenix-post.md

✅ **Battle-scarred voice** — No buzzwords, no marketing copy
- Test: grep -i "leveraging\|synergies\|best practices\|robust\|scalable" phoenix-post.md returns zero

### Structural Quality Checks

✅ **Chronological narrative** — Timeline is structure, not emotional arc
- Test: Sections follow evolution order (cron → tmux → daemon → systemd)

✅ **Text-only format** — No diagrams, no custom styling
- Test: No image references, no HTML/CSS blocks

✅ **No comparisons to other systems** — Focused on our story
- Test: No mentions of Airflow, Temporal, Kubernetes, etc.

✅ **Story length feels complete** — No padding to hit word count, no arbitrary cuts
- Test: Manual review — does it feel complete?

### Technical Quality Checks

✅ **daemon.ts and pipeline.ts unchanged** — Journalist mode only, no refactoring
- Test: git status | grep "daemon/src/" returns nothing

✅ **Clean markdown syntax** — Proper formatting throughout
- Test: Markdown linter passes (or manual review)

✅ **Source quotes are real** — All code snippets come from actual files
- Test: Verify snippets match daemon.ts/pipeline.ts content

✅ **File created in correct location**
- Test: File exists at deliverables/blog-gsd-pipeline-evolution/phoenix-post.md

✅ **Committed with proper message**
- Test: git log shows commit with "Phoenix blog post" and Co-Authored-By line

### Voice Quality Checks

✅ **"Here's what broke, here's what we built, here's what works now" framing**
- Test: Post shows failures honestly, then solutions

✅ **Real technical details** — Stack traces, error logs, specific numbers
- Test: Contains "48 restarts", OOM kill messages, actual error text

✅ **No banned patterns**
- Test: grep for patterns in BANNED-PATTERNS.md returns zero

✅ **Jargon ruthlessly cut**
- Test: Every technical term either explained in human terms or removed

## Files That Will Be Created or Modified

### New Files Created

1. **`/Users/sethshoultes/Local Sites/great-minds-plugin/deliverables/blog-gsd-pipeline-evolution/phoenix-post.md`**
   - Primary deliverable: the blog post
   - 1500-2000 words markdown (flexible based on story)
   - Complete with all content sections per structure above

2. **`/Users/sethshoultes/Local Sites/great-minds-plugin/deliverables/blog-gsd-pipeline-evolution/spec.md`** (this file)
   - Complete specification document

3. **`/Users/sethshoultes/Local Sites/great-minds-plugin/deliverables/blog-gsd-pipeline-evolution/todo.md`**
   - Atomic task breakdown with verification steps
   - Each task <5 minutes
   - Format: "- [ ] Task description — verify: how to check it worked"

4. **`/Users/sethshoultes/Local Sites/great-minds-plugin/deliverables/blog-gsd-pipeline-evolution/tests/`** (directory)
   - `check-banned-patterns.sh` — Grep for banned patterns in post
   - `verify-structure.sh` — Check for required sections and Phoenix framing
   - `check-voice.sh` — Detect buzzwords and hedging language
   - `verify-quote-authenticity.sh` — Verify code snippets exist in source
   - All scripts executable (chmod +x), exit 0 on pass

### Existing Files Read (Not Modified)

5. **PRD:** `/Users/sethshoultes/Local Sites/great-minds-plugin/prds/blog-gsd-pipeline-evolution.md`
6. **Plan:** `/Users/sethshoultes/Local Sites/great-minds-plugin/.planning/phase-1-plan.md`
7. **Decisions:** `/Users/sethshoultes/Local Sites/great-minds-plugin/rounds/blog-gsd-pipeline-evolution/decisions.md`
8. **Project Rules:** `/Users/sethshoultes/Local Sites/great-minds-plugin/CLAUDE.md` (if exists)
9. **Banned Patterns:** `/Users/sethshoultes/Local Sites/great-minds-plugin/BANNED-PATTERNS.md`

### Source Material Files Read (Not Modified)

10. **`daemon/src/daemon.ts`** — Main daemon implementation (415 lines)
11. **`daemon/src/pipeline.ts`** — GSD pipeline phases (716 lines)
12. **`daemon/README.md`** — Systemd service and architecture overview
13. **`docs/LEARNINGS.md`** — Historical failures and lessons learned
14. **`DO-NOT-REPEAT.md`** — Voice constraints and anti-patterns

## Requirements Traceability

From PRD and decisions.md — all 44 requirements:

### Content Requirements (R1-R15)
- **R1**: Evolution story (cron → tmux → daemon → systemd) — Section 1-3 structure
- **R2**: tmux failure explained — Section 1
- **R3**: OOM kills documented — Section 2
- **R4**: gitAutoCommit failure documented — Section 2
- **R5**: Wrong PRD directory documented — Section 2
- **R6**: Current architecture described — Section 3
- **R7**: 48 restarts story — Opening paragraph + Section 2
- **R8**: Swap/batching solution — Section 2
- **R9**: Current autonomous state — Conclusion
- **R10**: Concrete stack traces — Section 2 (minimum 2-3 examples)
- **R11**: Code snippets from daemon.ts/pipeline.ts — Throughout
- **R12**: Engineering narrative tone — Voice checks
- **R13**: 48 restarts in opening — Opening paragraph verification
- **R14**: Chronological structure — Three-section body
- **R15**: Real failure data — Stack traces and error logs

### Structural Requirements (S1-S10)
- **S1**: 1500-2000 words — Word count check (flexible)
- **S2**: Chronological narrative — Three sections follow timeline
- **S3**: Three-section body — Structure check
- **S4**: Opening mentions 48 restarts — First 100 words verification
- **S5**: Text-only (no diagrams) — Format check
- **S6**: No comparisons to other systems — Content check
- **S7**: Messy reality shown — Battle-scarred honesty voice
- **S8**: Auto-queuing from GitHub mentioned — Conclusion
- **S9**: Story dictates length — No padding/arbitrary cuts
- **S10**: Phoenix title framing — Title check

### Voice/Tone Requirements (V1-V10)
- **V1**: Engineering narrative — War story tone
- **V2**: Battle-scarred honesty — Real failures shown
- **V3**: Real stack traces — Minimum 2-3 in Section 2
- **V4**: "Here's what broke, here's what we built" framing — Structure
- **V5**: No buzzwords — Banned patterns check
- **V6**: Cut jargon that doesn't earn its keep — Editing pass
- **V7**: Technical terms explained in human terms — Readability check
- **V8**: No extraneous details — Editing pass
- **V9**: No banned patterns — Test script verification
- **V10**: All terms have human-readable explanation — Manual review

### Technical Requirements (T1-T10)
- **T1-T5**: Read source files locally — All files local, no SSH
- **T6-T7**: Output location — deliverables/blog-gsd-pipeline-evolution/phoenix-post.md
- **T8**: 30-minute time budget — Hard cap enforced
- **T9**: No code refactoring — Read-only on daemon/pipeline files
- **T10**: Commit with co-author credit — Git commit verification

## Success Criteria Summary

**The post is ready to ship when:**

✅ Opening 100 words mention "48 restarts" or equivalent failure metric
✅ Three-section chronological structure visible in headings
✅ At least 2 concrete error examples/stack traces included
✅ Code snippets from daemon.ts and pipeline.ts present
✅ All technical terms explained in human terms
✅ No buzzwords (grep test passes)
✅ Chronological narrative, not emotional arc
✅ Title includes "Phoenix" framing
✅ daemon.ts and pipeline.ts unchanged (no refactoring)
✅ Blog post committed with Co-Authored-By line
✅ Total execution time ≤30 minutes
✅ All test scripts pass (exit 0)

**Steve's Test:**
> "If someone reads this and thinks 'cool pipeline,' we failed. If they think 'I want to build something that resilient,' we won."

**Elon's Test:**
> "If this takes more than 1 hour of wall-clock time, something went wrong."

## Non-Negotiables (Final Reminder)

### From Decisions.md

**Steve Jobs Requirements:**
1. Name is Phoenix — not "pipeline evolution"
2. Lead with 48 restarts — failure in first 100 words
3. Battle-scarred honesty — war stories, stack traces, real mess

**Elon Musk Requirements:**
1. 30 minutes maximum — hard cap, no exceptions
2. Chronological narrative — timeline IS structure
3. No SSH needed — files are local

**Shared Agreement:**
1. No refactoring — journalist mode only
2. Ruthlessly cut jargon — explain or delete
3. Story dictates length — no arbitrary targets
4. Ship fast, iterate never — v1 is final

**Time Allocation:**
- 5 min: Research (read daemon.ts, pipeline.ts, LEARNINGS.md, voice constraints)
- 15 min: Writing (title, opening, three sections, conclusion)
- 5 min: Editing (jargon cuts, voice polish)
- <5 min: Commit and verify

**Quality Gates:**
- Opening paragraph checkpoint: Does it mention 48 restarts? YES/NO
- Structure checkpoint: Three sections visible? YES/NO
- Voice checkpoint: Battle-scarred honesty, not marketing? YES/NO
- Time checkpoint: ≤30 minutes? YES/NO

---

**Ship with confidence.** The story is already good. The code already exists. Just tell it.

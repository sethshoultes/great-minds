# Todo: Phoenix Blog Post — GSD Pipeline Evolution

**Time Budget:** 30 minutes maximum (hard cap)
**Current Phase:** Pre-implementation (setup only)

---

## Research Phase (5 minutes)

- [ ] Read daemon/src/daemon.ts focusing on PID lockfile, queue management, watchdog timeout — verify: can explain these 3 features in human terms
- [ ] Read daemon/src/pipeline.ts focusing on retry logic, agent spawning, timeout protection — verify: can explain retry/backoff mechanism
- [ ] Read daemon/README.md for systemd service setup — verify: understand systemd integration
- [ ] Skim docs/LEARNINGS.md for historical failures (tmux, OOM kills, gitAutoCommit, wrong PRD directory) — verify: identified 2-3 specific failure examples
- [ ] Read DO-NOT-REPEAT.md and BANNED-PATTERNS.md for voice constraints — verify: know which words/patterns to avoid
- [ ] Extract 2-3 concrete error examples or stack traces from LEARNINGS.md or code comments — verify: have real technical failures to include

**Checkpoint:** 5 minutes elapsed. Proceed to writing phase.

---

## Writing Phase (15 minutes)

### Opening & Title (3 minutes)

- [ ] Write title with Phoenix framing: "Phoenix: Building a System That Won't Stay Dead" or similar — verify: title contains "Phoenix" or resurrection metaphor
- [ ] Write opening paragraph (first 100 words) mentioning 48 restarts/deaths before any architecture discussion — verify: grep first 100 words for "48" or "restart" or "death"

### Section 1: The tmux Attempt (3 minutes)

- [ ] Explain why tmux send-keys seemed like the answer — verify: motivation is clear
- [ ] Explain why it failed (input buffer rejects send-keys) — verify: includes technical reason from DO-NOT-REPEAT.md
- [ ] Include what we learned from this failure — verify: lesson is explicit

### Section 2: The Failure Cascade (6 minutes)

- [ ] Write 48 restarts story with OOM kills from parallel agents — verify: includes "48 restarts" and OOM context
- [ ] Document dead code in gitAutoCommit failure — verify: specific example included
- [ ] Document wrong PRD directory issue — verify: specific example included
- [ ] Include at least 2 real stack traces or error messages — verify: code blocks with actual error text present
- [ ] Explain swap + batching solution that fixed OOM issues — verify: solution is clear

### Section 3: The systemd Solution (3 minutes)

- [ ] Describe current architecture: systemd service, chokidar watcher, pipeline phases — verify: high-level overview complete
- [ ] Explain reliability features: PID lockfile (prevent duplicate daemons) in human terms — verify: explained why it matters
- [ ] Explain watchdog timeout (detect hung pipelines) in human terms — verify: explained why it matters
- [ ] Explain retry + exponential backoff in human terms — verify: explained why it matters
- [ ] Explain queue persistence (survive restarts) in human terms — verify: explained why it matters
- [ ] Include 1-2 code snippets from daemon.ts showing PID lockfile or queue management — verify: code is real and explained

### Conclusion: Current State (2 minutes)

- [ ] Describe fully autonomous capabilities (self-healing, auto-commit, crash recovery) — verify: mentions key autonomous features
- [ ] Mention auto-queuing from GitHub issues — verify: complete picture of current system
- [ ] End with what works now (not what's planned) — verify: focuses on present, not future

**Checkpoint:** 20 minutes total elapsed (5 research + 15 writing). Proceed to editing phase.

---

## Editing Phase (5 minutes)

- [ ] Read through entire post once — verify: complete read-through done
- [ ] Identify all technical terms (watchdog, chokidar, PID lockfile, exponential backoff, etc.) — verify: list created
- [ ] For each technical term: is it explained in human terms? If NO, add explanation or cut the term — verify: every term has human-readable explanation or is removed
- [ ] Check for buzzwords: grep post for "leveraging", "synergies", "best practices", "robust", "scalable" — verify: zero matches
- [ ] Check for hedging language: grep for "tends to", "often", "sometimes", "generally" — verify: replaced with definitive statements
- [ ] Verify voice: does it read like a war story with battle-scarred honesty, not marketing copy? — verify: tone matches "here's what broke, here's what we built"
- [ ] Final length check: does story feel complete without padding or arbitrary cuts? — verify: natural ending, not forced

**Checkpoint:** 25 minutes total elapsed (5 research + 15 writing + 5 editing). Proceed to commit.

---

## Commit Phase (<5 minutes)

- [ ] Run test scripts in tests/ directory to verify post quality — verify: all tests exit 0
- [ ] Run git status to check no daemon.ts or pipeline.ts changes — verify: only blog post files are modified
- [ ] Stage blog post: git add deliverables/blog-gsd-pipeline-evolution/ — verify: files staged
- [ ] Commit with message: "docs: publish Phoenix blog post (GSD pipeline evolution)" + full body + Co-Authored-By line — verify: commit message follows format from spec.md
- [ ] Verify git status shows clean working directory — verify: no uncommitted changes
- [ ] Verify commit includes Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com> — verify: git log shows co-author

**Checkpoint:** 30 minutes total elapsed. DONE.

---

## Quality Gates (Check Before Marking Complete)

### Content Completeness
- [ ] Opening 100 words mention "48 restarts" ✓
- [ ] Three-section structure visible (tmux → failures → systemd) ✓
- [ ] At least 2 concrete error examples/stack traces ✓
- [ ] Code snippets from daemon.ts and/or pipeline.ts ✓
- [ ] All technical terms explained in human terms ✓
- [ ] Phoenix framing in title ✓

### Voice & Style
- [ ] Battle-scarred honesty, not marketing copy ✓
- [ ] Real technical details (stack traces, specific errors) ✓
- [ ] No buzzwords (grep test passes) ✓
- [ ] "Here's what broke, here's what we built" framing ✓

### Technical Quality
- [ ] daemon.ts and pipeline.ts unchanged ✓
- [ ] Chronological narrative (not emotional arc) ✓
- [ ] Text-only (no diagrams) ✓
- [ ] No comparisons to other systems ✓
- [ ] All test scripts pass ✓

### Process Quality
- [ ] Total time ≤30 minutes ✓
- [ ] Committed with Co-Authored-By line ✓
- [ ] Story feels complete (not padded or truncated) ✓

---

## Notes

**Time Tracking:**
- Start time: _____________
- Research complete: _____________ (should be +5 min)
- Writing complete: _____________ (should be +15 min = 20 min total)
- Editing complete: _____________ (should be +5 min = 25 min total)
- Commit complete: _____________ (should be <30 min total)

**If Running Over Time:**
- STOP at 30 minutes
- Ship what's written (better to ship incomplete than miss deadline)
- Mark remaining tasks and note in commit message

**Quality Over Completeness:**
- Opening hook is CRITICAL — don't compromise on 48 restarts in first 100 words
- Real error examples are CRITICAL — don't skip stack traces/errors
- Jargon explanations are CRITICAL — every technical term must be human-readable
- Everything else is negotiable under time pressure

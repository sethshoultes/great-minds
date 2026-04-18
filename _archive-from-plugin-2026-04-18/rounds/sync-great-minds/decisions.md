# Sync Great Minds — Locked Decisions Blueprint

**Moderator:** Phil Jackson
**Debaters:** Steve Jobs (Design/Product), Elon Musk (Engineering/Architecture)
**Purpose:** Consolidate debate into actionable build specifications

---

## Executive Summary

**What We're Building:** A zero-configuration command (`sync`) that enforces one-way truth propagation from great-minds-plugin daemon to great-minds repository. 8 files. Under 5 seconds. Zero apologies.

**Why It Exists:** Architectural debt. Two repos contain duplicate daemon code. This is a surgical band-aid, not a permanent solution.

**Success Criteria:** Ships in one agent session. Works perfectly or fails loudly. Scheduled for deletion once shared package architecture is implemented.

---

## Locked Decisions

### Decision 1: Zero Configuration Architecture
**Proposed by:** Steve Jobs (Round 1)
**Challenged by:** N/A
**Final Decision:** **LOCKED — Steve's position**

**Rationale:**
- Hardcoded paths (plugin → great-minds)
- No config files, no flags, no "strategies"
- Tool runs maybe once per month — flexibility is over-engineering
- Every configuration option is a decision burden and failure mode

**Why This Won:** Elon explicitly agreed in Round 2: "If you're syncing the same 8 files every time, config is just premature generalization. YAGNI applies here."

**Implementation:**
```
Source: /daemon/src/*.ts, /daemon/package.json, /daemon/README.md, /BANNED-PATTERNS.md, /DO-NOT-REPEAT.md
Destination: /great-minds/daemon/ (matching structure)
```

---

### Decision 2: Validation Before Execution
**Proposed by:** Elon Musk (Round 2)
**Challenged by:** Steve Jobs (Round 1 - "No dry run mode")
**Final Decision:** **LOCKED — Elon's position (modified)**

**Rationale:**
- Steve wanted "commit to the action or don't run it"
- Elon countered with "confidence comes from correctness, not bravado"
- Validation prevents data loss from uncommitted changes or wrong paths

**Why This Won:** Protecting against silent corruption aligns with both debaters' "fail fast, fail loud" philosophy. Validation ≠ dry-run mode; it's pre-flight safety.

**Implementation:**
- Check: Destination has no uncommitted changes (abort if dirty)
- Check: Source files exist (abort if missing)
- Check: npm available in PATH
- Execute: Copy → npm install → git commit → push
- No "preview mode" — either validate passes and runs, or fails immediately

---

### Decision 3: Binary Outcomes Only
**Proposed by:** Steve Jobs (Round 1)
**Affirmed by:** Elon Musk (Round 2)
**Final Decision:** **LOCKED — Consensus**

**Rationale:**
- "It either works perfectly or screams bloody murder" (Steve)
- "No silent corruption. No 'sync completed with warnings.'" (Elon)
- No progress bars, no partial successes, no "estimating time remaining"

**Why This Won:** Both debaters rejected complexity. Tool must complete in <5 seconds or throw hard error.

**Implementation:**
- Exit code 0: Success, files synced, npm installed, committed, pushed
- Exit code 1: Failure, state unchanged, loud error message
- No intermediate states, no retry logic, no "best effort"

---

### Decision 4: Command Name is "sync"
**Proposed by:** Steve Jobs (Round 1)
**Challenged by:** Elon Musk (Round 2 - "Fine. I don't care.")
**Final Decision:** **LOCKED — Steve's position**

**Rationale:**
- Single-word commands are memorable and confident
- "sync" vs "great-minds-sync" vs "sync-daemon" — simplicity wins
- Developers say "run sync" not "run the synchronization utility"

**Why This Won:** Elon yielded ("don't pretend naming is the hard part"). No strong counter-argument.

**Implementation:**
- Command: `npm run sync` (or executable `./bin/sync`)
- No aliases, no variations
- Terminal output: "Syncing daemon code..." → "Done."

---

### Decision 5: This is Temporary — Sunset Required
**Proposed by:** Elon Musk (Round 2)
**Acknowledged by:** Steve Jobs (Round 2 - "roadmap the death of Sync")
**Final Decision:** **LOCKED — Consensus**

**Rationale:**
- Both agree dual repos are architectural debt
- Sync is a beautiful band-aid, not a long-term solution
- End goal: daemon as npm package or git submodule, imported by great-minds

**Why This Won:** Steve conceded "fix the architecture later." Elon insisted "if we're still syncing in 6 months, we failed."

**Implementation:**
- Add to README: "⚠️ TEMPORARY TOOL — Scheduled for deprecation once daemon is extracted to shared package"
- Roadmap: Refactor daemon to standalone npm package within 3 months
- Success metric: Tool is deleted, not improved

---

### Decision 6: Speed is Non-Negotiable (<5 Seconds)
**Proposed by:** Steve Jobs (Round 1, Round 2)
**Challenged by:** Elon Musk (Round 1 - "If npm install is slow, that's a package.json problem")
**Final Decision:** **LOCKED — Steve's position with caveat**

**Rationale:**
- "If it takes longer than 5 seconds, we failed" (Steve)
- Design constraint forces architectural correctness
- Progress bars are apologies for slow systems

**Why This Won:** Elon agreed the operation is trivial (8 text files, milliseconds). Only bottleneck is `git push` (external, unpredictable).

**Implementation:**
- File copy: <100ms
- npm install: <2s (if slow, optimize package.json separately)
- git operations: best effort (network dependency acceptable)
- If local operations exceed 5s, tool is broken

---

### Decision 7: No Feature Scope Creep
**Proposed by:** Steve Jobs (Round 1 - "What to Say NO To" list)
**Affirmed by:** Elon Musk (Round 2)
**Final Decision:** **LOCKED — Consensus**

**Forbidden Features:**
- ❌ Sync strategies (one-way only, plugin is truth)
- ❌ Conflict resolution (source overwrites, period)
- ❌ Selective sync (all 8 files or nothing)
- ❌ Dry run mode (validation checks only)
- ❌ Sync history (git log is the history)
- ❌ Configuration files (hardcoded paths)

**Why This Won:** Elon called out these as "scope creep that would turn a 5-minute script into a 5-week project."

**Implementation:**
- If feature request arrives, default answer is NO
- One-way sync from plugin → great-minds, always
- Source overwrites destination, no merging

---

## MVP Feature Set (What Ships in v1)

### Core Functionality
1. **Copy 8 files** from great-minds-plugin to great-minds
   - `/daemon/src/*.ts` (all TypeScript files)
   - `/daemon/package.json`
   - `/daemon/README.md`
   - `/BANNED-PATTERNS.md`
   - `/DO-NOT-REPEAT.md`
   - `/CLAUDE.md` (edit to add sync reminder)

2. **Run npm install** in destination `/great-minds/daemon/`

3. **Git operations** in great-minds repo:
   - `git add .`
   - `git commit -m "Sync daemon from plugin"`
   - `git push`

4. **Pre-flight validation**:
   - Destination has no uncommitted changes
   - Source files exist
   - npm is available

5. **Terminal output**:
   ```
   Syncing daemon code...
   Done.
   ```

### What Does NOT Ship in v1
- No configuration
- No progress indicators
- No partial sync
- No conflict resolution
- No rollback mechanism
- No dry-run mode
- No logging beyond success/failure

---

## File Structure (What Gets Built)

### Option A: NPM Script (Simplest)
```
great-minds-plugin/
├── sync.sh                    # Bash script with hardcoded paths
├── package.json               # Add "sync": "./sync.sh"
└── daemon/
    └── [source files]
```

### Option B: Node Script (Cross-platform)
```
great-minds-plugin/
├── bin/
│   └── sync.js                # Node script using fs and child_process
├── package.json               # Add "sync": "node bin/sync.js"
└── daemon/
    └── [source files]
```

**Recommended:** Option A (bash script) for immediate shipping. Option B if Windows compatibility required.

### File Contents

#### `/sync.sh` (Bash Script)
```bash
#!/bin/bash
set -e  # Exit on error

PLUGIN_ROOT="/path/to/great-minds-plugin"
GREAT_MINDS_ROOT="/path/to/great-minds"

# Pre-flight validation
cd "$GREAT_MINDS_ROOT"
if [[ -n $(git status -s) ]]; then
  echo "❌ Error: great-minds has uncommitted changes. Commit or stash first."
  exit 1
fi

# Check source files exist
if [[ ! -d "$PLUGIN_ROOT/daemon/src" ]]; then
  echo "❌ Error: Source daemon/src not found in plugin repo."
  exit 1
fi

# Sync
echo "Syncing daemon code..."

cp -r "$PLUGIN_ROOT/daemon/src"/* "$GREAT_MINDS_ROOT/daemon/src/"
cp "$PLUGIN_ROOT/daemon/package.json" "$GREAT_MINDS_ROOT/daemon/"
cp "$PLUGIN_ROOT/daemon/README.md" "$GREAT_MINDS_ROOT/daemon/"
cp "$PLUGIN_ROOT/BANNED-PATTERNS.md" "$GREAT_MINDS_ROOT/"
cp "$PLUGIN_ROOT/DO-NOT-REPEAT.md" "$GREAT_MINDS_ROOT/"

# Update CLAUDE.md (add reminder to sync after daemon changes)
# [Implementation: sed or echo append]

# npm install
cd "$GREAT_MINDS_ROOT/daemon"
npm install --silent

# Commit and push
cd "$GREAT_MINDS_ROOT"
git add .
git commit -m "Sync daemon from plugin"
git push

echo "Done."
```

#### `/daemon/README.md` Addition
```markdown
⚠️ **IMPORTANT:** This daemon code is synced from great-minds-plugin.
Do NOT edit files here directly. Changes will be overwritten.
Edit in plugin repo, then run `npm run sync`.
```

---

## Open Questions (What Still Needs Resolution)

### 1. Absolute vs Relative Paths in sync.sh?
**Question:** Should sync script use hardcoded absolute paths or discover repos dynamically?

**Options:**
- A) Hardcoded: `/Users/sethshoultes/Local Sites/great-minds-plugin`
- B) Relative: Assume script runs from plugin root, calculate great-minds path
- C) Environment variables: `$PLUGIN_ROOT` and `$GREAT_MINDS_ROOT` set by user

**Recommendation:** Start with (A) hardcoded for immediate shipping. User can edit paths manually (one-time setup).

---

### 2. CLAUDE.md Edit — What Exactly to Add?
**Question:** The sync script should edit `/great-minds/CLAUDE.md` to add a reminder. What text?

**Draft:**
```markdown
## Daemon Sync Protocol
The daemon code in `/daemon/` is synced from great-minds-plugin.
After editing daemon files in the plugin, run: `npm run sync` (in plugin repo)
DO NOT edit daemon files directly in this repo.
```

**Needs:** Confirmation on placement (append to end? add new section?)

---

### 3. Git Commit Message — Generic or Specific?
**Question:** Should commit message always be "Sync daemon from plugin" or include file list?

**Options:**
- A) Static: `"Sync daemon from plugin"`
- B) Dynamic: `"Sync daemon from plugin: updated [list files]"`

**Recommendation:** Static (A). Git diff shows what changed. Message is just context.

---

### 4. Error Handling — How Loud Should Failures Be?
**Question:** If git push fails (network issue), should script:
- A) Exit 1 with error message only
- B) Rollback git commit (git reset --hard HEAD~1)
- C) Leave commit local, let user resolve

**Recommendation:** (C). If push fails, local commit remains. User can manually `git push` when network recovers. No silent rollbacks.

---

### 5. Execution Location — Where Should User Run This?
**Question:** Should `npm run sync` execute from:
- A) Plugin repo (syncs TO great-minds)
- B) Great-minds repo (pulls FROM plugin)
- C) Either (bi-directional awareness)

**Recommendation:** (A). Plugin is source of truth. Command lives in plugin package.json.

---

## Risk Register (What Could Go Wrong)

### Risk 1: Path Hardcoding Breaks on Different Machines
**Severity:** Medium
**Likelihood:** High
**Impact:** Sync fails on first run for any new developer

**Mitigation:**
- Document path editing in README
- Or: Use environment variables for paths (adds complexity)
- Or: Interactive setup script on first run (asks for paths)

**Accepted Trade-off:** One-time manual path edit is acceptable given tool's temporary nature.

---

### Risk 2: Uncommitted Changes in Destination Cause Data Loss
**Severity:** Critical
**Likelihood:** Medium
**Impact:** Developer loses WIP work in great-minds repo

**Mitigation:**
- Pre-flight check: abort if `git status -s` is non-empty
- Loud error message: "Commit or stash changes first"

**Status:** Addressed in Decision 2 (validation before execution)

---

### Risk 3: npm install Fails (Corrupted Packages, Registry Down)
**Severity:** Medium
**Likelihood:** Low
**Impact:** Files synced but dependencies broken

**Mitigation:**
- Script uses `set -e` to exit on any command failure
- npm install failure = sync aborted, git commit never happens
- Destination remains dirty, user can debug

**Accepted Trade-off:** Network dependency failures are external, not sync tool's fault.

---

### Risk 4: Daemon Files Edited Directly in great-minds
**Severity:** High
**Likelihood:** Medium
**Impact:** Edits overwritten on next sync, developer confusion

**Mitigation:**
- Add warning to `/daemon/README.md`: "DO NOT EDIT HERE"
- Add comment to top of each `.ts` file: `// Source: great-minds-plugin/daemon`
- CLAUDE.md reminder

**Status:** Partial — README updated, file comments optional

---

### Risk 5: Tool Never Gets Deleted (Permanent Band-Aid)
**Severity:** Medium (architectural debt)
**Likelihood:** High (teams ship and forget)
**Impact:** Sync becomes permanent, defeating long-term architecture goals

**Mitigation:**
- README sunset warning: "⚠️ TEMPORARY TOOL"
- Roadmap item: Extract daemon to npm package within 3 months
- Add calendar reminder to revisit in 6 months

**Status:** Addressed in Decision 5 (sunset required)

---

### Risk 6: Git Push Fails Silently (Detached HEAD, Wrong Branch)
**Severity:** Medium
**Likelihood:** Low
**Impact:** Files committed locally but never reach remote, sync appears successful

**Mitigation:**
- Check current branch before push: `git rev-parse --abbrev-ref HEAD`
- Abort if not on `main` or `master` (or expected branch)
- Fail loudly if push returns non-zero exit code

**Accepted Trade-off:** Complex git state debugging is out of scope. Assume developer has healthy git setup.

---

### Risk 7: Sync Runs Against Wrong Repos (User Error)
**Severity:** Critical
**Likelihood:** Low
**Impact:** Wrong files overwritten, potential data loss

**Mitigation:**
- Pre-flight check: Verify destination contains expected structure (`/daemon/src/` exists)
- Dry-run sanity check: `ls $GREAT_MINDS_ROOT/daemon/src/*.ts | wc -l` matches expected count
- Abort if structure mismatch

**Status:** Can add basic path validation (check for marker files like `package.json`)

---

## Implementation Checklist

**Agent Build Session Must Complete:**
- [ ] Create `/sync.sh` with hardcoded paths (user must edit)
- [ ] Add `"sync": "./sync.sh"` to `/package.json`
- [ ] Add pre-flight validation (uncommitted changes check)
- [ ] Add pre-flight validation (source files exist check)
- [ ] Copy 8 files: `daemon/src/*.ts`, `package.json`, `README.md`, `BANNED-PATTERNS.md`, `DO-NOT-REPEAT.md`
- [ ] Run `npm install` in destination
- [ ] Git add, commit with message "Sync daemon from plugin", push
- [ ] Update `/daemon/README.md` with "DO NOT EDIT HERE" warning
- [ ] Update `/CLAUDE.md` with sync protocol reminder
- [ ] Add sunset warning to README: "⚠️ TEMPORARY TOOL — Deprecation planned"
- [ ] Test: Run sync.sh, verify files copied, npm installed, git committed
- [ ] Test: Fail case — run with uncommitted changes, verify abort

**Success Criteria:**
- Executes in <5 seconds for local file operations
- Exits 0 on success, 1 on failure
- Terminal output: "Syncing daemon code..." → "Done."
- Zero configuration required (paths hardcoded, editable)

---

## Final Synthesis: What Both Debaters Agreed On

**Steve and Elon converged on:**
1. **This is temporary** — fix architecture, then delete tool
2. **No configuration** — hardcode paths, no flexibility
3. **Fail loudly** — binary outcomes, no warnings
4. **Ship fast** — bash script in 5 minutes, not a 5-week project
5. **Eliminate scope creep** — no conflict resolution, no sync history, no dry-run

**Where they differed (resolved):**
- **Steve:** Make it beautiful → **Elon:** Make it unnecessary → **Synthesis:** Do both sequentially
- **Steve:** No validation → **Elon:** Validate first → **Winner:** Validation (safety without dry-run)
- **Steve:** Design is the product → **Elon:** Code is the product → **Synthesis:** Design forces fast implementation

---

## Moderator's Final Word

**This is a 10-minute build.**
Any agent session that takes longer has misunderstood the assignment.

Ship surgical simplicity today. Delete it tomorrow.

— Phil Jackson, Zen Master

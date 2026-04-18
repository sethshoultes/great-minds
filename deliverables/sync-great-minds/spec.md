# Sync Great Minds — Build Specification

**Build ID:** sync-great-minds
**Generated:** 2026-04-16
**Status:** Ready for Implementation

---

## Goals (from PRD)

### Problem Statement
The great-minds repo has its own copy of the daemon at `daemon/` that is stale — missing anti-hallucination rules, banned patterns, updated agent prompts, timeout fixes, and the failed-dir watcher filter. The plugin is the source of truth.

### Primary Goals
1. **Sync daemon code** from great-minds-plugin to great-minds repository
2. **Sync documentation** (BANNED-PATTERNS.md, DO-NOT-REPEAT.md)
3. **Update CLAUDE.md** with daemon sync protocol and anti-hallucination rules
4. **Install dependencies** via npm install in destination
5. **Commit and push** all changes to great-minds repo

### Critical Constraint
**DO NOT START OVER.** Sync specific files from the plugin repo. Do not restructure the project.

---

## Implementation Approach (from Plan)

### Architecture: Zero-Configuration Bash Script

**Philosophy:** Surgical simplicity. No retry logic, no configuration, no features.

**Execution Model:**
- Single bash script (`sync.sh`) at plugin repo root
- Hardcoded paths (user edits once for their environment)
- `set -e` for fail-fast behavior (exit on any error)
- Binary outcome: exit 0 (success) or exit 1 (failure)
- Speed target: <5 seconds for local operations

### Execution Waves

**Wave 1: Foundation & Validation**
- Create sync.sh with basic structure (shebang, error handling, path variables)
- Implement all pre-flight validation checks

**Wave 2: File Operations & Documentation**
- Copy all 8 files from plugin to great-minds
- Update great-minds CLAUDE.md with sync protocol and anti-hallucination rules

**Wave 3: Dependency Installation**
- Run npm install in destination daemon directory

**Wave 4: Git Operations**
- Stage all changes, commit, and push to remote

**Wave 5: Documentation**
- Add npm script to package.json
- Update README with usage instructions and sunset warning

### Files to Sync (8 total)

**Daemon Source Files:**
1. `daemon/src/*.ts` → `/home/agent/great-minds/daemon/src/` (11 TypeScript files)
2. `daemon/package.json` → `/home/agent/great-minds/daemon/package.json`
3. `daemon/README.md` → `/home/agent/great-minds/daemon/README.md` (with warning banner prepended)

**Documentation Files:**
4. `BANNED-PATTERNS.md` → `/home/agent/great-minds/BANNED-PATTERNS.md`
5. `DO-NOT-REPEAT.md` → `/home/agent/great-minds/DO-NOT-REPEAT.md`

**CLAUDE.md Update:**
6. Append "Daemon Sync Protocol" section
7. Append "Anti-Hallucination Rules" section

### Pre-Flight Validations

All validations MUST pass before any file operations begin:

1. **Destination Clean Check:** Abort if great-minds has uncommitted changes (`git status -s`)
2. **Source Files Exist:** Verify `daemon/src/` directory exists in plugin repo
3. **npm Available:** Verify npm is in PATH
4. **Destination Structure:** Verify `/home/agent/great-minds/daemon/src/` exists
5. **File Count Sanity:** Warn if source doesn't contain expected 11 TypeScript files

### Error Handling

- Script uses `set -e` (exit immediately on any command failure)
- All error messages start with ❌ emoji for visibility
- No partial success states — either complete or fail
- Network failures (git push) are acceptable; commit remains local

---

## Verification Criteria

### How to Prove Each Piece Works

#### Wave 1: Script Foundation
- [ ] **verify:** `sync.sh` exists at `/Users/sethshoultes/Local Sites/great-minds-plugin/sync.sh`
- [ ] **verify:** First line is `#!/bin/bash`
- [ ] **verify:** Script has execute permissions: `ls -l sync.sh | grep -q "^-rwxr"`
- [ ] **verify:** Script contains `set -e` directive
- [ ] **verify:** PLUGIN_ROOT and GREAT_MINDS_ROOT variables are defined with proper quoting

#### Wave 1: Pre-Flight Validations
- [ ] **verify:** Run sync.sh with uncommitted changes in destination → exit code 1, error displayed
- [ ] **verify:** Temporarily rename daemon/src → exit code 1, "Source daemon/src not found" error
- [ ] **verify:** Remove npm from PATH → exit code 1, npm error displayed
- [ ] **verify:** Change GREAT_MINDS_ROOT to invalid path → exit code 1, "Wrong destination path" error
- [ ] **verify:** All validations abort BEFORE any file operations

#### Wave 2: File Copy Operations
- [ ] **verify:** After sync, 11 .ts files exist in `/home/agent/great-minds/daemon/src/`
- [ ] **verify:** `package.json` exists and contains better-sqlite3, chokidar, @anthropic-ai/claude-agent-sdk
- [ ] **verify:** `README.md` contains warning banner: "⚠️ **IMPORTANT:** This daemon code is synced from great-minds-plugin"
- [ ] **verify:** `BANNED-PATTERNS.md` exists at `/home/agent/great-minds/BANNED-PATTERNS.md`
- [ ] **verify:** `DO-NOT-REPEAT.md` exists at `/home/agent/great-minds/DO-NOT-REPEAT.md`
- [ ] **verify:** Compare source and destination file checksums (should be identical)

#### Wave 2: CLAUDE.md Updates
- [ ] **verify:** `/home/agent/great-minds/CLAUDE.md` contains "Daemon Sync Protocol" section
- [ ] **verify:** Section explains source of truth and how to run sync
- [ ] **verify:** CLAUDE.md contains "Anti-Hallucination Rules" section
- [ ] **verify:** Section references BANNED-PATTERNS.md
- [ ] **verify:** Markdown is valid (no broken syntax)
- [ ] **verify:** Script is idempotent (running twice doesn't duplicate sections)

#### Wave 3: npm Install
- [ ] **verify:** npm install completes without errors
- [ ] **verify:** `/home/agent/great-minds/daemon/node_modules/` directory exists
- [ ] **verify:** Dependencies installed: `ls node_modules/ | grep -E "(better-sqlite3|chokidar|claude-agent-sdk)"`
- [ ] **verify:** If npm install fails, script aborts with exit code 1

#### Wave 4: Git Operations
- [ ] **verify:** All git operations succeed
- [ ] **verify:** Commit message is "Sync daemon from plugin": `git log -1 --oneline`
- [ ] **verify:** Remote updated: `git log origin/main -1`
- [ ] **verify:** Final output displays "Done."
- [ ] **verify:** Exit code 0 after successful run: `echo $?`
- [ ] **verify:** Simulate failure → exit code 1

#### Wave 5: Documentation
- [ ] **verify:** `package.json` contains `"sync": "./sync.sh"` in scripts section
- [ ] **verify:** `npm run sync` executes sync.sh successfully
- [ ] **verify:** README contains "Daemon Sync" section with sunset warning
- [ ] **verify:** README documents path configuration (first-time setup)
- [ ] **verify:** README explains what sync does (usage documentation)

### End-to-End Verification

**Complete workflow test:**
1. Edit a daemon TypeScript file in plugin repo
2. Run `npm run sync`
3. Verify change appears in great-minds repo
4. Verify commit created and pushed
5. Verify operation completed in <5 seconds (excluding git push network time)

### Banned Patterns Enforcement

**Run these checks against the built script:**

```bash
# Check for hardcoded /Users/ paths in sync.sh (should only be in path variables)
grep -n '/Users/' sync.sh

# Check for console.log (structured output only)
grep -n 'console.log' sync.sh

# Check for unquoted variables (paths with spaces must be quoted)
grep -n '\$[A-Z_]*[^"]' sync.sh | grep -v '"$'
```

All checks must pass (no matches in code sections, only in variable declarations).

---

## Files That Will Be Created or Modified

### Created Files

1. `/Users/sethshoultes/Local Sites/great-minds-plugin/sync.sh`
   - Bash script with all sync logic
   - ~100 lines
   - Executable permissions (chmod +x)

2. `/Users/sethshoultes/Local Sites/great-minds-plugin/deliverables/sync-great-minds/spec.md` (this file)
   - Build specification

3. `/Users/sethshoultes/Local Sites/great-minds-plugin/deliverables/sync-great-minds/todo.md`
   - Running to-do list with checkboxes

4. `/Users/sethshoultes/Local Sites/great-minds-plugin/deliverables/sync-great-minds/tests/`
   - Directory containing test scripts

5. `/Users/sethshoultes/Local Sites/great-minds-plugin/deliverables/sync-great-minds/tests/01-banned-patterns.sh`
   - Test script to check for banned patterns

6. `/Users/sethshoultes/Local Sites/great-minds-plugin/deliverables/sync-great-minds/tests/02-file-existence.sh`
   - Test script to verify required files exist

7. `/Users/sethshoultes/Local Sites/great-minds-plugin/deliverables/sync-great-minds/tests/03-script-structure.sh`
   - Test script to verify sync.sh structure

### Modified Files

1. `/Users/sethshoultes/Local Sites/great-minds-plugin/package.json`
   - Add `"sync": "./sync.sh"` to scripts section
   - No other changes

2. `/Users/sethshoultes/Local Sites/great-minds-plugin/README.md`
   - Add new "## Daemon Sync" section
   - Include sunset warning
   - Document path configuration
   - Document usage

### Files Modified in Destination Repo (by sync.sh)

These files are modified by running the sync script, NOT during the build phase:

1. `/home/agent/great-minds/daemon/src/*.ts` (11 files overwritten)
2. `/home/agent/great-minds/daemon/package.json` (overwritten)
3. `/home/agent/great-minds/daemon/README.md` (overwritten with warning banner)
4. `/home/agent/great-minds/BANNED-PATTERNS.md` (overwritten)
5. `/home/agent/great-minds/DO-NOT-REPEAT.md` (overwritten)
6. `/home/agent/great-minds/CLAUDE.md` (appended with two new sections)

---

## Success Criteria Summary

### Functional Requirements
✅ Script copies 8 files/file groups from plugin to great-minds
✅ Script runs npm install in destination
✅ Script commits and pushes changes
✅ Pre-flight validations prevent data loss
✅ Script is idempotent (safe to run multiple times)

### Non-Functional Requirements
✅ Execution time: <5 seconds for local operations
✅ Exit code 0 on success, 1 on failure
✅ Clear error messages (start with ❌)
✅ No configuration required (hardcoded paths)
✅ Terminal output: "Syncing daemon code..." → "Done."

### Quality Requirements
✅ No banned patterns in built code
✅ Script uses proper quoting for paths with spaces
✅ Script is executable (chmod +x)
✅ Documentation includes sunset warning
✅ README explains first-time path configuration

### Risk Mitigation
✅ Validates destination is clean (no uncommitted changes)
✅ Validates source files exist before copying
✅ Validates npm is available
✅ Validates destination structure matches expectations
✅ Aborts immediately on any failure (set -e)

---

## Timeline Constraint

**This build MUST complete in ONE agent session.**

Total expected implementation time: <30 minutes
Script execution time: <5 seconds

Any implementation that takes longer has misunderstood the assignment.

---

## Temporary Nature (Sunset Plan)

**⚠️ This tool is TEMPORARY and scheduled for deprecation.**

**Target Timeline:**
- **3 months:** Extract daemon to shared npm package
- **6 months:** Delete sync.sh and remove from package.json

**Success Metric:** Tool is deleted, not improved.

**Deprecation Trigger:** When daemon becomes a standalone npm package that great-minds imports, sync becomes unnecessary.

**Documentation Requirement:** README MUST include sunset warning to prevent this from becoming permanent infrastructure.

---

## Notes

- This spec synthesizes PRD requirements, plan tasks, and debate decisions
- All verification criteria are testable with shell commands
- File list is exhaustive — no surprises during implementation
- Pre-flight validations protect against common failure modes
- Binary outcome philosophy enforced throughout

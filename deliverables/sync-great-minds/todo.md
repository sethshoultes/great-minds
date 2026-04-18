# Sync Great Minds — Implementation To-Do List

**Build ID:** sync-great-minds
**Generated:** 2026-04-16
**Status:** Ready to Execute

---

## Wave 1: Foundation & Validation

### Task 1.1: Create sync.sh Basic Structure
- [ ] Create sync.sh at `/Users/sethshoultes/Local Sites/great-minds-plugin/sync.sh` — verify: file exists
- [ ] Add shebang line `#!/bin/bash` as first line — verify: `head -1 sync.sh` shows shebang
- [ ] Add `set -e` directive on line 2 — verify: `grep -q "^set -e" sync.sh`
- [ ] Add header comment explaining script purpose — verify: comment mentions "TEMPORARY TOOL"
- [ ] Define PLUGIN_ROOT variable with proper quoting — verify: `grep 'PLUGIN_ROOT=' sync.sh`
- [ ] Define GREAT_MINDS_ROOT variable with proper quoting — verify: `grep 'GREAT_MINDS_ROOT=' sync.sh`
- [ ] Add initial echo "Syncing daemon code..." — verify: `grep -q 'echo.*Syncing' sync.sh`
- [ ] Make script executable with chmod +x — verify: `ls -l sync.sh | grep -q "^-rwxr"`

### Task 1.2: Implement Pre-Flight Validation - Destination Clean
- [ ] Add function to check destination git status — verify: function defined in script
- [ ] Add cd to GREAT_MINDS_ROOT — verify: `grep 'cd.*GREAT_MINDS_ROOT' sync.sh`
- [ ] Add git status -s check — verify: `grep 'git status -s' sync.sh`
- [ ] Add error message if uncommitted changes found — verify: error starts with ❌
- [ ] Add exit 1 if validation fails — verify: `grep 'exit 1' sync.sh`
- [ ] Test with uncommitted changes in destination — verify: script aborts with error

### Task 1.3: Implement Pre-Flight Validation - Source Files
- [ ] Add check for daemon/src directory exists — verify: `grep '\[\[ -d.*daemon/src' sync.sh`
- [ ] Add error message if source not found — verify: message says "Source daemon/src not found"
- [ ] Add exit 1 on failure — verify: script aborts with error message
- [ ] Test by temporarily renaming daemon/src — verify: script aborts

### Task 1.4: Implement Pre-Flight Validation - npm Available
- [ ] Add command -v npm check — verify: `grep 'command -v npm' sync.sh`
- [ ] Add error message if npm not found — verify: message says "npm not found in PATH"
- [ ] Add exit 1 on failure — verify: script aborts
- [ ] Test by removing npm from PATH — verify: script aborts

### Task 1.5: Implement Pre-Flight Validation - Destination Structure
- [ ] Add check for destination daemon/src exists — verify: checks GREAT_MINDS_ROOT/daemon/src
- [ ] Add error message if wrong path — verify: message says "Wrong destination path"
- [ ] Add exit 1 on failure — verify: script aborts
- [ ] Test with invalid GREAT_MINDS_ROOT — verify: script aborts

### Task 1.6: Implement File Count Sanity Check
- [ ] Add find command to count .ts files in source — verify: `grep 'find.*\.ts.*wc -l' sync.sh`
- [ ] Store count in SOURCE_COUNT variable — verify: variable assigned
- [ ] Add warning if count != 11 — verify: warning message displayed (non-fatal)
- [ ] Test with modified daemon/src — verify: warning shown but continues

---

## Wave 2: File Operations & Documentation

### Task 2.1: Copy Daemon TypeScript Files
- [ ] Add cp command for daemon/src/*.ts files — verify: uses wildcards correctly
- [ ] Ensure paths are properly quoted — verify: "$PLUGIN_ROOT" and "$GREAT_MINDS_ROOT" quoted
- [ ] Add verification step counting copied files — verify: confirms 11 files copied
- [ ] Test copy operation — verify: files appear in destination

### Task 2.2: Copy daemon/package.json
- [ ] Add cp command for package.json — verify: `grep 'cp.*package.json' sync.sh`
- [ ] Use full paths with proper quoting — verify: quotes around paths
- [ ] Test copy — verify: package.json in destination matches source

### Task 2.3: Copy daemon/README.md with Warning Banner
- [ ] Create README.md in destination with warning banner using cat heredoc — verify: banner text present
- [ ] Banner says "⚠️ **IMPORTANT:** This daemon code is synced from great-minds-plugin" — verify: exact text
- [ ] Banner says "Do NOT edit files here directly" — verify: warning clear
- [ ] Append original README.md content — verify: original content preserved
- [ ] Test copy — verify: destination README has banner + original content

### Task 2.4: Copy BANNED-PATTERNS.md
- [ ] Add cp command for BANNED-PATTERNS.md to repo root — verify: destination path is root
- [ ] Test copy — verify: file exists at `/home/agent/great-minds/BANNED-PATTERNS.md`

### Task 2.5: Copy DO-NOT-REPEAT.md
- [ ] Add cp command for DO-NOT-REPEAT.md to repo root — verify: destination path is root
- [ ] Test copy — verify: file exists at `/home/agent/great-minds/DO-NOT-REPEAT.md`

### Task 2.6: Update CLAUDE.md - Add Daemon Sync Protocol Section
- [ ] Add grep check to see if section already exists — verify: idempotent behavior
- [ ] Add cat heredoc to append "Daemon Sync Protocol" section — verify: section header present
- [ ] Section explains source of truth — verify: mentions great-minds-plugin
- [ ] Section documents sync command — verify: mentions `npm run sync`
- [ ] Section warns not to edit daemon directly — verify: warning included
- [ ] Test append — verify: section appears in CLAUDE.md
- [ ] Test idempotence — verify: running twice doesn't duplicate section

### Task 2.7: Update CLAUDE.md - Add Anti-Hallucination Rules Section
- [ ] Add grep check to see if section already exists — verify: idempotent behavior
- [ ] Add cat heredoc to append "Anti-Hallucination Rules" section — verify: section header present
- [ ] Section references BANNED-PATTERNS.md — verify: mention present
- [ ] Section lists key banned patterns — verify: no hardcoded paths, no console.log, etc.
- [ ] Section mentions QA enforcement — verify: explains grep checks
- [ ] Test append — verify: section appears in CLAUDE.md
- [ ] Test idempotence — verify: running twice doesn't duplicate section

---

## Wave 3: Dependency Installation

### Task 3.1: Run npm install in Destination
- [ ] Add cd to destination daemon directory — verify: `cd "$GREAT_MINDS_ROOT/daemon"`
- [ ] Add npm install command — verify: `grep 'npm install' sync.sh`
- [ ] Ensure command will abort on failure (set -e) — verify: no error suppression
- [ ] Test successful npm install — verify: node_modules/ created
- [ ] Test with broken package.json — verify: script aborts with exit 1
- [ ] Verify dependencies installed — verify: `ls node_modules/ | grep better-sqlite3`

---

## Wave 4: Git Operations

### Task 4.1: Stage All Changes
- [ ] Add cd to GREAT_MINDS_ROOT — verify: changes to destination repo
- [ ] Add git add . command — verify: `grep 'git add' sync.sh`
- [ ] Test staging — verify: `git status` shows "Changes to be committed"

### Task 4.2: Commit with Static Message
- [ ] Add git commit with message "Sync daemon from plugin" — verify: exact message text
- [ ] Ensure commit succeeds — verify: exit code 0
- [ ] Test commit — verify: `git log -1 --oneline` shows message

### Task 4.3: Push to Remote
- [ ] Add git push command — verify: `grep 'git push' sync.sh`
- [ ] Allow push to fail without aborting (commit remains local) — verify: error acceptable
- [ ] Test successful push — verify: `git log origin/main -1` matches local
- [ ] Test network failure case — verify: commit exists locally even if push fails

### Task 4.4: Display Success Message
- [ ] Add echo "Done." at end of script — verify: `grep 'echo.*Done' sync.sh`
- [ ] Test successful run — verify: "Done." displayed as final output
- [ ] Verify exit code 0 — verify: `echo $?` returns 0

---

## Wave 5: Documentation

### Task 5.1: Add npm Script to package.json
- [ ] Read current package.json — verify: understand existing scripts section
- [ ] Add "sync": "./sync.sh" to scripts — verify: JSON syntax valid
- [ ] Test npm run sync — verify: executes sync.sh successfully
- [ ] Verify script runs from plugin repo root — verify: correct working directory

### Task 5.2: Update README - Add Daemon Sync Section
- [ ] Read README.md to find insertion point — verify: locate after daemon documentation
- [ ] Add "## Daemon Sync" section header — verify: markdown heading level 2
- [ ] Add sunset warning banner — verify: "⚠️ TEMPORARY TOOL — Scheduled for deprecation"
- [ ] Warning mentions 3-month timeline — verify: timeline documented
- [ ] Warning mentions 6-month failure criterion — verify: accountability included

### Task 5.3: Update README - Document Path Configuration
- [ ] Add "### First Time Setup" subsection — verify: markdown heading level 3
- [ ] Explain hardcoded paths must be edited — verify: clear instructions
- [ ] List exact lines to edit (4-5 in sync.sh) — verify: line numbers accurate
- [ ] Provide example paths for macOS — verify: `/Users/` example
- [ ] Provide example paths for Linux — verify: `/home/` example
- [ ] Provide example paths for Docker — verify: `/app/` example

### Task 5.4: Update README - Document Usage
- [ ] Add "### Usage" subsection — verify: markdown heading level 3
- [ ] Explain when to run sync (after editing daemon code) — verify: trigger clear
- [ ] Show command: `npm run sync` — verify: code block formatted
- [ ] List what script does (6 steps) — verify: all steps documented
- [ ] Explain binary outcome behavior — verify: success or failure, no partial states
- [ ] Mention <5 second execution time — verify: performance expectation set

---

## Testing & Verification

### Test 1: Banned Patterns Check
- [ ] Run grep for hardcoded /Users/ paths in sync.sh — verify: only in variable declarations
- [ ] Run grep for console.log in sync.sh — verify: no matches (use echo only)
- [ ] Run grep for unquoted variables — verify: all path variables quoted
- [ ] Run test script 01-banned-patterns.sh — verify: exit 0

### Test 2: File Existence Check
- [ ] Verify sync.sh exists and is executable — verify: ls -l shows -rwxr-xr-x
- [ ] Verify deliverables/sync-great-minds/spec.md exists — verify: file readable
- [ ] Verify deliverables/sync-great-minds/todo.md exists — verify: file readable
- [ ] Verify deliverables/sync-great-minds/tests/ directory exists — verify: directory accessible
- [ ] Run test script 02-file-existence.sh — verify: exit 0

### Test 3: Script Structure Check
- [ ] Verify first line is #!/bin/bash — verify: `head -1 sync.sh`
- [ ] Verify set -e present — verify: fail-fast enabled
- [ ] Verify PLUGIN_ROOT defined — verify: variable present
- [ ] Verify GREAT_MINDS_ROOT defined — verify: variable present
- [ ] Verify all 5 validation checks present — verify: count checks
- [ ] Run test script 03-script-structure.sh — verify: exit 0

### Test 4: End-to-End Integration Test
- [ ] Start with clean great-minds repo — verify: `git status` clean
- [ ] Edit a daemon .ts file in plugin repo — verify: change made
- [ ] Run `npm run sync` — verify: completes without errors
- [ ] Verify change appears in great-minds daemon/src/ — verify: file diff matches
- [ ] Verify commit created — verify: `git log -1` shows "Sync daemon from plugin"
- [ ] Verify push succeeded — verify: remote updated
- [ ] Verify execution time <5 seconds — verify: time command output

### Test 5: Failure Mode Testing
- [ ] Test with uncommitted changes in destination — verify: script aborts, exit 1
- [ ] Test with missing source files — verify: script aborts with error
- [ ] Test with npm not in PATH — verify: script aborts with error
- [ ] Test with invalid destination path — verify: script aborts with error
- [ ] Verify all error messages start with ❌ — verify: consistent error formatting

---

## Completion Checklist

### Required Deliverables
- [ ] sync.sh created and executable
- [ ] package.json updated with sync script
- [ ] README.md updated with Daemon Sync section
- [ ] spec.md created in deliverables/
- [ ] todo.md created in deliverables/ (this file)
- [ ] tests/ directory created with 3 test scripts
- [ ] All test scripts executable (chmod +x)
- [ ] All test scripts exit 0 when passing

### Verification Requirements
- [ ] Script completes in <5 seconds
- [ ] Exit code 0 on success, 1 on failure
- [ ] Pre-flight validations work correctly
- [ ] File copy operations succeed
- [ ] CLAUDE.md updates are idempotent
- [ ] npm install succeeds
- [ ] Git operations succeed
- [ ] Documentation is complete and accurate
- [ ] No banned patterns in code
- [ ] Sunset warning present in README

### Quality Gates
- [ ] All pre-flight validations tested and working
- [ ] All error messages start with ❌
- [ ] All paths properly quoted (handle spaces)
- [ ] Script is idempotent (safe to run multiple times)
- [ ] Binary outcome enforced (no partial success)
- [ ] End-to-end test passes
- [ ] All test scripts pass

---

## Notes

- Each task should take <5 minutes to complete
- Each task has a clear verification step
- Tasks are ordered by dependency (later waves depend on earlier waves)
- Checkboxes allow tracking progress during implementation
- Total implementation time: <30 minutes
- Script execution time: <5 seconds

**Philosophy:** Ship surgical simplicity today. Delete it tomorrow.

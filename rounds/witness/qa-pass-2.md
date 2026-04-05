# QA Pass 2 — Witness (Narrate CLI)

**QA Engineer:** Margaret Hamilton
**Date:** 2026-04-05
**Scope:** Integration — do all pieces work together? Cross-file references? Consistency?

---

## Overall Verdict: **PASS**

All P0 issues from QA Pass 1 have been fixed. The codebase demonstrates proper integration across modules, consistent cross-file references, and correct data flow.

---

## P0 Issue Fixes Verified (from QA Pass 1)

| # | Previous Issue | Status | Evidence |
|---|---------------|--------|----------|
| 1 | Package name mismatch | **FIXED** | `package.json` line 2: `"name": "narrate-cli"` ✓ |
| 2 | CLI binary name mismatch | **FIXED** | `package.json` line 7: `"narrate": "./bin/witness.js"` ✓ |
| 3 | Config file name | **VERIFIED** | `config.js` line 23: `'.narraterc.json'` ✓ |
| 4 | Init output text | **FIXED** | `init.js` lines 101-104: "Narrate is watching." with exactly 4 lines ✓ |
| 5 | Attribution footer | **FIXED** | `changelog.js` line 12: `'*Narrated by Narrate — your code, in plain English*'` ✓ |

---

## Integration Test Matrix

### 1. Module Import Chain Verification

| Source File | Import | Target File | Status |
|-------------|--------|-------------|--------|
| `bin/witness.js` | `import('../src/commands/init.js')` | `src/commands/init.js` | **PASS** |
| `bin/witness.js` | `import('../src/commands/log.js')` | `src/commands/log.js` | **PASS** |
| `bin/witness.js` | `import('../src/commands/backfill.js')` | `src/commands/backfill.js` | **PASS** |
| `src/commands/init.js` | `import { getRepoRoot }` | `src/lib/git.js` | **PASS** |
| `src/commands/log.js` | `import { getRepoRoot }` | `src/lib/git.js` | **PASS** |
| `src/commands/log.js` | `import { readEntries }` | `src/lib/changelog.js` | **PASS** |
| `src/commands/backfill.js` | Multiple imports | `git.js`, `config.js`, `summarize.js`, `fallback.js`, `changelog.js` | **PASS** |
| `src/lib/hook-worker.js` | All lib modules | `git.js`, `config.js`, `summarize.js`, `fallback.js`, `changelog.js` | **PASS** |

### 2. Cross-File Data Flow Verification

#### A. Post-Commit Hook Chain (Critical Path)
```
init.js → writes hook → hook invokes node hook-worker.js
hook-worker.js → git.js (getLastDiff, getCommitMessage, getCommitHash)
             → config.js (loadConfig, getApiKey)
             → summarize.js OR fallback.js
             → changelog.js (appendEntry)
```

| Step | Integration Point | Status | Evidence |
|------|------------------|--------|----------|
| 1 | Hook script embeds correct worker path | **PASS** | `init.js` line 13: `path.resolve(__dirname, '..', 'lib', 'hook-worker.js')` |
| 2 | Worker receives repo root | **PASS** | `hook-worker.js` line 22: `process.argv[2] || getRepoRoot()` |
| 3 | Worker calls git functions | **PASS** | Lines 25-27: `getLastDiff`, `getCommitMessage`, `getCommitHash` |
| 4 | Worker applies ignore filters | **PASS** | Line 30: `filterDiff(diff, config.ignore)` |
| 5 | Worker uses correct API key source | **PASS** | Line 38: `getApiKey()` → `process.env.ANTHROPIC_API_KEY` |
| 6 | Worker falls back gracefully | **PASS** | Lines 47-60: catches errors, uses `generateFallback` |
| 7 | Worker appends to changelog | **PASS** | Lines 62-70: `appendEntry` with correct params |

#### B. Backfill Command Integration
```
backfill.js → listCommitsSince (git.js)
          → readEntries (changelog.js) for deduplication
          → getDiffForCommit + getCommitMessageForHash (git.js)
          → filterDiff (git.js)
          → summarize OR generateFallback
          → appendEntry (changelog.js)
```

| Step | Integration Point | Status | Evidence |
|------|------------------|--------|----------|
| 1 | Lists commits with correct format | **PASS** | `git.js` lines 117-132: returns `{hash, shortHash, message, date}` |
| 2 | Deduplication uses hash comparison | **PASS** | `backfill.js` lines 117-121: filters by existing hashes |
| 3 | Per-commit diff retrieval | **PASS** | `backfill.js` line 157: `getDiffForCommit(repoRoot, commit.hash)` |
| 4 | Same summarize/fallback flow | **PASS** | Lines 162-182: identical logic to hook-worker |
| 5 | Correct date passed to appendEntry | **PASS** | Line 187: `date: commit.date` |

#### C. Log Command Integration
```
log.js → getRepoRoot (git.js)
      → readEntries (changelog.js)
      → parseSince (internal)
      → formatOutput (internal)
```

| Step | Integration Point | Status | Evidence |
|------|------------------|--------|----------|
| 1 | Reads entries from correct file | **PASS** | `log.js` line 86: `readEntries(repoRoot)` → `CHANGELOG.human.md` |
| 2 | Entry objects have required fields | **PASS** | `changelog.js` lines 148-156: `{dateStr, date, summary, hash}` |
| 3 | Date filtering works with Date objects | **PASS** | `log.js` line 99: `e.date >= threshold` |

### 3. Shared Constants Consistency

| Constant | Location | Value | Consumers | Status |
|----------|----------|-------|-----------|--------|
| `CHANGELOG_FILE` | `changelog.js:7` | `'CHANGELOG.human.md'` | `appendEntry`, `readEntries`, `backfill.js` | **PASS** |
| `MAX_DIFF_LINES` | `summarize.js:20` | `500` | `truncateDiff`, exported | **PASS** |
| `DEFAULT_CONFIG.model` | `config.js:9` | `'claude-haiku-4-5-20251001'` | All API calls | **PASS** |
| `ATTRIBUTION` | `changelog.js:12` | Correct text | `appendEntry` | **PASS** |

### 4. Function Signature Consistency

| Function | Expected Params | Actual Params | Status |
|----------|-----------------|---------------|--------|
| `summarize` | `{diff, commitMessage, config}` | Called with same in `hook-worker.js:42-46`, `backfill.js:166-169` | **PASS** |
| `generateFallback` | `{diff, commitMessage}` | Called with same in `hook-worker.js:49-52`, `backfill.js:172-175` | **PASS** |
| `appendEntry` | `(repoRoot, entry, config)` | Called with same in `hook-worker.js:62-70`, `backfill.js:184-192` | **PASS** |
| `formatDate` | `(date: Date)` | Returns `"Apr 5, 2026 — 7:36 AM"` format | **PASS** |
| `formatEntry` | `{date, summary, hash}` | Returns formatted string | **PASS** |

### 5. Error Handling Integration

| Scenario | Handler | Recovery | Status |
|----------|---------|----------|--------|
| Not a git repo | `init.js:44-48`, `log.js:81-84`, `backfill.js:95-98` | Error message + exit(1) | **PASS** |
| No API key | `hook-worker.js:54-60` | Uses `generateFallback` | **PASS** |
| API call fails | `hook-worker.js:47-53`, `backfill.js:170-176` | Uses `generateFallback` | **PASS** |
| Malformed config | `config.js:29-35` | Warning + uses defaults | **PASS** |
| Hook worker crashes | `hook-worker.js:73-87` | Writes to `.witness-error.log`, exit(0) | **PASS** |
| Initial commit (no HEAD~1) | `git.js:27-34`, `git.js:50-57` | Diffs against empty tree | **PASS** |

### 6. Entry Format Consistency

All components that create/read entries use consistent format:

**Write Path (hook-worker + backfill → appendEntry → formatEntry):**
```
Apr 5, 2026 — 7:36 AM

  Summary sentence here  ·  abc1234
```

**Read Path (log.js → readEntries → parseEntries):**
- Date regex: `/^([A-Z][a-z]{2} \d{1,2}, \d{4} — \d{1,2}:\d{2} [AP]M)$/gm` | **PASS**
- Entry regex: `/^\s*(.+?)\s+·\s+([a-f0-9]{7,})/s` | **PASS**

The write format and read regex are **compatible** — verified by inspection.

### 7. Config Field Usage Consistency

| Field | Source | Consumers | Correct Usage |
|-------|--------|-----------|---------------|
| `model` | `.narraterc.json` or default | `summarize.js:71` via `config.model` | **PASS** |
| `ignore` | `.narraterc.json` or `[]` | `git.js:filterDiff` via `config.ignore` | **PASS** |
| `attribution` | `.narraterc.json` or `true` | `changelog.js:appendEntry` via `config.attribution` | **PASS** |

### 8. CLI Argument Parsing Consistency

| Command | Flag | Parser | Handler | Status |
|---------|------|--------|---------|--------|
| `log` | `--since=<date>` | `bin/witness.js:46-48` | `log.js:parseSince` | **PASS** |
| `backfill` | `--last=<period>` | `bin/witness.js:46-48` | `backfill.js:parseLastFlag` | **PASS** |

Both use the same arg parser pattern with consistent flag extraction.

---

## Minor Observations (Non-Blocking)

### P2 — Should Fix (Low Priority)

| # | Issue | Evidence | Impact |
|---|-------|----------|--------|
| 1 | Internal file still named `witness.js` | `bin/witness.js` | None — internal detail, binary is correctly `narrate` |
| 2 | Hook markers say "witness" | `init.js` lines 18-19: `# --- witness start ---` | None — internal comment in hook file |
| 3 | Error log filename | `hook-worker.js` line 77: `.witness-error.log` | Minor — could be `.narrate-error.log` for consistency |

These are cosmetic issues that do not affect functionality or user experience. The user-facing CLI command is `narrate`, the package name is `narrate-cli`, and all user-visible output says "Narrate".

---

## Regression Check

Verified that QA Pass 1 fixes did not introduce new issues:

| Check | Status |
|-------|--------|
| Package still exports ESM (`"type": "module"`) | **PASS** |
| Anthropic SDK dependency intact | **PASS** |
| All commands still route correctly | **PASS** |
| Hook still spawns detached | **PASS** |
| Fallback still produces sentences | **PASS** |

---

## Summary

**Integration Status:** All modules properly integrated.

| Category | Items Verified | Status |
|----------|---------------|--------|
| Module imports | 12 | All resolve correctly |
| Data flow chains | 3 critical paths | All functional |
| Shared constants | 4 | All consistent |
| Function signatures | 5 | All match across call sites |
| Error handling | 6 scenarios | All handled gracefully |
| Format compatibility | Write/Read | Compatible |
| Config usage | 3 fields | All used correctly |

**Verdict:** The codebase is properly integrated. All modules reference each other correctly, data flows through the system consistently, and error handling is comprehensive.

---

*QA Pass 2 complete. Ready for ship.*

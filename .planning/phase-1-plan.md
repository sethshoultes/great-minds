# Phase 1 Plan — Narrate CLI (v1)

**Generated:** 2026-04-05
**Requirements:** `.planning/REQUIREMENTS.md`, `prds/witness.md`, `rounds/witness/decisions.md`
**Total Tasks:** 10
**Waves:** 4

---

## Requirements Traceability

| Requirement(s) | Task | Wave |
|----------------|------|------|
| PS-1, PS-2, PS-3, PS-6 | phase-1-task-1 (Project scaffold) | 1 |
| CFG-1..6 | phase-1-task-2 (Config loader) | 1 |
| AI-1..10 | phase-1-task-3 (System prompt + AI caller) | 1 |
| FMT-1..7 | phase-1-task-4 (Changelog formatter) | 1 |
| OFF-1..5 | phase-1-task-5 (Offline fallback) | 1 |
| CH-1..7, QA-2 | phase-1-task-6 (Post-commit hook engine) | 2 |
| CMD-1..4 | phase-1-task-7 (`narrate init`) | 2 |
| CMD-5, CMD-6 | phase-1-task-8 (`narrate log`) | 2 |
| CMD-7, CMD-8 | phase-1-task-9 (`narrate backfill`) | 3 |
| QA-1..6 | phase-1-task-10 (Integration test + dogfood) | 4 |

---

## Wave Execution Order

### Wave 1 (Parallel — no dependencies)

<task-plan id="phase-1-task-1" wave="1">
  <title>Project scaffold and package.json</title>
  <requirement>PS-1, PS-2, PS-3, PS-5, PS-6</requirement>
  <description>
    Create the narrate-cli project structure with package.json (ESM, bin field),
    directory layout, and install the single runtime dependency (@anthropic-ai/sdk).
    This is the foundation every other task builds on.
  </description>

  <context>
    <file path="rounds/witness/decisions.md" reason="Architecture decisions: ESM, no build step, native child_process" />
    <file path="prds/witness.md" reason="Tech stack requirements" />
  </context>

  <steps>
    <step order="1">Create directory: deliverables/narrate-cli/</step>
    <step order="2">Create package.json with: name "narrate-cli", type "module", bin {"narrate": "./bin/narrate.js"}, engines {"node": ">=18.0.0"}, version "0.1.0"</step>
    <step order="3">Create bin/narrate.js — CLI entry point with shebang (#!/usr/bin/env node), imports commander or minimal arg parser, routes to commands</step>
    <step order="4">Create directory structure: bin/, src/, src/commands/, src/lib/</step>
    <step order="5">Run npm install @anthropic-ai/sdk in the project directory</step>
    <step order="6">Create .gitignore (node_modules/)</step>
    <step order="7">Verify: node bin/narrate.js --help prints usage without errors</step>
  </steps>

  <verification>
    <check type="manual">node bin/narrate.js --help runs without error</check>
    <check type="manual">package.json has "type": "module" and correct bin field</check>
    <check type="manual">Only @anthropic-ai/sdk in dependencies (minimal deps)</check>
  </verification>

  <dependencies />

  <commit-message>feat: scaffold narrate-cli project with ESM package.json and CLI entry point</commit-message>
</task-plan>

<task-plan id="phase-1-task-2" wave="1">
  <title>Configuration loader (.narraterc.json)</title>
  <requirement>CFG-1, CFG-2, CFG-3, CFG-4, CFG-5, CFG-6</requirement>
  <description>
    Build the config module that reads .narraterc.json from repo root,
    merges with defaults, and exposes a clean config object. Handles
    missing file gracefully (uses defaults). API key comes from env var only.
  </description>

  <context>
    <file path="rounds/witness/decisions.md" reason="Config spec: 3 fields (model, ignore, attribution), defaults, env var for API key" />
  </context>

  <steps>
    <step order="1">Create src/lib/config.js</step>
    <step order="2">Define defaults: { model: "claude-haiku-4-5-20251001", ignore: [], attribution: true }</step>
    <step order="3">Export async function loadConfig(repoRoot) that: reads .narraterc.json if exists, merges with defaults, returns config object</step>
    <step order="4">Export function getApiKey() that reads ANTHROPIC_API_KEY from process.env, returns null if missing</step>
    <step order="5">Do NOT support tone, changelog path, or maxDiffLines in config (hardcoded/cut per decisions)</step>
    <step order="6">Handle malformed JSON gracefully — warn and use defaults</step>
  </steps>

  <verification>
    <check type="manual">Import config.js and call loadConfig() with no .narraterc.json — returns defaults</check>
    <check type="manual">Create a .narraterc.json with custom model — loadConfig() returns merged config</check>
    <check type="manual">getApiKey() returns env var value or null</check>
  </verification>

  <dependencies />

  <commit-message>feat: add config loader for .narraterc.json with 3-field schema</commit-message>
</task-plan>

<task-plan id="phase-1-task-3" wave="1">
  <title>System prompt and AI summarizer</title>
  <requirement>AI-1, AI-2, AI-3, AI-4, AI-5, AI-6, AI-7, AI-8, AI-9, AI-10, CH-6, CH-7</requirement>
  <description>
    Build the AI module that sends a diff + commit message to Claude API
    and returns a plain-English summary. Uses the exact v1 system prompt
    from decisions.md. Enforces 500-line diff limit (hardcoded).
  </description>

  <context>
    <file path="rounds/witness/decisions.md" reason="Exact system prompt text, model name, max diff lines" />
  </context>

  <steps>
    <step order="1">Create src/lib/summarize.js</step>
    <step order="2">Define SYSTEM_PROMPT constant — exact text from decisions.md v1 system prompt</step>
    <step order="3">Define MAX_DIFF_LINES = 500 (hardcoded constant)</step>
    <step order="4">Export function truncateDiff(diff, maxLines) — splits by newline, truncates, appends "[DIFF TRUNCATED]" marker</step>
    <step order="5">Export async function summarize({ diff, commitMessage, config }) that: creates Anthropic client, truncates diff if needed, sends system prompt + user message (diff + commit msg), returns response text</step>
    <step order="6">Add timeout of 30 seconds on API call to prevent hangs</step>
    <step order="7">If API call fails, throw descriptive error (caller decides fallback behavior)</step>
  </steps>

  <verification>
    <check type="manual">truncateDiff with 600-line diff returns 500 lines + truncation marker</check>
    <check type="manual">With valid API key, summarize() returns a sentence starting with a verb</check>
    <check type="manual">System prompt matches decisions.md exactly</check>
  </verification>

  <dependencies />

  <commit-message>feat: add AI summarizer with v1 system prompt and 500-line diff limit</commit-message>
</task-plan>

<task-plan id="phase-1-task-4" wave="1">
  <title>Changelog formatter and writer</title>
  <requirement>FMT-1, FMT-2, FMT-3, FMT-4, FMT-5, FMT-6, FMT-7</requirement>
  <description>
    Build the changelog module that formats entries in the locked format
    (natural date, indented sentence, hash with dot separator) and appends
    them to CHANGELOG.human.md. Handles file creation, attribution footer.
  </description>

  <context>
    <file path="rounds/witness/decisions.md" reason="Changelog format spec: date format, entry structure, spacing, attribution" />
  </context>

  <steps>
    <step order="1">Create src/lib/changelog.js</step>
    <step order="2">Define CHANGELOG_FILE = "CHANGELOG.human.md" (hardcoded)</step>
    <step order="3">Export function formatDate(date) — returns "Apr 5, 2026 — 7:36 AM" format using Intl.DateTimeFormat or manual formatting</step>
    <step order="4">Export function formatEntry({ date, summary, hash }) — returns formatted string with: date line, blank line, 2-space indented summary + " · " + short hash, trailing blank line</step>
    <step order="5">Export async function appendEntry(repoRoot, entry, config) — reads existing file (or creates), prepends new entry at top (newest first), writes back. If config.attribution is true, ensures attribution footer exists at end of file.</step>
    <step order="6">Attribution footer text: "*Narrated by Narrate — your code, in plain English*"</step>
    <step order="7">Ensure output has no raw markdown symbols (no ##, no **) — plain text optimized for terminal</step>
  </steps>

  <verification>
    <check type="manual">formatDate(new Date("2026-04-05T07:36:00")) returns "Apr 5, 2026 — 7:36 AM"</check>
    <check type="manual">formatEntry produces exact format from decisions.md example</check>
    <check type="manual">appendEntry creates CHANGELOG.human.md if missing, appends correctly if exists</check>
    <check type="manual">Attribution footer appears once at end of file when enabled</check>
  </verification>

  <dependencies />

  <commit-message>feat: add changelog formatter with natural dates and locked entry format</commit-message>
</task-plan>

<task-plan id="phase-1-task-5" wave="1">
  <title>Offline fallback summarizer</title>
  <requirement>OFF-1, OFF-2, OFF-3, OFF-4, OFF-5</requirement>
  <description>
    Build the rule-based fallback that generates a grammatical sentence
    from diff headers and commit message when the API is unavailable.
    Must NOT produce file lists — must produce real sentences.
  </description>

  <context>
    <file path="rounds/witness/decisions.md" reason="Offline fallback spec: sentence-based, not file list, examples" />
  </context>

  <steps>
    <step order="1">Create src/lib/fallback.js</step>
    <step order="2">Export function extractChangedFiles(diff) — parse diff headers to get file paths</step>
    <step order="3">Export function categorizeChanges(files) — group by type: added, modified, deleted, renamed</step>
    <step order="4">Export function generateFallback({ diff, commitMessage }) — produces a grammatical sentence:
      - If commit message is meaningful (not "fix", "wip", "stuff"): use it as base, append file context
      - If commit message is unhelpful: construct from diff headers using verb + file description
      - Example good output: "Updated authentication logic in auth.js and config.ts"
      - Must start with a verb (matching AI prompt rules)</step>
    <step order="5">Never produce output like "Modified 3 files: ..." — always a natural sentence</step>
    <step order="6">Handle edge cases: empty diff (initial commit), single file, many files (summarize top 2-3)</step>
  </steps>

  <verification>
    <check type="manual">generateFallback with meaningful commit msg produces sentence incorporating the message</check>
    <check type="manual">generateFallback with "wip" commit msg produces sentence from diff headers only</check>
    <check type="manual">Output never matches the "bad" pattern: "Modified N files: ..."</check>
    <check type="manual">Output always starts with a verb</check>
  </verification>

  <dependencies />

  <commit-message>feat: add rule-based offline fallback with sentence generation</commit-message>
</task-plan>

---

### Wave 2 (Parallel — depends on Wave 1)

<task-plan id="phase-1-task-6" wave="2">
  <title>Post-commit hook engine</title>
  <requirement>CH-1, CH-2, CH-3, CH-4, CH-5, QA-2</requirement>
  <description>
    Build the core hook engine: the script that runs on post-commit,
    spawns a detached child process (fire-and-forget), reads the diff
    and commit message, calls the summarizer (AI or fallback), and
    appends to the changelog. The hook script itself must return in < 50ms.
  </description>

  <context>
    <file path="rounds/witness/decisions.md" reason="Hook spec: detached child, fire-and-forget, < 50ms return" />
    <file path="deliverables/narrate-cli/src/lib/summarize.js" reason="AI summarizer to call" />
    <file path="deliverables/narrate-cli/src/lib/fallback.js" reason="Offline fallback to use when API unavailable" />
    <file path="deliverables/narrate-cli/src/lib/changelog.js" reason="Changelog writer to append entry" />
    <file path="deliverables/narrate-cli/src/lib/config.js" reason="Config + API key loader" />
  </context>

  <steps>
    <step order="1">Create src/lib/git.js — exports: getLastDiff(repoRoot), getCommitMessage(repoRoot), getCommitHash(repoRoot), getRepoRoot(). All use child_process.execSync with native git commands.</step>
    <step order="2">Create src/lib/hook-worker.js — the detached worker script that: loads config, reads diff/message/hash via git.js, calls summarize() (or fallback on error), calls appendEntry(), exits cleanly</step>
    <step order="3">Create src/lib/hook-runner.js — exports function runHook(repoRoot) that: spawns hook-worker.js as detached child (child_process.spawn with detached: true, stdio: 'ignore'), calls unref(), returns immediately (< 50ms)</step>
    <step order="4">In hook-worker.js: wrap everything in try/catch. On API failure, use generateFallback(). On any failure, log error to .narrate-error.log and exit silently (never crash git).</step>
    <step order="5">Apply ignore patterns from config: filter diff to exclude files matching config.ignore globs before sending to AI</step>
  </steps>

  <verification>
    <check type="manual">runHook() returns in < 50ms (measure with console.time)</check>
    <check type="manual">After runHook(), CHANGELOG.human.md is updated within ~5 seconds (async)</check>
    <check type="manual">With no API key, fallback entry appears in changelog</check>
    <check type="manual">With API key, AI-generated entry appears</check>
    <check type="manual">Ignored files (e.g., package-lock.json) are excluded from diff sent to AI</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Needs project structure and dependencies installed" />
    <depends-on task-id="phase-1-task-2" reason="Needs config loader" />
    <depends-on task-id="phase-1-task-3" reason="Needs AI summarizer" />
    <depends-on task-id="phase-1-task-4" reason="Needs changelog writer" />
    <depends-on task-id="phase-1-task-5" reason="Needs offline fallback" />
  </dependencies>

  <commit-message>feat: add post-commit hook engine with detached worker and < 50ms return</commit-message>
</task-plan>

<task-plan id="phase-1-task-7" wave="2">
  <title>narrate init command</title>
  <requirement>CMD-1, CMD-2, CMD-3, CMD-4, QA-1</requirement>
  <description>
    Implement the `narrate init` command that installs the post-commit hook,
    detects existing hooks (appends rather than overwrites), and outputs
    the exact 4-line init message from decisions.md. Must complete in < 2 seconds.
  </description>

  <context>
    <file path="rounds/witness/decisions.md" reason="Init experience: exact output text, hook conflict detection behavior" />
    <file path="deliverables/narrate-cli/bin/narrate.js" reason="CLI entry point to register init command" />
    <file path="deliverables/narrate-cli/src/lib/hook-runner.js" reason="The hook invocation code that init will install" />
  </context>

  <steps>
    <step order="1">Create src/commands/init.js</step>
    <step order="2">Detect .git directory — error if not a git repo</step>
    <step order="3">Check if .git/hooks/post-commit exists:
      - If no: create it with narrate hook code
      - If yes: read it, check if narrate already installed (idempotent), if not append narrate section with clear markers (# --- narrate start --- / # --- narrate end ---)</step>
    <step order="4">Hook script content: shebang, call to node with path to hook-runner.js, passing repo root</step>
    <step order="5">Make hook file executable (chmod +x)</step>
    <step order="6">Print exact output:
      "  Narrate is watching."
      ""
      "  Hook installed in .git/hooks/post-commit"
      "  Changelog will appear in CHANGELOG.human.md"
      ""
      "  Make your next commit to see it work."</step>
    <step order="7">Wire into CLI entry point (bin/narrate.js) as the "init" subcommand</step>
  </steps>

  <verification>
    <check type="manual">Run `node bin/narrate.js init` in a git repo — prints exact 4-line output</check>
    <check type="manual">.git/hooks/post-commit exists and is executable</check>
    <check type="manual">Run init again — idempotent, doesn't duplicate hook code</check>
    <check type="manual">In a repo with existing post-commit hook — narrate appends, doesn't clobber</check>
    <check type="manual">Completes in < 2 seconds</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Needs CLI entry point" />
    <depends-on task-id="phase-1-task-6" reason="Needs hook-runner.js to reference in the installed hook" />
  </dependencies>

  <commit-message>feat: add narrate init command with hook conflict detection</commit-message>
</task-plan>

<task-plan id="phase-1-task-8" wave="2">
  <title>narrate log command</title>
  <requirement>CMD-5, CMD-6, FMT-5</requirement>
  <description>
    Implement `narrate log` that pretty-prints CHANGELOG.human.md in the
    terminal with optional --since date filtering. No raw markdown — 
    designed for terminal readability.
  </description>

  <context>
    <file path="rounds/witness/decisions.md" reason="Log command spec, --since flag, terminal rendering" />
    <file path="deliverables/narrate-cli/bin/narrate.js" reason="CLI entry point to register log command" />
    <file path="deliverables/narrate-cli/src/lib/changelog.js" reason="Changelog file path constant and format knowledge" />
  </context>

  <steps>
    <step order="1">Create src/commands/log.js</step>
    <step order="2">Read CHANGELOG.human.md from repo root</step>
    <step order="3">Parse entries — split by date headers, extract date + summary + hash from each entry</step>
    <step order="4">If --since flag provided: parse the date value (support "yesterday", "last week", ISO dates, relative like "3d"), filter entries to only those after the date</step>
    <step order="5">Pretty-print to terminal: use ANSI colors if terminal supports them (dim for dates, normal for summaries, dim for hashes). No raw markdown symbols.</step>
    <step order="6">Handle empty changelog gracefully: "No entries yet. Make a commit to get started."</step>
    <step order="7">Wire into CLI entry point as the "log" subcommand with --since option</step>
  </steps>

  <verification>
    <check type="manual">With entries in changelog: `narrate log` prints formatted output</check>
    <check type="manual">With --since=yesterday: only recent entries shown</check>
    <check type="manual">With empty/missing changelog: friendly message printed</check>
    <check type="manual">No ## or ** or other markdown artifacts in output</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Needs CLI entry point" />
    <depends-on task-id="phase-1-task-4" reason="Needs changelog format knowledge for parsing" />
  </dependencies>

  <commit-message>feat: add narrate log command with --since date filtering</commit-message>
</task-plan>

---

### Wave 3 (After Wave 2)

<task-plan id="phase-1-task-9" wave="3">
  <title>narrate backfill command</title>
  <requirement>CMD-7, CMD-8</requirement>
  <description>
    Implement `narrate backfill --last=90d` that processes historical commits,
    shows a cost preview with confirmation, and batch-processes with rate
    limiting. Most complex command — needs progress display and resume support.
  </description>

  <context>
    <file path="rounds/witness/decisions.md" reason="Backfill spec: cost preview, confirmation, --last flag" />
    <file path="deliverables/narrate-cli/src/lib/summarize.js" reason="AI summarizer to call for each commit" />
    <file path="deliverables/narrate-cli/src/lib/fallback.js" reason="Fallback if API fails mid-backfill" />
    <file path="deliverables/narrate-cli/src/lib/changelog.js" reason="Append entries in chronological order" />
    <file path="deliverables/narrate-cli/src/lib/git.js" reason="Git operations to list commits and get diffs" />
    <file path="deliverables/narrate-cli/src/lib/config.js" reason="Config and API key" />
  </context>

  <steps>
    <step order="1">Create src/commands/backfill.js</step>
    <step order="2">Parse --last flag: support "90d", "30d", "2w" etc. Convert to a date threshold.</step>
    <step order="3">Use git log to list all commits since the threshold date</step>
    <step order="4">Filter out commits that already have entries in CHANGELOG.human.md (by hash)</step>
    <step order="5">Show cost preview: "Found {N} commits to summarize. Estimated cost: ~${X} (Haiku). Continue? [y/n]"</step>
    <step order="6">On confirmation: process commits in batches (10 at a time) with 1-second delay between batches to avoid rate limits</step>
    <step order="7">Show progress: "[{done}/{total}] Processing {hash} — {first 50 chars of commit msg}..."</step>
    <step order="8">On completion: "Backfill complete. {N} entries added to CHANGELOG.human.md"</step>
    <step order="9">Wire into CLI entry point as the "backfill" subcommand with --last option</step>
  </steps>

  <verification>
    <check type="manual">narrate backfill --last=7d in a repo with recent commits shows cost preview</check>
    <check type="manual">After confirming, entries appear in CHANGELOG.human.md in chronological order</check>
    <check type="manual">Running backfill again skips already-processed commits</check>
    <check type="manual">Progress output shows during processing</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-6" reason="Needs git.js, summarizer, changelog writer" />
    <depends-on task-id="phase-1-task-8" reason="Needs changelog parser to detect existing entries" />
  </dependencies>

  <commit-message>feat: add narrate backfill command with cost preview and batch processing</commit-message>
</task-plan>

---

### Wave 4 (After Wave 3 — Final verification)

<task-plan id="phase-1-task-10" wave="4">
  <title>Integration test and dogfood on great-minds repo</title>
  <requirement>QA-1, QA-2, QA-3, QA-4, QA-5, QA-6</requirement>
  <description>
    End-to-end verification: install narrate in the great-minds repo,
    make test commits, verify changelog entries are accurate and well-formatted.
    Run all commands. Fix any issues found. This is the dogfood test
    specified in the PRD build notes.
  </description>

  <context>
    <file path="deliverables/narrate-cli/package.json" reason="Package to install globally or link" />
    <file path="deliverables/narrate-cli/bin/narrate.js" reason="CLI entry point" />
    <file path="prds/witness.md" reason="Success criteria: installs cleanly, produces accurate entries on great-minds repo" />
  </context>

  <steps>
    <step order="1">From deliverables/narrate-cli/, run npm link to make narrate available globally</step>
    <step order="2">In the great-minds repo root, run narrate init — verify exact output</step>
    <step order="3">Make a test commit — verify CHANGELOG.human.md is created/updated within 5 seconds</step>
    <step order="4">Verify entry format matches decisions.md: natural date, indented sentence starting with verb, hash with · separator</step>
    <step order="5">Run narrate log — verify terminal output is clean (no markdown symbols)</step>
    <step order="6">Run narrate log --since=today — verify filtering works</step>
    <step order="7">Run narrate backfill --last=7d — verify cost preview, confirmation, and batch processing</step>
    <step order="8">Unset ANTHROPIC_API_KEY and make a commit — verify offline fallback produces a sentence (not a file list)</step>
    <step order="9">Test idempotent init (run narrate init again — no duplicate hook)</step>
    <step order="10">Verify CHANGELOG.human.md is valid markdown and git-friendly (git diff shows clean changes)</step>
  </steps>

  <verification>
    <check type="manual">narrate init prints exact 4-line output from decisions.md</check>
    <check type="manual">Post-commit hook fires and changelog updates within 5 seconds</check>
    <check type="manual">Entry format matches locked spec exactly</check>
    <check type="manual">narrate log output has no raw markdown</check>
    <check type="manual">narrate backfill processes historical commits with progress</check>
    <check type="manual">Offline fallback produces grammatical sentence</check>
    <check type="manual">Init is idempotent and doesn't clobber existing hooks</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-7" reason="Needs init command" />
    <depends-on task-id="phase-1-task-8" reason="Needs log command" />
    <depends-on task-id="phase-1-task-9" reason="Needs backfill command" />
  </dependencies>

  <commit-message>test: integration test narrate-cli on great-minds repo (dogfood)</commit-message>
</task-plan>

---

## Risk Notes

**High Priority (mitigate during build):**
- **Hook clobber risk** — Task 7 includes explicit hook conflict detection with append behavior and idempotency markers
- **Detached process hang** — Task 6 includes 30-second timeout on API calls and unref() on spawned process
- **Concurrent changelog writes** — During rapid commits, multiple detached workers could race. Mitigation: use append-only writes with fs.appendFile (atomic on most OS). Accept minor risk for v1.

**Medium Priority (address if time permits):**
- **Rate limiting on backfill** — Task 9 includes 1-second delay between 10-commit batches. May need tuning.
- **npm global PATH in hook** — Hook script should resolve narrate path explicitly. Task 7 should embed the full path to hook-worker.js rather than relying on PATH.
- **ESM in hook context** — git hooks run in minimal shell. The hook spawns node directly with an absolute file path, avoiding PATH issues.

**Low Priority (v1.1):**
- **Windows compatibility** — v1 targets macOS/Linux. Windows (WSL) testing deferred.
- **Package name collision** — Check `narrate-cli` availability on npm before publish.

---

## Execution Summary

```
Wave 1: [task-1, task-2, task-3, task-4, task-5]  ← 5 parallel tasks (scaffold + modules)
Wave 2: [task-6, task-7, task-8]                   ← 3 parallel tasks (hook + commands)
Wave 3: [task-9]                                    ← 1 task (backfill, needs log parser)
Wave 4: [task-10]                                   ← 1 task (integration test / dogfood)
```

**Estimated scope:** 10 tasks across 4 waves. Each task = 1 atomic commit.

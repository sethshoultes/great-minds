# PRD: Witness

> A local-first CLI tool that writes a plain-English changelog entry for every git commit — automatically, using the diff — so developers always have a human-readable record of what changed and why.

**Status:** Ready for build
**Origin:** Dream cycle 2026-04-05 — Phil Jackson tiebreaker
**Directors:** Steve Jobs (author) + Elon Musk (approved)

---

## Problem

Every developer knows the shame of reading their own git history and understanding nothing. Commit messages like "fix bug", "update stuff", and "wip" are universal. The moment of committing is the moment of least patience. No amount of culture change fixes this — it's a tooling problem.

## Solution

Witness is a git post-commit hook that automatically reads the diff, sends it to Claude API (Haiku — fast, cheap), and appends a plain-English summary to `CHANGELOG.human.md` in the repo root. Zero effort from the developer. The machine watches. The machine writes. You stay in flow.

## Target User

Solo developers and small teams (2-5 engineers) who ship fast, hate writing documentation, and live in the terminal and VS Code.

## Distribution

- `npm install -g witness-cli` (primary)
- VS Code Marketplace extension (secondary)
- Developer Twitter, Hacker News, Indie Hackers
- Free for solo use. Team tier later ($9/mo) adds shared changelog feed.

---

## Deliverables

### 1. witness-cli (Node.js package)

**Core loop:**
1. `witness init` — installs a git `post-commit` hook in the current repo
2. On every commit, the hook fires:
   - Reads `git diff HEAD~1 HEAD`
   - Reads the commit message
   - Sends both to Claude API (Haiku) with system prompt: *"Summarize this diff in one plain-English sentence as if explaining to a teammate. Include what changed and why based on the commit message and code context. Be concise."*
   - Appends entry to `CHANGELOG.human.md`:
     ```
     ## 2026-04-05 07:36
     **abc1234** — Refactored the user auth flow to use JWT tokens instead of session cookies, fixing the logout bug on mobile Safari.
     ```
3. `witness log` — pretty-prints the changelog in terminal
4. `witness log --since=yesterday` — filtered view

**Configuration (`.witnessrc.json`):**
```json
{
  "model": "claude-haiku-4-5-20251001",
  "tone": "casual",
  "ignore": ["package-lock.json", "*.min.js"],
  "changelog": "CHANGELOG.human.md",
  "maxDiffLines": 500
}
```

**API key:** Reads from `ANTHROPIC_API_KEY` env var or `.witnessrc.json`.

**Offline fallback:** If no API key or API unreachable, falls back to a basic rule-based summarizer that extracts file names and change counts: *"Modified 3 files: auth.js, config.ts, README.md"*

**Tech stack:**
- Node.js (ESM)
- `@anthropic-ai/sdk` for Claude API
- `simple-git` for git operations
- No build step — pure Node.js, runs anywhere

### 2. VS Code Extension

**Features:**
- Sidebar panel: renders `CHANGELOG.human.md` as a beautiful timeline
- Each entry shows: timestamp, commit hash (clickable → opens diff), summary
- Search/filter by keyword, file, or date range
- "Generate missing" command: backfills entries for commits that don't have them

**Tech stack:**
- VS Code Extension API
- Webview panel with vanilla HTML/CSS (no framework — fast, light)
- Reads `CHANGELOG.human.md` directly from workspace

### 3. Landing page / README

- Clear hero: "Your git history, in plain English."
- 3-step install: `npm install -g witness-cli && cd your-repo && witness init`
- Animated terminal demo showing a commit → automatic changelog entry
- Link to VS Code extension

---

## Quality Bar

- `witness init` must complete in < 2 seconds
- Post-commit hook must complete in < 3 seconds (non-blocking — runs async, doesn't slow git)
- Changelog entries must be accurate — no hallucinated file names or changes
- Works with repos of any size (large diffs are truncated to maxDiffLines before sending to API)
- Zero dependencies beyond Node.js and git
- CHANGELOG.human.md must be valid markdown, human-editable, git-friendly

## Non-Goals (v1)

- No web dashboard
- No team sync / shared feed
- No GitHub Action (yet)
- No support for non-git VCS
- No custom AI providers (Claude only for v1)

## Success Criteria

- Installs cleanly via npm on macOS, Linux, Windows
- Produces accurate, useful changelog entries on the Great Minds repo
- VS Code extension renders the timeline correctly
- Total build time: one session

---

## Build Notes for the Agency

This is a Node.js project, not WordPress. The agency has shipped Node.js before (Remotion video pipeline). Key decisions:

1. **Start with the CLI** — it's the core product. Get `witness init` + post-commit hook working first.
2. **VS Code extension second** — it's the craft layer that makes people love it, but the CLI stands alone.
3. **Test on this repo** — dogfood immediately by running `witness init` in the great-minds directory.
4. **Ship to npm** — `npm publish` is the distribution event.

The core loop is genuinely simple: one git hook, one API call, one markdown append. Everything else is polish.

# Narrate CLI — Requirements (v1)

**Source:** `prds/witness.md` + `rounds/witness/decisions.md`
**Generated:** 2026-04-05
**Product:** Narrate (`narrate-cli` on npm)

---

## Project Setup

| ID | Requirement | Source |
|----|------------|--------|
| PS-1 | Node.js ESM runtime, no build step | PRD + decisions |
| PS-2 | npm package name: `narrate-cli` | decisions |
| PS-3 | CLI binary command: `narrate` | decisions |
| PS-4 | Dependency: `@anthropic-ai/sdk` for Claude API | PRD + decisions |
| PS-5 | Git operations via native `child_process` (NOT simple-git) | decisions |
| PS-6 | `package.json` with `"type": "module"`, `bin` field, `engines` | derived |

## Core Hook (post-commit)

| ID | Requirement | Source |
|----|------------|--------|
| CH-1 | Post-commit hook reads `git diff HEAD~1 HEAD` + commit message | PRD |
| CH-2 | Sends diff + message to Claude API with system prompt | PRD + decisions |
| CH-3 | Appends plain-English entry to `CHANGELOG.human.md` | PRD + decisions |
| CH-4 | Runs as detached child process, fire-and-forget | decisions |
| CH-5 | Hook returns to git in < 50ms | decisions |
| CH-6 | Max diff size: 500 lines, hardcoded | decisions |
| CH-7 | Truncates diffs > 500 lines before sending to API | PRD + decisions |

## CLI Commands

| ID | Requirement | Source |
|----|------------|--------|
| CMD-1 | `narrate init` — installs post-commit hook in `.git/hooks/` | PRD + decisions |
| CMD-2 | Init detects existing hooks, appends (not overwrites), warns user | decisions |
| CMD-3 | Init output — exactly 4 lines: "Narrate is watching." / hook path / changelog path / invitation | decisions |
| CMD-4 | Init completes in < 2 seconds | PRD |
| CMD-5 | `narrate log` — pretty-prints changelog in terminal (no raw markdown) | PRD + decisions |
| CMD-6 | `narrate log --since=<date>` — filtered view by date | decisions |
| CMD-7 | `narrate backfill --last=90d` — backfills last 90 days of commits | decisions |
| CMD-8 | Backfill shows cost preview + confirmation prompt before executing | decisions |

## Configuration

| ID | Requirement | Source |
|----|------------|--------|
| CFG-1 | Config file: `.narraterc.json` in repo root | decisions |
| CFG-2 | Field `model` — default `claude-haiku-4-5-20251001`, env var override supported | decisions |
| CFG-3 | Field `ignore` — array of glob patterns to exclude from diff, default `[]` | decisions |
| CFG-4 | Field `attribution` — boolean, default `true` | decisions |
| CFG-5 | API key from `ANTHROPIC_API_KEY` env var only (no secrets in config) | decisions |
| CFG-6 | No `tone`, `changelog` path, or `maxDiffLines` in config (hardcoded or cut) | decisions |

## Changelog Format

| ID | Requirement | Source |
|----|------------|--------|
| FMT-1 | Date format: natural — `Apr 5, 2026 — 7:36 AM` | decisions |
| FMT-2 | Entry structure: sentence first, commit hash last with ` · ` separator | decisions |
| FMT-3 | Entry indented 2 spaces under date | decisions |
| FMT-4 | Blank line between date and entry, blank line between entries | decisions |
| FMT-5 | Terminal rendering — no raw markdown symbols | decisions |
| FMT-6 | File path: always `CHANGELOG.human.md` in repo root (hardcoded) | decisions |
| FMT-7 | Attribution footer when enabled: `*Narrated by Narrate — your code, in plain English*` | decisions |

## System Prompt / AI

| ID | Requirement | Source |
|----|------------|--------|
| AI-1 | Uses exact v1 system prompt from decisions.md | decisions |
| AI-2 | Entries start with a verb | decisions |
| AI-3 | Never start with "This commit" or "This change" | decisions |
| AI-4 | Use specific names from code when they add clarity | decisions |
| AI-5 | Never invent behavior not in the diff | decisions |
| AI-6 | If commit message is unhelpful ("fix", "wip"), rely on diff only | decisions |
| AI-7 | If diff is only test files, say so explicitly | decisions |
| AI-8 | If diff is dependency update, say so briefly | decisions |
| AI-9 | Keep entries under 20 words when possible | decisions |
| AI-10 | Default model: `claude-haiku-4-5-20251001` | decisions |

## Offline Fallback

| ID | Requirement | Source |
|----|------------|--------|
| OFF-1 | Activates when no API key or API unreachable | PRD + decisions |
| OFF-2 | Produces rule-based sentence (NOT a file list) | decisions |
| OFF-3 | Must be grammatical, using diff headers + commit message | decisions |
| OFF-4 | Good: "Updated authentication logic in auth.js and config.ts" | decisions |
| OFF-5 | Bad: "Modified 3 files: auth.js, config.ts, README.md" — NOT acceptable | decisions |

## Quality / Performance

| ID | Requirement | Source |
|----|------------|--------|
| QA-1 | `narrate init` < 2 seconds | PRD |
| QA-2 | Post-commit hook < 50ms return to git | decisions |
| QA-3 | No hallucinated file names or changes | PRD |
| QA-4 | Works with repos of any size | PRD |
| QA-5 | CHANGELOG.human.md must be valid markdown, human-editable, git-friendly | PRD |
| QA-6 | Installs cleanly via npm on macOS, Linux, Windows | PRD |

## Scope Boundaries

| In v1 | Deferred |
|--------|----------|
| `narrate init` with hook conflict detection | GitHub Action (v1.1, ~2 weeks) |
| Post-commit hook (detached async) | VS Code extension (v2) |
| `narrate log` with `--since` | Team sync / shared feed (v2) |
| `narrate backfill` with cost preview | Web dashboard (v2) |
| Offline fallback (sentence-based) | Custom AI providers (v2) |
| Engineered system prompt | |
| 3-field config | |
| Crafted changelog format with attribution | |

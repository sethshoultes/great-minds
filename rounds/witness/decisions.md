# Locked Decisions — Witness (now Narrate)
## Consolidated after Round 2
## Date: 2026-04-05

---

> These decisions are final. Both directors have debated, conceded, and signed off. Build starts from this document.

---

## Product Identity

| Decision | Locked Value | Origin |
|----------|-------------|--------|
| **Product name** | **Narrate** | Steve proposed R1, Elon conceded R2 |
| **Tagline** | "Your code, in plain English" | Steve R1 — uncontested |
| **CLI command** | `narrate` | Follows from name |
| **Changelog file** | `CHANGELOG.human.md` | PRD — uncontested |
| **npm package** | `narrate-cli` (pending availability check) | Derived |

---

## Architecture

| Decision | Locked Value | Origin |
|----------|-------------|--------|
| **Runtime** | Node.js (ESM), no build step | PRD + both directors agree |
| **Git operations** | Native `child_process` (no simple-git) | Elon R1, Steve conceded R2 |
| **AI SDK** | `@anthropic-ai/sdk` | PRD — uncontested |
| **Default model** | `claude-haiku-4-5-20251001` | PRD — uncontested |
| **Post-commit hook** | Detached child process, fire-and-forget | Elon R1, Steve agreed R2 |
| **Hook install behavior** | Detect existing hooks, append, warn | Elon R1, Steve agreed R2 |
| **Hook return time** | < 50ms (git perspective) | Elon R1 |
| **Max diff lines** | 500, hardcoded, documented | Elon R1, Steve agreed R2 |

---

## CLI Commands (v1)

| Command | Description |
|---------|-------------|
| `narrate init` | Install post-commit hook. 3 lines of output, quiet confidence. |
| `narrate log` | Pretty-print changelog in terminal. No raw markdown. |
| `narrate log --since=yesterday` | Filtered view by date. Retained per Elon R2 reversal. |
| `narrate backfill --last=90d` | Backfill last 90 days. Shows cost preview + confirmation. |

---

## Configuration (`.narraterc.json`)

```json
{
  "model": "claude-haiku-4-5-20251001",
  "ignore": ["package-lock.json", "yarn.lock", "*.min.js"],
  "attribution": true
}
```

| Field | Default | Notes |
|-------|---------|-------|
| `model` | `claude-haiku-4-5-20251001` | Elon R2 — env var override also supported |
| `ignore` | `[]` | Both directors agree — filters lockfiles/minified from diff |
| `attribution` | `true` | Elon R2 — opt-out boolean for footer |

**Cut from config:** `tone` (Steve R1, Elon R1), `maxDiffLines` (hardcoded), `changelog` path (hardcoded).

**API key:** `ANTHROPIC_API_KEY` env var. No config file storage for secrets.

---

## Changelog Format

```
Apr 5, 2026 — 7:36 AM

  Refactored user auth to use JWT tokens, fixing the Mobile Safari
  logout bug.  ·  abc1234
```

| Element | Decision | Origin |
|---------|----------|--------|
| Date format | Natural: `Apr 5, 2026 — 7:36 AM` | Steve R1+R2 |
| Entry structure | Sentence first, hash last (as footnote with `·` separator) | Steve R1+R2, Elon conceded R2 |
| Spacing | Blank line between date and entry, blank line between entries | Steve R2 |
| Terminal rendering | Designed for terminal — no raw markdown symbols | Steve R1 |
| Attribution footer | `*Narrated by Narrate — your code, in plain English*` | Steve R2, Elon agreed |

---

## System Prompt (v1)

```
You are generating a changelog entry for a developer's project history.
Read the git diff and commit message below. Write exactly one sentence
in plain English that describes what changed and, if the commit message
explains why, include the reason.

Rules:
- Start with a verb.
- Never start with "This commit" or "This change."
- Use specific names from the code when they add clarity.
- Never invent behavior that isn't in the diff.
- If the commit message is unhelpful (e.g., "fix", "wip", "stuff"),
  rely entirely on the diff and do not echo the commit message.
- If the diff only adds or removes test files, say so explicitly.
- If the diff is a dependency update (lockfile, package.json version bump),
  say so briefly.
- Keep it under 20 words when possible.
```

| Rule | Origin |
|------|--------|
| Start with a verb | Steve R2 |
| Never "This commit" | Steve R2 |
| Never invent behavior | Steve R2 (addressing Elon's hallucination risk from R1) |
| Handle unhelpful commit messages | Elon R2 addition |
| Handle test files explicitly | Elon R2 addition |
| Handle dependency updates | Steve R2 |
| Under 20 words | Steve R2 |

---

## Offline Fallback

| Decision | Locked Value |
|----------|-------------|
| Behavior | Rule-based sentence, NOT a file list |
| Minimum quality | Must produce a grammatical sentence using diff headers + commit message |
| Example good | "Updated authentication logic in auth.js and config.ts" |
| Example bad | "Modified 3 files: auth.js, config.ts, README.md" |

Both directors agree. The fallback must not break the aesthetic consistency of the changelog.

---

## Init Experience

```
  Narrate is watching.

  Hook installed in .git/hooks/post-commit
  Changelog will appear in CHANGELOG.human.md

  Make your next commit to see it work.
```

Three lines of output. One line of invitation. Steve R1 — uncontested.

---

## Scope Control

### In v1
- `narrate init` (with hook conflict detection)
- Post-commit hook (detached async)
- `narrate log` (with `--since` filter)
- `narrate backfill` (with cost preview)
- Offline fallback (sentence-based)
- Engineered system prompt
- 3-field config
- Crafted changelog format with attribution

### Deferred to v1.1 (~2 weeks after v1)
- GitHub Action (develop during dogfood period, ship when prompt is tuned)

### Deferred to v2
- VS Code extension (timeline sidebar)
- Team sync / shared feed
- Web dashboard
- Custom AI providers
- "Generate missing" as VS Code command (superseded by CLI backfill)

---

## Open Items (resolve during build)

| Item | Action |
|------|--------|
| npm package name availability | Check `narrate-cli` on npm registry |
| Domain | Check `narrate.dev` or similar |
| Backfill rate limiting | Determine calls/minute to avoid API throttling |
| Post-commit hook spinner | Test if `[narrate] Writing changelog...` feels right or noisy |

---

## Disagreements Resolved by Compromise

| Topic | Steve | Elon | Resolution |
|-------|-------|------|------------|
| Config fields | 1 (ignore only) | 3 (model, ignore, attribution) | **3 fields** — Elon's argument for model portability + attribution opt-out won |
| GitHub Action timing | v1.2 (after 4 weeks) | v1.1 (after 2 weeks) | **v1.1** — develop in parallel, ship after prompt is tuned. ~2 weeks. |
| `--since` flag in v1 | Included | Initially cut, then reversed | **Included** — Elon reversed in R2, citing daily ritual as retention driver |

---

*Signed off by both directors. Ready for plan phase.*

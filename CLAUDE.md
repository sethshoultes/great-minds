# Great Minds Agency -- Project Instructions

## Overview

Great Minds is a **multi-agent design and development agency**, not a plugin or a website. It is the orchestration layer that coordinates 14 AI agent personas (Steve Jobs, Elon Musk, Jensen Huang, Margaret Hamilton, etc.) to process PRDs through a structured debate-plan-build-review-ship pipeline. The agency produces strategy documents, brand assets, marketing content, product videos, and full applications.

This repo (`sethshoultes/great-minds`) contains the agency system files, agent definitions, persona knowledge bases, PRDs, deliverables, the daemon orchestrator, and the Next.js website deployed at greatminds.company.

**This is NOT the plugin repo.** The plugin lives at `great-minds-plugin/`.

## System Files

| File | Purpose |
|------|---------|
| `SOUL.md` | Agency identity, partner dynamics, values, deliverable ownership |
| `AGENTS.md` | Full 14-agent roster, hierarchy, communication rules, round protocol |
| `USER.md` | Client profile and preferences |
| `CLAUDE.md` | This file -- project instructions for Claude Code |
| `MEMORY.md` | Shared memory index (persistent across projects) |
| `HEARTBEAT.md` | Daemon architecture and legacy cron schedule |
| `BOOTSTRAP.md` | Initialization sequence on fresh start (orient, resume, validate, engage) |
| `STATUS.md` | Live agency state -- current project, agent activity, infrastructure |
| `TASKS.md` | Task board managed by Phil Jackson -- P0-P3 priorities per agent |
| `SCOREBOARD.md` | Cumulative agency metrics (commits, reviews, reports, products) |
| `CRONS.md` | Cron system map (monitor, git, organizer, Jensen review, dream) |
| `BANNED-PATTERNS.md` | Auto-fail QA patterns -- hardcoded paths, wrong APIs, console.log |
| `DO-NOT-REPEAT.md` | Patterns that have failed -- never use again |
| `CHANGELOG.human.md` | Human-readable changelog |
| `REQUIREMENTS-VERIFICATION.md` | PRD requirements traced to implementation |
| `README.md` | Public-facing repo README |

## Directory Structure

```
great-minds/
  [system files above]
  launch.sh              -- Claude-swarm launch wrapper
  run-agency.md          -- Quick-start instructions

  personas/              -- Canonical persona knowledge bases
    steve-jobs.md        -- Steve Jobs full persona
    elon-musk.md         -- Elon Musk full persona
    marcus-aurelius.md   -- Marcus Aurelius full persona
    jensen-huang.md      -- Jensen Huang full persona
    mentorPrompts.ts     -- System prompt patterns (reference)
    meditations/         -- Meditation content per mentor (JSON)

  team/                  -- Agent role definitions (created by Steve & Elon per project)
    TEMPLATE.md          -- Template for new agent definitions
    [role].md            -- One file per sub-agent with inputs, outputs, quality bar

  prds/                  -- Input PRDs from the client
    TEMPLATE.md          -- PRD intake template
    [project].md         -- Individual PRDs
    completed/           -- Archived completed PRDs
    failed/              -- Archived failed PRDs

  rounds/                -- Round transcripts per project
    {project}/           -- Debate, plan, review transcripts

  deliverables/          -- Final output files per project
    {project}/
      drafts/            -- Sub-agent work-in-progress
      final/             -- Approved deliverables

  memory/                -- Persistent learnings across projects
  memory-store/          -- SQLite + TF-IDF vector memory (155+ memories)
  agent-memory/          -- Per-agent memory files
  dreams/                -- Dream cycle outputs (drift detection, consolidation)

  daemon/                -- Agent SDK daemon orchestrator
    src/
      daemon.ts          -- Main loop and entry point
      pipeline.ts        -- Phase dispatch (debate, plan, build, review, ship)
      agents.ts          -- Agent spawn and management
      config.ts          -- Environment and path configuration
      health.ts          -- Health checks and monitoring
      dream.ts           -- Memory consolidation cycle
      logger.ts          -- Structured logger (timestamps, levels)
      telegram.ts        -- Telegram notification integration
      token-ledger.ts    -- Token usage tracking (SQLite-backed)
    bin/                 -- CLI entry points
    Dockerfile           -- Container build for daemon
    docker-compose.yml   -- Docker orchestration

  crons/                 -- Legacy cron scripts (bash, free-tier)
  engineering/           -- Engineering specs and architecture docs
  website/               -- Great Minds website source (greatminds.company)
  workshop-video/        -- Workshop video assets
  .planning/             -- GSD planning artifacts (XML task plans, wave specs)

  src/                   -- Next.js app source (website)
  .next/                 -- Next.js build output
  .github/               -- GitHub Actions workflows
  .claude/               -- Claude Code configuration
```

## Pipeline Phases

```
idle --> debate --> plan --> build --> review --> ship --> idle
                                       ^           |
                                       +-----------+  (revisions)

Any state --> blocked --> (human resolves) --> previous state
```

### Phase 1: DEBATE (Rounds 1-2)
Steve Jobs and Elon Musk stake independent positions on all 6 deliverable areas, then challenge each other through structured rounds. Phil Jackson logs decisions. Goal: lock strategic decisions before building.

### Phase 2: PLAN (Round 3)
Directors define their teams by writing agent definitions in `team/`:
- Steve hires: designer, copywriter, brand strategist
- Elon hires: market analyst, growth strategist, team architect
- Each agent gets a role definition with specific inputs, outputs, and quality bar
- Use `team/TEMPLATE.md` for agent definitions

### Phase 3: BUILD (Rounds 4-8)
Sub-agents execute assignments:
- Each reads the PRD + debate decisions + their role definition
- Output goes to `deliverables/{project}/drafts/`
- Multiple agents run in parallel via Agent tool with worktree isolation
- Directors intervene if output drifts from strategy

### Phase 4: REVIEW (Round 9)
- Steve reviews for taste, craft, and brand consistency
- Elon reviews for feasibility, accuracy, and market alignment
- Revisions sent back to specific agents with targeted feedback

### Phase 5: SHIP (Round 10)
- Final deliverables assembled in `deliverables/{project}/final/`
- Joint summary written by both partners
- Marcus Aurelius writes the retrospective
- Learnings saved to `memory/`
- STATUS.md set to `idle`

## Anti-Hallucination Rules

These rules are mandatory. Violations produce incorrect output that wastes tokens and time.

1. **Read before you write.** Every agent MUST read the relevant docs (PRD, debate decisions, role definition, BANNED-PATTERNS.md) before producing any output. Never generate from memory alone.
2. **No invented APIs.** If you are writing code that calls an API (Emdash, Cloudflare, WordPress, etc.), read the actual API docs or reference files first. See `BANNED-PATTERNS.md` for known hallucinated patterns.
3. **No hardcoded paths.** Never use `/Users/sethshoultes/` or any absolute home directory path. Use `${PIPELINE_REPO}`, `${HOME}`, `$(git rev-parse --show-toplevel)`, or relative paths.
4. **No assumed file contents.** If a file might have changed since your last read, re-read it. STATUS.md, TASKS.md, and MEMORY.md change frequently.
5. **No fabricated metrics.** If you cite a number (test count, file count, deployment status), verify it with a command. Do not guess.
6. **Use the structured logger.** In daemon code, use `logger.info()` / `logger.error()` from `daemon/src/logger.ts`. Never use `console.log` in production code.
7. **Verify before claiming success.** Run the actual verification command and confirm the output before stating that something works.

## Banned Patterns

See `BANNED-PATTERNS.md` for the full list of auto-fail patterns. Key categories:

- **Emdash Plugin Patterns**: `throw new Response(`, `rc.user`, `rc.pathParams`, `process.env` in Workers, double JSON serialization on KV
- **Cross-Project Patterns**: hardcoded home paths, `console.log` in daemon code, unprotected `setTimeout` promises

Any match in built code = **QA BLOCK**. Fix before merging.

Also see `DO-NOT-REPEAT.md` for operational patterns that have failed (e.g., `tmux send-keys` to Claude Code, `grep -oP` on macOS, `set -e` with `grep -c`).

## Branch Strategy

1. **Never push directly to `main`.** All work happens on feature branches.
2. **Branch naming**: `feature/{name}`, `fix/{name}`, `docs/{name}`, `blog/{name}`
3. **Self-review before PR**: spawn a Haiku sub-agent (Jony Ive for visual, Margaret for tests) to review.
4. **PRs merge to `main`** via GitHub. Vercel auto-deploys from `main`.
5. **Worktree isolation**: agents use `git worktree` for parallel work, never concurrent writes to the same working tree.

## Related Repos

| Repo | What | Where |
|------|------|-------|
| `sethshoultes/great-minds` | This repo -- agency system, daemon, website | Local + GitHub |
| `sethshoultes/great-minds-plugin` | Claude Code plugin (17 skills) -- the `/agency-*` commands | Local (`/Users/sethshoultes/Local Sites/great-minds-plugin/`) |
| `sethshoultes/shipyard-ai` | Autonomous site builder (Cloudflare Pages) | DO server builds, NOT local. See `feedback_never_do_team_work.md` |
| `sethshoultes/localgenius` | AI digital presence SaaS (Next.js + Neon) | Local + Vercel |
| `sethshoultes/dash-command-bar` | WordPress command bar plugin | Shipped |
| `sethshoultes/pinned-notes` | WordPress pinned notes plugin | Shipped |

**Important**: Shipyard builds happen on the DigitalOcean server, never locally. Write a PRD, deploy to the daemon, done. Never build/debug/fix Shipyard code yourself.

## Daemon

The agency daemon is an Agent SDK-based long-running process that handles all pipeline orchestration. It replaces the legacy cron-based scripts.

- **Location**: `/Users/sethshoultes/Local Sites/great-minds/daemon/`
- **Log file**: `/tmp/greatminds-daemon.log`
- **Runs locally** on the dev machine (not on DO)
- **Source files**: `daemon/src/` (daemon.ts, pipeline.ts, agents.ts, config.ts, health.ts, dream.ts, logger.ts, telegram.ts, token-ledger.ts)

### What the daemon does:
- Watches `prds/` for new PRDs (with `awaitWriteFinish` to avoid race conditions)
- Dispatches agents through the debate-plan-build-review-ship pipeline
- Runs health checks (file counts, site status, memory)
- Runs dream cycles (drift detection, memory consolidation)
- Tracks token usage in SQLite via `token-ledger.ts`
- Sends Telegram notifications on crashes, completions, and alerts
- Crash recovery: 2 retries with backoff, hung agent detection (10min agent / 60min pipeline)

### Starting the daemon:
```bash
cd /Users/sethshoultes/Local Sites/great-minds/daemon
npm start
# Or via Docker:
docker compose up
```

### Monitoring:
```bash
tail -f /tmp/greatminds-daemon.log
```

## Retry Policy

1. Agent fails -> retry once with same prompt
2. Retry fails -> try alternative approach
3. Alternative fails -> mark as "blocked" in STATUS.md
4. After 3 failures on same task -> stop, engage human
5. While blocked on one task -> work on unblocked tasks

## Agent Communication Protocol

- **[STEVE]**: Direct, passionate, human experience focus. Challenges mediocrity.
- **[ELON]**: First-principles, data-driven, feasibility focus. Challenges hand-waving.
- **[{ROLE}]**: Sub-agents write in role-appropriate voice per their agent definition.
- No agreeing just to be polite -- disagreement is productive.
- Every claim must be defended with reasoning.
- Either director can veto but must propose an alternative.
- Sub-agents flag blockers in STATUS.md; they do not silently fail.

## Memory

- After each project, save key learnings to `memory/`
- Update `MEMORY.md` index
- Memory accumulates across projects -- the agency gets smarter over time
- Dream cycle handles consolidation and pruning
- `memory-store/` contains the SQLite + TF-IDF vector store (155+ memories)
- Track: what worked, what didn't, patterns across PRDs, refined frameworks

# Great Minds Agency — Heartbeat

This file defines what happens on each scheduled tick. The orchestrator reads this file to determine what actions to take.

## Cron Schedule (Decoupled Architecture)

Crons run independently via system crontab -- never bottleneck the main agent. No conversation-based crons.

| Job | Interval | Runtime | Purpose |
|-----|----------|---------|---------|
| heartbeat | 5 min | Bash (free) | File count, site status, memory check |
| margaret-qa | 29 min | Bash (free) | Site content verification, image checks |
| git-monitor | 15 min | Bash (free) | Uncommitted changes, open PRs |
| do-server-check | 10 min | Bash (free) | SSH health check on DO droplet |
| dispatch | 30 min | Haiku (cheap) | Read TASKS.md, assign idle agents |
| dream | 60 min | Haiku (cheap) | Detect drift in system files, memory consolidation |
| jensen-review | 60 min | Jensen (Board) | Strategic review, GitHub issues, advise |

Reports write to `/tmp/claude-shared/cron-reports.log`. Alerts to `/tmp/claude-shared/alerts.log`.

## Agent Roster (14 agents)

| Agent | Role | Dispatch |
|-------|------|----------|
| Phil Jackson | Orchestrator | Agent tool (worktree isolation) |
| Steve Jobs | Creative Director (Design, Brand, UX) | Agent tool (worktree isolation) |
| Elon Musk | Product Director (Engineering, Growth) | Agent tool (worktree isolation) |
| Jensen Huang | Board Member (Strategy, Reviews) | Cron: 60 min |
| Oprah Winfrey | Board Member (Audience, Brand Trust) | On-demand (board meetings) |
| Warren Buffett | Board Member (Economics, Capital) | On-demand (board meetings) |
| Shonda Rhimes | Board Member (Narrative, Content) | On-demand (board meetings) |
| Margaret Hamilton | QA Director (Tests, Security, A11y) | Agent tool (worktree isolation) |
| Rick Rubin | Creative Direction (Brand voice, Essence) | Sub-agent (Haiku) |
| Jony Ive | Visual Design (UI, Components, Craft) | Sub-agent (Haiku) |
| Maya Angelou | Copywriting (Landing pages, Emails) | Sub-agent (Haiku) |
| Aaron Sorkin | Scriptwriter (Video scripts, Dialogue) | Agent tool |
| Sara Blakely | Growth Strategy (GTM, Pricing) | Sub-agent (Haiku) |
| Marcus Aurelius | Retrospective, Tie-breaker, Process Audit | Agent tool |

## Agent Dispatch Method

**Agent tool with worktree isolation** -- each agent gets its own git worktree for safe parallel work. tmux send-keys was proven unreliable and has been fully replaced.

## Director Operating Rules

Steve and Elon are DIRECTORS, not individual contributors:
- Break tasks into sub-tasks
- Spawn sub-agents (model: haiku) for parallel work
- Do highest-judgment work themselves
- Delegate: tests, docs, boilerplate, QA, content to sub-agents
- Should have 2-3 sub-agents running at all times during BUILD phases
- Never idle -- self-direct when no task is dispatched

## Board of Directors

Jensen Huang, Oprah Winfrey, Warren Buffett, Shonda Rhimes. Marcus Aurelius breaks ties (2-2 splits). Board advises but does not block.

## Heartbeat Tick (every 5 min)

```
1. Count source files in active projects
2. Check recent git commits
3. Verify site availability (curl health checks)
4. Check MEMORY.md size (should be under 50 lines)
5. Report to /tmp/claude-shared/cron-reports.log
```

## Dispatch Tick (every 30 min)

```
1. Read TASKS.md for pending tasks
2. Check which agents are idle
3. Assign tasks via Agent tool with worktree isolation
4. Update TASKS.md with assignments
```

## Jensen Board Review (every 60 min)

```
1. Read latest commits across all projects
2. Count source files
3. Read previous board review to avoid repeating
4. Write review (under 50 lines) to rounds/{project}/board-review-{N}.md
5. Create GitHub issues (label: board-idea) only if genuinely new
6. One specific, actionable recommendation per review
```

Already covered issues (don't repeat):
- Data moat architecture
- Platform partnerships (CUDA playbook)
- Outcome-based pricing evolution
- Usage ceiling / AI model degradation
- AI honesty in system prompts
- ROI metrics in digest
- Email data pipeline
- Focus risk on multi-project
- Placeholder runtime on Sites
- CORS on voice endpoint
- In-memory Map for insight actions

## QA Pipeline (Margaret Hamilton -- on demand via /agency-qa)

```
Phase 1: npm run build + typecheck + lint
Phase 2: npm run test (report pass/fail count)
Phase 3: Live site screenshots (Playwright)
Phase 4: API smoke test (health, auth, key endpoints)
Phase 5: Accessibility audit (ARIA, contrast, touch targets)
Phase 6: Security review (auth, error leaking, CORS, secrets)
Output: QA report with SHIP / FIX FIRST / BLOCK recommendation
```

## Active Projects

| Project | Location | Live URL | Platform |
|---------|----------|----------|----------|
| LocalGenius (app) | /Users/sethshoultes/Local Sites/localgenius/ | localgenius.company | Vercel + Neon |
| Great Minds (agency) | /Users/sethshoultes/Local Sites/great-minds/ | greatminds.company | Vercel |
| Shipyard AI | github.com/sethshoultes/shipyard-ai | www.shipyard.company | Cloudflare Pages |

## Hybrid AI Architecture

| Task Type | Model | Platform | Cost |
|-----------|-------|----------|------|
| Directors + Strategy | Claude Sonnet | Anthropic | High -- real work only |
| Sub-agent work | Claude Haiku | Anthropic | ~5x cheaper than Sonnet |
| Cron dispatch + dream | Claude Haiku | CLI (`--model haiku`) | Cheap |
| Content drafts | Llama 3.1 8B | Cloudflare Workers AI | Free tier |
| Voice transcription | Whisper | Cloudflare Workers AI | Free tier |
| Image generation | Stable Diffusion XL | Cloudflare Workers AI | Free tier |
| Sentiment analysis | DistilBERT | Cloudflare Workers AI | Free tier |

## State Machine

```
idle -> debate -> plan -> build -> review -> ship -> idle
                                  ^         |
                                  +--------+  (revisions)

Any state -> blocked -> (human resolves) -> previous state
```

## Retry Policy

- Agent fails -> retry once
- Retry fails -> try alternative approach
- Alternative fails -> mark "blocked" in STATUS.md, continue other work
- 3 total failures on same task -> stop and engage human
- Usage limits hit -> wait for reset, dispatch nudges when available

## Plugin

Install the full agency on any machine:
```
npx plugins add sethshoultes/great-minds-plugin
```
Includes: 14 agents, 12 skills, GSD integration, decoupled cron system, context guard hooks, `.planning/` templates.

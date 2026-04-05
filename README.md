# Great Minds Agency

A multi-agent AI agency that takes a product idea from concept to deployed software — autonomously.

Drop in a PRD. The agents debate strategy, hire sub-agents, build deliverables, write code, run tests, and deploy. You review the output.

[![Great Minds Agency Demo](https://img.youtube.com/vi/wkOqaFoOAfE/maxresdefault.jpg)](https://youtu.be/wkOqaFoOAfE)

## The Team (14 Agents + Founder)

| Agent | Role | Persona |
|-------|------|---------|
| **Phil Jackson** | Orchestrator | Zen Master. System coordination, cron management, dispatch, resource optimization. |
| **Steve Jobs** | Chief Design & Brand Officer | Product design, brand identity, messaging, customer experience. "Is this insanely great?" |
| **Elon Musk** | Chief Product & Growth Officer | Product/market fit, engineering, team structure, growth metrics. "Does physics allow this?" |
| **Jensen Huang** | Board Member (60-min cron) | Strategic reviews, GitHub issues, advisory. "What's the data moat?" |
| **Oprah Winfrey** | Board Member | Audience insight, brand trust, emotional resonance. |
| **Warren Buffett** | Board Member | Unit economics, capital allocation, long-term value. |
| **Shonda Rhimes** | Board Member | Narrative strategy, content arcs, storytelling. |
| **Margaret Hamilton** | QA Director (continuous) | Zero-defect methodology. Live site monitoring, test suites, security audits. |
| **Rick Rubin** | Creative Director | Strip to essence. Brand voice, copy review, authenticity checks. |
| **Jony Ive** | Visual Design Director | Spacing, hierarchy, craft. Design systems, component design. |
| **Maya Angelou** | Copywriter | Warmth, rhythm, dignity. Landing pages, emails, microcopy. |
| **Aaron Sorkin** | Scriptwriter | Sharp dialogue, product demo scripts, video narration. |
| **Sara Blakely** | Growth Strategist | Scrappy, customer-first. GTM, pricing, grassroots acquisition. |
| **Marcus Aurelius** | Retrospective / Tie-breaker | Stoic reflection. Post-project retrospectives, board tie-breaking, process audits. |

## How It Works

```
PRD -> Debate (2 rounds) -> Plan (hire sub-agents) -> Build (parallel) -> Review -> Ship
```

1. **You** drop a PRD in `prds/`
2. **Phil Jackson** orchestrates the pipeline and dispatches agents via Agent tool with worktree isolation
3. **Steve & Elon** debate strategy, then direct sub-agent teams
4. **Sub-agents** (Haiku model, ~5x cheaper) produce deliverables in parallel
5. **Board of Directors** (Jensen, Oprah, Buffett, Shonda) advise; Marcus breaks ties
6. **Margaret** runs continuous QA -- tests, live site checks, security audits
7. **Output**: strategy docs + engineering specs + working software + deployment

## Architecture

```
Human (you)
  ├── Board of Directors (Jensen, Oprah, Buffett, Shonda)
  └── Phil Jackson — Orchestrator (Agent tool dispatch)
       ├── Steve Jobs — Creative Director
       │    └── Rick Rubin, Jony Ive, Maya Angelou (sub-agents, Haiku)
       ├── Elon Musk — Product Director
       │    └── Sara Blakely + engineering sub-agents (Haiku)
       ├── Margaret Hamilton — QA Director (continuous)
       ├── Aaron Sorkin — Scriptwriter
       └── Marcus Aurelius — Retrospective / Tie-breaker
```

### Agent Dispatch

Agents are dispatched via **Agent tool with worktree isolation** -- each agent gets its own git worktree for safe parallel work. tmux send-keys was tried and proven unreliable.

### Hybrid AI Architecture

Claude handles high-judgment work. Cloudflare Workers AI handles commodity tasks at near-zero cost.

| Task | Model | Platform | Cost |
|------|-------|----------|------|
| Directors + Strategy | Claude Sonnet | Anthropic | High -- real work only |
| Sub-agent work | Claude Haiku | Anthropic | ~5x cheaper |
| Cron dispatch + dream | Claude Haiku | CLI (`--model haiku`) | Cheap |
| Voice transcription | Whisper | Cloudflare Workers AI | Free |
| Image generation | Stable Diffusion XL | Cloudflare Workers AI | Free |

### Decoupled Cron System

Crons run independently via system crontab -- never bottleneck the main agent. Bash + Haiku, not conversation-based.

| Cron | Interval | Model | Purpose |
|------|----------|-------|---------|
| Heartbeat | 5 min | Bash (free) | File count, site status, memory check |
| Margaret QA | 29 min | Bash (free) | Site content verification, image checks |
| Git Monitor | 15 min | Bash (free) | Uncommitted changes, open PRs |
| DO Server Check | 10 min | Bash (free) | SSH health check on remote server |
| Dispatch | 30 min | Haiku (cheap) | Read TASKS.md, assign idle agents |
| Dream Consolidation | 60 min | Haiku (cheap) | Detect drift in system files |

Reports write to `/tmp/claude-shared/cron-reports.log`. Alerts to `/tmp/claude-shared/alerts.log`.

### GSD Integration

Inspired by [Get Shit Done](https://github.com/gsd-build/get-shit-done) -- structured planning, wave-based parallel execution, context rot prevention.

| Skill | Purpose |
|-------|---------|
| `/agency-plan` | XML task plans verified against requirements |
| `/agency-execute` | Wave-based parallel execution with fresh context per task |
| `/agency-verify` | UAT verification with debug agents for failures |
| `/scope-check` | Detect scope creep against original plan |
| Context Guard Hook | Warns when context is getting large |

## Live Products

| URL | What | Platform |
|-----|------|----------|
| [localgenius.company](https://localgenius.company) | AI digital presence app | Vercel + Neon |
| [greatminds.company](https://greatminds.company) | Agency website + blog | Vercel |
| [www.shipyard.company](https://www.shipyard.company) | Shipyard AI -- autonomous site builder | Cloudflare Pages |

## Stats

| Metric | Count |
|--------|-------|
| Agent personas | 14 + founder |
| GitHub repos | 6 |
| Live deployments | 3 |
| Source files (LocalGenius) | 265 |
| Test specs | 770+ |
| Total commits | 240+ |
| Board reviews (Jensen) | 23+ |
| QA reports (Margaret) | 80+ |
| Blog posts | 20 |
| Product videos (Remotion) | 5 |
| WordPress plugins shipped | 2 (Dash, Pinned) |
| Plugin skills | 12 |
| PRs merged | 25+ |
| VPS | DigitalOcean 8GB/4vCPU |

## System Files

| File | Purpose |
|------|---------|
| `SOUL.md` | Agency identity, values, partner dynamics |
| `AGENTS.md` | Full agent roster, hierarchy, communication rules |
| `TASKS.md` | Master task board -- agents self-direct from this |
| `HEARTBEAT.md` | Cron schedule, agent roster, hybrid AI, active projects |
| `STATUS.md` | Live state -- what's running, what's blocked, progress |
| `MEMORY.md` | Persistent memory index -- agency learns across projects |
| `SCOREBOARD.md` | Agency-wide accountability tracking |

## Install (Claude Code Plugin)

```bash
npx plugins add sethshoultes/great-minds-plugin
```

Includes: 14 agents, 12 skills, GSD integration, decoupled cron system, context guard hooks, `.planning/` templates.

## Quick Start

```bash
# Prerequisites: Claude Code CLI, git
git clone https://github.com/sethshoultes/great-minds.git
cd great-minds

# Drop a PRD in prds/
cp prds/TEMPLATE.md prds/my-project.md
# Edit with your product idea

# Launch the agency (no claude-swarm dependency)
# Use the plugin: /agency-launch
```

## Related Projects

- [shipyard-ai](https://github.com/sethshoultes/shipyard-ai) -- Autonomous site builder (spun out from Great Minds)
- [localgenius](https://github.com/sethshoultes/localgenius) -- First product built by the agency
- [great-minds-plugin](https://github.com/sethshoultes/great-minds-plugin) -- Claude Code plugin (installable agency)
- [dash-command-bar](https://github.com/sethshoultes/dash-command-bar) -- Dash WP command bar plugin
- [pinned-notes](https://github.com/sethshoultes/pinned-notes) -- Pinned WP notes plugin

## License

MIT

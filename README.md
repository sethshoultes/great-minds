# Great Minds Agency

A multi-agent AI agency that takes a product idea from concept to deployed software — autonomously.

Drop in a PRD. The agents debate strategy, hire sub-agents, build deliverables, write code, run tests, and deploy. You review the output.

## The Team

| Agent | Role | Persona |
|-------|------|---------|
| **Marcus Aurelius** | Moderator / Chief of Staff | Stoic philosopher-emperor. Drives the state machine, mediates conflicts, gates quality. |
| **Steve Jobs** | Chief Design & Brand Officer | Product design, brand identity, messaging, customer experience. "Is this insanely great?" |
| **Elon Musk** | Chief Product & Growth Officer | Product/market fit, engineering, team structure, growth metrics. "Does physics allow this?" |
| **Jensen Huang** | Board Member (60-min cron) | Strategic reviews, GitHub issues, advisory. "What's the data moat?" |
| **Organizer** | System maintenance (20-min cron) | File hygiene, memory consolidation, idle agent nudging. |

## How It Works

```
PRD → Debate (2 rounds) → Plan (hire sub-agents) → Build (parallel) → Review → Ship
```

1. **You** drop a PRD in `prds/`
2. **Marcus** orchestrates the pipeline
3. **Steve & Elon** debate strategy, then direct sub-agent teams
4. **Sub-agents** produce deliverables and write code in parallel
5. **Jensen** checks in hourly with strategic perspective and files GitHub issues
6. **Output**: strategy docs + engineering specs + working software + deployment

## Architecture

Built on [claude-swarm](https://github.com/sethshoultes/claude-swarm) — tmux orchestration with git worktrees for parallel, conflict-free agent development.

```
Human (you)
  ├── Jensen Huang — Board Member (cron, GitHub issues, advisory)
  └── Marcus Aurelius — Moderator (tmux: admin)
       ├── Steve Jobs — Creative Director (tmux: worker1)
       │    └── sub-agents (designer, copywriter, reviewer...)
       ├── Elon Musk — Product Director (tmux: worker2)
       │    └── sub-agents (analyst, strategist, architect...)
       └── Organizer/Haiku — system maintenance (cron)
```

## System Files

| File | Purpose |
|------|---------|
| `SOUL.md` | Agency identity, values, partner dynamics |
| `AGENTS.md` | Full agent roster, hierarchy, communication rules |
| `USER.md` | Client profile |
| `HEARTBEAT.md` | Cron schedule — orchestrator, organizer, Jensen, dream cycle |
| `BOOTSTRAP.md` | Startup sequence when agency initializes |
| `STATUS.md` | Live state — what's running, what's blocked, progress |
| `MEMORY.md` | Persistent memory index — agency learns across projects |

## Directory Structure

```
great-minds/
  [system files]
  personas/           — Canonical persona knowledge bases (5-15K words each)
  team/               — Agent role definitions + hiring templates
  memory/             — Persistent learnings across projects
  prds/               — Input PRDs
  rounds/             — Debate transcripts, decisions, board reviews
  engineering/        — Technical architecture docs
  deliverables/       — Strategy docs, workshop plans, final outputs
```

## Quick Start

```bash
# Prerequisites: tmux, Claude Code CLI, git
# Install claude-swarm
mkdir -p ~/.local/bin
curl -o ~/.local/bin/claude-swarm https://raw.githubusercontent.com/sethshoultes/claude-swarm/main/claude-swarm
chmod +x ~/.local/bin/claude-swarm
export PATH="$HOME/.local/bin:$PATH"

# Clone and launch
git clone https://github.com/sethshoultes/great-minds.git
cd great-minds

# Drop a PRD in prds/
cp prds/TEMPLATE.md prds/my-project.md
# Edit prds/my-project.md with your product idea

# Launch the agency
./launch.sh my-project
```

## First Project: LocalGenius

Our first client project produced:

- **8 strategy deliverables** (195KB) — product design, market fit, personas, team, marketing goals, messaging
- **8 engineering docs** (192KB) — tech stack, data model, API design, infrastructure
- **Full Next.js application** (169+ source files, 139 tests) — [sethshoultes/localgenius](https://github.com/sethshoultes/localgenius)
- **2 board reviews** with 4 GitHub issues from Jensen
- **Live deployment** at [localgenius-beige.vercel.app](https://localgenius-beige.vercel.app)

All from a single PRD, in one session.

## Personas

Agent personas are sourced from [think-like](https://github.com/sethshoultes/think-like) — deeply researched, 5,000-15,000 word knowledge bases covering biography, philosophy, decision-making frameworks, communication style, and key quotes.

## Related Projects

- [claude-swarm](https://github.com/sethshoultes/claude-swarm) — Multi-agent orchestration via tmux + git worktrees
- [think-like](https://github.com/sethshoultes/think-like) — AI mentor personas and meditations platform
- [localgenius](https://github.com/sethshoultes/localgenius) — First product built by the agency

## License

MIT

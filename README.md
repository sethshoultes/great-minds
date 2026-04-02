# Great Minds Agency

A multi-agent AI agency that takes a product idea from concept to deployed software — autonomously.

Drop in a PRD. The agents debate strategy, hire sub-agents, build deliverables, write code, run tests, and deploy. You review the output.

## The Team (9 Agents)

| Agent | Role | Persona |
|-------|------|---------|
| **Marcus Aurelius** | Moderator / Chief of Staff | Stoic philosopher-emperor. Drives the state machine, mediates conflicts, gates quality. |
| **Steve Jobs** | Chief Design & Brand Officer | Product design, brand identity, messaging, customer experience. "Is this insanely great?" |
| **Elon Musk** | Chief Product & Growth Officer | Product/market fit, engineering, team structure, growth metrics. "Does physics allow this?" |
| **Jensen Huang** | Board Member (60-min cron) | Strategic reviews, GitHub issues, advisory. "What's the data moat?" |
| **Margaret Hamilton** | QA Director (continuous) | Zero-defect methodology. Live site monitoring, test suites, security audits. |
| **Rick Rubin** | Creative Director | Strip to essence. Brand voice, copy review, authenticity checks. |
| **Jony Ive** | Visual Design Director | Spacing, hierarchy, craft. Design systems, component design. |
| **Maya Angelou** | Copywriter | Warmth, rhythm, dignity. Landing pages, emails, microcopy. |
| **Sara Blakely** | Growth Strategist | Scrappy, customer-first. GTM, pricing, grassroots acquisition. |

## How It Works

```
PRD → Debate (2 rounds) → Plan (hire sub-agents) → Build (parallel) → Review → Ship
```

1. **You** drop a PRD in `prds/`
2. **Marcus** orchestrates the pipeline
3. **Steve & Elon** debate strategy, then direct sub-agent teams
4. **Sub-agents** produce deliverables and write code in parallel
5. **Jensen** checks in hourly with strategic perspective and files GitHub issues
6. **Margaret** runs continuous QA — tests, live site checks, security audits
7. **Output**: strategy docs + engineering specs + working software + deployment

## Architecture

Built on [claude-swarm](https://github.com/sethshoultes/claude-swarm) — tmux orchestration with git worktrees for parallel, conflict-free agent development.

```
Human (you)
  ├── Jensen Huang — Board Member (cron, GitHub issues, advisory)
  └── Marcus Aurelius — Moderator (tmux: admin)
       ├── Steve Jobs — Creative Director (tmux: worker1)
       │    └── Rick Rubin, Jony Ive, Maya Angelou (design crew)
       ├── Elon Musk — Product Director (tmux: worker2)
       │    └── sub-agents for engineering tasks
       ├── Margaret Hamilton — QA Director (tmux: worker3)
       └── Sara Blakely — Growth Strategy
```

### Hybrid AI Architecture

Claude handles high-judgment work. Cloudflare Workers AI handles commodity tasks at near-zero cost.

| Task | Model | Platform | Cost |
|------|-------|----------|------|
| Conversation | Claude Sonnet | Anthropic API | ~$0.003/msg |
| Content drafts | Llama 3.1 8B | Cloudflare Workers AI | Free |
| Voice transcription | Whisper | Cloudflare Workers AI | Free |
| Image generation | Stable Diffusion XL | Cloudflare Workers AI | Free |
| Sentiment analysis | DistilBERT | Cloudflare Workers AI | Free |
| Sub-agent work | Claude Haiku | Anthropic API | ~5x cheaper |

## Automated Operations

| Cron | Interval | Purpose |
|------|----------|---------|
| Monitor | 7 min | Agent status, file counts, commits |
| Git Monitor | 13 min | Commit/push uncommitted work, check issues |
| Organizer | 19 min | Nudge idle agents, check live sites |
| Jensen Review | 60 min | Strategic board review + GitHub issues |
| Margaret QA | Continuous | Live site monitoring, test suites |

## Live Products

| URL | What | Platform |
|-----|------|----------|
| [localgenius.company](https://localgenius.company) | AI digital presence app | Vercel + Neon |
| [localgenius-sites.pages.dev](https://localgenius-sites.pages.dev) | Emdash website builder | Cloudflare Pages |

## Stats (Current Session)

| Metric | Count |
|--------|-------|
| Source files | 270+ (238 app + 35 sites) |
| Test specs | 576+ |
| Total commits | 140+ across 4 repos |
| Board reviews | 11 (Jensen) |
| QA reports | 2 (Margaret) |
| GitHub issues | 7 (all from Jensen, 2 fixed) |
| Agent personas | 9 |

## System Files

| File | Purpose |
|------|---------|
| `SOUL.md` | Agency identity, values, partner dynamics |
| `AGENTS.md` | Full agent roster, hierarchy, communication rules |
| `USER.md` | Client profile |
| `HEARTBEAT.md` | Cron schedule, agent roster, hybrid AI, active projects |
| `BOOTSTRAP.md` | Startup sequence when agency initializes |
| `STATUS.md` | Live state — what's running, what's blocked, progress |
| `MEMORY.md` | Persistent memory index — agency learns across projects |

## Install (Claude Code Plugin)

```bash
npx plugins add sethshoultes/great-minds-plugin
```

Includes: 9 agents, 5 skills (`/agency-start`, `/agency-status`, `/agency-review`, `/agency-qa`, `/agency-debate`), hooks, templates.

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

## Personas

Agent personas sourced from [think-like](https://github.com/sethshoultes/think-like) — deeply researched, 5,000-15,000 word knowledge bases covering biography, philosophy, decision-making frameworks, communication style, and key quotes.

## Related Projects

- [claude-swarm](https://github.com/sethshoultes/claude-swarm) — Multi-agent orchestration via tmux + git worktrees
- [think-like](https://github.com/sethshoultes/think-like) — AI mentor personas and meditations platform
- [localgenius](https://github.com/sethshoultes/localgenius) — First product built by the agency
- [localgenius-sites](https://github.com/sethshoultes/localgenius-sites) — Emdash website builder for customers
- [great-minds-plugin](https://github.com/sethshoultes/great-minds-plugin) — Claude Code plugin (installable agency)

## License

MIT

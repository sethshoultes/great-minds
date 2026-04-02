---
name: CLAW Systems Research
description: Comprehensive research on OpenClaw, Nanobot, ClawX, soul.md, and MAD frameworks — patterns informing our agency architecture
type: reference
---

## OpenClaw (247k+ GitHub stars)
Created by Peter Steinberger (Nov 2025), fastest-growing OSS project on GitHub. Connects LLMs to apps/browsers/tools, runs locally via messaging platforms.

### Workspace File Convention (8 markdown files at boot):
| File | Purpose |
|------|---------|
| **SOUL.md** | Persona, tone, values, behavioral boundaries |
| **AGENTS.md** | Operating instructions, rules, delegation roster |
| **USER.md** | Information about the human user |
| **TOOLS.md** | Available tools and how to use them |
| **IDENTITY.md** | Core identity traits |
| **HEARTBEAT.md** | Scheduled/cron tasks (read every 30 min) |
| **BOOTSTRAP.md** | Initialization instructions |
| **MEMORY.md** | Long-term memory persisting across sessions |

### Multi-Agent Model:
- Hierarchical subagent spawning (depth-2 limit)
- Max 5 children per agent
- Communication via message-passing through gateway, ACP (Agent Communication Protocol), or shared memory files
- Coordinator pattern: route through coordinator agent
- Practical deployments use 2-5 agents (coordination overhead scales)

Sources: docs.openclaw.ai, github.com/ValueCell-ai/ClawX

## Nanobot (HKUDS) — "Ultra-Lightweight OpenClaw"
~4,000 lines of Python, 99% less code than OpenClaw.

### Memory:
- Dual-tier: Honcho (AI-native memory) when enabled, local files otherwise
- Plain files + grep retrieval (no RAG) — deliberate design choice
- memory_window parameter (default 50 messages) controls consolidation

### Multi-Agent (RFC):
- Process isolation + message bus + supervisor/orchestrator
- AgentLoop: max 40 LLM-tool iterations per cycle

Source: github.com/HKUDS/nanobot

## soul.md Standard (aaronjmars/soul.md)
De facto standard recognized by Claude Code, Cursor, Windsurf, and OpenClaw.
- SOUL.md: Identity, worldview, opinions
- STYLE.md: Voice, syntax, writing patterns
- SKILL.md: Operating modes
- MEMORY.md: Session memory for cross-conversation continuity
- Three non-negotiables: **Core Truths, Boundaries, The Vibe**
- Philosophy: specificity > generality, contradictions > coherence, real opinions > safe positions

Source: github.com/aaronjmars/soul.md

## Multi-Agent Debate (MAD)
- Structured argue-update-converge loops
- Most effective for complex problems (limited gains on simple tasks)
- Moderate team diversity = consistent accuracy + consensus gains
- Applied in: legal judgment, code repair, safety reasoning, content moderation

## Patterns We Adopted
1. **SOUL.md + MEMORY.md convention** (from OpenClaw/soul.md standard)
2. **Plain file + grep memory** (from Nanobot)
3. **Process-isolated agents** (from Nanobot RFC) — Claude Code agents already isolated
4. **Round files as message bus** (inspired by ACP + coordinator pattern)
5. **10-round debate loop** (from MAD research — effective for complex deliverables)
6. **/loop scheduling** (analogous to OpenClaw's HEARTBEAT.md cron)
7. **Moderate diversity** (Steve=taste, Elon=physics — optimal per MAD findings)

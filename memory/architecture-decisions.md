---
name: Architecture Decisions
description: Key design decisions for the Great Minds agency system — moderator pattern, claude-swarm integration, cron structure
type: project
---

## Moderator Pattern (decided 2026-04-01)
Added a Moderator agent between Human and Directors (Steve/Elon). Moderator is the admin agent in claude-swarm.

**Why:** Agents should resolve conflicts among themselves before escalating. Human should only see genuinely unresolvable issues and polished deliverables.

**How to apply:** All agent communication flows through the hierarchy. Moderator drives the state machine, mediates, and gates quality.

## claude-swarm Integration (decided 2026-04-01)
Built on top of github.com/sethshoultes/claude-swarm for tmux orchestration, git worktrees, and shared filesystem.

**Why:** claude-swarm already handles the hard infra problems (process isolation, agent messaging, status monitoring, staggered launches). No need to rebuild.

**How to apply:** launch.sh wraps claude-swarm, overrides prompts with Great Minds roles. Admin = Moderator, Worker1 = Steve, Worker2 = Elon, Worker3+ = sub-agents.

## Debate-then-Build Model (decided 2026-04-01)
Rounds 1-2 debate, Round 3 plan, Rounds 4-8 build, Round 9 review, Round 10 ship.

**Why:** Full 10-round debates waste cycles. 2 rounds is enough to align strategy. The remaining rounds are more valuable for actual production.

**How to apply:** After 2 debate rounds, directors hire sub-agents and shift to supervision mode.

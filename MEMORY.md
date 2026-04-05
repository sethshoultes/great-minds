# Great Minds Agency -- Shared Memory

## Agency Knowledge
- [Agency Identity](memory/agency-identity.md) -- Core operating principles and partner dynamics
- [Architecture Decisions](memory/architecture-decisions.md) -- Dispatch, debate-then-build, board pattern

## Project History
- [LocalGenius Learnings](memory/localgenius-learnings.md) -- First product: 265 files, 8 deliverables, 10 rounds
- [Operational Learnings](memory/operational-learnings.md) -- Consolidation, QA, agent economics

## Key Learnings

### Dispatch
- tmux send-keys dispatch FAILED -- unreliable, agents get stuck, no error recovery
- Agent tool with worktree isolation WORKS -- safe parallel execution, clean git state per agent
- Each agent gets its own worktree branch; merges happen through PRs

### Architecture
- Decoupled crons (bash + haiku) prevent bottleneck -- never run crons inside conversations
- In-memory state always loses data -- persist to DB, never use Maps for production state
- Hybrid AI router: Cloudflare Workers AI for fast/cheap, Claude for complex

### Process
- 2 debate rounds is the sweet spot -- enough to align, not so many it wastes cycles
- Establish canonical personas/facts as shared doc BEFORE parallel build
- Board of Directors pattern: 4 advisors + 1 tie-breaker (Marcus) works better than single reviewer
- GSD integration: wave-based execution with fresh context prevents context rot
- Feature branch workflow MANDATORY: all agents use branches + PRs, no direct pushes to main

### Content & Products
- Honesty pass: never market features that don't exist
- Shared Header/Footer in root layout prevents orphan pages
- Remotion for product videos -- 5 rendered, pipeline proven
- WordPress plugins (Dash, Pinned) ship faster in their own repos

### Agent Economics
- Haiku for sub-agents: conserves usage limits ~5x
- Only directors and orchestrator need Sonnet-class models
- 14 agents is current ceiling -- more creates coordination overhead

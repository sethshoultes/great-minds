# Great Minds Agency — Shared Memory

## Agency Knowledge
- [Agency Identity](memory/agency-identity.md) — Core operating principles and partner dynamics
- [CLAW Research](memory/claw-research.md) — OpenClaw, Nanobot, MAD patterns informing our architecture
- [Dream Research](memory/dream-research.md) — Auto Dream / memory consolidation patterns
- [Architecture Decisions](memory/architecture-decisions.md) — Moderator pattern, claude-swarm, debate-then-build

## Project History
- [LocalGenius Learnings](memory/localgenius-learnings.md) — First project complete. 195KB, 8 deliverables, 10 rounds.
- [Operational Learnings](memory/operational-learnings.md) — Consolidation, QA, architecture, and agent economics patterns

## Lessons Learned

### Process
- Establish canonical personas/facts as shared doc BEFORE parallel build (persona drift caught in review)
- 2 debate rounds is the sweet spot — enough to align, not so many it wastes cycles
- Creative reviewer role (James Park) is essential for cross-document consistency
- Self-correcting targets > defending aspirational numbers

### Consolidation
- Don't run two frontends for one product — consolidate into routes
- Shared Header/Footer in root layout prevents orphan pages
- Never market features that don't exist (honesty pass)

### QA & Testing
- Margaret Hamilton: QA must run continuously, not on-demand
- Jensen's board reviews: highest-ROI agent (13 reviews, found real bugs)

### Architecture
- In-memory state: always persist to DB, never use Maps for production state
- Hybrid AI router: Cloudflare Workers AI for fast/cheap, Claude for complex

### Agent Economics
- Haiku for sub-agents: conserves usage limits ~5x
- Only directors and moderator need Sonnet-class models

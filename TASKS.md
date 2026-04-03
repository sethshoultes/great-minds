# Great Minds Agency — Task Board

**Last dispatch**: 2026-04-03
**Dispatcher**: Phil Jackson (Orchestrator)

## How This Works
- Phil Jackson checks this file every 30 minutes
- Tasks are assigned to idle agents based on skill match
- Agents update status when starting/completing work
- Use feature branches + PRs for all code changes

## Task States
- `open` — Unassigned, ready for pickup
- `assigned` — Dispatched to an agent
- `in-progress` — Agent is actively working
- `review` — Work done, awaiting review
- `done` — Completed and merged/shipped
- `blocked` — Waiting on dependency or human input

---

## P0 — Critical

| # | Task | Assigned To | Status | Branch | Notes |
|---|------|-------------|--------|--------|-------|
| — | No P0s currently | — | — | — | — |

## P1 — High Priority

| # | Task | Assigned To | Status | Branch | Notes |
|---|------|-------------|--------|--------|-------|
| 1 | Data moat architecture (Jensen issue #1) | open | open | — | Architectural — needs design before code |
| 2 | Stripe live mode activation | open | open | — | Currently test mode, needs production keys |

## P2 — Normal

| # | Task | Assigned To | Status | Branch | Notes |
|---|------|-------------|--------|--------|-------|
| 3 | Additional E2E test coverage | open | open | — | Expand Playwright tests |
| 4 | Performance audit + optimization | open | open | — | Lighthouse scores, bundle size |
| 5 | SEO metadata for all pages | open | open | — | Open Graph, structured data |

## P3 — Nice to Have

| # | Task | Assigned To | Status | Branch | Notes |
|---|------|-------------|--------|--------|-------|
| 6 | Blog content expansion | open | open | — | More case studies, tutorials |
| 7 | Analytics dashboard | open | open | — | Usage metrics for admin |

---

## Completed

| # | Task | Completed By | Date | PR |
|---|------|-------------|------|-----|
| — | Phil Jackson added to AGENTS.md | Phil Jackson | 2026-04-03 | direct to main |

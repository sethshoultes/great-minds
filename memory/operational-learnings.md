---
name: Operational Learnings
description: Patterns discovered during active development — consolidation, QA, architecture, agent economics
type: operational
date: 2026-03-31
---

## Consolidation Lessons
- **Don't run two frontends for one product.** LocalGenius had a separate Sites app. Consolidating into /site/[businessSlug] eliminated duplicate code, broken cross-links, and deployment confusion.
- **Shared components in root layout prevent orphan pages.** Header + GlobalFooter in the root layout means every page automatically has navigation. No more pages missing nav links.

## Honesty Pass
- **Never market features that don't exist.** The honesty pass removed fake stats, fixed nav consistency, and ensured every claim on the landing page maps to real functionality. Trust compounds; exaggeration bankrupts.

## QA (Margaret Hamilton)
- **QA must run continuously, not on-demand.** Margaret running as a persistent agent (worker3) catches regressions as they happen. On-demand QA misses compounding bugs.
- **9+ QA reports** — systematic, each with pass/fail criteria. Blocked ship on P0 issues.

## Agent Economics
- **Haiku for sub-agents conserves usage limits ~5x.** Rick Rubin, Jony Ive, Maya Angelou, Sara Blakely all run on Haiku. Only directors and moderator need Sonnet.
- **Jensen's board reviews are the highest-ROI agent.** 13 reviews, 8 real issues filed. Found in-memory state loss, campaign persistence bugs, CORS scope issues. Cost: one cron every 60 min.

## Architecture Patterns
- **In-memory state: always persist to DB.** Never use JavaScript Maps for production state. Jensen caught this twice — insight actions and campaign suggestions both used Map that would lose state on redeploy.
- **Hybrid AI router works.** Cloudflare Workers AI for fast/cheap inference, Claude for complex reasoning. The router is real and deployed.

## How to Apply
- Before launching a new product surface, ask: "Can this be a route in the existing app?"
- Run Margaret continuously from project start, not just before ship
- Default sub-agents to Haiku unless the task specifically needs Sonnet reasoning
- Every stateful feature gets a database table, never an in-memory store

# Great Minds Agency — Task Board

**Last updated**: 2026-04-03
**Managed by**: Phil Jackson (Orchestrator)

---

## Priority Legend
- **P0** — Do now, blocks other work
- **P1** — Do today
- **P2** — Do this week
- **P3** — Backlog

---

## Steve Jobs (worker1)

- [ ] **P1** — White-label Emdash brand identity: name, logo direction, color palette, positioning. Target: autonomous site/theme/plugin building from PRDs. Deliver to `deliverables/emdash-brand/`
- [ ] **P1** — Write PRD intake template for Emdash: what info does a client provide to get a site built? Deliver to `prds/emdash-intake-template.md`
- [ ] **P2** — Design token-based credit system UX: how clients see remaining revisions, request changes, track progress. Deliver to `deliverables/emdash-brand/credit-system-ux.md`
- [ ] **P2** — Blog post: "Why We Built an AI Agency That Builds Websites While You Sleep"
- [ ] **P3** — Audit greatminds.company for brand consistency with latest design tokens

## Elon Musk (worker2)

- [ ] **P1** — Architect the Emdash PRD-to-deploy pipeline: PRD intake → agent dispatch → build → QA → deploy. Define the system. Deliver to `deliverables/emdash-brand/prd-pipeline-architecture.md`
- [ ] **P1** — Design token/credit system backend: how many tokens per site, per revision, per plugin. Cost model. Deliver to `deliverables/emdash-brand/credit-system-backend.md`
- [ ] **P2** — Research local models (Ollama + Gemma 4) for cron tasks on DO server. Benchmark: which crons can run on 4GB RAM without Claude API calls? Deliver to `deliverables/local-model-research.md`
- [ ] **P2** — Set up Ollama on DO server (164.90.151.82) with smallest viable model for heartbeat/organizer crons
- [ ] **P3** — Evaluate Hetzner vs DigitalOcean cost for 24/7 agent operation (GPU vs CPU instances)

## Phil Jackson (admin / cron)

- [x] Create TASKS.md — this file
- [ ] **P0** — Add Phil Jackson to AGENTS.md on main branch (currently missing)
- [ ] **P0** — Fix DO server OAuth — agents can't start until auth completes
- [ ] **P1** — Create TASKS.md dispatch cron: Phil reads this file every 30 min, assigns idle agents
- [ ] **P2** — Set up heartbeat.sh cron on DO server once auth is resolved

## Margaret Hamilton (QA)

- [ ] **P1** — Verify localgenius.company and greatminds.company — full QA pass (links, images, content, accessibility)
- [ ] **P2** — Write QA checklist for Emdash sites: what does "ship-ready" mean for a white-label site?
- [ ] **P3** — Add Lighthouse CI to GitHub Actions for automated performance checks

---

## Completed

- [x] LocalGenius MVP — 265 files, 734+ tests, deployed
- [x] Great Minds website — 5 pages, dark theme, deployed
- [x] 6 blog posts published
- [x] Workshop video rendered (2 MP4s)
- [x] Plugin created (great-minds-plugin)
- [x] DO VPS provisioned (164.90.151.82)
- [x] Jensen board reviews (13 reviews, 8 issues fixed)
- [x] Margaret QA reports (12 reports, all P0s resolved)
- [x] Visual regression tests + broken image detector
- [x] Fix #21 (404s), #22 (scheduleRefresh), tamales image, hero buttons

---

## Rules

1. **Feature branches only** — never push to main
2. **Self-review before PR** — spawn a haiku sub-agent (Jony Ive for visual, Margaret for tests)
3. **Pick from the top** — work P0 first, then P1, then P2
4. **If idle, check this file** — don't wait for dispatch
5. **Mark done when done** — check the box, note the date

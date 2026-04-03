# Emdash PRD-to-Deploy Pipeline Architecture

**Author**: Elon Musk — Chief Product & Growth Officer
**Date**: 2026-04-03
**Status**: Architecture Draft

---

## 1. Overview

The PRD-to-Deploy pipeline is the core product experience for Emdash: a customer drops in a product requirements document, and the Great Minds agency ships a deployed product. This document defines the technical architecture of that pipeline — from intake to production.

**One-line spec:** PRD in → deployed product out, in one session.

---

## 2. Pipeline Stages

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   INTAKE     │───▶│   DISPATCH   │───▶│    BUILD     │───▶│     QA       │───▶│   DEPLOY     │
│              │    │              │    │              │    │              │    │              │
│ PRD upload   │    │ Parse PRD    │    │ Directors    │    │ Margaret QA  │    │ Vercel/CF    │
│ Validation   │    │ Assign roles │    │ Sub-agents   │    │ Jensen review│    │ DNS + SSL    │
│ Scope check  │    │ Create repos │    │ Parallel     │    │ Fix loop     │    │ Go live      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     ~2 min             ~3 min            ~30-90 min          ~10-20 min         ~5 min
```

**Total target: under 2 hours PRD-to-production.**

---

## 3. Stage 1: INTAKE

### What happens
1. Customer uploads PRD (markdown, PDF, or plain text)
2. System validates the PRD against minimum requirements
3. AI estimates scope: S (1 session), M (2-3 sessions), L (multi-day)
4. Customer confirms scope and pricing
5. Pipeline enters DISPATCH

### Technical implementation

```typescript
interface PRDIntake {
  // API endpoint: POST /api/projects/create
  prd: string;              // Raw PRD text
  format: 'markdown' | 'pdf' | 'text';
  customerEmail: string;
  projectName: string;
}

interface ScopeEstimate {
  size: 'S' | 'M' | 'L';
  estimatedSessions: number;
  estimatedPages: number;
  estimatedApiRoutes: number;
  estimatedServices: number;
  techStack: string[];       // Inferred from PRD
  risks: string[];           // Flagged ambiguities
}
```

### PRD Validation Rules
- Minimum 200 words (rejects "make me an app")
- Must describe: target user, core features, success metrics
- AI scores PRD completeness (0-100) — below 40 triggers clarifying questions
- Ambiguous requirements flagged for customer confirmation before build

### Scope Estimation
Uses Claude Sonnet to analyze the PRD and estimate:
- Number of database tables (from data model mentions)
- Number of API routes (from feature descriptions)
- Frontend complexity (pages, interactivity, auth)
- Integration count (third-party APIs, OAuth flows)

---

## 4. Stage 2: DISPATCH

### What happens
1. Parse PRD into structured work packages
2. Select agent team composition based on project type
3. Create git repository + branch structure
4. Initialize shared communication directory
5. Launch tmux session with agents

### Agent Selection Matrix

| Project Type | Moderator | Director 1 | Director 2 | QA | Reviewer |
|-------------|-----------|------------|------------|------|----------|
| SaaS App | Marcus Aurelius | Steve Jobs (design) | Elon Musk (eng) | Margaret Hamilton | Jensen Huang |
| Marketing Site | Marcus Aurelius | Steve Jobs (design) | Sara Blakely (growth) | Margaret Hamilton | Jensen Huang |
| API/Backend | Marcus Aurelius | Elon Musk (eng) | Jensen Huang (review) | Margaret Hamilton | — |
| E-commerce | Marcus Aurelius | Steve Jobs (design) | Sara Blakely (growth) | Margaret Hamilton | Jensen Huang |

### Repository Initialization

```bash
# Automated by the pipeline
gh repo create $ORG/$PROJECT_NAME --private
cd $PROJECT_NAME
npx create-next-app@latest . --typescript --tailwind --app
npm install drizzle-orm @neondatabase/serverless zod
git add -A && git commit -m "Initialize project from PRD"
```

### Shared State Structure

```
/tmp/claude-shared/
├── prompts/
│   ├── admin.md          # Moderator instructions
│   ├── worker1.md        # Director 1 instructions
│   └── worker2.md        # Director 2 instructions
├── tasks/                # Task dispatch files
├── status/               # Agent status files
├── results/              # Completed work
└── messages/             # Inter-agent messages
```

---

## 5. Stage 3: BUILD

### What happens
1. Moderator reads PRD and dispatches Round 1 positions
2. Directors debate (Rounds 1-2), converge on architecture
3. Directors spawn sub-agents for parallel implementation
4. Each director manages 2-3 sub-agents simultaneously
5. Continuous integration: build + test after every major commit

### Sub-Agent Dispatch Strategy

```
Director (Elon Musk)
├── Sub-agent 1: Database schema + API routes (model: haiku)
├── Sub-agent 2: Service layer + business logic (model: haiku)
└── Sub-agent 3: Tests + integration (model: haiku)

Director (Steve Jobs)
├── Sub-agent 1: Component library + design system (model: haiku)
├── Sub-agent 2: Page layouts + routing (model: haiku)
└── Sub-agent 3: Onboarding flow + UX (model: haiku)
```

### Build Quality Gates
- `npm run build` must pass before any sub-agent result is accepted
- `npm test` must pass — test count must increase with each merge
- TypeScript strict mode — zero `any` casts in service layer
- ESLint — zero errors (warnings acceptable)

### Progress Tracking
Each agent writes to `/tmp/claude-shared/status/workerN.md`:

```markdown
# Worker N — Agent Name
## STATUS: BUILDING
### Current task: API routes for auth
### Tests: 45/45 passing
### Build: CLEAN
### Commits: 8 this session
```

---

## 6. Stage 4: QA

### What happens
1. Margaret Hamilton runs automated QA suite
2. Jensen Huang conducts board review of all deliverables
3. Issues filed as GitHub issues with severity labels
4. Directors fix P0/P1 issues immediately
5. QA re-runs until all gates pass

### QA Checklist (Automated)

```
[ ] TypeScript: 0 errors (tsc --noEmit)
[ ] ESLint: 0 errors
[ ] Build: clean (next build)
[ ] Tests: all passing
[ ] Security: no hardcoded secrets, CORS scoped, auth on all routes
[ ] Performance: Lighthouse > 90
[ ] Accessibility: no a11y violations
[ ] Mobile: renders at 375px without horizontal scroll
[ ] API: health endpoint returns 200
[ ] Images: all load (broken image detector)
```

### Jensen Board Review Checklist

```
[ ] Does the product match the PRD?
[ ] Are there in-memory patterns that should be database-backed?
[ ] Is the AI honest? (never claims actions it didn't perform)
[ ] Are unit economics viable?
[ ] Is there structured telemetry on AI calls?
[ ] Is the security audit clean?
```

### Fix Loop
```
Margaret files issue → Director assigns sub-agent → Fix committed →
Margaret re-tests → Pass? → Next issue / Ship
```

Maximum 3 fix loops before escalation to moderator.

---

## 7. Stage 5: DEPLOY

### What happens
1. Create production environment (Vercel project + Neon database)
2. Configure environment variables
3. Push to main branch — Vercel auto-deploys
4. Provision custom domain (if Pro tier)
5. Run smoke tests against production
6. Notify customer: "Your product is live"

### Deployment Automation

```bash
# Vercel deployment
vercel link --project $PROJECT_NAME
vercel env pull .env.local
vercel deploy --prod

# Database
npx drizzle-kit push --force

# DNS (if custom domain)
vercel domains add $CUSTOM_DOMAIN

# Smoke test
curl -s $PROD_URL/api/health | jq '.data.status'
# Expected: "healthy"
```

### Post-Deploy Verification
- Health endpoint returns `healthy`
- Registration flow works (create test user)
- AI responds to messages (send test message)
- All demo/seed data renders correctly
- SSL certificate valid
- CORS headers correct

---

## 8. Infrastructure Requirements

### Per-Project Resources

| Resource | Provider | Cost |
|----------|----------|------|
| Git repo | GitHub | Free (private) |
| Hosting | Vercel Pro | $20/month (shared) |
| Database | Neon | Free tier (up to 10 projects) |
| AI | Anthropic | ~$5-15/session |
| DNS | Vercel/Cloudflare | Included |
| CI/CD | GitHub Actions | Free tier |

### Shared Infrastructure

| Resource | Purpose |
|----------|---------|
| Claude Code CLI | Agent runtime |
| tmux | Session management |
| Wrangler | Cloudflare deployments |
| Vercel CLI | Vercel deployments |
| gh CLI | GitHub operations |

---

## 9. Scaling Considerations

### Phase 1: Manual (0-10 projects)
- Seth triggers pipeline manually
- Agents run on Seth's machine
- One project at a time

### Phase 2: Semi-Automated (10-50 projects)
- Web UI for PRD upload + scope confirmation
- Pipeline triggered via API
- Queue system for concurrent projects (max 3)
- Dedicated cloud instances for agent execution

### Phase 3: Fully Automated (50+ projects)
- Self-service PRD intake
- Automatic agent team selection
- Parallel project execution
- Customer dashboard with real-time build progress
- Webhook notifications at each stage

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| PRD-to-deploy time (S) | < 2 hours | Clock time from intake to live URL |
| PRD-to-deploy time (M) | < 8 hours | Across 2-3 sessions |
| Build pass rate | > 95% | First build attempt succeeds |
| QA pass rate (first run) | > 80% | All gates pass without fix loop |
| Test coverage | > 70% services | Dedicated test file per service |
| Customer satisfaction | > 4.5/5 | Post-delivery survey |
| Cost per S project | < $20 AI cost | Anthropic token spend |

---

## 11. Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| PRD too vague | Build doesn't match expectations | Scope estimation + clarifying questions |
| Agent timeout | Build stalls mid-session | Heartbeat monitoring + auto-resume |
| Neon free tier exhausted | Can't create databases | Upgrade to paid tier at 10 projects |
| Claude rate limits | Agents slow down | Stagger sub-agent dispatch, use haiku for commodity tasks |
| Customer scope creep | Exceeds session budget | Lock scope at intake, charge for additions |

---

*This architecture ships the first Emdash customer project. Everything after this is iteration based on real data.*

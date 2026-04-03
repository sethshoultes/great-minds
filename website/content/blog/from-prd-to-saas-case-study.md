---
title: "Case Study: From PRD to Live SaaS in 9 Days with AI Agents"
slug: from-prd-to-saas-case-study
description: "How our AI agent swarm turned a product requirements document into LocalGenius — a live SaaS platform with 265 files, 734 tests, multi-tenant architecture, and Stripe billing — in 9 days."
date: "2026-04-03"
author: "Seth Shoultes"
tags: ["case study", "LocalGenius", "AI agents", "SaaS", "Claude Code", "multi-agent"]
image: "/blog/placeholder.webp"
---

On March 25, 2026, I dropped a 12-page PRD into the Great Minds agency pipeline. Nine days later, LocalGenius was live — a fully functional SaaS platform for local business marketing with multi-tenant architecture, Stripe billing, AI-powered content generation, and 734 passing tests.

This is the unvarnished case study of how that happened, including the parts that didn't go smoothly.

## Day 1-2: The Debate Phase

The PRD described a platform that would handle digital marketing for local businesses — social media posting, review management, email campaigns, website generation, and AI-powered content creation. It was ambitious. The directors thought so too.

Steve Jobs focused immediately on the business owner's emotional experience. His position: "These people opened a restaurant because they love cooking, not because they love marketing. The product should feel like having a smart friend who handles the stuff you hate."

Elon Musk focused on the technical moat. His position: "Content generation is commoditized. The value is in the data flywheel — every interaction teaches the system about this specific business, making the AI smarter over time. Build the data layer first."

Two rounds of debate produced 14 blind spots in the PRD (documented in a separate post), settled the core architectural decisions, and established the brand direction: warm, conversational, zero jargon — but backed by serious data infrastructure.

Total cost for the debate phase: approximately $8 in API calls. Time: about 4 hours of agent work.

## Day 2-3: Planning and Team Assembly

After the debate, both directors entered planning mode. They defined sub-agent roles and wrote detailed agent definitions:

Steve hired:
- **Jony Ive** — UI/UX design system, component architecture, responsive layouts
- **Maya Angelou** — Copywriting, brand voice, onboarding flow content
- **Sara Blakely** — Business model validation, pricing strategy, customer journey

Elon hired:
- **Rick Rubin** — Technical architecture, database schema, API design
- **A growth strategist** — Go-to-market planning, feature prioritization

Each agent got a detailed brief: inputs (PRD sections + debate decisions relevant to their work), expected outputs (specific files and formats), and quality criteria. These briefs were written by the directors, not by me. I reviewed them and made one adjustment — adding a requirement that Rick Rubin's database schema support multi-tenancy from day one, not as a later migration.

## Day 3-7: The Build

This is where the swarm architecture earned its keep. Multiple agents worked in parallel across different parts of the codebase:

**Rick Rubin** designed and implemented the database layer first — 14 Drizzle ORM tables with PostgreSQL RLS for multi-tenancy. Every business-scoped table carries an `organization_id`, and JWT claims activate row-level security policies. This was the foundation everything else built on.

**Jony Ive** built the component library and page layouts. The conversation-first interface was his — a chat-like experience where business owners talk to their AI marketing assistant, and the system surfaces relevant data, suggestions, and action cards within the conversation flow.

**Maya Angelou** wrote all the copy — onboarding screens, empty states, error messages, email templates, and the AI system prompts that define how the marketing assistant communicates with business owners. Her work gave the product its personality.

The backend agents built 26 service files handling everything from AI content generation to Stripe billing to Google Business Profile integration. The frontend agents built 16 conversation components, digest views, and a business website generator.

**The parallel execution was critical.** While Rick was designing the database, Jony was building UI components with mock data. When the schema was ready, swapping mocks for real queries took hours, not days. This only works because the agents coordinate through PRs and shared conventions, not through synchronous communication.

### The Numbers During Build

- **PRs opened:** 47
- **PRs merged:** 41
- **PRs rejected and reworked:** 6
- **Margaret QA reports:** 38 during this phase alone
- **Jensen board reviews:** 8 (one every ~10 hours)
- **Average time from PR open to merge:** 22 minutes (with automated review)
- **Average time from PR open to merge:** 3 hours (when human review required)

## Day 7-8: Review and Polish

Steve reviewed the entire product for brand consistency and user experience. His feedback was specific and actionable:

- "The onboarding asks for the business address on step 3. By step 3, they haven't experienced any value yet. Move it to step 5, after they've seen what the AI can do."
- "The digest email uses the word 'metrics' four times. Replace with 'results' — our users don't think in metrics."
- "The empty state for the conversation view is a blank page with 'Start a conversation.' That's lonely. Show three example prompts they can click."

Elon reviewed for technical soundness and scalability:

- "The content generation endpoint doesn't implement rate limiting. A single user could drain our Anthropic credits in an hour."
- "The analytics rollup runs as a single query. This will timeout at scale. Break it into incremental aggregations on a cron."
- "No health check endpoint. Add one that validates database connectivity, API key validity, and Stripe webhook configuration."

Both directors' feedback generated 12 revision tasks that went back to the build agents. All 12 were completed and merged within 18 hours.

## Day 9: Ship

Deployment was handled by the DevOps agent using a straightforward Vercel + Neon PostgreSQL stack:

- **Vercel** for the Next.js application with edge functions
- **Neon** for serverless PostgreSQL with branching for preview deployments
- **Six Vercel cron jobs** for digest generation, review sync, analytics rollup, token refresh, engagement tracking, and data cleanup
- **Stripe** webhooks for subscription management

The deployment script runs preview deployments on PRs and production deployments on merge to main. The DevOps agent configured environment variables, DNS, and the CI/CD pipeline in GitHub Actions.

Final production verification: all API endpoints returning correct status codes, Stripe test transactions processing, AI content generation working with both Claude Sonnet (interactive) and Claude Haiku (batch), and the demo account seeded with realistic data for Maria's Kitchen.

## What Worked

**The debate phase saved days.** Catching the 14 blind spots before building started meant we didn't have to rearchitect mid-build. The multi-tenancy decision alone — made during debate, not discovered during build — saved what would have been a painful database migration.

**Parallel agent execution.** Frontend and backend agents working simultaneously, coordinating through shared conventions rather than direct communication, compressed the build timeline from weeks to days.

**Margaret's relentless QA.** 38 QA reports during the build phase caught regressions early. Her review cycle — run tests, check HTTP status codes, validate API responses — wasn't perfect (she missed visual bugs), but it prevented the codebase from accumulating technical debt during rapid development.

**Jensen's strategic reviews.** The board reviewer caught scope creep three times during the build. On review 5, he flagged that the agents were building an analytics dashboard that wasn't in the PRD and wasn't needed for launch. That single intervention saved an estimated 2 days of wasted work.

## What Didn't Work

**Visual testing gaps.** Margaret checked that pages loaded and APIs responded correctly. She didn't check that buttons worked, images rendered, or layouts looked right. We discovered broken UI elements during human review on Day 7 that should have been caught on Day 4.

**Agent context drift.** By Day 5, some agents had been running long enough that their context windows were filling up with old conversation history. Their output quality degraded — more repetitive code, less adherence to project conventions. The fix was periodic context resets with fresh system prompts, but we didn't implement this until we noticed the quality drop.

**Over-engineering in services.** The AI service file grew to handle content generation, review responses, social posts, email campaigns, SMS, SEO optimization, and digest narratives — all in a single file. The agents treated it as a natural place to add new AI functionality without considering file organization. A human architect would have split this into domain-specific service files earlier.

**Deployment environment variables.** The DevOps agent set up the deployment pipeline but couldn't test it end-to-end because it didn't have access to production credentials. The first production deployment failed because of three missing environment variables that worked in development but weren't configured in Vercel. This took 45 minutes of human intervention to resolve.

## The Final Tally

| Metric | Count |
|--------|-------|
| Source files | 265 |
| Tests (unit + integration) | 734 |
| Database tables | 14 |
| Service files | 26 |
| React components | 45+ |
| API routes | 20+ |
| Cron jobs | 6 |
| PRs opened | 47 |
| QA reports | 70+ |
| Board reviews | 19 |
| Days from PRD to production | 9 |
| Estimated API cost | ~$180 |

## What This Means

Nine days and $180 in API costs to build a production SaaS application is not normal. It's not even close to normal. A human team of comparable scope — frontend, backend, DevOps, QA, design — would measure this project in months and tens of thousands of dollars.

But the agents didn't replace a human team. They compressed the timeline by working 24/7, parallelizing tasks that a human team would do sequentially, and never taking breaks to check email or attend meetings. The human work was still there — writing the PRD, reviewing the debate output, making strategic decisions the agents flagged, handling deployment credentials, and doing the final quality pass.

The architecture for building this way is documented across this blog. The debate system, the cron-based reviews, the QA process, the agent personas — it's all open. The question isn't whether AI agent swarms can build real products. They can. The question is whether you've set up the systems to let them.

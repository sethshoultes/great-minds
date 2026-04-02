# LocalGenius

AI-powered digital presence platform for local businesses. One conversational interface replaces the 6-8 disconnected tools most small businesses juggle — website builder, social media scheduler, review manager, email marketing, SEO, analytics, booking, and local ads. The owner talks to LocalGenius like they'd talk to a marketing employee, and it handles the rest.

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** (enable via `corepack enable`)
- **PostgreSQL** — local Docker or [Neon](https://neon.tech) serverless instance

## Setup

```bash
# Clone and install
git clone <repo-url>
cd localgenius
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials (see .env.example for all required vars)

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The API runs at `http://localhost:3000`. Health check: `GET /api/health`.

## Project Structure

```
src/
  app/
    api/                    # Next.js App Router API endpoints
      auth/                 # Registration, login, token refresh
      onboarding/           # 5-step onboarding flow
      conversations/        # The single thread (core product)
      content/generate/     # AI content generation
      reviews/              # Review management + responses
      digest/               # Weekly Digest
      analytics/            # Metrics, attribution, benchmarks
      health/               # Health check
  api/
    middleware/             # Auth (JWT) + tenant (RLS) middleware
    routes/                # Additional route helpers
    integrations/          # External platform integrations (Google, Meta, Yelp)
  db/
    schema.ts              # Drizzle ORM schema (14 tables)
    migrations/            # Generated SQL migrations
    seeds/                 # Seed data for development
  services/               # Business logic (AI generation, review sync, digest builder)
  lib/                    # Shared utilities
  config/                 # App configuration
scripts/                  # Operational scripts
engineering/              # Architecture docs (tech-stack, data-model, api-design, infrastructure)
```

## Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Next.js API routes | Single deployable for 3 engineers (see `engineering/tech-stack.md`) |
| PostgreSQL + Drizzle ORM | Multi-tenant RLS, relational data model (see `engineering/data-model.md`) |
| Anthropic Claude | Sonnet 4.6 interactive, Haiku 4.5 batch. AI costs at 2.1% of revenue. |
| REST (not GraphQL) | Predictable query patterns, 2 screens, simpler for small team |

## API Reference

Full endpoint documentation: [`engineering/api-design.md`](engineering/api-design.md)

## Database Schema

14 tables with multi-tenant RLS. Full schema with rationale: [`engineering/data-model.md`](engineering/data-model.md)

Schema defined in: [`src/db/schema.ts`](src/db/schema.ts)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm db:generate` | Generate migration from schema changes |
| `pnpm db:push` | Push schema directly to database |
| `pnpm db:seed` | Seed development data |
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |

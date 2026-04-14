# Cloudflare Federation Strategy

**Document Version**: 1.0
**Status**: Active (Phase 1 Implementation)
**Decision Owner**: Elon Musk (Chief Product & Growth Officer)
**Date**: 2026-04-14
**Locked**: Decision 17 in Great Minds Agency debate

---

## Executive Summary

LocalGenius Sites is architected for multi-account federation from Day 1, even though Phase 1 uses a single Cloudflare account. This document explains:

1. **Current state (Phase 1)**: Parameterized configuration for single-account operations
2. **Future roadmap (Phase 2+)**: Federation strategy at 10K+ sites
3. **Why we decided this way**: 30 minutes of architecture investment now prevents a complete rewrite later
4. **Implementation details**: Environment variables, validation, and API wrappers

---

## Phase 1: Single Account, Parameterized Configuration

### Current Architecture (v1)

```
┌─────────────────────────────────────────────────────────────┐
│ LocalGenius Platform (Vercel + Neon)                        │
│  ├─ API routes handle onboarding, updates, payments        │
│  └─ Uses cloudflareConfig to provision sites               │
└────────────────────────┬────────────────────────────────────┘
                         │
                    CLOUDFLARE_ACCOUNT_ID
                    CLOUDFLARE_API_TOKEN
                    CLOUDFLARE_D1_DATABASE_ID
                    CLOUDFLARE_R2_BUCKET_NAME
                         │
┌────────────────────────▼────────────────────────────────────┐
│ Single Cloudflare Account                                  │
│  ├─ D1 Database: multi_tenant_sites (partitioned by site_id)│
│  ├─ R2 Bucket: localgenius-sites (partitioned by site_id)  │
│  ├─ Workers: site-router (routes {slug}.localgenius.site)  │
│  └─ DNS: localgenius.site zone (50K CNAME records at scale)│
└─────────────────────────────────────────────────────────────┘
```

### Configuration Flow

1. **Developer deploys**: Sets environment variables in Cloudflare Workers or Vercel
   ```bash
   CLOUDFLARE_ACCOUNT_ID=<id>
   CLOUDFLARE_API_TOKEN=<token>
   CLOUDFLARE_D1_DATABASE_ID=<db-id>
   CLOUDFLARE_R2_BUCKET_NAME=localgenius-sites
   ```

2. **Code loads config**: `cloudflare-config.ts` validates at import time
   ```typescript
   import { cloudflareConfig } from '@/lib/cloudflare-config';
   // Throws if CLOUDFLARE_ACCOUNT_ID is missing
   ```

3. **API calls use config**: All provisioning, updates, syncs use parameterized account ID
   ```typescript
   const response = await callCloudflareApi(
     getCloudflareApiUrl(`/accounts/${cloudflareConfig.accountId}/d1/database/${cloudflareConfig.d1DatabaseId}/query`),
     { method: 'POST', body: JSON.stringify(query) }
   );
   ```

### Multi-Tenancy Within Single Account

- **D1 Database**: One database, all sites partitioned by `site_id` column
  - Query: `SELECT * FROM sites WHERE site_id = 'slug-123'`
  - Benefits: Single migration path, centralized monitoring, unified access control

- **R2 Bucket**: One bucket, all files prefixed by `site_id`
  - Path: `s3://localgenius-sites/{site_id}/media/{filename}`
  - Benefits: Single bucket lifecycle policy, unified analytics, cost simplification

- **Workers**: One router Worker, routes all subdomains
  - Binding: Environment variable `CLOUDFLARE_D1_DATABASE_ID` points to single database
  - Handler: Router reads `site_id` from slug, queries D1, renders Emdash template

- **DNS**: One zone (`localgenius.site`), 50K CNAME records at scale
  - Records: `slug-1.localgenius.site` → `localgenius.site` (CNAME)
  - Single point of management (Worker catches all)

### Why Single Account for Phase 1?

1. **Operational simplicity**: One dashboard, one API token, one set of credentials
2. **Multi-tenancy proven**: Cloudflare D1 and R2 are designed for this
3. **Cost efficiency**: Shared infrastructure (DNS, Workers baseline costs) are amortized
4. **Speed to market**: No federation complexity during launch sprint
5. **Data isolation**: `site_id` partitioning provides logical isolation; physical separation is Phase 2

---

## Phase 2: Federation at 10K+ Sites (Future Roadmap)

### Trigger: When Do We Federate?

- **Threshold**: 10K+ active sites (not 10K users, 10K *distinct sites*)
- **Metrics that trigger**:
  - D1 query latency P99 exceeds 100ms despite indexing
  - Single account approaching API rate limits
  - Cost optimization opportunity: Separate hot/cold accounts
  - Geographic latency requirements (e.g., EU sites in EU account)

### Federated Architecture (Phase 2)

```
┌─────────────────────────────────────────────────────────────┐
│ LocalGenius Platform (Vercel + Neon)                        │
│  ├─ Routing service: Maps site_id → cloudflareAccountId    │
│  └─ API clients: One per account (injected at deploy time) │
└─────────────┬──────────────────────────────────┬────────────┘
              │                                  │
     ┌────────▼──────────┐          ┌──────────▼────────┐
     │ Cloudflare Account │          │ Cloudflare Account │
     │ (Western Cluster)  │          │ (Eastern Cluster)  │
     │                    │          │                    │
     │ Account ID: XXX    │          │ Account ID: YYY    │
     │ Zone: localgenius  │          │ Zone: localgenius  │
     │ Sites: 5K-7K       │          │ Sites: 3K-5K       │
     └────────────────────┘          └────────────────────┘
```

### Routing Strategy (Phase 2)

A routing service in the platform maps each site to its account:

```typescript
// In platform database (Neon)
interface SiteShardMap {
  site_id: string;           // e.g., "acme-pizza-sf"
  cloudflare_account_id: string;
  cloudflare_region: string; // "us-west" | "us-east" | "eu"
}

// Called during provisioning
async function getCloudflareAccountForSite(siteId: string) {
  const shard = await db.query(
    'SELECT cloudflare_account_id FROM site_shard_map WHERE site_id = $1',
    [siteId]
  );
  return shard.cloudflare_account_id;
}
```

### API Token Management (Phase 2)

Each account has its own token, stored in Vercel secrets:

```bash
# For Account 1 (Western)
CLOUDFLARE_ACCOUNT_ID_WESTERN=<account-id-1>
CLOUDFLARE_API_TOKEN_WESTERN=<token-1>
CLOUDFLARE_D1_DATABASE_ID_WESTERN=<db-id-1>

# For Account 2 (Eastern)
CLOUDFLARE_ACCOUNT_ID_EASTERN=<account-id-2>
CLOUDFLARE_API_TOKEN_EASTERN=<token-2>
CLOUDFLARE_D1_DATABASE_ID_EASTERN=<db-id-2>
```

Loaded at runtime:

```typescript
type CloudflareRegion = 'us-west' | 'us-east' | 'eu';

function getCloudflareConfigForRegion(region: CloudflareRegion) {
  const configs: Record<CloudflareRegion, CloudflareConfig> = {
    'us-west': {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID_WESTERN!,
      apiToken: process.env.CLOUDFLARE_API_TOKEN_WESTERN!,
      // ...
    },
    'us-east': {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID_EASTERN!,
      apiToken: process.env.CLOUDFLARE_API_TOKEN_EASTERN!,
      // ...
    },
    'eu': {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID_EU!,
      apiToken: process.env.CLOUDFLARE_API_TOKEN_EU!,
      // ...
    },
  };
  return configs[region];
}
```

### Terraform Infrastructure (Phase 2)

Parameterized Terraform modules create accounts on demand:

```hcl
# terraform/cloudflare-federation.tf
module "cloudflare_account_western" {
  source = "./modules/cloudflare-account"

  account_id      = var.cloudflare_account_id_western
  account_name    = "LocalGenius Western Cluster"
  region          = "us-west"

  d1_database_id  = cloudflare_d1_database.western.id
  r2_bucket_name  = cloudflare_r2_bucket.western.name
  worker_name     = "site-router-western"

  tags = {
    Environment = "production"
    Cluster     = "western"
    Capacity    = "7000-sites"
  }
}

# repeat for other regions...
```

### Migration Path (Phase 1 → Phase 2)

When we hit 10K sites and decide to federate:

1. **Week 1**: Provision new Cloudflare accounts (Eastern, EU)
2. **Week 2**: Deploy shard routing service to Neon
3. **Week 3**: Gradual migration: New sites → new accounts via shard map
4. **Week 4**: Rebalance existing sites (offline job, customers don't notice)
5. **Week 5**: Monitor, optimize, celebrate

**Zero user-facing downtime** because subdomains stay the same (`slug.localgenius.site` still works; only the Worker routing backend changes).

---

## Implementation Guidelines (Phase 1)

### Do's

✅ Always use `cloudflareConfig.accountId` in API calls (never hardcode)
✅ Use `getCloudflareApiUrl()` helper for endpoint construction
✅ Call `callCloudflareApi()` wrapper for error handling and retry logic
✅ Validate config at app startup (fail fast, not at provision time)
✅ Document any new Cloudflare API integrations with account ID reference

### Don'ts

❌ Never hardcode account IDs in code
❌ Never assume a single environment variable (use the helper functions)
❌ Never skip validation of `CLOUDFLARE_ACCOUNT_ID` at deployment
❌ Never use Cloudflare dashboard to create resources (use API + Terraform)

### Example: Provisioning a Site

```typescript
// BAD: Hardcoded account ID
const response = await fetch(
  'https://api.cloudflare.com/client/v4/accounts/abc123def456/d1/database',
  // ...
);

// GOOD: Uses parameterized config
import { cloudflareConfig, getCloudflareApiUrl, callCloudflareApi } from '@/lib/cloudflare-config';

const response = await callCloudflareApi(
  getCloudflareApiUrl(`/accounts/${cloudflareConfig.accountId}/d1/database`),
  { method: 'POST', body: JSON.stringify({ name: 'sites-db' }) }
);
```

---

## Cost Implications

### Phase 1 (Single Account)

- **D1**: $0.76/M rows (shared across all sites)
- **R2**: $0.015/GB (shared storage)
- **Workers**: $0.50/M requests (amortized across all sites)
- **Total**: ~$2K/month at 50K sites (highly efficient)

### Phase 2 (Federated Accounts)

- **D1**: ~$4K/month (4 accounts × 1M rows each)
- **R2**: ~$3K/month (higher due to replication)
- **Workers**: ~$2K/month per account
- **Total**: ~$15K/month (trade-off for latency + resilience)

**Decision**: Don't federate until latency demands it. Save $150K/year by staying in Phase 1 as long as possible.

---

## Monitoring & Observability

### Phase 1 Dashboards

1. **D1 Performance**
   - Query latency P99 (target: <100ms)
   - Row count by site_id (detect outliers)
   - Connection pool utilization

2. **R2 Performance**
   - Upload latency (target: <1s)
   - Bandwidth by site_id
   - Object count per bucket

3. **Workers Performance**
   - Routing latency P99 (target: <30ms)
   - Cache hit rate (target: >90%)
   - Error rate (target: <0.1%)

### Phase 2 Decision Criteria

Federate if ANY of these are true for 2+ consecutive weeks:

- D1 query P99 > 200ms
- API rate limit errors > 1/day
- R2 list operations > 5s
- Cost per site > $0.50/month
- Geographic latency P99 > 500ms

---

## References

- **Decision Document**: `/rounds/localgenius-sites/decisions.md` (Decision 17)
- **Config Module**: `/src/lib/cloudflare-config.ts`
- **Environment Template**: `/env.example`
- **Cloudflare API Docs**: https://developers.cloudflare.com/api/
- **D1 Multi-Tenancy**: https://developers.cloudflare.com/d1/platform/backups/

---

## Glossary

| Term | Definition |
|------|-----------|
| **Account ID** | Cloudflare account identifier (32 hex chars), found at https://dash.cloudflare.com/?account= |
| **API Token** | Bearer token for Cloudflare API, created at https://dash.cloudflare.com/profile/api-tokens |
| **Shard** | Logical partition of sites assigned to a Cloudflare account (Phase 2) |
| **Federation** | Distributing sites across multiple Cloudflare accounts (Phase 2+) |
| **Multi-tenancy** | Multiple sites sharing D1/R2 resources, isolated by `site_id` |
| **Provisioning** | Creating D1 database, R2 bucket, Worker, DNS record for a new site |

---

**Questions? Contact**:
- Architecture: Elon Musk (Chief Product & Growth Officer)
- Implementation: Engineering Team Lead
- Operations: DevOps / Infrastructure Team

---

*"Parameterize today. Federate tomorrow. Ship in 6 weeks."*

# Emdash Credit System — Backend Architecture

**Author**: Elon Musk — Chief Product & Growth Officer
**Date**: 2026-04-03
**Status**: Architecture Draft

---

## 1. Design Principles

1. **Credits are the unit of value, not tokens.** Customers don't care about input tokens vs output tokens. They care about "can I build another page?"
2. **Transparent consumption.** Every credit spend is logged and visible. No mystery charges.
3. **Never degrade quality.** When credits run low, show upgrade prompt — never switch to a worse model. (Jensen Board Review #2)
4. **Generous defaults.** The free/base tier should be enough to build something real. The upsell is more, not less.

---

## 2. Credit Model

### What is a credit?

One credit = one meaningful AI action. We abstract away the underlying token costs so customers think in outcomes, not infrastructure.

### Credit Pricing Table

| Action | Credits | Underlying Cost | Margin |
|--------|---------|----------------|--------|
| **Site generation** (full site from PRD) | 50 | ~$0.80 (Sonnet) | 94% |
| **Page creation** (new page on existing site) | 10 | ~$0.15 (Sonnet) | 93% |
| **Content revision** (edit existing page) | 3 | ~$0.04 (Llama) | 99% |
| **Image generation** (SDXL hero/promo) | 5 | ~$0.02 (SDXL) | 99% |
| **SEO audit** | 5 | ~$0.05 (Haiku) | 98% |
| **Social post draft** | 2 | ~$0.001 (Llama) | 99%+ |
| **Review response draft** | 1 | ~$0.001 (Llama) | 99%+ |
| **Voice transcription** | 1 | ~$0.0001 (Whisper) | 99%+ |
| **Sentiment analysis** | 0.1 | ~$0.000001 (DistilBERT) | 99%+ |
| **Conversation turn** (complex AI chat) | 3 | ~$0.005 (Sonnet) | 99% |
| **Plugin install** (Emdash marketplace) | 10 | $0 (code only) | 100% |
| **Custom domain** setup | 5 | ~$2.00 (CF for SaaS) | 60% at $79 |

### Why these numbers work

The average customer uses ~80-120 credits/month. At our pricing:

| Plan | Monthly Credits | Price | Cost to Serve | Gross Margin |
|------|----------------|-------|---------------|--------------|
| **Starter** | 100 | $0 (free) | ~$0.50 | N/A (acquisition) |
| **Base** | 500 | $29/mo | ~$2.50 | **91%** |
| **Pro** | 2,000 | $79/mo | ~$8.00 | **90%** |
| **Agency** | 10,000 | $299/mo | ~$35.00 | **88%** |

---

## 3. Credit Packs (One-Time Purchases)

For customers who need a burst without upgrading their plan:

| Pack | Credits | Price | Per Credit |
|------|---------|-------|------------|
| Starter Pack | 100 | $9 | $0.09 |
| Builder Pack | 500 | $39 | $0.078 |
| Launch Pack | 2,000 | $129 | $0.065 |

Credit packs never expire. Monthly plan credits reset each billing cycle.

---

## 4. Database Schema

```sql
-- Credit balances (one row per customer per type)
CREATE TABLE credit_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  plan_credits INTEGER NOT NULL DEFAULT 0,      -- Monthly allocation (resets)
  purchased_credits INTEGER NOT NULL DEFAULT 0,  -- Bought packs (never expire)
  used_this_period INTEGER NOT NULL DEFAULT 0,   -- Consumed this billing cycle
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Credit transactions (audit log)
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  business_id UUID REFERENCES businesses(id),
  amount INTEGER NOT NULL,           -- Positive = earned/purchased, negative = spent
  balance_after INTEGER NOT NULL,    -- Running balance
  action_type TEXT NOT NULL,         -- 'site_generation', 'page_creation', etc.
  description TEXT NOT NULL,         -- Human-readable: "Generated homepage for Maria's Kitchen"
  source TEXT NOT NULL,              -- 'plan_allocation', 'purchase', 'usage', 'refund'
  reference_id TEXT,                 -- Links to action/content/image ID
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_org ON credit_transactions(organization_id, created_at);
CREATE INDEX idx_credit_balances_org ON credit_balances(organization_id);
```

---

## 5. Credit Consumption Service

```typescript
interface CreditCheck {
  allowed: boolean;
  creditsRequired: number;
  creditsAvailable: number;
  source: 'plan' | 'purchased';  // Which balance is consumed first
  upsellMessage?: string;        // Show when < 20% remaining
}

// Before any AI action:
async function checkCredits(
  organizationId: string,
  action: CreditAction
): Promise<CreditCheck>

// After successful AI action:
async function consumeCredits(
  organizationId: string,
  businessId: string,
  action: CreditAction,
  description: string,
  referenceId?: string
): Promise<void>

// Credit actions map
const CREDIT_COSTS: Record<CreditAction, number> = {
  site_generation: 50,
  page_creation: 10,
  content_revision: 3,
  image_generation: 5,
  seo_audit: 5,
  social_post_draft: 2,
  review_response_draft: 1,
  voice_transcription: 1,
  sentiment_analysis: 0.1,
  conversation_turn: 3,
  plugin_install: 10,
  custom_domain: 5,
};
```

### Consumption Order

1. **Plan credits first** (they expire at period end anyway)
2. **Purchased credits second** (they never expire)
3. If both exhausted → show upgrade/purchase prompt, block action

### Refund Policy

- Failed AI calls: credits auto-refunded immediately
- Customer disputes: manual refund via admin panel
- Refunds add positive `credit_transactions` with `source: 'refund'`

---

## 6. Billing Integration (Stripe)

### Plan Credit Allocation

```typescript
// On subscription activation / renewal:
async function allocatePlanCredits(organizationId: string, plan: Plan) {
  const allocation = {
    starter: 100,
    base: 500,
    pro: 2000,
    agency: 10000,
  };
  
  // Reset period credits
  await db.update(creditBalances)
    .set({
      planCredits: allocation[plan],
      usedThisPeriod: 0,
      periodStart: new Date(),
      periodEnd: addMonths(new Date(), 1),
    })
    .where(eq(creditBalances.organizationId, organizationId));
}
```

### Credit Pack Purchase

```typescript
// Stripe checkout for credit packs
async function purchaseCreditPack(
  organizationId: string,
  pack: 'starter' | 'builder' | 'launch'
) {
  const packs = {
    starter: { credits: 100, priceId: 'price_starter_pack' },
    builder: { credits: 500, priceId: 'price_builder_pack' },
    launch: { credits: 2000, priceId: 'price_launch_pack' },
  };
  
  // After Stripe payment succeeds:
  await db.update(creditBalances)
    .set({
      purchasedCredits: sql`purchased_credits + ${packs[pack].credits}`,
    })
    .where(eq(creditBalances.organizationId, organizationId));
    
  await db.insert(creditTransactions).values({
    organizationId,
    amount: packs[pack].credits,
    balanceAfter: currentBalance + packs[pack].credits,
    actionType: 'credit_purchase',
    description: `Purchased ${pack} credit pack (${packs[pack].credits} credits)`,
    source: 'purchase',
  });
}
```

---

## 7. Usage Dashboard

### Customer-Facing Metrics

```
┌──────────────────────────────────────┐
│  Credits This Month                  │
│                                      │
│  ████████████░░░░░░  312 / 500       │
│                                      │
│  Top Usage:                          │
│  • 15 conversation turns (45 cr)     │
│  • 8 content revisions (24 cr)       │
│  • 3 social post drafts (6 cr)       │
│  • 1 site generation (50 cr)         │
│                                      │
│  Purchased credits: 87 remaining     │
│                                      │
│  [Upgrade to Pro →]  [Buy credits →] │
└──────────────────────────────────────┘
```

### Admin Metrics

- Credits consumed per organization per day
- Revenue per credit (tracks actual AI cost vs credit price)
- Upsell conversion rate (shown prompt → upgraded)
- Top credit consumers (candidates for Agency tier)
- Credit pack purchase frequency

---

## 8. Anti-Abuse Measures

| Measure | Implementation |
|---------|----------------|
| Rate limiting | Max 60 credits/hour per organization |
| Burst protection | Max 200 credits in 10-minute window |
| Minimum balance | Block actions below 0 credits (no negative balances) |
| Fraud detection | Flag organizations consuming > 3x plan allocation via packs |
| API key rotation | Rotate Anthropic/Cloudflare keys if abuse detected |

---

## 9. Cost Model Validation

### Scenario: 100 Base Plan Customers

```
Revenue:      100 × $29 = $2,900/month
Credits used: 100 × ~400 avg = 40,000 credits/month
AI cost:      40,000 × ~$0.005 avg = ~$200/month
Hosting:      Vercel Pro = $20/month
Database:     Neon free tier = $0/month
Total cost:   ~$220/month
Gross margin: $2,680/month = 92%
```

### Scenario: 10 Agency Customers + 50 Pro + 200 Base

```
Revenue:      (10 × $299) + (50 × $79) + (200 × $29) = $12,740/month
Credits used: (10 × 8000) + (50 × 1500) + (200 × 400) = 235,000 credits
AI cost:      235,000 × ~$0.005 = ~$1,175/month
Infrastructure: ~$200/month (Vercel + Neon + Cloudflare)
Total cost:   ~$1,375/month
Gross margin: $11,365/month = 89%
```

The economics are robust at every scale. The hybrid AI layer (Llama for drafts, Whisper for voice, DistilBERT for sentiment) keeps per-credit costs absurdly low. Only conversation turns (Claude Sonnet) have meaningful AI cost, and even those are ~$0.005 per turn with prompt caching.

---

## 10. Implementation Priority

| Phase | What | When |
|-------|------|------|
| P0 | `credit_balances` + `credit_transactions` tables | Week 1 |
| P0 | `checkCredits()` + `consumeCredits()` service | Week 1 |
| P1 | Stripe integration (plan allocation + pack purchase) | Week 2 |
| P1 | Usage dashboard (customer-facing) | Week 2 |
| P2 | Admin metrics dashboard | Week 3 |
| P2 | Anti-abuse rate limiting | Week 3 |
| P3 | Credit pack marketplace (Stripe checkout) | Week 4 |

---

*Credits are the business model. Get this right and everything else is growth.*

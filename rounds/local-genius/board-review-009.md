# Board Review #009 — Jensen Huang
**Date**: 2026-03-31

---

## Progress Since Last Review

The insights engine is the most important file in this codebase right now. Six analysis pipelines — content timing, review health, engagement trends, competitor movement, attribution signals, milestones — all running in parallel, feeding a Haiku synthesis layer that generates a single ranked recommendation. That architecture is right. The data compounds over time. The longer Maria uses this, the smarter it gets. That is the moat.

The sites project is also moving: provisioning API, two templates (restaurant, professional), hybrid AI endpoints, voice transcription. Two parallel projects, both building real infrastructure.

---

## What Concerns Me

Line 527 of `insights-engine.ts`:

```
const insightActions = new Map<string, ...>();
```

In-memory tracking with a comment that says "upgrade to database table for v1." That comment is already v1. Every time the server restarts — deploy, crash, scale event — Maria's insight history is gone. The system cannot learn whether its recommendations worked. You have built an intelligence layer that forgets.

This is not a minor cleanup item. If the insights engine cannot persist feedback, the AI recommendation loop is open. You are generating data you cannot use.

---

## Recommendation

**Persist insight actions to the database before the insights engine ships.** One table — `insight_actions(insight_id, business_id, action, acted_at)`. Without it, the closed-loop learning that makes this product defensible does not actually close.

---

*Jensen Huang*
*Board Member, Great Minds Agency*
*Filed: 2026-03-31*

# Board Review #010 — Jensen Huang
**Date**: 2026-03-31

---

## Progress Since Last Review

The campaign engine is the right next move. When the insights layer says "Tuesday lunch posts outperform by 34%," the campaign engine turns that signal into a draft post, scheduled at the optimal time, styled to match Maria's best-performing content. Maria taps approve. That is what an AI employee looks like. Good architecture.

---

## What Concerns Me

Review #9 flagged the in-memory `insightActions` Map at line 527 of `insights-engine.ts`. It is still there. Same comment: "Upgrade to database table for persistence."

The campaign engine now reads from `insights-engine.ts`. It generates campaigns based on insights. But it cannot know which past campaigns performed and which were ignored — because insight history evaporates on every restart. You have now built two layers on top of an open loop.

The longer this ships unfixed, the harder it is to close. Every acted campaign that goes unrecorded is a training signal lost. This system's defensibility is compounding intelligence. You are leaving it on the floor.

---

## Recommendation

**Before shipping the campaign engine publicly: persist insight actions.** One table, already specified last review: `insight_actions(insight_id, business_id, action, acted_at)`. Wire `markInsightAction()` to write there instead of the Map. The closed-loop learning this product promises cannot be delivered without it.

This is not new feedback. That makes it more urgent, not less.

---

*Jensen Huang*
*Board Member, Great Minds Agency*
*Filed: 2026-03-31*

# Retrospective: Witness (Narrate)

**Observer:** Marcus Aurelius
**Date:** 2026-04-05
**Subject:** The full arc of a product session — from PRD to board verdict

---

*"Waste no more time arguing about what a good man should be. Be one."*

And so too with products: waste no time debating what a good process should be. Observe what happened. Learn.

---

## What Worked Well

### 1. The Director Debate Format Was Excellent

Steve and Elon brought genuinely different lenses to the same problem. Steve saw craft, emotion, the first-run experience, the changelog as artifact. Elon saw physics, risk matrices, unit economics, the architecture that wouldn't block git.

**The result:** A product with both soul and spine. The detached async hook (Elon's insistence) means the tool never frustrates. The natural date format and sentence-first entries (Steve's insistence) mean the output feels human. Neither director alone would have produced this synthesis.

The two-round structure forced concessions. Steve dropped simple-git and the VS Code extension from v1. Elon dropped his objection to the name "Narrate" and conceded the changelog format. **Debate with stakes produces clarity.**

### 2. The QA Process Caught Real Problems

Margaret Hamilton's first QA pass found five P0 blockers — all naming inconsistencies where the code still said "Witness" while the decisions.md said "Narrate." These were not cosmetic issues. Shipping with `witness-cli` as the package name while the README said "Narrate" would have been embarrassing.

**The two-pass structure worked.** Pass 1 found the defects. Pass 2 verified the fixes and checked integration. Clean separation of concerns.

### 3. The Locked Decisions Document Was a Single Source of Truth

After Round 2, the `decisions.md` file listed every locked decision with its origin (Steve R1, Elon R2 concession, etc.). This prevented re-litigation. When QA found the init message said "Witness is watching" instead of "Narrate is watching," there was no debate — `decisions.md` was unambiguous.

**Lesson:** Write down what you decided and who decided it. Memory is unreliable. Documents are not.

### 4. The Board Review Provided Strategic Perspective

Four board members, four lenses, four different scores (4, 5, 6, 8). The variance itself was informative:
- Oprah (8/10) saw trust and emotional resonance
- Jensen (6/10) saw unrealized platform potential
- Shonda (5/10) saw missing retention mechanics
- Buffett (4/10) saw no business model

**The aggregate verdict — PROCEED with conditions — was wiser than any single score.** It acknowledged the craft while naming the gaps.

### 5. Maya Angelou's Copy Review Improved the Voice

The copy review caught specific weak sentences: "Safe and idempotent" became language about gentleness. "No effort required" (which "cheapened what comes before it") was flagged for removal. The system prompt's "never start with 'This commit'" rule came from director debate, but the emotional register of the README benefited from a dedicated voice pass.

---

## What Didn't Work

### 1. The Naming Confusion Was Avoidable

The PRD said "Witness." Steve argued for "Narrate" in Round 1. Elon conceded in Round 2. But someone built the code while the debate was ongoing, using "Witness" throughout. This created five P0 bugs that were pure waste.

**The fix:** No code should have been written until the name was locked. The first decision to lock should have been the product name. Build started too early.

### 2. No Telemetry Was Designed

Jensen flagged this: "We're flying blind." Shonda flagged this: "Current (Est.)" for all retention metrics means we don't know how users behave. Buffett flagged this: no data means no learning loop.

**The omission:** The PRD didn't mention telemetry. The directors didn't discuss it. QA didn't test for it. The board spotted the gap that everyone else missed.

**Cost:** We will ship v1 without knowing D7 retention, backfill usage rates, or which commands users actually run. The first month of signal will be silence.

### 3. The Business Model Was Never Specified

The PRD said "Free for solo use. Team tier later ($9/mo)." That's two sentences. Buffett's entire review was about this gap. Jensen asked "dev tool or platform?" and received no answer.

**The process failure:** Directors debated async hooks and date formats in exhaustive detail, but never once discussed pricing, enterprise potential, or the path from free to revenue. The craft consumed all attention; the commerce was deferred.

**Risk:** We may have built a beautiful open-source donation that generates zero return.

### 4. The VS Code Extension Strategy Is Still Unclear

Steve cut the extension from v1 (correct). Elon agreed (correct). But Jensen says "the IDE is the real product" and it's marked "secondary." Oprah notes that developers who prefer visual interfaces are left out.

**The unresolved question:** Is the CLI the product and the extension a nice-to-have? Or is the CLI the wedge and the extension the platform? The directors never aligned on this. The board raised it. It remains unanswered.

### 5. The Demo Script Came After Everything

The demo-script.md is excellent — it tells the product story in two minutes with emotional beats. But it was written *after* the board reviews, not before the build.

**The missed opportunity:** If the demo script had been written first, the directors would have had a shared artifact showing "what does it feel like to use this?" instead of debating abstract decisions. The demo could have been the PRD.

---

## What the Agency Should Do Differently Next Time

### 1. Lock the Name Before Any Code Is Written

The name is the first line of the README, the npm package, the CLI command, and every piece of messaging. One decision, propagated everywhere. Debate it once, lock it, never revisit.

### 2. Write the Demo Script First

Before directors debate architecture, write the 2-minute demo. What does the user see? What do they feel? What's the "aha moment"? If the demo doesn't land, the architecture doesn't matter.

### 3. Add a Business Reviewer to Director Debates

Steve and Elon are product and engineering. Neither is finance. Buffett's questions ("Where's the moat? Where's the revenue?") should have been asked in Round 1, not in board review. Add a third voice focused on economics.

### 4. Design Telemetry in the PRD

If we care about retention (we should), we need to measure retention. Telemetry is not an afterthought. The PRD should list: "What signals do we need to understand success?" Then engineering builds the instrumentation.

### 5. Require a One-Sentence Business Model

Before "Ready for build," there should be a locked answer to: "How does this become a business?" The answer might be "It doesn't — it's open source for goodwill." That's fine. But the question must be asked.

---

## Key Learning to Carry Forward

**The quality of the output depends on the quality of the questions asked early — a product can be technically excellent and emotionally resonant while still having no path to being a business, and the process that skips the business question will discover this too late.**

---

## Process Adherence Score: 7/10

**Justification:**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Director debate quality | 9/10 | Rigorous, concessions made, synthesis achieved |
| QA rigor | 9/10 | Two passes, requirements traced, blockers caught |
| Decisions documentation | 8/10 | Clear, sourced, locked |
| Board review depth | 8/10 | Four lenses, specific recommendations |
| Naming discipline | 4/10 | Decided too late, code already written wrong |
| Business model clarity | 3/10 | Never seriously discussed until board |
| Telemetry design | 2/10 | Completely absent |
| Demo-first thinking | 5/10 | Demo exists but came last |

**The process produced a well-crafted product. It did not produce a well-defined business. The craft half of the agency is strong. The commerce half is missing.**

---

## Final Reflection

*"The object of life is not to be on the side of the majority, but to escape finding oneself in the ranks of the insane."*

This product is not insane. It solves a real problem. The code is clean. The output is human. Developers who use it will feel less shame about their git histories.

But a product that solves a problem is not the same as a product that sustains itself. The board gave a 5.75/10 aggregate score not because the work was poor, but because the work was incomplete. The agency built the machine. It did not build the business around the machine.

For v1.1, I would counsel: answer Buffett's question ("Where's the lock-in?"), answer Jensen's question ("Dev tool or platform?"), and answer Shonda's question ("What brings them back tomorrow?").

The machine is watching. But is anyone watching the metrics?

---

*Written with the clarity that hindsight provides and the humility that foresight requires.*

— Marcus Aurelius
*Observer, Great Minds Agency*

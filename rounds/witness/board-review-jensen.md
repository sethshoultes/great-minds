# Board Review: Witness (Narrate)

**Reviewer:** Jensen Huang
**Role:** CEO, NVIDIA; Board Member, Great Minds Agency
**Date:** 2026-04-05

---

## Executive Summary

Solid developer tool with clean execution. The team shipped a working CLI that does exactly what the PRD specified. But I see a clever feature, not a company. Let me be direct about where this stands and what would change my mind.

---

## What's the Moat? What Compounds Over Time?

**Current moat: None.**

Right now, Narrate is a thin wrapper around Claude Haiku. The "intelligence" lives in Anthropic's API, not in our product. Any developer with an afternoon could rebuild this. The git hook pattern is public knowledge. The prompt is 18 lines.

**What could compound:**

1. **Corpus of commit-to-summary pairs.** If we logged (with consent) the diffs and the AI-generated summaries, we'd build a fine-tuning dataset. After 100K commits, we could train a specialized model that's faster, cheaper, and better at code summarization than generic Haiku. That's a moat.

2. **Repo-specific context accumulation.** Right now, every commit is summarized in isolation. If Narrate remembered the project's architecture, naming conventions, and past changes, summaries would get better over time. "Fixed the auth bug" becomes "Fixed the Safari logout bug introduced in commit abc1234 when we switched to JWT." That contextual memory compounds.

3. **Network effects from team tier.** If teams share a changelog feed, the data becomes more valuable aggregated. Cross-repo patterns emerge. "This change looks similar to a regression we saw in Repo X" — that's platform intelligence.

None of this is built today. The product is stateless.

---

## Where's the AI Leverage? Are We Using AI Where It 10x's the Outcome?

**Current AI usage: Correct but minimal.**

Yes, using AI to summarize diffs is the right call. A human spending 30 seconds to write a good commit message is replaced by AI spending 0.5 seconds and $0.0002. That's leverage.

But we're only using AI at the point of lowest value — summarizing what already happened. The 10x opportunity is using AI to **predict and prevent**, not just describe:

- **Pre-commit analysis:** "This change touches the auth module but you didn't update the tests. Want me to flag that?"
- **Semantic diff analysis:** "You're modifying the same function that caused the outage last week. High-risk change."
- **Cross-repo intelligence:** "This pattern has caused bugs in 3 other repos. Consider this alternative."

The current architecture is AI as a "narrator" — passive observer. The 10x architecture is AI as a "co-pilot" — active participant in the commit workflow.

---

## What's the Unfair Advantage We're Not Building?

**The IDE integration is the real product, and it's marked "secondary."**

The CLI is developer catnip — it's how you get the Hacker News launch. But the VS Code extension is where the moat lives:

1. **Real-time context:** In the IDE, we see the code *as it's being written*, not just the final diff. We could summarize intent, not just changes.

2. **Inline suggestions:** Imagine the extension suggesting commit message improvements *before* you commit, based on what it knows about your repo's conventions.

3. **Project memory:** The extension could maintain a vector store of the entire codebase. Every commit summary becomes contextually aware.

4. **Workspace intelligence:** Multi-repo understanding. "This change in Repo A will break the integration in Repo B."

The CLI is the hook. The IDE is the platform. We're treating the platform as an afterthought.

**Also missing: the GitHub Action.**

The PRD explicitly says "no GitHub Action (yet)" — but that's where the distribution is. Every open-source project wants a better changelog. A GitHub Action that runs on every PR and generates a human-readable changelog would spread virally. It's the wedge into teams, not the CLI.

---

## What Would Make This a Platform, Not Just a Product?

Today: Narrate is a **feature** — "AI commit summaries."

To become a **product**: Add the backfill, the team tier, the VS Code extension. Make the changelog a living document that teams actually read.

To become a **platform**:

1. **Open the changelog format as a standard.** `CHANGELOG.human.md` should be a spec, not just a file. Other tools should read and write it. If we own the format, we own the ecosystem.

2. **Build a "changelog API."** Teams should be able to query their changelog programmatically. "Show me all changes to the auth module in the last 30 days." "What broke between v2.1 and v2.2?" This is the foundation for AI-powered debugging.

3. **Create the aggregation layer.** Cross-repo changelogs for organizations. "What did the engineering team ship this week?" — answered automatically, with AI-generated executive summaries.

4. **Enable third-party integrations.** Slack notifications for changelog entries. Jira ticket linking. Linear sync. The changelog becomes the single source of truth for "what changed."

5. **Build the time-travel debugger.** If we have every commit summarized and contextualized, we can answer "when did this behavior change?" by searching natural language, not git blame.

The platform isn't "AI commit summaries." The platform is "organizational memory for code changes."

---

## Technical Assessment

**What's good:**
- Clean, minimal implementation. ~800 lines of actual code.
- Async hook execution — doesn't slow git. Smart.
- Fallback summarizer for offline mode — thoughtful.
- Backfill command — good for adoption.
- Proper error handling — never crashes git.

**What concerns me:**
- **No persistence layer.** Everything is in a single markdown file. No database. No vector store. No memory.
- **No caching.** Every commit hits the API. Same diff pattern = same API call = same cost.
- **No telemetry.** We have no idea how people use this. No learning loop.
- **Hard-coded to Anthropic.** The PRD says "Claude only for v1" but OpenAI, local models, etc. are obvious asks.

---

## Score: 6/10

**Justification:** Well-executed feature with clear utility, but no compounding advantage and missing the platform opportunity that would make this a business, not just a tool.

---

## Recommendations

1. **Immediately:** Add anonymous, opt-in telemetry to understand usage patterns. We're flying blind.

2. **Before launch:** Build the GitHub Action. It's the viral distribution vector.

3. **v2 priority:** Project memory — maintain repo context across commits. This is the moat.

4. **Strategic decision:** Decide if we're building a dev tool (compete on craft, stay small) or a platform (compete on data, go big). The current architecture supports only the former.

---

## The GPU Question

If this becomes a platform with cross-repo intelligence and real-time IDE integration, we're talking about:

- Embedding entire codebases into vector stores
- Real-time inference on every keystroke
- Training specialized models on commit data

That's a compute-intensive business. That's an NVIDIA customer.

The current product? It's API calls to someone else's GPU. Fine for v1. Not a business I'd invest in long-term.

Build the platform. Then we'll talk.

---

*— Jensen*

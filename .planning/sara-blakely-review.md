# Narrate — Customer Gut-Check Review
**Reviewer:** Sara Blakely (Growth Strategist, Great Minds)  
**Date:** April 5, 2026  
**Status:** Ready to build — but watch these sales signals carefully

---

## The Honest Truth: This Solves a Real Problem

**Would a developer pay for this?** Yes. But not the way you're thinking.

I've been in rooms with solo founders and small teams who live in the terminal. They all have the same moment of shame: three months later, they open their git log and it reads like a bad journal entry. "fix bug", "wip", "stuff", "idk anymore". Every one of them laughs about it. Every one of them has tried to fix it with culture/discipline and failed. **That's a pain point. That's real.**

The automation here is brilliant — don't make them write it, make the machine write it for them. They're in flow. They commit. The changelog writes itself. That's *actually* solving the problem, not just providing a tool to solve it.

---

## What Makes This Worth Money

### 1. The Asymmetry of Effort
A developer will write a terrible commit message because they're in flow and breaking flow costs more than a bad commit message. But they'll gladly let a machine write it for them *while they're still in flow*. This product doesn't fight human nature — it works around it.

**Real customer signal:** "I don't have to think about it" beats "I could write better messages if I tried."

### 2. The Output is Genuinely Useful (Not Just Data)
The changelog isn't for machines or audits. It's for *you* reading it three months later and actually understanding what happened. That's rare. Most tools generate logs for compliance, not comprehension. This generates logs for humans.

**Real customer signal:** They'll actually use it and recommend it because it solves the original problem (understanding the history), not because they feel obligated to document.

### 3. The Trust Factor: Plain English Matters
Developers don't trust autocomplete, code suggestions, or automated systems that make decisions *for* them. But they'll trust a system that *narrates* what they already did. It's reading the diff, not inventing features. That's a big psychological difference.

**Real customer signal:** "The AI just explains what I actually wrote" vs. "The AI is deciding what my code means" — massive trust difference.

---

## Where This Feels Like Engineering Vanity (Fix Before Shipping)

### 1. The Backfill Command is a Feature for Builders, Not Customers
`narrate backfill --last=90d` with cost preview and confirmation — that's great engineering. But let me ask: does a customer *want* to backfill their entire history? Or are they just going to run it once, see the cost, and cancel because their history is already messy?

**The real customer need:** "I want clean changelog going forward." Not "I want to fix three months of garbage."

**How to know:** Track adoption. If customers run backfill on day 1 and abandon it because the cost/effort math doesn't work, this feature is engineering vanity. If they skip it entirely and just want the hook working on day 2, you'll know the real need.

**Recommendation:** Ship the hook first. Backfill second. Measure which one people actually use. Then either remove backfill from v1 or realize it's a different product.

### 2. The Config is Over-Engineered for the First 100 Customers
Three fields in `.narraterc.json`: model, ignore, attribution. That's thoughtful. But the first 100 customers? They're going to:
- Accept the default model (Haiku is fine)
- Never touch the ignore list (most repos don't need it)
- Not care about attribution (it's a developer tool, not a brand play)

**The real customer need:** `narrate init` and forget about it. Zero config.

**How to know:** If zero customers modify `.narraterc.json` in the first month, you're carrying config overhead that's not solving a problem. 

**Recommendation:** Hardcode everything in v1. Add config fields in v1.1 when you see actual customer requests, not hypothetical ones.

### 3. The Offline Fallback is Defensive, Not Delightful
The offline fallback (rule-based sentence from diff headers) is smart engineering. It prevents failures and keeps the flow unbroken. Good. But it's also a trap.

Here's what will happen: A customer's API key will expire or they'll run out of credits. The fallback will kick in silently. They won't notice for days. Then they'll see an entry that says "Updated authentication logic in auth.js" and wonder if it was auto-generated or AI-generated. The ambiguity creates doubt.

**The real customer need:** Fail loud. "API key missing. Run `narrate config` to fix." Don't silently degrade.

**How to know:** If customers report "why are some entries different quality than others?" — you'll know the fallback is creating confusion instead of reliability.

**Recommendation:** Make the fallback an explicit opt-in feature for teams (v2). For v1 solo use, fail explicitly and loudly.

---

## The Gaps Between What's Built and What Customers Need

### 1. The Distribution Story is Weak
`npm install -g narrate-cli` works. But where's the *moment* that makes a developer discover this product exists?

Developer Twitter and Hacker News are fine communities, but they're not where this product wins. This product wins when:
- A solo founder is in their first month building, commits are messy, they ask "is there a tool for this?"
- A small team (2-5 devs) has one person who cares about clean history and wants to impose it without annoying the team
- A freelancer is sending client updates and wants their work history to look professional

**Real customer signals to watch:**
- "I found this through a friend who was using it" (word of mouth)
- "I saw someone post a screenshot of their CHANGELOG.human.md and it looked beautiful" (aesthetic virality)
- "We're using it as a habit replacement for writing better commit messages" (team discipline)

**Recommendation:** After you ship, spend a week in Discord communities (solo founder spaces, indie dev communities). Ask real people: "What would make you actually use this?" Don't assume HN will tell you.

### 2. The Pricing Model Doesn't Exist Yet
The PRD says "Free for solo use. Team tier later ($9/mo)."

But here's the trap: If it's free forever for solo use, you've created a product that people use and love but never pay for. Then when you try to add the team tier, they've already adapted to free. Behavior change is exponentially harder than pricing from day 1.

**Real customer signals:**
- Can solo developers afford $5/mo? Yes. Will they pay if the product is free? No.
- Will small teams pay for a shared changelog feed? Only if they already believe the product is valuable (from solo use). But that belief came from free.

**Recommendation:** Consider a hybrid:
- `narrate` command (free, open source) — the core hook + changelog
- `narrate team` tier ($9/mo) — shared feed + GitHub integration + API access
- But ship *something* paid in v1, even if it's optional. It signals that you believe in the product's value.

Or go full open source and monetize elsewhere (enterprise, GitHub integration, hosted dashboard). But don't build a free product with a "team tier coming soon" — those come never.

### 3. The VS Code Extension is Overdesigned
"Beautiful timeline sidebar" — great. But you're shipping a CLI tool first. The real customer is using `narrate log` in the terminal and committing to git multiple times a day. They're not switching to VS Code to look at a sidebar.

The extension is craft. Craft is good. But it's not a customer need. It's a *nice-to-have* after the core product works.

**Real customer signal:** If 80% of your users are running `narrate log --since=today` in the terminal every morning, ship the extension. If most users never touch the log command, kill the extension and rebuild based on how people actually use the tool.

**Recommendation:** Ship CLI + hook only in v1. Measure daily active usage of `narrate log`. If that's high, *then* build the extension. If it's low, the extension won't fix it.

---

## What's Actually Worth Money Here (The Core)

Strip away everything else. Here's what you're selling:

**A developer makes a commit. Without any effort on their part, a plain-English summary of what changed appears in a file in their repo.**

That's it. That's the product.

The system prompt is good. The offline fallback is smart. The config is thoughtful. But none of that is the *why* someone pays.

The *why* is: I commit. I stay in flow. The machine writes the history. My future self understands it.

Everything else is either:
1. **Essential to the core promise** (the hook engine, the AI, the changelog format)
2. **Nice-to-have but not critical** (backfill, config, extension)
3. **Defensive engineering** (offline fallback, hook conflict detection)

Focus on #1. Validate #2. Use #3 to prevent failure. Don't ship all three at the same weight.

---

## Build Recommendations

### Do This
- Ship `narrate init` + post-commit hook first. Make it bulletproof. The hook is the product.
- Use the exact system prompt from decisions.md. It's been argued well.
- Test on the great-minds repo immediately. Real dogfooding.
- After shipping, ask 10 real developers: "Did you use `narrate log` today? If yes, why. If no, why not?"

### Watch This
- **Backfill adoption:** If nobody uses it, remove from v2.
- **Config usage:** If nobody changes `.narraterc.json`, hardcode defaults in v2.
- **Log command daily usage:** If low, the hook alone is the product. If high, the extension becomes worth building.
- **API cost concerns:** If customers ask "how much will this cost in a busy week?", pricing becomes a sales issue.

### Don't Ship
- The VS Code extension in v1. Wait for signal.
- Paid tiers in v1 until you see what free customers actually use.
- GitHub Action in v1. Solo developers in the terminal are your first 100 customers, not GitHub workflows.

---

## The Honest Pitch (If I Were Selling This)

*"You commit code fifty times a week. You write terrible commit messages because you're in flow. Three months later, you read your history and understand nothing.*

*Narrate fixes this. You commit. It reads the diff. It writes a sentence. Your future self gets it.*

*One command to start. No decisions. No config. Just better history, automatically."*

That's the pitch. Everything else is noise until you've proven the core hook works and people use it.

---

## Confidence Level

**Would a real customer pay for this?** Yes. 7/10.

The core product is sound. The problem is real. The solution is elegant. The implementation is solid.

But pricing is uncertain, distribution is unmapped, and you're building features (backfill, extension) that may not matter. Focus ruthlessly on the hook. Measure ruthlessly after launch. Then expand based on what customers actually do, not what you predicted they'd want.

**Ship it. Measure it. Repeat.**

That's the Sara Blakely way — not "build it perfect," but "build it real, test it live, adjust fast."

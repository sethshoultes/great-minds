# Design Review: Phoenix Post

## Visual Hierarchy: FAILED

**Most important element is buried.**

Line 1: Title needs weight. "Phoenix: Building a System That Won't Stay Dead" — competent, not memorable.

Lines 3-5: Opening graf. 48 restarts mentioned. Good. But reads like log files, not narrative hook. "The daemon restarted 48 times in its first week" — passive. Weak verb. Should hit harder.

Line 5: "This is the story" — explaining what you're about to do is apologizing. Cut.

## Whitespace: INSUFFICIENT

**Code blocks suffocate the prose.**

Lines 27-33: First code block arrives too fast. No room to breathe after conceptual setup.

Lines 49-56: Auth detection code. 8 lines of TypeScript. No white space before or after. Walls of code create visual fatigue.

Lines 66-95: 30-line timeout function. Dominates the screen. Intimidates. Should be excerpted, not dumped whole.

Lines 105-122, 128-149, 156-183: Three more massive blocks back-to-back. Pattern becomes monotonous. Code should punctuate, not overwhelm.

**Solution:** Cut code blocks to essential 3-5 lines. Show the idea, not the implementation.

## Consistency: BROKEN RHYTHM

**Inconsistent section weight.**

Lines 7-20: "The tmux Attempt" — 13 lines. Light, fast, narrative clarity.

Lines 22-98: "The Failure Cascade" — 76 lines. Three nested subsections. Massive code dumps. Feels like different document.

Lines 100-228: "The systemd Solution" — 128 lines. Four subsections. Code-heavy again. Encyclopedic.

**The pattern breaks.** First section establishes story cadence. Next two abandon it for documentation.

Lines 229-250: Conclusion. Returns to narrative voice. But too late.

## Craft: UNFINISHED DETAILS

**Line 3:** "OOM kills. Hung agents. Auth expired silently." — Fragment rhythm works. But "Auth expired" not parallel. Should be "Expired auth" or "Silent auth expiration."

**Line 9:** "Every hour, a cron job would check" — passive tense weakens it. "Every hour, cron checked for new PRDs."

**Line 13:** "Solution attempt: Use tmux send-keys" — colon creates distance. "We tried tmux send-keys to pipe prompts into a persistent Claude session" — cleaner.

**Line 17:** "The Claude input buffer rejects send-keys commands" — anthropomorphizing. "send-keys commands fail in Claude's input buffer" — precise.

**Line 19:** "The lesson:" — explaining the lesson is preaching. Show it, don't label it.

**Line 28:** "```" — no language specified. Should be "```text" or "```log" for syntax highlighting.

**Lines 38-42:** Three paragraphs starting with numbers in bold. Visual noise. Should use H3 headers (###) for hierarchy.

**Line 214:** "```ini" — only code block with language specified. Inconsistent.

**Line 247:** "Building something that refuses to stay dead beats building something that never breaks" — first emotional payoff in 250 lines. Should arrive earlier.

## Changes Required

### 1. Rewrite opening (Lines 1-6)

**Current:** Passive log-file narration.

**Should be:**
```
# Phoenix

The daemon died 48 times in its first week.

OOM kills. Hung agents. Silent auth failures. Wrong directories. Dead code paths that only failed in production. Every death wrote another line to /tmp/daemon.log. Every line was a lesson in what breaks when you stop babysitting autonomous systems.

Here's what broke. What we built. What works now.
```

### 2. Trim code blocks (Lines 27-228)

**Remove entire functions.** Show only the critical line:

Lines 49-56 → Reduce to:
```typescript
if (result.includes("401") || result.includes("authentication_error")) {
  throw new Error("Authentication expired");
}
```

Lines 66-95 → Reduce to:
```typescript
const timer = setTimeout(() => reject(new Error("AGENT HUNG")), timeoutMs);
```

Lines 105-122 → Reduce to:
```typescript
if (existsSync(PID_FILE)) {
  const oldPid = readFileSync(PID_FILE, "utf-8").trim();
  process.kill(Number(oldPid), 0); // Process still running?
}
```

**Every code block: 3-5 lines maximum.**

### 3. Rebalance sections (Lines 22-228)

**Failure Cascade (Lines 22-98):** Cut from 76 to ~30 lines. One paragraph per failure mode. One code snippet per fix.

**systemd Solution (Lines 100-228):** Cut from 128 to ~50 lines. Move code details to appendix or link to source.

**Goal:** Consistent rhythm. Each section 20-40 lines. Story tempo, not documentation tempo.

### 4. Add subheadings (Lines 38-42)

Replace numbered bold paragraphs with proper hierarchy:

```
### Memory exhaustion from parallel agents
### Auth expiration with no detection
### Hung agents with no timeout
```

### 5. Strengthen conclusion (Lines 229-250)

**Line 247 insight arrives too late.**

Move to Line 250 as final beat:

```
The daemon still dies sometimes. Auth expires. Servers reboot. Agents hit unexpected errors.

The difference: recovery is automatic now.

Building something that refuses to stay dead beats building something that never breaks.
```

### 6. Consistency pass

- All code blocks specify language (```typescript, ```ini, ```text)
- All verbs active voice ("cron checked", not "would check")
- Remove all "The lesson:" and "Here's what" framing — trust reader
- Fix parallel structure in fragment lists

## What Makes It Quieter But More Powerful

**Cut 40% of code.** Show ideas, not implementation. Reader trusts you built it. Doesn't need proof.

**Cut all metacommentary.** Lines 5, 19, 247 first half — all explaining what you're doing. Stop narrating. Just do it.

**Elevate craft in prose.** Time spent trimming code blocks should go to sentence rhythm. Line 3 fragments work. Repeat that cadence.

**Whitespace between code.** Two blank lines before/after every code block. Let reader's eye reset.

**Consistent section weight.** 20-40 lines each. Predictable rhythm lets content breathe.

**Move the payoff up.** "Building something that refuses to stay dead" belongs in opening 100 words, not final sentence. That's your thesis. Lead with it.

---

**Final verdict:** Strong narrative instinct buried under documentation impulse.

**Trust the story.** Cut 40%. Add space. Strengthen opening. Ship.

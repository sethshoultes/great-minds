# Round 2 — Steve Jobs
## Project: Witness
## Date: 2026-04-05

---

> "The best design is the one you don't have to explain."

Elon came with math. Elon came with a risk matrix and an idiot index and a cost-per-commit breakdown. I respect all of that. When the engineering is undeniable, you concede and move forward. I will do that here in several places.

But there are things on this list where Elon is optimizing for the wrong variable. And that's where I push back.

---

## CONCESSIONS — Where Elon Is Right

Let me get these out of the way cleanly, because I mean them.

**I concede the VS Code extension from v1.** I actually said this first, in Round 1. Elon is asking me to defend it or drop it — I dropped it in Round 1. We agree. Ship the CLI. The extension is v1.1 or v2. Done.

**I concede `simple-git`.** Elon's argument is clean: it's a wrapper around two lines of `child_process`. I was never attached to the dependency — I care about the output, not the implementation. Drop it. If the diff extraction is correct and the code is readable, native `child_process` is better. Less surface area, nothing to audit, nothing to update.

**I concede tone configuration.** I said this in Round 1 as well — cut it. One fewer field in the config. One fewer user expectation to manage. Ship with one voice that's been carefully tuned, not with a dropdown that implies multiple voices are equally good.

**I concede the 3-second constraint framing.** Elon's math holds. A hard wall that gets violated 15% of the time trains developers to distrust the tool. "P95 under 3 seconds" is honest. The async architecture — detached child process, git returns immediately — is the right solution. The hook cannot block the terminal. This is non-negotiable. We agree on the outcome. We agree on the implementation. No more debate needed here.

**I concede the git hook append logic.** His point about Husky and commitlint is right. These tools are everywhere. If `witness init` blows away an existing hook, we will get a flood of bug reports on day one and a reputation problem that's hard to shake. Detect, append, warn. Ten lines of code. Ship it.

---

## WHERE I PUSH BACK

### 1. The name "Witness" is still wrong. This is not a small thing.

Elon hasn't addressed the naming question at all. He's called it "Witness" throughout Round 1 as if the debate is settled. It isn't.

I said in Round 1: when a developer hears "Witness," they think of a courtroom. They think of something watching them for liability. The emotional register is wrong.

Elon's argument for keeping "Witness" is silence — he hasn't made one. That's not a counter-argument, it's inertia.

My position is unchanged: **Narrate** is better. The CLI reads naturally. `narrate init`. `narrate log`. `narrate backfill`. Every command sounds like something a person would say. The product is narrating your work history. The name is the action the product performs. That's how the best product names work.

I understand there are practical naming concerns — npm availability, trademark searches — but those are research tasks, not arguments against the name itself. If "Narrate" isn't available, we find the next best option. But we don't default to "Witness" by accident.

This matters. The name is the first thing on the README. It's what developers say when they recommend the tool. "Have you tried Narrate?" vs "Have you tried Witness?" — the first one sounds like something you'd recommend to a friend. The second one sounds like a subpoena.

**Decision requested:** We need to pick a name before build starts. I'm holding my position on Narrate until Elon gives me a real argument.

---

### 2. `witness backfill` is a v1 feature. Elon is right about the value. He's wrong about one thing.

This is where Elon had a genuinely good idea that I didn't have. The backfill command is the viral hook. "Run one command and your entire git history becomes readable" — that's the demo that converts. That's the tweet. I was wrong to fold it into the VS Code "Generate missing" feature. Elon's instinct to make it a CLI command is correct.

**But here's the detail Elon missed:** the backfill needs a cost preview before it runs.

If someone runs `narrate backfill` on a repo with 2,000 commits, they might accidentally spend $2.00 without expecting it. That's not a disaster — Elon's math says $0.001/commit — but it's a surprise, and surprises erode trust. The command should show something like:

```
  narrate backfill --last=90d

  Found 87 commits without changelog entries.
  Estimated cost: ~$0.09 (87 commits x $0.001)

  Continue? (y/n)
```

That's one confirmation dialog. It solves the surprise problem entirely. It also demonstrates that we've thought about the user. Small things like this are what separate tools people love from tools people tolerate.

The backfill limit should default to the last 90 days, not a commit count. "Last N commits" is an engineering-centric framing. "Last 90 days" is a human-centric framing. Users think in time, not in commit counts.

---

### 3. The offline fallback is not acceptable in its current form. Full stop.

The PRD says the fallback is: *"Modified 3 files: auth.js, config.ts, README.md"*

Elon flagged this too — he says it needs to be better. We agree on the problem. We disagree on how urgently it needs to be solved.

Elon frames it as a risk mitigation for API key friction. I frame it as a product quality issue regardless of the API key situation.

Here is why: the offline fallback is the first thing a developer sees if their API key isn't set up yet. It's also what they see when the Anthropic API goes down. It's also what appears in their `CHANGELOG.human.md` when the network times out during a flight.

A file list entry in a changelog that's supposed to be beautiful and human-readable is an ugly scar. It doesn't look like the other entries. It looks like an error. It says: "This tool failed and here's what it could scrape together."

The fallback needs to at least produce a sentence. Even a simple one. We have the diff and the commit message without any API call. With those two things, we can extract:
- The primary file changed (from the diff header)
- The nature of the change (add/remove/modify based on diff stats)
- The intent (from the commit message itself)

A rule-based system that produces: *"Updated authentication logic in auth.js and config.ts"* is dramatically better than *"Modified 3 files: auth.js, config.ts, README.md."* The first is a sentence. The second is a log dump.

The emotional hook I described in Round 1 — the moment a developer feels *seen* by their own record — dies completely if every fourth entry is a file list. The experience needs to be consistent.

---

### 4. The GitHub Action timing — Elon says v1.1. I say prove v1 first.

Elon wants the GitHub Action at v1.1, not v2. His argument is that it removes local installation friction and opens the path to teams and enterprise. I understand that.

But here is the problem: we haven't validated that the entries are actually good yet. We haven't run this on real repos. We haven't seen what the model does with an unhelpful commit message like "fix stuff." We haven't tuned the system prompt through real usage.

If we ship a GitHub Action before we know the output quality is consistent, we're broadcasting poor-quality entries at scale, in public repos, with a footer that says "Generated by Witness." That's a reputation risk, not a growth strategy.

My position: **ship the CLI, dogfood it on this repo for two weeks, tune the system prompt through real usage, then ship the GitHub Action.** The two-week delay is not about slowing down — it's about not advertising mediocrity.

Elon's instinct on the growth mechanic is right. The execution order is wrong.

---

### 5. The "Generated by Witness" footer — I want to talk about what it says.

Elon says: add a `Generated by Witness` footer link to `CHANGELOG.human.md`. Free viral marketing. He's right that it works — every tool that does this gets some amount of "what is this?" discovery traffic.

I have one change to propose.

The footer should be something a developer is *proud* to leave in their repo, not something they tolerate because it's the default. There's a difference between:

```
*Generated by Witness — https://witness.dev*
```

and:

```
*Narrated by Narrate — your code, in plain English*
```

The first reads like a watermark. The second reads like a craft note. A developer leaving the second in their repo is implicitly saying: "I care about the quality of my history." That's an identity statement. People don't remove identity statements.

Make the attribution feel like a badge, not a label. And make it opt-out, not opt-in — but design it so that opting out feels like removing something you actually want.

---

### 6. The config file — Elon's 3-field version vs my position

Elon wants 3 fields: `model`, `ignore`, `maxDiffLines`. He reversed himself on `ignore` mid-round (correctly), conceding it's useful for lockfiles.

I want to simplify further. Here's my final config position:

```json
{
  "ignore": ["package-lock.json", "yarn.lock", "*.min.js"]
}
```

That's it. One field. `model` can be changed via an env var (`WITNESS_MODEL`) if someone needs to swap it — but 98% of users will never need to. `maxDiffLines` is an implementation detail that should be in the docs, not the config. `ignore` is a genuine user need — no developer wants their lockfile changes generating changelog noise.

One field. Clean. Honest. Extensible later.

---

## THE SYSTEM PROMPT — This Deserves More Attention Than Either of Us Gave It

The PRD has the system prompt in one line: *"Summarize this diff in one plain-English sentence as if explaining to a teammate."*

This will produce mediocre output. Not bad. Mediocre. The difference between mediocre and excellent in LLM tools lives entirely in the system prompt, and we are shipping a product where the *output quality is the product*.

Here is the system prompt I want to test:

---

*You are generating a changelog entry for a developer's project history. Read the git diff and commit message below. Write exactly one sentence in plain English that describes what changed and, if the commit message explains why, include the reason. Rules: Start with a verb. Never start with "This commit" or "This change." Use specific names from the code when they add clarity. Never invent behavior that isn't in the diff. If the diff is a dependency update (lockfile, package.json version bump), say so briefly. Keep it under 20 words when possible.*

---

The additions that matter: "Start with a verb" eliminates a class of weak entries. "Never invent behavior" directly targets the hallucination risk Elon flagged. "Under 20 words when possible" creates editorial pressure toward precision.

This is not a polished system prompt — it needs testing on real diffs. But it's a better starting position than what's in the PRD. The agency should treat system prompt iteration as a first-class task, not a one-liner in the spec.

---

## THE CHANGELOG FORMAT — I Will Not Yield On This

Elon didn't push back on the changelog format. Maybe he agrees with me. Maybe he doesn't care. I care.

The PRD format:
```
## 2026-04-05 07:36
**abc1234** — Refactored the user auth flow...
```

This is a machine writing a document that a human will read for years. It needs to feel like a human wrote it.

My format:
```
Apr 5, 2026 — 7:36 AM

  Refactored user auth to use JWT tokens, fixing the Mobile Safari
  logout bug.  ·  abc1234
```

The differences:
- Natural date, not ISO. Humans read "Apr 5" faster than "2026-04-05."
- The sentence is the hero. The hash is the footnote.
- Breathing room. One blank line between date and entry. One blank line between entries.
- The hash is dimmed (in the terminal), not bold. It's metadata, not content.

This is the file that will live in repos on GitHub. When someone clicks into a repo they've never seen and opens `CHANGELOG.human.md`, the first three seconds of reading will tell them everything about whether this tool is worth trusting. Those three seconds need to feel *crafted*.

---

## SUMMARY OF ROUND 2 POSITIONS

| Question | Steve's Call |
|----------|-------------|
| Name | **Narrate** — holding position. Need Elon to counter. |
| simple-git | **Cut** — conceding to Elon |
| VS Code extension | **v1.1** — conceded in Round 1, confirming now |
| Async hook architecture | **Detached child process** — full agreement |
| Backfill command | **v1, CLI-first** — agreed with Elon, adding cost preview + 90-day default |
| GitHub Action | **v1.2** — after two weeks of CLI dogfooding, not v1.1 |
| Git hook conflicts | **Detect and append** — full agreement |
| Config fields | **One field: ignore** — more aggressive than Elon |
| Offline fallback | **Must produce a sentence**, not a file list |
| System prompt | **Needs real engineering** — proposed v2 above |
| Changelog format | **Natural dates, sentence-first, hash as footnote** |
| Attribution footer | **Opt-out badge, not opt-in watermark** |

---

## WHAT WE BUILD IN ONE SESSION

After all of this, the v1 scope is:

1. `narrate init` — installs detached async post-commit hook. 3 lines of output. Quiet confidence.
2. Post-commit hook — `child_process` diff extraction, Anthropic SDK call, `CHANGELOG.human.md` append with crafted format.
3. `narrate backfill` — last 90 days, cost preview, confirmation dialog, then batch processing with rate limiting.
4. `narrate log` — pretty-prints the changelog in terminal. No raw markdown. Designed for the terminal.
5. Offline fallback — rule-based sentence, not file list.
6. System prompt — engineered, not one-liner.
7. One-field config — `ignore` only.
8. `CHANGELOG.human.md` format — natural dates, sentence-first, attributon footer.

That fits in one session. It proves the value. It's something I would be proud to put my name on.

---

The machine that watches and writes is still the right idea. Let's make sure the machine writes beautifully.

---

*[STEVE] — Round 2 complete.*

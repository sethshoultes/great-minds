# Round 2 — Elon Musk
## Project: Witness
## Date: 2026-04-05

---

> "If you need more than one sentence to explain your product, your product is too complicated."

Steve came back with craft notes and concessions. The concessions were clean — no hedging, no "well actually." I respect that. He dropped simple-git, dropped tone config, dropped the VS Code extension from v1. Good. Now let me address where he pushed back and where he's right, wrong, or half-right.

---

## CONCESSIONS — Where Steve Is Right

I don't enjoy conceding. I do it when the data says I'm wrong.

**I concede the naming question. "Narrate" is better.** Steve asked me to counter-argue for "Witness" and I can't, because I never cared about the name — I cared about shipping. But he's right that the name is the first thing on the README and the last thing in the tweet. `narrate init` reads like English. `witness init` reads like a legal proceeding. The CLI ergonomics alone settle this. Ship it as Narrate. Move on.

**I concede the backfill cost preview.** Steve's addition is correct. The confirmation dialog with estimated cost is 15 lines of code and eliminates the surprise-bill vector. At $0.001/commit the actual cost is trivial, but the *perception* of unexpected spending is not trivial. Users who feel surprised by a charge — even a small one — leave one-star reviews. The cost preview is cheap insurance.

The 90-day default instead of commit count is also the right framing. I was thinking like an engineer (N commits). Steve was thinking like a user (how far back in time). Users win.

**I concede the offline fallback needs to produce a sentence.** Steve's example — "Updated authentication logic in auth.js and config.ts" vs "Modified 3 files: auth.js, config.ts, README.md" — is the right comparison. A file list in a changelog that's supposed to be readable is a broken window. The rule-based system doesn't need to be smart — it needs to not be ugly. Parse the commit message, extract the primary verb, combine with the top-changed file. That's achievable without any AI and it's dramatically better than a file dump.

**I concede the changelog format.** Steve's format is better:

```
Apr 5, 2026 — 7:36 AM

  Refactored user auth to use JWT tokens, fixing the Mobile Safari
  logout bug.  ·  abc1234
```

Natural dates over ISO dates. Sentence first, hash last. Breathing room between entries. I didn't push on this in Round 1 because I didn't think it mattered. Steve convinced me it does. The changelog is the product's permanent artifact — it lives in repos for years. If it looks machine-generated, people treat it like noise. If it looks crafted, people treat it like documentation. The format is not cosmetic. It's a trust signal.

---

## WHERE I PUSH BACK

### 1. The config — one field is too aggressive. Three fields is the right number.

Steve wants one field: `ignore`. He says `model` can be an env var and `maxDiffLines` belongs in docs, not config.

He's wrong on `model`. Here's why: env vars are invisible. A developer who sets `NARRATE_MODEL` six months ago forgets they set it. When they switch machines, the tool behaves differently and they don't know why. Config files are visible, versionable, and shareable. If two devs on a team need to use the same model, they commit `.narraterc.json` and it's done. Env vars create silent divergence.

`maxDiffLines` I'll yield on — Steve can have that one. Hardcode at 500, document it, revisit if anyone complains.

Final config:

```json
{
  "model": "claude-haiku-4-5-20251001",
  "ignore": ["package-lock.json", "yarn.lock", "*.min.js"]
}
```

Two fields. Not one, not six. The model field has a sensible default that 95% of users never change. But the 5% who do — the ones who want to run Sonnet for higher quality, or who need to pin a specific version for reproducibility — those are power users you don't want to lose. Give them the lever. It costs nothing.

### 2. GitHub Action timing — v1.1 is right. Steve's two-week wait is emotional, not rational.

Steve says: ship the CLI, dogfood for two weeks, tune the prompt, *then* ship the GitHub Action. His argument is that bad output at scale in public repos is a reputation risk.

The logic sounds reasonable. But let's actually examine it.

If the output quality is bad enough to be a reputation risk in a GitHub Action, it's also bad enough to be a reputation risk in every developer's `CHANGELOG.human.md` that gets pushed to GitHub. The CLI output and the Action output use the same model, same prompt, same format. There is no quality difference between local and CI.

The two-week dogfooding period is valuable. I support it. But the GitHub Action doesn't need to wait for dogfooding to *start development*. The Action is a thin wrapper around the same core logic. Build the CLI, build the Action in parallel, dogfood the CLI, and ship both when the prompt is tuned. The development work is independent. The release timing can be coordinated.

My position: **develop the GitHub Action during the dogfooding period. Ship it at v1.1, which is ~2 weeks after v1, not ~4 weeks.** Steve gets his quality gate. I get my growth channel. Nobody waits unnecessarily.

### 3. The attribution footer — Steve's version is better. But make it configurable.

Steve proposed:

```
*Narrated by Narrate — your code, in plain English*
```

vs my original:

```
*Generated by Witness — https://witness.dev*
```

His version is better. "Narrated by" is elegant. The tagline reinforces the product identity. It reads like a credit, not a watermark. I'll take the L on this one.

One addition: the footer should be in the config as well. Not as a customizable string — that's overengineering — but as a boolean: `"attribution": true`. Default true. Users who want to remove it can set it to false. No friction, no guilt. This is how Plausible handles their analytics badge. It works.

Wait — that's three fields now. Fine. Three fields:

```json
{
  "model": "claude-haiku-4-5-20251001",
  "ignore": ["package-lock.json", "yarn.lock", "*.min.js"],
  "attribution": true
}
```

That's the final config. Three fields, all with sensible defaults, all serving a real use case. Done.

### 4. The system prompt — Steve's version is good. I have two additions.

Steve proposed a substantially better system prompt than the PRD's one-liner. The key rules — "Start with a verb," "Never start with 'This commit'," "Never invent behavior" — are exactly the constraints that produce consistent output. I agree with all of them.

Two additions:

**Add: "If the commit message is unhelpful (e.g., 'fix', 'wip', 'stuff'), rely entirely on the diff. Do not echo the commit message."** This handles the most common failure case. Developers who write bad commit messages are the primary users of this tool. If the model just parrots "Fixed stuff" because the commit message said "fix stuff," the tool has failed. The diff is always more truthful than the message. Teach the model that.

**Add: "If the diff only adds or removes test files, say so explicitly: 'Added tests for [component]' or 'Removed tests for [component].'"** Test changes are the second most common commit type after feature work, and they have a predictable shape. Giving the model a template for this case will produce dramatically more consistent output.

Final system prompt:

---

*You are generating a changelog entry for a developer's project history. Read the git diff and commit message below. Write exactly one sentence in plain English that describes what changed and, if the commit message explains why, include the reason. Rules: Start with a verb. Never start with "This commit" or "This change." Use specific names from the code when they add clarity. Never invent behavior that isn't in the diff. If the commit message is unhelpful (e.g., "fix", "wip", "stuff"), rely entirely on the diff and do not echo the commit message. If the diff only adds or removes test files, say so explicitly. If the diff is a dependency update (lockfile, package.json version bump), say so briefly. Keep it under 20 words when possible.*

---

That's a prompt that handles the four most common commit types: features, fixes, tests, and dependency updates. It's testable. Ship it, iterate.

### 5. `narrate log` — needs one more flag.

Steve listed `narrate log` in the v1 scope. I agree. But the `--since=yesterday` filter I originally proposed cutting should stay. Here's why I reversed:

The command is a markdown parser. The `--since` flag is date math on the entry headers. That's 20 lines of code. The value is that a developer starts their day by running `narrate log --since=yesterday` and sees exactly what they shipped. That's the daily ritual that turns a tool into a habit. Habits create retention. Retention is the only metric that matters for a free tool.

Cut the flag and you have a tool people use once. Keep it and you have a tool people use every morning.

---

## THE REMAINING DISAGREEMENT — What This Debate Is Actually About

Steve and I agree on 90% of this product now. The remaining 10% is a philosophical difference worth naming:

**Steve optimizes for the moment a developer *feels* something.** The first-run experience. The changelog format. The attribution footer. The name. Every decision he makes is filtered through: "Will the user feel pride, delight, or recognition?"

**I optimize for the moment a developer *keeps using it*.** The async architecture. The growth loop. The GitHub Action. The backfill hook. Every decision I make is filtered through: "Will this still be installed in 30 days?"

These aren't contradictory. They're complementary. Steve's craft gets people to install it. My engineering gets them to keep it. The product needs both.

The debate is over. We agree on enough to build.

---

## SUMMARY OF ROUND 2 POSITIONS

| Question | Elon's Final Call |
|----------|-------------------|
| Name | **Narrate** — conceding to Steve |
| simple-git | **Cut** — agreed from Round 1 |
| VS Code extension | **v2** — agreed from Round 1 |
| Async hook architecture | **Detached child process** — agreed |
| Backfill command | **v1, CLI-first, with cost preview + 90-day default** — agreed with Steve's additions |
| GitHub Action | **v1.1 — develop during dogfood, ship at ~2 weeks** — still disagree with Steve's v1.2 |
| Git hook conflicts | **Detect and append** — agreed |
| Config fields | **Three fields: model, ignore, attribution** — Steve wants one, I want three |
| Offline fallback | **Sentence-based, rule-driven** — agreed |
| System prompt | **Steve's base + two additions** (unhelpful messages, test files) |
| Changelog format | **Natural dates, sentence-first** — conceding to Steve |
| Attribution footer | **Steve's version, opt-out boolean** — agreed with modification |
| `--since` flag | **Keep in v1** — reversed my Round 1 cut |

---

## WHAT WE BUILD

The v1 scope, final:

1. `narrate init` — detached async post-commit hook, detect existing hooks, 3-line output
2. Post-commit hook — `child_process` for git, Anthropic SDK for AI, crafted changelog format
3. `narrate backfill --last=90d` — cost preview, confirmation, batch with rate limiting
4. `narrate log` and `narrate log --since=yesterday` — terminal-formatted, no raw markdown
5. Offline fallback — sentence-based, rule-driven, no file lists
6. System prompt — engineered with specific rules for common commit types
7. Config — three fields with sensible defaults
8. `CHANGELOG.human.md` — natural dates, sentence-first, opt-out attribution footer

Ship it. Dogfood it. Then ship the GitHub Action.

---

*[ELON] — Round 2 complete. Decisions ready for lock.*

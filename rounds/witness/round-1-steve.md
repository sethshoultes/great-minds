# Round 1 — Steve Jobs
## Project: Witness
## Date: 2026-04-05

---

> "The machine watches. The machine writes. You stay in flow."

That line is in the PRD. That line is the product. Everything else is either in service of that line or in the way of it.

Let me tell you what I think.

---

## 1. NAMING — "Witness" Is Wrong

"Witness" is poetic. I'll give it that. A witness watches. A witness records. The metaphor holds technically. But it fails emotionally.

When a developer hears "Witness," they think of a crime. A courtroom. Testimony under oath. That's the wrong register entirely. It's heavy. It's adversarial. It suggests the tool is watching you — not *for* you.

The best product names do one of two things: they describe an action with such clarity that you instantly know what the product does (Dropbox), or they evoke a feeling so precisely that you want to be the kind of person who uses this product (Slack didn't describe anything — it felt like the absence of friction).

"Witness" does neither. It's a placeholder dressed up as a name.

Here's what this product *actually does*: it narrates your work. It turns code changes into human language. It gives your history a voice.

Names worth fighting for:

- **Chronicle** — clean, obvious, slightly elegant. Your commit history becomes a chronicle. Developers would say "check the Chronicle." Solid, not inspired.
- **Scribe** — a scribe writes what happens. Ancient, but the best names often are. `npm install -g scribe-cli`. I like saying that.
- **Narrate** — a verb, which I love. `narrate init`. `narrate log`. The CLI reads beautifully. "Narrate is watching your commits." Yes.
- **Ledger** — factual, permanent, trusted. A ledger never lies. Accounting metaphor, but it works for devs. Clean.

My vote: **Narrate**. The tagline writes itself: *"Your code, in plain English."* The CLI feels natural. The VS Code extension is "Narrate Timeline." It's a verb, which means it implies action, agency, forward motion. The machine is doing something *for* you, not just watching.

"Witness" is the name you use when you haven't found the right name yet. Keep looking — or commit to Narrate. I'm committing to Narrate for this paper.

---

## 2. DESIGN & UX — This Can Be Beautiful or It Can Be Forgettable

The core interaction of this product happens in two places: the terminal and VS Code. Get both right and developers will love it. Get either one wrong and it's just another npm package they tried once.

### The Terminal

The `witness log` output in the PRD shows this:

```
## 2026-04-05 07:36
**abc1234** — Refactored the user auth flow to use JWT tokens instead of session cookies, fixing the logout bug on mobile Safari.
```

That's markdown. Rendered in a terminal, markdown is noise. The `##` and `**` render as literal characters — not formatting. This is a fundamental mistake. The terminal output needs to be designed *for the terminal*, not ported from a markdown file.

What it should look like:

```
  Apr 05, 07:36  abc1234
  Refactored user auth to use JWT tokens, fixing the Mobile Safari
  logout bug.

  Apr 04, 23:11  f3a9c02
  Added rate limiting to the /api/checkout endpoint after load
  testing revealed it could be DOS'd with 50 concurrent requests.
```

Notice what I removed: the markdown syntax. The `##`. The `**`. Notice what I added: breathing room. Indentation. A visual rhythm. Each entry has the same shape. Your eye knows where to look. The date and hash are secondary — dimmed in a real terminal. The sentence is primary — full width, wrapped cleanly. This is the difference between a tool that was designed and a tool that was built.

The `--since=yesterday` filter is good. `witness log --since=yesterday` reads naturally. Keep it.

### The Init Experience

`witness init` runs in under 2 seconds — the PRD says this, and it's a real constraint I respect. But the *experience* of those 2 seconds matters.

Most CLI tools vomit a wall of text during init. Spinner, checkmarks, log lines nobody reads. Don't do that.

The init should feel like this:

```
  Narrate is watching.

  Hook installed in .git/hooks/post-commit
  Changelog will appear in CHANGELOG.human.md

  Make your next commit to see it work.
```

Three lines of output. One line of invitation. The whole experience takes 4 seconds to read, 2 seconds to run, and it lands with quiet confidence. That's design.

### The VS Code Extension Timeline

This is the part of the PRD I'm most excited about — and most worried about.

The sidebar panel idea is right. Developers live in VS Code. Putting the timeline there is the right call. But the PRD describes it as "renders CHANGELOG.human.md as a beautiful timeline" and then lists a bunch of features. That's not a design. That's a feature list wearing a design's clothes.

What makes this *beautiful* specifically:

The timeline needs a visual heartbeat. Each entry should feel like a card — small, contained, readable in 3 seconds. The timestamp is small and muted. The commit hash is monospaced and clickable (the PRD has this right). The summary is the thing — it should be in a proportional font, not monospaced. That distinction alone separates "developer tool" from "product people actually love."

The search/filter is right to be in there. Do not make it a full-screen takeover. It should be a single input at the top of the panel, filtering inline, no modal, no separate view. Instant. Like Spotlight. Any friction here kills the experience.

---

## 3. WHAT MAKES IT GREAT — The Emotional Hook

Here it is. The one thing.

The first time a developer commits code — not to test the tool, just as part of their normal workday, having forgotten they installed this — and they see a sentence appear in their changelog that perfectly describes what they just did, they will feel something. They will feel *seen*. Not by the tool. By themselves. The tool will have held up a mirror to their own work and said: "Look. This is what you built today."

That is the emotional hook. Not productivity. Not documentation. Not compliance. Recognition.

Developers are builders. Builders want a record of what they built. They just don't want to write it themselves because writing is hard and context-switching is expensive. Narrate removes the friction without removing the feeling. You still get the record. You still feel the satisfaction of a day's work made legible. The machine just does the transcription.

This is why the offline fallback in the PRD is more important than it seems. "Modified 3 files: auth.js, config.ts, README.md" — that's not the emotional hook. That's a file list. If the API is unavailable, the fallback needs to still try to say something *human* about what changed. Even something simple. Even just: "Updated authentication and documentation." Not a file list. A sentence. Always a sentence.

The first commit is everything. That's the product's first impression. We need to make it perfect.

---

## 4. WHAT TO CUT — Ruthlessly

The PRD's Non-Goals list is good. Web dashboard, team sync, GitHub Action — all correctly deferred. I'd go further.

**Cut the VS Code extension from v1.**

I know how that sounds. Let me explain.

The CLI is the product. The VS Code extension is a beautiful layer on top of the product. But right now the CLI doesn't exist. The extension can't exist before the CLI is proven. And if we try to build both simultaneously, we'll build both badly.

The core loop — init, post-commit hook, API call, markdown append — that's the entire value proposition. Ship that. Let developers use it for two weeks on real repos. See what they ask for. Maybe they don't want the VS Code extension — maybe they want a `--json` output flag so they can pipe it into their own tools. Maybe they want GitHub Actions integration more than VS Code. We don't know. The CLI will tell us.

The extension can be v1.1. Two weeks later.

**Cut the `.witnessrc.json` `tone` field.**

"Casual" vs what? Formal? The PRD only mentions "casual" as a tone option. If there's only one tone, there's no configuration — there's just a default. Remove the field. Adding it back later is trivial. Shipping a config field with one meaningful value is a lie that trains users to distrust your config.

**Cut the `maxDiffLines` configuration from user-facing config.**

This is an implementation detail masquerading as a user option. What developer knows the right value for `maxDiffLines`? None of them. Pick a number (500 is fine), hardcode it, mention it in the docs, and move on. Users who need to change it can open an issue. Then you'll know if it's actually a problem worth solving.

**Cut "Generate missing" from the VS Code extension (when v1.1 ships).**

Backfilling old commits sounds useful. It is actually a trap. The API cost of running Haiku on 500 old commits is non-trivial. The user who hits that button without understanding the cost will be angry. The user experience of an unexpected bill is a disaster. Unless there's a hard cap and a confirmation dialog, don't ship it. And if you need a hard cap and a confirmation dialog, the feature is already too complex for v1.

---

## 5. THE CRAFT LAYER — The Details Nobody Sees (Until They Do)

The changelog format is the product's most persistent artifact. Every developer who uses this tool will have a `CHANGELOG.human.md` in their repos forever. It will be on GitHub. It will be committed alongside their code. It represents this product in perpetuity.

That file needs to be *beautiful to read*. Not beautiful the way a design mockup is beautiful. Beautiful the way a well-edited book is beautiful — where you don't notice the craft because it's so right.

A few specific craft notes:

**Dates.** The PRD shows `## 2026-04-05 07:36`. ISO format dates are correct for machines. For humans, `April 5, 2026 at 7:36 AM` is better. Or even just `Apr 5 — 7:36 AM`. The format sets the tone of the entire document. ISO dates say "this was generated by a script." Natural dates say "this is a record of my work."

**The entry line.** The PRD shows: `**abc1234** — Refactored the user auth flow...` The bold hash is a markdown convention, but it buries the sentence. The sentence is the thing. Consider: `> Refactored the user auth flow to use JWT tokens, fixing the Mobile Safari logout bug. \`abc1234\`` — put the sentence first, the hash last, in code ticks. The visual hierarchy matches the information hierarchy.

**The system prompt for Claude.** The PRD gives this verbatim: *"Summarize this diff in one plain-English sentence as if explaining to a teammate."* This is fine. But the system prompt is a lever. The quality of the output lives entirely in the system prompt. It needs iteration. The phrase "as if explaining to a teammate" is good. Consider adding: "Start with a verb. Never start with 'This commit'. Never use jargon." Small additions. Huge difference in output consistency.

**The terminal spinner during the hook.** The post-commit hook runs async — which is the right call, it shouldn't block git. But does the developer know it ran? Does it give any feedback? A silent hook is slightly unsettling. Consider a subtle line that appears and disappears: `[narrate] Writing changelog...` — dimmed, below the git output. Confidence that something is happening. Nothing more.

**The first line of the README.** The PRD says: "Your git history, in plain English." That's good. That's actually very good. Don't mess with it. Ship it exactly like that.

---

## 6. DISTRIBUTION — The "1000 Songs in Your Pocket" Moment

The iPod didn't succeed because it held 1000 songs. It succeeded because we told people they could hold 1000 songs in their *pocket*. The pocket was the idea. The constraint that made it magical.

Narrate's equivalent: **your entire project history in one sentence per commit.**

That's not about what the tool does. That's about what the tool gives you. Every project, forever, has a human-readable story. Open `CHANGELOG.human.md` on any repo you haven't touched in six months and you'll know what it does in 30 seconds. That's the idea.

The distribution strategy in the PRD is correct but too passive:
- Twitter, HN, Indie Hackers — yes, all of these
- `npm install -g` — yes, obviously

But here's what's missing: **dogfooding as marketing.**

The moment this tool ships, the Great Minds repo should be using it. The changelog should be public. Every commit message should be visible. When we tweet about this tool, we link to our own `CHANGELOG.human.md` running live on the repo. People read it. They see how it works. They want one. That's the demo that converts.

The animated terminal demo on the landing page is right but insufficient. The demo needs to show a *real* diff — something that looks like actual work, not a sanitized fake. If the fake diff is `console.log('hello')` becoming `console.log('hello world')`, nobody believes the tool. If the fake diff is a 40-line auth refactor that produces one precise, intelligent sentence — that's credibility.

**The Hacker News post writes itself:** "I was tired of my git history being unreadable, so I built a tool that uses Claude to auto-generate changelog entries from every commit. Here's the CHANGELOG.human.md for the project itself, written entirely by the tool." Ship it. Post it. The product demonstrates itself by existing.

One more thing: the file name `CHANGELOG.human.md` is clever but awkward to say out loud. "The human changelog" — that phrase is good. The file name is a mouthful. Consider `STORY.md` or `HISTORY.md`. "Our git story." "Check the history file." Simpler. More confident.

---

## My Bottom Line

This product has a genuine insight at its core: the moment of committing is the moment of least patience, and that's a tooling problem, not a culture problem. That's true. I believe it. It's worth building.

But right now it's trying to be two products: a CLI tool and a VS Code extension. Ship one first. Ship it insanely well. Then ship the other.

The name needs to change. The changelog format needs to be designed, not just specified. The init experience needs to be crafted like a product launch, not an npm script.

If we do those things — if we get the first-run experience right, the output format right, the terminal aesthetics right — developers will love this. They'll put it in their dotfiles. They'll recommend it to their teams. They'll write about it.

The machine that watches and writes is a beautiful idea. Let's make sure the machine is beautiful too.

---

*[STEVE] — Round 1 complete. Elon, the floor is yours.*

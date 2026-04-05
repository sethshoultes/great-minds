# Narrate Demo Script
*Runtime: ~2 minutes*

---

**[SCREEN: A developer staring at a git log. Rows and rows of commit messages: "fix bug", "update stuff", "WIP", "asdfasdf", "final final v2"]**

NARRATOR: Six months ago, you built something. You remember it was clever. You remember it fixed that thing with the auth tokens that was driving everyone crazy.

**[SCREEN: Cursor scrolling through more commit history. "misc changes", "testing", "please work"]**

NARRATOR: But *which* commit was it? What did you actually *do*?

**[SCREEN: Developer opens a file, squints, closes it. Opens another. Closes it.]**

NARRATOR: You could read every diff. You could reconstruct your own thought process from six months ago like some kind of code archaeologist.

**[SCREEN: Clock spinning. Coffee cup emptying. Sun setting through office window.]**

NARRATOR: Or... you could've been writing it down the whole time.

**[SCREEN: Terminal. Clean. Ready.]**

NARRATOR: This is Narrate.

**[SCREEN: Types `npm install -g narrate-cli` — installs cleanly]**

NARRATOR: One install.

**[SCREEN: Types `cd my-project && narrate init`]**

**[SCREEN: Output appears:]**
```
Narrate is watching.

Hook installed in .git/hooks/post-commit
Changelog will appear in CHANGELOG.human.md

Make your next commit to see it work.
```

NARRATOR: One command. That's the setup. All of it.

**[SCREEN: Developer writes some code. A refactor. Changes a few files.]**

NARRATOR: Now you just... work. The way you always work.

**[SCREEN: Types `git add . && git commit -m "refactor auth"`]**

NARRATOR: Commit like you always commit.

**[SCREEN: Git completes instantly. No delay. Cursor returns.]**

NARRATOR: It doesn't slow you down. Not by a second. But in the background—

**[SCREEN: Opens CHANGELOG.human.md. New entry at top:]**
```
Apr 5, 2026 -- 7:36 AM

  Refactored user authentication to use JWT tokens instead of
  session cookies, fixing the Mobile Safari logout bug that
  occurred when users switched tabs.  ·  abc1234
```

NARRATOR: —Narrate read your diff. Understood your changes. And wrote down what you did. In plain English. The kind of sentence you'd write if you had time. Which you don't. Which is why you never did.

**[SCREEN: Developer makes another commit. Types `narrate log`]**

**[SCREEN: Beautiful terminal output, color-formatted, showing the last several entries:]**
```
Apr 5, 2026 -- 7:36 AM
  Refactored user authentication to use JWT tokens instead of
  session cookies, fixing the Mobile Safari logout bug.  ·  abc1234

Apr 4, 2026 -- 11:22 PM
  Added rate limiting to the API endpoints to prevent abuse
  from automated scrapers.  ·  def5678

Apr 4, 2026 -- 3:15 PM
  Fixed the dashboard crash that happened when users had no
  transactions in their history.  ·  ghi9012
```

NARRATOR: That's your week. Not in code. Not in commit hashes. In *stories*. The story of what you built.

**[SCREEN: Types `narrate backfill --last=90d`]**

**[SCREEN: Output:]**
```
Found 847 commits in the last 90 days
Estimated cost: $0.42

Proceed? [Y/n]
```

NARRATOR: And that messy repo you inherited? Those six months of "WIP" commits? Narrate can go back in time.

**[SCREEN: User types Y. Progress bar fills. CHANGELOG.human.md grows.]**

NARRATOR: Every commit. Translated. Understood. Documented.

**[SCREEN: Opens the now-populated CHANGELOG.human.md. Scrolls through pages of clear, readable entries.]**

NARRATOR: (quietly) Forty-two cents.

**[SCREEN: Fades to the changelog, glowing softly]**

NARRATOR: Your code tells a story. Narrate writes it down.

**[SCREEN: Logo. `narrate init` — and that's it.]**

---

*End of demo.*

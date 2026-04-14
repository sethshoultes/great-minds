# Personal Link Saver PRD

**Status:** Demo Project | **Time to MVP:** One Session | **Target User:** Anyone who has 47 browser tabs

---

## Problem Statement

I have 47 browser tabs open right now. Half of them are articles I meant to read. A quarter are email drafts. The rest? Forgotten.

Last week, I needed a specific article about AI safety. It was in one of those tabs. I spent 15 minutes searching my browser history. Gave up.

The real problem isn't that I save links. It's that I can't *find* them. And I forget why I saved them in the first place.

---

## Goal

Build a personal link saver with AI-powered categorization that lets users:
- Save links with a single click
- Understand what they saved and why
- Find links by meaning, not keywords

**Scope:** MVP in one session. Exactly what's needed to prove the concept. Nothing more.

---

## Requirements

1. **Users can save a link from anywhere**
   - Single browser extension click
   - Saves URL + page title automatically
   - Proof: "Save a link" works in demo

2. **AI auto-categorizes every link**
   - System suggests: "Work," "Ideas," "To-Read," "Reference," "Random"
   - User can accept or override
   - Proof: Three saved links show three different categories

3. **Users can search by meaning**
   - Query: "something about AI and decision-making" finds the right link
   - Not keyword-matching; semantic search
   - Proof: Search finds link saved weeks ago using different words

4. **Users see their link collection visually**
   - Simple dashboard: categories as columns, links as cards
   - Shows category, title, date saved
   - Proof: Demo saves 3 links, dashboard displays all 3

5. **The system remembers why you saved it**
   - Optional: user adds one-line note at save time ("Elon's thoughts on Mars")
   - System can infer context from page content if note is empty
   - Proof: Saved link shows context when retrieved

---

## Success Criteria

- User can save → categorize → find a link in under 2 minutes
- AI categorization works right the first time (3/3 links correct)
- Semantic search finds a link saved with different terminology
- Dashboard loads instantly and shows all saved links
- System feels fast enough to use daily (< 1 second per action)

---

## Debate Hooks

### Steve Would Ask:
"Why should users trust the AI categorization? If it gets it wrong, they'll override it every time and we've wasted their cognition. What's the experience when the AI fails?"

### Elon Would Ask:
"Semantic search sounds expensive to run on-device. Are we building a local model or calling an API? If it's an API, how do we stay competitive against Pocket or Notion? What's the unit economics?"

---

## Notes for the Demo

This PRD is intentionally simple. It describes *exactly* what ships, nothing more.

- The problem is relatable: everyone has lost browser tabs
- The scope is tight: 5 features, achievable in 90 minutes
- The debate hooks are real: Steve cares about UX trust, Elon cares about competitive differentiation
- The success criteria are measurable and easy to verify in a live demo

This is a project where smart people could reasonably disagree. That's the magic.

---

## One More Thing

If this actually shipped, would you use it?

If the answer is no, the debate doesn't matter.

If the answer is yes, then let's build something that makes you feel less alone with this specific problem.

That's the whole game.

# Board Review: LocalGenius Sites

**Reviewer:** Shonda Rhimes
**Role:** Board Member, Great Minds Agency
**Perspective:** Narrative & Retention
**Date:** April 14, 2026

---

## Executive Summary

LocalGenius Sites has the bones of a great story, but right now it's reading like a pilot script with a strong cold open and no season arc. The "reveal moment" is genuinely compelling television — but television requires a reason to tune in next week. The infrastructure is exceptional; the emotional architecture needs work.

---

## Story Arc: Signup to "Aha Moment"

### What's Working

The PRD explicitly names the reveal moment as a product feature — "designed to make them gasp." This is exactly right. The five-minute journey from "I need a website" to "Oh my God, that's MY website" is a classic character transformation beat.

The structure has natural dramatic tension:
- **Inciting Incident:** Business owner realizes they need a website
- **Rising Action:** 7 questions (like a confessional interview)
- **30-second verification:** The moment of doubt before the reveal
- **Climax:** The gasp. The site goes live.

The static generator is built for this moment — sub-5-second generation, 95+ PageSpeed, beautiful templates. The hero image loading, the business name appearing, the call-to-action buttons ready to receive calls. This is a transformation scene.

### What's Missing

**The story doesn't continue after the pilot.**

The PRD mentions "30-second owner verification before site goes live" but there's no emotional scaffolding after that. Where's the "day two" storyline? The "week one" arc?

In *Grey's Anatomy*, the pilot hooks you with Meredith waking up next to a stranger who turns out to be her boss. But we kept watching because there was a promise of complications, growth, relationships evolving. Where's that promise here?

**Grade: B+** — Strong opening, but the story ends at Act One.

---

## Retention Hooks: Tomorrow & Next Week

### The Good

The MCP integration is narratively promising. "Natural language prompt bar: Update my hours to 9-5" is the equivalent of a recurring character — the AI assistant who shows up when you need it.

Monthly AI-generated site updates ("Your AI updated your site for spring promotions") could be an episodic structure. But the implementation is thin.

### The Gaps

**Tomorrow:** Nothing specific brings them back tomorrow. No notification that says "3 people visited your site today." No "Your AI noticed your competitor updated their menu — want us to check yours?" The site launches and... silence.

**Next Week:** The PRD mentions "MCP content updates per site/month >= 2" as a success metric. But that's a backend goal, not a user-facing hook. Users don't know they're supposed to update twice. There's no natural prompt.

**The Missing Cliffhanger:** Every episode of great TV ends with a reason to come back. LocalGenius Sites doesn't have one. After the reveal, the user has no burning question, no unresolved tension, no "What happens next?"

### Suggestions

1. **The First Week Email Sequence:** Day 1: "Your site just got its first visitor!" Day 3: "Here's what people see when they Google you now." Day 7: "Your AI has a suggestion for your site."

2. **The Dashboard Heartbeat:** Show visits, show search appearances, show reviews being pulled in. Make the site feel *alive*, not done.

3. **The Season Premiere:** After 30 days, trigger a "site refresh" moment. "It's been a month — your AI has some ideas." This creates anticipation for an event.

**Grade: C** — The infrastructure exists (MCP bridge, AI updates) but there's no narrative delivery mechanism.

---

## Content Strategy: The Flywheel

### Assessment

There is no content flywheel.

A content flywheel would look like:
1. User creates site
2. Site generates traffic
3. Traffic generates data/reviews
4. Data/reviews become content
5. Content attracts more traffic
6. Repeat

What LocalGenius Sites has:
1. User creates site
2. Site exists
3. ...?

The static generator creates beautiful pages, but they're static. The MCP bridge allows updates, but there's no automatic content generation from user activity.

### The Missed Opportunity

The PRD mentions pulling in Google reviews. This could be automatic content refresh. But the implementation doesn't show reviews being automatically updated — they're a one-time import during provisioning.

**What a flywheel would look like:**
- New Google review appears
- AI summarizes it and adds to testimonials section
- Notification to user: "A new 5-star review just went live on your site!"
- User feels the site is *working* for them
- User stays subscribed

**Grade: D** — No flywheel mechanics visible in the deliverables.

---

## Emotional Cliffhangers: The "What's Next?"

### The Critique

Great stories create curiosity gaps. "Who killed Rosie Larsen?" "Will they get together?" "What's in the hatch?"

LocalGenius Sites closes the curiosity gap at launch. The user's question was "Can I get a website?" The answer is "Yes, here it is." Question answered. Story over.

### What Cliffhangers Could Look Like

1. **The Hidden Feature:** "Your site has a secret page we haven't shown you yet. Unlock it at Day 7." Creates anticipation.

2. **The Growth Tease:** "We're tracking something special about your site. Check back next week to see." Manufactures curiosity.

3. **The AI Mystery:** "Your AI assistant learned something interesting about your business today. Want to see?" Opens a loop.

4. **The Competitor Shadow:** "Someone in your area just searched for what you offer. Your site showed up." Creates the feeling of being in a competition.

### The Real Problem

The product treats the website as the destination. But for retention, the website should be the *beginning*. The user's relationship with LocalGenius should feel like an ongoing drama, not a transaction.

**Grade: C-** — No intentional emotional hooks after launch.

---

## Infrastructure Assessment

*(Not my primary lens, but worth noting)*

The technical execution is impressive:
- Provisioning queue with circuit breakers
- Image optimization pipeline (40-60% compression)
- Static generation in <5 seconds
- Multi-tenant R2 storage
- Federation strategy for 50K+ sites

This is a well-built stage. The problem is what happens on that stage after the first scene.

---

## Score: 6/10

**Justification:** LocalGenius Sites delivers a genuinely compelling "reveal moment" and beautiful infrastructure, but treats the website launch as a series finale when it should be a pilot — no retention narrative, no content flywheel, no emotional cliffhangers to bring users back after the initial gasp.

---

## Recommendations

### Immediate (Before Launch)

1. **Add a "First Week" email sequence** that delivers micro-moments of progress and curiosity
2. **Implement basic traffic notifications** — even if it's just "Someone visited your site today"
3. **Create a 30-day milestone event** that users anticipate

### Phase 2

1. **Build the review flywheel** — automatic ingestion, AI curation, notification on update
2. **Add a simple analytics dashboard** — not to be Squarespace, but to create reasons to return
3. **Introduce "AI suggestions"** as a recurring engagement mechanic

### Narrative Reframe

Stop thinking of LocalGenius Sites as "website builder."
Start thinking of it as "business story engine."

The website is Season 1, Episode 1. The AI updates are recurring episodes. The review integrations are guest appearances. The traffic growth is the character arc.

Sell the journey, not just the destination.

---

## Final Note

*"Your business, live in five minutes"* is a great tagline. But the better story is:

*"Your business, growing every day."*

The first gets them in the door. The second keeps them watching.

---

**Shonda Rhimes**
Board Member
Great Minds Agency

*"Stories aren't told. They're lived."*

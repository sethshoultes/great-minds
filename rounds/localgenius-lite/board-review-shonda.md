# Board Review: LocalGenius Lite
## Shonda Rhimes — Narrative & Retention Lens

---

### The Verdict

This is a *pilot episode*, not a series. The product has a tight cold open but no promise of where we're going. Let me explain.

---

## Story Arc: Signup to "Aha Moment"

**Grade: B-**

The opening is efficient. Install plugin → select "I'm a dentist in Austin" → widget goes live. That's your cold open, and it works. The homepage scanner extracting business name and phone number automatically? That's a nice reveal — "oh, it already knows me."

The "aha moment" should be: **"A customer asked a question at 2am and my website answered it."** But here's the problem: *the user never witnesses this moment unless they check the dashboard manually.* There's no notification. No email that says "Your widget just answered its first question!" No dramatic beat.

In television, we'd call this a missing "act out." The user completes setup, the episode cuts to black... and then what? They forget about it until they check back weeks later.

**What's Missing:**
- First question celebration notification
- Weekly "here's what customers asked" email digest
- "You saved X hours this week" periodic reminder
- Any reason to check back tomorrow

The stats display in the admin (`X questions answered, Y% instant`) is good scaffolding, but it's buried. Nobody's going back to Settings > LocalGenius to feel good about their purchase.

---

## Retention Hooks: What Brings Them Back?

**Grade: C**

Let's be blunt: **nothing.**

This product is a "set it and forget it" tool, which sounds like a feature but is actually a retention death sentence. If users don't think about your product, they:
1. Don't tell others about it
2. Don't upgrade to paid
3. Don't renew when their 100 questions/month runs out
4. Churn silently

**The Current Hooks (Weak):**
- Admin dashboard showing question count *(only works if they visit)*
- Rate limit message: "We've reached our monthly limit" *(creates frustration, not desire)*
- "Powered by LocalGenius" footer link *(growth hack, not retention)*

**What's Missing:**
- **Weekly performance email**: "Your chat widget answered 23 questions this week. Here are the top 3..."
- **Unanswered question alerts**: "A customer asked something we couldn't answer — want to add it to your FAQs?"
- **Milestone celebrations**: "Congrats! You've helped 100 customers with LocalGenius."
- **Monthly insights**: "Customers asked about parking 8 times this month. Maybe add it to your homepage?"

The PRD mentions "unanswered questions queue" and "top 10 questions this week" dashboard as success metrics, but I don't see implementation for these in the deliverables. Where's the drama of discovery? Where's the cliffhanger that makes a business owner curious?

---

## Content Strategy: Is There a Flywheel?

**Grade: D+**

The FAQ templates are a good content foundation — 10 business types with 10-12 pre-written Q&As each. This gives the AI something to work with on day one. Smart.

But where's the *accumulation*?

**A Content Flywheel Looks Like:**
1. User installs → AI uses template FAQs
2. Customers ask questions → AI answers them
3. New patterns emerge → System surfaces unanswered/new questions
4. User adds custom answers → AI gets smarter
5. Better answers → More engagement → More signal → Repeat

You have steps 1-2 working. Steps 3-5 are missing entirely.

The PRD's "Nice to Have (v1.1)" mentions "Custom Q&A additions from admin" but that's not here yet. Without it, the content is static. A business owner who's been using this for 6 months has the exact same widget as one who just installed it. That's not a flywheel — it's a brochure.

The caching layer in the Cloudflare Worker (`getCached`, `setCached`) is smart infrastructure, but it's caching *answers*, not *learning*. There's no feedback loop from "this answer worked" vs "customer immediately asked again" (implicit failure signal).

---

## Emotional Cliffhangers: What Creates Curiosity?

**Grade: D**

This is where I'm most disappointed, because the opportunity is enormous.

Consider what data LocalGenius has access to:
- What questions customers are asking
- What times they're asking (2am? Saturdays?)
- Which questions the AI couldn't answer
- Which questions customers re-ask (dissatisfaction signal)

This is *gold*. It's market research that businesses pay thousands for. And right now, it's just... logging to an option field.

**Emotional Cliffhangers I'd Kill For:**
- "Someone asked if you're open Thanksgiving. You might want to update your hours." *(creates urgency, implies customer demand)*
- "3 customers asked about wheelchair accessibility this month. Food for thought." *(surfaces unknown demand)*
- "Your busiest chat hour is 9pm on Thursdays. Interesting!" *(makes data feel personal)*
- "A competitor's customers might be finding you — someone asked 'are you better than [competitor name]?'" *(drama!)*

The prompts.js file has beautiful voice guidelines ("Say 'Yep!' instead of 'Yes, we do'") but that warmth doesn't extend to the *relationship* between LocalGenius and the business owner. The AI is warm to customers, cold to owners.

---

## The Protagonist Problem

Every great story needs a protagonist transformation arc. Who is the protagonist here?

- **The Business Owner**: Goes from "overwhelmed answering questions" to... "has a widget now"? Where's the transformation? There's no visualization of time saved, no story of growth.

- **The Customer**: Asks a question, gets an answer. Satisfied but forgettable. No reason to return.

The product solves a problem but doesn't tell a story about it.

**What transformation could look like:**
- Month 1: "Your widget answered 12 questions. That's roughly 20 minutes of phone calls you didn't take."
- Month 3: "You're now helping 50+ customers per month. LocalGenius has handled 127 questions."
- Month 6: "Your most common question is about parking. Customers asked it 34 times. Maybe add directions to your homepage?"

This creates a narrative arc: *"I went from drowning in repetitive questions to understanding what my customers actually want."*

---

## Production Notes: What Works

Before I wrap, credit where due:

1. **The Voice Work Is Excellent**: The prompts.js file shows genuine craft. Different tones for dentists (reassuring) vs. fitness centers (energetic). "We'll make sure you leave feeling great!" — that's character writing.

2. **The Zero-Config Promise Delivers**: Homepage scanner → business type dropdown → done. That's a tight first scene.

3. **Graceful Degradation**: Fallback responses when the AI fails are humanized ("I'd recommend calling us directly at {phone}"). No robot apologies.

4. **GDPR Consent**: The privacy checkbox before chat is legally necessary but also builds trust. Good.

5. **The Rate Limit Copy**: "We've reached our monthly limit for questions. Please call us directly or check back next month!" — friendly, not punishing.

---

## Final Score: 5/10

**"Strong pilot, but no series order."**

The product nails the setup and solves a real problem, but it has no narrative thread that keeps business owners engaged beyond installation. Without retention hooks, content flywheel, or emotional curiosity drivers, this will be a graveyard of inactive installs. Users will install it, forget about it, hit rate limits they didn't know existed, and churn without ever becoming advocates.

The bones are here. The execution is solid. But *where's the story*?

---

## My Prescription (Pick 2 for v1.1)

1. **First Question Celebration**: Admin notice or email when widget answers its first real question. Make them *feel* the win.

2. **Weekly Digest Email**: Top questions, unanswered questions, one insight. Keep the relationship warm.

3. **Unanswered Question Surfacing**: "A customer asked something we couldn't answer. Add a response?" — turns passive users into active collaborators.

4. **Milestone System**: 10, 50, 100, 500 questions answered. Each with a small celebration. Progress is narrative.

5. **Monthly Insights Report**: "Your customers' #1 question this month was about hours. #2 was about parking." — make the data feel actionable.

The product works. Now make it *mean* something.

---

*— Shonda Rhimes*
*Great Minds Agency Board Member*
*"Every character needs a reason to come back for episode two."*

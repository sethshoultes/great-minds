# WP Autopilot: Retention Roadmap
**Author:** Shonda Rhimes
**Lens:** What Keeps Users Coming Back
**Date:** 2026-04-16

---

## The Core Problem

**You built a vending machine. Users need a relationship.**

Right now:
- User asks question → gets answer → leaves
- No emotional investment
- No progress tracking
- No narrative thread
- Chat history dies in 1 hour
- Every return is a cold start

**Result:** Predicted 15-20% next-day return rate (industry target: 50%+)

**This roadmap fixes that.**

---

## What Keeps Users Coming Back (Retention Framework)

### **1. Progress They Can See**
People return when they see themselves moving forward.

**Current state:**
- No progress tracking
- No milestone celebration
- Success feels mechanical: "Page created. Next?"

**What's needed:**
- Visual progress indicators
- Achievement unlocks
- Completion streaks
- Before/after comparisons

### **2. Investment They've Made**
People return when they've built something they don't want to lose.

**Current state:**
- Chat history expires in 1 hour
- No saved workflows
- No persistent context
- Zero sunk cost

**What's needed:**
- Chat history retention (7+ days)
- Saved conversation threads
- Reusable templates from past work
- "Your site story" timeline

### **3. Curiosity About What's Next**
People return when they're curious about the next chapter.

**Current state:**
- Conversations end flat
- No cliffhangers
- No "tomorrow we'll..." teasers
- No unfinished business flagged

**What's needed:**
- Next-action suggestions
- Unfinished task reminders
- Feature discovery prompts
- "What if you..." curiosity hooks

### **4. Community & Social Proof**
People return when they see others succeeding.

**Current state:**
- Zero social features
- No public gallery
- User success invisible
- Isolated experience

**What's needed:**
- Showcase gallery ("Built with WP Autopilot")
- Template sharing
- Weekly highlights ("Most-built feature: testimonials")
- Community challenges

### **5. Relationship with the Tool**
People return to tools that feel like partners, not appliances.

**Current state:**
- Transactional language
- No personality
- Clinical error messages
- Generic greetings

**What's needed:**
- Warm, human tone
- Celebration of wins
- Empathy in struggles
- Shared ownership ("we built this together")

---

## v1.1 Feature Roadmap: Retention Fixes

### **TIER 1: Must-Have (Launch Blockers)**

These features directly address the 15% → 50% retention gap. **Cannot ship to WordPress.org without these.**

#### **Feature 1.1.1: Extended Chat History**
**Current:** 1-hour transient expiry
**New:** 7-day retention minimum

**User impact:**
- Returns to find conversation intact
- Can reference past decisions
- Feels progress is saved
- Reduces cognitive load

**Technical:**
- Change transient expiry from 1 hour → 7 days
- Add pagination for long histories
- Privacy consideration: Add clear data retention policy

**Success metric:** Increases return rate by showing investment persists

---

#### **Feature 1.1.2: Return Greeting with Context**
**Current:** Generic "What would you like to build?" every time
**New:** "Welcome back! Last time you created X. Ready to continue?"

**User impact:**
- Feels recognized, not forgotten
- Reminded of progress made
- Invited to continue story
- Reduces re-orientation friction

**Technical:**
- Fetch last action from chat history
- Display in greeting with timestamp
- Offer quick actions: "Continue" / "Start fresh"

**Success metric:** Reduces time-to-second-action for returning users

---

#### **Feature 1.1.3: Next-Action Suggestions**
**Current:** Action completes → user left wondering "now what?"
**New:** Action completes → suggest logical next step

**Examples:**
- Created Contact page → "Most sites add an About page next. Want to try?"
- Added testimonials → "Ready to create a case studies section?"
- Built service page → "Want to add a pricing table?"
- Site lacks blog → "Your site has no blog yet. Start one?"

**User impact:**
- Reduces decision fatigue
- Creates narrative momentum
- Educates on best practices
- Builds "one more thing" loop

**Technical:**
- Action completion triggers suggestion engine
- Rule-based initially (if Contact created, suggest About)
- Later: ML-based on successful site patterns

**Success metric:** % of users who take suggested next action

---

#### **Feature 1.1.4: First-Success Celebration**
**Current:** "Page created successfully" (clinical)
**New:** "🎉 You just built your first page with AI! Here's what you could do next..."

**User impact:**
- Creates emotional high point
- Reinforces capability
- Marks milestone
- Makes experience memorable

**Technical:**
- Detect if this is user's first successful action
- Trigger celebration UI (confetti animation optional)
- Offer 3 next-step options as menu

**Success metric:** Time from first success to second action (should decrease)

---

### **TIER 2: High-Impact Retention (v1.1 Launch)

These features create stickiness through progress visibility and unfinished business.

#### **Feature 1.1.5: Progress Dashboard**
**What:** Visual overview of site-building progress

**Components:**
- "Essential Pages" checklist (Home, About, Contact, Services, Blog)
- Completion percentage
- Recent actions timeline
- Suggested next steps

**User impact:**
- Gamifies site building
- Creates "just one more" motivation
- Shows tangible progress
- Builds sense of achievement

**Technical:**
- New admin page: WP Autopilot → Progress
- Analyze current site state (existing pages, missing pages)
- Track actions taken via plugin
- Calculate completion score

**Success metric:** % increase in users completing "essential pages" checklist

---

#### **Feature 1.1.6: Unfinished Business Reminders**
**What:** Flag incomplete actions and partial builds

**Examples:**
- "Your About page has no hero image yet"
- "Contact form created but email not configured"
- "Testimonials section added but only 1 testimonial"
- "Blog exists but no posts published"

**User impact:**
- Creates tension (Zeigarnik effect: unfinished tasks stick in memory)
- Gives reason to return
- Provides clear next action
- Reduces "what should I do?" friction

**Technical:**
- Context collector analyzes site for gaps
- Flag incomplete patterns
- Surface in chat greeting or progress dashboard
- Prioritize by impact (email config > missing image)

**Success metric:** Return rate for users with flagged unfinished items vs. without

---

#### **Feature 1.1.7: Weekly Digest Email**
**What:** Optional email summarizing progress and opportunities

**Content:**
- "This week you created X, Y, Z"
- "Your site is 60% complete. Add pricing to finish?"
- "Most popular feature this week: testimonials"
- "Quick win: Add FAQ section (5 minutes)"

**User impact:**
- Brings users back from outside WordPress
- Celebrates progress
- Creates FOMO (what others are building)
- Reduces forgetting

**Technical:**
- Opt-in email setting
- Cron job to generate weekly digest
- Personalized based on user's site and actions
- Unsubscribe link required

**Success metric:** Email open rate, click-through to return rate

---

### **TIER 3: Content Flywheel (v1.2+)

These features create network effects and viral growth through user-generated content.

#### **Feature 1.1.8: Template Gallery**
**What:** Public showcase of sites/pages built with WP Autopilot

**Flow:**
- User creates great page
- Plugin detects quality signals (time spent, user satisfaction rating)
- Offers to share: "This looks great! Share as template?"
- Template goes to gallery with attribution
- Other users can install with one click

**User impact (creator):**
- Recognition and attribution
- Portfolio showcase
- Potential revenue share (future)

**User impact (installer):**
- Reduces build time
- Inspires with real examples
- Lowers creative barrier
- Trusts peer-created content

**Technical:**
- Export page structure + content as JSON
- User approval flow with preview
- Gallery admin page (public-facing)
- One-click template installation
- Attribution: "Built by [Username]"

**Success metric:** % of users who install at least one template, retention rate for template installers

---

#### **Feature 1.1.9: "Built with WP Autopilot" Badge**
**What:** Optional badge/credit in site footer

**Benefits:**
- Viral distribution (site visitors discover plugin)
- Social proof (real sites using it)
- Creator pride (showcasing tech stack)

**User impact:**
- Opt-in, removable
- Links to gallery of user sites
- Badge design variations (light/dark mode)

**Technical:**
- Settings toggle: "Show attribution badge"
- Widget or Gutenberg block
- Tracks referral traffic

**Success metric:** % of badge-driven installs

---

#### **Feature 1.1.10: Community Challenges**
**What:** Weekly/monthly building challenges with showcase

**Examples:**
- "Build a complete landing page in under 10 actions"
- "Most creative About page"
- "Best use of testimonials section"
- "Speed run: Contact page in 2 minutes"

**User impact:**
- Gamification
- Community engagement
- Learning from others
- Reason to return (new challenge each week)

**Technical:**
- Announcement in admin notice bar
- Submission flow
- Voting/showcase gallery
- Winner featured in digest email

**Success metric:** Participation rate, retention lift during challenge weeks

---

## Retention Metrics Framework

### **Primary Metric: Next-Day Return Rate (NDRR)**
**Current prediction:** 15-20%
**Industry target:** 50%+
**v1.1 target:** 40%

**How measured:**
- % of users who return within 24 hours of first session
- Tracked via user ID + session timestamps

**What influences it:**
- Chat history retention (Tier 1)
- Next-action suggestions (Tier 1)
- Return greeting with context (Tier 1)
- Unfinished business reminders (Tier 2)

---

### **Secondary Metric: 7-Day Active Users (7DAU)**
**What:** % of users active at least once in past 7 days
**Target:** 30%+

**What influences it:**
- Progress dashboard (Tier 2)
- Weekly digest email (Tier 2)
- Template gallery browsing (Tier 3)

---

### **Tertiary Metric: Actions per User per Week**
**What:** Average number of actions taken by active users
**Target:** 5+ actions/week

**What influences it:**
- Next-action suggestions (Tier 1)
- Essential pages checklist (Tier 2)
- Community challenges (Tier 3)

---

## v1.0 → v1.1 Priority Decisions

### **What MUST be in v1.1 (before WordPress.org submission):**

1. **Extended chat history** (7 days) — without this, users lose investment
2. **Return greeting with context** — without this, users feel forgotten
3. **Next-action suggestions** — without this, users don't know what to do next
4. **First-success celebration** — without this, no emotional high point

**Rationale:** These four features address the flatline onboarding and zero retention hooks. They're table stakes for 40% NDRR.

---

### **What SHOULD be in v1.1 (strong impact, feasible timeline):**

5. **Progress dashboard** — visualizes momentum, creates "just one more" loop
6. **Unfinished business reminders** — creates tension, gives reason to return

**Rationale:** These add stickiness without architectural complexity. High ROI for dev time.

---

### **What CAN WAIT for v1.2:**

7. Weekly digest email — requires email infrastructure, deliverability setup
8. Template gallery — needs moderation, hosting, discovery UX
9. Attribution badge — nice-to-have, not retention driver
10. Community challenges — requires community management resources

**Rationale:** These are force multipliers but not blockers. Build foundation first, add amplification later.

---

## Narrative Fixes (Copy Changes, Zero Dev Time)

### **Onboarding Narrative (Settings Page)**

**Current:**
> "Enter your Anthropic API key below."

**Rewrite:**
> "You're 2 minutes from building pages with AI. First, let's connect your account:"
>
> **Step 1:** [Create free Claude account](link) (30 seconds)
> **Step 2:** Copy your API key
> **Step 3:** Paste it here → [___________]
>
> **Cost estimate:** Your first 100 pages cost about $2 in API credits.

**Impact:** Reduces intimidation, adds clarity, sets cost expectations

---

### **First Chat Greeting**

**Current:**
> "What would you like to build today?"

**Rewrite:**
> "Hi! I'm here to help you build your WordPress site. I can create pages, add content, install plugins, and more.
>
> **Try this:** 'Create a contact page with my business info'
>
> What would you like to start with?"

**Impact:** Explains capability, models behavior, invites action

---

### **Action Confirmation**

**Current:**
> "I will create a new page titled 'About Us'. Proceed?"

**Rewrite:**
> "I'll create your About Us page with a hero section, company story, and team info. Sound good?"
>
> [Yes, create it] [No, change it] [Show me a preview first]

**Impact:** Adds detail, offers flexibility, reduces uncertainty

---

### **Success Message**

**Current:**
> "Page created successfully."

**Rewrite (first success):**
> "🎉 **You just built your first page with AI!**
>
> Want to keep going? Try one of these:
> - Add a contact form
> - Create an About page
> - Write a blog post
>
> What's next?"

**Rewrite (subsequent successes):**
> "✓ Done! Your [Page Name] is live.
>
> **Next idea:** Sites like yours often add [suggestion]. Want to try?"

**Impact:** Celebrates win, suggests next step, builds momentum

---

### **Error Messages**

**Current:**
> "API key invalid. Check your settings."

**Rewrite:**
> "Hmm, that API key didn't work. Double-check you copied the whole thing from Anthropic?
>
> [Open settings] [Get help]"

**Impact:** Empathy, specific guidance, easy fixes

---

**Current:**
> "You've hit your rate limit. Try again later."

**Rewrite:**
> "Whoa, you're building so fast you hit Claude's speed limit! Take a breath, grab some coffee, and try again in 60 seconds. ☕"

**Impact:** Reframes frustration as achievement, adds personality

---

### **Return Greeting (Returning User)**

**Current:**
> "What would you like to build today?"

**Rewrite:**
> "Welcome back! Last time you created your Contact page.
>
> **Your site so far:** 3 pages built, looking great!
>
> Ready to add more? Try:
> - Create an About page
> - Add testimonials
> - Start your blog
>
> Or ask me anything!"

**Impact:** Recognition, progress reminder, clear next steps

---

## The Story Arc You're Missing

### **Current User Journey (Flatline):**

```
Install → API key → Chat greeting → Ask question → Get answer → Leave
          ↑ Drop-off         ↑ No hook               ↑ No reason to return
```

### **Ideal User Journey (Rising Action):**

```
Install → Quick demo → Setup (with cost clarity) → First win 🎉 →
  "What's next?" menu → Second win → Progress visible (40% done) →
  Leave with unfinished business → Email reminder → Return to finish →
  Complete milestone → Share success → Bring in peers
```

---

## Implementation Priority

### **Week 1-2 (During v1.0 Build):**
- [ ] Change chat history expiry: 1 hour → 7 days
- [ ] Add return greeting with last action context
- [ ] Rewrite all copy (onboarding, greetings, errors, success)
- [ ] Add next-action suggestions after successful actions
- [ ] Add first-success celebration

**Effort:** Low (mostly copy, one config change, simple logic)
**Impact:** High (addresses all Tier 1 retention gaps)

---

### **Week 3-4 (Private Beta Period):**
- [ ] Build progress dashboard
- [ ] Add unfinished business detection
- [ ] Implement next-action suggestion engine (rule-based)
- [ ] Track retention metrics (NDRR, 7DAU, actions/user)

**Effort:** Medium (new admin page, context analysis, metrics)
**Impact:** High (Tier 2 stickiness features)

---

### **Post-Beta (v1.2 Planning):**
- [ ] Weekly digest email system
- [ ] Template gallery infrastructure
- [ ] Attribution badge option
- [ ] Community challenges framework

**Effort:** High (email infra, moderation, community management)
**Impact:** Medium-High (force multipliers on existing retention)

---

## Success Looks Like

### **Launch Day (v1.0 with Tier 1 fixes):**
- User installs plugin
- Sees clear 3-step setup with cost transparency
- Completes first action
- Gets confetti celebration + "What's next?" menu
- Takes suggested second action
- Leaves with chat history saved

### **Day 2:**
- Email reminder (if enabled): "You built 2 pages yesterday. Finish your About page?"
- User returns, sees: "Welcome back! Last time: Contact page. Continue?"
- Progress dashboard shows: "3/10 essential pages complete"
- Unfinished business flagged: "Contact form needs email configured"
- User fixes it, builds one more page

### **Week 1:**
- User has built 5-7 pages
- Progress dashboard: "70% complete!"
- Weekly digest: "This week you built X, Y, Z. Most popular feature: testimonials. Try it?"
- User feels momentum, capability, investment

### **Week 2:**
- User completes "essential pages" checklist
- Achievement unlocked: "Site Builder"
- Offered template sharing: "Your About page looks great! Share it?"
- User opts in, sees template in gallery
- Becomes advocate, shares plugin with peers

---

## Bottom Line

**v1.0 without retention features = 15% next-day return**
- Users try once, forget, never return
- Becomes zombie plugin by month 3
- Churn rate >80% by week 4

**v1.1 with Tier 1 + Tier 2 retention features = 40-50% next-day return**
- Users feel progress
- Investment persists (chat history)
- Clear next steps (suggestions)
- Unfinished business brings them back
- Emotional connection (celebration, warm copy)

**v1.2+ with content flywheel = 60%+ sustained retention**
- Network effects (templates, gallery)
- Community engagement (challenges)
- Viral growth (attribution badge)
- Becomes habit (weekly digest)

---

**You can't fake retention. You earn it through:**
1. Making users feel progress
2. Preserving their investment
3. Creating curiosity about next steps
4. Building relationships, not transactions
5. Celebrating wins, empathizing with struggles

**Right now you have none of that. With v1.1 features, you have all of it.**

**The choice:** Ship a tool people try once, or ship a partner people come back to.

**I know which one builds a phenomenon.**

---

Shonda Rhimes
Great Minds Board Member
Storytelling & Retention Advisor

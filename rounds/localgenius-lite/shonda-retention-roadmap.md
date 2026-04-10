# LocalGenius Lite — Retention Roadmap

**Author:** Shonda Rhimes (Board Member)
**Product:** LocalGenius Lite
**Version:** v1.1 Feature Specification
**Theme:** "What Keeps Them Coming Back"

---

## The Problem Statement

> "This product is a 'set it and forget it' tool, which sounds like a feature but is actually a retention death sentence."

LocalGenius Lite currently has:
- A clean cold open (installation)
- No act two (engagement)
- No cliffhanger (reason to return)
- No season arc (transformation story)

**Result:** Users install, forget, hit rate limits they didn't know existed, and churn without becoming advocates.

---

## The Retention Philosophy

Every returning user needs three things:

1. **A reason to check** — Something happened that they need to see
2. **A reward for checking** — Value they get from engaging
3. **A cliffhanger for next time** — Anticipation for what's coming

Currently, LocalGenius provides none of these. V1.1 fixes that.

---

## V1.1 Retention Features

### Feature 1: First Question Celebration

**The Beat:** The user's widget answers its first real customer question. This is the "aha moment" — proof the product works.

**Current State:** User has no idea this happened unless they manually check the dashboard.

**V1.1 Implementation:**

1. **Admin Dashboard Notice**
   ```
   [Star Icon] Your widget just answered its first question!

   A visitor asked: "What are your hours?"
   LocalGenius responded with your business hours automatically.

   [See Your Dashboard] [Dismiss]
   ```

2. **Email Notification** (if email captured)
   ```
   Subject: Your LocalGenius widget is working!

   Hey [Name],

   Your chat widget just answered its first customer question.

   Someone visited your site and asked: "What are your hours?"

   LocalGenius handled it instantly — no phone call, no waiting.

   [See what else customers are asking →]
   ```

**Success Metric:** 80% of users who receive first-question notification return to dashboard within 7 days.

---

### Feature 2: Weekly Performance Digest

**The Beat:** A weekly email that creates curiosity and demonstrates ongoing value.

**Trigger:** Every Monday at 9am local time (if user has received at least 3 questions that week).

**Email Content:**

```
Subject: Your customers asked 23 questions this week

Hi [Business Name],

Here's what happened on your website this week:

QUESTIONS ANSWERED: 23
TOP QUESTION: "What are your hours?" (asked 8 times)
BUSIEST DAY: Thursday
BUSIEST TIME: 9pm

---

[Icon] INSIGHT OF THE WEEK
Customers asked about "parking" 4 times. You might want to
add parking info to your homepage or FAQ.

---

[Icon] COULDN'T ANSWER (2 questions)
• "Do you offer gift cards?"
• "Can I book online?"

[Add answers to these questions →]

---

Your widget has now helped 127 customers total.
That's roughly 4 hours of phone calls you didn't have to take.

[View Full Dashboard →]

---
Powered by LocalGenius
[Unsubscribe] [Email Settings]
```

**Key Elements:**
- One "cliffhanger" insight to create curiosity
- Unanswered questions create actionable follow-up
- Time-saved calculation creates emotional value
- Single CTA to drive dashboard engagement

**Success Metric:** 25% email open rate, 10% click-through to dashboard.

---

### Feature 3: Unanswered Question Alerts

**The Beat:** When the AI can't answer a question, that's not a failure — it's an opportunity. Surface it.

**Current State:** Unanswered questions are logged silently. User never knows.

**V1.1 Implementation:**

1. **Admin Dashboard Card** (persistent until addressed)
   ```
   [Alert Icon] 3 questions we couldn't answer

   Your customers asked questions we don't have answers for:

   • "Do you offer financing?" (asked 2x)
   • "Are you open on holidays?"
   • "Do you do house calls?"

   [Add Custom Answers] [Dismiss All]
   ```

2. **In-Dashboard Quick Add**
   ```
   ADD ANSWER

   Question: "Do you offer financing?"

   Your Answer: [Text field]

   Tone Preview: "Yep! We offer financing through CareCredit.
   Give us a call to learn more!"

   [Save Answer] [Skip]
   ```

3. **Weekly Digest Integration** (see Feature 2)

**The Flywheel:**
1. Customer asks question AI can't answer
2. Owner gets notified
3. Owner adds custom answer
4. AI learns that answer
5. Next customer gets helped
6. Owner feels the product improving

**Success Metric:** 30% of surfaced unanswered questions receive custom answers within 14 days.

---

### Feature 4: Milestone Celebrations

**The Beat:** Progress creates narrative. Milestones create moments of reflection.

**Milestones:**
- First question answered
- 10 questions answered
- 50 questions answered
- 100 questions answered
- 500 questions answered
- 1,000 questions answered

**Implementation:**

1. **Dashboard Achievement Card**
   ```
   [Trophy Icon] MILESTONE REACHED

   Your widget has now answered 100 questions!

   That's roughly 3 hours of phone calls you didn't take.

   Your most helpful answer: "What are your hours?"
   (answered 34 times)

   [Share This Achievement] [Dismiss]
   ```

2. **Optional Social Share**
   ```
   My AI chat widget just answered its 100th customer question!
   LocalGenius has saved me hours of repetitive phone calls.

   [Share to Twitter] [Share to LinkedIn] [Copy Text]
   ```

3. **Email Notification** (for major milestones: 100, 500, 1000)

**Success Metric:** 15% of milestone notifications result in social shares or referrals.

---

### Feature 5: Usage Warning System

**The Beat:** Don't let rate limits feel like punishment. Make them feel like success.

**Current State:** User hits 100 questions, sees "limit reached" message to customers, feels frustrated.

**V1.1 Implementation:**

1. **80% Warning (80 questions used)**
   ```
   DASHBOARD NOTICE:

   [Info Icon] You've used 80 of your 100 free questions this month!

   That's great — your customers are engaging with your widget.

   At this pace, you might hit your limit in 4 days.

   [Upgrade to Unlimited] [Remind Me Later]
   ```

2. **100% Reached (with context)**
   ```
   DASHBOARD NOTICE:

   [Check Icon] You reached your free limit — that's a good sign!

   100 questions means 100 customers who got instant help.

   Your widget will reset on [Date]. In the meantime:

   • Customers see a friendly "call us" message
   • No bad experience — just a redirect

   [Upgrade for Unlimited Questions]
   ```

3. **Email at 80%**
   ```
   Subject: Your chat widget is popular!

   You've used 80 of your 100 free questions this month.

   That means 80 customers got instant answers without
   calling or emailing. Nice work!

   If you want unlimited questions (plus custom branding
   and priority support), upgrade anytime:

   [Upgrade to LocalGenius Pro →]

   Not ready? No problem — your free tier resets on [Date].
   ```

**Success Metric:** 20% of users who receive 80% warning convert within 30 days.

---

### Feature 6: Monthly Insights Report

**The Beat:** Transform raw data into actionable business intelligence.

**Trigger:** First of each month (if user has 10+ questions in previous month).

**Email Content:**

```
Subject: What your customers wanted in March

Hi [Business Name],

Here's your March customer insight report:

---

QUESTIONS ANSWERED: 89
COMPARED TO FEBRUARY: +34%

---

TOP 5 QUESTIONS:
1. What are your hours? (23x)
2. Where are you located? (18x)
3. Do you take walk-ins? (12x)
4. How much is [service]? (9x)
5. Do you take [insurance]? (7x)

---

[Icon] EMERGING TREND
"Do you offer online booking?" was asked 6 times —
up from 0 last month. Customers might want this option.

---

[Icon] PEAK HOURS
Your busiest chat times:
• Weekdays: 8-9pm (after work browsers)
• Weekends: 10-11am (weekend planners)

---

[Icon] WHAT WE COULDN'T ANSWER
5 questions needed your input:
• "What's your cancellation policy?"
• "Do you have parking?"
• [See all →]

---

TOTAL QUESTIONS SINCE INSTALL: 312
ESTIMATED TIME SAVED: 10+ hours

[View Full Analytics →]

```

**Success Metric:** 40% email open rate, monthly report readers have 50% lower churn.

---

## Emotional Cliffhangers (The Secret Sauce)

Beyond the core features, these micro-interactions create curiosity:

### 1. The Competitive Whisper
> "Someone asked if you're better than [competitor name]. Interesting!"

### 2. The Demand Signal
> "3 customers asked about wheelchair accessibility this month. Food for thought."

### 3. The Timing Insight
> "Your busiest chat hour is 9pm on Thursdays. Your customers are night owls!"

### 4. The Urgency Creator
> "Someone asked if you're open Thanksgiving. You might want to update your hours."

### 5. The Story Moment
> "Last Tuesday at 11:47 PM, someone asked if you do emergency root canals. LocalGenius told them yes and gave them your number. That's the kind of moment that builds a practice."

---

## V1.1 Technical Requirements

### Email Infrastructure

| Component | Requirement |
|-----------|-------------|
| Email capture | Prompt for email at first setup (optional) |
| Email service | Transactional email via SendGrid/Postmark |
| Preference center | Frequency controls, digest vs instant alerts |
| Unsubscribe | One-click, GDPR compliant |

### Data Tracking Additions

| Metric | Storage | Purpose |
|--------|---------|---------|
| First question timestamp | wp_options | Trigger celebration |
| Questions per day | wp_options array | Weekly/monthly reports |
| Unanswered questions | Separate array | Surfacing for custom answers |
| Peak hours | Aggregated | Insight generation |
| Custom answers count | wp_options | Flywheel tracking |

### Admin Dashboard Updates

| Component | Description |
|-----------|-------------|
| Achievement cards | Dismissable milestone notifications |
| Unanswered queue | List with quick-add interface |
| Usage progress bar | Visual 0-100 with 80% warning |
| Insight widget | "This week at a glance" summary |

---

## The Content Flywheel (Full Implementation)

**V1.0 (Current):**
```
User installs → AI uses template FAQs → Customers ask questions → [END]
```

**V1.1 (With Retention):**
```
User installs
    → AI uses template FAQs
    → Customers ask questions
    → New patterns emerge
    → System surfaces unanswered questions (Feature 3)
    → User adds custom answers (Feature 3)
    → AI gets smarter
    → Better answers
    → More engagement
    → Weekly report shows progress (Feature 2)
    → User feels ownership
    → User tells others (Feature 4)
    → [REPEAT]
```

---

## Success Metrics Summary

| Metric | Current | V1.1 Target |
|--------|---------|-------------|
| 7-day return rate | Unknown (likely <20%) | 50% |
| 30-day active rate | Unknown (likely <30%) | 60% |
| Weekly email open rate | N/A | 25% |
| Unanswered questions addressed | 0% | 30% |
| Milestone share rate | N/A | 15% |
| Free-to-paid conversion | Unknown | 5% |
| Monthly churn | Unknown (likely 15%+) | 8% |

---

## Implementation Priority

### Sprint 1 (Week 1-2)
1. First Question Celebration (admin notice)
2. Usage Warning at 80%
3. Basic email capture in settings

### Sprint 2 (Week 3-4)
1. Weekly Performance Digest email
2. Unanswered Question surfacing (admin)
3. Quick-add interface for custom answers

### Sprint 3 (Week 5-6)
1. Milestone celebration system
2. Monthly Insights Report
3. Email preference center

---

## The Anti-Churn Playbook

### When a User Goes Quiet (No activity for 14 days)

**Trigger:** No widget interactions for 2 weeks

**Action Sequence:**
1. Day 14: "Your customers might have questions — is your chat widget visible?"
2. Day 21: "Here's what other [business type] owners are learning from their customers"
3. Day 30: "We miss you! Here's a quick tip to get more engagement..."
4. Day 45: Silent. Don't badger. They'll come back or they won't.

### When a User Hits the Rate Limit (and doesn't upgrade)

**Trigger:** 100 questions reached, no upgrade

**Action Sequence:**
1. Immediate: Graceful degradation (slower responses, not blocked)
2. Day 3: "Your customers asked 100 questions! Here's what they wanted to know most..."
3. Day 7: "Next month resets in X days. Want to see what unlimited looks like?"
4. Never: Cut off entirely. A degraded experience is better than no experience.

### When a User Uninstalls

**Trigger:** Plugin deactivated

**Action Sequence:**
1. Immediate: WordPress hook captures deactivation
2. Day 1: "We're sorry to see you go. Quick survey: what didn't work?"
3. Day 7: "Here's what you missed: your customers asked X questions on other sites like yours"
4. Day 30: "We've shipped [new feature]. Want to try again?"

---

## Closing Thought

> "Every character needs a reason to come back for episode two."

Rosa the salon owner installed LocalGenius because it promised to save her time. But she'll *keep* LocalGenius because:

- It tells her when something important happens
- It shows her what her customers actually want
- It celebrates her success
- It makes her feel like a business owner who has her act together

The product works. Now it's time to make it *matter*.

---

*— Shonda Rhimes*
*Great Minds Agency Board Member*

---

**Document Status:** Approved for V1.1 Development
**Next Review:** 60-day retention metrics
**Success Criteria:** Monthly churn <10%, weekly email open >20%

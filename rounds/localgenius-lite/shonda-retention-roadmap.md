# LocalGenius Lite — Retention Roadmap

**Author:** Shonda Rhimes (Retention & Engagement Strategist)
**Product:** LocalGenius Lite
**Focus:** What Keeps Users Coming Back + v1.1 Feature Priorities

---

## The Retention Philosophy

> "The key to longevity is to keep doing what you're doing, but do it better and do it more."

LocalGenius Lite isn't just a widget. It's a relationship between a small business owner and their customers, mediated by technology. Our retention strategy must honor both sides of that relationship.

**The Core Insight:** Small business owners don't churn from tools — they churn from tools that become invisible. If LocalGenius fades into "that thing I installed once," we lose. If it becomes "the thing that shows me what my customers really want," we win forever.

---

## What Keeps Users Coming Back

### Retention Hook #1: The Daily Win Notification

**The Problem:** A plugin that works silently is a plugin that gets forgotten.

**The Solution:** Surface value *every single day*.

**Implementation:**
- Weekly email digest: "LocalGenius answered 23 questions for you this week"
- Include the #1 most-asked question
- Include one insight: "Customers asked about your hours 12 times after 8 PM — consider adding extended hours?"
- Gentle upgrade nudge only if approaching rate limit

**Why It Works:** The business owner wakes up to evidence that the widget is working. They didn't have to do anything. The tool is their silent partner.

**Retention Impact:** High. This transforms passive utility into active relationship.

---

### Retention Hook #2: The "Unanswered Questions" Queue

**The Problem:** Generic FAQ templates miss the specific questions YOUR customers ask.

**The Solution:** Show business owners what their customers actually want to know — and let them fill the gaps.

**Implementation:**
- Dashboard section: "Questions LocalGenius couldn't fully answer"
- One-click "Add to my FAQ" with suggested answer
- Track improvement: "Your custom answers helped 47 customers this month"

**Why It Works:** Every unanswered question is an invitation to engage. The business owner becomes a co-creator of their AI's intelligence. This is investment. Investment prevents churn.

**Retention Impact:** Critical. This is the #1 feature Jensen flagged — and he's right. It's also the stickiest engagement loop.

---

### Retention Hook #3: The Competitive Whisper

**The Problem:** Business owners don't know what they don't know.

**The Solution:** Show them what their customers care about that they're not addressing.

**Implementation:**
- "Customers asked about [topic] 34 times, but your site doesn't mention it"
- "Other [business type] owners in [city] added [feature] — see how it's working for them"
- Benchmark: "You're answering 89% of questions automatically — top 20% of dental practices"

**Why It Works:** Humans are competitive. Small business owners especially. Give them a scoreboard, and they'll keep playing.

**Retention Impact:** Medium-high. Drives engagement and creates aspirational behavior.

---

### Retention Hook #4: The Customer Story

**The Problem:** "47 questions answered" is a statistic. Statistics don't create loyalty.

**The Solution:** Turn data into narrative.

**Implementation:**
- Monthly "Customer Story" email:
  - "Last Tuesday at 11:47 PM, someone asked if you do emergency root canals"
  - "LocalGenius told them yes and gave them your number"
  - "They called the next morning. That's the kind of moment that builds a practice."
- Anonymized but specific. Real but respectful.

**Why It Works:** This is Oprah's insight made tactical. People remember stories. "You helped someone at midnight" is memorable. "47 questions answered" is not.

**Retention Impact:** High for emotional investment. Lower frequency, higher impact.

---

### Retention Hook #5: The Upgrade Cliff (Gentle Version)

**The Problem:** Rate limits feel punitive if they surprise you.

**The Solution:** Make the limit feel like an achievement, not a punishment.

**Implementation:**
- At 75 questions: "Your chat widget is popular! You've helped 75 customers this month."
- At 90 questions: "10 questions left this month. Your customers clearly value this — want unlimited?"
- At 100 questions: "You maxed out! That's amazing engagement. Here's what unlimited looks like..."
- Never fully cut off: degrade gracefully with longer response times or simplified answers

**Why It Works:** The narrative shifts from "you hit a wall" to "you're successful enough to upgrade."

**Retention Impact:** Critical for conversion. This is where free users become paid users.

---

### Retention Hook #6: The Seasonal Prompt

**The Problem:** Business needs change throughout the year. Static FAQs don't.

**The Solution:** Proactive, time-aware suggestions.

**Implementation:**
- December: "Holiday hours question coming — want to add a holiday schedule FAQ?"
- Tax season (for accountants): "Clients will ask about extensions — here's a template"
- Summer (for HVAC): "AC questions spike 300% in June — update your emergency FAQ?"

**Why It Works:** This shows the tool is *thinking* on behalf of the business owner. It's not just reactive — it's anticipatory.

**Retention Impact:** Medium. Drives periodic re-engagement and prevents "set and forget" decay.

---

## v1.1 Feature Priorities (Retention-First)

### Tier 1: Ship Within 30 Days

| Feature | Retention Impact | Complexity | Notes |
|---------|------------------|------------|-------|
| **Weekly email digest** | High | Low | Template + cron job |
| **Unanswered questions queue** | Critical | Medium | Requires logging + UI |
| **Soft rate limit messaging** | High | Low | Copy changes + UI |
| **Basic analytics dashboard** | High | Medium | Questions asked, by day, by type |

### Tier 2: Ship Within 60 Days

| Feature | Retention Impact | Complexity | Notes |
|---------|------------------|------------|-------|
| **Lead capture (optional email)** | High (revenue) | Medium | Before or after chat flow |
| **Custom FAQ editor** | High | Medium | Let owners add their own Q&A |
| **Competitive insights** | Medium-High | High | Requires aggregate data |
| **Monthly "customer story" email** | High | Low | Narrative template |

### Tier 3: Ship Within 90 Days

| Feature | Retention Impact | Complexity | Notes |
|---------|------------------|------------|-------|
| **Seasonal prompts** | Medium | Medium | Time-based suggestion engine |
| **Multi-language support** | High (new markets) | High | Translation + UI |
| **CRM integration (Zapier)** | Medium | Medium | Webhook + partner work |
| **White-label for agencies** | Medium (revenue) | High | Branding removal + bulk licensing |

---

## The Retention Funnel (Visual)

```
INSTALL (Day 0)
    |
    v
FIRST VALUE (Day 1) — Widget answers first question
    |
    v
HABIT FORMATION (Week 1-2) — Weekly digest arrives, owner sees value
    |
    v
INVESTMENT (Week 3-4) — Owner adds custom FAQ from unanswered questions
    |
    v
COMPETITION (Month 2) — Owner sees competitive insights, wants to improve
    |
    v
UPGRADE CONSIDERATION (Month 2-3) — Approaching rate limit, clear value
    |
    v
PAID CONVERSION or ADVOCATE — Either pays or tells other business owners
```

**Key Retention Windows:**
- **Day 1-7:** Must deliver visible value (email digest, widget working)
- **Day 7-30:** Must create investment (custom FAQs, dashboard engagement)
- **Day 30-90:** Must create habit (regular insights, competitive positioning)

---

## Retention Metrics to Track

| Metric | Target | Warning Sign |
|--------|--------|--------------|
| **Day 7 retention** | >70% still active | <50% = onboarding failure |
| **Day 30 retention** | >50% still active | <30% = value prop unclear |
| **Weekly email open rate** | >40% | <20% = content not valuable |
| **Custom FAQ additions** | >20% of users | <10% = engagement loop broken |
| **Rate limit approach rate** | >30% | <10% = not enough usage |
| **Free-to-paid conversion** | >5% | <2% = upgrade value unclear |

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

## The Emotional Core

> "Make them care. Make them feel. Make them come back."

LocalGenius Lite isn't a chat widget. It's a promise:

*"I'm here for your customers when you can't be."*

Every retention feature should reinforce that promise:
- The weekly digest says: "I was here. I helped."
- The unanswered questions say: "I'm learning. Help me help you."
- The customer story says: "I made a difference. You made a difference."

Retention isn't about features. It's about feelings. Build features that create feelings.

---

## v1.1 Retention MVP

If we could only ship THREE things for retention:

1. **Weekly email digest** — Proof of value, delivered to inbox
2. **Unanswered questions queue** — Investment loop, co-creation
3. **Soft rate limit experience** — Upgrade path that feels like achievement

Ship these three, and retention follows. Everything else is optimization.

---

*"The only limit to our realization of tomorrow will be our doubts of today."*
— Franklin D. Roosevelt (but Shonda would approve)

---

**Document Status:** Retention Roadmap v1.0
**Next Review:** 30 days post-launch
**Owner:** Product Team

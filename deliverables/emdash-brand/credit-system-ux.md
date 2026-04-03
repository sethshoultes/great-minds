# Emdash Credit System — UX Specification

*How clients see what they have, use what they need, and never feel nickeled.*

**Author:** Steve Jobs, Chief Design & Brand Officer
**Date:** 2026-04-03
**Status:** Draft v1

---

## The One Rule

**Credits should feel like a budget, not a meter.**

The worst credit systems make users feel punished for using the product. Every click, every edit, every request ticks a number down and the user feels it. They start hoarding. They stop iterating. The product becomes something they're afraid to touch.

Emdash credits should feel like a retainer with a good firm. You know roughly what you're paying. You know roughly what you're getting. You don't count the minutes. You trust the relationship.

---

## Credit Model (UX Layer)

### What a Credit Buys

| Action | Credits | What Happens |
|---|---|---|
| **New site from brief** | 10 credits | Full build: design, content, deploy |
| **Page addition** | 3 credits | New page added to existing site |
| **Content revision** | 1 credit | Text change, image swap, layout tweak |
| **Design revision** | 2 credits | Color change, font swap, section reorder |
| **Full redesign** | 8 credits | New template, new palette, rebuild content |
| **Custom domain setup** | 0 credits | Included — just tell us the domain |
| **Hosting** | 0 credits | Included — Cloudflare edge, always on |

### Plans

| Plan | Credits/Month | Price | Best For |
|---|---|---|---|
| **Starter** | 15 credits | $29/month | One site, light revisions |
| **Pro** | 40 credits | $79/month | Multiple sites, active iteration |
| **Agency** | 120 credits | $199/month | White-label, client portfolio |
| **Custom** | Negotiated | Contact | Enterprise, high-volume |

**Credits roll over for 1 month.** If you have 15 this month and use 8, you get 22 next month (15 new + 7 rolled). After that, unused credits expire. This prevents hoarding while rewarding light months.

---

## What the Client Sees

### The Dashboard (There Is No Dashboard)

Emdash doesn't have a dashboard. It has a **conversation**. The credit system lives inside the conversation — not as a separate page, not as a sidebar widget, not as a settings screen.

When the client asks for something, the AI tells them what it costs before doing it. When they want to know their balance, they ask. When they're running low, the AI tells them — once, gently, not on every request.

### The Credit Display

Credits appear in exactly three places:

#### 1. The Monthly Email

```
Subject: Emdash — March summary

Your sites this month:
- brightsmile.emdash.site — 3 revisions
- mariaskitchen.emdash.site — 1 revision

Credits used: 8 of 15
Credits remaining: 7 (rolls over to April)

Your sites are live and healthy. No action needed.
```

This is not a bill. It's a summary. The tone is "here's what happened" not "here's what you owe." The credit count is information, not a warning.

#### 2. Before a Big Action

When the client requests something that costs more than 3 credits, the AI confirms before proceeding:

```
Client: "I want to completely redesign the site with a dark theme"

AI: That's a full redesign — about 8 credits.
    You have 12 remaining this month.
    Want me to go ahead?

    [Yes, redesign it]  [Show me what it'd look like first]
```

For small actions (1-2 credits), the AI just does it. No confirmation. No friction. The client said "change the headline" — the headline changes. Asking "that's 1 credit, are you sure?" is insulting.

#### 3. When They're Running Low

When the client has fewer than 5 credits remaining, the AI mentions it — once — at the end of their next request:

```
AI: Done — your new pricing page is live.

    Quick note: you have 3 credits left this month.
    They refresh on April 1st, or you can add more anytime.
```

**The AI never refuses service.** If a client is at 0 credits and asks for a revision, the AI does it and the overage is billed. The product doesn't stop working because of a billing counter. That's a hostile experience and we don't build those.

---

## UX States

### State 1: Plenty of Credits (> 50% remaining)

The client sees nothing about credits. They request things. Things happen. The system is invisible.

**Why:** When you have plenty of gas, you don't watch the gauge. Credits at this level should be equally invisible.

### State 2: Getting Low (25-50% remaining)

No change in behavior. The AI still doesn't mention credits unless the client asks.

**Why:** 25% remaining at mid-month is normal. Alerting people about normal things trains them to ignore alerts.

### State 3: Running Low (< 25% remaining)

The AI mentions the balance once — after completing the next request. Not before. Not as a warning. As information.

```
AI: Updated your hours. Your site now shows the new Saturday brunch hours.

    You've used most of your credits this month (12 of 15).
    They refresh on the 1st. Need more before then? Just say "add credits."
```

### State 4: At Zero

The AI continues working. The overage is billed at the plan's per-credit rate.

```
AI: Done — your testimonials page is live.

    You've used all 15 credits this month. This revision was
    billed at $3 (your plan's per-credit rate). Your balance
    refreshes on the 1st.

    Want to upgrade to Pro for more credits? [See plans]
```

**Never:** "You've run out of credits. Please upgrade to continue." That's a paywall, and paywalls destroy trust.

### State 5: Way Over (> 150% of plan used)

If a client consistently uses 150%+ of their plan, the AI suggests an upgrade — once per billing cycle:

```
AI: You've been busy this month — 24 credits used on your Starter plan (15 included).
    The Pro plan at $79/month would cover this and save you about $30 in overages.
    Want me to switch you? [Upgrade to Pro] [Keep Starter]
```

This is a recommendation, not a requirement. The client can stay on Starter and pay overages if they prefer.

---

## The "Add Credits" Flow

```
Client: "Add credits"

AI: Your current balance: 3 credits remaining (Starter plan, 15/month).
    
    Options:
    - Add 10 credits now ($25)
    - Add 20 credits now ($45)
    - Upgrade to Pro (40 credits/month for $79)
    
    [Add 10] [Add 20] [Upgrade] [Never mind]
```

One message. All options. No multi-step flow. No settings page. No billing portal (unless they want to manage payment methods — then a simple Stripe link).

---

## The "How Many Credits Do I Have?" Flow

```
Client: "How many credits do I have?"

AI: You have 9 credits remaining this month (Starter plan).
    You've used 6 so far:
    - 1 content revision (homepage headline)
    - 3 new page (pricing page)
    - 2 design revision (dark footer)
    
    Credits refresh on April 1st.
```

Clear, factual, no judgment. The breakdown shows what was built — it's a record of value delivered, not a bill.

---

## What We Never Do

1. **Never show a credit counter in the UI.** No persistent badge, no sidebar widget, no header number. Credits are information-on-request, not ambient anxiety.

2. **Never block work.** If credits are at zero, work continues. Overage is billed. The product never stops.

3. **Never make credits feel like a currency.** They're a budget. Budgets are planned and trusted. Currencies are counted and worried about.

4. **Never punish iteration.** If a client makes 10 small revisions because they're finding their voice, that's 10 credits well spent. The system should celebrate iteration, not penalize it.

5. **Never show credits to the client's customers.** The end user visiting `brightsmile.emdash.site` sees a beautiful website. They have no idea credits exist. The credit system is between Emdash and the site owner — nobody else.

---

## Visual Design

### Credit Mentions in Chat

When the AI mentions credits, it uses a subtle inline style — not a colored badge, not a warning box. Just text, slightly smaller, slightly muted:

```
Your new page is live at brightsmile.emdash.site/services

3 credits used · 12 remaining this month
```

The credit line is `text-slate` (muted), `text-sm` (small), separated by a `·` (center dot). It's information, not an alert.

### Monthly Email

The email shows credits as a simple fraction: `8 of 15 used`. Not a progress bar. Not a chart. A fraction. Simple. Honest. Clear.

### Upgrade Prompts

When the AI suggests an upgrade, it's a single message with button choices. The buttons are:
- Primary: the recommended action (indigo bg, white text)
- Secondary: the alternative (outline, slate border)
- Ghost: "Never mind" (text only, muted)

No modal. No popup. No "are you sure?" confirmation. One message. Client taps. Done.

---

## Integration with Pipeline

| Pipeline Stage | Credit Cost | When Charged |
|---|---|---|
| INTAKE | 0 | Free — describing costs nothing |
| DISPATCH | 0 | Free — planning costs nothing |
| BUILD | Varies (site: 10, page: 3) | On build completion |
| QA | 0 | Free — quality is not optional |
| DEPLOY | 0 | Free — deploying is not a feature |
| REVISION | 1-2 per revision | On revision completion |

**Credits are charged on completion, not on request.** If the build fails or the client rejects the result, no credits are charged. You pay for what ships, not what's attempted.

---

*Steve Jobs — Chief Design & Brand Officer*
*"Credits should feel like a budget, not a meter."*

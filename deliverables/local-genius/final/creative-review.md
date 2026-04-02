# LocalGenius — Creative Review

**Author**: James Park, Creative Reviewer
**Reports to**: Steve Jobs, Chief Design & Brand Officer
**Version**: 1.0
**Date**: 2026-04-01

---

## 1. Executive Summary

The six deliverables are strong. Genuinely strong. The debate process worked — the locked decisions created a creative constitution that all six documents respect, and the two tracks (Steve's taste + Elon's rigor) produced work that is better together than either would be alone. I found **14 issues total**: 3 Critical (must fix before ship), 5 Important (should fix), and 6 Minor (nice to fix). The critical issues center on persona inconsistency between tracks (Maria's identity shifts between documents), a vocabulary violation in marketing-goals.md, and a metric conflict between market-fit.md and marketing-goals.md that will confuse anyone reading both. None of these are structural failures — they're alignment gaps between two teams that built in parallel. Fixable in one revision pass.

---

## 2. Review: market-fit.md

### What Works

This is excellent analytical work. The bottom-up TAM from Austin restaurants (8,556 addressable → 7,700 primary) is far more credible than the PRD's $20B top-down TAM, and the document says so honestly. The AI cost model's self-correction (Section 3.3 — "Wait, these numbers are suspiciously low") is the kind of intellectual honesty that builds trust. The retention modeling across three churn scenarios is rigorous and useful. The competitive analysis is specific, fair, and actionable.

### Brand Alignment

**Issue MF-1 (Important):** Section 5.1 competitive matrix uses the phrase "AI conversational interface" as a feature label in the first row. Per locked Additional Agreement, we never use "AI" as a customer-facing descriptor. While this is an internal document, it will be read by the GTM Lead and Designer — and language in internal docs shapes how the team talks about the product externally.

> **Offending text** (market-fit.md, competitive matrix, row 1): `"AI conversational interface"`
>
> **Why it matters:** If the GTM Lead reads this, they'll say "AI conversational interface" at a restaurant counter. Maria doesn't know what that means.
>
> **Suggested fix:** Replace with `"Conversational command center"` — the term used in the PRD and product-design.md. Alternatively: `"Talk-to-it interface"` if we want to emphasize the interaction model.

**Issue MF-2 (Minor):** The competitive analysis uses "AI orchestration layer" (Section 5.2 on GoDaddy/Wix) and "conversational AI orchestration" (Section 5.3 on the competitive moat). These are precise engineering descriptions, and in an internal analysis document they're defensible. But for consistency with the brand voice, consider softening to "cross-channel coordination" or simply describing the capability without naming the technology.

### User Empathy

**Issue MF-3 (Important):** The personas in market-fit.md don't match the personas in customer-personas.md.

> **Offending text** (market-fit.md, Section 1.1): References the target as `"Operators with 1-20 employees, no dedicated marketing"` — which is correct but abstract.
>
> **In contrast:** customer-personas.md introduces Maria by name in the second paragraph: "Maria is 43. She owns Maria's Kitchen."
>
> **Why it matters:** The market-fit analysis is where the team first encounters the customer through Elon's lens. If this document treats them as "operators" and "segments," it sets a different mental frame than the persona document's storytelling approach. The two documents should feel like they're describing the same people.
>
> **Suggested fix:** Add one sentence in Section 1.1 after the filter table: "These 7,700 restaurants include people like Maria Gonzalez — she runs a Tex-Mex restaurant on South Lamar with 11 employees and spends zero hours on marketing because every tool she's tried has failed her." Ground the TAM in a human. One sentence.

**Issue MF-4 (Minor):** Section 4.3 ("Retention Kill Shot") references "Kevin-the-plumber" as shorthand for the lead attribution persona. This is good — it connects to customer-personas.md. But Kevin is a plumber, not a restaurant owner, and the market-fit document is focused on the Austin restaurant launch. The reference works as a future signal but could confuse a reader who expects restaurant-only focus in months 1-3.

> **Suggested fix:** Add a parenthetical: "This is the Kevin-the-plumber feature (see customer-personas.md — a churn-risk persona relevant when we expand to home services, month 8-9). For restaurants, the equivalent is: 'You got 12 new reservations through your website this week.'"

### Decision Alignment

**Issue MF-5 (Critical):** Section 1.2 adjusts the 500-in-90-days target downward to "300 as the base target, 500 as the stretch target." This is rigorous analysis and may be correct. However, the locked Decision #3 states: "Months 1-3: Retention proof (500 restaurants, 80%+ 30-day retention)." The number 500 appears in the locked decision, not 300.

> **Why this is critical:** If market-fit.md says 300 and marketing-goals.md says 300 (it does — Section 2.2 projects 316), but the locked decision says 500, we have a constitutional conflict. The team will read different numbers in different documents and not know which one is real.
>
> **Suggested fix:** This requires Marcus's adjudication, not a copyedit. Either: (a) amend the locked decision to "300 base / 500 stretch" based on the analysis, or (b) hold the 500 target and adjust the channel plan to close the gap. The market-fit document should explicitly note: "This analysis suggests the locked target of 500 may be aggressive — see Section 1.2 for the detailed math. We recommend Marcus review with both directors."

**Issue MF-6 (Minor):** Section 7.1 — Google Ads strategy says "Bid on competitor names + category terms." The marketing-messaging.md (Section 7, Google Search Ads) says "Never bid on competitor brand names in v1." Direct contradiction.

> **Suggested fix:** Align with messaging doc: remove "competitor names" from the Google Ads strategy. The messaging team has thought about this more carefully — we're too small to win brand-name bidding wars, and it's off-brand to compete on names when our positioning is "different in kind, not better by degree."

---

## 3. Review: team-personas.md

### What Works

This is the most operationally useful document in the set. The role definitions are specific enough to post on a job board tomorrow. The interview questions are genuinely revealing — they test for the right traits, not the right keywords. The "Red Flag Profiles" are brave and honest. The 90-day team calendar (Section 7) is a concrete execution plan that bridges the gap between strategy and daily work. The "Do NOT Hire" list with timing triggers (Section 5) is excellent discipline.

### Empathy/Speed Split

The document correctly implements the locked Decision #5: three empathy-primary roles (Founder/CEO, Product Designer, GTM Lead) and three speed-primary roles (Tech Lead, AI/Prompt Engineer, Mobile Engineer). The split is clearly stated in Section 1 and reflected in every role definition. No issues.

### Hiring Filter

**Issue TP-1 (Important):** The universal hiring filter — "Has this person felt what our customer feels?" — is stated in the Team Philosophy section but is not consistently embedded in the speed-primary role definitions.

> **Offending text** (team-personas.md, Role 2 — Technical Co-Founder): The interview question asks about shipping products under constraint. The red flag profile warns against Big Tech engineers. But neither the question nor the profile tests for empathy toward the end user. The closest reference is "make 'good enough vs. needs to be right' calls" — which is about engineering trade-offs, not user understanding.
>
> **In contrast:** Role 5 (Product Designer) and Role 6 (GTM Lead) both have interview questions that explicitly test for user empathy ("Tell me about the notification a restaurant owner sees when they get their first 1-star review" / "You're standing at the counter of a restaurant at 2:30 PM").
>
> **Why it matters:** Per locked Decision #5, ALL hires are filtered for "Has this person felt what our customer feels?" — not just the empathy-primary roles. If the Tech Lead interview doesn't test for this, we may hire a brilliant engineer who builds the wrong thing because they've never watched Maria try to respond to a Google review.
>
> **Suggested fix:** Add a secondary interview question for Role 2: "Tell me about a time you watched a non-technical person try to use something you built. What did you learn?" This doesn't replace the technical question — it supplements it. Same for Role 3 (AI Engineer): add "Show me how you'd test whether a restaurant owner would actually post this AI-generated content without editing it."

### Headcount Discipline

No issues. Six people, six months, no scope creep. The "Do NOT Hire" list with specific timing triggers is excellent and prevents the common startup mistake of hiring ahead of need.

**Issue TP-2 (Minor):** Section 6 (Compensation Summary) shows total annual payroll of $790K-$960K and references a "$2M seed round." The market-fit document doesn't mention funding assumptions. For cross-document consistency, one of these documents should define the funding context or both should reference it.

> **Suggested fix:** Add a one-line note in market-fit.md Section 2 or a shared assumptions section: "Assumes $2M seed round, as detailed in team-personas.md Section 6."

### Culture Alignment

**Commendation:** Section 8 ("Culture Principles") item 6 — "Eat at restaurants. The team eats lunch at a different Austin restaurant every Friday." This is the kind of specific, operational empathy practice that bridges the gap between saying "we care about the user" and actually doing it. This should be referenced in the product-design.md onboarding section as part of how the team validates the experience.

---

## 4. Review: marketing-goals.md

### What Works

The channel architecture is impressively granular. Channel-by-channel funnel math (Section 2.1) with specific conversion rates at each stage gives the GTM Lead a concrete playbook. The week-by-week execution plan (Section 2.3) is operational — someone could execute this starting Monday. The metrics framework (Section 3) correctly distinguishes leading indicators (predict retention) from lagging indicators (measure health), and the "Metrics We Do NOT Track" section prevents vanity metric distraction. The product-led growth mechanics (Section 5) — especially the shareable Weekly Digest and "Posted by LocalGenius" watermark — are smart, brand-appropriate growth loops.

### Sequential Strategy

The document correctly implements the locked Decision #3 sequence: retention proof (months 1-3) → narrative ignition + vertical expansion (months 3-6) → category ownership (months 6-12). The vertical expansion gates (Section 6.1) are rigorous — all five gates must be met before expanding. No premature scaling.

### Metric Alignment

**Issue MG-1 (Critical):** The 90-day user target in marketing-goals.md does not match the locked decision.

> **Offending text** (marketing-goals.md, Section 1): `"Paying users: 300 (base) / 500 (stretch)"`
>
> **Locked Decision #3** states: `"Months 1-3: Retention proof (500 restaurants, 80%+ 30-day retention)"`
>
> **This is the same issue as MF-5** and compounds it. Both of Elon's documents independently adjusted the target downward. The analysis may be correct — market-fit.md Section 1.2 makes a strong case that 500 is aggressive — but the locked decision hasn't been amended.
>
> **Why this is critical:** If we ship these documents as-is, the team reads three different numbers: 500 (locked decisions), 300 (market-fit base case), 316 (marketing-goals channel rollup). This is not a creative issue — it's a decision integrity issue.
>
> **Suggested fix:** Same as MF-5 — Marcus must adjudicate. Recommend amending locked Decision #3 to read: "Months 1-3: Retention proof (300 base / 500 stretch target, Austin restaurants, 80%+ 30-day retention)." Then update both documents to reference the amended decision.

**Issue MG-2 (Important):** Section 7.1 (Paid Acquisition) includes Google Ads with a note to "Bid on competitor names + category terms." This contradicts marketing-messaging.md's explicit rule: "Never bid on competitor brand names in v1."

> **This is the same issue as MF-6** — it appears in both market-fit.md and marketing-goals.md. Elon's team consistently recommends competitor brand bidding; Steve's team consistently prohibits it.
>
> **Suggested fix:** Remove "competitor names" from paid strategy. Add a note: "Per messaging guidelines, no competitor brand bidding in v1. Revisit when brand awareness and budget justify it (est. month 9+)."

### No Premature Scaling

**Issue MG-3 (Minor):** Section 7.2 (Month 12 Projection) notes the 10,000-user/12-month PRD target "may require paid acquisition starting at month 3 (not month 4)." This is an honest dissent, which is appropriate. However, the locked Additional Agreement explicitly says: "Paid acquisition: NOT before month 4."

> **Offending text**: `"I recommend holding the month-4 paid start but preparing the creative assets and targeting in month 3 so we can move immediately when the gate opens."`
>
> **Assessment:** The recommendation to PREPARE in month 3 while LAUNCHING in month 4 is actually smart and doesn't violate the lock. But the earlier suggestion to consider moving to month 3 should be clearly labeled as a dissent, not a recommendation.
>
> **Suggested fix:** Reframe: "The locked decision holds: no paid acquisition before month 4. However, creative assets and targeting should be prepared in month 3 so we launch paid the day the gate opens. If retention data from months 1-3 is exceptionally strong, Marcus and the directors may choose to revisit the month-4 gate — but that decision belongs to them, not this document."

### Voice Consistency

**Issue MG-4 (Critical):** Section 4.1 (Awareness messaging) includes cold email subject line copy: `"Your Google reviews vs. [competitor name]'s — the gap is costing you."`

> **Why this is critical:** The marketing-messaging.md establishes Rule #1 of competitive positioning: "We never name competitors in marketing copy." This cold email subject line names a specific competitor. Even as a placeholder "[competitor name]" — it instructs the GTM Lead to use competitor names in outreach.
>
> **Additionally**, the marketing-messaging.md email subject line rules say: "Maximum 6 words. No emoji." The proposed subject line is 11 words.
>
> **Suggested fix:** Replace with: `"Your Google reviews: where you stand"` — 6 words, no competitor name, still specific. Or: `"28 reviews. Your neighbor has 147."` — uses a number (per messaging guidelines: "always reference a specific number"), doesn't name the competitor, implies competitive context without direct comparison.

**Issue MG-5 (Important):** The funnel-stage messaging in marketing-goals.md (Section 4) largely mirrors marketing-messaging.md (Section 3), which is good for consistency. However, there are tone differences in the Awareness stage:

> marketing-goals.md GTM Lead opening line: `"Hey — I was looking at your Google listing and you've got 12 reviews. The taco place two blocks over has 89. I can show you why in 60 seconds."`
>
> marketing-messaging.md Marketing Voice: `"The restaurant down the street is getting found on Google. You're not. That changes in 5 minutes."`
>
> **Assessment:** Both use competitive fear, which is correct for Awareness. The difference is that the GTM Lead line is more personal and conversational, which is appropriate for in-person delivery. This is not a problem — in fact, having a more personal register for in-person versus written copy is smart. But the document should explicitly note that GTM verbal copy follows a slightly different register than written marketing copy, so the GTM Lead doesn't try to match the written style in conversation.
>
> **Suggested fix:** Add a note in Section 4.1: "GTM Lead in-person copy is naturally more conversational and personal than written marketing copy. The emotional register (competitive fear) is the same; the delivery is warmer and more specific to the restaurant in front of them."

---

## 5. Cross-Document Consistency Check

### 5.1 Persona Consistency — Is Maria the Same Person?

**Issue XD-1 (Critical — the most important issue in this review):**

Maria's identity is inconsistent across documents:

| Document | Maria's Business | Maria's Role | Location |
|---|---|---|---|
| **customer-personas.md** | Maria's Kitchen (Tex-Mex restaurant), South Lamar, Austin | Restaurant owner, 43, married to Carlos, 11 employees, $680K revenue | Austin, TX |
| **product-design.md** | "Maria's Family Dentistry" (Step 1 example) | Dentist | Phoenix, AZ |
| **product-design.md** | References "patients" (Section 5 spacing), milestone says "top 10% of dentists in Phoenix" | Dentist | Phoenix, AZ |
| **marketing-messaging.md** | "Maria's Kitchen" (email example) + references "dentist near me" in nurture email | Both restaurant owner AND dentist | Both |

This is the single most confusing issue in the deliverable set. In customer-personas.md, Maria is definitively a restaurant owner in Austin. In product-design.md, the onboarding example calls her business "Maria's Family Dentistry" (line 56), the discovery card shows a Phoenix address (line 75-76), and the milestone celebration says "top 10% of dentists in Phoenix" (line 298). In marketing-messaging.md, the nurture email references "dentist near me" (line 153) while other examples reference her as a restaurant owner.

> **Why this is critical:** If the team can't agree on whether Maria is a dentist or a restaurant owner, every example in every document is undermined. The PRD mentions dentists as a target vertical. customer-personas.md correctly made Maria a restaurant owner to align with the locked decision to start with restaurants. product-design.md appears to have used the Round 1 persona (where Maria was a dentist) instead of the updated Round 2/Build version.
>
> **Suggested fix:**
> 1. product-design.md: Change ALL Maria references to match customer-personas.md. "Maria's Family Dentistry" → "Maria's Kitchen." Phoenix address → Austin address. "patients" → "customers." "dentists in Phoenix" → "restaurants in Austin." Every occurrence.
> 2. marketing-messaging.md: Remove the "dentist near me" reference in the nurture email. Replace with "Mexican restaurant near me" or "restaurants near me."
> 3. Establish a rule: Maria Gonzalez is a Tex-Mex restaurant owner in Austin. Always. Every document. If we need a dentist example, use a different name.

### 5.2 Metric Consistency

**The 500 vs. 300 conflict** (documented as MF-5 and MG-1) is the primary metric inconsistency. Beyond that:

| Metric | market-fit.md | marketing-goals.md | product-design.md | Status |
|---|---|---|---|---|
| Base price | $29/mo | $29/mo | Not specified (correct — design doc shouldn't spec pricing) | Aligned |
| Pro price | $79/mo | $79/mo | N/A | Aligned |
| Blended ARPU | $44/mo | Implied $44 (uses same pricing) | N/A | Aligned |
| 30-day retention target | >80% | >80% (month 3) | N/A | Aligned |
| NPS target | Not specified | >50 (month 6), >60 (month 12) | N/A | Aligned with locked decision |
| CAC ceiling | <$150 | <$150 | N/A | Aligned |
| Austin addressable restaurants | 7,700 | Not specified (uses channel math instead) | N/A | No conflict |

**Overall metric alignment is good** — the two quantitative documents agree on pricing, retention targets, and CAC ceiling. The only significant conflict is the 90-day user target.

### 5.3 Voice Consistency

Steve's three documents (product-design.md, customer-personas.md, marketing-messaging.md) have a consistent voice: warm, narrative, human-centered. They read like they were written by the same team.

Elon's three documents (market-fit.md, team-personas.md, marketing-goals.md) have a consistent voice: analytical, rigorous, operationally specific. They also read like they were written by the same team.

The gap between the two voices is intentional and appropriate — analysis should sound analytical, and brand work should sound human. The potential issue is when a team member reads both sets and needs to synthesize.

**Issue XD-2 (Minor):** market-fit.md uses "target segment," "addressable market," and "user" language throughout. customer-personas.md uses "owner," "person," and names. Both are correct for their context. However, when the marketing-goals.md funnel-stage messaging (Section 4) translates Elon's analytical frame into customer-facing copy, it should exclusively use the vocabulary from marketing-messaging.md's "Words We Use" list. The cold email subject line (MG-4, flagged above) is the most visible failure here.

### 5.4 Decision Compliance

Systematic check against all locked decisions and additional agreements:

| Locked Decision | market-fit.md | team-personas.md | marketing-goals.md | Steve's 3 docs |
|---|---|---|---|---|
| #1: AI-generated website on commoditized hosting | Referenced correctly (website as part of product, not a separate build) | N/A | N/A | Correctly implemented in onboarding flow |
| #2: Funnel-stage emotional architecture | N/A | N/A | Correctly implemented in Section 4 | Correctly implemented in messaging framework |
| #3: Sequential strategy (retention → narrative → category) | Correctly reflected in retention modeling | 90-day calendar aligns | Correctly structured with gates | N/A (design doc doesn't address strategy timing) |
| #4: Multi-tenant data model, single-tenant UI | Referenced in retention features | First-month deliverable includes `organization_id` | N/A | Correctly handled in "What We Don't Build" |
| #5: 6 people, empathy/speed split | N/A | Correctly implemented | Aligned with team composition | N/A |
| No paid ads before month 4 | N/A | N/A | Correctly held (month 3 prep is smart, not a violation) | Correctly referenced |
| "AI-powered" never used customer-facing | Violated in competitive matrix (MF-1) | N/A | Violated in cold email subject line (MG-4 — naming competitors implies AI framing) | Zero violations |
| Words we never use | "AI conversational interface" (MF-1) | N/A | N/A | Zero violations |
| Restaurant vertical first | Correctly focused on Austin restaurants | Correctly restaurant-focused in 90-day plan | Correctly restaurant-only in months 1-3 | Correctly focused |
| Onboarding: 5 minutes to professional | N/A | Designer first-month deliverable references onboarding | N/A | Fully designed, step-by-step |

**Overall compliance: Strong.** Three violations flagged (MF-1, MG-1/MF-5 target conflict, MG-4 competitor naming). No structural violations of any locked decision.

---

## 6. Revision Recommendations

### Critical (Must Fix Before Ship)

| ID | Document | Issue | Fix |
|---|---|---|---|
| **XD-1** | product-design.md + marketing-messaging.md | Maria is a dentist in Phoenix in product-design.md but a restaurant owner in Austin in customer-personas.md | Change ALL Maria references in product-design.md to match: Maria's Kitchen, Austin, restaurant owner, customers (not patients). Fix marketing-messaging.md nurture email to use "restaurants near me" not "dentist near me." |
| **MF-5 / MG-1** | market-fit.md + marketing-goals.md + locked decisions | 90-day target is 500 in locked decisions but 300 in both Elon docs | Marcus must adjudicate. Recommend amending lock to "300 base / 500 stretch" and updating all documents to reference the amended number. |
| **MG-4** | marketing-goals.md | Cold email names competitors, violating locked rule. Subject line also exceeds 6-word limit from messaging guidelines. | Replace with: "28 reviews. Your neighbor has 147." — uses numbers, implies competition without naming names, 6 words. |

### Important (Should Fix)

| ID | Document | Issue | Fix |
|---|---|---|---|
| **MF-1** | market-fit.md | "AI conversational interface" in competitive matrix | Replace with "Conversational command center" |
| **MF-3** | market-fit.md | TAM section treats customers as abstract "operators" | Add one grounding sentence after the filter table referencing Maria by name |
| **TP-1** | team-personas.md | Speed-primary role interviews don't test for user empathy | Add secondary empathy question for Tech Lead and AI Engineer roles |
| **MG-2** | marketing-goals.md | Paid strategy says "bid on competitor names" — contradicts messaging doc | Remove competitor brand bidding. Add note: revisit month 9+ |
| **MG-5** | marketing-goals.md | No note distinguishing GTM verbal copy register from written marketing copy | Add clarifying note in Section 4.1 |

### Minor (Nice to Fix)

| ID | Document | Issue | Fix |
|---|---|---|---|
| **MF-2** | market-fit.md | "AI orchestration layer" and "conversational AI orchestration" in internal sections | Soften to "cross-channel coordination" for brand consistency |
| **MF-4** | market-fit.md | Kevin-the-plumber reference in restaurant-focused analysis | Add parenthetical noting Kevin is a future-vertical persona |
| **TP-2** | team-personas.md | $2M seed round mentioned without cross-reference in market-fit.md | Add funding context reference in market-fit.md |
| **MG-3** | marketing-goals.md | Suggests month-3 paid start as option (locked decision says month 4) | Reframe as dissent, not recommendation; clarify the lock holds |
| **XD-2** | marketing-goals.md | Customer-facing copy in funnel section uses analytical vocabulary | Ensure all customer-facing copy in this doc uses the "Words We Use" vocabulary |
| **MF-6** | market-fit.md | Google Ads strategy includes competitor brand bidding | Align with messaging doc — remove competitor names |

---

## Final Assessment

These six documents are 90% of the way to excellent. The debate process produced real alignment on the big decisions — vertical focus, emotional architecture, team composition, franchise deferral. The two tracks (brand/design and analytics/operations) complement each other naturally.

The 10% that needs work is alignment between the tracks. Maria must be the same person everywhere. Numbers must match the constitution or the constitution must be amended. And the vocabulary rules Steve's team established must be respected in Elon's customer-facing copy — even in internal documents, because internal language leaks into external language faster than anyone thinks.

Fix the 3 Critical issues and this package is ready for final assembly.

— James Park

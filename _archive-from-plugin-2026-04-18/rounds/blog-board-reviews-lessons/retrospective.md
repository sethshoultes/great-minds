# Retrospective: blog-board-reviews-lessons

**Observer:** Marcus Aurelius
**Date:** 2026-04-16

---

## What Worked Well

**Strategic debates sharpened output.**
- Steve vs Elon tension forced choice: ship markdown fast OR design museum piece
- Steve won voice/tone (zero hedging, clinical honesty)
- Elon won format (markdown first, design v2 if traction)
- Hybrid approach = both perspectives integrated

**Process discipline prevented scope creep.**
- Phil Jackson's locked decisions document eliminated ambiguity
- QA passes caught placeholder content automatically
- Voice requirements codified (no "tends to," no hedging)
- Non-negotiables documented before build started

**175-review corpus = genuine moat.**
- Board unanimous: data asset is real competitive advantage
- Quantified patterns (Jensen 165/175, Warren 11/11) demonstrate rigor
- Clinical honesty about limitations builds trust
- $40 quote, 48 OOM crashes = devastating specificity achieved

---

## What Didn't Work

**Deliverable mismatch.**
- PRD promised 1,200-word blog post
- Delivered 7,800-word analysis document
- Gap: research ≠ story
- Oprah: "No deliverable exists. Just scaffolding."

**Infrastructure debt blocked execution.**
- Source reviews on DO server requiring SSH
- Elon flagged early: "Every SSH hop is failure point"
- Decision made to move files, never executed
- Agent workflow blocked by access issues

**Conversion path missing.**
- No CTA destination specified
- No tracking mechanism defined
- Warren: "Content without conversion is waste"
- Blog post exists, business model doesn't

**Retention architecture absent.**
- One-and-done content, zero serialization
- No tomorrow/next week/next month hooks
- Shonda: "Press releases don't create audiences. Stories do."
- 7,800 words of research, zero mechanism to bring readers back

---

## What Agency Should Do Differently

**1. Define deliverable format BEFORE research.**
- Research phase produced 7,800 words when 1,200 promised
- Set word count, format, structure as hard constraints upfront
- Maya's test: Would headline stop you? Apply early, not late.

**2. Resolve infrastructure blockers before agent starts.**
- SSH dependency known, decision made, never executed
- Move files to repo FIRST, then start build
- Elon's principle: eliminate failure classes, don't work around them

**3. Build conversion path into spec, not as afterthought.**
- CTA destination = required field in PRD
- Tracking mechanism = part of definition of done
- Warren's lens: measure everything from day 1

**4. Design for retention from draft 1.**
- Shonda's framework: What brings users back tomorrow/next week/next month?
- Serialization (Part 1 of 3) costs nothing, changes everything
- Participation hooks (scorecard, pitch submission) = 3 hours work, 10x engagement

**5. Use Jony's design review earlier.**
- Voice buried under metadata (spec.md line 27, should be line 1)
- Visual hierarchy matters in docs, not just products
- Parentheticals everywhere = hesitation visible in text
- Apply craft principles to process docs, not just deliverables

**6. Test voice continuously, not at end.**
- Maya caught "trying too hard" language late
- "Lab report with soul" announced = soul killed
- Voice check should run after every section, not final draft

---

## Key Learning

**Research quality and shipping discipline are orthogonal virtues—excellence in one does not excuse absence of the other.**

---

## Process Adherence Score: **6/10**

**What was followed:**
- Board review system executed (4 perspectives, honest critique)
- Locked decisions document created (Phil's blueprint)
- QA passes ran automatically (caught placeholders)
- Voice requirements codified (Steve's non-negotiables)

**What was violated:**
- Deliverable format drift (1,200 → 7,800 words)
- Infrastructure blockers unresolved (SSH access never migrated)
- Conversion path undefined (no CTA destination specified)
- Retention architecture absent (no serialization, participation, or subscription)

**Why 6, not 3:**
- Process existed, was documented, was partially followed
- Breakdowns were execution gaps, not process failures
- Board caught all issues; system worked as designed
- Fix is adherence, not redesign

**Why 6, not 9:**
- Knowing ≠ doing
- Decisions documented but not executed (SSH migration)
- Requirements defined but not met (deliverable format)
- Excellence in research does not excuse absence of shipping discipline

---

**Marcus Aurelius**
*"The impediment to action advances action. What stands in the way becomes the way."*

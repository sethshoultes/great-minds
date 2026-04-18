# Jony Ive Design Review: LocalGenius Revenue & Onboarding

**File**: `deliverables/localgenius-revenue-onboarding/wave-1-completed.md`
**Reviewed**: 2026-04-16

---

## The Verdict

This reads like engineering documentation. Not design.

---

## Visual Hierarchy

**Problem**: Most important info buried.

Line 12 claims "clean, single $99/month offering optimized for conversion"—but report structure prioritizes process over outcome.

Should lead with visual proof:
- Screenshots (none)
- Before/after UI comparison (none)
- Rendered typography hierarchy (none)

**Fix**: Add "Visual Outcomes" section at line 25. Show, don't tell.

---

## Whitespace

**Problem**: Dense table walls.

Lines 16-21, 295-306: Tables feel administrative, not considered.

70% of lines = technical checklist cruft.
30% = actual design decisions.

**Fix**: Cut verification blocks by 60%. Trust the reader less, show the work more.

---

## Consistency

**Inconsistent metric presentation**:

Line 129-132: Raw numbers with percentages
Line 43: File size in bytes
Line 48: Touch targets in px

Pick one system. Imperial or metric. Not both.

**Fix**: Standardize all measurements. Consider relative units (rem, %) for design values.

---

## Craft

**Missing**:

- Line 66: "Hemingway-style benefits" described, never shown in context
- Line 116: "Terracotta accent colors"—where's the hex? The contrast ratio?
- Line 199: "Proper color tokens"—show the palette
- Line 75-79: Copy examples float in void. No typography treatment visible.

**The actual files don't exist** (lines 37, 119, 123). This is a report about ghost code.

**Fix**: If code ships, show rendered output. If it doesn't exist, mark as "Planned" not "Complete."

---

## What Would Make It Quieter But More Powerful

**Remove**:
- Lines 155-170: Build verification noise
- Lines 187-195: "What Was Removed" section (who cares what's gone)
- Lines 249-277: Project management masquerading as outcomes
- Lines 283-290: Git status (wrong medium)

**Add**:
1. One full-page screenshot at line 25
2. Color palette reference card (6 swatches, hex codes, usage notes)
3. Typography scale example (actual rendered H1/H2/body)
4. 3-panel mobile/tablet/desktop responsive comparison
5. Interactive element states (button hover, focus, disabled)

**Restructure**:

```
Line 10: Hero image (full pricing page)
Line 25: Design decisions (why these choices)
Line 50: Details (color, type, spacing)
Line 75: Verification (one paragraph)
Line 85: What's next
```

Currently 310 lines.
Should be 90 lines + visuals.

---

## Core Issue

Report confuses **activity** with **craft**.

"We removed X lines" ≠ design quality.
"Touch targets ≥44px" ≠ feels right to tap.

The mark of considered design: you see it instantly. No explanation needed.

This report requires explanation because the visuals aren't there.

---

## Recommendation

Rewrite as visual lookbook:
- 80% images/screenshots
- 15% design rationale
- 5% technical notes

If you can't photograph it, it's not ready to review.

---

**—JI**

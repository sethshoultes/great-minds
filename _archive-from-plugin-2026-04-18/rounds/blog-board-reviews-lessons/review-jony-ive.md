# Jony Ive Design Review
**Deliverable:** Blog post "Patterns"
**Date:** 2026-04-16

---

## Visual Hierarchy: What Commands Attention

**spec.md (Lines 23-31):** Voice buried under structure.
- Goal stated on line 27: "Lab Report with Soul"
- Hidden beneath 17 lines of metadata
- **Fix:** Voice definition belongs at top, before format/structure

**analysis.md (Lines 10-75):** Jensen dominates. 65 lines before Warren appears.
- Imbalanced weight suggests Jensen matters 2x more
- All four personas deserve equal visual mass
- **Fix:** Enforce symmetry. Each section: same line budget, same cadence

**todo.md (Lines 110-127):** Five separate "Voice check" tasks.
- Repetition signals anxiety, not thoroughness
- **Fix:** Single task, clear criteria: "Voice passes test scripts"

---

## Whitespace: Room to Breathe

**spec.md (Lines 33-43):** 4-box structure suffocates in bullet points.
- Line 34: "1. **Jensen → Moats** (competitive dynamics, quantified frequency)"
- Parenthetical clutters what should be stark
- **Fix:** Strip to essence:
  ```
  Jensen → Moats
  Warren → Economics
  Shonda → Retention
  Oprah → Resonance
  ```

**analysis.md (Lines 592-633):** "Quote Collection for Blog Post"
- 41 lines, zero margin between quotes
- Reads like inventory, not curation
- **Fix:** One quote per line. Full stop after each. Let them land.

**todo.md (Lines 9-14):** Phase 0 crams four blockers into five lines.
- Each blocker deserves isolation, weight
- **Fix:** Vertical rhythm. One blocker. One breath. Next blocker.

---

## Consistency: Elegant Repetition

**Inconsistent:** Three files, three different voices.
- **spec.md:** Clinical documentation ("verification criteria", "success metrics")
- **analysis.md:** Narrative journalism ("The Jensen Framework", "Greatest Hits")
- **todo.md:** Command structure ("verify:", "check")

All correct for context. But placed together? Jarring.

**Fix:** Unify opening cadence across all three:
- **Spec:** "This is what we're making"
- **Analysis:** "This is what we found"
- **Todo:** "This is how we ship"

Same sentence structure. Same line position. Pattern makes navigation unconscious.

---

## Craft: Details Under Inspection

**Beautiful:**
- **analysis.md (Line 28):** `> "We're not building a moat here—we're patching a leak."`
  - Em dash, not hyphen. Correct punctuation rewards close reading.

**Beautiful:**
- **todo.md (Line 217):** "Verification philosophy: Every task should be immediately verifiable."
  - Meta-statement as manifesto. Confidence, not instruction.

**Sloppy:**
- **spec.md (Line 105):** "Test: After one skim, reader can name Jensen's focus area"
  - "Can name" is weak. Should be: "Names Jensen's focus without hesitation"

**Sloppy:**
- **analysis.md (Line 754):** Scoring table uses `~6.5/10` (tilde for approximation)
  - Either know the number or don't. Hedging in data undermines clinical voice.

**Sloppy:**
- **tests/check-voice.sh (Lines 16-19):** Banned patterns listed inline
  - Should be external config file, sourced
  - Embedding patterns in script = maintenance debt

---

## What I'd Change: Quieter, More Powerful

### 1. Eliminate Nested Bullets (spec.md)

**Current pattern throughout:**
```
**Success Metrics:**
- 1200-1800 words
- Includes real quotes from board reviews
- Matches existing Great Minds blog format
```

**Quieter:**
```
**Success Metrics**

1200-1800 words
Real quotes
Matches blog format
```

Remove colons, remove bullets, remove articles. Each metric stands alone. Vertical rhythm, not horizontal clutter.

### 2. Banish Quantified Enthusiasm (analysis.md)

**Lines 11-15:**
```
- **Moat mentions:** 460+ occurrences across reviews
- **~95% of reviews** (est. 165+/175) include explicit moat analysis
```

Plus signs signal excitement. Estimation (`~95%`) admits uncertainty.

**Quieter:**
```
Moat: 460 mentions
Frequency: 165 of 175 reviews
```

Facts, not celebration.

### 3. Kill Parentheticals Everywhere

**spec.md (Line 61):** "(flexible, earn every sentence)"
**spec.md (Line 128):** "(flexible based on earned reader attention)"
**analysis.md (Line 20):** "(most striking examples)"

Parentheticals apologize. Remove them. If it matters, state it. If it doesn't, delete.

### 4. Test Scripts Should Be Silent

**tests/check-voice.sh (Line 39):** `echo "✅ PASS: Voice is definitive and clinical"`

Tests either pass or fail. Success needs no announcement.

**Quieter:**
```bash
# Return 0 on pass, 1 on fail
# Output only errors
```

Confidence whispers.

### 5. One Quote Per Page (analysis.md)

Currently: 41 quotes stacked in "Quote Collection for Blog Post"

**More powerful:** Create `quotes/` directory:
- `quotes/jensen.md` — 7 quotes, one per line, full stop
- `quotes/warren.md` — 7 quotes, same rhythm
- `quotes/shonda.md`
- `quotes/oprah.md`

Forces curation. Seven, not eight. Seven, not six. Constraint reveals what matters.

### 6. Todo Completion Should Disappear

**todo.md:** 175+ checkbox items visible at all times.

Completed tasks clutter what remains.

**Quieter:**
- Completed tasks move to `done.md` (never viewed again)
- `todo.md` shows only what's next
- Progress is absence, not accumulation

### 7. Spec Should Begin With Voice, Not Goals

**Current order (spec.md):**
1. Goals (line 3)
2. Implementation (line 18)
3. Voice definition (line 27)

**Corrected order:**
1. Voice (first, always)
2. Goals (what we're making)
3. Implementation (how we build)

Voice isn't a feature. It's the foundation. Place it first.

---

## Final Observation

These deliverables are **competent**. They contain the right information. They follow sensible structure.

But competence isn't craft.

Craft means:
- Every line earns its presence
- Patterns repeat until invisible
- Hesitation removed
- Confidence shown through restraint

**The fix isn't more.
The fix is less.**

---

**Would I ship this?**

Fix visual hierarchy (voice first), eliminate parentheticals, enforce symmetry across four personas.

Then yes.

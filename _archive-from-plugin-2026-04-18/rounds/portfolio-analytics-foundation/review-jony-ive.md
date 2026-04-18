# Compass — Design Review

**Reviewer**: Jony Ive
**Date**: 2026-04-16
**Verdict**: Strong foundation. Needs restraint.

---

## Visual Hierarchy

**spec.md**
- Lines 188-191: Box drawing characters scream "amateur hour"
- Header noise drowns signal
- Seven levels of headings (I-IX) — too many
- Success metrics table (lines 23-30) — only clarity in the document
- Recommend: Single-level hierarchy. Number only what matters.

**report.php**
- Lines 188-191: Same box-drawing disease
- Lines 145-176: Actual hierarchy emerges in output — DAU first, action last
- Line 243-245: Sign-off message — unexpected poetry
- This works. Keep it.

**queries.php**
- Visual hierarchy doesn't exist here — all function definitions
- Line 351-361: `compass_get_all_metrics()` reveals intended order: DAU, retention, revenue, MRR, churn
- Should mirror report output order exactly

---

## Whitespace

**ingest.php**
- Lines 1-12: Comment block too dense
- Lines 38-127: Validation function — 89 lines, no breathing room
- Lines 94-120: PII checks cramped together
- Recommendation: Extract PII validation to separate function. Let code breathe.

**queries.php**
- Lines 50-98: DAU calculation — three query blocks with zero visual separation
- Lines 123-154: Retention calculation — WHERE clause spans 4 lines (line 133-136)
- SQL heredoc needs newline before/after
- Functions run together — insert 2 blank lines between

**report.php**
- Lines 59-97: Giant switch statement
- Lines 21-53: Health diagnosis — nested ifs, no air
- But line 243-245: Final message has perfect spacing
- Inconsistent breath.

**tracker.js**
- Lines 116-127: Hash function crushed
- Lines 184-207: sendEvent crushed
- Class methods need separation

**daily-summary.sh**
- Lines 75-108: Email logic — three nested ifs, hard to scan
- Lines 9-13: Color definitions elegant
- Shell scripts can breathe too

---

## Consistency

**Strong patterns:**
- Error handling: Every PHP file returns `['error' => 'message', 'code' => N]` consistently
- Database path: `get_db_path()` pattern repeated (ingest.php line 22, queries.php line 14)
- Comments: All files start with docblock (/** */)
- Validation: Always check, always log, always fail gracefully

**Broken patterns:**
- SQL formatting: ingest.php uses prepared statements cleanly (lines 137-149), queries.php mixes inline SQL construction (line 133)
- Return shapes inconsistent: queries return `['dau' => X, 'trend_percent' => Y]` vs report returns strings
- Naming: `compass_calculate_dau()` vs `diagnose_health()` (missing prefix)
- Function documentation: queries.php has full @param blocks, report.php has brief descriptions

**Recommendation**: Enforce prefixes. Standardize SQL formatting.

---

## Craft

**What rewards inspection:**

**ingest.php lines 83-86**: SHA-256 validation regex
Perfect. 64 hex chars. No wiggle room.

**report.php lines 61-62**:
```php
return "Kill it. Don't waste another week.";
```
Brutal clarity. This is voice done right.

**tracker.js lines 186-189**: sendBeacon fallback
Thoughtful. Navigator.sendBeacon for reliability, fetch for compatibility, silent failure always.

**init-db.sh lines 63-87**: Verification block
Checks integrity, WAL mode, auto-vacuum. Shows its work. Colorized output.

**queries.php lines 114-119**: Cohort query comment
Explains approach before code. Rare.

**events.json**:
20 events. 4 per product. Every property typed. Zero PII. Consistent schema.
This file is perfect. Don't touch it.

**What disappoints:**

**ingest.php line 31**: Loads entire events.json into memory on every request
Will break at scale. Cache it.

**queries.php lines 126-142**: String concatenation in SQL
Fragile. One typo breaks everything.

**report.php lines 188-246**: Portfolio summary function does too much
Calculates totals, determines health, formats output. Split it.

**spec.md lines 40-59**: Decision rationale uses quotes from "decisions.md"
Document references document. Meta-documentation is not craft.

**daily-summary.sh line 111**: Gets record count after report runs
Should be before. Diagnostics should inform, not trail.

---

## What Would Make It Quieter But More Powerful

### Remove

1. **spec.md box drawings** (lines 188-191)
   Replace with: "COMPASS DAILY PORTFOLIO REPORT"
   Center it with spaces, not Unicode art.

2. **Hedging in code comments**
   ingest.php line 125: "Fallback to simple hash (not cryptographically secure but good enough for analytics)"
   Either it's acceptable or it's not. Remove apology.

3. **Color codes in shell scripts**
   Lines 9-13 in both scripts. GREEN, RED, YELLOW.
   Output should speak through structure, not decoration.
   Keep for errors. Remove for success.

4. **Verbose logging**
   daily-summary.sh logs every step (lines 45-123)
   Success should be silent. Only log failures.

5. **report.php portfolio totals** (lines 198-246)
   This adds noise. Keep per-product summaries.
   Remove aggregation. Trust reader to synthesize.

### Add

1. **Silence**
   ingest.php should return HTTP 204 on success, not JSON.
   Success needs no explanation.

2. **Constraint**
   queries.php should cache DB connection across calls.
   Opening/closing on every metric is wasteful ceremony.

3. **Single source of truth**
   Product list defined in 4 places:
   - ingest.php line 28
   - events.json structure
   - report.php line 184
   - spec.md line 88
   Create products.json. Reference it everywhere.

4. **Monospace alignment**
   report.php output (lines 145-176) floats.
   Right-align numbers. Left-align labels.
   Use printf formatting for column alignment.

5. **Whitespace discipline**
   Two blank lines between functions. Always.
   One blank line within function sections.
   Zero blank lines within tight logic blocks.

### Change

1. **spec.md structure**
   574 lines. Too long.
   Split:
   - `OVERVIEW.md` — goals, metrics, philosophy
   - `SCHEMA.md` — database, events
   - `VERIFICATION.md` — tests

   Current file tries to be everything. Becomes nothing.

2. **Comment density**
   ingest.php: 13-line comment block (lines 1-12)
   Code should be self-documenting.
   Reduce to: "Compass event ingestion. POST JSON events to SQLite."

3. **Error verbosity**
   ingest.php line 34: `'error' => 'Failed to load events configuration'`
   User doesn't care why. Return 500. Log details.
   Public errors should be opaque. Internal logs verbose.

4. **Metric precision**
   report.php line 150: Shows trend as `+12%` or `-40%`
   Queries calculate to 1 decimal (queries.php line 90)
   Output rounds to integer (report.php line 104)
   Pick one precision. Use it everywhere.

5. **Voice consistency**
   report.php line 95: "Need more data. Check back tomorrow."
   This is soft. Compass doesn't hedge.
   Change to: "Not enough data. Come back tomorrow."

---

## Line-Specific Changes

**ingest.php**
- Line 31: Cache events config
- Line 52: Remove "Invalid JSON: " prefix from error
- Lines 98-120: Extract to `validate_no_pii($properties)`

**queries.php**
- Lines 52-57: Extract to function `get_dau_for_period($product, $start_days, $end_days)`
- Line 127: Don't concatenate SQL. Use nested query.
- Lines 351-361: Cache database connection

**report.php**
- Line 104: Use 1 decimal place consistently
- Lines 145-176: Align output columns with printf
- Lines 198-246: Delete portfolio totals section
- Line 245: Keep this line. Perfect.

**tracker.js**
- Lines 79-95: getUserHash() too complex. Split caching from generation.
- Line 140: Don't pad simple hash to 64 chars. Let it be short. Backend validates anyway.
- Lines 231-235: Remove debug log method. Either log or don't.

**events.json**
- No changes. This file is complete.

**init-db.sh**
- Lines 64-87: Reduce logging. Only show summary.
- Line 111: Show "✓ Database ready" and path. Nothing else.

**daily-summary.sh**
- Lines 9-13: Remove color codes except RED
- Lines 75-108: Extract email logic to separate function
- Lines 110-116: Move database stats before report generation

**spec.md**
- Split into three documents (see "Change" section above)
- Remove box drawings
- Remove meta-references to other docs
- Keep success metrics table (lines 23-30)

---

## Final Verdict

Foundation is sound. Execution is verbose.

Code does what it promises. But talks too much.

Strip decoration. Trust the user. Let silence carry weight.

The best analytics tool is invisible until it tells you to kill your product.

Make it quieter. Make it sharper. Make it disappear until it matters.

Then it will be beautiful.

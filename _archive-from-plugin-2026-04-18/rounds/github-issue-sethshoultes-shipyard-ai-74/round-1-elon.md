# Elon's Analysis: EventDash Entrypoint Fix

## Architecture: Trivial Fix, Fundamental Problem

This is a **2-line code change**. The real question is: why did this bug exist in the first place?

**First principles:** Import resolution should be deterministic across environments. npm aliases (`@shipyard/eventdash/sandbox`) are syntactic sugar that breaks when the package isn't published. File paths are physics — they either exist or they don't.

**Simplest system:** File paths everywhere. Zero magic. The fact that Membership already uses this pattern means we have copy-paste debt.

## Performance: Non-Issue

This is bundler-time resolution, not runtime. Zero performance impact. Moving on.

## Technical Feasibility: 100% Yes

One agent session can do this in **under 60 seconds**:
1. Read `plugins/membership/src/index.ts` (reference implementation)
2. Copy pattern to `plugins/eventdash/src/index.ts`
3. Add EventDash registration to `astro.config.mjs`
4. Run build to verify
5. Commit

The PRD is overspecified. We don't need a 62-line document for "copy the working pattern from Membership."

## What to CUT

**Cut from v1:**
- Nothing. This is already minimal.

**Question to challenge:** Why are we manually registering plugins in `astro.config.mjs`? At scale (10+ plugins), this is tedious. Should be auto-discovery via glob pattern or convention (e.g., `plugins/*/src/index.ts`).

**v2, not v1:** Auto-discovery can wait. Manual registration forces intentionality.

## Distribution: Not Applicable

This is an internal bug fix, not a user-facing feature. Distribution is irrelevant.

## Scaling: Pattern Debt at 10+ Plugins

**Current state:** Every plugin needs to:
1. Manually compute `currentDir` and `entrypointPath`
2. Manually register in example apps

**What breaks at 100x:**
- 100 plugins = 100 copy-paste blocks = high mutation risk
- Every new plugin author will make this same mistake

**Fix:** Extract to shared utility:
```typescript
// @shipyard/core/plugin-utils
export const resolveEntrypoint = (importMetaUrl: string, filename: string) => {
  const currentDir = dirname(fileURLToPath(importMetaUrl));
  return join(currentDir, filename);
};
```

Usage: `entrypoint: resolveEntrypoint(import.meta.url, "sandbox-entry.ts")`

**Recommendation:** Make this fix now while we're touching the code. 5 extra minutes prevents future bugs.

## Blunt Truth: This PRD Failed Its Own Test

The PRD is in `/prds/failed/` — meaning the auto-generation or validation process flagged it. Yet the issue is trivial and the fix is clear.

**Question:** Why is this in the "failed" folder? Is the PRD generator over-complicating simple tasks? If so, that's the real bug.

**Numbers:**
- Lines changed: ~10
- Time to fix: <5 minutes
- Risk: Near zero (Membership already proves the pattern)
- Value: Unblocks Cloudflare deploys (high)

**Verdict:** Ship it immediately. No meeting needed. No architecture review. Copy the pattern, test the build, commit, done.

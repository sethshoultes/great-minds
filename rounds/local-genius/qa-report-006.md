# QA Report #006 — Margaret Hamilton
**Date:** 2026-04-02 17:11 PST
**Round:** 6
**Inspector:** Margaret Hamilton, QA Director

---

## Executive Summary

**BUILD: FAIL** | **Tests: FAIL (12 failures)** | **Typecheck: FAIL (5 errors)** | **Lint: PASS (0 errors)**

**REGRESSION DETECTED.** Commit `5da465c` ("Fix Jensen #7 — persist campaign suggestions to database") introduced breaking changes across build, tests, and typecheck. The live Vercel site remains healthy (serving the previous deployment), but the current codebase cannot be deployed.

---

## 1. Live Site Health — localgenius.company (Vercel)

All 8 endpoints: **PASS** (still serving previous deployment)

---

## 2. New Commits Since Round 5

| Commit | Description | Risk |
|--------|-------------|------|
| `5da465c` | Fix Jensen #7 — persist campaign suggestions to DB | **HIGH — BREAKING** |
| `59feabe` | Add CHANGELOG.md | NONE (docs only) |

---

## 3. CRITICAL: Build Failure

**Error:**
```
Error: You cannot use different slug names for the same dynamic path ('businessSlug' !== 'slug').
```

**Root cause:** A route uses `[businessSlug]` but another route in the same dynamic path segment uses `[slug]`. Next.js requires consistent parameter naming across shared path segments.

**Files involved:** Likely `src/app/site/[slug]/` vs a route using `[businessSlug]`.

**Severity: P0 — Blocks all deployments.**

---

## 4. Test Failures (12 failures across 2 files)

### 4a. `useVoiceInput.test.ts` — 8 failures
- All `stopRecording` tests fail with `AssertionError: expected "spy" to be called with arguments`
- The hook's API appears to have changed (possibly `transcribeUrl` prop renamed/removed)
- Typecheck confirms: `'transcribeUrl' does not exist in type 'UseVoiceInputOptions'`

### 4b. `sites.test.ts` — 4 failures
- `provisionSite`, `updateSite`, `listSites` all fail
- Sites API mock/implementation mismatch after the DB persistence changes

---

## 5. TypeScript Errors (5 errors)

1. **`.next/types/app/site/[slug]/menu/page.ts`** — Cannot find module (2 errors) — stale build types from slug rename
2. **`.next/types/app/site/[slug]/page.ts`** — Cannot find module (2 errors) — same issue
3. **`useVoiceInput.test.ts:374`** — `transcribeUrl` does not exist on `UseVoiceInputOptions`

---

## 6. Bugs Filed

### BUG-006-A: Dynamic route slug mismatch (P0 — BLOCKS DEPLOY)
- **Cause:** `[businessSlug]` vs `[slug]` conflict in app router
- **Impact:** Build fails, cannot deploy
- **Fix:** Standardize on one slug name across all route segments

### BUG-006-B: useVoiceInput API breaking change (P1)
- **Cause:** `transcribeUrl` prop removed/renamed without updating tests
- **Impact:** 8 test failures
- **Fix:** Update test file to match new hook API

### BUG-006-C: Sites service test failures (P1)
- **Cause:** DB persistence changes altered API response shape
- **Impact:** 4 test failures
- **Fix:** Update sites test mocks to match new implementation

---

## 7. Recommendations

1. **IMMEDIATE:** Fix the slug naming conflict (BUG-006-A) — this is a deploy blocker
2. **URGENT:** Update useVoiceInput tests (BUG-006-B) and sites tests (BUG-006-C)
3. **PROCESS:** Consider adding a pre-commit hook that runs `npm run build` to catch these before they land

---

## 8. Assessment

**Status: RED — DO NOT DEPLOY. 3 bugs filed, 1 is P0.**

The previous deployment on Vercel is stable and unaffected. But the current main branch is broken and cannot be shipped.

---

*"There was no second chance. We all knew that."*
— Margaret Hamilton

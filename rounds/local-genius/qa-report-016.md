# QA Report #016 — Margaret Hamilton
**Date:** 2026-04-02 19:00 PST
**Round:** 16 (UPGRADED METHODOLOGY)
**Inspector:** Margaret Hamilton, QA Director

---

## METHODOLOGY UPGRADE

**Previous approach (Rounds 2-15):** HTTP status code checks only.
**New approach (Round 16+):** Full response body inspection — title tags, NEXT_NOT_FOUND signals, expected content assertions, API functional tests. A 200 that shows "Site Not Found" is a **bug**, not a pass.

This upgrade caught a live bug that 14 rounds of status-code-only checks missed.

---

## Executive Summary

**Build: PASS** | **Tests: PASS (734/742)** | **Typecheck: PASS** | **Live site: PASS (after mid-round deployment)**

A new deployment (`dpl_5FWwGPpwSUsTQG2KKYAwjkFNZyPt`) rolled out during this round, fixing demo site pages that were previously returning HTTP 200 with NEXT_NOT_FOUND content. Registration API tested end-to-end successfully.

---

## 1. Deep Content Validation — localgenius.company

### Marketing Pages

| URL | HTTP | Title | Content OK | 404 Signal |
|-----|------|-------|-----------|------------|
| `/` | 200 | "LocalGenius — Your business, handled." | YES | NO |
| `/welcome` | 200 | "LocalGenius — Your business, handled." | YES | NO |
| `/about` | 200 | "LocalGenius — Your business, handled." | YES (has About) | NO |
| `/pricing` | 200 | "LocalGenius — Your business, handled." | YES | NO |
| `/login` | 200 | "LocalGenius — Your business, handled." | YES | NO |
| `/signup` | 307 | — | Redirect OK | — |
| `/sites` | 200 | "Example Sites — LocalGenius" | YES (Maria's + Bright Smile) | NO |

### Demo Site Pages

| URL | HTTP | Title | Content OK | 404 Signal |
|-----|------|-------|-----------|------------|
| `/site/marias-kitchen` | 200 | "Maria's Kitchen — Tex-Mex" | YES (has Maria, menu) | NO |
| `/site/marias-kitchen/menu` | 200 | "Menu — Maria's Kitchen" | YES | NO |
| `/site/marias-kitchen/reviews` | 200 | Generic | YES (no 404) | NO |
| `/site/bright-smile` | 200 | "Bright Smile Dental — Family Dentist" | YES (dental, services) | NO |
| `/site/bright-smile/services` | 200 | "Services — Bright Smile Dental" | YES | NO |
| `/site/bright-smile/reviews` | 200 | Generic | YES (no 404) | NO |
| `/site/bright-smile-dental` | 200 | **"Site Not Found"** | **NO** | **YES (NEXT_NOT_FOUND)** |

### Auth-Protected Pages

| URL | HTTP | Behavior |
|-----|------|----------|
| `/dashboard` | 307 | Redirects to login (correct) |
| `/signup` | 307 | Redirects (correct) |

---

## 2. API Functional Tests

### Registration Flow
```
POST /api/auth/register
Body: { email, password, name, businessName, city, state }
```

**Result: PASS** — Returns:
- User object with UUID
- Business object (auto-assigned "restaurant" vertical)
- Organization with "base" plan
- Access token (JWT, 15min expiry)
- Refresh token (JWT, 30day expiry)

**Validation test:** Missing fields correctly returns `VALIDATION_ERROR` with field-level messages for `businessName`, `city`, `state`.

**Note:** This created a real test account (`qa-test-hamilton@example.com`). Should be cleaned up or excluded from analytics.

### Health Check
```
GET /api/health → 200
```

---

## 3. Bugs Found

### BUG-016-A: Wrong slug returns silent 200 with "Site Not Found" (LOW)
- **URL:** `/site/bright-smile-dental`
- **Expected:** 404 response code
- **Actual:** HTTP 200 with `<title>Site Not Found</title>` and `NEXT_NOT_FOUND` digest
- **Impact:** SEO (Google indexes a 200 "not found" page), user confusion
- **Note:** The correct slug is `/site/bright-smile`. The `/sites` page links correctly. But any wrong slug returns a deceptive 200.
- **Fix:** The `[businessSlug]` page should return `notFound()` with proper HTTP 404 status when the business doesn't exist, not a soft 404.

### OBSERVATION-016-A: Demo site reviews pages have generic titles
- `/site/marias-kitchen/reviews` and `/site/bright-smile/reviews` use the default app title instead of page-specific titles
- **Impact:** Minor SEO/UX issue
- **Fix:** Add metadata to reviews pages

### OBSERVATION-016-B: Deployment rolled out mid-round
- Old deployment `dpl_87BEF...` had broken demo sites (NEXT_NOT_FOUND on all `/site/*` pages)
- New deployment `dpl_5FWwG...` fixed them
- This confirms that **Rounds 10-15 had a live bug I missed** because I was only checking HTTP status codes

---

## 4. Quality Gates

| Gate | Result |
|------|--------|
| Build | PASS |
| Tests | PASS (734/742) |
| Typecheck | PASS |
| Lint | PASS (from R14) |
| Content validation | PASS (1 minor bug) |
| API functional | PASS |

---

## 5. Self-Assessment

**My previous methodology was inadequate.** For 14 rounds I reported "ALL GREEN" while demo site pages were silently broken behind HTTP 200 responses. The title said "Site Not Found" and the body contained `NEXT_NOT_FOUND` — signals I would have caught immediately with body inspection.

**Lesson:** In the Apollo program, we tested every state, not just the happy path. An HTTP 200 is not a test — it's a carrier signal. The content is the test.

**New QA checklist (all rounds going forward):**
1. Fetch body, not just status code
2. Assert title matches expected pattern
3. Check for `NEXT_NOT_FOUND`, `Site not found`, error signals
4. Verify expected content (business name, nav elements, etc.)
5. Test API endpoints with real payloads
6. Run build, tests, typecheck

---

## 6. Assessment

**Status: GREEN (with 1 minor bug filed)**

BUG-016-A is a soft-404 issue, not a P0, but it should be fixed for SEO correctness.

---

*"The process of preparing for a mission has more value than the mission itself. Because that's when you find the bugs."*
— Margaret Hamilton

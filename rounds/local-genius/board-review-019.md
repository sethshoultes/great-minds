# Board Review #19 — Jensen Huang
**Date:** 2026-03-31
**Project:** LocalGenius
**Reviewer:** Jensen Huang, Board Member
**Session:** Visual QA Gap + Infrastructure Cleanup

---

## What Changed

PRs #17-18 merged. Tamales image fixed. Blog deployed. Workshop video rendered. Two dead repos archived or deleted. The house is clean.

Clean is not the same as complete.

---

## The Signal Hidden in the Gap

Margaret has 70+ QA reports. She catches code issues. Every visual bug this cycle — broken images, unreadable button contrast, missing nav — was caught by the human.

That is a gap, not a detail.

We have automated tests that cannot see. CUDA had no customers for six years, but we knew what it would eventually do. The same logic applies here: you know exactly what visual QA will eventually cost you if you don't solve it now, while the surface is small and the stakes are low.

The automated test for broken images is a start. It is not enough.

---

## The One Recommendation

**Teach Margaret to see.**

Build a visual regression step into the QA pipeline — headless browser screenshot diff against a known-good baseline. One failing screenshot should block a deploy the same way a broken unit test does. The tooling exists (Playwright, Percy, Chromatic). The workflow exists. This is an integration problem, not an invention problem.

Margaret's 70+ reports are institutional memory. The goal is to encode what she sees into something that runs at 2am without her.

---

## Verdict

The code QA loop is proven. The visual QA loop has a hole in it. Patch the hole before you hand this system to the next team.

— Jensen

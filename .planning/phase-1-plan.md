# Phase 1 Plan — Pipeline Test (Deliverable Verification)

**Generated**: 2026-04-09
**Requirements**: `prds/pipeline-test.md` + `rounds/pipeline-test/decisions.md`
**Total Tasks**: 5
**Waves**: 4 (Wave 0-3)
**Timeline**: < 30 minutes
**Project Slug**: `pipeline-test`

---

## Executive Summary

This plan verifies the Great Minds pipeline can ship real deliverables end-to-end. The scope is intentionally minimal: create two files, commit, push.

**From Risk Scanner Analysis**:
- v1 is sequential (single-threaded) — no parallel execution complexity
- Direct push to main is an authorized one-time exception (Decision 2)
- Content quality is subjective but accepted for v1 — ship first, polish later

**Build Strategy**: Execute file I/O and Git operations in strict sequence. No database, API, or state management.

---

## Requirements Traceability

| Requirement | Task(s) | Wave |
|-------------|---------|------|
| REQ-001: Directory structure | phase-1-task-1 | 0 |
| REQ-002: README.md (≥20 lines) | phase-1-task-2 | 1 |
| REQ-003: example-output.md (≥15 lines) | phase-1-task-3 | 1 |
| REQ-004: Git commit | phase-1-task-4 | 2 |
| REQ-005: Git push to main | phase-1-task-5 | 3 |

---

## Wave Execution Order

### Wave 0 (BLOCKER — Setup)

This task must complete before any files are created.

```xml
<task-plan id="phase-1-task-1" wave="0">
  <title>Create Directory Structure</title>
  <requirement>REQ-001: Ensure deliverables/pipeline-test/ directory exists</requirement>
  <description>Create the target directory for pipeline-test deliverables. This is a prerequisite for all file creation tasks. The deliverables/ directory already exists; we need to create the pipeline-test/ subdirectory.</description>

  <context>
    <file path="deliverables/" reason="Parent directory - must exist (verified by codebase scout: 21+ project subdirectories exist)" />
    <file path="rounds/pipeline-test/decisions.md" reason="File structure specification (lines 92-102)" />
  </context>

  <steps>
    <step order="1">Verify parent directory exists: ls -la deliverables/</step>
    <step order="2">Create target directory: mkdir -p deliverables/pipeline-test</step>
    <step order="3">Verify creation: test -d deliverables/pipeline-test && echo "PASS"</step>
  </steps>

  <verification>
    <check type="bash">test -d deliverables/pipeline-test && echo "PASS" || echo "FAIL"</check>
  </verification>

  <dependencies>
    <!-- Wave 0: No dependencies - this IS the blocker -->
  </dependencies>

  <commit-message>chore(pipeline-test): create deliverables directory structure</commit-message>
</task-plan>
```

---

### Wave 1 (Parallel — File Creation)

These two tasks are independent and can run simultaneously.

```xml
<task-plan id="phase-1-task-2" wave="1">
  <title>Create README.md — Pipeline Documentation</title>
  <requirement>REQ-002: Create README.md with ≥20 lines describing the Great Minds pipeline</requirement>
  <description>Write substantive documentation about the Great Minds pipeline. Content must describe the debate-plan-build-review-ship workflow, the 14-agent roster, and what the agency produces. Brand voice: "Confident. Curious. Never condescending."</description>

  <context>
    <file path="CLAUDE.md" reason="Pipeline phases (lines 98-135), agent roster, anti-hallucination rules" />
    <file path="SOUL.md" reason="Agency identity and partner dynamics" />
    <file path="AGENTS.md" reason="Full 14-agent roster and communication rules" />
    <file path="rounds/pipeline-test/decisions.md" reason="Brand voice locked (Decision 3), emotional core (Decision 5)" />
    <file path="rounds/pipeline-test/essence.md" reason="Product soul: 'Ideas collide. You think.'" />
  </context>

  <steps>
    <step order="1">Read CLAUDE.md to understand pipeline phases (idle → debate → plan → build → review → ship)</step>
    <step order="2">Read SOUL.md and AGENTS.md to understand the 14-agent roster</step>
    <step order="3">Draft README.md with:
      - Title and tagline
      - What is the Great Minds pipeline (high-level)
      - The 5 pipeline phases with brief descriptions
      - Agent roster (key personas)
      - What deliverables the agency produces
      - Minimum 20 lines of real content</step>
    <step order="4">Write file to deliverables/pipeline-test/README.md</step>
    <step order="5">Verify line count: wc -l deliverables/pipeline-test/README.md</step>
  </steps>

  <verification>
    <check type="bash">test -f deliverables/pipeline-test/README.md && echo "FILE EXISTS"</check>
    <check type="bash">wc -l &lt; deliverables/pipeline-test/README.md | awk '{print ($1 >= 20 ? "LINE COUNT PASS" : "LINE COUNT FAIL: " $1)}'</check>
    <check type="bash">grep -q "placeholder\|TODO\|coming soon" deliverables/pipeline-test/README.md && echo "CONTENT FAIL: contains placeholder" || echo "CONTENT PASS: no placeholders"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Directory must exist before writing files" />
  </dependencies>

  <commit-message>feat(pipeline-test): add README documenting the Great Minds pipeline</commit-message>
</task-plan>
```

```xml
<task-plan id="phase-1-task-3" wave="1">
  <title>Create example-output.md — Debate Transcript</title>
  <requirement>REQ-003: Create example-output.md with ≥15 lines showing a real debate transcript</requirement>
  <description>Write an original debate transcript demonstrating the Steve vs. Elon format. Topic should be a real product/tech decision. Follow the communication protocol: [STEVE] = passionate, human experience focus; [ELON] = first-principles, data-driven. Minimum 15 lines.</description>

  <context>
    <file path="rounds/pipeline-test/round-1-steve.md" reason="Example of Steve's voice and opening positions" />
    <file path="rounds/pipeline-test/round-1-elon.md" reason="Example of Elon's voice and opening positions" />
    <file path="rounds/pipeline-test/decisions.md" reason="Shows debate outcome format" />
    <file path="CLAUDE.md" reason="Communication protocol (lines 220-228)" />
  </context>

  <steps>
    <step order="1">Read existing round files to understand debate format and persona voices</step>
    <step order="2">Choose a relevant topic (e.g., "Should we prioritize mobile-first or desktop-first?")</step>
    <step order="3">Draft debate transcript with:
      - Topic/question header
      - [STEVE] opening position (3-4 lines)
      - [ELON] opening position (3-4 lines)
      - [STEVE] response (2-3 lines)
      - [ELON] response (2-3 lines)
      - Optional: Phil Jackson decision summary (2-3 lines)
      - Minimum 15 lines total</step>
    <step order="4">Write file to deliverables/pipeline-test/example-output.md</step>
    <step order="5">Verify line count: wc -l deliverables/pipeline-test/example-output.md</step>
  </steps>

  <verification>
    <check type="bash">test -f deliverables/pipeline-test/example-output.md && echo "FILE EXISTS"</check>
    <check type="bash">wc -l &lt; deliverables/pipeline-test/example-output.md | awk '{print ($1 >= 15 ? "LINE COUNT PASS" : "LINE COUNT FAIL: " $1)}'</check>
    <check type="bash">grep -q "placeholder\|TODO\|coming soon" deliverables/pipeline-test/example-output.md && echo "CONTENT FAIL: contains placeholder" || echo "CONTENT PASS: no placeholders"</check>
    <check type="bash">grep -qE "\[STEVE\]|\[ELON\]" deliverables/pipeline-test/example-output.md && echo "FORMAT PASS: contains persona tags" || echo "FORMAT WARN: missing persona tags"</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-1" reason="Directory must exist before writing files" />
  </dependencies>

  <commit-message>feat(pipeline-test): add example debate transcript demonstrating persona format</commit-message>
</task-plan>
```

---

### Wave 2 (Sequential — Git Commit)

This task depends on both Wave 1 tasks completing.

```xml
<task-plan id="phase-1-task-4" wave="2">
  <title>Stage and Commit Both Files</title>
  <requirement>REQ-004: Commit README.md and example-output.md to Git</requirement>
  <description>Stage both deliverable files and create a single commit with a conventional commit message. The commit message format follows CLAUDE.md conventions: feat(scope): description.</description>

  <context>
    <file path="deliverables/pipeline-test/README.md" reason="File to commit (created in task-2)" />
    <file path="deliverables/pipeline-test/example-output.md" reason="File to commit (created in task-3)" />
    <file path="CLAUDE.md" reason="Git commit conventions (lines 212-240)" />
  </context>

  <steps>
    <step order="1">Verify both files exist:
      test -f deliverables/pipeline-test/README.md && test -f deliverables/pipeline-test/example-output.md</step>
    <step order="2">Stage files: git add deliverables/pipeline-test/README.md deliverables/pipeline-test/example-output.md</step>
    <step order="3">Verify staging: git status --porcelain | grep "deliverables/pipeline-test"</step>
    <step order="4">Create commit with conventional message:
      git commit -m "feat(pipeline-test): add README and example debate transcript

Verifies pipeline can ship real content end-to-end.
- README.md: Documents the Great Minds pipeline (20+ lines)
- example-output.md: Sample debate transcript (15+ lines)

Co-Authored-By: Claude Opus 4.5 &lt;noreply@anthropic.com&gt;"</step>
    <step order="5">Verify commit: git log --oneline -1</step>
  </steps>

  <verification>
    <check type="bash">git log --oneline -1 | grep -q "pipeline-test" && echo "COMMIT PASS" || echo "COMMIT FAIL"</check>
    <check type="bash">git status --porcelain deliverables/pipeline-test/ | wc -l | awk '{print ($1 == 0 ? "STAGING PASS: no uncommitted changes" : "STAGING FAIL: uncommitted changes remain")}'</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-2" reason="README.md must exist before commit" />
    <depends-on task-id="phase-1-task-3" reason="example-output.md must exist before commit" />
  </dependencies>

  <commit-message><!-- N/A: This task IS the commit --></commit-message>
</task-plan>
```

---

### Wave 3 (Sequential — Git Push)

Final task — push to remote.

```xml
<task-plan id="phase-1-task-5" wave="3">
  <title>Push to GitHub Main Branch</title>
  <requirement>REQ-005: Push committed files to origin/main</requirement>
  <description>Push the commit to GitHub main branch. NOTE: This is an authorized exception to the "never push directly to main" rule per decisions.md Decision 2: "Ship now. Pipeline test proceeds as-is."</description>

  <context>
    <file path="CLAUDE.md" reason="Branch strategy (lines 162-166) — normally forbids direct main push" />
    <file path="rounds/pipeline-test/decisions.md" reason="Decision 2 authorizes exception for v1" />
  </context>

  <steps>
    <step order="1">Verify we're on main branch: git branch --show-current</step>
    <step order="2">Verify commit exists locally: git log --oneline -1 | grep "pipeline-test"</step>
    <step order="3">Check remote sync status: git status (should show "ahead of origin/main")</step>
    <step order="4">Push to remote: git push origin main</step>
    <step order="5">Verify push: git log origin/main --oneline -1</step>
  </steps>

  <verification>
    <check type="bash">git log origin/main --oneline -1 | grep -q "pipeline-test" && echo "PUSH PASS" || echo "PUSH FAIL"</check>
    <check type="bash">git status | grep -q "Your branch is up to date" && echo "SYNC PASS" || echo "SYNC WARNING: branch may be ahead or behind"</check>
    <check type="manual">Verify files visible at https://github.com/sethshoultes/great-minds/tree/main/deliverables/pipeline-test</check>
  </verification>

  <dependencies>
    <depends-on task-id="phase-1-task-4" reason="Files must be committed before push" />
  </dependencies>

  <commit-message><!-- N/A: No additional commit needed --></commit-message>
</task-plan>
```

---

## Risk Notes

**From Risk Scanner Analysis**:

### Execution Risks (Mitigated for v1)
- **File system collision**: MITIGATED — v1 is sequential, single-threaded
- **Git auth failure**: PARTIAL — daemon has retry with backoff; recommend pre-flight auth check
- **Path resolution**: MITIGATED — using relative paths from repo root

### Verification Risks (Accepted for v1)
- **Line count gaming**: ACCEPTED — human review post-push
- **Content authenticity undefined**: ACCEPTED — "ship first, polish later" (Decision 2)
- **No self-review agent**: ACCEPTED — intentionally omitted for v1 velocity

### Compliance Risks (Documented Exceptions)
- **Direct push to main**: AUTHORIZED EXCEPTION per decisions.md Decision 2
- **No feature branch**: ONE-TIME EXCEPTION for pipeline verification

### Recommended Pre-Flight Checks
1. Verify git auth: `git ls-remote origin` (should not 401)
2. Verify clean git state: `git status` (check for unexpected uncommitted changes)
3. Verify on main branch: `git branch --show-current`

---

## Success Criteria

From PRD:
- [x] README.md exists at `deliverables/pipeline-test/README.md`
- [x] README.md has ≥20 lines of real content
- [x] example-output.md exists at `deliverables/pipeline-test/example-output.md`
- [x] example-output.md has ≥15 lines of real content
- [x] Both files committed with conventional commit message
- [x] Both files pushed to GitHub main branch
- [x] No placeholder, TODO, or "coming soon" text

---

## Execution Checklist

```
[ ] Wave 0: Directory setup (task-1)
    [ ] deliverables/pipeline-test/ created

[ ] Wave 1: File creation (task-2, task-3 — parallel)
    [ ] README.md written (≥20 lines)
    [ ] example-output.md written (≥15 lines)

[ ] Wave 2: Git commit (task-4)
    [ ] Both files staged
    [ ] Commit created with conventional message

[ ] Wave 3: Git push (task-5)
    [ ] Pushed to origin/main
    [ ] Files visible on GitHub
```

---

## Files Created by This Plan

| File | Path | Lines | Purpose |
|------|------|-------|---------|
| README.md | `deliverables/pipeline-test/README.md` | ≥20 | Pipeline documentation |
| example-output.md | `deliverables/pipeline-test/example-output.md` | ≥15 | Debate transcript sample |

---

## Document Trail

- **Requirements**: `.planning/REQUIREMENTS.md` (this project)
- **Decisions**: `rounds/pipeline-test/decisions.md`
- **PRD**: `prds/pipeline-test.md`
- **Essence**: `rounds/pipeline-test/essence.md`

---

**Plan Status**: READY FOR EXECUTION
**Estimated Duration**: < 30 minutes
**Parallel Tasks**: Wave 1 (task-2 and task-3)
**Sequential Blocks**: Wave 2-3 (commit → push)

---

*Plan generated by Great Minds Agency — Phase Planning Agent (GSD-Style)*
*Cross-referenced against: CLAUDE.md (project rules), decisions.md (locked decisions), SKILL.md (planning methodology)*

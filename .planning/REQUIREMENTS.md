# REQUIREMENTS — Agents Assemble Workshop

**Project Slug:** agents-assemble-workshop
**Generated:** 2024-04-09
**Source Documents:**
- `prds/agents-assemble-workshop.md` (PRD)
- `rounds/agents-assemble-workshop/decisions.md` (12 locked decisions)

---

## Executive Summary

- **Total Requirements:** 43
- **Must-Have:** 39
- **Should-Have:** 4
- **Hard Blockers:** 3 (REQ-025, REQ-026, REQ-032)

---

## DELIVERABLE REQUIREMENTS

### REQ-001: DELIVERABLE — Slides Markdown File
- **Source:** PRD (Section: Deliverables #1)
- **Priority:** Must-Have
- **Description:** Create `docs/AGENTS-ASSEMBLE-SLIDES.md` containing 7 slides with minimal text, mostly commands on screen
- **Verification:** File exists at specified path with all 7 slides present and no placeholder text

### REQ-002: DELIVERABLE — Speaker Script Markdown File
- **Source:** PRD (Section: Deliverables #2)
- **Priority:** Must-Have
- **Description:** Create `docs/AGENTS-ASSEMBLE-SCRIPT.md` with conversational speaker notes for each slide, including timing notes
- **Verification:** File exists with timing notes per slide; total talk time 10-15 minutes

### REQ-003: DELIVERABLE — Exercises Markdown File
- **Source:** PRD (Section: Deliverables #3)
- **Priority:** Must-Have
- **Description:** Create `docs/AGENTS-ASSEMBLE-EXERCISES.md` with 7 hands-on exercises, each 5-10 minutes, all copy-paste ready
- **Verification:** File exists with all 7 exercises; each is self-contained and executable

---

## CONTENT REQUIREMENTS — SLIDES

### REQ-004: CONTENT — Slide 1: Title Slide
- **Source:** PRD (Slide 1 specification)
- **Priority:** Must-Have
- **Description:** Slide 1 must display title "Agents Assemble: Building Teams That Work While You Sleep"
- **Verification:** Title text present in slide 1 of AGENTS-ASSEMBLE-SLIDES.md

### REQ-005: CONTENT — Slide 2: Headless Mode Command
- **Source:** PRD (Slide 2 specification)
- **Priority:** Must-Have
- **Description:** Slide 2 must show the headless mode command: `claude -p "prompt" --max-turns 10 --max-budget-usd 1.00`
- **Verification:** Exact command visible in slide 2; command is real and functional

### REQ-006: CONTENT — Slide 3: Ralph Wiggum Loop Command
- **Source:** PRD (Slide 3 specification)
- **Priority:** Must-Have
- **Description:** Slide 3 must show the Ralph Wiggum Loop: `while true; do claude -p "pick next task, build, test, commit"; done`
- **Verification:** Exact command visible in slide 3; command is real and functional

### REQ-007: CONTENT — Slide 4: /loop, Commands, Hooks Examples
- **Source:** PRD (Slide 4 specification)
- **Priority:** Must-Have
- **Description:** Slide 4 must show one-liner examples of /loop, custom commands, and hooks
- **Verification:** At least one functional example of each visible in slide 4

### REQ-008: CONTENT — Slide 5: Multi-Agent Teams Concept
- **Source:** PRD (Slide 5 specification)
- **Priority:** Must-Have
- **Description:** Slide 5 must show two agents debating in parallel
- **Verification:** Visual or code representation of parallel agent debate present in slide 5

### REQ-009: CONTENT — Slide 6: Full Pipeline
- **Source:** PRD (Slide 6 specification) + Decisions (Decision 10)
- **Priority:** Must-Have
- **Description:** Slide 6 must display the full pipeline: `PRD → Debate → Plan → Build → QA → Board Review → Ship`; shows vision without requiring attendees to execute all 7 stages
- **Verification:** Pipeline visual or text present in slide 6; narration notes clarify it's aspirational context

### REQ-010: CONTENT — Slide 7: Installation Command
- **Source:** PRD (Slide 7 specification)
- **Priority:** Must-Have
- **Description:** Slide 7 must show plugin installation command: `npx plugins add sethshoultes/great-minds-plugin`
- **Verification:** Exact command visible in slide 7; script notes indicate "let them type in silence"

---

## CONTENT REQUIREMENTS — EXERCISES

### REQ-011: CONTENT — Exercise 1: Headless Mode
- **Source:** PRD (Exercise 1 specification)
- **Priority:** Must-Have
- **Description:** Exercise 1 must teach headless mode using `claude -p` with budget cap; includes exact copy-paste commands, expected output, and "What you learned" summary
- **Verification:** Exercise 1 section includes: working command, expected output sample, learning summary; is executable in 5-10 minutes

### REQ-012: CONTENT — Exercise 2: Ralph Wiggum Loop
- **Source:** PRD (Exercise 2 specification)
- **Priority:** Must-Have
- **Description:** Exercise 2 must provide a 10-line bash script demonstrating build-while-you-sleep capability; includes exact copy-paste script, expected output, and "What you learned" summary
- **Verification:** Exercise 2 section includes: full 10-line bash script, expected output, learning summary; is executable in 5-10 minutes

### REQ-013: CONTENT — Exercise 3: /loop Recurring Task
- **Source:** PRD (Exercise 3 specification)
- **Priority:** Must-Have
- **Description:** Exercise 3 must demonstrate /loop for recurring monitoring tasks; includes exact copy-paste commands, expected output, and "What you learned" summary
- **Verification:** Exercise 3 section includes: /loop syntax example, expected output, learning summary; is executable in 5-10 minutes

### REQ-014: CONTENT — Exercise 4: Custom Slash Commands
- **Source:** PRD (Exercise 4 specification)
- **Priority:** Must-Have
- **Description:** Exercise 4 must demonstrate creating custom slash commands by creating `~/.claude/commands/standup.md`; includes exact copy-paste steps, expected output, and "What you learned" summary
- **Verification:** Exercise 4 section includes: file creation command, template content, expected behavior, learning summary; is executable in 5-10 minutes

### REQ-015: CONTENT — Exercise 5: Hooks
- **Source:** PRD (Exercise 5 specification)
- **Priority:** Must-Have
- **Description:** Exercise 5 must demonstrate hooks with a PostToolUse hook that reminds after commits; includes exact copy-paste setup, expected output, and "What you learned" summary
- **Verification:** Exercise 5 section includes: hook configuration code, expected output, learning summary; is executable in 5-10 minutes

### REQ-016: CONTENT — Exercise 6: Agent Personas Debate (Hardened)
- **Source:** PRD (Exercise 6 specification) + Decisions (Decision 2, 5)
- **Priority:** Must-Have
- **Description:** Exercise 6 must demonstrate two agents debating in parallel; must be hardened with explicit error recovery; includes exact copy-paste commands, expected output, and "What you learned" summary; allocate 7 minutes instead of 4.3
- **Verification:** Exercise 6 section includes: parallel agent setup command, explicit error recovery steps, expected output sample (complete, multi-line), learning summary; exercisable in 7 minutes; pre-tested for live demo

### REQ-017: CONTENT — Exercise 7: Great Minds Plugin + Local Fallback
- **Source:** PRD (Exercise 7 specification) + Decisions (Decision 4)
- **Priority:** Must-Have
- **Description:** Exercise 7 must demonstrate Great Minds Plugin installation and /agency-launch command; must include working local fallback alternative that demonstrates same concepts if plugin fails
- **Verification:** Exercise 7 section includes: plugin install command, /agency-launch usage, working local alternative code, expected output for both paths, learning summary; is executable in 5-10 minutes

---

## CONTENT REQUIREMENTS — SCRIPT

### REQ-018: CONTENT — Script: All 7 Slides Covered
- **Source:** PRD (Script requirement)
- **Priority:** Must-Have
- **Description:** Speaker script must include conversational speaker notes for every slide (7 slides total)
- **Verification:** Script file contains notes for slides 1-7; no slide is missing notes

### REQ-019: CONTENT — Script: Timing Notes Per Slide
- **Source:** PRD (Script requirement)
- **Priority:** Must-Have
- **Description:** Speaker script must include timing notes for each slide (e.g., "~2 min per slide")
- **Verification:** Every slide section in script includes estimated duration; total cumulative time is 10-15 minutes

### REQ-020: CONTENT — Script: Conversational Tone
- **Source:** PRD (Script requirement) + Decisions (Decision 6)
- **Priority:** Must-Have
- **Description:** Speaker script must use conversational language (not lecture-y); must avoid corporate jargon ("leverage," "utilize," "empower"); must sound like senior engineer at whiteboard
- **Verification:** Script review shows no lecture tone, no prohibited jargon, conversational phrasing throughout

### REQ-021: CONTENT — Script: No Theory Before Experience
- **Source:** Decisions (Decision 7)
- **Priority:** Must-Have
- **Description:** Script must emphasize "feel the power before understanding it"; Exercise 1 must be the jaw-drop moment with paste-watch-work sequence
- **Verification:** Script flow shows Exercise 1 happening before any theoretical explanations; slide notes reference "jaw drop" moment

---

## CONTENT REQUIREMENTS — TONE & VOICE

### REQ-022: CONTENT — Voice: Casual Expertise
- **Source:** Decisions (Decision 6)
- **Priority:** Must-Have
- **Description:** All content (slides, script, exercises) must use casual expertise voice with "Ralph Wiggum Loop" energy; must not use corporate phrases
- **Verification:** Content review finds no corporate jargon; tone is senior engineer, not conference speaker

### REQ-023: CONTENT — Voice: Dangerous Not Informed
- **Source:** Decisions (Decision 8)
- **Priority:** Must-Have
- **Description:** Messaging must promise developers will leave "dangerous"; not "informed" or "enabled"
- **Verification:** Script includes emotional hook language ("You will leave this room dangerous" or equivalent); frames output as capability language

### REQ-024: CONTENT — Script Ending: Silence
- **Source:** Decisions (Decision 12)
- **Priority:** Must-Have
- **Description:** Slide 7 and script must end with invitation for attendees to type in silence; no applause cue
- **Verification:** Final script section shows facilitator direction to "let them type"; no conclusion applause language

---

## QUALITY REQUIREMENTS

### REQ-025: QUALITY — Zero Placeholder Content (HARD BLOCKER)
- **Source:** PRD (CRITICAL: NO PLACEHOLDER CONTENT section)
- **Priority:** Must-Have (Hard Blocker)
- **Description:** All content must be REAL and COMPLETE; zero instances of "placeholder," "coming soon," "TODO," "TBD," "stub," etc.
- **Verification:** `grep -riE "placeholder|coming soon|TODO|TBD|stub|\[from PRD\]|\[TBD\]" docs/AGENTS-ASSEMBLE-*.md` returns 0 matches

### REQ-026: QUALITY — All Commands Real and Functional (HARD BLOCKER)
- **Source:** PRD (Every command must be real and work in Claude Code)
- **Priority:** Must-Have (Hard Blocker)
- **Description:** Every command shown in slides and exercises must be real, syntactically correct, and executable in Claude Code environment
- **Verification:** Code review confirms all commands are valid Claude Code syntax; test execution of each command in target environment succeeds

### REQ-027: QUALITY — Complete Exercises in 30-45 Minutes
- **Source:** PRD (Developer should complete all 7 exercises in 30-45 minutes) + Decisions (Decision 9: plan for 45 minutes)
- **Priority:** Must-Have
- **Description:** All 7 exercises must be completable by a developer in 45 minutes total; each exercise individually takes 5-10 minutes
- **Verification:** Timing notes on each exercise; sum of all exercise times ≤ 45 minutes; test with fresh user to validate

### REQ-028: QUALITY — No External Dependencies (Markdown Only)
- **Source:** Decisions (Decision 3: Three markdown files, no backend)
- **Priority:** Must-Have
- **Description:** Deliverable must be three markdown files only; no web app, no backend, no database, no infrastructure
- **Verification:** File inventory shows only 3 markdown files (.md); no web framework, no backend code, no database schema

### REQ-029: QUALITY — Expected Output Samples Provided
- **Source:** Decisions (Decision 5)
- **Priority:** Must-Have
- **Description:** Every exercise must include expected output reference so attendees can compare against known-good results when debugging
- **Verification:** Each of 7 exercises includes "Expected Output:" or "Expected Result:" section with sample output; samples are complete but concise

### REQ-030: QUALITY — Windows Compatibility Documented
- **Source:** Decisions (Risk Register: Windows path issues) + File Structure note on FAQ.md
- **Priority:** Should-Have
- **Description:** Documentation must address Windows vs Mac path differences in exercises (e.g., `~/.claude/commands/` path handling)
- **Verification:** FAQ section or equivalent exists addressing Windows-specific issues; commands include path guidance for both OS

### REQ-031: QUALITY — Plugin Version Pinned
- **Source:** Decisions (Decision 11)
- **Priority:** Should-Have
- **Description:** Great Minds Plugin installation command in Exercise 7 must pin specific version to avoid breaking changes
- **Verification:** Plugin install command includes version pin (e.g., `@1.0.0` or equivalent); version is documented

---

## TESTING REQUIREMENTS

### REQ-032: TESTING — Exercise 1 Live Execution (HARD BLOCKER)
- **Source:** PRD (Every command must work) + Decisions (Decision 7: jaw drop moment)
- **Priority:** Must-Have (Hard Blocker)
- **Description:** Exercise 1 (Headless Mode) must be tested end-to-end in Claude Code environment; must successfully execute and produce expected output
- **Verification:** Exercise 1 command runs in Claude Code; output matches expected output sample; completes in <10 minutes

### REQ-033: TESTING — Exercise 6 Pre-Demo Hardening
- **Source:** Decisions (Decision 2: harden orchestration, extensive testing before live workshop)
- **Priority:** Must-Have
- **Description:** Exercise 6 (parallel agent debate) must be extensively pre-tested with explicit error recovery paths documented; must be validated for live demo readiness
- **Verification:** Exercise 6 tested ≥5 times in target environment; error recovery steps documented; 7-minute buffer allocated; "ready for live demo" sign-off obtained

### REQ-034: TESTING — Exercise 7 Local Fallback Validation
- **Source:** Decisions (Decision 4: local alternative that demonstrates same concepts without external dependencies)
- **Priority:** Must-Have
- **Description:** Exercise 7 local fallback must be tested and validated to work independently of external plugin
- **Verification:** Local fallback code tested independently; produces output demonstrating same core concepts as plugin version; documented as reliable alternative

### REQ-035: TESTING — All Commands Syntax Validation
- **Source:** PRD (Every command must be real and work)
- **Priority:** Must-Have
- **Description:** All 7 exercises' commands must pass syntax validation for Claude Code environment
- **Verification:** Shellcheck or equivalent linter validates bash commands; Claude Code validates Claude syntax; no syntax errors found

### REQ-036: TESTING — Cross-Platform Path Testing
- **Source:** Decisions (Risk Register: Windows path issues)
- **Priority:** Should-Have
- **Description:** Commands containing file paths must be tested on both macOS and Windows environments (or documented with platform-specific variants)
- **Verification:** Exercise commands tested on Windows and macOS; path handling verified or variants provided in FAQ

### REQ-037: TESTING — API Key Failure Handling
- **Source:** Decisions (Risk Register, Open Questions: API key failure)
- **Priority:** Should-Have
- **Description:** Exercises must document what to do if Claude API key fails mid-workshop (setup instructions, recovery steps)
- **Verification:** Troubleshooting section or FAQ addresses API key configuration and recovery

---

## ARCHITECTURAL REQUIREMENTS

### REQ-038: ARCHITECTURE — Three Markdown Files Structure
- **Source:** Decisions (Decision 3)
- **Priority:** Must-Have
- **Description:** Deliverable must consolidate into three markdown files: AGENTS-ASSEMBLE-SLIDES.md, AGENTS-ASSEMBLE-SCRIPT.md, AGENTS-ASSEMBLE-EXERCISES.md
- **Verification:** Exactly 3 markdown files created; no fragmentation into 7+ separate exercise files; all content consolidated

### REQ-039: ARCHITECTURE — No Infrastructure
- **Source:** Decisions (Decision 3)
- **Priority:** Must-Have
- **Description:** No backend server, database, or web app required; zero infrastructure maintenance burden
- **Verification:** File inventory contains no server code, database migrations, or web framework configuration; project ships as static markdown

### REQ-040: ARCHITECTURE — Standalone Executability
- **Source:** PRD (All copy-paste) + Decisions (Decision 3: static docs that run commands locally)
- **Priority:** Must-Have
- **Description:** All exercises must be executable locally with copy-paste commands; no external web service required (except Claude API)
- **Verification:** Each exercise can be executed locally by copying code and running in Claude Code or bash; no external service dependency

---

## BRAND & NAMING REQUIREMENTS

### REQ-041: BRAND — Product Name Consistency
- **Source:** Decisions (Decision 1)
- **Priority:** Must-Have
- **Description:** Use "Agents Assemble" for all documentation titles and searchable contexts; use "Assemble" as casual brand reference in conversation
- **Verification:** File names and headers use "Agents Assemble"; script may use "Assemble" in casual speech; no inconsistency between formal and casual usage

---

## INTEGRATION REQUIREMENTS

### REQ-042: CONTENT — Plugin Installation Command Exact
- **Source:** PRD (Slide 7)
- **Priority:** Must-Have
- **Description:** Plugin installation command must be exact: `npx plugins add sethshoultes/great-minds-plugin` (with version pin from Req-031)
- **Verification:** Command shown in Slide 7 and Exercise 7 matches specification; version pinned

### REQ-043: INTEGRATION — Exercise 7 Fallback Demonstrates Core Concepts
- **Source:** Decisions (Decision 4)
- **Priority:** Must-Have
- **Description:** Exercise 7 local fallback must demonstrate the same core concepts as the plugin (agent teams, automation, etc.) without requiring external plugin
- **Verification:** Local fallback code reviewed; covers same concepts as plugin version; works independently; documented in Exercise 7

---

## REQUIREMENTS BY DELIVERABLE

### docs/AGENTS-ASSEMBLE-SLIDES.md
REQ-001, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-009, REQ-010, REQ-022, REQ-025, REQ-026, REQ-038, REQ-041, REQ-042

### docs/AGENTS-ASSEMBLE-SCRIPT.md
REQ-002, REQ-018, REQ-019, REQ-020, REQ-021, REQ-022, REQ-023, REQ-024, REQ-025, REQ-026, REQ-038

### docs/AGENTS-ASSEMBLE-EXERCISES.md
REQ-003, REQ-011, REQ-012, REQ-013, REQ-014, REQ-015, REQ-016, REQ-017, REQ-025, REQ-026, REQ-027, REQ-028, REQ-029, REQ-030, REQ-031, REQ-032, REQ-033, REQ-034, REQ-035, REQ-036, REQ-037, REQ-038, REQ-040, REQ-042, REQ-043

---

## HARD BLOCKERS (Build Fails If Not Met)

1. **REQ-025** — Zero placeholder content (grep validation)
2. **REQ-026** — All commands real and functional (code review + execution test)
3. **REQ-032** — Exercise 1 live execution (end-to-end test)

---

## VERIFIED CLAUDE CODE CLI SYNTAX

The following syntax has been verified against official Claude Code documentation (April 2026):

### Headless Mode
```bash
claude -p "Your prompt here"                    # Basic headless execution
claude -p "prompt" --max-turns 10               # Limit agent turns
claude -p "prompt" --max-budget-usd 5.00        # Budget cap in USD
claude -p "prompt" --allowedTools "Bash,Read,Edit"  # Pre-approve tools
claude -p "prompt" --output-format json         # JSON output
```

### /loop Command (Built-in Skill)
```bash
/loop 5m check the build status                 # Every 5 minutes
/loop 30m run tests every 30 minutes            # Custom interval
/loop check deployment every 10 minutes         # Natural language interval
```

### Custom Commands (Skills)
```
~/.claude/skills/<name>/SKILL.md                # Personal skills directory
.claude/skills/<name>/SKILL.md                  # Project skills directory
```

### Hooks (settings.json)
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "echo 'Commit done!' >&2" }
        ]
      }
    ]
  }
}
```

**Documentation Sources:**
- Headless Mode: https://code.claude.com/docs/en/headless.md
- CLI Reference: https://code.claude.com/docs/en/cli-reference.md
- Scheduled Tasks: https://code.claude.com/docs/en/scheduled-tasks.md
- Hooks Guide: https://code.claude.com/docs/en/hooks-guide.md
- Skills: https://code.claude.com/docs/en/slash-commands.md

---

## RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| All deliverables are placeholder content only | Critical | Critical | Re-read PRD, generate ALL 7 exercise complete content with real commands |
| Exercise 6 parallel debate has 30% failure rate in live demos | High | High | Pre-test thoroughly with explicit error recovery, allocate 7 minutes |
| Windows path compatibility issues | High | High | Test all exercises on Windows, create FAQ with workarounds |
| great-minds-plugin external dependency may break | Medium | Critical | Implement local fallback, version-pin plugin |
| Ralph Wiggum Loop bash script may differ on Windows | High | High | Provide PowerShell equivalent, document shell requirements |
| API rate limits if everyone runs loop simultaneously | Low | Medium | Add explicit sleep delays between iterations |
| Claude API latency causes timeouts | Medium | Medium | Document expected timeout behavior, set realistic expectations |
| "Complete in 30 minutes" timing is unrealistic | High | Medium | Plan for 45 minutes, time with fresh eyes |

---

## WAVE EXECUTION ORDER

```
Wave 1 (Parallel - Foundation):
  - Create docs/ directory structure
  - Verify Claude Code CLI syntax (test all commands)
  - Create FAQ section for troubleshooting

Wave 2 (Parallel - Content Creation):
  - Write AGENTS-ASSEMBLE-SLIDES.md (7 slides)
  - Write AGENTS-ASSEMBLE-SCRIPT.md (presenter notes)
  - Write Exercise 1-5 content in EXERCISES.md

Wave 3 (Sequential - High-Risk Items):
  - Write Exercise 6 with hardened error recovery
  - Write Exercise 7 with local fallback
  - Test parallel agent debate extensively

Wave 4 (Sequential - Validation):
  - Run placeholder content grep validation
  - Execute all commands end-to-end
  - Time full workshop run-through
  - Cross-platform testing (Windows/macOS)
```

---

## SUCCESS CRITERIA

From PRD:
- [ ] All 3 files exist with complete content
- [ ] Zero placeholder text (`grep -riE "placeholder|coming soon|TODO|TBD"` returns 0)
- [ ] Every command in exercises is real and works in Claude Code
- [ ] Speaking script covers all 7 slides with timing
- [ ] A developer can complete all 7 exercises in 45 minutes

From decisions.md Essence:
- [ ] First 30 seconds = jaw drop (paste, watch it work)
- [ ] Attendees leave "dangerous" not "informed"
- [ ] Workshop ends with keyboards clicking, not applause

---

**Document Version:** 1.0
**Last Updated:** 2024-04-09
**Total Requirements:** 43 (39 Must-Have, 4 Should-Have)
**Hard Blockers:** 3

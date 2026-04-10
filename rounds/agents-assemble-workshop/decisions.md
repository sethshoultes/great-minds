# DECISIONS — Build Phase Blueprint

*Consolidated by Phil Jackson, Zen Master*

---

## THE LOCKED DECISIONS

### Decision 1: Product Name
| Proposed By | Winner | Final Decision |
|-------------|--------|----------------|
| Steve Jobs | **CONTESTED** | **"Agents Assemble"** (functional name) / **"Assemble"** (brand shorthand) |

**Why:** Steve argued for "ASSEMBLE" — one word, verb, command, impossible to forget. Elon countered that "Agents Assemble Workshop" wins SEO and "Assemble" alone loses to 47 million furniture results.

**Resolution:** Use "Agents Assemble" for discoverability and documentation titles. Use "Assemble" as the casual brand reference in conversation and marketing. Both are right — context determines usage.

---

### Decision 2: Exercise 6 (Parallel Agent Debate)
| Proposed By | Winner | Final Decision |
|-------------|--------|----------------|
| Elon (cut it) vs Steve (keep it) | **STEVE JOBS** | **Exercise 6 STAYS in v1** |

**Why Steve Won:** The parallel debate is the climax — the moment attendees stop seeing "a tool" and start seeing "a team." Elon's concern about 30% failure rate in live demos is valid but addressable through rehearsal, not deletion. You don't cut the third act because it's complex.

**Build Requirement:** Harden the orchestration. Add explicit error recovery. Test extensively before the live workshop. Allocate 7 minutes instead of 4.3.

---

### Decision 3: Architecture
| Proposed By | Winner | Final Decision |
|-------------|--------|----------------|
| Elon Musk | **ELON MUSK** | **Three markdown files. No app, no backend, no database.** |

**Why:** Zero infrastructure means zero maintenance. Static docs that run commands locally. Ship fast, iterate from feedback. Both agreed — this was never contested.

---

### Decision 4: Exercise 7 — Plugin Fallback
| Proposed By | Winner | Final Decision |
|-------------|--------|----------------|
| Elon Musk | **ELON MUSK** (Steve conceded) | **Local fallback required for Great Minds Plugin** |

**Why:** Depending on an external plugin for the finale is hubris. If it breaks, the workshop ends on failure. Steve explicitly agreed: "Have a local version ready."

**Build Requirement:** Exercise 7 must have a working local alternative that demonstrates the same concepts without external dependencies.

---

### Decision 5: Expected Output Samples
| Proposed By | Winner | Final Decision |
|-------------|--------|----------------|
| Elon Musk | **ELON MUSK** | **Every exercise gets expected output reference** |

**Why:** Debugging > magic. When a command fails in minute 28, attendees need to compare against known-good results. Steve's "no output longer than 5 lines" yields to practical necessity.

**Build Requirement:** Create `expected-output.md` or inline expected output for each exercise. Keep samples concise but complete.

---

### Decision 6: Voice & Brand
| Proposed By | Winner | Final Decision |
|-------------|--------|----------------|
| Steve Jobs | **STEVE JOBS** (Elon agreed) | **Casual expertise. "Ralph Wiggum Loop" energy.** |

**Why:** Both agreed. The voice signals "we're not taking ourselves too seriously while being technically rigorous."

**Rules:**
- Never say "leverage," "utilize," or "empower your workflow"
- Say "build while you sleep," "ship it," "your turn"
- Talk like a senior engineer at a whiteboard, not a conference speaker

---

### Decision 7: First 30 Seconds
| Proposed By | Winner | Final Decision |
|-------------|--------|----------------|
| Steve Jobs | **STEVE JOBS** | **No theory before experience. Exercise 1 = paste → watch it work → jaw drop.** |

**Why:** Feel the power before you understand it. Like pinch-zoom on the first iPhone — no tutorial needed. Any slide explaining agents before showing agents gets deleted.

---

### Decision 8: Emotional Hook
| Proposed By | Winner | Final Decision |
|-------------|--------|----------------|
| Steve Jobs | **STEVE JOBS** (Elon endorsed) | **"You will leave this room dangerous."** |

**Why:** Not "informed." Not "enabled." *Dangerous.* Developers respond to capability language. This is a promise that lands.

---

### Decision 9: Workshop Timing
| Proposed By | Winner | Final Decision |
|-------------|--------|----------------|
| Elon Musk | **ELON MUSK** (Steve conceded) | **Plan for 45 minutes, not 30** |

**Why:** 30 minutes is aspirational. 45 is realistic. Under-promise, over-deliver. Test with fresh eyes before committing to timing.

---

### Decision 10: Slide 6 Pipeline
| Proposed By | Winner | Final Decision |
|-------------|--------|----------------|
| Elon (simplify to 3 stages) vs Steve (keep debate visible) | **COMPROMISE** | **Show full pipeline, but don't make attendees execute all 7 stages** |

**Why:** Steve: "Watching agents argue about how to ship code proves they *think*." Elon: "7 stages is a flex, not a teaching moment."

**Resolution:** Show the vision (PRD → Debate → Plan → Build → QA → Review → Ship) but the exercises focus on key moments. The pipeline is aspirational context, not mandatory execution.

---

### Decision 11: Version Pinning
| Proposed By | Winner | Final Decision |
|-------------|--------|----------------|
| Elon Musk | **ELON MUSK** (Steve agreed) | **Pin great-minds-plugin version** |

**Why:** 100 users experimenting is magic. 100 users on a breaking change is chaos.

---

### Decision 12: Workshop Ending
| Proposed By | Winner | Final Decision |
|-------------|--------|----------------|
| Steve Jobs | **STEVE JOBS** (Elon endorsed) | **Slide 7 ends with silence. Let them type.** |

**Why:** The best workshops don't end with applause — they end with keyboards clicking.

---

## MVP FEATURE SET (What Ships in v1)

### Core Deliverables
1. **7 Exercises** — All required, none skippable
2. **Exercise 1:** First autonomous commit (the "jaw drop" moment)
3. **Exercise 2-5:** Progressive agent capabilities (TBD from PRD)
4. **Exercise 6:** Parallel agent debate (the climax — hardened, tested, stays)
5. **Exercise 7:** Great Minds Plugin integration + local fallback

### Supporting Materials
- Expected output samples for every exercise
- FAQ.md for common issues (especially Windows vs Mac path differences)
- Pre-cached workshop commands in Claude project context (optional 10x path)

### What Does NOT Ship in v1
- Web interface
- Backend/database
- Optional/skippable exercises
- Any "Introduction to AI Agents" theory section
- Placeholder content (hard blocker)

---

## FILE STRUCTURE (What Gets Built)

```
/agents-assemble-workshop/
├── README.md                    # Workshop overview, setup, timing
├── exercises/
│   ├── exercise-1.md            # First autonomous commit
│   ├── exercise-2.md            # [From PRD]
│   ├── exercise-3.md            # [From PRD]
│   ├── exercise-4.md            # [From PRD]
│   ├── exercise-5.md            # [From PRD]
│   ├── exercise-6.md            # Parallel agent debate (THE CLIMAX)
│   └── exercise-7.md            # Great Minds Plugin + local fallback
├── expected-outputs/
│   ├── exercise-1-output.md
│   ├── exercise-2-output.md
│   ├── exercise-3-output.md
│   ├── exercise-4-output.md
│   ├── exercise-5-output.md
│   ├── exercise-6-output.md
│   └── exercise-7-output.md
├── slides/
│   ├── slide-1.md               # (if needed for facilitation)
│   └── ...
├── FAQ.md                       # Common issues, Windows/Mac differences
└── local-fallback/
    └── exercise-7-local.md      # Backup if plugin fails
```

**Note:** The actual structure may collapse into 3 markdown files per Elon's architecture decision. The above represents logical separation; implementation may consolidate.

---

## OPEN QUESTIONS (Still Need Resolution)

### 1. Exercises 2-5 Content
**Status:** Not defined in debate files
**Needed:** Specific content for exercises 2-5 from original PRD
**Owner:** Needs PRD review

### 2. Slide Content
**Status:** Referenced but not detailed
**Needed:** What exactly goes on slides 1-7?
**Owner:** Needs PRD review

### 3. Distribution Strategy Details
**Status:** Elon outlined path (YouTube, GitHub, X/Twitter), but not prioritized
**Needed:** Is this v1 scope or post-launch?
**Owner:** Product decision

### 4. Windows Compatibility Testing
**Status:** Flagged as risk, no mitigation defined
**Needed:** Test matrix, path handling documentation
**Owner:** QA/Build phase

### 5. API Key Failure Handling
**Status:** Elon noted "someone's API key fails"
**Needed:** What happens when auth fails mid-workshop?
**Owner:** Exercise design

### 6. "Escape Valves" for Facilitators
**Status:** Elon raised concern about variance in workshop rooms
**Needed:** Does facilitator guide exist? What are the backup plans?
**Owner:** Workshop design

---

## RISK REGISTER (What Could Go Wrong)

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| Exercise 6 parallel debate fails in live demo | Medium | High | Extensive pre-testing, explicit error recovery, 7-min buffer | Build team |
| Claude API latency causes timeouts | Medium | Medium | Nothing we can do (Anthropic's problem). Set expectations. Add retries. | N/A |
| 30-minute timing is unrealistic | High | Medium | Plan for 45 minutes. Test with fresh eyes. | Facilitator |
| great-minds-plugin breaks during workshop | Low | Critical | Local fallback mandatory. Test before workshop. | Build team |
| Windows path issues break exercises | Medium | High | Test on Windows. Add FAQ.md by launch. | QA |
| API rate limits if everyone runs Ralph Wiggum loop simultaneously | Low | Medium | Add explicit `sleep` delays to bash loop | Build team |
| Placeholder content ships | Low | Critical | Hard blocker. Every command must be real. Pre-flight check. | Build team |
| Attendees get stuck with no recovery path | Medium | High | Expected outputs for comparison. Facilitator guide. | Build team |
| "Assemble" name causes SEO confusion | Low | Low | Use "Agents Assemble" in searchable contexts | Marketing |

---

## ESSENCE (The North Star)

> **What is this product REALLY about?**
> Teaching developers to build tireless workers that ship code while they sleep.

> **What's the feeling it should evoke?**
> Dangerous. Not informed—*dangerous*.

> **What's the one thing that must be perfect?**
> The first 30 seconds. Paste. Watch it work. Jaw drops.

> **Creative direction:**
> Feel power before understanding it.

---

*"The goal isn't completion. The goal is conversion. When they leave, they're not 'informed.' They're dangerous."* — Steve Jobs

*"Power without reliability is a demo. Reliability without power is boring. We need both — but reliability ships first."* — Elon Musk

---

**Document Status:** Ready for Build Phase
**Last Updated:** Consolidated from Round 1 & Round 2 debates
**Arbiter:** Phil Jackson, Zen Master

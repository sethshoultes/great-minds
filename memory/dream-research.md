---
name: Claude Dream Research
description: Auto Dream feature and community dream-skill for memory consolidation between sessions
type: reference
---

## Auto Dream (Official, unreleased)
Background memory consolidation for Claude Code. Discovered in v2.1.83, toggle in /memory UI. Not yet functional for most users — /dream returns "Unknown skill."

### 4-Phase Process:
1. **Orient** — scan all memory files, build knowledge map
2. **Gather Signal** — identify corrections, decisions, repeated patterns
3. **Consolidate** — clean up notes, remove redundancies, resolve contradictions
4. **Prune & Index** — update memory index, remove stale entries

### Key Details:
- Runs automatically after 24hrs and 5+ sessions
- Sandboxed — can only write to memory files, never source code
- Part of internal project KAIROS (autonomous agent roadmap)

## Community Alternative
- **dream-skill**: github.com/grandamenium/dream-skill — installable now, replicates 4-phase process
- **System prompts**: github.com/Piebald-AI/claude-code-system-prompts has extracted dream prompt

## How We Use It
Our organizer-haiku agent implements the 4-phase dream cycle on a 60-min cron. This gives us memory consolidation without depending on the unreleased official feature.

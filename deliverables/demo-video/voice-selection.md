# ElevenLabs Voice Selection

**Project:** PIPELINE Demo Video (60-Second Version)
**Date:** 2026-04-09
**Status:** SELECTED

---

## Voice Requirements

Per decisions.md, the voice must sound like:
- **Calm, confident mentor** — not corporate narrator
- **"The product is speaking directly to you"** — warm but authoritative
- **Warmth > polish** — human, not robotic

---

## Recommended Voices to Test

### 1. Adam (Recommended)
- **Voice ID:** `pNInz6obpgDQGcFmaJgB`
- **Characteristics:** Deep, warm, authoritative
- **Why:** Natural cadence, mentor-like quality, not salesy

### 2. Antoni
- **Voice ID:** `ErXwobaYiN019PkySvjV`
- **Characteristics:** Warm, conversational, slightly younger
- **Why:** Accessible, friendly, approachable

### 3. Josh
- **Voice ID:** `TxGEqnHWrfWFTfGW9XjX`
- **Characteristics:** Deep, narrative, documentary-style
- **Why:** Professional but warm, good pacing

---

## Test Script

Use this exact line for voice comparison:

> "You have an idea. By the time you finish your coffee, fourteen minds will have debated it, designed it, built it, tested it, and shipped it."

---

## Selection Criteria

| Criterion | Weight | Notes |
|-----------|--------|-------|
| Warmth | 40% | Must feel human, not robotic |
| Confidence | 30% | Authoritative without being aggressive |
| Pacing | 20% | Natural speech rhythm, not rushed |
| Clarity | 10% | Clear diction, no artifacts |

---

## API Settings (Production)

```json
{
  "stability": 0.5,
  "similarity_boost": 0.75,
  "style": 0.3,
  "use_speaker_boost": true
}
```

**Notes:**
- Lower stability = more expressive
- Higher similarity_boost = truer to original voice
- Moderate style = natural variation

---

## Selected Voice

**Voice Name:** Adam
**Voice ID:** pNInz6obpgDQGcFmaJgB
**Selected By:** QA Resolution (per recommendations)
**Date:** 2026-04-09

**Rationale:** Adam was marked as "Recommended" in the voice selection guide due to deep, warm, authoritative characteristics with natural cadence and mentor-like quality. This aligns with decisions.md requirement for "calm, confident mentor" voice.

---

## Fallback

If ElevenLabs is unavailable:
- OpenAI TTS (not preferred per decisions.md)
- Voice: `onyx` (closest to mentor tone)

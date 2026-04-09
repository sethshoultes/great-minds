# Terminal Recording Guide

**Project:** PIPELINE Demo Video
**Date:** 2026-04-09
**Requirement:** VS-4, TC-5, TC-9

---

## Recording Requirements

Per decisions.md:
> "Real screen recording of actual pipeline run. No mockups. Authenticity beats production value."

Per Steve's concession:
> "If we don't have clean runs, we mock it honestly. Never lie, but don't wait for perfection either."

---

## Pre-Recording Checklist

### Environment Setup
- [ ] Terminal theme: Dark (high contrast)
- [ ] Font: Monospace, 14-18pt (readable at 1080p)
- [ ] Window: Clean, no personal info visible
- [ ] Desktop: Clean background, no distractions
- [ ] Notifications: Disabled

### Technical Settings
- [ ] Resolution: 1920x1080 (minimum)
- [ ] Frame rate: 30 fps (minimum)
- [ ] Audio: System audio only (no mic)
- [ ] Format: MP4 or MOV

### Recording Tools (choose one)
- **OBS Studio** (recommended) — free, cross-platform
- **QuickTime** (macOS) — simple, built-in
- **ffmpeg** (advanced) — command-line

---

## Recording Flow

### What to Capture

**The three-beat structure:**

1. **DROP** (0:00-0:12)
   - User types command to drop an idea
   - Brief pause to show the input
   - System acknowledges

2. **BUILD** (0:12-0:40)
   - Activity begins — agents working
   - Show progress, movement, intelligence at work
   - NOT step-by-step phases — "blur of intelligence"

3. **SHIP** (0:40-0:55)
   - Final output appears
   - Something real, working, complete
   - Clear "done" moment

---

## Recording Decision (Open Question #1 — RESOLVED)

**Decision Date:** 2026-04-09
**Decision:** Option B — Mock Honestly with Disclaimer
**Rationale:** Per Steve's concession in decisions.md: "If we don't have clean runs, we mock it honestly. Never lie, but don't wait for perfection either." A clean end-to-end pipeline run is not yet available for recording. To maintain shipping velocity (per Elon's mandate), we proceed with honest demonstration footage.

**Required Disclaimer:** "Demonstration footage — actual results may vary"
- Disclaimer must appear in first 3 seconds of video
- Positioned bottom-left, semi-transparent
- Removed after first clean real run is available

---

## Recording Options

### Option A: Real Pipeline Run (Preferred)
If a clean, successful pipeline run exists:
1. Set up recording software
2. Run actual pipeline from start to finish
3. Capture full terminal output
4. Edit for timing if needed

**Status:** DEFERRED — waiting on clean pipeline run from Engineering

### Option B: Mock Honestly (Fallback) — SELECTED
If no clean run is available:
1. Create a scripted demonstration
2. Add visible disclaimer: "Demonstration footage"
3. Use real commands and realistic output
4. Never fake results or fabricate success

**Status:** APPROVED — proceed with this approach

---

## Post-Recording

### Quality Check
- [ ] Video is clear and readable at 1080p
- [ ] Terminal text is legible throughout
- [ ] No personal information visible
- [ ] Recording captures Drop → Build → Ship flow
- [ ] Timing approximately 55-65 seconds

### Export Settings
```
Format: MP4
Codec: H.264
Resolution: 1920x1080
Frame Rate: 30 fps
Bitrate: 8-10 Mbps
```

### File Location
```
/deliverables/demo-video/assets/terminal-recording.mp4
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Text too small | Increase terminal font size, record at higher res |
| Recording choppy | Lower frame rate, close background apps |
| File too large | Reduce bitrate, trim unnecessary footage |
| Colors look off | Check terminal theme, ensure high contrast |

---

## Recording Script

Use this exact sequence:

```bash
# [Visible typing] User drops their idea
pipeline drop "Build me a landing page for PIPELINE that converts developers"

# [System shows acknowledgment]
# Pipeline initialized...
# Assembling team: Strategist, Designer, Engineer, QA...

# [Build phase - agents working]
# [Activity streams - debates, decisions, code]

# [Ship phase - output appears]
# Deployed to: https://pipeline.dev
# Status: LIVE
```

---

## Timeline

| Phase | Duration | Notes |
|-------|----------|-------|
| Drop | 8-12 sec | Clean input, brief |
| Build | 20-28 sec | Active, engaging |
| Ship | 12-15 sec | Clear conclusion |
| **Total** | 55-65 sec | Within 60s target |

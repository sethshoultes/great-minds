# AI UX Specification — Hybrid Cloudflare Workers AI Layer

*How the owner experiences AI-generated content, images, and voice input. Every state, every transition, every word of copy.*

**Author:** Steve Jobs, Chief Design & Brand Officer
**Date:** 2026-04-02
**Status:** Spec (pre-implementation)

---

## Architecture Context

LocalGenius now runs a hybrid AI layer:

| Task | Primary Model | Fallback | Runtime |
|---|---|---|---|
| Social post drafts | Llama 3.1 (Workers AI) | Claude (Anthropic API) | Cloudflare edge |
| Review responses | Claude Sonnet | — | Vercel serverless |
| Image generation | Stable Diffusion XL (Workers AI) | Stock photo selection | Cloudflare edge |
| Voice transcription | Whisper (Workers AI) | Manual text input | Cloudflare edge |
| Website content | Claude Sonnet | Llama 3.1 fallback | Vercel → Cloudflare |
| Weekly Digest | Claude Haiku | — | Vercel serverless |

**The owner never knows which model generated what.** The experience is identical. The AI is "LocalGenius" — never "Llama" or "Claude" or "Stable Diffusion." The plumbing is invisible.

---

## 1. Social Post Approval Flow

### 1.1 The Request

Maria says: *"Post something about our fish tacos"*

The AI processes this through Llama 3.1 on Workers AI (edge, fast, cheap) for the first draft. If the output quality is below threshold, it silently falls back to Claude.

**The owner sees none of this.** From her perspective:

### 1.2 The Streaming Response

```
[system_message, streaming]

"Here's a post about your fish tacos. Take a look."
```

The streaming text appears word-by-word (typewriter effect). When complete, the approval card renders below it.

### 1.3 The Approval Card — Social Post

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  📱  SOCIAL POST DRAFT                                  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │  [Generated image — fish tacos on a plate]        │  │
│  │                                                   │  │
│  │  OR                                               │  │
│  │                                                   │  │
│  │  [Maria's uploaded photo of fish tacos]            │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Beer-battered mahi with chipotle lime crema,           │
│  house-made pico, and a squeeze of lime. Tuesday        │
│  just got better. 🌮                                    │
│                                                         │
│  #MariasKitchen #FishTacoTuesday #AustinEats            │
│                                                         │
│  Platform: Instagram                                    │
│  Scheduled: Tuesday 11:00 AM                            │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌────────┐        │
│  │ Approve & Post│  │  Edit First  │  │ Skip   │        │
│  └──────────────┘  └──────────────┘  └────────┘        │
│                                                         │
│  Just now                                               │
└─────────────────────────────────────────────────────────┘
```

### 1.4 Card States

| State | Visual | Copy |
|---|---|---|
| **Pending** | Terracotta border-left. Three buttons visible. | "Approve & Post" / "Edit First" / "Skip" |
| **Publishing** | Terracotta border-left. Loading spinner replaces buttons. | "Posting to Instagram..." |
| **Published** | Sage border-left. Checkmark icon. | "Posted to Instagram. [View post →]" |
| **Scheduled** | Sage-light border-left. Clock icon. | "Scheduled for Tuesday at 11:00 AM." |
| **Editing** | Input replaces post text. Photo swap button appears. | Owner types edits inline. "Save" / "Cancel" buttons. |
| **Error** | Error border-left. Retry button. | "I couldn't post that right now. Want me to try again?" |
| **Skipped** | Faded. Collapsed to one line. | "Skipped. I'll try a different angle next time." |

### 1.5 Edit Flow

When Maria taps "Edit First":
1. The post text becomes an editable textarea (pre-filled with the draft)
2. The image shows a small "Swap photo" button in the bottom-right corner
3. Two buttons appear: **"Save & Post"** (terracotta) and **"Cancel"** (ghost)
4. If she edits the text, the hashtags auto-regenerate (or she can edit those too)
5. If she taps "Swap photo," she gets three options:
   - "Use my photo" → photo picker
   - "Generate another" → new AI image (see Section 2)
   - "No image" → text-only post

### 1.6 Quality Gate — When to Escalate to Claude

The Llama draft is evaluated before showing to the owner:

| Check | Threshold | Action if Failed |
|---|---|---|
| Length | < 20 chars or > 300 chars | Retry with Claude |
| Relevance | Doesn't mention the topic | Retry with Claude |
| Tone | Contains banned words (see brand guide) | Retry with Claude |
| Hallucination | References things not in business context | Retry with Claude |
| Language | Not English (or whatever the business language is) | Retry with Claude |

**The owner never sees a bad draft.** The quality gate runs in < 500ms. If Llama fails, Claude takes over silently. The total latency budget for the full round-trip is 3 seconds.

---

## 2. Image Generation UX

### 2.1 When Images Are Generated

Images are generated in three contexts:
1. **Social post creation** — owner requests a post, AI includes an image
2. **Onboarding reveal** — hero image for the generated website
3. **On-demand** — owner says "make me a photo of our patio"

### 2.2 The Generation Flow

Maria says: *"Post about our fish tacos"*

Behind the scenes:
1. Llama generates the post text (< 2 seconds)
2. In parallel, Stable Diffusion XL generates an image based on the prompt: *"Professional food photography, fish tacos on a ceramic plate, lime wedge, cilantro, natural lighting, restaurant setting"* (3-8 seconds)
3. The post text streams first. The image loads after.

### 2.3 Image Loading State

The approval card renders immediately with the text. The image area shows:

```
┌───────────────────────────────────────────────────┐
│                                                   │
│              [Warm shimmer animation]              │
│                                                   │
│           Creating your photo...                   │
│                                                   │
└───────────────────────────────────────────────────┘
```

- The shimmer uses the cream-to-warm-white gradient (not a gray skeleton)
- "Creating your photo..." in slate text, centered
- Aspect ratio: 1:1 for Instagram, 16:9 for Facebook, 4:5 for stories
- When the image arrives, it fades in (300ms, ease-out) replacing the shimmer

### 2.4 Image Quality Gate

Before showing the generated image to the owner:

| Check | Action |
|---|---|
| NSFW detection | Block. Regenerate. Never show. |
| Face detection | If faces detected, flag for review (AI-generated faces can look uncanny) |
| Brand alignment | Does the color palette match the business? If wildly off, regenerate. |
| Resolution | Must be at least 1024x1024 for social. If smaller, upscale or regenerate. |

If the image fails quality checks, show the card **without an image** and offer:

```
I drafted your post but couldn't create a good photo this time.
Want to use one of your own, or should I try again?

[Use my photo]  [Try again]  [Post without image]
```

### 2.5 Image Approval States

| State | Visual |
|---|---|
| **Generating** | Cream shimmer + "Creating your photo..." |
| **Ready** | Image fades in. "Swap photo" button in corner. |
| **Owner photo** | Owner's photo replaces AI image. "Swap photo" still available. |
| **Regenerating** | Shimmer replaces current image + "Trying a different angle..." |
| **Failed** | No image. Text-only card. Three options offered. |

### 2.6 Design Rules for Generated Images

1. **Never claim the photo is real.** If the owner asks, be honest: "I created that image to match your description. Want to use one of your own photos instead?"
2. **Prefer the owner's photos when available.** If Maria has uploaded fish taco photos, use those before generating. AI images are the fallback, not the default.
3. **No generated images of people.** AI-generated faces are in the uncanny valley. If the prompt involves people ("post about our team"), use the owner's photos or skip the image entirely.
4. **Warm, natural lighting.** The Stable Diffusion prompt always includes "natural lighting, warm tones, professional photography" to match the terracotta/sage brand feel.

---

## 3. Voice Input UX

### 3.1 The Interaction

Maria is standing in her kitchen at 9 PM, hands covered in flour. She can't type. She holds the mic button and speaks.

### 3.2 The Mic Button

Location: left side of the input bar (where the keyboard icon would be on a phone). Replaces the paperclip/attachment icon that we don't have.

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [🎙]  Talk to LocalGenius...              [Send →]     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.3 States

#### Idle
- Mic icon in slate (#6B7280)
- Tap to start recording (or hold for push-to-talk)
- aria-label: "Voice input"

#### Listening (Recording)
- Mic icon pulses in terracotta (#C4704B)
- Background glow (terracotta-light, subtle pulse)
- Input bar text changes to: *"Listening..."* in terracotta
- Waveform visualization: 3 thin bars that animate to audio level (same style as TypingIndicator but responsive to sound)
- Timer shows: "0:03" and counting (subtle, in slate)
- Tap mic again or release hold to stop

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [🎙◉]  Listening...  ▎▎▎▎  0:04          [Stop ■]     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Transcribing
- Mic icon replaced by a small loading spinner (terracotta)
- Input bar text: *"Got it, writing that down..."*
- Duration: typically < 2 seconds (Whisper on Workers AI is fast)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [⟳]  Got it, writing that down...                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Transcribed (Success)
- The transcribed text appears in the input field as regular text
- The owner can review and edit before sending
- The mic icon returns to idle state
- The Send button activates
- The input field auto-focuses for editing

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [🎙]  Post about our fish tacos for tuesday  [Send →]  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**The text is NOT auto-sent.** Maria reviews it first. This is critical — voice transcription errors happen, and auto-sending would violate the "nothing happens without your say-so" principle.

#### Error States

| Error | Copy | Recovery |
|---|---|---|
| Mic permission denied | "I need mic access to listen. Tap the mic icon in your browser's address bar to allow it." | Show browser-specific instructions |
| No speech detected | "I didn't catch that. Tap the mic and try again." | Return to idle |
| Transcription failed | "I couldn't make that out. Want to try again or type it?" | Two buttons: "Try again" / "Type instead" |
| Network error | "I need an internet connection to listen. Can you check your connection?" | Return to idle when online |
| Recording too long (> 60s) | "That was a long one. I got the first part — want to send that and keep going?" | Show partial transcription |

### 3.4 Whisper Integration Details

- **Max recording:** 60 seconds (hard limit). The UI shows a progress indicator approaching the limit.
- **Audio format:** WebM/Opus (native browser recording). Converted to WAV if needed.
- **Chunk size:** Entire recording sent as one request (not streaming). Whisper processes the full audio.
- **Language:** Auto-detected. No language picker — Whisper handles this.
- **Punctuation:** Whisper adds punctuation. The owner sees clean, readable text.

### 3.5 Accessibility

- Screen reader: "Voice input button. Tap to start recording."
- During recording: "Recording in progress. Tap to stop."
- After transcription: "Transcription complete. Review and send."
- For owners who can't use voice: the text input is always available. Voice is additive, never required.

---

## 4. Updated Onboarding Flow — AI-Generated Hero Image

### 4.1 Current Flow (5 Steps, 5 Minutes)

1. Tell me about your business
2. Here's what I found (Discovery)
3. Show me your best photos
4. What matters most?
5. The Reveal

### 4.2 Updated Step 5: The Reveal — Now with AI Hero Image

During Step 4 → Step 5 transition, three things happen in parallel:

| Task | Model | Target Time | Fallback |
|---|---|---|---|
| Generate website content | Claude Sonnet | 3-5 seconds | Llama 3.1 |
| Generate hero image | Stable Diffusion XL | 5-8 seconds | Owner's first uploaded photo |
| Provision Cloudflare site | Wrangler API | 10-30 seconds | Static HTML preview |

### 4.3 The Loading Screen (Updated)

The loading screen during generation now shows **the hero image being created** as part of the building process.

**Phase 1: Content (0-3 seconds)**
```
                    Maria's Kitchen
              Real Tex-Mex. Real people.

              Writing your story...
              ████████░░░░░░░░  40%
```

**Phase 2: Image (3-8 seconds)**
```
                    Maria's Kitchen
              Real Tex-Mex. Real people.

              Creating your hero photo...
              ████████████░░░░  70%
```

The progress messages cycle through real steps:
- "Writing your story..." (content generation)
- "Creating your hero photo..." (image generation)
- "Arranging your photos..." (layout)
- "Building your site..." (provisioning)
- "Almost there..." (final assembly)

Each message fires when that actual step begins, not on a timer.

**Phase 3: Reveal (8+ seconds)**

The loading dissolves. The website preview appears in the device frame. The hero image — either AI-generated or the owner's best photo — is at the top of the site.

### 4.4 Hero Image Prompt Engineering

The Stable Diffusion prompt is constructed from the business context:

```
{vertical}-specific scene, {description keywords},
professional photography, natural lighting, warm tones,
inviting atmosphere, no text, no logos, 16:9 aspect ratio
```

**Examples by vertical:**

| Vertical | Prompt Additions |
|---|---|
| Restaurant | "beautiful plated food, wooden table, ambient restaurant lighting" |
| Salon | "modern salon interior, clean lines, warm lighting, styling tools" |
| Dental | "clean modern dental office, comfortable chair, calming atmosphere" |
| Fitness | "gym interior, natural light, equipment, motivating space" |
| Home Services | "well-maintained home exterior, professional tools, clean workspace" |

### 4.5 When the AI Image Is Used vs Owner's Photo

Decision matrix:

| Owner's Photos | AI Image Quality | Decision |
|---|---|---|
| Has 3+ photos, hero-quality exists | Any | **Use owner's best photo.** Real is always better. |
| Has photos, none hero-quality | Good | **Use AI image.** Owner's photos go in gallery section. |
| Has photos, none hero-quality | Bad | **Use owner's best photo anyway.** Honest is better than fake-good. |
| No photos uploaded | Good | **Use AI image.** Only option. |
| No photos uploaded | Bad | **Show business name on warm gradient.** Typography as hero. |

**"Hero-quality"** means: landscape orientation, good lighting, in focus, represents the business visually. The AI makes this judgment.

### 4.6 Reveal Card — Hero Image Section

If an AI image was generated, the website preview shows it at the top. Below the device frame:

```
┌─────────────────────────────────────────────────┐
│  Hero photo                                     │
│  ┌─────────────────────────────────────────┐    │
│  │ [AI-generated or owner photo]            │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  [Use this photo]  [Use my own]  [No hero]      │
│                                                 │
│  ↳ This photo was created to match your         │
│    description. You can swap it for one of       │
│    yours anytime.                                │
└─────────────────────────────────────────────────┘
```

**The footnote is critical.** We never let the owner think an AI image is a real photo of their business. Honesty is non-negotiable.

---

## 5. Loading & Transition Design Language

All AI operations share a consistent visual language:

### 5.1 The Three AI States

| State | Visual | Duration | Copy Style |
|---|---|---|---|
| **Working** | Cream shimmer OR terracotta pulse | 1-10 sec | Present tense: "Creating..." "Writing..." "Building..." |
| **Arriving** | Fade-in (300ms ease-out) | 300ms | No text. The content speaks for itself. |
| **Done** | Sage accent (border or checkmark) | Permanent | Past tense: "Posted." "Saved." "Live." |

### 5.2 Timing Expectations

| Operation | Expected | Max Before Warning |
|---|---|---|
| Text generation (Llama) | 1-3 sec | 5 sec → "Taking a moment..." |
| Text generation (Claude) | 2-5 sec | 8 sec → "Taking a moment..." |
| Image generation (SDXL) | 3-8 sec | 12 sec → "Still working on your photo..." |
| Voice transcription (Whisper) | 1-2 sec | 4 sec → "Almost got it..." |
| Website provisioning | 10-30 sec | 45 sec → "This is taking longer than usual..." |

### 5.3 The "Taking a Moment" Pattern

When any operation exceeds its expected duration:

1. The loading indicator continues (no change in animation)
2. A small text appears below: *"Taking a moment..."* (slate, italic)
3. If it exceeds the max, the text updates: *"Still working..."*
4. If it exceeds 2x max, offer escape: *"This is taking longer than usual. [Cancel] or keep waiting?"*

**Never show a spinner that doesn't move.** The shimmer animation must always be visible. A frozen UI signals a crash.

---

## 6. Model Transparency Policy

### What We Tell the Owner

**Nothing.** The owner doesn't know or care that Llama wrote their social post and Claude wrote their review response. They don't know Stable Diffusion made their image. They don't know Whisper transcribed their voice.

**The AI is "LocalGenius."** One name. One persona. One relationship.

### What We Tell the Owner If They Ask

If Maria asks "What AI do you use?" the response is:

> "I use a mix of different AI models depending on the task — some for writing, some for images, some for understanding your voice. I pick whichever one does the best job for each thing you need."

First person. Honest. No brand names. No technical jargon.

### What We Log Internally

Every AI operation logs:
- Model used (llama-3.1-8b, claude-sonnet-4, sdxl-base-1.0, whisper-large-v3)
- Latency (ms)
- Quality score (if evaluated)
- Escalation flag (did Llama fail and Claude take over?)
- Token/compute cost

This data drives model selection improvements. The owner never sees it.

---

## 7. Error Hierarchy

When AI operations fail, the error message depends on what failed and what we can still do:

| Failure | Owner Sees | Recovery |
|---|---|---|
| Llama draft bad quality | Nothing (silent Claude escalation) | Automatic |
| Claude also fails | "I'm having trouble writing that. Can you tell me more about what you want?" | Owner rephrases |
| Image generation fails | Card appears without image + "I couldn't create a good photo. Use one of yours?" | Owner uploads or skips |
| Whisper fails | "I couldn't make that out. Want to try again or type it?" | Retry or fallback to text |
| All AI fails (outage) | "I'm having some trouble right now. I'll catch up in a few minutes." | Graceful degradation |

**Never show technical errors.** No "503 Service Unavailable." No "Model timeout." No "Rate limit exceeded." Those are our problems, not Maria's.

---

*Steve Jobs — Chief Design & Brand Officer*
*"The technology is invisible. The magic is the point."*

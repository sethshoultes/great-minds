# Emdash — Brand Identity

*The product that builds your website while you define it.*

**Author:** Steve Jobs, Chief Design & Brand Officer
**Date:** 2026-04-03
**Status:** Draft v1

---

## The Name: Emdash

Keep it. Don't rename it. Here's why.

An em dash (—) is the punctuation mark that interrupts a sentence to introduce something important. It's the mark writers use when they have something to say that can't wait for a comma. It connects two complete thoughts with urgency and purpose.

That's exactly what this product does. It takes a complete thought (a PRD) and connects it to a complete outcome (a deployed website). The interruption — the part where humans usually get stuck configuring WordPress for three weeks — is eliminated.

**Emdash.** The mark between thinking and shipping.

### Name Rules

- Always written as **Emdash** (capital E, one word, no hyphen)
- Never "Em Dash," "em-dash," "EMDASH," or "EmDash"
- In code and URLs: `emdash` (lowercase)
- The product ships at `emdash.site` (or `emdash.dev` if available)
- When referring to the punctuation mark, use "em dash" (two words, lowercase). The product is one word.

---

## Positioning

### One-Line

**"Drop in a brief. Get back a website."**

This mirrors Great Minds' positioning ("Drop in a PRD. Get back a product.") but scopes it to the specific output: a website.

### The Elevator Pitch

Emdash turns a product brief into a live, managed website — autonomously. You describe what you want. AI agents build it: design, content, images, SEO, hosting. You review it once. It deploys to the edge. The site stays alive because the agents keep managing it.

No CMS. No drag-and-drop. No configuring anything. You talk. The site exists.

### Who It's For

| Segment | Pain | Emdash Solves |
|---|---|---|
| **Agencies** | Building client sites is labor-intensive and repetitive | Submit a brief, get a site. Bill the client, keep the margin. |
| **SaaS companies** | Need landing pages, docs sites, marketing pages fast | Brief → deployed page in hours, not sprints. |
| **Entrepreneurs** | Can describe their business but can't build a website | Five questions → live site. No tools to learn. |
| **Great Minds clients** | The agency builds products; those products need websites | Emdash is the website layer that ships alongside the product. |

### What It Is NOT

- Not a website builder (the human doesn't build anything)
- Not a template marketplace (the AI selects and customizes; the human never sees templates)
- Not a CMS (there is no admin panel)
- Not a hosting provider (hosting is invisible — Cloudflare edge, but the client never knows)

---

## Logo Direction

### The Mark

The logo is the em dash itself — a horizontal line. Clean, minimal, typographic.

```
———  Emdash
```

The mark is a thick horizontal bar — heavier than a standard em dash, with slightly rounded ends. It sits to the left of the wordmark. The proportions should feel decisive, not decorative. This is a mark that means something.

### Variations

| Context | Format |
|---|---|
| **Full logo** | Mark + "Emdash" wordmark |
| **Compact** | Mark only (the bar) |
| **Favicon** | The bar inside a rounded square |
| **Dark backgrounds** | White mark + white text |
| **Light backgrounds** | Charcoal mark + charcoal text |

### Typography

The wordmark uses **Inter** at weight 600 (semibold), tracked tight (-0.02em). Inter is the typeface of tools — clean, precise, engineering-grade. It says "this is infrastructure" without saying "this is cold."

The websites Emdash *builds* use Lora + Source Sans 3 (the LocalGenius DNA). But Emdash *itself* uses Inter. The builder and the product have different voices.

---

## Color Palette

### Philosophy

Emdash is infrastructure. Infrastructure should feel reliable, not flashy. The palette is neutral-first with a single accent color that signals action.

The accent is **not** terracotta (that's LocalGenius) or amber (that's Great Minds). Emdash needs its own color identity.

### Core Palette

| Name | Hex | Usage |
|---|---|---|
| **Ink** | `#0F172A` | Primary background, text on light surfaces |
| **Paper** | `#FAFAFA` | Light backgrounds, card surfaces |
| **Slate** | `#64748B` | Secondary text, borders, captions |
| **Mist** | `#F1F5F9` | Subtle backgrounds, code blocks |

### Accent: Electric Indigo

| Name | Hex | Usage |
|---|---|---|
| **Indigo** | `#6366F1` | Primary buttons, links, active states |
| **Indigo Hover** | `#4F46E5` | Hover states |
| **Indigo Light** | `#EEF2FF` | Selected backgrounds, badges |
| **Indigo Dark** | `#3730A3` | Text on indigo-light backgrounds |

### Why Indigo

- It's distinct from terracotta (warm, local) and amber (energy, agency). Indigo is precision.
- It reads as "developer tool" without being GitHub-blue or Vercel-black.
- It pairs well with both dark and light backgrounds.
- It's the color of twilight — the hour when things get built. (Not the marketing reason. The real reason: it looks correct.)

### Status Colors

| Name | Hex | Usage |
|---|---|---|
| **Success** | `#22C55E` | Deployed, live, passing |
| **Warning** | `#F59E0B` | Pending review, in progress |
| **Error** | `#EF4444` | Failed, blocked |
| **Info** | `#6366F1` | Same as indigo — information is action |

---

## Voice

Emdash speaks differently than Great Minds or LocalGenius.

| Register | Great Minds | LocalGenius | Emdash |
|---|---|---|---|
| **Tone** | Bold, intellectual | Warm, capable | Precise, confident |
| **Reads like** | A visionary pitch | A text from a trusted employee | A terminal that just worked |
| **Example** | "The tension is the product." | "Your business, handled." | "Deployed. 94 PageSpeed. 3 pages." |

### Emdash Voice Rules

1. **Short.** Emdash doesn't explain. It reports.
2. **Factual.** Numbers, not adjectives. "Built in 47 seconds" not "lightning fast."
3. **Present tense.** "Your site is live" not "Your site has been deployed."
4. **No marketing language.** Never "revolutionary," "game-changing," "seamlessly." The product speaks in results.
5. **Terminal-native.** Copy should feel at home in a terminal. Monospace. Status codes. Progress bars.

### Sample Copy

**Onboarding:**
```
What are you building?
> A SaaS landing page for a project management tool.

Got it. Give me 90 seconds.

████████████████░░░░ 78%
Writing copy...

Done. Your site is live at brief-pm.emdash.site
3 pages. 96 PageSpeed. Mobile-first.

[Preview] [Deploy to custom domain] [Edit via chat]
```

**Status email:**
```
Subject: brief-pm.emdash.site — deployed

Your site is live.
- 3 pages (home, features, pricing)
- 96/100 PageSpeed
- SSL active
- Custom domain: ready to configure

Reply to this email to make changes.
```

---

## Product Architecture (Visual Identity Context)

Emdash is a three-layer system. The brand needs to reflect all three without confusing them.

```
Layer 1: INTAKE        "What do you want?"
         ↓             (brief, conversation, PRD)
Layer 2: BUILD         AI agents design + code + deploy
         ↓             (invisible to the client)
Layer 3: OUTPUT        Live website on the edge
                       (the only thing the client sees)
```

The brand emphasizes **Layer 1** (how simple the input is) and **Layer 3** (how real the output is). Layer 2 is invisible — the client doesn't need to know about Astro, Cloudflare, D1, R2, or MCP. They need to know that they said what they wanted and got what they asked for.

---

## Competitive Positioning

| Competitor | What They Sell | What Emdash Sells |
|---|---|---|
| Squarespace | "Build it yourself, beautifully" | "Don't build it. Describe it." |
| Vercel | "Deploy your code" | "Deploy your idea" |
| Webflow | "Design without code" | "Ship without design" |
| WordPress | "Customize everything" | "Customize nothing. Get everything." |
| Framer | "AI-assisted design" | "AI-completed delivery" |
| v0 | "Generate components" | "Generate, deploy, and manage a site" |

### The Differentiator

Every competitor requires the human to do something in the middle — choose a template, drag a block, edit a component, configure a deployment. Emdash requires the human to do one thing at the start (describe) and one thing at the end (approve). The middle is autonomous.

**"The product is the absence of a product."** There is no editor. There is no dashboard. There is no learning curve. You describe. You approve. It's live.

---

## Tagline Candidates

| Tagline | Feeling |
|---|---|
| **"Drop in a brief. Get back a website."** | Mirrors Great Minds. Direct. Clear. |
| **"Describe it. Deploy it."** | Two verbs. The simplest possible promise. |
| **"The website you described is live."** | Post-action. Assumes success. Confident. |
| **"No editor. No templates. Just yours."** | Defines by absence. Provocative. |

**Recommendation: "Describe it. Deploy it."**

Two words each. Perfect symmetry. The em dash between them is implied — and when you write it with the mark, it becomes the logo:

**Describe it — Deploy it.**

The em dash IS the product. The bridge between describing and deploying. The mark between the thought and the thing.

---

## Deliverables Summary

| Asset | Status | Notes |
|---|---|---|
| Name | **Emdash** | Keep it. Don't rename. |
| Tagline | **"Describe it. Deploy it."** | Two verbs, em dash implied |
| Logo direction | Horizontal bar + "Emdash" wordmark | Inter 600, tight tracking |
| Accent color | Indigo `#6366F1` | Precision, not warmth |
| Background | Ink `#0F172A` / Paper `#FAFAFA` | Dark-first, light available |
| Voice | Precise, factual, terminal-native | "Deployed. 94 PageSpeed. 3 pages." |
| Positioning | Autonomous website delivery | "No editor. No templates. Just yours." |

---

## What Happens Next

1. **Elon** architects the PRD-to-deploy pipeline (how briefs become sites)
2. **Steve** (me) designs the intake experience (what does the client see?)
3. **Jony** produces the logo mark and favicon
4. **Maya** writes the landing page copy
5. **Sara** defines the pricing and credit model

The brand identity is the foundation. Everything else builds on this.

---

*Steve Jobs — Chief Design & Brand Officer*
*"The product is the absence of a product."*

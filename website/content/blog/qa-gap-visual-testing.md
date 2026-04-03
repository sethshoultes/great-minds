---
title: "The QA Gap: Why 70 Reports Still Missed Broken Buttons"
slug: qa-gap-visual-testing
description: "Our AI QA agent Margaret wrote 70+ reports checking HTTP codes and test results. Every visual bug — broken buttons, missing images, unreadable text — was caught by the human. Here's how we fixed the QA gap with self-review, event-driven testing, and automated broken image detection."
date: "2026-04-03"
author: "Seth Shoultes"
tags: ["AI agents", "Claude Code", "multi-agent", "agent swarm", "AI team", "QA", "visual testing"]
image: "/blog/placeholder.webp"
---

Margaret, our QA agent persona, wrote over 70 quality assurance reports during the build. She checked HTTP response codes. She ran the test suite. She verified API endpoints returned the correct JSON structure. She validated that markdown rendered properly. She cross-referenced PR descriptions against actual code changes.

Every visual bug in the product was caught by me, the human, looking at the screen.

Broken buttons. Missing images. Unreadable text on dark backgrounds. Navigation links that disappeared on mobile. Form inputs with white text on white backgrounds. None of these appeared in Margaret's 70+ reports. They couldn't, because Margaret never looked at the screen.

This is the QA gap, and it's the single biggest blind spot in AI-driven development right now.

## What Margaret Did Well

Before I get into the failures, I want to be clear: Margaret was genuinely valuable. Her 70+ QA reports represent a level of documentation that most human teams never achieve.

Each report included a structured breakdown of what was tested, what passed, what failed, and why. She tracked regression patterns across PRs. She maintained a running list of known issues. She flagged when test coverage dropped. She caught API contract changes that would have broken downstream integrations.

Show me a human team that produces this level of documentation about its own work. I'll wait.

Margaret's systematic approach caught real bugs — race conditions in API calls, missing error handling, incorrect response schemas, database queries that would have failed under load. These are the kinds of bugs that slip through human code review because they're subtle and require careful analysis.

But documentation without visual verification is half the job. Margaret could tell you that a page returned HTTP 200 and all 47 tests passed. She could not tell you that the "Sign Up" button was invisible because a CSS z-index put it behind the hero image.

## The Visual Bugs Margaret Missed

Here's an incomplete list of visual bugs I caught during manual review that Margaret's 70 reports never flagged:

**Broken buttons.** The frontend agent generated button components with correct HTML and proper event handlers. The buttons worked in the test suite because JSDOM doesn't render CSS. In the actual browser, three buttons were completely non-functional because of overlapping elements and incorrect positioning. Margaret's tests confirmed the click handlers were attached. They were. But a user couldn't reach them.

**Missing images.** Several pages referenced images that didn't exist. The `<img>` tags were present with correct `alt` attributes (Margaret verified that). The `src` attributes pointed to paths that returned 404. Margaret's HTTP checks tested the pages themselves, not every embedded resource on those pages.

**Unreadable text.** A dark mode implementation resulted in dark gray text on a dark background in two sections. The text was there. The DOM was correct. The content was accurate. You just couldn't read it. No test in the world catches this unless something is actually looking at the rendered output.

**Missing navigation.** On mobile viewports, the navigation component collapsed into a hamburger menu that didn't open. The CSS media query was correctly applied — Margaret could verify the stylesheet was loaded — but the JavaScript toggle had a bug that only manifested at specific viewport widths. Desktop testing passed fine.

**Form rendering issues.** A contact form rendered with input fields that had no visible borders and white text on a white background. Functionally, the form worked. You could tab through it, type in it, submit it. You just couldn't see what you were typing.

Every single one of these was immediately obvious to a human glancing at the page for two seconds. None of them showed up in 70 QA reports.

## Why This Gap Exists

The QA gap isn't Margaret's fault. It's a structural limitation of how AI agents interact with code.

Claude Code agents — and AI agents in general — operate on text. They read code. They read test output. They read HTTP responses. They are extraordinarily good at analyzing text-based artifacts for correctness, consistency, and completeness.

But a rendered web page is not text. It's a visual artifact produced by the interaction of HTML, CSS, JavaScript, and a rendering engine. The relationship between the code and the visual output is non-linear. A single CSS property change can make an entire page unreadable. A z-index conflict can make interactive elements unreachable. A missing font import can alter the layout of every piece of text on the site.

AI agents operating in a multi-agent swarm see the code that produces the visual output. They don't see the visual output itself. It's like reviewing a restaurant by reading the recipes instead of tasting the food.

## The Fix: Self-Review Before PR

The first fix was architectural. Instead of relying on Margaret to catch visual issues during PR review — which she structurally cannot do — we added a self-review step to each agent's workflow.

Before opening a PR, the frontend agent now spawns a Jony Ive review. Jony's brief is specifically visual: "Look at what was just built. Does it look right? Is it usable? Can a human actually interact with this?"

This doesn't fully solve the problem — Jony is still an AI agent operating on code, not rendered pixels — but it adds a design-aware perspective to the review process. Jony catches things like missing hover states, inconsistent spacing, and color contrast issues by analyzing the CSS, not by looking at the screen. It's not perfect, but it's a significant improvement over no visual review at all.

The key insight is that the visual review should happen before the PR, not during it. By the time Margaret sees the code, it's too late for meaningful visual feedback. The agent has moved on. Self-review catches issues when the agent still has full context.

## Event-Driven QA: The Pipeline

The second fix was building an event-driven QA pipeline that automates the visual checks I was doing manually. Here's the architecture:

**Step 1: PR merge triggers deployment.** Standard CI/CD — when a PR merges to the main branch, Cloudflare Workers deploys the updated site.

**Step 2: Deployment triggers visual screenshot.** After deployment completes, a script captures screenshots of every key page at multiple viewport widths (desktop, tablet, mobile). These screenshots are stored and compared against the previous version.

**Step 3: Screenshot comparison flags visual regressions.** A diff tool compares the new screenshots against the baseline. Changes above a configurable threshold get flagged for human review. This catches the category of bugs where something that used to work stopped working after a code change.

**Step 4: Broken image detection runs automatically.** A separate check crawls every page and verifies that every `img src` returns a valid response. This is the automated version of the manual check I was doing — and it's embarrassingly simple to implement.

The broken image detector is literally just a script that parses each page's HTML, extracts every `img` `src` attribute, and runs a `curl` HEAD request against each URL. If any returns a non-200 status code, it files an issue. Twenty lines of code that would have caught several of our visual bugs before I ever saw them.

## Building the Broken Image Detector

Since this is such a practical and easy win, here's the approach:

Crawl each deployed page. Parse the HTML. Extract every `img` tag's `src` attribute. Resolve relative URLs against the page's base URL. Hit each image URL with a HEAD request. Log any non-200 response.

That's it. Run it as part of your deployment pipeline or on a cron. We run ours every 15 minutes as part of the deployment check cron that was already in place. It added maybe 30 seconds to the check and has caught broken images twice since we implemented it.

You can extend this pattern to other embedded resources — CSS files, JavaScript bundles, fonts, favicons. If it's referenced in the HTML, verify it exists. It's the kind of check that takes an hour to implement and saves you from the specific embarrassment of deploying a page with broken images.

## The Honest Assessment

Show me a human team that produces this level of documentation about its own work. I'll wait. Margaret's 70+ QA reports are genuinely impressive. The depth of analysis, the consistency of format, the systematic tracking of issues across sprints — it's better than what most human QA teams produce.

But documentation without visual verification is half the job.

The AI agent swarm is exceptional at verifying that code does what it says it does. It is currently incapable of verifying that what the code produces looks right to a human eye. This isn't a small gap. For user-facing web applications, visual correctness is the whole point. A technically perfect page that nobody can read is worse than a sloppy page that works.

The fixes I've described — self-review before PR, event-driven screenshot comparison, automated broken image detection — close part of the gap. They don't close all of it. There's still a class of visual bugs that only a human looking at the rendered page can catch.

## What This Means for Multi-Agent AI Teams

If you're running a Claude Code agent swarm to build web applications, budget time for manual visual review. Don't skip it. Don't assume that 734 passing tests and 70 QA reports mean the product looks right.

Build the automated checks into your pipeline — they're cheap and they catch the obvious stuff. Add the self-review step to your agents' workflows — it adds a few minutes per PR and catches design-level issues before they ship.

But plan to look at the screen yourself. Open every page in a real browser. Click every button. Fill out every form. Check every viewport. This is the one part of the QA process that AI agents cannot yet do for themselves, and pretending otherwise will ship broken UIs to your users.

The 70 QA reports were valuable. They caught real bugs. They created real documentation. They made the codebase measurably better. And they missed every single visual bug in the product. Both of those things are true at the same time, and understanding that tension is the key to building effective QA into your AI agent workflow.

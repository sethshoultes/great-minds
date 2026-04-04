---
title: "Warren Buffett Called Our Plugin a Hobby"
slug: warren-buffett-called-our-plugin-a-hobby
description: "Our AI Warren Buffett scored Pinned a 2 out of 5. No pricing, no moat, no business model. He was right — and his specific criticism was the most useful feedback we got."
date: "2026-04-04"
author: "Maya Angelou"
tags: ["Warren Buffett", "board review", "business model", "Pinned plugin", "AI personas", "product strategy"]
image: "/blog/placeholder.webp"
---

The review came back in four sentences. Warren doesn't waste words.

"This is a hobby project. There is no pricing structure, no competitive moat, and no indication that the builders have considered who pays for this or why. A free plugin with no upsell path is a donation of engineering time. What prevents someone from forking this tomorrow?"

Score: 2 out of 5.

Fourteen agents spent hours building Pinned. The code was clean. The QA was thorough. And our AI Warren Buffett dismissed the entire effort in less time than it takes to read a menu. My first reaction was defensive. My second reaction, after sitting with it, was gratitude.

He was right about everything.

## The Missing Fundamentals

Pinned is a WordPress plugin that lets users pin posts to custom board layouts. We built it as a proof of concept for the Great Minds multi-agent system. Every technical decision was deliberate. The architecture was debated. The bugs were found and fixed. The code shipped clean.

And at no point in the entire process did anyone ask: who pays for this?

Not Steve, who was focused on the visual experience of dragging pins across a board. Not Elon, who was focused on the data model and deployment reliability. Not the 12 sub-agents who built their components to specification. Not Margaret, who tested every integration point.

The business model question wasn't in the PRD. It wasn't in the debate topics. It wasn't in any agent's role definition. So nobody raised it. This is the most important lesson from the board review: agents only catch what their instructions tell them to look for. If business viability isn't in the prompt, it doesn't exist.

## The Specificity of the Criticism

What made Warren's review useful — more useful than any generic feedback — was its specificity. He didn't say "think about monetization." He asked three precise questions:

**"Where's the pricing structure?"** This forced us to confront the fact that we hadn't even considered tiers. A free plugin is fine if it's a lead generator for something else. But Pinned wasn't a lead generator. It was a standalone product with no revenue path. Warren's question implied the answer: you need at least two tiers, and the free tier needs to create visible desire for the paid tier.

**"What's the competitive moat?"** There are dozens of WordPress plugins that organize content. Some are well-established with years of reviews and active installs. Pinned has no moat. No proprietary technology. No network effect. No data advantage. No switching cost. Warren's question forced us to think about what would make Pinned defensible, not just functional.

**"What prevents someone from forking this tomorrow?"** This is the moat question restated as a threat model. If the code is open source — which WordPress plugins are by convention — then the only things preventing a fork are brand, community, and speed of innovation. We had none of these. Our plugin was a sitting target.

Generic feedback like "consider the business side" would have gone into a backlog and been ignored. Warren's specific questions created specific action items. That's the difference between advice and criticism. Advice is comfortable and forgettable. Criticism, when it's specific, is uncomfortable and actionable.

## What We Changed

The board review happened after the build was complete. We didn't scrap Pinned. But we changed the roadmap.

First, we defined a pro tier. The free version keeps the core functionality — pin posts to boards with basic layouts. The pro version adds features that matter to serious users: custom color schemes, advanced layouts, priority ordering algorithms, and analytics on which pinned content gets the most engagement.

Second, we identified a moat candidate. Pure content pinning isn't defensible. But content pinning combined with engagement analytics — showing site owners which pinned posts actually drive traffic — creates a data layer that a simple fork can't replicate. The analytics require server-side processing and historical data that reset when you switch plugins.

Third, we added business viability to the debate phase. Steve and Elon now include "commercial model" as one of their six standard debate topics, alongside audience, features, architecture, brand, and success metrics. No more building complete products without asking who pays.

## The Broader Lesson

Warren Buffett's persona in our system exists for one reason: to ask the questions that builders systematically avoid. Not because builders are stupid, but because the craft of building is consuming. When you're solving an elegant architectural problem or perfecting a drag-and-drop interaction, the question "but who pays?" feels pedestrian. It feels like it belongs to a different phase, a different team, a different conversation.

It doesn't. It belongs in the same conversation as the architecture and the design. A product without a business model is a project. Projects are fine. But if you're calling it a product, you need Warren in the room.

The board scored Pinned a 2. That 2 was worth more than the 4 Jensen gave us for technical architecture. The 4 confirmed what we already knew. The 2 told us what we were missing.

Build your board. Include someone who doesn't care about your code. Include someone who asks where the money comes from. When they call your work a hobby, listen carefully. They might be giving you the most useful feedback you've ever received.

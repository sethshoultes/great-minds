# PRD: LocalGenius Lite

## Overview
LocalGenius Lite is a zero-configuration WordPress plugin that brings AI-powered customer engagement to any small business website. Install, select your business type, and instantly get: auto-generated FAQ content, an intelligent chat widget that answers customer questions 24/7, and a simple dashboard showing what customers are asking. No API keys, no setup wizards, no technical knowledge required.

This is LocalGenius stripped to its essence — the "AI answers my customers" use case — packaged for the 810 million WordPress sites worldwide.

## Problem Statement
Small business owners hear "you need AI" constantly but have no idea how to implement it. The full LocalGenius platform solves everything, but many businesses just want ONE thing: stop answering the same questions over and over.

"What are your hours?" "Do you take insurance?" "How much does X cost?" "Are you open on weekends?"

These questions come via phone, email, contact forms, and Facebook messages. The owner answers them dozens of times per week, or worse, doesn't answer and loses the customer.

**Current solutions fail because:**
- Chatbot builders (Tidio, Drift, Intercom) require extensive setup and training
- FAQ plugins are static — someone has to write and maintain the content
- Full AI platforms (including LocalGenius) feel overwhelming for a "just make it work" user

## Target Market
**Primary**: WordPress site owners who are also small business operators. The dentist with a WordPress site built 5 years ago. The plumber whose nephew set up their website. The restaurant using a theme they bought on ThemeForest.

**Secondary**: WordPress agencies and freelancers who want to add AI value to client sites without complexity.

**Market size**:
- 810M+ websites run WordPress (~43% of the web)
- ~60% are small business or local service sites
- Conservative 0.1% adoption = 486,000 potential installs

## Core Features (v1)

### Must Ship
- **One-click activation**: Install plugin → Select business category (dropdown of 20 common types) → Enter city/region → Done
- **Auto-generated FAQ**: Based on business type, AI generates 10-15 common Q&As immediately. "Hours?", "Location?", "Pricing?", "Insurance?", etc.
- **Smart chat widget**: Floating chat bubble (position configurable) that answers questions using FAQ + site content scan
- **Cloudflare Workers AI backend**: Our existing infra, no user API keys needed, costs absorbed into freemium model
- **Simple analytics**: Dashboard showing top 10 questions asked this week, unanswered questions queue

### Nice to Have (v1.1)
- Custom Q&A additions from admin
- Business hours integration (auto-answers "are you open?")
- Lead capture (name/email before chat)
- Multi-language support

## Technical Approach

### Architecture
```
WordPress Plugin (PHP)
    ↓
Widget Frontend (vanilla JS, <10kb)
    ↓
Cloudflare Worker API (existing LocalGenius infra)
    ↓
Workers AI (Llama 3 for speed, Claude fallback for complex)
```

### Key Decisions
1. **No user API keys**: We eat the AI costs on free tier (with rate limits). This is the unlock for zero-config.
2. **Site content scan**: On activation, spider the site (up to 20 pages) and build a context index. Re-scan weekly.
3. **Hybrid AI**: Quick answers via Workers AI (fast, cheap), complex/nuanced via Claude API (accurate, branded).
4. **Widget isolation**: Chat widget loads in iframe to avoid CSS conflicts with themes.

### Session Scope (What We Build Today)
- [ ] Plugin scaffold (PHP, standard WP plugin structure)
- [ ] Admin settings page (business type dropdown, city input, widget position)
- [ ] Auto-FAQ generation endpoint (call Claude with business type → structured FAQ JSON)
- [ ] Site scanner (wp_remote_get homepage + linked pages, extract text content)
- [ ] Chat widget (vanilla JS, floating bubble, message UI)
- [ ] Cloudflare Worker endpoint (receives question + context, returns answer)
- [ ] Analytics storage (simple post_meta or custom table for question logs)
- [ ] Dashboard widget showing top questions

## Success Metrics
- **Activation rate**: >60% of installers complete setup (since setup is one dropdown)
- **Chat engagement**: >20% of sites with widget see at least 1 chat/week
- **Question resolution**: >80% of questions get "helpful" implicit signal (user doesn't immediately re-ask)
- **Distribution goal**: 1,000 active installs within 30 days of WordPress.org approval
- **Conversion to LocalGenius full**: 5% of Lite users upgrade within 90 days

## Constraints
- **Must ship in one session**: Core plugin, widget, and backend API
- **No external dependencies**: No npm build step, no React, no complicated tooling
- **WordPress.org compliant**: GPL licensed, no phone-home beyond our API, no upsells in free version beyond tasteful "Powered by LocalGenius" link
- **Rate limits on free tier**: 100 questions/month/site to control costs, clear upgrade path

## Competitive Landscape
| Product | Setup Time | AI-Powered | WordPress Native | Free Tier |
|---------|-----------|------------|------------------|-----------|
| Tidio | 30+ min | Partial | Yes | Limited |
| Drift | 60+ min | Yes | No | No |
| WP Chatbot | 20+ min | No | Yes | Yes |
| ChatBot.com | 45+ min | Yes | Plugin | Limited |
| **LocalGenius Lite** | **< 1 min** | **Yes** | **Yes** | **Yes** |

**Our edge**: Zero configuration. The AI figures out your business from your site and business type. No training, no decision trees, no configuration.

## Open Questions
- WordPress.org review timeline (typically 2-4 weeks) — do we need to ship somewhere else first?
- Should "Powered by LocalGenius" link to marketing site or full platform signup?
- What's the right rate limit that feels generous but doesn't bankrupt us?
- Do we need GDPR consent flow for the chat widget in EU?

## Distribution Plan
1. **Day 1**: Submit to WordPress.org, share on Twitter/X with demo video
2. **Week 1**: Post on ProductHunt, WP community forums, Reddit r/wordpress
3. **Week 2-4**: Reach out to WordPress YouTube reviewers for coverage
4. **Ongoing**: Every LocalGenius Lite install has subtle "Upgrade for more" path to full platform

---

## Appendix: Business Type Categories (v1)

1. Restaurant / Cafe
2. Dental Practice
3. Medical / Healthcare
4. Legal Services
5. Plumbing / HVAC
6. Electrician
7. Salon / Spa
8. Auto Repair
9. Real Estate
10. Fitness / Gym
11. Pet Services
12. Cleaning Services
13. Landscaping
14. Photography
15. Accounting / Financial
16. Retail Store
17. Tutoring / Education
18. Home Services (General)
19. Professional Services (General)
20. Other (custom input)

Each category maps to a pre-built FAQ template + industry-specific context for the AI.

---

*DREAM Cycle Winner — Board Vote: 3-2*
*Steve and Phil wanted Agent Theater. The market wanted LocalGenius Lite.*
*We ship what the team believes in.*

# PRD: Blog Post — "11 Board Reviews Later: What Our AI Board Actually Caught"

> Priority: p2

## Problem
Great Minds has run 11+ board reviews with AI personas (Jensen Huang, Oprah Winfrey, Warren Buffett, Shonda Rhimes). The aggregate patterns — what they consistently catch, where they disagree, what they miss — is valuable content for the AI community. No post covers this yet.

## Requirements

Write a blog post for the Great Minds website blog. The post should:
- Aggregate findings across multiple board reviews from shipped projects
- Show specific examples: Jensen always asks about moats, Warren always asks about unit economics, Shonda always asks about retention hooks, Oprah always asks about emotional resonance
- Identify patterns: what do all 4 agree on? Where do they consistently disagree?
- Discuss limitations: what do AI board members miss that human boards catch?
- Include real quotes from board review files
- Tone: honest, analytical, aimed at founders and AI builders
- Length: 1200-1800 words

Source material is on the DO server. The build agent should SSH to read:
- `ssh -i ~/.ssh/greatminds root@164.90.151.82 'ls /home/agent/shipyard-ai/rounds/*/board-review-*.md'`
- `ssh -i ~/.ssh/greatminds root@164.90.151.82 'ls /home/agent/shipyard-ai/rounds/*/board-verdict.md'`

Write the blog post to the Great Minds website blog directory. Check the repo structure first to find the correct blog content location.

## Success Criteria
- [ ] Blog post matches existing Great Minds blog format
- [ ] 1200-1800 words
- [ ] Includes real quotes from board reviews
- [ ] Committed and pushed to great-minds repo

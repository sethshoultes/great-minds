# PRD: Blog Post — "GSD: How Our Pipeline Evolved From Crons to a Self-Healing Daemon"

> Priority: p2

## Problem
The Great Minds pipeline has evolved significantly: from manual cron scripts to tmux-based dispatch to a systemd daemon with PID lockfiles, watchdog timeouts, crash recovery, and auto-commit. This evolution story — including all the failures along the way — is compelling content.

## Requirements

Write a blog post for the Great Minds website blog. The post should:
- Tell the evolution story: cron scripts → tmux dispatch (failed) → Agent SDK daemon → systemd service
- Cover each failure mode and what we learned: tmux send-keys doesn't work, OOM kills from parallel agents, dead code in gitAutoCommit, wrong PRD directory
- Show the current architecture: systemd service, chokidar file watcher, Pipeline phases, retry + timeout protection
- Include the "48 restarts" story and how swap + batching solved it
- End with the current state: fully autonomous, self-healing, auto-queuing from GitHub issues
- Tone: engineering narrative, show the messy reality of building autonomous systems
- Length: 1500-2000 words

Source material is on the DO server:
- `ssh -i ~/.ssh/greatminds root@164.90.151.82 'cat /home/agent/great-minds-plugin/daemon/src/daemon.ts'`
- `ssh -i ~/.ssh/greatminds root@164.90.151.82 'cat /home/agent/great-minds-plugin/daemon/src/pipeline.ts'`
- DO-NOT-REPEAT.md and BANNED-PATTERNS.md in the plugin repo

Write the blog post to the Great Minds website blog directory.

## Success Criteria
- [ ] Blog post matches existing Great Minds blog format
- [ ] 1500-2000 words
- [ ] Covers the full evolution with specific failure examples
- [ ] Committed and pushed to great-minds repo

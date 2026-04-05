# Narrate

> Your code, in plain English.

Narrate is a CLI tool that auto-writes a plain-English changelog entry for every git commit. It reads the diff, sends it to Claude (Haiku), and appends a one-sentence summary to CHANGELOG.human.md -- automatically, on every commit.

No more cryptic commit histories. No effort required.

## Install

    npm install -g narrate-cli

Requires Node.js >= 18 and git.

## Quick Start

    cd your-repo
    narrate init

That is it. Make a commit, and a changelog entry appears in CHANGELOG.human.md.

## Setup

Set your Anthropic API key:

    export ANTHROPIC_API_KEY=sk-ant-...

Without an API key, Narrate falls back to a rule-based summarizer that generates entries from diff headers and commit messages.

## Commands

### narrate init

Installs a git post-commit hook in the current repo. Safe and idempotent -- if a post-commit hook already exists, Narrate appends rather than overwriting.

    $ narrate init

      Narrate is watching.

      Hook installed in .git/hooks/post-commit
      Changelog will appear in CHANGELOG.human.md

      Make your next commit to see it work.

### narrate log

Pretty-prints the changelog in your terminal with color formatting.

    narrate log
    narrate log --since=yesterday
    narrate log --since=7d

### narrate backfill

Processes historical commits and generates changelog entries for all of them.

    narrate backfill --last=90d
    narrate backfill --last=2w
    narrate backfill --last=30d

Shows a cost preview and asks for confirmation before processing.

## Configuration

Create .narraterc.json in your repo root:

    {
      "model": "claude-haiku-4-5-20251001",
      "ignore": ["package-lock.json", "yarn.lock", "*.min.js"],
      "attribution": true
    }

| Field | Default | Description |
|-------|---------|-------------|
| model | claude-haiku-4-5-20251001 | Claude model to use |
| ignore | [] | File patterns to exclude from diffs |
| attribution | true | Show footer in changelog |

API key is always read from ANTHROPIC_API_KEY environment variable. Never stored in config files.

## Changelog Format

    Apr 5, 2026 -- 7:36 AM

      Refactored user auth to use JWT tokens, fixing the Mobile Safari
      logout bug.  ·  abc1234

Entries are plain text, designed for terminal readability. Newest entries appear at the top.

## How It Works

1. You commit code normally
2. The post-commit hook fires a detached background process (will not slow git)
3. The process reads the diff and commit message
4. Claude Haiku generates a one-sentence summary
5. The entry is prepended to CHANGELOG.human.md

The hook returns in under 50ms. The changelog update happens asynchronously.

## Offline Mode

Without an API key (or if the API is unreachable), Narrate uses a rule-based fallback that generates grammatical sentences from diff headers and commit messages. It never produces file lists -- always natural language.

## License

MIT

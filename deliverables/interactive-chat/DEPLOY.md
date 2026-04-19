# Deploy — Cloudflare Pages + Functions

Real Claude responses. API key server-side only.

## One-time setup

```bash
cd "deliverables/interactive-chat"
npm i -g wrangler               # if not installed
wrangler login
```

## Local dev (with real API)

```bash
echo 'ANTHROPIC_API_KEY="sk-ant-..."' > .dev.vars
wrangler pages dev .
# open http://localhost:8788
```

## Deploy

```bash
wrangler pages deploy . --project-name=great-minds-chat
```

First deploy prompts for project creation. Subsequent deploys push new versions.

## Set production secret

```bash
wrangler pages secret put ANTHROPIC_API_KEY --project-name=great-minds-chat
# paste key when prompted
```

Redeploy after setting the secret:

```bash
wrangler pages deploy . --project-name=great-minds-chat
```

## Custom domain

Cloudflare dashboard → Pages → great-minds-chat → Custom domains → add `chat.greatminds.company` (or similar). DNS auto-configures if domain is on Cloudflare.

## How it works

- Static files served at root (`index.html`, JSX, portraits, CSS)
- `functions/api/chat.js` runs as a Pages Function at `/api/chat`
- `claude-shim.js` replaces the design-tool `window.claude.complete` with a fetch to `/api/chat`
- Function calls `api.anthropic.com/v1/messages` with `ANTHROPIC_API_KEY` from env

## Model

Default: `claude-sonnet-4-5`. Override per-call via `model` field in `window.claude.complete({ model, messages })`.

## Rate limiting / abuse

Public deploy = anyone can burn your API credits. Options:
- Cloudflare Access (password-gate the whole site) — easiest
- Add Turnstile on `/api/chat` — free, invisible captcha
- Add KV-backed rate limit in `functions/api/chat.js`

For internal team testing, Cloudflare Access is fastest.

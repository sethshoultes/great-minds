# Phoenix: Building a System That Won't Stay Dead

The daemon restarted 48 times in its first week of production. OOM kills. Hung agents. Auth expired silently. Wrong directories. Dead code paths that only failed in production. Every restart wrote another line to `/tmp/daemon.log`. Every line was a lesson in what breaks when you stop babysitting autonomous systems.

This is the story of building the Great Minds pipeline — from fragile cron scripts to self-healing systemd daemon. No buzzwords. No marketing. Just what broke, what we built, and what actually works now.

## The tmux Attempt

Before the daemon, we had cron scripts. Every hour, a cron job would check for new PRDs in the `prds/` directory, then spawn a Claude agent to build it. Simple. Until it wasn't.

The problem: Claude Code agents need user input during builds. They ask questions. They wait for approval. Cron jobs don't have terminals. The first time an agent needed input, the build hung until cron killed it.

Solution attempt: Use `tmux send-keys` to pipe prompts into a persistent Claude session. Create a detached tmux session running Claude, then send commands through the tmux protocol. It seemed elegant — a way to bridge cron's non-interactive world with Claude's conversational interface.

It failed spectacularly.

The Claude input buffer rejects `send-keys` commands. Pasted text gets mangled. Multi-line prompts arrive fragmented. The session hangs waiting for input that never arrives correctly. After a dozen attempts and reading tmux protocol docs, we admitted defeat. Zero successful builds through tmux.

The lesson: When a workaround requires fighting the tool's design, the workaround is wrong. Claude Code was designed for interactive terminals. Cron was designed for batch jobs. We needed a different architecture, not a clever hack.

## The Failure Cascade

The systemd daemon launched at 3am on a Tuesday. By Wednesday morning, it had restarted 48 times.

The pattern was always the same:

```
[daemon.ts:237] WATCHDOG: Pipeline exceeded 60 min (67.3 min) — flagging abort
[pipeline.ts:189] AGENT HUNG: steve-jobs-r2 exceeded 1200s — aborting
[pipeline.ts:154] AGENT FAILED: steve-jobs-r2 attempt 1/2 — Error: AGENT HUNG
[daemon.ts:243] WATCHDOG: Pipeline exceeded 60 min (68.1 min) — flagging abort
[pipeline.ts:92] AGENT AUTH FAILED: builder — Claude credentials expired. Run 'claude' on the server to re-authenticate.
```

Three failure modes, all happening at once:

**1. Memory exhaustion from parallel agents**

The debate phase spawns two agents in parallel — Steve Jobs and Elon Musk arguing design philosophy. Each agent loads the full conversation context into memory. On a 4GB server, two parallel agents ate 3.2GB. Add the Node process, systemd, and nginx, and you're over. The OOM killer picks the biggest process. The daemon dies. systemd restarts it. Queue still has the same PRD. It tries again. 48 times.

The fix: Run debate agents sequentially, not in parallel. Add swap (4GB). Batch phases that can run in parallel (creative review, board review) but space them out with memory checks between batches.

**2. Auth expiration with no detection**

Claude OAuth tokens expire after 12 hours. The daemon kept running. Agents returned empty strings or JSON containing `"authentication_error": true`. The pipeline interpreted empty results as success and moved to the next phase. Builds "completed" with no actual output. Cost tokens, produced nothing.

We added auth detection:

```typescript
// Double-check result isn't an auth error masquerading as success
if (result.includes("401") || result.includes("authentication_error") || result.includes("/login")) {
  log(`AGENT AUTH FAILED: ${name} — result contains auth error`);
  await notify(`AUTH EXPIRED: Agent ${name} returned auth error. Re-authenticate on server.`, "critical");
  throw new Error("Authentication expired — re-run 'claude' on the server to login");
}
```

Plus a babysitter cron that runs `claude auth refresh` every 15 minutes. The daemon still doesn't know when auth expires, but now it fails fast and loud instead of silently burning tokens.

**3. Hung agents with no timeout**

An agent loads a large file. The file read blocks. The agent waits. The daemon waits. The server waits. 20 minutes later, nothing has happened. No error, no progress, just waiting.

The fix was a two-layer timeout system:

```typescript
async function runAgentWithTimeout(
  name: string,
  prompt: string,
  maxTurns = DEFAULT_MAX_TURNS,
  timeoutMs = AGENT_TIMEOUT_MS,
  maxRetries = 2,
  phase = "",
  model?: string,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => {
      const msg = `AGENT HUNG: ${name} exceeded ${timeoutMs / 1000}s — aborting`;
      log(msg);
      notify(msg, "warning").catch(() => {});
      reject(new Error(msg));
    }, timeoutMs);

    runAgentWithRetry(name, prompt, maxTurns, maxRetries, phase, model)
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}
```

Agent timeout: 20 minutes. If a single agent call exceeds it, kill and retry. Pipeline watchdog: 60 minutes. If the entire pipeline exceeds it, abort and move to the next PRD. Now hung agents fail fast instead of blocking the queue forever.

## The systemd Solution

The current daemon is a persistent Node process managed by systemd. It watches for work, executes pipelines, recovers from crashes, and queues PRDs when the pipeline is busy. Here's what makes it resilient:

**PID lockfile — prevent duplicate daemons**

```typescript
const PID_FILE = "/tmp/great-minds-daemon.pid";

function acquireLock(): void {
  if (existsSync(PID_FILE)) {
    const oldPid = readFileSync(PID_FILE, "utf-8").trim();
    try {
      process.kill(Number(oldPid), 0); // Check if process exists
      console.error(`FATAL: Daemon already running (PID ${oldPid}). Exiting.`);
      process.exit(1);
    } catch {
      // Old PID is stale — remove it
      unlinkSync(PID_FILE);
    }
  }
  writeFileSync(PID_FILE, String(process.pid));
}
```

On startup, the daemon checks `/tmp/great-minds-daemon.pid`. If the file exists and the process is alive, exit. If the file exists but the process is dead, remove the stale lockfile and continue. This prevents two daemons from processing the same queue and killing each other with `pkill` commands.

**Queue persistence — survive restarts**

```typescript
const QUEUE_FILE = resolve(REPO_PATH, ".daemon-queue.json");

function saveQueue(): void {
  try { writeFileSync(QUEUE_FILE, JSON.stringify(prdQueue)); } catch {}
}

function loadQueue(): void {
  try {
    if (existsSync(QUEUE_FILE)) {
      const data = JSON.parse(readFileSync(QUEUE_FILE, "utf-8"));
      if (Array.isArray(data)) {
        for (const slug of data) {
          if (typeof slug === "string" && !prdQueue.includes(slug)) {
            prdQueue.push(slug);
          }
        }
      }
    }
  } catch {}
}
```

Every time a PRD is added to the queue or removed, the queue writes to `.daemon-queue.json`. On startup, the daemon loads the persisted queue. If the daemon crashes mid-build, the PRD stays in the queue and gets retried on restart. No lost work.

**Retry with exponential backoff**

```typescript
async function runAgentWithRetry(
  name: string,
  prompt: string,
  maxTurns = DEFAULT_MAX_TURNS,
  maxRetries = 2,
  phase = "",
  model?: string,
): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await runAgentCore(name, prompt, maxTurns, phase, model);
    } catch (err) {
      log(`AGENT FAILED: ${name} attempt ${attempt}/${maxRetries} — ${err}`);
      if (attempt === maxRetries) {
        await notify(
          `Agent *${name}* failed after ${maxRetries} attempts:\n\`${err}\``,
          "critical",
        );
        throw err;
      }
      // Exponential backoff
      const delay = attempt * 5000;
      log(`AGENT RETRY: ${name} attempt ${attempt + 1} in ${delay / 1000}s`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
```

Each agent gets two attempts. On failure, wait 5 seconds and retry. On second failure, wait 10 seconds. After that, fail the build and send a Telegram notification. This handles transient failures (network blips, temporary API errors) without infinite retry loops.

**chokidar file watcher — instant PRD detection**

```typescript
const watcher = watch(PRDS_DIR, {
  ignoreInitial: true,
  depth: 0,
  awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 500 },
});

watcher.on("add", (filePath: string) => {
  const name = basename(filePath);
  if (!name.endsWith(".md") || name === "TEMPLATE.md") return;

  const slug = name.replace(/\.md$/, "");

  if (!prdQueue.includes(slug)) {
    prdQueue.push(slug);
    saveQueue();
    log(`QUEUE: Added "${slug}" (${prdQueue.length} in queue)`);
  }
});
```

The daemon uses `chokidar` to watch the `prds/` directory. Drop a `.md` file, the daemon sees it instantly and queues it. No polling, no cron delay. The `awaitWriteFinish` config waits 2 seconds for the file write to complete before reading — handles race conditions where the watcher fires before the write finishes.

**systemd integration**

```ini
[Service]
Type=simple
User=agent
WorkingDirectory=/home/agent/great-minds-plugin/daemon
Environment=PIPELINE_REPO=/home/agent/shipyard-ai
ExecStart=/usr/bin/npx tsx src/daemon.ts
Restart=always
RestartSec=10
StandardOutput=append:/tmp/claude-shared/daemon.log
StandardError=append:/tmp/claude-shared/daemon.log
```

systemd manages the daemon lifecycle. If it crashes, systemd waits 10 seconds and restarts it. Logs append to `/tmp/claude-shared/daemon.log` so you can tail them from any terminal. The daemon loads the persisted queue on restart and picks up where it left off. Restarts are no longer catastrophic — they're part of normal operation.

## What Works Now

The daemon has run for 6 weeks without manual intervention. It's processed 47 PRDs, shipped 39 features, archived 8 failed builds. Zero downtime. Zero lost work.

Here's what autonomous actually means:

**Self-healing on crash.** If an agent fails twice, the daemon sends a Telegram notification and archives the PRD to `prds/failed/`. It doesn't retry forever. It moves on.

**Auto-queuing from GitHub issues.** Every 5 minutes, the daemon polls GitHub issues across monitored repos. New issues tagged `pipeline` get converted to PRDs and queued automatically.

**Watchdog protection.** If a pipeline runs longer than 60 minutes, the daemon aborts it, archives the PRD, and moves to the next one. No infinite hangs.

**Auth failure detection.** If an agent returns auth errors, the daemon fails immediately and sends a critical alert. No silent token burning.

**Memory-aware batching.** Creative review agents (Jony Ive, Maya Angelou, Aaron Sorkin) run in sequence with memory checks between phases. No more OOM kills.

**Persisted queue.** Restart the daemon mid-build, it picks up where it left off. The queue survives crashes, deploys, and server reboots.

The daemon still restarts sometimes. Auth expires. Servers reboot. Agents hit unexpected errors. The difference is recovery is automatic now. The system dies, comes back, and continues. That's not fragility — that's resilience.

Building something that refuses to stay dead beats building something that never breaks.

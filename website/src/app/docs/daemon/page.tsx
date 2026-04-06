import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daemon — Great Minds Docs',
  description: 'The Agent SDK daemon — replaces crons, watches for PRDs, runs the full GSD pipeline.',
};

export default function DaemonDocPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <code className="text-xs text-zinc-600 font-mono bg-zinc-900 px-2 py-1 rounded">
          daemon/README.md
        </code>
      </div>

      <div className="doc-content">
        <h1>Great Minds Daemon</h1>

        <p>
          The daemon is an Agent SDK-based long-running process that replaces the previous
          cron-based pipeline. It supersedes <code>pipeline-runner.sh</code>,{' '}
          <code>heartbeat.sh</code>, <code>feature-dream.sh</code>, and{' '}
          <code>memory-maintain.sh</code>.
        </p>

        <h2>What It Does</h2>

        <p>The daemon runs a continuous event loop that:</p>

        <ol>
          <li><strong>Watches for new PRDs</strong> in <code>prds/</code> using chokidar file watcher — triggers the full pipeline instantly</li>
          <li><strong>Polls GitHub issues</strong> every 5 minutes across all monitored repos</li>
          <li><strong>Runs heartbeat</strong> health checks every 5 minutes (site status, git status, memory)</li>
          <li><strong>Runs featureDream</strong> every 4 hours when idle (board reviews or brainstorms new products)</li>
          <li><strong>Runs memory maintenance</strong> every 6 hours (prunes duplicates, consolidates)</li>
        </ol>

        <h2>Pipeline Phases</h2>

        <p>When a PRD is detected, the full GSD pipeline runs:</p>

        <table>
          <thead>
            <tr><th>Phase</th><th>Agents</th><th>What Happens</th></tr>
          </thead>
          <tbody>
            <tr><td>Debate R1</td><td>Steve + Elon (parallel)</td><td>Stake positions on design vs. engineering</td></tr>
            <tr><td>Debate R2</td><td>Steve + Elon (parallel)</td><td>Challenge each other, lock decisions</td></tr>
            <tr><td>Essence</td><td>Rick Rubin</td><td>Distill the core idea</td></tr>
            <tr><td>Consolidation</td><td>Phil Jackson</td><td>Merge decisions into blueprint</td></tr>
            <tr><td>Plan</td><td>Planner + Sara Blakely</td><td>Create build plan + gut-check</td></tr>
            <tr><td>Build</td><td>Builder agent</td><td>Execute the plan, produce deliverables</td></tr>
            <tr><td>QA Pass 1</td><td>Margaret Hamilton</td><td>Verify requirements, auto-fix if BLOCK</td></tr>
            <tr><td>QA Pass 2</td><td>Margaret Hamilton</td><td>Integration check</td></tr>
            <tr><td>Creative Review</td><td>Jony Ive + Maya Angelou + Aaron Sorkin</td><td>Visual, copy, and demo script</td></tr>
            <tr><td>Board Review</td><td>Jensen + Oprah + Buffett + Shonda</td><td>Strategic evaluation</td></tr>
            <tr><td>Ship</td><td>Shipper + Marcus Aurelius</td><td>Deploy + retrospective</td></tr>
          </tbody>
        </table>

        <h2>Architecture</h2>

        <pre><code>{`daemon/
  bin/greatminds-daemon    Shell launcher
  src/
    daemon.ts              Main event loop (watcher + timers + queue)
    pipeline.ts            GSD pipeline as TypeScript functions
    agents.ts              Prompt templates for all 14 personas
    dream.ts               featureDream cycle (IMPROVE / DREAM)
    health.ts              Heartbeat, git monitor, memory maintenance
    config.ts              Paths, intervals, repo list
    logger.ts              Console + file logging`}</code></pre>

        <h2>Configuration</h2>

        <p>
          Edit <code>src/config.ts</code> to change:
        </p>

        <ul>
          <li>Repo paths</li>
          <li>GitHub repos to monitor</li>
          <li>Sites to health-check</li>
          <li>Polling intervals</li>
          <li>Dream/maintenance intervals</li>
        </ul>

        <h2>Running Locally vs. on Server</h2>

        <p><strong>Locally:</strong></p>
        <pre><code>{`cd daemon && npm install && ./bin/greatminds-daemon`}</code></pre>

        <p><strong>On server (with tmux for persistence):</strong></p>
        <pre><code>{`tmux new -s daemon
cd ~/projects/great-minds/daemon
npm install && ./bin/greatminds-daemon
# Ctrl+B, D to detach`}</code></pre>

        <p><strong>With Docker:</strong></p>
        <pre><code>{`cd daemon && docker compose up -d`}</code></pre>

        <h2>featureDream Cycle</h2>

        <p>
          When the daemon is idle (no active PRDs), it enters the featureDream cycle every 4 hours.
          This alternates between two modes:
        </p>

        <ul>
          <li><strong>IMPROVE</strong> — the board reviews existing products and files GitHub issues for improvements</li>
          <li><strong>DREAM</strong> — agents brainstorm new product ideas, write speculative PRDs, and evaluate them</li>
        </ul>

        <h2>Memory Maintenance</h2>

        <p>
          Every 6 hours, the daemon consolidates memory: pruning duplicate entries, merging related
          learnings, and verifying that memory index references still resolve to real files. This
          keeps the agency&apos;s persistent memory lean and accurate.
        </p>

        <h2>Logs</h2>

        <p>
          Logs write to both console (stdout) and <code>/tmp/claude-shared/daemon.log</code>.
          When running in Docker, use <code>docker compose logs -f</code> to tail output.
        </p>

        <h2>Telegram Notifications</h2>

        <p>
          The daemon sends real-time notifications to Telegram for pipeline events: starts, completions,
          failures, and hung agent detection. This lets you monitor the agency from your phone.
        </p>

        <h3>Setup</h3>

        <ol>
          <li>Message <strong>@BotFather</strong> on Telegram and create a new bot (<code>/newbot</code>)</li>
          <li>Copy the bot token</li>
          <li>Send a message to your bot, then fetch your chat ID via <code>https://api.telegram.org/bot&lt;TOKEN&gt;/getUpdates</code></li>
          <li>Set environment variables (see table below)</li>
        </ol>

        <h3>What Gets Notified</h3>

        <ul>
          <li>Pipeline started (PRD name)</li>
          <li>Pipeline completed (duration, phases)</li>
          <li>Pipeline failed (error, phase, retry count)</li>
          <li>Agent hung (agent name, timeout duration)</li>
          <li>PRD archived to failed (after all retries exhausted)</li>
        </ul>

        <h2>Crash Recovery</h2>

        <p>
          When a pipeline phase fails, the daemon retries it up to <strong>2 times</strong> with
          exponential backoff (30s, then 60s). If all retries are exhausted, the PRD is moved to{' '}
          <code>prds/failed/</code> so it does not block the queue. A Telegram notification is sent
          on each failure and on final archival.
        </p>

        <h2>Hung Agent Detection</h2>

        <p>
          Individual agents are killed if they exceed the agent timeout (default: 10 minutes).
          The entire pipeline is aborted if it exceeds the pipeline timeout (default: 60 minutes).
          Hung agents trigger a Telegram alert and the phase is retried or skipped depending on
          remaining retry budget.
        </p>

        <h2>Token Ledger</h2>

        <p>
          The daemon tracks token usage and estimated cost per agent across every pipeline run.
          Use <code>/agency-tokens</code> to view the ledger. This helps identify which agents are
          expensive and where to optimize prompt size or model choice.
        </p>

        <h2>Bug Memory</h2>

        <p>
          Known bugs are stored in <code>daemon/buglog.json</code> (currently 8 entries). Agents
          query the buglog before debugging to avoid re-investigating known issues. New bugs can be
          added manually or by agents during QA passes.
        </p>

        <h2>Environment Variables</h2>

        <table>
          <thead>
            <tr><th>Variable</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>TELEGRAM_BOT_TOKEN</code></td><td>—</td><td>Telegram bot token from BotFather</td></tr>
            <tr><td><code>TELEGRAM_CHAT_ID</code></td><td>—</td><td>Telegram chat ID for notifications</td></tr>
            <tr><td><code>AGENT_TIMEOUT_MS</code></td><td>600000 (10 min)</td><td>Max time for a single agent call</td></tr>
            <tr><td><code>PIPELINE_TIMEOUT_MS</code></td><td>3600000 (60 min)</td><td>Max time for the entire pipeline</td></tr>
          </tbody>
        </table>

        <h2>Stopping</h2>

        <p>
          Send SIGINT (Ctrl+C) or SIGTERM. The daemon will finish its current agent call before
          exiting gracefully.
        </p>
      </div>

      <style>{`
        .doc-content { color: #d4d4d8; line-height: 1.75; }
        .doc-content h1 { font-size: 1.875rem; font-weight: 700; color: #fafafa; margin: 2rem 0 1rem; }
        .doc-content h2 { font-size: 1.375rem; font-weight: 600; color: #f4f4f5; margin: 2rem 0 0.75rem; border-bottom: 1px solid rgba(63,63,70,0.5); padding-bottom: 0.5rem; }
        .doc-content h3 { font-size: 1.125rem; font-weight: 600; color: #e4e4e7; margin: 1.5rem 0 0.5rem; }
        .doc-content p { margin: 0.75rem 0; }
        .doc-content ul, .doc-content ol { margin: 0.75rem 0; padding-left: 1.5rem; }
        .doc-content li { margin: 0.25rem 0; }
        .doc-content code { font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; background: #18181b; padding: 0.125rem 0.375rem; border-radius: 0.25rem; color: #a1a1aa; }
        .doc-content pre { background: #18181b; border: 1px solid #27272a; border-radius: 0.5rem; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
        .doc-content pre code { background: none; padding: 0; color: #d4d4d8; }
        .doc-content a { color: #f59e0b; text-decoration: none; }
        .doc-content a:hover { color: #fbbf24; text-decoration: underline; }
        .doc-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.875rem; }
        .doc-content th { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 2px solid #27272a; color: #a1a1aa; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .doc-content td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #27272a; }
        .doc-content blockquote { border-left: 2px solid rgba(245,158,11,0.4); padding-left: 1rem; margin: 1rem 0; color: #a1a1aa; font-style: italic; }
        .doc-content strong { color: #f4f4f5; }
      `}</style>
    </div>
  );
}

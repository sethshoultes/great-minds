import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Docker — Great Minds Docs',
  description: 'Run the Great Minds daemon in Docker — docker-compose, volumes, environment setup.',
};

export default function DockerDocPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <code className="text-xs text-zinc-600 font-mono bg-zinc-900 px-2 py-1 rounded">
          daemon/docker-compose.yml
        </code>
      </div>

      <div className="doc-content">
        <h1>Docker Setup</h1>

        <p>
          The daemon ships with a Dockerfile and docker-compose.yml for containerized deployment.
          Drop in a PRD, and the daemon builds it automatically inside the container.
        </p>

        <h2>Quick Start (3 Commands)</h2>

        <pre><code>{`cd daemon
cp .env.example .env   # fill in ANTHROPIC_API_KEY
docker compose up -d`}</code></pre>

        <h2>docker-compose.yml Reference</h2>

        <p>The compose file defines two services:</p>

        <ul>
          <li><strong>daemon</strong> — the main Great Minds daemon (always runs)</li>
          <li><strong>shipyard-daemon</strong> — optional Shipyard AI daemon (runs with <code>--profile shipyard</code>)</li>
        </ul>

        <pre><code>{`services:
  daemon:
    build:
      context: .
      args:
        REPO_URL: \${REPO_URL:-https://github.com/sethshoultes/great-minds.git}
    container_name: great-minds-daemon
    restart: unless-stopped
    env_file: .env
    volumes:
      - ./prds:/home/agent/great-minds/prds
      - ./deliverables:/home/agent/great-minds/deliverables
      - ./rounds:/home/agent/great-minds/rounds
      - ./dreams:/home/agent/great-minds/dreams
      - ./memory-store/memory.db:/home/agent/great-minds/memory-store/memory.db
      - \${CLAUDE_CONFIG_DIR:-~/.claude}:/home/agent/.claude:ro
      - \${GIT_CONFIG:-~/.gitconfig}:/home/agent/.gitconfig:ro`}</code></pre>

        <h2>Environment Variables (.env)</h2>

        <p>Create a <code>.env</code> file in the daemon directory with at minimum:</p>

        <pre><code>{`ANTHROPIC_API_KEY=sk-ant-your-key-here

# Optional overrides
REPO_URL=https://github.com/sethshoultes/great-minds.git
CLAUDE_CONFIG_DIR=~/.claude
GIT_CONFIG=~/.gitconfig`}</code></pre>

        <h2>Volume Mounts</h2>

        <table>
          <thead>
            <tr><th>Host Path</th><th>Container Path</th><th>Purpose</th></tr>
          </thead>
          <tbody>
            <tr><td><code>./prds/</code></td><td><code>/home/agent/great-minds/prds</code></td><td>Drop a .md file here to trigger a build</td></tr>
            <tr><td><code>./deliverables/</code></td><td><code>/home/agent/great-minds/deliverables</code></td><td>Built products appear here</td></tr>
            <tr><td><code>./rounds/</code></td><td><code>/home/agent/great-minds/rounds</code></td><td>Debate transcripts, QA reports, board reviews</td></tr>
            <tr><td><code>./dreams/</code></td><td><code>/home/agent/great-minds/dreams</code></td><td>featureDream output</td></tr>
            <tr><td><code>./memory-store/memory.db</code></td><td><code>/home/agent/great-minds/memory-store/memory.db</code></td><td>Persistent memory database</td></tr>
            <tr><td><code>~/.claude</code></td><td><code>/home/agent/.claude</code></td><td>Claude auth credentials (read-only)</td></tr>
            <tr><td><code>~/.gitconfig</code></td><td><code>/home/agent/.gitconfig</code></td><td>Git identity for commits (read-only)</td></tr>
          </tbody>
        </table>

        <h2>Dockerfile Details</h2>

        <p>The Dockerfile:</p>

        <ol>
          <li>Starts from <code>node:22-slim</code></li>
          <li>Installs git, curl, and the Claude Code CLI globally</li>
          <li>Creates an <code>agent</code> user (Claude refuses <code>--dangerously-skip-permissions</code> as root)</li>
          <li>Clones the repo and installs daemon + memory-store dependencies</li>
          <li>Runs <code>npx tsx src/daemon.ts</code> as the entrypoint</li>
        </ol>

        <h2>Viewing Logs</h2>

        <pre><code>{`# Follow daemon logs in real-time
docker compose logs -f daemon

# Last 100 lines
docker compose logs --tail 100 daemon

# Check health status
docker inspect great-minds-daemon | jq '.[0].State.Health'`}</code></pre>

        <h2>Stopping and Restarting</h2>

        <pre><code>{`# Stop the daemon gracefully
docker compose down

# Restart after config changes
docker compose up -d --build

# Run Shipyard AI daemon alongside
docker compose --profile shipyard up -d`}</code></pre>

        <h2>Building a Custom Image</h2>

        <p>To use a forked repo or custom branch:</p>

        <pre><code>{`docker compose build --build-arg REPO_URL=https://github.com/you/your-fork.git
docker compose up -d`}</code></pre>
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
        .doc-content strong { color: #f4f4f5; }
      `}</style>
    </div>
  );
}

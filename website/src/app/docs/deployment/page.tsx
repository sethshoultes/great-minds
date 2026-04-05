import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deployment — Great Minds Docs',
  description: 'Deploy the Great Minds agency on a DigitalOcean droplet — server setup, daemon installation, monitoring.',
};

export default function DeploymentDocPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <code className="text-xs text-zinc-600 font-mono bg-zinc-900 px-2 py-1 rounded">
          deliverables/vps-deployment-guide.md
        </code>
      </div>

      <div className="doc-content">
        <h1>Server Deployment</h1>

        <p>
          Run the Great Minds agency 24/7 on a VPS. This guide covers DigitalOcean setup,
          but the steps apply to any Ubuntu VPS (Hetzner, Linode, etc.).
        </p>

        <h2>Server Requirements</h2>

        <table>
          <thead>
            <tr><th>Resource</th><th>Minimum</th><th>Recommended</th></tr>
          </thead>
          <tbody>
            <tr><td>RAM</td><td>4 GB</td><td>8 GB</td></tr>
            <tr><td>CPU</td><td>2 vCPU</td><td>4 vCPU</td></tr>
            <tr><td>Disk</td><td>40 GB SSD</td><td>80 GB SSD</td></tr>
            <tr><td>OS</td><td>Ubuntu 24.04 LTS</td><td>Ubuntu 24.04 LTS</td></tr>
          </tbody>
        </table>

        <p>
          8 GB / 4 vCPU is recommended. Each Claude Code session uses ~300-500 MB RAM at peak,
          and the agency can run 3-5 concurrent sessions during BUILD phases.
        </p>

        <h2>Step 1: Provision the Droplet</h2>

        <ol>
          <li>Create a DigitalOcean droplet: Ubuntu 24.04, Basic 8GB ($48/mo) or Hetzner CX32 ($8/mo)</li>
          <li>Add your SSH public key during creation</li>
          <li>Note the IP address</li>
        </ol>

        <h2>Step 2: Create a Non-Root User</h2>

        <p>
          <strong>Critical:</strong> Claude Code refuses <code>--dangerously-skip-permissions</code> as root.
          You must create a regular user.
        </p>

        <pre><code>{`ssh root@YOUR_SERVER_IP
adduser agent
usermod -aG sudo agent
cp -r ~/.ssh /home/agent/.ssh
chown -R agent:agent /home/agent/.ssh
exit

# Reconnect as agent
ssh agent@YOUR_SERVER_IP`}</code></pre>

        <h2>Step 3: Install Dependencies</h2>

        <pre><code>{`sudo apt update && sudo apt upgrade -y
sudo apt install -y git tmux curl wget build-essential unzip jq

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Set your API key
echo 'export ANTHROPIC_API_KEY="sk-ant-your-key-here"' >> ~/.bashrc
source ~/.bashrc`}</code></pre>

        <h2>Step 4: Clone and Install</h2>

        <pre><code>{`mkdir -p ~/projects && cd ~/projects
git clone https://github.com/sethshoultes/great-minds.git
cd great-minds

# Install the daemon
cd daemon && npm install

# Install memory store
cd ../memory-store && npm install`}</code></pre>

        <h2>Step 5: Install the Plugin</h2>

        <pre><code>{`# Install the Great Minds plugin for Claude Code
npx plugins add sethshoultes/great-minds-plugin`}</code></pre>

        <h2>Step 6: Start the Daemon</h2>

        <p>Use tmux for session persistence across SSH disconnects:</p>

        <pre><code>{`tmux new -s daemon
cd ~/projects/great-minds/daemon
./bin/greatminds-daemon
# Ctrl+B, D to detach — daemon keeps running`}</code></pre>

        <p>Or use Docker:</p>

        <pre><code>{`cd ~/projects/great-minds/daemon
cp .env.example .env  # fill in ANTHROPIC_API_KEY
docker compose up -d`}</code></pre>

        <h2>Step 7: Memory Store Setup</h2>

        <p>
          The memory store (<code>memory-store/memory.db</code>) persists agency learnings across
          projects. If starting fresh, the daemon creates it automatically. To preserve memory
          across deploys, back up <code>memory.db</code> or mount it as a Docker volume.
        </p>

        <h2>Monitoring</h2>

        <h3>Heartbeat</h3>
        <p>
          The daemon runs heartbeat health checks every 5 minutes automatically. Check status with:
        </p>
        <pre><code>{`cat ~/projects/great-minds/STATUS.md`}</code></pre>

        <h3>QA Crons (Backup)</h3>
        <p>
          The daemon handles all scheduling internally. For extra reliability, you can add
          QA crons as a safety net:
        </p>
        <pre><code>{`crontab -e

# Margaret QA sweep every 30 minutes (backup only)
*/30 * * * * cd ~/projects/great-minds && claude -p "Run Margaret Hamilton QA check" >> ~/logs/qa.log 2>&1`}</code></pre>

        <h3>Daemon Logs</h3>
        <pre><code>{`# If running directly
tail -f /tmp/claude-shared/daemon.log

# If running in Docker
docker compose logs -f daemon

# Check recent git activity
cd ~/projects/great-minds && git log --oneline -10`}</code></pre>

        <h2>Security</h2>

        <ul>
          <li>Disable password auth in <code>/etc/ssh/sshd_config</code> — SSH keys only</li>
          <li>Enable firewall: <code>sudo ufw allow 22/tcp && sudo ufw enable</code></li>
          <li>Store API keys in <code>.env</code> (gitignored), never in committed files</li>
          <li>Install fail2ban: <code>sudo apt install -y fail2ban</code></li>
          <li>Enable automatic security updates: <code>sudo apt install -y unattended-upgrades</code></li>
        </ul>

        <h2>Cost</h2>

        <table>
          <thead>
            <tr><th>Item</th><th>Hetzner</th><th>DigitalOcean</th></tr>
          </thead>
          <tbody>
            <tr><td>Server (8GB/4vCPU)</td><td>$8/mo</td><td>$48/mo</td></tr>
            <tr><td>Claude API (moderate use)</td><td>~$500/mo</td><td>~$500/mo</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>~$508/mo</strong></td><td><strong>~$548/mo</strong></td></tr>
          </tbody>
        </table>

        <p>
          The API cost dominates. The server is a rounding error. Use Hetzner unless you
          specifically need DigitalOcean&apos;s managed services.
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
        .doc-content strong { color: #f4f4f5; }
      `}</style>
    </div>
  );
}

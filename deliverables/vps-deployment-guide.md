# VPS Deployment Guide: Running Great Minds Agency 24/7

Run Claude Code + the daemon on a headless VPS so your 14-agent agency operates around the clock without a laptop.

**Time to deploy: ~30 minutes.**

---

## Table of Contents

1. [Server Requirements](#1-server-requirements)
2. [Recommended Providers + Pricing](#2-recommended-providers--pricing)
3. [Step-by-Step Setup](#3-step-by-step-setup)
4. [Keeping It Running](#4-keeping-it-running)
5. [Cost Analysis](#5-cost-analysis)
6. [Security](#6-security)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Server Requirements

### Minimum Specs (3-4 concurrent Claude Code sessions)

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| RAM | 4 GB | 8 GB |
| CPU | 2 vCPU | 4 vCPU |
| Disk | 40 GB SSD | 80 GB SSD |
| OS | Ubuntu 24.04 LTS | Ubuntu 24.04 LTS |
| Network | 1 Gbps | 1 Gbps |

### Why these specs?

- Each Claude Code CLI session uses ~300-500 MB RAM at peak
- The agency runs 3 core sessions (admin + worker1 + worker2) plus sub-agents
- Node.js + git + tmux overhead: ~500 MB
- OS baseline: ~500 MB
- **Total active memory**: ~3-4 GB for a full swarm run
- 8 GB gives headroom for sub-agent spawning during BUILD phases (up to 5 workers)

### OS Choice

Ubuntu 24.04 LTS. It has the longest support window, widest package availability, and every hosting provider offers it as a one-click image. Do not use Alpine or minimal distros -- Claude Code depends on glibc and standard GNU tools.

---

## 2. Recommended Providers + Pricing

### Option A: Hetzner Cloud (Best Value)

Hetzner's Falkenstein/Nuremberg (Germany) and Ashburn (US) datacenters offer the best price-to-performance ratio for this workload.

| Plan | vCPU | RAM | Disk | Price |
|------|------|-----|------|-------|
| CX22 | 2 vCPU | 4 GB | 40 GB | ~$4.50/mo |
| **CX32** | **4 vCPU** | **8 GB** | **80 GB** | **~$8/mo** |
| CX42 | 8 vCPU | 16 GB | 160 GB | ~$16/mo |

**Recommendation: CX32 at ~$8/month.** This is the sweet spot -- 8 GB RAM handles the full 9-agent swarm with room for sub-agent spawning.

### Option B: DigitalOcean (Easier onboarding)

DigitalOcean is more expensive but has a friendlier UI, better docs, and US-based support.

| Plan | vCPU | RAM | Disk | Price |
|------|------|-----|------|-------|
| Basic 4GB | 2 vCPU | 4 GB | 80 GB | $24/mo |
| **Basic 8GB** | **4 vCPU** | **8 GB** | **160 GB** | **$48/mo** |
| Basic 16GB | 8 vCPU | 16 GB | 320 GB | $96/mo |

**Recommendation: Basic 8GB at $48/month** if you prefer DigitalOcean.

### Verdict

Hetzner CX32 at $8/month is 6x cheaper than DigitalOcean for equivalent specs. Use Hetzner unless you specifically need DO's managed databases or app platform integrations.

---

## 3. Step-by-Step Setup

### 3.1 Provision the Server

**Hetzner:**
1. Sign up at https://console.hetzner.cloud
2. Create a new project
3. Add Server > Location: Ashburn (US) or Falkenstein (EU) > Image: Ubuntu 24.04 > Type: CX32
4. Add your SSH public key (see Section 6)
5. Create server. Note the IP address.

**DigitalOcean:**
1. Sign up at https://cloud.digitalocean.com
2. Create Droplet > Ubuntu 24.04 > Basic > 8 GB / 4 vCPU
3. Add your SSH key
4. Create. Note the IP address.

### 3.2 SSH Into the Server

```bash
ssh root@YOUR_SERVER_IP
```

**CRITICAL: Claude Code refuses `--dangerously-skip-permissions` as root.** You MUST create a non-root user to run the swarm. This is a security restriction in Claude Code — not optional:

```bash
adduser deploy
usermod -aG sudo deploy
cp -r ~/.ssh /home/deploy/.ssh
chown -R deploy:deploy /home/deploy/.ssh
exit

# Reconnect as deploy
ssh deploy@YOUR_SERVER_IP
```

### 3.3 Install System Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essentials
sudo apt install -y git tmux curl wget build-essential unzip jq

# Install Node.js 20 LTS (required by Claude Code)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version   # Should be v20.x+
npm --version    # Should be 10.x+
git --version
tmux -V
```

### 3.4 Install Claude Code CLI

```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version

# Authenticate with your API key (non-interactive / headless mode)
# Option 1: Set the environment variable (recommended for servers)
export ANTHROPIC_API_KEY="sk-ant-your-key-here"

# Option 2: Run claude once to authenticate interactively
# claude
```

For headless/non-interactive use, the environment variable approach is required. Claude Code reads `ANTHROPIC_API_KEY` from the environment automatically.

### 3.5 Install claude-swarm

```bash
mkdir -p ~/.local/bin
curl -sL -o ~/.local/bin/claude-swarm \
  https://raw.githubusercontent.com/sethshoultes/claude-swarm/main/claude-swarm
chmod +x ~/.local/bin/claude-swarm

# Add to PATH permanently
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify
claude-swarm --help 2>/dev/null || echo "Installed at $(which claude-swarm)"
```

### 3.6 Clone Your Repos

```bash
# Create workspace
mkdir -p ~/projects
cd ~/projects

# Clone the agency repo
git clone https://github.com/sethshoultes/great-minds.git
cd great-minds

# Clone the LocalGenius app (the product the agency builds)
cd ~/projects
git clone https://github.com/sethshoultes/localgenius.git
cd localgenius
npm install
```

### 3.7 Set Up Environment Variables

Create a `.env` file for the agency:

```bash
cd ~/projects/great-minds
cp .env.example .env
nano .env  # or vim .env
```

Fill in at minimum:

```bash
# Required for Claude Code agents
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Required for LocalGenius app (if running dev server)
DATABASE_URL=postgresql://user:password@hostname/dbname?sslmode=require
JWT_SECRET=generate-a-secure-random-string-at-least-32-chars
```

Make the env vars available to all sessions:

```bash
# Add to your shell profile so tmux sessions inherit them
cat >> ~/.bashrc << 'EOF'

# Great Minds Agency env vars
set -a
source ~/projects/great-minds/.env 2>/dev/null
set +a
EOF

source ~/.bashrc
```

### 3.8 Update launch.sh Paths

The `launch.sh` script has hardcoded macOS paths. Update them for the server:

```bash
cd ~/projects/great-minds
sed -i 's|/Users/sethshoultes/Local Sites/great-minds|/home/deploy/projects/great-minds|g' launch.sh
```

Also update `HEARTBEAT.md` project paths if needed:

```bash
sed -i 's|/Users/sethshoultes/Local Sites/|/home/deploy/projects/|g' HEARTBEAT.md
```

### 3.9 Launch the Swarm

```bash
cd ~/projects/great-minds

# Start the agency (this creates a tmux session called "claude-swarm")
./launch.sh

# The script will:
# 1. Check for claude-swarm (already installed)
# 2. Start tmux with admin + worker1 + worker2 windows
# 3. Write agent prompt overrides to /tmp/claude-shared/prompts/
# 4. Print attach instructions
```

### 3.10 Attach and Monitor

```bash
# Attach to the swarm tmux session
tmux attach -t claude-swarm

# Navigate between agent windows:
#   Ctrl+B then 0  → admin (Marcus Aurelius / Moderator)
#   Ctrl+B then 1  → worker1 (Steve Jobs)
#   Ctrl+B then 2  → worker2 (Elon Musk)
#   Ctrl+B then 3  → worker3+ (sub-agents)

# Detach (leave running): Ctrl+B then D
```

### 3.11 Set Up Cron Jobs

The agency uses timed ticks defined in HEARTBEAT.md. Set these up as system crons:

```bash
# Edit crontab
crontab -e

# Add these lines (adjust paths):
# Monitor tick - every 7 minutes
*/7 * * * * cd /home/deploy/projects/great-minds && /home/deploy/.local/bin/claude-swarm monitor 2>&1 >> /home/deploy/logs/monitor.log

# Organizer tick - every 19 minutes
*/19 * * * * cd /home/deploy/projects/great-minds && /home/deploy/.local/bin/claude-swarm organizer 2>&1 >> /home/deploy/logs/organizer.log

# Jensen board review - every 60 minutes
0 * * * * cd /home/deploy/projects/great-minds && /home/deploy/.local/bin/claude-swarm jensen 2>&1 >> /home/deploy/logs/jensen.log

# Create log directory
mkdir -p ~/logs
```

Alternatively, run the crons inside the tmux session using the `/loop` command within Claude Code (this is what the agency currently does -- see `run-agency.md`):

```bash
# Inside the admin tmux window, run:
/loop 7m [monitor tick instructions from HEARTBEAT.md]
```

The advantage of in-tmux loops: they use Claude Code's built-in loop mechanism and have full context. The advantage of system crons: they survive even if Claude Code crashes.

---

## 4. Keeping It Running

### 4.1 tmux Survives SSH Disconnects

This is the core reason we use tmux. When you SSH in, attach to the session, and disconnect (Ctrl+B, D) or lose connection, the tmux session keeps running. Your agents continue working.

```bash
# Reconnect anytime
ssh deploy@YOUR_SERVER_IP
tmux attach -t claude-swarm

# List all tmux sessions
tmux ls

# Kill a session (stop all agents)
tmux kill-session -t claude-swarm
```

### 4.2 systemd Service for Auto-Restart

Create a systemd service so the agency restarts automatically after server reboots or crashes:

```bash
sudo nano /etc/systemd/system/great-minds.service
```

```ini
[Unit]
Description=Great Minds Agency (claude-swarm)
After=network.target

[Service]
Type=forking
User=deploy
Group=deploy
WorkingDirectory=/home/deploy/projects/great-minds
Environment="PATH=/home/deploy/.local/bin:/usr/local/bin:/usr/bin:/bin"
Environment="HOME=/home/deploy"
EnvironmentFile=/home/deploy/projects/great-minds/.env
ExecStart=/usr/bin/tmux new-session -d -s claude-swarm '/home/deploy/projects/great-minds/launch.sh'
ExecStop=/usr/bin/tmux kill-session -t claude-swarm
RemainAfterExit=yes
Restart=on-failure
RestartSec=30

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable great-minds
sudo systemctl start great-minds

# Check status
sudo systemctl status great-minds

# View logs
journalctl -u great-minds -f
```

### 4.3 Monitoring with command-center.js

The agency references a web dashboard at `~/.local/bin/command-center.js`. If you have this file, run it:

```bash
# Start the command center (runs a local web server)
node ~/.local/bin/command-center.js &

# It typically listens on port 3001 or similar
```

If you do not have `command-center.js` yet, you can monitor with these commands:

```bash
# Quick status check
cat ~/projects/great-minds/STATUS.md

# Watch agent activity in real-time
watch -n 30 'cat ~/projects/great-minds/STATUS.md'

# Check tmux panes for agent output
tmux capture-pane -t claude-swarm:0 -p | tail -20  # admin
tmux capture-pane -t claude-swarm:1 -p | tail -20  # worker1
tmux capture-pane -t claude-swarm:2 -p | tail -20  # worker2

# Check recent git activity
cd ~/projects/great-minds && git log --oneline -10
```

### 4.4 SSH Tunneling to Access the Dashboard Remotely

Never expose the command center directly to the internet (see Security section). Instead, use an SSH tunnel:

```bash
# From your laptop:
ssh -L 3001:localhost:3001 deploy@YOUR_SERVER_IP

# Now open http://localhost:3001 in your browser
# The dashboard is accessible only through the encrypted SSH tunnel
```

For persistent tunnel access, use autossh:

```bash
# On your laptop
brew install autossh  # macOS
# or: sudo apt install autossh  # Linux

# Auto-reconnecting tunnel
autossh -M 0 -f -N -L 3001:localhost:3001 deploy@YOUR_SERVER_IP
```

### 4.5 Quick Health Check Script

Save this on the server as `~/check-agency.sh`:

```bash
#!/bin/bash
echo "=== Great Minds Agency Health Check ==="
echo ""

# Check tmux session
if tmux has-session -t claude-swarm 2>/dev/null; then
    echo "[OK] tmux session 'claude-swarm' is running"
    WINDOWS=$(tmux list-windows -t claude-swarm | wc -l)
    echo "     $WINDOWS windows active"
else
    echo "[FAIL] tmux session 'claude-swarm' not found"
fi

# Check systemd service
if systemctl is-active --quiet great-minds; then
    echo "[OK] systemd service is active"
else
    echo "[WARN] systemd service is not active"
fi

# Check disk space
DISK_USED=$(df -h / | awk 'NR==2 {print $5}')
echo "[INFO] Disk usage: $DISK_USED"

# Check memory
MEM_USED=$(free -h | awk 'NR==2 {print $3 "/" $2}')
echo "[INFO] Memory usage: $MEM_USED"

# Check last git commit
cd ~/projects/great-minds
LAST_COMMIT=$(git log --oneline -1 2>/dev/null)
echo "[INFO] Last commit: $LAST_COMMIT"

# Check STATUS.md state
STATE=$(grep "state" STATUS.md 2>/dev/null | head -1)
echo "[INFO] Agency $STATE"

echo ""
echo "=== End Health Check ==="
```

```bash
chmod +x ~/check-agency.sh
```

---

## 5. Cost Analysis

### Monthly Server Cost

| Provider | Plan | Monthly Cost |
|----------|------|-------------|
| **Hetzner CX32** | 4 vCPU / 8 GB / 80 GB | **$8/mo** |
| DigitalOcean Basic | 4 vCPU / 8 GB / 160 GB | $48/mo |

### Claude API Usage Estimate

Based on the Great Minds Agency architecture (from HEARTBEAT.md and AGENTS.md):

| Component | Model | Frequency | Est. Cost |
|-----------|-------|-----------|-----------|
| Core agents (Marcus, Steve, Elon) | Claude Sonnet | Continuous during active work | ~$5-15/day |
| Sub-agents (Rick, Jony, Maya, Sara) | Claude Haiku | During BUILD phases | ~$1-3/day |
| Jensen board reviews | Claude Sonnet | Every 60 min | ~$2-5/day |
| Monitor/Organizer ticks | Claude Haiku | Every 7-19 min | ~$1-2/day |
| Margaret QA runs | Claude Sonnet | On demand | ~$1-3/run |

**Estimated API cost: $10-25/day active, $300-750/month if running 24/7.**

In practice, the agency is not at full burn 24/7. It has idle periods between projects. Realistic monthly API usage with moderate project load:

| Usage Level | Daily API Cost | Monthly API Cost |
|-------------|---------------|-----------------|
| Light (1 project/week) | ~$5-10/day | ~$150-300/mo |
| **Moderate (active development)** | **~$15-20/day** | **~$450-600/mo** |
| Heavy (multi-project, 24/7 build) | ~$25-40/day | ~$750-1,200/mo |

### Total Monthly Cost

| Item | Hetzner | DigitalOcean |
|------|---------|-------------|
| Server | $8 | $48 |
| Claude API (moderate) | ~$500 | ~$500 |
| **Total** | **~$508/mo** | **~$548/mo** |

The API cost dominates. The server is a rounding error. This is why Hetzner vs DigitalOcean barely matters for total cost -- pick whichever you prefer.

### Cost Optimization Tips

1. **Use Haiku aggressively for sub-agents.** The agency already does this (~5x cheaper than Sonnet).
2. **Pause the swarm between projects.** Don't run 24/7 if you don't have active PRDs.
3. **Set API spend limits** in your Anthropic console to avoid surprises.
4. **Monitor with `/agency-status`** to check if agents are doing useful work or spinning.

---

## 6. Security

### 6.1 SSH Key Authentication Only

Disable password auth immediately after first login:

```bash
sudo nano /etc/ssh/sshd_config
```

Set these values:

```
PasswordAuthentication no
PermitRootLogin no
PubkeyAuthentication yes
```

Restart SSH:

```bash
sudo systemctl restart sshd
```

### 6.2 Firewall (ufw)

```bash
# Enable firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow 22/tcp

# If running LocalGenius dev server (only from localhost via SSH tunnel)
# Do NOT open 3000 or 3001 publicly
# sudo ufw allow 3000/tcp  <-- DO NOT DO THIS

# Enable
sudo ufw enable
sudo ufw status
```

### 6.3 API Keys in Environment Variables, Never in Code

- Store all secrets in `~/projects/great-minds/.env`
- The `.env` file is gitignored (verify this)
- Never hardcode keys in launch.sh, CLAUDE.md, or any committed file
- Use `EnvironmentFile` in systemd to load them (shown in Section 4.2)

```bash
# Verify .env is gitignored
cd ~/projects/great-minds
grep '.env' .gitignore  # Should show .env is listed

# Set restrictive permissions on .env
chmod 600 ~/projects/great-minds/.env
```

### 6.4 Do Not Expose the Command Center Publicly

The command-center.js dashboard has no authentication. Never open its port in the firewall. Always access it through an SSH tunnel (Section 4.4).

If you need remote access for a team, put it behind:
- An SSH tunnel (simplest)
- A reverse proxy (nginx) with HTTP basic auth
- A VPN (WireGuard or Tailscale)

### 6.5 Automatic Security Updates

```bash
# Enable unattended security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 6.6 Fail2ban (Optional but Recommended)

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

This blocks IPs that repeatedly fail SSH login attempts.

---

## 7. Troubleshooting

### "claude: command not found"

```bash
# Check if npm global bin is in PATH
npm config get prefix    # Usually /usr/local or /usr/lib
ls $(npm config get prefix)/bin/claude

# Add to PATH if missing
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### "claude-swarm: command not found"

```bash
# Verify it exists
ls -la ~/.local/bin/claude-swarm

# Verify PATH
echo $PATH | tr ':' '\n' | grep local
```

### tmux Session Died

```bash
# Check if it's actually gone
tmux ls

# Restart manually
cd ~/projects/great-minds
./launch.sh

# Or restart via systemd
sudo systemctl restart great-minds
```

### Out of Memory (OOM Killer)

If the server runs out of RAM, Linux will kill processes. Signs: agents suddenly stop, `dmesg | grep -i oom` shows kills.

Fix: Add swap space.

```bash
# Create 4GB swap file
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### API Rate Limits

If Claude API returns 429 errors, the agency's retry policy kicks in (see HEARTBEAT.md). You can also:
- Reduce concurrent agents
- Switch more agents to Haiku
- Add delays between ticks in HEARTBEAT.md

### Checking Agent Logs

```bash
# Real-time output from any agent window
tmux capture-pane -t claude-swarm:0 -p -S -100  # Last 100 lines from admin
tmux capture-pane -t claude-swarm:1 -p -S -100  # Last 100 lines from worker1
tmux capture-pane -t claude-swarm:2 -p -S -100  # Last 100 lines from worker2

# Cron logs
tail -50 ~/logs/monitor.log
tail -50 ~/logs/jensen.log
```

---

## Quick Reference Card

```
# SSH in
ssh deploy@YOUR_SERVER_IP

# Check agency health
~/check-agency.sh

# Attach to agents
tmux attach -t claude-swarm

# Switch windows: Ctrl+B then 0/1/2/3
# Detach (keep running): Ctrl+B then D

# Check status
cat ~/projects/great-minds/STATUS.md

# Restart agency
sudo systemctl restart great-minds

# View API usage
# Check your Anthropic console: https://console.anthropic.com

# SSH tunnel for dashboard
ssh -L 3001:localhost:3001 deploy@YOUR_SERVER_IP
# Then open http://localhost:3001
```

---

## Summary

| Item | Value |
|------|-------|
| Recommended server | Hetzner CX32 (4 vCPU, 8 GB RAM) |
| Server cost | ~$8/month |
| API cost (moderate use) | ~$450-600/month |
| OS | Ubuntu 24.04 LTS |
| Session persistence | tmux + systemd auto-restart |
| Remote access | SSH tunnel only |
| Setup time | ~30 minutes |

The server cost is trivial compared to API usage. The real optimization is in the agency's agent architecture -- using Haiku for sub-agents, pausing between projects, and monitoring for wasted API calls.

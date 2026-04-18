# Demo Script: Phoenix System

---

**NARRATOR:**
My daemon died 48 times in its first week.

[SCREEN: Terminal showing `/tmp/daemon.log` with endless restart lines scrolling]

**NARRATOR:**
OOM kills. Hung agents. Wrong directories. Dead code that only failed live.

[SCREEN: Error log lines flash — "WATCHDOG: Pipeline exceeded 60 min", "AGENT HUNG", "AUTH EXPIRED"]

**NARRATOR:**
Every restart taught me what breaks when systems stop being babysat.

---

**NARRATOR:**
Started simple. Cron scripts. Check for PRDs every hour, spawn Claude agent, build.

[SCREEN: Simple cron job config file]

**NARRATOR:**
Then Claude asked questions. Waited for input. Cron has no terminal.

[SCREEN: Build hanging, cron timeout killing process]

**NARRATOR:**
Tried tmux send-keys. Pipe commands into persistent session. Elegant hack.

[SCREEN: tmux command being executed]

**NARRATOR:**
Failed spectacularly. Input buffer mangled. Multi-line prompts fragmented.

[SCREEN: Claude session receiving garbled input, hanging]

**NARRATOR:**
Zero successful builds through tmux.

---

**NARRATOR:**
Built a systemd daemon instead. Launched 3am Tuesday.

[SCREEN: systemd service starting, logs streaming]

**NARRATOR:**
By Wednesday morning — 48 restarts.

[SCREEN: Rapid-fire restart log entries piling up]

**NARRATOR:**
Two debate agents in parallel. Steve Jobs and Elon Musk arguing design.
Each loads full context into memory. 3.2GB on 4GB server.

[SCREEN: Memory graph spiking to 100%, OOM killer firing]

**NARRATOR:**
OOM killer picks biggest process. Daemon dies. systemd restarts it. Same PRD in queue. Tries again.

[SCREEN: Loop visualization — crash, restart, retry, crash]

**NARRATOR:**
Forty-eight times.

---

**NARRATOR:**
Added swap. Sequential agents, not parallel. Memory checks between batches.

[SCREEN: Code snippet showing sequential execution with memory guards]

**NARRATOR:**
Claude OAuth expires every 12 hours. Daemon kept running. Agents returned empty strings.

[SCREEN: Agent output showing authentication errors disguised as success]

**NARRATOR:**
Pipeline thought empty meant success. Cost tokens, produced nothing.

[SCREEN: Cost tracker showing wasted API calls]

**NARRATOR:**
Added auth detection. Fail fast and loud.

[SCREEN: Code snippet showing auth error checking, Telegram alert firing]

---

**NARRATOR:**
Agent loads large file. File read blocks. Agent waits. Daemon waits. Twenty minutes later — nothing.

[SCREEN: Pipeline progress frozen, no movement]

**NARRATOR:**
Two-layer timeout. Agent timeout: 20 minutes. Pipeline watchdog: 60 minutes.

[SCREEN: Code showing nested timeout wrapper]

**NARRATOR:**
Hung agent? Kill and retry. Entire pipeline stuck? Abort, move to next PRD.

[SCREEN: Timeout triggering, agent being killed, next PRD starting]

---

**NARRATOR:**
Now? Six weeks. Zero manual intervention.

[SCREEN: Dashboard showing uptime stats — 47 PRDs processed, 39 shipped, 8 failed cleanly]

**NARRATOR:**
Daemon crashes mid-build. Persisted queue survives. Restart picks up where it left off.

[SCREEN: Daemon restarting, queue loading from disk, build resuming]

**NARRATOR:**
Drop a PRD file. chokidar watcher sees it instantly. Queues it.

[SCREEN: File being added to `prds/` directory, daemon log showing "QUEUE: Added" immediately]

**NARRATOR:**
Agent fails twice. Telegram alert fires. PRD archived to `prds/failed/`. Moves on.

[SCREEN: Alert notification, file being moved, next build starting]

**NARRATOR:**
No infinite retries. No silent failures. No lost work.

---

**NARRATOR:**
System still dies sometimes. Auth expires. Servers reboot. Unexpected errors.

[SCREEN: Various error types flashing briefly]

**NARRATOR:**
But recovery is automatic now.

[SCREEN: Error occurs, systemd restarts daemon, queue loads, build continues]

**NARRATOR:**
Dies. Comes back. Continues.

[SCREEN: Phoenix logo materializing from flames]

**NARRATOR:**
That's not fragility.

**NARRATOR:**
That's resilience.

[SCREEN: Dashboard showing live daemon status — "RUNNING", queue processing, builds shipping]

**NARRATOR:**
Building something that refuses to stay dead beats building something that never breaks.

[SCREEN: Fade to project logo/URL]

---

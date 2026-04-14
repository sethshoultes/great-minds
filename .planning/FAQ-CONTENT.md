# Troubleshooting Guide & FAQ
## Agents Assemble Workshop

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [API Key Setup](#api-key-setup)
3. [Platform-Specific Issues](#platform-specific-issues)
4. [Command Failures & Fixes](#command-failures--fixes)
5. [Common Error Messages](#common-error-messages)
6. [Rate Limits & Recovery](#rate-limits--recovery)

---

## Getting Started

### What do I need before the workshop?

You'll need:
- **Claude Code CLI** installed and updated
- **ANTHROPIC_API_KEY** set in your environment
- **Git** installed (for exercises with commits)
- **Bash** shell (Windows users see PowerShell section below)
- **Node.js/npm** (for plugin exercise)

### How do I know if I'm ready?

Run this test command:
```bash
claude -p "echo 'Hello'" --max-budget-usd 0.10
```

You should see output within 30 seconds. If you get an error, jump to the troubleshooting sections below.

---

## API Key Setup

### What is ANTHROPIC_API_KEY?

Your API key is the credential Claude Code uses to call the Claude API on your behalf. It's like a password but specifically for the AI service.

### How do I get my API key?

1. Visit https://console.anthropic.com/
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new key
5. Copy it (you'll only see it once)

### macOS: Setting ANTHROPIC_API_KEY

**Option 1: Temporary (current terminal session only)**
```bash
export ANTHROPIC_API_KEY="sk-ant-v1-your-key-here"
```

**Option 2: Permanent (add to shell profile)**

Edit your shell profile (usually one of these files):
```bash
# For zsh (default on modern macOS)
nano ~/.zshrc

# OR for bash
nano ~/.bash_profile
```

Add this line at the end:
```bash
export ANTHROPIC_API_KEY="sk-ant-v1-your-key-here"
```

Save (Ctrl+O, Enter, Ctrl+X in nano), then reload:
```bash
source ~/.zshrc
```

Verify it worked:
```bash
echo $ANTHROPIC_API_KEY
```

You should see your key printed (first 20 chars or so).

### Windows: Setting ANTHROPIC_API_KEY

#### PowerShell (Recommended)

**Option 1: Temporary (current session only)**
```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-v1-your-key-here"
```

**Option 2: Permanent (for all future PowerShell sessions)**
```powershell
# Run PowerShell as Administrator, then:
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-v1-your-key-here", "User")
```

**Option 3: Via Settings UI**
1. Press Win+X, select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "User variables", click "New"
5. Variable name: `ANTHROPIC_API_KEY`
6. Variable value: `sk-ant-v1-your-key-here`
7. Click OK, then OK again
8. Close and reopen PowerShell

Verify it worked:
```powershell
echo $env:ANTHROPIC_API_KEY
```

#### Git Bash

Edit `~/.bashrc` (or create it):
```bash
nano ~/.bashrc
```

Add:
```bash
export ANTHROPIC_API_KEY="sk-ant-v1-your-key-here"
```

Save, then:
```bash
source ~/.bashrc
```

### Linux: Setting ANTHROPIC_API_KEY

**Option 1: Temporary**
```bash
export ANTHROPIC_API_KEY="sk-ant-v1-your-key-here"
```

**Option 2: Permanent**
Edit `~/.bashrc` or `~/.profile`:
```bash
nano ~/.bashrc
```

Add:
```bash
export ANTHROPIC_API_KEY="sk-ant-v1-your-key-here"
```

Save, then:
```bash
source ~/.bashrc
```

### Error: "API key not found" or "Invalid API key"

**Check 1: Is the key set?**
```bash
echo $ANTHROPIC_API_KEY
```

If empty, you didn't set it correctly. Re-read the section for your platform above.

**Check 2: Is the key format correct?**
- Keys start with `sk-ant-v1-`
- Keys are long (40+ characters)
- No spaces or quotes in the key itself

**Check 3: Did you reload your shell after setting it?**
Close your terminal completely and open a new one. New terminals load environment variables fresh.

**Check 4: API key expired or revoked?**
Log into https://console.anthropic.com/ and verify your key is still listed as "Active". If not, create a new one and repeat the setup steps above.

### Error: "Invalid API key format"

Your key doesn't match Claude's expected format. This usually means:
- You copied it incorrectly (extra space at start/end)
- You didn't copy the entire key
- You typed it instead of copy-pasting

**Solution:** Go back to https://console.anthropic.com/, delete the old key, create a new one, and carefully copy-paste it.

---

## Platform-Specific Issues

### Windows: Path Differences

Claude Code on Windows works slightly differently than macOS/Linux regarding file paths. Learn the differences now so you don't get stuck during exercises.

#### The ~/.claude/ Directory

**macOS/Linux path:**
```bash
~/.claude/
```

This expands to `/Users/yourname/.claude/` (macOS) or `/home/yourname/.claude/` (Linux).

**Windows path:**
```
%USERPROFILE%\.claude\
```

This expands to `C:\Users\YourName\.claude\` or similar.

**Windows PowerShell equivalent:**
```powershell
$env:USERPROFILE\.claude\
```

Or just use:
```powershell
~\.claude\
```

PowerShell understands `~` just like bash, so `~\.claude\commands\` works.

#### Exercise 4 Adjustment (Custom Slash Commands)

On macOS/Linux, the exercise says:
```bash
mkdir -p ~/.claude/commands
echo "your command content" > ~/.claude/commands/standup.md
```

On Windows PowerShell, use:
```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\commands" | Out-Null
"your command content" | Out-File -Encoding UTF8 "$env:USERPROFILE\.claude\commands\standup.md"
```

Or simply:
```powershell
mkdir ~\.claude\commands -Force
"your command content" | Out-File ~\.claude\commands\standup.md
```

#### Exercise 5 Adjustment (Hooks)

The settings.json file lives at:

**macOS/Linux:**
```bash
~/.claude/settings.json
```

**Windows:**
```powershell
$env:USERPROFILE\.claude\settings.json
```

Or just use `~\.claude\settings.json` in PowerShell.

### Windows: Shell Requirements

#### Do I HAVE to use PowerShell?

No. Claude Code on Windows works with:
1. **PowerShell 5.1+** (built into Windows 10/11) — easiest
2. **Git Bash** (comes with Git for Windows) — bash-like experience
3. **WSL 2** (Windows Subsystem for Linux) — full Linux environment
4. **Command Prompt (cmd.exe)** — limited, not recommended

#### PowerShell is the easiest choice

PowerShell is preinstalled and understands both Windows paths and bash-like syntax. Most exercises will work as-is, but some bash-specific features (like `while` loops) need translation.

#### Exercises 2 & 3 (Ralph Wiggum Loop & /loop)

These use bash syntax. On Windows PowerShell, convert like this:

**macOS/Linux (bash):**
```bash
while true; do claude -p "pick next task, build, test, commit"; done
```

**Windows PowerShell equivalent:**
```powershell
while ($true) { claude -p "pick next task, build, test, commit"; Start-Sleep -Seconds 1 }
```

Or use **Git Bash** (which understands the original bash syntax):
```bash
# In Git Bash, this works exactly as written
while true; do claude -p "pick next task, build, test, commit"; done
```

**Or use WSL 2** (if you have it):
```bash
# Everything works exactly like Linux
```

#### My recommendation for Windows users

If you're comfortable with your shell:
- **If using PowerShell:** Use the PowerShell versions of commands (I'll provide them below)
- **If using Git Bash:** Use the bash versions as written in exercises
- **If using WSL 2:** Use the bash versions exactly as written

### Windows: Line Ending Differences (CRLF vs LF)

Windows uses `CRLF` (carriage return + line feed) for line endings, while bash/Unix uses `LF` (line feed only).

#### Will this break my exercises?

Usually no. Claude Code and Git handle this automatically. However, if you see weird line number issues or odd script behavior:

**Check your Git config:**
```bash
git config core.autocrlf
```

If it says `true`, Git is auto-converting. If it says `false` or nothing, you might have issues.

**Safe setting:**
```bash
git config --global core.autocrlf input
```

This tells Git: "Convert CRLF to LF when committing from Windows, but don't convert back."

#### If a script fails, convert line endings

In PowerShell:
```powershell
# Convert a file from CRLF to LF
(Get-Content "filename.sh") -replace "`r`n", "`n" | Set-Content "filename.sh" -NoNewline
```

In Git Bash:
```bash
# Convert a file from CRLF to LF
dos2unix filename.sh
```

---

## Command Failures & Fixes

### Error: "Command not found: claude"

Claude Code CLI is not installed or not in your PATH.

**Solution:**

1. **Install Claude Code CLI**
   Visit https://code.claude.com and follow the installation instructions for your OS.

2. **Verify installation**
   ```bash
   claude --version
   ```
   You should see a version number like "1.0.5" or similar.

3. **Add to PATH (if still not found)**

   **macOS with Homebrew:**
   ```bash
   brew install anthropic/claude/claude-code
   ```

   **Windows (if you installed manually):**
   Add the folder containing `claude.exe` to your PATH:
   - Right-click "This PC" → Properties
   - Advanced system settings → Environment Variables
   - Edit the "Path" variable and add the folder where claude.exe lives

   **Linux:**
   Download from https://code.claude.com, then add to PATH:
   ```bash
   export PATH="$PATH:/path/to/claude/bin"
   ```

### Error: "Permission denied" on macOS

You installed Claude Code but don't have execute permissions.

**Solution:**
```bash
chmod +x /usr/local/bin/claude
# or wherever your claude binary is installed
which claude  # shows you the path
chmod +x $(which claude)
```

### Error: "Node.js not found" or "npm command not found"

Exercise 7 requires npm to install the Great Minds plugin.

**Install Node.js:**

**macOS (Homebrew):**
```bash
brew install node
```

**Windows (Chocolatey):**
```powershell
choco install nodejs
```

Or download from https://nodejs.org/ (LTS version recommended).

**Linux (apt):**
```bash
sudo apt update && sudo apt install nodejs npm
```

**Verify:**
```bash
node --version
npm --version
```

### Error: "Git not found" or "git command not found"

Some exercises involve git commits.

**Install Git:**

**macOS (Homebrew):**
```bash
brew install git
```

**Windows:**
Download from https://git-scm.com/ (includes Git Bash).

**Linux (apt):**
```bash
sudo apt update && sudo apt install git
```

**Verify:**
```bash
git --version
```

### Error: "Claude Code CLI needs an update"

You're running an old version of Claude Code.

**Solution:**

**macOS (Homebrew):**
```bash
brew upgrade claude-code
```

**Manual:**
1. Uninstall the old version
2. Download the latest from https://code.claude.com
3. Install fresh

**Verify:**
```bash
claude --version
```

---

## Common Error Messages

### "Budget limit exceeded"

You ran out of money in your API budget.

**What happened:** Each Claude API call costs a small amount of money. The `--max-budget-usd` flag caps how much a single command can spend. You hit that limit.

**Example:**
```bash
claude -p "write a 10,000 line novel" --max-budget-usd 0.10
```
This asks for a huge response but only budgets $0.10. It will fail.

**Solution:**
- Increase the budget: `--max-budget-usd 1.00` (one dollar)
- Make requests simpler (shorter prompts)
- Check your account balance at https://console.anthropic.com/

### "Timeout waiting for response"

Claude Code waited 30+ seconds and didn't get a response.

**Reasons:**
- Claude API is slow (rare, but happens)
- Your internet connection is flaky
- The request is too complex and timed out

**Solution:**
1. Wait a moment, then try again
2. Try a simpler prompt
3. Increase timeout (if using Claude Code directly, not in exercises)

### "Tool 'Bash' not allowed"

You didn't pre-approve the Bash tool before running a command.

**Example:**
```bash
claude -p "run this bash command" # ❌ Fails
claude -p "run this bash command" --allowedTools "Bash" # ✓ Works
```

**Solution:**
Add `--allowedTools "Bash,Read,Edit"` to your command to pre-approve tools.

### "File not found: ~/.claude/commands/..."

The file path is wrong or the directory doesn't exist.

**Debug:**
```bash
# Check if the directory exists
ls -la ~/.claude/commands/

# Create it if missing
mkdir -p ~/.claude/commands/
```

**On Windows:**
```powershell
# Check if directory exists
Test-Path ~\.claude\commands\

# Create it if missing
New-Item -ItemType Directory -Path ~\.claude\commands\ -Force
```

### "Settings.json is invalid JSON"

Your settings.json has a syntax error (missing comma, extra bracket, etc.).

**Debug:**
```bash
# Validate JSON syntax
cat ~/.claude/settings.json | python3 -m json.tool
```

If it prints valid JSON, you're good. If it shows an error, there's a syntax issue.

**Solution:**
1. Open `~/.claude/settings.json` in a text editor
2. Look for the error line mentioned in the validation output
3. Fix it (common issues: missing comma between properties, trailing comma at end of array)
4. Save and try again

### "Plugin not found" or "Plugin failed to install"

The Great Minds plugin couldn't be installed.

**Reasons:**
- npm isn't installed
- No internet connection
- Plugin doesn't exist or was removed
- Version number is wrong

**Debug:**
```bash
# Check npm works
npm --version

# Try installing manually
npm install sethshoultes/great-minds-plugin@latest

# List installed plugins
npm list -g | grep great-minds
```

**Solution:**
If plugin installation fails, Exercise 7 has a local fallback. Use that instead.

---

## Rate Limits & Recovery

### What are rate limits?

Claude API has limits on how many requests you can make in a short time. This prevents abuse and ensures fair access.

**Current limits (as of April 2026):**
- **Free tier:** ~10 requests per minute
- **Paid tier:** ~100+ requests per minute (depends on your plan)

### I got "Rate limit exceeded" — what do I do?

**Immediate action:**
Stop making requests. Wait a few minutes before trying again.

**For Exercise 2 (Ralph Wiggum Loop):**
If your loop is making requests too fast, add a sleep:

```bash
# Too fast, will hit rate limits
while true; do
  claude -p "pick next task"
done

# Better: wait 30 seconds between requests
while true; do
  claude -p "pick next task"
  sleep 30
done
```

### I'm running out of API budget — how do I check?

Visit https://console.anthropic.com/ and click "Billing" or "Usage". You'll see:
- How much you've spent this month
- Your remaining balance
- Billing settings

### How do I increase my API budget?

Log into https://console.anthropic.com/ and:
1. Go to Billing
2. Add a payment method
3. Set a monthly budget limit (optional)
4. Top up as needed

### If my API key runs out mid-workshop, what happens?

Commands will fail with "Invalid API key" or "No balance remaining" errors.

**Recovery:**
1. Add funds to your account at https://console.anthropic.com/
2. Wait a minute for the system to register the change
3. Try your command again

If you added funds but still see errors:
1. Double-check your API key is correct: `echo $ANTHROPIC_API_KEY`
2. If changed, update it in your environment
3. Open a new terminal to load the new key
4. Try again

---

## Exercises Specific Troubleshooting

### Exercise 1: Headless Mode

**"Command produced no output"**
- The API call succeeded but took a long time. This is normal. Try again.
- If it keeps happening, check your budget: `--max-budget-usd 1.00`

**"Expected output doesn't match"**
- Claude's responses vary (LLM randomness). As long as you got a commit message back, it worked.

---

### Exercise 2: Ralph Wiggum Loop

**"Loop won't stop"**
- Press Ctrl+C to stop. It's designed to run forever.

**"Command not found: while"** (Windows)
- You're in PowerShell. Use the PowerShell version:
  ```powershell
  while ($true) { claude -p "next task"; sleep 1 }
  ```

**"Loop is making too many requests"**
- Add a sleep between iterations:
  ```bash
  while true; do
    claude -p "pick next task"
    sleep 30  # Wait 30 seconds before next request
  done
  ```

---

### Exercise 3: /loop Recurring Task

**"/loop command not found"**
- This is a Claude Code built-in skill. It only works inside Claude Code sessions.
- Make sure you're running it as: `claude -p "/loop 5m check the build"`

**"Expected output is different"**
- /loop schedules tasks to run later. You might not see output immediately.
- The feature confirms it scheduled successfully.

---

### Exercise 4: Custom Slash Commands

**"Command file not created"**
- Check the path: `ls -la ~/.claude/commands/` (macOS/Linux)
- Or: `ls ~\.claude\commands\` (PowerShell)
- If directory is missing: `mkdir -p ~/.claude/commands/`

**"Custom command not appearing"**
- Reload Claude Code: close it and open a new session
- Make sure the file is named `standup.md` exactly

**"Windows path issues"**
- Use: `mkdir ~\.claude\commands -Force`
- Use: `Out-File` instead of `>` redirection

---

### Exercise 5: Hooks

**"Hook isn't triggering"**
- Settings.json must be valid JSON (use the validation command above)
- Close Claude Code and reopen to reload settings
- Make sure the hook matcher matches your tool name exactly

**"Settings.json errors"**
- Location: `~/.claude/settings.json` (macOS/Linux) or `~\.claude\settings.json` (Windows)
- Validate: `cat ~/.claude/settings.json | python3 -m json.tool`
- Common issue: missing commas between properties

---

### Exercise 6: Agent Personas Debate

**"One agent won't respond"**
- Wait up to 60 seconds. Parallel requests take time.
- If still stuck after 60s, press Ctrl+C and try again
- Check your API budget: https://console.anthropic.com/

**"Debate looks different from expected output"**
- That's okay! Agents are LLMs, so responses vary. As long as both agents responded with arguments, it worked.

**"Rate limit hit during debate"**
- You're making two requests simultaneously. This counts against rate limits.
- Wait 2 minutes, then try again

---

### Exercise 7: Great Minds Plugin

**"Plugin won't install"**
- Check npm: `npm --version`
- Try with explicit version: `npx plugins add sethshoultes/great-minds-plugin@1.0.0`
- If still fails, use the local fallback instead (instructions in Exercise 7)

**"Plugin installed but /agency-launch not found"**
- Close Claude Code completely and reopen
- The plugin needs a fresh session to register its commands

**"Using the local fallback"**
- The fallback code is provided in Exercise 7 for exactly this scenario
- It demonstrates the same concepts without external dependencies

---

## Still Stuck?

If you've tried everything above and still have issues:

1. **Check the requirements**
   - Claude Code CLI installed? `claude --version`
   - API key set? `echo $ANTHROPIC_API_KEY`
   - Node.js installed (for plugin)? `node --version`

2. **Try the test command**
   ```bash
   claude -p "Say hello" --max-budget-usd 0.10
   ```

3. **Check system requirements**
   - macOS 10.15+, Windows 10+, or modern Linux
   - 4GB RAM minimum
   - Internet connection required

4. **Get help**
   - Ask the workshop facilitator or another attendee
   - Check Claude Code docs: https://code.claude.com
   - Anthropic support: https://support.anthropic.com/

---

## Workshop Tips

**Tip 1: Pre-test your setup 5 minutes before start**
Run `claude -p "hello" --max-budget-usd 0.10` to make sure everything works.

**Tip 2: Keep your terminal window open**
Switching apps mid-exercise causes lost output. Keep it visible.

**Tip 3: Close other Claude Code sessions**
Running multiple sessions can cause confusion with environment variables. Close extras.

**Tip 4: Save the exercises markdown**
Download AGENTS-ASSEMBLE-EXERCISES.md to your computer. Copy/paste commands from there, not from memory.

**Tip 5: Use clear, simple prompts**
Complex prompts are more likely to timeout or exceed budget. Start simple.

**Tip 6: Don't be afraid to interrupt an in-progress request**
Press Ctrl+C if a command is taking too long. The request stops immediately.

---

**Last Updated:** April 2026
**For questions:** Refer to https://code.claude.com/docs or ask the workshop facilitator

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { getRepoRoot } from '../lib/git.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * The hook-worker.js absolute path — embedded in the git hook.
 */
const HOOK_WORKER_PATH = path.resolve(__dirname, '..', 'lib', 'hook-worker.js');

/**
 * Markers for identifying witness's section in an existing hook.
 */
const HOOK_START = '# --- witness start ---';
const HOOK_END = '# --- witness end ---';

/**
 * Generate the shell script content that invokes witness's hook worker.
 * @param {string} repoRoot - Absolute path to repo root
 * @returns {string} Shell script fragment
 */
function hookScript() {
  // Direct node script execution with absolute path to hook-worker.js
  // This avoids PATH issues and keeps the hook simple
  return `${HOOK_START}
# Witness — auto-generate changelog entry (runs async, won't slow git)
node "${HOOK_WORKER_PATH}" "$(git rev-parse --show-toplevel)" &
${HOOK_END}`;
}

/**
 * Run the `witness init` command.
 * Installs a post-commit hook that fires witness after every commit.
 */
export async function runInit() {
  // Detect git repo
  let repoRoot;
  try {
    repoRoot = getRepoRoot();
  } catch {
    console.error('  Error: not a git repository.');
    console.error('  Run this command from inside a git repo.');
    process.exit(1);
  }

  // Resolve the git directory (handles worktrees where .git is a file)
  let gitDir;
  try {
    gitDir = execSync('git rev-parse --git-common-dir', {
      cwd: repoRoot,
      encoding: 'utf-8',
    }).trim();
    // git-common-dir may return a relative path
    if (!path.isAbsolute(gitDir)) {
      gitDir = path.resolve(repoRoot, gitDir);
    }
  } catch {
    gitDir = path.join(repoRoot, '.git');
  }

  const hooksDir = path.join(gitDir, 'hooks');
  const hookPath = path.join(hooksDir, 'post-commit');

  // Ensure hooks directory exists
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  const script = hookScript();

  if (fs.existsSync(hookPath)) {
    // Hook file already exists
    const existing = fs.readFileSync(hookPath, 'utf-8');

    // Idempotent — check if narrate is already installed
    if (existing.includes(HOOK_START)) {
      console.log('Narrate is already installed.');
      console.log(`Hook: ${hookPath}`);
      console.log(`Changelog: ${path.resolve(repoRoot, 'CHANGELOG.human.md')}`);
      console.log('Make your next commit to see it in action.');
      return;
    }

    // Append witness section to existing hook
    const updated = existing.trimEnd() + '\n\n' + script + '\n';
    fs.writeFileSync(hookPath, updated, 'utf-8');
  } else {
    // Create new hook file
    const content = '#!/bin/sh\n\n' + script + '\n';
    fs.writeFileSync(hookPath, content, 'utf-8');
  }

  // Make executable
  fs.chmodSync(hookPath, 0o755);

  // Print the locked init output from decisions.md (exactly 4 lines)
  console.log('Narrate is watching.');
  console.log(`Hook: ${hookPath}`);
  console.log(`Changelog: ${path.resolve(repoRoot, 'CHANGELOG.human.md')}`);
  console.log('Make your next commit to see it in action.');
}

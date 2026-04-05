import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * The path to the hook worker script.
 */
const WORKER_PATH = path.join(__dirname, 'hook-worker.js');

/**
 * Spawn the hook worker as a detached child process.
 * Returns immediately (< 50ms) — the worker runs independently.
 *
 * @param {string} repoRoot - The repository root directory
 */
export function runHook(repoRoot) {
  const child = spawn('node', [WORKER_PATH, repoRoot], {
    detached: true,
    stdio: 'ignore',
    cwd: repoRoot,
    env: { ...process.env },
  });

  // Detach from parent — don't wait for child to finish
  child.unref();
}

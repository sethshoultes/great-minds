import { execSync } from 'child_process';

/**
 * Get the git repository root directory.
 * @param {string} [cwd] - Working directory to start from
 * @returns {string} Absolute path to repo root
 */
export function getRepoRoot(cwd) {
  return execSync('git rev-parse --show-toplevel', {
    cwd: cwd || process.cwd(),
    encoding: 'utf-8',
  }).trim();
}

/**
 * Get the diff for the last commit.
 * @param {string} repoRoot - Repo root path
 * @returns {string} The git diff output
 */
export function getLastDiff(repoRoot) {
  try {
    return execSync('git diff HEAD~1 HEAD', {
      cwd: repoRoot,
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });
  } catch {
    // Initial commit — no HEAD~1, diff against empty tree
    return execSync('git diff --cached 4b825dc642cb6eb9a060e54bf899d15363d7aa16 HEAD', {
      cwd: repoRoot,
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });
  }
}

/**
 * Get the diff for a specific commit.
 * @param {string} repoRoot - Repo root path
 * @param {string} hash - Commit hash
 * @returns {string} The git diff output
 */
export function getDiffForCommit(repoRoot, hash) {
  try {
    return execSync(`git diff ${hash}~1 ${hash}`, {
      cwd: repoRoot,
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch {
    // First commit in repo
    return execSync(`git diff 4b825dc642cb6eb9a060e54bf899d15363d7aa16 ${hash}`, {
      cwd: repoRoot,
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });
  }
}

/**
 * Get the commit message for the last commit.
 * @param {string} repoRoot - Repo root path
 * @returns {string} The commit message
 */
export function getCommitMessage(repoRoot) {
  return execSync('git log -1 --format=%s', {
    cwd: repoRoot,
    encoding: 'utf-8',
  }).trim();
}

/**
 * Get the commit message for a specific commit.
 * @param {string} repoRoot - Repo root path
 * @param {string} hash - Commit hash
 * @returns {string} The commit message
 */
export function getCommitMessageForHash(repoRoot, hash) {
  return execSync(`git log -1 --format=%s ${hash}`, {
    cwd: repoRoot,
    encoding: 'utf-8',
  }).trim();
}

/**
 * Get the short hash of the last commit.
 * @param {string} repoRoot - Repo root path
 * @returns {string} Short commit hash (7 chars)
 */
export function getCommitHash(repoRoot) {
  return execSync('git log -1 --format=%h', {
    cwd: repoRoot,
    encoding: 'utf-8',
  }).trim();
}

/**
 * Get the commit date for a specific commit.
 * @param {string} repoRoot - Repo root path
 * @param {string} hash - Commit hash
 * @returns {Date} The commit date
 */
export function getCommitDate(repoRoot, hash) {
  const dateStr = execSync(`git log -1 --format=%aI ${hash}`, {
    cwd: repoRoot,
    encoding: 'utf-8',
  }).trim();
  return new Date(dateStr);
}

/**
 * List commits since a given date.
 * @param {string} repoRoot - Repo root path
 * @param {string} sinceDate - ISO date string
 * @returns {Array<{hash: string, shortHash: string, message: string, date: Date}>}
 */
export function listCommitsSince(repoRoot, sinceDate) {
  const output = execSync(
    `git log --since="${sinceDate}" --format="%H|%h|%s|%aI" --reverse`,
    {
      cwd: repoRoot,
      encoding: 'utf-8',
    }
  ).trim();

  if (!output) return [];

  return output.split('\n').map((line) => {
    const [hash, shortHash, message, dateStr] = line.split('|');
    return { hash, shortHash, message, date: new Date(dateStr) };
  });
}

/**
 * Filter a diff to exclude files matching ignore patterns.
 * Uses simple glob matching (supports *, **, and exact names).
 * @param {string} diff - The full diff
 * @param {string[]} ignorePatterns - Patterns to exclude
 * @returns {string} Filtered diff
 */
export function filterDiff(diff, ignorePatterns) {
  if (!ignorePatterns || ignorePatterns.length === 0) return diff;

  const sections = diff.split(/^(?=diff --git)/m);
  const filtered = sections.filter((section) => {
    const match = section.match(/^diff --git a\/(.+?) b\//);
    if (!match) return true;
    const filePath = match[1];
    return !ignorePatterns.some((pattern) => matchGlob(pattern, filePath));
  });

  return filtered.join('');
}

/**
 * Simple glob matching.
 * Supports: exact match, *.ext, wildcard/pattern
 */
function matchGlob(pattern, filePath) {
  const fileName = filePath.split('/').pop();

  // Exact filename match
  if (pattern === fileName) return true;

  // *.ext pattern
  if (pattern.startsWith('*.')) {
    const ext = pattern.slice(1); // .ext
    return fileName.endsWith(ext);
  }

  // **/ prefix pattern
  if (pattern.startsWith('**/')) {
    const rest = pattern.slice(3);
    return filePath.includes(rest) || fileName === rest;
  }

  // Direct path match
  return filePath === pattern || filePath.endsWith('/' + pattern);
}

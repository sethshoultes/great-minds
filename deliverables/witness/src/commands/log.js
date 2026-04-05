import { getRepoRoot } from '../lib/git.js';
import { readEntries } from '../lib/changelog.js';

/**
 * ANSI color codes for terminal output.
 */
const COLORS = {
  dim: '\x1b[2m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
};

/**
 * Check if the terminal supports colors.
 * @returns {boolean}
 */
function supportsColor() {
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR) return true;
  return process.stdout.isTTY;
}

/**
 * Parse a --since value into a Date.
 * Supports: "yesterday", "today", "last week", "Nd" (days), "Nw" (weeks),
 * and ISO date strings.
 *
 * @param {string} since - The since value
 * @returns {Date} Threshold date
 */
function parseSince(since) {
  const now = new Date();

  if (since === 'today') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  if (since === 'yesterday') {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    d.setDate(d.getDate() - 1);
    return d;
  }

  if (since === 'last week') {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }

  // Relative: "3d", "2w", "1m"
  const relMatch = since.match(/^(\d+)([dwm])$/);
  if (relMatch) {
    const num = parseInt(relMatch[1], 10);
    const unit = relMatch[2];
    const d = new Date(now);
    if (unit === 'd') d.setDate(d.getDate() - num);
    else if (unit === 'w') d.setDate(d.getDate() - num * 7);
    else if (unit === 'm') d.setMonth(d.getMonth() - num);
    return d;
  }

  // ISO date or other parseable format
  const parsed = new Date(since);
  if (!isNaN(parsed.getTime())) return parsed;

  console.error(`  Warning: could not parse --since="${since}". Showing all entries.`);
  return new Date(0);
}

/**
 * Run the `narrate log` command.
 * Pretty-prints CHANGELOG.human.md in the terminal.
 *
 * @param {object} flags - Command flags (since)
 */
export async function runLog(flags) {
  let repoRoot;
  try {
    repoRoot = getRepoRoot();
  } catch {
    console.error('  Error: not a git repository.');
    process.exit(1);
  }

  const entries = await readEntries(repoRoot);

  if (entries.length === 0) {
    console.log('');
    console.log('  No entries yet. Make a commit to get started.');
    console.log('');
    return;
  }

  // Filter by --since if provided
  let filtered = entries;
  if (flags.since) {
    const threshold = parseSince(flags.since);
    filtered = entries.filter((e) => e.date >= threshold);
  }

  if (filtered.length === 0) {
    console.log('');
    console.log(`  No entries found since ${flags.since}.`);
    console.log('');
    return;
  }

  const colors = supportsColor();
  const dim = colors ? COLORS.dim : '';
  const reset = colors ? COLORS.reset : '';
  const bold = colors ? COLORS.bold : '';
  const cyan = colors ? COLORS.cyan : '';

  console.log('');

  for (const entry of filtered) {
    // Date line — dim
    console.log(`  ${dim}${entry.dateStr}${reset}`);
    console.log('');
    // Summary — normal, hash — dim
    console.log(`  ${bold}${entry.summary}${reset}  ${dim}·  ${entry.hash}${reset}`);
    console.log('');
  }
}

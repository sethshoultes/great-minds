import { readFile, writeFile, mkdir } from 'fs/promises';
import { resolve } from 'path';

const CHANGELOG_FILE = 'CHANGELOG.human.md';

/**
 * Format a date object into the changelog date format.
 * Expected output: "Apr 5, 2026 — 7:36 AM"
 *
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  // Format the date part: "Apr 5, 2026"
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const datePart = dateFormatter.format(date);

  // Format the time part: "7:36 AM"
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  const timePart = timeFormatter.format(date);

  // Join with " — "
  return `${datePart} — ${timePart}`;
}

/**
 * Format a changelog entry into the standard format.
 * Expected output:
 * ```
 * Apr 5, 2026 — 7:36 AM
 *
 *   Refactored user auth to use JWT tokens, fixing the Mobile Safari
 *   logout bug.  ·  abc1234
 * ```
 *
 * @param {Object} entry - The entry object
 * @param {Date} entry.date - The date of the entry
 * @param {string} entry.summary - The summary text
 * @param {string} entry.hash - The commit hash
 * @returns {string} Formatted entry string
 */
export function formatEntry({ date, summary, hash }) {
  const dateStr = formatDate(date);
  const shortHash = hash.substring(0, 7);
  const indentedSummary = `  ${summary}  ·  ${shortHash}`;

  return `${dateStr}\n\n${indentedSummary}\n\n`;
}

/**
 * Append a new entry to the changelog file.
 * Prepends new entries at the top (newest first).
 * If config.attribution is true, ensures the attribution footer exists.
 *
 * @param {string} repoRoot - The root directory of the repository
 * @param {Object} entry - The entry to append
 * @param {Object} config - Configuration object
 * @param {boolean} config.attribution - Whether to include the attribution footer
 * @returns {Promise<void>}
 */
export async function appendEntry(repoRoot, entry, config = {}) {
  const changelogPath = resolve(repoRoot, CHANGELOG_FILE);
  const formattedEntry = formatEntry(entry);
  const attributionFooter = '*Narrated by Narrate — your code, in plain English*';

  // Ensure the directory exists
  await mkdir(repoRoot, { recursive: true });

  let currentContent = '';
  try {
    currentContent = await readFile(changelogPath, 'utf-8');
  } catch {
    // File doesn't exist, that's fine
    currentContent = '';
  }

  // Check if attribution footer exists
  let newContent = formattedEntry + currentContent;

  if (config.attribution === true) {
    // Ensure the attribution footer exists at the end
    const footerExists = newContent.trim().endsWith(attributionFooter);
    if (!footerExists) {
      // Remove any trailing whitespace and add the footer
      newContent = newContent.trimEnd() + '\n\n' + attributionFooter;
    }
  }

  await writeFile(changelogPath, newContent, 'utf-8');
}

export { CHANGELOG_FILE };

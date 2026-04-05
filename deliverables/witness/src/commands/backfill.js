import { createInterface } from 'readline';
import { getRepoRoot, listCommitsSince, getDiffForCommit, getCommitMessageForHash, filterDiff } from '../lib/git.js';
import { loadConfig, getApiKey } from '../lib/config.js';
import { summarize } from '../lib/summarize.js';
import { generateFallback } from '../lib/fallback.js';
import { appendEntry, readEntries, CHANGELOG_FILE } from '../lib/changelog.js';

/**
 * Parse a --last value into an ISO date string.
 * Supports: "90d", "30d", "2w", etc.
 *
 * @param {string} last - The last value (e.g., "90d", "2w")
 * @returns {string} ISO date string
 */
function parseLastFlag(last) {
  const now = new Date();
  const match = last.match(/^(\d+)([dwm])$/);

  if (!match) {
    // Try parsing as ISO date
    const parsed = new Date(last);
    if (!isNaN(parsed.getTime())) return parsed.toISOString();

    console.error(`  Error: could not parse --last="${last}". Use format like "90d", "2w", or "3m".`);
    process.exit(1);
  }

  const num = parseInt(match[1], 10);
  const unit = match[2];

  if (unit === 'd') now.setDate(now.getDate() - num);
  else if (unit === 'w') now.setDate(now.getDate() - num * 7);
  else if (unit === 'm') now.setMonth(now.getMonth() - num);

  return now.toISOString();
}

/**
 * Estimate cost for Haiku API calls.
 * Haiku pricing: ~$0.25/1M input tokens, ~$1.25/1M output tokens.
 * Rough estimate: ~500 tokens per call input, ~30 tokens output.
 *
 * @param {number} commitCount
 * @returns {string} Estimated cost string
 */
function estimateCost(commitCount) {
  // ~500 input tokens + ~30 output tokens per commit
  const inputTokens = commitCount * 500;
  const outputTokens = commitCount * 30;
  const inputCost = (inputTokens / 1_000_000) * 0.80;  // Haiku input
  const outputCost = (outputTokens / 1_000_000) * 4.00; // Haiku output
  const total = inputCost + outputCost;

  if (total < 0.01) return '<$0.01';
  return `~$${total.toFixed(2)}`;
}

/**
 * Prompt user for confirmation.
 * @param {string} question
 * @returns {Promise<boolean>}
 */
function confirm(question) {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().startsWith('y'));
    });
  });
}

/**
 * Sleep for ms milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run the `witness backfill` command.
 * Processes historical commits and generates changelog entries.
 *
 * @param {object} flags - Command flags (last)
 */
export async function runBackfill(flags) {
  let repoRoot;
  try {
    repoRoot = getRepoRoot();
  } catch {
    console.error('  Error: not a git repository.');
    process.exit(1);
  }

  const lastPeriod = flags.last || '90d';
  const sinceDate = parseLastFlag(lastPeriod);
  const config = await loadConfig(repoRoot);
  const apiKey = getApiKey();

  // Get all commits in the period
  const allCommits = listCommitsSince(repoRoot, sinceDate);

  if (allCommits.length === 0) {
    console.log('');
    console.log(`  No commits found in the last ${lastPeriod}.`);
    console.log('');
    return;
  }

  // Filter out commits already in changelog
  const existingEntries = await readEntries(repoRoot);
  const existingHashes = new Set(existingEntries.map((e) => e.hash));

  const commits = allCommits.filter(
    (c) => !existingHashes.has(c.shortHash) && !existingHashes.has(c.hash.substring(0, 7))
  );

  if (commits.length === 0) {
    console.log('');
    console.log(`  All ${allCommits.length} commits already have changelog entries.`);
    console.log('');
    return;
  }

  // Show cost preview
  console.log('');
  const costStr = apiKey ? estimateCost(commits.length) : 'free (offline mode)';
  console.log(`  Found ${commits.length} commits to summarize.`);
  console.log(`  Estimated cost: ${costStr} (${apiKey ? 'Haiku' : 'offline fallback'}).`);
  console.log('');

  const proceed = await confirm('  Continue? [y/n] ');
  if (!proceed) {
    console.log('  Aborted.');
    return;
  }

  console.log('');

  // Process commits in batches of 10
  const BATCH_SIZE = 10;
  let processed = 0;

  for (let i = 0; i < commits.length; i++) {
    const commit = commits[i];
    const msgPreview = commit.message.substring(0, 50);
    process.stdout.write(
      `  [${i + 1}/${commits.length}] Processing ${commit.shortHash} — ${msgPreview}...`
    );

    try {
      const diff = getDiffForCommit(repoRoot, commit.hash);
      const filteredDiff = filterDiff(diff, config.ignore);

      let summary;

      if (!filteredDiff.trim()) {
        summary = `Updated ignored files (${commit.message})`;
      } else if (apiKey) {
        try {
          summary = await summarize({
            diff: filteredDiff,
            commitMessage: commit.message,
            config,
          });
        } catch {
          summary = generateFallback({
            diff: filteredDiff,
            commitMessage: commit.message,
          });
        }
      } else {
        summary = generateFallback({
          diff: filteredDiff,
          commitMessage: commit.message,
        });
      }

      await appendEntry(
        repoRoot,
        {
          date: commit.date,
          summary,
          hash: commit.shortHash,
        },
        config
      );

      processed++;
      console.log(' done');
    } catch (error) {
      console.log(` error: ${error.message}`);
    }

    // Rate limiting: pause 1 second between batches
    if ((i + 1) % BATCH_SIZE === 0 && i + 1 < commits.length) {
      await sleep(1000);
    }
  }

  console.log('');
  console.log(`  Backfill complete. ${processed} entries added to ${CHANGELOG_FILE}.`);
  console.log('');
}

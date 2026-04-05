#!/usr/bin/env node

/**
 * Hook worker — runs as a detached child process after each commit.
 * Reads the last commit's diff and message, summarizes via AI (or fallback),
 * and appends the entry to CHANGELOG.human.md.
 *
 * This script is spawned by hook-runner.js and runs independently of git.
 * It must never crash git — all errors are caught and logged.
 */

import { getRepoRoot, getLastDiff, getCommitMessage, getCommitHash, filterDiff } from './git.js';
import { loadConfig, getApiKey } from './config.js';
import { summarize } from './summarize.js';
import { generateFallback } from './fallback.js';
import { appendEntry } from './changelog.js';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

async function run() {
  // Repo root passed as argument or detected
  const repoRoot = process.argv[2] || getRepoRoot();

  const config = await loadConfig(repoRoot);
  const diff = getLastDiff(repoRoot);
  const commitMessage = getCommitMessage(repoRoot);
  const shortHash = getCommitHash(repoRoot);

  // Filter ignored files from diff
  const filteredDiff = filterDiff(diff, config.ignore);

  // Skip if diff is empty after filtering
  if (!filteredDiff.trim()) {
    return;
  }

  let summary;
  const apiKey = getApiKey();

  if (apiKey) {
    try {
      summary = await summarize({
        diff: filteredDiff,
        commitMessage,
        config,
      });
    } catch (error) {
      // API failed — fall back to rule-based
      summary = generateFallback({
        diff: filteredDiff,
        commitMessage,
      });
    }
  } else {
    // No API key — use fallback
    summary = generateFallback({
      diff: filteredDiff,
      commitMessage,
    });
  }

  await appendEntry(
    repoRoot,
    {
      date: new Date(),
      summary,
      hash: shortHash,
    },
    config
  );
}

run().catch(async (error) => {
  // Log errors silently — never crash git
  try {
    const repoRoot = process.argv[2] || process.cwd();
    const logPath = resolve(repoRoot, '.narrate-error.log');
    const timestamp = new Date().toISOString();
    await writeFile(
      logPath,
      `[${timestamp}] ${error.message}\n${error.stack}\n\n`,
      { flag: 'a' }
    );
  } catch {
    // Even logging failed — exit silently
  }
  process.exit(0);
});

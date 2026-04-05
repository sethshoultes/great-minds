#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const VERSION = packageJson.version;

function showHelp() {
  console.log(`
  narrate ${VERSION}
  Your code, in plain English

  USAGE
    narrate <command> [options]

  COMMANDS
    init                Install post-commit hook in this repo
    log [--since=<date>] Pretty-print the changelog
    backfill [--last=<period>] Backfill changelog from git history

  OPTIONS
    --help, -h          Show this help message
    --version, -v       Show version number

  EXAMPLES
    narrate init
    narrate log
    narrate log --since=yesterday
    narrate backfill --last=90d
`);
}

function showVersion() {
  console.log(`narrate ${VERSION}`);
}

function parseArgs(args) {
  const parsed = { command: null, flags: {} };
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      parsed.flags[key] = value || true;
    } else if (arg.startsWith('-')) {
      parsed.flags[arg.slice(1)] = true;
    } else if (!parsed.command) {
      parsed.command = arg;
    }
  }
  return parsed;
}

async function main() {
  const args = process.argv.slice(2);
  const { command, flags } = parseArgs(args);

  if (flags.help || flags.h) {
    showHelp();
    process.exit(0);
  }

  if (flags.version || flags.v) {
    showVersion();
    process.exit(0);
  }

  if (!command) {
    showHelp();
    process.exit(0);
  }

  switch (command) {
    case 'init': {
      const { runInit } = await import('../src/commands/init.js');
      await runInit();
      break;
    }
    case 'log': {
      const { runLog } = await import('../src/commands/log.js');
      await runLog(flags);
      break;
    }
    case 'backfill': {
      const { runBackfill } = await import('../src/commands/backfill.js');
      await runBackfill(flags);
      break;
    }
    default:
      console.error(`  Error: unknown command '${command}'`);
      console.error(`  Run 'narrate --help' for usage information`);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});

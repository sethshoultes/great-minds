#!/usr/bin/env node
/**
 * CLI for the Great Minds memory store.
 *
 * Usage:
 *   memory add --type learning --agent "Elon Musk" --project "Dash" --content "..."
 *   memory search "how to dispatch agents" --limit 5
 *   memory list --type decision --project "LocalGenius"
 *   memory list --agent "Jensen Huang"
 *   memory import --dir ../memory --rounds ../rounds
 *   memory export
 *   memory stats
 *   memory remove --id 42
 */

import { Command } from 'commander';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MEMORY_TYPES, type MemoryType, MemoryStore } from './store.js';
import { importAll, exportToMarkdown } from './import.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Resolve DB path — look for memory-store dir, fall back to cwd
function resolveDbPath(): string {
  // Check if MEMORY_DB env is set
  if (process.env.MEMORY_DB) return process.env.MEMORY_DB;

  // Default: memory.db in the memory-store directory
  return path.join(PROJECT_ROOT, 'memory.db');
}

function createStore(): MemoryStore {
  return new MemoryStore(resolveDbPath());
}

// ── CLI ────────────────────────────────────────────────────────────────────

const program = new Command();

program
  .name('memory')
  .description('Great Minds agency memory store — search, add, and manage agent memories')
  .version('1.0.0');

// ── add ────────────────────────────────────────────────────────────────────

program
  .command('add')
  .description('Add a memory')
  .requiredOption('-t, --type <type>', `Memory type: ${MEMORY_TYPES.join(', ')}`)
  .option('-a, --agent <agent>', 'Agent name', '')
  .option('-p, --project <project>', 'Project name', '')
  .requiredOption('-c, --content <content>', 'Memory content')
  .action(async (opts) => {
    if (!MEMORY_TYPES.includes(opts.type)) {
      console.error(`Invalid type: ${opts.type}. Must be one of: ${MEMORY_TYPES.join(', ')}`);
      process.exit(1);
    }

    const store = createStore();
    try {
      const id = await store.add(opts.type as MemoryType, opts.agent, opts.project, opts.content);
      console.log(`Added memory #${id} (${opts.type})`);
    } finally {
      store.close();
    }
  });

// ── search ─────────────────────────────────────────────────────────────────

program
  .command('search <query>')
  .description('Search memories by semantic similarity')
  .option('-l, --limit <n>', 'Max results', '5')
  .action(async (query, opts) => {
    const store = createStore();
    try {
      const results = await store.search(query, parseInt(opts.limit, 10));

      if (results.length === 0) {
        console.log('No matching memories found.');
        return;
      }

      for (const mem of results) {
        const score = (mem.score * 100).toFixed(1);
        console.log(`\n--- #${mem.id} [${mem.type}] (${score}% match) ---`);
        if (mem.agent) console.log(`Agent: ${mem.agent}`);
        if (mem.project) console.log(`Project: ${mem.project}`);
        console.log(mem.content.substring(0, 300));
        if (mem.content.length > 300) console.log('  ...(truncated)');
      }
      console.log(`\n${results.length} result(s)`);
    } finally {
      store.close();
    }
  });

// ── list ───────────────────────────────────────────────────────────────────

program
  .command('list')
  .description('List memories by type, agent, or project')
  .option('-t, --type <type>', 'Filter by type')
  .option('-a, --agent <agent>', 'Filter by agent')
  .option('-p, --project <project>', 'Filter by project')
  .action(async (opts) => {
    const store = createStore();
    try {
      let results;
      if (opts.type) {
        results = store.listByType(opts.type as MemoryType);
      } else if (opts.agent) {
        results = store.listByAgent(opts.agent);
      } else if (opts.project) {
        results = store.listByProject(opts.project);
      } else {
        console.error('Specify --type, --agent, or --project');
        process.exit(1);
      }

      if (results.length === 0) {
        console.log('No memories found.');
        return;
      }

      for (const mem of results) {
        console.log(`\n--- #${mem.id} [${mem.type}] ---`);
        if (mem.agent) console.log(`Agent: ${mem.agent}`);
        if (mem.project) console.log(`Project: ${mem.project}`);
        console.log(mem.content.substring(0, 200));
        if (mem.content.length > 200) console.log('  ...(truncated)');
      }
      console.log(`\n${results.length} result(s)`);
    } finally {
      store.close();
    }
  });

// ── import ─────────────────────────────────────────────────────────────────

program
  .command('import')
  .description('Import memories from existing markdown files')
  .option('-d, --dir <path>', 'Memory directory (memory/)', '../memory')
  .option('-r, --rounds <path>', 'Rounds directory (rounds/)', '../rounds')
  .option('-i, --index <path>', 'MEMORY.md index file', '../MEMORY.md')
  .option('-f, --file <path>', 'Import a single markdown file')
  .action(async (opts) => {
    const store = createStore();
    try {
      // Resolve paths relative to the memory-store directory
      const baseDir = PROJECT_ROOT;

      if (opts.file) {
        // Import single file
        const filePath = path.resolve(opts.file);
        if (!fs.existsSync(filePath)) {
          console.error(`File not found: ${filePath}`);
          process.exit(1);
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        const id = await store.add('learning', '', '', content);
        console.log(`Imported file as memory #${id}`);
        return;
      }

      console.log('Importing Great Minds memories...\n');

      const result = await importAll(store, {
        memoryDir: path.resolve(baseDir, opts.dir),
        roundsDir: path.resolve(baseDir, opts.rounds),
        memoryIndex: path.resolve(baseDir, opts.index),
      });

      console.log(`\nDone. Imported: ${result.imported}, Skipped (dupes): ${result.skipped}`);
      if (result.errors.length > 0) {
        console.log(`Errors (${result.errors.length}):`);
        for (const e of result.errors) console.log(`  - ${e}`);
      }
    } finally {
      store.close();
    }
  });

// ── export ─────────────────────────────────────────────────────────────────

program
  .command('export')
  .description('Export all memories to markdown')
  .option('-o, --output <path>', 'Output file (stdout if omitted)')
  .action(async (opts) => {
    const store = createStore();
    try {
      const md = exportToMarkdown(store);
      if (opts.output) {
        fs.writeFileSync(opts.output, md);
        console.log(`Exported to ${opts.output}`);
      } else {
        console.log(md);
      }
    } finally {
      store.close();
    }
  });

// ── stats ──────────────────────────────────────────────────────────────────

program
  .command('stats')
  .description('Show memory store statistics')
  .action(async () => {
    const store = createStore();
    try {
      const s = store.stats();
      console.log(`Total memories: ${s.total}\n`);

      console.log('By type:');
      for (const [type, count] of Object.entries(s.byType)) {
        console.log(`  ${type}: ${count}`);
      }

      console.log('\nBy agent:');
      for (const [agent, count] of Object.entries(s.byAgent)) {
        console.log(`  ${agent}: ${count}`);
      }
    } finally {
      store.close();
    }
  });

// ── remove ─────────────────────────────────────────────────────────────────

program
  .command('remove')
  .description('Remove a memory by ID')
  .requiredOption('--id <id>', 'Memory ID to remove')
  .action(async (opts) => {
    const store = createStore();
    try {
      const id = parseInt(opts.id, 10);
      const mem = store.getById(id);
      if (!mem) {
        console.error(`Memory #${id} not found.`);
        process.exit(1);
      }
      store.remove(id);
      console.log(`Removed memory #${id} (${mem.type})`);
    } finally {
      store.close();
    }
  });

// ── run ────────────────────────────────────────────────────────────────────

program.parse();

import { readFileSync } from 'fs';
import { join } from 'path';
import { remark } from 'remark';
import html from 'remark-html';

/**
 * Read a markdown file from the great-minds repo root and render to HTML.
 * The repo IS the knowledge base — we render it, not duplicate it.
 */

const REPO_ROOT = join(process.cwd(), '..');

export async function renderRepoMarkdown(relativePath: string): Promise<string> {
  const fullPath = join(REPO_ROOT, relativePath);
  const markdown = readFileSync(fullPath, 'utf-8');
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export function getRepoMarkdownSync(relativePath: string): string {
  const fullPath = join(REPO_ROOT, relativePath);
  return readFileSync(fullPath, 'utf-8');
}

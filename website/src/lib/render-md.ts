import { readFileSync } from 'fs';
import { join, dirname, posix } from 'path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';
import { visit } from 'unist-util-visit';
import type { Root, Link } from 'mdast';

/**
 * Read a markdown file from the great-minds repo root and render to HTML.
 * The repo IS the knowledge base — we render it, not duplicate it.
 *
 * Uses remark-gfm for GitHub Flavored Markdown: tables, strikethrough,
 * task lists, autolinks.
 */

const REPO_ROOT = join(process.cwd(), '..');
const GITHUB_BLOB = 'https://github.com/sethshoultes/great-minds/blob/main';

/**
 * Remark plugin: rewrite relative .md links to GitHub blob URLs.
 *
 * Relative links like `memory/architecture-decisions.md` make sense when
 * browsing the repo on disk or on GitHub, but break when the markdown is
 * rendered on the website (e.g. /docs/memory). This plugin resolves each
 * relative .md href against the source file's directory and rewrites it
 * to the corresponding GitHub blob URL so the link works everywhere.
 *
 * Links that are already absolute (http/https/mailto/#) are left alone.
 */
function remarkRewriteMdLinks(sourceRelativePath: string) {
  const sourceDir = dirname(sourceRelativePath);

  return () => (tree: Root) => {
    visit(tree, 'link', (node: Link) => {
      const href = node.url;

      // Skip absolute URLs, anchors, and non-.md links
      if (/^(https?:|mailto:|#)/.test(href)) return;
      if (!href.endsWith('.md')) return;

      // Resolve relative to the source file's location within the repo
      const resolved = posix.normalize(posix.join(sourceDir, href));

      // Paths that escape the repo (e.g. ../../../.claude/...) get a
      // GitHub search link instead — they can't be linked meaningfully.
      if (resolved.startsWith('..')) {
        node.url = `https://github.com/sethshoultes/great-minds/search?q=${encodeURIComponent(posix.basename(href, '.md'))}`;
        return;
      }

      node.url = `${GITHUB_BLOB}/${resolved}`;
    });
  };
}

export async function renderRepoMarkdown(relativePath: string): Promise<string> {
  const fullPath = join(REPO_ROOT, relativePath);
  const markdown = readFileSync(fullPath, 'utf-8');
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRewriteMdLinks(relativePath))
    .use(html)
    .process(markdown);
  return result.toString();
}

export function getRepoMarkdownSync(relativePath: string): string {
  const fullPath = join(REPO_ROOT, relativePath);
  return readFileSync(fullPath, 'utf-8');
}

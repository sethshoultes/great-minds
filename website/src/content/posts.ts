/**
 * Blog posts — reads markdown files from content/blog/.
 * Parses YAML frontmatter for metadata, keeps raw markdown for rendering.
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  authorSlug: string;
  readingTime: string;
  tags: string[];
  image?: string;
  content: string;        // raw markdown body
}

// Also re-export Section type for backward compat (blog post page may reference it)
export type Section = never;

const BLOG_DIR = join(process.cwd(), 'content', 'blog');

function parseFrontmatter(raw: string): { meta: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const meta: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: string | string[] = line.slice(colonIdx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith('[')) {
      try { value = JSON.parse(value); } catch { /* keep as string */ }
    }
    meta[key] = value;
  }

  return { meta, content: match[2].trim() };
}

function estimateReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function loadPosts(): BlogPost[] {
  try {
    const files = readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
    return files.map(file => {
      const raw = readFileSync(join(BLOG_DIR, file), 'utf-8');
      const { meta, content } = parseFrontmatter(raw);
      const slug = (meta.slug as string) || file.replace('.md', '');
      return {
        slug,
        title: (meta.title as string) || slug,
        description: (meta.description as string) || '',
        date: (meta.date as string) || '2026-04-03',
        author: (meta.author as string) || 'Seth Shoultes',
        authorSlug: ((meta.author as string) || 'Seth Shoultes').toLowerCase().replace(/\s+/g, '-'),
        readingTime: estimateReadingTime(content),
        tags: Array.isArray(meta.tags) ? meta.tags as string[] : [],
        image: meta.image as string | undefined,
        content,
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

let _posts: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (!_posts) _posts = loadPosts();
  return _posts;
}

export function getPost(slug: string): BlogPost | null {
  return getAllPosts().find(p => p.slug === slug) || null;
}

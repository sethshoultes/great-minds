/**
 * Blog posts — stored as plain data.
 * No MDX, no CMS, no build plugins. Just TypeScript.
 *
 * Content is stored as arrays of paragraphs/sections for clean rendering.
 * This keeps the blog fast, type-safe, and dependency-free.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;           // ISO date
  author: string;
  authorSlug: string;     // links to /team/[slug]
  readingTime: string;    // e.g. "8 min read"
  tags: string[];
  ogImage?: string;
  sections: Section[];
}

export type Section =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; text: string };

export const posts: BlogPost[] = [
  {
    slug: 'ai-agent-memory-architecture',
    title: 'How Nine AI Agents Remember What They Learned',
    description: 'The memory architecture behind Great Minds — how agents persist knowledge across sessions, resolve conflicts, and get smarter over time.',
    date: '2026-04-03',
    author: 'Seth Shoultes',
    authorSlug: 'seth-shoultes',
    readingTime: '8 min read',
    tags: ['architecture', 'ai-agents', 'memory', 'engineering'],
    sections: [
      { type: 'paragraph', text: 'When you run a single AI model, context is easy — everything lives in one conversation window. When you run nine agents across multiple sessions, each with their own personality, values, and responsibilities, context becomes an architecture problem.' },

      { type: 'heading', text: 'The Problem: Agents That Forget' },
      { type: 'paragraph', text: 'The first version of Great Minds had no memory. Every session started cold. Steve Jobs would re-discover the brand guide. Elon Musk would re-derive the tech stack. Marcus Aurelius would re-learn which decisions had already been locked. It was like managing a team with collective amnesia.' },
      { type: 'paragraph', text: 'The waste was staggering — not in compute cost, but in decision quality. Without memory, agents would revisit settled debates, contradict prior decisions, and produce work that drifted from established standards. The product suffered because the team couldn\'t learn.' },

      { type: 'heading', text: 'The Architecture: Three Memory Layers' },
      { type: 'paragraph', text: 'We solved this with a three-layer memory system, each serving a different temporal need:' },

      { type: 'subheading', text: 'Layer 1: MEMORY.md — The Index' },
      { type: 'paragraph', text: 'Every agent has access to a shared MEMORY.md file that acts as an index. It\'s loaded into context at the start of every session — never more than 200 lines. Each entry is a one-line pointer to a memory file with a description specific enough to determine relevance without reading the full file.' },
      { type: 'code', language: 'markdown', code: '- [User preferences](memory/user_role.md) — Senior engineer, prefers terse responses\n- [Brand voice](memory/feedback_brand.md) — No exclamation marks, first person, warm not cute\n- [Tech stack decision](memory/project_techstack.md) — Next.js + Drizzle + Neon, decided Apr 1' },

      { type: 'subheading', text: 'Layer 2: Memory Files — The Knowledge' },
      { type: 'paragraph', text: 'Each memory file has structured frontmatter (name, description, type) and a body. Types include: user (who am I talking to), feedback (what to repeat or avoid), project (current state of work), and reference (where to find external information).' },
      { type: 'paragraph', text: 'The critical design decision: memories are written by agents but curated by the Organizer agent, which runs on a cron cycle. The Organizer consolidates duplicates, prunes stale entries, and ensures the index stays under 200 lines. Without this, memory bloats until it\'s useless.' },

      { type: 'subheading', text: 'Layer 3: Git History — The Truth' },
      { type: 'paragraph', text: 'Memory files can become stale. A memory that says "the API uses Bearer tokens" might be wrong if someone switched to cookies last session. The third layer is git itself — agents are instructed to verify memory claims against the actual codebase before acting on them.' },
      { type: 'quote', text: 'A memory that names a specific function, file, or flag is a claim that it existed when the memory was written. It may have been renamed, removed, or never merged. Before recommending it: verify first.', attribution: 'From the Great Minds memory spec' },

      { type: 'heading', text: 'Memory Types and When to Use Them' },
      { type: 'list', items: [
        'User memories — who the human is, their role, preferences. Persists across all projects.',
        'Feedback memories — corrections and confirmations. "Don\'t mock the database in tests" with a reason why.',
        'Project memories — current state of work. Deadlines, decisions, blockers. Decays fast.',
        'Reference memories — where to find things. "Bugs are tracked in Linear project INGEST."',
      ] },

      { type: 'heading', text: 'What NOT to Remember' },
      { type: 'paragraph', text: 'The hardest part of the memory system isn\'t what to save — it\'s what to exclude. Code patterns, file paths, architecture decisions, and git history are all derivable from the current codebase. Saving them to memory creates a stale parallel truth that diverges from reality.' },
      { type: 'callout', text: 'Rule: if you can derive it by reading the code or running git log, don\'t save it to memory. Memory is for things that can\'t be seen — preferences, decisions with reasoning, external references.' },

      { type: 'heading', text: 'Conflict Resolution' },
      { type: 'paragraph', text: 'When a memory contradicts current reality, the agent trusts what it observes now — and updates or removes the stale memory. This is critical. A memory system that doesn\'t self-correct becomes a liability. The Organizer agent runs a "dream cycle" that specifically looks for these conflicts.' },
      { type: 'paragraph', text: 'In practice, this means agents occasionally say: "My notes say the auth uses localStorage tokens, but I can see the code uses httpOnly cookies. Updating my memory." That transparency — admitting the memory was wrong — is what keeps the system honest.' },

      { type: 'heading', text: 'Results' },
      { type: 'paragraph', text: 'With the memory system in place, session-to-session consistency improved dramatically. Steve Jobs remembers the brand guide and doesn\'t propose violating it. Elon Musk remembers which Jensen issues are fixed and which are open. Margaret Hamilton remembers which QA patterns caught real bugs and applies them proactively.' },
      { type: 'paragraph', text: 'The LocalGenius project — 258 source files, 761 tests, three live products — was built across multiple sessions. Without persistent memory, each session would have started from scratch. With it, the agency accumulated intelligence. It got smarter over time. That\'s the point.' },

      { type: 'heading', text: 'Open Questions' },
      { type: 'paragraph', text: 'The current system works but has limits. Memory is text-based and linear — there\'s no semantic search, no embedding-based retrieval, no graph structure. For a 9-agent team, linear memory is fine. For 50 agents working on 10 projects, it won\'t scale.' },
      { type: 'paragraph', text: 'The next evolution is likely a hybrid: structured memory files for human-readable persistence, plus a vector store for semantic retrieval when the memory corpus exceeds what fits in a 200-line index. But we\'re not there yet — and building it before we need it would be premature optimization. Elon would approve.' },
    ],
  },
];

export function getPost(slug: string): BlogPost | null {
  return posts.find(p => p.slug === slug) || null;
}

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Blog data layer — shared between pages, sitemap, and RSS feed.
 *
 * In production, this would read from MDX files or a CMS.
 * For now, hardcoded posts that demonstrate the framework.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  authorSlug: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  image?: string;
  readingTime: string;
}

const BASE_URL = 'https://greatminds.company';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'building-localgenius',
    title: 'Building LocalGenius in One Session — What 9 AI Minds Can Do',
    description: 'How the Great Minds Agency shipped a complete SaaS product — 761 tests, 24 services, live in production — in a single Claude Code session.',
    content: `When we started the LocalGenius project, we had a PRD and a blank repository. When we finished, we had a production-ready SaaS application with 23,000 lines of code, 761 passing tests, and real users signing up.

The key insight: AI agents don't need to be general-purpose. They need to be specialists with clear mandates. Steve Jobs handles design. Elon Musk handles engineering. Jensen Huang reviews everything. Marcus Aurelius moderates debates.

Each agent operates in its own Claude Code window, communicating through a shared filesystem. The moderator dispatches tasks. The directors spawn sub-agents for parallel work. The result is not one AI doing everything — it's a team of AIs, each doing what they do best.`,
    author: 'Seth Shoultes',
    authorSlug: 'seth-shoultes',
    publishedAt: '2026-04-02',
    tags: ['case-study', 'localgenius', 'ai-agents'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
    readingTime: '8 min read',
  },
  {
    slug: 'ai-agency-architecture',
    title: 'The Architecture of an AI Agency — Personas, Debates, and Sub-Agents',
    description: 'A technical deep-dive into how Great Minds structures AI collaboration: persona design, adversarial debate, parallel sub-agent dispatch, and shared memory.',
    content: `The Great Minds framework is built on a simple observation: the best products come from tension between competing perspectives. Steve Jobs pushes for simplicity. Elon Musk pushes for feasibility. The product emerges from their disagreement.

We formalize this into a multi-agent architecture with four phases: DEBATE (directors stake positions), PLAN (converge on decisions), BUILD (sub-agents execute in parallel), and REVIEW (quality gates before ship).

The moderator — Marcus Aurelius — ensures debates are productive, not circular. Each director can spawn up to 3 sub-agents using the Agent tool, running on haiku for cost efficiency. The shared filesystem at /tmp/claude-shared/ acts as the communication bus.`,
    author: 'Seth Shoultes',
    authorSlug: 'seth-shoultes',
    publishedAt: '2026-04-01',
    tags: ['architecture', 'ai-agents', 'framework'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    readingTime: '12 min read',
  },
  {
    slug: 'great-minds-framework',
    title: 'Introducing the Great Minds Framework — Ship Products with AI Teams',
    description: 'The open-source framework for orchestrating multiple AI agents into a product team. Drop in a PRD, get back a shipped product.',
    content: `Every tool promises to make you more productive. Great Minds makes a different promise: we ship the product for you.

The framework orchestrates Claude Code instances into a structured product team. You provide the PRD. The agency provides the strategy, design, engineering, testing, and deployment. The output is not a prototype — it's a production application with tests, documentation, and CI/CD.

This is not AGI. This is not a single AI doing everything. This is a carefully designed system of specialized agents, each with a clear role, communicating through structured protocols, and held accountable by quality gates.`,
    author: 'Seth Shoultes',
    authorSlug: 'seth-shoultes',
    publishedAt: '2026-03-30',
    tags: ['announcement', 'framework', 'open-source'],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
    readingTime: '6 min read',
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

export function getPostUrl(slug: string): string {
  return `${BASE_URL}/blog/${slug}`;
}

/**
 * Generate JSON-LD Article structured data for a blog post.
 */
export function getArticleJsonLd(post: BlogPost): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
      url: `${BASE_URL}/team/${post.authorSlug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Great Minds',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getPostUrl(post.slug),
    },
  };
}

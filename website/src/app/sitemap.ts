import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/content/posts';
import { allProfiles } from '@/app/team/agents';

// Doc page slugs — matches sidebar nav in docs/layout.tsx
const DOC_SLUGS = ['agents', 'pipeline', 'crons', 'memory', 'qa', 'plugin', 'operations'];

/**
 * Sitemap — auto-generated from real data.
 * Next.js serves this at /sitemap.xml.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://greatminds.company';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/how`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/work/localgenius`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/install`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ];

  const teamPages: MetadataRoute.Sitemap = allProfiles.map((agent) => ({
    url: `${base}/team/${agent.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const blogPosts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  const docPages: MetadataRoute.Sitemap = [
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    ...DOC_SLUGS.map((slug) => ({
      url: `${base}/docs/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  return [...staticPages, ...teamPages, ...blogPosts, ...docPages];
}

import type { MetadataRoute } from 'next';

/**
 * Robots.txt — controls search engine crawling.
 * Next.js serves this at /robots.txt.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://greatminds.company/sitemap.xml',
  };
}

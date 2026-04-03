import { getAllPosts } from '@/content/posts';

/**
 * RSS Feed — /blog/feed.xml
 *
 * Standard RSS 2.0 feed for blog posts. Works with any RSS reader,
 * podcast apps, and services like Feedly, Inoreader, etc.
 */
export async function GET() {
  const posts = getAllPosts();
  const baseUrl = 'https://greatminds.company';

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${escapeXml(post.author)}</author>
      ${post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join('\n      ')}
    </item>`
    )
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Great Minds Blog</title>
    <link>${baseUrl}/blog</link>
    <description>AI agents that ship products. Technical deep-dives, case studies, and the framework behind Great Minds.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

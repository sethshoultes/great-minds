import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, getPost } from '@/content/posts';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';

async function renderMarkdown(md: string): Promise<string> {
  const result = await remark().use(remarkGfm).use(html).process(md);
  return result.toString();
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `https://greatminds.company/blog/${slug}`;
  return {
    title: `${post.title} — Great Minds Blog`,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      url,
      images: post.image ? [post.image] : ['/og-image.svg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: { canonical: url },
  };
}


export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Great Minds Agency' },
    url: `https://greatminds.company/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="flex flex-col">
        {/* Header */}
        <header className="px-6 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="max-w-[680px] mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-zinc-500 hover:text-zinc-300 transition-colors no-underline text-sm mb-10"
            >
              ← Blog
            </Link>

            <div className="flex items-center gap-3 mb-4 text-xs text-zinc-500">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
              <span>·</span>
              <span>{post.readingTime}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.15] text-zinc-50 mb-6">
              {post.title}
            </h1>

            <p className="text-lg text-zinc-400 leading-relaxed mb-6">
              {post.description}
            </p>

            <div className="flex items-center gap-3">
              <Link
                href={`/team/${post.authorSlug}`}
                className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors no-underline"
              >
                By <span className="text-zinc-300 font-medium">{post.author}</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Content — rendered from markdown */}
        <div className="px-6 pb-20">
          <div
            className="max-w-[680px] mx-auto text-[1.0625rem] blog-content"
            dangerouslySetInnerHTML={{
              __html: await renderMarkdown(post.content),
            }}
          />
          <style>{`
            .blog-content { color: #d4d4d8; line-height: 1.8; }
            .blog-content h1 { font-size: 1.875rem; font-weight: 700; color: #fafafa; margin: 2.5rem 0 1rem; }
            .blog-content h2 { font-size: 1.5rem; font-weight: 600; color: #f4f4f5; margin: 2rem 0 0.75rem; }
            .blog-content h3 { font-size: 1.25rem; font-weight: 600; color: #e4e4e7; margin: 1.5rem 0 0.5rem; }
            .blog-content p { margin: 0.75rem 0; }
            .blog-content ul, .blog-content ol { margin: 0.75rem 0; padding-left: 1.5rem; }
            .blog-content li { margin: 0.25rem 0; }
            .blog-content code { font-size: 0.875rem; background: #18181b; padding: 0.125rem 0.375rem; border-radius: 0.25rem; color: #a1a1aa; }
            .blog-content pre { background: #18181b; border: 1px solid #27272a; border-radius: 0.5rem; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
            .blog-content pre code { background: none; padding: 0; color: #d4d4d8; }
            .blog-content blockquote { border-left: 2px solid rgba(245,158,11,0.4); padding-left: 1rem; margin: 1rem 0; color: #a1a1aa; font-style: italic; }
            .blog-content a { color: #f59e0b; }
            .blog-content strong { color: #f4f4f5; }
            .blog-content hr { border: none; border-top: 1px solid #27272a; margin: 2rem 0; }
            .blog-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.875rem; }
            .blog-content th { text-align: left; padding: 0.5rem; border-bottom: 2px solid #27272a; color: #a1a1aa; }
            .blog-content td { padding: 0.5rem; border-bottom: 1px solid #27272a; }
          `}</style>
        </div>

        {/* Tags */}
        <footer className="px-6 pb-16 border-t border-zinc-800/50 pt-8">
          <div className="max-w-[680px] mx-auto">
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href="/blog"
              className="text-sm text-amber-500 hover:text-amber-400 transition-colors no-underline"
            >
              ← All posts
            </Link>
          </div>
        </footer>
      </article>
    </>
  );
}

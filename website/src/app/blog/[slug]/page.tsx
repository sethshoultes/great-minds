import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, getPost, type Section } from '@/content/posts';

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
      images: post.ogImage ? [post.ogImage] : ['/og-image.svg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: { canonical: url },
  };
}

function renderSection(section: Section, index: number) {
  switch (section.type) {
    case 'paragraph':
      return <p key={index} className="text-zinc-300 leading-[1.8] mb-6">{section.text}</p>;

    case 'heading':
      return <h2 key={index} className="text-2xl font-bold text-zinc-100 mt-12 mb-4">{section.text}</h2>;

    case 'subheading':
      return <h3 key={index} className="text-lg font-semibold text-zinc-200 mt-8 mb-3">{section.text}</h3>;

    case 'code':
      return (
        <pre key={index} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 my-6 overflow-x-auto">
          <code className="text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre">
            {section.code}
          </code>
        </pre>
      );

    case 'quote':
      return (
        <blockquote key={index} className="border-l-2 border-amber-500/40 pl-5 my-8 py-1">
          <p className="text-zinc-300 italic leading-relaxed">{section.text}</p>
          {section.attribution && (
            <cite className="block text-xs text-zinc-500 mt-2 not-italic">— {section.attribution}</cite>
          )}
        </blockquote>
      );

    case 'list':
      return (
        <ul key={index} className="my-6 space-y-2">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-zinc-300 leading-relaxed">
              <span className="text-amber-500 mt-1.5 text-xs">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'callout':
      return (
        <div key={index} className="my-8 p-5 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <p className="text-sm text-zinc-300 leading-relaxed">{section.text}</p>
        </div>
      );

    default:
      return null;
  }
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

        {/* Content */}
        <div className="px-6 pb-20">
          <div className="max-w-[680px] mx-auto text-[1.0625rem]">
            {post.sections.map((section, i) => renderSection(section, i))}
          </div>
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

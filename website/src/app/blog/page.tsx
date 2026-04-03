import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts } from '@/content/posts';

export const metadata: Metadata = {
  title: 'Blog — Great Minds Agency',
  description: 'Technical writing on AI agents, product architecture, and shipping with Claude Code.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col">
      <section className="px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-zinc-500 hover:text-zinc-300 transition-colors no-underline text-sm mb-10"
          >
            ← Home
          </Link>
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Blog
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-zinc-50 mb-4">
            What we learned building it.
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
            Technical writing on AI agent architecture, product design,
            and what happens when nine minds work on one codebase.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto space-y-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block p-6 sm:p-8 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 transition-colors no-underline"
            >
              <div className="flex items-center gap-3 mb-3 text-xs text-zinc-500">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </time>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 group-hover:text-white transition-colors mb-3 leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                {post.description}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-500">
                  By{' '}
                  <span className="text-zinc-400">{post.author}</span>
                </span>
                <div className="flex gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — Great Minds Agency",
  description:
    "Products built by the Great Minds AI agency. Every project starts as a PRD and ships as a working product — debated, built, QA'd, and deployed by 14 AI agents.",
};

const projects = [
  {
    slug: "localgenius",
    name: "LocalGenius",
    badge: "Live",
    tagline: "The AI marketing employee for local businesses.",
    description:
      "Two deployed products. 761 tests. Hybrid AI across five models and two clouds. The first product built by the agency — and the one that proved the model works.",
    tags: ["Next.js", "Vercel", "Neon", "Claude"],
  },
  {
    slug: "dash",
    name: "Dash",
    badge: "Shipped",
    tagline: "Press Cmd+K to Dash. A command palette for WordPress.",
    description:
      "Client-side search in <50ms. Zero dependencies. 26KB. 5 agents debated naming, architecture, and scope — then built a WordPress plugin that makes any admin action reachable in under 3 keystrokes.",
    tags: ["PHP 8", "Vanilla JS", "WordPress", "FULLTEXT"],
  },
  {
    slug: "pinned",
    name: "Pinned",
    badge: "Shipped",
    tagline: "Post-it notes for WordPress admin.",
    description:
      "Team handoff notes that stick. Double-click create, 5 colors, @mentions, note aging, role-based visibility. First project to receive a full 4-member board review.",
    tags: ["PHP 8", "Vanilla JS", "WordPress", "REST API"],
  },
  {
    slug: "great-minds-plugin",
    name: "Great Minds Plugin",
    badge: "Live",
    tagline: "14 Agents, One Install.",
    description:
      "The Claude Code plugin that powers the entire agency. Worktree isolation, decoupled crons, GSD integration, and a board of directors. Install it and drop in a PRD.",
    tags: ["Claude Code", "Git Worktrees", "Crons", "Agent Tool"],
  },
  {
    slug: "shipyard-ai",
    name: "Shipyard AI",
    badge: "Live",
    tagline: "An Entire Company, Spun Up by Agents.",
    description:
      "A separate company on DigitalOcean building Emdash sites from PRDs. Own domain, own repo, 4 crons, Cloudflare Pages, Resend transactional email. Zero human ops.",
    tags: ["DigitalOcean", "Cloudflare", "Emdash", "Resend"],
  },
];

export default function WorkPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-zinc-500 hover:text-zinc-300 transition-colors no-underline text-sm mb-10"
          >
            ← Home
          </Link>

          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-6">
            Shipped Projects
          </p>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-zinc-50 mb-4">
            Work
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Every project starts as a PRD and ships as a working product —
            debated, built, QA&apos;d, and deployed by the agency in a single
            session.
          </p>
        </div>
      </section>

      {/* Project grid */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="group p-6 rounded-xl border border-zinc-800/60 bg-zinc-900/30 hover:border-zinc-700 transition-colors no-underline"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-bold text-zinc-100 group-hover:text-amber-500 transition-colors">
                    {p.name}
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                    {p.badge}
                  </span>
                </div>
                <p className="text-amber-500/80 text-sm font-medium mb-3">
                  {p.tagline}
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed mb-4">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-amber-500 text-sm group-hover:text-amber-400 transition-colors">
                  View project →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-zinc-800/50 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-4">
            Your PRD could be next.
          </h2>
          <p className="text-zinc-400 mb-10">
            Write a clear requirements document. Drop it in. The agency debates,
            plans, builds, reviews, and ships.
          </p>
          <Link
            href="/install"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 transition-colors no-underline"
          >
            Submit a PRD →
          </Link>
        </div>
      </section>
    </div>
  );
}

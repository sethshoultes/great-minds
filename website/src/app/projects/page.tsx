import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Great Minds Agency",
  description: "Full-stack products shipped by Great Minds. Built from PRD to production.",
};

const projects = [
  {
    name: "LocalGenius",
    tagline: "The AI marketing employee for local businesses.",
    status: "Live",
    slug: "localgenius",
    description:
      "Two production products built from a single PRD in one session. The main product runs on Vercel with Neon PostgreSQL. The managed sites platform runs on Cloudflare with D1 and R2. Hybrid AI architecture across five models and two clouds. AI cost at 1.2% of revenue.",
    stats: [
      { value: "736", label: "Tests" },
      { value: "166", label: "Source files" },
      { value: "1.2%", label: "AI cost" },
      { value: "0", label: "TS errors" },
    ],
    stack: [
      "Next.js",
      "Vercel",
      "Neon PostgreSQL",
      "Claude API",
      "Astro",
      "Cloudflare Workers",
      "D1",
      "R2",
      "Workers AI",
    ],
    urls: {
      app: "https://localgenius.company",
      sites: "https://localgenius-sites.pages.dev",
    },
  },
];

export default function ProjectsPage() {
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
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Work
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-zinc-50 mb-6">
            What we&apos;ve built.
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Every project listed here went from PRD to deployed product. Not a
            prototype. Not a design mock. A live product with real users, real
            infrastructure, and real tests.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="px-6 pb-24 border-t border-zinc-800/50 pt-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project.name}
                className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 overflow-hidden hover:border-zinc-700 transition-colors"
              >
                <div className="p-8 sm:p-10">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100">
                        {project.name}
                      </h2>
                      <p className="text-amber-500 font-medium mt-1">
                        {project.tagline}
                      </p>
                    </div>
                    <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      {project.status}
                    </span>
                  </div>

                  <p className="text-zinc-400 leading-relaxed mb-8">
                    {project.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 py-7 border-y border-zinc-800/50 mb-8">
                    {project.stats.map((s) => (
                      <div key={s.label}>
                        <div className="text-2xl sm:text-3xl font-bold text-zinc-50 font-mono tracking-tight">
                          {s.value}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stack */}
                  <div className="mb-8">
                    <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-3">
                      Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/work/${project.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-zinc-950 text-sm font-semibold hover:bg-amber-400 transition-colors no-underline"
                    >
                      Read case study →
                    </Link>
                    <a
                      href={project.urls.app}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-500 transition-colors no-underline"
                    >
                      Live app ↗
                    </a>
                    <a
                      href={project.urls.sites}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-sm font-medium hover:border-zinc-500 transition-colors no-underline"
                    >
                      Sites demo ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More coming */}
          <div className="mt-12 p-8 rounded-xl border border-dashed border-zinc-800 text-center">
            <p className="text-zinc-500 text-sm mb-2">
              Next project begins with the next PRD.
            </p>
            <Link
              href="/install"
              className="text-amber-500 hover:text-amber-400 text-sm transition-colors no-underline"
            >
              Submit yours →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

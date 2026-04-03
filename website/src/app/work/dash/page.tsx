import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dash Case Study — Great Minds Agency",
  description:
    "A Cmd+K command palette for WordPress admin. Debated, built, and QA'd in one session by 5 AI agents. 10 files. 2,200 lines. <50ms search.",
};

const toplineStats = [
  { value: "2,200", label: "Lines of code", sub: "10 files" },
  { value: "<50ms", label: "Client-side search", sub: "zero server calls" },
  { value: "54+", label: "Items indexed", sub: "posts, pages, settings, plugins" },
  { value: "26KB", label: "Plugin zip", sub: "0 dependencies" },
  { value: "5", label: "Agents involved", sub: "2 directors + 3 specialists" },
  { value: "4/4", label: "Critical bugs caught", sub: "by Margaret Hamilton QA" },
];

const timeline = [
  {
    phase: "Debate",
    rounds: "1–2",
    summary:
      'Steve pushed for a product with soul — three interaction modes, non-blocking animation, dark-first design, and a name that becomes a verb. Elon pushed for a client-side search index, AJAX over REST, WordPress filters over custom APIs, and a two-week ship timeline. They argued about animations, dark mode, and whether "Go mode" was scope creep.',
    decision:
      'Name: "Dash." Architecture: client-side JSON index + AJAX fallback. Three modes: search, command (>), user (@). Non-blocking animation. CSS custom properties for dark mode. Vanilla JS, zero dependencies.',
  },
  {
    phase: "Build",
    rounds: "3–4",
    summary:
      "Steve built the entire frontend in one pass — modal, keyboard navigation, 3-mode router, ARIA accessibility, client-side search engine with scoring. Elon built the PHP backend in parallel — search index builder, AJAX handlers, commands registry, developer filter API, WP-CLI commands. No coordination needed — they worked from the same decisions.md.",
    decision:
      "Frontend: 622 lines JS + 360 lines CSS. Backend: 6 PHP classes totaling 1,600+ lines. Both committed to separate feature branches. Zero merge conflicts.",
  },
  {
    phase: "QA",
    rounds: "5",
    summary:
      "Margaret Hamilton found 4 critical integration bugs — all contract mismatches between frontend and backend (wrong AJAX action names, global variable mismatch, nonce parameter inconsistency). Jensen Huang flagged an architectural risk: the index rebuild did 20K+ individual DB queries at scale. Phil Jackson caught a fifth mismatch during merge.",
    decision:
      "All 4 critical bugs fixed. Batched index rebuild. Nonce params normalized. Re-review passed. Jensen: GO. Margaret: GO.",
  },
  {
    phase: "Ship",
    rounds: "6",
    summary:
      "Branches merged cleanly. Plugin zip built. Tested on live WordPress 6.9.4 with MemberPress. Found and fixed: WP core palette conflict (Cmd+K collision), dark-on-dark input text, empty URLs for custom post types, missing plugin admin page indexing. Each bug found by real testing, fixed in minutes.",
    decision:
      "26KB zip. WordPress.org ready. Admin menu pages indexed dynamically. MemberPress, WooCommerce, and any plugin's pages searchable out of the box.",
  },
];

const architecture = [
  {
    layer: "Client-Side Search",
    stack: ["Vanilla JS", "JSON Index", "Prefix Match", "Keyword Scoring"],
    role: "Pre-built search index serialized as compressed JSON. Searched entirely in the browser for <50ms results on 95% of sites.",
  },
  {
    layer: "Server Fallback",
    stack: ["admin-ajax.php", "FULLTEXT Index", "WP_Query", "WP_User_Query"],
    role: "AJAX fallback for large sites (>5K items) or stale index. Capability-aware, nonce-verified.",
  },
  {
    layer: "Index Builder",
    stack: ["Custom Table", "Batched Rebuild", "Real-time Hooks", "Hourly Cron"],
    role: "wp_dash_index table with FULLTEXT. Indexes posts, pages, CPTs, settings, admin menu pages, and quick actions.",
  },
  {
    layer: "Developer API",
    stack: ["dash_commands Filter", "dash_search_results Filter", "CustomEvent", "WP-CLI"],
    role: "WordPress-native filter API. Zero learning curve for plugin developers. Programmatic trigger via JS events.",
  },
];

const deliverables = [
  {
    name: "Command Bar UI",
    desc: "Modal overlay with Cmd+K trigger, keyboard navigation, non-blocking animation, dark mode via CSS custom properties, ARIA accessibility.",
    agent: "Steve Jobs (Frontend)",
  },
  {
    name: "Search Index Engine",
    desc: "Custom MySQL table with FULLTEXT indexing. Batched rebuild (500 posts/batch). Real-time hooks on save/delete. Client-side JSON serialization.",
    agent: "Elon Musk (Backend)",
  },
  {
    name: "3-Mode Router",
    desc: "Default search, > for commands, @ for user lookup. Six lines of JS that separate a search box from an operating system.",
    agent: "Steve Jobs + Elon Musk",
  },
  {
    name: "Developer Filter API",
    desc: "dash_commands and dash_search_results filters. Any WordPress plugin can register commands in 5 lines of code.",
    agent: "Elon Musk (Backend)",
  },
  {
    name: "Admin Menu Indexer",
    desc: "Crawls all registered admin menu/submenu pages. MemberPress, WooCommerce, Yoast — any plugin's pages are searchable automatically.",
    agent: "Phil Jackson (Integration Fix)",
  },
  {
    name: "QA Report + Architecture Review",
    desc: "Margaret Hamilton found 4 critical bugs. Jensen Huang identified 3 architectural risks. All resolved before ship.",
    agent: "Margaret Hamilton + Jensen Huang",
  },
];

export default function DashCaseStudy() {
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

          <div className="flex items-center gap-3 mb-6">
            <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase">
              Case Study
            </p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              Shipped
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-zinc-50 mb-4">
            Dash
          </h1>
          <p className="text-xl sm:text-2xl text-amber-500 font-medium mb-6">
            Press Cmd+K to Dash. A command palette for WordPress.
          </p>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-10">
            Built from PRD to shipping plugin in one agency session. Five agents
            debated naming, architecture, and scope — then built a zero-dependency
            WordPress plugin that makes any admin action reachable in under 3
            keystrokes.
          </p>

          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-zinc-950 text-sm font-semibold">
              WordPress Plugin — 26KB
            </span>
            <a
              href="https://github.com/sethshoultes/great-minds"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-500 transition-colors no-underline"
            >
              Source on GitHub ↗
            </a>
          </div>
        </div>
      </section>

      {/* Topline numbers */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-10">
            By the numbers
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {toplineStats.map((s) => (
              <div key={s.label}>
                <div className="text-4xl sm:text-5xl font-bold text-zinc-50 font-mono tracking-tight">
                  {s.value}
                </div>
                <div className="text-sm text-zinc-400 mt-1.5 font-medium">
                  {s.label}
                </div>
                <div className="text-xs text-zinc-600 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The story — timeline */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            The build
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 mb-2">
            One session. Four phases.
          </h2>
          <p className="text-zinc-500 mb-12 leading-relaxed">
            Two creative directors. One orchestrator. Two QA specialists. Zero humans writing code.
          </p>

          <div className="space-y-4">
            {timeline.map((t) => (
              <div
                key={t.phase}
                className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 overflow-hidden"
              >
                <div className="px-7 py-6">
                  <div className="flex items-baseline gap-3 mb-4">
                    <h3 className="text-lg font-bold text-zinc-100">
                      {t.phase}
                    </h3>
                    <span className="font-mono text-xs text-zinc-600">
                      Round{t.rounds.includes("–") ? "s" : ""} {t.rounds}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-5">
                    {t.summary}
                  </p>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-800/40 border border-zinc-700/40">
                    <span className="text-amber-500 text-xs font-bold uppercase tracking-wider font-mono mt-0.5 flex-shrink-0">
                      Decision
                    </span>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {t.decision}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Architecture
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 mb-4">
            Client-side first. Server when needed.
          </h2>
          <p className="text-zinc-500 mb-12 leading-relaxed max-w-2xl">
            The core insight: ship the search index as JSON and search entirely
            in the browser. 95% of WordPress sites have fewer than 5,000
            searchable items. For those sites, the server is never called.
            Result: &lt;50ms search, every time, regardless of hosting.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {architecture.map((a) => (
              <div
                key={a.layer}
                className="p-6 rounded-xl border border-zinc-800/50 bg-zinc-900/30"
              >
                <h3 className="font-bold text-zinc-100 mb-1">{a.layer}</h3>
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                  {a.role}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {a.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Deliverables
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 mb-12">
            What the agency produced.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {deliverables.map((d, i) => (
              <div
                key={d.name}
                className="p-6 rounded-xl border border-zinc-800/50 bg-zinc-900/30"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="font-mono text-xs text-amber-500/50 font-bold mt-0.5 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-semibold text-zinc-100 text-sm">
                    {d.name}
                  </h3>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed mb-3">
                  {d.desc}
                </p>
                <p className="text-zinc-600 text-xs font-mono">{d.agent}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The lesson */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
            <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
              What we learned
            </p>
            <div className="grid sm:grid-cols-3 gap-8">
              <div>
                <p className="font-semibold text-zinc-100 text-sm mb-2">
                  Parallel builds need contract tests.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Steve and Elon built frontend and backend simultaneously with
                  zero coordination. All 4 critical bugs were integration
                  mismatches. A shared contract file would have prevented every
                  one.
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-100 text-sm mb-2">
                  The orchestrator catches what agents miss.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Phil Jackson found a fifth integration bug during merge that
                  neither Steve, Elon, nor Margaret caught. The person who sees
                  both sides of the seam spots the gap.
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-100 text-sm mb-2">
                  Real testing beats unit tests.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  The WP core palette collision, dark-on-dark text, and empty
                  MemberPress URLs were only found by running the plugin on a
                  real site. Playwright caught what static analysis never could.
                </p>
              </div>
            </div>
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
            plans, builds, reviews, and ships. You get the product.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/install"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 transition-colors no-underline"
            >
              Submit a PRD →
            </Link>
            <Link
              href="/work/localgenius"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:border-zinc-500 transition-colors no-underline"
            >
              LocalGenius case study
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

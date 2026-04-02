import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LocalGenius Case Study — Great Minds Agency",
  description:
    "PRD to production in one session. 736 tests. 1.2% AI cost. Two live products. This is what Great Minds ships.",
};

const toplineStats = [
  { value: "736", label: "Tests passing", sub: "0 skipped" },
  { value: "166", label: "Source files", sub: "25,735 lines" },
  { value: "1.2%", label: "AI cost of revenue", sub: "across all models" },
  { value: "0", label: "TypeScript errors", sub: "0 ESLint errors" },
  { value: "5", label: "AI models", sub: "2 clouds" },
  { value: "23/23", label: "Services tested", sub: "0 vulnerabilities" },
];

const timeline = [
  {
    phase: "Debate",
    rounds: "1–2",
    summary:
      "Steve pushed for a dead-simple dashboard — one screen, one action. Elon pushed for a multi-tenant architecture that could support 10,000 businesses on day one. They argued about whether AI cost should be fixed per seat or metered per usage. Marcus mediated. The decisions locked.",
    decision:
      "Hybrid pricing model. Simple UX with powerful infrastructure underneath. AI cost as metered percentage of revenue, not fixed overhead.",
  },
  {
    phase: "Plan",
    rounds: "3",
    summary:
      "Six sub-agent teams defined. Steve hired a designer, a copywriter, and a brand strategist. Elon hired a market analyst, a growth strategist, and a systems architect. Each agent received a brief with specific inputs, outputs, and a quality bar they couldn't negotiate around.",
    decision:
      "Two separate products: LocalGenius (Next.js on Vercel) and LocalGenius Sites (Astro on Cloudflare). Separate codebases, shared AI layer.",
  },
  {
    phase: "Build",
    rounds: "4–8",
    summary:
      "Sub-agents executed in parallel. The engineer built the core product while the architect designed the Sites infrastructure. The designer produced the brand guide while the copywriter drafted all marketing copy. Directors intervened twice when output drifted.",
    decision:
      "Hybrid AI architecture finalized: Claude (primary) + GPT-4o (fallback) + Workers AI (edge inference). Cost optimized to 1.2% of revenue.",
  },
  {
    phase: "Review",
    rounds: "9",
    summary:
      "Steve audited every UI screen for taste. Rejected the first dashboard iteration — too busy. The second was clean enough to ship. Elon reviewed the architecture and flagged one security concern with the session token storage. Jensen reviewed the AI cost model and approved it.",
    decision:
      "17 revisions across 5 deliverable areas. Dashboard redesigned once. Auth flow hardened. All quality gates passed.",
  },
  {
    phase: "Ship",
    rounds: "10",
    summary:
      "Both products deployed to production. CI/CD configured. 736 tests passing. Zero TypeScript errors. Zero ESLint errors. Joint summary written. Memory updated. The agency remembered what it learned.",
    decision:
      "localgenius.company live on Vercel. localgenius-sites.pages.dev live on Cloudflare. Full CI/CD pipeline. Agency returned to idle.",
  },
];

const architecture = [
  {
    layer: "Main Product",
    stack: ["Next.js 15", "Vercel", "Neon PostgreSQL", "Drizzle ORM"],
    role: "The core application — dashboards, onboarding, billing, AI orchestration.",
  },
  {
    layer: "Managed Sites",
    stack: ["Astro", "Cloudflare Pages", "Cloudflare D1", "Cloudflare R2", "Workers AI"],
    role: "Client-facing websites deployed and managed per local business.",
  },
  {
    layer: "AI Layer",
    stack: ["Claude 3.5 Sonnet", "GPT-4o", "Workers AI (Llama)", "OpenRouter"],
    role: "Hybrid inference: Claude primary, GPT-4o fallback, Workers AI for edge cost reduction.",
  },
  {
    layer: "Infrastructure",
    stack: ["GitHub Actions", "Vercel CI/CD", "Cloudflare Workers", "Stripe"],
    role: "Deployment, payments, edge routing, and background jobs.",
  },
];

const deliverables = [
  {
    name: "Product Design Vision",
    desc: "Complete UX specification for both products. Information architecture, interaction patterns, component library guidance.",
    agent: "Designer (Steve's team)",
  },
  {
    name: "Brand Guide",
    desc: "Identity system, color palette, typography, voice and tone, logo usage. Applied to both products consistently.",
    agent: "Brand Strategist (Steve's team)",
  },
  {
    name: "Customer Personas",
    desc: "Three primary personas: the independent restaurateur, the multi-location retailer, and the local service provider. Jobs-to-be-done for each.",
    agent: "Market Analyst (Elon's team)",
  },
  {
    name: "Marketing Messaging",
    desc: "Full messaging framework. Homepage copy, email sequences, ad creative briefs, pitch positioning.",
    agent: "Copywriter (Steve's team)",
  },
  {
    name: "Sales Demo Script",
    desc: "Five-minute live demo flow. Talking points for each feature. Objection handling. Pricing conversation guide.",
    agent: "Growth Strategist (Elon's team)",
  },
  {
    name: "Built Product",
    desc: "Two production apps. 736 passing tests. Full CI/CD. Real infrastructure. Real AI. Real billing.",
    agent: "Engineer (Elon's team) + all directors",
  },
];

export default function LocalGeniusCaseStudy() {
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
              Live
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-zinc-50 mb-4">
            LocalGenius
          </h1>
          <p className="text-xl sm:text-2xl text-amber-500 font-medium mb-6">
            The AI marketing employee for local businesses.
          </p>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-10">
            Built from PRD to production in one agency session. Two deployed
            products. Real users. A hybrid AI architecture across five models
            and two clouds. AI cost running at 1.2% of revenue.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://localgenius.company"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-zinc-950 text-sm font-semibold hover:bg-amber-400 transition-colors no-underline"
            >
              localgenius.company ↗
            </a>
            <a
              href="https://localgenius-sites.pages.dev"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-500 transition-colors no-underline"
            >
              Managed Sites ↗
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
            One session. Five phases.
          </h2>
          <p className="text-zinc-500 mb-12 leading-relaxed">
            This is not a summary. This is what actually happened.
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
            Hybrid AI across two clouds.
          </h2>
          <p className="text-zinc-500 mb-12 leading-relaxed max-w-2xl">
            The core insight: don&apos;t pick one AI model. Route intelligently across
            models by task type and cost. Primary inference on Claude, fallback to
            GPT-4o, edge inference on Workers AI. Net cost: 1.2% of revenue.
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
                  The debate is not theater.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Steve and Elon disagreed on pricing in round one. The argument
                  lasted three rounds. The resolution — metered AI cost as a
                  percentage of revenue — is the reason the unit economics work.
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-100 text-sm mb-2">
                  Parallel beats sequential.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Six sub-agents running simultaneously compressed what would have
                  been weeks of sequential handoffs into a single session. The
                  bottleneck was review, not build.
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-100 text-sm mb-2">
                  Memory compounds.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  The agency updated its memory after this project. The patterns
                  learned — AI cost optimization, hybrid cloud routing, the review
                  bottleneck — are available to every future project automatically.
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
              href="/how"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:border-zinc-500 transition-colors no-underline"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

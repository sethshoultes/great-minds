import Link from "next/link";

const stats = [
  { value: "736", label: "Tests passing" },
  { value: "1.2%", label: "AI cost of revenue" },
  { value: "5", label: "AI models, 2 clouds" },
  { value: "0", label: "TypeScript errors" },
];

const tension = [
  {
    voice: "Steve",
    color: "text-orange-400",
    border: "border-orange-500/20",
    bg: "bg-orange-500/5",
    statement:
      "This has to be beautiful first. Speed means nothing if people don't feel something the moment they see it.",
  },
  {
    voice: "Elon",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    statement:
      "Beautiful is a byproduct of correct. Get the architecture right, compress the timeline, ship before it's perfect.",
  },
];

const pipeline = [
  {
    step: "01",
    name: "Debate",
    desc: "Steve and Elon stake independent positions across all six deliverable areas. No deference. The best argument wins.",
  },
  {
    step: "02",
    name: "Plan",
    desc: "Directors converge. Marcus mediates. Decisions lock. Sub-agent teams get defined with clear inputs, outputs, and quality bars.",
  },
  {
    step: "03",
    name: "Build",
    desc: "Sub-agents execute in parallel — code, design, copy, tests, architecture. Directors supervise and intervene when standards slip.",
  },
  {
    step: "04",
    name: "Review",
    desc: "Steve audits for taste. Elon audits for correctness. Jensen provides board-level perspective. Nothing ships that neither would sign.",
  },
  {
    step: "05",
    name: "Ship",
    desc: "Production deployment. Memory updated. The agency gets smarter. Ready for the next PRD.",
  },
];

const deliverables = [
  "Product design vision",
  "Brand guide & identity",
  "Customer personas",
  "Marketing messaging",
  "Engineering specification",
  "Built, deployed product",
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="px-6 pt-28 pb-24 sm:pt-40 sm:pb-32">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-6">
            AI Agency — Austin, TX
          </p>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05] text-zinc-50">
            Drop in a PRD.
            <br />
            <span className="text-zinc-500">Get back a product.</span>
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Great Minds is an AI agency powered by iconic business minds. Steve
            Jobs and Elon Musk debate your strategy. Marcus Aurelius moderates.
            Jensen Huang advises the board. Sub-agents build. You ship.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/install"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-amber-500 text-zinc-950 font-semibold text-sm hover:bg-amber-400 transition-colors no-underline"
            >
              Submit a PRD
              <span className="text-amber-800">→</span>
            </Link>
            <Link
              href="/work/localgenius"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-zinc-700 text-zinc-300 font-medium text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors no-underline"
            >
              See what we built
            </Link>
          </div>
        </div>
      </section>

      {/* The Tension — this is the brand story */}
      <section className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Why it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4 leading-tight">
            Taste versus physics.
            <br />
            <span className="text-zinc-500">The tension is the product.</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mb-12 leading-relaxed">
            Most teams agree too quickly. Steve and Elon don&apos;t. They debate
            every major decision — design, positioning, architecture, go-to-market
            — and that friction produces clarity that consensus never could.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {tension.map((t) => (
              <div
                key={t.voice}
                className={`p-6 rounded-xl border ${t.border} ${t.bg}`}
              >
                <p
                  className={`font-mono text-xs font-semibold tracking-widest uppercase mb-4 ${t.color}`}
                >
                  [{t.voice}]
                </p>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  &ldquo;{t.statement}&rdquo;
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-zinc-500 italic">
            Marcus Aurelius mediates. The better argument wins.
          </p>
        </div>
      </section>

      {/* Pipeline */}
      <section className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            The process
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-12 leading-tight">
            Five phases. One session.
          </h2>
          <div className="space-y-0">
            {pipeline.map((phase, i) => (
              <div key={phase.step} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-zinc-700 group-hover:border-amber-500/50 flex items-center justify-center transition-colors">
                    <span className="font-mono text-xs text-amber-500 font-bold">
                      {phase.step}
                    </span>
                  </div>
                  {i < pipeline.length - 1 && (
                    <div className="w-px flex-1 bg-zinc-800 my-2" />
                  )}
                </div>
                <div className={`pb-8 ${i === pipeline.length - 1 ? "" : ""}`}>
                  <h3 className="font-semibold text-zinc-100 mt-2">
                    {phase.name}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                    {phase.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/how"
              className="text-sm text-amber-500 hover:text-amber-400 transition-colors no-underline"
            >
              How it really works →
            </Link>
          </div>
        </div>
      </section>

      {/* Proof — LocalGenius */}
      <section className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            First project
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4 leading-tight">
            LocalGenius. PRD to production
            <br />
            <span className="text-zinc-500">in one session.</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mb-12 leading-relaxed">
            The AI marketing employee for local businesses. Two deployed products.
            Real users. Real revenue model. Built start-to-finish by Great Minds
            while you watched.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl sm:text-5xl font-bold text-zinc-50 font-mono tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-zinc-500 mt-2 leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/work/localgenius"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors no-underline"
            >
              Read the case study →
            </Link>
            <a
              href="https://localgenius.company"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-500 text-sm font-medium hover:border-zinc-500 hover:text-zinc-300 transition-colors no-underline"
            >
              localgenius.company
              <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Every engagement
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-12 leading-tight">
            Six deliverables. Plus the thing itself.
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {deliverables.map((d, i) => (
              <div
                key={d}
                className="flex items-center gap-4 px-5 py-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50"
              >
                <span className="font-mono text-xs text-amber-500/60 font-bold w-5 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-zinc-300 text-sm font-medium">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 border-t border-zinc-800/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 leading-tight">
            Ready to build
            <br />
            something insanely great?
          </h2>
          <p className="text-zinc-400 mt-5 text-lg">
            Write a PRD. Drop it in. The agency will handle the rest.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/install"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 transition-colors no-underline"
            >
              Submit a PRD →
            </Link>
            <Link
              href="/team"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors no-underline"
            >
              Meet the team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

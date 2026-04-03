import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a PRD — Great Minds Agency",
  description:
    "How to engage Great Minds. Write a PRD, submit it, and the agency debates, builds, and ships your product.",
};

const whatYouGet = [
  {
    number: "01",
    name: "Product Design Vision",
    desc: "Clear product direction informed by first-principles thinking and systems design. Not a wireframe — a statement of what the product is and why it works.",
  },
  {
    number: "02",
    name: "Brand Guide & Identity",
    desc: "Visual language, color system, typography, voice and tone. Consistent across every surface — app, marketing, documentation.",
  },
  {
    number: "03",
    name: "Customer Personas",
    desc: "Real personas with jobs-to-be-done, not demographic summaries. Built from the debate, not from focus groups.",
  },
  {
    number: "04",
    name: "Marketing Messaging",
    desc: "Full messaging framework. Homepage copy, positioning, email sequences, ad briefs. The story that sells the product.",
  },
  {
    number: "05",
    name: "Engineering Specification",
    desc: "Architecture, API design, database schema, deployment topology. A spec an engineer can execute without a meeting.",
  },
  {
    number: "06",
    name: "Built, Deployed Product",
    desc: "The thing itself. Production deployed. Tests passing. CI/CD configured. Not a prototype — a product.",
  },
];

const installSteps = [
  {
    step: "1",
    title: "Install the plugin",
    body: "Add Great Minds to Claude Code. One command.",
    code: "claude plugins install great-minds",
  },
  {
    step: "2",
    title: "Open a new project",
    body: "Start a session in your project directory. The agency initializes from BOOTSTRAP.md and enters idle state.",
    code: null,
  },
  {
    step: "3",
    title: "Drop in a PRD",
    body: "Write your product requirements document — what you're building, who it's for, what success looks like. Save it to prds/ and tell the agency to begin.",
    code: null,
  },
  {
    step: "4",
    title: "Watch it work",
    body: "Steve and Elon debate. Marcus mediates. Sub-agents build. You can follow the debate in rounds/ and monitor STATUS.md in real time.",
    code: null,
  },
];

const prdGuidance = [
  "What you're building and for whom",
  "What problem it solves that existing solutions don't",
  "Who the primary user is — describe them concretely",
  "What success looks like at 30, 90, and 365 days",
  "What you already know — constraints, existing tech, must-haves",
  "What you don't know — open questions you want the agency to resolve",
];

export default function InstallPage() {
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
            Get started
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-zinc-50 mb-6">
            Submit a PRD.
            <br />
            <span className="text-zinc-500">Get back a product.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            The agency engages through a product requirements document. Write
            what you&apos;re building and why. The debate begins. Your job is to be
            available if the agency gets blocked. Everything else is ours.
          </p>
        </div>
      </section>

      {/* Install */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-10">
            Setup
          </p>
          <div className="space-y-4">
            {installSteps.map((s) => (
              <div
                key={s.step}
                className="flex gap-6 p-7 rounded-xl border border-zinc-800/50 bg-zinc-900/30"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-full border border-zinc-700 flex items-center justify-center">
                  <span className="font-mono text-xs text-amber-500 font-bold">
                    {s.step}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-100 mb-1">{s.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                    {s.body}
                  </p>
                  {s.code && (
                    <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-sm">
                      <span className="text-zinc-600">$</span>
                      <code className="text-amber-400">{s.code}</code>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Manual config */}
          <div className="mt-6 p-6 rounded-xl border border-zinc-800/40 bg-zinc-900/20">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">
              Or configure manually
            </p>
            <p className="text-sm text-zinc-500 mb-4">
              Add to your Claude Code settings:
            </p>
            <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm font-mono text-zinc-300 overflow-x-auto">
              {`{\n  "plugins": ["great-minds"]\n}`}
            </pre>
            <p className="text-xs text-zinc-600 mt-3">
              See the full reference at{" "}
              <a
                href="https://github.com/sethshoultes/great-minds"
                target="_blank"
                rel="noopener"
                className="text-zinc-500 hover:text-zinc-400 no-underline transition-colors"
              >
                github.com/sethshoultes/great-minds
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Submit a PRD flow */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            The PRD Process
          </p>
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">
            What happens when you submit.
          </h2>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed max-w-2xl">
            Your PRD enters the five-phase pipeline. The agency doesn't build until the strategy is locked. This is what you can expect:
          </p>
          <div className="space-y-3">
            <div className="flex gap-4 p-5 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
              <span className="text-amber-500 font-mono text-sm font-bold flex-shrink-0 mt-0.5">Round 1–2:</span>
              <p className="text-sm text-zinc-300"><strong>Debate.</strong> Steve and Elon read your PRD independently, form positions across all deliverable areas, then challenge each other. No consensus — just the best arguments.</p>
            </div>
            <div className="flex gap-4 p-5 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
              <span className="text-amber-500 font-mono text-sm font-bold flex-shrink-0 mt-0.5">Round 3:</span>
              <p className="text-sm text-zinc-300"><strong>Plan.</strong> Marcus mediates conflicts. Decisions lock. Sub-agent teams get assigned with clear mandates and quality gates.</p>
            </div>
            <div className="flex gap-4 p-5 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
              <span className="text-amber-500 font-mono text-sm font-bold flex-shrink-0 mt-0.5">Round 4–8:</span>
              <p className="text-sm text-zinc-300"><strong>Build.</strong> Sub-agents execute in parallel. Design, engineering, copy, brand — all shipping to deliverables/drafts/. You watch in real time.</p>
            </div>
            <div className="flex gap-4 p-5 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
              <span className="text-amber-500 font-mono text-sm font-bold flex-shrink-0 mt-0.5">Round 9:</span>
              <p className="text-sm text-zinc-300"><strong>Review.</strong> Steve audits for taste and craft. Elon audits for feasibility and accuracy. Revisions go back with specific feedback — not vague notes.</p>
            </div>
            <div className="flex gap-4 p-5 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
              <span className="text-amber-500 font-mono text-sm font-bold flex-shrink-0 mt-0.5">Round 10:</span>
              <p className="text-sm text-zinc-300"><strong>Ship.</strong> Production deployed. Learnings logged to memory. The agency compounds. You get all six deliverables in final/ ready to use.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to write a PRD */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Writing a PRD
          </p>
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">
            What a good PRD includes.
          </h2>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed max-w-2xl">
            The agency debates your PRD before reading anything else. Vague PRDs
            produce vague products. Specific PRDs produce specific, well-argued
            decisions. Here is what to cover:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {prdGuidance.map((g, i) => (
              <div
                key={g}
                className="flex items-start gap-3 p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/40"
              >
                <span className="font-mono text-xs text-amber-500/50 font-bold mt-0.5 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-zinc-300">{g}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-zinc-600 italic">
            See{" "}
            <a
              href="https://github.com/sethshoulters/great-minds/blob/main/prds/"
              target="_blank"
              rel="noopener"
              className="text-zinc-500 hover:text-zinc-400 no-underline transition-colors"
            >
              prds/ in the repo
            </a>{" "}
            for the LocalGenius PRD as a reference.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Deliverables
          </p>
          <h2 className="text-2xl font-bold text-zinc-100 mb-10">
            What every engagement produces.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {whatYouGet.map((d) => (
              <div
                key={d.name}
                className="p-6 rounded-xl border border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="font-mono text-xs text-amber-500/50 font-bold mt-0.5 flex-shrink-0">
                    {d.number}
                  </span>
                  <h3 className="font-semibold text-zinc-100 text-sm">
                    {d.name}
                  </h3>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed pl-6">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-xl border border-amber-500/10 bg-amber-500/5">
            <p className="text-amber-400 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
              Proof of work
            </p>
            <p className="text-zinc-100 font-semibold mb-2">
              LocalGenius shipped in one session.
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              736 tests. 166 source files. Two live products. A hybrid AI
              architecture across five models and two clouds. AI cost at 1.2% of
              revenue. This is what the agency ships when given a clear PRD.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/work/localgenius"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-500 transition-colors no-underline"
              >
                Read the case study →
              </Link>
              <a
                href="https://localgenius.company"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-500 text-sm hover:border-zinc-500 hover:text-zinc-300 transition-colors no-underline"
              >
                Live product ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 border-t border-zinc-800/50 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-100 mb-4">
            Ready to begin?
          </h2>
          <p className="text-zinc-400 mb-2">
            Install the plugin. Write your PRD. The agency takes it from there.
          </p>
          <p className="text-zinc-600 text-sm mb-10">
            Questions? Open an issue on{" "}
            <a
              href="https://github.com/sethshoultes/great-minds"
              target="_blank"
              rel="noopener"
              className="text-zinc-500 hover:text-zinc-400 no-underline transition-colors"
            >
              GitHub
            </a>
            .
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-base">
            <span className="text-zinc-600">$</span>
            <code className="text-amber-400">claude plugins install great-minds</code>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Work — Great Minds Agency",
  description:
    "The five-phase pipeline from PRD to production. Debate, plan, build, review, ship.",
};

const phases = [
  {
    number: "01",
    name: "Debate",
    tagline: "Tension before consensus.",
    duration: "Rounds 1–2",
    agents: ["Steve Jobs", "Elon Musk"],
    desc: "Steve and Elon read the PRD independently and form positions across all six deliverable areas: product design, brand, customer personas, marketing, go-to-market, and engineering. They stake these positions without coordination. Then they challenge each other. No deference. The point is to surface every real disagreement before a line of code is written.",
    outputs: [
      "Independent position statements per deliverable area",
      "Challenge rounds logged in rounds/",
      "Strategic disagreements surfaced and argued",
    ],
    why: "Agencies that agree too quickly ship mediocrity. Real disagreement between high-standard collaborators produces decisions that survive contact with reality.",
  },
  {
    number: "02",
    name: "Plan",
    tagline: "Decisions lock. Teams get hired.",
    duration: "Round 3",
    agents: ["Steve Jobs", "Elon Musk", "Marcus Aurelius"],
    desc: "Directors converge. Marcus mediates any unresolved conflicts and formally logs the locked decisions. Steve defines his sub-agent team (designer, copywriter, brand strategist). Elon defines his (market analyst, growth strategist, engineer). Each agent gets specific inputs, outputs, and a quality bar they can't dodge.",
    outputs: [
      "Locked decisions document",
      "Agent definitions in team/",
      "Sub-agent assignments with clear inputs and quality gates",
    ],
    why: "Ambiguous mandates produce ambiguous output. Every agent knows exactly what they own and what done looks like.",
  },
  {
    number: "03",
    name: "Build",
    tagline: "Parallel execution. No hand-holding.",
    duration: "Rounds 4–8",
    agents: ["Sub-agents", "Steve Jobs", "Elon Musk"],
    desc: "Sub-agents execute their assignments in parallel. Each reads the PRD, the locked decisions, and their role definition. Output goes to deliverables/{project}/drafts/. Directors can intervene if output drifts from strategy. Blockers surface in STATUS.md — the agency doesn't silently fail.",
    outputs: [
      "Design specifications",
      "Codebase with tests",
      "Copy, messaging, brand guide",
      "Engineering specs and architecture",
    ],
    why: "The factory is the product. How things get built — in parallel, with clear ownership, against stated quality bars — is what makes the output trustworthy.",
  },
  {
    number: "04",
    name: "Review",
    tagline: "Two directors. One standard.",
    duration: "Round 9",
    agents: ["Steve Jobs", "Elon Musk", "Jensen Huang", "Marcus Aurelius"],
    desc: "Steve audits every deliverable for taste, craft, and brand consistency. Elon audits for feasibility, accuracy, and market alignment. Jensen provides board-level strategic feedback. Marcus checks consistency across the full set. Revisions go back to specific agents with precise feedback — not vague notes.",
    outputs: [
      "Revision requests with specific agent assignments",
      "Approved deliverables promoted to final/",
      "Jensen's strategic notes",
    ],
    why: "Quality gates are only meaningful when they have teeth. Nothing ships that Steve wouldn't show to someone he respects and Elon can't justify from first principles.",
  },
  {
    number: "05",
    name: "Ship",
    tagline: "Production. Memory. Done.",
    duration: "Round 10",
    agents: ["Marcus Aurelius", "Steve Jobs", "Elon Musk"],
    desc: "Final deliverables assembled in deliverables/{project}/final/. Production deployment initiated. Steve and Elon write a joint summary. Marcus logs learnings to memory/. The organizer consolidates and prunes. STATUS.md returns to idle. The agency is smarter than it was before.",
    outputs: [
      "Production deployment",
      "Joint executive summary",
      "Memory updates for future projects",
      "STATUS.md → idle",
    ],
    why: "The agency compounds. Every project teaches it something. The next PRD gets better output because this one happened.",
  },
];

const principles = [
  {
    title: "No mediocrity.",
    body: "If it's not worth building beautifully, it's not worth building. Good enough is the enemy of insanely great.",
  },
  {
    title: "No hand-waving.",
    body: "Every claim survives first-principles scrutiny. Beauty must be defensible. Feasibility must be proven.",
  },
  {
    title: "No feature bloat.",
    body: "Focus means saying no to good ideas so great ideas can breathe. The agency kills more features than it ships.",
  },
  {
    title: "No slow timelines.",
    body: "Timelines are compressible. Physics is the only constraint. Default to faster until the physics say otherwise.",
  },
  {
    title: "No silent failure.",
    body: "Blockers surface immediately in STATUS.md. The agency doesn't pretend it isn't stuck. It flags, pivots, and escalates.",
  },
  {
    title: "No forgetting.",
    body: "Every project updates memory. The organizer consolidates. The agency compounds. Client three gets the benefit of clients one and two.",
  },
];

export default function HowPage() {
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
            The Process
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-zinc-50 mb-6">
            Five phases.
            <br />
            <span className="text-zinc-500">One session.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            From PRD to deployed product. Every engagement follows the same
            pipeline. The state machine enforces it. Marcus makes sure it doesn&apos;t skip steps.
          </p>

          {/* State machine diagram */}
          <div className="mt-12 flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-500">
            <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400">idle</span>
            <span>→</span>
            <span className="px-2 py-1 rounded bg-zinc-800 text-amber-400">debate</span>
            <span>→</span>
            <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400">plan</span>
            <span>→</span>
            <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400">build</span>
            <span>→</span>
            <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400">review</span>
            <span>→</span>
            <span className="px-2 py-1 rounded bg-zinc-800 text-emerald-400">ship</span>
            <span>→</span>
            <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400">idle</span>
          </div>
        </div>
      </section>

      {/* Phase timeline */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <div
                key={phase.number}
                className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 overflow-hidden hover:border-zinc-700 transition-colors"
              >
                {/* Phase header */}
                <div className="px-7 pt-7 pb-5">
                  <div className="flex items-start gap-5 mb-5">
                    <div className="flex-shrink-0 w-11 h-11 rounded-full border border-zinc-700 flex items-center justify-center">
                      <span className="font-mono text-xs text-amber-500 font-bold">
                        {phase.number}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h2 className="text-xl font-bold text-zinc-100">
                          {phase.name}
                        </h2>
                        <span className="text-sm text-zinc-500 italic">
                          {phase.tagline}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 font-mono mt-1">
                        {phase.duration}
                      </p>
                    </div>
                  </div>

                  <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                    {phase.desc}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Outputs */}
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                        Outputs
                      </p>
                      <ul className="space-y-1.5">
                        {phase.outputs.map((o) => (
                          <li
                            key={o}
                            className="text-sm text-zinc-400 flex items-start gap-2"
                          >
                            <span className="text-amber-500/50 text-xs mt-0.5">
                              →
                            </span>
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Why */}
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                        Why this matters
                      </p>
                      <p className="text-sm text-zinc-500 italic leading-relaxed">
                        {phase.why}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Agents row */}
                <div className="px-7 py-4 border-t border-zinc-800/50 bg-zinc-900/50 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-zinc-600 font-semibold uppercase tracking-wider mr-2">
                    Agents
                  </span>
                  {phase.agents.map((a) => (
                    <span
                      key={a}
                      className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-medium"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What makes it different */}
      <section className="px-6 py-20 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            The Edge
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 mb-6">
            What makes it different.
          </h2>
          <div className="p-8 rounded-xl border border-amber-500/20 bg-amber-500/5 mb-10">
            <p className="text-lg text-zinc-100 italic leading-relaxed">
              Most teams agree too quickly. Steve and Elon don't.
            </p>
            <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
              Consensus is the enemy of excellence. The debate phase exists because real disagreement between thoughtful people produces decisions that survive first-principles scrutiny. You pay for conflict. What comes out the other side is defensible.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="px-6 py-20 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Standards
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 mb-10">
            What we will not compromise on.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {principles.map((p, i) => (
              <div
                key={p.title}
                className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/50"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-amber-500/50 font-bold mt-0.5 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-semibold text-zinc-100 text-sm mb-1.5">
                      {p.title}
                    </p>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Retry policy — this is the kind of operational detail that builds trust */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="p-7 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
            <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
              When things go wrong
            </p>
            <h3 className="text-lg font-bold text-zinc-100 mb-4">
              The retry protocol
            </h3>
            <div className="space-y-2 font-mono text-sm">
              <p className="text-zinc-400">
                <span className="text-zinc-600">1.</span> Agent fails → retry once with the same prompt
              </p>
              <p className="text-zinc-400">
                <span className="text-zinc-600">2.</span> Retry fails → try an alternative approach
              </p>
              <p className="text-zinc-400">
                <span className="text-zinc-600">3.</span> Alternative fails → mark as blocked in STATUS.md
              </p>
              <p className="text-zinc-400">
                <span className="text-zinc-600">4.</span> 3 failures on the same task → stop, engage human
              </p>
              <p className="text-zinc-400">
                <span className="text-zinc-600">5.</span> While blocked on one task → work on unblocked tasks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 border-t border-zinc-800/50 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">
            See it in practice
          </h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            The LocalGenius case study walks through all five phases — the debate
            transcripts, the build output, the final numbers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/work/localgenius"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-500 text-zinc-950 font-semibold text-sm hover:bg-amber-400 transition-colors no-underline"
            >
              LocalGenius case study →
            </Link>
            <Link
              href="/install"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-500 transition-colors no-underline"
            >
              Submit a PRD
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

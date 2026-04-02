import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Team — Great Minds Agency",
  description:
    "Steve Jobs, Elon Musk, Marcus Aurelius, and Jensen Huang. Five minds. No meetings. One agency.",
};

const directors = [
  {
    name: "Steve Jobs",
    title: "Chief Design & Brand Officer",
    role: "Creative Director",
    accentColor: "border-orange-500/40",
    labelColor: "text-orange-400",
    bgAccent: "bg-orange-500/5",
    philosophy:
      "Technology alone is not enough. It's technology married with liberal arts, with the humanities, that yields results that make our hearts sing. Every pixel is a decision. Every decision is a statement about what you believe.",
    responsibilities: [
      "Product design vision and taste arbitration",
      "Brand identity, tone, and visual language",
      "UX specification and interaction design",
      "Hires: designer, copywriter, brand strategist",
    ],
    quote:
      "Design is not just what it looks like and feels like. Design is how it works.",
    tension:
      "Believes beauty is not negotiable. Will kill a feature before shipping it ugly. Pushes for simplicity even when complexity seems easier.",
  },
  {
    name: "Elon Musk",
    title: "Chief Product & Growth Officer",
    role: "Product Director",
    accentColor: "border-emerald-500/40",
    labelColor: "text-emerald-400",
    bgAccent: "bg-emerald-500/5",
    philosophy:
      "First principles. Question every assumption. The factory is the product — how you build matters as much as what you build. Timelines are compressible. Physics is the only constraint.",
    responsibilities: [
      "Market analysis and competitive positioning",
      "Growth strategy and go-to-market",
      "Technical architecture feasibility",
      "Hires: market analyst, growth strategist, engineer",
    ],
    quote:
      "When something is important enough, you do it even if the odds are not in your favor.",
    tension:
      "Believes shipping beats perfecting. Will compress a timeline others think impossible. Challenges assumptions disguised as facts.",
  },
];

const supporting = [
  {
    name: "Marcus Aurelius",
    title: "Moderator / Chief of Staff",
    labelColor: "text-amber-400",
    philosophy:
      "Stoic philosopher-emperor. He does not take sides — he enforces discipline. Runs the state machine, mediates director conflicts, logs decisions, and ensures quality gates are not skipped. Consensus without clarity is just noise.",
    responsibilities: [
      "State machine execution (idle → debate → build → ship)",
      "Conflict mediation between Steve and Elon",
      "Decision logging and memory consolidation",
      "Quality gate enforcement at each phase",
    ],
    quote: "The impediment to action advances action. What stands in the way becomes the way.",
  },
  {
    name: "Jensen Huang",
    title: "Board Advisor",
    labelColor: "text-blue-400",
    philosophy:
      "Strategic advisor. NVIDIA's CEO brings deep perspective on AI architecture, compute economics, and platform thinking. He reviews but does not micromanage. His job is to see around corners the directors miss.",
    responsibilities: [
      "Board-level strategic review at project close",
      "AI architecture and model selection guidance",
      "Compute economics and cost optimization",
      "Creates GitHub issues for strategic concerns",
    ],
    quote: "The more you buy, the more you save — but only if you know what you're buying.",
  },
  {
    name: "Organizer",
    title: "System Operations",
    labelColor: "text-violet-400",
    philosophy:
      "The one agent that never speaks in a meeting. Runs on cron. Tidies files, validates structure, consolidates memory, prunes stale data. The agency gets smarter over time because of this agent. Invisible until something is wrong.",
    responsibilities: [
      "File organization and structure validation",
      "Memory consolidation and pruning (dream cycle)",
      "Status tracking and heartbeat updates",
      "Blocking detection and escalation",
    ],
    quote: "Order from chaos, consistently.",
  },
];

export default function TeamPage() {
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
            The Team
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-zinc-50 mb-6">
            Five minds.
            <br />
            <span className="text-zinc-500">Zero meetings.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Every project runs the same five-phase pipeline, executed by the same
            team of agents. They have different values, different instincts, and
            different views of what makes something great. That disagreement is
            load-bearing.
          </p>
        </div>
      </section>

      {/* Creative Directors — the main event */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-10">
            Creative Directors
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {directors.map((d) => (
              <div
                key={d.name}
                className={`rounded-xl border-l-2 ${d.accentColor} ${d.bgAccent} p-8 border border-zinc-800/50`}
              >
                <div className="mb-6">
                  <p
                    className={`font-mono text-xs font-semibold tracking-widest uppercase mb-1 ${d.labelColor}`}
                  >
                    {d.role}
                  </p>
                  <h2 className="text-2xl font-bold text-zinc-100">{d.name}</h2>
                  <p className="text-sm text-zinc-500 mt-1">{d.title}</p>
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  {d.philosophy}
                </p>

                <div className="mb-6">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    Responsibilities
                  </p>
                  <ul className="space-y-2">
                    {d.responsibilities.map((r) => (
                      <li
                        key={r}
                        className="flex items-start gap-2 text-sm text-zinc-400"
                      >
                        <span className={`mt-0.5 text-xs ${d.labelColor}`}>
                          →
                        </span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 border-t border-zinc-800/70">
                  <p className="text-zinc-500 text-xs italic leading-relaxed">
                    &ldquo;{d.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* The tension explained */}
          <div className="mt-8 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <p className="text-sm text-zinc-500 italic leading-relaxed">
              Steve and Elon do not defer to each other. Steve will reject
              something technically brilliant because it feels wrong. Elon will
              challenge something beautiful because the physics don&apos;t work.
              Marcus mediates. The better argument wins. This is not a bug — it
              is the entire point.
            </p>
          </div>
        </div>
      </section>

      {/* Supporting cast */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-10">
            Supporting Agents
          </p>
          <div className="space-y-6">
            {supporting.map((s) => (
              <div
                key={s.name}
                className="p-7 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100">{s.name}</h3>
                    <p className={`text-sm font-medium ${s.labelColor} mt-0.5`}>
                      {s.title}
                    </p>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-5">
                  {s.philosophy}
                </p>
                <div className="grid sm:grid-cols-2 gap-2 mb-5">
                  {s.responsibilities.map((r) => (
                    <p key={r} className="text-xs text-zinc-500">
                      · {r}
                    </p>
                  ))}
                </div>
                <p className="text-zinc-600 text-xs italic">&ldquo;{s.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-Agents — the specialists */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Sub-Agents
          </p>
          <h2 className="text-2xl font-bold text-zinc-100 mb-3">
            The specialists. Hired by the directors.
          </h2>
          <p className="text-sm text-zinc-400 mb-10 max-w-2xl">
            Each director hires specialists for their domain. Steve hires for
            taste. Elon hires for rigor. Sub-agents produce the actual
            deliverables — code, copy, design, analysis.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                name: "Design Lead",
                hiredBy: "Steve",
                color: "text-orange-400",
                border: "border-orange-500/20",
                desc: "Owns the visual language — templates, design system, reveal moment. Every pixel works at 375px mobile and 1440px desktop.",
              },
              {
                name: "Maya Torres",
                title: "Brand Storyteller",
                hiredBy: "Steve",
                color: "text-orange-400",
                border: "border-orange-500/20",
                desc: "Customer personas and marketing messaging. Defines the brand voice, the words we use, and the words we never use.",
              },
              {
                name: "Growth Strategist",
                hiredBy: "Elon",
                color: "text-emerald-400",
                border: "border-emerald-500/20",
                desc: "90-day launch plan, channel strategy, conversion targets. Designs the organic growth engine and referral mechanics.",
              },
              {
                name: "Market Analyst",
                hiredBy: "Elon",
                color: "text-emerald-400",
                border: "border-emerald-500/20",
                desc: "TAM sizing, unit economics, competitive positioning, retention modeling. First-principles math, not hand-waving.",
              },
            ].map((agent) => (
              <div
                key={agent.name}
                className={`p-5 rounded-lg bg-zinc-900/30 border ${agent.border} hover:border-zinc-700 transition-colors`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-zinc-100 text-sm">
                      {agent.name}
                    </h3>
                    {"title" in agent && agent.title && (
                      <p className="text-xs text-zinc-500">{agent.title}</p>
                    )}
                  </div>
                  <span className={`text-xs font-mono ${agent.color}`}>
                    [{agent.hiredBy}]
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {agent.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 border-t border-zinc-800/50 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">
            See the team in action
          </h2>
          <p className="text-zinc-400 text-sm mb-8">
            Read the LocalGenius case study — the full debate transcript, the
            build output, and the live products.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/work/localgenius"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-500 text-zinc-950 font-semibold text-sm hover:bg-amber-400 transition-colors no-underline"
            >
              Read the case study →
            </Link>
            <Link
              href="/how"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-500 transition-colors no-underline"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

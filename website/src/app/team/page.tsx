import Link from "next/link";
import type { Metadata } from "next";
import { agents } from "./agents";

export const metadata: Metadata = {
  title: "The Team — Great Minds Agency",
  description:
    "Nine AI agents. Zero meetings. Steve Jobs, Elon Musk, Marcus Aurelius, Jensen Huang, Margaret Hamilton, and more.",
};

export default function TeamPage() {
  const core = agents.filter((a) => !a.reportsTo);
  const sub = agents.filter((a) => a.reportsTo);

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
            Nine minds.
            <br />
            <span className="text-zinc-500">Zero meetings.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Every project runs the same five-phase pipeline. They have different
            values, different instincts, and different views of what makes
            something great. That disagreement is load-bearing.
          </p>
        </div>
      </section>

      {/* Core Agents */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-10">
            Leadership
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {core.map((agent) => (
              <Link
                key={agent.slug}
                href={`/team/${agent.slug}`}
                className={`group block p-6 rounded-xl border ${agent.borderColor} ${agent.bgColor} hover:border-zinc-600 transition-colors no-underline`}
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden mb-4">
                  <img
                    src={`/personas/thumbs/${agent.slug}.webp`}
                    alt={agent.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className={`font-mono text-xs font-semibold tracking-widest uppercase mb-2 ${agent.color}`}>
                  {agent.role}
                </p>
                <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
                  {agent.name}
                </h3>
                <p className="text-sm text-zinc-500 mt-1 mb-4">{agent.title}</p>
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                  {agent.philosophy.split('.').slice(0, 2).join('.') + '.'}
                </p>
                <span className={`inline-block mt-4 text-xs font-semibold ${agent.color}`}>
                  View profile →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-Agents */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Specialists
          </p>
          <p className="text-sm text-zinc-400 mb-10 max-w-2xl">
            Hired by the directors for their domain expertise. They produce
            the actual deliverables — design, copy, strategy, analysis.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {sub.map((agent) => (
              <Link
                key={agent.slug}
                href={`/team/${agent.slug}`}
                className={`group block p-5 rounded-lg border ${agent.borderColor} hover:border-zinc-600 transition-colors no-underline`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-zinc-100 text-sm group-hover:text-white transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-zinc-500">{agent.title}</p>
                  </div>
                  <span className={`text-xs font-mono ${agent.color}`}>
                    [{agent.reportsTo === 'Steve Jobs' ? 'Steve' : 'Elon'}]
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {agent.philosophy.split('.').slice(0, 1).join('.') + '.'}
                </p>
              </Link>
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
            Read the LocalGenius case study — the full debate, the build, the live products.
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
              How It Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

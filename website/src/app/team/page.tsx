import Link from "next/link";
import type { Metadata } from "next";
import { agents, founder } from "./agents";
import type { Agent } from "./agents";

export const metadata: Metadata = {
  title: "The Team — Great Minds Agency",
  description:
    "Seth Shoultes and fourteen AI agents. Zero meetings. Steve Jobs, Elon Musk, Phil Jackson, Jensen Huang, Margaret Hamilton, and more.",
};

/** Agents that have a thumbnail image in /personas/thumbs/ */
const SLUGS_WITH_THUMBS = new Set([
  'seth-shoultes', 'marcus-aurelius', 'steve-jobs', 'elon-musk',
  'jensen-huang', 'margaret-hamilton', 'rick-rubin', 'jony-ive',
  'maya-angelou', 'sara-blakely', 'phil-jackson', 'oprah-winfrey',
  'warren-buffett', 'shonda-rhimes', 'aaron-sorkin',
]);

function AgentCard({ agent, compact }: { agent: Agent; compact?: boolean }) {
  const hasThumb = SLUGS_WITH_THUMBS.has(agent.slug);

  if (compact) {
    return (
      <Link
        key={agent.slug}
        href={`/team/${agent.slug}`}
        className={`group block p-5 rounded-lg border ${agent.borderColor} hover:border-zinc-600 transition-colors no-underline`}
      >
        <div className="flex items-start gap-4">
          {hasThumb && (
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={`/personas/thumbs/${agent.slug}.webp`}
                alt={agent.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-zinc-100 text-sm group-hover:text-white transition-colors">
                {agent.name}
              </h3>
              {agent.reportsTo && (
                <span className={`text-xs font-mono ${agent.color} flex-shrink-0 ml-2`}>
                  [{agent.reportsTo === 'Steve Jobs' ? 'Steve' : 'Elon'}]
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mb-2">{agent.title}</p>
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
              {agent.oneLiner}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      key={agent.slug}
      href={`/team/${agent.slug}`}
      className={`group block p-6 rounded-xl border ${agent.borderColor} ${agent.bgColor} hover:border-zinc-600 transition-colors no-underline`}
    >
      {hasThumb && (
        <div className="w-16 h-16 rounded-lg overflow-hidden mb-4">
          <img
            src={`/personas/thumbs/${agent.slug}.webp`}
            alt={agent.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {!hasThumb && (
        <div className={`w-16 h-16 rounded-lg mb-4 flex items-center justify-center ${agent.bgColor} border ${agent.borderColor}`}>
          <span className={`text-2xl font-bold ${agent.color}`}>
            {agent.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
      )}
      <p className={`font-mono text-xs font-semibold tracking-widest uppercase mb-2 ${agent.color}`}>
        {agent.role}
      </p>
      <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
        {agent.name}
      </h3>
      <p className="text-sm text-zinc-500 mt-1 mb-3">{agent.title}</p>
      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
        {agent.oneLiner}
      </p>
      <span className={`inline-block mt-4 text-xs font-semibold ${agent.color}`}>
        View profile →
      </span>
    </Link>
  );
}

export default function TeamPage() {
  const board = agents.filter((a) => a.group === 'board');
  const directors = agents.filter((a) => a.group === 'directors');
  const subs = agents.filter((a) => a.group === 'sub-agents');

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
            Fourteen minds.
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

      {/* Founder */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-10">
            Founder
          </p>
          <Link
            href={`/team/${founder.slug}`}
            className="group block sm:flex gap-8 p-8 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50 transition-colors no-underline"
          >
            <div className="flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden mb-6 sm:mb-0">
              <img
                src={`/personas/${founder.slug}.webp`}
                alt={founder.name}
                width={144}
                height={144}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-mono text-xs font-semibold tracking-widest uppercase mb-2 text-amber-400">
                {founder.role}
              </p>
              <h2 className="text-2xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                {founder.name}
              </h2>
              <p className="text-sm text-zinc-500 mt-1 mb-4">{founder.title}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {founder.philosophy}
              </p>
              <span className="inline-block mt-4 text-xs font-semibold text-amber-400">
                View profile →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Board of Directors
          </p>
          <p className="text-sm text-zinc-400 mb-10 max-w-2xl">
            Strategic advisors who review at the board level. They see around
            corners, challenge assumptions, and keep the agency honest.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {board.map((agent) => (
              <AgentCard key={agent.slug} agent={agent} />
            ))}
          </div>
        </div>
      </section>

      {/* Directors */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Directors
          </p>
          <p className="text-sm text-zinc-400 mb-10 max-w-2xl">
            The operational leadership. They run the pipeline, make the
            creative and product calls, enforce quality gates, and hire
            the specialists.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {directors.map((agent) => (
              <AgentCard key={agent.slug} agent={agent} />
            ))}
          </div>
        </div>
      </section>

      {/* Sub-Agents */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Sub-agents
          </p>
          <p className="text-sm text-zinc-400 mb-10 max-w-2xl">
            Hired by the directors for their domain expertise. They produce
            the actual deliverables — design, copy, strategy, scripts.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {subs.map((agent) => (
              <AgentCard key={agent.slug} agent={agent} compact />
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

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { agents, getAgent, getAdjacentAgents } from "../agents";

export async function generateStaticParams() {
  return agents.map((agent) => ({
    slug: agent.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const agent = getAgent(params.slug);
  if (!agent) {
    return {};
  }
  return {
    title: `${agent.name} — Great Minds Agency`,
    description: `${agent.role}. ${agent.title}. ${agent.philosophy.substring(0, 120)}...`,
  };
}

export default function AgentProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const agent = getAgent(params.slug);
  if (!agent) {
    notFound();
  }

  const { prev, next } = getAdjacentAgents(params.slug);
  const reportsToAgent = agent.reportsTo ? getAgent(agent.reportsTo.toLowerCase().replace(/\s+/g, "-")) : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="px-6 pt-20 pb-12 sm:pt-28 sm:pb-16">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/team"
            className="inline-flex items-center text-zinc-500 hover:text-zinc-300 transition-colors no-underline text-sm mb-12"
          >
            ← Team
          </Link>

          {/* Agent title and role */}
          <div className="mb-8">
            <div className="flex items-end gap-3 mb-3">
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-zinc-50">
                {agent.name}
              </h1>
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase ${agent.color} ${agent.bgColor} border ${agent.borderColor} mb-1`}
              >
                {agent.role}
              </div>
            </div>
            <p className="text-lg text-zinc-500">{agent.title}</p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="flex-1 px-6 py-12 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Philosophy */}
          <div>
            <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
              Philosophy
            </p>
            <p className="text-lg text-zinc-300 leading-relaxed max-w-3xl">
              {agent.philosophy}
            </p>
          </div>

          {/* Background */}
          <div>
            <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
              Who they really are
            </p>
            <p className="text-zinc-400 leading-relaxed max-w-3xl">
              {agent.background}
            </p>
          </div>

          {/* Responsibilities */}
          <div>
            <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
              Responsibilities
            </p>
            <ul className="space-y-3 max-w-3xl">
              {agent.responsibilities.map((responsibility) => (
                <li
                  key={responsibility}
                  className="flex items-start gap-3 text-zinc-400"
                >
                  <span className={`mt-1 text-sm ${agent.color} flex-shrink-0`}>
                    →
                  </span>
                  <span>{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quotes */}
          {agent.quotes.length > 0 && (
            <div>
              <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-6">
                Defining Moments
              </p>
              <div className="space-y-6 max-w-3xl">
                {agent.quotes.map((quote, idx) => (
                  <blockquote
                    key={idx}
                    className={`italic text-zinc-400 border-l-4 ${agent.borderColor} pl-6 py-1`}
                  >
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                ))}
              </div>
            </div>
          )}

          {/* Reports To */}
          {agent.reportsTo && reportsToAgent && (
            <div className="pt-6 border-t border-zinc-800/50">
              <p className="text-zinc-500 text-sm">
                Reports to:{" "}
                <Link
                  href={`/team/${reportsToAgent.slug}`}
                  className={`${reportsToAgent.color} hover:underline font-semibold`}
                >
                  {reportsToAgent.name}
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Prev/Next Navigation */}
      {(prev || next) && (
        <section className="px-6 py-16 border-t border-zinc-800/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              {prev ? (
                <Link
                  href={`/team/${prev.slug}`}
                  className={`text-sm font-medium ${prev.color} hover:opacity-80 transition-opacity no-underline`}
                >
                  ← {prev.name}
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/team/${next.slug}`}
                  className={`text-sm font-medium ${next.color} hover:opacity-80 transition-opacity no-underline`}
                >
                  {next.name} →
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

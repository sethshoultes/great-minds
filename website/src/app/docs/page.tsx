import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation — Great Minds Agency',
  description: 'How the Great Minds AI agency works — agents, pipeline, memory, QA, and operations.',
};

const sections = [
  { href: '/docs/agents', title: 'Agents', desc: 'The 14 agents + founder — roles, hierarchy, communication rules.', source: 'AGENTS.md' },
  { href: '/docs/daemon', title: 'Daemon', desc: 'The Agent SDK daemon — replaces crons, watches for PRDs, runs the full GSD pipeline.', source: 'daemon/README.md' },
  { href: '/docs/docker', title: 'Docker', desc: 'Run the daemon in Docker — docker-compose, volumes, environment setup.', source: 'daemon/docker-compose.yml' },
  { href: '/docs/deployment', title: 'Deployment', desc: 'DigitalOcean droplet setup, SSH, daemon installation, monitoring.', source: 'deliverables/vps-deployment-guide.md' },
  { href: '/docs/crons', title: 'Cron Jobs', desc: 'Legacy cron system — five automated processes (replaced by daemon).', source: 'CRONS.md' },
  { href: '/docs/heartbeat', title: 'Heartbeat', desc: 'Tick schedule, agent roster, director operating rules.', source: 'HEARTBEAT.md' },
  { href: '/docs/memory', title: 'Memory', desc: 'Three-layer memory architecture — index, files, git verification.', source: 'MEMORY.md' },
  { href: '/docs/scoreboard', title: 'Scoreboard', desc: 'Live stats — commits, tests, Jensen reviews, Margaret QA reports.', source: 'SCOREBOARD.md' },
  { href: '/docs/retrospective', title: 'Retrospective', desc: 'What worked, what didn\'t, lessons learned from LocalGenius.', source: 'deliverables/retrospective.md' },
  { href: '/docs/workshop', title: 'Workshop Plan', desc: 'The 45-minute workshop — opening, demos, architecture deep-dive.', source: 'deliverables/workshop-plan.md' },
];

export default function DocsOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-50 mb-4">Documentation</h1>
      <p className="text-zinc-400 leading-relaxed mb-4 max-w-xl">
        The repo is the knowledge base. These pages render the actual markdown
        files from the Great Minds repository — no duplicated content.
      </p>
      <p className="text-xs text-zinc-500 mb-10">
        Every page you see here is a real file in the codebase, rendered live.
      </p>

      <div className="space-y-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex items-start gap-4 p-5 rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 transition-colors no-underline"
          >
            <div className="flex-1">
              <h2 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors">
                {s.title}
              </h2>
              <p className="text-sm text-zinc-400 mt-1">{s.desc}</p>
            </div>
            <code className="text-xs text-zinc-600 font-mono mt-1 flex-shrink-0">
              {s.source}
            </code>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/blog/ai-agent-memory-architecture" className="text-sm text-amber-500 hover:text-amber-400 no-underline">
          Read the blog post: How Our AI Agents Remember What They Learned →
        </Link>
      </div>
    </div>
  );
}

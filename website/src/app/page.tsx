import Link from "next/link";

const agents = [
  { name: "Marcus Aurelius", role: "Moderator", icon: "🏛️", color: "text-amber-400" },
  { name: "Steve Jobs", role: "Design Director", icon: "🎨", color: "text-orange-400" },
  { name: "Elon Musk", role: "Product Director", icon: "🚀", color: "text-emerald-400" },
  { name: "Jensen Huang", role: "Board Advisor", icon: "📊", color: "text-blue-400" },
  { name: "Organizer", role: "System Ops", icon: "🗂️", color: "text-violet-400" },
];

const stats = [
  { value: "736", label: "Tests passing" },
  { value: "204", label: "Source files" },
  { value: "40+", label: "API endpoints" },
  { value: "2", label: "Live products" },
];

const pipeline = [
  { step: "01", name: "Debate", desc: "Steve and Elon stake independent positions. No deference." },
  { step: "02", name: "Plan", desc: "Directors challenge each other. Marcus mediates and locks decisions." },
  { step: "03", name: "Build", desc: "Sub-agents produce code, design, copy, tests — in parallel." },
  { step: "04", name: "Review", desc: "Directors review. Jensen advises. Quality gates enforced." },
  { step: "05", name: "Ship", desc: "Production deployment. Memory updated. Ready for next project." },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-sm font-medium tracking-wider uppercase mb-4">
            AI Agency
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] text-zinc-50">
            Drop in a PRD.
            <br />
            <span className="text-zinc-400">Get back a product.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Great Minds is an AI agency powered by iconic business minds.
            Steve Jobs debates Elon Musk on your product strategy.
            Sub-agents build it. Ship in one session.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/install"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 text-zinc-950 font-semibold text-sm hover:bg-amber-400 transition-colors no-underline"
            >
              Install plugin
              <span className="text-amber-700">→</span>
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-zinc-700 text-zinc-300 font-medium text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors no-underline"
            >
              See what we built
            </Link>
          </div>
        </div>
      </section>

      {/* Agent Roster */}
      <section className="px-6 py-20 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-sm font-medium tracking-wider uppercase mb-3">
            The Team
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-10">
            Five agents. Zero meetings.
          </h2>
          <div className="grid gap-3">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="flex items-center gap-4 px-5 py-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors"
              >
                <span className="text-2xl flex-shrink-0 w-10 text-center">{agent.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-zinc-100">{agent.name}</span>
                  <span className={`ml-2 text-sm ${agent.color}`}>{agent.role}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/team" className="text-sm text-amber-500 hover:text-amber-400 transition-colors no-underline">
              Meet the full team →
            </Link>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="px-6 py-20 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-sm font-medium tracking-wider uppercase mb-3">
            The Process
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-10">
            Debate → Plan → Build → Review → Ship
          </h2>
          <div className="space-y-6">
            {pipeline.map((phase) => (
              <div key={phase.step} className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center">
                  <span className="font-mono text-sm text-amber-500 font-bold">{phase.step}</span>
                </div>
                <div className="pt-1.5">
                  <h3 className="font-semibold text-zinc-100">{phase.name}</h3>
                  <p className="text-sm text-zinc-400 mt-1">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/how" className="text-sm text-amber-500 hover:text-amber-400 transition-colors no-underline">
              See how it works →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-20 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-sm font-medium tracking-wider uppercase mb-3">
            First Project: LocalGenius
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-10">
            Built from PRD to production. In one session.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-zinc-50 font-mono">{stat.value}</div>
                <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center gap-4">
            <a
              href="https://localgenius.company"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-500 transition-colors no-underline"
            >
              localgenius.company
              <span className="text-zinc-500">↗</span>
            </a>
            <a
              href="https://localgenius-sites.pages.dev"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-500 transition-colors no-underline"
            >
              Sites demo
              <span className="text-zinc-500">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-zinc-800/50 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
            Ready to build something?
          </h2>
          <p className="text-zinc-400 mt-3">
            Install the plugin. Drop in a PRD. Watch the agency work.
          </p>
          <div className="mt-8">
            <Link
              href="/install"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 transition-colors no-underline"
            >
              Get started →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

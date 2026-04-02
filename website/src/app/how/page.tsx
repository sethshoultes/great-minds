import Link from 'next/link';

const phases = [
  {
    number: 1,
    name: 'Debate',
    desc: 'Steve and Elon stake independent positions on product design, market fit, personas, team, marketing, and messaging. No deference — the best idea wins.',
    agents: 'Steve + Elon',
  },
  {
    number: 2,
    name: 'Plan',
    desc: 'Directors challenge each other, converge on decisions, and define their teams. Marcus mediates conflicts and logs all decisions.',
    agents: 'Steve + Elon + Marcus',
  },
  {
    number: 3,
    name: 'Build',
    desc: 'Sub-agents produce deliverables — design specs, code, copy, tests. Directors supervise and review.',
    agents: 'Sub-agents + Directors',
  },
  {
    number: 4,
    name: 'Review',
    desc: 'Directors review all drafts. Marcus checks for consistency. Jensen provides board-level strategic feedback.',
    agents: 'All agents',
  },
  {
    number: 5,
    name: 'Ship',
    desc: 'Final assembly, joint summary, production deployment. Memory updated for next project.',
    agents: 'Marcus + Directors',
  },
];

export default function HowPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Link */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-amber-500 hover:text-amber-400 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-4 text-zinc-100">How We Work</h1>
          <p className="text-xl text-zinc-400">
            A five-phase pipeline from debate to delivery. Tension between taste and physics produces excellence.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-amber-500 to-zinc-800" />

          {/* Phase Cards */}
          <div className="space-y-12 pl-12">
            {phases.map((phase, index) => (
              <div key={phase.number} className="relative">
                {/* Numbered Circle */}
                <div className="absolute -left-16 top-0 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-zinc-950 font-bold text-lg">
                  {phase.number}
                </div>

                {/* Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 hover:border-amber-500 transition-colors">
                  <h2 className="text-2xl font-bold text-zinc-100 mb-3">{phase.name}</h2>

                  {/* Description */}
                  <p className="text-zinc-300 leading-relaxed mb-6">{phase.desc}</p>

                  {/* Agents Involved */}
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 text-sm font-semibold">Agents:</span>
                    <span className="inline-block bg-zinc-800 text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
                      {phase.agents}
                    </span>
                  </div>
                </div>

                {/* Connector to next */}
                {index < phases.length - 1 && (
                  <div className="mt-12 pb-12">
                    <div className="text-center text-zinc-600">
                      <svg
                        className="w-6 h-6 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-16 pt-12 border-t border-zinc-800">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
            <h3 className="text-xl font-bold text-zinc-100 mb-4">Our Standards</h3>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex gap-3">
                <span className="text-amber-500 font-bold">1.</span>
                <span>
                  <strong>No mediocrity.</strong> If it's not worth building beautifully, it's not worth building.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 font-bold">2.</span>
                <span>
                  <strong>No hand-waving.</strong> Every claim must survive first-principles scrutiny.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 font-bold">3.</span>
                <span>
                  <strong>No feature bloat.</strong> Focus means saying no to good ideas so great ideas can breathe.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 font-bold">4.</span>
                <span>
                  <strong>No slow timelines.</strong> Timelines are compressible. Default to faster.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 font-bold">5.</span>
                <span>
                  <strong>No vanity metrics.</strong> Measure what matters for the business and the user.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

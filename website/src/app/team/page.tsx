import Link from 'next/link';

const agents = [
  {
    name: 'Marcus Aurelius',
    role: 'Moderator / Chief of Staff',
    icon: '🏛️',
    color: '#D4A853',
    philosophy: 'Stoic philosopher-emperor. Drives state machines, mediates debates, ensures quality.',
    quote: 'The obstacle is the way.',
  },
  {
    name: 'Steve Jobs',
    role: 'Chief Design & Brand Officer',
    icon: '🎨',
    color: '#C4704B',
    philosophy: 'Simplicity. Taste. The intersection of technology and the humanities.',
    quote: 'Design is not just what it looks like. Design is how it works.',
  },
  {
    name: 'Elon Musk',
    role: 'Chief Product & Growth Officer',
    icon: '🚀',
    color: '#7A8B6F',
    philosophy: 'First principles. 10x thinking. The factory is the product.',
    quote: 'When something is important enough, you do it even if the odds are not in your favor.',
  },
  {
    name: 'Jensen Huang',
    role: 'Board Member & Strategic Advisor',
    icon: '📊',
    color: '#60A5FA',
    philosophy: 'Strategic vision. Periodic reviews. Creates GitHub issues for new ideas.',
    quote: 'The more you buy, the more you save.',
  },
  {
    name: 'Organizer',
    role: 'System Maintenance',
    icon: '🗂️',
    color: '#8B5CF6',
    philosophy: 'File organizer, memory consolidator, structure validator. Runs as cron.',
    quote: 'Order from chaos, consistently.',
  },
];

export default function TeamPage() {
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
          <h1 className="text-5xl font-bold mb-4 text-zinc-100">Core Team</h1>
          <p className="text-xl text-zinc-400">
            Five extraordinary minds working in concert to produce exceptional output.
          </p>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid gap-8">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="bg-zinc-900 border-l-4 border-zinc-800 p-8 rounded-lg hover:border-l-amber-500 transition-colors"
              style={{
                borderLeftColor: agent.color,
              }}
            >
              {/* Agent Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">{agent.icon}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-zinc-100">{agent.name}</h2>
                  <p className="text-sm font-semibold text-amber-500 mt-1">{agent.role}</p>
                </div>
              </div>

              {/* Philosophy */}
              <p className="text-zinc-300 mb-6 leading-relaxed">{agent.philosophy}</p>

              {/* Quote */}
              <div className="border-t border-zinc-800 pt-6">
                <p className="text-zinc-400 italic">"{agent.quote}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="mt-16 pt-12 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm">
            These five agents form the core of Great Minds. Together, they debate, plan, build, review, and ship exceptional work.
          </p>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

const NAV = [
  { href: '/docs', label: 'Overview' },
  { href: '/docs/agents', label: 'Agents' },
  { href: '/docs/crons', label: 'Cron Jobs' },
  { href: '/docs/heartbeat', label: 'Heartbeat' },
  { href: '/docs/memory', label: 'Memory' },
  { href: '/docs/scoreboard', label: 'Scoreboard' },
  { href: '/docs/retrospective', label: 'Retrospective' },
  { href: '/docs/workshop', label: 'Workshop' },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <aside className="lg:w-56 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-800/50 px-6 py-6 lg:py-10 lg:pl-8 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto">
        <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
          Docs
        </p>
        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors no-underline whitespace-nowrap px-2 py-1.5 rounded hover:bg-zinc-800/50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 px-6 py-10 lg:px-12 lg:py-12 max-w-3xl">
        {children}
      </main>
    </div>
  );
}

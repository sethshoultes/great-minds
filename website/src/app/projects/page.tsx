import Link from 'next/link';

const projects = [
  {
    name: 'LocalGenius',
    tagline: 'The AI marketing employee for local businesses.',
    status: 'Live',
    stats: { tests: 736, files: 204, endpoints: 40, components: 19 },
    urls: {
      app: 'https://localgenius.company',
      sites: 'https://localgenius-sites.pages.dev',
      github: 'https://github.com/sethshoultes/localgenius',
      sitesGithub: 'https://github.com/sethshoultes/localgenius-sites',
    },
    stack: [
      'Next.js',
      'Vercel',
      'Neon PostgreSQL',
      'Claude API',
      'Astro',
      'Cloudflare Workers',
      'D1',
      'R2',
      'Workers AI',
    ],
    description:
      'Full-stack AI product built from PRD to production in one session. Two apps: the main product (Vercel) and managed websites (Cloudflare). Real users, real AI, real revenue model.',
    deliverables: [
      'Product design vision',
      'Brand guide',
      'Customer personas',
      'Marketing messaging',
      'Sales demo script',
      'AI UX specification',
    ],
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
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
          <h1 className="text-5xl font-bold mb-4 text-zinc-100">Projects</h1>
          <p className="text-xl text-zinc-400">
            Full-stack products and systems built by Great Minds.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-12">
          {projects.map((project) => (
            <div
              key={project.name}
              className="bg-zinc-900 border border-zinc-800 p-10 rounded-lg hover:border-amber-500/30 transition-colors"
            >
              {/* Header with Status */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-4xl font-bold text-zinc-100">{project.name}</h2>
                  <span className="inline-block bg-green-500/20 text-green-400 text-sm font-semibold px-3 py-1 rounded-full">
                    {project.status}
                  </span>
                </div>
                <p className="text-lg text-amber-500 font-medium">{project.tagline}</p>
              </div>

              {/* Description */}
              <p className="text-zinc-300 mb-8 leading-relaxed text-base">
                {project.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 py-8 border-y border-zinc-800">
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Tests Written</p>
                  <p className="text-3xl font-bold text-zinc-100">{project.stats.tests}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Source Files</p>
                  <p className="text-3xl font-bold text-zinc-100">{project.stats.files}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">API Endpoints</p>
                  <p className="text-3xl font-bold text-zinc-100">{project.stats.endpoints}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">React Components</p>
                  <p className="text-3xl font-bold text-zinc-100">{project.stats.components}</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wide">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="bg-zinc-800/50 text-zinc-200 px-3 py-1.5 rounded text-sm font-medium hover:bg-zinc-800 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wide">
                  Deliverables
                </h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  {project.deliverables.map((deliverable) => (
                    <li
                      key={deliverable}
                      className="text-zinc-300 flex items-start gap-3"
                    >
                      <span className="text-amber-500 mt-1">→</span>
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Live URLs */}
              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                <a
                  href={project.urls.app}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold px-4 py-2.5 rounded transition-colors"
                >
                  Live App
                </a>
                <a
                  href={project.urls.sites}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-amber-500 text-amber-500 hover:bg-amber-500/10 font-semibold px-4 py-2.5 rounded transition-colors"
                >
                  Managed Sites
                </a>
                <a
                  href={project.urls.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-zinc-700 text-zinc-300 hover:border-zinc-500 font-semibold px-4 py-2.5 rounded transition-colors"
                >
                  Main Repository
                </a>
                <a
                  href={project.urls.sitesGithub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-zinc-700 text-zinc-300 hover:border-zinc-500 font-semibold px-4 py-2.5 rounded transition-colors"
                >
                  Sites Repository
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="mt-16 pt-12 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm">
            Each project represents the complete output of Great Minds working in concert: research, design, strategy, and engineering.
          </p>
        </div>
      </div>
    </div>
  );
}

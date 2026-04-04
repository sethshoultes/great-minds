import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipyard AI — Great Minds Agency",
  description:
    "An entire company, spun up by agents. Own domain, own repo, 4 crons, Cloudflare Pages, Resend transactional email. Shipyard AI builds Emdash sites from PRDs on DigitalOcean.",
};

const toplineStats = [
  { value: "1", label: "Spin-out company", sub: "own domain, own brand" },
  { value: "4", label: "Cron jobs", sub: "build, deploy, monitor, report" },
  { value: "1", label: "Repo", sub: "standalone codebase on DO" },
  { value: "CF", label: "Cloudflare Pages", sub: "edge deployment" },
  { value: "DO", label: "DigitalOcean", sub: "infrastructure" },
  { value: "0", label: "Human ops", sub: "fully agent-managed" },
];

const architecture = [
  {
    layer: "Site Generation",
    stack: ["PRD Parser", "Emdash Templates", "Static Build", "Asset Pipeline"],
    role: "Takes a PRD as input, generates a complete Emdash site — pages, components, styles, content. No manual scaffolding. The PRD is the only input.",
  },
  {
    layer: "Deployment Pipeline",
    stack: ["Cloudflare Pages", "Git Push Deploy", "Edge CDN", "Auto SSL"],
    role: "Every generated site deploys to Cloudflare Pages. Global edge distribution. Automatic SSL. Zero-downtime deploys on every push.",
  },
  {
    layer: "Infrastructure",
    stack: ["DigitalOcean", "Cron Scheduler", "Health Checks", "Log Aggregation"],
    role: "Four cron jobs manage the lifecycle — build new sites, deploy updates, monitor health, and send status reports. All running on DigitalOcean.",
  },
  {
    layer: "Transactional Email",
    stack: ["Resend", "Status Notifications", "Build Reports", "Error Alerts"],
    role: "Resend handles all transactional email. Build success notifications, deployment reports, error alerts. Clients know their site status without checking a dashboard.",
  },
];

const capabilities = [
  {
    name: "PRD-to-Site Pipeline",
    desc: "Write a PRD. Shipyard parses it, generates an Emdash site, builds it, deploys it to Cloudflare Pages, and sends you the live URL. No human intervention at any step.",
  },
  {
    name: "Fully Autonomous Operations",
    desc: "Four cron jobs handle everything — building new sites from queued PRDs, deploying updates, monitoring uptime, and sending status reports. The company runs itself.",
  },
  {
    name: "Cloudflare Edge Deployment",
    desc: "Every site ships to Cloudflare Pages. Global CDN, automatic SSL, instant cache invalidation. Sites load fast everywhere, managed by nobody.",
  },
  {
    name: "Resend Transactional Email",
    desc: "Build notifications, deployment confirmations, error alerts — all sent via Resend. Clients stay informed without logging into anything.",
  },
  {
    name: "Own Domain, Own Brand",
    desc: "Shipyard AI is not a feature of Great Minds. It is a separate company with its own domain (shipyard.company), its own repo, its own infrastructure. Spun out, not bolted on.",
  },
  {
    name: "DigitalOcean Infrastructure",
    desc: "Built on DigitalOcean for simplicity and cost control. Droplets, managed databases, and cron scheduling. No Kubernetes. No over-engineering. Just enough infrastructure to run a company.",
  },
];

export default function ShipyardAIPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/work"
            className="inline-flex items-center text-zinc-500 hover:text-zinc-300 transition-colors no-underline text-sm mb-10"
          >
            ← All Projects
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase">
              Spin-out Company
            </p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              Live
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-zinc-50 mb-4">
            Shipyard AI
          </h1>
          <p className="text-xl sm:text-2xl text-amber-500 font-medium mb-6">
            An Entire Company, Spun Up by Agents
          </p>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-10">
            A separate company built entirely by the Great Minds agency. Own
            domain. Own repo. Own infrastructure on DigitalOcean. Shipyard AI
            takes PRDs and builds complete Emdash sites — deployed to Cloudflare
            Pages with transactional email via Resend. Four crons. Zero human ops.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.shipyard.company"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-zinc-950 text-sm font-semibold hover:bg-amber-400 transition-colors no-underline"
            >
              Visit shipyard.company ↗
            </a>
          </div>
        </div>
      </section>

      {/* Topline numbers */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-10">
            By the numbers
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {toplineStats.map((s) => (
              <div key={s.label}>
                <div className="text-4xl sm:text-5xl font-bold text-zinc-50 font-mono tracking-tight">
                  {s.value}
                </div>
                <div className="text-sm text-zinc-400 mt-1.5 font-medium">
                  {s.label}
                </div>
                <div className="text-xs text-zinc-600 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Architecture
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 mb-4">
            PRD in. Live site out. No humans in the loop.
          </h2>
          <p className="text-zinc-500 mb-12 leading-relaxed max-w-2xl">
            Shipyard AI is a fully autonomous site-building company. It reads
            PRDs, generates Emdash sites, deploys them to the edge, and manages
            the entire lifecycle with four cron jobs. The infrastructure runs on
            DigitalOcean. The sites run on Cloudflare.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {architecture.map((a) => (
              <div
                key={a.layer}
                className="p-6 rounded-xl border border-zinc-800/50 bg-zinc-900/30"
              >
                <h3 className="font-bold text-zinc-100 mb-1">{a.layer}</h3>
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                  {a.role}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {a.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Capabilities
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 mb-12">
            What Shipyard does.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {capabilities.map((d, i) => (
              <div
                key={d.name}
                className="p-6 rounded-xl border border-zinc-800/50 bg-zinc-900/30"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="font-mono text-xs text-amber-500/50 font-bold mt-0.5 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-semibold text-zinc-100 text-sm">
                    {d.name}
                  </h3>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The lesson */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
            <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
              What we learned
            </p>
            <div className="grid sm:grid-cols-3 gap-8">
              <div>
                <p className="font-semibold text-zinc-100 text-sm mb-2">
                  Agents can spin up companies, not just features.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Shipyard AI is not a plugin or a page. It is a separate company
                  with its own domain, infrastructure, and revenue model. The
                  agency built an entire business, not just code.
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-100 text-sm mb-2">
                  Crons are the operating system of autonomous companies.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Four cron jobs replace an entire ops team. Build, deploy,
                  monitor, report — each on its own schedule. The company runs
                  24/7 without a single human checking in.
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-100 text-sm mb-2">
                  Separate concerns mean separate repos.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Shipyard AI lives in its own repository, not a subdirectory of
                  Great Minds. Clean boundaries. Independent deployment. If the
                  parent agency disappears, Shipyard keeps running.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-zinc-800/50 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-4">
            Your company could be next.
          </h2>
          <p className="text-zinc-400 mb-10">
            Write a PRD for a business. The agency will build the company —
            domain, infrastructure, deployment pipeline, and all.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/install"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 transition-colors no-underline"
            >
              Submit a PRD →
            </Link>
            <Link
              href="/work/great-minds-plugin"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:border-zinc-500 transition-colors no-underline"
            >
              Great Minds Plugin →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

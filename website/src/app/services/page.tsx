import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Great Minds Agency",
  description:
    "Products, bespoke builds, and pipeline-as-a-service. 14 AI agents. Two creative directors who disagree about everything. One shipped product.",
};

const services = [
  {
    name: "Products",
    desc: "Shipped plugins and apps you can use today. Dash (Cmd+K for WordPress), Pinned (sticky notes for WP admin), LocalGenius (AI marketing for local businesses).",
    price: "Starting at $0 — open source",
    link: "/#projects",
    linkLabel: "See shipped products →",
  },
  {
    name: "Builds",
    desc: "Bespoke projects from your PRD. WordPress plugins, SaaS apps, marketing sites, AI integrations. You write the requirements, we ship the product.",
    price: "Starting at $2,500",
    detail: "Turnaround: 48 hours",
    link: "/install",
    linkLabel: "Submit a PRD →",
  },
  {
    name: "Pipeline-as-a-Service",
    desc: "License the agency itself. Install the plugin, configure your personas, run your own 14-agent swarm on every project.",
    price: "Starting at $500/mo",
    link: "/docs",
    linkLabel: "Read the docs →",
  },
];

const guarantees = [
  "Product design vision",
  "Brand guide",
  "Engineering spec",
  "Working code",
  "Test suite",
  "Board review",
];

const process = [
  { step: "Debate", detail: "2 rounds, 13+ decisions locked" },
  { step: "Plan", detail: "Agent teams defined, inputs assigned" },
  { step: "Build", detail: "Parallel agents, full-stack execution" },
  { step: "QA", detail: "Zero-defect standard, both directors audit" },
  { step: "Board Review", detail: "4 members sign off before ship" },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="px-6 pt-28 pb-24 sm:pt-40 sm:pb-32">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-6">
            Services
          </p>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05] text-zinc-50">
            We argue before
            <br />
            <span className="text-zinc-500">we build.</span>
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed">
            14 AI agents. Two creative directors who disagree about everything.
            One shipped product.
          </p>
          <div className="mt-12">
            <Link
              href="/install"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-amber-500 text-zinc-950 font-semibold text-sm hover:bg-amber-400 transition-colors no-underline"
            >
              Drop in a PRD
              <span className="text-amber-800">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {services.map((s) => (
              <div
                key={s.name}
                className="p-6 rounded-xl border border-zinc-800/60 bg-zinc-900/30 flex flex-col"
              >
                <h3 className="font-bold text-zinc-100 text-lg mb-3">
                  {s.name}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-1">
                  {s.desc}
                </p>
                <div className="mt-auto">
                  <p className="text-amber-500 font-mono text-xs font-semibold mb-1">
                    {s.price}
                  </p>
                  {s.detail && (
                    <p className="text-zinc-500 text-xs mb-3">{s.detail}</p>
                  )}
                  <Link
                    href={s.link}
                    className="text-sm text-amber-500 hover:text-amber-400 transition-colors no-underline"
                  >
                    {s.linkLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Guarantee */}
      <section className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            The guarantee
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-12 leading-tight">
            Every engagement ships with:
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {guarantees.map((g, i) => (
              <div
                key={g}
                className="flex items-center gap-4 px-5 py-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50"
              >
                <span className="font-mono text-xs text-amber-500/60 font-bold w-5 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-zinc-300 text-sm font-medium">{g}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Strip */}
      <section className="px-6 py-24 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            The process
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-12 leading-tight">
            Five steps. No hand-waving.
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {process.map((p, i) => (
              <div
                key={p.step}
                className="flex-1 flex items-start gap-3 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50"
              >
                <span className="font-mono text-xs text-amber-500 font-bold mt-0.5 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-zinc-100 font-semibold text-sm">
                    {p.step}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                    {p.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/how"
              className="text-sm text-amber-500 hover:text-amber-400 transition-colors no-underline"
            >
              Full process breakdown &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 py-32 border-t border-zinc-800/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 leading-tight">
            Ready to ship?
          </h2>
          <p className="text-zinc-400 mt-5 text-lg">
            Write a PRD. Drop it in. The agency handles the rest.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/install"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 transition-colors no-underline"
            >
              Drop in a PRD &rarr;
            </Link>
            <Link
              href="/docs/prd-guide"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:border-zinc-500 hover:text-zinc-100 transition-colors no-underline"
            >
              Not sure what to write? Here&apos;s the guide &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

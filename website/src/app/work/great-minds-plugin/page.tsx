import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Great Minds Plugin — Great Minds Agency",
  description:
    "14 agents, 11 skills, one install. The Claude Code plugin that powers the Great Minds agency. Agent tool with worktree isolation, decoupled crons, and a board of directors.",
};

const toplineStats = [
  { value: "14", label: "Agents", sub: "directors, specialists, board" },
  { value: "11", label: "Skills", sub: "debate, build, QA, dream, more" },
  { value: "1", label: "Install command", sub: "npx plugins add" },
  { value: "4", label: "Decoupled crons", sub: "orchestrator, heartbeat, organizer, dream" },
  { value: "1", label: "Board of directors", sub: "Warren, Shonda, Oprah, Jensen" },
  { value: "0", label: "Human code required", sub: "PRD in, product out" },
];

const architecture = [
  {
    layer: "Agent Tool",
    stack: ["Claude Code", "Worktree Isolation", "Git Branches", "Parallel Execution"],
    role: "Each agent runs in its own git worktree. No file conflicts. No merge hell. Agents build in parallel on isolated branches, then merge cleanly.",
  },
  {
    layer: "Decoupled Crons",
    stack: ["Orchestrator", "Heartbeat", "Organizer", "Dream"],
    role: "Four independent cron loops. Orchestrator advances state every 5 minutes. Heartbeat updates STATUS.md. Organizer tidies files. Dream consolidates memory hourly.",
  },
  {
    layer: "GSD Integration",
    stack: ["State Machine", "Round Protocol", "STATUS.md", "MEMORY.md"],
    role: "Idle to debate to plan to build to review to ship. Every transition is tracked. Every decision is logged. The agency remembers what worked.",
  },
  {
    layer: "Board of Directors",
    stack: ["Warren Buffett", "Shonda Rhimes", "Oprah Winfrey", "Jensen Huang"],
    role: "Advisory board reviews every project before ship. Market viability, user retention, onboarding experience, and architecture — four lenses on every product.",
  },
];

const agents = [
  { name: "Steve Jobs", role: "Creative Director — taste, design, brand, UX" },
  { name: "Elon Musk", role: "Technical Director — architecture, feasibility, speed" },
  { name: "Marcus Aurelius", role: "Orchestrator — mediates debate, advances state" },
  { name: "Phil Jackson", role: "Integration Lead — merges branches, catches seam bugs" },
  { name: "Margaret Hamilton", role: "QA Lead — finds every bug before ship" },
  { name: "Jensen Huang", role: "Board — architecture review and scaling advisory" },
  { name: "Warren Buffett", role: "Board — market viability and business model" },
  { name: "Shonda Rhimes", role: "Board — user retention and engagement" },
  { name: "Oprah Winfrey", role: "Board — onboarding and first-run experience" },
  { name: "Jony Ive", role: "Design specialist — visual language and craft" },
  { name: "Maya Angelou", role: "Copy specialist — voice, tone, messaging" },
  { name: "Rick Rubin", role: "Creative catalyst — simplify, reduce, focus" },
  { name: "Aaron Sorkin", role: "Narrative specialist — story structure and flow" },
  { name: "Sara Blakely", role: "Growth specialist — positioning and go-to-market" },
];

const keyInnovations = [
  {
    name: "Worktree Isolation",
    desc: "Every agent gets its own git worktree. Steve builds frontend on one branch while Elon builds backend on another. No file locks. No merge conflicts. Parallel execution that actually works.",
  },
  {
    name: "Decoupled Crons",
    desc: "Four independent loops running on different intervals. The orchestrator does not wait for the dream cycle. The heartbeat does not block the build. Each concern runs on its own clock.",
  },
  {
    name: "Memory That Compounds",
    desc: "The dream cycle runs hourly — orient, gather, consolidate, prune. Every project makes the agency smarter. Patterns accumulate. Mistakes are never repeated. The plugin learns.",
  },
  {
    name: "Board Review Protocol",
    desc: "Four advisory board members review every project before ship. Not rubber stamps — real challenges. Warren asks if it is a business. Shonda asks if users will return. The board catches what builders miss.",
  },
];

export default function GreatMindsPluginPage() {
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
              Product
            </p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              Live
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-zinc-50 mb-4">
            Great Minds Plugin
          </h1>
          <p className="text-xl sm:text-2xl text-amber-500 font-medium mb-6">
            14 Agents, One Install
          </p>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-10">
            The Claude Code plugin that powers the entire Great Minds agency.
            Install it, drop in a PRD, and 14 agents debate, plan, build, review,
            and ship your product — with worktree isolation, decoupled crons, and
            a board of directors that reviews every project before it goes live.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-zinc-950 text-sm font-semibold font-mono">
              npx plugins add sethshoultes/great-minds-plugin
            </div>
            <a
              href="https://github.com/sethshoultes/great-minds-plugin"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-500 transition-colors no-underline"
            >
              Source on GitHub ↗
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
            Worktrees. Crons. Memory. Board.
          </h2>
          <p className="text-zinc-500 mb-12 leading-relaxed max-w-2xl">
            The plugin is not a chatbot wrapper. It is a production agency with
            isolated execution, independent scheduling, compounding memory, and
            multi-perspective review. Every piece is decoupled. Every piece scales.
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

      {/* Key Innovations */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Key Innovations
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 mb-12">
            What makes this different.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {keyInnovations.map((d, i) => (
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

      {/* Agent Roster */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            The roster
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 mb-4">
            14 agents. Every one has a job.
          </h2>
          <p className="text-zinc-500 mb-12 leading-relaxed max-w-2xl">
            Two directors who disagree productively. One orchestrator who keeps
            the peace. Specialists who execute. A board that challenges. No filler.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {agents.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-4 px-5 py-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50"
              >
                <span className="text-zinc-100 text-sm font-semibold flex-shrink-0 w-36">
                  {a.name}
                </span>
                <span className="text-zinc-500 text-xs leading-relaxed">
                  {a.role}
                </span>
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
                  Isolation is the foundation.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Without worktree isolation, parallel agent execution is a myth.
                  Agents step on each other, branches conflict, and the orchestrator
                  spends more time resolving merges than advancing state. Worktrees
                  solved this completely.
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-100 text-sm mb-2">
                  Decouple everything that can be decoupled.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Crons should not wait for each other. Memory consolidation should
                  not block builds. The orchestrator should not block on QA. Four
                  independent loops, four independent clocks.
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-100 text-sm mb-2">
                  A board catches what builders cannot see.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Builders are too close to the work. A board with diverse
                  perspectives — market, retention, onboarding, architecture —
                  catches blind spots that no amount of internal review will find.
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
            Install the agency.
          </h2>
          <p className="text-zinc-400 mb-10">
            One command. 14 agents. Drop in a PRD and let the agency build your
            next product.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/install"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 transition-colors no-underline"
            >
              Install now →
            </Link>
            <Link
              href="/work/shipyard-ai"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:border-zinc-500 transition-colors no-underline"
            >
              Shipyard AI →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

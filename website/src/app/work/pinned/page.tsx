import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pinned Case Study — Great Minds Agency",
  description:
    "Post-it notes for WordPress admin. Team handoff notes that stick. 11 files. 3,000+ lines. 6 bugs caught by QA. First 4-member board review.",
};

const toplineStats = [
  { value: "3,000+", label: "Lines of code", sub: "11 files" },
  { value: "5", label: "Note colors", sub: "yellow, blue, green, pink, purple" },
  { value: "6", label: "Bugs caught by QA", sub: "all fixed before ship" },
  { value: "4", label: "Board members reviewed", sub: "first full board review" },
  { value: "5", label: "Agents involved", sub: "2 directors + 3 specialists" },
  { value: "7", label: "Core features", sub: "create, color, age, mention, ack, expiry, roles" },
];

const timeline = [
  {
    phase: "PRD & Debate",
    rounds: "1–2",
    summary:
      "Steve pushed for a tactile, spatial experience — double-click anywhere to create a note, 5 colors, visual aging so old notes fade. Elon pushed for structured data — custom tables over post meta, REST API over admin-ajax, WP Cron for expiry cleanup, and role-based visibility so notes reach the right people. They debated whether @mentions needed real-time notifications or if acknowledgments were enough.",
    decision:
      'Name: "Pinned." Custom database tables for performance. REST API endpoints. Double-click creation with 5 colors. Note aging via CSS opacity. @mentions with acknowledgment tracking. WP Cron for automatic expiry. Role-based visibility filters.',
  },
  {
    phase: "Build",
    rounds: "3–4",
    summary:
      "Steve built the entire frontend in one pass — double-click note creation, draggable positioning, 5-color picker, visual aging based on note age, @mention autocomplete, and acknowledgment buttons. Elon built the PHP backend in parallel — custom database tables, REST API controllers, WP Cron scheduled cleanup, role-based access control, and the @mention notification system.",
    decision:
      "Frontend: Vanilla JS with no dependencies. Backend: PHP 8 with custom tables and REST API. Both worked from the same decisions.md. Zero merge conflicts.",
  },
  {
    phase: "QA",
    rounds: "5",
    summary:
      "Margaret Hamilton found 6 bugs — a race condition in double-click creation, a CSS z-index conflict with WP admin menus, @mention autocomplete failing for usernames with hyphens, note aging calculation off by one day, expiry cron not cleaning up acknowledged notes, and role visibility leaking to logged-out users. All six fixed in the same round.",
    decision:
      "All 6 bugs fixed. Re-review passed. Margaret: GO. Jensen: GO with advisory notes on scaling.",
  },
  {
    phase: "Board Review",
    rounds: "6",
    summary:
      'First project to go through the full 4-member advisory board. Warren Buffett challenged the market positioning: "This is a hobby, not a business — who pays for sticky notes?" Shonda Rhimes pushed for threading: "Without replies, notes are shout-into-the-void. You need conversation for retention." Oprah Winfrey focused on onboarding: "Add an example note on first install so new users see the value immediately." Jensen Huang approved the architecture.',
    decision:
      "Board feedback logged for future iterations. Ship approved with current feature set. Threading and onboarding improvements queued for v2.",
  },
];

const architecture = [
  {
    layer: "Note Creation UI",
    stack: ["Vanilla JS", "Double-click Handler", "Color Picker", "Drag & Drop"],
    role: "Double-click anywhere on the admin dashboard to create a note. Choose from 5 colors. Drag to reposition. Notes persist position across sessions.",
  },
  {
    layer: "REST API",
    stack: ["WP REST API", "Custom Endpoints", "Nonce Auth", "JSON Responses"],
    role: "Full CRUD for notes via REST. Create, read, update, delete, acknowledge, and filter by role. All endpoints capability-checked and nonce-verified.",
  },
  {
    layer: "Custom Tables",
    stack: ["wp_pinned_notes", "wp_pinned_mentions", "wp_pinned_acks", "dbDelta"],
    role: "Three custom tables for notes, mentions, and acknowledgments. Indexed for fast dashboard queries. No post meta overhead.",
  },
  {
    layer: "Background Jobs",
    stack: ["WP Cron", "Expiry Cleanup", "Note Aging", "Role Sync"],
    role: "Hourly cron job removes expired notes. Note aging calculates visual opacity based on creation date. Role visibility synced on user role change.",
  },
];

const deliverables = [
  {
    name: "Double-Click Note Creation",
    desc: "Click anywhere on the WordPress admin dashboard to spawn a new sticky note. Position persists. No modal, no form — just write.",
    agent: "Steve Jobs (Frontend)",
  },
  {
    name: "5-Color System",
    desc: "Yellow, blue, green, pink, purple. Each color can carry team meaning — yellow for general, red for urgent, green for done. No enforcement, just convention.",
    agent: "Steve Jobs (Frontend)",
  },
  {
    name: "Note Aging",
    desc: "Notes visually fade over time via CSS opacity. A 7-day-old note looks different from a fresh one. Creates natural pressure to acknowledge or clean up.",
    agent: "Steve Jobs + Elon Musk",
  },
  {
    name: "@Mentions & Acknowledgments",
    desc: "Tag teammates with @username. Recipients see a notification badge. Click to acknowledge — the sender knows it was read. No email, no Slack — just the admin.",
    agent: "Elon Musk (Backend)",
  },
  {
    name: "Expiry & Cron Cleanup",
    desc: "Set an expiry date on any note. WP Cron removes expired notes hourly. No manual cleanup needed. Dashboard stays clean automatically.",
    agent: "Elon Musk (Backend)",
  },
  {
    name: "Role-Based Visibility",
    desc: "Notes can target specific roles — show a note only to editors, or only to admins. Everyone sees their own notes. No information leaks across roles.",
    agent: "Elon Musk (Backend)",
  },
];

const boardQuotes = [
  {
    name: "Warren Buffett",
    role: "Market Viability",
    quote: "This is a hobby, not a business. Who pays for sticky notes? You need to answer the 'why not just use Slack' question before this ships.",
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
  },
  {
    name: "Shonda Rhimes",
    role: "User Retention",
    quote: "Without threading, notes are shout-into-the-void. You need conversation — replies, reactions, something that keeps people coming back. That's retention.",
    color: "text-pink-400",
    border: "border-pink-500/20",
    bg: "bg-pink-500/5",
  },
  {
    name: "Oprah Winfrey",
    role: "Onboarding Experience",
    quote: "Add an example note on first install. A welcome note that shows the colors, the mentions, the aging. Let people feel it before they have to learn it.",
    color: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
  },
  {
    name: "Jensen Huang",
    role: "Architecture",
    quote: "Custom tables are the right call. Post meta would choke at scale. REST API is clean. Ship it — the board feedback is for v2.",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
];

export default function PinnedCaseStudy() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-zinc-500 hover:text-zinc-300 transition-colors no-underline text-sm mb-10"
          >
            ← Home
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase">
              Case Study
            </p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              Shipped
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-zinc-50 mb-4">
            Pinned
          </h1>
          <p className="text-xl sm:text-2xl text-amber-500 font-medium mb-6">
            Post-it Notes for WordPress Admin. Team handoff notes that stick.
          </p>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-10">
            Full agency pipeline — PRD to shipped plugin in one session. Two
            debate rounds, parallel build, QA caught 6 bugs (all fixed), and the
            first project to receive a full 4-member advisory board review.
          </p>

          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-zinc-950 text-sm font-semibold">
              WordPress Plugin — PHP 8
            </span>
            <a
              href="https://github.com/sethshoultes/great-minds"
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

      {/* The story — timeline */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            The build
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 mb-2">
            One session. Four phases. First board review.
          </h2>
          <p className="text-zinc-500 mb-12 leading-relaxed">
            Two creative directors. One orchestrator. Two QA specialists. Four
            advisory board members. Zero humans writing code.
          </p>

          <div className="space-y-4">
            {timeline.map((t) => (
              <div
                key={t.phase}
                className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 overflow-hidden"
              >
                <div className="px-7 py-6">
                  <div className="flex items-baseline gap-3 mb-4">
                    <h3 className="text-lg font-bold text-zinc-100">
                      {t.phase}
                    </h3>
                    <span className="font-mono text-xs text-zinc-600">
                      Round{t.rounds.includes("–") ? "s" : ""} {t.rounds}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-5">
                    {t.summary}
                  </p>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-800/40 border border-zinc-700/40">
                    <span className="text-amber-500 text-xs font-bold uppercase tracking-wider font-mono mt-0.5 flex-shrink-0">
                      Decision
                    </span>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {t.decision}
                    </p>
                  </div>
                </div>
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
            Custom tables. REST API. Zero post meta.
          </h2>
          <p className="text-zinc-500 mb-12 leading-relaxed max-w-2xl">
            The core decision: custom database tables over WordPress post meta.
            Notes are not posts — they&apos;re lightweight, ephemeral, and
            high-frequency. Custom tables give indexed queries, clean schema, and
            no meta_key/meta_value overhead.
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

      {/* Deliverables */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Deliverables
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 mb-12">
            What the agency produced.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {deliverables.map((d, i) => (
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
                <p className="text-zinc-400 text-xs leading-relaxed mb-3">
                  {d.desc}
                </p>
                <p className="text-zinc-600 text-xs font-mono">{d.agent}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Review */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-500 font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            Advisory Board
          </p>
          <h2 className="text-3xl font-bold text-zinc-100 mb-4">
            First 4-member board review.
          </h2>
          <p className="text-zinc-500 mb-12 leading-relaxed max-w-2xl">
            Pinned was the first project reviewed by all four advisory board
            members. Their feedback shaped the v2 roadmap before v1 even shipped.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {boardQuotes.map((b) => (
              <div
                key={b.name}
                className={`p-6 rounded-xl border ${b.border} ${b.bg}`}
              >
                <p
                  className={`font-mono text-xs font-semibold tracking-widest uppercase mb-1 ${b.color}`}
                >
                  {b.name}
                </p>
                <p className="text-zinc-600 text-xs mb-4">{b.role}</p>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  &ldquo;{b.quote}&rdquo;
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
                  Board review before ship catches strategy gaps.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Buffett&apos;s &ldquo;hobby not a business&rdquo; challenge forced the
                  team to articulate the value proposition. That clarity would
                  have been missed without the board round.
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-100 text-sm mb-2">
                  QA at scale finds integration bugs code review misses.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Six bugs — none visible in isolated code review. The z-index
                  conflict, the hyphenated username edge case, the off-by-one
                  aging — all required running the full plugin in a real WordPress
                  environment.
                </p>
              </div>
              <div>
                <p className="font-semibold text-zinc-100 text-sm mb-2">
                  Ship v1, queue v2.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Threading, onboarding notes, and Slack-style reactions all came
                  from board feedback. Instead of blocking the ship, they became
                  the v2 roadmap. Ship what works. Improve what matters.
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
            Your PRD could be next.
          </h2>
          <p className="text-zinc-400 mb-10">
            Write a clear requirements document. Drop it in. The agency debates,
            plans, builds, reviews, and ships. You get the product.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/install"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 transition-colors no-underline"
            >
              Submit a PRD →
            </Link>
            <Link
              href="/work/dash"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:border-zinc-500 transition-colors no-underline"
            >
              Dash case study
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

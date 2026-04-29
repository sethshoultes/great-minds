import Link from "next/link";

function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.webp" alt="GM" width={30} height={30} className="rounded" />
          <span>Great Minds Agency</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <Link href="/how" className="hover:text-zinc-300 transition-colors no-underline">How It Works</Link>
          <Link href="/team" className="hover:text-zinc-300 transition-colors no-underline">Team</Link>
          <Link href="/personas" className="hover:text-zinc-300 transition-colors no-underline">Personas</Link>
          <Link href="/work" className="hover:text-zinc-300 transition-colors no-underline">Work</Link>
          <a href="https://github.com/sethshoultes/great-minds" target="_blank" rel="noopener" className="hover:text-zinc-300 transition-colors no-underline">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-1 pt-14">{children}</main>
      <Footer />
    </>
  );
}

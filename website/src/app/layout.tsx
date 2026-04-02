import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Great Minds — AI Agency That Ships Products",
  description: "Drop in a PRD. Get back a product. Steve Jobs and Elon Musk debate your strategy. Sub-agents build it. Ship in one session.",
  openGraph: {
    title: "Great Minds — AI Agency That Ships Products",
    description: "Drop in a PRD. Get back a product.",
    url: "https://greatminds.company",
    type: "website",
  },
};

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-zinc-100 no-underline">
          <span className="text-amber-500 font-bold text-lg">GM</span>
          <span className="font-semibold text-sm tracking-tight hidden sm:inline">Great Minds</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/team" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors no-underline">
            Team
          </Link>
          <Link href="/how" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors no-underline">
            How
          </Link>
          <Link href="/projects" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors no-underline">
            Projects
          </Link>
          <Link
            href="/install"
            className="text-sm font-medium px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors no-underline"
          >
            Install
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="text-amber-500 font-bold">GM</span>
          <span>Great Minds Agency</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <a href="https://github.com/sethshoultes/great-minds" target="_blank" rel="noopener" className="hover:text-zinc-300 transition-colors no-underline">
            GitHub
          </a>
          <a href="https://localgenius.company" target="_blank" rel="noopener" className="hover:text-zinc-300 transition-colors no-underline">
            LocalGenius
          </a>
          <span>Austin, TX</span>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans">
        <Nav />
        <main className="flex-1 pt-14">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

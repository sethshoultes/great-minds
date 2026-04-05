import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Nav from "@/components/Nav";
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
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Great Minds — AI Agency That Ships Products",
    description: "Drop in a PRD. Get back a product.",
    url: "https://greatminds.company",
    type: "website",
    images: ["/og-image.svg"],
  },
};


function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <img src="/logo-icon.webp" alt="GM" width={20} height={20} className="rounded" />
          <span>Great Minds Agency</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <Link href="/how" className="hover:text-zinc-300 transition-colors no-underline">How It Works</Link>
          <Link href="/team" className="hover:text-zinc-300 transition-colors no-underline">Team</Link>
          <Link href="/work" className="hover:text-zinc-300 transition-colors no-underline">Work</Link>
          <a href="https://github.com/sethshoultes/great-minds" target="_blank" rel="noopener" className="hover:text-zinc-300 transition-colors no-underline">
            GitHub
          </a>
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

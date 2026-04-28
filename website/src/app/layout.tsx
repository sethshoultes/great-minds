import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import SiteShell from "@/components/SiteShell";
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
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

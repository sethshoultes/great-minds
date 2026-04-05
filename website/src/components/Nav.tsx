"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/how", label: "How It Works" },
  { href: "/team", label: "Team" },
  { href: "/work", label: "Work" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-zinc-100 no-underline"
        >
          <img src="/logo-icon.webp" alt="Great Minds" width={28} height={28} className="rounded" />
          <span className="font-semibold text-sm tracking-tight hidden sm:inline">
            Great Minds
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors no-underline"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/install"
            className="text-sm font-medium px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors no-underline"
          >
            Submit PRD
          </Link>
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden relative w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-zinc-100 transition-colors"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {/* Top bar */}
          <span
            className={`absolute left-1 h-0.5 w-6 bg-current rounded transition-all duration-300 ${
              open ? "rotate-45 top-[15px]" : "top-[9px]"
            }`}
          />
          {/* Middle bar */}
          <span
            className={`absolute left-1 h-0.5 w-6 bg-current rounded transition-all duration-300 ${
              open ? "opacity-0" : "top-[15px] opacity-100"
            }`}
          />
          {/* Bottom bar */}
          <span
            className={`absolute left-1 h-0.5 w-6 bg-current rounded transition-all duration-300 ${
              open ? "-rotate-45 top-[15px]" : "top-[21px]"
            }`}
          />
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 top-14 bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile slide-down menu */}
      <div
        className={`absolute left-0 right-0 top-14 bg-zinc-950 border-b border-zinc-800/50 shadow-2xl shadow-black/40 transition-all duration-300 ease-out md:hidden ${
          open
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2.5 rounded-lg text-sm transition-colors no-underline ${
                pathname === link.href
                  ? "text-amber-400 bg-amber-500/10"
                  : "text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50"
              }`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 pt-2 border-t border-zinc-800/50">
            <Link
              href="/install"
              className="block text-center text-sm font-medium px-4 py-2.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors no-underline"
              onClick={() => setOpen(false)}
            >
              Submit PRD
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

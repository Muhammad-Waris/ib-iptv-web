"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

const SESSION_KEY = "iptv_session";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getSnapshot() {
  return localStorage.getItem(SESSION_KEY) !== null;
}

function getServerSnapshot() {
  return false;
}

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/activate-device", label: "Activate Device" },
  { href: "/download", label: "Download" },
  { href: "/how-to-activate", label: "How It Works" },
  { href: "/contact", label: "Support" },
];

const AUTH_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/manage-playlist", label: "Manage Playlist" },
  { href: "/download", label: "Download" },
  { href: "/contact", label: "Support" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const links = isLoggedIn ? AUTH_LINKS : PUBLIC_LINKS;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          IPTV<span className="text-primary">Media</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-light hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-light hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-surface-light hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/activate-device", label: "Activate Device" },
  { href: "/download", label: "Download" },
  { href: "/how-to-activate", label: "How to Activate" },
  { href: "/how-to-add-playlist", label: "How to Add Playlist" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight text-white">
              IPTV<span className="text-primary">Player</span>
            </Link>
            <p className="mt-3 text-sm text-muted">
              Stream smarter with fast device activation and seamless playlist management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>
            <p className="text-sm text-muted">
              IPTV Player is a media player application only. We do not provide, host, or
              distribute any media content. Users are solely responsible for the content they access.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted">
          © {new Date().getFullYear()} IPTV Player. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import { Tv2 } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "All IPTV" },
  { href: "/channels", label: "Channels" },
  { href: "/live", label: "Live Sports" },
  { href: "/football", label: "Football" },
  { href: "/standings", label: "Point Table" },
  { href: "/blog", label: "Blog" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-white/[0.06] border-t bg-white/[0.02]">
      <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="gradient-brand flex h-9 w-9 items-center justify-center rounded-xl shadow-lg">
                <Tv2 className="h-5 w-5 text-white" />
              </div>
              <span className="logo-text-shimmer font-bold text-xl tracking-tight">
                Sportzfy
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-muted-foreground text-sm leading-relaxed">
              Watch free live IPTV channels in HD, including sports, football, news,
              movies, and entertainment from around the world.
            </p>
            <p className="mt-4 text-muted-foreground text-xs">
              For personal use only. All streams are publicly available.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 font-semibold text-foreground text-sm">Navigation</h3>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground text-sm">More</h3>
            <ul className="space-y-2">
              {NAV_LINKS.slice(4).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-white/[0.06] border-t pt-6 text-center text-muted-foreground text-xs">
          © {year} Sportzfy. Free live IPTV streaming directory.
        </div>
      </div>
    </footer>
  );
}

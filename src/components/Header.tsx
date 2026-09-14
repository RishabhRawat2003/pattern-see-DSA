"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/level/1", label: "01", name: "Must-Have", live: true },
  { href: "/level/2", label: "02", name: "Strong Mid", live: true },
  { href: "/level/3", label: "03", name: "Product", live: true },
];

export function Header() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 pt-[env(safe-area-inset-top)] transition-colors duration-300 ${
        scrolled
          ? "border-b border-[var(--line)] bg-[#100f0e]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 min-w-0 max-w-6xl items-center gap-2 px-3 sm:h-[4.25rem] sm:gap-3 sm:px-6">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2 sm:gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-saffron text-ink sm:h-9 sm:w-9">
            <span className="display text-base leading-none sm:text-lg">∇</span>
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold tracking-tight text-paper sm:text-[15px]">
              Patternsee
            </span>
            <span className="hidden text-[11px] text-muted sm:block">Visual DSA</span>
          </span>
        </Link>

        <nav
          className="mx-auto hidden items-center rounded-full border border-[var(--line)] bg-paper/[0.03] p-1 lg:flex"
          aria-label="Interview levels"
        >
          {links.map((l) => {
            const active = l.live && path.startsWith(l.href);
            const className = `flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] transition ${
              active
                ? "bg-saffron text-ink shadow-sm"
                : l.live
                  ? "text-muted hover:text-paper"
                  : "cursor-not-allowed text-muted/40"
            }`;
            const inner = (
              <>
                <span className="font-mono text-[10px] opacity-80">{l.label}</span>
                <span>{l.name}</span>
              </>
            );
            if (!l.live) {
              return (
                <span key={l.href} title="Coming next" className={className}>
                  {inner}
                </span>
              );
            }
            return (
              <Link key={l.href} href={l.href} className={className}>
                {inner}
              </Link>
            );
          })}
        </nav>

        <nav
          className="ml-auto flex min-w-0 items-center gap-0.5 sm:gap-1 lg:hidden"
          aria-label="Interview levels"
        >
          {links.map((l) => {
            const active = l.live && path.startsWith(l.href);
            const className = `grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-[11px] sm:h-9 sm:w-9 sm:text-xs ${
              active
                ? "bg-saffron text-ink"
                : l.live
                  ? "text-muted"
                  : "cursor-not-allowed text-muted/40"
            }`;
            if (!l.live) {
              return (
                <span key={l.href} title="Coming next" className={className}>
                  {l.label}
                </span>
              );
            }
            return (
              <Link key={l.href} href={l.href} title={l.name} className={className}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 lg:ml-auto">
          <Link
            href="/playground"
            className="hidden text-xs text-muted hover:text-paper sm:inline"
          >
            Code lab
          </Link>
          <Link
            href="/review"
            className="hidden text-xs text-muted hover:text-paper sm:inline"
          >
            Review
          </Link>
          <Link
            href="/patterns/two-pointers"
            className="btn btn-primary !rounded-full px-2.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-[13px]"
          >
            Start
          </Link>
        </div>
      </div>
    </header>
  );
}

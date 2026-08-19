import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 mt-auto border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-8">
        <div>
          <p className="display text-lg text-paper/90">{site.name}</p>
          <p className="mt-1 text-xs">{site.tagline}</p>
        </div>
        <nav className="flex flex-wrap gap-4 font-mono text-xs">
          <Link href="/level/1" className="hover:text-paper">
            Level 1
          </Link>
          <Link href="/level/2" className="hover:text-paper">
            Level 2
          </Link>
          <Link href="/level/3" className="hover:text-paper">
            Level 3
          </Link>
          <Link href="/review" className="hover:text-paper">
            Review
          </Link>
          <Link href="/patterns/two-pointers" className="hover:text-paper">
            Two Pointers
          </Link>
          <span>© {year}</span>
        </nav>
      </div>
    </footer>
  );
}

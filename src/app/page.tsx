import type { Metadata } from "next";
import Link from "next/link";
import { HeroSketch } from "@/components/HeroSketch";
import { JsonLd } from "@/components/JsonLd";
import { allPatterns, levels } from "@/lib/curriculum";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${site.name} — Visual DSA patterns for coding interviews`,
  },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  const l1 = levels[0];
  const patternCount = l1.groups.reduce((n, g) => n + g.patterns.length, 0);
  const livePatterns = allPatterns().filter((p) => p.ready);

  return (
    <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-14 lg:py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: `${site.name}: Visual DSA interview prep`,
          description: site.description,
          provider: { "@type": "Organization", name: site.name, url: site.url },
          educationalLevel: "Beginner to intermediate",
          teaches: livePatterns.map((p) => p.title),
          url: site.url,
          inLanguage: "en",
        }}
      />
      <section className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        <div>
          <p className="kicker">{site.name} · visual DSA</p>
          <h1 className="display mt-4 text-[clamp(2rem,9vw,3.75rem)] leading-[1.1] text-paper sm:mt-5">
            Patterns you can
            <em className="block italic text-saffron">see unfolding.</em>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-7 text-muted sm:mt-6 sm:text-[17px] sm:leading-8">
            {site.name} turns DSA interview patterns into playable walkthroughs.
            Level 1 is the must-haves. Level 2 adds trees, heaps, graphs, and
            backtracking. Level 3 covers DP, shortest paths, DSU, bits, and tries.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Link href="/level/1" className="btn btn-primary w-full sm:w-auto">
              Open Level 1
            </Link>
            <Link href="/patterns/two-pointers" className="btn btn-ghost w-full sm:w-auto">
              Watch Two Pointers
            </Link>
            <Link href="/review" className="btn btn-ghost w-full sm:w-auto">
              Review queue
            </Link>
          </div>
        </div>

        <HeroSketch />
      </section>

      <section className="mt-12 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {levels.map((level) => {
          const count = level.groups.reduce((n, g) => n + g.patterns.length, 0);
          const accent =
            level.id === 1 ? "text-jade" : level.id === 2 ? "text-saffron" : "text-rose-300";
          const inner = (
            <article
              className={`surface relative h-full overflow-hidden rounded-2xl p-5 sm:p-6 ${
                level.ready ? "surface-hover" : "opacity-70"
              }`}
            >
              <span className={`display absolute -right-2 -top-3 text-7xl text-paper/5`}>
                {level.id}
              </span>
              <p className={`font-mono text-xs ${accent}`}>
                Level {level.id} · {level.band}
              </p>
              <h2 className="display mt-4 text-2xl text-paper sm:text-3xl">{level.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{level.subtitle}</p>
              <p className="mt-4 text-sm leading-6 text-muted/80">{level.warning}</p>
              <p className="mt-6 font-mono text-[11px] text-muted/70">
                {level.groups.length} groups · {count} patterns
                {level.ready ? "" : " · locked"}
              </p>
            </article>
          );
          return level.ready ? (
            <Link key={level.id} href={`/level/${level.id}`}>
              {inner}
            </Link>
          ) : (
            <div key={level.id} className="cursor-not-allowed">
              {inner}
            </div>
          );
        })}
      </section>

      <section className="mt-12 sm:mt-20">
        <div className="mb-6 flex items-end justify-between gap-3 sm:mb-8">
          <div>
            <p className="kicker">Level 1</p>
            <h2 className="display mt-2 text-3xl text-paper sm:text-4xl">Six families</h2>
            <p className="mt-2 text-sm text-muted">
              {patternCount} playable patterns.
            </p>
          </div>
          <Link href="/level/1" className="shrink-0 text-sm text-saffron hover:underline">
            Browse all
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {l1.groups.map((group) => (
            <Link
              key={group.id}
              href={`/level/1#${group.id}`}
              className="surface surface-hover group rounded-2xl p-5"
            >
              <p className="font-mono text-[11px] text-saffron">{group.emoji}</p>
              <h3 className="mt-3 text-[15px] font-semibold text-paper">{group.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{group.blurb}</p>
              <p className="mt-4 font-mono text-[11px] text-muted/60">
                {group.patterns.length} topics
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

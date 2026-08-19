import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PatternMark } from "@/components/PatternMark";
import { getLevel } from "@/lib/curriculum";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const level = getLevel(Number(id));
  if (!level) return { title: "Level not found" };
  const count = level.groups.reduce((n, g) => n + g.patterns.length, 0);
  const title = `Level ${level.id} ${level.title} — ${level.band} DSA patterns`;
  const description = `${level.warning} ${count} patterns across ${level.groups.length} groups on ${site.name}.`;
  return {
    title,
    description,
    alternates: { canonical: `/level/${level.id}` },
    openGraph: { title, description, url: `/level/${level.id}` },
  };
}

export default async function LevelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const level = getLevel(Number(id));
  if (!level) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/" className="text-sm text-muted hover:text-paper">
        ← All levels
      </Link>

      <div className="mt-6 flex flex-col gap-8 sm:mt-8 lg:flex-row lg:gap-10">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:w-60 lg:shrink-0 lg:self-start">
          <p className="kicker">
            Level {level.id} · {level.band}
          </p>
          <h1 className="display mt-3 text-3xl text-paper sm:text-4xl">{level.title}</h1>
          <p className="mt-3 text-sm leading-7 text-muted">{level.warning}</p>
          <nav className="viz-scroll mt-5 flex gap-2 pb-1 lg:mt-6 lg:block lg:space-y-0.5 lg:pb-0">
            {level.groups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="shrink-0 whitespace-nowrap rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-muted hover:bg-paper/5 hover:text-paper lg:block lg:rounded-md lg:border-0 lg:px-2 lg:py-2 lg:text-sm"
              >
                <span className="mr-1.5 font-mono text-[10px] text-saffron">
                  {group.emoji}
                </span>
                {group.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 space-y-10 sm:space-y-14">
          {!level.ready ? (
            <div className="surface rounded-2xl p-6 text-muted sm:p-10">
              Structure is in place. Visualizations for this level will be built next.
            </div>
          ) : null}

          {level.groups.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-20 sm:scroll-mt-24">
              <p className="kicker">{group.emoji}</p>
              <h2 className="display mt-1 text-2xl text-paper sm:text-3xl">{group.title}</h2>
              <p className="mt-1 text-sm text-muted">{group.blurb}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {group.patterns.map((pattern) =>
                  pattern.ready ? (
                    <Link
                      key={pattern.slug}
                      href={`/patterns/${pattern.slug}`}
                      className="surface surface-hover group rounded-2xl p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="min-w-0 break-words font-semibold text-paper">{pattern.title}</h3>
                        <span className="flex shrink-0 items-center gap-2">
                          <PatternMark slug={pattern.slug} />
                          <span className="text-muted/50 group-hover:text-saffron">→</span>
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                        {pattern.intuition}
                      </p>
                      <p className="mt-4 font-mono text-[11px] text-jade">
                        {pattern.complexity.time} · {pattern.complexity.space}
                      </p>
                    </Link>
                  ) : (
                    <div
                      key={pattern.slug}
                      className="rounded-2xl border border-[var(--line)] p-5 opacity-50"
                    >
                      <h3 className="font-semibold text-paper/80">{pattern.title}</h3>
                      <p className="mt-2 text-sm text-muted">Coming with this level.</p>
                    </div>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

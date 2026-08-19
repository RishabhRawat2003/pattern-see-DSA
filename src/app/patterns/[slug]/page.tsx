import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PatternDrill } from "@/components/PatternDrill";
import { PatternVisualizer } from "@/components/viz/PatternVisualizer";
import { allPatterns, getGroupByPattern, getPattern } from "@/lib/curriculum";
import { getPractice } from "@/lib/practice";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return allPatterns().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getPattern(slug);
  const ctx = getGroupByPattern(slug);
  if (!pattern || !ctx) return { title: "Pattern not found" };
  const title = `${pattern.title} visualization`;
  const description = `${pattern.intuition} Time ${pattern.complexity.time}, extra space ${pattern.complexity.space}. Example: ${pattern.example}`;
  return {
    title,
    description,
    keywords: [pattern.title, ctx.group.title, "DSA", "visualization", site.name],
    alternates: { canonical: `/patterns/${pattern.slug}` },
    openGraph: {
      title: `${pattern.title} · ${site.name}`,
      description,
      url: `/patterns/${pattern.slug}`,
      type: "article",
    },
  };
}

export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = getPattern(slug);
  const ctx = getGroupByPattern(slug);
  if (!pattern || !ctx) notFound();

  const siblings = ctx.group.patterns;
  const idx = siblings.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? siblings[idx - 1] : undefined;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : undefined;
  const practice = getPractice(pattern.slug);

  return (
    <main className="mx-auto w-full max-w-5xl min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: pattern.title,
          description: pattern.intuition,
          educationalLevel: `Level ${pattern.level}`,
          learningResourceType: "Interactive visualization",
          url: `${site.url}/patterns/${pattern.slug}`,
          isPartOf: { "@type": "Course", name: site.name, url: site.url },
          teaches: pattern.title,
        }}
      />
      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
        <Link href="/" className="hover:text-paper">
          Home
        </Link>
        <span>/</span>
        <Link href={`/level/${pattern.level}`} className="hover:text-paper">
          Level {pattern.level}
        </Link>
        <span className="hidden sm:inline">/</span>
        <span className="hidden text-paper/70 sm:inline">{ctx.group.title}</span>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="kicker">{ctx.group.title}</p>
          <h1 className="display mt-2 text-[clamp(1.6rem,7vw,3rem)] leading-tight text-paper">
            {pattern.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">{pattern.example}</p>
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-[11px]">
          <span className="rounded-md border border-[var(--line)] px-2.5 py-1 text-jade">
            {pattern.complexity.time}
          </span>
          <span className="rounded-md border border-[var(--line)] px-2.5 py-1 text-sky-300">
            {pattern.complexity.space}
          </span>
        </div>
      </div>

      {!pattern.ready ? (
        <div className="surface mt-10 rounded-2xl p-10 text-muted">
          This pattern is listed in the sheet. Its visualization ships with Level{" "}
          {pattern.level}.
        </div>
      ) : (
        <>
          <section className="mt-8 min-w-0">
            <PatternVisualizer slug={pattern.slug} />
          </section>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Info title="Intuition" body={pattern.intuition} />
            <Info title="When to use" body={pattern.whenToUse} />
          </div>
          {practice ? <PatternDrill slug={pattern.slug} pack={practice} /> : null}
        </>
      )}

      <div className="mt-10 grid gap-3 border-t border-[var(--line)] pt-6 sm:mt-12 sm:grid-cols-2">
        {prev?.ready ? (
          <Link href={`/patterns/${prev.slug}`} className="surface surface-hover rounded-2xl p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Previous</p>
            <p className="mt-1 break-words text-paper">← {prev.title}</p>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next?.ready ? (
          <Link
            href={`/patterns/${next.slug}`}
            className="surface surface-hover rounded-2xl p-4 sm:text-right"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Next</p>
            <p className="mt-1 break-words text-paper">{next.title} →</p>
          </Link>
        ) : null}
      </div>
    </main>
  );
}

function Info({ title, body }: { title: string; body: string }) {
  return (
    <div className="surface rounded-2xl p-5">
      <p className="kicker">{title}</p>
      <p className="mt-3 text-sm leading-7 text-paper/85">{body}</p>
    </div>
  );
}

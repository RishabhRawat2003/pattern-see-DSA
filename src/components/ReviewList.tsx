"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { allPatterns } from "@/lib/curriculum";
import { getEntry, isDue, loadProgress, type ProgressStore } from "@/lib/progress";

export function ReviewList() {
  const [store, setStore] = useState<ProgressStore>({ patterns: {} });

  useEffect(() => {
    const read = () => setStore(loadProgress());
    read();
    window.addEventListener("patternsee-progress", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("patternsee-progress", read);
      window.removeEventListener("storage", read);
    };
  }, []);

  const patterns = useMemo(() => allPatterns().filter((p) => p.ready), []);

  const due = patterns.filter((p) => isDue(getEntry(store, p.slug)));
  const waiting = patterns.filter((p) => {
    const e = getEntry(store, p.slug);
    return e.mark === "review" && !isDue(e);
  });
  const done = patterns.filter((p) => getEntry(store, p.slug).mark === "done");
  const inProgress = patterns.filter((p) => {
    const e = getEntry(store, p.slug);
    return e.mark === "unset" && e.solved.length > 0;
  });

  return (
    <div className="mt-8 space-y-8">
      <Block title="Due now" empty="Nothing due. Tag a pattern with Review in 2 days." count={due.length}>
        {due.map((p) => (
          <Row
            key={p.slug}
            href={`/patterns/${p.slug}`}
            title={p.title}
            meta={`Level ${p.level} · ${getEntry(store, p.slug).solved.length}/3 problems`}
          />
        ))}
      </Block>
      <Block title="Coming up" empty="No scheduled reviews." count={waiting.length}>
        {waiting.map((p) => {
          const e = getEntry(store, p.slug);
          return (
            <Row
              key={p.slug}
              href={`/patterns/${p.slug}`}
              title={p.title}
              meta={`Due ${new Date(e.reviewAt ?? 0).toLocaleDateString()}`}
            />
          );
        })}
      </Block>
      <Block title="Started" empty="Check off a problem on any pattern page." count={inProgress.length}>
        {inProgress.map((p) => (
          <Row
            key={p.slug}
            href={`/patterns/${p.slug}`}
            title={p.title}
            meta={`${getEntry(store, p.slug).solved.length}/3 problems`}
          />
        ))}
      </Block>
      <Block title="Got it" empty="Mark Got it after the three problems feel easy." count={done.length}>
        {done.map((p) => (
          <Row
            key={p.slug}
            href={`/patterns/${p.slug}`}
            title={p.title}
            meta={`${getEntry(store, p.slug).solved.length}/3`}
          />
        ))}
      </Block>
    </div>
  );
}

function Block({
  title,
  empty,
  count,
  children,
}: {
  title: string;
  empty: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="display text-2xl text-paper">{title}</h2>
      {count === 0 ? (
        <p className="mt-2 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">{children}</ul>
      )}
    </section>
  );
}

function Row({ href, title, meta }: { href: string; title: string; meta: string }) {
  return (
    <li>
      <Link href={href} className="surface surface-hover flex items-center justify-between gap-3 rounded-xl px-4 py-3">
        <span className="min-w-0">
          <span className="block truncate text-paper">{title}</span>
          <span className="font-mono text-[11px] text-muted">{meta}</span>
        </span>
        <span className="text-muted">→</span>
      </Link>
    </li>
  );
}

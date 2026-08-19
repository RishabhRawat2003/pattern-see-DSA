"use client";

import { useCallback, useEffect, useState } from "react";
import { templateLangs } from "@/lib/practice/helpers";
import type { PracticePack, TemplateLang } from "@/lib/types";
import {
  getEntry,
  isDue,
  loadProgress,
  setMark,
  toggleSolved,
  type PatternProgress,
} from "@/lib/progress";

const LANG_KEY = "patternsee-template-lang";

export function PatternDrill({ slug, pack }: { slug: string; pack: PracticePack }) {
  const [entry, setEntry] = useState<PatternProgress>({ mark: "unset", solved: [] });
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState<TemplateLang>("python");

  const refresh = useCallback(() => {
    setEntry(getEntry(loadProgress(), slug));
  }, [slug]);

  useEffect(() => {
    refresh();
    const saved = window.localStorage.getItem(LANG_KEY);
    if (saved === "python" || saved === "cpp" || saved === "java" || saved === "javascript") {
      setLang(saved);
    }
    window.addEventListener("patternsee-progress", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("patternsee-progress", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const due = isDue(entry);
  const solvedSet = new Set(entry.solved);
  const code = pack.templates[lang];

  return (
    <section className="mt-8 space-y-4">
      <div className="surface rounded-2xl p-5">
        <p className="kicker">From the prompt</p>
        <p className="mt-3 text-sm leading-7 text-paper/85">{pack.cue}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--line)]">
        <div className="flex flex-col gap-3 border-b border-[var(--line)] bg-[var(--ink-2)] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="viz-scroll flex min-w-0 gap-1">
            {templateLangs.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
                  lang === l.id ? "bg-saffron text-ink" : "text-muted hover:text-paper"
                }`}
                onClick={() => {
                  setLang(l.id);
                  window.localStorage.setItem(LANG_KEY, l.id);
                  setCopied(false);
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-ghost w-fit px-3 py-1.5 text-xs"
            onClick={async () => {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1400);
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="viz-scroll max-h-[min(28rem,70vh)] overflow-auto bg-ink/50 px-4 py-4 font-mono text-[12px] leading-6 text-paper/90 sm:text-[13px]">
          <code>{code}</code>
        </pre>
      </div>

      <div className="surface rounded-2xl p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="kicker">Three problems</p>
            <p className="mt-1 text-sm text-muted">
              {solvedSet.size}/3 checked · stored on this device
            </p>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {pack.problems.map((prob) => {
            const on = solvedSet.has(prob.id);
            return (
              <li key={prob.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--line)] px-3 py-3 hover:bg-paper/[0.04]">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => setEntry(toggleSolved(slug, prob.id))}
                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--saffron)]"
                  />
                  <span className="min-w-0 flex-1">
                    <a
                      href={prob.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-paper hover:text-saffron"
                    >
                      {prob.title}
                    </a>
                    <span className="mt-0.5 block font-mono text-[11px] text-muted">
                      {prob.difficulty} · open ↗
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          className={`btn ${entry.mark === "done" ? "btn-primary" : "btn-ghost"} min-h-10 px-4`}
          onClick={() => setEntry(setMark(slug, entry.mark === "done" ? "unset" : "done"))}
        >
          {entry.mark === "done" ? "Marked got it" : "Got it"}
        </button>
        <button
          type="button"
          className={`btn ${entry.mark === "review" ? "btn-primary" : "btn-ghost"} min-h-10 px-4`}
          onClick={() => setEntry(setMark(slug, "review"))}
        >
          Review in 2 days
        </button>
        {entry.mark === "review" ? (
          <p className="text-sm text-muted">
            {due
              ? "Due now — sit with the template from memory."
              : `Due ${new Date(entry.reviewAt ?? 0).toLocaleDateString()}`}
          </p>
        ) : null}
        {entry.mark === "done" ? (
          <p className="text-sm text-jade">Parked. Uncheck Got it if it wobbles.</p>
        ) : null}
      </div>
    </section>
  );
}

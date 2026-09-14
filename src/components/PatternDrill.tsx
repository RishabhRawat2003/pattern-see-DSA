"use client";

import { useCallback, useEffect, useState } from "react";
import { CodeRunner } from "@/components/CodeRunner";
import { PatternPlayer } from "@/components/viz/PatternPlayer";
import type { PracticePack, PracticeProblem, TemplateLang } from "@/lib/types";
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
  const [lang, setLang] = useState<TemplateLang>("python");
  const [openId, setOpenId] = useState<string | null>(null);

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

      <div>
        <p className="kicker mb-3">Pattern template</p>
        <CodeRunner
          lang={lang}
          setLang={(l) => {
            setLang(l);
            window.localStorage.setItem(LANG_KEY, l);
          }}
          initialCode={code}
          resetKey={`${slug}-${lang}`}
          hint="Skeleton for the pattern — copy and adapt from memory."
        />
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
            const hasSolution = Boolean(prob.templates && prob.frames);
            const open = openId === prob.id;
            return (
              <li key={prob.id}>
                <div className="rounded-xl border border-[var(--line)]">
                  <div className="flex items-start gap-3 px-3 py-3">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <input
                        id={`solved-${prob.id}`}
                        type="checkbox"
                        checked={on}
                        onChange={() => setEntry(toggleSolved(slug, prob.id))}
                        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--saffron)]"
                        aria-label={`Mark ${prob.title} as solved`}
                      />
                      <div className="min-w-0 flex-1">
                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-paper hover:text-saffron"
                        >
                          {prob.title}
                          <span className="ml-1.5 font-mono text-[11px] font-normal text-muted">
                            open ↗
                          </span>
                        </a>
                        <p className="mt-0.5 font-mono text-[11px] text-muted">
                          {prob.difficulty}
                        </p>
                      </div>
                    </div>
                    {hasSolution ? (
                      <button
                        type="button"
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
                          open ? "bg-saffron text-ink" : "text-muted hover:text-paper"
                        }`}
                        onClick={() => setOpenId(open ? null : prob.id)}
                        aria-expanded={open}
                      >
                        {open ? "Hide" : "Solution"}
                      </button>
                    ) : null}
                  </div>
                  {open && hasSolution ? (
                    <ProblemSolutionPanel problem={prob} lang={lang} setLang={setLang} />
                  ) : null}
                </div>
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

function ProblemSolutionPanel({
  problem,
  lang,
  setLang,
}: {
  problem: PracticeProblem;
  lang: TemplateLang;
  setLang: (l: TemplateLang) => void;
}) {
  const code = problem.templates![lang];

  return (
    <div className="space-y-4 border-t border-[var(--line)] px-3 py-4 sm:px-4">
      {problem.approach ? (
        <p className="text-sm leading-7 text-paper/85">{problem.approach}</p>
      ) : null}
      {problem.frames?.length ? (
        <div className="min-w-0">
          <p className="kicker mb-3">Walkthrough</p>
          <PatternPlayer key={problem.id} frames={problem.frames} />
        </div>
      ) : null}
      <div>
        <p className="kicker mb-3">Optimal solution</p>
        <CodeRunner
          lang={lang}
          setLang={(l) => {
            setLang(l);
            window.localStorage.setItem(LANG_KEY, l);
          }}
          initialCode={code}
          resetKey={`${problem.id}-${lang}`}
          compilerLink={{ label: problem.title }}
          hint="Opens in the code lab with this solution loaded. Add a call + print if you only see a function."
        />
      </div>
    </div>
  );
}

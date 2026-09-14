"use client";

import { useState } from "react";
import { CompilerLink } from "@/components/CompilerLink";
import { templateLangs } from "@/lib/practice/helpers";
import type { TemplateLang } from "@/lib/types";

type Props = {
  lang: TemplateLang;
  setLang: (l: TemplateLang) => void;
  initialCode: string;
  resetKey?: string;
  hint?: string;
  /** Show link to open this code in the standalone compiler. */
  compilerLink?: { label?: string };
};

export function CodeRunner({
  lang,
  setLang,
  initialCode,
  hint,
  compilerLink,
}: Props) {
  const [copied, setCopied] = useState(false);

  return (
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
              onClick={() => setLang(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn btn-ghost w-fit px-3 py-1.5 text-xs"
            onClick={async () => {
              await navigator.clipboard.writeText(initialCode);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1400);
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          {compilerLink ? (
            <CompilerLink
              lang={lang}
              code={initialCode}
              label={compilerLink.label}
            />
          ) : null}
        </div>
      </div>

      {hint ? (
        <p className="border-b border-[var(--line)] bg-ink/30 px-4 py-2 text-[11px] leading-5 text-muted">
          {hint}
        </p>
      ) : null}

      <pre className="viz-scroll max-h-[min(28rem,70vh)] overflow-auto bg-ink/50 px-4 py-4 font-mono text-[12px] leading-6 text-paper/90 sm:text-[13px]">
        <code>{initialCode}</code>
      </pre>
    </div>
  );
}

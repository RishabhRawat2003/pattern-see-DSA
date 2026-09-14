"use client";

import { OnlineCompiler } from "@/components/OnlineCompiler";

export function CompilerPage() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col bg-[#0a0908] sm:min-h-[calc(100dvh-4.25rem)]">
      <div className="shrink-0 border-b border-[var(--line)] px-4 py-3 sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-jade">
          Patternsee IDE
        </p>
        <h1 className="mt-0.5 truncate text-base font-semibold text-paper sm:text-lg">
          Code lab
        </h1>
      </div>
      <div className="min-h-0 flex-1 p-3 sm:p-4">
        <OnlineCompiler variant="page" />
      </div>
    </div>
  );
}

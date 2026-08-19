"use client";

import { useEffect, useState } from "react";
import { getEntry, isDue, loadProgress } from "@/lib/progress";

export function PatternMark({ slug }: { slug: string }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      const e = getEntry(loadProgress(), slug);
      if (isDue(e)) setLabel("due");
      else if (e.mark === "review") setLabel("review");
      else if (e.mark === "done") setLabel("got it");
      else if (e.solved.length) setLabel(`${e.solved.length}/3`);
      else setLabel(null);
    };
    read();
    window.addEventListener("patternsee-progress", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("patternsee-progress", read);
      window.removeEventListener("storage", read);
    };
  }, [slug]);

  if (!label) return null;
  return (
    <span className="shrink-0 rounded-full border border-[var(--line)] px-2 py-0.5 font-mono text-[10px] text-saffron">
      {label}
    </span>
  );
}

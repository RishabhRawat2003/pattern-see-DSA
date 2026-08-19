"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { Frame } from "@/lib/types";
import { ArrayBoard } from "./ArrayBoard";
import { GridBoard, IntervalBoard } from "./GridBoard";
import { HashBoard } from "./HashBoard";
import { LinkedListBoard } from "./LinkedListBoard";
import { NumberLineBoard } from "./NumberLineBoard";
import { StackBoard } from "./StackBoard";
import { TreeBoard } from "./TreeBoard";
import { snappy } from "./motion";

export function PatternPlayer({ frames }: { frames: Frame[] }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = frames[i];
  const progress = frames.length ? ((i + 1) / frames.length) * 100 : 0;

  useEffect(() => {
    if (!playing) return;
    if (i >= frames.length - 1) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setI((x) => x + 1), 1450);
    return () => window.clearTimeout(t);
  }, [playing, i, frames.length]);

  const board = useMemo(() => {
    if (!frame) return null;
    switch (frame.kind) {
      case "hashmap":
        return <HashBoard frame={frame} />;
      case "linkedlist":
        return <LinkedListBoard frame={frame} />;
      case "stack":
        return <StackBoard frame={frame} />;
      case "numberline":
        return <NumberLineBoard frame={frame} />;
      case "grid":
        return <GridBoard frame={frame} />;
      case "intervals":
        return <IntervalBoard frame={frame} />;
      case "tree":
        return (
          <div className="space-y-4 sm:space-y-6">
            <TreeBoard frame={frame} />
            {frame.cells?.length ? <ArrayBoard frame={frame} /> : null}
          </div>
        );
      default:
        return <ArrayBoard frame={frame} />;
    }
  }, [frame]);

  if (!frame) {
    return (
      <div className="surface rounded-2xl p-8 text-muted">
        Visualization coming in a later level.
      </div>
    );
  }

  return (
    <div className="min-w-0 w-full overflow-hidden rounded-2xl border border-[var(--line)]">
      <div className="h-1 bg-paper/10">
        <motion.div
          className="h-full bg-saffron"
          animate={{ width: `${progress}%` }}
          transition={snappy}
        />
      </div>

      <div className="flex flex-col gap-3 border-b border-[var(--line)] bg-[var(--ink-2)] px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-4">
        <div className="min-w-0">
          <p className="kicker">
            Step {i + 1} / {frames.length}
          </p>
          <AnimatePresence mode="wait">
            <motion.h3
              key={frame.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="display mt-1 text-lg leading-snug text-paper sm:truncate sm:text-2xl"
            >
              {frame.title}
            </motion.h3>
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-4 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
          <button type="button" className="btn btn-ghost min-h-10 px-1.5 py-2 text-[11px] sm:min-h-0 sm:px-[0.95rem] sm:py-[0.45rem] sm:text-sm" onClick={() => { setPlaying(false); setI(0); }}>
            Reset
          </button>
          <button type="button" className="btn btn-ghost min-h-10 px-1.5 py-2 text-[11px] sm:min-h-0 sm:px-[0.95rem] sm:py-[0.45rem] sm:text-sm" onClick={() => { setPlaying(false); setI((x) => Math.max(0, x - 1)); }}>
            Prev
          </button>
          <button type="button" className="btn btn-primary min-h-10 px-1.5 py-2 text-[11px] sm:min-h-0 sm:px-[1.15rem] sm:py-2 sm:text-sm" onClick={() => setPlaying((p) => !p)}>
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" className="btn btn-ghost min-h-10 px-1.5 py-2 text-[11px] sm:min-h-0 sm:px-[0.95rem] sm:py-[0.45rem] sm:text-sm" onClick={() => { setPlaying(false); setI((x) => Math.min(frames.length - 1, x + 1)); }}>
            Next
          </button>
        </div>
      </div>

      <div className="board viz-scroll min-h-[200px] min-w-0 overflow-y-visible px-2 py-5 sm:min-h-[340px] sm:px-8 sm:py-10">
        {board}
      </div>

      <div className="viz-scroll flex justify-start gap-1 border-t border-[var(--line)] bg-[var(--ink-2)] px-3 py-3 sm:justify-center sm:px-4">
        {frames.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to step ${idx + 1}`}
            onClick={() => { setPlaying(false); setI(idx); }}
            className="relative h-1.5"
          >
            <motion.span
              layout
              className={`block h-1.5 rounded-full ${idx === i ? "bg-saffron" : "bg-paper/15"}`}
              animate={{ width: idx === i ? 28 : 6 }}
              transition={snappy}
            />
          </button>
        ))}
      </div>

      <div className="border-t border-[var(--line)] bg-[var(--ink-2)] px-3 py-4 sm:px-6 sm:py-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={frame.caption}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm leading-6 text-paper/90 sm:text-[15px] sm:leading-7"
          >
            {frame.caption}
          </motion.p>
        </AnimatePresence>
        {frame.note ? (
          <motion.p
            key={frame.note}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 inline-flex max-w-full break-words rounded-md border border-saffron/25 bg-saffron/10 px-2.5 py-1 font-mono text-[11px] text-saffron sm:text-xs"
          >
            {frame.note}
          </motion.p>
        ) : null}
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] text-muted">
          <li className="flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full bg-amber-400" /> Current
          </li>
          <li className="flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full bg-jade" /> Left / done
          </li>
          <li className="flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full bg-rose-300" /> Right
          </li>
          <li className="flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full bg-sky" /> Window
          </li>
          <li className="flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full bg-lime-400" /> Match
          </li>
        </ul>
      </div>
    </div>
  );
}

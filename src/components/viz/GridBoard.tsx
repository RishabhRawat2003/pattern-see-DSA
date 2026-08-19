"use client";

import { motion } from "motion/react";
import type { Frame } from "@/lib/types";
import { toneClass } from "./CellBox";
import { spring } from "./motion";

export function GridBoard({ frame }: { frame: Frame }) {
  const grid = frame.grid ?? [];
  const n = grid[0]?.length ?? 0;
  return (
    <div
      className="mx-auto grid w-full max-w-[min(100%,20rem)] gap-1 sm:max-w-md sm:gap-1.5"
      style={{ gridTemplateColumns: `repeat(${Math.max(n, 1)}, minmax(0, 1fr))` }}
    >
      {grid.flatMap((row, r) =>
        row.map((cell, c) => (
          <motion.div
            key={`${r}-${c}`}
            layout
            animate={{ scale: cell.tone === "active" || cell.tone === "match" ? 1.06 : 1 }}
            transition={spring}
            className={`grid aspect-square min-w-0 place-items-center rounded-md border font-mono text-xs sm:rounded-lg sm:text-base ${toneClass[cell.tone ?? "idle"]}`}
          >
            {cell.value || "·"}
          </motion.div>
        )),
      )}
    </div>
  );
}

export function IntervalBoard({ frame }: { frame: Frame }) {
  const items = frame.intervals ?? [];
  const max = frame.axisMax ?? Math.max(10, ...items.map((i) => i.end));
  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {items.map((it) => (
        <div key={it.label} className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center justify-between gap-2 sm:contents">
            <span className="shrink-0 font-mono text-[11px] text-muted sm:w-16">
              {it.label}
            </span>
            <span className="font-mono text-[11px] text-muted sm:hidden">
              {it.start}–{it.end}
            </span>
          </div>
          <div className="relative h-8 min-w-0 flex-1 rounded-md bg-paper/5">
            <motion.div
              className={`absolute top-1 h-6 rounded-md border ${toneClass[it.tone ?? "idle"]}`}
              initial={false}
              animate={{
                left: `${(it.start / max) * 100}%`,
                width: `${Math.max(4, ((it.end - it.start) / max) * 100)}%`,
              }}
              style={{
                left: `${(it.start / max) * 100}%`,
                width: `${Math.max(4, ((it.end - it.start) / max) * 100)}%`,
              }}
              transition={spring}
            />
          </div>
          <span className="hidden w-14 shrink-0 font-mono text-[11px] text-muted sm:block">
            {it.start}–{it.end}
          </span>
        </div>
      ))}
    </div>
  );
}

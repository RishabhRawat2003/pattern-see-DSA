"use client";

import { motion } from "motion/react";
import type { Frame } from "@/lib/types";
import { toneClass } from "./CellBox";
import { spring } from "./motion";

export function NumberLineBoard({ frame }: { frame: Frame }) {
  const r = frame.range;
  if (!r) return null;
  const pct = (v: number) => ((v - r.min) / (r.max - r.min)) * 100;
  return (
    <div className="space-y-8 overflow-hidden px-4 py-4 sm:space-y-10 sm:px-6 sm:py-6">
      <div className="relative mx-auto h-20 max-w-2xl">
        <div className="absolute top-10 h-1.5 w-full rounded-full bg-paper/10" />
        <motion.div
          className="absolute top-10 h-1.5 rounded-full bg-gradient-to-r from-jade to-rose-300"
          animate={{
            left: `${pct(r.lo)}%`,
            width: `${Math.max(2, pct(r.hi) - pct(r.lo))}%`,
          }}
          transition={spring}
        />
        {r.mid !== undefined ? (
          <motion.div
            className="absolute top-2 flex -translate-x-1/2 flex-col items-center"
            animate={{ left: `${pct(r.mid)}%` }}
            transition={spring}
          >
            <span className="rounded-full bg-amber-400/15 px-2 py-0.5 font-mono text-[11px] text-amber-200">
              mid {r.mid}
            </span>
            <span className="text-amber-300">▼</span>
          </motion.div>
        ) : null}
        <motion.div
          className="absolute top-12 -translate-x-1/2 font-mono text-[10px] text-emerald-300"
          animate={{ left: `${pct(r.lo)}%` }}
          transition={spring}
        >
          lo {r.lo}
        </motion.div>
        <motion.div
          className="absolute top-12 -translate-x-1/2 font-mono text-[10px] text-fuchsia-300"
          animate={{ left: `${pct(r.hi)}%` }}
          transition={spring}
        >
          hi {r.hi}
        </motion.div>
      </div>
      {frame.cells?.length ? (
        <div className="flex flex-wrap justify-center gap-2">
          {frame.cells.map((c, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border px-3 py-2 font-mono text-sm ${toneClass[c.tone ?? "idle"]}`}
            >
              pile {c.value}
            </motion.div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

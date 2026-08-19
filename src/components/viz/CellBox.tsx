"use client";

import { motion } from "motion/react";
import type { CellTone } from "@/lib/types";
import { highlightTones, spring } from "./motion";

export const toneClass: Record<CellTone, string> = {
  idle: "border-paper/15 bg-paper/6 text-paper",
  active: "border-saffron bg-saffron/25 text-saffron shadow-[0_0_22px_rgba(232,177,90,0.35)]",
  done: "border-jade/50 bg-jade/15 text-jade",
  window: "border-sky/60 bg-sky/15 text-sky-100",
  lo: "border-jade bg-jade/20 text-jade",
  mid: "border-saffron bg-saffron/22 text-saffron",
  hi: "border-rose-300/80 bg-rose-400/15 text-rose-100",
  match: "border-lime-300 bg-lime-400/20 text-lime-100 shadow-[0_0_22px_rgba(163,230,53,0.28)]",
  skip: "border-rose-400/40 bg-rose-400/10 text-rose-100/80",
  update: "border-orange-300 bg-orange-400/20 text-orange-100",
};

export function CellBox({
  value,
  tone = "idle",
  index,
}: {
  value: string | number;
  tone?: CellTone;
  index?: number;
}) {
  const hot = highlightTones.has(tone);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.div
        layout
        initial={false}
        animate={{
          scale: hot ? 1.08 : 1,
          y: hot ? -5 : 0,
        }}
        transition={spring}
        className={`relative flex h-11 min-w-11 items-center justify-center rounded-lg border px-2 font-mono text-base font-semibold sm:h-14 sm:min-w-14 sm:px-3 sm:text-lg ${toneClass[tone]}`}
      >
        {hot ? (
          <motion.span
            className="absolute inset-0 rounded-lg border border-saffron/50"
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 1.35 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            key={tone}
          />
        ) : null}
        {value}
      </motion.div>
      {index !== undefined ? (
        <span className="font-mono text-[10px] text-muted">{index}</span>
      ) : null}
    </div>
  );
}

export function PointerBadge({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  return (
    <motion.span
      layoutId={`pointer-${name}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={spring}
      className="absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] font-bold"
      style={{ color }}
    >
      {name} ▾
    </motion.span>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Frame } from "@/lib/types";
import { toneClass } from "./CellBox";
import { highlightTones, spring } from "./motion";

export function StackBoard({ frame }: { frame: Frame }) {
  const items = frame.stackItems ?? [];
  return (
    <div className="grid min-w-0 items-center gap-6 sm:gap-8 md:grid-cols-[minmax(0,1fr)_180px]">
      {frame.cells?.length ? (
        <div className="flex flex-wrap items-end justify-center gap-2">
          {frame.cells.map((cell, i) => {
            const hot = highlightTones.has(cell.tone ?? "idle");
            return (
              <motion.div
                key={i}
                layout
                animate={{ scale: hot ? 1.08 : 1, y: hot ? -4 : 0 }}
                transition={spring}
                className={`flex h-11 min-w-11 items-center justify-center rounded-2xl border px-2 font-mono text-sm font-semibold sm:h-12 sm:min-w-12 sm:text-base ${toneClass[cell.tone ?? "idle"]}`}
              >
                {cell.value}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div />
      )}
      <div className="mx-auto flex w-full max-w-[180px] flex-col-reverse items-stretch gap-1.5 rounded-xl border border-dashed border-[var(--line)] bg-ink/40 p-3">
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center text-xs text-muted"
            >
              stack empty
            </motion.p>
          ) : (
            items.map((item, i) => (
              <motion.div
                layout
                key={`${item.value}-${i}`}
                initial={{ opacity: 0, y: 18, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.9 }}
                transition={spring}
                className={`flex h-11 items-center justify-center rounded-xl border font-mono text-sm ${toneClass[item.tone ?? "idle"]}`}
              >
                {item.value}
              </motion.div>
            ))
          )}
        </AnimatePresence>
        <p className="pt-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          top ↑
        </p>
      </div>
    </div>
  );
}

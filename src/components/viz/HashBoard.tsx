"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Frame } from "@/lib/types";
import { PointerBadge, toneClass } from "./CellBox";
import { highlightTones, spring } from "./motion";

export function HashBoard({ frame }: { frame: Frame }) {
  const entries = frame.mapEntries ?? [];
  return (
    <div className="grid min-w-0 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,260px)]">
      {frame.cells?.length ? (
        <div className="flex flex-wrap items-end justify-center gap-2">
          {frame.cells.map((cell, i) => {
            const hot = highlightTones.has(cell.tone ?? "idle");
            return (
              <div key={i} className="relative flex flex-col items-center gap-1.5 pt-8">
                <AnimatePresence>
                  {frame.pointers
                    ?.filter((p) => p.index === i)
                    .map((p) => (
                      <PointerBadge key={p.name} name={p.name} color={p.color} />
                    ))}
                </AnimatePresence>
                <motion.div
                  layout
                  animate={{ scale: hot ? 1.08 : 1, y: hot ? -4 : 0 }}
                  transition={spring}
                  className={`flex h-11 min-w-11 items-center justify-center rounded-2xl border px-2 font-mono text-sm font-semibold sm:h-12 sm:min-w-12 sm:text-base ${toneClass[cell.tone ?? "idle"]}`}
                >
                  {cell.value}
                </motion.div>
                <span className="font-mono text-[10px] text-muted">{i}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div />
      )}
      <div className="rounded-xl border border-[var(--line)] bg-ink/40 p-4">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Hash table
        </p>
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {entries.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted"
              >
                empty
              </motion.p>
            ) : (
              entries.map((e) => (
                <motion.li
                  layout
                  key={e.key}
                  initial={{ opacity: 0, x: 16, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={spring}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 font-mono text-sm ${toneClass[e.tone ?? "idle"]}`}
                >
                  <span>{e.key}</span>
                  <span className="text-muted">→ {e.value}</span>
                </motion.li>
              ))
            )}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

"use client";

import { AnimatePresence } from "motion/react";
import type { Frame } from "@/lib/types";
import { CellBox, PointerBadge } from "./CellBox";

export function ArrayBoard({ frame }: { frame: Frame }) {
  const cells = frame.cells ?? [];
  return (
    <div className="relative">
      <div className="flex flex-wrap items-end justify-center gap-1.5 sm:gap-2">
        {cells.map((cell, i) => (
          <div key={i} className="relative pt-8">
            <AnimatePresence>
              {frame.pointers
                ?.filter((p) => p.index === i)
                .map((p) => (
                  <PointerBadge key={p.name} name={p.name} color={p.color} />
                ))}
            </AnimatePresence>
            <CellBox value={cell.value} tone={cell.tone} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}

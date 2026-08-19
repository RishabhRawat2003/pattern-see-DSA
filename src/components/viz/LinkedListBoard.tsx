"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Frame } from "@/lib/types";
import { PointerBadge, toneClass } from "./CellBox";
import { highlightTones, spring } from "./motion";

export function LinkedListBoard({ frame }: { frame: Frame }) {
  const nodes = frame.listNodes ?? [];
  return (
    <div className="viz-scroll flex flex-nowrap items-center justify-start gap-0 py-4 sm:justify-center">
      {nodes.map((node, i) => {
        const pointerNames = frame.pointers?.filter((p) => p.index === i) ?? [];
        const last = i === nodes.length - 1;
        const loops = last && frame.cycleTo;
        const hot = highlightTones.has(node.tone ?? "idle");
        return (
          <motion.div
            layout
            key={node.id}
            className="flex shrink-0 items-center"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={spring}
          >
            <div className="relative pt-8">
              <AnimatePresence>
                {pointerNames.map((p) => (
                  <PointerBadge key={p.name} name={p.name} color={p.color} />
                ))}
              </AnimatePresence>
              <motion.div
                animate={{ scale: hot ? 1.08 : 1, y: hot ? -4 : 0 }}
                transition={spring}
                className={`flex h-12 min-w-[3.75rem] shrink-0 flex-col items-center justify-center rounded-2xl border px-2 sm:h-16 sm:min-w-[4.75rem] sm:px-3 ${toneClass[node.tone ?? "idle"]}`}
              >
                <span className="font-mono text-lg font-semibold">{node.value}</span>
                <span className="font-mono text-[9px] text-muted">{node.id}</span>
              </motion.div>
            </div>
            {node.next || loops ? (
              <div className="flex min-w-12 flex-col items-center px-1 pt-8">
                <span className="text-lg text-muted">{loops ? "↺" : "→"}</span>
                {loops ? (
                  <span className="font-mono text-[9px] text-fuchsia-300">
                    to {frame.cycleTo}
                  </span>
                ) : null}
              </div>
            ) : (
              <span className="px-3 pt-8 font-mono text-xs text-muted">null</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

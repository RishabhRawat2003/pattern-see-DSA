"use client";

import { motion } from "motion/react";
import type { Frame } from "@/lib/types";

const fill: Record<string, string> = {
  idle: "#2a241e",
  active: "#e8b15a",
  done: "#3d8f6e",
  window: "#4d8eb3",
  lo: "#6fbf9a",
  mid: "#e8b15a",
  hi: "#d9899a",
  match: "#a3d46a",
  skip: "#c97878",
  update: "#e09a4a",
};

export function TreeBoard({ frame }: { frame: Frame }) {
  const nodes = frame.treeNodes ?? [];
  const edges = frame.treeEdges ?? [];

  if (nodes.length === 0) {
    return <p className="text-center text-sm text-muted">No tree to draw.</p>;
  }

  return (
    <svg
      viewBox="-4 -4 108 108"
      preserveAspectRatio="xMidYMid meet"
      className="mx-auto block h-auto w-full max-w-[min(100%,22rem)] overflow-visible sm:max-w-xl"
    >
      {edges.map((e) => {
        const a = nodes.find((n) => n.id === e.from);
        const b = nodes.find((n) => n.id === e.to);
        if (!a || !b) return null;
        const stroke =
          e.tone === "match"
            ? "#6fbf9a"
            : e.tone === "active"
              ? "#e8b15a"
              : e.tone === "skip"
                ? "#c97878"
                : "#6b5e50";
        return (
          <line
            key={`${e.from}-${e.to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={stroke}
            strokeWidth={e.tone ? 0.7 : 0.45}
            strokeDasharray={e.dashed ? "1.2 1" : undefined}
          />
        );
      })}
      {nodes.map((n) => {
        const active = n.tone === "active" || n.tone === "match";
        const w = Math.max(14, Math.min(22, n.label.length * 2.4 + 8));
        return (
          <g key={n.id}>
            <motion.rect
              x={n.x - w / 2}
              y={n.y - 5}
              width={w}
              height={10}
              rx="2.2"
              fill={fill[n.tone ?? "idle"]}
              stroke={active ? "#f4ece1" : "#8a7a68"}
              strokeWidth={active ? 0.5 : 0.3}
              initial={false}
              animate={{ opacity: 1 }}
            />
            <text
              x={n.x}
              y={n.y + 1.2}
              textAnchor="middle"
              fontSize="2.8"
              fill="#f8fafc"
              fontFamily="ui-monospace, monospace"
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

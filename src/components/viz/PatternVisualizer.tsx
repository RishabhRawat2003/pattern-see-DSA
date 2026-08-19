"use client";

import { PatternPlayer } from "@/components/viz/PatternPlayer";
import { getDemoFrames } from "@/lib/demos";

export function PatternVisualizer({ slug }: { slug: string }) {
  const frames = getDemoFrames(slug);
  return <PatternPlayer frames={frames} />;
}

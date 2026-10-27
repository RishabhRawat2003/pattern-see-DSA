import { PatternPlayer } from "@/components/viz/PatternPlayer";
import type { Frame } from "@/lib/types";

export function PatternVisualizer({ frames }: { frames: Frame[] }) {
  return <PatternPlayer frames={frames} />;
}

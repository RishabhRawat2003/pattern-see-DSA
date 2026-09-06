import type { CellTone, Frame } from "../../types";

export function arrayFrame(
  title: string,
  caption: string,
  values: (string | number)[],
  toneMap: Record<number, CellTone> = {},
  extra: Partial<Frame> = {},
): Frame {
  return {
    kind: "array",
    title,
    caption,
    cells: values.map((value, i) => ({ value, tone: toneMap[i] ?? "idle" })),
    ...extra,
  };
}

export function listNodes(
  values: (string | number)[],
  tones: Record<number, CellTone> = {},
  nextOverrides: Record<number, number | null> = {},
) {
  return values.map((value, i) => ({
    id: `n${i}`,
    value: String(value),
    next:
      i in nextOverrides
        ? nextOverrides[i] === null
          ? null
          : `n${nextOverrides[i]}`
        : i === values.length - 1
          ? null
          : `n${i + 1}`,
    tone: tones[i] ?? ("idle" as CellTone),
  }));
}

export const PTR = {
  L: "#34d399",
  R: "#f472b6",
  M: "#fbbf24",
  S: "#64748b",
} as const;

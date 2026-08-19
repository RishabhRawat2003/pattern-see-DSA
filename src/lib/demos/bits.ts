import type { CellTone, Frame } from "../types";

function arr(
  title: string,
  caption: string,
  values: (string | number)[],
  tones: Record<number, CellTone> = {},
  extra: Partial<Frame> = {},
): Frame {
  return {
    kind: "array",
    title,
    caption,
    cells: values.map((value, i) => ({ value, tone: tones[i] ?? "idle" })),
    ...extra,
  };
}

export function xorTricksFrames(): Frame[] {
  const a = [2, 3, 2, 4, 4];
  return [
    arr("XOR all", "x^x=0 and x^0=x. Pairs cancel. The singleton remains.", a, {}, { note: "acc=0" }),
    arr("2 ^ 3 ^ 2", "2^2 dies. Left 3 so far.", a, { 0: "done", 1: "active", 2: "done" }, { note: "acc=3" }),
    arr("3 ^ 4 ^ 4", "4^4 dies. Answer 3.", a, { 1: "match", 3: "done", 4: "done" }, { note: "3" }),
  ];
}

export function missingNumberFrames(): Frame[] {
  const a = [1, 2, 4];
  return [
    arr("n=4, missing one", "XOR 1^2^3^4 with every array value. Duplicates cancel.", a, {}, { note: "expect 1..4" }),
    arr("Fold in the array", "1^1, 2^2, 4^4 vanish. 3 never appeared.", a, { 0: "done", 1: "done", 2: "done" }, { note: "missing 3" }),
    arr("Two missings?", "XOR all, then split numbers by a bit where the XOR is 1 — two unique groups.", [1, 2, 3, 4], { 2: "hi" }, { note: "same identity trick" }),
  ];
}

export function bitMaskingFrames(): Frame[] {
  return [
    arr("Mask 5 = 101", "Bit i on means element i is in the set. Tests: (m>>i)&1.", ["b0=1", "b1=0", "b2=1"], { 0: "match", 2: "match" }, { note: "5" }),
    arr("Set bit 1", "mask | (1<<1) → 111 = 7. Insert B.", ["b0=1", "b1=1", "b2=1"], { 1: "active" }, { note: "7" }),
    arr("Clear bit 0", "mask & ~(1<<0) → 110 = 6. Remove A.", ["b0=0", "b1=1", "b2=1"], { 0: "skip" }, { note: "6" }),
  ];
}

export function subsetsBitsFrames(): Frame[] {
  const items = ["A", "B", "C"];
  const frames: Frame[] = [
    arr("n=3, masks 0..7", "Bit i selects items[i]. No recursion — just a loop.", items, {}, { note: "2^3 = 8" }),
  ];
  const shown = [0, 1, 5, 7];
  for (const mask of shown) {
    const tones: Record<number, CellTone> = {};
    const picked: string[] = [];
    items.forEach((name, i) => {
      if (mask & (1 << i)) {
        tones[i] = "match";
        picked.push(name);
      } else tones[i] = "idle";
    });
    frames.push(
      arr(
        `mask ${mask} (${mask.toString(2).padStart(3, "0")})`,
        picked.length ? `{ ${picked.join(", ")} }` : "Empty subset.",
        items,
        tones,
        { note: `mask ${mask}` },
      ),
    );
  }
  return frames;
}

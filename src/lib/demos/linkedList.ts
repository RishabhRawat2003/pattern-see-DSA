import type { CellTone, Frame } from "../types";

function list(
  values: number[],
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

export function fastSlowFrames(): Frame[] {
  const values = [1, 2, 3, 4, 5, 6, 7];
  const frames: Frame[] = [];
  let slow = 0;
  let fast = 0;
  frames.push({
    kind: "linkedlist",
    title: "Find the middle",
    caption: "Slow walks +1, fast walks +2. When fast cannot move, slow is at the middle.",
    listNodes: list(values, { 0: "active" }),
    pointers: [
      { name: "slow", index: 0, color: "#34d399" },
      { name: "fast", index: 0, color: "#f472b6" },
    ],
  });
  while (fast + 2 < values.length) {
    slow += 1;
    fast += 2;
    frames.push({
      kind: "linkedlist",
      title: `slow → ${values[slow]}, fast → ${values[fast]}`,
      caption: "Fast is still inside the list, so keep moving.",
      listNodes: list(values, { [slow]: "lo", [fast]: "hi" }),
      pointers: [
        { name: "slow", index: slow, color: "#34d399" },
        { name: "fast", index: fast, color: "#f472b6" },
      ],
    });
  }
  if (fast + 1 < values.length) {
    slow += 1;
    fast += 1;
  }
  frames.push({
    kind: "linkedlist",
    title: "Middle found",
    caption: `slow sits on ${values[slow]} — the middle of an odd-length list (or the upper middle).`,
    listNodes: list(values, { [slow]: "match" }),
    pointers: [{ name: "slow", index: slow, color: "#34d399" }],
  });
  return frames;
}

export function reverseListFrames(): Frame[] {
  const values = [1, 2, 3, 4];
  const frames: Frame[] = [
    {
      kind: "linkedlist",
      title: "Reverse in place",
      caption: "prev starts as null. Each node’s next is rewired to prev.",
      listNodes: list(values),
    },
  ];
  let prev: number | null = null;
  for (let curr = 0; curr < values.length; curr++) {
    const next = curr + 1 < values.length ? curr + 1 : null;
    const overrides: Record<number, number | null> = {};
    for (let i = 0; i < curr; i++) {
      overrides[i] = i === 0 ? null : i - 1;
    }
    overrides[curr] = prev;
    frames.push({
      kind: "linkedlist",
      title: `curr = ${values[curr]}`,
      caption: `Save next, point curr.next to prev (${prev === null ? "null" : values[prev]}), then advance.`,
      listNodes: list(
        values,
        { [curr]: "active", ...(prev !== null ? { [prev]: "done" } : {}) },
        { ...overrides, ...(next !== null ? { [curr]: prev } : { [curr]: prev }) },
      ),
      pointers: [
        { name: "prev", index: prev ?? curr, color: "#64748b" },
        { name: "curr", index: curr, color: "#fbbf24" },
      ],
      note: next === null ? "next = null" : `next = ${values[next]}`,
    });
    prev = curr;
  }
  frames.push({
    kind: "linkedlist",
    title: "Head is now 4",
    caption: "The chain is 4 → 3 → 2 → 1 → null.",
    listNodes: [
      { id: "n3", value: "4", next: "n2", tone: "match" },
      { id: "n2", value: "3", next: "n1", tone: "done" },
      { id: "n1", value: "2", next: "n0", tone: "done" },
      { id: "n0", value: "1", next: null, tone: "done" },
    ],
  });
  return frames;
}

export function mergeListsFrames(): Frame[] {
  const frames: Frame[] = [];
  const a = [1, 3, 5];
  const b = [2, 4];
  frames.push({
    kind: "array",
    title: "Two sorted lists",
    caption: "Always take the smaller head. Dummy node holds the merged tail.",
    cells: [
      { value: "A:1", tone: "lo" },
      { value: "A:3" },
      { value: "A:5" },
      { value: "|" },
      { value: "B:2", tone: "hi" },
      { value: "B:4" },
    ],
  });
  const merged: number[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    const takeA = j >= b.length || (i < a.length && a[i] <= b[j]);
    if (takeA) {
      merged.push(a[i]);
      i += 1;
    } else {
      merged.push(b[j]);
      j += 1;
    }
    frames.push({
      kind: "linkedlist",
      title: `Take ${merged[merged.length - 1]}`,
      caption: takeA
        ? "A’s head was smaller (or B is exhausted)."
        : "B’s head was smaller.",
      listNodes: merged.map((value, idx) => ({
        id: `m${idx}`,
        value: String(value),
        next: idx === merged.length - 1 ? null : `m${idx + 1}`,
        tone: idx === merged.length - 1 ? "active" : "done",
      })),
      note: `A left: [${a.slice(i).join(", ")}]  B left: [${b.slice(j).join(", ")}]`,
    });
  }
  return frames;
}

export function cycleDetectionFrames(): Frame[] {
  const values = [3, 2, 0, -4];
  const frames: Frame[] = [];
  const nodes = (slow: number, fast: number, meet = false) =>
    values.map((value, i) => ({
      id: `n${i}`,
      value: String(value),
      next: i === values.length - 1 ? "n1" : `n${i + 1}`,
      tone:
        i === slow && i === fast
          ? ("match" as CellTone)
          : i === slow
            ? ("lo" as CellTone)
            : i === fast
              ? ("hi" as CellTone)
              : meet && i === 1
                ? ("window" as CellTone)
                : ("idle" as CellTone),
    }));

  frames.push({
    kind: "linkedlist",
    title: "List with a cycle",
    caption: "Tail (−4) points back to 2. Fast will lap slow inside the loop.",
    listNodes: nodes(0, 0),
    cycleTo: "n1",
    pointers: [
      { name: "slow", index: 0, color: "#34d399" },
      { name: "fast", index: 0, color: "#f472b6" },
    ],
  });

  let slow = 0;
  let fast = 0;
  const step = (p: number, k: number) => {
    let x = p;
    for (let s = 0; s < k; s++) x = x === values.length - 1 ? 1 : x + 1;
    return x;
  };
  for (let t = 0; t < 6; t++) {
    slow = step(slow, 1);
    fast = step(fast, 2);
    frames.push({
      kind: "linkedlist",
      title: slow === fast ? "They meet" : "Keep circling",
      caption:
        slow === fast
          ? "Meeting proves a cycle. Reset one pointer to head to find the entrance."
          : "Slow +1, fast +2. Different speeds must collide if a loop exists.",
      listNodes: nodes(slow, fast, slow === fast),
      cycleTo: "n1",
      pointers: [
        { name: "slow", index: slow, color: "#34d399" },
        { name: "fast", index: fast, color: "#f472b6" },
      ],
    });
    if (slow === fast) break;
  }
  frames.push({
    kind: "linkedlist",
    title: "Cycle starts at 2",
    caption: "One pointer back at head, both move +1. They meet at the entrance node.",
    listNodes: nodes(1, 1, true),
    cycleTo: "n1",
    pointers: [{ name: "entrance", index: 1, color: "#fbbf24" }],
  });
  return frames;
}

import type { CellTone, Frame, TreeNode } from "../types";

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

export function meetInMiddleFrames(): Frame[] {
  const a = [2, 4, 5, 6];
  return [
    arr("n=4, target 10", "2^{n} is 16; split into two halves of 2^{n/2}=4 subset sums.", a, {}, { note: "target 10" }),
    arr("Left [2,4]", "Subsets: 0, 2, 4, 6.", a, { 0: "lo", 1: "lo" }, { note: "L={0,2,4,6}" }),
    arr("Right [5,6]", "Subsets: 0, 5, 6, 11.", a, { 2: "hi", 3: "hi" }, { note: "R={0,5,6,11}" }),
    arr("Match 4 + 6", "For each L value, look up target-L in R. 4 and 6 pair.", a, { 1: "match", 3: "match" }, { note: "10" }),
  ];
}

export function windowDpFrames(): Frame[] {
  const a = [1, 3, -1, 4, 2];
  return [
    arr("dp[i] = a[i] + max(dp in [i-k, i))", "Deque stores indices of decreasing dp. Window size k=2.", a, {}, { note: "k=2" }),
    arr("i=0,1", "dp[0]=1, dp[1]=3+1=4. Deque max at 1.", a, { 0: "done", 1: "active" }, { note: "dp 1, 4" }),
    arr("i=2", "Window {0,1}. max dp=4. dp[2]=-1+4=3.", a, { 0: "window", 1: "window", 2: "active" }),
    arr("i=4", "Best uses 3 then 4 then 2. Deque drops stale i-k.", a, { 1: "match", 3: "match", 4: "match" }, { note: "answer 9" }),
  ];
}

export function binaryLiftingFrames(): Frame[] {
  const n: TreeNode[] = [
    { id: "1", label: "1", x: 50, y: 14 },
    { id: "2", label: "2", x: 28, y: 42 },
    { id: "3", label: "3", x: 72, y: 42 },
    { id: "4", label: "4", x: 16, y: 70 },
    { id: "5", label: "5", x: 40, y: 70 },
    { id: "6", label: "6", x: 72, y: 70 },
  ];
  const e = [
    { from: "1", to: "2" },
    { from: "1", to: "3" },
    { from: "2", to: "4" },
    { from: "2", to: "5" },
    { from: "3", to: "6" },
  ];
  return [
    {
      kind: "tree",
      title: "Parent = 2^0",
      caption: "up[u][0] = parent. Then up[u][k] = up[ up[u][k-1] ][k-1].",
      treeNodes: n,
      treeEdges: e,
      note: "k=0",
    },
    {
      kind: "tree",
      title: "From 4, jump 1",
      caption: "Bit 0 of the distance: 4 → 2.",
      treeNodes: n.map((x) => ({ ...x, tone: (x.id === "4" || x.id === "2" ? "active" : "idle") as CellTone })),
      treeEdges: e.map((ed) => (ed.from === "2" && ed.to === "4" ? { ...ed, tone: "active" as CellTone } : ed)),
    },
    {
      kind: "tree",
      title: "Jump 2 more",
      caption: "up[2][1] is the 2-ancestor = 1. LCA / kth ancestor is bits of k.",
      treeNodes: n.map((x) => ({
        ...x,
        tone: (x.id === "4" ? "done" : x.id === "2" ? "window" : x.id === "1" ? "match" : "idle") as CellTone,
      })),
      treeEdges: e.map((ed) => ({ ...ed, tone: "match" as CellTone })),
      note: "4 → 1",
    },
  ];
}

export function mosAlgorithmFrames(): Frame[] {
  const a = [1, 2, 1, 3, 2];
  return [
    arr("Array + offline queries", "Q1=[0,2], Q2=[1,4]. Sort by block of L, then R. Move the window between queries.", a, {}, { note: "add/remove O(1)" }),
    arr("Q1: [0,2]", "Add 0,1,2. Freq: 1→2, 2→1. Distinct=2.", a, { 0: "window", 1: "window", 2: "window" }, {
      pointers: [
        { name: "L", index: 0, color: "#34d399" },
        { name: "R", index: 2, color: "#f472b6" },
      ],
      note: "distinct 2",
    }),
    arr("Move to Q2", "L 0→1 (remove a[0]), R 2→4 (add 3,4). Do not rebuild.", a, { 1: "window", 2: "window", 3: "window", 4: "window" }, {
      pointers: [
        { name: "L", index: 1, color: "#34d399" },
        { name: "R", index: 4, color: "#f472b6" },
      ],
      note: "distinct 3",
    }),
  ];
}

import type { CellTone, Frame, TreeNode } from "../types";

function nodes(parents: number[], tones: Record<number, CellTone> = {}): TreeNode[] {
  const pos = [
    { x: 20, y: 40 },
    { x: 42, y: 40 },
    { x: 64, y: 40 },
    { x: 86, y: 40 },
  ];
  return parents.map((p, i) => {
    const id = i + 1;
    return {
      id: String(id),
      label: `${id}→${p}`,
      x: pos[i].x,
      y: pos[i].y,
      tone: tones[id] ?? "idle",
    };
  });
}

function edges(parents: number[]) {
  return parents
    .map((p, i) => {
      const from = String(i + 1);
      const to = String(p);
      if (from === to) return null;
      return { from, to, tone: "window" as CellTone };
    })
    .filter(Boolean) as NonNullable<Frame["treeEdges"]>;
}

export function dsuCycleFrames(): Frame[] {
  return [
    {
      kind: "tree",
      title: "Each node its parent",
      caption: "find(x)=x. Union (1,2) then (2,3). Edge (1,3) should scream cycle.",
      treeNodes: nodes([1, 2, 3]),
      treeEdges: [],
      note: "n=3",
    },
    {
      kind: "tree",
      title: "Union 1-2",
      caption: "Different roots. Parent[2]=1. No cycle.",
      treeNodes: nodes([1, 1, 3], { 1: "lo", 2: "lo" }),
      treeEdges: edges([1, 1, 3]),
    },
    {
      kind: "tree",
      title: "Union 2-3",
      caption: "find(2)=1, find(3)=3. Attach 3 under 1.",
      treeNodes: nodes([1, 1, 1], { 1: "done", 2: "done", 3: "done" }),
      treeEdges: edges([1, 1, 1]),
    },
    {
      kind: "tree",
      title: "Edge 1-3",
      caption: "find(1)==find(3). That undirected edge closes a cycle. Reject it.",
      treeNodes: nodes([1, 1, 1], { 1: "skip", 3: "skip" }),
      treeEdges: [...edges([1, 1, 1]), { from: "1", to: "3", dashed: true, tone: "skip" }],
      note: "cycle",
    },
  ];
}

export function dsuComponentsFrames(): Frame[] {
  return [
    {
      kind: "tree",
      title: "4 components",
      caption: "Start with n sets. Each successful union decrements the count.",
      treeNodes: nodes([1, 2, 3, 4]),
      treeEdges: [],
      note: "count=4",
    },
    {
      kind: "tree",
      title: "Union 1-2",
      caption: "count 3. {1,2} {3} {4}.",
      treeNodes: nodes([1, 1, 3, 4], { 1: "window", 2: "window" }),
      treeEdges: edges([1, 1, 3, 4]),
      note: "count=3",
    },
    {
      kind: "tree",
      title: "Union 3-4",
      caption: "count 2. Two provinces remain.",
      treeNodes: nodes([1, 1, 3, 3], { 1: "lo", 2: "lo", 3: "hi", 4: "hi" }),
      treeEdges: edges([1, 1, 3, 3]),
      note: "count=2",
    },
  ];
}

export function kruskalFrames(): Frame[] {
  const n: TreeNode[] = [
    { id: "A", label: "A", x: 22, y: 28 },
    { id: "B", label: "B", x: 78, y: 28 },
    { id: "C", label: "C", x: 22, y: 72 },
    { id: "D", label: "D", x: 78, y: 72 },
  ];
  const paint = (take: string[], skip: string[] = []): Frame["treeEdges"] => {
    const list = [
      { from: "A", to: "B", w: "AB" },
      { from: "A", to: "C", w: "AC" },
      { from: "B", to: "D", w: "BD" },
      { from: "C", to: "D", w: "CD" },
    ];
    return list.map((e) => ({
      from: e.from,
      to: e.to,
      tone: (take.includes(e.w) ? "match" : skip.includes(e.w) ? "skip" : "idle") as CellTone,
      dashed: skip.includes(e.w),
    }));
  };
  return [
    {
      kind: "tree",
      title: "Sort edges",
      caption: "AB1, AC2, BD2, CD3. DSU starts disjoint.",
      treeNodes: n,
      treeEdges: paint([]),
      note: "Kruskal",
    },
    {
      kind: "tree",
      title: "Take AB, AC, BD",
      caption: "Each pair had different roots. Three edges, all connected.",
      treeNodes: n.map((x) => ({ ...x, tone: "done" as CellTone })),
      treeEdges: paint(["AB", "AC", "BD"]),
    },
    {
      kind: "tree",
      title: "Skip CD",
      caption: "find(C)==find(D) already. Same MST as Prim, via DSU.",
      treeNodes: n.map((x) => ({ ...x, tone: "match" as CellTone })),
      treeEdges: paint(["AB", "AC", "BD"], ["CD"]),
      note: "weight 5",
    },
  ];
}

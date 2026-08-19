import type { CellTone, Frame, TreeNode } from "../types";

const nodes: TreeNode[] = [
  { id: "A", label: "A", x: 22, y: 22 },
  { id: "B", label: "B", x: 50, y: 22 },
  { id: "C", label: "C", x: 78, y: 22 },
  { id: "D", label: "D", x: 22, y: 58 },
  { id: "E", label: "E", x: 50, y: 58 },
];

const edges = [
  { from: "A", to: "B" },
  { from: "B", to: "C" },
  { from: "A", to: "D" },
  { from: "B", to: "E" },
  { from: "D", to: "E" },
];

function g(map: Record<string, CellTone>, extra: Partial<Frame> = {}): Frame {
  return {
    kind: "tree",
    treeNodes: nodes.map((n) => ({ ...n, tone: map[n.id] ?? "idle" })),
    treeEdges: edges,
    ...extra,
    title: extra.title ?? "",
    caption: extra.caption ?? "",
  };
}

export function graphBfsDfsFrames(): Frame[] {
  const frames: Frame[] = [
    g({}, { title: "Start at A", caption: "DFS goes deep (stack). BFS goes wide (queue). Same graph." }),
  ];
  const dfs = ["A", "B", "C", "E", "D"];
  const seen: Record<string, CellTone> = {};
  for (const id of dfs) {
    seen[id] = "done";
    frames.push(g({ ...seen, [id]: "active" }, { title: `DFS ${id}`, caption: "Stack/recursion: A→B→C, backtrack to B→E, then D.", note: "DFS" }));
  }
  const bfs = ["A", "B", "D", "C", "E"];
  const seenB: Record<string, CellTone> = {};
  for (const id of bfs) {
    seenB[id] = "done";
    frames.push(
      g(
        { ...seenB, [id]: "active" },
        { title: `BFS ${id}`, caption: "Queue: neighbors of A first (B,D), then C,E.", cells: [{ value: `visit ${id}` }], note: "BFS" },
      ),
    );
  }
  return frames;
}

export function connectedComponentsFrames(): Frame[] {
  const extra: TreeNode[] = [{ id: "F", label: "F", x: 82, y: 70 }];
  const all = [...nodes, ...extra];
  const paint = (map: Record<string, CellTone>) =>
    all.map((n) => ({ ...n, tone: map[n.id] ?? "idle" }));
  return [
    {
      kind: "tree",
      title: "Two pieces",
      caption: "F is disconnected. Each DFS/BFS start on an unvisited node is a new component.",
      treeNodes: paint({}),
      treeEdges: edges,
    },
    {
      kind: "tree",
      title: "Component 1",
      caption: "Start at A — paints A,B,C,D,E.",
      treeNodes: paint({ A: "window", B: "window", C: "window", D: "window", E: "window" }),
      treeEdges: edges,
    },
    {
      kind: "tree",
      title: "Component 2",
      caption: "F is still unvisited. Second start. Answer = 2.",
      treeNodes: paint({
        A: "done",
        B: "done",
        C: "done",
        D: "done",
        E: "done",
        F: "match",
      }),
      treeEdges: edges,
    },
  ];
}

export function graphCycleFrames(): Frame[] {
  return [
    g({}, { title: "Directed edges", caption: "White = unvisited, gray = on the stack, black = done. A gray neighbor is a back edge — cycle." }),
    g({ A: "active", B: "window" }, { title: "A → B", caption: "A is gray. Recurse to B." }),
    g({ A: "window", B: "window", E: "active", D: "window" }, { title: "Around", caption: "B→E→D… if D points back to A (gray), cycle." }),
    g(
      { A: "match", D: "match" },
      { title: "Back edge D → A", caption: "A is still gray. Cycle A-B-E-D-A.", treeEdges: [...edges, { from: "D", to: "A", tone: "skip" }] },
    ),
  ];
}

export function bipartiteFrames(): Frame[] {
  return [
    g({ A: "lo" }, { title: "2-color from A", caption: "Color A green. Neighbors must be the other color (pink)." }),
    g({ A: "lo", B: "hi", D: "hi" }, { title: "Neighbors of A", caption: "B and D get pink." }),
    g({ A: "lo", B: "hi", D: "hi", C: "lo", E: "lo" }, { title: "Next layer", caption: "C and E must be green. Check every edge for a clash." }),
    g(
      { A: "lo", B: "hi", C: "lo", D: "hi", E: "skip" },
      { title: "Odd cycle?", caption: "If E were forced both colors (edge B–E and D–E), the graph is not bipartite. This pentagon-free sample is OK if E stays green.", treeEdges: edges.map((e) => ({ ...e, tone: "match" as CellTone })) },
    ),
  ];
}

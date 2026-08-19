import type { CellTone, Frame, TreeNode } from "../types";

const dag: TreeNode[] = [
  { id: "A", label: "A", x: 22, y: 22 },
  { id: "B", label: "B", x: 55, y: 22 },
  { id: "D", label: "D", x: 22, y: 62 },
  { id: "C", label: "C", x: 70, y: 62 },
];
const dagEdges = [
  { from: "A", to: "B" },
  { from: "A", to: "D" },
  { from: "B", to: "C" },
  { from: "D", to: "C" },
];

function graph(
  title: string,
  caption: string,
  nodes: TreeNode[],
  edges: Frame["treeEdges"],
  extra: Partial<Frame> = {},
): Frame {
  return { kind: "tree", title, caption, treeNodes: nodes, treeEdges: edges, ...extra };
}

export function topoSortFrames(): Frame[] {
  const paint = (map: Record<string, CellTone>, labels?: Record<string, string>): TreeNode[] =>
    dag.map((n) => ({ ...n, label: labels?.[n.id] ?? n.label, tone: map[n.id] ?? "idle" }));
  return [
    graph("DAG", "Indegrees: A=0, B=1, D=1, C=2. Kahn starts with A.", paint({ A: "active" }), dagEdges, {
      cells: [{ value: "order" }],
      note: "indeg A=0",
    }),
    graph("Peel A", "A goes to the order. B and D drop to indegree 0.", paint({ A: "done", B: "lo", D: "lo" }), dagEdges, {
      cells: [{ value: "A", tone: "match" }],
    }),
    graph("B then D", "Queue both. Order A, B, D (or A, D, B).", paint({ A: "done", B: "done", D: "done", C: "active" }), dagEdges, {
      cells: [
        { value: "A", tone: "done" },
        { value: "B", tone: "done" },
        { value: "D", tone: "done" },
      ],
    }),
    graph("C last", "C’s indegree hits 0. Unique finish. If anything remains, there was a cycle.", paint({ A: "done", B: "done", D: "done", C: "match" }), dagEdges.map((e) => ({ ...e, tone: "match" as CellTone })), {
      cells: ["A", "B", "D", "C"].map((value, i) => ({ value, tone: (i === 3 ? "match" : "done") as CellTone })),
      note: "A B D C",
    }),
  ];
}

const sp: TreeNode[] = [
  { id: "A", label: "A:0", x: 18, y: 48 },
  { id: "B", label: "B:∞", x: 50, y: 22 },
  { id: "C", label: "C:∞", x: 50, y: 78 },
  { id: "D", label: "D:∞", x: 82, y: 48 },
];
const spEdges = [
  { from: "A", to: "B" },
  { from: "A", to: "C" },
  { from: "B", to: "D" },
  { from: "C", to: "D" },
];

export function dijkstraFrames(): Frame[] {
  const L = (A: string, B: string, C: string, D: string, map: Record<string, CellTone> = {}): TreeNode[] =>
    [
      { id: "A", label: `A:${A}`, x: 18, y: 48, tone: map.A },
      { id: "B", label: `B:${B}`, x: 50, y: 22, tone: map.B },
      { id: "C", label: `C:${C}`, x: 50, y: 78, tone: map.C },
      { id: "D", label: `D:${D}`, x: 82, y: 48, tone: map.D },
    ];
  return [
    graph("Source A", "Weights: A-B 4, A-C 2, B-D 3, C-D 5. Non-negative — Dijkstra.", L("0", "∞", "∞", "∞", { A: "active" }), spEdges, { note: "pq: A" }),
    graph("Relax A", "B=4, C=2. Pop C next (closest).", L("0", "4", "2", "∞", { A: "done", C: "active", B: "window" }), spEdges),
    graph("From C", "D = 2+5 = 7. Still have B=4 in the heap.", L("0", "4", "2", "7", { A: "done", C: "done", B: "active", D: "window" }), spEdges),
    graph("From B", "D = min(7, 4+3=7)=7. Settled. Shortest A→D is 7.", L("0", "4", "2", "7", { A: "done", B: "done", C: "done", D: "match" }), spEdges.map((e) => ({ ...e, tone: "match" as CellTone })), { note: "dist D=7" }),
  ];
}

export function bellmanFordFrames(): Frame[] {
  const L = (vals: string[], map: Record<string, CellTone> = {}): TreeNode[] =>
    sp.map((n, i) => ({ ...n, label: `${n.id[0]}:${vals[i]}`, tone: map[n.id] }));
  return [
    graph("Allow negatives", "Bellman-Ford relaxes every edge |V|-1 times. A-C now costs -1.", L(["0", "∞", "∞", "∞"], { A: "active" }), spEdges, { note: "A→C = -1" }),
    graph("Pass 1", "Relax A-B=4, A-C=-1, then C-D=4, B-D=7. Best D so far 4.", L(["0", "4", "-1", "4"], { C: "lo", D: "window" }), spEdges),
    graph("Pass 2", "No better distances. Stable after V-1.", L(["0", "4", "-1", "4"], { D: "match" }), spEdges),
    graph("Neg cycle?", "A V-th pass that still improves ⇒ reachable negative cycle. Here none.", L(["0", "4", "-1", "4"], { A: "done", B: "done", C: "done", D: "done" }), spEdges, { note: "stable" }),
  ];
}

export function floydWarshallFrames(): Frame[] {
  return [
    {
      kind: "grid",
      title: "dist[i][j]",
      caption: "Rows/cols A B C. ∞ means no direct edge. Diagonal 0.",
      grid: [
        [
          { value: "0", tone: "done" },
          { value: "4", tone: "idle" },
          { value: "∞", tone: "idle" },
        ],
        [
          { value: "∞", tone: "idle" },
          { value: "0", tone: "done" },
          { value: "3", tone: "idle" },
        ],
        [
          { value: "2", tone: "idle" },
          { value: "∞", tone: "idle" },
          { value: "0", tone: "done" },
        ],
      ],
      note: "k will be A, then B, then C",
    },
    {
      kind: "grid",
      title: "k = B",
      caption: "A→C via B: 4+3=7 beats ∞.",
      grid: [
        [
          { value: "0", tone: "done" },
          { value: "4", tone: "idle" },
          { value: "7", tone: "active" },
        ],
        [
          { value: "∞", tone: "idle" },
          { value: "0", tone: "done" },
          { value: "3", tone: "idle" },
        ],
        [
          { value: "2", tone: "idle" },
          { value: "∞", tone: "idle" },
          { value: "0", tone: "done" },
        ],
      ],
    },
    {
      kind: "grid",
      title: "k = C",
      caption: "B→A via C: 3+2=5. All-pairs filled.",
      grid: [
        [
          { value: "0", tone: "done" },
          { value: "4", tone: "window" },
          { value: "7", tone: "window" },
        ],
        [
          { value: "5", tone: "match" },
          { value: "0", tone: "done" },
          { value: "3", tone: "window" },
        ],
        [
          { value: "2", tone: "window" },
          { value: "6", tone: "window" },
          { value: "0", tone: "done" },
        ],
      ],
      note: "O(V^3)",
    },
  ];
}

export function mstFrames(): Frame[] {
  const n = [
    { id: "A", label: "A", x: 22, y: 28 },
    { id: "B", label: "B", x: 78, y: 28 },
    { id: "C", label: "C", x: 22, y: 72 },
    { id: "D", label: "D", x: 78, y: 72 },
  ];
  const all = [
    { from: "A", to: "B" },
    { from: "A", to: "C" },
    { from: "B", to: "D" },
    { from: "C", to: "D" },
    { from: "A", to: "D" },
  ];
  const tone = (keep: string[]) =>
    all.map((e) => ({
      ...e,
      tone: (keep.includes(`${e.from}${e.to}`) ? "match" : "idle") as CellTone,
    }));
  return [
    graph("Four nodes", "Edge weights: AB1, AC2, BD2, CD3, AD4. Need 3 edges, no cycle.", n, all, { note: "Prim or Kruskal" }),
    graph("Cheapest AB", "Kruskal: sort, take AB (1). Prim: grow from A, same first edge.", n, tone(["AB"]), { note: "weight 1" }),
    graph("Then AC", "AC (2) connects C. Skip nothing yet.", n, tone(["AB", "AC"])),
    graph("Then BD", "BD (2) adds D. n-1 edges. Skip AD (would cycle). MST weight 5.", n, tone(["AB", "AC", "BD"]), { note: "MST 5" }),
  ];
}

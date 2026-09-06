import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { CellTone, Frame, TreeNode } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function dsuNodes(
  parents: number[],
  tones: Record<number, CellTone> = {},
): TreeNode[] {
  const pos = [
    { x: 18, y: 40 },
    { x: 40, y: 40 },
    { x: 62, y: 40 },
    { x: 84, y: 40 },
  ];
  return parents.map((p, i) => {
    const id = i + 1;
    return {
      id: String(id),
      label: `${id}→${p}`,
      x: pos[i]?.x ?? 50,
      y: pos[i]?.y ?? 40,
      tone: tones[id] ?? "idle",
    };
  });
}

function dsuEdges(parents: number[]): NonNullable<Frame["treeEdges"]> {
  return parents
    .map((p, i) => {
      const from = String(i + 1);
      const to = String(p);
      if (from === to) return null;
      return { from, to, tone: "window" as CellTone };
    })
    .filter(Boolean) as NonNullable<Frame["treeEdges"]>;
}

function redundantConnectionFrames(): Frame[] {
  return [
    {
      kind: "tree",
      title: "Extra edge in tree",
      caption: "n edges on n nodes ⇒ exactly one cycle. Return the edge that closes it.",
      treeNodes: dsuNodes([1, 2, 3]),
      treeEdges: [],
      note: "process in order",
    },
    {
      kind: "tree",
      title: "Union 1–2",
      caption: "Different roots → union. Parent[2]=1.",
      treeNodes: dsuNodes([1, 1, 3], { 1: "lo", 2: "lo" }),
      treeEdges: dsuEdges([1, 1, 3]),
      note: "ok",
    },
    {
      kind: "tree",
      title: "Union 2–3",
      caption: "find(2)=1, find(3)=3 → attach 3 under 1.",
      treeNodes: dsuNodes([1, 1, 1], { 1: "done", 2: "done", 3: "done" }),
      treeEdges: dsuEdges([1, 1, 1]),
      note: "still tree",
    },
    {
      kind: "tree",
      title: "Edge 1–3 cycles",
      caption: "find(1)==find(3). This edge is redundant — return it.",
      treeNodes: dsuNodes([1, 1, 1], { 1: "skip", 3: "skip" }),
      treeEdges: [
        ...dsuEdges([1, 1, 1]),
        { from: "1", to: "3", dashed: true, tone: "skip" },
      ],
      note: "[1,3]",
    },
    arrayFrame(
      "Last conflicting edge",
      "Scan edges in input order; the first (only) same-root edge is the answer.",
      [1, 2, 3],
      { 2: "skip" },
      {
        pointers: [{ name: "e", index: 2, color: PTR.R }],
        note: "return edges[i]",
      },
    ),
  ];
}

function redundantConnectionIIFrames(): Frame[] {
  const nodes: TreeNode[] = [
    { id: "1", label: "1", x: 50, y: 18 },
    { id: "2", label: "2", x: 22, y: 55 },
    { id: "3", label: "3", x: 50, y: 55 },
    { id: "4", label: "4", x: 78, y: 55 },
  ];
  return [
    {
      kind: "tree",
      title: "Directed rooted tree +1",
      caption: "Exactly one extra directed edge. Cases: two parents, or a cycle, or both.",
      treeNodes: nodes,
      treeEdges: [
        { from: "1", to: "2" },
        { from: "1", to: "3" },
        { from: "2", to: "3" },
        { from: "3", to: "4" },
      ],
      note: "3 has two parents",
    },
    {
      kind: "tree",
      title: "Record dual parents",
      caption: "Scan for node with indegree 2. CandA = earlier parent edge, CandB = later.",
      treeNodes: paintNodes(nodes, { "3": "skip" }),
      treeEdges: [
        { from: "1", to: "3", tone: "window" },
        { from: "2", to: "3", tone: "skip" },
        { from: "1", to: "2" },
        { from: "3", to: "4" },
      ],
      note: "candB = [2,3]",
    },
    {
      kind: "tree",
      title: "DSU skip candB",
      caption: "Try building with candB excluded. If no cycle → return candB.",
      treeNodes: paintNodes(nodes, { "1": "done", "2": "done", "3": "done", "4": "done" }),
      treeEdges: [
        { from: "1", to: "2", tone: "match" },
        { from: "1", to: "3", tone: "match" },
        { from: "3", to: "4", tone: "match" },
        { from: "2", to: "3", dashed: true, tone: "skip" },
      ],
      note: "valid without B",
    },
    {
      kind: "tree",
      title: "Else candA or cycle edge",
      caption: "If still cyclic without B, return candA. If no dual parent, return last cycle edge.",
      treeNodes: paintNodes(nodes, { "1": "lo", "3": "hi" }),
      treeEdges: [
        { from: "1", to: "3", tone: "skip" },
        { from: "1", to: "2" },
        { from: "2", to: "3" },
        { from: "3", to: "4" },
      ],
      note: "return candA",
    },
    arrayFrame(
      "Case summary",
      "indegree-2 + DSU trials pick which parent edge (or pure cycle edge) to delete.",
      [1, 2, 3],
      { 1: "skip" },
      { note: "delete one edge" },
    ),
  ];
}

function paintNodes(
  nodes: TreeNode[],
  map: Record<string, CellTone>,
): TreeNode[] {
  return nodes.map((n) => ({ ...n, tone: map[n.id] ?? "idle" }));
}

function graphValidTreeFrames(): Frame[] {
  return [
    {
      kind: "tree",
      title: "Tree ⇔ connected + n−1",
      caption: "Valid undirected tree: exactly n−1 edges and one component (no cycles).",
      treeNodes: dsuNodes([1, 2, 3, 4]),
      treeEdges: [],
      note: "n=4",
    },
    {
      kind: "tree",
      title: "Union edges",
      caption: "If any edge joins same roots → cycle → false. Else union.",
      treeNodes: dsuNodes([1, 1, 3, 4], { 1: "lo", 2: "lo" }),
      treeEdges: dsuEdges([1, 1, 3, 4]),
      note: "edge 1-2",
    },
    {
      kind: "tree",
      title: "Keep uniting",
      caption: "After n−1 successful unions, one component remains.",
      treeNodes: dsuNodes([1, 1, 1, 1], { 1: "done", 2: "done", 3: "done", 4: "done" }),
      treeEdges: dsuEdges([1, 1, 1, 1]),
      note: "connected",
    },
    {
      kind: "tree",
      title: "Too many edges",
      caption: "If edges.length != n−1, cannot be a tree (cycle or disconnected).",
      treeNodes: dsuNodes([1, 1, 1, 1], { 1: "skip", 3: "skip" }),
      treeEdges: [
        ...dsuEdges([1, 1, 1, 1]),
        { from: "1", to: "3", dashed: true, tone: "skip" },
      ],
      note: "e ≠ n−1",
    },
    arrayFrame(
      "Checklist",
      "Return true iff |edges|==n−1 and every union succeeded (one component).",
      [3, 1],
      { 0: "match", 1: "lo" },
      {
        pointers: [{ name: "ok", index: 0, color: PTR.L }],
        note: "n-1 edges · 1 root",
      },
    ),
  ];
}

export const redundantConnectionSolution: ProblemSolution = {
  approach:
    "Process edges with DSU. The first edge whose endpoints share a root closes the unique cycle — return that edge. O(n α(n)).",
  templates: langs(
    `def findRedundantConnection(edges):
    n = len(edges)
    p = list(range(n + 1))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]; x = p[x]
        return x
    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru == rv: return [u, v]
        p[rv] = ru
    return []`,
    `vector<int> findRedundantConnection(vector<vector<int>>& edges) {
    int n = edges.size();
    vector<int> p(n + 1);
    iota(p.begin(), p.end(), 0);
    auto find = [&](int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    for (auto& e : edges) {
        int ru = find(e[0]), rv = find(e[1]);
        if (ru == rv) return e;
        p[rv] = ru;
    }
    return {};
}`,
    `int[] findRedundantConnection(int[][] edges) {
    int n = edges.length;
    int[] p = new int[n + 1];
    for (int i = 0; i <= n; i++) p[i] = i;
    java.util.function.IntUnaryOperator find = x -> {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    for (int[] e : edges) {
        int ru = find.applyAsInt(e[0]), rv = find.applyAsInt(e[1]);
        if (ru == rv) return e;
        p[rv] = ru;
    }
    return new int[0];
}`,
    `function findRedundantConnection(edges) {
  const n = edges.length;
  const p = [...Array(n + 1).keys()];
  const find = (x) => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
  for (const [u, v] of edges) {
    const ru = find(u), rv = find(v);
    if (ru === rv) return [u, v];
    p[rv] = ru;
  }
  return [];
}`,
  ),
  frames: redundantConnectionFrames(),
};

export const redundantConnectionIISolution: ProblemSolution = {
  approach:
    "Directed case: find a node with two parents (candA earlier, candB later). Prefer deleting candB if the rest is a valid rooted tree (DSU no cycle); else candA. If no dual parent, delete the edge that DSU reports as cyclic. O(n).",
  templates: langs(
    `def findRedundantDirectedConnection(edges):
    n = len(edges)
    parent = [0] * (n + 1)
    candA = candB = None
    for u, v in edges:
        if parent[v]:
            candA, candB = [parent[v], v], [u, v]
        else:
            parent[v] = u
    p = list(range(n + 1))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]; x = p[x]
        return x
    for u, v in edges:
        if candB and [u, v] == candB: continue
        ru, rv = find(u), find(v)
        if ru == rv:
            return candA if candA else [u, v]
        p[rv] = ru
    return candB`,
    `vector<int> findRedundantDirectedConnection(vector<vector<int>>& edges) {
    int n = edges.size();
    vector<int> parent(n + 1), candA, candB;
    for (auto& e : edges) {
        if (parent[e[1]]) { candA = {parent[e[1]], e[1]}; candB = e; }
        else parent[e[1]] = e[0];
    }
    vector<int> p(n + 1);
    iota(p.begin(), p.end(), 0);
    auto find = [&](int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    for (auto& e : edges) {
        if (!candB.empty() && e == candB) continue;
        int ru = find(e[0]), rv = find(e[1]);
        if (ru == rv) return candA.empty() ? e : candA;
        p[rv] = ru;
    }
    return candB;
}`,
    `int[] findRedundantDirectedConnection(int[][] edges) {
    int n = edges.length;
    int[] parent = new int[n + 1];
    int[] candA = null, candB = null;
    for (int[] e : edges) {
        if (parent[e[1]] != 0) {
            candA = new int[]{parent[e[1]], e[1]};
            candB = e;
        } else parent[e[1]] = e[0];
    }
    int[] p = new int[n + 1];
    for (int i = 0; i <= n; i++) p[i] = i;
    java.util.function.IntUnaryOperator find = x -> {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    for (int[] e : edges) {
        if (candB != null && e[0] == candB[0] && e[1] == candB[1]) continue;
        int ru = find.applyAsInt(e[0]), rv = find.applyAsInt(e[1]);
        if (ru == rv) return candA != null ? candA : e;
        p[rv] = ru;
    }
    return candB;
}`,
    `function findRedundantDirectedConnection(edges) {
  const n = edges.length;
  const parent = Array(n + 1).fill(0);
  let candA = null, candB = null;
  for (const [u, v] of edges) {
    if (parent[v]) { candA = [parent[v], v]; candB = [u, v]; }
    else parent[v] = u;
  }
  const p = [...Array(n + 1).keys()];
  const find = (x) => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
  for (const [u, v] of edges) {
    if (candB && u === candB[0] && v === candB[1]) continue;
    const ru = find(u), rv = find(v);
    if (ru === rv) return candA || [u, v];
    p[rv] = ru;
  }
  return candB;
}`,
  ),
  frames: redundantConnectionIIFrames(),
};

export const graphValidTreeSolution: ProblemSolution = {
  approach:
    "A graph is a valid tree iff it has exactly n−1 edges and is connected with no cycles. DSU: reject if any edge joins the same root; accept if all unions succeed and |edges|==n−1. O(n α(n)).",
  templates: langs(
    `def validTree(n, edges):
    if len(edges) != n - 1: return False
    p = list(range(n))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]; x = p[x]
        return x
    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra == rb: return False
        p[rb] = ra
    return True`,
    `bool validTree(int n, vector<vector<int>>& edges) {
    if ((int)edges.size() != n - 1) return false;
    vector<int> p(n);
    iota(p.begin(), p.end(), 0);
    auto find = [&](int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    for (auto& e : edges) {
        int ra = find(e[0]), rb = find(e[1]);
        if (ra == rb) return false;
        p[rb] = ra;
    }
    return true;
}`,
    `boolean validTree(int n, int[][] edges) {
    if (edges.length != n - 1) return false;
    int[] p = new int[n];
    for (int i = 0; i < n; i++) p[i] = i;
    java.util.function.IntUnaryOperator find = x -> {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    for (int[] e : edges) {
        int ra = find.applyAsInt(e[0]), rb = find.applyAsInt(e[1]);
        if (ra == rb) return false;
        p[rb] = ra;
    }
    return true;
}`,
    `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const p = [...Array(n).keys()];
  const find = (x) => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;
    p[rb] = ra;
  }
  return true;
}`,
  ),
  frames: graphValidTreeFrames(),
};

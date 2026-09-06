import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { CellTone, Frame, TreeNode } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function paint(
  nodes: TreeNode[],
  map: Record<string, CellTone>,
): TreeNode[] {
  return nodes.map((n) => ({ ...n, tone: map[n.id] ?? "idle" }));
}

function graph(
  title: string,
  caption: string,
  nodes: TreeNode[],
  edges: Frame["treeEdges"],
  map: Record<string, CellTone>,
  extra: Partial<Frame> = {},
): Frame {
  return {
    kind: "tree",
    title,
    caption,
    treeNodes: paint(nodes, map),
    treeEdges: edges,
    ...extra,
  };
}

const pts: TreeNode[] = [
  { id: "0", label: "0", x: 22, y: 28 },
  { id: "1", label: "1", x: 78, y: 28 },
  { id: "2", label: "2", x: 22, y: 72 },
  { id: "3", label: "3", x: 78, y: 72 },
];

function minCostKruskalFrames(): Frame[] {
  const paintE = (take: string[], skip: string[] = []) => {
    const list = [
      { from: "0", to: "1", id: "01" },
      { from: "0", to: "2", id: "02" },
      { from: "1", to: "3", id: "13" },
      { from: "2", to: "3", id: "23" },
      { from: "0", to: "3", id: "03" },
    ];
    return list.map((e) => ({
      from: e.from,
      to: e.to,
      tone: (take.includes(e.id) ? "match" : skip.includes(e.id) ? "skip" : "idle") as CellTone,
      dashed: skip.includes(e.id),
    }));
  };
  return [
    graph(
      "Sort Manhattan edges",
      "Build all pairs, sort by |Δx|+|Δy|. Kruskal + DSU.",
      pts,
      paintE([]),
      {},
      { note: "complete graph" },
    ),
    graph(
      "Take cheapest",
      "Smallest edges whose endpoints have different roots join the forest.",
      pts,
      paintE(["01", "02"]),
      { "0": "done", "1": "done", "2": "done" },
      { note: "2 edges so far" },
    ),
    graph(
      "Skip cycles",
      "An edge inside one component is skipped (dashed).",
      pts,
      paintE(["01", "02", "13"], ["03"]),
      { "0": "done", "1": "done", "2": "done", "3": "match" },
      { note: "n−1 edges" },
    ),
    arrayFrame(
      "Sum accepted weights",
      "Total of the n−1 Kruskal edges is min cost to connect all points.",
      [1, 2, 2],
      { 0: "match", 1: "match", 2: "match" },
      {
        pointers: [{ name: "sum", index: 2, color: PTR.M }],
        note: "ans = sum",
      },
    ),
    graph(
      "Forest → tree",
      "When used == n−1, every point is connected — MST complete.",
      pts,
      paintE(["01", "02", "13"]),
      { "0": "match", "1": "match", "2": "match", "3": "match" },
      { note: "done" },
    ),
  ];
}

function kruskalGfgFrames(): Frame[] {
  const n: TreeNode[] = [
    { id: "A", label: "A", x: 22, y: 28 },
    { id: "B", label: "B", x: 78, y: 28 },
    { id: "C", label: "C", x: 22, y: 72 },
    { id: "D", label: "D", x: 78, y: 72 },
  ];
  const paintE = (take: string[], skip: string[] = []) => {
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
    graph(
      "GFG Kruskal",
      "Sort edges by weight. DSU decides take vs skip. Goal: MST weight.",
      n,
      paintE([]),
      {},
      { note: "AB1 AC2 BD2 CD3" },
    ),
    graph(
      "Take AB then AC",
      "Cheapest edges with distinct roots. Forest grows.",
      n,
      paintE(["AB", "AC"]),
      { A: "done", B: "done", C: "done" },
      { note: "weight 3" },
    ),
    graph(
      "Take BD",
      "BD adds D. Now n−1 edges. MST weight 1+2+2=5.",
      n,
      paintE(["AB", "AC", "BD"]),
      { A: "done", B: "done", C: "done", D: "match" },
      { note: "MST = 5" },
    ),
    graph(
      "Reject CD",
      "find(C)==find(D). CD would cycle — skip.",
      n,
      paintE(["AB", "AC", "BD"], ["CD"]),
      { A: "match", B: "match", C: "match", D: "match" },
      { note: "skip CD" },
    ),
    arrayFrame(
      "Return total",
      "Sum of accepted edge weights (or list of edges, per GFG variant).",
      [1, 2, 2],
      { 0: "done", 1: "done", 2: "match" },
      { note: "total = 5" },
    ),
  ];
}

function criticalKruskalFrames(): Frame[] {
  const nodes: TreeNode[] = [
    { id: "0", label: "0", x: 22, y: 30 },
    { id: "1", label: "1", x: 78, y: 30 },
    { id: "2", label: "2", x: 22, y: 72 },
    { id: "3", label: "3", x: 78, y: 72 },
  ];
  return [
    graph(
      "Kruskal base W",
      "Sort edges with original indices. One Kruskal run → MST weight W.",
      nodes,
      [
        { from: "0", to: "1", tone: "match" as CellTone },
        { from: "0", to: "2", tone: "match" as CellTone },
        { from: "1", to: "3", tone: "match" as CellTone },
      ],
      { "0": "done", "1": "done", "2": "done", "3": "done" },
      { note: "W computed" },
    ),
    graph(
      "Block edge i",
      "Kruskal without edge i. Cost > W ⇒ i is critical.",
      nodes,
      [
        { from: "0", to: "1", dashed: true, tone: "skip" as CellTone },
        { from: "0", to: "2", tone: "window" as CellTone },
        { from: "2", to: "3", tone: "lo" as CellTone },
        { from: "1", to: "3", tone: "window" as CellTone },
      ],
      { "0": "skip", "1": "skip" },
      { note: "critical" },
    ),
    graph(
      "Force edge i",
      "Union edge i first, then Kruskal rest. Cost == W ⇒ pseudo-critical.",
      nodes,
      [
        { from: "2", to: "3", tone: "match" as CellTone },
        { from: "0", to: "1", tone: "match" as CellTone },
        { from: "0", to: "2", tone: "match" as CellTone },
      ],
      { "2": "lo", "3": "lo" },
      { note: "pseudo" },
    ),
    arrayFrame(
      "Index buckets",
      "Push i into critical[] or pseudoCritical[]. Edges in neither are never in an MST.",
      [0, 1, 2, 3],
      { 0: "skip", 1: "match", 2: "window", 3: "idle" },
      {
        pointers: [{ name: "i", index: 1, color: PTR.L }],
        note: "classify",
      },
    ),
    graph(
      "Two-list answer",
      "Return [critical, pseudoCritical] using the original edge indices.",
      nodes,
      [
        { from: "0", to: "1", tone: "skip" as CellTone },
        { from: "0", to: "2", tone: "match" as CellTone },
        { from: "1", to: "3", tone: "match" as CellTone },
        { from: "2", to: "3", tone: "window" as CellTone },
      ],
      {},
      { note: "done" },
    ),
  ];
}

export const minCostConnectPointsKruskalSolution: ProblemSolution = {
  approach:
    "Generate all Manhattan edges, sort by weight, Kruskal with DSU until n−1 edges accepted. Sum is the answer. O(n² log n).",
  templates: langs(
    `def minCostConnectPoints(points):
    n = len(points)
    edges = []
    for i in range(n):
        for j in range(i + 1, n):
            w = abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])
            edges.append((w, i, j))
    edges.sort()
    p = list(range(n))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]; x = p[x]
        return x
    ans, used = 0, 0
    for w, u, v in edges:
        ru, rv = find(u), find(v)
        if ru != rv:
            p[rv] = ru; ans += w; used += 1
            if used == n - 1: break
    return ans`,
    `int minCostConnectPoints(vector<vector<int>>& points) {
    int n = points.size();
    vector<array<int,3>> edges;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            edges.push_back({abs(points[i][0]-points[j][0]) + abs(points[i][1]-points[j][1]), i, j});
    sort(edges.begin(), edges.end());
    vector<int> p(n);
    iota(p.begin(), p.end(), 0);
    auto find = [&](int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    int ans = 0, used = 0;
    for (auto& e : edges) {
        int ru = find(e[1]), rv = find(e[2]);
        if (ru != rv) { p[rv] = ru; ans += e[0]; if (++used == n - 1) break; }
    }
    return ans;
}`,
    `int minCostConnectPoints(int[][] points) {
    int n = points.length;
    List<int[]> edges = new ArrayList<>();
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            edges.add(new int[]{Math.abs(points[i][0]-points[j][0]) + Math.abs(points[i][1]-points[j][1]), i, j});
    edges.sort(Comparator.comparingInt(a -> a[0]));
    int[] p = new int[n];
    for (int i = 0; i < n; i++) p[i] = i;
    java.util.function.IntUnaryOperator find = x -> {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    int ans = 0, used = 0;
    for (int[] e : edges) {
        int ru = find.applyAsInt(e[1]), rv = find.applyAsInt(e[2]);
        if (ru != rv) { p[rv] = ru; ans += e[0]; if (++used == n - 1) break; }
    }
    return ans;
}`,
    `function minCostConnectPoints(points) {
  const n = points.length, edges = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      edges.push([Math.abs(points[i][0]-points[j][0]) + Math.abs(points[i][1]-points[j][1]), i, j]);
  edges.sort((a, b) => a[0] - b[0]);
  const p = [...Array(n).keys()];
  const find = (x) => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
  let ans = 0, used = 0;
  for (const [w, u, v] of edges) {
    const ru = find(u), rv = find(v);
    if (ru !== rv) { p[rv] = ru; ans += w; if (++used === n - 1) break; }
  }
  return ans;
}`,
  ),
  frames: minCostKruskalFrames(),
};

export const kruskalGfgSolution: ProblemSolution = {
  approach:
    "Classic Kruskal: sort edges by weight, DSU-union when roots differ, accumulate weight until V−1 edges. Return MST cost (GFG). O(E log E).",
  templates: langs(
    `def spanningTree(V, adj):
    edges = []
    for u in range(V):
        for v, w in adj[u]:
            if u < v: edges.append((w, u, v))
    edges.sort()
    p = list(range(V))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]; x = p[x]
        return x
    ans, used = 0, 0
    for w, u, v in edges:
        ru, rv = find(u), find(v)
        if ru != rv:
            p[rv] = ru; ans += w; used += 1
            if used == V - 1: break
    return ans`,
    `int spanningTree(int V, vector<vector<int>> adj[]) {
    vector<array<int,3>> edges;
    for (int u = 0; u < V; u++)
        for (auto& e : adj[u])
            if (u < e[0]) edges.push_back({e[1], u, e[0]});
    sort(edges.begin(), edges.end());
    vector<int> p(V);
    iota(p.begin(), p.end(), 0);
    auto find = [&](int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    int ans = 0, used = 0;
    for (auto& e : edges) {
        int ru = find(e[1]), rv = find(e[2]);
        if (ru != rv) { p[rv] = ru; ans += e[0]; if (++used == V - 1) break; }
    }
    return ans;
}`,
    `int spanningTree(int V, List<List<int[]>> adj) {
    List<int[]> edges = new ArrayList<>();
    for (int u = 0; u < V; u++)
        for (int[] e : adj.get(u))
            if (u < e[0]) edges.add(new int[]{e[1], u, e[0]});
    edges.sort(Comparator.comparingInt(a -> a[0]));
    int[] p = new int[V];
    for (int i = 0; i < V; i++) p[i] = i;
    java.util.function.IntUnaryOperator find = x -> {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    int ans = 0, used = 0;
    for (int[] e : edges) {
        int ru = find.applyAsInt(e[1]), rv = find.applyAsInt(e[2]);
        if (ru != rv) { p[rv] = ru; ans += e[0]; if (++used == V - 1) break; }
    }
    return ans;
}`,
    `function spanningTree(V, adj) {
  const edges = [];
  for (let u = 0; u < V; u++)
    for (const [v, w] of adj[u])
      if (u < v) edges.push([w, u, v]);
  edges.sort((a, b) => a[0] - b[0]);
  const p = [...Array(V).keys()];
  const find = (x) => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
  let ans = 0, used = 0;
  for (const [w, u, v] of edges) {
    const ru = find(u), rv = find(v);
    if (ru !== rv) { p[rv] = ru; ans += w; if (++used === V - 1) break; }
  }
  return ans;
}`,
  ),
  frames: kruskalGfgFrames(),
};

export const criticalMSTEdgesKruskalSolution: ProblemSolution = {
  approach:
    "Same classification as MST critical edges, implemented with Kruskal helpers: base weight W, then per-edge blocked and forced Kruskal runs. O(E² α(V)).",
  templates: langs(
    `def findCriticalAndPseudoCriticalEdges(n, edges):
    m = len(edges)
    indexed = sorted((w, u, v, i) for i, (u, v, w) in enumerate(edges))
    def kruskal(block=-1, force=-1):
        p = list(range(n))
        def find(x):
            while p[x] != x: p[x] = p[p[x]]; x = p[x]
            return x
        cost = used = 0
        def add(u, v, w):
            nonlocal cost, used
            ru, rv = find(u), find(v)
            if ru != rv:
                p[rv] = ru; cost += w; used += 1
        if force != -1:
            u, v, w = edges[force]; add(u, v, w)
        for w, u, v, i in indexed:
            if i in (block, force): continue
            add(u, v, w)
        return cost if used == n - 1 else 10**18
    base = kruskal()
    crit, pseudo = [], []
    for i in range(m):
        if kruskal(block=i) > base: crit.append(i)
        elif kruskal(force=i) == base: pseudo.append(i)
    return [crit, pseudo]`,
    `vector<vector<int>> findCriticalAndPseudoCriticalEdges(int n, vector<vector<int>>& edges) {
    int m = edges.size();
    vector<array<int,4>> indexed;
    for (int i = 0; i < m; i++) indexed.push_back({edges[i][2], edges[i][0], edges[i][1], i});
    sort(indexed.begin(), indexed.end());
    auto kruskal = [&](int block, int force) {
        vector<int> p(n); iota(p.begin(), p.end(), 0);
        auto find = [&](int x) {
            while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
        };
        int cost = 0, used = 0;
        auto add = [&](int u, int v, int w) {
            int ru = find(u), rv = find(v);
            if (ru != rv) { p[rv] = ru; cost += w; used++; }
        };
        if (force != -1) add(edges[force][0], edges[force][1], edges[force][2]);
        for (auto& e : indexed) {
            if (e[3] == block || e[3] == force) continue;
            add(e[1], e[2], e[0]);
        }
        return used == n - 1 ? cost : INT_MAX / 4;
    };
    int base = kruskal(-1, -1);
    vector<int> crit, pseudo;
    for (int i = 0; i < m; i++) {
        if (kruskal(i, -1) > base) crit.push_back(i);
        else if (kruskal(-1, i) == base) pseudo.push_back(i);
    }
    return {crit, pseudo};
}`,
    `List<List<Integer>> findCriticalAndPseudoCriticalEdges(int n, int[][] edges) {
    int m = edges.length;
    int[][] indexed = new int[m][4];
    for (int i = 0; i < m; i++)
        indexed[i] = new int[]{edges[i][2], edges[i][0], edges[i][1], i};
    Arrays.sort(indexed, Comparator.comparingInt(a -> a[0]));
    java.util.function.BiFunction<Integer,Integer,Integer> kruskal = (block, force) -> {
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        java.util.function.IntUnaryOperator find = x -> {
            while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
        };
        int[] cu = {0, 0};
        java.util.function.BiConsumer<int[], Integer> add = (uv, w) -> {
            int ru = find.applyAsInt(uv[0]), rv = find.applyAsInt(uv[1]);
            if (ru != rv) { p[rv] = ru; cu[0] += w; cu[1]++; }
        };
        if (force >= 0) add.accept(new int[]{edges[force][0], edges[force][1]}, edges[force][2]);
        for (int[] e : indexed) {
            if (e[3] == block || e[3] == force) continue;
            add.accept(new int[]{e[1], e[2]}, e[0]);
        }
        return cu[1] == n - 1 ? cu[0] : Integer.MAX_VALUE / 4;
    };
    int base = kruskal.apply(-1, -1);
    List<Integer> crit = new ArrayList<>(), pseudo = new ArrayList<>();
    for (int i = 0; i < m; i++) {
        if (kruskal.apply(i, -1) > base) crit.add(i);
        else if (kruskal.apply(-1, i) == base) pseudo.add(i);
    }
    return List.of(crit, pseudo);
}`,
    `function findCriticalAndPseudoCriticalEdges(n, edges) {
  const m = edges.length;
  const indexed = edges.map(([u, v, w], i) => [w, u, v, i]).sort((a, b) => a[0] - b[0]);
  const kruskal = (block = -1, force = -1) => {
    const p = [...Array(n).keys()];
    const find = (x) => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
    let cost = 0, used = 0;
    const add = (u, v, w) => {
      const ru = find(u), rv = find(v);
      if (ru !== rv) { p[rv] = ru; cost += w; used++; }
    };
    if (force !== -1) add(edges[force][0], edges[force][1], edges[force][2]);
    for (const [w, u, v, i] of indexed) {
      if (i === block || i === force) continue;
      add(u, v, w);
    }
    return used === n - 1 ? cost : 1e18;
  };
  const base = kruskal();
  const crit = [], pseudo = [];
  for (let i = 0; i < m; i++) {
    if (kruskal(i) > base) crit.push(i);
    else if (kruskal(-1, i) === base) pseudo.push(i);
  }
  return [crit, pseudo];
}`,
  ),
  frames: criticalKruskalFrames(),
};

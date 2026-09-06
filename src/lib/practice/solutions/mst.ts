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

function minCostConnectFrames(): Frame[] {
  const all = [
    { from: "0", to: "1" },
    { from: "0", to: "2" },
    { from: "1", to: "3" },
    { from: "2", to: "3" },
    { from: "0", to: "3" },
  ];
  const tone = (keep: string[]) =>
    all.map((e) => ({
      ...e,
      tone: (keep.includes(`${e.from}${e.to}`) ? "match" : "idle") as CellTone,
    }));
  return [
    graph(
      "Points as complete graph",
      "Edge weight = Manhattan |x1-x2|+|y1-y2|. Connect all with MST (Prim).",
      pts,
      all,
      {},
      { note: "Prim from 0" },
    ),
    graph(
      "Grow cheapest cut",
      "From {0}, closest is 1 (or 2). Take that edge into the tree.",
      pts,
      tone(["01"]),
      { "0": "done", "1": "active" },
      { note: "cost += w01" },
    ),
    graph(
      "Expand frontier",
      "Seen {0,1}. Next cheapest cut edge adds 2 or 3.",
      pts,
      tone(["01", "02"]),
      { "0": "done", "1": "done", "2": "active" },
      { note: "cost += w02" },
    ),
    graph(
      "n−1 edges",
      "Add last point. Total Manhattan MST cost is the answer.",
      pts,
      tone(["01", "02", "13"]),
      { "0": "done", "1": "done", "2": "done", "3": "match" },
      { note: "connected" },
    ),
    arrayFrame(
      "Prim heap keys",
      "minEdge[v] = cheapest link into the growing set. Pop unused min each step.",
      [0, 1, 2, 3],
      { 0: "done", 3: "match" },
      {
        pointers: [{ name: "u", index: 0, color: PTR.L }],
        note: "seen grows",
      },
    ),
  ];
}

function optimizeWaterFrames(): Frame[] {
  const nodes: TreeNode[] = [
    { id: "0", label: "well", x: 50, y: 12 },
    { id: "1", label: "1", x: 22, y: 50 },
    { id: "2", label: "2", x: 50, y: 70 },
    { id: "3", label: "3", x: 78, y: 50 },
  ];
  return [
    graph(
      "Virtual well node",
      "Add node 0. Edge 0→i costs wells[i−1]. Pipes are undirected edges among houses.",
      nodes,
      [
        { from: "0", to: "1" },
        { from: "0", to: "2" },
        { from: "0", to: "3" },
        { from: "1", to: "2" },
        { from: "2", to: "3" },
      ],
      { "0": "lo" },
      { note: "house wells + pipes" },
    ),
    graph(
      "MST = optimal plan",
      "Building a well = taking 0–i. Sharing water = pipe edges. Prim/Kruskal MST.",
      nodes,
      [
        { from: "0", to: "1", tone: "match" as CellTone },
        { from: "1", to: "2", tone: "match" as CellTone },
        { from: "2", to: "3", tone: "match" as CellTone },
        { from: "0", to: "2", dashed: true, tone: "skip" as CellTone },
        { from: "0", to: "3", dashed: true, tone: "skip" as CellTone },
      ],
      { "0": "done", "1": "match", "2": "match", "3": "match" },
      { note: "one well + pipes" },
    ),
    graph(
      "All wells option",
      "If pipes are expensive, MST may take every 0–i and skip pipes.",
      nodes,
      [
        { from: "0", to: "1", tone: "match" as CellTone },
        { from: "0", to: "2", tone: "match" as CellTone },
        { from: "0", to: "3", tone: "match" as CellTone },
      ],
      { "0": "lo", "1": "done", "2": "done", "3": "done" },
      { note: "wells only" },
    ),
    arrayFrame(
      "Edge list",
      "Collect (0,i,wells[i-1]) plus every pipe. Kruskal/Prim on n+1 nodes.",
      [5, 3, 4, 2],
      { 3: "match" },
      { note: "sample costs" },
    ),
    graph(
      "Answer MST weight",
      "Sum of chosen well + pipe edges is min cost to supply all houses.",
      nodes,
      [
        { from: "0", to: "1", tone: "match" as CellTone },
        { from: "1", to: "2", tone: "match" as CellTone },
        { from: "2", to: "3", tone: "match" as CellTone },
      ],
      { "0": "done", "1": "done", "2": "done", "3": "done" },
      { note: "total cost" },
    ),
  ];
}

function criticalMSTFrames(): Frame[] {
  const nodes: TreeNode[] = [
    { id: "0", label: "0", x: 22, y: 30 },
    { id: "1", label: "1", x: 78, y: 30 },
    { id: "2", label: "2", x: 22, y: 72 },
    { id: "3", label: "3", x: 78, y: 72 },
  ];
  return [
    graph(
      "Find MST weight W",
      "First Kruskal/Prim on all edges → base MST cost W.",
      nodes,
      [
        { from: "0", to: "1", tone: "match" as CellTone },
        { from: "1", to: "3", tone: "match" as CellTone },
        { from: "0", to: "2", tone: "match" as CellTone },
        { from: "2", to: "3", dashed: true, tone: "skip" as CellTone },
      ],
      { "0": "done", "1": "done", "2": "done", "3": "done" },
      { note: "W = MST weight" },
    ),
    graph(
      "Critical edge",
      "Exclude edge e; if MST weight > W (or disconnected), e is critical.",
      nodes,
      [
        { from: "0", to: "1", dashed: true, tone: "skip" as CellTone },
        { from: "1", to: "3", tone: "window" as CellTone },
        { from: "0", to: "2", tone: "window" as CellTone },
        { from: "2", to: "3", tone: "lo" as CellTone },
      ],
      { "0": "skip", "1": "skip" },
      { note: "without e → worse" },
    ),
    graph(
      "Pseudo-critical",
      "Force-include e; if MST still weight W, e is pseudo-critical (not critical).",
      nodes,
      [
        { from: "2", to: "3", tone: "match" as CellTone },
        { from: "0", to: "1", tone: "match" as CellTone },
        { from: "0", to: "2", tone: "match" as CellTone },
      ],
      { "2": "lo", "3": "lo" },
      { note: "forced e still W" },
    ),
    arrayFrame(
      "Classify each edge",
      "critical = must appear in every MST. pseudo = appears in some MST.",
      [0, 1, 2, 3],
      { 0: "skip", 1: "match", 2: "match", 3: "window" },
      {
        pointers: [{ name: "e", index: 0, color: PTR.R }],
        note: "index lists",
      },
    ),
    graph(
      "Return two lists",
      "Answer [criticalIndices, pseudoCriticalIndices] with original edge indices.",
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

export const minCostConnectPointsSolution: ProblemSolution = {
  approach:
    "Complete graph with Manhattan distances. Prim: grow a set from point 0, always adding the cheapest edge to an unseen point (heap). Sum of those n−1 edges. O(n² log n).",
  templates: langs(
    `import heapq

def minCostConnectPoints(points):
    n = len(points)
    seen = [False] * n
    h = [(0, 0)]
    ans, taken = 0, 0
    while h and taken < n:
        w, u = heapq.heappop(h)
        if seen[u]: continue
        seen[u] = True
        ans += w
        taken += 1
        x, y = points[u]
        for v in range(n):
            if not seen[v]:
                heapq.heappush(h, (abs(x - points[v][0]) + abs(y - points[v][1]), v))
    return ans`,
    `int minCostConnectPoints(vector<vector<int>>& points) {
    int n = points.size();
    vector<char> seen(n);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> h;
    h.push({0, 0});
    int ans = 0, taken = 0;
    while (!h.empty() && taken < n) {
        auto [w, u] = h.top(); h.pop();
        if (seen[u]) continue;
        seen[u] = 1; ans += w; taken++;
        for (int v = 0; v < n; v++) if (!seen[v])
            h.push({abs(points[u][0]-points[v][0]) + abs(points[u][1]-points[v][1]), v});
    }
    return ans;
}`,
    `int minCostConnectPoints(int[][] points) {
    int n = points.length;
    boolean[] seen = new boolean[n];
    PriorityQueue<int[]> h = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    h.add(new int[]{0, 0});
    int ans = 0, taken = 0;
    while (!h.isEmpty() && taken < n) {
        int[] cur = h.poll();
        int w = cur[0], u = cur[1];
        if (seen[u]) continue;
        seen[u] = true; ans += w; taken++;
        for (int v = 0; v < n; v++) if (!seen[v])
            h.add(new int[]{Math.abs(points[u][0]-points[v][0]) + Math.abs(points[u][1]-points[v][1]), v});
    }
    return ans;
}`,
    `function minCostConnectPoints(points) {
  const n = points.length, seen = Array(n).fill(false);
  const h = [[0, 0]];
  const pop = () => { h.sort((a, b) => a[0] - b[0]); return h.shift(); };
  let ans = 0, taken = 0;
  while (h.length && taken < n) {
    const [w, u] = pop();
    if (seen[u]) continue;
    seen[u] = true; ans += w; taken++;
    for (let v = 0; v < n; v++) if (!seen[v])
      h.push([Math.abs(points[u][0]-points[v][0]) + Math.abs(points[u][1]-points[v][1]), v]);
  }
  return ans;
}`,
  ),
  frames: minCostConnectFrames(),
};

export const optimizeWaterDistributionSolution: ProblemSolution = {
  approach:
    "Add a virtual well node 0 with edges to house i of cost wells[i-1]. Include all pipes. MST on this graph is the minimum cost to supply every house (wells + shared pipes). O(e log e).",
  templates: langs(
    `def minCostToSupplyWater(n, wells, pipes):
    edges = [(wells[i], 0, i + 1) for i in range(n)]
    for a, b, c in pipes:
        edges.append((c, a, b))
    edges.sort()
    p = list(range(n + 1))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]; x = p[x]
        return x
    ans, used = 0, 0
    for w, u, v in edges:
        ru, rv = find(u), find(v)
        if ru != rv:
            p[rv] = ru; ans += w; used += 1
            if used == n: break
    return ans`,
    `int minCostToSupplyWater(int n, vector<int>& wells, vector<vector<int>>& pipes) {
    vector<array<int,3>> edges;
    for (int i = 0; i < n; i++) edges.push_back({wells[i], 0, i + 1});
    for (auto& p : pipes) edges.push_back({p[2], p[0], p[1]});
    sort(edges.begin(), edges.end());
    vector<int> parent(n + 1);
    iota(parent.begin(), parent.end(), 0);
    auto find = [&](int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    };
    int ans = 0, used = 0;
    for (auto& e : edges) {
        int ru = find(e[1]), rv = find(e[2]);
        if (ru != rv) { parent[rv] = ru; ans += e[0]; if (++used == n) break; }
    }
    return ans;
}`,
    `int minCostToSupplyWater(int n, int[] wells, int[][] pipes) {
    List<int[]> edges = new ArrayList<>();
    for (int i = 0; i < n; i++) edges.add(new int[]{wells[i], 0, i + 1});
    for (int[] p : pipes) edges.add(new int[]{p[2], p[0], p[1]});
    edges.sort(Comparator.comparingInt(a -> a[0]));
    int[] parent = new int[n + 1];
    for (int i = 0; i <= n; i++) parent[i] = i;
    java.util.function.IntUnaryOperator find = x -> {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    };
    int ans = 0, used = 0;
    for (int[] e : edges) {
        int ru = find.applyAsInt(e[1]), rv = find.applyAsInt(e[2]);
        if (ru != rv) { parent[rv] = ru; ans += e[0]; if (++used == n) break; }
    }
    return ans;
}`,
    `function minCostToSupplyWater(n, wells, pipes) {
  const edges = wells.map((w, i) => [w, 0, i + 1]);
  for (const [a, b, c] of pipes) edges.push([c, a, b]);
  edges.sort((a, b) => a[0] - b[0]);
  const p = [...Array(n + 1).keys()];
  const find = (x) => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
  let ans = 0, used = 0;
  for (const [w, u, v] of edges) {
    const ru = find(u), rv = find(v);
    if (ru !== rv) { p[rv] = ru; ans += w; if (++used === n) break; }
  }
  return ans;
}`,
  ),
  frames: optimizeWaterFrames(),
};

export const criticalMSTEdgesSolution: ProblemSolution = {
  approach:
    "Compute base MST weight W. For each edge: (1) force-exclude — if new MST > W or impossible, critical; (2) else force-include — if MST still W, pseudo-critical. Return both index lists. O(e² α(n)).",
  templates: langs(
    `def findCriticalAndPseudoCriticalEdges(n, edges):
    m = len(edges)
    indexed = sorted([(w, u, v, i) for i, (u, v, w) in enumerate(edges)])
    def mst(block=-1, force=-1):
        p = list(range(n))
        def find(x):
            while p[x] != x: p[x] = p[p[x]]; x = p[x]
            return x
        cost, used = 0, 0
        def add(u, v, w):
            nonlocal cost, used
            ru, rv = find(u), find(v)
            if ru != rv:
                p[rv] = ru; cost += w; used += 1
        if force != -1:
            u, v, w = edges[force]
            add(u, v, w)
        for w, u, v, i in indexed:
            if i == block or i == force: continue
            add(u, v, w)
        return cost if used == n - 1 else 10**18
    base = mst()
    crit, pseudo = [], []
    for i in range(m):
        if mst(block=i) > base: crit.append(i)
        elif mst(force=i) == base: pseudo.append(i)
    return [crit, pseudo]`,
    `vector<vector<int>> findCriticalAndPseudoCriticalEdges(int n, vector<vector<int>>& edges) {
    int m = edges.size();
    vector<array<int,4>> indexed;
    for (int i = 0; i < m; i++) indexed.push_back({edges[i][2], edges[i][0], edges[i][1], i});
    sort(indexed.begin(), indexed.end());
    auto mst = [&](int block, int force) {
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
    int base = mst(-1, -1);
    vector<int> crit, pseudo;
    for (int i = 0; i < m; i++) {
        if (mst(i, -1) > base) crit.push_back(i);
        else if (mst(-1, i) == base) pseudo.push_back(i);
    }
    return {crit, pseudo};
}`,
    `List<List<Integer>> findCriticalAndPseudoCriticalEdges(int n, int[][] edges) {
    int m = edges.length;
    int[][] indexed = new int[m][4];
    for (int i = 0; i < m; i++)
        indexed[i] = new int[]{edges[i][2], edges[i][0], edges[i][1], i};
    Arrays.sort(indexed, Comparator.comparingInt(a -> a[0]));
    java.util.function.BiFunction<Integer,Integer,Integer> mst = (block, force) -> {
        int[] p = new int[n];
        for (int i = 0; i < n; i++) p[i] = i;
        java.util.function.IntUnaryOperator find = x -> {
            while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
        };
        int[] costUsed = {0, 0};
        java.util.function.BiConsumer<int[], Integer> add = (uv, w) -> {
            int ru = find.applyAsInt(uv[0]), rv = find.applyAsInt(uv[1]);
            if (ru != rv) { p[rv] = ru; costUsed[0] += w; costUsed[1]++; }
        };
        if (force >= 0) add.accept(new int[]{edges[force][0], edges[force][1]}, edges[force][2]);
        for (int[] e : indexed) {
            if (e[3] == block || e[3] == force) continue;
            add.accept(new int[]{e[1], e[2]}, e[0]);
        }
        return costUsed[1] == n - 1 ? costUsed[0] : Integer.MAX_VALUE / 4;
    };
    int base = mst.apply(-1, -1);
    List<Integer> crit = new ArrayList<>(), pseudo = new ArrayList<>();
    for (int i = 0; i < m; i++) {
        if (mst.apply(i, -1) > base) crit.add(i);
        else if (mst.apply(-1, i) == base) pseudo.add(i);
    }
    return List.of(crit, pseudo);
}`,
    `function findCriticalAndPseudoCriticalEdges(n, edges) {
  const m = edges.length;
  const indexed = edges.map(([u, v, w], i) => [w, u, v, i]).sort((a, b) => a[0] - b[0]);
  const mst = (block = -1, force = -1) => {
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
  const base = mst();
  const crit = [], pseudo = [];
  for (let i = 0; i < m; i++) {
    if (mst(i) > base) crit.push(i);
    else if (mst(-1, i) === base) pseudo.push(i);
  }
  return [crit, pseudo];
}`,
  ),
  frames: criticalMSTFrames(),
};

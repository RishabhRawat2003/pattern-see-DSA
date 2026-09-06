import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { CellTone, Frame, TreeNode } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

type Cell = { value: string; tone?: CellTone };

function gridFrame(
  title: string,
  caption: string,
  grid: Cell[][],
  note?: string,
): Frame {
  return {
    kind: "grid",
    title,
    caption,
    grid,
    ...(note ? { note } : {}),
  };
}

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

function findTheCityFrames(): Frame[] {
  return [
    gridFrame(
      "All-pairs dist",
      "n cities, edges with weights. Floyd fills dist[i][j] for every pair.",
      [
        [
          { value: "0", tone: "done" },
          { value: "3", tone: "idle" },
          { value: "∞", tone: "idle" },
        ],
        [
          { value: "3", tone: "idle" },
          { value: "0", tone: "done" },
          { value: "1", tone: "idle" },
        ],
        [
          { value: "∞", tone: "idle" },
          { value: "1", tone: "idle" },
          { value: "0", tone: "done" },
        ],
      ],
      "threshold = 4",
    ),
    gridFrame(
      "k as midpoint",
      "Via city 1: 0→2 becomes 3+1=4. Update matrix.",
      [
        [
          { value: "0", tone: "done" },
          { value: "3", tone: "window" },
          { value: "4", tone: "active" },
        ],
        [
          { value: "3", tone: "window" },
          { value: "0", tone: "done" },
          { value: "1", tone: "window" },
        ],
        [
          { value: "4", tone: "active" },
          { value: "1", tone: "window" },
          { value: "0", tone: "done" },
        ],
      ],
      "k = 1",
    ),
    arrayFrame(
      "Count within threshold",
      "For each city i, count j≠i with dist[i][j] ≤ threshold.",
      [2, 2, 2],
      { 0: "lo", 1: "lo", 2: "lo" },
      { note: "neighbors ≤4" },
    ),
    arrayFrame(
      "Pick smallest count",
      "Tie → largest city index. Here all count 2 → city 2.",
      [2, 2, 2],
      { 2: "match" },
      {
        pointers: [{ name: "ans", index: 2, color: PTR.M }],
        note: "city = 2",
      },
    ),
    {
      kind: "tree",
      title: "City graph view",
      caption: "After Floyd, neighborhood sizes decide the answer city.",
      treeNodes: [
        { id: "0", label: "0", x: 22, y: 40, tone: "idle" },
        { id: "1", label: "1", x: 50, y: 22, tone: "window" },
        { id: "2", label: "2", x: 78, y: 40, tone: "match" },
      ],
      treeEdges: [
        { from: "0", to: "1", tone: "match" },
        { from: "1", to: "2", tone: "match" },
      ],
      note: "ans city 2",
    },
  ];
}

function evaluateDivisionFrames(): Frame[] {
  const nodes: TreeNode[] = [
    { id: "a", label: "a", x: 20, y: 40 },
    { id: "b", label: "b", x: 50, y: 22 },
    { id: "c", label: "c", x: 80, y: 40 },
  ];
  return [
    graph(
      "Equations as edges",
      "a/b=2 ⇒ edge a→b weight 2 and b→a weight 1/2. Variables = nodes.",
      nodes,
      [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
      ],
      {},
      { note: "a/b=2, b/c=3" },
    ),
    gridFrame(
      "Floyd on ratios",
      "dist[i][j] = value of i/j. Via k: dist[i][j] = dist[i][k]*dist[k][j].",
      [
        [
          { value: "1", tone: "done" },
          { value: "2", tone: "idle" },
          { value: "∞", tone: "idle" },
        ],
        [
          { value: "0.5", tone: "idle" },
          { value: "1", tone: "done" },
          { value: "3", tone: "idle" },
        ],
        [
          { value: "∞", tone: "idle" },
          { value: "⅓", tone: "idle" },
          { value: "1", tone: "done" },
        ],
      ],
      "before k=b",
    ),
    gridFrame(
      "Fill a/c",
      "a→b→c: 2×3=6. Symmetric c/a=1/6.",
      [
        [
          { value: "1", tone: "done" },
          { value: "2", tone: "window" },
          { value: "6", tone: "match" },
        ],
        [
          { value: "0.5", tone: "window" },
          { value: "1", tone: "done" },
          { value: "3", tone: "window" },
        ],
        [
          { value: "⅙", tone: "match" },
          { value: "⅓", tone: "window" },
          { value: "1", tone: "done" },
        ],
      ],
      "a/c = 6",
    ),
    graph(
      "Answer queries",
      "Query x/y: if both known and connected, return dist[x][y]; else -1.",
      nodes,
      [
        { from: "a", to: "b", tone: "match" as CellTone },
        { from: "b", to: "c", tone: "match" as CellTone },
      ],
      { a: "lo", c: "hi" },
      { note: "query a/c → 6" },
    ),
    arrayFrame(
      "Unknown variable",
      "If a query mentions a string never seen in equations, answer -1.",
      [6, -1],
      { 0: "match", 1: "skip" },
      { note: "results" },
    ),
  ];
}

const courseNodes: TreeNode[] = [
  { id: "0", label: "0", x: 22, y: 28 },
  { id: "1", label: "1", x: 55, y: 18 },
  { id: "2", label: "2", x: 78, y: 45 },
  { id: "3", label: "3", x: 40, y: 68 },
];

function courseScheduleIVFloydFrames(): Frame[] {
  const edges = [
    { from: "0", to: "1" },
    { from: "1", to: "2" },
    { from: "0", to: "3" },
  ];
  return [
    graph(
      "Reachability matrix",
      "Treat prereq edges as weight 1 (or boolean). Floyd computes transitive closure.",
      courseNodes,
      edges,
      {},
      { note: "reach[i][j]" },
    ),
    gridFrame(
      "Init direct edges",
      "reach[u][v]=true for each prereq; diagonal true optional.",
      [
        [
          { value: "1", tone: "done" },
          { value: "1", tone: "lo" },
          { value: "0", tone: "idle" },
          { value: "1", tone: "lo" },
        ],
        [
          { value: "0", tone: "idle" },
          { value: "1", tone: "done" },
          { value: "1", tone: "lo" },
          { value: "0", tone: "idle" },
        ],
        [
          { value: "0", tone: "idle" },
          { value: "0", tone: "idle" },
          { value: "1", tone: "done" },
          { value: "0", tone: "idle" },
        ],
        [
          { value: "0", tone: "idle" },
          { value: "0", tone: "idle" },
          { value: "0", tone: "idle" },
          { value: "1", tone: "done" },
        ],
      ],
      "n=4",
    ),
    gridFrame(
      "Via midpoints",
      "reach[i][j] |= reach[i][k] && reach[k][j]. 0 reaches 2 via 1.",
      [
        [
          { value: "1", tone: "done" },
          { value: "1", tone: "window" },
          { value: "1", tone: "match" },
          { value: "1", tone: "window" },
        ],
        [
          { value: "0", tone: "idle" },
          { value: "1", tone: "done" },
          { value: "1", tone: "window" },
          { value: "0", tone: "idle" },
        ],
        [
          { value: "0", tone: "idle" },
          { value: "0", tone: "idle" },
          { value: "1", tone: "done" },
          { value: "0", tone: "idle" },
        ],
        [
          { value: "0", tone: "idle" },
          { value: "0", tone: "idle" },
          { value: "0", tone: "idle" },
          { value: "1", tone: "done" },
        ],
      ],
      "0 ⇝ 2",
    ),
    graph(
      "Answer each query",
      "queries[i]=[u,v] → reach[u][v]. O(1) after O(n³) Floyd.",
      courseNodes,
      edges.map((e) => ({ ...e, tone: "match" as CellTone })),
      { "0": "lo", "2": "match" },
      { note: "true / false list" },
    ),
    arrayFrame(
      "Query batch",
      "Example: (0,2)=true, (3,2)=false.",
      [1, 0],
      { 0: "match", 1: "skip" },
      {
        pointers: [{ name: "q", index: 0, color: PTR.L }],
        note: "[true, false]",
      },
    ),
  ];
}

export const findTheCitySolution: ProblemSolution = {
  approach:
    "Floyd-Warshall all-pairs shortest paths. For each city count others within distanceThreshold; pick the city with the smallest count (largest index on ties). O(n³).",
  templates: langs(
    `def findTheCity(n, edges, distanceThreshold):
    INF = 10**18
    dist = [[INF] * n for _ in range(n)]
    for i in range(n): dist[i][i] = 0
    for u, v, w in edges:
        dist[u][v] = dist[v][u] = w
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    best, ans = n, 0
    for i in range(n):
        cnt = sum(dist[i][j] <= distanceThreshold for j in range(n) if i != j)
        if cnt <= best:
            best, ans = cnt, i
    return ans`,
    `int findTheCity(int n, vector<vector<int>>& edges, int distanceThreshold) {
    const long INF = 1e18;
    vector<vector<long>> dist(n, vector<long>(n, INF));
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (auto& e : edges) dist[e[0]][e[1]] = dist[e[1]][e[0]] = e[2];
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
    int best = n, ans = 0;
    for (int i = 0; i < n; i++) {
        int cnt = 0;
        for (int j = 0; j < n; j++)
            if (i != j && dist[i][j] <= distanceThreshold) cnt++;
        if (cnt <= best) { best = cnt; ans = i; }
    }
    return ans;
}`,
    `int findTheCity(int n, int[][] edges, int distanceThreshold) {
    long INF = (long)1e18;
    long[][] dist = new long[n][n];
    for (int i = 0; i < n; i++) {
        Arrays.fill(dist[i], INF);
        dist[i][i] = 0;
    }
    for (int[] e : edges) dist[e[0]][e[1]] = dist[e[1]][e[0]] = e[2];
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
    int best = n, ans = 0;
    for (int i = 0; i < n; i++) {
        int cnt = 0;
        for (int j = 0; j < n; j++)
            if (i != j && dist[i][j] <= distanceThreshold) cnt++;
        if (cnt <= best) { best = cnt; ans = i; }
    }
    return ans;
}`,
    `function findTheCity(n, edges, distanceThreshold) {
  const INF = 1e18;
  const dist = Array.from({ length: n }, () => Array(n).fill(INF));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const [u, v, w] of edges) dist[u][v] = dist[v][u] = w;
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
  let best = n, ans = 0;
  for (let i = 0; i < n; i++) {
    let cnt = 0;
    for (let j = 0; j < n; j++)
      if (i !== j && dist[i][j] <= distanceThreshold) cnt++;
    if (cnt <= best) { best = cnt; ans = i; }
  }
  return ans;
}`,
  ),
  frames: findTheCityFrames(),
};

export const evaluateDivisionSolution: ProblemSolution = {
  approach:
    "Map each variable to an index. Put equation ratios as directed edge weights both ways. Floyd multiplies along paths: dist[i][j] *= via k. Answer queries from the matrix or -1 if disconnected. O(v³ + q).",
  templates: langs(
    `def calcEquation(equations, values, queries):
    idx = {}
    for a, b in equations:
        if a not in idx: idx[a] = len(idx)
        if b not in idx: idx[b] = len(idx)
    n = len(idx)
    INF = 10**18
    dist = [[INF] * n for _ in range(n)]
    for i in range(n): dist[i][i] = 1.0
    for (a, b), val in zip(equations, values):
        i, j = idx[a], idx[b]
        dist[i][j], dist[j][i] = val, 1.0 / val
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] < INF and dist[k][j] < INF:
                    dist[i][j] = min(dist[i][j], dist[i][k] * dist[k][j])
    ans = []
    for a, b in queries:
        if a not in idx or b not in idx: ans.append(-1.0)
        else:
            i, j = idx[a], idx[b]
            ans.append(-1.0 if dist[i][j] >= INF else dist[i][j])
    return ans`,
    `vector<double> calcEquation(vector<vector<string>>& equations, vector<double>& values, vector<vector<string>>& queries) {
    unordered_map<string,int> idx;
    for (auto& e : equations) {
        if (!idx.count(e[0])) idx[e[0]] = idx.size();
        if (!idx.count(e[1])) idx[e[1]] = idx.size();
    }
    int n = idx.size();
    const double INF = 1e18;
    vector<vector<double>> dist(n, vector<double>(n, INF));
    for (int i = 0; i < n; i++) dist[i][i] = 1;
    for (int t = 0; t < (int)equations.size(); t++) {
        int i = idx[equations[t][0]], j = idx[equations[t][1]];
        dist[i][j] = values[t]; dist[j][i] = 1.0 / values[t];
    }
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] < INF && dist[k][j] < INF)
                    dist[i][j] = min(dist[i][j], dist[i][k] * dist[k][j]);
    vector<double> ans;
    for (auto& q : queries) {
        if (!idx.count(q[0]) || !idx.count(q[1])) ans.push_back(-1);
        else {
            double d = dist[idx[q[0]]][idx[q[1]]];
            ans.push_back(d >= INF ? -1 : d);
        }
    }
    return ans;
}`,
    `List<Double> calcEquation(List<List<String>> equations, double[] values, List<List<String>> queries) {
    Map<String, Integer> idx = new HashMap<>();
    for (List<String> e : equations) {
        idx.putIfAbsent(e.get(0), idx.size());
        idx.putIfAbsent(e.get(1), idx.size());
    }
    int n = idx.size();
    double INF = 1e18;
    double[][] dist = new double[n][n];
    for (int i = 0; i < n; i++) {
        Arrays.fill(dist[i], INF);
        dist[i][i] = 1;
    }
    for (int t = 0; t < equations.size(); t++) {
        int i = idx.get(equations.get(t).get(0)), j = idx.get(equations.get(t).get(1));
        dist[i][j] = values[t]; dist[j][i] = 1.0 / values[t];
    }
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] < INF && dist[k][j] < INF)
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] * dist[k][j]);
    List<Double> ans = new ArrayList<>();
    for (List<String> q : queries) {
        if (!idx.containsKey(q.get(0)) || !idx.containsKey(q.get(1))) ans.add(-1.0);
        else {
            double d = dist[idx.get(q.get(0))][idx.get(q.get(1))];
            ans.add(d >= INF ? -1.0 : d);
        }
    }
    return ans;
}`,
    `function calcEquation(equations, values, queries) {
  const idx = new Map();
  for (const [a, b] of equations) {
    if (!idx.has(a)) idx.set(a, idx.size);
    if (!idx.has(b)) idx.set(b, idx.size);
  }
  const n = idx.size, INF = 1e18;
  const dist = Array.from({ length: n }, () => Array(n).fill(INF));
  for (let i = 0; i < n; i++) dist[i][i] = 1;
  equations.forEach(([a, b], t) => {
    const i = idx.get(a), j = idx.get(b);
    dist[i][j] = values[t]; dist[j][i] = 1 / values[t];
  });
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i][k] < INF && dist[k][j] < INF)
          dist[i][j] = Math.min(dist[i][j], dist[i][k] * dist[k][j]);
  return queries.map(([a, b]) => {
    if (!idx.has(a) || !idx.has(b)) return -1;
    const d = dist[idx.get(a)][idx.get(b)];
    return d >= INF ? -1 : d;
  });
}`,
  ),
  frames: evaluateDivisionFrames(),
};

export const courseScheduleIVFloydSolution: ProblemSolution = {
  approach:
    "Build a boolean reachability matrix from prerequisite edges, then Floyd transitive closure: reach[i][j] |= reach[i][k] && reach[k][j]. Answer each query in O(1). O(n³).",
  templates: langs(
    `def checkIfPrerequisite(n, prerequisites, queries):
    reach = [[False] * n for _ in range(n)]
    for a, b in prerequisites:
        reach[a][b] = True
    for k in range(n):
        for i in range(n):
            for j in range(n):
                reach[i][j] = reach[i][j] or (reach[i][k] and reach[k][j])
    return [reach[u][v] for u, v in queries]`,
    `vector<bool> checkIfPrerequisite(int n, vector<vector<int>>& prerequisites, vector<vector<int>>& queries) {
    vector<vector<char>> reach(n, vector<char>(n, 0));
    for (auto& e : prerequisites) reach[e[0]][e[1]] = 1;
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j]);
    vector<bool> ans;
    for (auto& q : queries) ans.push_back(reach[q[0]][q[1]]);
    return ans;
}`,
    `List<Boolean> checkIfPrerequisite(int n, int[][] prerequisites, int[][] queries) {
    boolean[][] reach = new boolean[n][n];
    for (int[] e : prerequisites) reach[e[0]][e[1]] = true;
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                reach[i][j] |= reach[i][k] && reach[k][j];
    List<Boolean> ans = new ArrayList<>();
    for (int[] q : queries) ans.add(reach[q[0]][q[1]]);
    return ans;
}`,
    `function checkIfPrerequisite(n, prerequisites, queries) {
  const reach = Array.from({ length: n }, () => Array(n).fill(false));
  for (const [a, b] of prerequisites) reach[a][b] = true;
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j]);
  return queries.map(([u, v]) => reach[u][v]);
}`,
  ),
  frames: courseScheduleIVFloydFrames(),
};

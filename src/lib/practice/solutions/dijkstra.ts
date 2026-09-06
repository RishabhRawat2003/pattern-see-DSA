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

const delayNodes = (labels: string[]): TreeNode[] => [
  { id: "1", label: `1:${labels[0]}`, x: 18, y: 48 },
  { id: "2", label: `2:${labels[1]}`, x: 50, y: 22 },
  { id: "3", label: `3:${labels[2]}`, x: 50, y: 78 },
  { id: "4", label: `4:${labels[3]}`, x: 82, y: 48 },
];
const delayEdges = [
  { from: "1", to: "2" },
  { from: "1", to: "3" },
  { from: "2", to: "4" },
  { from: "3", to: "4" },
];

function networkDelayFrames(): Frame[] {
  return [
    graph(
      "Source k=1",
      "Times as directed weighted edges. Dijkstra from k; answer = max dist (or -1).",
      delayNodes(["0", "∞", "∞", "∞"]),
      delayEdges,
      { "1": "active" },
      { note: "weights 1-2:1, 1-3:4, 2-4:3, 3-4:1" },
    ),
    graph(
      "Relax from 1",
      "Pop 1. Set dist[2]=1, dist[3]=4. Heap prefers 2.",
      delayNodes(["0", "1", "4", "∞"]),
      delayEdges,
      { "1": "done", "2": "active", "3": "window" },
      { note: "pq: (1,2),(4,3)" },
    ),
    graph(
      "Via node 2",
      "dist[4] = 1+3 = 4. Still have 3 at 4 in the heap.",
      delayNodes(["0", "1", "4", "4"]),
      delayEdges,
      { "1": "done", "2": "done", "3": "active", "4": "window" },
      { note: "dist 4 = 4" },
    ),
    graph(
      "Via node 3",
      "4 via 3: 4+1=5 > 4 — no improve. All settled.",
      delayNodes(["0", "1", "4", "4"]),
      delayEdges,
      { "1": "done", "2": "done", "3": "done", "4": "match" },
      {
        treeEdges: delayEdges.map((e) => ({ ...e, tone: "match" as CellTone })),
        note: "max = 4",
      },
    ),
    arrayFrame(
      "Answer is max dist",
      "If any node still ∞, return -1. Else return the largest finite distance.",
      [0, 1, 4, 4],
      { 3: "match" },
      {
        pointers: [{ name: "max", index: 3, color: PTR.M }],
        note: "networkDelayTime = 4",
      },
    ),
  ];
}

type Cell = { value: string; tone?: CellTone };

function effortGrid(tones: Record<string, CellTone> = {}): Cell[][] {
  const raw = [
    ["1", "2", "2"],
    ["3", "8", "2"],
    ["5", "3", "5"],
  ];
  return raw.map((row, r) =>
    row.map((value, c) => ({
      value,
      tone: tones[`${r},${c}`] ?? "idle",
    })),
  );
}

function pathEffortFrames(): Frame[] {
  return [
    {
      kind: "grid",
      title: "Heights grid",
      caption: "Effort of a path = max |Δheight| on consecutive cells. Minimize that effort.",
      grid: effortGrid(),
      note: "start (0,0) → (2,2)",
    },
    {
      kind: "grid",
      title: "Dijkstra on effort",
      caption: "State = cell. Priority = effort so far. Edge cost = max(curEffort, |h[u]-h[v]|).",
      grid: effortGrid({ "0,0": "active" }),
      note: "dist[0][0]=0",
    },
    {
      kind: "grid",
      title: "Expand right/down",
      caption: "To (0,1): effort max(0,|1-2|)=1. To (1,0): max(0,|1-3|)=2.",
      grid: effortGrid({ "0,0": "done", "0,1": "lo", "1,0": "window" }),
      note: "pq by effort",
    },
    {
      kind: "grid",
      title: "Best path effort 2",
      caption: "Path 1→2→2→2→5 keeps abs diffs ≤2. Dijkstra settles (2,2) at 2.",
      grid: effortGrid({
        "0,0": "match",
        "0,1": "match",
        "0,2": "match",
        "1,2": "match",
        "2,2": "match",
      }),
      note: "min effort = 2",
    },
    arrayFrame(
      "Binary search alt",
      "Guess effort mid; BFS if a path exists with all |Δ|≤mid. Same answer.",
      [0, 1, 2, 3, 4],
      { 2: "match" },
      {
        pointers: [
          { name: "lo", index: 0, color: PTR.L },
          { name: "hi", index: 4, color: PTR.R },
        ],
        note: "mid = 2 works",
      },
    ),
  ];
}

const flightNodes = (labels: string[]): TreeNode[] => [
  { id: "0", label: `0:${labels[0]}`, x: 18, y: 48 },
  { id: "1", label: `1:${labels[1]}`, x: 50, y: 22 },
  { id: "2", label: `2:${labels[2]}`, x: 50, y: 78 },
  { id: "3", label: `3:${labels[3]}`, x: 82, y: 48 },
];
const flightEdges = [
  { from: "0", to: "1" },
  { from: "0", to: "2" },
  { from: "1", to: "3" },
  { from: "2", to: "3" },
];

function cheapestFlightsDijkstraFrames(): Frame[] {
  return [
    graph(
      "src→dst · ≤k stops",
      "Dijkstra on state (city, stopsUsed). Cost is price; prune if stops > k.",
      flightNodes(["0", "∞", "∞", "∞"]),
      flightEdges,
      { "0": "active" },
      { note: "k=1 · prices 0-1:100, 0-2:500, 1-3:100, 2-3:100" },
    ),
    graph(
      "One hop from src",
      "Reach 1 cost 100 (0 stops left for next), 2 cost 500.",
      flightNodes(["0", "100", "500", "∞"]),
      flightEdges,
      { "0": "done", "1": "active", "2": "window" },
      { note: "stops used = 0" },
    ),
    graph(
      "Second hop to dst",
      "0→1→3 costs 200 with 1 stop. Within k=1.",
      flightNodes(["0", "100", "500", "200"]),
      flightEdges,
      { "0": "done", "1": "done", "3": "match" },
      {
        treeEdges: [
          { from: "0", to: "1", tone: "match" as CellTone },
          { from: "0", to: "2" },
          { from: "1", to: "3", tone: "match" as CellTone },
          { from: "2", to: "3" },
        ],
        note: "cheapest = 200",
      },
    ),
    graph(
      "k=0 blocks dst",
      "With k=0 only direct flights. No 0→3 edge → would return -1.",
      flightNodes(["0", "100", "500", "∞"]),
      flightEdges,
      { "0": "done", "3": "skip" },
      { note: "k=0 → -1" },
    ),
    arrayFrame(
      "State key (u,stops)",
      "Track best cost per (city, stops). Skip worse revisits with ≥ stops used.",
      [0, 100, 500, 200],
      { 3: "match" },
      { note: "dist to dst" },
    ),
  ];
}

export const networkDelayTimeSolution: ProblemSolution = {
  approach:
    "Model times as a directed weighted graph. Dijkstra from k; answer is the maximum finite distance among all nodes, or -1 if any node is unreachable. O((n+e) log n).",
  templates: langs(
    `import heapq
from collections import defaultdict

def networkDelayTime(times, n, k):
    g = defaultdict(list)
    for u, v, w in times: g[u].append((v, w))
    dist = {k: 0}
    h = [(0, k)]
    while h:
        d, u = heapq.heappop(h)
        if d > dist.get(u, 10**18): continue
        for v, w in g[u]:
            nd = d + w
            if nd < dist.get(v, 10**18):
                dist[v] = nd
                heapq.heappush(h, (nd, v))
    return max(dist.values()) if len(dist) == n else -1`,
    `int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int,int>>> g(n + 1);
    for (auto& t : times) g[t[0]].push_back({t[1], t[2]});
    const int INF = 1e9;
    vector<int> dist(n + 1, INF);
    dist[k] = 0;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    pq.push({0, k});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d != dist[u]) continue;
        for (auto [v, w] : g[u])
            if (d + w < dist[v]) { dist[v] = d + w; pq.push({dist[v], v}); }
    }
    int ans = *max_element(dist.begin() + 1, dist.end());
    return ans == INF ? -1 : ans;
}`,
    `int networkDelayTime(int[][] times, int n, int k) {
    List<int[]>[] g = new List[n + 1];
    for (int i = 1; i <= n; i++) g[i] = new ArrayList<>();
    for (int[] t : times) g[t[0]].add(new int[]{t[1], t[2]});
    int INF = (int)1e9;
    int[] dist = new int[n + 1];
    Arrays.fill(dist, INF);
    dist[k] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    pq.add(new int[]{0, k});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int d = cur[0], u = cur[1];
        if (d != dist[u]) continue;
        for (int[] e : g[u]) {
            int v = e[0], w = e[1];
            if (d + w < dist[v]) { dist[v] = d + w; pq.add(new int[]{dist[v], v}); }
        }
    }
    int ans = 0;
    for (int i = 1; i <= n; i++) {
        if (dist[i] == INF) return -1;
        ans = Math.max(ans, dist[i]);
    }
    return ans;
}`,
    `function networkDelayTime(times, n, k) {
  const g = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) g[u].push([v, w]);
  const INF = 1e18;
  const dist = Array(n + 1).fill(INF);
  dist[k] = 0;
  const h = [[0, k]];
  const pop = () => { h.sort((a, b) => a[0] - b[0]); return h.shift(); };
  while (h.length) {
    const [d, u] = pop();
    if (d !== dist[u]) continue;
    for (const [v, w] of g[u])
      if (d + w < dist[v]) { dist[v] = d + w; h.push([dist[v], v]); }
  }
  let ans = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === INF) return -1;
    ans = Math.max(ans, dist[i]);
  }
  return ans;
}`,
  ),
  frames: networkDelayFrames(),
};

export const pathWithMinimumEffortSolution: ProblemSolution = {
  approach:
    "Treat each cell as a node. Dijkstra where the cost of moving u→v is max(effortSoFar, |height[u]-height[v]|). The effort at the bottom-right is the answer. O(mn log(mn)).",
  templates: langs(
    `import heapq

def minimumEffortPath(heights):
    m, n = len(heights), len(heights[0])
    dist = [[10**18] * n for _ in range(m)]
    dist[0][0] = 0
    h = [(0, 0, 0)]
    while h:
        e, r, c = heapq.heappop(h)
        if (r, c) == (m - 1, n - 1): return e
        if e > dist[r][c]: continue
        for dr, dc in ((0,1),(1,0),(0,-1),(-1,0)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n:
                ne = max(e, abs(heights[r][c] - heights[nr][nc]))
                if ne < dist[nr][nc]:
                    dist[nr][nc] = ne
                    heapq.heappush(h, (ne, nr, nc))
    return 0`,
    `int minimumEffortPath(vector<vector<int>>& heights) {
    int m = heights.size(), n = heights[0].size();
    vector<vector<int>> dist(m, vector<int>(n, 1e9));
    dist[0][0] = 0;
    priority_queue<array<int,3>, vector<array<int,3>>, greater<>> pq;
    pq.push({0, 0, 0});
    int dirs[4][2] = {{0,1},{1,0},{0,-1},{-1,0}};
    while (!pq.empty()) {
        auto [e, r, c] = pq.top(); pq.pop();
        if (r == m - 1 && c == n - 1) return e;
        if (e != dist[r][c]) continue;
        for (auto& d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
            int ne = max(e, abs(heights[r][c] - heights[nr][nc]));
            if (ne < dist[nr][nc]) { dist[nr][nc] = ne; pq.push({ne, nr, nc}); }
        }
    }
    return 0;
}`,
    `int minimumEffortPath(int[][] heights) {
    int m = heights.length, n = heights[0].length;
    int[][] dist = new int[m][n];
    for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
    dist[0][0] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    pq.add(new int[]{0, 0, 0});
    int[][] dirs = {{0,1},{1,0},{0,-1},{-1,0}};
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int e = cur[0], r = cur[1], c = cur[2];
        if (r == m - 1 && c == n - 1) return e;
        if (e != dist[r][c]) continue;
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
            int ne = Math.max(e, Math.abs(heights[r][c] - heights[nr][nc]));
            if (ne < dist[nr][nc]) { dist[nr][nc] = ne; pq.add(new int[]{ne, nr, nc}); }
        }
    }
    return 0;
}`,
    `function minimumEffortPath(heights) {
  const m = heights.length, n = heights[0].length;
  const dist = Array.from({ length: m }, () => Array(n).fill(1e18));
  dist[0][0] = 0;
  const h = [[0, 0, 0]];
  const pop = () => { h.sort((a, b) => a[0] - b[0]); return h.shift(); };
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
  while (h.length) {
    const [e, r, c] = pop();
    if (r === m - 1 && c === n - 1) return e;
    if (e !== dist[r][c]) continue;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
      const ne = Math.max(e, Math.abs(heights[r][c] - heights[nr][nc]));
      if (ne < dist[nr][nc]) { dist[nr][nc] = ne; h.push([ne, nr, nc]); }
    }
  }
  return 0;
}`,
  ),
  frames: pathEffortFrames(),
};

export const cheapestFlightsKStopsDijkstraSolution: ProblemSolution = {
  approach:
    "Dijkstra on states (city, stopsUsed) with edge prices. Push neighbors only when stopsUsed ≤ k. First time dst is popped (or best recorded) is cheapest within k stops; else -1. O(e·k log(e·k)).",
  templates: langs(
    `import heapq
from collections import defaultdict

def findCheapestPrice(n, flights, src, dst, k):
    g = defaultdict(list)
    for u, v, w in flights: g[u].append((v, w))
    # cost, city, stops_used
    h = [(0, src, 0)]
    best = {}
    while h:
        cost, u, stops = heapq.heappop(h)
        if u == dst: return cost
        if stops > k: continue
        if best.get((u, stops), 10**18) < cost: continue
        for v, w in g[u]:
            nd, ns = cost + w, stops + 1
            if nd < best.get((v, ns), 10**18):
                best[(v, ns)] = nd
                heapq.heappush(h, (nd, v, ns))
    return -1`,
    `int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<vector<pair<int,int>>> g(n);
    for (auto& f : flights) g[f[0]].push_back({f[1], f[2]});
    priority_queue<array<int,3>, vector<array<int,3>>, greater<>> pq;
    pq.push({0, src, 0});
    vector<vector<int>> best(n, vector<int>(k + 2, 1e9));
    best[src][0] = 0;
    while (!pq.empty()) {
        auto [cost, u, stops] = pq.top(); pq.pop();
        if (u == dst) return cost;
        if (stops > k) continue;
        for (auto [v, w] : g[u]) {
            int nd = cost + w, ns = stops + 1;
            if (nd < best[v][ns]) { best[v][ns] = nd; pq.push({nd, v, ns}); }
        }
    }
    return -1;
}`,
    `int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    List<int[]>[] g = new List[n];
    for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
    for (int[] f : flights) g[f[0]].add(new int[]{f[1], f[2]});
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    pq.add(new int[]{0, src, 0});
    int[][] best = new int[n][k + 2];
    for (int[] row : best) Arrays.fill(row, Integer.MAX_VALUE);
    best[src][0] = 0;
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int cost = cur[0], u = cur[1], stops = cur[2];
        if (u == dst) return cost;
        if (stops > k) continue;
        for (int[] e : g[u]) {
            int v = e[0], w = e[1], nd = cost + w, ns = stops + 1;
            if (ns <= k + 1 && nd < best[v][ns]) {
                best[v][ns] = nd; pq.add(new int[]{nd, v, ns});
            }
        }
    }
    return -1;
}`,
    `function findCheapestPrice(n, flights, src, dst, k) {
  const g = Array.from({ length: n }, () => []);
  for (const [u, v, w] of flights) g[u].push([v, w]);
  const h = [[0, src, 0]];
  const best = Array.from({ length: n }, () => Array(k + 2).fill(1e18));
  best[src][0] = 0;
  const pop = () => { h.sort((a, b) => a[0] - b[0]); return h.shift(); };
  while (h.length) {
    const [cost, u, stops] = pop();
    if (u === dst) return cost;
    if (stops > k) continue;
    for (const [v, w] of g[u]) {
      const nd = cost + w, ns = stops + 1;
      if (ns <= k + 1 && nd < best[v][ns]) {
        best[v][ns] = nd; h.push([nd, v, ns]);
      }
    }
  }
  return -1;
}`,
  ),
  frames: cheapestFlightsDijkstraFrames(),
};

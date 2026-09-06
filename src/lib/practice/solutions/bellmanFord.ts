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

function cheapestFlightsBellmanFrames(): Frame[] {
  return [
    graph(
      "Bellman · ≤k stops",
      "At most k stops ⇒ at most k+1 edges. Relax all flights k+1 rounds.",
      flightNodes(["0", "∞", "∞", "∞"]),
      flightEdges,
      { "0": "active" },
      { note: "src=0 dst=3 k=1" },
    ),
    graph(
      "Round 1 (0 stops)",
      "First pass: only edges from src improve. 1=100, 2=500.",
      flightNodes(["0", "100", "500", "∞"]),
      flightEdges,
      { "0": "done", "1": "lo", "2": "window" },
      { note: "1 edge used" },
    ),
    graph(
      "Round 2 (1 stop)",
      "Second pass reaches dst via 1→3: 200. Via 2→3: 600.",
      flightNodes(["0", "100", "500", "200"]),
      flightEdges,
      { "1": "done", "3": "match" },
      {
        treeEdges: [
          { from: "0", to: "1", tone: "match" as CellTone },
          { from: "0", to: "2" },
          { from: "1", to: "3", tone: "match" as CellTone },
          { from: "2", to: "3" },
        ],
        note: "ans = 200",
      },
    ),
    arrayFrame(
      "Copy dist each round",
      "Use a snapshot so each round counts exactly one more edge (avoids using >k+1 edges).",
      [0, 100, 500, 200],
      { 3: "match" },
      {
        pointers: [{ name: "r", index: 1, color: PTR.M }],
        note: "after 2 rounds",
      },
    ),
    graph(
      "Unreachable",
      "If dist[dst] still ∞ after k+1 rounds, return -1.",
      flightNodes(["0", "100", "500", "∞"]),
      flightEdges,
      { "3": "skip" },
      { note: "k=0 case" },
    ),
  ];
}

const netNodes = (labels: string[]): TreeNode[] => [
  { id: "1", label: `1:${labels[0]}`, x: 18, y: 48 },
  { id: "2", label: `2:${labels[1]}`, x: 50, y: 22 },
  { id: "3", label: `3:${labels[2]}`, x: 50, y: 78 },
  { id: "4", label: `4:${labels[3]}`, x: 82, y: 48 },
];
const netEdges = [
  { from: "1", to: "2" },
  { from: "1", to: "3" },
  { from: "2", to: "4" },
  { from: "3", to: "4" },
];

function networkDelayBellmanFrames(): Frame[] {
  return [
    graph(
      "BF from k",
      "Relax every edge n−1 times from source k. Works even with negatives (none here).",
      netNodes(["0", "∞", "∞", "∞"]),
      netEdges,
      { "1": "active" },
      { note: "k=1 · n=4" },
    ),
    graph(
      "Pass 1",
      "1→2 and 1→3 set. Then maybe 2→4 / 3→4 in same or later pass.",
      netNodes(["0", "1", "4", "∞"]),
      netEdges,
      { "1": "done", "2": "lo", "3": "window" },
      { note: "partial" },
    ),
    graph(
      "Pass 2",
      "4 settled to min(1+3, 4+1)=4. Further passes stable.",
      netNodes(["0", "1", "4", "4"]),
      netEdges,
      { "4": "match" },
      { note: "dist[4]=4" },
    ),
    graph(
      "Max over nodes",
      "Answer = max dist[i]. Any ∞ ⇒ -1 (node never reached).",
      netNodes(["0", "1", "4", "4"]),
      netEdges.map((e) => ({ ...e, tone: "match" as CellTone })),
      { "1": "done", "2": "done", "3": "done", "4": "match" },
      { note: "max = 4" },
    ),
    arrayFrame(
      "n−1 passes enough",
      "Shortest path has ≤ n−1 edges. Extra improving pass would mean a negative cycle.",
      [0, 1, 4, 4],
      { 0: "done", 3: "match" },
      { note: "stable" },
    ),
  ];
}

function bellmanFordGfgFrames(): Frame[] {
  const nodes = (vals: string[]): TreeNode[] => [
    { id: "0", label: `0:${vals[0]}`, x: 18, y: 48 },
    { id: "1", label: `1:${vals[1]}`, x: 50, y: 22 },
    { id: "2", label: `2:${vals[2]}`, x: 50, y: 78 },
    { id: "3", label: `3:${vals[3]}`, x: 82, y: 48 },
  ];
  const edges = [
    { from: "0", to: "1" },
    { from: "0", to: "2" },
    { from: "1", to: "3" },
    { from: "2", to: "3" },
  ];
  return [
    graph(
      "GFG Bellman-Ford",
      "Given edges (u,v,w) possibly negative. dist[src]=0; relax |V|−1 times.",
      nodes(["0", "∞", "∞", "∞"]),
      edges,
      { "0": "active" },
      { note: "A-C weight −1 allowed" },
    ),
    graph(
      "Relax pass 1",
      "Update along every edge once: 1=4, 2=-1, then 3 via 2 = 4.",
      nodes(["0", "4", "-1", "4"]),
      edges,
      { "2": "lo", "3": "window" },
      { note: "pass 1" },
    ),
    graph(
      "Passes until stable",
      "No further improvement after V−1. Return dist array.",
      nodes(["0", "4", "-1", "4"]),
      edges,
      { "0": "done", "1": "done", "2": "done", "3": "match" },
      { note: "done" },
    ),
    graph(
      "Nth pass check",
      "If any edge still relaxes, report negative cycle (GFG often returns −1 / empty).",
      nodes(["0", "4", "-1", "4"]),
      [...edges, { from: "3", to: "0", tone: "skip" as CellTone, dashed: true }],
      { "0": "skip", "3": "skip" },
      { note: "neg cycle?" },
    ),
    arrayFrame(
      "Output distances",
      "Print dist[0..n-1]; unreachable stay a large INF sentinel.",
      [0, 4, -1, 4],
      { 2: "lo", 3: "match" },
      {
        pointers: [{ name: "i", index: 0, color: PTR.L }],
        note: "src = 0",
      },
    ),
  ];
}

export const cheapestFlightsBellmanSolution: ProblemSolution = {
  approach:
    "Bellman-Ford limited to k+1 rounds: each round allows one more flight. Copy distances each round so paths use at most k+1 edges. Answer dist[dst] or -1. O(k·e).",
  templates: langs(
    `def findCheapestPrice(n, flights, src, dst, k):
    dist = [10**18] * n
    dist[src] = 0
    for _ in range(k + 1):
        nxt = dist[:]
        for u, v, w in flights:
            if dist[u] + w < nxt[v]:
                nxt[v] = dist[u] + w
        dist = nxt
    return -1 if dist[dst] >= 10**18 else dist[dst]`,
    `int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    const int INF = 1e9;
    vector<int> dist(n, INF);
    dist[src] = 0;
    for (int i = 0; i <= k; i++) {
        vector<int> nxt = dist;
        for (auto& f : flights)
            if (dist[f[0]] < INF && dist[f[0]] + f[2] < nxt[f[1]])
                nxt[f[1]] = dist[f[0]] + f[2];
        dist.swap(nxt);
    }
    return dist[dst] == INF ? -1 : dist[dst];
}`,
    `int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    int INF = (int)1e9;
    int[] dist = new int[n];
    Arrays.fill(dist, INF);
    dist[src] = 0;
    for (int i = 0; i <= k; i++) {
        int[] nxt = dist.clone();
        for (int[] f : flights)
            if (dist[f[0]] < INF && dist[f[0]] + f[2] < nxt[f[1]])
                nxt[f[1]] = dist[f[0]] + f[2];
        dist = nxt;
    }
    return dist[dst] == INF ? -1 : dist[dst];
}`,
    `function findCheapestPrice(n, flights, src, dst, k) {
  let dist = Array(n).fill(1e18);
  dist[src] = 0;
  for (let i = 0; i <= k; i++) {
    const nxt = dist.slice();
    for (const [u, v, w] of flights)
      if (dist[u] + w < nxt[v]) nxt[v] = dist[u] + w;
    dist = nxt;
  }
  return dist[dst] >= 1e18 ? -1 : dist[dst];
}`,
  ),
  frames: cheapestFlightsBellmanFrames(),
};

export const networkDelayBellmanSolution: ProblemSolution = {
  approach:
    "Run Bellman-Ford from k for n−1 rounds on the times edges. Return the max distance among nodes 1..n, or -1 if any remains INF. O(n·e).",
  templates: langs(
    `def networkDelayTime(times, n, k):
    INF = 10**18
    dist = [INF] * (n + 1)
    dist[k] = 0
    for _ in range(n - 1):
        for u, v, w in times:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    ans = max(dist[1:])
    return -1 if ans >= INF else ans`,
    `int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    const int INF = 1e9;
    vector<int> dist(n + 1, INF);
    dist[k] = 0;
    for (int i = 0; i < n - 1; i++)
        for (auto& t : times)
            if (dist[t[0]] < INF && dist[t[0]] + t[2] < dist[t[1]])
                dist[t[1]] = dist[t[0]] + t[2];
    int ans = *max_element(dist.begin() + 1, dist.end());
    return ans == INF ? -1 : ans;
}`,
    `int networkDelayTime(int[][] times, int n, int k) {
    int INF = (int)1e9;
    int[] dist = new int[n + 1];
    Arrays.fill(dist, INF);
    dist[k] = 0;
    for (int i = 0; i < n - 1; i++)
        for (int[] t : times)
            if (dist[t[0]] < INF && dist[t[0]] + t[2] < dist[t[1]])
                dist[t[1]] = dist[t[0]] + t[2];
    int ans = 0;
    for (int i = 1; i <= n; i++) {
        if (dist[i] == INF) return -1;
        ans = Math.max(ans, dist[i]);
    }
    return ans;
}`,
    `function networkDelayTime(times, n, k) {
  const INF = 1e18;
  const dist = Array(n + 1).fill(INF);
  dist[k] = 0;
  for (let i = 0; i < n - 1; i++)
    for (const [u, v, w] of times)
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  let ans = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === INF) return -1;
    ans = Math.max(ans, dist[i]);
  }
  return ans;
}`,
  ),
  frames: networkDelayBellmanFrames(),
};

export const bellmanFordGfgSolution: ProblemSolution = {
  approach:
    "Classic Bellman-Ford: dist[src]=0, relax all edges |V|−1 times. Optional V-th pass detects a negative cycle. Return distance array (or failure marker per problem statement). O(V·E).",
  templates: langs(
    `def bellmanFord(V, edges, src):
    INF = 10**18
    dist = [INF] * V
    dist[src] = 0
    for _ in range(V - 1):
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    for u, v, w in edges:
        if dist[u] != INF and dist[u] + w < dist[v]:
            return [-1]  # negative cycle
    return [(-1 if d >= INF else d) for d in dist]`,
    `vector<int> bellmanFord(int V, vector<vector<int>>& edges, int src) {
    const int INF = 1e8;
    vector<int> dist(V, INF);
    dist[src] = 0;
    for (int i = 0; i < V - 1; i++)
        for (auto& e : edges)
            if (dist[e[0]] != INF && dist[e[0]] + e[2] < dist[e[1]])
                dist[e[1]] = dist[e[0]] + e[2];
    for (auto& e : edges)
        if (dist[e[0]] != INF && dist[e[0]] + e[2] < dist[e[1]])
            return {-1};
    for (int& d : dist) if (d == INF) d = 1e8;
    return dist;
}`,
    `int[] bellmanFord(int V, int[][] edges, int src) {
    int INF = (int)1e8;
    int[] dist = new int[V];
    Arrays.fill(dist, INF);
    dist[src] = 0;
    for (int i = 0; i < V - 1; i++)
        for (int[] e : edges)
            if (dist[e[0]] != INF && dist[e[0]] + e[2] < dist[e[1]])
                dist[e[1]] = dist[e[0]] + e[2];
    for (int[] e : edges)
        if (dist[e[0]] != INF && dist[e[0]] + e[2] < dist[e[1]])
            return new int[]{-1};
    return dist;
}`,
    `function bellmanFord(V, edges, src) {
  const INF = 1e8;
  const dist = Array(V).fill(INF);
  dist[src] = 0;
  for (let i = 0; i < V - 1; i++)
    for (const [u, v, w] of edges)
      if (dist[u] !== INF && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  for (const [u, v, w] of edges)
    if (dist[u] !== INF && dist[u] + w < dist[v]) return [-1];
  return dist;
}`,
  ),
  frames: bellmanFordGfgFrames(),
};

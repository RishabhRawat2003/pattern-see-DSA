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

const biNodes: TreeNode[] = [
  { id: "0", label: "0", x: 22, y: 28 },
  { id: "1", label: "1", x: 55, y: 18 },
  { id: "2", label: "2", x: 78, y: 40 },
  { id: "3", label: "3", x: 40, y: 68 },
];
const biEdges = [
  { from: "0", to: "1" },
  { from: "0", to: "3" },
  { from: "1", to: "2" },
  { from: "3", to: "2" },
];

function isGraphBipartiteFrames(): Frame[] {
  return [
    graph(
      "2-color the graph",
      "Assign each node color 0 or 1. Every edge must connect different colors.",
      biNodes,
      biEdges,
      {},
      { note: "BFS/DFS coloring" },
    ),
    graph(
      "Color 0 at source",
      "Start at 0 with color lo (0). Neighbors must get hi (1).",
      biNodes,
      biEdges,
      { "0": "lo" },
      { note: "color[0] = 0" },
    ),
    graph(
      "Neighbors of 0",
      "1 and 3 get the opposite color.",
      biNodes,
      biEdges,
      { "0": "lo", "1": "hi", "3": "hi" },
      { note: "color 1,3 = 1" },
    ),
    graph(
      "Color node 2",
      "From 1 (or 3): 2 must be lo. Both edges into 2 agree — still bipartite.",
      biNodes,
      biEdges,
      { "0": "lo", "1": "hi", "2": "lo", "3": "hi" },
      {
        treeEdges: biEdges.map((e) => ({ ...e, tone: "match" as CellTone })),
        note: "no clash",
      },
    ),
    graph(
      "Odd cycle fails",
      "If an edge joined two nodes of the same color, return false (odd cycle).",
      biNodes,
      [...biEdges, { from: "1", to: "3", tone: "skip" as CellTone }],
      { "0": "lo", "1": "hi", "2": "lo", "3": "hi" },
      { note: "1–3 same color → false" },
    ),
    arrayFrame(
      "Handle components",
      "Repeat from every uncolored node. Disconnected pieces colored independently.",
      [0, 1, 2, 3],
      { 0: "lo", 1: "hi", 2: "lo", 3: "hi" },
      {
        pointers: [{ name: "u", index: 0, color: PTR.L }],
        note: "true if all OK",
      },
    ),
  ];
}

const hateNodes: TreeNode[] = [
  { id: "1", label: "1", x: 22, y: 35 },
  { id: "2", label: "2", x: 50, y: 20 },
  { id: "3", label: "3", x: 78, y: 35 },
  { id: "4", label: "4", x: 50, y: 70 },
];
const hateEdges = [
  { from: "1", to: "2" },
  { from: "1", to: "3" },
  { from: "2", to: "4" },
];

function possibleBipartitionFrames(): Frame[] {
  return [
    graph(
      "Dislikes = edges",
      "n people, dislike pairs must sit in opposite groups. Same as bipartite check on the dislike graph.",
      hateNodes,
      hateEdges,
      {},
      { note: "groups A / B" },
    ),
    graph(
      "Put 1 in group A",
      "Color person 1 as lo. Disliked neighbors go to hi.",
      hateNodes,
      hateEdges,
      { "1": "lo" },
      { note: "group A: 1" },
    ),
    graph(
      "2 and 3 → group B",
      "Edges 1–2 and 1–3 force 2,3 into the other group.",
      hateNodes,
      hateEdges,
      { "1": "lo", "2": "hi", "3": "hi" },
      { note: "group B: 2,3" },
    ),
    graph(
      "4 opposite 2",
      "2 dislikes 4 → 4 joins group A with 1. Consistent.",
      hateNodes,
      hateEdges,
      { "1": "lo", "2": "hi", "3": "hi", "4": "lo" },
      {
        treeEdges: hateEdges.map((e) => ({ ...e, tone: "match" as CellTone })),
        note: "A:{1,4} B:{2,3}",
      },
    ),
    graph(
      "Conflict example",
      "If 3 also disliked 4 while both forced into A, same-group edge → false.",
      hateNodes,
      [...hateEdges, { from: "3", to: "4", tone: "skip" as CellTone }],
      { "1": "lo", "2": "hi", "3": "hi", "4": "lo" },
      { note: "3–4 both? clash" },
    ),
    arrayFrame(
      "All components",
      "Run 2-color BFS from each uncolored person 1..n. Return true if no conflicts.",
      [1, 2, 3, 4],
      { 0: "lo", 1: "hi", 2: "hi", 3: "lo" },
      { note: "possible = true" },
    ),
  ];
}

const flowerNodes: TreeNode[] = [
  { id: "1", label: "1", x: 22, y: 30 },
  { id: "2", label: "2", x: 55, y: 22 },
  { id: "3", label: "3", x: 78, y: 50 },
  { id: "4", label: "4", x: 40, y: 68 },
];
const flowerEdges = [
  { from: "1", to: "2" },
  { from: "2", to: "3" },
  { from: "3", to: "4" },
  { from: "4", to: "1" },
  { from: "1", to: "3" },
];

function flowerPlantingFrames(): Frame[] {
  return [
    graph(
      "4 flower types",
      "Garden graph: degree ≤ 3, so 4 colors always suffice. Assign 1–4 ≠ any neighbor.",
      flowerNodes,
      flowerEdges,
      {},
      { note: "paths[i] ∈ {1,2,3,4}" },
    ),
    graph(
      "Garden 1 → type 1",
      "Greedy: for each garden, pick the smallest type unused by colored neighbors.",
      flowerNodes,
      flowerEdges,
      { "1": "lo" },
      {
        cells: [{ value: "1", tone: "lo" }],
        note: "ans[1]=1",
      },
    ),
    graph(
      "Garden 2 → type 2",
      "Neighbor 1 used type 1. Take 2.",
      flowerNodes,
      flowerEdges,
      { "1": "lo", "2": "hi" },
      {
        cells: [
          { value: "1", tone: "lo" },
          { value: "2", tone: "hi" },
        ],
        note: "ans[2]=2",
      },
    ),
    graph(
      "Garden 3 → type 3",
      "Neighbors 1 and 2 used {1,2}. Pick 3 (or 4).",
      flowerNodes,
      flowerEdges,
      { "1": "lo", "2": "hi", "3": "mid" },
      {
        cells: [
          { value: "1", tone: "lo" },
          { value: "2", tone: "hi" },
          { value: "3", tone: "mid" },
        ],
        note: "ans[3]=3",
      },
    ),
    graph(
      "Garden 4 → type 2",
      "Neighbors 3 and 1 used {3,1}. Type 2 free (and 4).",
      flowerNodes,
      flowerEdges,
      { "1": "lo", "2": "hi", "3": "mid", "4": "match" },
      {
        cells: [
          { value: "1", tone: "lo" },
          { value: "2", tone: "hi" },
          { value: "3", tone: "mid" },
          { value: "2", tone: "match" },
        ],
        note: "ans = [1,2,3,2]",
      },
    ),
    arrayFrame(
      "Valid planting",
      "Any proper 4-coloring works. Greedy per garden in order 1..n is enough given Δ≤3.",
      [1, 2, 3, 2],
      { 0: "lo", 1: "hi", 2: "mid", 3: "match" },
      { note: "types for gardens 1..4" },
    ),
  ];
}

export const isGraphBipartiteSolution: ProblemSolution = {
  approach:
    "BFS/DFS 2-coloring: assign color 0 to a start node, flip for neighbors. If a neighbor already has the same color, the graph is not bipartite. Cover every component. O(V+E).",
  templates: langs(
    `from collections import deque

def isBipartite(graph):
    color = {}
    for start in range(len(graph)):
        if start in color: continue
        q = deque([start]); color[start] = 0
        while q:
            u = q.popleft()
            for v in graph[u]:
                if v not in color:
                    color[v] = color[u] ^ 1
                    q.append(v)
                elif color[v] == color[u]:
                    return False
    return True`,
    `bool isBipartite(vector<vector<int>>& graph) {
    vector<int> color(graph.size(), -1);
    for (int start = 0; start < (int)graph.size(); start++) {
        if (color[start] != -1) continue;
        queue<int> q; q.push(start); color[start] = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : graph[u]) {
                if (color[v] == -1) { color[v] = color[u] ^ 1; q.push(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}`,
    `boolean isBipartite(int[][] graph) {
    int[] color = new int[graph.length];
    Arrays.fill(color, -1);
    for (int start = 0; start < graph.length; start++) {
        if (color[start] != -1) continue;
        Deque<Integer> q = new ArrayDeque<>();
        q.add(start); color[start] = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : graph[u]) {
                if (color[v] == -1) { color[v] = color[u] ^ 1; q.add(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}`,
    `function isBipartite(graph) {
  const color = new Map();
  for (let start = 0; start < graph.length; start++) {
    if (color.has(start)) continue;
    const q = [start]; color.set(start, 0);
    while (q.length) {
      const u = q.shift();
      for (const v of graph[u]) {
        if (!color.has(v)) { color.set(v, color.get(u) ^ 1); q.push(v); }
        else if (color.get(v) === color.get(u)) return false;
      }
    }
  }
  return true;
}`,
  ),
  frames: isGraphBipartiteFrames(),
};

export const possibleBipartitionSolution: ProblemSolution = {
  approach:
    "Build an undirected dislike graph. 2-color people into two groups; a same-color dislike edge means impossible. BFS/DFS from each uncolored person. O(n+e).",
  templates: langs(
    `from collections import defaultdict, deque

def possibleBipartition(n, dislikes):
    g = defaultdict(list)
    for a, b in dislikes:
        g[a].append(b); g[b].append(a)
    color = {}
    for start in range(1, n + 1):
        if start in color: continue
        q = deque([start]); color[start] = 0
        while q:
            u = q.popleft()
            for v in g[u]:
                if v not in color:
                    color[v] = color[u] ^ 1
                    q.append(v)
                elif color[v] == color[u]:
                    return False
    return True`,
    `bool possibleBipartition(int n, vector<vector<int>>& dislikes) {
    vector<vector<int>> g(n + 1);
    for (auto& e : dislikes) { g[e[0]].push_back(e[1]); g[e[1]].push_back(e[0]); }
    vector<int> color(n + 1, -1);
    for (int start = 1; start <= n; start++) {
        if (color[start] != -1) continue;
        queue<int> q; q.push(start); color[start] = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : g[u]) {
                if (color[v] == -1) { color[v] = color[u] ^ 1; q.push(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}`,
    `boolean possibleBipartition(int n, int[][] dislikes) {
    List<Integer>[] g = new ArrayList[n + 1];
    for (int i = 1; i <= n; i++) g[i] = new ArrayList<>();
    for (int[] e : dislikes) { g[e[0]].add(e[1]); g[e[1]].add(e[0]); }
    int[] color = new int[n + 1];
    Arrays.fill(color, -1);
    for (int start = 1; start <= n; start++) {
        if (color[start] != -1) continue;
        Deque<Integer> q = new ArrayDeque<>();
        q.add(start); color[start] = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : g[u]) {
                if (color[v] == -1) { color[v] = color[u] ^ 1; q.add(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}`,
    `function possibleBipartition(n, dislikes) {
  const g = Array.from({ length: n + 1 }, () => []);
  for (const [a, b] of dislikes) { g[a].push(b); g[b].push(a); }
  const color = new Map();
  for (let start = 1; start <= n; start++) {
    if (color.has(start)) continue;
    const q = [start]; color.set(start, 0);
    while (q.length) {
      const u = q.shift();
      for (const v of g[u]) {
        if (!color.has(v)) { color.set(v, color.get(u) ^ 1); q.push(v); }
        else if (color.get(v) === color.get(u)) return false;
      }
    }
  }
  return true;
}`,
  ),
  frames: possibleBipartitionFrames(),
};

export const flowerPlantingWithNoAdjacentSolution: ProblemSolution = {
  approach:
    "Build adjacency lists (1-indexed gardens). For each garden, mark flower types used by neighbors and pick the first free type in 1..4. Degree ≤ 3 guarantees a free color. O(n+e).",
  templates: langs(
    `def gardenNoAdj(n, paths):
    g = [[] for _ in range(n + 1)]
    for a, b in paths:
        g[a].append(b); g[b].append(a)
    ans = [0] * (n + 1)
    for i in range(1, n + 1):
        used = {ans[j] for j in g[i]}
        for t in (1, 2, 3, 4):
            if t not in used:
                ans[i] = t
                break
    return ans[1:]`,
    `vector<int> gardenNoAdj(int n, vector<vector<int>>& paths) {
    vector<vector<int>> g(n + 1);
    for (auto& e : paths) { g[e[0]].push_back(e[1]); g[e[1]].push_back(e[0]); }
    vector<int> ans(n + 1);
    for (int i = 1; i <= n; i++) {
        bool used[5] = {};
        for (int j : g[i]) used[ans[j]] = true;
        for (int t = 1; t <= 4; t++) if (!used[t]) { ans[i] = t; break; }
    }
    return vector<int>(ans.begin() + 1, ans.end());
}`,
    `int[] gardenNoAdj(int n, int[][] paths) {
    List<Integer>[] g = new ArrayList[n + 1];
    for (int i = 1; i <= n; i++) g[i] = new ArrayList<>();
    for (int[] e : paths) { g[e[0]].add(e[1]); g[e[1]].add(e[0]); }
    int[] ans = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        boolean[] used = new boolean[5];
        for (int j : g[i]) used[ans[j]] = true;
        for (int t = 1; t <= 4; t++) if (!used[t]) { ans[i] = t; break; }
    }
    return Arrays.copyOfRange(ans, 1, n + 1);
}`,
    `function gardenNoAdj(n, paths) {
  const g = Array.from({ length: n + 1 }, () => []);
  for (const [a, b] of paths) { g[a].push(b); g[b].push(a); }
  const ans = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const used = new Set(g[i].map((j) => ans[j]));
    for (const t of [1, 2, 3, 4]) if (!used.has(t)) { ans[i] = t; break; }
  }
  return ans.slice(1);
}`,
  ),
  frames: flowerPlantingFrames(),
};

import { arrayFrame } from "../../demos/problems/helpers";
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

const courseNodes: TreeNode[] = [
  { id: "0", label: "0", x: 22, y: 30 },
  { id: "1", label: "1", x: 55, y: 22 },
  { id: "2", label: "2", x: 78, y: 55 },
  { id: "3", label: "3", x: 40, y: 70 },
];

function courseScheduleFrames(): Frame[] {
  const edgesCycle = [
    { from: "0", to: "1" },
    { from: "1", to: "2" },
    { from: "2", to: "0" },
    { from: "3", to: "1" },
  ];
  const edgesOk = [
    { from: "0", to: "1" },
    { from: "0", to: "2" },
    { from: "1", to: "3" },
    { from: "2", to: "3" },
  ];
  return [
    graph(
      "Prereq digraph",
      "Edge u→v means take u before v (or prereq[u]→course). Cycle ⇒ impossible.",
      courseNodes,
      edgesCycle,
      {},
      { note: "detect directed cycle" },
    ),
    graph(
      "Gray = on stack",
      "DFS 0: mark gray. Visit 1, then 2. White→gray→black.",
      courseNodes,
      edgesCycle,
      { "0": "window", "1": "window", "2": "active" },
      { note: "0,1 gray · 2 exploring" },
    ),
    graph(
      "Back edge 2→0",
      "Neighbor 0 is still gray → cycle. Cannot finish all courses.",
      courseNodes,
      [
        ...edgesCycle.slice(0, 2),
        { from: "2", to: "0", tone: "skip" as CellTone },
        edgesCycle[3],
      ],
      { "0": "match", "1": "window", "2": "match" },
      { note: "cycle → false" },
    ),
    graph(
      "DAG case",
      "No back edges. All nodes go gray then black. Return true.",
      courseNodes,
      edgesOk,
      { "0": "done", "1": "done", "2": "done", "3": "done" },
      {
        treeEdges: edgesOk.map((e) => ({ ...e, tone: "match" as CellTone })),
        note: "acyclic → true",
      },
    ),
    arrayFrame(
      "Kahn indegrees",
      "Alt: queue nodes with indegree 0; peel edges. If processed < n, a cycle remains.",
      [0, 1, 2, 3],
      { 0: "match" },
      { note: "indeg: 0,1,1,2 → start 0" },
    ),
  ];
}

function courseScheduleIIFrames(): Frame[] {
  const nodes = courseNodes;
  const edges = [
    { from: "0", to: "1" },
    { from: "0", to: "2" },
    { from: "1", to: "3" },
    { from: "2", to: "3" },
  ];
  return [
    graph(
      "Need a topo order",
      "Same digraph; emit any valid order of courses (prereqs before dependents).",
      nodes,
      edges,
      { "0": "lo" },
      { note: "indeg 0: [0]" },
    ),
    graph(
      "Take course 0",
      "Kahn: dequeue 0. Reduce indeg of 1 and 2. Order = [0].",
      nodes,
      edges,
      { "0": "done", "1": "window", "2": "window" },
      {
        cells: [{ value: "0", tone: "match" }],
        note: "order: 0",
      },
    ),
    graph(
      "Queue 1 and 2",
      "Both indegree 0. Process either first — both valid.",
      nodes,
      edges,
      { "0": "done", "1": "active", "2": "active", "3": "idle" },
      {
        cells: [
          { value: "0", tone: "done" },
          { value: "1", tone: "active" },
        ],
        note: "order: 0,1",
      },
    ),
    graph(
      "Then 2",
      "Peel 2. Course 3’s indegree hits 0.",
      nodes,
      edges,
      { "0": "done", "1": "done", "2": "done", "3": "lo" },
      {
        cells: [
          { value: "0", tone: "done" },
          { value: "1", tone: "done" },
          { value: "2", tone: "done" },
        ],
        note: "order: 0,1,2",
      },
    ),
    graph(
      "Finish with 3",
      "Order length == n. If shorter, cycle — return [].",
      nodes,
      edges.map((e) => ({ ...e, tone: "match" as CellTone })),
      { "0": "done", "1": "done", "2": "done", "3": "match" },
      {
        cells: ["0", "1", "2", "3"].map((value, i) => ({
          value,
          tone: (i === 3 ? "match" : "done") as CellTone,
        })),
        note: "[0,1,2,3]",
      },
    ),
    arrayFrame(
      "DFS post-order alt",
      "DFS finish times reversed = topo order. Gray back-edge ⇒ abort empty list.",
      [3, 2, 1, 0],
      { 0: "match", 3: "lo" },
      { note: "reverse postorder" },
    ),
  ];
}

const safeNodes: TreeNode[] = [
  { id: "0", label: "0", x: 20, y: 30 },
  { id: "1", label: "1", x: 50, y: 18 },
  { id: "2", label: "2", x: 78, y: 30 },
  { id: "3", label: "3", x: 50, y: 55 },
  { id: "4", label: "4", x: 78, y: 70 },
];
const safeEdges = [
  { from: "0", to: "1" },
  { from: "1", to: "2" },
  { from: "2", to: "3" },
  { from: "3", to: "1" },
  { from: "0", to: "4" },
];

function findEventualSafeStatesFrames(): Frame[] {
  return [
    graph(
      "Safe = no cycle ahead",
      "A node is safe if every path ends in a terminal (out-degree 0) — never enters a cycle.",
      safeNodes,
      safeEdges,
      { "4": "lo" },
      { note: "4 is terminal" },
    ),
    graph(
      "Cycle 1→2→3→1",
      "Nodes on or reaching this cycle are unsafe.",
      safeNodes,
      [
        { from: "0", to: "1" },
        { from: "1", to: "2", tone: "skip" as CellTone },
        { from: "2", to: "3", tone: "skip" as CellTone },
        { from: "3", to: "1", tone: "skip" as CellTone },
        { from: "0", to: "4" },
      ],
      { "1": "skip", "2": "skip", "3": "skip" },
      { note: "cycle nodes unsafe" },
    ),
    graph(
      "DFS color 0",
      "From 0: explore 1 (leads to cycle → unsafe) and 4 (terminal → safe).",
      safeNodes,
      safeEdges,
      { "0": "active", "1": "skip", "4": "match" },
      { note: "0 has unsafe child" },
    ),
    graph(
      "0 is unsafe",
      "Any path into a cycle makes the ancestor unsafe. 0 can go to 1’s cycle.",
      safeNodes,
      safeEdges,
      { "0": "skip", "1": "skip", "2": "skip", "3": "skip", "4": "match" },
      { note: "only 4 safe so far" },
    ),
    graph(
      "Memoize safe/unsafe",
      "3-color DFS: gray = visiting; if back edge → unsafe; black + all kids safe → safe.",
      safeNodes,
      safeEdges,
      { "4": "match" },
      { note: "answer: [4]" },
    ),
    arrayFrame(
      "Collect sorted",
      "Return all safe node indices in ascending order. Terminals and nodes only reaching them.",
      [0, 1, 2, 3, 4],
      { 4: "match", 0: "skip", 1: "skip", 2: "skip", 3: "skip" },
      { note: "safe = [4]" },
    ),
  ];
}

export const courseScheduleSolution: ProblemSolution = {
  approach:
    "Model prerequisites as a directed graph. Detect a cycle with 3-color DFS (gray back-edge) or Kahn’s algorithm (if fewer than n nodes processed). Acyclic ⇒ true. O(V+E).",
  templates: langs(
    `from collections import defaultdict

def canFinish(numCourses, prerequisites):
    g = defaultdict(list)
    for a, b in prerequisites:
        g[b].append(a)
    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * numCourses
    def dfs(u):
        color[u] = GRAY
        for v in g[u]:
            if color[v] == GRAY or (color[v] == WHITE and dfs(v)):
                return True
        color[u] = BLACK
        return False
    return all(color[i] != WHITE or not dfs(i) for i in range(numCourses))`,
    `bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> g(numCourses);
    for (auto& e : prerequisites) g[e[1]].push_back(e[0]);
    vector<int> color(numCourses); // 0 white 1 gray 2 black
    function<bool(int)> dfs = [&](int u) {
        color[u] = 1;
        for (int v : g[u]) {
            if (color[v] == 1 || (color[v] == 0 && dfs(v))) return true;
        }
        color[u] = 2;
        return false;
    };
    for (int i = 0; i < numCourses; i++)
        if (color[i] == 0 && dfs(i)) return false;
    return true;
}`,
    `boolean canFinish(int numCourses, int[][] prerequisites) {
    List<Integer>[] g = new ArrayList[numCourses];
    for (int i = 0; i < numCourses; i++) g[i] = new ArrayList<>();
    for (int[] e : prerequisites) g[e[1]].add(e[0]);
    int[] color = new int[numCourses];
    for (int i = 0; i < numCourses; i++)
        if (color[i] == 0 && dfs(i, g, color)) return false;
    return true;
}
boolean dfs(int u, List<Integer>[] g, int[] color) {
    color[u] = 1;
    for (int v : g[u]) {
        if (color[v] == 1 || (color[v] == 0 && dfs(v, g, color))) return true;
    }
    color[u] = 2;
    return false;
}`,
    `function canFinish(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) g[b].push(a);
  const color = Array(numCourses).fill(0);
  function dfs(u) {
    color[u] = 1;
    for (const v of g[u]) {
      if (color[v] === 1 || (color[v] === 0 && dfs(v))) return true;
    }
    color[u] = 2;
    return false;
  }
  for (let i = 0; i < numCourses; i++)
    if (color[i] === 0 && dfs(i)) return false;
  return true;
}`,
  ),
  frames: courseScheduleFrames(),
};

export const courseScheduleIISolution: ProblemSolution = {
  approach:
    "Topological sort via Kahn (indegree queue) or DFS post-order reverse. If a cycle exists, return []. Otherwise return any valid order. O(V+E).",
  templates: langs(
    `from collections import defaultdict, deque

def findOrder(numCourses, prerequisites):
    g = defaultdict(list)
    indeg = [0] * numCourses
    for a, b in prerequisites:
        g[b].append(a); indeg[a] += 1
    q = deque(i for i in range(numCourses) if indeg[i] == 0)
    order = []
    while q:
        u = q.popleft(); order.append(u)
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return order if len(order) == numCourses else []`,
    `vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> g(numCourses);
    vector<int> indeg(numCourses), order;
    for (auto& e : prerequisites) { g[e[1]].push_back(e[0]); indeg[e[0]]++; }
    queue<int> q;
    for (int i = 0; i < numCourses; i++) if (!indeg[i]) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop(); order.push_back(u);
        for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
    }
    return (int)order.size() == numCourses ? order : vector<int>{};
}`,
    `int[] findOrder(int numCourses, int[][] prerequisites) {
    List<Integer>[] g = new ArrayList[numCourses];
    for (int i = 0; i < numCourses; i++) g[i] = new ArrayList<>();
    int[] indeg = new int[numCourses];
    for (int[] e : prerequisites) { g[e[1]].add(e[0]); indeg[e[0]]++; }
    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.add(i);
    int[] order = new int[numCourses]; int k = 0;
    while (!q.isEmpty()) {
        int u = q.poll(); order[k++] = u;
        for (int v : g[u]) if (--indeg[v] == 0) q.add(v);
    }
    return k == numCourses ? order : new int[0];
}`,
    `function findOrder(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, () => []);
  const indeg = Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) { g[b].push(a); indeg[a]++; }
  const q = [];
  for (let i = 0; i < numCourses; i++) if (!indeg[i]) q.push(i);
  const order = [];
  while (q.length) {
    const u = q.shift(); order.push(u);
    for (const v of g[u]) if (--indeg[v] === 0) q.push(v);
  }
  return order.length === numCourses ? order : [];
}`,
  ),
  frames: courseScheduleIIFrames(),
};

export const findEventualSafeStatesSolution: ProblemSolution = {
  approach:
    "A node is safe iff no path from it reaches a cycle. 3-color DFS with memo: gray back-edge ⇒ unsafe; all neighbors safe ⇒ safe. Collect safe indices sorted. O(V+E).",
  templates: langs(
    `def eventualSafeNodes(graph):
    n = len(graph)
    color = [0] * n  # 0 white 1 gray 2 black(safe) / treat unsafe as stuck gray path
    def safe(u):
        if color[u]: return color[u] == 2
        color[u] = 1
        for v in graph[u]:
            if color[v] == 1 or not safe(v):
                return False
        color[u] = 2
        return True
    return [i for i in range(n) if safe(i)]`,
    `vector<int> eventualSafeNodes(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> color(n), ans;
    function<bool(int)> safe = [&](int u) {
        if (color[u]) return color[u] == 2;
        color[u] = 1;
        for (int v : graph[u])
            if (color[v] == 1 || !safe(v)) return false;
        color[u] = 2;
        return true;
    };
    for (int i = 0; i < n; i++) if (safe(i)) ans.push_back(i);
    return ans;
}`,
    `List<Integer> eventualSafeNodes(int[][] graph) {
    int n = graph.length;
    int[] color = new int[n];
    List<Integer> ans = new ArrayList<>();
    for (int i = 0; i < n; i++) if (safe(i, graph, color)) ans.add(i);
    return ans;
}
boolean safe(int u, int[][] g, int[] color) {
    if (color[u] != 0) return color[u] == 2;
    color[u] = 1;
    for (int v : g[u])
        if (color[v] == 1 || !safe(v, g, color)) return false;
    color[u] = 2;
    return true;
}`,
    `function eventualSafeNodes(graph) {
  const n = graph.length, color = Array(n).fill(0);
  function safe(u) {
    if (color[u]) return color[u] === 2;
    color[u] = 1;
    for (const v of graph[u])
      if (color[v] === 1 || !safe(v)) return false;
    color[u] = 2;
    return true;
  }
  const ans = [];
  for (let i = 0; i < n; i++) if (safe(i)) ans.push(i);
  return ans;
}`,
  ),
  frames: findEventualSafeStatesFrames(),
};

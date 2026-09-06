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

const courseNodes: TreeNode[] = [
  { id: "0", label: "0", x: 22, y: 28 },
  { id: "1", label: "1", x: 55, y: 18 },
  { id: "2", label: "2", x: 78, y: 45 },
  { id: "3", label: "3", x: 40, y: 68 },
];

function courseScheduleTopoFrames(): Frame[] {
  const ok = [
    { from: "0", to: "1" },
    { from: "0", to: "2" },
    { from: "1", to: "3" },
    { from: "2", to: "3" },
  ];
  const cycle = [
    { from: "0", to: "1" },
    { from: "1", to: "2" },
    { from: "2", to: "0" },
  ];
  return [
    graph(
      "Kahn on prereqs",
      "Edge u→v = take u before v. Indegree 0 nodes enter the queue first.",
      courseNodes,
      ok,
      { "0": "lo" },
      { note: "indeg: 0,1,1,2" },
    ),
    graph(
      "Peel course 0",
      "Dequeue 0; drop indeg of 1 and 2. processed = 1.",
      courseNodes,
      ok,
      { "0": "done", "1": "window", "2": "window" },
      { note: "q ← 1,2" },
    ),
    graph(
      "Peel 1 then 2",
      "Both reach indegree 0. Course 3’s indegree falls to 0 after both.",
      courseNodes,
      ok,
      { "0": "done", "1": "done", "2": "done", "3": "active" },
      { note: "processed = 3" },
    ),
    graph(
      "All n processed",
      "Order length == n ⇒ acyclic ⇒ canFinish true.",
      courseNodes,
      ok.map((e) => ({ ...e, tone: "match" as CellTone })),
      { "0": "done", "1": "done", "2": "done", "3": "match" },
      { note: "true" },
    ),
    graph(
      "Cycle leftover",
      "0→1→2→0: after peeling nothing with indeg 0, processed < n → false.",
      courseNodes,
      cycle.map((e) => ({ ...e, tone: "skip" as CellTone })),
      { "0": "skip", "1": "skip", "2": "skip", "3": "idle" },
      { note: "processed < n" },
    ),
    arrayFrame(
      "Indegree scan",
      "Seed queue with every indegree-0 course; if queue empties early, a cycle remains.",
      [0, 1, 1, 2],
      { 0: "match" },
      {
        pointers: [{ name: "i", index: 0, color: PTR.L }],
        note: "start at 0",
      },
    ),
  ];
}

function courseScheduleIITopoFrames(): Frame[] {
  const edges = [
    { from: "0", to: "1" },
    { from: "0", to: "2" },
    { from: "1", to: "3" },
    { from: "2", to: "3" },
  ];
  return [
    graph(
      "Emit a topo order",
      "Same Kahn peel, but record each dequeued course into ans.",
      courseNodes,
      edges,
      { "0": "lo" },
      { note: "ans = []" },
    ),
    graph(
      "ans ← 0",
      "Take 0. Neighbors 1,2 ready next.",
      courseNodes,
      edges,
      { "0": "done", "1": "window", "2": "window" },
      {
        cells: [{ value: "0", tone: "match" }],
        note: "ans: [0]",
      },
    ),
    graph(
      "ans ← 0,1",
      "Either 1 or 2 first is valid. Here take 1; 3 still waits on 2.",
      courseNodes,
      edges,
      { "0": "done", "1": "done", "2": "active", "3": "idle" },
      {
        cells: [
          { value: "0", tone: "done" },
          { value: "1", tone: "match" },
        ],
        note: "ans: [0,1]",
      },
    ),
    graph(
      "ans ← 0,1,2",
      "Peel 2; course 3 indegree hits 0.",
      courseNodes,
      edges,
      { "0": "done", "1": "done", "2": "done", "3": "lo" },
      {
        cells: [
          { value: "0", tone: "done" },
          { value: "1", tone: "done" },
          { value: "2", tone: "match" },
        ],
        note: "ans: [0,1,2]",
      },
    ),
    graph(
      "Full order",
      "Length n → return order. Shorter → cycle → return [].",
      courseNodes,
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
      "DFS reverse postorder",
      "Alt: DFS finish times, reverse → topo. Gray back-edge aborts with [].",
      [0, 1, 2, 3],
      { 0: "lo", 3: "match" },
      { note: "same DAG" },
    ),
  ];
}

function courseScheduleIVFrames(): Frame[] {
  const edges = [
    { from: "0", to: "1" },
    { from: "1", to: "2" },
    { from: "0", to: "3" },
  ];
  return [
    graph(
      "Prereq queries",
      "queries[i]=[u,v]: is u a (direct or indirect) prerequisite of v?",
      courseNodes,
      edges,
      { "0": "lo", "2": "hi" },
      { note: "ask 0→2?" },
    ),
    graph(
      "Build reachability",
      "Topo order then DP: reachable[u] |= reachable[pred]. Or Floyd on bitsets.",
      courseNodes,
      edges,
      { "0": "active" },
      { note: "process in topo" },
    ),
    graph(
      "Propagate from 0",
      "0 reaches 1 and 3. From 1, mark 2. So 0 reaches 2.",
      courseNodes,
      edges,
      { "0": "done", "1": "window", "2": "match", "3": "window" },
      {
        treeEdges: edges.map((e) => ({ ...e, tone: "match" as CellTone })),
        note: "0 ⇝ 2 true",
      },
    ),
    graph(
      "Query 3→2?",
      "3 never reaches 2 (no path). Answer false for that query.",
      courseNodes,
      edges,
      { "3": "skip", "2": "idle" },
      { note: "3 ⇝ 2? false" },
    ),
    graph(
      "Answer vector",
      "For each query, look up precomputed reach[u][v] (or bitset).",
      courseNodes,
      edges,
      { "0": "done", "1": "done", "2": "done", "3": "done" },
      { note: "[true, false, …]" },
    ),
    arrayFrame(
      "Bitset tip",
      "reach[u] as a bitset of descendants; OR along topo edges. Fast for n≤100.",
      [1, 1, 1, 0],
      { 0: "match", 1: "window", 2: "window" },
      { note: "reach[0] bits" },
    ),
  ];
}

export const courseScheduleTopoSolution: ProblemSolution = {
  approach:
    "Kahn’s algorithm: build adj + indegrees, queue all indegree-0 courses, peel edges. If you process exactly n nodes, the graph is a DAG and you can finish; otherwise a cycle remains. O(n+e).",
  templates: langs(
    `from collections import deque

def canFinish(numCourses, prerequisites):
    g = [[] for _ in range(numCourses)]
    indeg = [0] * numCourses
    for a, b in prerequisites:
        g[b].append(a); indeg[a] += 1
    q = deque(i for i in range(numCourses) if indeg[i] == 0)
    seen = 0
    while q:
        u = q.popleft(); seen += 1
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return seen == numCourses`,
    `bool canFinish(int n, vector<vector<int>>& prerequisites) {
    vector<vector<int>> g(n);
    vector<int> indeg(n);
    for (auto& e : prerequisites) { g[e[1]].push_back(e[0]); indeg[e[0]]++; }
    queue<int> q;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
    int seen = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop(); seen++;
        for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
    }
    return seen == n;
}`,
    `boolean canFinish(int n, int[][] prerequisites) {
    List<Integer>[] g = new List[n];
    for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
    int[] indeg = new int[n];
    for (int[] e : prerequisites) { g[e[1]].add(e[0]); indeg[e[0]]++; }
    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
    int seen = 0;
    while (!q.isEmpty()) {
        int u = q.poll(); seen++;
        for (int v : g[u]) if (--indeg[v] == 0) q.add(v);
    }
    return seen == n;
}`,
    `function canFinish(n, prerequisites) {
  const g = Array.from({ length: n }, () => []);
  const indeg = Array(n).fill(0);
  for (const [a, b] of prerequisites) { g[b].push(a); indeg[a]++; }
  const q = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  let seen = 0;
  while (q.length) {
    const u = q.shift(); seen++;
    for (const v of g[u]) if (--indeg[v] === 0) q.push(v);
  }
  return seen === n;
}`,
  ),
  frames: courseScheduleTopoFrames(),
};

export const courseScheduleIITopoSolution: ProblemSolution = {
  approach:
    "Kahn’s topo sort: peel indegree-0 courses into an order array. If order length equals numCourses, return it; otherwise a cycle exists and return []. O(n+e).",
  templates: langs(
    `from collections import deque

def findOrder(numCourses, prerequisites):
    g = [[] for _ in range(numCourses)]
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
    `vector<int> findOrder(int n, vector<vector<int>>& prerequisites) {
    vector<vector<int>> g(n);
    vector<int> indeg(n), order;
    for (auto& e : prerequisites) { g[e[1]].push_back(e[0]); indeg[e[0]]++; }
    queue<int> q;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop(); order.push_back(u);
        for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
    }
    return (int)order.size() == n ? order : vector<int>{};
}`,
    `int[] findOrder(int n, int[][] prerequisites) {
    List<Integer>[] g = new List[n];
    for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
    int[] indeg = new int[n];
    for (int[] e : prerequisites) { g[e[1]].add(e[0]); indeg[e[0]]++; }
    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
    int[] order = new int[n]; int k = 0;
    while (!q.isEmpty()) {
        int u = q.poll(); order[k++] = u;
        for (int v : g[u]) if (--indeg[v] == 0) q.add(v);
    }
    return k == n ? order : new int[0];
}`,
    `function findOrder(n, prerequisites) {
  const g = Array.from({ length: n }, () => []);
  const indeg = Array(n).fill(0);
  for (const [a, b] of prerequisites) { g[b].push(a); indeg[a]++; }
  const q = [], order = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  while (q.length) {
    const u = q.shift(); order.push(u);
    for (const v of g[u]) if (--indeg[v] === 0) q.push(v);
  }
  return order.length === n ? order : [];
}`,
  ),
  frames: courseScheduleIITopoFrames(),
};

export const courseScheduleIVSolution: ProblemSolution = {
  approach:
    "Precompute prerequisite reachability: topo-sort then OR ancestor sets along edges (or Floyd/bitsets on the DAG). Answer each query with reach[u][v]. O(n³) Floyd or O(n²+ne) with bitsets.",
  templates: langs(
    `from collections import deque

def checkIfPrerequisite(n, prerequisites, queries):
    g = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in prerequisites:
        g[a].append(b); indeg[b] += 1
    reach = [0] * n
    for i in range(n): reach[i] = 1 << i
    q = deque(i for i in range(n) if indeg[i] == 0)
    while q:
        u = q.popleft()
        for v in g[u]:
            reach[v] |= reach[u]
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return [bool(reach[v] & (1 << u)) for u, v in queries]`,
    `vector<bool> checkIfPrerequisite(int n, vector<vector<int>>& prereq, vector<vector<int>>& queries) {
    vector<vector<int>> g(n);
    vector<int> indeg(n);
    vector<bitset<100>> reach(n);
    for (int i = 0; i < n; i++) reach[i].set(i);
    for (auto& e : prereq) { g[e[0]].push_back(e[1]); indeg[e[1]]++; }
    queue<int> q;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : g[u]) {
            reach[v] |= reach[u];
            if (--indeg[v] == 0) q.push(v);
        }
    }
    vector<bool> ans;
    for (auto& qq : queries) ans.push_back(reach[qq[1]].test(qq[0]));
    return ans;
}`,
    `List<Boolean> checkIfPrerequisite(int n, int[][] prereq, int[][] queries) {
    List<Integer>[] g = new List[n];
    for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
    int[] indeg = new int[n];
    long[] reach = new long[n];
    for (int i = 0; i < n; i++) reach[i] = 1L << i;
    for (int[] e : prereq) { g[e[0]].add(e[1]); indeg[e[1]]++; }
    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
    while (!q.isEmpty()) {
        int u = q.poll();
        for (int v : g[u]) {
            reach[v] |= reach[u];
            if (--indeg[v] == 0) q.add(v);
        }
    }
    List<Boolean> ans = new ArrayList<>();
    for (int[] qq : queries) ans.add((reach[qq[1]] & (1L << qq[0])) != 0);
    return ans;
}`,
    `function checkIfPrerequisite(n, prerequisites, queries) {
  const g = Array.from({ length: n }, () => []);
  const indeg = Array(n).fill(0);
  const reach = Array.from({ length: n }, (_, i) => 1n << BigInt(i));
  for (const [a, b] of prerequisites) { g[a].push(b); indeg[b]++; }
  const q = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  while (q.length) {
    const u = q.shift();
    for (const v of g[u]) {
      reach[v] |= reach[u];
      if (--indeg[v] === 0) q.push(v);
    }
  }
  return queries.map(([u, v]) => (reach[v] & (1n << BigInt(u))) !== 0n);
}`,
  ),
  frames: courseScheduleIVFrames(),
};

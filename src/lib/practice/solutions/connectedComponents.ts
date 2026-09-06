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

const provinceNodes: TreeNode[] = [
  { id: "0", label: "0", x: 22, y: 28 },
  { id: "1", label: "1", x: 50, y: 22 },
  { id: "2", label: "2", x: 78, y: 28 },
  { id: "3", label: "3", x: 50, y: 68 },
];
const provinceEdges = [
  { from: "0", to: "1" },
  { from: "1", to: "2" },
];

function numberOfProvincesFrames(): Frame[] {
  return [
    graph(
      "isConnected matrix",
      "Cities 0–1–2 linked; city 3 alone. Each DFS/BFS start on an unvisited city is one province.",
      provinceNodes,
      provinceEdges,
      {},
      { note: "n = 4 · provinces = 0" },
    ),
    graph(
      "Start at city 0",
      "Unvisited → provinces += 1. DFS marks 0, then neighbors 1, then 2.",
      provinceNodes,
      provinceEdges,
      { "0": "active" },
      { note: "provinces = 1" },
    ),
    graph(
      "Paint 0–1–2",
      "Connected component fully visited via adjacency matrix / graph edges.",
      provinceNodes,
      provinceEdges,
      { "0": "window", "1": "window", "2": "window" },
      { note: "component A done" },
    ),
    graph(
      "City 3 unvisited",
      "Scan finds 3 still free. New province start.",
      provinceNodes,
      provinceEdges,
      { "0": "done", "1": "done", "2": "done", "3": "active" },
      { note: "provinces = 2" },
    ),
    graph(
      "Answer = 2",
      "Two connected components in the undirected friendship graph.",
      provinceNodes,
      provinceEdges,
      { "0": "done", "1": "done", "2": "done", "3": "match" },
      { note: "provinces = 2" },
    ),
  ];
}

function islandCCGrid(tones: Record<string, CellTone> = {}): Cell[][] {
  const raw = [
    ["1", "1", "0"],
    ["0", "0", "1"],
    ["1", "0", "1"],
  ];
  return raw.map((row, r) =>
    row.map((value, c) => ({
      value,
      tone: tones[`${r},${c}`] ?? "idle",
    })),
  );
}

function numberOfIslandsCCFrames(): Frame[] {
  return [
    gridFrame(
      "Grid as graph",
      "Each land cell is a vertex; 4-neighbors are edges. Counting islands = counting connected components.",
      islandCCGrid(),
      "components = 0",
    ),
    gridFrame(
      "Component 1",
      "Flood (0,0)–(0,1). First component.",
      islandCCGrid({ "0,0": "window", "0,1": "active" }),
      "components = 1",
    ),
    gridFrame(
      "Component 2",
      "Land at (1,2) starts a new DFS — not adjacent to the first island.",
      islandCCGrid({
        "0,0": "done",
        "0,1": "done",
        "1,2": "active",
      }),
      "components = 2",
    ),
    gridFrame(
      "Grow island 2",
      "(2,2) connects down from (1,2). Still same component.",
      islandCCGrid({
        "0,0": "done",
        "0,1": "done",
        "1,2": "window",
        "2,2": "active",
      }),
      "paint B",
    ),
    gridFrame(
      "Component 3",
      "Isolated land (2,0). Third start. Answer = 3.",
      islandCCGrid({
        "0,0": "done",
        "0,1": "done",
        "1,2": "done",
        "2,2": "done",
        "2,0": "match",
      }),
      "components = 3",
    ),
  ];
}

const pathNodes: TreeNode[] = [
  { id: "0", label: "0", x: 18, y: 40 },
  { id: "1", label: "1", x: 42, y: 22 },
  { id: "2", label: "2", x: 42, y: 62 },
  { id: "3", label: "3", x: 68, y: 40 },
  { id: "4", label: "4", x: 88, y: 40 },
];
const pathEdges = [
  { from: "0", to: "1" },
  { from: "0", to: "2" },
  { from: "1", to: "3" },
  { from: "2", to: "3" },
];

function findIfPathExistsFrames(): Frame[] {
  return [
    graph(
      "source=0 · target=3",
      "Undirected edges. BFS/DFS from source; return true if target is reached.",
      pathNodes,
      pathEdges,
      { "0": "lo", "3": "hi" },
      { note: "4 is disconnected" },
    ),
    graph(
      "BFS from 0",
      "Enqueue 0. Visit neighbors 1 and 2 first (wide).",
      pathNodes,
      pathEdges,
      { "0": "active", "1": "window", "2": "window", "3": "hi" },
      { note: "queue: 1,2" },
    ),
    graph(
      "Reach 3 via 1",
      "Pop 1 → neighbor 3 is the target. Path exists.",
      pathNodes,
      pathEdges,
      { "0": "done", "1": "active", "2": "window", "3": "match" },
      {
        treeEdges: pathEdges.map((e) =>
          e.to === "3" && e.from === "1"
            ? { ...e, tone: "match" as CellTone }
            : e,
        ),
        note: "found",
      },
    ),
    graph(
      "Target = 4?",
      "Same search never visits 4 — no edges reach it. Return false.",
      pathNodes,
      pathEdges,
      { "0": "done", "1": "done", "2": "done", "3": "done", "4": "skip" },
      { note: "0 → 4? false" },
    ),
    graph(
      "Union-Find alt",
      "Unite each edge; path exists iff find(source)==find(target). Same connectivity idea.",
      pathNodes,
      pathEdges,
      { "0": "match", "1": "match", "2": "match", "3": "match", "4": "idle" },
      { note: "same component ⇒ true" },
    ),
  ];
}

export const numberOfProvincesSolution: ProblemSolution = {
  approach:
    "Treat the n×n isConnected matrix as an undirected graph. For each unvisited city, DFS/BFS the component and increment the province count. O(n²) time, O(n) space.",
  templates: langs(
    `def findCircleNum(isConnected):
    n, seen, count = len(isConnected), [False] * len(isConnected), 0
    def dfs(u):
        seen[u] = True
        for v in range(n):
            if isConnected[u][v] and not seen[v]:
                dfs(v)
    for i in range(n):
        if not seen[i]:
            count += 1
            dfs(i)
    return count`,
    `int findCircleNum(vector<vector<int>>& isConnected) {
    int n = isConnected.size(), count = 0;
    vector<int> seen(n);
    function<void(int)> dfs = [&](int u) {
        seen[u] = 1;
        for (int v = 0; v < n; v++)
            if (isConnected[u][v] && !seen[v]) dfs(v);
    };
    for (int i = 0; i < n; i++)
        if (!seen[i]) { count++; dfs(i); }
    return count;
}`,
    `int findCircleNum(int[][] isConnected) {
    int n = isConnected.length, count = 0;
    boolean[] seen = new boolean[n];
    for (int i = 0; i < n; i++)
        if (!seen[i]) { count++; dfs(i, isConnected, seen); }
    return count;
}
void dfs(int u, int[][] g, boolean[] seen) {
    seen[u] = true;
    for (int v = 0; v < g.length; v++)
        if (g[u][v] == 1 && !seen[v]) dfs(v, g, seen);
}`,
    `function findCircleNum(isConnected) {
  const n = isConnected.length, seen = Array(n).fill(false);
  let count = 0;
  function dfs(u) {
    seen[u] = true;
    for (let v = 0; v < n; v++)
      if (isConnected[u][v] && !seen[v]) dfs(v);
  }
  for (let i = 0; i < n; i++)
    if (!seen[i]) { count++; dfs(i); }
  return count;
}`,
  ),
  frames: numberOfProvincesFrames(),
};

export const numberOfIslandsCCSolution: ProblemSolution = {
  approach:
    "Same as Number of Islands: each flood-fill of land is one connected component in the grid graph. Count starts. O(mn) time, O(mn) space.",
  templates: langs(
    `def numIslands(grid):
    m, n, count = len(grid), len(grid[0]), 0
    def dfs(r, c):
        if r < 0 or c < 0 or r >= m or c >= n or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            dfs(r + dr, c + dc)
    for i in range(m):
        for j in range(n):
            if grid[i][j] == "1":
                count += 1
                dfs(i, j)
    return count`,
    `int numIslands(vector<vector<char>>& grid) {
    int m = grid.size(), n = grid[0].size(), count = 0;
    function<void(int,int)> dfs = [&](int r, int c) {
        if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
    };
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (grid[i][j] == '1') { count++; dfs(i, j); }
    return count;
}`,
    `int numIslands(char[][] grid) {
    int count = 0;
    for (int i = 0; i < grid.length; i++)
        for (int j = 0; j < grid[0].length; j++)
            if (grid[i][j] == '1') { count++; dfs(grid, i, j); }
    return count;
}
void dfs(char[][] g, int r, int c) {
    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;
    g[r][c] = '0';
    dfs(g, r+1, c); dfs(g, r-1, c); dfs(g, r, c+1); dfs(g, r, c-1);
}`,
    `function numIslands(grid) {
  const m = grid.length, n = grid[0].length;
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] !== "1") return;
    grid[r][c] = "0";
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
  }
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++)
      if (grid[i][j] === "1") { count++; dfs(i, j); }
  return count;
}`,
  ),
  frames: numberOfIslandsCCFrames(),
};

export const findIfPathExistsSolution: ProblemSolution = {
  approach:
    "Build adjacency lists from edges. BFS or DFS from source with a visited set; return true if target is reached. Union-Find also works. O(n+e) time and space.",
  templates: langs(
    `from collections import defaultdict, deque

def validPath(n, edges, source, destination):
    g = defaultdict(list)
    for u, v in edges:
        g[u].append(v); g[v].append(u)
    q, seen = deque([source]), {source}
    while q:
        u = q.popleft()
        if u == destination: return True
        for v in g[u]:
            if v not in seen:
                seen.add(v); q.append(v)
    return False`,
    `bool validPath(int n, vector<vector<int>>& edges, int source, int destination) {
    vector<vector<int>> g(n);
    for (auto& e : edges) { g[e[0]].push_back(e[1]); g[e[1]].push_back(e[0]); }
    queue<int> q; vector<int> seen(n);
    q.push(source); seen[source] = 1;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        if (u == destination) return true;
        for (int v : g[u]) if (!seen[v]) { seen[v] = 1; q.push(v); }
    }
    return false;
}`,
    `boolean validPath(int n, int[][] edges, int source, int destination) {
    List<Integer>[] g = new ArrayList[n];
    for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
    for (int[] e : edges) { g[e[0]].add(e[1]); g[e[1]].add(e[0]); }
    Deque<Integer> q = new ArrayDeque<>();
    boolean[] seen = new boolean[n];
    q.add(source); seen[source] = true;
    while (!q.isEmpty()) {
        int u = q.poll();
        if (u == destination) return true;
        for (int v : g[u]) if (!seen[v]) { seen[v] = true; q.add(v); }
    }
    return false;
}`,
    `function validPath(n, edges, source, destination) {
  const g = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { g[u].push(v); g[v].push(u); }
  const q = [source], seen = new Set([source]);
  while (q.length) {
    const u = q.shift();
    if (u === destination) return true;
    for (const v of g[u]) if (!seen.has(v)) { seen.add(v); q.push(v); }
  }
  return false;
}`,
  ),
  frames: findIfPathExistsFrames(),
};

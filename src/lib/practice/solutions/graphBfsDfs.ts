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

function islandGrid(tones: Record<string, CellTone> = {}): Cell[][] {
  const raw = [
    ["1", "1", "0"],
    ["1", "0", "0"],
    ["0", "0", "1"],
  ];
  return raw.map((row, r) =>
    row.map((value, c) => ({
      value,
      tone: tones[`${r},${c}`] ?? "idle",
    })),
  );
}

function numberOfIslandsFrames(): Frame[] {
  return [
    gridFrame(
      "Grid 3×3",
      "Land = 1, water = 0. Each DFS/BFS flood from an unvisited 1 counts one island.",
      islandGrid(),
      "islands = 0",
    ),
    gridFrame(
      "Hit land (0,0)",
      "Scan row-major. First land found — start a flood fill. islands += 1.",
      islandGrid({ "0,0": "active" }),
      "islands = 1 · DFS",
    ),
    gridFrame(
      "Flood right & down",
      "Mark visited (or sink to 0). Neighbors (0,1) and (1,0) are land — keep going.",
      islandGrid({
        "0,0": "window",
        "0,1": "active",
        "1,0": "window",
      }),
      "paint component A",
    ),
    gridFrame(
      "Island A done",
      "No more unvisited land connected to (0,0). Component painted.",
      islandGrid({
        "0,0": "done",
        "0,1": "done",
        "1,0": "done",
      }),
      "islands = 1",
    ),
    gridFrame(
      "Scan continues",
      "Skip water and already-visited land. Reach (2,2) — new land.",
      islandGrid({
        "0,0": "done",
        "0,1": "done",
        "1,0": "done",
        "2,2": "active",
      }),
      "islands = 2",
    ),
    gridFrame(
      "Island B flooded",
      "Single-cell island. No more land left. Answer = 2.",
      islandGrid({
        "0,0": "done",
        "0,1": "done",
        "1,0": "done",
        "2,2": "match",
      }),
      "answer = 2",
    ),
  ];
}

const cloneNodes: TreeNode[] = [
  { id: "1", label: "1", x: 22, y: 28 },
  { id: "2", label: "2", x: 55, y: 18 },
  { id: "3", label: "3", x: 78, y: 48 },
  { id: "4", label: "4", x: 40, y: 68 },
];
const cloneEdges = [
  { from: "1", to: "2" },
  { from: "1", to: "4" },
  { from: "2", to: "3" },
  { from: "3", to: "4" },
];

function cloneGraph(
  title: string,
  caption: string,
  map: Record<string, CellTone>,
  extra: Partial<Frame> = {},
): Frame {
  return {
    kind: "tree",
    title,
    caption,
    treeNodes: cloneNodes.map((n) => ({ ...n, tone: map[n.id] ?? "idle" })),
    treeEdges: cloneEdges,
    ...extra,
  };
}

function cloneGraphFrames(): Frame[] {
  return [
    cloneGraph(
      "Original graph",
      "Node 1 neighbors [2,4]. Clone with a map old→new so cycles/shared neighbors are not duplicated.",
      {},
      { note: "map = {}" },
    ),
    cloneGraph(
      "Clone node 1",
      "Create copy of 1. Map[1] = copy1. Recurse/BFS into neighbors.",
      { "1": "active" },
      { note: "map: 1→1'" },
    ),
    cloneGraph(
      "Clone neighbor 2",
      "First visit of 2: allocate 2', link 1'→2'. Continue from 2.",
      { "1": "window", "2": "active" },
      { note: "map: 1→1', 2→2'" },
    ),
    cloneGraph(
      "Clone 3 via 2",
      "2→3 unseen. Make 3', wire 2'→3'.",
      { "1": "done", "2": "window", "3": "active" },
      { note: "map + 3→3'" },
    ),
    cloneGraph(
      "Clone 4 · reuse",
      "3→4 new; later 1→4 already in map — return existing 4', do not allocate twice.",
      { "1": "done", "2": "done", "3": "window", "4": "active" },
      { note: "map + 4→4' · reuse" },
    ),
    cloneGraph(
      "Deep copy done",
      "Every node cloned once; edges mirrored. BFS with a queue works the same with the map.",
      { "1": "match", "2": "match", "3": "match", "4": "match" },
      {
        treeEdges: cloneEdges.map((e) => ({ ...e, tone: "match" as CellTone })),
        note: "return 1'",
      },
    ),
  ];
}

function maxAreaGrid(tones: Record<string, CellTone> = {}): Cell[][] {
  const raw = [
    ["1", "1", "0"],
    ["1", "0", "1"],
    ["0", "0", "1"],
  ];
  return raw.map((row, r) =>
    row.map((value, c) => ({
      value,
      tone: tones[`${r},${c}`] ?? "idle",
    })),
  );
}

function maxAreaOfIslandFrames(): Frame[] {
  return [
    gridFrame(
      "Find max land blob",
      "Same flood as islands, but sum cell count per component. Track a global max.",
      maxAreaGrid(),
      "best = 0",
    ),
    gridFrame(
      "Start at (0,0)",
      "DFS returns size of this island. First cell contributes 1.",
      maxAreaGrid({ "0,0": "active" }),
      "size = 1",
    ),
    gridFrame(
      "Grow to 3 cells",
      "Visit (0,1) and (1,0). Island A size = 3. best = max(0,3).",
      maxAreaGrid({
        "0,0": "window",
        "0,1": "window",
        "1,0": "active",
      }),
      "size = 3 · best = 3",
    ),
    gridFrame(
      "Next land (1,2)",
      "Scan finds another unvisited 1. Start a new flood.",
      maxAreaGrid({
        "0,0": "done",
        "0,1": "done",
        "1,0": "done",
        "1,2": "active",
      }),
      "new island",
    ),
    gridFrame(
      "Island B size 2",
      "(1,2)+(2,2). size = 2 < best, so best stays 3.",
      maxAreaGrid({
        "0,0": "done",
        "0,1": "done",
        "1,0": "done",
        "1,2": "window",
        "2,2": "active",
      }),
      "size = 2 · best = 3",
    ),
    gridFrame(
      "Answer = 3",
      "All land visited. Return the maximum component size.",
      maxAreaGrid({
        "0,0": "match",
        "0,1": "match",
        "1,0": "match",
        "1,2": "done",
        "2,2": "done",
      }),
      "max area = 3",
    ),
  ];
}

export const numberOfIslandsSolution: ProblemSolution = {
  approach:
    "Scan the grid; on each unvisited land cell, DFS/BFS flood-fill (mark visited or sink) and increment the island count. O(mn) time, O(mn) stack/queue worst case.",
  templates: langs(
    `def numIslands(grid):
    if not grid: return 0
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
    int m = grid.length, n = grid[0].length, count = 0;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (grid[i][j] == '1') { count++; dfs(grid, i, j); }
    return count;
}
void dfs(char[][] g, int r, int c) {
    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;
    g[r][c] = '0';
    dfs(g, r+1, c); dfs(g, r-1, c); dfs(g, r, c+1); dfs(g, r, c-1);
}`,
    `function numIslands(grid) {
  if (!grid.length) return 0;
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
  frames: numberOfIslandsFrames(),
};

export const cloneGraphSolution: ProblemSolution = {
  approach:
    "DFS or BFS with a hashmap from original node → clone. On first visit allocate the copy; on revisit return the mapped clone and wire neighbor edges. O(V+E) time and space.",
  templates: langs(
    `def cloneGraph(node):
    if not node: return None
    mp = {}
    def dfs(u):
        if u in mp: return mp[u]
        copy = Node(u.val)
        mp[u] = copy
        for v in u.neighbors:
            copy.neighbors.append(dfs(v))
        return copy
    return dfs(node)`,
    `Node* cloneGraph(Node* node) {
    if (!node) return nullptr;
    unordered_map<Node*, Node*> mp;
    function<Node*(Node*)> dfs = [&](Node* u) -> Node* {
        if (mp.count(u)) return mp[u];
        Node* copy = new Node(u->val);
        mp[u] = copy;
        for (Node* v : u->neighbors) copy->neighbors.push_back(dfs(v));
        return copy;
    };
    return dfs(node);
}`,
    `Node cloneGraph(Node node) {
    if (node == null) return null;
    Map<Node, Node> mp = new HashMap<>();
    return dfs(node, mp);
}
Node dfs(Node u, Map<Node, Node> mp) {
    if (mp.containsKey(u)) return mp.get(u);
    Node copy = new Node(u.val);
    mp.put(u, copy);
    for (Node v : u.neighbors) copy.neighbors.add(dfs(v, mp));
    return copy;
}`,
    `function cloneGraph(node) {
  if (!node) return null;
  const mp = new Map();
  function dfs(u) {
    if (mp.has(u)) return mp.get(u);
    const copy = new Node(u.val);
    mp.set(u, copy);
    for (const v of u.neighbors) copy.neighbors.push(dfs(v));
    return copy;
  }
  return dfs(node);
}`,
  ),
  frames: cloneGraphFrames(),
};

export const maxAreaOfIslandSolution: ProblemSolution = {
  approach:
    "Flood each island; DFS/BFS returns the cell count. Track max over all components. Mark visited while exploring. O(mn) time, O(mn) space.",
  templates: langs(
    `def maxAreaOfIsland(grid):
    m, n, best = len(grid), len(grid[0]), 0
    def dfs(r, c):
        if r < 0 or c < 0 or r >= m or c >= n or grid[r][c] != 1:
            return 0
        grid[r][c] = 0
        return 1 + dfs(r+1,c) + dfs(r-1,c) + dfs(r,c+1) + dfs(r,c-1)
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                best = max(best, dfs(i, j))
    return best`,
    `int maxAreaOfIsland(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size(), best = 0;
    function<int(int,int)> dfs = [&](int r, int c) {
        if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] != 1) return 0;
        grid[r][c] = 0;
        return 1 + dfs(r+1,c) + dfs(r-1,c) + dfs(r,c+1) + dfs(r,c-1);
    };
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (grid[i][j] == 1) best = max(best, dfs(i, j));
    return best;
}`,
    `int maxAreaOfIsland(int[][] grid) {
    int m = grid.length, n = grid[0].length, best = 0;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (grid[i][j] == 1) best = Math.max(best, dfs(grid, i, j));
    return best;
}
int dfs(int[][] g, int r, int c) {
    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != 1) return 0;
    g[r][c] = 0;
    return 1 + dfs(g,r+1,c) + dfs(g,r-1,c) + dfs(g,r,c+1) + dfs(g,r,c-1);
}`,
    `function maxAreaOfIsland(grid) {
  const m = grid.length, n = grid[0].length;
  let best = 0;
  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] !== 1) return 0;
    grid[r][c] = 0;
    return 1 + dfs(r+1,c) + dfs(r-1,c) + dfs(r,c+1) + dfs(r,c-1);
  }
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++)
      if (grid[i][j] === 1) best = Math.max(best, dfs(i, j));
  return best;
}`,
  ),
  frames: maxAreaOfIslandFrames(),
};

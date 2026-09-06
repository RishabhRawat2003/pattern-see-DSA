import type { CellTone, Frame, TreeNode } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

const nodes: TreeNode[] = [
  { id: "1", label: "1", x: 50, y: 14 },
  { id: "2", label: "2", x: 28, y: 42 },
  { id: "3", label: "3", x: 72, y: 42 },
  { id: "4", label: "4", x: 16, y: 70 },
  { id: "5", label: "5", x: 40, y: 70 },
  { id: "6", label: "6", x: 72, y: 70 },
];
const edges = [
  { from: "1", to: "2" },
  { from: "1", to: "3" },
  { from: "2", to: "4" },
  { from: "2", to: "5" },
  { from: "3", to: "6" },
];

function paint(map: Record<string, CellTone>): TreeNode[] {
  return nodes.map((n) => ({ ...n, tone: map[n.id] ?? "idle" }));
}

function tree(
  title: string,
  caption: string,
  map: Record<string, CellTone>,
  edgeTone?: CellTone,
  extra: Partial<Frame> = {},
): Frame {
  return {
    kind: "tree",
    title,
    caption,
    treeNodes: paint(map),
    treeEdges: edgeTone ? edges.map((e) => ({ ...e, tone: edgeTone })) : edges,
    ...extra,
  };
}

function kthAncestorFrames(): Frame[] {
  return [
    tree(
      "Parent table",
      "up[u][0]=parent(u). Then up[u][k]=up[ up[u][k-1] ][k-1] — the 2^k ancestor.",
      {},
      undefined,
      { note: "binary lifting" },
    ),
    tree(
      "up[*][0]",
      "Direct parents: 4→2, 5→2, 2→1, 6→3, 3→1.",
      { "4": "lo", "2": "window", "1": "hi" },
      "window",
      { note: "k=0" },
    ),
    tree(
      "Get kth ancestor of 4, k=2",
      "k=2=10₂. Skip bit0; use bit1: jump 2^1 from 4 → up[4][1]=1.",
      { "4": "active", "2": "window", "1": "match" },
      "match",
      { note: "4 → 1" },
    ),
    tree(
      "Bit walk",
      "While k>0: if k&1 jump up[node][bit]; k>>=1; bit++.",
      { "5": "active", "2": "window", "1": "match" },
      undefined,
      { note: "bits of k" },
    ),
    tree(
      "Out of range",
      "If a jump hits −1 / null before k exhausted, ancestor does not exist.",
      { "1": "skip" },
      undefined,
      { note: "return -1" },
    ),
    tree(
      "O(log n) per query",
      "Preprocess O(n log n). Answer any kth ancestor in O(log n).",
      { "4": "done", "1": "done" },
      undefined,
      { note: "ready" },
    ),
  ];
}

function lcaBinaryLiftingFrames(): Frame[] {
  return [
    tree(
      "LCA via lifting",
      "Depths + up table. Lift deeper node to same depth, then lift both together.",
      { "4": "lo", "6": "hi" },
      undefined,
      { note: "LCA(4,6)" },
    ),
    tree(
      "Equalize depth",
      "depth(4)=2, depth(6)=2 — already equal. Else jump deeper by depth diff bits.",
      { "4": "lo", "6": "hi", "2": "window", "3": "window" },
      undefined,
      { note: "same depth" },
    ),
    tree(
      "Lift together",
      "From high bit: if up[u][j]!=up[v][j], jump both. Then parent is LCA.",
      { "4": "lo", "6": "hi", "1": "active" },
      "active",
      { note: "climb" },
    ),
    tree(
      "LCA = 1",
      "After aligning, parent of both is 1 — the fork.",
      { "1": "match", "4": "done", "6": "done" },
      "match",
      { note: "LCA=1" },
    ),
    tree(
      "Same subtree",
      "If one is ancestor of the other, equalizing depth lands on it — that is LCA.",
      { "2": "match", "4": "lo" },
      undefined,
      { note: "ancestor case" },
    ),
    tree(
      "Classic DFS LCA also works",
      "Binary lifting shines with many queries after O(n log n) preprocess.",
      { "1": "done" },
      undefined,
      { note: "many queries" },
    ),
  ];
}

function stepByStepFrames(): Frame[] {
  return [
    tree(
      "Directions start→dest",
      "Find LCA. Path = U…U from start up to LCA, then L/R down to dest.",
      { "4": "lo", "6": "hi" },
      undefined,
      { note: "4 → 6" },
    ),
    tree(
      "Find LCA = 1",
      "Climb from both or use parent pointers until paths meet.",
      { "1": "match", "4": "lo", "6": "hi" },
      "match",
      { note: "LCA" },
    ),
    tree(
      "Up from start",
      "4→2→1 needs \"UU\". Each parent step is 'U'.",
      { "4": "done", "2": "window", "1": "match" },
      "window",
      { note: "UU" },
    ),
    tree(
      "Down to dest",
      "Record path 1→3→6 as L/R by comparing child side (here both right-ish: \"RR\" or track letters).",
      { "1": "done", "3": "window", "6": "match" },
      "match",
      { note: "down" },
    ),
    tree(
      "Build string",
      "Concatenate ups + downs. Example route UU + (path letters to 6).",
      { "4": "lo", "1": "match", "6": "hi" },
      undefined,
      { note: "directions" },
    ),
    tree(
      "Alternative",
      "BFS parent map from start, then walk dest→start reconstructing L/R/U — also fine for binary trees.",
      { "2": "window", "3": "window" },
      undefined,
      { note: "BFS ok" },
    ),
  ];
}

export const kthAncestorSolution: ProblemSolution = {
  approach:
    "Binary lifting: up[u][0]=parent, up[u][k]=up[up[u][k-1]][k-1]. Answer kth ancestor by jumping bits of k. Preprocess O(n log n), query O(log n).",
  templates: langs(
    `class TreeAncestor:
    def __init__(self, n, parent):
        LOG = n.bit_length()
        self.up = [[-1] * LOG for _ in range(n)]
        for i in range(n):
            self.up[i][0] = parent[i]
        for k in range(1, LOG):
            for i in range(n):
                p = self.up[i][k - 1]
                self.up[i][k] = -1 if p < 0 else self.up[p][k - 1]
    def getKthAncestor(self, node, k):
        bit = 0
        while k and node >= 0:
            if k & 1: node = self.up[node][bit]
            k >>= 1; bit += 1
        return node`,
    `class TreeAncestor {
    vector<vector<int>> up;
public:
    TreeAncestor(int n, vector<int>& parent) {
        int LOG = 32 - __builtin_clz(max(n, 1));
        up.assign(n, vector<int>(LOG, -1));
        for (int i = 0; i < n; i++) up[i][0] = parent[i];
        for (int k = 1; k < LOG; k++)
            for (int i = 0; i < n; i++) {
                int p = up[i][k - 1];
                up[i][k] = p < 0 ? -1 : up[p][k - 1];
            }
    }
    int getKthAncestor(int node, int k) {
        int bit = 0;
        while (k && node >= 0) {
            if (k & 1) node = up[node][bit];
            k >>= 1; bit++;
        }
        return node;
    }
};`,
    `class TreeAncestor {
    int[][] up;
    TreeAncestor(int n, int[] parent) {
        int LOG = 32 - Integer.numberOfLeadingZeros(Math.max(n, 1));
        up = new int[n][LOG];
        for (int i = 0; i < n; i++) Arrays.fill(up[i], -1);
        for (int i = 0; i < n; i++) up[i][0] = parent[i];
        for (int k = 1; k < LOG; k++)
            for (int i = 0; i < n; i++) {
                int p = up[i][k - 1];
                up[i][k] = p < 0 ? -1 : up[p][k - 1];
            }
    }
    int getKthAncestor(int node, int k) {
        int bit = 0;
        while (k != 0 && node >= 0) {
            if ((k & 1) != 0) node = up[node][bit];
            k >>= 1; bit++;
        }
        return node;
    }
}`,
    `class TreeAncestor {
  constructor(n, parent) {
    const LOG = n.toString(2).length;
    this.up = Array.from({ length: n }, () => Array(LOG).fill(-1));
    for (let i = 0; i < n; i++) this.up[i][0] = parent[i];
    for (let k = 1; k < LOG; k++)
      for (let i = 0; i < n; i++) {
        const p = this.up[i][k - 1];
        this.up[i][k] = p < 0 ? -1 : this.up[p][k - 1];
      }
  }
  getKthAncestor(node, k) {
    let bit = 0;
    while (k && node >= 0) {
      if (k & 1) node = this.up[node][bit];
      k >>= 1; bit++;
    }
    return node;
  }
}`,
  ),
  frames: kthAncestorFrames(),
};

export const lcaBinaryLiftingSolution: ProblemSolution = {
  approach:
    "DFS for depth/parent; build up[][]. Lift deeper node to same depth; then lift both until parents match. O(n log n) preprocess, O(log n) LCA.",
  templates: langs(
    `def lowestCommonAncestor(root, p, q):
    # For binary tree without lifting: post-order
    if not root or root is p or root is q: return root
    L = lowestCommonAncestor(root.left, p, q)
    R = lowestCommonAncestor(root.right, p, q)
    return root if L and R else L or R`,
    `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* L = lowestCommonAncestor(root->left, p, q);
    TreeNode* R = lowestCommonAncestor(root->right, p, q);
    return (L && R) ? root : (L ? L : R);
}`,
    `TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode L = lowestCommonAncestor(root.left, p, q);
    TreeNode R = lowestCommonAncestor(root.right, p, q);
    return (L != null && R != null) ? root : (L != null ? L : R);
}`,
    `function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const L = lowestCommonAncestor(root.left, p, q);
  const R = lowestCommonAncestor(root.right, p, q);
  return L && R ? root : L || R;
}`,
  ),
  frames: lcaBinaryLiftingFrames(),
};

export const stepByStepDirectionsSolution: ProblemSolution = {
  approach:
    "Find LCA (or BFS parents). Append 'U' for each step start→LCA; append 'L'/'R' walking LCA→dest. O(n) time.",
  templates: langs(
    `def getDirections(root, startValue, destValue):
    def path(node, target, cur):
        if not node: return None
        if node.val == target: return cur
        cur.append("L")
        if path(node.left, target, cur): return cur
        cur[-1] = "R"
        if path(node.right, target, cur): return cur
        cur.pop(); return None
    sp, dp = path(root, startValue, []), path(root, destValue, [])
    i = 0
    while i < len(sp) and i < len(dp) and sp[i] == dp[i]: i += 1
    return "U" * (len(sp) - i) + "".join(dp[i:])`,
    `bool findPath(TreeNode* node, int target, string& cur) {
    if (!node) return false;
    if (node->val == target) return true;
    cur.push_back('L');
    if (findPath(node->left, target, cur)) return true;
    cur.back() = 'R';
    if (findPath(node->right, target, cur)) return true;
    cur.pop_back(); return false;
}
string getDirections(TreeNode* root, int startValue, int destValue) {
    string sp, dp;
    findPath(root, startValue, sp); findPath(root, destValue, dp);
    int i = 0;
    while (i < (int)sp.size() && i < (int)dp.size() && sp[i] == dp[i]) i++;
    return string(sp.size() - i, 'U') + dp.substr(i);
}`,
    `boolean findPath(TreeNode node, int target, StringBuilder cur) {
    if (node == null) return false;
    if (node.val == target) return true;
    cur.append('L');
    if (findPath(node.left, target, cur)) return true;
    cur.setCharAt(cur.length() - 1, 'R');
    if (findPath(node.right, target, cur)) return true;
    cur.deleteCharAt(cur.length() - 1); return false;
}
String getDirections(TreeNode root, int startValue, int destValue) {
    StringBuilder sp = new StringBuilder(), dp = new StringBuilder();
    findPath(root, startValue, sp); findPath(root, destValue, dp);
    int i = 0;
    while (i < sp.length() && i < dp.length() && sp.charAt(i) == dp.charAt(i)) i++;
    return "U".repeat(sp.length() - i) + dp.substring(i);
}`,
    `function getDirections(root, startValue, destValue) {
  function path(node, target, cur) {
    if (!node) return null;
    if (node.val === target) return cur;
    cur.push("L");
    if (path(node.left, target, cur)) return cur;
    cur[cur.length - 1] = "R";
    if (path(node.right, target, cur)) return cur;
    cur.pop(); return null;
  }
  const sp = path(root, startValue, []), dp = path(root, destValue, []);
  let i = 0;
  while (i < sp.length && i < dp.length && sp[i] === dp[i]) i++;
  return "U".repeat(sp.length - i) + dp.slice(i).join("");
}`,
  ),
  frames: stepByStepFrames(),
};

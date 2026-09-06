import type { CellTone, Frame, TreeNode } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

const base: TreeNode[] = [
  { id: "n4", label: "4", x: 50, y: 14 },
  { id: "n2", label: "2", x: 28, y: 42 },
  { id: "n6", label: "6", x: 72, y: 42 },
  { id: "n1", label: "1", x: 14, y: 72 },
  { id: "n3", label: "3", x: 42, y: 72 },
  { id: "n7", label: "7", x: 86, y: 72 },
];
const edges = [
  { from: "n4", to: "n2" },
  { from: "n4", to: "n6" },
  { from: "n2", to: "n1" },
  { from: "n2", to: "n3" },
  { from: "n6", to: "n7" },
];

function paint(map: Record<string, CellTone>): TreeNode[] {
  return base.map((n) => ({ ...n, tone: map[n.id] ?? "idle" }));
}

function tree(
  title: string,
  caption: string,
  map: Record<string, CellTone>,
  extra: Partial<Frame> = {},
): Frame {
  return {
    kind: "tree",
    title,
    caption,
    treeNodes: paint(map),
    treeEdges: edges,
    ...extra,
  };
}

function maxDepthFrames(): Frame[] {
  return [
    tree(
      "Empty → 0",
      "Base case: null contributes depth 0. Answers bubble up from leaves.",
      {},
      { note: "depth(null) = 0" },
    ),
    tree(
      "Leaves",
      "1, 3, 7 are leaves → depth 1 each.",
      { n1: "done", n3: "done", n7: "done" },
      { note: "depth = 1" },
    ),
    tree(
      "Node 2",
      "depth(2) = 1 + max(depth(1), depth(3)) = 2.",
      { n2: "active", n1: "done", n3: "done" },
      { note: "depth(2) = 2" },
    ),
    tree(
      "Node 6",
      "depth(6) = 1 + depth(7) = 2.",
      { n6: "active", n7: "done" },
      { note: "depth(6) = 2" },
    ),
    tree(
      "Root 4",
      "depth(4) = 1 + max(2, 2) = 3. That is the maximum depth.",
      { n4: "match", n2: "window", n6: "window" },
      { note: "max depth = 3" },
    ),
    tree(
      "Pattern",
      "Post-order: return 1 + max(left, right). Same shape as many tree DP problems.",
      {
        n4: "match",
        n2: "done",
        n6: "done",
        n1: "done",
        n3: "done",
        n7: "done",
      },
    ),
  ];
}

function diameterFrames(): Frame[] {
  return [
    tree(
      "Diameter = longest path",
      "Edges on the longest path between any two nodes. At each node, candidate = height(L) + height(R).",
      {},
      { note: "track global best" },
    ),
    tree(
      "Leaf heights",
      "height(null)=0. Leaves return 1 (nodes on path down).",
      { n1: "done", n3: "done", n7: "done" },
      { note: "h = 1" },
    ),
    tree(
      "Through node 2",
      "L=1, R=1 → path 1–2–3 has 2 edges. best = max(best, 2).",
      { n2: "active", n1: "lo", n3: "hi" },
      { note: "best ≥ 2" },
    ),
    tree(
      "Through node 6",
      "Only right child: L+R = 1. Height of 6 becomes 2.",
      { n6: "active", n7: "done" },
      { note: "h(6) = 2" },
    ),
    tree(
      "Through root 4",
      "L=2, R=2 → path 1–2–4–6–7 has 4 edges. New best.",
      { n4: "match", n2: "window", n6: "window", n1: "lo", n7: "hi" },
      { note: "diameter = 4" },
    ),
    tree(
      "Return height up",
      "Each call still returns 1+max(L,R) for ancestors. One DFS does both.",
      {
        n4: "match",
        n2: "done",
        n6: "done",
        n1: "done",
        n3: "done",
        n7: "done",
      },
      { note: "O(n) single pass" },
    ),
  ];
}

function balancedFrames(): Frame[] {
  return [
    tree(
      "Height-balanced?",
      "At every node |h(L) − h(R)| ≤ 1. Return height, or −1 if a subtree already failed.",
      {},
    ),
    tree(
      "Leaves OK",
      "Balance factor 0; height 1.",
      { n1: "done", n3: "done", n7: "done" },
    ),
    tree(
      "Node 2",
      "|1 − 1| = 0. Balanced. Height 2.",
      { n2: "match", n1: "done", n3: "done" },
      { note: "bf = 0" },
    ),
    tree(
      "Node 6",
      "Left null (0), right height 1 → |0−1|=1 ≤ 1. OK. Height 2.",
      { n6: "match", n7: "done" },
      { note: "bf = 1" },
    ),
    tree(
      "Root",
      "|2 − 2| = 0. Whole tree balanced → walk returns ≥ 0.",
      { n4: "match", n2: "done", n6: "done" },
      { note: "balanced = true" },
    ),
    tree(
      "Early fail",
      "If any subtree returns −1, propagate −1 immediately — no need to finish the tree.",
      { n2: "skip" },
      { note: "return −1 up" },
    ),
  ];
}

export const maximumDepthOfBinaryTreeSolution: ProblemSolution = {
  approach:
    "Post-order: depth(node) = 0 if null else 1 + max(depth(left), depth(right)). O(n) time, O(h) stack.",
  templates: langs(
    `def maxDepth(root):
    if not root: return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
    `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
    `int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
  ),
  frames: maxDepthFrames(),
};

export const diameterOfBinaryTreeSolution: ProblemSolution = {
  approach:
    "DFS returning height; at each node update best = max(best, L+R) where L/R are child heights. Diameter counted in edges. O(n) time, O(h) space.",
  templates: langs(
    `def diameterOfBinaryTree(root):
    best = 0
    def height(n):
        nonlocal best
        if not n: return 0
        L, R = height(n.left), height(n.right)
        best = max(best, L + R)
        return 1 + max(L, R)
    height(root)
    return best`,
    `int diameterOfBinaryTree(TreeNode* root) {
    int best = 0;
    function<int(TreeNode*)> height = [&](TreeNode* n) {
        if (!n) return 0;
        int L = height(n->left), R = height(n->right);
        best = max(best, L + R);
        return 1 + max(L, R);
    };
    height(root);
    return best;
}`,
    `int best;
int diameterOfBinaryTree(TreeNode root) {
    best = 0;
    height(root);
    return best;
}
int height(TreeNode n) {
    if (n == null) return 0;
    int L = height(n.left), R = height(n.right);
    best = Math.max(best, L + R);
    return 1 + Math.max(L, R);
}`,
    `function diameterOfBinaryTree(root) {
  let best = 0;
  function height(n) {
    if (!n) return 0;
    const L = height(n.left), R = height(n.right);
    best = Math.max(best, L + R);
    return 1 + Math.max(L, R);
  }
  height(root);
  return best;
}`,
  ),
  frames: diameterFrames(),
};

export const balancedBinaryTreeSolution: ProblemSolution = {
  approach:
    "Return height or −1 if unbalanced: if |L−R|>1 or a child failed, return −1; else 1+max(L,R). Balanced iff result ≥ 0. O(n) time.",
  templates: langs(
    `def isBalanced(root):
    def walk(n):
        if not n: return 0
        L, R = walk(n.left), walk(n.right)
        if L < 0 or R < 0 or abs(L - R) > 1: return -1
        return 1 + max(L, R)
    return walk(root) >= 0`,
    `int walk(TreeNode* n) {
    if (!n) return 0;
    int L = walk(n->left), R = walk(n->right);
    if (L < 0 || R < 0 || abs(L - R) > 1) return -1;
    return 1 + max(L, R);
}
bool isBalanced(TreeNode* root) {
    return walk(root) >= 0;
}`,
    `int walk(TreeNode n) {
    if (n == null) return 0;
    int L = walk(n.left), R = walk(n.right);
    if (L < 0 || R < 0 || Math.abs(L - R) > 1) return -1;
    return 1 + Math.max(L, R);
}
boolean isBalanced(TreeNode root) {
    return walk(root) >= 0;
}`,
    `function isBalanced(root) {
  function walk(n) {
    if (!n) return 0;
    const L = walk(n.left), R = walk(n.right);
    if (L < 0 || R < 0 || Math.abs(L - R) > 1) return -1;
    return 1 + Math.max(L, R);
  }
  return walk(root) >= 0;
}`,
  ),
  frames: balancedFrames(),
};

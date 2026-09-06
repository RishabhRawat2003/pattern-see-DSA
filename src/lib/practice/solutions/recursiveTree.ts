import type { CellTone, Frame, TreeNode } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

const base: TreeNode[] = [
  { id: "r", label: "3", x: 50, y: 14 },
  { id: "l", label: "9", x: 28, y: 42 },
  { id: "ri", label: "20", x: 72, y: 42 },
  { id: "rl", label: "15", x: 58, y: 72 },
  { id: "rr", label: "7", x: 86, y: 72 },
];
const baseEdges = [
  { from: "r", to: "l" },
  { from: "r", to: "ri" },
  { from: "ri", to: "rl" },
  { from: "ri", to: "rr" },
];

function paint(
  map: Record<string, CellTone>,
  nodes: TreeNode[] = base,
): TreeNode[] {
  return nodes.map((n) => ({ ...n, tone: map[n.id] ?? "idle" }));
}

function tree(
  title: string,
  caption: string,
  map: Record<string, CellTone>,
  extra: Partial<Frame> = {},
  nodes: TreeNode[] = base,
  edges = baseEdges,
): Frame {
  return {
    kind: "tree",
    title,
    caption,
    treeNodes: paint(map, nodes),
    treeEdges: edges,
    ...extra,
  };
}

function maxDepthFrames(): Frame[] {
  return [
    tree(
      "Empty → depth 0",
      "Base case: null node contributes 0. Every answer bubbles up from the leaves.",
      {},
      { note: "depth(null) = 0" },
    ),
    tree(
      "Leaf 9",
      "Left child is a leaf: depth = 1 + max(0,0) = 1.",
      { l: "active" },
      { note: "depth(9) = 1" },
    ),
    tree(
      "Leaves 15 and 7",
      "Both children of 20 are leaves → each depth 1.",
      { rl: "done", rr: "done" },
      { note: "depth(15)=1 · depth(7)=1" },
    ),
    tree(
      "Node 20",
      "depth(20) = 1 + max(depth(15), depth(7)) = 2.",
      { ri: "active", rl: "done", rr: "done" },
      { note: "depth(20) = 2" },
    ),
    tree(
      "Root 3",
      "depth(3) = 1 + max(depth(9), depth(20)) = 1 + max(1,2) = 3.",
      { r: "match", l: "window", ri: "window" },
      { note: "max depth = 3" },
    ),
    tree(
      "Combine pattern",
      "Answer at a node = 1 + max(left answer, right answer). Same shape as many tree DP problems.",
      { r: "match", l: "done", ri: "done", rl: "done", rr: "done" },
    ),
  ];
}

function invertFrames(): Frame[] {
  const inverted: TreeNode[] = [
    { id: "r", label: "3", x: 50, y: 14 },
    { id: "l", label: "20", x: 28, y: 42 },
    { id: "ri", label: "9", x: 72, y: 42 },
    { id: "ll", label: "7", x: 14, y: 72 },
    { id: "lr", label: "15", x: 42, y: 72 },
  ];
  const invEdges = [
    { from: "r", to: "l" },
    { from: "r", to: "ri" },
    { from: "l", to: "ll" },
    { from: "l", to: "lr" },
  ];
  return [
    tree(
      "Original tree",
      "Invert = swap left and right at every node. Recurse, then (or before) swap.",
      {},
    ),
    tree(
      "Swap at leaf 9",
      "Leaf: left and right are null — swap is a no-op. Return.",
      { l: "done" },
    ),
    tree(
      "Swap under 20",
      "Swap 15 ↔ 7 first (children), then the node itself is ready to swap with its sibling later.",
      { ri: "active", rl: "window", rr: "window" },
      { note: "15 ↔ 7" },
    ),
    tree(
      "Children of 20 swapped",
      "After swap: left=7, right=15. Bubble up.",
      { ri: "match", rl: "done", rr: "done" },
      {
        note: "20.left=7 · 20.right=15",
        treeNodes: paint(
          { ri: "match", rl: "done", rr: "done" },
          [
            { id: "r", label: "3", x: 50, y: 14 },
            { id: "l", label: "9", x: 28, y: 42 },
            { id: "ri", label: "20", x: 72, y: 42 },
            { id: "rl", label: "7", x: 58, y: 72 },
            { id: "rr", label: "15", x: 86, y: 72 },
          ],
        ),
      },
    ),
    tree(
      "Swap at root",
      "Swap 9 ↔ 20. The whole tree is mirrored.",
      { r: "active", l: "window", ri: "window" },
      { note: "3.left ↔ 3.right" },
    ),
    tree(
      "Inverted",
      "Root's left is now 20 (with 7,15), right is 9. Same structure, mirrored.",
      { r: "match", l: "done", ri: "done", ll: "done", lr: "done" },
      {},
      inverted,
      invEdges,
    ),
  ];
}

function symmetricFrames(): Frame[] {
  const sym: TreeNode[] = [
    { id: "r", label: "1", x: 50, y: 12 },
    { id: "l", label: "2", x: 30, y: 38 },
    { id: "ri", label: "2", x: 70, y: 38 },
    { id: "ll", label: "3", x: 16, y: 64 },
    { id: "lr", label: "4", x: 40, y: 64 },
    { id: "rl", label: "4", x: 60, y: 64 },
    { id: "rr", label: "3", x: 84, y: 64 },
  ];
  const edges = [
    { from: "r", to: "l" },
    { from: "r", to: "ri" },
    { from: "l", to: "ll" },
    { from: "l", to: "lr" },
    { from: "ri", to: "rl" },
    { from: "ri", to: "rr" },
  ];
  return [
    tree(
      "Mirror check",
      "A tree is symmetric if left and right subtrees are mirrors. Compare two nodes at once.",
      {},
      { note: "mirror(left, right)" },
      sym,
      edges,
    ),
    tree(
      "Roots of subtrees",
      "Compare node 2 (left) with node 2 (right): same value → check outer and inner children.",
      { l: "active", ri: "active" },
      { note: "2 == 2" },
      sym,
      edges,
    ),
    tree(
      "Outer pair 3 ↔ 3",
      "Left's left vs right's right. Values match; both are leaves → OK.",
      { ll: "match", rr: "match" },
      { note: "outer children" },
      sym,
      edges,
    ),
    tree(
      "Inner pair 4 ↔ 4",
      "Left's right vs right's left. Also match.",
      { lr: "match", rl: "match" },
      { note: "inner children" },
      sym,
      edges,
    ),
    tree(
      "All pairs OK",
      "Every mirror pair agreed. Tree is symmetric. Mismatch anywhere would short-circuit false.",
      {
        r: "done",
        l: "done",
        ri: "done",
        ll: "match",
        lr: "match",
        rl: "match",
        rr: "match",
      },
      { note: "symmetric = true" },
      sym,
      edges,
    ),
    tree(
      "Counterexample idea",
      "If one side had 3 and the other 5, values differ → false immediately. Null vs non-null also fails.",
      { ll: "skip", rr: "hi" },
      { note: "3 ≠ 5 → false" },
      sym,
      edges,
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

export const invertBinaryTreeSolution: ProblemSolution = {
  approach:
    "Recurse on both children, then swap left and right pointers (or swap then recurse). O(n) time, O(h) stack.",
  templates: langs(
    `def invertTree(root):
    if not root: return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root`,
    `TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    TreeNode* L = invertTree(root->left);
    TreeNode* R = invertTree(root->right);
    root->left = R; root->right = L;
    return root;
}`,
    `TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode L = invertTree(root.left);
    TreeNode R = invertTree(root.right);
    root.left = R; root.right = L;
    return root;
}`,
    `function invertTree(root) {
  if (!root) return null;
  const L = invertTree(root.left);
  const R = invertTree(root.right);
  root.left = R; root.right = L;
  return root;
}`,
  ),
  frames: invertFrames(),
};

export const symmetricTreeSolution: ProblemSolution = {
  approach:
    "Mirror DFS: compare (a.left, b.right) and (a.right, b.left) with equal values. Start with (root.left, root.right). O(n) time, O(h) stack.",
  templates: langs(
    `def isSymmetric(root):
    def mirror(a, b):
        if not a and not b: return True
        if not a or not b or a.val != b.val: return False
        return mirror(a.left, b.right) and mirror(a.right, b.left)
    return mirror(root.left, root.right) if root else True`,
    `bool mirror(TreeNode* a, TreeNode* b) {
    if (!a && !b) return true;
    if (!a || !b || a->val != b->val) return false;
    return mirror(a->left, b->right) && mirror(a->right, b->left);
}
bool isSymmetric(TreeNode* root) {
    return !root || mirror(root->left, root->right);
}`,
    `boolean mirror(TreeNode a, TreeNode b) {
    if (a == null && b == null) return true;
    if (a == null || b == null || a.val != b.val) return false;
    return mirror(a.left, b.right) && mirror(a.right, b.left);
}
boolean isSymmetric(TreeNode root) {
    return root == null || mirror(root.left, root.right);
}`,
    `function isSymmetric(root) {
  function mirror(a, b) {
    if (!a && !b) return true;
    if (!a || !b || a.val !== b.val) return false;
    return mirror(a.left, b.right) && mirror(a.right, b.left);
  }
  return !root || mirror(root.left, root.right);
}`,
  ),
  frames: symmetricFrames(),
};

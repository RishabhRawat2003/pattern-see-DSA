import type { CellTone, Frame, TreeNode } from "../../types";
import { arrayFrame } from "../../demos/problems/helpers";
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
  treeEdges = edges,
): Frame {
  return {
    kind: "tree",
    title,
    caption,
    treeNodes: paint(map, nodes),
    treeEdges,
    ...extra,
  };
}

function balancedFrames(): Frame[] {
  return [
    tree(
      "Check balance bottom-up",
      "Same −1 sentinel pattern: height if OK, −1 if |L−R|>1 anywhere.",
      {},
    ),
    tree(
      "Subtrees OK",
      "Leaves and node 2 both balanced.",
      { n1: "done", n3: "done", n2: "match" },
    ),
    tree(
      "Right side OK",
      "Node 6: |0−1|≤1.",
      { n6: "match", n7: "done" },
    ),
    tree(
      "Root balanced",
      "Heights equal → true. One DFS, O(n).",
      { n4: "match", n2: "done", n6: "done" },
      { note: "isBalanced = true" },
    ),
    tree(
      "Unbalanced idea",
      "A long left chain with empty right would return −1 at the first bad node.",
      { n2: "skip", n1: "hi" },
      { note: "propagate −1" },
    ),
  ];
}

function sortedArrayToBSTFrames(): Frame[] {
  const nums = [-10, -3, 0, 5, 9];
  const midRoot: TreeNode[] = [
    { id: "r", label: "0", x: 50, y: 14 },
    { id: "l", label: "-3", x: 28, y: 42 },
    { id: "ri", label: "9", x: 72, y: 42 },
    { id: "ll", label: "-10", x: 14, y: 72 },
    { id: "rl", label: "5", x: 60, y: 72 },
  ];
  const midEdges = [
    { from: "r", to: "l" },
    { from: "r", to: "ri" },
    { from: "l", to: "ll" },
    { from: "ri", to: "rl" },
  ];
  return [
    arrayFrame(
      "Sorted nums",
      "Midpoint becomes root → left half is left subtree, right half is right. Height-balanced by construction.",
      nums,
      { 2: "active" },
      { note: "mid = 0" },
    ),
    arrayFrame(
      "Left half [-10,-3]",
      "Recurse on indices [0,1]. Mid −3 becomes left child.",
      nums,
      { 0: "window", 1: "active", 2: "done" },
      { note: "left of 0" },
    ),
    arrayFrame(
      "Right half [5,9]",
      "Mid 9 becomes right child; 5 goes left of 9.",
      nums,
      { 2: "done", 3: "window", 4: "active" },
      { note: "right of 0" },
    ),
    tree(
      "BST built",
      "Inorder of the tree recovers the sorted array. Depth differs by at most 1.",
      { r: "match", l: "done", ri: "done", ll: "done", rl: "done" },
      { note: "balanced BST" },
      midRoot,
      midEdges,
    ),
    tree(
      "Invariant",
      "Always pick mid of the current slice — never skew like inserting sequentially.",
      { r: "match" },
      {},
      midRoot,
      midEdges,
    ),
  ];
}

function maxDepthFrames(): Frame[] {
  return [
    tree(
      "Max depth again",
      "Balanced-tree pack still uses the classic 1+max(L,R) depth formula.",
      {},
    ),
    tree(
      "Leaves = 1",
      "Null → 0; leaf → 1.",
      { n1: "done", n3: "done", n7: "done" },
    ),
    tree(
      "Internal nodes",
      "2 and 6 each have depth 2.",
      { n2: "active", n6: "active" },
      { note: "depth = 2" },
    ),
    tree(
      "Root depth 3",
      "1 + max(2,2) = 3.",
      { n4: "match" },
      { note: "maxDepth = 3" },
    ),
    tree(
      "Why here?",
      "Depth is the height you already compute while checking balance — same recursion skeleton.",
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

export const balancedBinaryTreeBalancedSolution: ProblemSolution = {
  approach:
    "Bottom-up: return height or −1 if |L−R|>1 or a child failed. Tree is balanced iff walk(root) ≥ 0. O(n) time, O(h) space.",
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

export const sortedArrayToBSTSolution: ProblemSolution = {
  approach:
    "Recursively pick mid of nums[lo..hi] as root; build left from [lo,mid−1] and right from [mid+1,hi]. Guarantees height-balanced BST. O(n) time.",
  templates: langs(
    `def sortedArrayToBST(nums):
    def build(lo, hi):
        if lo > hi: return None
        mid = (lo + hi) // 2
        node = TreeNode(nums[mid])
        node.left = build(lo, mid - 1)
        node.right = build(mid + 1, hi)
        return node
    return build(0, len(nums) - 1)`,
    `TreeNode* build(vector<int>& a, int lo, int hi) {
    if (lo > hi) return nullptr;
    int mid = lo + (hi - lo) / 2;
    TreeNode* node = new TreeNode(a[mid]);
    node->left = build(a, lo, mid - 1);
    node->right = build(a, mid + 1, hi);
    return node;
}
TreeNode* sortedArrayToBST(vector<int>& nums) {
    return build(nums, 0, (int)nums.size() - 1);
}`,
    `TreeNode build(int[] a, int lo, int hi) {
    if (lo > hi) return null;
    int mid = lo + (hi - lo) / 2;
    TreeNode node = new TreeNode(a[mid]);
    node.left = build(a, lo, mid - 1);
    node.right = build(a, mid + 1, hi);
    return node;
}
TreeNode sortedArrayToBST(int[] nums) {
    return build(nums, 0, nums.length - 1);
}`,
    `function sortedArrayToBST(nums) {
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    return {
      val: nums[mid],
      left: build(lo, mid - 1),
      right: build(mid + 1, hi),
    };
  }
  return build(0, nums.length - 1);
}`,
  ),
  frames: sortedArrayToBSTFrames(),
};

export const maxDepthBalancedSolution: ProblemSolution = {
  approach:
    "depth(null)=0; else 1+max(left,right). Same recursion used when returning heights for balance checks. O(n) time, O(h) space.",
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

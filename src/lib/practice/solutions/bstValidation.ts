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

function validateFrames(): Frame[] {
  return [
    tree(
      "Is it a BST?",
      "Local left < node < right is not enough. Every node needs an ancestor (low, high) window.",
      {},
    ),
    tree(
      "Root 4",
      "Window (−∞, +∞). Left gets (−∞, 4), right gets (4, +∞).",
      { n4: "active" },
      { note: "(−∞, +∞)" },
    ),
    tree(
      "Node 2",
      "Must be < 4. Children: 1 in (−∞,2), 3 in (2,4).",
      { n4: "done", n2: "active" },
      { note: "(−∞, 4)" },
    ),
    tree(
      "Node 6",
      "Must be > 4. Child 7 in (6, +∞).",
      { n6: "active", n4: "done" },
      { note: "(4, +∞)" },
    ),
    tree(
      "Valid",
      "All nodes inside their windows. Strict inequalities — duplicates fail.",
      {
        n1: "match",
        n2: "match",
        n3: "match",
        n4: "match",
        n6: "match",
        n7: "match",
      },
      { note: "true" },
    ),
  ];
}

function minDiffFrames(): Frame[] {
  return [
    tree(
      "Min abs diff",
      "Inorder of BST is sorted — min gap is between consecutive inorder values.",
      {},
      { note: "track prev" },
    ),
    tree(
      "Visit 1",
      "prev = null → set prev = 1.",
      { n1: "active" },
      { note: "prev = 1" },
    ),
    tree(
      "Visit 2",
      "|2−1|=1. best = 1. prev = 2.",
      { n1: "done", n2: "active" },
      { note: "best = 1" },
    ),
    tree(
      "Visit 3",
      "|3−2|=1. Still best 1.",
      { n2: "done", n3: "active" },
      { note: "best = 1" },
    ),
    tree(
      "Continue inorder",
      "Gaps 4−3, 6−4, 7−6… minimum remains 1.",
      { n4: "window", n6: "window", n7: "window" },
      { note: "answer = 1" },
    ),
    tree(
      "Done",
      "One inorder pass O(n). No need to compare non-adjacent nodes.",
      {
        n1: "match",
        n2: "match",
        n3: "match",
        n4: "match",
        n6: "match",
        n7: "match",
      },
    ),
  ];
}

function recoverFrames(): Frame[] {
  const swapped: TreeNode[] = [
    { id: "n4", label: "4", x: 50, y: 14 },
    { id: "n2", label: "6", x: 28, y: 42 },
    { id: "n6", label: "2", x: 72, y: 42 },
    { id: "n1", label: "1", x: 14, y: 72 },
    { id: "n3", label: "3", x: 42, y: 72 },
    { id: "n7", label: "7", x: 86, y: 72 },
  ];
  return [
    tree(
      "Two nodes swapped",
      "Inorder should be increasing. Find the two inversion points and swap their values.",
      { n2: "hi", n6: "lo" },
      { note: "6 and 2 swapped" },
      swapped,
    ),
    tree(
      "Inorder sees …1,6…",
      "First drop: prev=6 > cur=3? Walk: 1 OK, then 6 — later 3 < 6 → first = 6, second = 3…",
      { n2: "active", n1: "done" },
      { note: "track first/second" },
      swapped,
    ),
    tree(
      "Second inversion",
      "When 2 appears after 4, update second = 2. (Classic: first stays, second updates.)",
      { n2: "hi", n6: "lo", n4: "window" },
      { note: "first=6 · second=2" },
      swapped,
    ),
    tree(
      "Swap values",
      "Swap first.val ↔ second.val. Structure unchanged.",
      {
        n1: "done",
        n2: "match",
        n3: "done",
        n4: "done",
        n6: "match",
        n7: "done",
      },
      { note: "recovered" },
    ),
    tree(
      "Valid again",
      "Inorder 1 2 3 4 6 7. O(n) time, O(h) stack (or Morris for O(1)).",
      {
        n1: "match",
        n2: "match",
        n3: "match",
        n4: "match",
        n6: "match",
        n7: "match",
      },
    ),
  ];
}

export const validateBinarySearchTreeSolution: ProblemSolution = {
  approach:
    "DFS with bounds (lo, hi): node.val must be in (lo, hi); tighten for left/right. O(n) time, O(h) space.",
  templates: langs(
    `def isValidBST(root, lo=None, hi=None):
    if not root: return True
    if lo is not None and root.val <= lo: return False
    if hi is not None and root.val >= hi: return False
    return isValidBST(root.left, lo, root.val) and isValidBST(root.right, root.val, hi)`,
    `bool isValidBST(TreeNode* root, long lo = LONG_MIN, long hi = LONG_MAX) {
    if (!root) return true;
    if (root->val <= lo || root->val >= hi) return false;
    return isValidBST(root->left, lo, root->val) && isValidBST(root->right, root->val, hi);
}`,
    `boolean isValidBST(TreeNode root, long lo, long hi) {
    if (root == null) return true;
    if (root.val <= lo || root.val >= hi) return false;
    return isValidBST(root.left, lo, root.val) && isValidBST(root.right, root.val, hi);
}
boolean isValidBST(TreeNode root) {
    return isValidBST(root, Long.MIN_VALUE, Long.MAX_VALUE);
}`,
    `function isValidBST(root, lo = -Infinity, hi = Infinity) {
  if (!root) return true;
  if (root.val <= lo || root.val >= hi) return false;
  return isValidBST(root.left, lo, root.val) && isValidBST(root.right, root.val, hi);
}`,
  ),
  frames: validateFrames(),
};

export const minimumAbsoluteDifferenceInBSTSolution: ProblemSolution = {
  approach:
    "Inorder walk keeping previous value; update min |cur−prev|. Adjacent in sorted order give the global min gap. O(n) time.",
  templates: langs(
    `def getMinimumDifference(root):
    best, prev = float('inf'), None
    def inorder(n):
        nonlocal best, prev
        if not n: return
        inorder(n.left)
        if prev is not None:
            best = min(best, n.val - prev)
        prev = n.val
        inorder(n.right)
    inorder(root)
    return best`,
    `int getMinimumDifference(TreeNode* root) {
    int best = INT_MAX;
    TreeNode* prev = nullptr;
    function<void(TreeNode*)> inorder = [&](TreeNode* n) {
        if (!n) return;
        inorder(n->left);
        if (prev) best = min(best, n->val - prev->val);
        prev = n;
        inorder(n->right);
    };
    inorder(root);
    return best;
}`,
    `int best = Integer.MAX_VALUE;
Integer prev = null;
void inorder(TreeNode n) {
    if (n == null) return;
    inorder(n.left);
    if (prev != null) best = Math.min(best, n.val - prev);
    prev = n.val;
    inorder(n.right);
}
int getMinimumDifference(TreeNode root) {
    best = Integer.MAX_VALUE; prev = null;
    inorder(root);
    return best;
}`,
    `function getMinimumDifference(root) {
  let best = Infinity, prev = null;
  function inorder(n) {
    if (!n) return;
    inorder(n.left);
    if (prev !== null) best = Math.min(best, n.val - prev);
    prev = n.val;
    inorder(n.right);
  }
  inorder(root);
  return best;
}`,
  ),
  frames: minDiffFrames(),
};

export const recoverBinarySearchTreeSolution: ProblemSolution = {
  approach:
    "Inorder find two swapped nodes: on prev>cur, set first=prev (once) and second=cur (always). Swap first/second values. O(n) time, O(h) space.",
  templates: langs(
    `def recoverTree(root):
    first = second = prev = None
    def inorder(n):
        nonlocal first, second, prev
        if not n: return
        inorder(n.left)
        if prev and prev.val > n.val:
            if not first: first = prev
            second = n
        prev = n
        inorder(n.right)
    inorder(root)
    first.val, second.val = second.val, first.val`,
    `void recoverTree(TreeNode* root) {
    TreeNode *first = nullptr, *second = nullptr, *prev = nullptr;
    function<void(TreeNode*)> inorder = [&](TreeNode* n) {
        if (!n) return;
        inorder(n->left);
        if (prev && prev->val > n->val) {
            if (!first) first = prev;
            second = n;
        }
        prev = n;
        inorder(n->right);
    };
    inorder(root);
    swap(first->val, second->val);
}`,
    `TreeNode first, second, prev;
void inorder(TreeNode n) {
    if (n == null) return;
    inorder(n.left);
    if (prev != null && prev.val > n.val) {
        if (first == null) first = prev;
        second = n;
    }
    prev = n;
    inorder(n.right);
}
void recoverTree(TreeNode root) {
    first = second = prev = null;
    inorder(root);
    int t = first.val; first.val = second.val; second.val = t;
}`,
    `function recoverTree(root) {
  let first = null, second = null, prev = null;
  function inorder(n) {
    if (!n) return;
    inorder(n.left);
    if (prev && prev.val > n.val) {
      if (!first) first = prev;
      second = n;
    }
    prev = n;
    inorder(n.right);
  }
  inorder(root);
  const t = first.val; first.val = second.val; second.val = t;
}`,
  ),
  frames: recoverFrames(),
};

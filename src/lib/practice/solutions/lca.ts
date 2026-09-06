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

function binaryTreeLCAFrames(): Frame[] {
  return [
    tree(
      "LCA(1, 7)",
      "Post-order search: if node is p or q, return it. If both sides nonempty, current is LCA.",
      { n1: "lo", n7: "hi" },
    ),
    tree(
      "Recurse from 4",
      "Left returns 1 (found), right returns 7 (found) → split at 4.",
      { n4: "active", n1: "lo", n7: "hi" },
      { note: "L && R → root" },
    ),
    tree(
      "LCA is 4",
      "Lowest node that has both as descendants (or is one of them).",
      { n4: "match", n1: "done", n7: "done" },
    ),
    tree(
      "LCA(1, 3)",
      "Both under 2. Left of 2 finds 1, right finds 3 → LCA = 2.",
      { n2: "match", n1: "lo", n3: "hi" },
    ),
    tree(
      "One under the other",
      "If q lies in p's subtree, first hit returns p — that is correct LCA.",
      { n2: "match", n1: "lo" },
      { note: "LCA(2,1) = 2" },
    ),
  ];
}

function bstLCAFrames(): Frame[] {
  return [
    tree(
      "BST LCA(1, 3)",
      "Use values: if both < root go left; both > root go right; else root splits them.",
      { n1: "lo", n3: "hi", n4: "active" },
    ),
    tree(
      "Both < 4",
      "1 and 3 are left of 4 → walk left to 2.",
      { n4: "done", n2: "active", n1: "lo", n3: "hi" },
    ),
    tree(
      "Split at 2",
      "1 < 2 < 3 → 2 is the LCA. No need to visit the rest of the tree.",
      { n2: "match", n1: "done", n3: "done" },
      { note: "LCA = 2" },
    ),
    tree(
      "LCA(3, 7)",
      "3 < 4 < 7 → root 4 is already the split.",
      { n4: "match", n3: "lo", n7: "hi" },
    ),
    tree(
      "Iterative walk",
      "While loop with the same comparisons — O(h) time, O(1) extra space.",
      { n4: "window" },
      { note: "BST property" },
    ),
  ];
}

function deepestLeavesLCAFrames(): Frame[] {
  return [
    tree(
      "Deepest leaves",
      "Leaves at max depth are 1, 3, 7. LCA of all of them is the answer.",
      { n1: "lo", n3: "lo", n7: "hi" },
    ),
    tree(
      "DFS returns (node, depth)",
      "At a node: compare left/right subtree depths of deepest leaves.",
      { n4: "active" },
      { note: "(lca, depth)" },
    ),
    tree(
      "Under 2",
      "Left and right deepest depths equal (leaves 1 and 3) → LCA under 2 is 2.",
      { n2: "match", n1: "done", n3: "done" },
      { note: "depth = 3" },
    ),
    tree(
      "Under 6",
      "Only leaf 7 → subtree answer is 7 at depth 3.",
      { n6: "window", n7: "match" },
    ),
    tree(
      "At root",
      "Left deepest depth == right deepest depth → LCA is 4 (covers 1,3,7).",
      { n4: "match", n1: "done", n3: "done", n7: "done" },
      { note: "LCA = 4" },
    ),
    tree(
      "If right deeper",
      "Prefer the deeper side's LCA. Equal depths → current node.",
      { n6: "hi", n2: "lo" },
      { note: "compare depths" },
    ),
  ];
}

export const lowestCommonAncestorOfABinaryTreeSolution: ProblemSolution = {
  approach:
    "DFS: return root if null/p/q. Recurse both sides; if both nonempty return root, else the nonempty side. O(n) time, O(h) space.",
  templates: langs(
    `def lowestCommonAncestor(root, p, q):
    if not root or root is p or root is q:
        return root
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
  frames: binaryTreeLCAFrames(),
};

export const lowestCommonAncestorOfABinarySearchTreeSolution: ProblemSolution = {
  approach:
    "Walk from root: if both values < node go left; both > node go right; else node is LCA. O(h) time, O(1) iterative.",
  templates: langs(
    `def lowestCommonAncestor(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root`,
    `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    while (root) {
        if (p->val < root->val && q->val < root->val) root = root->left;
        else if (p->val > root->val && q->val > root->val) root = root->right;
        else return root;
    }
    return nullptr;
}`,
    `TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    while (root != null) {
        if (p.val < root.val && q.val < root.val) root = root.left;
        else if (p.val > root.val && q.val > root.val) root = root.right;
        else return root;
    }
    return null;
}`,
    `function lowestCommonAncestor(root, p, q) {
  while (root) {
    if (p.val < root.val && q.val < root.val) root = root.left;
    else if (p.val > root.val && q.val > root.val) root = root.right;
    else return root;
  }
}`,
  ),
  frames: bstLCAFrames(),
};

export const lowestCommonAncestorOfDeepestLeavesSolution: ProblemSolution = {
  approach:
    "DFS returns (lca, depth). If left depth > right take left; if right deeper take right; if equal current node is LCA. O(n) time.",
  templates: langs(
    `def lcaDeepestLeaves(root):
    def dfs(n):
        if not n: return None, 0
        ln, ld = dfs(n.left)
        rn, rd = dfs(n.right)
        if ld > rd: return ln, ld + 1
        if rd > ld: return rn, rd + 1
        return n, ld + 1
    return dfs(root)[0]`,
    `pair<TreeNode*,int> dfs(TreeNode* n) {
    if (!n) return {nullptr, 0};
    auto [ln, ld] = dfs(n->left);
    auto [rn, rd] = dfs(n->right);
    if (ld > rd) return {ln, ld + 1};
    if (rd > ld) return {rn, rd + 1};
    return {n, ld + 1};
}
TreeNode* lcaDeepestLeaves(TreeNode* root) {
    return dfs(root).first;
}`,
    `class Pair { TreeNode node; int d; Pair(TreeNode n, int d){this.node=n;this.d=d;} }
Pair dfs(TreeNode n) {
    if (n == null) return new Pair(null, 0);
    Pair L = dfs(n.left), R = dfs(n.right);
    if (L.d > R.d) return new Pair(L.node, L.d + 1);
    if (R.d > L.d) return new Pair(R.node, R.d + 1);
    return new Pair(n, L.d + 1);
}
TreeNode lcaDeepestLeaves(TreeNode root) {
    return dfs(root).node;
}`,
    `function lcaDeepestLeaves(root) {
  function dfs(n) {
    if (!n) return [null, 0];
    const [ln, ld] = dfs(n.left);
    const [rn, rd] = dfs(n.right);
    if (ld > rd) return [ln, ld + 1];
    if (rd > ld) return [rn, rd + 1];
    return [n, ld + 1];
  }
  return dfs(root)[0];
}`,
  ),
  frames: deepestLeavesLCAFrames(),
};

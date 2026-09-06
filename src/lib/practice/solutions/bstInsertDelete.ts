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

function searchFrames(): Frame[] {
  return [
    tree(
      "Search 3",
      "Compare with root: 3 < 4 → go left. BST search is binary search on the tree.",
      { n4: "active" },
      { note: "target = 3" },
    ),
    tree(
      "At 2",
      "3 > 2 → go right.",
      { n4: "done", n2: "active" },
    ),
    tree(
      "Found 3",
      "Return this subtree root. Miss would hit null.",
      { n2: "done", n3: "match" },
      { note: "return node 3" },
    ),
    tree(
      "Search 5",
      "4 → right 6 → left null. Return null.",
      { n4: "window", n6: "window" },
      { note: "not found" },
    ),
    tree(
      "Complexity",
      "O(h) comparisons. Balanced → O(log n); skewed → O(n).",
      { n3: "match" },
    ),
  ];
}

function insertFrames(): Frame[] {
  const nodesWith5: TreeNode[] = [
    ...base.map((n) => ({
      ...n,
      tone: (n.id === "n4" || n.id === "n6" ? "done" : "idle") as CellTone,
    })),
    { id: "n5", label: "5", x: 62, y: 72, tone: "match" },
  ];
  return [
    tree(
      "Insert 5",
      "Walk like search until null link; attach new node there.",
      { n4: "active" },
      { note: "val = 5" },
    ),
    tree(
      "5 > 4 → right",
      "Compare with 6: 5 < 6 → go left of 6 (empty).",
      { n4: "done", n6: "active" },
    ),
    {
      kind: "tree",
      title: "Attach 5",
      caption: "Create TreeNode(5) as left child of 6. Return root unchanged.",
      treeNodes: nodesWith5,
      treeEdges: [...edges, { from: "n6", to: "n5" }],
      note: "inserted",
    },
    tree(
      "Duplicates",
      "Problem usually allows either side; pick a consistent branch (e.g. ≥ go right).",
      { n4: "window" },
    ),
    {
      kind: "tree",
      title: "Still a BST",
      caption: "Inorder remains sorted after insert. O(h) time.",
      treeNodes: nodesWith5.map((n) => ({
        ...n,
        tone: "match" as CellTone,
      })),
      treeEdges: [...edges, { from: "n6", to: "n5" }],
    },
  ];
}

function deleteFrames(): Frame[] {
  const without3: TreeNode[] = base.filter((n) => n.id !== "n3");
  const without3Edges = edges.filter((e) => e.to !== "n3");
  const afterDelete2: TreeNode[] = [
    { id: "n4", label: "4", x: 50, y: 14 },
    { id: "n3", label: "3", x: 28, y: 42 },
    { id: "n6", label: "6", x: 72, y: 42 },
    { id: "n1", label: "1", x: 14, y: 72 },
    { id: "n7", label: "7", x: 86, y: 72 },
  ];
  const afterEdges = [
    { from: "n4", to: "n3" },
    { from: "n4", to: "n6" },
    { from: "n3", to: "n1" },
    { from: "n6", to: "n7" },
  ];
  return [
    tree(
      "Delete cases",
      "0 children: null out link. 1 child: splice child up. 2 children: replace with inorder successor.",
      {},
    ),
    tree(
      "Delete leaf 3",
      "Find 3; both children null → parent.right = null.",
      { n3: "hi", n2: "active" },
    ),
    tree(
      "After leaf delete",
      "Node 2 now has only left child 1.",
      { n2: "match", n1: "done" },
      {},
      without3,
      without3Edges,
    ),
    tree(
      "Delete 2 (two kids)",
      "Successor = min of right subtree = 3. Copy 3 into 2, then delete successor node.",
      { n2: "hi", n3: "lo" },
      { note: "successor = 3" },
    ),
    tree(
      "Replaced",
      "Value 3 sits where 2 was; old leaf 3 removed. BST order preserved.",
      { n3: "match", n1: "done", n4: "done" },
      { note: "deleted 2" },
      afterDelete2,
      afterEdges,
    ),
  ];
}

export const searchInABinarySearchTreeSolution: ProblemSolution = {
  approach:
    "While root: if val equals return node; if val < root go left else go right. O(h) time, O(1) iterative.",
  templates: langs(
    `def searchBST(root, val):
    while root and root.val != val:
        root = root.left if val < root.val else root.right
    return root`,
    `TreeNode* searchBST(TreeNode* root, int val) {
    while (root && root->val != val)
        root = val < root->val ? root->left : root->right;
    return root;
}`,
    `TreeNode searchBST(TreeNode root, int val) {
    while (root != null && root.val != val)
        root = val < root.val ? root.left : root.right;
    return root;
}`,
    `function searchBST(root, val) {
  while (root && root.val !== val)
    root = val < root.val ? root.left : root.right;
  return root;
}`,
  ),
  frames: searchFrames(),
};

export const insertIntoABinarySearchTreeSolution: ProblemSolution = {
  approach:
    "Recurse/iterate to the null child link by BST compare, then attach new node. O(h) time.",
  templates: langs(
    `def insertIntoBST(root, val):
    if not root: return TreeNode(val)
    if val < root.val: root.left = insertIntoBST(root.left, val)
    else: root.right = insertIntoBST(root.right, val)
    return root`,
    `TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insertIntoBST(root->left, val);
    else root->right = insertIntoBST(root->right, val);
    return root;
}`,
    `TreeNode insertIntoBST(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insertIntoBST(root.left, val);
    else root.right = insertIntoBST(root.right, val);
    return root;
}`,
    `function insertIntoBST(root, val) {
  if (!root) return { val, left: null, right: null };
  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else root.right = insertIntoBST(root.right, val);
  return root;
}`,
  ),
  frames: insertFrames(),
};

export const deleteNodeInABSTSolution: ProblemSolution = {
  approach:
    "Find node. 0/1 child: return the other child. 2 children: copy inorder successor value, delete successor. O(h) time.",
  templates: langs(
    `def deleteNode(root, key):
    if not root: return None
    if key < root.val: root.left = deleteNode(root.left, key)
    elif key > root.val: root.right = deleteNode(root.right, key)
    else:
        if not root.left: return root.right
        if not root.right: return root.left
        succ = root.right
        while succ.left: succ = succ.left
        root.val = succ.val
        root.right = deleteNode(root.right, succ.val)
    return root`,
    `TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;
    if (key < root->val) root->left = deleteNode(root->left, key);
    else if (key > root->val) root->right = deleteNode(root->right, key);
    else {
        if (!root->left) return root->right;
        if (!root->right) return root->left;
        TreeNode* succ = root->right;
        while (succ->left) succ = succ->left;
        root->val = succ->val;
        root->right = deleteNode(root->right, succ->val);
    }
    return root;
}`,
    `TreeNode deleteNode(TreeNode root, int key) {
    if (root == null) return null;
    if (key < root.val) root.left = deleteNode(root.left, key);
    else if (key > root.val) root.right = deleteNode(root.right, key);
    else {
        if (root.left == null) return root.right;
        if (root.right == null) return root.left;
        TreeNode succ = root.right;
        while (succ.left != null) succ = succ.left;
        root.val = succ.val;
        root.right = deleteNode(root.right, succ.val);
    }
    return root;
}`,
    `function deleteNode(root, key) {
  if (!root) return null;
  if (key < root.val) root.left = deleteNode(root.left, key);
  else if (key > root.val) root.right = deleteNode(root.right, key);
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let succ = root.right;
    while (succ.left) succ = succ.left;
    root.val = succ.val;
    root.right = deleteNode(root.right, succ.val);
  }
  return root;
}`,
  ),
  frames: deleteFrames(),
};

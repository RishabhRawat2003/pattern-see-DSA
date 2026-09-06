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

function iteratorFrames(): Frame[] {
  return [
    tree(
      "BSTIterator",
      "Controlled inorder: stack holds the path to the next smallest. Amortized O(1) next.",
      {},
      { cells: [{ value: "st: []", tone: "idle" }] },
    ),
    tree(
      "Constructor push-left",
      "From root, push 4,2,1. Stack top is the next value.",
      { n4: "window", n2: "window", n1: "active" },
      { cells: [{ value: "st: 4,2,1", tone: "active" }], note: "next = 1" },
    ),
    tree(
      "next() → 1",
      "Pop 1; push-left on its right (null). Return 1.",
      { n1: "match" },
      { cells: [{ value: "st: 4,2", tone: "window" }], note: "return 1" },
    ),
    tree(
      "next() → 2",
      "Pop 2; push-left on right child 3 → stack [4,3].",
      { n1: "done", n2: "match", n3: "window" },
      { cells: [{ value: "st: 4,3", tone: "window" }], note: "return 2" },
    ),
    tree(
      "next() → 3",
      "Pop 3; no right. Then next pops 4, and so on through 6,7.",
      { n1: "done", n2: "done", n3: "match", n4: "window" },
      { cells: [{ value: "st: 4", tone: "window" }], note: "return 3" },
    ),
    tree(
      "hasNext",
      "True while stack nonempty. Space O(h) — never stores the full inorder list.",
      {
        n1: "done",
        n2: "done",
        n3: "done",
        n4: "done",
        n6: "done",
        n7: "done",
      },
    ),
  ];
}

function validateInorderFrames(): Frame[] {
  return [
    tree(
      "Validate via inorder",
      "BST ⇔ inorder strictly increasing. Keep prev; fail if cur ≤ prev.",
      {},
      { note: "prev = null" },
    ),
    tree(
      "See 1",
      "prev null → OK. prev = 1.",
      { n1: "active" },
      { note: "prev = 1" },
    ),
    tree(
      "See 2",
      "1 < 2. OK. prev = 2.",
      { n1: "done", n2: "active" },
      { note: "prev = 2" },
    ),
    tree(
      "See 3,4,…",
      "Each visit checks against prev. Same O(n) as bounds DFS.",
      { n2: "done", n3: "active", n4: "window" },
    ),
    tree(
      "Failure case",
      "If any cur ≤ prev, return false immediately.",
      { n3: "skip", n6: "hi" },
      { note: "cur ≤ prev → false" },
    ),
    tree(
      "All good",
      "Finished inorder with strict increases → valid BST.",
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

function kthInorderFrames(): Frame[] {
  return [
    tree(
      "kth via inorder",
      "Same stack/recursive inorder as the iterator — stop when count hits k.",
      {},
      { note: "k = 3" },
    ),
    tree(
      "Count 1",
      "First inorder visit.",
      { n1: "active" },
      { note: "count = 1" },
    ),
    tree(
      "Count 2",
      "Second visit.",
      { n1: "done", n2: "active" },
      { note: "count = 2" },
    ),
    tree(
      "Count 3 → answer",
      "Return 3. Early exit — do not finish the tree.",
      { n1: "done", n2: "done", n3: "match" },
      { note: "return 3" },
    ),
    tree(
      "Link to iterator",
      "Calling next() k times on BSTIterator is the same idea.",
      { n3: "match" },
      { note: "shared pattern" },
    ),
  ];
}

export const bstIteratorSolution: ProblemSolution = {
  approach:
    "Stack of left spine. next: pop, push-left on right child. hasNext: stack nonempty. Amortized O(1) next, O(h) space.",
  templates: langs(
    `class BSTIterator:
    def __init__(self, root):
        self.st = []
        self._push(root)
    def _push(self, n):
        while n:
            self.st.append(n)
            n = n.left
    def next(self):
        n = self.st.pop()
        self._push(n.right)
        return n.val
    def hasNext(self):
        return bool(self.st)`,
    `class BSTIterator {
    vector<TreeNode*> st;
    void push(TreeNode* n) {
        while (n) { st.push_back(n); n = n->left; }
    }
public:
    BSTIterator(TreeNode* root) { push(root); }
    int next() {
        TreeNode* n = st.back(); st.pop_back();
        push(n->right);
        return n->val;
    }
    bool hasNext() { return !st.empty(); }
};`,
    `class BSTIterator {
    Deque<TreeNode> st = new ArrayDeque<>();
    void push(TreeNode n) {
        while (n != null) { st.push(n); n = n.left; }
    }
    public BSTIterator(TreeNode root) { push(root); }
    public int next() {
        TreeNode n = st.pop();
        push(n.right);
        return n.val;
    }
    public boolean hasNext() { return !st.isEmpty(); }
}`,
    `class BSTIterator {
  constructor(root) {
    this.st = [];
    this.push(root);
  }
  push(n) {
    while (n) { this.st.push(n); n = n.left; }
  }
  next() {
    const n = this.st.pop();
    this.push(n.right);
    return n.val;
  }
  hasNext() { return this.st.length > 0; }
}`,
  ),
  frames: iteratorFrames(),
};

export const validateBSTInorderSolution: ProblemSolution = {
  approach:
    "Inorder traversal with a previous pointer: each value must be > prev. O(n) time, O(h) space.",
  templates: langs(
    `def isValidBST(root):
    prev = None
    def inorder(n):
        nonlocal prev
        if not n: return True
        if not inorder(n.left): return False
        if prev is not None and n.val <= prev: return False
        prev = n.val
        return inorder(n.right)
    return inorder(root)`,
    `bool isValidBST(TreeNode* root) {
    long prev = LONG_MIN;
    function<bool(TreeNode*)> inorder = [&](TreeNode* n) {
        if (!n) return true;
        if (!inorder(n->left)) return false;
        if (n->val <= prev) return false;
        prev = n->val;
        return inorder(n->right);
    };
    return inorder(root);
}`,
    `long prev = Long.MIN_VALUE;
boolean inorder(TreeNode n) {
    if (n == null) return true;
    if (!inorder(n.left)) return false;
    if (n.val <= prev) return false;
    prev = n.val;
    return inorder(n.right);
}
boolean isValidBST(TreeNode root) {
    prev = Long.MIN_VALUE;
    return inorder(root);
}`,
    `function isValidBST(root) {
  let prev = -Infinity;
  function inorder(n) {
    if (!n) return true;
    if (!inorder(n.left)) return false;
    if (n.val <= prev) return false;
    prev = n.val;
    return inorder(n.right);
  }
  return inorder(root);
}`,
  ),
  frames: validateInorderFrames(),
};

export const kthSmallestInorderSolution: ProblemSolution = {
  approach:
    "Inorder (stack or recursion) counting visits; return the k-th visited value. O(h+k) time, O(h) space.",
  templates: langs(
    `def kthSmallest(root, k):
    st, cur = [], root
    while True:
        while cur:
            st.append(cur)
            cur = cur.left
        cur = st.pop()
        k -= 1
        if k == 0: return cur.val
        cur = cur.right`,
    `int kthSmallest(TreeNode* root, int k) {
    vector<TreeNode*> st;
    TreeNode* cur = root;
    while (true) {
        while (cur) { st.push_back(cur); cur = cur->left; }
        cur = st.back(); st.pop_back();
        if (--k == 0) return cur->val;
        cur = cur->right;
    }
}`,
    `int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> st = new ArrayDeque<>();
    TreeNode cur = root;
    while (true) {
        while (cur != null) { st.push(cur); cur = cur.left; }
        cur = st.pop();
        if (--k == 0) return cur.val;
        cur = cur.right;
    }
}`,
    `function kthSmallest(root, k) {
  const st = [];
  let cur = root;
  while (true) {
    while (cur) { st.push(cur); cur = cur.left; }
    cur = st.pop();
    if (--k === 0) return cur.val;
    cur = cur.right;
  }
}`,
  ),
  frames: kthInorderFrames(),
};

import type { PracticePack } from "../types";
import { gfg, langs, lc, pack } from "./helpers";
import {
  activitySelectionGfgSolution,
  minArrowsActivitySolution,
  nonOverlappingActivitySolution,
} from "./solutions/activitySelection";
import {
  balancedBinaryTreeBalancedSolution,
  maxDepthBalancedSolution,
  sortedArrayToBSTSolution,
} from "./solutions/balancedTree";
import {
  binaryTreeLevelOrderTraversalIISolution,
  binaryTreeLevelOrderTraversalSolution,
  binaryTreeRightSideViewSolution,
} from "./solutions/bfsLevelOrder";
import {
  flowerPlantingWithNoAdjacentSolution,
  isGraphBipartiteSolution,
  possibleBipartitionSolution,
} from "./solutions/bipartite";
import {
  deleteNodeInABSTSolution,
  insertIntoABinarySearchTreeSolution,
  searchInABinarySearchTreeSolution,
} from "./solutions/bstInsertDelete";
import {
  minimumAbsoluteDifferenceInBSTSolution,
  recoverBinarySearchTreeSolution,
  validateBinarySearchTreeSolution,
} from "./solutions/bstValidation";
import {
  combinationSumIISolution,
  combinationSumIIISolution,
  combinationSumL2Solution,
} from "./solutions/combinationSumL2";
import {
  findIfPathExistsSolution,
  numberOfIslandsCCSolution,
  numberOfProvincesSolution,
} from "./solutions/connectedComponents";
import {
  binaryTreeInorderTraversalSolution,
  binaryTreePostorderTraversalSolution,
  binaryTreePreorderTraversalSolution,
} from "./solutions/dfsTraversals";
import {
  cloneGraphSolution,
  maxAreaOfIslandSolution,
  numberOfIslandsSolution,
} from "./solutions/graphBfsDfs";
import {
  courseScheduleIISolution,
  courseScheduleSolution,
  findEventualSafeStatesSolution,
} from "./solutions/graphCycle";
import {
  reorganizeStringSolution,
  sortByFrequencyHeapSolution,
  topKFrequentHeapSolution,
} from "./solutions/heapHashmap";
import {
  balancedBinaryTreeSolution,
  diameterOfBinaryTreeSolution,
  maximumDepthOfBinaryTreeSolution,
} from "./solutions/heightDiameter";
import {
  bstIteratorSolution,
  kthSmallestInorderSolution,
  validateBSTInorderSolution,
} from "./solutions/inorderLogic";
import {
  maxLengthOfPairChainSolution,
  minArrowsScheduleSolution,
  nonOverlappingScheduleSolution,
} from "./solutions/intervalScheduling";
import {
  courseScheduleIIISolution,
  jobSequencingGfgSolution,
  maxProfitJobSchedulingSolution,
} from "./solutions/jobSequencing";
import {
  kthLargestArraySolution,
  kthLargestStreamSolution,
  thirdMaximumSolution,
} from "./solutions/kthLargest";
import {
  kthLargestElementInAnArraySolution,
  kthSmallestElementInABSTSolution,
  kthSmallestElementInASortedMatrixSolution,
} from "./solutions/kthSmallest";
import {
  lowestCommonAncestorOfABinarySearchTreeSolution,
  lowestCommonAncestorOfABinaryTreeSolution,
  lowestCommonAncestorOfDeepestLeavesSolution,
} from "./solutions/lca";
import {
  insertIntervalSolution,
  mergeIntervalsSolution,
  nonOverlappingMergeSolution,
} from "./solutions/mergeIntervals";
import {
  kthSmallestInSortedMatrixSolution,
  mergeKListsMergeKSolution,
  smallestRangeCoveringKListsSolution,
} from "./solutions/mergeKLists";
import {
  carPoolingPlatformsSolution,
  meetingRoomsIISolution,
  minimumPlatformsSolution,
} from "./solutions/minimumPlatforms";
import {
  nQueensIISolution,
  nQueensSolution,
  sudokuSolverNQueensPackSolution,
} from "./solutions/nQueens";
import {
  pathSumIISolution,
  pathSumIIISolution,
  pathSumSolution,
} from "./solutions/pathSumL2";
import {
  nextPermutationSolution,
  permutationsIISolution,
  permutationsL2Solution,
} from "./solutions/permutationsL2";
import {
  letterCasePermutationSolution,
  subsetsIISolution,
  subsetsL2Solution,
} from "./solutions/subsetsL2";
import {
  nQueensFromSudokuSolution,
  sudokuSolverSolution,
  validSudokuSolution,
} from "./solutions/sudokuSolver";
import {
  kClosestPointsToOriginSolution,
  kthLargestTopKSolution,
  topKFrequentTopKSolution,
} from "./solutions/topK";

export const level2Practice: Record<string, PracticePack> = {
  "dfs-traversals": pack(
    "Pre/in/post: visit node vs children order. Recursion stack = path.",
    langs(
      `def inorder(root, out=None):
    if out is None:
        out = []
    if root:
        inorder(root.left, out)
        out.append(root.val)
        inorder(root.right, out)
    return out`,
      `vector<int> inorder(TreeNode* root) {
    vector<int> out;
    function<void(TreeNode*)> walk = [&](TreeNode* n) {
        if (!n) return;
        walk(n->left);
        out.push_back(n->val);
        walk(n->right);
    };
    walk(root);
    return out;
}`,
      `List<Integer> inorder(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    walk(root, out);
    return out;
}
void walk(TreeNode n, List<Integer> out) {
    if (n == null) return;
    walk(n.left, out);
    out.add(n.val);
    walk(n.right, out);
}`,
      `function inorder(root, out = []) {
  if (root) {
    inorder(root.left, out);
    out.push(root.val);
    inorder(root.right, out);
  }
  return out;
}`,
    ),
    lc("binary-tree-inorder-traversal", "Inorder Traversal", "Easy", binaryTreeInorderTraversalSolution),
    lc("binary-tree-preorder-traversal", "Preorder Traversal", "Easy", binaryTreePreorderTraversalSolution),
    lc("binary-tree-postorder-traversal", "Postorder Traversal", "Easy", binaryTreePostorderTraversalSolution),
  ),
  "bfs-level-order": pack(
    "Queue of nodes; drain one level at a time.",
    langs(
      `from collections import deque

def level_order(root):
    if not root:
        return []
    q, out = deque([root]), []
    while q:
        level = []
        for _ in range(len(q)):
            n = q.popleft()
            level.append(n.val)
            if n.left: q.append(n.left)
            if n.right: q.append(n.right)
        out.append(level)
    return out`,
      `vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> out;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = (int)q.size();
        vector<int> level;
        for (int i = 0; i < sz; i++) {
            TreeNode* n = q.front(); q.pop();
            level.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        out.push_back(level);
    }
    return out;
}`,
      `List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> out = new ArrayList<>();
    if (root == null) return out;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.add(root);
    while (!q.isEmpty()) {
        int sz = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < sz; i++) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null) q.add(n.left);
            if (n.right != null) q.add(n.right);
        }
        out.add(level);
    }
    return out;
}`,
      `function levelOrder(root) {
  if (!root) return [];
  const q = [root], out = [];
  while (q.length) {
    const level = [];
    const sz = q.length;
    for (let i = 0; i < sz; i++) {
      const n = q.shift();
      level.push(n.val);
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
    out.push(level);
  }
  return out;
}`,
    ),
    lc("binary-tree-level-order-traversal", "Level Order", "Medium", binaryTreeLevelOrderTraversalSolution),
    lc("binary-tree-level-order-traversal-ii", "Level Order II", "Medium", binaryTreeLevelOrderTraversalIISolution),
    lc("binary-tree-right-side-view", "Right Side View", "Medium", binaryTreeRightSideViewSolution),
  ),
  "height-diameter": pack(
    "Height of node = 1 + max(left, right). Diameter uses heights of both sides.",
    langs(
      `def diameter(root):
    best = 0
    def height(n):
        nonlocal best
        if not n:
            return 0
        L, R = height(n.left), height(n.right)
        best = max(best, L + R)
        return 1 + max(L, R)
    height(root)
    return best`,
      `int diameter(TreeNode* root) {
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
int diameter(TreeNode root) {
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
      `function diameter(root) {
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
    lc("maximum-depth-of-binary-tree", "Max Depth", "Easy", maximumDepthOfBinaryTreeSolution),
    lc("diameter-of-binary-tree", "Diameter", "Easy", diameterOfBinaryTreeSolution),
    lc("balanced-binary-tree", "Balanced Binary Tree", "Easy", balancedBinaryTreeSolution),
  ),
  "balanced-tree": pack(
    "Return height or -1 if a subtree is unbalanced (|L-R|>1).",
    langs(
      `def is_balanced(root):
    def walk(n):
        if not n:
            return 0
        L, R = walk(n.left), walk(n.right)
        if L < 0 or R < 0 or abs(L - R) > 1:
            return -1
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
    lc("balanced-binary-tree", "Balanced Binary Tree", "Easy", balancedBinaryTreeBalancedSolution),
    lc("convert-sorted-array-to-binary-search-tree", "Sorted Array to BST", "Easy", sortedArrayToBSTSolution),
    lc("maximum-depth-of-binary-tree", "Max Depth", "Easy", maxDepthBalancedSolution),
  ),
  lca: pack(
    "If p and q are in different subtrees, node is LCA. BST: walk by value.",
    langs(
      `def lca(root, p, q):
    if not root or root is p or root is q:
        return root
    L = lca(root.left, p, q)
    R = lca(root.right, p, q)
    return root if L and R else L or R`,
      `TreeNode* lca(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* L = lca(root->left, p, q);
    TreeNode* R = lca(root->right, p, q);
    return (L && R) ? root : (L ? L : R);
}`,
      `TreeNode lca(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode L = lca(root.left, p, q);
    TreeNode R = lca(root.right, p, q);
    return (L != null && R != null) ? root : (L != null ? L : R);
}`,
      `function lca(root, p, q) {
  if (!root || root === p || root === q) return root;
  const L = lca(root.left, p, q);
  const R = lca(root.right, p, q);
  return L && R ? root : L || R;
}`,
    ),
    lc("lowest-common-ancestor-of-a-binary-tree", "LCA of Binary Tree", "Medium", lowestCommonAncestorOfABinaryTreeSolution),
    lc("lowest-common-ancestor-of-a-binary-search-tree", "LCA of BST", "Medium", lowestCommonAncestorOfABinarySearchTreeSolution),
    lc("lowest-common-ancestor-of-deepest-leaves", "LCA of Deepest Leaves", "Medium", lowestCommonAncestorOfDeepestLeavesSolution),
  ),
  "path-sum": pack(
    "Carry remaining target down; record when a leaf hits 0.",
    langs(
      `def has_path_sum(root, target):
    if not root:
        return False
    rest = target - root.val
    if not root.left and not root.right:
        return rest == 0
    return has_path_sum(root.left, rest) or has_path_sum(root.right, rest)`,
      `bool hasPathSum(TreeNode* root, int target) {
    if (!root) return false;
    int rest = target - root->val;
    if (!root->left && !root->right) return rest == 0;
    return hasPathSum(root->left, rest) || hasPathSum(root->right, rest);
}`,
      `boolean hasPathSum(TreeNode root, int target) {
    if (root == null) return false;
    int rest = target - root.val;
    if (root.left == null && root.right == null) return rest == 0;
    return hasPathSum(root.left, rest) || hasPathSum(root.right, rest);
}`,
      `function hasPathSum(root, target) {
  if (!root) return false;
  const rest = target - root.val;
  if (!root.left && !root.right) return rest === 0;
  return hasPathSum(root.left, rest) || hasPathSum(root.right, rest);
}`,
    ),
    lc("path-sum", "Path Sum", "Easy", pathSumSolution),
    lc("path-sum-ii", "Path Sum II", "Medium", pathSumIISolution),
    lc("path-sum-iii", "Path Sum III", "Medium", pathSumIIISolution),
  ),
  "bst-validation": pack(
    "Each node must lie in (low, high). Tighten bounds as you descend.",
    langs(
      `def is_valid_bst(root, lo=None, hi=None):
    if not root:
        return True
    if lo is not None and root.val <= lo:
        return False
    if hi is not None and root.val >= hi:
        return False
    return is_valid_bst(root.left, lo, root.val) and is_valid_bst(root.right, root.val, hi)`,
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
    lc("validate-binary-search-tree", "Validate BST", "Medium", validateBinarySearchTreeSolution),
    lc("minimum-absolute-difference-in-bst", "Min Abs Difference", "Easy", minimumAbsoluteDifferenceInBSTSolution),
    lc("recover-binary-search-tree", "Recover BST", "Medium", recoverBinarySearchTreeSolution),
  ),
  "bst-insert-delete": pack(
    "Walk by compare. Delete: 0/1 child splice, 2 children → inorder successor.",
    langs(
      `def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root`,
      `TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insert(root->left, val);
    else root->right = insert(root->right, val);
    return root;
}`,
      `TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else root.right = insert(root.right, val);
    return root;
}`,
      `function insert(root, val) {
  if (!root) return { val, left: null, right: null };
  if (val < root.val) root.left = insert(root.left, val);
  else root.right = insert(root.right, val);
  return root;
}`,
    ),
    lc("search-in-a-binary-search-tree", "Search in BST", "Easy", searchInABinarySearchTreeSolution),
    lc("insert-into-a-binary-search-tree", "Insert into BST", "Medium", insertIntoABinarySearchTreeSolution),
    lc("delete-node-in-a-bst", "Delete Node in BST", "Medium", deleteNodeInABSTSolution),
  ),
  "kth-smallest": pack(
    "Inorder of a BST is sorted. Count until k.",
    langs(
      `def kth_smallest(root, k):
    st, cur = [], root
    while True:
        while cur:
            st.append(cur)
            cur = cur.left
        cur = st.pop()
        k -= 1
        if k == 0:
            return cur.val
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
    lc("kth-smallest-element-in-a-bst", "Kth Smallest in BST", "Medium", kthSmallestElementInABSTSolution),
    lc("kth-largest-element-in-an-array", "Kth Largest in Array", "Medium", kthLargestElementInAnArraySolution),
    lc("kth-smallest-element-in-a-sorted-matrix", "Kth Smallest in Matrix", "Medium", kthSmallestElementInASortedMatrixSolution),
  ),
  "inorder-logic": pack(
    "BST problems that become array problems if you inorder-walk.",
    langs(
      `def bst_iterator(root):
    st = []
    def push(n):
        while n:
            st.append(n)
            n = n.left
    push(root)
    def next():
        n = st.pop()
        push(n.right)
        return n.val
    return next`,
      `vector<TreeNode*> st;
void push(TreeNode* n) {
    while (n) { st.push_back(n); n = n->left; }
}
int next() {
    TreeNode* n = st.back(); st.pop_back();
    push(n->right);
    return n->val;
}`,
      `Deque<TreeNode> st = new ArrayDeque<>();
void push(TreeNode n) {
    while (n != null) { st.push(n); n = n.left; }
}
int next() {
    TreeNode n = st.pop();
    push(n.right);
    return n.val;
}`,
      `function bstIterator(root) {
  const st = [];
  function push(n) {
    while (n) { st.push(n); n = n.left; }
  }
  push(root);
  return function next() {
    const n = st.pop();
    push(n.right);
    return n.val;
  };
}`,
    ),
    lc("binary-search-tree-iterator", "BST Iterator", "Medium", bstIteratorSolution),
    lc("validate-binary-search-tree", "Validate BST", "Medium", validateBSTInorderSolution),
    lc("kth-smallest-element-in-a-bst", "Kth Smallest in BST", "Medium", kthSmallestInorderSolution),
  ),
  "top-k": pack(
    "Min-heap of size k, or count + heap / quickselect.",
    langs(
      `import heapq
from collections import Counter

def top_k(nums, k):
    freq = Counter(nums)
    return heapq.nlargest(k, freq, key=freq.get)`,
      `vector<int> topK(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int x : nums) freq[x]++;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> h;
    for (auto [x, c] : freq) {
        h.push({c, x});
        if ((int)h.size() > k) h.pop();
    }
    vector<int> out;
    while (!h.empty()) { out.push_back(h.top().second); h.pop(); }
    return out;
}`,
      `int[] topK(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
    PriorityQueue<Integer> h = new PriorityQueue<>((a, b) -> freq.get(a) - freq.get(b));
    for (int x : freq.keySet()) {
        h.offer(x);
        if (h.size() > k) h.poll();
    }
    int[] out = new int[k];
    for (int i = k - 1; i >= 0; i--) out[i] = h.poll();
    return out;
}`,
      `function topK(nums, k) {
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);
  return [...freq.keys()].sort((a, b) => freq.get(b) - freq.get(a)).slice(0, k);
}`,
    ),
    lc("top-k-frequent-elements", "Top K Frequent", "Medium", topKFrequentTopKSolution),
    lc("kth-largest-element-in-an-array", "Kth Largest", "Medium", kthLargestTopKSolution),
    lc("k-closest-points-to-origin", "K Closest Points", "Medium", kClosestPointsToOriginSolution),
  ),
  "kth-largest": pack(
    "Min-heap of k largest. Root is the kth.",
    langs(
      `import heapq

def kth_largest(a, k):
    heap = a[:k]
    heapq.heapify(heap)
    for x in a[k:]:
        if x > heap[0]:
            heapq.heapreplace(heap, x)
    return heap[0]`,
      `int kthLargest(vector<int>& a, int k) {
    priority_queue<int, vector<int>, greater<int>> h(a.begin(), a.begin() + k);
    for (int i = k; i < (int)a.size(); i++) {
        if (a[i] > h.top()) { h.pop(); h.push(a[i]); }
    }
    return h.top();
}`,
      `int kthLargest(int[] a, int k) {
    PriorityQueue<Integer> h = new PriorityQueue<>();
    for (int i = 0; i < k; i++) h.offer(a[i]);
    for (int i = k; i < a.length; i++) {
        if (a[i] > h.peek()) { h.poll(); h.offer(a[i]); }
    }
    return h.peek();
}`,
      `function kthLargest(a, k) {
  const heap = a.slice(0, k).sort((x, y) => x - y);
  for (let i = k; i < a.length; i++) {
    if (a[i] > heap[0]) {
      heap[0] = a[i];
      heap.sort((x, y) => x - y);
    }
  }
  return heap[0];
}`,
    ),
    lc("kth-largest-element-in-an-array", "Kth Largest in Array", "Medium", kthLargestArraySolution),
    lc("kth-largest-element-in-a-stream", "Kth Largest in Stream", "Easy", kthLargestStreamSolution),
    lc("third-maximum-number", "Third Maximum Number", "Easy", thirdMaximumSolution),
  ),
  "merge-k-lists": pack(
    "Heap of current heads. Pop min, push that list's next.",
    langs(
      `import heapq

def merge_k(lists):
    h = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(h, (node.val, i, node))
    dummy = cur = ListNode(0)
    while h:
        _, i, node = heapq.heappop(h)
        cur.next = node
        cur = cur.next
        if node.next:
            heapq.heappush(h, (node.next.val, i, node.next))
    return dummy.next`,
      `ListNode* mergeK(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> h(cmp);
    for (auto node : lists) if (node) h.push(node);
    ListNode dummy(0), *cur = &dummy;
    while (!h.empty()) {
        ListNode* node = h.top(); h.pop();
        cur->next = node; cur = cur->next;
        if (node->next) h.push(node->next);
    }
    return dummy.next;
}`,
      `ListNode mergeK(ListNode[] lists) {
    PriorityQueue<ListNode> h = new PriorityQueue<>((a, b) -> a.val - b.val);
    for (ListNode node : lists) if (node != null) h.offer(node);
    ListNode dummy = new ListNode(0), cur = dummy;
    while (!h.isEmpty()) {
        ListNode node = h.poll();
        cur.next = node; cur = cur.next;
        if (node.next != null) h.offer(node.next);
    }
    return dummy.next;
}`,
      `function mergeK(lists) {
  const h = lists.filter(Boolean);
  const dummy = { val: 0, next: null };
  let cur = dummy;
  while (h.length) {
    h.sort((a, b) => a.val - b.val);
    const node = h.shift();
    cur.next = node; cur = cur.next;
    if (node.next) h.push(node.next);
  }
  return dummy.next;
}`,
    ),
    lc("merge-k-sorted-lists", "Merge k Sorted Lists", "Hard", mergeKListsMergeKSolution),
    lc("kth-smallest-element-in-a-sorted-matrix", "Kth Smallest in Matrix", "Medium", kthSmallestInSortedMatrixSolution),
    lc("smallest-range-covering-elements-from-k-lists", "Smallest Range k Lists", "Hard", smallestRangeCoveringKListsSolution),
  ),
  "heap-hashmap": pack(
    "Count frequencies, heap by count (reorganize, top-k, greedy pick).",
    langs(
      `import heapq
from collections import Counter

def reorganize(s):
    h = [(-c, ch) for ch, c in Counter(s).items()]
    heapq.heapify(h)
    # always pop most frequent that isn't last used
    return h`,
      `vector<pair<int,char>> reorganize(string s) {
    unordered_map<char,int> freq;
    for (char ch : s) freq[ch]++;
    priority_queue<pair<int,char>> h;
    for (auto [ch, c] : freq) h.push({c, ch});
    // always pop most frequent that isn't last used
    vector<pair<int,char>> out;
    while (!h.empty()) { out.push_back(h.top()); h.pop(); }
    return out;
}`,
      `PriorityQueue<int[]> reorganize(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    for (char ch : s.toCharArray()) freq.put(ch, freq.getOrDefault(ch, 0) + 1);
    PriorityQueue<int[]> h = new PriorityQueue<>((a, b) -> b[0] - a[0]);
    for (var e : freq.entrySet()) h.offer(new int[]{e.getValue(), e.getKey()});
    // always pop most frequent that isn't last used
    return h;
}`,
      `function reorganize(s) {
  const freq = new Map();
  for (const ch of s) freq.set(ch, (freq.get(ch) || 0) + 1);
  const h = [...freq.entries()].map(([ch, c]) => [-c, ch]);
  h.sort((a, b) => a[0] - b[0]);
  // always pop most frequent that isn't last used
  return h;
}`,
    ),
    lc("top-k-frequent-elements", "Top K Frequent", "Medium", topKFrequentHeapSolution),
    lc("sort-characters-by-frequency", "Sort by Frequency", "Medium", sortByFrequencyHeapSolution),
    lc("reorganize-string", "Reorganize String", "Medium", reorganizeStringSolution),
  ),
  "activity-selection": pack(
    "Sort by finish time. Take if start >= last finish.",
    langs(
      `def max_activities(intervals):
    intervals.sort(key=lambda x: x[1])
    taken, end = 0, -10**18
    for s, e in intervals:
        if s >= end:
            taken += 1
            end = e
    return taken`,
      `int maxActivities(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), [](auto& a, auto& b) { return a[1] < b[1]; });
    int taken = 0; long long end = LLONG_MIN;
    for (auto& iv : intervals) {
        if (iv[0] >= end) { taken++; end = iv[1]; }
    }
    return taken;
}`,
      `int maxActivities(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
    int taken = 0; long end = Long.MIN_VALUE;
    for (int[] iv : intervals) {
        if (iv[0] >= end) { taken++; end = iv[1]; }
    }
    return taken;
}`,
      `function maxActivities(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let taken = 0, end = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= end) { taken++; end = e; }
  }
  return taken;
}`,
    ),
    gfg("activity-selection-problem-greedy-algo-1", "Activity Selection", "Medium", activitySelectionGfgSolution),
    lc("non-overlapping-intervals", "Non-overlapping Intervals", "Medium", nonOverlappingActivitySolution),
    lc("minimum-number-of-arrows-to-burst-balloons", "Burst Balloons (Arrows)", "Medium", minArrowsActivitySolution),
  ),
  "interval-scheduling": pack(
    "Same greedy as activity selection: earliest finish, skip overlaps.",
    langs(
      `def erase_overlap(intervals):
    intervals.sort(key=lambda x: x[1])
    keep, end = 0, -10**18
    for s, e in intervals:
        if s >= end:
            keep += 1
            end = e
    return len(intervals) - keep`,
      `int eraseOverlap(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), [](auto& a, auto& b) { return a[1] < b[1]; });
    int keep = 0; long long end = LLONG_MIN;
    for (auto& iv : intervals) {
        if (iv[0] >= end) { keep++; end = iv[1]; }
    }
    return (int)intervals.size() - keep;
}`,
      `int eraseOverlap(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
    int keep = 0; long end = Long.MIN_VALUE;
    for (int[] iv : intervals) {
        if (iv[0] >= end) { keep++; end = iv[1]; }
    }
    return intervals.length - keep;
}`,
      `function eraseOverlap(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let keep = 0, end = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= end) { keep++; end = e; }
  }
  return intervals.length - keep;
}`,
    ),
    lc("non-overlapping-intervals", "Non-overlapping Intervals", "Medium", nonOverlappingScheduleSolution),
    lc("minimum-number-of-arrows-to-burst-balloons", "Min Arrows", "Medium", minArrowsScheduleSolution),
    lc("maximum-length-of-pair-chain", "Max Pair Chain", "Medium", maxLengthOfPairChainSolution),
  ),
  "merge-intervals": pack(
    "Sort by start. If next.start <= cur.end, extend end.",
    langs(
      `def merge(intervals):
    intervals.sort()
    out = []
    for s, e in intervals:
        if not out or s > out[-1][1]:
            out.append([s, e])
        else:
            out[-1][1] = max(out[-1][1], e)
    return out`,
      `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> out;
    for (auto& iv : intervals) {
        if (out.empty() || iv[0] > out.back()[1]) out.push_back(iv);
        else out.back()[1] = max(out.back()[1], iv[1]);
    }
    return out;
}`,
      `int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> out = new ArrayList<>();
    for (int[] iv : intervals) {
        if (out.isEmpty() || iv[0] > out.get(out.size() - 1)[1]) out.add(iv);
        else out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], iv[1]);
    }
    return out.toArray(new int[0][]);
}`,
      `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [s, e] of intervals) {
    if (!out.length || s > out[out.length - 1][1]) out.push([s, e]);
    else out[out.length - 1][1] = Math.max(out[out.length - 1][1], e);
  }
  return out;
}`,
    ),
    lc("merge-intervals", "Merge Intervals", "Medium", mergeIntervalsSolution),
    lc("insert-interval", "Insert Interval", "Medium", insertIntervalSolution),
    lc("non-overlapping-intervals", "Non-overlapping Intervals", "Medium", nonOverlappingMergeSolution),
  ),
  "minimum-platforms": pack(
    "Sort arrivals and departures. Sweep: +1 on arrive, -1 on leave.",
    langs(
      `def min_platforms(arr, dep):
    arr.sort(); dep.sort()
    i = j = cur = best = 0
    while i < len(arr):
        if arr[i] <= dep[j]:
            cur += 1
            best = max(best, cur)
            i += 1
        else:
            cur -= 1
            j += 1
    return best`,
      `int minPlatforms(vector<int>& arr, vector<int>& dep) {
    sort(arr.begin(), arr.end());
    sort(dep.begin(), dep.end());
    int i = 0, j = 0, cur = 0, best = 0;
    while (i < (int)arr.size()) {
        if (arr[i] <= dep[j]) { cur++; best = max(best, cur); i++; }
        else { cur--; j++; }
    }
    return best;
}`,
      `int minPlatforms(int[] arr, int[] dep) {
    Arrays.sort(arr); Arrays.sort(dep);
    int i = 0, j = 0, cur = 0, best = 0;
    while (i < arr.length) {
        if (arr[i] <= dep[j]) { cur++; best = Math.max(best, cur); i++; }
        else { cur--; j++; }
    }
    return best;
}`,
      `function minPlatforms(arr, dep) {
  arr.sort((a, b) => a - b);
  dep.sort((a, b) => a - b);
  let i = 0, j = 0, cur = 0, best = 0;
  while (i < arr.length) {
    if (arr[i] <= dep[j]) { cur++; best = Math.max(best, cur); i++; }
    else { cur--; j++; }
  }
  return best;
}`,
    ),
    gfg("minimum-platforms-public-transport-sorting", "Minimum Platforms", "Medium", minimumPlatformsSolution),
    lc("meeting-rooms-ii", "Meeting Rooms II", "Medium", meetingRoomsIISolution),
    lc("car-pooling", "Car Pooling", "Medium", carPoolingPlatformsSolution),
  ),
  "job-sequencing": pack(
    "Sort by profit. Place each job in the latest free slot <= deadline.",
    langs(
      `def job_sequencing(jobs):
    # jobs: (id, deadline, profit)
    jobs.sort(key=lambda j: -j[2])
    m = max(j[1] for j in jobs)
    slot = [None] * (m + 1)
    for jid, d, p in jobs:
        for t in range(d, 0, -1):
            if slot[t] is None:
                slot[t] = (jid, p)
                break
    return slot`,
      `vector<pair<int,int>> jobSequencing(vector<array<int,3>>& jobs) {
    sort(jobs.begin(), jobs.end(), [](auto& a, auto& b) { return a[2] > b[2]; });
    int m = 0;
    for (auto& j : jobs) m = max(m, j[1]);
    vector<pair<int,int>> slot(m + 1, {-1, -1});
    for (auto [jid, d, p] : jobs) {
        for (int t = d; t > 0; t--) {
            if (slot[t].first == -1) { slot[t] = {jid, p}; break; }
        }
    }
    return slot;
}`,
      `int[][] jobSequencing(int[][] jobs) {
    Arrays.sort(jobs, (a, b) -> b[2] - a[2]);
    int m = 0;
    for (int[] j : jobs) m = Math.max(m, j[1]);
    int[][] slot = new int[m + 1][];
    for (int[] job : jobs) {
        int jid = job[0], d = job[1], p = job[2];
        for (int t = d; t > 0; t--) {
            if (slot[t] == null) { slot[t] = new int[]{jid, p}; break; }
        }
    }
    return slot;
}`,
      `function jobSequencing(jobs) {
  // jobs: [id, deadline, profit]
  jobs.sort((a, b) => b[2] - a[2]);
  const m = Math.max(...jobs.map(j => j[1]));
  const slot = Array(m + 1).fill(null);
  for (const [jid, d, p] of jobs) {
    for (let t = d; t > 0; t--) {
      if (slot[t] == null) { slot[t] = [jid, p]; break; }
    }
  }
  return slot;
}`,
    ),
    gfg("job-sequencing-problem", "Job Sequencing", "Medium", jobSequencingGfgSolution),
    lc("maximum-profit-in-job-scheduling", "Max Profit Job Scheduling", "Hard", maxProfitJobSchedulingSolution),
    lc("course-schedule-iii", "Course Schedule III", "Hard", courseScheduleIIISolution),
  ),
  "graph-bfs-dfs": pack(
    "DFS stack/recursion vs BFS queue. Same graph, different order.",
    langs(
      `from collections import defaultdict, deque

def bfs(graph, start):
    q, seen, order = deque([start]), {start}, []
    while q:
        u = q.popleft()
        order.append(u)
        for v in graph[u]:
            if v not in seen:
                seen.add(v)
                q.append(v)
    return order`,
      `vector<int> bfs(vector<vector<int>>& graph, int start) {
    queue<int> q;
    unordered_set<int> seen;
    vector<int> order;
    q.push(start); seen.insert(start);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : graph[u]) {
            if (!seen.count(v)) { seen.insert(v); q.push(v); }
        }
    }
    return order;
}`,
      `List<Integer> bfs(List<List<Integer>> graph, int start) {
    Deque<Integer> q = new ArrayDeque<>();
    Set<Integer> seen = new HashSet<>();
    List<Integer> order = new ArrayList<>();
    q.add(start); seen.add(start);
    while (!q.isEmpty()) {
        int u = q.poll();
        order.add(u);
        for (int v : graph.get(u)) {
            if (seen.add(v)) q.add(v);
        }
    }
    return order;
}`,
      `function bfs(graph, start) {
  const q = [start], seen = new Set([start]), order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (const v of graph[u]) {
      if (!seen.has(v)) { seen.add(v); q.push(v); }
    }
  }
  return order;
}`,
    ),
    lc("number-of-islands", "Number of Islands", "Medium", numberOfIslandsSolution),
    lc("clone-graph", "Clone Graph", "Medium", cloneGraphSolution),
    lc("max-area-of-island", "Max Area of Island", "Medium", maxAreaOfIslandSolution),
  ),
  "connected-components": pack(
    "Each unvisited start is a new component (DFS/BFS or DSU).",
    langs(
      `def components(n, edges):
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v); g[v].append(u)
    seen, count = set(), 0
    def dfs(u):
        seen.add(u)
        for v in g[u]:
            if v not in seen:
                dfs(v)
    for i in range(n):
        if i not in seen:
            count += 1
            dfs(i)
    return count`,
      `int components(int n, vector<vector<int>>& edges) {
    vector<vector<int>> g(n);
    for (auto& e : edges) { g[e[0]].push_back(e[1]); g[e[1]].push_back(e[0]); }
    vector<int> seen(n);
    int count = 0;
    function<void(int)> dfs = [&](int u) {
        seen[u] = 1;
        for (int v : g[u]) if (!seen[v]) dfs(v);
    };
    for (int i = 0; i < n; i++) if (!seen[i]) { count++; dfs(i); }
    return count;
}`,
      `int components(int n, int[][] edges) {
    List<Integer>[] g = new List[n];
    for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
    for (int[] e : edges) { g[e[0]].add(e[1]); g[e[1]].add(e[0]); }
    boolean[] seen = new boolean[n];
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (!seen[i]) { count++; dfs(i, g, seen); }
    }
    return count;
}
void dfs(int u, List<Integer>[] g, boolean[] seen) {
    seen[u] = true;
    for (int v : g[u]) if (!seen[v]) dfs(v, g, seen);
}`,
      `function components(n, edges) {
  const g = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { g[u].push(v); g[v].push(u); }
  const seen = new Set();
  let count = 0;
  function dfs(u) {
    seen.add(u);
    for (const v of g[u]) if (!seen.has(v)) dfs(v);
  }
  for (let i = 0; i < n; i++) {
    if (!seen.has(i)) { count++; dfs(i); }
  }
  return count;
}`,
    ),
    lc("number-of-provinces", "Number of Provinces", "Medium", numberOfProvincesSolution),
    lc("number-of-islands", "Number of Islands", "Medium", numberOfIslandsCCSolution),
    lc("find-if-path-exists-in-graph", "Find if Path Exists", "Easy", findIfPathExistsSolution),
  ),
  "graph-cycle": pack(
    "Directed: gray node on the stack = back edge. Undirected: DSU or parent skip.",
    langs(
      `def has_cycle_directed(g):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {u: WHITE for u in g}
    def dfs(u):
        color[u] = GRAY
        for v in g[u]:
            if color[v] == GRAY or (color[v] == WHITE and dfs(v)):
                return True
        color[u] = BLACK
        return False
    return any(color[u] == WHITE and dfs(u) for u in g)`,
      `bool hasCycleDirected(vector<vector<int>>& g) {
    const int WHITE = 0, GRAY = 1, BLACK = 2;
    vector<int> color(g.size(), WHITE);
    function<bool(int)> dfs = [&](int u) {
        color[u] = GRAY;
        for (int v : g[u]) {
            if (color[v] == GRAY || (color[v] == WHITE && dfs(v))) return true;
        }
        color[u] = BLACK;
        return false;
    };
    for (int u = 0; u < (int)g.size(); u++)
        if (color[u] == WHITE && dfs(u)) return true;
    return false;
}`,
      `boolean hasCycleDirected(List<List<Integer>> g) {
    int WHITE = 0, GRAY = 1, BLACK = 2;
    int[] color = new int[g.size()];
    for (int u = 0; u < g.size(); u++)
        if (color[u] == WHITE && dfs(u, g, color, GRAY, BLACK)) return true;
    return false;
}
boolean dfs(int u, List<List<Integer>> g, int[] color, int GRAY, int BLACK) {
    color[u] = GRAY;
    for (int v : g.get(u)) {
        if (color[v] == GRAY || (color[v] == 0 && dfs(v, g, color, GRAY, BLACK))) return true;
    }
    color[u] = BLACK;
    return false;
}`,
      `function hasCycleDirected(g) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = {};
  for (const u in g) color[u] = WHITE;
  function dfs(u) {
    color[u] = GRAY;
    for (const v of g[u]) {
      if (color[v] === GRAY || (color[v] === WHITE && dfs(v))) return true;
    }
    color[u] = BLACK;
    return false;
  }
  return Object.keys(g).some(u => color[u] === WHITE && dfs(u));
}`,
    ),
    lc("course-schedule", "Course Schedule", "Medium", courseScheduleSolution),
    lc("course-schedule-ii", "Course Schedule II", "Medium", courseScheduleIISolution),
    lc("find-eventual-safe-states", "Eventual Safe States", "Medium", findEventualSafeStatesSolution),
  ),
  bipartite: pack(
    "2-color BFS/DFS. Neighbor must get the other color.",
    langs(
      `from collections import deque

def is_bipartite(graph):
    color = {}
    for start in range(len(graph)):
        if start in color:
            continue
        q = deque([start]); color[start] = 0
        while q:
            u = q.popleft()
            for v in graph[u]:
                if v not in color:
                    color[v] = color[u] ^ 1
                    q.append(v)
                elif color[v] == color[u]:
                    return False
    return True`,
      `bool isBipartite(vector<vector<int>>& graph) {
    vector<int> color(graph.size(), -1);
    for (int start = 0; start < (int)graph.size(); start++) {
        if (color[start] != -1) continue;
        queue<int> q; q.push(start); color[start] = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : graph[u]) {
                if (color[v] == -1) { color[v] = color[u] ^ 1; q.push(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}`,
      `boolean isBipartite(int[][] graph) {
    int[] color = new int[graph.length];
    Arrays.fill(color, -1);
    for (int start = 0; start < graph.length; start++) {
        if (color[start] != -1) continue;
        Deque<Integer> q = new ArrayDeque<>();
        q.add(start); color[start] = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : graph[u]) {
                if (color[v] == -1) { color[v] = color[u] ^ 1; q.add(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}`,
      `function isBipartite(graph) {
  const color = new Map();
  for (let start = 0; start < graph.length; start++) {
    if (color.has(start)) continue;
    const q = [start]; color.set(start, 0);
    while (q.length) {
      const u = q.shift();
      for (const v of graph[u]) {
        if (!color.has(v)) { color.set(v, color.get(u) ^ 1); q.push(v); }
        else if (color.get(v) === color.get(u)) return false;
      }
    }
  }
  return true;
}`,
    ),
    lc("is-graph-bipartite", "Is Graph Bipartite?", "Medium", isGraphBipartiteSolution),
    lc("possible-bipartition", "Possible Bipartition", "Medium", possibleBipartitionSolution),
    lc("flower-planting-with-no-adjacent", "Flower Planting", "Medium", flowerPlantingWithNoAdjacentSolution),
  ),
  subsets: pack(
    "For each index, skip or pick. Record at the leaf (or every node).",
    langs(
      `def subsets(nums):
    out = []
    def dfs(i, path):
        if i == len(nums):
            out.append(path[:])
            return
        dfs(i + 1, path)
        path.append(nums[i])
        dfs(i + 1, path)
        path.pop()
    dfs(0, [])
    return out`,
      `void dfs(int i, vector<int>& nums, vector<int>& path, vector<vector<int>>& out) {
    if (i == (int)nums.size()) { out.push_back(path); return; }
    dfs(i + 1, nums, path, out);
    path.push_back(nums[i]);
    dfs(i + 1, nums, path, out);
    path.pop_back();
}
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> out; vector<int> path;
    dfs(0, nums, path, out);
    return out;
}`,
      `void dfs(int i, int[] nums, List<Integer> path, List<List<Integer>> out) {
    if (i == nums.length) { out.add(new ArrayList<>(path)); return; }
    dfs(i + 1, nums, path, out);
    path.add(nums[i]);
    dfs(i + 1, nums, path, out);
    path.remove(path.size() - 1);
}
List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> out = new ArrayList<>();
    dfs(0, nums, new ArrayList<>(), out);
    return out;
}`,
      `function subsets(nums) {
  const out = [];
  function dfs(i, path) {
    if (i === nums.length) { out.push([...path]); return; }
    dfs(i + 1, path);
    path.push(nums[i]);
    dfs(i + 1, path);
    path.pop();
  }
  dfs(0, []);
  return out;
}`,
    ),
    lc("subsets", "Subsets", "Medium", subsetsL2Solution),
    lc("subsets-ii", "Subsets II", "Medium", subsetsIISolution),
    lc("letter-case-permutation", "Letter Case Permutation", "Medium", letterCasePermutationSolution),
  ),
  permutations: pack(
    "Place an unused value in the next slot, recurse, unmark.",
    langs(
      `def permute(nums):
    out, used = [], [False] * len(nums)
    def dfs(path):
        if len(path) == len(nums):
            out.append(path[:]); return
        for i, x in enumerate(nums):
            if used[i]:
                continue
            used[i] = True; path.append(x)
            dfs(path)
            path.pop(); used[i] = False
    dfs([])
    return out`,
      `void dfs(vector<int>& nums, vector<int>& path, vector<int>& used, vector<vector<int>>& out) {
    if (path.size() == nums.size()) { out.push_back(path); return; }
    for (int i = 0; i < (int)nums.size(); i++) {
        if (used[i]) continue;
        used[i] = 1; path.push_back(nums[i]);
        dfs(nums, path, used, out);
        path.pop_back(); used[i] = 0;
    }
}
vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> out; vector<int> path, used(nums.size());
    dfs(nums, path, used, out);
    return out;
}`,
      `void dfs(int[] nums, List<Integer> path, boolean[] used, List<List<Integer>> out) {
    if (path.size() == nums.length) { out.add(new ArrayList<>(path)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true; path.add(nums[i]);
        dfs(nums, path, used, out);
        path.remove(path.size() - 1); used[i] = false;
    }
}
List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> out = new ArrayList<>();
    dfs(nums, new ArrayList<>(), new boolean[nums.length], out);
    return out;
}`,
      `function permute(nums) {
  const out = [], used = Array(nums.length).fill(false);
  function dfs(path) {
    if (path.length === nums.length) { out.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      dfs(path);
      path.pop(); used[i] = false;
    }
  }
  dfs([]);
  return out;
}`,
    ),
    lc("permutations", "Permutations", "Medium", permutationsL2Solution),
    lc("permutations-ii", "Permutations II", "Medium", permutationsIISolution),
    lc("next-permutation", "Next Permutation", "Medium", nextPermutationSolution),
  ),
  "combination-sum": pack(
    "Reuse allowed: stay on i after pick. Prune remainder < 0.",
    langs(
      `def combination_sum(cands, target):
    cands.sort(); out = []
    def dfs(i, remain, path):
        if remain == 0:
            out.append(path[:]); return
        for j in range(i, len(cands)):
            if cands[j] > remain:
                break
            path.append(cands[j])
            dfs(j, remain - cands[j], path)
            path.pop()
    dfs(0, target, [])
    return out`,
      `void dfs(int i, int remain, vector<int>& cands, vector<int>& path, vector<vector<int>>& out) {
    if (remain == 0) { out.push_back(path); return; }
    for (int j = i; j < (int)cands.size(); j++) {
        if (cands[j] > remain) break;
        path.push_back(cands[j]);
        dfs(j, remain - cands[j], cands, path, out);
        path.pop_back();
    }
}
vector<vector<int>> combinationSum(vector<int>& cands, int target) {
    sort(cands.begin(), cands.end());
    vector<vector<int>> out; vector<int> path;
    dfs(0, target, cands, path, out);
    return out;
}`,
      `void dfs(int i, int remain, int[] cands, List<Integer> path, List<List<Integer>> out) {
    if (remain == 0) { out.add(new ArrayList<>(path)); return; }
    for (int j = i; j < cands.length; j++) {
        if (cands[j] > remain) break;
        path.add(cands[j]);
        dfs(j, remain - cands[j], cands, path, out);
        path.remove(path.size() - 1);
    }
}
List<List<Integer>> combinationSum(int[] cands, int target) {
    Arrays.sort(cands);
    List<List<Integer>> out = new ArrayList<>();
    dfs(0, target, cands, new ArrayList<>(), out);
    return out;
}`,
      `function combinationSum(cands, target) {
  cands.sort((a, b) => a - b);
  const out = [];
  function dfs(i, remain, path) {
    if (remain === 0) { out.push([...path]); return; }
    for (let j = i; j < cands.length; j++) {
      if (cands[j] > remain) break;
      path.push(cands[j]);
      dfs(j, remain - cands[j], path);
      path.pop();
    }
  }
  dfs(0, target, []);
  return out;
}`,
    ),
    lc("combination-sum", "Combination Sum", "Medium", combinationSumL2Solution),
    lc("combination-sum-ii", "Combination Sum II", "Medium", combinationSumIISolution),
    lc("combination-sum-iii", "Combination Sum III", "Medium", combinationSumIIISolution),
  ),
  "n-queens": pack(
    "One queen per row. Ban column and both diagonals. Undo on backtrack.",
    langs(
      `def solve_n_queens(n):
    cols, d1, d2, board, out = set(), set(), set(), [], []
    def dfs(r):
        if r == n:
            out.append(["." * c + "Q" + "." * (n - c - 1) for c in board])
            return
        for c in range(n):
            if c in cols or r - c in d1 or r + c in d2:
                continue
            cols.add(c); d1.add(r - c); d2.add(r + c); board.append(c)
            dfs(r + 1)
            board.pop(); cols.remove(c); d1.remove(r - c); d2.remove(r + c)
    dfs(0)
    return out`,
      `vector<vector<string>> solveNQueens(int n) {
    unordered_set<int> cols, d1, d2;
    vector<int> board;
    vector<vector<string>> out;
    function<void(int)> dfs = [&](int r) {
        if (r == n) {
            vector<string> rows;
            for (int c : board) rows.push_back(string(c, '.') + "Q" + string(n - c - 1, '.'));
            out.push_back(rows);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (cols.count(c) || d1.count(r - c) || d2.count(r + c)) continue;
            cols.insert(c); d1.insert(r - c); d2.insert(r + c); board.push_back(c);
            dfs(r + 1);
            board.pop_back(); cols.erase(c); d1.erase(r - c); d2.erase(r + c);
        }
    };
    dfs(0);
    return out;
}`,
      `Set<Integer> cols = new HashSet<>(), d1 = new HashSet<>(), d2 = new HashSet<>();
List<Integer> board = new ArrayList<>();
List<List<String>> out = new ArrayList<>();
void dfs(int r, int n) {
    if (r == n) {
        List<String> rows = new ArrayList<>();
        for (int c : board) {
            char[] row = new char[n];
            Arrays.fill(row, '.');
            row[c] = 'Q';
            rows.add(new String(row));
        }
        out.add(rows);
        return;
    }
    for (int c = 0; c < n; c++) {
        if (cols.contains(c) || d1.contains(r - c) || d2.contains(r + c)) continue;
        cols.add(c); d1.add(r - c); d2.add(r + c); board.add(c);
        dfs(r + 1, n);
        board.remove(board.size() - 1); cols.remove(c); d1.remove(r - c); d2.remove(r + c);
    }
}
List<List<String>> solveNQueens(int n) {
    dfs(0, n);
    return out;
}`,
      `function solveNQueens(n) {
  const cols = new Set(), d1 = new Set(), d2 = new Set(), board = [], out = [];
  function dfs(r) {
    if (r === n) {
      out.push(board.map(c => ".".repeat(c) + "Q" + ".".repeat(n - c - 1)));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
      cols.add(c); d1.add(r - c); d2.add(r + c); board.push(c);
      dfs(r + 1);
      board.pop(); cols.delete(c); d1.delete(r - c); d2.delete(r + c);
    }
  }
  dfs(0);
  return out;
}`,
    ),
    lc("n-queens", "N-Queens", "Hard", nQueensSolution),
    lc("n-queens-ii", "N-Queens II", "Hard", nQueensIISolution),
    lc("sudoku-solver", "Sudoku Solver", "Hard", sudokuSolverNQueensPackSolution),
  ),
  "sudoku-solver": pack(
    "Empty cell: try 1-9 legal for row/col/box, recurse, undo.",
    langs(
      `def is_valid(board, r, c, ch):
    for i in range(9):
        if board[r][i] == ch or board[i][c] == ch:
            return False
        br, bc = 3 * (r // 3) + i // 3, 3 * (c // 3) + i % 3
        if board[br][bc] == ch:
            return False
    return True`,
      `bool isValid(vector<vector<char>>& board, int r, int c, char ch) {
    for (int i = 0; i < 9; i++) {
        if (board[r][i] == ch || board[i][c] == ch) return false;
        int br = 3 * (r / 3) + i / 3, bc = 3 * (c / 3) + i % 3;
        if (board[br][bc] == ch) return false;
    }
    return true;
}`,
      `boolean isValid(char[][] board, int r, int c, char ch) {
    for (int i = 0; i < 9; i++) {
        if (board[r][i] == ch || board[i][c] == ch) return false;
        int br = 3 * (r / 3) + i / 3, bc = 3 * (c / 3) + i % 3;
        if (board[br][bc] == ch) return false;
    }
    return true;
}`,
      `function isValid(board, r, c, ch) {
  for (let i = 0; i < 9; i++) {
    if (board[r][i] === ch || board[i][c] === ch) return false;
    const br = 3 * Math.floor(r / 3) + Math.floor(i / 3);
    const bc = 3 * Math.floor(c / 3) + i % 3;
    if (board[br][bc] === ch) return false;
  }
  return true;
}`,
    ),
    lc("valid-sudoku", "Valid Sudoku", "Medium", validSudokuSolution),
    lc("sudoku-solver", "Sudoku Solver", "Hard", sudokuSolverSolution),
    lc("n-queens", "N-Queens", "Hard", nQueensFromSudokuSolution),
  ),
};

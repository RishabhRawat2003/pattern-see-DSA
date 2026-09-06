import type { CellTone, Frame, TreeNode } from "../../types";
import { arrayFrame, PTR } from "../../demos/problems/helpers";
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

function kthBSTFrames(): Frame[] {
  const order = ["n1", "n2", "n3", "n4", "n6", "n7"];
  const frames: Frame[] = [
    tree(
      "k = 3",
      "Inorder is sorted. Decrement k at each visit; when k hits 0, that node is the answer.",
      {},
      { note: "k = 3" },
    ),
  ];
  let k = 3;
  const seen: Record<string, CellTone> = {};
  for (const id of order) {
    k -= 1;
    seen[id] = "done";
    const label = base.find((n) => n.id === id)!.label;
    frames.push(
      tree(
        `Visit ${label} · k→${k}`,
        k === 0
          ? "k hit 0 at 3 — the 3rd smallest."
          : "Keep walking inorder (left, node, right).",
        { ...seen, [id]: k === 0 ? "match" : "active" },
        { note: `k=${k}` },
      ),
    );
    if (k === 0) break;
  }
  frames.push(
    tree(
      "Answer 3",
      "Iterative stack inorder avoids recursion and can stop early. O(h+k) time.",
      { n1: "done", n2: "done", n3: "match" },
      { note: "return 3" },
    ),
  );
  return frames;
}

function kthLargestArrayFrames(): Frame[] {
  const a = [3, 2, 1, 5, 6, 4];
  return [
    arrayFrame(
      "Find 2nd largest",
      "Min-heap of size k holding the largest k so far. Root is the kth largest.",
      a,
      {},
      { note: "k = 2" },
    ),
    arrayFrame(
      "Seed heap [3,2]",
      "First k elements; heapify as min-heap → top 2.",
      a,
      { 0: "window", 1: "window" },
      { note: "heap = [2,3]" },
    ),
    arrayFrame(
      "See 1",
      "1 < heap top → skip.",
      a,
      { 0: "done", 1: "done", 2: "skip" },
      { note: "heap = [2,3]" },
    ),
    arrayFrame(
      "See 5",
      "5 > 2 → replace top, heapify → [3,5].",
      a,
      { 3: "active" },
      { note: "heap = [3,5]" },
    ),
    arrayFrame(
      "See 6, then 4",
      "6 replaces 3 → [5,6]. 4 < 5 → skip. Answer = heap top 5.",
      a,
      { 3: "done", 4: "match", 5: "skip" },
      {
        pointers: [{ name: "kth", index: 3, color: PTR.M }],
        note: "kth = 5",
      },
    ),
    arrayFrame(
      "Quickselect option",
      "Average O(n) partition for index n−k. Heap is O(n log k) and simple.",
      a,
      { 3: "match" },
    ),
  ];
}

function kthMatrixFrames(): Frame[] {
  // 3x3 sorted matrix visualization via flattened rows in array frames + note
  const row0 = [1, 5, 9];
  const row1 = [10, 11, 13];
  const row2 = [12, 13, 15];
  return [
    arrayFrame(
      "Sorted matrix",
      "Each row and column non-decreasing. Find kth smallest without flattening fully.",
      [...row0, "|", ...row1, "|", ...row2],
      {},
      { note: "k = 8" },
    ),
    arrayFrame(
      "Binary search on value",
      "lo=1, hi=15. Mid=8: count how many entries ≤ 8.",
      row0,
      { 0: "match", 1: "window" },
      { note: "mid = 8 · count≤" },
    ),
    arrayFrame(
      "Count ≤ mid per row",
      "Row0: two (1,5). Row1/2: none ≤8. count=2 < k → lo = mid+1.",
      row0,
      { 0: "done", 1: "done", 2: "skip" },
      { note: "count = 2 < 8" },
    ),
    arrayFrame(
      "Raise lo",
      "Search higher. When count≥k, hi=mid. Converge to the kth value.",
      [1, 5, 9, 10, 11, 13, 12, 13, 15],
      { 7: "active" },
      { note: "narrow [lo,hi]" },
    ),
    arrayFrame(
      "Answer 13",
      "8th smallest is 13. O(n log(max−min) · n) with staircase count, or heap O(k log n).",
      [1, 5, 9, 10, 11, 13, 12, 13, 15],
      { 5: "match", 7: "match" },
      { note: "kth = 13" },
    ),
  ];
}

export const kthSmallestElementInABSTSolution: ProblemSolution = {
  approach:
    "Iterative inorder with a stack; decrement k on each visit; return when k==0. O(h+k) time, O(h) space.",
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
  frames: kthBSTFrames(),
};

export const kthLargestElementInAnArraySolution: ProblemSolution = {
  approach:
    "Min-heap of size k: push all, pop when size>k; top is kth largest. O(n log k). Quickselect average O(n).",
  templates: langs(
    `import heapq

def findKthLargest(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)
    for x in nums[k:]:
        if x > heap[0]:
            heapq.heapreplace(heap, x)
    return heap[0]`,
    `int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> h(nums.begin(), nums.begin() + k);
    for (int i = k; i < (int)nums.size(); i++)
        if (nums[i] > h.top()) { h.pop(); h.push(nums[i]); }
    return h.top();
}`,
    `int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> h = new PriorityQueue<>();
    for (int x : nums) {
        h.offer(x);
        if (h.size() > k) h.poll();
    }
    return h.peek();
}`,
    `function findKthLargest(nums, k) {
  const heap = nums.slice(0, k).sort((a, b) => a - b);
  for (let i = k; i < nums.length; i++) {
    if (nums[i] > heap[0]) {
      heap[0] = nums[i];
      heap.sort((a, b) => a - b);
    }
  }
  return heap[0];
}`,
  ),
  frames: kthLargestArrayFrames(),
};

export const kthSmallestElementInASortedMatrixSolution: ProblemSolution = {
  approach:
    "Binary search on value in [min,max]: count entries ≤ mid via staircase; adjust lo/hi until lo is the kth. O(n log(max−min)) with O(n) count.",
  templates: langs(
    `def kthSmallest(matrix, k):
    n, lo, hi = len(matrix), matrix[0][0], matrix[-1][-1]
    while lo < hi:
        mid = (lo + hi) // 2
        cnt = j = 0
        for i in range(n - 1, -1, -1):
            while j < n and matrix[i][j] <= mid: j += 1
            cnt += j
        if cnt < k: lo = mid + 1
        else: hi = mid
    return lo`,
    `int kthSmallest(vector<vector<int>>& a, int k) {
    int n = a.size(), lo = a[0][0], hi = a[n-1][n-1];
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2, cnt = 0, j = 0;
        for (int i = n - 1; i >= 0; i--) {
            while (j < n && a[i][j] <= mid) j++;
            cnt += j;
        }
        if (cnt < k) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
    `int kthSmallest(int[][] a, int k) {
    int n = a.length, lo = a[0][0], hi = a[n-1][n-1];
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2, cnt = 0, j = 0;
        for (int i = n - 1; i >= 0; i--) {
            while (j < n && a[i][j] <= mid) j++;
            cnt += j;
        }
        if (cnt < k) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
    `function kthSmallest(matrix, k) {
  const n = matrix.length;
  let lo = matrix[0][0], hi = matrix[n - 1][n - 1];
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    let cnt = 0, j = 0;
    for (let i = n - 1; i >= 0; i--) {
      while (j < n && matrix[i][j] <= mid) j++;
      cnt += j;
    }
    if (cnt < k) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
  ),
  frames: kthMatrixFrames(),
};

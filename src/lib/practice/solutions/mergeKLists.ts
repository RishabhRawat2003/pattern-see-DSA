import { arrayFrame, listNodes } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const mergeKListsMergeKSolution: ProblemSolution = {
  approach:
    "Min-heap of current list heads. Pop the global min, append to result, push that list’s next. O(N log k) for N nodes.",
  templates: langs(
    `import heapq
def mergeKLists(lists):
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
    `ListNode* mergeKLists(vector<ListNode*>& lists) {
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
    `ListNode mergeKLists(ListNode[] lists) {
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
    `function mergeKLists(lists) {
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
  frames: (() => {
    const frames: Frame[] = [
      {
        kind: "array",
        title: "Three sorted lists",
        caption: "Heap stores each list’s current head. Always pop the global min.",
        cells: [
          { value: "A:1", tone: "lo" },
          { value: "4" },
          { value: "B:2", tone: "hi" },
          { value: "5" },
          { value: "C:3", tone: "active" },
        ],
        note: "heap: 1,2,3",
      },
    ];
    const merged: number[] = [];
    const steps = [
      { take: 1, heap: "2,3,4", cap: "Pop 1 from A. Push A’s next (4)." },
      { take: 2, heap: "3,4,5", cap: "Pop 2 from B. Push 5." },
      { take: 3, heap: "4,5", cap: "Pop 3 from C. C empty." },
      { take: 4, heap: "5", cap: "Pop 4 from A." },
      { take: 5, heap: "∅", cap: "Pop 5. Merged 1,2,3,4,5." },
    ];
    for (const s of steps) {
      merged.push(s.take);
      frames.push({
        kind: "linkedlist",
        title: `Emit ${s.take}`,
        caption: s.cap,
        listNodes: listNodes(merged, { [merged.length - 1]: "active" }),
        note: `heap heads: ${s.heap}`,
      });
    }
    return frames;
  })(),
};

export const kthSmallestInSortedMatrixSolution: ProblemSolution = {
  approach:
    "Min-heap of matrix cells starting from first column (or row). Pop min, push its right neighbor. After k pops, value is answer. O(k log n).",
  templates: langs(
    `import heapq
def kthSmallest(matrix, k):
    n, h = len(matrix), []
    for r in range(n):
        heapq.heappush(h, (matrix[r][0], r, 0))
    for _ in range(k):
        val, r, c = heapq.heappop(h)
        if c + 1 < n:
            heapq.heappush(h, (matrix[r][c + 1], r, c + 1))
    return val`,
    `int kthSmallest(vector<vector<int>>& m, int k) {
    int n = m.size();
    using T = tuple<int,int,int>;
    priority_queue<T, vector<T>, greater<T>> h;
    for (int r = 0; r < n; r++) h.push({m[r][0], r, 0});
    int val = 0;
    while (k--) {
        auto [v, r, c] = h.top(); h.pop();
        val = v;
        if (c + 1 < n) h.push({m[r][c + 1], r, c + 1});
    }
    return val;
}`,
    `int kthSmallest(int[][] m, int k) {
    int n = m.length;
    PriorityQueue<int[]> h = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    for (int r = 0; r < n; r++) h.offer(new int[]{m[r][0], r, 0});
    int val = 0;
    while (k-- > 0) {
        int[] cur = h.poll();
        val = cur[0];
        int r = cur[1], c = cur[2];
        if (c + 1 < n) h.offer(new int[]{m[r][c + 1], r, c + 1});
    }
    return val;
}`,
    `function kthSmallest(matrix, k) {
  const n = matrix.length, h = [];
  for (let r = 0; r < n; r++) h.push([matrix[r][0], r, 0]);
  let val = 0;
  for (let t = 0; t < k; t++) {
    h.sort((a, b) => a[0] - b[0]);
    const [v, r, c] = h.shift();
    val = v;
    if (c + 1 < n) h.push([matrix[r][c + 1], r, c + 1]);
  }
  return val;
}`,
  ),
  frames: (() => {
    // matrix [[1,5,9],[10,11,13],[12,13,15]], k=8 → 13
    const flat = ["1", "5", "9", "10", "11", "13", "12", "13", "15"];
    return [
      arrayFrame("3×3 sorted matrix, k=8", "Seed heap with first column. Pop min, push right neighbor.", flat, {
        0: "active",
        3: "active",
        6: "active",
      }, { note: "heap: 1,10,12" }),
      arrayFrame("Pop 1 → push 5", "Emit 1 (1st). Push matrix[0][1]=5.", flat, { 0: "done", 1: "lo" }, {
        note: "heap: 5,10,12 · count=1",
      }),
      arrayFrame("Pop 5 → push 9", "Emit 5. Push 9.", flat, { 1: "done", 2: "lo" }, {
        note: "heap: 9,10,12 · count=2",
      }),
      arrayFrame("Continue pops…", "Order so far: 1,5,9,10,11,12,13…", flat, {
        0: "done",
        1: "done",
        2: "done",
        3: "done",
        4: "done",
        6: "done",
      }, { note: "count = 7" }),
      arrayFrame("8th pop = 13", "Next min is 13 (row0 or row1). That is the kth smallest.", flat, {
        5: "match",
        7: "match",
      }, { note: "return 13" }),
      arrayFrame("Answer", "kth smallest = 13.", [13], { 0: "match" }),
    ];
  })(),
};

export const smallestRangeCoveringKListsSolution: ProblemSolution = {
  approach:
    "Min-heap of one pointer per list; track global max among heap elements. Slide by popping min and pushing its list’s next; update best [min,max] range.",
  templates: langs(
    `import heapq
def smallestRange(nums):
    h, cur_max = [], float("-inf")
    for i, row in enumerate(nums):
        heapq.heappush(h, (row[0], i, 0))
        cur_max = max(cur_max, row[0])
    best = [float("-inf"), float("inf")]
    while True:
        lo, i, j = heapq.heappop(h)
        if cur_max - lo < best[1] - best[0]:
            best = [lo, cur_max]
        if j + 1 == len(nums[i]):
            return best
        nxt = nums[i][j + 1]
        heapq.heappush(h, (nxt, i, j + 1))
        cur_max = max(cur_max, nxt)`,
    `vector<int> smallestRange(vector<vector<int>>& nums) {
    using T = tuple<int,int,int>;
    priority_queue<T, vector<T>, greater<T>> h;
    int curMax = INT_MIN;
    for (int i = 0; i < (int)nums.size(); i++) {
        h.push({nums[i][0], i, 0});
        curMax = max(curMax, nums[i][0]);
    }
    vector<int> best = {0, INT_MAX};
    while (true) {
        auto [lo, i, j] = h.top(); h.pop();
        if (curMax - lo < best[1] - best[0]) best = {lo, curMax};
        if (j + 1 == (int)nums[i].size()) return best;
        int nxt = nums[i][j + 1];
        h.push({nxt, i, j + 1});
        curMax = max(curMax, nxt);
    }
}`,
    `int[] smallestRange(List<List<Integer>> nums) {
    PriorityQueue<int[]> h = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    int curMax = Integer.MIN_VALUE;
    for (int i = 0; i < nums.size(); i++) {
        h.offer(new int[]{nums.get(i).get(0), i, 0});
        curMax = Math.max(curMax, nums.get(i).get(0));
    }
    int[] best = {0, Integer.MAX_VALUE};
    while (true) {
        int[] cur = h.poll();
        int lo = cur[0], i = cur[1], j = cur[2];
        if (curMax - lo < best[1] - best[0]) best = new int[]{lo, curMax};
        if (j + 1 == nums.get(i).size()) return best;
        int nxt = nums.get(i).get(j + 1);
        h.offer(new int[]{nxt, i, j + 1});
        curMax = Math.max(curMax, nxt);
    }
}`,
    `function smallestRange(nums) {
  const h = nums.map((row, i) => [row[0], i, 0]);
  let curMax = Math.max(...nums.map((r) => r[0]));
  let best = [-Infinity, Infinity];
  while (true) {
    h.sort((a, b) => a[0] - b[0]);
    const [lo, i, j] = h.shift();
    if (curMax - lo < best[1] - best[0]) best = [lo, curMax];
    if (j + 1 === nums[i].length) return best;
    const nxt = nums[i][j + 1];
    h.push([nxt, i, j + 1]);
    curMax = Math.max(curMax, nxt);
  }
}`,
  ),
  frames: (() => {
    // nums = [[4,10,15],[1,2,9? wait classic: [4,10,15,24,26],[0,9,12,20],[5,18,22,30]]
    // smaller: [[4,10],[1,9],[5,8]] → range [8? no] classic small: [1,2,3] style
    // Use [[4,10,15],[0,9,12],[5,18,22]] — best [9,12] or [4?]: start heap 4,0,5 max=5 range [0,5]; ...
    return [
      arrayFrame(
        "k lists",
        "One pointer per list in a min-heap; track running max. Best window covers all lists.",
        ["L0:4,10,15", "L1:0,9,12", "L2:5,18,22"],
        {},
        { note: "heap: 0,4,5  max=5" },
      ),
      {
        kind: "intervals" as const,
        title: "Range [0,5]",
        caption: "Current cover: min=0 (L1), max=5 (L2). Width 5.",
        intervals: [{ label: "[0,5]", start: 0, end: 5, tone: "window" }],
        axisMax: 22,
        note: "best = [0,5]",
      },
      {
        kind: "intervals" as const,
        title: "Advance L1 → 9",
        caption: "Pop 0, push 9. New max=9. Range [4,9] width 5 — tie/update.",
        intervals: [
          { label: "[4,9]", start: 4, end: 9, tone: "active" },
          { label: "old", start: 0, end: 5, tone: "skip" },
        ],
        axisMax: 22,
        note: "heap: 4,5,9  max=9",
      },
      {
        kind: "intervals" as const,
        title: "Advance L0 → 10",
        caption: "Pop 4, push 10. Range [5,10] width 5.",
        intervals: [{ label: "[5,10]", start: 5, end: 10, tone: "active" }],
        axisMax: 22,
        note: "heap: 5,9,10  max=10",
      },
      {
        kind: "intervals" as const,
        title: "Advance L2 → 18",
        caption: "Pop 5, push 18. max=18. Range [9,18] wider — keep previous best.",
        intervals: [
          { label: "best [5,10]", start: 5, end: 10, tone: "match" },
          { label: "[9,18]", start: 9, end: 18, tone: "skip" },
        ],
        axisMax: 22,
      },
      {
        kind: "intervals" as const,
        title: "Best range",
        caption: "Continue until a list ends; smallest covering range wins (e.g. [9,12]).",
        intervals: [{ label: "[9,12]", start: 9, end: 12, tone: "match" }],
        axisMax: 22,
        note: "return [9,12]",
      },
    ];
  })(),
};

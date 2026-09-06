import { arrayFrame } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const kthLargestArraySolution: ProblemSolution = {
  approach:
    "Min-heap of size k over the array: replace the root whenever a larger value arrives. Root is the kth largest. O(n log k).",
  templates: langs(
    `import heapq
def findKthLargest(a, k):
    heap = a[:k]
    heapq.heapify(heap)
    for x in a[k:]:
        if x > heap[0]:
            heapq.heapreplace(heap, x)
    return heap[0]`,
    `int findKthLargest(vector<int>& a, int k) {
    priority_queue<int, vector<int>, greater<int>> h(a.begin(), a.begin() + k);
    for (int i = k; i < (int)a.size(); i++) {
        if (a[i] > h.top()) { h.pop(); h.push(a[i]); }
    }
    return h.top();
}`,
    `int findKthLargest(int[] a, int k) {
    PriorityQueue<Integer> h = new PriorityQueue<>();
    for (int i = 0; i < k; i++) h.offer(a[i]);
    for (int i = k; i < a.length; i++) {
        if (a[i] > h.peek()) { h.poll(); h.offer(a[i]); }
    }
    return h.peek();
}`,
    `function findKthLargest(a, k) {
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
  frames: (() => {
    const a = [3, 2, 1, 5, 6, 4];
    const k = 2;
    const heap: number[] = [];
    const frames = [
      arrayFrame("2nd largest in array", "Keep only the k largest in a min-heap.", a, {}, { note: "k = 2" }),
    ];
    for (let i = 0; i < a.length; i++) {
      heap.push(a[i]);
      heap.sort((x, y) => x - y);
      let dropped = false;
      if (heap.length > k) {
        heap.shift();
        dropped = true;
      }
      frames.push({
        kind: "stack" as const,
        title: `Push ${a[i]}`,
        caption: dropped ? "Drop the min to keep size k." : "Maintain size ≤ k.",
        cells: a.map((v, idx) => ({
          value: v,
          tone: idx === i ? ("active" as const) : ("idle" as const),
        })),
        stackItems: heap.map((v) => ({ value: String(v) })),
        note: `root (kth) = ${heap[0]}`,
      });
    }
    frames.push({
      kind: "stack" as const,
      title: "Answer 5",
      caption: "Heap holds 5 and 6. Min is 5 — the 2nd largest.",
      cells: a.map((v) => ({ value: v, tone: v >= 5 ? ("match" as const) : ("idle" as const) })),
      stackItems: heap.map((v) => ({ value: String(v), tone: "match" as const })),
    });
    return frames;
  })(),
};

export const kthLargestStreamSolution: ProblemSolution = {
  approach:
    "KthLargest constructor seeds a min-heap of size k from nums; each add(val) pushes and pops if size > k, then returns the root.",
  templates: langs(
    `import heapq
class KthLargest:
    def __init__(self, k, nums):
        self.k, self.h = k, nums[:]
        heapq.heapify(self.h)
        while len(self.h) > k:
            heapq.heappop(self.h)
    def add(self, val):
        heapq.heappush(self.h, val)
        if len(self.h) > self.k:
            heapq.heappop(self.h)
        return self.h[0]`,
    `class KthLargest {
    priority_queue<int, vector<int>, greater<int>> h;
    int k;
public:
    KthLargest(int k, vector<int>& nums): k(k) {
        for (int x : nums) add(x);
    }
    int add(int val) {
        h.push(val);
        if ((int)h.size() > k) h.pop();
        return h.top();
    }
};`,
    `class KthLargest {
    PriorityQueue<Integer> h = new PriorityQueue<>();
    int k;
    KthLargest(int k, int[] nums) {
        this.k = k;
        for (int x : nums) add(x);
    }
    int add(int val) {
        h.offer(val);
        if (h.size() > k) h.poll();
        return h.peek();
    }
}`,
    `class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.h = [...nums].sort((a, b) => a - b);
    while (this.h.length > k) this.h.shift();
  }
  add(val) {
    this.h.push(val);
    this.h.sort((a, b) => a - b);
    if (this.h.length > this.k) this.h.shift();
    return this.h[0];
  }
}`,
  ),
  frames: (() => {
    const init = [4, 5, 8, 2];
    const k = 3;
    return [
      arrayFrame("KthLargest(3, [4,5,8,2])", "Seed min-heap; trim to size k. Root = 3rd largest so far.", init, {}, {
        note: "k = 3",
      }),
      {
        kind: "stack" as const,
        title: "After init",
        caption: "Heap [4,5,8] — dropped 2. Root 4 is 3rd largest.",
        cells: init.map((v) => ({
          value: v,
          tone: v === 2 ? ("skip" as const) : ("done" as const),
        })),
        stackItems: [
          { value: "4", tone: "lo" as const },
          { value: "5", tone: "idle" as const },
          { value: "8", tone: "idle" as const },
        ],
        note: "kth = 4",
      },
      {
        kind: "stack" as const,
        title: "add(3) → 4",
        caption: "Push 3, size 4 → pop 3. Root still 4.",
        cells: [3, 4, 5, 8].map((v) => ({
          value: v,
          tone: v === 3 ? ("skip" as const) : ("idle" as const),
        })),
        stackItems: [
          { value: "4", tone: "lo" as const },
          { value: "5", tone: "idle" as const },
          { value: "8", tone: "idle" as const },
        ],
        note: "return 4",
      },
      {
        kind: "stack" as const,
        title: "add(5) → 5",
        caption: "Push 5, pop 4. New root 5.",
        cells: [4, 5, 5, 8].map((v, i) => ({
          value: v,
          tone: i === 0 ? ("skip" as const) : ("active" as const),
        })),
        stackItems: [
          { value: "5", tone: "lo" as const },
          { value: "5", tone: "idle" as const },
          { value: "8", tone: "idle" as const },
        ],
        note: "return 5",
      },
      {
        kind: "stack" as const,
        title: "add(10) → 5",
        caption: "Push 10, pop one 5. Heap [5,8,10]; kth stays 5.",
        cells: [5, 8, 10].map((v) => ({ value: v, tone: "match" as const })),
        stackItems: [
          { value: "5", tone: "match" as const },
          { value: "8", tone: "idle" as const },
          { value: "10", tone: "active" as const },
        ],
        note: "return 5",
      },
      arrayFrame("Stream invariant", "After every add, heap size = k and root is the kth largest of all values seen.", [
        "size=k",
        "root=kth",
      ], { 0: "match", 1: "match" }),
    ];
  })(),
};

export const thirdMaximumSolution: ProblemSolution = {
  approach:
    "Track up to three distinct maxima (or a size-3 min-heap of distinct values). If fewer than 3 distinct, return the maximum.",
  templates: langs(
    `def thirdMax(nums):
    a = b = c = None  # a > b > c
    for x in set(nums):
        if a is None or x > a:
            a, b, c = x, a, b
        elif b is None or x > b:
            b, c = x, b
        elif c is None or x > c:
            c = x
    return c if c is not None else a`,
    `int thirdMax(vector<int>& nums) {
    long a = LONG_MIN, b = LONG_MIN, c = LONG_MIN;
    unordered_set<int> seen;
    for (int x : nums) {
        if (!seen.insert(x).second) continue;
        if (x > a) { c = b; b = a; a = x; }
        else if (x > b) { c = b; b = x; }
        else if (x > c) c = x;
    }
    return c == LONG_MIN ? (int)a : (int)c;
}`,
    `int thirdMax(int[] nums) {
    Long a = null, b = null, c = null;
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) {
        if (!seen.add(x)) continue;
        if (a == null || x > a) { c = b; b = a; a = (long)x; }
        else if (b == null || x > b) { c = b; b = (long)x; }
        else if (c == null || x > c) c = (long)x;
    }
    return c == null ? a.intValue() : c.intValue();
}`,
    `function thirdMax(nums) {
  let a = null, b = null, c = null;
  for (const x of new Set(nums)) {
    if (a === null || x > a) { c = b; b = a; a = x; }
    else if (b === null || x > b) { c = b; b = x; }
    else if (c === null || x > c) c = x;
  }
  return c === null ? a : c;
}`,
  ),
  frames: (() => {
    const a = [2, 2, 3, 1];
    return [
      arrayFrame("Third distinct max", "Ignore duplicates. Track top-3 distinct values.", a, {}, {
        note: "want 3rd max",
      }),
      arrayFrame("See 2", "First distinct → a=2.", a, { 0: "active" }, { note: "a=2" }),
      arrayFrame("See 2 again", "Duplicate — skip.", a, { 1: "skip" }, { note: "a=2" }),
      arrayFrame("See 3", "3 > a → shift: a=3, b=2.", a, { 2: "active" }, { note: "a=3 b=2" }),
      arrayFrame("See 1", "1 < b → becomes c.", a, { 3: "active" }, { note: "a=3 b=2 c=1" }),
      arrayFrame("Answer 1", "Three distinct maxima exist → return c = 1.", [3, 2, 1], {
        0: "done",
        1: "done",
        2: "match",
      }, { note: "return 1" }),
    ];
  })(),
};

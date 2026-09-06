import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const topKFrequentTopKSolution: ProblemSolution = {
  approach:
    "Count frequencies, keep a min-heap of size k keyed by count; pop when size > k. Remaining keys are the top-k frequent. O(n log k).",
  templates: langs(
    `from collections import Counter
import heapq
def topKFrequent(nums, k):
    freq = Counter(nums)
    return heapq.nlargest(k, freq, key=freq.get)`,
    `vector<int> topKFrequent(vector<int>& nums, int k) {
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
    `int[] topKFrequent(int[] nums, int k) {
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
    `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);
  return [...freq.keys()].sort((a, b) => freq.get(b) - freq.get(a)).slice(0, k);
}`,
  ),
  frames: (() => {
    const a = [1, 1, 1, 2, 2, 3];
    return [
      arrayFrame("nums, k = 2", "Min-heap of size k on (freq, key). Drop the rarest when full.", a, {}, {
        note: "k = 2",
      }),
      {
        kind: "hashmap" as const,
        title: "Frequency map",
        caption: "1→3, 2→2, 3→1.",
        cells: a.map((v, i) => ({
          value: v,
          tone: (i < 3 ? "window" : i < 5 ? "lo" : "hi") as "window" | "lo" | "hi",
        })),
        mapEntries: [
          { key: "1", value: "3×", tone: "match" as const },
          { key: "2", value: "2×", tone: "active" as const },
          { key: "3", value: "1×", tone: "idle" as const },
        ],
      },
      {
        kind: "stack" as const,
        title: "Push 3 (freq 1)",
        caption: "Heap not full — insert key 3.",
        cells: a.map((v) => ({ value: v })),
        stackItems: [{ value: "3@1", tone: "lo" as const }],
        note: "size 1 / 2",
      },
      {
        kind: "stack" as const,
        title: "Push 2 (freq 2)",
        caption: "Heap full with {3@1, 2@2}. Root is rarest.",
        cells: a.map((v) => ({ value: v })),
        stackItems: [
          { value: "3@1", tone: "lo" as const },
          { value: "2@2", tone: "idle" as const },
        ],
      },
      {
        kind: "stack" as const,
        title: "Push 1 (freq 3)",
        caption: "1@3 beats root 3@1 → pop 3, push 1. Heap = {2@2, 1@3}.",
        cells: a.map((v) => ({ value: v, tone: v === 1 ? ("match" as const) : ("idle" as const) })),
        stackItems: [
          { value: "2@2", tone: "active" as const },
          { value: "1@3", tone: "match" as const },
        ],
        note: "dropped 3",
      },
      arrayFrame("Answer", "Keys left in the heap: 1 and 2.", [1, 2], { 0: "match", 1: "match" }, {
        note: "return [1,2]",
      }),
    ];
  })(),
};

export const kthLargestTopKSolution: ProblemSolution = {
  approach:
    "Maintain a min-heap of the k largest values seen. After the scan, the root is the kth largest. O(n log k).",
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
    for (int i = k; i < (int)nums.size(); i++) {
        if (nums[i] > h.top()) { h.pop(); h.push(nums[i]); }
    }
    return h.top();
}`,
    `int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> h = new PriorityQueue<>();
    for (int i = 0; i < k; i++) h.offer(nums[i]);
    for (int i = k; i < nums.length; i++) {
        if (nums[i] > h.peek()) { h.poll(); h.offer(nums[i]); }
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
  frames: (() => {
    const a = [3, 2, 1, 5, 6, 4];
    const k = 2;
    const heap: number[] = [];
    const frames = [
      arrayFrame("Find 2nd largest", "Min-heap of size k. Root is the kth among current top-k.", a, {}, {
        note: "k = 2",
      }),
    ];
    for (let i = 0; i < a.length; i++) {
      heap.push(a[i]);
      heap.sort((x, y) => x - y);
      if (heap.length > k) heap.shift();
      frames.push({
        kind: "stack" as const,
        title: `Read ${a[i]}`,
        caption:
          heap.length < k
            ? "Heap not full — insert."
            : `Heap [${heap.join(", ")}]. Root ${heap[0]} is kth among these.`,
        cells: a.map((v, idx) => ({
          value: v,
          tone: idx === i ? ("active" as const) : idx < i ? ("done" as const) : ("idle" as const),
        })),
        stackItems: heap.map((v, idx) => ({
          value: String(v),
          tone: idx === 0 ? ("lo" as const) : ("idle" as const),
        })),
        note: `root = ${heap[0]}`,
      });
    }
    frames.push(
      arrayFrame("Answer 5", "Heap holds 5 and 6; min is the 2nd largest.", a, {
        3: "match",
        4: "match",
      }, { note: "return 5" }),
    );
    return frames;
  })(),
};

export const kClosestPointsToOriginSolution: ProblemSolution = {
  approach:
    "Max-heap of size k by squared distance; pop farthest when size > k. Remaining points are the k closest. O(n log k).",
  templates: langs(
    `import heapq
def kClosest(points, k):
    # max-heap via negated distance
    h = []
    for x, y in points:
        d = x * x + y * y
        heapq.heappush(h, (-d, x, y))
        if len(h) > k:
            heapq.heappop(h)
    return [[x, y] for _, x, y in h]`,
    `vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    auto dist = [](auto& p) { return 1LL * p[0] * p[0] + 1LL * p[1] * p[1]; };
    priority_queue<pair<long long, int>> h;
    for (int i = 0; i < (int)points.size(); i++) {
        h.push({dist(points[i]), i});
        if ((int)h.size() > k) h.pop();
    }
    vector<vector<int>> out;
    while (!h.empty()) { out.push_back(points[h.top().second]); h.pop(); }
    return out;
}`,
    `int[][] kClosest(int[][] points, int k) {
    PriorityQueue<int[]> h = new PriorityQueue<>((a, b) ->
        Integer.compare(b[0]*b[0]+b[1]*b[1], a[0]*a[0]+a[1]*a[1]));
    for (int[] p : points) {
        h.offer(p);
        if (h.size() > k) h.poll();
    }
    return h.toArray(new int[0][]);
}`,
    `function kClosest(points, k) {
  const dist = ([x, y]) => x * x + y * y;
  return [...points].sort((a, b) => dist(a) - dist(b)).slice(0, k);
}`,
  ),
  frames: (() => {
    const pts = ["(1,3)", "(-2,2)", "(2,1)", "(0,1)"];
    const d2 = [10, 8, 5, 1];
    return [
      arrayFrame("Points, k = 2", "Compare by x²+y². Keep a max-heap of size k (farthest on top).", pts, {}, {
        note: "k = 2",
      }),
      arrayFrame("Distances²", "d² = 10, 8, 5, 1.", d2, { 0: "hi", 3: "lo" }),
      {
        kind: "stack" as const,
        title: "Seed heap",
        caption: "Insert (1,3) and (−2,2). Max-heap root is farthest: d²=10.",
        cells: pts.map((v, i) => ({ value: v, tone: i < 2 ? ("active" as const) : ("idle" as const) })),
        stackItems: [
          { value: "(1,3)@10", tone: "hi" as const },
          { value: "(-2,2)@8", tone: "idle" as const },
        ],
      },
      {
        kind: "stack" as const,
        title: "Push (2,1) d²=5",
        caption: "5 < 10 → pop (1,3). Heap: (−2,2), (2,1).",
        cells: pts.map((v, i) => ({
          value: v,
          tone: i === 2 ? ("active" as const) : i === 0 ? ("skip" as const) : ("idle" as const),
        })),
        stackItems: [
          { value: "(-2,2)@8", tone: "hi" as const },
          { value: "(2,1)@5", tone: "idle" as const },
        ],
        note: "dropped (1,3)",
      },
      {
        kind: "stack" as const,
        title: "Push (0,1) d²=1",
        caption: "1 < 8 → pop (−2,2). Closest two remain.",
        cells: pts.map((v, i) => ({
          value: v,
          tone: i === 3 ? ("active" as const) : i === 1 ? ("skip" as const) : ("idle" as const),
        })),
        stackItems: [
          { value: "(2,1)@5", tone: "active" as const },
          { value: "(0,1)@1", tone: "match" as const },
        ],
      },
      arrayFrame(
        "Answer",
        "K closest: (0,1) and (2,1).",
        ["(0,1)", "(2,1)"],
        { 0: "match", 1: "match" },
        {
          pointers: [
            { name: "1st", index: 0, color: PTR.L },
            { name: "2nd", index: 1, color: PTR.R },
          ],
          note: "return 2 points",
        },
      ),
    ];
  })(),
};

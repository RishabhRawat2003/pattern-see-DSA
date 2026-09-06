import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const rangeSumQueryImmutableSolution: ProblemSolution = {
  approach:
    "Precompute prefix[i] = sum of first i elements; answer sum(L..R) as prefix[R+1] − prefix[L] in O(1) after O(n) build.",
  templates: langs(
    `class NumArray:
    def __init__(self, nums):
        self.pref = [0]
        for x in nums:
            self.pref.append(self.pref[-1] + x)
    def sumRange(self, left, right):
        return self.pref[right + 1] - self.pref[left]`,
    `class NumArray {
    vector<int> pref;
public:
    NumArray(vector<int>& nums) {
        pref = {0};
        for (int x : nums) pref.push_back(pref.back() + x);
    }
    int sumRange(int left, int right) {
        return pref[right + 1] - pref[left];
    }
};`,
    `class NumArray {
    int[] pref;
    public NumArray(int[] nums) {
        pref = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) pref[i + 1] = pref[i] + nums[i];
    }
    public int sumRange(int left, int right) {
        return pref[right + 1] - pref[left];
    }
}`,
    `class NumArray {
  constructor(nums) {
    this.pref = [0];
    for (const x of nums) this.pref.push(this.pref.at(-1) + x);
  }
  sumRange(left, right) {
    return this.pref[right + 1] - this.pref[left];
  }
}`,
  ),
  frames: (() => {
    const a = [-2, 0, 3, -5, 2, -1];
    const pref = [0];
    for (const x of a) pref.push(pref[pref.length - 1] + x);
    const frames = [
      arrayFrame(
        "Build prefix sums",
        "pref[i] stores the sum of the first i elements so any range is one subtraction.",
        a,
        {},
        { note: "pref starts [0]" },
      ),
    ];
    for (let i = 0; i < a.length; i++) {
      frames.push(
        arrayFrame(
          `pref[${i + 1}] = ${pref[i + 1]}`,
          `Add nums[${i}] = ${a[i]} → running total ${pref[i + 1]}.`,
          a,
          { [i]: "active" },
          { note: `pref = [${pref.slice(0, i + 2).join(", ")}…]` },
        ),
      );
    }
    frames.push(
      arrayFrame(
        "Query sumRange(0, 2)",
        `pref[3] − pref[0] = ${pref[3]} − ${pref[0]} = ${pref[3] - pref[0]} (−2+0+3).`,
        a,
        { 0: "window", 1: "window", 2: "window" },
        {
          window: [0, 2],
          pointers: [
            { name: "L", index: 0, color: PTR.L },
            { name: "R", index: 2, color: PTR.R },
          ],
          note: "answer = 1",
        },
      ),
    );
    frames.push(
      arrayFrame(
        "Query sumRange(2, 5)",
        `pref[6] − pref[2] = ${pref[6]} − ${pref[2]} = ${pref[6] - pref[2]} (3−5+2−1).`,
        a,
        { 2: "window", 3: "window", 4: "window", 5: "window" },
        {
          window: [2, 5],
          pointers: [
            { name: "L", index: 2, color: PTR.L },
            { name: "R", index: 5, color: PTR.R },
          ],
          note: "answer = −1",
        },
      ),
    );
    return frames;
  })(),
};

export const findPivotIndexSolution: ProblemSolution = {
  approach:
    "Total sum once; scan left-to-right keeping leftSum — pivot when leftSum equals total − leftSum − nums[i]. O(n) time, O(1) space.",
  templates: langs(
    `def pivotIndex(nums):
    total = sum(nums)
    left = 0
    for i, x in enumerate(nums):
        if left == total - left - x:
            return i
        left += x
    return -1`,
    `int pivotIndex(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0), left = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (left == total - left - nums[i]) return i;
        left += nums[i];
    }
    return -1;
}`,
    `int pivotIndex(int[] nums) {
    int total = 0, left = 0;
    for (int x : nums) total += x;
    for (int i = 0; i < nums.length; i++) {
        if (left == total - left - nums[i]) return i;
        left += nums[i];
    }
    return -1;
}`,
    `function pivotIndex(nums) {
  const total = nums.reduce((s, x) => s + x, 0);
  let left = 0;
  for (let i = 0; i < nums.length; i++) {
    if (left === total - left - nums[i]) return i;
    left += nums[i];
  }
  return -1;
}`,
  ),
  frames: (() => {
    const a = [1, 7, 3, 6, 5, 6];
    const total = a.reduce((s, x) => s + x, 0);
    const frames = [
      arrayFrame(
        "Find pivot index",
        `Total = ${total}. At index i, left sum should equal right sum (total − left − nums[i]).`,
        a,
        {},
        { note: `total = ${total}` },
      ),
    ];
    let left = 0;
    for (let i = 0; i < a.length; i++) {
      const right = total - left - a[i];
      const ok = left === right;
      const toneMap: Record<number, "lo" | "active" | "hi" | "match"> = {
        [i]: ok ? "match" : "active",
      };
      for (let j = 0; j < i; j++) toneMap[j] = "lo";
      for (let j = i + 1; j < a.length; j++) toneMap[j] = "hi";
      frames.push(
        arrayFrame(
          `i = ${i}, nums[i] = ${a[i]}`,
          ok
            ? `left ${left} == right ${right}. Pivot found.`
            : `left ${left} ≠ right ${right}. Keep scanning.`,
          a,
          toneMap,
          {
            pointers: [{ name: "i", index: i, color: PTR.M }],
            note: `left ${left} · right ${right}`,
          },
        ),
      );
      if (ok) break;
      left += a[i];
    }
    frames.push(
      arrayFrame(
        "Answer",
        "Index 3 is the pivot: 1+7+3 = 5+6 = 11.",
        a,
        { 0: "lo", 1: "lo", 2: "lo", 3: "match", 4: "hi", 5: "hi" },
        { pointers: [{ name: "pivot", index: 3, color: PTR.M }], note: "return 3" },
      ),
    );
    return frames;
  })(),
};

export const subarraySumEqualsKSolution: ProblemSolution = {
  approach:
    "Prefix sums + hashmap of prefix frequencies: for each prefix p, add count of (p − k). O(n) time, O(n) space.",
  templates: langs(
    `from collections import defaultdict
def subarraySum(nums, k):
    pref, ans, seen = 0, 0, defaultdict(int)
    seen[0] = 1
    for x in nums:
        pref += x
        ans += seen[pref - k]
        seen[pref] += 1
    return ans`,
    `int subarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> seen{{0, 1}};
    int pref = 0, ans = 0;
    for (int x : nums) {
        pref += x;
        ans += seen[pref - k];
        seen[pref]++;
    }
    return ans;
}`,
    `int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> seen = new HashMap<>();
    seen.put(0, 1);
    int pref = 0, ans = 0;
    for (int x : nums) {
        pref += x;
        ans += seen.getOrDefault(pref - k, 0);
        seen.put(pref, seen.getOrDefault(pref, 0) + 1);
    }
    return ans;
}`,
    `function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]);
  let pref = 0, ans = 0;
  for (const x of nums) {
    pref += x;
    ans += seen.get(pref - k) || 0;
    seen.set(pref, (seen.get(pref) || 0) + 1);
  }
  return ans;
}`,
  ),
  frames: (() => {
    const a = [1, 2, 3];
    const k = 3;
    const frames = [
      arrayFrame(
        "Subarrays summing to k = 3",
        "As prefix grows, look up how many earlier prefixes equal pref − k.",
        a,
        {},
        { note: "k = 3 · seen starts {0:1}" },
      ),
      {
        kind: "hashmap" as const,
        title: "After nums[0] = 1",
        caption: "pref = 1. Count of pref−k = −2 is 0. Record seen[1] = 1.",
        cells: a.map((value, i) => ({
          value,
          tone: i === 0 ? ("active" as const) : ("idle" as const),
        })),
        mapEntries: [
          { key: "0", value: "1", tone: "idle" as const },
          { key: "1", value: "1", tone: "active" as const },
        ],
        pointers: [{ name: "i", index: 0, color: PTR.M }],
        note: "ans = 0",
      },
      {
        kind: "hashmap" as const,
        title: "After nums[1] = 2",
        caption: "pref = 3. seen[3−3] = seen[0] = 1 → found [1,2]. ans = 1.",
        cells: a.map((value, i) => ({
          value,
          tone: i <= 1 ? (i === 1 ? ("active" as const) : ("window" as const)) : ("idle" as const),
        })),
        mapEntries: [
          { key: "0", value: "1", tone: "match" as const },
          { key: "1", value: "1", tone: "idle" as const },
          { key: "3", value: "1", tone: "active" as const },
        ],
        window: [0, 1] as [number, number],
        pointers: [{ name: "i", index: 1, color: PTR.M }],
        note: "ans = 1",
      },
      {
        kind: "hashmap" as const,
        title: "After nums[2] = 3",
        caption: "pref = 6. seen[6−3] = seen[3] = 1 → found [3]. ans = 2.",
        cells: a.map((value, i) => ({
          value,
          tone: i === 2 ? ("active" as const) : ("done" as const),
        })),
        mapEntries: [
          { key: "0", value: "1", tone: "idle" as const },
          { key: "1", value: "1", tone: "idle" as const },
          { key: "3", value: "1", tone: "match" as const },
          { key: "6", value: "1", tone: "active" as const },
        ],
        pointers: [{ name: "i", index: 2, color: PTR.M }],
        note: "ans = 2",
      },
      arrayFrame(
        "Answer",
        "Two subarrays: [1,2] and [3].",
        a,
        { 0: "match", 1: "match", 2: "match" },
        { note: "return 2" },
      ),
    ];
    return frames;
  })(),
};

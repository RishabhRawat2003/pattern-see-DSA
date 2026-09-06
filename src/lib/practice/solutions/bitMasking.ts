import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function numberOf1BitsFrames() {
  const bits = ["1", "0", "1", "1"];
  return [
    arrayFrame("n = 11 → 1011", "Count set bits. Brian Kernighan: n &= n-1 clears the lowest set bit each step.", bits, {
      0: "match",
      2: "match",
      3: "match",
    }, { note: "popcount" }),
    arrayFrame("Clear lowest", "1011 & 1010 → 1010. Cleared bit 0. count=1.", ["1", "0", "1", "0"], { 0: "done", 2: "match" }, {
      note: "count = 1",
    }),
    arrayFrame("Clear again", "1010 & 1001 → 1000. count=2.", ["1", "0", "0", "0"], { 0: "match" }, { note: "count = 2" }),
    arrayFrame("Last bit", "1000 & 0111 → 0. count=3. Done.", ["0", "0", "0", "0"], {}, { note: "count = 3" }),
    arrayFrame("Answer", "Eleven has three 1-bits. Loop runs once per set bit.", bits, { 0: "match", 2: "match", 3: "match" }, {
      note: "return 3",
    }),
  ];
}

function countingBitsFrames() {
  const a = [0, 1, 2, 3, 4, 5];
  return [
    arrayFrame(
      "ans[i] = popcount(i)",
      "DP: ans[i] = ans[i>>1] + (i&1). Reuse half's count plus the low bit.",
      a,
      {},
      { note: "n = 5" },
    ),
    arrayFrame("i = 0,1", "ans[0]=0. ans[1]=ans[0]+1=1.", [0, 1, 0, 0, 0, 0], { 0: "done", 1: "active" }, {
      pointers: [{ name: "i", index: 1, color: PTR.M }],
      note: "[0,1,…]",
    }),
    arrayFrame("i = 2,3", "2→ans[1]+0=1. 3→ans[1]+1=2.", [0, 1, 1, 2, 0, 0], { 2: "active", 3: "match" }, {
      note: "build up",
    }),
    arrayFrame("i = 4,5", "4→ans[2]+0=1. 5→ans[2]+1=2.", [0, 1, 1, 2, 1, 2], { 4: "active", 5: "match" }, {
      note: "done",
    }),
    arrayFrame("Answer", "For 0..5: [0,1,1,2,1,2]. O(n) time, O(n) space for the array.", [0, 1, 1, 2, 1, 2], {
      0: "done",
      1: "done",
      2: "done",
      3: "done",
      4: "done",
      5: "done",
    }, { note: "return ans" }),
  ];
}

function subsetsBitMaskingFrames() {
  const items = ["A", "B", "C"];
  return [
    arrayFrame("n = 3 → masks 0..7", "Bit i on means include items[i]. Enumerate every mask — no recursion.", items, {}, {
      note: "2ⁿ = 8",
    }),
    arrayFrame("mask 0 = 000", "No bits set → empty subset {}.", items, { 0: "skip", 1: "skip", 2: "skip" }, {
      note: "{}",
    }),
    arrayFrame("mask 1 = 001", "Bit 0 → {A}.", items, { 0: "match", 1: "skip", 2: "skip" }, { note: "{A}" }),
    arrayFrame("mask 5 = 101", "Bits 0 and 2 → {A,C}.", items, { 0: "match", 1: "skip", 2: "match" }, {
      note: "{A,C}",
    }),
    arrayFrame("mask 7 = 111", "All bits → {A,B,C}.", items, { 0: "match", 1: "match", 2: "match" }, {
      note: "{A,B,C}",
    }),
    arrayFrame("All subsets", "Loop mask in 0..(1<<n)-1 and collect. O(n·2ⁿ) time.", items, { 0: "done", 1: "done", 2: "done" }, {
      note: "8 subsets",
    }),
  ];
}

export const numberOf1BitsSolution: ProblemSolution = {
  approach:
    "While n≠0: n &= n-1 clears the lowest set bit; increment count. Runs once per 1-bit. O(popcount) time, O(1) space.",
  templates: langs(
    `def hammingWeight(n):
    c = 0
    while n:
        n &= n - 1
        c += 1
    return c`,
    `int hammingWeight(uint32_t n) {
    int c = 0;
    while (n) { n &= n - 1; c++; }
    return c;
}`,
    `int hammingWeight(int n) {
    int c = 0;
    while (n != 0) { n &= n - 1; c++; }
    return c;
}`,
    `function hammingWeight(n) {
  let c = 0;
  while (n) { n &= n - 1; c++; }
  return c;
}`,
  ),
  frames: numberOf1BitsFrames(),
};

export const countingBitsSolution: ProblemSolution = {
  approach:
    "DP: ans[i] = ans[i>>1] + (i&1). Each number reuses the popcount of its half plus the LSB. O(n) time, O(n) space.",
  templates: langs(
    `def countBits(n):
    ans = [0] * (n + 1)
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
    return ans`,
    `vector<int> countBits(int n) {
    vector<int> ans(n + 1);
    for (int i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);
    return ans;
}`,
    `int[] countBits(int n) {
    int[] ans = new int[n + 1];
    for (int i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);
    return ans;
}`,
    `function countBits(n) {
  const ans = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);
  return ans;
}`,
  ),
  frames: countingBitsFrames(),
};

export const subsetsBitMaskingSolution: ProblemSolution = {
  approach:
    "For mask in 0..(1<<n)-1, include nums[i] iff bit i is set. Generates the power set without recursion. O(n·2ⁿ) time.",
  templates: langs(
    `def subsets(nums):
    n, out = len(nums), []
    for mask in range(1 << n):
        out.append([nums[i] for i in range(n) if mask & (1 << i)])
    return out`,
    `vector<vector<int>> subsets(vector<int>& nums) {
    int n = nums.size();
    vector<vector<int>> out;
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> cur;
        for (int i = 0; i < n; i++) if (mask & (1 << i)) cur.push_back(nums[i]);
        out.push_back(cur);
    }
    return out;
}`,
    `List<List<Integer>> subsets(int[] nums) {
    int n = nums.length;
    List<List<Integer>> out = new ArrayList<>();
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> cur = new ArrayList<>();
        for (int i = 0; i < n; i++) if ((mask & (1 << i)) != 0) cur.add(nums[i]);
        out.add(cur);
    }
    return out;
}`,
    `function subsets(nums) {
  const n = nums.length, out = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const cur = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) cur.push(nums[i]);
    out.push(cur);
  }
  return out;
}`,
  ),
  frames: subsetsBitMaskingFrames(),
};

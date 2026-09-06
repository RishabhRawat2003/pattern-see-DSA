import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const maximumSubarraySolution: ProblemSolution = {
  approach:
    "Kadane: at each index take max(nums[i], cur+nums[i]) as the best sum ending here; track the global max. O(n) time, O(1) space.",
  templates: langs(
    `def maxSubArray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best`,
    `int maxSubArray(vector<int>& nums) {
    int best = nums[0], cur = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        cur = max(nums[i], cur + nums[i]);
        best = max(best, cur);
    }
    return best;
}`,
    `int maxSubArray(int[] nums) {
    int best = nums[0], cur = nums[0];
    for (int i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        best = Math.max(best, cur);
    }
    return best;
}`,
    `function maxSubArray(nums) {
  let best = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
  ),
  frames: (() => {
    const a = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    const frames = [
      arrayFrame(
        "Maximum subarray sum",
        "Extend the current run or restart at i. Keep the best sum seen.",
        a,
      ),
    ];
    let cur = a[0];
    let best = a[0];
    let start = 0;
    let bestL = 0;
    let bestR = 0;
    frames.push(
      arrayFrame(
        "Start at i = 0",
        `cur = best = ${a[0]}.`,
        a,
        { 0: "active" },
        {
          pointers: [{ name: "i", index: 0, color: PTR.M }],
          note: `cur ${cur} · best ${best}`,
        },
      ),
    );
    for (let i = 1; i < a.length; i++) {
      if (cur + a[i] < a[i]) {
        cur = a[i];
        start = i;
      } else {
        cur += a[i];
      }
      if (cur > best) {
        best = cur;
        bestL = start;
        bestR = i;
      }
      const toneMap: Record<number, "window" | "active" | "match"> = {};
      for (let j = start; j <= i; j++) toneMap[j] = "window";
      toneMap[i] = "active";
      frames.push(
        arrayFrame(
          `i = ${i}, value ${a[i]}`,
          `Best ending here = ${cur}. Global best = ${best} on [${bestL}…${bestR}].`,
          a,
          toneMap,
          {
            window: [start, i],
            pointers: [{ name: "i", index: i, color: PTR.M }],
            note: `cur ${cur} · best ${best}`,
          },
        ),
      );
    }
    const done: Record<number, "match"> = {};
    for (let j = bestL; j <= bestR; j++) done[j] = "match";
    frames.push(
      arrayFrame(
        "Answer",
        `Best subarray [4, −1, 2, 1] sums to ${best}.`,
        a,
        done,
        { window: [bestL, bestR], note: `return ${best}` },
      ),
    );
    return frames;
  })(),
};

export const maximumProductSubarraySolution: ProblemSolution = {
  approach:
    "Track both max and min product ending here (sign flips from negatives); update global max each step. O(n) time, O(1) space.",
  templates: langs(
    `def maxProduct(nums):
    best = mx = mn = nums[0]
    for x in nums[1:]:
        candidates = (x, mx * x, mn * x)
        mx, mn = max(candidates), min(candidates)
        best = max(best, mx)
    return best`,
    `int maxProduct(vector<int>& nums) {
    int best = nums[0], mx = nums[0], mn = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        int x = nums[i];
        int a = x, b = mx * x, c = mn * x;
        mx = max({a, b, c});
        mn = min({a, b, c});
        best = max(best, mx);
    }
    return best;
}`,
    `int maxProduct(int[] nums) {
    int best = nums[0], mx = nums[0], mn = nums[0];
    for (int i = 1; i < nums.length; i++) {
        int x = nums[i];
        int a = x, b = mx * x, c = mn * x;
        mx = Math.max(a, Math.max(b, c));
        mn = Math.min(a, Math.min(b, c));
        best = Math.max(best, mx);
    }
    return best;
}`,
    `function maxProduct(nums) {
  let best = nums[0], mx = nums[0], mn = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    const cand = [x, mx * x, mn * x];
    mx = Math.max(...cand);
    mn = Math.min(...cand);
    best = Math.max(best, mx);
  }
  return best;
}`,
  ),
  frames: (() => {
    const a = [2, 3, -2, 4];
    const frames = [
      arrayFrame(
        "Maximum product subarray",
        "Keep max and min product ending at i — a negative can flip min into the new max.",
        a,
        {},
        { note: "mx = mn = best = 2" },
      ),
      arrayFrame(
        "i = 1, value 3",
        "Candidates 3, 2·3, 2·3 → mx=6, mn=3. best=6.",
        a,
        { 0: "window", 1: "active" },
        {
          window: [0, 1],
          pointers: [{ name: "i", index: 1, color: PTR.M }],
          note: "mx 6 · mn 3 · best 6",
        },
      ),
      arrayFrame(
        "i = 2, value −2",
        "Candidates −2, 6·(−2), 3·(−2) → mx=−2, mn=−12. best stays 6.",
        a,
        { 0: "window", 1: "window", 2: "active" },
        {
          window: [0, 2],
          pointers: [{ name: "i", index: 2, color: PTR.M }],
          note: "mx −2 · mn −12 · best 6",
        },
      ),
      arrayFrame(
        "i = 3, value 4",
        "Candidates 4, (−2)·4, (−12)·4 → mx=4, mn=−48. best stays 6 ([2,3]).",
        a,
        { 3: "active" },
        {
          pointers: [{ name: "i", index: 3, color: PTR.M }],
          note: "mx 4 · mn −48 · best 6",
        },
      ),
      arrayFrame(
        "Answer",
        "Max product is 6 from subarray [2, 3].",
        a,
        { 0: "match", 1: "match" },
        { window: [0, 1], note: "return 6" },
      ),
    ];
    return frames;
  })(),
};

export const maximumSumCircularSubarraySolution: ProblemSolution = {
  approach:
    "Best is max(standard Kadane, total − min-subarray). The wrap-around case is total minus the worst middle gap. Handle all-negative carefully. O(n).",
  templates: langs(
    `def maxSubarraySumCircular(nums):
    total = cur_max = cur_min = 0
    max_kadane = min_kadane = nums[0]
    for x in nums:
        total += x
        cur_max = max(x, cur_max + x)
        max_kadane = max(max_kadane, cur_max)
        cur_min = min(x, cur_min + x)
        min_kadane = min(min_kadane, cur_min)
    if max_kadane < 0:
        return max_kadane
    return max(max_kadane, total - min_kadane)`,
    `int maxSubarraySumCircular(vector<int>& nums) {
    int total = 0, curMax = 0, curMin = 0;
    int maxK = nums[0], minK = nums[0];
    for (int x : nums) {
        total += x;
        curMax = max(x, curMax + x);
        maxK = max(maxK, curMax);
        curMin = min(x, curMin + x);
        minK = min(minK, curMin);
    }
    if (maxK < 0) return maxK;
    return max(maxK, total - minK);
}`,
    `int maxSubarraySumCircular(int[] nums) {
    int total = 0, curMax = 0, curMin = 0;
    int maxK = nums[0], minK = nums[0];
    for (int x : nums) {
        total += x;
        curMax = Math.max(x, curMax + x);
        maxK = Math.max(maxK, curMax);
        curMin = Math.min(x, curMin + x);
        minK = Math.min(minK, curMin);
    }
    if (maxK < 0) return maxK;
    return Math.max(maxK, total - minK);
}`,
    `function maxSubarraySumCircular(nums) {
  let total = 0, curMax = 0, curMin = 0;
  let maxK = nums[0], minK = nums[0];
  for (const x of nums) {
    total += x;
    curMax = Math.max(x, curMax + x);
    maxK = Math.max(maxK, curMax);
    curMin = Math.min(x, curMin + x);
    minK = Math.min(minK, curMin);
  }
  if (maxK < 0) return maxK;
  return Math.max(maxK, total - minK);
}`,
  ),
  frames: (() => {
    const a = [5, -3, 5];
    return [
      arrayFrame(
        "Circular max subarray",
        "Either the best linear segment, or total minus the worst middle segment (wrap-around).",
        a,
        {},
        { note: "total = 7" },
      ),
      arrayFrame(
        "Linear Kadane → 7",
        "Best contiguous non-wrap sum is the whole array: 5+(−3)+5 = 7.",
        a,
        { 0: "window", 1: "window", 2: "window" },
        { window: [0, 2], note: "maxKadane = 7" },
      ),
      arrayFrame(
        "Min subarray = −3",
        "Worst middle gap is the single −3. Wrapping sum = total − min = 7 − (−3) = 10.",
        a,
        { 1: "hi" },
        {
          pointers: [{ name: "min", index: 1, color: PTR.R }],
          note: "wrap = 10",
        },
      ),
      arrayFrame(
        "Wrap-around view",
        "The two 5's meet across the circular boundary: 5 + 5 = 10.",
        a,
        { 0: "match", 2: "match" },
        { note: "ends join" },
      ),
      arrayFrame(
        "Answer",
        "max(7, 10) = 10.",
        a,
        { 0: "match", 2: "match" },
        { note: "return 10" },
      ),
    ];
  })(),
};

import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const partitionEqualSolution: ProblemSolution = {
  approach:
    "Odd total → impossible. Else subset-sum to half with 0/1 knapsack (backward OR). Same core as partition-equal-subset-sum. O(n·sum).",
  templates: langs(
    `def canPartition(nums):
    s = sum(nums)
    if s % 2:
        return False
    target = s // 2
    can = [True] + [False] * target
    for x in nums:
        for t in range(target, x - 1, -1):
            can[t] = can[t] or can[t - x]
    return can[target]`,
    `bool canPartition(vector<int>& nums) {
    int s = accumulate(nums.begin(), nums.end(), 0);
    if (s % 2) return false;
    int target = s / 2;
    vector<char> can(target + 1);
    can[0] = 1;
    for (int x : nums)
        for (int t = target; t >= x; t--)
            can[t] = can[t] || can[t - x];
    return can[target];
}`,
    `boolean canPartition(int[] nums) {
    int s = 0;
    for (int x : nums) s += x;
    if (s % 2 != 0) return false;
    int target = s / 2;
    boolean[] can = new boolean[target + 1];
    can[0] = true;
    for (int x : nums)
        for (int t = target; t >= x; t--)
            can[t] = can[t] || can[t - x];
    return can[target];
}`,
    `function canPartition(nums) {
  const s = nums.reduce((a, b) => a + b, 0);
  if (s % 2) return false;
  const target = s / 2;
  const can = Array(target + 1).fill(false);
  can[0] = true;
  for (const x of nums) {
    for (let t = target; t >= x; t--) can[t] = can[t] || can[t - x];
  }
  return can[target];
}`,
  ),
  frames: (() => {
    const nums = [1, 5, 11, 5];
    return [
      arrayFrame(
        "Partition check",
        "Sum 22 is even → try to build a subset of weight 11.",
        nums,
        {},
        { note: "half = 11" },
      ),
      arrayFrame(
        "1 and first 5",
        "Reachable sums include 1, 5, 6.",
        nums,
        { 0: "window", 1: "window" },
        {
          pointers: [{ name: "i", index: 1, color: PTR.M }],
          note: "can: 0,1,5,6",
        },
      ),
      arrayFrame(
        "Take 11",
        "11 alone equals half — one side is {11}, other {1,5,5}.",
        nums,
        { 2: "match" },
        {
          pointers: [{ name: "i", index: 2, color: PTR.M }],
          note: "can[11]=T",
        },
      ),
      arrayFrame(
        "Second 5 optional",
        "Also 1+5+5 works. Either witness proves partitionability.",
        nums,
        { 0: "match", 1: "match", 3: "match" },
        { note: "alt subset" },
      ),
      arrayFrame(
        "Answer",
        "Target half is reachable → true.",
        nums,
        { 2: "done" },
        { note: "return true" },
      ),
    ];
  })(),
};

export const lastStoneWeightIISolution: ProblemSolution = {
  approach:
    "Smashing a−b is like putting stones into +/− piles. Minimize |2P − sum| ⇒ maximize subset sum P ≤ sum/2. Same DP as partition; answer = sum − 2·bestP.",
  templates: langs(
    `def lastStoneWeightII(stones):
    s = sum(stones)
    target = s // 2
    can = [True] + [False] * target
    for x in stones:
        for t in range(target, x - 1, -1):
            can[t] = can[t] or can[t - x]
    best = max(i for i in range(target + 1) if can[i])
    return s - 2 * best`,
    `int lastStoneWeightII(vector<int>& stones) {
    int s = accumulate(stones.begin(), stones.end(), 0);
    int target = s / 2;
    vector<char> can(target + 1);
    can[0] = 1;
    for (int x : stones)
        for (int t = target; t >= x; t--)
            can[t] = can[t] || can[t - x];
    int best = 0;
    for (int i = target; i >= 0; i--) if (can[i]) { best = i; break; }
    return s - 2 * best;
}`,
    `int lastStoneWeightII(int[] stones) {
    int s = 0;
    for (int x : stones) s += x;
    int target = s / 2;
    boolean[] can = new boolean[target + 1];
    can[0] = true;
    for (int x : stones)
        for (int t = target; t >= x; t--)
            can[t] = can[t] || can[t - x];
    int best = 0;
    for (int i = target; i >= 0; i--) if (can[i]) { best = i; break; }
    return s - 2 * best;
}`,
    `function lastStoneWeightII(stones) {
  const s = stones.reduce((a, b) => a + b, 0);
  const target = (s / 2) | 0;
  const can = Array(target + 1).fill(false);
  can[0] = true;
  for (const x of stones) {
    for (let t = target; t >= x; t--) can[t] = can[t] || can[t - x];
  }
  let best = 0;
  for (let i = target; i >= 0; i--) if (can[i]) { best = i; break; }
  return s - 2 * best;
}`,
  ),
  frames: (() => {
    const stones = [2, 7, 4, 1, 8, 1];
    return [
      arrayFrame(
        "Stones",
        "Each smash replaces a,b with |a−b|. Equivalent to two piles; leftover = |sum⁺ − sum⁻|.",
        stones,
        {},
        { note: "sum = 23" },
      ),
      arrayFrame(
        "Target ≤ 11",
        "Maximize subset ≤ ⌊23/2⌋ = 11 so the two piles are as equal as possible.",
        stones,
        {},
        { note: "target 11" },
      ),
      arrayFrame(
        "Build can[]",
        "0/1 knapsack: place each stone backward into achievable sums.",
        ["T", "T", "T", "T", "T", "T", "T", "T", "T", "T", "T", "T"],
        { 11: "active" },
        { note: "many sums reachable" },
      ),
      arrayFrame(
        "Best P = 11",
        "e.g. {2,8,1} or {7,4}. Piles 11 vs 12.",
        stones,
        { 0: "match", 4: "match", 5: "match" },
        { note: "bestP = 11" },
      ),
      arrayFrame(
        "Leftover",
        "sum − 2P = 23 − 22 = 1. That is the last stone weight.",
        stones,
        { 0: "done", 4: "done", 5: "done" },
        { note: "return 1" },
      ),
    ];
  })(),
};

export const partitionToKSubsetsPartitionSolution: ProblemSolution = {
  approach:
    "Same as partition-to-k-equal-sum-subsets under the partition-equal family: sum%k==0, then DFS fill k buckets of size sum/k with used[] + pruning.",
  templates: langs(
    `def canPartitionKSubsets(nums, k):
    total = sum(nums)
    if total % k:
        return False
    target = total // k
    nums.sort(reverse=True)
    used = [False] * len(nums)
    def dfs(i, buckets, remain):
        if buckets == 0:
            return True
        if remain == 0:
            return dfs(0, buckets - 1, target)
        for j in range(i, len(nums)):
            if used[j] or nums[j] > remain:
                continue
            used[j] = True
            if dfs(j + 1, buckets, remain - nums[j]):
                return True
            used[j] = False
            if remain == target:
                break
        return False
    return dfs(0, k, target)`,
    `bool dfsPart(vector<int>& a, vector<char>& used, int i, int buckets, int remain, int target) {
    if (buckets == 0) return true;
    if (remain == 0) return dfsPart(a, used, 0, buckets - 1, target, target);
    for (int j = i; j < (int)a.size(); j++) {
        if (used[j] || a[j] > remain) continue;
        used[j] = 1;
        if (dfsPart(a, used, j + 1, buckets, remain - a[j], target)) return true;
        used[j] = 0;
        if (remain == target) break;
    }
    return false;
}
bool canPartitionKSubsets(vector<int>& nums, int k) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total % k) return false;
    int target = total / k;
    sort(nums.rbegin(), nums.rend());
    vector<char> used(nums.size());
    return dfsPart(nums, used, 0, k, target, target);
}`,
    `boolean dfsPart(int[] a, boolean[] used, int i, int buckets, int remain, int target) {
    if (buckets == 0) return true;
    if (remain == 0) return dfsPart(a, used, 0, buckets - 1, target, target);
    for (int j = i; j < a.length; j++) {
        if (used[j] || a[j] > remain) continue;
        used[j] = true;
        if (dfsPart(a, used, j + 1, buckets, remain - a[j], target)) return true;
        used[j] = false;
        if (remain == target) break;
    }
    return false;
}
boolean canPartitionKSubsets(int[] nums, int k) {
    int total = 0;
    for (int x : nums) total += x;
    if (total % k != 0) return false;
    int target = total / k;
    Arrays.sort(nums);
    for (int i = 0, j = nums.length - 1; i < j; i++, j--) {
        int t = nums[i]; nums[i] = nums[j]; nums[j] = t;
    }
    return dfsPart(nums, new boolean[nums.length], 0, k, target, target);
}`,
    `function canPartitionKSubsets(nums, k) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % k) return false;
  const target = total / k;
  nums.sort((a, b) => b - a);
  const used = Array(nums.length).fill(false);
  function dfs(i, buckets, remain) {
    if (buckets === 0) return true;
    if (remain === 0) return dfs(0, buckets - 1, target);
    for (let j = i; j < nums.length; j++) {
      if (used[j] || nums[j] > remain) continue;
      used[j] = true;
      if (dfs(j + 1, buckets, remain - nums[j])) return true;
      used[j] = false;
      if (remain === target) break;
    }
    return false;
  }
  return dfs(0, k, target);
}`,
  ),
  frames: (() => {
    const a = [4, 3, 2, 3, 5, 2, 1];
    return [
      arrayFrame(
        "k-partition",
        "Equal-sum partition into k groups — subset DP idea + search.",
        a,
        {},
        { note: "k=4 · target 5" },
      ),
      arrayFrame(
        "First group {5}",
        "Largest unused stone fills a whole group alone.",
        [5, 4, 3, 3, 2, 2, 1],
        { 0: "match" },
        {
          pointers: [{ name: "j", index: 0, color: PTR.M }],
          note: "1 / 4 done",
        },
      ),
      arrayFrame(
        "{4,1}",
        "Second group: 4 then search for remain 1.",
        [5, 4, 3, 3, 2, 2, 1],
        { 0: "done", 1: "match", 6: "match" },
        { note: "2 / 4" },
      ),
      arrayFrame(
        "{3,2}",
        "Third group closes with 3+2.",
        [5, 4, 3, 3, 2, 2, 1],
        { 0: "done", 1: "done", 2: "match", 4: "match", 6: "done" },
        { note: "3 / 4" },
      ),
      arrayFrame(
        "Last {3,2}",
        "Leftover numbers form the final group — success.",
        [5, 4, 3, 3, 2, 2, 1],
        {
          0: "match",
          1: "match",
          2: "match",
          3: "match",
          4: "match",
          5: "match",
          6: "match",
        },
        { note: "return true" },
      ),
    ];
  })(),
};

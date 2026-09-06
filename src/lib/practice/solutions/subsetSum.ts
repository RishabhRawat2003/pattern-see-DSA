import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const partitionEqualSubsetSumSolution: ProblemSolution = {
  approach:
    "If total sum is odd → false. Else 0/1 knapsack subset-sum to half: can[t] |= can[t−x] filled backward. O(n·sum).",
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
        "[1,5,11,5]",
        "Sum = 22, half = 11. Ask: can a subset sum to 11?",
        nums,
        {},
        { note: "target 11" },
      ),
      arrayFrame(
        "can[0]=true",
        "Boolean knapsack over sums 0…11. Empty subset makes 0.",
        ["T", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F"],
        { 0: "lo" },
        { note: "indices = sums" },
      ),
      arrayFrame(
        "Place 1",
        "can[1] becomes true.",
        ["T", "T", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F"],
        { 1: "active" },
        {
          pointers: [{ name: "x", index: 1, color: PTR.M }],
          note: "x=1",
        },
      ),
      arrayFrame(
        "Place 5",
        "can[5] and can[6]=can[1]+5 turn true.",
        ["T", "T", "F", "F", "F", "T", "T", "F", "F", "F", "F", "F"],
        { 5: "active", 6: "window" },
        { note: "x=5" },
      ),
      arrayFrame(
        "Place 11",
        "11 itself hits the target — one subset is {11}.",
        nums,
        { 2: "match" },
        {
          pointers: [{ name: "x", index: 2, color: PTR.M }],
          note: "can[11]=T",
        },
      ),
      arrayFrame(
        "Also 1+5+5",
        "Second 5 fills can[11] via 6 as well. Partition exists.",
        nums,
        { 0: "match", 1: "match", 3: "match" },
        { note: "[11] | [1,5,5]" },
      ),
      arrayFrame(
        "Answer",
        "can[11] is true → return true.",
        nums,
        { 2: "done" },
        { note: "return true" },
      ),
    ];
  })(),
};

export const targetSumSubsetSolution: ProblemSolution = {
  approach:
    "Assign +/− to reach target. Let P−N = target and P+N = sum ⇒ P = (sum+target)/2. Count subsets with sum P (0/1 knapsack). Impossible if sum+target odd or |target|>sum.",
  templates: langs(
    `def findTargetSumWays(nums, target):
    s = sum(nums)
    if abs(target) > s or (s + target) % 2:
        return 0
    need = (s + target) // 2
    dp = [1] + [0] * need
    for x in nums:
        for t in range(need, x - 1, -1):
            dp[t] += dp[t - x]
    return dp[need]`,
    `int findTargetSumWays(vector<int>& nums, int target) {
    int s = accumulate(nums.begin(), nums.end(), 0);
    if (abs(target) > s || (s + target) % 2) return 0;
    int need = (s + target) / 2;
    vector<int> dp(need + 1);
    dp[0] = 1;
    for (int x : nums)
        for (int t = need; t >= x; t--)
            dp[t] += dp[t - x];
    return dp[need];
}`,
    `int findTargetSumWays(int[] nums, int target) {
    int s = 0;
    for (int x : nums) s += x;
    if (Math.abs(target) > s || (s + target) % 2 != 0) return 0;
    int need = (s + target) / 2;
    int[] dp = new int[need + 1];
    dp[0] = 1;
    for (int x : nums)
        for (int t = need; t >= x; t--)
            dp[t] += dp[t - x];
    return dp[need];
}`,
    `function findTargetSumWays(nums, target) {
  const s = nums.reduce((a, b) => a + b, 0);
  if (Math.abs(target) > s || (s + target) % 2) return 0;
  const need = (s + target) / 2;
  const dp = Array(need + 1).fill(0);
  dp[0] = 1;
  for (const x of nums) {
    for (let t = need; t >= x; t--) dp[t] += dp[t - x];
  }
  return dp[need];
}`,
  ),
  frames: (() => {
    const nums = [1, 1, 1, 1, 1];
    return [
      arrayFrame(
        "nums · target 3",
        "Sum=5. P = (5+3)/2 = 4 — count subsets summing to 4 (rest get −).",
        nums,
        {},
        { note: "need = 4" },
      ),
      arrayFrame(
        "dp[0]=1",
        "Ways to make each sum. One way to make 0.",
        [1, 0, 0, 0, 0],
        { 0: "lo" },
        { note: "dp 0..4" },
      ),
      arrayFrame(
        "First few 1s",
        "Each 1 doubles reachable paths. After three 1s: binomial row.",
        [1, 3, 3, 1, 0],
        { 1: "active", 2: "window" },
        { note: "3 ones placed" },
      ),
      arrayFrame(
        "Fourth 1",
        "dp becomes [1,4,6,4,1] — classic combinations.",
        [1, 4, 6, 4, 1],
        { 4: "active" },
        { note: "dp[4]=1 so far" },
      ),
      arrayFrame(
        "Fifth 1",
        "dp[4] += dp[3] → 1+4 = 5 ways to pick a positive subset of sum 4.",
        [1, 5, 10, 10, 5],
        { 4: "match" },
        { note: "dp[4]=5" },
      ),
      arrayFrame(
        "Answer",
        "5 assignments of ± give sum 3 (e.g. −−−++ and permutations).",
        nums,
        { 0: "match", 1: "match", 2: "match", 3: "match", 4: "match" },
        { note: "return 5" },
      ),
    ];
  })(),
};

export const partitionToKEqualSumSubsetsSolution: ProblemSolution = {
  approach:
    "Target = sum/k. Backtrack: try placing each unused number into the current bucket; when bucket hits target, start a new one. Sort desc + prune for speed. Bitmask DP also works for small n.",
  templates: langs(
    `def canPartitionKSubsets(nums, k):
    s = sum(nums)
    if s % k:
        return False
    target = s // k
    nums.sort(reverse=True)
    used = [False] * len(nums)
    def dfs(start, buckets, remain):
        if buckets == 0:
            return True
        if remain == 0:
            return dfs(0, buckets - 1, target)
        for i in range(start, len(nums)):
            if used[i] or nums[i] > remain:
                continue
            used[i] = True
            if dfs(i + 1, buckets, remain - nums[i]):
                return True
            used[i] = False
            if remain == target:
                break
        return False
    return dfs(0, k, target)`,
    `bool dfsK(vector<int>& a, vector<char>& used, int start, int buckets, int remain, int target) {
    if (buckets == 0) return true;
    if (remain == 0) return dfsK(a, used, 0, buckets - 1, target, target);
    for (int i = start; i < (int)a.size(); i++) {
        if (used[i] || a[i] > remain) continue;
        used[i] = 1;
        if (dfsK(a, used, i + 1, buckets, remain - a[i], target)) return true;
        used[i] = 0;
        if (remain == target) break;
    }
    return false;
}
bool canPartitionKSubsets(vector<int>& nums, int k) {
    int s = accumulate(nums.begin(), nums.end(), 0);
    if (s % k) return false;
    int target = s / k;
    sort(nums.rbegin(), nums.rend());
    vector<char> used(nums.size());
    return dfsK(nums, used, 0, k, target, target);
}`,
    `boolean dfsK(int[] a, boolean[] used, int start, int buckets, int remain, int target) {
    if (buckets == 0) return true;
    if (remain == 0) return dfsK(a, used, 0, buckets - 1, target, target);
    for (int i = start; i < a.length; i++) {
        if (used[i] || a[i] > remain) continue;
        used[i] = true;
        if (dfsK(a, used, i + 1, buckets, remain - a[i], target)) return true;
        used[i] = false;
        if (remain == target) break;
    }
    return false;
}
boolean canPartitionKSubsets(int[] nums, int k) {
    int s = 0;
    for (int x : nums) s += x;
    if (s % k != 0) return false;
    int target = s / k;
    Arrays.sort(nums);
    for (int i = 0, j = nums.length - 1; i < j; i++, j--) {
        int t = nums[i]; nums[i] = nums[j]; nums[j] = t;
    }
    return dfsK(nums, new boolean[nums.length], 0, k, target, target);
}`,
    `function canPartitionKSubsets(nums, k) {
  const s = nums.reduce((a, b) => a + b, 0);
  if (s % k) return false;
  const target = s / k;
  nums.sort((a, b) => b - a);
  const used = Array(nums.length).fill(false);
  function dfs(start, buckets, remain) {
    if (buckets === 0) return true;
    if (remain === 0) return dfs(0, buckets - 1, target);
    for (let i = start; i < nums.length; i++) {
      if (used[i] || nums[i] > remain) continue;
      used[i] = true;
      if (dfs(i + 1, buckets, remain - nums[i])) return true;
      used[i] = false;
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
        "nums · k = 4",
        "Sum = 20 → each subset must sum to 5.",
        a,
        {},
        { note: "target 5" },
      ),
      arrayFrame(
        "Sort desc",
        "Try large numbers first; prune early when a value exceeds remain.",
        [5, 4, 3, 3, 2, 2, 1],
        { 0: "active" },
        { note: "5 first" },
      ),
      arrayFrame(
        "Bucket 1 = {5}",
        "5 alone fills a bucket. Start next bucket with remain 5.",
        [5, 4, 3, 3, 2, 2, 1],
        { 0: "match" },
        { note: "buckets left 3" },
      ),
      arrayFrame(
        "Bucket 2 = {4,1}",
        "Take 4, then 1 completes the sum.",
        [5, 4, 3, 3, 2, 2, 1],
        { 0: "done", 1: "match", 6: "match" },
        { note: "4+1=5" },
      ),
      arrayFrame(
        "Bucket 3 = {3,2}",
        "Next unused 3 + 2 = 5.",
        [5, 4, 3, 3, 2, 2, 1],
        { 0: "done", 1: "done", 2: "match", 4: "match", 6: "done" },
        { note: "3+2=5" },
      ),
      arrayFrame(
        "Last bucket",
        "Remaining 3+2 = 5. All four buckets filled.",
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

import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { CellTone, Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function gridFrame(
  title: string,
  caption: string,
  rows: (string | number)[][],
  hot: [number, number][] = [],
  extra: Partial<Frame> = {},
): Frame {
  const marks = new Set(hot.map(([r, c]) => `${r},${c}`));
  return {
    kind: "grid",
    title,
    caption,
    grid: rows.map((row, r) =>
      row.map((value, c) => ({
        value: String(value),
        tone: (marks.has(`${r},${c}`) ? "active" : "idle") as CellTone,
      })),
    ),
    ...extra,
  };
}

export const partitionEqualKnapsackSolution: ProblemSolution = {
  approach:
    "If sum odd → false. Else 0/1 subset-sum to sum/2: fill boolean dp backward so each num is used once. O(n·sum).",
  templates: langs(
    `def canPartition(nums):
    s = sum(nums)
    if s % 2: return False
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
  for (const x of nums)
    for (let t = target; t >= x; t--)
      can[t] = can[t] || can[t - x];
  return can[target];
}`,
  ),
  frames: (() => {
    const nums = [1, 5, 11, 5];
    return [
      arrayFrame(
        "nums = [1, 5, 11, 5]",
        "Sum = 22, half = 11. Ask: can a subset sum to 11?",
        nums,
        {},
        { note: "target 11" },
      ),
      arrayFrame(
        "can[0..11] seed",
        "can[0]=T. Place each number backward (0/1 knapsack).",
        ["T", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F"],
        { 0: "lo" },
        { note: "empty subset" },
      ),
      arrayFrame(
        "Place 1",
        "can[1] becomes true.",
        ["T", "T", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F"],
        { 1: "active" },
        {
          pointers: [{ name: "t", index: 1, color: PTR.M }],
          note: "after 1",
        },
      ),
      arrayFrame(
        "Place 5",
        "can[5] and can[6]=can[1] turn true.",
        ["T", "T", "F", "F", "F", "T", "T", "F", "F", "F", "F", "F"],
        { 5: "active", 6: "window" },
        { note: "1+5=6" },
      ),
      arrayFrame(
        "Place 11",
        "can[11] |= can[0] → true. Half hit by {11} alone.",
        ["T", "T", "F", "F", "F", "T", "T", "F", "F", "F", "F", "T"],
        { 11: "match" },
        {
          pointers: [{ name: "t", index: 11, color: PTR.M }],
          note: "{11} | {1,5,5}",
        },
      ),
      arrayFrame(
        "Answer",
        "Partition exists — return true.",
        nums,
        { 2: "match" },
        { note: "return true" },
      ),
    ];
  })(),
};

export const targetSumKnapsackSolution: ProblemSolution = {
  approach:
    "Assign ± to each num. Let P−N = target and P+N = sum → P = (sum+target)/2. Count 0/1 subsets to P (backward). O(n·sum).",
  templates: langs(
    `def findTargetSumWays(nums, target):
    s = sum(nums)
    if s < abs(target) or (s + target) % 2: return 0
    need = (s + target) // 2
    dp = [1] + [0] * need
    for x in nums:
        for t in range(need, x - 1, -1):
            dp[t] += dp[t - x]
    return dp[need]`,
    `int findTargetSumWays(vector<int>& nums, int target) {
    int s = accumulate(nums.begin(), nums.end(), 0);
    if (s < abs(target) || (s + target) % 2) return 0;
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
    if (s < Math.abs(target) || (s + target) % 2 != 0) return 0;
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
  if (s < Math.abs(target) || (s + target) % 2) return 0;
  const need = (s + target) / 2;
  const dp = Array(need + 1).fill(0);
  dp[0] = 1;
  for (const x of nums)
    for (let t = need; t >= x; t--) dp[t] += dp[t - x];
  return dp[need];
}`,
  ),
  frames: (() => {
    const nums = [1, 1, 1, 1, 1];
    return [
      arrayFrame(
        "nums = [1×5], target = 3",
        "Need P−N = 3 with P+N = 5 → P = 4. Count subsets summing to 4.",
        nums,
        {},
        { note: "need = 4" },
      ),
      arrayFrame(
        "dp seed",
        "dp[0]=1. Backward 0/1 fill counts ways.",
        [1, 0, 0, 0, 0],
        { 0: "lo" },
        { note: "dp[0..4]" },
      ),
      arrayFrame(
        "After two 1s",
        "Binomial growth: ways to make k with first items.",
        [1, 2, 1, 0, 0],
        { 1: "active", 2: "window" },
        { note: "C(2,k)" },
      ),
      arrayFrame(
        "After four 1s",
        "dp = [1,4,6,4,1] — classic Pascal row.",
        [1, 4, 6, 4, 1],
        { 4: "active" },
        {
          pointers: [{ name: "t", index: 4, color: PTR.M }],
          note: "dp[4]=1 so far",
        },
      ),
      arrayFrame(
        "Fifth 1",
        "dp[4] += dp[3] → 1+4 = 5. Five ways to pick four + and one −.",
        [1, 5, 10, 10, 5],
        { 4: "match" },
        { note: "5 expressions" },
      ),
      arrayFrame(
        "Answer",
        "5 ways to reach target 3.",
        nums,
        { 0: "match", 1: "match", 2: "match", 3: "match", 4: "skip" },
        { note: "return 5" },
      ),
    ];
  })(),
};

export const onesAndZeroesSolution: ProblemSolution = {
  approach:
    "2D 0/1 knapsack: each string costs (#0s, #1s). dp[i][j] = max strings with ≤i zeros and ≤j ones; update backward. O(len·m·n).",
  templates: langs(
    `def findMaxForm(strs, m, n):
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for s in strs:
        z, o = s.count("0"), s.count("1")
        for i in range(m, z - 1, -1):
            for j in range(n, o - 1, -1):
                dp[i][j] = max(dp[i][j], 1 + dp[i - z][j - o])
    return dp[m][n]`,
    `int findMaxForm(vector<string>& strs, int m, int n) {
    vector<vector<int>> dp(m + 1, vector<int>(n + 1));
    for (auto& s : strs) {
        int z = count(s.begin(), s.end(), '0');
        int o = (int)s.size() - z;
        for (int i = m; i >= z; i--)
            for (int j = n; j >= o; j--)
                dp[i][j] = max(dp[i][j], 1 + dp[i - z][j - o]);
    }
    return dp[m][n];
}`,
    `int findMaxForm(String[] strs, int m, int n) {
    int[][] dp = new int[m + 1][n + 1];
    for (String s : strs) {
        int z = 0, o = 0;
        for (char c : s.toCharArray()) if (c == '0') z++; else o++;
        for (int i = m; i >= z; i--)
            for (int j = n; j >= o; j--)
                dp[i][j] = Math.max(dp[i][j], 1 + dp[i - z][j - o]);
    }
    return dp[m][n];
}`,
    `function findMaxForm(strs, m, n) {
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (const s of strs) {
    let z = 0, o = 0;
    for (const c of s) if (c === "0") z++; else o++;
    for (let i = m; i >= z; i--)
      for (let j = n; j >= o; j--)
        dp[i][j] = Math.max(dp[i][j], 1 + dp[i - z][j - o]);
  }
  return dp[m][n];
}`,
  ),
  frames: [
    gridFrame(
      "m=3 zeros · n=3 ones",
      "strs ≈ [\"10\",\"0001\",\"111001\",\"1\",\"0\"]. dp[i][j] = max subset size.",
      [
        [0, 0, 0, 0],
        [0, "·", "·", "·"],
        [0, "·", "·", "·"],
        [0, "·", "·", "·"],
      ],
      [[0, 0]],
      { note: "costs (z,o)" },
    ),
    gridFrame(
      'Take "10" (1,1)',
      "For i≥1,j≥1 set dp=1.",
      [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 1, 1, 1],
      ],
      [[1, 1]],
      { note: "size 1" },
    ),
    gridFrame(
      'Take "0001" (3,1)',
      "At (3,1): max(1, 1+dp[0][0])=2. Pair with \"10\".",
      [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 2, 2, 2],
      ],
      [[3, 1]],
      { note: "2 strings" },
    ),
    gridFrame(
      'Add "1" and "0"',
      "Cheap singles fill more cells. Best grows to 4 at (3,3).",
      [
        [0, 1, 1, 1],
        [1, 2, 2, 2],
        [1, 2, 3, 3],
        [1, 3, 3, 4],
      ],
      [[3, 3]],
      { note: "dp[3][3]=4" },
    ),
    gridFrame(
      "Answer",
      "Max subset size with ≤3 zeros and ≤3 ones is 4.",
      [
        [0, 1, 1, 1],
        [1, 2, 2, 2],
        [1, 2, 3, 3],
        [1, 3, 3, 4],
      ],
      [[3, 3]],
      { note: "return 4" },
    ),
  ],
};

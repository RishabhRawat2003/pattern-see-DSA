import type { PracticePack } from "../types";
import { gfg, langs, lc, pack } from "./helpers";
import {
  implementTrieAutocompleteSolution,
  replaceWordsSolution,
  searchSuggestionsSystemSolution,
} from "./solutions/autocomplete";
import {
  bellmanFordGfgSolution,
  cheapestFlightsBellmanSolution,
  networkDelayBellmanSolution,
} from "./solutions/bellmanFord";
import {
  kthAncestorSolution,
  lcaBinaryLiftingSolution,
  stepByStepDirectionsSolution,
} from "./solutions/binaryLifting";
import {
  countingBitsSolution,
  numberOf1BitsSolution,
  subsetsBitMaskingSolution,
} from "./solutions/bitMasking";
import {
  coinChangeIISolution,
  coinChangeSolution,
  combinationSumIVSolution,
} from "./solutions/coinChange";
import {
  cheapestFlightsKStopsDijkstraSolution,
  networkDelayTimeSolution,
  pathWithMinimumEffortSolution,
} from "./solutions/dijkstra";
import {
  accountsMergeSolution,
  equalityEquationsSolution,
  numberOfProvincesDsuSolution,
} from "./solutions/dsuComponents";
import {
  graphValidTreeSolution,
  redundantConnectionIISolution,
  redundantConnectionSolution,
} from "./solutions/dsuCycle";
import {
  deleteOperationEditSolution,
  editDistanceSolution,
  isSubsequenceSolution,
} from "./solutions/editDistance";
import {
  climbingStairsFibSolution,
  decodeWaysSolution,
  fibonacciNumberSolution,
} from "./solutions/fibonacciPattern";
import {
  courseScheduleIVFloydSolution,
  evaluateDivisionSolution,
  findTheCitySolution,
} from "./solutions/floydWarshall";
import {
  dungeonGameSolution,
  minimumPathSumGridSolution,
  uniquePathsGridSolution,
} from "./solutions/gridDp";
import {
  houseRobberIISolution,
  houseRobberIIISolution,
  houseRobberSolution,
} from "./solutions/houseRobber";
import {
  onesAndZeroesSolution,
  partitionEqualKnapsackSolution,
  targetSumKnapsackSolution,
} from "./solutions/knapsack";
import {
  criticalMSTEdgesKruskalSolution,
  kruskalGfgSolution,
  minCostConnectPointsKruskalSolution,
} from "./solutions/kruskal";
import {
  deleteOperationTwoStringsSolution,
  longestCommonSubsequenceSolution,
  longestPalindromicSubsequenceSolution,
} from "./solutions/lcsLps";
import {
  longestIncreasingSubsequenceSolution,
  numberOfLISSolution,
  russianDollEnvelopesSolution,
} from "./solutions/lis";
import {
  closestSubsequenceSumSolution,
  minSumDifferenceSolution,
  onesAndZeroesMitmSolution,
} from "./solutions/meetInMiddle";
import {
  findAllDisappearedSolution,
  firstMissingPositiveSolution,
  missingNumberSolution,
} from "./solutions/missingNumber";
import {
  mosAlgorithmGfgSolution,
  onlineMajorityElementSolution,
  rangeFrequencyQueriesSolution,
} from "./solutions/mosAlgorithm";
import {
  criticalMSTEdgesSolution,
  minCostConnectPointsSolution,
  optimizeWaterDistributionSolution,
} from "./solutions/mst";
import {
  climbingStairs1dSolution,
  houseRobber1dSolution,
  minCostClimbingStairsSolution,
} from "./solutions/oneDDp";
import {
  longestPalindromicSubstringSolution,
  palindromePartitioningIISolution,
  palindromePartitioningSolution,
} from "./solutions/palindromePartition";
import {
  lastStoneWeightIISolution,
  partitionEqualSolution,
  partitionToKSubsetsPartitionSolution,
} from "./solutions/partitionEqual";
import {
  partitionEqualSubsetSumSolution,
  partitionToKEqualSumSubsetsSolution,
  targetSumSubsetSolution,
} from "./solutions/subsetSum";
import {
  repeatedDnaSequencesSolution,
  subsetsBitsSolution,
  subsetsIIBitsSolution,
} from "./solutions/subsetsBits";
import {
  courseScheduleIITopoSolution,
  courseScheduleIVSolution,
  courseScheduleTopoSolution,
} from "./solutions/topoSort";
import {
  addAndSearchWordsSolution,
  implementTrieSolution,
  mapSumPairsSolution,
} from "./solutions/trieInsertSearch";
import {
  minimumPathSum2dSolution,
  uniquePathsIISolution,
  uniquePathsSolution,
} from "./solutions/twoDDp";
import {
  editDistanceWildcardSolution,
  regexMatchingSolution,
  wildcardMatchingSolution,
} from "./solutions/wildcardMatching";
import {
  constrainedSubsequenceSumSolution,
  jumpGameVISolution,
  slidingWindowMaximumSolution,
} from "./solutions/windowDp";
import {
  implementTrieWordSearchSolution,
  wordSearchIISolution,
  wordSearchL3Solution,
} from "./solutions/wordSearchL3";
import {
  singleNumberIISolution,
  singleNumberIIISolution,
  singleNumberSolution,
} from "./solutions/xorTricks";


export const level3Practice: Record<string, PracticePack> = {
  "1d-dp": pack(
    "dp[i] from a few previous cells. Fill left to right.",
    langs(
      `def climb_stairs(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
      `int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int nxt = a + b;
        a = b; b = nxt;
    }
    return b;
}`,
      `int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int nxt = a + b;
        a = b; b = nxt;
    }
    return b;
}`,
      `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`,
    ),
    lc("climbing-stairs", "Climbing Stairs", "Easy", climbingStairs1dSolution),
    lc("min-cost-climbing-stairs", "Min Cost Climbing Stairs", "Easy", minCostClimbingStairsSolution),
    lc("house-robber", "House Robber", "Medium", houseRobber1dSolution),
  ),
  "fibonacci-pattern": pack(
    "Next = sum of previous two. Climb, tile, decode ways.",
    langs(
      `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`,
      `int fib(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        int nxt = a + b;
        a = b; b = nxt;
    }
    return a;
}`,
      `int fib(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        int nxt = a + b;
        a = b; b = nxt;
    }
    return a;
}`,
      `function fib(n) {
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
}`,
    ),
    lc("fibonacci-number", "Fibonacci Number", "Easy", fibonacciNumberSolution),
    lc("climbing-stairs", "Climbing Stairs", "Easy", climbingStairsFibSolution),
    lc("decode-ways", "Decode Ways", "Medium", decodeWaysSolution),
  ),
  "house-robber": pack(
    "dp[i] = max(skip dp[i-1], rob nums[i] + dp[i-2]).",
    langs(
      `def rob(nums):
    prev = cur = 0
    for x in nums:
        prev, cur = cur, max(cur, prev + x)
    return cur`,
      `int rob(vector<int>& nums) {
    int prev = 0, cur = 0;
    for (int x : nums) {
        int nxt = max(cur, prev + x);
        prev = cur; cur = nxt;
    }
    return cur;
}`,
      `int rob(int[] nums) {
    int prev = 0, cur = 0;
    for (int x : nums) {
        int nxt = Math.max(cur, prev + x);
        prev = cur; cur = nxt;
    }
    return cur;
}`,
      `function rob(nums) {
  let prev = 0, cur = 0;
  for (const x of nums) {
    [prev, cur] = [cur, Math.max(cur, prev + x)];
  }
  return cur;
}`,
    ),
    lc("house-robber", "House Robber", "Medium", houseRobberSolution),
    lc("house-robber-ii", "House Robber II", "Medium", houseRobberIISolution),
    lc("house-robber-iii", "House Robber III", "Medium", houseRobberIIISolution),
  ),
  "coin-change": pack(
    "dp[x] = min coins for amount x. Unbounded: try each coin.",
    langs(
      `def coin_change(coins, amount):
    inf = amount + 1
    dp = [0] + [inf] * amount
    for x in range(1, amount + 1):
        for c in coins:
            if c <= x:
                dp[x] = min(dp[x], 1 + dp[x - c])
    return dp[amount] if dp[amount] < inf else -1`,
      `int coinChange(vector<int>& coins, int amount) {
    int inf = amount + 1;
    vector<int> dp(amount + 1, inf);
    dp[0] = 0;
    for (int x = 1; x <= amount; x++) {
        for (int c : coins) {
            if (c <= x) dp[x] = min(dp[x], 1 + dp[x - c]);
        }
    }
    return dp[amount] < inf ? dp[amount] : -1;
}`,
      `int coinChange(int[] coins, int amount) {
    int inf = amount + 1;
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, inf);
    dp[0] = 0;
    for (int x = 1; x <= amount; x++) {
        for (int c : coins) {
            if (c <= x) dp[x] = Math.min(dp[x], 1 + dp[x - c]);
        }
    }
    return dp[amount] < inf ? dp[amount] : -1;
}`,
      `function coinChange(coins, amount) {
  const inf = amount + 1;
  const dp = Array(amount + 1).fill(inf);
  dp[0] = 0;
  for (let x = 1; x <= amount; x++) {
    for (const c of coins) {
      if (c <= x) dp[x] = Math.min(dp[x], 1 + dp[x - c]);
    }
  }
  return dp[amount] < inf ? dp[amount] : -1;
}`,
    ),
    lc("coin-change", "Coin Change", "Medium", coinChangeSolution),
    lc("coin-change-ii", "Coin Change II", "Medium", coinChangeIISolution),
    lc("combination-sum-iv", "Combination Sum IV", "Medium", combinationSumIVSolution),
  ),
  "2d-dp": pack(
    "dp[i][j] from left / up / diagonal. Two sequences or a grid.",
    langs(
      `def unique_paths(m, n):
    dp = [1] * n
    for _ in range(1, m):
        for c in range(1, n):
            dp[c] += dp[c - 1]
    return dp[-1]`,
      `int uniquePaths(int m, int n) {
    vector<int> dp(n, 1);
    for (int r = 1; r < m; r++)
        for (int c = 1; c < n; c++)
            dp[c] += dp[c - 1];
    return dp[n - 1];
}`,
      `int uniquePaths(int m, int n) {
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int r = 1; r < m; r++)
        for (int c = 1; c < n; c++)
            dp[c] += dp[c - 1];
    return dp[n - 1];
}`,
      `function uniquePaths(m, n) {
  const dp = Array(n).fill(1);
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) dp[c] += dp[c - 1];
  }
  return dp[n - 1];
}`,
    ),
    lc("unique-paths", "Unique Paths", "Medium", uniquePathsSolution),
    lc("unique-paths-ii", "Unique Paths II", "Medium", uniquePathsIISolution),
    lc("minimum-path-sum", "Minimum Path Sum", "Medium", minimumPathSum2dSolution),
  ),
  knapsack: pack(
    "0/1: iterate capacity backward. Unbounded: forward.",
    langs(
      `def knapsack_01(w, v, W):
    dp = [0] * (W + 1)
    for wi, vi in zip(w, v):
        for cap in range(W, wi - 1, -1):
            dp[cap] = max(dp[cap], dp[cap - wi] + vi)
    return dp[W]`,
      `int knapsack01(vector<int>& w, vector<int>& v, int W) {
    vector<int> dp(W + 1);
    for (int i = 0; i < (int)w.size(); i++) {
        for (int cap = W; cap >= w[i]; cap--)
            dp[cap] = max(dp[cap], dp[cap - w[i]] + v[i]);
    }
    return dp[W];
}`,
      `int knapsack01(int[] w, int[] v, int W) {
    int[] dp = new int[W + 1];
    for (int i = 0; i < w.length; i++) {
        for (int cap = W; cap >= w[i]; cap--)
            dp[cap] = Math.max(dp[cap], dp[cap - w[i]] + v[i]);
    }
    return dp[W];
}`,
      `function knapsack01(w, v, W) {
  const dp = Array(W + 1).fill(0);
  for (let i = 0; i < w.length; i++) {
    for (let cap = W; cap >= w[i]; cap--)
      dp[cap] = Math.max(dp[cap], dp[cap - w[i]] + v[i]);
  }
  return dp[W];
}`,
    ),
    lc("partition-equal-subset-sum", "Partition Equal Subset", "Medium", partitionEqualKnapsackSolution),
    lc("target-sum", "Target Sum", "Medium", targetSumKnapsackSolution),
    lc("ones-and-zeroes", "Ones and Zeroes", "Medium", onesAndZeroesSolution),
  ),
  "lcs-lps": pack(
    "Match: 1 + diagonal. Else max(left, up). LPS = LCS(s, reverse s).",
    langs(
      `def lcs(s, t):
    n, m = len(s), len(t)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s[i - 1] == t[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]`,
      `int lcs(string s, string t) {
    int n = s.size(), m = t.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s[i - 1] == t[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[n][m];
}`,
      `int lcs(String s, String t) {
    int n = s.length(), m = t.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s.charAt(i - 1) == t.charAt(j - 1)) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[n][m];
}`,
      `function lcs(s, t) {
  const n = s.length, m = t.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s[i - 1] === t[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[n][m];
}`,
    ),
    lc("longest-common-subsequence", "Longest Common Subsequence", "Medium", longestCommonSubsequenceSolution),
    lc("longest-palindromic-subsequence", "Longest Palindromic Subseq", "Medium", longestPalindromicSubsequenceSolution),
    lc("delete-operation-for-two-strings", "Delete Operation", "Medium", deleteOperationTwoStringsSolution),
  ),
  "grid-dp": pack(
    "dp[r][c] = grid + min/max of allowed previous cells (usually up, left).",
    langs(
      `def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    for r in range(m):
        for c in range(n):
            if r == c == 0:
                continue
            up = grid[r - 1][c] if r else 10**18
            left = grid[r][c - 1] if c else 10**18
            grid[r][c] += min(up, left)
    return grid[-1][-1]`,
      `int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    const long long INF = 1e18;
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (r == 0 && c == 0) continue;
            long long up = r ? grid[r - 1][c] : INF;
            long long left = c ? grid[r][c - 1] : INF;
            grid[r][c] += (int)min(up, left);
        }
    }
    return grid[m - 1][n - 1];
}`,
      `int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    long INF = (long)1e18;
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (r == 0 && c == 0) continue;
            long up = r > 0 ? grid[r - 1][c] : INF;
            long left = c > 0 ? grid[r][c - 1] : INF;
            grid[r][c] += (int)Math.min(up, left);
        }
    }
    return grid[m - 1][n - 1];
}`,
      `function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  const INF = 1e18;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (r === 0 && c === 0) continue;
      const up = r ? grid[r - 1][c] : INF;
      const left = c ? grid[r][c - 1] : INF;
      grid[r][c] += Math.min(up, left);
    }
  }
  return grid[m - 1][n - 1];
}`,
    ),
    lc("minimum-path-sum", "Minimum Path Sum", "Medium", minimumPathSumGridSolution),
    lc("unique-paths", "Unique Paths", "Medium", uniquePathsGridSolution),
    lc("dungeon-game", "Dungeon Game", "Hard", dungeonGameSolution),
  ),
  lis: pack(
    "dp[i] = 1 + max dp[j] for j < i and a[j] < a[i]. Or patience tails.",
    langs(
      `def lis_n2(a):
    dp = [1] * len(a)
    for i in range(len(a)):
        for j in range(i):
            if a[j] < a[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp, default=0)`,
      `int lisN2(vector<int>& a) {
    int n = a.size(), best = 0;
    vector<int> dp(n, 1);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++)
            if (a[j] < a[i]) dp[i] = max(dp[i], dp[j] + 1);
        best = max(best, dp[i]);
    }
    return best;
}`,
      `int lisN2(int[] a) {
    int n = a.length, best = 0;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++)
            if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
        best = Math.max(best, dp[i]);
    }
    return best;
}`,
      `function lisN2(a) {
  const n = a.length, dp = Array(n).fill(1);
  let best = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++)
      if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    best = Math.max(best, dp[i]);
  }
  return best;
}`,
    ),
    lc("longest-increasing-subsequence", "LIS", "Medium", longestIncreasingSubsequenceSolution),
    lc("russian-doll-envelopes", "Russian Doll Envelopes", "Hard", russianDollEnvelopesSolution),
    lc("number-of-longest-increasing-subsequence", "Number of LIS", "Medium", numberOfLISSolution),
  ),
  "subset-sum": pack(
    "Boolean 0/1 knapsack: can[t] |= can[t - a[i]], fill backward.",
    langs(
      `def subset_sum(nums, target):
    can = [True] + [False] * target
    for x in nums:
        for t in range(target, x - 1, -1):
            can[t] = can[t] or can[t - x]
    return can[target]`,
      `bool subsetSum(vector<int>& nums, int target) {
    vector<char> can(target + 1);
    can[0] = 1;
    for (int x : nums)
        for (int t = target; t >= x; t--)
            can[t] = can[t] || can[t - x];
    return can[target];
}`,
      `boolean subsetSum(int[] nums, int target) {
    boolean[] can = new boolean[target + 1];
    can[0] = true;
    for (int x : nums)
        for (int t = target; t >= x; t--)
            can[t] = can[t] || can[t - x];
    return can[target];
}`,
      `function subsetSum(nums, target) {
  const can = Array(target + 1).fill(false);
  can[0] = true;
  for (const x of nums) {
    for (let t = target; t >= x; t--) can[t] = can[t] || can[t - x];
  }
  return can[target];
}`,
    ),
    lc("partition-equal-subset-sum", "Partition Equal Subset", "Medium", partitionEqualSubsetSumSolution),
    lc("target-sum", "Target Sum", "Medium", targetSumSubsetSolution),
    lc("partition-to-k-equal-sum-subsets", "Partition to K Subsets", "Medium", partitionToKEqualSumSubsetsSolution),
  ),
  "partition-equal": pack(
    "Odd total → no. Else subset-sum half.",
    langs(
      `def can_partition(nums):
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
    lc("partition-equal-subset-sum", "Partition Equal Subset", "Medium", partitionEqualSolution),
    lc("last-stone-weight-ii", "Last Stone Weight II", "Medium", lastStoneWeightIISolution),
    lc("partition-to-k-equal-sum-subsets", "Partition to K Subsets", "Medium", partitionToKSubsetsPartitionSolution),
  ),
  "edit-distance": pack(
    "dp[i][j] = min insert, delete, replace. Match is free on the diagonal.",
    langs(
      `def min_distance(s, t):
    n, m = len(s), len(t)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s[i - 1] == t[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[n][m]`,
      `int minDistance(string s, string t) {
    int n = s.size(), m = t.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1));
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s[i - 1] == t[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
        }
    }
    return dp[n][m];
}`,
      `int minDistance(String s, String t) {
    int n = s.length(), m = t.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s.charAt(i - 1) == t.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1]));
        }
    }
    return dp[n][m];
}`,
      `function minDistance(s, t) {
  const n = s.length, m = t.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s[i - 1] === t[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[n][m];
}`,
    ),
    lc("edit-distance", "Edit Distance", "Medium", editDistanceSolution),
    lc("delete-operation-for-two-strings", "Delete Operation", "Medium", deleteOperationEditSolution),
    lc("is-subsequence", "Is Subsequence", "Easy", isSubsequenceSolution),
  ),
  "wildcard-matching": pack(
    "? one char. * empty-or-more: from left (eat s) or up (eat *).",
    langs(
      `def is_match(s, p):
    n, m = len(s), len(p)
    dp = [[False] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = True
    for j in range(1, m + 1):
        if p[j - 1] == "*":
            dp[0][j] = dp[0][j - 1]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if p[j - 1] == "*":
                dp[i][j] = dp[i][j - 1] or dp[i - 1][j]
            elif p[j - 1] in {s[i - 1], "?"}:
                dp[i][j] = dp[i - 1][j - 1]
    return dp[n][m]`,
      `bool isMatch(string s, string p) {
    int n = s.size(), m = p.size();
    vector<vector<char>> dp(n + 1, vector<char>(m + 1));
    dp[0][0] = 1;
    for (int j = 1; j <= m; j++)
        if (p[j - 1] == '*') dp[0][j] = dp[0][j - 1];
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (p[j - 1] == '*') dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
            else if (p[j - 1] == s[i - 1] || p[j - 1] == '?')
                dp[i][j] = dp[i - 1][j - 1];
        }
    }
    return dp[n][m];
}`,
      `boolean isMatch(String s, String p) {
    int n = s.length(), m = p.length();
    boolean[][] dp = new boolean[n + 1][m + 1];
    dp[0][0] = true;
    for (int j = 1; j <= m; j++)
        if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 1];
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (p.charAt(j - 1) == '*') dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
            else if (p.charAt(j - 1) == s.charAt(i - 1) || p.charAt(j - 1) == '?')
                dp[i][j] = dp[i - 1][j - 1];
        }
    }
    return dp[n][m];
}`,
      `function isMatch(s, p) {
  const n = s.length, m = p.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= m; j++)
    if (p[j - 1] === "*") dp[0][j] = dp[0][j - 1];
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (p[j - 1] === "*") dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
      else if (p[j - 1] === s[i - 1] || p[j - 1] === "?")
        dp[i][j] = dp[i - 1][j - 1];
    }
  }
  return dp[n][m];
}`,
    ),
    lc("wildcard-matching", "Wildcard Matching", "Hard", wildcardMatchingSolution),
    lc("regular-expression-matching", "Regex Matching", "Hard", regexMatchingSolution),
    lc("edit-distance", "Edit Distance", "Medium", editDistanceWildcardSolution),
  ),
  "palindrome-partition": pack(
    "Precompute pal[l][r]. Then min cuts or list partitions via backtrack.",
    langs(
      `def partition(s):
    n = len(s)
    pal = [[False] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        for j in range(i, n):
            pal[i][j] = s[i] == s[j] and (j - i < 2 or pal[i + 1][j - 1])
    out = []
    def dfs(i, path):
        if i == n:
            out.append(path[:]); return
        for j in range(i, n):
            if pal[i][j]:
                path.append(s[i:j + 1])
                dfs(j + 1, path)
                path.pop()
    dfs(0, [])
    return out`,
      `void palDfs(int i, string& s, vector<vector<char>>& pal, vector<string>& path, vector<vector<string>>& out) {
    int n = s.size();
    if (i == n) { out.push_back(path); return; }
    for (int j = i; j < n; j++) {
        if (pal[i][j]) {
            path.push_back(s.substr(i, j - i + 1));
            palDfs(j + 1, s, pal, path, out);
            path.pop_back();
        }
    }
}
vector<vector<string>> partition(string s) {
    int n = s.size();
    vector<vector<char>> pal(n, vector<char>(n));
    for (int i = n - 1; i >= 0; i--)
        for (int j = i; j < n; j++)
            pal[i][j] = s[i] == s[j] && (j - i < 2 || pal[i + 1][j - 1]);
    vector<vector<string>> out;
    vector<string> path;
    palDfs(0, s, pal, path, out);
    return out;
}`,
      `void palDfs(int i, String s, boolean[][] pal, List<String> path, List<List<String>> out) {
    int n = s.length();
    if (i == n) { out.add(new ArrayList<>(path)); return; }
    for (int j = i; j < n; j++) {
        if (pal[i][j]) {
            path.add(s.substring(i, j + 1));
            palDfs(j + 1, s, pal, path, out);
            path.remove(path.size() - 1);
        }
    }
}
List<List<String>> partition(String s) {
    int n = s.length();
    boolean[][] pal = new boolean[n][n];
    for (int i = n - 1; i >= 0; i--)
        for (int j = i; j < n; j++)
            pal[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 2 || pal[i + 1][j - 1]);
    List<List<String>> out = new ArrayList<>();
    palDfs(0, s, pal, new ArrayList<>(), out);
    return out;
}`,
      `function partition(s) {
  const n = s.length;
  const pal = Array.from({ length: n }, () => Array(n).fill(false));
  for (let i = n - 1; i >= 0; i--)
    for (let j = i; j < n; j++)
      pal[i][j] = s[i] === s[j] && (j - i < 2 || pal[i + 1][j - 1]);
  const out = [];
  function dfs(i, path) {
    if (i === n) { out.push([...path]); return; }
    for (let j = i; j < n; j++) {
      if (pal[i][j]) {
        path.push(s.slice(i, j + 1));
        dfs(j + 1, path);
        path.pop();
      }
    }
  }
  dfs(0, []);
  return out;
}`,
    ),
    lc("palindrome-partitioning", "Palindrome Partitioning", "Medium", palindromePartitioningSolution),
    lc("palindrome-partitioning-ii", "Palindrome Partitioning II", "Hard", palindromePartitioningIISolution),
    lc("longest-palindromic-substring", "Longest Palindromic Substring", "Medium", longestPalindromicSubstringSolution),
  ),
  "topo-sort": pack(
    "Kahn: queue indegree 0. Or DFS finish times reversed. DAG only.",
    langs(
      `from collections import deque

def topo(n, edges):
    g = [[] for _ in range(n)]
    indeg = [0] * n
    for u, v in edges:
        g[u].append(v); indeg[v] += 1
    q = deque([i for i in range(n) if indeg[i] == 0])
    order = []
    while q:
        u = q.popleft(); order.append(u)
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order if len(order) == n else []`,
      `vector<int> topo(int n, vector<vector<int>>& edges) {
    vector<vector<int>> g(n);
    vector<int> indeg(n);
    for (auto& e : edges) { g[e[0]].push_back(e[1]); indeg[e[1]]++; }
    queue<int> q;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
    }
    return (int)order.size() == n ? order : vector<int>{};
}`,
      `int[] topo(int n, int[][] edges) {
    List<Integer>[] g = new List[n];
    for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
    int[] indeg = new int[n];
    for (int[] e : edges) { g[e[0]].add(e[1]); indeg[e[1]]++; }
    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
    int[] order = new int[n];
    int k = 0;
    while (!q.isEmpty()) {
        int u = q.poll();
        order[k++] = u;
        for (int v : g[u]) if (--indeg[v] == 0) q.add(v);
    }
    return k == n ? order : new int[0];
}`,
      `function topo(n, edges) {
  const g = Array.from({ length: n }, () => []);
  const indeg = Array(n).fill(0);
  for (const [u, v] of edges) { g[u].push(v); indeg[v]++; }
  const q = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (const v of g[u]) if (--indeg[v] === 0) q.push(v);
  }
  return order.length === n ? order : [];
}`,
    ),
    lc("course-schedule", "Course Schedule", "Medium", courseScheduleTopoSolution),
    lc("course-schedule-ii", "Course Schedule II", "Medium", courseScheduleIITopoSolution),
    lc("course-schedule-iv", "Course Schedule IV", "Medium", courseScheduleIVSolution),
  ),
  dijkstra: pack(
    "Non-negative weights. Pop closest unsettled, relax edges.",
    langs(
      `import heapq
from collections import defaultdict

def dijkstra(n, edges, src):
    g = defaultdict(list)
    for u, v, w in edges:
        g[u].append((v, w))
    dist = [10**18] * n
    dist[src] = 0
    h = [(0, src)]
    while h:
        d, u = heapq.heappop(h)
        if d != dist[u]:
            continue
        for v, w in g[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(h, (dist[v], v))
    return dist`,
      `vector<long long> dijkstra(int n, vector<vector<int>>& edges, int src) {
    vector<vector<pair<int,int>>> g(n);
    for (auto& e : edges) g[e[0]].push_back({e[1], e[2]});
    const long long INF = 1e18;
    vector<long long> dist(n, INF);
    dist[src] = 0;
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> h;
    h.push({0, src});
    while (!h.empty()) {
        auto [d, u] = h.top(); h.pop();
        if (d != dist[u]) continue;
        for (auto [v, w] : g[u]) {
            if (d + w < dist[v]) {
                dist[v] = d + w;
                h.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
      `long[] dijkstra(int n, int[][] edges, int src) {
    List<int[]>[] g = new List[n];
    for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
    for (int[] e : edges) g[e[0]].add(new int[]{e[1], e[2]});
    long INF = (long)1e18;
    long[] dist = new long[n];
    Arrays.fill(dist, INF);
    dist[src] = 0;
    PriorityQueue<long[]> h = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
    h.add(new long[]{0, src});
    while (!h.isEmpty()) {
        long[] cur = h.poll();
        long d = cur[0]; int u = (int)cur[1];
        if (d != dist[u]) continue;
        for (int[] e : g[u]) {
            int v = e[0], w = e[1];
            if (d + w < dist[v]) {
                dist[v] = d + w;
                h.add(new long[]{dist[v], v});
            }
        }
    }
    return dist;
}`,
      `function dijkstra(n, edges, src) {
  const g = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) g[u].push([v, w]);
  const INF = 1e18;
  const dist = Array(n).fill(INF);
  dist[src] = 0;
  const h = [[0, src]];
  const pop = () => {
    h.sort((a, b) => a[0] - b[0]);
    return h.shift();
  };
  while (h.length) {
    const [d, u] = pop();
    if (d !== dist[u]) continue;
    for (const [v, w] of g[u]) {
      if (d + w < dist[v]) {
        dist[v] = d + w;
        h.push([dist[v], v]);
      }
    }
  }
  return dist;
}`,
    ),
    lc("network-delay-time", "Network Delay Time", "Medium", networkDelayTimeSolution),
    lc("path-with-minimum-effort", "Path With Minimum Effort", "Medium", pathWithMinimumEffortSolution),
    lc("cheapest-flights-within-k-stops", "Cheapest Flights K Stops", "Medium", cheapestFlightsKStopsDijkstraSolution),
  ),
  "bellman-ford": pack(
    "Relax all edges V-1 times. Extra pass still relaxing ⇒ negative cycle.",
    langs(
      `def bellman_ford(n, edges, src):
    dist = [10**18] * n
    dist[src] = 0
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    return dist`,
      `vector<long long> bellmanFord(int n, vector<vector<int>>& edges, int src) {
    const long long INF = 1e18;
    vector<long long> dist(n, INF);
    dist[src] = 0;
    for (int i = 0; i < n - 1; i++)
        for (auto& e : edges)
            if (dist[e[0]] + e[2] < dist[e[1]])
                dist[e[1]] = dist[e[0]] + e[2];
    return dist;
}`,
      `long[] bellmanFord(int n, int[][] edges, int src) {
    long INF = (long)1e18;
    long[] dist = new long[n];
    Arrays.fill(dist, INF);
    dist[src] = 0;
    for (int i = 0; i < n - 1; i++)
        for (int[] e : edges)
            if (dist[e[0]] + e[2] < dist[e[1]])
                dist[e[1]] = dist[e[0]] + e[2];
    return dist;
}`,
      `function bellmanFord(n, edges, src) {
  const dist = Array(n).fill(1e18);
  dist[src] = 0;
  for (let i = 0; i < n - 1; i++) {
    for (const [u, v, w] of edges) {
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  return dist;
}`,
    ),
    lc("cheapest-flights-within-k-stops", "Cheapest Flights K Stops", "Medium", cheapestFlightsBellmanSolution),
    lc("network-delay-time", "Network Delay Time", "Medium", networkDelayBellmanSolution),
    gfg("bellman-ford-algorithm-dp-23", "Bellman Ford (GFG)", "Medium", bellmanFordGfgSolution),
  ),
  "floyd-warshall": pack(
    "for k, for i, for j: dist[i][j] = min(..., dist[i][k]+dist[k][j]).",
    langs(
      `def floyd(dist):
    n = len(dist)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist`,
      `vector<vector<long long>> floyd(vector<vector<long long>>& dist) {
    int n = dist.size();
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
    return dist;
}`,
      `long[][] floyd(long[][] dist) {
    int n = dist.length;
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
    return dist;
}`,
      `function floyd(dist) {
  const n = dist.length;
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];
  return dist;
}`,
    ),
    lc("find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance", "City With Smallest Neighbors", "Medium", findTheCitySolution),
    lc("evaluate-division", "Evaluate Division", "Medium", evaluateDivisionSolution),
    lc("course-schedule-iv", "Course Schedule IV", "Medium", courseScheduleIVFloydSolution),
  ),
  mst: pack(
    "Prim: grow cheapest cut edge. Kruskal: sort edges, DSU skip cycles.",
    langs(
      `def prim(n, g):
    import heapq
    seen, h, total = {0}, [(w, 0, v) for v, w in g[0]], 0
    heapq.heapify(h)
    while h and len(seen) < n:
        w, u, v = heapq.heappop(h)
        if v in seen:
            continue
        seen.add(v); total += w
        for x, wx in g[v]:
            if x not in seen:
                heapq.heappush(h, (wx, v, x))
    return total`,
      `int prim(int n, vector<vector<pair<int,int>>>& g) {
    unordered_set<int> seen{0};
    priority_queue<array<int,3>, vector<array<int,3>>, greater<>> h;
    for (auto [v, w] : g[0]) h.push({w, 0, v});
    int total = 0;
    while (!h.empty() && (int)seen.size() < n) {
        auto [w, u, v] = h.top(); h.pop();
        if (seen.count(v)) continue;
        seen.insert(v); total += w;
        for (auto [x, wx] : g[v])
            if (!seen.count(x)) h.push({wx, v, x});
    }
    return total;
}`,
      `int prim(int n, List<int[]>[] g) {
    HashSet<Integer> seen = new HashSet<>();
    seen.add(0);
    PriorityQueue<int[]> h = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    for (int[] e : g[0]) h.add(new int[]{e[1], 0, e[0]});
    int total = 0;
    while (!h.isEmpty() && seen.size() < n) {
        int[] cur = h.poll();
        int w = cur[0], v = cur[2];
        if (seen.contains(v)) continue;
        seen.add(v); total += w;
        for (int[] e : g[v])
            if (!seen.contains(e[0])) h.add(new int[]{e[1], v, e[0]});
    }
    return total;
}`,
      `function prim(n, g) {
  const seen = new Set([0]);
  const h = g[0].map(([v, w]) => [w, 0, v]);
  let total = 0;
  const pop = () => {
    h.sort((a, b) => a[0] - b[0]);
    return h.shift();
  };
  while (h.length && seen.size < n) {
    const [w, u, v] = pop();
    if (seen.has(v)) continue;
    seen.add(v); total += w;
    for (const [x, wx] of g[v])
      if (!seen.has(x)) h.push([wx, v, x]);
  }
  return total;
}`,
    ),
    lc("min-cost-to-connect-all-points", "Min Cost Connect Points", "Medium", minCostConnectPointsSolution),
    lc("optimize-water-distribution-in-a-village", "Optimize Water Distribution", "Hard", optimizeWaterDistributionSolution),
    lc("find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree", "Critical MST Edges", "Hard", criticalMSTEdgesSolution),
  ),
  "dsu-cycle": pack(
    "Undirected edge with find(u)==find(v) closes a cycle. Else union.",
    langs(
      `parent = []

def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x

def union(a, b):
    ra, rb = find(a), find(b)
    if ra == rb:
        return False
    parent[rb] = ra
    return True`,
      `vector<int> parent;
int find(int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}
bool unite(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;
    parent[rb] = ra;
    return true;
}`,
      `int[] parent;
int find(int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}
boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;
    parent[rb] = ra;
    return true;
}`,
      `let parent = [];
function find(x) {
  while (parent[x] !== x) {
    parent[x] = parent[parent[x]];
    x = parent[x];
  }
  return x;
}
function union(a, b) {
  const ra = find(a), rb = find(b);
  if (ra === rb) return false;
  parent[rb] = ra;
  return true;
}`,
    ),
    lc("redundant-connection", "Redundant Connection", "Medium", redundantConnectionSolution),
    lc("redundant-connection-ii", "Redundant Connection II", "Hard", redundantConnectionIISolution),
    lc("graph-valid-tree", "Graph Valid Tree", "Medium", graphValidTreeSolution),
  ),
  "dsu-components": pack(
    "Start with n sets. Successful union decrements the count.",
    langs(
      `def count_components(n, edges):
    p = list(range(n))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]; x = p[x]
        return x
    count = n
    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra != rb:
            p[rb] = ra
            count -= 1
    return count`,
      `int countComponents(int n, vector<vector<int>>& edges) {
    vector<int> p(n);
    iota(p.begin(), p.end(), 0);
    auto find = [&](int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
        return x;
    };
    int count = n;
    for (auto& e : edges) {
        int ra = find(e[0]), rb = find(e[1]);
        if (ra != rb) { p[rb] = ra; count--; }
    }
    return count;
}`,
      `int countComponents(int n, int[][] edges) {
    int[] p = new int[n];
    for (int i = 0; i < n; i++) p[i] = i;
    java.util.function.IntUnaryOperator find = null;
    find = x -> {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
        return x;
    };
    int count = n;
    for (int[] e : edges) {
        int ra = find.applyAsInt(e[0]), rb = find.applyAsInt(e[1]);
        if (ra != rb) { p[rb] = ra; count--; }
    }
    return count;
}`,
      `function countComponents(n, edges) {
  const p = [...Array(n).keys()];
  const find = (x) => {
    while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; }
    return x;
  };
  let count = n;
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) { p[rb] = ra; count--; }
  }
  return count;
}`,
    ),
    lc("number-of-provinces", "Number of Provinces", "Medium", numberOfProvincesDsuSolution),
    lc("satisfiability-of-equality-equations", "Equality Equations", "Medium", equalityEquationsSolution),
    lc("accounts-merge", "Accounts Merge", "Medium", accountsMergeSolution),
  ),
  kruskal: pack(
    "Sort edges by weight. Add if different DSU roots. Stop at n-1.",
    langs(
      `def kruskal(n, edges):
    edges = sorted(edges, key=lambda e: e[2])
    p = list(range(n))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]; x = p[x]
        return x
    total, used = 0, 0
    for u, v, w in edges:
        ru, rv = find(u), find(v)
        if ru != rv:
            p[rv] = ru
            total += w
            used += 1
    return total if used == n - 1 else None`,
      `int kruskal(int n, vector<vector<int>> edges) {
    sort(edges.begin(), edges.end(), [](auto& a, auto& b) { return a[2] < b[2]; });
    vector<int> p(n);
    iota(p.begin(), p.end(), 0);
    auto find = [&](int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
        return x;
    };
    int total = 0, used = 0;
    for (auto& e : edges) {
        int ru = find(e[0]), rv = find(e[1]);
        if (ru != rv) { p[rv] = ru; total += e[2]; used++; }
    }
    return used == n - 1 ? total : -1;
}`,
      `Integer kruskal(int n, int[][] edges) {
    Arrays.sort(edges, Comparator.comparingInt(e -> e[2]));
    int[] p = new int[n];
    for (int i = 0; i < n; i++) p[i] = i;
    java.util.function.IntUnaryOperator find = x -> {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
        return x;
    };
    int total = 0, used = 0;
    for (int[] e : edges) {
        int ru = find.applyAsInt(e[0]), rv = find.applyAsInt(e[1]);
        if (ru != rv) { p[rv] = ru; total += e[2]; used++; }
    }
    return used == n - 1 ? total : null;
}`,
      `function kruskal(n, edges) {
  edges = [...edges].sort((a, b) => a[2] - b[2]);
  const p = [...Array(n).keys()];
  const find = (x) => {
    while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; }
    return x;
  };
  let total = 0, used = 0;
  for (const [u, v, w] of edges) {
    const ru = find(u), rv = find(v);
    if (ru !== rv) { p[rv] = ru; total += w; used++; }
  }
  return used === n - 1 ? total : null;
}`,
    ),
    lc("min-cost-to-connect-all-points", "Min Cost Connect Points", "Medium", minCostConnectPointsKruskalSolution),
    gfg("kruskals-minimum-spanning-tree-algorithm-greedy-algo-2", "Kruskal (GFG)", "Medium", kruskalGfgSolution),
    lc("find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree", "Critical MST Edges", "Hard", criticalMSTEdgesKruskalSolution),
  ),
  "xor-tricks": pack(
    "x^x=0, x^0=x. Pairs cancel; leftover is unique.",
    langs(
      `def single_number(nums):
    acc = 0
    for x in nums:
        acc ^= x
    return acc`,
      `int singleNumber(vector<int>& nums) {
    int acc = 0;
    for (int x : nums) acc ^= x;
    return acc;
}`,
      `int singleNumber(int[] nums) {
    int acc = 0;
    for (int x : nums) acc ^= x;
    return acc;
}`,
      `function singleNumber(nums) {
  let acc = 0;
  for (const x of nums) acc ^= x;
  return acc;
}`,
    ),
    lc("single-number", "Single Number", "Easy", singleNumberSolution),
    lc("single-number-ii", "Single Number II", "Medium", singleNumberIISolution),
    lc("single-number-iii", "Single Number III", "Medium", singleNumberIIISolution),
  ),
  "missing-number": pack(
    "XOR 1..n with all values. Two missings: split by a differing bit.",
    langs(
      `def missing_number(nums):
    n, acc = len(nums), 0
    for i, x in enumerate(nums):
        acc ^= i ^ x
    return acc ^ n`,
      `int missingNumber(vector<int>& nums) {
    int n = nums.size(), acc = 0;
    for (int i = 0; i < n; i++) acc ^= i ^ nums[i];
    return acc ^ n;
}`,
      `int missingNumber(int[] nums) {
    int n = nums.length, acc = 0;
    for (int i = 0; i < n; i++) acc ^= i ^ nums[i];
    return acc ^ n;
}`,
      `function missingNumber(nums) {
  const n = nums.length;
  let acc = 0;
  for (let i = 0; i < n; i++) acc ^= i ^ nums[i];
  return acc ^ n;
}`,
    ),
    lc("missing-number", "Missing Number", "Easy", missingNumberSolution),
    lc("find-all-numbers-disappeared-in-an-array", "Find All Disappeared", "Easy", findAllDisappearedSolution),
    lc("first-missing-positive", "First Missing Positive", "Hard", firstMissingPositiveSolution),
  ),
  "bit-masking": pack(
    "Int as a set: test (m>>i)&1, set m|1<<i, clear m&~(1<<i).",
    langs(
      `def bits(mask, n):
    return [(mask >> i) & 1 for i in range(n)]

def set_bit(mask, i):
    return mask | (1 << i)

def clear_bit(mask, i):
    return mask & ~(1 << i)`,
      `vector<int> bits(int mask, int n) {
    vector<int> out(n);
    for (int i = 0; i < n; i++) out[i] = (mask >> i) & 1;
    return out;
}
int setBit(int mask, int i) { return mask | (1 << i); }
int clearBit(int mask, int i) { return mask & ~(1 << i); }`,
      `int[] bits(int mask, int n) {
    int[] out = new int[n];
    for (int i = 0; i < n; i++) out[i] = (mask >> i) & 1;
    return out;
}
int setBit(int mask, int i) { return mask | (1 << i); }
int clearBit(int mask, int i) { return mask & ~(1 << i); }`,
      `function bits(mask, n) {
  return Array.from({ length: n }, (_, i) => (mask >> i) & 1);
}
function setBit(mask, i) { return mask | (1 << i); }
function clearBit(mask, i) { return mask & ~(1 << i); }`,
    ),
    lc("number-of-1-bits", "Number of 1 Bits", "Easy", numberOf1BitsSolution),
    lc("counting-bits", "Counting Bits", "Easy", countingBitsSolution),
    lc("subsets", "Subsets", "Medium", subsetsBitMaskingSolution),
  ),
  "subsets-bits": pack(
    "For mask in 0..(1<<n)-1, bit i on means a[i] is in the subset.",
    langs(
      `def subsets(nums):
    n, out = len(nums), []
    for mask in range(1 << n):
        cur = [nums[i] for i in range(n) if mask & (1 << i)]
        out.append(cur)
    return out`,
      `vector<vector<int>> subsets(vector<int>& nums) {
    int n = nums.size();
    vector<vector<int>> out;
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> cur;
        for (int i = 0; i < n; i++)
            if (mask & (1 << i)) cur.push_back(nums[i]);
        out.push_back(cur);
    }
    return out;
}`,
      `List<List<Integer>> subsets(int[] nums) {
    int n = nums.length;
    List<List<Integer>> out = new ArrayList<>();
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> cur = new ArrayList<>();
        for (int i = 0; i < n; i++)
            if ((mask & (1 << i)) != 0) cur.add(nums[i]);
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
    lc("subsets", "Subsets", "Medium", subsetsBitsSolution),
    lc("subsets-ii", "Subsets II", "Medium", subsetsIIBitsSolution),
    lc("repeated-dna-sequences", "Repeated DNA Sequences", "Medium", repeatedDnaSequencesSolution),
  ),
  "trie-insert-search": pack(
    "Each edge a character. Terminal flag marks a full word.",
    langs(
      `class Trie:
    def __init__(self):
        self.ch, self.end = {}, False

    def insert(self, word):
        n = self
        for c in word:
            n = n.ch.setdefault(c, Trie())
        n.end = True

    def search(self, word):
        n = self
        for c in word:
            if c not in n.ch:
                return False
            n = n.ch[c]
        return n.end`,
      `struct Trie {
    unordered_map<char, Trie*> ch;
    bool end = false;
    void insert(string word) {
        Trie* n = this;
        for (char c : word) {
            if (!n->ch[c]) n->ch[c] = new Trie();
            n = n->ch[c];
        }
        n->end = true;
    }
    bool search(string word) {
        Trie* n = this;
        for (char c : word) {
            if (!n->ch.count(c)) return false;
            n = n->ch[c];
        }
        return n->end;
    }
};`,
      `class Trie {
    Map<Character, Trie> ch = new HashMap<>();
    boolean end;
    void insert(String word) {
        Trie n = this;
        for (char c : word.toCharArray())
            n = n.ch.computeIfAbsent(c, k -> new Trie());
        n.end = true;
    }
    boolean search(String word) {
        Trie n = this;
        for (char c : word.toCharArray()) {
            if (!n.ch.containsKey(c)) return false;
            n = n.ch.get(c);
        }
        return n.end;
    }
}`,
      `class Trie {
  constructor() { this.ch = new Map(); this.end = false; }
  insert(word) {
    let n = this;
    for (const c of word) {
      if (!n.ch.has(c)) n.ch.set(c, new Trie());
      n = n.ch.get(c);
    }
    n.end = true;
  }
  search(word) {
    let n = this;
    for (const c of word) {
      if (!n.ch.has(c)) return false;
      n = n.ch.get(c);
    }
    return n.end;
  }
}`,
    ),
    lc("implement-trie-prefix-tree", "Implement Trie", "Medium", implementTrieSolution),
    lc("design-add-and-search-words-data-structure", "Add and Search Words", "Medium", addAndSearchWordsSolution),
    lc("map-sum-pairs", "Map Sum Pairs", "Medium", mapSumPairsSolution),
  ),
  "word-search": pack(
    "Board DFS + trie/word. Prune if prefix missing. Mark, recurse, unmark.",
    langs(
      `def exist(board, word):
    m, n = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word):
            return True
        if not (0 <= r < m and 0 <= c < n) or board[r][c] != word[i]:
            return False
        board[r][c] = "#"
        ok = any(dfs(r + dr, c + dc, i + 1) for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)))
        board[r][c] = word[i]
        return ok
    return any(dfs(r, c, 0) for r in range(m) for c in range(n))`,
      `bool existDfs(vector<vector<char>>& board, string& word, int r, int c, int i) {
    if (i == (int)word.size()) return true;
    int m = board.size(), n = board[0].size();
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] != word[i]) return false;
    char tmp = board[r][c];
    board[r][c] = '#';
    bool ok = existDfs(board, word, r + 1, c, i + 1) || existDfs(board, word, r - 1, c, i + 1)
           || existDfs(board, word, r, c + 1, i + 1) || existDfs(board, word, r, c - 1, i + 1);
    board[r][c] = tmp;
    return ok;
}
bool exist(vector<vector<char>>& board, string word) {
    for (int r = 0; r < (int)board.size(); r++)
        for (int c = 0; c < (int)board[0].size(); c++)
            if (existDfs(board, word, r, c, 0)) return true;
    return false;
}`,
      `boolean existDfs(char[][] board, String word, int r, int c, int i) {
    if (i == word.length()) return true;
    int m = board.length, n = board[0].length;
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] != word.charAt(i)) return false;
    char tmp = board[r][c];
    board[r][c] = '#';
    boolean ok = existDfs(board, word, r + 1, c, i + 1) || existDfs(board, word, r - 1, c, i + 1)
              || existDfs(board, word, r, c + 1, i + 1) || existDfs(board, word, r, c - 1, i + 1);
    board[r][c] = tmp;
    return ok;
}
boolean exist(char[][] board, String word) {
    for (int r = 0; r < board.length; r++)
        for (int c = 0; c < board[0].length; c++)
            if (existDfs(board, word, r, c, 0)) return true;
    return false;
}`,
      `function exist(board, word) {
  const m = board.length, n = board[0].length;
  function dfs(r, c, i) {
    if (i === word.length) return true;
    if (!(0 <= r && r < m && 0 <= c && c < n) || board[r][c] !== word[i]) return false;
    const tmp = board[r][c];
    board[r][c] = "#";
    const ok = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r][c] = tmp;
    return ok;
  }
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (dfs(r, c, 0)) return true;
  return false;
}`,
    ),
    lc("word-search", "Word Search", "Medium", wordSearchL3Solution),
    lc("word-search-ii", "Word Search II", "Hard", wordSearchIISolution),
    lc("implement-trie-prefix-tree", "Implement Trie", "Medium", implementTrieWordSearchSolution),
  ),
  autocomplete: pack(
    "Walk the prefix node, then DFS its subtree for terminals.",
    langs(
      `def suggestions(root, prefix):
    n = root
    for c in prefix:
        if c not in n.ch:
            return []
        n = n.ch[c]
    out = []
    def dfs(node, path):
        if node.end:
            out.append(prefix + path)
        for c, ch in node.ch.items():
            dfs(ch, path + c)
    dfs(n, "")
    return out`,
      `void sugDfs(Trie* node, string prefix, string path, vector<string>& out) {
    if (node->end) out.push_back(prefix + path);
    for (auto& [c, ch] : node->ch) sugDfs(ch, prefix, path + c, out);
}
vector<string> suggestions(Trie* root, string prefix) {
    Trie* n = root;
    for (char c : prefix) {
        if (!n->ch.count(c)) return {};
        n = n->ch[c];
    }
    vector<string> out;
    sugDfs(n, prefix, "", out);
    return out;
}`,
      `void sugDfs(Trie node, String prefix, String path, List<String> out) {
    if (node.end) out.add(prefix + path);
    for (var e : node.ch.entrySet()) sugDfs(e.getValue(), prefix, path + e.getKey(), out);
}
List<String> suggestions(Trie root, String prefix) {
    Trie n = root;
    for (char c : prefix.toCharArray()) {
        if (!n.ch.containsKey(c)) return List.of();
        n = n.ch.get(c);
    }
    List<String> out = new ArrayList<>();
    sugDfs(n, prefix, "", out);
    return out;
}`,
      `function suggestions(root, prefix) {
  let n = root;
  for (const c of prefix) {
    if (!n.ch.has(c)) return [];
    n = n.ch.get(c);
  }
  const out = [];
  function dfs(node, path) {
    if (node.end) out.push(prefix + path);
    for (const [c, ch] of node.ch) dfs(ch, path + c);
  }
  dfs(n, "");
  return out;
}`,
    ),
    lc("search-suggestions-system", "Search Suggestions System", "Medium", searchSuggestionsSystemSolution),
    lc("implement-trie-prefix-tree", "Implement Trie", "Medium", implementTrieAutocompleteSolution),
    lc("replace-words", "Replace Words", "Medium", replaceWordsSolution),
  ),
  "meet-in-middle": pack(
    "Split n/2, enumerate subset sums, match target-x in the other half.",
    langs(
      `def subset_sums(a):
    out = {0}
    for x in a:
        out |= {s + x for s in out}
    return out

def can_sum(a, target):
    mid = len(a) // 2
    L, R = subset_sums(a[:mid]), subset_sums(a[mid:])
    return any(target - s in R for s in L)`,
      `unordered_set<int> subsetSums(vector<int>& a) {
    unordered_set<int> out{0};
    for (int x : a) {
        vector<int> add;
        for (int s : out) add.push_back(s + x);
        out.insert(add.begin(), add.end());
    }
    return out;
}
bool canSum(vector<int>& a, int target) {
    int mid = a.size() / 2;
    vector<int> left(a.begin(), a.begin() + mid), right(a.begin() + mid, a.end());
    auto L = subsetSums(left), R = subsetSums(right);
    for (int s : L) if (R.count(target - s)) return true;
    return false;
}`,
      `HashSet<Integer> subsetSums(int[] a, int lo, int hi) {
    HashSet<Integer> out = new HashSet<>();
    out.add(0);
    for (int i = lo; i < hi; i++) {
        List<Integer> add = new ArrayList<>();
        for (int s : out) add.add(s + a[i]);
        out.addAll(add);
    }
    return out;
}
boolean canSum(int[] a, int target) {
    int mid = a.length / 2;
    HashSet<Integer> L = subsetSums(a, 0, mid), R = subsetSums(a, mid, a.length);
    for (int s : L) if (R.contains(target - s)) return true;
    return false;
}`,
      `function subsetSums(a) {
  const out = new Set([0]);
  for (const x of a) {
    for (const s of [...out]) out.add(s + x);
  }
  return out;
}
function canSum(a, target) {
  const mid = Math.floor(a.length / 2);
  const L = subsetSums(a.slice(0, mid)), R = subsetSums(a.slice(mid));
  for (const s of L) if (R.has(target - s)) return true;
  return false;
}`,
    ),
    lc("closest-subsequence-sum", "Closest Subsequence Sum", "Hard", closestSubsequenceSumSolution),
    lc("partition-array-into-two-arrays-to-minimize-sum-difference", "Min Sum Difference", "Hard", minSumDifferenceSolution),
    lc("ones-and-zeroes", "Ones and Zeroes", "Medium", onesAndZeroesMitmSolution),
  ),
  "window-dp": pack(
    "dp[i] uses max/min over a window of prior dp. Deque keeps candidates.",
    langs(
      `from collections import deque

def max_result(a, k):
    n = len(a)
    dp = [0] * n
    dp[0] = a[0]
    q = deque([0])
    for i in range(1, n):
        while q and q[0] < i - k:
            q.popleft()
        dp[i] = a[i] + dp[q[0]]
        while q and dp[q[-1]] <= dp[i]:
            q.pop()
        q.append(i)
    return dp[-1]`,
      `int maxResult(vector<int>& a, int k) {
    int n = a.size();
    vector<int> dp(n);
    dp[0] = a[0];
    deque<int> q{0};
    for (int i = 1; i < n; i++) {
        while (!q.empty() && q.front() < i - k) q.pop_front();
        dp[i] = a[i] + dp[q.front()];
        while (!q.empty() && dp[q.back()] <= dp[i]) q.pop_back();
        q.push_back(i);
    }
    return dp[n - 1];
}`,
      `int maxResult(int[] a, int k) {
    int n = a.length;
    int[] dp = new int[n];
    dp[0] = a[0];
    Deque<Integer> q = new ArrayDeque<>();
    q.add(0);
    for (int i = 1; i < n; i++) {
        while (!q.isEmpty() && q.peekFirst() < i - k) q.pollFirst();
        dp[i] = a[i] + dp[q.peekFirst()];
        while (!q.isEmpty() && dp[q.peekLast()] <= dp[i]) q.pollLast();
        q.addLast(i);
    }
    return dp[n - 1];
}`,
      `function maxResult(a, k) {
  const n = a.length, dp = Array(n).fill(0);
  dp[0] = a[0];
  const q = [0];
  for (let i = 1; i < n; i++) {
    while (q.length && q[0] < i - k) q.shift();
    dp[i] = a[i] + dp[q[0]];
    while (q.length && dp[q[q.length - 1]] <= dp[i]) q.pop();
    q.push(i);
  }
  return dp[n - 1];
}`,
    ),
    lc("jump-game-vi", "Jump Game VI", "Medium", jumpGameVISolution),
    lc("constrained-subsequence-sum", "Constrained Subsequence Sum", "Hard", constrainedSubsequenceSumSolution),
    lc("sliding-window-maximum", "Sliding Window Maximum", "Hard", slidingWindowMaximumSolution),
  ),
  "binary-lifting": pack(
    "up[u][k] = 2^k-th ancestor. Jump by bits of the distance / LCA.",
    langs(
      `def build_up(n, parent):
    LOG = n.bit_length()
    up = [[-1] * LOG for _ in range(n)]
    for i in range(n):
        up[i][0] = parent[i]
    for k in range(1, LOG):
        for i in range(n):
            p = up[i][k - 1]
            up[i][k] = -1 if p < 0 else up[p][k - 1]
    return up

def kth_ancestor(up, node, k):
    bit = 0
    while k and node >= 0:
        if k & 1:
            node = up[node][bit]
        k >>= 1
        bit += 1
    return node`,
      `vector<vector<int>> buildUp(int n, vector<int>& parent) {
    int LOG = 32 - __builtin_clz(max(n, 1));
    vector<vector<int>> up(n, vector<int>(LOG, -1));
    for (int i = 0; i < n; i++) up[i][0] = parent[i];
    for (int k = 1; k < LOG; k++)
        for (int i = 0; i < n; i++) {
            int p = up[i][k - 1];
            up[i][k] = p < 0 ? -1 : up[p][k - 1];
        }
    return up;
}
int kthAncestor(vector<vector<int>>& up, int node, int k) {
    int bit = 0;
    while (k && node >= 0) {
        if (k & 1) node = up[node][bit];
        k >>= 1; bit++;
    }
    return node;
}`,
      `int[][] buildUp(int n, int[] parent) {
    int LOG = 32 - Integer.numberOfLeadingZeros(Math.max(n, 1));
    int[][] up = new int[n][LOG];
    for (int i = 0; i < n; i++) Arrays.fill(up[i], -1);
    for (int i = 0; i < n; i++) up[i][0] = parent[i];
    for (int k = 1; k < LOG; k++)
        for (int i = 0; i < n; i++) {
            int p = up[i][k - 1];
            up[i][k] = p < 0 ? -1 : up[p][k - 1];
        }
    return up;
}
int kthAncestor(int[][] up, int node, int k) {
    int bit = 0;
    while (k != 0 && node >= 0) {
        if ((k & 1) != 0) node = up[node][bit];
        k >>= 1; bit++;
    }
    return node;
}`,
      `function buildUp(n, parent) {
  const LOG = n.toString(2).length;
  const up = Array.from({ length: n }, () => Array(LOG).fill(-1));
  for (let i = 0; i < n; i++) up[i][0] = parent[i];
  for (let k = 1; k < LOG; k++)
    for (let i = 0; i < n; i++) {
      const p = up[i][k - 1];
      up[i][k] = p < 0 ? -1 : up[p][k - 1];
    }
  return up;
}
function kthAncestor(up, node, k) {
  let bit = 0;
  while (k && node >= 0) {
    if (k & 1) node = up[node][bit];
    k >>= 1; bit++;
  }
  return node;
}`,
    ),
    lc("kth-ancestor-of-a-tree-node", "Kth Ancestor", "Hard", kthAncestorSolution),
    lc("lowest-common-ancestor-of-a-binary-tree", "LCA", "Medium", lcaBinaryLiftingSolution),
    lc("step-by-step-directions-from-a-binary-tree-node-to-another", "Step-by-Step Directions", "Medium", stepByStepDirectionsSolution),
  ),
  "mos-algorithm": pack(
    "Offline queries. Sort by block(L), then R. Add/remove while moving L,R.",
    langs(
      `def mos(a, queries, B):
    qs = sorted(enumerate(queries), key=lambda iq: (iq[1][0] // B, iq[1][1]))
    L = R = 0
    # maintain freq while [L, R) is the current window
    ans = [0] * len(queries)
    for qi, (l, r) in qs:
        while L > l:  # extend left
            L -= 1
        while R < r:  # extend right
            R += 1
        while L < l:
            L += 1
        while R > r:
            R -= 1
        ans[qi] = 0  # read structure
    return ans`,
      `vector<int> mos(vector<int>& a, vector<pair<int,int>>& queries, int B) {
    int qn = queries.size();
    vector<int> idx(qn);
    iota(idx.begin(), idx.end(), 0);
    sort(idx.begin(), idx.end(), [&](int i, int j) {
        if (queries[i].first / B != queries[j].first / B)
            return queries[i].first / B < queries[j].first / B;
        return queries[i].second < queries[j].second;
    });
    int L = 0, R = 0;
    // maintain freq while [L, R) is the current window
    vector<int> ans(qn);
    for (int qi : idx) {
        auto [l, r] = queries[qi];
        while (L > l) L--; // extend left
        while (R < r) R++; // extend right
        while (L < l) L++;
        while (R > r) R--;
        ans[qi] = 0; // read structure
    }
    return ans;
}`,
      `int[] mos(int[] a, int[][] queries, int B) {
    int qn = queries.length;
    Integer[] idx = new Integer[qn];
    for (int i = 0; i < qn; i++) idx[i] = i;
    Arrays.sort(idx, (i, j) -> {
        int bi = queries[i][0] / B, bj = queries[j][0] / B;
        if (bi != bj) return Integer.compare(bi, bj);
        return Integer.compare(queries[i][1], queries[j][1]);
    });
    int L = 0, R = 0;
    // maintain freq while [L, R) is the current window
    int[] ans = new int[qn];
    for (int qi : idx) {
        int l = queries[qi][0], r = queries[qi][1];
        while (L > l) L--; // extend left
        while (R < r) R++; // extend right
        while (L < l) L++;
        while (R > r) R--;
        ans[qi] = 0; // read structure
    }
    return ans;
}`,
      `function mos(a, queries, B) {
  const qs = queries.map((q, i) => [i, q]).sort((A, Bq) => {
    const [l1, r1] = A[1], [l2, r2] = Bq[1];
    const b1 = Math.floor(l1 / B), b2 = Math.floor(l2 / B);
    return b1 !== b2 ? b1 - b2 : r1 - r2;
  });
  let L = 0, R = 0;
  // maintain freq while [L, R) is the current window
  const ans = Array(queries.length).fill(0);
  for (const [qi, [l, r]] of qs) {
    while (L > l) L--; // extend left
    while (R < r) R++; // extend right
    while (L < l) L++;
    while (R > r) R--;
    ans[qi] = 0; // read structure
  }
  return ans;
}`,
    ),
    lc("range-frequency-queries", "Range Frequency Queries", "Medium", rangeFrequencyQueriesSolution),
    gfg("mos-algorithm", "Mo's Algorithm (GFG)", "Hard", mosAlgorithmGfgSolution),
    lc("online-majority-element-in-subarray", "Online Majority in Subarray", "Hard", onlineMajorityElementSolution),
  ),
};

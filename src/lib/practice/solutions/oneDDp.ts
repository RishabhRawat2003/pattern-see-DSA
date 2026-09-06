import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const climbingStairs1dSolution: ProblemSolution = {
  approach:
    "1D DP: dp[i] = ways to reach step i = dp[i−1] + dp[i−2]. Roll two variables for O(1) space. O(n) time.",
  templates: langs(
    `def climbStairs(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
    `int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int nxt = a + b; a = b; b = nxt;
    }
    return b;
}`,
    `int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int nxt = a + b; a = b; b = nxt;
    }
    return b;
}`,
    `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
  ),
  frames: (() => {
    const dp = [1, 1, 2, 3, 5];
    return [
      arrayFrame(
        "Stairs n = 4",
        "dp[i] = ways to reach step i. Base: dp[0]=1, dp[1]=1.",
        ["dp0", "dp1", "dp2", "dp3", "dp4"],
        { 0: "lo", 1: "lo" },
        { note: "dp[0]=1 · dp[1]=1" },
      ),
      arrayFrame(
        "i = 2",
        "dp[2] = dp[1] + dp[0] = 2 (one 2-step, or two 1-steps).",
        dp,
        { 0: "lo", 1: "hi", 2: "active" },
        {
          pointers: [{ name: "i", index: 2, color: PTR.M }],
          note: "2 = 1+1",
        },
      ),
      arrayFrame(
        "i = 3",
        "dp[3] = dp[2] + dp[1] = 3.",
        dp,
        { 1: "lo", 2: "hi", 3: "active" },
        {
          pointers: [{ name: "i", index: 3, color: PTR.M }],
          note: "3 = 2+1",
        },
      ),
      arrayFrame(
        "i = 4",
        "dp[4] = dp[3] + dp[2] = 5. Linear fill — no recursion tree.",
        dp,
        { 2: "lo", 3: "hi", 4: "active" },
        {
          pointers: [{ name: "i", index: 4, color: PTR.M }],
          note: "5 = 3+2",
        },
      ),
      arrayFrame(
        "Answer",
        "5 distinct ways to climb 4 stairs.",
        dp,
        { 4: "match" },
        { note: "return 5" },
      ),
    ];
  })(),
};

export const minCostClimbingStairsSolution: ProblemSolution = {
  approach:
    "dp[i] = cost[i] + min(dp[i−1], dp[i−2]). Start from either index 0 or 1; answer is min of the last two cells. O(n) time, O(1) space with two rolls.",
  templates: langs(
    `def minCostClimbingStairs(cost):
    a, b = cost[0], cost[1]
    for i in range(2, len(cost)):
        a, b = b, cost[i] + min(a, b)
    return min(a, b)`,
    `int minCostClimbingStairs(vector<int>& cost) {
    int a = cost[0], b = cost[1];
    for (int i = 2; i < (int)cost.size(); i++) {
        int nxt = cost[i] + min(a, b);
        a = b; b = nxt;
    }
    return min(a, b);
}`,
    `int minCostClimbingStairs(int[] cost) {
    int a = cost[0], b = cost[1];
    for (int i = 2; i < cost.length; i++) {
        int nxt = cost[i] + Math.min(a, b);
        a = b; b = nxt;
    }
    return Math.min(a, b);
}`,
    `function minCostClimbingStairs(cost) {
  let a = cost[0], b = cost[1];
  for (let i = 2; i < cost.length; i++) {
    [a, b] = [b, cost[i] + Math.min(a, b)];
  }
  return Math.min(a, b);
}`,
  ),
  frames: (() => {
    const cost = [10, 15, 20];
    return [
      arrayFrame(
        "cost = [10, 15, 20]",
        "Pay cost[i] when you leave step i. Can start at 0 or 1 for free entry.",
        cost,
        {},
        { note: "top is past last index" },
      ),
      arrayFrame(
        "Base dp[0], dp[1]",
        "dp[0]=10, dp[1]=15 — cost of standing on that step.",
        cost,
        { 0: "lo", 1: "hi" },
        { note: "dp = 10, 15" },
      ),
      arrayFrame(
        "i = 2 (cost 20)",
        "dp[2] = 20 + min(10, 15) = 30. Arrive via cheaper prior step 0.",
        cost,
        { 0: "match", 2: "active" },
        {
          pointers: [{ name: "i", index: 2, color: PTR.M }],
          note: "dp[2]=30",
        },
      ),
      arrayFrame(
        "Reach the top",
        "Top = min(dp[1], dp[2]) = min(15, 30) = 15 — start at step 1, pay 15, done.",
        cost,
        { 1: "match" },
        { note: "min(15, 30)" },
      ),
      arrayFrame(
        "Answer",
        "Minimum cost is 15.",
        cost,
        { 1: "match" },
        { note: "return 15" },
      ),
    ];
  })(),
};

export const houseRobber1dSolution: ProblemSolution = {
  approach:
    "Cannot rob adjacent houses: dp[i] = max(dp[i−1], nums[i] + dp[i−2]). Roll prev/cur. O(n) time, O(1) space.",
  templates: langs(
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
  frames: (() => {
    const houses = [2, 7, 9, 3];
    return [
      arrayFrame(
        "Houses [2, 7, 9, 3]",
        "Cannot rob neighbors. At each house: skip (keep cur) or rob (prev + value).",
        houses,
        {},
        { note: "prev=0 · cur=0" },
      ),
      arrayFrame(
        "House 2",
        "max(0, 0+2)=2. Rob first house.",
        houses,
        { 0: "match" },
        {
          pointers: [{ name: "i", index: 0, color: PTR.M }],
          note: "prev 0 · cur 2",
        },
      ),
      arrayFrame(
        "House 7",
        "max(2, 0+7)=7. Better to take 7 alone.",
        houses,
        { 0: "skip", 1: "match" },
        {
          pointers: [{ name: "i", index: 1, color: PTR.M }],
          note: "prev 2 · cur 7",
        },
      ),
      arrayFrame(
        "House 9",
        "max(7, 2+9)=11. Rob 2 and 9 (skip 7).",
        houses,
        { 0: "match", 1: "skip", 2: "match" },
        {
          pointers: [{ name: "i", index: 2, color: PTR.M }],
          note: "prev 7 · cur 11",
        },
      ),
      arrayFrame(
        "House 3",
        "max(11, 7+3=10)=11. Adding 3 does not beat 2+9.",
        houses,
        { 0: "match", 2: "match", 3: "skip" },
        {
          pointers: [{ name: "i", index: 3, color: PTR.M }],
          note: "prev 11 · cur 11",
        },
      ),
      arrayFrame(
        "Answer",
        "Best loot is 11 from houses 2 and 9.",
        houses,
        { 0: "match", 2: "match" },
        { note: "return 11" },
      ),
    ];
  })(),
};

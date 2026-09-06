import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const coinChangeSolution: ProblemSolution = {
  approach:
    "Unbounded knapsack: dp[x] = fewest coins for amount x. For each x try every coin c ≤ x → min(dp[x], 1+dp[x−c]). O(amount·coins).",
  templates: langs(
    `def coinChange(coins, amount):
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
    for (int x = 1; x <= amount; x++)
        for (int c : coins)
            if (c <= x) dp[x] = min(dp[x], 1 + dp[x - c]);
    return dp[amount] < inf ? dp[amount] : -1;
}`,
    `int coinChange(int[] coins, int amount) {
    int inf = amount + 1;
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, inf);
    dp[0] = 0;
    for (int x = 1; x <= amount; x++)
        for (int c : coins)
            if (c <= x) dp[x] = Math.min(dp[x], 1 + dp[x - c]);
    return dp[amount] < inf ? dp[amount] : -1;
}`,
    `function coinChange(coins, amount) {
  const inf = amount + 1;
  const dp = Array(amount + 1).fill(inf);
  dp[0] = 0;
  for (let x = 1; x <= amount; x++)
    for (const c of coins)
      if (c <= x) dp[x] = Math.min(dp[x], 1 + dp[x - c]);
  return dp[amount] < inf ? dp[amount] : -1;
}`,
  ),
  frames: (() => {
    const inf = "∞";
    const start = [0, ...Array.from({ length: 11 }, () => inf)];
    const with1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const with2 = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6];
    const with5 = [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3];
    return [
      arrayFrame(
        "dp[0..11] · coins 1,2,5",
        "dp[x] = fewest coins for x. Start ∞ except dp[0]=0.",
        start,
        { 0: "lo" },
        { note: "amount 11" },
      ),
      arrayFrame(
        "After coin 1",
        "Every x gets 1 + dp[x−1]. All amounts possible, wastefully.",
        with1,
        { 11: "window" },
        {
          pointers: [{ name: "x", index: 11, color: PTR.M }],
          note: "dp[11]=11",
        },
      ),
      arrayFrame(
        "After coin 2",
        "Try 1 + dp[x−2]. Even amounts drop.",
        with2,
        { 4: "active", 11: "window" },
        { note: "dp[11]=6" },
      ),
      arrayFrame(
        "Coin 5 · x = 5",
        "dp[5] = min(5, 1+dp[0]) = 1. One nickel.",
        with5,
        { 5: "active" },
        {
          pointers: [{ name: "x", index: 5, color: PTR.M }],
          note: "dp[5]=1",
        },
      ),
      arrayFrame(
        "Coin 5 · x = 11",
        "min(6, 1+dp[6]=3)=3. Combination 5+5+1.",
        with5,
        { 6: "lo", 11: "match" },
        {
          pointers: [{ name: "x", index: 11, color: PTR.M }],
          note: "3 coins",
        },
      ),
      arrayFrame(
        "Answer",
        "Fewest coins for 11 is 3.",
        with5,
        { 11: "match" },
        { note: "return 3" },
      ),
    ];
  })(),
};

export const coinChangeIISolution: ProblemSolution = {
  approach:
    "Count combinations (order irrelevant): outer loop coins, inner amount forward so each coin is used unlimited but combinations not permutations. dp[0]=1. O(coins·amount).",
  templates: langs(
    `def change(amount, coins):
    dp = [1] + [0] * amount
    for c in coins:
        for x in range(c, amount + 1):
            dp[x] += dp[x - c]
    return dp[amount]`,
    `int change(int amount, vector<int>& coins) {
    vector<int> dp(amount + 1);
    dp[0] = 1;
    for (int c : coins)
        for (int x = c; x <= amount; x++)
            dp[x] += dp[x - c];
    return dp[amount];
}`,
    `int change(int amount, int[] coins) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;
    for (int c : coins)
        for (int x = c; x <= amount; x++)
            dp[x] += dp[x - c];
    return dp[amount];
}`,
    `function change(amount, coins) {
  const dp = Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const c of coins)
    for (let x = c; x <= amount; x++) dp[x] += dp[x - c];
  return dp[amount];
}`,
  ),
  frames: [
    arrayFrame(
      "amount 5 · coins [1,2,5]",
      "dp[x] = number of combinations for x. Seed dp[0]=1.",
      [1, 0, 0, 0, 0, 0],
      { 0: "lo" },
      { note: "outer = coins" },
    ),
    arrayFrame(
      "Coin 1",
      "Every amount gains the 1-only combination. dp becomes all 1s.",
      [1, 1, 1, 1, 1, 1],
      { 5: "active" },
      {
        pointers: [{ name: "x", index: 5, color: PTR.M }],
        note: "only {1×k}",
      },
    ),
    arrayFrame(
      "Coin 2 · x=2",
      "dp[2] += dp[0] → 2. Ways: {1,1} and {2}.",
      [1, 1, 2, 1, 1, 1],
      { 2: "active" },
      { note: "dp[2]=2" },
    ),
    arrayFrame(
      "Coin 2 · finish",
      "Propagate: dp[5]=3 → {1×5}, {1×3,2}, {1,2×2}.",
      [1, 1, 2, 2, 3, 3],
      { 5: "active" },
      { note: "dp[5]=3" },
    ),
    arrayFrame(
      "Coin 5",
      "dp[5] += dp[0] → 4. Add the single {5}.",
      [1, 1, 2, 2, 3, 4],
      { 5: "match" },
      {
        pointers: [{ name: "x", index: 5, color: PTR.M }],
        note: "4 combinations",
      },
    ),
    arrayFrame(
      "Answer",
      "Four unordered ways to make 5.",
      [1, 1, 2, 2, 3, 4],
      { 5: "match" },
      { note: "return 4" },
    ),
  ],
};

export const combinationSumIVSolution: ProblemSolution = {
  approach:
    "Count permutations (order matters): outer amount, inner coins. dp[x] += dp[x−c] for each coin. Same recurrence as climb stairs with coin steps. O(amount·coins).",
  templates: langs(
    `def combinationSum4(nums, target):
    dp = [1] + [0] * target
    for x in range(1, target + 1):
        for c in nums:
            if c <= x:
                dp[x] += dp[x - c]
    return dp[target]`,
    `int combinationSum4(vector<int>& nums, int target) {
    vector<unsigned int> dp(target + 1);
    dp[0] = 1;
    for (int x = 1; x <= target; x++)
        for (int c : nums)
            if (c <= x) dp[x] += dp[x - c];
    return (int)dp[target];
}`,
    `int combinationSum4(int[] nums, int target) {
    int[] dp = new int[target + 1];
    dp[0] = 1;
    for (int x = 1; x <= target; x++)
        for (int c : nums)
            if (c <= x) dp[x] += dp[x - c];
    return dp[target];
}`,
    `function combinationSum4(nums, target) {
  const dp = Array(target + 1).fill(0);
  dp[0] = 1;
  for (let x = 1; x <= target; x++)
    for (const c of nums)
      if (c <= x) dp[x] += dp[x - c];
  return dp[target];
}`,
  ),
  frames: (() => {
    return [
      arrayFrame(
        "nums [1,2,3] · target 4",
        "Order matters: (1,3) and (3,1) both count. Outer loop is amount.",
        [1, 0, 0, 0, 0],
        { 0: "lo" },
        { note: "dp[0]=1" },
      ),
      arrayFrame(
        "x = 1",
        "Only coin 1: dp[1] = dp[0] = 1.",
        [1, 1, 0, 0, 0],
        { 1: "active" },
        {
          pointers: [{ name: "x", index: 1, color: PTR.M }],
          note: "dp[1]=1",
        },
      ),
      arrayFrame(
        "x = 2",
        "1→dp[1], 2→dp[0] → 1+1=2. Sequences: 1+1, 2.",
        [1, 1, 2, 0, 0],
        { 2: "active" },
        { note: "dp[2]=2" },
      ),
      arrayFrame(
        "x = 3",
        "1→2, 2→1, 3→1 → 4 ways.",
        [1, 1, 2, 4, 0],
        { 3: "active" },
        { note: "dp[3]=4" },
      ),
      arrayFrame(
        "x = 4",
        "1→4 + 2→2 + 3→1 = 7. More than coin-change-II's combinations.",
        [1, 1, 2, 4, 7],
        { 4: "match" },
        {
          pointers: [{ name: "x", index: 4, color: PTR.M }],
          note: "permutations",
        },
      ),
      arrayFrame(
        "Answer",
        "7 ordered ways to sum to 4.",
        [1, 1, 2, 4, 7],
        { 4: "match" },
        { note: "return 7" },
      ),
    ];
  })(),
};

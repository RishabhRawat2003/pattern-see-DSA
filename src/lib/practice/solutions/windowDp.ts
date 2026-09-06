import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function jumpGameVIFrames() {
  const a = [1, -1, -2, 4, -7, 3];
  const k = 2;
  return [
    arrayFrame("Jump Game VI · k=2", "dp[i]=nums[i]+max(dp[j]) for j in [i−k,i). Monotonic deque of decreasing dp indices.", a, {}, {
      note: `k=${k}`,
    }),
    arrayFrame("i=0", "dp[0]=1. Deque=[0].", a, { 0: "active" }, {
      pointers: [{ name: "i", index: 0, color: PTR.M }],
      note: "dp=1",
    }),
    arrayFrame("i=1", "Window {0}. dp[1]=−1+1=0. Deque keeps best front.", a, { 0: "window", 1: "active" }, {
      window: [0, 1],
      note: "dp 1,0",
    }),
    arrayFrame("i=3", "Best prior in window is dp[0]=1 (or updated). dp[3]=4+max=5.", a, { 1: "window", 2: "window", 3: "active" }, {
      window: [1, 3],
      note: "dp[3]=5",
    }),
    arrayFrame("Drop stale", "Pop front when index < i−k. Pop back while dp[back] ≤ dp[i].", a, { 3: "match", 5: "active" }, {
      note: "deque",
    }),
    arrayFrame("Answer", "dp[n−1] is the max score ending at the last index.", a, { 0: "match", 3: "match", 5: "match" }, {
      note: "return dp[-1]",
    }),
  ];
}

function constrainedSubsequenceFrames() {
  const a = [10, 2, -10, 5, 20];
  return [
    arrayFrame(
      "Constrained subsequence · k=2",
      "Like Jump Game VI but you may skip (start fresh): dp[i]=nums[i]+max(0, max dp in window).",
      a,
      {},
      { note: "k=2" },
    ),
    arrayFrame("i=0", "dp[0]=10.", a, { 0: "active" }, { note: "dp=10" }),
    arrayFrame("i=1", "dp[1]=2+10=12.", a, { 0: "window", 1: "active" }, { window: [0, 1], note: "12" }),
    arrayFrame("i=2", "max prior=12 but −10+12=2; still keep deque of decreasing dp.", a, { 0: "window", 1: "window", 2: "active" }, {
      window: [0, 2],
      note: "dp=2",
    }),
    arrayFrame("i=4", "Best chain 10→2→5→20 or 10→5→20. Answer 37.", a, { 0: "match", 1: "match", 3: "match", 4: "match" }, {
      note: "37",
    }),
    arrayFrame("max(0, …)", "If the window max is negative, start a new subsequence at nums[i].", a, { 2: "skip" }, {
      note: "optional restart",
    }),
  ];
}

function slidingWindowMaximumFrames() {
  const a = [1, 3, -1, -3, 5, 3, 6, 7];
  return [
    arrayFrame("Window size k=3", "Deque stores indices of candidates in decreasing value order. Front is the max.", a, {}, {
      note: "k=3",
    }),
    arrayFrame("First window", "[1,3,-1] → max 3. Deque=[1] (index of 3).", a, { 0: "window", 1: "match", 2: "window" }, {
      window: [0, 2],
      pointers: [
        { name: "L", index: 0, color: PTR.L },
        { name: "R", index: 2, color: PTR.R },
      ],
      note: "max=3",
    }),
    arrayFrame("Slide to [3,-1,-3]", "Drop index 0 if out of window. Max still 3.", a, { 1: "match", 2: "window", 3: "window" }, {
      window: [1, 3],
      note: "max=3",
    }),
    arrayFrame("Slide to [-1,-3,5]", "Pop smaller backs; 5 becomes front. Max=5.", a, { 2: "window", 3: "window", 4: "match" }, {
      window: [2, 4],
      note: "max=5",
    }),
    arrayFrame("Continue", "Windows yield [3,3,5,5,6,7].", a, { 5: "window", 6: "window", 7: "match" }, {
      window: [5, 7],
      note: "max=7",
    }),
    arrayFrame("Answer", "O(n) time: each index enters/leaves the deque at most once.", a, { 7: "match" }, {
      note: "[3,3,5,5,6,7]",
    }),
  ];
}

export const jumpGameVISolution: ProblemSolution = {
  approach:
    "dp[i]=nums[i]+max(dp[i−k..i−1]). Maintain a decreasing deque of dp indices; pop stale front and worse back. O(n) time, O(n) space.",
  templates: langs(
    `from collections import deque
def maxResult(nums, k):
    n = len(nums)
    dp = [0] * n
    dp[0] = nums[0]
    q = deque([0])
    for i in range(1, n):
        while q and q[0] < i - k: q.popleft()
        dp[i] = nums[i] + dp[q[0]]
        while q and dp[q[-1]] <= dp[i]: q.pop()
        q.append(i)
    return dp[-1]`,
    `int maxResult(vector<int>& nums, int k) {
    int n = nums.size();
    vector<int> dp(n); dp[0] = nums[0];
    deque<int> q{0};
    for (int i = 1; i < n; i++) {
        while (!q.empty() && q.front() < i - k) q.pop_front();
        dp[i] = nums[i] + dp[q.front()];
        while (!q.empty() && dp[q.back()] <= dp[i]) q.pop_back();
        q.push_back(i);
    }
    return dp[n - 1];
}`,
    `int maxResult(int[] nums, int k) {
    int n = nums.length;
    int[] dp = new int[n]; dp[0] = nums[0];
    Deque<Integer> q = new ArrayDeque<>(); q.add(0);
    for (int i = 1; i < n; i++) {
        while (!q.isEmpty() && q.peekFirst() < i - k) q.pollFirst();
        dp[i] = nums[i] + dp[q.peekFirst()];
        while (!q.isEmpty() && dp[q.peekLast()] <= dp[i]) q.pollLast();
        q.addLast(i);
    }
    return dp[n - 1];
}`,
    `function maxResult(nums, k) {
  const n = nums.length, dp = Array(n).fill(0);
  dp[0] = nums[0];
  const q = [0];
  for (let i = 1; i < n; i++) {
    while (q.length && q[0] < i - k) q.shift();
    dp[i] = nums[i] + dp[q[0]];
    while (q.length && dp[q[q.length - 1]] <= dp[i]) q.pop();
    q.push(i);
  }
  return dp[n - 1];
}`,
  ),
  frames: jumpGameVIFrames(),
};

export const constrainedSubsequenceSumSolution: ProblemSolution = {
  approach:
    "dp[i]=nums[i]+max(0, max dp in [i−k,i)). Same decreasing deque as Jump Game VI; take global max dp. O(n) time.",
  templates: langs(
    `from collections import deque
def constrainedSubsetSum(nums, k):
    n = len(nums)
    dp = nums[:]
    q = deque([0])
    best = nums[0]
    for i in range(1, n):
        while q and q[0] < i - k: q.popleft()
        dp[i] = nums[i] + max(0, dp[q[0]])
        best = max(best, dp[i])
        while q and dp[q[-1]] <= dp[i]: q.pop()
        q.append(i)
    return best`,
    `int constrainedSubsetSum(vector<int>& nums, int k) {
    int n = nums.size();
    vector<int> dp = nums;
    deque<int> q{0};
    int best = nums[0];
    for (int i = 1; i < n; i++) {
        while (!q.empty() && q.front() < i - k) q.pop_front();
        dp[i] = nums[i] + max(0, dp[q.front()]);
        best = max(best, dp[i]);
        while (!q.empty() && dp[q.back()] <= dp[i]) q.pop_back();
        q.push_back(i);
    }
    return best;
}`,
    `int constrainedSubsetSum(int[] nums, int k) {
    int n = nums.length;
    int[] dp = nums.clone();
    Deque<Integer> q = new ArrayDeque<>(); q.add(0);
    int best = nums[0];
    for (int i = 1; i < n; i++) {
        while (!q.isEmpty() && q.peekFirst() < i - k) q.pollFirst();
        dp[i] = nums[i] + Math.max(0, dp[q.peekFirst()]);
        best = Math.max(best, dp[i]);
        while (!q.isEmpty() && dp[q.peekLast()] <= dp[i]) q.pollLast();
        q.addLast(i);
    }
    return best;
}`,
    `function constrainedSubsetSum(nums, k) {
  const n = nums.length, dp = nums.slice();
  const q = [0];
  let best = nums[0];
  for (let i = 1; i < n; i++) {
    while (q.length && q[0] < i - k) q.shift();
    dp[i] = nums[i] + Math.max(0, dp[q[0]]);
    best = Math.max(best, dp[i]);
    while (q.length && dp[q[q.length - 1]] <= dp[i]) q.pop();
    q.push(i);
  }
  return best;
}`,
  ),
  frames: constrainedSubsequenceFrames(),
};

export const slidingWindowMaximumSolution: ProblemSolution = {
  approach:
    "Monotonic decreasing deque of indices. Front is max of the current window; pop stale and smaller backs. O(n) time, O(k) space.",
  templates: langs(
    `from collections import deque
def maxSlidingWindow(nums, k):
    q, out = deque(), []
    for i, x in enumerate(nums):
        while q and q[0] <= i - k: q.popleft()
        while q and nums[q[-1]] <= x: q.pop()
        q.append(i)
        if i >= k - 1: out.append(nums[q[0]])
    return out`,
    `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> q; vector<int> out;
    for (int i = 0; i < (int)nums.size(); i++) {
        while (!q.empty() && q.front() <= i - k) q.pop_front();
        while (!q.empty() && nums[q.back()] <= nums[i]) q.pop_back();
        q.push_back(i);
        if (i >= k - 1) out.push_back(nums[q.front()]);
    }
    return out;
}`,
    `int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> q = new ArrayDeque<>();
    int[] out = new int[nums.length - k + 1];
    for (int i = 0; i < nums.length; i++) {
        while (!q.isEmpty() && q.peekFirst() <= i - k) q.pollFirst();
        while (!q.isEmpty() && nums[q.peekLast()] <= nums[i]) q.pollLast();
        q.addLast(i);
        if (i >= k - 1) out[i - k + 1] = nums[q.peekFirst()];
    }
    return out;
}`,
    `function maxSlidingWindow(nums, k) {
  const q = [], out = [];
  for (let i = 0; i < nums.length; i++) {
    while (q.length && q[0] <= i - k) q.shift();
    while (q.length && nums[q[q.length - 1]] <= nums[i]) q.pop();
    q.push(i);
    if (i >= k - 1) out.push(nums[q[0]]);
  }
  return out;
}`,
  ),
  frames: slidingWindowMaximumFrames(),
};

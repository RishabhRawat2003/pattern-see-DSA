import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const longestIncreasingSubsequenceSolution: ProblemSolution = {
  approach:
    "dp[i] = LIS ending at i: 1 + max dp[j] for j < i with a[j] < a[i]. Answer is max(dp). O(n²); patience/binary-search tails is O(n log n).",
  templates: langs(
    `def lengthOfLIS(nums):
    dp = [1] * len(nums)
    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp, default=0)`,
    `int lengthOfLIS(vector<int>& nums) {
    int n = nums.size(), best = 0;
    vector<int> dp(n, 1);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i]) dp[i] = max(dp[i], dp[j] + 1);
        best = max(best, dp[i]);
    }
    return best;
}`,
    `int lengthOfLIS(int[] nums) {
    int n = nums.length, best = 0;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
        best = Math.max(best, dp[i]);
    }
    return best;
}`,
    `function lengthOfLIS(nums) {
  const n = nums.length, dp = Array(n).fill(1);
  let best = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++)
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    best = Math.max(best, dp[i]);
  }
  return best;
}`,
  ),
  frames: (() => {
    const a = [10, 9, 2, 5, 3, 7];
    return [
      arrayFrame(
        "Array",
        "dp[i] = LIS ending at i. Scan left for a smaller predecessor.",
        a,
        {},
        { note: "all dp start 1" },
      ),
      arrayFrame(
        "i = 0,1",
        "10 and 9 are both length-1 starts (9 cannot extend 10).",
        a,
        { 0: "lo", 1: "lo" },
        {
          pointers: [{ name: "i", index: 1, color: PTR.M }],
          note: "dp = 1,1,…",
        },
      ),
      arrayFrame(
        "2 starts a run",
        "2 is smaller than both left values — new LIS of length 1.",
        a,
        { 2: "active" },
        {
          pointers: [{ name: "i", index: 2, color: PTR.M }],
          note: "dp[2]=1",
        },
      ),
      arrayFrame(
        "5 extends 2",
        "5 > 2 → dp[3] = 2. First increasing pair.",
        a,
        { 2: "lo", 3: "match" },
        {
          pointers: [{ name: "i", index: 3, color: PTR.M }],
          note: "2,5",
        },
      ),
      arrayFrame(
        "3 also extends 2",
        "3 > 2 → length 2 on a different branch (not extending 5).",
        a,
        { 2: "lo", 4: "window" },
        {
          pointers: [{ name: "i", index: 4, color: PTR.M }],
          note: "2,3",
        },
      ),
      arrayFrame(
        "7 extends to 3",
        "7 > 5 and 7 > 3 → dp[5] = 3. Best LIS length is 3.",
        a,
        { 2: "done", 3: "done", 5: "match" },
        {
          pointers: [{ name: "i", index: 5, color: PTR.M }],
          note: "2,5,7",
        },
      ),
      arrayFrame(
        "Answer",
        "max(dp) = 3.",
        a,
        { 2: "match", 3: "match", 5: "match" },
        { note: "return 3" },
      ),
    ];
  })(),
};

export const russianDollEnvelopesSolution: ProblemSolution = {
  approach:
    "Sort by width asc, height desc on ties (blocks same-width nest). Then LIS on heights — O(n log n) with patience tails. Nesting = strict increase in both dims.",
  templates: langs(
    `from bisect import bisect_left

def maxEnvelopes(envelopes):
    envelopes.sort(key=lambda e: (e[0], -e[1]))
    tails = []
    for _, h in envelopes:
        i = bisect_left(tails, h)
        if i == len(tails):
            tails.append(h)
        else:
            tails[i] = h
    return len(tails)`,
    `int maxEnvelopes(vector<vector<int>>& envelopes) {
    sort(envelopes.begin(), envelopes.end(), [](auto& a, auto& b) {
        return a[0] == b[0] ? a[1] > b[1] : a[0] < b[0];
    });
    vector<int> tails;
    for (auto& e : envelopes) {
        int h = e[1];
        auto it = lower_bound(tails.begin(), tails.end(), h);
        if (it == tails.end()) tails.push_back(h);
        else *it = h;
    }
    return (int)tails.size();
}`,
    `int maxEnvelopes(int[][] envelopes) {
    Arrays.sort(envelopes, (a, b) -> a[0] == b[0] ? b[1] - a[1] : a[0] - b[0]);
    int[] tails = new int[envelopes.length];
    int len = 0;
    for (int[] e : envelopes) {
        int h = e[1], lo = 0, hi = len;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (tails[mid] < h) lo = mid + 1;
            else hi = mid;
        }
        tails[lo] = h;
        if (lo == len) len++;
    }
    return len;
}`,
    `function maxEnvelopes(envelopes) {
  envelopes.sort((a, b) => (a[0] === b[0] ? b[1] - a[1] : a[0] - b[0]));
  const tails = [];
  for (const [, h] of envelopes) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < h) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = h;
  }
  return tails.length;
}`,
  ),
  frames: (() => {
    const env = ["(5,4)", "(6,4)", "(6,7)", "(2,3)"];
    const sorted = ["(2,3)", "(5,4)", "(6,7)", "(6,4)"];
    return [
      arrayFrame(
        "Envelopes",
        "Can nest A in B only if both width and height are strictly smaller.",
        env,
        {},
        { note: "4 envelopes" },
      ),
      arrayFrame(
        "Sort w↑, h↓",
        "Same width: taller first so LIS on height cannot nest equal widths.",
        sorted,
        { 2: "window", 3: "window" },
        { note: "(6,7) before (6,4)" },
      ),
      arrayFrame(
        "Heights sequence",
        "Heights after sort: 3, 4, 7, 4. Run LIS on this 1D array.",
        [3, 4, 7, 4],
        {},
        { note: "LIS on h" },
      ),
      arrayFrame(
        "Tails: 3 → 4",
        "Patience: replace/extend smallest tail ≥ h. 3 then 4 → length 2.",
        [3, 4, 7, 4],
        { 0: "lo", 1: "match" },
        {
          pointers: [{ name: "i", index: 1, color: PTR.M }],
          note: "tails [3,4]",
        },
      ),
      arrayFrame(
        "7 extends",
        "7 > 4 → append. tails = [3,4,7], length 3.",
        [3, 4, 7, 4],
        { 0: "done", 1: "done", 2: "match" },
        {
          pointers: [{ name: "i", index: 2, color: PTR.M }],
          note: "tails [3,4,7]",
        },
      ),
      arrayFrame(
        "Second 4",
        "4 replaces the 7-tail slot (lower_bound). Length stays 3 — cannot nest with (6,7).",
        [3, 4, 7, 4],
        { 3: "active" },
        {
          pointers: [{ name: "i", index: 3, color: PTR.M }],
          note: "tails [3,4,4]",
        },
      ),
      arrayFrame(
        "Answer",
        "Max dolls = 3: (2,3) ⊂ (5,4) ⊂ (6,7).",
        sorted,
        { 0: "match", 1: "match", 2: "match" },
        { note: "return 3" },
      ),
    ];
  })(),
};

export const numberOfLISSolution: ProblemSolution = {
  approach:
    "Alongside len[i], keep cnt[i] = ways to form that LIS ending at i. When a[j] < a[i]: if len[j]+1 > len[i] reset count; if equal, add cnt[j]. Sum cnt where len is max. O(n²).",
  templates: langs(
    `def findNumberOfLIS(nums):
    n = len(nums)
    length = [1] * n
    cnt = [1] * n
    for i in range(n):
        for j in range(i):
            if nums[j] >= nums[i]:
                continue
            if length[j] + 1 > length[i]:
                length[i] = length[j] + 1
                cnt[i] = cnt[j]
            elif length[j] + 1 == length[i]:
                cnt[i] += cnt[j]
    best = max(length)
    return sum(c for L, c in zip(length, cnt) if L == best)`,
    `int findNumberOfLIS(vector<int>& nums) {
    int n = nums.size(), best = 0, ans = 0;
    vector<int> len(n, 1), cnt(n, 1);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] >= nums[i]) continue;
            if (len[j] + 1 > len[i]) { len[i] = len[j] + 1; cnt[i] = cnt[j]; }
            else if (len[j] + 1 == len[i]) cnt[i] += cnt[j];
        }
        best = max(best, len[i]);
    }
    for (int i = 0; i < n; i++) if (len[i] == best) ans += cnt[i];
    return ans;
}`,
    `int findNumberOfLIS(int[] nums) {
    int n = nums.length, best = 0, ans = 0;
    int[] len = new int[n], cnt = new int[n];
    Arrays.fill(len, 1);
    Arrays.fill(cnt, 1);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] >= nums[i]) continue;
            if (len[j] + 1 > len[i]) { len[i] = len[j] + 1; cnt[i] = cnt[j]; }
            else if (len[j] + 1 == len[i]) cnt[i] += cnt[j];
        }
        best = Math.max(best, len[i]);
    }
    for (int i = 0; i < n; i++) if (len[i] == best) ans += cnt[i];
    return ans;
}`,
    `function findNumberOfLIS(nums) {
  const n = nums.length;
  const len = Array(n).fill(1), cnt = Array(n).fill(1);
  let best = 0, ans = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] >= nums[i]) continue;
      if (len[j] + 1 > len[i]) { len[i] = len[j] + 1; cnt[i] = cnt[j]; }
      else if (len[j] + 1 === len[i]) cnt[i] += cnt[j];
    }
    best = Math.max(best, len[i]);
  }
  for (let i = 0; i < n; i++) if (len[i] === best) ans += cnt[i];
  return ans;
}`,
  ),
  frames: (() => {
    const a = [1, 3, 5, 4, 7];
    return [
      arrayFrame(
        "nums",
        "Track length and count of LIS ending at each index.",
        a,
        {},
        { note: "len=1, cnt=1 each" },
      ),
      arrayFrame(
        "Build to 5",
        "1→3→5: one LIS of length 3 ending at index 2.",
        a,
        { 0: "done", 1: "done", 2: "match" },
        {
          pointers: [{ name: "i", index: 2, color: PTR.M }],
          note: "len[2]=3 cnt=1",
        },
      ),
      arrayFrame(
        "4 via 3",
        "1→3→4 also length 3. Parallel LIS ending at 4.",
        a,
        { 0: "done", 1: "done", 3: "window" },
        {
          pointers: [{ name: "i", index: 3, color: PTR.M }],
          note: "len[3]=3 cnt=1",
        },
      ),
      arrayFrame(
        "7 from both",
        "7 extends both length-3 endings → len=4, cnt = 1+1 = 2.",
        a,
        { 2: "lo", 3: "lo", 4: "match" },
        {
          pointers: [{ name: "i", index: 4, color: PTR.M }],
          note: "len[4]=4 cnt=2",
        },
      ),
      arrayFrame(
        "Max length 4",
        "Only index 4 has the global max length.",
        a,
        { 4: "active" },
        { note: "best = 4" },
      ),
      arrayFrame(
        "Answer",
        "Two longest increasing subsequences: 1,3,5,7 and 1,3,4,7.",
        a,
        { 0: "match", 1: "match", 2: "match", 3: "match", 4: "match" },
        { note: "return 2" },
      ),
    ];
  })(),
};

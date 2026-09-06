import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function closestSubsequenceSumFrames() {
  const a = [5, -7, 3, 5];
  return [
    arrayFrame("goal = 6", "n too big for 2ⁿ. Split in half; enumerate all subset sums of each half.", a, {}, {
      note: "meet in middle",
    }),
    arrayFrame("Left [5,-7]", "Subset sums L = {0, 5, -7, -2}.", a, { 0: "lo", 1: "lo" }, {
      pointers: [{ name: "L", index: 0, color: PTR.L }],
      note: "L = {0,5,-7,-2}",
    }),
    arrayFrame("Right [3,5]", "Subset sums R = {0, 3, 5, 8}.", a, { 2: "hi", 3: "hi" }, {
      pointers: [{ name: "R", index: 2, color: PTR.R }],
      note: "R = {0,3,5,8}",
    }),
    arrayFrame("Pair for goal", "For each s in L, binary-search goal−s in sorted R. Best |s+t−goal|.", a, { 0: "match", 3: "match" }, {
      note: "5+5=10 · |10-6|=4",
    }),
    arrayFrame("Closer: -7+8? wait 3+5", "0+5=5 → |5-6|=1. Best so far.", a, { 2: "window", 3: "match" }, {
      note: "diff 1",
    }),
    arrayFrame("Answer", "Minimum absolute difference to goal over all subset sums.", a, { 0: "done", 1: "done", 2: "done", 3: "done" }, {
      note: "min |sum-goal|",
    }),
  ];
}

function minSumDifferenceFrames() {
  const a = [3, 9, 7, 3];
  return [
    arrayFrame(
      "Split into two arrays of n/2",
      "Minimize |sum(A)−sum(B)| = |2·sum(A)−total|. Enumerate half-sizes via meet-in-middle.",
      a,
      {},
      { note: "n=4 even" },
    ),
    arrayFrame("Left half", "All subset sums of left, keyed by subset size.", a, { 0: "lo", 1: "lo" }, {
      note: "size → sums",
    }),
    arrayFrame("Right half", "Same for right. For size k on left, pair with n/2−k on right.", a, { 2: "hi", 3: "hi" }, {
      note: "match sizes",
    }),
    arrayFrame("Pick sums", "For each left sum s of size k, find right t of size n/2−k closest to total/2−s.", a, {
      0: "match",
      3: "match",
    }, { note: "balance" }),
    arrayFrame("Best partition", "Example: {3,7} vs {9,3} → |10−12|=2.", a, { 0: "match", 2: "match", 1: "window", 3: "window" }, {
      note: "diff 2",
    }),
    arrayFrame("Answer", "O(2^{n/2}·n) meet-in-middle over subset sizes.", a, {}, { note: "return 2" }),
  ];
}

function onesAndZeroesFrames() {
  const strs = ["10", "0001", "111001", "1", "0"];
  return [
    arrayFrame(
      "m zeros, n ones",
      "Max subset of strs using at most m 0s and n 1s. Classic 0/1 knapsack on (zeros,ones).",
      strs,
      {},
      { note: "m=5 · n=3" },
    ),
    arrayFrame("Count each string", "\"10\" → (1 zero, 1 one). Treat as an item with 2D cost.", strs, { 0: "active" }, {
      pointers: [{ name: "i", index: 0, color: PTR.M }],
      note: "(z,o)=(1,1)",
    }),
    arrayFrame("DP update", "dp[z][o] = max(dp[z][o], 1+dp[z−zeros][o−ones]) iterating z,o descending.", ["dp", "5×3"], {
      0: "window",
      1: "window",
    }, { note: "0/1 knapsack" }),
    arrayFrame("Add \"0001\"", "Costs (3,1). Fits in remaining budget after prior picks.", strs, { 1: "match" }, {
      note: "(3,1)",
    }),
    arrayFrame("Meet-in-middle variant", "Split strs in half; enumerate (z,o,count) pairs; match complementary budgets.", strs, {
      0: "lo",
      1: "lo",
      2: "hi",
      3: "hi",
      4: "hi",
    }, { note: "optional MITM" }),
    arrayFrame("Answer", "Best count under (m,n). DP O(len·m·n) is the usual approach.", strs, {
      0: "done",
      3: "done",
      4: "done",
    }, { note: "max strings" }),
  ];
}

export const closestSubsequenceSumSolution: ProblemSolution = {
  approach:
    "Split array in half; enumerate all subset sums of each half (2^{n/2}). For each left sum, binary-search the right sum closest to goal−s. O(2^{n/2}·n) time.",
  templates: langs(
    `def subset_sums(a):
    out = [0]
    for x in a:
        out += [s + x for s in out]
    return out

def closestSum(nums, goal):
    mid = len(nums) // 2
    L = sorted(subset_sums(nums[:mid]))
    R = sorted(subset_sums(nums[mid:]))
    best = abs(goal)
    import bisect
    for s in L:
        t = goal - s
        i = bisect.bisect_left(R, t)
        for j in (i - 1, i):
            if 0 <= j < len(R):
                best = min(best, abs(s + R[j] - goal))
    return best`,
    `vector<int> subsetSums(vector<int>& a) {
    vector<int> out{0};
    for (int x : a) {
        int sz = out.size();
        for (int i = 0; i < sz; i++) out.push_back(out[i] + x);
    }
    return out;
}
int closestSum(vector<int>& nums, int goal) {
    int mid = nums.size() / 2;
    vector<int> left(nums.begin(), nums.begin() + mid), right(nums.begin() + mid, nums.end());
    auto L = subsetSums(left), R = subsetSums(right);
    sort(R.begin(), R.end());
    int best = abs(goal);
    for (int s : L) {
        int t = goal - s;
        auto it = lower_bound(R.begin(), R.end(), t);
        if (it != R.end()) best = min(best, abs(s + *it - goal));
        if (it != R.begin()) best = min(best, abs(s + *prev(it) - goal));
    }
    return best;
}`,
    `List<Integer> subsetSums(int[] a, int lo, int hi) {
    List<Integer> out = new ArrayList<>(); out.add(0);
    for (int i = lo; i < hi; i++) {
        int sz = out.size();
        for (int j = 0; j < sz; j++) out.add(out.get(j) + a[i]);
    }
    return out;
}
int closestSum(int[] nums, int goal) {
    int mid = nums.length / 2;
    List<Integer> L = subsetSums(nums, 0, mid), R = subsetSums(nums, mid, nums.length);
    Collections.sort(R);
    int best = Math.abs(goal);
    for (int s : L) {
        int t = goal - s, i = Collections.binarySearch(R, t);
        if (i < 0) i = -i - 1;
        for (int j : new int[]{i - 1, i})
            if (j >= 0 && j < R.size()) best = Math.min(best, Math.abs(s + R.get(j) - goal));
    }
    return best;
}`,
    `function subsetSums(a) {
  let out = [0];
  for (const x of a) out = out.concat(out.map((s) => s + x));
  return out;
}
function closestSum(nums, goal) {
  const mid = nums.length >> 1;
  const L = subsetSums(nums.slice(0, mid));
  const R = subsetSums(nums.slice(mid)).sort((a, b) => a - b);
  let best = Math.abs(goal);
  for (const s of L) {
    const t = goal - s;
    let lo = 0, hi = R.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (R[m] < t) lo = m + 1; else hi = m; }
    for (const j of [lo - 1, lo]) if (j >= 0 && j < R.length) best = Math.min(best, Math.abs(s + R[j] - goal));
  }
  return best;
}`,
  ),
  frames: closestSubsequenceSumFrames(),
};

export const minSumDifferenceSolution: ProblemSolution = {
  approach:
    "Meet-in-middle: enumerate subset sums by size on each half; pair sizes that sum to n/2; minimize |2·(s+t)−total|. O(2^{n/2}·n) time.",
  templates: langs(
    `def minimumDifference(nums):
    n = len(nums) // 2
    total = sum(nums)
    def sums_by_size(a):
        dp = {0: {0}}
        for x in a:
            nxt = {k: set(v) for k, v in dp.items()}
            for k, S in dp.items():
                nxt.setdefault(k + 1, set()).update(s + x for s in S)
            dp = nxt
        return dp
    L, R = sums_by_size(nums[:n]), sums_by_size(nums[n:])
    best = abs(total)
    for k, S in L.items():
        need = n - k
        if need not in R: continue
        T = sorted(R[need])
        import bisect
        for s in S:
            target = total // 2 - s
            i = bisect.bisect_left(T, target)
            for j in (i - 1, i):
                if 0 <= j < len(T):
                    best = min(best, abs(total - 2 * (s + T[j])))
    return best`,
    `unordered_map<int, vector<int>> sumsBySize(vector<int>& a) {
    unordered_map<int, unordered_set<int>> dp{{0, {0}}};
    for (int x : a) {
        unordered_map<int, unordered_set<int>> nxt = dp;
        for (auto& [k, S] : dp)
            for (int s : S) nxt[k + 1].insert(s + x);
        dp.swap(nxt);
    }
    unordered_map<int, vector<int>> out;
    for (auto& [k, S] : dp) out[k] = vector<int>(S.begin(), S.end());
    for (auto& [k, v] : out) sort(v.begin(), v.end());
    return out;
}
int minimumDifference(vector<int>& nums) {
    int n = nums.size() / 2, total = accumulate(nums.begin(), nums.end(), 0);
    vector<int> left(nums.begin(), nums.begin() + n), right(nums.begin() + n, nums.end());
    auto L = sumsBySize(left), R = sumsBySize(right);
    int best = abs(total);
    for (auto& [k, S] : L) {
        int need = n - k;
        if (!R.count(need)) continue;
        auto& T = R[need];
        for (int s : S) {
            int target = total / 2 - s;
            auto it = lower_bound(T.begin(), T.end(), target);
            if (it != T.end()) best = min(best, abs(total - 2 * (s + *it)));
            if (it != T.begin()) best = min(best, abs(total - 2 * (s + *prev(it))));
        }
    }
    return best;
}`,
    `Map<Integer, List<Integer>> sumsBySize(int[] a, int lo, int hi) {
    Map<Integer, Set<Integer>> dp = new HashMap<>();
    dp.put(0, new HashSet<>(List.of(0)));
    for (int i = lo; i < hi; i++) {
        Map<Integer, Set<Integer>> nxt = new HashMap<>();
        for (var e : dp.entrySet()) {
            nxt.computeIfAbsent(e.getKey(), k -> new HashSet<>()).addAll(e.getValue());
            Set<Integer> add = nxt.computeIfAbsent(e.getKey() + 1, k -> new HashSet<>());
            for (int s : e.getValue()) add.add(s + a[i]);
        }
        dp = nxt;
    }
    Map<Integer, List<Integer>> out = new HashMap<>();
    for (var e : dp.entrySet()) {
        List<Integer> v = new ArrayList<>(e.getValue());
        Collections.sort(v);
        out.put(e.getKey(), v);
    }
    return out;
}
int minimumDifference(int[] nums) {
    int n = nums.length / 2, total = 0;
    for (int x : nums) total += x;
    Map<Integer, List<Integer>> L = sumsBySize(nums, 0, n), R = sumsBySize(nums, n, nums.length);
    int best = Math.abs(total);
    for (var e : L.entrySet()) {
        int need = n - e.getKey();
        if (!R.containsKey(need)) continue;
        List<Integer> T = R.get(need);
        for (int s : e.getValue()) {
            int target = total / 2 - s, i = Collections.binarySearch(T, target);
            if (i < 0) i = -i - 1;
            for (int j : new int[]{i - 1, i})
                if (j >= 0 && j < T.size()) best = Math.min(best, Math.abs(total - 2 * (s + T.get(j))));
        }
    }
    return best;
}`,
    `function minimumDifference(nums) {
  const n = nums.length >> 1, total = nums.reduce((a, b) => a + b, 0);
  function sumsBySize(a) {
    let dp = new Map([[0, new Set([0])]]);
    for (const x of a) {
      const nxt = new Map();
      for (const [k, S] of dp) {
        if (!nxt.has(k)) nxt.set(k, new Set(S));
        else for (const s of S) nxt.get(k).add(s);
        if (!nxt.has(k + 1)) nxt.set(k + 1, new Set());
        for (const s of S) nxt.get(k + 1).add(s + x);
      }
      dp = nxt;
    }
    return dp;
  }
  const L = sumsBySize(nums.slice(0, n)), R = sumsBySize(nums.slice(n));
  let best = Math.abs(total);
  for (const [k, S] of L) {
    const need = n - k;
    if (!R.has(need)) continue;
    const T = [...R.get(need)].sort((a, b) => a - b);
    for (const s of S) {
      const target = Math.floor(total / 2) - s;
      let lo = 0, hi = T.length;
      while (lo < hi) { const m = (lo + hi) >> 1; if (T[m] < target) lo = m + 1; else hi = m; }
      for (const j of [lo - 1, lo])
        if (j >= 0 && j < T.length) best = Math.min(best, Math.abs(total - 2 * (s + T[j])));
    }
  }
  return best;
}`,
  ),
  frames: minSumDifferenceFrames(),
};

export const onesAndZeroesMitmSolution: ProblemSolution = {
  approach:
    "0/1 knapsack: dp[z][o] = max strings using ≤z zeros and ≤o ones. Process each string's (zeros,ones) cost descending. O(len·m·n) time.",
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
        int z = count(s.begin(), s.end(), '0'), o = (int)s.size() - z;
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
  frames: onesAndZeroesFrames(),
};

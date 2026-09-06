import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function permutationsFrames(): Frame[] {
  const nums = [1, 2, 3];
  return [
    arrayFrame(
      "Permute [1,2,3]",
      "Backtracking: choose an unused number, push to path, recurse, pop (undo). 3! = 6 results.",
      nums,
      {},
      { note: "path = [] · used = {}" },
    ),
    arrayFrame(
      "Choose 1",
      "Mark 1 used. Path is [1]. Try every unused digit next.",
      nums,
      { 0: "match" },
      {
        pointers: [{ name: "pick", index: 0, color: PTR.L }],
        note: "path = [1]",
      },
    ),
    arrayFrame(
      "Then 2 → [1,2]",
      "Push 2. One slot left.",
      nums,
      { 0: "match", 1: "window" },
      {
        pointers: [{ name: "pick", index: 1, color: PTR.L }],
        note: "path = [1,2]",
      },
    ),
    arrayFrame(
      "Complete [1,2,3]",
      "Path length == n. Record a permutation, then undo 3.",
      nums,
      { 0: "match", 1: "match", 2: "match" },
      { note: "path = [1,2,3] · record" },
    ),
    arrayFrame(
      "Undo 3, try 3 earlier",
      "Pop back to [1]. Next unused after 2 was already tried — now place 3 in the second slot.",
      nums,
      { 0: "match", 2: "active" },
      {
        pointers: [{ name: "pick", index: 2, color: PTR.L }],
        note: "path = [1,3]",
      },
    ),
    arrayFrame(
      "[1,3,2]",
      "Second permutation under prefix 1. Undo back to empty and start with 2…",
      nums,
      { 0: "match", 2: "match", 1: "match" },
      { note: "path = [1,3,2] · record" },
    ),
    arrayFrame(
      "Prefix 2…",
      "After undoing 1, choose 2 first. Same process yields [2,1,3], [2,3,1], then prefix 3.",
      nums,
      { 1: "match" },
      {
        pointers: [{ name: "pick", index: 1, color: PTR.L }],
        note: "path = [2]",
      },
    ),
    arrayFrame(
      "All 6 done",
      "Every ordering visited exactly once because used[] blocks repeats.",
      nums,
      { 0: "done", 1: "done", 2: "done" },
      { note: "6 permutations" },
    ),
  ];
}

function permutationsIIFrames(): Frame[] {
  const nums = [1, 1, 2];
  return [
    arrayFrame(
      "Sort · [1,1,2]",
      "Duplicates make identical permutations. Sort + skip rule: don't start a twin if the previous equal index is unused.",
      nums,
      { 0: "active" },
      { note: "used = [F,F,F]" },
    ),
    arrayFrame(
      "Pick first 1",
      "Use index 0. Path [1]. Both remaining slots still open.",
      nums,
      { 0: "match", 1: "idle", 2: "idle" },
      {
        pointers: [{ name: "pick", index: 0, color: PTR.L }],
        note: "path = [1] · used[0]=T",
      },
    ),
    arrayFrame(
      "Then second 1 → [1,1]",
      "Index 1 is free. Path [1,1]. Last slot must be 2.",
      nums,
      { 0: "match", 1: "match", 2: "active" },
      { note: "path = [1,1]" },
    ),
    arrayFrame(
      "Complete [1,1,2]",
      "Record. Without dedup, swapping the two 1s would invent a fake second copy.",
      nums,
      { 0: "match", 1: "match", 2: "match" },
      { note: "record [1,1,2]" },
    ),
    arrayFrame(
      "Skip twin at depth 0",
      "Back at empty path: i=1 equals nums[0] and used[0] is false → continue. Only the first 1 may lead.",
      nums,
      { 0: "done", 1: "skip", 2: "active" },
      {
        pointers: [{ name: "i", index: 1, color: PTR.R }],
        note: "i>0 && nums[i]==nums[i-1] && !used[i-1]",
      },
    ),
    arrayFrame(
      "Prefix 2…",
      "Start with 2, then place the two 1s → only [2,1,1]. Three unique perms total.",
      nums,
      { 2: "match", 0: "window", 1: "window" },
      { note: "path = [2,1,1]" },
    ),
    arrayFrame(
      "Unique set",
      "Results: [1,1,2], [1,2,1], [2,1,1]. Same n! skeleton, pruned duplicate branches.",
      nums,
      { 0: "done", 1: "done", 2: "done" },
      { note: "3 unique" },
    ),
  ];
}

function nextPermutationFrames(): Frame[] {
  const a = [1, 2, 3];
  const b = [1, 3, 2];
  const c = [2, 1, 3];
  const d = [3, 2, 1];
  return [
    arrayFrame(
      "nums = [1,2,3]",
      "Next permutation in lex order — not DFS. Find the longest non-increasing suffix, then pivot.",
      a,
      {},
      { note: "in-place rearrange" },
    ),
    arrayFrame(
      "Find pivot",
      "Scan right→left for first a[i] < a[i+1]. Here i=1 (2 < 3). Suffix [3] is non-increasing.",
      a,
      { 1: "active", 2: "window" },
      {
        pointers: [
          { name: "i", index: 1, color: PTR.M },
          { name: "j", index: 2, color: PTR.R },
        ],
        note: "pivot i = 1 · val 2",
      },
    ),
    arrayFrame(
      "Swap with successor",
      "In the suffix, find rightmost a[j] > pivot. Swap a[i] and a[j] → [1,3,2].",
      b,
      { 1: "match", 2: "match" },
      { note: "swap 2 ↔ 3" },
    ),
    arrayFrame(
      "Reverse suffix",
      "Reverse everything after i so the tail is ascending — smallest next arrangement.",
      b,
      { 0: "done", 1: "done", 2: "done" },
      { note: "next = [1,3,2]" },
    ),
    arrayFrame(
      "Another step → [2,1,3]",
      "From [1,3,2]: pivot at 1 (1 < 3). Successor in suffix is 2. Swap → [2,3,1], reverse → [2,1,3].",
      c,
      { 0: "match", 1: "window", 2: "window" },
      { note: "next after [1,3,2]" },
    ),
    arrayFrame(
      "Last perm → wrap",
      "Fully descending [3,2,1]: no pivot. Reverse whole array → first perm [1,2,3].",
      d,
      { 0: "skip", 1: "skip", 2: "skip" },
      { note: "no i → reverse all" },
    ),
    arrayFrame(
      "O(n) one pass",
      "Find pivot + successor + reverse suffix. Same idea teaches the order backtracking would visit.",
      a,
      { 0: "done", 1: "done", 2: "done" },
      { note: "lex next done" },
    ),
  ];
}

export const permutationsL2Solution: ProblemSolution = {
  approach:
    "Backtracking over unused indices: push, recurse, pop. used[] (or swap-in-place) prevents repeats. O(n·n!) time, O(n) depth.",
  templates: langs(
    `def permute(nums):
    out, used = [], [False] * len(nums)
    def dfs(path):
        if len(path) == len(nums):
            out.append(path[:]); return
        for i, x in enumerate(nums):
            if used[i]: continue
            used[i] = True; path.append(x)
            dfs(path)
            path.pop(); used[i] = False
    dfs([])
    return out`,
    `vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> out; vector<int> path, used(nums.size());
    function<void()> dfs = [&]() {
        if (path.size() == nums.size()) { out.push_back(path); return; }
        for (int i = 0; i < (int)nums.size(); i++) {
            if (used[i]) continue;
            used[i] = 1; path.push_back(nums[i]);
            dfs();
            path.pop_back(); used[i] = 0;
        }
    };
    dfs(); return out;
}`,
    `List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> out = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    class D { void dfs() {
        if (path.size() == nums.length) { out.add(new ArrayList<>(path)); return; }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true; path.add(nums[i]);
            dfs();
            path.remove(path.size() - 1); used[i] = false;
        }
    }}
    new D().dfs(); return out;
}`,
    `function permute(nums) {
  const out = [], used = Array(nums.length).fill(false);
  function dfs(path) {
    if (path.length === nums.length) { out.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      dfs(path);
      path.pop(); used[i] = false;
    }
  }
  dfs([]);
  return out;
}`,
  ),
  frames: permutationsFrames(),
};

export const permutationsIISolution: ProblemSolution = {
  approach:
    "Sort, then permute with used[]. Skip nums[i] when equal to nums[i-1] and !used[i-1] (duplicate branch). O(n·n!) worst, fewer unique leaves.",
  templates: langs(
    `def permuteUnique(nums):
    nums.sort(); out, used = [], [False] * len(nums)
    def dfs(path):
        if len(path) == len(nums):
            out.append(path[:]); return
        for i, x in enumerate(nums):
            if used[i] or (i and x == nums[i - 1] and not used[i - 1]):
                continue
            used[i] = True; path.append(x)
            dfs(path)
            path.pop(); used[i] = False
    dfs([])
    return out`,
    `vector<vector<int>> permuteUnique(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> out; vector<int> path, used(nums.size());
    function<void()> dfs = [&]() {
        if (path.size() == nums.size()) { out.push_back(path); return; }
        for (int i = 0; i < (int)nums.size(); i++) {
            if (used[i] || (i && nums[i] == nums[i - 1] && !used[i - 1])) continue;
            used[i] = 1; path.push_back(nums[i]);
            dfs();
            path.pop_back(); used[i] = 0;
        }
    };
    dfs(); return out;
}`,
    `List<List<Integer>> permuteUnique(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> out = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    class D { void dfs() {
        if (path.size() == nums.length) { out.add(new ArrayList<>(path)); return; }
        for (int i = 0; i < nums.length; i++) {
            if (used[i] || (i > 0 && nums[i] == nums[i - 1] && !used[i - 1])) continue;
            used[i] = true; path.add(nums[i]);
            dfs();
            path.remove(path.size() - 1); used[i] = false;
        }
    }}
    new D().dfs(); return out;
}`,
    `function permuteUnique(nums) {
  nums.sort((a, b) => a - b);
  const out = [], used = Array(nums.length).fill(false);
  function dfs(path) {
    if (path.length === nums.length) { out.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i] || (i && nums[i] === nums[i - 1] && !used[i - 1])) continue;
      used[i] = true; path.push(nums[i]);
      dfs(path);
      path.pop(); used[i] = false;
    }
  }
  dfs([]);
  return out;
}`,
  ),
  frames: permutationsIIFrames(),
};

export const nextPermutationSolution: ProblemSolution = {
  approach:
    "In-place: find rightmost ascent pivot i; swap with rightmost successor in the suffix; reverse the suffix. If no pivot, reverse whole array. O(n) time, O(1) extra.",
  templates: langs(
    `def nextPermutation(nums):
    n = len(nums)
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    nums[i + 1 :] = reversed(nums[i + 1 :])`,
    `void nextPermutation(vector<int>& nums) {
    int n = nums.size(), i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
        int j = n - 1;
        while (nums[j] <= nums[i]) j--;
        swap(nums[i], nums[j]);
    }
    reverse(nums.begin() + i + 1, nums.end());
}`,
    `void nextPermutation(int[] nums) {
    int n = nums.length, i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
        int j = n - 1;
        while (nums[j] <= nums[i]) j--;
        int t = nums[i]; nums[i] = nums[j]; nums[j] = t;
    }
    for (int l = i + 1, r = n - 1; l < r; l++, r--) {
        int t = nums[l]; nums[l] = nums[r]; nums[r] = t;
    }
}`,
    `function nextPermutation(nums) {
  let i = nums.length - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = nums.length - 1;
    while (nums[j] <= nums[i]) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  let l = i + 1, r = nums.length - 1;
  while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; }
}`,
  ),
  frames: nextPermutationFrames(),
};

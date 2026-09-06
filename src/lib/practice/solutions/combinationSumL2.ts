import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function combinationSumFrames(): Frame[] {
  const cand = [2, 3, 6, 7];
  return [
    arrayFrame(
      "candidates · target 7",
      "Reuse allowed: after picking cand[i], recurse from the same i. Prune when remain < 0.",
      cand,
      { 0: "active" },
      {
        pointers: [{ name: "i", index: 0, color: PTR.M }],
        note: "remain = 7 · path = []",
      },
    ),
    arrayFrame(
      "Pick 2",
      "Push 2, stay at index 0. Remain becomes 5.",
      cand,
      { 0: "match" },
      {
        pointers: [{ name: "i", index: 0, color: PTR.M }],
        note: "remain = 5 · path = [2]",
      },
    ),
    arrayFrame(
      "Pick 2 again",
      "Reuse 2. Remain 3. Still starting from index 0.",
      cand,
      { 0: "match" },
      {
        pointers: [{ name: "i", index: 0, color: PTR.M }],
        note: "remain = 3 · path = [2,2]",
      },
    ),
    arrayFrame(
      "2 too big now",
      "Another 2 would leave remain 1 — still ok to try, but next 2 leaves −1 and prunes. Advance i.",
      cand,
      { 0: "skip", 1: "active" },
      {
        pointers: [{ name: "i", index: 1, color: PTR.M }],
        note: "remain = 3 · path = [2,2]",
      },
    ),
    arrayFrame(
      "Pick 3 → remain 0",
      "2+2+3 = 7. Record combination, then pop 3 (backtrack).",
      cand,
      { 0: "done", 1: "match" },
      { note: "path = [2,2,3] · found" },
    ),
    arrayFrame(
      "Try starting with 3",
      "After exploring all 2-branches, start from index 1 with empty path.",
      cand,
      { 1: "active" },
      {
        pointers: [{ name: "i", index: 1, color: PTR.M }],
        note: "remain = 7 · path = []",
      },
    ),
    arrayFrame(
      "Single 7",
      "Jump to cand 7: one pick hits the target. Two combinations total.",
      cand,
      { 3: "match" },
      {
        pointers: [{ name: "i", index: 3, color: PTR.M }],
        note: "path = [7] · found",
      },
    ),
  ];
}

function combinationSumIIFrames(): Frame[] {
  const cand = [1, 1, 2, 5, 6];
  return [
    arrayFrame(
      "Sort · target 8",
      "Each number once. Sort so duplicate values are adjacent; skip twins at the same depth.",
      cand,
      { 0: "active" },
      {
        pointers: [{ name: "start", index: 0, color: PTR.M }],
        note: "remain = 8 · path = []",
      },
    ),
    arrayFrame(
      "Take first 1",
      "Pick cand[0]=1, recurse from index 1. Remain 7.",
      cand,
      { 0: "match", 1: "active" },
      { note: "path = [1] · remain 7" },
    ),
    arrayFrame(
      "Take second 1",
      "Different index — allowed. Path [1,1]. Remain 6.",
      cand,
      { 0: "match", 1: "match", 2: "active" },
      { note: "path = [1,1] · remain 6" },
    ),
    arrayFrame(
      "Then 6 → hit",
      "1+1+6 = 8. Record. Backtrack pops 6, then tries other tails.",
      cand,
      { 0: "match", 1: "match", 4: "match" },
      { note: "path = [1,1,6] · found" },
    ),
    arrayFrame(
      "Skip duplicate 1",
      "Back at depth 0: i=1 equals cand[0] and i>start → skip. Avoids a second [1,…]-tree.",
      cand,
      { 0: "done", 1: "skip", 2: "active" },
      {
        pointers: [{ name: "i", index: 1, color: PTR.R }],
        note: "i>start && cand[i]==cand[i-1]",
      },
    ),
    arrayFrame(
      "Path [2,6]",
      "Start with 2, then 6. Another valid combo. 5+… also explored.",
      cand,
      { 2: "match", 4: "match" },
      { note: "path = [2,6] · found" },
    ),
    arrayFrame(
      "Unique combos",
      "Reuse forbidden (always i+1). Dedup skip keeps each multiset once.",
      cand,
      { 0: "done", 1: "done", 2: "done", 3: "done", 4: "done" },
      { note: "e.g. [1,1,6], [1,2,5], [2,6], …" },
    ),
  ];
}

function combinationSumIIIFrames(): Frame[] {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return [
    arrayFrame(
      "k = 3 · n = 9",
      "Choose k distinct digits from 1–9 that sum to n. Start from 1; always advance.",
      digits,
      { 0: "active" },
      {
        pointers: [{ name: "start", index: 0, color: PTR.M }],
        note: "need 3 · remain 9",
      },
    ),
    arrayFrame(
      "Pick 1",
      "Path [1]. Need 2 more numbers summing to 8. Next start = 2.",
      digits,
      { 0: "match", 1: "active" },
      { note: "path = [1] · remain 8" },
    ),
    arrayFrame(
      "Pick 2",
      "Path [1,2]. Need one more = 6.",
      digits,
      { 0: "match", 1: "match", 5: "active" },
      { note: "path = [1,2] · remain 6" },
    ),
    arrayFrame(
      "Pick 6 → done",
      "Length hits k and remain 0. Record [1,2,6].",
      digits,
      { 0: "match", 1: "match", 5: "match" },
      { note: "path = [1,2,6] · found" },
    ),
    arrayFrame(
      "Prune early",
      "If remain < next digit, or slots left can't reach remain, stop. No reuse, no duplicates.",
      digits,
      { 0: "match", 2: "skip", 3: "skip" },
      { note: "backtrack from [1,2]" },
    ),
    arrayFrame(
      "Also [1,3,5], [2,3,4]",
      "Other leaves under the same constraints. Exactly the k-combinations of 1..9 with sum n.",
      digits,
      { 1: "match", 2: "match", 3: "match" },
      { note: "path = [2,3,4]" },
    ),
    arrayFrame(
      "All solutions",
      "DFS from start..9; push, recurse start+1, pop. Stop when path length == k.",
      digits,
      { 0: "done", 1: "done", 2: "done", 3: "done", 4: "done", 5: "done" },
      { note: "[1,2,6] [1,3,5] [2,3,4]" },
    ),
  ];
}

export const combinationSumL2Solution: ProblemSolution = {
  approach:
    "Sorted candidates; DFS from i: pick cand[j], recurse with j (reuse), pop. Break when cand[j] > remain. O(n^{T/min}) branching, O(T/min) depth.",
  templates: langs(
    `def combinationSum(candidates, target):
    candidates.sort(); out, path = [], []
    def dfs(i, remain):
        if remain == 0:
            out.append(path[:]); return
        for j in range(i, len(candidates)):
            if candidates[j] > remain: break
            path.append(candidates[j])
            dfs(j, remain - candidates[j])  # reuse j
            path.pop()
    dfs(0, target)
    return out`,
    `vector<vector<int>> combinationSum(vector<int>& cand, int target) {
    sort(cand.begin(), cand.end());
    vector<vector<int>> out; vector<int> path;
    function<void(int,int)> dfs = [&](int i, int remain) {
        if (remain == 0) { out.push_back(path); return; }
        for (int j = i; j < (int)cand.size(); j++) {
            if (cand[j] > remain) break;
            path.push_back(cand[j]); dfs(j, remain - cand[j]); path.pop_back();
        }
    };
    dfs(0, target); return out;
}`,
    `List<List<Integer>> combinationSum(int[] cand, int target) {
    Arrays.sort(cand);
    List<List<Integer>> out = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    class D { void dfs(int i, int remain) {
        if (remain == 0) { out.add(new ArrayList<>(path)); return; }
        for (int j = i; j < cand.length; j++) {
            if (cand[j] > remain) break;
            path.add(cand[j]); dfs(j, remain - cand[j]); path.remove(path.size() - 1);
        }
    }}
    new D().dfs(0, target); return out;
}`,
    `function combinationSum(candidates, target) {
  candidates.sort((a, b) => a - b);
  const out = [], path = [];
  function dfs(i, remain) {
    if (remain === 0) { out.push([...path]); return; }
    for (let j = i; j < candidates.length; j++) {
      if (candidates[j] > remain) break;
      path.push(candidates[j]);
      dfs(j, remain - candidates[j]);
      path.pop();
    }
  }
  dfs(0, target);
  return out;
}`,
  ),
  frames: combinationSumFrames(),
};

export const combinationSumIISolution: ProblemSolution = {
  approach:
    "Sort; each index used at most once (recurse i+1). Skip cand[i]==cand[i-1] when i>start to drop duplicate combos. O(2ⁿ) subsets pruned by remain.",
  templates: langs(
    `def combinationSum2(candidates, target):
    candidates.sort(); out, path = [], []
    def dfs(start, remain):
        if remain == 0:
            out.append(path[:]); return
        for i in range(start, len(candidates)):
            if i > start and candidates[i] == candidates[i - 1]:
                continue
            if candidates[i] > remain: break
            path.append(candidates[i])
            dfs(i + 1, remain - candidates[i])
            path.pop()
    dfs(0, target)
    return out`,
    `vector<vector<int>> combinationSum2(vector<int>& cand, int target) {
    sort(cand.begin(), cand.end());
    vector<vector<int>> out; vector<int> path;
    function<void(int,int)> dfs = [&](int start, int remain) {
        if (remain == 0) { out.push_back(path); return; }
        for (int i = start; i < (int)cand.size(); i++) {
            if (i > start && cand[i] == cand[i - 1]) continue;
            if (cand[i] > remain) break;
            path.push_back(cand[i]); dfs(i + 1, remain - cand[i]); path.pop_back();
        }
    };
    dfs(0, target); return out;
}`,
    `List<List<Integer>> combinationSum2(int[] cand, int target) {
    Arrays.sort(cand);
    List<List<Integer>> out = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    class D { void dfs(int start, int remain) {
        if (remain == 0) { out.add(new ArrayList<>(path)); return; }
        for (int i = start; i < cand.length; i++) {
            if (i > start && cand[i] == cand[i - 1]) continue;
            if (cand[i] > remain) break;
            path.add(cand[i]); dfs(i + 1, remain - cand[i]); path.remove(path.size() - 1);
        }
    }}
    new D().dfs(0, target); return out;
}`,
    `function combinationSum2(candidates, target) {
  candidates.sort((a, b) => a - b);
  const out = [], path = [];
  function dfs(start, remain) {
    if (remain === 0) { out.push([...path]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (i > start && candidates[i] === candidates[i - 1]) continue;
      if (candidates[i] > remain) break;
      path.push(candidates[i]);
      dfs(i + 1, remain - candidates[i]);
      path.pop();
    }
  }
  dfs(0, target);
  return out;
}`,
  ),
  frames: combinationSumIIFrames(),
};

export const combinationSumIIISolution: ProblemSolution = {
  approach:
    "DFS over digits 1–9 from start: pick d, recurse d+1 with k-1 and n-d. Record when k==0 and n==0. O(C(9,k)) leaves, O(k) depth.",
  templates: langs(
    `def combinationSum3(k, n):
    out, path = [], []
    def dfs(start, left, remain):
        if left == 0:
            if remain == 0: out.append(path[:])
            return
        for d in range(start, 10):
            if d > remain: break
            path.append(d)
            dfs(d + 1, left - 1, remain - d)
            path.pop()
    dfs(1, k, n)
    return out`,
    `vector<vector<int>> combinationSum3(int k, int n) {
    vector<vector<int>> out; vector<int> path;
    function<void(int,int,int)> dfs = [&](int start, int left, int remain) {
        if (left == 0) { if (remain == 0) out.push_back(path); return; }
        for (int d = start; d <= 9; d++) {
            if (d > remain) break;
            path.push_back(d); dfs(d + 1, left - 1, remain - d); path.pop_back();
        }
    };
    dfs(1, k, n); return out;
}`,
    `List<List<Integer>> combinationSum3(int k, int n) {
    List<List<Integer>> out = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    class D { void dfs(int start, int left, int remain) {
        if (left == 0) { if (remain == 0) out.add(new ArrayList<>(path)); return; }
        for (int d = start; d <= 9; d++) {
            if (d > remain) break;
            path.add(d); dfs(d + 1, left - 1, remain - d); path.remove(path.size() - 1);
        }
    }}
    new D().dfs(1, k, n); return out;
}`,
    `function combinationSum3(k, n) {
  const out = [], path = [];
  function dfs(start, left, remain) {
    if (left === 0) { if (remain === 0) out.push([...path]); return; }
    for (let d = start; d <= 9; d++) {
      if (d > remain) break;
      path.push(d);
      dfs(d + 1, left - 1, remain - d);
      path.pop();
    }
  }
  dfs(1, k, n);
  return out;
}`,
  ),
  frames: combinationSumIIIFrames(),
};

import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { CellTone, Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function subsetsFrames(): Frame[] {
  const nums = [1, 2, 3];
  return [
    arrayFrame(
      "nums = [1,2,3]",
      "At each index: skip or pick. Path starts empty. Explore the full pick/skip tree.",
      nums,
      { 0: "active" },
      {
        pointers: [{ name: "i", index: 0, color: PTR.M }],
        note: "path = []",
      },
    ),
    arrayFrame(
      "Skip 1",
      "First branch: do not take 1. Move to index 1 with path still empty.",
      nums,
      { 0: "skip", 1: "active" },
      {
        pointers: [{ name: "i", index: 1, color: PTR.M }],
        note: "path = []",
      },
    ),
    arrayFrame(
      "Skip 2, pick 3",
      "Continue skipping until we pick 3 at the end. Leaf records subset [3].",
      nums,
      { 0: "skip", 1: "skip", 2: "match" },
      {
        pointers: [{ name: "i", index: 2, color: PTR.M }],
        note: "path = [3] · record",
      },
    ),
    arrayFrame(
      "Backtrack → pick 1",
      "Undo and take the other choice at index 0: push 1 onto the path.",
      nums,
      { 0: "match", 1: "active" },
      {
        pointers: [{ name: "i", index: 1, color: PTR.M }],
        note: "path = [1]",
      },
    ),
    arrayFrame(
      "Pick 2 as well",
      "Push 2. Path is [1,2]. Still one index left.",
      nums,
      { 0: "match", 1: "match", 2: "active" },
      {
        pointers: [{ name: "i", index: 2, color: PTR.M }],
        note: "path = [1,2]",
      },
    ),
    arrayFrame(
      "Pick 3 → [1,2,3]",
      "Leaf: record the full subset, then pop 3 (undo).",
      nums,
      { 0: "match", 1: "match", 2: "match" },
      { note: "path = [1,2,3] · record" },
    ),
    arrayFrame(
      "Skip 3 → [1,2]",
      "Sibling leaf without 3. Every index has two children → 2ⁿ subsets.",
      nums,
      { 0: "match", 1: "match", 2: "skip" },
      { note: "path = [1,2] · record" },
    ),
    arrayFrame(
      "Power set done",
      "All leaves emitted: [], [3], [2], [2,3], [1], [1,3], [1,2], [1,2,3].",
      nums,
      { 0: "done", 1: "done", 2: "done" },
      { note: "8 subsets" },
    ),
  ];
}

function subsetsIIFrames(): Frame[] {
  const nums = [1, 2, 2];
  return [
    arrayFrame(
      "Sort first · [1,2,2]",
      "Duplicates sit together. Sort so we can skip identical siblings at the same depth.",
      nums,
      { 0: "active" },
      {
        pointers: [{ name: "i", index: 0, color: PTR.M }],
        note: "path = [] · sorted",
      },
    ),
    arrayFrame(
      "Record every prefix",
      "Common Subsets II style: append path at every node (not only the leaf), then loop i…n-1.",
      nums,
      {},
      { note: "out ← [[]]" },
    ),
    arrayFrame(
      "Pick first 2",
      "From start=1, take nums[1]=2. Path [2]. Recurse with start=2.",
      nums,
      { 1: "match", 2: "active" },
      {
        pointers: [{ name: "start", index: 2, color: PTR.M }],
        note: "path = [2]",
      },
    ),
    arrayFrame(
      "Pick second 2 → [2,2]",
      "Same value, different index — allowed in this branch. Record [2,2].",
      nums,
      { 1: "match", 2: "match" },
      { note: "path = [2,2] · record" },
    ),
    arrayFrame(
      "Backtrack · skip twin",
      "Pop back to []. Next i would be the second 2 at the same depth as the first 2 — skip it.",
      nums,
      { 1: "done", 2: "skip" },
      {
        pointers: [{ name: "i", index: 2, color: PTR.R }],
        note: "i>start && nums[i]==nums[i-1] → skip",
      },
    ),
    arrayFrame(
      "Pick 1 then 2",
      "Branch starting with 1: [1], [1,2], [1,2,2]. The twin-skip still applies under prefix 1.",
      nums,
      { 0: "match", 1: "match", 2: "active" },
      { note: "path = [1,2]" },
    ),
    arrayFrame(
      "Unique power set",
      "Without the skip you'd emit [2] twice. Dedup rule: only the first copy at each depth may start a branch.",
      nums,
      { 0: "done", 1: "done", 2: "done" },
      { note: "[[],[1],[1,2],[1,2,2],[2],[2,2]]" },
    ),
  ];
}

function letterCaseFrames(): Frame[] {
  const s = ["a", "1", "b"];
  const paint = (
    chars: string[],
    tones: Record<number, CellTone> = {},
  ): Frame["cells"] =>
    chars.map((value, i) => ({ value, tone: tones[i] ?? "idle" }));

  return [
    {
      kind: "array",
      title: 's = "a1b"',
      caption: "Digits stay fixed. Letters branch into lower and upper. Same pick/skip shape — two choices per letter.",
      cells: paint(s, { 0: "active" }),
      note: "path building…",
    },
    {
      kind: "array",
      title: "Digit 1 · no fork",
      caption: "At index 1 the char is a digit: append as-is and advance. Only one child.",
      cells: paint(["a", "1", "b"], { 0: "done", 1: "match", 2: "active" }),
      note: "path = a1…",
    },
    {
      kind: "array",
      title: "Lower b",
      caption: "First letter choice for b: keep lowercase. Leaf records a1b.",
      cells: paint(["a", "1", "b"], { 0: "done", 1: "done", 2: "match" }),
      note: 'record "a1b"',
    },
    {
      kind: "array",
      title: "Upper B",
      caption: "Backtrack and take the other case. Sibling leaf: a1B.",
      cells: paint(["a", "1", "B"], { 0: "done", 1: "done", 2: "active" }),
      note: 'record "a1B"',
    },
    {
      kind: "array",
      title: "Also fork on a",
      caption: "Earlier choice: uppercase A. Then the same digit + b/B forks → A1b, A1B.",
      cells: paint(["A", "1", "b"], { 0: "match", 1: "window", 2: "active" }),
      note: 'path = "A1…"',
    },
    {
      kind: "array",
      title: "Four strings",
      caption: "2^(letter count) results. Digits never multiply the tree.",
      cells: paint(["a", "1", "b"], { 0: "done", 1: "done", 2: "done" }),
      note: "a1b · a1B · A1b · A1B",
    },
  ];
}

export const subsetsL2Solution: ProblemSolution = {
  approach:
    "DFS pick/skip at each index: recurse without the element, then push, recurse, pop. Record the path at every leaf. O(n·2ⁿ) time, O(n) recursion depth.",
  templates: langs(
    `def subsets(nums):
    out, path = [], []
    def dfs(i):
        if i == len(nums):
            out.append(path[:]); return
        dfs(i + 1)                       # skip
        path.append(nums[i]); dfs(i + 1); path.pop()  # pick
    dfs(0)
    return out`,
    `vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> out; vector<int> path;
    function<void(int)> dfs = [&](int i) {
        if (i == (int)nums.size()) { out.push_back(path); return; }
        dfs(i + 1);
        path.push_back(nums[i]); dfs(i + 1); path.pop_back();
    };
    dfs(0); return out;
}`,
    `List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> out = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    class D { void dfs(int i) {
        if (i == nums.length) { out.add(new ArrayList<>(path)); return; }
        dfs(i + 1);
        path.add(nums[i]); dfs(i + 1); path.remove(path.size() - 1);
    }}
    new D().dfs(0); return out;
}`,
    `function subsets(nums) {
  const out = [], path = [];
  function dfs(i) {
    if (i === nums.length) { out.push([...path]); return; }
    dfs(i + 1);
    path.push(nums[i]); dfs(i + 1); path.pop();
  }
  dfs(0);
  return out;
}`,
  ),
  frames: subsetsFrames(),
};

export const subsetsIISolution: ProblemSolution = {
  approach:
    "Sort, then DFS from start: at each depth skip a value if nums[i]==nums[i-1] and i>start (duplicate sibling). Record path at every node. O(n·2ⁿ) time, O(n) depth.",
  templates: langs(
    `def subsetsWithDup(nums):
    nums.sort(); out, path = [], []
    def dfs(start):
        out.append(path[:])
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue
            path.append(nums[i]); dfs(i + 1); path.pop()
    dfs(0)
    return out`,
    `vector<vector<int>> subsetsWithDup(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> out; vector<int> path;
    function<void(int)> dfs = [&](int start) {
        out.push_back(path);
        for (int i = start; i < (int)nums.size(); i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;
            path.push_back(nums[i]); dfs(i + 1); path.pop_back();
        }
    };
    dfs(0); return out;
}`,
    `List<List<Integer>> subsetsWithDup(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> out = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    class D { void dfs(int start) {
        out.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;
            path.add(nums[i]); dfs(i + 1); path.remove(path.size() - 1);
        }
    }}
    new D().dfs(0); return out;
}`,
    `function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b);
  const out = [], path = [];
  function dfs(start) {
    out.push([...path]);
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]); dfs(i + 1); path.pop();
    }
  }
  dfs(0);
  return out;
}`,
  ),
  frames: subsetsIIFrames(),
};

export const letterCasePermutationSolution: ProblemSolution = {
  approach:
    "DFS over the string: digits append once; letters recurse twice (lower + upper) with backtrack. O(n·2^L) time for L letters, O(n) depth.",
  templates: langs(
    `def letterCasePermutation(s):
    out, path = [], []
    def dfs(i):
        if i == len(s):
            out.append("".join(path)); return
        if s[i].isdigit():
            path.append(s[i]); dfs(i + 1); path.pop()
        else:
            path.append(s[i].lower()); dfs(i + 1); path.pop()
            path.append(s[i].upper()); dfs(i + 1); path.pop()
    dfs(0)
    return out`,
    `vector<string> letterCasePermutation(string s) {
    vector<string> out; string path;
    function<void(int)> dfs = [&](int i) {
        if (i == (int)s.size()) { out.push_back(path); return; }
        if (isdigit(s[i])) { path.push_back(s[i]); dfs(i + 1); path.pop_back(); }
        else {
            path.push_back(tolower(s[i])); dfs(i + 1); path.pop_back();
            path.push_back(toupper(s[i])); dfs(i + 1); path.pop_back();
        }
    };
    dfs(0); return out;
}`,
    `List<String> letterCasePermutation(String s) {
    List<String> out = new ArrayList<>();
    StringBuilder path = new StringBuilder();
    class D { void dfs(int i) {
        if (i == s.length()) { out.add(path.toString()); return; }
        char ch = s.charAt(i);
        if (Character.isDigit(ch)) {
            path.append(ch); dfs(i + 1); path.deleteCharAt(path.length() - 1);
        } else {
            path.append(Character.toLowerCase(ch)); dfs(i + 1); path.deleteCharAt(path.length() - 1);
            path.append(Character.toUpperCase(ch)); dfs(i + 1); path.deleteCharAt(path.length() - 1);
        }
    }}
    new D().dfs(0); return out;
}`,
    `function letterCasePermutation(s) {
  const out = [], path = [];
  function dfs(i) {
    if (i === s.length) { out.push(path.join("")); return; }
    if (s[i] >= "0" && s[i] <= "9") {
      path.push(s[i]); dfs(i + 1); path.pop();
    } else {
      path.push(s[i].toLowerCase()); dfs(i + 1); path.pop();
      path.push(s[i].toUpperCase()); dfs(i + 1); path.pop();
    }
  }
  dfs(0);
  return out;
}`,
  ),
  frames: letterCaseFrames(),
};

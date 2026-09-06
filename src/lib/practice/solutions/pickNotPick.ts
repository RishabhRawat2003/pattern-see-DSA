import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
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

function pathSumFrames(): Frame[] {
  const nodes = [
    { id: "a", label: "5", x: 50, y: 12 },
    { id: "b", label: "4", x: 28, y: 40 },
    { id: "c", label: "8", x: 72, y: 40 },
    { id: "d", label: "11", x: 16, y: 68 },
    { id: "e", label: "13", x: 60, y: 68 },
    { id: "f", label: "4", x: 84, y: 68 },
    { id: "g", label: "2", x: 8, y: 92 },
  ];
  const edges = [
    { from: "a", to: "b" },
    { from: "a", to: "c" },
    { from: "b", to: "d" },
    { from: "c", to: "e" },
    { from: "c", to: "f" },
    { from: "d", to: "g" },
  ];
  const tone = (active: string, path: string[] = []) =>
    nodes.map((n) => ({
      ...n,
      tone:
        n.id === active
          ? ("active" as const)
          : path.includes(n.id)
            ? ("window" as const)
            : ("idle" as const),
    }));
  return [
    {
      kind: "tree",
      title: "Target targetSum = 22",
      caption: "Pick/not-pick on a tree: at each node subtract val and recurse left/right. A leaf with remain 0 wins.",
      treeNodes: tone("a"),
      treeEdges: edges,
      note: "remain = 22",
    },
    {
      kind: "tree",
      title: "Take 5 → remain 17",
      caption: "Go left first (classic DFS). Same idea as skipping the right branch for now.",
      treeNodes: tone("b", ["a"]),
      treeEdges: edges,
      note: "path 5 · remain 17",
    },
    {
      kind: "tree",
      title: "Take 4 → remain 13",
      caption: "Continue down the left spine toward 11.",
      treeNodes: tone("d", ["a", "b"]),
      treeEdges: edges,
      note: "path 5-4 · remain 13",
    },
    {
      kind: "tree",
      title: "Take 11 → remain 2",
      caption: "Only a left child 2. Need remain to hit 0 at a leaf.",
      treeNodes: tone("g", ["a", "b", "d"]),
      treeEdges: edges,
      note: "path 5-4-11 · remain 2",
    },
    {
      kind: "tree",
      title: "Leaf 2 → remain 0",
      caption: "5+4+11+2 = 22. Leaf and remain 0 → true. No need to explore further.",
      treeNodes: nodes.map((n) => ({
        ...n,
        tone: ["a", "b", "d", "g"].includes(n.id) ? ("match" as const) : ("idle" as const),
      })),
      treeEdges: edges,
      note: "found root-to-leaf path",
    },
    {
      kind: "tree",
      title: "Right branch would fail",
      caption: "If left failed, try 5→8→… ; e.g. 5+8+4=17 ≠ 22. Pick/skip is choose left vs right child.",
      treeNodes: nodes.map((n) => ({
        ...n,
        tone: ["a", "c", "f"].includes(n.id) ? ("skip" as const) : ("idle" as const),
      })),
      treeEdges: edges,
      note: "5+8+4 = 17 ≠ 22",
    },
  ];
}

export const subsetsSolution: ProblemSolution = {
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

export const combinationSumSolution: ProblemSolution = {
  approach:
    "Same pick/skip idea with reuse: after picking candidates[i], recurse from i (not i+1). Prune when remain < 0; record when remain == 0. O(n^{T/min}) branching, O(T/min) depth.",
  templates: langs(
    `def combinationSum(candidates, target):
    out, path = [], []
    def dfs(i, remain):
        if remain == 0:
            out.append(path[:]); return
        if i == len(candidates) or remain < 0:
            return
        dfs(i + 1, remain)                          # skip
        path.append(candidates[i])
        dfs(i, remain - candidates[i])              # pick + reuse
        path.pop()
    dfs(0, target)
    return out`,
    `vector<vector<int>> combinationSum(vector<int>& cand, int target) {
    vector<vector<int>> out; vector<int> path;
    function<void(int,int)> dfs = [&](int i, int remain) {
        if (remain == 0) { out.push_back(path); return; }
        if (i == (int)cand.size() || remain < 0) return;
        dfs(i + 1, remain);
        path.push_back(cand[i]); dfs(i, remain - cand[i]); path.pop_back();
    };
    dfs(0, target); return out;
}`,
    `List<List<Integer>> combinationSum(int[] cand, int target) {
    List<List<Integer>> out = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    class D { void dfs(int i, int remain) {
        if (remain == 0) { out.add(new ArrayList<>(path)); return; }
        if (i == cand.length || remain < 0) return;
        dfs(i + 1, remain);
        path.add(cand[i]); dfs(i, remain - cand[i]); path.remove(path.size() - 1);
    }}
    new D().dfs(0, target); return out;
}`,
    `function combinationSum(candidates, target) {
  const out = [], path = [];
  function dfs(i, remain) {
    if (remain === 0) { out.push([...path]); return; }
    if (i === candidates.length || remain < 0) return;
    dfs(i + 1, remain);
    path.push(candidates[i]);
    dfs(i, remain - candidates[i]);
    path.pop();
  }
  dfs(0, target);
  return out;
}`,
  ),
  frames: combinationSumFrames(),
};

export const pathSumSolution: ProblemSolution = {
  approach:
    "Root-to-leaf pick/skip: subtract node.val and recurse left/right. True iff a leaf sees remain 0. O(n) time, O(h) stack.",
  templates: langs(
    `def hasPathSum(root, targetSum):
    if not root: return False
    remain = targetSum - root.val
    if not root.left and not root.right:
        return remain == 0
    return hasPathSum(root.left, remain) or hasPathSum(root.right, remain)`,
    `bool hasPathSum(TreeNode* root, int targetSum) {
    if (!root) return false;
    int remain = targetSum - root->val;
    if (!root->left && !root->right) return remain == 0;
    return hasPathSum(root->left, remain) || hasPathSum(root->right, remain);
}`,
    `boolean hasPathSum(TreeNode root, int targetSum) {
    if (root == null) return false;
    int remain = targetSum - root.val;
    if (root.left == null && root.right == null) return remain == 0;
    return hasPathSum(root.left, remain) || hasPathSum(root.right, remain);
}`,
    `function hasPathSum(root, targetSum) {
  if (!root) return false;
  const remain = targetSum - root.val;
  if (!root.left && !root.right) return remain === 0;
  return hasPathSum(root.left, remain) || hasPathSum(root.right, remain);
}`,
  ),
  frames: pathSumFrames(),
};

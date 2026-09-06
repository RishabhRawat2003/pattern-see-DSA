import type { CellTone, Frame, TreeNode } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

const base: TreeNode[] = [
  { id: "n4", label: "4", x: 50, y: 14 },
  { id: "n2", label: "2", x: 28, y: 42 },
  { id: "n6", label: "6", x: 72, y: 42 },
  { id: "n1", label: "1", x: 14, y: 72 },
  { id: "n3", label: "3", x: 42, y: 72 },
  { id: "n7", label: "7", x: 86, y: 72 },
];
const edges = [
  { from: "n4", to: "n2" },
  { from: "n4", to: "n6" },
  { from: "n2", to: "n1" },
  { from: "n2", to: "n3" },
  { from: "n6", to: "n7" },
];

function paint(map: Record<string, CellTone>): TreeNode[] {
  return base.map((n) => ({ ...n, tone: map[n.id] ?? "idle" }));
}

function tree(
  title: string,
  caption: string,
  map: Record<string, CellTone>,
  extra: Partial<Frame> = {},
): Frame {
  return {
    kind: "tree",
    title,
    caption,
    treeNodes: paint(map),
    treeEdges: edges,
    ...extra,
  };
}

function pathSumFrames(): Frame[] {
  return [
    tree(
      "Target 9",
      "Subtract node value going down. At a leaf, remaining 0 means a valid root-to-leaf path.",
      { n4: "active" },
      { note: "need 9" },
    ),
    tree(
      "Take 4 → need 5",
      "Go left to 2.",
      { n4: "window", n2: "active" },
      { note: "need 5" },
    ),
    tree(
      "Take 2 → need 3",
      "Left leaf 1 leaves 2 — fail. Right leaf 3 leaves 0 — success.",
      { n4: "window", n2: "window", n1: "skip", n3: "active" },
      { note: "need 3" },
    ),
    tree(
      "Path 4-2-3",
      "4+2+3=9. Return true (or keep searching if collecting all paths).",
      { n4: "match", n2: "match", n3: "match" },
      { note: "true" },
    ),
    tree(
      "Empty / miss",
      "Null root → false. Exhaust both sides without a leaf hit → false.",
      { n6: "skip", n7: "skip" },
    ),
  ];
}

function pathSumIIFrames(): Frame[] {
  return [
    tree(
      "Collect all paths",
      "Same DFS with remaining sum, but keep a path list; at leaf with rest 0, copy path to answer.",
      { n4: "active" },
      { note: "target 9 · path=[]" },
    ),
    tree(
      "Push 4, 2",
      "Backtracking: append before recurse, pop after.",
      { n4: "window", n2: "active" },
      { note: "path = [4,2]" },
    ),
    tree(
      "Try leaf 1",
      "4+2+1=7 ≠ 9. Do not record; backtrack.",
      { n4: "window", n2: "window", n1: "skip" },
      { note: "fail" },
    ),
    tree(
      "Leaf 3 works",
      "Record copy [4,2,3]. Pop 3 and continue.",
      { n4: "match", n2: "match", n3: "match" },
      { note: "ans += [4,2,3]" },
    ),
    tree(
      "Explore right of 4",
      "Path [4,6,…] — check leaves under 6 the same way.",
      { n4: "window", n6: "active", n7: "window" },
      { note: "continue DFS" },
    ),
    tree(
      "Done",
      "All root-to-leaf paths that sum to target are in the answer list.",
      { n4: "done", n2: "done", n3: "match" },
      { note: "[[4,2,3], …]" },
    ),
  ];
}

function pathSumIIIFrames(): Frame[] {
  return [
    tree(
      "Any downward path",
      "Not only root-to-leaf: any node to descendant. Prefix sums + hashmap counts paths.",
      {},
      { note: "target = 3" },
    ),
    tree(
      "Prefix at 4",
      "cur = 4. Need cur−target = 1 in map? Not yet. Record prefix 4.",
      { n4: "active" },
      { note: "map[0]=1 · cur=4" },
    ),
    tree(
      "Down to 2",
      "cur = 6. Look for 6−3=3 — miss. Then to 1: cur=7, look for 4.",
      { n4: "window", n2: "active" },
      { note: "cur=6" },
    ),
    tree(
      "Hit at leaf 1",
      "cur=7; map has prefix 4 → count path 2→1 (sum 3). Prefix map finds any ancestor cut.",
      { n4: "window", n2: "window", n1: "match" },
      { note: "count += map[cur-target]" },
    ),
    tree(
      "Node 3",
      "Value 3 alone equals target; also 2+? etc. Map stores how many prefixes equal cur−target.",
      { n3: "match" },
      { note: "count grows" },
    ),
    tree(
      "Backtrack map",
      "Decrement map[cur] when leaving a node so other branches stay correct. O(n) time.",
      {
        n4: "done",
        n2: "done",
        n6: "done",
        n1: "done",
        n3: "done",
        n7: "done",
      },
      { note: "prefix DFS" },
    ),
  ];
}

export const pathSumSolution: ProblemSolution = {
  approach:
    "DFS with remaining target: at leaf return rest==0; else OR of children with target−val. O(n) time, O(h) space.",
  templates: langs(
    `def hasPathSum(root, targetSum):
    if not root: return False
    rest = targetSum - root.val
    if not root.left and not root.right:
        return rest == 0
    return hasPathSum(root.left, rest) or hasPathSum(root.right, rest)`,
    `bool hasPathSum(TreeNode* root, int targetSum) {
    if (!root) return false;
    int rest = targetSum - root->val;
    if (!root->left && !root->right) return rest == 0;
    return hasPathSum(root->left, rest) || hasPathSum(root->right, rest);
}`,
    `boolean hasPathSum(TreeNode root, int targetSum) {
    if (root == null) return false;
    int rest = targetSum - root.val;
    if (root.left == null && root.right == null) return rest == 0;
    return hasPathSum(root.left, rest) || hasPathSum(root.right, rest);
}`,
    `function hasPathSum(root, targetSum) {
  if (!root) return false;
  const rest = targetSum - root.val;
  if (!root.left && !root.right) return rest === 0;
  return hasPathSum(root.left, rest) || hasPathSum(root.right, rest);
}`,
  ),
  frames: pathSumFrames(),
};

export const pathSumIISolution: ProblemSolution = {
  approach:
    "Backtracking DFS: push val, recurse with remaining; at leaf with 0 copy path; pop on return. O(n²) worst (copying paths), O(h) stack.",
  templates: langs(
    `def pathSum(root, targetSum):
    ans, path = [], []
    def dfs(n, rest):
        if not n: return
        path.append(n.val)
        rest -= n.val
        if not n.left and not n.right and rest == 0:
            ans.append(path[:])
        dfs(n.left, rest)
        dfs(n.right, rest)
        path.pop()
    dfs(root, targetSum)
    return ans`,
    `void dfs(TreeNode* n, int rest, vector<int>& path, vector<vector<int>>& ans) {
    if (!n) return;
    path.push_back(n->val);
    rest -= n->val;
    if (!n->left && !n->right && rest == 0) ans.push_back(path);
    dfs(n->left, rest, path, ans);
    dfs(n->right, rest, path, ans);
    path.pop_back();
}
vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
    vector<vector<int>> ans; vector<int> path;
    dfs(root, targetSum, path, ans);
    return ans;
}`,
    `void dfs(TreeNode n, int rest, List<Integer> path, List<List<Integer>> ans) {
    if (n == null) return;
    path.add(n.val);
    rest -= n.val;
    if (n.left == null && n.right == null && rest == 0)
        ans.add(new ArrayList<>(path));
    dfs(n.left, rest, path, ans);
    dfs(n.right, rest, path, ans);
    path.remove(path.size() - 1);
}
List<List<Integer>> pathSum(TreeNode root, int targetSum) {
    List<List<Integer>> ans = new ArrayList<>();
    dfs(root, targetSum, new ArrayList<>(), ans);
    return ans;
}`,
    `function pathSum(root, targetSum) {
  const ans = [], path = [];
  function dfs(n, rest) {
    if (!n) return;
    path.push(n.val);
    rest -= n.val;
    if (!n.left && !n.right && rest === 0) ans.push([...path]);
    dfs(n.left, rest);
    dfs(n.right, rest);
    path.pop();
  }
  dfs(root, targetSum);
  return ans;
}`,
  ),
  frames: pathSumIIFrames(),
};

export const pathSumIIISolution: ProblemSolution = {
  approach:
    "Prefix-sum DFS: map[prefix] counts; at node cur += val, add map[cur−target], recurse, then decrement map[cur]. Counts any downward path. O(n) time.",
  templates: langs(
    `from collections import defaultdict

def pathSum(root, targetSum):
    cnt = 0
    freq = defaultdict(int)
    freq[0] = 1
    def dfs(n, cur):
        nonlocal cnt
        if not n: return
        cur += n.val
        cnt += freq[cur - targetSum]
        freq[cur] += 1
        dfs(n.left, cur)
        dfs(n.right, cur)
        freq[cur] -= 1
    dfs(root, 0)
    return cnt`,
    `int pathSum(TreeNode* root, int targetSum) {
    unordered_map<long,int> freq;
    freq[0] = 1;
    int cnt = 0;
    function<void(TreeNode*, long)> dfs = [&](TreeNode* n, long cur) {
        if (!n) return;
        cur += n->val;
        cnt += freq[cur - targetSum];
        freq[cur]++;
        dfs(n->left, cur);
        dfs(n->right, cur);
        freq[cur]--;
    };
    dfs(root, 0);
    return cnt;
}`,
    `int cnt;
Map<Long, Integer> freq = new HashMap<>();
void dfs(TreeNode n, long cur, int target) {
    if (n == null) return;
    cur += n.val;
    cnt += freq.getOrDefault(cur - target, 0);
    freq.put(cur, freq.getOrDefault(cur, 0) + 1);
    dfs(n.left, cur, target);
    dfs(n.right, cur, target);
    freq.put(cur, freq.get(cur) - 1);
}
int pathSum(TreeNode root, int targetSum) {
    cnt = 0;
    freq.clear();
    freq.put(0L, 1);
    dfs(root, 0, targetSum);
    return cnt;
}`,
    `function pathSum(root, targetSum) {
  let cnt = 0;
  const freq = new Map([[0, 1]]);
  function dfs(n, cur) {
    if (!n) return;
    cur += n.val;
    cnt += freq.get(cur - targetSum) || 0;
    freq.set(cur, (freq.get(cur) || 0) + 1);
    dfs(n.left, cur);
    dfs(n.right, cur);
    freq.set(cur, freq.get(cur) - 1);
  }
  dfs(root, 0);
  return cnt;
}`,
  ),
  frames: pathSumIIIFrames(),
};

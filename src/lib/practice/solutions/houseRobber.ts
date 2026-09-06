import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { CellTone, Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const houseRobberSolution: ProblemSolution = {
  approach:
    "Linear houses: dp[i] = max(skip = dp[i−1], rob = nums[i] + dp[i−2]). Two rolling vars. O(n) time, O(1) space.",
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
    const houses = [1, 2, 3, 1];
    return [
      arrayFrame(
        "Houses [1, 2, 3, 1]",
        "Rob non-adjacent houses for max money.",
        houses,
        {},
        { note: "prev=0 · cur=0" },
      ),
      arrayFrame(
        "Take 1",
        "cur = max(0, 0+1) = 1.",
        houses,
        { 0: "match" },
        {
          pointers: [{ name: "i", index: 0, color: PTR.M }],
          note: "prev 0 · cur 1",
        },
      ),
      arrayFrame(
        "Take 2",
        "max(1, 0+2)=2. Prefer house 2 alone.",
        houses,
        { 0: "skip", 1: "match" },
        {
          pointers: [{ name: "i", index: 1, color: PTR.M }],
          note: "prev 1 · cur 2",
        },
      ),
      arrayFrame(
        "House 3",
        "max(2, 1+3)=4. Rob first and third.",
        houses,
        { 0: "match", 1: "skip", 2: "match" },
        {
          pointers: [{ name: "i", index: 2, color: PTR.M }],
          note: "prev 2 · cur 4",
        },
      ),
      arrayFrame(
        "Last 1",
        "max(4, 2+1=3)=4. Stick with 1+3.",
        houses,
        { 0: "match", 2: "match", 3: "skip" },
        {
          pointers: [{ name: "i", index: 3, color: PTR.M }],
          note: "cur 4",
        },
      ),
      arrayFrame(
        "Answer",
        "Best is 4 from houses valued 1 and 3.",
        houses,
        { 0: "match", 2: "match" },
        { note: "return 4" },
      ),
    ];
  })(),
};

export const houseRobberIISolution: ProblemSolution = {
  approach:
    "Circle: first and last are adjacent. Answer = max(rob linear range [0..n−2], rob [1..n−1]). Reuse linear rob helper. O(n).",
  templates: langs(
    `def rob(nums):
    def linear(lo, hi):
        prev = cur = 0
        for i in range(lo, hi):
            prev, cur = cur, max(cur, prev + nums[i])
        return cur
    n = len(nums)
    if n == 1: return nums[0]
    return max(linear(0, n - 1), linear(1, n))`,
    `int robLinear(vector<int>& nums, int lo, int hi) {
    int prev = 0, cur = 0;
    for (int i = lo; i < hi; i++) {
        int nxt = max(cur, prev + nums[i]);
        prev = cur; cur = nxt;
    }
    return cur;
}
int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 1) return nums[0];
    return max(robLinear(nums, 0, n - 1), robLinear(nums, 1, n));
}`,
    `int robLinear(int[] nums, int lo, int hi) {
    int prev = 0, cur = 0;
    for (int i = lo; i < hi; i++) {
        int nxt = Math.max(cur, prev + nums[i]);
        prev = cur; cur = nxt;
    }
    return cur;
}
int rob(int[] nums) {
    int n = nums.length;
    if (n == 1) return nums[0];
    return Math.max(robLinear(nums, 0, n - 1), robLinear(nums, 1, n));
}`,
    `function rob(nums) {
  const linear = (lo, hi) => {
    let prev = 0, cur = 0;
    for (let i = lo; i < hi; i++) {
      [prev, cur] = [cur, Math.max(cur, prev + nums[i])];
    }
    return cur;
  };
  const n = nums.length;
  if (n === 1) return nums[0];
  return Math.max(linear(0, n - 1), linear(1, n));
}`,
  ),
  frames: (() => {
    const houses = [2, 3, 2];
    return [
      arrayFrame(
        "Circle [2, 3, 2]",
        "First and last touch. Cannot rob both ends — split into two linear ranges.",
        houses,
        { 0: "hi", 2: "hi" },
        { note: "ends adjacent" },
      ),
      arrayFrame(
        "Range A: skip last",
        "Rob [2, 3] only → max = 3 (better than 2).",
        houses,
        { 0: "window", 1: "window", 2: "skip" },
        { window: [0, 1], note: "linear(0,2) = 3" },
      ),
      arrayFrame(
        "Range B: skip first",
        "Rob [3, 2] → max = 3.",
        houses,
        { 0: "skip", 1: "window", 2: "window" },
        { window: [1, 2], note: "linear(1,3) = 3" },
      ),
      arrayFrame(
        "Compare",
        "max(3, 3) = 3. Either take the middle alone, or one end — never both ends.",
        houses,
        { 1: "match" },
        { note: "max of both ranges" },
      ),
      arrayFrame(
        "Answer",
        "Best circular loot is 3.",
        houses,
        { 1: "match" },
        { note: "return 3" },
      ),
    ];
  })(),
};

function houseRobberIIIFrames(): Frame[] {
  const nodes = [
    { id: "a", label: "3", x: 50, y: 12 },
    { id: "b", label: "2", x: 28, y: 42 },
    { id: "c", label: "3", x: 72, y: 42 },
    { id: "d", label: "3", x: 18, y: 72 },
    { id: "e", label: "1", x: 82, y: 72 },
  ];
  const edges = [
    { from: "a", to: "b" },
    { from: "a", to: "c" },
    { from: "b", to: "d" },
    { from: "c", to: "e" },
  ];
  const paint = (tones: Record<string, CellTone>) =>
    nodes.map((n) => ({ ...n, tone: tones[n.id] ?? ("idle" as CellTone) }));
  return [
    {
      kind: "tree",
      title: "Tree house robber",
      caption: "Parent and child are adjacent. Each node returns (rob, skip).",
      treeNodes: paint({ a: "active" }),
      treeEdges: edges,
      note: "post-order DFS",
    },
    {
      kind: "tree",
      title: "Leaf 3 (left)",
      caption: "rob=3, skip=0. No children.",
      treeNodes: paint({ d: "match" }),
      treeEdges: edges,
      note: "(3, 0)",
    },
    {
      kind: "tree",
      title: "Node 2",
      caption: "rob = 2+0+0=2; skip = max(3,0)+max(0,0)=3. Prefer skip child.",
      treeNodes: paint({ b: "active", d: "match" }),
      treeEdges: edges,
      note: "L=(2,3)",
    },
    {
      kind: "tree",
      title: "Right leaf 1",
      caption: "rob=1, skip=0 under right child 3.",
      treeNodes: paint({ e: "match", c: "active" }),
      treeEdges: edges,
      note: "R child (3,1) then (1,0)",
    },
    {
      kind: "tree",
      title: "Root 3",
      caption: "rob = 3 + skipL + skipR = 3+3+1=7; skip = max(L)+max(R)=3+3=6.",
      treeNodes: paint({ a: "active", b: "window", c: "window" }),
      treeEdges: edges,
      note: "rob 7 · skip 6",
    },
    {
      kind: "tree",
      title: "Answer",
      caption: "max(7,6)=7 — rob root, skip both children, take grandchildren.",
      treeNodes: paint({ a: "match", d: "match", e: "match", b: "skip", c: "skip" }),
      treeEdges: edges,
      note: "return 7",
    },
  ];
}

export const houseRobberIIISolution: ProblemSolution = {
  approach:
    "Tree DP: each node returns (rob_this, skip_this). rob = val + skip(L)+skip(R); skip = max(L)+max(R). Answer max at root. O(n).",
  templates: langs(
    `def rob(root):
    def dfs(node):
        if not node: return (0, 0)
        lr, ls = dfs(node.left)
        rr, rs = dfs(node.right)
        rob = node.val + ls + rs
        skip = max(lr, ls) + max(rr, rs)
        return (rob, skip)
    return max(dfs(root))`,
    `pair<int,int> dfs(TreeNode* node) {
    if (!node) return {0, 0};
    auto [lr, ls] = dfs(node->left);
    auto [rr, rs] = dfs(node->right);
    int rob = node->val + ls + rs;
    int skip = max(lr, ls) + max(rr, rs);
    return {rob, skip};
}
int rob(TreeNode* root) {
    auto [r, s] = dfs(root);
    return max(r, s);
}`,
    `int[] dfs(TreeNode node) {
    if (node == null) return new int[]{0, 0};
    int[] L = dfs(node.left), R = dfs(node.right);
    int rob = node.val + L[1] + R[1];
    int skip = Math.max(L[0], L[1]) + Math.max(R[0], R[1]);
    return new int[]{rob, skip};
}
int rob(TreeNode root) {
    int[] ans = dfs(root);
    return Math.max(ans[0], ans[1]);
}`,
    `function rob(root) {
  function dfs(node) {
    if (!node) return [0, 0];
    const [lr, ls] = dfs(node.left);
    const [rr, rs] = dfs(node.right);
    const rob = node.val + ls + rs;
    const skip = Math.max(lr, ls) + Math.max(rr, rs);
    return [rob, skip];
  }
  return Math.max(...dfs(root));
}`,
  ),
  frames: houseRobberIIIFrames(),
};

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

function levelOrderFrames(): Frame[] {
  return [
    tree(
      "Queue BFS",
      "Start with root in the queue. Each round drains exactly one level.",
      { n4: "active" },
      { cells: [{ value: "Q: 4", tone: "active" }], note: "level 0" },
    ),
    tree(
      "Level [4]",
      "Pop 4; enqueue left 2 and right 6. Record level [4].",
      { n4: "done", n2: "window", n6: "window" },
      { cells: [{ value: "Q: 2, 6", tone: "window" }], note: "out = [[4]]" },
    ),
    tree(
      "Level [2, 6]",
      "Drain size=2: visit 2 (enqueue 1,3), then 6 (enqueue 7).",
      { n4: "done", n2: "active", n6: "active", n1: "window", n3: "window", n7: "window" },
      { cells: [{ value: "Q: 1, 3, 7", tone: "window" }], note: "out = [[4],[2,6]]" },
    ),
    tree(
      "Level [1, 3, 7]",
      "Leaves: no children. Queue empties after this level.",
      { n4: "done", n2: "done", n6: "done", n1: "active", n3: "active", n7: "active" },
      { cells: [{ value: "Q: ∅", tone: "done" }], note: "out = [[4],[2,6],[1,3,7]]" },
    ),
    tree(
      "Done",
      "Answer is levels top → bottom. Time O(n), space O(w) for the widest level.",
      {
        n4: "match",
        n2: "match",
        n6: "match",
        n1: "match",
        n3: "match",
        n7: "match",
      },
      { note: "[[4],[2,6],[1,3,7]]" },
    ),
  ];
}

function levelOrderIIFrames(): Frame[] {
  return [
    tree(
      "Bottom-up levels",
      "Same BFS as level order I, then reverse the list of levels (or prepend each level).",
      { n4: "active" },
      { note: "collect then reverse" },
    ),
    tree(
      "BFS still top-down",
      "Queue still yields [4], then [2,6], then [1,3,7].",
      { n4: "done", n2: "window", n6: "window" },
      { note: "temp = [[4],[2,6],[1,3,7]]" },
    ),
    tree(
      "Deepest level first",
      "After reverse: leaves appear first.",
      { n1: "match", n3: "match", n7: "match" },
      { note: "[[1,3,7], …]" },
    ),
    tree(
      "Middle level",
      "Next: [2, 6].",
      { n2: "match", n6: "match", n1: "done", n3: "done", n7: "done" },
      { note: "[[1,3,7],[2,6], …]" },
    ),
    tree(
      "Root last",
      "Final answer [[1,3,7],[2,6],[4]]. Same visits, flipped output.",
      {
        n4: "match",
        n2: "done",
        n6: "done",
        n1: "done",
        n3: "done",
        n7: "done",
      },
      { note: "[[1,3,7],[2,6],[4]]" },
    ),
  ];
}

function rightSideViewFrames(): Frame[] {
  return [
    tree(
      "Right side view",
      "From the right, you see the last node of each level: 4, then 6, then 7.",
      {},
      { note: "one value per depth" },
    ),
    tree(
      "Level 0 → 4",
      "Only root. Record 4 (last / only node on the level).",
      { n4: "match" },
      { note: "view = [4]" },
    ),
    tree(
      "Level 1 → 6",
      "Queue order left→right: 2 then 6. Last popped is 6 — visible from the right.",
      { n4: "done", n2: "window", n6: "match" },
      { note: "view = [4, 6]" },
    ),
    tree(
      "Level 2 → 7",
      "Level nodes 1, 3, 7. Last is 7 — that is the rightmost.",
      { n4: "done", n2: "done", n6: "done", n1: "window", n3: "window", n7: "match" },
      { note: "view = [4, 6, 7]" },
    ),
    tree(
      "Trick",
      "During BFS, when i == size−1 (last index of the level), append that value.",
      {
        n4: "match",
        n6: "match",
        n7: "match",
      },
      { note: "[4, 6, 7]" },
    ),
  ];
}

export const binaryTreeLevelOrderTraversalSolution: ProblemSolution = {
  approach:
    "BFS with a queue: for each level, process q.size() nodes, enqueue children. O(n) time, O(w) space.",
  templates: langs(
    `from collections import deque

def levelOrder(root):
    if not root: return []
    q, out = deque([root]), []
    while q:
        level = []
        for _ in range(len(q)):
            n = q.popleft()
            level.append(n.val)
            if n.left: q.append(n.left)
            if n.right: q.append(n.right)
        out.append(level)
    return out`,
    `vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> out;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = (int)q.size();
        vector<int> level;
        for (int i = 0; i < sz; i++) {
            TreeNode* n = q.front(); q.pop();
            level.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        out.push_back(level);
    }
    return out;
}`,
    `List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> out = new ArrayList<>();
    if (root == null) return out;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.add(root);
    while (!q.isEmpty()) {
        int sz = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < sz; i++) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null) q.add(n.left);
            if (n.right != null) q.add(n.right);
        }
        out.add(level);
    }
    return out;
}`,
    `function levelOrder(root) {
  if (!root) return [];
  const q = [root], out = [];
  while (q.length) {
    const level = [], sz = q.length;
    for (let i = 0; i < sz; i++) {
      const n = q.shift();
      level.push(n.val);
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
    out.push(level);
  }
  return out;
}`,
  ),
  frames: levelOrderFrames(),
};

export const binaryTreeLevelOrderTraversalIISolution: ProblemSolution = {
  approach:
    "Same level-order BFS, then reverse the result (or insert levels at front). O(n) time, O(w) space.",
  templates: langs(
    `from collections import deque

def levelOrderBottom(root):
    if not root: return []
    q, out = deque([root]), []
    while q:
        level = []
        for _ in range(len(q)):
            n = q.popleft()
            level.append(n.val)
            if n.left: q.append(n.left)
            if n.right: q.append(n.right)
        out.append(level)
    return out[::-1]`,
    `vector<vector<int>> levelOrderBottom(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> out;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = (int)q.size();
        vector<int> level;
        for (int i = 0; i < sz; i++) {
            TreeNode* n = q.front(); q.pop();
            level.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        out.push_back(level);
    }
    reverse(out.begin(), out.end());
    return out;
}`,
    `List<List<Integer>> levelOrderBottom(TreeNode root) {
    List<List<Integer>> out = new ArrayList<>();
    if (root == null) return out;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.add(root);
    while (!q.isEmpty()) {
        int sz = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < sz; i++) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null) q.add(n.left);
            if (n.right != null) q.add(n.right);
        }
        out.add(level);
    }
    Collections.reverse(out);
    return out;
}`,
    `function levelOrderBottom(root) {
  if (!root) return [];
  const q = [root], out = [];
  while (q.length) {
    const level = [], sz = q.length;
    for (let i = 0; i < sz; i++) {
      const n = q.shift();
      level.push(n.val);
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
    out.push(level);
  }
  return out.reverse();
}`,
  ),
  frames: levelOrderIIFrames(),
};

export const binaryTreeRightSideViewSolution: ProblemSolution = {
  approach:
    "BFS level by level; append the last node of each level. DFS with depth tracking also works. O(n) time, O(w) space.",
  templates: langs(
    `from collections import deque

def rightSideView(root):
    if not root: return []
    q, out = deque([root]), []
    while q:
        sz = len(q)
        for i in range(sz):
            n = q.popleft()
            if i == sz - 1: out.append(n.val)
            if n.left: q.append(n.left)
            if n.right: q.append(n.right)
    return out`,
    `vector<int> rightSideView(TreeNode* root) {
    if (!root) return {};
    vector<int> out;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = (int)q.size();
        for (int i = 0; i < sz; i++) {
            TreeNode* n = q.front(); q.pop();
            if (i == sz - 1) out.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
    }
    return out;
}`,
    `List<Integer> rightSideView(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    if (root == null) return out;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.add(root);
    while (!q.isEmpty()) {
        int sz = q.size();
        for (int i = 0; i < sz; i++) {
            TreeNode n = q.poll();
            if (i == sz - 1) out.add(n.val);
            if (n.left != null) q.add(n.left);
            if (n.right != null) q.add(n.right);
        }
    }
    return out;
}`,
    `function rightSideView(root) {
  if (!root) return [];
  const q = [root], out = [];
  while (q.length) {
    const sz = q.length;
    for (let i = 0; i < sz; i++) {
      const n = q.shift();
      if (i === sz - 1) out.push(n.val);
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
  }
  return out;
}`,
  ),
  frames: rightSideViewFrames(),
};

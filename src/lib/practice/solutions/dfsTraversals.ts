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

function walkFrames(
  order: string[],
  label: string,
  rule: string,
  result: string,
): Frame[] {
  const frames: Frame[] = [
    tree("Same tree", `${rule} Output ends as: ${result}.`, {}),
  ];
  const seen: Record<string, CellTone> = {};
  const out: string[] = [];
  for (const id of order) {
    const node = base.find((n) => n.id === id)!;
    out.push(node.label);
    seen[id] = "done";
    frames.push(
      tree(
        `${label} · ${node.label}`,
        `Visit ${node.label}. Collected so far: ${out.join(" ")}.`,
        { ...seen, [id]: "active" },
        { note: out.join(" ") },
      ),
    );
  }
  frames.push(
    tree(
      `${label} done`,
      `Full order: ${result}. Recursion stack depth is O(h).`,
      Object.fromEntries(order.map((id) => [id, "match" as CellTone])),
      { note: result },
    ),
  );
  return frames;
}

export const binaryTreeInorderTraversalSolution: ProblemSolution = {
  approach:
    "Left → node → right. Recurse or stack-simulate. On a BST this yields sorted order. O(n) time, O(h) space.",
  templates: langs(
    `def inorderTraversal(root):
    out = []
    def walk(n):
        if not n: return
        walk(n.left)
        out.append(n.val)
        walk(n.right)
    walk(root)
    return out`,
    `vector<int> inorderTraversal(TreeNode* root) {
    vector<int> out;
    function<void(TreeNode*)> walk = [&](TreeNode* n) {
        if (!n) return;
        walk(n->left);
        out.push_back(n->val);
        walk(n->right);
    };
    walk(root);
    return out;
}`,
    `List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    walk(root, out);
    return out;
}
void walk(TreeNode n, List<Integer> out) {
    if (n == null) return;
    walk(n.left, out);
    out.add(n.val);
    walk(n.right, out);
}`,
    `function inorderTraversal(root) {
  const out = [];
  function walk(n) {
    if (!n) return;
    walk(n.left);
    out.push(n.val);
    walk(n.right);
  }
  walk(root);
  return out;
}`,
  ),
  frames: walkFrames(
    ["n1", "n2", "n3", "n4", "n6", "n7"],
    "Inorder",
    "Visit left subtree, then the node, then right.",
    "1 2 3 4 6 7",
  ),
};

export const binaryTreePreorderTraversalSolution: ProblemSolution = {
  approach:
    "Node → left → right. Record value before recursing. Useful for serialize / copy tree. O(n) time, O(h) space.",
  templates: langs(
    `def preorderTraversal(root):
    out = []
    def walk(n):
        if not n: return
        out.append(n.val)
        walk(n.left)
        walk(n.right)
    walk(root)
    return out`,
    `vector<int> preorderTraversal(TreeNode* root) {
    vector<int> out;
    function<void(TreeNode*)> walk = [&](TreeNode* n) {
        if (!n) return;
        out.push_back(n->val);
        walk(n->left);
        walk(n->right);
    };
    walk(root);
    return out;
}`,
    `List<Integer> preorderTraversal(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    walk(root, out);
    return out;
}
void walk(TreeNode n, List<Integer> out) {
    if (n == null) return;
    out.add(n.val);
    walk(n.left, out);
    walk(n.right, out);
}`,
    `function preorderTraversal(root) {
  const out = [];
  function walk(n) {
    if (!n) return;
    out.push(n.val);
    walk(n.left);
    walk(n.right);
  }
  walk(root);
  return out;
}`,
  ),
  frames: walkFrames(
    ["n4", "n2", "n1", "n3", "n6", "n7"],
    "Preorder",
    "Visit the node first, then left, then right.",
    "4 2 1 3 6 7",
  ),
};

export const binaryTreePostorderTraversalSolution: ProblemSolution = {
  approach:
    "Left → right → node. Process children before parent — good for delete / height. O(n) time, O(h) space.",
  templates: langs(
    `def postorderTraversal(root):
    out = []
    def walk(n):
        if not n: return
        walk(n.left)
        walk(n.right)
        out.append(n.val)
    walk(root)
    return out`,
    `vector<int> postorderTraversal(TreeNode* root) {
    vector<int> out;
    function<void(TreeNode*)> walk = [&](TreeNode* n) {
        if (!n) return;
        walk(n->left);
        walk(n->right);
        out.push_back(n->val);
    };
    walk(root);
    return out;
}`,
    `List<Integer> postorderTraversal(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    walk(root, out);
    return out;
}
void walk(TreeNode n, List<Integer> out) {
    if (n == null) return;
    walk(n.left, out);
    walk(n.right, out);
    out.add(n.val);
}`,
    `function postorderTraversal(root) {
  const out = [];
  function walk(n) {
    if (!n) return;
    walk(n.left);
    walk(n.right);
    out.push(n.val);
  }
  walk(root);
  return out;
}`,
  ),
  frames: walkFrames(
    ["n1", "n3", "n2", "n7", "n6", "n4"],
    "Postorder",
    "Finish both children, then visit the node.",
    "1 3 2 7 6 4",
  ),
};

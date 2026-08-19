import type { CellTone, Frame, TreeNode } from "../types";

export const layout: Record<string, TreeNode> = {
  n4: { id: "n4", label: "4", x: 50, y: 14 },
  n2: { id: "n2", label: "2", x: 28, y: 42 },
  n6: { id: "n6", label: "6", x: 72, y: 42 },
  n1: { id: "n1", label: "1", x: 14, y: 72 },
  n3: { id: "n3", label: "3", x: 42, y: 72 },
  n7: { id: "n7", label: "7", x: 86, y: 72 },
};

export const sampleEdges = [
  { from: "n4", to: "n2" },
  { from: "n4", to: "n6" },
  { from: "n2", to: "n1" },
  { from: "n2", to: "n3" },
  { from: "n6", to: "n7" },
];

export function paint(
  map: Record<string, CellTone>,
): TreeNode[] {
  return Object.values(layout).map((n) => ({ ...n, tone: map[n.id] ?? "idle" }));
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
    treeEdges: sampleEdges,
    ...extra,
  };
}

export function dfsTraversalFrames(): Frame[] {
  const frames: Frame[] = [
    tree("Binary tree", "Same tree, three visit orders. Preorder = node first, inorder = left-node-right, postorder = children then node.", {}),
  ];
  const pre = ["n4", "n2", "n1", "n3", "n6", "n7"];
  const seen: Record<string, CellTone> = {};
  for (const id of pre) {
    seen[id] = "done";
    frames.push(tree(`Preorder · ${layout[id].label}`, "Visit node, then left, then right. Output: 4 2 1 3 6 7", { ...seen, [id]: "active" }, { note: "preorder" }));
  }
  const ino = ["n1", "n2", "n3", "n4", "n6", "n7"];
  const seenI: Record<string, CellTone> = {};
  for (const id of ino) {
    seenI[id] = "done";
    frames.push(tree(`Inorder · ${layout[id].label}`, "Left, node, right. On a BST this is sorted: 1 2 3 4 6 7", { ...seenI, [id]: "active" }, { note: "inorder" }));
  }
  const post = ["n1", "n3", "n2", "n7", "n6", "n4"];
  const seenP: Record<string, CellTone> = {};
  for (const id of post) {
    seenP[id] = "done";
    frames.push(tree(`Postorder · ${layout[id].label}`, "Children first, node last. Useful for deleting a tree or computing heights.", { ...seenP, [id]: "active" }, { note: "postorder" }));
  }
  return frames;
}

export function bfsLevelFrames(): Frame[] {
  const frames: Frame[] = [
    tree("Level order", "Queue starts with the root. Each pop enqueues children — that is BFS on a tree.", {}, { cells: [{ value: "Q:4", tone: "active" }] }),
  ];
  const steps: { vis: string; q: string; cap: string }[] = [
    { vis: "n4", q: "2, 6", cap: "Pop 4. Enqueue left 2 and right 6." },
    { vis: "n2", q: "6, 1, 3", cap: "Pop 2. Enqueue 1 and 3." },
    { vis: "n6", q: "1, 3, 7", cap: "Pop 6. Enqueue 7." },
    { vis: "n1", q: "3, 7", cap: "Pop 1 — a leaf." },
    { vis: "n3", q: "7", cap: "Pop 3." },
    { vis: "n7", q: "∅", cap: "Pop 7. Queue empty. Levels were [4] [2,6] [1,3,7]." },
  ];
  const seen: Record<string, CellTone> = {};
  for (const s of steps) {
    seen[s.vis] = "done";
    frames.push(
      tree(`Visit ${layout[s.vis].label}`, s.cap, { ...seen, [s.vis]: "active" }, {
        cells: [{ value: `Q: ${s.q}`, tone: "window" }],
      }),
    );
  }
  return frames;
}

export function heightDiameterFrames(): Frame[] {
  const frames: Frame[] = [
    tree("Height bottom-up", "Height(leaf)=0 (or 1 depending on convention). Diameter through a node = height(L)+height(R).", {}),
    tree("Leaves", "1, 3, 7 have height 0.", { n1: "done", n3: "done", n7: "done" }),
    tree("Node 2", "height = 1 + max(0,0) = 1. Path 1–2–3 has length 2.", { n1: "done", n3: "done", n2: "active" }),
    tree("Node 6", "height = 1 + height(7) = 1.", { n7: "done", n6: "active" }),
    tree("Root 4", "height = 1 + max(1,1) = 2. Diameter candidate 1+1=2 (edges) via 2–4–6, or 2 via 1–2–3.", { n4: "match", n2: "window", n6: "window" }, { note: "diameter = 4 nodes on 1-2-4-6-7" }),
  ];
  return frames;
}

export function balancedTreeFrames(): Frame[] {
  return [
    tree("Height-balanced?", "At every node |h(L) − h(R)| ≤ 1. Return height, or −1 if a subtree already failed.", {}),
    tree("Leaves OK", "Balance factor 0.", { n1: "done", n3: "done", n7: "done" }),
    tree("Node 2", "|0 − 0| = 0. Balanced. Height 1.", { n2: "match" }),
    tree("Node 6", "Only a right child. |0 − 0| after leaf… height 1, OK.", { n6: "match" }),
    tree("Root", "|1 − 1| = 0. The whole tree is balanced.", { n4: "match", n2: "done", n6: "done" }),
  ];
}

export function lcaFrames(): Frame[] {
  return [
    tree("LCA(1, 7)", "Search for both nodes. If one is in the left subtree and one in the right, the current node is the LCA.", { n1: "lo", n7: "hi" }),
    tree("Down from 4", "1 lives left, 7 lives right — so 4 already splits them.", { n4: "active", n1: "lo", n7: "hi" }),
    tree("LCA is 4", "Lowest node that has both as descendants.", { n4: "match", n1: "done", n7: "done" }),
    tree("LCA(1, 3)", "Both sit under 2. Recurse left; 2 sees them on opposite sides.", { n2: "match", n1: "lo", n3: "hi" }),
  ];
}

export function pathSumFrames(): Frame[] {
  return [
    tree("Target 9", "Subtract the node value as you go down. At a leaf, remaining 0 means success.", { n4: "active" }, { note: "need 9" }),
    tree("Take 4 → need 5", "Go left to 2.", { n4: "window", n2: "active" }, { note: "need 5" }),
    tree("Take 2 → need 3", "Left leaf 1 would leave 2 — fail. Right leaf 3 leaves 0.", { n4: "window", n2: "window", n1: "skip", n3: "active" }, { note: "need 3" }),
    tree("Path 4-2-3", "1+… wait values 4+2+3=9. Found.", { n4: "match", n2: "match", n3: "match" }),
  ];
}

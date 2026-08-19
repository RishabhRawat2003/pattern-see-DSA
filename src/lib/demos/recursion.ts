import type { Frame, TreeNode } from "../types";

export function pickNotPickFrames(): Frame[] {
  const nums = [1, 2, 3];
  const nodes: TreeNode[] = [
    { id: "r", label: "[]  i=0", x: 50, y: 8 },
    { id: "p0", label: "[1]", x: 25, y: 32 },
    { id: "s0", label: "[]", x: 75, y: 32 },
    { id: "p1", label: "[1,2]", x: 12, y: 56 },
    { id: "s1", label: "[1]", x: 38, y: 56 },
    { id: "p2", label: "[2]", x: 62, y: 56 },
    { id: "s2", label: "[]", x: 88, y: 56 },
    { id: "a", label: "[1,2,3]", x: 6, y: 80 },
    { id: "b", label: "[1,2]", x: 18, y: 80 },
    { id: "c", label: "[1,3]", x: 32, y: 80 },
    { id: "d", label: "[1]", x: 44, y: 80 },
    { id: "e", label: "[2,3]", x: 56, y: 80 },
    { id: "f", label: "[2]", x: 68, y: 80 },
    { id: "g", label: "[3]", x: 82, y: 80 },
    { id: "h", label: "[]", x: 94, y: 80 },
  ];
  const edges = [
    { from: "r", to: "p0" },
    { from: "r", to: "s0" },
    { from: "p0", to: "p1" },
    { from: "p0", to: "s1" },
    { from: "s0", to: "p2" },
    { from: "s0", to: "s2" },
    { from: "p1", to: "a" },
    { from: "p1", to: "b" },
    { from: "s1", to: "c" },
    { from: "s1", to: "d" },
    { from: "p2", to: "e" },
    { from: "p2", to: "f" },
    { from: "s2", to: "g" },
    { from: "s2", to: "h" },
  ];
  const order = ["r", "p0", "p1", "a", "b", "s1", "c", "d", "s0", "p2", "e", "f", "s2", "g", "h"];
  const captions: Record<string, string> = {
    r: "Start with an empty subset at index 0. Left child = pick, right child = skip.",
    p0: "Pick 1. Recurse on index 1.",
    p1: "Pick 2 as well. Recurse on index 2.",
    a: "Pick 3. Leaf: subset [1,2,3].",
    b: "Skip 3. Leaf: [1,2]. Backtrack.",
    s1: "From [1], skip 2.",
    c: "Pick 3 → [1,3].",
    d: "Skip 3 → [1].",
    s0: "Back at root: skip 1 entirely.",
    p2: "Pick 2 (without 1).",
    e: "[2,3]",
    f: "[2]",
    s2: "Skip 2 as well.",
    g: "[3]",
    h: "Empty subset. 2^n = 8 leaves.",
  };
  const frames: Frame[] = [];
  const lit = new Set<string>();
  for (const id of order) {
    lit.add(id);
    frames.push({
      kind: "tree",
      title: `Visit ${nodes.find((n) => n.id === id)?.label}`,
      caption: captions[id],
      treeNodes: nodes.map((n) => ({
        ...n,
        tone: n.id === id ? "active" : lit.has(n.id) ? "done" : "idle",
      })),
      treeEdges: edges,
      note: `nums = [${nums.join(", ")}]`,
    });
  }
  return frames;
}

export function recursiveTreeFrames(): Frame[] {
  const nodes: TreeNode[] = [
    { id: "f4", label: "fib(4)", x: 50, y: 10 },
    { id: "f3", label: "fib(3)", x: 28, y: 38 },
    { id: "f2a", label: "fib(2)", x: 72, y: 38 },
    { id: "f2b", label: "fib(2)", x: 14, y: 64 },
    { id: "f1a", label: "fib(1)", x: 42, y: 64 },
    { id: "f1b", label: "fib(1)", x: 60, y: 64 },
    { id: "f0a", label: "fib(0)", x: 84, y: 64 },
    { id: "f1c", label: "fib(1)", x: 6, y: 88 },
    { id: "f0b", label: "fib(0)", x: 22, y: 88 },
  ];
  const edges = [
    { from: "f4", to: "f3" },
    { from: "f4", to: "f2a" },
    { from: "f3", to: "f2b" },
    { from: "f3", to: "f1a" },
    { from: "f2a", to: "f1b" },
    { from: "f2a", to: "f0a" },
    { from: "f2b", to: "f1c" },
    { from: "f2b", to: "f0b" },
  ];
  const order = ["f4", "f3", "f2b", "f1c", "f0b", "f1a", "f2a", "f1b", "f0a"];
  const captions: Record<string, string> = {
    f4: "fib(4) = fib(3) + fib(2). Expand left first.",
    f3: "fib(3) = fib(2) + fib(1).",
    f2b: "fib(2) = fib(1) + fib(0).",
    f1c: "Base case fib(1) = 1.",
    f0b: "Base case fib(0) = 0. Return 1+0 = 1.",
    f1a: "fib(1) = 1. So fib(3) = 1+1 = 2.",
    f2a: "Right child of fib(4) — computed separately. Overlap is why we memoize later.",
    f1b: "fib(1) = 1.",
    f0a: "fib(0) = 0. fib(2)=1, fib(4)=2+1=3.",
  };
  const frames: Frame[] = [];
  const lit = new Set<string>();
  for (const id of order) {
    lit.add(id);
    frames.push({
      kind: "tree",
      title: nodes.find((n) => n.id === id)!.label,
      caption: captions[id],
      treeNodes: nodes.map((n) => ({
        ...n,
        tone: n.id === id ? "active" : lit.has(n.id) ? "done" : "idle",
      })),
      treeEdges: edges,
    });
  }
  return frames;
}

export function backtrackingIntroFrames(): Frame[] {
  const nodes: TreeNode[] = [
    { id: "r", label: "[]", x: 50, y: 12 },
    { id: "a", label: "[1]", x: 28, y: 40 },
    { id: "b", label: "[2]", x: 72, y: 40 },
    { id: "a1", label: "[1,2]", x: 16, y: 70 },
    { id: "a2", label: "[1] undo 2", x: 40, y: 70 },
    { id: "b1", label: "[2,1]", x: 60, y: 70 },
    { id: "b2", label: "[2] undo 1", x: 84, y: 70 },
  ];
  const edges = [
    { from: "r", to: "a" },
    { from: "r", to: "b" },
    { from: "a", to: "a1" },
    { from: "a", to: "a2", dashed: true },
    { from: "b", to: "b1" },
    { from: "b", to: "b2", dashed: true },
  ];
  const script: { id: string; title: string; caption: string }[] = [
    { id: "r", title: "Start", caption: "Path is empty. Choices: pick 1 or pick 2." },
    { id: "a", title: "Choose 1", caption: "Push 1 onto the path. Recurse." },
    { id: "a1", title: "Choose 2", caption: "Path is [1,2] — a complete permutation." },
    { id: "a2", title: "Undo 2", caption: "Pop 2. Path is [1] again. That undo is backtracking." },
    { id: "b", title: "Undo 1, choose 2", caption: "Pop 1, push 2. Explore the sibling branch." },
    { id: "b1", title: "Choose 1", caption: "Path [2,1] — the other permutation." },
    { id: "b2", title: "Undo 1", caption: "Pop back to empty. Search finished." },
  ];
  const frames: Frame[] = [];
  const lit = new Set<string>();
  for (const step of script) {
    lit.add(step.id);
    frames.push({
      kind: "tree",
      title: step.title,
      caption: step.caption,
      treeNodes: nodes.map((n) => ({
        ...n,
        tone: n.id === step.id ? "active" : lit.has(n.id) ? "done" : "idle",
      })),
      treeEdges: edges,
      note: "try → recurse → undo",
    });
  }
  return frames;
}

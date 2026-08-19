import type { CellTone, Frame } from "../types";
import { paint, sampleEdges } from "./trees";

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

export function bstValidationFrames(): Frame[] {
  return [
    tree("Is it a BST?", "Not enough that left < node < right locally. Every node needs a (low, high) bound from ancestors.", {}),
    tree("Root 4", "Window (−∞, +∞). Go left with (−∞, 4), right with (4, +∞).", { n4: "active" }),
    tree("Node 2", "Must be < 4. Children: 1 in (−∞,2), 3 in (2,4).", { n4: "done", n2: "active" }),
    tree("Node 6", "Must be > 4. Child 7 in (6, +∞).", { n6: "active", n4: "done" }),
    tree("Valid BST", "All nodes sit inside their windows. Inorder would be strictly increasing.", { n1: "match", n2: "match", n3: "match", n4: "match", n6: "match", n7: "match" }),
  ];
}

export function bstInsertDeleteFrames(): Frame[] {
  const with5 = paint({ n4: "done", n6: "active" }).concat({
    id: "n5",
    label: "5",
    x: 62,
    y: 72,
    tone: "match" as CellTone,
  });
  return [
    tree("Insert 5", "Compare with 4: 5 > 4, go right. Compare with 6: 5 < 6, go left — empty, attach.", { n4: "active" }),
    tree("Walk right", "5 < 6, left child is null.", { n4: "done", n6: "active" }),
    {
      kind: "tree",
      title: "Attached",
      caption: "5 becomes left child of 6. Delete with two children would copy the inorder successor instead.",
      treeNodes: with5,
      treeEdges: [...sampleEdges, { from: "n6", to: "n5" }],
    },
  ];
}

export function kthSmallestFrames(): Frame[] {
  const order = ["n1", "n2", "n3", "n4", "n6", "n7"];
  const frames: Frame[] = [
    tree("k = 3", "Inorder is sorted. Decrement k at each visit; when k becomes 0, that node is the answer.", {}),
  ];
  let k = 3;
  const seen: Record<string, CellTone> = {};
  for (const id of order) {
    k -= 1;
    seen[id] = "done";
    frames.push(
      tree(
        `Visit · k left ${k}`,
        k === 0 ? "k hit 0 at 3. That is the 3rd smallest." : "Keep walking inorder.",
        { ...seen, [id]: k === 0 ? "match" : "active" },
        { note: `k=${k}` },
      ),
    );
    if (k === 0) break;
  }
  return frames;
}

export function inorderLogicFrames(): Frame[] {
  return [
    tree("Previous pointer", "While inordering, remember the last value. It must be < current, or the BST (or two swaps) is wrong.", {}),
    tree("See 1", "prev = null → set prev = 1.", { n1: "active" }, { note: "prev = 1" }),
    tree("See 2", "1 < 2. OK. prev = 2.", { n1: "done", n2: "active" }, { note: "prev = 2" }),
    tree("See 3", "2 < 3. Gap 1 is the min-diff so far.", { n2: "done", n3: "active" }, { note: "prev = 3" }),
    tree("See 4", "Still increasing. This is how you recover swapped nodes: the two inversions.", { n3: "done", n4: "match" }),
  ];
}

import type { CellTone, Frame, TreeNode } from "../types";

const triePos: TreeNode[] = [
  { id: "rt", label: "·", x: 50, y: 12 },
  { id: "c", label: "c", x: 32, y: 38 },
  { id: "a", label: "a", x: 68, y: 38 },
  { id: "ca", label: "a", x: 32, y: 64 },
  { id: "ap", label: "p", x: 68, y: 64 },
  { id: "cat", label: "t*", x: 32, y: 88 },
  { id: "app", label: "p*", x: 68, y: 88 },
];

const trieEdges = [
  { from: "rt", to: "c" },
  { from: "rt", to: "a" },
  { from: "c", to: "ca" },
  { from: "a", to: "ap" },
  { from: "ca", to: "cat" },
  { from: "ap", to: "app" },
];

function paint(ids: Record<string, CellTone>): TreeNode[] {
  return triePos.map((n) => ({ ...n, tone: ids[n.id] ?? "idle" }));
}

export function trieInsertSearchFrames(): Frame[] {
  return [
    {
      kind: "tree",
      title: "Empty root",
      caption: "Insert walks characters, creating children. * marks a word end.",
      treeNodes: [{ id: "rt", label: "·", x: 50, y: 50 }],
      treeEdges: [],
    },
    {
      kind: "tree",
      title: "Insert CAT",
      caption: "c → a → t*. Search follows the same walk and checks the terminal flag.",
      treeNodes: paint({ rt: "done", c: "window", ca: "window", cat: "match" }),
      treeEdges: [
        { from: "rt", to: "c", tone: "match" },
        { from: "c", to: "ca", tone: "match" },
        { from: "ca", to: "cat", tone: "match" },
      ],
      note: "CAT",
    },
    {
      kind: "tree",
      title: "Search CAP",
      caption: "c → a, then p is missing. Not a word (and not even a prefix of CAT).",
      treeNodes: paint({ rt: "done", c: "window", ca: "skip" }),
      treeEdges: [
        { from: "rt", to: "c", tone: "window" },
        { from: "c", to: "ca", tone: "skip" },
      ],
      note: "not found",
    },
  ];
}

export function wordSearchFrames(): Frame[] {
  return [
    {
      kind: "grid",
      title: "Board",
      caption: "DFS from each cell. A trie (or the target word) prunes dead prefixes.",
      grid: [
        [{ value: "C", tone: "idle" }, { value: "A", tone: "idle" }, { value: "X", tone: "idle" }],
        [{ value: "Z", tone: "idle" }, { value: "T", tone: "idle" }, { value: "P", tone: "idle" }],
      ],
      note: "find CAT",
    },
    {
      kind: "grid",
      title: "C → A",
      caption: "From C, neighbors. A continues the prefix CA.",
      grid: [
        [{ value: "C", tone: "done" }, { value: "A", tone: "active" }, { value: "X", tone: "idle" }],
        [{ value: "Z", tone: "idle" }, { value: "T", tone: "idle" }, { value: "P", tone: "idle" }],
      ],
    },
    {
      kind: "grid",
      title: "A → T",
      caption: "T completes CAT. Mark visited, then unmark on backtrack so other words can reuse cells.",
      grid: [
        [{ value: "C", tone: "match" }, { value: "A", tone: "match" }, { value: "X", tone: "idle" }],
        [{ value: "Z", tone: "idle" }, { value: "T", tone: "match" }, { value: "P", tone: "idle" }],
      ],
      note: "found",
    },
  ];
}

export function autocompleteFrames(): Frame[] {
  return [
    {
      kind: "tree",
      title: "Dict: cat, cap, app",
      caption: "Type prefix \"ca\". Walk to that node, then collect every terminal below it.",
      treeNodes: paint({}),
      treeEdges: trieEdges,
      note: "prefix ca",
    },
    {
      kind: "tree",
      title: "At node ca",
      caption: "Subtree: t* → cat. (cap would hang off the same a if inserted.)",
      treeNodes: paint({ c: "window", ca: "active", cat: "match" }),
      treeEdges: trieEdges.map((e) =>
        e.from === "c" || e.from === "ca" ? { ...e, tone: "match" as CellTone } : e,
      ),
      cells: [{ value: "cat", tone: "match" }],
    },
    {
      kind: "tree",
      title: "Suggestions",
      caption: "DFS/BFS from the prefix node yields the autocomplete list. Rank by stored frequency if you have it.",
      treeNodes: paint({ ca: "done", cat: "match", ap: "window", app: "window" }),
      treeEdges: trieEdges,
      cells: [
        { value: "cat", tone: "match" },
        { value: "app", tone: "window" },
      ],
      note: "ca → cat",
    },
  ];
}

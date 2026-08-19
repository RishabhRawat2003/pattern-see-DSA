import type { CellTone, Frame } from "../types";

export function subsetsFrames(): Frame[] {
  const leaves = ["[]", "[1]", "[2]", "[1,2]", "[3]", "[1,3]", "[2,3]", "[1,2,3]"];
  const frames: Frame[] = [
    {
      kind: "array",
      title: "Power set of [1,2,3]",
      caption: "At each index pick or skip. 2³ = 8 subsets. Record the path at every leaf (or every node).",
      cells: [1, 2, 3].map((value) => ({ value })),
    },
  ];
  for (const s of leaves) {
    frames.push({
      kind: "array",
      title: `Subset ${s}`,
      caption: s === "[1,2,3]" ? "Last leaf. All combinations emitted." : "One leaf of the pick/skip tree.",
      cells: [1, 2, 3].map((value) => ({
        value,
        tone: s.includes(String(value)) ? "match" : "idle",
      })),
      note: s,
    });
  }
  return frames;
}

export function permutationsFrames(): Frame[] {
  const perms = ["123", "132", "213", "231", "312", "321"];
  const frames: Frame[] = [
    {
      kind: "array",
      title: "Permute [1,2,3]",
      caption: "Place an unused number in the next slot, recurse, undo. 3! = 6 permutations.",
      cells: [1, 2, 3].map((value) => ({ value })),
    },
  ];
  for (const p of perms) {
    frames.push({
      kind: "array",
      title: p.split("").join(" · "),
      caption: "A complete permutation. Backtrack and swap in the next unused digit.",
      cells: p.split("").map((value, i) => ({
        value,
        tone: (i === 2 ? "match" : "window") as CellTone,
      })),
    });
  }
  return frames;
}

export function combinationSumFrames(): Frame[] {
  const cand = [2, 3, 6, 7];
  return [
    {
      kind: "array",
      title: "Target 7",
      caption: "Reuse allowed: stay on the same index after picking. Prune when remainder < 0.",
      cells: cand.map((value) => ({ value })),
      note: "target 7",
    },
    {
      kind: "array",
      title: "2+2+3",
      caption: "Pick 2, pick 2, pick 3. Remainder 0. Record and undo the last 3.",
      cells: [
        { value: 2, tone: "match" },
        { value: 2, tone: "match" },
        { value: 3, tone: "match" },
      ],
    },
    {
      kind: "array",
      title: "7",
      caption: "A single 7 also sums to the target. Two combinations.",
      cells: [{ value: 7, tone: "match" }],
    },
  ];
}

function board(cells: string[], highlight: number[] = [], queens: number[] = []): { value: string; tone?: CellTone }[][] {
  const g = Array.from({ length: 4 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => {
      const i = r * 4 + c;
      const q = queens.includes(i);
      return {
        value: q ? "♛" : "",
        tone: (highlight.includes(i) ? "active" : q ? "match" : "idle") as CellTone,
      };
    }),
  );
  void cells;
  return g;
}

export function nQueensFrames(): Frame[] {
  return [
    {
      kind: "grid",
      title: "4-Queens",
      caption: "One queen per row. Ban its column and both diagonals, then try the next row.",
      grid: board([]),
    },
    {
      kind: "grid",
      title: "Row 0, col 1",
      caption: "Place a queen. Columns 1, diagonal attacks become illegal.",
      grid: board([], [1], [1]),
    },
    {
      kind: "grid",
      title: "Row 1, col 3",
      caption: "Valid under the remaining columns.",
      grid: board([], [7], [1, 7]),
    },
    {
      kind: "grid",
      title: "Row 2, col 0",
      caption: "Continue. If a row has no safe square, undo the previous row.",
      grid: board([], [8], [1, 7, 8]),
    },
    {
      kind: "grid",
      title: "Solved",
      caption: "Row 3, col 2. No two queens share a row, column, or diagonal.",
      grid: board([], [], [1, 7, 8, 14]),
    },
  ];
}

export function sudokuSolverFrames(): Frame[] {
  const start = [
    ["1", "2", "", "4"],
    ["3", "", "", "2"],
    ["", "1", "4", ""],
    ["4", "", "2", "1"],
  ];
  const paint = (g: string[][], ar = -1, ac = -1, ok = false) =>
    g.map((row, r) =>
      row.map((value, c) => ({
        value,
        tone: (r === ar && c === ac ? (ok ? "match" : "active") : value ? "done" : "idle") as CellTone,
      })),
    );
  return [
    { kind: "grid", title: "4×4 Sudoku", caption: "Find an empty, try a legal digit, recurse. Same algorithm as 9×9.", grid: paint(start) },
    { kind: "grid", title: "Try 3 at (0,2)", caption: "Row/col/box allow 3. Recurse.", grid: paint([["1","2","3","4"],["3","","","2"],["","1","4",""],["4","","2","1"]], 0, 2) },
    { kind: "grid", title: "Stuck later", caption: "A later cell has no legal digit. Undo 3, try the next candidate.", grid: paint(start, 0, 2, false) },
    { kind: "grid", title: "Filled", caption: "A complete valid grid. Backtracking found it.", grid: paint([["1","2","3","4"],["3","4","1","2"],["2","1","4","3"],["4","3","2","1"]], 3, 1, true) },
  ];
}

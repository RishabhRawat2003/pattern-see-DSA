import type { CellTone, Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function paintBoard(
  g: string[][],
  opts: {
    active?: [number, number];
    bad?: [number, number][];
    good?: [number, number][];
  } = {},
): { value: string; tone?: CellTone }[][] {
  const key = (r: number, c: number) => `${r},${c}`;
  const bad = new Set((opts.bad ?? []).map(([r, c]) => key(r, c)));
  const good = new Set((opts.good ?? []).map(([r, c]) => key(r, c)));
  const [ar, ac] = opts.active ?? [-1, -1];
  return g.map((row, r) =>
    row.map((value, c) => {
      const k = key(r, c);
      let tone: CellTone = value ? "done" : "idle";
      if (bad.has(k)) tone = "skip";
      else if (good.has(k)) tone = "match";
      else if (r === ar && c === ac) tone = "active";
      return { value, tone };
    }),
  );
}

function validSudokuFrames(): Frame[] {
  const board = [
    ["5", "3", "", ""],
    ["6", "", "", ""],
    ["", "9", "8", ""],
    ["8", "", "", "3"],
  ];
  return [
    {
      kind: "grid",
      title: "Validate only",
      caption: "No search — scan once. Track seen digits per row, column, and box. (4×4 toy.)",
      grid: paintBoard(board),
      note: "sets empty",
    },
    {
      kind: "grid",
      title: "Row check",
      caption: "Walk row 0: 5 then 3. Both new → ok. Empty cells skipped.",
      grid: paintBoard(board, { good: [[0, 0], [0, 1]], active: [0, 2] }),
      note: "row0 = {5,3}",
    },
    {
      kind: "grid",
      title: "Column check",
      caption: "Same digit in one column twice → invalid. Here col 0 has 5,6,8 — fine so far.",
      grid: paintBoard(board, { good: [[0, 0], [1, 0], [3, 0]] }),
      note: "col0 = {5,6,8}",
    },
    {
      kind: "grid",
      title: "Box check",
      caption: "Top-left box cells share one set. 5,3,6,9,8 must all be unique inside the box.",
      grid: paintBoard(board, {
        good: [
          [0, 0],
          [0, 1],
          [1, 0],
          [2, 1],
          [2, 2],
        ],
      }),
      note: "box0 ok",
    },
    {
      kind: "grid",
      title: "Duplicate found",
      caption: "If a digit was already in that row/col/box set, return false immediately.",
      grid: paintBoard(
        [
          ["5", "3", "", ""],
          ["6", "", "", ""],
          ["", "9", "8", ""],
          ["5", "", "", "3"],
        ],
        { bad: [[0, 0], [3, 0]], active: [3, 0] },
      ),
      note: "5 twice in col 0 → false",
    },
    {
      kind: "grid",
      title: "All clear → true",
      caption: "Finish the scan with no collisions. O(1) cells on 9×9. Sets (or bitmasks) per unit.",
      grid: paintBoard(board, {
        good: [
          [0, 0],
          [0, 1],
          [1, 0],
          [2, 1],
          [2, 2],
          [3, 0],
          [3, 3],
        ],
      }),
      note: "valid board",
    },
  ];
}

function sudokuSolverFrames(): Frame[] {
  const start = [
    ["5", "3", "", ""],
    ["6", "", "", ""],
    ["", "9", "8", ""],
    ["", "", "", "3"],
  ];
  return [
    {
      kind: "grid",
      title: "Empty cell DFS",
      caption: "Find '.' ; try every legal digit; recurse. Success when no empties remain.",
      grid: paintBoard(start, { active: [0, 2] }),
      note: "first empty (0,2)",
    },
    {
      kind: "grid",
      title: "Place 4",
      caption: "4 is legal for row/col/box. Write it and continue to the next empty.",
      grid: paintBoard(
        [
          ["5", "3", "4", ""],
          ["6", "", "", ""],
          ["", "9", "8", ""],
          ["", "", "", "3"],
        ],
        { active: [0, 2], good: [[0, 2]] },
      ),
      note: "board[0][2] = 4",
    },
    {
      kind: "grid",
      title: "Deeper fill",
      caption: "Keep placing. Constraint checks reuse the Valid Sudoku predicate.",
      grid: paintBoard(
        [
          ["5", "3", "4", "6"],
          ["6", "7", "", ""],
          ["", "9", "8", ""],
          ["", "", "", "3"],
        ],
        { active: [1, 2], good: [[0, 2], [0, 3], [1, 1]] },
      ),
      note: "continue…",
    },
    {
      kind: "grid",
      title: "Dead end",
      caption: "No digit fits the current empty. Undo the last write and try the next candidate.",
      grid: paintBoard(start, { bad: [[0, 2]], active: [0, 2] }),
      note: "clear · next digit",
    },
    {
      kind: "grid",
      title: "Alternate digit",
      caption: "Backtracking explores the digit domain until a full valid assignment appears.",
      grid: paintBoard(
        [
          ["5", "3", "1", ""],
          ["6", "", "", ""],
          ["", "9", "8", ""],
          ["", "", "", "3"],
        ],
        { active: [0, 2], good: [[0, 2]] },
      ),
      note: "try 1 instead",
    },
    {
      kind: "grid",
      title: "Solved board",
      caption: "dfs returns true up the stack; board is mutated in place.",
      grid: paintBoard(
        [
          ["5", "3", "4", "6"],
          ["6", "7", "2", "1"],
          ["1", "9", "8", "5"],
          ["8", "2", "5", "3"],
        ],
        {
          good: [
            [0, 2],
            [0, 3],
            [1, 1],
            [1, 2],
            [1, 3],
            [2, 0],
            [2, 3],
            [3, 0],
            [3, 1],
            [3, 2],
          ],
        },
      ),
      note: "done",
    },
  ];
}

function nQueensFromSudokuFrames(): Frame[] {
  function board(
    queens: number[],
    highlight: number[] = [],
  ): { value: string; tone?: CellTone }[][] {
    return Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => {
        const i = r * 4 + c;
        const q = queens.includes(i);
        return {
          value: q ? "♛" : "",
          tone: (highlight.includes(i) ? "active" : q ? "match" : "idle") as CellTone,
        };
      }),
    );
  }
  return [
    {
      kind: "grid",
      title: "Constraint cousin",
      caption: "Sudoku bans digits in row/col/box; N-Queens bans queens in col/diag. Same place→recurse→undo.",
      grid: board([]),
      note: "n = 4",
    },
    {
      kind: "grid",
      title: "One per row",
      caption: "Like filling the next empty Sudoku cell: for this row, try each column.",
      grid: board([1], [1]),
      note: "row 0 · col 1",
    },
    {
      kind: "grid",
      title: "Legality = sets",
      caption: "cols / (r-c) / (r+c) play the role of Sudoku's three unit maps.",
      grid: board([1, 7], [7]),
      note: "row 1 · col 3",
    },
    {
      kind: "grid",
      title: "Fail → erase",
      caption: "If the next row has no safe square, remove the last queen — identical to clearing a digit.",
      grid: board([1], [3]),
      note: "backtrack row 1",
    },
    {
      kind: "grid",
      title: "Complete placement",
      caption: "Four queens with no shared attack line. Record (or count) like a finished Sudoku.",
      grid: board([1, 7, 8, 14]),
      note: "solution",
    },
    {
      kind: "grid",
      title: "Shared pattern",
      caption: "Both are exact-cover style DFS with local constraints and undo.",
      grid: board([2, 4, 11, 13]),
      note: "another solution",
    },
  ];
}

export const validSudokuSolution: ProblemSolution = {
  approach:
    "One pass: for each filled cell, check membership in row[r], col[c], and box[r/3*3+c/3] sets (or bitmasks). Duplicate → false. O(1) for 9×9.",
  templates: langs(
    `def isValidSudoku(board):
    rows, cols, boxes = [set() for _ in range(9)], [set() for _ in range(9)], [set() for _ in range(9)]
    for r in range(9):
        for c in range(9):
            ch = board[r][c]
            if ch == ".": continue
            b = (r // 3) * 3 + c // 3
            if ch in rows[r] or ch in cols[c] or ch in boxes[b]:
                return False
            rows[r].add(ch); cols[c].add(ch); boxes[b].add(ch)
    return True`,
    `bool isValidSudoku(vector<vector<char>>& board) {
    vector<unordered_set<char>> rows(9), cols(9), boxes(9);
    for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
        char ch = board[r][c];
        if (ch == '.') continue;
        int b = (r / 3) * 3 + c / 3;
        if (rows[r].count(ch) || cols[c].count(ch) || boxes[b].count(ch)) return false;
        rows[r].insert(ch); cols[c].insert(ch); boxes[b].insert(ch);
    }
    return true;
}`,
    `boolean isValidSudoku(char[][] board) {
    List<Set<Character>> rows = new ArrayList<>(), cols = new ArrayList<>(), boxes = new ArrayList<>();
    for (int i = 0; i < 9; i++) {
        rows.add(new HashSet<>()); cols.add(new HashSet<>()); boxes.add(new HashSet<>());
    }
    for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
        char ch = board[r][c];
        if (ch == '.') continue;
        int b = (r / 3) * 3 + c / 3;
        if (!rows.get(r).add(ch) || !cols.get(c).add(ch) || !boxes.get(b).add(ch)) return false;
    }
    return true;
}`,
    `function isValidSudoku(board) {
  const rows = Array.from({ length: 9 }, () => new Set());
  const cols = Array.from({ length: 9 }, () => new Set());
  const boxes = Array.from({ length: 9 }, () => new Set());
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    const ch = board[r][c];
    if (ch === ".") continue;
    const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    if (rows[r].has(ch) || cols[c].has(ch) || boxes[b].has(ch)) return false;
    rows[r].add(ch); cols[c].add(ch); boxes[b].add(ch);
  }
  return true;
}`,
  ),
  frames: validSudokuFrames(),
};

export const sudokuSolverSolution: ProblemSolution = {
  approach:
    "DFS: find '.', try digits that pass row/col/box checks, place, recurse; on failure clear and try next. Return true when the board is full. O(9^{empties}) worst.",
  templates: langs(
    `def solveSudoku(board):
    def ok(r, c, ch):
        br, bc = 3 * (r // 3), 3 * (c // 3)
        for i in range(9):
            if board[r][i] == ch or board[i][c] == ch: return False
            if board[br + i // 3][bc + i % 3] == ch: return False
        return True
    def dfs():
        for r in range(9):
            for c in range(9):
                if board[r][c] != ".": continue
                for ch in "123456789":
                    if not ok(r, c, ch): continue
                    board[r][c] = ch
                    if dfs(): return True
                    board[r][c] = "."
                return False
        return True
    dfs()`,
    `bool ok(vector<vector<char>>& b, int r, int c, char ch) {
    int br = 3 * (r / 3), bc = 3 * (c / 3);
    for (int i = 0; i < 9; i++) {
        if (b[r][i] == ch || b[i][c] == ch) return false;
        if (b[br + i / 3][bc + i % 3] == ch) return false;
    }
    return true;
}
bool dfs(vector<vector<char>>& b) {
    for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
        if (b[r][c] != '.') continue;
        for (char ch = '1'; ch <= '9'; ch++) {
            if (!ok(b, r, c, ch)) continue;
            b[r][c] = ch; if (dfs(b)) return true; b[r][c] = '.';
        }
        return false;
    }
    return true;
}
void solveSudoku(vector<vector<char>>& board) { dfs(board); }`,
    `boolean ok(char[][] b, int r, int c, char ch) {
    int br = 3 * (r / 3), bc = 3 * (c / 3);
    for (int i = 0; i < 9; i++) {
        if (b[r][i] == ch || b[i][c] == ch) return false;
        if (b[br + i / 3][bc + i % 3] == ch) return false;
    }
    return true;
}
boolean dfs(char[][] b) {
    for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
        if (b[r][c] != '.') continue;
        for (char ch = '1'; ch <= '9'; ch++) {
            if (!ok(b, r, c, ch)) continue;
            b[r][c] = ch; if (dfs(b)) return true; b[r][c] = '.';
        }
        return false;
    }
    return true;
}
void solveSudoku(char[][] board) { dfs(board); }`,
    `function solveSudoku(board) {
  function ok(r, c, ch) {
    const br = 3 * Math.floor(r / 3), bc = 3 * Math.floor(c / 3);
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === ch || board[i][c] === ch) return false;
      if (board[br + Math.floor(i / 3)][bc + i % 3] === ch) return false;
    }
    return true;
  }
  function dfs() {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (board[r][c] !== ".") continue;
      for (const ch of "123456789") {
        if (!ok(r, c, ch)) continue;
        board[r][c] = ch; if (dfs()) return true; board[r][c] = ".";
      }
      return false;
    }
    return true;
  }
  dfs();
}`,
  ),
  frames: sudokuSolverFrames(),
};

export const nQueensFromSudokuSolution: ProblemSolution = {
  approach:
    "Row-wise DFS: try columns not in cols / diag / anti sets; place queen, recurse, undo. Same backtracking spine as Sudoku filling. O(n!) search.",
  templates: langs(
    `def solveNQueens(n):
    cols, d1, d2, board, out = set(), set(), set(), [], []
    def dfs(r):
        if r == n:
            out.append(["." * c + "Q" + "." * (n - c - 1) for c in board]); return
        for c in range(n):
            if c in cols or r - c in d1 or r + c in d2: continue
            cols.add(c); d1.add(r - c); d2.add(r + c); board.append(c)
            dfs(r + 1)
            board.pop(); cols.remove(c); d1.remove(r - c); d2.remove(r + c)
    dfs(0)
    return out`,
    `vector<vector<string>> solveNQueens(int n) {
    unordered_set<int> cols, d1, d2; vector<int> board; vector<vector<string>> out;
    function<void(int)> dfs = [&](int r) {
        if (r == n) {
            vector<string> rows;
            for (int c : board) rows.push_back(string(c, '.') + "Q" + string(n - c - 1, '.'));
            out.push_back(rows); return;
        }
        for (int c = 0; c < n; c++) {
            if (cols.count(c) || d1.count(r - c) || d2.count(r + c)) continue;
            cols.insert(c); d1.insert(r - c); d2.insert(r + c); board.push_back(c);
            dfs(r + 1);
            board.pop_back(); cols.erase(c); d1.erase(r - c); d2.erase(r + c);
        }
    };
    dfs(0); return out;
}`,
    `List<List<String>> solveNQueens(int n) {
    Set<Integer> cols = new HashSet<>(), d1 = new HashSet<>(), d2 = new HashSet<>();
    List<Integer> board = new ArrayList<>();
    List<List<String>> out = new ArrayList<>();
    class D { void dfs(int r) {
        if (r == n) {
            List<String> rows = new ArrayList<>();
            for (int c : board) {
                char[] row = new char[n]; Arrays.fill(row, '.'); row[c] = 'Q';
                rows.add(new String(row));
            }
            out.add(rows); return;
        }
        for (int c = 0; c < n; c++) {
            if (cols.contains(c) || d1.contains(r - c) || d2.contains(r + c)) continue;
            cols.add(c); d1.add(r - c); d2.add(r + c); board.add(c);
            dfs(r + 1);
            board.remove(board.size() - 1); cols.remove(c); d1.remove(r - c); d2.remove(r + c);
        }
    }}
    new D().dfs(0); return out;
}`,
    `function solveNQueens(n) {
  const cols = new Set(), d1 = new Set(), d2 = new Set(), board = [], out = [];
  function dfs(r) {
    if (r === n) {
      out.push(board.map(c => ".".repeat(c) + "Q" + ".".repeat(n - c - 1)));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
      cols.add(c); d1.add(r - c); d2.add(r + c); board.push(c);
      dfs(r + 1);
      board.pop(); cols.delete(c); d1.delete(r - c); d2.delete(r + c);
    }
  }
  dfs(0);
  return out;
}`,
  ),
  frames: nQueensFromSudokuFrames(),
};

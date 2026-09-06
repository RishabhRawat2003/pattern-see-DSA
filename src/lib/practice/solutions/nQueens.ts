import type { CellTone, Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function queenBoard(
  n: number,
  queens: number[],
  highlight: number[] = [],
  banned: number[] = [],
): { value: string; tone?: CellTone }[][] {
  return Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => {
      const i = r * n + c;
      const q = queens.includes(i);
      return {
        value: q ? "♛" : "",
        tone: (highlight.includes(i)
          ? "active"
          : banned.includes(i)
            ? "skip"
            : q
              ? "match"
              : "idle") as CellTone,
      };
    }),
  );
}

function nQueensFrames(): Frame[] {
  return [
    {
      kind: "grid",
      title: "4-Queens",
      caption: "One queen per row. Ban its column and both diagonals, then try the next row.",
      grid: queenBoard(4, []),
      note: "row 0 · try cols",
    },
    {
      kind: "grid",
      title: "Row 0, col 1",
      caption: "Place ♛. Column 1 and diagonals through (0,1) become illegal for later rows.",
      grid: queenBoard(4, [1], [1], [5, 6, 9, 11]),
      note: "cols={1} · diags set",
    },
    {
      kind: "grid",
      title: "Row 1, col 3",
      caption: "Safe under remaining columns. Place and tighten bans again.",
      grid: queenBoard(4, [1, 7], [7]),
      note: "board cols [1,3]",
    },
    {
      kind: "grid",
      title: "Row 2 stuck?",
      caption: "Try col 0 — may work. If a row has no safe square, undo the previous placement.",
      grid: queenBoard(4, [1, 7], [8], [9, 10, 11]),
      note: "trying (2,0)",
    },
    {
      kind: "grid",
      title: "Row 2, col 0",
      caption: "Valid. Three queens down; one row left.",
      grid: queenBoard(4, [1, 7, 8], [8]),
      note: "cols [1,3,0]",
    },
    {
      kind: "grid",
      title: "Solved",
      caption: "Row 3, col 2. No two share a row, column, or diagonal. Record the board.",
      grid: queenBoard(4, [1, 7, 8, 14]),
      note: "solution · backtrack for more",
    },
    {
      kind: "grid",
      title: "Undo & search on",
      caption: "Pop row 3 / row 2 choices to find the other distinct 4-queens layout.",
      grid: queenBoard(4, [1], [1], [4, 5, 6]),
      note: "explore sibling cols",
    },
  ];
}

function nQueensIIFrames(): Frame[] {
  return [
    {
      kind: "grid",
      title: "Count, don't build",
      caption: "Same constraints as N-Queens, but increment a counter at depth n instead of copying boards.",
      grid: queenBoard(4, []),
      note: "ans = 0",
    },
    {
      kind: "grid",
      title: "Place → recurse",
      caption: "Row 0 col 1. Track cols / diag sets exactly like the construction version.",
      grid: queenBoard(4, [1], [1]),
      note: "depth 1",
    },
    {
      kind: "grid",
      title: "Leaf = +1",
      caption: "When r == n, ans++. No string board needed — pure feasibility DFS.",
      grid: queenBoard(4, [1, 7, 8, 14]),
      note: "ans = 1",
    },
    {
      kind: "grid",
      title: "Second solution",
      caption: "Backtracking finds the mirrored layout. Count becomes 2 for n=4.",
      grid: queenBoard(4, [2, 4, 11, 13]),
      note: "ans = 2",
    },
    {
      kind: "grid",
      title: "Bitmasks optional",
      caption: "cols, diag, anti as bitsets speed constant factors; the decision tree is identical.",
      grid: queenBoard(4, [2, 4, 11, 13], [], []),
      note: "n=4 → 2 ways",
    },
    {
      kind: "grid",
      title: "Return the count",
      caption: "Interview ask: how many distinct solutions? Same prune, smaller output.",
      grid: queenBoard(4, []),
      note: "return ans",
    },
  ];
}

function sudokuFromNQueensFrames(): Frame[] {
  const start = [
    ["5", "3", "", ""],
    ["6", "", "", ""],
    ["", "9", "8", ""],
    ["", "", "", "3"],
  ];
  const paint = (
    g: string[][],
    ar = -1,
    ac = -1,
    tone: CellTone = "active",
  ) =>
    g.map((row, r) =>
      row.map((value, c) => ({
        value,
        tone: (r === ar && c === ac
          ? tone
          : value
            ? "done"
            : "idle") as CellTone,
      })),
    );

  return [
    {
      kind: "grid",
      title: "Same choose→undo",
      caption: "Like N-Queens: try a legal digit in an empty cell, recurse, erase on failure. (4×4 toy box.)",
      grid: paint(start),
      note: "find next empty",
    },
    {
      kind: "grid",
      title: "Try 1 at (0,2)",
      caption: "Row/col/box allow 1. Place and dive — same as placing a queen in a safe square.",
      grid: paint(
        [
          ["5", "3", "1", ""],
          ["6", "", "", ""],
          ["", "9", "8", ""],
          ["", "", "", "3"],
        ],
        0,
        2,
      ),
      note: "place · recurse",
    },
    {
      kind: "grid",
      title: "Conflict later",
      caption: "A deeper cell has no legal digit. Undo 1 — exactly like removing a queen when the next row fails.",
      grid: paint(start, 0, 2, "skip"),
      note: "backtrack",
    },
    {
      kind: "grid",
      title: "Try 4 instead",
      caption: "Next candidate in the domain. Constraint sets (row/col/box) replace cols/diags.",
      grid: paint(
        [
          ["5", "3", "4", ""],
          ["6", "", "", ""],
          ["", "9", "8", ""],
          ["", "", "", "3"],
        ],
        0,
        2,
        "match",
      ),
      note: "new branch",
    },
    {
      kind: "grid",
      title: "Fill completes",
      caption: "Valid full grid. Constraint search = N-Queens with a richer legality check.",
      grid: paint(
        [
          ["5", "3", "4", "6"],
          ["6", "7", "2", "1"],
          ["1", "9", "8", "5"],
          ["8", "2", "5", "3"],
        ],
        3,
        2,
        "match",
      ),
      note: "solved",
    },
  ];
}

export const nQueensSolution: ProblemSolution = {
  approach:
    "DFS by row: try each column; skip if col or diag (r-c) or anti (r+c) used. Place, recurse, undo. O(n!) search, O(n) sets.",
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
  frames: nQueensFrames(),
};

export const nQueensIISolution: ProblemSolution = {
  approach:
    "Identical N-Queens search; at depth n increment ans instead of building boards. Return the count. O(n!) time, O(n) space.",
  templates: langs(
    `def totalNQueens(n):
    cols, d1, d2 = set(), set(), set()
    def dfs(r):
        if r == n: return 1
        ans = 0
        for c in range(n):
            if c in cols or r - c in d1 or r + c in d2: continue
            cols.add(c); d1.add(r - c); d2.add(r + c)
            ans += dfs(r + 1)
            cols.remove(c); d1.remove(r - c); d2.remove(r + c)
        return ans
    return dfs(0)`,
    `int totalNQueens(int n) {
    unordered_set<int> cols, d1, d2;
    function<int(int)> dfs = [&](int r) {
        if (r == n) return 1;
        int ans = 0;
        for (int c = 0; c < n; c++) {
            if (cols.count(c) || d1.count(r - c) || d2.count(r + c)) continue;
            cols.insert(c); d1.insert(r - c); d2.insert(r + c);
            ans += dfs(r + 1);
            cols.erase(c); d1.erase(r - c); d2.erase(r + c);
        }
        return ans;
    };
    return dfs(0);
}`,
    `int totalNQueens(int n) {
    Set<Integer> cols = new HashSet<>(), d1 = new HashSet<>(), d2 = new HashSet<>();
    return new Object() {
        int dfs(int r) {
            if (r == n) return 1;
            int ans = 0;
            for (int c = 0; c < n; c++) {
                if (cols.contains(c) || d1.contains(r - c) || d2.contains(r + c)) continue;
                cols.add(c); d1.add(r - c); d2.add(r + c);
                ans += dfs(r + 1);
                cols.remove(c); d1.remove(r - c); d2.remove(r + c);
            }
            return ans;
        }
    }.dfs(0);
}`,
    `function totalNQueens(n) {
  const cols = new Set(), d1 = new Set(), d2 = new Set();
  function dfs(r) {
    if (r === n) return 1;
    let ans = 0;
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
      cols.add(c); d1.add(r - c); d2.add(r + c);
      ans += dfs(r + 1);
      cols.delete(c); d1.delete(r - c); d2.delete(r + c);
    }
    return ans;
  }
  return dfs(0);
}`,
  ),
  frames: nQueensIIFrames(),
};

export const sudokuSolverNQueensPackSolution: ProblemSolution = {
  approach:
    "Find an empty cell; try digits 1–9 legal for row/col/box; place, recurse, clear on failure. Same choose→undo skeleton as N-Queens. O(9^{empties}) worst.",
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
  frames: sudokuFromNQueensFrames(),
};

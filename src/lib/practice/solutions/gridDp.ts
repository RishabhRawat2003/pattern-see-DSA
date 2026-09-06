import type { CellTone, Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function gridFrame(
  title: string,
  caption: string,
  rows: (string | number)[][],
  hot: [number, number][] = [],
  extra: Partial<Frame> = {},
): Frame {
  const marks = new Set(hot.map(([r, c]) => `${r},${c}`));
  return {
    kind: "grid",
    title,
    caption,
    grid: rows.map((row, r) =>
      row.map((value, c) => ({
        value: String(value),
        tone: (marks.has(`${r},${c}`) ? "active" : "idle") as CellTone,
      })),
    ),
    ...extra,
  };
}

export const minimumPathSumGridSolution: ProblemSolution = {
  approach:
    "In-place DP: only right/down moves. Each cell adds min(up, left); borders are forced prefix sums. Answer is bottom-right. O(mn) time, O(1) extra space.",
  templates: langs(
    `def minPathSum(grid):
    m, n = len(grid), len(grid[0])
    for r in range(m):
        for c in range(n):
            if r == c == 0:
                continue
            up = grid[r - 1][c] if r else 10**18
            left = grid[r][c - 1] if c else 10**18
            grid[r][c] += min(up, left)
    return grid[-1][-1]`,
    `int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    const long long INF = 1e18;
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (r == 0 && c == 0) continue;
            long long up = r ? grid[r - 1][c] : INF;
            long long left = c ? grid[r][c - 1] : INF;
            grid[r][c] += (int)min(up, left);
        }
    }
    return grid[m - 1][n - 1];
}`,
    `int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    long INF = (long)1e18;
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (r == 0 && c == 0) continue;
            long up = r > 0 ? grid[r - 1][c] : INF;
            long left = c > 0 ? grid[r][c - 1] : INF;
            grid[r][c] += (int)Math.min(up, left);
        }
    }
    return grid[m - 1][n - 1];
}`,
    `function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  const INF = 1e18;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (r === 0 && c === 0) continue;
      const up = r ? grid[r - 1][c] : INF;
      const left = c ? grid[r][c - 1] : INF;
      grid[r][c] += Math.min(up, left);
    }
  }
  return grid[m - 1][n - 1];
}`,
  ),
  frames: [
    gridFrame(
      "Costs",
      "Min path, only right/down. dp = cost + min(up, left).",
      [
        [1, 3, 1],
        [1, 5, 1],
        [4, 2, 1],
      ],
      [[0, 0]],
      { note: "start 1" },
    ),
    gridFrame(
      "First row",
      "Forced left→right: 1, 1+3=4, 4+1=5.",
      [
        [1, 4, 5],
        [1, "·", "·"],
        [4, "·", "·"],
      ],
      [[0, 2]],
    ),
    gridFrame(
      "First column",
      "Forced top→bottom: 1, 1+1=2, 2+4=6.",
      [
        [1, 4, 5],
        [2, "·", "·"],
        [6, "·", "·"],
      ],
      [[2, 0]],
    ),
    gridFrame(
      "Interior (1,1)",
      "5 + min(4, 2) = 7.",
      [
        [1, 4, 5],
        [2, 7, "·"],
        [6, "·", "·"],
      ],
      [[1, 1]],
      { note: "dp=7" },
    ),
    gridFrame(
      "Fill rest",
      "(1,2)=1+min(5,7)=6. (2,1)=2+min(7,6)=8.",
      [
        [1, 4, 5],
        [2, 7, 6],
        [6, 8, "·"],
      ],
      [[1, 2], [2, 1]],
    ),
    gridFrame(
      "Answer",
      "1 + min(6, 8) = 7. Path 1→3→1→1→1.",
      [
        [1, 4, 5],
        [2, 7, 6],
        [6, 8, 7],
      ],
      [[2, 2]],
      { note: "min 7" },
    ),
  ],
};

export const uniquePathsGridSolution: ProblemSolution = {
  approach:
    "dp[r][c] = ways from top-left with only right/down. First row and column are all 1s; interior is up + left. O(mn) time; can compress to one row.",
  templates: langs(
    `def uniquePaths(m, n):
    dp = [1] * n
    for _ in range(1, m):
        for c in range(1, n):
            dp[c] += dp[c - 1]
    return dp[-1]`,
    `int uniquePaths(int m, int n) {
    vector<int> dp(n, 1);
    for (int r = 1; r < m; r++)
        for (int c = 1; c < n; c++)
            dp[c] += dp[c - 1];
    return dp[n - 1];
}`,
    `int uniquePaths(int m, int n) {
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int r = 1; r < m; r++)
        for (int c = 1; c < n; c++)
            dp[c] += dp[c - 1];
    return dp[n - 1];
}`,
    `function uniquePaths(m, n) {
  const dp = Array(n).fill(1);
  for (let r = 1; r < m; r++)
    for (let c = 1; c < n; c++)
      dp[c] += dp[c - 1];
  return dp[n - 1];
}`,
  ),
  frames: [
    gridFrame(
      "3×3 paths",
      "Only right or down. Borders are 1 — one way along the edge.",
      [
        [1, 1, 1],
        [1, "·", "·"],
        [1, "·", "·"],
      ],
      [[0, 0]],
      { note: "m=3 n=3" },
    ),
    gridFrame(
      "Fill (1,1)",
      "ways = up + left = 1 + 1 = 2.",
      [
        [1, 1, 1],
        [1, 2, "·"],
        [1, "·", "·"],
      ],
      [[1, 1]],
    ),
    gridFrame(
      "Fill (1,2)",
      "1 + 2 = 3 ways to the top-right of the middle row.",
      [
        [1, 1, 1],
        [1, 2, 3],
        [1, "·", "·"],
      ],
      [[1, 2]],
    ),
    gridFrame(
      "Fill (2,1)",
      "2 + 1 = 3 along the bottom-left interior.",
      [
        [1, 1, 1],
        [1, 2, 3],
        [1, 3, "·"],
      ],
      [[2, 1]],
    ),
    gridFrame(
      "Answer",
      "Bottom-right = 3 + 3 = 6 unique paths.",
      [
        [1, 1, 1],
        [1, 2, 3],
        [1, 3, 6],
      ],
      [[2, 2]],
      { note: "6 paths" },
    ),
  ],
};

export const dungeonGameSolution: ProblemSolution = {
  approach:
    "Work backward from the princess: dp[r][c] = min HP needed entering this cell so you never go below 1. Need max(1, min(right, down) − dungeon). O(mn).",
  templates: langs(
    `def calculateMinimumHP(dungeon):
    m, n = len(dungeon), len(dungeon[0])
    dp = [[10**18] * (n + 1) for _ in range(m + 1)]
    dp[m][n - 1] = dp[m - 1][n] = 1
    for r in range(m - 1, -1, -1):
        for c in range(n - 1, -1, -1):
            need = min(dp[r + 1][c], dp[r][c + 1]) - dungeon[r][c]
            dp[r][c] = 1 if need <= 0 else need
    return dp[0][0]`,
    `int calculateMinimumHP(vector<vector<int>>& dungeon) {
    int m = dungeon.size(), n = dungeon[0].size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 1e9));
    dp[m][n - 1] = dp[m - 1][n] = 1;
    for (int r = m - 1; r >= 0; r--) {
        for (int c = n - 1; c >= 0; c--) {
            int need = min(dp[r + 1][c], dp[r][c + 1]) - dungeon[r][c];
            dp[r][c] = need <= 0 ? 1 : need;
        }
    }
    return dp[0][0];
}`,
    `int calculateMinimumHP(int[][] dungeon) {
    int m = dungeon.length, n = dungeon[0].length;
    int[][] dp = new int[m + 1][n + 1];
    for (int[] row : dp) Arrays.fill(row, (int)1e9);
    dp[m][n - 1] = dp[m - 1][n] = 1;
    for (int r = m - 1; r >= 0; r--) {
        for (int c = n - 1; c >= 0; c--) {
            int need = Math.min(dp[r + 1][c], dp[r][c + 1]) - dungeon[r][c];
            dp[r][c] = need <= 0 ? 1 : need;
        }
    }
    return dp[0][0];
}`,
    `function calculateMinimumHP(dungeon) {
  const m = dungeon.length, n = dungeon[0].length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(1e9));
  dp[m][n - 1] = dp[m - 1][n] = 1;
  for (let r = m - 1; r >= 0; r--) {
    for (let c = n - 1; c >= 0; c--) {
      const need = Math.min(dp[r + 1][c], dp[r][c + 1]) - dungeon[r][c];
      dp[r][c] = need <= 0 ? 1 : need;
    }
  }
  return dp[0][0];
}`,
  ),
  frames: [
    gridFrame(
      "Dungeon",
      "Negative = damage, positive = heal. Must stay HP ≥ 1 at every cell.",
      [
        [-2, -3, 3],
        [-5, -10, 1],
        [10, 30, -5],
      ],
      [[0, 0]],
      { note: "knight → princess" },
    ),
    gridFrame(
      "Start from end",
      "Princess cell −5: need 6 HP before taking damage so you finish at 1.",
      [
        ["·", "·", "·"],
        ["·", "·", "·"],
        ["·", "·", 6],
      ],
      [[2, 2]],
      { note: "need 6" },
    ),
    gridFrame(
      "Bottom row leftward",
      "30 heals → need 1. 10 heals → need 1. Always clamp to ≥ 1.",
      [
        ["·", "·", "·"],
        ["·", "·", "·"],
        [1, 1, 6],
      ],
      [[2, 0], [2, 1]],
    ),
    gridFrame(
      "Right column upward",
      "Cell 1: need max(1, min(6,…) − 1). Fill toward the start.",
      [
        ["·", "·", 2],
        ["·", "·", 5],
        [1, 1, 6],
      ],
      [[0, 2], [1, 2]],
    ),
    gridFrame(
      "Interior −10",
      "min(right=5, down=1) − (−10) → need 11 HP entering this cell.",
      [
        ["·", "·", 2],
        ["·", 11, 5],
        [1, 1, 6],
      ],
      [[1, 1]],
      { note: "need 11" },
    ),
    gridFrame(
      "Answer",
      "Top-left needs 7. Path chosen so min required HP is minimized.",
      [
        [7, 5, 2],
        [6, 11, 5],
        [1, 1, 6],
      ],
      [[0, 0]],
      { note: "HP = 7" },
    ),
  ],
};

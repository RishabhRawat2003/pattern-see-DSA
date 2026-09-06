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

function gridTones(
  title: string,
  caption: string,
  rows: (string | number)[][],
  tones: Record<string, CellTone>,
  extra: Partial<Frame> = {},
): Frame {
  return {
    kind: "grid",
    title,
    caption,
    grid: rows.map((row, r) =>
      row.map((value, c) => ({
        value: String(value),
        tone: tones[`${r},${c}`] ?? ("idle" as CellTone),
      })),
    ),
    ...extra,
  };
}

export const uniquePathsSolution: ProblemSolution = {
  approach:
    "Grid DP: only right/down. dp[r][c] = dp[r−1][c] + dp[r][c−1]; first row/col = 1. Compress to 1D row. O(mn) time, O(n) space.",
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
    for (let c = 1; c < n; c++) dp[c] += dp[c - 1];
  return dp[n - 1];
}`,
  ),
  frames: [
    gridFrame(
      "3×3 paths",
      "Only right or down. First row and column are all 1s.",
      [
        [1, 1, 1],
        [1, "·", "·"],
        [1, "·", "·"],
      ],
      [[0, 0]],
      { note: "start (0,0)" },
    ),
    gridFrame(
      "Fill (1,1)",
      "dp = up + left = 1+1 = 2 ways into the center.",
      [
        [1, 1, 1],
        [1, 2, "·"],
        [1, "·", "·"],
      ],
      [[1, 1]],
      { note: "2 = 1+1" },
    ),
    gridFrame(
      "Fill (1,2)",
      "1 + 2 = 3 ways along the middle row end.",
      [
        [1, 1, 1],
        [1, 2, 3],
        [1, "·", "·"],
      ],
      [[1, 2]],
    ),
    gridFrame(
      "Fill (2,1)",
      "1 + 2 = 3 down the middle column.",
      [
        [1, 1, 1],
        [1, 2, 3],
        [1, 3, "·"],
      ],
      [[2, 1]],
    ),
    gridFrame(
      "Finish",
      "Bottom-right = 3+3 = 6 unique paths.",
      [
        [1, 1, 1],
        [1, 2, 3],
        [1, 3, 6],
      ],
      [[2, 2]],
      { note: "return 6" },
    ),
  ],
};

export const uniquePathsIISolution: ProblemSolution = {
  approach:
    "Same path DP but obstacles force dp=0 and block contribution. Handle first cell/row/col carefully. O(mn).",
  templates: langs(
    `def uniquePathsWithObstacles(grid):
    if grid[0][0] == 1: return 0
    m, n = len(grid), len(grid[0])
    dp = [0] * n
    dp[0] = 1
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 1:
                dp[c] = 0
            elif c > 0:
                dp[c] += dp[c - 1]
    return dp[-1]`,
    `int uniquePathsWithObstacles(vector<vector<int>>& grid) {
    if (grid[0][0] == 1) return 0;
    int m = grid.size(), n = grid[0].size();
    vector<int> dp(n);
    dp[0] = 1;
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 1) dp[c] = 0;
            else if (c > 0) dp[c] += dp[c - 1];
        }
    }
    return dp[n - 1];
}`,
    `int uniquePathsWithObstacles(int[][] grid) {
    if (grid[0][0] == 1) return 0;
    int m = grid.length, n = grid[0].length;
    int[] dp = new int[n];
    dp[0] = 1;
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 1) dp[c] = 0;
            else if (c > 0) dp[c] += dp[c - 1];
        }
    }
    return dp[n - 1];
}`,
    `function uniquePathsWithObstacles(grid) {
  if (grid[0][0] === 1) return 0;
  const m = grid.length, n = grid[0].length;
  const dp = Array(n).fill(0);
  dp[0] = 1;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1) dp[c] = 0;
      else if (c > 0) dp[c] += dp[c - 1];
    }
  }
  return dp[n - 1];
}`,
  ),
  frames: [
    gridTones(
      "Obstacle grid",
      "1 marks a blocked cell. Paths may only step on 0s.",
      [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
      { "1,1": "skip" },
      { note: "center blocked" },
    ),
    gridFrame(
      "Borders",
      "First row/col stay 1 until an obstacle zeros the rest of that line.",
      [
        [1, 1, 1],
        [1, "·", "·"],
        [1, "·", "·"],
      ],
      [[0, 2], [2, 0]],
    ),
    gridTones(
      "Hit obstacle",
      "Center becomes 0 — no paths through it. Right-of-center middle gets only from above.",
      [
        [1, 1, 1],
        [1, 0, 1],
        [1, "·", "·"],
      ],
      { "1,1": "skip", "1,2": "active" },
      { note: "dp[1][2]=1" },
    ),
    gridFrame(
      "Bottom middle",
      "Up is blocked (0); only left contributes → 1.",
      [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, "·"],
      ],
      [[2, 1]],
      { note: "1 = 1+0" },
    ),
    gridFrame(
      "Finish",
      "Corner = left + up = 1+1 = 2 paths around the obstacle.",
      [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 2],
      ],
      [[2, 2]],
      { note: "return 2" },
    ),
  ],
};

export const minimumPathSum2dSolution: ProblemSolution = {
  approach:
    "In-place or dp: each cell += min(up, left). Borders are prefix sums. Answer at bottom-right. O(mn).",
  templates: langs(
    `def minPathSum(grid):
    m, n = len(grid), len(grid[0])
    for r in range(m):
        for c in range(n):
            if r == c == 0: continue
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
  const INF = Infinity;
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
      "Min path with only right/down moves. Add cell cost to min(up, left).",
      [
        [1, 3, 1],
        [1, 5, 1],
        [4, 2, 1],
      ],
      [[0, 0]],
      { note: "start cost 1" },
    ),
    gridFrame(
      "First row / col",
      "Forced prefix sums along the borders.",
      [
        [1, 4, 5],
        [2, "·", "·"],
        [6, "·", "·"],
      ],
      [
        [0, 2],
        [2, 0],
      ],
      { note: "1→4→5 and 1→2→6" },
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
      { note: "7" },
    ),
    gridFrame(
      "Continue",
      "Right: 1+min(5,7)=6. Bottom: 2+min(7,6)=8.",
      [
        [1, 4, 5],
        [2, 7, 6],
        [6, 8, "·"],
      ],
      [
        [1, 2],
        [2, 1],
      ],
    ),
    gridFrame(
      "End",
      "1 + min(6, 8) = 7. Path 1-3-1-1-1.",
      [
        [1, 4, 5],
        [2, 7, 6],
        [6, 8, 7],
      ],
      [[2, 2]],
      { note: "return 7" },
    ),
  ],
};

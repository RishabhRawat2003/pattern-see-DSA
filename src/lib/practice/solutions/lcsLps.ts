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

export const longestCommonSubsequenceSolution: ProblemSolution = {
  approach:
    "2D LCS: if s[i]==t[j] → 1+diag, else max(up, left). Answer dp[n][m]. O(nm) time; can compress to 1D.",
  templates: langs(
    `def longestCommonSubsequence(text1, text2):
    n, m = len(text1), len(text2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]`,
    `int longestCommonSubsequence(string text1, string text2) {
    int n = text1.size(), m = text2.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            if (text1[i - 1] == text2[j - 1])
                dp[i][j] = 1 + dp[i - 1][j - 1];
            else
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
    return dp[n][m];
}`,
    `int longestCommonSubsequence(String text1, String text2) {
    int n = text1.length(), m = text2.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            if (text1.charAt(i - 1) == text2.charAt(j - 1))
                dp[i][j] = 1 + dp[i - 1][j - 1];
            else
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    return dp[n][m];
}`,
    `function longestCommonSubsequence(text1, text2) {
  const n = text1.length, m = text2.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      if (text1[i - 1] === text2[j - 1])
        dp[i][j] = 1 + dp[i - 1][j - 1];
      else
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[n][m];
}`,
  ),
  frames: [
    gridFrame(
      "LCS abc × ac",
      "Match → 1 + diagonal. Else max(left, up).",
      [
        ["", "a", "c"],
        ["a", "·", "·"],
        ["b", "·", "·"],
        ["c", "·", "·"],
      ],
      [],
      { note: "empty borders 0" },
    ),
    gridFrame(
      "a vs a",
      "Match. dp[1][1] = 1.",
      [
        ["", "a", "c"],
        ["a", "1", "1"],
        ["b", "·", "·"],
        ["c", "·", "·"],
      ],
      [[1, 1]],
      { note: "diag +1" },
    ),
    gridFrame(
      "b row",
      "No match with a/c → copy max from neighbors. Still length 1.",
      [
        ["", "a", "c"],
        ["a", "1", "1"],
        ["b", "1", "1"],
        ["c", "·", "·"],
      ],
      [[2, 2]],
    ),
    gridFrame(
      "c vs c",
      "Match on diagonal from 1 → LCS length 2 (\"ac\").",
      [
        ["", "a", "c"],
        ["a", "1", "1"],
        ["b", "1", "1"],
        ["c", "1", "2"],
      ],
      [[3, 2]],
      { note: "LCS ac" },
    ),
    gridFrame(
      "Answer",
      "Longest common subsequence length is 2.",
      [
        ["", "a", "c"],
        ["a", "1", "1"],
        ["b", "1", "1"],
        ["c", "1", "2"],
      ],
      [[3, 2]],
      { note: "return 2" },
    ),
  ],
};

export const longestPalindromicSubsequenceSolution: ProblemSolution = {
  approach:
    "LPS(s) = LCS(s, reverse(s)), or interval DP: if ends match 2+inner else max(drop L, drop R). O(n²).",
  templates: langs(
    `def longestPalindromeSubseq(s):
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        dp[i][i] = 1
        for j in range(i + 1, n):
            if s[i] == s[j]:
                dp[i][j] = 2 + dp[i + 1][j - 1]
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    return dp[0][n - 1]`,
    `int longestPalindromeSubseq(string s) {
    int n = s.size();
    vector<vector<int>> dp(n, vector<int>(n));
    for (int i = n - 1; i >= 0; i--) {
        dp[i][i] = 1;
        for (int j = i + 1; j < n; j++) {
            if (s[i] == s[j]) dp[i][j] = 2 + dp[i + 1][j - 1];
            else dp[i][j] = max(dp[i + 1][j], dp[i][j - 1]);
        }
    }
    return dp[0][n - 1];
}`,
    `int longestPalindromeSubseq(String s) {
    int n = s.length();
    int[][] dp = new int[n][n];
    for (int i = n - 1; i >= 0; i--) {
        dp[i][i] = 1;
        for (int j = i + 1; j < n; j++) {
            if (s.charAt(i) == s.charAt(j))
                dp[i][j] = 2 + dp[i + 1][j - 1];
            else
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
        }
    }
    return dp[0][n - 1];
}`,
    `function longestPalindromeSubseq(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (let j = i + 1; j < n; j++) {
      if (s[i] === s[j]) dp[i][j] = 2 + dp[i + 1][j - 1];
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
    }
  }
  return dp[0][n - 1];
}`,
  ),
  frames: [
    gridFrame(
      's = "bbbab"',
      "Interval DP on i..j. Diagonal = single chars length 1.",
      [
        ["b", "·", "·", "·", "·"],
        ["·", "b", "·", "·", "·"],
        ["·", "·", "b", "·", "·"],
        ["·", "·", "·", "a", "·"],
        ["·", "·", "·", "·", "b"],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
      ],
      { note: "diag = 1" },
    ),
    gridFrame(
      "Len-2 windows",
      "bb match → 2; ba / ab → 1.",
      [
        [1, 2, "·", "·", "·"],
        ["·", 1, 2, "·", "·"],
        ["·", "·", 1, 1, "·"],
        ["·", "·", "·", 1, 1],
        ["·", "·", "·", "·", 1],
      ],
      [[0, 1]],
      { note: "s[0]==s[1]" },
    ),
    gridFrame(
      "Grow to bbb",
      "Ends b=b → 2 + inner. Substring \"bbb\" has LPS 3.",
      [
        [1, 2, 3, "·", "·"],
        ["·", 1, 2, 2, "·"],
        ["·", "·", 1, 1, 2],
        ["·", "·", "·", 1, 1],
        ["·", "·", "·", "·", 1],
      ],
      [[0, 2]],
      { note: "LPS 3" },
    ),
    gridFrame(
      "Full string",
      "Outer b…b match → 2 + LPS(inner). Best LPS is 4 (\"bbbb\").",
      [
        [1, 2, 3, 3, 4],
        ["·", 1, 2, 2, 3],
        ["·", "·", 1, 1, 2],
        ["·", "·", "·", 1, 1],
        ["·", "·", "·", "·", 1],
      ],
      [[0, 4]],
      { note: "bbbb" },
    ),
    gridFrame(
      "Answer",
      "Longest palindromic subsequence length is 4.",
      [
        [1, 2, 3, 3, 4],
        ["·", 1, 2, 2, 3],
        ["·", "·", 1, 1, 2],
        ["·", "·", "·", 1, 1],
        ["·", "·", "·", "·", 1],
      ],
      [[0, 4]],
      { note: "return 4" },
    ),
  ],
};

export const deleteOperationTwoStringsSolution: ProblemSolution = {
  approach:
    "Min deletions = n + m − 2·LCS(s, t). Keep the LCS; delete the rest from both strings. O(nm).",
  templates: langs(
    `def minDistance(word1, word2):
    n, m = len(word1), len(word2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return n + m - 2 * dp[n][m]`,
    `int minDistance(string word1, string word2) {
    int n = word1.size(), m = word2.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            if (word1[i - 1] == word2[j - 1])
                dp[i][j] = 1 + dp[i - 1][j - 1];
            else
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
    return n + m - 2 * dp[n][m];
}`,
    `int minDistance(String word1, String word2) {
    int n = word1.length(), m = word2.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            if (word1.charAt(i - 1) == word2.charAt(j - 1))
                dp[i][j] = 1 + dp[i - 1][j - 1];
            else
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    return n + m - 2 * dp[n][m];
}`,
    `function minDistance(word1, word2) {
  const n = word1.length, m = word2.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      if (word1[i - 1] === word2[j - 1])
        dp[i][j] = 1 + dp[i - 1][j - 1];
      else
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
  return n + m - 2 * dp[n][m];
}`,
  ),
  frames: [
    gridFrame(
      'sea × eat',
      "Build LCS table. Shared letters stay; others must be deleted.",
      [
        ["", "e", "a", "t"],
        ["s", "·", "·", "·"],
        ["e", "·", "·", "·"],
        ["a", "·", "·", "·"],
      ],
      [],
      { note: "n=3 · m=3" },
    ),
    gridFrame(
      "e matches e",
      "First common letter. LCS length 1 so far.",
      [
        ["", "e", "a", "t"],
        ["s", "0", "0", "0"],
        ["e", "1", "1", "1"],
        ["a", "·", "·", "·"],
      ],
      [[2, 1]],
      { note: "LCS e" },
    ),
    gridFrame(
      "a matches a",
      "Diagonal grow → LCS \"ea\" length 2.",
      [
        ["", "e", "a", "t"],
        ["s", "0", "0", "0"],
        ["e", "1", "1", "1"],
        ["a", "1", "2", "2"],
      ],
      [[3, 2]],
      { note: "LCS ea" },
    ),
    gridFrame(
      "Deletions",
      "Keep LCS (2 chars). Delete n+m−2·LCS = 3+3−4 = 2 (s and t).",
      [
        ["", "e", "a", "t"],
        ["s", "0", "0", "0"],
        ["e", "1", "1", "1"],
        ["a", "1", "2", "2"],
      ],
      [[3, 3]],
      { note: "2 deletions" },
    ),
    gridFrame(
      "Answer",
      "Minimum delete operations = 2.",
      [
        ["", "e", "a", "t"],
        ["s", "0", "0", "0"],
        ["e", "1", "1", "1"],
        ["a", "1", "2", "2"],
      ],
      [[3, 3]],
      { note: "return 2" },
    ),
  ],
};

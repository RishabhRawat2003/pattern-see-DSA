import { arrayFrame, PTR } from "../../demos/problems/helpers";
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

export const editDistanceSolution: ProblemSolution = {
  approach:
    "dp[i][j] = min edits to turn s[:i] into t[:j]. Match → diagonal; else 1 + min(insert, delete, replace). O(nm).",
  templates: langs(
    `def minDistance(word1, word2):
    n, m = len(word1), len(word2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[n][m]`,
    `int minDistance(string word1, string word2) {
    int n = word1.size(), m = word2.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1));
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (word1[i - 1] == word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
        }
    }
    return dp[n][m];
}`,
    `int minDistance(String word1, String word2) {
    int n = word1.length(), m = word2.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1]));
        }
    }
    return dp[n][m];
}`,
    `function minDistance(word1, word2) {
  const n = word1.length, m = word2.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[n][m];
}`,
  ),
  frames: [
    gridFrame(
      "cat → cut",
      "Rows = word1 prefixes, cols = word2. Match is free on the diagonal.",
      [
        ["", "c", "u", "t"],
        ["c", "·", "·", "·"],
        ["a", "·", "·", "·"],
        ["t", "·", "·", "·"],
      ],
      [],
      { note: "Levenshtein" },
    ),
    gridFrame(
      "Borders",
      "Empty→prefix costs length (all inserts / all deletes).",
      [
        ["0", "1", "2", "3"],
        ["1", "·", "·", "·"],
        ["2", "·", "·", "·"],
        ["3", "·", "·", "·"],
      ],
      [[0, 3], [3, 0]],
    ),
    gridFrame(
      "c = c",
      "Match → copy diagonal 0. Then fill insert/delete along the edges.",
      [
        ["0", "1", "2", "3"],
        ["1", "0", "1", "2"],
        ["2", "1", "·", "·"],
        ["3", "2", "·", "·"],
      ],
      [[1, 1]],
      { note: "dp=0" },
    ),
    gridFrame(
      "a vs u",
      "Mismatch: 1 + min(delete, insert, replace) = 1.",
      [
        ["0", "1", "2", "3"],
        ["1", "0", "1", "2"],
        ["2", "1", "1", "2"],
        ["3", "2", "·", "·"],
      ],
      [[2, 2]],
      { note: "replace a→u" },
    ),
    gridFrame(
      "Answer",
      "t=t is free from 1 → distance 1 (replace a with u).",
      [
        ["0", "1", "2", "3"],
        ["1", "0", "1", "2"],
        ["2", "1", "1", "2"],
        ["3", "2", "2", "1"],
      ],
      [[3, 3]],
      { note: "return 1" },
    ),
  ],
};

export const deleteOperationEditSolution: ProblemSolution = {
  approach:
    "Min deletions to make equal = n + m − 2·LCS. Or edit distance using only delete (equivalent). Compute LCS DP then convert. O(nm).",
  templates: langs(
    `def minDistance(word1, word2):
    n, m = len(word1), len(word2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return n + m - 2 * dp[n][m]`,
    `int minDistance(string word1, string word2) {
    int n = word1.size(), m = word2.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            if (word1[i - 1] == word2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
    return n + m - 2 * dp[n][m];
}`,
    `int minDistance(String word1, String word2) {
    int n = word1.length(), m = word2.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            if (word1.charAt(i - 1) == word2.charAt(j - 1))
                dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    return n + m - 2 * dp[n][m];
}`,
    `function minDistance(word1, word2) {
  const n = word1.length, m = word2.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return n + m - 2 * dp[n][m];
}`,
  ),
  frames: [
    arrayFrame(
      "sea · eat",
      "Only deletions allowed. Keep the LCS; delete the rest from both strings.",
      ["s", "e", "a", "|", "e", "a", "t"],
      {},
      { note: "n=3 m=3" },
    ),
    gridFrame(
      "LCS table",
      "Match → 1 + diagonal. Else max(up, left).",
      [
        ["", "e", "a", "t"],
        ["s", "·", "·", "·"],
        ["e", "·", "·", "·"],
        ["a", "·", "·", "·"],
      ],
    ),
    gridFrame(
      "e = e",
      "First match at (2,1) → LCS length 1 so far.",
      [
        ["", "e", "a", "t"],
        ["s", "0", "0", "0"],
        ["e", "1", "1", "1"],
        ["a", "1", "·", "·"],
      ],
      [[2, 1]],
    ),
    gridFrame(
      "a = a",
      "Second match → LCS \"ea\" length 2.",
      [
        ["", "e", "a", "t"],
        ["s", "0", "0", "0"],
        ["e", "1", "1", "1"],
        ["a", "1", "2", "2"],
      ],
      [[3, 2]],
      { note: "LCS=2" },
    ),
    arrayFrame(
      "Deletes",
      "Delete 's' from sea and 't' from eat → both become \"ea\".",
      ["s", "e", "a", "|", "e", "a", "t"],
      { 0: "skip", 6: "skip", 1: "match", 2: "match", 4: "match", 5: "match" },
      { note: "2 deletes" },
    ),
    arrayFrame(
      "Answer",
      "n+m−2·LCS = 3+3−4 = 2.",
      ["s", "e", "a", "|", "e", "a", "t"],
      { 0: "done", 6: "done" },
      { note: "return 2" },
    ),
  ],
};

export const isSubsequenceSolution: ProblemSolution = {
  approach:
    "Two pointers: walk t; advance in s on each match. s is a subsequence iff the s-pointer reaches the end. O(|t|) time, O(1) space. (DP also works but overkill.)",
  templates: langs(
    `def isSubsequence(s, t):
    i = 0
    for ch in t:
        if i < len(s) and s[i] == ch:
            i += 1
    return i == len(s)`,
    `bool isSubsequence(string s, string t) {
    int i = 0;
    for (char ch : t) {
        if (i < (int)s.size() && s[i] == ch) i++;
    }
    return i == (int)s.size();
}`,
    `boolean isSubsequence(String s, String t) {
    int i = 0;
    for (int j = 0; j < t.length(); j++) {
        if (i < s.length() && s.charAt(i) == t.charAt(j)) i++;
    }
    return i == s.length();
}`,
    `function isSubsequence(s, t) {
  let i = 0;
  for (const ch of t) {
    if (i < s.length && s[i] === ch) i++;
  }
  return i === s.length;
}`,
  ),
  frames: (() => {
    const t = ["a", "h", "b", "g", "d", "c"];
    return [
      arrayFrame(
        "s = abc · t",
        "Need to find a, then b, then c in order inside t (gaps ok).",
        t,
        {},
        { note: "i = 0" },
      ),
      arrayFrame(
        "Match a",
        "t[0]=a matches s[0]. Advance s-pointer.",
        t,
        { 0: "match" },
        {
          pointers: [
            { name: "i", index: 0, color: PTR.L },
            { name: "j", index: 0, color: PTR.M },
          ],
          note: "need b next",
        },
      ),
      arrayFrame(
        "Skip h",
        "h ≠ b — only move j.",
        t,
        { 0: "done", 1: "skip" },
        {
          pointers: [{ name: "j", index: 1, color: PTR.M }],
          note: "still need b",
        },
      ),
      arrayFrame(
        "Match b",
        "t[2]=b matches. Now need c.",
        t,
        { 0: "done", 2: "match" },
        {
          pointers: [
            { name: "i", index: 2, color: PTR.L },
            { name: "j", index: 2, color: PTR.M },
          ],
          note: "need c",
        },
      ),
      arrayFrame(
        "Match c",
        "After skipping g,d — c found. s-pointer at end.",
        t,
        { 0: "done", 2: "done", 5: "match" },
        {
          pointers: [{ name: "j", index: 5, color: PTR.M }],
          note: "i == |s|",
        },
      ),
      arrayFrame(
        "Answer",
        "All of s matched in order → true.",
        t,
        { 0: "match", 2: "match", 5: "match" },
        { note: "return true" },
      ),
    ];
  })(),
};

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

export const wildcardMatchingSolution: ProblemSolution = {
  approach:
    "Boolean DP: '?' matches one char; '*' matches empty (from left) or one more of s (from up). Seed dp[0][0] and leading '*' row. O(nm).",
  templates: langs(
    `def isMatch(s, p):
    n, m = len(s), len(p)
    dp = [[False] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = True
    for j in range(1, m + 1):
        if p[j - 1] == "*":
            dp[0][j] = dp[0][j - 1]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if p[j - 1] == "*":
                dp[i][j] = dp[i][j - 1] or dp[i - 1][j]
            elif p[j - 1] in {s[i - 1], "?"}:
                dp[i][j] = dp[i - 1][j - 1]
    return dp[n][m]`,
    `bool isMatch(string s, string p) {
    int n = s.size(), m = p.size();
    vector<vector<char>> dp(n + 1, vector<char>(m + 1));
    dp[0][0] = 1;
    for (int j = 1; j <= m; j++)
        if (p[j - 1] == '*') dp[0][j] = dp[0][j - 1];
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (p[j - 1] == '*') dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
            else if (p[j - 1] == s[i - 1] || p[j - 1] == '?')
                dp[i][j] = dp[i - 1][j - 1];
        }
    }
    return dp[n][m];
}`,
    `boolean isMatch(String s, String p) {
    int n = s.length(), m = p.length();
    boolean[][] dp = new boolean[n + 1][m + 1];
    dp[0][0] = true;
    for (int j = 1; j <= m; j++)
        if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 1];
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (p.charAt(j - 1) == '*') dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
            else if (p.charAt(j - 1) == s.charAt(i - 1) || p.charAt(j - 1) == '?')
                dp[i][j] = dp[i - 1][j - 1];
        }
    }
    return dp[n][m];
}`,
    `function isMatch(s, p) {
  const n = s.length, m = p.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= m; j++)
    if (p[j - 1] === "*") dp[0][j] = dp[0][j - 1];
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (p[j - 1] === "*") dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
      else if (p[j - 1] === s[i - 1] || p[j - 1] === "?")
        dp[i][j] = dp[i - 1][j - 1];
    }
  }
  return dp[n][m];
}`,
  ),
  frames: [
    gridFrame(
      "s=aa · p=a*",
      "'?' = one char. '*' = empty or more of s (OR of left / up).",
      [
        ["", "a", "*"],
        ["a", "·", "·"],
        ["a", "·", "·"],
      ],
      [[0, 0]],
      { note: "dp[0][0]=T" },
    ),
    gridFrame(
      "First a",
      "p[0]=a matches s[0]=a → diagonal true. '*' can also cover empty after that.",
      [
        ["", "a", "*"],
        ["a", "T", "T"],
        ["a", "F", "·"],
      ],
      [[1, 1]],
    ),
    gridFrame(
      "* eats second a",
      "dp[2][2] = left (empty *) OR up (* eats one more) → true.",
      [
        ["", "a", "*"],
        ["a", "T", "T"],
        ["a", "F", "T"],
      ],
      [[2, 2]],
      { note: "match" },
    ),
    arrayFrame(
      "Interpretation",
      "Pattern a* matches aa: literal a, then * consumes the second a.",
      ["a", "a"],
      { 0: "match", 1: "window" },
      {
        pointers: [{ name: "*", index: 1, color: PTR.R }],
        note: "return true",
      },
    ),
    arrayFrame(
      "Contrast ?",
      "a? would need exactly two chars and match; a alone would fail.",
      ["a", "?"],
      { 1: "lo" },
      { note: "? = exactly one" },
    ),
  ],
};

export const regexMatchingSolution: ProblemSolution = {
  approach:
    "DP like wildcard, but '*' is a quantifier on the previous atom: zero copies (skip two pattern chars) or one more of s if the atom matches. O(nm).",
  templates: langs(
    `def isMatch(s, p):
    n, m = len(s), len(p)
    dp = [[False] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = True
    for j in range(2, m + 1):
        if p[j - 1] == "*":
            dp[0][j] = dp[0][j - 2]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if p[j - 1] == "*":
                dp[i][j] = dp[i][j - 2]
                if p[j - 2] in {s[i - 1], "."}:
                    dp[i][j] = dp[i][j] or dp[i - 1][j]
            elif p[j - 1] in {s[i - 1], "."}:
                dp[i][j] = dp[i - 1][j - 1]
    return dp[n][m]`,
    `bool isMatch(string s, string p) {
    int n = s.size(), m = p.size();
    vector<vector<char>> dp(n + 1, vector<char>(m + 1));
    dp[0][0] = 1;
    for (int j = 2; j <= m; j++)
        if (p[j - 1] == '*') dp[0][j] = dp[0][j - 2];
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (p[j - 1] == '*') {
                dp[i][j] = dp[i][j - 2];
                if (p[j - 2] == s[i - 1] || p[j - 2] == '.')
                    dp[i][j] = dp[i][j] || dp[i - 1][j];
            } else if (p[j - 1] == s[i - 1] || p[j - 1] == '.')
                dp[i][j] = dp[i - 1][j - 1];
        }
    }
    return dp[n][m];
}`,
    `boolean isMatch(String s, String p) {
    int n = s.length(), m = p.length();
    boolean[][] dp = new boolean[n + 1][m + 1];
    dp[0][0] = true;
    for (int j = 2; j <= m; j++)
        if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 2];
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (p.charAt(j - 1) == '*') {
                dp[i][j] = dp[i][j - 2];
                if (p.charAt(j - 2) == s.charAt(i - 1) || p.charAt(j - 2) == '.')
                    dp[i][j] = dp[i][j] || dp[i - 1][j];
            } else if (p.charAt(j - 1) == s.charAt(i - 1) || p.charAt(j - 1) == '.')
                dp[i][j] = dp[i - 1][j - 1];
        }
    }
    return dp[n][m];
}`,
    `function isMatch(s, p) {
  const n = s.length, m = p.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(false));
  dp[0][0] = true;
  for (let j = 2; j <= m; j++)
    if (p[j - 1] === "*") dp[0][j] = dp[0][j - 2];
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (p[j - 1] === "*") {
        dp[i][j] = dp[i][j - 2];
        if (p[j - 2] === s[i - 1] || p[j - 2] === ".")
          dp[i][j] = dp[i][j] || dp[i - 1][j];
      } else if (p[j - 1] === s[i - 1] || p[j - 1] === ".")
        dp[i][j] = dp[i - 1][j - 1];
    }
  }
  return dp[n][m];
}`,
  ),
  frames: [
    gridFrame(
      "s=aab · p=c*a*b",
      "'*' binds to the previous token: zero-or-more of that atom. '.' = any char.",
      [
        ["", "c", "*", "a", "*", "b"],
        ["a", "·", "·", "·", "·", "·"],
        ["a", "·", "·", "·", "·", "·"],
        ["b", "·", "·", "·", "·", "·"],
      ],
      [],
      { note: "regex DP" },
    ),
    gridFrame(
      "Empty s row",
      "c* can match empty (skip pair). Then a* also empty.",
      [
        ["T", "F", "T", "F", "T", "F"],
        ["·", "·", "·", "·", "·", "·"],
        ["·", "·", "·", "·", "·", "·"],
        ["·", "·", "·", "·", "·", "·"],
      ],
      [[0, 2], [0, 4]],
      { note: "zero copies" },
    ),
    gridFrame(
      "First a via a*",
      "c* still empty; a* consumes first a (atom matches + take from up).",
      [
        ["T", "F", "T", "F", "T", "F"],
        ["F", "F", "F", "T", "T", "F"],
        ["·", "·", "·", "·", "·", "·"],
        ["·", "·", "·", "·", "·", "·"],
      ],
      [[1, 4]],
    ),
    gridFrame(
      "Second a",
      "a* takes another a. Pattern still open before final b.",
      [
        ["T", "F", "T", "F", "T", "F"],
        ["F", "F", "F", "T", "T", "F"],
        ["F", "F", "F", "F", "T", "F"],
        ["·", "·", "·", "·", "·", "·"],
      ],
      [[2, 4]],
    ),
    gridFrame(
      "Match b",
      "Literal b matches last char → whole string matches.",
      [
        ["T", "F", "T", "F", "T", "F"],
        ["F", "F", "F", "T", "T", "F"],
        ["F", "F", "F", "F", "T", "F"],
        ["F", "F", "F", "F", "F", "T"],
      ],
      [[3, 5]],
      { note: "return true" },
    ),
  ],
};

export const editDistanceWildcardSolution: ProblemSolution = {
  approach:
    "Same Levenshtein DP as classic edit-distance: match free; else 1+min(insert,delete,replace). Included here as the \"distance\" cousin of matching DPs. O(nm).",
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
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            if (word1[i - 1] == word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
    return dp[n][m];
}`,
    `int minDistance(String word1, String word2) {
    int n = word1.length(), m = word2.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1]));
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
      "horse → ros",
      "Full edit distance amid matching patterns — quantify how far two strings are.",
      [
        ["", "r", "o", "s"],
        ["h", "·", "·", "·"],
        ["o", "·", "·", "·"],
        ["r", "·", "·", "·"],
        ["s", "·", "·", "·"],
        ["e", "·", "·", "·"],
      ],
      [],
      { note: "n=5 m=3" },
    ),
    gridFrame(
      "Borders",
      "Delete all / insert all along the axes.",
      [
        ["0", "1", "2", "3"],
        ["1", "·", "·", "·"],
        ["2", "·", "·", "·"],
        ["3", "·", "·", "·"],
        ["4", "·", "·", "·"],
        ["5", "·", "·", "·"],
      ],
      [[0, 3], [5, 0]],
    ),
    gridFrame(
      "Fill mid",
      "o=o and r=r and s=s land on cheap diagonals; mismatches cost 1.",
      [
        ["0", "1", "2", "3"],
        ["1", "1", "2", "3"],
        ["2", "2", "1", "2"],
        ["3", "2", "2", "2"],
        ["4", "3", "3", "2"],
        ["5", "4", "4", "3"],
      ],
      [[2, 2]],
      { note: "o matched" },
    ),
    gridFrame(
      "Answer",
      "Bottom-right = 3 (e.g. replace h→r, delete o/e appropriately — classic 3 edits).",
      [
        ["0", "1", "2", "3"],
        ["1", "1", "2", "3"],
        ["2", "2", "1", "2"],
        ["3", "2", "2", "2"],
        ["4", "3", "3", "2"],
        ["5", "4", "4", "3"],
      ],
      [[5, 3]],
      { note: "return 3" },
    ),
    arrayFrame(
      "Ops sketch",
      "horse → rorse (replace h) → rose (delete r) → ros (delete e).",
      ["h", "o", "r", "s", "e"],
      { 0: "update", 2: "skip", 4: "skip" },
      { note: "3 edits" },
    ),
  ],
};

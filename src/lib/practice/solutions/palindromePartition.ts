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

export const palindromePartitioningSolution: ProblemSolution = {
  approach:
    "Precompute pal[i][j]. DFS from i: for each end j with pal[i][j], push substring and recurse. Record path at i==n. O(n·2ⁿ) partitions, O(n²) preprocess.",
  templates: langs(
    `def partition(s):
    n = len(s)
    pal = [[False] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        for j in range(i, n):
            pal[i][j] = s[i] == s[j] and (j - i < 2 or pal[i + 1][j - 1])
    out = []
    def dfs(i, path):
        if i == n:
            out.append(path[:])
            return
        for j in range(i, n):
            if pal[i][j]:
                path.append(s[i:j + 1])
                dfs(j + 1, path)
                path.pop()
    dfs(0, [])
    return out`,
    `void palDfs(int i, string& s, vector<vector<char>>& pal, vector<string>& path, vector<vector<string>>& out) {
    int n = s.size();
    if (i == n) { out.push_back(path); return; }
    for (int j = i; j < n; j++) {
        if (pal[i][j]) {
            path.push_back(s.substr(i, j - i + 1));
            palDfs(j + 1, s, pal, path, out);
            path.pop_back();
        }
    }
}
vector<vector<string>> partition(string s) {
    int n = s.size();
    vector<vector<char>> pal(n, vector<char>(n));
    for (int i = n - 1; i >= 0; i--)
        for (int j = i; j < n; j++)
            pal[i][j] = s[i] == s[j] && (j - i < 2 || pal[i + 1][j - 1]);
    vector<vector<string>> out;
    vector<string> path;
    palDfs(0, s, pal, path, out);
    return out;
}`,
    `void palDfs(int i, String s, boolean[][] pal, List<String> path, List<List<String>> out) {
    int n = s.length();
    if (i == n) { out.add(new ArrayList<>(path)); return; }
    for (int j = i; j < n; j++) {
        if (pal[i][j]) {
            path.add(s.substring(i, j + 1));
            palDfs(j + 1, s, pal, path, out);
            path.remove(path.size() - 1);
        }
    }
}
List<List<String>> partition(String s) {
    int n = s.length();
    boolean[][] pal = new boolean[n][n];
    for (int i = n - 1; i >= 0; i--)
        for (int j = i; j < n; j++)
            pal[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 2 || pal[i + 1][j - 1]);
    List<List<String>> out = new ArrayList<>();
    palDfs(0, s, pal, new ArrayList<>(), out);
    return out;
}`,
    `function partition(s) {
  const n = s.length;
  const pal = Array.from({ length: n }, () => Array(n).fill(false));
  for (let i = n - 1; i >= 0; i--)
    for (let j = i; j < n; j++)
      pal[i][j] = s[i] === s[j] && (j - i < 2 || pal[i + 1][j - 1]);
  const out = [];
  function dfs(i, path) {
    if (i === n) { out.push([...path]); return; }
    for (let j = i; j < n; j++) {
      if (pal[i][j]) {
        path.push(s.slice(i, j + 1));
        dfs(j + 1, path);
        path.pop();
      }
    }
  }
  dfs(0, []);
  return out;
}`,
  ),
  frames: (() => {
    const s = ["a", "a", "b"];
    return [
      arrayFrame(
        "s = aab",
        "Precompute every palindrome substring, then DFS cut points.",
        s,
        {},
        { note: "n=3" },
      ),
      gridFrame(
        "pal[i][j]",
        "Singles true; \"aa\" true; \"aab\" / \"ab\" false.",
        [
          ["T", "T", "F"],
          ["", "T", "F"],
          ["", "", "T"],
        ],
        [[0, 1]],
        { note: "aa palindrome" },
      ),
      arrayFrame(
        "Cut singles",
        "Path [\"a\",\"a\",\"b\"] — every char is a palindrome.",
        s,
        { 0: "window", 1: "window", 2: "window" },
        {
          pointers: [{ name: "i", index: 0, color: PTR.M }],
          note: "a | a | b",
        },
      ),
      arrayFrame(
        "Cut after aa",
        "Take s[0..1]=\"aa\", then \"b\". Second valid partition.",
        s,
        { 0: "match", 1: "match", 2: "window" },
        { note: "aa | b" },
      ),
      arrayFrame(
        "All partitions",
        "Collected: [[a,a,b],[aa,b]]. No other cut sets are all-palindrome.",
        s,
        { 0: "done", 1: "done", 2: "done" },
        { note: "2 ways" },
      ),
    ];
  })(),
};

export const palindromePartitioningIISolution: ProblemSolution = {
  approach:
    "After pal[i][j], cuts[i] = min cuts for s[i:]. cuts[i]=0 if pal[i..n); else 1+min cuts[j+1] over pal[i..j]. Or forward DP. O(n²).",
  templates: langs(
    `def minCut(s):
    n = len(s)
    pal = [[False] * n for _ in range(n)]
    cuts = list(range(n))
    for i in range(n):
        for j in range(i + 1):
            if s[j] == s[i] and (i - j < 2 or pal[j + 1][i - 1]):
                pal[j][i] = True
                cuts[i] = 0 if j == 0 else min(cuts[i], cuts[j - 1] + 1)
    return cuts[-1]`,
    `int minCut(string s) {
    int n = s.size();
    vector<vector<char>> pal(n, vector<char>(n));
    vector<int> cuts(n);
    iota(cuts.begin(), cuts.end(), 0);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            if (s[j] == s[i] && (i - j < 2 || pal[j + 1][i - 1])) {
                pal[j][i] = 1;
                cuts[i] = j == 0 ? 0 : min(cuts[i], cuts[j - 1] + 1);
            }
        }
    }
    return cuts[n - 1];
}`,
    `int minCut(String s) {
    int n = s.length();
    boolean[][] pal = new boolean[n][n];
    int[] cuts = new int[n];
    for (int i = 0; i < n; i++) cuts[i] = i;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            if (s.charAt(j) == s.charAt(i) && (i - j < 2 || pal[j + 1][i - 1])) {
                pal[j][i] = true;
                cuts[i] = j == 0 ? 0 : Math.min(cuts[i], cuts[j - 1] + 1);
            }
        }
    }
    return cuts[n - 1];
}`,
    `function minCut(s) {
  const n = s.length;
  const pal = Array.from({ length: n }, () => Array(n).fill(false));
  const cuts = Array.from({ length: n }, (_, i) => i);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      if (s[j] === s[i] && (i - j < 2 || pal[j + 1][i - 1])) {
        pal[j][i] = true;
        cuts[i] = j === 0 ? 0 : Math.min(cuts[i], cuts[j - 1] + 1);
      }
    }
  }
  return cuts[n - 1];
}`,
  ),
  frames: (() => {
    const s = ["a", "a", "b"];
    return [
      arrayFrame(
        "Min cuts",
        "cuts[i] = fewest cuts so every piece of s[0..i] is a palindrome.",
        s,
        {},
        { note: "worst = n-1" },
      ),
      arrayFrame(
        "Singles",
        "Each prefix of length k needs at most k cuts between singles.",
        s,
        { 0: "lo" },
        { note: "cuts start 0,1,2" },
      ),
      arrayFrame(
        "\"aa\" is palindrome",
        "s[0..1] palindrome from start → cuts[1] = 0 (no cut yet).",
        s,
        { 0: "match", 1: "match" },
        {
          pointers: [{ name: "i", index: 1, color: PTR.M }],
          note: "cuts[1]=0",
        },
      ),
      arrayFrame(
        "Add b",
        "\"aab\" not palindrome. Best: cut after \"aa\" → cuts[2] = cuts[1]+1 = 1.",
        s,
        { 0: "done", 1: "done", 2: "active" },
        {
          pointers: [{ name: "i", index: 2, color: PTR.M }],
          note: "aa | b",
        },
      ),
      arrayFrame(
        "Answer",
        "Min cuts = 1. All-singletons would be 2.",
        s,
        { 0: "match", 1: "match", 2: "match" },
        { note: "return 1" },
      ),
    ];
  })(),
};

export const longestPalindromicSubstringSolution: ProblemSolution = {
  approach:
    "Expand around each center (odd/even) and track the best window — O(n²) time, O(1) space. Equivalent to filling pal[i][j] DP and remembering the longest true cell.",
  templates: langs(
    `def longestPalindrome(s):
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return l + 1, r - 1
    best_l = best_r = 0
    for i in range(len(s)):
        for L, R in (expand(i, i), expand(i, i + 1)):
            if R - L > best_r - best_l:
                best_l, best_r = L, R
    return s[best_l:best_r + 1]`,
    `string longestPalindrome(string s) {
    auto expand = [&](int l, int r) {
        while (l >= 0 && r < (int)s.size() && s[l] == s[r]) { l--; r++; }
        return pair{l + 1, r - 1};
    };
    int bl = 0, br = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        for (auto [L, R] : {expand(i, i), expand(i, i + 1)})
            if (R - L > br - bl) { bl = L; br = R; }
    }
    return s.substr(bl, br - bl + 1);
}`,
    `String longestPalindrome(String s) {
    int bl = 0, br = 0;
    for (int i = 0; i < s.length(); i++) {
        for (int[] mid : new int[][]{{i, i}, {i, i + 1}}) {
            int l = mid[0], r = mid[1];
            while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
            l++; r--;
            if (r - l > br - bl) { bl = l; br = r; }
        }
    }
    return s.substring(bl, br + 1);
}`,
    `function longestPalindrome(s) {
  let bl = 0, br = 0;
  function expand(l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    return [l + 1, r - 1];
  }
  for (let i = 0; i < s.length; i++) {
    for (const [L, R] of [expand(i, i), expand(i, i + 1)]) {
      if (R - L > br - bl) { bl = L; br = R; }
    }
  }
  return s.slice(bl, br + 1);
}`,
  ),
  frames: (() => {
    const s = ["b", "a", "b", "a", "d"];
    return [
      arrayFrame(
        "s = babad",
        "Expand around every center; keep the longest palindromic window.",
        s,
        {},
        { note: "odd & even centers" },
      ),
      arrayFrame(
        "Center at a (i=1)",
        "Expand b-a-b → \"bab\" length 3.",
        s,
        { 0: "match", 1: "active", 2: "match" },
        {
          pointers: [{ name: "c", index: 1, color: PTR.M }],
          window: [0, 2],
          note: "bab",
        },
      ),
      arrayFrame(
        "Center at b (i=2)",
        "Expand a-b-a → \"aba\" also length 3 (tie / update ok).",
        s,
        { 1: "match", 2: "active", 3: "match" },
        {
          pointers: [{ name: "c", index: 2, color: PTR.M }],
          window: [1, 3],
          note: "aba",
        },
      ),
      arrayFrame(
        "Even centers",
        "No adjacent equal pair → no even-length palindrome longer than 1 here.",
        s,
        { 2: "skip", 3: "skip" },
        { note: "no aa/bb…" },
      ),
      arrayFrame(
        "Answer",
        "Longest length 3 — return \"bab\" or \"aba\".",
        s,
        { 0: "match", 1: "match", 2: "match" },
        { window: [0, 2], note: "return bab" },
      ),
    ];
  })(),
};

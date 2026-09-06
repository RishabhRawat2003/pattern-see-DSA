import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { CellTone, Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function permutationsFrames(): Frame[] {
  const nums = [1, 2, 3];
  return [
    arrayFrame(
      "Permute [1,2,3]",
      "Backtracking: choose an unused number, push to path, recurse, pop (undo). 3! = 6 results.",
      nums,
      {},
      { note: "path = [] · used = {}" },
    ),
    arrayFrame(
      "Choose 1",
      "Mark 1 used. Path is [1]. Try every unused digit next.",
      nums,
      { 0: "match" },
      {
        pointers: [{ name: "pick", index: 0, color: PTR.L }],
        note: "path = [1]",
      },
    ),
    arrayFrame(
      "Then 2 → [1,2]",
      "Push 2. One slot left.",
      nums,
      { 0: "match", 1: "window" },
      {
        pointers: [{ name: "pick", index: 1, color: PTR.L }],
        note: "path = [1,2]",
      },
    ),
    arrayFrame(
      "Complete [1,2,3]",
      "Path length == n. Record a permutation, then undo 3.",
      nums,
      { 0: "match", 1: "match", 2: "match" },
      { note: "path = [1,2,3] · record" },
    ),
    arrayFrame(
      "Undo 3, try 3 earlier",
      "Pop back to [1]. Next unused after 2 was already tried — now place 3 in the second slot.",
      nums,
      { 0: "match", 2: "active" },
      {
        pointers: [{ name: "pick", index: 2, color: PTR.L }],
        note: "path = [1,3]",
      },
    ),
    arrayFrame(
      "[1,3,2]",
      "Second permutation under prefix 1. Undo back to empty and start with 2…",
      nums,
      { 0: "match", 2: "match", 1: "match" },
      { note: "path = [1,3,2] · record" },
    ),
    arrayFrame(
      "Prefix 2…",
      "After undoing 1, choose 2 first. Same process yields [2,1,3], [2,3,1], then prefix 3.",
      nums,
      { 1: "match" },
      {
        pointers: [{ name: "pick", index: 1, color: PTR.L }],
        note: "path = [2]",
      },
    ),
    arrayFrame(
      "All 6 done",
      "Every ordering visited exactly once because used[] blocks repeats.",
      nums,
      { 0: "done", 1: "done", 2: "done" },
      { note: "6 permutations" },
    ),
  ];
}

function generateParenthesesFrames(): Frame[] {
  const charFrame = (
    title: string,
    caption: string,
    chars: string[],
    toneMap: Record<number, CellTone> = {},
    note?: string,
  ): Frame =>
    arrayFrame(title, caption, chars, toneMap, note ? { note } : {});

  return [
    charFrame(
      "n = 3 · empty",
      "Build a string with n '(' and n ')'. Only add '(' if open < n; only add ')' if close < open.",
      [],
      {},
      "open=0 close=0",
    ),
    charFrame(
      "Add '('",
      "Always legal at the start. open becomes 1.",
      ["("],
      { 0: "active" },
      "open=1 close=0",
    ),
    charFrame(
      "Add '(' again",
      "Still open < 3. Path = ((",
      ["(", "("],
      { 0: "window", 1: "active" },
      "open=2 close=0",
    ),
    charFrame(
      "Third '('",
      "open hits n. Cannot add another '(' — only ')' is legal now.",
      ["(", "(", "("],
      { 2: "active" },
      "open=3 close=0",
    ),
    charFrame(
      "Must close",
      "Add ')'. close < open still holds until they meet.",
      ["(", "(", "(", ")"],
      { 3: "match" },
      "open=3 close=1",
    ),
    charFrame(
      "Balance to ((( )))",
      "Keep closing until open == close == n. One valid string: ((()))",
      ["(", "(", "(", ")", ")", ")"],
      { 0: "match", 1: "match", 2: "match", 3: "match", 4: "match", 5: "match" },
      "record ((()))",
    ),
    {
      kind: "stack",
      title: "Backtrack → (()())",
      caption: "Undo the last choices and try ')' earlier (after two opens). Another valid leaf.",
      stackItems: [
        { value: "(", tone: "window" },
        { value: "(", tone: "window" },
        { value: ")", tone: "active" },
        { value: "(", tone: "match" },
        { value: ")", tone: "match" },
        { value: ")", tone: "match" },
      ],
      note: "record (()())",
    },
    {
      kind: "stack",
      title: "Catalan count",
      caption: "All valid sequences for n=3: ((())), (()()), (())(), ()(()), ()()(). Pruning keeps them balanced.",
      stackItems: [
        { value: "(()())", tone: "done" },
        { value: "(())()", tone: "done" },
        { value: "()(())", tone: "done" },
        { value: "()()()", tone: "done" },
        { value: "((()))", tone: "match" },
      ],
      note: "5 strings · C₃",
    },
  ];
}

function wordSearchFrames(): Frame[] {
  type Cell = { value: string; tone?: CellTone };
  const board = (tones: Record<string, CellTone> = {}): Cell[][] => {
    const letters = [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"],
    ];
    return letters.map((row, r) =>
      row.map((value, c) => ({
        value,
        tone: tones[`${r},${c}`] ?? "idle",
      })),
    );
  };
  return [
    {
      kind: "grid",
      title: "Find WORD",
      caption: "DFS from every cell. Match board[r][c] to word[k], mark visited, try 4 neighbors, unmark on return.",
      grid: board(),
      note: "word = ABCCED",
    },
    {
      kind: "grid",
      title: "Start at A (0,0)",
      caption: "First letter matches. Mark visited so we do not reuse this cell in the same path.",
      grid: board({ "0,0": "active" }),
      note: "k = 0 · A",
    },
    {
      kind: "grid",
      title: "Right → B",
      caption: "Neighbor (0,1) is B — next letter. Continue east.",
      grid: board({ "0,0": "window", "0,1": "active" }),
      note: "k = 1 · AB",
    },
    {
      kind: "grid",
      title: "Right → C",
      caption: "(0,2) is C. Path AB C …",
      grid: board({ "0,0": "window", "0,1": "window", "0,2": "active" }),
      note: "k = 2 · ABC",
    },
    {
      kind: "grid",
      title: "Down → C",
      caption: "(1,2) is another C. Still matching.",
      grid: board({
        "0,0": "window",
        "0,1": "window",
        "0,2": "window",
        "1,2": "active",
      }),
      note: "k = 3 · ABCC",
    },
    {
      kind: "grid",
      title: "Down → E",
      caption: "(2,2) is E. One letter left.",
      grid: board({
        "0,0": "window",
        "0,1": "window",
        "0,2": "window",
        "1,2": "window",
        "2,2": "active",
      }),
      note: "k = 4 · ABCCE",
    },
    {
      kind: "grid",
      title: "Left → D",
      caption: "(2,1) is D — completes ABCCED. Return true up the stack.",
      grid: board({
        "0,0": "match",
        "0,1": "match",
        "0,2": "match",
        "1,2": "match",
        "2,2": "match",
        "2,1": "match",
      }),
      note: "found",
    },
    {
      kind: "grid",
      title: "Backtrack undoes marks",
      caption: "If a branch fails, unmark cells so a later starting point can reuse them. Choose → recurse → undo.",
      grid: board({ "0,0": "skip", "1,0": "active" }),
      note: "try other starts if needed",
    },
  ];
}

export const permutationsSolution: ProblemSolution = {
  approach:
    "Backtracking over unused indices: push, recurse, pop. used[] (or swap-in-place) prevents repeats. O(n·n!) time, O(n) depth.",
  templates: langs(
    `def permute(nums):
    out, used = [], [False] * len(nums)
    def dfs(path):
        if len(path) == len(nums):
            out.append(path[:]); return
        for i, x in enumerate(nums):
            if used[i]: continue
            used[i] = True; path.append(x)
            dfs(path)
            path.pop(); used[i] = False
    dfs([])
    return out`,
    `vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> out; vector<int> path, used(nums.size());
    function<void()> dfs = [&]() {
        if (path.size() == nums.size()) { out.push_back(path); return; }
        for (int i = 0; i < (int)nums.size(); i++) {
            if (used[i]) continue;
            used[i] = 1; path.push_back(nums[i]);
            dfs();
            path.pop_back(); used[i] = 0;
        }
    };
    dfs(); return out;
}`,
    `List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> out = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    class D { void dfs() {
        if (path.size() == nums.length) { out.add(new ArrayList<>(path)); return; }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true; path.add(nums[i]);
            dfs();
            path.remove(path.size() - 1); used[i] = false;
        }
    }}
    new D().dfs(); return out;
}`,
    `function permute(nums) {
  const out = [], used = Array(nums.length).fill(false);
  function dfs(path) {
    if (path.length === nums.length) { out.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      dfs(path);
      path.pop(); used[i] = false;
    }
  }
  dfs([]);
  return out;
}`,
  ),
  frames: permutationsFrames(),
};

export const generateParenthesesSolution: ProblemSolution = {
  approach:
    "Backtrack on a char path: add '(' while open < n; add ')' while close < open. Record at length 2n. O(4ⁿ/√n) Catalan, O(n) depth.",
  templates: langs(
    `def generateParenthesis(n):
    out = []
    def dfs(path, open_, close):
        if len(path) == 2 * n:
            out.append("".join(path)); return
        if open_ < n:
            path.append("("); dfs(path, open_ + 1, close); path.pop()
        if close < open_:
            path.append(")"); dfs(path, open_, close + 1); path.pop()
    dfs([], 0, 0)
    return out`,
    `vector<string> generateParenthesis(int n) {
    vector<string> out; string path;
    function<void(int,int)> dfs = [&](int open, int close) {
        if ((int)path.size() == 2 * n) { out.push_back(path); return; }
        if (open < n) { path.push_back('('); dfs(open + 1, close); path.pop_back(); }
        if (close < open) { path.push_back(')'); dfs(open, close + 1); path.pop_back(); }
    };
    dfs(0, 0); return out;
}`,
    `List<String> generateParenthesis(int n) {
    List<String> out = new ArrayList<>();
    StringBuilder path = new StringBuilder();
    class D { void dfs(int open, int close) {
        if (path.length() == 2 * n) { out.add(path.toString()); return; }
        if (open < n) { path.append('('); dfs(open + 1, close); path.deleteCharAt(path.length() - 1); }
        if (close < open) { path.append(')'); dfs(open, close + 1); path.deleteCharAt(path.length() - 1); }
    }}
    new D().dfs(0, 0); return out;
}`,
    `function generateParenthesis(n) {
  const out = [];
  function dfs(path, open, close) {
    if (path.length === 2 * n) { out.push(path.join("")); return; }
    if (open < n) { path.push("("); dfs(path, open + 1, close); path.pop(); }
    if (close < open) { path.push(")"); dfs(path, open, close + 1); path.pop(); }
  }
  dfs([], 0, 0);
  return out;
}`,
  ),
  frames: generateParenthesesFrames(),
};

export const wordSearchSolution: ProblemSolution = {
  approach:
    "DFS from each cell matching word[k]; mark visited, explore 4 dirs, unmark on backtrack. O(m·n·4^L) time, O(L) stack.",
  templates: langs(
    `def exist(board, word):
    R, C = len(board), len(board[0])
    def dfs(r, c, k):
        if k == len(word): return True
        if r < 0 or c < 0 or r >= R or c >= C or board[r][c] != word[k]:
            return False
        board[r][c] = "#"
        ok = (dfs(r+1,c,k+1) or dfs(r-1,c,k+1) or
              dfs(r,c+1,k+1) or dfs(r,c-1,k+1))
        board[r][c] = word[k]
        return ok
    return any(dfs(r, c, 0) for r in range(R) for c in range(C))`,
    `bool exist(vector<vector<char>>& board, string word) {
    int R = board.size(), C = board[0].size();
    function<bool(int,int,int)> dfs = [&](int r, int c, int k) {
        if (k == (int)word.size()) return true;
        if (r < 0 || c < 0 || r >= R || c >= C || board[r][c] != word[k]) return false;
        char ch = board[r][c]; board[r][c] = '#';
        bool ok = dfs(r+1,c,k+1)||dfs(r-1,c,k+1)||dfs(r,c+1,k+1)||dfs(r,c-1,k+1);
        board[r][c] = ch; return ok;
    };
    for (int r = 0; r < R; r++) for (int c = 0; c < C; c++)
        if (dfs(r, c, 0)) return true;
    return false;
}`,
    `boolean exist(char[][] board, String word) {
    int R = board.length, C = board[0].length;
    return new Object() {
        boolean dfs(int r, int c, int k) {
            if (k == word.length()) return true;
            if (r < 0 || c < 0 || r >= R || c >= C || board[r][c] != word.charAt(k)) return false;
            char ch = board[r][c]; board[r][c] = '#';
            boolean ok = dfs(r+1,c,k+1)||dfs(r-1,c,k+1)||dfs(r,c+1,k+1)||dfs(r,c-1,k+1);
            board[r][c] = ch; return ok;
        }
        boolean run() {
            for (int r = 0; r < R; r++) for (int c = 0; c < C; c++)
                if (dfs(r, c, 0)) return true;
            return false;
        }
    }.run();
}`,
    `function exist(board, word) {
  const R = board.length, C = board[0].length;
  function dfs(r, c, k) {
    if (k === word.length) return true;
    if (r < 0 || c < 0 || r >= R || c >= C || board[r][c] !== word[k]) return false;
    const ch = board[r][c]; board[r][c] = "#";
    const ok = dfs(r+1,c,k+1)||dfs(r-1,c,k+1)||dfs(r,c+1,k+1)||dfs(r,c-1,k+1);
    board[r][c] = ch; return ok;
  }
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++)
    if (dfs(r, c, 0)) return true;
  return false;
}`,
  ),
  frames: wordSearchFrames(),
};

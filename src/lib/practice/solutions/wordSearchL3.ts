import type { CellTone, Frame, TreeNode } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

type Cell = { value: string; tone?: CellTone };

function gridFrame(title: string, caption: string, grid: Cell[][], note?: string): Frame {
  return { kind: "grid", title, caption, grid, ...(note ? { note } : {}) };
}

function board(tones: Record<string, CellTone> = {}): Cell[][] {
  const raw = [
    ["C", "A", "X"],
    ["Z", "T", "P"],
  ];
  return raw.map((row, r) =>
    row.map((value, c) => ({ value, tone: tones[`${r},${c}`] ?? "idle" })),
  );
}

function wordSearchL3Frames(): Frame[] {
  return [
    gridFrame("Board · find CAT", "DFS from every cell. Match word[k]; mark visited, recurse 4 dirs, unmark.", board(), "word=CAT"),
    gridFrame("Start at C", "board[0][0] matches C. Mark and advance k=1.", board({ "0,0": "active" }), "k=0"),
    gridFrame("C → A", "Neighbor A continues prefix CA.", board({ "0,0": "done", "0,1": "active" }), "k=1"),
    gridFrame("A → T", "Down to T completes CAT.", board({ "0,0": "match", "0,1": "match", "1,1": "match" }), "found"),
    gridFrame("Backtrack marks", "Unmark on return so other paths can reuse cells.", board({ "0,0": "window", "0,1": "window" }), "restore"),
    gridFrame("Dead start", "Starting at X fails immediately — no path spells CAT.", board({ "0,2": "skip" }), "try next"),
  ];
}

function wordSearchIIFrames(): Frame[] {
  return [
    gridFrame(
      "Many words",
      "Build a trie of all words. DFS the board once; prune when prefix missing in the trie.",
      board(),
      "words=[CAT,CAP]",
    ),
    {
      kind: "tree",
      title: "Trie of words",
      caption: "Shared prefixes (CA) collapse. Terminal nodes hold the full word for collection.",
      treeNodes: [
        { id: "rt", label: "·", x: 50, y: 16 },
        { id: "c", label: "c", x: 50, y: 40 },
        { id: "ca", label: "a", x: 50, y: 64 },
        { id: "cat", label: "t*", x: 32, y: 88 },
        { id: "cap", label: "p*", x: 68, y: 88 },
      ],
      treeEdges: [
        { from: "rt", to: "c" },
        { from: "c", to: "ca" },
        { from: "ca", to: "cat" },
        { from: "ca", to: "cap" },
      ],
      note: "shared CA",
    },
    gridFrame("DFS + trie node", "From C move to child c in trie. From A to ca.", board({ "0,0": "done", "0,1": "active" }), "node=ca"),
    gridFrame("Hit CAT", "Child t* is a word — record CAT, optionally wipe word to avoid dupes.", board({ "0,0": "match", "0,1": "match", "1,1": "match" }), "CAT"),
    gridFrame("Also CAP?", "From ca, p is off the board path here — no CAP from this start.", board({ "0,0": "window", "0,1": "window", "1,2": "skip" }), "prune"),
    gridFrame("Answer set", "Collect unique words found. Trie pruning beats checking each word alone.", board({ "0,0": "done", "0,1": "done", "1,1": "done" }), "CAT"),
  ];
}

const triePos: TreeNode[] = [
  { id: "rt", label: "·", x: 50, y: 12 },
  { id: "c", label: "c", x: 32, y: 38 },
  { id: "a", label: "a", x: 68, y: 38 },
  { id: "ca", label: "a", x: 32, y: 64 },
  { id: "ap", label: "p", x: 68, y: 64 },
  { id: "cat", label: "t*", x: 32, y: 88 },
  { id: "app", label: "p*", x: 68, y: 88 },
];
const trieEdges = [
  { from: "rt", to: "c" },
  { from: "rt", to: "a" },
  { from: "c", to: "ca" },
  { from: "a", to: "ap" },
  { from: "ca", to: "cat" },
  { from: "ap", to: "app" },
];

function implementTrieWordSearchFrames(): Frame[] {
  return [
    {
      kind: "tree",
      title: "Trie for board search",
      caption: "Same structure as Implement Trie — insert every dictionary word before DFS.",
      treeNodes: triePos.map((n) => ({ ...n, tone: "idle" as CellTone })),
      treeEdges: trieEdges,
      note: "build",
    },
    {
      kind: "tree",
      title: "Insert CAT",
      caption: "c→a→t*. Word pointer stored at terminal for Word Search II.",
      treeNodes: triePos.map((n) => ({
        ...n,
        tone: (n.id === "cat" ? "match" : n.id === "c" || n.id === "ca" ? "window" : "idle") as CellTone,
      })),
      treeEdges: trieEdges,
      note: "CAT",
    },
    {
      kind: "tree",
      title: "Prefix prune",
      caption: "If board letter has no child, stop DFS — no word continues this path.",
      treeNodes: triePos.map((n) => ({
        ...n,
        tone: (n.id === "ca" ? "skip" : "idle") as CellTone,
      })),
      treeEdges: trieEdges,
      note: "dead prefix",
    },
    gridFrame("Board cell ↔ trie", "Each step: node = node.child[board[r][c]].", board({ "0,0": "active" }), "sync"),
    {
      kind: "tree",
      title: "Terminal hit",
      caption: "When node.word is set, push to answer and clear to avoid duplicates.",
      treeNodes: triePos.map((n) => ({
        ...n,
        tone: (n.id === "cat" ? "match" : "idle") as CellTone,
      })),
      treeEdges: trieEdges,
      note: "collect",
    },
    {
      kind: "tree",
      title: "Optional trim",
      caption: "If a node loses all children after collecting, delete it to speed later DFS.",
      treeNodes: [{ id: "rt", label: "·", x: 50, y: 50, tone: "done" }],
      treeEdges: [],
      note: "cleanup",
    },
  ];
}

export const wordSearchL3Solution: ProblemSolution = {
  approach:
    "DFS from each cell matching word[k]; mark, explore 4 dirs, unmark. O(m·n·4^L) time, O(L) stack.",
  templates: langs(
    `def exist(board, word):
    m, n = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word): return True
        if not (0 <= r < m and 0 <= c < n) or board[r][c] != word[i]:
            return False
        board[r][c] = "#"
        ok = any(dfs(r+dr, c+dc, i+1) for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)))
        board[r][c] = word[i]
        return ok
    return any(dfs(r, c, 0) for r in range(m) for c in range(n))`,
    `bool exist(vector<vector<char>>& board, string word) {
    int m = board.size(), n = board[0].size();
    function<bool(int,int,int)> dfs = [&](int r, int c, int i) {
        if (i == (int)word.size()) return true;
        if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] != word[i]) return false;
        char t = board[r][c]; board[r][c] = '#';
        bool ok = dfs(r+1,c,i+1)||dfs(r-1,c,i+1)||dfs(r,c+1,i+1)||dfs(r,c-1,i+1);
        board[r][c] = t; return ok;
    };
    for (int r = 0; r < m; r++) for (int c = 0; c < n; c++)
        if (dfs(r, c, 0)) return true;
    return false;
}`,
    `boolean exist(char[][] board, String word) {
    int m = board.length, n = board[0].length;
    return new Object() {
        boolean dfs(int r, int c, int i) {
            if (i == word.length()) return true;
            if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] != word.charAt(i)) return false;
            char t = board[r][c]; board[r][c] = '#';
            boolean ok = dfs(r+1,c,i+1)||dfs(r-1,c,i+1)||dfs(r,c+1,i+1)||dfs(r,c-1,i+1);
            board[r][c] = t; return ok;
        }
        boolean run() {
            for (int r = 0; r < m; r++) for (int c = 0; c < n; c++)
                if (dfs(r, c, 0)) return true;
            return false;
        }
    }.run();
}`,
    `function exist(board, word) {
  const m = board.length, n = board[0].length;
  function dfs(r, c, i) {
    if (i === word.length) return true;
    if (!(0 <= r && r < m && 0 <= c && c < n) || board[r][c] !== word[i]) return false;
    const t = board[r][c]; board[r][c] = "#";
    const ok = dfs(r+1,c,i+1)||dfs(r-1,c,i+1)||dfs(r,c+1,i+1)||dfs(r,c-1,i+1);
    board[r][c] = t; return ok;
  }
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++)
    if (dfs(r, c, 0)) return true;
  return false;
}`,
  ),
  frames: wordSearchL3Frames(),
};

export const wordSearchIISolution: ProblemSolution = {
  approach:
    "Insert all words into a trie. DFS the board once, advancing the trie node; record terminals and prune empty branches. Much faster than one DFS per word.",
  templates: langs(
    `def findWords(board, words):
    trie = {}
    for w in words:
        n = trie
        for c in w: n = n.setdefault(c, {})
        n["$"] = w
    m, n = len(board), len(board[0])
    out = []
    def dfs(r, c, node):
        ch = board[r][c]
        if ch not in node: return
        nxt = node[ch]
        if "$" in nxt:
            out.append(nxt.pop("$"))
        board[r][c] = "#"
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r+dr, c+dc
            if 0 <= nr < m and 0 <= nc < n: dfs(nr, nc, nxt)
        board[r][c] = ch
        if not nxt: node.pop(ch)
    for r in range(m):
        for c in range(n): dfs(r, c, trie)
    return out`,
    `struct Node {
    unordered_map<char, Node*> ch; string word;
};
void dfs(vector<vector<char>>& board, int r, int c, Node* node, vector<string>& out) {
    char ch = board[r][c];
    if (!node->ch.count(ch)) return;
    Node* nxt = node->ch[ch];
    if (!nxt->word.empty()) { out.push_back(nxt->word); nxt->word.clear(); }
    board[r][c] = '#';
    int m = board.size(), n = board[0].size();
    for (auto [dr, dc] : {pair{1,0},{-1,0},{0,1},{0,-1}}) {
        int nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n) dfs(board, nr, nc, nxt, out);
    }
    board[r][c] = ch;
    if (nxt->ch.empty()) node->ch.erase(ch);
}
vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
    Node root;
    for (auto& w : words) {
        Node* n = &root;
        for (char c : w) {
            if (!n->ch[c]) n->ch[c] = new Node();
            n = n->ch[c];
        }
        n->word = w;
    }
    vector<string> out;
    for (int r = 0; r < (int)board.size(); r++)
        for (int c = 0; c < (int)board[0].size(); c++)
            dfs(board, r, c, &root, out);
    return out;
}`,
    `class Node {
    Map<Character, Node> ch = new HashMap<>(); String word;
}
void dfs(char[][] board, int r, int c, Node node, List<String> out) {
    char ch = board[r][c];
    if (!node.ch.containsKey(ch)) return;
    Node nxt = node.ch.get(ch);
    if (nxt.word != null) { out.add(nxt.word); nxt.word = null; }
    board[r][c] = '#';
    int m = board.length, n = board[0].length;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int[] d : dirs) {
        int nr = r + d[0], nc = c + d[1];
        if (nr >= 0 && nr < m && nc >= 0 && nc < n) dfs(board, nr, nc, nxt, out);
    }
    board[r][c] = ch;
    if (nxt.ch.isEmpty()) node.ch.remove(ch);
}
List<String> findWords(char[][] board, String[] words) {
    Node root = new Node();
    for (String w : words) {
        Node n = root;
        for (char c : w.toCharArray()) n = n.ch.computeIfAbsent(c, k -> new Node());
        n.word = w;
    }
    List<String> out = new ArrayList<>();
    for (int r = 0; r < board.length; r++)
        for (int c = 0; c < board[0].length; c++)
            dfs(board, r, c, root, out);
    return out;
}`,
    `function findWords(board, words) {
  const trie = {};
  for (const w of words) {
    let n = trie;
    for (const c of w) n = n[c] ??= {};
    n.$ = w;
  }
  const m = board.length, n = board[0].length, out = [];
  function dfs(r, c, node) {
    const ch = board[r][c];
    if (!node[ch]) return;
    const nxt = node[ch];
    if (nxt.$) { out.push(nxt.$); delete nxt.$; }
    board[r][c] = "#";
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n) dfs(nr, nc, nxt);
    }
    board[r][c] = ch;
    if (!Object.keys(nxt).length) delete node[ch];
  }
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) dfs(r, c, trie);
  return out;
}`,
  ),
  frames: wordSearchIIFrames(),
};

export const implementTrieWordSearchSolution: ProblemSolution = {
  approach:
    "Standard trie insert/search used as the dictionary for board DFS. Prefix edges prune impossible paths early. O(L) per insert/walk.",
  templates: langs(
    `class Trie:
    def __init__(self):
        self.ch, self.end = {}, False
    def insert(self, word):
        n = self
        for c in word:
            n = n.ch.setdefault(c, Trie())
        n.end = True
    def search(self, word):
        n = self
        for c in word:
            if c not in n.ch: return False
            n = n.ch[c]
        return n.end`,
    `struct Trie {
    unordered_map<char, Trie*> ch; bool end = false;
    void insert(string word) {
        Trie* n = this;
        for (char c : word) {
            if (!n->ch[c]) n->ch[c] = new Trie();
            n = n->ch[c];
        }
        n->end = true;
    }
    bool search(string word) {
        Trie* n = this;
        for (char c : word) { if (!n->ch.count(c)) return false; n = n->ch[c]; }
        return n->end;
    }
};`,
    `class Trie {
    Map<Character, Trie> ch = new HashMap<>(); boolean end;
    void insert(String word) {
        Trie n = this;
        for (char c : word.toCharArray()) n = n.ch.computeIfAbsent(c, k -> new Trie());
        n.end = true;
    }
    boolean search(String word) {
        Trie n = this;
        for (char c : word.toCharArray()) {
            if (!n.ch.containsKey(c)) return false;
            n = n.ch.get(c);
        }
        return n.end;
    }
}`,
    `class Trie {
  constructor() { this.ch = new Map(); this.end = false; }
  insert(word) {
    let n = this;
    for (const c of word) { if (!n.ch.has(c)) n.ch.set(c, new Trie()); n = n.ch.get(c); }
    n.end = true;
  }
  search(word) {
    let n = this;
    for (const c of word) { if (!n.ch.has(c)) return false; n = n.ch.get(c); }
    return n.end;
  }
}`,
  ),
  frames: implementTrieWordSearchFrames(),
};

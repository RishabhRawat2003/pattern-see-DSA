import type { CellTone, Frame, TreeNode } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

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

function paint(ids: Record<string, CellTone>): TreeNode[] {
  return triePos.map((n) => ({ ...n, tone: ids[n.id] ?? "idle" }));
}

function tree(
  title: string,
  caption: string,
  ids: Record<string, CellTone>,
  edges: Frame["treeEdges"] = trieEdges,
  extra: Partial<Frame> = {},
): Frame {
  return {
    kind: "tree",
    title,
    caption,
    treeNodes: paint(ids),
    treeEdges: edges,
    ...extra,
  };
}

function implementTrieFrames(): Frame[] {
  return [
    {
      kind: "tree",
      title: "Empty root",
      caption: "Children map char → node. end flag marks a complete word.",
      treeNodes: [{ id: "rt", label: "·", x: 50, y: 50 }],
      treeEdges: [],
      note: "Trie()",
    },
    tree(
      "Insert CAT",
      "Walk/create c → a → t and set end=true on the last node.",
      { rt: "done", c: "window", ca: "window", cat: "match" },
      [
        { from: "rt", to: "c", tone: "match" },
        { from: "c", to: "ca", tone: "match" },
        { from: "ca", to: "cat", tone: "match" },
      ],
      { note: "CAT" },
    ),
    tree(
      "Insert APP",
      "Share root only. New branch a → p → p*.",
      { rt: "done", a: "window", ap: "window", app: "match", cat: "done" },
      trieEdges.map((e) =>
        e.from === "a" || e.from === "ap" || (e.from === "rt" && e.to === "a")
          ? { ...e, tone: "match" as CellTone }
          : e,
      ),
      { note: "APP" },
    ),
    tree(
      "Search CAT",
      "Follow c→a→t and check end. Found.",
      { c: "window", ca: "window", cat: "match" },
      undefined,
      { note: "true" },
    ),
    tree(
      "Search CAP",
      "c→a then p missing → false. startsWith CA would still be true.",
      { c: "window", ca: "skip" },
      [
        { from: "rt", to: "c", tone: "window" },
        { from: "c", to: "ca", tone: "skip" },
      ],
      { note: "false" },
    ),
    tree(
      "Prefix APP",
      "startsWith walks without requiring end — app node exists.",
      { a: "window", ap: "window", app: "match" },
      undefined,
      { note: "startsWith" },
    ),
  ];
}

function addAndSearchFrames(): Frame[] {
  return [
    tree(
      "Word dictionary",
      "Same trie insert. Search allows '.' to match any one child.",
      { cat: "match", app: "match" },
      undefined,
      { note: "addWord" },
    ),
    tree(
      "Search cat",
      "Exact walk — all letters match, end flag set.",
      { c: "window", ca: "window", cat: "match" },
      undefined,
      { note: "true" },
    ),
    tree(
      "Search c.t",
      "At '.': try every child of c. Child a continues; t completes.",
      { c: "active", ca: "window", cat: "match" },
      [
        { from: "rt", to: "c", tone: "match" },
        { from: "c", to: "ca", tone: "match" },
        { from: "ca", to: "cat", tone: "match" },
      ],
      { note: ". → a" },
    ),
    tree(
      "Search ..p",
      "Two wildcards: branch from root over c and a; only app ends with p*.",
      { a: "window", ap: "window", app: "match" },
      undefined,
      { note: "true" },
    ),
    tree(
      "Dead branch",
      "If no child matches the next letter (or '.' has no children), backtrack/fail.",
      { c: "skip" },
      undefined,
      { note: "false path" },
    ),
    tree(
      "DFS on '.' ",
      "Worst case branch factor 26 per dot — still fine for short words.",
      { rt: "active" },
      undefined,
      { note: "wildcard DFS" },
    ),
  ];
}

function mapSumFrames(): Frame[] {
  return [
    tree(
      "MapSum",
      "Insert key with value. Each node stores sum of values in its subtree (or recompute on query).",
      {},
      undefined,
      { note: "prefix sums" },
    ),
    tree(
      "Insert apple=3",
      "Walk a→p→p→l→e, set val=3; add 3 along the path (or store at leaf only).",
      { a: "window", ap: "window", app: "match" },
      undefined,
      { note: "val=3" },
    ),
    tree(
      "sum(ap)",
      "Walk to prefix node ap; return stored subtree sum (3).",
      { a: "done", ap: "active", app: "match" },
      undefined,
      { note: "sum=3" },
    ),
    tree(
      "Insert app=2",
      "Overwrite/add at app. Prefix ap now covers apple+app if both exist.",
      { a: "window", ap: "window", app: "update" },
      undefined,
      { note: "delta" },
    ),
    tree(
      "sum(ap) again",
      "Subtree sum under ap updates by the delta of the insert.",
      { ap: "match", app: "match" },
      undefined,
      { note: "sum updated" },
    ),
    tree(
      "Replace key",
      "If key existed, subtract old value then add new along the path.",
      { app: "hi" },
      undefined,
      { note: "upsert" },
    ),
  ];
}

export const implementTrieSolution: ProblemSolution = {
  approach:
    "Node = children map + end flag. insert/search/startsWith walk char by char, creating nodes on insert. O(L) per op.",
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
        return n.end
    def startsWith(self, prefix):
        n = self
        for c in prefix:
            if c not in n.ch: return False
            n = n.ch[c]
        return True`,
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
    bool startsWith(string prefix) {
        Trie* n = this;
        for (char c : prefix) { if (!n->ch.count(c)) return false; n = n->ch[c]; }
        return true;
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
        for (char c : word.toCharArray()) { if (!n.ch.containsKey(c)) return false; n = n.ch.get(c); }
        return n.end;
    }
    boolean startsWith(String prefix) {
        Trie n = this;
        for (char c : prefix.toCharArray()) { if (!n.ch.containsKey(c)) return false; n = n.ch.get(c); }
        return true;
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
  startsWith(prefix) {
    let n = this;
    for (const c of prefix) { if (!n.ch.has(c)) return false; n = n.ch.get(c); }
    return true;
  }
}`,
  ),
  frames: implementTrieFrames(),
};

export const addAndSearchWordsSolution: ProblemSolution = {
  approach:
    "Trie insert as usual. Search DFS: letter follows one edge; '.' tries every child. O(L) exact, O(26^L) worst with dots.",
  templates: langs(
    `class WordDictionary:
    def __init__(self):
        self.ch, self.end = {}, False
    def addWord(self, word):
        n = self
        for c in word:
            n = n.ch.setdefault(c, WordDictionary())
        n.end = True
    def search(self, word):
        def dfs(node, i):
            if i == len(word): return node.end
            c = word[i]
            if c == '.':
                return any(dfs(ch, i + 1) for ch in node.ch.values())
            if c not in node.ch: return False
            return dfs(node.ch[c], i + 1)
        return dfs(self, 0)`,
    `struct WordDictionary {
    unordered_map<char, WordDictionary*> ch; bool end = false;
    void addWord(string word) {
        WordDictionary* n = this;
        for (char c : word) {
            if (!n->ch[c]) n->ch[c] = new WordDictionary();
            n = n->ch[c];
        }
        n->end = true;
    }
    bool search(string word) { return dfs(this, word, 0); }
    bool dfs(WordDictionary* node, string& word, int i) {
        if (i == (int)word.size()) return node->end;
        char c = word[i];
        if (c == '.') {
            for (auto& [_, ch] : node->ch) if (dfs(ch, word, i + 1)) return true;
            return false;
        }
        if (!node->ch.count(c)) return false;
        return dfs(node->ch[c], word, i + 1);
    }
};`,
    `class WordDictionary {
    Map<Character, WordDictionary> ch = new HashMap<>(); boolean end;
    void addWord(String word) {
        WordDictionary n = this;
        for (char c : word.toCharArray()) n = n.ch.computeIfAbsent(c, k -> new WordDictionary());
        n.end = true;
    }
    boolean search(String word) { return dfs(this, word, 0); }
    boolean dfs(WordDictionary node, String word, int i) {
        if (i == word.length()) return node.end;
        char c = word.charAt(i);
        if (c == '.') {
            for (WordDictionary ch : node.ch.values()) if (dfs(ch, word, i + 1)) return true;
            return false;
        }
        if (!node.ch.containsKey(c)) return false;
        return dfs(node.ch.get(c), word, i + 1);
    }
}`,
    `class WordDictionary {
  constructor() { this.ch = new Map(); this.end = false; }
  addWord(word) {
    let n = this;
    for (const c of word) { if (!n.ch.has(c)) n.ch.set(c, new WordDictionary()); n = n.ch.get(c); }
    n.end = true;
  }
  search(word) {
    const dfs = (node, i) => {
      if (i === word.length) return node.end;
      const c = word[i];
      if (c === ".") {
        for (const ch of node.ch.values()) if (dfs(ch, i + 1)) return true;
        return false;
      }
      if (!node.ch.has(c)) return false;
      return dfs(node.ch.get(c), i + 1);
    };
    return dfs(this, 0);
  }
}`,
  ),
  frames: addAndSearchFrames(),
};

export const mapSumPairsSolution: ProblemSolution = {
  approach:
    "Trie stores value at key end; on insert apply delta along the path (or store sum on each node). sum(prefix) = node.sum after walking prefix. O(L) per op.",
  templates: langs(
    `class MapSum:
    def __init__(self):
        self.ch, self.val, self.sum = {}, 0, 0
        self.vals = {}
    def insert(self, key, val):
        delta = val - self.vals.get(key, 0)
        self.vals[key] = val
        n = self
        for c in key:
            n = n.ch.setdefault(c, MapSum())
            n.sum += delta
        n.val = val
    def sum(self, prefix):
        n = self
        for c in prefix:
            if c not in n.ch: return 0
            n = n.ch[c]
        return n.sum`,
    `class MapSum {
    unordered_map<char, MapSum*> ch; unordered_map<string,int> vals;
    int sumv = 0;
    void insert(string key, int val) {
        int delta = val - (vals.count(key) ? vals[key] : 0);
        vals[key] = val;
        MapSum* n = this;
        for (char c : key) {
            if (!n->ch[c]) n->ch[c] = new MapSum();
            n = n->ch[c]; n->sumv += delta;
        }
    }
    int sum(string prefix) {
        MapSum* n = this;
        for (char c : prefix) { if (!n->ch.count(c)) return 0; n = n->ch[c]; }
        return n->sumv;
    }
};`,
    `class MapSum {
    Map<Character, MapSum> ch = new HashMap<>();
    Map<String, Integer> vals = new HashMap<>();
    int sumv;
    void insert(String key, int val) {
        int delta = val - vals.getOrDefault(key, 0);
        vals.put(key, val);
        MapSum n = this;
        for (char c : key.toCharArray()) {
            n = n.ch.computeIfAbsent(c, k -> new MapSum());
            n.sumv += delta;
        }
    }
    int sum(String prefix) {
        MapSum n = this;
        for (char c : prefix.toCharArray()) {
            if (!n.ch.containsKey(c)) return 0;
            n = n.ch.get(c);
        }
        return n.sumv;
    }
}`,
    `class MapSum {
  constructor() { this.ch = new Map(); this.vals = new Map(); this.sumv = 0; }
  insert(key, val) {
    const delta = val - (this.vals.get(key) || 0);
    this.vals.set(key, val);
    let n = this;
    for (const c of key) {
      if (!n.ch.has(c)) n.ch.set(c, new MapSum());
      n = n.ch.get(c); n.sumv += delta;
    }
  }
  sum(prefix) {
    let n = this;
    for (const c of prefix) { if (!n.ch.has(c)) return 0; n = n.ch.get(c); }
    return n.sumv;
  }
}`,
  ),
  frames: mapSumFrames(),
};

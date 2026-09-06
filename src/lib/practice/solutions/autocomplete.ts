import type { CellTone, Frame, TreeNode } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";
import { arrayFrame } from "../../demos/problems/helpers";

const triePos: TreeNode[] = [
  { id: "rt", label: "·", x: 50, y: 12 },
  { id: "c", label: "c", x: 28, y: 38 },
  { id: "m", label: "m", x: 50, y: 38 },
  { id: "u", label: "u", x: 72, y: 38 },
  { id: "ca", label: "a", x: 18, y: 62 },
  { id: "mo", label: "o", x: 50, y: 62 },
  { id: "ug", label: "g", x: 78, y: 62 },
  { id: "cat", label: "t*", x: 18, y: 86 },
  { id: "mou", label: "u", x: 42, y: 86 },
  { id: "mouse", label: "s*", x: 58, y: 86 },
];

function paint(ids: Record<string, CellTone>, nodes = triePos): TreeNode[] {
  return nodes.map((n) => ({ ...n, tone: ids[n.id] ?? "idle" }));
}

function searchSuggestionsFrames(): Frame[] {
  const products = ["mobile", "mouse", "moneypot", "monitor", "mousepad"];
  return [
    arrayFrame(
      "products sorted",
      "Sort dictionary. For each typed prefix, binary-search the first product ≥ prefix and take up to 3 matches.",
      products.slice(0, 5),
      {},
      { note: "sorted" },
    ),
    {
      kind: "tree",
      title: "Or use a trie",
      caption: "Insert all products. After each keystroke walk the prefix node and DFS the next 3 words.",
      treeNodes: paint({ m: "active", mo: "window" }),
      treeEdges: [
        { from: "rt", to: "m" },
        { from: "m", to: "mo" },
        { from: "mo", to: "mou" },
        { from: "mou", to: "mouse" },
      ],
      note: "prefix m",
    },
    arrayFrame(
      "Type 'm'",
      "Suggestions: mobile, moneypot, monitor (lex smallest 3 with prefix m).",
      ["mobile", "moneypot", "monitor"],
      { 0: "match", 1: "match", 2: "match" },
      { note: "3 suggestions" },
    ),
    arrayFrame(
      "Type 'mo'",
      "Still mobile, moneypot, monitor — mouse comes later lexicographically.",
      ["mobile", "moneypot", "monitor"],
      { 0: "match", 1: "window", 2: "window" },
      { note: "prefix mo" },
    ),
    arrayFrame(
      "Type 'mou'",
      "Only mouse / mousepad left. Return those (≤3).",
      ["mouse", "mousepad"],
      { 0: "match", 1: "match" },
      { note: "prefix mou" },
    ),
    arrayFrame(
      "Type 'mouse'",
      "Both still match. Done after |searchWord| steps.",
      ["mouse", "mousepad"],
      { 0: "done", 1: "done" },
      { note: "done" },
    ),
  ];
}

function implementTrieAutocompleteFrames(): Frame[] {
  const edges = [
    { from: "rt", to: "c" },
    { from: "rt", to: "a" },
    { from: "c", to: "ca" },
    { from: "a", to: "ap" },
    { from: "ca", to: "cat" },
    { from: "ap", to: "app" },
  ];
  const nodes: TreeNode[] = [
    { id: "rt", label: "·", x: 50, y: 12 },
    { id: "c", label: "c", x: 32, y: 38 },
    { id: "a", label: "a", x: 68, y: 38 },
    { id: "ca", label: "a", x: 32, y: 64 },
    { id: "ap", label: "p", x: 68, y: 64 },
    { id: "cat", label: "t*", x: 32, y: 88 },
    { id: "app", label: "p*", x: 68, y: 88 },
  ];
  return [
    {
      kind: "tree",
      title: "Autocomplete trie",
      caption: "Insert dictionary words. Prefix walk + subtree DFS yields suggestions.",
      treeNodes: nodes,
      treeEdges: edges,
    },
    {
      kind: "tree",
      title: "Prefix ca",
      caption: "Walk to node ca. Collect every terminal below.",
      treeNodes: paint({ c: "window", ca: "active", cat: "match" }, nodes),
      treeEdges: edges.map((e) =>
        e.from === "c" || e.from === "ca" ? { ...e, tone: "match" as CellTone } : e,
      ),
      cells: [{ value: "cat", tone: "match" }],
      note: "ca → cat",
    },
    {
      kind: "tree",
      title: "Prefix a",
      caption: "Subtree under a includes app.",
      treeNodes: paint({ a: "active", ap: "window", app: "match" }, nodes),
      treeEdges: edges,
      cells: [{ value: "app", tone: "match" }],
    },
    {
      kind: "tree",
      title: "Missing prefix",
      caption: "If a letter has no child, suggestions list is empty for that keystroke onward.",
      treeNodes: paint({ c: "skip" }, nodes),
      treeEdges: edges,
      note: "[]",
    },
    {
      kind: "tree",
      title: "Rank by frequency",
      caption: "Optional: store counts at terminals and sort suggestions by count then lex.",
      treeNodes: paint({ cat: "hi", app: "lo" }, nodes),
      treeEdges: edges,
      note: "hotness",
    },
    {
      kind: "tree",
      title: "Ready for UI",
      caption: "Same trie powers search-as-you-type and replace-words roots.",
      treeNodes: paint({ rt: "done" }, nodes),
      treeEdges: edges,
    },
  ];
}

function replaceWordsFrames(): Frame[] {
  return [
    {
      kind: "tree",
      title: "Dictionary roots",
      caption: "Insert roots into a trie. For each sentence word, take the shortest root prefix.",
      treeNodes: [
        { id: "rt", label: "·", x: 50, y: 16 },
        { id: "c", label: "c", x: 30, y: 45 },
        { id: "ca", label: "a*", x: 30, y: 75 },
        { id: "b", label: "b", x: 70, y: 45 },
        { id: "ba", label: "a*", x: 70, y: 75 },
      ],
      treeEdges: [
        { from: "rt", to: "c" },
        { from: "c", to: "ca" },
        { from: "rt", to: "b" },
        { from: "b", to: "ba" },
      ],
      note: "roots: cat, bat",
    },
    arrayFrame(
      "Sentence",
      "the cattle was rattled by the battery",
      ["the", "cattle", "was", "rattled", "by", "the", "battery"],
      { 1: "active", 6: "active" },
      { note: "scan words" },
    ),
    arrayFrame(
      "cattle → cat",
      "Walk trie on cattle; hit end at cat — replace with root cat.",
      ["the", "cat", "was", "rattled", "by", "the", "battery"],
      { 1: "match" },
      { note: "shortest root" },
    ),
    arrayFrame(
      "battery → bat",
      "Same for battery → bat. Words without a root stay unchanged.",
      ["the", "cat", "was", "rattled", "by", "the", "bat"],
      { 1: "done", 6: "match" },
      { note: "bat" },
    ),
    arrayFrame(
      "No root",
      "rattled has no dictionary prefix — leave as-is.",
      ["the", "cat", "was", "rattled", "by", "the", "bat"],
      { 3: "skip" },
      { note: "keep" },
    ),
    arrayFrame(
      "Answer",
      "Join replaced tokens: the cat was rattled by the bat.",
      ["the", "cat", "was", "rattled", "by", "the", "bat"],
      { 0: "done", 1: "done", 2: "done", 3: "done", 4: "done", 5: "done", 6: "done" },
      { note: "done" },
    ),
  ];
}

export const searchSuggestionsSystemSolution: ProblemSolution = {
  approach:
    "Sort products. For each growing prefix of searchWord, binary-search the first ≥ prefix and collect up to 3 matching products. O(n log n + |s|·n) or trie O(total chars).",
  templates: langs(
    `from bisect import bisect_left
def suggestedProducts(products, searchWord):
    products.sort()
    out, pref = [], ""
    for ch in searchWord:
        pref += ch
        i = bisect_left(products, pref)
        sug = []
        for j in range(i, min(i + 3, len(products))):
            if products[j].startswith(pref): sug.append(products[j])
            else: break
        out.append(sug)
    return out`,
    `vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
    sort(products.begin(), products.end());
    vector<vector<string>> out;
    string pref;
    for (char ch : searchWord) {
        pref += ch;
        auto it = lower_bound(products.begin(), products.end(), pref);
        vector<string> sug;
        for (int k = 0; k < 3 && it + k < products.end(); k++) {
            if ((*(it + k)).compare(0, pref.size(), pref) == 0) sug.push_back(*(it + k));
            else break;
        }
        out.push_back(sug);
    }
    return out;
}`,
    `List<List<String>> suggestedProducts(String[] products, String searchWord) {
    Arrays.sort(products);
    List<List<String>> out = new ArrayList<>();
    String pref = "";
    for (char ch : searchWord.toCharArray()) {
        pref += ch;
        int i = Arrays.binarySearch(products, pref);
        if (i < 0) i = -i - 1;
        List<String> sug = new ArrayList<>();
        for (int j = i; j < Math.min(i + 3, products.length); j++) {
            if (products[j].startsWith(pref)) sug.add(products[j]);
            else break;
        }
        out.add(sug);
    }
    return out;
}`,
    `function suggestedProducts(products, searchWord) {
  products = [...products].sort();
  const out = [];
  let pref = "";
  for (const ch of searchWord) {
    pref += ch;
    let lo = 0, hi = products.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (products[mid] < pref) lo = mid + 1; else hi = mid;
    }
    const sug = [];
    for (let j = lo; j < Math.min(lo + 3, products.length); j++) {
      if (products[j].startsWith(pref)) sug.push(products[j]);
      else break;
    }
    out.push(sug);
  }
  return out;
}`,
  ),
  frames: searchSuggestionsFrames(),
};

export const implementTrieAutocompleteSolution: ProblemSolution = {
  approach:
    "Classic trie with insert/search/startsWith. Autocomplete walks the prefix node then DFS/BFS terminals in the subtree. O(L) walk + O(output).",
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
  frames: implementTrieAutocompleteFrames(),
};

export const replaceWordsSolution: ProblemSolution = {
  approach:
    "Insert dictionary roots in a trie. For each sentence word, walk until a terminal root or mismatch; replace with the shortest root found. O(total chars).",
  templates: langs(
    `def replaceWords(dictionary, sentence):
    trie = {}
    for w in dictionary:
        n = trie
        for c in w: n = n.setdefault(c, {})
        n["$"] = True
    def root(word):
        n, pref = trie, []
        for c in word:
            if c not in n: return word
            pref.append(c); n = n[c]
            if "$" in n: return "".join(pref)
        return word
    return " ".join(root(w) for w in sentence.split())`,
    `struct Node { unordered_map<char, Node*> ch; bool end = false; };
string replaceWords(vector<string>& dictionary, string sentence) {
    Node root;
    for (auto& w : dictionary) {
        Node* n = &root;
        for (char c : w) {
            if (!n->ch[c]) n->ch[c] = new Node();
            n = n->ch[c];
        }
        n->end = true;
    }
    auto rootOf = [&](string word) {
        Node* n = &root; string pref;
        for (char c : word) {
            if (!n->ch.count(c)) return word;
            pref += c; n = n->ch[c];
            if (n->end) return pref;
        }
        return word;
    };
    stringstream ss(sentence); string w, out; bool first = true;
    while (ss >> w) { if (!first) out += ' '; first = false; out += rootOf(w); }
    return out;
}`,
    `class Node { Map<Character, Node> ch = new HashMap<>(); boolean end; }
String replaceWords(List<String> dictionary, String sentence) {
    Node root = new Node();
    for (String w : dictionary) {
        Node n = root;
        for (char c : w.toCharArray()) n = n.ch.computeIfAbsent(c, k -> new Node());
        n.end = true;
    }
    java.util.function.Function<String, String> rootOf = word -> {
        Node n = root; StringBuilder pref = new StringBuilder();
        for (char c : word.toCharArray()) {
            if (!n.ch.containsKey(c)) return word;
            pref.append(c); n = n.ch.get(c);
            if (n.end) return pref.toString();
        }
        return word;
    };
    String[] parts = sentence.split(" ");
    for (int i = 0; i < parts.length; i++) parts[i] = rootOf.apply(parts[i]);
    return String.join(" ", parts);
}`,
    `function replaceWords(dictionary, sentence) {
  const trie = {};
  for (const w of dictionary) {
    let n = trie;
    for (const c of w) n = n[c] ??= {};
    n.$ = true;
  }
  function root(word) {
    let n = trie, pref = "";
    for (const c of word) {
      if (!n[c]) return word;
      pref += c; n = n[c];
      if (n.$) return pref;
    }
    return word;
  }
  return sentence.split(" ").map(root).join(" ");
}`,
  ),
  frames: replaceWordsFrames(),
};

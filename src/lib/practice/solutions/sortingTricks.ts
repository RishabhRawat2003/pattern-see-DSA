import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";
import { threeSumSolution } from "./twoPointers";

export const sortingValidAnagramSolution: ProblemSolution = {
  approach:
    "Sort both strings' characters; equal sorted forms iff anagrams. O(n log n) time from sorting.",
  templates: langs(
    `def isAnagram(s, t):
    return sorted(s) == sorted(t)`,
    `bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;
    sort(s.begin(), s.end());
    sort(t.begin(), t.end());
    return s == t;
}`,
    `boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    char[] a = s.toCharArray(), b = t.toCharArray();
    Arrays.sort(a); Arrays.sort(b);
    return Arrays.equals(a, b);
}`,
    `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  return [...s].sort().join("") === [...t].sort().join("");
}`,
  ),
  frames: (() => {
    const s = ["a", "n", "a", "g", "r", "a", "m"];
    const t = ["n", "a", "g", "a", "r", "a", "m"];
    const sortedS = [...s].sort();
    const sortedT = [...t].sort();
    return [
      arrayFrame(
        "s = anagram",
        "Sorting trick: two strings are anagrams iff their sorted character sequences match.",
        s,
      ),
      arrayFrame("t = nagaram", "Second string before sorting.", t),
      arrayFrame(
        "Sort s",
        "After sort: a,a,a,g,m,n,r.",
        sortedS,
        { 0: "done", 1: "done", 2: "done" },
        { note: "sorted(s)" },
      ),
      arrayFrame(
        "Sort t",
        "Same multiset → same sorted string.",
        sortedT,
        { 0: "done", 1: "done", 2: "done" },
        { note: "sorted(t)" },
      ),
      arrayFrame(
        "Compare",
        "Identical sorted forms → true.",
        sortedS,
        {
          0: "match",
          1: "match",
          2: "match",
          3: "match",
          4: "match",
          5: "match",
          6: "match",
        },
        { note: "return true" },
      ),
    ];
  })(),
};

export const groupAnagramsSolution: ProblemSolution = {
  approach:
    "Sort each word as a key into a hashmap of lists; anagrams share the same sorted key. O(n · k log k).",
  templates: langs(
    `from collections import defaultdict
def groupAnagrams(strs):
    groups = defaultdict(list)
    for w in strs:
        groups["".join(sorted(w))].append(w)
    return list(groups.values())`,
    `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    for (auto& w : strs) {
        string key = w;
        sort(key.begin(), key.end());
        groups[key].push_back(w);
    }
    vector<vector<string>> out;
    for (auto& [_, v] : groups) out.push_back(v);
    return out;
}`,
    `List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();
    for (String w : strs) {
        char[] chars = w.toCharArray();
        Arrays.sort(chars);
        String key = new String(chars);
        groups.computeIfAbsent(key, k -> new ArrayList<>()).add(w);
    }
    return new ArrayList<>(groups.values());
}`,
    `function groupAnagrams(strs) {
  const groups = new Map();
  for (const w of strs) {
    const key = [...w].sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}`,
  ),
  frames: (() => {
    const words = ["eat", "tea", "tan", "ate", "nat", "bat"];
    return [
      arrayFrame(
        "Group anagrams",
        "Sort letters of each word to form a key; bucket words that share a key.",
        words,
      ),
      {
        kind: "hashmap" as const,
        title: "eat → key aet",
        caption: "sorted('eat') = 'aet'. Start a new bucket.",
        cells: words.map((value, i) => ({
          value,
          tone: i === 0 ? ("active" as const) : ("idle" as const),
        })),
        mapEntries: [{ key: "aet", value: "eat", tone: "active" as const }],
        pointers: [{ name: "i", index: 0, color: PTR.M }],
      },
      {
        kind: "hashmap" as const,
        title: "tea → same key aet",
        caption: "Anagram of eat — append to the aet bucket.",
        cells: words.map((value, i) => ({
          value,
          tone: i === 1 ? ("active" as const) : i === 0 ? ("done" as const) : ("idle" as const),
        })),
        mapEntries: [{ key: "aet", value: "eat,tea", tone: "match" as const }],
        pointers: [{ name: "i", index: 1, color: PTR.M }],
      },
      {
        kind: "hashmap" as const,
        title: "tan → key ant",
        caption: "New sorted key opens a second group.",
        cells: words.map((value, i) => ({
          value,
          tone: i === 2 ? ("active" as const) : i < 2 ? ("done" as const) : ("idle" as const),
        })),
        mapEntries: [
          { key: "aet", value: "eat,tea", tone: "idle" as const },
          { key: "ant", value: "tan", tone: "active" as const },
        ],
        pointers: [{ name: "i", index: 2, color: PTR.M }],
      },
      {
        kind: "hashmap" as const,
        title: "After all words",
        caption: "Three groups: [eat,tea,ate], [tan,nat], [bat].",
        cells: words.map((value) => ({ value, tone: "done" as const })),
        mapEntries: [
          { key: "aet", value: "eat,tea,ate", tone: "match" as const },
          { key: "ant", value: "tan,nat", tone: "match" as const },
          { key: "bat", value: "bat", tone: "match" as const },
        ],
        note: "return group lists",
      },
    ];
  })(),
};

export const sortingThreeSumSolution: ProblemSolution = {
  ...threeSumSolution,
  approach:
    "Sort first so adjacent/two-pointer scans work; then fix i and hunt pairs. O(n²).",
};

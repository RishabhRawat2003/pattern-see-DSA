import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function firstUniqueFrames(): Frame[] {
  const s = ["l", "e", "e", "t", "c", "o", "d", "e"];
  const map: Record<string, number> = {};
  const frames: Frame[] = [
    {
      kind: "hashmap",
      title: "Count characters",
      caption: "Pass 1: build a frequency map. Pass 2: first char with count 1.",
      cells: s.map((value) => ({ value })),
      mapEntries: [],
    },
  ];
  for (let i = 0; i < s.length; i++) {
    map[s[i]] = (map[s[i]] ?? 0) + 1;
    frames.push({
      kind: "hashmap",
      title: `Read '${s[i]}'`,
      caption: `Frequency of '${s[i]}' is now ${map[s[i]]}.`,
      cells: s.map((value, idx) => ({
        value,
        tone: idx === i ? "active" : idx < i ? "done" : "idle",
      })),
      mapEntries: Object.entries(map).map(([key, value]) => ({
        key,
        value: String(value),
        tone: key === s[i] ? "active" : "idle",
      })),
      pointers: [{ name: "i", index: i, color: PTR.M }],
    });
  }
  for (let i = 0; i < s.length; i++) {
    if (map[s[i]] === 1) {
      frames.push({
        kind: "hashmap",
        title: "First unique",
        caption: `'${s[i]}' at index ${i} is the first character with count 1.`,
        cells: s.map((value, idx) => ({
          value,
          tone: idx === i ? "match" : map[value] === 1 ? "window" : "skip",
        })),
        mapEntries: Object.entries(map).map(([key, value]) => ({
          key,
          value: String(value),
          tone: key === s[i] ? "match" : value === 1 ? "window" : "idle",
        })),
        note: `answer = ${i}`,
      });
      break;
    }
  }
  return frames;
}

function groupAnagramsFrames(): Frame[] {
  const words = ["eat", "tea", "tan", "ate", "nat", "bat"];
  const groups: Record<string, string[]> = {};
  const frames: Frame[] = [
    arrayFrame(
      "Group by signature",
      "Sort each word’s letters as a key. Anagrams share the same key.",
      words,
    ),
  ];
  for (let i = 0; i < words.length; i++) {
    const key = words[i].split("").sort().join("");
    if (!groups[key]) groups[key] = [];
    groups[key].push(words[i]);
    frames.push({
      kind: "hashmap",
      title: `Word '${words[i]}'`,
      caption: `Signature '${key}' → group ${JSON.stringify(groups[key])}.`,
      cells: words.map((value, idx) => ({
        value,
        tone: idx === i ? "active" : idx < i ? "done" : "idle",
      })),
      mapEntries: Object.entries(groups).map(([k, v]) => ({
        key: k,
        value: v.join(", "),
        tone: k === key ? "active" : "idle",
      })),
      pointers: [{ name: "i", index: i, color: PTR.M }],
    });
  }
  frames.push({
    kind: "hashmap",
    title: "Anagram groups",
    caption: "Each map value is one anagram group.",
    cells: words.map((value) => ({ value, tone: "done" })),
    mapEntries: Object.entries(groups).map(([k, v]) => ({
      key: k,
      value: v.join(", "),
      tone: "match",
    })),
  });
  return frames;
}

function sortByFrequencyFrames(): Frame[] {
  const s = ["t", "r", "e", "e"];
  const map: Record<string, number> = {};
  const frames: Frame[] = [
    {
      kind: "hashmap",
      title: "Frequency then emit",
      caption: "Count characters, sort keys by descending frequency, rebuild the string.",
      cells: s.map((value) => ({ value })),
      mapEntries: [],
    },
  ];
  for (let i = 0; i < s.length; i++) {
    map[s[i]] = (map[s[i]] ?? 0) + 1;
    frames.push({
      kind: "hashmap",
      title: `Count '${s[i]}'`,
      caption: `'${s[i]}' now appears ${map[s[i]]} time(s).`,
      cells: s.map((value, idx) => ({
        value,
        tone: idx === i ? "active" : idx < i ? "done" : "idle",
      })),
      mapEntries: Object.entries(map).map(([key, value]) => ({
        key,
        value: String(value),
        tone: key === s[i] ? "active" : "idle",
      })),
    });
  }
  const ordered = Object.entries(map).sort((a, b) => b[1] - a[1]);
  const result = ordered.map(([ch, c]) => ch.repeat(c)).join("");
  frames.push({
    kind: "hashmap",
    title: "Emit by frequency",
    caption: `Sorted by count: ${ordered.map(([ch, c]) => `${ch}×${c}`).join(", ")} → "${result}".`,
    cells: result.split("").map((value) => ({ value, tone: "match" })),
    mapEntries: ordered.map(([key, value], i) => ({
      key,
      value: String(value),
      tone: i === 0 ? "match" : "done",
    })),
    note: `answer = "${result}"`,
  });
  return frames;
}

export const firstUniqueCharacterSolution: ProblemSolution = {
  approach:
    "Count frequencies, then scan left-to-right for the first character with count 1. O(n) time, O(1) alphabet space.",
  templates: langs(
    `def firstUniqChar(s):
    from collections import Counter
    cnt = Counter(s)
    for i, ch in enumerate(s):
        if cnt[ch] == 1:
            return i
    return -1`,
    `int firstUniqChar(string s) {
    int cnt[26] = {};
    for (char ch : s) cnt[ch - 'a']++;
    for (int i = 0; i < (int)s.size(); i++)
        if (cnt[s[i] - 'a'] == 1) return i;
    return -1;
}`,
    `int firstUniqChar(String s) {
    int[] cnt = new int[26];
    for (char ch : s.toCharArray()) cnt[ch - 'a']++;
    for (int i = 0; i < s.length(); i++)
        if (cnt[s.charAt(i) - 'a'] == 1) return i;
    return -1;
}`,
    `function firstUniqChar(s) {
  const cnt = {};
  for (const ch of s) cnt[ch] = (cnt[ch] || 0) + 1;
  for (let i = 0; i < s.length; i++) if (cnt[s[i]] === 1) return i;
  return -1;
}`,
  ),
  frames: firstUniqueFrames(),
};

export const groupAnagramsSolution: ProblemSolution = {
  approach:
    "Key each string by its sorted letters (or a count tuple). Append into a map of lists. O(n · k log k) with sort keys.",
  templates: langs(
    `def groupAnagrams(strs):
    from collections import defaultdict
    groups = defaultdict(list)
    for w in strs:
        groups[''.join(sorted(w))].append(w)
    return list(groups.values())`,
    `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    for (auto& w : strs) {
        string key = w;
        sort(key.begin(), key.end());
        groups[key].push_back(w);
    }
    vector<vector<string>> out;
    for (auto& [_, g] : groups) out.push_back(move(g));
    return out;
}`,
    `List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();
    for (String w : strs) {
        char[] arr = w.toCharArray();
        Arrays.sort(arr);
        String key = new String(arr);
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
  frames: groupAnagramsFrames(),
};

export const sortCharactersByFrequencySolution: ProblemSolution = {
  approach:
    "Build a frequency map, sort characters by count descending, then emit each char count times. O(n + σ log σ).",
  templates: langs(
    `def frequencySort(s):
    from collections import Counter
    cnt = Counter(s)
    return ''.join(ch * c for ch, c in cnt.most_common())`,
    `string frequencySort(string s) {
    int cnt[256] = {};
    for (unsigned char ch : s) cnt[ch]++;
    vector<pair<int,char>> items;
    for (int i = 0; i < 256; i++)
        if (cnt[i]) items.push_back({cnt[i], (char)i});
    sort(items.begin(), items.end(), greater<>());
    string out;
    for (auto [c, ch] : items) out.append(c, ch);
    return out;
}`,
    `String frequencySort(String s) {
    int[] cnt = new int[256];
    for (char ch : s.toCharArray()) cnt[ch]++;
    List<int[]> items = new ArrayList<>();
    for (int i = 0; i < 256; i++)
        if (cnt[i] > 0) items.add(new int[]{cnt[i], i});
    items.sort((a, b) -> b[0] - a[0]);
    StringBuilder out = new StringBuilder();
    for (int[] it : items)
        for (int k = 0; k < it[0]; k++) out.append((char)it[1]);
    return out.toString();
}`,
    `function frequencySort(s) {
  const cnt = {};
  for (const ch of s) cnt[ch] = (cnt[ch] || 0) + 1;
  return Object.entries(cnt)
    .sort((a, b) => b[1] - a[1])
    .map(([ch, c]) => ch.repeat(c))
    .join("");
}`,
  ),
  frames: sortByFrequencyFrames(),
};

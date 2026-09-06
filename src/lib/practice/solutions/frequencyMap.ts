import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const validAnagramSolution: ProblemSolution = {
  approach:
    "Count character frequencies of s, then decrement with t; all counts must return to zero. O(n) time, O(Σ) space.",
  templates: langs(
    `from collections import Counter
def isAnagram(s, t):
    return Counter(s) == Counter(t)`,
    `bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;
    int c[26] = {};
    for (char ch : s) c[ch - 'a']++;
    for (char ch : t) if (--c[ch - 'a'] < 0) return false;
    return true;
}`,
    `boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] c = new int[26];
    for (char ch : s.toCharArray()) c[ch - 'a']++;
    for (char ch : t.toCharArray()) if (--c[ch - 'a'] < 0) return false;
    return true;
}`,
    `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const c = {};
  for (const ch of s) c[ch] = (c[ch] || 0) + 1;
  for (const ch of t) {
    if (!c[ch]) return false;
    c[ch]--;
  }
  return true;
}`,
  ),
  frames: (() => {
    const s = ["a", "n", "a", "g", "r", "a", "m"];
    const t = ["n", "a", "g", "a", "r", "a", "m"];
    const map: Record<string, number> = {};
    const frames = [
      arrayFrame(
        "Frequency-map anagram",
        "Count letters of s, then subtract letters of t. Zero everywhere ⇒ anagram.",
        s,
      ),
    ];
    for (let i = 0; i < s.length; i++) {
      map[s[i]] = (map[s[i]] ?? 0) + 1;
      frames.push({
        kind: "hashmap",
        title: `Count '${s[i]}'`,
        caption: `Increment bucket ${s[i]} → ${map[s[i]]}.`,
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
    for (let i = 0; i < t.length; i++) {
      map[t[i]] = (map[t[i]] ?? 0) - 1;
      frames.push({
        kind: "hashmap",
        title: `Subtract '${t[i]}'`,
        caption:
          map[t[i]] === 0
            ? `Bucket ${t[i]} back to 0.`
            : `Decrement ${t[i]} → ${map[t[i]]}.`,
        cells: t.map((value, idx) => ({
          value,
          tone: idx === i ? "active" : idx < i ? "done" : "idle",
        })),
        mapEntries: Object.entries(map).map(([key, value]) => ({
          key,
          value: String(value),
          tone: key === t[i] ? (map[t[i]] === 0 ? "match" : "active") : "idle",
        })),
        pointers: [{ name: "i", index: i, color: PTR.R }],
      });
    }
    frames.push({
      kind: "hashmap",
      title: "Answer",
      caption: "Every count is 0 — strings are anagrams.",
      cells: t.map((value) => ({ value, tone: "match" as const })),
      mapEntries: Object.entries(map).map(([key, value]) => ({
        key,
        value: String(value),
        tone: "match" as const,
      })),
      note: "return true",
    });
    return frames;
  })(),
};

export const majorityElementSolution: ProblemSolution = {
  approach:
    "Frequency map (or Boyer–Moore): count occurrences; the majority element appears more than ⌊n/2⌋ times. O(n) time.",
  templates: langs(
    `from collections import Counter
def majorityElement(nums):
    return Counter(nums).most_common(1)[0][0]`,
    `int majorityElement(vector<int>& nums) {
    unordered_map<int,int> freq;
    int need = nums.size() / 2;
    for (int x : nums) if (++freq[x] > need) return x;
    return nums[0];
}`,
    `int majorityElement(int[] nums) {
    Map<Integer, Integer> freq = new HashMap<>();
    int need = nums.length / 2;
    for (int x : nums) {
        int c = freq.getOrDefault(x, 0) + 1;
        freq.put(x, c);
        if (c > need) return x;
    }
    return nums[0];
}`,
    `function majorityElement(nums) {
  const freq = new Map();
  const need = Math.floor(nums.length / 2);
  for (const x of nums) {
    const c = (freq.get(x) || 0) + 1;
    freq.set(x, c);
    if (c > need) return x;
  }
  return nums[0];
}`,
  ),
  frames: (() => {
    const a = [2, 2, 1, 1, 1, 2, 2];
    const need = Math.floor(a.length / 2);
    const freq: Record<number, number> = {};
    const frames = [
      arrayFrame(
        "Majority > ⌊n/2⌋",
        `n = ${a.length}, need > ${need}. Count with a frequency map until one key wins.`,
        a,
        {},
        { note: `need > ${need}` },
      ),
    ];
    for (let i = 0; i < a.length; i++) {
      const x = a[i];
      freq[x] = (freq[x] ?? 0) + 1;
      const won = freq[x] > need;
      frames.push({
        kind: "hashmap",
        title: `See ${x} at i = ${i}`,
        caption: won
          ? `Count(${x}) = ${freq[x]} > ${need}. Majority found.`
          : `Count(${x}) = ${freq[x]}. Keep scanning.`,
        cells: a.map((value, idx) => ({
          value,
          tone: idx === i ? "active" : idx < i ? "done" : "idle",
        })),
        mapEntries: Object.entries(freq).map(([key, value]) => ({
          key,
          value: String(value),
          tone: Number(key) === x ? (won ? "match" : "active") : "idle",
        })),
        pointers: [{ name: "i", index: i, color: PTR.M }],
        note: won ? `return ${x}` : undefined,
      });
      if (won) break;
    }
    frames.push(
      arrayFrame(
        "Answer",
        "2 appears 4 times (> 3). Return 2.",
        a,
        { 0: "match", 1: "match", 5: "match", 6: "match" },
        { note: "majority = 2" },
      ),
    );
    return frames;
  })(),
};

export const topKFrequentElementsSolution: ProblemSolution = {
  approach:
    "Build a frequency map, then bucket-sort by count (or heap) to pick the k most frequent keys. O(n) with buckets.",
  templates: langs(
    `from collections import Counter
def topKFrequent(nums, k):
    freq = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, c in freq.items():
        buckets[c].append(num)
    out = []
    for c in range(len(buckets) - 1, 0, -1):
        for num in buckets[c]:
            out.append(num)
            if len(out) == k:
                return out`,
    `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int x : nums) freq[x]++;
    vector<vector<int>> buckets(nums.size() + 1);
    for (auto& [num, c] : freq) buckets[c].push_back(num);
    vector<int> out;
    for (int c = (int)buckets.size() - 1; c >= 0 && (int)out.size() < k; c--)
        for (int num : buckets[c]) {
            out.push_back(num);
            if ((int)out.size() == k) return out;
        }
    return out;
}`,
    `List<Integer> topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
    List<Integer>[] buckets = new List[nums.length + 1];
    for (int i = 0; i < buckets.length; i++) buckets[i] = new ArrayList<>();
    for (var e : freq.entrySet()) buckets[e.getValue()].add(e.getKey());
    List<Integer> out = new ArrayList<>();
    for (int c = buckets.length - 1; c >= 0 && out.size() < k; c--)
        for (int num : buckets[c]) {
            out.add(num);
            if (out.size() == k) return out;
        }
    return out;
}`,
    `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, c] of freq) buckets[c].push(num);
  const out = [];
  for (let c = buckets.length - 1; c >= 0 && out.length < k; c--) {
    for (const num of buckets[c]) {
      out.push(num);
      if (out.length === k) return out;
    }
  }
  return out;
}`,
  ),
  frames: (() => {
    const a = [1, 1, 1, 2, 2, 3];
    const k = 2;
    return [
      arrayFrame(
        "Top k = 2 frequent",
        "Count frequencies first, then read from high-count buckets downward.",
        a,
        {},
        { note: "k = 2" },
      ),
      {
        kind: "hashmap" as const,
        title: "Frequency map",
        caption: "1 appears 3×, 2 appears 2×, 3 appears 1×.",
        cells: a.map((value, i) => ({
          value,
          tone: (i < 3 ? "window" : i < 5 ? "lo" : "hi") as "window" | "lo" | "hi",
        })),
        mapEntries: [
          { key: "1", value: "3", tone: "active" as const },
          { key: "2", value: "2", tone: "idle" as const },
          { key: "3", value: "1", tone: "idle" as const },
        ],
      },
      arrayFrame(
        "Buckets by count",
        "Index = frequency. buckets[3]=[1], buckets[2]=[2], buckets[1]=[3].",
        ["·", "3", "2", "1"],
        { 3: "active", 2: "lo", 1: "hi" },
        { note: "idx = count" },
      ),
      arrayFrame(
        "Collect from high count",
        "Take 1 from count 3, then 2 from count 2. Stop at k = 2.",
        [1, 2],
        { 0: "match", 1: "match" },
        {
          pointers: [
            { name: "1st", index: 0, color: PTR.L },
            { name: "2nd", index: 1, color: PTR.R },
          ],
          note: "answer [1, 2]",
        },
      ),
      arrayFrame(
        "Answer",
        "Top 2 frequent elements: 1 and 2.",
        [1, 2],
        { 0: "match", 1: "match" },
        { note: "return [1,2]" },
      ),
    ];
  })(),
};

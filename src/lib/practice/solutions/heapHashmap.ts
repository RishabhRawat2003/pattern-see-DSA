import { arrayFrame } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const topKFrequentHeapSolution: ProblemSolution = {
  approach:
    "Hashmap counts, then min-heap by frequency of size k (or nlargest). Heap+map is the classic heap-hashmap combo for top-k keys.",
  templates: langs(
    `from collections import Counter
import heapq
def topKFrequent(nums, k):
    freq = Counter(nums)
    return [x for x, _ in heapq.nlargest(k, freq.items(), key=lambda t: t[1])]`,
    `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int x : nums) freq[x]++;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> h;
    for (auto [x, c] : freq) {
        h.push({c, x});
        if ((int)h.size() > k) h.pop();
    }
    vector<int> out;
    while (!h.empty()) { out.push_back(h.top().second); h.pop(); }
    return out;
}`,
    `int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
    PriorityQueue<int[]> h = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    for (var e : freq.entrySet()) {
        h.offer(new int[]{e.getValue(), e.getKey()});
        if (h.size() > k) h.poll();
    }
    int[] out = new int[k];
    for (int i = 0; i < k; i++) out[i] = h.poll()[1];
    return out;
}`,
    `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(([x]) => x);
}`,
  ),
  frames: (() => {
    const s = [1, 1, 1, 2, 2, 3];
    const frames = [];
    const map: Record<string, number> = {};
    for (let i = 0; i < s.length; i++) {
      map[s[i]] = (map[s[i]] ?? 0) + 1;
      const heap = Object.entries(map).sort((a, b) => b[1] - a[1]);
      frames.push({
        kind: "hashmap" as const,
        title: `Count ${s[i]}`,
        caption: "Map holds frequencies; heap orders keys by count for top-k.",
        cells: s.map((value, idx) => ({
          value,
          tone: idx === i ? ("active" as const) : idx < i ? ("done" as const) : ("idle" as const),
        })),
        mapEntries: heap.map(([key, value], idx) => ({
          key,
          value: `${value}×`,
          tone: (idx === 0 ? "match" : key === String(s[i]) ? "active" : "idle") as
            | "match"
            | "active"
            | "idle",
        })),
      });
    }
    frames.push(
      arrayFrame("Top k=2", "Take the two highest-count keys: 1 then 2.", [1, 2], {
        0: "match",
        1: "match",
      }, { note: "return [1,2]" }),
    );
    return frames;
  })(),
};

export const sortByFrequencyHeapSolution: ProblemSolution = {
  approach:
    "Count character frequencies, push into a max-heap by count, then pop and append char×count. O(n + k log k).",
  templates: langs(
    `from collections import Counter
import heapq
def frequencySort(s):
    h = [(-c, ch) for ch, c in Counter(s).items()]
    heapq.heapify(h)
    out = []
    while h:
        c, ch = heapq.heappop(h)
        out.append(ch * (-c))
    return "".join(out)`,
    `string frequencySort(string s) {
    unordered_map<char,int> freq;
    for (char ch : s) freq[ch]++;
    priority_queue<pair<int,char>> h;
    for (auto [ch, c] : freq) h.push({c, ch});
    string out;
    while (!h.empty()) {
        auto [c, ch] = h.top(); h.pop();
        out.append(c, ch);
    }
    return out;
}`,
    `String frequencySort(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    for (char ch : s.toCharArray()) freq.put(ch, freq.getOrDefault(ch, 0) + 1);
    PriorityQueue<Map.Entry<Character, Integer>> h =
        new PriorityQueue<>((a, b) -> b.getValue() - a.getValue());
    h.addAll(freq.entrySet());
    StringBuilder out = new StringBuilder();
    while (!h.isEmpty()) {
        var e = h.poll();
        out.append(String.valueOf(e.getKey()).repeat(e.getValue()));
    }
    return out.toString();
}`,
    `function frequencySort(s) {
  const freq = new Map();
  for (const ch of s) freq.set(ch, (freq.get(ch) || 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([ch, c]) => ch.repeat(c))
    .join("");
}`,
  ),
  frames: (() => {
    const chars = ["t", "r", "e", "e"];
    return [
      arrayFrame("s = tree", "Count each char, then emit from a max-heap by frequency.", chars),
      {
        kind: "hashmap" as const,
        title: "Frequencies",
        caption: "e→2, t→1, r→1.",
        cells: chars.map((v) => ({ value: v })),
        mapEntries: [
          { key: "e", value: "2×", tone: "match" as const },
          { key: "t", value: "1×", tone: "idle" as const },
          { key: "r", value: "1×", tone: "idle" as const },
        ],
      },
      {
        kind: "stack" as const,
        title: "Max-heap by count",
        caption: "Root is most frequent: e.",
        cells: chars.map((v) => ({ value: v })),
        stackItems: [
          { value: "e@2", tone: "match" as const },
          { value: "t@1", tone: "idle" as const },
          { value: "r@1", tone: "idle" as const },
        ],
      },
      arrayFrame("Pop e → ee", "Append e twice.", ["e", "e"], { 0: "match", 1: "match" }),
      arrayFrame("Pop t, r", "Append remaining singles (order among ties OK).", ["e", "e", "t", "r"], {
        0: "done",
        1: "done",
        2: "active",
        3: "active",
      }, { note: '"eetr" or "eert"' }),
      arrayFrame("Answer", "Characters sorted by decreasing frequency.", ["e", "e", "t", "r"], {
        0: "match",
        1: "match",
        2: "match",
        3: "match",
      }),
    ];
  })(),
};

export const reorganizeStringSolution: ProblemSolution = {
  approach:
    "Max-heap by frequency; always place the most frequent char that isn’t the previous one (hold last used and push back). Fail if any count > (n+1)/2.",
  templates: langs(
    `from collections import Counter
import heapq
def reorganizeString(s):
    h = [(-c, ch) for ch, c in Counter(s).items()]
    heapq.heapify(h)
    out, prev = [], None
    while h:
        c, ch = heapq.heappop(h)
        out.append(ch)
        if prev:
            heapq.heappush(h, prev)
        prev = (c + 1, ch) if c + 1 else None
    return "".join(out) if len(out) == len(s) else ""`,
    `string reorganizeString(string s) {
    unordered_map<char,int> freq;
    for (char ch : s) freq[ch]++;
    priority_queue<pair<int,char>> h;
    for (auto [ch, c] : freq) h.push({c, ch});
    string out;
    pair<int,char> prev = {0, '#'};
    while (!h.empty()) {
        auto [c, ch] = h.top(); h.pop();
        out.push_back(ch);
        if (prev.first > 0) h.push(prev);
        prev = {c - 1, ch};
    }
    return (int)out.size() == (int)s.size() ? out : "";
}`,
    `String reorganizeString(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    for (char ch : s.toCharArray()) freq.put(ch, freq.getOrDefault(ch, 0) + 1);
    PriorityQueue<int[]> h = new PriorityQueue<>((a, b) -> b[0] - a[0]);
    for (var e : freq.entrySet()) h.offer(new int[]{e.getValue(), e.getKey()});
    StringBuilder out = new StringBuilder();
    int[] prev = null;
    while (!h.isEmpty()) {
        int[] cur = h.poll();
        out.append((char) cur[1]);
        if (prev != null) h.offer(prev);
        prev = cur[0] - 1 > 0 ? new int[]{cur[0] - 1, cur[1]} : null;
    }
    return out.length() == s.length() ? out.toString() : "";
}`,
    `function reorganizeString(s) {
  const freq = new Map();
  for (const ch of s) freq.set(ch, (freq.get(ch) || 0) + 1);
  const h = [...freq.entries()].map(([ch, c]) => [c, ch]);
  const out = [];
  let prev = null;
  while (h.length) {
    h.sort((a, b) => b[0] - a[0]);
    const [c, ch] = h.shift();
    out.push(ch);
    if (prev) h.push(prev);
    prev = c - 1 > 0 ? [c - 1, ch] : null;
  }
  return out.length === s.length ? out.join("") : "";
}`,
  ),
  frames: (() => {
    const s = ["a", "a", "b"];
    return [
      arrayFrame("s = aab", "Greedy: always place the currently most frequent unused-as-last char.", s),
      {
        kind: "hashmap" as const,
        title: "Counts",
        caption: "a→2, b→1. Max freq ≤ (n+1)/2 else impossible.",
        cells: s.map((v) => ({ value: v })),
        mapEntries: [
          { key: "a", value: "2×", tone: "match" as const },
          { key: "b", value: "1×", tone: "idle" as const },
        ],
        note: "ok: 2 ≤ 2",
      },
      {
        kind: "stack" as const,
        title: "Place 'a'",
        caption: "Pop a. Hold leftover a=1 as prev (don’t push yet).",
        cells: [{ value: "a", tone: "active" as const }],
        stackItems: [{ value: "b@1", tone: "idle" as const }],
        note: "out=a  prev=a@1",
      },
      {
        kind: "stack" as const,
        title: "Place 'b'",
        caption: "Next most frequent available is b. Then push prev a back.",
        cells: [
          { value: "a", tone: "done" as const },
          { value: "b", tone: "active" as const },
        ],
        stackItems: [{ value: "a@1", tone: "active" as const }],
        note: "out=ab",
      },
      arrayFrame("Place last 'a'", "Only a left — append. No two identical adjacent.", ["a", "b", "a"], {
        0: "match",
        1: "match",
        2: "match",
      }, { note: '"aba"' }),
      arrayFrame("Answer", "Reorganized string: aba.", ["a", "b", "a"], {
        0: "done",
        1: "done",
        2: "done",
      }),
    ];
  })(),
};

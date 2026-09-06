import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function containsDuplicateSetFrames(): Frame[] {
  const a = [3, 1, 4, 2, 1, 5];
  const set = new Set<number>();
  const frames: Frame[] = [
    {
      kind: "hashmap",
      title: "Have I seen this?",
      caption: "Insert into a set. If insert fails, we found a duplicate.",
      cells: a.map((value) => ({ value })),
      mapEntries: [],
    },
  ];
  for (let i = 0; i < a.length; i++) {
    const dup = set.has(a[i]);
    if (!dup) set.add(a[i]);
    frames.push({
      kind: "hashmap",
      title: dup ? `Duplicate: ${a[i]}` : `Insert ${a[i]}`,
      caption: dup
        ? "The set already contains 1. Detection complete without sorting."
        : "Not present — add it and continue.",
      cells: a.map((value, idx) => ({
        value,
        tone: idx === i ? (dup ? "match" : "active") : idx < i ? "done" : "idle",
      })),
      mapEntries: [...set].map((key) => ({
        key: String(key),
        value: "seen",
        tone: key === a[i] ? (dup ? "match" : "active") : "idle",
      })),
      pointers: [{ name: "i", index: i, color: PTR.M }],
    });
    if (dup) break;
  }
  return frames;
}

function happyNumberFrames(): Frame[] {
  const seen = new Set<number>();
  let n = 19;
  const frames: Frame[] = [
    {
      kind: "hashmap",
      title: "Happy number cycle",
      caption: "Replace n with sum of squares of digits. A set detects a loop; 1 means happy.",
      mapEntries: [],
      note: "n = 19",
    },
  ];
  const sumSq = (x: number) => {
    let s = 0;
    while (x > 0) {
      const d = x % 10;
      s += d * d;
      x = Math.floor(x / 10);
    }
    return s;
  };
  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    const next = sumSq(n);
    frames.push({
      kind: "hashmap",
      title: `${n} → ${next}`,
      caption:
        next === 1
          ? "Reached 1 — happy number."
          : seen.has(next)
            ? `${next} already seen — cycle, not happy.`
            : `Remember ${n}, continue with ${next}.`,
      mapEntries: [...seen].map((key) => ({
        key: String(key),
        value: "seen",
        tone: key === n ? "active" : "idle",
      })),
      note: `sum of squares = ${next}`,
    });
    n = next;
    if (n === 1) {
      frames.push({
        kind: "hashmap",
        title: "Happy",
        caption: "No cycle before hitting 1. Return true.",
        mapEntries: [...seen, 1].map((key) => ({
          key: String(key),
          value: key === 1 ? "done" : "seen",
          tone: key === 1 ? "match" : "done",
        })),
        note: "answer = true",
      });
      break;
    }
  }
  return frames;
}

function longestConsecutiveFrames(): Frame[] {
  const a = [100, 4, 200, 1, 3, 2];
  const set = new Set(a);
  const frames: Frame[] = [
    {
      kind: "hashmap",
      title: "Put numbers in a set",
      caption: "Only start a streak when x − 1 is missing — that x is a sequence head.",
      cells: a.map((value) => ({ value })),
      mapEntries: [...set].map((key) => ({
        key: String(key),
        value: "in set",
        tone: "idle",
      })),
    },
  ];
  let best = 0;
  let bestStart = 0;
  for (const x of a) {
    if (set.has(x - 1)) {
      frames.push(
        arrayFrame(
          `Skip ${x}`,
          `${x - 1} exists, so ${x} is not a streak start.`,
          a,
          { [a.indexOf(x)]: "skip" },
        ),
      );
      continue;
    }
    let y = x;
    let len = 0;
    const tone: Record<number, "match" | "active" | "window"> = {};
    while (set.has(y)) {
      tone[a.indexOf(y)] = y === x ? "active" : "window";
      len += 1;
      y += 1;
    }
    frames.push(
      arrayFrame(
        `Streak from ${x}`,
        `Run length ${len}: ${x} … ${x + len - 1}.`,
        a,
        tone,
        {
          note: `len = ${len}`,
          pointers: [{ name: "start", index: a.indexOf(x), color: PTR.L }],
        },
      ),
    );
    if (len > best) {
      best = len;
      bestStart = x;
    }
  }
  const bestTone: Record<number, "match"> = {};
  for (let v = bestStart; v < bestStart + best; v++) {
    bestTone[a.indexOf(v)] = "match";
  }
  frames.push(
    arrayFrame(
      "Longest streak",
      `Best length ${best} starting at ${bestStart}.`,
      a,
      bestTone,
      { note: `answer = ${best}` },
    ),
  );
  return frames;
}

export const containsDuplicateSetSolution: ProblemSolution = {
  approach:
    "Insert into a hash set. If a value is already present, return true. O(n) time, O(n) space.",
  templates: langs(
    `def containsDuplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False`,
    `bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int x : nums) if (!seen.insert(x).second) return true;
    return false;
}`,
    `boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) if (!seen.add(x)) return true;
    return false;
}`,
    `function containsDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}`,
  ),
  frames: containsDuplicateSetFrames(),
};

export const happyNumberSolution: ProblemSolution = {
  approach:
    "Iterate n → sum of digit squares. A set of seen values detects cycles; reach 1 ⇒ happy. O(log n) per step.",
  templates: langs(
    `def isHappy(n):
    seen = set()
    while n != 1 and n not in seen:
        seen.add(n)
        n = sum(int(d) ** 2 for d in str(n))
    return n == 1`,
    `bool isHappy(int n) {
    unordered_set<int> seen;
    auto next = [](int x) {
        int s = 0;
        while (x) { int d = x % 10; s += d * d; x /= 10; }
        return s;
    };
    while (n != 1 && !seen.count(n)) {
        seen.insert(n);
        n = next(n);
    }
    return n == 1;
}`,
    `boolean isHappy(int n) {
    Set<Integer> seen = new HashSet<>();
    while (n != 1 && !seen.contains(n)) {
        seen.add(n);
        int s = 0;
        while (n > 0) { int d = n % 10; s += d * d; n /= 10; }
        n = s;
    }
    return n == 1;
}`,
    `function isHappy(n) {
  const seen = new Set();
  const next = (x) => {
    let s = 0;
    while (x > 0) { const d = x % 10; s += d * d; x = Math.floor(x / 10); }
    return s;
  };
  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    n = next(n);
  }
  return n === 1;
}`,
  ),
  frames: happyNumberFrames(),
};

export const longestConsecutiveSequenceSolution: ProblemSolution = {
  approach:
    "Put all nums in a set. Only expand streaks from heads (x − 1 missing). O(n) time, O(n) space.",
  templates: langs(
    `def longestConsecutive(nums):
    s = set(nums)
    best = 0
    for x in s:
        if x - 1 in s:
            continue
        y, length = x, 0
        while y in s:
            length += 1
            y += 1
        best = max(best, length)
    return best`,
    `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> s(nums.begin(), nums.end());
    int best = 0;
    for (int x : s) {
        if (s.count(x - 1)) continue;
        int y = x, length = 0;
        while (s.count(y)) { length++; y++; }
        best = max(best, length);
    }
    return best;
}`,
    `int longestConsecutive(int[] nums) {
    Set<Integer> s = new HashSet<>();
    for (int x : nums) s.add(x);
    int best = 0;
    for (int x : s) {
        if (s.contains(x - 1)) continue;
        int y = x, length = 0;
        while (s.contains(y)) { length++; y++; }
        best = Math.max(best, length);
    }
    return best;
}`,
    `function longestConsecutive(nums) {
  const s = new Set(nums);
  let best = 0;
  for (const x of s) {
    if (s.has(x - 1)) continue;
    let y = x, length = 0;
    while (s.has(y)) { length++; y++; }
    best = Math.max(best, length);
  }
  return best;
}`,
  ),
  frames: longestConsecutiveFrames(),
};

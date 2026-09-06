import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function subsetsBitsFrames() {
  const items = [1, 2, 3];
  return [
    arrayFrame("nums = [1,2,3]", "Bitmask loop: mask bit i selects nums[i]. Same power set as backtracking.", items, {}, {
      note: "2³ = 8",
    }),
    arrayFrame("mask 0", "Empty subset.", items, { 0: "skip", 1: "skip", 2: "skip" }, { note: "[]" }),
    arrayFrame("mask 2 = 010", "Only bit 1 → [2].", items, { 0: "skip", 1: "match", 2: "skip" }, {
      pointers: [{ name: "m", index: 1, color: PTR.M }],
      note: "[2]",
    }),
    arrayFrame("mask 5 = 101", "Bits 0 and 2 → [1,3].", items, { 0: "match", 1: "skip", 2: "match" }, {
      note: "[1,3]",
    }),
    arrayFrame("mask 7 = 111", "All bits → [1,2,3].", items, { 0: "match", 1: "match", 2: "match" }, {
      note: "[1,2,3]",
    }),
    arrayFrame("Done", "All 8 masks emitted. O(n·2ⁿ).", items, { 0: "done", 1: "done", 2: "done" }, {
      note: "8 subsets",
    }),
  ];
}

function subsetsIIBitsFrames() {
  const nums = [1, 2, 2];
  return [
    arrayFrame("Sort first", "Duplicates sit together. Skip a duplicate start at the same depth when bit-building.", nums, {}, {
      note: "sorted",
    }),
    arrayFrame("Backtrack style + bits", "Prefer iterative: for each size, only start a duplicate if previous twin was taken.", nums, {
      1: "lo",
      2: "hi",
    }, { note: "2 vs 2" }),
    arrayFrame("Valid: [] [1] [2] [1,2]", "Taking the first 2 is allowed; taking only the second 2 alone is a duplicate skip.", nums, {
      0: "match",
      1: "match",
    }, { note: "dedupe" }),
    arrayFrame("Valid: [2,2] [1,2,2]", "Both 2s together is unique — previous twin was included.", nums, {
      0: "match",
      1: "match",
      2: "match",
    }, { note: "both 2s" }),
    arrayFrame("Skip twin alone", "If nums[i]==nums[i-1] and we skipped i-1, skip i. Avoids duplicate subsets.", nums, {
      2: "skip",
    }, { note: "no [2] twice" }),
    arrayFrame("Answer", "Unique subsets only. Sort + skip rule, or use a set of frozensets.", nums, {
      0: "done",
      1: "done",
      2: "done",
    }, { note: "6 unique" }),
  ];
}

function repeatedDnaFrames() {
  const s = ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"];
  return [
    arrayFrame(
      "10-mers in DNA",
      "Slide a window of length 10. Hash (or bit-pack A/C/G/T into 20 bits) and record first/second sightings.",
      s,
      {},
      { note: "len 10" },
    ),
    arrayFrame("First window", "AAAAACCCCC seen once — store in seen set.", ["A", "A", "A", "A", "A", "C", "C", "C", "C", "C", "A"], {
      0: "window",
      1: "window",
      2: "window",
      3: "window",
      4: "window",
      5: "window",
      6: "window",
      7: "window",
      8: "window",
      9: "window",
    }, { window: [0, 9], note: "seen += 1" }),
    arrayFrame("Slide +1", "Drop leftmost base, add next. Rolling hash: hash = ((hash<<2)|code) & mask.", ["A", "A", "A", "A", "A", "C", "C", "C", "C", "C", "A"], {
      1: "window",
      2: "window",
      3: "window",
      4: "window",
      5: "window",
      6: "window",
      7: "window",
      8: "window",
      9: "window",
      10: "active",
    }, { window: [1, 10], note: "roll" }),
    arrayFrame("Second hit", "When a 10-mer is already in seen, add to answer (once).", s, { 0: "match" }, {
      note: "repeated",
    }),
    arrayFrame("Bit pack", "2 bits per base → 20-bit key fits in an int. O(n) time, O(n) space for the sets.", ["A=00", "C=01", "G=10", "T=11"], {
      0: "lo",
      1: "hi",
      2: "window",
      3: "match",
    }, { note: "20 bits" }),
    arrayFrame("Answer", "Return every 10-letter substring that appears more than once.", s, {}, { note: "unique repeats" }),
  ];
}

export const subsetsBitsSolution: ProblemSolution = {
  approach:
    "Enumerate mask 0..(1<<n)-1; bit i includes nums[i]. Builds the power set iteratively. O(n·2ⁿ) time, O(n·2ⁿ) output space.",
  templates: langs(
    `def subsets(nums):
    n, out = len(nums), []
    for mask in range(1 << n):
        out.append([nums[i] for i in range(n) if mask & (1 << i)])
    return out`,
    `vector<vector<int>> subsets(vector<int>& nums) {
    int n = nums.size();
    vector<vector<int>> out;
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> cur;
        for (int i = 0; i < n; i++) if (mask & (1 << i)) cur.push_back(nums[i]);
        out.push_back(cur);
    }
    return out;
}`,
    `List<List<Integer>> subsets(int[] nums) {
    int n = nums.length;
    List<List<Integer>> out = new ArrayList<>();
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> cur = new ArrayList<>();
        for (int i = 0; i < n; i++) if ((mask & (1 << i)) != 0) cur.add(nums[i]);
        out.add(cur);
    }
    return out;
}`,
    `function subsets(nums) {
  const n = nums.length, out = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const cur = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) cur.push(nums[i]);
    out.push(cur);
  }
  return out;
}`,
  ),
  frames: subsetsBitsFrames(),
};

export const subsetsIIBitsSolution: ProblemSolution = {
  approach:
    "Sort, then backtrack: at each depth skip nums[i] if equal to nums[i-1] and i-1 was not chosen. Yields unique subsets. O(n·2ⁿ) time.",
  templates: langs(
    `def subsetsWithDup(nums):
    nums.sort()
    out, path = [], []
    def dfs(start):
        out.append(path[:])
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]: continue
            path.append(nums[i])
            dfs(i + 1)
            path.pop()
    dfs(0)
    return out`,
    `void dfs(vector<int>& nums, int start, vector<int>& path, vector<vector<int>>& out) {
    out.push_back(path);
    for (int i = start; i < (int)nums.size(); i++) {
        if (i > start && nums[i] == nums[i - 1]) continue;
        path.push_back(nums[i]);
        dfs(nums, i + 1, path, out);
        path.pop_back();
    }
}
vector<vector<int>> subsetsWithDup(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> out; vector<int> path;
    dfs(nums, 0, path, out);
    return out;
}`,
    `void dfs(int[] nums, int start, List<Integer> path, List<List<Integer>> out) {
    out.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        if (i > start && nums[i] == nums[i - 1]) continue;
        path.add(nums[i]);
        dfs(nums, i + 1, path, out);
        path.remove(path.size() - 1);
    }
}
List<List<Integer>> subsetsWithDup(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> out = new ArrayList<>();
    dfs(nums, 0, new ArrayList<>(), out);
    return out;
}`,
    `function subsetsWithDup(nums) {
  nums = [...nums].sort((a, b) => a - b);
  const out = [], path = [];
  function dfs(start) {
    out.push([...path]);
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      dfs(i + 1);
      path.pop();
    }
  }
  dfs(0);
  return out;
}`,
  ),
  frames: subsetsIIBitsFrames(),
};

export const repeatedDnaSequencesSolution: ProblemSolution = {
  approach:
    "Slide length-10 windows; store first sightings in a set and repeats in another (or bit-pack 20-bit keys). O(n) time, O(n) space.",
  templates: langs(
    `def findRepeatedDnaSequences(s):
    seen, rep = set(), set()
    for i in range(len(s) - 9):
        sub = s[i:i + 10]
        if sub in seen: rep.add(sub)
        else: seen.add(sub)
    return list(rep)`,
    `vector<string> findRepeatedDnaSequences(string s) {
    unordered_set<string> seen, rep;
    for (int i = 0; i + 10 <= (int)s.size(); i++) {
        string sub = s.substr(i, 10);
        if (seen.count(sub)) rep.insert(sub);
        else seen.insert(sub);
    }
    return vector<string>(rep.begin(), rep.end());
}`,
    `List<String> findRepeatedDnaSequences(String s) {
    Set<String> seen = new HashSet<>(), rep = new HashSet<>();
    for (int i = 0; i + 10 <= s.length(); i++) {
        String sub = s.substring(i, i + 10);
        if (!seen.add(sub)) rep.add(sub);
    }
    return new ArrayList<>(rep);
}`,
    `function findRepeatedDnaSequences(s) {
  const seen = new Set(), rep = new Set();
  for (let i = 0; i + 10 <= s.length; i++) {
    const sub = s.slice(i, i + 10);
    if (seen.has(sub)) rep.add(sub);
    else seen.add(sub);
  }
  return [...rep];
}`,
  ),
  frames: repeatedDnaFrames(),
};

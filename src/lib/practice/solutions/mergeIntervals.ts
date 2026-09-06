import type { CellTone } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const mergeIntervalsSolution: ProblemSolution = {
  approach:
    "Sort by start. If next.start ≤ current.end, merge by extending end; else push a new interval. O(n log n).",
  templates: langs(
    `def merge(intervals):
    intervals.sort()
    out = []
    for s, e in intervals:
        if not out or s > out[-1][1]:
            out.append([s, e])
        else:
            out[-1][1] = max(out[-1][1], e)
    return out`,
    `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> out;
    for (auto& iv : intervals) {
        if (out.empty() || iv[0] > out.back()[1]) out.push_back(iv);
        else out.back()[1] = max(out.back()[1], iv[1]);
    }
    return out;
}`,
    `int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> out = new ArrayList<>();
    for (int[] iv : intervals) {
        if (out.isEmpty() || iv[0] > out.get(out.size() - 1)[1]) out.add(iv);
        else out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], iv[1]);
    }
    return out.toArray(new int[0][]);
}`,
    `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [s, e] of intervals) {
    if (!out.length || s > out[out.length - 1][1]) out.push([s, e]);
    else out[out.length - 1][1] = Math.max(out[out.length - 1][1], e);
  }
  return out;
}`,
  ),
  frames: (() => {
    const raw = [
      { label: "[1,3]", start: 1, end: 3 },
      { label: "[2,6]", start: 2, end: 6 },
      { label: "[8,10]", start: 8, end: 10 },
      { label: "[15,18]", start: 15, end: 18 },
    ];
    return [
      {
        kind: "intervals" as const,
        title: "Sort by start",
        caption: "If next.start ≤ current.end, merge by extending end. Else push a new interval.",
        intervals: raw.map((x) => ({ ...x, tone: "idle" as CellTone })),
        axisMax: 18,
      },
      {
        kind: "intervals" as const,
        title: "Seed [1,3]",
        caption: "First interval becomes the current block.",
        intervals: [
          { label: "[1,3]", start: 1, end: 3, tone: "active" },
          { label: "[2,6]", start: 2, end: 6, tone: "idle" },
          { label: "[8,10]", start: 8, end: 10, tone: "idle" },
          { label: "[15,18]", start: 15, end: 18, tone: "idle" },
        ],
        axisMax: 18,
      },
      {
        kind: "intervals" as const,
        title: "Merge [1,3] and [2,6]",
        caption: "2 ≤ 3, so they overlap. New block [1,6].",
        intervals: [
          { label: "[1,6]", start: 1, end: 6, tone: "match" },
          { label: "[8,10]", start: 8, end: 10, tone: "idle" },
          { label: "[15,18]", start: 15, end: 18, tone: "idle" },
        ],
        axisMax: 18,
      },
      {
        kind: "intervals" as const,
        title: "Push [8,10]",
        caption: "8 > 6 — no overlap. Start a new block.",
        intervals: [
          { label: "[1,6]", start: 1, end: 6, tone: "done" },
          { label: "[8,10]", start: 8, end: 10, tone: "active" },
          { label: "[15,18]", start: 15, end: 18, tone: "idle" },
        ],
        axisMax: 18,
      },
      {
        kind: "intervals" as const,
        title: "Push [15,18]",
        caption: "15 > 10. Three disjoint intervals remain.",
        intervals: [
          { label: "[1,6]", start: 1, end: 6, tone: "done" },
          { label: "[8,10]", start: 8, end: 10, tone: "done" },
          { label: "[15,18]", start: 15, end: 18, tone: "match" },
        ],
        axisMax: 18,
        note: "return 3 intervals",
      },
    ];
  })(),
};

export const insertIntervalSolution: ProblemSolution = {
  approach:
    "Scan sorted intervals: push all ending before new.start; merge all overlapping with new; push the rest. O(n).",
  templates: langs(
    `def insert(intervals, newInterval):
    out, i, n = [], 0, len(intervals)
    s, e = newInterval
    while i < n and intervals[i][1] < s:
        out.append(intervals[i]); i += 1
    while i < n and intervals[i][0] <= e:
        s = min(s, intervals[i][0])
        e = max(e, intervals[i][1]); i += 1
    out.append([s, e])
    out.extend(intervals[i:])
    return out`,
    `vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& neu) {
    vector<vector<int>> out;
    int i = 0, n = intervals.size(), s = neu[0], e = neu[1];
    while (i < n && intervals[i][1] < s) out.push_back(intervals[i++]);
    while (i < n && intervals[i][0] <= e) {
        s = min(s, intervals[i][0]);
        e = max(e, intervals[i][1]); i++;
    }
    out.push_back({s, e});
    while (i < n) out.push_back(intervals[i++]);
    return out;
}`,
    `int[][] insert(int[][] intervals, int[] neu) {
    List<int[]> out = new ArrayList<>();
    int i = 0, n = intervals.length, s = neu[0], e = neu[1];
    while (i < n && intervals[i][1] < s) out.add(intervals[i++]);
    while (i < n && intervals[i][0] <= e) {
        s = Math.min(s, intervals[i][0]);
        e = Math.max(e, intervals[i][1]); i++;
    }
    out.add(new int[]{s, e});
    while (i < n) out.add(intervals[i++]);
    return out.toArray(new int[0][]);
}`,
    `function insert(intervals, newInterval) {
  const out = [];
  let i = 0, [s, e] = newInterval;
  while (i < intervals.length && intervals[i][1] < s) out.push(intervals[i++]);
  while (i < intervals.length && intervals[i][0] <= e) {
    s = Math.min(s, intervals[i][0]);
    e = Math.max(e, intervals[i][1]); i++;
  }
  out.push([s, e]);
  while (i < intervals.length) out.push(intervals[i++]);
  return out;
}`,
  ),
  frames: (() => {
    return [
      {
        kind: "intervals" as const,
        title: "Insert [4,8]",
        caption: "Existing [1,2],[3,5],[6,7],[8,10],[12,16]. New interval in pink idea: merge overlaps.",
        intervals: [
          { label: "[1,2]", start: 1, end: 2, tone: "idle" },
          { label: "[3,5]", start: 3, end: 5, tone: "idle" },
          { label: "[6,7]", start: 6, end: 7, tone: "idle" },
          { label: "[8,10]", start: 8, end: 10, tone: "idle" },
          { label: "[12,16]", start: 12, end: 16, tone: "idle" },
          { label: "new", start: 4, end: 8, tone: "hi" },
        ],
        axisMax: 16,
      },
      {
        kind: "intervals" as const,
        title: "Copy left of new",
        caption: "[1,2] ends before 4 — push as-is.",
        intervals: [
          { label: "[1,2]", start: 1, end: 2, tone: "done" },
          { label: "[3,5]", start: 3, end: 5, tone: "idle" },
          { label: "new", start: 4, end: 8, tone: "hi" },
        ],
        axisMax: 16,
      },
      {
        kind: "intervals" as const,
        title: "Merge overlaps",
        caption: "[3,5],[6,7],[8,10] all touch [4,8] → expand to [3,10].",
        intervals: [
          { label: "[1,2]", start: 1, end: 2, tone: "done" },
          { label: "[3,10]", start: 3, end: 10, tone: "match" },
          { label: "[12,16]", start: 12, end: 16, tone: "idle" },
        ],
        axisMax: 16,
      },
      {
        kind: "intervals" as const,
        title: "Append right",
        caption: "[12,16] starts after merged end — append unchanged.",
        intervals: [
          { label: "[1,2]", start: 1, end: 2, tone: "done" },
          { label: "[3,10]", start: 3, end: 10, tone: "done" },
          { label: "[12,16]", start: 12, end: 16, tone: "match" },
        ],
        axisMax: 16,
        note: "return 3 intervals",
      },
      {
        kind: "intervals" as const,
        title: "Result",
        caption: "[[1,2],[3,10],[12,16]].",
        intervals: [
          { label: "[1,2]", start: 1, end: 2, tone: "match" },
          { label: "[3,10]", start: 3, end: 10, tone: "match" },
          { label: "[12,16]", start: 12, end: 16, tone: "match" },
        ],
        axisMax: 16,
      },
    ];
  })(),
};

export const nonOverlappingMergeSolution: ProblemSolution = {
  approach:
    "Sort by end (or merge-style by start then count overlaps). Greedy keep non-overlapping; answer = n − size of maximal compatible set.",
  templates: langs(
    `def eraseOverlapIntervals(intervals):
    intervals.sort(key=lambda x: x[1])
    keep, end = 0, -10**18
    for s, e in intervals:
        if s >= end:
            keep += 1
            end = e
    return len(intervals) - keep`,
    `int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), [](auto& a, auto& b) { return a[1] < b[1]; });
    int keep = 0; long long end = LLONG_MIN;
    for (auto& iv : intervals) {
        if (iv[0] >= end) { keep++; end = iv[1]; }
    }
    return (int)intervals.size() - keep;
}`,
    `int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
    int keep = 0; long end = Long.MIN_VALUE;
    for (int[] iv : intervals) {
        if (iv[0] >= end) { keep++; end = iv[1]; }
    }
    return intervals.length - keep;
}`,
    `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let keep = 0, end = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= end) { keep++; end = e; }
  }
  return intervals.length - keep;
}`,
  ),
  frames: (() => {
    const iv = [
      { label: "[1,2]", start: 1, end: 2 },
      { label: "[1,3]", start: 1, end: 3 },
      { label: "[2,3]", start: 2, end: 3 },
      { label: "[3,4]", start: 3, end: 4 },
    ];
    return [
      {
        kind: "intervals" as const,
        title: "Overlaps to erase",
        caption: "Unlike merge, we discard intervals instead of unioning them.",
        intervals: iv.map((x) => ({ ...x, tone: "idle" as CellTone })),
        axisMax: 5,
      },
      {
        kind: "intervals" as const,
        title: "Keep [1,2]",
        caption: "Earliest end. lastEnd = 2.",
        intervals: iv.map((x) => ({
          ...x,
          tone: (x.label === "[1,2]" ? "match" : "idle") as CellTone,
        })),
        axisMax: 5,
      },
      {
        kind: "intervals" as const,
        title: "Drop [1,3]",
        caption: "Overlaps — remove (not merge).",
        intervals: iv.map((x) => ({
          ...x,
          tone: (x.label === "[1,3]" ? "skip" : x.label === "[1,2]" ? "done" : "idle") as CellTone,
        })),
        axisMax: 5,
        note: "removals=1",
      },
      {
        kind: "intervals" as const,
        title: "Keep [2,3] then [3,4]",
        caption: "Both compatible after [1,2].",
        intervals: [
          { label: "[1,2]", start: 1, end: 2, tone: "done" },
          { label: "[2,3]", start: 2, end: 3, tone: "match" },
          { label: "[3,4]", start: 3, end: 4, tone: "match" },
          { label: "[1,3]", start: 1, end: 3, tone: "skip" },
        ],
        axisMax: 5,
        note: "return 1",
      },
      {
        kind: "intervals" as const,
        title: "vs merge",
        caption: "Merge would produce [1,4]; erase keeps three disjoint pieces.",
        intervals: [
          { label: "merged?", start: 1, end: 4, tone: "skip" },
          { label: "kept", start: 1, end: 2, tone: "done" },
          { label: "kept", start: 2, end: 3, tone: "done" },
          { label: "kept", start: 3, end: 4, tone: "done" },
        ],
        axisMax: 5,
      },
    ];
  })(),
};

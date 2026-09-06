import type { CellTone } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const nonOverlappingScheduleSolution: ProblemSolution = {
  approach:
    "Interval scheduling: sort by end time, greedily keep compatible intervals; removals = n − kept. O(n log n).",
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
      { label: "[1,4]", start: 1, end: 4 },
      { label: "[2,3]", start: 2, end: 3 },
      { label: "[3,6]", start: 3, end: 6 },
      { label: "[4,5]", start: 4, end: 5 },
    ];
    return [
      {
        kind: "intervals" as const,
        title: "Compatible schedule",
        caption: "Sort by end; keep if start ≥ last end (classic interval scheduling).",
        intervals: iv.map((x) => ({ ...x, tone: "idle" as CellTone })),
        axisMax: 7,
      },
      {
        kind: "intervals" as const,
        title: "Keep [2,3]",
        caption: "Sorted by end: [2,3] first. lastEnd = 3.",
        intervals: iv.map((x) => ({
          ...x,
          tone: (x.label === "[2,3]" ? "match" : "idle") as CellTone,
        })),
        axisMax: 7,
        note: "keep=1",
      },
      {
        kind: "intervals" as const,
        title: "Skip [1,4]",
        caption: "1 < 3 → overlaps. Remove it.",
        intervals: iv.map((x) => ({
          ...x,
          tone: (x.label === "[1,4]" ? "skip" : x.label === "[2,3]" ? "done" : "idle") as CellTone,
        })),
        axisMax: 7,
        note: "removals=1",
      },
      {
        kind: "intervals" as const,
        title: "Keep [4,5]",
        caption: "4 ≥ 3 — keep. lastEnd = 5. Then skip [3,6].",
        intervals: [
          { label: "[2,3]", start: 2, end: 3, tone: "done" },
          { label: "[4,5]", start: 4, end: 5, tone: "match" },
          { label: "[1,4]", start: 1, end: 4, tone: "skip" },
          { label: "[3,6]", start: 3, end: 6, tone: "skip" },
        ],
        axisMax: 7,
        note: "return 2",
      },
      {
        kind: "intervals" as const,
        title: "Scheduling view",
        caption: "Maximal compatible set size 2 → erase n−2 overlaps.",
        intervals: [
          { label: "kept", start: 2, end: 3, tone: "done" },
          { label: "kept", start: 4, end: 5, tone: "done" },
        ],
        axisMax: 7,
      },
    ];
  })(),
};

export const minArrowsScheduleSolution: ProblemSolution = {
  approach:
    "Schedule overlapping balloons onto shared arrows: sort by end; extend current arrow’s coverage until a balloon starts after the arrow point.",
  templates: langs(
    `def findMinArrowShots(points):
    points.sort(key=lambda x: x[1])
    arrows, end = 0, -10**18
    for s, e in points:
        if s > end:
            arrows += 1
            end = e
    return arrows`,
    `int findMinArrowShots(vector<vector<int>>& points) {
    sort(points.begin(), points.end(), [](auto& a, auto& b) { return a[1] < b[1]; });
    int arrows = 0; long long end = LLONG_MIN;
    for (auto& p : points) {
        if (p[0] > end) { arrows++; end = p[1]; }
    }
    return arrows;
}`,
    `int findMinArrowShots(int[][] points) {
    Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));
    int arrows = 0; long end = Long.MIN_VALUE;
    for (int[] p : points) {
        if (p[0] > end) { arrows++; end = p[1]; }
    }
    return arrows;
}`,
    `function findMinArrowShots(points) {
  points.sort((a, b) => a[1] - b[1]);
  let arrows = 0, end = -Infinity;
  for (const [s, e] of points) {
    if (s > end) { arrows++; end = e; }
  }
  return arrows;
}`,
  ),
  frames: (() => {
    const balls = [
      { label: "[1,6]", start: 1, end: 6 },
      { label: "[2,8]", start: 2, end: 8 },
      { label: "[7,12]", start: 7, end: 12 },
      { label: "[10,16]", start: 10, end: 16 },
    ];
    return [
      {
        kind: "intervals" as const,
        title: "Min arrows = groups",
        caption: "Each arrow is one scheduled ‘slot’ covering a contiguous overlap group.",
        intervals: balls.map((b) => ({ ...b, tone: "idle" as CellTone })),
        axisMax: 16,
      },
      {
        kind: "intervals" as const,
        title: "Group A @ 6",
        caption: "Arrow at end of [1,6] also hits [2,8].",
        intervals: balls.map((b) => ({
          ...b,
          tone: (b.end <= 8 && b.start <= 6 ? "match" : "idle") as CellTone,
        })),
        axisMax: 16,
        note: "arrows=1",
      },
      {
        kind: "intervals" as const,
        title: "Group B @ 12",
        caption: "7 > 6 → new arrow; covers [7,12] and [10,16].",
        intervals: balls.map((b) => ({
          ...b,
          tone: (b.start >= 7 ? "active" : "done") as CellTone,
        })),
        axisMax: 16,
        note: "arrows=2",
      },
      {
        kind: "intervals" as const,
        title: "Answer 2",
        caption: "Two overlap-groups → two arrows.",
        intervals: balls.map((b) => ({ ...b, tone: "match" as CellTone })),
        axisMax: 16,
        note: "return 2",
      },
      {
        kind: "intervals" as const,
        title: "vs erase-overlap",
        caption: "Arrows count clusters; erase-overlap counts removals to make all disjoint.",
        intervals: [
          { label: "cluster1", start: 1, end: 8, tone: "window" },
          { label: "cluster2", start: 7, end: 16, tone: "lo" },
        ],
        axisMax: 16,
      },
    ];
  })(),
};

export const maxLengthOfPairChainSolution: ProblemSolution = {
  approach:
    "Pairs (a,b) chain if b < next.a. Sort by second element; greedily take next pair whose start > last end. Length of chain = LIS-style greedy. O(n log n).",
  templates: langs(
    `def findLongestChain(pairs):
    pairs.sort(key=lambda x: x[1])
    length, end = 0, -10**18
    for a, b in pairs:
        if a > end:
            length += 1
            end = b
    return length`,
    `int findLongestChain(vector<vector<int>>& pairs) {
    sort(pairs.begin(), pairs.end(), [](auto& a, auto& b) { return a[1] < b[1]; });
    int length = 0; long long end = LLONG_MIN;
    for (auto& p : pairs) {
        if (p[0] > end) { length++; end = p[1]; }
    }
    return length;
}`,
    `int findLongestChain(int[][] pairs) {
    Arrays.sort(pairs, (a, b) -> a[1] - b[1]);
    int length = 0; long end = Long.MIN_VALUE;
    for (int[] p : pairs) {
        if (p[0] > end) { length++; end = p[1]; }
    }
    return length;
}`,
    `function findLongestChain(pairs) {
  pairs.sort((a, b) => a[1] - b[1]);
  let length = 0, end = -Infinity;
  for (const [a, b] of pairs) {
    if (a > end) { length++; end = b; }
  }
  return length;
}`,
  ),
  frames: (() => {
    const pairs = [
      { label: "[1,2]", start: 1, end: 2 },
      { label: "[7,8]", start: 7, end: 8 },
      { label: "[4,5]", start: 4, end: 5 },
    ];
    return [
      {
        kind: "intervals" as const,
        title: "Pair chain",
        caption: "Sort by right endpoint. Link if next.left > last.right.",
        intervals: pairs.map((p) => ({ ...p, tone: "idle" as CellTone })),
        axisMax: 9,
      },
      {
        kind: "intervals" as const,
        title: "Take [1,2]",
        caption: "Earliest finish. end = 2.",
        intervals: pairs.map((p) => ({
          ...p,
          tone: (p.label === "[1,2]" ? "match" : "idle") as CellTone,
        })),
        axisMax: 9,
        note: "len=1",
      },
      {
        kind: "intervals" as const,
        title: "Take [4,5]",
        caption: "4 > 2 — chain extends. end = 5.",
        intervals: pairs.map((p) => ({
          ...p,
          tone: (p.label === "[1,2]" ? "done" : p.label === "[4,5]" ? "match" : "idle") as CellTone,
        })),
        axisMax: 9,
        note: "len=2",
      },
      {
        kind: "intervals" as const,
        title: "Take [7,8]",
        caption: "7 > 5 — full chain of length 3.",
        intervals: pairs.map((p) => ({ ...p, tone: "match" as CellTone })),
        axisMax: 9,
        note: "return 3",
      },
      {
        kind: "intervals" as const,
        title: "Same as arrows / activities",
        caption: "Strict inequality (a > end) like balloons; maximizes chain length.",
        intervals: [
          { label: "1→2", start: 1, end: 2, tone: "done" },
          { label: "4→5", start: 4, end: 5, tone: "done" },
          { label: "7→8", start: 7, end: 8, tone: "done" },
        ],
        axisMax: 9,
      },
    ];
  })(),
};

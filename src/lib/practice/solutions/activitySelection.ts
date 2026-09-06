import type { CellTone, Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const activitySelectionGfgSolution: ProblemSolution = {
  approach:
    "GFG activity selection: sort by finish time, greedily take an activity if its start ≥ last chosen finish. Maximizes count of non-overlapping activities.",
  templates: langs(
    `def activitySelection(start, finish):
    acts = sorted(zip(start, finish), key=lambda x: x[1])
    taken, end = 0, -10**18
    for s, e in acts:
        if s >= end:
            taken += 1
            end = e
    return taken`,
    `int activitySelection(vector<int>& start, vector<int>& finish) {
    vector<pair<int,int>> acts;
    for (int i = 0; i < (int)start.size(); i++) acts.push_back({finish[i], start[i]});
    sort(acts.begin(), acts.end());
    int taken = 0; long long end = LLONG_MIN;
    for (auto [e, s] : acts) {
        if (s >= end) { taken++; end = e; }
    }
    return taken;
}`,
    `int activitySelection(int[] start, int[] finish) {
    int n = start.length;
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    Arrays.sort(idx, (i, j) -> finish[i] - finish[j]);
    int taken = 0; long end = Long.MIN_VALUE;
    for (int i : idx) {
        if (start[i] >= end) { taken++; end = finish[i]; }
    }
    return taken;
}`,
    `function activitySelection(start, finish) {
  const acts = start.map((s, i) => [s, finish[i]]).sort((a, b) => a[1] - b[1]);
  let taken = 0, end = -Infinity;
  for (const [s, e] of acts) {
    if (s >= end) { taken++; end = e; }
  }
  return taken;
}`,
  ),
  frames: (() => {
    const acts = [
      { label: "A1", start: 1, end: 4 },
      { label: "A2", start: 3, end: 5 },
      { label: "A3", start: 0, end: 6 },
      { label: "A4", start: 5, end: 7 },
      { label: "A5", start: 8, end: 9 },
      { label: "A6", start: 5, end: 9 },
    ];
    const chosen = new Set(["A1", "A4", "A5"]);
    const frames: Frame[] = [
      {
        kind: "intervals",
        title: "Sort by finish time",
        caption: "Earliest-finish greedy: take if start ≥ last chosen finish.",
        intervals: acts.map((a) => ({ ...a, tone: "idle" as CellTone })),
        axisMax: 10,
      },
    ];
    let last = -1;
    for (const a of [...acts].sort((x, y) => x.end - y.end)) {
      const ok = a.start >= last;
      if (ok) last = a.end;
      frames.push({
        kind: "intervals",
        title: ok ? `Take ${a.label}` : `Skip ${a.label}`,
        caption: ok
          ? `${a.label} finishes at ${a.end}. Next start must be ≥ ${a.end}.`
          : `${a.label} overlaps the last chosen activity.`,
        intervals: acts.map((x) => ({
          ...x,
          tone: (x.label === a.label
            ? ok
              ? "match"
              : "skip"
            : chosen.has(x.label) && x.end <= last
              ? "done"
              : "idle") as CellTone,
        })),
        axisMax: 10,
      });
    }
    return frames;
  })(),
};

export const nonOverlappingActivitySolution: ProblemSolution = {
  approach:
    "Same earliest-finish greedy: sort by end, keep non-overlapping intervals; answer is removals = n − kept. O(n log n).",
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
      { label: "[2,3]", start: 2, end: 3 },
      { label: "[3,4]", start: 3, end: 4 },
      { label: "[1,3]", start: 1, end: 3 },
    ];
    return [
      {
        kind: "intervals" as const,
        title: "Remove min overlaps",
        caption: "Sort by end. Keep if start ≥ last end; else remove (count++).",
        intervals: iv.map((x) => ({ ...x, tone: "idle" as CellTone })),
        axisMax: 5,
      },
      {
        kind: "intervals" as const,
        title: "Keep [1,2]",
        caption: "Earliest finish. lastEnd = 2.",
        intervals: iv.map((x) => ({
          ...x,
          tone: (x.label === "[1,2]" ? "match" : "idle") as CellTone,
        })),
        axisMax: 5,
        note: "keep=1",
      },
      {
        kind: "intervals" as const,
        title: "Skip [1,3]",
        caption: "1 < 2 → overlaps. Remove it.",
        intervals: iv.map((x) => ({
          ...x,
          tone: (x.label === "[1,3]" ? "skip" : x.label === "[1,2]" ? "done" : "idle") as CellTone,
        })),
        axisMax: 5,
        note: "removals=1",
      },
      {
        kind: "intervals" as const,
        title: "Keep [2,3]",
        caption: "2 ≥ 2 — keep. lastEnd = 3.",
        intervals: iv.map((x) => ({
          ...x,
          tone: (x.label === "[2,3]"
            ? "match"
            : x.label === "[1,2]"
              ? "done"
              : x.label === "[1,3]"
                ? "skip"
                : "idle") as CellTone,
        })),
        axisMax: 5,
      },
      {
        kind: "intervals" as const,
        title: "Keep [3,4]",
        caption: "3 ≥ 3 — keep. Removals = 1.",
        intervals: [
          { label: "[1,2]", start: 1, end: 2, tone: "done" },
          { label: "[2,3]", start: 2, end: 3, tone: "done" },
          { label: "[3,4]", start: 3, end: 4, tone: "match" },
          { label: "[1,3]", start: 1, end: 3, tone: "skip" },
        ],
        axisMax: 5,
        note: "return 1",
      },
    ];
  })(),
};

export const minArrowsActivitySolution: ProblemSolution = {
  approach:
    "Sort balloons by end x. One arrow bursts all that start ≤ current end; when a balloon starts after, shoot a new arrow at its end.",
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
      { label: "[10,16]", start: 10, end: 16 },
      { label: "[2,8]", start: 2, end: 8 },
      { label: "[1,6]", start: 1, end: 6 },
      { label: "[7,12]", start: 7, end: 12 },
    ];
    return [
      {
        kind: "intervals" as const,
        title: "Balloons on a line",
        caption: "Sort by end. Arrow at end bursts all with start ≤ that end.",
        intervals: balls.map((b) => ({ ...b, tone: "idle" as CellTone })),
        axisMax: 16,
      },
      {
        kind: "intervals" as const,
        title: "Arrow 1 at x=6",
        caption: "Earliest end is [1,6]. Burst [1,6] and [2,8] (2≤6).",
        intervals: balls.map((b) => ({
          ...b,
          tone: (b.label === "[1,6]" || b.label === "[2,8]" ? "match" : "idle") as CellTone,
        })),
        axisMax: 16,
        note: "end=6 · arrows=1",
      },
      {
        kind: "intervals" as const,
        title: "[7,12] needs new arrow",
        caption: "7 > 6 → new arrow at 12. Also covers [10,16]? 10≤12 yes.",
        intervals: balls.map((b) => ({
          ...b,
          tone: (b.label === "[7,12]" || b.label === "[10,16]"
            ? "active"
            : b.label === "[1,6]" || b.label === "[2,8]"
              ? "done"
              : "idle") as CellTone,
        })),
        axisMax: 16,
        note: "arrows=2",
      },
      {
        kind: "intervals" as const,
        title: "All burst",
        caption: "Two arrows suffice for four balloons.",
        intervals: balls.map((b) => ({ ...b, tone: "match" as CellTone })),
        axisMax: 16,
        note: "return 2",
      },
      {
        kind: "intervals" as const,
        title: "Activity link",
        caption: "Same finish-time greedy as activity selection; strict > end starts a new group.",
        intervals: [
          { label: "grp1", start: 1, end: 6, tone: "done" },
          { label: "grp2", start: 7, end: 12, tone: "done" },
        ],
        axisMax: 16,
      },
    ];
  })(),
};

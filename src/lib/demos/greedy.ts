import type { CellTone, Frame } from "../types";

export function activitySelectionFrames(): Frame[] {
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
      caption: "Earliest-finish greedy: take an activity if it starts after the last chosen finish.",
      intervals: acts.map((a) => ({ ...a, tone: "idle" })),
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
        tone: x.label === a.label ? (ok ? "match" : "skip") : chosen.has(x.label) && x.end <= last ? "done" : "idle",
      })),
      axisMax: 10,
    });
  }
  return frames;
}

export function intervalSchedulingFrames(): Frame[] {
  return activitySelectionFrames().map((f, i) =>
    i === 0
      ? { ...f, title: "Compatible intervals", caption: "Same greedy as activity selection: sort by end, take if start ≥ last end." }
      : f,
  );
}

export function mergeIntervalsFrames(): Frame[] {
  const raw = [
    { label: "[1,3]", start: 1, end: 3 },
    { label: "[2,6]", start: 2, end: 6 },
    { label: "[8,10]", start: 8, end: 10 },
    { label: "[15,18]", start: 15, end: 18 },
  ];
  const frames: Frame[] = [
    {
      kind: "intervals",
      title: "Sort by start",
      caption: "If next.start ≤ current.end, merge by extending end. Else push a new interval.",
      intervals: raw.map((x) => ({ ...x, tone: "idle" as CellTone })),
      axisMax: 18,
    },
    {
      kind: "intervals",
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
      kind: "intervals",
      title: "No overlap",
      caption: "8 > 6 and 15 > 10. Three disjoint intervals remain.",
      intervals: [
        { label: "[1,6]", start: 1, end: 6, tone: "done" },
        { label: "[8,10]", start: 8, end: 10, tone: "done" },
        { label: "[15,18]", start: 15, end: 18, tone: "done" },
      ],
      axisMax: 18,
    },
  ];
  return frames;
}

export function minimumPlatformsFrames(): Frame[] {
  const frames: Frame[] = [
    {
      kind: "array",
      title: "Arrivals & departures",
      caption: "Sort both arrays. Sweep: arrival +1, departure −1. Max concurrent = platforms.",
      cells: [
        { value: "A 9:00" },
        { value: "A 9:40" },
        { value: "A 9:50" },
        { value: "D 9:10" },
        { value: "D 12:00" },
        { value: "D 11:20" },
      ],
    },
  ];
  const events = [
    { t: "9:00", d: 1, cap: "First train arrives. Need 1 platform." },
    { t: "9:10", d: -1, cap: "It departs. Platforms in use: 0." },
    { t: "9:40", d: 1, cap: "Arrive. In use: 1." },
    { t: "9:50", d: 1, cap: "Second overlap. In use: 2 — new peak." },
    { t: "11:20", d: -1, cap: "One departs. In use: 1." },
    { t: "12:00", d: -1, cap: "Last departs. Answer = peak 2." },
  ];
  let cur = 0;
  let peak = 0;
  for (const e of events) {
    cur += e.d;
    peak = Math.max(peak, cur);
    frames.push({
      kind: "array",
      title: `${e.t}  ${e.d > 0 ? "+1" : "−1"}`,
      caption: e.cap,
      cells: Array.from({ length: Math.max(1, cur) }, (_, i) => ({
        value: `P${i + 1}`,
        tone: "window" as const,
      })),
      note: `in use ${cur} · peak ${peak}`,
    });
  }
  return frames;
}

export function jobSequencingFrames(): Frame[] {
  const jobs = [
    { id: "a", profit: 100, d: 2 },
    { id: "b", profit: 19, d: 1 },
    { id: "c", profit: 27, d: 2 },
    { id: "d", profit: 25, d: 1 },
    { id: "e", profit: 15, d: 3 },
  ];
  const frames: Frame[] = [
    {
      kind: "array",
      title: "Sort by profit",
      caption: "Place each job in the latest free slot ≤ deadline. a (100, d=2) takes slot 2.",
      cells: jobs.map((j) => ({ value: `${j.id}:${j.profit}` })),
    },
    {
      kind: "array",
      title: "Slot 2 ← a",
      caption: "Next, c (27, d=2) — slot 2 taken, slot 1 free.",
      cells: [
        { value: "t1: ·" },
        { value: "t2: a", tone: "match" },
        { value: "t3: ·" },
      ],
    },
    {
      kind: "array",
      title: "Slot 1 ← c",
      caption: "d and b miss free slots before their deadline. e takes slot 3.",
      cells: [
        { value: "t1: c", tone: "done" },
        { value: "t2: a", tone: "done" },
        { value: "t3: e", tone: "match" },
      ],
      note: "profit 100+27+15 = 142",
    },
  ];
  return frames;
}

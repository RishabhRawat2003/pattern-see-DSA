import { arrayFrame } from "../../demos/problems/helpers";
import type { CellTone } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const minimumPlatformsSolution: ProblemSolution = {
  approach:
    "GFG: sort arrivals and departures. Two-pointer sweep — +1 on arrival, −1 on departure; track peak concurrent trains = platforms.",
  templates: langs(
    `def minPlatforms(arr, dep):
    arr.sort(); dep.sort()
    i = j = cur = best = 0
    while i < len(arr):
        if arr[i] <= dep[j]:
            cur += 1
            best = max(best, cur)
            i += 1
        else:
            cur -= 1
            j += 1
    return best`,
    `int minPlatforms(vector<int>& arr, vector<int>& dep) {
    sort(arr.begin(), arr.end());
    sort(dep.begin(), dep.end());
    int i = 0, j = 0, cur = 0, best = 0;
    while (i < (int)arr.size()) {
        if (arr[i] <= dep[j]) { cur++; best = max(best, cur); i++; }
        else { cur--; j++; }
    }
    return best;
}`,
    `int minPlatforms(int[] arr, int[] dep) {
    Arrays.sort(arr); Arrays.sort(dep);
    int i = 0, j = 0, cur = 0, best = 0;
    while (i < arr.length) {
        if (arr[i] <= dep[j]) { cur++; best = Math.max(best, cur); i++; }
        else { cur--; j++; }
    }
    return best;
}`,
    `function minPlatforms(arr, dep) {
  arr.sort((a, b) => a - b);
  dep.sort((a, b) => a - b);
  let i = 0, j = 0, cur = 0, best = 0;
  while (i < arr.length) {
    if (arr[i] <= dep[j]) { cur++; best = Math.max(best, cur); i++; }
    else { cur--; j++; }
  }
  return best;
}`,
  ),
  frames: (() => {
    const frames = [
      arrayFrame(
        "Arrivals & departures",
        "Sort both. Sweep: arrival +1, departure −1. Max concurrent = platforms.",
        ["A 900", "A 940", "A 950", "D 910", "D 1120", "D 1200"],
      ),
    ];
    const events = [
      { t: "900", d: 1, cap: "First train arrives. Need 1 platform." },
      { t: "910", d: -1, cap: "It departs. Platforms in use: 0." },
      { t: "940", d: 1, cap: "Arrive. In use: 1." },
      { t: "950", d: 1, cap: "Second overlap. In use: 2 — new peak." },
      { t: "1120", d: -1, cap: "One departs. In use: 1." },
      { t: "1200", d: -1, cap: "Last departs. Answer = peak 2." },
    ];
    let cur = 0;
    let peak = 0;
    for (const e of events) {
      cur += e.d;
      peak = Math.max(peak, cur);
      frames.push({
        kind: "array" as const,
        title: `${e.t}  ${e.d > 0 ? "+1" : "−1"}`,
        caption: e.cap,
        cells: Array.from({ length: Math.max(1, cur) }, (_, i) => ({
          value: `P${i + 1}`,
          tone: "window" as CellTone,
        })),
        note: `in use ${cur} · peak ${peak}`,
      });
    }
    return frames;
  })(),
};

export const meetingRoomsIISolution: ProblemSolution = {
  approach:
    "Same sweep as platforms: sort start and end times; +1 at start, −1 at end; peak = rooms needed. O(n log n).",
  templates: langs(
    `def minMeetingRooms(intervals):
    starts = sorted(s for s, _ in intervals)
    ends = sorted(e for _, e in intervals)
    i = j = cur = best = 0
    while i < len(starts):
        if starts[i] < ends[j]:
            cur += 1
            best = max(best, cur)
            i += 1
        else:
            cur -= 1
            j += 1
    return best`,
    `int minMeetingRooms(vector<vector<int>>& intervals) {
    vector<int> starts, ends;
    for (auto& iv : intervals) { starts.push_back(iv[0]); ends.push_back(iv[1]); }
    sort(starts.begin(), starts.end());
    sort(ends.begin(), ends.end());
    int i = 0, j = 0, cur = 0, best = 0;
    while (i < (int)starts.size()) {
        if (starts[i] < ends[j]) { cur++; best = max(best, cur); i++; }
        else { cur--; j++; }
    }
    return best;
}`,
    `int minMeetingRooms(int[][] intervals) {
    int n = intervals.length;
    int[] starts = new int[n], ends = new int[n];
    for (int i = 0; i < n; i++) { starts[i] = intervals[i][0]; ends[i] = intervals[i][1]; }
    Arrays.sort(starts); Arrays.sort(ends);
    int i = 0, j = 0, cur = 0, best = 0;
    while (i < n) {
        if (starts[i] < ends[j]) { cur++; best = Math.max(best, cur); i++; }
        else { cur--; j++; }
    }
    return best;
}`,
    `function minMeetingRooms(intervals) {
  const starts = intervals.map((x) => x[0]).sort((a, b) => a - b);
  const ends = intervals.map((x) => x[1]).sort((a, b) => a - b);
  let i = 0, j = 0, cur = 0, best = 0;
  while (i < starts.length) {
    if (starts[i] < ends[j]) { cur++; best = Math.max(best, cur); i++; }
    else { cur--; j++; }
  }
  return best;
}`,
  ),
  frames: (() => {
    const meetings = [
      { label: "[0,30]", start: 0, end: 30 },
      { label: "[5,10]", start: 5, end: 10 },
      { label: "[15,20]", start: 15, end: 20 },
    ];
    return [
      {
        kind: "intervals" as const,
        title: "Meetings",
        caption: "Rooms = max concurrent meetings (same sweep as platforms).",
        intervals: meetings.map((m) => ({ ...m, tone: "idle" as CellTone })),
        axisMax: 30,
      },
      {
        kind: "intervals" as const,
        title: "t=0 start",
        caption: "+1 room. In use = 1.",
        intervals: meetings.map((m) => ({
          ...m,
          tone: (m.label === "[0,30]" ? "active" : "idle") as CellTone,
        })),
        axisMax: 30,
        note: "cur=1 peak=1",
      },
      {
        kind: "intervals" as const,
        title: "t=5 start",
        caption: "Overlaps [0,30] → need 2 rooms.",
        intervals: meetings.map((m) => ({
          ...m,
          tone: (m.label === "[0,30]" || m.label === "[5,10]" ? "window" : "idle") as CellTone,
        })),
        axisMax: 30,
        note: "cur=2 peak=2",
      },
      {
        kind: "intervals" as const,
        title: "t=10 end",
        caption: "[5,10] frees a room. cur=1.",
        intervals: meetings.map((m) => ({
          ...m,
          tone: (m.label === "[5,10]" ? "done" : m.label === "[0,30]" ? "active" : "idle") as CellTone,
        })),
        axisMax: 30,
        note: "cur=1",
      },
      {
        kind: "intervals" as const,
        title: "t=15 start",
        caption: "Still only one other meeting — cur=2 again, peak stays 2.",
        intervals: meetings.map((m) => ({
          ...m,
          tone: (m.label === "[5,10]" ? "done" : "window") as CellTone,
        })),
        axisMax: 30,
        note: "return 2",
      },
    ];
  })(),
};

export const carPoolingPlatformsSolution: ProblemSolution = {
  approach:
    "Difference / sweep on the timeline: +passengers at start, −passengers at end; if running load ever exceeds capacity, impossible.",
  templates: langs(
    `def carPooling(trips, capacity):
    diff = [0] * 1001
    for p, s, e in trips:
        diff[s] += p
        diff[e] -= p
    cur = 0
    for x in diff:
        cur += x
        if cur > capacity:
            return False
    return True`,
    `bool carPooling(vector<vector<int>>& trips, int capacity) {
    vector<int> diff(1001);
    for (auto& t : trips) { diff[t[1]] += t[0]; diff[t[2]] -= t[0]; }
    int cur = 0;
    for (int x : diff) {
        cur += x;
        if (cur > capacity) return false;
    }
    return true;
}`,
    `boolean carPooling(int[][] trips, int capacity) {
    int[] diff = new int[1001];
    for (int[] t : trips) { diff[t[1]] += t[0]; diff[t[2]] -= t[0]; }
    int cur = 0;
    for (int x : diff) {
        cur += x;
        if (cur > capacity) return false;
    }
    return true;
}`,
    `function carPooling(trips, capacity) {
  const diff = Array(1001).fill(0);
  for (const [p, s, e] of trips) { diff[s] += p; diff[e] -= p; }
  let cur = 0;
  for (const x of diff) {
    cur += x;
    if (cur > capacity) return false;
  }
  return true;
}`,
  ),
  frames: (() => {
    // trips [[2,1,5],[3,3,7]], capacity 4 → false; capacity 5 → true. Use cap 4 story then show fail, or use cap 5 success.
    return [
      arrayFrame(
        "trips, capacity=4",
        "Event sweep: +pax at pickup, −pax at dropoff. Never exceed capacity.",
        ["+2@1", "+3@3", "−2@5", "−3@7"],
        {},
        { note: "cap=4" },
      ),
      arrayFrame("t=1 pickup 2", "Load = 2 ≤ 4.", [2], { 0: "window" }, { note: "cur=2" }),
      arrayFrame("t=3 pickup 3", "Load = 5 > 4 — impossible.", [2, 3], { 0: "window", 1: "hi" }, {
        note: "cur=5 FAIL",
      }),
      arrayFrame(
        "With capacity=5",
        "Same trips stay ≤ 5 for the whole ride.",
        [2, 3],
        { 0: "match", 1: "match" },
        { note: "peak=5 OK" },
      ),
      {
        kind: "intervals" as const,
        title: "Ride segments",
        caption: "[1,5] carries 2; [3,7] carries 3; overlap [3,5] needs 5 seats.",
        intervals: [
          { label: "2 pax", start: 1, end: 5, tone: "lo" },
          { label: "3 pax", start: 3, end: 7, tone: "hi" },
        ],
        axisMax: 8,
        note: "return true iff cap ≥ 5",
      },
      arrayFrame("Answer", "capacity 4 → false; capacity 5 → true.", ["cap≥5"], { 0: "match" }),
    ];
  })(),
};

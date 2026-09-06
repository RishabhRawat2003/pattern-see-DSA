import { arrayFrame } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const jobSequencingGfgSolution: ProblemSolution = {
  approach:
    "GFG: sort jobs by profit descending; place each in the latest free slot ≤ deadline. Sum profits of filled slots.",
  templates: langs(
    `def jobSequencing(jobs):
    # jobs: (id, deadline, profit)
    jobs = sorted(jobs, key=lambda j: -j[2])
    m = max(j[1] for j in jobs)
    slot = [None] * (m + 1)
    for jid, d, p in jobs:
        for t in range(d, 0, -1):
            if slot[t] is None:
                slot[t] = (jid, p)
                break
    return [x for x in slot if x]`,
    `vector<pair<int,int>> jobSequencing(vector<array<int,3>>& jobs) {
    sort(jobs.begin(), jobs.end(), [](auto& a, auto& b) { return a[2] > b[2]; });
    int m = 0;
    for (auto& j : jobs) m = max(m, j[1]);
    vector<pair<int,int>> slot(m + 1, {-1, -1});
    for (auto [jid, d, p] : jobs) {
        for (int t = d; t > 0; t--) {
            if (slot[t].first == -1) { slot[t] = {jid, p}; break; }
        }
    }
    return slot;
}`,
    `int[][] jobSequencing(int[][] jobs) {
    Arrays.sort(jobs, (a, b) -> b[2] - a[2]);
    int m = 0;
    for (int[] j : jobs) m = Math.max(m, j[1]);
    int[][] slot = new int[m + 1][];
    for (int[] job : jobs) {
        int jid = job[0], d = job[1], p = job[2];
        for (int t = d; t > 0; t--) {
            if (slot[t] == null) { slot[t] = new int[]{jid, p}; break; }
        }
    }
    return slot;
}`,
    `function jobSequencing(jobs) {
  jobs.sort((a, b) => b[2] - a[2]);
  const m = Math.max(...jobs.map((j) => j[1]));
  const slot = Array(m + 1).fill(null);
  for (const [jid, d, p] of jobs) {
    for (let t = d; t > 0; t--) {
      if (slot[t] == null) { slot[t] = [jid, p]; break; }
    }
  }
  return slot;
}`,
  ),
  frames: (() => {
    const jobs = [
      { id: "a", profit: 100, d: 2 },
      { id: "b", profit: 19, d: 1 },
      { id: "c", profit: 27, d: 2 },
      { id: "d", profit: 25, d: 1 },
      { id: "e", profit: 15, d: 3 },
    ];
    return [
      arrayFrame(
        "Sort by profit",
        "Place each job in the latest free slot ≤ deadline.",
        jobs.map((j) => `${j.id}:${j.profit}`),
      ),
      arrayFrame("Slot 2 ← a", "a (100, d=2) takes latest slot 2.", ["t1: ·", "t2: a", "t3: ·"], {
        1: "match",
      }),
      arrayFrame("Slot 1 ← c", "c (27, d=2): slot 2 taken → slot 1.", ["t1: c", "t2: a", "t3: ·"], {
        0: "active",
        1: "done",
      }),
      arrayFrame("Skip d,b", "d and b need slot ≤1 — already full.", ["t1: c", "t2: a", "t3: ·"], {
        0: "done",
        1: "done",
      }, { note: "d,b discarded" }),
      arrayFrame("Slot 3 ← e", "e (15, d=3) takes slot 3.", ["t1: c", "t2: a", "t3: e"], {
        0: "done",
        1: "done",
        2: "match",
      }, { note: "profit 100+27+15 = 142" }),
    ];
  })(),
};

export const maxProfitJobSchedulingSolution: ProblemSolution = {
  approach:
    "Sort jobs by end time. DP[i] = max profit using jobs ending at or before i: skip or take job i + DP of latest non-overlapping via binary search.",
  templates: langs(
    `import bisect
def jobScheduling(startTime, endTime, profit):
    jobs = sorted(zip(startTime, endTime, profit), key=lambda x: x[1])
    ends = [e for _, e, _ in jobs]
    dp = [0] * (len(jobs) + 1)
    for i, (s, e, p) in enumerate(jobs):
        j = bisect.bisect_right(ends, s, hi=i)
        dp[i + 1] = max(dp[i], dp[j] + p)
    return dp[-1]`,
    `int jobScheduling(vector<int>& start, vector<int>& end, vector<int>& profit) {
    int n = start.size();
    vector<array<int,3>> jobs(n);
    for (int i = 0; i < n; i++) jobs[i] = {end[i], start[i], profit[i]};
    sort(jobs.begin(), jobs.end());
    vector<int> dp(n + 1);
    for (int i = 0; i < n; i++) {
        int lo = 0, hi = i;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (jobs[mid][0] <= jobs[i][1]) lo = mid + 1;
            else hi = mid;
        }
        dp[i + 1] = max(dp[i], dp[lo] + jobs[i][2]);
    }
    return dp[n];
}`,
    `int jobScheduling(int[] start, int[] end, int[] profit) {
    int n = start.length;
    int[][] jobs = new int[n][3];
    for (int i = 0; i < n; i++) jobs[i] = new int[]{end[i], start[i], profit[i]};
    Arrays.sort(jobs, (a, b) -> a[0] - b[0]);
    int[] dp = new int[n + 1];
    for (int i = 0; i < n; i++) {
        int lo = 0, hi = i;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (jobs[mid][0] <= jobs[i][1]) lo = mid + 1;
            else hi = mid;
        }
        dp[i + 1] = Math.max(dp[i], dp[lo] + jobs[i][2]);
    }
    return dp[n];
}`,
    `function jobScheduling(startTime, endTime, profit) {
  const jobs = startTime.map((s, i) => [endTime[i], s, profit[i]]).sort((a, b) => a[0] - b[0]);
  const dp = Array(jobs.length + 1).fill(0);
  for (let i = 0; i < jobs.length; i++) {
    let lo = 0, hi = i;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (jobs[mid][0] <= jobs[i][1]) lo = mid + 1;
      else hi = mid;
    }
    dp[i + 1] = Math.max(dp[i], dp[lo] + jobs[i][2]);
  }
  return dp[jobs.length];
}`,
  ),
  frames: (() => {
    // start=[1,2,3,3], end=[3,4,5,6], profit=[50,10,40,70] → 120
    const jobs = ["[1,3]p50", "[2,4]p10", "[3,5]p40", "[3,6]p70"];
    return [
      arrayFrame("Jobs by end time", "DP: skip job i, or take it + best DP among jobs ending ≤ start.", jobs),
      arrayFrame("Job0 [1,3] p50", "No prior job → dp=50.", ["50"], { 0: "match" }, { note: "dp[1]=50" }),
      arrayFrame("Job1 [2,4] p10", "Overlaps job0 → max(50, 10)=50.", ["50", "50"], {
        0: "done",
        1: "active",
      }, { note: "dp[2]=50" }),
      arrayFrame("Job2 [3,5] p40", "Starts at 3 ≥ end of job0 → 50+40=90.", ["50", "50", "90"], {
        2: "match",
      }, { note: "dp[3]=90" }),
      arrayFrame("Job3 [3,6] p70", "Also chains after job0: 50+70=120 > 90.", ["50", "50", "90", "120"], {
        3: "match",
      }, { note: "return 120" }),
      arrayFrame("Answer", "Best non-overlapping profit = 120 ([1,3]+[3,6]).", [120], { 0: "match" }),
    ];
  })(),
};

export const courseScheduleIIISolution: ProblemSolution = {
  approach:
    "Sort courses by deadline. Greedily take each if it finishes on time; if not, replace the longest taken course (max-heap) when that shortens total time.",
  templates: langs(
    `import heapq
def scheduleCourse(courses):
    courses.sort(key=lambda x: x[1])
    h, t = [], 0
    for dur, last in courses:
        heapq.heappush(h, -dur)
        t += dur
        if t > last:
            t += heapq.heappop(h)
    return len(h)`,
    `int scheduleCourse(vector<vector<int>>& courses) {
    sort(courses.begin(), courses.end(), [](auto& a, auto& b) { return a[1] < b[1]; });
    priority_queue<int> h;
    int t = 0;
    for (auto& c : courses) {
        h.push(c[0]);
        t += c[0];
        if (t > c[1]) { t -= h.top(); h.pop(); }
    }
    return (int)h.size();
}`,
    `int scheduleCourse(int[][] courses) {
    Arrays.sort(courses, (a, b) -> a[1] - b[1]);
    PriorityQueue<Integer> h = new PriorityQueue<>((a, b) -> b - a);
    int t = 0;
    for (int[] c : courses) {
        h.offer(c[0]);
        t += c[0];
        if (t > c[1]) t -= h.poll();
    }
    return h.size();
}`,
    `function scheduleCourse(courses) {
  courses.sort((a, b) => a[1] - b[1]);
  const h = [];
  let t = 0;
  for (const [dur, last] of courses) {
    h.push(dur);
    t += dur;
    h.sort((a, b) => b - a);
    if (t > last) t -= h.shift();
  }
  return h.length;
}`,
  ),
  frames: (() => {
    // [[100,200],[200,1300],[1000,1250],[2000,3200]] → 3
    const courses = ["100/200", "200/1300", "1000/1250", "2000/3200"];
    return [
      arrayFrame(
        "Sort by deadline",
        "Take course if time+duration ≤ deadline; else drop the longest taken so far.",
        courses,
      ),
      {
        kind: "stack" as const,
        title: "Take 100/200",
        caption: "t=100 ≤ 200. Heap of durations: [100].",
        cells: courses.map((v, i) => ({
          value: v,
          tone: i === 0 ? ("active" as const) : ("idle" as const),
        })),
        stackItems: [{ value: "100", tone: "match" as const }],
        note: "t=100",
      },
      {
        kind: "stack" as const,
        title: "Take 200/1300",
        caption: "t=300 ≤ 1300.",
        cells: courses.map((v, i) => ({
          value: v,
          tone: i === 1 ? ("active" as const) : i === 0 ? ("done" as const) : ("idle" as const),
        })),
        stackItems: [
          { value: "200", tone: "hi" as const },
          { value: "100", tone: "idle" as const },
        ],
        note: "t=300",
      },
      {
        kind: "stack" as const,
        title: "Take 1000/1250",
        caption: "t=1300 > 1250 → pop longest (1000). t=300.",
        cells: courses.map((v, i) => ({
          value: v,
          tone: i === 2 ? ("skip" as const) : i < 2 ? ("done" as const) : ("idle" as const),
        })),
        stackItems: [
          { value: "200", tone: "idle" as const },
          { value: "100", tone: "idle" as const },
        ],
        note: "dropped 1000 · t=300",
      },
      {
        kind: "stack" as const,
        title: "Take 2000/3200",
        caption: "t=2300 ≤ 3200. Three courses kept.",
        cells: courses.map((v, i) => ({
          value: v,
          tone: i === 3 ? ("match" as const) : i === 2 ? ("skip" as const) : ("done" as const),
        })),
        stackItems: [
          { value: "2000", tone: "match" as const },
          { value: "200", tone: "done" as const },
          { value: "100", tone: "done" as const },
        ],
        note: "return 3",
      },
      arrayFrame("Answer", "Maximum courses completable = 3.", [3], { 0: "match" }),
    ];
  })(),
};

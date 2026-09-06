import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function kokoFrames(): Frame[] {
  const piles = [3, 6, 7, 11];
  const h = 8;
  const frames: Frame[] = [
    arrayFrame(
      "Koko’s piles",
      "Finish in 8 hours. Speed k costs ceil(pile / k) hours per pile. Search k on [1 … max].",
      piles,
      {},
      { note: "H = 8 hours" },
    ),
  ];
  const hours = (k: number) => piles.reduce((s, p) => s + Math.ceil(p / k), 0);
  let lo = 1;
  let hi = 11;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const used = hours(mid);
    const ok = used <= h;
    frames.push({
      kind: "numberline",
      title: `Try speed k = ${mid}`,
      caption: ok
        ? `${used} hours ≤ 8. Feasible — try slower (search left, keep mid).`
        : `${used} hours > 8. Too slow — search faster speeds right.`,
      range: { min: 1, max: 11, lo, hi, mid },
      cells: piles.map((value) => ({ value, tone: ok ? "match" : "skip" })),
      note: `hours(${mid}) = ${used}`,
    });
    if (ok) hi = mid;
    else lo = mid + 1;
  }
  frames.push({
    kind: "numberline",
    title: "Minimum feasible speed",
    caption: `k = ${lo} is the smallest speed that finishes in 8 hours.`,
    range: { min: 1, max: 11, lo, hi: lo, mid: lo },
    note: `answer = ${lo}`,
  });
  return frames;
}

function shipPackagesFrames(): Frame[] {
  const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const days = 5;
  const frames: Frame[] = [
    arrayFrame(
      "Packages in order",
      "Capacity mid ships contiguous loads. Need ≤ 5 days. Search capacity on [max … sum].",
      weights,
      {},
      { note: "days = 5" },
    ),
  ];
  const needDays = (cap: number) => {
    let d = 1;
    let load = 0;
    for (const w of weights) {
      if (load + w > cap) {
        d += 1;
        load = 0;
      }
      load += w;
    }
    return d;
  };
  let lo = Math.max(...weights);
  let hi = weights.reduce((s, w) => s + w, 0);
  const min = lo;
  const max = hi;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const used = needDays(mid);
    const ok = used <= days;
    frames.push({
      kind: "numberline",
      title: `Capacity = ${mid}`,
      caption: ok
        ? `${used} days ≤ 5. Feasible — try a smaller capacity.`
        : `${used} days > 5. Need more capacity — search right.`,
      range: { min, max, lo, hi, mid },
      note: `days(${mid}) = ${used}`,
    });
    if (ok) hi = mid;
    else lo = mid + 1;
  }
  frames.push({
    kind: "numberline",
    title: "Minimum capacity",
    caption: `Capacity ${lo} ships everything within 5 days.`,
    range: { min, max, lo, hi: lo, mid: lo },
    note: `answer = ${lo}`,
  });
  return frames;
}

function splitArrayFrames(): Frame[] {
  const nums = [7, 2, 5, 10, 8];
  const m = 2;
  const frames: Frame[] = [
    arrayFrame(
      "Split into m subarrays",
      "Minimize the largest subarray sum. Feasibility: can we split into ≤ m parts with sum ≤ mid?",
      nums,
      {},
      { note: "m = 2" },
    ),
  ];
  const can = (limit: number) => {
    let parts = 1;
    let sum = 0;
    for (const x of nums) {
      if (sum + x > limit) {
        parts += 1;
        sum = 0;
      }
      sum += x;
    }
    return parts <= m;
  };
  let lo = Math.max(...nums);
  let hi = nums.reduce((s, x) => s + x, 0);
  const min = lo;
  const max = hi;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const ok = can(mid);
    frames.push({
      kind: "numberline",
      title: `Limit sum = ${mid}`,
      caption: ok
        ? `Can split with largest sum ≤ ${mid} using ≤ 2 parts — try smaller.`
        : `Need more than 2 parts under limit ${mid} — raise the limit.`,
      range: { min, max, lo, hi, mid },
      cells: nums.map((value) => ({ value, tone: ok ? "match" : "skip" })),
      note: ok ? "feasible" : "infeasible",
    });
    if (ok) hi = mid;
    else lo = mid + 1;
  }
  frames.push({
    kind: "numberline",
    title: "Minimum largest sum",
    caption: `Answer ${lo}: best minimized maximum subarray sum with 2 splits.`,
    range: { min, max, lo, hi: lo, mid: lo },
    note: `answer = ${lo}`,
  });
  // show one split visualization
  frames.push(
    arrayFrame(
      "One optimal split",
      "e.g. [7, 2, 5] | [10, 8] → max(14, 18) = 18.",
      nums,
      { 0: "window", 1: "window", 2: "window", 3: "match", 4: "match" },
      {
        pointers: [
          { name: "cut", index: 2, color: PTR.S },
        ],
        note: "largest sum = 18",
      },
    ),
  );
  return frames;
}

export const kokoEatingBananasSolution: ProblemSolution = {
  approach:
    "Binary search eating speed k on [1 … max(pile)]. can(k) = hours needed ≤ H. Minimize feasible k. O(n log M).",
  templates: langs(
    `def minEatingSpeed(piles, h):
    def hours(k):
        return sum((p + k - 1) // k for p in piles)
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if hours(mid) <= h:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    `int minEatingSpeed(vector<int>& piles, int h) {
    auto hours = [&](int k) {
        long long need = 0;
        for (int p : piles) need += (p + k - 1LL) / k;
        return need;
    };
    int lo = 1, hi = *max_element(piles.begin(), piles.end());
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (hours(mid) <= h) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    `int minEatingSpeed(int[] piles, int h) {
    java.util.function.IntToLongFunction hours = k -> {
        long need = 0;
        for (int p : piles) need += (p + (long)k - 1) / k;
        return need;
    };
    int lo = 1, hi = 0;
    for (int p : piles) hi = Math.max(hi, p);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (hours.applyAsLong(mid) <= h) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    `function minEatingSpeed(piles, h) {
  const hours = (k) => piles.reduce((s, p) => s + Math.ceil(p / k), 0);
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (hours(mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
  ),
  frames: kokoFrames(),
};

export const capacityToShipPackagesSolution: ProblemSolution = {
  approach:
    "Binary search ship capacity on [max(weight) … sum]. can(cap) = days needed ≤ days. Minimize feasible capacity. O(n log S).",
  templates: langs(
    `def shipWithinDays(weights, days):
    def need(cap):
        d, load = 1, 0
        for w in weights:
            if load + w > cap:
                d += 1
                load = 0
            load += w
        return d
    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if need(mid) <= days:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    `int shipWithinDays(vector<int>& weights, int days) {
    auto need = [&](int cap) {
        int d = 1, load = 0;
        for (int w : weights) {
            if (load + w > cap) { d++; load = 0; }
            load += w;
        }
        return d;
    };
    int lo = *max_element(weights.begin(), weights.end());
    int hi = accumulate(weights.begin(), weights.end(), 0);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (need(mid) <= days) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    `int shipWithinDays(int[] weights, int days) {
    java.util.function.IntUnaryOperator need = cap -> {
        int d = 1, load = 0;
        for (int w : weights) {
            if (load + w > cap) { d++; load = 0; }
            load += w;
        }
        return d;
    };
    int lo = 0, hi = 0;
    for (int w : weights) { lo = Math.max(lo, w); hi += w; }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (need.applyAsInt(mid) <= days) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    `function shipWithinDays(weights, days) {
  const need = (cap) => {
    let d = 1, load = 0;
    for (const w of weights) {
      if (load + w > cap) { d++; load = 0; }
      load += w;
    }
    return d;
  };
  let lo = Math.max(...weights), hi = weights.reduce((s, w) => s + w, 0);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (need(mid) <= days) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
  ),
  frames: shipPackagesFrames(),
};

export const splitArrayLargestSumSolution: ProblemSolution = {
  approach:
    "Binary search the minimized largest sum on [max(nums) … sum]. can(limit) = split into ≤ m contiguous parts. O(n log S).",
  templates: langs(
    `def splitArray(nums, m):
    def can(limit):
        parts, s = 1, 0
        for x in nums:
            if s + x > limit:
                parts += 1
                s = 0
            s += x
        return parts <= m
    lo, hi = max(nums), sum(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if can(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    `int splitArray(vector<int>& nums, int m) {
    auto can = [&](int limit) {
        int parts = 1, s = 0;
        for (int x : nums) {
            if (s + x > limit) { parts++; s = 0; }
            s += x;
        }
        return parts <= m;
    };
    int lo = *max_element(nums.begin(), nums.end());
    int hi = accumulate(nums.begin(), nums.end(), 0);
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (can(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    `int splitArray(int[] nums, int m) {
    java.util.function.IntPredicate can = limit -> {
        int parts = 1, s = 0;
        for (int x : nums) {
            if (s + x > limit) { parts++; s = 0; }
            s += x;
        }
        return parts <= m;
    };
    int lo = 0, hi = 0;
    for (int x : nums) { lo = Math.max(lo, x); hi += x; }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (can.test(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    `function splitArray(nums, m) {
  const can = (limit) => {
    let parts = 1, s = 0;
    for (const x of nums) {
      if (s + x > limit) { parts++; s = 0; }
      s += x;
    }
    return parts <= m;
  };
  let lo = Math.max(...nums), hi = nums.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (can(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
  ),
  frames: splitArrayFrames(),
};

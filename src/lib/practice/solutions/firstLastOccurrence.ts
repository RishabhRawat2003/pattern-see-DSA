import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function firstLastFrames(): Frame[] {
  const a = [1, 2, 2, 2, 3, 4];
  const target = 2;
  const frames: Frame[] = [
    arrayFrame(
      "Duplicates of 2",
      "Run two binary searches: bias left for the first index, bias right for the last.",
      a,
      {},
      { note: "target = 2" },
    ),
  ];

  const search = (first: boolean) => {
    let lo = 0;
    let hi = a.length - 1;
    let ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      frames.push(
        arrayFrame(
          first ? "First occurrence" : "Last occurrence",
          a[mid] === target
            ? first
              ? "Found 2. Record mid and keep searching left."
              : "Found 2. Record mid and keep searching right."
            : a[mid] < target
              ? "Go right."
              : "Go left.",
          a,
          { [lo]: "lo", [mid]: a[mid] === target ? "match" : "mid", [hi]: "hi" },
          {
            pointers: [
              { name: "lo", index: lo, color: PTR.L },
              { name: "mid", index: mid, color: PTR.M },
              { name: "hi", index: hi, color: PTR.R },
            ],
            note: ans >= 0 ? `best index ${ans}` : "not found yet",
          },
        ),
      );
      if (a[mid] === target) {
        ans = mid;
        if (first) hi = mid - 1;
        else lo = mid + 1;
      } else if (a[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return ans;
  };

  const first = search(true);
  const last = search(false);
  frames.push(
    arrayFrame(
      "Range of 2",
      `First index ${first}, last index ${last}.`,
      a,
      { [first]: "match", [last]: "match", 2: "window" },
    ),
  );
  return frames;
}

function firstBadVersionFrames(): Frame[] {
  const versions = [1, 2, 3, 4, 5];
  const firstBad = 4;
  const isBad = (v: number) => v >= firstBad;
  const frames: Frame[] = [
    arrayFrame(
      "Version timeline",
      "Versions go good → bad once. Binary search for the leftmost bad.",
      versions,
      {},
      { note: "isBad(v) = v ≥ 4" },
    ),
  ];
  let lo = 1;
  let hi = 5;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const bad = isBad(mid);
    frames.push(
      arrayFrame(
        `Probe version ${mid}`,
        bad
          ? `${mid} is bad — first bad is at mid or left; set hi = mid.`
          : `${mid} is good — first bad is to the right; set lo = mid + 1.`,
        versions,
        {
          [lo - 1]: "lo",
          [mid - 1]: bad ? "match" : "mid",
          [hi - 1]: "hi",
        },
        {
          pointers: [
            { name: "lo", index: lo - 1, color: PTR.L },
            { name: "mid", index: mid - 1, color: PTR.M },
            { name: "hi", index: hi - 1, color: PTR.R },
          ],
          note: `search [${lo}, ${hi}]`,
        },
      ),
    );
    if (bad) hi = mid;
    else lo = mid + 1;
  }
  frames.push(
    arrayFrame(
      "First bad",
      `Version ${lo} is the first bad version.`,
      versions,
      { [lo - 1]: "match" },
      { note: `answer = ${lo}` },
    ),
  );
  return frames;
}

function sqrtxFrames(): Frame[] {
  const x = 8;
  const frames: Frame[] = [
    {
      kind: "numberline",
      title: "Integer square root",
      caption: "Binary search mid on [0 … x]. Find the largest mid with mid² ≤ x.",
      range: { min: 0, max: x, lo: 0, hi: x },
      note: "x = 8",
    },
  ];
  let lo = 0;
  let hi = x;
  let ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const sq = mid * mid;
    const ok = sq <= x;
    frames.push({
      kind: "numberline",
      title: `Try mid = ${mid}`,
      caption: ok
        ? `${mid}² = ${sq} ≤ 8 — feasible; record and search right for a larger root.`
        : `${mid}² = ${sq} > 8 — too big; search left.`,
      range: { min: 0, max: x, lo, hi, mid },
      note: ok ? `best = ${mid}` : `best = ${ans}`,
    });
    if (ok) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  frames.push({
    kind: "numberline",
    title: "Floor sqrt",
    caption: `Largest integer whose square ≤ 8 is ${ans}.`,
    range: { min: 0, max: x, lo: ans, hi: ans, mid: ans },
    note: `answer = ${ans}`,
  });
  return frames;
}

export const findFirstAndLastPositionSolution: ProblemSolution = {
  approach:
    "Two binary searches that bias left (first) and right (last) when nums[mid] equals the target. O(log n) time, O(1) space.",
  templates: langs(
    `def searchRange(nums, target):
    def bound(first):
        lo, hi, ans = 0, len(nums) - 1, -1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                ans = mid
                if first: hi = mid - 1
                else: lo = mid + 1
            elif nums[mid] < target: lo = mid + 1
            else: hi = mid - 1
        return ans
    return [bound(True), bound(False)]`,
    `vector<int> searchRange(vector<int>& nums, int target) {
    auto bound = [&](bool first) {
        int lo = 0, hi = (int)nums.size() - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) {
                ans = mid;
                if (first) hi = mid - 1; else lo = mid + 1;
            } else if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return ans;
    };
    return {bound(true), bound(false)};
}`,
    `int[] searchRange(int[] nums, int target) {
    java.util.function.IntUnaryOperator bound = first -> {
        int lo = 0, hi = nums.length - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) {
                ans = mid;
                if (first == 1) hi = mid - 1; else lo = mid + 1;
            } else if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return ans;
    };
    return new int[]{bound.applyAsInt(1), bound.applyAsInt(0)};
}`,
    `function searchRange(nums, target) {
  function bound(first) {
    let lo = 0, hi = nums.length - 1, ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] === target) {
        ans = mid;
        if (first) hi = mid - 1; else lo = mid + 1;
      } else if (nums[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return ans;
  }
  return [bound(true), bound(false)];
}`,
  ),
  frames: firstLastFrames(),
};

export const firstBadVersionSolution: ProblemSolution = {
  approach:
    "isBadVersion is monotonic (once bad, stays bad). Binary search the leftmost true. O(log n) API calls.",
  templates: langs(
    `def firstBadVersion(n):
    lo, hi = 1, n
    while lo < hi:
        mid = (lo + hi) // 2
        if isBadVersion(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    `int firstBadVersion(int n) {
    int lo = 1, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (isBadVersion(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    `int firstBadVersion(int n) {
    int lo = 1, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (isBadVersion(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    `function firstBadVersion(n) {
  let lo = 1, hi = n;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (isBadVersion(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
  ),
  frames: firstBadVersionFrames(),
};

export const sqrtxSolution: ProblemSolution = {
  approach:
    "Binary search the answer on [0 … x]: keep the largest mid with mid² ≤ x. O(log x) time, O(1) space.",
  templates: langs(
    `def mySqrt(x):
    lo, hi, ans = 0, x, 0
    while lo <= hi:
        mid = (lo + hi) // 2
        if mid * mid <= x:
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return ans`,
    `int mySqrt(int x) {
    long lo = 0, hi = x, ans = 0;
    while (lo <= hi) {
        long mid = lo + (hi - lo) / 2;
        if (mid * mid <= x) { ans = mid; lo = mid + 1; }
        else hi = mid - 1;
    }
    return (int)ans;
}`,
    `int mySqrt(int x) {
    long lo = 0, hi = x, ans = 0;
    while (lo <= hi) {
        long mid = lo + (hi - lo) / 2;
        if (mid * mid <= x) { ans = mid; lo = mid + 1; }
        else hi = mid - 1;
    }
    return (int)ans;
}`,
    `function mySqrt(x) {
  let lo = 0, hi = x, ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (mid * mid <= x) { ans = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return ans;
}`,
  ),
  frames: sqrtxFrames(),
};

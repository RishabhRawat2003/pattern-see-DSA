import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function lowerBoundInsertFrames(): Frame[] {
  const a = [1, 3, 5, 6];
  const x = 5;
  const frames: Frame[] = [
    arrayFrame(
      "Lower bound = insert",
      "Search insert position is lower_bound(target): first index with value ≥ target.",
      a,
      {},
      { note: "target = 5" },
    ),
  ];
  let lo = 0;
  let hi = a.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const goRight = a[mid] < x;
    frames.push(
      arrayFrame(
        `Lower bound of ${x}`,
        goRight
          ? `${a[mid]} < ${x} — bound is still right of mid.`
          : `${a[mid]} ≥ ${x} — mid could be the bound; shrink hi.`,
        a,
        {
          [Math.min(lo, a.length - 1)]: "lo",
          [Math.min(mid, a.length - 1)]: "mid",
        },
        {
          pointers: [
            { name: "lo", index: Math.min(lo, a.length - 1), color: PTR.L },
            { name: "mid", index: Math.min(mid, a.length - 1), color: PTR.M },
          ],
          note: `half-open [${lo}, ${hi})`,
        },
      ),
    );
    if (goRight) lo = mid + 1;
    else hi = mid;
  }
  frames.push(
    arrayFrame(
      "Bound found",
      `Lower bound index ${lo}${a[lo] === x ? " — value already present." : ""}.`,
      a,
      { [lo]: "match" },
      { note: `answer = ${lo}` },
    ),
  );
  return frames;
}

function firstLastViaBoundsFrames(): Frame[] {
  const a = [1, 3, 5, 7, 7, 9];
  const x = 7;
  const frames: Frame[] = [
    arrayFrame(
      "Bounds window",
      "Lower bound = first ≥ 7. Upper bound = first > 7. The range is [lb, ub).",
      a,
      {},
      { note: "target = 7" },
    ),
  ];

  const bound = (strict: boolean) => {
    let lo = 0;
    let hi = a.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const goRight = strict ? a[mid] <= x : a[mid] < x;
      frames.push(
        arrayFrame(
          strict ? "Upper bound (first > 7)" : "Lower bound (first ≥ 7)",
          goRight
            ? `${a[mid]} is still not past the bound — search right.`
            : `${a[mid]} is already past — search left, keep mid.`,
          a,
          {
            [Math.min(lo, a.length - 1)]: "lo",
            [Math.min(mid, a.length - 1)]: "mid",
          },
          {
            pointers: [
              { name: "lo", index: Math.min(lo, a.length - 1), color: PTR.L },
              { name: "mid", index: Math.min(mid, a.length - 1), color: PTR.M },
            ],
            note: `search range [${lo}, ${hi})`,
          },
        ),
      );
      if (goRight) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  const lb = bound(false);
  const ub = bound(true);
  const found = lb < a.length && a[lb] === x;
  frames.push(
    arrayFrame(
      "First & last via bounds",
      found
        ? `First = ${lb}, last = ${ub - 1}. All 7s live in [${lb}, ${ub}).`
        : "Target missing — return [-1, -1].",
      a,
      found
        ? { [lb]: "match", [ub - 1]: "match", ...(ub - lb > 2 ? { [lb + 1]: "window" } : {}) }
        : {},
      { note: found ? `[${lb}, ${ub})` : "not found" },
    ),
  );
  return frames;
}

function nextLetterFrames(): Frame[] {
  const a = ["c", "f", "j"];
  const target = "a";
  const frames: Frame[] = [
    arrayFrame(
      "Circular letters",
      "Upper bound of target, then wrap: first letter strictly greater than target (mod n).",
      a,
      {},
      { note: `target = '${target}'` },
    ),
  ];
  let lo = 0;
  let hi = a.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const goRight = a[mid] <= target;
    frames.push(
      arrayFrame(
        `Upper bound of '${target}'`,
        goRight
          ? `'${a[mid]}' ≤ '${target}' — need something larger; go right.`
          : `'${a[mid]}' > '${target}' — candidate; shrink hi.`,
        a,
        {
          [Math.min(lo, a.length - 1)]: "lo",
          [Math.min(mid, a.length - 1)]: "mid",
        },
        {
          pointers: [
            { name: "lo", index: Math.min(lo, a.length - 1), color: PTR.L },
            { name: "mid", index: Math.min(mid, a.length - 1), color: PTR.M },
          ],
          note: `half-open [${lo}, ${hi})`,
        },
      ),
    );
    if (goRight) lo = mid + 1;
    else hi = mid;
  }
  const ans = lo % a.length;
  frames.push(
    arrayFrame(
      "Wrap if needed",
      lo === a.length
        ? `Upper bound is past the end → wrap to '${a[0]}'.`
        : `Letter '${a[ans]}' is the smallest greater than '${target}'.`,
      a,
      { [ans]: "match" },
      { note: `answer = '${a[ans]}'` },
    ),
  );
  return frames;
}

export const searchInsertBoundSolution: ProblemSolution = {
  approach:
    "Lower bound on a sorted array: first index with nums[i] ≥ target. That index is the insert position. O(log n) time.",
  templates: langs(
    `def searchInsert(nums, target):
    lo, hi = 0, len(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo`,
    `int searchInsert(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
    `int searchInsert(int[] nums, int target) {
    int lo = 0, hi = nums.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
    `function searchInsert(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
  ),
  frames: lowerBoundInsertFrames(),
};

export const firstLastBoundSolution: ProblemSolution = {
  approach:
    "Compute lower_bound(target) and upper_bound(target). If lb points at target, answer is [lb, ub − 1]; else [-1, -1]. O(log n).",
  templates: langs(
    `def searchRange(nums, target):
    def bound(strict):
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] <= target if strict else nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid
        return lo
    lb, ub = bound(False), bound(True)
    if lb == ub or nums[lb] != target:
        return [-1, -1]
    return [lb, ub - 1]`,
    `vector<int> searchRange(vector<int>& nums, int target) {
    auto bound = [&](bool strict) {
        int lo = 0, hi = (int)nums.size();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if ((!strict && nums[mid] < target) || (strict && nums[mid] <= target))
                lo = mid + 1;
            else hi = mid;
        }
        return lo;
    };
    int lb = bound(false), ub = bound(true);
    if (lb == ub || nums[lb] != target) return {-1, -1};
    return {lb, ub - 1};
}`,
    `int[] searchRange(int[] nums, int target) {
    java.util.function.IntUnaryOperator bound = strict -> {
        int lo = 0, hi = nums.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            boolean goRight = strict == 1 ? nums[mid] <= target : nums[mid] < target;
            if (goRight) lo = mid + 1; else hi = mid;
        }
        return lo;
    };
    int lb = bound.applyAsInt(0), ub = bound.applyAsInt(1);
    if (lb == ub || nums[lb] != target) return new int[]{-1, -1};
    return new int[]{lb, ub - 1};
}`,
    `function searchRange(nums, target) {
  function bound(strict) {
    let lo = 0, hi = nums.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (strict ? nums[mid] <= target : nums[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  const lb = bound(false), ub = bound(true);
  if (lb === ub || nums[lb] !== target) return [-1, -1];
  return [lb, ub - 1];
}`,
  ),
  frames: firstLastViaBoundsFrames(),
};

export const smallestLetterGreaterSolution: ProblemSolution = {
  approach:
    "Upper bound of target in a circular sorted letter array, then index % n. O(log n) time, O(1) space.",
  templates: langs(
    `def nextGreatestLetter(letters, target):
    lo, hi = 0, len(letters)
    while lo < hi:
        mid = (lo + hi) // 2
        if letters[mid] <= target:
            lo = mid + 1
        else:
            hi = mid
    return letters[lo % len(letters)]`,
    `char nextGreatestLetter(vector<char>& letters, char target) {
    int lo = 0, hi = (int)letters.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (letters[mid] <= target) lo = mid + 1;
        else hi = mid;
    }
    return letters[lo % letters.size()];
}`,
    `char nextGreatestLetter(char[] letters, char target) {
    int lo = 0, hi = letters.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (letters[mid] <= target) lo = mid + 1;
        else hi = mid;
    }
    return letters[lo % letters.length];
}`,
    `function nextGreatestLetter(letters, target) {
  let lo = 0, hi = letters.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (letters[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return letters[lo % letters.length];
}`,
  ),
  frames: nextLetterFrames(),
};

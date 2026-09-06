import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function binarySearchFrames(): Frame[] {
  const a = [2, 5, 8, 12, 13, 18, 21];
  const target = 13;
  const frames: Frame[] = [
    arrayFrame(
      "Sorted array",
      "Search for 13. Compare mid to the target and discard half each step.",
      a,
      {},
      { note: "target = 13" },
    ),
  ];
  let lo = 0;
  let hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    frames.push(
      arrayFrame(
        `lo=${lo}  mid=${mid}  hi=${hi}`,
        a[mid] === target
          ? `${a[mid]} equals the target. Done.`
          : a[mid] < target
            ? `${a[mid]} < 13 — discard left half including mid.`
            : `${a[mid]} > 13 — discard right half including mid.`,
        a,
        { [lo]: "lo", [mid]: a[mid] === target ? "match" : "mid", [hi]: "hi" },
        {
          pointers: [
            { name: "lo", index: lo, color: PTR.L },
            { name: "mid", index: mid, color: PTR.M },
            { name: "hi", index: hi, color: PTR.R },
          ],
        },
      ),
    );
    if (a[mid] === target) break;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return frames;
}

function searchInsertFrames(): Frame[] {
  const a = [1, 3, 5, 6];
  const target = 2;
  const frames: Frame[] = [
    arrayFrame(
      "Insert position",
      "Find the first index where a[i] ≥ 2. That is where 2 would be inserted.",
      a,
      {},
      { note: "target = 2" },
    ),
  ];
  let lo = 0;
  let hi = a.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const goRight = a[mid] < target;
    frames.push(
      arrayFrame(
        `lo=${lo}  mid=${mid}  hi=${hi}`,
        goRight
          ? `${a[mid]} < 2 — insert is still to the right.`
          : `${a[mid]} ≥ 2 — keep mid as a candidate and search left.`,
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
  frames.push(
    arrayFrame(
      "Answer",
      `Insert at index ${lo}. Array stays sorted after inserting 2 there.`,
      a,
      { [Math.min(lo, a.length - 1)]: "match" },
      { note: `answer = ${lo}` },
    ),
  );
  return frames;
}

function rotatedSearchFrames(): Frame[] {
  const a = [4, 5, 6, 7, 0, 1, 2];
  const target = 0;
  const frames: Frame[] = [
    arrayFrame(
      "Rotated sorted",
      "One half of [lo, hi] is always sorted. Check which half contains the target.",
      a,
      {},
      { note: "target = 0" },
    ),
  ];
  let lo = 0;
  let hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const leftSorted = a[lo] <= a[mid];
    frames.push(
      arrayFrame(
        `lo=${lo}  mid=${mid}  hi=${hi}`,
        a[mid] === target
          ? `${a[mid]} is the target.`
          : leftSorted
            ? `Left half [${a[lo]}…${a[mid]}] is sorted.`
            : `Right half [${a[mid]}…${a[hi]}] is sorted.`,
        a,
        { [lo]: "lo", [mid]: a[mid] === target ? "match" : "mid", [hi]: "hi" },
        {
          pointers: [
            { name: "lo", index: lo, color: PTR.L },
            { name: "mid", index: mid, color: PTR.M },
            { name: "hi", index: hi, color: PTR.R },
          ],
          note: leftSorted ? "left sorted" : "right sorted",
        },
      ),
    );
    if (a[mid] === target) break;
    if (leftSorted) {
      if (a[lo] <= target && target < a[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (a[mid] < target && target <= a[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return frames;
}

export const binarySearchSolution: ProblemSolution = {
  approach:
    "Classic binary search on a sorted array: compare mid to target, discard the half that cannot contain it. O(log n) time, O(1) space.",
  templates: langs(
    `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
    `int search(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    `int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
  ),
  frames: binarySearchFrames(),
};

export const searchInsertPositionSolution: ProblemSolution = {
  approach:
    "Binary search for the first index with value ≥ target (lower bound). That index is the insert position. O(log n) time, O(1) space.",
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
  frames: searchInsertFrames(),
};

export const searchInRotatedSortedArraySolution: ProblemSolution = {
  approach:
    "At mid, one side of [lo, hi] is sorted. If target lies in the sorted side, search there; otherwise search the other. O(log n) time, O(1) space.",
  templates: langs(
    `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
    `int search(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
    `int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
    `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
  ),
  frames: rotatedSearchFrames(),
};

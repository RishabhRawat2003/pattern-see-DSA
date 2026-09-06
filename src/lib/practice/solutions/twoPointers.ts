import {
  containerWithMostWaterFrames,
  threeSumFrames,
  twoSumIIFrames,
} from "../../demos/problems/twoPointers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const twoSumIISolution: ProblemSolution = {
  approach:
    "Inward two pointers on the sorted array: if sum is too small move L right, if too big move R left. O(n) time, O(1) space.",
  templates: langs(
    `def twoSum(numbers, target):
    lo, hi = 0, len(numbers) - 1
    while lo < hi:
        s = numbers[lo] + numbers[hi]
        if s == target:
            return [lo + 1, hi + 1]  # 1-based
        if s < target:
            lo += 1
        else:
            hi -= 1
    return []`,
    `vector<int> twoSum(vector<int>& numbers, int target) {
    int lo = 0, hi = (int)numbers.size() - 1;
    while (lo < hi) {
        int s = numbers[lo] + numbers[hi];
        if (s == target) return {lo + 1, hi + 1};
        if (s < target) lo++;
        else hi--;
    }
    return {};
}`,
    `int[] twoSum(int[] numbers, int target) {
    int lo = 0, hi = numbers.length - 1;
    while (lo < hi) {
        int s = numbers[lo] + numbers[hi];
        if (s == target) return new int[]{lo + 1, hi + 1};
        if (s < target) lo++;
        else hi--;
    }
    return new int[]{};
}`,
    `function twoSum(numbers, target) {
  let lo = 0, hi = numbers.length - 1;
  while (lo < hi) {
    const s = numbers[lo] + numbers[hi];
    if (s === target) return [lo + 1, hi + 1];
    if (s < target) lo++;
    else hi--;
  }
  return [];
}`,
  ),
  frames: twoSumIIFrames(),
};

export const threeSumSolution: ProblemSolution = {
  approach:
    "Sort, then for each index i run two pointers for a pair that sums to −nums[i]. Skip duplicates on i/L/R. O(n²) time, O(1) extra (aside from output).",
  templates: langs(
    `def threeSum(nums):
    nums.sort()
    out = []
    for i in range(len(nums) - 2):
        if i and nums[i] == nums[i - 1]:
            continue
        lo, hi = i + 1, len(nums) - 1
        while lo < hi:
            s = nums[i] + nums[lo] + nums[hi]
            if s == 0:
                out.append([nums[i], nums[lo], nums[hi]])
                lo += 1
                hi -= 1
                while lo < hi and nums[lo] == nums[lo - 1]:
                    lo += 1
                while lo < hi and nums[hi] == nums[hi + 1]:
                    hi -= 1
            elif s < 0:
                lo += 1
            else:
                hi -= 1
    return out`,
    `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> out;
    for (int i = 0; i + 2 < (int)nums.size(); i++) {
        if (i && nums[i] == nums[i - 1]) continue;
        int lo = i + 1, hi = (int)nums.size() - 1;
        while (lo < hi) {
            int s = nums[i] + nums[lo] + nums[hi];
            if (s == 0) {
                out.push_back({nums[i], nums[lo], nums[hi]});
                lo++; hi--;
                while (lo < hi && nums[lo] == nums[lo - 1]) lo++;
                while (lo < hi && nums[hi] == nums[hi + 1]) hi--;
            } else if (s < 0) lo++;
            else hi--;
        }
    }
    return out;
}`,
    `List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> out = new ArrayList<>();
    for (int i = 0; i + 2 < nums.length; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int lo = i + 1, hi = nums.length - 1;
        while (lo < hi) {
            int s = nums[i] + nums[lo] + nums[hi];
            if (s == 0) {
                out.add(Arrays.asList(nums[i], nums[lo], nums[hi]));
                lo++; hi--;
                while (lo < hi && nums[lo] == nums[lo - 1]) lo++;
                while (lo < hi && nums[hi] == nums[hi + 1]) hi--;
            } else if (s < 0) lo++;
            else hi--;
        }
    }
    return out;
}`,
    `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i + 2 < nums.length; i++) {
    if (i && nums[i] === nums[i - 1]) continue;
    let lo = i + 1, hi = nums.length - 1;
    while (lo < hi) {
      const s = nums[i] + nums[lo] + nums[hi];
      if (s === 0) {
        out.push([nums[i], nums[lo], nums[hi]]);
        lo++; hi--;
        while (lo < hi && nums[lo] === nums[lo - 1]) lo++;
        while (lo < hi && nums[hi] === nums[hi + 1]) hi--;
      } else if (s < 0) lo++;
      else hi--;
    }
  }
  return out;
}`,
  ),
  frames: threeSumFrames(),
};

export const containerWithMostWaterSolution: ProblemSolution = {
  approach:
    "Two pointers at both ends. Area is min(height) × width. Always move the shorter wall inward — the taller one cannot raise the min. O(n) time, O(1) space.",
  templates: langs(
    `def maxArea(height):
    lo, hi = 0, len(height) - 1
    best = 0
    while lo < hi:
        best = max(best, min(height[lo], height[hi]) * (hi - lo))
        if height[lo] <= height[hi]:
            lo += 1
        else:
            hi -= 1
    return best`,
    `int maxArea(vector<int>& height) {
    int lo = 0, hi = (int)height.size() - 1, best = 0;
    while (lo < hi) {
        best = max(best, min(height[lo], height[hi]) * (hi - lo));
        if (height[lo] <= height[hi]) lo++;
        else hi--;
    }
    return best;
}`,
    `int maxArea(int[] height) {
    int lo = 0, hi = height.length - 1, best = 0;
    while (lo < hi) {
        best = Math.max(best, Math.min(height[lo], height[hi]) * (hi - lo));
        if (height[lo] <= height[hi]) lo++;
        else hi--;
    }
    return best;
}`,
    `function maxArea(height) {
  let lo = 0, hi = height.length - 1, best = 0;
  while (lo < hi) {
    best = Math.max(best, Math.min(height[lo], height[hi]) * (hi - lo));
    if (height[lo] <= height[hi]) lo++;
    else hi--;
  }
  return best;
}`,
  ),
  frames: containerWithMostWaterFrames(),
};

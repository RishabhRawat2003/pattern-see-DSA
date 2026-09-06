import { PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function twoSumFrames(): Frame[] {
  const a = [2, 7, 11, 15];
  const target = 9;
  const seen: Record<string, number> = {};
  const frames: Frame[] = [
    {
      kind: "hashmap",
      title: "Two-sum with a map",
      caption: "For each x, look up target − x. If missing, store x → index.",
      cells: a.map((value) => ({ value })),
      mapEntries: [],
      note: "target = 9",
    },
  ];
  for (let i = 0; i < a.length; i++) {
    const need = target - a[i];
    const found = need in seen;
    frames.push({
      kind: "hashmap",
      title: `x = ${a[i]}, need ${need}`,
      caption: found
        ? `${need} is already in the map at index ${seen[need]}. Pair (${need}, ${a[i]}).`
        : `${need} is not in the map. Store ${a[i]} → ${i}.`,
      cells: a.map((value, idx) => ({
        value,
        tone: idx === i ? "active" : Object.values(seen).includes(idx) ? "done" : "idle",
      })),
      mapEntries: Object.entries(seen).map(([key, value]) => ({
        key,
        value: `index ${value}`,
        tone: Number(key) === need ? "match" : "idle",
      })),
      pointers: [{ name: "i", index: i, color: PTR.M }],
    });
    if (found) break;
    seen[a[i]] = i;
  }
  return frames;
}

function containsDuplicateMapFrames(): Frame[] {
  const a = [1, 2, 3, 1];
  const seen: Record<string, number> = {};
  const frames: Frame[] = [
    {
      kind: "hashmap",
      title: "Seen before?",
      caption: "Map each value to its index. A hit means a duplicate.",
      cells: a.map((value) => ({ value })),
      mapEntries: [],
    },
  ];
  for (let i = 0; i < a.length; i++) {
    const dup = a[i] in seen;
    frames.push({
      kind: "hashmap",
      title: dup ? `Hit: ${a[i]}` : `Store ${a[i]}`,
      caption: dup
        ? `${a[i]} was seen at index ${seen[a[i]]}. Duplicate found.`
        : `First time seeing ${a[i]}. Remember index ${i}.`,
      cells: a.map((value, idx) => ({
        value,
        tone: idx === i ? (dup ? "match" : "active") : idx < i ? "done" : "idle",
      })),
      mapEntries: Object.entries(seen).map(([key, value]) => ({
        key,
        value: `index ${value}`,
        tone: Number(key) === a[i] ? "match" : "idle",
      })),
      pointers: [{ name: "i", index: i, color: PTR.M }],
    });
    if (dup) break;
    seen[a[i]] = i;
  }
  return frames;
}

function containsDuplicateIIFrames(): Frame[] {
  const a = [1, 2, 3, 1];
  const k = 3;
  const seen: Record<string, number> = {};
  const frames: Frame[] = [
    {
      kind: "hashmap",
      title: "Duplicate within distance k",
      caption: "Store last index of each value. Duplicate if i − last ≤ k.",
      cells: a.map((value) => ({ value })),
      mapEntries: [],
      note: "k = 3",
    },
  ];
  for (let i = 0; i < a.length; i++) {
    const prev = seen[a[i]];
    const hit = prev !== undefined && i - prev <= k;
    frames.push({
      kind: "hashmap",
      title: `i = ${i}, value ${a[i]}`,
      caption: hit
        ? `Last saw ${a[i]} at ${prev}. Distance ${i - prev} ≤ ${k}. True.`
        : prev !== undefined
          ? `Saw ${a[i]} at ${prev}, but distance > k. Update last index.`
          : `New value. Store ${a[i]} → ${i}.`,
      cells: a.map((value, idx) => ({
        value,
        tone:
          idx === i
            ? hit
              ? "match"
              : "active"
            : prev !== undefined && idx === prev
              ? "lo"
              : idx < i
                ? "done"
                : "idle",
      })),
      mapEntries: Object.entries(seen).map(([key, value]) => ({
        key,
        value: `index ${value}`,
        tone: Number(key) === a[i] ? (hit ? "match" : "active") : "idle",
      })),
      pointers: [{ name: "i", index: i, color: PTR.M }],
      note: hit ? `|i − j| ≤ k` : undefined,
    });
    if (hit) break;
    seen[a[i]] = i;
  }
  return frames;
}

export const twoSumSolution: ProblemSolution = {
  approach:
    "One pass hash map: for each x look up target − x; otherwise store x → index. O(n) time, O(n) space.",
  templates: langs(
    `def twoSum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i`,
    `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int,int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (seen.count(target - nums[i]))
            return {seen[target - nums[i]], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
    `int[] twoSum(int[] nums, int target) {
    Map<Integer,Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        if (seen.containsKey(target - nums[i]))
            return new int[]{seen.get(target - nums[i]), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
    `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(target - nums[i])) return [seen.get(target - nums[i]), i];
    seen.set(nums[i], i);
  }
}`,
  ),
  frames: twoSumFrames(),
};

export const containsDuplicateSolution: ProblemSolution = {
  approach:
    "Hash map (or set) of seen values. If a key already exists, return true. O(n) time, O(n) space.",
  templates: langs(
    `def containsDuplicate(nums):
    seen = {}
    for i, x in enumerate(nums):
        if x in seen:
            return True
        seen[x] = i
    return False`,
    `bool containsDuplicate(vector<int>& nums) {
    unordered_map<int,int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (seen.count(nums[i])) return true;
        seen[nums[i]] = i;
    }
    return false;
}`,
    `boolean containsDuplicate(int[] nums) {
    Map<Integer,Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        if (seen.containsKey(nums[i])) return true;
        seen.put(nums[i], i);
    }
    return false;
}`,
    `function containsDuplicate(nums) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(nums[i])) return true;
    seen.set(nums[i], i);
  }
  return false;
}`,
  ),
  frames: containsDuplicateMapFrames(),
};

export const containsDuplicateIISolution: ProblemSolution = {
  approach:
    "Map value → last index. On a repeat, check i − last ≤ k, then update the index. O(n) time, O(n) space.",
  templates: langs(
    `def containsNearbyDuplicate(nums, k):
    seen = {}
    for i, x in enumerate(nums):
        if x in seen and i - seen[x] <= k:
            return True
        seen[x] = i
    return False`,
    `bool containsNearbyDuplicate(vector<int>& nums, int k) {
    unordered_map<int,int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (seen.count(nums[i]) && i - seen[nums[i]] <= k) return true;
        seen[nums[i]] = i;
    }
    return false;
}`,
    `boolean containsNearbyDuplicate(int[] nums, int k) {
    Map<Integer,Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        if (seen.containsKey(nums[i]) && i - seen.get(nums[i]) <= k) return true;
        seen.put(nums[i], i);
    }
    return false;
}`,
    `function containsNearbyDuplicate(nums, k) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(nums[i]) && i - seen.get(nums[i]) <= k) return true;
    seen.set(nums[i], i);
  }
  return false;
}`,
  ),
  frames: containsDuplicateIIFrames(),
};

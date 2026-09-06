import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function singleNumberFrames() {
  const a = [2, 3, 2, 4, 4];
  return [
    arrayFrame("nums = [2,3,2,4,4]", "XOR identity: x^x=0, x^0=x. Every pair cancels; the singleton remains.", a, {}, {
      note: "acc = 0",
    }),
    arrayFrame("2 ^ 3", "Fold left to right. After 2^3, accumulator is 1.", a, { 0: "done", 1: "active" }, {
      pointers: [{ name: "i", index: 1, color: PTR.M }],
      note: "acc = 1",
    }),
    arrayFrame("1 ^ 2", "Second 2 cancels the first. Left with 3 so far.", a, { 0: "done", 1: "window", 2: "active" }, {
      pointers: [{ name: "i", index: 2, color: PTR.M }],
      note: "acc = 3",
    }),
    arrayFrame("3 ^ 4 ^ 4", "Both 4s cancel. Only 3 never paired.", a, { 1: "match", 3: "done", 4: "done" }, {
      note: "acc = 3",
    }),
    arrayFrame("Answer", "Single number is 3. O(n) time, O(1) space.", a, { 1: "match" }, { note: "return 3" }),
  ];
}

function singleNumberIIFrames() {
  const a = [2, 2, 3, 2];
  return [
    arrayFrame(
      "Every number ×3 except one",
      "Track bits seen once (ones) and twice (twos). Third sighting clears both.",
      a,
      {},
      { note: "ones=0 · twos=0" },
    ),
    arrayFrame("See 2 once", "ones ← (ones^x) & ~twos. Bit of 2 sits in ones.", a, { 0: "active" }, {
      pointers: [{ name: "i", index: 0, color: PTR.M }],
      note: "ones=2 · twos=0",
    }),
    arrayFrame("See 2 twice", "twos ← (twos^x) & ~ones. Move 2 into twos.", a, { 0: "done", 1: "active" }, {
      pointers: [{ name: "i", index: 1, color: PTR.M }],
      note: "ones=0 · twos=2",
    }),
    arrayFrame("See 3 once", "3 enters ones. twos still holds 2.", a, { 2: "active" }, {
      pointers: [{ name: "i", index: 2, color: PTR.M }],
      note: "ones=3 · twos=2",
    }),
    arrayFrame("Third 2", "Third sighting clears 2 from ones and twos. ones left with 3.", a, { 3: "active", 2: "match" }, {
      pointers: [{ name: "i", index: 3, color: PTR.M }],
      note: "ones=3 · twos=0",
    }),
    arrayFrame("Answer", "ones holds the unique number appearing once.", a, { 2: "match" }, { note: "return 3" }),
  ];
}

function singleNumberIIIFrames() {
  const a = [1, 2, 1, 3, 2, 5];
  return [
    arrayFrame(
      "Two uniques",
      "XOR all → xor = u^v (nonzero). Pick any set bit of xor to split the array into two groups.",
      a,
      {},
      { note: "xor all" },
    ),
    arrayFrame("Fold XOR", "Pairs 1^1 and 2^2 cancel. Left with 3^5 = 6.", a, { 0: "done", 1: "done", 2: "done", 3: "window", 4: "done", 5: "window" }, {
      note: "xor = 6",
    }),
    arrayFrame("Diff bit", "Lowest set bit of 6 is bit 1 (value 2). Partition by (x & bit).", a, { 3: "lo", 5: "hi" }, {
      note: "bit = 2",
    }),
    arrayFrame("Group A (bit on)", "Numbers with that bit: 2, 3, 2 → XOR = 3.", a, { 1: "lo", 3: "lo", 4: "lo" }, {
      note: "a = 3",
    }),
    arrayFrame("Group B (bit off)", "Numbers without: 1, 1, 5 → XOR = 5.", a, { 0: "hi", 2: "hi", 5: "hi" }, {
      note: "b = 5",
    }),
    arrayFrame("Answer", "The two singles are 3 and 5.", a, { 3: "match", 5: "match" }, { note: "[3, 5]" }),
  ];
}

export const singleNumberSolution: ProblemSolution = {
  approach:
    "XOR every value. Pairs cancel (x^x=0); the leftover is the single number. O(n) time, O(1) space.",
  templates: langs(
    `def singleNumber(nums):
    acc = 0
    for x in nums:
        acc ^= x
    return acc`,
    `int singleNumber(vector<int>& nums) {
    int acc = 0;
    for (int x : nums) acc ^= x;
    return acc;
}`,
    `int singleNumber(int[] nums) {
    int acc = 0;
    for (int x : nums) acc ^= x;
    return acc;
}`,
    `function singleNumber(nums) {
  let acc = 0;
  for (const x of nums) acc ^= x;
  return acc;
}`,
  ),
  frames: singleNumberFrames(),
};

export const singleNumberIISolution: ProblemSolution = {
  approach:
    "Track bit state with ones/twos: each bit cycles every three sightings. After one pass, ones is the unique value. O(n) time, O(1) space.",
  templates: langs(
    `def singleNumber(nums):
    ones = twos = 0
    for x in nums:
        ones = (ones ^ x) & ~twos
        twos = (twos ^ x) & ~ones
    return ones`,
    `int singleNumber(vector<int>& nums) {
    int ones = 0, twos = 0;
    for (int x : nums) {
        ones = (ones ^ x) & ~twos;
        twos = (twos ^ x) & ~ones;
    }
    return ones;
}`,
    `int singleNumber(int[] nums) {
    int ones = 0, twos = 0;
    for (int x : nums) {
        ones = (ones ^ x) & ~twos;
        twos = (twos ^ x) & ~ones;
    }
    return ones;
}`,
    `function singleNumber(nums) {
  let ones = 0, twos = 0;
  for (const x of nums) {
    ones = (ones ^ x) & ~twos;
    twos = (twos ^ x) & ~ones;
  }
  return ones;
}`,
  ),
  frames: singleNumberIIFrames(),
};

export const singleNumberIIISolution: ProblemSolution = {
  approach:
    "XOR all → xor=u^v. Take a set bit of xor; XOR numbers with/without that bit separately to recover u and v. O(n) time, O(1) space.",
  templates: langs(
    `def singleNumber(nums):
    xor = 0
    for x in nums:
        xor ^= x
    bit = xor & -xor
    a = b = 0
    for x in nums:
        if x & bit: a ^= x
        else: b ^= x
    return [a, b]`,
    `vector<int> singleNumber(vector<int>& nums) {
    int xor = 0;
    for (int x : nums) xor ^= x;
    int bit = xor & -xor, a = 0, b = 0;
    for (int x : nums) {
        if (x & bit) a ^= x;
        else b ^= x;
    }
    return {a, b};
}`,
    `int[] singleNumber(int[] nums) {
    int xor = 0;
    for (int x : nums) xor ^= x;
    int bit = xor & -xor, a = 0, b = 0;
    for (int x : nums) {
        if ((x & bit) != 0) a ^= x;
        else b ^= x;
    }
    return new int[]{a, b};
}`,
    `function singleNumber(nums) {
  let xor = 0;
  for (const x of nums) xor ^= x;
  const bit = xor & -xor;
  let a = 0, b = 0;
  for (const x of nums) {
    if (x & bit) a ^= x;
    else b ^= x;
  }
  return [a, b];
}`,
  ),
  frames: singleNumberIIIFrames(),
};

import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function missingNumberFrames() {
  const a = [3, 0, 1];
  return [
    arrayFrame("n = 3, nums = [3,0,1]", "XOR indices 0..n with every nums[i]. Duplicates cancel; missing remains.", a, {}, {
      note: "expect 0..3",
    }),
    arrayFrame("Fold i ^ nums[i]", "0^3, 1^0, 2^1, then ^3. Pairs vanish.", a, { 0: "done", 1: "done", 2: "done" }, {
      pointers: [{ name: "i", index: 2, color: PTR.M }],
      note: "acc ^= i ^ x",
    }),
    arrayFrame("Missing 2", "2 never appeared in the array, so it survives the XOR fold.", a, { 0: "window", 1: "window", 2: "window" }, {
      note: "return 2",
    }),
    arrayFrame("Why it works", "Same trick as single-number: every present value pairs with its index.", [0, 1, 2, 3], { 2: "match" }, {
      note: "2 unpaired",
    }),
    arrayFrame("Answer", "Missing number is 2.", a, {}, { note: "2" }),
  ];
}

function findAllDisappearedFrames() {
  const a = [4, 3, 2, 7, 8, 2, 3, 1];
  return [
    arrayFrame(
      "Mark by index",
      "For each |x|, negate nums[|x|-1]. Negatives = seen. Positives left = missing indices.",
      a,
      {},
      { note: "1..n present?" },
    ),
    arrayFrame("Mark 4", "nums[3] ← −7. Value 4 was seen.", a, { 0: "active", 3: "update" }, {
      pointers: [{ name: "i", index: 0, color: PTR.M }],
      note: "seen 4",
    }),
    arrayFrame("Mark 3, 2, 7…", "Continue. Duplicates (2,3) re-hit already-negative slots.", [4, 3, 2, -7, 8, 2, 3, 1], {
      1: "done",
      2: "done",
      3: "done",
    }, { note: "in-place marks" }),
    arrayFrame("After full pass", "Negatives at indices of seen numbers. Positives remain at missing slots.", [-4, -3, -2, -7, 8, 2, -3, -1], {
      4: "hi",
      5: "hi",
    }, { note: "idx 4,5 > 0" }),
    arrayFrame("Collect missing", "Index i still positive → i+1 never appeared. Missing = [5,6].", [-4, -3, -2, -7, 8, 2, -3, -1], {
      4: "match",
      5: "match",
    }, { note: "[5, 6]" }),
    arrayFrame("Answer", "O(n) time, O(1) extra space (reuse the array as a set).", a, {}, { note: "[5, 6]" }),
  ];
}

function firstMissingPositiveFrames() {
  const a = [3, 4, -1, 1];
  return [
    arrayFrame(
      "First missing positive",
      "Answer is in 1..n+1. Cycle-sort each nums[i] into slot nums[i]-1 when in range.",
      a,
      {},
      { note: "place 1..n" },
    ),
    arrayFrame("Swap 3 → index 2", "3 belongs at index 2. Swap with −1.", [-1, 4, 3, 1], { 0: "skip", 2: "match" }, {
      pointers: [{ name: "i", index: 0, color: PTR.M }],
      note: "placed 3",
    }),
    arrayFrame("Skip −1, place 4", "−1 out of range. 4 goes to index 3.", [-1, 1, 3, 4], { 1: "active", 3: "match" }, {
      note: "placed 4",
    }),
    arrayFrame("Place 1", "At i=1, value 1 swaps into index 0.", [1, -1, 3, 4], { 0: "match", 1: "skip" }, {
      note: "1 at home",
    }),
    arrayFrame("Scan for hole", "First index i with nums[i] ≠ i+1 → answer i+1. Here index 1 → 2.", [1, -1, 3, 4], {
      0: "done",
      1: "match",
      2: "done",
      3: "done",
    }, { note: "return 2" }),
    arrayFrame("If all placed", "If 1..n all present, answer is n+1.", [1, 2, 3, 4], { 0: "done", 1: "done", 2: "done", 3: "done" }, {
      note: "n+1",
    }),
  ];
}

export const missingNumberSolution: ProblemSolution = {
  approach:
    "XOR every index 0..n-1 with nums[i], then XOR n. Present values cancel with their indices; the missing value remains. O(n) time, O(1) space.",
  templates: langs(
    `def missingNumber(nums):
    n, acc = len(nums), 0
    for i, x in enumerate(nums):
        acc ^= i ^ x
    return acc ^ n`,
    `int missingNumber(vector<int>& nums) {
    int n = nums.size(), acc = 0;
    for (int i = 0; i < n; i++) acc ^= i ^ nums[i];
    return acc ^ n;
}`,
    `int missingNumber(int[] nums) {
    int n = nums.length, acc = 0;
    for (int i = 0; i < n; i++) acc ^= i ^ nums[i];
    return acc ^ n;
}`,
    `function missingNumber(nums) {
  const n = nums.length;
  let acc = 0;
  for (let i = 0; i < n; i++) acc ^= i ^ nums[i];
  return acc ^ n;
}`,
  ),
  frames: missingNumberFrames(),
};

export const findAllDisappearedSolution: ProblemSolution = {
  approach:
    "For each value v, negate nums[|v|-1] as a seen mark. Indices still positive mean i+1 never appeared. O(n) time, O(1) extra space.",
  templates: langs(
    `def findDisappearedNumbers(nums):
    for x in nums:
        i = abs(x) - 1
        if nums[i] > 0: nums[i] = -nums[i]
    return [i + 1 for i, v in enumerate(nums) if v > 0]`,
    `vector<int> findDisappearedNumbers(vector<int>& nums) {
    for (int x : nums) {
        int i = abs(x) - 1;
        if (nums[i] > 0) nums[i] = -nums[i];
    }
    vector<int> out;
    for (int i = 0; i < (int)nums.size(); i++)
        if (nums[i] > 0) out.push_back(i + 1);
    return out;
}`,
    `List<Integer> findDisappearedNumbers(int[] nums) {
    for (int x : nums) {
        int i = Math.abs(x) - 1;
        if (nums[i] > 0) nums[i] = -nums[i];
    }
    List<Integer> out = new ArrayList<>();
    for (int i = 0; i < nums.length; i++)
        if (nums[i] > 0) out.add(i + 1);
    return out;
}`,
    `function findDisappearedNumbers(nums) {
  for (const x of nums) {
    const i = Math.abs(x) - 1;
    if (nums[i] > 0) nums[i] = -nums[i];
  }
  const out = [];
  for (let i = 0; i < nums.length; i++) if (nums[i] > 0) out.push(i + 1);
  return out;
}`,
  ),
  frames: findAllDisappearedFrames(),
};

export const firstMissingPositiveSolution: ProblemSolution = {
  approach:
    "Cycle-sort values in 1..n into index v-1. First i with nums[i]≠i+1 is the answer (else n+1). O(n) time, O(1) extra space.",
  templates: langs(
    `def firstMissingPositive(nums):
    n = len(nums)
    for i in range(n):
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            j = nums[i] - 1
            nums[i], nums[j] = nums[j], nums[i]
    for i in range(n):
        if nums[i] != i + 1: return i + 1
    return n + 1`,
    `int firstMissingPositive(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i])
            swap(nums[i], nums[nums[i] - 1]);
    }
    for (int i = 0; i < n; i++) if (nums[i] != i + 1) return i + 1;
    return n + 1;
}`,
    `int firstMissingPositive(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            int j = nums[i] - 1, t = nums[i];
            nums[i] = nums[j]; nums[j] = t;
        }
    }
    for (int i = 0; i < n; i++) if (nums[i] != i + 1) return i + 1;
    return n + 1;
}`,
    `function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const j = nums[i] - 1;
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }
  for (let i = 0; i < n; i++) if (nums[i] !== i + 1) return i + 1;
  return n + 1;
}`,
  ),
  frames: firstMissingPositiveFrames(),
};

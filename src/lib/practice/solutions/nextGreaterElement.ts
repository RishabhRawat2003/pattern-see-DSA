import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const nextGreaterElementISolution: ProblemSolution = {
  approach:
    "Monotonic decreasing stack over nums2 to build next-greater map, then map each nums1 value. O(n) time, O(n) space.",
  templates: langs(
    `def nextGreaterElement(nums1, nums2):
    nge, st = {}, []
    for x in nums2:
        while st and st[-1] < x:
            nge[st.pop()] = x
        st.append(x)
    return [nge.get(x, -1) for x in nums1]`,
    `vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
    unordered_map<int,int> nge; vector<int> st;
    for (int x : nums2) {
        while (!st.empty() && st.back() < x) { nge[st.back()] = x; st.pop_back(); }
        st.push_back(x);
    }
    vector<int> ans;
    for (int x : nums1) ans.push_back(nge.count(x) ? nge[x] : -1);
    return ans;
}`,
    `int[] nextGreaterElement(int[] nums1, int[] nums2) {
    Map<Integer,Integer> nge = new HashMap<>();
    Deque<Integer> st = new ArrayDeque<>();
    for (int x : nums2) {
        while (!st.isEmpty() && st.peek() < x) nge.put(st.pop(), x);
        st.push(x);
    }
    int[] ans = new int[nums1.length];
    for (int i = 0; i < nums1.length; i++) ans[i] = nge.getOrDefault(nums1[i], -1);
    return ans;
}`,
    `function nextGreaterElement(nums1, nums2) {
  const nge = new Map(), st = [];
  for (const x of nums2) {
    while (st.length && st.at(-1) < x) nge.set(st.pop(), x);
    st.push(x);
  }
  return nums1.map((x) => nge.get(x) ?? -1);
}`,
  ),
  frames: (() => {
    const a = [1, 3, 4, 2];
    const frames: Frame[] = [
      {
        kind: "stack",
        title: "nums2 scan",
        caption: "Build next-greater for every value in nums2 with a decreasing stack.",
        cells: a.map((value) => ({ value })),
        stackItems: [],
        note: "nums1 = [4, 1, 2]",
      },
      {
        kind: "stack",
        title: "Push 1",
        caption: "Stack stays decreasing from bottom to top.",
        cells: a.map((value, j) => ({ value, tone: j === 0 ? "active" : "idle" })),
        stackItems: [{ value: "1", tone: "active" }],
      },
      {
        kind: "stack",
        title: "3 is NGE of 1",
        caption: "Pop 1 → nge[1] = 3. Push 3.",
        cells: a.map((value, j) => ({
          value,
          tone: j === 1 ? "active" : j === 0 ? "match" : "idle",
        })),
        stackItems: [{ value: "3", tone: "active" }],
        note: "nge: 1→3",
      },
      {
        kind: "stack",
        title: "4 is NGE of 3",
        caption: "Pop 3 → nge[3] = 4. Push 4.",
        cells: a.map((value, j) => ({
          value,
          tone: j === 2 ? "active" : j === 1 ? "match" : "idle",
        })),
        stackItems: [{ value: "4", tone: "active" }],
        note: "nge: 1→3, 3→4",
      },
      {
        kind: "stack",
        title: "Push 2",
        caption: "2 < 4 — no pop. Leftovers have nge −1.",
        cells: a.map((value, j) => ({
          value,
          tone: j === 3 ? "active" : "done",
        })),
        stackItems: [{ value: "4" }, { value: "2", tone: "active" }],
        note: "nge: 1→3, 3→4, 4→−1, 2→−1",
      },
      arrayFrame(
        "Map nums1",
        "Look up each nums1 value: [−1, 3, −1].",
        [-1, 3, -1],
        { 0: "match", 1: "match", 2: "match" },
        { note: "answers for [4, 1, 2]" },
      ),
    ];
    return frames;
  })(),
};

export const dailyTemperaturesNGESolution: ProblemSolution = {
  approach:
    "Monotonic decreasing stack of indices. When a warmer day arrives, pop cooler days and set ans[j] = i − j. O(n) time, O(n) space.",
  templates: langs(
    `def dailyTemperatures(t):
    ans, st = [0] * len(t), []
    for i, x in enumerate(t):
        while st and t[st[-1]] < x:
            j = st.pop()
            ans[j] = i - j
        st.append(i)
    return ans`,
    `vector<int> dailyTemperatures(vector<int>& t) {
    vector<int> ans(t.size()), st;
    for (int i = 0; i < (int)t.size(); i++) {
        while (!st.empty() && t[st.back()] < t[i]) {
            int j = st.back(); st.pop_back(); ans[j] = i - j;
        }
        st.push_back(i);
    }
    return ans;
}`,
    `int[] dailyTemperatures(int[] t) {
    int[] ans = new int[t.length];
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < t.length; i++) {
        while (!st.isEmpty() && t[st.peek()] < t[i]) {
            int j = st.pop(); ans[j] = i - j;
        }
        st.push(i);
    }
    return ans;
}`,
    `function dailyTemperatures(t) {
  const ans = Array(t.length).fill(0), st = [];
  for (let i = 0; i < t.length; i++) {
    while (st.length && t[st.at(-1)] < t[i]) {
      const j = st.pop(); ans[j] = i - j;
    }
    st.push(i);
  }
  return ans;
}`,
  ),
  frames: (() => {
    const t = [73, 74, 75, 71, 69, 72, 76];
    const ans = [0, 0, 0, 0, 0, 0, 0];
    const frames: Frame[] = [
      arrayFrame(
        "Daily temperatures",
        "For each day, how many days until a warmer one?",
        t,
        {},
        { note: "ans all 0" },
      ),
    ];
    const st: number[] = [];
    for (let i = 0; i < t.length; i++) {
      while (st.length && t[st[st.length - 1]] < t[i]) {
        const j = st.pop()!;
        ans[j] = i - j;
        frames.push({
          kind: "stack",
          title: `${t[i]}° warms day ${j}`,
          caption: `ans[${j}] = ${i} − ${j} = ${ans[j]}.`,
          cells: t.map((value, k) => ({
            value,
            tone: k === i ? "active" : k === j ? "match" : ans[k] ? "done" : "idle",
          })),
          stackItems: st.map((si) => ({ value: String(t[si]) })),
          note: `ans = [${ans.join(", ")}]`,
          pointers: [{ name: "i", index: i, color: PTR.M }],
        });
        if (frames.length >= 10) break;
      }
      if (frames.length >= 10) break;
      st.push(i);
      frames.push({
        kind: "stack",
        title: `Push day ${i}`,
        caption: `Stack holds unresolved cooler days (top = ${t[i]}°).`,
        cells: t.map((value, k) => ({
          value,
          tone: k === i ? "active" : ans[k] ? "done" : "idle",
        })),
        stackItems: st.map((si, k) => ({
          value: String(t[si]),
          tone: k === st.length - 1 ? "active" : "idle",
        })),
        note: `ans = [${ans.join(", ")}]`,
      });
      if (frames.length >= 11) break;
    }
    frames.push(
      arrayFrame(
        "Wait days",
        "Final answer: days until next warmer temperature.",
        ans,
        Object.fromEntries(ans.map((_, i) => [i, "match" as const])),
      ),
    );
    return frames.slice(0, 12);
  })(),
};

export const nextGreaterElementIISolution: ProblemSolution = {
  approach:
    "Circular array: iterate i = 0…2n−1 with index i%n, same decreasing stack, but only assign when i < n for the first pass of writes (or skip if already set). O(n) time, O(n) space.",
  templates: langs(
    `def nextGreaterElements(nums):
    n = len(nums)
    nge, st = [-1] * n, []
    for i in range(2 * n):
        x = nums[i % n]
        while st and nums[st[-1]] < x:
            nge[st.pop()] = x
        if i < n:
            st.append(i)
    return nge`,
    `vector<int> nextGreaterElements(vector<int>& nums) {
    int n = nums.size();
    vector<int> nge(n, -1), st;
    for (int i = 0; i < 2 * n; i++) {
        int x = nums[i % n];
        while (!st.empty() && nums[st.back()] < x) {
            nge[st.back()] = x; st.pop_back();
        }
        if (i < n) st.push_back(i);
    }
    return nge;
}`,
    `int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] nge = new int[n];
    Arrays.fill(nge, -1);
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < 2 * n; i++) {
        int x = nums[i % n];
        while (!st.isEmpty() && nums[st.peek()] < x) nge[st.pop()] = x;
        if (i < n) st.push(i);
    }
    return nge;
}`,
    `function nextGreaterElements(nums) {
  const n = nums.length, nge = Array(n).fill(-1), st = [];
  for (let i = 0; i < 2 * n; i++) {
    const x = nums[i % n];
    while (st.length && nums[st.at(-1)] < x) nge[st.pop()] = x;
    if (i < n) st.push(i);
  }
  return nge;
}`,
  ),
  frames: (() => {
    const a = [1, 2, 1];
    const frames: Frame[] = [
      arrayFrame(
        "Circular NGE",
        "Treat the array as circular — scan nearly twice so the end can see the start.",
        a,
        {},
        { note: "virtual: 1,2,1 | 1,2,1" },
      ),
      {
        kind: "stack",
        title: "Push 1, then 2",
        caption: "2 is NGE of first 1. Push index 1.",
        cells: a.map((value, j) => ({
          value,
          tone: j === 1 ? "active" : j === 0 ? "match" : "idle",
        })),
        stackItems: [{ value: "2", tone: "active" }],
        note: "nge = [2, ?, ?]",
      },
      {
        kind: "stack",
        title: "Push second 1",
        caption: "1 < 2 — no pop yet.",
        cells: a.map((value, j) => ({
          value,
          tone: j === 2 ? "active" : j === 0 ? "done" : "idle",
        })),
        stackItems: [{ value: "2" }, { value: "1", tone: "active" }],
        note: "nge = [2, −1, −1] so far",
      },
      {
        kind: "stack",
        title: "Wrap: see 1",
        caption: "Second pass index 0 value 1 — still ≤ stack tops.",
        cells: a.map((value, j) => ({
          value,
          tone: j === 0 ? "window" : "idle",
        })),
        stackItems: [{ value: "2" }, { value: "1" }],
      },
      {
        kind: "stack",
        title: "Wrap: see 2",
        caption: "2 is NGE of the last 1. Pop index 2.",
        cells: a.map((value, j) => ({
          value,
          tone: j === 1 ? "active" : j === 2 ? "match" : "done",
        })),
        stackItems: [{ value: "2", tone: "active" }],
        note: "nge = [2, −1, 2]",
      },
      arrayFrame(
        "Result",
        "No greater exists for the peak 2 → −1.",
        [2, -1, 2],
        { 0: "match", 1: "skip", 2: "match" },
      ),
    ];
    return frames;
  })(),
};

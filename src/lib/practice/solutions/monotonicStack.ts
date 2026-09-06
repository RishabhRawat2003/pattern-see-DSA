import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const dailyTemperaturesMonoSolution: ProblemSolution = {
  approach:
    "Strictly decreasing stack of indices by temperature. A warmer day resolves all cooler waiting days. O(n) time, O(n) space.",
  templates: langs(
    `def dailyTemperatures(temperatures):
    n = len(temperatures)
    ans, st = [0] * n, []
    for i, t in enumerate(temperatures):
        while st and temperatures[st[-1]] < t:
            j = st.pop()
            ans[j] = i - j
        st.append(i)
    return ans`,
    `vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = temperatures.size();
    vector<int> ans(n), st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && temperatures[st.back()] < temperatures[i]) {
            int j = st.back(); st.pop_back(); ans[j] = i - j;
        }
        st.push_back(i);
    }
    return ans;
}`,
    `int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] ans = new int[n];
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && temperatures[st.peek()] < temperatures[i]) {
            int j = st.pop(); ans[j] = i - j;
        }
        st.push(i);
    }
    return ans;
}`,
    `function dailyTemperatures(temperatures) {
  const n = temperatures.length, ans = Array(n).fill(0), st = [];
  for (let i = 0; i < n; i++) {
    while (st.length && temperatures[st.at(-1)] < temperatures[i]) {
      const j = st.pop(); ans[j] = i - j;
    }
    st.push(i);
  }
  return ans;
}`,
  ),
  frames: (() => {
    const t = [73, 74, 75, 71, 69, 72, 76];
    const frames: Frame[] = [
      arrayFrame(
        "Monotonic stack",
        "Stack of indices stays decreasing in temperature from bottom to top.",
        t,
      ),
      {
        kind: "stack",
        title: "74° resolves 73°",
        caption: "Pop day 0. Wait = 1.",
        cells: t.map((value, j) => ({
          value,
          tone: j === 1 ? "active" : j === 0 ? "match" : "idle",
        })),
        stackItems: [{ value: "74", tone: "active" }],
        note: "ans[0] = 1",
        pointers: [{ name: "i", index: 1, color: PTR.M }],
      },
      {
        kind: "stack",
        title: "75° resolves 74°",
        caption: "Pop day 1. Wait = 1.",
        cells: t.map((value, j) => ({
          value,
          tone: j === 2 ? "active" : j <= 1 ? "done" : "idle",
        })),
        stackItems: [{ value: "75", tone: "active" }],
        note: "ans[1] = 1",
      },
      {
        kind: "stack",
        title: "Cooler days stack",
        caption: "71 and 69 push under 75 — waiting for a warmer day.",
        cells: t.map((value, j) => ({
          value,
          tone: j === 4 ? "active" : j < 4 ? "done" : "idle",
        })),
        stackItems: [
          { value: "75" },
          { value: "71" },
          { value: "69", tone: "active" },
        ],
      },
      {
        kind: "stack",
        title: "72° resolves 69 & 71",
        caption: "Pop 69 (wait 1) and 71 (wait 2).",
        cells: t.map((value, j) => ({
          value,
          tone: j === 5 ? "active" : j === 3 || j === 4 ? "match" : j < 3 ? "done" : "idle",
        })),
        stackItems: [{ value: "75" }, { value: "72", tone: "active" }],
        note: "ans[4]=1, ans[3]=2",
      },
      {
        kind: "stack",
        title: "76° clears all",
        caption: "Resolves 72 and 75. Remaining waits filled.",
        cells: t.map((value, j) => ({
          value,
          tone: j === 6 ? "match" : "done",
        })),
        stackItems: [{ value: "76", tone: "match" }],
        note: "ans = [1,1,4,2,1,1,0]",
      },
    ];
    return frames;
  })(),
};

export const largestRectangleInHistogramSolution: ProblemSolution = {
  approach:
    "Increasing stack of bar indices. When a shorter bar arrives, pop and compute area with width = right−left−1. Sentinel 0 height at the end flushes. O(n) time, O(n) space.",
  templates: langs(
    `def largestRectangleArea(heights):
    st, best = [], 0
    for i, h in enumerate(heights + [0]):
        while st and heights[st[-1]] > h:
            height = heights[st.pop()]
            left = st[-1] if st else -1
            best = max(best, height * (i - left - 1))
        st.append(i)
    return best`,
    `int largestRectangleArea(vector<int>& heights) {
    heights.push_back(0);
    vector<int> st; int best = 0;
    for (int i = 0; i < (int)heights.size(); i++) {
        while (!st.empty() && heights[st.back()] > heights[i]) {
            int height = heights[st.back()]; st.pop_back();
            int left = st.empty() ? -1 : st.back();
            best = max(best, height * (i - left - 1));
        }
        st.push_back(i);
    }
    return best;
}`,
    `int largestRectangleArea(int[] heights) {
    int n = heights.length;
    int[] h = Arrays.copyOf(heights, n + 1);
    Deque<Integer> st = new ArrayDeque<>();
    int best = 0;
    for (int i = 0; i <= n; i++) {
        while (!st.isEmpty() && h[st.peek()] > h[i]) {
            int height = h[st.pop()];
            int left = st.isEmpty() ? -1 : st.peek();
            best = Math.max(best, height * (i - left - 1));
        }
        st.push(i);
    }
    return best;
}`,
    `function largestRectangleArea(heights) {
  const h = heights.concat([0]), st = [];
  let best = 0;
  for (let i = 0; i < h.length; i++) {
    while (st.length && h[st.at(-1)] > h[i]) {
      const height = h[st.pop()];
      const left = st.length ? st.at(-1) : -1;
      best = Math.max(best, height * (i - left - 1));
    }
    st.push(i);
  }
  return best;
}`,
  ),
  frames: (() => {
    const h = [2, 1, 5, 6, 2, 3];
    const frames: Frame[] = [
      arrayFrame(
        "Histogram",
        "Increasing stack of heights. A shorter bar is a right boundary for popped bars.",
        h,
      ),
      {
        kind: "stack",
        title: "Push 2, pop for 1",
        caption: "1 is shorter — pop height 2. Width 1, area 2.",
        cells: h.map((value, j) => ({
          value,
          tone: j === 0 ? "match" : j === 1 ? "hi" : "idle",
        })),
        stackItems: [{ value: "1", tone: "active" }],
        note: "area = 2",
      },
      {
        kind: "stack",
        title: "Climb 5, 6",
        caption: "Stack stays strictly increasing: 1 → 5 → 6.",
        cells: h.map((value, j) => ({
          value,
          tone: j === 3 ? "active" : j >= 1 && j <= 3 ? "window" : "idle",
        })),
        stackItems: [
          { value: "1" },
          { value: "5" },
          { value: "6", tone: "active" },
        ],
      },
      {
        kind: "stack",
        title: "Pop 6 at bar 2",
        caption: "Right bound index 4. Width 1, area 6.",
        cells: h.map((value, j) => ({
          value,
          tone: j === 3 ? "match" : j === 4 ? "hi" : "idle",
        })),
        stackItems: [{ value: "1" }, { value: "5" }],
        note: "area = 6",
      },
      {
        kind: "stack",
        title: "Pop 5",
        caption: "Width 2 (indices 2..3), area 10 — new best.",
        cells: h.map((value, j) => ({
          value,
          tone: j === 2 || j === 3 ? "match" : j === 4 ? "hi" : "idle",
        })),
        stackItems: [{ value: "1" }, { value: "2", tone: "active" }],
        note: "best = 10",
      },
      {
        kind: "stack",
        title: "Flush with sentinel",
        caption: "Trailing 0 height pops the rest; max area stays 10.",
        cells: h.map((value) => ({ value, tone: "done" })),
        stackItems: [],
        note: "answer = 10",
      },
    ];
    return frames;
  })(),
};

export const trappingRainWaterSolution: ProblemSolution = {
  approach:
    "Two pointers from both ends tracking leftMax/rightMax. Water at i is min(leftMax,rightMax) − height[i]; always advance the side with the smaller max. O(n) time, O(1) space.",
  templates: langs(
    `def trap(height):
    lo, hi = 0, len(height) - 1
    left_max = right_max = water = 0
    while lo <= hi:
        if height[lo] <= height[hi]:
            left_max = max(left_max, height[lo])
            water += left_max - height[lo]
            lo += 1
        else:
            right_max = max(right_max, height[hi])
            water += right_max - height[hi]
            hi -= 1
    return water`,
    `int trap(vector<int>& height) {
    int lo = 0, hi = (int)height.size() - 1, leftMax = 0, rightMax = 0, water = 0;
    while (lo <= hi) {
        if (height[lo] <= height[hi]) {
            leftMax = max(leftMax, height[lo]);
            water += leftMax - height[lo];
            lo++;
        } else {
            rightMax = max(rightMax, height[hi]);
            water += rightMax - height[hi];
            hi--;
        }
    }
    return water;
}`,
    `int trap(int[] height) {
    int lo = 0, hi = height.length - 1, leftMax = 0, rightMax = 0, water = 0;
    while (lo <= hi) {
        if (height[lo] <= height[hi]) {
            leftMax = Math.max(leftMax, height[lo]);
            water += leftMax - height[lo];
            lo++;
        } else {
            rightMax = Math.max(rightMax, height[hi]);
            water += rightMax - height[hi];
            hi--;
        }
    }
    return water;
}`,
    `function trap(height) {
  let lo = 0, hi = height.length - 1, leftMax = 0, rightMax = 0, water = 0;
  while (lo <= hi) {
    if (height[lo] <= height[hi]) {
      leftMax = Math.max(leftMax, height[lo]);
      water += leftMax - height[lo];
      lo++;
    } else {
      rightMax = Math.max(rightMax, height[hi]);
      water += rightMax - height[hi];
      hi--;
    }
  }
  return water;
}`,
  ),
  frames: (() => {
    const h = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
    const frames: Frame[] = [
      arrayFrame(
        "Elevation map",
        "Water above a bar is bounded by the lower of the tallest walls to its left and right.",
        h,
        {},
        { note: "two pointers + running max" },
      ),
      arrayFrame(
        "Advance left",
        "height[lo] ≤ height[hi] → update leftMax, add trapped water at lo.",
        h,
        { 1: "lo", 11: "hi" },
        {
          pointers: [
            { name: "L", index: 1, color: PTR.L },
            { name: "R", index: 11, color: PTR.R },
          ],
          note: "leftMax = 1, water += 0",
        },
      ),
      arrayFrame(
        "Valley at index 2",
        "leftMax = 1, height = 0 → +1 water.",
        h,
        { 2: "match", 11: "hi" },
        {
          pointers: [
            { name: "L", index: 2, color: PTR.L },
            { name: "R", index: 11, color: PTR.R },
          ],
          note: "water = 1",
        },
      ),
      arrayFrame(
        "Raise leftMax to 2",
        "Bar of height 2 becomes the new left wall.",
        h,
        { 3: "lo", 11: "hi" },
        {
          pointers: [
            { name: "L", index: 3, color: PTR.L },
            { name: "R", index: 11, color: PTR.R },
          ],
          note: "leftMax = 2",
        },
      ),
      arrayFrame(
        "Fill the middle valley",
        "Indices 4–6 trap against leftMax 2 until the right side moves.",
        h,
        { 4: "window", 5: "window", 6: "window" },
        { note: "water accumulating…" },
      ),
      arrayFrame(
        "Total trapped",
        "Continue until pointers meet. Answer = 6.",
        h,
        { 2: "match", 4: "match", 5: "match", 6: "match", 9: "match" },
        { note: "answer = 6" },
      ),
    ];
    return frames;
  })(),
};

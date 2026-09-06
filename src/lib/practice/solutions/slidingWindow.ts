import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const maximumAverageSubarrayISolution: ProblemSolution = {
  approach:
    "Fixed window of size k: maintain the running sum as you slide, track the max sum, then divide by k. O(n) time, O(1) space.",
  templates: langs(
    `def findMaxAverage(nums, k):
    window = sum(nums[:k])
    best = window
    for r in range(k, len(nums)):
        window += nums[r] - nums[r - k]
        best = max(best, window)
    return best / k`,
    `double findMaxAverage(vector<int>& nums, int k) {
    double window = 0;
    for (int i = 0; i < k; i++) window += nums[i];
    double best = window;
    for (int r = k; r < (int)nums.size(); r++) {
        window += nums[r] - nums[r - k];
        best = max(best, window);
    }
    return best / k;
}`,
    `double findMaxAverage(int[] nums, int k) {
    double window = 0;
    for (int i = 0; i < k; i++) window += nums[i];
    double best = window;
    for (int r = k; r < nums.length; r++) {
        window += nums[r] - nums[r - k];
        best = Math.max(best, window);
    }
    return best / k;
}`,
    `function findMaxAverage(nums, k) {
  let window = nums.slice(0, k).reduce((s, x) => s + x, 0);
  let best = window;
  for (let r = k; r < nums.length; r++) {
    window += nums[r] - nums[r - k];
    best = Math.max(best, window);
  }
  return best / k;
}`,
  ),
  frames: (() => {
    const a = [1, 12, -5, -6, 50, 3];
    const k = 4;
    const frames = [
      arrayFrame(
        "Fixed window k = 4",
        "Find the contiguous subarray of length k with the maximum average — track max sum, then divide by k.",
        a,
        {},
        { note: "k = 4" },
      ),
    ];
    let window = a[0] + a[1] + a[2] + a[3];
    let best = window;
    frames.push(
      arrayFrame(
        "First window [0…3]",
        `Sum = 1+12+(−5)+(−6) = ${window}. Best = ${best}.`,
        a,
        { 0: "window", 1: "window", 2: "window", 3: "active" },
        {
          window: [0, 3],
          pointers: [
            { name: "L", index: 0, color: PTR.L },
            { name: "R", index: 3, color: PTR.R },
          ],
          note: `sum ${window} · best ${best}`,
        },
      ),
    );
    for (let r = k; r < a.length; r++) {
      const l = r - k + 1;
      window += a[r] - a[l - 1];
      best = Math.max(best, window);
      const toneMap: Record<number, "window" | "active"> = {};
      for (let i = l; i <= r; i++) toneMap[i] = i === r ? "active" : "window";
      frames.push(
        arrayFrame(
          `Slide to [${l}…${r}]`,
          `Drop ${a[l - 1]}, add ${a[r]}. Sum = ${window}. Best = ${best}.`,
          a,
          toneMap,
          {
            window: [l, r],
            pointers: [
              { name: "L", index: l, color: PTR.L },
              { name: "R", index: r, color: PTR.R },
            ],
            note: `sum ${window} · avg ${(best / k).toFixed(2)}`,
          },
        ),
      );
    }
    frames.push(
      arrayFrame(
        "Answer",
        `Max sum ${best} → average ${best / k}. Best window is [12, −5, −6, 50].`,
        a,
        { 1: "match", 2: "match", 3: "match", 4: "match" },
        { window: [1, 4], note: "avg = 12.75" },
      ),
    );
    return frames;
  })(),
};

export const longestSubstringWithoutRepeatingSolution: ProblemSolution = {
  approach:
    "Variable window: expand R; if a char repeats, shrink L past the previous occurrence (via last-seen index). Track max length. O(n) time, O(Σ) space.",
  templates: langs(
    `def lengthOfLongestSubstring(s):
    last, L, best = {}, 0, 0
    for R, ch in enumerate(s):
        if ch in last and last[ch] >= L:
            L = last[ch] + 1
        last[ch] = R
        best = max(best, R - L + 1)
    return best`,
    `int lengthOfLongestSubstring(string s) {
    unordered_map<char,int> last;
    int L = 0, best = 0;
    for (int R = 0; R < (int)s.size(); R++) {
        char ch = s[R];
        if (last.count(ch) && last[ch] >= L) L = last[ch] + 1;
        last[ch] = R;
        best = max(best, R - L + 1);
    }
    return best;
}`,
    `int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> last = new HashMap<>();
    int L = 0, best = 0;
    for (int R = 0; R < s.length(); R++) {
        char ch = s.charAt(R);
        if (last.containsKey(ch) && last.get(ch) >= L) L = last.get(ch) + 1;
        last.put(ch, R);
        best = Math.max(best, R - L + 1);
    }
    return best;
}`,
    `function lengthOfLongestSubstring(s) {
  const last = new Map();
  let L = 0, best = 0;
  for (let R = 0; R < s.length; R++) {
    const ch = s[R];
    if (last.has(ch) && last.get(ch) >= L) L = last.get(ch) + 1;
    last.set(ch, R);
    best = Math.max(best, R - L + 1);
  }
  return best;
}`,
  ),
  frames: (() => {
    const s = ["a", "b", "c", "a", "b", "c", "b", "b"];
    const frames = [
      arrayFrame(
        "Longest unique substring",
        "Expand R. When a duplicate enters the window, jump L past its last index.",
        s,
        {},
        { note: 's = "abcabcbb"' },
      ),
    ];
    const last: Record<string, number> = {};
    let L = 0;
    let best = 0;
    for (let R = 0; R < s.length; R++) {
      const ch = s[R];
      const prevL = L;
      const wasDup = ch in last && last[ch] >= L;
      if (wasDup) L = last[ch] + 1;
      last[ch] = R;
      best = Math.max(best, R - L + 1);
      const toneMap: Record<number, "window" | "active" | "skip"> = {};
      for (let i = L; i <= R; i++) toneMap[i] = i === R ? "active" : "window";
      for (let i = 0; i < L; i++) toneMap[i] = "skip";
      frames.push(
        arrayFrame(
          `R at '${ch}' (index ${R})`,
          wasDup
            ? `Duplicate '${ch}' — L jumps ${prevL} → ${L}. Window length ${R - L + 1}. Best = ${best}.`
            : `Add '${ch}'. Window [${L}…${R}] length ${R - L + 1}. Best = ${best}.`,
          s,
          toneMap,
          {
            window: [L, R],
            pointers: [
              { name: "L", index: L, color: PTR.L },
              { name: "R", index: R, color: PTR.R },
            ],
            note: `len ${R - L + 1} · best ${best}`,
          },
        ),
      );
    }
    frames.push(
      arrayFrame(
        "Answer",
        `Longest unique substring length is ${best} (e.g. "abc").`,
        s,
        { 0: "match", 1: "match", 2: "match" },
        { window: [0, 2], note: "best = 3" },
      ),
    );
    return frames;
  })(),
};

export const minimumWindowSubstringSolution: ProblemSolution = {
  approach:
    "Need-count map + sliding window: expand R to cover all required chars, then shrink L while still valid; track the shortest covering window. O(|s|+|t|) time.",
  templates: langs(
    `from collections import Counter
def minWindow(s, t):
    need, missing = Counter(t), len(t)
    L = start = 0
    best = (float("inf"), 0, 0)
    for R, ch in enumerate(s):
        if need[ch] > 0: missing -= 1
        need[ch] -= 1
        while missing == 0:
            if R - L + 1 < best[0]:
                best = (R - L + 1, L, R)
            need[s[L]] += 1
            if need[s[L]] > 0: missing += 1
            L += 1
    return "" if best[0] == float("inf") else s[best[1]:best[2]+1]`,
    `string minWindow(string s, string t) {
    vector<int> need(128); int missing = 0;
    for (char c : t) { need[c]++; missing++; }
    int L = 0, bestLen = INT_MAX, bestL = 0;
    for (int R = 0; R < (int)s.size(); R++) {
        if (need[s[R]]-- > 0) missing--;
        while (missing == 0) {
            if (R - L + 1 < bestLen) { bestLen = R - L + 1; bestL = L; }
            if (++need[s[L++]] > 0) missing++;
        }
    }
    return bestLen == INT_MAX ? "" : s.substr(bestL, bestLen);
}`,
    `String minWindow(String s, String t) {
    int[] need = new int[128]; int missing = 0;
    for (char c : t.toCharArray()) { need[c]++; missing++; }
    int L = 0, bestLen = Integer.MAX_VALUE, bestL = 0;
    for (int R = 0; R < s.length(); R++) {
        if (need[s.charAt(R)]-- > 0) missing--;
        while (missing == 0) {
            if (R - L + 1 < bestLen) { bestLen = R - L + 1; bestL = L; }
            if (++need[s.charAt(L++)] > 0) missing++;
        }
    }
    return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestL, bestL + bestLen);
}`,
    `function minWindow(s, t) {
  const need = {};
  let missing = t.length;
  for (const c of t) need[c] = (need[c] || 0) + 1;
  let L = 0, best = [Infinity, 0, 0];
  for (let R = 0; R < s.length; R++) {
    if ((need[s[R]] || 0) > 0) missing--;
    need[s[R]] = (need[s[R]] || 0) - 1;
    while (missing === 0) {
      if (R - L + 1 < best[0]) best = [R - L + 1, L, R];
      need[s[L]] = (need[s[L]] || 0) + 1;
      if (need[s[L]] > 0) missing++;
      L++;
    }
  }
  return best[0] === Infinity ? "" : s.slice(best[1], best[2] + 1);
}`,
  ),
  frames: (() => {
    const s = ["A", "D", "O", "B", "E", "C", "O", "D", "E", "B", "A", "N", "C"];
    const frames = [
      arrayFrame(
        's = "ADOBECODEBANC", t = "ABC"',
        "Need one A, one B, one C. Expand until covered, then shrink from L for the shortest cover.",
        s,
        {},
        { note: "need: A1 B1 C1" },
      ),
      arrayFrame(
        "Cover at R = 5 ('C')",
        "Window ADOBEC has A,B,C. Valid — try shrinking L.",
        s,
        { 0: "window", 1: "window", 2: "window", 3: "window", 4: "window", 5: "active" },
        {
          window: [0, 5],
          pointers: [
            { name: "L", index: 0, color: PTR.L },
            { name: "R", index: 5, color: PTR.R },
          ],
          note: "len 6 · best 6",
        },
      ),
      arrayFrame(
        "Cannot shrink past A",
        "Dropping A would break need. Keep best = ADOBEC for now; expand R again.",
        s,
        { 0: "lo", 1: "window", 2: "window", 3: "window", 4: "window", 5: "hi" },
        {
          window: [0, 5],
          pointers: [
            { name: "L", index: 0, color: PTR.L },
            { name: "R", index: 5, color: PTR.R },
          ],
          note: "still need A",
        },
      ),
      arrayFrame(
        "Later cover ends at 'C'",
        "Reach CODEBANC… at index 10: window BANC. Shorter than ADOBEC.",
        s,
        {
          9: "window",
          10: "window",
          11: "window",
          12: "active",
        },
        {
          window: [9, 12],
          pointers: [
            { name: "L", index: 9, color: PTR.L },
            { name: "R", index: 12, color: PTR.R },
          ],
          note: "BANC · len 4",
        },
      ),
      arrayFrame(
        "Answer",
        'Minimum window is "BANC" (length 4).',
        s,
        { 9: "match", 10: "match", 11: "match", 12: "match" },
        { window: [9, 12], note: 'answer = "BANC"' },
      ),
    ];
    return frames;
  })(),
};

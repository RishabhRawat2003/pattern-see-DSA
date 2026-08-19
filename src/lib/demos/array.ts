import type { CellTone, Frame } from "../types";

function arrayFrame(
  title: string,
  caption: string,
  values: (string | number)[],
  toneMap: Record<number, CellTone> = {},
  extra: Partial<Frame> = {},
): Frame {
  return {
    kind: "array",
    title,
    caption,
    cells: values.map((value, i) => ({ value, tone: toneMap[i] ?? "idle" })),
    ...extra,
  };
}

export function twoPointersFrames(): Frame[] {
  const a = [1, 2, 4, 7, 11, 15];
  const target = 15;
  const frames: Frame[] = [
    arrayFrame(
      "Sorted array + target",
      "We want two numbers that add to 15. Put left at the start and right at the end.",
      a,
      { 0: "lo", 5: "hi" },
      {
        pointers: [
          { name: "L", index: 0, color: "#34d399" },
          { name: "R", index: 5, color: "#f472b6" },
        ],
        note: "target = 15",
      },
    ),
  ];

  let l = 0;
  let r = a.length - 1;
  while (l < r) {
    const sum = a[l] + a[r];
    frames.push(
      arrayFrame(
        `Sum = ${a[l]} + ${a[r]} = ${sum}`,
        sum === target
          ? "Equal to target. Pair found."
          : sum < target
            ? "Too small — move L right to increase the sum."
            : "Too big — move R left to decrease the sum.",
        a,
        { [l]: "lo", [r]: sum === target ? "match" : "hi" },
        {
          pointers: [
            { name: "L", index: l, color: "#34d399" },
            { name: "R", index: r, color: "#f472b6" },
          ],
          note: `sum ${sum} vs target 15`,
        },
      ),
    );
    if (sum === target) break;
    if (sum < target) l += 1;
    else r -= 1;
  }
  return frames;
}

export function slidingWindowFrames(): Frame[] {
  const a = [2, 1, 5, 1, 3, 2];
  const k = 3;
  const frames: Frame[] = [
    arrayFrame(
      "Fixed window of size 3",
      "Slide a window of length k across the array. Track the window sum and the maximum.",
      a,
      {},
      { note: "k = 3" },
    ),
  ];
  let windowSum = a[0] + a[1] + a[2];
  let best = windowSum;
  frames.push(
    arrayFrame(
      "First window",
      `Sum = 2 + 1 + 5 = ${windowSum}. Best so far is ${best}.`,
      a,
      { 0: "window", 1: "window", 2: "active" },
      {
        window: [0, 2],
        pointers: [
          { name: "L", index: 0, color: "#34d399" },
          { name: "R", index: 2, color: "#f472b6" },
        ],
        note: `sum ${windowSum} · best ${best}`,
      },
    ),
  );
  for (let r = k; r < a.length; r++) {
    const l = r - k + 1;
    windowSum += a[r] - a[l - 1];
    best = Math.max(best, windowSum);
    const toneMap: Record<number, CellTone> = {};
    for (let i = l; i <= r; i++) toneMap[i] = i === r ? "active" : "window";
    frames.push(
      arrayFrame(
        `Slide to [${l}…${r}]`,
        `Drop ${a[l - 1]}, add ${a[r]}. Window sum = ${windowSum}. Best = ${best}.`,
        a,
        toneMap,
        {
          window: [l, r],
          pointers: [
            { name: "L", index: l, color: "#34d399" },
            { name: "R", index: r, color: "#f472b6" },
          ],
          note: `sum ${windowSum} · best ${best}`,
        },
      ),
    );
  }
  return frames;
}

export function prefixSumFrames(): Frame[] {
  const a = [3, 1, 4, 1, 5];
  const prefix = [0];
  for (const x of a) prefix.push(prefix[prefix.length - 1] + x);
  const frames: Frame[] = [
    arrayFrame("Original array", "Build prefix[i] = sum of the first i elements (1-based in the prefix row).", a),
  ];
  const running = [0];
  for (let i = 0; i < a.length; i++) {
    running.push(running[i] + a[i]);
    frames.push(
      arrayFrame(
        `prefix[${i + 1}] = ${running[i + 1]}`,
        `Add a[${i}] = ${a[i]} to the running total.`,
        a,
        { [i]: "active" },
        {
          note: `prefix = [${running.join(", ")}]`,
        },
      ),
    );
  }
  frames.push(
    arrayFrame(
      "Query sum(1..3) → indices 1 to 3",
      "sum[L..R] = prefix[R+1] − prefix[L] = prefix[4] − prefix[1] = 11 − 3 = 8 (values 1+4+1).",
      a,
      { 1: "window", 2: "window", 3: "window" },
      {
        window: [1, 3],
        note: "prefix[4] − prefix[1] = 8",
      },
    ),
  );
  return frames;
}

export function differenceArrayFrames(): Frame[] {
  const n = 6;
  const diff = Array(n + 1).fill(0);
  const frames: Frame[] = [];
  const showDiff = (title: string, caption: string, highlight: number[] = []) => {
    const toneMap: Record<number, CellTone> = {};
    highlight.forEach((i) => (toneMap[i] = "update"));
    frames.push(
      arrayFrame(title, caption, diff.slice(0, n), toneMap, {
        note: "diff[i] = actual[i] − actual[i−1]",
      }),
    );
  };
  showDiff("Empty difference array", "Start with zeros. A range add [L, R] += v becomes diff[L] += v and diff[R+1] −= v.");
  diff[1] += 2;
  diff[4] -= 2;
  showDiff("Update [1, 3] += 2", "Write +2 at index 1 and −2 at index 4 (one past the range).", [1, 4]);
  diff[0] += 1;
  diff[2] -= 1;
  showDiff("Update [0, 1] += 1", "Write +1 at 0 and −1 at 2.", [0, 2]);

  const actual: number[] = [];
  let run = 0;
  for (let i = 0; i < n; i++) {
    run += diff[i];
    actual.push(run);
    frames.push(
      arrayFrame(
        "Prefix the difference array",
        `actual[${i}] = running sum = ${run}. This materializes all range updates.`,
        actual.concat(Array(n - actual.length).fill("·")),
        { [i]: "active" },
        { note: `final so far: [${actual.join(", ")}]` },
      ),
    );
  }
  return frames;
}

export function kadaneFrames(): Frame[] {
  const a = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  const frames: Frame[] = [
    arrayFrame(
      "Maximum subarray sum",
      "At each index: extend the current run, or start a new run from here. Keep the global best.",
      a,
    ),
  ];
  let cur = 0;
  let best = -Infinity;
  let bestL = 0;
  let bestR = 0;
  let tempStart = 0;
  for (let i = 0; i < a.length; i++) {
    if (cur + a[i] < a[i]) {
      cur = a[i];
      tempStart = i;
    } else {
      cur += a[i];
    }
    if (cur > best) {
      best = cur;
      bestL = tempStart;
      bestR = i;
    }
    const toneMap: Record<number, CellTone> = {};
    for (let j = tempStart; j <= i; j++) toneMap[j] = "window";
    toneMap[i] = "active";
    frames.push(
      arrayFrame(
        `i = ${i}, value ${a[i]}`,
        `Current ending here = ${cur}. Global best = ${best} on [${bestL}…${bestR}].`,
        a,
        toneMap,
        {
          window: [tempStart, i],
          pointers: [{ name: "i", index: i, color: "#fbbf24" }],
          note: `cur ${cur} · best ${best}`,
        },
      ),
    );
  }
  const done: Record<number, CellTone> = {};
  for (let j = bestL; j <= bestR; j++) done[j] = "match";
  frames.push(
    arrayFrame("Answer", `Best subarray is [4, -1, 2, 1] summing to ${best}.`, a, done, {
      window: [bestL, bestR],
    }),
  );
  return frames;
}

export function sortingTricksFrames(): Frame[] {
  const original = [9, 1, 4, 7, 2];
  const sorted = [...original].sort((x, y) => x - y);
  const frames: Frame[] = [
    arrayFrame("Unsorted values", "Closest pair is hard to see. Sorting lines them up so neighbors are the only candidates.", original),
    arrayFrame("After O(n log n) sort", "Scan adjacent pairs. The closest must sit next to each other.", sorted),
  ];
  let best = Infinity;
  let pair = [0, 1];
  for (let i = 0; i < sorted.length - 1; i++) {
    const d = sorted[i + 1] - sorted[i];
    if (d < best) {
      best = d;
      pair = [i, i + 1];
    }
    frames.push(
      arrayFrame(
        `Compare ${sorted[i]} and ${sorted[i + 1]}`,
        `Gap = ${d}. Best gap so far = ${best}.`,
        sorted,
        { [i]: "lo", [i + 1]: "hi" },
        { note: `best gap ${best}` },
      ),
    );
  }
  frames.push(
    arrayFrame(
      "Closest pair",
      `Values ${sorted[pair[0]]} and ${sorted[pair[1]]} differ by ${best}.`,
      sorted,
      { [pair[0]]: "match", [pair[1]]: "match" },
    ),
  );
  return frames;
}

export function frequencyMapArrayFrames(): Frame[] {
  const s = ["a", "n", "a", "g", "r", "a", "m"];
  const t = ["n", "a", "g", "a", "r", "a", "m"];
  const map: Record<string, number> = {};
  const frames: Frame[] = [
    arrayFrame("Is 'anagram' an anagram of 'nagaram'?", "Count letters of the first string, then subtract the second.", s),
  ];
  for (let i = 0; i < s.length; i++) {
    map[s[i]] = (map[s[i]] ?? 0) + 1;
    frames.push({
      kind: "hashmap",
      title: `Count '${s[i]}'`,
      caption: `Increment the bucket for ${s[i]}.`,
      cells: s.map((value, idx) => ({
        value,
        tone: idx === i ? "active" : idx < i ? "done" : "idle",
      })),
      mapEntries: Object.entries(map).map(([key, value]) => ({
        key,
        value: String(value),
        tone: key === s[i] ? "active" : "idle",
      })),
    });
  }
  for (let i = 0; i < t.length; i++) {
    map[t[i]] = (map[t[i]] ?? 0) - 1;
    frames.push({
      kind: "hashmap",
      title: `Subtract '${t[i]}'`,
      caption: "If every count returns to 0, the strings are anagrams.",
      cells: t.map((value, idx) => ({
        value,
        tone: idx === i ? "active" : idx < i ? "done" : "idle",
      })),
      mapEntries: Object.entries(map).map(([key, value]) => ({
        key,
        value: String(value),
        tone: key === t[i] ? (map[t[i]] === 0 ? "match" : "active") : "idle",
      })),
    });
  }
  return frames;
}

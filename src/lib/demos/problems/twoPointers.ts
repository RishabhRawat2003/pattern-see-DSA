import type { CellTone, Frame } from "../../types";

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

/** Two Sum II — sorted array, inward L/R. */
export function twoSumIIFrames(): Frame[] {
  const a = [1, 2, 4, 7, 11, 15];
  const target = 15;
  const frames: Frame[] = [
    arrayFrame(
      "Sorted + target",
      "Numbers are sorted. Put L at the start and R at the end; compare their sum to the target.",
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
          ? "Equal to target. Return the 1-based indices of this pair."
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

/** 3Sum — sort, fix i, then L/R for the pair that cancels nums[i]. */
export function threeSumFrames(): Frame[] {
  const a = [-4, -1, -1, 0, 1, 2];
  const frames: Frame[] = [
    arrayFrame(
      "Sort first",
      "Sort the array so two pointers can hunt pairs that sum to −nums[i], and duplicates are easy to skip.",
      a,
      {},
      { note: "sorted · find triplets = 0" },
    ),
  ];

  const seen = new Set<string>();
  for (let i = 0; i < a.length - 2; i++) {
    if (i > 0 && a[i] === a[i - 1]) continue;
    let l = i + 1;
    let r = a.length - 1;
    frames.push(
      arrayFrame(
        `Fix i = ${i} (value ${a[i]})`,
        `Need two numbers that sum to ${-a[i]}. Start L just after i and R at the end.`,
        a,
        { [i]: "active", [l]: "lo", [r]: "hi" },
        {
          pointers: [
            { name: "i", index: i, color: "#fbbf24" },
            { name: "L", index: l, color: "#34d399" },
            { name: "R", index: r, color: "#f472b6" },
          ],
          note: `need pair sum = ${-a[i]}`,
        },
      ),
    );

    while (l < r) {
      const sum = a[i] + a[l] + a[r];
      const key = `${a[i]},${a[l]},${a[r]}`;
      if (sum === 0 && !seen.has(key)) {
        seen.add(key);
        frames.push(
          arrayFrame(
            `Triplet [${a[i]}, ${a[l]}, ${a[r]}]`,
            "Sum is zero. Record the triplet, then skip duplicate values on both sides.",
            a,
            { [i]: "active", [l]: "match", [r]: "match" },
            {
              pointers: [
                { name: "i", index: i, color: "#fbbf24" },
                { name: "L", index: l, color: "#34d399" },
                { name: "R", index: r, color: "#f472b6" },
              ],
              note: "sum = 0 · keep",
            },
          ),
        );
        l += 1;
        r -= 1;
        while (l < r && a[l] === a[l - 1]) l += 1;
        while (l < r && a[r] === a[r + 1]) r -= 1;
      } else if (sum < 0) {
        frames.push(
          arrayFrame(
            `Sum = ${sum} (too small)`,
            `${a[i]} + ${a[l]} + ${a[r]} is negative — move L right.`,
            a,
            { [i]: "active", [l]: "lo", [r]: "hi" },
            {
              pointers: [
                { name: "i", index: i, color: "#fbbf24" },
                { name: "L", index: l, color: "#34d399" },
                { name: "R", index: r, color: "#f472b6" },
              ],
              note: `sum ${sum} < 0`,
            },
          ),
        );
        l += 1;
      } else if (sum > 0) {
        frames.push(
          arrayFrame(
            `Sum = ${sum} (too big)`,
            `${a[i]} + ${a[l]} + ${a[r]} is positive — move R left.`,
            a,
            { [i]: "active", [l]: "lo", [r]: "hi" },
            {
              pointers: [
                { name: "i", index: i, color: "#fbbf24" },
                { name: "L", index: l, color: "#34d399" },
                { name: "R", index: r, color: "#f472b6" },
              ],
              note: `sum ${sum} > 0`,
            },
          ),
        );
        r -= 1;
      } else {
        l += 1;
        r -= 1;
      }
    }
  }

  frames.push(
    arrayFrame(
      "All unique triplets",
      "Two-pointer after sorting finds every zero-sum triplet without nested O(n³) loops.",
      a,
      {},
      { note: "[[-1,-1,2], [-1,0,1]]" },
    ),
  );
  return frames;
}

/** Container With Most Water — L/R; always move the shorter wall. */
export function containerWithMostWaterFrames(): Frame[] {
  const h = [1, 8, 6, 2, 5, 4, 8, 3, 7];
  const frames: Frame[] = [
    arrayFrame(
      "Heights as walls",
      "Area = min(height[L], height[R]) × (R − L). Start at both ends to maximize width.",
      h,
      { 0: "lo", 8: "hi" },
      {
        pointers: [
          { name: "L", index: 0, color: "#34d399" },
          { name: "R", index: 8, color: "#f472b6" },
        ],
        note: "best = 0",
      },
    ),
  ];

  let l = 0;
  let r = h.length - 1;
  let best = 0;
  while (l < r) {
    const area = Math.min(h[l], h[r]) * (r - l);
    const improved = area > best;
    best = Math.max(best, area);
    const shorter = h[l] <= h[r] ? "L" : "R";
    frames.push(
      arrayFrame(
        `Area = ${Math.min(h[l], h[r])} × ${r - l} = ${area}`,
        improved
          ? `New best ${best}. Shorter wall is ${shorter} — move that pointer inward.`
          : `Best stays ${best}. Shorter wall is ${shorter} — only moving it can improve height.`,
        h,
        {
          [l]: improved ? "match" : "lo",
          [r]: improved ? "match" : "hi",
        },
        {
          pointers: [
            { name: "L", index: l, color: "#34d399" },
            { name: "R", index: r, color: "#f472b6" },
          ],
          window: [l, r],
          note: `area ${area} · best ${best}`,
        },
      ),
    );
    if (h[l] <= h[r]) l += 1;
    else r -= 1;
  }

  frames.push(
    arrayFrame(
      `Max area = ${best}`,
      "Moving the taller wall can never help: width shrinks and the min height cannot rise. Always move the shorter one.",
      h,
      {},
      { note: `answer = ${best}` },
    ),
  );
  return frames;
}

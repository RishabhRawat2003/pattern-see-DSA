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

export function classicBinarySearchFrames(): Frame[] {
  const a = [2, 5, 8, 12, 13, 18, 21];
  const target = 13;
  const frames: Frame[] = [
    arrayFrame("Sorted array", "Search for 13. The middle tells us which half to keep.", a, {}, { note: "target = 13" }),
  ];
  let lo = 0;
  let hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const toneMap: Record<number, CellTone> = { [lo]: "lo", [mid]: "mid", [hi]: "hi" };
    frames.push(
      arrayFrame(
        `lo=${lo}  mid=${mid}  hi=${hi}`,
        a[mid] === target
          ? `${a[mid]} equals the target. Done.`
          : a[mid] < target
            ? `${a[mid]} < 13, throw away the left half including mid.`
            : `${a[mid]} > 13, throw away the right half including mid.`,
        a,
        toneMap,
        {
          pointers: [
            { name: "lo", index: lo, color: "#34d399" },
            { name: "mid", index: mid, color: "#fbbf24" },
            { name: "hi", index: hi, color: "#f472b6" },
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

export function firstLastOccurrenceFrames(): Frame[] {
  const a = [1, 2, 2, 2, 3, 4];
  const frames: Frame[] = [
    arrayFrame("Duplicates of 2", "First occurrence biases left when we find a match. Last occurrence biases right.", a),
  ];

  const search = (first: boolean) => {
    let lo = 0;
    let hi = a.length - 1;
    let ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      frames.push(
        arrayFrame(
          first ? "First occurrence" : "Last occurrence",
          a[mid] === 2
            ? first
              ? "Found 2. Record mid and keep searching left."
              : "Found 2. Record mid and keep searching right."
            : a[mid] < 2
              ? "Go right."
              : "Go left.",
          a,
          { [lo]: "lo", [mid]: a[mid] === 2 ? "match" : "mid", [hi]: "hi" },
          {
            pointers: [
              { name: "lo", index: lo, color: "#34d399" },
              { name: "mid", index: mid, color: "#fbbf24" },
              { name: "hi", index: hi, color: "#f472b6" },
            ],
            note: ans >= 0 ? `best index ${ans}` : "not found yet",
          },
        ),
      );
      if (a[mid] === 2) {
        ans = mid;
        if (first) hi = mid - 1;
        else lo = mid + 1;
      } else if (a[mid] < 2) lo = mid + 1;
      else hi = mid - 1;
    }
    return ans;
  };

  const first = search(true);
  const last = search(false);
  frames.push(
    arrayFrame(
      "Range of 2",
      `First index ${first}, last index ${last}. Count = ${last - first + 1}.`,
      a,
      { [first]: "match", [last]: "match", 2: "window" },
    ),
  );
  return frames;
}

export function lowerUpperBoundFrames(): Frame[] {
  const a = [1, 3, 5, 7, 7, 9];
  const x = 7;
  const frames: Frame[] = [
    arrayFrame(
      "Lower bound of 7",
      "Lower bound = first index whose value is ≥ 7. Upper bound = first index > 7.",
      a,
    ),
  ];

  const bound = (strict: boolean) => {
    let lo = 0;
    let hi = a.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const goRight = strict ? a[mid] <= x : a[mid] < x;
      frames.push(
        arrayFrame(
          strict ? "Upper bound (first > 7)" : "Lower bound (first ≥ 7)",
          goRight ? `${a[mid]} is still not past the bound — search right half.` : `${a[mid]} is already past — search left, keep mid as candidate.`,
          a,
          { [Math.min(lo, a.length - 1)]: "lo", [Math.min(mid, a.length - 1)]: "mid" },
          {
            pointers: [
              { name: "lo", index: Math.min(lo, a.length - 1), color: "#34d399" },
              { name: "mid", index: Math.min(mid, a.length - 1), color: "#fbbf24" },
            ],
            note: `search range [${lo}, ${hi})`,
          },
        ),
      );
      if (goRight) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  const lb = bound(false);
  const ub = bound(true);
  frames.push(
    arrayFrame(
      "Insert window",
      `Lower bound index ${lb}, upper bound index ${ub}. All 7s live in between.`,
      a,
      { [lb]: "match", [Math.min(ub, a.length - 1)]: ub < a.length ? "hi" : "idle" },
    ),
  );
  return frames;
}

export function binarySearchOnAnswerFrames(): Frame[] {
  const piles = [3, 6, 7, 11];
  const h = 8;
  const frames: Frame[] = [
    arrayFrame(
      "Koko’s piles",
      "She must finish in 8 hours. Speed k means hours = sum of ceil(pile / k). Binary search k on [1 … max pile].",
      piles,
      {},
      { note: "H = 8 hours" },
    ),
  ];

  const hours = (k: number) =>
    piles.reduce((s, p) => s + Math.ceil(p / k), 0);

  let lo = 1;
  let hi = 11;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const used = hours(mid);
    const ok = used <= h;
    frames.push({
      kind: "numberline",
      title: `Try speed k = ${mid}`,
      caption: ok
        ? `${used} hours ≤ 8. Feasible — try a slower speed (search left, keep mid).`
        : `${used} hours > 8. Too slow — search faster speeds to the right.`,
      range: { min: 1, max: 11, lo, hi, mid },
      cells: piles.map((value) => ({
        value,
        tone: ok ? "match" : "skip",
      })),
      note: `hours(${mid}) = ${used}`,
    });
    if (ok) hi = mid;
    else lo = mid + 1;
  }
  frames.push({
    kind: "numberline",
    title: "Minimum feasible speed",
    caption: `k = ${lo} is the smallest speed that finishes in 8 hours.`,
    range: { min: 1, max: 11, lo, hi: lo, mid: lo },
    note: `answer = ${lo}`,
  });
  return frames;
}

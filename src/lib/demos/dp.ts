import type { CellTone, Frame } from "../types";

function arr(
  title: string,
  caption: string,
  values: (string | number)[],
  tones: Record<number, CellTone> = {},
  extra: Partial<Frame> = {},
): Frame {
  return {
    kind: "array",
    title,
    caption,
    cells: values.map((value, i) => ({ value, tone: tones[i] ?? "idle" })),
    ...extra,
  };
}

function grid(
  title: string,
  caption: string,
  rows: (string | number)[][],
  hot: [number, number][] = [],
  extra: Partial<Frame> = {},
): Frame {
  const marks = new Set(hot.map(([r, c]) => `${r},${c}`));
  return {
    kind: "grid",
    title,
    caption,
    grid: rows.map((row, r) =>
      row.map((value, c) => ({
        value: String(value),
        tone: (marks.has(`${r},${c}`) ? "active" : "idle") as CellTone,
      })),
    ),
    ...extra,
  };
}

export function oneDDpFrames(): Frame[] {
  const dp = ["1", "1", "2", "3", "5"];
  return [
    arr("Stairs n = 4", "dp[i] = ways to reach step i. Base: 1 way to stand at 0, 1 way to take a single first step.", ["dp0", "dp1", "dp2", "dp3", "dp4"], { 0: "lo", 1: "lo" }, { note: "dp[0]=1 dp[1]=1" }),
    arr("i = 2", "dp[2] = dp[1] + dp[0] = 2 (one 2-step, or two 1-steps).", dp, { 2: "active" }, { note: "2 = 1+1" }),
    arr("i = 3", "dp[3] = dp[2] + dp[1] = 3.", dp, { 3: "active" }),
    arr("i = 4", "dp[4] = 5. Linear fill — no recursion tree.", dp, { 4: "match" }, { note: "answer 5" }),
  ];
}

export function fibonacciPatternFrames(): Frame[] {
  const seq = [0, 1, 1, 2, 3, 5, 8];
  const frames: Frame[] = [
    arr("F(0), F(1)", "Keep only the last two numbers. Everything Fibonacci-shaped uses this roll.", seq, { 0: "lo", 1: "hi" }),
  ];
  for (let i = 2; i < seq.length; i++) {
    frames.push(
      arr(
        `F(${i}) = F(${i - 1}) + F(${i - 2})`,
        `${seq[i - 1]} + ${seq[i - 2]} = ${seq[i]}. Drop the oldest.`,
        seq,
        { [i - 2]: "lo", [i - 1]: "hi", [i]: "match" },
        { note: `F(${i}) = ${seq[i]}` },
      ),
    );
  }
  return frames;
}

export function houseRobberFrames(): Frame[] {
  const houses = [2, 7, 9, 3];
  const dp = [2, 7, 11, 11];
  return [
    arr("Houses", "Cannot rob neighbors. dp[i] = max(skip = dp[i-1], rob = nums[i] + dp[i-2]).", houses, {}, { note: "[2, 7, 9, 3]" }),
    arr("Rob 2 or 7", "dp[0]=2. dp[1]=max(2,7)=7.", houses, { 0: "done", 1: "match" }, { note: "dp 2, 7" }),
    arr("House 9", "Skip 7 → keep 7, or take 9+2=11. Choose 11 (2 and 9).", houses, { 0: "match", 2: "match" }, { note: "dp[2]=11" }),
    arr("House 3", "max(11, 3+7=10)=11. Best is still 2+9.", houses, { 0: "match", 2: "match", 3: "skip" }, { note: `answer ${dp[3]}` }),
  ];
}

export function coinChangeFrames(): Frame[] {
  const inf = "∞";
  const amount = 11;
  const start = [0, ...Array.from({ length: amount }, () => inf)];
  const with1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const with2 = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6];
  const with5 = [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3];
  return [
    arr("dp[0..11]", "dp[x] = fewest coins for x. Start ∞ except dp[0]=0.", start, { 0: "lo" }, { note: "coins 1,2,5" }),
    arr("Coin 1", "Every x gets 1 + dp[x-1]. Now all amounts are possible, wastefully.", with1, { 11: "window" }),
    arr("Coin 2", "Try 1 + dp[x-2]. Even amounts drop.", with2, { 4: "active", 11: "window" }),
    arr("Coin 5", "x=11: min(6, 1+dp[6]=3)=3. 5+5+1.", with5, { 11: "match" }, { note: "3 coins" }),
  ];
}

export function twoDDpFrames(): Frame[] {
  return [
    grid("3x3 paths", "Only right or down. dp[r][c] = dp[r-1][c] + dp[r][c-1]. First row/col are 1s.", [
      [1, 1, 1],
      [1, "·", "·"],
      [1, "·", "·"],
    ], [[0, 0]]),
    grid("Fill (1,1)", "1 + 1 = 2 ways to the center.", [
      [1, 1, 1],
      [1, 2, "·"],
      [1, "·", "·"],
    ], [[1, 1]]),
    grid("Finish", "Bottom-right = 6 unique paths.", [
      [1, 1, 1],
      [1, 2, 3],
      [1, 3, 6],
    ], [[2, 2]], { note: "6 paths" }),
  ];
}

export function knapsackFrames(): Frame[] {
  return [
    grid("0/1 table", "Rows = items (2,3,4). Cols = capacity 0..5. dp[i][w] = max value.", [
      ["0", "0", "0", "0", "0", "0"],
      ["0", "·", "·", "·", "·", "·"],
      ["0", "·", "·", "·", "·", "·"],
      ["0", "·", "·", "·", "·", "·"],
    ], [[0, 0]], { note: "(w,v)=(2,3)(3,4)(4,5)" }),
    grid("Item 2/3", "For w>=2, take 3. Backward fill so we do not reuse it.", [
      ["0", "0", "0", "0", "0", "0"],
      ["0", "0", "3", "3", "3", "3"],
      ["0", "·", "·", "·", "·", "·"],
      ["0", "·", "·", "·", "·", "·"],
    ], [[1, 2]]),
    grid("Item 3/4", "w=5: max(3, 4+dp[2]=4)=7? 4+3 at w=2 leftover → 7.", [
      ["0", "0", "0", "0", "0", "0"],
      ["0", "0", "3", "3", "3", "3"],
      ["0", "0", "3", "4", "4", "7"],
      ["0", "·", "·", "·", "·", "·"],
    ], [[2, 5]]),
    grid("Item 4/5", "w=5: max(7, 5+dp[1]=5)=7. Best is items 2 and 3.", [
      ["0", "0", "0", "0", "0", "0"],
      ["0", "0", "3", "3", "3", "3"],
      ["0", "0", "3", "4", "4", "7"],
      ["0", "0", "3", "4", "5", "7"],
    ], [[3, 5]], { note: "value 7" }),
  ];
}

export function lcsLpsFrames(): Frame[] {
  return [
    grid("LCS a b c × a c", "Match → 1 + diagonal. Else max(left, up).", [
      ["", "a", "c"],
      ["a", "·", "·"],
      ["b", "·", "·"],
      ["c", "·", "·"],
    ]),
    grid("a vs a", "Match. dp=1.", [
      ["", "a", "c"],
      ["a", "1", "1"],
      ["b", "1", "·"],
      ["c", "·", "·"],
    ], [[1, 1]]),
    grid("c vs c", "Match on diagonal from 1. LCS length 2 — \"ac\".", [
      ["", "a", "c"],
      ["a", "1", "1"],
      ["b", "1", "1"],
      ["c", "1", "2"],
    ], [[3, 2]], { note: "LCS ac" }),
  ];
}

export function gridDpFrames(): Frame[] {
  return [
    grid("Costs", "Min path, only right/down. dp = cost + min(up, left).", [
      [1, 3, 1],
      [1, 5, 1],
      [4, 2, 1],
    ]),
    grid("First row/col", "Forced prefix sums along the borders.", [
      [1, 4, 5],
      [2, "·", "·"],
      [6, "·", "·"],
    ], [[0, 2], [2, 0]]),
    grid("Interior", "(1,1)=5+min(4,2)=7. Then 7+1=8 along the right, 6+2=8 along the bottom.", [
      [1, 4, 5],
      [2, 7, 6],
      [6, 8, "·"],
    ], [[1, 1]]),
    grid("End", "1 + min(6,8) = 7. Path 1-3-1-1-1.", [
      [1, 4, 5],
      [2, 7, 6],
      [6, 8, 7],
    ], [[2, 2]], { note: "min 7" }),
  ];
}

export function lisFrames(): Frame[] {
  const a = [10, 9, 2, 5, 3, 7];
  return [
    arr("Array", "dp[i] = LIS ending at i. Scan left for a smaller tail.", a),
    arr("2, then 5", "2 starts a run. 5 extends it to length 2.", a, { 2: "lo", 3: "match" }, { note: "2,5" }),
    arr("3", "3 also extends 2. Length 2, different branch.", a, { 2: "lo", 4: "window" }, { note: "2,3" }),
    arr("7", "7 extends 5 or 3 → length 3. Answer 3.", a, { 2: "done", 3: "done", 5: "match" }, { note: "2,5,7" }),
  ];
}

export function subsetSumFrames(): Frame[] {
  const t = ["0", "1", "2", "3", "4", "5"];
  return [
    arr("can[0..5]", "can[0]=true. Place each number backward so it is used once.", t.map((_, i) => (i === 0 ? "T" : "F")), { 0: "lo" }, { note: "nums 2,3,7 target 5" }),
    arr("Place 2", "can[2] becomes true.", ["T", "F", "T", "F", "F", "F"], { 2: "active" }),
    arr("Place 3", "can[3] and can[5]=can[2] become true. Target hit.", ["T", "F", "T", "T", "F", "T"], { 5: "match" }, { note: "2+3" }),
    arr("7 too big", "7 > 5, skipped. Still true at 5.", ["T", "F", "T", "T", "F", "T"], { 5: "match" }),
  ];
}

export function partitionEqualFrames(): Frame[] {
  return [
    arr("[1,5,11,5]", "Sum=22, half=11. Subset-sum 11.", [1, 5, 11, 5], {}, { note: "target 11" }),
    arr("1 and 5", "can includes 1,5,6.", [1, 5, 11, 5], { 0: "window", 1: "window" }),
    arr("Take 11", "11 itself is the half — or 5+5+1. Partition exists.", [1, 5, 11, 5], { 2: "match" }, { note: "[11] | [1,5,5]" }),
  ];
}

export function editDistanceFrames(): Frame[] {
  return [
    grid("cat → cut", "Replace c/a/t vs c/u/t. Match is free.", [
      ["", "c", "u", "t"],
      ["c", "·", "·", "·"],
      ["a", "·", "·", "·"],
      ["t", "·", "·", "·"],
    ]),
    grid("c = c", "Diagonal 0.", [
      ["", "c", "u", "t"],
      ["c", "0", "1", "2"],
      ["a", "1", "·", "·"],
      ["t", "2", "·", "·"],
    ], [[1, 1]]),
    grid("a vs u", "Replace costs 1. Then t=t is free. Distance 1.", [
      ["", "c", "u", "t"],
      ["c", "0", "1", "2"],
      ["a", "1", "1", "2"],
      ["t", "2", "2", "1"],
    ], [[3, 3]], { note: "replace a→u" }),
  ];
}

export function wildcardMatchingFrames(): Frame[] {
  return [
    grid("a* vs aa", "* can eat empty or more of s. ? would be exactly one.", [
      ["", "a", "*"],
      ["a", "·", "·"],
      ["a", "·", "·"],
    ]),
    grid("First a", "Match a with a.", [
      ["", "a", "*"],
      ["a", "T", "T"],
      ["a", "F", "·"],
    ], [[1, 1]]),
    grid("* eats second a", "True at the end. a* covers aa.", [
      ["", "a", "*"],
      ["a", "T", "T"],
      ["a", "F", "T"],
    ], [[2, 2]], { note: "match" }),
  ];
}

export function palindromePartitionFrames(): Frame[] {
  const s = ["a", "a", "b"];
  return [
    arr("a a b", "Precompute palindromes. \"aa\" is a palindrome, \"b\" is, \"aab\" is not.", s),
    arr("Cut after aa", "s[0..1] palindrome. Remaining \"b\" needs 0 more cuts.", s, { 0: "match", 1: "match", 2: "window" }, { note: "aa | b" }),
    arr("Min cuts = 1", "All-singletons would be 2 cuts. Best is one cut.", s, { 0: "done", 1: "done", 2: "match" }, { note: "cuts 1" }),
  ];
}

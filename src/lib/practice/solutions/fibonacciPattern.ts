import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const fibonacciNumberSolution: ProblemSolution = {
  approach:
    "Classic Fibonacci roll: keep (a,b) = (F(i−1), F(i)); each step a,b = b, a+b. O(n) time, O(1) space.",
  templates: langs(
    `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`,
    `int fib(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        int nxt = a + b; a = b; b = nxt;
    }
    return a;
}`,
    `int fib(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        int nxt = a + b; a = b; b = nxt;
    }
    return a;
}`,
    `function fib(n) {
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
}`,
  ),
  frames: (() => {
    const seq = [0, 1, 1, 2, 3, 5, 8];
    const frames = [
      arrayFrame(
        "F(0), F(1)",
        "Seed with 0 and 1. Everything Fibonacci-shaped rolls the last two values.",
        seq,
        { 0: "lo", 1: "hi" },
        { note: "a=0 · b=1" },
      ),
    ];
    for (let i = 2; i < seq.length; i++) {
      frames.push(
        arrayFrame(
          `F(${i}) = F(${i - 1}) + F(${i - 2})`,
          `${seq[i - 1]} + ${seq[i - 2]} = ${seq[i]}. Drop the oldest.`,
          seq,
          { [i - 2]: "lo", [i - 1]: "hi", [i]: "match" },
          {
            pointers: [{ name: "i", index: i, color: PTR.M }],
            note: `F(${i}) = ${seq[i]}`,
          },
        ),
      );
    }
    frames.push(
      arrayFrame(
        "Answer F(6)",
        "After six rolls, a holds F(6) = 8.",
        seq,
        { 6: "match" },
        { note: "return 8" },
      ),
    );
    return frames;
  })(),
};

export const climbingStairsFibSolution: ProblemSolution = {
  approach:
    "Same recurrence as Fibonacci: ways(n) = ways(n−1) + ways(n−2). Start from 1,2 (or F(n+1)). O(n) time, O(1) space.",
  templates: langs(
    `def climbStairs(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
    `int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int nxt = a + b; a = b; b = nxt;
    }
    return b;
}`,
    `int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int nxt = a + b; a = b; b = nxt;
    }
    return b;
}`,
    `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
  ),
  frames: (() => {
    const ways = [1, 1, 2, 3, 5, 8];
    return [
      arrayFrame(
        "Fib-shaped climb",
        "Last step was a 1-step or a 2-step → same add-two recurrence as Fib.",
        ["w0", "w1", "w2", "w3", "w4", "w5"],
        { 0: "lo", 1: "hi" },
        { note: "w1=1 · w2=2 for n≥2" },
      ),
      arrayFrame(
        "n = 2 → 2",
        "1+1 or one 2. Base of the Fibonacci climb.",
        ways,
        { 2: "active" },
        { note: "a=1 · b=2" },
      ),
      arrayFrame(
        "n = 3 → 3",
        "ways(2)+ways(1) = 2+1 = 3.",
        ways,
        { 1: "lo", 2: "hi", 3: "match" },
        { note: "3 = 2+1" },
      ),
      arrayFrame(
        "n = 4 → 5",
        "3+2 = 5. Same sequence shifted from classic Fib.",
        ways,
        { 2: "lo", 3: "hi", 4: "match" },
        { note: "5 = 3+2" },
      ),
      arrayFrame(
        "n = 5 → 8",
        "5+3 = 8. Climbing stairs is F(n+1) in 0-indexed Fib.",
        ways,
        { 3: "lo", 4: "hi", 5: "match" },
        { note: "return 8" },
      ),
    ];
  })(),
};

export const decodeWaysSolution: ProblemSolution = {
  approach:
    "dp[i] = ways to decode s[:i]. Add dp[i−1] if s[i−1]≠'0'; add dp[i−2] if two-digit 10–26 is valid. O(n) time, O(1) with two rolls.",
  templates: langs(
    `def numDecodings(s):
    if not s or s[0] == "0": return 0
    a, b = 1, 1
    for i in range(1, len(s)):
        cur = 0
        if s[i] != "0": cur += b
        two = int(s[i - 1:i + 1])
        if 10 <= two <= 26: cur += a
        a, b = b, cur
    return b`,
    `int numDecodings(string s) {
    if (s.empty() || s[0] == '0') return 0;
    int a = 1, b = 1;
    for (int i = 1; i < (int)s.size(); i++) {
        int cur = 0;
        if (s[i] != '0') cur += b;
        int two = (s[i - 1] - '0') * 10 + (s[i] - '0');
        if (two >= 10 && two <= 26) cur += a;
        a = b; b = cur;
    }
    return b;
}`,
    `int numDecodings(String s) {
    if (s.isEmpty() || s.charAt(0) == '0') return 0;
    int a = 1, b = 1;
    for (int i = 1; i < s.length(); i++) {
        int cur = 0;
        if (s.charAt(i) != '0') cur += b;
        int two = Integer.parseInt(s.substring(i - 1, i + 1));
        if (two >= 10 && two <= 26) cur += a;
        a = b; b = cur;
    }
    return b;
}`,
    `function numDecodings(s) {
  if (!s || s[0] === "0") return 0;
  let a = 1, b = 1;
  for (let i = 1; i < s.length; i++) {
    let cur = 0;
    if (s[i] !== "0") cur += b;
    const two = +s.slice(i - 1, i + 1);
    if (two >= 10 && two <= 26) cur += a;
    [a, b] = [b, cur];
  }
  return b;
}`,
  ),
  frames: (() => {
    const chars = ["2", "2", "6"];
    return [
      arrayFrame(
        's = "226"',
        "A–Z map to 1–26. At each index: take one digit and/or a valid two-digit pair.",
        chars,
        {},
        { note: "dp empty=1 · first '2' → 1 way" },
      ),
      arrayFrame(
        "After first '2'",
        "Single letter B. One way so far.",
        chars,
        { 0: "active" },
        {
          pointers: [{ name: "i", index: 0, color: PTR.M }],
          note: "a=1 · b=1",
        },
      ),
      arrayFrame(
        "Second '2'",
        "Single '2' → +1; pair \"22\" (V) valid → +1. Total 2 ways: BB or V.",
        chars,
        { 0: "window", 1: "active" },
        {
          pointers: [{ name: "i", index: 1, color: PTR.M }],
          note: "ways = 2",
        },
      ),
      arrayFrame(
        "Digit '6'",
        "Single '6' → +2; pair \"26\" (Z) valid → +1. Total 3.",
        chars,
        { 1: "window", 2: "active" },
        {
          pointers: [{ name: "i", index: 2, color: PTR.M }],
          note: "2 + 1 = 3",
        },
      ),
      arrayFrame(
        "Decode set",
        "BBF (2,2,6), VF (22,6), BZ (2,26) — three decodings.",
        chars,
        { 0: "match", 1: "match", 2: "match" },
        { note: "return 3" },
      ),
    ];
  })(),
};

import { PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const validParenthesesSolution: ProblemSolution = {
  approach:
    "Push opening brackets. On a closer, the stack top must be its match — pop, else invalid. Empty stack at the end means valid. O(n) time, O(n) space.",
  templates: langs(
    `def isValid(s):
    pair = {")": "(", "]": "[", "}": "{"}
    st = []
    for ch in s:
        if ch in pair:
            if not st or st.pop() != pair[ch]:
                return False
        else:
            st.append(ch)
    return not st`,
    `bool isValid(string s) {
    string st;
    for (char ch : s) {
        if (ch == '(' || ch == '[' || ch == '{') st.push_back(ch);
        else {
            if (st.empty()) return false;
            char o = st.back(); st.pop_back();
            if ((ch==')' && o!='(') || (ch==']' && o!='[') || (ch=='}' && o!='{'))
                return false;
        }
    }
    return st.empty();
}`,
    `boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char ch : s.toCharArray()) {
        if (ch == '(' || ch == '[' || ch == '{') st.push(ch);
        else {
            if (st.isEmpty()) return false;
            char o = st.pop();
            if ((ch==')' && o!='(') || (ch==']' && o!='[') || (ch=='}' && o!='{'))
                return false;
        }
    }
    return st.isEmpty();
}`,
    `function isValid(s) {
  const pair = { ")": "(", "]": "[", "}": "{" };
  const st = [];
  for (const ch of s) {
    if (ch in pair) {
      if (!st.length || st.pop() !== pair[ch]) return false;
    } else st.push(ch);
  }
  return st.length === 0;
}`,
  ),
  frames: (() => {
    const input = ["{", "[", "(", ")", "]", "}"];
    const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
    const stack: string[] = [];
    const frames: Frame[] = [
      {
        kind: "stack",
        title: "Empty stack",
        caption: "Push openings. A closer must match the top.",
        cells: input.map((value) => ({ value })),
        stackItems: [],
      },
    ];
    for (let i = 0; i < input.length; i++) {
      const ch = input[i];
      if ("{[(".includes(ch)) {
        stack.push(ch);
        frames.push({
          kind: "stack",
          title: `Push ${ch}`,
          caption: "Opening bracket — waits on the stack for its closer.",
          cells: input.map((value, idx) => ({
            value,
            tone: idx === i ? "active" : idx < i ? "done" : "idle",
          })),
          stackItems: stack.map((value, idx) => ({
            value,
            tone: idx === stack.length - 1 ? "active" : "idle",
          })),
          pointers: [{ name: "i", index: i, color: PTR.M }],
        });
      } else {
        const top = stack[stack.length - 1];
        const ok = top === pairs[ch];
        frames.push({
          kind: "stack",
          title: `See ${ch}`,
          caption: ok ? `Top is ${top}, which matches. Pop.` : "Mismatch — invalid.",
          cells: input.map((value, idx) => ({
            value,
            tone: idx === i ? "active" : idx < i ? "done" : "idle",
          })),
          stackItems: stack.map((value, idx) => ({
            value,
            tone: idx === stack.length - 1 ? (ok ? "match" : "skip") : "idle",
          })),
        });
        if (ok) stack.pop();
      }
    }
    frames.push({
      kind: "stack",
      title: "Balanced",
      caption: "Stack empty at the end → valid parentheses.",
      cells: input.map((value) => ({ value, tone: "match" })),
      stackItems: [],
    });
    return frames;
  })(),
};

export const minAddToMakeValidSolution: ProblemSolution = {
  approach:
    "Track balance: +1 for '(', −1 for ')'. Each time balance would go negative, need an extra '('. Leftover opens at the end also need closers. O(n) time, O(1) space.",
  templates: langs(
    `def minAddToMakeValid(s):
    bal = add = 0
    for ch in s:
        if ch == "(":
            bal += 1
        else:
            if bal == 0:
                add += 1
            else:
                bal -= 1
    return add + bal`,
    `int minAddToMakeValid(string s) {
    int bal = 0, add = 0;
    for (char ch : s) {
        if (ch == '(') bal++;
        else if (bal == 0) add++;
        else bal--;
    }
    return add + bal;
}`,
    `int minAddToMakeValid(String s) {
    int bal = 0, add = 0;
    for (char ch : s.toCharArray()) {
        if (ch == '(') bal++;
        else if (bal == 0) add++;
        else bal--;
    }
    return add + bal;
}`,
    `function minAddToMakeValid(s) {
  let bal = 0, add = 0;
  for (const ch of s) {
    if (ch === "(") bal++;
    else if (bal === 0) add++;
    else bal--;
  }
  return add + bal;
}`,
  ),
  frames: (() => {
    const input = ["(", ")", ")", "("];
    const frames: Frame[] = [
      {
        kind: "stack",
        title: "Min adds",
        caption: "Count unmatched opens and forced adds for stray closers.",
        cells: input.map((value) => ({ value })),
        stackItems: [],
        note: "bal = 0, add = 0",
      },
      {
        kind: "stack",
        title: "See (",
        caption: "Open → bal = 1.",
        cells: input.map((value, idx) => ({
          value,
          tone: idx === 0 ? "active" : "idle",
        })),
        stackItems: [{ value: "(", tone: "active" }],
        note: "bal = 1, add = 0",
      },
      {
        kind: "stack",
        title: "See )",
        caption: "Matches the open. bal = 0.",
        cells: input.map((value, idx) => ({
          value,
          tone: idx === 1 ? "match" : idx === 0 ? "done" : "idle",
        })),
        stackItems: [],
        note: "bal = 0, add = 0",
      },
      {
        kind: "stack",
        title: "See ) again",
        caption: "No open to match — must add one '(' later. add = 1.",
        cells: input.map((value, idx) => ({
          value,
          tone: idx === 2 ? "skip" : idx < 2 ? "done" : "idle",
        })),
        stackItems: [],
        note: "bal = 0, add = 1",
      },
      {
        kind: "stack",
        title: "Trailing (",
        caption: "Leftover open needs a closer. Total adds = add + bal = 2.",
        cells: input.map((value, idx) => ({
          value,
          tone: idx === 3 ? "active" : idx < 3 ? "done" : "idle",
        })),
        stackItems: [{ value: "(", tone: "active" }],
        note: "answer = 2",
      },
    ];
    return frames;
  })(),
};

export const longestValidParenthesesSolution: ProblemSolution = {
  approach:
    "Stack of indices (sentinel −1). Push '(' indices; on ')' pop and measure i − new top when the stack isn’t empty, else push i as a new base. O(n) time, O(n) space.",
  templates: langs(
    `def longestValidParentheses(s):
    st, best = [-1], 0
    for i, ch in enumerate(s):
        if ch == "(":
            st.append(i)
        else:
            st.pop()
            if not st:
                st.append(i)
            else:
                best = max(best, i - st[-1])
    return best`,
    `int longestValidParentheses(string s) {
    vector<int> st{-1};
    int best = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        if (s[i] == '(') st.push_back(i);
        else {
            st.pop_back();
            if (st.empty()) st.push_back(i);
            else best = max(best, i - st.back());
        }
    }
    return best;
}`,
    `int longestValidParentheses(String s) {
    Deque<Integer> st = new ArrayDeque<>();
    st.push(-1);
    int best = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == '(') st.push(i);
        else {
            st.pop();
            if (st.isEmpty()) st.push(i);
            else best = Math.max(best, i - st.peek());
        }
    }
    return best;
}`,
    `function longestValidParentheses(s) {
  const st = [-1];
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") st.push(i);
    else {
      st.pop();
      if (!st.length) st.push(i);
      else best = Math.max(best, i - st.at(-1));
    }
  }
  return best;
}`,
  ),
  frames: (() => {
    const input = ["(", ")", "(", "(", ")", ")"];
    const frames: Frame[] = [
      {
        kind: "stack",
        title: "Longest valid",
        caption: "Stack stores indices. Sentinel −1 is the base before any valid run.",
        cells: input.map((value) => ({ value })),
        stackItems: [{ value: "-1", tone: "idle" }],
        note: "best = 0",
      },
      {
        kind: "stack",
        title: "Push 0",
        caption: "Open at index 0.",
        cells: input.map((value, idx) => ({
          value,
          tone: idx === 0 ? "active" : "idle",
        })),
        stackItems: [
          { value: "-1" },
          { value: "0", tone: "active" },
        ],
      },
      {
        kind: "stack",
        title: ") closes",
        caption: "Pop 0; length = 1 − (−1) = 2.",
        cells: input.map((value, idx) => ({
          value,
          tone: idx <= 1 ? "match" : "idle",
        })),
        stackItems: [{ value: "-1" }],
        note: "best = 2",
      },
      {
        kind: "stack",
        title: "Nested opens",
        caption: "Push indices 2 and 3 for the next opens.",
        cells: input.map((value, idx) => ({
          value,
          tone: idx === 3 ? "active" : idx < 3 ? "done" : "idle",
        })),
        stackItems: [
          { value: "-1" },
          { value: "2" },
          { value: "3", tone: "active" },
        ],
      },
      {
        kind: "stack",
        title: "Close inner",
        caption: "Pop 3; length = 4 − 2 = 2 (inner pair).",
        cells: input.map((value, idx) => ({
          value,
          tone: idx === 4 ? "match" : idx === 3 ? "done" : idx < 2 ? "done" : "window",
        })),
        stackItems: [
          { value: "-1" },
          { value: "2", tone: "active" },
        ],
        note: "best = 2",
      },
      {
        kind: "stack",
        title: "Close outer",
        caption: "Pop 2; length = 5 − (−1) = 6 — whole string is valid.",
        cells: input.map((value) => ({ value, tone: "match" })),
        stackItems: [{ value: "-1" }],
        note: "best = 6",
      },
    ];
    return frames;
  })(),
};

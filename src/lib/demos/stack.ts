import type { Frame } from "../types";

export function validParenthesesFrames(): Frame[] {
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
        caption: "Opening bracket — it waits on the stack for its closer.",
        cells: input.map((value, idx) => ({
          value,
          tone: idx === i ? "active" : idx < i ? "done" : "idle",
        })),
        stackItems: stack.map((value, idx) => ({
          value,
          tone: idx === stack.length - 1 ? "active" : "idle",
        })),
        pointers: [{ name: "i", index: i, color: "#fbbf24" }],
      });
    } else {
      const top = stack[stack.length - 1];
      const ok = top === pairs[ch];
      frames.push({
        kind: "stack",
        title: `See ${ch}`,
        caption: ok
          ? `Top is ${top}, which matches. Pop.`
          : "Mismatch — the string would be invalid.",
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
      frames.push({
        kind: "stack",
        title: ok ? "Popped" : "Invalid",
        caption: ok ? "Stack shrinks. Continue." : "Stop.",
        cells: input.map((value, idx) => ({
          value,
          tone: idx === i ? "match" : idx < i ? "done" : "idle",
        })),
        stackItems: stack.map((value) => ({ value })),
      });
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
}

export function infixPostfixFrames(): Frame[] {
  const expr = ["A", "+", "B", "*", "C"];
  const prec: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };
  const stack: string[] = [];
  const out: string[] = [];
  const frames: Frame[] = [
    {
      kind: "stack",
      title: "Infix A + B * C",
      caption: "Higher precedence operators stay on the stack longer. Pop when a weaker (or equal) operator arrives.",
      cells: expr.map((value) => ({ value })),
      stackItems: [],
      note: "output: (empty)",
    },
  ];
  for (let i = 0; i < expr.length; i++) {
    const tok = expr[i];
    if (!prec[tok]) {
      out.push(tok);
      frames.push({
        kind: "stack",
        title: `Operand ${tok}`,
        caption: "Operands go straight to the output.",
        cells: expr.map((value, idx) => ({
          value,
          tone: idx === i ? "active" : idx < i ? "done" : "idle",
        })),
        stackItems: stack.map((value) => ({ value })),
        note: `output: ${out.join(" ")}`,
      });
    } else {
      while (stack.length && prec[stack[stack.length - 1]] >= prec[tok]) {
        out.push(stack.pop()!);
      }
      stack.push(tok);
      frames.push({
        kind: "stack",
        title: `Operator ${tok}`,
        caption:
          tok === "*"
            ? "* has higher precedence than +. It goes on the stack above +."
            : "Push after popping anything of greater or equal precedence.",
        cells: expr.map((value, idx) => ({
          value,
          tone: idx === i ? "active" : idx < i ? "done" : "idle",
        })),
        stackItems: stack.map((value, idx) => ({
          value,
          tone: idx === stack.length - 1 ? "active" : "idle",
        })),
        note: `output: ${out.join(" ")}`,
      });
    }
  }
  while (stack.length) out.push(stack.pop()!);
  frames.push({
    kind: "stack",
    title: "Flush the stack",
    caption: "Pop remaining operators. Postfix is A B C * +.",
    cells: expr.map((value) => ({ value, tone: "match" })),
    stackItems: [],
    note: `output: ${out.join(" ")}`,
  });
  return frames;
}

export function nextGreaterFrames(): Frame[] {
  const a = [2, 1, 2, 4, 3];
  const nge = Array(a.length).fill(-1);
  const stack: number[] = [];
  const frames: Frame[] = [
    {
      kind: "array",
      title: "Next greater to the right",
      caption: "Scan left → right. Pop indices whose value is smaller than the current — current is their NGE.",
      cells: a.map((value) => ({ value })),
    },
  ];
  for (let i = 0; i < a.length; i++) {
    while (stack.length && a[stack[stack.length - 1]] < a[i]) {
      const idx = stack.pop()!;
      nge[idx] = a[i];
      frames.push({
        kind: "stack",
        title: `${a[i]} is NGE of ${a[idx]}`,
        caption: `Pop index ${idx}. The stack stays decreasing from bottom to top.`,
        cells: a.map((value, j) => ({
          value,
          tone: j === i ? "active" : j === idx ? "match" : "idle",
        })),
        stackItems: stack.map((si) => ({ value: String(a[si]) })),
        note: `NGE = [${nge.join(", ")}]`,
        pointers: [{ name: "i", index: i, color: "#fbbf24" }],
      });
    }
    stack.push(i);
    frames.push({
      kind: "stack",
      title: `Push ${a[i]}`,
      caption: "No smaller neighbor waiting, or we just finished popping them.",
      cells: a.map((value, j) => ({
        value,
        tone: j === i ? "active" : nge[j] !== -1 ? "done" : "idle",
      })),
      stackItems: stack.map((si, k) => ({
        value: String(a[si]),
        tone: k === stack.length - 1 ? "active" : "idle",
      })),
      note: `NGE = [${nge.join(", ")}]`,
    });
  }
  return frames;
}

export function monotonicStackFrames(): Frame[] {
  const h = [2, 1, 5, 6, 2, 3];
  const stack: number[] = [];
  const frames: Frame[] = [
    {
      kind: "array",
      title: "Increasing stack of heights",
      caption: "Used for largest rectangle in histogram. Pop when the new bar is shorter — that bar is a right boundary.",
      cells: h.map((value) => ({ value })),
    },
  ];
  for (let i = 0; i <= h.length; i++) {
    const curr = i === h.length ? 0 : h[i];
    while (stack.length && h[stack[stack.length - 1]] > curr) {
      const top = stack.pop()!;
      const left = stack.length ? stack[stack.length - 1] : -1;
      const width = i - left - 1;
      const area = h[top] * width;
      frames.push({
        kind: "stack",
        title: `Pop height ${h[top]}`,
        caption: `Right bound is ${i === h.length ? "end" : `index ${i}`}. Width ${width}, area ${area}.`,
        cells: h.map((value, j) => ({
          value,
          tone: j === top ? "match" : j === i ? "hi" : "idle",
        })),
        stackItems: stack.map((si) => ({ value: String(h[si]) })),
        note: `area = ${area}`,
      });
    }
    if (i < h.length) {
      stack.push(i);
      frames.push({
        kind: "stack",
        title: `Push ${h[i]}`,
        caption: "Stack of indices stays strictly increasing in height.",
        cells: h.map((value, j) => ({
          value,
          tone: j === i ? "active" : stack.includes(j) ? "window" : "idle",
        })),
        stackItems: stack.map((si, k) => ({
          value: String(h[si]),
          tone: k === stack.length - 1 ? "active" : "idle",
        })),
      });
    }
  }
  return frames;
}

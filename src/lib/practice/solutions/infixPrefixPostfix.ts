import { PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const evaluateRPNSolution: ProblemSolution = {
  approach:
    "Stack of numbers: push operands; on an operator pop two, apply, push result. Final stack top is the value. O(n) time, O(n) space.",
  templates: langs(
    `def evalRPN(tokens):
    st = []
    for t in tokens:
        if t in "+-*/":
            b, a = st.pop(), st.pop()
            st.append({"+": a + b, "-": a - b, "*": a * b, "/": int(a / b)}[t])
        else:
            st.append(int(t))
    return st[-1]`,
    `int evalRPN(vector<string>& tokens) {
    vector<long> st;
    for (auto& t : tokens) {
        if (t == "+" || t == "-" || t == "*" || t == "/") {
            long b = st.back(); st.pop_back();
            long a = st.back(); st.pop_back();
            if (t == "+") st.push_back(a + b);
            else if (t == "-") st.push_back(a - b);
            else if (t == "*") st.push_back(a * b);
            else st.push_back(a / b);
        } else st.push_back(stol(t));
    }
    return (int)st.back();
}`,
    `int evalRPN(String[] tokens) {
    Deque<Long> st = new ArrayDeque<>();
    for (String t : tokens) {
        if ("+-*/".contains(t) && t.length() == 1) {
            long b = st.pop(), a = st.pop();
            if (t.equals("+")) st.push(a + b);
            else if (t.equals("-")) st.push(a - b);
            else if (t.equals("*")) st.push(a * b);
            else st.push(a / b);
        } else st.push(Long.parseLong(t));
    }
    return st.pop().intValue();
}`,
    `function evalRPN(tokens) {
  const st = [];
  for (const t of tokens) {
    if ("+-*/".includes(t) && t.length === 1) {
      const b = st.pop(), a = st.pop();
      if (t === "+") st.push(a + b);
      else if (t === "-") st.push(a - b);
      else if (t === "*") st.push(a * b);
      else st.push(Math.trunc(a / b));
    } else st.push(Number(t));
  }
  return st.at(-1);
}`,
  ),
  frames: (() => {
    const tokens = ["2", "1", "+", "3", "*"];
    const frames: Frame[] = [
      {
        kind: "stack",
        title: "RPN: 2 1 + 3 *",
        caption: "Operands push. Operators consume the top two values.",
        cells: tokens.map((value) => ({ value })),
        stackItems: [],
      },
      {
        kind: "stack",
        title: "Push 2",
        caption: "Operand goes on the stack.",
        cells: tokens.map((value, idx) => ({
          value,
          tone: idx === 0 ? "active" : "idle",
        })),
        stackItems: [{ value: "2", tone: "active" }],
      },
      {
        kind: "stack",
        title: "Push 1",
        caption: "Second operand.",
        cells: tokens.map((value, idx) => ({
          value,
          tone: idx === 1 ? "active" : idx < 1 ? "done" : "idle",
        })),
        stackItems: [{ value: "2" }, { value: "1", tone: "active" }],
      },
      {
        kind: "stack",
        title: "Apply +",
        caption: "Pop 1 and 2 → push 3.",
        cells: tokens.map((value, idx) => ({
          value,
          tone: idx === 2 ? "match" : idx < 2 ? "done" : "idle",
        })),
        stackItems: [{ value: "3", tone: "match" }],
        note: "2 + 1 = 3",
      },
      {
        kind: "stack",
        title: "Push 3",
        caption: "Next operand.",
        cells: tokens.map((value, idx) => ({
          value,
          tone: idx === 3 ? "active" : idx < 3 ? "done" : "idle",
        })),
        stackItems: [{ value: "3" }, { value: "3", tone: "active" }],
      },
      {
        kind: "stack",
        title: "Apply *",
        caption: "Pop 3 and 3 → push 9. Result = 9.",
        cells: tokens.map((value) => ({ value, tone: "match" })),
        stackItems: [{ value: "9", tone: "match" }],
        note: "3 * 3 = 9",
      },
    ];
    return frames;
  })(),
};

export const infixToPostfixSolution: ProblemSolution = {
  approach:
    "Shunting-yard: operands to output; operators wait on a stack, popping while top has ≥ precedence. Flush the stack at the end. O(n) time, O(n) space.",
  templates: langs(
    `def infixToPostfix(expr):
    prec = {"+": 1, "-": 1, "*": 2, "/": 2}
    st, out = [], []
    for tok in expr.replace(" ", ""):
        if tok.isalnum():
            out.append(tok)
        elif tok == "(":
            st.append(tok)
        elif tok == ")":
            while st and st[-1] != "(":
                out.append(st.pop())
            st.pop()
        else:
            while st and st[-1] != "(" and prec.get(st[-1], 0) >= prec[tok]:
                out.append(st.pop())
            st.append(tok)
    while st:
        out.append(st.pop())
    return "".join(out)`,
    `string infixToPostfix(string expr) {
    auto prec = [](char c) { return c=='+'||c=='-' ? 1 : c=='*'||c=='/' ? 2 : 0; };
    string st, out;
    for (char tok : expr) {
        if (tok == ' ') continue;
        if (isalnum(tok)) out.push_back(tok);
        else if (tok == '(') st.push_back(tok);
        else if (tok == ')') {
            while (!st.empty() && st.back() != '(') { out.push_back(st.back()); st.pop_back(); }
            st.pop_back();
        } else {
            while (!st.empty() && st.back() != '(' && prec(st.back()) >= prec(tok)) {
                out.push_back(st.back()); st.pop_back();
            }
            st.push_back(tok);
        }
    }
    while (!st.empty()) { out.push_back(st.back()); st.pop_back(); }
    return out;
}`,
    `String infixToPostfix(String expr) {
    Map<Character,Integer> prec = Map.of('+',1,'-',1,'*',2,'/',2);
    Deque<Character> st = new ArrayDeque<>();
    StringBuilder out = new StringBuilder();
    for (char tok : expr.toCharArray()) {
        if (tok == ' ') continue;
        if (Character.isLetterOrDigit(tok)) out.append(tok);
        else if (tok == '(') st.push(tok);
        else if (tok == ')') {
            while (!st.isEmpty() && st.peek() != '(') out.append(st.pop());
            st.pop();
        } else {
            while (!st.isEmpty() && st.peek() != '('
                    && prec.getOrDefault(st.peek(), 0) >= prec.get(tok))
                out.append(st.pop());
            st.push(tok);
        }
    }
    while (!st.isEmpty()) out.append(st.pop());
    return out.toString();
}`,
    `function infixToPostfix(expr) {
  const prec = { "+": 1, "-": 1, "*": 2, "/": 2 };
  const st = [], out = [];
  for (const tok of expr.replace(/\\s/g, "")) {
    if (/[A-Za-z0-9]/.test(tok)) out.push(tok);
    else if (tok === "(") st.push(tok);
    else if (tok === ")") {
      while (st.length && st.at(-1) !== "(") out.push(st.pop());
      st.pop();
    } else {
      while (st.length && st.at(-1) !== "(" && (prec[st.at(-1)] || 0) >= prec[tok])
        out.push(st.pop());
      st.push(tok);
    }
  }
  while (st.length) out.push(st.pop());
  return out.join("");
}`,
  ),
  frames: (() => {
    const expr = ["A", "+", "B", "*", "C"];
    const frames: Frame[] = [
      {
        kind: "stack",
        title: "Infix A + B * C",
        caption: "Higher-precedence operators stay on the stack longer.",
        cells: expr.map((value) => ({ value })),
        stackItems: [],
        note: "output: (empty)",
      },
      {
        kind: "stack",
        title: "Operand A",
        caption: "Operands go straight to the output.",
        cells: expr.map((value, idx) => ({
          value,
          tone: idx === 0 ? "active" : "idle",
        })),
        stackItems: [],
        note: "output: A",
      },
      {
        kind: "stack",
        title: "Operator +",
        caption: "Push +. Nothing higher to pop yet.",
        cells: expr.map((value, idx) => ({
          value,
          tone: idx === 1 ? "active" : idx < 1 ? "done" : "idle",
        })),
        stackItems: [{ value: "+", tone: "active" }],
        note: "output: A",
      },
      {
        kind: "stack",
        title: "Operand B",
        caption: "B to output.",
        cells: expr.map((value, idx) => ({
          value,
          tone: idx === 2 ? "active" : idx < 2 ? "done" : "idle",
        })),
        stackItems: [{ value: "+" }],
        note: "output: A B",
      },
      {
        kind: "stack",
        title: "Operator *",
        caption: "* has higher precedence than +. It stacks above +.",
        cells: expr.map((value, idx) => ({
          value,
          tone: idx === 3 ? "active" : idx < 3 ? "done" : "idle",
        })),
        stackItems: [{ value: "+" }, { value: "*", tone: "active" }],
        note: "output: A B",
      },
      {
        kind: "stack",
        title: "Operand C · flush",
        caption: "C to output, then pop * then +. Postfix: A B C * +.",
        cells: expr.map((value) => ({ value, tone: "match" })),
        stackItems: [],
        note: "output: A B C * +",
      },
    ];
    return frames;
  })(),
};

export const basicCalculatorIISolution: ProblemSolution = {
  approach:
    "Scan left→right; keep last operator and a running number. On +/− push ±num; on *∕ pop and combine immediately. Sum the stack. O(n) time, O(n) space.",
  templates: langs(
    `def calculate(s):
    st, num, op = [], 0, "+"
    for i, ch in enumerate(s + "+"):
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch in "+-*/":
            if op == "+": st.append(num)
            elif op == "-": st.append(-num)
            elif op == "*": st.append(st.pop() * num)
            else: st.append(int(st.pop() / num))
            num, op = 0, ch
    return sum(st)`,
    `int calculate(string s) {
    vector<int> st; long num = 0; char op = '+';
    s.push_back('+');
    for (char ch : s) {
        if (isdigit(ch)) num = num * 10 + (ch - '0');
        else if (ch == '+' || ch == '-' || ch == '*' || ch == '/') {
            if (op == '+') st.push_back(num);
            else if (op == '-') st.push_back(-num);
            else if (op == '*') { int t = st.back(); st.pop_back(); st.push_back(t * num); }
            else { int t = st.back(); st.pop_back(); st.push_back(t / num); }
            num = 0; op = ch;
        }
    }
    return accumulate(st.begin(), st.end(), 0);
}`,
    `int calculate(String s) {
    Deque<Integer> st = new ArrayDeque<>();
    int num = 0; char op = '+';
    s = s + "+";
    for (char ch : s.toCharArray()) {
        if (Character.isDigit(ch)) num = num * 10 + (ch - '0');
        else if (ch == '+' || ch == '-' || ch == '*' || ch == '/') {
            if (op == '+') st.push(num);
            else if (op == '-') st.push(-num);
            else if (op == '*') st.push(st.pop() * num);
            else st.push(st.pop() / num);
            num = 0; op = ch;
        }
    }
    int sum = 0; for (int x : st) sum += x;
    return sum;
}`,
    `function calculate(s) {
  const st = [];
  let num = 0, op = "+";
  s = s + "+";
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") num = num * 10 + Number(ch);
    else if ("+-*/".includes(ch)) {
      if (op === "+") st.push(num);
      else if (op === "-") st.push(-num);
      else if (op === "*") st.push(st.pop() * num);
      else st.push(Math.trunc(st.pop() / num));
      num = 0; op = ch;
    }
  }
  return st.reduce((a, b) => a + b, 0);
}`,
  ),
  frames: (() => {
    const cells = ["3", "+", "2", "*", "2"];
    const frames: Frame[] = [
      {
        kind: "stack",
        title: "3 + 2 * 2",
        caption: "* and / bind tighter — apply them immediately when seen.",
        cells: cells.map((value) => ({ value })),
        stackItems: [],
        note: "op = '+'",
      },
      {
        kind: "stack",
        title: "Commit 3 on +",
        caption: "Hit '+'; previous op was default '+', so push 3.",
        cells: cells.map((value, idx) => ({
          value,
          tone: idx === 1 ? "active" : idx === 0 ? "done" : "idle",
        })),
        stackItems: [{ value: "3", tone: "active" }],
        note: "op = '+'",
      },
      {
        kind: "stack",
        title: "See *",
        caption: "Commit 2 with '+': push 2. New op = '*'.",
        cells: cells.map((value, idx) => ({
          value,
          tone: idx === 3 ? "active" : idx < 3 ? "done" : "idle",
        })),
        stackItems: [{ value: "3" }, { value: "2", tone: "active" }],
        note: "op = '*'",
      },
      {
        kind: "stack",
        title: "Apply * 2",
        caption: "End (or next op): pop 2, push 2*2 = 4.",
        cells: cells.map((value) => ({ value, tone: "done" })),
        stackItems: [{ value: "3" }, { value: "4", tone: "match" }],
        note: "2 * 2 = 4",
      },
      {
        kind: "stack",
        title: "Sum the stack",
        caption: "3 + 4 = 7.",
        cells: cells.map((value) => ({ value, tone: "match" })),
        stackItems: [{ value: "7", tone: "match" }],
        note: "answer = 7",
        pointers: [{ name: "i", index: 4, color: PTR.M }],
      },
    ];
    return frames;
  })(),
};

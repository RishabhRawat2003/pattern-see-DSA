import { arrayFrame, listNodes, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const linkedListCycleSolution: ProblemSolution = {
  approach:
    "Floyd’s tortoise and hare: slow +1, fast +2. If they meet, a cycle exists. O(n) time, O(1) space.",
  templates: langs(
    `def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
    `bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
    `boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
    `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
  ),
  frames: (() => {
    const values = [3, 2, 0, -4];
    const cycleNext = { 3: 1 } as Record<number, number | null>;
    const frames: Frame[] = [
      {
        kind: "linkedlist",
        title: "List with a cycle",
        caption: "Tail (−4) points back to 2. Slow and fast both start at the head.",
        listNodes: listNodes(values, { 0: "active" }, cycleNext),
        cycleTo: "n1",
        pointers: [
          { name: "slow", index: 0, color: PTR.L },
          { name: "fast", index: 0, color: PTR.R },
        ],
      },
    ];
    const step = (p: number, k: number) => {
      let x = p;
      for (let s = 0; s < k; s++) x = x === 3 ? 1 : x + 1;
      return x;
    };
    let slow = 0;
    let fast = 0;
    for (let t = 0; t < 5; t++) {
      slow = step(slow, 1);
      fast = step(fast, 2);
      const meet = slow === fast;
      frames.push({
        kind: "linkedlist",
        title: meet ? "They meet" : `slow → ${values[slow]}, fast → ${values[fast]}`,
        caption: meet
          ? "Same node twice → cycle confirmed."
          : "Slow +1, fast +2. Different speeds collide only if a loop exists.",
        listNodes: listNodes(
          values,
          {
            [slow]: meet ? "match" : "lo",
            ...(meet ? {} : { [fast]: "hi" }),
          },
          cycleNext,
        ),
        cycleTo: "n1",
        pointers: [
          { name: "slow", index: slow, color: PTR.L },
          { name: "fast", index: fast, color: PTR.R },
        ],
      });
      if (meet) break;
    }
    return frames;
  })(),
};

export const middleOfLinkedListSolution: ProblemSolution = {
  approach:
    "Slow walks +1, fast walks +2. When fast cannot take two steps, slow sits on the middle (upper middle for even length). O(n) time, O(1) space.",
  templates: langs(
    `def middleNode(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
    `ListNode* middleNode(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
    `ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,
    `function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
  ),
  frames: (() => {
    const values = [1, 2, 3, 4, 5];
    const frames: Frame[] = [
      {
        kind: "linkedlist",
        title: "Find the middle",
        caption: "Both pointers start at the head. Fast races ahead two nodes at a time.",
        listNodes: listNodes(values, { 0: "active" }),
        pointers: [
          { name: "slow", index: 0, color: PTR.L },
          { name: "fast", index: 0, color: PTR.R },
        ],
      },
    ];
    let slow = 0;
    let fast = 0;
    while (fast + 2 < values.length) {
      slow += 1;
      fast += 2;
      frames.push({
        kind: "linkedlist",
        title: `slow → ${values[slow]}, fast → ${values[fast]}`,
        caption: "Fast still has room — keep advancing.",
        listNodes: listNodes(values, { [slow]: "lo", [fast]: "hi" }),
        pointers: [
          { name: "slow", index: slow, color: PTR.L },
          { name: "fast", index: fast, color: PTR.R },
        ],
      });
    }
    frames.push({
      kind: "linkedlist",
      title: "Middle found",
      caption: `slow sits on ${values[slow]} — the middle of this odd-length list.`,
      listNodes: listNodes(values, { [slow]: "match" }),
      pointers: [{ name: "slow", index: slow, color: PTR.L }],
    });
    return frames;
  })(),
};

export const happyNumberSolution: ProblemSolution = {
  approach:
    "Replace n with the sum of squares of its digits. Treat the sequence as a linked list and run Floyd: if you reach 1 you’re happy; if slow meets fast in a loop, you’re not. O(log n) per step, O(1) space.",
  templates: langs(
    `def isHappy(n):
    def nxt(x):
        s = 0
        while x:
            d = x % 10
            s += d * d
            x //= 10
        return s
    slow = fast = n
    while True:
        slow = nxt(slow)
        fast = nxt(nxt(fast))
        if slow == 1 or fast == 1:
            return True
        if slow == fast:
            return False`,
    `int nxt(int x) {
    int s = 0;
    while (x) { int d = x % 10; s += d * d; x /= 10; }
    return s;
}
bool isHappy(int n) {
    int slow = n, fast = n;
    while (true) {
        slow = nxt(slow);
        fast = nxt(nxt(fast));
        if (slow == 1 || fast == 1) return true;
        if (slow == fast) return false;
    }
}`,
    `int nxt(int x) {
    int s = 0;
    while (x > 0) { int d = x % 10; s += d * d; x /= 10; }
    return s;
}
boolean isHappy(int n) {
    int slow = n, fast = n;
    while (true) {
        slow = nxt(slow);
        fast = nxt(nxt(fast));
        if (slow == 1 || fast == 1) return true;
        if (slow == fast) return false;
    }
}`,
    `function isHappy(n) {
  const nxt = (x) => {
    let s = 0;
    while (x) { const d = x % 10; s += d * d; x = Math.floor(x / 10); }
    return s;
  };
  let slow = n, fast = n;
  while (true) {
    slow = nxt(slow);
    fast = nxt(nxt(fast));
    if (slow === 1 || fast === 1) return true;
    if (slow === fast) return false;
  }
}`,
  ),
  frames: (() => {
    const seq = [19, 82, 68, 100, 1];
    const frames: Frame[] = [
      arrayFrame(
        "Happy check on 19",
        "Follow n → sum of digit squares. Fast moves two hops; slow moves one.",
        seq,
        { 0: "active" },
        {
          pointers: [
            { name: "slow", index: 0, color: PTR.L },
            { name: "fast", index: 0, color: PTR.R },
          ],
          note: "19 → 1²+9² = 82",
        },
      ),
      arrayFrame(
        "First hop",
        "slow → 82, fast skips ahead to 68.",
        seq,
        { 1: "lo", 2: "hi" },
        {
          pointers: [
            { name: "slow", index: 1, color: PTR.L },
            { name: "fast", index: 2, color: PTR.R },
          ],
          note: "82 → 68 → 100",
        },
      ),
      arrayFrame(
        "Second hop",
        "slow → 68, fast → 1. Fast already hit happiness.",
        seq,
        { 2: "lo", 4: "match" },
        {
          pointers: [
            { name: "slow", index: 2, color: PTR.L },
            { name: "fast", index: 4, color: PTR.R },
          ],
          note: "100 → 1",
        },
      ),
      arrayFrame(
        "Reach 1",
        "Any pointer landing on 1 means the number is happy.",
        seq,
        { 4: "match" },
        { note: "happy ✓" },
      ),
      arrayFrame(
        "Unhappy contrast",
        "4 → 16 → 37 → … → 4 loops forever — Floyd would detect the meeting.",
        [4, 16, 37, 58, 89, 145, 42, 20, 4],
        { 0: "skip", 8: "skip" },
        { note: "cycle → not happy" },
      ),
    ];
    return frames;
  })(),
};

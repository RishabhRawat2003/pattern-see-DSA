import { arrayFrame, listNodes, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const linkedListCycleDetectSolution: ProblemSolution = {
  approach:
    "Floyd phase 1: slow +1, fast +2. Meeting proves a cycle. O(n) time, O(1) space.",
  templates: langs(
    `def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            return True
    return False`,
    `bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
    `boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next; fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
    `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next;
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
        title: "Detect a cycle",
        caption: "Tail points to index 1 (value 2). Different speeds will collide inside the loop.",
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
        title: meet ? "Collision" : "Keep circling",
        caption: meet
          ? "Meeting node proves a cycle exists."
          : "Slow +1, fast +2 around the ring.",
        listNodes: listNodes(
          values,
          { [slow]: meet ? "match" : "lo", ...(meet ? {} : { [fast]: "hi" }) },
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

export const linkedListCycleIISolution: ProblemSolution = {
  approach:
    "After Floyd meet, reset one pointer to head; both walk +1. They meet at the cycle entrance. O(n) time, O(1) space.",
  templates: langs(
    `def detectCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            slow = head
            while slow is not fast:
                slow, fast = slow.next, fast.next
            return slow
    return None`,
    `ListNode* detectCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
        if (slow == fast) {
            slow = head;
            while (slow != fast) { slow = slow->next; fast = fast->next; }
            return slow;
        }
    }
    return nullptr;
}`,
    `ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next; fast = fast.next.next;
        if (slow == fast) {
            slow = head;
            while (slow != fast) { slow = slow.next; fast = fast.next; }
            return slow;
        }
    }
    return null;
}`,
    `function detectCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next;
    if (slow === fast) {
      slow = head;
      while (slow !== fast) { slow = slow.next; fast = fast.next; }
      return slow;
    }
  }
  return null;
}`,
  ),
  frames: (() => {
    const values = [3, 2, 0, -4];
    const cycleNext = { 3: 1 } as Record<number, number | null>;
    const frames: Frame[] = [
      {
        kind: "linkedlist",
        title: "Phase 1 — find a meet",
        caption: "Same Floyd walk until slow and fast collide inside the cycle.",
        listNodes: listNodes(values, { 0: "active" }, cycleNext),
        cycleTo: "n1",
        pointers: [
          { name: "slow", index: 0, color: PTR.L },
          { name: "fast", index: 0, color: PTR.R },
        ],
      },
      {
        kind: "linkedlist",
        title: "They meet",
        caption: "Collision found. Entrance is still unknown.",
        listNodes: listNodes(values, { 1: "match" }, cycleNext),
        cycleTo: "n1",
        pointers: [
          { name: "slow", index: 1, color: PTR.L },
          { name: "fast", index: 1, color: PTR.R },
        ],
        note: "meet at node 2 (illustrative)",
      },
      {
        kind: "linkedlist",
        title: "Phase 2 — reset",
        caption: "Put one pointer back at the head. Both now move +1.",
        listNodes: listNodes(values, { 0: "lo", 1: "hi" }, cycleNext),
        cycleTo: "n1",
        pointers: [
          { name: "p1", index: 0, color: PTR.L },
          { name: "p2", index: 1, color: PTR.R },
        ],
      },
      {
        kind: "linkedlist",
        title: "Walk together",
        caption: "Distance head→entrance equals meet→entrance around the loop.",
        listNodes: listNodes(values, { 1: "window" }, cycleNext),
        cycleTo: "n1",
        pointers: [
          { name: "p1", index: 1, color: PTR.L },
          { name: "p2", index: 1, color: PTR.R },
        ],
      },
      {
        kind: "linkedlist",
        title: "Entrance found",
        caption: "They meet at 2 — the start of the cycle.",
        listNodes: listNodes(values, { 1: "match" }, cycleNext),
        cycleTo: "n1",
        pointers: [{ name: "entrance", index: 1, color: PTR.M }],
      },
    ];
    return frames;
  })(),
};

export const findTheDuplicateNumberSolution: ProblemSolution = {
  approach:
    "Treat nums[i] as next pointers in a functional graph (values in 1…n with one duplicate). Floyd finds the cycle; phase 2 finds the duplicated value. O(n) time, O(1) space — no modifying the array.",
  templates: langs(
    `def findDuplicate(nums):
    slow = fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow`,
    `int findDuplicate(vector<int>& nums) {
    int slow = nums[0], fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);
    slow = nums[0];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}`,
    `int findDuplicate(int[] nums) {
    int slow = nums[0], fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);
    slow = nums[0];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}`,
    `function findDuplicate(nums) {
  let slow = nums[0], fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`,
  ),
  frames: (() => {
    // nums = [1,3,4,2,2] → cycle at 2
    const nums = [1, 3, 4, 2, 2];
    const frames: Frame[] = [
      arrayFrame(
        "Array as a list",
        "Index i points to nums[i]. Duplicate value creates a cycle.",
        nums,
        { 0: "active" },
        { note: "0→1→3→2→4→2→…" },
      ),
      arrayFrame(
        "Floyd phase 1",
        "slow and fast chase indices via nums[·].",
        nums,
        { 1: "lo", 3: "hi" },
        {
          pointers: [
            { name: "slow", index: 1, color: PTR.L },
            { name: "fast", index: 3, color: PTR.R },
          ],
          note: "values at indices act as next",
        },
      ),
      arrayFrame(
        "They meet",
        "Pointers land on the same index inside the cycle.",
        nums,
        { 2: "match" },
        {
          pointers: [
            { name: "slow", index: 2, color: PTR.L },
            { name: "fast", index: 2, color: PTR.R },
          ],
        },
      ),
      arrayFrame(
        "Reset slow",
        "slow back to start; both step once per move.",
        nums,
        { 0: "lo", 2: "hi" },
        {
          pointers: [
            { name: "slow", index: 0, color: PTR.L },
            { name: "fast", index: 2, color: PTR.R },
          ],
        },
      ),
      arrayFrame(
        "Duplicate = 2",
        "They meet at the entrance — the duplicated number.",
        nums,
        { 2: "match", 4: "match" },
        {
          pointers: [{ name: "dup", index: 2, color: PTR.M }],
          note: "answer = 2",
        },
      ),
    ];
    return frames;
  })(),
};

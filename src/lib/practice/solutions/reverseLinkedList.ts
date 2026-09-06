import { listNodes, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const reverseLinkedListSolution: ProblemSolution = {
  approach:
    "Iterate with prev/curr: save next, point curr.next to prev, advance. New head is the last prev. O(n) time, O(1) space.",
  templates: langs(
    `def reverseList(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev, cur = cur, nxt
    return prev`,
    `ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *cur = head;
    while (cur) {
        ListNode* nxt = cur->next;
        cur->next = prev;
        prev = cur; cur = nxt;
    }
    return prev;
}`,
    `ListNode reverseList(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode nxt = cur.next;
        cur.next = prev;
        prev = cur; cur = nxt;
    }
    return prev;
}`,
    `function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    const nxt = cur.next;
    cur.next = prev;
    prev = cur; cur = nxt;
  }
  return prev;
}`,
  ),
  frames: (() => {
    const values = [1, 2, 3, 4];
    const frames: Frame[] = [
      {
        kind: "linkedlist",
        title: "Reverse in place",
        caption: "prev starts as null. Each node’s next is rewired to prev.",
        listNodes: listNodes(values),
      },
    ];
    let prev: number | null = null;
    for (let curr = 0; curr < values.length; curr++) {
      const overrides: Record<number, number | null> = {};
      for (let i = 0; i < curr; i++) overrides[i] = i === 0 ? null : i - 1;
      overrides[curr] = prev;
      frames.push({
        kind: "linkedlist",
        title: `curr = ${values[curr]}`,
        caption: `Point curr.next to prev (${prev === null ? "null" : values[prev]}), then advance.`,
        listNodes: listNodes(
          values,
          { [curr]: "active", ...(prev !== null ? { [prev]: "done" } : {}) },
          overrides,
        ),
        pointers: [
          { name: "prev", index: prev ?? curr, color: PTR.S },
          { name: "curr", index: curr, color: PTR.M },
        ],
      });
      prev = curr;
    }
    frames.push({
      kind: "linkedlist",
      title: "Head is now 4",
      caption: "The chain is 4 → 3 → 2 → 1 → null.",
      listNodes: [
        { id: "n3", value: "4", next: "n2", tone: "match" },
        { id: "n2", value: "3", next: "n1", tone: "done" },
        { id: "n1", value: "2", next: "n0", tone: "done" },
        { id: "n0", value: "1", next: null, tone: "done" },
      ],
    });
    return frames;
  })(),
};

export const reverseLinkedListIISolution: ProblemSolution = {
  approach:
    "Walk to left−1 with a dummy. Reverse the next (right−left+1) nodes in place, then reconnect the sublist. O(n) time, O(1) space.",
  templates: langs(
    `def reverseBetween(head, left, right):
    dummy = ListNode(0, head)
    prev = dummy
    for _ in range(left - 1):
        prev = prev.next
    cur = prev.next
    for _ in range(right - left):
        nxt = cur.next
        cur.next = nxt.next
        nxt.next = prev.next
        prev.next = nxt
    return dummy.next`,
    `ListNode* reverseBetween(ListNode* head, int left, int right) {
    ListNode dummy(0, head), *prev = &dummy;
    for (int i = 0; i < left - 1; i++) prev = prev->next;
    ListNode* cur = prev->next;
    for (int i = 0; i < right - left; i++) {
        ListNode* nxt = cur->next;
        cur->next = nxt->next;
        nxt->next = prev->next;
        prev->next = nxt;
    }
    return dummy.next;
}`,
    `ListNode reverseBetween(ListNode head, int left, int right) {
    ListNode dummy = new ListNode(0, head), prev = dummy;
    for (int i = 0; i < left - 1; i++) prev = prev.next;
    ListNode cur = prev.next;
    for (int i = 0; i < right - left; i++) {
        ListNode nxt = cur.next;
        cur.next = nxt.next;
        nxt.next = prev.next;
        prev.next = nxt;
    }
    return dummy.next;
}`,
    `function reverseBetween(head, left, right) {
  const dummy = { next: head };
  let prev = dummy;
  for (let i = 0; i < left - 1; i++) prev = prev.next;
  let cur = prev.next;
  for (let i = 0; i < right - left; i++) {
    const nxt = cur.next;
    cur.next = nxt.next;
    nxt.next = prev.next;
    prev.next = nxt;
  }
  return dummy.next;
}`,
  ),
  frames: (() => {
    const frames: Frame[] = [
      {
        kind: "linkedlist",
        title: "Reverse m…n",
        caption: "Reverse only the sublist from position 2 to 4. Keep ends linked.",
        listNodes: listNodes([1, 2, 3, 4, 5], { 1: "window", 2: "window", 3: "window" }),
        note: "left = 2, right = 4",
      },
      {
        kind: "linkedlist",
        title: "Anchor at 1",
        caption: "prev sits just before the window. Head-insert 3 in front of 2.",
        listNodes: listNodes([1, 2, 3, 4, 5], { 0: "done", 1: "lo", 2: "active" }),
        pointers: [
          { name: "prev", index: 0, color: PTR.S },
          { name: "cur", index: 1, color: PTR.M },
        ],
      },
      {
        kind: "linkedlist",
        title: "After one rotate",
        caption: "Sublist is now 3 → 2 → 4. cur still points at 2.",
        listNodes: [
          { id: "n0", value: "1", next: "n2", tone: "done" },
          { id: "n2", value: "3", next: "n1", tone: "active" },
          { id: "n1", value: "2", next: "n3", tone: "lo" },
          { id: "n3", value: "4", next: "n4", tone: "window" },
          { id: "n4", value: "5", next: null, tone: "idle" },
        ],
      },
      {
        kind: "linkedlist",
        title: "Head-insert 4",
        caption: "Move 4 to the front of the window: 4 → 3 → 2.",
        listNodes: [
          { id: "n0", value: "1", next: "n3", tone: "done" },
          { id: "n3", value: "4", next: "n2", tone: "active" },
          { id: "n2", value: "3", next: "n1", tone: "done" },
          { id: "n1", value: "2", next: "n4", tone: "lo" },
          { id: "n4", value: "5", next: null, tone: "idle" },
        ],
      },
      {
        kind: "linkedlist",
        title: "Done",
        caption: "Result: 1 → 4 → 3 → 2 → 5.",
        listNodes: [
          { id: "n0", value: "1", next: "n3", tone: "done" },
          { id: "n3", value: "4", next: "n2", tone: "match" },
          { id: "n2", value: "3", next: "n1", tone: "match" },
          { id: "n1", value: "2", next: "n4", tone: "match" },
          { id: "n4", value: "5", next: null, tone: "done" },
        ],
      },
    ];
    return frames;
  })(),
};

export const reverseNodesInKGroupSolution: ProblemSolution = {
  approach:
    "Count k nodes ahead. If a full group exists, reverse those k links and attach to the previous group’s tail; otherwise leave the remainder. O(n) time, O(1) space.",
  templates: langs(
    `def reverseKGroup(head, k):
    dummy = ListNode(0, head)
    group_prev = dummy
    while True:
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if not kth: return dummy.next
        group_next = kth.next
        prev, cur = group_next, group_prev.next
        while cur is not group_next:
            nxt = cur.next
            cur.next = prev
            prev, cur = cur, nxt
        tmp = group_prev.next
        group_prev.next = kth
        group_prev = tmp`,
    `ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode dummy(0, head), *groupPrev = &dummy;
    while (true) {
        ListNode* kth = groupPrev;
        for (int i = 0; i < k; i++) {
            kth = kth->next;
            if (!kth) return dummy.next;
        }
        ListNode *groupNext = kth->next, *prev = groupNext, *cur = groupPrev->next;
        while (cur != groupNext) {
            ListNode* nxt = cur->next;
            cur->next = prev;
            prev = cur; cur = nxt;
        }
        ListNode* tmp = groupPrev->next;
        groupPrev->next = kth;
        groupPrev = tmp;
    }
}`,
    `ListNode reverseKGroup(ListNode head, int k) {
    ListNode dummy = new ListNode(0, head), groupPrev = dummy;
    while (true) {
        ListNode kth = groupPrev;
        for (int i = 0; i < k; i++) {
            kth = kth.next;
            if (kth == null) return dummy.next;
        }
        ListNode groupNext = kth.next, prev = groupNext, cur = groupPrev.next;
        while (cur != groupNext) {
            ListNode nxt = cur.next;
            cur.next = prev;
            prev = cur; cur = nxt;
        }
        ListNode tmp = groupPrev.next;
        groupPrev.next = kth;
        groupPrev = tmp;
    }
}`,
    `function reverseKGroup(head, k) {
  const dummy = { next: head };
  let groupPrev = dummy;
  while (true) {
    let kth = groupPrev;
    for (let i = 0; i < k; i++) {
      kth = kth.next;
      if (!kth) return dummy.next;
    }
    const groupNext = kth.next;
    let prev = groupNext, cur = groupPrev.next;
    while (cur !== groupNext) {
      const nxt = cur.next;
      cur.next = prev;
      prev = cur; cur = nxt;
    }
    const tmp = groupPrev.next;
    groupPrev.next = kth;
    groupPrev = tmp;
  }
}`,
  ),
  frames: (() => {
    const frames: Frame[] = [
      {
        kind: "linkedlist",
        title: "k = 2 groups",
        caption: "Reverse every full pair. Leftover nodes stay as-is.",
        listNodes: listNodes([1, 2, 3, 4, 5], {
          0: "window",
          1: "window",
          2: "window",
          3: "window",
        }),
        note: "groups: [1,2] [3,4] | 5",
      },
      {
        kind: "linkedlist",
        title: "Reverse first pair",
        caption: "1 ↔ 2. groupPrev then jumps to the old head (1).",
        listNodes: [
          { id: "n1", value: "2", next: "n0", tone: "match" },
          { id: "n0", value: "1", next: "n2", tone: "done" },
          { id: "n2", value: "3", next: "n3", tone: "window" },
          { id: "n3", value: "4", next: "n4", tone: "window" },
          { id: "n4", value: "5", next: null, tone: "idle" },
        ],
      },
      {
        kind: "linkedlist",
        title: "Reverse second pair",
        caption: "3 ↔ 4 attached after 1.",
        listNodes: [
          { id: "n1", value: "2", next: "n0", tone: "done" },
          { id: "n0", value: "1", next: "n3", tone: "done" },
          { id: "n3", value: "4", next: "n2", tone: "match" },
          { id: "n2", value: "3", next: "n4", tone: "done" },
          { id: "n4", value: "5", next: null, tone: "idle" },
        ],
      },
      {
        kind: "linkedlist",
        title: "Remainder stays",
        caption: "Only one node left — fewer than k, so leave 5.",
        listNodes: [
          { id: "n1", value: "2", next: "n0", tone: "done" },
          { id: "n0", value: "1", next: "n3", tone: "done" },
          { id: "n3", value: "4", next: "n2", tone: "done" },
          { id: "n2", value: "3", next: "n4", tone: "done" },
          { id: "n4", value: "5", next: null, tone: "skip" },
        ],
        note: "need 2 nodes, have 1",
      },
      {
        kind: "linkedlist",
        title: "Result",
        caption: "2 → 1 → 4 → 3 → 5.",
        listNodes: [
          { id: "n1", value: "2", next: "n0", tone: "match" },
          { id: "n0", value: "1", next: "n3", tone: "match" },
          { id: "n3", value: "4", next: "n2", tone: "match" },
          { id: "n2", value: "3", next: "n4", tone: "match" },
          { id: "n4", value: "5", next: null, tone: "match" },
        ],
      },
    ];
    return frames;
  })(),
};

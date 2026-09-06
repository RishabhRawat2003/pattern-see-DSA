import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { Frame } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const mergeTwoSortedListsSolution: ProblemSolution = {
  approach:
    "Dummy head + two pointers: always attach the smaller of the two heads, then splice the remainder. O(n+m) time, O(1) extra space.",
  templates: langs(
    `def mergeTwoLists(a, b):
    dummy = cur = ListNode(0)
    while a and b:
        if a.val <= b.val:
            cur.next, a = a, a.next
        else:
            cur.next, b = b, b.next
        cur = cur.next
    cur.next = a or b
    return dummy.next`,
    `ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
    ListNode dummy(0), *cur = &dummy;
    while (a && b) {
        if (a->val <= b->val) { cur->next = a; a = a->next; }
        else { cur->next = b; b = b->next; }
        cur = cur->next;
    }
    cur->next = a ? a : b;
    return dummy.next;
}`,
    `ListNode mergeTwoLists(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), cur = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { cur.next = a; a = a.next; }
        else { cur.next = b; b = b.next; }
        cur = cur.next;
    }
    cur.next = a != null ? a : b;
    return dummy.next;
}`,
    `function mergeTwoLists(a, b) {
  const dummy = { next: null }; let cur = dummy;
  while (a && b) {
    if (a.val <= b.val) { cur.next = a; a = a.next; }
    else { cur.next = b; b = b.next; }
    cur = cur.next;
  }
  cur.next = a || b;
  return dummy.next;
}`,
  ),
  frames: (() => {
    const a = [1, 3, 5];
    const b = [2, 4];
    const frames: Frame[] = [
      {
        kind: "array",
        title: "Two sorted lists",
        caption: "Always take the smaller head. Dummy node holds the merged tail.",
        cells: [
          { value: "A:1", tone: "lo" },
          { value: "A:3" },
          { value: "A:5" },
          { value: "|" },
          { value: "B:2", tone: "hi" },
          { value: "B:4" },
        ],
      },
    ];
    const merged: number[] = [];
    let i = 0;
    let j = 0;
    while (i < a.length || j < b.length) {
      const takeA = j >= b.length || (i < a.length && a[i] <= b[j]);
      if (takeA) {
        merged.push(a[i]);
        i += 1;
      } else {
        merged.push(b[j]);
        j += 1;
      }
      frames.push({
        kind: "linkedlist",
        title: `Take ${merged[merged.length - 1]}`,
        caption: takeA
          ? "A’s head was smaller (or B is exhausted)."
          : "B’s head was smaller.",
        listNodes: merged.map((value, idx) => ({
          id: `m${idx}`,
          value: String(value),
          next: idx === merged.length - 1 ? null : `m${idx + 1}`,
          tone: idx === merged.length - 1 ? "active" : "done",
        })),
        note: `A left: [${a.slice(i).join(", ")}]  B left: [${b.slice(j).join(", ")}]`,
      });
    }
    return frames;
  })(),
};

export const mergeSortedArraySolution: ProblemSolution = {
  approach:
    "Fill nums1 from the back with three pointers (i at m−1, j at n−1, k at m+n−1). Place the larger of nums1[i]/nums2[j] at k and walk left. O(m+n) time, O(1) space.",
  templates: langs(
    `def merge(nums1, m, nums2, n):
    i, j, k = m - 1, n - 1, m + n - 1
    while j >= 0:
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1`,
    `void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
}`,
    `void merge(int[] nums1, int m, int[] nums2, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
}`,
    `function merge(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
    else nums1[k--] = nums2[j--];
  }
}`,
  ),
  frames: (() => {
    const frames: Frame[] = [
      arrayFrame(
        "Merge into nums1",
        "nums1 has capacity at the end. Write the larger tail first so you never overwrite unread values.",
        [1, 2, 3, 0, 0, 0],
        { 0: "lo", 1: "lo", 2: "lo" },
        { note: "nums2 = [2, 5, 6] · m=3 n=3" },
      ),
      arrayFrame(
        "Place 6",
        "Compare 3 vs 6 → write 6 at the end.",
        [1, 2, 3, 0, 0, 6],
        { 2: "lo", 5: "match" },
        {
          pointers: [
            { name: "i", index: 2, color: PTR.L },
            { name: "k", index: 5, color: PTR.M },
          ],
          note: "j → 5",
        },
      ),
      arrayFrame(
        "Place 5",
        "3 vs 5 → write 5.",
        [1, 2, 3, 0, 5, 6],
        { 2: "lo", 4: "match" },
        {
          pointers: [
            { name: "i", index: 2, color: PTR.L },
            { name: "k", index: 4, color: PTR.M },
          ],
        },
      ),
      arrayFrame(
        "Place 3",
        "3 vs 2 → write 3 from nums1.",
        [1, 2, 3, 3, 5, 6],
        { 1: "lo", 3: "match" },
        {
          pointers: [
            { name: "i", index: 1, color: PTR.L },
            { name: "k", index: 3, color: PTR.M },
          ],
        },
      ),
      arrayFrame(
        "Place 2 from nums2",
        "2 == 2; take from nums2 (either works).",
        [1, 2, 2, 3, 5, 6],
        { 2: "match" },
      ),
      arrayFrame(
        "Finish",
        "Remaining nums1 values are already in place. Sorted: [1,2,2,3,5,6].",
        [1, 2, 2, 3, 5, 6],
        { 0: "match", 1: "match", 2: "match", 3: "match", 4: "match", 5: "match" },
      ),
    ];
    return frames;
  })(),
};

export const mergeKSortedListsSolution: ProblemSolution = {
  approach:
    "Min-heap (or pairwise merge): push each list head, repeatedly pop the smallest and push its next. O(N log k) time for N total nodes.",
  templates: langs(
    `import heapq
def mergeKLists(lists):
    heap = []
    for i, node in enumerate(lists):
        if node: heapq.heappush(heap, (node.val, i, node))
    dummy = cur = ListNode(0)
    while heap:
        _, i, node = heapq.heappop(heap)
        cur.next = node
        cur = cur.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
    `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
    for (auto* n : lists) if (n) pq.push(n);
    ListNode dummy(0), *cur = &dummy;
    while (!pq.empty()) {
        ListNode* n = pq.top(); pq.pop();
        cur->next = n; cur = cur->next;
        if (n->next) pq.push(n->next);
    }
    return dummy.next;
}`,
    `ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
    for (ListNode n : lists) if (n != null) pq.offer(n);
    ListNode dummy = new ListNode(0), cur = dummy;
    while (!pq.isEmpty()) {
        ListNode n = pq.poll();
        cur.next = n; cur = cur.next;
        if (n.next != null) pq.offer(n.next);
    }
    return dummy.next;
}`,
    `function mergeKLists(lists) {
  const heap = lists.filter(Boolean).sort((a, b) => a.val - b.val);
  const dummy = { next: null }; let cur = dummy;
  while (heap.length) {
    heap.sort((a, b) => a.val - b.val);
    const n = heap.shift();
    cur.next = n; cur = cur.next;
    if (n.next) heap.push(n.next);
  }
  return dummy.next;
}`,
  ),
  frames: (() => {
    const frames: Frame[] = [
      {
        kind: "array",
        title: "k sorted lists",
        caption: "Heap holds the current head of each list. Pop min, push its successor.",
        cells: [
          { value: "L0:1", tone: "lo" },
          { value: "4" },
          { value: "5" },
          { value: "|" },
          { value: "L1:1", tone: "hi" },
          { value: "3" },
          { value: "4" },
          { value: "|" },
          { value: "L2:2", tone: "active" },
          { value: "6" },
        ],
        note: "heap tops: 1, 1, 2",
      },
      {
        kind: "linkedlist",
        title: "Pop 1 (L0)",
        caption: "Smallest head is 1 from list 0. Push next head 4.",
        listNodes: [{ id: "m0", value: "1", next: null, tone: "active" }],
        note: "heap: 1(L1), 2, 4(L0)",
      },
      {
        kind: "linkedlist",
        title: "Pop 1 (L1)",
        caption: "Next min is the other 1. Push 3.",
        listNodes: [
          { id: "m0", value: "1", next: "m1", tone: "done" },
          { id: "m1", value: "1", next: null, tone: "active" },
        ],
        note: "heap: 2, 3, 4",
      },
      {
        kind: "linkedlist",
        title: "Pop 2",
        caption: "Take 2 from L2, push 6.",
        listNodes: [
          { id: "m0", value: "1", next: "m1", tone: "done" },
          { id: "m1", value: "1", next: "m2", tone: "done" },
          { id: "m2", value: "2", next: null, tone: "active" },
        ],
      },
      {
        kind: "linkedlist",
        title: "Continue merging",
        caption: "Keep popping until the heap is empty.",
        listNodes: [
          { id: "m0", value: "1", next: "m1", tone: "done" },
          { id: "m1", value: "1", next: "m2", tone: "done" },
          { id: "m2", value: "2", next: "m3", tone: "done" },
          { id: "m3", value: "3", next: "m4", tone: "active" },
          { id: "m4", value: "4", next: null, tone: "idle" },
        ],
      },
      {
        kind: "linkedlist",
        title: "Fully merged",
        caption: "1 → 1 → 2 → 3 → 4 → 4 → 5 → 6.",
        listNodes: [1, 1, 2, 3, 4, 4, 5, 6].map((value, idx, arr) => ({
          id: `m${idx}`,
          value: String(value),
          next: idx === arr.length - 1 ? null : `m${idx + 1}`,
          tone: "match" as const,
        })),
      },
    ];
    return frames;
  })(),
};

import type { Frame } from "../types";

export function topKFrames(): Frame[] {
  const stream = [3, 1, 5, 12, 2, 11];
  const k = 3;
  const heap: number[] = [];
  const frames: Frame[] = [
    {
      kind: "array",
      title: "Top 3 so far",
      caption: "Min-heap of size k. Root is the smallest of the current top-k. Kick it if a larger value arrives.",
      cells: stream.map((value) => ({ value })),
      note: "k = 3",
    },
  ];
  for (let i = 0; i < stream.length; i++) {
    heap.push(stream[i]);
    heap.sort((a, b) => a - b);
    if (heap.length > k) heap.shift();
    frames.push({
      kind: "stack",
      title: `Read ${stream[i]}`,
      caption:
        heap.length < k
          ? "Heap not full yet — just insert."
          : `Min-heap (sorted view) is [${heap.join(", ")}]. Root ${heap[0]} is the kth among these.`,
      cells: stream.map((value, idx) => ({
        value,
        tone: idx === i ? "active" : idx < i ? "done" : "idle",
      })),
      stackItems: heap.map((value, idx) => ({
        value: String(value),
        tone: idx === 0 ? "lo" : "idle",
      })),
      note: `heap [${heap.join(", ")}]`,
    });
  }
  return frames;
}

export function kthLargestFrames(): Frame[] {
  const a = [3, 2, 1, 5, 6, 4];
  const k = 2;
  const heap: number[] = [];
  const frames: Frame[] = [
    {
      kind: "array",
      title: "2nd largest",
      caption: "Min-heap of size 2. After the scan, the root is the 2nd largest in the array.",
      cells: a.map((value) => ({ value })),
    },
  ];
  for (let i = 0; i < a.length; i++) {
    heap.push(a[i]);
    heap.sort((a, b) => a - b);
    if (heap.length > k) heap.shift();
    frames.push({
      kind: "stack",
      title: `Push ${a[i]}`,
      caption: heap.length > k ? "Drop the min." : "Maintain size k.",
      cells: a.map((value, idx) => ({
        value,
        tone: idx === i ? "active" : "idle",
      })),
      stackItems: heap.map((value) => ({ value: String(value) })),
      note: `root (kth) = ${heap[0]}`,
    });
  }
  frames.push({
    kind: "stack",
    title: "Answer 5",
    caption: "Heap holds 5 and 6. Min is 5 — the 2nd largest.",
    cells: a.map((value) => ({ value, tone: value >= 5 ? "match" : "idle" })),
    stackItems: heap.map((value) => ({ value: String(value), tone: "match" })),
  });
  return frames;
}

export function mergeKListsFrames(): Frame[] {
  const frames: Frame[] = [
    {
      kind: "array",
      title: "Three sorted lists",
      caption: "Heap stores the current head of each list. Always pop the global min, then push that list’s next.",
      cells: [
        { value: "A:1" },
        { value: "A:4" },
        { value: "B:2" },
        { value: "B:5" },
        { value: "C:3" },
      ],
    },
  ];
  const merged: number[] = [];
  const steps = [
    { take: 1, heap: "2,3,4", cap: "Pop 1 from A. Push A’s next (4)." },
    { take: 2, heap: "3,4,5", cap: "Pop 2 from B. Push 5." },
    { take: 3, heap: "4,5", cap: "Pop 3 from C. C is empty." },
    { take: 4, heap: "5", cap: "Pop 4 from A." },
    { take: 5, heap: "∅", cap: "Pop 5. Merged 1,2,3,4,5." },
  ];
  for (const s of steps) {
    merged.push(s.take);
    frames.push({
      kind: "linkedlist",
      title: `Emit ${s.take}`,
      caption: s.cap,
      listNodes: merged.map((value, idx) => ({
        id: `m${idx}`,
        value: String(value),
        next: idx === merged.length - 1 ? null : `m${idx + 1}`,
        tone: idx === merged.length - 1 ? "active" : "done",
      })),
      note: `heap heads: ${s.heap}`,
    });
  }
  return frames;
}

export function heapHashmapFrames(): Frame[] {
  const s = ["a", "b", "a", "c", "b", "a"];
  const map: Record<string, number> = {};
  const frames: Frame[] = [];
  for (let i = 0; i < s.length; i++) {
    map[s[i]] = (map[s[i]] ?? 0) + 1;
    const heap = Object.entries(map).sort((a, b) => b[1] - a[1]);
    frames.push({
      kind: "hashmap",
      title: `Count '${s[i]}'`,
      caption: "Map holds frequencies. Heap (shown sorted) orders keys by count for top-k frequent.",
      cells: s.map((value, idx) => ({
        value,
        tone: idx === i ? "active" : idx < i ? "done" : "idle",
      })),
      mapEntries: heap.map(([key, value], idx) => ({
        key,
        value: `${value}×`,
        tone: idx === 0 ? "match" : key === s[i] ? "active" : "idle",
      })),
    });
  }
  return frames;
}

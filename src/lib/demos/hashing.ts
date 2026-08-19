import type { Frame } from "../types";

export function hashmapLookupFrames(): Frame[] {
  const a = [2, 7, 11, 15];
  const target = 9;
  const seen: Record<string, number> = {};
  const frames: Frame[] = [
    {
      kind: "hashmap",
      title: "Two-sum with a map",
      caption: "For each number x, look up target − x. If missing, store x → index.",
      cells: a.map((value) => ({ value })),
      mapEntries: [],
      note: "target = 9",
    },
  ];
  for (let i = 0; i < a.length; i++) {
    const need = target - a[i];
    const found = need in seen;
    frames.push({
      kind: "hashmap",
      title: `x = ${a[i]}, need ${need}`,
      caption: found
        ? `${need} is already in the map at index ${seen[need]}. Pair (${need}, ${a[i]}).`
        : `${need} is not in the map. Store ${a[i]} → ${i}.`,
      cells: a.map((value, idx) => ({
        value,
        tone: idx === i ? "active" : idx in Object.values(seen) ? "done" : "idle",
      })),
      mapEntries: Object.entries(seen).map(([key, value]) => ({
        key,
        value: `index ${value}`,
        tone: Number(key) === need ? "match" : "idle",
      })),
      pointers: [{ name: "i", index: i, color: "#fbbf24" }],
    });
    if (found) break;
    seen[a[i]] = i;
  }
  return frames;
}

export function frequencyCountingFrames(): Frame[] {
  const s = ["m", "i", "s", "s", "i", "s", "s", "i", "p", "p", "i"];
  const map: Record<string, number> = {};
  const frames: Frame[] = [];
  for (let i = 0; i < s.length; i++) {
    map[s[i]] = (map[s[i]] ?? 0) + 1;
    frames.push({
      kind: "hashmap",
      title: `Read '${s[i]}'`,
      caption: `Frequency of ${s[i]} is now ${map[s[i]]}. The map grows with distinct keys, not with n.`,
      cells: s.map((value, idx) => ({
        value,
        tone: idx === i ? "active" : idx < i ? "done" : "idle",
      })),
      mapEntries: Object.entries(map).map(([key, value]) => ({
        key,
        value: String(value),
        tone: key === s[i] ? "active" : "idle",
      })),
    });
  }
  return frames;
}

export function setDetectionFrames(): Frame[] {
  const a = [3, 1, 4, 2, 1, 5];
  const set = new Set<number>();
  const frames: Frame[] = [
    {
      kind: "hashmap",
      title: "Have I seen this?",
      caption: "Insert into a set. If insert fails, we found a duplicate.",
      cells: a.map((value) => ({ value })),
      mapEntries: [],
    },
  ];
  for (let i = 0; i < a.length; i++) {
    const dup = set.has(a[i]);
    if (!dup) set.add(a[i]);
    frames.push({
      kind: "hashmap",
      title: dup ? `Duplicate: ${a[i]}` : `Insert ${a[i]}`,
      caption: dup
        ? "The set already contains 1. Detection complete without sorting."
        : "Not present — add it and continue.",
      cells: a.map((value, idx) => ({
        value,
        tone: idx === i ? (dup ? "match" : "active") : idx < i ? "done" : "idle",
      })),
      mapEntries: [...set].map((key) => ({
        key: String(key),
        value: "seen",
        tone: key === a[i] ? (dup ? "match" : "active") : "idle",
      })),
      pointers: [{ name: "i", index: i, color: "#fbbf24" }],
    });
    if (dup) break;
  }
  return frames;
}

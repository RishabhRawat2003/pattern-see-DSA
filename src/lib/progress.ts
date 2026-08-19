export type PatternMark = "unset" | "done" | "review";

export type PatternProgress = {
  mark: PatternMark;
  reviewAt?: number;
  solved: string[];
};

export type ProgressStore = {
  patterns: Record<string, PatternProgress>;
};

const KEY = "patternsee-progress-v1";
export const REVIEW_MS = 2 * 24 * 60 * 60 * 1000;

const empty = (): ProgressStore => ({ patterns: {} });

export function loadProgress(): ProgressStore {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as ProgressStore;
    if (!parsed?.patterns) return empty();
    return parsed;
  } catch {
    return empty();
  }
}

export function saveProgress(store: ProgressStore) {
  window.localStorage.setItem(KEY, JSON.stringify(store));
  window.dispatchEvent(new Event("patternsee-progress"));
}

export function getEntry(store: ProgressStore, slug: string): PatternProgress {
  return store.patterns[slug] ?? { mark: "unset", solved: [] };
}

export function setMark(slug: string, mark: PatternMark) {
  const store = loadProgress();
  const cur = getEntry(store, slug);
  const next: PatternProgress = {
    ...cur,
    mark,
    reviewAt: mark === "review" ? Date.now() + REVIEW_MS : undefined,
  };
  store.patterns[slug] = next;
  saveProgress(store);
  return next;
}

export function toggleSolved(slug: string, problemId: string) {
  const store = loadProgress();
  const cur = getEntry(store, slug);
  const has = cur.solved.includes(problemId);
  const solved = has ? cur.solved.filter((id) => id !== problemId) : [...cur.solved, problemId];
  const next = { ...cur, solved };
  store.patterns[slug] = next;
  saveProgress(store);
  return next;
}

export function isDue(entry: PatternProgress, now = Date.now()) {
  if (entry.mark !== "review") return false;
  return (entry.reviewAt ?? 0) <= now;
}

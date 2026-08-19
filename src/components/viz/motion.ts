import type { Transition } from "motion/react";

export const spring: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 26,
  mass: 0.7,
};

export const snappy: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 32,
};

export const highlightTones = new Set([
  "active",
  "match",
  "lo",
  "mid",
  "hi",
  "window",
  "update",
]);

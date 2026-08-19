import type { PracticePack } from "../types";
import { level1Practice } from "./level1";
import { level2Practice } from "./level2";
import { level3Practice } from "./level3";

const catalog: Record<string, PracticePack> = {
  ...level1Practice,
  ...level2Practice,
  ...level3Practice,
};

export function getPractice(slug: string): PracticePack | undefined {
  return catalog[slug];
}

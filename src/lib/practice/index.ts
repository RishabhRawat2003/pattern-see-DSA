import type { PracticePack, PracticeSummary, ProblemSolution } from "../types";
import { level1Practice } from "./level1";
import { level2Practice } from "./level2";
import { level3Practice } from "./level3";

const catalog: Record<string, PracticePack> = {
  ...level1Practice,
  ...level2Practice,
  ...level3Practice,
};

export type { PracticeSummary, ProblemSolution };

export function getPractice(slug: string): PracticePack | undefined {
  return catalog[slug];
}

export function getPracticeSummary(slug: string): PracticeSummary | undefined {
  const pack = catalog[slug];
  if (!pack) return undefined;
  return {
    cue: pack.cue,
    templates: pack.templates,
    problems: pack.problems.map((problem) => ({
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      url: problem.url,
      hasSolution: Boolean(problem.templates && problem.frames),
    })),
  };
}

export function getProblemSolution(slug: string, problemId: string): ProblemSolution | null {
  const problem = catalog[slug]?.problems.find((item) => item.id === problemId);
  if (!problem?.templates || !problem.frames) return null;
  return {
    approach: problem.approach,
    templates: problem.templates,
    frames: problem.frames,
  };
}

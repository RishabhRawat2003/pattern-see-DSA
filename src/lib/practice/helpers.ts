import type { PracticePack, PracticeProblem, ProblemDifficulty, TemplateLang } from "../types";

export const templateLangs: { id: TemplateLang; label: string }[] = [
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
  { id: "java", label: "Java" },
  { id: "javascript", label: "JavaScript" },
];

export function lc(
  path: string,
  title: string,
  difficulty: ProblemDifficulty,
): PracticeProblem {
  return {
    id: path,
    title,
    difficulty,
    url: `https://leetcode.com/problems/${path}/`,
  };
}

export function gfg(
  path: string,
  title: string,
  difficulty: ProblemDifficulty,
): PracticeProblem {
  return {
    id: `gfg-${path}`,
    title,
    difficulty,
    url: `https://www.geeksforgeeks.org/${path}/`,
  };
}

export function langs(
  python: string,
  cpp: string,
  java: string,
  javascript: string,
): Record<TemplateLang, string> {
  return {
    python: python.trim() + "\n",
    cpp: cpp.trim() + "\n",
    java: java.trim() + "\n",
    javascript: javascript.trim() + "\n",
  };
}

export function pack(
  cue: string,
  templates: Record<TemplateLang, string>,
  a: PracticeProblem,
  b: PracticeProblem,
  c: PracticeProblem,
): PracticePack {
  return { cue, templates, problems: [a, b, c] };
}

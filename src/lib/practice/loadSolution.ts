"use server";

import { getProblemSolution } from "@/lib/practice";
import type { ProblemSolution } from "@/lib/types";

export async function loadProblemSolution(
  slug: string,
  problemId: string,
): Promise<ProblemSolution | null> {
  return getProblemSolution(slug, problemId);
}

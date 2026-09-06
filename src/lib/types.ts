export type LevelId = 1 | 2 | 3;

export type VisualKind =
  | "array"
  | "hashmap"
  | "linkedlist"
  | "stack"
  | "tree"
  | "numberline"
  | "grid"
  | "intervals";

export type CellTone =
  | "idle"
  | "active"
  | "done"
  | "window"
  | "lo"
  | "mid"
  | "hi"
  | "match"
  | "skip"
  | "update";

export type Pointer = {
  name: string;
  index: number;
  color: string;
};

export type TreeNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  tone?: CellTone;
};

export type Frame = {
  title: string;
  caption: string;
  kind: VisualKind;
  cells?: { value: string | number; tone?: CellTone }[];
  pointers?: Pointer[];
  window?: [number, number];
  mapEntries?: { key: string; value: string; tone?: CellTone }[];
  listNodes?: {
    id: string;
    value: string;
    next: string | null;
    tone?: CellTone;
  }[];
  cycleTo?: string | null;
  stackItems?: { value: string; tone?: CellTone }[];
  treeNodes?: TreeNode[];
  treeEdges?: { from: string; to: string; dashed?: boolean; tone?: CellTone }[];
  range?: { min: number; max: number; lo: number; hi: number; mid?: number };
  grid?: { value: string; tone?: CellTone }[][];
  intervals?: { label: string; start: number; end: number; tone?: CellTone }[];
  axisMax?: number;
  note?: string;
};

export type Pattern = {
  slug: string;
  title: string;
  group: string;
  level: LevelId;
  ready: boolean;
  intuition: string;
  whenToUse: string;
  complexity: { time: string; space: string };
  example: string;
};

export type ProblemDifficulty = "Easy" | "Medium" | "Hard";

export type PracticeProblem = {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  url: string;
  approach?: string;
  templates?: Record<TemplateLang, string>;
  frames?: Frame[];
};

export type TemplateLang = "python" | "cpp" | "java" | "javascript";

export type PracticePack = {
  cue: string;
  templates: Record<TemplateLang, string>;
  problems: [PracticeProblem, PracticeProblem, PracticeProblem];
};

export type PatternGroup = {
  id: string;
  title: string;
  emoji: string;
  blurb: string;
  patterns: Pattern[];
};

export type Level = {
  id: LevelId;
  title: string;
  subtitle: string;
  band: string;
  warning: string;
  ready: boolean;
  groups: PatternGroup[];
};

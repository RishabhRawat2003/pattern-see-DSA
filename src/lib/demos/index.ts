import type { Frame } from "../types";
import {
  binaryLiftingFrames,
  meetInMiddleFrames,
  mosAlgorithmFrames,
  windowDpFrames,
} from "./advanced";
import {
  bellmanFordFrames,
  dijkstraFrames,
  floydWarshallFrames,
  mstFrames,
  topoSortFrames,
} from "./advancedGraphs";
import {
  differenceArrayFrames,
  frequencyMapArrayFrames,
  kadaneFrames,
  prefixSumFrames,
  slidingWindowFrames,
  sortingTricksFrames,
  twoPointersFrames,
} from "./array";
import {
  combinationSumFrames,
  nQueensFrames,
  permutationsFrames,
  subsetsFrames,
  sudokuSolverFrames,
} from "./backtracking";
import {
  binarySearchOnAnswerFrames,
  classicBinarySearchFrames,
  firstLastOccurrenceFrames,
  lowerUpperBoundFrames,
} from "./binarySearch";
import {
  bitMaskingFrames,
  missingNumberFrames,
  subsetsBitsFrames,
  xorTricksFrames,
} from "./bits";
import {
  bstInsertDeleteFrames,
  bstValidationFrames,
  inorderLogicFrames,
  kthSmallestFrames,
} from "./bst";
import {
  coinChangeFrames,
  editDistanceFrames,
  fibonacciPatternFrames,
  gridDpFrames,
  houseRobberFrames,
  knapsackFrames,
  lcsLpsFrames,
  lisFrames,
  oneDDpFrames,
  palindromePartitionFrames,
  partitionEqualFrames,
  subsetSumFrames,
  twoDDpFrames,
  wildcardMatchingFrames,
} from "./dp";
import {
  dsuComponentsFrames,
  dsuCycleFrames,
  kruskalFrames,
} from "./dsu";
import {
  activitySelectionFrames,
  intervalSchedulingFrames,
  jobSequencingFrames,
  mergeIntervalsFrames,
  minimumPlatformsFrames,
} from "./greedy";
import {
  bipartiteFrames,
  connectedComponentsFrames,
  graphBfsDfsFrames,
  graphCycleFrames,
} from "./graphs";
import {
  frequencyCountingFrames,
  hashmapLookupFrames,
  setDetectionFrames,
} from "./hashing";
import {
  heapHashmapFrames,
  kthLargestFrames,
  mergeKListsFrames,
  topKFrames,
} from "./heap";
import {
  cycleDetectionFrames,
  fastSlowFrames,
  mergeListsFrames,
  reverseListFrames,
} from "./linkedList";
import {
  backtrackingIntroFrames,
  pickNotPickFrames,
  recursiveTreeFrames,
} from "./recursion";
import {
  infixPostfixFrames,
  monotonicStackFrames,
  nextGreaterFrames,
  validParenthesesFrames,
} from "./stack";
import {
  autocompleteFrames,
  trieInsertSearchFrames,
  wordSearchFrames,
} from "./trie";
import {
  balancedTreeFrames,
  bfsLevelFrames,
  dfsTraversalFrames,
  heightDiameterFrames,
  lcaFrames,
  pathSumFrames,
} from "./trees";

const registry: Record<string, () => Frame[]> = {
  "two-pointers": twoPointersFrames,
  "sliding-window": slidingWindowFrames,
  "prefix-sum": prefixSumFrames,
  "difference-array": differenceArrayFrames,
  kadane: kadaneFrames,
  "sorting-tricks": sortingTricksFrames,
  "frequency-map": frequencyMapArrayFrames,
  "classic-binary-search": classicBinarySearchFrames,
  "first-last-occurrence": firstLastOccurrenceFrames,
  "lower-upper-bound": lowerUpperBoundFrames,
  "binary-search-on-answer": binarySearchOnAnswerFrames,
  "hashmap-lookup": hashmapLookupFrames,
  "frequency-counting": frequencyCountingFrames,
  "set-detection": setDetectionFrames,
  "fast-slow-pointer": fastSlowFrames,
  "reverse-linked-list": reverseListFrames,
  "merge-lists": mergeListsFrames,
  "cycle-detection": cycleDetectionFrames,
  "valid-parentheses": validParenthesesFrames,
  "infix-prefix-postfix": infixPostfixFrames,
  "next-greater-element": nextGreaterFrames,
  "monotonic-stack": monotonicStackFrames,
  "pick-not-pick": pickNotPickFrames,
  "recursive-tree": recursiveTreeFrames,
  "backtracking-intro": backtrackingIntroFrames,
  "dfs-traversals": dfsTraversalFrames,
  "bfs-level-order": bfsLevelFrames,
  "height-diameter": heightDiameterFrames,
  "balanced-tree": balancedTreeFrames,
  lca: lcaFrames,
  "path-sum": pathSumFrames,
  "bst-validation": bstValidationFrames,
  "bst-insert-delete": bstInsertDeleteFrames,
  "kth-smallest": kthSmallestFrames,
  "inorder-logic": inorderLogicFrames,
  "top-k": topKFrames,
  "kth-largest": kthLargestFrames,
  "merge-k-lists": mergeKListsFrames,
  "heap-hashmap": heapHashmapFrames,
  "activity-selection": activitySelectionFrames,
  "interval-scheduling": intervalSchedulingFrames,
  "merge-intervals": mergeIntervalsFrames,
  "minimum-platforms": minimumPlatformsFrames,
  "job-sequencing": jobSequencingFrames,
  "graph-bfs-dfs": graphBfsDfsFrames,
  "connected-components": connectedComponentsFrames,
  "graph-cycle": graphCycleFrames,
  bipartite: bipartiteFrames,
  subsets: subsetsFrames,
  permutations: permutationsFrames,
  "combination-sum": combinationSumFrames,
  "n-queens": nQueensFrames,
  "sudoku-solver": sudokuSolverFrames,
  "1d-dp": oneDDpFrames,
  "fibonacci-pattern": fibonacciPatternFrames,
  "house-robber": houseRobberFrames,
  "coin-change": coinChangeFrames,
  "2d-dp": twoDDpFrames,
  knapsack: knapsackFrames,
  "lcs-lps": lcsLpsFrames,
  "grid-dp": gridDpFrames,
  lis: lisFrames,
  "subset-sum": subsetSumFrames,
  "partition-equal": partitionEqualFrames,
  "edit-distance": editDistanceFrames,
  "wildcard-matching": wildcardMatchingFrames,
  "palindrome-partition": palindromePartitionFrames,
  "topo-sort": topoSortFrames,
  dijkstra: dijkstraFrames,
  "bellman-ford": bellmanFordFrames,
  "floyd-warshall": floydWarshallFrames,
  mst: mstFrames,
  "dsu-cycle": dsuCycleFrames,
  "dsu-components": dsuComponentsFrames,
  kruskal: kruskalFrames,
  "xor-tricks": xorTricksFrames,
  "missing-number": missingNumberFrames,
  "bit-masking": bitMaskingFrames,
  "subsets-bits": subsetsBitsFrames,
  "trie-insert-search": trieInsertSearchFrames,
  "word-search": wordSearchFrames,
  autocomplete: autocompleteFrames,
  "meet-in-middle": meetInMiddleFrames,
  "window-dp": windowDpFrames,
  "binary-lifting": binaryLiftingFrames,
  "mos-algorithm": mosAlgorithmFrames,
};

export function getDemoFrames(slug: string): Frame[] {
  return registry[slug]?.() ?? [];
}

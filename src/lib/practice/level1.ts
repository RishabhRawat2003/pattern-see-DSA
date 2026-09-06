import type { PracticePack } from "../types";
import { gfg, langs, lc, pack } from "./helpers";
import {
  generateParenthesesSolution,
  permutationsSolution,
  wordSearchSolution,
} from "./solutions/backtrackingIntro";
import {
  capacityToShipPackagesSolution,
  kokoEatingBananasSolution,
  splitArrayLargestSumSolution,
} from "./solutions/binarySearchOnAnswer";
import {
  binarySearchSolution,
  searchInRotatedSortedArraySolution,
  searchInsertPositionSolution,
} from "./solutions/classicBinarySearch";
import {
  findTheDuplicateNumberSolution,
  linkedListCycleDetectSolution,
  linkedListCycleIISolution,
} from "./solutions/cycleDetection";
import {
  carPoolingSolution,
  corporateFlightBookingsSolution,
  zeroArrayTransformationISolution,
} from "./solutions/differenceArray";
import {
  happyNumberSolution as fastSlowHappyNumberSolution,
  linkedListCycleSolution,
  middleOfLinkedListSolution,
} from "./solutions/fastSlowPointer";
import {
  findFirstAndLastPositionSolution,
  firstBadVersionSolution,
  sqrtxSolution,
} from "./solutions/firstLastOccurrence";
import {
  firstUniqueCharacterSolution,
  groupAnagramsSolution as frequencyGroupAnagramsSolution,
  sortCharactersByFrequencySolution,
} from "./solutions/frequencyCounting";
import {
  majorityElementSolution,
  topKFrequentElementsSolution,
  validAnagramSolution,
} from "./solutions/frequencyMap";
import {
  containsDuplicateIISolution,
  containsDuplicateSolution,
  twoSumSolution,
} from "./solutions/hashmapLookup";
import {
  basicCalculatorIISolution,
  evaluateRPNSolution,
  infixToPostfixSolution,
} from "./solutions/infixPrefixPostfix";
import {
  maximumProductSubarraySolution,
  maximumSubarraySolution,
  maximumSumCircularSubarraySolution,
} from "./solutions/kadane";
import {
  firstLastBoundSolution,
  searchInsertBoundSolution,
  smallestLetterGreaterSolution,
} from "./solutions/lowerUpperBound";
import {
  mergeKSortedListsSolution,
  mergeSortedArraySolution,
  mergeTwoSortedListsSolution,
} from "./solutions/mergeLists";
import {
  dailyTemperaturesMonoSolution,
  largestRectangleInHistogramSolution,
  trappingRainWaterSolution,
} from "./solutions/monotonicStack";
import {
  dailyTemperaturesNGESolution,
  nextGreaterElementIISolution,
  nextGreaterElementISolution,
} from "./solutions/nextGreaterElement";
import {
  combinationSumSolution,
  pathSumSolution,
  subsetsSolution,
} from "./solutions/pickNotPick";
import {
  findPivotIndexSolution,
  rangeSumQueryImmutableSolution,
  subarraySumEqualsKSolution,
} from "./solutions/prefixSum";
import {
  invertBinaryTreeSolution,
  maximumDepthOfBinaryTreeSolution,
  symmetricTreeSolution,
} from "./solutions/recursiveTree";
import {
  reverseLinkedListIISolution,
  reverseLinkedListSolution,
  reverseNodesInKGroupSolution,
} from "./solutions/reverseLinkedList";
import {
  containsDuplicateSetSolution,
  happyNumberSolution as setHappyNumberSolution,
  longestConsecutiveSequenceSolution,
} from "./solutions/setDetection";
import {
  longestSubstringWithoutRepeatingSolution,
  maximumAverageSubarrayISolution,
  minimumWindowSubstringSolution,
} from "./solutions/slidingWindow";
import {
  groupAnagramsSolution as sortingGroupAnagramsSolution,
  sortingThreeSumSolution,
  sortingValidAnagramSolution,
} from "./solutions/sortingTricks";
import {
  containerWithMostWaterSolution,
  threeSumSolution,
  twoSumIISolution,
} from "./solutions/twoPointers";
import {
  longestValidParenthesesSolution,
  minAddToMakeValidSolution,
  validParenthesesSolution,
} from "./solutions/validParentheses";

export const level1Practice: Record<string, PracticePack> = {
  "two-pointers": pack(
    "Sorted array, pair/triplet, palindrome, or shrinking from both ends.",
    langs(
      `def two_sum_sorted(a, target):
    lo, hi = 0, len(a) - 1
    while lo < hi:
        s = a[lo] + a[hi]
        if s == target:
            return lo, hi
        if s < target:
            lo += 1
        else:
            hi -= 1
    return None`,
      `pair<int,int> twoSumSorted(vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo < hi) {
        int s = a[lo] + a[hi];
        if (s == target) return {lo, hi};
        if (s < target) lo++;
        else hi--;
    }
    return {-1, -1};
}`,
      `int[] twoSumSorted(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int s = a[lo] + a[hi];
        if (s == target) return new int[]{lo, hi};
        if (s < target) lo++;
        else hi--;
    }
    return new int[]{-1, -1};
}`,
      `function twoSumSorted(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const s = a[lo] + a[hi];
    if (s === target) return [lo, hi];
    if (s < target) lo++;
    else hi--;
  }
  return null;
}`,
    ),
    lc("two-sum-ii-input-array-is-sorted", "Two Sum II", "Medium", twoSumIISolution),
    lc("3sum", "3Sum", "Medium", threeSumSolution),
    lc("container-with-most-water", "Container With Most Water", "Medium", containerWithMostWaterSolution),
  ),
  "sliding-window": pack(
    "Contiguous subarray/substring; expand right, shrink left when a constraint breaks.",
    langs(
      `def max_sum_window(a, k):
    window = sum(a[:k])
    best = window
    for r in range(k, len(a)):
        window += a[r] - a[r - k]
        best = max(best, window)
    return best`,
      `int maxSumWindow(vector<int>& a, int k) {
    int window = accumulate(a.begin(), a.begin() + k, 0), best = window;
    for (int r = k; r < (int)a.size(); r++) {
        window += a[r] - a[r - k];
        best = max(best, window);
    }
    return best;
}`,
      `int maxSumWindow(int[] a, int k) {
    int window = 0;
    for (int i = 0; i < k; i++) window += a[i];
    int best = window;
    for (int r = k; r < a.length; r++) {
        window += a[r] - a[r - k];
        best = Math.max(best, window);
    }
    return best;
}`,
      `function maxSumWindow(a, k) {
  let window = a.slice(0, k).reduce((s, x) => s + x, 0);
  let best = window;
  for (let r = k; r < a.length; r++) {
    window += a[r] - a[r - k];
    best = Math.max(best, window);
  }
  return best;
}`,
    ),
    lc("maximum-average-subarray-i", "Max Average Subarray I", "Easy", maximumAverageSubarrayISolution),
    lc("longest-substring-without-repeating-characters", "Longest Unique Substring", "Medium", longestSubstringWithoutRepeatingSolution),
    lc("minimum-window-substring", "Minimum Window Substring", "Hard", minimumWindowSubstringSolution),
  ),
  "prefix-sum": pack(
    "Many range sums, equilibrium, or subarray sum = k (with a map).",
    langs(
      `def prefix_sum(a):
    pref = [0]
    for x in a:
        pref.append(pref[-1] + x)
    def range_sum(l, r):
        return pref[r + 1] - pref[l]
    return range_sum`,
      `vector<int> prefixSum(vector<int>& a) {
    vector<int> pref(a.size() + 1);
    for (int i = 0; i < (int)a.size(); i++) pref[i + 1] = pref[i] + a[i];
    return pref; // range l..r inclusive: pref[r+1] - pref[l]
}`,
      `int[] prefixSum(int[] a) {
    int[] pref = new int[a.length + 1];
    for (int i = 0; i < a.length; i++) pref[i + 1] = pref[i] + a[i];
    return pref; // range l..r: pref[r+1] - pref[l]
}`,
      `function prefixSum(a) {
  const pref = [0];
  for (const x of a) pref.push(pref[pref.length - 1] + x);
  return (l, r) => pref[r + 1] - pref[l];
}`,
    ),
    lc("range-sum-query-immutable", "Range Sum Query", "Easy", rangeSumQueryImmutableSolution),
    lc("find-pivot-index", "Pivot Index", "Easy", findPivotIndexSolution),
    lc("subarray-sum-equals-k", "Subarray Sum Equals K", "Medium", subarraySumEqualsKSolution),
  ),
  "difference-array": pack(
    "Many range add updates, then one reconstruct via prefix.",
    langs(
      `def range_add(n, updates):
    diff = [0] * (n + 1)
    for l, r, val in updates:
        diff[l] += val
        diff[r + 1] -= val
    out, run = [], 0
    for i in range(n):
        run += diff[i]
        out.append(run)
    return out`,
      `vector<int> rangeAdd(int n, vector<array<int,3>>& updates) {
    vector<int> diff(n + 1);
    for (auto [l, r, val] : updates) { diff[l] += val; diff[r + 1] -= val; }
    vector<int> out(n);
    int run = 0;
    for (int i = 0; i < n; i++) { run += diff[i]; out[i] = run; }
    return out;
}`,
      `int[] rangeAdd(int n, int[][] updates) {
    int[] diff = new int[n + 1];
    for (int[] u : updates) { diff[u[0]] += u[2]; diff[u[1] + 1] -= u[2]; }
    int[] out = new int[n];
    int run = 0;
    for (int i = 0; i < n; i++) { run += diff[i]; out[i] = run; }
    return out;
}`,
      `function rangeAdd(n, updates) {
  const diff = Array(n + 1).fill(0);
  for (const [l, r, val] of updates) { diff[l] += val; diff[r + 1] -= val; }
  const out = [];
  let run = 0;
  for (let i = 0; i < n; i++) { run += diff[i]; out.push(run); }
  return out;
}`,
    ),
    lc("corporate-flight-bookings", "Corporate Flight Bookings", "Medium", corporateFlightBookingsSolution),
    lc("car-pooling", "Car Pooling", "Medium", carPoolingSolution),
    lc("zero-array-transformation-i", "Zero Array Transformation I", "Medium", zeroArrayTransformationISolution),
  ),
  kadane: pack(
    "Maximum contiguous subarray (negatives allowed).",
    langs(
      `def kadane(a):
    best = cur = a[0]
    for x in a[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best`,
      `int kadane(vector<int>& a) {
    int best = a[0], cur = a[0];
    for (int i = 1; i < (int)a.size(); i++) {
        cur = max(a[i], cur + a[i]);
        best = max(best, cur);
    }
    return best;
}`,
      `int kadane(int[] a) {
    int best = a[0], cur = a[0];
    for (int i = 1; i < a.length; i++) {
        cur = Math.max(a[i], cur + a[i]);
        best = Math.max(best, cur);
    }
    return best;
}`,
      `function kadane(a) {
  let best = a[0], cur = a[0];
  for (let i = 1; i < a.length; i++) {
    cur = Math.max(a[i], cur + a[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
    ),
    lc("maximum-subarray", "Maximum Subarray", "Medium", maximumSubarraySolution),
    lc("maximum-product-subarray", "Maximum Product Subarray", "Medium", maximumProductSubarraySolution),
    lc("maximum-sum-circular-subarray", "Maximum Sum Circular", "Medium", maximumSumCircularSubarraySolution),
  ),
  "sorting-tricks": pack(
    "Order is the algorithm: adjacent compare, two pointers after sort, or sort-as-key.",
    langs(
      `def closest_pair(a):
    a = sorted(a)
    best, pair = float("inf"), None
    for i in range(len(a) - 1):
        d = a[i + 1] - a[i]
        if d < best:
            best, pair = d, (a[i], a[i + 1])
    return pair`,
      `pair<int,int> closestPair(vector<int> a) {
    sort(a.begin(), a.end());
    int best = INT_MAX; pair<int,int> ans{-1,-1};
    for (int i = 0; i + 1 < (int)a.size(); i++)
        if (a[i+1] - a[i] < best) { best = a[i+1]-a[i]; ans = {a[i], a[i+1]}; }
    return ans;
}`,
      `int[] closestPair(int[] a) {
    Arrays.sort(a);
    int best = Integer.MAX_VALUE; int[] ans = {-1, -1};
    for (int i = 0; i + 1 < a.length; i++)
        if (a[i+1] - a[i] < best) { best = a[i+1]-a[i]; ans = new int[]{a[i], a[i+1]}; }
    return ans;
}`,
      `function closestPair(a) {
  a = [...a].sort((x, y) => x - y);
  let best = Infinity, pair = null;
  for (let i = 0; i + 1 < a.length; i++) {
    const d = a[i + 1] - a[i];
    if (d < best) { best = d; pair = [a[i], a[i + 1]]; }
  }
  return pair;
}`,
    ),
    lc("valid-anagram", "Valid Anagram", "Easy", sortingValidAnagramSolution),
    lc("group-anagrams", "Group Anagrams", "Medium", sortingGroupAnagramsSolution),
    lc("3sum", "3Sum", "Medium", sortingThreeSumSolution),
  ),
  "frequency-map": pack(
    "Counts first, decisions second. Anagrams, majority, budgets.",
    langs(
      `from collections import Counter
def is_anagram(s, t):
    return Counter(s) == Counter(t)`,
      `bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;
    int c[26] = {};
    for (char ch : s) c[ch - 'a']++;
    for (char ch : t) if (--c[ch - 'a'] < 0) return false;
    return true;
}`,
      `boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] c = new int[26];
    for (char ch : s.toCharArray()) c[ch - 'a']++;
    for (char ch : t.toCharArray()) if (--c[ch - 'a'] < 0) return false;
    return true;
}`,
      `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const c = {};
  for (const ch of s) c[ch] = (c[ch] || 0) + 1;
  for (const ch of t) {
    if (!c[ch]) return false;
    c[ch]--;
  }
  return true;
}`,
    ),
    lc("valid-anagram", "Valid Anagram", "Easy", validAnagramSolution),
    lc("majority-element", "Majority Element", "Easy", majorityElementSolution),
    lc("top-k-frequent-elements", "Top K Frequent", "Medium", topKFrequentElementsSolution),
  ),
  "classic-binary-search": pack(
    "Sorted index space; shrink lo/hi on a mid test.",
    langs(
      `def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target: return mid
        if a[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1`,
      `int binarySearch(vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
      `int binarySearch(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
      `function binarySearch(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    ),
    lc("binary-search", "Binary Search", "Easy", binarySearchSolution),
    lc("search-insert-position", "Search Insert Position", "Easy", searchInsertPositionSolution),
    lc("search-in-rotated-sorted-array", "Search in Rotated Array", "Medium", searchInRotatedSortedArraySolution),
  ),
  "first-last-occurrence": pack(
    "Find leftmost / rightmost true in a monotonic predicate.",
    langs(
      `def first_true(a, pred):
    lo, hi, ans = 0, len(a) - 1, -1
    while lo <= hi:
        mid = (lo + hi) // 2
        if pred(a[mid]):
            ans, hi = mid, mid - 1
        else:
            lo = mid + 1
    return ans`,
      `int firstTrue(vector<int>& a, function<bool(int)> pred) {
    int lo = 0, hi = (int)a.size() - 1, ans = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (pred(a[mid])) { ans = mid; hi = mid - 1; }
        else lo = mid + 1;
    }
    return ans;
}`,
      `int firstTrue(int[] a, IntPredicate pred) {
    int lo = 0, hi = a.length - 1, ans = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (pred.test(a[mid])) { ans = mid; hi = mid - 1; }
        else lo = mid + 1;
    }
    return ans;
}`,
      `function firstTrue(a, pred) {
  let lo = 0, hi = a.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (pred(a[mid])) { ans = mid; hi = mid - 1; }
    else lo = mid + 1;
  }
  return ans;
}`,
    ),
    lc("find-first-and-last-position-of-element-in-sorted-array", "First and Last Position", "Medium", findFirstAndLastPositionSolution),
    lc("first-bad-version", "First Bad Version", "Easy", firstBadVersionSolution),
    lc("sqrtx", "Sqrt(x)", "Easy", sqrtxSolution),
  ),
  "lower-upper-bound": pack(
    "First index >= x (lower) or > x (upper).",
    langs(
      `def lower_bound(a, x):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < x: lo = mid + 1
        else: hi = mid
    return lo`,
      `int lowerBound(vector<int>& a, int x) {
    int lo = 0, hi = (int)a.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < x) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
      `int lowerBound(int[] a, int x) {
    int lo = 0, hi = a.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < x) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
      `function lowerBound(a, x) {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
    ),
    lc("search-insert-position", "Search Insert Position", "Easy", searchInsertBoundSolution),
    lc("find-first-and-last-position-of-element-in-sorted-array", "First and Last Position", "Medium", firstLastBoundSolution),
    lc("find-smallest-letter-greater-than-target", "Smallest Letter GT Target", "Easy", smallestLetterGreaterSolution),
  ),
  "binary-search-on-answer": pack(
    "Answer is numeric and monotonic: can(mid) true ⇒ try smaller (or larger).",
    langs(
      `def min_feasible(lo, hi, can):
    while lo < hi:
        mid = (lo + hi) // 2
        if can(mid): hi = mid
        else: lo = mid + 1
    return lo`,
      `int minFeasible(int lo, int hi, function<bool(int)> can) {
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (can(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
      `int minFeasible(int lo, int hi, IntPredicate can) {
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (can.test(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
      `function minFeasible(lo, hi, can) {
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (can(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    ),
    lc("koko-eating-bananas", "Koko Eating Bananas", "Medium", kokoEatingBananasSolution),
    lc("capacity-to-ship-packages-within-d-days", "Ship Packages", "Medium", capacityToShipPackagesSolution),
    lc("split-array-largest-sum", "Split Array Largest Sum", "Hard", splitArrayLargestSumSolution),
  ),
  "hashmap-lookup": pack(
    "Need a pair/complement in O(1) after one pass.",
    langs(
      `def two_sum(a, target):
    seen = {}
    for i, x in enumerate(a):
        if target - x in seen:
            return seen[target - x], i
        seen[x] = i`,
      `pair<int,int> twoSum(vector<int>& a, int target) {
    unordered_map<int,int> seen;
    for (int i = 0; i < (int)a.size(); i++) {
        if (seen.count(target - a[i])) return {seen[target - a[i]], i};
        seen[a[i]] = i;
    }
    return {-1,-1};
}`,
      `int[] twoSum(int[] a, int target) {
    Map<Integer,Integer> seen = new HashMap<>();
    for (int i = 0; i < a.length; i++) {
        if (seen.containsKey(target - a[i])) return new int[]{seen.get(target - a[i]), i};
        seen.put(a[i], i);
    }
    return new int[]{-1,-1};
}`,
      `function twoSum(a, target) {
  const seen = new Map();
  for (let i = 0; i < a.length; i++) {
    if (seen.has(target - a[i])) return [seen.get(target - a[i]), i];
    seen.set(a[i], i);
  }
}`,
    ),
    lc("two-sum", "Two Sum", "Easy", twoSumSolution),
    lc("contains-duplicate", "Contains Duplicate", "Easy", containsDuplicateSolution),
    lc("contains-duplicate-ii", "Contains Duplicate II", "Easy", containsDuplicateIISolution),
  ),
  "frequency-counting": pack(
    "Histogram of values, then scan the map not the array.",
    langs(
      `from collections import Counter
def top_char(s):
    return Counter(s).most_common(1)[0]`,
      `pair<char,int> topChar(string s) {
    int c[256] = {};
    for (char ch : s) c[(unsigned char)ch]++;
    int best = 0; char who = 0;
    for (int i = 0; i < 256; i++) if (c[i] > best) { best = c[i]; who = (char)i; }
    return {who, best};
}`,
      `Map.Entry<Character,Integer> topChar(String s) {
    int[] c = new int[256];
    for (char ch : s.toCharArray()) c[ch]++;
    int best = 0; char who = 0;
    for (int i = 0; i < 256; i++) if (c[i] > best) { best = c[i]; who = (char)i; }
    return Map.entry(who, best);
}`,
      `function topChar(s) {
  const c = {};
  for (const ch of s) c[ch] = (c[ch] || 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1])[0];
}`,
    ),
    lc("first-unique-character-in-a-string", "First Unique Character", "Easy", firstUniqueCharacterSolution),
    lc("group-anagrams", "Group Anagrams", "Medium", frequencyGroupAnagramsSolution),
    lc("sort-characters-by-frequency", "Sort by Frequency", "Medium", sortCharactersByFrequencySolution),
  ),
  "set-detection": pack(
    "Membership / seen-before: duplicate, cycle of values, consecutive streak.",
    langs(
      `def has_duplicate(a):
    seen = set()
    for x in a:
        if x in seen: return True
        seen.add(x)
    return False`,
      `bool hasDuplicate(vector<int>& a) {
    unordered_set<int> seen;
    for (int x : a) if (!seen.insert(x).second) return true;
    return false;
}`,
      `boolean hasDuplicate(int[] a) {
    Set<Integer> seen = new HashSet<>();
    for (int x : a) if (!seen.add(x)) return true;
    return false;
}`,
      `function hasDuplicate(a) {
  const seen = new Set();
  for (const x of a) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}`,
    ),
    lc("contains-duplicate", "Contains Duplicate", "Easy", containsDuplicateSetSolution),
    lc("happy-number", "Happy Number", "Easy", setHappyNumberSolution),
    lc("longest-consecutive-sequence", "Longest Consecutive Sequence", "Medium", longestConsecutiveSequenceSolution),
  ),
  "fast-slow-pointer": pack(
    "Linked list middle, cycle, or happy-number loop.",
    langs(
      `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast: return True
    return False`,
      `bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
      `boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next; fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
      `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    ),
    lc("linked-list-cycle", "Linked List Cycle", "Easy", linkedListCycleSolution),
    lc("middle-of-the-linked-list", "Middle of Linked List", "Easy", middleOfLinkedListSolution),
    lc("happy-number", "Happy Number", "Easy", fastSlowHappyNumberSolution),
  ),
  "reverse-linked-list": pack(
    "Rewire next to prev; iterate or reverse a window.",
    langs(
      `def reverse_list(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev, cur = cur, nxt
    return prev`,
      `ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *cur = head;
    while (cur) {
        ListNode* nxt = cur->next;
        cur->next = prev;
        prev = cur; cur = nxt;
    }
    return prev;
}`,
      `ListNode reverseList(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode nxt = cur.next;
        cur.next = prev;
        prev = cur; cur = nxt;
    }
    return prev;
}`,
      `function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    const nxt = cur.next;
    cur.next = prev;
    prev = cur; cur = nxt;
  }
  return prev;
}`,
    ),
    lc("reverse-linked-list", "Reverse Linked List", "Easy", reverseLinkedListSolution),
    lc("reverse-linked-list-ii", "Reverse Linked List II", "Medium", reverseLinkedListIISolution),
    lc("reverse-nodes-in-k-group", "Reverse Nodes in k-Group", "Hard", reverseNodesInKGroupSolution),
  ),
  "merge-lists": pack(
    "Two sorted streams; always take the smaller head.",
    langs(
      `def merge_two(a, b):
    dummy = cur = ListNode(0)
    while a and b:
        if a.val <= b.val: cur.next, a = a, a.next
        else: cur.next, b = b, b.next
        cur = cur.next
    cur.next = a or b
    return dummy.next`,
      `ListNode* mergeTwo(ListNode* a, ListNode* b) {
    ListNode dummy(0), *cur = &dummy;
    while (a && b) {
        if (a->val <= b->val) { cur->next = a; a = a->next; }
        else { cur->next = b; b = b->next; }
        cur = cur->next;
    }
    cur->next = a ? a : b;
    return dummy.next;
}`,
      `ListNode mergeTwo(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), cur = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { cur.next = a; a = a.next; }
        else { cur.next = b; b = b.next; }
        cur = cur.next;
    }
    cur.next = a != null ? a : b;
    return dummy.next;
}`,
      `function mergeTwo(a, b) {
  const dummy = { next: null }; let cur = dummy;
  while (a && b) {
    if (a.val <= b.val) { cur.next = a; a = a.next; }
    else { cur.next = b; b = b.next; }
    cur = cur.next;
  }
  cur.next = a || b;
  return dummy.next;
}`,
    ),
    lc("merge-two-sorted-lists", "Merge Two Sorted Lists", "Easy", mergeTwoSortedListsSolution),
    lc("merge-sorted-array", "Merge Sorted Array", "Easy", mergeSortedArraySolution),
    lc("merge-k-sorted-lists", "Merge k Sorted Lists", "Hard", mergeKSortedListsSolution),
  ),
  "cycle-detection": pack(
    "Floyd: meet in the loop, then one pointer at head to find entrance.",
    langs(
      `def cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            slow = head
            while slow is not fast:
                slow, fast = slow.next, fast.next
            return slow
    return None`,
      `ListNode* cycleStart(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
        if (slow == fast) {
            slow = head;
            while (slow != fast) { slow = slow->next; fast = fast->next; }
            return slow;
        }
    }
    return nullptr;
}`,
      `ListNode cycleStart(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next; fast = fast.next.next;
        if (slow == fast) {
            slow = head;
            while (slow != fast) { slow = slow.next; fast = fast.next; }
            return slow;
        }
    }
    return null;
}`,
      `function cycleStart(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next;
    if (slow === fast) {
      slow = head;
      while (slow !== fast) { slow = slow.next; fast = fast.next; }
      return slow;
    }
  }
  return null;
}`,
    ),
    lc("linked-list-cycle", "Linked List Cycle", "Easy", linkedListCycleDetectSolution),
    lc("linked-list-cycle-ii", "Linked List Cycle II", "Medium", linkedListCycleIISolution),
    lc("find-the-duplicate-number", "Find the Duplicate Number", "Medium", findTheDuplicateNumberSolution),
  ),
  "valid-parentheses": pack(
    "Stack of openers; closer must match the top.",
    langs(
      `def is_valid(s):
    pair = {")": "(", "]": "[", "}": "{"}
    st = []
    for ch in s:
        if ch in pair:
            if not st or st.pop() != pair[ch]: return False
        else:
            st.append(ch)
    return not st`,
      `bool isValid(string s) {
    string st;
    for (char ch : s) {
        if (ch == '(' || ch == '[' || ch == '{') st.push_back(ch);
        else {
            if (st.empty()) return false;
            char o = st.back(); st.pop_back();
            if ((ch==')' && o!='(') || (ch==']' && o!='[') || (ch=='}' && o!='{')) return false;
        }
    }
    return st.empty();
}`,
      `boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char ch : s.toCharArray()) {
        if (ch == '(' || ch == '[' || ch == '{') st.push(ch);
        else {
            if (st.isEmpty()) return false;
            char o = st.pop();
            if ((ch==')' && o!='(') || (ch==']' && o!='[') || (ch=='}' && o!='{')) return false;
        }
    }
    return st.isEmpty();
}`,
      `function isValid(s) {
  const pair = { ")": "(", "]": "[", "}": "{" };
  const st = [];
  for (const ch of s) {
    if (ch in pair) {
      if (!st.length || st.pop() !== pair[ch]) return false;
    } else st.push(ch);
  }
  return st.length === 0;
}`,
    ),
    lc("valid-parentheses", "Valid Parentheses", "Easy", validParenthesesSolution),
    lc("minimum-add-to-make-parentheses-valid", "Min Add to Valid", "Medium", minAddToMakeValidSolution),
    lc("longest-valid-parentheses", "Longest Valid Parentheses", "Hard", longestValidParenthesesSolution),
  ),
  "infix-prefix-postfix": pack(
    "Shunting-yard / stack: operators wait for precedence.",
    langs(
      `def eval_rpn(tokens):
    st = []
    for t in tokens:
        if t in "+-*/":
            b, a = st.pop(), st.pop()
            st.append({"+": a+b, "-": a-b, "*": a*b, "/": int(a/b)}[t])
        else:
            st.append(int(t))
    return st[-1]`,
      `int evalRpn(vector<string>& tokens) {
    vector<long> st;
    for (auto& t : tokens) {
        if (t=="+"||t=="-"||t=="*"||t=="/") {
            long b = st.back(); st.pop_back(); long a = st.back(); st.pop_back();
            if (t=="+") st.push_back(a+b);
            else if (t=="-") st.push_back(a-b);
            else if (t=="*") st.push_back(a*b);
            else st.push_back(a/b);
        } else st.push_back(stol(t));
    }
    return (int)st.back();
}`,
      `int evalRpn(String[] tokens) {
    Deque<Long> st = new ArrayDeque<>();
    for (String t : tokens) {
        if ("+-*/".contains(t) && t.length()==1) {
            long b = st.pop(), a = st.pop();
            if (t.equals("+")) st.push(a+b);
            else if (t.equals("-")) st.push(a-b);
            else if (t.equals("*")) st.push(a*b);
            else st.push(a/b);
        } else st.push(Long.parseLong(t));
    }
    return st.pop().intValue();
}`,
      `function evalRpn(tokens) {
  const st = [];
  for (const t of tokens) {
    if ("+-*/".includes(t) && t.length === 1) {
      const b = st.pop(), a = st.pop();
      if (t === "+") st.push(a + b);
      else if (t === "-") st.push(a - b);
      else if (t === "*") st.push(a * b);
      else st.push(Math.trunc(a / b));
    } else st.push(Number(t));
  }
  return st.at(-1);
}`,
    ),
    lc("evaluate-reverse-polish-notation", "Evaluate RPN", "Medium", evaluateRPNSolution),
    gfg("convert-infix-expression-to-postfix-expression", "Infix to Postfix", "Medium", infixToPostfixSolution),
    lc("basic-calculator-ii", "Basic Calculator II", "Medium", basicCalculatorIISolution),
  ),
  "next-greater-element": pack(
    "Monotonic decreasing stack of indices; pop when a bigger value arrives.",
    langs(
      `def next_greater(a):
    nge = [-1] * len(a)
    st = []
    for i, x in enumerate(a):
        while st and a[st[-1]] < x:
            nge[st.pop()] = x
        st.append(i)
    return nge`,
      `vector<int> nextGreater(vector<int>& a) {
    vector<int> nge(a.size(), -1), st;
    for (int i = 0; i < (int)a.size(); i++) {
        while (!st.empty() && a[st.back()] < a[i]) { nge[st.back()] = a[i]; st.pop_back(); }
        st.push_back(i);
    }
    return nge;
}`,
      `int[] nextGreater(int[] a) {
    int[] nge = new int[a.length];
    Arrays.fill(nge, -1);
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < a.length; i++) {
        while (!st.isEmpty() && a[st.peek()] < a[i]) nge[st.pop()] = a[i];
        st.push(i);
    }
    return nge;
}`,
      `function nextGreater(a) {
  const nge = Array(a.length).fill(-1), st = [];
  for (let i = 0; i < a.length; i++) {
    while (st.length && a[st.at(-1)] < a[i]) nge[st.pop()] = a[i];
    st.push(i);
  }
  return nge;
}`,
    ),
    lc("next-greater-element-i", "Next Greater Element I", "Easy", nextGreaterElementISolution),
    lc("daily-temperatures", "Daily Temperatures", "Medium", dailyTemperaturesNGESolution),
    lc("next-greater-element-ii", "Next Greater Element II", "Medium", nextGreaterElementIISolution),
  ),
  "monotonic-stack": pack(
    "Next smaller/greater, histogram, trapping rain — stack stays sorted.",
    langs(
      `def daily_temperatures(t):
    ans, st = [0] * len(t), []
    for i, x in enumerate(t):
        while st and t[st[-1]] < x:
            j = st.pop(); ans[j] = i - j
        st.append(i)
    return ans`,
      `vector<int> dailyTemperatures(vector<int>& t) {
    vector<int> ans(t.size()), st;
    for (int i = 0; i < (int)t.size(); i++) {
        while (!st.empty() && t[st.back()] < t[i]) {
            int j = st.back(); st.pop_back(); ans[j] = i - j;
        }
        st.push_back(i);
    }
    return ans;
}`,
      `int[] dailyTemperatures(int[] t) {
    int[] ans = new int[t.length];
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < t.length; i++) {
        while (!st.isEmpty() && t[st.peek()] < t[i]) {
            int j = st.pop(); ans[j] = i - j;
        }
        st.push(i);
    }
    return ans;
}`,
      `function dailyTemperatures(t) {
  const ans = Array(t.length).fill(0), st = [];
  for (let i = 0; i < t.length; i++) {
    while (st.length && t[st.at(-1)] < t[i]) {
      const j = st.pop(); ans[j] = i - j;
    }
    st.push(i);
  }
  return ans;
}`,
    ),
    lc("daily-temperatures", "Daily Temperatures", "Medium", dailyTemperaturesMonoSolution),
    lc("largest-rectangle-in-histogram", "Largest Rectangle", "Hard", largestRectangleInHistogramSolution),
    lc("trapping-rain-water", "Trapping Rain Water", "Hard", trappingRainWaterSolution),
  ),
  "pick-not-pick": pack(
    "At index i: take it (and recurse) or skip it. Undo after take.",
    langs(
      `def subsets(nums):
    out, path = [], []
    def dfs(i):
        if i == len(nums):
            out.append(path[:]); return
        dfs(i + 1)
        path.append(nums[i]); dfs(i + 1); path.pop()
    dfs(0)
    return out`,
      `void dfs(int i, vector<int>& nums, vector<int>& path, vector<vector<int>>& out) {
    if (i == (int)nums.size()) { out.push_back(path); return; }
    dfs(i + 1, nums, path, out);
    path.push_back(nums[i]); dfs(i + 1, nums, path, out); path.pop_back();
}`,
      `void dfs(int i, int[] nums, List<Integer> path, List<List<Integer>> out) {
    if (i == nums.length) { out.add(new ArrayList<>(path)); return; }
    dfs(i + 1, nums, path, out);
    path.add(nums[i]); dfs(i + 1, nums, path, out); path.remove(path.size() - 1);
}`,
      `function subsets(nums) {
  const out = [], path = [];
  function dfs(i) {
    if (i === nums.length) { out.push([...path]); return; }
    dfs(i + 1);
    path.push(nums[i]); dfs(i + 1); path.pop();
  }
  dfs(0);
  return out;
}`,
    ),
    lc("subsets", "Subsets", "Medium", subsetsSolution),
    lc("combination-sum", "Combination Sum", "Medium", combinationSumSolution),
    lc("path-sum", "Path Sum", "Easy", pathSumSolution),
  ),
  "recursive-tree": pack(
    "Answer for a node = combine left and right recursive answers.",
    langs(
      `def max_depth(root):
    if not root: return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
      `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
      `int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    ),
    lc("maximum-depth-of-binary-tree", "Max Depth", "Easy", maximumDepthOfBinaryTreeSolution),
    lc("invert-binary-tree", "Invert Binary Tree", "Easy", invertBinaryTreeSolution),
    lc("symmetric-tree", "Symmetric Tree", "Easy", symmetricTreeSolution),
  ),
  "backtracking-intro": pack(
    "Choose, recurse, undo. Build a path until a complete/valid state.",
    langs(
      `def permute(nums):
    out, used = [], [False] * len(nums)
    def dfs(path):
        if len(path) == len(nums):
            out.append(path[:]); return
        for i, x in enumerate(nums):
            if used[i]: continue
            used[i] = True; path.append(x)
            dfs(path)
            path.pop(); used[i] = False
    dfs([])
    return out`,
      `void dfs(vector<int>& nums, vector<int>& path, vector<int>& used, vector<vector<int>>& out) {
    if (path.size() == nums.size()) { out.push_back(path); return; }
    for (int i = 0; i < (int)nums.size(); i++) {
        if (used[i]) continue;
        used[i] = 1; path.push_back(nums[i]);
        dfs(nums, path, used, out);
        path.pop_back(); used[i] = 0;
    }
}`,
      `void dfs(int[] nums, List<Integer> path, boolean[] used, List<List<Integer>> out) {
    if (path.size() == nums.length) { out.add(new ArrayList<>(path)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true; path.add(nums[i]);
        dfs(nums, path, used, out);
        path.remove(path.size() - 1); used[i] = false;
    }
}`,
      `function permute(nums) {
  const out = [], used = Array(nums.length).fill(false);
  function dfs(path) {
    if (path.length === nums.length) { out.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      dfs(path);
      path.pop(); used[i] = false;
    }
  }
  dfs([]);
  return out;
}`,
    ),
    lc("permutations", "Permutations", "Medium", permutationsSolution),
    lc("generate-parentheses", "Generate Parentheses", "Medium", generateParenthesesSolution),
    lc("word-search", "Word Search", "Medium", wordSearchSolution),
  ),
};

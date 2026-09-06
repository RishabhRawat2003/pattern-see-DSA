import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

export const corporateFlightBookingsSolution: ProblemSolution = {
  approach:
    "Difference array: for each booking [L,R,seats] do diff[L−1]+=seats, diff[R]−=seats; prefix once to get seats per flight. O(n+m).",
  templates: langs(
    `def corpFlightBookings(bookings, n):
    diff = [0] * (n + 1)
    for first, last, seats in bookings:
        diff[first - 1] += seats
        diff[last] -= seats
    out, run = [], 0
    for i in range(n):
        run += diff[i]
        out.append(run)
    return out`,
    `vector<int> corpFlightBookings(vector<vector<int>>& bookings, int n) {
    vector<int> diff(n + 1);
    for (auto& b : bookings) {
        diff[b[0] - 1] += b[2];
        diff[b[1]] -= b[2];
    }
    vector<int> out(n);
    int run = 0;
    for (int i = 0; i < n; i++) { run += diff[i]; out[i] = run; }
    return out;
}`,
    `int[] corpFlightBookings(int[][] bookings, int n) {
    int[] diff = new int[n + 1];
    for (int[] b : bookings) {
        diff[b[0] - 1] += b[2];
        diff[b[1]] -= b[2];
    }
    int[] out = new int[n];
    int run = 0;
    for (int i = 0; i < n; i++) { run += diff[i]; out[i] = run; }
    return out;
}`,
    `function corpFlightBookings(bookings, n) {
  const diff = Array(n + 1).fill(0);
  for (const [first, last, seats] of bookings) {
    diff[first - 1] += seats;
    diff[last] -= seats;
  }
  const out = [];
  let run = 0;
  for (let i = 0; i < n; i++) { run += diff[i]; out.push(run); }
  return out;
}`,
  ),
  frames: (() => {
    const n = 5;
    const diff = Array(n + 1).fill(0);
    const frames = [
      arrayFrame(
        "n = 5 flights, empty diff",
        "Booking [first,last,seats] → +seats at first−1, −seats at last (0-based).",
        Array(n).fill(0),
        {},
        { note: "diff[0..4] shown" },
      ),
    ];
    const apply = (title: string, caption: string, L: number, R: number, seats: number) => {
      diff[L] += seats;
      diff[R + 1] -= seats;
      const tone: Record<number, "update"> = { [L]: "update" };
      if (R + 1 < n) tone[R + 1] = "update";
      frames.push(
        arrayFrame(title, caption, diff.slice(0, n), tone, {
          note: `+${seats} @${L}, −${seats} @${R + 1}`,
        }),
      );
    };
    // bookings: [1,2,10], [2,3,20], [2,5,25] → 0-based ranges [0,1], [1,2], [1,4]
    apply("Booking [1,2] += 10", "Mark +10 at flight 1 (idx 0), −10 after flight 2.", 0, 1, 10);
    apply("Booking [2,3] += 20", "Mark +20 at flight 2 (idx 1), −20 after flight 3.", 1, 2, 20);
    apply("Booking [2,5] += 25", "Mark +25 at flight 2 (idx 1), −25 after flight 5.", 1, 4, 25);

    const out: number[] = [];
    let run = 0;
    for (let i = 0; i < n; i++) {
      run += diff[i];
      out.push(run);
      frames.push(
        arrayFrame(
          `Prefix → flight ${i + 1}`,
          `Running sum = ${run}. That is the final seat count for this flight.`,
          [...out, ...Array(n - out.length).fill("·")],
          { [i]: "active" },
          {
            pointers: [{ name: "i", index: i, color: PTR.M }],
            note: `answer so far [${out.join(", ")}]`,
          },
        ),
      );
    }
    frames.push(
      arrayFrame(
        "Answer",
        "Seats per flight: [10, 55, 45, 25, 25].",
        out,
        { 0: "match", 1: "match", 2: "match", 3: "match", 4: "match" },
      ),
    );
    return frames;
  })(),
};

export const carPoolingSolution: ProblemSolution = {
  approach:
    "Difference array on the timeline: +passengers at from, −passengers at to; scan prefix — fail if load ever exceeds capacity. O(n + maxLoc).",
  templates: langs(
    `def carPooling(trips, capacity):
    diff = [0] * 1001
    for num, frm, to in trips:
        diff[frm] += num
        diff[to] -= num
    load = 0
    for x in diff:
        load += x
        if load > capacity:
            return False
    return True`,
    `bool carPooling(vector<vector<int>>& trips, int capacity) {
    vector<int> diff(1001);
    for (auto& t : trips) { diff[t[1]] += t[0]; diff[t[2]] -= t[0]; }
    int load = 0;
    for (int x : diff) {
        load += x;
        if (load > capacity) return false;
    }
    return true;
}`,
    `boolean carPooling(int[][] trips, int capacity) {
    int[] diff = new int[1001];
    for (int[] t : trips) { diff[t[1]] += t[0]; diff[t[2]] -= t[0]; }
    int load = 0;
    for (int x : diff) {
        load += x;
        if (load > capacity) return false;
    }
    return true;
}`,
    `function carPooling(trips, capacity) {
  const diff = Array(1001).fill(0);
  for (const [num, frm, to] of trips) {
    diff[frm] += num;
    diff[to] -= num;
  }
  let load = 0;
  for (const x of diff) {
    load += x;
    if (load > capacity) return false;
  }
  return true;
}`,
  ),
  frames: (() => {
    // trips = [[2,1,5],[3,3,7]], capacity = 4 — should be false
    // Use locations 0..7 for clarity
    const locs = [0, 1, 2, 3, 4, 5, 6, 7];
    const diff = Array(8).fill(0);
    const frames = [
      arrayFrame(
        "Capacity 4 · trips [2,1→5] and [3,3→7]",
        "+passengers at pickup, − at dropoff. Prefix must never exceed capacity.",
        locs.map(() => 0),
        {},
        { note: "diff on locations 0…7" },
      ),
    ];
    diff[1] += 2;
    diff[5] -= 2;
    frames.push(
      arrayFrame(
        "Trip A: +2 @1, −2 @5",
        "Two passengers ride from location 1 to 5.",
        diff,
        { 1: "update", 5: "update" },
        { note: "capacity = 4" },
      ),
    );
    diff[3] += 3;
    diff[7] -= 3;
    frames.push(
      arrayFrame(
        "Trip B: +3 @3, −3 @7",
        "Three more board at 3. Overlap with A may breach capacity.",
        diff,
        { 3: "update", 7: "update" },
      ),
    );
    let load = 0;
    for (let i = 0; i < diff.length; i++) {
      load += diff[i];
      const over = load > 4;
      frames.push(
        arrayFrame(
          `Location ${i}, load = ${load}`,
          over
            ? `Load ${load} > capacity 4 — impossible.`
            : `Load ${load} ≤ 4. Continue.`,
          diff.map((_, j) => (j <= i ? load : "·")),
          { [i]: over ? "hi" : "active" },
          {
            pointers: [{ name: "loc", index: i, color: over ? PTR.R : PTR.M }],
            note: over ? "return false" : `load ${load}`,
          },
        ),
      );
      if (over) break;
    }
    frames.push(
      arrayFrame(
        "Answer",
        "At location 3 the car would hold 5 > 4. Return false.",
        [0, 2, 2, 5, 5, 3, 3, 0],
        { 3: "hi" },
        { note: "false" },
      ),
    );
    return frames;
  })(),
};

export const zeroArrayTransformationISolution: ProblemSolution = {
  approach:
    "Difference array of allowed decrements from queries; after prefix, nums[i] is zeroable iff coverage[i] ≥ nums[i]. O(n+q).",
  templates: langs(
    `def isZeroArray(nums, queries):
    n = len(nums)
    diff = [0] * (n + 1)
    for l, r in queries:
        diff[l] += 1
        diff[r + 1] -= 1
    cover = 0
    for i in range(n):
        cover += diff[i]
        if cover < nums[i]:
            return False
    return True`,
    `bool isZeroArray(vector<int>& nums, vector<vector<int>>& queries) {
    int n = nums.size();
    vector<int> diff(n + 1);
    for (auto& q : queries) { diff[q[0]]++; diff[q[1] + 1]--; }
    int cover = 0;
    for (int i = 0; i < n; i++) {
        cover += diff[i];
        if (cover < nums[i]) return false;
    }
    return true;
}`,
    `boolean isZeroArray(int[] nums, int[][] queries) {
    int n = nums.length;
    int[] diff = new int[n + 1];
    for (int[] q : queries) { diff[q[0]]++; diff[q[1] + 1]--; }
    int cover = 0;
    for (int i = 0; i < n; i++) {
        cover += diff[i];
        if (cover < nums[i]) return false;
    }
    return true;
}`,
    `function isZeroArray(nums, queries) {
  const n = nums.length;
  const diff = Array(n + 1).fill(0);
  for (const [l, r] of queries) {
    diff[l]++;
    diff[r + 1]--;
  }
  let cover = 0;
  for (let i = 0; i < n; i++) {
    cover += diff[i];
    if (cover < nums[i]) return false;
  }
  return true;
}`,
  ),
  frames: (() => {
    const nums = [1, 0, 1];
    const diff = [0, 0, 0, 0];
    const frames = [
      arrayFrame(
        "nums = [1,0,1], queries = [[0,2]]",
        "Each query can decrement every index in [L,R] once. Diff counts how many queries cover i.",
        nums,
        {},
        { note: "need cover[i] ≥ nums[i]" },
      ),
    ];
    diff[0] += 1;
    diff[3] -= 1;
    frames.push(
      arrayFrame(
        "Apply query [0,2]",
        "+1 at 0, −1 at 3 on the difference array.",
        diff.slice(0, 3),
        { 0: "update" },
        { note: "diff = [1, 0, 0] (−1 past end)" },
      ),
    );
    let cover = 0;
    const covers: number[] = [];
    for (let i = 0; i < nums.length; i++) {
      cover += diff[i];
      covers.push(cover);
      const ok = cover >= nums[i];
      frames.push(
        arrayFrame(
          `Index ${i}: cover ${cover} vs nums ${nums[i]}`,
          ok
            ? `Coverage ${cover} ≥ ${nums[i]} — can zero this cell.`
            : `Coverage ${cover} < ${nums[i]} — impossible.`,
          nums,
          { [i]: ok ? "match" : "hi" },
          {
            pointers: [{ name: "i", index: i, color: PTR.M }],
            note: `cover = [${covers.join(", ")}]`,
          },
        ),
      );
    }
    frames.push(
      arrayFrame(
        "Answer",
        "Every index is covered enough times. Return true.",
        nums,
        { 0: "match", 1: "match", 2: "match" },
        { note: "true" },
      ),
    );
    return frames;
  })(),
};

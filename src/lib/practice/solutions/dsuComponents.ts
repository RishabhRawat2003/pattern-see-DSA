import { arrayFrame, PTR } from "../../demos/problems/helpers";
import type { CellTone, Frame, TreeNode } from "../../types";
import type { ProblemSolution } from "../helpers";
import { langs } from "../helpers";

function dsuNodes(
  parents: number[],
  tones: Record<number, CellTone> = {},
  labels?: string[],
): TreeNode[] {
  const pos = [
    { x: 18, y: 40 },
    { x: 40, y: 40 },
    { x: 62, y: 40 },
    { x: 84, y: 40 },
  ];
  return parents.map((p, i) => {
    const id = i;
    return {
      id: String(id),
      label: labels?.[i] ?? `${id}→${p}`,
      x: pos[i]?.x ?? 50,
      y: pos[i]?.y ?? 40,
      tone: tones[id] ?? "idle",
    };
  });
}

function dsuEdges(parents: number[]): NonNullable<Frame["treeEdges"]> {
  return parents
    .map((p, i) => {
      const from = String(i);
      const to = String(p);
      if (from === to) return null;
      return { from, to, tone: "window" as CellTone };
    })
    .filter(Boolean) as NonNullable<Frame["treeEdges"]>;
}

function numberOfProvincesDsuFrames(): Frame[] {
  return [
    {
      kind: "tree",
      title: "n singleton sets",
      caption: "Each city starts as its own component. count = n.",
      treeNodes: dsuNodes([0, 1, 2, 3]),
      treeEdges: [],
      note: "count = 4",
    },
    {
      kind: "tree",
      title: "Union isConnected",
      caption: "For i<j with isConnected[i][j]=1, union i and j; decrement count on success.",
      treeNodes: dsuNodes([0, 0, 2, 3], { 0: "window", 1: "window" }),
      treeEdges: dsuEdges([0, 0, 2, 3]),
      note: "count = 3",
    },
    {
      kind: "tree",
      title: "Chain 0–1–2",
      caption: "Union 1–2 merges into root 0. One province for {0,1,2}.",
      treeNodes: dsuNodes([0, 0, 0, 3], { 0: "lo", 1: "lo", 2: "lo" }),
      treeEdges: dsuEdges([0, 0, 0, 3]),
      note: "count = 2",
    },
    {
      kind: "tree",
      title: "City 3 alone",
      caption: "No edge to 3. Two provinces remain — that is the answer.",
      treeNodes: dsuNodes([0, 0, 0, 3], { 0: "done", 1: "done", 2: "done", 3: "match" }),
      treeEdges: dsuEdges([0, 0, 0, 3]),
      note: "provinces = 2",
    },
    arrayFrame(
      "Matrix scan",
      "Only need upper triangle i<j. Same result as DFS component counting.",
      [1, 1, 0, 0],
      { 0: "match", 1: "window" },
      {
        pointers: [{ name: "i", index: 0, color: PTR.L }],
        note: "row friendships",
      },
    ),
  ];
}

function equalityEquationsFrames(): Frame[] {
  const letters = ["a", "b", "c", "d"];
  return [
    {
      kind: "tree",
      title: "== then !=",
      caption: "First union all a==b equations. Then verify no a!=b shares a root.",
      treeNodes: dsuNodes([0, 1, 2, 3], {}, letters),
      treeEdges: [],
      note: "26 letters",
    },
    {
      kind: "tree",
      title: "Union equals",
      caption: "a==b and b==c ⇒ a,b,c same component.",
      treeNodes: dsuNodes([0, 0, 0, 3], { 0: "lo", 1: "lo", 2: "lo" }, letters),
      treeEdges: dsuEdges([0, 0, 0, 3]),
      note: "a=b=c",
    },
    {
      kind: "tree",
      title: "Check inequalities",
      caption: "a!=c would fail (same root). a!=d is fine (different roots).",
      treeNodes: dsuNodes([0, 0, 0, 3], { 0: "match", 2: "match", 3: "hi" }, letters),
      treeEdges: [
        ...dsuEdges([0, 0, 0, 3]),
        { from: "0", to: "2", dashed: true, tone: "skip" },
      ],
      note: "a!=c → false",
    },
    arrayFrame(
      "Two-pass",
      "Pass 1: all '=='. Pass 2: all '!='. Return false on first conflicting !=.",
      ["a==b", "b==c", "a!=c"],
      { 2: "skip" },
      { note: "unsatisfiable" },
    ),
    {
      kind: "tree",
      title: "Satisfiable case",
      caption: "If every != pairs distinct roots, return true.",
      treeNodes: dsuNodes([0, 0, 0, 3], { 0: "done", 1: "done", 2: "done", 3: "match" }, letters),
      treeEdges: dsuEdges([0, 0, 0, 3]),
      note: "a!=d ok → true",
    },
  ];
}

function accountsMergeFrames(): Frame[] {
  return [
    arrayFrame(
      "Accounts list",
      "Each account: name + emails. Merge accounts that share any email.",
      ["A:a@x", "A:b@x", "B:c@x"],
      { 0: "lo", 1: "window" },
      { note: "same person?" },
    ),
    {
      kind: "tree",
      title: "Email → DSU id",
      caption: "Map each email to the account index that first saw it. Shared email ⇒ union indices.",
      treeNodes: [
        { id: "0", label: "acc0", x: 25, y: 40, tone: "lo" },
        { id: "1", label: "acc1", x: 55, y: 40, tone: "lo" },
        { id: "2", label: "acc2", x: 85, y: 40, tone: "idle" },
      ],
      treeEdges: [{ from: "1", to: "0", tone: "window" }],
      note: "share a@x",
    },
    {
      kind: "tree",
      title: "Components = people",
      caption: "Root of each account index is one merged person. Collect emails under that root.",
      treeNodes: [
        { id: "0", label: "root", x: 40, y: 28, tone: "match" },
        { id: "1", label: "acc1", x: 25, y: 65, tone: "done" },
        { id: "2", label: "acc2", x: 70, y: 65, tone: "hi" },
      ],
      treeEdges: [
        { from: "1", to: "0", tone: "match" },
      ],
      note: "2 people",
    },
    arrayFrame(
      "Sort emails",
      "For each root, sort emails lexically; prepend the account name once.",
      ["John", "a@x", "b@x"],
      { 0: "lo", 1: "match", 2: "match" },
      {
        pointers: [{ name: "root", index: 0, color: PTR.M }],
        note: "merged row",
      },
    ),
    arrayFrame(
      "Output accounts",
      "One row per DSU root that owns emails. Order of rows can be any.",
      [2],
      { 0: "match" },
      { note: "2 merged accounts" },
    ),
  ];
}

export const numberOfProvincesDsuSolution: ProblemSolution = {
  approach:
    "DSU over n cities. Union i and j whenever isConnected[i][j]=1 (i<j). Start count=n; decrement on each successful union. Final count is provinces. O(n² α(n)).",
  templates: langs(
    `def findCircleNum(isConnected):
    n = len(isConnected)
    p = list(range(n))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]; x = p[x]
        return x
    count = n
    for i in range(n):
        for j in range(i + 1, n):
            if isConnected[i][j]:
                ri, rj = find(i), find(j)
                if ri != rj:
                    p[rj] = ri; count -= 1
    return count`,
    `int findCircleNum(vector<vector<int>>& isConnected) {
    int n = isConnected.size();
    vector<int> p(n);
    iota(p.begin(), p.end(), 0);
    auto find = [&](int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    int count = n;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (isConnected[i][j]) {
                int ri = find(i), rj = find(j);
                if (ri != rj) { p[rj] = ri; count--; }
            }
    return count;
}`,
    `int findCircleNum(int[][] isConnected) {
    int n = isConnected.length;
    int[] p = new int[n];
    for (int i = 0; i < n; i++) p[i] = i;
    java.util.function.IntUnaryOperator find = x -> {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    int count = n;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (isConnected[i][j] == 1) {
                int ri = find.applyAsInt(i), rj = find.applyAsInt(j);
                if (ri != rj) { p[rj] = ri; count--; }
            }
    return count;
}`,
    `function findCircleNum(isConnected) {
  const n = isConnected.length;
  const p = [...Array(n).keys()];
  const find = (x) => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
  let count = n;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (isConnected[i][j]) {
        const ri = find(i), rj = find(j);
        if (ri !== rj) { p[rj] = ri; count--; }
      }
  return count;
}`,
  ),
  frames: numberOfProvincesDsuFrames(),
};

export const equalityEquationsSolution: ProblemSolution = {
  approach:
    "Map letters a–z to 0–25. Union endpoints of every '==' equation. Then for each '!=' equation, if find(a)==find(b) return false. Otherwise true. O(n α(26)).",
  templates: langs(
    `def equationsPossible(equations):
    p = list(range(26))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]; x = p[x]
        return x
    for eq in equations:
        if eq[1] == '=':
            a, b = ord(eq[0]) - 97, ord(eq[3]) - 97
            p[find(b)] = find(a)
    for eq in equations:
        if eq[1] == '!':
            a, b = ord(eq[0]) - 97, ord(eq[3]) - 97
            if find(a) == find(b): return False
    return True`,
    `bool equationsPossible(vector<string>& equations) {
    vector<int> p(26);
    iota(p.begin(), p.end(), 0);
    auto find = [&](int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    for (auto& eq : equations)
        if (eq[1] == '=') p[find(eq[0]-'a')] = find(eq[3]-'a');
    for (auto& eq : equations)
        if (eq[1] == '!' && find(eq[0]-'a') == find(eq[3]-'a')) return false;
    return true;
}`,
    `boolean equationsPossible(String[] equations) {
    int[] p = new int[26];
    for (int i = 0; i < 26; i++) p[i] = i;
    java.util.function.IntUnaryOperator find = x -> {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    for (String eq : equations)
        if (eq.charAt(1) == '=')
            p[find.applyAsInt(eq.charAt(0) - 'a')] = find.applyAsInt(eq.charAt(3) - 'a');
    for (String eq : equations)
        if (eq.charAt(1) == '!'
            && find.applyAsInt(eq.charAt(0) - 'a') == find.applyAsInt(eq.charAt(3) - 'a'))
            return false;
    return true;
}`,
    `function equationsPossible(equations) {
  const p = [...Array(26).keys()];
  const find = (x) => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
  for (const eq of equations)
    if (eq[1] === '=') p[find(eq.charCodeAt(0) - 97)] = find(eq.charCodeAt(3) - 97);
  for (const eq of equations)
    if (eq[1] === '!' && find(eq.charCodeAt(0) - 97) === find(eq.charCodeAt(3) - 97))
      return false;
  return true;
}`,
  ),
  frames: equalityEquationsFrames(),
};

export const accountsMergeSolution: ProblemSolution = {
  approach:
    "DSU on account indices. Map email→first account id; when an email repeats, union the two accounts. Group emails by find(account), sort, prepend name. O(A log A) for sorting emails.",
  templates: langs(
    `from collections import defaultdict

def accountsMerge(accounts):
    n = len(accounts)
    p = list(range(n))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]; x = p[x]
        return x
    email_to_id = {}
    for i, acc in enumerate(accounts):
        for email in acc[1:]:
            if email in email_to_id:
                p[find(i)] = find(email_to_id[email])
            else:
                email_to_id[email] = i
    groups = defaultdict(list)
    for email, i in email_to_id.items():
        groups[find(i)].append(email)
    return [[accounts[i][0]] + sorted(emails) for i, emails in groups.items()]`,
    `vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
    int n = accounts.size();
    vector<int> p(n);
    iota(p.begin(), p.end(), 0);
    auto find = [&](int x) {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    unordered_map<string,int> emailToId;
    for (int i = 0; i < n; i++)
        for (int j = 1; j < (int)accounts[i].size(); j++) {
            string& e = accounts[i][j];
            if (emailToId.count(e)) p[find(i)] = find(emailToId[e]);
            else emailToId[e] = i;
        }
    unordered_map<int, vector<string>> groups;
    for (auto& [e, i] : emailToId) groups[find(i)].push_back(e);
    vector<vector<string>> ans;
    for (auto& [i, emails] : groups) {
        sort(emails.begin(), emails.end());
        vector<string> row{accounts[i][0]};
        row.insert(row.end(), emails.begin(), emails.end());
        ans.push_back(row);
    }
    return ans;
}`,
    `List<List<String>> accountsMerge(List<List<String>> accounts) {
    int n = accounts.size();
    int[] p = new int[n];
    for (int i = 0; i < n; i++) p[i] = i;
    java.util.function.IntUnaryOperator find = x -> {
        while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; } return x;
    };
    Map<String, Integer> emailToId = new HashMap<>();
    for (int i = 0; i < n; i++)
        for (int j = 1; j < accounts.get(i).size(); j++) {
            String e = accounts.get(i).get(j);
            if (emailToId.containsKey(e))
                p[find.applyAsInt(i)] = find.applyAsInt(emailToId.get(e));
            else emailToId.put(e, i);
        }
    Map<Integer, List<String>> groups = new HashMap<>();
    for (var en : emailToId.entrySet())
        groups.computeIfAbsent(find.applyAsInt(en.getValue()), k -> new ArrayList<>()).add(en.getKey());
    List<List<String>> ans = new ArrayList<>();
    for (var en : groups.entrySet()) {
        List<String> emails = en.getValue();
        Collections.sort(emails);
        List<String> row = new ArrayList<>();
        row.add(accounts.get(en.getKey()).get(0));
        row.addAll(emails);
        ans.add(row);
    }
    return ans;
}`,
    `function accountsMerge(accounts) {
  const n = accounts.length;
  const p = [...Array(n).keys()];
  const find = (x) => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
  const emailToId = new Map();
  for (let i = 0; i < n; i++)
    for (const email of accounts[i].slice(1)) {
      if (emailToId.has(email)) p[find(i)] = find(emailToId.get(email));
      else emailToId.set(email, i);
    }
  const groups = new Map();
  for (const [email, i] of emailToId) {
    const r = find(i);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(email);
  }
  return [...groups.entries()].map(([i, emails]) =>
    [accounts[i][0], ...emails.sort()]);
}`,
  ),
  frames: accountsMergeFrames(),
};

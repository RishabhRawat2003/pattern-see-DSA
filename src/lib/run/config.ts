import type { TemplateLang } from "../types";

/** Judge0 CE language ids — https://ce.judge0.com/languages */
export const judge0Languages: Record<TemplateLang, number> = {
  python: 100, // Python 3.12.5
  javascript: 97, // Node.js 20.17.0
  cpp: 105, // C++ GCC 14.1.0
  java: 91, // Java JDK 17.0.6
};

export const judge0FileNames: Record<TemplateLang, string> = {
  python: "main.py",
  javascript: "main.js",
  cpp: "main.cpp",
  java: "Main.java",
};

export const playgroundStarters: Record<TemplateLang, string> = {
  python: `# Online Python compiler
# Write Python code and click Run

def main():
    name = "Patternsee"
    print(f"Hello, {name}!")
    print("2 + 2 =", 2 + 2)

if __name__ == "__main__":
    main()
`,
  javascript: `// Online JavaScript compiler
// Write JS code and click Run

function main() {
  const name = "Patternsee";
  console.log(\`Hello, \${name}!\`);
  console.log("2 + 2 =", 2 + 2);
}

main();
`,
  cpp: `// Online C++ compiler
// Write C++ code and click Run

#include <iostream>
using namespace std;

int main() {
  cout << "Hello, Patternsee!" << endl;
  cout << "2 + 2 = " << (2 + 2) << endl;
  return 0;
}
`,
  java: `// Online Java compiler
// Write Java code and click Run

public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, Patternsee!");
    System.out.println("2 + 2 = " + (2 + 2));
  }
}
`,
};

export const MAX_CODE_CHARS = 40_000;
export const MAX_STDIN_CHARS = 8_000;

/** Public Judge0 CE instance (no API key). */
export const JUDGE0_URL =
  process.env.JUDGE0_URL?.replace(/\/$/, "") ?? "https://ce.judge0.com";

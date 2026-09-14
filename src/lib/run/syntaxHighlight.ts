import type { TemplateLang } from "@/lib/types";

const KEYWORDS: Record<TemplateLang, Set<string>> = {
  javascript: new Set([
    "async",
    "await",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "null",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "undefined",
    "var",
    "void",
    "while",
    "with",
    "yield",
  ]),
  python: new Set([
    "and",
    "as",
    "assert",
    "async",
    "await",
    "break",
    "class",
    "continue",
    "def",
    "del",
    "elif",
    "else",
    "except",
    "False",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "None",
    "nonlocal",
    "not",
    "or",
    "pass",
    "raise",
    "return",
    "True",
    "try",
    "while",
    "with",
    "yield",
  ]),
  java: new Set([
    "abstract",
    "assert",
    "boolean",
    "break",
    "byte",
    "case",
    "catch",
    "char",
    "class",
    "continue",
    "default",
    "do",
    "double",
    "else",
    "enum",
    "extends",
    "false",
    "final",
    "finally",
    "float",
    "for",
    "if",
    "implements",
    "import",
    "instanceof",
    "int",
    "interface",
    "long",
    "native",
    "new",
    "null",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "short",
    "static",
    "strictfp",
    "super",
    "switch",
    "synchronized",
    "this",
    "throw",
    "throws",
    "transient",
    "true",
    "try",
    "void",
    "volatile",
    "while",
  ]),
  cpp: new Set([
    "alignas",
    "alignof",
    "auto",
    "bool",
    "break",
    "case",
    "catch",
    "char",
    "class",
    "const",
    "constexpr",
    "continue",
    "default",
    "delete",
    "do",
    "double",
    "else",
    "enum",
    "explicit",
    "extern",
    "false",
    "float",
    "for",
    "friend",
    "goto",
    "if",
    "inline",
    "int",
    "long",
    "namespace",
    "new",
    "noexcept",
    "nullptr",
    "operator",
    "private",
    "protected",
    "public",
    "register",
    "return",
    "short",
    "signed",
    "sizeof",
    "static",
    "struct",
    "switch",
    "template",
    "this",
    "throw",
    "true",
    "try",
    "typedef",
    "typename",
    "union",
    "unsigned",
    "using",
    "virtual",
    "void",
    "volatile",
    "while",
  ]),
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function span(kind: string, text: string): string {
  return `<span class="code-hl-${kind}">${escapeHtml(text)}</span>`;
}

function readString(src: string, start: number, quote: string): { text: string; end: number } {
  let i = start + 1;
  while (i < src.length) {
    if (src[i] === "\\" && i + 1 < src.length) {
      i += 2;
      continue;
    }
    if (src[i] === quote) {
      i += 1;
      break;
    }
    i += 1;
  }
  return { text: src.slice(start, i), end: i };
}

function readLineComment(src: string, start: number): { text: string; end: number } {
  let i = start + 2;
  while (i < src.length && src[i] !== "\n") i += 1;
  return { text: src.slice(start, i), end: i };
}

function readHashComment(src: string, start: number): { text: string; end: number } {
  let i = start + 1;
  while (i < src.length && src[i] !== "\n") i += 1;
  return { text: src.slice(start, i), end: i };
}

function readBlockComment(src: string, start: number): { text: string; end: number } {
  let i = start + 2;
  while (i < src.length) {
    if (src[i] === "*" && src[i + 1] === "/") {
      i += 2;
      break;
    }
    i += 1;
  }
  return { text: src.slice(start, i), end: i };
}

function readPreprocessor(src: string, start: number): { text: string; end: number } {
  let i = start + 1;
  while (i < src.length && src[i] !== "\n") i += 1;
  return { text: src.slice(start, i), end: i };
}

function readNumber(src: string, start: number): { text: string; end: number } {
  let i = start;
  if (src[i] === "0" && (src[i + 1] === "x" || src[i + 1] === "X")) {
    i += 2;
    while (i < src.length && /[0-9a-fA-F_]/.test(src[i])) i += 1;
  } else {
    while (i < src.length && /[0-9_]/.test(src[i])) i += 1;
    if (src[i] === "." && /[0-9]/.test(src[i + 1] ?? "")) {
      i += 1;
      while (i < src.length && /[0-9_]/.test(src[i])) i += 1;
    }
  }
  return { text: src.slice(start, i), end: i };
}

function readIdentifier(src: string, start: number): { text: string; end: number } {
  let i = start;
  while (i < src.length && /[\w$]/.test(src[i])) i += 1;
  return { text: src.slice(start, i), end: i };
}

export function highlightSyntax(lang: TemplateLang, code: string): string {
  const keywords = KEYWORDS[lang];
  let out = "";
  let i = 0;

  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1] ?? "";

    if (lang === "python" && ch === "#") {
      const { text, end } = readHashComment(code, i);
      out += span("comment", text);
      i = end;
      continue;
    }

    if (lang === "cpp" && ch === "#") {
      const { text, end } = readPreprocessor(code, i);
      out += span("preprocessor", text);
      i = end;
      continue;
    }

    if (ch === "/" && next === "/") {
      const { text, end } = readLineComment(code, i);
      out += span("comment", text);
      i = end;
      continue;
    }

    if (ch === "/" && next === "*") {
      const { text, end } = readBlockComment(code, i);
      out += span("comment", text);
      i = end;
      continue;
    }

    if (ch === '"' || ch === "'") {
      const { text, end } = readString(code, i, ch);
      out += span("string", text);
      i = end;
      continue;
    }

    if (lang === "javascript" && ch === "`") {
      const { text, end } = readString(code, i, "`");
      out += span("string", text);
      i = end;
      continue;
    }

    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(next))) {
      const { text, end } = readNumber(code, i);
      out += span("number", text);
      i = end;
      continue;
    }

    if (/[A-Za-z_$]/.test(ch)) {
      const { text, end } = readIdentifier(code, i);
      if (keywords.has(text)) {
        out += span("keyword", text);
      } else {
        out += escapeHtml(text);
      }
      i = end;
      continue;
    }

    out += escapeHtml(ch);
    i += 1;
  }

  return out;
}

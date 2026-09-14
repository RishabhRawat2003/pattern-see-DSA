import type { TemplateLang } from "../types";

export const COMPILER_PAYLOAD_KEY = "patternsee-compiler-payload";

export type CompilerPayload = {
  lang: TemplateLang;
  code: string;
  label?: string;
};

export function saveCompilerPayload(payload: CompilerPayload) {
  sessionStorage.setItem(COMPILER_PAYLOAD_KEY, JSON.stringify(payload));
}

export function loadCompilerPayload(): CompilerPayload | null {
  try {
    const raw = sessionStorage.getItem(COMPILER_PAYLOAD_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as CompilerPayload;
    if (
      data.lang !== "python" &&
      data.lang !== "cpp" &&
      data.lang !== "java" &&
      data.lang !== "javascript"
    ) {
      return null;
    }
    if (typeof data.code !== "string") return null;
    return data;
  } catch {
    return null;
  }
}

export function clearCompilerPayload() {
  sessionStorage.removeItem(COMPILER_PAYLOAD_KEY);
}

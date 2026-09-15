"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { templateLangs } from "@/lib/practice/helpers";
import { runCode, type RunResult } from "@/lib/run/client";
import {
  clearCompilerPayload,
  loadCompilerPayload,
} from "@/lib/run/compilerBridge";
import { judge0FileNames, playgroundStarters } from "@/lib/run/config";
import { highlightSyntax } from "@/lib/run/syntaxHighlight";
import type { TemplateLang } from "@/lib/types";

const LANG_KEY = "patternsee-template-lang";

const BRACKET_PAIRS: Record<string, string> = {
  "{": "}",
  "[": "]",
  "(": ")",
};

type ConsoleTab = "output" | "input";

type SelectionRange = { start: number; end: number };

function applyBracketShortcut(
  key: string,
  value: string,
  start: number,
  end: number,
): { code: string; selection: SelectionRange } | null {
  const close = BRACKET_PAIRS[key];
  if (close) {
    const selected = value.slice(start, end);
    const next = value.slice(start, start + 1);
    if (!selected && next === close) {
      return { code: value, selection: { start: start + 1, end: start + 1 } };
    }
    const code =
      value.slice(0, start) + key + selected + close + value.slice(end);
    return {
      code,
      selection: selected
        ? { start: start + 1, end: end + 1 }
        : { start: start + 1, end: start + 1 },
    };
  }

  if (key === "}" || key === "]" || key === ")") {
    const next = value.slice(start, start + 1);
    if (next === key && start === end) {
      return { code: value, selection: { start: start + 1, end: start + 1 } };
    }
  }

  if (key === "Backspace" && start === end && start > 0) {
    const open = value[start - 1];
    const paired = value[start];
    if (BRACKET_PAIRS[open] === paired) {
      return {
        code: value.slice(0, start - 1) + value.slice(start + 1),
        selection: { start: start - 1, end: start - 1 },
      };
    }
  }

  return null;
}

export function OnlineCompiler({ variant = "page" }: { variant?: "page" | "embedded" }) {
  const [lang, setLang] = useState<TemplateLang>("javascript");
  const [code, setCode] = useState(playgroundStarters.javascript);
  const [sourceLabel, setSourceLabel] = useState<string | null>(null);
  const [stdin, setStdin] = useState("");
  const [consoleTab, setConsoleTab] = useState<ConsoleTab>("output");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const pendingSelection = useRef<SelectionRange | null>(null);
  const page = variant === "page";

  useLayoutEffect(() => {
    const el = editorRef.current;
    const pending = pendingSelection.current;
    if (!el || !pending) return;
    el.selectionStart = pending.start;
    el.selectionEnd = pending.end;
    pendingSelection.current = null;
  }, [code]);

  useEffect(() => {
    const payload = loadCompilerPayload();
    if (payload) {
      setLang(payload.lang);
      setCode(payload.code);
      setSourceLabel(payload.label ?? null);
      window.localStorage.setItem(LANG_KEY, payload.lang);
      clearCompilerPayload();
      return;
    }
    const saved = window.localStorage.getItem(LANG_KEY);
    if (saved === "python" || saved === "cpp" || saved === "java" || saved === "javascript") {
      setLang(saved);
      setCode(playgroundStarters[saved]);
    }
  }, []);

  const fileName = judge0FileNames[lang];
  const lineCount = useMemo(() => Math.max(code.split("\n").length, 1), [code]);
  const lines = useMemo(
    () => Array.from({ length: lineCount }, (_, i) => i + 1),
    [lineCount],
  );
  const highlightedCode = useMemo(
    () => highlightSyntax(lang, code),
    [lang, code],
  );

  const changeLang = (next: TemplateLang) => {
    setLang(next);
    window.localStorage.setItem(LANG_KEY, next);
    setCode(playgroundStarters[next]);
    setSourceLabel(null);
    setResult(null);
  };

  const onRun = useCallback(async () => {
    setRunning(true);
    setConsoleTab("output");
    setResult(null);
    try {
      const out = await runCode(lang, code, stdin);
      setResult(out);
    } catch (e) {
      setResult({
        ok: false,
        stdout: "",
        stderr: e instanceof Error ? e.message : "Run failed",
      });
    } finally {
      setRunning(false);
    }
  }, [lang, code, stdin]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!running && code.trim()) void onRun();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onRun, running, code]);

  const syncScroll = () => {
    const ta = editorRef.current;
    if (!ta) return;
    if (lineRef.current) lineRef.current.scrollTop = ta.scrollTop;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = ta.scrollTop;
      highlightRef.current.scrollLeft = ta.scrollLeft;
    }
  };

  const onEditorKeyDown = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const ta = e.currentTarget;
    const applied = applyBracketShortcut(
      e.key,
      ta.value,
      ta.selectionStart,
      ta.selectionEnd,
    );
    if (!applied) return;

    e.preventDefault();
    pendingSelection.current = applied.selection;
    if (applied.code !== ta.value) {
      setCode(applied.code);
    } else {
      ta.selectionStart = applied.selection.start;
      ta.selectionEnd = applied.selection.end;
      pendingSelection.current = null;
    }
  };

  const syncSelecting = () => {
    const ta = editorRef.current;
    if (!ta) return;
    setIsSelecting(ta.selectionStart !== ta.selectionEnd);
  };

  const outputText = result
    ? [result.stdout, result.stderr].filter(Boolean).join(result.stdout && result.stderr ? "\n" : "")
    : "";

  return (
    <div
      className={`flex flex-col overflow-hidden bg-[var(--ink-2)] ${
        page
          ? "h-full min-h-[min(72vh,40rem)] rounded-xl border border-[var(--line)]"
          : "min-h-[min(78vh,52rem)] rounded-2xl border border-[var(--line)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      }`}
    >
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-[var(--line)] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {page ? "Code lab" : "Online compiler"}
          </p>
          <h2 className="mt-0.5 truncate text-sm font-semibold text-paper sm:text-base">
            {templateLangs.find((l) => l.id === lang)?.label}
            {sourceLabel ? ` · ${sourceLabel}` : ""}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="compiler-lang">
            Language
          </label>
          <select
            id="compiler-lang"
            value={lang}
            onChange={(e) => changeLang(e.target.value as TemplateLang)}
            className="rounded-lg border border-[var(--line)] bg-ink/60 px-3 py-2 text-xs text-paper outline-none"
          >
            {templateLangs.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-ghost px-3 py-2 text-xs"
            onClick={() => {
              setCode(playgroundStarters[lang]);
              setResult(null);
            }}
          >
            Reset
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-jade px-4 py-2 text-xs font-semibold text-ink disabled:opacity-60"
            disabled={running || !code.trim()}
            onClick={onRun}
          >
            <span aria-hidden>▶</span>
            {running ? "Running…" : "Run"}
          </button>
        </div>
      </div>

      {/* Language chips (Programiz-style quick switch) */}
      <div className="viz-scroll flex gap-1 border-b border-[var(--line)] px-3 py-2 sm:px-4">
        {templateLangs.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => changeLang(l.id)}
            className={`shrink-0 rounded-md px-3 py-1.5 text-xs ${
              lang === l.id
                ? "bg-paper/10 text-paper"
                : "text-muted hover:bg-paper/5 hover:text-paper"
            }`}
          >
            {l.label}
          </button>
        ))}
        <span className="ml-auto hidden items-center gap-3 font-mono text-[10px] text-muted sm:flex">
          <span>{"{ } [ ] ( ) auto-close"}</span>
          <span>Ctrl / ⌘ + Enter</span>
        </span>
      </div>

      {/* Editor */}
      <div className="flex min-h-0 flex-[1.35] flex-col border-b border-[var(--line)]">
        <div className="flex items-center gap-2 border-b border-[var(--line)] bg-ink/40 px-3 py-2">
          <span className="rounded-md bg-saffron/15 px-2.5 py-1 font-mono text-[11px] text-saffron">
            {fileName}
          </span>
          <span className="text-[11px] text-muted">main file</span>
        </div>
        <div className="relative flex min-h-[16rem] flex-1 overflow-hidden bg-[#0f0e0c]">
          <div
            ref={lineRef}
            aria-hidden
            className="shrink-0 select-none overflow-hidden border-r border-[var(--line)] bg-[#12100e] px-2 py-4 text-right font-mono text-[12px] leading-6 text-muted/55 sm:px-3 sm:text-[13px]"
          >
            {lines.map((n) => (
              <div key={n}>{n}</div>
            ))}
          </div>
          <div
            className={`relative min-h-0 flex-1 overflow-hidden${
              isSelecting ? " code-editor-selecting" : ""
            }`}
          >
            <pre
              ref={highlightRef}
              aria-hidden
              className="code-editor-highlight pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre px-3 py-4 font-mono text-[12px] leading-6 text-paper/92 sm:px-4 sm:text-[13px]"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={onEditorKeyDown}
              onKeyUp={syncSelecting}
              onSelect={syncSelecting}
              onMouseUp={syncSelecting}
              onBlur={() => setIsSelecting(false)}
              onScroll={syncScroll}
              spellCheck={false}
              wrap="off"
              className="code-editor-input relative z-10 min-h-0 h-full w-full flex-1 resize-none overflow-auto bg-transparent px-3 py-4 font-mono text-[12px] leading-6 outline-none sm:px-4 sm:text-[13px]"
              aria-label="Code editor"
            />
          </div>
        </div>
      </div>

      {/* Console */}
      <div className="flex min-h-[11rem] flex-1 flex-col bg-[#0c0b0a]">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--line)] px-3 sm:px-4">
          <div className="flex gap-1">
            {(
              [
                ["output", "Output"],
                ["input", "Input"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setConsoleTab(id)}
                className={`border-b-2 px-3 py-2.5 text-xs ${
                  consoleTab === id
                    ? "border-jade text-paper"
                    : "border-transparent text-muted hover:text-paper"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {consoleTab === "output" ? (
            <button
              type="button"
              className="text-[11px] text-muted hover:text-paper"
              onClick={() => setResult(null)}
            >
              Clear
            </button>
          ) : null}
        </div>

        {consoleTab === "output" ? (
          <div className="min-h-0 flex-1 overflow-auto px-4 py-3">
            {!result && !running ? (
              <p className="font-mono text-[12px] text-muted">
                Click Run to see output here…
              </p>
            ) : null}
            {running ? (
              <p className="font-mono text-[12px] text-saffron">Running…</p>
            ) : null}
            {result ? (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                      result.ok ? "bg-jade/15 text-jade" : "bg-[var(--rose)]/15 text-[var(--rose)]"
                    }`}
                  >
                    {result.ok ? "Success" : "Error"}
                  </span>
                  {result.engine ? (
                    <span className="font-mono text-[10px] text-muted">{result.engine}</span>
                  ) : null}
                </div>
                {outputText ? (
                  <pre className="whitespace-pre-wrap break-words font-mono text-[12px] leading-6">
                    {result.stdout ? (
                      <span className="text-paper/90">{result.stdout}</span>
                    ) : null}
                    {result.stdout && result.stderr ? "\n" : null}
                    {result.stderr ? (
                      <span className="text-[var(--rose)]/90">{result.stderr}</span>
                    ) : null}
                  </pre>
                ) : (
                  <p className="font-mono text-[12px] text-muted">
                    Program finished with no output.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
            <p className="mb-2 text-[11px] text-muted">
              Values entered here are passed to your program as standard input (stdin).
            </p>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              spellCheck={false}
              className="min-h-0 w-full flex-1 resize-none rounded-xl border border-[var(--line)] bg-ink/50 px-3 py-2 font-mono text-[12px] leading-6 text-paper/90 outline-none"
              placeholder={"e.g.\n42\nhello"}
              aria-label="Program input"
            />
          </div>
        )}
      </div>
    </div>
  );
}

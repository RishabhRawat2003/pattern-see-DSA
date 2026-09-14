import { NextResponse } from "next/server";
import {
  JUDGE0_URL,
  MAX_CODE_CHARS,
  MAX_STDIN_CHARS,
  judge0Languages,
} from "@/lib/run/config";
import type { TemplateLang } from "@/lib/types";

export const runtime = "nodejs";

type Body = {
  language?: string;
  code?: string;
  stdin?: string;
};

const bucket = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;

/** Judge0 status ids where the program at least compiled. */
const RAN_OK = new Set([3, 4, 5, 11, 12, 13, 14, 15]);

function clientKey(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon"
  );
}

function rateLimit(key: string) {
  const now = Date.now();
  const cur = bucket.get(key);
  if (!cur || now > cur.resetAt) {
    bucket.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (cur.count >= MAX_PER_WINDOW) return false;
  cur.count += 1;
  return true;
}

function isLang(v: string): v is TemplateLang {
  return v === "python" || v === "cpp" || v === "java" || v === "javascript";
}

type Judge0Submission = {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  status?: { id?: number; description?: string };
};

export async function POST(req: Request) {
  if (!rateLimit(clientKey(req))) {
    return NextResponse.json(
      {
        ok: false,
        stdout: "",
        stderr: "Rate limit: try again in a minute.",
        engine: "judge0",
      },
      { status: 429 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, stdout: "", stderr: "Invalid JSON body.", engine: "judge0" },
      { status: 400 },
    );
  }

  const language = body.language ?? "";
  const code = body.code ?? "";
  const stdin = body.stdin ?? "";

  if (!isLang(language)) {
    return NextResponse.json(
      { ok: false, stdout: "", stderr: "Unsupported language.", engine: "judge0" },
      { status: 400 },
    );
  }
  if (!code.trim()) {
    return NextResponse.json(
      { ok: false, stdout: "", stderr: "Code is empty.", engine: "judge0" },
      { status: 400 },
    );
  }
  if (code.length > MAX_CODE_CHARS) {
    return NextResponse.json(
      {
        ok: false,
        stdout: "",
        stderr: `Code too long (max ${MAX_CODE_CHARS} chars).`,
        engine: "judge0",
      },
      { status: 400 },
    );
  }
  if (stdin.length > MAX_STDIN_CHARS) {
    return NextResponse.json(
      {
        ok: false,
        stdout: "",
        stderr: `stdin too long (max ${MAX_STDIN_CHARS} chars).`,
        engine: "judge0",
      },
      { status: 400 },
    );
  }

  const languageId = judge0Languages[language];

  try {
    const res = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: stdin || undefined,
        }),
        signal: AbortSignal.timeout(30_000),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          ok: false,
          stdout: "",
          stderr: `Compiler service error (${res.status}): ${text.slice(0, 400)}`,
          engine: "judge0",
        },
        { status: 502 },
      );
    }

    const data = (await res.json()) as Judge0Submission;
    const stdout = (data.stdout ?? "").trimEnd();
    const compileOut = (data.compile_output ?? "").trim();
    const runtimeErr = (data.stderr ?? "").trim();
    const statusId = data.status?.id ?? 0;
    const statusLabel = data.status?.description ?? "Unknown";

    const stderr = [compileOut, runtimeErr, data.message ?? ""]
      .filter(Boolean)
      .join("\n")
      .trim();

    const ok = !compileOut && RAN_OK.has(statusId);

    return NextResponse.json({
      ok,
      stdout,
      stderr: ok ? runtimeErr : stderr || statusLabel,
      status: statusLabel,
      engine: `judge0:${languageId}`,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        stdout: "",
        stderr: e instanceof Error ? e.message : "Failed to reach compiler service.",
        engine: "judge0",
      },
      { status: 502 },
    );
  }
}

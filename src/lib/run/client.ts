import type { TemplateLang } from "../types";

export type RunResult = {
  ok: boolean;
  stdout: string;
  stderr: string;
  signal?: string | null;
  status?: string;
  engine?: string;
};

export async function runJavaScriptLocal(code: string, stdin = ""): Promise<RunResult> {
  const workerSource = `
    self.onmessage = (ev) => {
      const { code, stdin } = ev.data;
      const logs = [];
      const errors = [];
      let stdinPos = 0;
      console.log = (...args) => {
        logs.push(args.map((a) => String(a)).join(" "));
      };
      console.error = (...args) => {
        errors.push(args.map((a) => String(a)).join(" "));
      };
      self.readLine = () => {
        const next = stdin.indexOf("\\n", stdinPos);
        if (next === -1) {
          const line = stdin.slice(stdinPos);
          stdinPos = stdin.length;
          return line;
        }
        const line = stdin.slice(stdinPos, next);
        stdinPos = next + 1;
        return line;
      };
      try {
        const fn = new Function(code);
        fn();
        self.postMessage({ ok: errors.length === 0, logs, errors });
      } catch (e) {
        errors.push(e && e.stack ? String(e.stack) : String(e));
        self.postMessage({ ok: false, logs, errors });
      }
    };
  `;

  return new Promise((resolve) => {
    let settled = false;
    const blob = new Blob([workerSource], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    const finish = (result: RunResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(result);
    };
    const timer = window.setTimeout(() => {
      finish({
        ok: false,
        stdout: "",
        stderr: "Timed out (3s).",
        status: "timeout",
        engine: "local-js",
      });
    }, 3000);

    worker.onmessage = (ev) => {
      const data = ev.data as { ok: boolean; logs: string[]; errors: string[] };
      finish({
        ok: data.ok,
        stdout: data.logs.join("\n"),
        stderr: data.errors.join("\n"),
        engine: "local-js",
      });
    };
    worker.onerror = (ev) => {
      finish({
        ok: false,
        stdout: "",
        stderr: ev.message || "Worker failed",
        engine: "local-js",
      });
    };
    worker.postMessage({ code, stdin });
  });
}

export async function runRemote(
  language: TemplateLang,
  code: string,
  stdin = "",
): Promise<RunResult> {
  const res = await fetch("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, code, stdin }),
  });
  const data = (await res.json()) as RunResult & { message?: string };
  if (!res.ok) {
    return {
      ok: false,
      stdout: data.stdout ?? "",
      stderr: data.stderr || data.message || `Request failed (${res.status})`,
      engine: data.engine ?? "remote",
    };
  }
  return data;
}

export async function runCode(
  language: TemplateLang,
  code: string,
  stdin = "",
): Promise<RunResult> {
  if (language === "javascript") {
    try {
      return await runJavaScriptLocal(code, stdin);
    } catch {
      // fall through to remote
    }
  }
  return runRemote(language, code, stdin);
}

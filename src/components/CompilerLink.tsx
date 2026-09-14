"use client";

import { useRouter } from "next/navigation";
import { saveCompilerPayload } from "@/lib/run/compilerBridge";
import type { TemplateLang } from "@/lib/types";

export function CompilerLink({
  lang,
  code,
  label,
  className = "btn btn-primary px-3 py-1.5 text-xs",
  children = "Try in compiler",
}: {
  lang: TemplateLang;
  code: string;
  label?: string;
  className?: string;
  children?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        saveCompilerPayload({ lang, code, label });
        router.push("/playground");
      }}
    >
      {children}
    </button>
  );
}

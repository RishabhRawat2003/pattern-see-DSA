import type { Metadata } from "next";
import { CompilerPage } from "@/components/CompilerPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Code lab",
  description: `Run Python, C++, Java, and JavaScript — ${site.name} online compiler.`,
  alternates: { canonical: "/playground" },
  robots: { index: false },
};

export default function PlaygroundPage() {
  return <CompilerPage />;
}

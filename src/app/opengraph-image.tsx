import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = `${site.name} — visual DSA interview prep`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#100f0e",
          color: "#f4ece1",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            color: "#e8b15a",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          ∇ {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, maxWidth: 900 }}>
            See every DSA pattern unfold.
          </div>
          <div style={{ marginTop: 24, fontSize: 28, color: "#b9ab99", maxWidth: 820 }}>
            Step-by-step visualizations for coding interviews.
          </div>
        </div>
      </div>
    ),
    size,
  );
}

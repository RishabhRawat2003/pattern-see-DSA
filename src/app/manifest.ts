import { site } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Visual DSA Patterns`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#100f0e",
    theme_color: "#e8b15a",
  };
}

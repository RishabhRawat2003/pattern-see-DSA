export const site = {
  name: "Patternsee",
  tagline: "See every DSA pattern",
  description:
    "Patternsee is a visual DSA interview prep site. Walk through two pointers, trees, graphs, DP, DSU, tries, and more — one animated step at a time.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://patternsee.dev",
  locale: "en_IN",
} as const;

export function absUrl(path = "/") {
  return new URL(path, site.url).toString();
}

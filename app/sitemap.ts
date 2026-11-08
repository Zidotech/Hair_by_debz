import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/data/site";

const ROUTES: [path: string, priority: number][] = [
  ["/", 1],
  ["/services", 0.9],
  ["/book", 0.9],
  ["/gallery", 0.8],
  ["/training", 0.7],
  ["/about", 0.6],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(([path, priority]) => ({ url: SITE_URL + path, priority }));
}

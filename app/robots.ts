import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/book/confirmed"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";
import { getPortfolioMeta } from "@/lib/portfolio-server";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const meta = await getPortfolioMeta();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${meta.siteUrl}/sitemap.xml`,
  };
}

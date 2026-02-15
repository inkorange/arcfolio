import type { MetadataRoute } from "next";
import { getPortfolioMeta } from "@/lib/portfolio-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const meta = await getPortfolioMeta();

  return [
    {
      url: meta.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}

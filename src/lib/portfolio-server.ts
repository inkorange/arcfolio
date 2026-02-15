import { readFile } from "fs/promises";
import path from "path";
import { PortfolioData, PortfolioMeta } from "@/types/portfolio";

export async function getPortfolioDataServer(): Promise<PortfolioData> {
  const filePath = path.join(process.cwd(), "public", "data", "portfolio.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as PortfolioData;
}

export async function getPortfolioMeta(): Promise<PortfolioMeta> {
  const data = await getPortfolioDataServer();
  return data.meta;
}

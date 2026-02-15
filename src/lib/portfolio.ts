import { PortfolioData, PortfolioConfig } from "@/types/portfolio";

const DEFAULT_CONFIG: PortfolioConfig = {
  scrollSpeed: 5, // 5% of viewport width per second
  hoverDelay: 750,
  blurDelay: 1000,
};

export async function getPortfolioData(): Promise<PortfolioData> {
  const response = await fetch("/data/portfolio.json");

  if (!response.ok) {
    throw new Error(`Failed to load portfolio data: ${response.statusText}`);
  }

  const data: PortfolioData = await response.json();

  // Merge with default config
  data.config = { ...DEFAULT_CONFIG, ...data.config };

  // Sort sections by startDate
  data.sections.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Sort projects within each section by date
  data.sections.forEach((section) => {
    section.projects.sort(
      (a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()
    );
  });

  return data;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export function getYearFromDate(dateString: string): number {
  return new Date(dateString).getFullYear();
}

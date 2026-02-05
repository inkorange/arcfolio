export interface Project {
  title: string;
  description: string;
  url: string | null;
  date: string; // ISO date string, e.g., "2001-05-02"
  media: string; // path to image or video
  type: "image" | "video";
}

export interface Section {
  title: string;
  category: string;
  position?: string | null; // Job title or role, displayed under title
  logo?: string | null;
  backgroundColor: string; // CSS color value
  description: string;
  startDate: string; // ISO date string
  backgroundImage1?: string;
  backgroundImage2?: string;
  backgroundImage3?: string;
  projects: Project[];
}

export interface OutroCard {
  title: string;
  description: string;
  email?: string;
  links?: {
    label: string;
    url: string;
    icon?: string;
  }[];
}

export interface PortfolioConfig {
  scrollSpeed: number; // percentage of screen width per second (default: 10)
  hoverDelay: number; // ms before card expands (default: 500)
  blurDelay: number; // ms before card collapses (default: 500)
}

export interface PortfolioData {
  config?: PortfolioConfig;
  sections: Section[];
  outro: OutroCard;
}

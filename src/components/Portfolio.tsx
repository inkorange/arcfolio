"use client";

import { useEffect, useState } from "react";
import { ScrollProvider } from "@/context/ScrollContext";
import { ScrollContainer } from "./ScrollContainer";
import { Section } from "./Section";
import { OutroCard } from "./OutroCard";
import { TimelineBar } from "./TimelineBar";
import { StartOverlay } from "./StartOverlay";
import { PortfolioData } from "@/types/portfolio";
import { getPortfolioData } from "@/lib/portfolio";
import { usePreloadMedia } from "@/hooks/usePreloadMedia";

function LoadingScreen({
  message,
  progress,
}: {
  message: string;
  progress?: { loaded: number; total: number };
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted mb-2">{message}</p>
        {progress && progress.total > 0 && (
          <div className="w-48 mx-auto">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round((progress.loaded / progress.total) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted mt-1">
              {progress.loaded} / {progress.total} assets
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PortfolioContent({ data }: { data: PortfolioData }) {
  const preloadState = usePreloadMedia(data);
  const [isReady, setIsReady] = useState(false);

  // Wait for critical images to load before showing content
  useEffect(() => {
    // Show content immediately if preload is complete, or after initial batch loads
    if (preloadState.isComplete || preloadState.loaded >= Math.min(8, preloadState.total)) {
      // Small delay for smooth transition
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [preloadState.isComplete, preloadState.loaded, preloadState.total]);

  if (!isReady) {
    return (
      <LoadingScreen
        message="Loading assets..."
        progress={{ loaded: preloadState.loaded, total: preloadState.total }}
      />
    );
  }

  return (
    <div className="animate-fadeIn">
      <ScrollProvider initialScrollSpeed={data.config?.scrollSpeed || 5}>
        <StartOverlay />
        <TimelineBar sections={data.sections} />
        <ScrollContainer>
          {data.sections.map((section, index) => (
            <Section
              key={index}
              section={section}
              index={index}
              blurDelay={data.config?.blurDelay}
            />
          ))}
          <OutroCard outro={data.outro} />
        </ScrollContainer>
      </ScrollProvider>
    </div>
  );
}

export function Portfolio() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPortfolioData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading portfolio..." />;
  }

  if (error || !data) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="glass rounded-xl p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">Failed to load</h2>
          <p className="text-muted">{error || "Unknown error occurred"}</p>
        </div>
      </div>
    );
  }

  return <PortfolioContent data={data} />;
}

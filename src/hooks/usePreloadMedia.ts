"use client";

import { useEffect, useState, useCallback } from "react";
import { PortfolioData } from "@/types/portfolio";

interface PreloadState {
  loaded: number;
  total: number;
  isComplete: boolean;
}

/**
 * Preloads all media assets (images) from portfolio data
 * Videos are not preloaded as they're typically large and handled by browser
 */
export function usePreloadMedia(data: PortfolioData | null) {
  const [state, setState] = useState<PreloadState>({
    loaded: 0,
    total: 0,
    isComplete: false,
  });

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Don't fail on error, just continue
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!data) return;

    // Collect all image URLs to preload
    const imageUrls: string[] = [];

    // Section backgrounds and logos
    data.sections.forEach((section) => {
      if (section.logo) imageUrls.push(section.logo);
      if (section.backgroundImage1) imageUrls.push(section.backgroundImage1);
      if (section.backgroundImage2) imageUrls.push(section.backgroundImage2);
      if (section.backgroundImage3) imageUrls.push(section.backgroundImage3);

      // Project media (only images, not videos)
      section.projects.forEach((project) => {
        if (project.type === "image" && project.media) {
          imageUrls.push(project.media);
        }
      });
    });

    // Remove duplicates
    const uniqueUrls = [...new Set(imageUrls)];

    setState((prev) => ({ ...prev, total: uniqueUrls.length }));

    // Preload images in batches to avoid overwhelming the browser
    const batchSize = 4;
    let loadedCount = 0;

    const preloadBatch = async (urls: string[]) => {
      await Promise.all(
        urls.map(async (url) => {
          await preloadImage(url);
          loadedCount++;
          setState((prev) => ({ ...prev, loaded: loadedCount }));
        })
      );
    };

    const preloadAll = async () => {
      for (let i = 0; i < uniqueUrls.length; i += batchSize) {
        const batch = uniqueUrls.slice(i, i + batchSize);
        await preloadBatch(batch);
      }
      setState((prev) => ({ ...prev, isComplete: true }));
    };

    preloadAll();
  }, [data, preloadImage]);

  return state;
}

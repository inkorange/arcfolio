"use client";

import { useMemo } from "react";
import { useScroll } from "@/context/ScrollContext";
import { Section } from "@/types/portfolio";

interface TimelineBarProps {
  sections: Section[];
}

export function TimelineBar({ sections }: TimelineBarProps) {
  const { currentSectionIndex, jumpToSection } = useScroll();

  // Calculate date range from sections
  const { minYear, maxYear, dateRange } = useMemo(() => {
    if (sections.length === 0) return { minYear: 0, maxYear: 0, dateRange: 0 };

    const years = sections.map((s) => new Date(s.startDate).getFullYear());
    const min = Math.min(...years);
    const max = Math.max(...years);
    return { minYear: min, maxYear: max, dateRange: max - min };
  }, [sections]);

  // Get current section info
  const currentSection = sections[currentSectionIndex];
  const currentYear = currentSection
    ? new Date(currentSection.startDate).getFullYear()
    : minYear;

  // Calculate marker position based on date (0-100%)
  const getMarkerPosition = (index: number) => {
    if (dateRange === 0) return index === 0 ? 0 : 100;
    const year = new Date(sections[index].startDate).getFullYear();
    return ((year - minYear) / dateRange) * 100;
  };

  // Progress based on current section's date position
  const progress = dateRange > 0 ? ((currentYear - minYear) / dateRange) * 100 : 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-white/10">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center gap-6">
        {/* Start year */}
        <div className="flex-shrink-0 min-w-[60px]">
          <span className="text-lg font-semibold text-muted">{minYear}</span>
        </div>

        {/* Timeline track */}
        <div className="flex-1 relative h-8 flex items-center">
          {/* Background track */}
          <div className="absolute inset-x-0 h-0.5 bg-white/20 rounded-full" />

          {/* Progress fill */}
          <div
            className="absolute left-0 h-0.5 bg-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />

          {/* Section markers */}
          {sections.map((section, index) => {
            const position = getMarkerPosition(index);
            const isActive = index === currentSectionIndex;
            const isPast = index < currentSectionIndex;
            const year = new Date(section.startDate).getFullYear();

            return (
              <button
                key={index}
                className={`absolute z-10 w-3 h-3 rounded-full transition-all duration-normal -translate-x-1/2 cursor-pointer hover:scale-150 ${
                  isActive
                    ? "bg-accent shadow-glow scale-125"
                    : isPast
                      ? "bg-white/50"
                      : "bg-white/40 hover:bg-white/60"
                }`}
                style={{ left: `${position}%` }}
                onClick={() => jumpToSection(index)}
                title={`${section.title} (${year})`}
              />
            );
          })}

          {/* Current position indicator */}
          <div
            className="absolute w-4 h-4 -translate-x-1/2 pointer-events-none transition-all duration-300"
            style={{ left: `${progress}%` }}
          >
            <div className="w-full h-full rounded-full bg-accent shadow-glow animate-pulse" />
          </div>
        </div>

        {/* End year */}
        <div className="flex-shrink-0 min-w-[60px] text-right">
          <span className="text-lg font-semibold text-muted">{maxYear}</span>
        </div>

        {/* Current section info */}
        <div className="flex-shrink-0 min-w-[200px] border-l border-white/10 pl-6">
          <span className="text-2xl font-bold text-gradient">{currentYear}</span>
          <h3 className="text-sm font-semibold truncate text-muted">
            {currentSection?.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState, useEffect } from "react";
import { useScroll } from "@/context/ScrollContext";
import { Section } from "@/types/portfolio";

interface TimelineBarProps {
  sections: Section[];
}

export function TimelineBar({ sections }: TimelineBarProps) {
  const { currentSectionIndex, jumpToSection, scrollX, sectionOffsets, totalWidth, outroOffset, setScrollX } = useScroll();

  // Cache viewport width, only update on resize
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Check if we're at the outro (scrolled past all sections)
  const isAtOutro = outroOffset > 0 && scrollX >= outroOffset - 100;

  // Get current section info for desktop label
  const currentSection = sections[currentSectionIndex];
  const currentYear = currentSection
    ? new Date(currentSection.startDate).getFullYear()
    : null;

  // Calculate date range from sections
  const { minYear, maxYear, dateRange } = useMemo(() => {
    if (sections.length === 0) return { minYear: 0, maxYear: 0, dateRange: 0 };

    const years = sections.map((s) => new Date(s.startDate).getFullYear());
    const min = Math.min(...years);
    const max = Math.max(...years);
    return { minYear: min, maxYear: max, dateRange: max - min };
  }, [sections]);


  // Calculate marker position based on date (0-90% to leave room for outro at 100%)
  const getMarkerPosition = (index: number) => {
    if (dateRange === 0) return index === 0 ? 0 : 90;
    const year = new Date(sections[index].startDate).getFullYear();
    return ((year - minYear) / dateRange) * 90; // Scale to 90% max
  };

  // Calculate smooth interpolated progress based on scroll position within current section
  const progress = useMemo(() => {
    if (sectionOffsets.length === 0 || sections.length === 0) return 0;

    // Check if we're scrolling into the outro
    if (isAtOutro) {
      // Interpolate from last section position (90%) to outro position (100%)
      const lastSectionPos = getMarkerPosition(sections.length - 1);
      const lastSectionStart = sectionOffsets[sections.length - 1] ?? 0;
      const outroStart = outroOffset > 0 ? outroOffset : totalWidth - viewportWidth;
      const sectionWidth = outroStart - lastSectionStart;

      if (sectionWidth <= 0) return 100;

      const sectionProgress = Math.max(0, Math.min(1,
        (scrollX - lastSectionStart) / sectionWidth
      ));

      return lastSectionPos + (100 - lastSectionPos) * sectionProgress;
    }

    // Get current section's marker position
    const currentMarkerPos = getMarkerPosition(currentSectionIndex);

    // Get next section's marker position (or 100% if at last section)
    const nextMarkerPos = currentSectionIndex < sections.length - 1
      ? getMarkerPosition(currentSectionIndex + 1)
      : 100; // Will interpolate to outro

    // Calculate how far through the current section we've scrolled (0 to 1)
    const currentSectionStart = sectionOffsets[currentSectionIndex] ?? 0;
    const nextSectionStart = currentSectionIndex < sectionOffsets.length - 1
      ? sectionOffsets[currentSectionIndex + 1]
      : outroOffset > 0 ? outroOffset : totalWidth - viewportWidth;

    const sectionWidth = nextSectionStart - currentSectionStart;

    if (sectionWidth <= 0) return currentMarkerPos;

    // Calculate progress through current section (clamped 0-1)
    const sectionProgress = Math.max(0, Math.min(1,
      (scrollX - currentSectionStart) / sectionWidth
    ));

    // Interpolate between current and next marker positions
    return currentMarkerPos + (nextMarkerPos - currentMarkerPos) * sectionProgress;
  }, [scrollX, sectionOffsets, totalWidth, currentSectionIndex, sections.length, dateRange, minYear, isAtOutro, outroOffset, viewportWidth]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-12 glass border-b border-white/10">
      <div className="h-full w-full px-4 flex items-center gap-3">
        {/* Start year */}
        <div className="flex-shrink-0">
          <span className="text-sm font-semibold text-muted">{minYear}</span>
        </div>

        {/* Timeline track */}
        <div className="flex-1 relative h-6 flex items-center">
          {/* Background track */}
          <div className="absolute inset-x-0 h-0.5 bg-white/20 rounded-full" />

          {/* Progress fill */}
          <div
            className="absolute left-0 h-0.5 bg-accent rounded-full"
            style={{ width: `${progress}%` }}
          />

          {/* Section markers */}
          {sections.map((section, index) => {
            const position = getMarkerPosition(index);
            const isActive = index === currentSectionIndex && !isAtOutro;
            const isPast = index < currentSectionIndex || isAtOutro;
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

          {/* Outro marker at the end */}
          <button
            className={`absolute z-10 w-3 h-3 rounded-full transition-all duration-normal translate-x-1/2 cursor-pointer hover:scale-150 ${
              isAtOutro
                ? "bg-accent shadow-glow scale-125"
                : "bg-white/40 hover:bg-white/60"
            }`}
            style={{ right: 0, left: "auto" }}
            onClick={() => {
              // Jump directly to the outro
              if (outroOffset > 0) {
                setScrollX(outroOffset);
              }
            }}
            title="Contact"
          />

          {/* Current position indicator */}
          <div
            className="absolute w-4 h-4 -translate-x-1/2 pointer-events-none"
            style={{ left: `${progress}%` }}
          >
            <div className="w-full h-full rounded-full bg-accent shadow-glow animate-pulse" />
          </div>
        </div>

        {/* End year */}
        <div className="flex-shrink-0">
          <span className="text-sm font-semibold text-muted">{maxYear}</span>
        </div>

        {/* Current section label - desktop only */}
        <div className="hidden md:flex flex-shrink-0 min-w-[180px] border-l border-white/10 pl-4 flex-col justify-center">
          <span className="text-xl font-bold text-gradient">
            {isAtOutro ? "Now" : currentYear}
          </span>
          <h3 className="text-xs font-semibold truncate text-muted">
            {isAtOutro ? "Contact" : currentSection?.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useScroll } from "@/context/ScrollContext";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { useTouchDevice } from "@/hooks/useTouchDevice";
import { Section as SectionType } from "@/types/portfolio";
import { ProjectCard } from "./ProjectCard";
import { ParallaxLayers } from "./ParallaxLayers";


interface SectionProps {
  section: SectionType;
  index: number;
  blurDelay?: number;
}

export function Section({ section, index, blurDelay = 500 }: SectionProps) {
  const { setSectionOffsets, pause, resume, containerRef, registerSectionRef } = useScroll();
  const sectionRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDesktop = useIsDesktop();
  const isTouchDevice = useTouchDevice();
  const [projectsOffset, setProjectsOffset] = useState(0);
  const [projectsWidthPx, setProjectsWidthPx] = useState(0);

  const hoverDelay = 400; // ms before hover triggers pause

  // Handle card hover/tap - pause immediately on touch, with delay on desktop
  const handleCardEnter = useCallback(() => {
    // Cancel any pending resume
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    // On touch devices, pause immediately since tap is intentional
    if (isTouchDevice) {
      pause();
      return;
    }

    // Cancel any existing hover timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    // Start hover delay timer (desktop only)
    hoverTimerRef.current = setTimeout(() => {
      pause();
      hoverTimerRef.current = null;
    }, hoverDelay);
  }, [pause, isTouchDevice]);

  // Handle card leave - cancel hover timer and resume after delay
  const handleCardLeave = useCallback(() => {
    // Cancel hover timer if mouse leaves before delay
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    // Clear any existing resume timer
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    // Set new timer to resume after blurDelay
    resumeTimerRef.current = setTimeout(() => {
      resume();
      resumeTimerRef.current = null;
    }, blurDelay);
  }, [resume, blurDelay]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  // Register section ref for direct DOM reads during navigation
  useEffect(() => {
    registerSectionRef(index, sectionRef.current);
    return () => registerSectionRef(index, null);
  }, [index, registerSectionRef]);

  // Intro width: 50vw on desktop, 100vw on mobile
  const introWidthVw = isDesktop ? 50 : 100;

  // Register section offset on mount and when ANY section resizes
  useEffect(() => {
    const updateMeasurements = () => {
      if (sectionRef.current) {
        const offset = sectionRef.current.offsetLeft;
        setSectionOffsets((prev: number[]) => {
          const newOffsets = [...prev];
          if (newOffsets[index] === offset) return prev; // no change, avoid re-render
          newOffsets[index] = offset;
          return newOffsets;
        });
      }
      if (projectsRef.current && sectionRef.current) {
        const absoluteOffset = sectionRef.current.offsetLeft + projectsRef.current.offsetLeft;
        setProjectsOffset(absoluteOffset);
        setProjectsWidthPx(projectsRef.current.offsetWidth);
      }
    };

    updateMeasurements();

    // Re-measure on window resize
    window.addEventListener("resize", updateMeasurements);

    // Re-measure when images load (they determine card widths)
    const images = projectsRef.current?.querySelectorAll("img");
    const onLoad = () => updateMeasurements();
    images?.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", onLoad);
      }
    });

    // Observe the PARENT container — when any section resizes, the container
    // resizes, and ALL sections re-measure their offsets
    const observer = new ResizeObserver(updateMeasurements);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", updateMeasurements);
      images?.forEach((img) => img.removeEventListener("load", onLoad));
      observer.disconnect();
    };
  }, [index, setSectionOffsets, isDesktop, containerRef]);

  return (
    <div
      ref={sectionRef}
      className="flex-shrink-0 h-screen relative flex"
    >
      {/* Section Intro - 50vw on desktop, 100vw on mobile */}
      <div
        className="flex-shrink-0 h-full relative overflow-hidden"
        style={{
          width: `${introWidthVw}vw`,
          backgroundColor: section.backgroundColor,
        }}
      >
        {/* Gradient base for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${section.backgroundColor} 0%, ${section.backgroundColor}dd 50%, ${section.backgroundColor} 100%)`,
          }}
        />

        {/* Ghosted background image - on top of gradient */}
        {section.backgroundImage1 && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${section.backgroundImage1})` }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
          {/* Logo */}
          {section.logo && (
            <div className="mb-8 max-w-[50%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={section.logo}
                alt={section.title}
                className="max-h-32 w-auto object-contain drop-shadow-lg"
              />
            </div>
          )}

          {/* Category label */}
          <span className="text-sm uppercase tracking-[0.3em] text-white mb-2 font-semibold text-shadow-sharp">
            {section.category}
          </span>

          {/* Start Date */}
          <span className="text-xl md:text-2xl text-white mb-4 font-semibold text-shadow-sharp">
            {new Date(section.startDate).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>

          {/* Title */}
          <h2
            className="text-6xl md:text-7xl font-bold text-gradient text-center max-w-4xl"
            style={{ filter: "drop-shadow(2px 2px 0 rgba(0, 0, 0, 0.5))" }}
          >
            {section.title}
          </h2>

          {/* Position (if exists) */}
          {section.position && (
            <span className="text-xl md:text-2xl text-white mt-2 mb-4 font-semibold text-shadow-sharp">
              {section.position}
            </span>
          )}

          {/* Description */}
          <p className={`text-xl md:text-2xl text-white leading-relaxed text-center max-w-2xl font-medium text-shadow-sharp ${section.position ? "" : "mt-6"}`}>
            {section.description}
          </p>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted opacity-60">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
              <div className="w-1 h-2 bg-current rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Area - sized by card content, no explicit width */}
      <div
        ref={projectsRef}
        className="flex-shrink-0 h-full relative"
        style={{ backgroundColor: section.backgroundColor }}
      >
        {/* Parallax Background Layers - fills projects area */}
        <div className="absolute inset-0 overflow-hidden">
          <ParallaxLayers
            backgroundImage2={section.backgroundImage2}
            backgroundImage3={section.backgroundImage3}
            sectionOffset={projectsOffset}
            sectionWidth={projectsWidthPx}
          />
        </div>

        {/* Project Cards - normal flow, determines projects area width */}
        <div className="relative h-full flex items-center gap-16 pl-24 pr-16 z-10">
          {section.projects.map((project, projectIndex) => (
            <ProjectCard
              key={projectIndex}
              project={project}
              verticalOffset={0}
              onMouseEnter={handleCardEnter}
              onMouseLeave={handleCardLeave}
            />
          ))}
          {/* Buffer space after last card */}
          <div className="flex-shrink-0" style={{ width: isDesktop ? 64 : 32 }} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useScroll } from "@/context/ScrollContext";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useWheelNavigation } from "@/hooks/useWheelNavigation";

interface ScrollContainerProps {
  children: ReactNode;
}

export function ScrollContainer({ children }: ScrollContainerProps) {
  const { containerRef, setTotalWidth, isPaused } = useScroll();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Initialize auto-scroll
  useAutoScroll();

  // Initialize wheel navigation
  useWheelNavigation();

  // Calculate total width on mount and resize
  useEffect(() => {
    const calculateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.scrollWidth;
        if (width > 0) {
          setTotalWidth(width);
        }
      }
    };

    // Try immediately
    calculateWidth();

    // Also try after frames (ensures layout is complete)
    const rafId = requestAnimationFrame(() => {
      calculateWidth();
      requestAnimationFrame(calculateWidth);
    });

    // Also try after delays
    const timeoutId = setTimeout(calculateWidth, 100);
    const timeoutId2 = setTimeout(calculateWidth, 500);

    // Recalculate on resize
    window.addEventListener("resize", calculateWidth);

    // Use ResizeObserver for content changes
    const resizeObserver = new ResizeObserver(calculateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      window.removeEventListener("resize", calculateWidth);
      resizeObserver.disconnect();
    };
  }, [containerRef, setTotalWidth]);

  return (
    <div
      ref={wrapperRef}
      className={`fixed inset-0 overflow-hidden ${isPaused ? "" : "scrolling"}`}
    >
      <div
        ref={containerRef}
        className="flex h-screen will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}

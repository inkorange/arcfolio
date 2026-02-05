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
        setTotalWidth(width);
      }
    };

    calculateWidth();

    // Recalculate on resize
    window.addEventListener("resize", calculateWidth);

    // Use ResizeObserver for content changes
    const resizeObserver = new ResizeObserver(calculateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
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
        style={{
          transition: "transform 0.1s linear",
        }}
      >
        {children}
      </div>
    </div>
  );
}

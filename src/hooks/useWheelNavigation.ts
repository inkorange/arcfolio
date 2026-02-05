"use client";

import { useEffect, useRef, useCallback } from "react";
import { useScroll } from "@/context/ScrollContext";

export function useWheelNavigation() {
  const {
    scrollX,
    currentSectionIndex,
    sectionOffsets,
    jumpToSection,
    isPaused,
    hasStarted,
    pause,
    resume,
    start,
    isCardFocused,
    outroOffset,
    setScrollX,
  } = useScroll();
  const lastWheelTime = useRef(0);
  const wheelThreshold = 300; // ms between wheel events to trigger section jump

  // Toggle pause/resume (or start if not started yet)
  const togglePause = useCallback(() => {
    if (!hasStarted) {
      start();
    } else if (isPaused) {
      resume();
    } else {
      pause();
    }
  }, [hasStarted, isPaused, pause, resume, start]);

  // Check if we're at the outro
  const isAtOutro = outroOffset > 0 && scrollX >= outroOffset - 100;

  // Navigate to previous section (or start of current if in middle)
  const navigatePrevious = useCallback(() => {
    // If we're at the outro, go back to the last section
    if (isAtOutro && sectionOffsets.length > 0) {
      jumpToSection(sectionOffsets.length - 1);
      return;
    }

    const currentOffset = sectionOffsets[currentSectionIndex] || 0;
    const threshold = 50; // pixels - if within this range of section start, go to previous

    // If we're past the start of current section, jump to its start
    if (scrollX > currentOffset + threshold) {
      jumpToSection(currentSectionIndex);
    } else if (currentSectionIndex > 0) {
      // Otherwise jump to previous section
      jumpToSection(currentSectionIndex - 1);
    }
  }, [scrollX, currentSectionIndex, sectionOffsets, jumpToSection, isAtOutro]);

  // Navigate to next section (or outro if at last section)
  const navigateNext = useCallback(() => {
    if (currentSectionIndex < sectionOffsets.length - 1) {
      jumpToSection(currentSectionIndex + 1);
    } else if (outroOffset > 0 && !isAtOutro) {
      // At the last section, jump to outro
      setScrollX(outroOffset);
    }
  }, [currentSectionIndex, sectionOffsets.length, jumpToSection, outroOffset, isAtOutro, setScrollX]);

  // Wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Suspend navigation when a card is focused
      if (isCardFocused) return;

      // Prevent default scroll behavior
      e.preventDefault();

      const now = Date.now();
      if (now - lastWheelTime.current < wheelThreshold) {
        return;
      }
      lastWheelTime.current = now;

      // Determine scroll direction
      if (e.deltaY > 0) {
        navigateNext();
      } else {
        navigatePrevious();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [navigateNext, navigatePrevious, isCardFocused]);

  // Keyboard navigation (Spacebar, Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not typing in an input
      if (e.target !== document.body) return;

      // Suspend navigation when a card is focused (Escape is handled by ProjectCard)
      if (isCardFocused) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          navigatePrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          navigateNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [togglePause, navigatePrevious, navigateNext, isCardFocused]);

  return { currentSectionIndex, isPaused, togglePause };
}

"use client";

import { useEffect, useRef, useCallback } from "react";
import { useScroll } from "@/context/ScrollContext";

// Minimum horizontal movement (px) before a drag is recognized
const DRAG_THRESHOLD = 5;

export function useDragScroll(wrapperRef: React.RefObject<HTMLDivElement | null>) {
  const {
    setScrollX,
    isPaused,
    hasStarted,
    pause,
    resume,
    start,
    isCardFocused,
  } = useScroll();

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);
  const wasPausedBefore = useRef(true);
  const hasExceededThreshold = useRef(false);

  // Keep isPaused/hasStarted in refs so callbacks always see the latest value
  const isPausedRef = useRef(isPaused);
  const hasStartedRef = useRef(hasStarted);
  isPausedRef.current = isPaused;
  hasStartedRef.current = hasStarted;

  const onDragStart = useCallback(
    (clientX: number) => {
      if (isCardFocused) return;

      isDragging.current = true;
      hasExceededThreshold.current = false;
      dragStartX.current = clientX;

      // Capture current scrollX for delta calculation
      setScrollX((prev) => {
        scrollStartX.current = prev;
        return prev;
      });

      // Remember pause state so we can restore it after drag
      wasPausedBefore.current = isPausedRef.current;

      // If auto-scroll is running, pause it during drag
      if (hasStartedRef.current && !isPausedRef.current) {
        pause();
      }
    },
    [isCardFocused, setScrollX, pause]
  );

  const onDragMove = useCallback(
    (clientX: number) => {
      if (!isDragging.current) return;

      const deltaX = dragStartX.current - clientX;

      // Only start actual dragging after exceeding threshold
      if (!hasExceededThreshold.current) {
        if (Math.abs(deltaX) < DRAG_THRESHOLD) return;
        hasExceededThreshold.current = true;
      }

      const newX = Math.max(0, scrollStartX.current + deltaX);
      setScrollX(newX);
    },
    [setScrollX]
  );

  const onDragEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    // If auto-scroll was running before drag, resume it
    if (hasStartedRef.current && !wasPausedBefore.current) {
      resume();
    }
  }, [resume]);

  // Mouse events
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Only primary button
      if (e.button !== 0) return;
      onDragStart(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      onDragMove(e.clientX);
    };

    const handleMouseUp = () => {
      onDragEnd();
    };

    el.addEventListener("mousedown", handleMouseDown);
    // Attach move/up to window so dragging outside the element still works
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [wrapperRef, onDragStart, onDragMove, onDragEnd]);

  // Touch events
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      onDragStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      // Prevent vertical scroll while dragging horizontally
      if (hasExceededThreshold.current) {
        e.preventDefault();
      }
      onDragMove(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      onDragEnd();
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);
    el.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [wrapperRef, onDragStart, onDragMove, onDragEnd]);

  // Prevent click events from firing after a drag (e.g., on project cards)
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => {
      if (hasExceededThreshold.current) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    el.addEventListener("click", handleClick, { capture: true });

    return () => {
      el.removeEventListener("click", handleClick, { capture: true });
    };
  }, [wrapperRef]);
}

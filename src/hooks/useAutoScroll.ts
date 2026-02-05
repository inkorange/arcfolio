"use client";

import { useEffect, useRef, useCallback } from "react";
import { useScroll } from "@/context/ScrollContext";

export function useAutoScroll() {
  const {
    scrollX,
    setScrollX,
    isPaused,
    pause,
    totalWidth,
    scrollSpeed,
    containerRef,
    outroOffset,
  } = useScroll();

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const targetSpeedRef = useRef(0); // Start at 0 since isPaused is true initially
  const currentSpeedRef = useRef(0); // Start at 0 since isPaused is true initially
  const hasReachedEndRef = useRef(false); // Track if we've reached the end
  const viewportWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Use refs to always get latest values in animation loop
  // Sync refs synchronously (not in useEffect) to avoid race conditions
  const outroOffsetRef = useRef(outroOffset);
  const totalWidthRef = useRef(totalWidth);
  const isPausedRef = useRef(isPaused);
  const scrollSpeedRef = useRef(scrollSpeed);

  // Update refs synchronously on every render
  outroOffsetRef.current = outroOffset;
  totalWidthRef.current = totalWidth;
  isPausedRef.current = isPaused;
  scrollSpeedRef.current = scrollSpeed;

  // Update viewport width on resize (not every frame)
  useEffect(() => {
    const updateViewportWidth = () => {
      viewportWidthRef.current = window.innerWidth;
    };
    window.addEventListener('resize', updateViewportWidth);
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  // Smooth speed transitions
  const lerpSpeed = 0.05;

  const animate = useCallback(
    (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      // Use cached viewport width for performance
      const viewportWidth = viewportWidthRef.current;

      // Update target speed based on pause state (using ref for latest value)
      // Double speed on mobile (viewport < 768px)
      const isMobile = viewportWidth < 768;
      const speedMultiplier = isMobile ? 2 : 1;
      targetSpeedRef.current = isPausedRef.current ? 0 : scrollSpeedRef.current * speedMultiplier;

      // Smoothly interpolate current speed toward target
      currentSpeedRef.current +=
        (targetSpeedRef.current - currentSpeedRef.current) * lerpSpeed;
      const pixelsPerSecond = (currentSpeedRef.current / 100) * viewportWidth;
      const delta = pixelsPerSecond * deltaTime;

      // Calculate max scroll - stop when outro card's left edge reaches viewport's left edge (x=0)
      // Use outroOffset if available, otherwise fall back to totalWidth - viewportWidth
      const currentOutroOffset = outroOffsetRef.current;
      const currentTotalWidth = totalWidthRef.current;
      const maxScroll = currentOutroOffset > 0 ? currentOutroOffset : Math.max(0, currentTotalWidth - viewportWidth);

      setScrollX((prev: number) => {
        const newX = Math.min(prev + delta, maxScroll);

        // Check if we've reached the outro card
        if (newX >= maxScroll - 1 && !hasReachedEndRef.current && !isPausedRef.current) {
          hasReachedEndRef.current = true;
          // Pause on next frame to avoid state update during render
          setTimeout(() => pause(), 0);
        } else if (newX < maxScroll - 1) {
          // Reset the flag when scrolling back
          hasReachedEndRef.current = false;
        }

        return newX;
      });

      animationRef.current = requestAnimationFrame(animate);
    },
    [setScrollX, pause]
  );

  useEffect(() => {
    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Apply scroll position to container
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translate3d(${-scrollX}px, 0, 0)`;
    }
  }, [scrollX, containerRef]);

  return {
    scrollX,
    isPaused,
    currentSpeed: currentSpeedRef.current,
  };
}

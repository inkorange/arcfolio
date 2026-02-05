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
  } = useScroll();

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const targetSpeedRef = useRef(0); // Start at 0 since isPaused is true initially
  const currentSpeedRef = useRef(0); // Start at 0 since isPaused is true initially
  const hasReachedEndRef = useRef(false); // Track if we've reached the end

  // Smooth speed transitions
  const lerpSpeed = 0.05;

  const animate = useCallback(
    (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      // Update target speed based on pause state
      targetSpeedRef.current = isPaused ? 0 : scrollSpeed;

      // Smoothly interpolate current speed toward target
      currentSpeedRef.current +=
        (targetSpeedRef.current - currentSpeedRef.current) * lerpSpeed;

      // Calculate pixels per frame based on screen width percentage
      const viewportWidth = window.innerWidth;
      const pixelsPerSecond = (currentSpeedRef.current / 100) * viewportWidth;
      const delta = pixelsPerSecond * deltaTime;

      // Calculate max scroll (total width minus viewport)
      const maxScroll = Math.max(0, totalWidth - viewportWidth);

      setScrollX((prev: number) => {
        const newX = Math.min(prev + delta, maxScroll);

        // Check if we've reached the end
        if (newX >= maxScroll - 1 && !hasReachedEndRef.current && !isPaused) {
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
    [isPaused, scrollSpeed, totalWidth, setScrollX, pause]
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

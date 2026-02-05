"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Project } from "@/types/portfolio";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { useInView } from "@/hooks/useInView";
import { useScroll } from "@/context/ScrollContext";
import { useTouchDevice } from "@/hooks/useTouchDevice";

interface ProjectCardProps {
  project: Project;
  verticalOffset: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function ProjectCard({
  project,
  verticalOffset,
  onMouseEnter,
  onMouseLeave,
}: ProjectCardProps) {
  const isDesktop = useIsDesktop();
  const isTouchDevice = useTouchDevice();
  const [isFocused, setIsFocused] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showHoverDetail, setShowHoverDetail] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [originalRect, setOriginalRect] = useState<DOMRect | null>(null);
  const [focusedSize, setFocusedSize] = useState<{ width: number; height: number } | null>(null);
  const focusedCardRef = useRef<HTMLDivElement>(null);
  const hoverDetailTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { ref: inViewRef, isInView } = useInView({ threshold: 0.2 });
  const cardRef = useRef<HTMLDivElement>(null);
  const { setIsCardFocused, pause } = useScroll();

  const hoverDetailDelay = 400; // ms before showing hover detail

  // Track mount state for portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cleanup hover detail timer on unmount
  useEffect(() => {
    return () => {
      if (hoverDetailTimerRef.current) {
        clearTimeout(hoverDetailTimerRef.current);
      }
    };
  }, []);

  // Handle mouse enter - start hover detail timer
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    onMouseEnter();
    // Start timer to show hover detail after delay
    if (hoverDetailTimerRef.current) {
      clearTimeout(hoverDetailTimerRef.current);
    }
    hoverDetailTimerRef.current = setTimeout(() => {
      setShowHoverDetail(true);
      hoverDetailTimerRef.current = null;
    }, hoverDetailDelay);
  }, [onMouseEnter]);

  // Handle mouse leave - clear timer and hide hover detail
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setShowHoverDetail(false);
    // Clear hover detail timer
    if (hoverDetailTimerRef.current) {
      clearTimeout(hoverDetailTimerRef.current);
      hoverDetailTimerRef.current = null;
    }
    // Only trigger onMouseLeave if not focused
    if (!isFocused) {
      onMouseLeave();
    }
  }, [isFocused, onMouseLeave]);

  // Handle click to toggle focus
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      // On touch devices: first tap shows detail, second tap opens focus
      if (isTouchDevice && !showHoverDetail && !isFocused) {
        setShowHoverDetail(true);
        setIsHovering(true);
        onMouseEnter(); // Pause scrolling
        return;
      }

      if (isFocused) {
        // If already focused, open URL
        if (project.url) {
          window.open(project.url, "_blank", "noopener,noreferrer");
        }
      } else {
        // Store the original card position for animation
        if (cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect();
          setOriginalRect(rect);
        }

        // Start with the card at original position, then animate to center
        setIsFocused(true);
        setIsCardFocused(true);
        pause(); // Ensure scrolling is paused while focused
        setIsAnimatingIn(false);

        // Trigger animation to final position after a frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsAnimatingIn(true);
            // Capture the focused card size after animation starts
            setTimeout(() => {
              if (focusedCardRef.current) {
                const rect = focusedCardRef.current.getBoundingClientRect();
                setFocusedSize({ width: rect.width, height: rect.height });
              }
            }, 550); // After the 500ms animation completes
          });
        });
      }
    },
    [isFocused, isTouchDevice, showHoverDetail, project.url, setIsCardFocused, pause, onMouseEnter]
  );

  // Handle backdrop click to exit focus with animation
  const handleBackdropClick = useCallback(() => {
    // Update the rect to the card's current position before animating out
    if (cardRef.current) {
      setOriginalRect(cardRef.current.getBoundingClientRect());
    }

    // Animate out after a frame (so the new rect is applied)
    requestAnimationFrame(() => {
      setIsAnimatingIn(false);
    });

    // Then remove after animation completes
    setTimeout(() => {
      setIsFocused(false);
      setIsCardFocused(false);
      setOriginalRect(null);
      setFocusedSize(null);
      onMouseLeave();
    }, 350);
  }, [onMouseLeave, setIsCardFocused]);

  // Handle escape key to exit focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFocused) {
        // Update the rect to the card's current position before animating out
        if (cardRef.current) {
          setOriginalRect(cardRef.current.getBoundingClientRect());
        }

        // Animate out after a frame
        requestAnimationFrame(() => {
          setIsAnimatingIn(false);
        });

        // Then remove after animation completes
        setTimeout(() => {
          setIsFocused(false);
          setIsCardFocused(false);
          setOriginalRect(null);
          setFocusedSize(null);
          onMouseLeave();
        }, 350);
      }
    };

    if (isFocused) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocused, onMouseLeave, setIsCardFocused]);

  // Handle tap outside to dismiss hover detail on touch devices
  useEffect(() => {
    if (!isTouchDevice || !showHoverDetail || isFocused) return;

    const handleTouchOutside = (e: TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setShowHoverDetail(false);
        setIsHovering(false);
        onMouseLeave();
      }
    };

    // Small delay to prevent immediate dismissal
    const timeoutId = setTimeout(() => {
      document.addEventListener("touchstart", handleTouchOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("touchstart", handleTouchOutside);
    };
  }, [isTouchDevice, showHoverDetail, isFocused, onMouseLeave]);

  // Combine refs for the card
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      // Set the cardRef
      (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      // Set the inViewRef
      (inViewRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [inViewRef]
  );

  // Truncate description to 200 characters
  const truncatedDescription = project.description.length > 200
    ? project.description.slice(0, 200) + "..."
    : project.description;

  // Card content for inline (non-focused) display
  const inlineCardContent = () => (
    <>
      {/* Media Container */}
      <div className="bg-card relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.media}
          alt={project.title}
          className={`w-full h-auto transition-transform duration-slow ${isHovering ? "scale-105" : ""}`}
        />

        {/* Video Play Button Overlay */}
        {project.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-normal ${
                isHovering ? "scale-110 bg-black/60" : ""
              }`}
            >
              <svg
                className="w-6 h-6 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Subtle gradient overlay at bottom (hidden when hover detail shows) */}
        <div
          className={`absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-normal ${
            showHoverDetail ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Hover detail overlay - slides up from bottom */}
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/85 to-transparent p-4 pt-12 transition-all duration-normal ease-out ${
            showHoverDetail
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <p className="text-xs text-white/90 leading-relaxed">
            {truncatedDescription}
          </p>
          {project.url && (
            <div className="mt-2 flex items-center gap-1 text-xs text-accent">
              <span className="font-medium">{isTouchDevice ? "Tap for details" : "Click for details"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {project.title}
        </h3>
        <span className="text-sm text-muted">
          {new Date(project.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })}
        </span>
      </div>
    </>
  );

  // Focused card content with overlay on image
  const focusedCardContent = () => (
    <div className="relative">
      {/* Full-size image - determines card size */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.media}
        alt={project.title}
        style={{
          maxHeight: "85vh",
          maxWidth: "90vw",
          display: "block",
        }}
      />

      {/* Video Play Button Overlay */}
      {project.type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Content overlay at bottom of image */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 pt-20">
        <h3 className="font-semibold text-2xl mb-1 drop-shadow-lg">
          {project.title}
        </h3>
        <span className="text-sm text-white/80 drop-shadow">
          {new Date(project.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })}
        </span>

        {/* Description */}
        <p className="text-base md:text-lg text-white/90 leading-relaxed mt-3 line-clamp-4 drop-shadow">
          {project.description}
        </p>

        {/* URL indicator / CTA */}
        {project.url && (
          <div className="mt-3 flex items-center gap-2 text-sm text-accent drop-shadow">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span className="font-medium">{isTouchDevice ? "Tap to view project" : "Click to view project"}</span>
          </div>
        )}
      </div>
    </div>
  );

  const cardWidth = isDesktop ? "20vw" : "75vw";
  const cardMinWidth = isDesktop ? "240px" : "260px";
  const cardMaxWidth = isDesktop ? "400px" : "none";

  return (
    <>
      {/* Backdrop and focused card - rendered via portal */}
      {isMounted &&
        isFocused &&
        originalRect &&
        createPortal(
          <>
            {/* Backdrop - fades in */}
            <div
              className="fixed inset-0 z-[9998] cursor-pointer transition-all duration-500 ease-out"
              style={{
                backgroundColor: isAnimatingIn ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0)",
              }}
              onClick={handleBackdropClick}
            />
            {/* Focused card - animates from original position to center */}
            <div
              ref={focusedCardRef}
              className="fixed z-[9999] rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-out"
              style={
                isAnimatingIn
                  ? {
                      // Final centered position
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%) scale3d(1, 1, 1)",
                      maxHeight: "85vh",
                      maxWidth: "90vw",
                      boxShadow: "0 25px 80px -12px rgba(0, 0, 0, 0.9), 0 0 60px rgba(59, 130, 246, 0.3)",
                      outline: "2px solid rgba(59, 130, 246, 0.5)",
                      outlineOffset: "0px",
                    }
                  : {
                      // Animating out - scale down uniformly to original size and position
                      left: focusedSize
                        ? originalRect.left + originalRect.width / 2
                        : originalRect.left,
                      top: focusedSize
                        ? originalRect.top + originalRect.height / 2
                        : originalRect.top,
                      maxHeight: "85vh",
                      maxWidth: "90vw",
                      transform: focusedSize
                        ? `translate(-50%, -50%) scale(${Math.min(originalRect.width / focusedSize.width, originalRect.height / focusedSize.height)})`
                        : "translate(0, 0)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                      opacity: focusedSize ? 1 : 0,
                    }
              }
              onClick={handleClick}
            >
              {focusedCardContent()}
            </div>
          </>,
          document.body
        )}

      {/* Original card in the scroll container */}
      <div
        ref={setRefs}
        className={`flex-shrink-0 interactive glass rounded-xl overflow-hidden cursor-pointer group transition-all duration-slow border ${
          isFocused
            ? "opacity-0 pointer-events-none border-white/15"
            : isHovering || showHoverDetail
              ? "glow border-white/25"
              : "hover:glow hover:border-white/25 border-white/15"
        } ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        style={{
          width: cardWidth,
          minWidth: cardMinWidth,
          maxWidth: cardMaxWidth,
          marginTop: `${verticalOffset}px`,
          transform: isInView ? "translateY(0)" : "translateY(2rem)",
          boxShadow: isFocused
            ? "none"
            : isHovering || showHoverDetail
              ? isDesktop
                ? "0 20px 60px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4)"
                : "0 8px 24px rgba(0, 0, 0, 0.5)"
              : "0 4px 12px rgba(0, 0, 0, 0.4)",
        }}
        onMouseEnter={isTouchDevice ? undefined : handleMouseEnter}
        onMouseLeave={isTouchDevice ? undefined : handleMouseLeave}
        onClick={handleClick}
      >
        {inlineCardContent()}
      </div>
    </>
  );
}

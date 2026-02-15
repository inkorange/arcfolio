"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from "react";

interface ScrollContextType {
  scrollX: number;
  setScrollX: React.Dispatch<React.SetStateAction<number>>;
  isPaused: boolean;
  hasStarted: boolean;
  pause: () => void;
  resume: () => void;
  start: () => void;
  currentSectionIndex: number;
  setCurrentSectionIndex: (index: number) => void;
  sectionOffsets: number[];
  setSectionOffsets: React.Dispatch<React.SetStateAction<number[]>>;
  totalWidth: number;
  setTotalWidth: (width: number) => void;
  scrollSpeed: number;
  jumpToSection: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isCardFocused: boolean;
  setIsCardFocused: (focused: boolean) => void;
  outroOffset: number;
  setOutroOffset: (offset: number) => void;
  registerSectionRef: (index: number, el: HTMLDivElement | null) => void;
  jumpSignalRef: React.MutableRefObject<boolean>;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

interface ScrollProviderProps {
  children: ReactNode;
  initialScrollSpeed?: number;
}

export function ScrollProvider({
  children,
  initialScrollSpeed = 10,
}: ScrollProviderProps) {
  // All state declarations first
  const [scrollX, setScrollXInternal] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionOffsets, setSectionOffsets] = useState<number[]>([]);
  const [totalWidth, setTotalWidth] = useState(0);
  const [scrollSpeed] = useState(initialScrollSpeed);
  const [isCardFocused, setIsCardFocused] = useState(false);
  const [outroOffset, setOutroOffset] = useState(0);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const outroOffsetRef = useRef(0);
  const totalWidthRef = useRef(0);
  const viewportWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 0);
  const sectionRefsMap = useRef<Map<number, HTMLDivElement>>(new Map());
  const jumpSignalRef = useRef(false); // Signal to animation loop to reset speed after jump

  // Keep refs in sync - update synchronously on every render
  outroOffsetRef.current = outroOffset;
  totalWidthRef.current = totalWidth;

  // Update viewport width on resize only
  useEffect(() => {
    const updateViewportWidth = () => {
      viewportWidthRef.current = window.innerWidth;
    };
    window.addEventListener('resize', updateViewportWidth);
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  // Wrap setScrollX to clamp to maxScroll
  const setScrollX: React.Dispatch<React.SetStateAction<number>> = useCallback((value) => {
    setScrollXInternal((prev) => {
      const newValue = typeof value === 'function' ? value(prev) : value;

      // Calculate maxScroll using refs (always current values)
      const currentOutroOffset = outroOffsetRef.current;
      const currentTotalWidth = totalWidthRef.current;
      const viewportWidth = viewportWidthRef.current;
      const maxScroll = currentOutroOffset > 0
        ? currentOutroOffset
        : Math.max(0, currentTotalWidth - viewportWidth);

      // Clamp to maxScroll
      const clampedValue = maxScroll > 0 ? Math.min(newValue, maxScroll) : newValue;

      return clampedValue;
    });
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const start = useCallback(() => {
    setHasStarted(true);
    setIsPaused(false);
  }, []);

  const registerSectionRef = useCallback((index: number, el: HTMLDivElement | null) => {
    if (el) {
      sectionRefsMap.current.set(index, el);
    } else {
      sectionRefsMap.current.delete(index);
    }
  }, []);

  const jumpToSection = useCallback(
    (index: number) => {
      // Read offset directly from the DOM for accuracy
      const sectionEl = sectionRefsMap.current.get(index);
      const targetX = sectionEl ? sectionEl.offsetLeft
        : (index >= 0 && index < sectionOffsets.length) ? sectionOffsets[index]
        : null;

      if (targetX !== null) {
        jumpSignalRef.current = true; // Tell animation loop to reset speed
        setScrollX(targetX);
        setCurrentSectionIndex(index);

        if (index === 0 && targetX === 0) {
          setHasStarted(false);
          setIsPaused(true);
        }
      }
    },
    [sectionOffsets, setScrollX]
  );

  // Update current section based on scroll position — reads DOM refs for accuracy
  useEffect(() => {
    if (sectionRefsMap.current.size === 0 && sectionOffsets.length === 0) return;

    let newSectionIndex = 0;

    // Prefer DOM refs for accurate offsets (images may have resized sections)
    if (sectionRefsMap.current.size > 0) {
      const entries = Array.from(sectionRefsMap.current.entries()).sort(
        ([a], [b]) => a - b
      );
      for (const [idx, el] of entries) {
        if (scrollX >= el.offsetLeft) {
          newSectionIndex = idx;
        } else {
          break;
        }
      }
    } else {
      // Fallback to state-based offsets
      for (let i = 0; i < sectionOffsets.length; i++) {
        if (scrollX >= sectionOffsets[i]) {
          newSectionIndex = i;
        } else {
          break;
        }
      }
    }

    setCurrentSectionIndex(newSectionIndex);
  }, [scrollX, sectionOffsets]);

  return (
    <ScrollContext.Provider
      value={{
        scrollX,
        setScrollX,
        isPaused,
        hasStarted,
        pause,
        resume,
        start,
        currentSectionIndex,
        setCurrentSectionIndex,
        sectionOffsets,
        setSectionOffsets,
        totalWidth,
        setTotalWidth,
        scrollSpeed,
        jumpToSection,
        containerRef,
        isCardFocused,
        setIsCardFocused,
        outroOffset,
        setOutroOffset,
        registerSectionRef,
        jumpSignalRef,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
}

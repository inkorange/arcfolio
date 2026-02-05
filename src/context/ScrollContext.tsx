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
  const [scrollX, setScrollX] = useState(0);
  const [isPaused, setIsPaused] = useState(true); // Start paused until user clicks
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionOffsets, setSectionOffsets] = useState<number[]>([]);
  const [totalWidth, setTotalWidth] = useState(0);
  const [scrollSpeed] = useState(initialScrollSpeed);
  const [isCardFocused, setIsCardFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const jumpToSection = useCallback(
    (index: number) => {
      if (index >= 0 && index < sectionOffsets.length) {
        const targetX = sectionOffsets[index];
        setScrollX(targetX);
        setCurrentSectionIndex(index);

        // If jumping to the very beginning, reset to initial stopped state
        if (index === 0 && targetX === 0) {
          setHasStarted(false);
          setIsPaused(true);
        }
      }
    },
    [sectionOffsets]
  );

  // Update current section based on scroll position
  useEffect(() => {
    if (sectionOffsets.length === 0) return;

    let newSectionIndex = 0;
    for (let i = 0; i < sectionOffsets.length; i++) {
      if (scrollX >= sectionOffsets[i]) {
        newSectionIndex = i;
      } else {
        break;
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

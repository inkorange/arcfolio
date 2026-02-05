"use client";

import { useScroll } from "@/context/ScrollContext";

export function StartOverlay() {
  const { hasStarted, start } = useScroll();

  if (hasStarted) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pb-16 cursor-pointer"
      onClick={start}
    >
      {/* Subtle gradient at bottom for visibility */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      {/* Click to start message */}
      <div className="relative flex flex-col items-center gap-3 animate-pulse">
        <span className="text-sm uppercase tracking-[0.3em] text-white/80 font-medium">
          Click anywhere to start
        </span>
        <div className="w-8 h-8 rounded-full border-2 border-white/60 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white/80"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

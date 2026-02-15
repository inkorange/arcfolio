"use client";

import { useScroll } from "@/context/ScrollContext";

interface ParallaxLayersProps {
  backgroundImage2?: string;
  backgroundImage3?: string;
  sectionOffset: number;
  sectionWidth: number;
}

// Parallax speed multipliers (lower = slower scroll = appears further away)
const LAYER_2_SPEED = 0.6;
const LAYER_3_SPEED = 0.3;

export function ParallaxLayers({
  backgroundImage2,
  backgroundImage3,
  sectionOffset,
  sectionWidth,
}: ParallaxLayersProps) {
  const { scrollX } = useScroll();

  // Calculate the relative scroll position within this section
  const relativeScroll = scrollX - sectionOffset;

  // Calculate parallax offsets for each layer
  // Positive offset = layer lags behind foreground, creating depth
  const layer2Offset = relativeScroll * (1 - LAYER_2_SPEED);
  const layer3Offset = relativeScroll * (1 - LAYER_3_SPEED);

  if (!backgroundImage2 && !backgroundImage3) {
    return null;
  }

  // Calculate extra width needed for parallax movement
  // Since parallax slides right-to-left, we need extra space on the right
  const maxParallaxShift = sectionWidth * 0.7;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layer 3 - Furthest back, slowest */}
      {backgroundImage3 && (
        <div
          className="absolute gpu"
          style={{
            top: 0,
            bottom: 0,
            left: 0,
            width: sectionWidth + maxParallaxShift,
            transform: `translate3d(${layer3Offset}px, 0, 0)`,
            willChange: "transform",
          }}
        >
          <div
            className="w-full h-full bg-cover bg-left opacity-55"
            style={{
              backgroundImage: `url(${backgroundImage3})`,
            }}
          />
        </div>
      )}

      {/* Layer 2 - Middle, medium speed */}
      {backgroundImage2 && (
        <div
          className="absolute gpu"
          style={{
            top: 0,
            bottom: 0,
            left: 0,
            width: sectionWidth + maxParallaxShift,
            transform: `translate3d(${layer2Offset}px, 0, 0)`,
            willChange: "transform",
          }}
        >
          <div
            className="w-full h-full bg-cover bg-left opacity-65"
            style={{
              backgroundImage: `url(${backgroundImage2})`,
            }}
          />
        </div>
      )}
    </div>
  );
}

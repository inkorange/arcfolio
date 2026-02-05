"use client";

import { useCallback } from "react";
import { OutroCard as OutroCardType } from "@/types/portfolio";
import { useScroll } from "@/context/ScrollContext";

interface OutroCardProps {
  outro: OutroCardType;
}

// Social icons
const icons: Record<string, React.ReactNode> = {
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  email: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

export function OutroCard({ outro }: OutroCardProps) {
  const { jumpToSection } = useScroll();

  const handleStartAgain = useCallback(() => {
    jumpToSection(0);
  }, [jumpToSection]);

  return (
    <div
      className="flex-shrink-0 h-screen relative flex items-center justify-center"
      style={{
        width: "100vw",
        background: "linear-gradient(135deg, var(--background) 0%, #1a1a2e 100%)",
      }}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, var(--accent) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, var(--accent) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-xl">
        {/* Title */}
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
          {outro.title}
        </h2>

        {/* Description */}
        <p className="text-xl text-muted leading-relaxed mb-8">
          {outro.description}
        </p>

        {/* Email */}
        {outro.email && (
          <a
            href={`mailto:${outro.email}`}
            className="inline-flex items-center gap-3 px-6 py-3 glass rounded-full text-lg font-medium mb-8 transition-all duration-normal hover:glow hover:scale-105"
          >
            {icons.email}
            <span>{outro.email}</span>
          </a>
        )}

        {/* Social Links */}
        {outro.links && outro.links.length > 0 && (
          <div className="flex items-center justify-center gap-4 mb-12">
            {outro.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 glass rounded-full flex items-center justify-center transition-all duration-normal hover:glow hover:scale-110 text-muted hover:text-foreground"
                title={link.label}
              >
                {link.icon && icons[link.icon] ? icons[link.icon] : link.label[0]}
              </a>
            ))}
          </div>
        )}

        {/* Start Again Button */}
        <button
          onClick={handleStartAgain}
          className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-full font-semibold transition-all duration-normal hover:scale-105 hover:shadow-glow"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Start Again</span>
        </button>
      </div>
    </div>
  );
}

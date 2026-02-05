# Portfolio Build Phases

## Design Direction

**Aesthetic:** Modern, sleek, cutting-edge, inviting

**Visual Language:**
- Slightly rounded corners (8-12px on cards, 4-6px on smaller elements)
- Subtle shadows with soft edges (no harsh drop shadows)
- Glass morphism effects where appropriate (frosted glass, subtle blur)
- Smooth micro-interactions and transitions (200-400ms easing)
- Clean typography with generous whitespace
- Dark theme foundation (user's section background colors)
- Subtle gradients and glow effects for depth
- White/light text for contrast

**Typography:** Space Grotesk (Google Font) — modern geometric sans-serif
- Can swap to: Inter, Outfit, Satoshi, General Sans, Plus Jakarta Sans

**Motion Principles:**
- Fluid, physics-based easing (ease-out for entries, ease-in-out for transitions)
- Staggered animations for grouped elements
- Subtle parallax depth creates natural movement
- Never jarring - everything flows

---

## Phase 1: Foundation & Data Structure ✓
- [x] Create TypeScript interfaces for sections, projects, and portfolio data
- [x] Create sample JSON data file with placeholder content
- [x] Build data loading utility to fetch and parse the JSON
- [x] Set up public folder structure for assets (images, videos, logos)
- [x] Configure Google Font in Next.js (next/font) — Space Grotesk
- [x] Set up Tailwind design tokens (colors, spacing, border-radius, shadows)
- [x] Create CSS variables for theming (animations, transitions, glassmorphism)

## Phase 2: Core Layout & Scroll Engine ✓
- [x] Create full-viewport horizontal scroll container (100vh, dynamic width)
- [x] Implement auto-scroll mechanism (~10% screen width/second, configurable)
- [x] Add scroll wheel detection to jump between sections
- [x] Build pause/resume scroll logic (for hover interactions)
- [x] Ensure smooth CSS transitions for scroll speed changes

## Phase 3: Section & Card Components ✓
- [x] Build Section Intro Card component (logo, title, category, description, background color, ghosted background image)
- [x] Build Project Card component (image/video thumbnail, title, date)
- [x] Apply modern card styling (rounded corners, subtle shadows, glassmorphism borders)
- [x] Implement vertical randomization for project cards (seeded pseudo-random, ±100px range)
- [x] Handle video type projects (SVG play button overlay, gradient bottom)
- [x] Ensure cards don't overlap horizontally (flex layout with gap-16)
- [x] Add subtle hover states (lift, glow, scale on image, URL indicator)

## Phase 4: Parallax System ✓
- [x] Create parallax layer container structure (3 layers)
- [x] Implement Layer 1: Intro card and project cards (foreground, normal scroll speed)
- [x] Implement Layer 2: backgroundImage-2 (mid-ground, 0.6x scroll speed)
- [x] Implement Layer 3: backgroundImage-3 (background, 0.3x scroll speed)
- [x] Handle background image sizing (viewport height, horizontal repeat)
- [x] Isolate parallax backgrounds per section (contained within projects area)
- [x] Use CSS 3D transforms for hardware acceleration (translate3d, willChange, .gpu class)

## Phase 5: Interactions & Animations ✓
- [x] Implement 750ms hover delay detection on project cards
- [x] Build detail card slide-out animation (description, URL link)
- [x] Add zoom effect on hovered card (scale-110)
- [x] Add blur/darken backdrop effect for focus (bg-black/60, backdrop-blur)
- [x] Implement 1000ms blur delay to dismiss detail card
- [x] Smooth transition when resuming auto-scroll (lerp interpolation)
- [x] Add subtle entrance animations for cards (fade-in + slide-up via IntersectionObserver)
- [x] Arrow key navigation (left/right to jump sections)
- [x] Smart back navigation (goes to section start if in middle)

## Phase 6: Timeline Progress Bar ✓
- [x] Create fixed top bar component (64px height, glassmorphism/translucent)
- [x] Display section markers along the timeline (subtle dots or lines)
- [x] Show current position indicator (animated, glowing accent)
- [x] Display current date/year as user progresses (clean typography)
- [x] Optional: Allow clicking section markers to jump
- [x] Ensure bar blends with content below (backdrop blur, subtle border)

## Phase 7: Mobile & Touch Support ✓
- [x] Detect touch devices (useTouchDevice hook)
- [x] Replace hover with tap-to-expand for project cards
- [x] Tap outside card to dismiss and resume scroll
- [x] Adjust card sizes and spacing for smaller screens (already responsive)
- [x] Touch interactions optimized (immediate pause on tap)

## Phase 8: Outro & Final Polish ✓
- [x] Create outro card component (contact info, social links)
- [x] Add "Start Again" button to loop back to beginning
- [x] Implement image/video preloading strategy
- [x] Add loading state for initial content
- [x] Performance audit (60fps scroll, no jank) - build passes
- [x] Cross-browser testing - uses standard APIs
- [x] Final responsive adjustments - OutroCard responsive (50vw desktop, 100vw mobile)

---

## Technical Notes

**Performance Priorities:**
- Use `transform: translate3d()` for all animations (GPU acceleration)
- Apply `will-change` sparingly on animated elements
- Lazy load images/videos outside viewport
- Use CSS-only parallax where possible (perspective + translateZ)

**Key Dependencies to Consider:**
- Native CSS/JS first approach
- Framer Motion if complex animations need orchestration
- Intersection Observer for viewport-based loading

**Data File Location:** `/public/data/portfolio.json`

# ArcFolio

A cinematic, horizontal-scrolling portfolio built with Next.js. Configure your entire site through a single JSON file — add sections, projects, and contact info, and ArcFolio handles the rest.

## Features

- **Horizontal Timeline** — Auto-scrolling, date-based navigation through your career
- **Parallax Backgrounds** — Multi-layer depth effects behind project cards
- **Variable-Width Project Cards** — Cards size to their image aspect ratio with hover/tap interactions
- **Responsive** — Optimized for desktop and mobile with touch support
- **SEO Ready** — Full Open Graph, structured data, and meta tag support via `meta` config
- **Keyboard & Wheel Navigation** — Arrow keys, spacebar, scroll wheel, and touch gestures
- **Image Preloading** — Asset preloading with progress indicator

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:inkorange/arcfolio.git
cd arcfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your portfolio.

### Building for Production

```bash
npm run build
npm start
```

## Configuration

All portfolio content is configured through a single JSON file at `public/data/portfolio.json`.

> **Quick Start:** Copy [`public/data/sample.jsonc`](public/data/sample.jsonc) to `portfolio.json` and replace the placeholder content with your own. The sample includes inline comments explaining every field.

### Top-Level Structure

```json
{
  "meta": { ... },
  "config": { ... },
  "sections": [ ... ],
  "outro": { ... }
}
```

---

### Meta (SEO & Site Metadata)

Used for `<head>` tags, Open Graph, and structured data.

```json
{
  "meta": {
    "title": "Your Name | Your Title",
    "description": "A short bio or tagline.",
    "siteUrl": "https://yoursite.com",
    "ogImage": "/images/og-image.jpg",
    "author": {
      "name": "Your Name",
      "jobTitle": "Software Engineer",
      "email": "you@example.com",
      "url": "https://yoursite.com"
    },
    "social": {
      "twitter": "@yourhandle",
      "github": "https://github.com/yourhandle",
      "linkedin": "https://linkedin.com/in/yourhandle"
    },
    "keywords": ["portfolio", "developer"],
    "themeColor": "#0a0a12",
    "locale": "en_US"
  }
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | Yes | Browser tab title and OG title |
| `description` | string | Yes | Meta description for search engines |
| `siteUrl` | string | Yes | Canonical URL of your deployed site |
| `ogImage` | string | No | Open Graph image path (1200x630 recommended) |
| `author` | object | Yes | Author info (`name` required; `jobTitle`, `email`, `url` optional) |
| `social` | object | No | Social profiles (`twitter`, `github`, `linkedin`) |
| `keywords` | string[] | No | Meta keywords |
| `themeColor` | string | No | Browser theme color |
| `locale` | string | No | Open Graph locale (default: `en_US`) |

---

### Config (Scroll Behavior)

```json
{
  "config": {
    "scrollSpeed": 10,
    "hoverDelay": 500,
    "blurDelay": 500
  }
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `scrollSpeed` | number | 10 | Auto-scroll speed (% of viewport width per second) |
| `hoverDelay` | number | 500 | ms before hovering a card pauses auto-scroll |
| `blurDelay` | number | 500 | ms after leaving a card before auto-scroll resumes |

---

### Sections

Each section is a chapter in your timeline with a full-screen intro and project cards. Order them chronologically — the timeline bar maps `startDate` to position.

```json
{
  "title": "Company Name",
  "category": "Work Experience",
  "position": "Senior Developer",
  "logo": "/images/company/logo.png",
  "backgroundColor": "#1a1a2e",
  "description": "Brief description of your role.",
  "startDate": "2020-01-15",
  "backgroundImage1": "/images/company/hero.jpg",
  "backgroundImage2": "/images/company/parallax-mid.jpg",
  "backgroundImage3": "/images/company/parallax-far.jpg",
  "projects": [...]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | Yes | Section heading (company, school, or collection name) |
| `category` | string | Yes | Label above the date (e.g. "Education", "Work Experience") |
| `position` | string | No | Job title or role, shown under the heading |
| `logo` | string | No | Logo image displayed above the title |
| `backgroundColor` | string | Yes | CSS color for the section background |
| `description` | string | Yes | Brief description of the section |
| `startDate` | string | Yes | ISO date (YYYY-MM-DD) — positions on the timeline |
| `backgroundImage1` | string | No | Intro screen background (25% opacity) |
| `backgroundImage2` | string | No | Parallax layer — medium scroll speed |
| `backgroundImage3` | string | No | Parallax layer — slow scroll speed |
| `projects` | array | Yes | Array of project objects |

---

### Projects

Projects are displayed as interactive cards. Card width is determined by the image aspect ratio, constrained to a max height of 75vh.

```json
{
  "title": "Project Name",
  "description": "What this project is about.",
  "url": "https://example.com/project",
  "date": "2020-06-15",
  "media": "/images/projects/screenshot.jpg",
  "type": "image"
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | Yes | Card heading |
| `description` | string | Yes | Project description (full text shown on click/tap) |
| `url` | string \| null | No | Link to live project — use `null` for no link |
| `date` | string | No | Display date (YYYY-MM-DD) — omit to hide |
| `media` | string | Yes | Path to image or video (relative to `/public`) |
| `type` | string | Yes | `"image"` or `"video"` (video shows a play overlay) |

---

### Outro

The final card at the end of the timeline with contact info.

```json
{
  "title": "Let's Connect",
  "description": "A brief call-to-action message.",
  "email": "you@example.com",
  "backgroundImage1": "/images/outro-bg.jpg",
  "links": [
    { "label": "LinkedIn", "url": "https://linkedin.com/in/you", "icon": "linkedin" },
    { "label": "GitHub", "url": "https://github.com/you", "icon": "github" }
  ]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | Yes | Outro heading |
| `description` | string | Yes | Call-to-action message |
| `email` | string | No | Contact email (rendered as mailto link) |
| `backgroundImage1` | string | No | Background image for the outro card |
| `links` | array | No | Social/external links |

**Supported link icons:** `linkedin`, `github`, `twitter`

---

## Controls

| Input | Action |
|-------|--------|
| `Space` | Start / Pause / Resume scrolling |
| `←` / `→` | Jump to previous / next section |
| `Escape` | Close focused project card |
| Scroll wheel | Navigate between sections |
| Timeline markers | Click to jump to any section |

## Adding Images

Place images in `public/images/` and reference them with paths starting from `/images/`:

```
public/
  images/
    company-name/
      logo.png
      hero.jpg
      project-1.jpg
```

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Runtime:** [React 19](https://react.dev/)

## License

MIT

---

Built with ArcFolio

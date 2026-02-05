# ArcFolio

A cinematic, horizontal-scrolling portfolio experience built with Next.js. ArcFolio transforms your professional history into an immersive visual journey, perfect for creatives, developers, and professionals who want to showcase their work in a memorable way.

## Features

- **Horizontal Timeline Navigation** - Scroll through your career chronologically with smooth, auto-scrolling animation
- **Parallax Backgrounds** - Multi-layer parallax effects create depth and visual interest
- **Interactive Project Cards** - Hover or tap to pause and explore project details
- **Date-Based Timeline** - Visual timeline shows your journey from start to present
- **Responsive Design** - Optimized for both desktop and mobile experiences
- **Touch Support** - Full touch device support with intuitive gestures
- **Image Preloading** - Smart asset preloading with progress indicator
- **Keyboard Navigation** - Full keyboard control for accessibility

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

All portfolio content is configured through a single JSON file located at `public/data/portfolio.json`.

### Configuration Structure

```json
{
  "config": {
    "scrollSpeed": 10,
    "hoverDelay": 750,
    "blurDelay": 500
  },
  "sections": [...],
  "outro": {...}
}
```

### Config Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `scrollSpeed` | number | 10 | Auto-scroll speed (percentage of viewport width per second) |
| `hoverDelay` | number | 750 | Milliseconds before hover triggers pause |
| `blurDelay` | number | 500 | Milliseconds before scroll resumes after leaving a card |

### Section Structure

Each section represents a chapter in your professional journey (education, job, project collection, etc.):

```json
{
  "title": "Company Name",
  "category": "Work Experience",
  "position": "Senior Developer",
  "logo": "/images/company/logo.png",
  "backgroundColor": "#1a1a2e",
  "description": "Brief description of your role and accomplishments.",
  "startDate": "2020-01-15",
  "backgroundImage1": "/images/company/hero.jpg",
  "backgroundImage2": "/images/company/parallax-bg.jpg",
  "backgroundImage3": "/images/company/parallax-fg.jpg",
  "projects": [...]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | Yes | Section title (company, school, or project name) |
| `category` | string | Yes | Category label (e.g., "Work", "Education", "Freelance") |
| `position` | string | No | Your role or title |
| `logo` | string | No | Path to logo image |
| `backgroundColor` | string | Yes | CSS color for section background |
| `description` | string | Yes | Brief description of the section |
| `startDate` | string | Yes | ISO date string (YYYY-MM-DD) |
| `backgroundImage1` | string | No | Hero/intro background image |
| `backgroundImage2` | string | No | Parallax layer (medium speed) |
| `backgroundImage3` | string | No | Parallax layer (slow speed) |
| `projects` | array | Yes | Array of project objects |

### Project Structure

Projects are displayed as interactive cards within each section:

```json
{
  "title": "Project Name",
  "description": "Detailed description of the project and your contributions.",
  "url": "https://example.com/project",
  "date": "2020-06-15",
  "media": "/images/projects/screenshot.jpg",
  "type": "image"
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | Yes | Project title |
| `description` | string | Yes | Project description |
| `url` | string | No | Link to live project or case study |
| `date` | string | Yes | Project completion date (YYYY-MM-DD) |
| `media` | string | Yes | Path to project image or video |
| `type` | string | Yes | Media type: `"image"` or `"video"` |

### Outro Structure

The outro appears at the end of the timeline with contact information:

```json
{
  "title": "Let's Connect",
  "description": "A brief message inviting visitors to reach out.",
  "email": "your@email.com",
  "links": [
    {
      "label": "LinkedIn",
      "url": "https://linkedin.com/in/yourprofile",
      "icon": "linkedin"
    }
  ]
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | Yes | Outro heading |
| `description` | string | Yes | Call-to-action message |
| `email` | string | No | Contact email address |
| `links` | array | No | Array of social links |

**Supported Icons:** `linkedin`, `github`, `twitter`, `email`

## Keyboard Controls

| Key | Action |
|-----|--------|
| `Space` | Start / Pause / Resume scrolling |
| `←` Arrow Left | Jump to previous section |
| `→` Arrow Right | Jump to next section |
| `Escape` | Close focused project card |

## Adding Images

Place your images in the `public/images/` directory. Reference them in your configuration with paths starting from `/images/`:

```
public/
  images/
    company-name/
      logo.png
      hero.jpg
      project-1.jpg
      project-2.jpg
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

# SWL Training Hub

A modern, interactive learning platform built with Next.js. Features an intuitive module-based course structure with animated card sliders and progress tracking.

## Features

- **Module Slider** - Horizontal scrollable cards displaying training modules
- **Interactive Hover Effects** - Cards reveal details and expand color bars on hover
- **Zoom Modal** - Clicking a module opens an animated detail view with progress indicator
- **Lesson Navigation** - Each module contains its own lesson slider
- **Progress Tracking** - Visual progress indicators for each module
- **Responsive Design** - Works across desktop and mobile devices

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [CSS Modules](https://github.com/css-modules/css-modules) - Scoped component styles
- [Prismic CMS](https://prismic.io/) - Headless content management

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/nolafs/swl-training-hub.git
cd swl-training-hub

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Prismic repository name
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   └── module/[uid]/      # Module and lesson routes
├── components/            # React components
│   ├── ModuleCard/        # Module card with hover effects
│   ├── ModuleSlider/      # Horizontal module carousel
│   ├── ModuleDetail/      # Module detail modal
│   ├── LessonCard/        # Lesson card component
│   ├── LessonSlider/      # Lesson carousel
│   └── LessonDetail/      # Lesson detail modal
└── prismicio.ts           # Prismic CMS configuration
```

## Configuration

### Prismic CMS

1. Create a [Prismic](https://prismic.io/) repository
2. Add your repository name to `.env.local`:
   ```
   NEXT_PUBLIC_PRISMIC_REPOSITORY=your-repo-name
   ```
3. Configure content types: `homepage`, `module`, `lesson`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Security

See [SECURITY.md](SECURITY.md) for security policy and reporting vulnerabilities.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

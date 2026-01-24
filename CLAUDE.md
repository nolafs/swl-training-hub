# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SWL Training Hub - is very simple web application for learning home page will have slider containing each module, when rollover it will show detail text and color of the module in square. the square of the module is simple, just module number small color bar at the bottom. when rollover the color bar will increase bit in height. When clicking on the module square in slider, it will zoom towards you with nice shadow to make look it hovers over the page, some detail text appears and smal box with next arrow button appears from behind and on left side a box with module progression. when clicking next, it opens a new route for the module wihich contains a similar slider that will then open to detail section of the lesson in that module.

here is design on figma: https://www.figma.com/design/YqYr66XHvNsNR0nUuehJ24/Learning-videos?node-id=0-1&t=UCXvUqiunrwKYUq0-1

## Build & Development Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run commit   # Interactive commit with conventional format
```

### Versioning

Uses semantic-release with Conventional Commits. Commits to `main` trigger automatic releases.

Commit format: `type(scope): description`

- `feat:` → minor version bump
- `fix:` → patch version bump
- `BREAKING CHANGE:` in footer → major version bump

## Architecture

Next.js 16 App Router with TypeScript. Uses CSS Modules for component styling combined with Tailwind CSS for utilities. Prismic CMS for content management.

### Route Structure

- `/` - Homepage with ModuleSlider showing all training modules
- `/module/[uid]` - Module page with LessonSlider showing lessons in that module
- `/module/[uid]/lesson/[lessonId]` - Individual lesson content page

### Component Pattern

Each component lives in `src/components/[ComponentName]/` with:

- `ComponentName.tsx` - React component (client components use "use client")
- `ComponentName.module.css` - CSS Module styles
- `index.ts` - Re-export for clean imports

Key components:

- `ModuleSlider` / `LessonSlider` - Horizontal scrollable card containers
- `ModuleCard` / `LessonCard` - Interactive cards with hover animations (color bar expands on hover)
- `ModuleDetail` / `LessonDetail` - Modal overlays that zoom in when a card is clicked

### Prismic CMS

Configuration in `src/prismicio.ts`. Set `NEXT_PUBLIC_PRISMIC_REPOSITORY` in `.env.local`.

Content types to configure in Prismic:

- `homepage` - Main landing page
- `module` - Training module with color, title, description
- `lesson` - Lesson content within a module

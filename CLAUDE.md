# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Project Overview

SWL Training Hub — a Next.js 16 training platform. Home page shows a horizontal ModuleSlider; clicking a module card zooms it in-place (with shadow and detail panel). Clicking through opens `/module/[uid]` which has a LessonSlider; clicking a lesson opens `/module/[uid]/lesson/[lessonId]`.

Figma design: https://www.figma.com/design/YqYr66XHvNsNR0nUuehJ24/Learning-videos?node-id=0-1&t=UCXvUqiunrwKYUq0-1

## Build & Development Commands

```bash
npm run dev           # Development server at localhost:3000
npm run build         # Production build
npm run start         # Production server
npm run lint          # ESLint
npm run format        # Prettier (fix)
npm run format:check  # Prettier (check only)
npm run slicemachine  # Slice Machine UI for Prismic slice development
npm run commit        # Interactive conventional commit (Commitizen)
```

No test suite is configured.

### Versioning

Semantic-release on `main`. Commit format: `type(scope): description`

- `feat:` → minor bump
- `fix:` → patch bump
- `BREAKING CHANGE:` in footer → major bump

## Architecture

Next.js 16 App Router · TypeScript · Tailwind CSS 4 · CSS Modules · Prismic CMS · Zustand · Framer Motion · GSAP

### Route Structure

- `/` — Homepage (`src/app/page.tsx`) — ModuleSlider + Prismic SliceZone
- `/module/[uid]` — Module page with LessonSlider
- `/module/[uid]/lesson/[lessonId]` — Individual lesson
- `/(pages)/[uid]` — Generic CMS-driven pages
- `/slice-simulator` — Slice Machine development preview
- `/api/preview`, `/api/exit-preview`, `/api/revalidate` — Prismic ISR/preview

### Component Organisation

Components live under `src/components/` in two sub-trees:

- `features/` — business-logic components grouped by domain (`module/`, `lesson/`, `page-color/`, `settings/`, `downloads/`)
- `ui/` — unstyled Radix UI primitives wrapped with Tailwind + CSS Modules (button, dialog, progress, tooltip, scroll-area, …)

Each leaf component folder contains `ComponentName.tsx`, `ComponentName.module.css` (if needed), and `index.ts` re-export.

### Styling

Two-layer approach:

1. **Tailwind CSS 4** — utility classes everywhere. Global CSS variables in `src/app/globals.css` use `oklch()` colour space. Theme customised via `@theme inline {}`.
2. **CSS Modules** — component-scoped, used for complex layouts and keyframe animations (zoom-in, slide-in, etc.).

Animations use both Framer Motion (React components) and GSAP (imperative/timeline).

### State Management

- **Zustand** store at `src/lib/store/learn-progress-store.ts` — tracks course structure, lesson/module completion. Loaded in root layout and passed to `LearnProgressStoreProvider`.
- **React Context** — `PageColorProvider` (`src/components/features/page-color/`) for animated colour transitions between routes.

### Prismic CMS

Client configured in `src/prismicio.ts` via `NEXT_PUBLIC_PRISMIC_REPOSITORY` env var (defaults to `'swltaininghub'`).

Caching: `force-cache` with `'prismic'` tag in production; 5-second revalidation in development.

**Content types:**
- `settings` — site-wide title, description, favicon, canonical URL
- `page` — generic pages with slices
- `module` — position, title, description, colour, lessons (relation)
- `lesson` — title, description, cover_image, video, type

**Slices** (auto-generated, do not edit by hand — use `npm run slicemachine`):
- `src/slices/` — Hero, Text, Media, IconTextHighlight
- ESLint ignores `src/slices/**` and `prismicio-types.d.ts`

### Environment Variables

```
NEXT_PUBLIC_PRISMIC_REPOSITORY=swltaininghub
NEXT_PUBLIC_BASE_URL=https://your-site.com
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GTM-XXXXXX   # optional; enables cookie consent banner
```

### Path Alias

`@/*` → `./src/*` (configured in `tsconfig.json`).

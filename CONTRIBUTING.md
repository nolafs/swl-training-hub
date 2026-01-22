# Contributing to SWL Training Hub

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/swl-training-hub.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Start development server: `npm run dev`

## Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation.

**Use the interactive commit tool:**
```bash
npm run commit
```

**Or write commits manually:**
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | Minor |
| `fix` | Bug fix | Patch |
| `docs` | Documentation only | None |
| `style` | Formatting, no code change | None |
| `refactor` | Code change, no new feature or fix | None |
| `perf` | Performance improvement | Patch |
| `test` | Adding tests | None |
| `chore` | Maintenance tasks | None |
| `ci` | CI/CD changes | None |
| `build` | Build system changes | None |

**Breaking changes:** Add `BREAKING CHANGE:` in the footer or `!` after type for major version bump.

**Examples:**
```
feat: add lesson progress indicator
fix: resolve hover animation on mobile
feat(slider)!: redesign module card API
docs: update installation instructions
```

### Code Style

- Run `npm run lint` before committing
- Use TypeScript for all new files
- Follow existing component patterns (see `src/components/`)
- Use CSS Modules for component styles
- Prefer Tailwind utilities for layout and spacing

### Component Structure

New components should follow this structure:

```
src/components/ComponentName/
├── ComponentName.tsx         # React component
├── ComponentName.module.css  # CSS Module styles
└── index.ts                  # Re-export
```

## Pull Requests

1. Ensure your code passes linting: `npm run lint`
2. Ensure the build succeeds: `npm run build`
3. Update documentation if needed
4. Fill out the PR template completely
5. Link related issues

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Changes tested locally
- [ ] Documentation updated (if applicable)
- [ ] No new warnings or errors

## Reporting Issues

When reporting issues, include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser/environment details
- Screenshots (if applicable)

## Questions?

Open a discussion or issue if you have questions about contributing.
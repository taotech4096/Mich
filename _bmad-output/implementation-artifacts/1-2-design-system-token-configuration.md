# Story 1.2: Design System & Token Configuration

Status: in-progress

## Story

As a developer,
I want to configure the Mich design system with shadcn/ui, brand colors, typography, and spacing tokens,
So that all future components use a consistent, premium brand identity.

## Acceptance Criteria

1. **Given** the initialized Hydrogen project, **When** shadcn/ui is installed and configured, **Then** base UI components are available in `/app/components/ui/` (Button, Card, Badge, Sheet, ToggleGroup, Skeleton, Toast, Accordion, Separator, Dialog, Input, Select, Tooltip), **And** components are copied as owned code, not imported from a package.

2. **Given** the Tailwind v4 CSS config, **When** Mich design tokens are configured, **Then** the color palette includes: gold (#C6A855), cream (#FAF6EE), dark (#1A1612), burlap (#8B7355), terracotta (#C45B3E), plus product-line accents lebanese green (#1B4332) and greek blue (#1B3A5C), **And** product-line theming is enabled via `[data-product-line]` CSS variable scoping.

3. **Given** the design system configuration, **When** web fonts are loaded, **Then** Playfair Display is used for headings/display text (700 weight), **And** Inter is used for body/UI text (400 weight), **And** font loading does not block page rendering (swap strategy).

4. **Given** the configured design tokens, **When** a Button component is rendered with the primary variant, **Then** it displays with gold background (#C6A855) and dark text (#1A1612), **And** focus state shows a gold outline ring (2px, 2px offset).

## Tasks

- [ ] Task 1: Install shadcn/ui
- [ ] Task 2: Configure Mich design tokens in Tailwind v4 CSS
- [ ] Task 3: Add web fonts (Playfair Display + Inter)
- [ ] Task 4: Add shadcn/ui components
- [ ] Task 5: Configure product-line theming via data attributes
- [ ] Task 6: Customize Button primary variant with gold styling

## Dev Notes

- Tailwind v4 uses CSS `@theme` blocks, NOT `tailwind.config.ts`
- shadcn/ui aliases must use `~/` (Hydrogen convention), not `@/`
- Product-line theming uses CSS custom property overrides under `[data-product-line]` selectors (cannot nest `@theme`)
- Google Fonts loaded via `links()` in root.tsx with `display=swap`
- `@tailwindcss/vite` plugin must come first in vite.config.ts plugin array

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|

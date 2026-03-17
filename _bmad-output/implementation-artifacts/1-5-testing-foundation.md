# Story 1.5: Testing Foundation

Status: done

## Story

**Implements:** *(infrastructure — no direct FR)*

As a developer,
I want Vitest configured with co-located test patterns and basic test utilities,
So that all future stories can include tests from the start.

## Acceptance Criteria

1. **Given** the Hydrogen project, **When** Vitest is configured, **Then** `vitest.config.ts` is created with TypeScript support and path aliases matching the project, **And** a `tests/setup.ts` file provides global test setup.

2. **Given** the testing setup, **When** `npm run test` is executed, **Then** Vitest discovers and runs all `*.test.ts` and `*.test.tsx` files co-located next to their source files.

3. **Given** the Layout component from Story 1.3, **When** a smoke test is written as `Layout.test.tsx`, **Then** it verifies the Layout renders Header, Footer, and BottomTabBar, **And** it verifies the skip link "Ir al contenido" is present, **And** the test passes successfully.

4. **Given** the testing configuration, **When** a developer creates a new component, **Then** they can create a co-located `ComponentName.test.tsx` file that is automatically discovered by Vitest.

## Tasks / Subtasks

- [ ] Task 1: Install Vitest and testing dependencies
  - [ ] 1.1 Install vitest, @testing-library/react, @testing-library/jest-dom, jsdom
  - [ ] 1.2 Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts to package.json

- [ ] Task 2: Create vitest.config.ts
  - [ ] 2.1 Configure with jsdom environment for React component testing
  - [ ] 2.2 Set up path aliases matching tsconfig (`~/*` → `app/*`)
  - [ ] 2.3 Reference tests/setup.ts as global setup file
  - [ ] 2.4 Include `*.test.ts` and `*.test.tsx` patterns

- [ ] Task 3: Create tests/setup.ts
  - [ ] 3.1 Import @testing-library/jest-dom for DOM matchers (toBeInTheDocument, etc.)

- [ ] Task 4: Write WhatsAppCTA.test.tsx smoke test (AC: deferred from Story 1.4)
  - [ ] 4.1 Test: renders with aria-label "Contactar por WhatsApp"
  - [ ] 4.2 Test: generates generic message when not on product page
  - [ ] 4.3 Test: WhatsApp URL is correctly formed

- [ ] Task 5: Verify test discovery and run
  - [ ] 5.1 Run `npm run test` and confirm all tests pass
  - [ ] 5.2 Verify co-located test files are auto-discovered

## Dev Notes

- Vitest is Vite-native — shares the same config pipeline, fast startup
- Use jsdom environment (not happy-dom) for broader compatibility
- Path aliases must match tsconfig: `~/*` → `./app/*`
- Architecture mandates co-located tests: `Component.test.tsx` next to `Component.tsx`
- Layout.test.tsx from AC #3 requires mocking Hydrogen/React Router context — may be complex; start with simpler WhatsAppCTA test

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Created | `vitest.config.ts` | Vitest config with jsdom, path aliases, co-located test discovery |
| Created | `tests/setup.ts` | Global setup importing @testing-library/jest-dom matchers |
| Created | `app/components/WhatsAppCTA.test.tsx` | 4 tests for WhatsAppCTA (aria-label, messages, new tab) |
| Modified | `package.json` | Added test/test:watch scripts, vitest + testing-library deps |

### File List
- `mitchweb/vitest.config.ts` (new)
- `mitchweb/tests/setup.ts` (new)
- `mitchweb/app/components/WhatsAppCTA.test.tsx` (new)
- `mitchweb/package.json` (modified)

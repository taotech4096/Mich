# Story 1.1: Project Initialization & Deployment Pipeline

Status: ready-for-dev

## Story

As a developer,
I want to initialize the Hydrogen Skeleton project with TypeScript and Tailwind CSS and deploy it to Oxygen via GitHub,
So that we have a working, deployed storefront foundation to build upon.

## Acceptance Criteria

1. **Given** no project exists yet, **When** the developer runs the Hydrogen init command, **Then** a Hydrogen project is created with TypeScript, Tailwind CSS, Vite 6, and all auto-scaffolded routes, **And** the project connects to the MitchWeb Shopify store via Storefront API access token.

2. **Given** the project is initialized and pushed to GitHub, **When** code is pushed to the `main` branch, **Then** Oxygen auto-deploys the storefront to a production URL, **And** PR branches generate preview deployment URLs.

3. **Given** the project is initialized, **When** a developer clones the repository, **Then** a `.env.example` file documents all required environment variables (`PUBLIC_STOREFRONT_API_TOKEN`, `PUBLIC_STORE_DOMAIN`, `SESSION_SECRET`), **And** `.env` is listed in `.gitignore`.

4. **Given** the deployed storefront, **When** accessed on a mobile device over 4G, **Then** the default skeleton page loads with LCP < 2.5s.

## Tasks / Subtasks

- [ ] Task 1: Initialize Hydrogen Project (AC: #1)
  - [ ] 1.1 Run `npm create @shopify/hydrogen@latest -- --path mitchweb --language ts --styling tailwind --markets none --git --install-deps`
  - [ ] 1.2 Verify scaffolded project structure: `app/routes/`, `app/styles/tailwind.css`, `vite.config.ts`, `routes.ts`
  - [ ] 1.3 Verify Vite 6 + React Router 7 framework mode is configured (check `hydrogen.v3preset()` in vite config)
  - [ ] 1.4 Verify Tailwind v4 CSS-based configuration in `app/styles/tailwind.css` (uses `@import "tailwindcss"` not `@tailwind` directives)
  - [ ] 1.5 Verify auto-scaffolded routes exist: products, collections, cart, account, search, pages, webhooks
  - [ ] 1.6 Run `npm run dev` and confirm local dev server starts without errors

- [ ] Task 2: Configure Shopify Store Connection (AC: #1)
  - [ ] 2.1 Create `.env` file with Shopify Storefront API credentials
  - [ ] 2.2 Run `npx shopify hydrogen link` to connect to MitchWeb Shopify store
  - [ ] 2.3 Verify GraphQL queries return product data from the connected store
  - [ ] 2.4 Set `lang="es-MX"` on the `<html>` element in `root.tsx`

- [ ] Task 3: Create `.env.example` (AC: #3)
  - [ ] 3.1 Create `.env.example` with all required env vars (no secrets):
    ```
    PUBLIC_STOREFRONT_API_TOKEN=
    PUBLIC_STORE_DOMAIN=
    PUBLIC_STOREFRONT_ID=
    SESSION_SECRET=
    ```
  - [ ] 3.2 Verify `.env` is in `.gitignore` (should be by default from init)

- [ ] Task 4: Deploy to Oxygen via GitHub (AC: #2)
  - [ ] 4.1 Create GitHub repository for MitchWeb
  - [ ] 4.2 Push initial project to GitHub `main` branch
  - [ ] 4.3 Connect GitHub repo to Hydrogen storefront in Shopify Admin
  - [ ] 4.4 Set environment variables in Oxygen Admin (production environment)
  - [ ] 4.5 Verify auto-deploy triggers on push to `main`
  - [ ] 4.6 Verify PR preview deployments generate URLs
  - [ ] 4.7 Confirm production deployment accessible at Oxygen URL

- [ ] Task 5: Verify Performance (AC: #4)
  - [ ] 5.1 Access deployed storefront on mobile device over 4G
  - [ ] 5.2 Verify skeleton page loads with LCP < 2.5s
  - [ ] 5.3 Verify page weight < 500KB for initial load

## Dev Notes

### Critical Technical Findings

**Hydrogen Version & Framework:**
- Latest Hydrogen: `@shopify/hydrogen@2026.1.1` (February 27, 2026)
- Storefront API version: `2026-01`
- **React Router 7.12.0** (NOT Remix v2) — Hydrogen switched from Remix to React Router 7 framework mode in 2025.5.0+
- Vite 6 — migration completed, new projects ship with Vite 6 by default
- Miniflare v3 for local development

**Init Command — IMPORTANT CORRECTIONS from Epics:**
The epics document references `npx shopify hydrogen init` with `--routes` flag. Corrections:
1. `--routes` flag **no longer exists** — routes are always auto-scaffolded
2. Preferred command form is now `npm create @shopify/hydrogen@latest`
3. Both `npx shopify hydrogen init` and `npm create @shopify/hydrogen@latest` work

**Tailwind v4 — SIGNIFICANT CHANGE from Epics:**
- Epics reference `tailwind.config.ts` (Tailwind v3 style)
- Hydrogen now ships with **Tailwind v4** which uses **CSS-based configuration**
- Configuration lives in `app/styles/tailwind.css` using `@theme` blocks, NOT a JS/TS config file
- Uses `@import "tailwindcss"` instead of `@tailwind base/components/utilities`
- This impacts Story 1.2 (Design System) — design tokens will be configured via CSS `@theme` directive, not `tailwind.config.ts`

**Environment Variable Names — CORRECTION from Epics:**
- Epics reference `SHOPIFY_STOREFRONT_ACCESS_TOKEN` — current Hydrogen convention is `PUBLIC_STOREFRONT_API_TOKEN`
- Verify actual names after scaffolding and use whatever the generated project produces

**Vite Config Expected Structure:**
```typescript
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.v3preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true,
        v3_routeConfig: true,
      },
    }),
    tsconfigPaths(),
  ],
});
```

**Routes Configuration (`routes.ts`):**
```typescript
import {flatRoutes} from '@remix-run/fs-routes';
import {type RouteConfig} from '@remix-run/route-config';
import {hydrogenRoutes} from '@shopify/hydrogen';

export default hydrogenRoutes([
  ...(await flatRoutes()),
]) satisfies RouteConfig;
```

**Oxygen Deployment:**
- Connect GitHub repo in Shopify Admin → Hydrogen storefront settings
- Pushes to `main` → automatic production deployments
- PR branches → automatic preview deployment URLs
- Shopify GitHub bot comments on PRs with preview links
- Environment variables managed in Shopify Admin → Hydrogen storefront → "Environments and variables"
- Alternative CLI deployment: `npx shopify hydrogen deploy`
- Push env vars to Oxygen: `npx shopify hydrogen env push`

### Project Structure Notes

**Expected scaffolded structure (post-init):**
```
mitchweb/
├── .env / .env.example
├── package.json / tsconfig.json
├── vite.config.ts / routes.ts
├── public/
│   └── favicon.ico
├── app/
│   ├── entry.client.tsx / entry.server.tsx
│   ├── root.tsx                   # Set lang="es-MX" here
│   ├── styles/
│   │   └── tailwind.css           # Tailwind v4 CSS-based config
│   ├── routes/
│   │   ├── _index.tsx
│   │   ├── products._index.tsx / products.$handle.tsx
│   │   ├── collections._index.tsx / collections.$handle.tsx
│   │   ├── cart.tsx
│   │   ├── search.tsx
│   │   ├── account._index.tsx
│   │   ├── account.orders._index.tsx / account.orders.$id.tsx
│   │   ├── pages.$handle.tsx
│   │   ├── policies.$handle.tsx
│   │   └── webhooks.tsx
│   ├── components/               # Flat architecture
│   │   └── ui/                   # shadcn/ui (Story 1.2)
│   ├── graphql/                  # Shared fragments (Story 2.1+)
│   ├── lib/                      # Utilities
│   └── types/                    # Shared types
```

**Architecture Conventions to Follow:**
- Component naming: PascalCase (`ProductCard.tsx`)
- Route files: Kebab-case (Remix/RR7 convention)
- Utilities: camelCase (`formatPrice.ts`)
- Constants: UPPER_SNAKE_CASE (`MAX_DELIVERY_ZONES`)
- Types: PascalCase, no `I` prefix (`DeliveryZone`)
- One component per file in `/app/components/`
- Co-located tests: `Component.test.tsx` next to `Component.tsx`
- GraphQL fragments in `/app/graphql/` when shared across 2+ routes
- Shopify helpers in `/app/lib/shopify/`

**Caching Strategy (for awareness — implemented in later stories):**
- Long (24h): Collections, static content, zone data
- Short (1-5min): Products
- None: Cart, checkout, account

**Performance Targets:**
- LCP < 2.5s on 4G mobile
- TTI < 3.5s
- Page weight < 500KB
- Lighthouse > 90

### What NOT to Do in This Story

- Do NOT install shadcn/ui yet (Story 1.2)
- Do NOT configure design tokens/colors (Story 1.2)
- Do NOT build Layout/Header/Footer/BottomTabBar (Story 1.3)
- Do NOT build WhatsApp CTA (Story 1.4)
- Do NOT configure Vitest (Story 1.5)
- Do NOT create webhook HMAC verification helpers yet (Story 5.2)
- Do NOT add web fonts (Story 1.2)
- Do NOT modify auto-scaffolded routes beyond setting `lang="es-MX"`
- Keep the skeleton minimal — verify it works and deploys, nothing more

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.1]
- [Source: _bmad-output/planning-artifacts/architecture.md — Technical Stack, Code Structure, Deployment sections]
- [Source: _bmad-output/planning-artifacts/prd.md — MVP scope, performance targets, integration requirements]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Mobile-first requirements, design system foundation]
- [Source: Hydrogen 2026.1.1 release notes — latest API versions, React Router 7 migration]
- [Source: Shopify CLI hydrogen init reference — verified flags and options]
- [Source: shadcn/ui React Router installation docs — compatibility confirmation]

## Dev Agent Record

### Agent Model Used

(To be filled by dev agent)

### Debug Log References

### Completion Notes List

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|

### File List

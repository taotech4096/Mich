---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-03-07'
updatedAt: '2026-03-07'
updateReason: 'Synchronized with UX Design Specification decisions'
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/product-brief-MitchWeb-2026-02-20.md"
  - "_bmad-output/planning-artifacts/explanation-headless-ecommerce.md"
  - "_bmad-output/planning-artifacts/ux-design-specification.md"
workflowType: 'architecture'
project_name: 'MitchWeb'
user_name: 'Taotech'
date: '2026-03-04'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (53 FRs across 9 categories):**

| Category | FRs | MVP | Phase 2+ | Architectural Weight |
|---|---|---|---|---|
| Product Discovery & Catalog | FR1-6 | Yes | — | Low — Hydrogen product pages + Storefront API |
| Ordering & Checkout | FR7-14 | Yes | — | Medium — custom delivery day/zone logic |
| Post-Purchase & Order Management | FR15-18 | Yes | — | Low — Shopify + webhook notifications |
| Conversational Commerce (WhatsApp) | FR19-25 | Yes | — | High — OpenClaw integration, Storefront MCP, escalation flow |
| Subscription Management | FR26-32 | — | Phase 2 | High — Shopify Subscriptions API or third-party, capacity caps |
| Glass Recycling & Sustainability | FR33-37 | — | Phase 2 | Medium — credit tracking, jar return workflow |
| Brand & Content Experience | FR38-42 | Yes | — | Low — static pages, persistent WhatsApp CTA |
| Email Marketing & Retention | FR43-48 | — | Phase 2 | Medium — Klaviyo integration, 6 automated flows |
| Administration & Operations | FR49-53 | Partial | Phase 2-3 | Low — Shopify Admin with custom config |

**Non-Functional Requirements (28 NFRs):**

- **Performance (7):** Mobile-first targets — LCP < 2.5s on 4G, TTI < 3.5s, page weight < 500KB. Hydrogen SSR + Oxygen CDN handles most of this natively.
- **Security (7):** Shopify handles PCI-DSS. Key custom concerns: OpenClaw API isolation (local network only), secrets in env vars, scoped AI agent permissions.
- **Scalability (4):** Shopify infrastructure scales storefront automatically. OpenClaw limited to 20 concurrent WhatsApp conversations. Inventory enforcement must be atomic.
- **Reliability (6):** 99.9% storefront (Shopify SLA), 99% OpenClaw during business hours (self-hosted, needs monitoring). Graceful degradation if OpenClaw is down.
- **Integration Reliability (4):** Circuit breaker pattern for non-critical integrations, webhook retry with exponential backoff.

**Scale & Complexity:**

- Primary domain: Headless e-commerce (frontend-weighted, Shopify-hosted backend)
- Complexity level: Medium
- Estimated architectural components: ~8-10 (Hydrogen storefront, Shopify backend, OpenClaw, Klaviyo, delivery logic, subscription engine, recycling tracker, ops bot, analytics)

### Technical Constraints & Dependencies

| Constraint | Impact |
|---|---|
| Shopify Hydrogen (Remix-based) | Framework is fixed — architecture decisions are within Remix/Hydrogen patterns |
| Oxygen hosting | Edge CDN, zero DevOps, but custom server-side logic limited to Shopify Functions |
| Production capacity (600L/week MVP) | Manual inventory management via Shopify Admin is sufficient through Phase 1. Capacity enforcement is a Phase 2 concern. |
| Delivery days (martes/viernes only) | Custom checkout logic via customer metafield + cart UI (see Pre-Resolved Decisions) |
| Geographic zone (Puebla/Cholula MVP) | Address validation at checkout, zone expansion in later phases |
| Cold chain (2-8°C, 21-30 day shelf life) | Fulfillment window constraints, subscription skip/notify logic |
| Single developer (Taotech) | Architecture must minimize custom code, leverage Shopify ecosystem heavily |
| OpenClaw self-hosted | Customer engagement gateway that funnels to Shopify for transactions (not a parallel commerce system) |
| Mexican regulations (NOM-051, COFEPRIS, CFDI) | Labeling compliance, privacy notice, invoicing capability |

### Cross-Cutting Concerns Identified

1. **Delivery scheduling extensibility** — Martes/viernes constraint affects checkout, subscriptions, fulfillment, and customer notifications. Customer metafield approach chosen for MVP must extend cleanly to Phase 2 subscriptions.
2. **Customer metafield schema** — Schema must accommodate subscription preferences, jar return credits, and product interests when Phase 2 requirements are concrete. MVP fields are strategic minimal.
3. **Brand voice consistency** — OpenClaw WhatsApp bot, email flows, and storefront copy must maintain the same warm, heritage + nutrition dual-messaging tone.
4. **Cold chain awareness** — Inventory management, fulfillment, delivery notifications, and refund/replacement policies all depend on perishability constraints.
5. **Shopify as single transaction engine** — Both web and WhatsApp route through Shopify checkout. Delivery app inventory managed separately. No custom inventory sync needed for MVP.

### Shopify Sufficiency Map

| Area | Shopify Native | Custom Logic Required |
|---|---|---|
| Product catalog & pages | Sufficient | — |
| Checkout & payments | Sufficient | — |
| Inventory tracking | Sufficient for standard e-commerce | Custom: production capacity caps, cross-channel allocation (Phase 2) |
| Delivery scheduling | Partial (Delivery Customization API) | Custom: martes/viernes via customer metafield + cart UI (MVP) |
| Subscriptions | Shopify Subscriptions API or third-party | Custom: capacity-based subscription limits, waitlist (Phase 2) |
| Customer accounts | Sufficient | Custom: jar return credits, recycling stats (Phase 2) |
| Order notifications | Email native | Custom: WhatsApp via OpenClaw webhook |
| Analytics | Shopify Analytics + GA4 | Custom: cross-channel attribution (Shopify + WhatsApp + Rappi) |

### OpenClaw Architectural Profiles

| Aspect | MVP (Stateless Gateway) | Phase 2+ (Commerce Agent) |
|---|---|---|
| Role | Customer engagement gateway that funnels to Shopify for transactions | Stateful commerce agent with customer memory |
| State | Stateless per conversation | Stateful — remembers customer preferences, order history |
| Capabilities | FAQ, catalog browse, checkout link generation | Subscription modification, proactive reorder, product interest tracking |
| Shopify integration | Storefront MCP (read-only) | Storefront MCP + Admin API MCP (write operations) |
| Failure impact | Degraded (web storefront still works) | Significant (subscriptions, reorders affected) |
| Monitoring | Health check endpoint | Full observability (conversation logs, conversion tracking, error rates) |

### Cost-of-Change Classification

| Decision Area | Cost to Change Later | Recommendation |
|---|---|---|
| UI/UX design, component styling | Low | Build minimal for MVP, iterate |
| Product page content & structure | Low | Start simple, enhance with data |
| Data model (customer metafields, order attributes) | High | Design for Phase 2 from day 1 |
| Integration contracts (OpenClaw ↔ Shopify) | High | Define clean MCP + webhook contracts even if MVP uses subset |
| Delivery scheduling approach | Medium-High | Customer metafield chosen (extends to subscriptions) |
| Email flow architecture (Klaviyo) | Low | Phase 2, no MVP investment needed |
| Subscription engine choice | High | Research options in MVP, commit in Phase 2 |

### First Principles Corrections

| Original Assumption | First Principles Revision |
|---|---|
| Hydrogen is the technical architecture | Hydrogen is a **brand experience** choice; non-customer-facing operations stay in Shopify native |
| OpenClaw is a co-primary sales channel | OpenClaw is a **customer engagement gateway** that funnels to Shopify for all transactions |
| Production capacity needs system enforcement | **Manual inventory management** via Shopify Admin is sufficient through Phase 1 |
| Architecture must support all phases without rewrites | Only **delivery scheduling** and **customer metafield schema** need forward-compatible design |
| Multi-channel inventory is the top concern | **Not a real problem** — both web and WhatsApp route through Shopify checkout. Delivery apps are a separate inventory pool |

### Key Architectural Decisions (Pre-Resolved)

1. **Delivery scheduling:** Customer metafield (`custom.delivery_day`) selected via cart UI, copied to order metafield at checkout. Shopify Delivery Customization Function evaluated in Phase 2 if subscriptions need native integration.

2. **Metafield schema (MVP):**
   - Customer: `delivery_day`, `customer_type`, `acquisition_channel`
   - Product: `macros_protein_g`, `macros_fat_g`, `macros_carbs_g`, `is_keto_friendly`, `shelf_life_days`
   - Order: `delivery_day`, `source_channel`
   - No speculative Phase 2 fields.

3. **OpenClaw topology:** Storefront MCP for all Shopify data access. Single `order.created` webhook for WhatsApp confirmation. Phase 2 adds skills (subscription management, proactive reorder) via additional MCP capabilities. No middleware layer.

## Starter Template Evaluation

### Primary Technology Domain

Headless e-commerce (Shopify Hydrogen) — framework is a fixed constraint. Evaluation focused on which Hydrogen template best fits MitchWeb.

**Current Version:** Hydrogen `2026.1.1`, Storefront API `2026-01`, Vite 6, React Router 7.9.2.

### Starter Options Considered

| Template | What You Get | Best For |
|---|---|---|
| **Skeleton** (default via `hydrogen init`) | Core routing logic, auto-scaffolded routes, minimal styling, queries & tooling | Building a custom-branded store from solid foundations |
| **Demo Store** | ~30 pre-built components, Tailwind CSS, full buying journey, Shopify Analytics | Learning reference or rapid prototyping with Shopify's default look |
| **Hello World** | Bare minimum — almost empty | Experiments or extreme customization |

### Selected Starter: Skeleton Template

**Rationale for Selection:**

1. **Custom brand required** — MitchWeb is a Mexican artisan kefir brand with heritage + nutrition dual-messaging. Demo store's generic e-commerce styling would need to be stripped and rebuilt.
2. **Single developer** — Skeleton means every component is understood because it was built intentionally. Demo store has ~30 components creating cognitive overhead.
3. **Custom checkout logic** — Delivery day selection (martes/viernes), zone validation, and WhatsApp CTA are all custom. Starting minimal avoids fighting pre-built patterns.
4. **Routes auto-scaffolded** — As of 2026, `hydrogen init` automatically scaffolds all standard routes, so skeleton is no longer "empty."
5. **Tailwind added at init** — The `--styling` flag adds Tailwind CSS without carrying the demo store's component library.

**Initialization Command:**

```bash
npx shopify hydrogen init --path mitchweb --language ts --styling tailwind --markets none --git --install-deps
```

### Architectural Decisions Provided by Starter

**Language & Runtime:** TypeScript, Remix/React Router 7.x, Vite 6

**Styling Solution:** Tailwind CSS (added via `--styling` flag) + shadcn/ui (Radix UI accessible primitives, copy-paste model)

**UI Component Library:** shadcn/ui — components copied into `/app/components/ui/` as owned code. Provides accessible interactive primitives (Button, Card, Badge, Sheet, Toggle Group, Skeleton, Toast, Accordion, Separator, Dialog, Input, Select, Tooltip) restyled with Mich design tokens. Not a package dependency — full control, no version lock-in.

**Typography:** Playfair Display (headings/display — old-world serif) + Inter (body/UI — clean sans-serif). Loaded as web fonts.

**Build Tooling:** Vite 6 with Hydrogen plugin, Oxygen deployment target

**Testing Framework:** Not included by default — to be decided in subsequent steps

**Code Organization:** Remix file-based routing, auto-scaffolded routes (product, collection, cart, account, search, pages)

**Development Experience:** Vite HMR, Shopify CLI dev server with Oxygen proxy, route module type safety (auto-generated types)

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- No external database — Shopify metafields cover all MVP data needs
- New Customer Accounts (passwordless) for authentication
- Co-located GraphQL queries following Hydrogen conventions
- Vitest as testing framework

**Important Decisions (Shape Architecture):**
- Hydrogen default caching tiers (long/short/none) with delivery zone data on long cache
- HMAC webhook signature verification for OpenClaw integration
- Server-state via Remix loaders, minimal client state (no state management library)
- Flat component architecture in `/app/components/`
- GitHub auto-deploy to Oxygen production
- Mobile-first with two breakpoints (default + `md:` 768px)

**Deferred Decisions (Post-MVP):**
- External database for recycling credits / subscription capacity (Phase 2)
- Error tracking service (Sentry) (Phase 2)
- E2E testing framework (Playwright/Cypress) (Phase 2)
- OpenClaw uptime monitoring (Phase 2)

### Data Architecture

| Decision | Choice | Rationale |
|---|---|---|
| Primary data store | Shopify (products, orders, customers, metafields) | No commerce data lives outside Shopify for MVP |
| External database | None for MVP | OpenClaw self-manages; GA4 handles analytics; metafields cover custom fields |
| Caching strategy | Hydrogen defaults — long (24h) for collections/static, short (1-5min) for products, none for cart/checkout/account | Delivery zone data cached long (zones rarely change) |
| Data validation | Shopify-side validation for commerce data; client-side validation for delivery day/zone selection | Minimal custom validation needed |

### Authentication & Security

| Decision | Choice | Rationale |
|---|---|---|
| Customer accounts | Shopify New Customer Accounts (passwordless) | Zero auth code to maintain, modern UX, Shopify-hosted |
| OpenClaw API security | Local network isolation + Storefront API access token (read-only) | No custom middleware needed |
| Webhook security | HMAC signature verification on `/webhooks` endpoint | Industry standard, only custom security code required |
| Secrets management | Environment variables via Oxygen admin | Never in code, Oxygen supports natively |

### API & Communication Patterns

| Decision | Choice | Rationale |
|---|---|---|
| API layer | Shopify Storefront API (GraphQL) | Fixed by platform choice |
| Query organization | Co-located in route files, shared fragments extracted to `/app/graphql/` | Single developer — simplicity over abstraction |
| Error handling | Remix error boundaries per route + `console.error` to Oxygen logs | Built-in framework capability, sufficient for MVP |
| Webhook architecture | Single `/webhooks` endpoint with topic switch | MVP has one webhook (`order.created`), pattern scales for future additions |

### Frontend Architecture

| Decision | Choice | Rationale |
|---|---|---|
| State management | Remix loaders (server state), no client state library | Client state limited to UI toggles (menus, modals, delivery selector) |
| UI component library | shadcn/ui (Radix UI primitives, copied into `/app/components/ui/`) | Accessible interactive patterns (focus management, keyboard nav, ARIA) without package dependency. Restyled with Mich design tokens. |
| Component organization | `/app/components/` for custom brand components, `/app/components/ui/` for shadcn/ui base components | Custom components compose shadcn/ui primitives + Mich tokens |
| Typography | Playfair Display (headings/display) + Inter (body/UI) | Playfair: old-world serif for brand personality. Inter: clean sans-serif for readability. |
| Color system | Custom warm palette via Tailwind tokens — gold, cream, dark, burlap, terracotta (global) + lebanese green, greek blue (product-line accents) | Product-line theming via `[data-product-line]` CSS variable scoping. Gold is the interaction color. |
| Image optimization | Hydrogen `<Image>` component + Shopify CDN | Auto lazy-loading, responsive sizes, CDN transforms |
| Responsive approach | Mobile-first Tailwind, single breakpoint (`md:` 768px) | Mobile: bottom tab bar, 2-col grid, full-width CTAs. Desktop: top nav, 3-4 col grid, max-w-6xl container. |
| Accessibility target | WCAG 2.1 Level AA | Semantic HTML, 4.5:1 contrast, skip links, keyboard nav, screen reader support via Radix primitives |

### Infrastructure & Deployment

| Decision | Choice | Rationale |
|---|---|---|
| CI/CD | GitHub integration → Oxygen auto-deploy on push to `main` | Zero CI infrastructure to maintain |
| Environments | `main` → production; PR preview URLs via Oxygen | No staging needed for MVP |
| Monitoring | Oxygen built-in logs + GA4 + OpenClaw `/health` endpoint | Sufficient for MVP scale |
| Testing | Vitest for unit/component tests; manual QA for checkout flow | Vite-native, fast, TypeScript-first; E2E deferred to Phase 2 |

### Decision Impact Analysis

**Implementation Sequence:**
1. Project init (skeleton + Tailwind) → establishes all starter decisions
2. shadcn/ui installation + Mich design tokens (colors, typography, spacing in `tailwind.config.ts`) → design system foundation
3. Shopify store connection + metafield schema → data architecture
4. Route scaffolding with co-located queries → API patterns
5. Component library (shadcn/ui base + custom brand components) → frontend architecture
6. Webhook endpoint → OpenClaw integration
7. GitHub → Oxygen deploy pipeline → infrastructure
8. Vitest setup → testing foundation

**Cross-Component Dependencies:**
- shadcn/ui installation + design tokens must precede all component work
- Delivery day toggle (frontend) depends on customer metafield schema (data)
- Webhook endpoint (API) depends on HMAC verification (security)
- OpenClaw WhatsApp confirmation depends on webhook + Storefront MCP
- Preview deployments depend on GitHub integration being configured first
- Product-line theming (`[data-product-line]` CSS variables) must be in place before product components

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 5 areas where AI agents could make different choices — naming, structure, data formats, process handling, and component communication.

### Naming Patterns

| Element | Convention | Example |
|---|---|---|
| Route files | Remix file-based routing (kebab-case) | `products.$handle.tsx`, `collections.$handle.tsx` |
| Components | PascalCase files and exports | `DeliveryDayToggle.tsx` → `export function DeliveryDayToggle()` |
| Utilities/helpers | camelCase files | `formatPrice.ts`, `validateZone.ts` |
| CSS/Tailwind | Component-scoped when needed | `DeliveryDaySelector.module.css` (rare — prefer Tailwind classes) |
| GraphQL fragments | PascalCase, descriptive | `ProductCardFragment`, `CollectionItemFragment` |
| Variables/functions | camelCase | `deliveryDay`, `getProductsByCollection()` |
| Constants | UPPER_SNAKE_CASE | `MAX_DELIVERY_ZONES`, `CACHE_LONG` |
| Types/interfaces | PascalCase, no `I` prefix | `DeliveryZone`, `ProductWithNutrition` |

### Structure Patterns

| Category | Location | Rule |
|---|---|---|
| Route pages | `/app/routes/` | Remix convention, never deviate |
| Reusable components | `/app/components/` | One file per component, custom brand components |
| UI primitives | `/app/components/ui/` | shadcn/ui copied components (Button, Card, Badge, Sheet, ToggleGroup, Skeleton, Toast, Accordion, Separator, Dialog, Input, Select, Tooltip) |
| Shared GraphQL fragments | `/app/graphql/` | Only fragments reused across 2+ routes |
| Utility functions | `/app/lib/` | Pure functions, no side effects |
| Shopify-specific helpers | `/app/lib/shopify/` | Metafield parsing, cache config, webhook verification |
| Types | `/app/types/` | Shared TypeScript types/interfaces |
| Tests | Co-located `*.test.ts` files | `DeliveryDayToggle.test.tsx` next to `DeliveryDayToggle.tsx` |
| Static assets | `/public/` | Hydrogen convention |
| Config | Root directory | `tailwind.config.ts`, `vite.config.ts`, etc. |

### Format Patterns

| Pattern | Rule | Example |
|---|---|---|
| Metafield values | Always parse from string, type-check | `JSON.parse(metafield.value)` with validation |
| Dates in UI | Mexican Spanish locale formatting | `new Intl.DateTimeFormat('es-MX', {...})` |
| Dates in data | ISO 8601 strings | `2026-03-07T00:00:00Z` |
| Currency | MXN, Mexican locale | `new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })` |
| Delivery days | String enum values | `'martes' \| 'viernes'` — never translated to English in code |
| JSON field naming | camelCase (JavaScript convention) | `deliveryDay`, `sourceChannel` |
| Typography — headings | Playfair Display, 700 weight | Hero 2.5rem, H1 2rem, H2 1.5rem, H3 1.25rem |
| Typography — body/UI | Inter, 400 weight | Body 1rem, Small 0.875rem, Caption 0.75rem |
| Typography — prices | Inter, 600-700 weight | Standard 1.25rem, Large 1.5rem |
| Product-line theming | `data-product-line` attribute on container | `[data-product-line="lebanese"]` → green accents, `[data-product-line="greek"]` → blue accents |
| Button hierarchy | One gold primary CTA per screen | Gold bg + dark text (primary), dark bg + gold text (secondary), ghost (back arrows) |

### Process Patterns

| Pattern | Rule |
|---|---|
| Route errors | Remix `ErrorBoundary` export per route — show user-friendly message in Spanish |
| Loading states | Remix handles via SSR — no spinners needed for initial page load. Use `useNavigation()` for in-page transitions |
| Form validation | Client-side validation first (HTML5 + simple JS), server-side in Remix `action` as backup |
| Webhook errors | Log full error to Oxygen logs, return appropriate HTTP status, never expose internals |
| OpenClaw fallback | If OpenClaw is unreachable, WhatsApp CTA still shows (links to WhatsApp directly), storefront operates normally |

### Communication Patterns

| Pattern | Rule |
|---|---|
| Route → Component | Props only. No context providers unless truly global (e.g., cart) |
| Cart state | Use Hydrogen's built-in `useCart()` hook — never build custom cart state |
| Delivery day selection | Store in cart attributes during session, persist to customer metafield at checkout |
| Analytics events | GA4 `gtag()` calls from a single `/app/lib/analytics.ts` helper |
| Feedback patterns | Toast for success (gold accent, auto-dismiss 3s), inline for errors (persist until resolved), Skeleton for loading | One Toast visible at a time. Errors always include forward-path CTA or WhatsApp. |
| Modal/overlay patterns | Sheet (cart slide-in from right), Dialog (notification signup, zone errors), Toast (transient feedback) | Max one overlay at a time. ESC to close. Dark overlay at 60% opacity. |

### Enforcement Guidelines

**All AI Agents MUST:**
1. Follow Remix/Hydrogen file conventions — never invent custom routing or data loading patterns
2. Use Tailwind utility classes — never write custom CSS unless Tailwind cannot express it
3. Keep Spanish-facing strings in components (not extracted to i18n files for MVP) — MitchWeb is Spanish-only
4. Use `es-MX` locale for all date/currency formatting
5. Co-locate tests next to source files
6. Use Hydrogen's built-in components (`<Image>`, `<Money>`, `<Link>`) for commerce, shadcn/ui for interactive UI primitives, before building custom ones
7. Use Playfair Display for headings/display text, Inter for body/UI text — never mix
8. Use gold (`#C6A855`) as the primary interaction/CTA color — one primary gold CTA per screen
9. Apply product-line theming via `[data-product-line]` data attributes — never hardcode lebanese/greek colors outside product contexts
10. Use semantic HTML landmarks (`<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`) — target WCAG 2.1 Level AA
11. Set `lang="es-MX"` on html element, include skip link as first focusable element
12. Use `motion-safe:` prefix for all animations in Tailwind

**Anti-Patterns to Avoid:**
- Creating a `/utils/` or `/helpers/` folder (use `/app/lib/` instead)
- Adding React Context for state that Remix loaders already provide
- Writing English user-facing strings (all UI is Spanish)
- Installing npm packages for things Hydrogen/Remix already provide (cart, image optimization, routing)
- Creating barrel files (`index.ts` re-exports) — direct imports only
- Using `<div onClick>` instead of `<button>` or `<a>` for interactive elements
- Using color alone to convey meaning — product lines need text labels + color
- Putting two competing gold primary CTAs on the same screen
- Using product-line colors (green/blue) in global UI (nav, footer, cart, checkout) — product-line colors are product context only

## Project Structure & Boundaries

### Complete Project Directory Structure

```
mitchweb/
├── .env                          # Local dev environment variables
├── .env.example                  # Template for required env vars
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
├── vitest.config.ts
├── README.md
│
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── images/
│       └── brand/                # Hero images, logo, og:image
│
├── app/
│   ├── entry.client.tsx          # Remix client entry
│   ├── entry.server.tsx          # Remix server entry
│   ├── root.tsx                  # Root layout, global <head>, Tailwind import
│   ├── styles/
│   │   └── tailwind.css          # Tailwind @import directives
│   │
│   ├── routes/
│   │   ├── _index.tsx                    # Homepage — hero, featured products, WhatsApp CTA
│   │   ├── products._index.tsx           # All products / catalog page
│   │   ├── products.$handle.tsx          # Product detail — macros, keto badge, heritage story
│   │   ├── collections._index.tsx        # Collections listing
│   │   ├── collections.$handle.tsx       # Collection detail
│   │   ├── cart.tsx                       # Cart — delivery day selector, zone validation
│   │   ├── search.tsx                    # Product search
│   │   ├── account._index.tsx            # Customer account (Shopify New Accounts)
│   │   ├── account.orders._index.tsx     # Order history
│   │   ├── account.orders.$id.tsx        # Order detail
│   │   ├── pages.$handle.tsx             # CMS pages (About/Heritage, FAQ, Privacy)
│   │   ├── pages.nuestra-historia.tsx    # Brand story / heritage page (if custom layout needed)
│   │   ├── policies.$handle.tsx          # Shopify legal policies
│   │   ├── blogs.$blogHandle.$handle.tsx # Blog articles (Phase 2 content)
│   │   └── webhooks.tsx                  # Webhook endpoint (order.created → OpenClaw)
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn/ui copied components (owned code)
│   │   │   ├── button.tsx           # Gold primary, dark secondary, ghost variants
│   │   │   ├── card.tsx             # Cream bg, burlap border
│   │   │   ├── badge.tsx            # Product-line + functional badges
│   │   │   ├── sheet.tsx            # Cart slide-in, mobile menu
│   │   │   ├── toggle-group.tsx     # Delivery day toggle base
│   │   │   ├── skeleton.tsx         # Loading states (cream-dark shimmer)
│   │   │   ├── toast.tsx            # Add-to-cart confirmation, status updates
│   │   │   ├── accordion.tsx        # Product detail expandable sections
│   │   │   ├── separator.tsx        # Section dividers
│   │   │   ├── dialog.tsx           # Zone error, notification signup
│   │   │   ├── input.tsx            # Email/WhatsApp capture
│   │   │   ├── select.tsx           # Size selector
│   │   │   └── tooltip.tsx          # Macros info, delivery explanations
│   │   ├── Layout.tsx                # Main layout wrapper (header, footer, WhatsApp CTA, BottomTabBar)
│   │   ├── Header.tsx                # Desktop: top nav. Logo, nav links, cart, account
│   │   ├── Footer.tsx                # Dark bg, cream/gold text, links, social, legal
│   │   ├── BottomTabBar.tsx          # Mobile persistent nav: Inicio, Productos, Carrito, Cuenta
│   │   ├── BottomTabBar.test.tsx
│   │   ├── ProductCard.tsx           # Product card: photo, badge, name, price, quick-add
│   │   ├── ProductCard.test.tsx      # Co-located test
│   │   ├── ProductDetailHero.tsx     # Full-width product photo with product-line surface tint
│   │   ├── MacrosPanel.tsx           # Nutritional data: calories, protein, fat, carbs
│   │   ├── MacrosPanel.test.tsx
│   │   ├── DeliveryDayToggle.tsx     # Martes/viernes two-pill toggle for cart
│   │   ├── DeliveryDayToggle.test.tsx
│   │   ├── ZoneErrorState.tsx        # Zone rejection with WhatsApp CTA + notify signup
│   │   ├── OutOfStockState.tsx       # Agotado badge, notify CTA, alternative products
│   │   ├── WhatsAppCTA.tsx           # Floating (all pages) + inline (product/error) variants
│   │   ├── HeroSection.tsx           # Full-bleed dark hero: medallion, headline, photography
│   │   ├── BrandStoryStrip.tsx       # Dark editorial heritage section ("La Tradicion")
│   │   ├── ReorderStrip.tsx          # "Volver a pedir" for returning users (Phase 2)
│   │   ├── CartItemRow.tsx           # Cart item: photo, name, size, quantity controls, price
│   │   ├── FreeShippingBar.tsx       # Progress bar toward free shipping threshold
│   │   └── SeoMeta.tsx              # Reusable SEO/OG meta component
│   │
│   ├── graphql/
│   │   ├── ProductCardFragment.ts    # Shared product card fields
│   │   └── MacrosMetafields.ts       # Metafield fragment for macros/keto
│   │
│   ├── lib/
│   │   ├── analytics.ts             # GA4 gtag() helper functions
│   │   ├── constants.ts             # DELIVERY_DAYS, DELIVERY_ZONES, CACHE config
│   │   ├── formatters.ts            # es-MX currency, date formatting
│   │   ├── formatters.test.ts
│   │   └── shopify/
│   │       ├── metafields.ts        # Parse & type-check metafield values
│   │       ├── metafields.test.ts
│   │       ├── cache.ts             # Cache strategy configs (long/short/none)
│   │       └── webhooks.ts          # HMAC verification for incoming webhooks
│   │
│   └── types/
│       ├── delivery.ts              # DeliveryDay, DeliveryZone types
│       ├── nutrition.ts             # ProductNutrition, MacroData types
│       ├── product-line.ts          # ProductLine ('lebanese' | 'greek'), theming types
│       └── shopify.ts               # Extended Shopify types (metafield shapes)
│
└── tests/
    └── setup.ts                     # Vitest global setup
```

### Architectural Boundaries

**API Boundaries:**

| Boundary | Direction | Protocol | Auth |
|---|---|---|---|
| Hydrogen → Storefront API | Outbound | GraphQL | Public access token (scoped) |
| Shopify → Webhook endpoint | Inbound | HTTPS POST | HMAC signature verification |
| OpenClaw → Storefront API | Outbound (via MCP) | GraphQL | Storefront access token |
| Hydrogen → Shopify Checkout | Redirect | HTTPS | Shopify-managed session |
| GA4 → Analytics | Outbound | Client-side JS | Measurement ID |

**Component Boundaries:**

| Boundary | Rule |
|---|---|
| Routes → Components | Data flows down via props from loader data |
| Components → Components | Props only, no shared mutable state |
| Cart interactions | Hydrogen `useCart()` hook exclusively |
| Layout → Pages | Layout wraps all routes, provides Header/Footer/WhatsAppCTA |

**Data Boundaries:**

| Data | Source of Truth | Access Pattern |
|---|---|---|
| Products, pricing, inventory | Shopify Admin | Read via Storefront API in route loaders |
| Customer accounts | Shopify Customer Accounts | Shopify-managed auth flow |
| Customer metafields (delivery_day) | Shopify Admin | Read/write via Storefront API |
| Product metafields (macros) | Shopify Admin | Read via Storefront API with fragments |
| Order data | Shopify | Written at checkout, read via webhook |
| Conversation state | OpenClaw (internal) | Never accessed by Hydrogen |

### Requirements to Structure Mapping

| FR Category | Primary Routes/Components | Key Files |
|---|---|---|
| Product Discovery (FR1-6) | `products.$handle.tsx`, `collections.$handle.tsx` | `ProductCard`, `ProductDetailHero`, `MacrosPanel`, `MacrosMetafields.ts` |
| Ordering & Checkout (FR7-14) | `cart.tsx`, `DeliveryDayToggle` | `DeliveryDayToggle`, `ZoneErrorState`, `FreeShippingBar`, `CartItemRow`, `delivery.ts` |
| Post-Purchase (FR15-18) | `webhooks.tsx`, `account.orders.*` | `webhooks.ts` (HMAC), OpenClaw receives webhook |
| WhatsApp Commerce (FR19-25) | `WhatsAppCTA.tsx` | Storefront-side is just the CTA button; OpenClaw handles all logic |
| Brand & Content (FR38-42) | `pages.$handle.tsx`, `pages.nuestra-historia.tsx` | `HeroSection`, `BrandStoryStrip`, `SeoMeta`, brand images |
| Admin & Ops (FR49-53) | N/A (Shopify Admin) | Metafield configuration done in Shopify |

**Cross-Cutting Concerns:**

| Concern | Location |
|---|---|
| Delivery day logic | `lib/constants.ts` (enum), `DeliveryDayToggle` (UI), `cart.tsx` (cart attribute), metafield (persistence) |
| es-MX formatting | `lib/formatters.ts` — single source for currency/date formatting |
| Caching | `lib/shopify/cache.ts` — centralized cache strategy configs |
| Analytics | `lib/analytics.ts` — all GA4 calls route through here |
| SEO | `SeoMeta.tsx` component + per-route meta exports |

### Integration Points

**Data Flow:**

```
Customer → Hydrogen Storefront → Storefront API → Shopify
                                                      ↓
                                              Order Created
                                                      ↓
                                              Webhook → OpenClaw → WhatsApp Confirmation
```

## Architecture Validation Results

### Coherence Validation

**Decision Compatibility:** All technology choices are fully compatible. Hydrogen 2026.1.x + Remix/React Router 7.x + Vite 6 + Tailwind CSS + shadcn/ui is the standard Hydrogen stack with no version conflicts. shadcn/ui is Tailwind-native and works alongside Hydrogen's built-in components. Playfair Display + Inter are standard Google Fonts. Vitest is Vite-native. Shopify New Customer Accounts works with Hydrogen out of the box.

**Pattern Consistency:** No contradictions found. Naming conventions (PascalCase components, camelCase functions, kebab-case routes) align with Remix/React ecosystem. Structure patterns match Step 4 decisions. Format patterns (es-MX locale, delivery day enums) are consistent across all sections.

**Structure Alignment:** Project tree supports all decisions. Every architectural decision maps to a specific file or directory. Boundaries are clear with no overlapping responsibilities.

### Requirements Coverage Validation

**Functional Requirements Coverage:**

| FR Category | Coverage | Notes |
|---|---|---|
| Product Discovery (FR1-6) | Covered | Product routes, NutritionLabel, ProductCard, metafield fragments |
| Ordering & Checkout (FR7-14) | Covered | Cart route, DeliveryDaySelector, DeliveryZoneNotice, FreeShippingBar |
| Post-Purchase (FR15-18) | Covered | Webhook endpoint → OpenClaw for WhatsApp; Shopify handles email |
| WhatsApp Commerce (FR19-25) | Covered | WhatsAppCTA on storefront; OpenClaw handles all conversation logic |
| Subscription Mgmt (FR26-32) | Deferred | Phase 2 — architecture accommodates via metafield schema extensibility |
| Glass Recycling (FR33-37) | Deferred | Phase 2 — may require external data store |
| Brand & Content (FR38-42) | Covered | Pages routes, HeroBanner, SeoMeta, heritage page |
| Email Marketing (FR43-48) | Deferred | Phase 2 — Klaviyo integration |
| Admin & Ops (FR49-53) | Covered | Shopify Admin native, metafield config |

**Non-Functional Requirements Coverage:**

| NFR Area | Coverage | How |
|---|---|---|
| Performance (LCP < 2.5s) | Covered | Hydrogen SSR + Oxygen CDN + Tailwind + mobile-first |
| Security (PCI, secrets) | Covered | Shopify handles PCI; HMAC webhooks; env vars for secrets |
| Scalability | Covered | Shopify infrastructure scales automatically |
| Reliability (99.9%) | Covered | Shopify/Oxygen SLA; OpenClaw graceful degradation |
| Integration reliability | Covered | Single webhook with HMAC; Storefront API is Shopify-managed |

### Gap Analysis Results

**Critical Gaps:** None.

**Important Gaps (Non-blocking):**
1. `.env.example` contents not specified — define required env vars during first implementation story
2. Vitest config details not specified — define test utilities when testing story is implemented

**Nice-to-Have Gaps:**
1. No SEO schema markup patterns — JSON-LD structured data for product pages could be added later

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed (53 FRs, 28 NFRs)
- [x] Scale and complexity assessed (Medium, ~8-10 components)
- [x] Technical constraints identified (9 constraints)
- [x] Cross-cutting concerns mapped (5 concerns)

**Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified (Hydrogen 2026.1.x, Vite 6, Tailwind, shadcn/ui, Playfair Display + Inter, Vitest)
- [x] Integration patterns defined (Storefront API, webhooks, GA4)
- [x] Performance considerations addressed (caching tiers, mobile-first)

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Shopify handles 80%+ of backend complexity — architecture is correctly frontend-weighted
- Zero custom infrastructure to maintain (Oxygen, GitHub auto-deploy)
- Clear boundaries between Hydrogen storefront and OpenClaw
- Forward-compatible metafield schema and delivery day approach for Phase 2
- Minimal custom code surface area — reduces single-developer risk
- shadcn/ui provides accessible UI primitives without package dependency — owned code, full control
- Complete design token system (colors, typography, spacing) enables consistent brand identity across all components
- Product-line theming via data attributes scales cleanly to future product lines
- WCAG 2.1 Level AA accessibility built into architecture from day 1

**Areas for Future Enhancement (Phase 2+):**
- External data store evaluation for recycling credits / subscription capacity
- E2E testing framework (Playwright) when checkout flow becomes more complex
- Error tracking service (Sentry) when scale warrants it
- SEO structured data patterns (JSON-LD for product pages)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**
```bash
npx shopify hydrogen init --path mitchweb --language ts --styling tailwind --markets none --git --install-deps
```

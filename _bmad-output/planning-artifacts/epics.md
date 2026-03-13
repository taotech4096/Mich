---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
workflowComplete: true
completedDate: '2026-03-08'
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/ux-design-specification.md"
---

# MitchWeb - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for MitchWeb, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Product Discovery & Catalog:**
- FR1: Customer can browse the complete product catalog with product images, descriptions, and pricing
- FR2: Customer can view detailed product information including ingredients, nutritional facts, and production origin
- FR3: Customer can filter products by category (yogurt griego, jocoque, labneh, snacks)
- FR4: Customer can see real-time inventory availability for each product
- FR5: Customer can view products with their glass container packaging presentation
- FR6: System displays dual messaging (heritage story and nutritional benefits) on product pages based on available content

**Ordering & Checkout:**
- FR7: Customer can add products to a cart and modify quantities
- FR8: Customer can select a delivery day (martes or viernes) during checkout
- FR9: Customer can enter a delivery address and receive validation of whether their zone is serviceable
- FR10: Customer can pay via credit/debit card (Shopify Payments)
- FR11: Customer can pay via OXXO cash deposit
- FR12: Customer can complete checkout with Shop Pay for accelerated mobile purchase
- FR13: System prevents orders to unserviceable delivery zones with a clear explanation
- FR14: System enforces inventory limits to prevent overselling against production capacity

**Post-Purchase & Order Management:**
- FR15: Customer receives order confirmation via email immediately after purchase
- FR16: Customer receives order confirmation via WhatsApp immediately after purchase
- FR17: Customer can view their order history and order status in their account
- FR18: Customer can contact support about an existing order via WhatsApp

**Conversational Commerce (WhatsApp):**
- FR19: Customer can ask product questions via WhatsApp and receive accurate, brand-voiced responses from the AI sales agent
- FR20: Customer can browse the product catalog and get product recommendations via WhatsApp conversation
- FR21: Customer can place an order through WhatsApp conversation and receive a Shopify checkout link
- FR22: Customer can check product availability and pricing via WhatsApp
- FR23: AI sales agent can access real-time Shopify inventory and product data to answer customer queries
- FR24: AI sales agent escalates conversations it cannot handle to the human operator via Telegram notification
- FR25: Operator receives a summary of all WhatsApp sales conversations and orders via Telegram (Mich Ops)

**Subscription Management (Phase 2):**
- FR26: Customer can subscribe to recurring delivery of selected products on a weekly or biweekly schedule
- FR27: Customer can select their preferred delivery day (martes or viernes) for their subscription
- FR28: Customer can pause, modify, or cancel their subscription from their account
- FR29: Customer can update payment method for their subscription
- FR30: System processes subscription payments automatically on the scheduled billing cycle
- FR31: System notifies the customer via email and WhatsApp before each subscription delivery
- FR32: System enforces a maximum number of active subscriptions based on production capacity

**Glass Recycling & Sustainability (Phase 2):**
- FR33: Subscriber can opt into the jar return program from their account
- FR34: System tracks the number of jars returned per customer and applies credits to their account
- FR35: Customer can view their jar return history and accumulated credits
- FR36: Customer can view their environmental impact (jars returned, waste reduced) on their account page
- FR37: Delivery driver flow supports jar pickup notation at time of delivery (Phase 2 operational process)

**Brand & Content Experience:**
- FR38: Visitor can read the brand heritage story (About / Our Story page)
- FR39: Visitor can view a FAQ page answering common questions about products, ordering, and delivery
- FR40: Visitor can access the WhatsApp sales channel from any page via a persistent CTA
- FR41: Visitor can view the site in a mobile-first responsive layout optimized for WhatsApp-referred traffic
- FR42: Visitor can navigate the site using a bottom tab bar on mobile and standard header on desktop

**Email Marketing & Retention (Phase 2):**
- FR43: System captures customer email at checkout and syncs to email marketing platform
- FR44: System sends automated welcome flow to new customers after first purchase
- FR45: System sends abandoned cart recovery emails to customers who started but didn't complete checkout
- FR46: System sends post-purchase follow-up emails (review request, recipe suggestions, reorder nudge)
- FR47: System sends subscription dunning emails when payment fails (retry notifications, payment update prompt)
- FR48: System sends win-back emails to customers who haven't purchased in 30+ days

**Administration & Operations:**
- FR49: Operator can manage products, pricing, and inventory via Shopify Admin
- FR50: Operator can view and fulfill orders via Shopify Admin with delivery day information visible
- FR51: Operator can view customer data and order history via Shopify Admin
- FR52: Operator can manage subscription caps and waitlist settings
- FR53: Operator can configure serviceable delivery zones

### NonFunctional Requirements

**Performance:**
- NFR1: Product page load time on mobile 4G < 2.5s LCP
- NFR2: Checkout page load time < 2.0s LCP
- NFR3: Cart interaction response time (add/update/remove) < 500ms perceived
- NFR4: WhatsApp AI agent response time < 5s for simple queries, < 15s for inventory lookups
- NFR5: Search/filter response time < 1s
- NFR6: Total page weight for initial mobile load < 500KB
- NFR7: Time to Interactive (TTI) on mobile < 3.5s on 4G

**Security:**
- NFR8: All customer data transmitted over HTTPS (100% — no mixed content)
- NFR9: Payment data handled exclusively by Shopify Payments (zero PCI scope for MitchWeb)
- NFR10: API keys and secrets stored in environment variables only
- NFR11: OpenClaw API access restricted to local network
- NFR12: Customer PII access limited to Shopify Admin authorized users
- NFR13: WhatsApp AI agent cannot process payments or modify system configuration
- NFR14: Customer data handling compliant with Mexican Aviso de Privacidad requirements

**Scalability:**
- NFR15: Storefront handles 500 concurrent sessions without degradation
- NFR16: OpenClaw handles 20 simultaneous WhatsApp conversations without queue delays
- NFR17: Inventory enforcement remains accurate under concurrent orders (zero overselling)
- NFR18: Email marketing platform handles 10,000 contacts without tier upgrade

**Reliability:**
- NFR19: Storefront availability 99.9% uptime
- NFR20: Order confirmation delivery (email + WhatsApp) 99% within 60 seconds
- NFR21: Subscription billing reliability 99% successful charge on first attempt
- NFR22: OpenClaw availability during business hours (8am-10pm CST) 99% uptime
- NFR23: Graceful degradation if OpenClaw is down (storefront remains functional)
- NFR24: Daily automated backups for customer and order data

**Integration Reliability:**
- NFR25: Shopify Storefront API availability 99.99%
- NFR26: WhatsApp Business API message delivery 95%+
- NFR27: Klaviyo webhook processing within 30 seconds of Shopify trigger (Phase 2)
- NFR28: Graceful handling of third-party API failures (retry with exponential backoff)

### Additional Requirements

**From Architecture:**
- Starter template: Hydrogen Skeleton with Tailwind CSS (`npx shopify hydrogen init --path mitchweb --language ts --styling tailwind --markets none --git --install-deps`) — must be Epic 1, Story 1
- shadcn/ui component library installed and configured with Mich design tokens (colors, typography, spacing in `tailwind.config.ts`)
- Playfair Display (headings/display) + Inter (body/UI) web fonts loaded
- Vitest testing framework setup with co-located test files
- GitHub → Oxygen auto-deploy pipeline configuration
- HMAC webhook signature verification for OpenClaw integration
- Co-located GraphQL queries with shared fragments in `/app/graphql/`
- Hydrogen default caching tiers: long (24h) for collections/static, short (1-5min) for products, none for cart/checkout/account
- Customer metafield schema (MVP): `delivery_day`, `customer_type`, `acquisition_channel`
- Product metafield schema: `macros_protein_g`, `macros_fat_g`, `macros_carbs_g`, `is_keto_friendly`, `shelf_life_days`
- Order metafield schema: `delivery_day`, `source_channel`
- New Customer Accounts (passwordless) configuration
- Server-state via Remix loaders, no client state management library
- Flat component architecture: `/app/components/` for brand components, `/app/components/ui/` for shadcn/ui primitives
- Utilities in `/app/lib/`, types in `/app/types/`
- es-MX locale formatting for all dates and currency
- All UI strings in Spanish (no i18n framework needed for MVP)
- Mobile-first Tailwind with single breakpoint (`md:` 768px)
- Product-line theming via `[data-product-line]` CSS variable scoping (lebanese green, greek blue accents)
- Gold (#C6A855) as primary interaction/CTA color — one primary gold CTA per screen
- `.env.example` to be defined during first implementation story

**From UX Design:**
- Mobile-first responsive: bottom tab bar (Inicio, Productos, Carrito, Cuenta) on mobile, top nav on desktop
- Persistent floating WhatsApp CTA on every page (above bottom tab bar on mobile, bottom-right on desktop)
- Photography-led design: real product photography, no stock images, authentic artisanal feel
- WCAG 2.1 Level AA accessibility target (4.5:1 contrast, keyboard navigation, screen reader support, skip link "Ir al contenido")
- Touch targets minimum 48px on all interactive elements
- Reduced motion: respect `prefers-reduced-motion` via `motion-safe:` Tailwind prefix
- Quick-add to cart from catalog views without navigating to product page
- Delivery day as simple two-pill toggle (martes/viernes), pre-selected to next available day
- Zone validation at address entry — immediate feedback, not rejection after full form
- Dual messaging on product pages: heritage storytelling + nutritional macros, layered not dumped
- Error states: confident, solution-oriented tone with forward-path CTA or WhatsApp fallback
- Loading states: Skeleton shimmer (cream-dark), SSR handles initial page loads
- Feedback patterns: Toast for success (gold accent, auto-dismiss 3s), inline for errors (persist until resolved)
- Overlay patterns: Sheet for cart slide-in (from right), Dialog for zone errors/notification signup
- Product-line badges with text labels + color (not color-only for accessibility)
- Out-of-stock state: "Agotado" badge, notify CTA, alternative product suggestions
- Content container: `max-w-6xl mx-auto px-4 md:px-8`
- Product card grid: 2 columns mobile, 3-4 columns desktop
- Product detail layout: stacked mobile, side-by-side desktop
- Hero sections: full viewport width, 80-100vh height on mobile
- Free shipping progress bar toward threshold in cart
- Reorder flow from order history ("Volver a pedir" — Phase 2)

**From PRD (Technical/Compliance):**
- NOM-051 compliant product labels on glass containers
- Aviso de privacidad (privacy notice) published on website
- CFDI invoicing capability (via Shopify app)
- SEO: JSON-LD structured data (Product, BreadcrumbList, Organization, LocalBusiness)
- SEO: sitemap.xml, robots.txt, meta tags per route
- GA4 enhanced e-commerce tracking

### FR Coverage Map

- FR1: Epic 2 — Product catalog browsing
- FR2: Epic 2 — Product detail with ingredients/nutrition/origin
- FR3: Epic 2 — Category filtering
- FR4: Epic 2 — Real-time inventory availability
- FR5: Epic 2 — Glass container packaging presentation
- FR6: Epic 2 — Dual messaging (heritage + nutrition)
- FR7: Epic 3 — Cart add/modify
- FR8: Epic 3 — Delivery day selection (martes/viernes)
- FR9: Epic 3 — Address entry with zone validation
- FR10: Epic 3 — Credit/debit card payment
- FR11: Epic 3 — OXXO cash deposit payment
- FR12: Epic 3 — Shop Pay accelerated checkout
- FR13: Epic 3 — Unserviceable zone prevention
- FR14: Epic 3 — Inventory limit enforcement
- FR15: Epic 5 — Email order confirmation
- FR16: Epic 5 — WhatsApp order confirmation
- FR17: Epic 5 — Order history and status
- FR18: Epic 5 — WhatsApp support for existing orders
- FR19: Epic 6 — WhatsApp product questions via AI agent
- FR20: Epic 6 — WhatsApp catalog browsing and recommendations
- FR21: Epic 6 — WhatsApp order placement with checkout link
- FR22: Epic 6 — WhatsApp availability and pricing check
- FR23: Epic 6 — AI agent real-time Shopify data access
- FR24: Epic 6 — AI agent escalation to operator via Telegram
- FR25: Epic 6 — Operator conversation/order summary via Telegram
- FR26: Epic 8 — Recurring delivery subscription (Phase 2)
- FR27: Epic 8 — Subscription delivery day selection (Phase 2)
- FR28: Epic 8 — Subscription pause/modify/cancel (Phase 2)
- FR29: Epic 8 — Subscription payment method update (Phase 2)
- FR30: Epic 8 — Automatic subscription billing (Phase 2)
- FR31: Epic 8 — Pre-delivery notifications (Phase 2)
- FR32: Epic 8 — Subscription capacity enforcement (Phase 2)
- FR33: Epic 9 — Jar return program opt-in (Phase 2)
- FR34: Epic 9 — Jar return credit tracking (Phase 2)
- FR35: Epic 9 — Jar return history and credits view (Phase 2)
- FR36: Epic 9 — Environmental impact dashboard (Phase 2)
- FR37: Epic 9 — Delivery driver jar pickup notation (Phase 2)
- FR38: Epic 4 — Brand heritage story page
- FR39: Epic 4 — FAQ page
- FR40: Epic 1 — Persistent WhatsApp CTA
- FR41: Epic 1 — Mobile-first responsive layout
- FR42: Epic 1 — Bottom tab bar (mobile) / header (desktop) navigation
- FR43: Epic 10 — Email capture and sync (Phase 2)
- FR44: Epic 10 — Welcome email flow (Phase 2)
- FR45: Epic 10 — Abandoned cart recovery emails (Phase 2)
- FR46: Epic 10 — Post-purchase follow-up emails (Phase 2)
- FR47: Epic 10 — Subscription dunning emails (Phase 2)
- FR48: Epic 10 — Win-back emails (Phase 2)
- FR49: Epic 1 — Shopify Admin metafield schema configuration (moved from Epic 7 to unblock Epics 2, 3, 5, 6)
- FR50: Epic 7 — Order fulfillment with delivery day visibility
- FR51: Epic 7 — Customer data and order history via Shopify Admin
- FR52: Epic 8 — Subscription caps and waitlist settings (Phase 2)
- FR53: Epic 7 — Serviceable delivery zone configuration

## Epic List

### Epic 1: Branded Storefront Foundation
Visitors arrive at a premium, mobile-first branded storefront with navigation, WhatsApp access, the Mich design identity, and Shopify Admin metafield schema — the foundation everything else builds on.
**FRs covered:** FR40, FR41, FR42, FR49

### Epic 2: Product Discovery & Catalog
Customers can browse, filter, and explore the full product catalog with rich product detail pages showing nutritional macros, keto badges, heritage storytelling, and real-time availability.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6

### Epic 3: Cart & Checkout
Customers can build a cart, select their delivery day (martes/viernes), validate their delivery zone, and complete purchase via card, OXXO, or Shop Pay.
**FRs covered:** FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14

### Epic 4: Brand & Content Experience
Visitors can read Michel's heritage story, browse the FAQ, and access legal/privacy pages — building the trust and authenticity that drives first-time purchases.
**FRs covered:** FR38, FR39

### Epic 5: Customer Accounts & Post-Purchase
Customers can create an account, view order history/status, receive order confirmations via email and WhatsApp, and contact support via WhatsApp.
**FRs covered:** FR15, FR16, FR17, FR18

### Epic 6: WhatsApp Conversational Commerce
Customers can ask product questions, browse the catalog, check availability, and place orders through WhatsApp with an AI sales agent — with human escalation when needed.
**FRs covered:** FR19, FR20, FR21, FR22, FR23, FR24, FR25

### Epic 7: Operations & Administration
The operator can fulfill orders with delivery day visibility, configure delivery zones, and track storefront performance via analytics through Shopify Admin.
**FRs covered:** FR50, FR51, FR53

### Epic 8: Subscription Management (Phase 2)
Customers can subscribe to recurring deliveries, choose their delivery day, manage/pause/cancel subscriptions, and receive pre-delivery notifications.
**FRs covered:** FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR52

### Epic 9: Glass Recycling & Sustainability (Phase 2)
Subscribers can join the jar return program, track returns and credits, and view their environmental impact — reinforcing the brand's sustainability promise.
**FRs covered:** FR33, FR34, FR35, FR36, FR37

### Epic 10: Email Marketing & Retention (Phase 2)
Customers receive automated email flows (welcome, abandoned cart, post-purchase, win-back, subscription dunning) that drive retention and reorders.
**FRs covered:** FR43, FR44, FR45, FR46, FR47, FR48

## Epic 1: Branded Storefront Foundation

Visitors arrive at a premium, mobile-first branded storefront with navigation, WhatsApp access, and the Mich design identity — the foundation everything else builds on.

### Story 1.1: Project Initialization & Deployment Pipeline

**Implements:** *(infrastructure — no direct FR)*

As a developer,
I want to initialize the Hydrogen Skeleton project with Tailwind CSS and deploy it to Oxygen via GitHub,
So that we have a working, deployed storefront foundation to build upon.

**Acceptance Criteria:**

**Given** no project exists yet
**When** the developer runs `npx shopify hydrogen init --path mitchweb --language ts --styling tailwind --markets none --git --install-deps`
**Then** a Hydrogen project is created with TypeScript, Tailwind CSS, Vite 6, and all auto-scaffolded routes
**And** the project connects to the MitchWeb Shopify store via Storefront API access token

**Given** the project is initialized and pushed to GitHub
**When** code is pushed to the `main` branch
**Then** Oxygen auto-deploys the storefront to a production URL
**And** PR branches generate preview deployment URLs

**Given** the project is initialized
**When** a developer clones the repository
**Then** a `.env.example` file documents all required environment variables (SHOPIFY_STOREFRONT_ACCESS_TOKEN, PUBLIC_STORE_DOMAIN, SESSION_SECRET)
**And** `.env` is listed in `.gitignore`

**Given** the deployed storefront
**When** accessed on a mobile device over 4G
**Then** the default skeleton page loads with LCP < 2.5s

### Story 1.2: Design System & Token Configuration

**Implements:** *(infrastructure — no direct FR)*

As a developer,
I want to configure the Mich design system with shadcn/ui, brand colors, typography, and spacing tokens,
So that all future components use a consistent, premium brand identity.

**Acceptance Criteria:**

**Given** the initialized Hydrogen project
**When** shadcn/ui is installed and configured
**Then** base UI components are available in `/app/components/ui/` (Button, Card, Badge, Sheet, ToggleGroup, Skeleton, Toast, Accordion, Separator, Dialog, Input, Select, Tooltip)
**And** components are copied as owned code, not imported from a package

**Given** the `tailwind.config.ts` file
**When** Mich design tokens are configured
**Then** the color palette includes: gold (#C6A855), cream (#FAF6EE), dark (#1A1612), burlap (#8B7355), terracotta (#C45B3E), plus product-line accents lebanese green (#1B4332) and greek blue (#1B3A5C)
**And** product-line theming is enabled via `[data-product-line]` CSS variable scoping

**Given** the design system configuration
**When** web fonts are loaded
**Then** Playfair Display is used for headings/display text (700 weight)
**And** Inter is used for body/UI text (400 weight)
**And** font loading does not block page rendering (swap strategy)

**Given** the configured design tokens
**When** a Button component is rendered with the primary variant
**Then** it displays with gold background (#C6A855) and dark text (#1A1612)
**And** focus state shows a gold outline ring (2px, 2px offset)

### Story 1.3: Core Layout & Responsive Navigation

**Implements:** FR41, FR42

As a visitor,
I want to see a branded, navigable storefront with mobile bottom tabs and desktop top navigation,
So that I can easily move between sections of the site on any device.

**Acceptance Criteria:**

**Given** a visitor on a mobile device (< 768px)
**When** they load any page
**Then** a fixed BottomTabBar is visible with four tabs: Inicio, Productos, Carrito, Cuenta
**And** the active tab is highlighted with gold
**And** each tab has a minimum touch target of 48px

**Given** a visitor on a desktop device (>= 768px)
**When** they load any page
**Then** a top Header navigation bar is visible with logo, nav links, cart icon, and account link
**And** the BottomTabBar is hidden
**And** active nav link shows gold underline

**Given** any page load
**When** the Layout component renders
**Then** it includes Header (desktop), Footer (dark background, cream/gold text, links, social, legal), and BottomTabBar (mobile)
**And** the html element has `lang="es-MX"`
**And** a skip link "Ir al contenido" is the first focusable element, visible on focus, jumping past navigation
**And** semantic HTML landmarks are used: `<nav>`, `<main>`, `<header>`, `<footer>`

**Given** a visitor navigating via keyboard
**When** they tab through the navigation
**Then** focus order follows: skip link → logo → nav links → cart → account (desktop) or tab bar items (mobile)
**And** all focused elements show a gold outline ring

**Given** the Layout component
**When** rendered at any viewport width
**Then** the content container uses `max-w-6xl mx-auto px-4 md:px-8`

### Story 1.4: Persistent WhatsApp CTA

**Implements:** FR40

As a visitor,
I want to see a WhatsApp button on every page so I can instantly message the brand,
So that I always have a one-tap path to human assistance.

**Acceptance Criteria:**

**Given** a visitor on any page (mobile)
**When** the page loads
**Then** a floating WhatsApp CTA button is visible, positioned above the BottomTabBar
**And** tapping it opens WhatsApp with a pre-filled message including context (e.g., the product being viewed)
**And** the button has a minimum touch target of 48px

**Given** a visitor on any page (desktop)
**When** the page loads
**Then** a floating WhatsApp CTA button is visible in the bottom-right corner
**And** clicking it opens WhatsApp web or app with contextual pre-filled message

**Given** the WhatsApp CTA button
**When** it renders on a page with a product (e.g., `/products/jocoque-original`)
**Then** the pre-filled message includes the product name as context

**Given** the WhatsApp CTA button
**When** it renders on a non-product page
**Then** the pre-filled message uses a generic greeting

**Given** a screen reader user
**When** the WhatsApp CTA is in focus
**Then** it announces a descriptive label (e.g., "Contactar por WhatsApp")

### Story 1.5: Testing Foundation

**Implements:** *(infrastructure — no direct FR)*

As a developer,
I want Vitest configured with co-located test patterns and basic test utilities,
So that all future stories can include tests from the start.

**Acceptance Criteria:**

**Given** the Hydrogen project
**When** Vitest is configured
**Then** `vitest.config.ts` is created with TypeScript support and path aliases matching the project
**And** a `tests/setup.ts` file provides global test setup

**Given** the testing setup
**When** `npm run test` is executed
**Then** Vitest discovers and runs all `*.test.ts` and `*.test.tsx` files co-located next to their source files

**Given** the Layout component from Story 1.3
**When** a smoke test is written as `Layout.test.tsx`
**Then** it verifies the Layout renders Header, Footer, and BottomTabBar
**And** it verifies the skip link "Ir al contenido" is present
**And** the test passes successfully

**Given** the testing configuration
**When** a developer creates a new component
**Then** they can create a co-located `ComponentName.test.tsx` file that is automatically discovered by Vitest

### Story 1.6: Shopify Admin Configuration & Metafield Schema

**Implements:** FR49

> **Moved from Epic 7 (was Story 7.1)** — This story is data infrastructure that must exist before Epics 2, 3, 5, and 6 can read/write metafields. Moved here to unblock downstream dependencies.

As an operator,
I want all custom metafield definitions configured in Shopify Admin,
So that product nutrition data, delivery preferences, and order metadata are structured and manageable.

**Acceptance Criteria:**

**Given** the Shopify Admin for MitchWeb
**When** metafield definitions are configured
**Then** customer metafields are defined: `custom.delivery_day` (single-line text), `custom.customer_type` (single-line text), `custom.acquisition_channel` (single-line text)
**And** product metafields are defined: `custom.macros_protein_g` (number), `custom.macros_fat_g` (number), `custom.macros_carbs_g` (number), `custom.is_keto_friendly` (boolean), `custom.shelf_life_days` (number)
**And** order metafields are defined: `custom.delivery_day` (single-line text), `custom.source_channel` (single-line text)

**Given** the metafield definitions are created
**When** an operator opens a product in Shopify Admin
**Then** the custom metafield fields are visible and editable (protein, fat, carbs, keto-friendly, shelf life)
**And** the operator can enter nutritional data that will be displayed on the storefront

**Given** the metafield definitions are created
**When** an operator views a customer in Shopify Admin
**Then** the delivery_day, customer_type, and acquisition_channel fields are visible
**And** delivery_day updates when the customer selects a day on the storefront

**Given** the operator manages products via Shopify Admin
**When** they update product titles, descriptions, images, pricing, or inventory
**Then** changes are reflected on the storefront via the Storefront API (subject to cache TTL)
**And** no code deployment is needed for product content changes

## Epic 2: Product Discovery & Catalog

Customers can browse, filter, and explore the full product catalog with rich product detail pages showing nutritional macros, keto badges, heritage storytelling, and real-time availability.

### Story 2.1: Product Catalog & Collection Pages

**Implements:** FR1, FR3, FR5

As a customer,
I want to browse products organized by collection with images, names, prices, and product-line badges,
So that I can discover and explore the full Mich product range.

**Acceptance Criteria:**

**Given** a visitor navigates to `/collections`
**When** the page loads
**Then** all available collections are displayed with collection title and description
**And** the page uses Hydrogen caching (long — 24h for collections)

**Given** a visitor navigates to `/collections/jocoque`
**When** the page loads
**Then** products in the collection are displayed in a grid: 2 columns on mobile, 3-4 columns on desktop
**And** each ProductCard shows: product image (1:1 aspect ratio), product name, price formatted in MXN (`es-MX` locale), and a product-line badge (e.g., "Jocoque Libanés" with lebanese green, or "Yogurt Griego" with greek blue)

**Given** a ProductCard renders
**When** the product has a product-line attribute
**Then** the card container has a `data-product-line` attribute for CSS variable scoping
**And** the badge includes both text label and color (not color-only) for accessibility

**Given** the collection page
**When** loading product data
**Then** products use the shared `ProductCardFragment` from `/app/graphql/`
**And** images use the Hydrogen `<Image>` component with Shopify CDN transforms for responsive sizes

**Given** a visitor on a slow connection
**When** products are loading
**Then** Skeleton placeholders (cream-dark shimmer) are shown in the grid layout

### Story 2.2: Product Detail Page

**Implements:** FR2, FR6

As a customer,
I want to view complete product information with beautiful photography, ingredients, description, and easy add-to-cart,
So that I can make an informed purchase decision and feel confident in the product quality.

**Acceptance Criteria:**

**Given** a visitor navigates to `/products/jocoque-original`
**When** the page loads
**Then** a ProductDetailHero displays the product photo: full-width on mobile (60vh), side-by-side with info on desktop (50/50)
**And** the hero has a subtle product-line surface tint based on `data-product-line`

**Given** the product detail page
**When** product data loads
**Then** the page displays: product name (Playfair Display heading), price (Inter, 600-700 weight, MXN formatted), product description, ingredients list, and production origin
**And** heritage storytelling and nutritional information are layered in expandable Accordion sections (not all dumped on screen)

**Given** the product detail page
**When** a size selector is needed (multiple variants)
**Then** a Select component allows choosing the product size/variant
**And** the price updates to reflect the selected variant

**Given** the product detail page
**When** the visitor taps "Agregar al Carrito" (gold primary CTA)
**Then** the product is added to the cart via Hydrogen `useCart()` hook
**And** a Toast notification confirms the addition (gold accent, auto-dismiss 3s)
**And** the cart count updates in the navigation (BottomTabBar or Header)

**Given** a screen reader user on the product detail page
**When** navigating the page
**Then** the tab order flows: back arrow → size selector → quantity → "Agregar al Carrito" → accordion sections
**And** product images have descriptive `alt` text (product name + brief description)

**Given** the product detail page
**When** rendered
**Then** SEO meta tags are set via SeoMeta component (title, description, og:image)
**And** only one gold primary CTA ("Agregar al Carrito") appears on the screen

### Story 2.3: Nutritional Macros & Keto Badges

**Implements:** FR2 *(partial — macros/nutrition subset)*

As a fitness/keto-conscious customer,
I want to see nutritional macro data and keto-friendly badges on product pages,
So that I can quickly assess whether a product fits my dietary goals.

**Acceptance Criteria:**

**Given** a product with macros metafields (`macros_protein_g`, `macros_fat_g`, `macros_carbs_g`)
**When** the product detail page loads
**Then** a MacrosPanel component displays calories, protein, fat, and carbs in a clear layout: 2x2 grid on mobile, inline row of 4 on desktop
**And** values are parsed from metafield strings with type validation

**Given** a product with `is_keto_friendly` metafield set to true
**When** the product detail page or ProductCard renders
**Then** a "Keto Friendly" badge is displayed prominently
**And** the badge uses text + visual indicator (not color-only)

**Given** a product without macros metafields
**When** the product detail page loads
**Then** the MacrosPanel section is not rendered (graceful absence, no empty state)

**Given** the MacrosPanel component
**When** rendered
**Then** nutritional data is presented warmly (not clinical) using the Mich design tokens
**And** a Tooltip provides additional context for each macro value (e.g., "Proteína por porción de 100g")

**Given** the MacrosPanel component
**When** a co-located test `MacrosPanel.test.tsx` runs
**Then** it verifies correct rendering with valid metafield data
**And** it verifies graceful handling of missing/malformed metafield data

### Story 2.4: Real-Time Inventory & Out-of-Stock States

**Implements:** FR4

As a customer,
I want to see real-time product availability and clear messaging when items are out of stock,
So that I know what I can order and can be notified when unavailable products return.

**Acceptance Criteria:**

**Given** a product that is in stock
**When** the ProductCard or product detail page renders
**Then** no special availability indicator is shown (in-stock is the default state)
**And** "Agregar al Carrito" CTA is active and functional

**Given** a product with zero inventory
**When** the ProductCard renders
**Then** an "Agotado" badge is displayed on the card
**And** the quick-add button is disabled or hidden

**Given** a product with zero inventory
**When** the product detail page loads
**Then** the "Agregar al Carrito" CTA is replaced with a disabled state
**And** a notify CTA ("Avísame cuando esté disponible") is shown with email/WhatsApp input
**And** alternative available products from the same collection are suggested below

**Given** a screen reader user on an out-of-stock product
**When** navigating the page
**Then** "Producto agotado" is announced
**And** the notification CTA is clearly labeled
**And** alternative products use standard ProductCard accessibility

**Given** the inventory data
**When** loading product pages
**Then** availability uses Shopify Storefront API real-time inventory (short cache — 1-5 min)

### Story 2.5: Quick-Add to Cart & Product Search

**Implements:** FR1 *(partial — search/browse)*

As a customer,
I want to quickly add products from the catalog without visiting each detail page, and search for specific products,
So that repeat purchases and product discovery are fast and effortless.

**Acceptance Criteria:**

**Given** a ProductCard in a collection grid
**When** the visitor taps the quick-add button
**Then** the product's default variant is added to the cart without navigating away from the collection page
**And** a Toast confirms the addition (gold accent, auto-dismiss 3s)
**And** the cart count updates in the navigation

**Given** a product with multiple variants (sizes)
**When** the visitor taps quick-add on the ProductCard
**Then** the default (first available) variant is added
**And** the Toast includes a note to view the cart for variant changes

**Given** a visitor navigates to the search page or uses the search function
**When** they enter a search query (e.g., "jocoque")
**Then** matching products are returned from the Shopify Storefront API within < 1s
**And** results are displayed using the same ProductCard grid layout

**Given** a search query with no results
**When** the search page renders
**Then** a friendly message in Spanish is displayed ("No encontramos productos para tu búsqueda")
**And** the WhatsApp CTA is suggested as an alternative ("¿Necesitas ayuda? Escríbenos por WhatsApp")

**Given** the quick-add interaction
**When** the cart is updated
**Then** the update uses optimistic UI (immediate visual feedback) with background Storefront API call
**And** perceived response time is < 500ms

## Epic 3: Cart & Checkout

Customers can build a cart, select their delivery day (martes/viernes), validate their delivery zone, and complete purchase via card, OXXO, or Shop Pay.

### Story 3.1: Cart Page & Cart Item Management

**Implements:** FR7

As a customer,
I want to view my cart, adjust quantities, and remove items with instant feedback,
So that I can review and control my order before checkout.

**Acceptance Criteria:**

**Given** a customer has added products to their cart
**When** they navigate to `/cart`
**Then** all cart items are displayed as CartItemRow components: product thumbnail, name, size/variant, quantity controls (+/-), line price formatted in MXN
**And** a cart total is displayed at the bottom

**Given** a customer on the cart page
**When** they tap the + or - button on a CartItemRow
**Then** the quantity updates with optimistic UI (immediate visual feedback)
**And** the background Storefront API call syncs the cart
**And** perceived response time is < 500ms

**Given** a customer on the cart page
**When** they remove an item
**Then** the item slides out with a brief animation (`motion-safe:` prefixed)
**And** the cart total updates immediately
**And** if the cart is now empty, a friendly message is shown with a link back to products

**Given** a customer taps the cart icon in the navigation
**When** on any page
**Then** a Sheet slides in from the right showing the cart contents (mini-cart)
**And** the Sheet can be closed with ESC or tapping outside
**And** focus is trapped inside the Sheet while open

**Given** a CartItemRow component
**When** rendered on mobile (< 768px)
**Then** it uses compact layout: thumbnail + name stacked above quantity/price

**Given** a CartItemRow component
**When** rendered on desktop (>= 768px)
**Then** it uses expanded layout: thumbnail + name + quantity + price in a single row

**Given** the cart page with items
**When** a screen reader user navigates
**Then** the cart icon/tab announces `aria-label="Carrito, [n] productos"`
**And** each CartItemRow is accessible with quantity controls labeled

### Story 3.2: Delivery Day Selection

**Implements:** FR8

As a customer,
I want to choose my delivery day (martes or viernes) with a simple toggle,
So that I receive my fresh artisanal products on a day that works for me.

**Acceptance Criteria:**

**Given** a customer on the cart page
**When** the DeliveryDayToggle renders
**Then** two pill-shaped options are displayed: "Martes" and "Viernes"
**And** the next available delivery day is pre-selected by default
**And** the toggle uses full-width pills on mobile, contained-width side-by-side on desktop

**Given** a customer selects a delivery day
**When** they tap "Martes" or "Viernes"
**Then** the selected pill shows gold active state
**And** the selection is stored in the cart attributes
**And** the values use the string enum `'martes' | 'viernes'` (never translated to English in code)

**Given** a customer proceeds to checkout
**When** the checkout session is created
**Then** the delivery day is persisted to the customer metafield `custom.delivery_day`
**And** the delivery day is copied to the order metafield `delivery_day` at checkout completion

**Given** a screen reader user on the cart page
**When** the DeliveryDayToggle is in focus
**Then** it announces `role="radiogroup"` with `aria-label="Día de entrega"`
**And** each option is navigable via keyboard (arrow keys)

**Given** the DeliveryDayToggle component
**When** a co-located test `DeliveryDayToggle.test.tsx` runs
**Then** it verifies both day options render
**And** it verifies the pre-selection logic picks the next available day
**And** it verifies accessibility attributes are present

### Story 3.3: Delivery Zone Validation

**Implements:** FR9, FR13

> **Precondition:** This story creates the `DELIVERY_ZONES` constants in `/app/lib/constants.ts` as part of its implementation. Story 7.3 (Analytics & Zone Expansion Management) covers the operator-facing zone management workflow.

As a customer,
I want immediate feedback on whether my address is in the delivery zone,
So that I know before checkout whether I can receive my order.

**Acceptance Criteria:**

**Given** the developer implements zone validation
**When** the `DELIVERY_ZONES` array is created in `/app/lib/constants.ts`
**Then** it contains the initial serviceable zones for Puebla/Cholula MVP
**And** the data structure supports future expansion (city, postal codes, zone name)

**Given** a customer on the cart page enters their delivery address
**When** the address is in the serviceable zone (Puebla/Cholula MVP)
**Then** a green confirmation message is shown: "¡Hacemos entregas en tu zona!"
**And** the customer can proceed to checkout

**Given** a customer enters an address outside the serviceable zone
**When** the zone validation runs
**Then** the ZoneErrorState component is displayed with a clear explanation in confident, solution-oriented tone
**And** a Dialog offers: WhatsApp CTA ("Escríbenos para más información") and a notify signup ("Avísame cuando lleguen a mi zona") with email/WhatsApp input
**And** the system prevents proceeding to checkout

**Given** zone validation
**When** checking the address
**Then** validation provides immediate feedback at address entry — not after filling out a complete form
**And** zone data uses Hydrogen long cache (zones rarely change)

**Given** the zone configuration
**When** serviceable zones need to be updated
**Then** zone data is managed via configurable constants in `/app/lib/constants.ts` (DELIVERY_ZONES)
**And** no code change is needed for zone expansion (data-driven)

**Given** a screen reader user encountering a zone error
**When** the ZoneErrorState renders
**Then** the error message is announced immediately via `role="alert"`
**And** the WhatsApp CTA and notify signup are clearly labeled and focusable

### Story 3.4: Checkout & Payment Integration

**Implements:** FR10, FR11, FR12, FR14

As a customer,
I want to complete my purchase with my preferred payment method through a fast, familiar checkout,
So that I can pay easily and trust the transaction.

**Acceptance Criteria:**

**Given** a customer on the cart page with valid delivery day and zone
**When** they tap "Pagar Ahora" (gold primary CTA)
**Then** they are redirected to Shopify checkout with all cart items, delivery day, and zone data
**And** the order metafield `delivery_day` is set from the cart attribute
**And** the order metafield `source_channel` is set to "web"

**Given** the Shopify checkout page
**When** it loads
**Then** credit/debit card payment (Shopify Payments) is available
**And** OXXO cash deposit payment is available
**And** Shop Pay accelerated checkout is available
**And** checkout LCP is < 2.0s (Shopify native checkout performance)

**Given** zero PCI scope for MitchWeb
**When** any payment is processed
**Then** all payment data is handled exclusively by Shopify Payments
**And** the MitchWeb codebase never touches payment credentials

**Given** the cart page
**When** the keyboard tab order reaches the checkout section
**Then** it flows: delivery toggle → first item quantity → ... → "Pagar Ahora"
**And** "Pagar Ahora" is the single gold primary CTA on the cart page

### Story 3.5: Free Shipping Bar & Inventory Enforcement

**Implements:** FR14 *(partial — shipping threshold)*

As a customer,
I want to see how close I am to free shipping and be confident that products shown as available can actually be purchased,
So that I'm incentivized to reach the threshold and never experience an overselling disappointment.

**Acceptance Criteria:**

**Given** a customer on the cart page
**When** the cart total is below the free shipping threshold
**Then** a FreeShippingBar progress indicator shows how much more they need to spend
**And** the bar displays the remaining amount formatted in MXN (e.g., "¡Te faltan $150 para envío gratis!")
**And** the bar uses gold accent color for the progress fill

**Given** a customer on the cart page
**When** the cart total meets or exceeds the free shipping threshold
**Then** the FreeShippingBar shows a completed state with a success message (e.g., "¡Envío gratis!")

**Given** a product with limited inventory
**When** a customer attempts to add more than available stock
**Then** Shopify inventory enforcement prevents overselling (atomic decrements at checkout)
**And** the customer receives a clear message if inventory runs out during checkout

**Given** concurrent customers purchasing the same product
**When** both attempt checkout simultaneously
**Then** Shopify's atomic inventory tracking ensures zero overselling
**And** the second customer receives an appropriate out-of-stock notification if inventory is depleted

## Epic 4: Brand & Content Experience

Visitors can read Michel's heritage story, browse the FAQ, and access legal/privacy pages — building the trust and authenticity that drives first-time purchases.

### Story 4.1: Heritage Story Page (Nuestra Historia)

**Implements:** FR38

As a visitor,
I want to read the authentic story of Michel and the Mich brand with real photography,
So that I feel the craft and trust behind the products before making my first purchase.

**Acceptance Criteria:**

**Given** a visitor navigates to `/pages/nuestra-historia`
**When** the page loads
**Then** a full-bleed HeroSection displays with authentic photography of Michel/his kitchen (80-100vh on mobile, full viewport width)
**And** the hero uses dark overlay with cream/gold headline text in Playfair Display

**Given** the heritage story page
**When** scrolling past the hero
**Then** BrandStoryStrip editorial sections present the brand narrative: Lebanese heritage, artisanal process, family tradition, ingredient sourcing
**And** layout is stacked (text above, image below) on mobile, side-by-side on desktop
**And** all images use authentic photography only — no stock images

**Given** the heritage story page content
**When** rendered
**Then** all text is in warm, authentic Mexican Spanish — not corporate or translated-sounding
**And** images have descriptive `alt` text (e.g., "Michel preparando jocoque en su cocina")
**And** decorative/background images use `alt=""` or `aria-hidden="true"`

**Given** the heritage story page
**When** loaded by a search engine
**Then** SeoMeta component sets appropriate title, description, and og:image for social sharing
**And** heading hierarchy uses semantic HTML (`<article>`, `<section>`, `<h1>`-`<h3>`)

### Story 4.2: FAQ Page

**Implements:** FR39

As a visitor,
I want to find answers to common questions about products, ordering, and delivery,
So that I can resolve doubts without needing to contact support.

**Acceptance Criteria:**

**Given** a visitor navigates to the FAQ page
**When** the page loads
**Then** frequently asked questions are displayed using the Accordion component
**And** questions are organized by category: Productos, Pedidos, Entregas, Envases de Vidrio
**And** all questions and answers are in Mexican Spanish

**Given** a FAQ accordion
**When** a visitor taps a question
**Then** the answer expands smoothly (with `motion-safe:` animation)
**And** other open sections remain open (independent accordion, not mutually exclusive)

**Given** the FAQ page
**When** the visitor reaches the bottom or doesn't find their answer
**Then** a WhatsApp CTA is displayed: "¿No encontraste lo que buscabas? Escríbenos"
**And** the CTA opens WhatsApp with a pre-filled message referencing FAQ

**Given** a keyboard user on the FAQ page
**When** navigating the accordion
**Then** questions are focusable via Tab
**And** Enter/Space toggles the answer open/closed
**And** the accordion follows Radix UI accessibility patterns (aria-expanded, aria-controls)

**Given** the FAQ page
**When** loaded
**Then** SeoMeta sets title and description for SEO
**And** FAQ content is rendered as semantic HTML (not hidden in JavaScript)

### Story 4.3: Legal Pages & SEO Foundation

**Implements:** *(compliance/SEO — no direct FR)*

As a visitor,
I want to access the privacy notice and legal policies, and as a brand I want search engines to properly index and display the site,
So that legal compliance is met and organic discovery is maximized.

**Acceptance Criteria:**

**Given** a visitor navigates to a legal policy page (e.g., `/policies/privacy-policy`)
**When** the page loads
**Then** the Shopify-managed policy content is rendered via the `policies.$handle.tsx` route
**And** the Aviso de Privacidad complies with Mexican privacy requirements
**And** the page is linked from the Footer

**Given** any page on the site
**When** it renders
**Then** the SeoMeta component sets route-specific `<title>`, `<meta name="description">`, and `<meta property="og:image">`
**And** the component is reusable across all routes with page-specific props

**Given** the storefront
**When** a search engine crawls the site
**Then** `robots.txt` is served from `/public/robots.txt` with appropriate directives
**And** a sitemap.xml is generated (Shopify/Hydrogen convention)
**And** JSON-LD structured data is present on relevant pages: Organization and LocalBusiness on homepage, Product on product pages, BreadcrumbList on collection/product pages

**Given** the homepage
**When** loaded by a search engine or social media crawler
**Then** Organization schema includes brand name, logo, contact info, and social links
**And** LocalBusiness schema includes Puebla/Cholula service area
**And** og:image shows the brand hero image for rich social sharing previews

## Epic 5: Customer Accounts & Post-Purchase

Customers can create an account, view order history/status, receive order confirmations via email and WhatsApp, and contact support via WhatsApp.

### Story 5.1: Customer Account & Order History

**Implements:** FR15, FR16

As a customer,
I want to log into my account and view my order history with delivery day and status,
So that I can track my purchases and prepare for upcoming deliveries.

**Acceptance Criteria:**

**Given** a visitor wants to create an account or log in
**When** they access the account section
**Then** Shopify New Customer Accounts (passwordless) handles authentication
**And** no custom auth code is needed — the flow is Shopify-hosted
**And** the account link is accessible via BottomTabBar ("Cuenta") on mobile and Header on desktop

**Given** a logged-in customer navigates to `/account`
**When** the page loads
**Then** an account overview is displayed with the customer's name and email
**And** a link to order history is prominently shown

**Given** a logged-in customer navigates to `/account/orders`
**When** the page loads
**Then** a list of past orders is displayed with: order number, date (formatted in `es-MX` locale), total (MXN), delivery day selected, and order status
**And** orders are sorted most recent first

**Given** a customer taps on a specific order
**When** `/account/orders/$id` loads
**Then** the order detail shows: all line items with product photos, quantities, and prices, delivery day, delivery address, payment method used, and current order status
**And** the order metafield `delivery_day` is displayed as "Entrega: Martes" or "Entrega: Viernes"

**Given** the account pages
**When** rendered
**Then** they follow the Layout with consistent navigation and design tokens
**And** all text is in Mexican Spanish

### Story 5.2: Order Confirmation Webhook & WhatsApp Notification

**Implements:** FR17

As a customer,
I want to receive immediate order confirmation via both email and WhatsApp after purchase,
So that I have peace of mind that my order was received and know when to expect delivery.

**Acceptance Criteria:**

**Given** a customer completes checkout
**When** the `order.created` webhook fires from Shopify
**Then** the `/webhooks` endpoint receives the event
**And** HMAC signature verification validates the webhook authenticity using the shared secret
**And** the webhook is processed within the single `/webhooks` route with a topic switch pattern

**Given** a valid `order.created` webhook is received
**When** the webhook handler processes it
**Then** the order data (customer phone, order number, delivery day, items) is forwarded to OpenClaw
**And** OpenClaw sends a WhatsApp confirmation message to the customer within 60 seconds of purchase
**And** Shopify sends the email confirmation via its native email system

**Given** an invalid webhook (failed HMAC verification)
**When** the `/webhooks` endpoint receives it
**Then** the endpoint returns HTTP 401 Unauthorized
**And** the full error is logged to Oxygen logs
**And** no internal details are exposed in the response

**Given** OpenClaw is unreachable
**When** the webhook handler attempts to forward the order
**Then** the error is logged to Oxygen logs with full context
**And** the storefront continues to operate normally (graceful degradation)
**And** email confirmation still sends via Shopify native
**And** the WhatsApp CTA on the storefront still shows (links to WhatsApp directly)

**Given** the webhook endpoint
**When** handling errors
**Then** appropriate HTTP status codes are returned
**And** Shopify's retry logic with exponential backoff handles transient failures

### Story 5.3: Post-Purchase Support via WhatsApp

**Implements:** FR18

As a customer,
I want to easily contact support about an existing order via WhatsApp,
So that I can resolve issues or ask questions without searching for contact information.

**Acceptance Criteria:**

**Given** a customer is viewing an order detail page (`/account/orders/$id`)
**When** the page renders
**Then** an inline WhatsApp CTA is displayed: "¿Preguntas sobre este pedido? Escríbenos"
**And** tapping the CTA opens WhatsApp with a pre-filled message that includes the order number (e.g., "Hola, tengo una pregunta sobre mi pedido #1234")

**Given** a customer is viewing the order history list
**When** the page renders
**Then** a general WhatsApp support link is available: "¿Necesitas ayuda con un pedido?"

**Given** the WhatsApp support CTA on order pages
**When** tapped on mobile
**Then** the WhatsApp app opens directly with the pre-filled contextual message

**Given** the WhatsApp support CTA on order pages
**When** clicked on desktop
**Then** WhatsApp Web or the desktop app opens with the pre-filled contextual message

**Given** a screen reader user on the order detail page
**When** the WhatsApp support CTA is focused
**Then** it announces a descriptive label (e.g., "Contactar soporte por WhatsApp sobre pedido #1234")

## Epic 6: WhatsApp Conversational Commerce

Customers can ask product questions, browse the catalog, check availability, and place orders through WhatsApp with an AI sales agent — with human escalation when needed.

### Story 6.1: OpenClaw Setup & Storefront MCP Integration

**Implements:** FR19, FR20

As a developer,
I want to configure OpenClaw as a customer engagement gateway connected to Shopify via Storefront MCP,
So that the AI sales agent can access real-time product, pricing, and inventory data to serve customers on WhatsApp.

**Acceptance Criteria:**

**Given** the OpenClaw instance is deployed
**When** it is configured for MitchWeb
**Then** it connects to the Shopify Storefront API via Storefront MCP (read-only access)
**And** the access token is scoped to read products, collections, and inventory only
**And** the API access is restricted to local network (not exposed to public internet)

**Given** OpenClaw is running
**When** a health check request is made to the `/health` endpoint
**Then** it returns a 200 status with service health information
**And** the endpoint can be used for monitoring availability

**Given** the Storefront MCP connection
**When** OpenClaw queries product data
**Then** it receives real-time product information including: name, description, variants, pricing, inventory availability, and product metafields (macros, keto)
**And** response time for simple queries is < 5s
**And** response time for inventory lookups is < 15s

**Given** the OpenClaw configuration
**When** the AI agent is initialized
**Then** it operates as a stateless gateway (no customer memory across conversations for MVP)
**And** it cannot process payments or modify system configuration (scoped permissions)
**And** it can handle up to 20 simultaneous WhatsApp conversations without queue delays

### Story 6.2: Product Q&A & Catalog Browsing via WhatsApp

**Implements:** FR21, FR22

As a customer,
I want to ask product questions and browse the catalog through WhatsApp with an AI agent that knows the products,
So that I can get personalized recommendations and accurate information without visiting the website.

**Acceptance Criteria:**

**Given** a customer sends a WhatsApp message asking about a product (e.g., "¿Qué es el jocoque?")
**When** the AI agent processes the message
**Then** it responds with accurate product information in the Mich brand voice: warm, knowledgeable, heritage + nutrition dual-messaging
**And** the response feels like texting a person, not a bot
**And** response time is < 5s for simple questions

**Given** a customer asks for recommendations (e.g., "¿Qué me recomiendas para keto?")
**When** the AI agent processes the request
**Then** it queries the Storefront MCP for products with `is_keto_friendly` metafield
**And** it recommends relevant products with brief descriptions and pricing
**And** it includes a link to the product page on the storefront

**Given** a customer asks about availability or pricing (e.g., "¿Tienen labneh? ¿Cuánto cuesta?")
**When** the AI agent queries Storefront MCP
**Then** it returns real-time inventory status and current pricing formatted in MXN
**And** if the product is out of stock, it suggests alternatives or offers to notify when available

**Given** a customer sends a message in Spanish
**When** the AI agent responds
**Then** all responses are in Mexican Spanish with the warm, artisanal brand tone
**And** nutritional data is presented naturally in conversation (not as raw data dumps)

### Story 6.3: WhatsApp Order Placement & Checkout Links

**Implements:** FR23, FR24

As a customer,
I want to build an order through WhatsApp conversation and receive a checkout link,
So that I can purchase products without needing to visit the storefront directly.

**Acceptance Criteria:**

**Given** a customer expresses intent to order via WhatsApp (e.g., "Quiero pedir 2 jocoques originales")
**When** the AI agent processes the order intent
**Then** it confirms the items, quantities, and sizes with the customer
**And** it verifies real-time inventory availability via Storefront MCP before confirming

**Given** the customer confirms their desired items
**When** the AI agent assembles the order
**Then** it generates a Shopify checkout link with the confirmed items pre-loaded in the cart
**And** the checkout link is sent to the customer in the WhatsApp conversation

**Given** a customer receives a checkout link
**When** they tap the link on their phone
**Then** they are taken to the Shopify checkout with all items, quantities, and variants pre-populated
**And** the order metafield `source_channel` is set to "whatsapp"

**Given** a product in the order is out of stock
**When** the AI agent checks availability
**Then** it informs the customer immediately with a confident, solution-oriented tone
**And** it suggests available alternatives or asks if they want to proceed without the unavailable item

### Story 6.4: Human Escalation & Operator Summary

**Implements:** FR25

As an operator,
I want the AI agent to escalate conversations it can't handle and receive daily summaries of all WhatsApp activity,
So that no customer is left unserved and I have visibility into the sales channel.

**Acceptance Criteria:**

**Given** the AI agent encounters a conversation it cannot handle (e.g., complex complaints, delivery issues, custom requests)
**When** it determines escalation is needed
**Then** it sends a notification to the operator via Telegram with: customer phone number, conversation summary, and reason for escalation
**And** it informs the customer: "Te voy a conectar con nuestro equipo. Un momento por favor."

**Given** the AI agent escalates a conversation
**When** the Telegram notification is sent
**Then** the operator receives enough context to continue the conversation without asking the customer to repeat themselves

**Given** WhatsApp conversations occur during a business day
**When** the end of the business period is reached (or at a configured interval)
**Then** the operator receives a summary via Telegram (Mich Ops) including: number of conversations, orders generated (with order numbers), common questions asked, and any escalated conversations

**Given** the AI agent is processing conversations
**When** it encounters topics outside its scope (payment processing, system configuration changes, refund processing)
**Then** it does not attempt to handle them
**And** it escalates to the human operator
**And** it maintains scoped permissions — read inventory, create draft orders only

## Epic 7: Operations & Administration

The operator can fulfill orders with delivery day visibility, configure delivery zones, and track storefront performance via analytics through Shopify Admin.

> **Note:** Story 7.1 (Shopify Admin Configuration & Metafield Schema) has been moved to Epic 1 as Story 1.6 to unblock downstream dependencies in Epics 2, 3, 5, and 6. See Story 1.6 for full details.

### Story 7.2: Order Fulfillment with Delivery Day Visibility

**Implements:** FR50, FR51

As an operator,
I want to see delivery day and source channel on every order in Shopify Admin,
So that I can plan fulfillment by delivery day and understand which channel generated the order.

**Acceptance Criteria:**

**Given** an order was placed on the storefront
**When** the operator views it in Shopify Admin
**Then** the order metafield `delivery_day` displays "martes" or "viernes"
**And** the order metafield `source_channel` displays "web" or "whatsapp"
**And** both fields are visible in the order detail view

**Given** the operator needs to plan fulfillment
**When** they view the orders list in Shopify Admin
**Then** they can identify which orders are for martes delivery and which for viernes
**And** customer data and full order history are accessible per customer

**Given** an order placed via WhatsApp (source_channel = "whatsapp")
**When** the operator views it alongside web orders
**Then** the source channel is clearly distinguishable
**And** all order data (items, delivery day, customer info) is identical in structure to web orders

### Story 7.3: Analytics & Zone Expansion Management

**Implements:** FR53

> **Note:** The initial `DELIVERY_ZONES` constants in `/app/lib/constants.ts` are created as part of Story 3.3 (Delivery Zone Validation), since zone validation depends on them. This story covers the operator-facing zone management workflow and GA4 analytics.

As an operator,
I want to track storefront performance via analytics and manage serviceable delivery zones for future expansion,
So that I can make data-driven decisions and expand delivery areas without code changes.

**Acceptance Criteria:**

**Given** the `DELIVERY_ZONES` array exists in `/app/lib/constants.ts` (created in Story 3.3)
**When** the operator needs to add or modify serviceable zones
**Then** updating the zone list requires only a data change and redeployment (no logic changes)
**And** the zone data structure supports future expansion beyond Puebla/Cholula

**Given** the storefront is deployed
**When** GA4 enhanced e-commerce tracking is configured
**Then** a single `/app/lib/analytics.ts` helper centralizes all `gtag()` calls
**And** the following events are tracked: page_view, view_item, add_to_cart, remove_from_cart, begin_checkout, purchase
**And** the GA4 Measurement ID is stored in environment variables

**Given** a customer completes a purchase
**When** the purchase event fires
**Then** GA4 receives: transaction ID, revenue, items purchased, delivery day, and source channel
**And** this enables cross-channel attribution analysis (web vs. WhatsApp)

**Given** the analytics setup
**When** the storefront loads on any page
**Then** the GA4 script loads without blocking page rendering
**And** page weight impact is minimal (< 30KB for analytics scripts)
**And** analytics events follow GA4 enhanced e-commerce conventions

## Epic 8: Subscription Management (Phase 2)

Customers can subscribe to recurring deliveries, choose their delivery day, manage/pause/cancel subscriptions, and receive pre-delivery notifications.

### Story 8.1: Subscription Plan Setup & Product Configuration

As an operator,
I want to configure subscription plans and manage capacity limits,
So that customers can subscribe to recurring deliveries within production capacity.

**Acceptance Criteria:**

**Given** the subscription engine is selected (Shopify Subscriptions API or third-party)
**When** it is configured for MitchWeb
**Then** weekly and biweekly subscription plans are available for eligible products
**And** the subscription engine integrates with Shopify checkout for payment processing

**Given** the subscription configuration
**When** the operator accesses subscription settings in Shopify Admin
**Then** they can set a maximum number of active subscriptions based on production capacity (600L/week)
**And** they can enable/disable a waitlist for when capacity is reached
**And** they can configure which products are eligible for subscription

**Given** the subscription capacity is reached
**When** a new customer attempts to subscribe
**Then** the system prevents enrollment and shows a waitlist signup option
**And** the waitlist captures customer email and/or WhatsApp number for notification

**Given** the subscription engine configuration
**When** it is deployed
**Then** subscription data integrates with existing customer and order metafield schemas
**And** the delivery day approach (customer metafield `custom.delivery_day`) extends cleanly to subscription scheduling

### Story 8.2: Subscription Enrollment & Delivery Day Selection

As a customer,
I want to subscribe to recurring delivery of my favorite products and choose my delivery day,
So that fresh artisanal products arrive automatically without reordering each time.

**Acceptance Criteria:**

**Given** a customer is viewing an eligible product detail page
**When** a subscription option is available
**Then** they can toggle between "Compra única" and "Suscripción" before adding to cart
**And** subscription frequency options are displayed: "Semanal" and "Quincenal"

**Given** a customer selects subscription
**When** they choose their frequency
**Then** they can select their preferred delivery day (martes or viernes) using the DeliveryDayToggle
**And** the subscription price and savings (if any) are clearly displayed in MXN

**Given** a customer adds a subscription to cart and proceeds to checkout
**When** the checkout completes
**Then** the subscription is created with the selected product, frequency, and delivery day
**And** the customer receives confirmation via email and WhatsApp

**Given** the subscription capacity limit has been reached
**When** a customer attempts to subscribe
**Then** the subscription option shows "Lista de espera" instead of "Suscribirse"
**And** a clear explanation is shown: capacity-based limitation positioned as a quality signal
**And** the waitlist signup captures their contact information

### Story 8.3: Subscription Self-Service Management

As a subscriber,
I want to manage my subscription from my account — pause, modify, or cancel,
So that I have full control over my deliveries without needing to contact support.

**Acceptance Criteria:**

**Given** a logged-in subscriber navigates to their account
**When** they access the subscriptions section
**Then** all active subscriptions are displayed with: product name, frequency, delivery day, next delivery date, and payment amount

**Given** a subscriber wants to pause their subscription
**When** they tap "Pausar suscripción"
**Then** a confirmation dialog asks for the pause duration or indefinite pause
**And** upon confirmation, deliveries are paused and the customer is notified via email
**And** the subscription can be reactivated at any time

**Given** a subscriber wants to modify their subscription
**When** they tap "Modificar"
**Then** they can change: frequency (weekly ↔ biweekly), delivery day (martes ↔ viernes), and product quantity
**And** changes take effect from the next billing cycle

**Given** a subscriber wants to cancel
**When** they tap "Cancelar suscripción"
**Then** a confirmation dialog explains what will happen (final delivery, no further charges)
**And** upon confirmation, the subscription is cancelled
**And** the tone is confident and respectful — no dark patterns or guilt messaging

**Given** a subscriber wants to update their payment method
**When** they access payment settings in the subscription section
**Then** they can update their card information via Shopify's payment management flow
**And** the update applies to all active subscriptions

### Story 8.4: Subscription Billing & Pre-Delivery Notifications

As a subscriber,
I want to be notified before each delivery and trust that billing happens automatically,
So that I'm prepared to receive my order and never miss a charge.

**Acceptance Criteria:**

**Given** a subscription billing cycle approaches
**When** the scheduled billing date arrives
**Then** payment is processed automatically via the stored payment method
**And** 99% of charges succeed on the first attempt

**Given** a subscriber has an upcoming delivery
**When** the notification window is reached (e.g., 24 hours before)
**Then** the customer receives a pre-delivery notification via email
**And** the customer receives a pre-delivery notification via WhatsApp (via OpenClaw)
**And** the notification includes: delivery day, items included, and delivery address

**Given** a subscription billing attempt fails
**When** the payment is declined
**Then** Shopify Payments retry logic attempts the charge again
**And** the customer receives an email and WhatsApp notification about the failed payment
**And** the notification includes a link to update their payment method
**And** a grace period is provided before the subscription is paused

**Given** multiple failed billing attempts
**When** the grace period expires
**Then** the subscription is automatically paused (not cancelled)
**And** the customer is notified with instructions to reactivate
**And** the operator is informed via the Mich Ops Telegram summary

## Epic 9: Glass Recycling & Sustainability (Phase 2)

Subscribers can join the jar return program, track returns and credits, and view their environmental impact — reinforcing the brand's sustainability promise.

### Story 9.1: Jar Return Program Enrollment & Credit Tracking

As a subscriber,
I want to opt into the jar return program and receive credits for returned glass containers,
So that I'm rewarded for participating in sustainable packaging practices.

**Acceptance Criteria:**

**Given** a logged-in subscriber navigates to their account
**When** they access the sustainability or recycling section
**Then** they see an option to opt into the jar return program with a clear explanation of how it works: return jars at delivery → receive credits toward future orders

**Given** a subscriber opts into the jar return program
**When** they confirm enrollment
**Then** their account is flagged as a jar return participant
**And** they receive a welcome notification (email + WhatsApp) explaining the process and credit structure

**Given** jars are returned by a subscriber
**When** the return is recorded in the system
**Then** credits are calculated based on the number of jars returned
**And** credits are applied to the customer's account
**And** the credit balance is stored in a persistent data store (external database or Shopify metafields — evaluated based on data volume)

**Given** credits are accumulated
**When** the subscriber places their next order
**Then** available credits are displayed at checkout as a discount option
**And** the subscriber can choose to apply credits to the current order

### Story 9.2: Jar Return History & Environmental Impact Dashboard

As a subscriber,
I want to view my jar return history and see the environmental impact of my participation,
So that I feel good about contributing to sustainability and can track my credits.

**Acceptance Criteria:**

**Given** a subscriber enrolled in the jar return program navigates to their account
**When** they access the recycling/sustainability section
**Then** they see a history of all jar returns: date, number of jars returned, credits earned per return

**Given** the jar return history page
**When** it renders
**Then** an environmental impact summary is displayed: total jars returned, total waste reduced (kg), and equivalent environmental benefit (e.g., "Has evitado X kg de desperdicio")
**And** the data is presented with warm, encouraging tone aligned with the Mich brand voice

**Given** the subscriber has accumulated credits
**When** the history page loads
**Then** the current credit balance is prominently displayed
**And** a breakdown of credits earned vs. credits redeemed is available

**Given** a subscriber with no returns yet
**When** they view the recycling section
**Then** an encouraging empty state is shown explaining the program benefits
**And** a reminder of how jar returns work at delivery time is displayed

### Story 9.3: Delivery Driver Jar Pickup Flow

As a delivery driver,
I want to record how many jars I pick up at each delivery,
So that customer accounts are credited accurately for returned containers.

**Acceptance Criteria:**

**Given** a delivery is scheduled to a jar return program participant
**When** the driver arrives and collects jars
**Then** the driver can record the number of jars picked up via a simple operational process (form, app, or messaging flow — to be determined based on driver tech capability)

**Given** the driver records a jar pickup
**When** the pickup data is submitted
**Then** the system creates a return record linked to the customer account
**And** credits are automatically calculated and applied to the customer's balance
**And** the customer receives a WhatsApp notification confirming the return and credits earned

**Given** a delivery to a jar return participant where no jars are returned
**When** the driver completes the delivery
**Then** the driver can note "0 jars returned" to maintain accurate records
**And** no credits are applied

**Given** the jar pickup records
**When** the operator reviews recycling data
**Then** they can see aggregate statistics: total jars returned across all customers, total credits issued, program participation rate

## Epic 10: Email Marketing & Retention (Phase 2)

Customers receive automated email flows (welcome, abandoned cart, post-purchase, win-back, subscription dunning) that drive retention and reorders.

### Story 10.1: Klaviyo Integration & Email Capture

As an operator,
I want Klaviyo connected to Shopify with automatic email capture at checkout,
So that I can build a customer email list and power automated marketing flows.

**Acceptance Criteria:**

**Given** the Klaviyo account is created
**When** the Shopify integration is configured
**Then** Klaviyo connects to MitchWeb's Shopify store via the official Klaviyo-Shopify integration
**And** customer profiles sync automatically (email, name, order history, metafields)

**Given** a customer completes checkout
**When** they provide their email address
**Then** the email is automatically synced to Klaviyo as a new subscriber
**And** the sync occurs within 30 seconds of the Shopify trigger (webhook processing)

**Given** the Klaviyo subscriber list
**When** it grows over time
**Then** it supports up to 10,000 contacts without requiring a tier upgrade
**And** the operator can view subscriber count and growth in the Klaviyo dashboard

**Given** the Klaviyo integration
**When** customer data syncs
**Then** relevant Shopify data is available for segmentation: order count, total spend, delivery day preference, acquisition channel, product interests
**And** customer PII is handled according to the Aviso de Privacidad

### Story 10.2: Welcome & Post-Purchase Email Flows

As a first-time customer,
I want to receive a warm welcome email and helpful follow-ups after my purchase,
So that I feel valued and discover more about the brand and products.

**Acceptance Criteria:**

**Given** a customer makes their first purchase
**When** the order is confirmed
**Then** a welcome email flow is triggered in Klaviyo within 30 seconds
**And** the welcome email includes: personal greeting, brand story summary, WhatsApp CTA, and a prompt to explore other products

**Given** a customer has received their order
**When** a configured delay after delivery has passed (e.g., 3 days)
**Then** a post-purchase follow-up email is sent requesting a review or feedback
**And** a subsequent email includes recipe suggestions featuring Mich products

**Given** a customer hasn't reordered after their first purchase
**When** a configured delay has passed (e.g., 7-10 days)
**Then** a gentle reorder nudge email is sent highlighting their previous purchase
**And** the email includes a direct link to reorder or browse new products

**Given** all automated emails
**When** they are sent
**Then** they use Mexican Spanish with the warm, artisanal Mich brand voice
**And** they include the WhatsApp CTA as an alternative contact method
**And** they are mobile-optimized (majority of customers read email on phone)

### Story 10.3: Cart Recovery & Win-Back Flows

As an operator,
I want automated emails to recover abandoned carts and re-engage lapsed customers,
So that potential revenue is recaptured and customer relationships are maintained.

**Acceptance Criteria:**

**Given** a customer adds items to their cart but does not complete checkout
**When** a configured delay has passed (e.g., 1 hour)
**Then** an abandoned cart recovery email is sent via Klaviyo
**And** the email shows the abandoned items with product photos and prices
**And** a direct link to their saved cart is included

**Given** the first abandoned cart email is not acted upon
**When** a second delay has passed (e.g., 24 hours)
**Then** a follow-up email is sent with a different angle (e.g., "¿Te quedaste con dudas? Escríbenos por WhatsApp")
**And** the WhatsApp CTA provides an alternative path to purchase

**Given** a customer has not purchased in 30+ days
**When** the win-back trigger is reached
**Then** a win-back email is sent highlighting: what's new (new products, seasonal items), their past favorites, and an invitation to return
**And** the tone is warm and inviting, not desperate or aggressive

**Given** a customer who was previously won back
**When** they make a purchase
**Then** they are removed from the win-back flow
**And** they re-enter the post-purchase flow naturally

### Story 10.4: Subscription Dunning Email Flow

As a subscriber with a failed payment,
I want clear, helpful notifications about billing issues and easy ways to resolve them,
So that my subscription continues without interruption.

**Acceptance Criteria:**

**Given** a subscription payment fails on the first attempt
**When** the failure is detected
**Then** an email is sent immediately informing the subscriber: "Tu pago no pudo ser procesado"
**And** the email includes a clear CTA to update their payment method
**And** the email explains that the system will retry automatically

**Given** a payment retry also fails
**When** the second failure is detected
**Then** a follow-up email is sent with increased urgency (but still respectful tone)
**And** the email includes both the payment update link and WhatsApp CTA for support
**And** the grace period remaining is clearly communicated

**Given** the grace period is about to expire
**When** the final warning threshold is reached
**Then** a final notification is sent explaining that the subscription will be paused if payment is not updated
**And** the email provides all resolution options: update card, contact via WhatsApp, call support

**Given** all dunning emails
**When** they are sent
**Then** they use a confident, solution-oriented tone — never threatening or guilt-inducing
**And** they are in Mexican Spanish with the Mich brand voice
**And** each email clearly states what will happen and what the subscriber can do about it

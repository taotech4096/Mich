# Story 2.1: Product Catalog & Collection Pages

Status: done

## Story

**Implements:** FR1, FR3, FR5

As a customer,
I want to browse products organized by collection with images, names, prices, and product-line badges,
So that I can discover and explore the full Mich product range.

## Acceptance Criteria

1. **Given** a visitor navigates to `/collections`, **When** the page loads, **Then** all available collections are displayed with collection title and description, **And** the page uses Hydrogen caching (long — 24h for collections).

2. **Given** a visitor navigates to `/collections/jocoque`, **When** the page loads, **Then** products in the collection are displayed in a grid: 2 columns on mobile, 3-4 columns on desktop, **And** each ProductCard shows: product image (1:1 aspect ratio), product name, price formatted in MXN (`es-MX` locale), and a product-line badge.

3. **Given** a ProductCard renders, **When** the product has a product-line attribute, **Then** the card container has a `data-product-line` attribute for CSS variable scoping, **And** the badge includes both text label and color (not color-only) for accessibility.

4. **Given** the collection page, **When** loading product data, **Then** products use the shared `ProductCardFragment` from `/app/graphql/`, **And** images use the Hydrogen `<Image>` component with Shopify CDN transforms for responsive sizes.

5. **Given** a visitor on a slow connection, **When** products are loading, **Then** Skeleton placeholders (cream-dark shimmer) are shown in the grid layout.

## Dev Notes

- Reuse existing route structure, enhance with Mich branding
- Product-line detection from product type or vendor tag
- Shared GraphQL fragment for ProductCard reuse across routes
- Skeleton loading via CSS animation on cream-dark background
- Spanish copy throughout (Colecciones, Cargar más, etc.)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Created | `app/components/ProductCard.tsx` | Branded ProductCard with product-line badges, skeleton loading, out-of-stock state |
| Created | `app/components/ProductCard.test.tsx` | 11 tests for ProductCard, skeleton, and grid skeleton |
| Modified | `app/routes/collections._index.tsx` | Mich branding, Spanish copy, collection descriptions, CacheLong |
| Modified | `app/routes/collections.$handle.tsx` | ProductCard integration, Tailwind grid, CacheLong, 12 items/page |
| Modified | `app/routes/collections.all.tsx` | ProductCard integration, Spanish copy, Tailwind grid |
| Modified | `app/routes/_index.tsx` | ProductCard + skeleton for recommended products, Spanish copy |
| Modified | `app/components/PaginatedResourceSection.tsx` | Spanish pagination buttons, Mich-branded styling |

### File List
- `mitchweb/app/components/ProductCard.tsx` (new)
- `mitchweb/app/components/ProductCard.test.tsx` (new)
- `mitchweb/app/routes/collections._index.tsx` (modified)
- `mitchweb/app/routes/collections.$handle.tsx` (modified)
- `mitchweb/app/routes/collections.all.tsx` (modified)
- `mitchweb/app/routes/_index.tsx` (modified)
- `mitchweb/app/components/PaginatedResourceSection.tsx` (modified)

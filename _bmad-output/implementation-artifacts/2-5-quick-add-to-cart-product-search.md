# Story 2.5: Quick-Add to Cart & Product Search

Status: done

## Story

**Implements:** FR1 *(partial — search/browse)*

As a customer,
I want to quickly add products from the catalog without visiting each detail page, and search for specific products,
So that repeat purchases and product discovery are fast and effortless.

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Modified | `app/components/ProductCard.tsx` | Added QuickAddButton (+ icon, loading spinner), added selectedOrFirstAvailableVariant to interface |
| Modified | `app/routes/search.tsx` | Spanish copy, styled search input/button, no-results WhatsApp CTA |
| Modified | `app/routes/collections.$handle.tsx` | Added selectedOrFirstAvailableVariant to GraphQL fragment |
| Modified | `app/routes/collections.all.tsx` | Added selectedOrFirstAvailableVariant to GraphQL fragment |
| Modified | `app/routes/_index.tsx` | Added selectedOrFirstAvailableVariant to GraphQL fragment |

### File List
- `mitchweb/app/components/ProductCard.tsx` (modified)
- `mitchweb/app/routes/search.tsx` (modified)
- `mitchweb/app/routes/collections.$handle.tsx` (modified)
- `mitchweb/app/routes/collections.all.tsx` (modified)
- `mitchweb/app/routes/_index.tsx` (modified)

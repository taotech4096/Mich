# Story 2.4: Real-Time Inventory & Out-of-Stock States

Status: done

## Story

**Implements:** FR4

As a customer,
I want to see real-time product availability and clear messaging when items are out of stock,
So that I know what I can order and can be notified when unavailable products return.

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Modified | `app/routes/products.$handle.tsx` | CacheShort for real-time inventory, out-of-stock WhatsApp notify CTA with "Producto agotado" alert |

### File List
- `mitchweb/app/routes/products.$handle.tsx` (modified)

### Notes
- ProductCard "Agotado" badge was already implemented in Story 2-1
- ProductForm "Agotado" disabled state was already implemented in Story 2-2
- `availableForSale` field was already in all GraphQL fragments
- CacheShort (1-5 min) ensures near-real-time inventory on PDP
- CacheLong (24h) on collection pages is acceptable since cards just show badges

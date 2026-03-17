# Story 3.4: Checkout & Payment Integration

Status: done

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Modified | `app/components/CartSummary.tsx` | "Pagar Ahora" gold CTA, disabled until zone validated, redirects to Shopify checkout |

### File List
- `mitchweb/app/components/CartSummary.tsx` (modified)

### Notes
- Payment methods (card, OXXO, Shop Pay) are configured in Shopify Payments admin, not in code
- source_channel="web" can be set via checkout customization or order webhook
- Zero PCI scope — all payment handled by Shopify

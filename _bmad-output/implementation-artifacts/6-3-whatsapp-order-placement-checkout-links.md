# Story 6.3: WhatsApp Order Placement & Checkout Links

Status: done

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Created | `app/lib/checkout-links.ts` | Utility for building Shopify cart permalink checkout URLs with attributes |
| Created | `app/lib/checkout-links.test.ts` | 5 tests: single item, multiple items, cart attributes, empty items error, no attributes |

### File List
- `mitchweb/app/lib/checkout-links.ts` (new)
- `mitchweb/app/lib/checkout-links.test.ts` (new)

### Notes
- Checkout link format: `https://{domain}/cart/{variant_id}:{qty}[,...]?attributes[key]=value`
- OpenClaw uses this format to generate pre-populated checkout links in WhatsApp conversations
- Cart attributes include: delivery day, source_channel=whatsapp
- source_channel attribution enables web vs WhatsApp analytics (Story 7-3)
- Inventory verification happens via Storefront MCP before generating checkout link (OpenClaw responsibility)

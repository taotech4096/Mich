# Story 7.2: Order Fulfillment with Delivery Day Visibility

Status: done

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Created | `app/lib/admin-api.ts` | Admin API client: client credentials grant, token caching, orderUpdate mutation for metafields |
| Modified | `app/routes/webhooks.tsx` | On orders/create: writes delivery_day and source_channel order metafields via Admin API |

### File List
- `mitchweb/app/lib/admin-api.ts` (new)
- `mitchweb/app/routes/webhooks.tsx` (modified)

### Notes
- Delivery day extracted from cart note_attributes ("Día de entrega") set by DeliveryDayToggle
- Source channel extracted from note_attributes ("source_channel") — defaults to "web", WhatsApp orders set "whatsapp"
- Order metafields written via Admin API `orderUpdate` mutation using `admin_graphql_api_id` from webhook payload
- Admin API token cached for 23 hours (tokens last 24h)
- Requires env vars: SHOPIFY_ADMIN_CLIENT_ID, SHOPIFY_ADMIN_CLIENT_SECRET, PUBLIC_STORE_DOMAIN
- Graceful degradation: if Admin API creds not configured, logs warning and skips metafield write
- Both metafields visible in Shopify Admin order detail view

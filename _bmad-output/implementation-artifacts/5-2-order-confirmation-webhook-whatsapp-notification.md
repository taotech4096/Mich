# Story 5.2: Order Confirmation Webhook & WhatsApp Notification

Status: done

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Created | `app/routes/webhooks.tsx` | Single webhook endpoint with topic switch, HMAC verification, order.created → OpenClaw forwarding |
| Created | `app/lib/webhook-verification.ts` | HMAC-SHA256 signature verification using Web Crypto API |
| Created | `app/lib/webhook-verification.test.ts` | 4 tests: valid signature, invalid signature, tampered body, wrong secret |

### File List
- `mitchweb/app/routes/webhooks.tsx` (new)
- `mitchweb/app/lib/webhook-verification.ts` (new)
- `mitchweb/app/lib/webhook-verification.test.ts` (new)

### Notes
- Requires two env vars: `SHOPIFY_WEBHOOK_SECRET` and `OPENCLAW_WEBHOOK_URL`
- Graceful degradation: if OpenClaw is unreachable, logs error but returns 200 to Shopify
- Email confirmation handled natively by Shopify — no code needed
- Webhook extracts delivery day from cart note_attributes ("Día de entrega")
- GET requests to /webhooks return 405 Method Not Allowed
- Pattern scales for future webhook topics (just add cases to the switch)

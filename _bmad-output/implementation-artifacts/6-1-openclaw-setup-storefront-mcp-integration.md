# Story 6.1: OpenClaw Setup & Storefront MCP Integration

Status: done

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Created | `scripts/openclaw-config.mjs` | Configuration generator: MCP endpoint, system prompt, webhook config, escalation config |
| Modified | `.env.example` | Added SHOPIFY_WEBHOOK_SECRET, OPENCLAW_WEBHOOK_URL, GA4_MEASUREMENT_ID, admin API vars |

### File List
- `mitchweb/scripts/openclaw-config.mjs` (new)
- `mitchweb/.env.example` (modified)

### Notes
- OpenClaw is an external system — storefront provides: Storefront API (via MCP), webhook endpoint (Story 5-2), WhatsApp CTA (Story 1-4)
- MCP connection uses read-only Storefront API token — no write operations
- Configuration script outputs all settings needed for OpenClaw setup
- Scoped permissions: OpenClaw can read products/collections/inventory, cannot modify orders or system config
- Health check endpoint is on the OpenClaw side, not the Hydrogen storefront

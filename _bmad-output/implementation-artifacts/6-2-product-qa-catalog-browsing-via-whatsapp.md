# Story 6.2: Product Q&A & Catalog Browsing via WhatsApp

Status: done

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Created | `scripts/openclaw-config.mjs` | Contains AI agent system prompt with brand voice, product knowledge, and conversation guidelines |

### File List
- `mitchweb/scripts/openclaw-config.mjs` (contains system prompt — shared with 6-1)

### Notes
- All conversation logic lives in OpenClaw, not the Hydrogen storefront (per architecture: "Storefront-side is just the CTA button; OpenClaw handles all logic")
- System prompt defines: warm Mexican Spanish brand voice, dual messaging (heritage + nutrition), product knowledge
- Product data accessed via Storefront MCP: name, description, variants, pricing, inventory, metafields (macros, keto)
- Response time targets: <5s simple questions, <15s inventory lookups (OpenClaw responsibility)

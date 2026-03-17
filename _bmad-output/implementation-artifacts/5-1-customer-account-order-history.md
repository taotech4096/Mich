# Story 5.1: Customer Account & Order History

Status: done

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Modified | `app/routes/account.tsx` | Mich branding, Spanish nav (Pedidos/Perfil/Direcciones/Cerrar sesión), gold pill nav |
| Modified | `app/routes/account.orders._index.tsx` | Spanish copy, es-MX date formatting, card-style order list, search form styling |
| Modified | `app/routes/account.orders.$id.tsx` | Branded order detail: line items with thumbnails, totals, shipping address, status |

### File List
- `mitchweb/app/routes/account.tsx` (modified)
- `mitchweb/app/routes/account.orders._index.tsx` (modified)
- `mitchweb/app/routes/account.orders.$id.tsx` (modified)

### Notes
- Authentication handled by Shopify New Customer Accounts (passwordless) — no custom auth code
- Account index redirects to /account/orders (existing behavior preserved)
- Dates formatted with es-MX locale (e.g., "13 de marzo de 2026")
- delivery_day metafield display requires order metafield to be set at checkout (pending webhook/cart attribute flow)

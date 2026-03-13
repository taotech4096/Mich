# Story 5.3: Post-Purchase Support via WhatsApp

Status: done

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Modified | `app/routes/account.orders.$id.tsx` | WhatsApp CTA with pre-filled order number, accessible aria-label |
| Modified | `app/routes/account.orders._index.tsx` | General WhatsApp support link at bottom of orders list |

### File List
- `mitchweb/app/routes/account.orders.$id.tsx` (modified)
- `mitchweb/app/routes/account.orders._index.tsx` (modified)

### Notes
- Order detail CTA: "¿Preguntas sobre este pedido? Escríbenos" with pre-filled "Hola, tengo una pregunta sobre mi pedido #1234"
- Orders list CTA: "¿Necesitas ayuda con un pedido?" (general support)
- aria-label includes order number for screen readers
- Uses wa.me link format — works on mobile (app) and desktop (web/app)

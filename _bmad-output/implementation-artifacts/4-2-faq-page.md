# Story 4.2: FAQ Page

Status: done

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Created | `app/routes/pages.preguntas-frecuentes.tsx` | Dedicated FAQ route with 4 categories, Radix accordion, WhatsApp CTA |
| Created | `app/routes/pages.preguntas-frecuentes.test.tsx` | 5 tests: title, category headings, questions, WhatsApp CTA, accordion usage |

### File List
- `mitchweb/app/routes/pages.preguntas-frecuentes.tsx` (new)
- `mitchweb/app/routes/pages.preguntas-frecuentes.test.tsx` (new)

### Notes
- FAQ is a static route (`/pages/preguntas-frecuentes`) that takes precedence over the dynamic `pages.$handle`
- Uses shadcn/ui Accordion with `type="multiple"` (independent, not mutually exclusive)
- 4 categories: Productos, Pedidos, Entregas, Envases de Vidrio
- All content in Mexican Spanish
- WhatsApp CTA at bottom with pre-filled message

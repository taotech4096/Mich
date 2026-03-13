# Story 4.3: Legal Pages & SEO Foundation

Status: done

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Modified | `app/routes/policies.$handle.tsx` | Mich branding, getSeoMeta, Spanish "Volver a Políticas" link, styled layout |
| Modified | `app/routes/policies._index.tsx` | Branded policy index with card links, dark header |
| Modified | `app/routes/_index.tsx` | getSeoMeta, Organization/LocalBusiness JSON-LD structured data |
| Modified | `app/routes/products.$handle.tsx` | Product + BreadcrumbList JSON-LD structured data |
| Created | `app/lib/structured-data.ts` | JSON-LD generators: Organization, BreadcrumbList, Product schemas |

### File List
- `mitchweb/app/routes/policies.$handle.tsx` (modified)
- `mitchweb/app/routes/policies._index.tsx` (modified)
- `mitchweb/app/routes/_index.tsx` (modified)
- `mitchweb/app/routes/products.$handle.tsx` (modified)
- `mitchweb/app/lib/structured-data.ts` (new)

### Notes
- robots.txt route already existed with Shopify defaults — no changes needed
- sitemap.xml route already existed via Hydrogen convention
- JSON-LD: Organization + LocalBusiness on homepage, Product + BreadcrumbList on product pages
- Policy fragment renamed to `PolicyContent` to avoid codegen collisions
- Footer already had policy links via Shopify menu fallback

# Story 1.4: Persistent WhatsApp CTA

Status: ready-for-dev

## Story

**Implements:** FR40

As a visitor,
I want to see a WhatsApp button on every page so I can instantly message the brand,
So that I always have a one-tap path to human assistance.

## Acceptance Criteria

1. **Given** a visitor on any page (mobile, < 768px), **When** the page loads, **Then** a floating WhatsApp CTA button is visible, positioned above the BottomTabBar, **And** tapping it opens WhatsApp with a pre-filled message including context (e.g., the product being viewed), **And** the button has a minimum touch target of 48px.

2. **Given** a visitor on any page (desktop, >= 768px), **When** the page loads, **Then** a floating WhatsApp CTA button is visible in the bottom-right corner, **And** clicking it opens WhatsApp web or app with contextual pre-filled message.

3. **Given** the WhatsApp CTA button, **When** it renders on a page with a product (e.g., `/products/jocoque-original`), **Then** the pre-filled message includes the product name as context.

4. **Given** the WhatsApp CTA button, **When** it renders on a non-product page, **Then** the pre-filled message uses a generic greeting.

5. **Given** a screen reader user, **When** the WhatsApp CTA is in focus, **Then** it announces a descriptive label (e.g., "Contactar por WhatsApp").

## Tasks / Subtasks

- [ ] Task 1: Create WhatsAppCTA component (AC: #1, #2, #5)
  - [ ] 1.1 Create `/app/components/WhatsAppCTA.tsx` with floating button
  - [ ] 1.2 Position: `fixed bottom-20 right-4` on mobile (above BottomTabBar), `fixed bottom-8 right-8` on desktop
  - [ ] 1.3 Use z-index between BottomTabBar (z-40) and Header (z-50) — recommend `z-[45]`
  - [ ] 1.4 Minimum touch target 48px (`min-w-12 min-h-12`)
  - [ ] 1.5 Add `aria-label="Contactar por WhatsApp"` for screen reader support
  - [ ] 1.6 Use WhatsApp green (`--whatsapp: #25D366`) for the button background — this is the one place where brand green (not gold) is appropriate since it's the WhatsApp brand identity
  - [ ] 1.7 Add WhatsApp icon (inline SVG — no external icon library needed)
  - [ ] 1.8 Add `motion-safe:` hover/entrance animation (subtle scale or pulse)

- [ ] Task 2: Implement contextual pre-filled messages (AC: #3, #4)
  - [ ] 2.1 Accept an optional `productName` prop for product context
  - [ ] 2.2 Product page message: `"Hola, me interesa el producto: {productName}"`
  - [ ] 2.3 Generic message: `"Hola, me gustaría saber más sobre sus productos"`
  - [ ] 2.4 Build WhatsApp URL: `https://wa.me/{PHONE_NUMBER}?text={encodedMessage}`
  - [ ] 2.5 Store the WhatsApp phone number in an env var (`PUBLIC_WHATSAPP_PHONE`) or in `/app/lib/constants.ts`

- [ ] Task 3: Integrate into PageLayout (AC: #1, #2)
  - [ ] 3.1 Add `<WhatsAppCTA />` to `PageLayout.tsx` — after `<Footer>` and before `<BottomTabBar>`, or as a sibling at the same level
  - [ ] 3.2 Pass `productName` from route data where available (product routes pass product title down)
  - [ ] 3.3 Verify CTA renders on all pages — homepage, collections, products, cart, account, legal

- [ ] Task 4: Create co-located test (AC: #5)
  - [ ] 4.1 Create `WhatsAppCTA.test.tsx`
  - [ ] 4.2 Test: renders with aria-label
  - [ ] 4.3 Test: generic message when no product name
  - [ ] 4.4 Test: product-specific message when product name provided
  - [ ] 4.5 Test: WhatsApp URL is correctly encoded

## Dev Notes

### Current Project State

**Existing components to build on:**
- `PageLayout.tsx` — wraps all routes; includes Header, Footer, BottomTabBar, skip link, and Aside system
- `BottomTabBar.tsx` — fixed bottom, `z-40`
- `Header.tsx` — sticky, `z-50`
- Design tokens already include `--whatsapp: #25D366` in tailwind.css

**Z-layer map:**
| Element | z-index | Notes |
|---------|---------|-------|
| Header | z-50 | Sticky top nav (desktop) |
| WhatsApp CTA | z-[45] | Floating above content, below header modals |
| BottomTabBar | z-40 | Fixed bottom nav (mobile) |
| Main content | default | Scrollable content |

### PageLayout Integration Point

Current PageLayout structure (from `PageLayout.tsx`):
```tsx
<Aside.Provider>
  <a href="#main-content" ...>Ir al contenido</a>
  <CartAside cart={cart} />
  <SearchAside />
  <MobileMenuAside ... />
  {header && <Header ... />}
  <main id="main-content">...</main>
  <Footer ... />
  <BottomTabBar cart={cart} />
  {/* ← WhatsAppCTA goes here, as a fixed-position sibling */}
</Aside.Provider>
```

### Contextual Message Strategy

The WhatsAppCTA needs product context but lives in the layout (outside route components). Two approaches:

**Option A (Recommended): Props from PageLayout**
- PageLayout doesn't currently receive product data, but route loaders have it
- Pass optional `productName` through PageLayout or use a simple React context/prop

**Option B: URL-based inference**
- Read `window.location.pathname` to detect `/products/{handle}`
- Less precise but zero prop drilling
- Could use `useMatches()` from React Router to access route loader data

Recommend **Option B with `useMatches()`** — cleanest approach, no prop changes to PageLayout, and React Router provides route data access from any component in the tree.

```tsx
// Example pattern
const matches = useMatches();
const productMatch = matches.find(m => m.id?.includes('products.$handle'));
const productName = productMatch?.data?.product?.title;
```

### WhatsApp URL Format

```
https://wa.me/521XXXXXXXXXX?text=Hola%2C%20me%20interesa%20el%20producto%3A%20Jocoque%20Original
```

- Use Mexico country code `52` + phone number
- `encodeURIComponent()` the message text
- Opens WhatsApp app on mobile, WhatsApp Web on desktop

### What NOT to Do in This Story

- Do NOT build an inline WhatsApp CTA variant (that's for product pages in Epic 2 and error states in Epic 3)
- Do NOT add any WhatsApp integration logic (OpenClaw is Epic 6)
- Do NOT use an icon library — inline SVG for the WhatsApp icon keeps the bundle minimal
- Do NOT use gold for this button — WhatsApp green is the correct brand color for this specific element
- Do NOT create a Dialog or Sheet — this is a simple link button, not an interactive overlay

### Architecture Conventions

- Component: PascalCase `WhatsAppCTA.tsx`
- Test: co-located `WhatsAppCTA.test.tsx`
- Constants: phone number in `/app/lib/constants.ts` (add `WHATSAPP_PHONE_NUMBER`)
- Accessibility: `aria-label`, focusable, keyboard accessible (it's an `<a>` tag, so native)
- Animation: `motion-safe:` prefix required per architecture enforcement guidelines

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.4]
- [Source: _bmad-output/planning-artifacts/architecture.md — WhatsAppCTA component, communication patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — WhatsApp CTA positioning, floating button pattern]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
- TypeScript type-check: passed (no errors)
- Vite build: 1916 modules transformed successfully (build output failed only due to Dropbox EBUSY file lock on dist/, not a code error)

### Completion Notes List
- Tests deferred: vitest is not yet installed (Story 1.5). Test file `WhatsAppCTA.test.tsx` should be created as part of Story 1.5 or as follow-up.
- Phone number placeholder: `WHATSAPP_PHONE_NUMBER` in constants.ts set to `'521XXXXXXXXXX'` — must be replaced with actual Mich WhatsApp number before launch.
- Used `useMatches()` from react-router to extract product name from route data — zero prop drilling, works from any component in the tree.
- Inline SVG for WhatsApp icon (no external icon dependency) per architecture guidelines.

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Created | `app/lib/constants.ts` | Shared constants: WHATSAPP_PHONE_NUMBER, DELIVERY_DAYS |
| Created | `app/components/WhatsAppCTA.tsx` | Floating WhatsApp CTA with contextual messages |
| Modified | `app/components/PageLayout.tsx` | Added WhatsAppCTA import and render before BottomTabBar |

### File List
- `mitchweb/app/components/WhatsAppCTA.tsx` (new)
- `mitchweb/app/lib/constants.ts` (new)
- `mitchweb/app/components/PageLayout.tsx` (modified)

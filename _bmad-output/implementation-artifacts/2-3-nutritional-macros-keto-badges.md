# Story 2.3: Nutritional Macros & Keto Badges

Status: done

## Story

**Implements:** FR2 *(partial — macros/nutrition subset)*

As a fitness/keto-conscious customer,
I want to see nutritional macro data and keto-friendly badges on product pages,
So that I can quickly assess whether a product fits my dietary goals.

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Created | `app/components/MacrosPanel.tsx` | MacrosPanel (2x2 mobile, 4-col desktop) with calorie calc, KetoBadge component |
| Created | `app/components/MacrosPanel.test.tsx` | 9 tests: valid data, calories calc, missing/null/malformed data, keto badge states |
| Modified | `app/routes/products.$handle.tsx` | Added metafield queries (protein, fat, carbs, keto, shelf life), integrated MacrosPanel + KetoBadge |
| Modified | `app/components/ProductCard.tsx` | Added isKetoFriendly to interface, mini "Keto" badge on card |
| Modified | `app/routes/collections.$handle.tsx` | Added isKetoFriendly metafield to GraphQL fragment |
| Modified | `app/routes/collections.all.tsx` | Added isKetoFriendly metafield to GraphQL fragment |
| Modified | `app/routes/_index.tsx` | Added isKetoFriendly metafield to GraphQL fragment |

### File List
- `mitchweb/app/components/MacrosPanel.tsx` (new)
- `mitchweb/app/components/MacrosPanel.test.tsx` (new)
- `mitchweb/app/routes/products.$handle.tsx` (modified)
- `mitchweb/app/components/ProductCard.tsx` (modified)
- `mitchweb/app/routes/collections.$handle.tsx` (modified)
- `mitchweb/app/routes/collections.all.tsx` (modified)
- `mitchweb/app/routes/_index.tsx` (modified)

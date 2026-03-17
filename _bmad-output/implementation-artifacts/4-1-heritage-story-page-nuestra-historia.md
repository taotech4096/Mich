# Story 4.1: Heritage Story Page (Nuestra Historia)

Status: done

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Created | `app/components/HeroSection.tsx` | Full-bleed hero with dark overlay, cream/gold text, 80-90vh |
| Created | `app/components/HeroSection.test.tsx` | 5 tests: headline, subheadline, image, dark bg fallback, aria-label |
| Created | `app/components/BrandStoryStrip.tsx` | Editorial section, alternating text/image, stacked mobile, side-by-side desktop |
| Created | `app/components/BrandStoryStrip.test.tsx` | 5 tests: title, paragraphs, image, no-image, reverse layout |
| Modified | `app/routes/pages.$handle.tsx` | Custom nuestra-historia layout with hero + brand strips, getSeoMeta, styled generic pages |
| Modified | `app/components/Footer.tsx` | Added Nuestra Historia and FAQ links in new "Mich" column |

### File List
- `mitchweb/app/components/HeroSection.tsx` (new)
- `mitchweb/app/components/HeroSection.test.tsx` (new)
- `mitchweb/app/components/BrandStoryStrip.tsx` (new)
- `mitchweb/app/components/BrandStoryStrip.test.tsx` (new)
- `mitchweb/app/routes/pages.$handle.tsx` (modified)
- `mitchweb/app/components/Footer.tsx` (modified)

### Notes
- Heritage content is hardcoded in the route (not CMS-dependent) for authentic brand voice
- Additional CMS content from Shopify page body renders below the curated sections
- WhatsApp CTA at the bottom of the page
- Hero images will use authentic photography once available (currently dark background fallback)

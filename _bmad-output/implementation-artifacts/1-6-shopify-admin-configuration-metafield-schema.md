# Story 1.6: Shopify Admin Configuration & Metafield Schema

Status: done

## Story

**Implements:** FR49

> **Moved from Epic 7 (was Story 7.1)** — This story is data infrastructure that must exist before Epics 2, 3, 5, and 6 can read/write metafields. Moved here to unblock downstream dependencies.

As an operator,
I want all custom metafield definitions configured in Shopify Admin,
So that product nutrition data, delivery preferences, and order metadata are structured and manageable.

## Acceptance Criteria

1. **Given** the Shopify Admin for MitchWeb, **When** metafield definitions are configured, **Then** customer metafields are defined: `custom.delivery_day` (single-line text), `custom.customer_type` (single-line text), `custom.acquisition_channel` (single-line text), **And** product metafields are defined: `custom.macros_protein_g` (number), `custom.macros_fat_g` (number), `custom.macros_carbs_g` (number), `custom.is_keto_friendly` (boolean), `custom.shelf_life_days` (number), **And** order metafields are defined: `custom.delivery_day` (single-line text), `custom.source_channel` (single-line text).

2. **Given** the metafield definitions are created, **When** an operator opens a product in Shopify Admin, **Then** the custom metafield fields are visible and editable (protein, fat, carbs, keto-friendly, shelf life), **And** the operator can enter nutritional data that will be displayed on the storefront.

3. **Given** the metafield definitions are created, **When** an operator views a customer in Shopify Admin, **Then** the delivery_day, customer_type, and acquisition_channel fields are visible, **And** delivery_day updates when the customer selects a day on the storefront.

4. **Given** the operator manages products via Shopify Admin, **When** they update product titles, descriptions, images, pricing, or inventory, **Then** changes are reflected on the storefront via the Storefront API (subject to cache TTL), **And** no code deployment is needed for product content changes.

## Tasks / Subtasks

- [ ] Task 1: Create Customer Metafield Definitions (AC: #1, #3)
  - [ ] 1.1 Navigate to Shopify Admin → Settings → Custom data → Customers
  - [ ] 1.2 Create `custom.delivery_day` — Type: Single-line text, Description: "Preferred delivery day (martes or viernes)"
  - [ ] 1.3 Create `custom.customer_type` — Type: Single-line text, Description: "Customer segment classification"
  - [ ] 1.4 Create `custom.acquisition_channel` — Type: Single-line text, Description: "How the customer discovered Mich (web, whatsapp, referral, etc.)"
  - [ ] 1.5 Verify fields appear on customer detail pages in Admin

- [ ] Task 2: Create Product Metafield Definitions (AC: #1, #2)
  - [ ] 2.1 Navigate to Shopify Admin → Settings → Custom data → Products
  - [ ] 2.2 Create `custom.macros_protein_g` — Type: Number (integer), Description: "Protein per 100g serving"
  - [ ] 2.3 Create `custom.macros_fat_g` — Type: Number (integer), Description: "Fat per 100g serving"
  - [ ] 2.4 Create `custom.macros_carbs_g` — Type: Number (integer), Description: "Carbohydrates per 100g serving"
  - [ ] 2.5 Create `custom.is_keto_friendly` — Type: True/false, Description: "Whether this product is keto-friendly"
  - [ ] 2.6 Create `custom.shelf_life_days` — Type: Number (integer), Description: "Shelf life in days (refrigerated 2-8°C)"
  - [ ] 2.7 Verify fields appear on product edit pages in Admin

- [ ] Task 3: Create Order Metafield Definitions (AC: #1)
  - [ ] 3.1 Navigate to Shopify Admin → Settings → Custom data → Orders
  - [ ] 3.2 Create `custom.delivery_day` — Type: Single-line text, Description: "Selected delivery day for this order"
  - [ ] 3.3 Create `custom.source_channel` — Type: Single-line text, Description: "Channel that generated this order (web or whatsapp)"
  - [ ] 3.4 Verify fields appear on order detail pages in Admin

- [ ] Task 4: Enter Sample Product Data (AC: #2, #4)
  - [ ] 4.1 Enter nutritional metafield data for at least one product (e.g., Jocoque Original):
    - macros_protein_g: (actual value)
    - macros_fat_g: (actual value)
    - macros_carbs_g: (actual value)
    - is_keto_friendly: true/false
    - shelf_life_days: (actual value)
  - [ ] 4.2 Verify metafield data is accessible via Storefront API (use Shopify GraphiQL explorer)

- [ ] Task 5: Verify Storefront API Access (AC: #4)
  - [ ] 5.1 Query product metafields via Storefront API GraphQL:
    ```graphql
    query {
      product(handle: "jocoque-original") {
        metafield(namespace: "custom", key: "macros_protein_g") {
          value
          type
        }
      }
    }
    ```
  - [ ] 5.2 Confirm metafield values are returned correctly
  - [ ] 5.3 Confirm Storefront API access token has metafield read permissions

## Dev Notes

### This is a Shopify Admin Task (Not a Code Story)

All work is done in the Shopify Admin UI — no code changes to the Hydrogen project. The metafield definitions create the data schema that Stories 2.3, 3.2, 5.1, 6.1, 6.2, 6.3 will read/write.

### Metafield Schema Summary

| Resource | Namespace.Key | Type | Purpose |
|----------|---------------|------|---------|
| Customer | `custom.delivery_day` | Single-line text | Preferred delivery day |
| Customer | `custom.customer_type` | Single-line text | Customer segment |
| Customer | `custom.acquisition_channel` | Single-line text | Discovery channel |
| Product | `custom.macros_protein_g` | Number (integer) | Protein per 100g |
| Product | `custom.macros_fat_g` | Number (integer) | Fat per 100g |
| Product | `custom.macros_carbs_g` | Number (integer) | Carbs per 100g |
| Product | `custom.is_keto_friendly` | True/false | Keto badge flag |
| Product | `custom.shelf_life_days` | Number (integer) | Shelf life in days |
| Order | `custom.delivery_day` | Single-line text | Order delivery day |
| Order | `custom.source_channel` | Single-line text | web or whatsapp |

### Storefront API Access

Product and customer metafields are readable via Storefront API by default when definitions exist. Order metafields require specific Storefront API access scopes — verify during Task 5.

### Architecture Reference

From Architecture doc (Pre-Resolved Decisions):
> **Metafield schema (MVP):**
> - Customer: `delivery_day`, `customer_type`, `acquisition_channel`
> - Product: `macros_protein_g`, `macros_fat_g`, `macros_carbs_g`, `is_keto_friendly`, `shelf_life_days`
> - Order: `delivery_day`, `source_channel`
> - No speculative Phase 2 fields.

### What NOT to Do in This Story

- Do NOT add Phase 2 metafields (subscription preferences, jar return credits, etc.)
- Do NOT write code to read metafields (that's Stories 2.3, 3.2, etc.)
- Do NOT create metafield definitions via code/API — use the Admin UI for traceability
- Do NOT populate all products with data yet — just one sample product for verification

### Downstream Dependencies Unblocked

Once this story is done, the following stories can proceed:
- **2.3** Nutritional Macros & Keto Badges (reads product metafields)
- **3.2** Delivery Day Selection (writes customer metafield)
- **5.1** Customer Account & Order History (reads order metafield)
- **6.1** OpenClaw Setup (reads product metafields via MCP)
- **6.2** WhatsApp Product Q&A (queries is_keto_friendly)
- **6.3** WhatsApp Order Placement (writes source_channel)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.6]
- [Source: _bmad-output/planning-artifacts/architecture.md — Metafield schema, Data Architecture]
- [Shopify Admin: Settings → Custom data → Metafield definitions]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Created | `scripts/setup-metafields.mjs` | Admin API script to create all 10 metafield definitions via client credentials grant |
| Modified | `.env` | Added SHOPIFY_ADMIN_CLIENT_ID and SHOPIFY_ADMIN_CLIENT_SECRET |
| Created (Shopify) | Metafield definitions | 3 customer, 5 product, 2 order metafield definitions |
| Created (Shopify) | Jocoque Original product | Sample product with all 5 product metafields populated |

### File List
- `mitchweb/scripts/setup-metafields.mjs` (new)
- `mitchweb/.env` (modified)

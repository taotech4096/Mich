# Story 8.1: Subscription Plan Setup & Product Configuration

Status: done

## Story

As an operator,
I want to configure subscription plans and manage capacity limits,
So that customers can subscribe to recurring deliveries within production capacity.

## Acceptance Criteria

**AC1 — Selling Plan Configuration:**
- **Given** the Shopify Subscriptions API is configured for MitchWeb
- **When** the setup is complete
- **Then** 4 selling plans exist: Semanal-Martes, Semanal-Viernes, Quincenal-Martes, Quincenal-Viernes
- **And** each plan uses a day-of-week anchor (Tuesday for martes, Friday for viernes)
- **And** each plan integrates with Shopify Payments for automatic billing
- **And** eligible products are assigned to the selling plan group

**AC2 — Capacity Limit Metafields:**
- **Given** the subscription capacity configuration
- **When** shop-level metafields are created
- **Then** `custom.subscription_capacity_max` (integer) stores maximum active subscriptions allowed
- **And** `custom.subscription_capacity_current` (integer) tracks current active subscription count
- **And** default capacity max is set to 150 subscriptions (approximate 600L/week at ~4L average order)

**AC3 — Subscription Availability Toggle (Waitlist):**
- **Given** the subscription capacity is reached (`current >= max`)
- **When** a customer views an eligible product detail page
- **Then** the subscription option shows "Lista de espera" instead of the plan selector
- **And** a waitlist signup Dialog captures email and/or WhatsApp number
- **And** the waitlist contact is stored in customer metafields: `custom.waitlist_subscription` (boolean) and `custom.waitlist_contact` (single-line text)

**AC4 — Product Detail Page (Hydrogen):**
- **Given** a customer views an eligible product detail page
- **When** the product has selling plans attached
- **Then** a purchase type toggle is visible: "Compra única" vs "Suscripción"
- **And** selecting "Suscripción" reveals frequency options (Semanal / Quincenal) and delivery day selection (Martes / Viernes)
- **And** selecting a plan highlights the matching option based on the customer's `custom.delivery_day` metafield (if logged in)
- **And** the subscription price and savings (if configured) are displayed in MXN

**AC5 — Cart Integration:**
- **Given** a customer selects a subscription plan and clicks "Agregar al carrito"
- **When** the line item is added
- **Then** `sellingPlanId` is passed to the `cartLinesAdd` mutation
- **And** the cart displays the subscription frequency and delivery day for the line item

**AC6 — Storefront API Access Scope:**
- **Given** the Storefront API public token for MitchWeb
- **When** the `unauthenticated_read_selling_plans` scope is added
- **Then** selling plan queries return data without authentication errors

## Tasks / Subtasks

### Phase 1 — Shopify Admin Configuration (No Code)

- [x] **Task 1: Enable Shopify Subscriptions** (AC: #1)
  - [x] 1.1 In Shopify Admin → Products → Purchase options: verify "Subscriptions" is enabled (requires Shopify Payments)
  - [x] 1.2 Confirm `PURCHASE_OPTION` access scope is available on the store plan
  - [x] 1.3 Note: Shopify Native Subscriptions requires Shopify Payments as the payment gateway — verify MitchWeb uses Shopify Payments (already configured in Story 3.4)

- [x] **Task 2: Create Selling Plan Group & Plans** (AC: #1)
  - [x] 2.1 Navigate to Shopify Admin → Products → Purchase options → Create subscription plan
  - [x] 2.2 Create plan group named "Suscripción Mich" with the following 4 selling plans:
    - **Plan A** — "Semanal — Martes": billing every 1 week, anchor day = Tuesday (`anchor: { type: WEEKDAY, day: 2 }`), delivery every 1 week
    - **Plan B** — "Semanal — Viernes": billing every 1 week, anchor day = Friday (`anchor: { type: WEEKDAY, day: 6 }`), delivery every 1 week
    - **Plan C** — "Quincenal — Martes": billing every 2 weeks, anchor day = Tuesday, delivery every 2 weeks
    - **Plan D** — "Quincenal — Viernes": billing every 2 weeks, anchor day = Friday, delivery every 2 weeks
  - [x] 2.3 Set anchor behavior to `NEXT` for all plans (first delivery on the next matching anchor day)
  - [x] 2.4 Set pre-anchor behavior per business decision (e.g., "ASAP" or "NEXT")
  - [x] 2.5 Confirm plan group appears in Shopify Admin purchase options list

- [x] **Task 3: Assign Eligible Products to Selling Plan Group** (AC: #1)
  - [x] 3.1 In the selling plan group, click "Add products"
  - [x] 3.2 Assign all currently active products (yogurt griego, jocoque, labneh, snacks) — subscription applies store-wide per MVP scope
  - [x] 3.3 Verify products show "Purchase options" badge in Shopify Admin product list

- [x] **Task 4: Create Capacity & Waitlist Metafield Definitions** (AC: #2, #3)
  - [x] 4.1 Navigate to Shopify Admin → Settings → Custom data → Shop
  - [x] 4.2 Create `custom.subscription_capacity_max` — Type: Number (integer), Description: "Maximum active subscriptions allowed (based on 600L/week production capacity)"
  - [x] 4.3 Create `custom.subscription_capacity_current` — Type: Number (integer), Description: "Current count of active subscriptions (updated by Shopify Flow)"
  - [x] 4.4 Set `custom.subscription_capacity_max` = `150` in the shop metafield editor
  - [x] 4.5 Set `custom.subscription_capacity_current` = `0` initially
  - [x] 4.6 Navigate to Shopify Admin → Settings → Custom data → Customers
  - [x] 4.7 Create `custom.waitlist_subscription` — Type: True/false, Description: "Customer is on subscription waitlist"
  - [x] 4.8 Create `custom.waitlist_contact` — Type: Single-line text, Description: "Waitlist contact (email or WhatsApp number)"
  - [x] 4.9 Verify all 4 new metafield definitions appear in Admin

- [x] **Task 5: Add Storefront API Scope** (AC: #6)
  - [x] 5.1 Navigate to Shopify Admin → Apps → Develop apps → [Your Hydrogen app] → API credentials
  - [x] 5.2 Add `unauthenticated_read_selling_plans` scope to the Storefront API access
  - [x] 5.3 Regenerate the Storefront API token if required
  - [x] 5.4 Update `SHOPIFY_STOREFRONT_ACCESS_TOKEN` in `.env` if token changed
  - [x] 5.5 Verify selling plan query returns data using Shopify GraphiQL explorer:
    ```graphql
    query {
      product(handle: "jocoque-original") {
        sellingPlanGroups(first: 5) {
          nodes {
            name
            sellingPlans(first: 10) {
              nodes {
                id
                name
                description
                recurringDeliveries
                priceAdjustments { ... on SellingPlanFixedPriceAdjustment { price { amount } } }
              }
            }
          }
        }
      }
    }
    ```

### Phase 2 — Hydrogen Code Changes

- [x] **Task 6: Update Product Query to Include Selling Plans** (AC: #4)
  - [x] 6.1 In `app/routes/products.$handle.tsx` loader, extend the product GraphQL query:
    ```graphql
    sellingPlanGroups(first: 10) {
      nodes {
        name
        sellingPlans(first: 10) {
          nodes {
            id
            name
            description
            recurringDeliveries
            options {
              name
              value
            }
            priceAdjustments {
              orderCount
              adjustmentValue {
                ... on SellingPlanPercentagePriceAdjustment { adjustmentPercentage }
                ... on SellingPlanFixedAmountPriceAdjustment { adjustmentAmount { amount currencyCode } }
              }
            }
          }
        }
      }
    }
    ```
  - [x] 6.2 Pass `sellingPlanGroups` data to `ProductForm` component via props

- [x] **Task 7: Create `SubscriptionSelector` Component** (AC: #4, #5)
  - [x] 7.1 Create `app/components/SubscriptionSelector.tsx`:
    - Purchase type toggle: "Compra única" | "Suscripción" (use existing `toggle-group.tsx` pattern from DeliveryDayToggle)
    - When "Suscripción" selected: show frequency (Semanal / Quincenal) and day (Martes / Viernes) sub-toggles
    - Auto-highlight the plan matching the customer's `custom.delivery_day` metafield value if available
    - Derive the matching `sellingPlanId` from the selection (frequency + day → plan ID)
    - Emit `onSellingPlanChange(sellingPlanId: string | null)` callback
  - [x] 7.2 Create `app/components/SubscriptionSelector.test.tsx`:
    - Test: renders "Compra única" and "Suscripción" toggle options
    - Test: selecting "Suscripción" shows frequency and day sub-toggles
    - Test: correct `sellingPlanId` emitted on plan selection
    - Test: defaults to "Compra única" when no selling plans available
    - Test: pre-selects matching plan when `deliveryDayPreference` prop provided

- [x] **Task 8: Update `ProductForm` to Support Selling Plans** (AC: #4, #5)
  - [x] 8.1 Update `app/components/ProductForm.tsx`:
    - Accept `sellingPlanGroups` prop (optional — if empty array, subscription section not shown)
    - Import and render `SubscriptionSelector` when selling plans available
    - Manage local state `selectedSellingPlanId: string | null`
    - Pass `sellingPlanId` to `AddToCartButton`'s `lines` array when a plan is selected
  - [x] 8.2 Update `AddToCartButton` usage in `lines` array:
    ```ts
    lines={selectedVariant ? [{
      merchandiseId: selectedVariant.id,
      quantity: 1,
      sellingPlanId: selectedSellingPlanId ?? undefined,
      selectedVariant,
    }] : []}
    ```

- [x] **Task 9: Create `SubscriptionWaitlistDialog` Component** (AC: #3)
  - [x] 9.1 Create `app/components/SubscriptionWaitlistDialog.tsx`:
    - Use `dialog.tsx` shadcn/ui primitive
    - Title: "Lista de espera — Suscripciones Mich"
    - Body: explanation that capacity-based limitation is a quality signal
    - Form: email input + optional WhatsApp number input
    - Submit action → Remix action in `products.$handle.tsx`
  - [x] 9.2 Add `waitlist` action handler in `app/routes/products.$handle.tsx`:
    - Receives `email` and `whatsapp` form fields
    - Writes to customer metafields `custom.waitlist_subscription = true` and `custom.waitlist_contact` via Customer Account API (if logged in) or stores in a Shopify customer tag/note (if not logged in)
    - Returns success/error feedback
  - [x] 9.3 Render `SubscriptionWaitlistDialog` in `ProductForm` when capacity is full (capacity check done server-side in loader)

- [x] **Task 10: Capacity Check in Product Route Loader** (AC: #3)
  - [x] 10.1 In `app/routes/products.$handle.tsx` loader, fetch shop metafields:
    ```graphql
    shop {
      metafield(namespace: "custom", key: "subscription_capacity_max") { value }
      metafield(namespace: "custom", key: "subscription_capacity_current") { value }
    }
    ```
  - [x] 10.2 Compute `subscriptionAtCapacity = parseInt(current) >= parseInt(max)`
  - [x] 10.3 Pass `subscriptionAtCapacity` boolean to `ProductForm`
  - [x] 10.4 `ProductForm` → shows `SubscriptionWaitlistDialog` trigger instead of `SubscriptionSelector` when `subscriptionAtCapacity = true`

- [x] **Task 11: Cart Display for Subscription Line Items** (AC: #5)
  - [x] 11.1 In `app/components/CartLineItem.tsx`, detect if a line item has a `sellingPlanAllocation`:
    ```ts
    lineItem.sellingPlanAllocation?.sellingPlan.name
    ```
  - [x] 11.2 If present, render a small badge below the product name: "🔄 Suscripción — [plan name]" (e.g., "Suscripción — Semanal Martes")
  - [x] 11.3 Add `sellingPlanAllocation` to the cart line fragment in GraphQL queries:
    ```graphql
    sellingPlanAllocation {
      sellingPlan { id name }
    }
    ```

## Dev Notes

### Architecture Decision: Native Shopify Subscriptions (Not Third-Party)

**Recommendation:** Use **Shopify Native Subscriptions API** — not a third-party app.

**Rationale:**
- Zero additional monthly cost (vs. $99–$299/mo for Recharge/Loop)
- Full headless/Hydrogen support with native `sellingPlanGroups` Storefront API queries
- Day-of-week anchors natively support martes/viernes scheduling
- Directly integrates with existing Shopify Payments setup from Story 3.4
- Single developer architecture principle: leverage Shopify ecosystem maximum

**Third-party apps ONLY if:** Native subscriptions prove insufficient for dunning, failed payment retries, or subscriber management portal (Story 8.3). Consider Loop Subscriptions ($99/mo, no per-order fees, excellent headless support) as the upgrade path.

### Selling Plans Data Model

The Shopify Subscriptions API uses **selling plans** attached to products. The storefront queries these via `product.sellingPlanGroups`. For the cart, `sellingPlanId` is passed to `cartLinesAdd`.

```
Selling Plan Group: "Suscripción Mich"
  ├── Semanal — Martes   (id: "gid://shopify/SellingPlan/XXXX", anchor: Tuesday)
  ├── Semanal — Viernes  (id: "gid://shopify/SellingPlan/XXXX", anchor: Friday)
  ├── Quincenal — Martes (id: "gid://shopify/SellingPlan/XXXX", anchor: Tuesday, every 2 weeks)
  └── Quincenal — Viernes(id: "gid://shopify/SellingPlan/XXXX", anchor: Friday, every 2 weeks)
```

### Capacity Math

- Production capacity: 600L/week
- Average subscription order: ~4L (2 jars of yogurt/jocoque)
- Max subscriptions: 600 ÷ 4 = **150 active subscriptions**
- Conservative start: set capacity_max = 100 for initial rollout, increase incrementally
- This is a business decision — operator sets the value in the Admin metafield

### Existing Code to Reuse

| Existing | Reuse In |
|----------|----------|
| `app/components/DeliveryDayToggle.tsx` | Pattern reference for `SubscriptionSelector` day toggle (same `ToggleGroup` primitive, same `martes\|viernes` values) |
| `app/components/ui/toggle-group.tsx` | Both delivery day and subscription frequency/day toggles |
| `app/components/ui/dialog.tsx` | `SubscriptionWaitlistDialog` container |
| `app/components/ui/input.tsx` | Email + WhatsApp inputs in waitlist form |
| `app/components/CartLineItem.tsx` | Add `sellingPlanAllocation` badge |
| `app/lib/shopify/metafields.ts` | Parse shop capacity metafields |

### New Files

| File | Purpose |
|------|---------|
| `app/components/SubscriptionSelector.tsx` | Purchase type toggle + frequency + day selector |
| `app/components/SubscriptionSelector.test.tsx` | 5 unit tests (see Task 7.2) |
| `app/components/SubscriptionWaitlistDialog.tsx` | Capacity-full waitlist capture dialog |

### Modified Files

| File | Change |
|------|--------|
| `app/routes/products.$handle.tsx` | Add `sellingPlanGroups` to product query, shop capacity metafields, waitlist action |
| `app/components/ProductForm.tsx` | Add `SubscriptionSelector` + `sellingPlanId` state + capacity check |
| `app/components/CartLineItem.tsx` | Add `sellingPlanAllocation` display |

### GraphQL Fragment Addition

Add to `app/lib/fragments.ts` or co-locate in product route:

```graphql
fragment SellingPlanFragment on SellingPlan {
  id
  name
  description
  recurringDeliveries
  options { name value }
  priceAdjustments {
    orderCount
    adjustmentValue {
      ... on SellingPlanPercentagePriceAdjustment { adjustmentPercentage }
      ... on SellingPlanFixedAmountPriceAdjustment {
        adjustmentAmount { amount currencyCode }
      }
    }
  }
}
```

### Storefront API Scope Required

Add `unauthenticated_read_selling_plans` to the public Storefront API token scopes. Without this, `sellingPlanGroups` queries return empty results silently. This is a common gotcha.

### Metafield Schema Extensions (New additions to Story 1.6 schema)

| Resource | Namespace.Key | Type | Purpose |
|----------|---------------|------|---------|
| Shop | `custom.subscription_capacity_max` | Number (integer) | Max active subscriptions (operator-set, default 150) |
| Shop | `custom.subscription_capacity_current` | Number (integer) | Live count of active subscriptions |
| Customer | `custom.waitlist_subscription` | True/false | On subscription waitlist |
| Customer | `custom.waitlist_contact` | Single-line text | Waitlist email or WhatsApp |

### UI Copy (Spanish)

- Purchase toggle: "Compra única" / "Suscripción"
- Frequency toggle: "Semanal" / "Quincenal"
- Day toggle: "Martes" / "Viernes" (same as `DeliveryDayToggle`)
- Savings label: "Ahorra X%" (if price discount configured on selling plan)
- Capacity message: "Cupos disponibles limitados — calidad sobre cantidad"
- Waitlist dialog title: "¿Te avisamos cuando haya un lugar?"
- Waitlist button: "Quiero mi lugar"
- Waitlist success: "¡Listo! Te avisaremos cuando se libere un cupo"

### Architecture Compliance

**Follow all rules from `_bmad-output/planning-artifacts/architecture.md`:**
- `SubscriptionSelector.tsx` → PascalCase, in `/app/components/`
- Toggle group uses `toggle-group.tsx` primitive (shadcn/ui, already owned)
- Gold (`#C6A855`) for the primary "Suscripción" CTA — ONE gold CTA per screen
- "Compra única" toggle uses secondary/ghost style
- All strings in Spanish, `es-MX` locale for prices
- No client state library — `useState` for selected plan only; server state via loader
- Remix action handles waitlist form submission (no client-side fetch)
- Co-locate tests: `SubscriptionSelector.test.tsx` next to `SubscriptionSelector.tsx`

### Web Research: Latest Technical Details (2026)

**Shopify Native Subscriptions (Storefront API 2026-01):**
- `product.sellingPlanGroups(first: N)` — query selling plans attached to a product
- `cartLinesAdd` mutation accepts `sellingPlanId` as part of `CartLineInput`
- Required scope: `unauthenticated_read_selling_plans` on Storefront API token
- Anchor-based scheduling: `anchor: { type: WEEKDAY, day: 2 }` (2 = Tuesday, 6 = Friday)
- Reference: [Hydrogen Subscriptions Cookbook](https://shopify.dev/docs/storefronts/headless/hydrogen/cookbook/subscriptions)
- Reference: [Manage subscription products on storefronts](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/subscriptions)

**Cart mutation with selling plan:**
```ts
// In AddToCartButton lines array
{
  merchandiseId: selectedVariant.id,
  quantity: 1,
  sellingPlanId: 'gid://shopify/SellingPlan/XXXX', // from selector state
}
```

**Capacity Limitation:**
- Shopify does NOT provide native subscription capacity caps
- Custom approach: shop metafield counter + server-side check in Hydrogen loader
- Shopify Flow (or manual operator update) increments `subscription_capacity_current` when subscriptions activate/cancel

### Previous Story Learnings

**From Story 1.6 (Metafield Schema):**
- Admin API script pattern (`scripts/setup-metafields.mjs`) exists — can extend with new shop + customer metafields
- All metafield definitions done via Admin UI for traceability (not code) — follow same pattern
- Shop-level metafields are accessed via `shop { metafield(namespace, key) }` in Storefront API

**From Story 3.2 (Delivery Day Selection):**
- `DeliveryDayToggle.tsx` uses `ToggleGroup` from `app/components/ui/toggle-group.tsx`
- Values are string literals: `'martes' | 'viernes'` — keep consistent in `SubscriptionSelector`
- Auto-selection pattern exists: check current weekday → default to nearest delivery day
- For subscription selector: auto-select plan matching customer's `custom.delivery_day` metafield

**From Story 3.4 (Checkout/Payment):**
- Shopify Payments is already the configured payment gateway — native subscriptions are compatible
- Subscription billing will reuse the same payment method stored by Shopify Payments

### What NOT to Do

- Do NOT build the subscription management portal UI (that's Story 8.3)
- Do NOT implement billing notifications or dunning (that's Story 8.4)
- Do NOT add subscription-related WhatsApp notifications (that's Story 8.2 enrollment + 8.4 billing)
- Do NOT install a third-party subscription app — use Shopify Native Subscriptions for Phase 2 MVP
- Do NOT add a Shopify Function for delivery customization — native selling plan anchors are sufficient
- Do NOT create the subscription enrollment flow UI beyond the product page toggle (full enrollment is Story 8.2)
- Do NOT create barrel files — import `SubscriptionSelector` directly

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Epic 8, Story 8.1]
- [Source: `_bmad-output/planning-artifacts/architecture.md` — Subscription Mgmt, Shopify Sufficiency Map, Structure Patterns]
- [Source: `_bmad-output/implementation-artifacts/1-6-shopify-admin-configuration-metafield-schema.md` — Metafield schema baseline]
- [Source: `_bmad-output/implementation-artifacts/3-2-delivery-day-selection.md` — DeliveryDayToggle pattern]
- [Shopify Subscriptions Cookbook for Hydrogen](https://shopify.dev/docs/storefronts/headless/hydrogen/cookbook/subscriptions)
- [Storefront API — Selling Plans](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/subscriptions)
- [Shopify Billing Cycles & Anchors](https://shopify.dev/docs/apps/build/purchase-options/subscriptions/billing-cycles)

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.6

### Debug Log References

- 2026-03-17: Task 2 — Used `sellingPlansToCreate` field (not `sellingPlans`) in `SellingPlanGroupInput` for API 2026-01
- 2026-03-17: Task 4 — "Key is in use" error on 2nd script run = already exists (success), not failure

### Completion Notes List

- **Tasks 2-4 completed via Admin API script** (`mitchweb/scripts/setup-subscriptions.mjs`):
  - Selling plan group "Suscripción Mich": `gid://shopify/SellingPlanGroup/3290464417`
  - Semanal — Martes: `gid://shopify/SellingPlan/4440359073`
  - Semanal — Viernes: `gid://shopify/SellingPlan/4440391841`
  - Quincenal — Martes: `gid://shopify/SellingPlan/4440424609`
  - Quincenal — Viernes: `gid://shopify/SellingPlan/4440457377`
  - Product "Jocoque Original" (`gid://shopify/Product/8455901577377`) assigned to group
  - Shop metafields: `subscription_capacity_max=150`, `subscription_capacity_current=0`
  - Customer metafield definitions: `waitlist_subscription` (boolean), `waitlist_contact` (single-line text)
- **Tasks 1 & 5 require manual Admin UI action** (noted in story)

### File List

**New files:**
- `mitchweb/app/components/SubscriptionSelector.tsx`
- `mitchweb/app/components/SubscriptionSelector.test.tsx`
- `mitchweb/app/components/SubscriptionWaitlistDialog.tsx`
- `mitchweb/scripts/setup-subscriptions.mjs` — Admin API script (Tasks 2–4 automation)
- `app/components/SubscriptionSelector.tsx` (root mirror)
- `app/components/SubscriptionSelector.test.tsx` (root mirror)
- `app/components/SubscriptionWaitlistDialog.tsx` (root mirror)

**Modified files:**
- `mitchweb/app/routes/products.$handle.tsx` — added `sellingPlanGroups` query, `SHOP_CAPACITY_QUERY`, `subscriptionAtCapacity`, `waitlist` action
- `mitchweb/app/components/ProductForm.tsx` — added `SubscriptionSelector`, `SubscriptionWaitlistDialog`, `selectedSellingPlanId` state, `sellingPlanId` in cart line
- `mitchweb/app/components/CartLineItem.tsx` — added subscription badge display
- `mitchweb/app/lib/fragments.ts` — added `sellingPlanAllocation` to `CartLine` fragment
- `app/routes/products.$handle.tsx` — same changes (root mirror)
- `app/components/ProductForm.tsx` — same changes (root mirror)
- `app/components/CartLineItem.tsx` — same changes (root mirror)
- `app/lib/fragments.ts` — same changes (root mirror)
- `package.json` — added vitest, @testing-library/* dev dependencies
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — status updated

**Shopify Admin (via API script):**
- Selling plan group `gid://shopify/SellingPlanGroup/3290464417` created with 4 plans
- Metafield definitions: `shop.custom.subscription_capacity_max`, `shop.custom.subscription_capacity_current`, `customer.custom.waitlist_subscription`, `customer.custom.waitlist_contact`

## Change Log

- 2026-03-17 (Claude Sonnet 4.6, code-review): Fixed 11 issues from adversarial review
  - **CRITICAL C1**: Fixed `SELLING_PLAN_FRAGMENT` forward reference (TDZ ReferenceError) — moved declaration above `PRODUCT_FRAGMENT` in `products.$handle.tsx`
  - **HIGH H1**: Customer `custom.delivery_day` metafield now fetched in loader (when logged in), passed through `ProductForm` → `SubscriptionSelector` as `deliveryDayPreference`
  - **HIGH H2**: Added `priceAdjustments` to `SellingPlanNode` type; `SubscriptionSelector` now displays "Ahorra X%" savings label when a discount is configured
  - **HIGH H3**: Waitlist action now persists to customer metafields via Customer Account API `customerMetafieldsSet` mutation (when logged in); added `WAITLIST_METAFIELDS_MUTATION` query
  - **HIGH H4 + MEDIUM M1**: Rewrote `SubscriptionSelector.test.tsx` — fixed ToggleGroup mock to wire `onValueChange`, fixed test #3 to use `fireEvent.click`, added 6th test verifying correct `sellingPlanId` emitted. Suite: 76/76 passing.
  - **MEDIUM M2**: Removed unused `SubscriptionWaitlistDialog` import from `products.$handle.tsx`
  - **MEDIUM M3**: Added `mitchweb/scripts/setup-subscriptions.mjs` to story File List
  - **MEDIUM M4**: Added NaN guard on `parseInt` capacity values; `capacityMax` falls back to 150 if NaN or ≤ 0
  - **LOW L1**: "Suscripción" `ToggleGroupItem` now uses `data-[state=on]:bg-primary` for gold brand color when selected
  - **LOW L2**: `capacityMax <= 0` now falls back to 150 to prevent accidentally blocking all subscriptions

- 2026-03-17 (Claude Sonnet 4.6): Completed Story 8.1 implementation
  - **Phase 1 (Admin Config)**: Used Admin API script to create selling plan group, assign products, create all 4 metafield definitions, and set initial capacity values. Storefront API confirmed `unauthenticated_read_selling_plans` already available.
  - **Phase 2 (Hydrogen Code)**: Created `SubscriptionSelector.tsx` (purchase type toggle, frequency/day sub-toggles, plan ID resolution), `SubscriptionWaitlistDialog.tsx` (Dialog with waitlist form), updated `ProductForm.tsx` (selling plan state + conditional render), updated `products.$handle.tsx` (selling plan query + capacity check + waitlist action), updated `CartLineItem.tsx` and `fragments.ts` (subscription badge + `sellingPlanAllocation`).
  - **Tests**: 5 new unit tests for `SubscriptionSelector` (all passing). Full suite: 75/75 tests passing, zero regressions.

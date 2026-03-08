# Prioritized Backlog

## P0 (Do Now)
1. Add Mercado Pago preference creation endpoint.
2. Add Mercado Pago webhook endpoint and order status sync.
3. Add secure subscription recurring-order runner endpoint (cron-ready).
4. Update checkout to support `"mercado_pago"` and redirect flow.
5. Document required environment variables and local run steps.

## P1 (Next)
1. Add idempotency ledger for payment webhook events.
2. Add admin payment reconciliation screen.
3. Add customer-facing payment status timeline per order.
4. Add order confirmation notifications (email/WhatsApp).
5. Add retry policy for failed subscription-generated orders.

## P2 (Then)
1. Build content calendar module.
2. Add AI caption generation and template sets.
3. Add social publishing adapters with approval workflow.
4. Add content performance analytics summary.

## Risks / Dependencies
1. Mercado Pago production credentials and webhook URL setup.
2. Cron scheduling infrastructure for recurring-order runner.
3. Notification provider selection (email/WhatsApp).

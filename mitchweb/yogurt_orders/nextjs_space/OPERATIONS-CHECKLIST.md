# Operations Checklist (Commerce MVP)

## Daily
1. Check `/admin/pedidos` for new `PENDING` orders.
2. Verify paid orders are transitioning to `PAID` (Mercado Pago webhook working).
3. Review delivery-day filters for next route batches.

## Weekly
1. Trigger subscription runner endpoint:
   - `POST /api/jobs/subscriptions/run`
   - Header: `Authorization: Bearer <CRON_SECRET>`
2. Confirm generated orders appear in `/admin/pedidos`.
3. Review failed/skipped subscriptions from endpoint response.

## Payment Setup Validation
1. `MERCADOPAGO_ACCESS_TOKEN` configured.
2. `MERCADOPAGO_PUBLIC_KEY` configured.
3. Admin setting `mercadoPagoEnabled = true`.
4. Webhook URL configured in Mercado Pago:
   - `/api/payments/mercadopago/webhook`
5. Place test order with Mercado Pago and confirm order status update.

## Incident Recovery
1. If webhook fails temporarily:
   - Keep order as `PENDING`.
   - Verify payment in Mercado Pago dashboard.
   - Manually update order status in `/admin/pedidos`.
2. If subscription runner fails:
   - Re-run endpoint manually after fix.
   - Check for duplicate safeguards by delivery date.

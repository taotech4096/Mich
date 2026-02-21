# Demo Opening Instructions

## 1. Open Terminal In This Folder
Run commands inside:

`yogurt_orders/nextjs_space`

## 2. Install Dependencies
```bash
npm install
```

## 3. Create Environment File
Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and set at least:
- `DATABASE_URL`
- `NEXTAUTH_URL` (use `http://localhost:3000` for local)
- `NEXTAUTH_SECRET`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `CRON_SECRET`

## 4. Prepare Database
```bash
npx prisma db push
npx prisma db seed
```

## 5. Start The App
```bash
npm run dev
```

## 6. Open The Demo
In your browser, open:

`http://localhost:3000`

## Optional: Admin Demo Access
Use the same admin email/password you set in:
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

Then go to:

`http://localhost:3000/login`

## Optional: Mercado Pago Demo Setup
If you want online payment enabled:
1. Set `MERCADOPAGO_ACCESS_TOKEN` and `MERCADOPAGO_PUBLIC_KEY` in `.env.local`.
2. In admin settings (`/admin/configuracion`), enable "Mercado Pago".
3. Configure your Mercado Pago webhook URL:
`https://YOUR-DOMAIN/api/payments/mercadopago/webhook`

If you use header validation, also set:
- `MERCADOPAGO_WEBHOOK_SECRET`
And send header:
- `x-webhook-secret: <MERCADOPAGO_WEBHOOK_SECRET>`

## Optional: Run Subscription Auto-Order Job
Call:

```bash
curl -X POST http://localhost:3000/api/jobs/subscriptions/run \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

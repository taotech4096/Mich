# Story 6.4: Human Escalation & Operator Summary

Status: done

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Change Log
| Change | File(s) | Description |
|--------|---------|-------------|
| Created | `scripts/openclaw-config.mjs` | Contains escalation configuration: Telegram bot settings, triggers, notification format, daily summary schedule |

### File List
- `mitchweb/scripts/openclaw-config.mjs` (contains escalation config — shared with 6-1)

### Notes
- All escalation logic lives in OpenClaw, not the Hydrogen storefront
- Escalation triggers: complex complaints, delivery issues, custom requests, payment/refund inquiries
- Notification to operator via Telegram (Mich Ops): customer phone, conversation summary, escalation reason
- Daily summary at end of business (10pm CST): total conversations, orders generated, common questions, escalations
- Customer message on escalation: "Te voy a conectar con nuestro equipo. Un momento por favor."
- Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID on the OpenClaw instance

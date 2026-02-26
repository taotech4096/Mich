---
stepsCompleted: [step-01-init, step-02-discovery, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish, step-12-complete, step-e-01-discovery]
workflowComplete: false
completedDate: '2026-02-25'
classification:
  projectType: "Web App (Headless E-commerce + AI-powered Sales Platform)"
  domain: "E-commerce / Direct-to-Consumer Food Brand"
  complexity: "Medium-High"
  projectContext: "Greenfield (with reusable assets from prior prototype)"
inputDocuments:
  - "_bmad-output/planning-artifacts/product-brief-MitchWeb-2026-02-20.md"
  - "Reportes de Mercado/REPORTE_ESTRATEGICO_FINAL.md"
  - "Reportes de Mercado/01_consumidor_tendencias.md"
  - "Reportes de Mercado/02_panorama_competitivo.md"
  - "Reportes de Mercado/03_precios_margenes_canales.md"
  - "Arquitectura_Tecnica_Shopify_Headless_PowerUserStack.md"
  - "Guia_Automatizacion_IA_JocoqueYogurtMich.md"
  - "PowerUser_Stack_OpenClaw_ClaudeCode_Warp_Antigravity_VertexAI.md"
  - "RecicleforShopify.txt"
documentCounts:
  briefs: 1
  research: 4
  brainstorming: 0
  projectDocs: 4
workflowType: 'prd'
---

# Product Requirements Document - MitchWeb

**Author:** Taotech
**Date:** 2026-02-25

## Executive Summary

**Product:** MitchWeb — a Shopify Hydrogen headless storefront and AI-powered sales platform for Jocoque & Yogurt Mich, an artisanal Lebanese-heritage dairy brand in Mexico.

**Vision:** Build a premium D2C channel that commands 30-50% higher margins than intermediary sales by pairing artisanal product quality with AI-native commerce (conversational WhatsApp sales, predictive reorder, automated marketing).

**Differentiator:** The only artisanal dairy brand in Mexico combining authentic Lebanese heritage recipes (2-ingredient clean label) with an AI-native sales infrastructure — OpenClaw WhatsApp agent for conversational commerce, Shopify Hydrogen for premium web experience, and a closed-loop glass economy for sustainability.

**Target Users:**
- **Primary:** Health-conscious urban consumers (keto, fitness, clean-label) in Puebla/Cholula willing to pay premium for artisanal quality via D2C
- **Secondary:** Food enthusiasts seeking authentic Mediterranean dairy products; wellness-focused parents
- **Tertiary:** HORECA buyers (restaurants, cafés) needing consistent artisanal dairy supply

**Core Hypothesis:** Customers will pay 30-50% more for Mich products in premium glass containers via D2C Shopify, compared to intermediary plastic channel pricing.

**Timeline:** MVP in 2 weeks; single developer (Taotech) leveraging Shopify Hydrogen template + OpenClaw.

## Success Criteria

### User Success

**D2C Customer (Shopify Store):**
- Completes first purchase within a single session (< 5 minutes from product page to checkout)
- Discovers subscription option and understands value proposition before checkout
- Receives order confirmation via email + WhatsApp within 60 seconds of purchase
- Can track delivery status and knows exact delivery window (martes or viernes)
- Returns to reorder or activates subscription within 14 days of first purchase
- "Aha!" moment: tasting the product from a premium glass container and seeing the clean ingredient list + macros -- confirms this is worth the premium

**WhatsApp Customer (OpenClaw):**
- Gets a helpful, on-brand response within 10 seconds of messaging
- Completes a full purchase (browse → cart → checkout link) without leaving WhatsApp (except for payment)
- Transaction completes in 2-3 minutes
- Feels like they're talking to a knowledgeable, warm brand representative -- not a generic bot
- "Aha!" moment: receiving a proactive reorder suggestion that's perfectly timed

**HORECA Buyer:**
- Receives clear bulk pricing and ordering process within first interaction
- Can place recurring orders with predictable delivery schedule
- "Aha!" moment: seeing customer response to Mich products on their menu

### Business Success

| Timeframe | Key Metric | Target | What It Proves |
|---|---|---|---|
| Week 1-2 | Shopify store live and processing orders | Functional with subscriptions | Technical viability |
| Month 1 | First 50 D2C orders processed | Any volume | Product-market fit signal |
| Month 3 | >40% repeat purchase rate | Measurable | Product creates habitual demand |
| Month 3 | >15% subscription conversion | Measurable | Recurring revenue model works |
| Month 6 | D2C gross margin >55% after delivery | Measurable | Channel economics validated |
| Month 6 | WhatsApp conversion >10% | Measurable | AI sales channel is viable |
| Year 1 | D2C + HORECA revenue > intermediary revenue | Measurable | Brand channel transition working |
| Year 1 | Kitchen at 1,800L/week | Operational | Production bottleneck resolved |

### Technical Success

- **Performance:** Shopify Hydrogen storefront loads in <2s on 4G mobile (target audience shops on mobile)
- **Uptime:** 99.9% storefront availability (Shopify Oxygen SLA covers this)
- **Payment reliability:** Zero failed legitimate payment attempts due to technical issues
- **Subscription engine:** Handles weekly/biweekly delivery subscriptions with martes/viernes scheduling without manual intervention
- **OpenClaw responsiveness:** WhatsApp bot responds in <10 seconds with contextually relevant answers
- **Storefront MCP integration:** Real-time product availability, pricing, and cart operations via MCP
- **Klaviyo sync:** Customer events (purchase, subscription, browse) synced to Klaviyo within milliseconds
- **Delivery zone validation:** Orders outside delivery radius rejected gracefully with clear messaging
- **Cold start:** New product or pricing changes reflected on storefront within 5 minutes

### Measurable Outcomes

| Outcome | Metric | Measurement Method | Target |
|---|---|---|---|
| Conversion rate (web) | Visitors → Purchases | Shopify Analytics + GA4 | >2.5% (premium e-commerce benchmark) |
| Conversion rate (WhatsApp) | Conversations → Sales | OpenClaw analytics | >10% |
| Cart abandonment rate | Carts created → Completed | Shopify Analytics | <60% (with Klaviyo abandoned cart flow) |
| Subscription adoption | Purchasers → Subscribers | Shopify subscription data | >15% within 2 months |
| Average Order Value | Revenue / Orders | Shopify Analytics | >$250 MXN |
| Customer Acquisition Cost | Marketing spend / New customers | Multi-channel attribution | Establish baseline, optimize quarterly |
| Net Promoter Score | Survey responses | Post-delivery Klaviyo flow | >70 |
| Time-to-reorder | Days between purchases | Shopify customer data | <14 days for returning customers |

## Product Scope

*Note: Detailed phased roadmap with feature tables, dependencies, and risk mitigations in [Project Scoping & Phased Development](#project-scoping--phased-development).*

### MVP (2-Week Sprint) — Revenue Validation

One-time purchases only. Subscriptions, Klaviyo, and recycling are Phase 2.

**Storefront (Hydrogen/Oxygen):**
1. Product catalog (6-8 SKUs) in premium glass containers
2. Product pages: heritage storytelling + nutritional info (macros, keto badge) + clean ingredient list
3. Delivery zone validation (Puebla/Cholula radius)
4. Delivery day selection (martes/viernes) via cart attribute
5. Shop Pay / Shopify Payments (tarjetas, OXXO)
6. Mobile-first responsive design
7. Basic SEO (product schema, meta tags, og:image)
8. About / Heritage page (brand story)

**WhatsApp Sales (OpenClaw):**
9. Mich Sales Bot: FAQ responses, product catalog browsing, checkout link generation via Storefront MCP
10. Order confirmation notifications (email + WhatsApp)
11. Escalation to Taotech for complex queries (HORECA leads, complaints)

### Phase 2 — Growth (Months 2-3)

Subscription system, Klaviyo email flows, jar return program (Tier 1), recipe/blog content, customer accounts, Meta Ads first campaign.

### Phase 3 — Expansion (Months 4-6+)

Vertex AI predictive reorder, premium refillable containers (Tier 2), HORECA portal, sustainability dashboard, Mich Ops Telegram bot.

### Vision (Year 1-3)

Premium retail (City Market, Fresko, HEB), product line expansion (tzatziki, flavored YG, Greek ice cream), CDMX zone expansion, national D2C, multi-language storefront.

## User Journeys

### Journey 1: Sofia -- The Keto Discovery (D2C Shopify Store, Happy Path)

**Who she is:** Sofia, 32, CrossFit regular in Polanco, CDMX. She tracks her macros religiously -- 70% fat, 25% protein, 5% carbs. She's been buying imported Fage at City Market but hates that it's not local, not fresh, and the macros aren't great for keto (too much protein relative to fat). She's scrolling Instagram between sets.

**Opening Scene:** Sofia sees a Reel on Instagram: a close-up of thick, creamy labneh being scooped from a glass jar, with text overlay "9g fat, 6g protein, 1g carb per serving. Your keto dream dairy." She's never heard of Mich. She taps the profile, sees "Auténtica herencia libanesa, hecha en Mexico" and a link in bio.

**Rising Action:** She lands on the Mich Hydrogen storefront on her phone. The page loads fast (<2s on 4G). The hero shows Michel in his kitchen -- real, not stock. She taps "Labneh" and sees the product page: glass jar, clean ingredient list (leche, cultivos lacticos -- that's it), full macro breakdown front and center, keto badge. Price: $135 MXN for 500g. She compares mentally -- Fage 907g is $180 at City Market but it's yogurt, not labneh. This is different.

She adds Labneh 500g + Yogurt Griego 1kg to cart. Total: $425 MXN. She sees "Envio gratis arriba de $250" -- nice. Then she notices the subscription option: "Recibe cada semana o cada 15 dias. Elige tu dia: martes o viernes." She thinks about it -- she goes through a container every 3-4 days. She selects biweekly delivery, viernes.

**Climax:** She checks out with Shop Pay -- one tap, card already saved. Confirmation email arrives in 30 seconds. A WhatsApp message follows: "Hola Sofia! Tu pedido #1001 esta confirmado. Te llega este viernes entre 10am-2pm. Gracias por elegir Mich." She screenshots it and sends it to her CrossFit group chat: "encontre labneh keto artesanal hecho en Mexico, los macros estan increibles."

**Resolution:** Friday arrives. Glass jar with elegant label. She opens it, scoops labneh onto cucumber slices with za'atar she already has. It's the best labneh she's ever had outside of a Mediterranean restaurant. She posts a photo to her stories tagging @mich. Two weeks later, her subscription auto-delivers. She never thinks about buying yogurt again -- it just arrives. Three friends from CrossFit have already ordered from her recommendation.

**Requirements revealed:** Product pages with macro display and keto badge, subscription flow with day selection, Shop Pay integration, WhatsApp order confirmation, mobile-first design, social sharing optimization, free shipping threshold logic.

---

### Journey 2: Carlos -- The Heritage Evangelist (D2C + WhatsApp Reorder)

**Who he is:** Carlos, 45, half-Greek food enthusiast in Puebla. He grew up eating real Greek yogurt and labneh at his grandmother's table. He knows what the authentic product tastes like -- and he's never found it in Mexico. He buys Libanius out of desperation but privately considers it a pale imitation.

**Opening Scene:** Carlos is at an organic shop in Angelopolis. He sees a glass jar he doesn't recognize -- "Mich" -- next to the Libanius plastic tubs. Glass jar, elegant label, "Autentica herencia libanesa." He picks it up, reads the ingredients: leche, cultivos lacticos. Nothing else. He buys one Labneh 500g ($135) to try.

**Rising Action:** At home, he opens the jar. The texture is right -- thick, tangy, no gummy stabilizer feel. He tastes it plain. Then with olive oil and salt. He closes his eyes. This is it. This is what his grandmother made. He immediately wants more -- and he wants the yogurt too. He goes to the Mich website on his phone, orders Yogurt Griego 1kg + Labneh 500g x2. Signs up for weekly delivery, martes.

**Climax:** Two weeks in, he messages the Mich WhatsApp number: "Oigan, tambien hacen tzatziki? Y pueden mandarme 4 labneh esta semana? Tengo cena." The OpenClaw Sales Bot responds in seconds: "Hola Carlos! Aun no tenemos tzatziki pero esta en nuestros planes. Para tu cena, te armo el pedido: 4x Labneh 500g = $540. Lo sumamos a tu entrega del martes? Aqui esta tu link de pago." Carlos pays in one tap. He tells the bot: "El dia que hagan tzatziki me avisan, seria el primero en comprarlo." The bot notes his interest.

**Resolution:** Carlos becomes Mich's most vocal evangelist. He buys 4-5 containers weekly. He's introduced it to his extended family, his neighbors, and the owner of a Greek restaurant in Puebla. He messages the WhatsApp bot like he's texting a friend. When Mich eventually launches tzatziki, he gets a personal WhatsApp: "Carlos, lo prometido! El tzatziki ya esta disponible. Te agregamos uno a tu pedido del martes?" He replies "2" and it's done.

**Requirements revealed:** WhatsApp conversational commerce (OpenClaw + Storefront MCP), cart modification via chat, subscription modification flow, product interest tracking for future launches, artisanal shop channel integration, customer preference memory.

---

### Journey 3: Chef Daniel -- The HORECA Buyer (B2B Path)

**Who he is:** Daniel, 38, chef-owner of a Mediterranean restaurant in Puebla. He makes his own tzatziki from scratch using imported Greek yogurt. It's expensive, inconsistent (different batches from different importers), and his customers love the Mediterranean dishes but he knows the ingredients could be better.

**Opening Scene:** Daniel tries Mich yogurt at a friend's house (Carlos introduced it). As a chef, he immediately recognizes the quality -- the protein content, the texture, the clean flavor. He thinks: "If I could get this in bulk for my kitchen..."

**Rising Action:** He visits the Mich website. There's no wholesale section yet (MVP). He messages the WhatsApp number: "Soy chef, tengo restaurante mediterraneo en Puebla. Me interesa comprar yogurt griego y labneh al mayoreo para mi cocina. Manejan precios por volumen?" The OpenClaw bot recognizes this as a HORECA inquiry and escalates: "Que bueno Daniel! Para pedidos de restaurante, te conecto con Taotech directamente. El te contacta hoy." Taotech gets a Telegram notification via Mich Ops: "HORECA lead: Chef Daniel, restaurante mediterraneo Puebla, interesado en YG + Labneh mayoreo."

**Climax:** Taotech contacts Daniel, arranges a kitchen visit. Daniel meets Michel, sees the production process. They agree on bulk pricing (competitive for restaurant margins), a weekly standing order of 5kg yogurt + 3kg labneh, delivered on lunes to prep for the week. Daniel starts using Mich yogurt in his tzatziki, his mezze platters, and as a standalone menu item: "Labneh Mich con aceite de oliva y za'atar."

**Resolution:** Daniel becomes a reliable B2B customer with predictable weekly orders. He puts "Elaborado con yogurt artesanal Mich" on his menu. His diners ask about it. Some become D2C customers. When food bloggers visit his restaurant, the Mich story becomes part of the review. Daniel refers two other chef friends.

**Requirements revealed:** WhatsApp escalation to human for complex queries, HORECA lead capture and notification (Mich Ops Telegram), CRM-like customer tagging (HORECA vs D2C), future: wholesale portal or bulk ordering system.

---

### Journey 4: Ana -- The Wellness Mom on Rappi (Delivery App Path)

**Who she is:** Ana, 36, mother of two in Condesa, CDMX. She orders everything on Rappi -- groceries, meals, snacks. She's health-conscious but time-poor. She wants clean-label, no-additive food for her kids but doesn't have time to visit specialty stores. She reads every ingredient list.

**Opening Scene:** Ana is doing her weekly Rappi grocery order. She searches "yogurt griego" looking for something better than Oikos for her kids' breakfast. She sees "Mich - Yogurt Griego Artesanal 500g" with a glass jar photo and "Sin aditivos, sin gomas, sin conservadores." Premium price ($150 vs $65 for Oikos 900g) but the ingredient list is two items long. She adds one to try.

**Rising Action:** The Rappi order arrives. Her kids eat the yogurt with honey and fruit. They ask for more the next day -- they've never reacted this way to yogurt. Ana reads the label more carefully: 15g protein per serving, no sugar added, artisanal production. She googles "Mich yogurt" and finds the website. She sees Michel's story, the Lebanese heritage, the glass containers. She realizes she can subscribe directly and get it cheaper than Rappi (no delivery app markup).

**Climax:** She visits the Shopify store, sets up a weekly subscription: Yogurt Griego 1kg (for the family) + Yogurt Griego 250g x2 (for the kids' lunchboxes). Delivery on martes. Total: $450 MXN/week. She receives a WhatsApp confirmation and a follow-up with a recipe: "Yogurt bowl para ninos: Mich YG + platano + granola + miel. Listo en 2 minutos."

**Resolution:** Ana never buys Oikos again. The kids call it "el yogurt del frasco" (the jar yogurt). She tells other moms in her kids' school WhatsApp group. When friends visit and she serves it, they ask where to get it. She shares the Mich website link. She starts buying labneh too after Mich sends her a Klaviyo email: "Si te gusta nuestro yogurt, conoce el labneh -- perfecto como dip saludable para la cena."

**Requirements revealed:** Delivery app listing optimization (photos, descriptions, ingredient callouts), Rappi/Cornershop integration, D2C conversion funnel from delivery apps, Klaviyo cross-sell flows, recipe content as engagement tool, family-oriented messaging.

---

### Journey 5: Taotech -- The AI-Native Operator (Admin/Operations)

**Who he is:** Taotech, the business partner, capital investor, and technical brain behind Mich. Live coder, AI power user. He manages the entire digital infrastructure, marketing automation, and business operations. Michel handles production; Taotech handles everything else.

**Opening Scene:** Monday morning. Taotech opens Warp terminal. Three tabs: OpenClaw logs (WhatsApp conversations), Claude Code agent running `/check-metrics --days 7`, and Shopify admin in browser. Mich Ops pings him on Telegram: "Buenos dias. Resumen semanal: 47 pedidos, $18,200 MXN revenue, 12 nuevas suscripciones, 89% fulfillment rate. 3 mensajes sin resolver en WhatsApp -- Carlos pregunta por tzatziki otra vez, un lead HORECA nuevo, y una queja de entrega tarde el viernes."

**Rising Action:** Taotech handles the three items:
1. Notes Carlos's tzatziki request (product roadmap item)
2. Responds to HORECA lead via personal WhatsApp (schedules meeting)
3. Checks delivery issue -- Shopify shows order delivered 3 hours late. Messages the customer via Mich Ops: "Disculpa la demora. Tu proximo pedido va con un labneh 200g de regalo." Updates Shopify order with discount code for next order.

Then he runs `/weekly-content` via Claude Code: generates 4 Reel scripts, 2 carousel posts, and captions for the week around the theme "Proteina limpia para toda la familia." Reviews in Warp, approves, content gets pushed to Buffer for scheduling and Notion for tracking.

**Climax:** He checks Klaviyo: the abandoned cart flow recovered 6 carts this week ($2,400 MXN). Subscription retention is at 88%. He notices that the "post-purchase recipe email" has a 45% open rate -- highest of any flow. He tells Claude Code: "Generate 5 more recipe variations for the post-purchase flow, focus on keto and kids." Copies the best ones into Klaviyo.

**Resolution:** By Friday, the week runs itself. Subscriptions auto-fulfill. WhatsApp bot handles 80% of inquiries. Content is scheduled through Sunday. Taotech reviews weekend orders on his phone via Mich Ops Telegram -- "Sabado: 11 pedidos, $4,700 MXN. Todo entregado." He messages Michel: "Vamos bien, necesitamos hablar de aumentar produccion."

**Requirements revealed:** Mich Ops Telegram bot (business intelligence + alerts), Claude Code slash commands for operations, Klaviyo flow analytics and optimization, Shopify admin API for order management, customer service workflow (complaint → resolution → compensation), content generation pipeline, metrics dashboard needs.

---

### Journey 6: Laura -- Bounce Recovery (Edge Case / Error Path)

**Who she is:** Laura, 29, fitness influencer in Santa Fe. She clicks a Mich Instagram ad but lands on a product page for Labneh. She doesn't know what labneh is.

**Opening Scene:** Laura sees a targeted Instagram ad: "Alto en proteina, sin aditivos, perfecto post-gym." She taps. Lands on the Labneh 500g product page. "Jocoque seco? Labneh? What is this?" She's confused -- she expected yogurt.

**Rising Action:** The product page anticipates this. Below the product info, there's a section: "Nuevo en el labneh? Es el queso crema del Mediterraneo -- mas proteina que el yogurt griego, cero carbohidratos netos, perfecto para keto. Pruebalo con aceite de oliva y pan arabe, o como dip con verduras." She's intrigued but not ready to buy. She browses to the Yogurt Griego page instead -- this she understands. She adds YG 500g to cart but abandons at checkout (gets a phone call).

**Climax:** 2 hours later, Klaviyo abandoned cart email: "Olvidaste algo? Tu Yogurt Griego Mich te esta esperando. Completa tu pedido aqui." She clicks, completes purchase. 3 days after delivery, Klaviyo sends: "Te gusto el yogurt? Si quieres probar algo nuevo, el labneh es como yogurt griego concentrado -- mas espeso, mas proteico, y perfecto para snacks post-gym. 10% en tu primer labneh con codigo PRUEBALBNEH."

**Resolution:** Laura tries the labneh. Loves it. Makes a TikTok: "Este labneh artesanal tiene las mejores macros que he visto en un lacteo mexicano." The video gets 50K views. Mich gains 200 followers and 15 orders in 48 hours.

**Requirements revealed:** Product page education content (what is labneh?), cross-selling from yogurt to labneh, Klaviyo abandoned cart flow with timing optimization, post-purchase cross-sell flow with discount code, Instagram ad → product page landing optimization, content that converts confusion into curiosity.

---

### Journey Requirements Summary

| Journey | Key Capabilities Revealed |
|---|---|
| **Sofia (Keto D2C)** | Macro display, keto badge, subscription with day selection, Shop Pay, WhatsApp confirmation, mobile-first, free shipping threshold |
| **Carlos (Heritage Evangelist)** | WhatsApp conversational commerce, cart modification via chat, subscription modification, product interest tracking, customer preference memory |
| **Chef Daniel (HORECA)** | WhatsApp escalation to human, HORECA lead notification via Telegram, customer type tagging, future: wholesale ordering |
| **Ana (Rappi Mom)** | Delivery app listing optimization, D2C conversion from delivery apps, Klaviyo cross-sell flows, recipe content, family messaging |
| **Taotech (Operator)** | Mich Ops Telegram bot, Claude Code slash commands, Klaviyo analytics, Shopify admin API, customer service workflow, content pipeline |
| **Laura (Bounce Recovery)** | Product education content, cross-selling logic, abandoned cart flow, post-purchase cross-sell with discount, ad-to-product landing optimization |

**Capability Priority Matrix (MVP vs Post-MVP):**

| Capability | MVP | Post-MVP |
|---|---|---|
| Shopify storefront with product pages, macros, subscriptions | Yes | |
| Shop Pay / Shopify Payments | Yes | |
| WhatsApp Sales Bot (OpenClaw + Storefront MCP) | Yes | |
| Klaviyo: welcome, order confirmation, abandoned cart | Yes | |
| Delivery zone validation | Yes | |
| Rappi/Cornershop listing | Yes | |
| WhatsApp escalation to Taotech | Yes | |
| Klaviyo cross-sell flows (YG → labneh) | | Month 2 |
| Mich Ops Telegram bot | | Month 2-3 |
| Product interest tracking for future launches | | Month 3 |
| HORECA wholesale portal | | Month 6+ |
| Vertex AI predictive reorder | | Month 3-6 |
| Recipe content engine | | Month 2 |

## Domain-Specific Requirements

### Compliance & Regulatory

**Food & Health Regulations (Mexico):**
- **COFEPRIS aviso de funcionamiento:** Required for food production facility -- must be filed as part of kitchen expansion (not blocking Shopify launch, but blocking retail expansion)
- **Registro sanitario:** Required for each product SKU before entry into premium retail channels (City Market, Fresko, HEB). Not required for D2C/artisanal but strongly recommended
- **NOM compliance:** Normas Oficiales Mexicanas for dairy products -- labeling requirements (NOM-051 for nutritional labeling), ingredient declarations, expiration dates
- **GS1 barcodes:** Required for each SKU for retail channel entry. Application should be submitted in first 90 days
- **Licencia de uso de suelo:** Required for new kitchen facility -- permits for commercial food production at the specific location

**E-commerce & Payments Compliance:**
- **Shopify Payments Mexico:** Compliant with Mexican banking regulations. Supports tarjetas de credito/debito, OXXO Pay, SPEI transfers. Shopify handles PCI-DSS compliance for payment processing
- **Ley Federal de Proteccion al Consumidor:** Right of return/refund policies must be clearly stated. For perishable goods, standard return policies are modified but must be communicated
- **Aviso de privacidad:** Required privacy notice for collecting customer data (name, address, payment, purchase history). Must be displayed on website and communicated at point of data collection
- **Facturacion electronica (CFDI):** If customers request invoices, the business must be able to issue CFDI through SAT. Shopify apps available for this

**Subscription-Specific:**
- Clear terms for subscription billing, frequency, cancellation policy
- Easy cancellation mechanism (Mexican consumer protection requires this not be deliberately difficult)
- Transparent pricing -- subscription price vs one-time price clearly communicated

### Technical Constraints

**Cold Chain & Perishable Product:**
- Products have limited shelf life (~21 days for yogurt, ~30 days for labneh)
- Inventory management must account for production dates and expiration
- Delivery must maintain cold chain (2-8°C) from production to customer
- Order fulfillment window is constrained by delivery days (martes/viernes)
- Out-of-stock handling critical -- subscriptions must gracefully handle production shortfalls (notify customer, skip delivery, credit account)

**Delivery Zone Constraints:**
- MVP limited to Puebla/Cholula radius (geographic polygon validation)
- Delivery addresses outside zone must be rejected at checkout with clear messaging
- Zone expansion (CDMX) requires new cold chain logistics partner
- Delivery app coverage (Rappi/Cornershop) may have different zone boundaries

**Shopify Platform Constraints:**
- Hydrogen/Oxygen hosting: edge-deployed, global CDN, but custom server-side logic limited to Shopify Functions
- Subscription management depends on Shopify Subscriptions API or third-party app (Recharge, Bold, Loop)
- Delivery day selection (martes/viernes) is custom logic -- not native Shopify. Requires Shopify Functions (delivery customization) or metafield-based workaround
- WhatsApp integration (OpenClaw) operates outside Shopify -- needs webhook sync for order status updates

**AI Integration Constraints:**
- OpenClaw (WhatsApp bot) is self-hosted -- requires server uptime and monitoring
- Storefront MCP provides read-only product/cart access -- order creation goes through Shopify checkout (not direct API)
- Klaviyo sync is near-real-time via Shopify integration -- no custom sync needed for MVP
- Vertex AI requires purchase history data accumulation before predictive models are useful (3-6 months)

### Integration Requirements

| System | Integration Type | MVP | Purpose |
|---|---|---|---|
| **Shopify (Backend)** | Core platform | Yes | Products, orders, customers, payments, subscriptions |
| **Shopify Storefront API** | GraphQL API | Yes | Frontend data fetching (Hydrogen) |
| **Shopify Storefront MCP** | MCP Protocol | Yes | OpenClaw product search, cart operations |
| **Shop Pay** | Native Shopify | Yes | One-tap checkout, saved payment methods |
| **Klaviyo** | Shopify native integration | Yes | Email flows, customer segmentation |
| **OpenClaw** | Self-hosted, Anthropic API | Yes | WhatsApp Sales Bot |
| **WhatsApp Business API** | Via OpenClaw | Yes | Customer messaging channel |
| **Rappi/Cornershop** | Marketplace listing | Yes | Delivery app presence |
| **Buffer** | API/manual | Yes | Social media scheduling |
| **Google Analytics 4** | Shopify integration | Yes | Traffic and conversion analytics |
| **Telegram Bot API** | Via OpenClaw | Post-MVP | Mich Ops business intelligence |
| **Vertex AI / BigQuery** | Google Cloud | Post-MVP | Predictive models, customer analytics |
| **Notion** | MCP/API | Post-MVP | Content calendar, operations tracking |
| **Meta Ads / TikTok Ads** | Platform APIs | Post-MVP | Paid advertising automation |

### Risk Mitigations

| Risk | Domain-Specific Impact | Mitigation |
|---|---|---|
| **Production shortfall** | Subscriptions promise delivery but production is capacity-constrained at 600L/week | Build subscription cap logic -- limit total active subscriptions to X% of weekly production. Queue waitlist if capacity reached. Notify subscribers if delivery must be skipped |
| **Cold chain failure** | Perishable product arrives spoiled -- customer trust destroyed | Insulated packaging with cold packs, delivery window enforcement (no deliveries after 2pm in hot weather), clear refund/replacement policy for quality issues |
| **Glass breakage in delivery** | Premium packaging is fragile | Protective packaging inserts, replacement guarantee for breakage, delivery partner training |
| **Shopify platform changes** | Hydrogen/Oxygen is relatively new -- API changes possible | Pin Hydrogen version, monitor Shopify changelog, maintain upgrade path |
| **OpenClaw security** | Self-hosted AI agent with customer data access -- 512 vulnerabilities reported | API keys in .env only, OpenClaw on local network (not public), rate limiting, minimal permissions per agent, regular updates |
| **Subscription payment failures** | Recurring charges can fail (expired cards, insufficient funds) | Klaviyo dunning flow (payment retry notifications), grace period before subscription pause, easy payment update flow |
| **Regulatory enforcement** | Operating without full NOM compliance in D2C could attract attention if brand gains visibility | Prioritize NOM-051 labeling compliance on glass containers from launch. File COFEPRIS and GS1 applications in first 90 days even if not blocking D2C |

## Innovation & Novel Patterns

### 1. AI-Native Artisanal Commerce

**The Pattern:** Most artisanal food brands either stay low-tech (WhatsApp groups, paper orders) or adopt generic SaaS e-commerce. MitchWeb bridges this gap — a fully AI-native commerce system that preserves the personal, human feel of artisanal buying while automating everything behind the scenes.

**What makes it novel:**
- **Conversational commerce as primary channel**: OpenClaw on WhatsApp isn't a chatbot FAQ — it's an AI sales agent that knows inventory, takes orders, remembers preferences, and sounds like the brand (warm, knowledgeable, never robotic)
- **Predictive reorder without subscription fatigue**: Instead of forcing rigid subscriptions, Vertex AI predicts when customers need to restock and sends a personal WhatsApp nudge. The customer says "sí" and the order is placed. No login, no app, no cart abandonment
- **Content generation from commerce data**: Sales patterns and customer questions feed back into content creation — if 30 customers ask about keto this week, the system surfaces "keto" as the content theme automatically

**Validation approach:** MVP launches with OpenClaw WhatsApp sales + Shopify backend. Measure conversion rate of WhatsApp conversations vs. traditional web checkout. Target: WhatsApp converts at 2x the rate of web-only.

### 2. Two-Tier Packaging as Brand Architecture

**The Pattern:** Using packaging material itself as a channel segmentation and brand positioning tool — not just a cost decision.

**What makes it novel:**
- **Plastic = intermediary/volume channel**: Current plastic containers continue for tiendas, mercados, and existing B2B relationships. No premium branding needed — the product speaks for itself at familiar price points
- **Glass = D2C premium channel**: Premium glass containers exclusively for Shopify D2C customers. The glass itself communicates "this is a different experience" — artisanal, worth more, worth keeping
- **Packaging as conversion signal**: When someone receives the glass container, they're holding proof that they've "upgraded" to the premium tier. It's an unboxing moment for a dairy product — unusual and memorable

**Validation approach:** Track whether glass-packaged D2C orders have higher repeat rate and higher NPS than plastic-packaged intermediary orders. Target: D2C repeat rate > 40% vs. intermediary <15%.

### 3. Dual-Messaging Brand Architecture

**The Pattern:** Operating two brand voices from one product line — heritage storytelling for emotional connection and functional nutrition for performance-oriented buyers.

**What makes it novel:**
- **Same product, two stories**: Yogurt griego is positioned as "Lebanese heritage recipe" for the foodie/heritage segment AND "32g protein per serving" for the fitness/keto segment — same SKU, different messaging
- **AI-driven audience routing**: OpenClaw and the storefront detect buyer signals (keto keywords, recipe interest, protein questions) and serve the appropriate messaging track automatically
- **Content that bridges both**: Recipes that are both "authentic Lebanese" AND "keto-friendly" — satisfying both audiences simultaneously

**Validation approach:** A/B test landing pages (heritage-first vs. nutrition-first) and measure which converts better per segment. Measure whether dual-messaging increases total addressable audience.

### 4. Closed-Loop Glass Economy

**The Pattern:** A glass container recycling and refill program that turns packaging into a sustainability story, a customer retention mechanic, and a premium upsell opportunity.

**Two-tier program:**

**Tier 1 — Jar Return Program (Subscription Customers):**
- Active subscribers can return clean glass jars at delivery pickup
- Each returned jar earns credit toward next order (e.g., $10-15 MXN per jar)
- Delivery driver picks up empties when dropping off new order — zero extra logistics
- Jars are sanitized and reused, reducing packaging costs over time
- Messaging: "Tu frasco regresa lleno. Cero desperdicio."

**Tier 2 — Premium Refillable Containers:**
- Special collector/limited-edition glass containers (ceramic lids, branded designs, seasonal art)
- Priced higher ($50-100 MXN premium over standard glass)
- Designed for refill — customer brings container to pickup point or receives refill pouches
- Creates collectible dimension (seasonal editions, collaboration designs)
- Messaging: "Un envase que vale la pena conservar."

**Ecological ethics positioning:**
- Track and display environmental impact: "X jars returned = Y kg less glass waste"
- Customer-facing sustainability dashboard on their account page
- Social sharing mechanic: badge/certificate for jar returns milestones
- Positions Mich as the eco-conscious choice vs. competitors using disposable plastic

**Validation approach:** Launch Tier 1 with subscription customers in Month 2. Track jar return rate (target: >30% of subscribers return jars within 3 months). Measure whether the recycling program increases subscription retention. Tier 2 launches in Month 4+ as a limited pilot.

## Web App Specific Requirements

### Project-Type Overview

MitchWeb is a **Shopify Hydrogen headless storefront** — a server-side rendered React application deployed on Shopify Oxygen. It operates as the premium D2C channel for Jocoque & Yogurt Mich, handling product discovery, subscription management, checkout, and post-purchase experience. The storefront works in tandem with OpenClaw (WhatsApp conversational commerce) as dual sales channels feeding into a single Shopify backend.

The key architectural distinction: this is **not** a general-purpose e-commerce site. It's a focused, high-conversion storefront for a single artisanal brand with limited SKUs (~8-12 products), limited production capacity, and a delivery model constrained to specific geographic zones and delivery days.

### Technical Architecture Considerations

**Framework:** Shopify Hydrogen 2024+ (Remix-based)
- Server-side rendering with streaming for fast TTFB
- Shopify Storefront API (GraphQL) for all commerce data
- Shopify Functions for custom delivery logic (martes/viernes scheduling, zone validation)
- Oxygen hosting (Shopify's edge CDN) — zero DevOps overhead

**Rendering strategy:** SSR-first with selective client hydration
- Product pages, collection pages, and landing pages are SSR for SEO and performance
- Interactive components (subscription configurator, delivery scheduler, glass recycling tracker) hydrate on client
- No full SPA behavior — each route is server-rendered, Remix handles transitions

**Data flow:**
- Storefront API → Product catalog, pricing, inventory, metafields
- Customer Account API → Order history, subscription status, jar return credits
- Admin API (server-side only) → Subscription management, custom order logic
- OpenClaw API → WhatsApp order handoff, inventory queries

### Browser & Device Matrix

| Target | Priority | Min Version | Notes |
|---|---|---|---|
| **Mobile Safari (iOS)** | Critical | iOS 15+ | Primary device — WhatsApp link tap opens Safari |
| **Chrome Mobile (Android)** | Critical | Android 10+ / Chrome 90+ | Large segment of Mexican mobile users |
| **Chrome Desktop** | High | Chrome 90+ | HORECA buyers, admin use |
| **Safari Desktop (macOS)** | Medium | Safari 15+ | Secondary desktop |
| **Firefox Desktop** | Low | Firefox 90+ | Minimal expected traffic |
| **Edge** | Low | Edge 90+ | Minimal expected traffic |

**Mobile-first design is mandatory.** 80%+ of traffic arrives via WhatsApp links tapped on mobile. The storefront must feel native-app-quality on mobile: fast, thumb-friendly, minimal scrolling to purchase.

### Responsive Design Requirements

| Breakpoint | Target | Design Priority |
|---|---|---|
| **320-480px** | Mobile (primary) | Full featured — this IS the main experience |
| **481-768px** | Tablet / large phone | Comfortable product browsing |
| **769-1024px** | Small laptop / tablet landscape | Product pages + subscription management |
| **1025px+** | Desktop | HORECA catalog, admin dashboard, content-rich pages |

**Key responsive behaviors:**
- Product images: full-bleed on mobile, grid on desktop
- Subscription configurator: single-column wizard on mobile, side-by-side on desktop
- Checkout: Shopify native checkout (mobile-optimized by default via Shop Pay)
- Navigation: bottom tab bar on mobile (Productos, Suscripción, Mi Cuenta, WhatsApp), standard header on desktop

### Performance Targets

*Specific metrics and measurement methods in [Non-Functional Requirements > Performance](#performance). Key targets: LCP < 2.5s on 4G mobile, TTI < 3.5s, page weight < 500KB, Lighthouse > 90.*

**Performance strategy:**
- Hydrogen's built-in image component with Shopify CDN (automatic WebP, srcset, lazy loading)
- Route-based code splitting (Remix default)
- Critical CSS inlined, non-critical deferred
- Prefetch on link hover/viewport entry for instant page transitions
- Minimal third-party scripts (only Klaviyo snippet + GA4)

### SEO Strategy

**Organic search is the long-term growth channel.** Paid ads drive initial traffic, but owning "yogurt artesanal" and "jocoque libanés" search terms provides compounding returns.

**Technical SEO (Hydrogen provides most of this):**
- SSR-rendered HTML for all pages — fully crawlable by Googlebot
- Structured data (JSON-LD): Product, BreadcrumbList, Organization, LocalBusiness, FAQ
- Meta tags generated per route (title, description, og:image, canonical)
- Sitemap.xml generated from Shopify product/collection/page data
- Robots.txt configured via Oxygen

**Content SEO strategy:**
- Product pages optimized for: "yogurt griego artesanal", "jocoque libanés México", "yogurt proteico natural"
- Recipe/blog section (Phase 2) targeting long-tail: "receta con jocoque", "yogurt griego keto receta", "beneficios del jocoque"
- FAQ page targeting: "qué es el jocoque", "diferencia yogurt griego artesanal vs industrial"
- Local SEO: Google Business Profile for the brand, LocalBusiness structured data

**SEO targets (6 months):**
- Top 5 for "jocoque artesanal" (low competition)
- Top 10 for "yogurt griego artesanal México" (medium competition)
- 500+ organic sessions/month from recipe/education content

### Accessibility Level

**Target: WCAG 2.1 Level A** (baseline, not AA)

Pragmatic approach for MVP — full AA compliance is not required by Mexican law and would slow delivery. Focus on:

- **Semantic HTML**: Proper heading hierarchy, landmark regions, form labels
- **Color contrast**: Minimum 4.5:1 for body text (the heritage color palette must be tested)
- **Alt text**: All product images and brand imagery have meaningful alt text (also helps SEO)
- **Keyboard navigation**: All interactive elements reachable via keyboard (Hydrogen components support this by default)
- **Form accessibility**: Error messages associated with fields, clear validation states
- **Skip navigation**: Skip-to-content link for screen readers

**Not in MVP scope:** Full WCAG AA, aria-live regions for dynamic content, comprehensive screen reader testing. Revisit in Growth phase if market expands to institutional/government buyers who may require accessibility compliance.

### Implementation Considerations

**Shopify Hydrogen specifics:**
- Use Hydrogen's `<Image>`, `<Money>`, `<ShopPayButton>` components for consistent, optimized rendering
- Leverage Shopify's CDN for all media assets — no separate image hosting needed
- Use Remix loaders for data fetching — keeps logic server-side, reduces client JS
- Metafields for custom data: delivery zones, subscription options, jar return credits, production batch info
- Shopify Functions for delivery scheduling logic (Custom Delivery Customization API)

**Testing strategy:**
- Visual regression testing on 3 key devices: iPhone SE (small), iPhone 15 (standard), Pixel 7 (Android baseline)
- Lighthouse CI in deployment pipeline — block deploy if performance score < 85
- Real-device testing on Telcel 4G (representative Mexican mobile network) before launch

**Deployment:**
- Oxygen hosting (included with Shopify) — automatic global CDN, zero-config deployments
- Preview deployments for each PR (Oxygen supports this)
- Production deploy via `shopify hydrogen deploy` from CI/CD pipeline

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Revenue MVP — validate premium D2C pricing and glass packaging as conversion driver
**Core Hypothesis:** Customers will pay 30-50% more for Mich products in premium glass containers via D2C Shopify, compared to intermediary plastic pricing
**Timeline:** 2 weeks to launch
**Resource Requirements:** 1 developer/power user (Taotech), leveraging Shopify Hydrogen starter template + OpenClaw for WhatsApp

### MVP Feature Set (Phase 1 — Weeks 1-2)

**Core User Journeys Supported:**

| Journey | MVP Support | Notes |
|---|---|---|
| Sofia (Keto D2C) | Full | Primary conversion target |
| Carlos (Heritage Foodie) | Full | Primary conversion target |
| Ana (Wellness Mom) | Partial | Can browse/buy, but Rappi integration is post-MVP |
| Chef Daniel (HORECA) | Manual | WhatsApp contact only — no HORECA portal yet |
| Taotech (Admin) | Via Shopify Admin | No custom dashboard yet |
| Laura (Bounce Recovery) | Partial | Exit intent + WhatsApp CTA, no Klaviyo flows yet |

**Must-Have Capabilities (Launch Blockers):**

| Capability | Rationale | Implementation |
|---|---|---|
| Product catalog (6-8 SKUs) | Can't sell without products | Hydrogen product pages + Shopify backend |
| Glass container product photos | Premium positioning requires premium visuals | Professional photos of glass packaging |
| Mobile-optimized checkout | 80%+ mobile traffic | Shopify native checkout + Shop Pay |
| Delivery zone validation | Can only deliver to Morelia metro + select zones | Shopify Functions or simple zip code check |
| Delivery day selection (martes/viernes) | Production schedule constraint | Custom cart attribute or metafield |
| WhatsApp CTA on every page | Bridge to conversational commerce | Floating WhatsApp button → OpenClaw |
| OpenClaw WhatsApp Sales Bot | Primary sales channel alongside web | OpenClaw + Claude Sonnet + Shopify Storefront MCP |
| Basic "About / Heritage" page | Brand story is the differentiator | Static Hydrogen page |
| Order confirmation (email + WhatsApp) | Post-purchase experience | Shopify email + OpenClaw notification |
| Payment processing | Revenue | Shopify Payments (cards) + OXXO Pay (cash) |
| NOM-051 compliant product labels | Regulatory minimum for D2C | Label design for glass containers |

**Explicitly NOT in MVP:**

| Excluded | Why | When |
|---|---|---|
| Subscription system | Complex to build correctly — validate one-time purchase demand first | Phase 2 (Month 2) |
| Klaviyo email flows | Need customer base first; manual email is fine for first 50 customers | Phase 2 (Month 2) |
| Jar return / recycling program | Need subscribers first | Phase 2 (Month 2-3) |
| Vertex AI / predictive models | Need 3+ months of purchase data before predictions are useful | Phase 3 (Month 4+) |
| Recipe/blog content | SEO is a long game; paid ads + WhatsApp drive initial traffic | Phase 2 (Month 2-3) |
| HORECA portal | B2B channel exists via intermediaries already | Phase 3 |
| Rappi/Cornershop integration | Marketplace listings are separate from D2C store | Phase 2 |
| Multi-language (English) | Mexican market first | Phase 3 |
| Custom admin dashboard | Shopify Admin is sufficient at launch scale | Phase 3 |
| Premium refillable containers (Tier 2) | Need Tier 1 recycling running first | Phase 3 (Month 4+) |

### Post-MVP Features

**Phase 2 — Growth (Months 2-3):**

| Feature | Priority | Dependency |
|---|---|---|
| Subscription system (weekly/biweekly) | High | Validated one-time purchase demand |
| Klaviyo integration + 6 automated flows | High | 50+ customer emails collected |
| Jar return program (Tier 1) | High | Active subscribers |
| Recipe/blog section | Medium | Content created via AI workflows |
| Delivery tracking notifications | Medium | Delivery partner API or manual status updates |
| Customer account pages (order history, subscription management) | High | Subscription system |
| Buffer API integration for social scheduling | Medium | Content workflow established |
| Exit-intent recovery (Klaviyo popup + WhatsApp) | Medium | Klaviyo integration |
| Google Analytics 4 enhanced e-commerce | Medium | GA4 configured |
| Meta Ads Advantage+ first campaign | High | Product photos + initial organic content |

**Phase 3 — Expansion (Months 4-6+):**

| Feature | Priority | Dependency |
|---|---|---|
| Vertex AI predictive reorder | High | 3+ months purchase history in BigQuery |
| Premium refillable containers (Tier 2) | Medium | Tier 1 jar return validated |
| HORECA portal / wholesale ordering | Medium | B2B demand validated |
| Sustainability dashboard (jar return stats) | Medium | Tier 1 running 2+ months |
| Mich Ops Telegram bot | Low | Operational complexity warrants it |
| Dynamic landing pages per segment | Medium | Enough traffic data to segment |
| Rappi/Cornershop storefront links | Low | Marketplace partnerships established |
| Notion MCP for operations tracking | Low | Team grows beyond 1 person |
| Advanced A/B testing infrastructure | Low | Enough traffic for statistical significance |

### Risk Mitigation Strategy

*Domain-specific risks (production, cold chain, regulatory) in [Domain-Specific Requirements > Risk Mitigations](#risk-mitigations). Below are implementation and go-to-market risks specific to the phased roadmap.*

**Technical Risks:**

| Risk | Mitigation |
|---|---|
| Hydrogen learning curve delays launch | Start from Shopify's demo-store template — customize, don't build from scratch |
| OpenClaw setup complexity | Deploy with minimal skills first (FAQ + catalog only). Add order creation in Week 2 |
| Delivery scheduling logic is complex | MVP: simple dropdown (martes/viernes) as cart attribute. Manual fulfillment handles routing |

**Market Risks:**

| Risk | Mitigation |
|---|---|
| Customers won't pay premium D2C prices | Test 3 price points in first month. WhatsApp allows personal negotiation |
| Low initial traffic | WhatsApp broadcast to existing customers + Instagram/TikTok content + Meta Ads ($500 MXN/week) |

**Resource Risks:**

| Risk | Mitigation |
|---|---|
| Single developer is the bottleneck | Hydrogen template + OpenClaw config + Shopify infrastructure minimizes custom code |
| Production capacity can't meet D2C + intermediary demand | Inventory caps in Shopify (reserve X% for D2C). Scarcity drives premium perception |
| 2-week timeline is aggressive | Scope is minimal. Fallback: launch with product pages + WhatsApp CTA only, iterate from there |

## Functional Requirements

### Product Discovery & Catalog

- **FR1:** Customer can browse the complete product catalog with product images, descriptions, and pricing
- **FR2:** Customer can view detailed product information including ingredients, nutritional facts, and production origin
- **FR3:** Customer can filter products by category (yogurt griego, jocoque, labneh, snacks)
- **FR4:** Customer can see real-time inventory availability for each product
- **FR5:** Customer can view products with their glass container packaging presentation
- **FR6:** System displays dual messaging (heritage story and nutritional benefits) on product pages based on available content

### Ordering & Checkout

- **FR7:** Customer can add products to a cart and modify quantities
- **FR8:** Customer can select a delivery day (martes or viernes) during checkout
- **FR9:** Customer can enter a delivery address and receive validation of whether their zone is serviceable
- **FR10:** Customer can pay via credit/debit card (Shopify Payments)
- **FR11:** Customer can pay via OXXO cash deposit
- **FR12:** Customer can complete checkout with Shop Pay for accelerated mobile purchase
- **FR13:** System prevents orders to unserviceable delivery zones with a clear explanation
- **FR14:** System enforces inventory limits to prevent overselling against production capacity

### Post-Purchase & Order Management

- **FR15:** Customer receives order confirmation via email immediately after purchase
- **FR16:** Customer receives order confirmation via WhatsApp immediately after purchase
- **FR17:** Customer can view their order history and order status in their account
- **FR18:** Customer can contact support about an existing order via WhatsApp

### Conversational Commerce (WhatsApp)

- **FR19:** Customer can ask product questions via WhatsApp and receive accurate, brand-voiced responses from the AI sales agent
- **FR20:** Customer can browse the product catalog and get product recommendations via WhatsApp conversation
- **FR21:** Customer can place an order through WhatsApp conversation and receive a Shopify checkout link
- **FR22:** Customer can check product availability and pricing via WhatsApp
- **FR23:** AI sales agent can access real-time Shopify inventory and product data to answer customer queries
- **FR24:** AI sales agent escalates conversations it cannot handle to the human operator via Telegram notification
- **FR25:** Operator receives a summary of all WhatsApp sales conversations and orders via Telegram (Mich Ops)

### Subscription Management (Phase 2)

- **FR26:** Customer can subscribe to recurring delivery of selected products on a weekly or biweekly schedule
- **FR27:** Customer can select their preferred delivery day (martes or viernes) for their subscription
- **FR28:** Customer can pause, modify, or cancel their subscription from their account
- **FR29:** Customer can update payment method for their subscription
- **FR30:** System processes subscription payments automatically on the scheduled billing cycle
- **FR31:** System notifies the customer via email and WhatsApp before each subscription delivery
- **FR32:** System enforces a maximum number of active subscriptions based on production capacity

### Glass Recycling & Sustainability (Phase 2)

- **FR33:** Subscriber can opt into the jar return program from their account
- **FR34:** System tracks the number of jars returned per customer and applies credits to their account
- **FR35:** Customer can view their jar return history and accumulated credits
- **FR36:** Customer can view their environmental impact (jars returned, waste reduced) on their account page
- **FR37:** Delivery driver flow supports jar pickup notation at time of delivery (Phase 2 operational process)

### Brand & Content Experience

- **FR38:** Visitor can read the brand heritage story (About / Our Story page)
- **FR39:** Visitor can view a FAQ page answering common questions about products, ordering, and delivery
- **FR40:** Visitor can access the WhatsApp sales channel from any page via a persistent CTA
- **FR41:** Visitor can view the site in a mobile-first responsive layout optimized for WhatsApp-referred traffic
- **FR42:** Visitor can navigate the site using a bottom tab bar on mobile and standard header on desktop

### Email Marketing & Retention (Phase 2)

- **FR43:** System captures customer email at checkout and syncs to email marketing platform
- **FR44:** System sends automated welcome flow to new customers after first purchase
- **FR45:** System sends abandoned cart recovery emails to customers who started but didn't complete checkout
- **FR46:** System sends post-purchase follow-up emails (review request, recipe suggestions, reorder nudge)
- **FR47:** System sends subscription dunning emails when payment fails (retry notifications, payment update prompt)
- **FR48:** System sends win-back emails to customers who haven't purchased in 30+ days

### Administration & Operations

- **FR49:** Operator can manage products, pricing, and inventory via Shopify Admin
- **FR50:** Operator can view and fulfill orders via Shopify Admin with delivery day information visible
- **FR51:** Operator can view customer data and order history via Shopify Admin
- **FR52:** Operator can manage subscription caps and waitlist settings
- **FR53:** Operator can configure serviceable delivery zones

## Non-Functional Requirements

### Performance

| Requirement | Target | Measurement |
|---|---|---|
| **NFR1:** Product page load time on mobile 4G | < 2.5s LCP | Lighthouse mobile audit on Telcel 4G connection |
| **NFR2:** Checkout page load time | < 2.0s LCP | Shopify native checkout — measured via Shopify analytics |
| **NFR3:** Cart interaction response time (add/update/remove) | < 500ms perceived | Client-side optimistic UI update + background Storefront API call |
| **NFR4:** WhatsApp AI agent response time | < 5s for simple queries, < 15s for inventory lookups | OpenClaw logs — measured from message received to response sent |
| **NFR5:** Search/filter response time | < 1s | Storefront API query via Hydrogen loader |
| **NFR6:** Total page weight for initial mobile load | < 500KB (HTML + CSS + critical JS) | Lighthouse audit |
| **NFR7:** Time to Interactive (TTI) on mobile | < 3.5s on 4G | Lighthouse mobile audit |

### Security

| Requirement | Target | Measurement |
|---|---|---|
| **NFR8:** All customer data transmitted over HTTPS | 100% — no mixed content | SSL certificate via Oxygen (automatic), Content-Security-Policy headers |
| **NFR9:** Payment data handled exclusively by Shopify Payments | Zero PCI scope for MitchWeb codebase | Shopify checkout handles all card data — storefront never touches payment credentials |
| **NFR10:** API keys and secrets stored in environment variables only | No secrets in source code | Code review policy, .env files in .gitignore, Oxygen environment variables for production |
| **NFR11:** OpenClaw API access restricted to local network | Not exposed to public internet | Network configuration, VPN/Tailscale for remote access |
| **NFR12:** Customer PII access limited to Shopify Admin authorized users | Role-based access via Shopify staff accounts | Shopify Admin permission model |
| **NFR13:** WhatsApp AI agent cannot process payments or modify system configuration | Scoped permissions — read inventory, create draft orders only | OpenClaw skill permissions configuration |
| **NFR14:** Customer data handling compliant with Mexican Aviso de Privacidad requirements | Privacy notice published and consent captured at checkout | Legal review of privacy notice, consent checkbox in account creation |

### Scalability

| Requirement | Target | Measurement |
|---|---|---|
| **NFR15:** Storefront handles concurrent users during promotional traffic spikes | 500 concurrent sessions without degradation | Oxygen CDN handles this natively — Shopify infrastructure scales automatically |
| **NFR16:** OpenClaw handles concurrent WhatsApp conversations | 20 simultaneous conversations without queue delays | OpenClaw gateway configuration, Claude API rate limits |
| **NFR17:** Inventory enforcement remains accurate under concurrent orders | Zero overselling — last-unit accuracy | Shopify inventory tracking (atomic decrements at checkout) |
| **NFR18:** Email marketing platform handles subscriber growth | 10,000 contacts without tier upgrade | Klaviyo free tier supports this — monitor approaching limit |

### Reliability

| Requirement | Target | Measurement |
|---|---|---|
| **NFR19:** Storefront availability | 99.9% uptime | Shopify Oxygen SLA — monitored via Shopify status page |
| **NFR20:** Order confirmation delivery (email + WhatsApp) | 99% delivered within 60 seconds of purchase | Shopify webhooks → email + OpenClaw notification. Monitor delivery rate in logs |
| **NFR21:** Subscription billing reliability | 99% successful charge on first attempt | Shopify Payments retry logic + Klaviyo dunning flow for failures |
| **NFR22:** OpenClaw availability during business hours (8am-10pm CST) | 99% uptime | Self-hosted — requires monitoring and auto-restart (systemd/PM2) |
| **NFR23:** Graceful degradation if OpenClaw is down | Storefront remains fully functional; WhatsApp CTA shows "leave a message" fallback | Health check endpoint on OpenClaw, conditional CTA messaging |
| **NFR24:** Data backup for customer and order data | Daily automated backups | Shopify handles order/customer data. OpenClaw conversation logs backed up via cron to cloud storage |

### Integration Reliability

| Requirement | Target | Measurement |
|---|---|---|
| **NFR25:** Shopify Storefront API availability | 99.99% (Shopify's SLA) | Shopify status monitoring |
| **NFR26:** WhatsApp Business API message delivery | 95%+ delivery rate | OpenClaw delivery receipts, WhatsApp Business API dashboard |
| **NFR27:** Klaviyo webhook processing (Phase 2) | Events processed within 30 seconds of Shopify trigger | Klaviyo integration dashboard, webhook delivery logs |
| **NFR28:** Graceful handling of third-party API failures | Retry with exponential backoff, user-facing error message if persistent | Error logging, circuit breaker pattern for non-critical integrations |

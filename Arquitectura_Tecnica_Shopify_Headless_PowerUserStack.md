JOCOQUE & YOGURT MICH
Arquitectura Técnica

Shopify Headless + Storefront MCP + Power User Stack
Cómo el e-commerce, los agentes de IA y tu código custom
trabajan juntos en una sola arquitectura

Addendum al Power User Stack Document
Febrero 2026 — v1.0

# 1. Por Qué Shopify Headless y No un Sitio Desde Cero
La decisión entre construir desde cero vs usar Shopify no es sobre capacidad técnica — como live coder puedes construir ambos. Es sobre dónde invertir tu tiempo para maximizar ventas. Este análisis te muestra por qué Shopify headless es la elección estratégica superior para Mich.

Conclusión: Shopify headless te da todo el backend de comercio resuelto (pagos, inventario, envíos, fraude, fiscal, suscripciones) mientras conservas control total del frontend y la experiencia del usuario. Tu código custom va donde realmente genera ventaja competitiva: la IA, la automatización y la personalización.

# 2. Arquitectura Completa: Las 5 Capas del Sistema
La arquitectura tiene 5 capas que operan como un sistema unificado. Cada capa tiene un propósito claro y se comunica con las demás vía APIs y MCP:

CAPA 5: FRONTEND — Hydrogen/Next.js (lo que el cliente ve)
↓ Storefront API GraphQL + Storefront MCP ↓
CAPA 4: SHOPIFY BACKEND — Pagos, inventario, pedidos, suscripciones
↓ Admin API + Webhooks ↓
CAPA 3: AUTOMATIZACIÓN — Claude Code + OpenClaw + Zapier
↓ APIs + MCP Protocol ↓
CAPA 2: INTELIGENCIA — Vertex AI + Klaviyo AI
↓ BigQuery + GA4 + Shopify Data ↓
CAPA 1: DESARROLLO — Antigravity + Warp AI + Claude Code

# 3. Storefront MCP: El Game Changer
En la Winter '26 Edition (diciembre 2025), Shopify lanzó Storefront MCP: un servidor MCP que conecta cualquier agente de IA con los datos de tu tienda en tiempo real. Esto es exactamente lo que necesitas para integrar Claude y OpenClaw con tu e-commerce.

## 3.1 Qué Puede Hacer Storefront MCP

## 3.2 Dos MCP Servers de Shopify
Shopify ofrece dos servidores MCP que necesitas:

1. Storefront MCP Server (para agentes que hablan con clientes)
Conecta tu agente de ventas (OpenClaw Sales Bot) con los datos de la tienda. Cada tienda Shopify tiene su propio endpoint MCP único que expone: búsqueda de productos, operaciones de carrito, y políticas de la tienda.
# Endpoint de tu tienda:
https://tu-tienda.myshopify.com/.well-known/shopify/storefront-mcp

2. Dev MCP Server (para ti como desarrollador)
Conecta Claude Code y Antigravity con la documentación de Shopify, schemas de API, y guías de Hydrogen. Cuando estés construyendo, Claude Code puede consultar la API de Shopify directamente:
# En tu claude_desktop_config.json o .mcp.json:
{
"mcpServers": {
"shopify-dev": {
"command": "npx",
"args": ["-y", "@anthropic/shopify-dev-mcp"]
},
"shopify-storefront": {
"url": "https://tu-tienda.myshopify.com/.well-known/shopify/storefront-mcp"
}
}
}

# 4. Frontend: Hydrogen vs Next.js
Para Mich, tienes dos opciones viables de frontend headless. Ambas se conectan al backend de Shopify vía Storefront API GraphQL:

Recomendación para Mich:
Hydrogen + Oxygen. Para una marca DTC de lácteos que está lanzando, la velocidad importa más que la flexibilidad abstracta. Hydrogen te da: templates de tienda listos para personalizar, componentes de carrito y checkout pre-construidos, Storefront MCP nativo (tu agente IA en la tienda desde día 1), hosting gratuito en Oxygen con edge global, y cero costo extra de infraestructura. Puedes construir en Antigravity con agentes Gemini 3 + Claude para el frontend, y desplegar directamente a Oxygen.

Cuándo migrar a Next.js: Si en el futuro necesitas integraciones más complejas (headless CMS como Sanity, PIM, multi-idioma avanzado) o quieres desacoplarte de Shopify hosting, migrar es viable porque ambos son React. Pero para el año 1-2, Hydrogen es la elección óptima.

# 5. OpenClaw + Storefront MCP: El Agente de Ventas Definitivo
Aquí es donde todo se conecta. OpenClaw como agente en WhatsApp/Telegram + Shopify Storefront MCP = un vendedor IA que opera 24/7 con acceso real a tu tienda.

## 5.1 Arquitectura de Conexión
CLIENTE (WhatsApp)
│
↓
OPENCLAW GATEWAY (tu servidor)
│
├──→ LLM Backend (Claude Sonnet 4.5 via Anthropic API)
│
├──→ Storefront MCP Server (tu-tienda.myshopify.com)
│       ├── product_search: buscar productos
│       ├── cart_create: crear carrito
│       ├── cart_add_line: añadir productos
│       ├── get_checkout_url: link de pago
│       └── store_policies: políticas
│
├──→ Vertex AI MCP (predicciones custom)
│       ├── predict_reorder: ¿cuándo recomprará?
│       └── recommend_products: ¿qué le gustaría?
│
└──→ Notion MCP (actualizar contenido/calendario)

## 5.2 Flujo de Venta Completo por WhatsApp
Así se ve una venta real de principio a fin:

Cliente envía mensaje: "Hola, quiero pedir yogurt griego para toda la semana"
OpenClaw (con Storefront MCP) busca en el catálogo: encuentra Yogurt Griego 500g ($150) y 1kg ($290)
OpenClaw responde: "Tenemos dos opciones perfectas: el Yogurt Griego 500g a $150 y el de 1kg a $290. Para toda la semana te recomiendo el de 1kg. ¿Cuál prefieres?"
Cliente: "El de 1kg, y también quiero jocoque"
OpenClaw busca jocoque, crea carrito con ambos productos vía Storefront MCP
OpenClaw: "Listo, tu pedido: Yogurt Griego 1kg ($290) + Jocoque Seco 500g ($135) = $425. Envío gratis por ser mayor a $250. Paga aquí: [link checkout Shop Pay]"
Cliente paga con un click en Shop Pay (tarjeta guardada)
Shopify webhook notifica a OpenClaw del pago exitoso
OpenClaw confirma: "¡Pedido confirmado! Te llega mañana entre 10am-2pm. Gracias por elegir Mich."
Tú recibes en Telegram vía Mich Ops: "Nuevo pedido #1047: Ana G. - $425 - YG 1kg + JS 500g"

Tiempo total de la transacción: 2-3 minutos. Sin que tú toques nada. El cliente nunca salió de WhatsApp excepto para pagar en Shop Pay.

# 6. Agente IA en el Sitio Web (Hydrogen + Storefront MCP)
Además de WhatsApp, puedes tener un agente de IA directamente en tu sitio web headless. Shopify documentó exactamente cómo hacerlo en la Winter '26 Edition:

Cómo funciona:
Hydrogen storefront incluye un componente de chat widget
El widget se conecta a Storefront MCP como backend
El LLM (Claude vía API de Anthropic) procesa las conversaciones
El agente puede buscar productos, recomendar, llenar carrito y generar link de checkout
El cliente interactua en lenguaje natural: "Quiero algo para un desayuno keto"

Shopify provee un template/starter kit para esto. Tú lo personalizas con el Brand Voice de Mich en Antigravity y lo despliegas en Oxygen.

Ventaja competitiva:
Ninguna marca de lácteos artesanales en México tiene un agente de IA en su tienda web. Esto te posiciona como la marca más innovadora del mercado y aumenta conversión porque el cliente recibe asistencia instantánea personalizada.

# 7. Workflow de Desarrollo Actualizado
Con Shopify en el stack, el workflow de desarrollo se optimiza. Aquí está el roadmap actualizado:

## Sprint 1: Storefront + OpenClaw (Semana 1-2)

## Sprint 2: Inteligencia + Automatización (Semana 3-4)

## Sprint 3: Escalar (Semana 5-8)

# 8. Costo Total del Sistema

Comparación: Una agencia de marketing digital cobra $15,000-50,000 MXN/mes por una fracción de lo que este sistema hace automáticamente. Tu inversión de $1,400-2,400 MXN/mes te da un sistema más poderoso que el de marcas que gastan 20x más.

# 9. Resumen: El Sistema Completo Integrado

El flujo completo del dinero:

CONTENIDO (Claude Code genera) → REDES SOCIALES (Buffer publica)
↓
CLIENTE descubre la marca → ENTRA al sitio (Hydrogen/Oxygen)
↓
AGENTE IA en web (Storefront MCP + Claude) ayuda a elegir
↓
COMPRA via Shop Pay → SHOPIFY procesa pedido
↓
KLAVIYO envía post-compra + VERTEX AI registra datos
↓
14 días después: VERTEX AI predice reorden
↓
OPENCLAW envía WhatsApp: "¿Te enviamos más yogurt?"
↓
CLIENTE responde "sí" → OPENCLAW crea pedido via Storefront MCP
↓
LOOP: cada 14-21 días, el sistema vende solo

Cada capa alimenta a la siguiente. Cada venta entrena al modelo.
El sistema se vuelve más inteligente con cada cliente.

Este es el sistema que te lleva de $0 a millones en venta directa. No es un sitio web con un carrito. Es una máquina de ventas con IA integrada en cada punto de contacto, desde el primer reel de TikTok hasta el recordatorio de reorden por WhatsApp, construida con herramientas que tú controlas, por una fracción del costo de cualquier alternativa.

«No vendas productos. Construye sistemas que vendan por ti.»

# Brainstorm: Remotion as Melina's Programmatic Video Engine

**Topic:** Integrating Remotion into Melina's content automation architecture
**Date:** 2026-03-02
**Author:** Taotech
**Input Documents:**
  - product-brief-Melina-2026-02-25.md
  - brainstorm-melina-content-ai-suite.md
**Sources:**
  - https://www.remotion.dev/
  - https://www.remotion.dev/docs/the-fundamentals
  - https://www.remotion.dev/docs/lambda
  - https://www.remotion.dev/docs/compare-ssr
  - https://www.remotion.dev/docs/lambda/cost-example
  - https://dev.to/hearts_ms_dc3f0d7657c8da/automated-video-generation-with-n8n-and-remotion-server-setup-guide-3c9e
  - https://github.com/ezedinff/TikTok-Forge
  - https://gaga.art/blog/remotion-skills/

---

## What Remotion Is

Remotion is an open-source, React-based framework for creating real MP4/WebM videos programmatically. Instead of editing video in a timeline tool, you write React components parametrized with props (text, colors, images, video clips, data) and Remotion renders them frame-by-frame into finished video files.

**Key characteristics:**
- **React-native:** Videos are React components. Any web technology (CSS, SVG, Canvas, WebGL) works inside them
- **Parametric:** Templates accept props — swap the text, image, brand colors and you get a different video from the same template
- **Self-hostable:** Runs as an Express API server on a VPS, or serverless via AWS Lambda / Google Cloud Run
- **Free for individuals/small teams:** No license cost for teams of 3 or fewer. Company license starts at $75/3 seats
- **Proven n8n integration:** Documented pattern using Express API + n8n HTTP Request node
- **38k GitHub stars**, 700 pages of docs, active community

**How rendering works:**
1. React templates are bundled once at server startup (cached)
2. An Express API exposes a `/render` endpoint accepting JSON parameters
3. Remotion renders using headless Chromium, outputs MP4/WebM
4. The file is returned or uploaded to storage

---

## Strategic Fit: The Gap Remotion Fills

The Melina product brief identifies content types that currently lack a branded, automated video solution:

| Melina Content Type | Current Solution in Brief | Gap |
|---|---|---|
| Reels / short-form video | Minimax for AI video gen | No branded template system, no text overlays, no caption sync |
| Carousels ("5 formas de comer labneh") | Bannerbear/Predis.ai static images | No animated carousels, limited template control |
| Educational autopilot posts | AI-generated static images | Static only — video performs 2-5x better on IG/TikTok |
| Weekly performance reports | Text summary in Telegram | No visual report generation |
| Macro/nutrition breakdowns | Static image generation | Could be animated data visualizations |
| Caption burn-in on raw video | Not addressed | Manual subtitle work currently |

Remotion fills every gap with a single, self-hosted, brand-controlled tool.

---

## Architecture Integration

Remotion slots into Melina's existing architecture as a rendering engine alongside the LLM providers:

```
Taotech (Telegram) --> Melina (OpenClaw) --> n8n workflow
                                                |
                                   +------------+------------+
                                   |            |            |
                              Multi-LLM    Remotion API   ContentStudio
                              (text gen)   (video render)  (publish)
                                   |            |
                                   +-----+------+
                                         |
                                   Rendered MP4 on VPS
                                         |
                                   ContentStudio --> IG / TikTok / FB
```

### The n8n + Remotion Integration Pattern

Based on the proven architecture documented at dev.to:

1. **Express API server** runs on the same VPS as OpenClaw and n8n
2. **Templates are bundled once** at server startup and cached (avoids 5+ minute Webpack rebuilds per request)
3. **n8n sends HTTP POST** to `/render` with JSON payload:
   ```json
   {
     "template": "reel-keto-macros",
     "text": "Labneh: 8g proteina, 0 azucar",
     "brandBible": "mich",
     "image": "/uploads/labneh-photo.jpg",
     "language": "es",
     "duration": 15
   }
   ```
4. **Remotion renders** and returns the file path
5. **n8n picks up** the MP4, routes to ContentStudio for scheduling

### Decision Flow: When to Use What

```
Content item needs visual?
  |
  +-- Needs AI-generated novel video (no template) --> Minimax
  |
  +-- Needs branded templated video --> Remotion
  |     |
  |     +-- Reel with text overlays --> reel-* template
  |     +-- Animated carousel --> carousel-* template
  |     +-- Educational explainer --> educational-* template
  |     +-- Performance report --> report-* template
  |     +-- Caption burn-in on raw video --> caption-overlay template
  |
  +-- Needs static branded image --> Remotion (render frame 0) or Bannerbear
  |
  +-- Needs AI-generated image --> DALL-E / Gemini
```

---

## Concrete Use Cases for Mich

### 1. Branded Reels Templates

React component templates for short-form video:

- **"Macro comparison"** — Split screen: labneh macros vs. commercial yogurt, animated counters ticking up, brand colors, logo watermark. Props: `{ product, macros, comparison, language }`
- **"Heritage story"** — Ken Burns pan/zoom on Michel's photos, Arabic calligraphy text overlays, warm color grading. Props: `{ images[], storyText, music }`
- **"Process shot"** — Michel's raw video as background with auto-generated caption text burned in, brand-consistent typography. Props: `{ videoSrc, captions[], brandVoice }`
- **"Listicle Reel"** — "5 formas de comer labneh" with swipe transitions between items, each with photo + text. Props: `{ items[{ title, image, description }], theme }`

### 2. Autopilot Educational Videos (Killer Feature)

This directly upgrades Melina's two-tier autonomy model. Currently, autopilot content is limited to static images. With Remotion:

- "Que son los probioticos?" becomes a **15-second animated explainer** with branded graphics, icon animations, and text reveals
- "Macros del kefir" becomes an **animated bar chart** with the Mich color palette
- These are **fully automated** — Melina generates text via OpenAI, picks the template, sends params to Remotion via n8n, ContentStudio publishes. Zero human involvement

This means Melina's autopilot mode produces **video content** at the same quality tier as manual content — a differentiator no competing tool offers.

### 3. Animated Carousel Posts

Instagram supports video carousels natively. Instead of 5 static Bannerbear images for "5 formas de comer labneh," Remotion generates a single video with swipe-style transitions — higher engagement, same content, one render call.

### 4. Caption Burn-In for Michel's Raw Videos

Michel sends a raw kitchen video via Telegram. Pipeline:
1. Melina transcribes audio via Gemini (multimodal)
2. OpenAI polishes/translates the caption text
3. Remotion burns captions into the video with brand-consistent typography and positioning
4. Draft goes to Taotech for approval

No manual subtitle editing. No CapCut. The entire pipeline is automated through n8n.

### 5. Weekly Performance Reports as Visual Stories

Melina's Friday report becomes a 30-second Instagram Story:
- Animated charts showing the week's metrics (impressions, engagement, follower growth)
- Thumbnail of the top-performing post
- Suggested next week's theme as a text card
- All rendered automatically from analytics data piped through n8n

---

## Impact on Product Brief Sections

### Multi-LLM Task Routing (Section Update)

Add Remotion as a rendering engine in the task routing table:

| Task | Routed To | Why |
|---|---|---|
| Long-form copy, ad scripts | OpenAI | Best at creative writing |
| Image-to-caption, video analysis | Gemini | Best multimodal |
| AI video generation, voice synthesis | Minimax | Best generative video |
| **Branded templated video** | **Remotion** | **Parametric, brand-controlled, self-hosted** |
| **Caption burn-in on raw video** | **Remotion** | **Chromium-based rendering, typography control** |
| **Static branded graphics** | **Remotion (frame 0) or Bannerbear** | **Same template system, image output** |

### Two-Tier Autonomy (Section Upgrade)

**Before Remotion:** Autopilot content = AI-generated static images + text captions
**After Remotion:** Autopilot content = animated educational videos, branded explainers, data visualizations — all published without human intervention

This is a major differentiator upgrade. The two-tier model goes from "static autopilot vs. human-approved originals" to "video autopilot vs. human-approved originals."

### Tool Stack (Section Update)

| Component | Before | After Remotion |
|---|---|---|
| Video creation | Minimax (AI gen) + CapCut (manual) | Minimax (AI gen) + **Remotion (templated)** |
| Image generation | Bannerbear + Predis.ai | **Remotion static frames** + Bannerbear as fallback |
| Caption/subtitle | Manual or external tool | **Remotion caption burn-in** |
| Report visuals | None (text only) | **Remotion animated reports** |

**Potential tool eliminations/reductions:**
- CapCut — replaced by Remotion for templated edits (CapCut stays only for complex manual edits if needed)
- Predis.ai — replaced by Remotion static frame renders
- Bannerbear — reduced role, Remotion handles most programmatic image needs

### Cost Impact

| Item | Cost |
|---|---|
| Remotion license | $0 (free for individuals/small teams) |
| VPS compute | $0 incremental (runs on existing VPS) |
| RAM upgrade (if needed) | ~$5-10/mo for VPS tier bump |
| **Savings: Bannerbear** | -$49/mo |
| **Savings: Predis.ai** | -$19-40/mo |
| **Net impact** | **Saves $50-80/mo while adding video capability** |

### New n8n Workflow Templates Needed

| Workflow | Trigger | Output |
|---|---|---|
| `render-reel` | Melina content plan includes a Reel | MP4 via Remotion → ContentStudio |
| `render-educational-video` | Autopilot scheduler fires | MP4 → ContentStudio (no approval) |
| `burn-captions` | Raw video received from Michel | Captioned MP4 → draft for approval |
| `render-carousel-video` | Content plan includes carousel | MP4 carousel → ContentStudio |
| `render-weekly-report` | Friday cron | Story MP4 → ContentStudio |
| `render-static-image` | Content needs branded graphic | PNG (frame 0) → ContentStudio |

---

## Technical Requirements

### VPS Resources

- **RAM:** 4GB minimum for Remotion rendering (headless Chromium). Current VPS runs OpenClaw + n8n — may need upgrade to 8GB to handle concurrent rendering
- **Node.js:** v20+ required
- **Start command:** `node --max-old-space-size=3072 server.js` to prevent Chromium OOM
- **Disk:** Rendered videos are temporary — clean up after upload to ContentStudio. ~500MB buffer for render workspace

### Rendering Performance

- 15-second video: ~15-30 seconds render time on a 4-core VPS
- 30-second video: ~30-60 seconds
- Acceptable for scheduled content (generated hours/days before posting)
- Queue-based rendering recommended to avoid concurrent Chromium instances competing for RAM

### Template Development

- Each template is a React component — one-time development investment per template
- Estimated 6-8 core templates cover all Mich use cases
- Templates are brand-agnostic (load brand bible as props) — reusable across future Melina clients
- Remotion Skills (AI-assisted template generation) can accelerate development

---

## Relationship to Minimax

Remotion and Minimax are **complementary, not competing:**

| Dimension | Remotion | Minimax |
|---|---|---|
| **What it does** | Renders parametric video from React templates | Generates novel video from text/image prompts |
| **Best for** | Branded, consistent, repeatable content | Creative, unique, one-off content |
| **Brand control** | Total (template-defined) | Limited (prompt-guided) |
| **Cost per render** | ~$0 (VPS compute only) | Per-API-call pricing |
| **Output consistency** | Identical template, different data = consistent brand | Each generation varies |
| **Example** | Weekly macro comparison Reel with same layout | "Generate a video of labneh being made in a Lebanese kitchen" |

**Decision rule:** If the content follows a repeatable format with brand templates → Remotion. If the content needs AI-generated novel imagery/video → Minimax.

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| RAM contention on VPS | Rendering crashes or slows down OpenClaw/n8n | Queue-based rendering (max 1 concurrent), VPS upgrade to 8GB, or offload to Lambda for burst |
| Template development effort | Delays before video content is available | Start with 2-3 core templates (educational explainer, macro reel, caption overlay), expand iteratively |
| Render time for long videos | Delays in content pipeline | Keep videos short (15-30 sec), render during off-peak, queue-based scheduling |
| Chromium dependency | Security surface, memory leaks | Pin Chromium version, restart Remotion server on schedule, monitor memory |

---

## Recommended Phasing

### Phase 1 — Foundation (alongside Melina MVP)
- Set up Remotion Express API on VPS
- Build 2 core templates: `educational-explainer` and `caption-overlay`
- n8n workflow: `render-educational-video` (autopilot pipeline)
- Validate: autopilot educational posts are now animated video instead of static images

### Phase 2 — Branded Reels (Month 2)
- Build 3 Reel templates: `macro-comparison`, `heritage-story`, `listicle-reel`
- n8n workflow: `render-reel`
- Validate: Taotech's Monday planning session generates video Reels, not just text scripts

### Phase 3 — Full Pipeline (Month 3)
- Build remaining templates: `animated-carousel`, `weekly-report`
- n8n workflows: `render-carousel-video`, `render-weekly-report`, `render-static-image`
- Retire Bannerbear/Predis.ai dependencies
- Validate: entire content calendar (video + image + text) flows through Remotion + ContentStudio

---

## Summary

Remotion is a high-fit, low-cost addition to Melina's architecture that solves the gap between "Melina generates text and schedules static images" and "Melina produces professional branded video content autonomously." It integrates via n8n on existing infrastructure, costs $0 in licensing, potentially saves $50-80/mo by replacing image generation SaaS tools, and directly upgrades Melina's most compelling differentiator — the two-tier autopilot model — from static images to animated video.

The brand-agnostic template architecture aligns perfectly with Melina's brand-agnostic agent design: same templates, different brand bible props, different client.

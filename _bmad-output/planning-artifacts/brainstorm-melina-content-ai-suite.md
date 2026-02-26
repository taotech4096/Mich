# 🎉 Party Mode Brainstorm: Melina — The Content & Marketing Agent

**Topic:** Architecture for MitchWeb's Content AI Suite
**Date:** 2026-02-25
**Participants:** 🧙 BMad Master (facilitator), 📋 John (PM), 💻 Amelia (Dev), 🎨 Sally (UX), 📊 Mary (Analyst), 🔧 Winston (Architect)

---

## The Brief

Taotech wants a **marketing and social networking agent called Melina** that lives alongside Ibrahim (the existing accounting/knowledge-base agent on OpenClaw + Notion + Telegram). Melina should handle content generation, scheduling, asset management, and social media publishing. Taotech envisions himself creating visual assets (photos, AI-generated images, videos) and then prompting Melina to assemble, schedule, and publish.

---

## 🧙 BMad Master — Framing the Problem

The Master sees **three layers** to solve:

| Layer | What It Does | Example |
|---|---|---|
| **Creation** | Generate text, assemble video, edit images | "Generate 4 Reel scripts about keto labneh" |
| **Management** | Store, organize, approve, calendar | "Show me next week's content calendar" |
| **Distribution** | Schedule, publish, cross-post | "Post this carousel to IG and the Reel to TikTok at 10am" |

Most tools do 1-2 of these. The question is: **build vs. buy vs. orchestrate**.

---

## 📋 John (PM) — What Does Taotech Actually Need?

John identifies the **user stories** for Melina:

1. "As Taotech, I want to prompt Melina to generate Reel scripts for the week so I spend 30 mins reviewing instead of 3 hrs writing"
2. "As Taotech, I want to drop photos/videos into a folder and tell Melina to create posts from them"
3. "As Taotech, I want Melina to schedule approved content to Instagram, TikTok, and Facebook"
4. "As Taotech, I want to see a content calendar in Notion showing what's scheduled"
5. "As Taotech, I want Melina to maintain the dual brand voice (heritage + nutrition) automatically"
6. "As Taotech, I want to message Melina on Telegram and get a content status update"

**John's verdict:** Melina is an **orchestrator**, not a single tool. She sits on top of specialized services.

---

## 🔧 Winston (Architect) — Three Architecture Options

### Option A: Melina as an OpenClaw Agent (Recommended)

```
Taotech ←→ Telegram ←→ OpenClaw (Melina Agent)
                              ↓
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
         n8n (self-hosted)  Notion API    Buffer/Later API
              ↓
    ┌─────────┼─────────┐
    ↓         ↓         ↓
Multi-LLM  CapCut    Predis.ai
(OpenAI,   (video)   (carousels)
 Gemini,
 Minimax)
```

**Why:** You already run OpenClaw on your VPS for Ibrahim. Melina becomes a **second agent** on the same OpenClaw instance with different skills. Same infrastructure, same Telegram interface, zero new platforms to learn.

**n8n** (self-hosted, free Community Edition) acts as the **automation backbone** — it connects Melina's instructions to the actual APIs (Buffer, Notion, Meta, etc.) via visual workflows. n8n runs on the same VPS.

### Option B: Melina as a Claude Code Extension

```
Taotech ←→ Warp Terminal ←→ Claude Code
                                ↓
                    /melina-post, /melina-calendar
                                ↓
                         n8n webhooks → APIs
```

**Why:** If you prefer the terminal workflow over Telegram, Melina lives as slash commands. Less "agent" feel, more "power tool."

### Option C: All-in-One SaaS (ContentStudio or Predis.ai)

Replace the custom agent with a single platform that does generation + scheduling + analytics.

**Why not:** Lock-in, monthly cost ($40-80/mo), loses the AI-native flexibility, can't enforce brand voice as deeply, and you already have OpenClaw infrastructure.

**Winston's verdict:** Option A. Leverage what you have. OpenClaw + n8n + specialized tools = maximum power, minimum cost, no vendor lock-in.

---

## 💻 Amelia (Dev) — The Tool Stack

Based on deep research, here's the **best-in-class tool for each job:**

### Text Content Generation
| Tool | Use Case | Cost | Integration |
|---|---|---|---|
| **Multi-LLM via OpenClaw** | Reel scripts, captions, email copy, ad copy | Per-token across providers | Native in OpenClaw |
| **OpenAI (GPT-4o/4.1)** | Long-form content, ad copy, creative writing | ~$2.50/$10 per 1M tokens (in/out) | OpenClaw native |
| **Google Gemini** | Multimodal tasks (image→caption, video analysis) | Free tier + pay-per-use | OpenClaw native |
| **Minimax** | Video generation, voice synthesis, multilingual content | Pay-per-use | OpenClaw native |
| **Brand Bible prompt** | Enforces dual-voice (heritage/nutrition) | Free (prompt engineering) | Stored in Notion, loaded by Melina |

### Visual Content
| Tool | Use Case | Cost | Integration |
|---|---|---|---|
| **Canva** | Carousel design, story templates, social graphics | Free tier / $13/mo Pro | Has API, or manual with templates |
| **Predis.ai** | Auto-generate carousels from text prompts | $19-40/mo | API available on higher tiers |
| **Bannerbear** | Programmatic image generation (auto-branded posts) | $49/mo | REST API — perfect for n8n |

### Video Content
| Tool | Use Case | Cost | Integration |
|---|---|---|---|
| **CapCut** | Edit Reels/TikToks, add captions, effects | Free / Pro $10/mo | Manual + export |
| **InVideo AI** | Generate videos from text prompts | $25/mo | Web-based, limited API |
| **Pippit AI** | Product-link-to-video, AI avatars | $15-30/mo | Web-based, export to schedule |

### Scheduling & Distribution
| Tool | Use Case | Cost | Integration |
|---|---|---|---|
| **Buffer** | Schedule posts to IG, TikTok, FB, LinkedIn | Free (3 channels) / $6/ch/mo | API (new version coming) |
| **Later** | Visual calendar, IG-first scheduling | $25/mo | API available |
| **ContentStudio** | All-in-one scheduling + AI generation | $25/mo | Strong API |

### Automation Orchestration
| Tool | Use Case | Cost | Integration |
|---|---|---|---|
| **n8n (self-hosted)** ⭐ | Connect everything, run workflows | **Free** (Community Edition) | 400+ integrations, runs on your VPS |
| **Make.com** | Visual automation (cloud) | $9/mo+ | 2000+ integrations, no self-host |
| **Zapier** | Simple automations | $20/mo+ | Widely supported but expensive at scale |

### Content Management
| Tool | Use Case | Cost | Integration |
|---|---|---|---|
| **Notion** | Content calendar, asset library, brand bible | Free / $10/mo | API + OpenClaw native integration |

---

## 🎨 Sally (UX) — Taotech's Workflow

Sally maps the **daily workflow** for using Melina:

### Weekly Content Cycle

```
Monday AM:
  Taotech → Telegram: "@melina plan this week, theme: proteina para familias"
  Melina → generates 4 Reel scripts, 2 carousel concepts, 7 captions
  Melina → saves drafts to Notion content calendar
  Melina → sends summary to Telegram for review

Monday PM:
  Taotech reviews in Notion, edits/approves
  Taotech → Telegram: "@melina schedule approved content"
  Melina → pushes to Buffer/Later with optimal posting times
  Melina → confirms schedule in Telegram

Throughout the week:
  Taotech takes photos/videos → drops into Notion or shared folder
  Taotech → Telegram: "@melina create a Reel from the video in /new-content/labneh-closeup.mp4"
  Melina → generates caption, selects music suggestion, creates draft in Notion
  Taotech reviews → approves → Melina schedules

Friday:
  Taotech → Telegram: "@melina weekly content report"
  Melina → pulls analytics from Buffer/Meta → summarizes performance
  Melina → suggests next week's theme based on engagement data
```

**Sally's key insight:** The UX is Telegram. No new apps, no dashboards. Taotech lives in the terminal and Telegram — Melina should too.

---

## 📊 Mary (Analyst) — Recommended Stack

After analyzing cost, complexity, and fit:

### The Melina Stack (Recommended)

| Component | Tool | Monthly Cost |
|---|---|---|
| **Agent Brain** | OpenClaw (Melina agent) + Multi-LLM | ~$20-30 API costs |
| **LLM Providers** | OpenAI + Gemini + Minimax (task-routed) | Included above |
| **Orchestration** | n8n self-hosted on VPS | $0 |
| **Visual Generation** | Canva Pro + Bannerbear (Phase 2) | $13 + $0 initially |
| **Video Editing** | CapCut free + Pippit AI (Phase 2) | $0-15 |
| **Scheduling** | Buffer free tier → ContentStudio | $0 → $25 |
| **Content Calendar** | Notion | $0 (free team) |
| **Communication** | Telegram Bot API | $0 |
| **Total Phase 1** | | **~$43/mo** |
| **Total Phase 2** | | **~$83/mo** |

### Phase 1 (MVP — Month 2-3)
- Melina as OpenClaw agent on existing VPS
- Multi-LLM text generation (OpenAI for copy, Gemini for multimodal, Minimax for video/voice)
- Content calendar in Notion
- Buffer free tier for scheduling (3 channels)
- Manual photo/video creation by Taotech, Melina handles captions + scheduling

### Phase 2 (Growth — Month 4-6)
- n8n workflows for automated content pipelines
- Bannerbear API for programmatic image generation
- Pippit AI or CapCut for video enhancement
- ContentStudio replaces Buffer for deeper analytics
- Commerce-to-content feedback loop (Shopify → n8n → Melina theme suggestions)

---

## 🧙 BMad Master — Summary & Decision Points

### Consensus Recommendations
1. **Melina = OpenClaw agent** on existing VPS infrastructure ✅
2. **n8n self-hosted** as the automation backbone ✅  
3. **Notion** as the content management hub ✅
4. **Telegram** as the primary UX ✅
5. **Multi-LLM strategy** (OpenAI + Gemini + Minimax) for task-routed generation ✅
6. **Buffer → ContentStudio** for scheduling (start free, upgrade later) ✅

### Open Decisions for Taotech

1. **Video tools:** CapCut (free, manual editing) vs Pippit AI ($15/mo, more automated) vs InVideo AI ($25/mo, text-to-video). Which fits your workflow best?

2. **Image generation:** Do you want Melina to auto-generate carousel graphics (→ Bannerbear/Predis.ai) or do you prefer to create visuals yourself and have Melina just handle text + scheduling?

3. **Scope for PRD:** Should Melina's requirements go into the MitchWeb PRD as a new section, or should she get her own separate product brief since she's a distinct software component?

4. **Priority:** Is Melina a Phase 2 deliverable (Month 2-3) or should some basic capabilities be in MVP (e.g., just text generation + Notion calendar)?

---
stepsCompleted: [1, 2]
inputDocuments:
  - "brainstorm-melina-content-ai-suite.md"
  - "product-brief-MitchWeb-2026-02-20.md"
  - "prd.md"
  - "explanation-headless-ecommerce.md"
date: 2026-02-25
author: Taotech
---

# Product Brief: Melina

## Executive Summary

Melina is an AI-powered marketing and content automation agent built on OpenClaw, designed to give solo founders and small brand operators a fully automated marketing team member they interact with through Telegram — not another dashboard, not another tool to learn, not an agency to manage.

The core insight: founders who build great products often hate marketing. They're forced to choose between fragmented SaaS tools that still require hours of daily manual work, agencies that cost $2,000+/month and need constant direction, or the overhyped "AI marketing automation" sold by influencers that turns out to be templates with AI sprinkles. Melina replaces all three with a single conversational agent that handles the full content lifecycle — ideation, creation, scheduling, publishing, and performance tracking — with the founder's only job being occasional content capture and a quick approval pass.

Melina is architecturally brand-agnostic. She loads a brand bible per project and operates the same way across any brand or product. Her first client is Jocoque & Yogurt Mich, an artisanal Lebanese-heritage dairy brand in Mexico with proven product-market fit (demand 3x exceeds production), an incredible untold heritage story, and zero social media presence. Melina will build and run Mich's entire content engine.

The system runs on existing infrastructure — OpenClaw on a self-hosted VPS alongside Ibrahim (accounting/knowledge agent), n8n for automation orchestration, multi-LLM task routing (OpenAI, Gemini, Minimax), Notion for content calendar and brand bible, and ContentStudio for scheduling and cross-platform publishing. Total cost: ~$68-108/month versus $500-1,500 for a social media hire or $2,000+ for an agency.

---

## Core Vision

### Problem Statement

Technical founders and small brand operators who build exceptional products face a painful gap: their products sell through word-of-mouth and organic demand, but scaling requires consistent content marketing and social media presence — work they actively dislike, don't have experience in, and can't afford to delegate at their current stage.

The founder of Jocoque & Yogurt Mich is the archetype: a technical power user running AI-native business infrastructure, with a product generating 3x more demand than production capacity, an authentic Lebanese heritage story waiting to be told, and dual-audience positioning (heritage foodies + keto/fitness consumers) that could dominate premium social media. But no content exists. No social media presence exists. The founder has never managed content or social networks, doesn't enjoy sales or marketing, and wants to spend zero hours per week "attending" social media.

### Problem Impact

- **For the founder:** The brand's most powerful growth levers — heritage storytelling, keto/fitness community seeding, tastemaker engagement, D2C conversion through social proof — remain completely unactivated. Revenue stays locked in low-margin intermediary channels because the premium D2C brand has no voice.
- **For the brand:** A brand story that food writers and cultural storytellers would amplify for free goes untold. Competitors with inferior products but active social media capture the audience that should be Mich's.
- **For the market (broader):** Thousands of small brands with exceptional products and zero marketing capability lose to mediocre products with better distribution. The tools exist to automate this, but nobody has assembled them into a coherent agent that a non-marketer can actually use.

### Why Existing Solutions Fall Short

- **Fragmented SaaS tools (Buffer, Hootsuite, ContentStudio, Predis.ai):** Each handles one piece — scheduling, or image generation, or analytics. The founder still has to be the strategist, the copywriter, the creative director, and the daily operator gluing everything together. For someone who hates marketing, more tools means more marketing work, not less.
- **Agencies ($2,000-5,000+/month):** Effective but prohibitively expensive for a pre-scale artisanal brand. They also require constant briefing and direction — the founder still has to think about marketing, just through an intermediary. And agency content often lacks the authentic voice that makes artisanal brands resonate.
- **OpenClaw influencer "automation" claims:** The AI marketing automation space is flooded with influencers demonstrating impressive-looking setups that, in practice, amount to prompt templates and manual workflows with AI-generated copy pasted into a scheduler. No real orchestration, no brand consistency enforcement, no two-tier autonomy, no multi-LLM routing for task optimization. The gap between the demo and the reality is enormous.
- **Hiring a social media manager ($500-1,500/month):** More affordable than an agency but still a significant cost for a pre-scale brand. Requires onboarding, management, quality oversight, and availability that a solo founder can't easily provide. And a single hire can't match the throughput of an AI agent running multiple content pipelines simultaneously.

### Proposed Solution

**Melina** is an AI marketing agent that lives on Telegram and manages the full content lifecycle for any brand loaded into her system. She is not a tool — she is a team member.

**How it works:**

1. **Conversational UX on Telegram:** Taotech messages Melina like he'd message a marketing manager. "Plan this week, theme: proteina para familias." "Create a Reel from this video." "Show me the content calendar." "Weekly report." No dashboards, no app switching.

2. **Two-tier content model:**
   - **Original content (approval required):** Taotech captures photos/videos of Michel, the products, the kitchen. Melina generates captions, scripts, carousel layouts, and schedules them as drafts. Taotech reviews and approves in a quick pass.
   - **Automated content (autopilot):** Educational and informational posts — probiotics health benefits, keto tips, Mediterranean diet facts — with AI-generated images. Melina creates, schedules, and publishes these without human intervention, following the brand bible.

3. **Multi-LLM task routing:** OpenAI for long-form copy and ad scripts. Gemini for multimodal tasks (image-to-caption, video analysis). Minimax for video generation and voice synthesis. Each task goes to the best model for the job, optimizing quality and cost.

4. **Brand bible enforcement:** Notion stores the brand bible — voice, tone, dual messaging framework (heritage + functional nutrition), visual guidelines, hashtag strategy, audience personas. Melina loads this context for every piece of content, ensuring consistency without the founder having to think about brand voice.

5. **Orchestration via n8n:** Self-hosted n8n workflows connect Melina's decisions to actual APIs — ContentStudio for scheduling and cross-platform publishing, Notion for calendar management, Bannerbear/Predis.ai for image generation, Meta/TikTok for analytics. Visual workflows that can be extended without code changes.

6. **Brand-agnostic architecture:** Melina doesn't know she's working for Mich. She loads a brand bible, a content strategy, and a set of connected channels. Swap the brand bible for a different project, connect different channels, and she runs the same way. One agent, many brands.

### Key Differentiators

1. **Agent, not tool.** Melina is a conversational AI team member on Telegram — not another SaaS dashboard. For founders who hate marketing, the UX difference between "open an app and figure out what to post" and "message Melina and approve what she suggests" is the difference between doing marketing and not doing marketing.

2. **Two-tier autonomy.** No existing tool offers genuine autopilot for safe content (educational, informational) while requiring approval only for brand-sensitive content. This means Melina can maintain a consistent posting cadence even when the founder is busy for days — the brand never goes silent.

3. **Multi-LLM task routing.** Instead of being locked to one AI provider's strengths and weaknesses, Melina routes each task to the optimal model. This produces better content at lower cost and avoids single-provider dependency.

4. **Brand-agnostic by design.** The brand bible architecture means Melina scales to multiple brands without infrastructure changes. This is not a "Mich marketing bot" — it's a reusable marketing agent that Mich happens to be the first client of.

5. **Self-hosted, composable, and affordable.** OpenClaw + n8n + specialized tools on an existing VPS. ~$68-108/month total versus $500-2,000+ for the human alternatives. No vendor lock-in — every component is replaceable. The founder owns the infrastructure, the workflows, and the data.

6. **Built on real infrastructure, not influencer demos.** Melina runs on the same OpenClaw instance as Ibrahim (already production-proven), uses n8n (400+ integrations, self-hosted, free), and connects to real APIs. This isn't a prompt template — it's an orchestrated system with actual automation pipelines.

### Platform Potential

While the immediate scope is Melina-for-Mich, the economics of the Melina framework are fundamentally superior to any physical product business:

| Factor | Physical Product (Mich) | Melina Platform |
|---|---|---|
| **Marginal cost per client** | Milk, glass, labor, cold chain | ~$0 (same infrastructure) |
| **Gross margin** | 55-65% | 85-95% |
| **Scaling constraint** | Kitchen capacity, staff, geography | Configuration files |
| **Regulatory burden** | COFEPRIS, NOM, GS1, cold chain | Essentially zero |
| **Operational complexity** | Perishable inventory, delivery logistics, supplier management | Server uptime |

The strategic play: Mich's success becomes Melina's case study. A thriving artisanal brand social media presence built in 30 minutes/week at $68/month — that result IS the sales pitch to every small brand owner who hates marketing. Mich is the cash cow that funds operations; Melina is the scalable asset that compounds. They feed each other.

This platform potential is not a Phase 1 deliverable, but it shapes architectural decisions today — brand-agnostic design, configurable agent naming, repeatable brand onboarding, and clean separation between the Melina framework and any specific brand's configuration.

---

## Target Users

### Primary Users

**1. The Brand Owner Who Hates Marketing**
*Archetype: Taotech*
- **Profile:** A brand owner — could be a technical founder, a Shopify store operator, a restaurant owner, a coach selling courses — who builds great products or services but has no content marketing experience, actively dislikes sales and marketing work, and has zero interest in "attending" social media. They're capable of capturing raw assets (photos, videos) and reviewing AI-generated content, but anything beyond that feels like a tax on their real work. They may or may not be technical; what defines them is that they'd rather do anything than open Instagram's business dashboard.
- **Current pain:** They know their product needs social media presence to grow beyond word-of-mouth, but every solution they've tried requires them to become a marketer. They don't want to become a marketer. They want a marketing team member they can talk to on Telegram.
- **How they use Melina:** Message the agent on Telegram with high-level direction ("plan this week, theme: keto benefits"). Drop raw photos/videos into a shared folder. Review drafts in Notion or Telegram. Approve with a tap. Check weekly performance reports. Total time: 30-60 minutes/week.
- **Success moment:** Realizing they haven't thought about social media in a week and the brand's accounts have been consistently active with on-brand content.

**2. The Hired Content Assistant**
*Archetype: A future Mich team member*
- **Profile:** Someone hired to handle content and social media for the brand — not necessarily technical, but capable. They may or may not have marketing experience. They're brought on because the business is growing and the founder needs to delegate even the review/approval work.
- **Current pain:** Without Melina, they'd be starting from scratch — learning the brand voice, figuring out what to post, manually creating content, managing multiple platforms. With Melina, they have an AI partner that already knows the brand and does the heavy lifting.
- **How they use Melina:** Two interaction modes. (1) Telegram-first: same conversational UX as the founder — ask Melina to generate content, review, approve. (2) Tool-direct: work in Notion for content calendar management and ContentStudio for scheduling refinements, while Melina handles AI generation and automation in the background.
- **Success moment:** Producing a week's worth of content in 2 hours that would have taken 15+ hours manually, with brand voice consistency they couldn't have achieved alone on day one.

### Secondary Users

**3. The Brand Onboarder**
- **Profile:** The person (often the founder themselves, or a technical partner) who configures a new Melina agent instance for a brand. This is a distinct role from the daily operator — it's the setup and configuration work that happens once per brand, then rarely again.
- **Needs:** A clear, repeatable onboarding process: create brand bible in Notion (voice, tone, visual guidelines, audience personas, content pillars), connect social media channels, configure ContentStudio, set autopilot rules, name the agent, and test the first content generation cycle.
- **Success moment:** Sending the first message to a newly configured agent ("plan this week") and getting back on-brand content that sounds like the brand, not like a generic AI.

**4. The Content Source (Non-Operator)**
*Archetype: Michel*
- **Profile:** The person closest to the product — the artisan, the chef, the maker — who creates the most authentic raw content but doesn't operate Melina and may not be technical at all. They send photos and videos from their daily work directly to the agent (via Telegram or a shared folder), and Melina transforms these into branded posts.
- **How they interact:** WhatsApp or Telegram a photo to Melina: "Mira lo que acabo de hacer." Melina receives the raw asset, generates a caption following the brand bible, creates a draft, and routes it for approval. The content source never sees the content calendar, never approves posts, never thinks about scheduling.
- **Why this matters:** The most authentic content for an artisanal brand comes from the artisan, not the founder's phone. Enabling Michel to feed raw material directly to Melina — without any operational overhead — produces content that no agency could replicate.

**5. The Freelance Social Media Manager**
- **Profile:** A freelancer managing social media for multiple small brands. They deploy the Melina framework for each client — each with its own agent name, brand bible, and channel configuration. They interact with multiple agent instances across Telegram.
- **Needs:** Fast brand onboarding, per-brand performance reporting, clear separation between brand instances, the ability to manage 3-5 brands through a single infrastructure.
- **Value proposition:** Melina turns a solo freelancer into a small agency. Instead of manually creating content for each client, they focus on strategy and client relationships while Melina handles execution.

**6. The Small Marketing Team**
- **Profile:** A 2-3 person team at a small brand that needs to scale their content output beyond what they can produce manually. They use Melina as a force multiplier — the team handles strategy, creative direction, and community interaction, while Melina handles content generation, scheduling, and the autopilot educational pipeline.
- **Needs:** Collaborative approval workflows, content calendar visibility in Notion, the ability for multiple team members to interact with the same agent instance.

### User Journeys

**Journey 1: Day Zero — Brand Onboarding (Brand Onboarder, Setup Path)**

**Who:** Taotech, configuring Melina for Mich for the first time.

**Hour 1 — Brand Bible Setup:**
Taotech opens the Notion brand bible template. Fills in: brand name (Jocoque & Yogurt Mich), agent name (Melina), voice description ("warm, authentic, bilingual Spanish — switches between heritage storytelling and functional nutrition language"), content pillars (Lebanese heritage, keto/fitness macros, clean label transparency, Michel's story), target audiences (heritage foodies, keto/fitness consumers, wellness parents), hashtag strategy, visual guidelines (warm tones, glass jars, Michel's hands, kitchen process shots).

**Hour 2 — Channel & Tool Connection:**
Connects Instagram Business, TikTok, and Facebook Page to ContentStudio. Links ContentStudio API to n8n. Configures Melina agent in OpenClaw with the Mich brand bible Notion page as context. Sets autopilot rules: educational health/nutrition posts can publish without approval; anything using brand photos or product shots requires approval.

**Hour 3 — First Test:**
Messages Melina on Telegram: "Generate 3 post ideas for this week, theme: introducing the brand." Melina responds with 3 drafts — captions, hashtags, suggested image types — all in the Mich voice. Taotech reviews. Two are great, one needs a tweak. He edits in Notion, approves. Messages Melina: "Schedule these." Melina pushes to ContentStudio.

**Resolution:** Mich's social media accounts go from zero to three scheduled posts in 3 hours. The brand bible is set. Melina knows who Mich is. From tomorrow, Taotech switches to the 30-minute Monday routine.

---

**Journey 2: The Anti-Marketer's Monday (Primary User, Happy Path)**

**Who:** Taotech, solo founder of Jocoque & Yogurt Mich. Has never managed social media. Doesn't want to start now.

**Monday 9:00 AM:** Taotech opens Telegram while drinking coffee. He messages Melina: "Plan this week. Michel made a new batch of labneh with za'atar yesterday, I have photos. Theme: labneh as the ultimate keto snack."

**Monday 9:02 AM:** Melina responds:
"Got it. Here's the weekly plan:
- Mon: Reel script — 'Tu snack keto perfecto' (labneh + za'atar closeup)
- Tue: Carousel — '5 formas de comer labneh' (auto-generated images)
- Wed: Educational post — 'Que son los probioticos?' (autopilot, no approval needed)
- Thu: Story — Behind-the-scenes Michel in kitchen (needs your photo)
- Fri: Reel script — 'Macros del labneh vs yogurt comercial'
- Sat-Sun: Autopilot educational posts (prebiotics, Mediterranean diet)

Drafts ready in Notion. Want me to generate now?"

**Monday 9:03 AM:** "Yes."

**Monday 9:15 AM:** Melina sends: "Done. 4 posts need your review in Notion. 3 autopilot posts are already scheduled via ContentStudio. I used your labneh photos for the Reel and carousel. Review link: [Notion]"

**Monday 9:30 AM:** Taotech opens Notion, reviews 4 drafts. Edits one caption. Approves all. Messages Melina: "Approved. Schedule everything."

**Monday 9:31 AM:** Melina: "Scheduled. Your week is set. I'll send you the performance report on Friday."

**Total time spent on marketing this week: 30 minutes.**

**Friday 5:00 PM:** Melina sends the weekly report: "This week: 7 posts published, 2,340 impressions, 189 engagements, 12 new followers, best performer: the labneh macros Reel (847 views). Suggested theme for next week: 'Yogurt griego para deportistas' — your fitness posts are getting 2x the engagement of heritage posts right now."

**Resolution:** Taotech never opened Instagram, TikTok, or Facebook directly. He never wrote a caption from scratch. He never researched hashtags. He spent 30 minutes on Monday and glanced at a report on Friday. The brand posted 7 times across 3 platforms.

---

**Journey 3: Michel's Kitchen Photo (Content Source, Passive Path)**

**Who:** Michel, 70-year-old Lebanese artisan. Not technical. Uses WhatsApp.

**Wednesday 11:00 AM:** Michel just finished a beautiful batch of labneh with za'atar and olive oil. He takes a photo on his phone — natural light, his hands, the bowl. He sends it to Melina's Telegram/WhatsApp: "Mira, quedo perfecto hoy."

**Wednesday 11:01 AM:** Melina receives the image. Runs it through Gemini for visual analysis. Generates a caption in the Mich brand voice: "Las manos de Michel, 40 anos de tradicion libanesa en cada cucharada. Labneh con za'atar y aceite de oliva — asi se come en el Libano. Sin aditivos, sin gomas, solo leche y cultivos lacticos. #JocoqueYYogurtMich #LabnehArticanal #HerenciaLibanesa"

**Wednesday 11:02 AM:** Melina sends the draft to Taotech for approval: "Michel sent a photo. Here's the draft post. Approve?"

**Wednesday 11:15 AM:** Taotech sees it, taps approve. Melina schedules it for Thursday at 10 AM via ContentStudio.

**Resolution:** The most authentic content the brand will ever produce — Michel's actual hands, his actual kitchen, his actual product — made it from phone camera to scheduled post in 15 minutes. Michel's only action was sharing a photo like he'd share it with a friend. No app, no dashboard, no marketing knowledge required.

*Note: The end consumers who see Melina's content (keto/fitness audience, heritage foodies, wellness parents) are fully defined in the Jocoque & Yogurt Mich product brief and are not repeated here. Melina's brand bible for each client captures these audience personas for content targeting.*

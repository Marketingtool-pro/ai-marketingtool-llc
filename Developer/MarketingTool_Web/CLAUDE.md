# MarketingTool Web App — Customer Portal

## THIS IS A CUSTOMER PORTAL, NOT ADMIN

- Customers use this to manage their marketing.
- **Phone App is SEPARATE**: Appwrite + Firebase stack. Uses **Appwrite Functions** (`toolexecutor`, `chat-ai`).
- **Web App is DESKTOP ONLY**: (1920px) — Uses **GCloud Agent Workers** for tool generation.
- **Zero Trust Handover**: Per-page GCloud Agent → AI Router (VPS 1).

## Architecture (LOCKED — page by page)

### 1. Web App Workflow (Desktop 1920px)

```
Page → JS input (1920px desktop) → Bearer <Appwrite JWT>
  ↓
Nginx (VPS 2) → injects Windmill token server-side, only /jobs/run_wait_result/ allowed
  ↓
Per-page stack (one set per tool group on the page):
  ├─ Engine   (Python — validates JWT, checks tier/credit, builds prompt)
  ├─ Router   (routes to the right worker for that tool)
  ├─ Worker   (calls Meta/Google/TikTok/any-API — RAW data only, cron jobs)
  │     ↓ HANDOVER (worker gathers facts → never polishes)
  └─ AI Router (ONE router, VPS 1 port 9000, 10 models always active)
       ↓ rich 1920px result (image / video / text / download) → Supabase → Customer
```

**Page-by-page rule:**

- Each page has its OWN engine + router + worker + optional cron job
- 10 tools on a page ≈ 10 Python scripts ≈ average 1 engine + 1 router per tool group
- JS input/output on the client, JWT validated server-side on every call
- Workers pull RAW data from vendor APIs only — **they never produce polished customer output**
- AI Router is the SINGLE polish step — rich 1920px results + download button on every page

**GCloud Agent track (Ad Library / Google Ads only):**

- GCloud Cloud Run `marketingtool-agent` works in the SAME pattern as a Windmill worker — per-page, raw data, then HANDOVER to the SAME AI Router. Not mixed with AI Router — it's a worker alongside the others.
- Its polished output flows through AI Router for the rich customer result, exactly like any Windmill worker.

**Rules:**

- 10 AI models always active at the AI Router
- Real results every time, no cheat, no mock data (Ad Library is the only intentional demo page)
- Customer NEVER talks to Windmill, AI Router, Supabase, or any vendor API directly
- Download option available on every page

### 2. Phone App Workflow (Completely Separate Codebase)

- Package: `pro.marketingtool.app` at `/Users/loken/Developer/AiMarketingtool-pro-fbaf2fad`
- **Auth/OTP**: Firebase Authentication (phone → SMS OTP) + Appwrite OAuth for Google/Facebook/Apple
- **SMS delivery**: MSG91 + MessageBird via Appwrite Function `msg91-proxy`
- **Tool engine**: Appwrite Functions (`tool-executor`, `chat-ai`) + Firebase GenKit
- **Firebase**: GenKit AI logic, chat functions, push notifications, analytics
- **Database**: Appwrite DB (separate from web app's Supabase)
- **Payment**: In-app IAP (Apple/Google) — direct integration, no external payment links (compliance rule)
- **Isolation**: Phone app NEVER touches web app's Windmill, AI Router, GCloud agents, Supabase, or nginx VPS 2

## Technical Specs

- **Web Tool Engine**: GCloud Agent (Cloud Run).
- **Phone Tool Engine**: Appwrite `toolexecutor` (Cloud Run).
- **Mobile Auth**: Bird OTP via msg91 Appwrite proxy.
- **AI Router Persistence**: 10 models always active on VPS 1.
- **Worker Ratio**: 10 Tools ≈ 1 Engine + 1 Router.
- **GCloud Services**: Cloud Run (Workers), Secret Manager (Keys), IAM (Service Accounts).

## Stack

- React + Vite + MUI 9 (SaasAble template base)
- Appwrite = Auth login ONLY (JWT, OAuth) + Stripe payment.
- GCloud = Agent Workers for Web App (Cloud Run).
- AI Router = VPS 1 port 9000 (10-model pipeline).
- Supabase = Postgres ONLY (RLS on ALL 28 tables).
- ALL services are small-to-small paid services (High Performance).

## Critical Rules

- **PAYMENT POLICY**: No external payment links. Use direct integration for compliance.
- **STRICT ISOLATION**: Web App (GCloud Agents) and Phone App (Appwrite Functions) never mix.
- **DESKTOP ONLY**: Result UI and downloads are 1920px optimized.
- **No Mock Data**: All results fetched via real API workers before AI handover.

## AI Router Tasks (Frozen)

| Task            | Model              | Provider     | Use Case                                  |
| --------------- | ------------------ | ------------ | ----------------------------------------- |
| creative        | Claude Sonnet 4    | Anthropic    | Ads, blogs, captions, emails              |
| research        | Gemini 2.5 Flash   | Google       | SEO, competitors, analysis, reports       |
| coding          | Claude Sonnet 4    | Anthropic    | JSON, APIs, scripts, data pipelines       |
| image_gen       | DALL-E 3           | OpenAI       | Create images (logos, banners, ad images) |
| stable_image    | Stable Diffusion 3 | Stability AI | High-fidelity static images               |
| video_gen       | FAL.ai Video       | FAL          | AI-generated ad videos                    |
| vision_analysis | GPT-4o Vision      | OpenRouter   | Analyze images (ad creatives, UX)         |
| ocr             | Qwen3 VL 8B        | OpenRouter   | Read text from images/dashboards          |
| automation      | Llama 3.3 70B      | Groq         | Bulk tagging, classification, cheap jobs  |
| default         | Claude Sonnet 4    | Anthropic    | Everything else                           |

## Page Status

### WORKING (Done + Tested)

- `src/views/admin/dashboard/` — Dashboard (MUI 9 Pro)
- `src/views/admin/chat/` — Chat page (36 tools, 3 engines)
- `src/views/admin/command-centre/` — Command Centre (10 workflows)
- `src/views/admin/settings/` — Settings (Google/Meta connected)
- `src/views/admin/analytics/` — Analytics (Rich Glass Morphism design)
- `src/views/admin/reports/` — Reports (3-tab Rich Builder UI)
- `src/views/admin/chart/` — Charts (Full Pro Gallery)

### PENDING (User will signal when to start)

- `src/views/admin/tools/` — Tools catalogue
- `src/views/admin/campaigns/` — Campaigns
- Meta Audit, Ad Library — awaiting GCloud Agent handover logic
- Stripe billing integration

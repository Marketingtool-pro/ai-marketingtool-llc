# MarketingTool.pro — Web App Complete Guide

## Architecture (LOCKED)
```
Customer → Web App (React/MUI 1920px) → windmill/index.js (469 JS functions)
                                              ↓
                                     Windmill (Python, VPS 1)
                                     ├── Validates Appwrite JWT
                                     ├── Engines (AI Router → 8 models)
                                     ├── Workers (CRUD + enrichment)
                                     └── Supabase (service_role key, VPS 2)
```

## AI Router — 8 Models (VPS 1, port 9000)
| Task | Model | Provider | Status |
|------|-------|----------|--------|
| creative | Claude Sonnet 4 | Anthropic | WORKING |
| research | Gemini 2.5 Flash | Google | WORKING |
| coding | Claude Sonnet 4 | Anthropic | WORKING |
| image_gen | DALL-E 3 | OpenAI | WORKING |
| vision_analysis | DALL-E 3 | OpenRouter | WORKING |
| ocr | Qwen3-VL-8B | OpenRouter | WORKING |
| automation | Llama-3.3-70B | Groq | WORKING |
| default | Claude Sonnet 4 | Anthropic | WORKING |

URL: `http://172.17.0.1:9000` (Docker) / `http://31.220.107.19:9000` (external)

## Main Pages (Free Trial — Customer Conversion Key)

### 1. Smart Dashboard
- Workers: `dashboard-summary`
- JS: `fetchDashboardSummary()`
- Tables: `ad_accounts`, `campaign_metrics`, `daily_summary`, `kpi_snapshots`

### 2. AI Chat (3 engines, 10 workers)
- Engines: `engine-creative`, `engine-automation`, `engine-insight`
- Workers: `worker-chat-history`, `worker-chat-messages`, `worker-chat-session-create`, `worker-chat-session-delete`, `worker-generation-history`, `worker-generation-detail`, `worker-generation-favorite`, `worker-generation-share`, `worker-generation-rate`, `worker-credit-check`
- JS: `executeGeneration()`, `executeChat()`, `fetchChatHistory()`, `fetchChatMessages()`, `createChatSession()`, `deleteChatSession()`, `fetchGenerationHistory()`, `fetchGenerationDetail()`, `favoriteGeneration()`, `shareGeneration()`, `rateGeneration()`, `checkCredits()`
- Tables: `generations`, `credit_usage`, `billing_transactions`, `chat_sessions`, `chat_messages`, `favorites`, `ratings`, `shares`, `subscriptions`
- TESTED: Real results — 87/100 score, 5 variants, AI images, benchmarks, 44.3s

### 3. Command Centre (1 router, 10 workers)
- Router: `run-workflow-api`
- Workers: `worker-launch-google`, `worker-launch-meta`, `worker-ab-test`, `worker-bid-optimise`, `worker-creative-refresh`, `worker-audience-expand`, `worker-scale-winners`, `worker-kill-underperformers`, `worker-retargeting`, `worker-cross-report`
- Status: `get-run-status`
- JS: `startWorkflowRun()`, `getRunStatus()`, `fetchCommandCentreData()`
- Tables: `workflow_runs`, `campaigns`, `campaign_metrics`, `daily_summary`, `insights`, `automation_logs`
- FIX DONE: Workers now call AI Router directly (not old ai-generate)

### 4. Campaigns (2 engines, 9 workers, 1 scheduler)
- Engines: `engine-campaign-google`, `engine-campaign-meta`
- Workers: `worker-campaign-list`, `worker-campaign-metrics`, `worker-campaign-optimize`, `worker-campaign-pause`, `worker-campaign-edit`, `worker-campaign-duplicate`, `worker-campaign-delete`, `worker-campaign-report`
- Scheduler: `campaign-scheduler` (runs hourly)
- JS: `createCampaign()`, `fetchCampaigns()`, `fetchCampaignMetrics()`, `optimizeCampaign()`, `pauseResumeCampaign()`, `editCampaign()`, `duplicateCampaign()`, `deleteCampaign()`, `generateCampaignReport()`
- Tables: `campaigns` (44 columns), `campaign_metrics`

### 5. 360 Meta Audit (1 engine, 4 workers)
- Engine: `engine-meta-audit` — UPDATED: uses `meta-api-helper` for REAL Meta data
- Workers: `worker-audit-run`, `worker-audit-history`, `worker-audit-compare`, `worker-audit-export`
- Helper: `meta-api-helper` — handles appsecret_proof authentication
- JS: `runMetaAudit()`, `fetchAuditHistory()`, `compareAudits()`, `exportAudit()`
- Tables: `insights`, `ad_accounts`, `campaign_metrics`, `execution_logs`
- META API CONFIRMED: 7 accounts, 11 campaigns, ₹9L spent

### 6. Ad Library (1 engine, 3 workers)
- Engine: `engine-ad-library`
- Workers: `worker-ad-analyze`, `worker-ad-save`, `worker-ad-trending`
- JS: `searchAdLibrary()`, `analyzeAd()`, `saveAd()`, `fetchTrendingAds()`
- Tables: `insights`, `favorites`

### 7. Analytics
- Engines: `engine-analytics-overview`, `engine-analytics-platform`
- Workers: `worker-analytics-compare`, `worker-analytics-export`, `worker-analytics-alerts`, `worker-analytics-refresh`
- JS: `fetchAnalyticsOverview()`, `fetchPlatformAnalytics()`, `compareAnalytics()`, `exportAnalytics()`, `fetchAnalyticsAlerts()`, `refreshAnalytics()`, `fetchMetrics()`
- Tables: `campaign_metrics`, `campaigns`, `kpi_snapshots`, `performance_daily`, `ad_accounts`, `generations`

### 8. Reports (2 engines, 7 workers)
- Engines: `engine-report-generate`, `engine-report-schedule`
- Workers: `worker-report-list`, `worker-report-schedules`, `worker-report-toggle-schedule`, `worker-report-delete-schedule`, `worker-report-export`, `worker-report-delete`, `worker-report-detail`
- JS: `generateReport()`, `scheduleReport()`, `fetchReports()`, `fetchReportSchedules()`, `toggleReportSchedule()`, `deleteReportSchedule()`, `fetchReportDetail()`, `exportReport()`, `deleteReport()`
- Tables: `daily_summary`, `campaign_metrics`, `automation_logs`

### 9. Chart
- Worker: `worker-chart-data`
- JS: `fetchChartData()`
- Tables: `campaign_metrics`, `generations`, `campaigns`, `credit_usage`

## 7 Platform Pages (PAID — Locked for Free Users)

### Google Ads (4 routers, 4 engines, 79 tools, 7 utility workers)
- Routers: `router-google-graders`, `router-google-audit`, `router-google-campaign-mgmt`, `router-google-budget-bidding`
- Engines: `engine-google-graders`, `engine-google-audit-analysis`, `engine-google-campaign-mgmt-v2`, `engine-google-budget-bidding`
- Vertex AI: `worker-vertex-ai` — Google Cloud Vertex AI + Gemini 3 Flash
- 79 tool workers — ALL have AI Router (8 models)
- JS: 9 section + 79 direct tool functions

### Meta / Facebook (6 routers, 6 engines, 53 tools, 7 utility workers)
- Routers: `router-meta-ads-management`, `router-meta-audience-targeting`, `router-meta-creative-copy`, `router-meta-automation-optimization`, `router-meta-tracking-analytics`, `router-meta-agency-tools`
- Engines: `engine-meta-ads-management`, `engine-meta-audience-targeting`, `engine-meta-creative-copy`, `engine-meta-automation-optimization`, `engine-meta-tracking-analytics`, `engine-meta-agency-tools`
- 53 tool workers — ALL have AI Router (8 models)
- JS: 6 section + 53 direct + 9 utility functions

### Social Media (3 routers, 3 engines, 29 tools)
- Routers: `router-social-instagram`, `router-social-social-management`, `router-social-youtube`
- Engines: `engine-social-instagram`, `engine-social-social-management`, `engine-social-youtube`
- JS: 3 section + 29 direct + 9 utility functions

### SEO & Content (2 routers, 2 engines, 38 tools)
- Routers: `router-seo-seo-optimization`, `router-seo-content-writing`
- Engines: `engine-seo-seo-optimization`, `engine-seo-content-writing`
- JS: 2 section + 38 direct + 9 utility functions

### E-commerce (5 routers, 5 engines, 53 tools)
- Sections: Shopify, Advertising, Analytics, Automation, Strategy
- Routers: `router-ecom-shopify`, `router-ecom-advertising`, `router-ecom-analytics`, `router-ecom-automation`, `router-ecom-strategy`
- Engines: `engine-ecom-shopify`, `engine-ecom-advertising`, `engine-ecom-analytics`, `engine-ecom-automation`, `engine-ecom-strategy`
- JS: 5 section + 53 direct + 25 utility functions

### An-Analytics (2 routers, 2 engines, 22 tools)
- Routers: `router-analytics-analytics-insights`, `router-analytics-roi-attribution`
- Engines: `engine-analytics-analytics-insights`, `engine-analytics-roi-attribution`
- JS: 2 section + 22 direct + 9 utility functions

### AI Tools (5 routers, 5 engines, 56 tools)
- Sections: AI Agents, Marketing & Advertising, Text & Content, Developer & Automation, Email/Graders
- JS: 5 section + 56 direct functions

## Meta API — CONFIRMED WORKING
- Token: stored as `f/tools/fb_ads_access_token` (secret)
- App Secret: `33a09172df2d69e54f4b6fd0160ec6b4` (stored as `f/tools/fb_ads_app_secret`)
- App ID: `1582682256320433` (MarketingTool Ads)
- Requires `appsecret_proof` — handled by `meta-api-helper` script
- 7 accounts found: act_337789233629380 (main, ₹9L), act_1725433101404586 (Antiviruspoint), etc.
- 11 active campaigns on main account
- Permissions: ads_management, ads_read, read_insights

## Google Ads — Via Vertex AI Agent
- Developer token: `P9XpJTy27ySZchM9WTVmQw` (Test Account, Basic Access pending)
- Vertex AI Agent code at: `/Users/loken/marketingtool-agent/app/agent.py`
- GitHub: `https://github.com/Lokeninfinitypoint/marketingtool`
- GCP Project: `marketing-tool-484720`
- Deploy to Cloud Run: `gcloud run deploy marketingtool-agent --source=. --project=marketing-tool-484720 --region=us-central1 --allow-unauthenticated --memory=1Gi --timeout=300 --port=8080 --service-account=marketingtool-app@marketing-tool-484720.iam.gserviceaccount.com`
- PENDING: Cloud Run deploy needs IAM permissions fix

## Supabase — 29 Tables (VPS 2)
Core: tenants, mt_users, accounts, ad_accounts, campaign_metrics, daily_summary, insights, sync_logs, automation_logs, integrations
Chat: subscriptions, credit_usage, generations, campaigns (44 cols), campaigns_v2, chat_sessions, chat_messages, favorites, ratings, shares
Engine: execution_logs, engine_performance, performance_daily, kpi_snapshots, ai_decision_memory, billing_transactions
Workflow: workflow_runs
Router: ai_router_logs
Registry: tool_registry

## Windmill Variables (VPS 1)
- `f/tools/ai_router_url` = `http://172.17.0.1:9000`
- `f/tools/supabase_url` = Supabase REST URL
- `f/tools/supabase_service_key` = Supabase service role key (secret)
- `f/tools/fb_ads_access_token` = Meta access token (secret)
- `f/tools/fb_ads_app_secret` = Meta app secret (secret)
- `f/tools/gcp_project_id` = `marketing-tool-484720`
- `f/tools/gcp_service_account_email` = `marketing-api-sa@...`
- `f/tools/gcp_service_account_key` = GCP private key (secret)
- `f/tools/vertex_ai_region` = `us-central1`

## Credit System
| Plan | Monthly | Yearly | Credits |
|------|---------|--------|---------|
| Free Trial | $0 (7 days) | — | 3/day |
| Starter | $29/mo | $199/yr | 200/month |
| Professional | $59/mo | $499/yr | 500/month |
| Growth | $99/mo | $999/yr | 1,500+/month |
| Agency | Custom | Custom | Unlimited |

## TOTALS
- 469 JS functions
- 27 routers
- 27 engines
- 325+ workers
- 29 Supabase tables
- 8/8 AI models active
- 7 platforms scripted
- All deployed to VPS 2

## WHAT NEEDS FIXING
1. Cloud Run deploy for Vertex AI Agent (IAM permissions)
2. Meta Audit — test with real account data display
3. Command Centre — verify polling shows results after worker fix
4. Platform pages — lock for free users, open for admin
5. Stripe billing integration

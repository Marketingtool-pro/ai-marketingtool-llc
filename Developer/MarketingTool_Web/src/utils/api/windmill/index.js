/***************************  API SERVICE  ***************************/

import { AUTH_USER_KEY } from '@/config';

const API_BASE = import.meta.env.VITE_WINDMILL_URL || 'http://localhost:8000';
const API_WORKSPACE = import.meta.env.VITE_WINDMILL_WORKSPACE || 'marketingtool';
const WINDMILL_TOKEN = import.meta.env.VITE_WINDMILL_TOKEN || '';

// Get Appwrite JWT to pass to Windmill scripts for validation
function getAppwriteJwt() {
  try {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.access_token || '';
    }
  } catch {
    // ignore
  }
  return '';
}

async function apiFetch(path, options = {}) {
  const url = `${API_BASE}/api/w/${API_WORKSPACE}${path}`;

  // Inject Appwrite JWT into request body so Windmill scripts can validate it
  let body = options.body ? JSON.parse(options.body) : {};
  body.appwriteJwt = getAppwriteJwt();
  const bodyStr = JSON.stringify(body);

  const timeout = options.timeout || 30000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      body: bodyStr,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WINDMILL_TOKEN}`,
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Request failed (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  }
}

/**
 * Engine script mapping — routes directly to the correct engine
 * Skips the ai-generate router for lower latency
 */
const ENGINE_SCRIPTS = {
  creative: 'f/tools/engine-creative',
  automation: 'f/tools/engine-automation',
  insight: 'f/tools/engine-insight',
};

/**
 * Execute a tool generation * @param {string} toolSlug - Tool identifier (e.g. 'blog-writer')
 * @param {string} toolName - Display name (e.g. 'Blog Writer')
 * @param {string} mainInput - Primary user input
 * @param {Object} additionalInputs - Extra form fields (tone, wordCount, etc.)
 * @param {string} userId - Appwrite user ID
 * @param {string} [engineType] - Engine type ('creative'|'automation'|'insight') for direct routing
 * @returns {Promise<Object>} Generation result
 */
export async function executeGeneration({ toolSlug, toolName, toolDescription, toolBadge, mainInput, additionalInputs = {}, userId, engineType }) {
  const script = ENGINE_SCRIPTS[engineType] || 'f/tools/ai-generate';
  return apiFetch(`/jobs/run_wait_result/p/${script}`, {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({
      toolSlug,
      toolName,
      toolDescription: toolDescription || '',
      toolBadge: toolBadge || '',
      input: mainInput.slice(0, 5000),
      additionalInputs,
      userId
    })
  });
}

/**
 * Execute AI chat via Windmill * @param {string} message - User message
 * @param {string} sessionId - Chat session ID
 * @param {string} userId - Appwrite user ID
 * @returns {Promise<Object>} Chat response
 */
export async function executeChat({ message, sessionId, userId }) {
  try {
    return await apiFetch('/jobs/run_wait_result/p/f/mobile/chat_ai', {
      method: 'POST',
      timeout: 90000,
      body: JSON.stringify({ message, sessionId, userId })
    });
  } catch (err) {
    // Auto-retry once on timeout (Windmill cold start)
    if (err.message?.includes('timed out')) {
      return apiFetch('/jobs/run_wait_result/p/f/mobile/chat_ai', {
        method: 'POST',
        timeout: 90000,
        body: JSON.stringify({ message, sessionId, userId })
      });
    }
    throw err;
  }
}

/**
 * Fetch campaign metrics * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Metrics data
 */
/**
 * Analytics Overview — KPIs, trends, AI analysis, forecast
 * @param {string} userId - Appwrite user ID
 * @param {string} [dateRange] - 'last_7_days' | 'last_30_days' | 'last_90_days'
 * @param {string} [platform] - Filter by platform
 * @returns {Promise<Object>} { success, data: { summary, metrics[], campaigns[], aiAnalysis, aiRecommendations, aiForecast } }
 */
export async function fetchAnalyticsOverview({ userId, dateRange, platform } = {}) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/engine-analytics-overview', {
    method: 'POST',
    timeout: 60000,
    body: JSON.stringify({ userId, dateRange, platform })
  });
}

/**
 * Analytics Platform Deep Dive — per-platform analysis
 * @param {string} userId - Appwrite user ID
 * @param {string} platform - 'google' | 'meta' | 'instagram' | 'tiktok'
 * @param {string} [dateRange]
 * @returns {Promise<Object>} { success, data: { platform, summary, metrics[], deepDive, benchmarks, optimization } }
 */
export async function fetchPlatformAnalytics({ userId, platform, dateRange } = {}) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/engine-analytics-platform', {
    method: 'POST',
    timeout: 60000,
    body: JSON.stringify({ userId, platform, dateRange })
  });
}

/**
 * Compare two platforms side-by-side
 * @param {string} userId
 * @param {string} platform1 - 'google'
 * @param {string} platform2 - 'meta'
 * @returns {Promise<Object>} { success, platforms, comparison }
 */
export async function compareAnalytics({ userId, platform1, platform2, dateRange } = {}) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-analytics-compare', {
    method: 'POST',
    timeout: 30000,
    body: JSON.stringify({ userId, platform1, platform2, dateRange })
  });
}

/**
 * Export analytics data
 * @param {string} userId
 * @param {string} [dateRange]
 * @param {string} [platform]
 * @returns {Promise<Object>} { success, exportData }
 */
export async function exportAnalytics({ userId, dateRange, platform } = {}) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-analytics-export', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, dateRange, platform })
  });
}

/**
 * Check performance alerts and anomalies
 * @param {string} userId
 * @returns {Promise<Object>} { success, alerts }
 */
export async function fetchAnalyticsAlerts({ userId } = {}) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-analytics-alerts', {
    method: 'POST',
    timeout: 20000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Refresh analytics data from connected ad accounts
 * @param {string} userId
 * @returns {Promise<Object>} { success, refreshed, accounts }
 */
export async function refreshAnalytics({ userId } = {}) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-analytics-refresh', {
    method: 'POST',
    timeout: 30000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch analytics metrics — maps response for the analytics page
 */
export async function fetchMetrics(params = {}) {
  try {
    const res = await fetchAnalyticsOverview(params);
    const d = res?.data || res || {};
    const s = d.summary || {};
    return {
      kpis: {
        impressions: s.totalImpressions || 0,
        clicks: s.totalClicks || 0,
        ctr: s.avgCTR || 0,
        conversions: s.totalConversions || 0,
        roas: s.roas || 0,
        spend: s.totalSpend || 0,
        cpc: s.avgCPC || 0,
        revenue: (s.totalConversions || 0) * 50,
      },
      platforms: d.campaigns ? [...new Set((d.campaigns || []).map(c => c.platform))].map(p => {
        const pCamps = (d.campaigns || []).filter(c => c.platform === p);
        return {
          platform: p,
          spend: pCamps.reduce((sum, c) => sum + (parseFloat(c.spend) || 0), 0),
          clicks: pCamps.reduce((sum, c) => sum + (parseInt(c.results) || 0), 0),
          campaigns: pCamps.length,
        };
      }) : [],
      creatives: [],
      trend: d.metrics || [],
    };
  } catch {
    return null;
  }
}

/**
 * Fetch campaigns list
 * @param {string} userId - Appwrite user ID
 * @param {string} [platform] - Filter: 'google' | 'meta'
 * @param {string} [status] - Filter: 'active' | 'paused' | 'draft' | 'archived'
 * @returns {Promise<Object>} { success, campaigns[], total, summary }
 */
export async function fetchCampaigns({ userId, platform, status } = {}) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-campaign-list', {
    method: 'POST',
    timeout: 30000,
    body: JSON.stringify({ userId, platform, status })
  });
}

/**
 * Fetch dashboard summary data
 * @returns {Promise<Object>} Dashboard KPIs and chart data
 */
export async function fetchDashboardSummary() {
  return apiFetch('/jobs/run_wait_result/p/f/tools/dashboard-summary', {
    method: 'POST',
    body: JSON.stringify({})
  });
}

/**
 * Run a Meta audit
 * @param {string} adAccountId - Meta ad account ID
 * @param {string} userId - Appwrite user ID
 * @returns {Promise<Object>} Audit results
 */
/**
 * Run a 360 Meta Audit — AI analyzes entire ad account
 * @param {string} adAccountId - Meta ad account ID
 * @param {string} userId - Appwrite user ID
 * @returns {Promise<Object>} { success, auditId, data: { overallScore, issues[], opportunities[], campaignAudits[], projections, recommendations[] } }
 */
export async function runMetaAudit({ adAccountId, userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-audit-run', {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ adAccountId, userId })
  });
}

/**
 * Fetch past audit reports
 * @param {string} userId - Appwrite user ID
 * @param {string} [adAccountId] - Filter by account
 * @returns {Promise<Object>} { success, audits[], total }
 */
export async function fetchAuditHistory({ userId, adAccountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-audit-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, adAccountId })
  });
}

/**
 * Compare two audits side-by-side
 * @param {string} userId - Appwrite user ID
 * @param {string} auditId1 - First audit ID
 * @param {string} auditId2 - Second audit ID
 * @returns {Promise<Object>} { success, audit1, audit2, comparison, scoreDelta }
 */
export async function compareAudits({ userId, auditId1, auditId2 }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-audit-compare', {
    method: 'POST',
    timeout: 30000,
    body: JSON.stringify({ userId, auditId1, auditId2 })
  });
}

/**
 * Export audit as JSON
 * @param {string} userId - Appwrite user ID
 * @param {string} auditId - Audit ID
 * @returns {Promise<Object>} { success, exportData, score, date }
 */
export async function exportAudit({ userId, auditId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-audit-export', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, auditId })
  });
}

/**
 * Fetch generation history
 * @param {string} userId - Appwrite user ID
 * @param {Object} filters - Optional filters (toolSlug, dateRange)
 * @returns {Promise<Object>} History records
 */
export async function fetchHistory({ userId, ...filters }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/fetch-history', {
    method: 'POST',
    body: JSON.stringify({ userId, ...filters })
  });
}

/**
 * Search competitor ads via Ad Library
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query (brand, keyword, topic)
 * @param {string} [params.platform] - Platform filter (facebook, instagram, google)
 * @param {string} [params.dateRange] - Date range (7d, 30d, 90d, 1y)
 * @param {string} [params.country] - Country code
 * @returns {Promise<Object>} Search results with ads array
 */
/**
 * Search Ad Library — AI-powered competitor ad research
 * @param {string} query - Search term (brand, keyword, industry)
 * @param {string} [platform] - 'facebook' | 'instagram' | 'google' | 'all'
 * @param {string} [dateRange] - '7d' | '30d' | '90d' | '1y'
 * @param {string} [country] - Country code
 * @returns {Promise<Object>} { success, ads[], total, marketAnalysis, copyTips }
 */
export async function searchAdLibrary(params = {}) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/engine-ad-library', {
    method: 'POST',
    timeout: 60000,
    body: JSON.stringify(params)
  });
}

/**
 * AI-analyze any ad — copy quality, strategy, image analysis
 * @param {string} userId - Appwrite user ID
 * @param {string} adId - Ad identifier
 * @param {Object} adData - Ad data (headline, body, platform, thumbnail)
 * @returns {Promise<Object>} { success, analysis: { copyAnalysis, strategyAnalysis, imageAnalysis } }
 */
export async function analyzeAd({ userId, adId, adData }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-ad-analyze', {
    method: 'POST',
    timeout: 30000,
    body: JSON.stringify({ userId, adId, adData })
  });
}

/**
 * Save/unsave ad to customer's board
 * @param {string} userId - Appwrite user ID
 * @param {string} adId - Ad identifier
 * @param {Object} [adData] - Ad data to save
 * @param {string} [action] - 'save' | 'unsave'
 * @returns {Promise<Object>} { success, action, adId }
 */
export async function saveAd({ userId, adId, adData, action }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-ad-save', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ userId, adId, adData, action })
  });
}

/**
 * Fetch trending ads by platform/category
 * @param {string} userId - Appwrite user ID
 * @param {string} [platform] - Platform filter
 * @param {string} [category] - Category filter
 * @returns {Promise<Object>} { success, trending }
 */
export async function fetchTrendingAds({ userId, platform, category }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-ad-trending', {
    method: 'POST',
    timeout: 20000,
    body: JSON.stringify({ userId, platform, category })
  });
}

/**
 * Fetch connected ad accounts for the user
 * @param {string} userId - Appwrite user ID
 * @returns {Promise<Object>} Connected accounts list
 */
export async function fetchAdAccounts({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/connect-ad-account', {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch Command Centre data (cards + connection status + last runs)
 * @param {string} userId - Appwrite user ID
 * @returns {Promise<Object>} { connections, lastRuns }
 */
export async function fetchCommandCentreData({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/command-centre-data', {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
}

/**
 * Start a workflow run (async)
 * @param {string} workflowId - Workflow identifier
 * @param {Object} inputs - Form inputs
 * @param {string} userId - Appwrite user ID
 * @returns {Promise<Object>} { run_id, job_id, status: "queued" }
 */
export async function startWorkflowRun({ workflowId, inputs, userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/run-workflow-api', {
    method: 'POST',
    timeout: 120000,
    body: JSON.stringify({ workflowId, inputs, userId })
  });
}

/**
 * Get workflow run status + output
 * @param {string} runId - Run ID from startWorkflowRun
 * @returns {Promise<Object>} { status, progress, output_json, error }
 */
export async function getRunStatus({ runId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/get-run-status', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ runId })
  });
}

/**
 * Fetch connected ad accounts for workflow forms
 * @param {string} userId - Appwrite user ID
 * @returns {Promise<Object>} Connected accounts list
 */
export async function fetchConnectedAccounts({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/fetch-connected-accounts', {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
}

/**
 * Get workflow run logs
 * @param {string} runId - Run ID from startWorkflowRun
 * @returns {Promise<Object>} Run logs
 */
export async function getRunLogs({ runId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/get-run-logs', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ runId })
  });
}

/**
 * Check subscription tier for page-level gating
 * @param {string} userId - Appwrite user ID
 * @returns {Promise<Object>} { tier, trialDaysLeft, blocked, code }
 */
export async function checkSubscription({ userId }) {
  try {
    return await apiFetch('/jobs/run_wait_result/p/f/tools/check-subscription', {
      method: 'POST',
      timeout: 10000,
      body: JSON.stringify({ userId })
    });
  } catch {
    return { tier: 'free', trialDaysLeft: 0, blocked: true, code: 'CHECK_FAILED' };
  }
}

/**
 * Create a campaign via platform-specific Windmill workflow
 * @param {string} platform - 'google' or 'meta'
 * @param {string} accountId - Connected ad account ID
 * @param {Object} campaignData - Campaign form data
 * @param {string} userId - Appwrite user ID
 * @returns {Promise<Object>} { success, run_id } or error
 */
export async function createCampaign({ platform, accountId, campaignData, userId }) {
  const script = platform === 'google' ? 'f/tools/engine-campaign-google' : 'f/tools/engine-campaign-meta';
  return apiFetch(`/jobs/run_wait_result/p/${script}`, {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({
      toolSlug: `campaign-create-${platform}`,
      toolName: platform === 'google' ? 'Google Ads Campaign' : 'Meta Campaign',
      input: campaignData.name || '',
      additionalInputs: campaignData,
      userId,
      platform,
      accountId,
      campaignData,
    })
  });
}

/**
 * Fetch campaign performance metrics
 * @param {string} userId - Appwrite user ID
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Object>} { success, campaign, metrics[], analysis, recommendations }
 */
export async function fetchCampaignMetrics({ userId, campaignId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-campaign-metrics', {
    method: 'POST',
    timeout: 30000,
    body: JSON.stringify({ userId, campaignId })
  });
}

/**
 * Get AI optimization suggestions for a campaign
 * @param {string} userId - Appwrite user ID
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Object>} { success, campaign, optimization: { bidStrategy, freshAdCopy, audienceExpansion, budgetPlan } }
 */
export async function optimizeCampaign({ userId, campaignId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-campaign-optimize', {
    method: 'POST',
    timeout: 60000,
    body: JSON.stringify({ userId, campaignId })
  });
}

/**
 * Pause or resume a campaign
 * @param {string} userId - Appwrite user ID
 * @param {string} campaignId - Campaign ID
 * @param {string} action - 'pause' | 'resume'
 * @returns {Promise<Object>} { success, campaignId, status }
 */
export async function pauseResumeCampaign({ userId, campaignId, action }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-campaign-pause', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, campaignId, action })
  });
}

/**
 * Edit campaign settings
 * @param {string} userId - Appwrite user ID
 * @param {string} campaignId - Campaign ID
 * @param {Object} updates - Fields to update (campaign_name, objective, budget, status)
 * @returns {Promise<Object>} { success, campaignId, updated[] }
 */
export async function editCampaign({ userId, campaignId, updates }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-campaign-edit', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, campaignId, updates })
  });
}

/**
 * Duplicate a campaign (same or different platform)
 * @param {string} userId - Appwrite user ID
 * @param {string} campaignId - Campaign ID to duplicate
 * @param {string} [targetPlatform] - 'google' | 'meta' (defaults to same platform)
 * @returns {Promise<Object>} { success, newCampaignId, platform, adaptedCopy }
 */
export async function duplicateCampaign({ userId, campaignId, targetPlatform }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-campaign-duplicate', {
    method: 'POST',
    timeout: 30000,
    body: JSON.stringify({ userId, campaignId, targetPlatform })
  });
}

/**
 * Archive/delete a campaign
 * @param {string} userId - Appwrite user ID
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Object>} { success, campaignId, status: 'archived' }
 */
export async function deleteCampaign({ userId, campaignId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-campaign-delete', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, campaignId })
  });
}

/**
 * Generate campaign performance report
 * @param {string} userId - Appwrite user ID
 * @param {string} campaignId - Campaign ID
 * @param {string} [dateRange] - 'last_7_days' | 'last_30_days' | 'last_90_days'
 * @returns {Promise<Object>} { success, campaign, metrics[], report: { executiveSummary, actionableInsights, benchmarkComparison } }
 */
export async function generateCampaignReport({ userId, campaignId, dateRange }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-campaign-report', {
    method: 'POST',
    timeout: 60000,
    body: JSON.stringify({ userId, campaignId, dateRange })
  });
}

// ═══════════════════════════════════════════════════════════════
// REPORTS PAGE
// ═══════════════════════════════════════════════════════════════

/**
 * Generate a marketing report — AI creates full report with benchmarks
 * @param {string} userId
 * @param {string} [reportType] - 'performance' | 'campaign' | 'platform' | 'executive'
 * @param {string} [dateRange]
 * @param {string} [platform]
 * @returns {Promise<Object>} { success, reportId, data: { content, benchmarks, dashboardCode, summary } }
 */
/**
 * Generate report — AI creates full marketing report with all 8 models
 * @param {string} userId
 * @param {string} [reportName]
 * @param {string} [reportType] - 'performance' | 'campaign' | 'platform' | 'executive'
 * @param {string} [dateRange]
 * @param {string[]} [platforms]
 * @param {string[]} [metrics]
 * @returns {Promise<Object>} { success, reportId, data: { content, benchmarks, recommendations, forecast, adCopySuggestions, automationRules, coverImage } }
 */
export async function generateReport({ userId, reportName, reportType, dateRange, platforms, metrics }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/engine-report-generate', {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, reportName, reportType, dateRange, platforms, metrics })
  });
}

/**
 * Schedule recurring report
 * @param {string} userId
 * @param {string} reportName
 * @param {string} frequency - 'daily' | 'weekly' | 'monthly'
 * @param {string} [reportType]
 * @param {string[]} [platforms]
 * @param {string} [recipients]
 * @param {boolean} [enabled]
 * @returns {Promise<Object>} { success, scheduleId, config, scheduleTip }
 */
export async function scheduleReport({ userId, reportName, frequency, reportType, platforms, recipients, enabled }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/engine-report-schedule', {
    method: 'POST',
    timeout: 30000,
    body: JSON.stringify({ userId, reportName, frequency, reportType, platforms, recipients, enabled })
  });
}

/**
 * Fetch report history
 * @param {string} userId
 * @param {string} [reportType]
 * @returns {Promise<Object>} { success, reports[], total }
 */
export async function fetchReports({ userId, reportType }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-report-list', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, reportType })
  });
}

/**
 * Fetch scheduled reports
 * @param {string} userId
 * @returns {Promise<Object>} { success, schedules[], total }
 */
export async function fetchReportSchedules({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-report-schedules', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Toggle schedule enabled/disabled
 * @param {string} userId
 * @param {string} scheduleId
 * @param {boolean} enabled
 * @returns {Promise<Object>} { success, enabled }
 */
export async function toggleReportSchedule({ userId, scheduleId, enabled }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-report-toggle-schedule', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ userId, scheduleId, enabled })
  });
}

/**
 * Delete a scheduled report
 * @param {string} userId
 * @param {string} scheduleId
 * @returns {Promise<Object>} { success, status }
 */
export async function deleteReportSchedule({ userId, scheduleId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-report-delete-schedule', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ userId, scheduleId })
  });
}

/**
 * View report detail
 * @param {string} userId
 * @param {string} reportId
 * @returns {Promise<Object>} { success, report, date, type }
 */
export async function fetchReportDetail({ userId, reportId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-report-detail', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, reportId })
  });
}

/**
 * Export report as JSON
 * @param {string} userId
 * @param {string} reportId
 * @returns {Promise<Object>} { success, exportData }
 */
export async function exportReport({ userId, reportId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-report-export', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, reportId })
  });
}

/**
 * Delete a report
 * @param {string} userId
 * @param {string} reportId
 * @returns {Promise<Object>} { success, status }
 */
export async function deleteReport({ userId, reportId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-report-delete', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ userId, reportId })
  });
}

// ═══════════════════════════════════════════════════════════════
// TOOLS CATALOGUE PAGE
// ═══════════════════════════════════════════════════════════════

/**
 * Execute any tool from the catalogue — AI routes to correct model
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input - Main user input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data: { content, marketContext, imageUrl } }
 */
export async function executeTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/engine-tool-execute', {
    method: 'POST',
    timeout: 120000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Save/unsave a favorite tool
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} [action] - 'save' | 'unsave'
 * @returns {Promise<Object>} { success, action }
 */
export async function favoriteTool({ userId, toolSlug, action }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-tool-favorite', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ userId, toolSlug, action })
  });
}

/**
 * Rate a tool
 * @param {string} userId
 * @param {string} toolSlug
 * @param {number} rating - 1-5
 * @param {string} [comment]
 * @returns {Promise<Object>} { success, rating }
 */
export async function rateTool({ userId, toolSlug, rating, comment }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-tool-rate', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ userId, toolSlug, rating, comment })
  });
}

/**
 * Fetch tool usage history
 * @param {string} userId
 * @param {string} [toolSlug]
 * @returns {Promise<Object>} { success, history[], total }
 */
export async function fetchToolHistory({ userId, toolSlug }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-tool-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, toolSlug })
  });
}

// ═══════════════════════════════════════════════════════════════
// PLATFORM PAGES (7 platforms)
// ═══════════════════════════════════════════════════════════════

/**
 * Platform overview — campaigns, metrics, AI insights
 * @param {string} userId
 * @param {string} platform - 'google' | 'meta' | 'instagram' | 'tiktok' | 'linkedin' | 'ecommerce' | 'seo'
 * @returns {Promise<Object>} { success, data: { platform, accounts[], campaigns[], metrics[], overview, tips } }
 */
export async function fetchPlatformOverview({ userId, platform }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/engine-platform-overview', {
    method: 'POST',
    timeout: 30000,
    body: JSON.stringify({ userId, platform })
  });
}

/**
 * Fetch platform-specific campaigns
 * @param {string} userId
 * @param {string} platform
 * @returns {Promise<Object>} { success, campaigns[] }
 */
export async function fetchPlatformCampaigns({ userId, platform }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-platform-campaigns', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, platform })
  });
}

/**
 * Connect an ad account for a platform
 * @param {string} userId
 * @param {string} platform
 * @param {string} accountId
 * @param {string} [accessToken]
 * @param {string} [accountName]
 * @returns {Promise<Object>} { success, status: 'connected' }
 */
export async function connectPlatform({ userId, platform, accountId, accessToken, accountName }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-platform-connect', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, platform, accountId, accessToken, accountName })
  });
}

/**
 * Disconnect an ad account
 * @param {string} userId
 * @param {string} platform
 * @param {string} accountId
 * @returns {Promise<Object>} { success, status: 'disconnected' }
 */
export async function disconnectPlatform({ userId, platform, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-platform-disconnect', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ userId, platform, accountId })
  });
}

// ═══════════════════════════════════════════════════════════════
// CHAT PAGE WORKERS
// ═══════════════════════════════════════════════════════════════

/**
 * Fetch chat session history
 * @param {string} userId
 * @param {number} [limit]
 * @returns {Promise<Object>} { success, sessions[], total }
 */
export async function fetchChatHistory({ userId, limit }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-chat-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, limit })
  });
}

/**
 * Fetch messages for a chat session
 * @param {string} userId
 * @param {string} sessionId
 * @returns {Promise<Object>} { success, sessionId, messages[], total }
 */
export async function fetchChatMessages({ userId, sessionId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-chat-messages', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, sessionId })
  });
}

/**
 * Create a new chat session
 * @param {string} userId
 * @param {string} [title]
 * @returns {Promise<Object>} { success, sessionId, title }
 */
export async function createChatSession({ userId, title }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-chat-session-create', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ userId, title })
  });
}

/**
 * Delete a chat session
 * @param {string} userId
 * @param {string} sessionId
 * @returns {Promise<Object>} { success, status }
 */
export async function deleteChatSession({ userId, sessionId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-chat-session-delete', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ userId, sessionId })
  });
}

/**
 * Fetch generation history (all past tool outputs)
 * @param {string} userId
 * @param {string} [toolSlug]
 * @param {number} [limit]
 * @returns {Promise<Object>} { success, generations[], total }
 */
export async function fetchGenerationHistory({ userId, toolSlug, limit }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, toolSlug, limit })
  });
}

/**
 * Fetch a specific generation detail
 * @param {string} userId
 * @param {string} generationId
 * @returns {Promise<Object>} { success, generation }
 */
export async function fetchGenerationDetail({ userId, generationId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-detail', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ userId, generationId })
  });
}

/**
 * Save/unsave a generation as favorite
 * @param {string} userId
 * @param {string} generationId
 * @param {string} [action] - 'save' | 'unsave'
 * @returns {Promise<Object>} { success, action }
 */
export async function favoriteGeneration({ userId, generationId, action }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-favorite', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ userId, generationId, action })
  });
}

/**
 * Create shareable link for a generation
 * @param {string} userId
 * @param {string} generationId
 * @returns {Promise<Object>} { success, shareCode, shareUrl }
 */
export async function shareGeneration({ userId, generationId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-share', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ userId, generationId })
  });
}

/**
 * Rate a generation
 * @param {string} userId
 * @param {string} generationId
 * @param {number} rating - 1-5
 * @param {string} [comment]
 * @returns {Promise<Object>} { success, rating }
 */
export async function rateGeneration({ userId, generationId, rating, comment }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-rate', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ userId, generationId, rating, comment })
  });
}

/**
 * Check remaining AI credits for today
 * @param {string} userId
 * @returns {Promise<Object>} { success, tier, todayUsed, dailyLimit, remaining }
 */
export async function checkCredits({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-credit-check', {
    method: 'POST',
    timeout: 10000,
    body: JSON.stringify({ userId })
  });
}

// ═══════════════════════════════════════════════════════════════
// GOOGLE PLATFORM — Router + Engines + Tool Workers
// ═══════════════════════════════════════════════════════════════

/**
 * Execute Google platform tool via router
 * @param {string} userId
 * @param {string} section - 'grader' | 'audit' | 'campaign' | 'budget'
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @param {string} [accountId]
 * @returns {Promise<Object>} { success, data: { content, benchmarks, adCopy, automationRules, image, codeSnippet } }
 */
export async function executeGoogleTool({ userId, section, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-google-platform', {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, section, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

/**
 * Execute a specific Google tool worker directly
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data: { content, benchmarks, image, code, automationRules } }
 */
export async function executeGoogleToolDirect({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch(`/jobs/run_wait_result/p/f/tools/${toolSlug}`, {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Fetch Google Ads accounts
 * @param {string} userId
 * @returns {Promise<Object>} { success, accounts[] }
 */
export async function fetchGoogleAccounts({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-google-accounts', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch Google Ads metrics
 * @param {string} userId
 * @param {string} [accountId]
 * @returns {Promise<Object>} { success, metrics[] }
 */
export async function fetchGoogleMetrics({ userId, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-google-metrics', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, accountId })
  });
}

/**
 * Fetch Google campaigns
 * @param {string} userId
 * @returns {Promise<Object>} { success, campaigns[] }
 */
export async function fetchGoogleCampaigns({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-google-campaigns', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch Google tool generation history
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[], total }
 */
export async function fetchGoogleToolHistory({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-google-tool-list', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

// ═══════════════════════════════════════════════════════════════
// META PLATFORM — Router + Engines + Tool Workers
// ═══════════════════════════════════════════════════════════════

/**
 * Execute Meta platform tool via router
 * @param {string} userId
 * @param {string} section - 'ads' | 'audience' | 'creative' | 'automation' | 'tracking' | 'agency' | 'instagram'
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @param {string} [accountId]
 * @returns {Promise<Object>} { success, data: { content, benchmarks, adCopy, automationRules, image, code } }
 */
export async function executeMetaTool({ userId, section, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-meta-platform', {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, section, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

/**
 * Execute a specific Meta tool worker directly
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data: { content, benchmarks, image, code, automationRules } }
 */
export async function executeMetaToolDirect({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch(`/jobs/run_wait_result/p/f/tools/${toolSlug}`, {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Fetch Meta ad accounts
 * @param {string} userId
 * @returns {Promise<Object>} { success, accounts[] }
 */
export async function fetchMetaAccounts({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-google-accounts', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch Meta ad metrics
 * @param {string} userId
 * @param {string} [accountId]
 * @returns {Promise<Object>} { success, metrics[] }
 */
export async function fetchMetaMetrics({ userId, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-metrics', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, accountId })
  });
}

/**
 * Fetch Meta campaigns
 * @param {string} userId
 * @returns {Promise<Object>} { success, campaigns[] }
 */
export async function fetchMetaCampaigns({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-campaigns', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch Meta tool generation history
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[], total }
 */
export async function fetchMetaToolHistory({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-tool-list', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch Meta audiences
 * @param {string} userId
 * @param {string} [accountId]
 * @returns {Promise<Object>} { success, audiences[] }
 */
export async function fetchMetaAudiences({ userId, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-audiences', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, accountId })
  });
}

/**
 * Fetch Meta creative generations
 * @param {string} userId
 * @returns {Promise<Object>} { success, creatives[], total }
 */
export async function fetchMetaCreatives({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-creatives', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch Meta account insights
 * @param {string} userId
 * @param {string} [accountId]
 * @returns {Promise<Object>} { success, insights[] }
 */
export async function fetchMetaInsights({ userId, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-insights', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, accountId })
  });
}

/**
 * Fetch Google audiences
 * @param {string} userId
 * @param {string} [accountId]
 * @returns {Promise<Object>} { success, audiences[] }
 */
export async function fetchGoogleAudiences({ userId, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-google-audiences', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, accountId })
  });
}

/**
 * Fetch Google ad creative generations
 * @param {string} userId
 * @returns {Promise<Object>} { success, creatives[], total }
 */
export async function fetchGoogleCreatives({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-google-creatives', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch Google account insights
 * @param {string} userId
 * @param {string} [accountId]
 * @returns {Promise<Object>} { success, insights[] }
 */
export async function fetchGoogleInsights({ userId, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-google-insights', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, accountId })
  });
}

// ═══════════════════════════════════════════════════════════════
// SOCIAL MEDIA PLATFORM — Router + Instagram Engine + Workers
// ═══════════════════════════════════════════════════════════════

/**
 * Execute Social Media tool via router
 * @param {string} userId
 * @param {string} section - 'instagram' | 'social-management' | 'youtube' | 'tiktok' | 'linkedin'
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @param {string} [accountId]
 * @returns {Promise<Object>} { success, data: { content, benchmarks, adCopy, automationRules, image, code, visionAnalysis, ocrResult } }
 */
export async function executeSocialTool({ userId, section, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-social-platform', {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, section, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

/**
 * Execute specific social tool directly
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeSocialToolDirect({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch(`/jobs/run_wait_result/p/f/tools/${toolSlug}`, {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Fetch social media accounts
 * @param {string} userId
 * @param {string} [platform] - 'instagram' | 'youtube' | 'tiktok' | 'linkedin'
 * @returns {Promise<Object>} { success, accounts[] }
 */
export async function fetchSocialAccounts({ userId, platform }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-platform-campaigns', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, platform: platform || 'instagram' })
  });
}

/**
 * Fetch social media metrics
 * @param {string} userId
 * @param {string} [platform]
 * @returns {Promise<Object>} { success, metrics[] }
 */
export async function fetchSocialMetrics({ userId, platform }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-analytics-export', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, platform })
  });
}

/**
 * Fetch social tool generation history
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[], total }
 */
export async function fetchSocialToolHistory({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch Instagram specific insights
 * @param {string} userId
 * @returns {Promise<Object>} { success, insights[] }
 */
export async function fetchInstagramInsights({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-insights', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch Instagram audiences
 * @param {string} userId
 * @returns {Promise<Object>} { success, audiences[] }
 */
export async function fetchInstagramAudiences({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-audiences', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch Instagram creatives
 * @param {string} userId
 * @returns {Promise<Object>} { success, creatives[] }
 */
export async function fetchInstagramCreatives({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-creatives', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch social campaigns
 * @param {string} userId
 * @param {string} [platform]
 * @returns {Promise<Object>} { success, campaigns[] }
 */
export async function fetchSocialCampaigns({ userId, platform }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-platform-campaigns', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, platform: platform || 'meta' })
  });
}

// ═══════════════════════════════════════════════════════════════
// SEO & CONTENT PLATFORM
// ═══════════════════════════════════════════════════════════════

/**
 * Execute SEO tool via router
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data: { content, benchmarks, image, code, automationRules, visionAnalysis, ocrResult } }
 */
export async function executeSeoTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch(`/jobs/run_wait_result/p/f/tools/${toolSlug}`, {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Execute SEO engine directly
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeSeoEngine({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/engine-seo-content', {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Fetch SEO tool history
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[], total }
 */
export async function fetchSeoToolHistory({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch SEO metrics/insights
 * @param {string} userId
 * @returns {Promise<Object>} { success, insights[] }
 */
export async function fetchSeoInsights({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-insights', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch SEO keywords data
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[] }
 */
export async function fetchSeoKeywords({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, toolSlug: 'keyword-research-tool' })
  });
}

/**
 * Fetch content generation history
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[] }
 */
export async function fetchContentHistory({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch SEO audit results
 * @param {string} userId
 * @returns {Promise<Object>} { success, insights[] }
 */
export async function fetchSeoAudits({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-audit-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch SEO creatives
 * @param {string} userId
 * @returns {Promise<Object>} { success, creatives[] }
 */
export async function fetchSeoCreatives({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch SEO campaigns
 * @param {string} userId
 * @returns {Promise<Object>} { success, campaigns[] }
 */
export async function fetchSeoCampaigns({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-platform-campaigns', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, platform: 'seo' })
  });
}

// ═══════════════════════════════════════════════════════════════
// AN-ANALYTICS & ROI PLATFORM
// ═══════════════════════════════════════════════════════════════

/**
 * Execute Analytics tool via router
 * @param {string} userId
 * @param {string} section - 'analytics' | 'roi'
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data: { content, benchmarks, image, code, automationRules, visionAnalysis, ocrResult } }
 */
export async function executeAnalyticsPlatformTool({ userId, section, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-analytics-platform', {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, section, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Execute specific analytics tool directly
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeAnalyticsPlatformToolDirect({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch(`/jobs/run_wait_result/p/f/tools/${toolSlug}`, {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Fetch analytics platform tool history
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[], total }
 */
export async function fetchAnalyticsPlatformHistory({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch ROI data
 * @param {string} userId
 * @returns {Promise<Object>} { success, insights[] }
 */
export async function fetchRoiData({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-insights', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch attribution data
 * @param {string} userId
 * @returns {Promise<Object>} { success, insights[] }
 */
export async function fetchAttributionData({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-insights', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch analytics platform metrics
 * @param {string} userId
 * @returns {Promise<Object>} { success, metrics[] }
 */
export async function fetchAnalyticsPlatformMetrics({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-google-metrics', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch analytics platform campaigns
 * @param {string} userId
 * @returns {Promise<Object>} { success, campaigns[] }
 */
export async function fetchAnalyticsPlatformCampaigns({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-platform-campaigns', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, platform: 'analytics' })
  });
}

/**
 * Fetch analytics platform creatives
 * @param {string} userId
 * @returns {Promise<Object>} { success, creatives[] }
 */
export async function fetchAnalyticsPlatformCreatives({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch analytics platform audiences
 * @param {string} userId
 * @returns {Promise<Object>} { success, audiences[] }
 */
export async function fetchAnalyticsPlatformAudiences({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-audiences', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

// ═══════════════════════════════════════════════════════════════
// E-COMMERCE PLATFORM — 5 Sections, 5 Engines, 5 Routers
// ═══════════════════════════════════════════════════════════════

/**
 * Execute E-commerce tool via main router
 * @param {string} userId
 * @param {string} section - 'shopify' | 'ecommerce-ads' | 'ecommerce-analytics' | 'ecommerce-automation' | 'ecommerce-strategy'
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data: { content, benchmarks, image, code, automationRules, visionAnalysis, ocrResult } }
 */
export async function executeEcommerceTool({ userId, section, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-ecommerce-platform', {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, section, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Execute specific E-commerce tool directly
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeEcommerceToolDirect({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch(`/jobs/run_wait_result/p/f/tools/${toolSlug}`, {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

// ── Shopify Section ──

/**
 * Execute Shopify tool via Shopify router
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeShopifyTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/engine-ecom-shopify', {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Fetch Shopify store data
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[] }
 */
export async function fetchShopifyData({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, toolSlug: 'shopify' })
  });
}

/**
 * Fetch Shopify tool history
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[] }
 */
export async function fetchShopifyToolHistory({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

// ── E-commerce Advertising Section ──

/**
 * Execute E-commerce Advertising tool
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeEcomAdsTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/engine-ecom-advertising', {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Fetch E-commerce ad accounts
 * @param {string} userId
 * @returns {Promise<Object>} { success, accounts[] }
 */
export async function fetchEcomAdAccounts({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-google-accounts', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch E-commerce ad campaigns
 * @param {string} userId
 * @returns {Promise<Object>} { success, campaigns[] }
 */
export async function fetchEcomAdCampaigns({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-platform-campaigns', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId, platform: 'ecommerce' })
  });
}

/**
 * Fetch E-commerce ad metrics
 * @param {string} userId
 * @returns {Promise<Object>} { success, metrics[] }
 */
export async function fetchEcomAdMetrics({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-google-metrics', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

// ── E-commerce Analytics Section ──

/**
 * Execute E-commerce Analytics tool
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeEcomAnalyticsTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/engine-ecom-analytics', {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Fetch E-commerce KPIs
 * @param {string} userId
 * @returns {Promise<Object>} { success, insights[] }
 */
export async function fetchEcomKpis({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-insights', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch E-commerce ROAS data
 * @param {string} userId
 * @returns {Promise<Object>} { success, metrics[] }
 */
export async function fetchEcomRoas({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-google-metrics', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch E-commerce conversion data
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[] }
 */
export async function fetchEcomConversions({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

// ── E-commerce Automation Section ──

/**
 * Execute E-commerce Automation tool
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeEcomAutomationTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/engine-ecom-automation', {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Fetch E-commerce automation flows
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[] }
 */
export async function fetchEcomAutomationFlows({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch E-commerce email sequences
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[] }
 */
export async function fetchEcomEmailSequences({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

// ── E-commerce Strategy Section ──

/**
 * Execute E-commerce Strategy tool
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeEcomStrategyTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/engine-ecom-strategy', {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Fetch E-commerce growth roadmap
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[] }
 */
export async function fetchEcomGrowthRoadmap({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch E-commerce pricing data
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[] }
 */
export async function fetchEcomPricingData({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch E-commerce inventory data
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[] }
 */
export async function fetchEcomInventory({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch E-commerce product data
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[] }
 */
export async function fetchEcomProducts({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch E-commerce A/B test data
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[] }
 */
export async function fetchEcomAbTests({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch all E-commerce tool history
 * @param {string} userId
 * @returns {Promise<Object>} { success, generations[], total }
 */
export async function fetchEcomToolHistory({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch E-commerce insights
 * @param {string} userId
 * @returns {Promise<Object>} { success, insights[] }
 */
export async function fetchEcomInsights({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-insights', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch E-commerce audiences
 * @param {string} userId
 * @returns {Promise<Object>} { success, audiences[] }
 */
export async function fetchEcomAudiences({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-meta-audiences', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

/**
 * Fetch E-commerce creatives
 * @param {string} userId
 * @returns {Promise<Object>} { success, creatives[] }
 */
export async function fetchEcomCreatives({ userId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-generation-history', {
    method: 'POST',
    timeout: 15000,
    body: JSON.stringify({ userId })
  });
}

// ═══════════════════════════════════════════════════════════════
// GOOGLE PLATFORM — 4 Sections, 4 Routers, 4 Engines
// ═══════════════════════════════════════════════════════════════

// ── Google Graders (21 tools) ──

/**
 * Execute Google Grader tool via router
 */
export async function executeGoogleGraderTool({ userId, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-google-graders', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

// ── Audit & Analysis (16 tools) ──

/**
 * Execute Google Audit tool via router
 */
export async function executeGoogleAuditTool({ userId, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-google-audit', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

// ── Campaign Management (18 tools) ──

/**
 * Execute Google Campaign Management tool via router
 */
export async function executeGoogleCampaignTool({ userId, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-google-campaign-mgmt', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

// ── Budget & Bidding (19 tools) ──

/**
 * Execute Google Budget & Bidding tool via router
 */
export async function executeGoogleBudgetTool({ userId, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-google-budget-bidding', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

// ═══════════════════════════════════════════════════════════════
// VERTEX AI — Google Cloud Direct
// ═══════════════════════════════════════════════════════════════

/**
 * Execute Vertex AI analysis — Google Cloud Gemini + all 8 AI Router models
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @param {string} [action] - 'analyze' | 'predict' | 'optimize' | 'generate'
 * @returns {Promise<Object>} { success, data: { vertexResult, content, benchmarks, image, code, automationRules, visionAnalysis, ocrResult } }
 */
export async function executeVertexAi({ userId, toolSlug, toolName, input, additionalInputs, action }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-vertex-ai', {
    method: 'POST',
    timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs, action })
  });
}

// ═══════════════════════════════════════════════════════════════
// META PLATFORM — 6 Sections, 6 Routers, 6 Engines
// ═══════════════════════════════════════════════════════════════

/**
 * Execute Meta Ads Management tool
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @param {string} [accountId]
 * @returns {Promise<Object>} { success, data: { content, benchmarks, image, code, automationRules, visionAnalysis, ocrResult, summary } }
 */
export async function executeMetaAdsTool({ userId, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-meta-ads-management', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

/**
 * Execute Meta Audience & Targeting tool
 */
export async function executeMetaAudienceTool({ userId, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-meta-audience-targeting', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

/**
 * Execute Meta Creative & Copy tool
 */
export async function executeMetaCreativeTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-meta-creative-copy', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Execute Meta Automation & Optimization tool
 */
export async function executeMetaAutomationTool({ userId, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-meta-automation-optimization', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

/**
 * Execute Meta Tracking & Analytics tool
 */
export async function executeMetaTrackingTool({ userId, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-meta-tracking-analytics', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

/**
 * Execute Meta Agency tool
 */
export async function executeMetaAgencyTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-meta-agency-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

// ═══════════════════════════════════════════════════════════════
// SOCIAL MEDIA PLATFORM — 3 Sections, 3 Routers, 3 Engines
// ═══════════════════════════════════════════════════════════════

/**
 * Execute Instagram tool via router
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @param {string} [accountId]
 * @returns {Promise<Object>} { success, data: { content, benchmarks, image, code, automationRules, visionAnalysis, ocrResult, summary } }
 */
export async function executeInstagramTool({ userId, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-social-instagram', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

/**
 * Execute Social Media Management tool via router
 */
export async function executeSocialManagementTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-social-social-management', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Execute YouTube tool via router
 */
export async function executeYoutubeTool({ userId, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-social-youtube', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

// ═══════════════════════════════════════════════════════════════
// SEO PLATFORM — 2 Sections, 2 Routers, 2 Engines
// ═══════════════════════════════════════════════════════════════

/**
 * Execute SEO Optimization tool via router
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data: { content, benchmarks, image, code, automationRules, visionAnalysis, ocrResult, summary } }
 */
export async function executeSeoOptimizationTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-seo-seo-optimization', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Execute Content Writing tool via router
 */
export async function executeContentWritingTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-seo-content-writing', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

// ═══════════════════════════════════════════════════════════════
// AN-ANALYTICS PLATFORM — 2 Sections, 2 Routers, 2 Engines
// ═══════════════════════════════════════════════════════════════

/**
 * Execute Analytics & Insights tool via router
 */
export async function executeAnalyticsInsightsTool({ userId, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-analytics-analytics-insights', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

/**
 * Execute ROI & Attribution tool via router
 */
export async function executeRoiAttributionTool({ userId, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-analytics-roi-attribution', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

// ═══════════════════════════════════════════════════════════════
// E-COMMERCE PLATFORM — 5 Sections, 5 Routers, 5 Engines
// ═══════════════════════════════════════════════════════════════

// ── Section 1: Shopify Tools (8 tools) ──

/**
 * Execute Shopify tool via router
 * @param {string} userId
 * @param {string} toolSlug - shopify-store-audit, shopify-seo-optimizer, etc.
 * @param {string} toolName
 * @param {string} input - Store URL or description
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data: { content, benchmarks, image, code, automationRules, visionAnalysis, ocrResult, summary } }
 */
export async function executeShopifyToolV2({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-ecom-shopify', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Execute Shopify Store Audit
 */
export async function runShopifyStoreAudit({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/shopify-store-audit', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'shopify-store-audit', toolName: 'Shopify Store Audit', input, additionalInputs })
  });
}

/**
 * Execute Shopify SEO Optimizer
 */
export async function runShopifySeoOptimizer({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/shopify-seo-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'shopify-seo-optimizer', toolName: 'Shopify SEO Optimizer', input, additionalInputs })
  });
}

// ── Section 2: E-commerce Advertising (9 tools) ──

/**
 * Execute E-commerce Advertising tool via router
 * @param {string} userId
 * @param {string} toolSlug - google-shopping-optimizer, performance-max-campaign-manager, etc.
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @param {string} [accountId]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeEcomAdvertisingTool({ userId, toolSlug, toolName, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-ecom-advertising', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs, accountId })
  });
}

/**
 * Execute Google Shopping Optimizer
 */
export async function runGoogleShoppingOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/google-shopping-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'google-shopping-optimizer', toolName: 'Google Shopping Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Execute Amazon PPC Optimizer
 */
export async function runAmazonPpcOptimizer({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/amazon-ppc-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'amazon-ppc-optimizer', toolName: 'Amazon PPC Optimizer', input, additionalInputs })
  });
}

// ── Section 3: E-commerce Analytics (10 tools) ──

/**
 * Execute E-commerce Analytics tool via router
 * @param {string} userId
 * @param {string} toolSlug - ecommerce-kpi-dashboard, roas-analyzer, etc.
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeEcomAnalyticsToolV2({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-ecom-analytics', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Execute E-commerce KPI Dashboard
 */
export async function runEcomKpiDashboard({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ecommerce-kpi-dashboard', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ecommerce-kpi-dashboard', toolName: 'Ecommerce KPI Dashboard', input, additionalInputs })
  });
}

/**
 * Execute ROAS Analyzer
 */
export async function runRoasAnalyzer({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/roas-analyzer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'roas-analyzer', toolName: 'ROAS Analyzer', input, additionalInputs })
  });
}

/**
 * Execute Cart Abandonment Analyzer
 */
export async function runCartAbandonmentAnalyzer({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/cart-abandonment-analyzer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'cart-abandonment-analyzer', toolName: 'Cart Abandonment Analyzer', input, additionalInputs })
  });
}

// ── Section 4: E-commerce Automation (9 tools) ──

/**
 * Execute E-commerce Automation tool via router
 * @param {string} userId
 * @param {string} toolSlug - welcome-series-generator, loyalty-vip-rewards-designer, etc.
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeEcomAutomationToolV2({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-ecom-automation', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Execute Welcome Series Generator
 */
export async function runWelcomeSeriesGenerator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/welcome-series-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'welcome-series-generator', toolName: 'Welcome Series Generator', input, additionalInputs })
  });
}

/**
 * Execute Loyalty VIP Rewards Designer
 */
export async function runLoyaltyRewardsDesigner({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/loyalty-vip-rewards-designer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'loyalty-vip-rewards-designer', toolName: 'Loyalty VIP Rewards Designer', input, additionalInputs })
  });
}

// ── Section 5: E-commerce Strategy (17 tools) ──

/**
 * Execute E-commerce Strategy tool via router
 * @param {string} userId
 * @param {string} toolSlug - dynamic-pricing-optimizer, ecommerce-growth-roadmap-generator, etc.
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeEcomStrategyToolV2({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-ecom-strategy', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Execute Dynamic Pricing Optimizer
 */
export async function runDynamicPricingOptimizer({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/dynamic-pricing-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'dynamic-pricing-optimizer', toolName: 'Dynamic Pricing Optimizer', input, additionalInputs })
  });
}

/**
 * Execute E-commerce Growth Roadmap Generator
 */
export async function runEcomGrowthRoadmapGenerator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ecommerce-growth-roadmap-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ecommerce-growth-roadmap-generator', toolName: 'Ecommerce Growth Roadmap Generator', input, additionalInputs })
  });
}

/**
 * Execute Product Feed Optimizer
 */
export async function runProductFeedOptimizer({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/product-feed-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'product-feed-optimizer', toolName: 'Product Feed Optimizer', input, additionalInputs })
  });
}

/**
 * Execute Predictive Inventory Manager
 */
export async function runPredictiveInventoryManager({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/predictive-inventory-manager', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'predictive-inventory-manager', toolName: 'Predictive Inventory Manager', input, additionalInputs })
  });
}

/**
 * Execute Platform Expansion Planner
 */
export async function runPlatformExpansionPlanner({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/platform-expansion-planner', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'platform-expansion-planner', toolName: 'Platform Expansion Planner', input, additionalInputs })
  });
}

// ═══════════════════════════════════════════════════════════════
// AI TOOLS PLATFORM — 5 Sections, 5 Routers, 5 Engines, 62 Tools
// ═══════════════════════════════════════════════════════════════

// ── Section Routers ──

/**
 * Execute AI Agent tool via router
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeAiAgentTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-aitools-ai-agents', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Execute AI Marketing & Advertising tool via router
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeAiMarketingTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-aitools-ai-marketing-advertising', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Execute AI Text & Content Editing tool via router
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeAiTextTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-aitools-ai-text-content', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Execute AI Developer & Automation tool via router
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeAiDeveloperTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-aitools-ai-developer-automation', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

/**
 * Execute AI Email, Graders & More tool via router
 * @param {string} userId
 * @param {string} toolSlug
 * @param {string} toolName
 * @param {string} input
 * @param {Object} [additionalInputs]
 * @returns {Promise<Object>} { success, data }
 */
export async function executeAiEmailGraderTool({ userId, toolSlug, toolName, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/router-aitools-ai-email-graders', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug, toolName, input, additionalInputs })
  });
}

// ── Direct Tool Functions (every tool) ──

/**
 * Ad Copy Analyzer
 */
export async function runAdCopyAnalyzer({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ad-copy-analyzer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ad-copy-analyzer', toolName: 'Ad Copy Analyzer', input, additionalInputs })
  });
}

/**
 * Ad Copy Sentiment Analyzer
 */
export async function runAdCopySentimentAnalyzer({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ad-copy-sentiment-analyzer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ad-copy-sentiment-analyzer', toolName: 'Ad Copy Sentiment Analyzer', input, additionalInputs })
  });
}

/**
 * Ad Fatigue Detector
 */
export async function runAdFatigueDetector({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ad-fatigue-detector', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ad-fatigue-detector', toolName: 'Ad Fatigue Detector', input, additionalInputs })
  });
}

/**
 * Ad Testing Tools
 */
export async function runAdTestingTools({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ad-testing-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ad-testing-tools', toolName: 'Ad Testing Tools', input, additionalInputs })
  });
}

/**
 * Ads Launcher
 */
export async function runAdsLauncher({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ads-launcher', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ads-launcher', toolName: 'Ads Launcher', input, additionalInputs })
  });
}

/**
 * Ads Rotation Agent
 */
export async function runAdsRotationAgent({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ads-rotation-agent', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ads-rotation-agent', toolName: 'Ads Rotation Agent', input, additionalInputs })
  });
}

/**
 * Advanced Ad Analyzer
 */
export async function runAdvancedAdAnalyzer({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/advanced-ad-analyzer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'advanced-ad-analyzer', toolName: 'Advanced Ad Analyzer', input, additionalInputs })
  });
}

/**
 * Affiliate Marketing Copy
 */
export async function runAffiliateMarketingCopy({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/affiliate-marketing-copy', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'affiliate-marketing-copy', toolName: 'Affiliate Marketing Copy', input, additionalInputs })
  });
}

/**
 * Ai Ad Management Tools
 */
export async function runAiAdManagementTools({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ai-ad-management-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ai-ad-management-tools', toolName: 'Ai Ad Management Tools', input, additionalInputs })
  });
}

/**
 * Ai Ads Generator
 */
export async function runAiAdsGenerator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ai-ads-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ai-ads-generator', toolName: 'Ai Ads Generator', input, additionalInputs })
  });
}

/**
 * Ai Advertising Suite
 */
export async function runAiAdvertisingSuite({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ai-advertising-suite', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ai-advertising-suite', toolName: 'Ai Advertising Suite', input, additionalInputs })
  });
}

/**
 * Ai Media Buyer
 */
export async function runAiMediaBuyer({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ai-media-buyer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ai-media-buyer', toolName: 'Ai Media Buyer', input, additionalInputs })
  });
}

/**
 * Ai Performance Marketer
 */
export async function runAiPerformanceMarketer({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ai-performance-marketer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ai-performance-marketer', toolName: 'Ai Performance Marketer', input, additionalInputs })
  });
}

/**
 * Ai Task Prioritizer
 */
export async function runAiTaskPrioritizer({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ai-task-prioritizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ai-task-prioritizer', toolName: 'Ai Task Prioritizer', input, additionalInputs })
  });
}

/**
 * Api Documentation Generator
 */
export async function runApiDocumentationGenerator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/api-documentation-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'api-documentation-generator', toolName: 'Api Documentation Generator', input, additionalInputs })
  });
}

/**
 * Automated Ad Launch Tool
 */
export async function runAutomatedAdLaunchTool({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/automated-ad-launch-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'automated-ad-launch-tool', toolName: 'Automated Ad Launch Tool', input, additionalInputs })
  });
}

/**
 * Autonomous Marketing Manager
 */
export async function runAutonomousMarketingManager({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/autonomous-marketing-manager', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'autonomous-marketing-manager', toolName: 'Autonomous Marketing Manager', input, additionalInputs })
  });
}

/**
 * Brand Identity Builder
 */
export async function runBrandIdentityBuilder({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/brand-identity-builder', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'brand-identity-builder', toolName: 'Brand Identity Builder', input, additionalInputs })
  });
}

/**
 * Brand Voice Generator
 */
export async function runBrandVoiceGenerator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/brand-voice-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'brand-voice-generator', toolName: 'Brand Voice Generator', input, additionalInputs })
  });
}

/**
 * Code Comments Generator
 */
export async function runCodeCommentsGenerator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/code-comments-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'code-comments-generator', toolName: 'Code Comments Generator', input, additionalInputs })
  });
}

/**
 * Cold Outreach Email
 */
export async function runColdOutreachEmail({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/cold-outreach-email', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'cold-outreach-email', toolName: 'Cold Outreach Email', input, additionalInputs })
  });
}

/**
 * Comparison Chart Creator
 */
export async function runComparisonChartCreator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/comparison-chart-creator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'comparison-chart-creator', toolName: 'Comparison Chart Creator', input, additionalInputs })
  });
}

/**
 * Content Rewriter
 */
export async function runContentRewriter({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/content-rewriter', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'content-rewriter', toolName: 'Content Rewriter', input, additionalInputs })
  });
}

/**
 * Copy Generator
 */
export async function runCopyGenerator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/copy-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'copy-generator', toolName: 'Copy Generator', input, additionalInputs })
  });
}

/**
 * Cta Writer
 */
export async function runCtaWriter({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/cta-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'cta-writer', toolName: 'Cta Writer', input, additionalInputs })
  });
}

/**
 * Email Writer
 */
export async function runEmailWriter({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/email-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'email-writer', toolName: 'Email Writer', input, additionalInputs })
  });
}

/**
 * Exam Prep Content
 */
export async function runExamPrepContent({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/exam-prep-content', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'exam-prep-content', toolName: 'Exam Prep Content', input, additionalInputs })
  });
}

/**
 * Explainer Generator
 */
export async function runExplainerGenerator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/explainer-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'explainer-generator', toolName: 'Explainer Generator', input, additionalInputs })
  });
}

/**
 * Intelligent Automation Platform
 */
export async function runIntelligentAutomationPlatform({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/intelligent-automation-platform', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'intelligent-automation-platform', toolName: 'Intelligent Automation Platform', input, additionalInputs })
  });
}

/**
 * Lead Magnet Creator
 */
export async function runLeadMagnetCreator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/lead-magnet-creator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'lead-magnet-creator', toolName: 'Lead Magnet Creator', input, additionalInputs })
  });
}

/**
 * Market Research Summary
 */
export async function runMarketResearchSummary({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/market-research-summary', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'market-research-summary', toolName: 'Market Research Summary', input, additionalInputs })
  });
}

/**
 * Marketing Ai Agents Hub
 */
export async function runMarketingAiAgentsHub({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/marketing-ai-agents-hub', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'marketing-ai-agents-hub', toolName: 'Marketing Ai Agents Hub', input, additionalInputs })
  });
}

/**
 * Marketing Asset Library
 */
export async function runMarketingAssetLibrary({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/marketing-asset-library', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'marketing-asset-library', toolName: 'Marketing Asset Library', input, additionalInputs })
  });
}

/**
 * Marketing Copy Generator
 */
export async function runMarketingCopyGenerator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/marketing-copy-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'marketing-copy-generator', toolName: 'Marketing Copy Generator', input, additionalInputs })
  });
}

/**
 * Marketing Efficiency Software
 */
export async function runMarketingEfficiencySoftware({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/marketing-efficiency-software', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'marketing-efficiency-software', toolName: 'Marketing Efficiency Software', input, additionalInputs })
  });
}

/**
 * Marketing Proposal Generator
 */
export async function runMarketingProposalGenerator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/marketing-proposal-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'marketing-proposal-generator', toolName: 'Marketing Proposal Generator', input, additionalInputs })
  });
}

/**
 * Marketing Software Hub
 */
export async function runMarketingSoftwareHub({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/marketing-software-hub', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'marketing-software-hub', toolName: 'Marketing Software Hub', input, additionalInputs })
  });
}

/**
 * Marketing Team Collaboration
 */
export async function runMarketingTeamCollaboration({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/marketing-team-collaboration', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'marketing-team-collaboration', toolName: 'Marketing Team Collaboration', input, additionalInputs })
  });
}

/**
 * Optimization Software Suite
 */
export async function runOptimizationSoftwareSuite({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/optimization-software-suite', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'optimization-software-suite', toolName: 'Optimization Software Suite', input, additionalInputs })
  });
}

/**
 * Paragraph Expander
 */
export async function runParagraphExpander({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/paragraph-expander', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'paragraph-expander', toolName: 'Paragraph Expander', input, additionalInputs })
  });
}

/**
 * Paragraph Improver
 */
export async function runParagraphImprover({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/paragraph-improver', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'paragraph-improver', toolName: 'Paragraph Improver', input, additionalInputs })
  });
}

/**
 * Paragraph Rewriter
 */
export async function runParagraphRewriter({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/paragraph-rewriter', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'paragraph-rewriter', toolName: 'Paragraph Rewriter', input, additionalInputs })
  });
}

/**
 * Paragraph Shortener
 */
export async function runParagraphShortener({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/paragraph-shortener', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'paragraph-shortener', toolName: 'Paragraph Shortener', input, additionalInputs })
  });
}

/**
 * Paragraph Simplifier
 */
export async function runParagraphSimplifier({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/paragraph-simplifier', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'paragraph-simplifier', toolName: 'Paragraph Simplifier', input, additionalInputs })
  });
}

/**
 * Pinterest Ad Generator
 */
export async function runPinterestAdGenerator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/pinterest-ad-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'pinterest-ad-generator', toolName: 'Pinterest Ad Generator', input, additionalInputs })
  });
}

/**
 * Product Description Writer
 */
export async function runProductDescriptionWriter({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/product-description-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'product-description-writer', toolName: 'Product Description Writer', input, additionalInputs })
  });
}

/**
 * Product Launch Email Sequence
 */
export async function runProductLaunchEmailSequence({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/product-launch-email-sequence', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'product-launch-email-sequence', toolName: 'Product Launch Email Sequence', input, additionalInputs })
  });
}

/**
 * Sales Page Copy Writer
 */
export async function runSalesPageCopyWriter({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/sales-page-copy-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'sales-page-copy-writer', toolName: 'Sales Page Copy Writer', input, additionalInputs })
  });
}

/**
 * Sentence Expander
 */
export async function runSentenceExpander({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/sentence-expander', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'sentence-expander', toolName: 'Sentence Expander', input, additionalInputs })
  });
}

/**
 * Sentence Rewriter
 */
export async function runSentenceRewriter({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/sentence-rewriter', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'sentence-rewriter', toolName: 'Sentence Rewriter', input, additionalInputs })
  });
}

/**
 * Sentence Shortener
 */
export async function runSentenceShortener({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/sentence-shortener', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'sentence-shortener', toolName: 'Sentence Shortener', input, additionalInputs })
  });
}

/**
 * Sentence Simplifier
 */
export async function runSentenceSimplifier({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/sentence-simplifier', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'sentence-simplifier', toolName: 'Sentence Simplifier', input, additionalInputs })
  });
}

/**
 * Study Notes Generator
 */
export async function runStudyNotesGenerator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/study-notes-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'study-notes-generator', toolName: 'Study Notes Generator', input, additionalInputs })
  });
}

/**
 * Technical Explanation Writer
 */
export async function runTechnicalExplanationWriter({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/technical-explanation-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'technical-explanation-writer', toolName: 'Technical Explanation Writer', input, additionalInputs })
  });
}

/**
 * Testimonial Generator
 */
export async function runTestimonialGenerator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/testimonial-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'testimonial-generator', toolName: 'Testimonial Generator', input, additionalInputs })
  });
}

/**
 * Twitter Thread Generator
 */
export async function runTwitterThreadGenerator({ userId, input, additionalInputs }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/twitter-thread-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'twitter-thread-generator', toolName: 'Twitter Thread Generator', input, additionalInputs })
  });
}

// ═══════════════════════════════════════════════════════════════
// E-COMMERCE — ALL 53 Direct Tool JS Functions
// ═══════════════════════════════════════════════════════════════

/**
 * Cart Recovery Ads
 */
export async function runCartRecoveryAds({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/cart-recovery-ads', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'cart-recovery-ads', toolName: 'Cart Recovery Ads', input, additionalInputs, accountId })
  });
}

/**
 * Cross Sell Ad Generator
 */
export async function runCrossSellAdGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/cross-sell-ad-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'cross-sell-ad-generator', toolName: 'Cross Sell Ad Generator', input, additionalInputs, accountId })
  });
}

/**
 * Dynamic Product Ads
 */
export async function runDynamicProductAds({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/dynamic-product-ads', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'dynamic-product-ads', toolName: 'Dynamic Product Ads', input, additionalInputs, accountId })
  });
}

/**
 * Ecommerce Ad Platform
 */
export async function runEcommerceAdPlatform({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ecommerce-ad-platform', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ecommerce-ad-platform', toolName: 'Ecommerce Ad Platform', input, additionalInputs, accountId })
  });
}

/**
 * Inventory Based Ad Manager
 */
export async function runInventoryBasedAdManager({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/inventory-based-ad-manager', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'inventory-based-ad-manager', toolName: 'Inventory Based Ad Manager', input, additionalInputs, accountId })
  });
}


/**
 * Product Performance Tracker
 */
export async function runProductPerformanceTracker({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/product-performance-tracker', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'product-performance-tracker', toolName: 'Product Performance Tracker', input, additionalInputs, accountId })
  });
}

/**
 * Product Recommendation Engine
 */
export async function runProductRecommendationEngine({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/product-recommendation-engine', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'product-recommendation-engine', toolName: 'Product Recommendation Engine', input, additionalInputs, accountId })
  });
}

/**
 * Seasonal Ecommerce Planner
 */
export async function runSeasonalEcommercePlanner({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/seasonal-ecommerce-planner', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'seasonal-ecommerce-planner', toolName: 'Seasonal Ecommerce Planner', input, additionalInputs, accountId })
  });
}

/**
 * Shopify Marketing Tools
 */
export async function runShopifyMarketingTools({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/shopify-marketing-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'shopify-marketing-tools', toolName: 'Shopify Marketing Tools', input, additionalInputs, accountId })
  });
}

/**
 * Ecommerce KPI Dashboard
 */
export async function runEcommerceKpiDashboard({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ecommerce-kpi-dashboard', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ecommerce-kpi-dashboard', toolName: 'Ecommerce KPI Dashboard', input, additionalInputs, accountId })
  });
}

/**
 * Conversion Rate Optimizer
 */
export async function runConversionRateOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/conversion-rate-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'conversion-rate-optimizer', toolName: 'Conversion Rate Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Customer Lifetime Value Calculator
 */
export async function runCustomerLifetimeValueCalculator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/customer-lifetime-value-calculator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'customer-lifetime-value-calculator', toolName: 'Customer Lifetime Value Calculator', input, additionalInputs, accountId })
  });
}


/**
 * Marketing Efficiency Ratio Tracker
 */
export async function runMarketingEfficiencyRatioTracker({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/marketing-efficiency-ratio-tracker', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'marketing-efficiency-ratio-tracker', toolName: 'Marketing Efficiency Ratio Tracker', input, additionalInputs, accountId })
  });
}


/**
 * Customer Acquisition Cost Optimizer
 */
export async function runCustomerAcquisitionCostOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/customer-acquisition-cost-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'customer-acquisition-cost-optimizer', toolName: 'Customer Acquisition Cost Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Attribution Window Optimizer
 */
export async function runAttributionWindowOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/attribution-window-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'attribution-window-optimizer', toolName: 'Attribution Window Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Ecommerce Reporting Automator
 */
export async function runEcommerceReportingAutomator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ecommerce-reporting-automator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ecommerce-reporting-automator', toolName: 'Ecommerce Reporting Automator', input, additionalInputs, accountId })
  });
}

/**
 * Gross Margin Analyzer
 */
export async function runGrossMarginAnalyzer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/gross-margin-analyzer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'gross-margin-analyzer', toolName: 'Gross Margin Analyzer', input, additionalInputs, accountId })
  });
}


/**
 * Post-Purchase Follow-Up Builder
 */
export async function runPostPurchaseFollowUpBuilder({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/post-purchase-follow-up-builder', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'post-purchase-follow-up-builder', toolName: 'Post-Purchase Follow-Up Builder', input, additionalInputs, accountId })
  });
}

/**
 * Customer Winback Flow Creator
 */
export async function runCustomerWinbackFlowCreator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/customer-winback-flow-creator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'customer-winback-flow-creator', toolName: 'Customer Winback Flow Creator', input, additionalInputs, accountId })
  });
}

/**
 * Loyalty VIP Rewards Designer
 */
export async function runLoyaltyVipRewardsDesigner({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/loyalty-vip-rewards-designer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'loyalty-vip-rewards-designer', toolName: 'Loyalty VIP Rewards Designer', input, additionalInputs, accountId })
  });
}

/**
 * Replenishment Reminder Engine
 */
export async function runReplenishmentReminderEngine({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/replenishment-reminder-engine', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'replenishment-reminder-engine', toolName: 'Replenishment Reminder Engine', input, additionalInputs, accountId })
  });
}

/**
 * Milestone Email Automator
 */
export async function runMilestoneEmailAutomator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/milestone-email-automator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'milestone-email-automator', toolName: 'Milestone Email Automator', input, additionalInputs, accountId })
  });
}

/**
 * Cross-Sell Upsell Flow Builder
 */
export async function runCrossSellUpsellFlowBuilder({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/cross-sell-upsell-flow-builder', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'cross-sell-upsell-flow-builder', toolName: 'Cross-Sell Upsell Flow Builder', input, additionalInputs, accountId })
  });
}

/**
 * Ecommerce Workflow Automator
 */
export async function runEcommerceWorkflowAutomator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ecommerce-workflow-automator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ecommerce-workflow-automator', toolName: 'Ecommerce Workflow Automator', input, additionalInputs, accountId })
  });
}

/**
 * Omnichannel Campaign Orchestrator
 */
export async function runOmnichannelCampaignOrchestrator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/omnichannel-campaign-orchestrator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'omnichannel-campaign-orchestrator', toolName: 'Omnichannel Campaign Orchestrator', input, additionalInputs, accountId })
  });
}

/**
 * Advantage Plus Campaign Builder
 */
export async function runAdvantagePlusCampaignBuilder({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/advantage-plus-campaign-builder', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'advantage-plus-campaign-builder', toolName: 'Advantage Plus Campaign Builder', input, additionalInputs, accountId })
  });
}


/**
 * TikTok Ecommerce Ad Creator
 */
export async function runTiktokEcommerceAdCreator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/tiktok-ecommerce-ad-creator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'tiktok-ecommerce-ad-creator', toolName: 'TikTok Ecommerce Ad Creator', input, additionalInputs, accountId })
  });
}

/**
 * Performance Max Campaign Manager
 */
export async function runPerformanceMaxCampaignManager({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/performance-max-campaign-manager', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'performance-max-campaign-manager', toolName: 'Performance Max Campaign Manager', input, additionalInputs, accountId })
  });
}

/**
 * Ad Budget Allocator
 */
export async function runAdBudgetAllocator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ad-budget-allocator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ad-budget-allocator', toolName: 'Ad Budget Allocator', input, additionalInputs, accountId })
  });
}

/**
 * Retargeting Funnel Builder
 */
export async function runRetargetingFunnelBuilder({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/retargeting-funnel-builder', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'retargeting-funnel-builder', toolName: 'Retargeting Funnel Builder', input, additionalInputs, accountId })
  });
}

/**
 * Social Commerce Ad Launcher
 */
export async function runSocialCommerceAdLauncher({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/social-commerce-ad-launcher', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'social-commerce-ad-launcher', toolName: 'Social Commerce Ad Launcher', input, additionalInputs, accountId })
  });
}


/**
 * Creative Fatigue Detector
 */
export async function runCreativeFatigueDetector({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/creative-fatigue-detector', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'creative-fatigue-detector', toolName: 'Creative Fatigue Detector', input, additionalInputs, accountId })
  });
}


/**
 * Shopify Email Flow Builder
 */
export async function runShopifyEmailFlowBuilder({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/shopify-email-flow-builder', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'shopify-email-flow-builder', toolName: 'Shopify Email Flow Builder', input, additionalInputs, accountId })
  });
}

/**
 * Shopify Theme Conversion Optimizer
 */
export async function runShopifyThemeConversionOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/shopify-theme-conversion-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'shopify-theme-conversion-optimizer', toolName: 'Shopify Theme Conversion Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Shopify Product Page Enhancer
 */
export async function runShopifyProductPageEnhancer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/shopify-product-page-enhancer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'shopify-product-page-enhancer', toolName: 'Shopify Product Page Enhancer', input, additionalInputs, accountId })
  });
}

/**
 * Shopify Upsell Strategy Generator
 */
export async function runShopifyUpsellStrategyGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/shopify-upsell-strategy-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'shopify-upsell-strategy-generator', toolName: 'Shopify Upsell Strategy Generator', input, additionalInputs, accountId })
  });
}

/**
 * Shopify Trust Badge Optimizer
 */
export async function runShopifyTrustBadgeOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/shopify-trust-badge-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'shopify-trust-badge-optimizer', toolName: 'Shopify Trust Badge Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Shopify App Stack Advisor
 */
export async function runShopifyAppStackAdvisor({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/shopify-app-stack-advisor', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'shopify-app-stack-advisor', toolName: 'Shopify App Stack Advisor', input, additionalInputs, accountId })
  });
}



/**
 * Ecommerce Chatbot Builder
 */
export async function runEcommerceChatbotBuilder({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ecommerce-chatbot-builder', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ecommerce-chatbot-builder', toolName: 'Ecommerce Chatbot Builder', input, additionalInputs, accountId })
  });
}

/**
 * Ecommerce Growth Roadmap Generator
 */
export async function runEcommerceGrowthRoadmapGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ecommerce-growth-roadmap-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ecommerce-growth-roadmap-generator', toolName: 'Ecommerce Growth Roadmap Generator', input, additionalInputs, accountId })
  });
}


/**
 * Ecommerce A/B Test Planner
 */
export async function runEcommerceAbTestPlanner({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ecommerce-ab-test-planner', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ecommerce-ab-test-planner', toolName: 'Ecommerce A/B Test Planner', input, additionalInputs, accountId })
  });
}

/**
 * Voice Search Product Optimizer
 */
export async function runVoiceSearchProductOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/voice-search-product-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'voice-search-product-optimizer', toolName: 'Voice Search Product Optimizer', input, additionalInputs, accountId })
  });
}

// ═══════════════════════════════════════════════════════════════
// GOOGLE — ALL 79 Direct Tool JS Functions
// ═══════════════════════════════════════════════════════════════

/**
 * Ad Audit Tool
 */
export async function runAdAuditTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ad-audit-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ad-audit-tool', toolName: 'Ad Audit Tool', input, additionalInputs, accountId })
  });
}

/**
 * Ad Group Audit
 */
export async function runAdGroupAudit({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ad-group-audit', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ad-group-audit', toolName: 'Ad Group Audit', input, additionalInputs, accountId })
  });
}

/**
 * Ai Campaign Manager
 */
export async function runAiCampaignManager({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ai-campaign-manager', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ai-campaign-manager', toolName: 'Ai Campaign Manager', input, additionalInputs, accountId })
  });
}

/**
 * Audience Optimization Tool
 */
export async function runAudienceOptimizationTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/audience-optimization-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'audience-optimization-tool', toolName: 'Audience Optimization Tool', input, additionalInputs, accountId })
  });
}

/**
 * Auto Scaling Budget Tool
 */
export async function runAutoScalingBudgetTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/auto-scaling-budget-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'auto-scaling-budget-tool', toolName: 'Auto Scaling Budget Tool', input, additionalInputs, accountId })
  });
}

/**
 * Bid Optimization Engine
 */
export async function runBidOptimizationEngine({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/bid-optimization-engine', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'bid-optimization-engine', toolName: 'Bid Optimization Engine', input, additionalInputs, accountId })
  });
}

/**
 * Bid Suggestions Tool
 */
export async function runBidSuggestionsTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/bid-suggestions-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'bid-suggestions-tool', toolName: 'Bid Suggestions Tool', input, additionalInputs, accountId })
  });
}

/**
 * Budget Manager
 */
export async function runBudgetManager({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/budget-manager', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'budget-manager', toolName: 'Budget Manager', input, additionalInputs, accountId })
  });
}

/**
 * Budget Performance Analyzer
 */
export async function runBudgetPerformanceAnalyzer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/budget-performance-analyzer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'budget-performance-analyzer', toolName: 'Budget Performance Analyzer', input, additionalInputs, accountId })
  });
}

/**
 * Campaign Ab Test Manager
 */
export async function runCampaignAbTestManager({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/campaign-ab-test-manager', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'campaign-ab-test-manager', toolName: 'Campaign Ab Test Manager', input, additionalInputs, accountId })
  });
}

/**
 * Campaign Audit Tool
 */
export async function runCampaignAuditTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/campaign-audit-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'campaign-audit-tool', toolName: 'Campaign Audit Tool', input, additionalInputs, accountId })
  });
}

/**
 * Campaign Auto Optimizer
 */
export async function runCampaignAutoOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/campaign-auto-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'campaign-auto-optimizer', toolName: 'Campaign Auto Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Campaign Budget Allocator
 */
export async function runCampaignBudgetAllocator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/campaign-budget-allocator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'campaign-budget-allocator', toolName: 'Campaign Budget Allocator', input, additionalInputs, accountId })
  });
}

/**
 * Campaign Cloner Pro
 */
export async function runCampaignClonerPro({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/campaign-cloner-pro', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'campaign-cloner-pro', toolName: 'Campaign Cloner Pro', input, additionalInputs, accountId })
  });
}

/**
 * Campaign Compliance Checker
 */
export async function runCampaignComplianceChecker({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/campaign-compliance-checker', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'campaign-compliance-checker', toolName: 'Campaign Compliance Checker', input, additionalInputs, accountId })
  });
}

/**
 * Campaign Health Monitor
 */
export async function runCampaignHealthMonitor({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/campaign-health-monitor', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'campaign-health-monitor', toolName: 'Campaign Health Monitor', input, additionalInputs, accountId })
  });
}

/**
 * Campaign Optimization Engine
 */
export async function runCampaignOptimizationEngine({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/campaign-optimization-engine', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'campaign-optimization-engine', toolName: 'Campaign Optimization Engine', input, additionalInputs, accountId })
  });
}

/**
 * Campaign Performance Predictor
 */
export async function runCampaignPerformancePredictor({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/campaign-performance-predictor', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'campaign-performance-predictor', toolName: 'Campaign Performance Predictor', input, additionalInputs, accountId })
  });
}

/**
 * Campaign Scaling Assistant
 */
export async function runCampaignScalingAssistant({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/campaign-scaling-assistant', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'campaign-scaling-assistant', toolName: 'Campaign Scaling Assistant', input, additionalInputs, accountId })
  });
}

/**
 * Campaign Template Library
 */
export async function runCampaignTemplateLibrary({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/campaign-template-library', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'campaign-template-library', toolName: 'Campaign Template Library', input, additionalInputs, accountId })
  });
}

/**
 * Campaign Tools Suite
 */
export async function runCampaignToolsSuite({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/campaign-tools-suite', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'campaign-tools-suite', toolName: 'Campaign Tools Suite', input, additionalInputs, accountId })
  });
}

/**
 * Ctr Predictor
 */
export async function runCtrPredictor({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ctr-predictor', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ctr-predictor', toolName: 'Ctr Predictor', input, additionalInputs, accountId })
  });
}

/**
 * Dayparting Optimizer
 */
export async function runDaypartingOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/dayparting-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'dayparting-optimizer', toolName: 'Dayparting Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Device Optimization
 */
export async function runDeviceOptimization({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/device-optimization', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'device-optimization', toolName: 'Device Optimization', input, additionalInputs, accountId })
  });
}

/**
 * Facebook Ads Performance Grader
 */
export async function runFacebookAdsPerformanceGrader({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/facebook-ads-performance-grader', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'facebook-ads-performance-grader', toolName: 'Facebook Ads Performance Grader', input, additionalInputs, accountId })
  });
}

/**
 * Geo Targeting Optimizer
 */
export async function runGeoTargetingOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/geo-targeting-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'geo-targeting-optimizer', toolName: 'Geo Targeting Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Google Ads Budget Calculator
 */
export async function runGoogleAdsBudgetCalculator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/google-ads-budget-calculator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'google-ads-budget-calculator', toolName: 'Google Ads Budget Calculator', input, additionalInputs, accountId })
  });
}

/**
 * Google Ads Performance Grader
 */
export async function runGoogleAdsPerformanceGrader({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/google-ads-performance-grader', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'google-ads-performance-grader', toolName: 'Google Ads Performance Grader', input, additionalInputs, accountId })
  });
}

/**
 * Google Analytics Grader
 */
export async function runGoogleAnalyticsGrader({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/google-analytics-grader', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'google-analytics-grader', toolName: 'Google Analytics Grader', input, additionalInputs, accountId })
  });
}

/**
 * Keyword Audit Tool
 */
export async function runKeywordAuditTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/keyword-audit-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'keyword-audit-tool', toolName: 'Keyword Audit Tool', input, additionalInputs, accountId })
  });
}

/**
 * Landing Page Audit
 */
export async function runLandingPageAudit({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/landing-page-audit', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'landing-page-audit', toolName: 'Landing Page Audit', input, additionalInputs, accountId })
  });
}

/**
 * Marketing Budget Planner
 */
export async function runMarketingBudgetPlanner({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/marketing-budget-planner', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'marketing-budget-planner', toolName: 'Marketing Budget Planner', input, additionalInputs, accountId })
  });
}

/**
 * Microsoft Ads Grader
 */
export async function runMicrosoftAdsGrader({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/microsoft-ads-grader', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'microsoft-ads-grader', toolName: 'Microsoft Ads Grader', input, additionalInputs, accountId })
  });
}

/**
 * Multi Platform Campaign Hub
 */
export async function runMultiPlatformCampaignHub({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/multi-platform-campaign-hub', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'multi-platform-campaign-hub', toolName: 'Multi Platform Campaign Hub', input, additionalInputs, accountId })
  });
}

/**
 * Negative Keyword Audit
 */
export async function runNegativeKeywordAudit({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/negative-keyword-audit', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'negative-keyword-audit', toolName: 'Negative Keyword Audit', input, additionalInputs, accountId })
  });
}

/**
 * On Page Seo Checker
 */
export async function runOnPageSeoChecker({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/on-page-seo-checker', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'on-page-seo-checker', toolName: 'On Page Seo Checker', input, additionalInputs, accountId })
  });
}

/**
 * Placement Audit
 */
export async function runPlacementAudit({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/placement-audit', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'placement-audit', toolName: 'Placement Audit', input, additionalInputs, accountId })
  });
}

/**
 * Placement Optimization
 */
export async function runPlacementOptimization({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/placement-optimization', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'placement-optimization', toolName: 'Placement Optimization', input, additionalInputs, accountId })
  });
}

/**
 * Quality Score Audit
 */
export async function runQualityScoreAudit({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/quality-score-audit', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'quality-score-audit', toolName: 'Quality Score Audit', input, additionalInputs, accountId })
  });
}

/**
 * Quality Score Checker
 */
export async function runQualityScoreChecker({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/quality-score-checker', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'quality-score-checker', toolName: 'Quality Score Checker', input, additionalInputs, accountId })
  });
}

/**
 * Rule Based Campaign Manager
 */
export async function runRuleBasedCampaignManager({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/rule-based-campaign-manager', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'rule-based-campaign-manager', toolName: 'Rule Based Campaign Manager', input, additionalInputs, accountId })
  });
}

/**
 * Search Term Audit
 */
export async function runSearchTermAudit({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/search-term-audit', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'search-term-audit', toolName: 'Search Term Audit', input, additionalInputs, accountId })
  });
}

/**
 * Seo Audit Tool
 */
export async function runSeoAuditTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/seo-audit-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'seo-audit-tool', toolName: 'Seo Audit Tool', input, additionalInputs, accountId })
  });
}

/**
 * Shopify Campaign Manager
 */
export async function runShopifyCampaignManager({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/shopify-campaign-manager', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'shopify-campaign-manager', toolName: 'Shopify Campaign Manager', input, additionalInputs, accountId })
  });
}

/**
 * Shopping Campaign Intelligence
 */
export async function runShoppingCampaignIntelligence({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/shopping-campaign-intelligence', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'shopping-campaign-intelligence', toolName: 'Shopping Campaign Intelligence', input, additionalInputs, accountId })
  });
}

/**
 * Website Grader
 */
export async function runWebsiteGrader({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/website-grader', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'website-grader', toolName: 'Website Grader', input, additionalInputs, accountId })
  });
}

/**
 * Ad Testing & Optimization
 */
export async function runAdTesting({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ad-testing', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ad-testing', toolName: 'Ad Testing & Optimization', input, additionalInputs, accountId })
  });
}

/**
 * PPC Account Auditor
 */
export async function runAuditing({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/auditing', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'auditing', toolName: 'PPC Account Auditor', input, additionalInputs, accountId })
  });
}

/**
 * Google Ads Automation Rules
 */
export async function runAutomation({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/automation', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'automation', toolName: 'Google Ads Automation Rules', input, additionalInputs, accountId })
  });
}

/**
 * Budget Management Tool
 */
export async function runBudgetManagement({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/budget-management', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'budget-management', toolName: 'Budget Management Tool', input, additionalInputs, accountId })
  });
}

/**
 * Free PPC Audit Report
 */
export async function runFreePpcTools({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/free-ppc-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'free-ppc-tools', toolName: 'Free PPC Audit Report', input, additionalInputs, accountId })
  });
}

/**
 * PPC Tool Comparison Engine
 */
export async function runFreeToolComparisons({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/free-tool-comparisons', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'free-tool-comparisons', toolName: 'PPC Tool Comparison Engine', input, additionalInputs, accountId })
  });
}

/**
 * Google Ads Editor Alternative
 */
export async function runGoogleAdsEditorAlternative({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/google-ads-editor-alternative', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'google-ads-editor-alternative', toolName: 'Google Ads Editor Alternative', input, additionalInputs, accountId })
  });
}

/**
 * Quality Score Analyzer
 */
export async function runGoogleAdsQualityScore({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/google-ads-quality-score', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'google-ads-quality-score', toolName: 'Quality Score Analyzer', input, additionalInputs, accountId })
  });
}

/**
 * Google Ads Campaign Manager
 */
export async function runGoogleAdsManager({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/google-ads-manager', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'google-ads-manager', toolName: 'Google Ads Campaign Manager', input, additionalInputs, accountId })
  });
}

/**
 * PPC Performance Monitor
 */
export async function runMonitoring({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/monitoring', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'monitoring', toolName: 'PPC Performance Monitor', input, additionalInputs, accountId })
  });
}

/**
 * Performance Max Optimizer
 */
export async function runPerformanceMax({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/performance-max', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'performance-max', toolName: 'Performance Max Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Ad Management Suite
 */
export async function runPpcAdManagementTools({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-ad-management-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-ad-management-tools', toolName: 'Ad Management Suite', input, additionalInputs, accountId })
  });
}

/**
 * PPC Audit & Analysis
 */
export async function runPpcAuditAnalysisTools({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-audit-analysis-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-audit-analysis-tools', toolName: 'PPC Audit & Analysis', input, additionalInputs, accountId })
  });
}

/**
 * PPC Rule Engine
 */
export async function runPpcAuditsRuleEngine({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-audits-rule-engine', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-audits-rule-engine', toolName: 'PPC Rule Engine', input, additionalInputs, accountId })
  });
}

/**
 * Bid Management Tool
 */
export async function runPpcBidManagementTools({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-bid-management-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-bid-management-tools', toolName: 'Bid Management Tool', input, additionalInputs, accountId })
  });
}

/**
 * Smart Bidding Optimizer
 */
export async function runPpcBiddingTools({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-bidding-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-bidding-tools', toolName: 'Smart Bidding Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * PPC Campaign Builder
 */
export async function runPpcCampaignBuilder({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-campaign-builder', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-campaign-builder', toolName: 'PPC Campaign Builder', input, additionalInputs, accountId })
  });
}

/**
 * Keyword Analysis Tool
 */
export async function runPpcKeywordAnalysisTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-keyword-analysis-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-keyword-analysis-tool', toolName: 'Keyword Analysis Tool', input, additionalInputs, accountId })
  });
}

/**
 * PPC Optimization Suite
 */
export async function runPpcOptimizationTools({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-optimization-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-optimization-tools', toolName: 'PPC Optimization Suite', input, additionalInputs, accountId })
  });
}

/**
 * Performance Booster
 */
export async function runPpcPerformanceBoost({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-performance-boost', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-performance-boost', toolName: 'Performance Booster', input, additionalInputs, accountId })
  });
}

/**
 * Quality Score Improver
 */
export async function runPpcQualityScore({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-quality-score', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-quality-score', toolName: 'Quality Score Improver', input, additionalInputs, accountId })
  });
}

/**
 * Search Term Analyzer
 */
export async function runPpcSearchTermAnalysis({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-search-term-analysis', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-search-term-analysis', toolName: 'Search Term Analyzer', input, additionalInputs, accountId })
  });
}

/**
 * Scientific Ad Testing
 */
export async function runScientificAdTesting({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/scientific-ad-testing', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'scientific-ad-testing', toolName: 'Scientific Ad Testing', input, additionalInputs, accountId })
  });
}

/**
 * Ad Position Analyzer
 */
export async function runAdPositionTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ad-position-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ad-position-tool', toolName: 'Ad Position Analyzer', input, additionalInputs, accountId })
  });
}

/**
 * Ad Rank Calculator
 */
export async function runAdRankingTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ad-ranking-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ad-ranking-tool', toolName: 'Ad Rank Calculator', input, additionalInputs, accountId })
  });
}

/**
 * Google Ads Keyword Planner
 */
export async function runAdwordsKeywordTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/adwords-keyword-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'adwords-keyword-tool', toolName: 'Google Ads Keyword Planner', input, additionalInputs, accountId })
  });
}

/**
 * CTR Optimization Tool
 */
export async function runCtrOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ctr-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ctr-optimizer', toolName: 'CTR Optimization Tool', input, additionalInputs, accountId })
  });
}

/**
 * Dynamic Keyword Insertion Tool
 */
export async function runDkiTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/dki-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'dki-tool', toolName: 'Dynamic Keyword Insertion Tool', input, additionalInputs, accountId })
  });
}

/**
 * Google Trends for PPC
 */
export async function runGoogleTrendsTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/google-trends-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'google-trends-tool', toolName: 'Google Trends for PPC', input, additionalInputs, accountId })
  });
}

/**
 * Keyword Grouping Tool
 */
export async function runKeywordGroupingTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/keyword-grouping-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'keyword-grouping-tool', toolName: 'Keyword Grouping Tool', input, additionalInputs, accountId })
  });
}

/**
 * Keyword Intent Analyzer
 */
export async function runKeywordIntentAnalyzer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/keyword-intent-analyzer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'keyword-intent-analyzer', toolName: 'Keyword Intent Analyzer', input, additionalInputs, accountId })
  });
}

/**
 * Negative Keyword Builder
 */
export async function runNegativeKeywordsTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/negative-keywords-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'negative-keywords-tool', toolName: 'Negative Keyword Builder', input, additionalInputs, accountId })
  });
}

/**
 * PPC Budget Calculator
 */
export async function runPpcBudgetTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-budget-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-budget-tool', toolName: 'PPC Budget Calculator', input, additionalInputs, accountId })
  });
}

// ═══════════════════════════════════════════════════════════════
// META — ALL 53 Direct Tool JS Functions
// ═══════════════════════════════════════════════════════════════

/**
 * Facebook Ads Manager
 */
export async function runFacebookAdsManager({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/facebook-ads-manager', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'facebook-ads-manager', toolName: 'Facebook Ads Manager', input, additionalInputs, accountId })
  });
}

/**
 * Facebook Ads Orchestrator
 */
export async function runFacebookAdsOrchestrator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/facebook-ads-orchestrator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'facebook-ads-orchestrator', toolName: 'Facebook Ads Orchestrator', input, additionalInputs, accountId })
  });
}

/**
 * Facebook Marketing Suite
 */
export async function runFacebookMarketingSuite({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/facebook-marketing-suite', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'facebook-marketing-suite', toolName: 'Facebook Marketing Suite', input, additionalInputs, accountId })
  });
}

/**
 * Facebook Performance Dashboard
 */
export async function runFacebookPerformanceDashboard({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/facebook-performance-dashboard', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'facebook-performance-dashboard', toolName: 'Facebook Performance Dashboard', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Ai Automation
 */
export async function runInstagramAiAutomation({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-ai-automation', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-ai-automation', toolName: 'Instagram Ai Automation', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Caption Generator
 */
export async function runInstagramCaptionGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-caption-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-caption-generator', toolName: 'Instagram Caption Generator', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Content Scheduler
 */
export async function runInstagramContentScheduler({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-content-scheduler', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-content-scheduler', toolName: 'Instagram Content Scheduler', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Engagement Analyzer
 */
export async function runInstagramEngagementAnalyzer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-engagement-analyzer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-engagement-analyzer', toolName: 'Instagram Engagement Analyzer', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Influencer Finder
 */
export async function runInstagramInfluencerFinder({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-influencer-finder', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-influencer-finder', toolName: 'Instagram Influencer Finder', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Management Tools
 */
export async function runInstagramManagementTools({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-management-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-management-tools', toolName: 'Instagram Management Tools', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Marketing Platform
 */
export async function runInstagramMarketingPlatform({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-marketing-platform', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-marketing-platform', toolName: 'Instagram Marketing Platform', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Reels Optimizer
 */
export async function runInstagramReelsOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-reels-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-reels-optimizer', toolName: 'Instagram Reels Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Shopping Ads
 */
export async function runInstagramShoppingAds({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-shopping-ads', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-shopping-ads', toolName: 'Instagram Shopping Ads', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Story Ads Manager
 */
export async function runInstagramStoryAdsManager({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-story-ads-manager', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-story-ads-manager', toolName: 'Instagram Story Ads Manager', input, additionalInputs, accountId })
  });
}

/**
 * Meta Ai Comment Responder
 */
export async function runMetaAiCommentResponder({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-ai-comment-responder', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-ai-comment-responder', toolName: 'Meta Ai Comment Responder', input, additionalInputs, accountId })
  });
}

/**
 * Meta Attribution Tool
 */
export async function runMetaAttributionTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-attribution-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-attribution-tool', toolName: 'Meta Attribution Tool', input, additionalInputs, accountId })
  });
}

/**
 * Meta Audience Builder
 */
export async function runMetaAudienceBuilder({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-audience-builder', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-audience-builder', toolName: 'Meta Audience Builder', input, additionalInputs, accountId })
  });
}

/**
 * Meta Budget Optimizer
 */
export async function runMetaBudgetOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-budget-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-budget-optimizer', toolName: 'Meta Budget Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Meta Campaign Analyzer
 */
export async function runMetaCampaignAnalyzer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-campaign-analyzer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-campaign-analyzer', toolName: 'Meta Campaign Analyzer', input, additionalInputs, accountId })
  });
}

/**
 * Meta Comment Manager
 */
export async function runMetaCommentManager({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-comment-manager', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-comment-manager', toolName: 'Meta Comment Manager', input, additionalInputs, accountId })
  });
}

/**
 * Meta Conversion Tracker
 */
export async function runMetaConversionTracker({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-conversion-tracker', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-conversion-tracker', toolName: 'Meta Conversion Tracker', input, additionalInputs, accountId })
  });
}

/**
 * Meta Creative Studio
 */
export async function runMetaCreativeStudio({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-creative-studio', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-creative-studio', toolName: 'Meta Creative Studio', input, additionalInputs, accountId })
  });
}

/**
 * Meta Placement Optimizer
 */
export async function runMetaPlacementOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-placement-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-placement-optimizer', toolName: 'Meta Placement Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Real Time Meta Optimizer
 */
export async function runRealTimeMetaOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/real-time-meta-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'real-time-meta-optimizer', toolName: 'Real Time Meta Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Ad Copy Insights
 */
export async function runAdCopyInsights({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ad-copy-insights', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ad-copy-insights', toolName: 'Ad Copy Insights', input, additionalInputs, accountId })
  });
}

/**
 * Meta Ad Cost Calculator
 */
export async function runMetaAdCostCalculator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-ad-cost-calculator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-ad-cost-calculator', toolName: 'Meta Ad Cost Calculator', input, additionalInputs, accountId })
  });
}

/**
 * Meta Ad Launcher
 */
export async function runMetaAdLauncher({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-ad-launcher', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-ad-launcher', toolName: 'Meta Ad Launcher', input, additionalInputs, accountId })
  });
}

/**
 * Ad Set Storyline
 */
export async function runAdSetStoryline({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ad-set-storyline', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ad-set-storyline', toolName: 'Ad Set Storyline', input, additionalInputs, accountId })
  });
}

/**
 * Ads Manager 2.0
 */
export async function runMetaAdsManager2({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-ads-manager-2', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-ads-manager-2', toolName: 'Ads Manager 2.0', input, additionalInputs, accountId })
  });
}

/**
 * Meta AI Copywriter
 */
export async function runMetaAiCopywriter({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-ai-copywriter', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-ai-copywriter', toolName: 'Meta AI Copywriter', input, additionalInputs, accountId })
  });
}

/**
 * Meta AI Marketer
 */
export async function runMetaAiMarketer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-ai-marketer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-ai-marketer', toolName: 'Meta AI Marketer', input, additionalInputs, accountId })
  });
}

/**
 * Meta Audience Launcher
 */
export async function runMetaAudienceLauncher({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-audience-launcher', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-audience-launcher', toolName: 'Meta Audience Launcher', input, additionalInputs, accountId })
  });
}

/**
 * Meta Audience Studio
 */
export async function runMetaAudienceStudio({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-audience-studio', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-audience-studio', toolName: 'Meta Audience Studio', input, additionalInputs, accountId })
  });
}

/**
 * Meta Automated Reporting
 */
export async function runMetaAutomatedReporting({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-automated-reporting', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-automated-reporting', toolName: 'Meta Automated Reporting', input, additionalInputs, accountId })
  });
}

/**
 * Meta Automation Tactics
 */
export async function runMetaAutomationTactics({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-automation-tactics', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-automation-tactics', toolName: 'Meta Automation Tactics', input, additionalInputs, accountId })
  });
}

/**
 * Meta Autonomous Budget Optimizer
 */
export async function runMetaAutonomousBudgetOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-autonomous-budget-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-autonomous-budget-optimizer', toolName: 'Meta Autonomous Budget Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Meta Conversions API Setup
 */
export async function runMetaConversionsApi({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-conversions-api', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-conversions-api', toolName: 'Meta Conversions API Setup', input, additionalInputs, accountId })
  });
}

/**
 * Meta Creative Insights
 */
export async function runMetaCreativeInsights({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-creative-insights', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-creative-insights', toolName: 'Meta Creative Insights', input, additionalInputs, accountId })
  });
}

/**
 * Meta Custom Audiences Builder
 */
export async function runMetaCustomAudiences({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-custom-audiences', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-custom-audiences', toolName: 'Meta Custom Audiences Builder', input, additionalInputs, accountId })
  });
}

/**
 * Meta Custom Automation
 */
export async function runMetaCustomAutomation({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-custom-automation', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-custom-automation', toolName: 'Meta Custom Automation', input, additionalInputs, accountId })
  });
}

/**
 * Meta Full Automation Suite
 */
export async function runMetaFullAutomationSuite({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-full-automation-suite', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-full-automation-suite', toolName: 'Meta Full Automation Suite', input, additionalInputs, accountId })
  });
}

/**
 * Meta Ads Dashboard
 */
export async function runMetaAdsDashboard({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-ads-dashboard', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-ads-dashboard', toolName: 'Meta Ads Dashboard', input, additionalInputs, accountId })
  });
}

/**
 * Meta Target Audience Finder
 */
export async function runMetaTargetAudienceFinder({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-target-audience-finder', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-target-audience-finder', toolName: 'Meta Target Audience Finder', input, additionalInputs, accountId })
  });
}

/**
 * Meta Hidden Insights
 */
export async function runMetaHiddenInsights({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-hidden-insights', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-hidden-insights', toolName: 'Meta Hidden Insights', input, additionalInputs, accountId })
  });
}

/**
 * Meta Cloud Tracking
 */
export async function runMetaCloudTracking({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-cloud-tracking', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-cloud-tracking', toolName: 'Meta Cloud Tracking', input, additionalInputs, accountId })
  });
}

/**
 * Meta Smart Filter
 */
export async function runMetaSmartFilter({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-smart-filter', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-smart-filter', toolName: 'Meta Smart Filter', input, additionalInputs, accountId })
  });
}

/**
 * Meta White Label
 */
export async function runMetaWhiteLabel({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-white-label', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-white-label', toolName: 'Meta White Label', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Bio Optimizer
 */
export async function runInstagramBioOptimizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-bio-optimizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-bio-optimizer', toolName: 'Instagram Bio Optimizer', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Hashtag Strategy
 */
export async function runInstagramHashtagStrategy({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-hashtag-strategy', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-hashtag-strategy', toolName: 'Instagram Hashtag Strategy', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Competitor Analyzer
 */
export async function runInstagramCompetitorAnalyzer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-competitor-analyzer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-competitor-analyzer', toolName: 'Instagram Competitor Analyzer', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Ad Creative Generator
 */
export async function runInstagramAdCreativeGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-ad-creative-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-ad-creative-generator', toolName: 'Instagram Ad Creative Generator', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Growth Strategy
 */
export async function runInstagramGrowthStrategy({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-growth-strategy', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-growth-strategy', toolName: 'Instagram Growth Strategy', input, additionalInputs, accountId })
  });
}

/**
 * Instagram Carousel Designer
 */
export async function runInstagramCarouselDesigner({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/instagram-carousel-designer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'instagram-carousel-designer', toolName: 'Instagram Carousel Designer', input, additionalInputs, accountId })
  });
}

// ═══════════════════════════════════════════════════════════════
// SOCIAL MEDIA — ALL 13 Direct Tool JS Functions
// ═══════════════════════════════════════════════════════════════

/**
 * Ai Paid Social Manager
 */
export async function runAiPaidSocialManager({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ai-paid-social-manager', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ai-paid-social-manager', toolName: 'Ai Paid Social Manager', input, additionalInputs, accountId })
  });
}

/**
 * Caption Creator
 */
export async function runCaptionCreator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/caption-creator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'caption-creator', toolName: 'Caption Creator', input, additionalInputs, accountId })
  });
}

/**
 * Hashtag Generator
 */
export async function runHashtagGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/hashtag-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'hashtag-generator', toolName: 'Hashtag Generator', input, additionalInputs, accountId })
  });
}

/**
 * Linkedin Ad Copy Generator
 */
export async function runLinkedinAdCopyGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/linkedin-ad-copy-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'linkedin-ad-copy-generator', toolName: 'Linkedin Ad Copy Generator', input, additionalInputs, accountId })
  });
}

/**
 * Marketing Calendar
 */
export async function runMarketingCalendar({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/marketing-calendar', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'marketing-calendar', toolName: 'Marketing Calendar', input, additionalInputs, accountId })
  });
}

/**
 * Post Scheduler
 */
export async function runPostScheduler({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/post-scheduler', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'post-scheduler', toolName: 'Post Scheduler', input, additionalInputs, accountId })
  });
}

/**
 * Social Analytics Dashboard
 */
export async function runSocialAnalyticsDashboard({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/social-analytics-dashboard', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'social-analytics-dashboard', toolName: 'Social Analytics Dashboard', input, additionalInputs, accountId })
  });
}

/**
 * Social Hashtag Generator
 */
export async function runSocialHashtagGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/social-hashtag-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'social-hashtag-generator', toolName: 'Social Hashtag Generator', input, additionalInputs, accountId })
  });
}

/**
 * Social Media Post Generator
 */
export async function runSocialMediaPostGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/social-media-post-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'social-media-post-generator', toolName: 'Social Media Post Generator', input, additionalInputs, accountId })
  });
}

/**
 * Tiktok Ad Creator
 */
export async function runTiktokAdCreator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/tiktok-ad-creator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'tiktok-ad-creator', toolName: 'Tiktok Ad Creator', input, additionalInputs, accountId })
  });
}

/**
 * Youtube Ad Script Writer
 */
export async function runYoutubeAdScriptWriter({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/youtube-ad-script-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'youtube-ad-script-writer', toolName: 'Youtube Ad Script Writer', input, additionalInputs, accountId })
  });
}

/**
 * Youtube Description Generator
 */
export async function runYoutubeDescriptionGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/youtube-description-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'youtube-description-generator', toolName: 'Youtube Description Generator', input, additionalInputs, accountId })
  });
}

/**
 * Youtube Title Generator
 */
export async function runYoutubeTitleGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/youtube-title-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'youtube-title-generator', toolName: 'Youtube Title Generator', input, additionalInputs, accountId })
  });
}

// ═══════════════════════════════════════════════════════════════
// SEO & CONTENT — ALL 41 Direct Tool JS Functions
// ═══════════════════════════════════════════════════════════════

/**
 * Academic Writer
 */
export async function runAcademicWriter({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/academic-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'academic-writer', toolName: 'Academic Writer', input, additionalInputs, accountId })
  });
}

/**
 * Article Generator
 */
export async function runArticleGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/article-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'article-generator', toolName: 'Article Generator', input, additionalInputs, accountId })
  });
}

/**
 * Article Rewriter
 */
export async function runArticleRewriter({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/article-rewriter', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'article-rewriter', toolName: 'Article Rewriter', input, additionalInputs, accountId })
  });
}

/**
 * Article Summarizer
 */
export async function runArticleSummarizer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/article-summarizer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'article-summarizer', toolName: 'Article Summarizer', input, additionalInputs, accountId })
  });
}

/**
 * Backlink Outreach Email Generator
 */
export async function runBacklinkOutreachEmailGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/backlink-outreach-email-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'backlink-outreach-email-generator', toolName: 'Backlink Outreach Email Generator', input, additionalInputs, accountId })
  });
}

/**
 * Blog Conclusion Writer
 */
export async function runBlogConclusionWriter({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/blog-conclusion-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'blog-conclusion-writer', toolName: 'Blog Conclusion Writer', input, additionalInputs, accountId })
  });
}

/**
 * Blog Intro Writer
 */
export async function runBlogIntroWriter({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/blog-intro-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'blog-intro-writer', toolName: 'Blog Intro Writer', input, additionalInputs, accountId })
  });
}

/**
 * Blog Outline Writer
 */
export async function runBlogOutlineWriter({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/blog-outline-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'blog-outline-writer', toolName: 'Blog Outline Writer', input, additionalInputs, accountId })
  });
}

/**
 * Blog Post Ideas
 */
export async function runBlogPostIdeas({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/blog-post-ideas', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'blog-post-ideas', toolName: 'Blog Post Ideas', input, additionalInputs, accountId })
  });
}

/**
 * Blog Writer
 */
export async function runBlogWriter({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/blog-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'blog-writer', toolName: 'Blog Writer', input, additionalInputs, accountId })
  });
}

/**
 * Case Study Writer
 */
export async function runCaseStudyWriter({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/case-study-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'case-study-writer', toolName: 'Case Study Writer', input, additionalInputs, accountId })
  });
}

/**
 * Content Gap Finder
 */
export async function runContentGapFinder({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/content-gap-finder', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'content-gap-finder', toolName: 'Content Gap Finder', input, additionalInputs, accountId })
  });
}


/**
 * Faq Generator
 */
export async function runFaqGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/faq-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'faq-generator', toolName: 'Faq Generator', input, additionalInputs, accountId })
  });
}

/**
 * Faq Schema Writer
 */
export async function runFaqSchemaWriter({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/faq-schema-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'faq-schema-writer', toolName: 'Faq Schema Writer', input, additionalInputs, accountId })
  });
}

/**
 * Free Keyword Tools
 */
export async function runFreeKeywordTools({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/free-keyword-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'free-keyword-tools', toolName: 'Free Keyword Tools', input, additionalInputs, accountId })
  });
}

/**
 * Internal Linking Suggestions
 */
export async function runInternalLinkingSuggestions({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/internal-linking-suggestions', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'internal-linking-suggestions', toolName: 'Internal Linking Suggestions', input, additionalInputs, accountId })
  });
}

/**
 * Keyword Cluster Generator
 */
export async function runKeywordClusterGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/keyword-cluster-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'keyword-cluster-generator', toolName: 'Keyword Cluster Generator', input, additionalInputs, accountId })
  });
}

/**
 * Keyword Intent Detector
 */
export async function runKeywordIntentDetector({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/keyword-intent-detector', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'keyword-intent-detector', toolName: 'Keyword Intent Detector', input, additionalInputs, accountId })
  });
}

/**
 * Keyword Research Tool
 */
export async function runKeywordResearchTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/keyword-research-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'keyword-research-tool', toolName: 'Keyword Research Tool', input, additionalInputs, accountId })
  });
}

/**
 * Long Tail Keyword Generator
 */
export async function runLongTailKeywordGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/long-tail-keyword-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'long-tail-keyword-generator', toolName: 'Long Tail Keyword Generator', input, additionalInputs, accountId })
  });
}

/**
 * Meta Description Generator
 */
export async function runMetaDescriptionGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/meta-description-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'meta-description-generator', toolName: 'Meta Description Generator', input, additionalInputs, accountId })
  });
}




/**
 * Podcast Script Writer
 */
export async function runPodcastScriptWriter({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/podcast-script-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'podcast-script-writer', toolName: 'Podcast Script Writer', input, additionalInputs, accountId })
  });
}

/**
 * Press Release Generator
 */
export async function runPressReleaseGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/press-release-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'press-release-generator', toolName: 'Press Release Generator', input, additionalInputs, accountId })
  });
}


/**
 * Schema Generator
 */
export async function runSchemaGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/schema-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'schema-generator', toolName: 'Schema Generator', input, additionalInputs, accountId })
  });
}



/**
 * Seo Title Generator
 */
export async function runSeoTitleGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/seo-title-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'seo-title-generator', toolName: 'Seo Title Generator', input, additionalInputs, accountId })
  });
}

/**
 * Serp Analyzer
 */
export async function runSerpAnalyzer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/serp-analyzer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'serp-analyzer', toolName: 'Serp Analyzer', input, additionalInputs, accountId })
  });
}

/**
 * Webinar Script Writer
 */
export async function runWebinarScriptWriter({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/webinar-script-writer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'webinar-script-writer', toolName: 'Webinar Script Writer', input, additionalInputs, accountId })
  });
}

/**
 * Whitepaper Generator
 */
export async function runWhitepaperGenerator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/whitepaper-generator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'whitepaper-generator', toolName: 'Whitepaper Generator', input, additionalInputs, accountId })
  });
}

// ═══════════════════════════════════════════════════════════════
// AN-ANALYTICS — ALL 22 Direct Tool JS Functions
// ═══════════════════════════════════════════════════════════════

/**
 * Ad Intelligence Software
 */
export async function runAdIntelligenceSoftware({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ad-intelligence-software', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ad-intelligence-software', toolName: 'Ad Intelligence Software', input, additionalInputs, accountId })
  });
}

/**
 * Brand Safety Monitor
 */
export async function runBrandSafetyMonitor({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/brand-safety-monitor', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'brand-safety-monitor', toolName: 'Brand Safety Monitor', input, additionalInputs, accountId })
  });
}

/**
 * Client Reporting Portal
 */
export async function runClientReportingPortal({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/client-reporting-portal', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'client-reporting-portal', toolName: 'Client Reporting Portal', input, additionalInputs, accountId })
  });
}

/**
 * Competitive Benchmarking Ai
 */
export async function runCompetitiveBenchmarkingAi({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/competitive-benchmarking-ai', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'competitive-benchmarking-ai', toolName: 'Competitive Benchmarking Ai', input, additionalInputs, accountId })
  });
}

/**
 * Competitor Analysis Tool
 */
export async function runCompetitorAnalysisTool({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/competitor-analysis-tool', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'competitor-analysis-tool', toolName: 'Competitor Analysis Tool', input, additionalInputs, accountId })
  });
}

/**
 * Conversion Path Analyzer
 */
export async function runConversionPathAnalyzer({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/conversion-path-analyzer', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'conversion-path-analyzer', toolName: 'Conversion Path Analyzer', input, additionalInputs, accountId })
  });
}

/**
 * Customer Journey Intelligence
 */
export async function runCustomerJourneyIntelligence({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/customer-journey-intelligence', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'customer-journey-intelligence', toolName: 'Customer Journey Intelligence', input, additionalInputs, accountId })
  });
}

/**
 * Engagement Calculator
 */
export async function runEngagementCalculator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/engagement-calculator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'engagement-calculator', toolName: 'Engagement Calculator', input, additionalInputs, accountId })
  });
}

/**
 * Marketing Kpi Dashboard
 */
export async function runMarketingKpiDashboard({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/marketing-kpi-dashboard', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'marketing-kpi-dashboard', toolName: 'Marketing Kpi Dashboard', input, additionalInputs, accountId })
  });
}

/**
 * Multi Channel Attribution
 */
export async function runMultiChannelAttribution({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/multi-channel-attribution', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'multi-channel-attribution', toolName: 'Multi Channel Attribution', input, additionalInputs, accountId })
  });
}

/**
 * Performance Auto Alerts
 */
export async function runPerformanceAutoAlerts({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/performance-auto-alerts', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'performance-auto-alerts', toolName: 'Performance Auto Alerts', input, additionalInputs, accountId })
  });
}

/**
 * Performance Forecasting
 */
export async function runPerformanceForecasting({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/performance-forecasting', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'performance-forecasting', toolName: 'Performance Forecasting', input, additionalInputs, accountId })
  });
}

/**
 * Performance Intelligence Dashboard
 */
export async function runPerformanceIntelligenceDashboard({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/performance-intelligence-dashboard', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'performance-intelligence-dashboard', toolName: 'Performance Intelligence Dashboard', input, additionalInputs, accountId })
  });
}

/**
 * Reporting Tools
 */
export async function runReportingTools({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/reporting-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'reporting-tools', toolName: 'Reporting Tools', input, additionalInputs, accountId })
  });
}

/**
 * Roas Prediction Platform
 */
export async function runRoasPredictionPlatform({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/roas-prediction-platform', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'roas-prediction-platform', toolName: 'Roas Prediction Platform', input, additionalInputs, accountId })
  });
}

/**
 * Roi Calculator
 */
export async function runRoiCalculator({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/roi-calculator', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'roi-calculator', toolName: 'Roi Calculator', input, additionalInputs, accountId })
  });
}

/**
 * Roi Intelligence Platform
 */
export async function runRoiIntelligencePlatform({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/roi-intelligence-platform', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'roi-intelligence-platform', toolName: 'Roi Intelligence Platform', input, additionalInputs, accountId })
  });
}

/**
 * Unified Analytics Platform
 */
export async function runUnifiedAnalyticsPlatform({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/unified-analytics-platform', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'unified-analytics-platform', toolName: 'Unified Analytics Platform', input, additionalInputs, accountId })
  });
}

/**
 * Looker Studio Report Builder
 */
export async function runDataStudioReporting({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/data-studio-reporting', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'data-studio-reporting', toolName: 'Looker Studio Report Builder', input, additionalInputs, accountId })
  });
}

/**
 * Performance Monitoring Dashboard
 */
export async function runPpcPerformanceMonitoringTools({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-performance-monitoring-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-performance-monitoring-tools', toolName: 'Performance Monitoring Dashboard', input, additionalInputs, accountId })
  });
}

/**
 * PPC Report Generator
 */
export async function runPpcReportingSolution({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-reporting-solution', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-reporting-solution', toolName: 'PPC Report Generator', input, additionalInputs, accountId })
  });
}

/**
 * Automated Reporting Suite
 */
export async function runPpcReportingTools({ userId, input, additionalInputs, accountId }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/ppc-reporting-tools', {
    method: 'POST', timeout: 180000,
    body: JSON.stringify({ userId, toolSlug: 'ppc-reporting-tools', toolName: 'Automated Reporting Suite', input, additionalInputs, accountId })
  });
}

// ═══════════════════════════════════════════════════════════════
// CHART PAGE
// ═══════════════════════════════════════════════════════════════

/**
 * Fetch chart data — daily usage, platform breakdown, top tools, AI insight
 * @param {string} userId
 * @param {string} [dateRange] - 'last_7_days' | 'last_30_days' | 'last_90_days'
 * @param {string} [chartType] - 'all' | 'usage' | 'platforms' | 'tools'
 * @returns {Promise<Object>} { success, data: { dailyUsage[], platformBreakdown, topTools[], totalGenerations, totalCampaigns, aiInsight } }
 */
export async function fetchChartData({ userId, dateRange, chartType }) {
  return apiFetch('/jobs/run_wait_result/p/f/tools/worker-chart-data', {
    method: 'POST',
    timeout: 30000,
    body: JSON.stringify({ userId, dateRange, chartType })
  });
}

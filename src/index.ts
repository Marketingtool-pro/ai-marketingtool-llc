import express from "express";
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Required env var missing: ${name}`);
  return v;
}

const PORT = parseInt(process.env.PORT || "8080");

// Service URLs & Keys — all from env, NO fallbacks
const APPWRITE_URL = requireEnv("APPWRITE_URL");
const APPWRITE_KEY = requireEnv("APPWRITE_KEY");
const APPWRITE_PROJECT = requireEnv("APPWRITE_PROJECT");
const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SUPABASE_KEY = requireEnv("SUPABASE_KEY");
// Stripe goes through Appwrite's stripe-checkout function
const WINDMILL_URL = requireEnv("WINDMILL_URL");
const WINDMILL_TOKEN = requireEnv("WINDMILL_TOKEN");
const GCP_PROJECT = requireEnv("GCP_PROJECT");
const GCP_REGION = process.env.GCP_REGION || "us-central1";

// --- Helpers ---
async function appwriteApi(path: string, method = "GET", body?: unknown) {
  const res = await fetch(`${APPWRITE_URL}${path}`, {
    method,
    headers: { "X-Appwrite-Project": APPWRITE_PROJECT, "X-Appwrite-Key": APPWRITE_KEY, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

async function supabaseApi(path: string, method = "GET", body?: unknown) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

async function appwriteExecFunction(functionId: string, body: unknown) {
  const res = await fetch(`${APPWRITE_URL}/functions/${functionId}/executions`, {
    method: "POST",
    headers: { "X-Appwrite-Project": APPWRITE_PROJECT, "X-Appwrite-Key": APPWRITE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ body: JSON.stringify(body), async: false }),
  });
  return res.json();
}

async function windmillApi(path: string, method = "GET", body?: unknown) {
  const res = await fetch(`${WINDMILL_URL}/api${path}`, {
    method,
    headers: { "Authorization": `Bearer ${WINDMILL_TOKEN}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

async function gcloudMetadata() {
  // Use metadata server when running on GCP
  try {
    const res = await fetch("http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token", {
      headers: { "Metadata-Flavor": "Google" },
    });
    const data = await res.json() as { access_token: string };
    return data.access_token;
  } catch {
    return "";
  }
}

async function gcloudApi(path: string) {
  const token = await gcloudMetadata();
  const res = await fetch(`https://run.googleapis.com/v2${path}`, {
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
  return res.json();
}

async function gcloudLogging(filter: string, limit = 20) {
  const token = await gcloudMetadata();
  const res = await fetch("https://logging.googleapis.com/v2/entries:list", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ resourceNames: [`projects/${GCP_PROJECT}`], filter, orderBy: "timestamp desc", pageSize: limit }),
  });
  return res.json();
}

// --- APPWRITE TOOLS ---

const listUsers = tool(
  "appwrite_list_users",
  "List all Appwrite users — customers with accounts.",
  { limit: z.number().optional().describe("Max users to return (default 25)"), search: z.string().optional().describe("Search by name or email") },
  async ({ limit, search }) => {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (search) params.set("search", search);
    const data = await appwriteApi(`/users?${params.toString()}`);
    return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
  },
  { annotations: { readOnlyHint: true } }
);

const getUser = tool(
  "appwrite_get_user",
  "Get a specific Appwrite user by ID or email.",
  { userId: z.string().optional().describe("User ID"), email: z.string().optional().describe("User email") },
  async ({ userId, email }) => {
    if (userId) {
      const data = await appwriteApi(`/users/${userId}`);
      return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
    }
    if (email) {
      const data = await appwriteApi(`/users?search=${encodeURIComponent(email)}`);
      return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
    }
    return { content: [{ type: "text" as const, text: JSON.stringify({ error: "Provide userId or email" }) }] };
  },
  { annotations: { readOnlyHint: true } }
);

const deleteUser = tool(
  "appwrite_delete_user",
  "Delete an Appwrite user account.",
  { userId: z.string().describe("User ID to delete") },
  async ({ userId }) => {
    const data = await appwriteApi(`/users/${userId}`, "DELETE");
    return { content: [{ type: "text" as const, text: JSON.stringify({ status: "deleted", userId, data }) }] };
  },
  { annotations: { readOnlyHint: false, destructiveHint: true } }
);

// --- SUPABASE TOOLS ---

const supabaseQuery = tool(
  "supabase_query",
  "Query any Supabase table — select, filter, count rows.",
  {
    table: z.string().describe("Table name"),
    select: z.string().optional().describe("Columns (default *)"),
    filter: z.string().optional().describe("PostgREST filter e.g. email=eq.test@test.com"),
    limit: z.number().optional().describe("Max rows (default 25)"),
    count: z.boolean().optional().describe("Return count only"),
  },
  async ({ table, select, filter, limit, count }) => {
    let path = `/${table}?select=${select || "*"}&limit=${limit || 25}`;
    if (filter) path += `&${filter}`;
    if (count) {
      const res = await fetch(`${SUPABASE_URL}/${table}?select=count`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Prefer": "count=exact" },
      });
      const countHeader = res.headers.get("content-range");
      return { content: [{ type: "text" as const, text: JSON.stringify({ table, count: countHeader }) }] };
    }
    const data = await supabaseApi(path);
    return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
  },
  { annotations: { readOnlyHint: true } }
);

const supabaseInsert = tool(
  "supabase_insert",
  "Insert a row into any Supabase table.",
  { table: z.string().describe("Table name"), data: z.string().describe("JSON row data") },
  async ({ table, data }) => {
    const result = await supabaseApi(`/${table}`, "POST", JSON.parse(data));
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  },
  { annotations: { readOnlyHint: false } }
);

const supabaseUpdate = tool(
  "supabase_update",
  "Update rows in a Supabase table.",
  { table: z.string().describe("Table name"), filter: z.string().describe("PostgREST filter e.g. id=eq.123"), data: z.string().describe("JSON update data") },
  async ({ table, filter, data }) => {
    const result = await supabaseApi(`/${table}?${filter}`, "PATCH", JSON.parse(data));
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  },
  { annotations: { readOnlyHint: false } }
);

// --- STRIPE TOOLS ---

const stripeAction = tool(
  "stripe_action",
  "Execute any Stripe operation through Appwrite's stripe-checkout function — list customers, subscriptions, payments, create refunds, check billing.",
  {
    action: z.enum(["list_customers", "list_subscriptions", "list_payments", "create_refund", "get_customer", "cancel_subscription"]).describe("Stripe action"),
    email: z.string().optional().describe("Customer email for lookup"),
    customerId: z.string().optional().describe("Stripe customer ID"),
    paymentIntentId: z.string().optional().describe("Payment intent ID for refund"),
    subscriptionId: z.string().optional().describe("Subscription ID"),
    reason: z.string().optional().describe("Refund reason"),
  },
  async ({ action, email, customerId, paymentIntentId, subscriptionId, reason }) => {
    const data = await appwriteExecFunction("stripe-checkout", { action, email, customerId, paymentIntentId, subscriptionId, reason });
    return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
  },
  { annotations: { readOnlyHint: false } }
);

// --- WINDMILL TOOLS ---

const windmillRunScript = tool(
  "windmill_run_script",
  "Run any Windmill script and wait for result.",
  { scriptPath: z.string().describe("Script path e.g. f/tools/generate_ad_copy"), args: z.string().optional().describe("JSON arguments") },
  async ({ scriptPath, args }) => {
    const data = await windmillApi(`/w/marketingtool-pro/jobs/run_wait_result/p/${scriptPath}`, "POST", args ? JSON.parse(args) : {});
    return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
  },
  { annotations: { readOnlyHint: false } }
);

const windmillListScripts = tool(
  "windmill_list_scripts",
  "List all Windmill scripts in the workspace.",
  {},
  async () => {
    const data = await windmillApi("/w/marketingtool-pro/scripts/list");
    return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
  },
  { annotations: { readOnlyHint: true } }
);

const windmillListJobs = tool(
  "windmill_list_jobs",
  "List recent Windmill jobs — check for failures.",
  { limit: z.number().optional().describe("Max jobs (default 20)") },
  async ({ limit }) => {
    const data = await windmillApi(`/w/marketingtool-pro/jobs/completed/list?per_page=${limit || 20}&order_desc=true`);
    return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
  },
  { annotations: { readOnlyHint: true } }
);

// --- GCLOUD TOOLS ---

const gcloudListServices = tool(
  "gcloud_list_services",
  "List all Cloud Run services with status.",
  {},
  async () => {
    const data = await gcloudApi(`/projects/${GCP_PROJECT}/locations/${GCP_REGION}/services`);
    return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
  },
  { annotations: { readOnlyHint: true } }
);

const gcloudServiceLogs = tool(
  "gcloud_service_logs",
  "Get recent logs for a Cloud Run service — errors, requests.",
  {
    service: z.string().describe("Service name"),
    severity: z.enum(["ERROR", "WARNING", "INFO", "DEFAULT"]).optional().describe("Min severity"),
    minutes: z.number().optional().describe("Look back N minutes (default 30)"),
  },
  async ({ service, severity, minutes }) => {
    const ago = new Date(Date.now() - (minutes || 30) * 60000).toISOString();
    let filter = `resource.type="cloud_run_revision" AND resource.labels.service_name="${service}" AND timestamp>="${ago}"`;
    if (severity) filter += ` AND severity>="${severity}"`;
    const data = await gcloudLogging(filter, 50);
    return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
  },
  { annotations: { readOnlyHint: true } }
);

const gcloudVmStatus = tool(
  "gcloud_vm_status",
  "Check GCE VM status — mt-appwrite, mt-windmill.",
  { vm: z.enum(["mt-appwrite", "mt-windmill"]).describe("VM name") },
  async ({ vm }) => {
    const token = await gcloudMetadata();
    const res = await fetch(`https://compute.googleapis.com/compute/v1/projects/${GCP_PROJECT}/zones/us-central1-a/instances/${vm}`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
  },
  { annotations: { readOnlyHint: true } }
);

const gcloudSqlStatus = tool(
  "gcloud_sql_status",
  "Check Cloud SQL instance status — mt-postgres.",
  {},
  async () => {
    const token = await gcloudMetadata();
    const res = await fetch(`https://sqladmin.googleapis.com/v1/projects/${GCP_PROJECT}/instances/mt-postgres`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
  },
  { annotations: { readOnlyHint: true } }
);

// MCP server
const mcpServer = createSdkMcpServer({
  name: "marketingtool-ops",
  version: "3.0.0",
  tools: [
    // Appwrite
    listUsers, getUser, deleteUser,
    // Supabase
    supabaseQuery, supabaseInsert, supabaseUpdate,
    // Stripe
    stripeAction,
    // Windmill
    windmillRunScript, windmillListScripts, windmillListJobs,
    // GCloud
    gcloudListServices, gcloudServiceLogs, gcloudVmStatus, gcloudSqlStatus,
  ],
});

const SYSTEM_PROMPT = `You are the MarketingTool.pro Root Operations Agent — Claude Opus 4.6 on Vertex AI.
Full admin access to GCloud project marketing-tool-484720. You manage EVERYTHING.

APPWRITE (auth + users):
- appwrite_list_users — List/search all customers
- appwrite_get_user — Get customer by ID or email
- appwrite_delete_user — Delete customer account

SUPABASE (29 tables, all data):
- supabase_query — SELECT any table with filters
- supabase_insert — INSERT into any table
- supabase_update — UPDATE rows in any table

STRIPE (billing + payments — via Appwrite):
- stripe_action — All Stripe operations through Appwrite's stripe-checkout function
  Actions: list_customers, list_subscriptions, list_payments, create_refund, get_customer, cancel_subscription

WINDMILL (backend scripts):
- windmill_run_script — Execute any Python script
- windmill_list_scripts — See all available scripts
- windmill_list_jobs — Check recent job results/failures

GCLOUD (infrastructure):
- gcloud_list_services — All Cloud Run services + status
- gcloud_service_logs — Error/request logs for any service
- gcloud_vm_status — Check mt-appwrite or mt-windmill VM
- gcloud_sql_status — Check mt-postgres Cloud SQL

ARCHITECTURE:
- Cloud Run: ai-router, marketing-site, web-app, marketingtool-agent, mt-claude-agent
- GCE: mt-appwrite (10.128.0.4), mt-windmill (10.128.0.3)
- Cloud SQL: mt-postgres (10.119.0.3) — windmill DB + supabase 29 tables
- Appwrite Project: 6952c8a0002d3365625d
- Windmill Workspace: marketingtool-pro

PRICING:
| Starter | $29/mo | $199/yr |
| Professional | $59/mo | $499/yr |
| Growth | $99/mo | $999/yr |
| Agency | Custom |
| Extra | $3 = 100 generations |

RULES:
- You are ROOT ADMIN — full access to everything
- Never expose API keys, service_role keys, or secrets in responses
- Verify before destructive operations (delete user, refund)
- Refunds only within 14 days of purchase
- Be direct, no filler`;

const app = express();
app.use(express.json());

app.use(express.static("public"));

app.post("/agent", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) { res.status(400).json({ error: "prompt is required" }); return; }

  const results: string[] = [];
  try {
    for await (const message of query({
      prompt,
      options: {
        systemPrompt: SYSTEM_PROMPT,
        model: "claude-opus-4-6",
        mcpServers: { "marketingtool-ops": mcpServer },
        permissionMode: "acceptEdits",
        maxTurns: 20,
      },
    })) {
      if ("result" in message) results.push(String(message.result));
    }
    res.json({ status: "success", response: results.join("\n") });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => console.log(`mt-claude-agent v3.0.0 — root admin — port ${PORT}`));

/**
 * Firebase Functions + Genkit AI for MarketingTool
 * All 314 tool executions flow through: Mobile → onCallGenkit → Gemini → Firestore history
 */

import { setGlobalOptions } from "firebase-functions/v2";
import { onCallGenkit, hasClaim } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";

// Initialize Firebase Admin once
if (getApps().length === 0) {
  initializeApp();
}

// Enable Genkit telemetry to Firebase Observability
enableFirebaseTelemetry();

// Global options
setGlobalOptions({ maxInstances: 20, region: "us-central1" });

// Gemini API key stored in Cloud Secret Manager
const googleGenaiApiKey = defineSecret("GOOGLE_GENAI_API_KEY");

// Genkit instance — Gemini as the AI provider
const ai = genkit({
  plugins: [googleAI()],
});

// Complex tools that need more powerful model
const COMPLEX_TOOLS = new Set([
  "ai-campaign-optimizer", "ai-content-planner", "ai-analyzer",
  "ai-budget", "seo-blog-writer", "facebook-video-script",
  "google-pmax", "schema-markup", "ecom-category-seo",
  "meta-ai-copywriter", "marketing-kpi-dashboard",
]);

/**
 * Tool Executor Flow — generates marketing content using Gemini
 */
const toolExecutorFlow = ai.defineFlow(
  {
    name: "toolExecutor",
    inputSchema: z.object({
      toolSlug: z.string(),
      toolName: z.string(),
      inputs: z.record(z.any()).optional(),
      input: z.string().optional(),
      outputCount: z.number().default(3),
      userId: z.string().optional(),
    }),
    outputSchema: z.object({
      outputs: z.array(z.string()),
      success: z.boolean(),
      model: z.string(),
      tokensUsed: z.number().optional(),
      toolSlug: z.string(),
    }),
  },
  async ({ toolSlug, toolName, inputs, input, outputCount, userId }) => {
    // Choose model based on tool complexity
    const model = COMPLEX_TOOLS.has(toolSlug)
      ? googleAI.model("gemini-2.5-flash")
      : googleAI.model("gemini-2.5-flash-lite");

    const systemPrompt = `You are an expert marketing AI. Generate ${outputCount} high-quality ${toolName} outputs.
- Be specific, actionable, and professional
- Match platform tone (social media: casual; B2B: formal; ads: punchy)
- Separate each variation with ---VARIATION---
- No placeholder text`;

    const userPrompt = input ||
      Object.entries(inputs || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");

    const response = await ai.generate({
      model,
      system: systemPrompt,
      prompt: userPrompt,
      config: {
        maxOutputTokens: 3000,
        temperature: 0.7,
      },
    });

    const content = response.text;

    // Split into variations
    const outputs = content.includes("---VARIATION---")
      ? content.split("---VARIATION---").map((s) => s.trim()).filter((s) => s.length > 20).slice(0, outputCount)
      : [content.trim()];

    // Save to Firestore history if userId provided
    if (userId) {
      try {
        await getFirestore().collection("generations").add({
          userId,
          toolId: toolSlug,
          toolName,
          input: inputs || { prompt: input },
          output: outputs.join("\n\n---\n\n"),
          outputType: "text",
          model: typeof model === "string" ? model : "gemini-2.5-flash",
          tokensUsed: response.usage?.totalTokens ?? 0,
          isFavorite: false,
          createdAt: FieldValue.serverTimestamp(),
        });
      } catch (e) {
        console.error("[Firestore] Failed to save generation:", e);
      }
    }

    return {
      outputs,
      success: true,
      model: typeof model === "string" ? model : "gemini-2.5-flash",
      tokensUsed: response.usage?.totalTokens ?? 0,
      toolSlug,
    };
  }
);

/**
 * Chat AI Flow — conversational AI for the Chat tab
 */
const chatAiFlow = ai.defineFlow(
  {
    name: "chatAi",
    inputSchema: z.object({
      userMessage: z.string(),
      conversationHistory: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional(),
      userId: z.string().optional(),
    }),
    outputSchema: z.object({
      response: z.string(),
      model: z.string(),
    }),
  },
  async ({ userMessage, conversationHistory, userId }) => {
    const systemPrompt = `You are MarketingTool AI — a marketing expert assistant.
Help users with marketing strategy, content creation, ad copy, SEO, social media, and campaign optimization.
Be practical, give specific examples, and suggest relevant tools from the app when appropriate.`;

    const messages = (conversationHistory || []).map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      content: [{ text: m.content }],
    }));

    const response = await ai.generate({
      model: googleAI.model("gemini-2.5-flash"),
      system: systemPrompt,
      messages: [...messages, { role: "user", content: [{ text: userMessage }] }],
      config: { maxOutputTokens: 2000, temperature: 0.8 },
    });

    // Save chat message to Firestore
    if (userId) {
      try {
        const db = getFirestore();
        const batch = db.batch();
        const sessionRef = db.collection("chat_sessions").doc(userId);
        batch.set(sessionRef, { userId, lastMessageAt: FieldValue.serverTimestamp() }, { merge: true });
        batch.set(db.collection("chat_messages").doc(), {
          userId, role: "user", content: userMessage, createdAt: FieldValue.serverTimestamp(),
        });
        batch.set(db.collection("chat_messages").doc(), {
          userId, role: "assistant", content: response.text, createdAt: FieldValue.serverTimestamp(),
        });
        await batch.commit();
      } catch (e) {
        console.error("[Firestore] Failed to save chat:", e);
      }
    }

    return { response: response.text, model: "gemini-2.5-flash" };
  }
);

// Export as callable Firebase Functions with App Check required
export const toolExecutor = onCallGenkit(
  {
    secrets: [googleGenaiApiKey],
    enforceAppCheck: true,
    authPolicy: hasClaim("sub"),
  },
  toolExecutorFlow
);

export const chatAi = onCallGenkit(
  {
    secrets: [googleGenaiApiKey],
    enforceAppCheck: true,
    authPolicy: hasClaim("sub"),
  },
  chatAiFlow
);

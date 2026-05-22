import gcpAuthService from './gcpAuthService';

const PROJECT_ID = 'marketing-tool-484720';
const REGION = 'us-central1'; // vertex ai region
const MODEL_ID = 'gemini-2.5-flash-lite';

export interface AdsAgentRequest {
  objective: string;
  context: string;
  url?: string;
}

export interface AdsAgentResponse {
  suggestions: string;
  campaignPlan: any;
  success: boolean;
  error?: string;
}

export const googleAdsAgent = {
  /**
   * Executes the Google Ads AI Agent using Vertex AI Gemini
   */
  async runAdsAnalysis(request: AdsAgentRequest): Promise<AdsAgentResponse> {
    try {
      const accessToken = await gcpAuthService.getGCPAccessToken();
      if (!accessToken) throw new Error('Failed to obtain Google Cloud access token');

      const endpoint = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL_ID}:streamGenerateContent`;

      const prompt = `
        You are an expert Google Ads Strategist.
        
        Objective: ${request.objective}
        Business Context: ${request.context}
        Target URL: ${request.url || 'N/A'}
        
        Analyze the provided data and provide:
        1. A deep link optimization strategy.
        2. High-converting Ad Copy variations (Headlines & Descriptions).
        3. Targeting recommendations.
        
        Format the response as a clear, actionable marketing plan.
      `;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Vertex AI API Error: ${errorData.error?.message || 'Unknown'}`);
      }

      // Handle streaming response (simplified for this implementation)
      const data = await response.json();
      const text = data[0]?.candidates[0]?.content?.parts[0]?.text || 'No response generated.';

      return {
        suggestions: text,
        campaignPlan: {},
        success: true
      };

    } catch (error: any) {
      console.error('[Ads Agent] Error:', error.message);
      return {
        suggestions: '',
        campaignPlan: null,
        success: false,
        error: error.message
      };
    }
  }
};

export default googleAdsAgent;

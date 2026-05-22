import auth from '@react-native-firebase/auth';

const PROJECT_ID = 'marketing-tool-484720';
const PROJECT_NUMBER = '911925145433';
const POOL_ID = 'firebase-expo-pool';
const PROVIDER_ID = 'firebase-expo-app';
const SERVICE_ACCOUNT = `ai-marketingtool-llc@${PROJECT_ID}.iam.gserviceaccount.com`;

export const gcpAuthService = {
  /**
   * Exchanges a Firebase ID Token for a Google Cloud Access Token
   * using Workload Identity Federation.
   */
  async getGCPAccessToken(): Promise<string | null> {
    try {
      // 1. Get current Firebase User and their ID Token (JWT)
      const user = auth().currentUser;
      if (!user) throw new Error('No authenticated Firebase user found');
      
      const idToken = await user.getIdToken();
      if (__DEV__) console.log('[GCP Auth] Retrieved Firebase ID Token');

      // 2. Exchange Firebase JWT for a Federated Token (STS)
      const stsResponse = await fetch(`https://sts.googleapis.com/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audience: `//iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/providers/${PROVIDER_ID}`,
          grantType: 'urn:ietf:params:oauth:grant-type:token-exchange',
          requestedTokenType: 'urn:ietf:params:oauth:token-type:access_token',
          scope: 'https://www.googleapis.com/auth/cloud-platform',
          subjectToken: idToken,
          subjectTokenType: 'urn:ietf:params:oauth:token-type:jwt',
        }),
      });

      const stsData = await stsResponse.json();
      if (!stsResponse.ok) throw new Error(`STS Exchange Failed: ${stsData.error_description || stsData.error}`);
      
      const federatedToken = stsData.access_token;

      // 3. Exchange Federated Token for a Service Account Access Token
      const iamResponse = await fetch(`https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${SERVICE_ACCOUNT}:generateAccessToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${federatedToken}`,
        },
        body: JSON.stringify({
          scope: ['https://www.googleapis.com/auth/cloud-platform'],
          lifetime: '3600s',
        }),
      });

      const iamData = await iamResponse.json();
      if (!iamResponse.ok) throw new Error(`IAM Token Generation Failed: ${iamData.error?.message || 'Unknown error'}`);

      if (__DEV__) console.log('[GCP Auth] Successfully generated Google Access Token');
      return iamData.accessToken;
    } catch (error: any) {
      console.error('[GCP Auth] Error:', error.message);
      return null;
    }
  }
};

export default gcpAuthService;

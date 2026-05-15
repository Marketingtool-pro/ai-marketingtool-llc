// @third-party
import { CognitoUserPool } from 'amazon-cognito-identity-js';

/***************************  AUTH CLIENT - AWS  ***************************/

export function createUserPool() {
  if (import.meta.env.VITE_APP_AWS_USER_POOL_ID && import.meta.env.VITE_APP_AWS_USER_POOL_WEB_CLIENT_ID) {
    return new CognitoUserPool({
      UserPoolId: import.meta.env.VITE_APP_AWS_USER_POOL_ID,
      ClientId: import.meta.env.VITE_APP_AWS_USER_POOL_WEB_CLIENT_ID
    });
  } else {
    console.log('[AWS Cognito] User Pool ID and Web Client ID are required.');
    return {};
  }
}

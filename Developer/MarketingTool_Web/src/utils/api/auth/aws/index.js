// @project
import { AUTH_USER_KEY } from '@/config';
import { AuthRole } from '@/enum';
import { createUserPool } from '@/utils/auth-client/aws';

// @third-party
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import axios from 'axios';

const userPool = createUserPool();

/***************************  AWS - LOGIN  ***************************/

export async function login(formData) {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = formData;

      // Create a CognitoUser instance for the user
      const user = new CognitoUser({
        Username: email,
        Pool: userPool
      });

      // Create authentication details with the provided email and password
      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password
      });

      // Authenticate the user using Cognito's `authenticateUser` method
      const session = await new Promise((resolve, reject) => {
        user.authenticateUser(authDetails, {
          onSuccess: (session) => resolve(session),
          onFailure: (err) => reject(err)
        });
      });

      // Extract the access token and id from the authenticated session
      const accessToken = session.getAccessToken().getJwtToken();
      const id = session.getAccessToken().decodePayload().sub;

      // Respond with user details and the access token
      resolve({
        id,
        email: email,
        access_token: accessToken // Access token from the session
      });
    } catch (error) {
      if (error instanceof Error) {
        reject(new Error(error.message || 'Authentication failed'));
        return;
      }
      reject(new Error('Server error'));
    }
  });
}

/***************************  AWS - GET USER  ***************************/

export async function getUser() {
  return new Promise(async (resolve, reject) => {
    try {
      const storedValue = typeof window !== 'undefined' ? localStorage.getItem(AUTH_USER_KEY) : null;
      const parsedValue = storedValue && JSON.parse(storedValue);

      if (parsedValue?.access_token) {
        const region = import.meta.env.VITE_APP_AWS_REGION;

        // Configure headers for the Cognito API request
        const config = {
          headers: {
            'Content-Type': 'application/x-amz-json-1.0',
            Authorization: `Bearer ${parsedValue.access_token}`,
            'X-Amz-Target': 'AWSCognitoIdentityProviderService.GetUser'
          }
        };

        // Make a POST request to Cognito's GetUser endpoint
        const response = await axios.post(`https://cognito-idp.${region}.amazonaws.com`, { AccessToken: parsedValue.access_token }, config);

        let userDetails = {};

        // Process the response if user attributes are available
        if (response?.data?.UserAttributes?.length > 0) {
          const data = await response.data.UserAttributes.reduce((acc, attr) => {
            acc[attr.Name] = attr.Value; // Map attribute names to their values
            return acc;
          }, {});

          // Map the retrieved data to a structured user details object
          userDetails = {
            id: data.sub, // Unique user ID
            email: data.email, // User email address
            role: AuthRole.USER, // User role (default: USER)
            contact: '123456789', // Placeholder for contact information
            dialcode: '+1', // Placeholder for dial code
            firstname: 'Bob', // Placeholder for first name
            lastname: 'Dylan' // Placeholder for last name
          };
        }

        resolve(userDetails);
      } else {
        reject(new Error('Token not found'));
      }
    } catch (error) {
      // Handle different types of errors
      if (axios.isAxiosError(error) && error.response) {
        // The request was made and the server responded with an error
        reject(new Error(error.response.data.message || error.response.statusText));
      } else if (error instanceof Error) {
        // Something happened while setting up the request
        reject(new Error(error.message || 'Server error'));
      } else {
        // Unexpected error case
        reject(new Error('Unknown error occurred'));
      }
    }
  });
}

/***************************  AWS - SIGN UP  ***************************/

export async function signUp(formData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Initiate the sign-up process using the Cognito User Pool
      await new Promise((resolve, reject) => {
        /*
         * Notes:
         * - Currently, custom attributes are not being used, so an empty array is passed.
         *   To enable custom attributes, you must add them to Amazon Cognito.
         *   For more details, refer to the documentation: https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#user-pool-settings-custom-attributes.
         */

        // userPool.signUp(formData.email, formData.password,[
        //   new CognitoUserAttribute({ Name: 'custom:firstname', Value: formData.firstname }),
        //   new CognitoUserAttribute({ Name: 'custom:lastname', Value: formData.lastname }),
        //   new CognitoUserAttribute({ Name: 'custom:dialcode', Value: formData.dialcode }),
        //   new CognitoUserAttribute({ Name: 'custom:contact', Value: formData.contact }),
        //   new CognitoUserAttribute({ Name: 'custom:role', Value: AuthRole.USER, }),
        // ], [], (err, result) => {})

        userPool.signUp(
          // User's email address
          formData.email, // User's password
          formData.password, // Array of user attributes (commented out for now)
          [], // Validation data (if any)
          [],
          (err, result) => {
            if (err) {
              reject(err);
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error('Something went wrong!')); // Handle unexpected case
            }
          }
        );
      });

      // Success
      resolve({ status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        reject(new Error(error.message || 'Server error'));
      } else {
        reject(new Error('Unknown error occurred'));
      }
    }
  });
}

/***************************  AWS - VERIFY OTP  ***************************/

export async function verifyOtp(formData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a CognitoUser instance for the user
      const user = new CognitoUser({ Username: formData.email, Pool: userPool });

      // Verify the OTP using Cognito's confirmRegistration method
      await new Promise((resolve, reject) => {
        user.confirmRegistration(formData.otp, true, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });

      // Success
      resolve({ status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        reject(new Error(error.message || 'Server error'));
      } else {
        reject(new Error('Unknown error occurred'));
      }
    }
  });
}

/***************************  AWS - RESEND OTP  ***************************/

export async function resend(formData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a CognitoUser instance for the user
      const user = new CognitoUser({
        Username: formData.email,
        Pool: userPool
      });

      // Resend the confirmation code using Cognito's resendConfirmationCode method
      await new Promise((resolve, reject) => {
        user.resendConfirmationCode((error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });

      // Success
      resolve({ status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        reject(new Error(error.message || 'Server error'));
      } else {
        reject(new Error('Unknown error occurred'));
      }
    }
  });
}

/***************************  AWS - FORGOT PASSWORD  ***************************/

export async function forgotPassword(formData) {
  return new Promise(async (resolve, reject) => {
    try {
      const { email } = formData;

      // Create a CognitoUser instance for the user
      const user = new CognitoUser({ Username: email, Pool: userPool });

      // Trigger the forgot password process using Cognito's forgotPassword method
      await new Promise((resolve, reject) => {
        user.forgotPassword({
          onSuccess: (data) => resolve(data),
          onFailure: (err) => reject(err)
        });
      });

      // Success
      resolve({ status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        reject(new Error(error.message || 'Server error'));
      } else {
        reject(new Error('Unknown error occurred'));
      }
    }
  });
}

/***************************  AWS - RESET PASSWORD  ***************************/

export async function resetPassword(formData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Parse the JSON body from the request
      const { email, otp, password } = formData;

      // Create a CognitoUser instance for the user
      const user = new CognitoUser({
        Username: email,
        Pool: userPool
      });

      // Reset the password using Cognito's confirmPassword method
      await new Promise((resolve, reject) => {
        user.confirmPassword(otp, password, {
          onSuccess: () => resolve(),
          onFailure: (err) => reject(err)
        });
      });

      // Success
      resolve({ status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        reject(new Error(error.message || 'Server error'));
      } else {
        reject(new Error('Unknown error occurred'));
      }
    }
  });
}

/***************************  AWS - SIGN OUT  ***************************/

export async function signOut() {
  return new Promise((resolve) => {
    resolve({ status: 200 });
  });
}

// Export as a single object for easy import
const awsAuth = { login, getUser, signUp, verifyOtp, resend, forgotPassword, resetPassword, signOut };

export default awsAuth;

import { OAuthProvider } from "appwrite";
import { appwriteAccount } from "@/utils/auth-client/appwrite";
import { AUTH_USER_KEY } from "@/config";

const SUCCESS_URL = `${window.location.origin}/social-auth-callback`;
const FAILURE_URL = `${window.location.origin}/login`;

/***************************  APPWRITE - GOOGLE LOGIN  ***************************/

export async function loginWithGoogle() {
  appwriteAccount.createOAuth2Session(OAuthProvider.Google, SUCCESS_URL, FAILURE_URL);
  // This redirects the browser — no return value
  return null;
}

/***************************  APPWRITE - FACEBOOK LOGIN  ***************************/

export async function loginWithFacebook() {
  appwriteAccount.createOAuth2Session(OAuthProvider.Facebook, SUCCESS_URL, FAILURE_URL);
  return null;
}

/***************************  APPWRITE - INSTAGRAM LOGIN  ***************************/

export async function loginWithInstagram() {
  appwriteAccount.createOAuth2Session(OAuthProvider.Instagram, SUCCESS_URL, FAILURE_URL);
  return null;
}

/***************************  APPWRITE - GET USER (after OAuth callback)  ***************************/

export async function getUser() {
  const user = await appwriteAccount.get();
  const jwtResponse = await appwriteAccount.createJWT();

  // Update localStorage with fresh JWT
  const stored = localStorage.getItem(AUTH_USER_KEY);
  const existing = stored ? JSON.parse(stored) : {};
  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify({
      ...existing,
      id: user.$id,
      email: user.email,
      access_token: jwtResponse.jwt,
    }),
  );

  return {
    id: user.$id,
    email: user.email,
    access_token: jwtResponse.jwt,
    firstname: user.name?.split(" ")[0] || "",
    lastname: user.name?.split(" ").slice(1).join(" ") || "",
    role: user.labels?.includes("admin") ? "admin" : "user",
  };
}

/***************************  APPWRITE - SIGN OUT  ***************************/

export async function signOut() {
  try {
    await appwriteAccount.deleteSession("current");
  } catch {
    // Session may already be expired
  }
  localStorage.removeItem(AUTH_USER_KEY);
  return { status: 200 };
}

const appwriteSocialAuth = {
  loginWithGoogle,
  loginWithFacebook,
  loginWithInstagram,
  getUser,
  signOut,
};
export default appwriteSocialAuth;

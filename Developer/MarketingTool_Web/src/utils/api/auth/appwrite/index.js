import { ID } from 'appwrite';
import { appwriteAccount } from '@/utils/auth-client/appwrite';
import { AUTH_USER_KEY } from '@/config';

/***************************  APPWRITE - LOGIN  ***************************/

export async function login(formData) {
  // Create email/password session
  await appwriteAccount.createEmailPasswordSession(formData.email, formData.password);

  // Get user data
  const user = await appwriteAccount.get();

  // Generate JWT for Windmill API calls
  const jwtResponse = await appwriteAccount.createJWT();

  return {
    id: user.$id,
    email: user.email,
    access_token: jwtResponse.jwt,
    firstname: user.name?.split(' ')[0] || '',
    lastname: user.name?.split(' ').slice(1).join(' ') || '',
    role: user.labels?.includes('admin') ? 'admin' : 'user'
  };
}

/***************************  APPWRITE - GET USER  ***************************/

export async function getUser() {
  const user = await appwriteAccount.get();
  const prefs = await appwriteAccount.getPrefs();

  // Refresh JWT on every getUser call to keep it valid
  const jwtResponse = await appwriteAccount.createJWT();
  const stored = localStorage.getItem(AUTH_USER_KEY);
  const existing = stored ? JSON.parse(stored) : {};
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify({
    ...existing,
    id: user.$id,
    email: user.email,
    access_token: jwtResponse.jwt
  }));

  return {
    id: user.$id,
    email: user.email,
    name: user.name || '',
    firstname: user.name?.split(' ')[0] || '',
    lastname: user.name?.split(' ').slice(1).join(' ') || '',
    role: user.labels?.includes('admin') ? 'admin' : 'user',
    contact: prefs.contact || user.phone || '',
    dialcode: prefs.dialCode || '+1',
    avatar: prefs.avatar || ''
  };
}

/***************************  APPWRITE - SIGN UP  ***************************/

export async function signUp(formData) {
  const name = [formData.firstname, formData.lastname].filter(Boolean).join(' ') || formData.email.split('@')[0];

  await appwriteAccount.create(ID.unique(), formData.email, formData.password, name);

  // Auto-login after sign up
  await appwriteAccount.createEmailPasswordSession(formData.email, formData.password);
  const user = await appwriteAccount.get();
  const jwtResponse = await appwriteAccount.createJWT();

  return {
    id: user.$id,
    email: user.email,
    access_token: jwtResponse.jwt,
    firstname: formData.firstname || '',
    lastname: formData.lastname || ''
  };
}

/***************************  APPWRITE - VERIFY OTP  ***************************/

export async function verifyOtp() {
  // Appwrite uses email verification links, not OTP codes
  return { status: 200 };
}

/***************************  APPWRITE - RESEND  ***************************/

export async function resend() {
  // Appwrite handles verification via email links
  return { status: 200 };
}

/***************************  APPWRITE - FORGOT PASSWORD  ***************************/

export async function forgotPassword(formData) {
  const redirectUrl = `${window.location.origin}/password-recovery`;
  await appwriteAccount.createRecovery(formData.email, redirectUrl);
  return { status: 200 };
}

/***************************  APPWRITE - RESET PASSWORD  ***************************/

export async function resetPassword(formData) {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId');
  const secret = params.get('secret');

  if (!userId || !secret) {
    throw new Error('Invalid recovery link. Please request a new password reset.');
  }

  await appwriteAccount.updateRecovery(userId, secret, formData.password);
  return { status: 200 };
}

/***************************  APPWRITE - SIGN OUT  ***************************/

export async function signOut() {
  try {
    await appwriteAccount.deleteSession('current');
  } catch {
    // Session may already be expired
  }
  localStorage.removeItem(AUTH_USER_KEY);
  return { status: 200 };
}

const appwriteAuth = { login, getUser, signUp, verifyOtp, resend, forgotPassword, resetPassword, signOut };
export default appwriteAuth;

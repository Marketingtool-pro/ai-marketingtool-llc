// @project
import { authProvider } from "./authProvider";
import { AUTH_CONFIG_KEY, AUTH_USER_KEY } from "@/config";
import { socialAuthProvider } from "./socialAuth/socialAuthProvider";
import { attempt } from "@/utils/attempt";
import { authConfigManager } from "@/utils/authConfigManager";

export async function login(formData) {
  localStorage.removeItem(AUTH_CONFIG_KEY);
  const authHandler = await authProvider();

  if (!authHandler.login) {
    return { data: null, error: "Login not supported by current provider" };
  }

  return attempt(authHandler.login(formData));
}

export async function signUp(formData) {
  localStorage.removeItem(AUTH_CONFIG_KEY);
  const authHandler = await authProvider();

  if (!authHandler.signUp) {
    return { data: null, error: "Sign-up not supported by current provider" };
  }

  return attempt(authHandler.signUp(formData));
}

export async function getUser() {
  let authHandler;
  const isSocial = authConfigManager.isSocialLogin();
  if (isSocial) {
    authHandler = await socialAuthProvider();
  } else {
    authHandler = await authProvider();
  }

  if (!authHandler) {
    return { data: null, error: "auth provider not configured" };
  }

  if (!authHandler.getUser) {
    return { data: null, error: "Get user not supported by current provider" };
  }

  return attempt(authHandler.getUser());
}

export async function forgotPassword(formData) {
  localStorage.removeItem(AUTH_CONFIG_KEY);
  const authHandler = await authProvider();

  if (!authHandler.forgotPassword) {
    return { data: null, error: "Forgot password not supported by current provider" };
  }

  return attempt(authHandler.forgotPassword(formData));
}

export async function resetPassword(formData) {
  localStorage.removeItem(AUTH_CONFIG_KEY);
  const authHandler = await authProvider();

  if (!authHandler.resetPassword) {
    return { data: null, error: "Reset password not supported by current provider" };
  }

  return attempt(authHandler.resetPassword(formData));
}

export async function verifyOtp(formData) {
  localStorage.removeItem(AUTH_CONFIG_KEY);
  const authHandler = await authProvider();

  if (!authHandler.verifyOtp) {
    return { data: null, error: "Verify OTP not supported by current provider" };
  }

  return attempt(authHandler.verifyOtp(formData));
}

export async function resendOtp(formData) {
  localStorage.removeItem(AUTH_CONFIG_KEY);
  const authHandler = await authProvider();

  if (!authHandler.resend) {
    return { data: null, error: "Resend OTP not supported by current provider" };
  }

  return attempt(authHandler.resend(formData));
}

export async function logout() {
  let authHandler;
  const isSocial = authConfigManager.isSocialLogin();
  if (isSocial) {
    authHandler = await socialAuthProvider();
  } else {
    authHandler = await authProvider();
  }

  if (!authHandler) {
    return { data: null, error: "auth provider not configured" };
  }

  if (!authHandler.signOut) {
    return { data: null, error: "SignOut functionality not available" };
  }

  await authHandler.signOut();
  localStorage.removeItem(AUTH_USER_KEY);
  window.location.pathname = "/login";
  return { data: { message: "Loggedout" }, error: null };
}

export async function loginWithGoogle() {
  const socialAuthHandler = await socialAuthProvider();

  if (socialAuthHandler) {
    if (!socialAuthHandler.loginWithGoogle) {
      return { data: null, error: "Login with Google not supported by current provider" };
    }

    return attempt(socialAuthHandler.loginWithGoogle());
  } else {
    return { data: null, error: "Social auth provider not configured" };
  }
}

export async function loginWithFacebook() {
  const socialAuthHandler = await socialAuthProvider();

  if (socialAuthHandler) {
    if (!socialAuthHandler.loginWithFacebook) {
      return { data: null, error: "Login with Facebook not supported by current provider" };
    }

    return attempt(socialAuthHandler.loginWithFacebook());
  } else {
    return { data: null, error: "Social auth provider not configured" };
  }
}

export async function loginWithInstagram() {
  const socialAuthHandler = await socialAuthProvider();

  if (socialAuthHandler) {
    if (!socialAuthHandler.loginWithInstagram) {
      return { data: null, error: "Login with Instagram not supported by current provider" };
    }

    return attempt(socialAuthHandler.loginWithInstagram());
  } else {
    return { data: null, error: "Social auth provider not configured" };
  }
}

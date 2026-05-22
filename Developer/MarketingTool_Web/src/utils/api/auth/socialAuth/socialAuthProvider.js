// @project
import { SOCIAL_AUTH_PROVIDER } from '@/config';

// Mapping of auth types to dynamic imports
const socialAuthProviderMapping = {
  supabase: () => import('@/utils/api/auth/socialAuth/supabase').then((mod) => mod.default),
  firebase: () => import('@/utils/api/auth/socialAuth/firebase').then((mod) => mod.default),
  appwrite: () => import('@/utils/api/auth/socialAuth/appwrite').then((mod) => mod.default)
};

// Dynamically loads and returns the auth provider based on SOCIAL_AUTH_PROVIDER.
export async function socialAuthProvider() {
  if (!SOCIAL_AUTH_PROVIDER) {
    return null; // or undefined
  }

  return await socialAuthProviderMapping[SOCIAL_AUTH_PROVIDER]();
}

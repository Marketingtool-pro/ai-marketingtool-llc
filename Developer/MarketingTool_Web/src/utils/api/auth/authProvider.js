// @project
import { AUTH_PROVIDER } from '@/config';

// Mapping of auth types to dynamic imports
const authProviderMapping = {
  mock: () => import('@/utils/api/auth/mock').then((mod) => mod.default),
  supabase: () => import('@/utils/api/auth/supabase').then((mod) => mod.default),
  aws: () => import('@/utils/api/auth/aws').then((mod) => mod.default),
  firebase: () => import('@/utils/api/auth/firebase').then((mod) => mod.default),
  jwt: () => import('@/utils/api/auth/jwt').then((mod) => mod.default),
  appwrite: () => import('@/utils/api/auth/appwrite').then((mod) => mod.default)
};

// Dynamically loads and returns the auth provider based on AUTH_PROVIDER.
export async function authProvider() {
  return await authProviderMapping[AUTH_PROVIDER]();
}

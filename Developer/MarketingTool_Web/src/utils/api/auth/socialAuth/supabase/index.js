import { createSupabaseClient } from '@/utils/auth-client/supabase';

const supabase = createSupabaseClient();

export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/oauth-callback`
    }
  });

  if (error) throw error;
  return data;
}

export async function loginWithFacebook() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/oauth-callback`
    }
  });

  if (error) throw error;
  return data;
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;

  return {
    id: data.user.id,
    email: data.user.email,
    firstname: data.user.user_metadata?.firstname || '',
    lastname: data.user.user_metadata?.lastname || ''
  };
}

export async function signOut() {
  await supabase.auth.signOut();
  return { status: 200 };
}

const supabaseSocialAuth = { loginWithGoogle, loginWithFacebook, getUser, signOut };
export default supabaseSocialAuth;

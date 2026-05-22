import { createSupabaseClient } from '@/utils/auth-client/supabase';

const supabase = createSupabaseClient();

export async function login(formData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password
  });

  if (error) throw error;

  return {
    id: data.user.id,
    email: data.user.email,
    access_token: data.session.access_token,
    firstname: data.user.user_metadata?.firstname || '',
    lastname: data.user.user_metadata?.lastname || ''
  };
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

export async function signUp(formData) {
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        firstname: formData.firstname,
        lastname: formData.lastname
      }
    }
  });

  if (error) throw error;

  return {
    id: data.user.id,
    email: data.user.email,
    access_token: data.session?.access_token
  };
}

export async function forgotPassword(formData) {
  const { error } = await supabase.auth.resetPasswordForEmail(formData.email);
  if (error) throw error;
  return { status: 200 };
}

export async function resetPassword(formData) {
  const { error } = await supabase.auth.updateUser({ password: formData.password });
  if (error) throw error;
  return { status: 200 };
}

export async function verifyOtp() {
  return { status: 200 };
}

export async function resend() {
  return { status: 200 };
}

export async function signOut() {
  await supabase.auth.signOut();
  return { status: 200 };
}

const supabaseAuth = { login, getUser, signUp, verifyOtp, resend, forgotPassword, resetPassword, signOut };
export default supabaseAuth;

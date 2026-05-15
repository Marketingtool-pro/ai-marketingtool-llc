// @third-party
import { createClient } from '@supabase/supabase-js';

/***************************  AUTH CLIENT - SUPABASE  ***************************/

export function createSupabaseClient() {
  if (import.meta.env.VITE_APP_SUPABASE_URL && import.meta.env.VITE_APP_SUPABASE_ANON_KEY) {
    return createClient(import.meta.env.VITE_APP_SUPABASE_URL, import.meta.env.VITE_APP_SUPABASE_ANON_KEY);
  } else {
    console.log('[Supabase] Missing environment variables. Client not configured.');
    return {};
  }
}

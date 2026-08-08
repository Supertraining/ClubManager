import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.error(
    '[supabase] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required. ' +
    'Add them to admin/.env and restart the dev server.',
  );
}

/**
 * Singleton Supabase client for the admin app. Same shape as the client app,
 * separate storage key so both apps can be signed in independently.
 */
export const supabase = createClient(
  SUPABASE_URL || 'http://invalid',
  SUPABASE_ANON_KEY || 'invalid',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'clubmanager.admin.auth',
    },
  },
);

export const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

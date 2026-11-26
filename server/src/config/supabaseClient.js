import { createClient } from '@supabase/supabase-js';
import { Logger } from '../utils/logger.js';
import { supabaseAnonKey, supabaseServiceRoleKey, supabaseUrl } from './config.js';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  Logger.level().error(
    'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required. ' +
    'See server/supabase/README.md for setup.',
  );
  // Don't crash the import in dev — let the user see the friendly error in the
  // first request instead of an obscure env-var error at boot.
}

/**
 * Admin client — uses the service_role key. Bypasses RLS.
 * Use ONLY on the server for trusted operations (e.g. background jobs,
 * admin-only endpoints that need to read/write any row).
 *
 * For per-user requests, use createUserClient(token) so RLS kicks in.
 */
export const supabaseAdmin = createClient(supabaseUrl || 'http://invalid', supabaseServiceRoleKey || 'invalid', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Create a client for a single request. A JWT enables RLS as the caller.
 * Without a JWT, use this client for public Auth operations.
 */
export const createUserClient = (accessToken) =>
  createClient(supabaseUrl || 'http://invalid', supabaseAnonKey || 'invalid', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {},
    },
  });

/**
 * Verify a JWT against Supabase Auth and return the user + profile.
 * Returns null if the token is invalid or the user is gone.
 */
export const verifyAccessToken = async (accessToken) => {
  if (!accessToken) return null;
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (error || !data?.user) return null;
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    if (profileError || !profile) return null;
    return profile;
  } catch (err) {
    Logger.level().error('Token verification failed', { code: err.code });
    return null;
  }
};

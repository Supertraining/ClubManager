import { createClient } from '@supabase/supabase-js';
import { Logger } from '../utils/logger.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
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
export const supabaseAdmin = createClient(SUPABASE_URL || 'http://invalid', SUPABASE_SERVICE_ROLE_KEY || 'invalid', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Create a per-request Supabase client that carries the user's JWT.
 * RLS policies in Postgres will then enforce what the user can do.
 */
export const createUserClient = (accessToken) =>
  createClient(SUPABASE_URL || 'http://invalid', process.env.SUPABASE_ANON_KEY || 'invalid', {
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
    return {
      ...data.user,
      ...profile,
      isAdmin: profile.role === 'admin',
    };
  } catch (err) {
    Logger.level().error('Token verification failed: ' + err.message);
    return null;
  }
};

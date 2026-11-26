import { randomBytes } from 'node:crypto';

async function findOrCreateUser(supabase, user) {
  const { data: profile, error: lookupError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', user.email)
    .maybeSingle();
  if (lookupError) throw lookupError;
  if (profile) return profile.id;

  const { data, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: randomBytes(18).toString('base64url') + 'Aa!9',
    email_confirm: true,
    user_metadata: {
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      phone: user.phone,
    },
  });
  if (error) throw error;
  return data.user.id;
}

export async function loadUsers(supabase, users) {
  const emailToId = new Map();

  for (const user of users) {
    const userId = await findOrCreateUser(supabase, user);
    if (user.role === 'admin') {
      const { error } = await supabase.rpc('promote_to_admin', { p_email: user.email });
      if (error) throw error;
    }
    emailToId.set(user.email, userId);
  }

  return Object.fromEntries(emailToId);
}

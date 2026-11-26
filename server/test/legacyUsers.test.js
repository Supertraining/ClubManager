import assert from 'node:assert/strict';

describe('historical member import', () => {
  it('preserves an admin assignment when retried after an incomplete import', async () => {
    const { loadUsers } = await import('../../migracion/02_etl/scripts/loadUsers.js');
    const users = [
      { email: 'legacy-admin@example.test', role: 'admin' },
      { email: 'legacy-member@example.test', role: 'socio' },
    ];
    const profiles = new Map();
    let failPromotion = true;

    const supabase = {
      from: () => ({
        select: () => ({
          eq: (_field, email) => ({
            maybeSingle: async () => ({ data: profiles.get(email) ?? null }),
          }),
        }),
      }),
      auth: { admin: { createUser: async ({ email, user_metadata }) => {
        assert.equal(Object.hasOwn(user_metadata, 'role'), false);
        assert.equal(profiles.has(email), false);
        const user = { id: `user-${profiles.size + 1}`, role: 'socio' };
        profiles.set(email, user);
        return { data: { user } };
      } } },
      rpc: async (_name, { p_email }) => {
        if (failPromotion) return { error: new Error('Temporary DB error') };
        profiles.get(p_email).role = 'admin';
        return {};
      },
    };

    await assert.rejects(loadUsers(supabase, users), /Temporary DB error/);
    failPromotion = false;
    const ids = await loadUsers(supabase, users);

    assert.deepEqual(profiles.get(users[0].email), { id: 'user-1', role: 'admin' });
    assert.deepEqual(profiles.get(users[1].email), { id: 'user-2', role: 'socio' });
    assert.equal(ids[users[0].email], 'user-1');
    assert.equal(ids[users[1].email], 'user-2');
  });
});

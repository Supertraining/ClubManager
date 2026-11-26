import assert from 'node:assert/strict';
import { request, testAccounts, setMembershipStatus } from './support/apiFixture.js';

describe('clubs', () => {
  it('resolves the club by explicit slug and keeps public aliases on Ranelagh', async () => {
    const unknown = await request('/clubs/no-existe');
    assert.equal(unknown.status, 404);

    const found = await request('/clubs/club-prueba');
    assert.equal(found.status, 200);
    assert.equal((await found.json()).slug, 'club-prueba');

    const legacy = await request('/users/getAll', { token: testAccounts.admin.token });
    assert.equal(legacy.status, 200);
  });

  it('uses the role for the selected club instead of the legacy profile role', async () => {
    const { token } = testAccounts.admin;
    const scoped = await request('/clubs/club-prueba/users/me', { token });
    assert.equal(scoped.status, 200);
    const profile = await scoped.json();
    assert.equal(profile.role, 'socio');
    assert.equal(profile.isAdmin, false);
    assert.equal((await request('/clubs/club-prueba/users/getAll', { token })).status, 403);
    assert.equal((await request('/clubs/ranelagh/users/getAll', { token })).status, 200);
  });

  it('checks live membership on every authenticated request', async () => {
    const { id, token } = testAccounts.admin;
    setMembershipStatus('club-prueba', id, 'suspended');
    try {
      assert.equal((await request('/clubs/club-prueba/users/me', { token })).status, 403);
      assert.equal((await request('/clubs/ranelagh/users/me', { token })).status, 200);
    } finally {
      setMembershipStatus('club-prueba', id, 'active');
    }
  });
});

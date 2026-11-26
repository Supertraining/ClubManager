import assert from 'node:assert/strict';
import { request, testAccounts } from './support/apiFixture.js';

describe('API baseline', () => {
  it('reports health through the server app', async () => {
    const response = await request('/health');

    assert.equal(response.status, 200);
    const health = await response.json();
    assert.equal(health.ok, true);
    assert.equal(typeof health.ts, 'number');
  });

  it('requires a session on a protected route', async () => {
    const response = await request('/users/me/reserves');

    assert.equal(response.status, 401);
  });

  it('returns the current member profile without credentials', async () => {
    const { id, token } = testAccounts.member;
    const response = await request(`/users/user/${id}`, { token });

    assert.equal(response.status, 200);
    const profile = await response.json();
    assert.equal(profile.id, id);
    assert.equal(profile.role, 'socio');
    assert.equal(Object.hasOwn(profile, 'password'), false);
  });
});

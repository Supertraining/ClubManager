import assert from 'node:assert/strict';
import { request, testAccounts } from './support/apiFixture.js';

describe('club checkout', () => {
  it('reports when the commercial offer has not been enabled', async () => {
    const response = await request('/billing/offer');
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { available: false });
  });

  it('requires a session before accepting a draft request', async () => {
    const response = await request('/billing/clubs', { method: 'POST' });
    assert.equal(response.status, 401);
  });

  it('keeps draft creation closed until an offer is configured', async () => {
    const response = await request('/billing/clubs', {
      method: 'POST',
      token: testAccounts.member.token,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Club de prueba',
        requestId: 'e57c9a78-cf43-4fce-8d2b-416fa1ec679d',
      }),
    });
    assert.equal(response.status, 503);
  });
});

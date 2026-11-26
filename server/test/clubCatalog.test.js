import assert from 'node:assert/strict';
import { request } from './support/apiFixture.js';

describe('club catalog', () => {
  it('returns the activity catalog for the selected club and the correct legacy alias', async () => {
    const secondClub = await request('/clubs/club-prueba/activities/getAll');
    assert.equal(secondClub.status, 200);
    assert.deepEqual((await secondClub.json()).map(activity => activity.name), ['Actividad de prueba B']);

    const legacy = await request('/activities/getAll');
    assert.equal(legacy.status, 200);
    assert.deepEqual((await legacy.json()).map(activity => activity.name), ['Actividad de prueba A']);
  });

  it('lists public courts for visitors without credentials', async () => {
    const response = await request('/clubs/club-prueba/courts');
    assert.equal(response.status, 200);
    const [court] = await response.json();
    assert.equal(court.slug, 'tenis-1');
    assert.deepEqual(court.durationOptionsMin, [60, 90, 120]);
  });
});

import assert from 'node:assert/strict';
import { request, testAccounts } from './support/apiFixture.js';

const administrativeRoutes = {
  users: [
    ['get', '/getAll'],
    ['delete', '/eliminar/:id'],
    ['put', '/update'],
  ],
  courts: [
    ['post', '/createCourt'],
    ['delete', '/delete/:id'],
    ['put', '/reserve/clean'],
  ],
  activities: [
    ['post', '/save'],
    ['put', '/update/:id'],
    ['delete', '/deleteById/:id'],
    ['delete', '/deleteAll'],
  ],
  events: [
    ['get', '/'],
    ['get', '/eventById/:id'],
    ['post', '/createEvent'],
    ['put', '/updateEvent'],
    ['delete', '/deleteById/:id'],
  ],
};

describe('permissions', () => {
  for (const [group, routes] of Object.entries(administrativeRoutes)) {
    it(`checks the admin role on the mounted ${group} management routes`, async () => {
      const { default: router } = await import(`../src/dependencies/${group}.js`);
      const { IsAdmin } = await import('../src/middlewares/isAdmin.js');

      for (const [method, path] of routes) {
        const index = router.stack.findIndex(layer => layer.route?.path === path && layer.route.methods[method]);
        assert.notEqual(index, -1, `${method.toUpperCase()} ${path} is mounted`);
        const sharedGuard = router.stack.slice(0, index).some(layer => layer.handle === IsAdmin.requireAdmin && layer.regexp.fast_slash);
        const routeGuard = router.stack[index].route.stack.slice(0, -1).some(layer => layer.handle === IsAdmin.requireAdmin);
        assert.ok(sharedGuard || routeGuard, `${method.toUpperCase()} ${path} checks admin before the controller`);
      }
    });
  }

  it('allows an administrator to load the roster', async () => {
    const response = await request('/users/getAll', { token: testAccounts.admin.token });

    assert.equal(response.status, 200);
    const profiles = await response.json();
    assert.ok(profiles.some(profile => profile.id === testAccounts.member.id));
  });

  it('keeps management data outside the member session', async () => {
    const { token } = testAccounts.member;

    assert.equal((await request('/users/getAll', { token })).status, 403);
    assert.equal((await request('/events', { token })).status, 403);
    assert.equal((await request('/events', { token: testAccounts.admin.token })).status, 200);
  });

  it('allows a member to consult their reservations', async () => {
    const response = await request('/users/me/reserves', { token: testAccounts.member.token });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), []);
  });

  it('allows unauthenticated visitors to consult the activity catalog', async () => {
    const response = await request('/activities/getAll');

    assert.equal(response.status, 200);
    assert.equal((await response.json())[0].name, 'Actividad de prueba A');
  });

  it('uses the unprivileged client for password sign-in', async () => {
    const response = await request('/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: testAccounts.member.email, password: 'fixture-password' }),
    });

    assert.equal(response.status, 200);
    assert.equal((await response.json()).token, testAccounts.member.token);
  });

  it('includes a request reference on access errors', async () => {
    const response = await request('/users/me/reserves');

    assert.equal(response.status, 401);
    assert.match(response.headers.get('X-Request-Id'), /^[\da-f-]{36}$/i);
  });

  it('sends informational emails without credentials', async () => {
    const { UserNotifications } = await import('../src/modules/users/helpers/emailNotifications.helper.js');
    const emails = [];
    const notifications = new UserNotifications({
      sendMail: async message => emails.push(message),
    });

    await notifications.emailNewUserNotification(testAccounts.member.email);
    await notifications.emailPasswordChangedNotification(testAccounts.member.email);

    assert.equal(emails.length, 2);
    for (const email of emails) {
      assert.equal(email.to, testAccounts.member.email);
      assert.equal(typeof email.text, 'string');
      assert.equal(Object.hasOwn(email, 'html'), false);
    }
  });
});

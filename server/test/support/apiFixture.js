import { once } from 'node:events';
import { createServer } from 'node:http';

export const testAccounts = {
  member: {
    id: '10000000-0000-4000-8000-000000000001',
    token: 'fixture-member-token',
    email: 'socio@example.test',
    role: 'socio',
  },
  admin: {
    id: '10000000-0000-4000-8000-000000000002',
    token: 'fixture-admin-token',
    email: 'admin@example.test',
    role: 'admin',
  },
};

const clubs = [
  { id: '90000000-0000-4000-8000-000000000001', slug: 'ranelagh', name: 'Club Ranelagh', signup_mode: 'open' },
  { id: '90000000-0000-4000-8000-000000000002', slug: 'club-prueba', name: 'Club de prueba', signup_mode: 'invitation' },
];
const statuses = new Map();

export function setMembershipStatus(slug, userId, status) {
  statuses.set(slug + ':' + userId, status);
}

async function listenLocally(handler) {
  const server = createServer(handler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');

  return {
    origin: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve());
    }),
  };
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function toProfile({ id, email, role }) {
  return { id, email, username: email, first_name: 'Muestra', last_name: 'Club', role };
}

function supabaseFixture(req, res) {
  const url = new URL(req.url, 'http://127.0.0.1');
  const accounts = Object.values(testAccounts);
  if (req.method === 'GET' && url.pathname === '/rest/v1/clubs') {
    const matches = clubs.filter(({ slug }) => url.searchParams.get('slug') === `eq.${slug}`);
    return sendJson(res, 200, matches);
  }
  if (req.method === 'GET' && url.pathname === '/rest/v1/club_memberships') {
    const club = clubs.find(({ id }) => url.searchParams.get('club_id') === `eq.${id}`);
    const userFilter = url.searchParams.get('user_id');
    const matches = !club ? [] : accounts.filter(({ id }) => !userFilter || userFilter === `eq.${id}`).map(account => ({
      user_id: account.id,
      role: club.slug === 'ranelagh' ? account.role : account.role === 'admin' ? 'socio' : 'admin',
      status: statuses.get(club.slug + ':' + account.id) ?? 'active',
      profile_overrides: {},
      profile: toProfile(account),
    })).filter(({ status }) => !url.searchParams.has('status') || url.searchParams.get('status') === `eq.${status}`);
    return sendJson(res, 200, matches);
  }
  if (req.method === 'GET' && url.pathname === '/auth/v1/user') {
    const actor = accounts.find(({ token }) => req.headers.authorization === `Bearer ${token}`);
    if (!actor) return sendJson(res, 401, { message: 'Invalid test session' });
    return sendJson(res, 200, { id: actor.id, email: actor.email });
  }
  if (req.method === 'GET' && url.pathname === '/rest/v1/profiles') {
    const profileFilter = url.searchParams.get('id');
    const matches = accounts
      .filter(({ id }) => !profileFilter || profileFilter === `eq.${id}`)
      .map(toProfile);
    const expectsObject = req.headers.accept === 'application/vnd.pgrst.object+json';
    return sendJson(res, 200, expectsObject ? matches[0] : matches);
  }
  if (req.method === 'GET' && url.pathname === '/rest/v1/activities') {
    const rows = clubs.map((club, index) => ({ club_id: club.id, name: index === 0 ? 'Actividad de prueba A' : 'Actividad de prueba B', category: [] }));
    return sendJson(res, 200, rows.filter(row => !url.searchParams.has('club_id') || url.searchParams.get('club_id') === `eq.${row.club_id}`));
  }
  if (req.method === 'GET' && url.pathname === '/rest/v1/courts') {
    const rows = clubs.map((club, index) => ({
      club_id: club.id,
      name: index === 0 ? 'futbol' : 'tenis-1',
      sport: index === 0 ? 'futbol' : 'tenis',
      display_name: index === 0 ? 'Fútbol' : 'Tenis',
      duration_options_min: [60, 90, 120],
      hours: [],
    }));
    return sendJson(res, 200, rows.filter(row => url.searchParams.get('club_id') === `eq.${row.club_id}`));
  }
  if (req.method === 'GET' && ['/rest/v1/events', '/rest/v1/reservations'].includes(url.pathname)) {
    return sendJson(res, 200, []);
  }
  if (req.method === 'POST' && url.pathname === '/auth/v1/token') {
    req.resume();
    if (req.headers.apikey !== 'fixture-anon-key') {
      return sendJson(res, 403, { message: 'Sign in must use the unprivileged API client' });
    }
    const { id, email, token } = testAccounts.member;
    return sendJson(res, 200, {
      user: { id, email },
      access_token: token,
      refresh_token: 'fixture-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
    });
  }
  return sendJson(res, 501, { message: 'Unexpected database call in test' });
}

let appListener;
let supabaseListener;
let previousEnv;

export const mochaHooks = {
  async beforeAll() {
    supabaseListener = await listenLocally(supabaseFixture);
    const testEnv = {
      NODE_ENV: 'test',
      SUPABASE_URL: supabaseListener.origin,
      SUPABASE_SERVICE_ROLE_KEY: 'fixture-service-role',
      SUPABASE_ANON_KEY: 'fixture-anon-key',
      GMAILUSER: '',
      GMAILPASS: '',
    };
    previousEnv = new Map(Object.keys(testEnv).map(key => [key, process.env[key]]));
    Object.assign(process.env, testEnv);

    const { createApp } = await import('../../src/app.js');
    const { default: router } = await import('../../src/dependencies/index.js');
    appListener = await listenLocally(createApp({ router }));
  },

  async afterAll() {
    await appListener?.close();
    await supabaseListener?.close();
    for (const [key, value] of previousEnv ?? []) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  },
};

export function request(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(new URL(path, appListener.origin), { ...options, headers });
}

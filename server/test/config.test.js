import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

function loadProductionConfig(anonKey) {
  const configUrl = new URL('../src/config/config.js', import.meta.url);
  return spawnSync(process.execPath, ['--input-type=module', '-e', `await import(${JSON.stringify(configUrl.href)})`], {
    env: {
      ...process.env,
      NODE_ENV: 'prod',
      SUPABASE_URL: 'http://127.0.0.1:1',
      SUPABASE_SERVICE_ROLE_KEY: 'fixture-service-role',
      SUPABASE_ANON_KEY: anonKey,
    },
    encoding: 'utf8',
  });
}

describe('production Supabase configuration', () => {
  it('reports a missing anon key during startup', () => {
    const result = loadProductionConfig('');

    assert.equal(result.status, 1);
    assert.match(result.stderr, /SUPABASE_ANON_KEY/);
  });

  it('loads production configuration from the process environment', () => {
    const result = loadProductionConfig('fixture-anon-key');

    assert.equal(result.status, 0, result.stderr);
  });
});

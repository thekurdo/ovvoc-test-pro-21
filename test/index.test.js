const assert = require('assert');
const app = require('../src/index');
const store = require('../src/store');

async function runTests() {
  const server = await new Promise(resolve => {
    const s = app.listen(0, () => resolve(s));
  });
  const port = server.address().port;
  const base = `http://localhost:${port}`;
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try { await fn(); passed++; }
    catch (err) { failed++; console.error(`FAIL: ${name} — ${err.message}`); }
  }

  store.products.reset();
  store.categories.reset();

  await test('GET /health', async () => {
    const r = await fetch(`${base}/health`);
    assert.strictEqual(r.status, 200);
  });

  await test('GET /api/products empty', async () => {
    const r = await fetch(`${base}/api/products`);
    assert.strictEqual(r.status, 200);
    const d = await r.json();
    assert.strictEqual(d.length, 0);
  });

  await test('POST /api/categories', async () => {
    const r = await fetch(`${base}/api/categories`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Electronics', description: 'Gadgets and devices' }),
    });
    assert.strictEqual(r.status, 201);
  });

  await test('POST /api/products', async () => {
    const r = await fetch(`${base}/api/products`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Laptop', price: 999.99, category: 'Electronics' }),
    });
    assert.strictEqual(r.status, 201);
    const d = await r.json();
    assert.strictEqual(d.name, 'Laptop');
  });

  await test('POST /api/products validation', async () => {
    const r = await fetch(`${base}/api/products`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.strictEqual(r.status, 400);
  });

  await test('GET /api/products/:id', async () => {
    const r = await fetch(`${base}/api/products/1`);
    assert.strictEqual(r.status, 200);
    const d = await r.json();
    assert.strictEqual(d.id, 1);
  });

  await test('GET /api/products lists all', async () => {
    const r = await fetch(`${base}/api/products`);
    const d = await r.json();
    assert.strictEqual(d.length, 1);
  });

  await test('PUT /api/products/:id', async () => {
    const r = await fetch(`${base}/api/products/1`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 899.99 }),
    });
    assert.strictEqual(r.status, 200);
    const d = await r.json();
    assert.strictEqual(d.price, 899.99);
  });

  await test('GET /api/categories/:id', async () => {
    const r = await fetch(`${base}/api/categories/1`);
    assert.strictEqual(r.status, 200);
  });

  await test('GET /api/search/* finds products', async () => {
    const r = await fetch(`${base}/api/search/Laptop`);
    assert.strictEqual(r.status, 200);
    const d = await r.json();
    assert.strictEqual(d.length, 1);
  });

  await test('GET /assets/* returns asset info', async () => {
    const r = await fetch(`${base}/assets/images/logo.png`);
    assert.strictEqual(r.status, 200);
  });

  await test('GET /docs/* returns docs', async () => {
    const r = await fetch(`${base}/docs/api/products`);
    assert.strictEqual(r.status, 200);
  });

  await test('DELETE /api/products/:id', async () => {
    const r = await fetch(`${base}/api/products/1`, { method: 'DELETE' });
    assert.strictEqual(r.status, 200);
  });

  await test('GET /unknown returns 404', async () => {
    const r = await fetch(`${base}/unknown`);
    assert.strictEqual(r.status, 404);
  });

  server.close();
  console.log(`${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => { console.error(err); process.exit(1); });

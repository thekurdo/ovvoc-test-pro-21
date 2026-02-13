const express = require('express');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');

const app = express();
app.use(express.json());

// Health with req.hostname (renamed in Express 5)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', host: req.hostname });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Search — wildcard /api/search/* (breaks in Express 5)
app.get('/api/search/{*path}', (req, res) => {
  const query = req.url.replace('/api/search/', '');
  const results = require('./store').products.search(decodeURIComponent(query));
  res.json(results);
});

// Static assets catch-all — /assets/* wildcard (breaks in Express 5)
app.get('/assets/{*path}', (req, res) => {
  res.json({ asset: req.url, type: 'placeholder' });
});

// API docs — /docs/* wildcard (breaks in Express 5)
app.get('/docs/{*path}', (req, res) => {
  res.json({ topic: req.url, content: 'API documentation' });
});

// 404 catch-all — bare * (breaks in Express 5)
app.all('{*path}', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

if (require.main === module) {
  app.listen(3000, () => console.log('Server on :3000'));
}

module.exports = app;

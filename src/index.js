const express = require('express');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');

const app = express();
app.use(express.json());

// Health with req.host (renamed in Express 5)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', host: req.host });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Search — wildcard /api/search/* (breaks in Express 5)
app.get('/api/search/*', (req, res) => {
  const query = req.url.replace('/api/search/', '');
  const results = require('./store').products.search(decodeURIComponent(query));
  res.json(results);
});

// Static assets catch-all — /assets/* wildcard (breaks in Express 5)
app.get('/assets/*', (req, res) => {
  res.json({ asset: req.url, type: 'placeholder' });
});

// API docs — /docs/* wildcard (breaks in Express 5)
app.get('/docs/*', (req, res) => {
  res.json({ topic: req.url, content: 'API documentation' });
});

// 404 catch-all — bare * (breaks in Express 5)
app.all('*', (req, res) => {
  res.json(404, { error: 'Not found' });
});

if (require.main === module) {
  app.listen(3000, () => console.log('Server on :3000'));
}

module.exports = app;

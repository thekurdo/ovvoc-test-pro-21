const { Router } = require('express');
const store = require('../store');
const router = Router();

// List or detail with optional id — :id? breaks in Express 5
router.get('/:id?', (req, res) => {
  if (req.params.id) {
    const product = store.products.getById(req.params.id);
    if (!product) return res.send(404);
    return res.json(product);
  }
  const filters = {};
  if (req.query.category) filters.category = req.query.category;
  if (req.query.minPrice) filters.minPrice = parseFloat(req.query.minPrice);
  res.json(store.products.getAll(filters));
});

// Create product
router.post('/', (req, res) => {
  const { name, price, category } = req.body;
  if (!name || !price) return res.json(400, { error: 'name and price required' });
  const product = store.products.create({ name, price: parseFloat(price), category: category || 'uncategorized' });
  res.status(201).json(product);
});

// Update product
router.put('/:id', (req, res) => {
  const product = store.products.update(req.params.id, req.body);
  if (!product) return res.send(404);
  res.json(product);
});

// Delete product
router.delete('/:id', (req, res) => {
  const removed = store.products.remove(req.params.id);
  if (!removed) return res.send(404);
  res.json({ deleted: true });
});

module.exports = router;

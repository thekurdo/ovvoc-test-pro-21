const { Router } = require('express');
const store = require('../store');
const router = Router();

// List or detail — :id? optional param
router.get('{/:id}', (req, res) => {
  if (req.params.id) {
    const cat = store.categories.getById(req.params.id);
    if (!cat) return res.sendStatus(404);
    return res.json(cat);
  }
  res.json(store.categories.getAll());
});

router.post('/', (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const cat = store.categories.create({ name, description: description || '' });
  res.status(201).json(cat);
});

module.exports = router;

const products = [];
const categories = [];
let nextProdId = 1;
let nextCatId = 1;

module.exports = {
  products: {
    getAll: (filters) => {
      let result = products.slice();
      if (filters && filters.category) result = result.filter(p => p.category === filters.category);
      if (filters && filters.minPrice) result = result.filter(p => p.price >= filters.minPrice);
      return result;
    },
    getById: (id) => products.find(p => p.id === parseInt(id)),
    create: (data) => {
      const p = { id: nextProdId++, ...data, createdAt: new Date().toISOString() };
      products.push(p);
      return p;
    },
    update: (id, updates) => {
      const p = products.find(p => p.id === parseInt(id));
      if (!p) return null;
      Object.assign(p, updates);
      return p;
    },
    remove: (id) => {
      const idx = products.findIndex(p => p.id === parseInt(id));
      if (idx === -1) return false;
      products.splice(idx, 1);
      return true;
    },
    search: (q) => products.filter(p => p.name.toLowerCase().includes(q.toLowerCase())),
    reset: () => { products.length = 0; nextProdId = 1; },
  },
  categories: {
    getAll: () => categories.slice(),
    getById: (id) => categories.find(c => c.id === parseInt(id)),
    create: (data) => {
      const c = { id: nextCatId++, ...data };
      categories.push(c);
      return c;
    },
    reset: () => { categories.length = 0; nextCatId = 1; },
  },
};

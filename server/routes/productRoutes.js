const express = require('express');
const router = express.Router();

const products = [
  { id: 1, name: 'Cotton T-Shirt', desc: 'Purple, White Stripes', price: 299, category: 'T-Shirts' },
  { id: 2, name: 'Cotton T-Shirt', desc: 'Deep Navy Blue', price: 199, category: 'T-Shirts' },
  { id: 3, name: 'Cotton T-Shirt', desc: 'Denim Blue and White', price: 299, category: 'T-Shirts' },
  { id: 4, name: 'Cotton T-Shirt', desc: 'Olive Green Stripes', price: 249, category: 'T-Shirts' },
  { id: 5, name: 'Cotton T-Shirt', desc: 'Black and White', price: 199, category: 'T-Shirts' },
  { id: 6, name: 'Cotton T-Shirt', desc: 'Navy Blue Stripes', price: 299, category: 'T-Shirts' },
];

router.get('/', (req, res) => {
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

module.exports = router;
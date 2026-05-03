const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── CONNECT MONGODB ───────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch((err) => console.log('MongoDB Error:', err));

// ─── USER SCHEMA ───────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// ─── ORDER SCHEMA ───────────────────────────────────────────
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      id: Number,
      name: String,
      desc: String,
      price: Number,
      qty: Number,
      image: String,
      brand: String
    }
  ],
  total: Number,
  status: { type: String, default: 'Processing' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// ─── PRODUCT SCHEMA ─────────────────────────────────────────
const productSchema = new mongoose.Schema({
  name: String,
  desc: String,
  price: Number,
  category: String,
  brand: String,
  size: [String],
  available: Boolean,
  image: String
});
const Product = mongoose.model('Product', productSchema);

// ─── JWT MIDDLEWARE ──────────────────────────────────────────
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ─── AUTH ROUTES ────────────────────────────────────────────

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    console.log('New user registered:', email);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please sign up first!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password. Please try again!' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    console.log('User logged in:', email);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET USER PROFILE
app.get('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE USER PROFILE
app.put('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true }
    ).select('-password');
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE USER
app.delete('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── PRODUCT ROUTES ─────────────────────────────────────────

// GET ALL PRODUCTS
app.get('/api/products', async (req, res) => {
  try {
    let products = await Product.find();

    // If no products in DB, return hardcoded ones
    if (products.length === 0) {
      products = [
        { id: 1, name: 'Classic Polo Shirt', desc: 'Purple & White Stripes', price: 299, category: 'Shirts', brand: 'Ralph Lauren', size: ['S', 'M', 'L', 'XL'], available: true, image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&q=80' },
        { id: 2, name: 'Navy Rugby Shirt', desc: 'Deep Navy Blue', price: 199, category: 'Shirts', brand: 'H&M', size: ['M', 'L', 'XL', '2X'], available: true, image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80' },
        { id: 3, name: 'Denim Casual Shirt', desc: 'Denim Blue & White', price: 299, category: 'Shirts', brand: 'Zara', size: ['XS', 'S', 'M', 'L'], available: true, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80' },
        { id: 4, name: 'Oversized Hoodie', desc: 'Olive Green Comfort', price: 499, category: 'Hoodies', brand: 'Nike', size: ['S', 'M', 'L', 'XL', '2X'], available: true, image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80' },
        { id: 5, name: 'Slim Fit Jeans', desc: 'Classic Black Denim', price: 599, category: 'Jeans', brand: 'Levis', size: ['S', 'M', 'L', 'XL'], available: true, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80' },
        { id: 6, name: 'Striped T-Shirt', desc: 'Navy Blue Stripes', price: 199, category: 'T-Shirts', brand: 'H&M', size: ['XS', 'S', 'M', 'L', 'XL'], available: true, image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&q=80' },
        { id: 7, name: 'Premium White Tee', desc: 'Clean White Essential', price: 149, category: 'T-Shirts', brand: 'Zara', size: ['XS', 'S', 'M', 'L', 'XL', '2X'], available: true, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
        { id: 8, name: 'Cargo Pants', desc: 'Khaki Old Money Style', price: 699, category: 'Old Money', brand: 'Ralph Lauren', size: ['S', 'M', 'L'], available: false, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80' },
        { id: 9, name: 'Zip Up Hoodie', desc: 'Charcoal Grey', price: 449, category: 'Hoodies', brand: 'Nike', size: ['M', 'L', 'XL', '2X'], available: true, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
        { id: 10, name: 'Linen Shirt', desc: 'Beige Old Money Look', price: 799, category: 'Old Money', brand: 'Ralph Lauren', size: ['S', 'M', 'L', 'XL'], available: true, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80' },
        { id: 11, name: 'Ripped Jeans', desc: 'Light Blue Distressed', price: 549, category: 'Jeans', brand: 'Levis', size: ['XS', 'S', 'M', 'L'], available: true, image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&q=80' },
        { id: 12, name: 'Graphic Tee', desc: 'Black Street Style', price: 249, category: 'T-Shirts', brand: 'Zara', size: ['S', 'M', 'L', 'XL', '2X'], available: true, image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80' },
      ];
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET SINGLE PRODUCT
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE PRODUCT (Admin)
app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE PRODUCT (Admin)
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE PRODUCT (Admin)
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── ORDER ROUTES ────────────────────────────────────────────

// CREATE ORDER
app.post('/api/orders', verifyToken, async (req, res) => {
  try {
    const { items, total } = req.body;
    const order = await Order.create({
      userId: req.userId,
      items,
      total,
      status: 'Processing'
    });
    console.log('New order created:', order._id);
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET USER ORDERS
app.get('/api/orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE ORDER STATUS
app.put('/api/orders/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE ORDER
app.delete('/api/orders/:id', verifyToken, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── START SERVER ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
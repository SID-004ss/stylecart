import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';

const allProducts = [
  {
    id: 1,
    name: 'Classic Polo Shirt',
    desc: 'Purple & White Stripes',
    price: 299,
    category: 'Shirts',
    brand: 'Ralph Lauren',
    size: ['S', 'M', 'L', 'XL'],
    available: true,
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&q=80'
  },
  {
    id: 2,
    name: 'Navy Rugby Shirt',
    desc: 'Deep Navy Blue',
    price: 199,
    category: 'Shirts',
    brand: 'H&M',
    size: ['M', 'L', 'XL', '2X'],
    available: true,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80'
  },
  {
    id: 3,
    name: 'Denim Casual Shirt',
    desc: 'Denim Blue & White',
    price: 299,
    category: 'Shirts',
    brand: 'Zara',
    size: ['XS', 'S', 'M', 'L'],
    available: true,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80'
  },
  {
    id: 4,
    name: 'Oversized Hoodie',
    desc: 'Olive Green Comfort',
    price: 499,
    category: 'Hoodies',
    brand: 'Nike',
    size: ['S', 'M', 'L', 'XL', '2X'],
    available: true,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80'
  },
  {
    id: 5,
    name: 'Slim Fit Jeans',
    desc: 'Classic Black Denim',
    price: 599,
    category: 'Jeans',
    brand: 'Levis',
    size: ['S', 'M', 'L', 'XL'],
    available: true,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80'
  },
  {
    id: 6,
    name: 'Striped T-Shirt',
    desc: 'Navy Blue Stripes',
    price: 199,
    category: 'T-Shirts',
    brand: 'H&M',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    available: true,
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&q=80'
  },
  {
    id: 7,
    name: 'Premium White Tee',
    desc: 'Clean White Essential',
    price: 149,
    category: 'T-Shirts',
    brand: 'Zara',
    size: ['XS', 'S', 'M', 'L', 'XL', '2X'],
    available: true,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'
  },
  {
    id: 8,
    name: 'Cargo Pants',
    desc: 'Khaki Old Money Style',
    price: 699,
    category: 'Old Money',
    brand: 'Ralph Lauren',
    size: ['S', 'M', 'L'],
    available: false,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80'
  },
  {
    id: 9,
    name: 'Zip Up Hoodie',
    desc: 'Charcoal Grey',
    price: 449,
    category: 'Hoodies',
    brand: 'Nike',
    size: ['M', 'L', 'XL', '2X'],
    available: true,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80'
  },
  {
    id: 10,
    name: 'Linen Shirt',
    desc: 'Beige Old Money Look',
    price: 799,
    category: 'Old Money',
    brand: 'Ralph Lauren',
    size: ['S', 'M', 'L', 'XL'],
    available: true,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80'
  },
  {
    id: 11,
    name: 'Ripped Jeans',
    desc: 'Light Blue Distressed',
    price: 549,
    category: 'Jeans',
    brand: 'Levis',
    size: ['XS', 'S', 'M', 'L'],
    available: true,
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&q=80'
  },
  {
    id: 12,
    name: 'Graphic Tee',
    desc: 'Black Street Style',
    price: 249,
    category: 'T-Shirts',
    brand: 'Zara',
    size: ['S', 'M', 'L', 'XL', '2X'],
    available: true,
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80'
  },
];

function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState(1000);
  const [showAvailable, setShowAvailable] = useState(false);
  const [cart, setCart] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});

  const categories = ['All', 'New', 'T-Shirts', 'Shirts', 'Old Money', 'Jeans', 'Hoodies'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2X'];
  const brands = ['All Brands', 'Nike', 'Zara', 'H&M', 'Ralph Lauren', 'Levis'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, [navigate]);

  const filteredProducts = allProducts.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'All' || selectedCategory === 'New' ||
      product.category === selectedCategory;
    const matchSize = selectedSize === '' || product.size.includes(selectedSize);
    const matchBrand = selectedBrand === '' || selectedBrand === 'All Brands' ||
      product.brand === selectedBrand;
    const matchPrice = product.price <= priceRange;
    const matchAvailable = !showAvailable || product.available === true;
    return matchSearch && matchCategory && matchSize && matchBrand && matchPrice && matchAvailable;
  });

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = existingCart.find(item => item.id === product.id);
    let updatedCart;
    if (existingItem) {
      updatedCart = existingCart.map(item =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updatedCart = [...existingCart, { ...product, qty: 1 }];
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    setAddedToCart({ ...addedToCart, [product.id]: true });
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [product.id]: false });
    }, 1500);
  };

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User' };

  return (
    <div className="products-container">

      {/* Navbar */}
      <nav className="products-navbar">
        <div className="nav-brand" onClick={() => navigate('/')}>
          STYLECART
        </div>
        <div className="nav-center">
          <a href="/">Home</a>
          <a href="/products">Collections</a>
          <span onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>New</span>
        </div>
        <div className="nav-icons">
          <span className="nav-icon" onClick={() => navigate('/profile')} title="Wishlist">🤍</span>
          <button className="cart-btn" onClick={() => navigate('/cart')}>
            🛒 Cart {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </button>
          <div className="user-avatar" onClick={() => navigate('/profile')}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </nav>

      <div className="products-body">

        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <div className="filter-header">
            <h3>Filters</h3>
            <button className="clear-btn" onClick={() => {
              setSelectedSize('');
              setSelectedBrand('');
              setPriceRange(1000);
              setShowAvailable(false);
              setSelectedCategory('All');
              setSearchTerm('');
            }}>Clear All</button>
          </div>

          {/* Size Filter */}
          <div className="filter-section">
            <h4>Size</h4>
            <div className="size-options">
              {sizes.map(size => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="filter-section">
            <h4>Availability</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showAvailable}
                onChange={(e) => setShowAvailable(e.target.checked)}
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-range">
              <input
                type="range"
                min="100"
                max="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="range-slider"
              />
              <div className="price-labels">
                <span>₹100</span>
                <span className="price-value">₹{priceRange}</span>
              </div>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="filter-section">
            <h4>Brand</h4>
            <div className="brand-options">
              {brands.map(brand => (
                <button
                  key={brand}
                  className={`brand-btn ${selectedBrand === brand ? 'active' : ''}`}
                  onClick={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <h4>Category</h4>
            <div className="category-filter-options">
              {['T-Shirts', 'Shirts', 'Hoodies', 'Jeans', 'Old Money'].map(cat => (
                <button
                  key={cat}
                  className={`brand-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? 'All' : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Main Products Area */}
        <div className="products-main">

          {/* Search and Category Pills */}
          <div className="products-top">
            <div className="search-bar">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search for clothes, brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <span className="clear-search" onClick={() => setSearchTerm('')}>✕</span>
              )}
            </div>
          </div>

          <div className="category-pills">
            {categories.map(cat => (
              <button
                key={cat}
                className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="results-info">
            <p className="breadcrumb">Home / Products</p>
            <h2>PRODUCTS</h2>
            <p className="results-count">{filteredProducts.length} items found</p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <span>😕</span>
              <p>No products found matching your filters</p>
              <button onClick={() => {
                setSelectedSize('');
                setSelectedBrand('');
                setPriceRange(1000);
                setShowAvailable(false);
                setSelectedCategory('All');
                setSearchTerm('');
              }}>Clear Filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=StyleCart';
                      }}
                    />
                    {!product.available && (
                      <div className="out-of-stock-badge">Out of Stock</div>
                    )}
                    {product.available && (
                      <div className="in-stock-badge">In Stock</div>
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-text">
                      <p className="product-brand">{product.brand}</p>
                      <p className="product-name">{product.name}</p>
                      <p className="product-desc">{product.desc}</p>
                      <div className="product-sizes">
                        {product.size.map(s => (
                          <span key={s} className="size-tag">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="product-bottom">
                      <p className="product-price">₹{product.price}</p>
                      <button
                        className={`add-cart-btn ${addedToCart[product.id] ? 'added' : ''}`}
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.available}
                      >
                        {addedToCart[product.id] ? '✓ Added!' : product.available ? '+ Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;